import Image from 'next/image'
import Link from 'next/link'
import LightHeader from './light-header'
import Reveal from './reveal'

/**
 * The case-study shell, in the light "Annotated" language.
 *
 * A reading column with a standing apparatus: source, stack and contents stay
 * pinned for the whole read, and the caveats move out of the paragraphs into
 * margin notes where a skimming reader will actually see them. On these four
 * studies the caveats are the strongest material, which is the whole argument
 * for this layout.
 *
 * Built once and fed four content modules rather than written four times, so
 * the studies cannot drift apart and a fifth costs only its content.
 *
 * Deliberately omits the numbered section eyebrows the old pages used
 * (01 Overview, 02 The data, and so on): that is the pattern Section 9.F bans
 * by name, and the headings carry themselves without it.
 */

export interface Bar {
  label: string
  value: string
  /** Width as a percentage of the widest bar. */
  pct: number
  lead?: boolean
}

export type Block =
  | { t: 'h'; id?: string; text: string }
  | { t: 'p'; text: string }
  | { t: 'lede'; text: string }
  | { t: 'stats'; items: { figure: string; caption: string }[] }
  | { t: 'bars'; title: string; unit: string; bars: Bar[]; read?: string }
  | { t: 'line'; title: string; unit: string; pts: [number, number][]; pts2?: [number, number][]; legend?: [string, string]; xLabels: string[]; yTop?: string; yBottom?: string; baseline?: number; baselineLabel?: string; dots?: boolean; read?: string }
  | { t: 'fig'; src: string; alt: string; page?: string; caption: string }
  | { t: 'note'; text: string }
  | { t: 'flow'; items: { stage: string; tool: string; what: string }[] }
  | { t: 'list'; items: string[] }
  | { t: 'pull'; text: string }

export interface CaseStudyProps {
  kicker: string
  hookLead: string
  hookTail: string
  sub: string
  meta: ReadonlyArray<readonly [string, string]>
  contents: ReadonlyArray<readonly [string, string]>
  blocks: Block[]
  links: { label: string; href: string; primary?: boolean }[]
  nextStudy: { href: string; title: string }
}

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="mt-7 border-l-2 border-[#ff5e1f] bg-[#EAEAE6] px-5 py-4 lg:-mr-20">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>Honest note</p>
      <p className="mt-2 max-w-[54ch] text-[13.5px] leading-relaxed text-[#5A544C]">{children}</p>
    </aside>
  )
}

function FigHead({ title, unit }: { title: string; unit: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#14120F]/20 pb-3">
      <h3 className="text-[1rem] font-semibold tracking-[-0.015em]">{title}</h3>
      <span className="text-[11px] text-[#8A8378]" style={mono}>{unit}</span>
    </div>
  )
}

/** Line chart from normalised points. x and y both run 0 to 1, y measured up. */
function LineChart({ b }: { b: Extract<Block, { t: 'line' }> }) {
  const W = 720
  const H = 260
  const P = { l: 8, r: 8, t: 14, b: 26 }
  const x = (v: number) => P.l + v * (W - P.l - P.r)
  const y = (v: number) => P.t + (1 - v) * (H - P.t - P.b)
  const d = b.pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ')
  // With a baseline the series is signed, so the fill closes on the zero line
  // rather than on the floor. Filling to the floor under a negative value
  // shades the wrong side and reads as if the quantity were still positive.
  const foot = b.baseline ?? 0
  const area = `${d} L${x(b.pts[b.pts.length - 1][0]).toFixed(1)},${y(foot)} L${x(b.pts[0][0]).toFixed(1)},${y(foot)} Z`
  const d2 = b.pts2
    ? b.pts2.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ')
    : null
  const gid = `g-${b.title.replace(/\W+/g, '')}`

  return (
    <div className="mt-10">
      <FigHead title={b.title} unit={b.unit} />
      {b.legend && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#5A544C]">
          <span className="flex items-center gap-2">
            <span className="inline-block h-[3px] w-5 bg-[#ff5e1f]" />
            {b.legend[0]}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-[3px] w-5 bg-[#14120F]/55" />
            {b.legend[1]}
          </span>
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full" role="img" aria-label={`${b.title}. ${b.read ?? ''}`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5e1f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff5e1f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(g => (
          <line key={g} x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} stroke="#14120F" strokeOpacity="0.1" strokeWidth="1" />
        ))}
        <path d={area} fill={b.baseline === undefined ? `url(#${gid})` : '#ff5e1f'} fillOpacity={b.baseline === undefined ? 1 : 0.12} />
        {b.baseline !== undefined && (
          <line x1={P.l} x2={W - P.r} y1={y(b.baseline)} y2={y(b.baseline)} stroke="#14120F" strokeOpacity="0.45" strokeWidth="1.5" />
        )}
        <path d={d} fill="none" stroke="#ff5e1f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Optional second series. No area fill and no gradient: the fill reads
            as emphasis, and a comparison line is there to be compared against,
            not to compete. */}
        {d2 && <path d={d2} fill="none" stroke="#14120F" strokeOpacity="0.55" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
        {/* yTop has been in the type since this chart was written and was never
            drawn, so every line chart shipped without a vertical scale. A reader
            could see a shape and not read a value off it. */}
        {b.yTop && (
          <text x={P.l} y={P.t + 9} fontSize="11" fill="#8A8378" fontFamily="var(--font-mono), monospace">
            {b.yTop}
          </text>
        )}
        {b.yBottom && (
          <text x={P.l} y={H - P.b - 2} fontSize="11" fill="#8A8378" fontFamily="var(--font-mono), monospace">
            {b.yBottom}
          </text>
        )}
        {b.baseline !== undefined && b.baselineLabel && (
          <text x={W - P.r} y={y(b.baseline) - 5} textAnchor="end" fontSize="11" fill="#8A8378" fontFamily="var(--font-mono), monospace">
            {b.baselineLabel}
          </text>
        )}
        {/* One marker per observation. Without them a reader cannot tell an
            observed day from a day the line merely passes through, and this
            project's whole rule is that a day nobody collected is never filled
            in. On a sparse series the line is interpolation and the dots are
            the data, so the dots have to be visible. */}
        {b.dots &&
          b.pts.map((pt, i) => (
            <circle key={i} cx={x(pt[0])} cy={y(pt[1])} r="3.5" fill="#ff5e1f" stroke="#FDFCF9" strokeWidth="1.5" />
          ))}
        {b.xLabels.map((l, i) => (
          <text
            key={l}
            x={x(i / (b.xLabels.length - 1))}
            y={H - 6}
            textAnchor={i === 0 ? 'start' : i === b.xLabels.length - 1 ? 'end' : 'middle'}
            fontSize="11"
            fill="#8A8378"
            fontFamily="var(--font-mono), monospace"
          >
            {l}
          </text>
        ))}
      </svg>
      {b.read && <p className="mt-4 max-w-[64ch] text-[13.5px] leading-relaxed text-[#5A544C]">{b.read}</p>}
    </div>
  )
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return (
              <h2 key={i} id={b.id} className="mt-16 scroll-mt-24 text-[1.5rem] font-semibold tracking-[-0.025em] first:mt-0">
                {b.text}
              </h2>
            )
          case 'p':
            return <p key={i} className="mt-5 max-w-[66ch] text-[16px] leading-[1.65] text-[#5A544C]">{b.text}</p>
          case 'lede':
            return (
              <p key={i} className="mt-10 max-w-[34ch] text-[clamp(1.25rem,2.3vw,1.75rem)] font-medium leading-[1.22] tracking-[-0.018em] text-[#14120F]">
                {b.text}
              </p>
            )
          case 'stats':
            return (
              <div key={i} className="mt-10 grid gap-px border-y border-[#14120F]/15 bg-[#14120F]/15 sm:grid-cols-3">
                {b.items.map(s => (
                  <div key={s.figure} className="bg-[#F3F3F1] px-4 py-6">
                    <p className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-none tracking-[-0.04em] text-[#ff5e1f] tabular-nums">
                      {s.figure}
                    </p>
                    <p className="mt-2.5 text-[12.5px] leading-snug text-[#5A544C]">{s.caption}</p>
                  </div>
                ))}
              </div>
            )
          case 'bars':
            return (
              <div key={i} className="mt-10">
                <FigHead title={b.title} unit={b.unit} />
                <div className="mt-5 flex flex-col gap-3">
                  {b.bars.map(bar => (
                    <div key={bar.label} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,13.5rem)_1fr_auto]">
                      {/* Wraps rather than truncates. At 8.5rem with `truncate`,
                          18 of the 67 bar labels across these case studies were
                          silently cut to an ellipsis: "OMO Sensitive La...",
                          "Store brand, packaged st...". A chart that hides which
                          product it is measuring is not a chart. A long label
                          costs a second line, which is the cheaper failure. */}
                      <span className="text-[12.5px] leading-snug text-[#5A544C]">{bar.label}</span>
                      {/* No filled background track: 9.F calls those dashboard
                          clutter. The bar is the value, the gap is just space. */}
                      <span className="h-2">
                        <span
                          className={`block h-full ${bar.lead ? 'bg-[#ff5e1f]' : 'bg-[#14120F]/25'}`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </span>
                      <span className={`text-[12.5px] tabular-nums ${bar.lead ? 'text-[#C13E00]' : 'text-[#14120F]'}`} style={mono}>
                        {bar.value}
                      </span>
                    </div>
                  ))}
                </div>
                {b.read && <p className="mt-5 max-w-[64ch] text-[13.5px] leading-relaxed text-[#5A544C]">{b.read}</p>}
              </div>
            )
          case 'line':
            return <LineChart key={i} b={b} />
          case 'fig':
            return (
              <figure key={i} className="m-0 mt-10">
                <div className="relative aspect-[1992/1152] overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
                  <Image src={b.src} alt={b.alt} fill sizes="(max-width:1100px) 92vw, 820px" className="object-cover object-top" />
                </div>
                <figcaption className="mt-3 text-[12.5px] leading-relaxed text-[#8A8378]" style={mono}>
                  {b.page && <span className="text-[#C13E00]">{b.page}. </span>}
                  {b.caption}
                </figcaption>
              </figure>
            )
          case 'note':
            return <Note key={i}>{b.text}</Note>
          case 'flow':
            return (
              <ol key={i} className="mt-9 border-t border-[#14120F]/20">
                {b.items.map((f, n) => (
                  <li key={f.stage} className="grid grid-cols-[auto_minmax(0,9rem)_1fr] items-baseline gap-4 border-b border-[#14120F]/15 py-4">
                    <span className="text-[11px] tabular-nums text-[#8A8378]" style={mono}>{String(n + 1).padStart(2, '0')}</span>
                    <span className="text-[13.5px] font-semibold">{f.stage}</span>
                    <span className="text-[12.5px] text-[#5A544C]" style={mono}>{f.tool}, {f.what}</span>
                  </li>
                ))}
              </ol>
            )
          case 'list':
            return (
              <ol key={i} className="mt-6 border-b border-[#14120F]/15">
                {b.items.map((n, ix) => (
                  <li key={n.slice(0, 20)} className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#14120F]/15 py-5">
                    <span className="text-[12px] tabular-nums text-[#8A8378]" style={mono}>{String(ix + 1).padStart(2, '0')}</span>
                    <span className="max-w-[62ch] text-[14.5px] leading-relaxed text-[#5A544C]">{n}</span>
                  </li>
                ))}
              </ol>
            )
          case 'pull':
            return (
              <blockquote key={i} className="mt-14 max-w-[34ch] border-l-2 border-[#ff5e1f] pl-6 text-[clamp(1.25rem,2.3vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.018em]">
                {b.text}
              </blockquote>
            )
        }
      })}
    </>
  )
}

export default function CaseStudy(p: CaseStudyProps) {
  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/projects/data" />

      <header className="mx-auto max-w-[1400px] px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <p className="text-[11.5px] text-[#C13E00]" style={mono}>{p.kicker}</p>
        <h1 className="mt-5 max-w-[22ch] text-[clamp(2.25rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {p.hookLead} <span className="text-[#ff5e1f]">{p.hookTail}</span>
        </h1>
        <p className="mt-7 max-w-[60ch] text-[16.5px] leading-relaxed text-[#5A544C]">{p.sub}</p>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <dl className="border-t border-[#14120F]/20 pt-5">
              {p.meta.map(([k, v]) => (
                <div key={k} className="mb-4">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>{k}</dt>
                  <dd className="mt-1 text-[13.5px] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <nav className="mt-6 border-t border-[#14120F]/20 pt-5" style={mono}>
              {p.contents.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="block py-1.5 text-[12.5px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-2 border-t border-[#14120F]/20 pt-5" style={mono}>
              {p.links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[12.5px] transition-colors hover:text-[#C13E00] ${l.primary ? 'font-semibold text-[#14120F]' : 'text-[#5A544C]'}`}
                >
                  {l.label} <span aria-hidden="true">&rarr;</span>
                </a>
              ))}
            </div>
          </aside>

          <main className="min-w-0">
            <Reveal>
              <div><Blocks blocks={p.blocks} /></div>
            </Reveal>
          </main>
        </div>
      </div>

      <nav className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <Link href={p.nextStudy.href} className="group block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-12 md:px-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Next case study</p>
              <p className="mt-2 text-[clamp(1.4rem,3vw,2.1rem)] font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#C13E00]">
                {p.nextStudy.title}
              </p>
            </div>
            <span aria-hidden="true" className="text-[1.5rem] transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </Link>
      </nav>
    </div>
  )
}
