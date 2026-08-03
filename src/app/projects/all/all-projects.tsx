import Link from 'next/link'
import LightHeader from '../../components/light-header'
import Reveal from '../../components/reveal'
import { dataProjects, softwareProjects, type IndexedProject } from '../../data/project-index'

/**
 * The complete index, both disciplines in parallel.
 *
 * The organising argument: the point of an index covering two disciplines is
 * that someone sees the breadth at once rather than scrolling past one to
 * reach the other. Stacked sections make the second discipline something you
 * discover; columns make it something you see. That is the honest read of a
 * portfolio applying across both data and software roles, and it lets a
 * recruiter who only cares about one column ignore the other without ever
 * learning the page had it.
 *
 * The columns are uneven, four against seven, so the shorter one would end in
 * a tall gap. Each column closes with its own link into that discipline's
 * page, which fills the tail with something useful rather than padding, and
 * keeps every call to action to a single instance: 4.5 counts a repeated
 * intent as a failure, so the footer carries contact only.
 *
 * Still a ruled index rather than the discipline pages' layout. Those are the
 * pitch; this is the contents page. Featured work is marked by its number
 * taking the accent rather than by a badge, and each row says where it sends
 * you, because a case study here and a GitHub repo are different destinations.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

function Row({ p, n }: { p: IndexedProject; n: number }) {
  const internal = p.href.startsWith('/')
  const cls = 'group block border-t border-[#14120F]/15 py-6 transition-colors hover:bg-[#EAEAE6] md:px-3'

  const inner = (
    <>
      <div className="flex items-baseline gap-4">
        <span
          className={`text-[11.5px] tabular-nums ${p.featured ? 'text-[#C13E00]' : 'text-[#8A8378]'}`}
          style={mono}
        >
          {String(n).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.05rem] font-semibold tracking-[-0.015em] transition-colors group-hover:text-[#C13E00]">
            {p.title}
          </span>
          {p.note && (
            <span className="mt-1 block text-[10.5px] uppercase tracking-[0.1em] text-[#C13E00]" style={mono}>
              {p.note}
            </span>
          )}
        </span>
        <span className="whitespace-nowrap text-[11px] text-[#5A544C]" style={mono}>
          {p.linkLabel} <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
      <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[#5A544C]">{p.blurb}</p>
      <p className="mt-3 text-[11px] text-[#8A8378]" style={mono}>{p.stack.slice(0, 4).join(', ')}</p>
    </>
  )

  return internal ? (
    <Link className={cls} href={p.href}>{inner}</Link>
  ) : (
    <a className={cls} href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a>
  )
}

function Column({
  kicker, title, note, items, more,
}: {
  kicker: string
  title: string
  note: string
  items: IndexedProject[]
  more: { href: string; label: string }
}) {
  return (
    <div>
      <div className="border-t-2 border-[#14120F] pt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>{kicker}</p>
        <h2 className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">
          {title} <span className="align-middle text-[0.95rem] text-[#8A8378]" style={mono}>{items.length}</span>
        </h2>
        <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-[#5A544C]">{note}</p>
      </div>

      {/* Deliberately not flex-1. Stretching the shorter column to match the
          taller one aligns the closing links but opens roughly 700px of blank
          inside the four-item list, which is the void this layout exists to
          avoid. Parallel lists of different lengths should end where they end. */}
      <div className="mt-7 border-b border-[#14120F]/15">
        {items.map((p, i) => <Row key={p.id} p={p} n={i + 1} />)}
      </div>

      <Link
        href={more.href}
        className="mt-6 w-fit border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
        style={mono}
      >
        {more.label} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  )
}

export default function AllProjects() {
  const featured = [...dataProjects, ...softwareProjects].filter(p => p.featured).length

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/all" />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-14 md:px-10 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[0.93] tracking-[-0.045em]">
              Both sides
              <br />
              of the work.
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[38ch] text-[16px] leading-relaxed text-[#5A544C]">
              The complete index. Orange numbers are the featured work, and each row says where
              it sends you.
            </p>
            <p className="mt-4 text-[12px] text-[#8A8378]" style={mono}>
              {dataProjects.length} analyses &nbsp;/&nbsp; {softwareProjects.length} builds &nbsp;/&nbsp;{' '}
              <span className="text-[#C13E00]">{featured} featured</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <Reveal>
          <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">
            <Column
              kicker="Data"
              title="Analyses"
              note="Each of these is written up as a case study: the finding first, the working underneath."
              items={dataProjects}
              more={{ href: '/projects/data', label: 'Data projects' }}
            />
            <Column
              kicker="Software"
              title="Builds"
              note="Shipped things. Four have a full card on the software page; the rest go straight to the source."
              items={softwareProjects}
              more={{ href: '/projects/software', label: 'Software projects' }}
            />
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
