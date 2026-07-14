"use client"

import { useState } from 'react'
import Link from 'next/link'
import TeHeader from '../components/te-header'
import { useTeEffects } from '../lib/use-te-effects'
import { PostCard } from '../types/blog'

const TAG_BUTTONS = [
  { label: 'All', value: 'all' },
  { label: 'Data Analysis', value: 'data-analysis' },
  { label: 'Software Engineering', value: 'software-engineering' },
  { label: 'Data Engineering', value: 'data-engineering' },
  { label: 'Hackathon', value: 'hackathon' },
  { label: 'Random', value: 'random' },
]

export default function BlogIndex({ posts }: { posts: PostCard[] }) {
  useTeEffects()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('all')

  const visible = posts.filter(p => {
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
