"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import LightHeader from '../../components/light-header'
import PostBody, { processContent, headings } from '../../components/post-body'
import type { BlogPost } from '../../types/blog'

/**
 * The post page: a reading column with a standing rail.
 *
 * The technical posts here run past two thousand words across eight or more
 * sections, and on those a reader genuinely loses track of where they are and
 * how much is left. Contents and a progress bar answer both without
 * interrupting the prose, and it matches the case-study shell, so moving
 * between a write-up and a post keeps one reading model.
 *
 * The progress bar is a scroll-linked CSS animation, so it costs no
 * JavaScript at all and simply does not appear where the browser lacks
 * support. The contents highlighting does need JS, and the important detail is
 * that the observer is only a trigger: band membership cannot answer "which
 * section am I in", because most of the time no heading sits inside the band
 * and the rail would hold whatever it last saw. The answer comes from
 * measuring where the headings are, which is not a scroll listener and so
 * stays inside Section 5.D.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const
const display = { fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' } as const

export default function BlogPostTE({ post, next }: { post: BlogPost; next: BlogPost | null }) {
  const content = useMemo(() => (post.content ? processContent(post.content) : ''), [post.content])
  const toc = useMemo(() => headings(content), [content])
  const [active, setActive] = useState<string>(toc[0]?.id ?? '')

  useEffect(() => {
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    if (els.length === 0) return

    const pick = () => {
      const above = toc.filter(t => {
        const el = document.getElementById(t.id)
        return el ? el.getBoundingClientRect().top < 100 : false
      })
      setActive(above.length > 0 ? above[above.length - 1].id : toc[0].id)
    }

    const io = new IntersectionObserver(pick, { threshold: 0, rootMargin: '-96px 0px -60% 0px' })
    els.forEach(el => io.observe(el))
    pick()
    return () => io.disconnect()
  }, [toc])

  return (
    <div className="min-h-[100dvh] bg-[#F3F3F1] text-[#14120F] antialiased" style={display}>
      <LightHeader active="/blog" />

      <div className="sticky top-16 z-30 h-[2px] bg-[#14120F]/10" aria-hidden="true">
        <div className="reading-progress h-full origin-left bg-[#ff5e1f]" />
      </div>
      <style>{`
        .reading-progress { transform: scaleX(0); }
        @supports (animation-timeline: scroll()) {
          .reading-progress {
            animation: grow-progress linear both;
            animation-timeline: scroll(root block);
          }
          @keyframes grow-progress { to { transform: scaleX(1); } }
        }
        @media (prefers-reduced-motion: reduce) { .reading-progress { animation: none; } }
      `}</style>

      <header className="mx-auto max-w-[1400px] px-5 pt-12 pb-10 md:px-10 md:pt-16">
        <nav className="flex items-center gap-2 text-[11.5px] text-[#8A8378]" style={mono} aria-label="Breadcrumb">
          <Link href="/blog" className="transition-colors hover:text-[#C13E00]">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#5A544C]">{post.date}</span>
        </nav>
        <h1 className="mt-7 max-w-[22ch] text-[clamp(2rem,4.8vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.035em]">
          {post.title}
        </h1>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="border-t border-[#14120F]/20 pt-5">
              {post.readTime && (
                <div className="mb-4">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Read time</dt>
                  <dd className="mt-1 text-[13.5px] text-[#C13E00]">{post.readTime}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Filed under</dt>
                <dd className="mt-1 text-[13.5px] leading-snug">{post.tags.join(', ')}</dd>
              </div>
            </dl>

            {toc.length > 0 && (
              <nav className="mt-6 border-t border-[#14120F]/20 pt-5" style={mono} aria-label="On this page">
                {toc.map(t => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    aria-current={active === t.id ? 'true' : undefined}
                    className={`block border-l-2 py-1.5 pl-3 text-[12px] leading-snug transition-colors ${
                      active === t.id
                        ? 'border-[#ff5e1f] text-[#C13E00]'
                        : 'border-transparent text-[#8A8378] hover:text-[#14120F]'
                    }`}
                  >
                    {t.text}
                  </a>
                ))}
              </nav>
            )}
          </aside>

          <main className="min-w-0">
            {content ? <PostBody content={content} /> : <p className="text-[17px] leading-[1.75]">{post.excerpt}</p>}
            <p className="mt-16 border-t border-[#14120F]/15 pt-8 text-[14px] text-[#8A8378]" style={mono}>Melvin</p>
          </main>
        </div>
      </div>

      {/* Next post, or back to the index when this is the newest. */}
      <nav className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <Link href={next ? `/blog/${next.id}` : '/blog'} className="group block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-12 md:px-10">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>
                {next ? 'Next post' : 'Back to'}
              </p>
              <p className="mt-2 text-[clamp(1.4rem,3vw,2.1rem)] font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#C13E00]">
                {next ? next.title : 'All writing'}
              </p>
            </div>
            <span aria-hidden="true" className="shrink-0 text-[1.5rem] transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </Link>
      </nav>

      <footer className="border-t border-[#14120F]/15 bg-[#EAEAE6]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 px-5 py-8 md:px-10" style={mono}>
          <Link href="/blog" className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
            All writing <span aria-hidden="true">&rarr;</span>
          </Link>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {[
              ['All projects', '/projects/all'],
              ['Privacy', '/privacy'],
              ['GitHub', 'https://github.com/MelvinDY'],
              ['Email', 'mailto:melvindarialyogiana@gmail.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-[13px] text-[#5A544C] transition-colors hover:text-[#C13E00]">
                {label} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
