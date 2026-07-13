"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * First-party pageview tracker. Fires once per client-side route change
 * via sendBeacon so navigation is never blocked. No cookies, no
 * localStorage — visitor identity is derived server-side from a
 * daily-rotating hash.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return
    if (window.location.hostname === 'localhost') return
    lastPath.current = pathname

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') ?? undefined,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
    }
  }, [pathname])

  return null
}
