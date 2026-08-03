import Link from 'next/link'
import type { IndexedProject } from '../data/project-index'

/**
 * One discipline's worth of the /projects/all index.
 *
 * Deliberately not cards. The discipline pages are the pitch — surfaces,
 * findings, room to argue. This is the contents page: no surface, hairline
 * rows, and every row says where it sends you. Holding the two forms apart is
 * what lets the index list everything without competing with the pages it
 * points at.
 *
 * Featured work is marked by its index number taking the accent rather than by
 * a badge, so the hierarchy survives without adding a second tag to every row.
 */
export default function ProjectShelf({
  kicker, title, note, items,
}: {
  kicker: string
  title: string
  note: string
  items: IndexedProject[]
}) {
  if (items.length === 0) return null

  return (
    <section className="block tight shelf">
      <div className="wrap">
        <div className="shelf-head" data-reveal>
          <p className="kicker">{kicker}</p>
          <h2 className="shelf-title-h">
            {title} <span className="shelf-count">{items.length}</span>
          </h2>
          <p className="shelf-note">{note}</p>
        </div>

        <div className="shelf-list" data-reveal data-reveal-delay="1">
          {items.map((p, i) => {
            const internal = p.href.startsWith('/')
            const inner = (
              <>
                <span className="shelf-no">/ {String(i + 1).padStart(2, '0')}</span>
                <span className="shelf-main">
                  <span className="shelf-name">
                    {p.title}
                    {p.note && <em className="shelf-badge">{p.note}</em>}
                  </span>
                  <span className="shelf-blurb">{p.blurb}</span>
                </span>
                <span className="shelf-stack">{p.stack.join(' · ')}</span>
                <span className="shelf-go">
                  {p.linkLabel} <span className="arrow" aria-hidden="true">↗</span>
                </span>
              </>
            )
            const cls = `shelf-row${p.featured ? ' is-featured' : ''}`

            // Internal case studies route through Link; everything else leaves
            // the site and is marked as doing so.
            return internal ? (
              <Link key={p.id} className={cls} href={p.href}>{inner}</Link>
            ) : (
              <a key={p.id} className={cls} href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
