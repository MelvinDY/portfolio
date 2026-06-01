"use client"

import Link from 'next/link'
import Image from 'next/image'
import TeHeader from '../components/te-header'
import { useTeEffects } from '../lib/use-te-effects'

export default function AboutPage() {
  useTeEffects()

  return (
    <div className="te-home">
      <TeHeader activePage="about" />

      <main>
        <section className="ab-hero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span><span className="now">about</span>
            </div>
            <div className="ab-grid">
              <div>
                <span className="kicker acid" data-reveal>The person behind the charts</span>
                <h1 className="ab-hook" data-reveal data-reveal-delay="1">
                  Hi, I&apos;m Melvin. I make data <span className="hl">make sense</span>.
                </h1>
                <p className="ab-intro" data-reveal data-reveal-delay="2">
                  An Indonesian Computer Science student at UNSW, building in Sydney — equal parts analyst and engineer, and fully addicted to the moment a messy spreadsheet finally tells you something true.
                </p>
                <div className="ab-socials" data-reveal data-reveal-delay="3">
                  <a className="btn" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>GitHub <span className="arrow">↗</span></a>
                  <a className="btn" href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank" rel="noopener noreferrer" data-magnetic>LinkedIn <span className="arrow">↗</span></a>
                  <a className="btn" href="mailto:melvindarialyogiana@gmail.com" data-magnetic>Email <span className="arrow">↗</span></a>
                </div>
              </div>
              <div className="photo-frame" data-reveal data-reveal-delay="2">
                <Image src="/melvin.jpg" alt="Melvin Yogiana" fill style={{ objectFit: 'cover' }} />
                <span className="photo-tag">Sydney, AU · 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="ab-sect">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker" data-reveal>01 — My story</span>
            </div>
            <div className="lead-prose">
              <div data-reveal>
                <p>I came to Sydney to study Computer Science at UNSW, and somewhere between a database lecture and my third hackathon I realised I&apos;d fallen for two things at once: <strong>finding the story hiding in data</strong>, and <strong>building the thing that puts that story in front of people</strong>.</p>
                <p>Most developers pick a lane. I genuinely couldn&apos;t. So I lean into both — I&apos;ll spend a weekend untangling ABS labour statistics or scraping supermarket prices, then turn around and ship a full-stack app with a team under deadline. The two halves feed each other: the analyst makes my software honest, and the engineer makes my analysis usable.</p>
                <p>Along the way I&apos;ve been lucky enough to win a few rooms — a hackathon first place, two UNIHACK 2026 categories, and one gloriously cursed <em>Golden Rubbish Bin</em>. I also help run tech for <strong>PPIA UNSW</strong>, the Indonesian student community here, because building things that bring people together is the whole reason I started.</p>
                <p>When I&apos;m not coding you&apos;ll find me hunting Sydney&apos;s coffee scene, planning the next trip, or quietly turning caffeine into commits. ☕</p>
              </div>
            </div>
          </div>
        </section>

        {/* FACTS */}
        <section className="ab-sect">
          <div className="wrap">
            <span className="kicker" data-reveal>02 — At a glance</span>
            <div className="facts mt-m" data-reveal data-reveal-delay="1">
              <div className="f"><div className="fv">UNSW</div><div className="fl">Computer Science</div></div>
              <div className="f"><div className="fv">2026</div><div className="fl">Graduating</div></div>
              <div className="f"><div className="fv">Sydney</div><div className="fl">Based in AU</div></div>
              <div className="f"><div className="fv">4×</div><div className="fl">Award wins</div></div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="ab-sect">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
              <div>
                <span className="kicker" data-reveal>03 — The path so far</span>
                <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">A short timeline</h2>
              </div>
            </div>
            <div className="timeline">
              <div className="tl-item" data-reveal>
                <div className="tl-year">2026</div>
                <div className="tl-body">
                  <h4>UNIHACK 2026 — Most Fun Idea &amp; Best Design</h4>
                  <p>Took home two categories for <strong>Peersuade</strong>, a real-time persuasion game. Judged on exactly the two things I care about most: fun and craft.</p>
                  <span className="tl-tag">🏆 Double win</span>
                </div>
              </div>
              <div className="tl-item" data-reveal>
                <div className="tl-year">2025</div>
                <div className="tl-body">
                  <h4>First Place — CSESoc Flagship Hackathon</h4>
                  <p>Won first place building <strong>OnlyCode</strong>, a gamified peer-to-peer coding platform with real-time collaboration and skill-based matchmaking.</p>
                  <span className="tl-tag">🥇 Winner</span>
                </div>
              </div>
              <div className="tl-item" data-reveal>
                <div className="tl-year">2025</div>
                <div className="tl-body">
                  <h4>PPIA UNSW — Built &amp; shipped Ignite</h4>
                  <p>Helped build the official platform for the Indonesian student community with a team of ten, on a modular architecture meant to outlive us.</p>
                  <span className="tl-tag">👥 Team of 10</span>
                </div>
              </div>
              <div className="tl-item" data-reveal>
                <div className="tl-year">2025</div>
                <div className="tl-body">
                  <h4>UNSW International Student Award</h4>
                  <p>Recognised for academic work and contribution to the UNSW community as an international student.</p>
                  <span className="tl-tag">★ Honour</span>
                </div>
              </div>
              <div className="tl-item" data-reveal>
                <div className="tl-year">2024</div>
                <div className="tl-body">
                  <h4>Golden Rubbish Bin Award — Terrible Ideas Hackathon</h4>
                  <p>Built <strong>Stall Wars</strong>, a chaotic toilet-themed two-player arcade game, in 48 hours. Won the prize nobody plans for and everybody remembers.</p>
                  <span className="tl-tag">🗑 Legend</span>
                </div>
              </div>
              <div className="tl-item" data-reveal>
                <div className="tl-year">2023</div>
                <div className="tl-body">
                  <h4>Started at UNSW — Computer Science</h4>
                  <p>Moved to Sydney and began the degree that turned a curiosity about code into a habit of shipping.</p>
                  <span className="tl-tag">🎓 Began</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLBOX */}
        <section className="ab-sect">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
              <div>
                <span className="kicker" data-reveal>04 — The toolbox</span>
                <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">What I build with</h2>
              </div>
            </div>
            <div className="toolbox">
              <div className="tool-col" data-reveal>
                <div className="tc-head"><h4>Data &amp; Analytics</h4><span className="tc-i">/ analyse</span></div>
                <div className="chips">
                  <span className="chip">SQL</span><span className="chip">Python</span><span className="chip">pandas</span><span className="chip">NumPy</span><span className="chip">dbt</span><span className="chip">Snowflake</span><span className="chip">PostgreSQL</span><span className="chip">Tableau</span><span className="chip">Looker</span><span className="chip">scikit-learn</span>
                </div>
              </div>
              <div className="tool-col" data-reveal data-reveal-delay="1">
                <div className="tc-head"><h4>Software &amp; Web</h4><span className="tc-i">/ build</span></div>
                <div className="chips">
                  <span className="chip">TypeScript</span><span className="chip">React</span><span className="chip">Next.js</span><span className="chip">Node.js</span><span className="chip">Express</span><span className="chip">Supabase</span><span className="chip">PostgreSQL</span><span className="chip">Tailwind</span><span className="chip">WebSocket</span><span className="chip">Git</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="ab-sect">
          <div className="wrap center">
            <span className="kicker acid" data-reveal style={{ justifyContent: 'center' }}>Still reading?</span>
            <h2 className="section-title mt-s" data-reveal data-reveal-delay="1" style={{ textAlign: 'center' }}>Let&apos;s build something together.</h2>
            <div className="mt-l" data-reveal data-reveal-delay="2" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn primary" href="/#contact" data-magnetic>Get in touch <span className="arrow">↗</span></Link>
              <Link className="btn" href="/blog" data-magnetic>Read the blog <span className="arrow">↗</span></Link>
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
              <Link href="/#awards">Awards</Link>
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
