"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Heatmap, { type HeatCell } from './heatmap'
import LiveWire from './live-wire'
import { SqlButton, SqlDrawer } from './sql-panel'
import {
  BAD, BRAND, BRAND_LOUD, C1, C2, CARD, COMPARE, FAINT, GOOD, HAIRLINE, INK, MUTED, SERIES_COLORS, SURFACE,
  compact, countryName, flag, fmt, type SqlMeta,
} from './theme'

/* ─── types ─── */
export type Point = { t: string; views: number; visitors: number; bounced: number }

export interface StatsData {
  configured: boolean
  error?: string
  range?: string
  unit?: 'hour' | 'day'
  live?: number
  totals?: { views: number; visitors: number; bounceRate: number; viewsPerVisitor: number }
  prev?: { views: number; visitors: number; bounceRate: number }
  series?: Point[]
  prevSeries?: Point[]
  heatmap?: HeatCell[]
  pages?: Array<{ x: string; y: number }>
  referrers?: Array<{ x: string; y: number }>
  countries?: Array<{ x: string; y: number }>
  devices?: Array<{ x: string; y: number }>
  browsers?: Array<{ x: string; y: number }>
  sqlLog?: SqlMeta[]
  timing?: { totalMs: number; queryCount: number }
}

const RANGES = [
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
] as const

/* ─── helpers ─── */
function tickLabel(t: string, unit: 'hour' | 'day') {
  const d = new Date(unit === 'hour' ? t : `${t}T00:00`)
  return unit === 'hour'
    ? d.toLocaleTimeString('en-AU', { hour: 'numeric' }).replace(' ', '')
    : d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
}

/** nice ceiling: 1/2/5 × 10^n */
function niceMax(v: number) {
  if (v <= 4) return 4
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  for (const m of [1, 2, 5, 10]) if (m * p >= v) return m * p
  return 10 * p
}

/* ─── layout hooks ─── */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return { ref, width: w }
}

/* ─── time series (views area + visitors line + dashed prior window) ─── */
export function TimeSeries({
  series, prevSeries, unit,
}: {
  series: Point[]
  prevSeries: Point[]
  unit: 'hour' | 'day'
}) {
  const { ref, width } = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const H = 280
  const M = { top: 12, right: 16, bottom: 28, left: 44 }
  const iw = Math.max(width - M.left - M.right, 0)
  const ih = H - M.top - M.bottom

  const n = series.length
  // The comparison line shares the scale, or the overlay would flatter itself.
  const hasPrev = prevSeries.length === n && prevSeries.some(d => d.views > 0)
  const yMax = niceMax(Math.max(
    ...series.map(d => Math.max(d.views, d.visitors)),
    ...(hasPrev ? prevSeries.map(d => d.views) : [0]),
    0,
  ))
  const x = (i: number) => M.left + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw)
  const y = (v: number) => M.top + ih - (v / yMax) * ih

  const path = (rows: Point[], key: 'views' | 'visitors') =>
    rows.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join('')
  const area = `${path(series, 'views')}L${x(n - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(yMax * f))
  const xTickEvery = Math.max(1, Math.ceil(n / (width < 560 ? 4 : 8)))

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const i = Math.round(((px - M.left) / Math.max(iw, 1)) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }, [iw, n, M.left])

  const h = hover != null ? series[hover] : null
  const hPrev = hover != null && hasPrev ? prevSeries[hover] : null
  const tooltipLeft = h && width > 0 ? Math.min(Math.max(x(hover!) + 14, M.left), width - 180) : 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label="Traffic over time: page views and unique visitors, against the previous period"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          style={{ display: 'block', touchAction: 'pan-y' }}
        >
          {/* gridlines — hairline, recessive */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke={HAIRLINE} strokeWidth={1} />
              <text x={M.left - 8} y={y(v) + 3} textAnchor="end" fill={FAINT} fontSize={10} fontFamily="var(--font-mono, monospace)">
                {compact(v)}
              </text>
            </g>
          ))}
          {/* x ticks — drop any modulo tick that would collide with the final label */}
          {series.map((d, i) => {
            const isLast = i === n - 1
            const show = isLast || (i % xTickEvery === 0 && n - 1 - i > xTickEvery * 0.6)
            return show ? (
              <text
                key={d.t}
                x={isLast ? x(i) + 6 : x(i)}
                y={H - 8}
                textAnchor={isLast ? 'end' : 'middle'}
                fill={FAINT}
                fontSize={10}
                fontFamily="var(--font-mono, monospace)"
              >
                {tickLabel(d.t, unit)}
              </text>
            ) : null
          })}
          {/* prior window first, so live data always sits on top of its own history */}
          {hasPrev && (
            <path
              d={path(prevSeries, 'views')}
              fill="none"
              stroke={COMPARE}
              strokeWidth={1.5}
              strokeDasharray="3 4"
              strokeLinejoin="round"
            />
          )}
          {/* views: 10% wash + 2px line */}
          <path d={area} fill={C1} opacity={0.1} />
          <path d={path(series, 'views')} fill="none" stroke={C1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* visitors: 2px line */}
          <path d={path(series, 'visitors')} fill="none" stroke={C2} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* crosshair + markers with surface ring */}
          {h && (
            <g>
              <line x1={x(hover!)} x2={x(hover!)} y1={M.top} y2={M.top + ih} stroke="rgba(20,18,15,0.30)" strokeWidth={1} />
              <circle cx={x(hover!)} cy={y(h.views)} r={4} fill={C1} stroke={SURFACE} strokeWidth={2} />
              <circle cx={x(hover!)} cy={y(h.visitors)} r={4} fill={C2} stroke={SURFACE} strokeWidth={2} />
            </g>
          )}
        </svg>
      )}

      {/* tooltip — one readout, every series; values lead */}
      {h && (
        <div className="chart-tooltip" style={{ left: tooltipLeft }}>
          <div style={{ color: FAINT, marginBottom: 6 }}>
            {unit === 'hour'
              ? new Date(h.t).toLocaleString('en-AU', { hour: 'numeric', minute: '2-digit' })
              : new Date(`${h.t}T00:00`).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="tt-row"><span className="tt-key" style={{ background: C1 }} /><strong>{fmt(h.views)}</strong>&nbsp;views</div>
          <div className="tt-row"><span className="tt-key" style={{ background: C2 }} /><strong>{fmt(h.visitors)}</strong>&nbsp;visitors</div>
          {hPrev && (
            <div className="tt-row"><span className="tt-key tt-key-dash" /><strong>{fmt(hPrev.views)}</strong>&nbsp;prev</div>
          )}
        </div>
      )}

      {/* screen-reader table — tooltip never gates */}
      <table className="sr-only">
        <caption>Traffic over time</caption>
        <thead><tr><th>Time</th><th>Views</th><th>Visitors</th><th>Views, previous period</th></tr></thead>
        <tbody>
          {series.map((d, i) => (
            <tr key={d.t}>
              <td>{d.t}</td><td>{d.views}</td><td>{d.visitors}</td><td>{hasPrev ? prevSeries[i].views : 'no data'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── bar list (nominal categories → single hue, value at row end) ─── */
export function BarList({
  items, format = (s: string) => s, emptyNote,
}: {
  items: Array<{ x: string; y: number }>
  format?: (x: string) => React.ReactNode
  emptyNote: string
}) {
  const max = Math.max(...items.map(i => i.y), 1)
  if (items.length === 0) return <div className="empty-note">{emptyNote}</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((item, i) => (
        <div key={`${item.x}-${i}`} className="bar-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 5 }}>
            <span className="bar-label">{format(item.x)}</span>
            <span className="bar-value">{fmt(item.y)}</span>
          </div>
          <div style={{ height: 6 }}>
            <div className="bar-fill" style={{ width: `${Math.max((item.y / max) * 100, 1.5)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── devices: single stacked bar, 2px surface gaps, legend ─── */
export function DeviceSplit({ devices }: { devices: Array<{ x: string; y: number }> }) {
  const order = ['desktop', 'mobile', 'tablet']
  const sorted = order.map(k => devices.find(d => d.x === k)).filter(Boolean) as Array<{ x: string; y: number }>
  const total = sorted.reduce((s, d) => s + d.y, 0)
  if (total === 0) return <div className="empty-note">No device data yet</div>
  return (
    <div>
      <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', gap: 2, background: SURFACE }}>
        {sorted.map((d, i) => (
          <div key={d.x} title={`${d.x}: ${fmt(d.y)} visitors`} style={{ width: `${(d.y / total) * 100}%`, minWidth: 4, background: SERIES_COLORS[i] }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
        {sorted.map((d, i) => (
          <div key={d.x} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: SERIES_COLORS[i], flexShrink: 0 }} />
            <span style={{ color: MUTED, textTransform: 'capitalize' }}>{d.x}</span>
            <span style={{ color: INK, fontFamily: 'var(--font-mono, monospace)', fontSize: 11 }}>
              {Math.round((d.y / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── page ─── */
export default function StatsPage() {
  const [range, setRange] = useState<string>('30d')
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const [liveNow, setLiveNow] = useState<number | null>(null)
  const [drawer, setDrawer] = useState<SqlMeta[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setRefetching(true)
    fetch(`/api/stats?range=${range}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setData({ configured: true, error: 'Failed to load analytics' }) })
      .finally(() => { if (!cancelled) { setLoading(false); setRefetching(false) } })
    return () => { cancelled = true }
  }, [range])

  const t = data?.totals
  const p = data?.prev
  const pct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null)
  const unit = data?.unit ?? (range === '24h' ? 'hour' : 'day')
  const hasAny = (t?.views ?? 0) > 0 || (p?.views ?? 0) > 0
  const live = liveNow ?? data?.live ?? 0

  /* SQL lookup — panels ask for their own statements by id. */
  const sqlById = useMemo(() => {
    const m = new Map<string, SqlMeta>()
    for (const q of data?.sqlLog ?? []) if (q.id) m.set(q.id, q)
    return m
  }, [data?.sqlLog])

  const openSql = useCallback((ids: string[]) => {
    const picked = ids.map(id => sqlById.get(id)).filter(Boolean) as SqlMeta[]
    if (picked.length) setDrawer(picked)
  }, [sqlById])

  const series = data?.series ?? []

  /* The four headline numbers. `delta` is null when there is no prior period to
     compare against, which the strip renders as words rather than a dash. */
  const readouts = t && p
    ? [
        { label: 'Views', value: compact(t.views), delta: pct(t.views, p.views), suffix: '%', upIsGood: true },
        { label: 'Visitors', value: compact(t.visitors), delta: pct(t.visitors, p.visitors), suffix: '%', upIsGood: true },
        { label: 'Bounce', value: `${t.bounceRate}%`, delta: p.visitors > 0 ? t.bounceRate - p.bounceRate : null, suffix: 'pp', upIsGood: false },
        { label: 'Views / visitor', value: `${t.viewsPerVisitor}`, delta: null, suffix: '', upIsGood: true },
      ]
    : []

  return (
    <div className="stats-page">
      <style>{css}</style>

      {/* header */}
      <header className="stats-header">
        <div className="wrap stats-header-in">
          <Link href="/" className="back-link">← MelvinDY</Link>
          <span className="microlabel" style={{ marginBottom: 0 }}>The Data Room</span>
          <span className="live-badge" title="Unique visitors in the last 5 minutes">
            <span className="live-dot" />
            {live} live
          </span>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 96 }}>
        {loading && (
          <div className="loading-note">measuring<span className="blink">_</span></div>
        )}

        {!loading && data && !data.configured && (
          <div className="center-note">
            <div className="microlabel" style={{ color: BRAND }}>Setup required</div>
            <p>Set <code>DATABASE_URL</code> and <code>ANALYTICS_SALT</code> in the environment to switch the analytics pipeline on.</p>
          </div>
        )}

        {!loading && data?.configured && data.error && (
          <div className="center-note">
            <div className="microlabel" style={{ color: BAD }}>Analytics unavailable</div>
            <p>Couldn&apos;t reach the database right now. Live data will return once the connection is restored.</p>
          </div>
        )}

        {!loading && data?.configured && t && !data.error && (
          <div style={{ opacity: refetching ? 0.55 : 1, transition: 'opacity 200ms ease' }}>
            {/* No hero. This is an instrument, not a landing page: the filter row
                doubles as the status line, and the first chart is above the fold. */}
            <div className="range-row rise">
              {RANGES.map(r => (
                <button
                  key={r.key}
                  className={`range-btn ${range === r.key ? 'on' : ''}`}
                  onClick={() => setRange(r.key)}
                >
                  {r.label}
                </button>
              ))}
              <span className="range-note">
                {data.timing
                  ? `${data.timing.queryCount} queries · ${data.timing.totalMs}ms · Australia/Sydney`
                  : 'Australia/Sydney'}
              </span>
            </div>

            {/* Headline numbers as a strip, not four cards: no elevation to earn.
                When the prior window is empty the absence is stated once below,
                not repeated in all four cells. */}
            <div className="ins-strip">
              {readouts.map(r => (
                <div className="ins-cell" key={r.label}>
                  <div className="ins-v">{r.value}</div>
                  <div className="ins-l">{r.label}</div>
                  <div
                    className="ins-d"
                    style={{ color: r.delta == null ? 'transparent' : (r.upIsGood ? r.delta >= 0 : r.delta <= 0) ? GOOD : BAD }}
                  >
                    {r.delta == null ? ' ' : `${r.delta >= 0 ? '+' : ''}${r.delta}${r.suffix}`}
                  </div>
                </div>
              ))}
            </div>
            {readouts.length > 0 && readouts.every(r => r.delta == null) && (
              <p className="ins-nocompare">
                Nothing in the preceding {RANGES.find(r => r.key === range)?.label.toLowerCase()} window to compare against, so no change is shown.
              </p>
            )}

            <div className="ins-grid">
              <section className="card ins-full rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Traffic</span>
                  <div className="head-right">
                    <div className="legend">
                      <span className="legend-item"><span className="legend-line" style={{ background: C1 }} />Views</span>
                      <span className="legend-item"><span className="legend-line" style={{ background: C2 }} />Visitors</span>
                      <span className="legend-item"><span className="legend-line legend-dash" />Prev</span>
                    </div>
                    <SqlButton onClick={() => openSql(['series', 'prevSeries'])} />
                  </div>
                </div>
                {series.length > 0 ? (
                  <TimeSeries series={series} prevSeries={data.prevSeries ?? []} unit={unit} />
                ) : (
                  <div className="empty-note">No traffic in this window yet</div>
                )}
              </section>

              <div className="ins-full">
                <LiveWire onLive={setLiveNow} onOpenSql={setDrawer} />
              </div>

              <section className="card rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Rhythm</span>
                  <div className="head-right">
                    <span className="unit-note">views · weekday × hour</span>
                    <SqlButton onClick={() => openSql(['heatmap'])} />
                  </div>
                </div>
                <Heatmap cells={data.heatmap ?? []} />
              </section>

              <section className="card rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Top pages</span>
                  <div className="head-right"><span className="unit-note">views</span><SqlButton onClick={() => openSql(['pages'])} /></div>
                </div>
                <BarList items={data.pages ?? []} emptyNote="No pageviews yet" />
              </section>

              <section className="card rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Referrers</span>
                  <div className="head-right"><span className="unit-note">visitors</span><SqlButton onClick={() => openSql(['referrers'])} /></div>
                </div>
                <BarList
                  items={data.referrers ?? []}
                  format={x => (x === 'direct' ? <em style={{ fontStyle: 'normal', color: FAINT }}>direct / none</em> : x)}
                  emptyNote="No referrers yet"
                />
              </section>

              <section className="card rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Countries</span>
                  <div className="head-right"><span className="unit-note">visitors</span><SqlButton onClick={() => openSql(['countries'])} /></div>
                </div>
                <BarList
                  items={data.countries ?? []}
                  format={code => <>{flag(code)}&nbsp;&nbsp;{countryName(code)}</>}
                  emptyNote="Geo data appears once deployed on Vercel"
                />
              </section>

              <section className="card ins-full rise">
                <div className="card-head">
                  <span className="microlabel" style={{ marginBottom: 0 }}>Devices &amp; browsers</span>
                  <div className="head-right"><span className="unit-note">visitors</span><SqlButton onClick={() => openSql(['devices', 'browsers'])} /></div>
                </div>
                <DeviceSplit devices={data.devices ?? []} />
                <div style={{ height: 24 }} />
                <BarList items={data.browsers ?? []} emptyNote="No browser data yet" />
              </section>
            </div>

            {!hasAny && (
              <div className="collecting rise">
                <span className="live-dot" style={{ position: 'static' }} />
                The pipeline is live and listening. Charts fill in as visits arrive.
              </div>
            )}

            <div className="foot-note">
              Built in-house · Next.js route handler to Neon Postgres · visitors are a salted
              hash that rotates every 24h · no cookies, no fingerprinting, nothing to consent to
            </div>
          </div>
        )}
      </main>

      {drawer && (
        <SqlDrawer queries={drawer} totalMs={data?.timing?.totalMs} onClose={() => setDrawer(null)} />
      )}
    </div>
  )
}

/* ─── styles ─── */
export const css = `
.stats-page {
  min-height: 100vh;
  background: ${SURFACE};
  color: ${INK};
  font-family: var(--font-space-grotesk, system-ui, sans-serif);
}
.wrap { max-width: 1200px; margin: 0 auto; padding-left: clamp(20px, 5vw, 56px); padding-right: clamp(20px, 5vw, 56px); }

.stats-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(243,243,241,0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid ${HAIRLINE};
}
.stats-header-in { display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 16px; }
.back-link { color: ${INK}; text-decoration: none; font-weight: 700; font-size: 15px; }
.back-link:hover { color: ${BRAND}; }

.microlabel {
  font-family: var(--font-mono, monospace);
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: ${MUTED}; margin-bottom: 10px;
}

.live-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.08em;
  color: ${MUTED}; border: 1px solid ${HAIRLINE}; border-radius: 999px; padding: 5px 12px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: ${BRAND_LOUD};
  animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
}
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }

.hero-title {
  font-size: clamp(34px, 6vw, 64px); font-weight: 700; line-height: 1.04;
  letter-spacing: -0.02em; margin: 0 0 18px;
}
.hero-sub { color: ${MUTED}; max-width: 560px; line-height: 1.65; font-size: 15px; margin: 0; }

.range-row { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
.range-btn {
  font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.1em;
  background: none; border: 1px solid transparent; border-radius: 3px;
  color: ${FAINT}; padding: 7px 14px; cursor: pointer; transition: color 150ms, border-color 150ms;
}
.range-btn:hover { color: ${INK}; }
.range-btn.on { color: ${BRAND}; border-color: rgba(193,62,0,0.45); }
.range-note { margin-left: auto; font-family: var(--font-mono, monospace); font-size: 10px; letter-spacing: 0.08em; color: ${FAINT}; }

/* ─── the instrument strip + grid ───
   The headline numbers share one hairline-divided plate rather than sitting in
   four separate cards: nothing here is elevated above anything else, so a 1px
   rule carries the grouping and the card shadow is not spent on it. */
.ins-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: ${HAIRLINE};
  border: 1px solid ${HAIRLINE}; border-radius: 6px; overflow: hidden;
  margin-bottom: 16px;
}
.ins-cell { background: ${CARD}; padding: 15px 18px 16px; }
.ins-v { font-size: 28px; font-weight: 700; line-height: 1.05; letter-spacing: -0.01em; }
.ins-l {
  font-family: var(--font-mono, monospace); font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: ${FAINT}; margin-top: 6px;
}
.ins-d { font-family: var(--font-mono, monospace); font-size: 10.5px; margin-top: 5px; min-height: 1em; }
.ins-nocompare {
  font-family: var(--font-mono, monospace); font-size: 10.5px; letter-spacing: 0.04em;
  color: ${FAINT}; margin: -6px 0 16px;
}
/* start, not stretch: a short panel ends where its content ends. Stretching it
   to match a taller neighbour only moves the empty space inside the card. */
.ins-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
.ins-full { grid-column: 1 / -1; }
@media (max-width: 900px) {
  .ins-strip { grid-template-columns: repeat(2, 1fr); }
  .ins-grid { grid-template-columns: 1fr; }
}
@media (max-width: 420px) { .ins-strip { grid-template-columns: 1fr; } }

.tile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
@media (max-width: 980px) { .tile-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 400px) { .tile-grid { grid-template-columns: 1fr; } }
.tile { background: ${CARD}; border: 1px solid ${HAIRLINE}; border-radius: 6px; padding: 18px 20px 20px; }
.tile-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 18px; }
.tile-mid { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
.tile-value { font-size: 36px; font-weight: 700; line-height: 1.05; letter-spacing: -0.01em; margin: 2px 0 8px; }
.tile-delta { font-family: var(--font-mono, monospace); font-size: 11px; }
.spark { margin-bottom: 12px; flex-shrink: 0; opacity: 0; animation: spark-in 700ms 200ms ease forwards; }
@keyframes spark-in { to { opacity: 1 } }

.card { background: ${CARD}; border: 1px solid ${HAIRLINE}; border-radius: 6px; padding: 22px 24px; }
.card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.head-right { display: flex; align-items: baseline; gap: 14px; }
.unit-note { font-family: var(--font-mono, monospace); font-size: 10px; color: ${FAINT}; letter-spacing: 0.08em; }

.legend { display: flex; gap: 16px; }
.legend-item { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: ${MUTED}; }
.legend-line { width: 14px; height: 2px; border-radius: 1px; }
.legend-dash {
  height: 0; border-top: 1.5px dashed ${COMPARE}; border-radius: 0;
}

/* ─── the [ sql ] affordance ─── */
.sql-btn {
  font-family: var(--font-mono, monospace); font-size: 10px; letter-spacing: 0.1em;
  background: none; border: none; padding: 0; cursor: pointer;
  color: ${FAINT}; transition: color 150ms;
}
.sql-btn:hover, .sql-btn:focus-visible { color: ${BRAND}; }

.sql-back {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(20,18,15,0.42); backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: fade 180ms ease both;
}
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
.sql-sheet {
  width: min(1080px, 100%); max-height: 86vh;
  display: flex; flex-direction: column;
  background: #F7F7F5; border: 1px solid rgba(20,18,15,0.14); border-bottom: none;
  border-radius: 10px 10px 0 0; padding: 22px clamp(18px, 4vw, 30px) 0;
  box-shadow: 0 -20px 60px rgba(20,18,15,0.18);
  animation: sheet-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes sheet-up { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }
.sql-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.sql-title { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.sql-x {
  background: none; border: 1px solid ${HAIRLINE}; border-radius: 5px;
  color: ${MUTED}; width: 30px; height: 30px; cursor: pointer; flex-shrink: 0;
  font-size: 13px; line-height: 1; transition: color 150ms, border-color 150ms;
}
.sql-x:hover { color: ${INK}; border-color: rgba(20,18,15,0.30); }
.sql-tabs { display: flex; gap: 4px; margin-top: 14px; flex-wrap: wrap; }
.sql-tab {
  font-family: var(--font-mono, monospace); font-size: 11px;
  background: none; border: 1px solid transparent; border-radius: 4px;
  color: ${FAINT}; padding: 6px 11px; cursor: pointer; transition: color 150ms, border-color 150ms;
}
.sql-tab:hover { color: ${INK}; }
.sql-tab.on { color: ${BRAND}; border-color: rgba(193,62,0,0.45); }
.sql-note { color: ${MUTED}; font-size: 13.5px; line-height: 1.6; margin: 14px 0 0; max-width: 74ch; }
.sql-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 16px 0 12px; }
.sql-chip {
  font-family: var(--font-mono, monospace); font-size: 10.5px; letter-spacing: 0.06em;
  color: ${MUTED}; border: 1px solid ${HAIRLINE}; border-radius: 999px; padding: 4px 11px;
}
.sql-copy {
  margin-left: auto; font-family: var(--font-mono, monospace); font-size: 10.5px;
  letter-spacing: 0.1em; background: none; border: 1px solid ${HAIRLINE}; border-radius: 4px;
  color: ${MUTED}; padding: 5px 12px; cursor: pointer; transition: color 150ms, border-color 150ms;
}
.sql-copy:hover { color: ${BRAND}; border-color: rgba(193,62,0,0.45); }
.sql-body { overflow: auto; flex: 1; margin: 0 -6px; padding: 0 6px; }
.sql-pre {
  margin: 0; font-family: var(--font-mono, monospace); font-size: 12.5px; line-height: 1.75;
  color: ${INK}; white-space: pre; min-width: max-content;
}
.sql-line { display: flex; }
.sql-ln {
  width: 2.4em; flex-shrink: 0; text-align: right; padding-right: 14px;
  color: rgba(20,18,15,0.22); user-select: none;
}
.sql-foot {
  border-top: 1px solid ${HAIRLINE}; margin: 0 -6px; padding: 14px 6px 18px;
  font-family: var(--font-mono, monospace); font-size: 10.5px; line-height: 1.8; color: ${FAINT};
}
.sql-foot code { color: ${MUTED}; }

/* ─── the wire ───
   A dispatch log on a real time axis: the vertical gap between two entries is
   proportional (log-scaled, in the component) to the gap between the two hits,
   so a burst clusters and a quiet night opens up. Mono is what the database
   saw; the serif italic is the page talking to you. */
.wire-card {
  --rail: rgba(20,18,15,0.13);
  --rail-visit: rgba(20,18,15,0.34);
  --sep: rgba(20,18,15,0.20);
  --row-pad: 13px;
}
.wire-head-right { display: flex; align-items: baseline; gap: 14px; }
.wire-you-note {
  font-family: var(--font-newsreader, Georgia, serif); font-style: italic;
  font-size: 12.5px; color: ${MUTED};
}

/* the poll, on screen */
.wire-pulse {
  position: relative; height: 1px; margin: -2px 0 18px;
  background: rgba(20,18,15,0.06); overflow: hidden;
}
.wire-tick {
  position: absolute; top: 0; bottom: 0; left: 0; width: 0;
  background: var(--sep); animation: wire-tick linear both;
}
@keyframes wire-tick { from { width: 0 } to { width: 100% } }
.wire-pulse.is-idle .wire-tick { animation: none; width: 100%; background: rgba(20,18,15,0.07); }

.wire { list-style: none; margin: 0; padding: 0; }
.wire-row {
  position: relative;
  display: grid;
  grid-template-columns: 58px 14px minmax(0, 1fr);
  column-gap: 12px;
  padding-top: var(--gap, 0px);
  padding-bottom: var(--row-pad);
}
.wire-t {
  font-family: var(--font-mono, monospace); font-size: 11px; line-height: 18px;
  color: ${FAINT}; font-variant-numeric: tabular-nums; white-space: nowrap;
}

/* the rail — ::before spans the proportional gap above the entry, ::after the
   entry itself, so the line stays continuous through the padding and the two
   halves can be styled apart when the gap is a lull. */
.wire-rail { position: relative; }
.wire-rail::before, .wire-rail::after {
  content: ''; position: absolute; left: 50%; width: 1px; margin-left: -0.5px;
  background: var(--rail);
}
.wire-rail::before { top: calc(-1 * var(--gap, 0px)); height: var(--gap, 0px); }
/* The rail cell is a grid item, so it stops at the row's content box — reach
   down through the row padding or the line breaks once per entry. */
.wire-rail::after { top: 0; bottom: calc(-1 * var(--row-pad)); }
.wire-row.is-quiet .wire-rail::before {
  background: linear-gradient(var(--rail) 45%, transparent 45%);
  background-size: 1px 5px;
}
/* One visit, drawn as one stroke. Listed after the lull rule on purpose and at
   matching specificity: a reader who pauses fifteen minutes and carries on is
   still one visit, so the stroke wins over the dotted gap. */
.wire-row.link-up .wire-rail::before,
.wire-row.link-down .wire-rail::after { background: var(--rail-visit); }
/* Last row fades out regardless — it may be linked to a row behind the fold. */
.wire-row:last-child .wire-rail::after { background: linear-gradient(var(--rail), transparent); }

.wire-node {
  position: absolute; left: 50%; top: 6px;
  width: 6px; height: 6px; margin-left: -3px; border-radius: 50%;
  background: ${FAINT};
}
.wire-row.is-you .wire-node { background: ${BRAND}; }
.wire-row.is-new .wire-node { animation: node-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes node-in { from { transform: scale(2.6); opacity: 0 } to { transform: none; opacity: 1 } }

.wire-quiet {
  position: absolute; left: 96px; top: calc(var(--gap, 0px) / 2);
  transform: translateY(-50%);
  font-family: var(--font-newsreader, Georgia, serif); font-style: italic;
  font-size: 12px; color: ${FAINT}; white-space: nowrap;
}

.wire-body { min-width: 0; }
.wire-path {
  display: block;
  font-family: var(--font-mono, monospace); font-size: 13px; font-weight: 500;
  line-height: 18px; letter-spacing: -0.01em; color: ${MUTED};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.wire-path.t-fresh { color: ${INK}; }
.wire-path.t-recent { color: #3E382F; }
.wire-row.is-new .wire-path { animation: path-in 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes path-in { from { opacity: 0; transform: translateX(-4px) } to { opacity: 1; transform: none } }

.wire-line2 { display: flex; align-items: baseline; gap: 12px; margin-top: 2px; }
.wire-meta {
  flex: 1; min-width: 0;
  font-family: var(--font-mono, monospace); font-size: 11px; color: ${FAINT};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.wire-meta > span:not(:first-child)::before {
  content: '·'; margin: 0 7px; color: rgba(20,18,15,0.22);
}
.wire-you {
  flex-shrink: 0;
  font-family: var(--font-newsreader, Georgia, serif); font-style: italic;
  font-size: 12.5px; color: ${BRAND};
}
.wire-age {
  flex-shrink: 0; font-family: var(--font-mono, monospace); font-size: 11px;
  color: ${FAINT}; font-variant-numeric: tabular-nums;
}

.wire-now .wire-node { background: ${BRAND}; animation: pulse 2s ease-in-out infinite; }
.wire-now-label {
  font-family: var(--font-newsreader, Georgia, serif); font-style: italic;
  font-size: 13px; line-height: 18px; color: ${MUTED};
}

.wire-foot {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  margin-top: 16px; font-family: var(--font-mono, monospace); font-size: 10px;
  letter-spacing: 0.08em; color: ${FAINT};
}
.wire-resume, .wire-more {
  font: inherit; letter-spacing: inherit; background: none; border: none;
  padding: 0; cursor: pointer; flex-shrink: 0;
}
.wire-resume { color: ${BRAND}; }
.wire-more { color: ${MUTED}; }
.wire-more:hover, .wire-more:focus-visible, .wire-resume:hover { color: ${BRAND}; }
.wire-more:focus-visible, .wire-resume:focus-visible { outline: 1px solid rgba(193,62,0,0.55); outline-offset: 3px; }
.wire-more-n { color: ${FAINT}; }

/* Narrow: the gutter tightens but nothing is dropped — the meta line wraps
   instead, so geo, client and referrer survive on a phone. */
@media (max-width: 620px) {
  .wire-row { grid-template-columns: 52px 12px minmax(0, 1fr); column-gap: 8px; }
  .wire-t { font-size: 10.5px; }
  .wire-quiet { left: 80px; }
  .wire-meta { white-space: normal; overflow: visible; }
  .wire-line2 { flex-wrap: wrap; row-gap: 2px; }
}

/* ─── rhythm heatmap ─── */
.heat-scroll { overflow-x: auto; padding-bottom: 4px; }
.heat {
  display: grid;
  grid-template-columns: 34px repeat(24, minmax(11px, 1fr));
  gap: 3px; min-width: 340px;
}
.heat-corner { }
.heat-hour, .heat-day {
  font-family: var(--font-mono, monospace); font-size: 9.5px; color: ${FAINT};
  display: flex; align-items: center;
}
.heat-hour { justify-content: center; padding-bottom: 4px; }
.heat-cell {
  aspect-ratio: 1; border-radius: 2px; background: rgba(20,18,15,0.05);
  min-height: 11px;
}
.heat-legend {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 14px; font-family: var(--font-mono, monospace); font-size: 10px; color: ${FAINT};
  flex-wrap: wrap;
}
.heat-scale { display: inline-flex; align-items: center; gap: 5px; }
.heat-scale i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
.heat-note { font-size: 11px; line-height: 1.6; margin: 12px 0 0; }

.chart-tooltip {
  position: absolute; top: 10px; pointer-events: none;
  background: #F7F7F5; border: 1px solid rgba(20,18,15,0.14); border-radius: 5px;
  padding: 10px 14px; font-family: var(--font-mono, monospace); font-size: 12px; color: ${INK};
  box-shadow: 0 8px 24px rgba(20,18,15,0.16); min-width: 140px; z-index: 10;
}
.tt-row { display: flex; align-items: center; margin-top: 3px; color: ${MUTED}; }
.tt-row strong { color: ${INK}; font-weight: 600; }
.tt-key { width: 10px; height: 2px; border-radius: 1px; margin-right: 8px; flex-shrink: 0; }
.tt-key-dash { height: 0; border-top: 1.5px dashed ${COMPARE}; }

.break-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }

.bar-label {
  font-family: var(--font-mono, monospace); font-size: 12px; color: ${MUTED};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
}
.bar-value { font-family: var(--font-mono, monospace); font-size: 12px; color: ${INK}; font-variant-numeric: tabular-nums; }
.bar-fill {
  height: 100%; background: ${C1};
  border-radius: 0 4px 4px 0; /* rounded data-end, square baseline */
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.bar-row:hover .bar-fill { filter: brightness(1.2); }
.bar-row:hover .bar-label { color: ${INK}; }

.empty-note, .loading-note { font-family: var(--font-mono, monospace); font-size: 12px; color: ${FAINT}; padding: 18px 0; }
.loading-note { text-align: center; padding: 120px 0; }
.blink { animation: blink 1s step-start infinite; }
@keyframes blink { 50% { opacity: 0 } }

.center-note { max-width: 520px; margin: 0 auto; padding: 100px 24px; text-align: center; }
.center-note p { color: ${MUTED}; line-height: 1.7; font-size: 14px; }
.center-note code { color: ${BRAND}; font-family: var(--font-mono, monospace); font-size: 13px; }

.collecting {
  display: flex; align-items: center; gap: 10px; justify-content: center;
  margin-top: 32px; font-family: var(--font-mono, monospace); font-size: 12px; color: ${MUTED};
}

.foot-note {
  margin-top: 56px; text-align: center;
  font-family: var(--font-mono, monospace); font-size: 11px; line-height: 1.8; color: ${FAINT};
  max-width: 620px; margin-left: auto; margin-right: auto;
}

.rise { animation: rise 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .rise, .spark, .sql-sheet, .sql-back { animation: none; }
  .spark { opacity: 1; }
  .live-dot { animation: none; }
  .bar-fill { transition: none; }
  .wire-row.is-new .wire-node,
  .wire-row.is-new .wire-path,
  .wire-now .wire-node { animation: none; }
  /* The hairline still marks the interval, it just stops sweeping it. */
  .wire-tick { animation: none; width: 100%; background: rgba(20,18,15,0.09); }
}
`
