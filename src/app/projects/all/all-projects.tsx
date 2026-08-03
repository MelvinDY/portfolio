import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import { dataProjects, softwareProjects, type IndexedProject } from '../../data/project-index'

/**
 * The complete index, in the light language the rest of the projects section
 * now uses. It was the last page still carrying the dark te-home shell, which
 * meant the header linked straight from a light page into a dark one.
 *
 * Deliberately not cards and deliberately not the discipline pages' layout.
 * Those two pages are the pitch; this is the contents page, so it is a ruled
 * index you scan rather than a set of objects you look at. Holding the forms
 * apart is what lets this list everything without competing with the pages it
 * points at.
 *
 * Featured work is marked by its index number taking the accent rather than by
 * a badge, so the same hierarchy the discipline pages show with full cards
 * survives here without a second tag on every row. Each row also says where it
 * sends you, because a case study on this site and a GitHub repo are different
 * destinations and a bare arrow hides that.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

function Row({ p, n }: { p: IndexedProject; n: number }) {
  const internal = p.href.startsWith('/')
  const inner = (
    <>
      <span
        className={`text-[12px] tabular-nums ${p.featured ? 'text-[#C13E00]' : 'text-[#8A8378]'}`}
        style={mono}
      >
        {String(n).padStart(2, '0')}
      </span>

      <span className="min-w-0">
        <span className="block text-[1.15rem] font-semibold tracking-[-0.015em] transition-colors group-hover:text-[#C13E00]">
          {p.title}
          {p.note && (
            <em className="ml-3 text-[10.5px] not-italic uppercase tracking-[0.1em] text-[#C13E00]" style={mono}>
              {p.note}
            </em>
          )}
        </span>
        <span className="mt-2 block max-w-[60ch] text-[14.5px] leading-relaxed text-[#5A544C]">{p.blurb}</span>
      </span>

      <span className="text-[11.5px] leading-relaxed text-[#8A8378] md:text-right" style={mono}>
        {p.stack.join(', ')}
      </span>

      <span className="text-[11.5px] whitespace-nowrap text-[#5A544C]" style={mono}>
        {p.linkLabel} <span aria-hidden="true">&rarr;</span>
      </span>
    </>
  )

  const cls =
    'group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-t border-[#14120F]/15 py-7 transition-colors hover:bg-[#EAEAE6] md:grid-cols-[auto_minmax(0,1fr)_12rem_auto] md:px-3'

  return internal ? (
    <Link className={cls} href={p.href}>{inner}</Link>
  ) : (
    <a className={cls} href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a>
  )
}

function Section({
  kicker, title, note, items, startAt,
}: {
  kicker: string
  title: string
  note: string
  items: IndexedProject[]
  startAt: number
}) {
  return (
    <Reveal>
      <section className="mt-20 first:mt-0">
        <div className="border-t-2 border-[#14120F] pt-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>{kicker}</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.6rem)] font-semibold tracking-[-0.03em]">
            {title} <span className="text-[1rem] align-middle text-[#8A8378]" style={mono}>{items.length}</span>
          </h2>
          <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-[#5A544C]">{note}</p>
          <div className="mt-9 border-b border-[#14120F]/15">
            {items.map((p, i) => <Row key={p.id} p={p} n={startAt + i} />)}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

export default function AllProjects() {
  const total = dataProjects.length + softwareProjects.length
  const featured = [...dataProjects, ...softwareProjects].filter(p => p.featured).length

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/all" />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-14 md:px-10 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[0.93] tracking-[-0.045em]">
              Every analysis
              <br />
              and every build.
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[38ch] text-[16px] leading-relaxed text-[#5A544C]">
              The complete index. Orange numbers are the featured work, and each row says where
              it sends you.
            </p>
            <dl className="mt-7 flex gap-10">
              <div>
                <dd className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">{total}</dd>
                <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Projects</dt>
              </div>
              <div>
                <dd className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[#ff5e1f]">{featured}</dd>
                <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Featured</dt>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <Section
          kicker="Data"
          title="Analyses"
          note="Each of these is written up as a case study: the finding first, the working underneath."
          items={dataProjects}
          startAt={1}
        />
        <Section
          kicker="Software"
          title="Builds"
          note="Shipped things. Four have a full card on the software page; the rest go straight to the source."
          items={softwareProjects}
          startAt={dataProjects.length + 1}
        />
      </div>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em]">Open to work.</p>
            <p className="mt-3 text-[13px] text-[#5A544C]" style={mono}>
              Data Analyst, Analytics Engineer and Software roles. Sydney, AU.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2" style={mono}>
              <Link href="/projects/data" className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]">
                Data projects <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/projects/software" className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]">
                Software projects <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
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
