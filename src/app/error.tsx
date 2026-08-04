"use client"

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Route-level error boundary. Catches throws from the client components that
 * carry most of this site's behaviour (the GSAP hooks, the Three.js canvases,
 * the dungeon) so a single bad frame does not drop a visitor on Next's default
 * error screen.
 *
 * Deliberately imports nothing from the site beyond Link. This page renders
 * precisely when something else has already thrown, so pulling in the shared
 * header, or anything else with its own state, adds a second thing that can
 * fail inside the handler for the first. Every colour here is inline for the
 * same reason: if the stylesheet is what broke, this page still reads.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[route error]', error)
  }, [error])

  const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#F3F3F1',
        color: '#14120F',
        fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <main style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '80px 20px' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C13E00', margin: 0 }}>
          Error
        </p>

        <h1
          style={{
            marginTop: 20,
            maxWidth: '14ch',
            fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          Something broke.
        </h1>

        <p style={{ marginTop: 28, maxWidth: '48ch', fontSize: 17, lineHeight: 1.6, color: '#5A544C' }}>
          This one is on me, not you. Try again, and if it keeps happening I would genuinely
          like to know.
        </p>

        {error.digest && (
          <p style={{ ...mono, marginTop: 20, fontSize: 12.5, color: '#8A8378' }}>
            Reference {error.digest}
          </p>
        )}

        <div style={{ marginTop: 44, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              ...mono,
              background: '#ff5e1f',
              color: '#1c0d03',
              border: 0,
              padding: '13px 26px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{ ...mono, fontSize: 13, color: '#5A544C', borderBottom: '1px solid rgba(20,18,15,0.3)', paddingBottom: 2 }}
          >
            Home
          </Link>
          <a
            href="mailto:melvindarialyogiana@gmail.com"
            style={{ ...mono, fontSize: 13, color: '#5A544C', borderBottom: '1px solid rgba(20,18,15,0.3)', paddingBottom: 2 }}
          >
            Tell me
          </a>
        </div>
      </main>
    </div>
  )
}
