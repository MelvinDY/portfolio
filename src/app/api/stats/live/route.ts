import { NextRequest, NextResponse } from 'next/server'
import { clientIp, db, visitorId } from '@/app/lib/analytics'
import { FEED_QUERY } from '@/app/lib/stats-queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIMIT = 24

interface FeedRow {
  at: string
  age: number
  path: string
  country: string | null
  device: string | null
  browser: string | null
  referrer_host: string | null
  you: boolean
  live: number
}

/**
 * The live wire: the most recent pageviews, anonymised, with the caller's own
 * rows flagged.
 *
 * The flag costs nothing to store. The visitor id is a salted daily hash of
 * (IP, user-agent), so recomputing it here for the requester and comparing
 * inside the query marks "you" without the hash ever leaving the server — the
 * browser only receives a boolean.
 */
export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  try {
    const ua = req.headers.get('user-agent') ?? ''
    const me = visitorId(clientIp(req.headers), ua)

    const t0 = performance.now()
    const rows = (await db().query(FEED_QUERY, [me, LIMIT])) as FeedRow[]
    const ms = Math.round((performance.now() - t0) * 10) / 10

    return NextResponse.json(
      {
        configured: true,
        live: rows[0]?.live ?? 0,
        // `live` is identical on every row; fold it away rather than repeating it.
        feed: rows.map(({ live: _live, ...row }) => row),
        sql: { text: FEED_QUERY, params: ['<your daily hash>', LIMIT], ms },
      },
      // Per-visitor by construction — a shared cache would hand one person's
      // "that's you" to the next reader.
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (err) {
    console.error('[stats/live]', err)
    return NextResponse.json({ configured: true, error: 'feed unavailable' }, { status: 502 })
  }
}
