"use client"

import Link from 'next/link'
import { useTeEffects } from './lib/use-te-effects'
import { useHomeGsap } from './lib/use-home-gsap'
import TeHeader from './components/te-header'
import TeHero from './components/te-hero'
import TeCursor from './components/te-cursor'

type InkWord = { t: string; acid?: boolean }

const ABOUT_INK: InkWord[] = [
  { t: 'I’m' }, { t: 'a' }, { t: 'Computer' }, { t: 'Science' }, { t: 'student' },
  { t: 'at' }, { t: 'UNSW' }, { t: 'who' }, { t: 'got' }, { t: 'hooked' }, { t: 'on' },
  { t: 'the' }, { t: 'moment' }, { t: 'a' }, { t: 'chart' }, { t: 'makes' }, { t: 'a' },
  { t: 'room' }, { t: 'go' }, { t: '“oh”', acid: true }, { t: '—' }, { t: 'so' },
  { t: 'I' }, { t: 'wrangle' }, { t: 'data' }, { t: 'into' },
  { t: 'honest', acid: true }, { t: 'insight,', acid: true }, { t: 'and' },
  { t: 'build' }, { t: 'the' }, { t: 'software' }, { t: 'that' }, { t: 'puts' },
  { t: 'it' }, { t: 'in' }, { t: 'front' }, { t: 'of' }, { t: 'people.' },
]

const Ink = ({ words }: { words: InkWord[] }) => (
  <p className="ink" data-ink>
    {words.map((w, i) => (
      <span
        key={i}
        className={`iw${w.acid ? ' iw-acid' : ''}`}
        data-fill={w.acid ? '#ff5e1f' : '#F2EAE0'}
      >
        {w.t}{' '}
      </span>
    ))}
  </p>
)

const SecHead = ({ no, name, meta }: { no: string; name: string; meta: string }) => (
  <div className="sh mono" data-rise>
    <span className="sh-no">[ {no} ]</span>
    <i className="sh-rule" />
    <span className="sh-name">{name}</span>
    <i className="sh-rule sh-rule-s" />
    <span className="sh-meta">{meta}</span>
  </div>
)

export default function HomePage() {
  useTeEffects()
  useHomeGsap()

  return (
    <div className="te-home">
      <TeCursor />
      <TeHeader />

      <main>
        {/* HERO */}
        <TeHero />

        {/* 01 — ABOUT */}
        <section id="about" className="sec">
          <div className="wrap">
            <SecHead no="01" name="about" meta="//decoded" />
            <div className="ab2-grid">
              <h2 className="ab2-head" data-lines aria-label="Half analyst. Half engineer. Fully curious.">
                <span className="lr" aria-hidden="true"><span className="lr-in">Half analyst.</span></span>
                <span className="lr" aria-hidden="true"><span className="lr-in">Half engineer.</span></span>
                <span className="lr" aria-hidden="true"><span className="lr-in ab2-it">Fully curious.</span></span>
              </h2>
              <Ink words={ABOUT_INK} />
            </div>
            <div className="mods" data-rise-group>
              <article className="mod">
                <span className="mod-k">[ /data ]</span>
                <p>SQL, Python (pandas / numpy), dbt and dashboards. I care about the boring parts — clean joins, sane definitions, and a number you can actually defend in a meeting.</p>
              </article>
              <article className="mod">
                <span className="mod-k">[ /software ]</span>
                <p>TypeScript, React, Next.js, Node and Postgres. Five hackathons, a capstone, and a habit of shipping the demo before the deadline panic sets in.</p>
              </article>
              <article className="mod">
                <span className="mod-k">[ /the_goal ]</span>
                <p>A Data Analyst / Analytics Engineer seat in Sydney where I can own a question end-to-end — from the raw extract to the slide that changes a decision.</p>
              </article>
            </div>
            <div className="rdout" data-rise>
              <div className="rd">
                <span className="rd-v"><span data-count="8" data-suf="+">0</span></span>
                <span className="rd-l mono">Projects shipped</span>
              </div>
              <div className="rd">
                <span className="rd-v"><span data-count="4" data-suf="×">0</span></span>
                <span className="rd-l mono">Hackathon awards</span>
              </div>
              <div className="rd">
                <span className="rd-v"><span data-count="1.2" data-suf="M+">0</span></span>
                <span className="rd-l mono">Rows analysed</span>
              </div>
              <div className="rd">
                <span className="rd-v"><span data-count="26" data-pre="’">0</span></span>
                <span className="rd-l mono">Grad year</span>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — WORK: horizontal shelf */}
        <section className="hz" id="work">
          <div className="hz-pin">
            <div className="wrap">
              <SecHead no="02" name="work" meta="//read sideways" />
            </div>
            <div className="hz-track" data-cursor="read →">
              <article className="hz-panel hz-intro">
                <p className="hz-kick">[ the spread ]</p>
                <h3 className="hz-state">Two desks,<br /><em>one brain.</em></h3>
                <p className="hz-note">One desk asks the questions, the other ships the answers. Keep scrolling — the shelf reads sideways.</p>
                <span className="hz-cue mono">scroll on →</span>
              </article>
              <Link className="hz-panel wk-card" href="/projects/data" data-cursor="open ↗">
                <div className="wk-top mono">
                  <span className="acid-text">[ /data ]</span>
                  <span>4 case studies</span>
                </div>
                <h3>Data<br />Projects</h3>
                <p>Dashboards, pricing wars, trending-video forensics and a revenue pipeline — each written as a data story, not a README.</p>
                <span className="cardlink mono">enter the data desk <span className="arrow">↗</span></span>
              </Link>
              <Link className="hz-panel wk-card" href="/projects/software" data-cursor="open ↗">
                <div className="wk-top mono">
                  <span className="acid-text">[ /software ]</span>
                  <span>4 builds</span>
                </div>
                <h3>Software<br />Projects</h3>
                <p>Networking platforms, an award-winning hackathon app, an AI Q&amp;A helper and a student-housing review site. Stacks &amp; source included.</p>
                <span className="cardlink mono">see what i&apos;ve built <span className="arrow">↗</span></span>
              </Link>
              <Link className="hz-panel hz-end" href="/blog" data-cursor="read ↗">
                <p className="hz-kick">[ field notes ]</p>
                <h3 className="hz-state">I also <em>write</em><br />about it.</h3>
                <p className="hz-note">Build logs, data stories and the occasional hackathon post-mortem.</p>
                <span className="cardlink mono">read the blog <span className="arrow">↗</span></span>
              </Link>
            </div>
          </div>
        </section>

        {/* 03 — RECOGNITION */}
        <section id="awards" className="sec">
          <div className="wrap">
            <SecHead no="03" name="recognition" meta="//rooms where it landed" />
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>FIRST PLACE — CSESOC HACKATHON 2025</span><span className="m-dot">✶</span>
              <span>UNIHACK 2026 — MOST FUN IDEA</span><span className="m-dot">✶</span>
              <span>UNIHACK 2026 — BEST DESIGN</span><span className="m-dot">✶</span>
              <span>UNSW INTERNATIONAL STUDENT AWARD</span><span className="m-dot">✶</span>
              <span>GOLDEN RUBBISH BIN AWARD</span><span className="m-dot">✶</span>
              <span>FIRST PLACE — CSESOC HACKATHON 2025</span><span className="m-dot">✶</span>
              <span>UNIHACK 2026 — MOST FUN IDEA</span><span className="m-dot">✶</span>
              <span>UNIHACK 2026 — BEST DESIGN</span><span className="m-dot">✶</span>
              <span>UNSW INTERNATIONAL STUDENT AWARD</span><span className="m-dot">✶</span>
              <span>GOLDEN RUBBISH BIN AWARD</span><span className="m-dot">✶</span>
            </div>
          </div>
          <div className="wrap">
            <ul className="aw-list" data-rise-group>
              <li className="aw-row">
                <span className="aw-yr2 mono">[ 2025 ]</span>
                <div className="aw-t"><h4>First Place</h4><p>CSESoc Flagship Hackathon · gamified peer-to-peer coding platform</p></div>
                <span className="aw-tag2 mono">🏆 winner</span>
              </li>
              <li className="aw-row">
                <span className="aw-yr2 mono">[ 2026 ]</span>
                <div className="aw-t"><h4>Most Fun Idea &amp; Best Design</h4><p>UNIHACK 2026 · Peersuade — two category wins</p></div>
                <span className="aw-tag2 mono">✶ double</span>
              </li>
              <li className="aw-row">
                <span className="aw-yr2 mono">[ 2025 ]</span>
                <div className="aw-t"><h4>UNSW International Student Award</h4><p>Recognition for academic &amp; community contribution</p></div>
                <span className="aw-tag2 mono">★ honour</span>
              </li>
              <li className="aw-row">
                <span className="aw-yr2 mono">[ 2025 ]</span>
                <div className="aw-t"><h4>Golden Rubbish Bin Award — Most Absurd Idea with Best Execution</h4><p>Terrible Ideas Hackathon · Stall Wars · the prize nobody plans for</p></div>
                <span className="aw-tag2 mono">🗑 legend</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 04 — CONTACT */}
        <section id="contact" className="sec">
          <div className="wrap">
            <SecHead no="04" name="contact" meta="//channel open" />
            <h2 className="ct-head" data-lines aria-label="Let's make the data talk.">
              <span className="lr" aria-hidden="true"><span className="lr-in">Let&apos;s make</span></span>
              <span className="lr" aria-hidden="true"><span className="lr-in">the data <em className="ct-talk">talk.</em></span></span>
            </h2>
            <p className="lead ct-lead" data-rise>
              Open to <span className="acid-text">Data Analyst</span>,{' '}
              <span className="acid-text">Analytics Engineer</span> &amp; graduate roles in
              Sydney — and always up for a good problem. Pick a channel.
            </p>
            <div className="ct-grid" data-rise-group>
              <a className="ct-card" href="mailto:melvindarialyogiana@gmail.com" data-copy="melvindarialyogiana@gmail.com" data-cursor="copy">
                <span className="ct-lab">[ email ]</span>
                <span className="ct-val" data-copy-label>melvindarialyogiana@gmail.com</span>
                <span className="ct-note mono">click to copy</span>
              </a>
              <a className="ct-card" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-cursor="open ↗">
                <span className="ct-lab">[ github ]</span>
                <span className="ct-val">@MelvinDY</span>
                <span className="ct-note mono">repositories ↗</span>
              </a>
              <a className="ct-card" href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank" rel="noopener noreferrer" data-cursor="open ↗">
                <span className="ct-lab">[ linkedin ]</span>
                <span className="ct-val">in/melvin-yogiana</span>
                <span className="ct-note mono">let&apos;s connect ↗</span>
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
