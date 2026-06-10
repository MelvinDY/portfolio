# Umami Analytics — Self-Host Setup & Handoff

> Status as of 2026-06-10. The `/stats` page code is migrated to **self-hosted Umami**.
> Remaining work is deploying the Umami instance and filling in env vars.

## Why we're doing this

Umami **Cloud's free Hobby tier blocks the read API** ("API access requires a Pro plan", $9/mo).
The tracking script still collects data, but `/stats` couldn't read it back — the API returned
`401 Invalid API key`, which made the page fall back to the "SETUP REQUIRED" screen.

Decision: **self-host Umami** on Vercel + Neon Postgres (free) instead of paying for Pro.

## What's already done (code side — committed-ready)

- **`src/app/api/stats/route.ts`** — rewritten for self-hosted auth:
  `POST /api/auth/login` (username/password) → bearer token → `/api/websites/{id}/...`
  (self-hosted uses `/api`, **not** the cloud `/v1`). Tolerant of both stat shapes
  (`number` or `{value, prev}`). On failure now returns `configured: true, error` so the
  page shows an error state instead of silently showing the setup guide.
- **`src/app/stats/page.tsx`** — added an "ANALYTICS UNAVAILABLE" error state.
- **`src/app/layout.tsx`** — tracking script loads from `NEXT_PUBLIC_UMAMI_SRC` instead of
  hardcoded `cloud.umami.is`.
- **`.env.local`** — switched to the self-hosted variable scheme (placeholders).
- Typecheck passes (`npx tsc --noEmit`).

## What's already provisioned

- **Neon Postgres project** `umami-analytics` (for Umami's own data, separate from RateMyAccom)
  - Project ID: `cold-lake-50623009`
  - Org: `org-fragrant-wildflower-62731009` (Melvin, free plan)

## Secrets (do NOT commit these — keep them only in Vercel env + local .env.local)

- **DATABASE_URL** — use the **DIRECT (non-pooled)** Neon connection string for the
  `umami-analytics` project. Copy it from the Neon console (Connection Details → uncheck
  "Pooled connection"). Direct is required because Umami runs Prisma migrations at build
  time and the pooled endpoint breaks migrations.
- **APP_SECRET** — generate a fresh one and never commit it:

  ```bash
  openssl rand -hex 32
  ```

> NOTE: An earlier version of this file contained real secret values that were pushed to
> the public repo. Those have been rotated/regenerated and are dead — do not attempt to
> reuse anything from git history.

## NEXT STEPS — deploy Umami (needs GitHub + Vercel login)

1. **Fork** `github.com/umami-software/umami` to your GitHub (fork, not just import — makes
   future updates one-click).
2. **vercel.com/new** → import your fork. Framework auto-detects as Next.js.
3. Add the two **Environment Variables** above (`DATABASE_URL`, `APP_SECRET`) for all environments.
4. **Deploy.** The first build creates all tables in Neon automatically.
5. Open the deployment URL → log in with default **`admin` / `umami`** →
   **immediately change the password** (Settings → Profile).
6. **Settings → Websites → Add** → name "Portfolio", domain `portfolio.melvindy.com`.
   Copy the **Website ID**.

## THEN — finish the portfolio wiring

Collect these three values:
- Umami URL (e.g. `https://umami-xxxx.vercel.app`)
- New admin password
- Website ID

### Fill in `.env.local`

```
UMAMI_URL=https://YOUR-UMAMI.vercel.app
UMAMI_USERNAME=admin
UMAMI_PASSWORD=YOUR-UMAMI-PASSWORD
UMAMI_WEBSITE_ID=YOUR-WEBSITE-ID
NEXT_PUBLIC_UMAMI_WEBSITE_ID=YOUR-WEBSITE-ID
NEXT_PUBLIC_UMAMI_SRC=https://YOUR-UMAMI.vercel.app/script.js
```

### Verify the live API before trusting it

```bash
# 1. Get a token
curl -s -X POST https://YOUR-UMAMI.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR-PASSWORD"}'

# 2. Use the token to hit stats (confirms website id + response shape)
curl -s "https://YOUR-UMAMI.vercel.app/api/websites/YOUR-WEBSITE-ID/stats?startAt=0&endAt=9999999999999" \
  -H "Authorization: Bearer THE-TOKEN"
```

If the `stats` response uses a shape different from `{ value, prev }`, adjust the `stat()`
helper in `src/app/api/stats/route.ts`.

### Set the SAME env vars on the PORTFOLIO Vercel project

`.env.local` is NOT deployed. Add them via dashboard (Project → Settings → Environment
Variables) or CLI:

```powershell
npx vercel env add UMAMI_URL production
npx vercel env add UMAMI_USERNAME production
npx vercel env add UMAMI_PASSWORD production
npx vercel env add UMAMI_WEBSITE_ID production
npx vercel env add NEXT_PUBLIC_UMAMI_WEBSITE_ID production
npx vercel env add NEXT_PUBLIC_UMAMI_SRC production
```

Then **redeploy** the portfolio (env changes need a fresh deploy).

## Caveats

- Self-hosted Umami collects from **deploy day forward**. Old Umami Cloud history does NOT
  carry over (free tier won't export it via API either).
- The portfolio domain in the Umami website entry must match where the tracking script runs
  (`portfolio.melvindy.com`) for data to register.
- Keep `UMAMI_PASSWORD` out of git — it lives only in `.env.local` (gitignored) and Vercel.
