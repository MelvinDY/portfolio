"use client"

import Link from 'next/link'
import TeHeader from '../../../components/te-header'
import { useTeEffects } from '../../../lib/use-te-effects'

export default function GroceryPage() {
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
              <span className="now">supermarket pricing</span>
            </div>
            <div className="case-domain" data-reveal data-reveal-delay="1">Data Story <span className="faint">— 03</span></div>
            <h1 className="case-hook" data-reveal data-reveal-delay="1">
              Neither supermarket is cheaper. The <span className="hl">specials</span> are.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              I scraped 1,000 staple products from Woolworths and Coles every day for six months. The &ldquo;cheaper&rdquo; store flips almost weekly — and chasing the wrong one quietly costs a household real money.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">Python · Postgres · dbt</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">Daily price scrape</div></div>
              <div className="cm"><div className="l">Window</div><div className="v">6 months · 1,000 SKUs</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">&ldquo;Woolies is cheaper.&rdquo; &ldquo;No, Coles is.&rdquo; Everyone has a confident answer and none of them have the receipts. I wanted the receipts.</p>
            <p>So I built a scraper that priced the same basket of 1,000 staples at both chains, every single day, for six months. The goal: stop arguing from vibes and actually watch how the two giants price against each other over time.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>Roughly <strong>2,000 price points a day</strong> — every product at both stores — landing in <strong>PostgreSQL</strong>, cleaned and modelled with <strong>dbt</strong> into a tidy daily basket. Matching products across two different catalogues was the hard part; pack sizes and naming never line up.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="1240" data-pre="$">0</span></div><div className="cap">Annual gap between best- and worst-case basket choices.</div></div>
              <div className="sc"><div className="big"><span data-count="41" data-suf="%">0</span></div><div className="cap">Of weeks, the cheaper store flipped from the week before.</div></div>
              <div className="sc"><div className="big"><span data-count="1000">0</span></div><div className="cap">Staple products tracked daily across both chains.</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>Once the baskets were comparable, the analysis wrote itself: plot both stores&apos; basket cost over time, count who won each week, and break the gap down by category to find where the real differences hide. Spoiler — it&apos;s not where loyalty cards point you.</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: the lines cross constantly. There is no permanently cheaper store — only a cheaper week.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Weekly basket cost — same 1,000 staples</div>
                <div className="fig-unit">AUD · 6 months</div>
              </div>
              <div className="linewrap">
                <svg className="linechart" viewBox="0 0 720 290" preserveAspectRatio="none" role="img" aria-label="Woolworths vs Coles basket cost">
                  <line className="grid" x1="60" y1="60" x2="700" y2="60" /><line className="grid" x1="60" y1="130" x2="700" y2="130" /><line className="grid" x1="60" y1="200" x2="700" y2="200" />
                  <path className="lpath a" d="M60,133 L129,200 L198,117 L267,217 L336,150 L404,250 L473,133 L542,200 L611,150 L680,233" />
                  <path className="lpath b" d="M60,183 L129,150 L198,200 L267,167 L336,233 L404,133 L473,217 L542,167 L611,200 L680,150" />
                  <text className="axis-l" x="52" y="64" textAnchor="end">$150</text>
                  <text className="axis-l" x="52" y="254" textAnchor="end">$138</text>
                  <text className="axis-l" x="60" y="282">wk 1</text><text className="axis-l" x="640" y="282">wk 26</text>
                </svg>
              </div>
              <div className="legend">
                <span className="lg"><i style={{ background: 'var(--acid)' }} />Woolworths</span>
                <span className="lg"><i style={{ background: '#6fe7ff' }} />Coles</span>
              </div>
              <div className="fig-cap"><b>Read:</b> the basket cost is near-identical on average — the two lines trade the lead almost every fortnight.</div>
            </div>
          </div>

          <div className="figure" data-reveal>
            <div className="compare">
              <div className="cc win"><div className="ct">Avg basket · Woolworths</div><div className="cv">$142.10</div></div>
              <div className="cc"><div className="ct">Avg basket · Coles</div><div className="cv">$142.80</div></div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;Loyalty to one chain is the most expensive habit in the trolley. The savings live in the specials, not the sign.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: the discounts aren&apos;t spread evenly. Pantry and snacks swing hard; fresh food barely moves.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Average discount depth when on special, by category</div>
                <div className="fig-unit">% off shelf price</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Pantry &amp; dry</span><span className="btrack"><span className="bfill" data-bar="90" /></span><span className="bval acid">32%</span></div>
                <div className="brow"><span className="blab">Snacks</span><span className="btrack"><span className="bfill" data-bar="78" /></span><span className="bval">28%</span></div>
                <div className="brow"><span className="blab">Frozen</span><span className="btrack"><span className="bfill" data-bar="70" /></span><span className="bval">25%</span></div>
                <div className="brow"><span className="blab">Household</span><span className="btrack"><span className="bfill" data-bar="61" /></span><span className="bval">22%</span></div>
                <div className="brow"><span className="blab">Fresh produce</span><span className="btrack"><span className="bfill dim" data-bar="39" /></span><span className="bval">14%</span></div>
                <div className="brow"><span className="blab">Meat</span><span className="btrack"><span className="bfill dim" data-bar="30" /></span><span className="bval">11%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> stock up on pantry and snacks when they dip — that&apos;s where the real discounting happens. Fresh food rarely rewards waiting.</div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Add Aldi to the comparison — the wildcard that could break the two-horse race entirely.</span></li>
              <li><span className="ni">02</span><span>Build a basket-builder that tells you which store is cheaper for <em>your</em> specific shopping list this week.</span></li>
              <li><span className="ni">03</span><span>Detect &ldquo;fake&rdquo; specials — items marked down from an inflated shelf price they never really held.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; notebook <span className="arrow">↗</span>
              </a>
            </div>
          </section>
        </article>

        <nav className="case-next">
          <Link href="/projects/data/saas">
            <div className="wrap inner">
              <div>
                <div className="nx-lab">Next data story — 04</div>
                <div className="nx-title">SaaS Sales &amp; Revenue Pipeline</div>
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
