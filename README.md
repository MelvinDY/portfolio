# melvindarialyogiana.com

Personal portfolio and blog for Melvin Darial Yogiana — Data Analyst & Full-Stack Developer, Sydney.

Next.js 16 (App Router), TypeScript, Tailwind v4. Deployed on Vercel.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

The build works with **no environment variables set**:

```bash
npx next build
```

That's deliberate, and CI enforces it. Every route reads its config per-request and degrades to a handled response when something is missing — nothing required is read at module scope, because a throw at import time takes down the entire route module rather than just the misconfigured request.

## Environment

| Variable | Used by | Missing behaviour |
| --- | --- | --- |
| `DATABASE_URL` | analytics, rate limiting | tracking skipped; limiters fail open |
| `ANALYTICS_SALT` | visitor hashing | falls back to `dev` |
| `RESEND_API_KEY` | contact form | `/api/email` returns 503 |
| `TO_EMAIL` | contact form | `/api/email` returns 503 |
| `FROM_EMAIL` | contact form | defaults to `onboarding@resend.dev` |
| `GEMINI_API_KEY` | AI chatbox | falls back to canned keyword answers |

`.env.local` holds only `DATABASE_URL` and `ANALYTICS_SALT`; the rest live in Vercel.

## Layout

```
src/app/
  page.tsx              home (terminal-editorial design)
  about/ blog/ projects/ privacy/
  stats/                live first-party analytics dashboard
  dungeon/              hidden mini-RPG (Three.js, dynamically imported)
  api/
    track/              pageview ingest -> Postgres
    stats/              dashboard queries
    chat/               Gemini-backed assistant
    email/              contact form -> Resend
  lib/
    analytics.ts        Neon client, bot + device detection
    rate-limit.ts       Postgres-backed fixed-window limiter
    blog.ts             MDX reading (memoised per request)
    site.ts             canonical URLs, name, profile links
content/blog/           posts as MDX with frontmatter
db/migrations/          SQL to run against Neon
```

## Analytics

First-party, cookieless, one table. A ~40-line tracker posts to `/api/track` via `sendBeacon`; visitor identity is a salted hash of (day, IP, user-agent) computed server-side and rotated at Sydney midnight, so nothing reversible is stored and there's no cross-day tracking. `/stats` reads it back.

Written up in [`content/blog/first-party-analytics-postgres.mdx`](content/blog/first-party-analytics-postgres.mdx), which also carries the `events` schema. The rate-limit table is in [`db/migrations/`](db/migrations/).

## Abuse controls

`/api/chat` (5/day) and `/api/email` (3/hour) are rate-limited per caller through a `rate_limits` table in Postgres — not an in-memory `Map`, which enforces nothing across serverless instances and resets on every cold start. `/api/track` caps writes per visitor per minute inside the insert statement itself, so protection costs no extra round trip.

All limiters **fail open**: one that blocks real users because the database is asleep is worse than the abuse it prevents, and availability isn't correlated with an attack. Callers are identified by a salted hash, never a stored IP. The contact form also carries a honeypot field.

## CI

`.github/workflows/ci.yml` runs typecheck, lint and a secretless build on every push and PR.

## Notes

- There's a hidden mini-RPG behind the orange dot in the hero name. Three.js is imported only there, so it never ships to any other route.
- `_scratch/` is gitignored local working files.
