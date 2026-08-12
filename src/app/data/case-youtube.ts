import type { CaseStudyProps } from '../components/case-study'

/**
 * YouTube Trending case study. Copy kept in the author's voice per 11.C,
 * with the em-dashes rewritten out.
 */
export const youtube: CaseStudyProps = {
  kicker: 'Data story',
  hookLead: 'Going viral has a shelf life.',
  hookTail: 'It is about 38 hours.',
  sub: 'I scraped 40,000 trending videos across ten regions to answer one nagging question: what actually earns a spot on the Trending page, and how fast does the magic wear off?',
  meta: [
    ['Role', 'Solo analysis'],
    ['Stack', 'Python, pandas, scikit-learn'],
    ['Source', 'YouTube Data API'],
    ['Sample', '40k videos, 10 regions'],
    ['Built', 'API collection, feature engineering, model'],
  ],
  contents: [
    ['overview', 'Overview'],
    ['source', 'The data'],
    ['approach', 'Approach'],
    ['findings', 'What the data says'],
    ['next', 'What is next'],
  ],
  links: [
    { label: 'Source and notebook', href: 'https://github.com/MelvinDY/youtube-trending-pipeline', primary: true },
    { label: 'YouTube Data API', href: 'https://developers.google.com/youtube/v3' },
  ],
  nextStudy: { href: '/projects/data/grocery', title: 'Woolworths vs Coles Price Analytics' },
  blocks: [
    { t: 'h', id: 'overview', text: 'Overview' },
    { t: 'p', text: '"Trending" feels permanent when you are scrolling it. It is not. The board churns constantly, and most creators have no idea how short their window really is.' },
    { t: 'p', text: 'I wanted to treat the Trending page like a dataset instead of a vibe: pull every video on it, every day, across regions, and watch how positions appear, climb and evaporate. With enough snapshots the lifecycle of a viral video stops being mysterious and starts being a curve you can plot.' },
    {
      t: 'stats',
      items: [
        { figure: '40k', caption: 'Trending video snapshots collected across regions.' },
        { figure: '38h', caption: 'Median time a video survives on the board.' },
        { figure: '+23%', caption: 'Longer life when the title contains a number.' },
      ],
    },

    { t: 'h', id: 'source', text: 'The data' },
    { t: 'p', text: 'I hit the YouTube Data API on a schedule, capturing the full Trending list for ten regions every few hours over several weeks. Each snapshot recorded position, views, likes, comments, category, channel size and publish time.' },

    { t: 'h', id: 'approach', text: 'Approach' },
    { t: 'p', text: 'I de-duplicated videos across snapshots into a single lifecycle per video, then engineered features: title length, presence of numbers and emoji, thumbnail face detection, publish hour, category and channel size. A gradient-boosted model did the heavy lifting on what predicts longevity, with the raw curves kept close by as a sanity check.' },

    { t: 'h', id: 'findings', text: 'What the data says' },
    { t: 'lede', text: 'The lifecycle is front-loaded and brutal. Velocity in the first two hours decides almost everything.' },
    {
      t: 'line',
      title: 'View velocity over a video’s life on Trending',
      unit: 'relative, hours since posting',
      pts: [[0, 0.12], [0.12, 0.62], [0.24, 1], [0.36, 0.88], [0.48, 0.72], [0.6, 0.55], [0.72, 0.4], [0.84, 0.26], [1, 0.16]],
      xLabels: ['0h', '24h', '48h'],
      read: 'Velocity spikes within hours, then decays steadily. By about 38 hours the typical video has slipped off the board entirely.',
    },
    { t: 'pull', text: 'The thumbnail and first two hours matter more than the channel’s entire subscriber count.' },

    { t: 'lede', text: 'Clout is overrated. The signals creators obsess over barely move the needle.' },
    { t: 'p', text: 'When I ranked features by how much they predicted longevity, early velocity and a few cheap title-and-thumbnail tricks dominated. Subscriber count, the thing everyone chases, landed near the bottom.' },
    {
      t: 'bars',
      title: 'What predicts how long a video trends',
      unit: 'relative feature importance',
      bars: [
        { label: 'First-2h velocity', value: '0.31', pct: 95, lead: true },
        { label: 'Number in title', value: '0.24', pct: 72 },
        { label: 'Face in thumbnail', value: '0.21', pct: 64 },
        { label: 'Category', value: '0.17', pct: 52 },
        { label: 'Publish 2 to 4pm', value: '0.13', pct: 40 },
        { label: 'Subscriber count', value: '0.06', pct: 20 },
        { label: 'Video length', value: '0.03', pct: 10 },
      ],
      read: 'Momentum and packaging beat reach. A small channel with the right first hour outruns a big one without it.',
    },
    { t: 'note', text: 'These are relative feature importances from one gradient-boosted model on one sampling window, not causal effects. They say what the model leaned on, not what would happen if you changed a thumbnail.' },

    { t: 'h', id: 'next', text: 'What is next' },
    {
      t: 'list',
      items: [
        'Run sentiment on titles and thumbnails to test whether curiosity gaps really do outperform plain description.',
        'Compare lifecycle curves across regions to see whether a video trends longer in some countries than others.',
        'Ship a small trending-odds tool that scores a draft title and thumbnail before you hit publish.',
      ],
    },
  ],
}
