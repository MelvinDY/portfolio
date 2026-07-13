import { neon } from '@neondatabase/serverless'

export function db() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|prerender|preview|scan|fetch|monitor|curl|wget|python-requests|axios|node-fetch/i

export function isBot(ua: string | null): boolean {
  if (!ua || ua.length < 20) return true
  return BOT_RE.test(ua)
}

export function parseDevice(ua: string): { device: string; browser: string; os: string } {
  const device = /ipad|tablet/i.test(ua)
    ? 'tablet'
    : /mobi|iphone|android.+mobile/i.test(ua)
      ? 'mobile'
      : 'desktop'

  let browser = 'Other'
  if (/edg\//i.test(ua)) browser = 'Edge'
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera'
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung'
  else if (/firefox\//i.test(ua)) browser = 'Firefox'
  else if (/chrome\/|crios\//i.test(ua)) browser = 'Chrome'
  else if (/safari\//i.test(ua)) browser = 'Safari'

  let os = 'Other'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/mac os x/i.test(ua)) os = 'macOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/linux/i.test(ua)) os = 'Linux'

  return { device, browser, os }
}

/** Hostname of an external referrer, or null for direct / same-site. */
export function referrerHost(referrer: string | undefined, ownHost: string): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    if (!host || host === ownHost.replace(/^www\./, '')) return null
    return host.slice(0, 100)
  } catch {
    return null
  }
}
