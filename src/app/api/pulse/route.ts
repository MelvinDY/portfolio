import { NextRequest, NextResponse } from 'next/server'
import { clientIp, db, visitorId } from '@/app/lib/analytics'
import { PULSE_QUERY } from '@/app/lib/stats-queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The hero's readout — deliberately one query.
 *
 * The dashboard's /api/stats runs eleven; the front page must not. This is on
 * the critical path of every homepage visit, so it stays a single statement
 * that answers everything the HUD asks: who is here now, how busy today has
 * been, and where the caller sits in it.
 */
export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  // Geo comes from the edge headers Vercel attaches — no lookup, no storage.
  // City values arrive percent-encoded ("Ho%20Chi%20Minh%20City").
  const decode = (v: string | null) => {
    if (!v) return null
    try {
      return decodeURIComponent(v).slice(0, 40)
    } catch {
      return v.slice(0, 40)
    }
  }
  const city = decode(req.headers.get('x-vercel-ip-city'))
  const country = req.headers.get('x-vercel-ip-country')

  try {
    const ua = req.headers.get('user-agent') ?? ''
    const me = visitorId(clientIp(req.headers), ua)

    const rows = (await db().query(PULSE_QUERY, [me])) as Array<{
      live: number
      views_today: number
      visitors_today: number
      rank: number
    }>
    const r = rows[0]

    return NextResponse.json(
      {
        configured: true,
        live: r?.live ?? 0,
        viewsToday: r?.views_today ?? 0,
        visitorsToday: r?.visitors_today ?? 0,
        rank: r?.rank ?? 1,
        city,
        country,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (err) {
    console.error('[pulse]', err)
    // The hero degrades to its static plate — never a visible error.
    return NextResponse.json({ configured: true, error: 'pulse unavailable' }, { status: 200 })
  }
}
