"use client"

import { C1, FAINT } from './theme'

export interface HeatCell { dow: number; hour: number; views: number }

/** Postgres `extract(dow)` is 0 = Sunday; the grid reads Monday-first. */
const ROWS = [
  { dow: 1, label: 'Mon' },
  { dow: 2, label: 'Tue' },
  { dow: 3, label: 'Wed' },
  { dow: 4, label: 'Thu' },
  { dow: 5, label: 'Fri' },
  { dow: 6, label: 'Sat' },
  { dow: 0, label: 'Sun' },
]

/** Four steps of one hue. Empty is a hairline, not a fifth colour. */
const STEPS = [0.22, 0.45, 0.7, 1]

const bin = (v: number, max: number) => (v <= 0 ? -1 : Math.min(3, Math.ceil((v / max) * 4) - 1))

export default function Heatmap({ cells }: { cells: HeatCell[] }) {
  const grid = new Map<string, number>()
  for (const c of cells) grid.set(`${c.dow}-${c.hour}`, c.views)
  const max = Math.max(...cells.map(c => c.views), 0)

  if (max === 0) return <div className="empty-note">Not enough traffic to find a rhythm yet</div>

  const peak = cells.reduce((best, c) => (c.views > best.views ? c : best), cells[0])
  const peakDay = ROWS.find(r => r.dow === peak.dow)?.label ?? ''
  const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

  return (
    <div>
      <div className="heat-scroll">
        <div className="heat">
          <div className="heat-corner" />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={`h${h}`} className="heat-hour">{h % 6 === 0 ? String(h).padStart(2, '0') : ''}</div>
          ))}
          {ROWS.map(row => (
            <div key={row.dow} style={{ display: 'contents' }}>
              <div className="heat-day">{row.label}</div>
              {Array.from({ length: 24 }, (_, h) => {
                const v = grid.get(`${row.dow}-${h}`) ?? 0
                const b = bin(v, max)
                return (
                  <div
                    key={`${row.dow}-${h}`}
                    className="heat-cell"
                    title={`${row.label} ${hh(h)} — ${v} ${v === 1 ? 'view' : 'views'}`}
                    style={b < 0 ? undefined : { background: C1, opacity: STEPS[b] }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="heat-legend">
        <span>busiest: {peakDay} {hh(peak.hour)}</span>
        <span className="heat-scale">
          less
          {STEPS.map(s => <i key={s} style={{ background: C1, opacity: s }} />)}
          more
        </span>
      </div>

      <table className="sr-only">
        <caption>Page views by weekday and hour, Australia/Sydney</caption>
        <thead>
          <tr><th>Day</th>{Array.from({ length: 24 }, (_, h) => <th key={h}>{hh(h)}</th>)}</tr>
        </thead>
        <tbody>
          {ROWS.map(row => (
            <tr key={row.dow}>
              <th scope="row">{row.label}</th>
              {Array.from({ length: 24 }, (_, h) => <td key={h}>{grid.get(`${row.dow}-${h}`) ?? 0}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="heat-note" style={{ color: FAINT }}>
        Local time in Sydney. A cold column is a sleeping hemisphere, not a broken pipeline.
      </p>
    </div>
  )
}
