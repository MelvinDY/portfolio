"use client"

import { useState } from 'react'
import Link from 'next/link'
import TeHeader from '../components/te-header'
import { useTeEffects } from '../lib/use-te-effects'

const POSTS = [
  {
    href: '/blog/bg3-swords-bard-control-martial',
    text: 'baldur gate 3 bg3 swords bard college of swords control martial build guide 10/1/1 fighter wizard multiclass slashing flourish arcane acuity command confusion hold person',
    tags: 'random',
    date: 'Jun 2026',
    rt: '10 min read',
    title: "The BG3 Build That Made Me Feel Like a Villain: Swords Bard 10/1/1",
    excerpt: "I've been playing the Control Martial Swords Bard in Baldur's Gate 3 and it's genuinely the most satisfying build I've run. Full caster. Competitive martial. Paralyses everything.",
    tagLabels: ['Random'],
  },
  {
    href: '/blog/claude-design-review',
    text: 'claude design anthropic labs rapid frontend prototyping wireframe ai design tool opus 4.7',
    tags: 'software-engineering',
    date: 'Jun 2026',
    rt: '4 min read',
    title: "Claude Design Is the Fastest Way I've Found to Go From Idea to Frontend",
    excerpt: "Anthropic's new Claude Design product genuinely changes how fast you can build UI. I used it to prototype the hero section of this portfolio. Here's what works, what doesn't, and where I still reach for the keyboard.",
    tagLabels: ['Software Engineering'],
  },
  {
    href: '/blog/google-data-analytics-review',
    text: 'google data analytics professional certificate review bigquery sql tableau r capstone beginner coursera',
    tags: 'data-analysis',
    date: 'Jun 2026',
    rt: '4 min read',
    title: 'Honest Review: Google Data Analytics Professional Certificate',
    excerpt: "I completed it in 3 months. The BigQuery section is genuinely great, the SQL modules are painfully slow if you already know what you're doing, and it's exactly what it says it is — a course for beginners.",
    tagLabels: ['Data Analysis'],
  },
  {
    href: '/blog/unihack-2026-peersuade',
    text: 'peersuade unihack 2026 debate game ai voters political disengagement hackathon most fun idea best design voice real-time multiplayer',
    tags: 'hackathon,software-engineering',
    date: 'Mar 2026',
    rt: '5 min read',
    title: 'Peersuade: How We Won UNIHACK 2026 with a Debate Game About Nothing',
    excerpt: "We built a real-time 1v1 debate game where AI voters judge a fictional Australian election. It won Most Fun Idea and an Honorable Mention for Best Design at Australia's largest student hackathon.",
    tagLabels: ['Hackathon', 'Software Engineering'],
  },
  {
    href: '/blog/onlycode-hackathon',
    text: 'building onlycode peer-to-peer coding platform hackathon experience gamified collaboration edtech websockets real-time',
    tags: 'hackathon,software-engineering',
    date: 'Jan 23, 2025',
    rt: '6 min read',
    title: 'Building OnlyCode: A Peer-to-Peer Coding Platform Hackathon Experience',
    excerpt: 'My experience building OnlyCode, a gamified peer-to-peer coding platform that brings back the human element to algorithm practice, during an intense hackathon weekend.',
    tagLabels: ['Hackathon', 'Software Engineering'],
  },
  {
    href: '/blog/portfolio-live',
    text: 'my portfolio is live here is what i learned next.js shadcn ui tailwindcss web development blog system',
    tags: 'software-engineering',
    date: 'Dec 15, 2024',
    rt: '4 min read',
    title: "My Portfolio is Live: Here's What I Learned",
    excerpt: 'After building this portfolio from scratch with Next.js and shadcn/ui, here are the key lessons I learned about modern web development and what\'s coming next.',
    tagLabels: ['Software Engineering'],
  },
  {
    href: '/blog/hello-world',
    text: 'hello world testing new blog system next.js typescript markdown rendering',
    tags: 'software-engineering',
    date: 'Dec 1, 2024',
    rt: '2 min read',
    title: 'Hello World!',
    excerpt: 'Testing out my new blog system built with Next.js and TypeScript. Time to see if all those components and helper functions actually work!',
    tagLabels: ['Software Engineering'],
  },
]

const TAG_BUTTONS = [
  { label: 'All', value: 'all' },
  { label: 'Data Analysis', value: 'data-analysis' },
  { label: 'Software Engineering', value: 'software-engineering' },
  { label: 'Data Engineering', value: 'data-engineering' },
  { label: 'Hackathon', value: 'hackathon' },
  { label: 'Random', value: 'random' },
]

export default function BlogPage() {
  useTeEffects()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('all')

  const visible = POSTS.filter(p => {
    const term = query.trim().toLowerCase()
    const matchText = !term || p.text.includes(term) || p.tags.includes(term)
    const matchTag = activeTag === 'all' || p.tags.split(',').includes(activeTag)
    return matchText && matchTag
  })

  return (
    <div className="te-home">
      <TeHeader activePage="blog" />

      <main>
        <section className="blog-hero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span><span className="now">blog</span>
            </div>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Writing<br /><span className="outline">&amp; notes</span>
            </h1>
            <p className="lead" data-reveal data-reveal-delay="2">
              Honest write-ups on data, web development, hackathon weekends and the occasional lesson learned the hard way.{' '}
              <span className="acid-text">Search it, filter it, read it.</span>
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="blog-controls" data-reveal>
              <div className="search">
                <span className="si">⌕</span>
                <input
                  type="text"
                  placeholder="search posts…"
                  autoComplete="off"
                  aria-label="Search posts"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <div className="tagfilter">
                {TAG_BUTTONS.map(tb => (
                  <button
                    key={tb.value}
                    className={`tagbtn${activeTag === tb.value ? ' on' : ''}`}
                    onClick={() => setActiveTag(tb.value)}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="post-count"><span>{visible.length}</span> posts</div>

            <div className="postlist">
              {visible.map(p => (
                <Link key={p.href} className="post" href={p.href}>
                  <div className="p-date">{p.date}<span className="rt">{p.rt}</span></div>
                  <div>
                    <h3>{p.title}</h3>
                    <p className="p-ex">{p.excerpt}</p>
                    <div className="p-tags">
                      {p.tagLabels.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <span className="p-arrow">↗</span>
                </Link>
              ))}
            </div>

            {visible.length === 0 && (
              <div className="no-results show">No posts match that search — try another term or clear the filters.</div>
            )}
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-cta">Got a<br /><span className="dim">question?</span></div>
              <p className="mono faint" style={{ marginTop: '18px', fontSize: '12px', letterSpacing: '0.05em' }}>
                I write about what I build · Sydney, AU
              </p>
            </div>
            <div className="foot-col">
              <h4>Navigate</h4>
              <Link href="/">Home</Link>
              <Link href="/projects/data">Data Projects</Link>
              <Link href="/projects/software">Software Projects</Link>
              <Link href="/about">About</Link>
              <Link href="/stats">Site Analytics ↗</Link>
            </div>
            <div className="foot-col">
              <h4>Elsewhere</h4>
              <a href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="mailto:melvindarialyogiana@gmail.com">Email ↗</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Melvin Darial Yogiana</span>
            <span>Built in Sydney · <span className="acid-text">open to work</span></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
