/**
 * The catalogue behind /projects/all — every project, both disciplines.
 *
 * The featured cards on /projects/data and /projects/software stay as
 * hand-written JSX: each is built around a specific finding or award and needs
 * its own emphasis markup. This file is the *index* form of the same work —
 * one line each — plus everything that never earned a card. The two are
 * deliberately different jobs, which is why the duplication of a title and a
 * link between them is acceptable: one is the pitch, this is the contents page.
 *
 * `featured` marks the work that gets a full card on its discipline page, so
 * the index can show the same hierarchy without repeating the cards.
 */

export interface IndexedProject {
  id: string
  title: string
  /** One line. The index form only works if this stays a line. */
  blurb: string
  stack: string[]
  href: string
  /** What the destination actually is, so a row says where it sends you
   *  instead of making everything a nondescript arrow. */
  linkLabel: 'Case study' | 'Live demo' | 'Source'
  featured?: boolean
  /** A short, true marker — an award, a status. Rendered in the accent, so it
   *  should be worth spending the accent on. */
  note?: string
  /** True when there is something a stranger can open or install right now:
   *  a deployed URL, or a listing on a marketplace. Not "the code exists". */
  live?: boolean
  /** True when the build was mine end to end — architecture, backend, front
   *  end, deploy. Anything with a team, however small, is false. */
  solo?: boolean
  /** Named awards actually won, counted individually. Peersuade took two
   *  categories at one hackathon, so it counts two. */
  awards?: number
}

export const dataProjects: IndexedProject[] = [
  {
    id: 'labour-market',
    title: 'Australian Labour Market Dashboard',
    blurb: 'Live ABS data ingested in Python, modelled into a tested dbt star schema on SQL Server, and reported in Power BI and Excel generated as code. Used to answer why the gender full-time gap is closing.',
    stack: ['ABS API', 'dbt', 'SQL Server', 'Power BI', 'Excel', 'Python'],
    href: '/projects/data/labour-market',
    linkLabel: 'Case study',
    featured: true,
    note: 'The gap is closing, but not for the reason the numbers first suggest',
  },
  {
    id: 'youtube',
    title: 'YouTube Trending Analytics',
    blurb: 'Forensics on 40,000 trending videos across 10 regions: what predicts a spot on the board, how long it survives, and which signals are noise.',
    stack: ['YouTube API', 'pandas', 'scikit-learn', 'Plotly'],
    href: '/projects/data/youtube',
    linkLabel: 'Case study',
    featured: true,
    note: 'a trending video lives 38 hours',
  },
  {
    id: 'grocery',
    title: 'Woolworths vs Coles Price Analytics',
    blurb: 'Competitor benchmarking on public data: two retailers’ prices matched into identical product pairs and tracked in a dbt warehouse, over a year of history checked against my own collection at 99.97%. Parity rate, gap, promotion behaviour, and store brand against name brand.',
    stack: ['Python', 'dbt', 'DuckDB', 'rapidfuzz'],
    href: '/projects/data/grocery',
    linkLabel: 'Case study',
    featured: true,
    note: '7.1% parity in household, 62.5% in pantry',
  },
  {
    id: 'saas',
    title: 'SaaS Sales & Revenue Analytics',
    blurb: 'MRR, churn, NRR and CLV from 12.5K invoices through a tested dbt pipeline of 8 models and 44 data tests, with cohort retention as the centrepiece.',
    stack: ['dbt', 'SQL', 'DuckDB', 'BigQuery'],
    href: '/projects/data/saas',
    linkLabel: 'Case study',
    featured: true,
    note: 'discount cohort retained 37% vs 71%',
  },
]

/* Featured order is the argument the page makes: production rigour, then
   system design, then the warehouse, then shipping for real users. The
   hackathon builds carry real awards but their code lives in teammates'
   repos, so they sit in the index row rather than holding a full card.
   Ignite sits there too: it is real and live, but a ten-person student
   platform is the weakest of the five candidates for a full card. */
export const softwareProjects: IndexedProject[] = [
  {
    id: 'research-dashboard',
    title: 'Research Dashboard',
    blurb: 'Fund manager research dashboard for an investment research house, built to run embedded in another product’s iframe. No application database — each manager’s document-library folder is the record, read live through Microsoft Graph.',
    stack: ['Next.js', 'TypeScript', 'Microsoft Graph', 'SharePoint', 'Vercel Edge Config'],
    href: 'https://research-dashboard-demo.vercel.app/demo',
    linkLabel: 'Live demo',
    featured: true,
    note: 'built for an investment research house',
    live: true,
    solo: true,
  },
  {
    id: 'ratemyaccom',
    title: 'Rate My Accom NSW',
    blurb: 'Review platform for NSW student housing, with university-email verification, multi-dimensional ratings, request hardening and rate limiting.',
    stack: ['Next.js 14', 'TypeScript', 'Zod', 'React Hook Form', 'Jest'],
    href: 'https://ratemyaccom-beryl.vercel.app/',
    linkLabel: 'Live demo',
    featured: true,
    note: 'production',
    live: true,
    solo: true,
  },
  {
    id: 'haven',
    title: 'Haven',
    blurb: 'Consent-first Android app for couples where the sharing rules are enforced by the schema: symmetric grants, and no location history to leak.',
    stack: ['Kotlin', 'Jetpack Compose', 'Ktor', 'PostgreSQL', 'WebSockets'],
    href: 'https://github.com/MelvinDY/Haven',
    linkLabel: 'Source',
    featured: true,
    note: 'private repo',
    solo: true,
  },
  {
    id: 'dora',
    title: 'DORA',
    blurb: 'Snowflake warehouse computing the four DORA delivery metrics, enriched in-warehouse with Cortex and fronted by an agent that answers plain-English questions over a curated semantic layer.',
    stack: ['Python', 'Snowflake', 'dbt', 'DuckDB', 'Streamlit', 'Claude'],
    href: 'https://github.com/MelvinDY/DORA',
    linkLabel: 'Source',
    featured: true,
    note: 'data platform',
    solo: true,
  },
  {
    id: 'confluence-qa',
    title: 'Podium',
    blurb: 'Q&A platform for Atlassian townhalls, published on the Atlassian Marketplace and still in use there: an eight-table Forge SQL schema, and voice questions transcribed by Whisper into structured rows.',
    stack: ['TypeScript', 'Atlassian Forge', 'Forge SQL', 'MySQL', 'OpenAI Whisper', 'GPT-4o-mini'],
    href: 'https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-3900-w18a-cherry',
    linkLabel: 'Source',
    featured: true,
    note: 'COMP3900 capstone · team of 6',
    live: true,
  },
  {
    id: 'ignite',
    title: 'Ignite',
    blurb: 'The official PPIA UNSW platform, carrying member profiles, event tooling and a directory for the Indonesian student community.',
    stack: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Node.js'],
    href: 'https://github.com/MelvinDY/ignite',
    linkLabel: 'Source',
    note: 'team of 10',
    live: true,
  },
  {
    id: 'peersuade',
    title: 'Peersuade',
    blurb: 'Live multiplayer debate game where players argue random prompts and an audience swings the vote in real time.',
    stack: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Tailwind'],
    href: 'https://politics-game.vercel.app/',
    linkLabel: 'Live demo',
    note: 'UNIHACK 2026 · Most Fun + Best Design',
    live: true,
    awards: 2,
  },
  {
    id: 'onlycode',
    title: 'OnlyCode',
    blurb: 'Gamified peer-to-peer coding platform with real-time collaboration, skill-based matchmaking and sandboxed execution.',
    stack: ['React', 'TypeScript', 'WebSocket', 'Monaco', 'Judge0'],
    href: 'https://github.com/tangkenzee/OnlyCode',
    linkLabel: 'Source',
    note: '1st · CSESoc Flagship 2025',
    awards: 1,
  },
  {
    id: 'stall-wars',
    title: 'Stall Wars',
    blurb: 'Two-player toilet-themed arcade game covering rhythm, RPS, snake and pong, all built inside 48 hours.',
    stack: ['React', 'JavaScript', 'Vite'],
    href: 'https://github.com/MelvinDY/Stall_Wars',
    linkLabel: 'Source',
    note: 'Golden Rubbish Bin · Terrible Ideas Hackathon',
    awards: 1,
  },
  {
    id: 'portfolio',
    title: 'This site',
    blurb: 'Next.js portfolio with an MDX blog, an AI chatbox, a hidden mini-RPG and a first-party analytics pipeline feeding /stats.',
    stack: ['Next.js', 'TypeScript', 'Neon Postgres', 'Three.js', 'MDX'],
    href: 'https://github.com/MelvinDY/portfolio',
    linkLabel: 'Source',
    note: 'you are looking at it',
    live: true,
    solo: true,
  },
]

export const allProjects = [...dataProjects, ...softwareProjects]
