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
              I captured same-day prices from Woolworths&apos; and Coles&apos; own web APIs, matched 104 identical products across the two catalogues, and priced a 50-item basket at both. The verdict: a near dead-heat — under $2 apart — with the real gaps hiding in whose specials cycle an item sits in.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo build &amp; analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">Python · DuckDB · rapidfuzz</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">Retailer web APIs</div></div>
              <div className="cm"><div className="l">Scope</div><div className="v">50-item basket · 104 matched pairs</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">&ldquo;Woolies is cheaper.&rdquo; &ldquo;No, Coles is.&rdquo; Everyone has a confident answer and none of them have the receipts. I wanted the receipts.</p>
            <p>So I built a pipeline that hits the same JSON endpoints the retailers&apos; own storefronts use — no HTML scraping, no auth — prices a fixed 50-term everyday basket at both chains on the same day, and settles the argument with matched, like-for-like products instead of vibes.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>Each run lands <strong>~2,000 price rows</strong> in a <strong>DuckDB</strong> warehouse built from immutable raw CSVs. Staging canonicalises pack sizes (<em>2L</em>, <em>12x375mL</em>, <em>12 pack</em> → grams / ml / each) and normalises both retailers&apos; unit prices to $/100g. The hard part is <strong>entity resolution</strong>: candidates are fuzzy-matched with <strong>rapidfuzz</strong>, then accepted by tier — national brands need the same brand, a pack size within 2% and a name score ≥ 80; home brands are matched separately because they&apos;re substitutes, not identical products. Every accepted pair carries its score, so the whole match set is auditable in SQL.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="1.82" data-pre="$">0</span></div><div className="cap">Gap on the full 50-item basket — $209.59 Coles vs $211.41 Woolworths.</div></div>
              <div className="sc"><div className="big"><span data-count="50" data-suf="%">0</span></div><div className="cap">Of 104 identical products are priced exactly the same, to the cent.</div></div>
              <div className="sc"><div className="big"><span data-count="15" data-pre="$">0</span></div><div className="cap">Biggest same-day gap on a single identical product (laundry liquid).</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>With identical products matched one-to-one, the comparison became honest: count who wins each matched pair, total the basket at both stores, and compare per-100g unit prices by category. No cherry-picked trolleys, no comparing a 500g jar to a 375g one.</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: on identical national-brand products, the two chains mostly refuse to be beaten — half the matches are priced to the cent.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Who&apos;s cheaper on 104 identical products?</div>
                <div className="fig-unit">matched pairs · same day</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Priced identical</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval acid">52</span></div>
                <div className="brow"><span className="blab">Coles cheaper</span><span className="btrack"><span className="bfill" data-bar="58" /></span><span className="bval">30</span></div>
                <div className="brow"><span className="blab">Woolworths cheaper</span><span className="btrack"><span className="bfill dim" data-bar="42" /></span><span className="bval">22</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> exact ties are the single biggest outcome. Coles edges the rest 30–22, but the basket ends up less than $2 apart.</div>
            </div>
          </div>

          <div className="figure" data-reveal>
            <div className="compare">
              <div className="cc win"><div className="ct">50-item basket · Coles</div><div className="cv">$209.59</div></div>
              <div className="cc"><div className="ct">50-item basket · Woolworths</div><div className="cv">$211.41</div></div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The sign out front doesn&apos;t decide what you pay. The specials cycle does — identical products sat $15 apart on the same day.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: the big gaps aren&apos;t random — they&apos;re specials. Laundry and coffee products differed by $4–15 on the day, depending on whose promo cycle they sat in.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Biggest same-product price gaps on the day</div>
                <div className="fig-unit">identical product · AUD gap</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">OMO Sensitive Laundry 2L</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval acid">$15.00</span></div>
                <div className="brow"><span className="blab">Bosisto&apos;s Power+ Laundry 2L</span><span className="btrack"><span className="bfill" data-bar="61" /></span><span className="bval">$9.20</span></div>
                <div className="brow"><span className="blab">Moccona Rich Blend 200g</span><span className="btrack"><span className="bfill" data-bar="59" /></span><span className="bval">$8.85</span></div>
                <div className="brow"><span className="blab">Moccona Mocha Kenya 200g</span><span className="btrack"><span className="bfill dim" data-bar="47" /></span><span className="bval">$7.10</span></div>
                <div className="brow"><span className="blab">Bosisto&apos;s Sensitive Laundry 2L</span><span className="btrack"><span className="bfill dim" data-bar="43" /></span><span className="bval">$6.45</span></div>
                <div className="brow"><span className="blab">Morning Fresh 900mL</span><span className="btrack"><span className="bfill dim" data-bar="28" /></span><span className="bval">$4.25</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> the same OMO bottle was $30 at Woolworths and $15 at Coles on the same day. Timing the specials on pantry and household items is where the real savings live.</div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Run the pipeline on a schedule — each run already appends a dated snapshot, so the design turns into a price-tracking time series for free.</span></li>
              <li><span className="ni">02</span><span>Build a basket-builder that tells you which store is cheaper for <em>your</em> specific shopping list this week.</span></li>
              <li><span className="ni">03</span><span>With history in place, detect &ldquo;fake&rdquo; specials — items marked down from an inflated shelf price they never really held.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; pipeline <span className="arrow">↗</span>
              </a>
            </div>
          </section>
        </article>

        <nav className="case-next">
          <Link href="/projects/data/saas">
            <div className="wrap inner">
              <div>
                <div className="nx-lab">Next data story — 04</div>
                <div className="nx-title">SaaS Sales &amp; Revenue Analytics</div>
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
