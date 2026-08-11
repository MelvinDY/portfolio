"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

/**
 * Trailing cursor dot that morphs into a labelled pill over any element
 * carrying a data-cursor attribute (e.g. data-cursor="open ↗").
 * Desktop pointers only; the native cursor stays visible.
 *
 * Mounted once in the root layout, so it is present on every route. It is
 * additive rather than a replacement: nothing sets `cursor: none`, the real
 * pointer is always there, and the effect sits behind (pointer:fine) and
 * prefers-reduced-motion. Position is driven by gsap.quickTo rather than React
 * state, so pointer movement never re-renders the tree.
 */

/** The dungeon is a pointer-driven game. A second dot chasing the pointer
 *  during play is noise, not personality. */
const MUTED_ROUTES = ['/dungeon']

export default function TeCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const muted = MUTED_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`))

  useEffect(() => {
    const el = ref.current
    if (!el || muted) return
    if (!window.matchMedia('(pointer:fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.display = 'block'
    const label = el.querySelector<HTMLElement>('.tc-label')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })

    let current: string | null = null
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('vis')
      const target = (e.target as Element | null)?.closest?.('[data-cursor]')
      const next = target?.getAttribute('data-cursor') ?? null
      if (next !== current) {
        current = next
        if (next && label) {
          label.textContent = next
          el.classList.add('on')
        } else {
          el.classList.remove('on')
        }
      }
    }
    const onLeave = () => el.classList.remove('vis')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
    /* Re-runs on navigation so the dot resets its label between routes rather
       than carrying the last page's word into the next one. */
  }, [muted, pathname])

  if (muted) return null

  return (
    <div ref={ref} className="te-cursor" aria-hidden="true" style={{ display: 'none' }}>
      <div className="tc-pill"><span className="tc-label" /></div>
    </div>
  )
}
