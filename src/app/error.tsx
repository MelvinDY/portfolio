"use client"

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Route-level error boundary. Catches throws from the client components that
 * carry most of this site's behaviour (the GSAP hooks, the Three.js canvases,
 * the dungeon) so a single bad frame doesn't drop a visitor on Next's default
 * error screen.
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

  return (
    <div className="te-home">
      <main className="err-wrap">
        <div className="wrap">
          <span className="err-code mono">[ error ]</span>
          <h1 className="err-head">
            Something<br /><em>broke.</em>
          </h1>
          <p className="err-note">
            This one&apos;s on me, not you. Try again — and if it keeps happening,
            I&apos;d genuinely like to know.
          </p>
          {error.digest && (
            <p className="err-digest mono">reference: {error.digest}</p>
          )}
          <div className="err-links">
            <button type="button" onClick={reset} className="err-link mono">
              try again <span className="arrow" aria-hidden="true">↻</span>
            </button>
            <Link href="/" className="err-link mono">
              home <span className="arrow" aria-hidden="true">↗</span>
            </Link>
            <a href="mailto:melvindarialyogiana@gmail.com" className="err-link mono">
              tell me <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
