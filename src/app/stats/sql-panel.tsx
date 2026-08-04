"use client"

import { useEffect, useRef, useState } from 'react'
import type { SqlMeta } from './theme'

/* ─── highlighter ───────────────────────────────────────────────
   Hand-rolled rather than pulled from a package: the whole point of
   this panel is that the page ships its own tooling, and a 400KB
   syntax library on a dashboard that renders eleven short queries
   would be the opposite of the argument being made. */

const KEYWORDS =
  'WITH|SELECT|FROM|WHERE|AND|OR|NOT|NULL|IS|AS|ON|GROUP\\s+BY|ORDER\\s+BY|LEFT\\s+JOIN|JOIN|LIMIT|DESC|ASC|DISTINCT|FILTER|OVER|CASE|WHEN|THEN|ELSE|END|EXISTS|INTERVAL|AT\\s+TIME\\s+ZONE'
const FUNCTIONS =
  'count|sum|min|max|coalesce|extract|date_trunc|generate_series|to_char|now'

const TOKEN = new RegExp(
  [
    '(--[^\\n]*)', // 1 comment
    "('[^']*')", // 2 string — no escaped quotes appear in these queries
    '(::[a-z]+)', // 3 cast
    '(\\$\\d+)', // 4 placeholder
    `(\\b(?:${KEYWORDS})\\b)`, // 5 keyword
    `(\\b(?:${FUNCTIONS})\\b(?=\\s*\\())`, // 6 function
    '(\\b\\d+\\b)', // 7 number
  ].join('|'),
  'gi',
)

/* Syntax tones for the light code sheet (#F7F7F5). These are not chart colors
   and carry no data, so they are picked for reading contrast rather than for
   the six-checks: every one clears 4.5:1 on that sheet. The pastels this
   replaced were tuned for a dark editor and washed out entirely on paper. */
const TONE = {
  comment: '#8A8378',
  string: '#0F7B4F',
  cast: '#0F6FA8',
  param: '#C13E00',
  keyword: '#6D28D9',
  fn: '#0F6FA8',
  number: '#9A5B00',
}

function classify(m: RegExpExecArray): keyof typeof TONE {
  if (m[1]) return 'comment'
  if (m[2]) return 'string'
  if (m[3]) return 'cast'
  if (m[4]) return 'param'
  if (m[5]) return 'keyword'
  if (m[6]) return 'fn'
  return 'number'
}

function highlight(line: string, key: string) {
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index))
    out.push(
      <span key={`${key}-${m.index}`} style={{ color: TONE[classify(m)], fontStyle: m[1] ? 'italic' : undefined }}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

/* ─── the [ sql ] affordance that lives in every panel head ─── */

export function SqlButton({ onClick, label = 'sql' }: { onClick: () => void; label?: string }) {
  return (
    <button className="sql-btn" onClick={onClick} aria-haspopup="dialog">
      [ {label} ]
    </button>
  )
}

/* ─── the drawer ─── */

export function SqlDrawer({
  queries, totalMs, onClose,
}: {
  queries: SqlMeta[]
  totalMs?: number
  onClose: () => void
}) {
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreTo = useRef<Element | null>(null)

  useEffect(() => {
    restoreTo.current = document.activeElement
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      ;(restoreTo.current as HTMLElement | null)?.focus?.()
    }
  }, [onClose])

  const q = queries[Math.min(tab, queries.length - 1)]
  if (!q) return null
  const lines = q.text.split('\n')

  const copy = () => {
    navigator.clipboard?.writeText(q.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="sql-back" onClick={onClose}>
      <div
        className="sql-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`SQL behind ${q.title ?? 'this panel'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sql-head">
          <div style={{ minWidth: 0 }}>
            <div className="microlabel" style={{ marginBottom: 6 }}>the query behind this</div>
            <h3 className="sql-title">{q.title ?? 'Query'}</h3>
          </div>
          <button ref={closeRef} className="sql-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {queries.length > 1 && (
          <div className="sql-tabs" role="tablist">
            {queries.map((qq, i) => (
              <button
                key={qq.id ?? i}
                role="tab"
                aria-selected={i === tab}
                className={`sql-tab ${i === tab ? 'on' : ''}`}
                onClick={() => setTab(i)}
              >
                {qq.title ?? `Query ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {q.note && <p className="sql-note">{q.note}</p>}

        <div className="sql-meta">
          {q.ms != null && <span className="sql-chip">{q.ms} ms</span>}
          {q.rowCount != null && <span className="sql-chip">{q.rowCount} {q.rowCount === 1 ? 'row' : 'rows'}</span>}
          {q.params.length > 0 && (
            <span className="sql-chip">
              {q.params.map((p, i) => `$${i + 1} = ${typeof p === 'string' ? `'${p}'` : String(p)}`).join('  ·  ')}
            </span>
          )}
          <button className="sql-copy" onClick={copy}>{copied ? 'copied ✓' : 'copy'}</button>
        </div>

        <div className="sql-body">
          <pre className="sql-pre">
            {lines.map((l, i) => (
              <div className="sql-line" key={i}>
                <span className="sql-ln">{i + 1}</span>
                <code>{highlight(l, String(i))}</code>
              </div>
            ))}
          </pre>
        </div>

        <div className="sql-foot">
          This is not a transcription. The dashboard executes these strings through{' '}
          <code>sql.query(text, params)</code> and ships the same string here, so it cannot drift
          from what actually ran. Every query on the page is issued at once, so the timings above
          overlap rather than stack
          {totalMs != null && <>, so the whole set settles in {totalMs} ms</>}.
        </div>
      </div>
    </div>
  )
}
