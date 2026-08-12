"use client"

import { useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'

/**
 * One line of welcome for a visitor arriving with a utm_source we recognise.
 * Shows once per session, dismissible, and never on a page it would only send
 * the reader back to.
 *
 * Styling lives in globals.css under the floating-chrome block, next to the
 * ⌘K palette, rather than in a string injected into <head> on first render.
 * Both are mounted in the root layout and sit in opposite bottom corners of
 * the same viewport, so they share one set of tokens: a surface cannot share
 * a palette it cannot see.
 */

const STORAGE_KEY = 'utm_banner_dismissed_v1'

const VARIANTS: Record<string, { label: string; message: string; cta?: { text: string; href: string } }> = {
  linkedin: {
    label: 'linkedin',
    message: "Came from LinkedIn? Good. This site is built to show exactly what I’d bring to a data or analytics engineering role.",
    cta: { text: 'Jump to Data Projects ↗', href: '/projects/data' },
  },
  github: {
    label: 'github',
    message: "Fellow dev spotted. Source code for every project is on GitHub, so dig as deep as you like.",
    cta: { text: 'View Software Projects ↗', href: '/projects/software' },
  },
  google: {
    label: 'google',
    message: "Found this through search, so you must be looking for something specific. Here’s the short version.",
  },
}

function BannerInner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [source, setSource] = useState<string | null>(null)
  const [hiding, setHiding] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const utm = searchParams.get('utm_source')?.toLowerCase() ?? null
    if (!utm || !VARIANTS[utm]) return
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return

    setSource(utm)

    // Double rAF ensures paint before adding class (matches reference implementation)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bannerRef.current?.classList.add('utm-visible')
      })
    })
  }, [searchParams])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setHiding(true)
    const el = bannerRef.current
    if (el) {
      el.classList.remove('utm-visible')
      el.classList.add('utm-hiding')
      setTimeout(() => setSource(null), 360)
    }
  }

  if (!source) return null
  const v = VARIANTS[source]

  return (
    <div id="utm-banner" ref={bannerRef} role="status" aria-live="polite" data-hiding={hiding}>
      <div className="utm-inner">
        <div className="utm-top">
          <span className="utm-label">{v.label}</span>
          <button className="utm-close" aria-label="Dismiss" onClick={dismiss}>✕</button>
        </div>
        <p className="utm-msg">{v.message}</p>
        {v.cta && pathname !== v.cta.href && (
          <a className="utm-cta" href={v.cta.href} onClick={dismiss}>
            {v.cta.text}
          </a>
        )}
      </div>
    </div>
  )
}

export default function UtmBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  )
}
