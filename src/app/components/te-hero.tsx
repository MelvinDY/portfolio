"use client"

import { useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DungeonDot from './dungeon-dot'
import { usePulse } from '../lib/use-pulse'
import { HOME_INDEX, entryContents } from '../data/home-index'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Read a live theme token, with the dark-theme value as the fallback.
 *
 *  Both colours here used to be hardcoded, and both broke on the light ground
 *  for the same reason: the ink was '#F2EAE0', so the words animated to
 *  near-white on near-white, and the accent was '#ff5e1f', which reads 2.75:1
 *  on this surface and fails even the 3:1 large-text bar. The timing, stagger
 *  and easing of those tweens are unchanged; only the colour they resolve to. */
const token = (name: string, fallback: string) => {
  const root = document.querySelector('.te-home')
  const v = root ? getComputedStyle(root).getPropertyValue(name).trim() : ''
  return v || fallback
}
const inkToken = () => token('--ink', '#F2EAE0')
const acidToken = () => token('--acid', '#ff5e1f')

const MANIFESTO: { t: string; acid?: boolean }[] = [
  { t: 'Raw' }, { t: 'data' }, { t: 'in,' }, { t: 'then' },
  { t: 'decisions', acid: true }, { t: 'out.' },
  { t: 'Ideas' }, { t: 'in,' }, { t: 'then' },
  { t: 'shipped' }, { t: 'products', acid: true }, { t: 'out.' },
]

/**
 * Per-line weight range for the pointer wave. The resting value is what the
 * name looks like with no pointer in the room — the wave is symmetric around
 * it, so the composition is never lighter or heavier overall, only alive.
 */
const WEIGHT = {
  sans: { rest: 600, near: 700, far: 520 },
  serif: { rest: 400, near: 620, far: 330 },
}
/** How far the wave reaches, in px. */
const WAVE_RADIUS = 260

const chars = (word: string) =>
  word.split('').map((c, i) => (
    <span className="h3-ch" key={i}>{c}</span>
  ))


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
        // the plate belongs to act i — it recedes as the manifesto takes over,
        // leaving acts ii and iii on clean --bg. It lives outside .h3-stage, so
        // it holds still while the name scales past it.
        .to('.h3-plate, .h3-plate-acid, .h3-scrim', { opacity: 0, ease: 'power1.in', duration: 2 }, 2.2)
        // act ii — manifesto fades in, words ink up one by one, then lifts away
        .fromTo('.h3-b', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'power1.out', duration: 1.2 }, 2.2)
        .to('.h3-w', { color: (i, t) => ((t as HTMLElement).dataset.fill === 'acid' ? acidToken() : inkToken()), duration: 0.35, stagger: 0.26 }, 3.0)
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

      /* ── pointer instruments: name drift, weight wave, grid spotlight ──
         All three ride one listener and one rAF. The wave reads each glyph's
         box straight from the DOM rather than caching it, because GSAP is
         already moving the name — a cached centre would be wrong by exactly
         the drift we just applied. */
      if (window.matchMedia('(pointer:fine)').matches) {
        const xTo = gsap.quickTo('.h3-name', 'x', { duration: 0.9, ease: 'power3' })
        const yTo = gsap.quickTo('.h3-name', 'y', { duration: 0.9, ease: 'power3' })
        const glyphs = Array.from(el.querySelectorAll<HTMLElement>('.h3-ch'))
        const serif = new WeakMap<HTMLElement, boolean>()
        glyphs.forEach(g => serif.set(g, !!g.closest('.h3-n2')))

        let px = 0, py = 0, queued = false, waving = false

        const restWeights = () => {
          glyphs.forEach(g => {
            const w = WEIGHT[serif.get(g) ? 'serif' : 'sans'].rest
            g.style.fontVariationSettings = `"wght" ${w}`
          })
        }

        const frame = () => {
          queued = false
          // Once the camera starts pushing through the name the glyph boxes are
          // mid-scale and the wave stops meaning anything — settle and stand down.
          const inActI = window.scrollY < window.innerHeight * 0.35
          if (!inActI) {
            if (waving) { restWeights(); waving = false }
            return
          }
          waving = true
          for (const g of glyphs) {
            const r = g.getBoundingClientRect()
            const dx = px - (r.left + r.width / 2)
            const dy = py - (r.top + r.height / 2)
            const d = Math.min(Math.hypot(dx, dy) / WAVE_RADIUS, 1)
            const falloff = 1 - d * d // eased, so the crest is broad and the tail flat
            const { near, far } = WEIGHT[serif.get(g) ? 'serif' : 'sans']
            g.style.fontVariationSettings = `"wght" ${Math.round(far + (near - far) * falloff)}`
          }
        }

        const onMove = (e: PointerEvent) => {
          px = e.clientX
          py = e.clientY
          xTo(((px / window.innerWidth) - 0.5) * 26)
          yTo(((py / window.innerHeight) - 0.5) * 16)
          el.style.setProperty('--gx', `${px}px`)
          el.style.setProperty('--gy', `${py}px`)
          el.classList.add('spot-on')
          if (!queued) { queued = true; requestAnimationFrame(frame) }
        }
        const onLeave = () => {
          el.classList.remove('spot-on')
          restWeights()
          waving = false
        }

        restWeights()
        window.addEventListener('pointermove', onMove)
        document.addEventListener('pointerleave', onLeave)
        return () => {
          window.removeEventListener('pointermove', onMove)
          document.removeEventListener('pointerleave', onLeave)
          glyphs.forEach(g => { g.style.fontVariationSettings = '' })
        }
      }
    }, scope)

    return () => ctx.revert()
  }, [])

  /* The live plate. Falls back to the fixed coordinates until the pulse lands,
     so the HUD never renders empty and never shifts. */
  const hudLive = pulse
    ? `Vol. 01 · ${pulse.live} reading now · ${pulse.viewsToday} ${pulse.viewsToday === 1 ? 'view' : 'views'} today`
    : 'Vol. 01 · 33.8688°S, 151.2093°E'

  const place = pulse?.city ?? (pulse?.country ? regionName(pulse.country) : null)
  const greeting = pulse
    ? `reader № ${pulse.rank} today${place ? `, hello ${place} 👋` : ''}`
    : ''


  return (
    <section className="hero3" id="top" ref={scope}>
      {/* instruments — the plate sits first so DOM order puts it under everything */}
      <div className="h3-plate" aria-hidden="true" />
      <div className="h3-plate-acid" aria-hidden="true" />
      <div className="h3-scrim" aria-hidden="true" />
      <div className="h3-grid" aria-hidden="true" />
      <div className="h3-spot" aria-hidden="true" />
      <div className="h3-scan" aria-hidden="true" />
      <i className="h3-tick tl" aria-hidden="true" />
      <i className="h3-tick tr" aria-hidden="true" />
      <i className="h3-tick bl" aria-hidden="true" />
      <i className="h3-tick br" aria-hidden="true" />

      {/* folio */}
      <div className="h3-hud mono" aria-hidden="true">
        <span className="h3-hud-tl">Melvin Yogiana, Portfolio</span>
        <span className="h3-hud-bl">
          {pulse && <i className="h3-hud-dot" />}
          {hudLive}
        </span>
        <span className="h3-hud-br">scroll to read ↓</span>
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
          {/* Height is reserved whether or not the pulse ever lands. */}
          <p className={`h3-you mono${pulse ? ' on' : ''}`} aria-live="polite">{greeting}</p>
        </div>

        {/* act ii — the manifesto */}
        <div className="h3-scene h3-b">
          <p className="h3-man">
            {MANIFESTO.map((w, i) => (
              <span
                key={i}
                className={`h3-w${w.acid ? ' h3-w-acid' : ''}`}
                /* A marker, not a colour: the tween resolves it against the
                   live theme so a hex cannot be baked in at render time. */
                data-fill={w.acid ? 'acid' : undefined}
              >
                {w.t}{' '}
              </span>
            ))}
          </p>
        </div>

        {/* act iii — the index.
            No ordinals: these are four kinds of destination, not four steps,
            and numbering them asserted a sequence that was never there. The
            contents are printed rather than held behind a hover, because the
            card that used to hold them was display:none below 1180px, so the
            most useful thing here was the thing a phone could never reach.
            Pointing at a row brings a card alongside it, anchored inside the
            row so it arrives beside whatever summoned it and leaves with it.
            Where there is no room for the card the printed run is already
            carrying the same information, so nothing is lost. */}
        <div className="h3-scene h3-c">
          <p className="h3-dirk mono">[ the index ]</p>
          <nav className="ix-open ix-pop-card" aria-label="Quick links">
            {HOME_INDEX.map(entry => {
              const items = entryContents(entry, pulse)
              const props = {
                className: 'h3-drow ix-open-row',
                'data-cursor': entry.cursor,
                children: (
                  <>
                    <span className="ix-open-head">
                      <span className="h3-dt">{entry.title}</span>
                      <span className="ix-open-meta mono">{entry.meta}</span>
                      <span className="h3-darr">↗</span>
                    </span>
                    <span className="ix-open-list mono">{items.join(', ')}</span>
                    <span className="ix-card mono" aria-hidden="true">
                      <span className="ix-card-k">{entry.meta}</span>
                      {items.map(item => <span key={item} className="ix-card-i">{item}</span>)}
                    </span>
                  </>
                ),
              }
              return entry.nav === 'link'
                ? <Link key={entry.title} href={entry.href} {...props} />
                : <a key={entry.title} href={entry.href} {...props} />
            })}
          </nav>
        </div>
      </div>
    </section>
  )
}

function regionName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}
