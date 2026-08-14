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
  /** How the shots are framed. Everything defaults to a 16:9 plate; a phone
   *  build gets a 9:19.5 one, letterboxed inside the same 16:9 hole so the
   *  page keeps one plate size and the screenshot is not cropped to fit. */
  shape?: 'wide' | 'phone'
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
    /* Every session, code and name in these shots is seeded demo data. The
       product is real; the townhall in the screenshots is not. */
    shots: [
      {
        src: '/projects/podium/attendee.jpg',
        caption: 'What an attendee gets: one box to ask, an anonymity toggle, and a queue that sorts itself by votes.',
        alt: 'Podium attendee view of a live townhall. An “Ask the room” box with an ask-anonymously toggle sits above nine questions sorted by votes, the top one at 63 votes and marked being asked now. A side panel shows the join code and the house rules.',
      },
      {
        src: '/projects/podium/dashboard-live.jpg',
        caption: 'The moderator’s room mid-session: six counters, the queue, and a voice answer partway through the pipeline.',
        alt: 'Podium moderator dashboard during a live session, with counters for questions, answered, pinned, flagged, people in the room and votes cast, a question queue below, and a side panel transcribing a spoken answer.',
      },
      {
        src: '/projects/podium/voice-answer.jpg',
        caption: 'A spoken answer moving through the pipeline: captured, uploaded in chunks, Whisper, GPT-4o-mini, written back under the question.',
        alt: 'Podium panel showing a recorded answer progressing through five steps — captured, uploaded in four chunks, transcribing with Whisper, cleaning up with GPT-4o-mini, written back to the question — beside a question queue where one answer already appears as tidied text.',
      },
      {
        src: '/projects/podium/presentation.jpg',
        caption: 'Presentation mode. The question being asked, what is queued behind it, and the join code on the same slide.',
        alt: 'Podium presentation mode on a dark ground: the current question set large with its vote count, three queued questions listed beside it, and a QR code with the six-character join code along the bottom.',
      },
      {
        src: '/projects/podium/events.jpg',
        caption: 'Every session in the workspace — live, scheduled and ended — each with its code and question volume.',
        alt: 'Podium events table listing five sessions with their space, time, six-character code, a question-volume sparkline, attendance and a status lozenge reading live, scheduled or ended.',
      },
      {
        src: '/projects/podium/home-join.jpg',
        caption: 'Joining. Six characters, read out by the host or projected on the last slide.',
        alt: 'Podium home page inside Confluence with a six-box code entry for joining a session, a list of the user’s events, and a live session card showing 247 in the room and three moderators on duty.',
      },
    ],
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
    /* Three of the twenty screenshots the repo keeps under docs/screenshots,
       copied across as-is. The app's interface language is Indonesian, so the
       captions say what the screen does rather than transliterating it. */
    shape: 'phone',
    shots: [
      {
        src: '/projects/haven/pairing.png',
        caption: 'Pairing. One partner sends the code, the other enters it — there is no third path in.',
        alt: 'Haven pairing screen on a dark purple ground, headed “Sekarang, kalian.”, offering two cards: invite your partner by sending a code, or enter a code you were sent.',
      },
      {
        src: '/projects/haven/sharing.png',
        caption: 'The sharing switchboard. Live location is running with six minutes left on it; everything else is off, and says so.',
        alt: 'Haven sharing screen listing live location, safe-arrival, plans and a shared space. Live location reads “active, both of you, 6 minutes left” with a stop button; the rest read “off, and that is normal”.',
      },
      {
        src: '/projects/haven/home.png',
        caption: 'Home. Both moods side by side, and a location share you start by choosing how long it lasts.',
        alt: 'Haven home screen with a glowing mascot face, a row showing each partner’s current mood, quick context chips, a send-a-hug button, and a location card offering 15 minute, 1 hour, 3 hour and 12 hour durations.',
      },
    ],
  },

  dora: {
    id: 'dora',
    title: 'DORA',
    sub: 'Engineering-delivery warehouse with an analytics agent',
    summary:
      'A Snowflake warehouse that computes the four DORA metrics — deployment frequency, lead time for changes, change failure rate, time to restore — from ingested delivery events, enriches them in-warehouse with Cortex, and puts a Claude analytics agent in front of a curated semantic layer so the questions can be asked in plain English. It runs on a synthetic event generator rather than any real organisation’s delivery data, which is what makes the whole pipeline shareable.',
    pull: 'The agent never sees the schema. It sees the semantic model someone chose to give it.',
    highlights: [
      'The agent reads only semantic_model.yaml, never INFORMATION_SCHEMA, and runs three tools: run_sql, search_incidents and get_metric_definition',
      'Layered guardrails: sqlglot rejects anything that is not a single allowlisted SELECT, and the read-only warehouse role is the hard stop behind it',
      'staging → conformed → marts in dbt, fed by a FastAPI webhook receiver and per-source REST backfill',
      'Cortex classifies pull requests and summarises and embeds incidents; a local deterministic twin runs the same pipeline on DuckDB with no Snowflake account',
      'The delivery events are generated, not scraped: a payload-accurate, story-seeded simulator stands in for a real org, so the numbers on screen are the generator’s, not a customer’s',
    ],
    year: '2026',
    status: 'Built end to end',
    role: 'Solo',
    stack: ['Python', 'Snowflake', 'dbt', 'DuckDB', 'Streamlit', 'Claude', 'sqlglot', 'FastAPI'],
    links: [{ label: 'GitHub', href: 'https://github.com/MelvinDY/DORA', primary: true }],
    shots: [
      {
        src: '/projects/dora/dashboard.png',
        caption: 'The four metrics, banded elite to low against the prior half-year, over a twelve-month trend.',
        alt: 'DORA Control Room dashboard: four tiles reading deployment frequency 1.57 a day (elite), lead time for changes 48.5 hours median (high), change failure rate 3.2 percent (elite) and time to restore 3.3 hours median (high), each with a sparkline, above four twelve-month trend charts.',
      },
      {
        src: '/projects/dora/agent.png',
        caption: 'A plain-English question, answered with the validated read-only SQL it actually ran.',
        alt: 'DORA agent panel answering why the payments team’s lead time got worse in April, attributing it to review latency, with the validated single-SELECT SQL it ran shown below and marked validated, single select, marts only, limit 1000.',
      },
    ],
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
    role: 'Full-stack, solo',
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
