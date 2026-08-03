import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import { entries, HERO_SUB, type DataEntry } from '../../data/data-case-studies'

/**
 * The data index, built around its findings.
 *
 * One type scale, applied identically to all four studies:
 *
 *   page title   clamp(2.75rem, 7vw, 5.75rem)   about 92px
 *   figure       clamp(3rem, 6.5vw, 5.5rem)     about 88px
 *   claim        clamp(1.35rem, 2.4vw, 1.9rem)  about 30px
 *   study title  1.5rem
 *   body         15.5px
 *
 * An earlier version gave the four studies three different layout families to
 * avoid repeating one composition. That was wrong. The figures came out at
 * 144px, 192px, 80px and 144px, and four findings that are peers rendered at
 * three different sizes read as a mistake rather than as rhythm. Peers should
 * look alike; the variation now lives in the content, which is where it was
 * always coming from anyway.
 *
 * The figure also sits deliberately just under the page title rather than
 * above it. It should dominate its own section without outranking the page.
 *
 * Palette is locked to /projects/software: sibling pages, one palette. No
 * cards anywhere, since at this density spacing groups better than containers.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

function Study({ e, index }: { e: DataEntry; index: number }) {
  return (
    <Reveal>
      <section className="mx-auto max-w-[1400px] border-t border-[#14120F]/15 px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[clamp(3rem,6.5vw,5.5rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-[#ff5e1f] tabular-nums">
              {e.figure}
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="max-w-[28ch] text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-[1.2] tracking-[-0.02em]">
              {e.claim}
            </p>

            <h2 className="mt-10 text-[1.5rem] font-semibold tracking-[-0.02em]">{e.title}</h2>
            <p className="mt-1.5 text-[12.5px] text-[#C13E00]" style={mono}>{e.sub}</p>
            <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[#5A544C]">{e.blurb}</p>

            <p className="mt-7 text-[12px] leading-relaxed text-[#8A8378]" style={mono}>
              {e.method.source} &nbsp;/&nbsp; {e.method.transform} &nbsp;/&nbsp; {e.method.output}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={mono}>
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
          </div>
        </div>
      </section>
    </Reveal>
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

      {entries.map((e, i) => <Study key={e.id} e={e} index={i} />)}

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
