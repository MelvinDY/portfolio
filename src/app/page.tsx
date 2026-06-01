"use client"

import Link from 'next/link'
import { useTeEffects } from './lib/use-te-effects'

export default function HomePage() {
  useTeEffects()

  return (
    <div className="te-home">
      <header className="site-head">
        <div className="wrap">
          <Link className="brand" href="/">
            <span className="dot" />
            <b>MELVIN</b><span className="slash">/</span><span className="dim">m3lv1n</span>
          </Link>
          <nav className="nav">
            <Link href="/projects/data">Data</Link>
            <Link href="/projects/software">Software</Link>
            <Link href="/blog" className="hide-sm">Blog</Link>
            <Link href="/about" className="hide-sm">About</Link>
            <span className="sep" />
            <Link href="#contact" className="acid-text">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="top">
          <div className="wrap hero-inner">
            <div className="hero-head" data-reveal>
              <span className="kicker acid">Sydney, AU &nbsp;·&nbsp; Open to 2026 roles</span>
            </div>
            <h1 className="display hero-name" data-reveal data-reveal-delay="1">
              Melvin<br /><span className="outline">Yogiana</span>
            </h1>
            <div className="hero-grid">
              <div className="hero-lead" data-reveal data-reveal-delay="2">
                <div className="role-line">
                  <span className="role-i mono">I build &amp; analyse —</span>
                  <span className="role mono" data-rotator='["Data Analyst","Analytics Engineer","Full-Stack Developer"]'>
                    Data Analyst
                  </span>
                </div>
                <p className="lead">
                  UNSW Computer Science student turning messy datasets into decisions
                  and ideas into shipped products. I live where the SQL meets the UI —
                  and I like the answer to be <span className="acid-text">obvious</span> by the end.
                </p>
                <div className="hero-cta">
                  <Link className="btn primary" href="/projects/data" data-magnetic>
                    View Data Projects <span className="arrow">↗</span>
                  </Link>
                  <Link className="btn" href="/projects/software" data-magnetic>
                    View Software Projects <span className="arrow">↗</span>
                  </Link>
                </div>
              </div>

              <aside className="hero-panel" data-reveal data-reveal-delay="3" aria-hidden="true">
                <div className="panel-bar">
                  <span className="mono">~/signal.live</span>
                  <span className="panel-dots"><i /><i /><i /></span>
                </div>
                <div className="panel-body">
                  <div className="panel-metric">
                    <span className="pm-lab mono">THROUGHPUT</span>
                    <span className="pm-val mono">1.24M rows/s</span>
                  </div>
                  <svg className="spark" viewBox="0 0 320 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ccff4d" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ccff4d" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="spark-area" d="M0,86 L26,70 L52,78 L78,52 L104,60 L130,38 L156,48 L182,28 L208,40 L234,20 L260,34 L286,16 L320,26 L320,120 L0,120 Z" fill="url(#ga)" />
                    <path className="spark-line" d="M0,86 L26,70 L52,78 L78,52 L104,60 L130,38 L156,48 L182,28 L208,40 L234,20 L260,34 L286,16 L320,26" fill="none" stroke="#ccff4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="panel-bars">
                    <div className="pb"><span className="pb-fill" data-bar="92" /><span className="pb-l mono">SQL</span></div>
                    <div className="pb"><span className="pb-fill" data-bar="88" /><span className="pb-l mono">Python</span></div>
                    <div className="pb"><span className="pb-fill" data-bar="80" /><span className="pb-l mono">TS / React</span></div>
                    <div className="pb"><span className="pb-fill" data-bar="74" /><span className="pb-l mono">dbt / ETL</span></div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          <a className="scroll-cue mono" href="#about">
            <span>scroll</span>
            <span className="cue-line" />
          </a>
        </section>

        {/* ABOUT */}
        <section id="about" className="block">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker" data-reveal>01 — About</span>
                <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">
                  Half analyst.<br />Half engineer.<br /><span className="dim">Fully curious.</span>
                </h2>
              </div>
              <p className="lead" data-reveal data-reveal-delay="2">
                I&apos;m a Computer Science student at UNSW who got hooked on the moment a
                chart finally makes a room go <em className="serif">&ldquo;oh&rdquo;</em>. Most of my
                work lives between two worlds — wrangling data into honest insight, and
                building the software that puts that insight in front of people.
              </p>
            </div>
            <div className="about-cols">
              <div className="about-col" data-reveal>
                <span className="idx">/ data</span>
                <p>SQL, Python (pandas / numpy), dbt and dashboards. I care about the boring parts — clean joins, sane definitions, and a number you can actually defend in a meeting.</p>
              </div>
              <div className="about-col" data-reveal data-reveal-delay="1">
                <span className="idx">/ software</span>
                <p>TypeScript, React, Next.js, Node and Postgres. Five hackathons, a capstone, and a habit of shipping the demo before the deadline panic sets in.</p>
              </div>
              <div className="about-col" data-reveal data-reveal-delay="2">
                <span className="idx">/ the goal</span>
                <p>A Data Analyst / Analytics Engineer seat in Sydney where I can own a question end-to-end — from the raw extract to the slide that changes a decision.</p>
              </div>
            </div>
            <div className="statline about-stats" data-reveal>
              <div className="stat">
                <span className="num" data-count="8" data-suf="+">0</span>
                <span className="lab">Projects shipped</span>
              </div>
              <div className="stat">
                <span className="num" data-count="4" data-suf="×">0</span>
                <span className="lab">Hackathon awards</span>
              </div>
              <div className="stat">
                <span className="num" data-count="1.2" data-suf="M+">0</span>
                <span className="lab">Rows analysed</span>
              </div>
              <div className="stat">
                <span className="num" data-count="2026">0</span>
                <span className="lab">Grad year</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORK SPLIT */}
        <section className="block tight">
          <div className="wrap">
            <div className="worksplit">
              <Link className="ws-card" href="/projects/data" data-reveal>
                <div className="ws-top">
                  <span className="idx">/ 01</span>
                  <span className="mono faint">4 case studies</span>
                </div>
                <h3>Data<br />Projects</h3>
                <p className="dim">Dashboards, pricing wars, trending-video forensics and a revenue pipeline — each written as a data story, not a README.</p>
                <span className="cardlink">Enter the data desk <span className="arrow">↗</span></span>
              </Link>
              <Link className="ws-card alt" href="/projects/software" data-reveal data-reveal-delay="1">
                <div className="ws-top">
                  <span className="idx">/ 02</span>
                  <span className="mono faint">4 builds</span>
                </div>
                <h3>Software<br />Projects</h3>
                <p className="dim">Networking platforms, an award-winning hackathon app, an AI Q&amp;A helper and a student-housing review site. Stacks &amp; source included.</p>
                <span className="cardlink">See what I&apos;ve built <span className="arrow">↗</span></span>
              </Link>
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section id="awards" className="block">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker" data-reveal>02 — Recognition</span>
                <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">Awards &amp; honours</h2>
              </div>
              <p className="lead faint" data-reveal data-reveal-delay="2">A few rooms where the work landed — from serious wins to the gloriously absurd.</p>
            </div>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>FIRST PLACE — CSESOC HACKATHON 2025</span><span className="m-dot">✦</span>
              <span>UNIHACK 2026 — MOST FUN IDEA</span><span className="m-dot">✦</span>
              <span>UNIHACK 2026 — BEST DESIGN</span><span className="m-dot">✦</span>
              <span>UNSW INTERNATIONAL STUDENT AWARD</span><span className="m-dot">✦</span>
              <span>GOLDEN RUBBISH BIN AWARD</span><span className="m-dot">✦</span>
              <span>FIRST PLACE — CSESOC HACKATHON 2025</span><span className="m-dot">✦</span>
              <span>UNIHACK 2026 — MOST FUN IDEA</span><span className="m-dot">✦</span>
              <span>UNIHACK 2026 — BEST DESIGN</span><span className="m-dot">✦</span>
              <span>UNSW INTERNATIONAL STUDENT AWARD</span><span className="m-dot">✦</span>
              <span>GOLDEN RUBBISH BIN AWARD</span><span className="m-dot">✦</span>
            </div>
          </div>
          <div className="wrap">
            <ul className="award-list">
              <li className="award" data-reveal>
                <span className="aw-yr mono">2025</span>
                <div className="aw-main"><h4>First Place</h4><p className="dim">CSESoc Flagship Hackathon · gamified peer-to-peer coding platform</p></div>
                <span className="aw-tag mono">🏆 Winner</span>
              </li>
              <li className="award" data-reveal>
                <span className="aw-yr mono">2026</span>
                <div className="aw-main"><h4>Most Fun Idea &amp; Best Design</h4><p className="dim">UNIHACK 2026 · Peersuade — two category wins</p></div>
                <span className="aw-tag mono">✷ Double</span>
              </li>
              <li className="award" data-reveal>
                <span className="aw-yr mono">2025</span>
                <div className="aw-main"><h4>UNSW International Student Award</h4><p className="dim">Recognition for academic &amp; community contribution</p></div>
                <span className="aw-tag mono">★ Honour</span>
              </li>
              <li className="award" data-reveal>
                <span className="aw-yr mono">2025</span>
                <div className="aw-main"><h4>Golden Rubbish Bin Award</h4><p className="dim">Terrible Ideas Hackathon · Stall Wars · the prize nobody plans for</p></div>
                <span className="aw-tag mono">🗑 Legend</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="block contact">
          <div className="wrap">
            <span className="kicker acid" data-reveal>03 — Contact</span>
            <h2 className="contact-head display" data-reveal data-reveal-delay="1">
              Let&apos;s make<br />the data <span className="outline">talk.</span>
            </h2>
            <p className="lead mt-m" data-reveal data-reveal-delay="2">
              I&apos;m open to <span className="acid-text">Data Analyst</span>,{' '}
              <span className="acid-text">Analytics Engineer</span> &amp; Graduate roles in Sydney —
              and always up for a good problem. Pick a channel.
            </p>
            <div className="contact-grid" data-reveal data-reveal-delay="3">
              <a className="contact-card" href="mailto:melvindarialyogiana@gmail.com" data-copy="melvindarialyogiana@gmail.com">
                <span className="cc-lab mono">Email</span>
                <span className="cc-val" data-copy-label>melvindarialyogiana@gmail.com</span>
                <span className="cc-note mono faint">click to copy</span>
              </a>
              <a className="contact-card" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer">
                <span className="cc-lab mono">GitHub</span>
                <span className="cc-val">@MelvinDY</span>
                <span className="cc-note mono faint">repositories ↗</span>
              </a>
              <a className="contact-card" href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank" rel="noopener noreferrer">
                <span className="cc-lab mono">LinkedIn</span>
                <span className="cc-val">in/melvin-yogiana</span>
                <span className="cc-note mono faint">let&apos;s connect ↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-cta">Melvin<br /><span className="dim">Yogiana</span></div>
              <p className="mono faint" style={{ marginTop: '18px', fontSize: '12px', letterSpacing: '0.05em' }}>
                Data Analyst &amp; Full-Stack Developer<br />UNSW Computer Science · Sydney, AU
              </p>
            </div>
            <div className="foot-col">
              <h4>Navigate</h4>
              <Link href="/projects/data">Data Projects</Link>
              <Link href="/projects/software">Software Projects</Link>
              <Link href="/blog">Blog</Link>
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
