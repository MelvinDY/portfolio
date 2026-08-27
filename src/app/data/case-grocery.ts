import type { CaseStudyProps } from '../components/case-study'

/**
 * Woolworths vs Coles case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 *
 * v6, 2026-08-27. Two changes. The basket figure is CORRECTED: it read $13.92
 * in Coles' favour on 9 of 10 days, and the basket had been taking the cheapest
 * hit per line without checking its pack size, which hit 35.9% of sized Coles
 * lines against 3.1% at Woolworths and almost always toward smaller, cheaper
 * packs. Corrected, the two chains are level and Woolworths averages $6.47
 * cheaper. The correction is stated on the page rather than quietly applied,
 * because how it was found is worth more than the number. No matched-pair
 * figure moved: the matcher always enforced pack size within 2%.
 *
 * v7, 2026-08-27. The panel now runs over the FULL source history, Sep 2023 to
 * Aug 2026, not the twelve months it launched with. Eligibility and window had
 * been driven by one date, so widening the window also demanded every pair span
 * it, which left 67 pairs out of 1,523. Separated -- a product needs a year of
 * history to be matchable, each matched pair is then measured over every day it
 * has -- the same 1,523 pairs carry 775,418 pair-days rather than 557,418.
 * Every finding held and several sharpened. Two charts added on the strength of
 * it: the distribution of gap size, which turns out to be bimodal with almost
 * nothing between 1% and 5%, and the monthly repricing rate, where the floor of
 * all three years is December.
 *
 * Added earlier: the `panel` section itself. History backfilled from an open
 * price tracker keyed on the same retailer product ids and verified against this
 * project's own days at 99.97%, the store-brand against name-brand split, and a
 * pre-registered test scored against predictions committed before any
 * bucket-level figure existed. Full write-ups live in the repo, in
 * docs/data_quality.md, docs/preregistration.md and docs/results_bucket_test.md.
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
    ['Sample', '48-line basket, 128 matched pairs, 1,523 backfilled pairs, 775k pair-days'],
    /* The scope belongs beside the sample size, not four sections down. The
       collected days bound the promotion and reference-price measures, and the
       backfilled years bound the rest, so a reader should meet both before the
       findings rather than after them. */
    ['Scope', '13 collected days, plus 3 backfilled years to 27 Aug 2026'],
    ['Built', 'Collector, entity resolution, dbt warehouse with SCD2 history'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['build', 'Building the series'],
    ['matching', 'The matching layer'],
    ['findings', 'The measures'],
    ['panel', 'Three years, and a test'],
    ['backdrop', 'The longer view'],
    ['close', 'Conclusion'],
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
    { t: 'p', text: 'Every figure below is computed in the warehouse from the collected days, and rebuilt from the raw CSVs on every run. The definitions matter more than the numbers, because a reader who cannot tell what a measure counts cannot tell whether it is being counted honestly, so they are stated here rather than left implied.' },
    {
      t: 'list',
      items: [
        'Matched pair. The same product at both chains: equal brand, pack size within 2%, and a fuzzy name score of 80 or better. Home brands are matched only against each other, as substitutes rather than as the same product. Every accepted pair keeps its score, so any pair can be pulled up and shown why it was accepted.',
        'Parity rate. The share of matched pairs priced identically to the cent at both chains on the same day. Not within a tolerance: equal.',
        'Mean absolute gap. The mean of the absolute dollar difference across matched pairs in an aisle. It weights every pair equally, so it describes the shelf rather than the till, and a dear line nobody buys counts as much as milk.',
        'Basket total. The cheapest hit per basket line, restricted to lines where both chains stock the size the line asks for, summed across 48 comparable lines. Lines with no size match at one chain leave the basket rather than being compared across different sizes.',
        'Promotion episode. A run of consecutive collected days on which the retailer’s own promotion flag is set for a product. Depth is measured against the price this collector observed before the run began, not against the advertised was-price.',
        'Reference-price integrity. The share of advertised was-prices that match a price this collector actually observed on an earlier day. Only episodes with an earlier observation of my own can be tested, so the denominator is 100, not 203.',
        'Repricing rate. Over the backfilled year, the share of pair-days on which either chain moved its price by at least half a cent. This is the effective sample size for the brand-tier comparison: a price sitting still for nine days is one event, not nine.',
        'Gap episode. A run of consecutive days on which the two prices differ by more than 5% of their mean, in the same direction. It closes when the gap narrows to 5% or less while both prices are still being observed; a run reaching the last observed day is open, and its length is a lower bound rather than a measurement.',
      ],
    },
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
      read: 'The parity rate is stable, holding between 39.5% and 43.0% on every August day in the series. The basket total disagrees with the pair count and neither is wrong: the basket takes the cheapest available item per line, the pairs count only products both chains stock in the same size. On the basket the two chains are level, 48 comparable lines coming to $190.71 at Coles against $191.47 at Woolworths.',
    },

    { t: 'p', text: 'That basket figure is a correction. It previously read $13.92 in Coles’ favour, with Coles taking 9 of the 10 days, and the reason it was wrong is worth more than the number. The basket took the cheapest hit per line without ever checking that the hit was the size the line asked for, so a 2L milk line could be priced on a 1L bottle and a 1kg carrot line on a 170g pack.' },
    { t: 'p', text: 'The error was not symmetric, which is what made it dangerous rather than merely noisy. It hit 35.9% of sized Coles lines against 3.1% at Woolworths, almost always toward smaller and therefore cheaper packs, applying a systematic discount to exactly the side the finding named as cheaper. Corrected, Coles takes 4 of the 10 days and Woolworths averages $6.47 cheaper. Not one matched-pair figure on this page moved, because the matcher has always enforced pack size within 2%: the careful component was right and the crude one was on the front page.' },
    {
      t: 'line',
      title: 'Who is cheaper, day by day',
      unit: 'basket total, Woolworths minus Coles, AUD. 12 collected days, 12 to 27 Aug 2026',
      yTop: 'Coles cheaper by $10',
      yBottom: 'Woolworths cheaper by $20',
      baseline: 0.6667,
      baselineLabel: 'level',
      pts: [
        [0.0, 0.1673], [0.0667, 0.1723], [0.1333, 0.1723], [0.2667, 0.1773],
        [0.4, 0.2023], [0.4667, 0.9077], [0.5333, 0.9077], [0.6, 0.7787],
        [0.7333, 0.692], [0.8, 0.6903], [0.8667, 0.8137], [1.0, 0.0233],
      ],
      xLabels: ['12 Aug', '19 Aug', '27 Aug'],
      read: 'The line crosses zero twice in a fortnight. Woolworths holds a $15 lead for a week, Coles takes it by $7 overnight on 19 August, the two converge to within 71 cents by the 24th, and Woolworths reopens a $19 lead on the 27th. This is what the corrected basket looks like as a series rather than as a sentence, and it is the strongest argument against quoting any single day: pick your morning and this data will tell you either chain is cheaper by up to $19. Points are spaced by date, so the flat runs are days apart rather than consecutive. The 15 July snapshot is deliberately off this chart, because a four-week collection hole sits between it and 12 August and drawing a line across a gap nobody observed is the one thing this project refuses to do anywhere else. The last point prices 47 lines rather than 48, Woolworths having returned no qualifying carton of eggs that morning; on the 47 lines common to both days the swing is the same, from plus $2.51 to minus $19.30.',
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
    { t: 'p', text: 'Run the same question at the pair level and it answers differently. Of the pairs observed on at least five days, 63 opened with a gap wider than 5%, and 51 of them, 81%, were still wider than 5% on the last day observed. Over this window gaps mostly do not close, though that turns out to be a fact about the window rather than about the gaps, and the year-long series below settles it. That persistence barely moves between the buckets, 82% in the price-opaque aisles against 80% in the price-visible ones, so the split governs whether the two chains match at all rather than how quickly they correct once they differ.' },
    {
      t: 'bars',
      title: 'Largest same-product gaps',
      unit: 'identical product, AUD, 23 Aug',
      bars: [
        { label: 'OMO Sensitive Laundry 2L', value: '$15.00', pct: 100, lead: true },
        { label: 'Cold Power 2L (5 variants)', value: '$13.00', pct: 87 },
        { label: 'Moccona 200g (2 variants)', value: '$9.60', pct: 64 },
        { label: 'Bosisto’s Power Plus 2L (3 variants)', value: '$9.20', pct: 61 },
        { label: 'Bosisto’s Sensitive Laundry 2L', value: '$6.50', pct: 43 },
        { label: 'Colgate Total 200g (5 variants)', value: '$5.50', pct: 37 },
        { label: 'Morning Fresh 900mL (5 variants)', value: '$5.00', pct: 33 },
      ],
      read: 'The same OMO bottle was $30 at Woolworths and $15 at Coles on the same day. Every line here is laundry, coffee, toothpaste or dish soap, and not one is a known value item. A bare label is one product. A label reading (5 variants) is five products of the same line carrying the same gap to the cent, grouped into one bar rather than repeated five times. They are grouped because a whole range goes on promotion at once, which is the actual unit of decision: you are not timing a product, you are timing a range.',
    },

    { t: 'pull', text: 'The basket total is a coin toss. The promotional cycle and the tail are the whole game.' },

    { t: 'h', id: 'panel', text: 'Three years, and a test I could fail' },
    { t: 'p', text: 'Thirteen days answers which chain was cheaper. It cannot answer whether a gap is a promotion or a position, because on any single morning those look identical and only the following months separate them. An open price tracker has been scraping both chains daily since September 2023 and publishes the result, and it keys products by the retailers’ own product ids, which are the same ids this collector already stores. So the pairs matched here extend backwards on an equality join, with no re-matching at all.' },
    { t: 'p', text: 'Borrowed data is worth what it can be checked against. For every day this project priced a product itself, the backfill is asked what price it implies for that day and the two are compared: 22,616 overlapping observations, 99.97% agreeing to the cent, from two scrapers built independently by two people who have never spoken. That check is a gate rather than a report. It runs before anything is built, and below 99% the whole arm refuses to build.' },
    { t: 'p', text: 'Eligibility and window are two different things, and conflating them cost most of the study before it was caught. A product must have been observed for at least a year to be matchable at all, which is what keeps the pair set honest. The window each matched pair is then measured over is simply all the history it has. Demanding instead that every pair span the same three years left 67 pairs out of 1,523, because the upstream tracker only grew its own catalogue over time. Separated, the same 1,523 pairs carry 775,418 pair-days back to September 2023, against 557,418 under the twelve-month window they replaced.' },
    {
      t: 'stats',
      items: [
        { figure: '775,418', caption: 'Pair-days with a price at both chains, across 1,523 matched pairs, back to September 2023.' },
        { figure: '99.97%', caption: 'Agreement between the backfill and this project’s own collected days, over 22,616 observations.' },
        { figure: '67.6%', caption: 'Of every gap that closed, the share that lasted exactly seven days.' },
      ],
    },

    { t: 'lede', text: 'The first thing the history buys is a correction to the thirteen-day answer.' },
    { t: 'p', text: 'Over thirteen days, gaps looked permanent: four in five that opened wider than 5% were still open on the last day observed. Over three years they are not. Of 42,674 closed gap episodes, the median lasts seven days. The short window was not measuring how long gaps persist. It was measuring the length of its own window, which is the failure mode of every study reporting persistence over a period shorter than the thing being measured.' },
    {
      t: 'line',
      title: 'Promotion or position',
      unit: 'gap between the chains as a share of the mean price, sampled every third day, Jun 2025 to Aug 2026',
      legend: ['Cadbury Dairy Milk 180g, name brand', 'Own-brand extra virgin olive oil 500mL, store brand'],
      yTop: '70%',
      yBottom: '0%',
      pts: [
        [0, 0.9524], [0.0068, 0.9524], [0.0137, 0.9524], [0.0205, 0.9524], [0.0274, 0.5291], [0.0342, 0.5291],
        [0.0411, 0.7143], [0.0479, 0.7143], [0.0548, 0.7143], [0.0616, 0.7143], [0.0685, 0.7143], [0.0753, 0.9524],
        [0.0822, 0.9524], [0.089, 0.9524], [0.0959, 0.9524], [0.1027, 0.7143], [0.1096, 0.7143], [0.1164, 0.7143],
        [0.1233, 0.5291], [0.1301, 0.5291], [0.137, 0.9524], [0.1438, 0.9524], [0.1507, 0.9524], [0.1575, 0.9524],
        [0.1644, 0.9524], [0.1712, 0.6593], [0.1781, 0.6593], [0.1849, 0.5291], [0.1918, 0.5291], [0.1986, 0.6593],
        [0.2055, 0.6593], [0.2123, 0.6593], [0.2192, 0.9524], [0.226, 0.9524], [0.2329, 0.9524], [0.2397, 0.9524],
        [0.2466, 0.7143], [0.2534, 0.7143], [0.2603, 0.7143], [0.2671, 0.7143], [0.274, 0.9524], [0.2808, 0.9524],
        [0.2877, 0.9524], [0.2945, 0.6593], [0.3014, 0.6593], [0.3082, 0.6593], [0.3151, 0.6593], [0.3219, 0.6593],
        [0.3288, 0.9524], [0.3356, 0.9524], [0.3425, 0.9524], [0.3493, 0.9524], [0.3562, 0.9524], [0.363, 0],
        [0.3699, 0], [0.3767, 0.9524], [0.3836, 0.9524], [0.3904, 0.9524], [0.3973, 0.9524], [0.4041, 0.9524],
        [0.411, 0], [0.4178, 0], [0.4247, 0.6593], [0.4315, 0.6593], [0.4384, 0.6593], [0.4452, 0.6593],
        [0.4521, 0.6593], [0.4589, 0.6593], [0.4658, 0.6593], [0.4726, 0.6593], [0.4795, 0.6593], [0.4863, 0.6593],
        [0.4932, 0.6593], [0.5, 0.6593], [0.5068, 0.6593], [0.5137, 0.6593], [0.5205, 0.6593], [0.5274, 0.6593],
        [0.5342, 0.9524], [0.5411, 0.9524], [0.5479, 0.9524], [0.5548, 0.6593], [0.5616, 0.6593], [0.5685, 0.6593],
        [0.5753, 0.7143], [0.5822, 0.9524], [0.589, 0.9524], [0.5959, 0.9524], [0.6027, 0.9524], [0.6096, 0.9524],
        [0.6164, 0.7143], [0.6233, 0.7143], [0.6301, 0.6593], [0.637, 0.6593], [0.6438, 0.6593], [0.6507, 0.8],
        [0.6575, 0.8], [0.6644, 0], [0.6712, 0], [0.6781, 0.5291], [0.6849, 0.5291], [0.6918, 0.5291],
        [0.6986, 0.6593], [0.7055, 0.6593], [0.7123, 0.6593], [0.7192, 0.6593], [0.726, 0.9524], [0.7329, 0.9524],
        [0.7397, 0.9524], [0.7466, 0.5291], [0.7534, 0.5291], [0.7603, 0.5291], [0.7671, 0.5291], [0.774, 0.5291],
        [0.7808, 0.9524], [0.7877, 0.9524], [0.7945, 0.7143], [0.8014, 0.7143], [0.8082, 0.9524], [0.8151, 0.9524],
        [0.8219, 0.9524], [0.8288, 0.9524], [0.8356, 0.9524], [0.8425, 0.9524], [0.8493, 0.9524], [0.8562, 0.5291],
        [0.863, 0.5291], [0.8699, 0.7143], [0.8767, 0.7143], [0.8836, 0.7143], [0.8904, 0.9524], [0.8973, 0.9524],
        [0.9041, 0.9524], [0.911, 0.9524], [0.9178, 0.7143], [0.9247, 0.7143], [0.9315, 0.7143], [0.9384, 0.7143],
        [0.9452, 0.7143], [0.9521, 0.7143], [0.9589, 0.9524], [0.9658, 0.9524], [0.9726, 0.9524], [0.9795, 0.9524],
        [0.9863, 0.9524], [0.9932, 0.9524], [1, 0.9524],
      ],
      pts2: [
        [0, 0.136], [0.0068, 0.136], [0.0137, 0.136], [0.0205, 0.136], [0.0274, 0.136], [0.0342, 0.136],
        [0.0411, 0.136], [0.0479, 0.136], [0.0548, 0.136], [0.0616, 0.136], [0.0685, 0.136], [0.0753, 0.136],
        [0.0822, 0.136], [0.089, 0.136], [0.0959, 0.136], [0.1027, 0.136], [0.1096, 0.136], [0.1164, 0.136],
        [0.1233, 0.136], [0.1301, 0.136], [0.137, 0.136], [0.1438, 0.136], [0.1507, 0.136], [0.1575, 0.136],
        [0.1644, 0.136], [0.1712, 0.136], [0.1781, 0.136], [0.1849, 0.136], [0.1918, 0.136], [0.1986, 0.2857],
        [0.2055, 0.2857], [0.2123, 0.2857], [0.2192, 0.2857], [0.226, 0.2857], [0.2329, 0.2857], [0.2397, 0.2857],
        [0.2466, 0.2857], [0.2534, 0.2857], [0.2603, 0.2857], [0.2671, 0.2857], [0.274, 0.2857], [0.2808, 0.2857],
        [0.2877, 0.2857], [0.2945, 0.2857], [0.3014, 0.2857], [0.3082, 0.2857], [0.3151, 0.2857], [0.3219, 0.2857],
        [0.3288, 0.2857], [0.3356, 0.2857], [0.3425, 0.2857], [0.3493, 0.2857], [0.3562, 0.2857], [0.363, 0.2857],
        [0.3699, 0.2857], [0.3767, 0.2857], [0.3836, 0.2857], [0.3904, 0.2857], [0.3973, 0.2857], [0.4041, 0.2857],
        [0.411, 0.2857], [0.4178, 0.2857], [0.4247, 0.2857], [0.4315, 0.2857], [0.4384, 0.2857], [0.4452, 0.2857],
        [0.4521, 0.2857], [0.4589, 0.2857], [0.4658, 0.2857], [0.4726, 0.2857], [0.4795, 0.2857], [0.4863, 0.2857],
        [0.4932, 0.2857], [0.5, 0.2857], [0.5068, 0.2857], [0.5137, 0.2857], [0.5205, 0.2857], [0.5274, 0.2857],
        [0.5342, 0.2857], [0.5411, 0.2857], [0.5479, 0.2857], [0.5548, 0.2857], [0.5616, 0.2857], [0.5685, 0.2857],
        [0.5753, 0.2857], [0.5822, 0.2857], [0.589, 0.2857], [0.5959, 0.2857], [0.6027, 0.2857], [0.6096, 0.2857],
        [0.6164, 0.2857], [0.6233, 0.2857], [0.6301, 0.2857], [0.637, 0.2857], [0.6438, 0.2857], [0.6507, 0.2857],
        [0.6575, 0.2857], [0.6644, 0.2857], [0.6712, 0.2857], [0.6781, 0.2857], [0.6849, 0.2857], [0.6918, 0.2857],
        [0.6986, 0.2857], [0.7055, 0.2857], [0.7123, 0.2857], [0.7192, 0.2857], [0.726, 0.2857], [0.7329, 0.2857],
        [0.7397, 0.2857], [0.7466, 0.2857], [0.7534, 0.2857], [0.7603, 0.2857], [0.7671, 0.2857], [0.774, 0.2857],
        [0.7808, 0.2857], [0.7877, 0.2857], [0.7945, 0.2857], [0.8014, 0.2857], [0.8082, 0.2857], [0.8151, 0.2857],
        [0.8219, 0.2857], [0.8288, 0.2857], [0.8356, 0.2857], [0.8425, 0.2857], [0.8493, 0.2857], [0.8562, 0.2857],
        [0.863, 0.2857], [0.8699, 0.2857], [0.8767, 0.2857], [0.8836, 0.2857], [0.8904, 0.2857], [0.8973, 0.2857],
        [0.9041, 0.2857], [0.911, 0.2857], [0.9178, 0.2857], [0.9247, 0.2857], [0.9315, 0.2857], [0.9384, 0.2857],
        [0.9452, 0.2857], [0.9521, 0.2857], [0.9589, 0.2857], [0.9658, 0.2857], [0.9726, 0.2857], [0.9795, 0.2857],
        [0.9863, 0.2857], [0.9932, 0.2857], [1, 0.2857],
      ],
      xLabels: ['Jun 2025', 'Jan 2026', 'Aug 2026'],
      read: 'Two real pairs, both accepted by the same matcher, plotted on the same axis. The chocolate block is a square wave: the gap slams open to about 67%, holds for a week, shuts to nothing, and does it again and again. The olive oil opens a 20% gap and simply never closes it. On any single morning both look like the same finding, which is exactly what the thirteen-day study could not tell apart. Only the following months separate a promotion from a position, and the two products here are also a name brand and a store brand, which is the same split the charts below measure in aggregate.',
    },
    {
      t: 'bars',
      title: 'How long a gap lasts before it closes',
      unit: '42,674 closed gap episodes, Sep 2023 to Aug 2026',
      bars: [
        { label: '1 to 4 days', value: '2,516', pct: 9 },
        { label: '5 days', value: '2,034', pct: 7 },
        { label: '6 days', value: '1,682', pct: 6 },
        { label: '7 days', value: '28,839', pct: 100, lead: true },
        { label: '8 days', value: '1,127', pct: 4 },
        { label: '9 days', value: '1,157', pct: 4 },
        { label: '10 to 13 days', value: '1,544', pct: 5 },
        { label: '14 days', value: '2,076', pct: 7 },
        { label: '15 days or more', value: '1,699', pct: 6 },
      ],
      read: 'Sixty-eight per cent of every gap that closed lasted exactly seven days, with a second bump at fourteen. This is not a median landing near a week, it is a spike on the week itself, and it holds in both brand tiers and in both pair sets across three years. The promotional week is the unit of Australian grocery pricing, and a study shorter than one cycle cannot see the shape at all: a thirteen-day window catches one visit from this distribution and reports it as a level.',
    },

    { t: 'lede', text: 'Ask how far apart the two chains usually are and the answer is bimodal. There is almost no middle.' },
    {
      t: 'bars',
      title: 'How far apart the two prices are',
      unit: '775,418 observed pair-days, Sep 2023 to Aug 2026',
      bars: [
        { label: 'Exactly equal', value: '51.5%', pct: 100, lead: true },
        { label: 'Under 1% apart', value: '0.2%', pct: 0.4 },
        { label: '1 to 2%', value: '0.6%', pct: 1.3 },
        { label: '2 to 5%', value: '1.6%', pct: 3 },
        { label: '5 to 10%', value: '2.9%', pct: 5.6 },
        { label: '10 to 20%', value: '9.0%', pct: 17.6 },
        { label: '20 to 50%', value: '22.8%', pct: 44.2 },
        { label: '50% or more', value: '11.4%', pct: 22.2 },
      ],
      read: 'Half of all pair-days are priced identically to the cent, and a further third sit more than 20% apart. Between them, the entire band from a fraction of a per cent to five per cent accounts for 2.4% of observations. Prices are not distributed around a small average difference; they are either matched exactly or they are nowhere near each other. That shape is the argument against ever quoting a mean gap on its own, because the mean lands in the valley where almost nothing actually sits, and it is why every measure on this page is a rate or a median rather than an average.',
    },

    { t: 'lede', text: 'Three years is also long enough to ask whether repricing has a season.' },
    {
      t: 'line',
      title: 'How often prices move, by month',
      unit: 'share of pair-days on which either chain repriced, Oct 2023 to Aug 2026',
      yTop: '12%',
      yBottom: '0%',
      pts: [
        [0, 0.6183], [0.0294, 0.8492], [0.0588, 0.4525], [0.0882, 0.7558], [0.1176, 0.6992], [0.1471, 0.6267],
        [0.1765, 0.6533], [0.2059, 0.85], [0.2353, 0.6583], [0.2647, 0.76], [0.2941, 0.5892], [0.3235, 0.6408],
        [0.3529, 0.5842], [0.3824, 0.7917], [0.4118, 0.505], [0.4412, 0.3083], [0.4706, 0.7883], [0.5, 0.6783],
        [0.5294, 0.9208], [0.5588, 0.7008], [0.5882, 0.6825], [0.6176, 0.875], [0.6471, 0.735], [0.6765, 0.7533],
        [0.7059, 0.8908], [0.7353, 0.74], [0.7647, 0.4958], [0.7941, 0.7808], [0.8235, 0.745], [0.8529, 0.6667],
        [0.8824, 0.85], [0.9118, 0.6842], [0.9412, 0.715], [0.9706, 0.8708], [1, 0.8133],
      ],
      xLabels: ['Oct 2023', 'Mar 2025', 'Aug 2026'],
      read: 'The floor of every year is December: 5.4% in 2023, 6.1% in 2024, 6.0% in 2025, against 7 to 11% in most other months. Both chains stop moving prices over Christmas and start again in the new year, three years running. The early months of the series rest on far fewer pairs than the later ones, because the upstream tracker was still growing its catalogue, so the left of this chart is noisier than the right; the December floor is the one feature that survives that unevenness, and it survives it three times.',
    },

    { t: 'lede', text: 'The second is a split the aisle chart could not separate: store brand against name brand.' },
    {
      t: 'bars',
      title: 'How often a price moves',
      unit: 'share of pair-days on which either chain repriced, Sep 2023 to Aug 2026',
      bars: [
        { label: 'Name brand, fresh produce', value: '10.4%', pct: 100, lead: true },
        { label: 'Name brand, packaged staples', value: '8.9%', pct: 86 },
        { label: 'Store brand, fresh produce', value: '6.4%', pct: 62 },
        { label: 'Store brand, packaged staples', value: '1.0%', pct: 10 },
      ],
      read: 'A name brand is the same physical good on both shelves, so a gap between the chains is a pricing decision. A store brand is a substitute from a different supplier, so a gap is partly a product difference. Pooled, store brands reprice about three and a half times less often than name brands. Split by aisle that single number turns out to be an average of two regimes: nearly nine times less often on packaged staples, and only 1.6 times on produce. Crop and weather move a price whoever owns the label, and private-label pricing discipline is something you can only exercise over a manufactured good.',
    },

    { t: 'lede', text: 'Writing the prediction down first is what makes it a test rather than a story.' },
    { t: 'p', text: 'The aisle split earlier on this page was found in the data rather than predicted before it, which makes it a hypothesis this study generated rather than one it tested. So for the longer series the item list, the bucket assignment and the expected numbers were committed to version control before a single bucket-level figure was computed, and the commit hash is published beside the results. Seven of twelve predictions landed inside the registered range. Packaged staples went five of six and fresh produce two of six, which is at least the right cell to be wrong about.' },
    { t: 'p', text: 'The claim that mattered was whether the store-brand effect survived holding aisle constant, with a commitment made in advance to retract it publicly if it did not. It survived. The prediction that failed hardest is the more useful result.' },
    {
      t: 'bars',
      title: 'Do the two chains’ prices move together?',
      unit: 'median per-pair correlation of monthly mean price, Sep 2023 to Aug 2026',
      bars: [
        { label: 'Store brand, packaged staples', value: '0.73', pct: 100, lead: true },
        { label: 'Store brand, produce', value: '0.48', pct: 66 },
        { label: 'Name brand, produce', value: '0.35', pct: 48 },
        { label: 'Name brand, packaged staples', value: '0.35', pct: 48 },
      ],
      read: 'Those are monthly means over three years. Day to day the two name-brand figures collapse to zero and faintly negative, against a registered prediction of 0.80 to 0.95. Two chains buying the same crop in the same weather ought to move together, and on national brands they do not, because national brands are the promotional vehicles and the two chains run their cycles out of phase. The prices take turns rather than moving together. Store brands are lightly promoted, so what remains is shared cost arriving at both chains at once, and they track each other most closely of all. The axis separating correlated from uncorrelated prices is not fresh against packaged. It is promoted against not.',
    },
    { t: 'p', text: 'That is the sort of result worth wanting. The prediction was wrong in a direction that named its own cause, and the cause is visible in the other measures on this page rather than invented to cover the miss.' },

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

    { t: 'h', id: 'close', text: 'Conclusion' },
    { t: 'p', text: 'Five things the series supports, in the order I would defend them.' },
    {
      t: 'list',
      items: [
        'Neither chain wins the basket. Across 48 comparable lines the two totals sit within a dollar on the most recent day, the winner flips repeatedly across the collected days, and Woolworths averages $6.47 cheaper over the ten published ones. Anyone quoting a stable lead for either chain is quoting noise, and I know because I quoted one myself before the pack-size screen was added.',
        'The average hides the finding. Parity runs from 62.5% in pantry to 7.1% in household on the same morning, and the mean household gap is six times pantry’s. The two chains compete hard where a shopper can price from memory and barely at all where they cannot.',
        'A promotion flag is not a price cut. Of 121 promotion starts with an observable baseline, 17 moved the price the wrong way or not at all, including four mineral waters going from $3.00 to $3.30 while flagged. All 17 were at one chain. The advertised was-prices themselves check out, 100 of 100, so this is the badge and the shelf price being managed apart rather than fake discounting.',
        'Nine in ten promotions are a cycle, not a price change. Of 44 promotions observed on both sides, 39 returned to exactly the price they started at, median 41% off over a 7-day run. That is the difference between timing your shop and switching your shop.',
        'Store brands are priced to hold still and name brands are the promotional vehicle. Across three years a store-brand packaged staple reprices nearly nine times less often than its name-brand equivalent, and the two chains’ name-brand prices barely correlate day to day because their promotional cycles run out of phase.',
      ],
    },
    { t: 'p', text: 'What the study cannot tell you is worth stating as plainly. These are shelf prices, not transacted prices: member pricing, multi-buys and loyalty offers sit underneath them. There are no quantities anywhere in public price data, so nothing here is elasticity and the word does not appear. It is online national pricing from one collection point, and the promotion and reference-price measures rest on 13 collected days rather than on the backfilled year, because the backfill carries prices and no promotion metadata at all.' },
    { t: 'p', text: 'This is a study of retailer behaviour. It measures how two chains price against each other in public: where they match, by how much they differ, how often and how deeply they promote, and whether a difference closes or holds. Behaviour is the useful signal here, because what each retailer chooses to match is a direct read on which lines it believes are competitive.' },
    { t: 'p', text: 'The answer it produces is a shape rather than a verdict. There is a small benchmarked head where the two chains track each other to the cent and earn almost nothing, and a long tail where a gap can sit for weeks because nobody is checking. Knowing which line is which, and being able to prove it rather than assert it, is the work. The same shape holds anywhere prices are set against a competitor rather than fixed by a contract, which is what makes the method portable off the supermarket shelf.' },
    { t: 'p', text: 'The measure I would add next is follow latency: the number of days before one retailer answers the other’s move. It reads competitive intensity more directly than parity does, because parity tells you where two chains have landed and latency tells you how hard they are watching. On this split it should separate the head from the tail sharply, and it is the natural next thing this warehouse is already shaped to compute.' },
  ],
}
