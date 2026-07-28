import { createHash } from 'crypto'
import { db } from './analytics'

/**
 * Fixed-window rate limiting backed by the same Neon database the analytics
 * use. This deliberately does *not* live in a module-scope Map: on Vercel
 * every serverless instance gets its own module scope and cold starts wipe it,
 * so an in-memory counter enforces nothing across instances. The database is
 * the only shared state we have, so the counter goes there.
 */

/** Client IP from the proxy headers, or a constant when we genuinely can't tell. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Identify a caller without storing their IP. Same reasoning as the pageview
 * tracker: the salted hash is enough to count against, and nothing reversible
 * ends up in the table.
 */
function bucketKey(scope: string, ip: string): string {
  const hash = createHash('sha256')
    .update(`${process.env.ANALYTICS_SALT ?? 'dev'}:${scope}:${ip}`)
    .digest('hex')
    .slice(0, 32)
  return `${scope}:${hash}`
}

export type RateLimitResult = {
  allowed: boolean
  /** Requests left in the current window, floored at 0. */
  remaining: number
  /** When the current window rolls over and the count resets. */
  resetAt: Date
}

/**
 * Count this request against `scope` for this caller and report whether it is
 * allowed.
 *
 * Fails **open**: if the database is unreachable or DATABASE_URL isn't set
 * (local dev), the request goes through. A limiter that hard-fails every
 * contact form submission because Neon is asleep is worse than the abuse it
 * prevents, and database availability isn't correlated with an attack.
 */
export async function rateLimit(opts: {
  scope: string
  ip: string
  limit: number
  windowMs: number
}): Promise<RateLimitResult> {
  const { scope, ip, limit, windowMs } = opts

  // Fixed window: everyone in the same slice of wall-clock time shares a row,
  // so the whole check is one atomic upsert rather than a read-modify-write.
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs)
  const resetAt = new Date(windowStart.getTime() + windowMs)

  if (!process.env.DATABASE_URL) {
    return { allowed: true, remaining: limit, resetAt }
  }

  try {
    const sql = db()
    const rows = await sql`
      INSERT INTO rate_limits (k, window_start, n)
      VALUES (${bucketKey(scope, ip)}, ${windowStart.toISOString()}, 1)
      ON CONFLICT (k, window_start) DO UPDATE SET n = rate_limits.n + 1
      RETURNING n
    `
    const n = (rows[0] as { n: number }).n

    // Expired windows are dead weight. Sweep them occasionally rather than on
    // every call, and never block the response on it.
    if (Math.random() < 0.02) {
      sql`DELETE FROM rate_limits WHERE window_start < now() - interval '2 days'`.catch(
        () => {},
      )
    }

    return { allowed: n <= limit, remaining: Math.max(0, limit - n), resetAt }
  } catch (err) {
    console.error('[rate-limit]', err)
    return { allowed: true, remaining: limit, resetAt }
  }
}
