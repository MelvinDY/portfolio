import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TZ = 'Australia/Sydney'

const RANGES: Record<string, { days: number; buckets: number; unit: 'hour' | 'day' }> = {
  '24h': { days: 1, buckets: 24, unit: 'hour' },
  '7d': { days: 7, buckets: 7, unit: 'day' },
  '30d': { days: 30, buckets: 30, unit: 'day' },
  '90d': { days: 90, buckets: 90, unit: 'day' },
}

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  const range = RANGES[req.nextUrl.searchParams.get('range') ?? '30d'] ? (req.nextUrl.searchParams.get('range') ?? '30d') : '30d'
  const { days, buckets, unit } = RANGES[range]

  try {
    const sql = db()

    const totalsQ = sql`
      WITH pv AS (
        SELECT visitor_id, count(*) AS c
        FROM events
        WHERE ts >= now() - ${days} * interval '1 day' AND event IS NULL
        GROUP BY visitor_id
      )
      SELECT coalesce(sum(c), 0)::int AS views,
             count(*)::int AS visitors,
             count(*) FILTER (WHERE c = 1)::int AS bounced
      FROM pv
    `

    const prevQ = sql`
      WITH pv AS (
        SELECT visitor_id, count(*) AS c
        FROM events
        WHERE ts >= now() - ${days * 2} * interval '1 day'
          AND ts < now() - ${days} * interval '1 day'
          AND event IS NULL
        GROUP BY visitor_id
      )
      SELECT coalesce(sum(c), 0)::int AS views,
             count(*)::int AS visitors,
             count(*) FILTER (WHERE c = 1)::int AS bounced
      FROM pv
    `

    const seriesQ =
      unit === 'hour'
        ? sql`
          WITH slots AS (
            SELECT generate_series(
              date_trunc('hour', now() AT TIME ZONE ${TZ}) - interval '23 hours',
              date_trunc('hour', now() AT TIME ZONE ${TZ}),
              interval '1 hour'
            ) AS t
          ),
          agg AS (
            SELECT date_trunc('hour', ts AT TIME ZONE ${TZ}) AS t,
                   count(*) FILTER (WHERE event IS NULL)::int AS views,
                   count(DISTINCT visitor_id)::int AS visitors
            FROM events
            WHERE ts >= now() - interval '24 hours'
            GROUP BY 1
          )
          SELECT to_char(slots.t, 'YYYY-MM-DD"T"HH24:MI') AS t,
                 coalesce(agg.views, 0)::int AS views,
                 coalesce(agg.visitors, 0)::int AS visitors
          FROM slots LEFT JOIN agg ON agg.t = slots.t
          ORDER BY slots.t
        `
        : sql`
          WITH slots AS (
            SELECT generate_series(
              date_trunc('day', now() AT TIME ZONE ${TZ}) - ${buckets - 1} * interval '1 day',
              date_trunc('day', now() AT TIME ZONE ${TZ}),
              interval '1 day'
            ) AS t
          ),
          agg AS (
            SELECT date_trunc('day', ts AT TIME ZONE ${TZ}) AS t,
                   count(*) FILTER (WHERE event IS NULL)::int AS views,
                   count(DISTINCT visitor_id)::int AS visitors
            FROM events
            WHERE ts >= now() - ${days + 1} * interval '1 day'
            GROUP BY 1
          )
          SELECT to_char(slots.t, 'YYYY-MM-DD') AS t,
                 coalesce(agg.views, 0)::int AS views,
                 coalesce(agg.visitors, 0)::int AS visitors
          FROM slots LEFT JOIN agg ON agg.t = slots.t
          ORDER BY slots.t
        `

    const pagesQ = sql`
      SELECT path AS x, count(*)::int AS y
      FROM events
      WHERE ts >= now() - ${days} * interval '1 day' AND event IS NULL
      GROUP BY path ORDER BY y DESC LIMIT 8
    `

    const referrersQ = sql`
      SELECT coalesce(referrer_host, 'direct') AS x, count(DISTINCT visitor_id)::int AS y
      FROM events
      WHERE ts >= now() - ${days} * interval '1 day' AND event IS NULL
      GROUP BY 1 ORDER BY y DESC LIMIT 6
    `

    const countriesQ = sql`
      SELECT country AS x, count(DISTINCT visitor_id)::int AS y
      FROM events
      WHERE ts >= now() - ${days} * interval '1 day' AND country IS NOT NULL
      GROUP BY country ORDER BY y DESC LIMIT 8
    `

    const devicesQ = sql`
      SELECT device AS x, count(DISTINCT visitor_id)::int AS y
      FROM events
      WHERE ts >= now() - ${days} * interval '1 day' AND device IS NOT NULL
      GROUP BY device ORDER BY y DESC
    `

    const browsersQ = sql`
      SELECT browser AS x, count(DISTINCT visitor_id)::int AS y
      FROM events
      WHERE ts >= now() - ${days} * interval '1 day' AND browser IS NOT NULL
      GROUP BY browser ORDER BY y DESC LIMIT 5
    `

    const liveQ = sql`
      SELECT count(DISTINCT visitor_id)::int AS n
      FROM events
      WHERE ts > now() - interval '5 minutes'
    `

    const [totals, prev, series, pages, referrers, countries, devices, browsers, live] =
      await Promise.all([totalsQ, prevQ, seriesQ, pagesQ, referrersQ, countriesQ, devicesQ, browsersQ, liveQ])

    const t = totals[0] as { views: number; visitors: number; bounced: number }
    const p = prev[0] as { views: number; visitors: number; bounced: number }

    return NextResponse.json(
      {
        configured: true,
        range,
        live: (live[0] as { n: number }).n,
        totals: {
          views: t.views,
          visitors: t.visitors,
          bounceRate: t.visitors > 0 ? Math.round((t.bounced / t.visitors) * 100) : 0,
          viewsPerVisitor: t.visitors > 0 ? +(t.views / t.visitors).toFixed(1) : 0,
        },
        prev: {
          views: p.views,
          visitors: p.visitors,
          bounceRate: p.visitors > 0 ? Math.round((p.bounced / p.visitors) * 100) : 0,
        },
        series,
        pages,
        referrers,
        countries,
        devices,
        browsers,
      },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    )
  } catch (err) {
    console.error('[stats]', err)
    return NextResponse.json({ configured: true, error: 'Failed to load analytics' }, { status: 502 })
  }
}
