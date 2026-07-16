"use client"

import Link from 'next/link'
import TeHeader from '../../components/te-header'
import { useTeEffects } from '../../lib/use-te-effects'

export default function DataProjectsPage() {
  useTeEffects()

  return (
    <div className="te-home">
      <TeHeader activePage="data" />

      <main>
        <section className="subhero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span><span className="now">data projects</span>
            </div>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Data<br /><span className="outline">Projects</span>
            </h1>
            <div className="subhero-foot">
              <p className="lead" data-reveal data-reveal-delay="2">
                Four questions I couldn&apos;t stop poking at — labour markets, viral video,
                supermarket price wars and a subscription business quietly losing its cheapest customers.
                Each one is written as a{' '}
                <span className="acid-text">data story</span>: a finding first, the working underneath.
              </p>
              <div className="subhero-meta" data-reveal data-reveal-delay="2">
                <div className="sm"><div className="v" data-count="4">4</div><div className="l">Case studies</div></div>
                <div className="sm"><div className="v" data-count="75" data-suf="K+">0</div><div className="l">Rows analysed</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="tight">
          <div className="wrap">
            <div className="index-grid">

              <Link className="pcard dcard" href="/projects/data/labour-market" data-reveal>
                <div className="pcard-top"><span className="pcard-no">/ 01</span><span className="badge">ABS · Azure SQL · Power BI</span></div>
                <div className="finding">
                  <div className="fnum"><span data-count="80" data-suf="%">80%</span></div>
                  <div className="flabel">of working men hold a full-time job — for women it&apos;s 57%. Australia&apos;s part-time economy is overwhelmingly <em className="serif">female</em>.</div>
                </div>
                <h3>Australian Labour Market Dashboard</h3>
                <p className="pcard-desc">An end-to-end pipeline on live ABS data — Python ingests it, Azure SQL models it through a staging→mart layer, and a 4-page Power BI report visualises it. The report is generated as code, not clicked together.</p>
                <div className="tagrow">
                  <span className="tag">ABS API</span><span className="tag">Azure SQL</span><span className="tag">Power BI</span><span className="tag">DAX</span><span className="tag">Python</span>
                </div>
                <span className="cardlink">Read the case study <span className="arrow">↗</span></span>
              </Link>

              <Link className="pcard dcard" href="/projects/data/youtube" data-reveal data-reveal-delay="1">
                <div className="pcard-top"><span className="pcard-no">/ 02</span><span className="badge">API · pandas · ML</span></div>
                <div className="finding">
                  <div className="fnum"><span data-count="38" data-suf=" hrs">38 hrs</span></div>
                  <div className="flabel">The average video&apos;s entire life on the Trending page lasts under two days — then it <em className="serif">vanishes</em>.</div>
                </div>
                <h3>YouTube Trending Analytics</h3>
                <p className="pcard-desc">Forensics on 40,000 trending videos across 10 regions: what actually predicts a spot on the board, how long it survives, and which signals are pure noise.</p>
                <div className="tagrow">
                  <span className="tag">YouTube API</span><span className="tag">pandas</span><span className="tag">scikit-learn</span><span className="tag">Plotly</span>
                </div>
                <span className="cardlink">Read the case study <span className="arrow">↗</span></span>
              </Link>

              <Link className="pcard dcard" href="/projects/data/grocery" data-reveal data-reveal-delay="2">
                <div className="pcard-top"><span className="pcard-no">/ 03</span><span className="badge">Retailer APIs · DuckDB · Python</span></div>
                <div className="finding">
                  <div className="fnum"><span data-count="1.82" data-pre="$">$1.82</span></div>
                  <div className="flabel">The gap on a 50-item basket — a near dead-heat. Of 104 identical products, half cost <em className="serif">exactly</em> the same. The real money hides in the specials.</div>
                </div>
                <h3>Woolworths vs Coles Price Analytics</h3>
                <p className="pcard-desc">Same-day prices from both retailers&apos; public web APIs, fuzzy-matched into identical product pairs and compared in a DuckDB warehouse — basket totals, per-100g unit prices, and $15 same-product outliers.</p>
                <div className="tagrow">
                  <span className="tag">Python</span><span className="tag">DuckDB</span><span className="tag">rapidfuzz</span><span className="tag">Entity Resolution</span>
                </div>
                <span className="cardlink">Read the case study <span className="arrow">↗</span></span>
              </Link>

              <Link className="pcard dcard" href="/projects/data/saas" data-reveal data-reveal-delay="3">
                <div className="pcard-top"><span className="pcard-no">/ 04</span><span className="badge">dbt · DuckDB · SQL</span></div>
                <div className="finding">
                  <div className="fnum"><span data-count="37" data-suf="%">37%</span></div>
                  <div className="flabel">of the discount-promo cohort was still a customer by month six — neighbouring cohorts kept ~71%. Cheap signups, <em className="serif">expensive</em> churn.</div>
                </div>
                <h3>SaaS Sales &amp; Revenue Analytics</h3>
                <p className="pcard-desc">MRR, churn, NRR and CLV computed from 12.5K invoices through a tested dbt pipeline — 8 models, 44 data tests — with a cohort retention heatmap as the centrepiece.</p>
                <div className="tagrow">
                  <span className="tag">dbt</span><span className="tag">SQL</span><span className="tag">DuckDB</span><span className="tag">BigQuery</span>
                </div>
                <span className="cardlink">Read the case study <span className="arrow">↗</span></span>
              </Link>

            </div>
          </div>
        </section>

        <section className="block tight">
          <div className="wrap center">
            <p className="kicker acid" data-reveal style={{ justifyContent: 'center' }}>Also a builder</p>
            <h2 className="section-title mt-s" data-reveal data-reveal-delay="1">Want to see what I ship in code?</h2>
            <div className="mt-l" data-reveal data-reveal-delay="2">
              <Link className="btn primary" href="/projects/software" data-magnetic>
                View Software Projects <span className="arrow">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-cta">Let&apos;s talk<br /><span className="dim">data.</span></div>
              <p className="mono faint" style={{ marginTop: '18px', fontSize: '12px', letterSpacing: '0.05em' }}>
                Open to Data Analyst &amp; Analytics Engineer roles · Sydney, AU
              </p>
            </div>
            <div className="foot-col">
              <h4>Navigate</h4>
              <Link href="/">Home</Link>
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
