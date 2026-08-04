/**
 * The four destinations the hero hands you at the end.
 *
 * Lifted out of te-hero so the block and its variants read the same source.
 * `contents` is the real payload: the actual case studies and builds behind
 * each link. It used to be visible only on desktop hover, which meant the most
 * useful thing here was the thing hardest to reach.
 *
 * There is deliberately no ordinal on these. They are four kinds of
 * destination, not four steps, and numbering them asserts a sequence that does
 * not exist.
 */

export type IndexKind = 'collection' | 'instrument' | 'contact'

export interface IndexEntry {
  title: string
  meta: string
  href: string
  cursor: string
  kind: IndexKind
  /** 'link' routes through next/link, 'anchor' is a same-page jump. */
  nav: 'link' | 'anchor'
  contents: string[]
}

export const HOME_INDEX: IndexEntry[] = [
  {
    title: 'Data Projects',
    meta: '4 case studies',
    href: '/projects/data',
    cursor: 'open ↗',
    kind: 'collection',
    nav: 'link',
    contents: [
      'Grocery pricing wars',
      'Australian labour market',
      'SaaS revenue pipeline',
      'YouTube trending forensics',
    ],
  },
  {
    title: 'Software Projects',
    meta: '4 builds',
    href: '/projects/software',
    cursor: 'open ↗',
    kind: 'collection',
    nav: 'link',
    contents: [
      'OnlyCode, hackathon winner',
      'RateMyAccom',
      'PPIA UNSW Ignite',
      'Stall Wars',
    ],
  },
  {
    title: 'The Data Room',
    meta: 'live analytics',
    href: '/stats',
    cursor: 'open ↗',
    kind: 'instrument',
    nav: 'link',
    contents: [], // filled from the live pulse
  },
  {
    title: 'Contact',
    meta: 'say hello',
    href: '#contact',
    cursor: 'go ↓',
    kind: 'contact',
    nav: 'anchor',
    contents: [
      'melvindarialyogiana@gmail.com',
      'github.com/MelvinDY',
      'in/melvin-yogiana',
    ],
  },
]

export interface Pulse {
  live: number
  viewsToday: number
  visitorsToday: number
}

/** The Data Room describes itself with its own numbers when they have landed. */
export function entryContents(entry: IndexEntry, pulse?: Pulse | null): string[] {
  if (entry.kind !== 'instrument') return entry.contents
  if (!pulse) return ['live from this site’s own pipeline']
  return [
    `${pulse.live} reading right now`,
    `${pulse.viewsToday} views today`,
    `${pulse.visitorsToday} visitors today`,
  ]
}
