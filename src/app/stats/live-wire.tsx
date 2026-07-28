"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { ago, type SqlMeta } from './theme'
import { SqlButton } from './sql-panel'

export interface WireRow {
  at: string
  age: number
  path: string
  country: string | null
  device: string | null
  browser: string | null
  referrer_host: string | null
  you: boolean
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

/** Identity of a feed row across polls. Index is folded in because two hits can
 *  share a second and a path, and React still needs them told apart. */
const key = (r: WireRow, i: number) => `${r.at}|${r.path}|${i}`

export default function LiveWire({
  onLive, onOpenSql,
}: {
  onLive?: (n: number) => void
  onOpenSql: (queries: SqlMeta[]) => void
}) {
  const [rows, setRows] = useState<WireRow[] | null>(null)
  /* Keys that arrived in the latest payload and were not in the one before —
     these are the rows that flash. Computed when the data lands rather than
     during render, so the "already seen" ledger is never touched mid-render. */
  const [fresh, setFresh] = useState<Set<string>>(() => new Set())
  const [meta, setMeta] = useState<SqlMeta | null>(null)
  const [failed, setFailed] = useState(false)
  const [idle, setIdle] = useState(false)
  const [visible, setVisible] = useState(false)

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
      // animate every row in at once — only genuine arrivals flash.
      setFresh(seen.current === null ? new Set() : new Set(keys.filter(k => !seen.current!.has(k))))
      seen.current = new Set(keys)

      setFailed(false)
      setRows(d.feed)
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

  return (
    <section className="card rise wire-card" ref={cardRef} style={{ animationDelay: '140ms' }}>
      <div className="card-head">
        <span className="microlabel" style={{ marginBottom: 0 }}>The wire</span>
        <div className="wire-head-right">
          {youCount > 0 && <span className="wire-you-note">{youCount} of these {youCount === 1 ? 'is' : 'are'} you</span>}
          {meta && <SqlButton onClick={() => onOpenSql([{ ...meta, title: 'The wire', note: 'Recent pageviews, newest first. The `you` column is a comparison against a hash recomputed for your request — the hash itself never leaves the server.' }])} />}
        </div>
      </div>

      {rows === null && !failed && <div className="empty-note">opening the wire<span className="blink">_</span></div>}
      {failed && <div className="empty-note">The wire is quiet — couldn&apos;t reach the feed.</div>}
      {rows?.length === 0 && <div className="empty-note">Nothing in the last 24 hours. You may be the next line.</div>}

      {rows && rows.length > 0 && (
        <ol className="wire" aria-live="polite" aria-label="Recent pageviews">
          {rows.map((r, i) => {
            const k = key(r, i)
            return (
              <li key={k} className={`wire-row${r.you ? ' is-you' : ''}${fresh.has(k) ? ' is-new' : ''}`}>
                <span className="wire-t">{r.at}</span>
                {/* Code only, no flag emoji: regional-indicator pairs fall back to
                    two tiny letters on Windows, which reads as a doubled label
                    next to the code itself. */}
                <span className="wire-geo">{r.country ?? '··'}</span>
                <span className="wire-path" title={r.path}>{r.path}</span>
                <span className="wire-ua">{[r.browser, r.device].filter(Boolean).join(' · ').toLowerCase()}</span>
                <span className="wire-age">{ago(r.age)}</span>
                {r.you && <span className="wire-you">← that&apos;s you</span>}
              </li>
            )
          })}
        </ol>
      )}

      <div className="wire-foot">
        {idle ? (
          <button className="wire-resume" onClick={() => { polls.current = 0; setIdle(false) }}>
            paused after 10 min · resume
          </button>
        ) : (
          <>polling every {POLL_MS / 1000}s while this panel is on screen</>
        )}
      </div>
    </section>
  )
}
