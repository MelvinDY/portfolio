import type { Metadata } from 'next'
import Link from 'next/link'
import LightHeader from '../components/light-header'
import { LAST_UPDATED, storedFields, identity, processors, sections, links } from '../data/privacy'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How this site handles analytics and contact data: no cookies, nine stored fields, a visitor id that rotates daily, and a public dashboard showing the result.',
  alternates: { canonical: '/privacy' },
}

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

/**
 * The privacy page, written as the questions people actually arrive with.
 *
 * The previous version was vaguer than the truth in a way that undersold it.
 * It said the site "might use basic analytics" and shares nothing, when in
 * fact it runs its own tracker rather than embedding someone else's, stores
 * nine named fields, derives identity from a salted hash that rotates at
 * Sydney midnight, sets no cookies at all, publishes the result openly, and
 * does hand data to four processors it never named. Every claim here was
 * checked against the tracker route, the analytics helper, the email route and
 * the chat route.
 *
 * Every heading is a question in the reader's words and every answer opens
 * with the word that resolves it, so someone can scan the left column, find
 * theirs and stop. There is no preamble, because a preamble on a privacy page
 * is throat-clearing in front of someone who is already slightly worried.
 *
 * Dials are deliberately low. Section 1.A puts a trust-first page at variance
 * 3 to 4 and motion 2 to 3, and 0.A says that constraint overrides taste: a
 * privacy page that looks clever reads as one with something to hide.
 */

/** Question wording per section, keyed by id. Kept beside the layout because
 *  it is phrasing rather than content, and it only makes sense here. */
const QUESTION: Record<string, string> = {
  'contact-form': 'What happens if I message you?',
  chat: 'What happens if I use the chat box?',
  storage: 'Are you storing anything on my device?',
  selling: 'Are you selling any of this?',
  security: 'Is it secure?',
  changes: 'What if this policy changes?',
}

type Item = {
  q: string
  a: string[]
  fields?: boolean
  processors?: boolean
}

const QA: Item[] = [
  {
    q: 'Do you use cookies?',
    a: ['No. Not one. There is no consent banner on this site because there is nothing to consent to.'],
  },
  { q: 'So how do you count visitors?', a: identity.body },
  {
    q: 'What exactly gets recorded?',
    a: ['Nine fields per pageview, and that is the whole list. No scroll depth, no mouse movement, no session recording.'],
    fields: true,
  },
  {
    q: 'Who else gets to see it?',
    a: ['Four companies, because the site has to run somewhere and email has to be delivered by someone.'],
    processors: true,
  },
  ...sections.map(s => ({ q: QUESTION[s.id] ?? s.title, a: s.body })),
]

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader />

      <article className="mx-auto max-w-[1000px] px-5 pb-20 pt-16 md:px-10 md:pt-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C13E00]" style={mono}>Privacy</p>
        <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          The questions, and the actual answers.
        </h1>

        <div className="mt-12 border-t-2 border-[#14120F]">
          {QA.map(item => (
            <section
              key={item.q}
              className="grid grid-cols-1 gap-x-12 gap-y-4 border-b border-[#14120F]/15 py-9 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
            >
              <h2 className="text-[1.05rem] font-semibold leading-snug tracking-[-0.015em]">{item.q}</h2>

              <div>
                {item.a.map(p => (
                  <p key={p.slice(0, 20)} className="mt-4 max-w-[64ch] text-[15.5px] leading-[1.7] text-[#5A544C] first:mt-0">
                    {p}
                  </p>
                ))}

                {item.fields && (
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {storedFields.map(f => (
                      <li key={f.field} className="border-t border-[#14120F]/15 pt-3">
                        <span className="text-[12.5px] text-[#C13E00]" style={mono}>{f.field}</span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-[#8A8378]">{f.note}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.processors && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {processors.map(p => (
                      <li key={p.name} className="border-t border-[#14120F]/15 pt-3">
                        <span className="text-[14px] font-semibold">{p.name}</span>
                        <span className="ml-2 text-[13.5px] text-[#5A544C]">{p.role}</span>
                        <span className="mt-1 block text-[12.5px] text-[#8A8378]" style={mono}>{p.data}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3" style={mono}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
            >
              {l.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          ))}
          <span className="text-[12.5px] text-[#8A8378]">Last updated {LAST_UPDATED}</span>
        </div>
      </article>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-6 px-5 py-8 md:px-10" style={mono}>
          <Link href="/" className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
            Home <span aria-hidden="true">&rarr;</span>
          </Link>
          {/* No privacy link here: this is that page. Section 4.5 counts a
              repeated intent as a failure, and self-linking is the worst kind. */}
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {[
              ['All projects', '/projects/all'],
              ['Blog', '/blog'],
              ['GitHub', 'https://github.com/MelvinDY'],
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
