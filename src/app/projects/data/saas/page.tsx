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
              One habit <span className="hl">tripled</span> the win rate: book the demo in week one.
            </h1>
            <p className="case-sub" data-reveal data-reveal-delay="2">
              I tore down a funnel of 4,200 opportunities to find where revenue leaks and where it compounds. Deal size didn&apos;t separate winners from losers. Timing did.
            </p>
            <div className="case-meta" data-reveal data-reveal-delay="3">
              <div className="cm"><div className="l">Role</div><div className="v">Solo analysis</div></div>
              <div className="cm"><div className="l">Stack</div><div className="v">SQL · Snowflake · dbt</div></div>
              <div className="cm"><div className="l">Source</div><div className="v">CRM opportunity export</div></div>
              <div className="cm"><div className="l">Sample</div><div className="v">4,200 opportunities</div></div>
            </div>
          </div>
        </section>

        <article className="article">
          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">01</span> Overview</div>
            <p className="lede">A sales pipeline is just a funnel with feelings attached. Strip the feelings out and you can see exactly which stage is quietly bleeding revenue.</p>
            <p>I took a full export of 4,200 opportunities and rebuilt the funnel stage by stage — entry, qualification, demo, proposal, close — then asked the only two questions that matter: where do deals die, and what do the survivors have in common?</p>
          </section>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">02</span> The data</div>
            <p>The raw CRM export was messy — duplicate opportunities, stages skipped, timestamps missing. I modelled it in <strong>Snowflake</strong> with <strong>dbt</strong> into one clean row per opportunity, with the full stage history and time-in-stage attached, then surfaced it in <strong>Looker</strong>.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="statcallout">
              <div className="sc"><div className="big"><span data-count="4200">0</span></div><div className="cap">Opportunities reconstructed end to end.</div></div>
              <div className="sc"><div className="big"><span data-count="3.1" data-suf="×">0</span></div><div className="cap">Win rate when a demo lands in week one.</div></div>
              <div className="sc"><div className="big"><span data-count="19" data-suf="d">0</span></div><div className="cap">Median time deals stall in &ldquo;negotiation.&rdquo;</div></div>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <div className="sect-mark"><span className="n">03</span> Approach</div>
            <p>With a clean stage history, the funnel became a simple set of conversion ratios — and the time-in-stage data let me test <em>behaviours</em>, not just outcomes. The standout test: split every deal by how quickly its first demo happened, then compare win rates.</p>
          </section>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">04</span> Key insights</div>
            <div className="prose"><p className="lede">Insight one: the funnel leaks hardest at the demo. Half of qualified deals never get one booked.</p></div>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Pipeline funnel — 4,200 opportunities</div>
                <div className="fig-unit">count · conversion</div>
              </div>
              <div className="funnel">
                <div className="fstep"><span className="fbar" data-bar="100" /><span className="fname">Leads</span><span className="fnum">4,200 · <b>100%</b></span></div>
                <div className="fstep"><span className="fbar" data-bar="62" /><span className="fname">Marketing qualified</span><span className="fnum">2,520 · <b>60%</b></span></div>
                <div className="fstep"><span className="fbar" data-bar="34" /><span className="fname">Sales qualified</span><span className="fnum">1,260 · <b>30%</b></span></div>
                <div className="fstep"><span className="fbar" data-bar="22" /><span className="fname">Demo booked</span><span className="fnum">760 · <b>18%</b></span></div>
                <div className="fstep"><span className="fbar" data-bar="13" /><span className="fname">Proposal sent</span><span className="fnum">420 · <b>10%</b></span></div>
                <div className="fstep"><span className="fbar" data-bar="7" /><span className="fname">Closed won</span><span className="fnum">210 · <b>5%</b></span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> the biggest single drop is qualified → demo. Fix that stage and everything downstream compounds.</div>
            </div>
          </div>

          <div className="col">
            <div className="pull" data-reveal>
              <p>&ldquo;The deals that won didn&apos;t have bigger budgets. They had earlier demos.&rdquo;</p>
            </div>
          </div>

          <section className="sect col prose" data-reveal>
            <p className="lede">Insight two: speed compounds. The faster the first demo, the higher the close rate — and it isn&apos;t close.</p>
          </section>

          <div className="figure" data-reveal>
            <div className="chart">
              <div className="fig-head">
                <div className="fig-title">Win rate by time to first demo</div>
                <div className="fig-unit">% of deals closed won</div>
              </div>
              <div className="barchart">
                <div className="brow"><span className="blab">Within week 1</span><span className="btrack"><span className="bfill" data-bar="95" /></span><span className="bval acid">34%</span></div>
                <div className="brow"><span className="blab">Week 2</span><span className="btrack"><span className="bfill" data-bar="53" /></span><span className="bval">19%</span></div>
                <div className="brow"><span className="blab">Week 3</span><span className="btrack"><span className="bfill dim" data-bar="31" /></span><span className="bval">11%</span></div>
                <div className="brow"><span className="blab">Week 4+</span><span className="btrack"><span className="bfill dim" data-bar="25" /></span><span className="bval">9%</span></div>
              </div>
              <div className="fig-cap"><b>Read:</b> a demo in the first week closes at <b>3.1×</b> the rate of one that slips past week three — holding deal size constant.</div>
            </div>
          </div>

          <div className="figure" data-reveal>
            <div className="compare">
              <div className="cc win"><div className="ct">Top 2 reps</div><div className="cv">58% of revenue</div></div>
              <div className="cc"><div className="ct">Other 9 reps</div><div className="cv">42% of revenue</div></div>
            </div>
          </div>

          <section className="sect col" data-reveal>
            <div className="sect-mark"><span className="n">05</span> What&apos;s next</div>
            <ol className="nextlist">
              <li><span className="ni">01</span><span>Wire an alert that flags any qualified deal without a demo booked inside five days — close the leak in real time.</span></li>
              <li><span className="ni">02</span><span>Study the top two reps&apos; sequences to see what&apos;s coachable versus what&apos;s just talent.</span></li>
              <li><span className="ni">03</span><span>Model expected revenue per stage so forecasting stops being a gut-feel spreadsheet.</span></li>
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
