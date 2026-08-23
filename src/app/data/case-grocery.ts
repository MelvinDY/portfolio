import type { CaseStudyProps } from '../components/case-study'

/**
 * Woolworths vs Coles case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 *
 * v5, 2026-08-23. Rewritten in the vocabulary a pricing team actually uses:
 * parity rate, mean absolute gap, promotion frequency and depth, gap
 * persistence, reference-price integrity, and the price-visible / price-opaque
 * split (known value items against the long tail). The measures did not change;
 * the names did, so the page reads as competitor benchmarking rather than as a
 * curiosity about groceries.
 *
 * Deliberately no `note` blocks on this page: the shared component labels every
 * one of them "Honest note", and a column of them reads as apology rather than
 * as method. The standing caveat paragraphs went with them. Nothing here claims
 * elasticity, transacted prices or multi-location coverage in the first place,
 * so removing the disclaimers took out repetition rather than accuracy, and
 * every figure still traces to the warehouse.
 *
 * Scope stays where a reader meets it early and reads it as bounding rather
 * than hedging: the meta block, and the effective-sample paragraph in `build`.
 *
 * Every figure is from the warehouse as at the 2026-08-23 collection, rebuilt
 * over all stored days. The one exception is the Grocery Price Index section,
 * which is third-party data and is labelled as such wherever it appears.
 */
export const grocery: CaseStudyProps = {
  kicker: 'Data story',
  hookLead: 'Competition is fierce where it is watched',
  hookTail: 'and absent where it is not.',
  sub: 'Competitor benchmarking on public data: prices pulled daily from both retailers’ web APIs, matched into identical product pairs, and tracked in a dbt warehouse. Parity rate, mean absolute gap, promotion frequency and depth, and whether a price difference is a promotion or a position.',
  meta: [
    ['Role', 'Solo build and analysis'],
    ['Stack', 'Python, dbt, DuckDB, rapidfuzz'],
    ['Source', 'Retailer web APIs, collected daily'],
    ['Sample', '50-line basket, 128 matched pairs'],
    /* The scope belongs beside the sample size, not four sections down. Ten
       days bounds every history measure further down, so a reader should meet
       it before the findings rather than after them. */
    ['Scope', '10 collected days, 15 Jul to 23 Aug 2026'],
    ['Built', 'Collector, entity resolution, dbt warehouse with SCD2 history'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['build', 'Building the series'],
    ['matching', 'The matching layer'],
    ['findings', 'The measures'],
    ['backdrop', 'The longer view'],
    ['close', 'What it measures'],
  ],
  links: [
    { label: 'Source and pipeline', href: 'https://github.com/MelvinDY/woolworths-vs-coles-analytics', primary: true },
  ],
  nextStudy: { href: '/projects/data/saas', title: 'SaaS Sales & Revenue Analytics' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: '"Woolies is cheaper." "No, Coles is." Everyone has a confident answer and none of them have the receipts. I wanted the receipts.' },
    { t: 'p', text: 'A supermarket shelf price is off-contract market pricing. Nobody negotiated it, no schedule fixes it, and it is set mostly against what the shop across the road is doing. That makes the comparison a competitor benchmarking problem rather than a curiosity about groceries, and it is why the measures on this page are the ones a pricing team would recognise: parity rate, mean absolute gap, promotion frequency and depth, gap persistence, and reference-price integrity.' },
    { t: 'p', text: 'The first version answered the question for a single day, and the answer was a dead heat. That turned out to be the least interesting thing in the data. The question worth asking is not which chain is cheaper this morning but which lines the two chains are willing to compete on at all, because those are not the same list and the difference is where the money sits.' },
    {
      t: 'stats',
      items: [
        { figure: '7.1%', caption: 'Parity rate in household, against 62.5% in pantry. Same two retailers, same morning.' },
        { figure: '100%', caption: 'Reference-price integrity: every advertised “was” price tested against a price observed beforehand.' },
        { figure: '39 of 44', caption: 'Promotions that ended returned to baseline. Median depth 41%, median run 7 days.' },
      ],
    },

    { t: 'h', id: 'build', text: 'Building the series' },
    { t: 'p', text: 'A collector runs daily and writes one immutable CSV per day. That file is the asset: a price snapshot cannot be backfilled, so every morning the collector does not run is a day of history nobody can recover. The warehouse is a build artifact and is not committed. The raw days are, and they are.' },
    {
      t: 'flow',
      items: [
        { stage: 'Collect', tool: 'Python, requests', what: 'two retailer JSON APIs, one dated CSV per day' },
        { stage: 'Load', tool: 'pandas', what: 'CSVs landed as a tested dbt source with a freshness check' },
        { stage: 'Stage', tool: 'dbt', what: 'pack sizes canonicalised, unit prices rebased to per 100g' },
        { stage: 'Screen', tool: 'dbt', what: 'coverage and per-line relevance rules applied before any total' },
        { stage: 'Track', tool: 'dbt snapshot', what: 'SCD2 on price, was-price and the promotion flag' },
        { stage: 'Match', tool: 'rapidfuzz', what: 'identical products paired across the two catalogues' },
        { stage: 'Model', tool: 'dbt', what: 'six marts, incremental history, grain tested on every one' },
      ],
    },
    { t: 'p', text: 'Price history is modelled as a slowly changing dimension rather than a pile of daily rows. A product whose price holds for six weeks is one record with a six week validity window, and a price change closes one record and opens the next. Historical days are replayed one at a time, so a change is dated the day the price actually moved rather than the afternoon the model was built.' },
    { t: 'p', text: 'That structure also gives the right sample size. The collection produced 19,443 row-days, but a price sitting unchanged for nine days is one event rather than nine, so the effective sample is the 1,219 observed price changes underneath it, across 2,035 products. That is the number every history measure below rests on.' },
    { t: 'p', text: 'The matched-pair history is incremental: a day’s run touches a day’s rows. That is a claim, so a script checks it, by deleting the last two days, replaying them, and asserting the result is identical to a full rebuild. An incremental model whose answer depends on how many times it has been run is a bug you find months later, in public.' },
    { t: 'p', text: 'One rule governs everything downstream: a day nobody collected is never filled in. A product missing from a day’s search results does not close its history record, because it has not been discontinued and its price has not changed. Nobody looked. The matched-pair series leaves that day null and flags it, a data test enforces that the flag and the nulls agree, and the dashboard draws those stretches dashed rather than joining them with a confident straight line. Inventing continuity is how a price series starts lying.' },

    { t: 'h', id: 'matching', text: 'The matching layer' },
    { t: 'p', text: 'Mapping a line to the right competitor SKU is the hard part, and it is the part that transfers. Candidates are generated within the same search term, fuzzy-matched with rapidfuzz, then accepted by tier: national brands need the same brand, a pack size within 2% and a name score of 80 or better. Home brands are matched separately, as substitutes rather than as identical products, because treating a private label as the same SKU is how a benchmark quietly becomes a comparison of two different things.' },
    { t: 'p', text: 'Assignment is greedy and one to one, and every accepted pair carries its similarity score, so any pair can be pulled up and shown why it was accepted. That is the difference between a rule and an override: the rule decides which lines get benchmarked, and the score is the audit trail. Overrides are what happen when nobody wrote the rule down.' },
    { t: 'p', text: 'The same discipline applies to what enters a basket line at all. A retailer’s search endpoint is a ranking API, not an inventory feed, and it will return something that is not the product without raising an error. Lines therefore carry identity rules on name and unit-price basis rather than a plausible-price band, because a screen that filters on price can silently discard the price movement the study exists to measure.' },
    { t: 'p', text: 'Porting the original SQL into dbt came with one hard rule: it could change how the marts are built and not what they contain. Every mart was reconciled row for row against the pre-port output before the old models were deleted. Nothing moved.' },

    { t: 'h', id: 'findings', text: 'The measures' },
    { t: 'lede', text: 'Parity rate first. On identical national-brand products the two chains mostly refuse to be beaten, and 43% of pairs match to the cent.' },
    {
      t: 'bars',
      title: 'Who wins each matched pair',
      unit: 'count of 128 identical products, 23 Aug',
      bars: [
        { label: 'Parity, to the cent', value: '55', pct: 100, lead: true },
        { label: 'Coles cheaper', value: '37', pct: 67 },
        { label: 'Woolworths cheaper', value: '36', pct: 65 },
      ],
      read: 'The parity rate is stable, holding between 39.5% and 43.0% on every August day in the series. The basket total disagrees with the pair count and neither is wrong: the basket takes the cheapest available item per line, the pairs count only products both chains stock in the same size. Coles took the basket on 9 of the 10 days, by $13.92 on the most recent.',
    },

    { t: 'lede', text: 'That headline rate hides the finding. Split the same pairs by aisle and they come apart.' },
    {
      t: 'bars',
      title: 'Parity rate by aisle',
      unit: 'share of matched pairs priced identically, 23 Aug',
      bars: [
        { label: 'Pantry', value: '62.5%', pct: 100, lead: true },
        { label: 'Dairy', value: '53.3%', pct: 85 },
        { label: 'Snacks', value: '47.4%', pct: 76 },
        { label: 'Personal care', value: '40.0%', pct: 64 },
        { label: 'Frozen', value: '37.5%', pct: 60 },
        { label: 'Produce', value: '30.0%', pct: 48 },
        { label: 'Drinks', value: '9.1%', pct: 15 },
        { label: 'Household', value: '7.1%', pct: 11 },
      ],
      read: 'Pantry is matched nine times more often than household. The trade has a name for the exposed end: known value items, the lines a shopper can price from memory. Price perception for the whole store is built on them, so they get matched to the cent. Everything else is the long tail, where nobody has a reference price to be offended by.',
    },
    {
      t: 'bars',
      title: 'Mean absolute gap by aisle',
      unit: 'AUD per matched pair, 23 Aug',
      bars: [
        { label: 'Household', value: '$8.62', pct: 100, lead: true },
        { label: 'Personal care', value: '$2.63', pct: 31 },
        { label: 'Snacks', value: '$1.54', pct: 18 },
        { label: 'Pantry', value: '$1.36', pct: 16 },
        { label: 'Frozen', value: '$0.95', pct: 11 },
        { label: 'Produce', value: '$0.78', pct: 9 },
        { label: 'Dairy', value: '$0.77', pct: 9 },
        { label: 'Drinks', value: '$0.54', pct: 6 },
      ],
      read: 'The two charts are the same story twice. Household sits at the bottom of one and the top of the other, with a gap six times pantry’s. This is the price-visible and price-opaque split: a small benchmarked head that sets what customers believe about you, and a long tail that nobody checks. The gap is a mean of line-level differences and is not revenue-weighted, so it describes the shelf rather than the till.',
    },
    { t: 'p', text: 'Drinks is the cell that does not fit, and it is worth keeping rather than smoothing. It has the second-lowest parity rate and the smallest gap of any aisle, which says exposure and matching are two axes rather than one: two retailers can track each other closely without ever landing on the same number. A two-bucket model cannot represent that, and the right response is to refine the model rather than defend it.' },

    { t: 'lede', text: 'Promotion frequency and depth. The two chains run visibly different promotional machines.' },
    { t: 'p', text: 'Averaged across the collected days, Woolworths flags 14.8% of the catalogue on promotion at any one time, against Coles’ 1.7%. The relationship inverts on depth: where a promotion is a genuine cut, the median observed discount is 41.0% at Coles against 35.1% at Woolworths. Coles promotes rarely and deeply, Woolworths often and shallowly, which is a promotional-planning difference rather than a pricing one.' },

    { t: 'lede', text: 'Reference-price integrity, and the question a single snapshot cannot reach.' },
    { t: 'p', text: 'From one day you can see that a product is flagged on promotion and what the retailer claims it used to cost. You cannot see whether the price actually fell, because you were not there yesterday. Across 203 promotion episodes, 121 began on a day the product had already been priced here.' },
    {
      t: 'bars',
      title: 'What the promotion flag did to the price',
      unit: '121 episodes with an observable baseline',
      bars: [
        { label: 'Price fell', value: '104', pct: 100, lead: true },
        { label: 'Price rose', value: '11', pct: 11 },
        { label: 'Price unchanged', value: '6', pct: 6 },
      ],
      read: 'Seventeen of 121 promotions moved the price the wrong way or not at all, and all seventeen were at Coles, whose 17 genuine cuts are outnumbered by Woolworths’ 87. The clearest case: four Schweppes mineral waters at $3.00, flagged on promotion at $3.30.',
    },
    { t: 'p', text: 'The obvious next suspicion is inflated reference pricing, a "was" price the retailer never really charged. That one does not hold. Of the 100 episodes carrying both an advertised was-price and an earlier observation of my own to test it against, all 100 matched: reference-price integrity of 100%. This is not fake was-prices. It is the promotion flag and the shelf price being managed separately, which is a duller finding and a truer one.' },

    { t: 'lede', text: 'Promotion or position. The single question the snapshot cannot answer.' },
    {
      t: 'bars',
      title: 'What happened when a promotion ended',
      unit: '44 episodes with a price observed on both sides',
      bars: [
        { label: 'Returned to baseline', value: '39', pct: 100, lead: true },
        { label: 'Held below baseline', value: '5', pct: 13 },
      ],
      read: 'A promotion on these shelves is deep and brief and then it is over: median 41% off, median run of 7 days, ending where it started. Nine in ten are a promotional cycle rather than a price change, which is the difference between timing your shop and switching your shop.',
    },
    { t: 'p', text: 'Run the same question at the pair level and it answers differently. Of the pairs observed on at least five days, 63 opened with a gap wider than 5%, and 51 of them, 81%, were still wider than 5% on the last day observed. Gaps between the two retailers mostly do not close. That persistence barely moves between the buckets, 82% in the price-opaque aisles against 80% in the price-visible ones, so the split governs whether the two chains match at all rather than how quickly they correct once they differ.' },
    {
      t: 'bars',
      title: 'Largest same-product gaps',
      unit: 'identical product, AUD, 23 Aug',
      bars: [
        { label: 'OMO Sensitive Laundry 2L', value: '$15.00', pct: 100, lead: true },
        { label: 'Cold Power 2L, five variants', value: '$13.00', pct: 87 },
        { label: 'Moccona 200g, two variants', value: '$9.60', pct: 64 },
        { label: 'Bosisto’s Power Plus 2L, three', value: '$9.20', pct: 61 },
        { label: 'Bosisto’s Sensitive Laundry 2L', value: '$6.50', pct: 43 },
        { label: 'Colgate Total 200g, five variants', value: '$5.50', pct: 37 },
        { label: 'Morning Fresh 900mL, five', value: '$5.00', pct: 33 },
      ],
      read: 'The same OMO bottle was $30 at Woolworths and $15 at Coles on the same day. Every line here is laundry, coffee, toothpaste or dish soap, and not one is a known value item. Variants sharing an identical gap are grouped because a whole range goes on promotion at once, which is the actual unit of decision: you are not timing a product, you are timing a range.',
    },

    { t: 'pull', text: 'The basket total is a coin toss. The promotional cycle and the tail are the whole game.' },

    { t: 'h', id: 'backdrop', text: 'The longer view' },
    { t: 'p', text: 'For the longer horizon, Savings.com.au has run a monthly Coles-versus-Woolworths index since late 2023, pricing a fixed basket at both chains and publishing the annual movement. It is not my data, not my basket and the methodology is theirs, so it sits here as context and nothing above is derived from it.' },
    {
      t: 'line',
      title: 'Australian grocery inflation, both chains averaged',
      unit: 'annual change in basket cost, %. Source: Savings.com.au Grocery Price Index',
      pts: [
        [0.0, 0.730], [0.05, 0.737], [0.10, 0.848], [0.15, 0.908], [0.20, 0.662],
        [0.25, 0.639], [0.30, 0.669], [0.35, 0.667], [0.40, 0.757], [0.45, 0.796],
        [0.50, 0.544], [0.55, 0.406], [0.60, 0.377], [0.65, 0.221], [0.70, 0.178],
        [0.75, 0.285], [0.80, 0.203], [0.85, 0.114], [0.90, 0.316], [0.95, 0.357],
        [1.0, 0.138],
      ],
      xLabels: ['Nov ’24', 'Sep ’25', 'Jul ’26'],
      yTop: '10%',
      read: 'Grocery inflation peaked above 9% in February 2025 and had cooled to 1.38% by July 2026. That frames everything above: the basket gap measured here moves around inside a market that is close to flat, so it is competitive noise rather than a cost-of-living signal.',
    },
    { t: 'p', text: 'Their July 2026 basket came to $262.02 at Coles and $261.27 at Woolworths, 75 cents apart on roughly $260. Different basket, different method, two and a half years of history against my ten days, and the same conclusion: at the level of the whole shop there is nothing to choose between them. That is the strongest external check available on the one finding here I would most want to be wrong about. Figures read from their index on 23 August 2026, covering November 2023 to July 2026.' },

    { t: 'h', id: 'close', text: 'What it measures' },
    { t: 'p', text: 'This is a study of retailer behaviour. It measures how two chains price against each other in public: where they match, by how much they differ, how often and how deeply they promote, and whether a difference closes or holds. Behaviour is the useful signal here, because what each retailer chooses to match is a direct read on which lines it believes are competitive.' },
    { t: 'p', text: 'The answer it produces is a shape rather than a verdict. There is a small benchmarked head where the two chains track each other to the cent and earn almost nothing, and a long tail where a gap can sit for weeks because nobody is checking. Knowing which line is which, and being able to prove it rather than assert it, is the work. The same shape holds anywhere prices are set against a competitor rather than fixed by a contract, which is what makes the method portable off the supermarket shelf.' },
    { t: 'p', text: 'The measure I would add next is follow latency: the number of days before one retailer answers the other’s move. It reads competitive intensity more directly than parity does, because parity tells you where two chains have landed and latency tells you how hard they are watching. On this split it should separate the head from the tail sharply, and it is the natural next thing this warehouse is already shaped to compute.' },
  ],
}
