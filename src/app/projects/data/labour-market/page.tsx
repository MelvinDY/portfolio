"use client"

import Link from 'next/link'
import Image from 'next/image'
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
            <div className="case-domain" data-reveal data-reveal-delay="1">Data Pipeline <span className="faint">— 01</span></div>
            <h1 className="case-hook" data-reveal data-reveal-delay="1">
              Four in five working men are full-time. For women, it&apos;s <span className="hl">barely one in two</span>.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              An end-to-end analytics pipeline on live Australian Bureau of Statistics data — Python ingests it, Azure SQL models it, and a 4-page Power BI report visualises it. The whole report is generated as code, not clicked together by hand.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo build</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">Python · Azure SQL · Power BI</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">ABS Data API (live)</div></div>
              <div className="cm"><div className="l">Window</div><div className="v">1978 – 2026</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">Every politician has a line about jobs. I wanted the number behind the line — not the headline rate, but the <em>shape</em> of who is working, in what, full-time or part, and how that&apos;s shifted.</p>
            <p>So I built the whole stack an analyst actually uses: <strong>ingest → transform → store → model → visualise</strong>. Python pulls the ABS Labour Force series straight off the API, pandas cleans and reshapes it, Azure SQL stores and models it through a layered view pattern, and Power BI sits on top as a 4-page report covering the national picture, the states, industries, and the full-time / part-time split.</p>
            <p>This page is that report, told as a story — the strongest findings first, the engineering that makes them trustworthy underneath.</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>Everything here comes from the <a className="inl" href="https://www.abs.gov.au/statistics/labour" target="_blank" rel="noopener noreferrer">Australian Bureau of Statistics</a> — the same Labour Force survey the RBA and Treasury quote. I hit the ABS Data API directly (no key required): the monthly Labour Force series for the national, state and full-time/part-time numbers, and the annual Labour Account for employment by industry. The national series runs back to <strong>February 1978</strong> and is current to early 2026.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="4.49" data-suf="%">0</span></div><div className="cap">National unemployment rate — near historic lows.</div></div>
              <div className="sc"><div className="big"><span data-count="14.7" data-suf="M">0</span></div><div className="cap">Employed persons — a record high (14,737k).</div></div>
              <div className="sc"><div className="big"><span data-count="66.71" data-suf="%">0</span></div><div className="cap">Participation rate — also near record territory.</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> The build</div>
            <p>The pipeline is deliberately boring, which is the point. The raw ABS output is messy multi-dimension data with coded labels and a wide shape; I parse the time periods, map the dimension codes to readable names, and reshape it long. The cleaned data lands in <strong>Azure SQL</strong> staging tables, then a <strong>staging → mart</strong> view layer shapes the metrics. Power BI only ever reads the curated <em>mart</em> views — never the raw tables.</p>
            <p>The Power BI report itself is <strong>generated by a Python script</strong>, not hand-built in Desktop. One <code>build_report.py</code> writes the data model, every visual, the 15 DAX measures and a custom colour theme as text files. So the entire dashboard is diff-able, reviewable and version-controlled like code — if it ever corrupts, I regenerate it instead of fighting a binary <code>.pbix</code>.</p>
            <p>It runs on <strong>serverless Azure SQL</strong>, which auto-pauses when idle — the whole thing costs roughly <strong>$2–6 a month</strong>, almost all of it storage rather than compute.</p>
          </section>

          <div className="archflow" data-reveal>
            <div className="node"><div className="stage">Ingest</div><div className="tool">ABS Data API</div><div className="what">Python · live pull, no key</div><span className="arr">→</span></div>
            <div className="node"><div className="stage">Transform</div><div className="tool">pandas</div><div className="what">clean · map codes · reshape</div><span className="arr">→</span></div>
            <div className="node"><div className="stage">Store + model</div><div className="tool">Azure SQL</div><div className="what">staging → mart views (T-SQL)</div><span className="arr">→</span></div>
            <div className="node"><div className="stage">Visualise</div><div className="tool">Power BI</div><div className="what">generated as code · DAX</div></div>
          </div>

          <div className="figure wide" data-reveal>
            <div className="shot">
              <div className="shot-tab"><i className="live" /><i /><i /> aus_job_dashboard.pbip — Overview</div>
              <Image src="/projects/labour-market/pbi-overview.png" alt="Power BI Overview page: national unemployment rate trend back to 1978, employed persons trend, and KPI cards for unemployment rate, employment, participation and emp-to-pop ratio." width={1992} height={1152} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="fig-cap"><b>Page 1 — Overview.</b> The national headline series, seasonally adjusted: unemployment at 4.49%, employment at a record 14.7M, +0.88% year-on-year.</div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: full-time work isn&apos;t shared evenly. The part-time economy is overwhelmingly female.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Full-time share of employment, by sex</div>
                <div className="fig-unit">% of jobs that are full-time</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Male</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval acid">79.98%</span></div>
                <div className="brow"><span className="blab">Persons</span><span className="btrack"><span className="bfill dim" data-bar="86" /></span><span className="bval">68.95%</span></div>
                <div className="brow"><span className="blab">Female</span><span className="btrack"><span className="bfill dim" data-bar="71" /></span><span className="bval">56.92%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> 80% of working men hold a full-time job; for women it&apos;s 57%. The gap has narrowed over decades, but it&apos;s still a 23-point spread.</div>
            </div>
          </div>

          <div className="figure wide" data-reveal>
            <div className="shot">
              <div className="shot-tab"><i className="live" /><i /><i /> aus_job_dashboard.pbip — Full-time vs Part-time</div>
              <Image src="/projects/labour-market/pbi-ftpt.png" alt="Power BI Full-time vs Part-time page: stacked area of full-time vs part-time employment, full-time share KPIs, full-time share by sex over time, and an employment-by-sex donut." width={1992} height={1152} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="fig-cap"><b>Page 4 — Full-time vs Part-time.</b> Full-time is 68.95% of all jobs (+0.19 ppt YoY). The by-sex lines tell the real story: male and female full-time shares have been drifting apart and back for forty years.</div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The headline rate hides the composition. Who works full-time, and where, is the part that actually moved.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: the labour market is tight almost everywhere — the states barely differ.</p>
            <p>I expected wide regional gaps. Instead the spread between the highest and lowest state unemployment rate is under <strong>0.9 of a percentage point</strong> — Tasmania at the top, Western Australia at the bottom, everyone bunched in between.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Unemployment rate by state — latest month</div>
                <div className="fig-unit">% · seasonally adjusted</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Tasmania</span><span className="btrack"><span className="bfill" data-bar="100" /></span><span className="bval acid">4.99%</span></div>
                <div className="brow"><span className="blab">Victoria</span><span className="btrack"><span className="bfill dim" data-bar="97" /></span><span className="bval">4.82%</span></div>
                <div className="brow"><span className="blab">New South Wales</span><span className="btrack"><span className="bfill dim" data-bar="89" /></span><span className="bval">4.44%</span></div>
                <div className="brow"><span className="blab">Queensland</span><span className="btrack"><span className="bfill dim" data-bar="86" /></span><span className="bval">4.27%</span></div>
                <div className="brow"><span className="blab">South Australia</span><span className="btrack"><span className="bfill dim" data-bar="84" /></span><span className="bval">4.19%</span></div>
                <div className="brow"><span className="blab">Western Australia</span><span className="btrack"><span className="bfill dim" data-bar="83" /></span><span className="bval">4.12%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> a 0.87 ppt spread across the states. <b>Honest note:</b> the ABS feed returned 6 of 8 jurisdictions — ACT and NT were missing at source, so I left them off rather than draw a map with holes in it.</div>
            </div>
          </div>

          <div className="figure wide" data-reveal>
            <div className="shot">
              <div className="shot-tab"><i className="live" /><i /><i /> aus_job_dashboard.pbip — State Breakdown</div>
              <Image src="/projects/labour-market/pbi-state.png" alt="Power BI State Breakdown page: ranked bars of unemployment rate and employed persons by state, plus an unemployment-rate trend line per state." width={1992} height={1152} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="fig-cap"><b>Page 2 — State Breakdown.</b> Ranked bars instead of a map: a built-in Bing map rendered as a zoomed-out world view and read as broken, so I dropped it for bars that never look broken.</div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight three: health care is the country&apos;s biggest employer — but here&apos;s where I have to be honest about the data.</p>
            <p>By headcount, Health Care &amp; Social Assistance and Retail Trade sit at the top of the industry table. But the industry breakdown comes from the annual ABS Labour Account, which <strong>lags badly — it ends at 2022</strong>, while everything else on the dashboard is current. I confirmed via the live API that it&apos;s stale <em>at source</em>, so rather than quietly mix a 2022 series with current numbers, I labelled every industry title with its vintage. Knowing a source&apos;s recency before you build on it matters more than any chart.</p>
          </section>

          <div className="figure wide" data-reveal>
            <div className="shot">
              <div className="shot-tab"><i className="live" /><i /><i /> aus_job_dashboard.pbip — Industry View</div>
              <Image src="/projects/labour-market/pbi-industry.png" alt="Power BI Industry View page: horizontal bar of employed persons across 19 ANZSIC divisions for 2022, a focus-industries trend line, and an industry detail table with year-on-year growth." width={1992} height={1152} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="fig-cap"><b>Page 3 — Industry View.</b> All 19 ANZSIC divisions ranked by employment, with a growing/shrinking detail table. Titles say &ldquo;2022, annual&rdquo; on purpose — the source ends there.</div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Replace the stale annual industry source with a current quarterly Labour Force Detailed &ldquo;employed by industry&rdquo; series, so every page is current to the same month.</span></li>
              <li><span className="ni">02</span><span>Fix the missing ACT &amp; NT in the state mart view — chase the gap back through staging → mart filtering.</span></li>
              <li><span className="ni">03</span><span>Harden the Azure side: a budget + cost alert, secrets in Key Vault, and Azure AD auth to the SQL DB instead of a SQL login.</span></li>
            </ol>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">06</span> Take a look</div>
            <div className="case-links">
              <a className="btn primary" href="https://github.com/MelvinDY/aus_job_dashboard" target="_blank" rel="noopener noreferrer" data-magnetic>
                Source &amp; build script <span className="arrow">↗</span>
              </a>
              <a className="btn" href="/projects/labour-market/aus-labour-dashboard.pdf" target="_blank" rel="noopener noreferrer">
                Dashboard PDF <span className="arrow">↗</span>
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
