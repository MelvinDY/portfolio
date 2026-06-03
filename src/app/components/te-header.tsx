"use client"

import { useState } from 'react'
import Link from 'next/link'

interface TeHeaderProps {
  activePage?: 'data' | 'software' | 'blog' | 'about'
}

export default function TeHeader({ activePage }: TeHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-head">
      <div className="wrap">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="dot" />
          <b>MELVIN</b><span className="slash">/</span><span className="dim">m3lv1n</span>
        </Link>
        <nav className="nav">
          <Link href="/projects/data" className={activePage === 'data' ? 'active' : ''}>Data</Link>
          <Link href="/projects/software" className={activePage === 'software' ? 'active' : ''}>Software</Link>
          <Link href="/blog" className={activePage === 'blog' ? 'active' : ''}>Blog</Link>
          <Link href="/about" className={activePage === 'about' ? 'active' : ''}>About</Link>
          <span className="sep" />
          <Link href="/#contact" className="acid-text">Contact</Link>
        </nav>
        <button
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav-mobile${open ? ' open' : ''}`}>
        <Link href="/projects/data" className={activePage === 'data' ? 'active' : ''} onClick={() => setOpen(false)}>Data</Link>
        <Link href="/projects/software" className={activePage === 'software' ? 'active' : ''} onClick={() => setOpen(false)}>Software</Link>
        <Link href="/blog" className={activePage === 'blog' ? 'active' : ''} onClick={() => setOpen(false)}>Blog</Link>
        <Link href="/about" className={activePage === 'about' ? 'active' : ''} onClick={() => setOpen(false)}>About</Link>
        <Link href="/#contact" className="acid-text" onClick={() => setOpen(false)}>Contact</Link>
      </div>
    </header>
  )
}
