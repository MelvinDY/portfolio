"use client"

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const INK = '#F2EAE0'
const ACID = '#ff5e1f'

const MANIFESTO: { t: string; acid?: boolean }[] = [
  { t: 'Raw' }, { t: 'data' }, { t: 'in' }, { t: '—' },
  { t: 'decisions', acid: true }, { t: 'out.' },
  { t: 'Ideas' }, { t: 'in' }, { t: '—' },
  { t: 'shipped' }, { t: 'products', acid: true }, { t: 'out.' },
]

const FRAGS: { txt: string; style: CSSProperties; depth: number; acid?: boolean }[] = [
  { txt: 'fig. 01 — a chart that lands', style: { top: '21%', left: '5%' }, depth: 0.5 },
  { txt: '“make it obvious”', style: { top: '66%', left: '11%' }, depth: 1.15, acid: true },
  { txt: 'appendix b — five hackathons', style: { top: '29%', right: '7%' }, depth: 0.8 },
  { txt: 'p. 26 — graduation', style: { top: '72%', right: '13%' }, depth: 0.6, acid: true },
  { txt: '1.2M rows, annotated', style: { top: '47%', left: '3%' }, depth: 1.3 },
  { txt: 'est. unsw — computer science', style: { top: '55%', right: '3%' }, depth: 0.95 },
]

const chars = (word: string) =>
  word.split('').map((c, i) => (
    <span className="h3-ch" key={i}>{c}</span>
  ))

export default function TeHero() {
  const scope = useRef<HTMLElement>(null)
  const pctRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = scope.current
    if (!el) return

    // always open the story at act i — don't let the browser restore a
    // mid-pin scroll position on reload
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('h3-static')
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ENTRANCE — plays once on load
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.h3-tick', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.06 }, 0)
        .from('.h3-hud > span', { y: -12, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.1)
        .from('.h3-pre', { opacity: 0, y: 14, duration: 0.6 }, 0.25)
        .from('.h3-n1 .h3-ch', { yPercent: 140, duration: 1.05, stagger: 0.045 }, 0.35)
        .from('.h3-n2 .h3-ch', { yPercent: 140, duration: 1.05, stagger: 0.045 }, 0.5)
        .from('.h3-sub', { opacity: 0, letterSpacing: '0.6em', duration: 0.9 }, 1.0)
        .from('.h3-frag', { opacity: 0, duration: 1.2, stagger: 0.08 }, 0.8)
        .from('.h3-rail', { scaleY: 0, transformOrigin: 'top', duration: 1 }, 0.9)

      // SCROLL SCRUB — hero pins while the three acts play
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            if (pctRef.current) {
              pctRef.current.textContent = String(Math.round(self.progress * 100)).padStart(3, '0')
            }
          },
        },
        defaults: { ease: 'none' },
      })

      scrub
        // act i — camera pushes through the name
        .to('.h3-a', { scale: 1.55, opacity: 0, filter: 'blur(9px)', ease: 'power1.in', duration: 3 }, 0)
        // act ii — manifesto fades in, words ink up one by one, then lifts away
        .fromTo('.h3-b', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'power1.out', duration: 1.2 }, 2.2)
        .to('.h3-w', { color: (i, t) => (t as HTMLElement).dataset.fill || INK, duration: 0.35, stagger: 0.26 }, 3.0)
        .to('.h3-b', { opacity: 0, y: -70, ease: 'power1.in', duration: 1.2 }, 6.6)
        // act iii — the directory
        .set('.h3-c', { pointerEvents: 'auto' }, 7.3)
        .fromTo('.h3-c', { opacity: 0 }, { opacity: 1, ease: 'power1.out', duration: 0.9 }, 7.3)
        .fromTo('.h3-dirk', { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.6 }, 7.4)
        .fromTo('.h3-drow', { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8, stagger: 0.3 }, 7.5)
        // continuous instruments across the whole pin
        .fromTo('.h3-scan', { top: '10%' }, { top: '90%', duration: 10 }, 0)
        .fromTo('.h3-rail-dot', { top: '0%' }, { top: '98%', duration: 10 }, 0)
        .to('.h3-frag', { yPercent: (i, t) => -90 * parseFloat((t as HTMLElement).dataset.depth || '1'), duration: 10 }, 0)
        // hold the directory settled before unpinning
        .to({}, { duration: 1.2 })

      // pointer drift on the name
      if (window.matchMedia('(pointer:fine)').matches) {
        const xTo = gsap.quickTo('.h3-name', 'x', { duration: 0.9, ease: 'power3' })
        const yTo = gsap.quickTo('.h3-name', 'y', { duration: 0.9, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          xTo(((e.clientX / window.innerWidth) - 0.5) * 26)
          yTo(((e.clientY / window.innerHeight) - 0.5) * 16)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      }
    }, scope)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero3" id="top" ref={scope}>
      {/* instruments */}
      <div className="h3-grid" aria-hidden="true" />
      <div className="h3-scan" aria-hidden="true" />
      <i className="h3-tick tl" aria-hidden="true" />
      <i className="h3-tick tr" aria-hidden="true" />
      <i className="h3-tick bl" aria-hidden="true" />
      <i className="h3-tick br" aria-hidden="true" />
      <div className="h3-rail" aria-hidden="true"><i className="h3-rail-dot" /></div>

      {FRAGS.map((f) => (
        <span
          key={f.txt}
          className={`h3-frag${f.acid ? ' acid' : ''}`}
          style={f.style}
          data-depth={f.depth}
          aria-hidden="true"
        >
          {f.txt}
        </span>
      ))}

      {/* folio */}
      <div className="h3-hud mono" aria-hidden="true">
        <span className="h3-hud-tl">Melvin Yogiana — Portfolio</span>
        <span className="h3-hud-tr"><b className="h3-pct" ref={pctRef}>000</b>%</span>
        <span className="h3-hud-bl">Vol. 01 · 33.8688°S — 151.2093°E</span>
        <span className="h3-hud-br">scroll to read ↓</span>
      </div>

      <div className="h3-stage">
        {/* act i — the name */}
        <div className="h3-scene h3-a">
          <p className="h3-pre mono">[ a portfolio in three acts — sydney, au ]</p>
          <h1 className="h3-name" aria-label="Melvin Yogiana">
            <span className="h3-nline" aria-hidden="true"><span className="h3-nword h3-n1">{chars('Melvin')}</span></span>
            <span className="h3-nline h3-nline-b" aria-hidden="true">
              <span className="h3-nword h3-n2">{chars('Yogiana')}<span className="h3-ch h3-dot">.</span></span>
            </span>
          </h1>
          <p className="h3-sub mono">
            Data Analyst <span className="acid-text">·</span> Full-Stack Developer <span className="acid-text">·</span> UNSW Computer Science
          </p>
        </div>

        {/* act ii — the manifesto */}
        <div className="h3-scene h3-b">
          <p className="h3-man">
            {MANIFESTO.map((w, i) => (
              <span
                key={i}
                className={`h3-w${w.acid ? ' h3-w-acid' : ''}`}
                data-fill={w.acid ? ACID : INK}
              >
                {w.t}{' '}
              </span>
            ))}
          </p>
        </div>

        {/* act iii — the index */}
        <div className="h3-scene h3-c">
          <p className="h3-dirk mono">[ the index ]</p>
          <nav className="h3-dir" aria-label="Quick links">
            <Link className="h3-drow" href="/projects/data" data-cursor="open ↗">
              <span className="h3-dno mono">№ 01</span>
              <span className="h3-dt">Data Projects</span>
              <span className="h3-dm mono">4 case studies</span>
              <span className="h3-darr">↗</span>
            </Link>
            <Link className="h3-drow" href="/projects/software" data-cursor="open ↗">
              <span className="h3-dno mono">№ 02</span>
              <span className="h3-dt">Software Projects</span>
              <span className="h3-dm mono">4 builds</span>
              <span className="h3-darr">↗</span>
            </Link>
            <a className="h3-drow" href="#contact" data-cursor="go ↓">
              <span className="h3-dno mono">№ 03</span>
              <span className="h3-dt">Contact</span>
              <span className="h3-dm mono">say hello</span>
              <span className="h3-darr">↗</span>
            </a>
          </nav>
        </div>
      </div>
    </section>
  )
}
