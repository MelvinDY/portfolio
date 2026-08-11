"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LightHeader from '../../components/light-header'
import LightSheet from '../../components/light-sheet'
import Reveal from '../../components/reveal'
import { softwareProjects } from '../../data/project-index'
import { projectDetails } from '../../data/project-details'

/**
 * The software index, as a printed catalogue.
 *
 * Adopted from Path B. Deliberately light while the rest of the site is dark:
 * that is a page-level decision, so this page carries its own header and
 * footer rather than the dark TeHeader. Section 4.11's theme lock is about not
 * flipping mid-page, which this does not do.
 *
 * Colour is locked. Ground #F3F3F1 is a cool off-white, chosen because 4.2
 * bans the warm cream family that an unconsidered light variant lands on. The
 * brand orange #ff5e1f measures about 3.1:1 here, so it appears only at
 * display sizes and on rules, and small text uses #C13E00 at about 4.9:1.
 * Shape is locked: every corner is square.
 *
 * Two record families alternate. Builds with a screenshot are plate-led;
 * builds without one lead with their pull line on a tinted panel. There are no
 * placeholder frames: a missing screenshot produces a typographic moment
 * instead of a hole, which is also why nothing here needs a stock photo.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

const featuredProjects = softwareProjects.filter(p => p.featured)
const restProjects = softwareProjects.filter(p => !p.featured)

/* The counts are derived rather than written out. They were hardcoded, and the
   moment the selection changed the hero claimed three in the index when there
   were four. Copy that counts things should read the things. */
const WORD = ['no', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']

/* 18 words. Section 4.7 caps hero subtext at 20.
   It used to promise "source and live demos on every one", which stopped being
   true the moment a private repo and an in-development build joined the set. */
const HERO_SUB =
  `${WORD[featuredProjects.length]} builds up close, plus ${WORD[restProjects.length].toLowerCase()} more in the index. Every one lists its stack and links out.`

export default function SoftwareProjects() {
  const [open, setOpen] = useState<string | null>(null)

  const featured = featuredProjects
  const rest = restProjects
  const lead = featured[0]
  const leadShot = projectDetails[lead.id]?.shots?.[0]

  const detailFor = (id: string) => projectDetails[id]

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/software" />

      {/* Hero. Asymmetric split, real asset, CTA above the fold. */}
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1400px] items-center px-5 py-16 md:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
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

          {leadShot && (
            <div className="lg:col-span-5">
              <figure className="m-0">
                <div className="relative aspect-[4/5] overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
                  <Image
                    src={leadShot.src}
                    alt={leadShot.alt}
                    fill
                    sizes="(max-width:1024px) 92vw, 40vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>
                <figcaption className="mt-3 text-[11.5px] text-[#8A8378]" style={mono}>
                  {lead.title}, {detailFor(lead.id)?.sub.toLowerCase()}
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      </section>

      {/* The catalogue. */}
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        {featured.map((p, i) => {
          const d = detailFor(p.id)
          const shotOf = d?.shots?.[0]
          const n = String(i + 1).padStart(2, '0')

          return (
            <Reveal key={p.id}>
              <article className="border-t-2 border-[#14120F] pt-7 pb-16 md:pb-24">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-[13px] tabular-nums text-[#C13E00]" style={mono}>{n}</span>
                  {p.note && <span className="text-right text-[11px] text-[#8A8378]" style={mono}>{p.note}</span>}
                </div>

                <h2 className="mt-5 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
                  {p.title}
                </h2>
                {d && <p className="mt-2 text-[13px] text-[#C13E00]" style={mono}>{d.sub}</p>}

                {shotOf ? (
                  <div className="relative mt-9 aspect-[21/9] overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
                    <Image
                      src={shotOf.src}
                      alt={shotOf.alt}
                      fill
                      sizes="(max-width:1400px) 92vw, 1320px"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  d?.pull && (
                    <div className="mt-9 bg-[#EAEAE6] px-7 py-12 md:px-14 md:py-16">
                      <p className="max-w-[24ch] text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.02em]">
                        {d.pull}
                      </p>
                    </div>
                  )
                )}

                <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-8">
                  <p className="max-w-[60ch] text-[16px] leading-relaxed text-[#5A544C] md:col-span-7">{p.blurb}</p>
                  <div className="flex flex-col gap-4 md:col-span-5 md:items-end">
                    <p className="text-[12px] leading-relaxed text-[#8A8378] md:text-right" style={mono}>
                      {p.stack.join(', ')}
                    </p>
                    <div className="flex flex-wrap items-center gap-4" style={mono}>
                      {d && (
                        <button
                          onClick={() => setOpen(p.id)}
                          className="border border-[#14120F]/25 px-4 py-2 text-[12.5px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
                        >
                          See more
                        </button>
                      )}
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
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

      {open && projectDetails[open] && (
        <LightSheet detail={projectDetails[open]} onClose={() => setOpen(null)} />
      )}
    </div>
  )
}
