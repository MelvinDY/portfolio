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
    'An Indonesian Computer Science student at UNSW, building in Sydney. Equal parts analyst and engineer, and fully addicted to the moment a messy spreadsheet finally tells you something true.',
  photo: { src: '/melvin.jpg', alt: 'Melvin Darial Yogiana' },
}

export const socials = [
  { label: 'GitHub', href: 'https://github.com/MelvinDY' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/melvin-yogiana/' },
  { label: 'Email', href: 'mailto:melvindarialyogiana@gmail.com' },
]

export const story = [
  'I came to Sydney to study Computer Science at UNSW, and somewhere between a database lecture and my third hackathon I realised I had fallen for two things at once: finding the story hiding in data, and building the thing that puts that story in front of people.',
  'Most developers pick a lane. I genuinely could not. So I lean into both. I will spend a weekend untangling ABS labour statistics or matching supermarket prices, then turn around and ship a full-stack app with a team under deadline. The two halves feed each other: the analyst makes my software honest, and the engineer makes my analysis usable.',
  'Along the way I have been lucky enough to win a few rooms: a hackathon first place, two UNIHACK 2026 categories, and one gloriously cursed Golden Rubbish Bin. I also help run tech for PPIA UNSW, the Indonesian student community here, because building things that bring people together is the whole reason I started.',
  'When I am not coding you will find me hunting Sydney’s coffee scene, planning the next trip, or quietly turning caffeine into commits.',
]

export const facts = [
  { value: 'UNSW', label: 'Computer Science' },
  { value: '2026', label: 'Graduating' },
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
    points: [
      'Building automation workflows with n8n to streamline internal data operations for a boutique investment intelligence firm serving 50+ Australian asset managers.',
      'Supporting data analytics pipelines using Excel, Azure SQL and Databricks, working across investment diligence, ratings research and ESG datasets.',
      'Conducting market and product research to inform analytical frameworks and data strategy within a DataOps-driven environment.',
    ],
    tags: ['n8n', 'Azure SQL', 'Databricks', 'Excel', 'Research', 'DataOps'],
  },
  {
    kind: 'work',
    year: '2025',
    role: 'Software Developer',
    org: 'UNSW × Atlassian',
    period: 'Sep 2025 to Dec 2025, Sydney AU',
    points: [
      'Led development of an enterprise Q&A system as top contributor with 121 commits, delivering a secure real-time audience interaction platform for Atlassian town halls.',
      'Designed and implemented three-layer end-to-end testing infrastructure across API, integration and UI, with an automated CI pipeline.',
      'Built backend services with SQL schema design, implementing structured data validation and access controls across resolvers and API endpoints.',
      'Developed a moderator dashboard with role-based permissions, audit trail tracking and session facilitation controls.',
    ],
    tags: ['TypeScript', 'React', 'GraphQL', 'SQL', 'CI/CD', 'Testing'],
  },
  {
    kind: 'work',
    year: '2025',
    role: 'Frontend Lead',
    org: 'PPIA UNSW',
    period: 'Aug 2025 to Nov 2025, Sydney AU',
    points: [
      'Led a 10-person cross-functional team with structured agile governance: daily standups, sprint reviews and documented workflows.',
      'Drove stakeholder alignment through bi-weekly demos with the PPIA board, translating feedback into 15+ feature enhancements.',
      'Mentored 4 junior developers on code review, Git workflows and development standards.',
      'Architected a component-based frontend enabling parallel development by 3 sub-teams without integration conflicts.',
    ],
    tags: ['React', 'Next.js', 'Agile', 'Team leadership', 'Code review'],
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
    period: '2023 to 2025, GPA 3.00 / 4.00',
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
    status: 'Graduated Dec 2025',
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

export const toolbox = [
  {
    title: 'Data and analytics',
    note: 'analyse',
    chips: ['SQL', 'Python', 'pandas', 'NumPy', 'dbt', 'Snowflake', 'PostgreSQL', 'Tableau', 'Looker', 'scikit-learn'],
  },
  {
    title: 'Software and web',
    note: 'build',
    chips: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Tailwind', 'WebSocket', 'Git'],
  },
]
