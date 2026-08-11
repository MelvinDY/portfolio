import Link from 'next/link'
import { hero, socials, entries, toolbox } from '../data/about'
import { softwareProjects, dataProjects } from '../data/project-index'

/**
 * The resume, as a page and as the source of the PDF.
 *
 * It derives from `about.ts` and `project-index.ts` rather than restating them.
 * Every fact on this site has been wrong in at least two places at once at some
 * point, most recently a graduation date that appeared four different ways, so a
 * resume with its own hand-typed copy of the same facts is a guarantee of future
 * drift. Change the data, and the site, the chatbot and this all move together.
 *
 * Laid out for a machine first. An applicant tracking system reads a PDF as one
 * linear stream of text, so this is a single column with conventional section
 * headings, real text rather than pictures of text, no icon glyphs standing in
 * for words, and contact details as plain selectable characters at the top.
 * The visual restraint is not minimalism for its own sake: multi-column resumes
 * and text baked into graphics are the two things that reliably parse to
 * nonsense.
 *
 * @media print drops the navigation, the download button and the page chrome,
 * fixes the measure to A4 and lets the browser paginate. Nothing about the
 * content changes between screen and paper.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

const work = entries.filter(e => e.kind === 'work')
const study = entries.filter(e => e.kind === 'education')

/* The four builds the software page leads with, plus the data case studies, in
   the same order the site presents them. */
const featuredSoftware = softwareProjects.filter(p => p.featured)
const featuredData = dataProjects.filter(p => p.featured)

const Rule = ({ children }: { children: string }) => (
  <h2
    className="mb-3 mt-7 border-b border-[#14120F]/25 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#14120F] print:mt-5"
    style={mono}
  >
    {children}
  </h2>
)

export default function ResumeSheet() {
  return (
    <div className="min-h-[100dvh] bg-[#EAEAE6] py-10 print:bg-white print:py-0" style={display}>
      {/* Screen-only chrome. Hidden on paper so the PDF opens on the name. */}
      <div className="mx-auto mb-6 flex max-w-[820px] flex-wrap items-center justify-between gap-4 px-5 print:hidden">
        <Link href="/about" className="text-[13px] text-[#5A544C] underline-offset-4 hover:text-[#C13E00] hover:underline">
          ← Back to the site
        </Link>
        <a
          href="/melvin-yogiana-resume.pdf"
          className="bg-[#C13E00] px-5 py-2.5 text-[13px] font-semibold text-[#F3F3F1] transition-transform active:scale-[0.98]"
          download
        >
          Download PDF
        </a>
      </div>

      <article className="mx-auto max-w-[820px] bg-[#F3F3F1] px-9 py-10 text-[#14120F] shadow-[0_18px_50px_-30px_rgba(20,18,15,0.5)] print:max-w-none print:bg-white print:p-0 print:shadow-none">
        <header>
          <h1 className="text-[30px] font-semibold leading-none tracking-[-0.035em]">Melvin Darial Yogiana</h1>
          <p className="mt-2 text-[14px] font-medium text-[#C13E00]">Data Analyst and Full-Stack Developer</p>
          {/* Plain text, no icons. An icon is not a word to a parser. */}
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-[#5A544C]" style={mono}>
            Sydney, Australia
            <span className="px-1.5 text-[#736C60]">/</span>
            melvindarialyogiana@gmail.com
            <span className="px-1.5 text-[#736C60]">/</span>
            github.com/MelvinDY
            <span className="px-1.5 text-[#736C60]">/</span>
            linkedin.com/in/melvin-yogiana
          </p>
          <p className="mt-4 max-w-[74ch] text-[13px] leading-relaxed text-[#5A544C]">{hero.intro}</p>
        </header>

        <Rule>Experience</Rule>
        {work.map(e => (
          <section key={`${e.org}-${e.year}`} className="mb-5 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[14.5px] font-semibold">
                {e.role}, {e.org}
              </h3>
              <span className="text-[11px] text-[#736C60]" style={mono}>{e.period}</span>
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {e.points.map(p => (
                <li key={p} className="relative pl-4 text-[12.5px] leading-relaxed text-[#3F3A34]">
                  <span aria-hidden="true" className="absolute left-0 top-[8px] h-px w-2 bg-[#C13E00]" />
                  {p}
                </li>
              ))}
            </ul>
            {e.tags && (
              /* Comma, not a middle dot. The keywords either side extract fine
                 regardless, but a parser reading latin-1 turns · into a
                 replacement character, and a recruiter then sees the skills
                 line as "Azure ? SQL ? LSEG" inside their tracking system. */
              <p className="mt-2 text-[10.5px] text-[#736C60]" style={mono}>{e.tags.join(', ')}</p>
            )}
          </section>
        ))}

        {/* Title, the one true thing about it, and the stack. The full blurb
            lives on the site and costs a page here: with all eight carrying
            theirs, this ran to three pages, which reads as padding on a resume
            for someone a year out of university. For the data work the `note`
            is the finding itself, so dropping the blurb loses very little. */}
        <Rule>Selected projects</Rule>
        <ul className="flex flex-col gap-1.5">
          {[...featuredSoftware, ...featuredData].map(p => (
            <li key={p.id} className="break-inside-avoid text-[12px] leading-relaxed text-[#3F3A34]">
              <span className="font-semibold text-[#14120F]">{p.title}</span>
              {p.note && <span className="text-[#C13E00]">, {p.note}</span>}
              <span className="text-[#736C60]" style={mono}>. {p.stack.join(', ')}</span>
            </li>
          ))}
        </ul>

        <Rule>Education</Rule>
        {study.map(e => (
          <section key={`${e.org}-${e.year}`} className="mb-4 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[14.5px] font-semibold">
                {e.role}, {e.org}
              </h3>
              <span className="text-[11px] text-[#736C60]" style={mono}>{e.period}</span>
            </div>
            {e.status && <p className="mt-1 text-[11px] text-[#736C60]" style={mono}>{e.status}</p>}
            {e.awards && (
              /* Titles only. The detail line explains which project won, which
                 the projects section above already names. */
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {e.awards.map(a => (
                  <li key={a.title} className="text-[12px] text-[#C13E00]">{a.title}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <Rule>Skills</Rule>
        <div className="flex flex-col gap-2">
          {toolbox.map(t => (
            <p key={t.title} className="text-[12.5px] leading-relaxed">
              <span className="font-semibold">{t.title}: </span>
              <span className="text-[#5A544C]">{t.chips.join(', ')}</span>
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}
