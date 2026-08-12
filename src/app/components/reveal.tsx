"use client"

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll reveal.
 *
 * IntersectionObserver rather than a scroll listener, and the observer
 * disconnects on first intersection so nothing keeps running once an element
 * has arrived. Reduced motion collapses this to a plain wrapper with no
 * transform and no transition.
 */
export default function Reveal({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  // Starts true so the very first paint never animates for someone who asked
  // not to be animated at.
  const [reduce, setReduce] = useState(true)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (reduce) return <div ref={ref} className={className}>{children}</div>

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 620ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
