import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { db, isBot, parseDevice, referrerHost } from '@/app/lib/analytics'

export const runtime = 'nodejs'

const bodySchema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional(),
  utm_source: z.string().max(80).optional(),
  event: z.string().max(60).optional(),
})

// Cookieless visitor id: hash of (secret salt, UTC day, IP, UA).
// Rotates daily, so no cross-day tracking and nothing reversible is stored.
// The rotation day is Australia/Sydney so identity resets at the same
// midnight the dashboard buckets by, not mid-morning local time (UTC).
const sydneyDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Sydney',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function visitorId(ip: string, ua: string): string {
  const day = sydneyDay.format(new Date())
  return createHash('sha256')
    .update(`${process.env.ANALYTICS_SALT ?? 'dev'}:${day}:${ip}:${ua}`)
    .digest('hex')
    .slice(0, 16)
}

export async function POST(req: NextRequest) {
  const ok = new NextResponse(null, { status: 204 })

  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) return ok

    const ua = req.headers.get('user-agent')
    if (isBot(ua)) return ok

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '0.0.0.0'
    const country = req.headers.get('x-vercel-ip-country') ?? null
    const { device, browser, os } = parseDevice(ua!)
    const { path, referrer, utm_source, event } = parsed.data

    // Normalise: strip trailing slash (except root), drop query strings
    const cleanPath = (path.split('?')[0].replace(/\/+$/, '') || '/').slice(0, 200)

    const sql = db()
    await sql`
      INSERT INTO events (visitor_id, path, referrer_host, country, device, browser, os, utm_source, event)
      VALUES (
        ${visitorId(ip, ua!)}, ${cleanPath},
        ${referrerHost(referrer, req.nextUrl.hostname)},
        ${country}, ${device}, ${browser}, ${os},
        ${utm_source?.slice(0, 80) ?? null}, ${event ?? null}
      )
    `
  } catch (err) {
    console.error('[track]', err)
  }

  // Always 204 — tracking must never break the page
  return ok
}
