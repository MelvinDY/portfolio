"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { ProjectDetail } from '../data/project-details'

/**
 * The long version of one project, in the light catalogue language.
 *
 * Carries over the dialog behaviour from the dark sheet unchanged, because
 * those parts were never about the theme: focus moves in and is trapped,
 * Escape and the scrim close it, the page behind stops scrolling, and focus
 * returns to the button that opened it.
 *
 * Square corners throughout, matching the page's shape lock. Small text uses
 * #C13E00 rather than the raw brand orange, which only reaches about 3.1:1 on
 * this ground and would fail AA at body size.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

export default function LightSheet({
  detail, onClose,
}: {
  detail: ProjectDetail
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab') return
    const f = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!f || f.length === 0) return
    const first = f[0]
    const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }, [onClose])

  const facts = ([
    ['Year', detail.year],
    ['Team', detail.team],
    ['Role', detail.role],
    ['Status', detail.status],
  ] as const).filter(([, v]) => v)

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-[#14120F]/45 backdrop-blur-[3px]"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sheet-${detail.id}`}
        onKeyDown={onKeyDown}
        className="flex h-full w-[min(760px,94vw)] flex-col border-l border-[#14120F]/15 bg-[#F8F8F6] shadow-[-30px_0_80px_rgba(20,18,15,0.25)]"
      >
        <div className="flex items-start justify-between gap-5 border-b border-[#14120F]/12 px-5 py-6 md:px-9">
          <div>
            <p className="text-[12px] text-[#C13E00]" style={mono}>{detail.sub}</p>
            <h2 id={`sheet-${detail.id}`} className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {detail.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 shrink-0 border border-[#14120F]/20 text-[13px] text-[#5A544C] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]"
          >
            &#10005;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-7 md:px-9">
          {detail.shots.length > 0 && (
            <div className="mb-9">
              <div className="relative aspect-[16/9] overflow-hidden border border-[#14120F]/12 bg-[#EAEAE6]">
                <Image
                  src={detail.shots[shot].src}
                  alt={detail.shots[shot].alt}
                  fill
                  sizes="(max-width:820px) 92vw, 700px"
                  className="object-cover object-top"
                />
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-[#8A8378]" style={mono}>
                {detail.shots[shot].caption}
              </p>
              {detail.shots.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Screenshots">
                  {detail.shots.map((s, i) => (
                    <button
                      key={s.src}
                      role="tab"
                      aria-selected={i === shot}
                      aria-label={s.caption}
                      onClick={() => setShot(i)}
                      className={`relative aspect-[16/9] w-[88px] shrink-0 overflow-hidden border transition-opacity ${i === shot ? 'border-[#C13E00] opacity-100' : 'border-[#14120F]/15 opacity-55 hover:opacity-85'}`}
                    >
                      <Image src={s.src} alt="" fill sizes="88px" className="object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-9 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <p className="max-w-[58ch] text-[16px] leading-relaxed text-[#5A544C]">{detail.summary}</p>

              {detail.pull && (
                <p className="mt-7 max-w-[30ch] border-l-2 border-[#ff5e1f] pl-5 text-[clamp(1.2rem,2.2vw,1.55rem)] font-medium leading-[1.25] tracking-[-0.015em]">
                  {detail.pull}
                </p>
              )}

              <h3 className="mt-9 text-[1.1rem] font-semibold tracking-[-0.015em]">Worth knowing</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {detail.highlights.map(h => (
                  <li key={h} className="relative max-w-[58ch] pl-5 text-[14.5px] leading-relaxed text-[#5A544C]">
                    <span aria-hidden="true" className="absolute left-0 top-[10px] h-px w-2.5 bg-[#ff5e1f]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="md:col-span-5">
              {facts.length > 0 && (
                <dl className="mb-7 flex flex-col gap-4">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10.5px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>{k}</dt>
                      <dd className="mt-1 text-[14.5px]">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="text-[10.5px] uppercase tracking-[0.16em] text-[#8A8378]" style={mono}>Stack</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#5A544C]" style={mono}>{detail.stack.join(', ')}</p>
            </aside>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 border-t border-[#14120F]/12 bg-[#EAEAE6] px-5 py-4 md:px-9" style={mono}>
          {detail.links.map(l => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                l.primary
                  ? 'bg-[#ff5e1f] px-5 py-2.5 text-[12.5px] font-semibold text-[#1c0d03] transition-transform active:scale-[0.98]'
                  : 'border border-[#14120F]/20 px-5 py-2.5 text-[12.5px] text-[#5A544C] transition-colors hover:border-[#C13E00] hover:text-[#C13E00]'
              }
            >
              {l.label} <span aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
