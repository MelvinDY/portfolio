"use client"

import { useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DungeonDot from './dungeon-dot'
import { fillToken } from '../lib/theme-tokens'
import { usePulse, type Pulse } from '../lib/use-pulse'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* The manifesto is one claim made twice: something raw goes in, something
   finished comes out. Grouping it into clauses rather than one flat word list
   lets each half sit on its own line block, so the parallel reads as parallel
   instead of wrapping wherever the viewport happens to break it.

   The dashes that used to stand between in and out are gone. They were their
   own entries in this array, which meant the scrub spent a full stagger beat
   inking a punctuation mark. ", then" carries the same turn and belongs to the
   word before it. */
const MANIFESTO: { t: string; acid?: boolean }[][] = [
  [
    { t: 'Raw' }, { t: 'data' }, { t: 'in,' }, { t: 'then' },
    { t: 'decisions', acid: true }, { t: 'out.' },
  ],
  [
    { t: 'Ideas' }, { t: 'in,' }, { t: 'then' },
    { t: 'shipped' }, { t: 'products', acid: true }, { t: 'out.' },
  ],
]

const chars = (word: string) =>
  word.split('').map((c, i) => (
    <span className="h3-ch" key={i}>{c}</span>
  ))

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/**
 * What the folio prints, and when.
 *
 * Three states rather than one string. Before the pulse lands there is nothing
 * true to say, so it holds the volume mark. With nobody else on the site,
 * "0 reading now" broadcasts an empty room, so the count is dropped and the
 * day's views carry the line on their own. Only a real reader lights the dot.
 */
const folio = (p: Pulse | null) => {
  if (!p) return 'Vol. 01'
  const today = `${plural(p.viewsToday, 'view', 'views')} today`
  return p.live > 0 ? `${plural(p.live, 'reading', 'reading')} now, ${today}` : today
}

export default function TeHero() {
  const scope = useRef<HTMLElement>(null)
  const pulse = usePulse()

  useIsomorphicLayoutEffect(() => {
    const el = scope.current
    if (!el) return

    // always open the story at act i — don't let the browser restore a
    // mid-pin scroll position on reload
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    /* Hand the entrance over from CSS to GSAP.
       The markup ships as data-intro="pending", which is the entrance's own
       start state written in CSS, so the server-rendered paint already has the
       name below its mask. Without it the name painted in place, hydration ran
       and .from() snapped it down, and it animated back: a jumpy enter, and the
       one thing on the page a reader is most likely to be looking at.
       Flipping the attribute stops those rules matching. GSAP's inline start
       values are visually identical, so the handover is invisible. */
    el.dataset.intro = 'running'

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

      // SCROLL SCRUB — hero pins while the three acts play
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      })

      scrub
        // act i — camera pushes through the name
        .to('.h3-a', { scale: 1.55, opacity: 0, filter: 'blur(9px)', ease: 'power1.in', duration: 3 }, 0)
        // act ii — manifesto fades in, words ink up one by one, then lifts away
        .fromTo('.h3-b', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'power1.out', duration: 1.2 }, 2.2)
        .to('.h3-w', { color: (i, t) => fillToken((t as HTMLElement).dataset.fill), duration: 0.35, stagger: 0.26 }, 3.0)
        .to('.h3-b', { opacity: 0, y: -70, ease: 'power1.in', duration: 1.2 }, 6.6)
        // act iii — the directory
        .set('.h3-c', { pointerEvents: 'auto' }, 7.3)
        .fromTo('.h3-c', { opacity: 0 }, { opacity: 1, ease: 'power1.out', duration: 0.9 }, 7.3)
        .fromTo('.h3-dirk', { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.6 }, 7.4)
        .fromTo('.h3-drow', { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8, stagger: 0.3 }, 7.5)
        // continuous instruments across the whole pin
        .fromTo('.h3-scan', { top: '10%' }, { top: '90%', duration: 10 }, 0)
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
    <section className="hero3" id="top" ref={scope} data-intro="pending">
      {/* instruments */}
      <div className="h3-grid" aria-hidden="true" />
      <div className="h3-scan" aria-hidden="true" />
      <i className="h3-tick tl" aria-hidden="true" />
      <i className="h3-tick tr" aria-hidden="true" />
      <i className="h3-tick bl" aria-hidden="true" />
      <i className="h3-tick br" aria-hidden="true" />

      {/* Folio. The bottom mark used to print the Sydney coordinates, which is
          decoration wearing the costume of data, and the bottom right told the
          reader to scroll, which they were about to do anyway. The strip now
          reports what the site actually knows about the room it is in.

          The dot element is always rendered and only changes class when the
          pulse lands, so the entrance timeline never loses a target mid-flight.
          Still aria-hidden: this is folio furniture, and a number that changes
          under a reader is worse than silence. */}
      <div className="h3-hud mono" aria-hidden="true">
        <span className="h3-hud-tl">Melvin Yogiana, Portfolio</span>
        <span className="h3-hud-bl">
          <i className={`h3-hud-dot${pulse && pulse.live > 0 ? ' on' : ''}`} />
          {folio(pulse)}
        </span>
      </div>

      <div className="h3-stage">
        {/* act i — the name */}
        <div className="h3-scene h3-a">
          <p className="h3-pre mono">[ data analyst · full-stack dev, sydney au ]</p>
          <h1 className="h3-name">
            {/*
              The visible name is split per-character for the GSAP reveal and
              hidden from a11y, so the only machine-readable copy of the name
              lives here. It carries the full legal name — the display keeps
              its two-line "Melvin / Yogiana" composition.
            */}
            <span className="sr-only">Melvin Darial Yogiana</span>
            <span className="h3-nline" aria-hidden="true"><span className="h3-nword h3-n1">{chars('Melvin')}</span></span>
            <span className="h3-nline h3-nline-b" aria-hidden="true">
              {/* the period is the door — hover it, or tap it on mobile */}
              <span className="h3-nword h3-n2">{chars('Yogiana')}<DungeonDot /></span>
            </span>
          </h1>
          <p className="h3-sub mono">
            Data Analyst <span className="acid-text">·</span> Full-Stack Developer <span className="acid-text">·</span> UNSW Computer Science
          </p>
        </div>

        {/* act ii — the manifesto */}
        <div className="h3-scene h3-b">
          <p className="h3-man">
            {MANIFESTO.map((clause, ci) => (
              /* One block per clause. The .h3-w spans stay in document order
                 inside it, so the scrub's stagger is unchanged. */
              <span className="h3-mline" key={ci}>
                {clause.map((w, i) => (
                  <span
                    key={i}
                    className={`h3-w${w.acid ? ' h3-w-acid' : ''}`}
                    /* A marker, not a colour: the tween resolves it against the
                       live theme, so a hex cannot be baked in at render time. */
                    data-fill={w.acid ? 'acid' : undefined}
                  >
                    {w.t}{' '}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>

        {/* act iii — the index */}
        <div className="h3-scene h3-c">
          <p className="h3-dirk mono">[ the index ]</p>
          {/* No ordinals. These are four kinds of destination, not four steps,
              and numbering them asserted a sequence that was never there. */}
          <nav className="h3-dir" aria-label="Quick links">
            <Link className="h3-drow" href="/projects/data" data-cursor="open ↗">
              <span className="h3-dt">Data Projects</span>
              <span className="h3-dm mono">4 case studies</span>
              <span className="h3-darr" aria-hidden="true">↗</span>
            </Link>
            <Link className="h3-drow" href="/projects/software" data-cursor="open ↗">
              <span className="h3-dt">Software Projects</span>
              <span className="h3-dm mono">4 builds</span>
              <span className="h3-darr" aria-hidden="true">↗</span>
            </Link>
            <Link className="h3-drow" href="/stats" data-cursor="open ↗">
              <span className="h3-dt">The Data Room</span>
              <span className="h3-dm mono">live analytics</span>
              <span className="h3-darr" aria-hidden="true">↗</span>
            </Link>
            <a className="h3-drow" href="#contact" data-cursor="go ↓">
              <span className="h3-dt">Contact</span>
              <span className="h3-dm mono">say hello</span>
              <span className="h3-darr h3-darr-down" aria-hidden="true">↓</span>
            </a>
          </nav>
        </div>
      </div>
    </section>
  )
}
