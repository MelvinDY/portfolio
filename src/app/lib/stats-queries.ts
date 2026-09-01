/**
 * Every SQL statement behind the /stats dashboard, in one place.
 *
 * These are plain strings with `$1` placeholders rather than tagged templates
 * on purpose: the route executes them through `sql.query(text, params)` and
 * ships the *same* string to the browser, so the query the dashboard shows you
 * is provably the query that produced the number next to it. A tagged template
 * would have to be re-typed for display, and a re-typed copy drifts.
 *
 * The timezone is inlined rather than parameterised — it is a fixed site-wide
 * constant, and reading `AT TIME ZONE 'Australia/Sydney'` beats reading
 * `AT TIME ZONE $2` when the point of the panel is to be read.
 */

import { TZ } from './analytics'

/** Strips the leading indentation this file needs but the display doesn't. */
function sql(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = strings.reduce((out, s, i) => out + s + (values[i] ?? ''), '')
  const lines = raw.replace(/^\n/, '').replace(/\s+$/, '').split('\n')
  const indent = Math.min(
    ...lines.filter(l => l.trim()).map(l => l.match(/^ */)![0].length),
  )
  return lines.map(l => l.slice(indent)).join('\n')
}

export interface StatQuery {
  /** Stable key — the dashboard maps panels to these. */
  id: string
  /** Panel-facing name. */
  title: string
  /** One line on how the metric is *defined*, not what it does. */
  note: string
  text: string
  params: unknown[]
}

export type RangeUnit = 'hour' | 'day'

export interface RangeSpec {
  days: number
  buckets: number
  unit: RangeUnit
}

export const RANGES: Record<string, RangeSpec> = {
  '24h': { days: 1, buckets: 24, unit: 'hour' },
  '7d': { days: 7, buckets: 7, unit: 'day' },
  '30d': { days: 30, buckets: 30, unit: 'day' },
  '90d': { days: 90, buckets: 90, unit: 'day' },
}

/**
 * Bucketed traffic. `offset` is in whole periods back from now — 0 is the
 * window on screen, 1 is the window before it, which is what the dashed
 * comparison line on the traffic chart is drawn from. Both share this builder
 * so the two lines can never be computed by subtly different SQL.
 *
 * `bounced` here is per bucket: a visitor who read exactly one page *that day*.
 * That is a narrower question than the KPI tile's period-wide bounce rate, and
 * the two are expected to disagree.
 */
function seriesQuery(unit: RangeUnit, buckets: number, offset: number): { text: string; params: unknown[] } {
  const step = unit === 'hour' ? 'hour' : 'day'
  const now = `date_trunc('${step}', now() AT TIME ZONE '${TZ}')`
  // Slot window: [now - (offset+1)·span + 1 step, now - offset·span].
  const shift = (n: number) => (n === 0 ? now : `${now} - (${n} * interval '1 ${step}')`)
  // Read far enough back to cover the oldest slot, plus one step of slack for
  // rows sitting on a boundary. A past window also gets an upper bound so the
  // scan does not drag the current period along with it.
  const lookback = (offset + 1) * buckets + 1
  // Indented to sit flush with the `AND event IS NULL` line it follows, so the
  // dedent pass below cannot mistake it for the block's outermost line.
  const upperBound =
    offset > 0 ? `\n          AND ts < now() - (${offset * buckets} * interval '1 ${step}')` : ''

  return {
    text: sql`
      WITH slots AS (
        SELECT generate_series(
          ${shift(offset * buckets + buckets - 1)},
          ${shift(offset * buckets)},
          interval '1 ${step}'
        ) AS t
      ),
      per_visitor AS (
        SELECT date_trunc('${step}', ts AT TIME ZONE '${TZ}') AS t,
               visitor_id,
               count(*) AS c
        FROM events
        WHERE ts >= now() - (${lookback} * interval '1 ${step}')
          AND event IS NULL${upperBound}
        GROUP BY 1, 2
      ),
      agg AS (
        SELECT t,
               sum(c)::int                       AS views,
               count(*)::int                     AS visitors,
               count(*) FILTER (WHERE c = 1)::int AS bounced
        FROM per_visitor
        GROUP BY t
      )
      SELECT to_char(slots.t, '${unit === 'hour' ? 'YYYY-MM-DD"T"HH24:MI' : 'YYYY-MM-DD'}') AS t,
             coalesce(agg.views, 0)::int    AS views,
             coalesce(agg.visitors, 0)::int AS visitors,
             coalesce(agg.bounced, 0)::int  AS bounced
      FROM slots
      LEFT JOIN agg ON agg.t = slots.t
      ORDER BY slots.t
    `,
    params: [],
  }
}

export function buildQueries(range: RangeSpec): StatQuery[] {
  const { days, buckets, unit } = range
  const series = seriesQuery(unit, buckets, 0)
  const prevSeries = seriesQuery(unit, buckets, 1)

  return [
    {
      id: 'totals',
      title: 'Headline totals',
      note: 'One row per visitor, then folded. A visitor with exactly one pageview in the window counts as bounced.',
      text: sql`
        WITH pv AS (
          SELECT visitor_id, count(*) AS c
          FROM events
          WHERE ts >= now() - ($1::int * interval '1 day')
            AND event IS NULL
          GROUP BY visitor_id
        )
        SELECT coalesce(sum(c), 0)::int          AS views,
               count(*)::int                     AS visitors,
               count(*) FILTER (WHERE c = 1)::int AS bounced
        FROM pv
      `,
      params: [days],
    },
    {
      id: 'prev',
      title: 'Previous period totals',
      note: 'The same fold over the window immediately before this one. This is what every "vs prev period" delta is measured against.',
      text: sql`
        WITH pv AS (
          SELECT visitor_id, count(*) AS c
          FROM events
          WHERE ts >= now() - ($1::int * 2 * interval '1 day')
            AND ts <  now() - ($1::int * interval '1 day')
            AND event IS NULL
          GROUP BY visitor_id
        )
        SELECT coalesce(sum(c), 0)::int          AS views,
               count(*)::int                     AS visitors,
               count(*) FILTER (WHERE c = 1)::int AS bounced
        FROM pv
      `,
      params: [days],
    },
    {
      id: 'series',
      title: 'Traffic over time',
      note: `Empty buckets are generated first and left-joined, so a quiet ${unit} is a zero on the chart rather than a gap in it.`,
      ...series,
    },
    {
      id: 'prevSeries',
      title: 'Traffic, previous period',
      note: 'Identical SQL shifted one window back. It draws the dashed comparison line, index for index.',
      ...prevSeries,
    },
    {
      id: 'heatmap',
      title: 'Rhythm',
      note: 'Views folded onto a weekday × hour grid. Sparse by nature: the shape is the point, not the totals.',
      text: sql`
        SELECT extract(dow  FROM ts AT TIME ZONE '${TZ}')::int AS dow,
               extract(hour FROM ts AT TIME ZONE '${TZ}')::int AS hour,
               count(*)::int                                   AS views
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND event IS NULL
        GROUP BY 1, 2
      `,
      params: [days],
    },
    {
      id: 'pages',
      title: 'Top pages',
      note: 'Raw pageviews, not visitors, so reloads and returns count. Paths are normalised at write time (query strings dropped, trailing slash stripped).',
      text: sql`
        SELECT path AS x, count(*)::int AS y
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND event IS NULL
        GROUP BY path
        ORDER BY y DESC
        LIMIT 8
      `,
      params: [days],
    },
    {
      id: 'referrers',
      title: 'Referrers',
      note: 'Distinct visitors, so one person arriving from LinkedIn five times is one referral. Same-site referrers are stored as NULL and read as "direct".',
      text: sql`
        SELECT coalesce(referrer_host, 'direct') AS x,
               count(DISTINCT visitor_id)::int   AS y
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND event IS NULL
        GROUP BY 1
        ORDER BY y DESC
        LIMIT 6
      `,
      params: [days],
    },
    {
      id: 'countries',
      title: 'Countries',
      note: 'Country comes from the edge request header, never from an IP lookup table. The IP itself is hashed and dropped.',
      text: sql`
        SELECT country AS x, count(DISTINCT visitor_id)::int AS y
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND country IS NOT NULL
        GROUP BY country
        ORDER BY y DESC
        LIMIT 8
      `,
      params: [days],
    },
    {
      id: 'devices',
      title: 'Devices',
      note: 'Bucketed from the user-agent at write time into desktop / mobile / tablet. No fingerprinting beyond that.',
      text: sql`
        SELECT device AS x, count(DISTINCT visitor_id)::int AS y
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND device IS NOT NULL
        GROUP BY device
        ORDER BY y DESC
      `,
      params: [days],
    },
    {
      id: 'browsers',
      title: 'Browsers',
      note: 'Same source as devices. Anything unrecognised lands in "Other" rather than being guessed at.',
      text: sql`
        SELECT browser AS x, count(DISTINCT visitor_id)::int AS y
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND browser IS NOT NULL
        GROUP BY browser
        ORDER BY y DESC
        LIMIT 5
      `,
      params: [days],
    },
    {
      id: 'live',
      title: 'Reading right now',
      note: 'Distinct visitors seen in the last five minutes. Ignores the selected range: "live" means live.',
      text: sql`
        SELECT count(DISTINCT visitor_id)::int AS n
        FROM events
        WHERE ts > now() - interval '5 minutes'
      `,
      params: [],
    },
    {
      id: 'countryCount',
      title: 'Countries reached',
      note: 'Distinct non-null country codes in the window.',
      text: sql`
        SELECT count(DISTINCT country)::int AS n
        FROM events
        WHERE ts >= now() - ($1::int * interval '1 day')
          AND country IS NOT NULL
      `,
      params: [days],
    },
  ]
}

/**
 * The live feed. Kept beside the dashboard queries so the wire panel can show
 * its SQL the same way every other panel does.
 *
 * `visitor_id` is compared against a hash recomputed for the current request —
 * it is never sent to the browser, only the boolean it produces.
 *
 * `who` is the one piece of linkage the feed does expose: a number that says
 * which of these rows are the same person walking the site, so the wire can
 * draw a session as one stroke. It is a rank over the returned rows only, so
 * it carries no meaning outside this payload and cannot be compared against
 * another poll's numbers — and the hash it is derived from still never leaves
 * the server.
 */
export const FEED_QUERY = sql`
  -- Narrowed first, then ranked: taking the window before the rank keeps who
  -- numbered 1..n within the payload, so it cannot leak how many people were
  -- on the site in the last 24 hours.
  WITH recent AS (
    SELECT ts, path, country, device, browser, visitor_id
    FROM events
    WHERE ts > now() - interval '24 hours'
      AND event IS NULL
    ORDER BY ts DESC
    LIMIT $2::int
  )
  -- Minute resolution, not second, and no per-row referrer. This feed lists
  -- people individually on a public page, and on a site this quiet a row is
  -- recognisable to anyone who already knew the visit was coming. The panel
  -- reads the same at a minute; what it loses is the ability to be watched.
  -- age is rounded with it, or the exact second is simply recoverable from
  -- the next field along. Every consumer of it is minute-scale or coarser:
  -- railGap is log-scaled, tier steps at 1h/6h, QUIET_S is 12m, SESSION_S 30m.
  -- The aggregate referrers panel is untouched -- hosts stay pooled into counts.
  --
  -- The live count rides along as an uncorrelated scalar subquery: Postgres
  -- evaluates it once for the whole statement, so the wire and the header badge
  -- cost one round trip between them rather than two on every poll.
  SELECT to_char(ts AT TIME ZONE '${TZ}', 'HH24:MI')     AS at,
         (round(extract(epoch FROM now() - ts) / 60)
           * 60)::int                                    AS age,
         path,
         country,
         device,
         browser,
         visitor_id = $1::text                           AS you,
         (dense_rank() OVER (ORDER BY visitor_id))::int  AS who,
         (SELECT count(DISTINCT visitor_id)::int
          FROM events
          WHERE ts > now() - interval '5 minutes')       AS live
  FROM recent
  ORDER BY ts DESC
`

/**
 * The hero's readout: everything the front page needs in one round trip.
 *
 * `rank` is the visitor's position among today's visitors ordered by first
 * sighting. Because visitor ids rotate at Sydney midnight, "today" is the only
 * window where that number is honest — across days the same person would be
 * counted again, so the hero says "today" and means it.
 */
export const PULSE_QUERY = sql`
  WITH today AS (
    SELECT visitor_id, min(ts) AS first_seen
    FROM events
    WHERE ts >= date_trunc('day', now() AT TIME ZONE '${TZ}') AT TIME ZONE '${TZ}'
      AND event IS NULL
    GROUP BY visitor_id
  )
  SELECT (SELECT count(DISTINCT visitor_id)::int
          FROM events
          WHERE ts > now() - interval '5 minutes')                       AS live,
         (SELECT count(*)::int
          FROM events
          WHERE ts >= date_trunc('day', now() AT TIME ZONE '${TZ}') AT TIME ZONE '${TZ}'
            AND event IS NULL)                                           AS views_today,
         (SELECT count(*)::int FROM today)                               AS visitors_today,
         CASE WHEN EXISTS (SELECT 1 FROM today WHERE visitor_id = $1::text)
              THEN (SELECT count(*)::int FROM today
                    WHERE first_seen <= (SELECT first_seen FROM today
                                         WHERE visitor_id = $1::text))
              ELSE (SELECT count(*)::int + 1 FROM today)
         END                                                             AS rank
`
