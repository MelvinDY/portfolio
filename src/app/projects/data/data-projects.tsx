import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import { entries, HERO_SUB } from '../../data/data-case-studies'

/**
 * The data index, paired.
 *
 * The previous version gave each study the full width for a single 88px
 * figure, which left a large gap under every one of them, four times, on a
 * page with no imagery to hold it. The number was never the problem. It was
 * alone. Pairing the studies fills that width with the only thing worth
 * filling it with on a portfolio, which is more work, and takes the page from
 * about four screens to under two.
 *
 * Not cards. Section 4.4 reserves cards for elevation that communicates real
 * hierarchy, and these four are peers, so the grid is hairline-separated cells
 * on one continuous ground with no edges of their own. That also keeps it
 * clear of the four-identical-boxes look the old dark page had.
 *
 * One type scale, applied identically to all four cells. Palette locked to
 * /projects/software: sibling pages, one palette. Brand orange carries the
 * figures at display size; #C13E00 handles small text, where the raw orange
 * would only reach about 3.1:1 on this ground.
 *
 * CTA intents appear once each: read a study, see the index, cross to
 * software. Section 4.5 counts repeats of the same intent as a failure.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

export default function DataProjects() {
  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/data" />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-14 md:px-10 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[0.93] tracking-[-0.045em]">
              Four findings,
              <br />
              and the working.
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[38ch] text-[16px] leading-relaxed text-[#5A544C]">{HERO_SUB}</p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                href={entries[0].href}
                className="bg-[#ff5e1f] px-6 py-3 text-[14px] font-semibold text-[#1c0d03] transition-transform active:scale-[0.98]"
              >
                Read the first
              </Link>
              <Link
                href="/projects/all"
                className="border-b-2 border-[#14120F]/25 pb-1 text-[14px] font-semibold transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
              >
                All projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10">
        <div className="grid gap-px border-y border-[#14120F]/15 bg-[#14120F]/15 md:grid-cols-2">
          {entries.map((e, i) => (
            <Reveal key={e.id}>
              <article className="flex h-full flex-col bg-[#F3F3F1] px-6 py-10 md:px-9 md:py-12">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[clamp(2.5rem,4.4vw,3.6rem)] font-semibold leading-none tracking-[-0.045em] text-[#ff5e1f] tabular-nums">
                    {e.figure}
                  </p>
                  <span className="text-[11px] tabular-nums text-[#8A8378]" style={mono}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="mt-5 max-w-[30ch] text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-[1.3] tracking-[-0.012em]">
                  {e.claim}
                </p>

                <h2 className="mt-7 text-[1.1rem] font-semibold tracking-[-0.015em]">{e.title}</h2>
                <p className="mt-1.5 text-[12px] text-[#C13E00]" style={mono}>{e.sub}</p>
                {/* flex-1 so every cell's link sits on the same baseline
                    regardless of how long its blurb runs. */}
                <p className="mt-4 max-w-[52ch] flex-1 text-[14.5px] leading-relaxed text-[#5A544C]">{e.blurb}</p>

                <p className="mt-6 text-[11px] leading-relaxed text-[#8A8378]" style={mono}>
                  {e.method.source} &nbsp;/&nbsp; {e.method.transform} &nbsp;/&nbsp; {e.method.output}
                </p>

                <Link
                  href={e.href}
                  data-cursor="case study ↗"
                  className="mt-5 w-fit border-b border-[#14120F]/30 pb-0.5 text-[12.5px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
                  style={mono}
                >
                  Read the case study <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

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
              ['Privacy', '/privacy'],
              ['GitHub', 'https://github.com/MelvinDY'],
              ['LinkedIn', 'https://www.linkedin.com/in/melvin-yogiana/'],
              ['Email', 'mailto:melvindarialyogiana@gmail.com'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
