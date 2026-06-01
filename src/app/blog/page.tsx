"use client"

import { useState } from 'react'
import Link from 'next/link'
import TeHeader from '../components/te-header'
import { useTeEffects } from '../lib/use-te-effects'

const POSTS = [
  {
    href: '/blog/onlycode-hackathon',
    text: 'building onlycode peer-to-peer coding platform hackathon experience gamified collaboration edtech websockets real-time',
    tags: 'hackathon,react,real-time,websockets,collaboration,edtech',
    date: 'Jan 23, 2025',
    rt: '6 min read',
    title: 'Building OnlyCode: A Peer-to-Peer Coding Platform Hackathon Experience',
    excerpt: 'My experience building OnlyCode, a gamified peer-to-peer coding platform that brings back the human element to algorithm practice, during an intense hackathon weekend.',
    tagLabels: ['Hackathon', 'React', 'Real-time', 'WebSockets', 'EdTech'],
  },
  {
    href: '/blog/portfolio-live',
    text: 'my portfolio is live here is what i learned next.js shadcn ui tailwindcss web development blog system',
    tags: 'next.js,portfolio,shadcn ui,tailwindcss,web development',
    date: 'Dec 15, 2024',
    rt: '4 min read',
    title: "My Portfolio is Live: Here's What I Learned",
    excerpt: 'After building this portfolio from scratch with Next.js and shadcn/ui, here are the key lessons I learned about modern web development and what\'s coming next.',
    tagLabels: ['Next.js', 'Portfolio', 'Shadcn UI', 'TailwindCSS', 'Web Development'],
  },
  {
    href: '/blog/hello-world',
    text: 'hello world testing new blog system next.js typescript markdown rendering',
    tags: 'blog,hello world,next.js,testing',
    date: 'Dec 1, 2024',
    rt: '2 min read',
    title: 'Hello World!',
    excerpt: 'Testing out my new blog system built with Next.js and TypeScript. Time to see if all those components and helper functions actually work!',
    tagLabels: ['Blog', 'Hello World', 'Next.js', 'Testing'],
  },
]

const TAG_BUTTONS = [
  { label: 'All', value: 'all' },
  { label: 'Hackathon', value: 'hackathon' },
  { label: 'Next.js', value: 'next.js' },
  { label: 'React', value: 'react' },
  { label: 'Web Dev', value: 'web development' },
  { label: 'Real-time', value: 'real-time' },
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
