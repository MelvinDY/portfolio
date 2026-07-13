"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Home-page telemetry band. Static shell renders immediately (so the
 * page's GSAP scroll triggers can bind to it); the live numbers stream
 * in from the site's own first-party analytics pipeline.
 */

interface Nums {
  views: number
  visitors: number
  live: number
  countries: number
}

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

export default function HomeTelemetry() {
  const [nums, setNums] = useState<Nums | null>(null)

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
