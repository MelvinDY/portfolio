/**
 * About-page content.
 *
 * Lifted from the existing page and kept in the author's voice, per Section
 * 11.C. Two systematic changes: the 17 em-dashes are rewritten into sentences,
 * commas or colons, and the 8 emoji are dropped, since Section 3.D discourages
 * them and here they were decorating list items rather than carrying meaning.
 *
 * Work and education are one array with a `kind` flag rather than two. The old
 * page put them behind tabs, which hid half a career behind a click on the
 * page whose entire job is to show it.
 */

export interface Entry {
  kind: 'work' | 'education'
  year: string
  role: string
  org: string
  period: string
  points: string[]
  tags?: string[]
  /** Awards attached to a study period. */
  awards?: { title: string; detail: string }[]
  status?: string
}

export const hero = {
  kicker: 'The person behind the charts',
  hookLead: 'Hi, I am Melvin Darial Yogiana.',
  hookTail: 'I make data make sense.',
  intro:
    'An Indonesian Computer Science graduate from UNSW, building in Sydney. The degree made me an engineer and the work made me an analyst, and the analyst is the one I am betting on. Fully addicted to the moment a messy spreadsheet finally tells you something true.',
  photo: { src: '/melvin.jpg', alt: 'Melvin Darial Yogiana' },
}

export const socials = [
  { label: 'GitHub', href: 'https://github.com/MelvinDY' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/melvin-yogiana/' },
  { label: 'Email', href: 'mailto:melvindarialyogiana@gmail.com' },
]

/* The story used to name neither employer, so the two roles that most prove the
   analyst-and-engineer claim were invisible on the page whose job is to make it.
   Foresight and Atlassian now carry a paragraph each, and the hackathons get
   their own rather than sharing one with the community work. Voice, humour and
   the coffee closer are the author's, kept per Section 11.C. */
export const story = [
  'I came to Sydney to study Computer Science at UNSW, and somewhere between a database lecture and my third hackathon I realised I had fallen for two things at once: finding the story hiding in data, and building the thing that puts that story in front of people. Most developers pick a lane. I genuinely could not, so I lean into both, and the two halves feed each other: the analyst makes my software honest, and the engineer makes my analysis usable.',
  'If you want the short version of where that is going, it is the analyst seat. The engineering is not a hedge and it is not a fallback. It is the reason I can take a question from the raw extract all the way to the thing somebody makes a decision in, without handing it to another team halfway and hoping the definitions survive the trip.',
  'At Foresight Analytics that split turned into a job title. Day to day I turn LSEG and Bloomberg market data into models the firm can actually report on, with the pipelines running on Azure. The rest of the time I build the tooling around it. The piece I care most about is an internal research dashboard that reads a SharePoint list live through the Microsoft Graph API. I chose SharePoint on purpose, so the research team can keep maintaining it without a developer long after I have gone, and whatever they edit there flows back into the SQL database.',
  'Before that I spent a semester building with UNSW and Atlassian on a secure real-time Q&A platform for their town halls. I finished as top contributor at 121 commits, though the part I am quietly proudest of is less flashy: a three-layer test setup across the API, the integrations and the UI, plus the moderator tooling, so nothing could fall over while a few hundred people were watching.',
  'Hackathons are where I learned to actually ship. First place at the CSESoc flagship, two categories at UNIHACK 2026, and one gloriously cursed Golden Rubbish Bin for the most absurd idea with the best execution. They teach you the thing a degree does not: how to cut scope at 3am and still walk into the demo with something that works.',
  'I also help run tech for PPIA UNSW, the Indonesian student community here, because building things that bring people together is the whole reason I started. When I am not coding you will find me hunting Sydney’s coffee scene, planning the next trip, or quietly turning caffeine into commits.',
]

export const facts = [
  { value: 'UNSW', label: 'Computer Science' },
  { value: '2026', label: 'Graduated' },
  { value: 'Sydney', label: 'Based in AU' },
  { value: '4×', label: 'Award wins' },
]

export const entries: Entry[] = [
  {
    kind: 'work',
    year: '2026',
    role: 'Data Analyst and Automation Engineer Intern',
    org: 'Foresight Analytics',
    period: 'May 2026 to present, Sydney AU',
    /* Written to parse cleanly in an applicant tracking system: each line opens
       with a past-tense action verb, names the technology in the form a keyword
       filter searches for, and states what was built rather than what was
       assisted with. The internal product this embeds into is not named, and no
       client, fund or methodology appears, because the work belongs to the
       employer. The terms that do appear are standard funds-management
       vocabulary. */
    points: [
      'Transformed LSEG and Bloomberg market data into the firm’s internal reporting models, supporting analytics pipelines on Azure across investment diligence, ratings research and ESG datasets.',
      'Worked daily in Excel and R, the tools the firm’s legacy data models run on, transforming datasets and building the charts that feed internal reporting.',
      'Built and shipped an internal research dashboard in Next.js and TypeScript, giving the research team one view of fund manager coverage, approved and recommended product list status, classification and internal ratings.',
      'Modelled it on a SharePoint list read live through the Microsoft Graph API so the research team can maintain it without a developer after handover, with dashboard edits propagating back to the company SQL database.',
      'Implemented session-based authentication, role-restricted admin configuration and access-key gating for embedded delivery, plus a mock data mode enabling development without production tenant credentials.',
      'Built video automation pipelines generating recurring market-update content with Gemini, ElevenLabs and Remotion, plus n8n workflows streamlining internal data operations for a boutique investment intelligence firm serving 50+ Australian asset managers.',
    ],
    tags: ['Azure', 'SQL', 'LSEG', 'Bloomberg', 'Next.js', 'TypeScript', 'Microsoft Graph', 'SharePoint', 'n8n', 'Databricks'],
  },
  {
    kind: 'work',
    year: '2025',
    role: 'Software Developer',
    org: 'Podium — AI-powered Q&A platform for Confluence (Atlassian Forge)',
    period: 'Sep 2025 to Dec 2025, UNSW COMP3900 capstone, Sydney AU',
    /* Rewritten to lead with the data work rather than the commit count: the
       schema and the migrations, the Whisper-to-GPT pipeline, and the tests
       that guard it. Same project, told for a reader hiring for pipelines. */
    points: [
      'Designed and implemented a relational database schema across 8 tables on Forge SQL (MySQL), writing 58 version-controlled schema migrations to support structured data for events, questions, voting and moderation.',
      'Built an ETL-style data pipeline integrating OpenAI Whisper for speech-to-text and GPT-4o-mini, transforming unstructured voice recordings into clean, structured text data written back to the production database.',
      'Engineered a chunked-upload data ingestion workflow to reliably move large audio payloads through a serverless backend, working within platform size constraints.',
      'Wrote automated data validation and integration tests in Jest, Mocha and WebdriverIO to verify data integrity and correctness across the pipeline, from ingestion through transformation to storage.',
      'Configured CI/CD automation with GitHub Actions to run tests and validate builds on every commit, aligned with Atlassian engineering standards.',
      'Collaborated in an agile team of 6 to ship a data-driven application for hybrid Atlassian developer townhalls, published on the Atlassian Marketplace and handed over to Atlassian’s developer advocate for ongoing use.',
    ],
    tags: ['Forge SQL', 'MySQL', 'TypeScript', 'OpenAI Whisper', 'GPT-4o-mini', 'ETL', 'Jest', 'WebdriverIO', 'GitHub Actions', 'CI/CD'],
  },
  {
    kind: 'work',
    year: '2025',
    role: 'Frontend Lead',
    org: 'PPIA UNSW',
    period: 'Aug 2025 to Nov 2025, Sydney AU',
    /* Rewritten against the repo rather than from memory, so the named stack
       matches what a reader would find in it: React 19 on Vite with React
       Router, not the Next.js the tags used to claim. The team, mentoring and
       stakeholder lines are the author's own and stay as written. */
    points: [
      'Led frontend development for Ignite, the official PPIA UNSW membership platform, building a React 19 and TypeScript application on Vite with Tailwind CSS, React Router and Radix UI.',
      'Architected a component-based frontend around shared UI primitives and Zod-validated forms, enabling 3 sub-teams to build member profiles, the events feed and the community directory in parallel without integration conflicts.',
      'Integrated the client with an Express and TypeScript REST API over Supabase PostgreSQL, covering JWT session authentication, email OTP verification, profile management, connection requests and directory search.',
      'Wrote frontend unit and integration tests with Vitest, React Testing Library and Mock Service Worker, mocking the documented API so interface work could proceed independently of backend delivery.',
      'Led a 10-person cross-functional team with structured agile governance: daily standups, sprint reviews and documented workflows, mentoring 4 junior developers on code review, Git workflows and development standards.',
      'Drove stakeholder alignment through bi-weekly demos with the PPIA board, translating feedback into 15+ feature enhancements.',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Zod', 'Supabase', 'PostgreSQL', 'Vitest', 'Agile', 'Team leadership'],
  },
  {
    kind: 'education',
    year: '2026',
    role: 'Data and Cloud Engineering',
    org: 'Self-directed',
    period: '2026 to present, DataCamp, Microsoft, Databricks',
    points: [
      'Deepening expertise in data analytics, analytics engineering and data engineering through structured coursework on DataCamp.',
      'Preparing for Microsoft Azure and Databricks certifications to formalise the cloud and lakehouse skills used on the job.',
    ],
    status: 'In progress',
  },
  {
    kind: 'education',
    year: '2023',
    role: 'Bachelor of Science, Computer Science',
    org: 'University of New South Wales',
    period: '2023 to 2026, GPA 3.00 / 4.00',
    points: [],
    awards: [
      {
        title: 'First place, CSESoc Flagship Hackathon 2025',
        detail: 'OnlyCode, a gamified peer-to-peer coding platform with real-time collaboration and skill-based matchmaking.',
      },
      {
        title: 'UNIHACK 2026, Most Fun Idea and Best Design',
        detail: 'Peersuade, a real-time persuasion game. Two category wins.',
      },
      {
        title: 'Terrible Ideas Hackathon, Most Absurd Idea with Best Execution',
        detail: 'Stall Wars, a chaotic toilet-themed two-player arcade game built in 48 hours.',
      },
    ],
    status: 'Finished Jan 2026',
  },
  {
    kind: 'education',
    year: '2022',
    role: 'Diploma in Computer Science',
    org: 'UNSW College',
    period: '2022 to 2023, Sydney AU',
    points: [
      'UNSW International Student Award, recognised for academic work and contribution to the UNSW community as an international student.',
    ],
    status: 'Completed',
  },
]

/**
 * The two lists a keyword scan actually reads, since the resume builds its
 * Skills section from them.
 *
 * Widened against the public repos rather than from memory, so every entry has
 * something behind it: dbt, DuckDB and BigQuery from the SaaS and YouTube
 * pipelines, Looker Studio (the real product name, where this said "Looker"),
 * Jupyter from the notebook work, and on the build side Vite, Zod, Vitest,
 * Docker, GitHub Actions and the Java queue service.
 *
 * Excel and R are here because they are the daily job, not despite it. The
 * legacy models at work run on both, and Excel is the single most-requested
 * tool in analyst ads. A list that hides them to look more modern is a list
 * that fails the keyword scan it exists to pass.
 */
export const toolbox = [
  {
    title: 'Data and analytics',
    note: 'analyse',
    chips: ['SQL', 'Excel', 'Python', 'R', 'pandas', 'NumPy', 'dbt', 'DuckDB', 'BigQuery', 'Azure SQL', 'PostgreSQL', 'Snowflake', 'Power BI', 'Looker Studio', 'Tableau', 'scikit-learn', 'Jupyter'],
  },
  {
    title: 'Software and web',
    note: 'build',
    chips: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Vite', 'Supabase', 'PostgreSQL', 'Tailwind', 'Zod', 'WebSocket', 'Vitest', 'Jest', 'Docker', 'GitHub Actions', 'Java', 'Git'],
  },
]
