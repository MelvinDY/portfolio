import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/projects/data', label: 'data projects' },
  { href: '/projects/software', label: 'software projects' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
]

export default function NotFound() {
  return (
    <div className="te-home">
      <main className="err-wrap">
        <div className="wrap">
          <span className="err-code mono">[ 404 ]</span>
          <h1 className="err-head">
            This page<br /><em>doesn&apos;t exist.</em>
          </h1>
          <p className="err-note">
            The link is broken, or the page moved. Nothing on your end.
          </p>
          <nav className="err-links" aria-label="Site sections">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className="err-link mono">
                {l.label} <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </div>
  )
}
