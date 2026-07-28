/* Palette + formatting shared by every panel on the dashboard.
   Validated against the dark surface with the dataviz six-checks. */

export const SURFACE = '#09090b'
export const CARD = '#101014'
export const HAIRLINE = 'rgba(255,255,255,0.08)'
export const INK = '#f2eae0'
export const MUTED = '#9c9ca6'
export const FAINT = '#5c5c66'
export const BRAND = '#ff5e1f' // chrome accent (text-safe, 6.5:1)
export const C1 = '#ea580c' // series 1 — views
export const C2 = '#3b82f6' // series 2 — visitors
export const C3 = '#059669' // series 3
export const GOOD = '#34d399'
export const BAD = '#f87171'
export const SERIES_COLORS = [C1, C2, C3]

/** Previous-period comparison: neutral ink, never a third data hue. */
export const COMPARE = 'rgba(242,234,224,0.30)'

export const fmt = (n: number) => n.toLocaleString('en-AU')

export const compact = (n: number) =>
  n >= 10000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : fmt(n)

export function countryName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export function flag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return ''
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1f1e6 + c.charCodeAt(0) - 65))
}

/** Compact relative age for the live wire: 8s / 4m / 2h. */
export function ago(seconds: number) {
  if (seconds < 10) return 'now'
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

/** One SQL statement as the API reports it. */
export interface SqlMeta {
  id?: string
  title?: string
  note?: string
  text: string
  params: unknown[]
  ms?: number
  rowCount?: number
}
