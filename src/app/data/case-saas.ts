import type { CaseStudyProps } from '../components/case-study'

/**
 * SaaS Sales and Revenue case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 *
 * The synthetic-data disclosure is promoted to a margin note rather than left
 * mid-paragraph. On a portfolio it is the single most important sentence on
 * the page, and burying it is how a reader ends up mistaking a seeded
 * generator for a real customer base.
 */
export const saas: CaseStudyProps = {
  kicker: 'Data story',
  hookLead: 'MRR said up and to the right.',
  hookTail: 'The cohort view found the leak.',
  sub: 'I built MRR, churn, NRR and CLV, the four metrics every SaaS analytics interview asks about, from raw invoices through a tested dbt pipeline. Headline growth looked healthy. Retention, split by cohort and tier, told a very different story.',
  meta: [
    ['Role', 'Solo build and analysis'],
    ['Stack', 'dbt, DuckDB, SQL'],
    ['Source', '12.5K invoices, 1,147 subscriptions'],
    /* The margin note below still does the explaining. This is the flag, in
       the sidebar, above the fold, so nobody reads three findings before
       learning what generated them. */
    ['Data', 'Synthetic, seeded generator'],
    ['Built', 'Generator, dbt models, cross-database macros'],
    ['Tests', '44 dbt data tests'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['source', 'The data'],
    ['findings', 'What the data says'],
    ['next', 'What is next'],
  ],
  links: [
    { label: 'Source and dbt project', href: 'https://github.com/MelvinDY/saas-sales-analytics', primary: true },
  ],
  nextStudy: { href: '/projects/data/labour-market', title: 'Australian Labour Market Dashboard' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: 'Every SaaS dashboard shows MRR going up. The interesting question is what is churning underneath, and that only shows up when you compute the metrics from raw invoices instead of asserting them.' },
    { t: 'p', text: 'So I built the whole thing as a warehouse-native pipeline: two raw datasets, B2B order transactions and a subscription lifecycle table, flowing through a dbt staging to intermediate to marts architecture into a four-page dashboard whose centrepiece is a cohort retention heatmap.' },
    {
      t: 'stats',
      items: [
        { figure: '$520K', caption: 'MRR at June 2026, growing 5.1% month on month.' },
        { figure: '44', caption: 'dbt data tests guarding sources, grains and metric logic.' },
        { figure: '4×', caption: 'Faster churn on the Basic tier than Enterprise, trailing 12 months.' },
      ],
    },

    { t: 'h', id: 'source', text: 'The data' },
    { t: 'p', text: '12.5K invoices and 1,147 subscriptions land as dbt sources with tested contracts, and every mart is guarded by a grain test: 44 data tests, 52 of 52 building green, every column documented.' },
    { t: 'p', text: 'The metrics are computed rather than asserted. The MRR bridge decomposes each month into new, expansion, contraction and churned per customer, and the identity holds exactly: this month equals last month plus net new. NRR uses the 12-month cohort definition, and CLV ships both realized and predictive variants. Models compile on DuckDB locally and on BigQuery unchanged, via cross-database macros.' },
    { t: 'note', text: 'The data itself is synthetic: a seeded generator encoding real SaaS dynamics, with a swap-in script for the equivalent Kaggle datasets. The pipeline is the product here, not the numbers. Every figure on this page describes the generated dataset, not a real customer base.' },

    { t: 'h', id: 'findings', text: 'What the data says' },
    { t: 'lede', text: 'Retention stops being one number once you have a customer by month revenue spine. It becomes a surface, and the surface disagrees with the headline chart.' },
    {
      t: 'bars',
      title: 'Net revenue retention by plan tier',
      unit: '% of year-ago revenue retained',
      bars: [
        { label: 'Pro', value: '103%', pct: 100, lead: true },
        { label: 'Enterprise', value: '90%', pct: 87 },
        { label: 'Basic', value: '68%', pct: 66 },
      ],
      read: 'Pro’s seat expansion outpaces its churn, which is what NRR above 100% means. Basic keeps only 68% of its year-ago revenue and churns about four times faster than Enterprise, at 6.2% a month against 1.4%.',
    },

    { t: 'lede', text: 'The discount promo filled the funnel with customers who left.' },
    { t: 'p', text: 'The May to July 2024 discount-promo cohorts kept just 37 to 49% of customers at month six, against roughly 71 to 79% for the cohorts either side. Cheap signups, expensive churn.' },
    {
      t: 'bars',
      title: 'Customers still active at month six, by signup cohort',
      unit: '% of cohort retained',
      bars: [
        { label: 'Mar 2024', value: '79%', pct: 100 },
        { label: 'Apr 2024', value: '75%', pct: 95 },
        { label: 'May 2024, promo', value: '49%', pct: 62, lead: true },
        { label: 'Jun 2024, promo', value: '37%', pct: 47, lead: true },
        { label: 'Jul 2024, promo', value: '43%', pct: 54, lead: true },
        { label: 'Aug 2024', value: '74%', pct: 94 },
      ],
      read: 'The promo quarter’s cohorts fall off a cliff by month six while every neighbouring cohort holds. On the full heatmap it reads as a dark horizontal band straight across the promo months.',
    },

    { t: 'pull', text: 'The cheapest customers turned out to be the most expensive. The discount promo filled the funnel, and the cohort view watched it drain.' },

    { t: 'h', id: 'next', text: 'What is next' },
    {
      t: 'list',
      items: [
        'Deploy the documented cloud path: the same dbt models on BigQuery, surfaced in Looker Studio.',
        'Swap the seeded generator for the real Kaggle datasets. The source tests already enforce the schema contract either way.',
        'Build the activity spine from coverage windows instead of invoices, so annual-prepay customers are handled correctly.',
      ],
    },
  ],
}
