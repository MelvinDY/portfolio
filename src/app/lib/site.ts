/**
 * Single source of truth for canonical URLs, the legal name, and the profile
 * links that tie this domain to the same person. Everything SEO-facing
 * (sitemap, robots, metadata, JSON-LD) reads from here so the name and URL
 * can never drift between them.
 */

export const SITE_URL = "https://melvindarialyogiana.com"

/** Legal name — the exact string the site should rank for. */
export const FULL_NAME = "Melvin Darial Yogiana"

/** What he actually goes by, and what most profiles are filed under. */
export const SHORT_NAME = "Melvin Yogiana"

export const JOB_TITLE = "Data Analyst & Full-Stack Developer"

export const TAGLINE = `${FULL_NAME} — ${JOB_TITLE} based in Sydney. UNSW Computer Science. UNIHACK 2026 award winner.`

/**
 * Profiles that already rank for the name. Google uses these (as schema.org
 * `sameAs`) to resolve the Devpost/GitHub/LinkedIn "Melvin" and this domain
 * into one entity — which is the whole game for a personal-name query.
 *
 * TODO: add the Devpost profile URL here once confirmed — it ranks for the
 * name already, so it is worth claiming. Do not guess it: a `sameAs` pointing
 * at a 404 is worse than an absent one.
 */
export const PROFILES = {
  github: "https://github.com/MelvinDY",
  linkedin: "https://www.linkedin.com/in/melvin-yogiana/",
  instagram: "https://www.instagram.com/melvindarialyogiana/",
} as const

export const SAME_AS = Object.values(PROFILES)
