/**
 * The four data case studies, in the form the index page renders them.
 *
 * Every figure and claim is carried over from copy that was already on the
 * site or from the case studies themselves. Nothing is invented: these are
 * findings on a portfolio, and a rounded-up number is worse than no number.
 *
 * The figure is split from its claim because that split is the material the
 * index is built out of. The page sets the figure at display scale and reads
 * the claim as the sentence that follows it.
 */

export interface Method {
  source: string
  transform: string
  output: string
}

export interface DataEntry {
  id: string
  title: string
  /** What kind of work this is, in a few words. */
  sub: string
  /** The headline figure, already formatted. */
  figure: string
  /** The claim the figure supports. Reads as a sentence after the figure. */
  claim: string
  blurb: string
  stack: string[]
  href: string
  method: Method
  shots: { src: string; alt: string; caption: string }[]
}

export const entries: DataEntry[] = [
  {
    id: 'labour-market',
    title: 'Australian Labour Market Dashboard',
    sub: 'End to end pipeline on live ABS data',
    figure: '80%',
    claim: 'of working men hold a full-time job. For women it is 57%.',
    blurb:
      'Python ingests live ABS data, Azure SQL models it through a staging to mart layer, and a four-page Power BI report visualises it. The report is generated as code rather than clicked together.',
    stack: ['ABS API', 'Azure SQL', 'Power BI', 'DAX', 'Python'],
    href: '/projects/data/labour-market',
    method: {
      source: 'ABS API, refreshed on release',
      transform: 'Azure SQL, staging to mart',
      output: 'Power BI, generated as code',
    },
    shots: [
      {
        src: '/projects/labour-market/pbi-overview.png',
        alt: 'Power BI overview page showing national labour force headline measures.',
        caption: 'Overview page. Headline measures across the national series.',
      },
      {
        src: '/projects/labour-market/pbi-ftpt.png',
        alt: 'Power BI page comparing full-time and part-time employment by sex.',
        caption: 'Full-time against part-time, split by sex. This is where the 80 against 57 sits.',
      },
      {
        src: '/projects/labour-market/pbi-industry.png',
        alt: 'Power BI page breaking employment down by industry.',
        caption: 'Industry breakdown.',
      },
      {
        src: '/projects/labour-market/pbi-state.png',
        alt: 'Power BI page breaking employment down by state and territory.',
        caption: 'State and territory view.',
      },
    ],
  },
  {
    id: 'youtube',
    title: 'YouTube Trending Analytics',
    sub: 'Forensics on 40,000 trending videos',
    figure: '38 hrs',
    claim: 'is how long the average video survives on the Trending page before it vanishes.',
    blurb:
      'Forty thousand trending videos across ten regions: what actually predicts a spot on the board, how long a video holds it, and which signals turn out to be noise.',
    stack: ['YouTube API', 'pandas', 'scikit-learn', 'Plotly'],
    href: '/projects/data/youtube',
    method: {
      source: 'YouTube Data API, 10 regions',
      transform: 'pandas, then scikit-learn',
      output: 'Plotly notebooks',
    },
    shots: [],
  },
  {
    id: 'grocery',
    title: 'Woolworths vs Coles Price Analytics',
    sub: 'Same-day basket comparison',
    figure: '$1.82',
    claim: 'separates a 50-item basket at the two retailers. Half of 104 matched products cost exactly the same.',
    blurb:
      'Same-day prices from both retailers public web APIs, fuzzy-matched into identical product pairs and compared in a DuckDB warehouse: basket totals, per-100g unit prices, and the outliers worth $15.',
    stack: ['Python', 'DuckDB', 'rapidfuzz', 'Entity resolution'],
    href: '/projects/data/grocery',
    method: {
      source: 'Two retailer web APIs, same day',
      transform: 'rapidfuzz pairing into DuckDB',
      output: 'Basket and unit-price comparison',
    },
    shots: [],
  },
  {
    id: 'saas',
    title: 'SaaS Sales & Revenue Analytics',
    sub: 'Cohort retention from 12.5K invoices',
    figure: '37%',
    claim: 'of the discount-promo cohort was still a customer at month six. Neighbouring cohorts kept about 71%.',
    blurb:
      'MRR, churn, NRR and CLV computed from 12,500 invoices through a tested dbt pipeline of eight models and forty-four data tests, with a cohort retention heatmap as the centrepiece.',
    stack: ['dbt', 'SQL', 'DuckDB', 'BigQuery'],
    href: '/projects/data/saas',
    method: {
      source: '12,500 invoices',
      transform: 'dbt, 8 models and 44 tests',
      output: 'Cohort retention heatmap',
    },
    shots: [],
  },
]

/** 17 words. Section 4.7 caps hero subtext at 20. The live page runs 40. */
export const HERO_SUB =
  'Four questions I could not stop poking at. Each one written finding first, with the working underneath.'
