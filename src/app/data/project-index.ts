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
}

export const dataProjects: IndexedProject[] = [
  {
    id: 'labour-market',
    title: 'Australian Labour Market Dashboard',
    blurb: 'Live ABS data ingested in Python, modelled through a staging→mart layer in Azure SQL, and reported in Power BI generated as code.',
    stack: ['ABS API', 'Azure SQL', 'Power BI', 'DAX', 'Python'],
    href: '/projects/data/labour-market',
    linkLabel: 'Case study',
    featured: true,
    note: '80% of working men are full-time, 57% of women',
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
    blurb: 'Same-day prices from both retailers’ public APIs, fuzzy-matched into identical product pairs and compared in a DuckDB warehouse.',
    stack: ['Python', 'DuckDB', 'rapidfuzz', 'Entity resolution'],
    href: '/projects/data/grocery',
    linkLabel: 'Case study',
    featured: true,
    note: '$1.82 apart on a 50-item basket',
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
   system design, then shipping for real users, then applied AI. The hackathon
   builds carry real awards but their code lives in teammates' repos, so they
   sit in the index row rather than holding a full card. */
export const softwareProjects: IndexedProject[] = [
  {
    id: 'ratemyaccom',
    title: 'Rate My Accom NSW',
    blurb: 'Review platform for NSW student housing, with university-email verification, multi-dimensional ratings, request hardening and rate limiting.',
    stack: ['Next.js 14', 'TypeScript', 'Zod', 'React Hook Form', 'Jest'],
    href: 'https://ratemyaccom-beryl.vercel.app/',
    linkLabel: 'Live demo',
    featured: true,
    note: 'production',
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
  },
  {
    id: 'ignite',
    title: 'Ignite',
    blurb: 'The official PPIA UNSW platform, carrying member profiles, event tooling and a directory for the Indonesian student community.',
    stack: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Node.js'],
    href: 'https://github.com/MelvinDY/ignite',
    linkLabel: 'Source',
    featured: true,
    note: 'team of 10',
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
  },
  {
    id: 'peersuade',
    title: 'Peersuade',
    blurb: 'Live multiplayer debate game where players argue random prompts and an audience swings the vote in real time.',
    stack: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Tailwind'],
    href: 'https://politics-game.vercel.app/',
    linkLabel: 'Live demo',
    note: 'UNIHACK 2026 · Most Fun + Best Design',
  },
  {
    id: 'onlycode',
    title: 'OnlyCode',
    blurb: 'Gamified peer-to-peer coding platform with real-time collaboration, skill-based matchmaking and sandboxed execution.',
    stack: ['React', 'TypeScript', 'WebSocket', 'Monaco', 'Judge0'],
    href: 'https://github.com/tangkenzee/OnlyCode',
    linkLabel: 'Source',
    note: '1st · CSESoc Flagship 2025',
  },
  {
    id: 'stall-wars',
    title: 'Stall Wars',
    blurb: 'Two-player toilet-themed arcade game covering rhythm, RPS, snake and pong, all built inside 48 hours.',
    stack: ['React', 'JavaScript', 'Vite'],
    href: 'https://github.com/MelvinDY/Stall_Wars',
    linkLabel: 'Source',
    note: 'Golden Rubbish Bin · Terrible Ideas Hackathon',
  },
  {
    id: 'portfolio',
    title: 'This site',
    blurb: 'Next.js portfolio with an MDX blog, an AI chatbox, a hidden mini-RPG and a first-party analytics pipeline feeding /stats.',
    stack: ['Next.js', 'TypeScript', 'Neon Postgres', 'Three.js', 'MDX'],
    href: 'https://github.com/MelvinDY/portfolio',
    linkLabel: 'Source',
    note: 'you are looking at it',
  },
]

export const allProjects = [...dataProjects, ...softwareProjects]
