import type { CaseStudyProps } from '../components/case-study'

/**
 * Woolworths vs Coles case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 */
export const grocery: CaseStudyProps = {
  kicker: 'Data story',
  hookLead: 'Neither supermarket is cheaper.',
  hookTail: 'The specials are.',
  sub: 'Same-day prices pulled from both retailers’ public web APIs, fuzzy-matched into identical product pairs, and compared in a DuckDB warehouse. Basket totals, per-100g unit prices, and the outliers worth $15.',
  meta: [
    ['Role', 'Solo build and analysis'],
    ['Stack', 'Python, DuckDB, rapidfuzz'],
    ['Source', 'Retailer web APIs, live'],
    ['Sample', '50-item basket, 104 matched pairs'],
    /* The limitation belongs beside the sample size, not four sections down.
       A single-day snapshot is the honest description of this study and it is
       also the reason its most interesting finding holds. */
    ['Scope', 'One same-day snapshot'],
    ['Built', 'Scraper, entity resolution, DuckDB warehouse'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['build', 'Matching the products'],
    ['findings', 'What the data says'],
    ['next', 'What is next'],
  ],
  links: [
    { label: 'Source and notebook', href: 'https://github.com/MelvinDY/woolworths-vs-coles-analytics', primary: true },
  ],
  nextStudy: { href: '/projects/data/saas', title: 'SaaS Sales & Revenue Analytics' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: '"Woolies is cheaper." "No, Coles is." Everyone has a confident answer and none of them have the receipts. I wanted the receipts.' },
    {
      t: 'stats',
      items: [
        { figure: '$1.82', caption: 'Gap on the full 50-item basket: $209.59 Coles against $211.41 Woolworths.' },
        { figure: '50%', caption: 'Of 104 identical products are priced exactly the same, to the cent.' },
        { figure: '$15.00', caption: 'Biggest same-day gap on a single identical product, laundry liquid.' },
      ],
    },

    { t: 'h', id: 'build', text: 'Matching the products' },
    { t: 'p', text: 'A DuckDB warehouse built from immutable raw CSVs. Staging canonicalises pack sizes into grams, millilitres or each, and normalises both retailers’ unit prices to dollars per 100g.' },
    { t: 'p', text: 'The hard part is entity resolution. Candidates are fuzzy-matched with rapidfuzz, then accepted by tier: national brands need the same brand, a pack size within 2% and a name score of 80 or better. Home brands are matched separately because they are substitutes rather than identical products. Every accepted pair carries its score, so the whole match set is auditable in SQL.' },
    { t: 'p', text: 'With identical products matched one to one, the comparison became honest: count who wins each matched pair, total the basket at both stores, and compare per-100g unit prices by category. No cherry-picked trolleys, and no comparing a 500g jar to a 375g one.' },
    { t: 'note', text: 'This is one same-day snapshot of one 50-item basket, not a longitudinal study. It says what these two stores charged on that day, which is exactly why the specials finding matters more than the basket total.' },

    { t: 'h', id: 'findings', text: 'What the data says' },
    { t: 'lede', text: 'On identical national-brand products the two chains mostly refuse to be beaten. Half the matches are priced to the cent.' },
    {
      t: 'bars',
      title: 'Who wins each matched pair',
      unit: 'count of 104 identical products',
      bars: [
        { label: 'Priced identical', value: '52', pct: 100, lead: true },
        { label: 'Coles cheaper', value: '30', pct: 58 },
        { label: 'Woolworths cheaper', value: '22', pct: 42 },
      ],
      read: 'Half the basket is a dead heat. The two chains watch each other closely enough that on identical stock they land on the same shelf price.',
    },

    { t: 'lede', text: 'The big gaps are not random. They are specials.' },
    { t: 'p', text: 'Laundry and coffee products differed by $4 to $15 on the day, depending on whose promo cycle they happened to sit in.' },
    {
      t: 'bars',
      title: 'Biggest same-product price gaps on the day',
      unit: 'identical product, AUD gap',
      bars: [
        { label: 'OMO Sensitive Laundry 2L', value: '$15.00', pct: 100, lead: true },
        { label: 'Bosisto’s Power+ Laundry 2L', value: '$9.20', pct: 61 },
        { label: 'Moccona Rich Blend 200g', value: '$8.85', pct: 59 },
        { label: 'Moccona Mocha Kenya 200g', value: '$7.10', pct: 47 },
        { label: 'Bosisto’s Sensitive Laundry 2L', value: '$6.45', pct: 43 },
        { label: 'Morning Fresh 900mL', value: '$4.25', pct: 28 },
      ],
      read: 'The same OMO bottle was $30 at Woolworths and $15 at Coles on the same day. Timing the specials on pantry and household items is where the real savings live.',
    },

    { t: 'pull', text: 'The basket total is a dead heat. The promo cycle is the whole game.' },

    { t: 'h', id: 'next', text: 'What is next' },
    {
      t: 'list',
      items: [
        'Run the pipeline on a schedule. Each run already appends a dated snapshot, so the design turns into a price-tracking time series for free.',
        'Build a basket-builder that tells you which store is cheaper for your specific shopping list this week.',
        'With history in place, detect fake specials: items marked down from an inflated shelf price they never really held.',
      ],
    },
  ],
}
