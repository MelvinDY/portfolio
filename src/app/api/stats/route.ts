import { NextResponse } from 'next/server'

const UMAMI_API = 'https://api.umami.is/v1'
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID
const API_KEY = process.env.UMAMI_API_KEY

function umamiHeaders() {
  return {
    'x-umami-api-key': API_KEY!,
    'Content-Type': 'application/json',
  }
}

function dateRange(days: number) {
  const end = Date.now()
  const start = end - days * 24 * 60 * 60 * 1000
  return { startAt: start, endAt: end }
}

export async function GET() {
  if (!WEBSITE_ID || !API_KEY) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  const { startAt, endAt } = dateRange(30)
  const base = `startAt=${startAt}&endAt=${endAt}`

  try {
    const [statsRes, pageviewsRes, pagesRes, referrersRes, countriesRes] = await Promise.all([
      fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/stats?${base}`, { headers: umamiHeaders() }),
      fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/pageviews?${base}&unit=day&timezone=Australia/Sydney`, { headers: umamiHeaders() }),
      fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/metrics?type=url&${base}`, { headers: umamiHeaders() }),
      fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/metrics?type=referrer&${base}`, { headers: umamiHeaders() }),
      fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/metrics?type=country&${base}`, { headers: umamiHeaders() }),
    ])

    const [stats, pageviewsRaw, pages, referrers, countries] = await Promise.all([
      statsRes.json(),
      pageviewsRes.json(),
      pagesRes.json(),
      referrersRes.json(),
      countriesRes.json(),
    ])

    // Umami returns { pageviews: [...], sessions: [...] } for the pageviews endpoint
    const pageviews = Array.isArray(pageviewsRaw?.pageviews) ? pageviewsRaw.pageviews : []

    return NextResponse.json({
      configured: true,
      stats: {
        pageviews: { value: stats.pageviews ?? 0, prev: stats.comparison?.pageviews ?? 0 },
        visitors: { value: stats.visitors ?? 0, prev: stats.comparison?.visitors ?? 0 },
        visits: { value: stats.visits ?? 0, prev: stats.comparison?.visits ?? 0 },
        bounces: { value: stats.bounces ?? 0, prev: stats.comparison?.bounces ?? 0 },
        totaltime: { value: stats.totaltime ?? 0, prev: stats.comparison?.totaltime ?? 0 },
      },
      pageviews,
      pages: (pages as Array<{ x: string; y: number }>).slice(0, 8),
      referrers: (referrers as Array<{ x: string; y: number }>).slice(0, 6),
      countries: (countries as Array<{ x: string; y: number }>).slice(0, 8),
    })
  } catch (err) {
    console.error('[stats] Umami fetch failed:', err)
    return NextResponse.json({ configured: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
