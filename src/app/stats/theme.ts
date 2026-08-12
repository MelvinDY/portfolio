/* Palette + formatting shared by every panel on the dashboard.
   Light ground, matching the rest of the site. The three series hues are
   unchanged from the dark build: re-run against this surface they still
   return ALL CHECKS PASS on the dataviz six-checks
   (node scripts/validate_palette.js "#ea580c,#3b82f6,#059669" \
      --mode light --surface "#F3F3F1")
   with the one standing caveat that C3 and C2 sit at tritan dE 5.7, inside
   the 6-8 floor band. Legal only because they co-occur in exactly one place,
   the device split, where both are directly labelled. */

export const SURFACE = '#F3F3F1'
export const CARD = '#EAEAE6'
export const HAIRLINE = 'rgba(20,18,15,0.12)'
export const INK = '#14120F'
export const MUTED = '#5A544C'
export const FAINT = '#8A8378'
/** Accent for text and hairlines: 4.78:1 on the surface. */
export const BRAND = '#C13E00'
/** Same accent, display weight. Large type and non-text marks only: 3.1:1. */
export const BRAND_LOUD = '#ff5e1f'
export const C1 = '#ea580c' // series 1 - views
export const C2 = '#3b82f6' // series 2 - visitors
export const C3 = '#059669' // series 3
export const GOOD = '#047857'
export const BAD = '#B91C1C'
export const SERIES_COLORS = [C1, C2, C3]

/** Previous-period comparison: neutral ink, never a third data hue. */
export const COMPARE = 'rgba(20,18,15,0.32)'

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
