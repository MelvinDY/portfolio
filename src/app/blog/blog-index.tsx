"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import LightHeader from '../components/light-header'
import type { PostCard } from '../types/blog'

/**
 * The blog index, as a reading list.
 *
 * Ten posts is not an archive, it is a reading list. At that size the controls
 * should almost disappear, because scrolling the whole thing is faster than
 * deciding how to filter it. So search and tags collapse into one quiet row
 * and the list itself takes the weight, with every post showing its date,
 * title, excerpt, tags and read time so a reader can judge it without
 * clicking.
 *
 * Two accessibility details worth keeping. The search field carries a visible
 * label rather than relying on its placeholder, because Section 4.6 bans
 * placeholder-as-label outright. And focus lands visibly: the search row shows
 * a ring on focus-within and every control has its own focus-visible state,
 * rather than the input suppressing its outline.
 *
 * Palette and type scale locked to the projects section: same site.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

const TAGS = [
  ['all', 'All'],
  ['data-analysis', 'Data analysis'],
  ['software-engineering', 'Software engineering'],
  ['data-engineering', 'Data engineering'],
  ['hackathon', 'Hackathon'],
  ['random', 'Random'],
] as const

export default function BlogIndex({ posts }: { posts: PostCard[] }) {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('all')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return posts.filter(p => {
      const matchText = !term || p.text.includes(term) || p.tags.includes(term)
      const matchTag = tag === 'all' || p.tags.split(',').includes(tag)
      return matchText && matchTag
    })
  }, [posts, query, tag])

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/blog" />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[0.93] tracking-[-0.045em]">
              Writing
              <br />
              and notes.
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[42ch] text-[16px] leading-relaxed text-[#5A544C]">
              Build notes on data and web work, hackathon weekends, and the occasional lesson
              learned the hard way.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-[#14120F]/15 py-4">
          <div className="flex min-w-[14rem] flex-1 items-center gap-3 focus-within:outline focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-[#ff5e1f]">
            <label
              htmlFor="post-search"
              className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-[#8A8378]"
              style={mono}
            >
              Search
            </label>
            <input
              id="post-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-[14px] text-[#14120F] outline-none placeholder:text-[#8A8378]"
              style={mono}
            />
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2" style={mono}>
            {TAGS.map(([v, label]) => (
              <button
                key={v}
                onClick={() => setTag(v)}
                aria-pressed={tag === v}
                className={`text-[11.5px] transition-colors hover:text-[#C13E00] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#ff5e1f] ${tag === v ? 'text-[#C13E00]' : 'text-[#8A8378]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="text-[11.5px] tabular-nums text-[#8A8378]" style={mono} aria-live="polite">
            {visible.length} of {posts.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-[15px] text-[#5A544C]">
            Nothing matches that. Try another term, or clear the filter.
          </p>
        ) : (
          <div className="border-b border-[#14120F]/15">
            {visible.map(p => (
              <Link
                key={p.href}
                href={p.href}
                className="group grid grid-cols-1 items-baseline gap-x-10 gap-y-3 border-t border-[#14120F]/15 py-8 transition-colors hover:bg-[#EAEAE6] md:grid-cols-[9rem_minmax(0,1fr)_auto] md:px-3"
              >
                <span className="text-[11.5px] text-[#8A8378]" style={mono}>
                  {p.date}
                  <span className="ml-3 text-[#C13E00]">{p.rt}</span>
                </span>

                <span className="min-w-0">
                  <span className="block text-[clamp(1.15rem,1.9vw,1.5rem)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#C13E00]">
                    {p.title}
                  </span>
                  <span className="mt-2.5 block max-w-[64ch] text-[15px] leading-relaxed text-[#5A544C]">
                    {p.excerpt}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1" style={mono}>
                    {p.tagLabels.map(t => (
                      <span key={t} className="text-[11px] text-[#8A8378]">{t}</span>
                    ))}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="text-[14px] text-[#8A8378] transition-transform group-hover:translate-x-1 group-hover:text-[#C13E00]"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
              I write about what I build.
            </p>
            <p className="mt-3 text-[13px] text-[#5A544C]" style={mono}>
              Data, web work and the occasional hackathon. Sydney, AU.
            </p>
            <Link
              href="/projects/all"
              className="mt-5 inline-block border-b border-[#14120F]/30 pb-0.5 text-[13px] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
              style={mono}
            >
              All projects <span aria-hidden="true">&rarr;</span>
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
