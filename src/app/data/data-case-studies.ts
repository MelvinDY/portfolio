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

/**
 * Where a study's numbers came from, stated on the index rather than left for
 * the reader to work out.
 *
 * Every case study already discloses this honestly, but the disclosures sit
 * mid-page, which means a reader scanning the index has to guess. A reader who
 * has to ask whether the data is real has already marked it down. Three of the
 * four are live sources; labelling the one synthetic set next to them is what
 * makes the other three credible.
 */
export interface Provenance {
  label: string
  /** False only for generated data. Drives the label's colour, not its wording. */
  real: boolean
}

export interface DataEntry {
  id: string
  title: string
  /** What kind of work this is, in a few words. */
  sub: string
  provenance: Provenance
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
    provenance: { label: 'Live ABS API', real: true },
    figure: '2017',
    claim: 'the year the gender full-time gap started closing for a different reason.',
    blurb:
      'Python ingests live ABS data, dbt models it into a tested star schema on SQL Server, and Power BI and Excel read the mart on top. Built to answer a question, not just move rows: the gap between male and female full-time work is closing, but the obvious explanation for why is wrong.',
    stack: ['ABS API', 'dbt', 'SQL Server', 'Power BI', 'Excel', 'Python'],
    href: '/projects/data/labour-market',
    method: {
      source: 'ABS API, refreshed on release',
      transform: 'dbt star schema, 124 tests',
      output: 'Power BI and Excel, generated as code',
    },
    shots: [
      {
        src: '/projects/labour-market/ft-gap-convergence.png',
        alt: 'Line chart of full-time share of employment by sex from 1978 to 2026, showing the male rate falling and the female rate bottoming out in 2017 before rising.',
        caption: 'The finding. Women’s full-time rate fell for 39 years, bottomed in 2017, and has risen since.',
      },
      {
        src: '/projects/labour-market/ft-gap-decomposition.png',
        alt: 'Bar chart of the change in full-time share for men and women across five eras, with the 2017 to 2026 female bar the only positive one.',
        caption: 'Which side moved the gap, by era. The last bar is the only time women’s rate rose.',
      },
      {
        src: '/projects/labour-market/pbi-overview.png',
        alt: 'Power BI overview page showing national labour force headline measures.',
        caption: 'Overview page. Headline measures across the national series.',
      },
      {
        src: '/projects/labour-market/pbi-state.png',
        alt: 'Power BI State Breakdown page: unemployment rate and employment ranked across all eight states and territories, plus a per-jurisdiction trend line.',
        caption: 'All eight jurisdictions. The earlier version showed six, because the ABS returns only what exists and says nothing about the rest.',
      },
      {
        src: '/projects/labour-market/pbi-ftpt.png',
        alt: 'Power BI page comparing full-time and part-time employment by sex.',
        caption: 'Full-time against part-time, split by sex. This is where the gap sits in the report.',
      },
      {
        src: '/projects/labour-market/pbi-industry.png',
        alt: 'Power BI Industry View page: 19 ANZSIC divisions ranked by employment for 2022, a focus-industries trend line, and an industry detail table.',
        caption: 'Industry breakdown. Annual to 2022, and every title says so rather than hiding it in a footnote.',
      },
    ],
  },
  {
    id: 'youtube',
    title: 'YouTube Trending Analytics',
    sub: 'Forensics on 40,000 trending videos',
    provenance: { label: 'YouTube Data API, 40k rows', real: true },
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
    sub: 'Ten-day price series, two retailers',
    provenance: { label: 'Live retailer APIs, 10 days to 23 Aug 2026', real: true },
    figure: '39 of 44',
    claim: 'promotions that ended went straight back to the price they started at. The median one was 41% off and lasted a week.',
    blurb:
      'Prices pulled daily from both retailers public web APIs, fuzzy-matched into identical product pairs and tracked over time in a dbt warehouse: where the two chains match to the cent, where they do not bother, and what a price does once the promo badge appears.',
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
    provenance: { label: 'Synthetic, seeded generator', real: false },
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
