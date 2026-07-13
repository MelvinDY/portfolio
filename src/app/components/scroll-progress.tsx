"use client"

import { useEffect, useRef } from 'react'

/**
 * Fixed page-scroll counter for the home page — takes over the hero
 * HUD's top-right corner and persists to the end of the page (100% at
 * the footer). Reads live document height each frame so GSAP pin
 * spacers never throw the number off.
 */
export default function ScrollProgress() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      if (pctRef.current) {
        pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      }
      // stay out of the way of the hero entrance until the reader moves
      wrapRef.current?.classList.toggle('sp-on', window.scrollY > 40)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="scroll-progress mono" ref={wrapRef} aria-hidden="true">
      <b ref={pctRef}>000</b>%
    </div>
  )
}
