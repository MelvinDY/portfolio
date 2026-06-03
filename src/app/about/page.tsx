"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import TeHeader from '../components/te-header'
import { useTeEffects } from '../lib/use-te-effects'

export default function AboutPage() {
  useTeEffects()
  const [tab, setTab] = useState<'work' | 'edu'>('work')

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

        {/* JOURNEY */}
        <section className="ab-sect">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker" data-reveal>03 — The path so far</span>
                <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">Experience &amp; education</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }} data-reveal data-reveal-delay="2">
                <button className={`tagbtn${tab === 'work' ? ' on' : ''}`} onClick={() => setTab('work')}>Work</button>
                <button className={`tagbtn${tab === 'edu' ? ' on' : ''}`} onClick={() => setTab('edu')}>Education</button>
              </div>
            </div>

            {tab === 'work' && (
              <div className="timeline">
                <div className="tl-item">
                  <div className="tl-year">2026</div>
                  <div className="tl-body">
                    <h4>Foresight Analytics — Data Analyst &amp; Automation Engineer Intern</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>May 2026 – Present · Sydney, AU</p>
                    <p>Building automation workflows with <strong>n8n</strong> to streamline internal data operations for a boutique investment intelligence firm serving 50+ Australian asset managers.</p>
                    <p>Supporting data analytics pipelines using Excel, Azure SQL, and Databricks — working across investment diligence, ratings research, and ESG datasets.</p>
                    <p>Conducting market and product research to inform analytical frameworks and data strategy within a DataOps-driven environment.</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                      {['n8n', 'Azure SQL', 'Databricks', 'Excel', 'Research', 'DataOps'].map(s => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-year">2025</div>
                  <div className="tl-body">
                    <h4>UNSW × Atlassian — Software Developer</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>Sep 2025 – Dec 2025 · Sydney, AU</p>
                    <p>Led development of enterprise Q&amp;A system as top contributor (121 commits), delivering a secure real-time audience interaction platform for Atlassian town halls.</p>
                    <p>Designed and implemented 3-layer end-to-end testing infrastructure (API, integration, UI) with automated CI pipeline.</p>
                    <p>Built backend services with SQL schema design, implementing structured data validation and access controls across resolvers and API endpoints.</p>
                    <p>Developed moderator dashboard with role-based permissions, audit trail tracking, and session facilitation controls.</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                      {['TypeScript', 'React', 'GraphQL', 'SQL', 'CI/CD', 'Testing'].map(s => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-year">2025</div>
                  <div className="tl-body">
                    <h4>PPIA UNSW — Frontend Lead</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>Aug 2025 – Nov 2025 · Sydney, AU</p>
                    <p>Led a 10-person cross-functional team with structured Agile governance, daily standups, sprint reviews, and documented workflows.</p>
                    <p>Drove stakeholder alignment through bi-weekly demos with PPIA board, translating feedback into 15+ feature enhancements.</p>
                    <p>Mentored 4 junior developers on code review, Git workflows, and development standards.</p>
                    <p>Architected a component-based frontend enabling parallel development by 3 sub-teams without integration conflicts.</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                      {['React', 'Next.js', 'Agile', 'Team Leadership', 'Code Review'].map(s => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'edu' && (
              <div className="timeline">
                <div className="tl-item">
                  <div className="tl-year">2026</div>
                  <div className="tl-body">
                    <h4>Self-directed — Data &amp; Cloud Engineering</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>2026 – Present · DataCamp · Microsoft · Databricks</p>
                    <p>Deepening expertise in data analytics, analytics engineering, and data engineering through structured coursework on DataCamp.</p>
                    <p>Actively preparing for <strong>Microsoft Azure</strong> and <strong>Databricks</strong> certifications to formalise cloud and lakehouse skills used on the job.</p>
                    <span className="tl-tag">📚 In progress</span>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-year">2023</div>
                  <div className="tl-body">
                    <h4>University of New South Wales (UNSW)</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>Bachelor of Science — Computer Science · GPA 3.00 / 4.00 · 2023 – 2025</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '4px 0 14px' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px', marginBottom: '3px' }}>🥇 First Place — CSESoc Flagship Hackathon 2025</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>OnlyCode · gamified peer-to-peer coding platform with real-time collaboration and skill-based matchmaking</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px', marginBottom: '3px' }}>🏆 UNIHACK 2026 — Most Fun Idea &amp; Best Design</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>Peersuade · real-time persuasion game · two category wins</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px', marginBottom: '3px' }}>🗑 Terrible Ideas Hackathon — Most Absurd Idea with Best Execution</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>Stall Wars · chaotic toilet-themed two-player arcade game · 48 hours</div>
                      </div>
                    </div>
                    <span className="tl-tag">🎓 Graduated Dec 2025</span>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-year">2022</div>
                  <div className="tl-body">
                    <h4>UNSW College</h4>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '12px' }}>Diploma in Computer Science · 2022 – 2023 · Sydney, AU</p>
                    <p>★ UNSW International Student Award — recognised for academic work and contribution to the UNSW community as an international student.</p>
                    <span className="tl-tag">✓ Completed</span>
                  </div>
                </div>
              </div>
            )}
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
