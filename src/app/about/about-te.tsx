import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import LightHeader from '../components/light-header'
import Reveal from '../components/reveal'
import PurinConfetti from '../components/purin-confetti'
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

/**
 * What each role actually involved. These lines existed in the data all along
 * and were never rendered, so the page listed job titles and left the work
 * itself invisible. A recruiter reads this section to find out what someone
 * did, so it is the one thing that cannot be implied.
 *
 * The hanging rule marker is the same one the project sheet uses for its
 * highlights, in this page's deepened accent rather than the dark-ground one.
 * Body sits at 14px on --ink-dim, which is a readable size and passes AA,
 * rather than joining the mono micro-type tier.
 */
const Points = ({ items }: { items: string[] }) =>
  items.length === 0 ? null : (
    <ul className="mt-3.5 flex flex-col gap-2">
      {items.map(p => (
        <li key={p} className="relative max-w-[64ch] pl-5 text-[14px] leading-relaxed text-[#5A544C]">
          <span aria-hidden="true" className="absolute left-0 top-[10px] h-px w-2.5 bg-[#C13E00]" />
          {p}
        </li>
      ))}
    </ul>
  )

/**
 * Every cat in public/purin, read once at build.
 *
 * This is why adding a Purin is dropping a file in a folder and nothing else:
 * no manifest to keep in sync, no import list, filenames irrelevant. The page
 * is statically prerendered, so this costs nothing at runtime.
 *
 * An empty or missing folder is a normal state, not an error. The easter egg
 * simply is not wired up and the photo renders as a photo, which is what lets
 * this ship before the images do.
 */
function purinSprites(): string[] {
  try {
    return readdirSync(join(process.cwd(), 'public', 'purin'))
      .filter(f => /\.(png|webp|gif)$/i.test(f))
      .sort()
      .map(f => `/purin/${f}`)
  } catch {
    return []
  }
}

export default function AboutTE() {
  const work = entries.filter(e => e.kind === 'work')
  const study = entries.filter(e => e.kind === 'education')
  const sprites = purinSprites()

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/about" />

      <section className="mx-auto max-w-[900px] px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>{hero.kicker}</p>
        <h1 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
          {hero.hookLead} <span className="text-[#ff5e1f]">{hero.hookTail}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
          {/* The photo is the easter egg's trigger. The alt stays on the image
              rather than moving to an aria-label on the button, because a
              button takes its accessible name from its content: that reads
              correctly whether or not the egg is wired up. Moving it would
              have left the photo with no alt at all on a build with no cats in
              public/purin. The Image stays server-rendered; only the click
              handling crosses into the client. */}
          <PurinConfetti sprites={sprites}>
            <div className="relative aspect-square w-[168px] shrink-0 overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
              <Image src={hero.photo.src} alt={hero.photo.alt} fill sizes="168px" className="object-cover" priority />
            </div>
          </PurinConfetti>
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
              data-cursor={s.label === 'Email' ? 'say hello' : `${s.label.toLowerCase()} ↗`}
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
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-t border-[#14120F]/15 py-6 md:grid-cols-[4.5rem_minmax(0,1fr)] md:py-7"
              >
                <span className="text-[12px] tabular-nums text-[#736C60]" style={mono}>{e.year}</span>
                <div>
                  <p className="text-[15px] font-semibold">{e.role}</p>
                  <p className="mt-0.5 text-[13.5px] text-[#5A544C]">{e.org}</p>
                  <p className="mt-1.5 text-[11.5px] text-[#736C60]" style={mono}>{e.period}</p>
                  <Points items={e.points} />
                  {e.tags && <p className="mt-3.5 text-[11.5px] text-[#736C60]" style={mono}>{e.tags.join(', ')}</p>}
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
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-t border-[#14120F]/15 py-6 md:grid-cols-[4.5rem_minmax(0,1fr)] md:py-7"
              >
                <span className="text-[12px] tabular-nums text-[#736C60]" style={mono}>{e.year}</span>
                <div>
                  <p className="text-[15px] font-semibold">{e.role}</p>
                  <p className="mt-0.5 text-[13.5px] text-[#5A544C]">{e.org}</p>
                  <p className="mt-1.5 text-[11.5px] text-[#736C60]" style={mono}>{e.period}</p>
                  <Points items={e.points} />
                  {e.awards && (
                    <ul className="mt-3.5 flex flex-col gap-1.5">
                      {e.awards.map(a => (
                        <li key={a.title} className="text-[13px] text-[#C13E00]">{a.title}</li>
                      ))}
                    </ul>
                  )}
                  {e.status && <p className="mt-3 text-[11.5px] text-[#736C60]" style={mono}>{e.status}</p>}
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
            <Link href="/privacy" className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
              Privacy <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
