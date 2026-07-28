"use client"

import { useEffect, useState } from 'react'

export interface Pulse {
  live: number
  viewsToday: number
  visitorsToday: number
  /** Position among today's visitors, ordered by first sighting. */
  rank: number
  city: string | null
  country: string | null
}

/**
 * The hero's live readout. One request, fired after mount so nothing on the
 * critical path waits for it, and silently dropped on failure — the hero has
 * a static plate to fall back to and must never show an error.
 */
export function usePulse(): Pulse | null {
  const [pulse, setPulse] = useState<Pulse | null>(null)

  useEffect(() => {
    let cancelled = false
    const ctl = new AbortController()

    // A beat after paint: the tracker beacon for this pageview should land
    // first, so the reader number counts the visit they are currently making.
    const timer = setTimeout(() => {
      fetch('/api/pulse', { signal: ctl.signal })
        .then(r => r.json())
        .then(d => {
          if (cancelled || !d?.configured || d.error) return
          setPulse(d as Pulse)
        })
        .catch(() => {})
    }, 700)

    return () => {
      cancelled = true
      clearTimeout(timer)
      ctl.abort()
    }
  }, [])

  return pulse
}
