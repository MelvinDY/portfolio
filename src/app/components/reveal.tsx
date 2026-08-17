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

    // threshold 0, not a ratio.
    //
    // A ratio threshold is unreachable once the element is taller than the
    // viewport divided by that ratio: asking for 12% of a 9,700px article to be
    // visible needs ~1,170px on screen at once, which a ~840px viewport can
    // never provide. The observer then never fires, `shown` stays false, and the
    // element sits at opacity 0 forever. That is exactly what happened to the
    // labour market case study when its content column grew past ~7,000px: the
    // whole article was in the DOM and invisible.
    //
    // Firing as soon as any part of the element intersects cannot fail that way,
    // and for anything shorter than the viewport it is a few pixels of scroll
    // different from the old behaviour.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0 },
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
