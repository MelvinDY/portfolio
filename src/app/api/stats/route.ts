import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/analytics'
import { RANGES, buildQueries, type StatQuery } from '@/app/lib/stats-queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Row = Record<string, unknown>

/**
 * Runs one registered query and records what it cost. All of them are issued
 * concurrently, so these timings overlap — each is the wall time of that
 * statement, not a slice of a serial budget. The dashboard says as much.
 */
async function run(sql: ReturnType<typeof db>, q: StatQuery) {
  const t0 = performance.now()
  const rows = (await sql.query(q.text, q.params)) as Row[]
  return {
    id: q.id,
    title: q.title,
    note: q.note,
    text: q.text,
    params: q.params,
    ms: Math.round((performance.now() - t0) * 10) / 10,
    rowCount: rows.length,
    rows,
  }
}

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  const requested = req.nextUrl.searchParams.get('range') ?? '30d'
  // Object.hasOwn, not `in`: `in` walks the prototype chain, so ?range=constructor
  // (or toString, or __proto__) passed the check and handed buildQueries the
  // Object constructor instead of a RangeSpec. Every field came back undefined
  // and the interval arithmetic became NaN, so the graceful fall-back to 30d
  // turned into a 502.
  const range = Object.hasOwn(RANGES, requested) ? requested : '30d'
  const spec = RANGES[range]

  try {
    const sql = db()
    const queries = buildQueries(spec)

    const t0 = performance.now()
    const results = await Promise.all(queries.map(q => run(sql, q)))
    const totalMs = Math.round((performance.now() - t0) * 10) / 10

    const byId = Object.fromEntries(results.map(r => [r.id, r]))
    const rows = <T>(id: string) => (byId[id]?.rows ?? []) as T[]
    const one = <T>(id: string) => rows<T>(id)[0]

    const t = one<{ views: number; visitors: number; bounced: number }>('totals')
    const p = one<{ views: number; visitors: number; bounced: number }>('prev')

    return NextResponse.json(
      {
        configured: true,
        range,
        unit: spec.unit,
        live: one<{ n: number }>('live')?.n ?? 0,
        countryCount: one<{ n: number }>('countryCount')?.n ?? 0,
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
        series: rows('series'),
        prevSeries: rows('prevSeries'),
        heatmap: rows('heatmap'),
        pages: rows('pages'),
        referrers: rows('referrers'),
        countries: rows('countries'),
        devices: rows('devices'),
        browsers: rows('browsers'),
        // The dashboard renders these verbatim next to the numbers they made.
        // Rows are stripped — the panels already have the data.
        sqlLog: results.map(({ rows: _rows, ...meta }) => meta),
        timing: { totalMs, queryCount: results.length },
      },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    )
  } catch (err) {
    console.error('[stats]', err)
    return NextResponse.json({ configured: true, error: 'Failed to load analytics' }, { status: 502 })
  }
}
