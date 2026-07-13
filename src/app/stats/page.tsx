"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── palette (validated: dataviz six-checks, dark surface #09090b) ─── */
const SURFACE = '#09090b'
const CARD = '#101014'
const HAIRLINE = 'rgba(255,255,255,0.08)'
const INK = '#f2eae0'
const MUTED = '#9c9ca6'
const FAINT = '#5c5c66'
const BRAND = '#ff5e1f' // chrome accent (text-safe, 6.5:1)
const C1 = '#ea580c' // series 1 — views
const C2 = '#3b82f6' // series 2 — visitors
const C3 = '#059669' // series 3
const GOOD = '#34d399'
const BAD = '#f87171'
const SERIES_COLORS = [C1, C2, C3]

/* ─── types ─── */
interface StatsData {
  configured: boolean
  error?: string
  range?: string
  live?: number
  totals?: { views: number; visitors: number; bounceRate: number; viewsPerVisitor: number }
  prev?: { views: number; visitors: number; bounceRate: number }
  series?: Array<{ t: string; views: number; visitors: number }>
  pages?: Array<{ x: string; y: number }>
  referrers?: Array<{ x: string; y: number }>
  countries?: Array<{ x: string; y: number }>
  devices?: Array<{ x: string; y: number }>
  browsers?: Array<{ x: string; y: number }>
}

const RANGES = [
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
] as const

/* ─── helpers ─── */
const fmt = (n: number) => n.toLocaleString('en-AU')
const compact = (n: number) =>
  n >= 10000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : fmt(n)

function countryName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

function flag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return ''
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1f1e6 + c.charCodeAt(0) - 65))
}

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

/* ─── stat tile ─── */
function StatTile({
  label, value, delta, deltaSuffix = '%', upIsGood = true, index,
}: {
  label: string
  value: string
  delta?: number | null
  deltaSuffix?: string
  upIsGood?: boolean
  index: number
}) {
  const good = delta != null && (upIsGood ? delta >= 0 : delta <= 0)
  return (
    <div className="tile rise" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="microlabel">{label}</div>
      <div className="tile-value">{value}</div>
      <div className="tile-delta" style={{ color: delta == null ? FAINT : good ? GOOD : BAD }}>
        {delta == null ? '—' : `${delta >= 0 ? '+' : ''}${delta}${deltaSuffix} vs prev period`}
      </div>
    </div>
  )
}

/* ─── time series (views area + visitors line, crosshair tooltip) ─── */
function TimeSeries({ series, unit }: { series: Array<{ t: string; views: number; visitors: number }>; unit: 'hour' | 'day' }) {
  const { ref, width } = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const H = 280
  const M = { top: 12, right: 16, bottom: 28, left: 44 }
  const iw = Math.max(width - M.left - M.right, 0)
  const ih = H - M.top - M.bottom

  const n = series.length
  const yMax = niceMax(Math.max(...series.map(d => Math.max(d.views, d.visitors)), 0))
  const x = (i: number) => M.left + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw)
  const y = (v: number) => M.top + ih - (v / yMax) * ih

  const line = (key: 'views' | 'visitors') =>
    series.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join('')
  const area = `${line('views')}L${x(n - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(yMax * f))
  const xTickEvery = Math.max(1, Math.ceil(n / (width < 560 ? 4 : 8)))

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const i = Math.round(((px - M.left) / Math.max(iw, 1)) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }, [iw, n, M.left])

  const h = hover != null ? series[hover] : null
  const tooltipLeft = h && width > 0 ? Math.min(Math.max(x(hover!) + 14, M.left), width - 170) : 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label="Traffic over time: page views and unique visitors"
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
          {/* views: 10% wash + 2px line */}
          <path d={area} fill={C1} opacity={0.1} />
          <path d={line('views')} fill="none" stroke={C1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* visitors: 2px line */}
          <path d={line('visitors')} fill="none" stroke={C2} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* crosshair + markers with surface ring */}
          {h && (
            <g>
              <line x1={x(hover!)} x2={x(hover!)} y1={M.top} y2={M.top + ih} stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
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
        </div>
      )}

      {/* screen-reader table — tooltip never gates */}
      <table className="sr-only">
        <caption>Traffic over time</caption>
        <thead><tr><th>Time</th><th>Views</th><th>Visitors</th></tr></thead>
        <tbody>
          {series.map(d => (
            <tr key={d.t}><td>{d.t}</td><td>{d.views}</td><td>{d.visitors}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── bar list (nominal categories → single hue, value at row end) ─── */
function BarList({
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
            <div
              className="bar-fill"
              style={{ width: `${Math.max((item.y / max) * 100, 1.5)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── devices: single stacked bar, 2px surface gaps, legend ─── */
function DeviceSplit({ devices }: { devices: Array<{ x: string; y: number }> }) {
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
  const unit = range === '24h' ? 'hour' : 'day'
  const hasAny = (t?.views ?? 0) > 0 || (p?.views ?? 0) > 0

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
            {data?.live ?? 0} live
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
            {/* hero */}
            <div className="rise" style={{ marginBottom: 44 }}>
              <div className="microlabel" style={{ color: BRAND, marginBottom: 14 }}>
                first-party · cookieless · anonymised daily
              </div>
              <h1 className="hero-title">
                Who&apos;s been reading<br /><span style={{ color: BRAND }}>the work.</span>
              </h1>
              <p className="hero-sub">
                Every number on this page comes from an analytics pipeline built into this site —
                a 60-line tracker, a Postgres table, and SQL. No third parties, no cookies.
              </p>
            </div>

            {/* filter row — scopes everything below */}
            <div className="range-row rise" style={{ animationDelay: '40ms' }}>
              {RANGES.map(r => (
                <button
                  key={r.key}
                  className={`range-btn ${range === r.key ? 'on' : ''}`}
                  onClick={() => setRange(r.key)}
                >
                  {r.label}
                </button>
              ))}
              <span className="range-note">Australia/Sydney</span>
            </div>

            {/* KPI row */}
            <div className="tile-grid">
              <StatTile index={0} label="Page views" value={compact(t.views)} delta={pct(t.views, p!.views)} />
              <StatTile index={1} label="Unique visitors" value={compact(t.visitors)} delta={pct(t.visitors, p!.visitors)} />
              <StatTile index={2} label="Bounce rate" value={`${t.bounceRate}%`} delta={p!.visitors > 0 ? t.bounceRate - p!.bounceRate : null} deltaSuffix="pp" upIsGood={false} />
              <StatTile index={3} label="Views / visitor" value={`${t.viewsPerVisitor}`} delta={null} />
            </div>

            {/* traffic chart */}
            <section className="card rise" style={{ animationDelay: '120ms', marginBottom: 20 }}>
              <div className="card-head">
                <span className="microlabel" style={{ marginBottom: 0 }}>Traffic</span>
                <div className="legend">
                  <span className="legend-item"><span className="legend-line" style={{ background: C1 }} />Views</span>
                  <span className="legend-item"><span className="legend-line" style={{ background: C2 }} />Visitors</span>
                </div>
              </div>
              {data.series && data.series.length > 0 ? (
                <TimeSeries series={data.series} unit={unit} />
              ) : (
                <div className="empty-note">No traffic in this window yet</div>
              )}
            </section>

            {/* breakdown grid */}
            <div className="break-grid">
              <section className="card rise" style={{ animationDelay: '160ms' }}>
                <div className="card-head"><span className="microlabel" style={{ marginBottom: 0 }}>Top pages</span><span className="unit-note">views</span></div>
                <BarList items={data.pages ?? []} emptyNote="No pageviews yet" />
              </section>

              <section className="card rise" style={{ animationDelay: '200ms' }}>
                <div className="card-head"><span className="microlabel" style={{ marginBottom: 0 }}>Referrers</span><span className="unit-note">visitors</span></div>
                <BarList
                  items={data.referrers ?? []}
                  format={x => (x === 'direct' ? <em style={{ fontStyle: 'normal', color: FAINT }}>direct / none</em> : x)}
                  emptyNote="No referrers yet"
                />
              </section>

              <section className="card rise" style={{ animationDelay: '240ms' }}>
                <div className="card-head"><span className="microlabel" style={{ marginBottom: 0 }}>Countries</span><span className="unit-note">visitors</span></div>
                <BarList
                  items={data.countries ?? []}
                  format={code => <>{flag(code)}&nbsp;&nbsp;{countryName(code)}</>}
                  emptyNote="Geo data appears once deployed on Vercel"
                />
              </section>

              <section className="card rise" style={{ animationDelay: '280ms' }}>
                <div className="card-head"><span className="microlabel" style={{ marginBottom: 0 }}>Devices &amp; browsers</span><span className="unit-note">visitors</span></div>
                <DeviceSplit devices={data.devices ?? []} />
                <div style={{ height: 24 }} />
                <BarList items={data.browsers ?? []} emptyNote="No browser data yet" />
              </section>
            </div>

            {!hasAny && (
              <div className="collecting rise" style={{ animationDelay: '320ms' }}>
                <span className="live-dot" style={{ position: 'static' }} />
                The pipeline is live and listening — charts fill in as visits arrive.
              </div>
            )}

            {/* footer note */}
            <div className="foot-note">
              Built in-house · Next.js route handler → Neon Postgres · visitors are a salted
              hash that rotates every 24h · no cookies, no fingerprinting, nothing to consent to
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ─── styles ─── */
const css = `
.stats-page {
  min-height: 100vh;
  background: ${SURFACE};
  color: ${INK};
  font-family: var(--font-space-grotesk, system-ui, sans-serif);
}
.wrap { max-width: 1200px; margin: 0 auto; padding-left: clamp(20px, 5vw, 56px); padding-right: clamp(20px, 5vw, 56px); }

.stats-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(9,9,11,0.85); backdrop-filter: blur(12px);
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
  width: 7px; height: 7px; border-radius: 50%; background: ${BRAND};
  animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
}
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }

.hero-title {
  font-size: clamp(34px, 6vw, 64px); font-weight: 700; line-height: 1.04;
  letter-spacing: -0.02em; margin: 0 0 18px;
}
.hero-sub { color: ${MUTED}; max-width: 520px; line-height: 1.65; font-size: 15px; margin: 0; }

.range-row { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
.range-btn {
  font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.1em;
  background: none; border: 1px solid transparent; border-radius: 3px;
  color: ${FAINT}; padding: 7px 14px; cursor: pointer; transition: color 150ms, border-color 150ms;
}
.range-btn:hover { color: ${INK}; }
.range-btn.on { color: ${BRAND}; border-color: rgba(255,94,31,0.4); }
.range-note { margin-left: auto; font-family: var(--font-mono, monospace); font-size: 10px; letter-spacing: 0.08em; color: ${FAINT}; }

.tile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
@media (max-width: 980px) { .tile-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 400px) { .tile-grid { grid-template-columns: 1fr; } }
.tile { background: ${CARD}; border: 1px solid ${HAIRLINE}; border-radius: 6px; padding: 20px 22px; }
.tile-value { font-size: 36px; font-weight: 700; line-height: 1.05; letter-spacing: -0.01em; margin: 2px 0 8px; }
.tile-delta { font-family: var(--font-mono, monospace); font-size: 11px; }

.card { background: ${CARD}; border: 1px solid ${HAIRLINE}; border-radius: 6px; padding: 22px 24px; }
.card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.unit-note { font-family: var(--font-mono, monospace); font-size: 10px; color: ${FAINT}; letter-spacing: 0.08em; }

.legend { display: flex; gap: 16px; }
.legend-item { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: ${MUTED}; }
.legend-line { width: 14px; height: 2px; border-radius: 1px; }

.chart-tooltip {
  position: absolute; top: 10px; pointer-events: none;
  background: #1a1a21; border: 1px solid rgba(255,255,255,0.12); border-radius: 5px;
  padding: 10px 14px; font-family: var(--font-mono, monospace); font-size: 12px; color: ${INK};
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); min-width: 140px; z-index: 10;
}
.tt-row { display: flex; align-items: center; margin-top: 3px; color: ${MUTED}; }
.tt-row strong { color: ${INK}; font-weight: 600; }
.tt-key { width: 10px; height: 2px; border-radius: 1px; margin-right: 8px; flex-shrink: 0; }

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
  max-width: 560px; margin-left: auto; margin-right: auto;
}

.rise { animation: rise 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .rise { animation: none; }
  .live-dot { animation: none; }
  .bar-fill { transition: none; }
}
`
