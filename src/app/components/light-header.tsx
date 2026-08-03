"use client"

import { useState } from 'react'
import Link from 'next/link'

/**
 * Header for the light catalogue page.
 *
 * The site's TeHeader is built for the dark ground and cannot simply be
 * recoloured, so this is its light counterpart. Same links, same order, same
 * labels: Section 11.C says nav labels stay stable across a redesign for SEO
 * and for muscle memory.
 *
 * One line at 64px on desktop, per 4.7. Below md it collapses to a disclosure
 * rather than hiding the nav entirely, which is what the preview did.
 */

const NAV = [
  { href: '/projects/data', label: 'Data' },
  { href: '/projects/software', label: 'Software' },
  { href: '/projects/all', label: 'All Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

export default function LightHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#14120F]/12 bg-[#F3F3F1]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/" className="text-[15px] font-semibold tracking-tight" onClick={() => setOpen(false)}>
          Melvin<span className="text-[#C13E00]">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" style={mono}>
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? 'page' : undefined}
              className={`text-[12.5px] transition-colors hover:text-[#C13E00] ${active === n.href ? 'text-[#C13E00]' : 'text-[#5A544C]'}`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/#contact" className="text-[12.5px] font-semibold text-[#14120F] transition-colors hover:text-[#C13E00]">
            Contact
          </Link>
        </nav>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] border border-[#14120F]/15 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`block h-px w-4 bg-[#14120F] transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`block h-px w-4 bg-[#14120F] transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#14120F]/12 bg-[#F3F3F1] px-5 pb-5 pt-2 md:hidden" style={mono}>
          {[...NAV, { href: '/#contact', label: 'Contact' }].map(n => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={active === n.href ? 'page' : undefined}
              className={`block border-b border-[#14120F]/10 py-3 text-[14px] last:border-b-0 ${active === n.href ? 'text-[#C13E00]' : 'text-[#5A544C]'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
