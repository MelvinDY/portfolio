"use client"

import { useEffect } from 'react'

/**
 * Last-resort boundary: this fires when the root layout itself throws, which
 * means it replaces the layout entirely and must render its own <html>/<body>.
 *
 * Styles are inline on purpose. If the failure was in the layout, the font
 * variables and globals.css class names it sets up cannot be relied on, so this
 * page hard-codes everything it needs to stay legible.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global error]', error)
  }, [error])

  return (
    <html lang="en-AU">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0907',
          color: '#F2EAE0',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '560px' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ff5e1f',
              margin: '0 0 20px',
            }}
          >
            [ error ]
          </p>
          <h1
            style={{
              fontSize: 'clamp(34px, 7vw, 60px)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              fontWeight: 600,
              margin: '0 0 20px',
            }}
          >
            Something broke.
          </h1>
          <p style={{ color: '#a89c8f', lineHeight: 1.6, margin: '0 0 28px' }}>
            The site failed to load properly. Reloading usually fixes it.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '12.5px',
                color: '#F2EAE0',
                background: 'transparent',
                border: '1px solid #2b241e',
                borderRadius: '999px',
                padding: '12px 22px',
                cursor: 'pointer',
              }}
            >
              try again ↻
            </button>
            {/* Deliberately a plain <a>, not next/link: the root layout has
                failed, so client-side navigation cannot be trusted. A full
                document load is the whole point of this button. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '12.5px',
                color: '#F2EAE0',
                textDecoration: 'none',
                border: '1px solid #2b241e',
                borderRadius: '999px',
                padding: '12px 22px',
              }}
            >
              home ↗
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
