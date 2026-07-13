"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/**
 * Home-page telemetry band. Static shell renders immediately (so the
 * page's GSAP scroll triggers can bind to it); the live numbers and the
 * 30-day pulse chart stream in from the site's own first-party
 * analytics pipeline.
 */

const C1 = '#ea580c' // series hue — validated against #09090b (dataviz six-checks)

interface Nums {
  views: number
  visitors: number
  live: number
  countries: number
}

type Point = { t: string; views: number; visitors: number }

function Num({ value }: { value: number | null }) {
  const [display, setDisplay] = useState<number | null>(null)

  useEffect(() => {
    if (value == null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const start = performance.now()
    const dur = 1200
    let raf: number
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <>{display == null ? '—' : display.toLocaleString('en-AU')}</>
}

/* 30-day views pulse — single-series area chart, crosshair on hover */
function Pulse({ series }: { series: Point[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width))
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const H = 120
  const PAD = 2 // keeps the 2px line from clipping at the edges
  const n = series.length
  const max = Math.max(...series.map(d => d.views), 4)
  const x = (i: number) => PAD + (n <= 1 ? (width - PAD * 2) / 2 : (i / (n - 1)) * (width - PAD * 2))
  const y = (v: number) => PAD + (H - PAD * 2) * (1 - v / max)

  const line = series.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.views).toFixed(1)}`).join('')
  const area = n > 0 ? `${line}L${x(n - 1).toFixed(1)},${H}L${x(0).toFixed(1)},${H}Z` : ''

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - rect.left - PAD) / Math.max(rect.width - PAD * 2, 1)) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }, [n])

  const h = hover != null ? series[hover] : null
  const label = (t: string) =>
    new Date(`${t}T00:00`).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })

  return (
    <div className="tm-pulse" data-rise>
      <div className="tm-pulse-head mono">
        <span>[ pulse ] page views · daily</span>
        <span className="tm-pulse-read">
          {h ? `${label(h.t)} — ${h.views.toLocaleString('en-AU')} ${h.views === 1 ? 'view' : 'views'}` : `peak ${max.toLocaleString('en-AU')}`}
        </span>
      </div>
      <div ref={wrapRef} style={{ position: 'relative' }}>
        {width > 0 && n > 1 && (
          <svg
            width={width}
            height={H}
            role="img"
            aria-label="Page views per day, last 30 days"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            style={{ display: 'block', touchAction: 'pan-y' }}
          >
            <line x1={0} x2={width} y1={H - 0.5} y2={H - 0.5} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
            <path d={area} fill={C1} opacity={0.1} />
            <path d={line} fill="none" stroke={C1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {h && (
              <g>
                <line x1={x(hover!)} x2={x(hover!)} y1={0} y2={H} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
                <circle cx={x(hover!)} cy={y(h.views)} r={4} fill={C1} stroke="#09090b" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}
      </div>
      <div className="tm-pulse-axis mono">
        <span>{n > 0 ? label(series[0].t) : ''}</span>
        <span>today</span>
      </div>
      <table className="tm-sr-only">
        <caption>Page views per day, last 30 days</caption>
        <thead><tr><th>Date</th><th>Views</th></tr></thead>
        <tbody>
          {series.map(d => (
            <tr key={d.t}><td>{d.t}</td><td>{d.views}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HomeTelemetry() {
  const [nums, setNums] = useState<Nums | null>(null)
  const [series, setSeries] = useState<Point[]>([])

  useEffect(() => {
    fetch('/api/stats?range=30d')
      .then(r => r.json())
      .then(d => {
        if (d?.totals) {
          setNums({
            views: d.totals.views,
            visitors: d.totals.visitors,
            live: d.live ?? 0,
            countries: d.countryCount ?? 0,
          })
        }
        if (Array.isArray(d?.series)) setSeries(d.series)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="tm">
      <div className="tm-grid">
        <h2 className="tm-head" data-lines aria-label="This site measures itself.">
          <span className="lr" aria-hidden="true"><span className="lr-in">This site</span></span>
          <span className="lr" aria-hidden="true"><span className="lr-in">measures <em className="tm-it">itself.</em></span></span>
        </h2>
        <div>
          <p className="lead tm-lead" data-rise>
            No Google Analytics, no third-party script. I built the pipeline that powers these
            numbers — a <span className="acid-text">cookieless tracker</span>, a Postgres events
            table, and the SQL that rolls it up. What you&apos;re reading right now is already in it.
          </p>
          <p className="tm-pipe mono" data-rise>
            pageview <span className="acid-text">→</span> beacon{' '}
            <span className="acid-text">→</span> /api/track{' '}
            <span className="acid-text">→</span> postgres{' '}
            <span className="acid-text">→</span> sql{' '}
            <span className="acid-text">→</span> dashboard
          </p>
        </div>
      </div>

      {series.length > 1 && <Pulse series={series} />}

      <div className="rdout" data-rise-group aria-label="Live site metrics, last 30 days">
        <div className="rd">
          <span className="rd-v"><Num value={nums?.views ?? null} /></span>
          <span className="rd-l mono">Page views · 30d</span>
        </div>
        <div className="rd">
          <span className="rd-v"><Num value={nums?.visitors ?? null} /></span>
          <span className="rd-l mono">Unique visitors · 30d</span>
        </div>
        <div className="rd">
          <span className="rd-v"><Num value={nums?.countries ?? null} /></span>
          <span className="rd-l mono">Countries · 30d</span>
        </div>
        <div className="rd">
          <span className="rd-v tm-live-v"><i className="tm-dot" aria-hidden="true" /><Num value={nums?.live ?? null} /></span>
          <span className="rd-l mono">Reading right now</span>
        </div>
      </div>

      <div data-rise>
        <Link className="cardlink mono tm-cta" href="/stats" data-cursor="open ↗">
          enter the data room <span className="arrow">↗</span>
        </Link>
      </div>
    </div>
  )
}
