import Link from 'next/link'
import type { Metadata } from 'next'
import LightHeader from './components/light-header'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects/all', label: 'All projects' },
  { href: '/projects/data', label: 'Data projects' },
  { href: '/projects/software', label: 'Software projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

/**
 * 404. Nothing is actually broken here, so the page carries the full header
 * and a real list of destinations: someone who has landed on a dead link
 * wants a way onward, not an apology.
 */
export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader />

      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[900px] flex-col justify-center px-5 py-20 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>404</p>

        <h1 className="mt-5 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em]">
          This page does not exist.
        </h1>

        <p className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-[#5A544C]">
          The link is broken, or the page moved. Nothing on your end.
        </p>

        <nav className="mt-12 border-t border-[#14120F]/15" aria-label="Site sections">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-baseline justify-between gap-6 border-b border-[#14120F]/15 py-4 transition-colors hover:bg-[#EAEAE6] md:px-3"
            >
              <span className="text-[15px] font-semibold transition-colors group-hover:text-[#C13E00]">{l.label}</span>
              <span
                aria-hidden="true"
                className="text-[13px] text-[#8A8378] transition-transform group-hover:translate-x-1 group-hover:text-[#C13E00]"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  )
}
