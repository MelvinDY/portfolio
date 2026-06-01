"use client"

import Link from 'next/link'
import TeHeader from '../../../components/te-header'
import { useTeEffects } from '../../../lib/use-te-effects'

export default function LabourMarketPage() {
  useTeEffects()

  return (
    <div className="te-home">
      <TeHeader activePage="data" />

      <main className="case-main">
        <section className="case-hero">
          <div className="wrap">
            <div className="case-crumb" data-reveal>
              <Link href="/">home</Link><span>/</span>
              <Link href="/projects/data">data projects</Link><span>/</span>
              <span className="now">labour market</span>
            </div>
            <div className="case-domain" data-reveal data-reveal-delay="1">Data Story <span className="faint">— 01</span></div>
            <h1 className="case-hook" data-reveal data-reveal-delay="1">
              Health care — not mining — is quietly <span className="hl">carrying</span> Australian jobs.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              Over three years, one industry added more roles than Mining, Retail and Construction combined. I built a dashboard to find out where the country&apos;s 14.2 million jobs actually live.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">SQL · Tableau · Python</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">ABS Labour Force</div></div>
              <div className="cm"><div className="l">Window</div><div className="v">2019 – 2024</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">Every politician has a line about jobs. I wanted the number behind the line — not the headline rate, but the <em>shape</em> of who is working, in what, and how that&apos;s shifted since 2019.</p>
            <p>So I pulled the full ABS Labour Force series and rebuilt it as an interactive dashboard: employment, participation and wage growth across all <strong>19 industry divisions</strong>, sliceable by year. The point was never a single statistic. It was to make the composition of the workforce something you could <em>see</em> change.</p>
            <p>The first thing that fell out of it surprised me — and it&apos;s the reason this page leads with health care instead of the usual mining-and-resources story.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>Everything here comes from the <a className="inl" href="https://www.abs.gov.au/statistics/labour" target="_blank" rel="noopener noreferrer">Australian Bureau of Statistics</a> Labour Force survey — the same source the RBA and Treasury quote. It&apos;s clean, but it&apos;s spread across dozens of quarterly releases in awkward spreadsheet shapes.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="14.2" data-suf="M">0</span></div><div className="cap">Employed persons, late 2024 — a record high.</div></div>
              <div className="sc"><div className="big"><span data-count="19">0</span></div><div className="cap">ABS industry divisions reconciled into one model.</div></div>
              <div className="sc"><div className="big"><span data-count="66.9" data-suf="%">0</span></div><div className="cap">Participation rate — also near record territory.</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p>I staged the raw releases, normalised the industry codes (the ABS quietly renames divisions every few years), and modelled them into a tidy time series — one row per industry, per quarter. Boring work. It&apos;s also the work that makes every chart after this trustworthy.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>The pipeline is deliberately dull: <strong>Python</strong> to scrape and reshape the spreadsheets, <strong>SQL</strong> for the joins and the year-on-year deltas, and <strong>Tableau</strong> on top for the interactive layer. Every number on the dashboard traces back to a single source row — no hand-typed figures.</p>
            <p>With the series clean, the analysis was simple subtraction: where were the jobs in 2019, where are they now, and which industries moved the most in absolute and percentage terms?</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: the growth is lopsided. Health care isn&apos;t edging ahead — it&apos;s in a different race.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Employment growth by industry, 2019 – 2024</div>
                <div className="fig-unit">% change in roles</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Health &amp; Social</span><span className="btrack"><span className="bfill" data-bar="95" /></span><span className="bval acid">+19%</span></div>
                <div className="brow"><span className="blab">Prof. Services</span><span className="btrack"><span className="bfill" data-bar="60" /></span><span className="bval">+12%</span></div>
                <div className="brow"><span className="blab">Public Admin</span><span className="btrack"><span className="bfill" data-bar="50" /></span><span className="bval">+10%</span></div>
                <div className="brow"><span className="blab">Education</span><span className="btrack"><span className="bfill" data-bar="45" /></span><span className="bval">+9%</span></div>
                <div className="brow"><span className="blab">Construction</span><span className="btrack"><span className="bfill" data-bar="30" /></span><span className="bval">+6%</span></div>
                <div className="brow"><span className="blab">Retail Trade</span><span className="btrack"><span className="bfill dim" data-bar="20" /></span><span className="bval">+4%</span></div>
                <div className="brow"><span className="blab">Mining</span><span className="btrack"><span className="bfill dim" data-bar="15" /></span><span className="bval">+3%</span></div>
                <div className="brow"><span className="blab">Manufacturing</span><span className="btrack"><span className="bfill dim" data-bar="6" /></span><span className="bval">+1%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> Health Care &amp; Social Assistance grew nearly 5× faster than Mining — and now employs roughly <b>1 in 7</b> working Australians.</div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The resources story dominates headlines. The hiring story is happening in hospitals, clinics and aged care.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: COVID was a dent, not a turning point.</p>
            <p>Total employment took a sharp hit in 2020, then snapped back above trend within eighteen months. The long arc didn&apos;t bend — it just paused. What changed wasn&apos;t the <em>total</em>; it was the <em>mix</em>.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Total employed persons</div>
                <div className="fig-unit">millions · 2019–2024</div>
              </div>
              <div className="linewrap">
                <svg className="linechart" viewBox="0 0 720 290" preserveAspectRatio="none" role="img" aria-label="Total employed persons over time">
                  <defs>
                    <linearGradient id="la" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ccff4d" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#ccff4d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line className="grid" x1="60" y1="40" x2="700" y2="40" /><line className="grid" x1="60" y1="115" x2="700" y2="115" /><line className="grid" x1="60" y1="190" x2="700" y2="190" /><line className="grid" x1="60" y1="260" x2="700" y2="260" />
                  <path className="larea" d="M60,184 L184,239 L308,173 L432,117 L556,73 L680,51 L680,260 L60,260 Z" fill="url(#la)" />
                  <path className="lpath a" d="M60,184 L184,239 L308,173 L432,117 L556,73 L680,51" />
                  <text className="axis-l" x="52" y="44" textAnchor="end">14.3</text>
                  <text className="axis-l" x="52" y="264" textAnchor="end">12.4</text>
                  <text className="axis-l" x="60" y="282">2019</text><text className="axis-l" x="300" y="282">2021</text><text className="axis-l" x="660" y="282">2024</text>
                </svg>
              </div>
              <div className="fig-cap"><b>Read:</b> the 2020 dip is unmistakable — and so is how completely it recovered. Net gain over the window: roughly <b>1.2M</b> jobs.</div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Layer in wage growth by industry — job growth is only half the story if pay isn&apos;t keeping pace with it.</span></li>
              <li><span className="ni">02</span><span>Add a regional cut. Sydney and Melbourne skew the national picture; the states tell very different stories.</span></li>
              <li><span className="ni">03</span><span>Automate the ABS extract so the dashboard refreshes itself each quarter instead of on my command.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; notebook <span className="arrow">↗</span>
              </a>
              <a className="btn" href="https://www.abs.gov.au/statistics/labour" target="_blank" rel="noopener noreferrer">
                ABS data source <span className="arrow">↗</span>
              </a>
            </div>
          </section>
        </article>

        <nav className="case-next">
          <Link href="/projects/data/youtube">
            <div className="wrap inner">
              <div>
                <div className="nx-lab">Next data story — 02</div>
                <div className="nx-title">YouTube Trending Analytics</div>
              </div>
              <span className="nx-arrow">→</span>
            </div>
          </Link>
        </nav>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-bottom" style={{ border: 0, margin: 0, padding: 0 }}>
            <span>© 2026 Melvin Darial Yogiana</span>
            <span><Link href="/projects/data" style={{ color: 'var(--ink-dim)' }}>← All data projects</Link></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
