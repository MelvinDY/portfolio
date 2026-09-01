import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { clientIp, db, isBot, parseDevice, referrerHost, visitorId } from '@/app/lib/analytics'

export const runtime = 'nodejs'

/** Pageviews accepted per visitor per minute before writes are dropped. */
const MAX_PER_MINUTE = 30

const bodySchema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional(),
  utm_source: z.string().max(80).optional(),
  // Named events are emitted by our own code, so they can be held to a slug.
  event: z.string().max(60).regex(/^[a-z0-9_-]+$/i).optional(),
})

/**
 * What a path is allowed to look like once the query string is off it.
 *
 * This endpoint is open by necessity -- it is called from the browser on every
 * pageview, so it cannot be authenticated -- and whatever it stores is rendered
 * on the public /stats dashboard. React escapes it, so this was never an XSS
 * hole, but without a shape check anyone could POST 200 characters of prose and
 * watch it appear in the "top pages" panel. A route is a leading slash and
 * URL-safe segments; nothing else gets written.
 */
const PATH_RE = /^\/[A-Za-z0-9\-._~/%]*$/

/** Hostnames only: labels joined by dots, as `new URL().hostname` yields. */
const HOST_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i

export async function POST(req: NextRequest) {
  const ok = new NextResponse(null, { status: 204 })

  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) return ok

    const ua = req.headers.get('user-agent')
    if (isBot(ua)) return ok

    const ip = clientIp(req.headers)
    const country = req.headers.get('x-vercel-ip-country') ?? null
    const { device, browser, os } = parseDevice(ua!)
    const { path, referrer, utm_source, event } = parsed.data

    // Normalise: strip trailing slash (except root), drop query strings
    const cleanPath = (path.split('?')[0].replace(/\/+$/, '') || '/').slice(0, 200)
    if (!PATH_RE.test(cleanPath)) return ok

    // Same treatment for the referrer: referrerHost() already reduces it to a
    // hostname, but `new URL()` accepts plenty that no real referrer produces.
    const rHost = referrerHost(referrer, req.nextUrl.hostname)
    const cleanReferrer = rHost && HOST_RE.test(rHost) ? rHost : null

    const vid = visitorId(ip, ua!)

    // Cap writes per visitor per minute. This is an INSERT ... SELECT with a
    // guard rather than a separate check, so flood protection costs no extra
    // round trip on the hot path, and the count is index-backed by
    // events_visitor_ts_idx. MAX_PER_MINUTE is well above what real browsing
    // produces (client-side nav fires one row per route change).
    //
    // Caveat worth stating plainly: visitor_id is derived from IP *and* UA, so
    // a script rotating its user-agent still gets a fresh bucket each time.
    // This stops naive floods, not a determined attacker.
    // The casts are belt-and-braces, not a requirement: Postgres does infer
    // these parameters from the INSERT target columns (verified on 16). They
    // stay because a bare SELECT list is the one spot where that inference is
    // easy to lose track of if the column list is ever reordered.
    const sql = db()
    await sql`
      INSERT INTO events (visitor_id, path, referrer_host, country, device, browser, os, utm_source, event)
      SELECT
        ${vid}::text, ${cleanPath}::text,
        ${cleanReferrer}::text,
        ${country}::text, ${device}::text, ${browser}::text, ${os}::text,
        ${utm_source?.slice(0, 80) ?? null}::text, ${event ?? null}::text
      WHERE (
        SELECT count(*) FROM events
        WHERE visitor_id = ${vid}::text AND ts > now() - interval '1 minute'
      ) < ${MAX_PER_MINUTE}::int
    `
  } catch (err) {
    console.error('[track]', err)
  }

  // Always 204 — tracking must never break the page
  return ok
}
