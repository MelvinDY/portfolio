"use client"

import Link from 'next/link'
import TeHeader from '../../../components/te-header'
import { useTeEffects } from '../../../lib/use-te-effects'

export default function YouTubePage() {
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
              <span className="now">youtube trending</span>
            </div>
            <div className="case-domain" data-reveal data-reveal-delay="1">Data Story <span className="faint">— 02</span></div>
            <h1 className="case-hook" data-reveal data-reveal-delay="1">
              Going viral has a shelf life. It&apos;s about <span className="hl">38 hours</span>.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              I scraped 40,000 trending videos across ten regions to answer one nagging question: what actually earns a spot on the Trending page — and how fast does the magic wear off?
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">Python · pandas · sklearn</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">YouTube Data API</div></div>
              <div className="cm"><div className="l">Sample</div><div className="v">40k videos · 10 regions</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">&ldquo;Trending&rdquo; feels permanent when you&apos;re scrolling it. It isn&apos;t. The board churns constantly, and most creators have no idea how short their window really is.</p>
            <p>I wanted to treat the Trending page like a dataset instead of a vibe — pull every video on it, every day, across regions, and watch how positions appear, climb and evaporate. With enough snapshots, the lifecycle of a viral video stops being mysterious and starts being a <em>curve</em> you can plot.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>I hit the <strong>YouTube Data API</strong> on a schedule, capturing the full Trending list for ten regions every few hours over several weeks. Each snapshot recorded position, views, likes, comments, category, channel size and publish time.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="40" data-suf="k">0</span></div><div className="cap">Trending video snapshots collected across regions.</div></div>
              <div className="sc"><div className="big"><span data-count="38" data-suf="h">0</span></div><div className="cap">Median time a video survives on the board.</div></div>
              <div className="sc"><div className="big"><span data-count="23" data-pre="+" data-suf="%">0</span></div><div className="cap">Longer life when the title contains a number.</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>I de-duplicated videos across snapshots into a single lifecycle per video, then engineered features — title length, presence of numbers and emoji, thumbnail face detection, publish hour, category and channel size. A <strong>gradient-boosted model</strong> did the heavy lifting on &ldquo;what predicts longevity,&rdquo; with the raw curves kept close by as a sanity check.</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: the lifecycle is front-loaded and brutal. Velocity in the first two hours decides almost everything.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">View velocity over a video&apos;s life on Trending</div>
                <div className="fig-unit">relative · hours since posting</div>
              </div>
              <div className="linewrap">
                <svg className="linechart" viewBox="0 0 720 290" preserveAspectRatio="none" role="img" aria-label="View velocity decay curve">
                  <defs>
                    <linearGradient id="yt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff5e1f" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#ff5e1f" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line className="grid" x1="60" y1="55" x2="700" y2="55" /><line className="grid" x1="60" y1="130" x2="700" y2="130" /><line className="grid" x1="60" y1="205" x2="700" y2="205" />
                  <path className="larea" d="M60,228 L137,120 L215,55 L292,82 L370,120 L447,162 L525,196 L602,224 L680,244 L680,260 L60,260 Z" fill="url(#yt)" />
                  <path className="lpath a" d="M60,228 L137,120 L215,55 L292,82 L370,120 L447,162 L525,196 L602,224 L680,244" />
                  <text className="axis-l" x="52" y="59" textAnchor="end">peak</text>
                  <text className="axis-l" x="60" y="282">0h</text><text className="axis-l" x="350" y="282">24h</text><text className="axis-l" x="660" y="282">48h</text>
                </svg>
              </div>
              <div className="fig-cap"><b>Read:</b> velocity spikes within hours, then decays steadily. By <b>~38 hours</b> the typical video has slipped off the board entirely.</div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The thumbnail and first two hours matter more than the channel&apos;s entire subscriber count.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: clout is overrated. The signals creators obsess over barely move the needle.</p>
            <p>When I ranked features by how much they predicted <em>longevity</em>, early velocity and a few cheap title-and-thumbnail tricks dominated. Subscriber count — the thing everyone chases — landed near the bottom.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">What predicts how long a video trends</div>
                <div className="fig-unit">relative feature importance</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">First-2h velocity</span><span className="btrack"><span className="bfill" data-bar="95" /></span><span className="bval acid">0.31</span></div>
                <div className="brow"><span className="blab">Number in title</span><span className="btrack"><span className="bfill" data-bar="72" /></span><span className="bval">0.24</span></div>
                <div className="brow"><span className="blab">Face in thumbnail</span><span className="btrack"><span className="bfill" data-bar="64" /></span><span className="bval">0.21</span></div>
                <div className="brow"><span className="blab">Category</span><span className="btrack"><span className="bfill" data-bar="52" /></span><span className="bval">0.17</span></div>
                <div className="brow"><span className="blab">Publish 2–4pm</span><span className="btrack"><span className="bfill" data-bar="40" /></span><span className="bval">0.13</span></div>
                <div className="brow"><span className="blab">Subscriber count</span><span className="btrack"><span className="bfill dim" data-bar="20" /></span><span className="bval">0.06</span></div>
                <div className="brow"><span className="blab">Video length</span><span className="btrack"><span className="bfill dim" data-bar="10" /></span><span className="bval">0.03</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> momentum and packaging beat reach. A small channel with the right first hour outruns a big one without it.</div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Run sentiment on titles and thumbnails to test whether curiosity gaps really do outperform plain description.</span></li>
              <li><span className="ni">02</span><span>Compare lifecycle curves across regions — does a video trend longer in some countries than others?</span></li>
              <li><span className="ni">03</span><span>Ship a tiny &ldquo;trending odds&rdquo; tool that scores a draft title and thumbnail before you hit publish.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; notebook <span className="arrow">↗</span>
              </a>
              <a className="btn" href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer">
                YouTube Data API <span className="arrow">↗</span>
              </a>
            </div>
          </section>
        </article>

        <nav className="case-next">
          <Link href="/projects/data/grocery">
            <div className="wrap inner">
              <div>
                <div className="nx-lab">Next data story — 03</div>
                <div className="nx-title">Woolworths vs Coles Price Analytics</div>
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
