"use client"

import { useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'

const STORAGE_KEY = 'utm_banner_dismissed_v1'

const VARIANTS: Record<string, { label: string; message: string; cta?: { text: string; href: string } }> = {
  linkedin: {
    label: 'linkedin',
    message: "Came from LinkedIn? Good — this site is built to show exactly what I’d bring to a data or analytics engineering role.",
    cta: { text: 'Jump to Data Projects ↗', href: '/projects/data' },
  },
  github: {
    label: 'github',
    message: "Fellow dev spotted. Source code for every project is on GitHub — dig as deep as you like.",
    cta: { text: 'View Software Projects ↗', href: '/projects/software' },
  },
  google: {
    label: 'google',
    message: "Found this through search — you must be looking for something specific. Here’s the short version.",
  },
}

const CSS = `
  #utm-banner {
    position: fixed;
    bottom: 28px;
    left: 28px;
    z-index: 200;
    width: 360px;
    max-width: calc(100vw - 56px);
    background: #09090b;
    border: 1px solid rgba(255,255,255,0.11);
    border-top: 2px solid #ff5e1f;
    transform: translateY(calc(100% + 56px));
    transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
  }
  #utm-banner.utm-visible {
    transform: translateY(0);
  }
  #utm-banner.utm-hiding {
    transform: translateY(calc(100% + 56px));
    transition: transform 0.34s cubic-bezier(0.55, 0, 0.8, 0.2);
  }
  .utm-inner {
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 11px;
  }
  .utm-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .utm-label {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #ff5e1f;
  }
  .utm-close {
    background: none;
    border: none;
    padding: 14px;
    margin: -14px -14px -14px 0;
    cursor: pointer;
    color: #5e5e68;
    font-size: 14px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    font-family: inherit;
    min-width: 44px;
    min-height: 44px;
  }
  .utm-close:hover { color: #9c9ca6; }
  .utm-msg {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 13px;
    color: #9c9ca6;
    line-height: 1.65;
    margin: 0;
  }
  .utm-cta {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11.5px;
    color: #ff5e1f;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: opacity 0.2s;
    display: inline-block;
  }
  .utm-cta:hover { opacity: 0.7; }
  @media (max-width: 480px) {
    #utm-banner { left: 16px; right: 16px; bottom: 16px; width: auto; max-width: none; }
  }
`

function BannerInner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [source, setSource] = useState<string | null>(null)
  const [hiding, setHiding] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const styleInjected = useRef(false)

  useEffect(() => {
    const utm = searchParams.get('utm_source')?.toLowerCase() ?? null
    if (!utm || !VARIANTS[utm]) return
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return

    if (!styleInjected.current) {
      if (!document.getElementById('utm-banner-styles')) {
        const s = document.createElement('style')
        s.id = 'utm-banner-styles'
        s.textContent = CSS
        document.head.appendChild(s)
      }
      styleInjected.current = true
    }

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
