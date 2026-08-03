"use client"

import Link from 'next/link'
import TeHeader from '../../components/te-header'
import ProjectShelf from '../../components/project-shelf'
import { dataProjects, softwareProjects } from '../../data/project-index'
import { useTeEffects } from '../../lib/use-te-effects'

export default function AllProjectsPage() {
  useTeEffects()

  const total = dataProjects.length + softwareProjects.length

  return (
    <div className="te-home">
      <TeHeader activePage="all" />

      <main>
        <section className="subhero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span><span className="now">all projects</span>
            </div>
            <h1 className="display" data-reveal data-reveal-delay="1">
              All<br /><span className="outline">Projects</span>
            </h1>
            <div className="subhero-foot">
              <p className="lead" data-reveal data-reveal-delay="2">
                Every analysis and every build in one list — the four featured in each
                discipline plus everything that never got a card. Orange numbers are the{' '}
                <span className="acid-text">featured</span> work; each row says where it
                sends you.
              </p>
              <div className="subhero-meta" data-reveal data-reveal-delay="2">
                <div className="sm"><div className="v" data-count={total}>{total}</div><div className="l">Projects</div></div>
                <div className="sm"><div className="v" data-count="8">0</div><div className="l">Featured</div></div>
              </div>
            </div>
          </div>
        </section>

        <ProjectShelf
          kicker="Data"
          title="Analyses"
          note="Each of these is written up as a case study — the finding first, the working underneath."
          items={dataProjects}
        />

        <ProjectShelf
          kicker="Software"
          title="Builds"
          note="Shipped things. Four have a full card on the Software page; the rest go straight to the source."
          items={softwareProjects}
        />

        <section className="block tight">
          <div className="wrap center">
            <p className="kicker acid" data-reveal style={{ justifyContent: 'center' }}>The long version</p>
            <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">Want the case studies?</h2>
            <div className="mt-l allp-cta" data-reveal data-reveal-delay="2">
              <Link className="btn primary" href="/projects/data" data-magnetic>
                Data Projects <span className="arrow">↗</span>
              </Link>
              <Link className="btn" href="/projects/software" data-magnetic>
                Software Projects <span className="arrow">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-cta">Let&apos;s<br /><span className="dim">work.</span></div>
              <p className="mono faint" style={{ marginTop: '18px', fontSize: '12px', letterSpacing: '0.05em' }}>
                Open to Data Analyst, Analytics Engineer &amp; Software roles · Sydney, AU
              </p>
            </div>
            <div className="foot-col">
              <h4>Navigate</h4>
              <Link href="/">Home</Link>
              <Link href="/projects/data">Data Projects</Link>
              <Link href="/projects/software">Software Projects</Link>
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
