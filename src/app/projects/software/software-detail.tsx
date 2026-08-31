"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LightHeader from '../../components/light-header'
import type { ProjectDetail } from '../../data/project-details'

/**
 * The long version of one build, as a full page rather than a drawer.
 *
 * This replaces the slide-over sheet the page used to open. The sheet put a
 * 700px column over a dimmed index and then scrolled inside it, which meant the
 * screenshots — the reason anyone presses "See more" — were the smallest thing
 * on a 1440px screen. Here the record takes the whole viewport and the shot gets
 * the larger half of it.
 *
 * It covers the index rather than replacing it. Rendering it *instead of* the
 * index reads the same and is worse: unmounting the index throws away its scroll
 * offset and resets every Reveal on it, so closing the record dropped you at the
 * top of a page that then faded itself back in over 620ms. Opaque and fixed, the
 * index is simply still there when this goes away.
 *
 * On a desktop-sized window the page itself is locked to one viewport height, so
 * the plate is always fully visible and never scrolls out from under you. The
 * design this came from clamped the prose to fit the leftovers — three lines of
 * summary, two bullets — which looks tidy and quietly deletes the half of the
 * write-up that says why the build is interesting. So the record column scrolls
 * instead. The plate keeps its screen; the words stay reachable.
 *
 * Below md, or on a short window, the lock is dropped and the whole thing
 * scrolls like an ordinary page, because a locked layout on a phone is just a
 * cramped one.
 *
 * The plate is sized in JS rather than CSS. Fitting a *bordered* box to a
 * container by aspect ratio is the one thing `aspect-ratio` cannot do on its
 * own: fixing the height makes `max-width` break the ratio, and fixing the width
 * makes `max-height` break it. `object-fit` solves it for the image but then the
 * border sits around the letterbox instead of around the screenshot. So a
 * ResizeObserver measures the hole and the fit is computed.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

/* Phone shots are 1080×2400 as they come off the device. Framing them at their
   own ratio rather than a nominal 9:19.5 means nothing is cropped. */
const PHONE_RATIO = 9 / 20
const WIDE_RATIO = 16 / 9

export default function SoftwareDetail({
  detail, onClose, initialShot = 0,
}: {
  detail: ProjectDetail
  onClose: () => void
  /** Which shot to land on. The index page shows the whole contact sheet on
   *  the card, so clicking the fourth thumbnail should open the fourth shot
   *  rather than dropping you at the first and making you find it again. */
  initialShot?: number
}) {
  const [shot, setShot] = useState(initialShot)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [view, setView] = useState({ w: 1440, h: 900 })
  const observer = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const onResize = () => setView({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (detail.shots.length < 2) return
      if (e.key === 'ArrowRight') setShot(i => (i + 1) % detail.shots.length)
      if (e.key === 'ArrowLeft') setShot(i => (i - 1 + detail.shots.length) % detail.shots.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, detail.shots.length])

  useEffect(() => () => observer.current?.disconnect(), [])

  /* The index is still mounted underneath. Stop it scrolling behind the record,
     and give it its scrollbar back on the way out. */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const measure = useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect()
    if (!el) return
    const read = () => {
      const r = el.getBoundingClientRect()
      setBox(prev => (r.width === prev.w && r.height === prev.h ? prev : { w: r.width, h: r.height }))
    }
    observer.current = new ResizeObserver(read)
    observer.current.observe(el)
    read()
  }, [])

  /* Locked only when there is genuinely room for two columns of one screen. */
  const locked = view.w >= 768 && view.h >= 560

  const ratio = detail.shape === 'phone' ? PHONE_RATIO : WIDE_RATIO
  const fit = box.w && box.h
    ? (box.w / box.h > ratio ? { w: box.h * ratio, h: box.h } : { w: box.w, h: box.w / ratio })
    : { w: 0, h: 0 }

  const facts = ([
    ['Status', detail.status],
    ['Year', detail.year],
    ['Role', detail.role],
    ['Team', detail.team],
  ] as const).filter(([, v]) => v)

  const active = detail.shots[shot]

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[#F3F3F1] text-[#14120F] antialiased ${
        locked ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
    >
      <div className="shrink-0">
        <LightHeader active="/projects/software" />
      </div>

      {/* The way back, and where you are in the set. The header's nav is the
          same on every page by design, so the return path lives here instead. */}
      <div className="shrink-0 border-b border-[#14120F]/12">
        <div className="mx-auto flex h-11 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10" style={mono}>
          <button
            onClick={onClose}
            data-cursor="back"
            className="text-[12.5px] text-[#5A544C] transition-colors hover:text-[#C13E00]"
          >
            <span aria-hidden="true">&larr;</span> All software
          </button>
          <span className="hidden text-[11px] uppercase tracking-[0.14em] text-[#8A8378] md:inline">
            Esc to go back
          </span>
        </div>
      </div>

      <div
        className={`mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-6 md:grid-cols-[1.3fr_1fr] md:gap-[clamp(24px,3vw,56px)] md:px-10 ${
          locked ? 'min-h-0 flex-1 md:py-[clamp(16px,3vh,36px)]' : 'shrink-0'
        }`}
      >
        {/* The plate. */}
        {detail.shots.length > 0 && (
          <div className="flex min-h-0 min-w-0 flex-col items-center">
            <div
              ref={measure}
              className={`flex w-full items-center justify-center overflow-hidden ${
                locked ? 'min-h-0 flex-1' : 'aspect-[16/9]'
              }`}
            >
              <div
                className="relative shrink-0 overflow-hidden border border-[#14120F]/12 bg-[#EFEEEA]"
                style={locked
                  ? { width: fit.w, height: fit.h }
                  : { width: '100%', aspectRatio: String(ratio) }}
              >
                {detail.shots.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={i === shot ? s.alt : ''}
                    fill
                    sizes="(max-width:768px) 92vw, 60vw"
                    /* Every shot is fetched up front. They are all stacked in
                       the plate at opacity 0, so lazy loading defers them until
                       the moment they are revealed and the thumb click lands on
                       an empty frame. There are at most eight, and they are the
                       point of the page. */
                    priority={i === 0}
                    loading="eager"
                    className={`object-cover object-top transition-opacity duration-200 ${
                      i === shot ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden={i === shot ? undefined : true}
                  />
                ))}
                {detail.shots.length > 1 && (
                  <div
                    className="pointer-events-none absolute right-3 top-3 bg-[#14120F]/72 px-2.5 py-1 text-[11px] tabular-nums text-[#F3F3F1]"
                    style={mono}
                  >
                    {shot + 1} / {detail.shots.length}
                  </div>
                )}
              </div>
            </div>

            <p
              /* Two lines are reserved whether or not this caption needs them.
                 The plate is sized from what is left over, so a caption that
                 wraps on shot 2 and not on shot 1 would resize the screenshot
                 every time you changed shots. */
              className={`mt-3 shrink-0 text-[11.5px] leading-relaxed text-[#8A8378] ${
                locked ? 'line-clamp-2 min-h-[2.6em]' : ''
              }`}
              style={mono}
            >
              {active.caption}
            </p>

            {detail.shots.length > 1 && (
              <div className="mt-2.5 flex shrink-0 flex-wrap justify-center gap-2" role="tablist" aria-label="Screenshots">
                {detail.shots.map((s, i) => (
                  <button
                    key={s.src}
                    role="tab"
                    aria-selected={i === shot}
                    aria-label={s.caption}
                    onClick={() => setShot(i)}
                    className={`grid h-[34px] min-w-[46px] place-items-center border px-3 text-[11.5px] tabular-nums transition-colors ${
                      i === shot
                        ? 'border-[#C13E00] text-[#C13E00]'
                        : 'border-[#14120F]/18 text-[#8A8378] hover:border-[#14120F]/40'
                    }`}
                    style={mono}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* The record. */}
        <div
          className={`flex min-h-0 min-w-0 flex-col md:border-l md:border-[#14120F]/12 md:pl-[clamp(20px,2.4vw,40px)] ${
            detail.shots.length === 0 ? 'md:col-span-2 md:border-l-0 md:pl-0' : ''
          }`}
        >
          <div className="shrink-0">
            <p className="text-[12px] text-[#C13E00]" style={mono}>{detail.sub}</p>
            <h1 className="mt-3 text-[clamp(1.75rem,5vh,3.2rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              {detail.title}
            </h1>
          </div>

          <div className={`flex flex-col gap-[clamp(10px,2vh,18px)] py-[clamp(14px,2.4vh,24px)] ${locked ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}`}>
            <dl className="grid shrink-0 grid-cols-2 gap-x-5 gap-y-[clamp(7px,1.4vh,12px)]" style={mono}>
              {facts.map(([k, v]) => (
                <div key={k} className="border-t border-[#14120F]/15 pt-2">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-[#8A8378]">{k}</dt>
                  <dd className="mt-1.5 text-[12.5px] leading-snug">{v}</dd>
                </div>
              ))}
              <div className="col-span-2 border-t border-[#14120F]/15 pt-2">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-[#8A8378]">Stack</dt>
                <dd className="mt-1.5 text-[12.5px] leading-snug text-[#5A544C]">{detail.stack.join(', ')}</dd>
              </div>
            </dl>

            <p className="shrink-0 text-[clamp(12px,1.75vh,14.5px)] leading-relaxed text-[#5A544C]">
              {detail.summary}
            </p>

            {detail.pull && (
              <p className="shrink-0 border-l-2 border-[#ff5e1f] pl-4 text-[clamp(1rem,2.3vh,1.3rem)] font-medium leading-[1.3] tracking-[-0.015em]">
                {detail.pull}
              </p>
            )}

            {/* The decisions, not a feature list. The reasoning sits in its own
                column rather than welded onto the claim: read down the first
                column alone and you have the build in five lines; the other two
                are there for whoever wants them. Three columns only where the
                record column is actually wide enough for them — below lg it
                stacks, each part keeping a label so nothing loses its slot. */}
            <div className="flex shrink-0 flex-col">
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Decisions</h2>

              <div
                aria-hidden="true"
                style={mono}
                className="mt-[clamp(8px,1.4vh,12px)] hidden border-b border-[#14120F]/15 pb-1.5 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4"
              >
                {['Decision', 'Why', 'What it bought'].map(h => (
                  <span key={h} className="text-[9.5px] uppercase tracking-[0.16em] text-[#8A8378]">
                    {h}
                  </span>
                ))}
              </div>

              <ul className="flex flex-col lg:mt-0">
                {detail.decisions.map(d => (
                  <li
                    key={d.decision}
                    className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[#14120F]/12 py-[clamp(7px,1.3vh,11px)] text-[clamp(11.5px,1.6vh,13px)] leading-snug last:border-b-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-0"
                  >
                    <span className="col-span-2 font-medium text-[#14120F] lg:col-span-1">
                      {d.decision}
                    </span>

                    <span
                      style={mono}
                      className="pt-px text-[9.5px] uppercase tracking-[0.16em] text-[#8A8378] lg:hidden"
                    >
                      Why
                    </span>
                    <span className="text-[#5A544C]">{d.why}</span>

                    <span
                      style={mono}
                      className="pt-px text-[9.5px] uppercase tracking-[0.16em] text-[#8A8378] lg:hidden"
                    >
                      Bought
                    </span>
                    <span className="text-[#5A544C]">{d.bought}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-[#14120F]/15 pt-[clamp(12px,2vh,18px)]"
            style={mono}
          >
            {detail.links.map(l => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={`${l.label.toLowerCase()} ↗`}
                className={
                  l.primary
                    ? 'inline-flex min-h-[38px] items-center whitespace-nowrap bg-[#ff5e1f] px-5 text-[12.5px] font-semibold text-[#1c0d03] transition-transform active:scale-[0.98]'
                    : 'inline-flex min-h-[38px] items-center whitespace-nowrap border border-[#14120F]/20 px-5 text-[12.5px] text-[#5A544C] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]'
                }
              >
                {l.label} <span aria-hidden="true">&nbsp;&rarr;</span>
              </a>
            ))}
            <button
              onClick={onClose}
              className="inline-flex min-h-[38px] items-center whitespace-nowrap px-4 text-[12.5px] text-[#8A8378] transition-colors hover:text-[#C13E00]"
            >
              <span aria-hidden="true">&larr;</span>&nbsp;Back to all software
            </button>
            <Link
              href="/projects/all"
              className="inline-flex min-h-[38px] items-center whitespace-nowrap px-2 text-[12.5px] text-[#8A8378] transition-colors hover:text-[#C13E00]"
            >
              All projects <span aria-hidden="true">&nbsp;&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
