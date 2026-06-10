"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts'

interface StatsData {
  configured: boolean
  error?: string
  stats?: {
    pageviews: { value: number; prev: number }
    visitors: { value: number; prev: number }
    visits: { value: number; prev: number }
    bounces: { value: number; prev: number }
    totaltime: { value: number; prev: number }
  }
  pageviews?: Array<{ x: string; y: number }>
  pages?: Array<{ x: string; y: number }>
  referrers?: Array<{ x: string; y: number }>
  countries?: Array<{ x: string; y: number }>
}

const ACID = '#ff5e1f'
const DIM = '#9c9ca6'
const SURFACE = '#121217'
const LINE_COLOR = 'rgba(255,255,255,0.09)'

const REFERRER_COLORS = [ACID, '#60a5fa', '#f472b6', '#34d399', '#fb923c', '#a78bfa']

function StatCard({ label, value, prev }: { label: string; value: number; prev: number }) {
  const delta = prev > 0 ? Math.round(((value - prev) / prev) * 100) : null
  return (
    <div style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.1em', color: DIM, marginBottom: 8, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-space-grotesk, system-ui)', color: '#F2EAE0', lineHeight: 1 }}>
        {value.toLocaleString()}
      </div>
      {delta !== null && (
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono, monospace)', color: delta >= 0 ? ACID : '#f87171', marginTop: 6 }}>
          {delta >= 0 ? '+' : ''}{delta}% vs prev 30d
        </div>
      )}
    </div>
  )
}

function SetupGuide() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.1em', color: ACID, marginBottom: 16 }}>
        SETUP REQUIRED
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#F2EAE0', marginBottom: 16 }}>Connect Umami Analytics</h2>
      <p style={{ color: DIM, lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>
        This page pulls live data from Umami — an open-source, privacy-friendly analytics platform. No cookies, no GDPR consent banners needed.
      </p>
      <ol style={{ color: DIM, lineHeight: 2, fontSize: 14, paddingLeft: 20, marginBottom: 32 }}>
        <li>Sign up free at <span style={{ color: ACID, fontFamily: 'monospace' }}>umami.is</span></li>
        <li>Add your website and copy the <strong style={{ color: '#F2EAE0' }}>Website ID</strong></li>
        <li>Generate an <strong style={{ color: '#F2EAE0' }}>API Key</strong> in Settings → API Keys</li>
        <li>Add to your <code style={{ background: SURFACE, padding: '1px 6px', borderRadius: 3, color: ACID }}>{"`.env.local`"}</code>:</li>
      </ol>
      <pre style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '16px 20px', fontFamily: 'monospace', fontSize: 13, color: '#F2EAE0', overflowX: 'auto', marginBottom: 32 }}>
{`NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
UMAMI_API_KEY=your-api-key
UMAMI_WEBSITE_ID=your-website-id`}
      </pre>
      <p style={{ color: DIM, fontSize: 13, lineHeight: 1.6 }}>
        Add <code style={{ color: ACID, fontFamily: 'monospace' }}>{"?utm_source=linkedin"}</code> to your LinkedIn profile URL so referrer data starts tracking from day one.
      </p>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a22', border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: '#F2EAE0' }}>
      <div style={{ color: DIM, marginBottom: 4 }}>{label}</div>
      <div style={{ color: ACID }}>{payload[0].value.toLocaleString()} views</div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\/[^/]+/, '') || '/'
}

function shortReferrer(ref: string) {
  if (!ref) return 'Direct'
  try { return new URL(ref.startsWith('http') ? ref : `https://${ref}`).hostname.replace('www.', '') }
  catch { return ref }
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#09090b',
      color: '#F2EAE0',
      fontFamily: 'var(--font-space-grotesk, system-ui, sans-serif)',
    } as React.CSSProperties,
    wrap: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 clamp(20px, 5vw, 64px)',
    } as React.CSSProperties,
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${LINE_COLOR}`, position: 'sticky', top: 0, background: '#09090b', zIndex: 50 }}>
        <div style={{ ...styles.wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link href="/" style={{ fontWeight: 700, color: '#F2EAE0', textDecoration: 'none', fontSize: 15 }}>
            ← MelvinDY
          </Link>
          <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: DIM, textTransform: 'uppercase' }}>
            Site Analytics · Last 30 days
          </span>
        </div>
      </header>

      <main style={{ ...styles.wrap, paddingTop: 48, paddingBottom: 80 }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'monospace', fontSize: 13, color: DIM }}>
            fetching data...
          </div>
        )}

        {!loading && data && !data.configured && <SetupGuide />}

        {!loading && data?.configured && data.error && (
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: '#f87171', marginBottom: 16 }}>
              ANALYTICS UNAVAILABLE
            </div>
            <p style={{ color: DIM, lineHeight: 1.7, fontSize: 14 }}>
              Couldn&apos;t reach the analytics backend right now. Live data will return once the connection is restored.
            </p>
          </div>
        )}

        {!loading && data?.configured && data.stats && !data.error && (
          <>
            {/* Hero line */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: ACID, marginBottom: 12, textTransform: 'uppercase' }}>
                live · portfolio.melvindy.com
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
                Who&apos;s been reading<br />
                <span style={{ color: ACID }}>the work.</span>
              </h1>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 48 }}>
              <StatCard label="Page Views" value={data.stats.pageviews.value} prev={data.stats.pageviews.prev} />
              <StatCard label="Unique Visitors" value={data.stats.visitors.value} prev={data.stats.visitors.prev} />
              <StatCard label="Sessions" value={data.stats.visits.value} prev={data.stats.visits.prev} />
              <StatCard
                label="Avg Session (min)"
                value={Math.round(data.stats.totaltime.value / Math.max(data.stats.visits.value, 1) / 60)}
                prev={Math.round(data.stats.totaltime.prev / Math.max(data.stats.visits.prev, 1) / 60)}
              />
            </div>

            {/* Pageviews chart */}
            {data.pageviews && data.pageviews.length > 0 && (
              <div style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '24px', marginBottom: 24 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: DIM, marginBottom: 20, textTransform: 'uppercase' }}>
                  Page Views — Daily
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.pageviews} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="x"
                      tickFormatter={formatDate}
                      tick={{ fill: DIM, fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: DIM, fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={ACID}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: ACID, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bottom grid: pages + referrers + countries */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

              {/* Top pages */}
              {data.pages && data.pages.length > 0 && (
                <div style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '24px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: DIM, marginBottom: 20, textTransform: 'uppercase' }}>
                    Top Pages
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.pages} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="x"
                        tickFormatter={shortUrl}
                        tick={{ fill: DIM, fontSize: 10, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div style={{ background: '#1a1a22', border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '6px 12px', fontFamily: 'monospace', fontSize: 12, color: ACID }}>
                              {payload[0].value} views
                            </div>
                          ) : null
                        }
                      />
                      <Bar dataKey="y" radius={[0, 2, 2, 0]}>
                        {data.pages.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? ACID : `rgba(255,94,31,${0.6 - i * 0.06})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Referrers */}
              {data.referrers && data.referrers.length > 0 && (
                <div style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '24px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: DIM, marginBottom: 20, textTransform: 'uppercase' }}>
                    Top Referrers
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data.referrers}
                        dataKey="y"
                        nameKey="x"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        strokeWidth={0}
                      >
                        {data.referrers.map((_, i) => (
                          <Cell key={i} fill={REFERRER_COLORS[i % REFERRER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div style={{ background: '#1a1a22', border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '6px 12px', fontFamily: 'monospace', fontSize: 12, color: '#F2EAE0' }}>
                              <div style={{ color: DIM }}>{shortReferrer(payload[0].name as string)}</div>
                              <div style={{ color: ACID }}>{payload[0].value} sessions</div>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {data.referrers.slice(0, 5).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: REFERRER_COLORS[i % REFERRER_COLORS.length], flexShrink: 0 }} />
                        <span style={{ color: DIM, fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortReferrer(r.x)}</span>
                        <span style={{ color: '#F2EAE0', fontFamily: 'monospace' }}>{r.y}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {data.countries && data.countries.length > 0 && (
                <div style={{ background: SURFACE, border: `1px solid ${LINE_COLOR}`, borderRadius: 4, padding: '24px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', color: DIM, marginBottom: 20, textTransform: 'uppercase' }}>
                    Visitors by Country
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {data.countries.map((c, i) => {
                      const max = data.countries![0].y
                      const pct = Math.round((c.y / max) * 100)
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, fontFamily: 'monospace' }}>
                            <span style={{ color: DIM }}>{c.x}</span>
                            <span style={{ color: '#F2EAE0' }}>{c.y}</span>
                          </div>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? ACID : `rgba(255,94,31,${0.55 - i * 0.06})`, borderRadius: 2 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div style={{ marginTop: 40, fontFamily: 'monospace', fontSize: 11, color: DIM, textAlign: 'center' }}>
              Powered by <a href="https://umami.is" target="_blank" rel="noopener noreferrer" style={{ color: ACID, textDecoration: 'none' }}>Umami Analytics</a> · No cookies · GDPR-friendly
            </div>
          </>
        )}
      </main>
    </div>
  )
}
