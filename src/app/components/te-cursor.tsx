"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Trailing cursor dot that morphs into a labelled pill over any element
 * carrying a data-cursor attribute (e.g. data-cursor="open ↗").
 * Desktop pointers only; the native cursor stays visible.
 */
export default function TeCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
  }, [])

  return (
    <div ref={ref} className="te-cursor" aria-hidden="true" style={{ display: 'none' }}>
      <div className="tc-pill"><span className="tc-label" /></div>
    </div>
  )
}
