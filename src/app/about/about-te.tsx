import Image from 'next/image'
import Link from 'next/link'
import LightHeader from '../components/light-header'
import Reveal from '../components/reveal'
import { hero, socials, story, facts, entries, toolbox } from '../data/about'

/**
 * The about page, led by the writing.
 *
 * A CV already exists on LinkedIn and in a PDF, and neither of them can do the
 * thing this page can, which is sound like a person. So the prose opens at
 * reading scale and the record compresses underneath it to one line per role:
 * enough to establish the facts without competing with the voice.
 *
 * The obvious cost of that order is that someone skimming for credentials has
 * to scroll past the personality to reach them. The facts row sits directly
 * under the photo rather than at the foot of the page for exactly that reason,
 * so the quickest signals are available immediately even though the long
 * version leads.
 *
 * Work and education are one dataset rendered as two lists, not two tabs. The
 * old page hid half a career behind a click on the page whose entire job is to
 * show it.
 *
 * No client JavaScript: nothing here needs state, so the whole page is a
 * Server Component.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

export default function AboutTE() {
  const work = entries.filter(e => e.kind === 'work')
  const study = entries.filter(e => e.kind === 'education')

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/about" />

      <section className="mx-auto max-w-[900px] px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>{hero.kicker}</p>
        <h1 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
          {hero.hookLead} <span className="text-[#ff5e1f]">{hero.hookTail}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="relative aspect-square w-[168px] shrink-0 overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
            <Image src={hero.photo.src} alt={hero.photo.alt} fill sizes="168px" className="object-cover" priority />
          </div>
          <p className="text-[17px] leading-relaxed text-[#5A544C]">{hero.intro}</p>
        </div>

        {/* Quick signals stay near the top even though the prose leads. */}
        <dl className="mt-10 grid grid-cols-2 gap-px border-y border-[#14120F]/15 bg-[#14120F]/15 sm:grid-cols-4">
          {facts.map(f => (
            <div key={f.label} className="bg-[#F3F3F1] px-4 py-5">
              <dd className="text-[1.35rem] font-semibold leading-none tracking-[-0.03em]">{f.value}</dd>
              <dt className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#8A8378]" style={mono}>{f.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-16 md:px-10">
        {story.map(p => (
          <p key={p.slice(0, 24)} className="mt-6 text-[clamp(1.05rem,1.7vw,1.2rem)] leading-[1.72] text-[#1F1C18] first:mt-0">
            {p}
          </p>
        ))}
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3" style={mono}>
          {socials.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
            >
              {s.label} <span aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-20 md:px-10">
        <Reveal>
          <div className="border-t-2 border-[#14120F] pt-6">
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em]">Where I have worked</h2>
          </div>
          <ul className="mt-6 border-b border-[#14120F]/15">
            {work.map(e => (
              <li
                key={`${e.org}-${e.year}`}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-t border-[#14120F]/15 py-5 md:grid-cols-[4.5rem_minmax(0,1fr)]"
              >
                <span className="text-[12px] tabular-nums text-[#8A8378]" style={mono}>{e.year}</span>
                <div>
                  <p className="text-[15px] font-semibold">{e.role}</p>
                  <p className="mt-0.5 text-[13.5px] text-[#5A544C]">{e.org}</p>
                  <p className="mt-1.5 text-[11px] text-[#8A8378]" style={mono}>{e.period}</p>
                  {e.tags && <p className="mt-2.5 text-[11px] text-[#8A8378]" style={mono}>{e.tags.join(', ')}</p>}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 border-t-2 border-[#14120F] pt-6">
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em]">And studied</h2>
          </div>
          <ul className="mt-6 border-b border-[#14120F]/15">
            {study.map(e => (
              <li
                key={`${e.org}-${e.year}`}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-t border-[#14120F]/15 py-5 md:grid-cols-[4.5rem_minmax(0,1fr)]"
              >
                <span className="text-[12px] tabular-nums text-[#8A8378]" style={mono}>{e.year}</span>
                <div>
                  <p className="text-[15px] font-semibold">{e.role}</p>
                  <p className="mt-0.5 text-[13.5px] text-[#5A544C]">{e.org}</p>
                  <p className="mt-1.5 text-[11px] text-[#8A8378]" style={mono}>{e.period}</p>
                  {e.awards && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {e.awards.map(a => (
                        <li key={a.title} className="text-[13px] text-[#C13E00]">{a.title}</li>
                      ))}
                    </ul>
                  )}
                  {e.status && <p className="mt-2.5 text-[11px] text-[#8A8378]" style={mono}>{e.status}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-24 md:px-10">
        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {toolbox.map(t => (
            <div key={t.title}>
              <div className="flex items-baseline justify-between gap-4 border-b border-[#14120F]/15 pb-3">
                <h3 className="text-[1rem] font-semibold">{t.title}</h3>
                <span className="text-[11px] text-[#8A8378]" style={mono}>/ {t.note}</span>
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[#5A544C]" style={mono}>{t.chips.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[900px] flex-col gap-6 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em]">Open to work.</p>
            <p className="mt-3 text-[13px] text-[#5A544C]" style={mono}>
              Data Analyst, Analytics Engineer and Software roles. Sydney, AU.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3" style={mono}>
            <Link href="/projects/all" className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
              All projects <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/blog" className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
              Blog <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
