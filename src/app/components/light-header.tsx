"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * The site header. One component for every page, so the nav cannot drift.
 *
 * Same links, same order, same labels everywhere: Section 11.C says nav labels
 * stay stable across a redesign for SEO and for muscle memory.
 *
 * One line at 64px on desktop, per 4.7. Below md it collapses to a disclosure
 * rather than hiding the nav entirely.
 *
 * `overlay` is for the home page alone. That page opens on a full-bleed hero
 * whose height the scroll animation measures, so the header floats instead of
 * taking 64px out of the flow, and it stays transparent until you scroll off
 * the hero rather than laying a hairline across the artwork. Appearance once
 * scrolled is identical to the in-flow version.
 */

const NAV = [
  { href: '/projects/data', label: 'Data' },
  { href: '/projects/software', label: 'Software' },
  { href: '/projects/all', label: 'All Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

export default function LightHeader({ active, overlay = false }: { active?: string; overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  /* Off the hero, or open on mobile, the plate is the same one every other
     page wears. Over the hero it is invisible. */
  const plated = !overlay || scrolled || open

  return (
    <header
      className={`${overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0'} z-40 border-b transition-colors duration-300 ${
        plated
          ? 'border-[#14120F]/12 bg-[#F3F3F1]/92 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
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
          {/* The one thing a recruiter arrives looking for, so it is the only
              item in the bar that reads as a button rather than a link. It
              points at /resume rather than straight at the file: the page
              carries the same content in HTML, which is indexable and readable
              on a phone, and offers the PDF from there. */}
          <Link
            href="/resume"
            aria-current={active === '/resume' ? 'page' : undefined}
            className="border border-[#14120F]/25 px-3 py-1.5 text-[12.5px] font-semibold text-[#14120F] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
          >
            Resume
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
          {[...NAV, { href: '/#contact', label: 'Contact' }, { href: '/resume', label: 'Resume' }].map(n => (
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
