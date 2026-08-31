"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import SoftwareDetail from './software-detail'
import { softwareProjects } from '../../data/project-index'
import { projectDetails } from '../../data/project-details'

/**
 * The software index, as a spec sheet.
 *
 * Deliberately light while the rest of the site is dark: that is a page-level
 * decision, so this page carries its own header and footer rather than the dark
 * TeHeader. Section 4.11's theme lock is about not flipping mid-page, which this
 * does not do.
 *
 * Colour is locked. Ground #F3F3F1 is a cool off-white, chosen because 4.2 bans
 * the warm cream family that an unconsidered light variant lands on. The brand
 * orange #ff5e1f measures about 3.1:1 here, so it appears only at display sizes
 * and on rules, and small text uses #C13E00 at about 4.9:1. Shape is locked:
 * every corner is square.
 *
 * Each featured build is a record with a plate and a printed spec table, and the
 * plate alternates side down the page so the rules read as a catalogue rather
 * than a feed. Where a build has no screenshot the plate is replaced by its pull
 * line on a tinted panel: a missing image produces a typographic moment rather
 * than a hole, which is also why nothing here needs a stock photo.
 *
 * Pressing "See more" swaps the whole index out for the record, rather than
 * sliding a panel over it. See software-detail.tsx for why.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

const featuredProjects = softwareProjects.filter(p => p.featured)
const restProjects = softwareProjects.filter(p => !p.featured)

/* The counts are derived rather than written out. They were hardcoded once, and
   the moment the selection changed the hero claimed three in the index when
   there were four. Copy that counts things should read the things. */
const WORD = ['no', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

/* 18 words. Section 4.7 caps hero subtext at 20.
   It used to promise "source and live demos on every one", which stopped being
   true the moment a private repo and an in-development build joined the set. */
const HERO_SUB =
  `${WORD[featuredProjects.length]} builds up close, plus ${WORD[restProjects.length].toLowerCase()} more in the index. Every one lists its stack and links out.`

/* The masthead figures. Every one of these reads the catalogue rather than
   restating it from memory, and each has a definition sitting on the field it
   counts — see IndexedProject. A rounded-up number is worse than no number. */
const YEARS = softwareProjects
  .map(p => Number(projectDetails[p.id]?.year))
  .filter(y => Number.isFinite(y))

const SPEC_YEAR: [string, string][] = YEARS.length
  ? [['Shipping since', String(Math.min(...YEARS))]]
  : []

const SPEC: [string, string][] = [
  ['Live or published', String(softwareProjects.filter(p => p.live).length)],
  ['Built solo, end to end', String(softwareProjects.filter(p => p.solo).length)],
  ['Hackathon awards', String(softwareProjects.reduce((n, p) => n + (p.awards ?? 0), 0))],
  ...SPEC_YEAR,
]

export default function SoftwareProjects() {
  const [open, setOpen] = useState<{ id: string; shot: number } | null>(null)

  const featured = featuredProjects
  const rest = restProjects
  const lead = featured[0]

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/software" />

      {/* Masthead. The claim on the left, the figures behind it on the right. */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-20 md:px-10 md:pb-[72px] md:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-[72px]">
          <div>
            <h1 className="text-[clamp(2.75rem,7.5vw,6rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
              Selected
              <br />
              software work
            </h1>
            <p className="mt-8 max-w-[42ch] text-[17px] leading-relaxed text-[#5A544C]">{HERO_SUB}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={lead.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={`${lead.linkLabel.toLowerCase()} ↗`}
                className="bg-[#ff5e1f] px-7 py-3.5 text-[14.5px] font-semibold text-[#1c0d03] transition-transform active:scale-[0.98]"
              >
                See it live
              </a>
              <Link
                href="/projects/all"
                className="border-b-2 border-[#14120F]/25 pb-1 text-[14.5px] font-semibold transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
              >
                All projects
              </Link>
            </div>
          </div>

          <dl className="border-t-2 border-[#14120F] pt-4" style={mono}>
            {SPEC.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-baseline justify-between gap-4 py-[11px] ${
                  i === SPEC.length - 1 ? '' : 'border-b border-[#14120F]/15'
                }`}
              >
                <dt className="text-[11.5px] uppercase tracking-[0.12em] text-[#8A8378]">{k}</dt>
                <dd className="text-[22px] tabular-nums text-[#C13E00]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The catalogue. */}
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        {featured.map((p, i) => {
          const d = projectDetails[p.id]
          const shot = d?.shots?.[0]
          const plateLeft = i % 2 === 0

          const facts = ([
            ['Status', d?.status],
            ['Role', d?.role],
            ['Year', d?.year],
            ['Team', d?.team],
          ] as const).filter(([, v]) => v).slice(0, 2)

          return (
            <Reveal key={p.id}>
              <article
                className={`pb-16 pt-7 md:pb-[88px] ${
                  i === 0 ? 'border-t-2 border-[#14120F]' : 'border-t border-[#14120F]/30'
                }`}
              >
                <div
                  className={`grid items-start gap-8 md:gap-12 ${
                    plateLeft ? 'lg:grid-cols-[1.25fr_1fr]' : 'lg:grid-cols-[1fr_1.25fr]'
                  }`}
                >
                  {/* Plate. */}
                  <figure className={`m-0 ${plateLeft ? '' : 'lg:order-2'}`}>
                    {shot ? (
                      <>
                        {d?.shape === 'phone' ? (
                          <div className="flex aspect-[16/9] items-center justify-center overflow-hidden border border-[#14120F]/12 bg-[#EFEEEA] p-4">
                            <div className="relative h-full shrink-0 overflow-hidden border border-[#14120F]/15" style={{ aspectRatio: '9 / 20' }}>
                              <Image
                                src={shot.src}
                                alt={shot.alt}
                                fill
                                sizes="(max-width:1024px) 40vw, 300px"
                                className="object-cover object-top"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-[16/9] overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
                            <Image
                              src={shot.src}
                              alt={shot.alt}
                              fill
                              sizes="(max-width:1024px) 92vw, 760px"
                              className="object-cover object-top"
                              priority={i === 0}
                            />
                          </div>
                        )}
                        <figcaption className="mt-3 text-[11.5px] leading-relaxed text-[#8A8378]" style={mono}>
                          {shot.caption}
                        </figcaption>

                        {/* The rest of the contact sheet. A build with six
                            screenshots was showing one and hiding five behind a
                            click, which read as a project with one screenshot.
                            Nothing here is decorative: every thumbnail is a real
                            screen, and opens the record on that screen. */}
                        {d && d.shots.length > 1 && (
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {d.shots.slice(1).map((s, si) => (
                              <li key={s.src}>
                                <button
                                  type="button"
                                  onClick={() => setOpen({ id: p.id, shot: si + 1 })}
                                  data-cursor="open"
                                  aria-label={`Open ${p.title}: ${s.caption}`}
                                  className={`group relative block overflow-hidden border border-[#14120F]/12 transition-colors hover:border-[#C13E00] focus-visible:border-[#C13E00] focus-visible:outline-none ${
                                    d.shape === 'phone' ? 'h-[76px] w-[42px] bg-[#EFEEEA]' : 'h-[54px] w-[96px] bg-[#EAEAE6]'
                                  }`}
                                >
                                  <Image
                                    src={s.src}
                                    alt={s.alt}
                                    fill
                                    sizes="96px"
                                    className="object-cover object-top transition-opacity group-hover:opacity-85"
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      d?.pull && (
                        <div className="flex aspect-[16/9] items-center bg-[#EAEAE6] px-7 py-12 md:px-12">
                          <p className="max-w-[24ch] text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                            {d.pull}
                          </p>
                        </div>
                      )
                    )}
                  </figure>

                  {/* Record. */}
                  <div className={plateLeft ? '' : 'lg:order-1'}>
                    <div className="flex items-baseline justify-between gap-4" style={mono}>
                      <span className="text-[13px] tabular-nums text-[#C13E00]">{String(i + 1).padStart(2, '0')}</span>
                      {p.note && (
                        <span className="text-right text-[11px] uppercase tracking-[0.1em] text-[#8A8378]">{p.note}</span>
                      )}
                    </div>

                    <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                      {p.title}
                    </h2>
                    {d && <p className="mt-2 text-[13px] text-[#C13E00]" style={mono}>{d.sub}</p>}

                    <dl className="mt-6 border-t border-[#14120F]/15" style={mono}>
                      {facts.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[88px_1fr] gap-4 border-b border-[#14120F]/10 py-2.5">
                          <dt className="text-[10.5px] uppercase tracking-[0.14em] text-[#8A8378]">{k}</dt>
                          <dd className="text-[12.5px]">{v}</dd>
                        </div>
                      ))}
                      <div className="grid grid-cols-[88px_1fr] gap-4 py-2.5">
                        <dt className="text-[10.5px] uppercase tracking-[0.14em] text-[#8A8378]">Stack</dt>
                        <dd className="text-[12.5px] leading-relaxed text-[#5A544C]">{p.stack.join(', ')}</dd>
                      </div>
                    </dl>

                    <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-[#5A544C]">{p.blurb}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-4" style={mono}>
                      {d && (
                        <button
                          onClick={() => setOpen({ id: p.id, shot: 0 })}
                          data-cursor="details"
                          className="border border-[#14120F]/25 px-[18px] py-2.5 text-[12.5px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
                        >
                          See more
                        </button>
                      )}
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor={`${p.linkLabel.toLowerCase()} ↗`}
                        className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
                      >
                        {p.linkLabel} <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </section>

      {/* Back of the book. A third layout family. */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <Reveal>
          <div className="border-t-2 border-[#14120F] pt-7">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.025em]">Also on the record</h2>
            <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-[#5A544C]">
              Real work without a write-up. Each link goes straight to the source.
            </p>
            <ul className="mt-9 border-b border-[#14120F]/15">
              {rest.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={`${p.linkLabel.toLowerCase()} ↗`}
                    className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-t border-[#14120F]/15 py-6 transition-colors hover:bg-[#EAEAE6] md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:px-3"
                  >
                    <span className="text-[12px] tabular-nums text-[#8A8378]" style={mono}>
                      {String(featured.length + i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1.15rem] font-semibold transition-colors group-hover:text-[#C13E00]">
                      {p.title}
                      {p.note && (
                        <em className="ml-3 text-[10.5px] not-italic uppercase tracking-[0.1em] text-[#C13E00]" style={mono}>
                          {p.note}
                        </em>
                      )}
                    </span>
                    <span className="text-[11.5px] text-[#8A8378] md:text-right" style={mono}>
                      {p.stack.slice(0, 3).join(', ')}
                    </span>
                    <span className="text-[11.5px] text-[#5A544C]" style={mono}>
                      {p.linkLabel} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em]">Open to work.</p>
            <p className="mt-3 text-[13px] text-[#5A544C]" style={mono}>
              Data Analyst, Analytics Engineer and Software roles. Sydney, AU.
            </p>
            <Link href="/projects/data" className="mt-5 inline-block border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]" style={mono}>
              Data projects <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3" style={mono}>
            {[
              ['Privacy', '/privacy'],
              ['GitHub', 'https://github.com/MelvinDY'],
              ['LinkedIn', 'https://www.linkedin.com/in/melvin-yogiana/'],
              ['Email', 'mailto:melvindarialyogiana@gmail.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
                {label} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </footer>

      {open && projectDetails[open.id] && (
        <SoftwareDetail
          detail={projectDetails[open.id]}
          initialShot={open.shot}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  )
}
