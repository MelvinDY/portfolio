"use client"

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * Damped scrolling for the whole home page.
 *
 * The problem this solves is a seam, not a speed. The hero pin runs on
 * `scrub: 1`, which eases toward the scroll position rather than tracking it
 * exactly, so the cinema has weight and a little lag. The instant it unpins the
 * page reverted to raw 1:1 native scroll, and the change in texture read as the
 * page suddenly going light. Stretching the sections would not have fixed that,
 * because the mismatch is in how scrolling feels, not how far it goes.
 *
 * Lenis keeps the real window scroll position rather than transforming a
 * wrapper, which is why this integration is three lines and why ScrollTrigger's
 * pinning keeps working untouched: it is still reading the same scrollY it
 * always was. What changes is only how quickly that number chases the wheel.
 *
 * The one hard requirement is that Lenis and GSAP share a clock. Left on their
 * own rAF loops they tick in an undefined order, and a pinned element resolves
 * against a scroll position from the previous frame, which shows up as jitter
 * on exactly the pinned sections this page is built from.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Hijacking the wheel is the opposite of what a reduced-motion reader asked
    // for. They keep the browser's own scrolling.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      /* Damping. Lower is heavier: each frame closes this fraction of the gap
         to the target, so 0.085 trails the wheel a touch more than the 0.1
         default and lands closer to the hero scrub's own weight. */
      lerp: 0.085,
      /* Slightly under 1 so a wheel notch travels less than it does natively.
         This is the "slower" part; the damping above is the "smoother" part,
         and they are separate knobs on purpose. */
      wheelMultiplier: 0.85,
      /* Touch devices already have inertial scrolling from the OS, and damping
         on top of it feels like drag rather than weight. */
      smoothWheel: true,
      syncTouch: false,
      /* The #contact jump in the hero's index used to ride the CSS
         `scroll-behavior: smooth` that Lenis now has to switch off. Without
         this it would become an instant teleport, which is a second seam of
         exactly the kind this hook exists to remove. */
      anchors: true,
    })

    // Same clock for both, GSAP driving. Without this they run independent rAF
    // loops and the pins resolve a frame late.
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    /* The tick counter is a debugging handle, not decoration. Lenis calls
       preventDefault on the wheel and then scrolls from this callback, so if the
       callback ever stops firing the page cannot be scrolled at all, and the
       symptom is indistinguishable from Lenis being broken. It is usually
       neither: a hidden or background tab freezes rAF, which freezes the GSAP
       ticker, which freezes this. `__lenisTicks()` tells the two apart in one
       line. It self-heals when the tab becomes visible again. */
    let ticks = 0
    const raf = (time: number) => { ticks++; lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    if (process.env.NODE_ENV !== 'production') {
      Object.assign(window, { __lenis: lenis, __lenisTicks: () => ticks })
    }
    // GSAP's lag smoothing skips ticks after a slow frame, which makes Lenis
    // jump instead of glide.
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33) // GSAP's default
      lenis.destroy()
    }
  }, [])
}
