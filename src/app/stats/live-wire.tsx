"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ago, countryName, type SqlMeta } from './theme'
import { SqlButton } from './sql-panel'

export interface WireRow {
  /** Sydney time to the minute. Deliberately not to the second -- see FEED_QUERY. */
  at: string
  /** Seconds, rounded to the nearest minute. Coarse on purpose, for the same reason. */
  age: number
  path: string
  country: string | null
  device: string | null
  browser: string | null
  you: boolean
  /** Opaque group number, valid only within this payload. Equality is the only
   *  meaningful operation on it — see FEED_QUERY. */
  who: number
}

interface Feed {
  live: number
  feed: WireRow[]
  sql?: SqlMeta
}

const POLL_MS = 10_000
/** Stop after ten minutes unattended. A dashboard nobody is reading should
 *  not keep waking the database — there is a button to start it again. */
const MAX_POLLS = 60
/** The feed returns 24 rows; two-line entries make that a very tall card, so
 *  the rest is behind a control rather than dropped. */
const COLLAPSED = 10
/** A gap longer than this gets called out on the rail instead of just being
 *  empty space — a quiet stretch is a fact about the site, not a layout hole.
 *  Set low enough that every gap the eye reads as large carries a name, since
 *  the rail's log scale is near its cap by this point and a twelve-minute lull
 *  and a nine-hour one look alike without the label. */
const QUIET_S = 12 * 60
/** Same person, but far enough apart that calling it one visit would be a
 *  stretch. The usual analytics convention, and it keeps the session stroke
 *  from reaching across a lull it has no business claiming. */
const SESSION_S = 30 * 60

/** Identity of a feed row across polls. Index is folded in because two hits can
 *  share a second and a path, and React still needs them told apart. */
const key = (r: WireRow, i: number) => `${r.at}|${r.path}|${i}`

/**
 * Vertical distance on the rail for a gap in time. Log-scaled so a forty-second
 * gap and a nine-hour one can share one axis, and capped so a single quiet
 * night cannot push the rest of the feed off the bottom of the card. The row's
 * own padding supplies the baseline rhythm; this is the part that means
 * something.
 */
function railGap(seconds: number) {
  return Math.min(34, Math.max(0, 9 * Math.log(1 + Math.max(seconds, 0) / 45)))
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** Spelled-out where it reads better — this line is prose, not a measurement. */
function lull(seconds: number) {
  if (seconds < 5400) {
    // Rounded to five past the point where a spelled-out number stops reading
    // as prose — the label is an impression of a lull, not a measurement.
    const m = Math.round(seconds / 60)
    return `${WORDS[m] ?? Math.round(m / 5) * 5} minutes quiet`
  }
  const h = Math.round(seconds / 3600)
  return h === 1 ? 'an hour quiet' : `${WORDS[h] ?? h} hours quiet`
}

/** Age as contrast. Three steps rather than a continuous ramp, and the dimmest
 *  step stops at MUTED so the oldest row still clears contrast on the card.
 *  The thresholds are set for how this site actually gets read — sparse and
 *  bursty — so a normal day's feed is legible rather than uniformly dim. */
const tier = (age: number) => (age < 3600 ? 't-fresh' : age < 21600 ? 't-recent' : 't-older')

/**
 * Whether two adjacent rows are one person continuing to read. `newer` is the
 * row above — the feed runs newest-first, so the older row carries the larger
 * age and the difference between them is the gap between the two hits.
 */
function sameVisit(newer: WireRow, older: WireRow) {
  return newer.who === older.who && older.age - newer.age < SESSION_S
}

export default function LiveWire({
  onLive, onOpenSql,
}: {
  onLive?: (n: number) => void
  onOpenSql: (queries: SqlMeta[]) => void
}) {
  const [rows, setRows] = useState<WireRow[] | null>(null)
  /* Keys that arrived in the latest payload and were not in the one before —
     these are the rows that animate in. Computed when the data lands rather
     than during render, so the "already seen" ledger is never touched
     mid-render. */
  const [fresh, setFresh] = useState<Set<string>>(() => new Set())
  const [meta, setMeta] = useState<SqlMeta | null>(null)
  const [failed, setFailed] = useState(false)
  const [idle, setIdle] = useState(false)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [live, setLive] = useState(0)
  /* Remounts the progress hairline so it restarts from zero on every poll. */
  const [pollSeq, setPollSeq] = useState(0)
  /* One spoken line per poll, instead of a live region re-reading all 24 rows. */
  const [announce, setAnnounce] = useState('')

  const cardRef = useRef<HTMLElement>(null)
  const polls = useRef(0)
  const lastLoad = useRef(0)
  const seen = useRef<Set<string> | null>(null)
  const onLiveRef = useRef(onLive)
  useEffect(() => { onLiveRef.current = onLive })

  const load = useCallback(async () => {
    lastLoad.current = Date.now()
    try {
      const res = await fetch('/api/stats/live')
      const d: Feed = await res.json()
      if (!Array.isArray(d.feed)) { setFailed(true); return }

      const keys = d.feed.map(key)
      // The first payload seeds the ledger, so the initial render does not
      // animate every row in at once — only genuine arrivals move.
      const arrivals = seen.current === null ? [] : keys.filter(k => !seen.current!.has(k))
      setFresh(new Set(arrivals))
      seen.current = new Set(keys)

      if (arrivals.length > 0 && d.feed[0]) {
        setAnnounce(`${arrivals.length} new pageview${arrivals.length === 1 ? '' : 's'}, latest ${d.feed[0].path}`)
      }

      setFailed(false)
      setRows(d.feed)
      setLive(d.live ?? 0)
      setPollSeq(n => n + 1)
      if (d.sql) setMeta(d.sql)
      onLiveRef.current?.(d.live ?? 0)
    } catch {
      setFailed(true)
    }
  }, [])

  /* Load once, unconditionally. Visibility gates the *polling*, not the first
     paint — an IntersectionObserver callback is delivered through the rendering
     pipeline, and a throttled or occluded tab can sit on it indefinitely. The
     panel would then show "opening the wire" forever, which is a worse failure
     than one request nobody read. */
  useEffect(() => { load() }, [load])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || idle) return

    let timer: ReturnType<typeof setTimeout>
    let stopped = false

    const tick = async () => {
      if (stopped) return
      if (document.visibilityState === 'visible') {
        if (polls.current >= MAX_POLLS) { setIdle(true); return }
        polls.current += 1
        lastLoad.current = Date.now()
        await load()
      }
      if (!stopped) timer = setTimeout(tick, POLL_MS)
    }

    // Scrolling back to a panel that went stale should not wait out an interval.
    const due = Date.now() - lastLoad.current >= POLL_MS
    if (due) tick()
    else timer = setTimeout(tick, POLL_MS)

    const onVis = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stopped = true
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [visible, idle, load])

  const youCount = rows?.filter(r => r.you).length ?? 0
  const shown = rows ? (expanded ? rows : rows.slice(0, COLLAPSED)) : []
  const hidden = (rows?.length ?? 0) - shown.length
  /* The stroke only needs explaining when there is one on screen to explain. */
  const hasSession = shown.some((r, i) => i > 0 && sameVisit(shown[i - 1], r))

  return (
    <section className="card rise wire-card" ref={cardRef} style={{ animationDelay: '140ms' }}>
      <div className="card-head">
        <span className="microlabel" style={{ marginBottom: 0 }}>The wire</span>
        <div className="wire-head-right">
          {youCount > 0 && (
            <span className="wire-you-note">
              {youCount === 1 ? 'one of these is you' : `${youCount} of these are you`}
            </span>
          )}
          {meta && <SqlButton onClick={() => onOpenSql([{ ...meta, title: 'The wire', note: 'Recent pageviews, newest first. The `you` column is a comparison against a hash recomputed for your request, and the hash itself never leaves the server. `who` is a rank over these rows alone: it groups one person’s consecutive views into the joined strokes on the rail, and means nothing outside this payload.' }])} />}
        </div>
      </div>

      {/* The poll made visible: this fills across one interval and resets when
          the next payload lands, so the mechanism the page is describing is on
          screen rather than only written down. */}
      <div className={`wire-pulse${idle ? ' is-idle' : ''}`}>
        <span key={pollSeq} className="wire-tick" style={{ animationDuration: `${POLL_MS}ms` }} />
      </div>

      <p className="sr-only" aria-live="polite">{announce}</p>

      {rows === null && !failed && <div className="empty-note">opening the wire<span className="blink">_</span></div>}
      {failed && <div className="empty-note">Couldn&apos;t reach the feed. Retrying on the next poll.</div>}
      {rows?.length === 0 && <div className="empty-note">Nothing in the last 24 hours. You may be the next line.</div>}

      {rows && rows.length > 0 && (
        <div className="wire-stream">
          <div className="wire-row wire-now">
            <span className="wire-t">now</span>
            <span className="wire-rail"><span className="wire-node" /></span>
            <span className="wire-now-label">
              {live > 0
                ? `${live} reading right now`
                : 'nobody on the site this minute'}
            </span>
          </div>

          <ol className="wire" aria-live="off" aria-label="Recent pageviews">
            {shown.map((r, i) => {
              const k = key(r, i)
              // Rows arrive newest-first, so the older row always has the
              // larger age and the difference is the gap between the two hits.
              const delta = i === 0 ? r.age : r.age - shown[i - 1].age
              const quiet = delta >= QUIET_S
              const ua = [r.browser, r.device].filter(Boolean).join(', ').toLowerCase()
              // Marked at both ends: the segment above this entry and the one
              // running through it, or the session stroke would break at every
              // row body and read as a row of unrelated dashes.
              const linkUp = i > 0 && sameVisit(shown[i - 1], r)
              const linkDown = i < shown.length - 1 && sameVisit(r, shown[i + 1])
              return (
                <li
                  key={k}
                  className={`wire-row${r.you ? ' is-you' : ''}${fresh.has(k) ? ' is-new' : ''}${quiet ? ' is-quiet' : ''}${linkUp ? ' link-up' : ''}${linkDown ? ' link-down' : ''}`}
                  style={{ '--gap': `${railGap(delta).toFixed(1)}px` } as CSSProperties}
                >
                  {quiet && <span className="wire-quiet">{lull(delta)}</span>}
                  <span className="wire-t">{r.at}</span>
                  <span className="wire-rail"><span className="wire-node" /></span>
                  <div className="wire-body">
                    <span className={`wire-path ${tier(r.age)}`} title={r.path}>{r.path}</span>
                    <div className="wire-line2">
                      <span className="wire-meta">
                        {r.country && <span>{countryName(r.country)}</span>}
                        {ua && <span>{ua}</span>}
                      </span>
                      {r.you && <span className="wire-you">that&apos;s you</span>}
                      <span className="wire-age">{ago(r.age)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <div className="wire-foot">
        {idle ? (
          <button className="wire-resume" onClick={() => { polls.current = 0; setIdle(false) }}>
            paused after 10 min · resume
          </button>
        ) : (
          <span>
            polling every {POLL_MS / 1000}s while this panel is on screen
            {hasSession && ' · a joined stroke is one visit'}
          </span>
        )}
        {rows && rows.length > COLLAPSED && (
          <button className="wire-more" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'show fewer' : `show all ${rows.length}`}
            {!expanded && hidden > 0 && <span className="wire-more-n"> (+{hidden})</span>}
          </button>
        )}
      </div>
    </section>
  )
}
