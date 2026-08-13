/**
 * The long version of each featured software build — what opens behind the
 * "See more" button on /projects/software.
 *
 * Every claim here is carried over from copy that was already on the site or
 * from the repos themselves. Nothing is inferred: where a fact isn't known
 * (`role`, mostly) the field is left off entirely and the sheet omits its row
 * rather than printing a guess. A portfolio is the last place to round up.
 */

export interface Shot {
  /** Path under /public. */
  src: string
  /** What the reader is looking at — not a restatement of the project name. */
  caption: string
  /** Alt text for anyone who can't see it. */
  alt: string
}

export interface ProjectDetail {
  id: string
  title: string
  /** The one-line positioning, same as the card's sub. */
  sub: string
  /** Two or three sentences: what it is and why it was built. */
  summary: string
  /** A single line of why it's interesting. Set in the serif italic used for
   *  emphasis elsewhere on the site, so the page has one voice. */
  pull?: string
  /** What is actually notable, technically. Three or four, not ten. */
  highlights: string[]
  /** Facts rail. Anything undefined is omitted — never rendered as "N/A". */
  year?: string
  team?: string
  role?: string
  status?: string
  stack: string[]
  links: { label: string; href: string; primary?: boolean }[]
  /** Empty is fine and common — the sheet drops the gallery entirely rather
   *  than showing a placeholder frame. */
  shots: Shot[]
}

export const projectDetails: Record<string, ProjectDetail> = {
  peersuade: {
    id: 'peersuade',
    title: 'Peersuade',
    sub: 'Real-time debate & persuasion game',
    summary:
      'A live multiplayer game where players are handed wildly random prompts and have to argue them convincingly, while an audience watches and swings the vote in real time. Built at UNIHACK 2026 and judged across the whole field on fun and on design. It took both categories.',
    pull: 'The audience is a player, not a spectator. The vote moves while you are still talking.',
    highlights: [
      'Vote state pushed over WebSocket, so the room reacts while an argument is still in progress',
      'Audience participation is the scoring mechanism rather than a side channel',
      'Won two UNIHACK 2026 categories: Most Fun and Best Design',
      'Shipped inside a hackathon weekend and still standing as a live deploy',
    ],
    year: '2026',
    status: 'Live',
    stack: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Tailwind'],
    links: [
      { label: 'Live demo', href: 'https://politics-game.vercel.app/', primary: true },
      { label: 'GitHub', href: 'https://github.com/MelvinDY' },
      { label: 'Devpost', href: 'https://devpost.com/software/peersuade' },
      { label: 'Winners list', href: 'https://medium.com/unihack-blog/unihack-2026-the-full-list-of-winners-and-honorable-mentions-a68e8b120dc3' },
    ],
    shots: [
      {
        src: '/projects/peersuade/lobby.jpg',
        caption: 'The entry screen. Host a room or join one that is already running.',
        alt: 'Peersuade entry screen: the game wordmark in yellow over a purple dotted background, with Create Game and Join Game buttons.',
      },
    ],
  },

  ignite: {
    id: 'ignite',
    title: 'Ignite',
    sub: 'PPIA UNSW networking platform',
    summary:
      'The official platform for PPIA UNSW, the Indonesian student association, carrying member profiles, event tooling and a directory that connects the community. Built and shipped with a team of ten contributors, which made the architecture the hard part rather than any single feature.',
    pull: 'Ten contributors on one codebase is an organisational problem before it is a technical one.',
    highlights: [
      'Modular architecture chosen so ten contributors could work without colliding',
      'Member profiles and a searchable community directory',
      'Event tooling for the organisation’s own calendar',
      'Supabase and PostgreSQL behind a TypeScript/React front end',
    ],
    year: '2025',
    team: '10 contributors',
    status: 'Live',
    stack: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Node.js'],
    links: [{ label: 'GitHub', href: 'https://github.com/MelvinDY/ignite', primary: true }],
    shots: [],
  },

  'confluence-qa': {
    id: 'confluence-qa',
    title: 'Podium',
    sub: 'On the Marketplace, in use at Atlassian',
    summary:
      'A Q&A platform for hybrid Atlassian developer townhalls, built as an Atlassian Forge app inside Confluence. It did not stop at the demo: it was published on the Atlassian Marketplace and handed over to Atlassian’s developer advocate, who still runs it for their townhalls. Attendees ask, vote and are moderated in one place, and a question can arrive as speech: the recording is transcribed with Whisper, cleaned up with GPT-4o-mini and written back as structured rows. Built as the UNSW software-engineering capstone (COMP3900) by a team of six working an agile cycle.',
    pull: 'A question asked out loud is not data until something writes it down properly.',
    highlights: [
      'Eight-table relational schema on Forge SQL (MySQL) covering events, questions, voting and moderation, evolved through 58 version-controlled migrations',
      'ETL-style pipeline turning voice recordings into clean structured text with OpenAI Whisper and GPT-4o-mini, written back to the production database',
      'Chunked-upload ingestion, so large audio payloads move through a serverless backend within the platform’s size limits',
      'Data validation and integration tests in Jest, Mocha and WebdriverIO, covering ingestion, transformation and storage',
      'GitHub Actions running the tests and validating the build on every commit',
      'Shipped past the classroom: published on the Atlassian Marketplace and handed to Atlassian’s developer advocate, still running their townhalls today',
    ],
    year: '2025',
    team: '6 students',
    status: 'Published, in use at Atlassian',
    stack: ['TypeScript', 'Atlassian Forge', 'Forge SQL', 'MySQL', 'OpenAI Whisper', 'GPT-4o-mini', 'Jest', 'WebdriverIO'],
    links: [
      { label: 'GitHub', href: 'https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-3900-w18a-cherry', primary: true },
    ],
    shots: [],
  },

  haven: {
    id: 'haven',
    title: 'Haven',
    sub: 'Consent-first sharing, enforced in the schema',
    summary:
      'An Android app for two people who both choose a period of openness: where they are right now, a safe-arrival check-in, how they are feeling. The interesting part is not the feature list, it is that the consent rules are structural. The architecture cannot express a one-way share, so the app cannot be turned into a monitoring tool by someone who wants one.',
    pull: 'The strongest privacy guarantee is the table you decided not to create.',
    highlights: [
      'Sharing is pair-symmetric by construction: the server only serves a shared feature while both partners hold an active grant, and a one-way share endpoint does not exist',
      'No locations table anywhere. Live position sits in an in-memory TTL store, overwritten in place, so a breach or a subpoena reaches one current point rather than a history',
      'A Consent Service checks every read of shared data against per-user, per-feature, revocable grants',
      'Either partner can revoke instantly, or dissolve the pair and wipe the shared data unilaterally, with no approval from the other side',
      'Phone-OTP into a signed JWT where the identity is a hashed phone number, with a per-user WebSocket hub and FCM push for backgrounded devices',
    ],
    year: '2026',
    status: 'In development',
    stack: ['Kotlin', 'Jetpack Compose', 'Ktor', 'Exposed', 'PostgreSQL', 'WebSockets', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/MelvinDY/Haven', primary: true },
    ],
    /* The repo carries four screenshots under docs/screenshots. They are not
       copied into /public yet, and the sheet drops the gallery rather than
       showing a placeholder frame. */
    shots: [],
  },
  ratemyaccom: {
    id: 'ratemyaccom',
    title: 'Rate My Accom NSW',
    sub: 'Student accommodation reviews',
    summary:
      'A review platform for NSW student housing, built to the standard a real review site needs rather than a demo: reviewers verify with a university email, ratings are multi-dimensional instead of a single star count, and the whole thing is hardened against the abuse a public review form attracts.',
    pull: 'A review site lives or dies on whether you can trust who is writing the reviews.',
    highlights: [
      'University-email verification gates who is allowed to leave a review',
      'Multi-dimensional ratings rather than one blunt star score',
      'XSS and CSRF protection with rate limiting on the write paths',
      'Schema-validated forms and a Jest suite covering the critical flows',
    ],
    status: 'Production',
    stack: ['Next.js 14', 'TypeScript', 'Zod', 'React Hook Form', 'Jest', 'TailwindCSS'],
    links: [
      { label: 'Live demo', href: 'https://ratemyaccom-beryl.vercel.app/', primary: true },
      { label: 'GitHub', href: 'https://github.com/MelvinDY/ratemyaccom' },
    ],
    shots: [
      {
        src: '/projects/ratemyaccom/home.jpg',
        caption: 'The front page. An editorial layout carrying the live review counts.',
        alt: 'Rate My Accom home page: the headline “Where you’ll study” beside a browse call to action and counters reading 32 properties, 160 reviews and a 4.5 average.',
      },
    ],
  },
}
