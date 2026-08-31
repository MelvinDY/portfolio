/**
 * The long version of each featured software build — what opens behind the
 * "See more" button on /projects/software.
 *
 * Every claim here is carried over from copy that was already on the site or
 * from the repos themselves. Nothing is inferred: where a fact isn't known
 * (`role`, mostly) the field is left off entirely and the sheet omits its row
 * rather than printing a guess. A portfolio is the last place to round up.
 *
 * `summary` states the situation before the solution — the team, the constraint,
 * the thing that had to be true — because a decision that arrives before the
 * problem it answers reads as an excuse for itself. `decisions` then carries the
 * reasoning in its own column rather than welded onto the claim, which is the
 * difference between a record and a defence.
 */

export interface Shot {
  /** Path under /public. */
  src: string
  /** What the reader is looking at — not a restatement of the project name. */
  caption: string
  /** Alt text for anyone who can't see it. */
  alt: string
}

/** One call, and the two things that make it worth reading. */
export interface Decision {
  /** The call itself, in four or five words. */
  decision: string
  /** The constraint that forced it. Sourced, never invented: if the reason
   *  isn't something the build actually faced, the row doesn't belong here. */
  why: string
  /** What it bought. Never a restatement of the decision. */
  bought: string
}

export interface ProjectDetail {
  id: string
  title: string
  /** The one-line positioning, same as the card's sub. */
  sub: string
  /** Situation first, then what the thing is. Two or three sentences. */
  summary: string
  /** A single line of why it's interesting. Set in the serif italic used for
   *  emphasis elsewhere on the site, so the page has one voice. Never a repeat
   *  of a sentence the summary has already spent. */
  pull?: string
  /** What was decided, and why. Three to five, not ten. */
  decisions: Decision[]
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
  'research-dashboard': {
    id: 'research-dashboard',
    title: 'Research Dashboard',
    sub: 'Fund manager research, embedded',
    summary:
      'An investment research team keeps its fund managers in a SharePoint document library — approved-list status, asset classification, an internal rating, and whatever columns they have added since. They needed it readable inside another product’s page: not as a site of its own, and not as a second copy someone would have to keep current. This is that dashboard — one row per manager, with search, multi-column sorting, filters built from the data itself and a drill-down into each manager’s documents.',
    pull:
      'The library is the record. It is read at the moment you look at it, never copied into something that can drift.',
    decisions: [
      {
        decision: 'No application database',
        why: 'The team already maintains the folders; a copy would drift from them',
        bought: 'One expanded Microsoft Graph query per load, and nothing to sync',
      },
      {
        decision: 'A header token, not a cookie',
        why: 'The page renders in a cross-site iframe, where its own cookies are third-party',
        bought: 'The embed authenticates where a cookie gate is silently blocked',
      },
      {
        decision: 'Bind to ids, not labels',
        why: 'Folder names and column labels belong to the team, not to the app',
        bought: 'Renames never reach the code, and a health endpoint catches the one silent case',
      },
      {
        decision: 'Validate the environment before the compile',
        why: 'A misconfigured deployment should fail on my screen, not in front of the team',
        bought: 'The build blocks on real harm and warns on mess',
      },
      {
        decision: 'Reject client paths rather than rewrite them',
        why: 'A rewritten path can still resolve somewhere unintended',
        bought: 'A request that would climb out of its folder fails loudly',
      },
    ],
    year: '2026',
    team: 'Solo',
    role: 'Full-stack, solo',
    status: 'Live demo on synthetic data',
    stack: [
      'Next.js',
      'TypeScript',
      'Microsoft Graph',
      'SharePoint',
      'Vercel Edge Config',
      'node:test',
    ],
    links: [
      { label: 'Live demo', href: 'https://research-dashboard-demo.vercel.app/demo', primary: true },
    ],
    shots: [
      {
        src: '/projects/research-dashboard/dashboard.jpg',
        caption:
          'The dashboard on synthetic data. The table is the scrolling surface, not the page — headers and footer stay put while rows move.',
        alt: 'Research Dashboard demo: a table of fund managers with columns for asset class, watchlist, approved-list flags, internal rating, research status, strategy and fund size, above a footer reading “Showing 1–26 of 26 managers · 2 exited hidden”.',
      },
    ],
  },

  peersuade: {
    id: 'peersuade',
    title: 'Peersuade',
    sub: 'Real-time debate & persuasion game',
    summary:
      'A live multiplayer game where players are handed wildly random prompts and have to argue them convincingly. The audience is the twist: rather than watching and voting at the end, the room votes continuously, so the score moves while an argument is still being made. Built over the UNIHACK 2026 weekend and judged across the whole field on fun and on design — it took both categories.',
    pull: 'The audience is a player, not a spectator. The vote moves while you are still talking.',
    decisions: [
      {
        decision: 'The room votes continuously',
        why: 'A vote collected at the end turns the audience into spectators',
        bought: 'The score moves while an argument is still being made',
      },
      {
        decision: 'Vote state pushed over WebSocket',
        why: 'A score that changes mid-sentence cannot be polled for',
        bought: 'The room reacts in real time rather than on a refresh',
      },
      {
        decision: 'Audience participation is the scoring mechanism',
        why: 'A reaction that sits in a side channel changes nothing about who wins',
        bought: 'Watching and playing became the same act',
      },
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
      'PPIA UNSW, the Indonesian student association at UNSW, needed one official platform for its members: profiles, a searchable community directory and tooling for the organisation’s own events. It was built and shipped by ten contributors working at once, which made the architecture the hard problem rather than any single feature.',
    pull: 'Ten contributors on one codebase is an organisational problem before it is a technical one.',
    decisions: [
      {
        decision: 'A modular architecture, settled before the features',
        why: 'Ten contributors on one codebase collide long before they run out of features',
        bought: 'Work could be split across the team without stepping on each other',
      },
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
      'Atlassian’s developer townhalls run hybrid, so questions arrive from the room and from the call and have to land in one place, ranked and moderated. Podium is that place, built as an Atlassian Forge app inside Confluence: attendees ask, vote and are moderated on one surface, and a question can arrive as speech — the recording is transcribed with Whisper, cleaned up with GPT-4o-mini and written back as structured rows. Built as the UNSW software-engineering capstone (COMP3900) by a team of six on an agile cycle, it did not stop at the demo: it was published on the Atlassian Marketplace and handed to Atlassian’s developer advocate, who still runs it for their townhalls.',
    pull: 'A question asked out loud is not data until something writes it down properly.',
    decisions: [
      {
        decision: 'Voice answers pass through a pipeline, not into a text field',
        why: 'A raw transcript is not structured data',
        bought: 'Whisper, then GPT-4o-mini, written back to the production database as clean rows',
      },
      {
        decision: 'Audio uploaded in chunks',
        why: 'Forge caps request size, and a townhall recording does not fit inside it',
        bought: 'Large payloads move through a serverless backend intact',
      },
      {
        decision: 'The schema changes only by version-controlled migration',
        why: 'Six people were changing one database across a term',
        bought: 'An eight-table schema over events, questions, voting and moderation, evolved through 58 migrations',
      },
      {
        decision: 'Tests and build validation on every commit',
        why: 'Six contributors merging into one codebase across a term',
        bought: 'Jest, Mocha and WebdriverIO over ingestion, transformation and storage, run by GitHub Actions',
      },
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
      'Two people who both want to share where they are, whether they got home safely and how they are feeling — without either of them being able to turn that into surveillance of the other. Haven is an Android app for exactly that pair, over a period of openness they both choose. The interesting part is not the feature list: the consent rules are structural, so the architecture cannot express a one-way share and the app cannot be turned into a monitoring tool by someone who wants one.',
    pull: 'The strongest privacy guarantee is the table you decided not to create.',
    decisions: [
      {
        decision: 'Sharing is pair-symmetric by construction',
        why: 'A one-way share is the shape a monitoring tool takes',
        bought: 'The server serves a shared feature only while both partners hold an active grant, and a one-way endpoint does not exist',
      },
      {
        decision: 'No locations table anywhere',
        why: 'Stored history is what a breach or a subpoena reaches for',
        bought: 'Live position sits in an in-memory TTL store, overwritten in place — one current point, never a trail',
      },
      {
        decision: 'Consent checked on every read',
        why: 'Consent that is not enforced at read time is a setting, not a guarantee',
        bought: 'A Consent Service gates shared data per user, per feature, revocably',
      },
      {
        decision: 'Either side can revoke or dissolve alone',
        why: 'Needing the other party’s permission to leave is the trap',
        bought: 'Instant revocation, or dissolve the pair and wipe the shared data, with no approval from the other side',
      },
      {
        decision: 'Identity is a hashed phone number',
        why: 'The app needs to recognise the same person, not to know who they are',
        bought: 'Phone-OTP into a signed JWT, with a per-user WebSocket hub and FCM push for backgrounded devices',
      },
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
      {
        src: '/projects/haven/mood.png',
        caption: 'Setting a mood. Ten to choose from, one tap to send, and only the current one exists — the screen says so itself.',
        alt: 'Haven mood picker offering ten coloured options — happy, relaxed, calm, energetic, missing you, nervous, hungry, tired, annoyed and sad — with one selected, above an optional note field and a line explaining that only the current mood is shown and none of it is kept as history.',
      },
      {
        src: '/projects/haven/widget.png',
        caption: 'The home-screen widget. It carries both moods and never a location, because a home screen is visible to anyone.',
        alt: 'Haven widget prompt headed “Taruh Bulan di layar utamamu”, explaining the widget shows both partners’ moods but never a location because a home screen can be seen by anyone, above a preview card with the mascot and one partner’s current mood, and an install button.',
      },
      {
        src: '/projects/haven/settings.png',
        caption: 'Settings. The pair and when it started, the widget, and the day count you can hide from yourself alone.',
        alt: 'Haven settings screen with theme options, a card naming the pair and the date they connected, a widget prompt noting the widget never carries a location, and a control to show or hide the days-together count with a note that hiding it tells nobody and changes nothing.',
      },
    ],
  },

  dora: {
    id: 'dora',
    title: 'DORA',
    sub: 'Engineering-delivery warehouse with an analytics agent',
    summary:
      'The four DORA metrics — deployment frequency, lead time for changes, change failure rate, time to restore — are easy to name and hard to compute honestly from the events an engineering organisation actually emits. This is a Snowflake warehouse that does it end to end: ingest delivery events, enrich them in-warehouse with Cortex, and put a Claude analytics agent in front of a curated semantic layer so the questions can be asked in plain English. It runs on a synthetic event generator rather than any real organisation’s delivery data, which is what makes the whole pipeline shareable.',
    pull: 'The agent never sees the schema. It sees the semantic model someone chose to give it.',
    decisions: [
      {
        decision: 'The agent reads a semantic model, not the schema',
        why: 'A model that can see INFORMATION_SCHEMA will answer from whatever it finds there',
        bought: 'It reads only semantic_model.yaml, and runs three tools: run_sql, search_incidents and get_metric_definition',
      },
      {
        decision: 'Guardrails layered rather than single',
        why: 'A parser that can be talked around should not be the only thing standing there',
        bought: 'sqlglot rejects anything that is not a single allowlisted SELECT, with the read-only warehouse role as the hard stop behind it',
      },
      {
        decision: 'Metrics modelled in dbt layers',
        why: 'A metric defined inside each question is a metric that disagrees with itself',
        bought: 'staging → conformed → marts, fed by a FastAPI webhook receiver and per-source REST backfill',
      },
      {
        decision: 'Enrichment runs in the warehouse',
        why: 'Moving data out to classify it adds a system to keep in sync',
        bought: 'Cortex classifies pull requests and summarises and embeds incidents where the data already sits',
      },
      {
        decision: 'Delivery events are generated, not scraped',
        why: 'Real delivery data belongs to the organisation that produced it',
        bought: 'A payload-accurate, story-seeded simulator, so every number on screen is the generator’s — and a deterministic twin runs the same pipeline on DuckDB with no Snowflake account',
      },
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
      'A review platform for NSW student housing, built to the standard a real review site needs rather than to demo standard. Most of the work went where the trust problem is: reviewers verify with a university email before they can post, ratings carry more than one dimension, and every path that accepts public input is hardened against what a public form attracts.',
    pull: 'A review site lives or dies on whether you can trust who is writing the reviews.',
    decisions: [
      {
        decision: 'Reviewers verify with a university email',
        why: 'An open form cannot tell a resident from anyone else',
        bought: 'Only someone who can prove a university address can leave a review',
      },
      {
        decision: 'Ratings are multi-dimensional',
        why: 'A single star score collapses everything a tenant actually needs to compare',
        bought: 'Separate dimensions rather than one blunt number',
      },
      {
        decision: 'The write paths are hardened, not just validated',
        why: 'A public review form is the attack surface',
        bought: 'XSS and CSRF protection, with rate limiting where the writes happen',
      },
      {
        decision: 'Input validated by schema, critical flows covered',
        why: 'The write path is where both the abuse and the data loss happen',
        bought: 'Zod schemas on the forms and a Jest suite over the flows that matter',
      },
    ],
    status: 'Production',
    role: 'Full-stack, solo',
    stack: ['Next.js 14', 'TypeScript', 'Zod', 'React Hook Form', 'Jest', 'TailwindCSS'],
    links: [
      { label: 'Live demo', href: 'https://ratemyaccom-beryl.vercel.app/', primary: true },
      { label: 'GitHub', href: 'https://github.com/MelvinDY/ratemyaccom' },
    ],
    /* The property names and operator details are real NSW student housing;
       the reviews and reviewer names on these screens are the platform's own
       seeded content, so the captions describe the screen rather than quoting
       anyone as a real tenant. */
    shots: [
      {
        src: '/projects/ratemyaccom/home.jpg',
        caption: 'The front page. An editorial layout carrying the live review counts.',
        alt: 'Rate My Accom home page: the headline “Where you’ll study” beside a browse call to action and counters reading 32 properties, 160 reviews and a 4.5 average.',
      },
      {
        src: '/projects/ratemyaccom/browse.jpg',
        caption: 'The index. Filters down the left, and a catalogue that says how many of the 32 are still showing.',
        alt: 'Rate My Accom browse page headed “The index.”, with a filter rail for university, weekly price, minimum rating and property type, beside a catalogue of properties each carrying its university, suburb, on- or off-campus tag, star rating, review count and weekly price range.',
      },
      {
        src: '/projects/ratemyaccom/property.jpg',
        caption: 'A property. Rating, price, distance to campus and to transport, and the room types, before any prose.',
        alt: 'Rate My Accom property page for UTS Yura Mudang, with featured and verified tags, capacity and suburb, beside a panel giving 4.5 stars over 6 reviews, from $440 a week, 400 metres to campus, 500 metres to transport and three room types, above an exterior photograph.',
      },
      {
        src: '/projects/ratemyaccom/dimensions.jpg',
        caption: 'The six dimensions, each benchmarked against the NSW platform average rather than left as a bare number.',
        alt: 'Rate My Accom ratings breakdown headed “Where UTS wins — and where it doesn’t”, showing a weighted 4.5 out of 5 beside six bars — cleanliness, location, value, amenities, management and safety — each with its score and its difference against the NSW platform average.',
      },
      {
        src: '/projects/ratemyaccom/reviews.jpg',
        caption: 'Reviews, filterable by positive and critical, each carrying its own six-number breakdown.',
        alt: 'Rate My Accom reviews page headed “Reviews from students.” with filters for all, positive, critical and newest, a featured review at 4.8 beside a grid of its six dimension scores, and further reviews below each with a rating, a title and the reviewer’s university and date.',
      },
      {
        src: '/projects/ratemyaccom/rooms.jpg',
        caption: 'Rooms and pricing. Three tiers side by side, with the most-reviewed one marked.',
        alt: 'Rate My Accom rooms and pricing section headed “Three tiers. Pick yours.”, comparing single at $440, twin share at $560 and ensuite at $680 a week, the twin share panel filled blue and flagged most reviewed, each listing WiFi, gym, study rooms and laundry.',
      },
      {
        src: '/projects/ratemyaccom/apply.jpg',
        caption: 'Applying sends you to the operator, and the page says so: no cut taken, the same prices you just read.',
        alt: 'Rate My Accom apply section on a blue ground headed “Would you live here?”, stating applications are made directly through the operator with no commission taken, beside the operator’s phone, email and housing web address and buttons to visit the operator site, shortlist or share.',
      },
      {
        src: '/projects/ratemyaccom/atlas.jpg',
        caption: 'The universities atlas. Every NSW campus on one map, ranked beside it by property count.',
        alt: 'Rate My Accom universities page with a map of New South Wales pinning campuses from Lismore to Bathurst, each labelled with its abbreviation and average rating, beside an index listing UNSW, USYD, Macquarie, UTS, Newcastle and Western Sydney with their property counts and average ratings.',
      },
      {
        src: '/projects/ratemyaccom/quiz.jpg',
        caption: 'The quiz, step two of seven. One question a screen, with the budget set by dragging rather than typing.',
        alt: 'Rate My Accom quiz on step 2 of 7, headed “What can you spend?”, showing a weekly budget of $200 to $500 set with separate minimum and maximum sliders, above back and next buttons and a progress bar.',
      },
      {
        src: '/projects/ratemyaccom/about.jpg',
        caption: 'The about page states the business model first: nobody pays to be listed.',
        alt: 'Rate My Accom about page headed “We don’t list the places that pay us. We list the places students survived, rated, and would do again.”, above a blue section headed “Every review, six dimensions.” explaining that a single star hides what matters so each review is split across six numbers.',
      },
    ],
  },
}
