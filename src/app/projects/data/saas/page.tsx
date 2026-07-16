"use client"

import Link from 'next/link'
import TeHeader from '../../../components/te-header'
import { useTeEffects } from '../../../lib/use-te-effects'

export default function SaaSPage() {
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
              <span className="now">saas pipeline</span>
            </div>
            <div className="case-domain" data-reveal data-reveal-delay="1">Data Story <span className="faint">— 04</span></div>
            <h1 className="case-hook" data-reveal data-reveal-delay="1">
              MRR said up and to the right. The <span className="hl">cohort heatmap</span> found the leak.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              I built MRR, churn, NRR and CLV — the four metrics every SaaS analytics interview asks about — from raw invoices through a tested dbt pipeline. Headline growth looked healthy. Retention, split by cohort and tier, told a very different story.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo build &amp; analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">dbt · DuckDB · SQL</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">12.5K invoices · 1,147 subscriptions</div></div>
              <div className="cm"><div className="l">Window</div><div className="v">42 months · Jan 2023 – Jun 2026</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">Every SaaS dashboard shows MRR going up. The interesting question is what&apos;s churning underneath — and that only shows up when you compute the metrics from raw invoices instead of asserting them.</p>
            <p>So I built the whole thing as a warehouse-native pipeline: two raw datasets — B2B order transactions and a subscription lifecycle table — flowing through a dbt <em>staging → intermediate → marts</em> architecture into a four-page dashboard whose centrepiece is a cohort retention heatmap.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>12.5K invoices and 1,147 subscriptions land as <strong>dbt sources</strong> with tested contracts, and every mart is guarded by a grain test — <strong>44 data tests</strong>, 52/52 build passing, every column documented. The metrics are computed, not asserted: the MRR bridge decomposes each month into new / expansion / contraction / churned per customer (the identity <em>MRR<sub>t</sub> = MRR<sub>t−1</sub> + net new</em> holds exactly), NRR uses the 12-month cohort definition, and CLV ships both realized and predictive variants. The data itself is synthetic — a seeded generator encoding real SaaS dynamics, with a swap-in script for the equivalent Kaggle datasets — so it&apos;s the <em>pipeline</em> that&apos;s the product. Models compile on <strong>DuckDB</strong> locally and <strong>BigQuery</strong> unchanged, via cross-database macros.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="520" data-pre="$" data-suf="K">0</span></div><div className="cap">MRR at June 2026, growing +5.1% month on month.</div></div>
              <div className="sc"><div className="big"><span data-count="44">0</span></div><div className="cap">dbt data tests guarding sources, grains and metric logic.</div></div>
              <div className="sc"><div className="big"><span data-count="4" data-suf="×">0</span></div><div className="cap">Faster churn on the Basic tier than Enterprise, trailing 12 months.</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>With a customer × month revenue spine in place, retention stops being one number and becomes a surface: slice NRR by plan tier, then slice survival by signup cohort. The two cuts disagree with the headline MRR chart — and that disagreement is the finding.</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: growth quality splits sharply by tier. Pro is the only tier where expansion outruns churn.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Net revenue retention by plan tier</div>
                <div className="fig-unit">12-month NRR · June 2026</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Pro</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval acid">103%</span></div>
                <div className="brow"><span className="blab">Enterprise</span><span className="btrack"><span className="bfill" data-bar="87" /></span><span className="bval">90%</span></div>
                <div className="brow"><span className="blab">Basic</span><span className="btrack"><span className="bfill dim" data-bar="66" /></span><span className="bval">68%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> Pro&apos;s seat expansion outpaces its churn (NRR above 100%). Basic keeps only 68% of its year-ago revenue — it churns ~4× faster than Enterprise.</div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The cheapest customers turned out to be the most expensive. The discount promo filled the funnel — and the cohort heatmap watched it drain.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: the May–July 2024 discount-promo cohorts kept just 37–49% of customers at month six, versus ~71% for the cohorts either side. Cheap signups, expensive churn.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Customers retained at month 6, by signup cohort</div>
                <div className="fig-unit">% of cohort still active</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Mar 2024</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval">79%</span></div>
                <div className="brow"><span className="blab">Apr 2024</span><span className="btrack"><span className="bfill" data-bar="95" /></span><span className="bval">75%</span></div>
                <div className="brow"><span className="blab">May 2024 · promo</span><span className="btrack"><span className="bfill dim" data-bar="62" /></span><span className="bval">49%</span></div>
                <div className="brow"><span className="blab">Jun 2024 · promo</span><span className="btrack"><span className="bfill dim" data-bar="47" /></span><span className="bval acid">37%</span></div>
                <div className="brow"><span className="blab">Jul 2024 · promo</span><span className="btrack"><span className="bfill dim" data-bar="55" /></span><span className="bval">43%</span></div>
                <div className="brow"><span className="blab">Aug 2024</span><span className="btrack"><span className="bfill" data-bar="94" /></span><span className="bval">74%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> the promo quarter&apos;s cohorts fall off a cliff by month six while every neighbouring cohort holds ~71–79%. On the full heatmap it reads as a dark horizontal band.</div>
            </div>
          </div>

          <div className="figure" data-reveal>
            <div className="compare">
              <div className="cc win"><div className="ct">Enterprise churn · trailing 12m</div><div className="cv">1.4% / mo</div></div>
              <div className="cc"><div className="ct">Basic churn · trailing 12m</div><div className="cv">6.2% / mo</div></div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Deploy the documented cloud path — same dbt models on BigQuery, surfaced in Looker Studio.</span></li>
              <li><span className="ni">02</span><span>Swap the seeded generator for the real Kaggle datasets — the source tests already enforce the schema contract either way.</span></li>
              <li><span className="ni">03</span><span>Build the activity spine from coverage windows instead of invoices, so annual-prepay customers are handled correctly.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; SQL <span className="arrow">↗</span>
              </a>
            </div>
          </section>
        </article>

        <nav className="case-next">
          <Link href="/projects/data">
            <div className="wrap inner">
              <div>
                <div className="nx-lab">Back to the index</div>
                <div className="nx-title">All Data Projects</div>
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
