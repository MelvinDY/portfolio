import type { CaseStudyProps } from '../components/case-study'

/**
 * Woolworths vs Coles case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 *
 * v4, 2026-08-23. The study is closed at ten complete days rather than run on
 * to a hundred. The findings section is unchanged from v3; what changed is the
 * ending, which no longer promises work that is not going to happen. A roadmap
 * on a finished project is just a list of things you did not do.
 *
 * The series answers the question v2 had to leave open, which is whether a
 * special ends in a restored price or a lasting cut. The collection also broke
 * twice in ways no test caught, and the study says so: a page that only reports
 * the days that went well is not reporting a pipeline.
 *
 * Every figure is from the warehouse as at the 2026-08-23 collection, rebuilt
 * over all stored days. The one exception is the Grocery Price Index section,
 * which is third-party data and is labelled as such wherever it appears.
 */
export const grocery: CaseStudyProps = {
  kicker: 'Data story',
  hookLead: 'Competition is fierce where it is watched',
  hookTail: 'and absent where it is not.',
  sub: 'Prices pulled daily from both retailers’ public web APIs, fuzzy-matched into identical product pairs, and tracked over time in a dbt warehouse. Where the two chains match to the cent, where they do not bother, and what actually happens to a price when the promo badge appears.',
  meta: [
    ['Role', 'Solo build and analysis'],
    ['Stack', 'Python, dbt, DuckDB, rapidfuzz'],
    ['Source', 'Retailer web APIs, live and daily'],
    ['Sample', '50-item basket, 128 matched pairs'],
    /* The limitation belongs beside the sample size, not four sections down.
       Ten days is the whole series and it is the first thing a reader should
       know, because it bounds every history claim further down. */
    ['Scope', '10 complete days, 15 Jul to 23 Aug 2026'],
    ['Built', 'Collector, entity resolution, dbt warehouse with SCD2 history'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['build', 'Building the series'],
    ['quality', 'What broke'],
    ['matching', 'Matching the products'],
    ['findings', 'What the data says'],
    ['backdrop', 'The longer view'],
    ['close', 'Where it lands'],
  ],
  links: [
    { label: 'Source and pipeline', href: 'https://github.com/MelvinDY/woolworths-vs-coles-analytics', primary: true },
  ],
  nextStudy: { href: '/projects/data/saas', title: 'SaaS Sales & Revenue Analytics' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: '"Woolies is cheaper." "No, Coles is." Everyone has a confident answer and none of them have the receipts. I wanted the receipts.' },
    { t: 'p', text: 'The first version answered it for one day, and the answer was a dead heat. That turned out to be the least interesting thing in the data. Once the collector kept running, the real question came into focus: not which chain is cheaper this morning, but which products the two chains are willing to compete on at all. Those are not the same list, and the difference is where the money is.' },
    {
      t: 'stats',
      items: [
        { figure: '39 of 44', caption: 'Promotions that ended went straight back to the price they started at. The median one was 41% off and lasted a week.' },
        { figure: '7.1%', caption: 'Household matched pairs priced to the cent, against 62.5% in pantry. Same two shops, same day.' },
        { figure: '100 of 100', caption: 'Advertised “was” prices that matched a price this project actually watched being charged.' },
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
        { stage: 'Screen', tool: 'dbt', what: 'partial days and irrelevant search hits held out of the basket' },
        { stage: 'Track', tool: 'dbt snapshot', what: 'SCD2 on price, was-price and the special flag' },
        { stage: 'Match', tool: 'rapidfuzz', what: 'identical products paired across the two catalogues' },
        { stage: 'Model', tool: 'dbt', what: 'six marts, incremental history, grain tested on every one' },
      ],
    },
    { t: 'p', text: 'Price history is modelled as a slowly changing dimension rather than a pile of daily rows. A product whose price holds for six weeks is one record with a six week validity window, and a price change closes one record and opens the next. The historical days already on disk are replayed into it one at a time, so a change is dated the day the price actually moved rather than the afternoon I built the model. There are 3,254 price versions across 2,035 products in it now.' },
    { t: 'p', text: 'The matched-pair history is incremental: a day’s run touches a day’s rows. That is a claim, so there is a script that checks it, by deleting the last two days, replaying them, and asserting the result is identical to a full rebuild. An incremental model whose answer depends on how many times it has been run is a bug you find months later, in public.' },
    { t: 'p', text: 'One rule governs everything downstream: a day nobody collected is never filled in. A product missing from a day’s search results does not close its history record, because it has not been discontinued and its price has not changed. Nobody looked. The matched-pair series leaves that day null and flags it, a data test enforces that the flag and the nulls agree, and the dashboard draws those stretches dashed instead of joining them with a confident straight line. Inventing continuity is how a price series starts lying.' },

    { t: 'h', id: 'quality', text: 'What broke' },
    { t: 'lede', text: 'Twice the collection failed without failing. Both times every test passed and the number was simply about something else.' },
    { t: 'p', text: 'This section is here because leaving it out would misrepresent the project. A script you run once and read the output of is not the same artifact as a pipeline that runs every morning while you are asleep, and the difference is exactly these two bugs.' },
    { t: 'p', text: 'On 22 August, Coles began answering HTTP 500 partway through the run and 47 of the 50 search terms came back empty. The day was written anyway: 50 Woolworths basket lines against 7 from Coles. The guard that should have stopped it asked whether the retailer had returned any rows at all, and Coles had returned 144 of them, spread across three terms. A row count cannot tell the difference between a retailer that answered the basket and one that answered a fraction of it very thoroughly. Coverage is now counted in basket lines answered per retailer, a run below 80% on either side aborts without writing, and a completeness flag keeps days like that one out of the marts rather than editing the raw file.' },
    { t: 'p', text: 'The second one was worse, because it was quiet. From 18 August the Woolworths line for a dozen eggs was priced at $65.99, for an egg incubator. Then a $22 egg carrier, then a $39.75 storage box. The basket takes the cheapest of the top five search hits, so one bad hit moved the whole total, and it manufactured a $46 to $81 basket gap where the real figure was about $12.' },
    { t: 'p', text: 'The cause was not what it looked like. Woolworths had not stopped selling eggs and their search had not broken that morning. Third-party marketplace listings had been crowding that term the entire time, and the only real carton in the results was sitting at rank 5 of 5 on 16 August. On 18 August it slipped to rank 6 and left the window. The published $6.90 the week before was already luck. The rank cap had been doing relevance work it was never designed for, and it had been one place from failing for as long as the line existed.' },
    { t: 'p', text: 'The first fix I tried was a deny-list of junk keywords. It moved the pick from a $65.99 incubator to a $104.99 dinosaur fossil digging set, which is the lesson: the supply of things that are not eggs is unbounded and enumerating it is not a strategy. What works is a positive rule. Real groceries on that line are sold by weight and carry a per-100g unit price, and none of the marketplace hardware does, so requiring the unit basis removes all of it structurally. A name rule then holds both retailers to the same pack size.' },
    { t: 'note', text: 'Both rules test what a product is and neither looks at what it costs. A plausible-price band per line would have been quicker and is the wrong tool: it would quietly discard real price movement, which is the one thing this project exists to measure. A guard that can hide the finding is worse than the bug. Every basket total from before the break is unchanged to the cent after the fix, which is the property that mattered.' },

    { t: 'h', id: 'matching', text: 'Matching the products' },
    { t: 'p', text: 'The hard part is entity resolution, and it is unchanged from the first version because it was the part that worked. Candidates are generated within the same search term, fuzzy-matched with rapidfuzz, then accepted by tier: national brands need the same brand, a pack size within 2% and a name score of 80 or better. Home brands are matched separately because they are substitutes rather than identical products. Assignment is greedy and one to one, and every accepted pair carries its score, so the whole match set is auditable in SQL.' },
    { t: 'p', text: 'Porting the original SQL into dbt came with one hard rule: it could change how the marts are built and not what they contain. Every mart was reconciled row for row against the pre-port output before the old models were deleted. Nothing moved. If a published figure had changed, it would have been corrected here rather than quietly absorbed.' },

    { t: 'h', id: 'findings', text: 'What the data says' },
    { t: 'lede', text: 'On identical national-brand products the two chains mostly refuse to be beaten. Forty-three percent of the matches are priced to the cent.' },
    {
      t: 'bars',
      title: 'Who wins each matched pair',
      unit: 'count of 128 identical products, 23 Aug',
      bars: [
        { label: 'Priced identical', value: '55', pct: 100, lead: true },
        { label: 'Coles cheaper', value: '37', pct: 67 },
        { label: 'Woolworths cheaper', value: '36', pct: 65 },
      ],
      read: 'The pair count and the basket total disagree, and neither is wrong: the basket counts the cheapest available item per line, and the pairs count only products both chains stock in the same size. Coles took the basket on nine of the ten complete days, by $13.92 on the most recent one. Woolworths took it once, by $5.90, a wider margin than any Coles win in the series.',
    },

    { t: 'lede', text: 'That headline average hides the whole finding. Split the same pairs by aisle and they come apart.' },
    {
      t: 'bars',
      title: 'Where the two chains match to the cent',
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
      read: 'Pantry staples are matched nine times more often than household goods. These are the same two retailers on the same morning, so this is not a difference in how hard they compete. It is a difference in where.',
    },
    {
      t: 'bars',
      title: 'And what it costs you where they do not',
      unit: 'mean absolute gap per matched pair, AUD, 23 Aug',
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
      read: 'The two charts are the same story twice. Where parity is high the gap is small, and household sits at the bottom of one and the top of the other with a gap six times pantry’s. The trade has a name for the exposed end: known value items, the lines a shopper can price from memory. Nobody has any idea what laundry liquid should cost.',
    },
    { t: 'p', text: 'Drinks is the interesting exception and worth not smoothing over. It has the second-lowest parity rate and the smallest gap of any aisle, which means the two chains almost never land on the same price and it almost never matters. Parity and closeness are two different questions, and one aisle here answers them differently. A two-way split into watched and unwatched cannot represent that, so it is a finding against the model rather than for it.' },

    { t: 'lede', text: 'Here is the thing one day of data cannot tell you. The badge and the price come apart.' },
    { t: 'p', text: 'From a single snapshot you can see that a product is flagged on special and what the retailer claims it used to cost. You cannot see whether the price actually fell, because you were not there yesterday. With a series you can check.' },
    {
      t: 'bars',
      title: 'What the “Special” badge did to the price',
      unit: '121 promotion episodes with an observable price beforehand',
      bars: [
        { label: 'Price actually fell', value: '104', pct: 100, lead: true },
        { label: 'Price went up', value: '11', pct: 11 },
        { label: 'Price unchanged', value: '6', pct: 6 },
      ],
      read: 'Most specials are real. Seventeen of the 121 were not, and all seventeen were at Coles, whose 17 genuine cuts are outnumbered by Woolworths’ 87. The clearest case: four Schweppes mineral waters at $3.00, flagged on special at $3.30.',
    },
    { t: 'p', text: 'The obvious next suspicion is inflated reference pricing: a "was" price the shop never really charged. That one does not hold up. Of the 100 episodes where there was both an advertised was-price and an earlier observation of my own to check it against, all 100 matched. So this is not fake was-prices. It is the promo badge and the shelf price being managed separately, which is a duller finding and a truer one.' },

    { t: 'lede', text: 'And the question the shorter series had to leave open now has an answer.' },
    {
      t: 'bars',
      title: 'What happened when the special ended',
      unit: '44 promotion episodes with a price observed on both sides',
      bars: [
        { label: 'Price restored to baseline', value: '39', pct: 100, lead: true },
        { label: 'Stayed below baseline', value: '5', pct: 13 },
      ],
      read: 'A special on these shelves is deep and brief and then it is over: the median one is 41% off, runs seven days, and ends exactly where it started. Nine in ten are a promotional cycle rather than a price change, which is the difference between timing your shop and switching your shop.',
    },
    {
      t: 'bars',
      title: 'Biggest same-product price gaps',
      unit: 'identical product, AUD gap, 23 Aug',
      bars: [
        { label: 'OMO Sensitive Laundry 2L', value: '$15.00', pct: 100, lead: true },
        { label: 'Cold Power 2L, five variants', value: '$13.00', pct: 87 },
        { label: 'Moccona 200g, two variants', value: '$9.60', pct: 64 },
        { label: 'Bosisto’s Power Plus 2L, three', value: '$9.20', pct: 61 },
        { label: 'Bosisto’s Sensitive Laundry 2L', value: '$6.50', pct: 43 },
        { label: 'Colgate Total 200g, five variants', value: '$5.50', pct: 37 },
        { label: 'Morning Fresh 900mL, five', value: '$5.00', pct: 33 },
      ],
      read: 'The same OMO bottle was $30 at Woolworths and $15 at Coles on the same day. Every line here is laundry, coffee, toothpaste or dish soap, and not one of them is a thing anybody prices from memory. Variants sharing an identical gap are grouped because a whole product line goes on promotion at once: you are not timing a product, you are timing a range.',
    },
    { t: 'note', text: '"Before" means the last day this project priced that product, a median of 3 days earlier now that collection is close to daily, against 28 days when the series was five days long. Of the 203 promotion episodes seen so far, 44 have collected days on both sides. The rest are still running or started before the collector first saw the product.' },

    { t: 'pull', text: 'The basket total is a coin toss. The promo cycle is the whole game.' },

    { t: 'h', id: 'backdrop', text: 'The longer view' },
    { t: 'p', text: 'Ten days is ten days. For the years this series does not cover, Savings.com.au has run a monthly Coles-versus-Woolworths index since late 2023, pricing a fixed basket at both chains and publishing the annual movement. It is not my data, it is not my basket and the methodology is theirs, so it sits here as context and nothing below is derived from it.' },
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
      read: 'Grocery inflation peaked above 9% in February 2025 and has cooled to 1.38% by July 2026. That matters for reading everything above: the $13.92 basket gap I measure is moving around inside a market that is currently close to flat, so it is competitive noise rather than a cost-of-living signal.',
    },
    { t: 'p', text: 'Their July 2026 basket came to $262.02 at Coles and $261.27 at Woolworths, 75 cents apart on roughly $260. Different basket, different method, two and a half years of history against my ten days, and the same conclusion: at the level of the whole shop, there is nothing to choose between them. Which is the strongest external check available on the one finding here I would most want to be wrong about.' },
    { t: 'note', text: 'Figures read from the Savings.com.au Grocery Price Index on 23 August 2026, last updated by them on 14 August 2026. Their index is monthly and covers November 2023 to July 2026.' },

    { t: 'h', id: 'close', text: 'Where it lands' },
    { t: 'p', text: 'This is the finished study, on ten complete days between 15 July and 23 August 2026. It is a short window and it is a real one: every figure above came out of the warehouse, and the two days the collection got wrong are described rather than dropped.' },
    { t: 'p', text: 'What it establishes is narrow and I think worth the narrowness. On identical products the two chains match to the cent 43% of the time, and where they do it is not spread evenly: pantry at 62.5% against household at 7.1%, with the household gap running six times pantry’s. A promotion on these shelves is deep and brief and then it is over, 39 of the 44 that ended went back to exactly where they started, and the advertised was-price checked out every single time I could check it. The basket total, the thing everyone argues about, is the least informative number in the project.' },
    {
      t: 'list',
      items: [
        'The parity-by-aisle split was found in the data, not predicted before it. That makes it a hypothesis this study generated rather than one it tested, and the difference matters: to test it you would assign every line to watched or unwatched up front, publish the assignment, and only then collect. Choosing items after seeing the gaps proves you chose well and nothing else.',
        'Drinks does not fit the split. Lowest parity but the smallest gap of any aisle, which says exposure and matching are two axes rather than one. A two-bucket model cannot hold that, and the honest response is to record it here rather than leave it out.',
        'The household finding rests on 14 pairs. It is the sharpest result on the page and the thinnest sample behind any of them, in that order.',
        'Ten days cannot separate a promotional cycle from a pricing position on any product whose promotion did not both start and end inside the window. Of 203 promotion episodes, 44 did. The rest are unresolved and stay that way.',
        'The Snowflake target was written and passes a static portability check, but it was never run against a live account. Nothing published here was built on it, and it is not a claim that it works.',
      ],
    },
    { t: 'note', text: 'What this could not do at ten days and could not do at a hundred either: measure elasticity. That needs quantities and public prices carry none. It measures how two retailers behave, and their behaviour reveals which lines they believe are competitive, which is a different claim and the only one the data supports. It is also one postcode, and shelf price rather than transacted price: member pricing, multi-buys and loyalty discounts all sit underneath what a scraper can see.' },
  ],
}
