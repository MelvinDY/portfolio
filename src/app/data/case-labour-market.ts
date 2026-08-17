import type { CaseStudyProps } from '../components/case-study'

/**
 * Australian Labour Market case study.
 *
 * Copy kept in the author's voice, per Section 11.C, and free of em-dashes:
 * rewritten into sentences, commas or colons rather than swapped for a
 * different dash.
 *
 * Rewritten for v2 of the project. Two things changed materially and both are
 * reflected here rather than papered over:
 *   1. Azure SQL was decommissioned on purpose. The pipeline now runs locally
 *      on SQL Server in Docker with dbt, at no cost, so a stranger can clone
 *      and run it. Every mention of Azure as live infrastructure is gone.
 *   2. The page now leads with an actual finding rather than a dashboard tour.
 *      The gender full-time gap analysis is the centrepiece, because a
 *      conclusion someone can argue with is worth more than a screenshot.
 *
 * Figures are current to June 2026 and come from the project's mart models.
 * If they are refreshed, re-read them from analysis/figures.json in the repo.
 */
export const labourMarket: CaseStudyProps = {
  kicker: 'Data analysis',
  hookLead: 'Four in five working men are full-time.',
  hookTail: 'For women it is barely one in two.',
  sub: 'An end-to-end analytics pipeline on live Australian Bureau of Statistics data, built to answer a question rather than just move rows: is that gap closing, and why? Python ingests the data, dbt models it into a tested star schema, and Power BI and Excel sit on top. The whole thing runs locally at no cost, and the report is generated as code rather than clicked together by hand.',
  meta: [
    ['Role', 'Solo build'],
    ['Stack', 'Python, dbt, SQL Server, Power BI, Excel'],
    ['Source', 'ABS Data API, live'],
    /* Who wrote the plumbing, stated separately from where the rows came from.
       Those are two different claims and an interviewer will separate them, so
       the page does too. */
    ['Built', 'ABS ingestion, dbt star schema, 124 tests, Power BI as code'],
    ['Window', '1978 to 2026, 581 months'],
    ['Cost', '$0, runs on a laptop'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['finding', 'The finding'],
    ['build', 'The build'],
    ['honesty', 'Where the data pushes back'],
    ['next', 'What is next'],
  ],
  links: [
    { label: 'Source and build script', href: 'https://github.com/MelvinDY/aus_job_dashboard', primary: true },
    { label: 'Full analysis write-up', href: 'https://github.com/MelvinDY/aus_job_dashboard/blob/master/analysis/gender-fulltime-gap.md' },
    { label: 'Dashboard PDF', href: '/projects/labour-market/aus-labour-dashboard.pdf' },
    { label: 'ABS data source', href: 'https://www.abs.gov.au/statistics/labour' },
  ],
  nextStudy: { href: '/projects/data/youtube', title: 'YouTube Trending Analytics' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: 'Every politician has a line about jobs. I wanted the number behind the line: not the headline rate, but the shape of who is working, in what, full-time or part, and how that has shifted.' },
    { t: 'p', text: 'So I built the whole stack an analyst actually uses. Python pulls the ABS Labour Force series straight off the API, dbt models it into a star schema with a test suite attached, and Power BI and Excel read the curated mart on top. It runs end to end on one command, on a laptop, for nothing.' },
    { t: 'p', text: 'Then I used it. The section below is the part I care about most: a question, an answer, and the moment the obvious answer turned out to be wrong.' },
    {
      t: 'stats',
      items: [
        { figure: '4.43%', caption: 'National unemployment rate, June 2026, near historic lows.' },
        { figure: '14.8M', caption: 'Employed persons, a record 14,823k, up 1.73% year on year.' },
        { figure: '124', caption: 'Automated data-quality tests, run on every push.' },
      ],
    },

    { t: 'h', id: 'finding', text: 'The finding' },
    { t: 'lede', text: 'The gender full-time gap is closing. For most of this century it was closing for the wrong reason.' },
    { t: 'p', text: 'Of employed Australians in June 2026, 79.7% of men work full-time against 56.6% of women. That is a 23.1 percentage point gap, and it is narrowing faster than at any point since the series began in 1978: about 0.7 points per decade in the 1990s, and roughly 6.6 points per decade since 2017.' },
    { t: 'p', text: 'A gap can close two ways. The lower line rises, or the upper line falls. Which one is happening changes what the number means completely, so I checked.' },
    {
      t: 'line',
      title: 'The gap between male and female full-time rates',
      unit: 'percentage points, annual average, band 20 to 34',
      pts: [[0.0, 0.617], [0.021, 0.662], [0.042, 0.665], [0.062, 0.696], [0.083, 0.685], [0.104, 0.696], [0.125, 0.735], [0.146, 0.754], [0.167, 0.786], [0.188, 0.825], [0.208, 0.824], [0.229, 0.828], [0.25, 0.826], [0.271, 0.824], [0.292, 0.824], [0.312, 0.815], [0.333, 0.807], [0.354, 0.822], [0.375, 0.795], [0.396, 0.804], [0.417, 0.803], [0.438, 0.796], [0.458, 0.759], [0.479, 0.749], [0.5, 0.79], [0.521, 0.795], [0.542, 0.755], [0.562, 0.771], [0.583, 0.71], [0.604, 0.681], [0.625, 0.682], [0.646, 0.656], [0.667, 0.662], [0.688, 0.672], [0.708, 0.671], [0.729, 0.648], [0.75, 0.648], [0.771, 0.621], [0.792, 0.566], [0.812, 0.588], [0.833, 0.549], [0.854, 0.499], [0.875, 0.47], [0.896, 0.396], [0.917, 0.357], [0.938, 0.259], [0.958, 0.235], [0.979, 0.22], [1.0, 0.231]],
      xLabels: ['1978', '2002', '2026'],
      read: 'The gap widened through the 1980s, peaked at 32.1 points in 1992, and has fallen since. The steepest decline in the whole series is the most recent stretch.',
    },
    { t: 'p', text: 'Measured from 2000 to today, the arithmetic looks damning. Women’s full-time share is unchanged, down 0.1 of a point, while the male share fell 7.5. Read literally, that says 99% of the convergence came from men losing full-time work rather than women gaining it. It is tidy, quotable, and wrong.' },
    { t: 'pull', text: 'It is wrong because women’s rate did not sit still. It fell for 39 years, bottomed in January 2017, and has risen since. Averaged across the turn, the two movements cancel and the turn disappears.' },
    {
      t: 'bars',
      title: 'Who closed the gap, split at the 2017 turning point',
      unit: '% of the gap change coming from each side',
      bars: [
        { label: '2017 to 2026: women rising', value: '73%', pct: 100, lead: true },
        { label: '2017 to 2026: men falling', value: '27%', pct: 37 },
        { label: '2000 to 2017: men falling', value: '57%', pct: 78 },
        { label: '2000 to 2017: women falling', value: '43%', pct: 59 },
      ],
      read: 'Before 2017 both rates were falling and the gap barely moved, closing 1.5 points in seventeen years. Since 2017 it has closed 6.0 points, and most of that is women moving into full-time work. It is the first era in the entire series where that is true.',
    },
    {
      t: 'fig',
      src: '/projects/labour-market/ft-gap-convergence.png',
      page: 'Analysis, chart 1 of 4',
      alt: 'Line chart of full-time share of employment by sex, 1978 to 2026. The male line falls from 95% to 80%. The female line falls from 66% to a low of 53% in 2017, then rises to 57%.',
      caption: 'The two rates that make the gap. The turning point in the women’s line, marked in 2017, is the finding: it ends a 39-year decline.',
    },
    { t: 'p', text: 'So the honest answer to "is the gap closing?" is: yes, four times faster than in the 2000s, and only in the last nine years has it been closing for the reason most people assume.' },
    { t: 'lede', text: 'What was pulling the men’s line down was not unemployment. It was part-time work.' },
    { t: 'p', text: 'Part-time work among employed men went from 5.2% in 1978 to 20.3% today, roughly one in twenty to one in five. That is the part of the convergence that is good news for nobody. A gap that narrows because the higher group is losing full-time work is a different phenomenon from one that narrows because the lower group is gaining it, and until 2017 Australia was mostly doing the first.' },
    { t: 'lede', text: 'One more correction, because a flat rate is not a flat trend.' },
    { t: 'p', text: '"Women’s full-time share was unchanged from 2000 to 2017" invites a second wrong conclusion, that women made no full-time gains. They made enormous ones. Women in full-time work went from 1.40 million in 1978 to 4.03 million today, up 188%, against 67% for men. Their share of all full-time jobs rose from 27.6% to 39.6%. The rate stayed flat because female employment grew fast enough that full-time and part-time grew together.' },
    { t: 'p', text: 'Both statements are true, and reporting either one alone misleads. It is the clearest argument in the dataset for never shipping a rate without its level.' },
    {
      t: 'list',
      items: [
        'Never quote the gap on its own. It moves for two opposite reasons and cannot tell you which.',
        'The post-2017 trend is the genuinely encouraging one, and it is recent enough to be fragile. It deserves its own monitoring, not a 25-year average that hides it.',
        'At the pace of the last fifteen years, 4.6 points per decade, parity arrives around 2076. "Closing fast" and "closing within a working lifetime" are not the same claim.',
      ],
    },

    { t: 'h', id: 'build', text: 'The build' },
    { t: 'p', text: 'The pipeline is deliberately boring, which is the point. Python does two things only: call the ABS API and land the response exactly as it arrived. Everything after that is a dbt model, so every transformation is documented, version-controlled and covered by a test rather than buried in a script nobody reads.' },
    { t: 'p', text: 'The models resolve into a star schema. One fact table holds every ABS observation, and the attributes that describe it, what is measured, for whom, where, on what basis, live in dimensions beside it. The previous version loaded four wide tables that were four different flattenings of the same rows, which meant anything you wanted to slice by had to already be a column in the right one.' },
    {
      t: 'flow',
      items: [
        { stage: 'Ingest', tool: 'ABS Data API', what: 'Python, live pull, no key' },
        { stage: 'Land', tool: 'SQL Server', what: 'raw schema, response kept verbatim' },
        { stage: 'Model', tool: 'dbt', what: 'staging to star to mart, 124 tests' },
        { stage: 'Visualise', tool: 'Power BI, Excel', what: 'generated as code, DAX, Power Query' },
      ],
    },
    { t: 'p', text: 'The Power BI report is generated by a Python script rather than hand-built in Desktop. One build_report.py writes the data model, every visual, the 15 DAX measures and a custom colour theme as text files, so the entire dashboard is diff-able and reviewable like code. If it ever corrupts I regenerate it instead of fighting a binary .pbix. The Excel workbook is generated the same way, and refreshes off the mart in one click.' },
    { t: 'p', text: 'Two workflows run in CI. Every push builds the whole warehouse from a committed fixture and runs all 124 tests, deliberately without calling the ABS, because a pull request should fail when someone breaks a model and not when a government website has an outage. A second job runs weekly against the live API, where a failure is the notification that something upstream changed.' },
    { t: 'p', text: 'The earlier version of this project ran on Azure SQL. I tore it down on purpose: a portfolio project should not carry a monthly bill, and the cost of that decision was that the repo described a pipeline instead of being one. Rebuilding it on SQL Server in Docker means anyone can clone it and get the same marts, for nothing. The T-SQL dialect is the same one Azure SQL and Fabric speak, so pointing it back at a cloud warehouse is a config change rather than a rewrite.' },

    { t: 'h', id: 'honesty', text: 'Where the data pushes back' },
    { t: 'lede', text: 'Two things in this dataset are wrong in ways that look completely normal on a chart.' },
    { t: 'p', text: 'The ABS does not publish a seasonally adjusted series for the Northern Territory or the ACT, because those survey samples are too small to adjust. Ask the API for all eight jurisdictions on that basis and it returns six, with a 200 OK and no warning: the response is the intersection of what you asked for and what exists. The first version of this dashboard shipped a state page missing two territories, and it looked entirely normal.' },
    { t: 'note', text: 'The fix was not to backfill the two territories with a different series type, which would have produced a ranking of six seasonally adjusted numbers against two unadjusted ones. The state page now uses the Trend series, which exists for all eight, so every jurisdiction sits on one comparable basis. The trade-off, stated on the page: these rates will not match the seasonally adjusted headline rate quoted in the news. A test now fails the build if a comparison ever mixes bases again, and another fails it if a jurisdiction goes missing.' },
    {
      t: 'bars',
      title: 'Unemployment rate by state and territory, June 2026',
      unit: '%, Trend series, all eight jurisdictions',
      bars: [
        { label: 'Victoria', value: '5.00%', pct: 100, lead: true },
        { label: 'Tasmania', value: '4.95%', pct: 99 },
        { label: 'Northern Territory', value: '4.72%', pct: 94 },
        { label: 'Western Australia', value: '4.33%', pct: 87 },
        { label: 'South Australia', value: '4.19%', pct: 84 },
        { label: 'New South Wales', value: '4.15%', pct: 83 },
        { label: 'Queensland', value: '4.13%', pct: 83 },
        { label: 'Australian Capital Territory', value: '4.08%', pct: 82 },
      ],
      read: 'I expected wide regional gaps. Instead the spread across the whole country is under a single percentage point.',
    },
    {
      t: 'fig',
      src: '/projects/labour-market/pbi-state.png',
      page: 'Page 2, State Breakdown',
      alt: 'Power BI State Breakdown page: unemployment rate and employed persons ranked across all eight states and territories for the latest month, and an unemployment rate trend line per jurisdiction back to 1978.',
      caption: 'All eight jurisdictions, Northern Territory and the ACT included. The earlier version of this page showed six, because the ABS quietly returns only what exists for a seasonally adjusted request. Ranked bars rather than a map: a built-in Bing map rendered as a zoomed-out world view and read as broken.',
    },
    { t: 'p', text: 'The second is vintage. Health Care and Social Assistance is the country’s largest employer by headcount, ahead of Retail Trade, but the industry breakdown comes from the annual ABS Labour Account, which lags badly and ends at 2022 while everything else is current to June 2026.' },
    { t: 'note', text: 'I confirmed against the live API that the industry series is stale at source, not on my disk, so re-running the extract does not help. The monthly Labour Force survey carries no industry dimension at all, so there is nowhere else to get it. Rather than quietly mix a 2022 series into current numbers, every industry title carries its own vintage. Knowing a source’s recency before you build on it matters more than any chart.' },
    {
      t: 'fig',
      src: '/projects/labour-market/pbi-industry.png',
      page: 'Page 3, Industry View',
      alt: 'Power BI Industry View page: all 19 ANZSIC divisions ranked by employed persons for 2022, a focus-industries trend line for Construction, Health Care, Information Media and Retail Trade, and an industry detail table with year-on-year change and a growth classification.',
      caption: 'Health Care and Social Assistance at 2.02 million, well clear of Retail Trade. Note the chart titles: they read "2022 (’000, annual)" rather than just "Employed persons", so the vintage travels with the number instead of being buried in a footnote.',
    },
    {
      t: 'fig',
      src: '/projects/labour-market/pbi-overview.png',
      page: 'Page 1, Overview',
      alt: 'Power BI Overview page: national unemployment rate trend back to 1978, employed persons trend, and KPI cards showing 4.43% unemployment, 14,823.3 thousand employed, 67.01% participation and 64.04% employment-to-population.',
      caption: 'The national headline series, seasonally adjusted, back to February 1978. Unemployment at 4.43%, employment at a record 14.8 million, up 1.73% year on year. Both recessions and the pandemic spike are visible in the one line.',
    },
    {
      t: 'fig',
      src: '/projects/labour-market/pbi-ftpt.png',
      page: 'Page 4, Full-time vs Part-time',
      alt: 'Power BI Full-time vs Part-time page: stacked area of full-time against part-time employment since 1978, full-time and part-time share cards, full-time share by sex over time, and an employment by sex donut.',
      caption: 'Where the finding lives in the report. The by-sex lines are the same two series the analysis above decomposes: the male line falling steadily, the female line flattening and then turning up after 2017.',
    },

    { t: 'pull', text: 'The headline rate hides the composition. Who works full-time, and why that is changing, is the part that actually moved.' },

    { t: 'h', id: 'next', text: 'What is next' },
    {
      t: 'list',
      items: [
        'Separate voluntary from involuntary part-time work using the ABS underemployment series. Without it, "part-time" conflates a preference with a constraint, and that distinction decides whether the male full-time decline is a problem or a choice. It is the honest next question and the one I would ask first.',
        'Test whether the 2017 turning point is compositional. The current extract is national totals only, with no age or industry split on the full-time series, so I cannot yet rule out that it reflects a change in who is employed rather than a change in the work on offer.',
        'Replace the stale annual industry source with a quarterly Labour Force Detailed employed-by-industry series, so every page is current to the same month.',
      ],
    },
  ],
}
