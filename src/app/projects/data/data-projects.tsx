import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import { entries, HERO_SUB, type DataEntry } from '../../data/data-case-studies'

/**
 * The data index, built around its findings.
 *
 * Adopted from Path 1. The argument: on a data portfolio the artefact is a
 * conclusion, not an app, so each study is a spread built around its figure at
 * display scale with the method reduced to a line. Density 2 is load-bearing.
 * If the numbers are the point they need air, and 4.4 says group with spacing
 * rather than cards, so there are no cards on this page.
 *
 * Palette is locked to /projects/software: sibling pages, one palette. Brand
 * orange at display sizes and on rules, #C13E00 wherever small text needs AA
 * against this ground. Every corner square.
 *
 * Three layout families across four studies, per the repetition rule in 4.7:
 * the spread, used by the first and last study and separated by the two in
 * between; a full-width statement; and a three-column arrangement.
 *
 * The page carries no images at all, which is a deliberate departure from
 * Section 4.8. The direction's thesis is that the figure is the visual, and
 * every study except one has no screenshot anyway, so plates would have made
 * the page look complete in one place and thin in three. The Power BI captures
 * still live under public/projects/labour-market and are used by that study's
 * own case-study page.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

function MethodLine({ e }: { e: DataEntry }) {
  return (
    <p className="text-[12px] leading-relaxed text-[#8A8378]" style={mono}>
      {e.method.source} &nbsp;/&nbsp; {e.method.transform} &nbsp;/&nbsp; {e.method.output}
    </p>
  )
}

function ReadLink({ e, index }: { e: DataEntry; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3" style={mono}>
      <Link
        href={e.href}
        className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
      >
        Read the case study <span aria-hidden="true">&rarr;</span>
      </Link>
      <span className="text-[11.5px] text-[#8A8378]">
        {String(index + 1).padStart(2, '0')} of {String(entries.length).padStart(2, '0')}
      </span>
    </div>
  )
}

function Figure({ e, className = '' }: { e: DataEntry; className?: string }) {
  return (
    <p className={`font-semibold leading-[0.82] tracking-[-0.055em] text-[#ff5e1f] tabular-nums ${className}`}>
      {e.figure}
    </p>
  )
}

export default function DataProjects() {
  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/data" />

      <section className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <h1 className="max-w-[16ch] text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          Four findings,
          <br />
          and the working.
        </h1>
        <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[#5A544C]">{HERO_SUB}</p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href={entries[0].href}
            className="bg-[#ff5e1f] px-7 py-3.5 text-[14.5px] font-semibold text-[#1c0d03] transition-transform active:scale-[0.98]"
          >
            Read the first
          </Link>
          <Link
            href="/projects/all"
            className="border-b-2 border-[#14120F]/25 pb-1 text-[14.5px] font-semibold transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
          >
            All projects
          </Link>
        </div>
      </section>

      {/* Family A, and the only study with screenshots, so it leads. */}
      {entries.slice(0, 1).map((e, i) => (
        <Reveal key={e.id}>
          <section className="mx-auto max-w-[1400px] border-t border-[#14120F]/15 px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <Figure e={e} className="text-[clamp(4rem,11vw,9rem)]" />
              </div>
              <div className="lg:col-span-7">
                <p className="max-w-[26ch] text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                  {e.claim}
                </p>
                <h2 className="mt-10 text-[1.5rem] font-semibold tracking-[-0.02em]">{e.title}</h2>
                <p className="mt-1.5 text-[12.5px] text-[#C13E00]" style={mono}>{e.sub}</p>
                <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[#5A544C]">{e.blurb}</p>
                <div className="mt-7"><MethodLine e={e} /></div>
                <div className="mt-8"><ReadLink e={e} index={i} /></div>
              </div>
            </div>
          </section>
        </Reveal>
      ))}

      {/* Family B. One study set as a full-width statement, so the page does
          not repeat the same spread four times. */}
      {entries.slice(1, 2).map((e, i) => (
        <Reveal key={e.id}>
          <section className="mx-auto max-w-[1400px] border-t border-[#14120F]/15 px-5 py-20 md:px-10 md:py-28">
            <Figure e={e} className="text-[clamp(4.5rem,15vw,12rem)]" />
            <p className="mt-6 max-w-[30ch] text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.025em]">
              {e.claim}
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-6">
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em]">{e.title}</h2>
                <p className="mt-1.5 text-[12.5px] text-[#C13E00]" style={mono}>{e.sub}</p>
                <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-[#5A544C]">{e.blurb}</p>
              </div>
              <div className="flex flex-col justify-between gap-6 md:col-span-6 md:items-end">
                <div className="md:text-right"><MethodLine e={e} /></div>
                <ReadLink e={e} index={i + 1} />
              </div>
            </div>
          </section>
        </Reveal>
      ))}

      {/* Family C. Three columns, tighter, so the figure sits inside a rhythm
          rather than always dominating a half. */}
      {entries.slice(2, 3).map((e, i) => (
        <Reveal key={e.id}>
          <section className="mx-auto max-w-[1400px] border-t border-[#14120F]/15 px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3">
                <Figure e={e} className="text-[clamp(3rem,6.5vw,5rem)]" />
                <h2 className="mt-6 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em]">{e.title}</h2>
                <p className="mt-1.5 text-[12.5px] text-[#C13E00]" style={mono}>{e.sub}</p>
              </div>
              <div className="lg:col-span-5">
                <p className="max-w-[28ch] text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.018em]">
                  {e.claim}
                </p>
              </div>
              <div className="lg:col-span-4">
                <p className="max-w-[46ch] text-[15px] leading-relaxed text-[#5A544C]">{e.blurb}</p>
                <div className="mt-6"><MethodLine e={e} /></div>
                <div className="mt-7"><ReadLink e={e} index={i + 2} /></div>
              </div>
            </div>
          </section>
        </Reveal>
      ))}

      {/* Family A returns, two studies away from its first use. */}
      {entries.slice(3).map((e, i) => (
        <Reveal key={e.id}>
          <section className="mx-auto max-w-[1400px] border-t border-[#14120F]/15 px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <Figure e={e} className="text-[clamp(4rem,11vw,9rem)]" />
              </div>
              <div className="lg:col-span-7">
                <p className="max-w-[26ch] text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                  {e.claim}
                </p>
                <h2 className="mt-10 text-[1.5rem] font-semibold tracking-[-0.02em]">{e.title}</h2>
                <p className="mt-1.5 text-[12.5px] text-[#C13E00]" style={mono}>{e.sub}</p>
                <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[#5A544C]">{e.blurb}</p>
                <div className="mt-7"><MethodLine e={e} /></div>
                <div className="mt-8"><ReadLink e={e} index={i + 3} /></div>
              </div>
            </div>
          </section>
        </Reveal>
      ))}

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em]">Open to work.</p>
            <p className="mt-3 text-[13px] text-[#5A544C]" style={mono}>
              Data Analyst, Analytics Engineer and Software roles. Sydney, AU.
            </p>
            <Link
              href="/projects/software"
              className="mt-5 inline-block border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
              style={mono}
            >
              Software projects <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3" style={mono}>
            {[
              ['GitHub', 'https://github.com/MelvinDY'],
              ['LinkedIn', 'https://www.linkedin.com/in/melvin-yogiana/'],
              ['Email', 'mailto:melvindarialyogiana@gmail.com'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]"
              >
                {label} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
