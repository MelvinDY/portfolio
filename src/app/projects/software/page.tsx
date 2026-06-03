"use client"

import Link from 'next/link'
import TeHeader from '../../components/te-header'
import { useTeEffects } from '../../lib/use-te-effects'

export default function SoftwareProjectsPage() {
  useTeEffects()

  return (
    <div className="te-home">
      <TeHeader activePage="software" />

      <main>
        <section className="subhero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span><span className="now">software projects</span>
            </div>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Software<br /><span className="outline">Projects</span>
            </h1>
            <div className="subhero-foot">
              <p className="lead" data-reveal data-reveal-delay="2">
                Things I&apos;ve shipped — a community platform, an{' '}
                <span className="acid-text">award-winning</span> hackathon build, an AI Q&amp;A
                engine and a production student-housing site. Stack and source on every card.
              </p>
              <div className="subhero-meta" data-reveal data-reveal-delay="2">
                <div className="sm"><div className="v" data-count="4">4</div><div className="l">Builds</div></div>
                <div className="sm"><div className="v" data-count="2" data-suf="×">0</div><div className="l">Award wins</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="tight">
          <div className="wrap">
            <div className="index-grid">

              <div className="pcard scard" data-reveal>
                <div className="pcard-top">
                  <span className="pcard-no">/ 01</span>
                  <span className="winner mono">✷ UNIHACK 2026 · Most Fun + Best Design</span>
                </div>
                <h3>Peersuade</h3>
                <div className="pcard-sub">Real-time debate &amp; persuasion game</div>
                <p className="pcard-desc">A live multiplayer game where players argue wildly random prompts and an audience swings the vote in real time. Took home two UNIHACK 2026 categories — judged on fun and design.</p>
                <div className="stackrow">
                  <span className="tag">React</span><span className="tag">TypeScript</span><span className="tag">WebSocket</span><span className="tag">Node.js</span><span className="tag">Tailwind</span>
                </div>
                <div className="scard-links">
                  <a className="solid" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                  <a href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer">Devpost ↗</a>
                </div>
              </div>

              <div className="pcard scard" data-reveal data-reveal-delay="1">
                <div className="pcard-top">
                  <span className="pcard-no">/ 02</span>
                  <span className="badge">Team of 10</span>
                </div>
                <h3>Ignite</h3>
                <div className="pcard-sub">PPIA UNSW networking platform</div>
                <p className="pcard-desc">The official platform for PPIA UNSW — member profiles, event tooling and a directory connecting the Indonesian student community. Built and shipped with a team of ten contributors on a modular architecture.</p>
                <div className="stackrow">
                  <span className="tag">TypeScript</span><span className="tag">React</span><span className="tag">Supabase</span><span className="tag">PostgreSQL</span><span className="tag">Node.js</span>
                </div>
                <div className="scard-links">
                  <a className="solid" href="https://github.com/MelvinDY/ignite" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                </div>
              </div>

              <div className="pcard scard" data-reveal data-reveal-delay="2">
                <div className="pcard-top">
                  <span className="pcard-no">/ 03</span>
                  <span className="badge">COMP3900 · Capstone</span>
                </div>
                <h3>AI Confluence Q&amp;A Helper</h3>
                <div className="pcard-sub">RAG assistant over team docs</div>
                <p className="pcard-desc">A retrieval-augmented assistant that answers natural-language questions over a team&apos;s Confluence workspace with cited sources. UNSW software-engineering capstone, built agile in a team of five.</p>
                <div className="stackrow">
                  <span className="tag">Python</span><span className="tag">FastAPI</span><span className="tag">React</span><span className="tag">RAG</span><span className="tag">OpenAI</span>
                </div>
                <div className="scard-links">
                  <a className="solid" href="https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-3900-w18a-cherry" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                </div>
              </div>

              <div className="pcard scard" data-reveal data-reveal-delay="3">
                <div className="pcard-top">
                  <span className="pcard-no">/ 04</span>
                  <span className="badge">Production</span>
                </div>
                <h3>Rate My Accom NSW</h3>
                <div className="pcard-sub">Student accommodation reviews</div>
                <p className="pcard-desc">A review platform for NSW student housing — university-email verification, multi-dimensional ratings and a security pass covering XSS/CSRF protection and rate limiting. Production-ready, fully tested.</p>
                <div className="stackrow">
                  <span className="tag">Next.js 14</span><span className="tag">TypeScript</span><span className="tag">Zod</span><span className="tag">React Hook Form</span><span className="tag">Jest</span>
                </div>
                <div className="scard-links">
                  <a className="solid" href="https://github.com/MelvinDY/ratemyaccom" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="block tight">
          <div className="wrap center">
            <p className="kicker acid" data-reveal style={{ justifyContent: 'center' }}>Also an analyst</p>
            <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">Prefer to see the data work?</h2>
            <div className="mt-l" data-reveal data-reveal-delay="2">
              <Link className="btn primary" href="/projects/data" data-magnetic>
                View Data Projects <span className="arrow">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-cta">Let&apos;s<br /><span className="dim">build.</span></div>
              <p className="mono faint" style={{ marginTop: '18px', fontSize: '12px', letterSpacing: '0.05em' }}>
                Full-stack developer · UNSW Computer Science · Sydney, AU
              </p>
            </div>
            <div className="foot-col">
              <h4>Navigate</h4>
              <Link href="/">Home</Link>
              <Link href="/projects/data">Data Projects</Link>
              <Link href="/blog">Blog</Link>
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
