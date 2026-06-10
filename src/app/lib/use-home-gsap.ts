"use client"

import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * ScrollTrigger choreography for the homepage sections below the hero.
 *
 * Opt-in via data attributes:
 *  - data-rise        — element rises in once when scrolled into view
 *  - data-rise-group  — direct children rise in with a stagger
 *  - data-lines       — .lr-in line wrappers reveal through clip masks
 *  - data-ink         — .iw word spans ink up, scrubbed to scroll position
 */
export function useHomeGsap() {
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-ink]').forEach((p) => p.classList.add('ink-done'))
      document.querySelector('.hz')?.classList.add('hz-static')
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    // Class-driven reveals: GSAP only fires the trigger; the motion lives in CSS
    // transitions, so an interrupted animation can never strand elements
    // half-translated. After the transition settles, the classes are removed so
    // hover transitions return to their natural timing.
    const cleanups: ReturnType<typeof setTimeout>[] = []
    const reveal = (els: HTMLElement[], prepClass: string) => {
      els.forEach((el, i) => {
        el.classList.add(prepClass)
        if (i) el.style.transitionDelay = `${i * 0.12}s`
      })
      return () => {
        requestAnimationFrame(() => els.forEach((el) => el.classList.add('gs-in')))
        cleanups.push(setTimeout(() => {
          els.forEach((el) => {
            el.classList.remove(prepClass, 'gs-in')
            el.style.transitionDelay = ''
          })
        }, els.length * 120 + 1200))
      }
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: reveal([el], 'gs-prep') })
      })

      gsap.utils.toArray<HTMLElement>('[data-rise-group]').forEach((group) => {
        const kids = Array.from(group.children) as HTMLElement[]
        ScrollTrigger.create({ trigger: group, start: 'top 84%', once: true, onEnter: reveal(kids, 'gs-prep') })
      })

      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
        const lines = Array.from(el.querySelectorAll<HTMLElement>('.lr-in'))
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: reveal(lines, 'gs-prep-line') })
      })

      gsap.utils.toArray<HTMLElement>('[data-ink]').forEach((p) => {
        gsap.to(p.querySelectorAll<HTMLElement>('.iw'), {
          color: (i, t) => (t as HTMLElement).dataset.fill || '#F2EAE0',
          stagger: 0.2, ease: 'none',
          scrollTrigger: { trigger: p, start: 'top 75%', end: 'top 25%', scrub: true },
        })
      })

      // work shelf — pinned horizontal scrub
      const hz = document.querySelector<HTMLElement>('.hz')
      const track = document.querySelector<HTMLElement>('.hz-track')
      if (hz && track) {
        const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth)
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: hz,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }
    })

    return () => {
      cleanups.forEach(clearTimeout)
      ctx.revert()
    }
  }, [])
}
