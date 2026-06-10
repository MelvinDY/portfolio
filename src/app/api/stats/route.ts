import { NextResponse } from 'next/server'

// Self-hosted Umami instance, e.g. https://umami-yourname.vercel.app
const UMAMI_URL = process.env.UMAMI_URL?.replace(/\/$/, '')
const USERNAME = process.env.UMAMI_USERNAME
const PASSWORD = process.env.UMAMI_PASSWORD
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID

function dateRange(days: number) {
  const end = Date.now()
  const start = end - days * 24 * 60 * 60 * 1000
  return { startAt: start, endAt: end }
}

// Self-hosted Umami: POST /api/auth/login -> { token }, then Authorization: Bearer
async function login(): Promise<string> {
  const res = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  })
  if (!res.ok) {
    throw new Error(`Umami login failed (${res.status})`)
  }
  const data = await res.json()
  if (!data?.token) throw new Error('Umami login returned no token')
  return data.token
}

// Stat fields can be a plain number (older/cloud) or { value, prev } (v2 self-hosted)
function stat(field: unknown): { value: number; prev: number } {
  if (field == null) return { value: 0, prev: 0 }
  if (typeof field === 'number') return { value: field, prev: 0 }
  const f = field as { value?: number; prev?: number }
  return { value: f.value ?? 0, prev: f.prev ?? 0 }
}

export async function GET() {
  if (!UMAMI_URL || !USERNAME || !PASSWORD || !WEBSITE_ID) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  const { startAt, endAt } = dateRange(30)
  const base = `startAt=${startAt}&endAt=${endAt}`

  try {
    const token = await login()
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    const api = (path: string) => `${UMAMI_URL}/api/websites/${WEBSITE_ID}/${path}`

    const [statsRes, pageviewsRes, pagesRes, referrersRes, countriesRes] = await Promise.all([
      fetch(api(`stats?${base}`), { headers }),
      fetch(api(`pageviews?${base}&unit=day&timezone=Australia/Sydney`), { headers }),
      fetch(api(`metrics?type=url&${base}`), { headers }),
      fetch(api(`metrics?type=referrer&${base}`), { headers }),
      fetch(api(`metrics?type=country&${base}`), { headers }),
    ])

    if (!statsRes.ok) throw new Error(`Umami stats request failed (${statsRes.status})`)

    const [stats, pageviewsRaw, pagesRaw, referrersRaw, countriesRaw] = await Promise.all([
      statsRes.json(),
      pageviewsRes.json(),
      pagesRes.json(),
      referrersRes.json(),
      countriesRes.json(),
    ])

    // Umami returns { pageviews: [...], sessions: [...] } for the pageviews endpoint
    const pageviews = Array.isArray(pageviewsRaw?.pageviews) ? pageviewsRaw.pageviews : []
    const asList = (v: unknown) => (Array.isArray(v) ? (v as Array<{ x: string; y: number }>) : [])

    return NextResponse.json({
      configured: true,
      stats: {
        pageviews: stat(stats.pageviews),
        visitors: stat(stats.visitors),
        visits: stat(stats.visits),
        bounces: stat(stats.bounces),
        totaltime: stat(stats.totaltime),
      },
      pageviews,
      pages: asList(pagesRaw).slice(0, 8),
      referrers: asList(referrersRaw).slice(0, 6),
      countries: asList(countriesRaw).slice(0, 8),
    })
  } catch (err) {
    console.error('[stats] Umami fetch failed:', err)
    // configured:true so the page shows an error state, not the setup guide
    return NextResponse.json(
      { configured: true, error: 'Failed to load analytics' },
      { status: 502 },
    )
  }
}
