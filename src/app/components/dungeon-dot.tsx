"use client"

// the secret dot. hovering it whispers "play the game" — clicking commits:
// the orange swallows the screen from the dot's exact spot, then the
// dungeon takes over. coming back plays the whole thing in reverse.

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ACID = '#ff5e1f'

function makeWipe(dot: HTMLElement): HTMLDivElement {
  const r = dot.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const R =
    Math.max(
      Math.hypot(cx, cy),
      Math.hypot(window.innerWidth - cx, cy),
      Math.hypot(cx, window.innerHeight - cy),
      Math.hypot(window.innerWidth - cx, window.innerHeight - cy),
    ) + 40
  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed',
    `left:${cx - R}px`,
    `top:${cy - R}px`,
    `width:${R * 2}px`,
    `height:${R * 2}px`,
    'border-radius:50%',
    `background:${ACID}`,
    'z-index:100000',
    'pointer-events:none',
    'will-change:transform',
  ].join(';')
  return el
}

export default function DungeonDot() {
  const router = useRouter()
  const dotRef = useRef<HTMLSpanElement>(null)
  const wipeRef = useRef<HTMLDivElement | null>(null)
  const goingRef = useRef(false)

  // coming back from the dungeon: the orange contracts into the dot
  useEffect(() => {
    let flagged = false
    try {
      flagged = sessionStorage.getItem('mv-dgn-exit') === '1'
      if (flagged) sessionStorage.removeItem('mv-dgn-exit')
    } catch {}
    const dot = dotRef.current
    if (!flagged || !dot) return
    const el = makeWipe(dot)
    el.style.transform = 'scale(1)'
    el.style.transition = 'transform 0.9s cubic-bezier(.55,0,.2,1)'
    document.body.appendChild(el)
    const kill = () => el.remove()
    el.addEventListener('transitionend', kill)
    requestAnimationFrame(() => requestAnimationFrame(() => (el.style.transform = 'scale(0.003)')))
    return kill
  }, [])

  // drop the wipe if we unmount mid-flight (navigation swaps to the orange page)
  useEffect(() => () => wipeRef.current?.remove(), [])

  const heroVisible = () => {
    const dot = dotRef.current
    if (!dot) return false
    // once the hero act has scrolled away, the dot is invisible — ignore it
    const act = dot.closest('.h3-a')
    return !act || parseFloat(getComputedStyle(act).opacity) >= 0.5
  }

  const onEnter = () => {
    if (heroVisible()) router.prefetch('/dungeon')
  }

  const onClick = () => {
    if (goingRef.current || !heroVisible()) return
    const dot = dotRef.current
    if (!dot) return
    goingRef.current = true
    const el = makeWipe(dot)
    el.style.transform = 'scale(0.003)'
    el.style.transition = 'transform 1.15s cubic-bezier(.55,.05,.55,.95)'
    el.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') router.push('/dungeon')
    })
    document.body.appendChild(el)
    void el.offsetWidth // commit the small state before transitioning
    wipeRef.current = el
    el.style.transform = 'scale(1)'
  }

  return (
    <>
      <span ref={dotRef} className="mv-dgn-dot" aria-hidden="true" onPointerEnter={onEnter} onClick={onClick}>
        <span className="mv-dgn-tip">▸ play the game</span>
      </span>
      <style>{`
        .te-home .h3-name { position: relative; }
        .mv-dgn-dot {
          position: absolute; top: -4px; right: -20px;
          width: 9px; height: 9px; border-radius: 50%;
          background: ${ACID}; opacity: .9;
          cursor: pointer;
          animation: mv-dgn-pulse 3.4s ease-in-out infinite;
        }
        .mv-dgn-dot::after { content: ''; position: absolute; inset: -10px; border-radius: 50%; }
        .mv-dgn-tip {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%) translateX(-4px);
          padding: 6px 9px;
          background: #16100c; color: ${ACID};
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          white-space: nowrap; line-height: 1;
          box-shadow: 0 -2px 0 0 #000, 0 2px 0 0 #000, -2px 0 0 0 #000, 2px 0 0 0 #000, 3px 4px 0 0 rgba(0,0,0,.55);
          opacity: 0; pointer-events: none;
          transition: opacity .18s ease, transform .18s ease;
        }
        .mv-dgn-dot:hover .mv-dgn-tip { opacity: 1; transform: translateY(-50%) translateX(0); }
        @keyframes mv-dgn-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,94,31,.45); }
          50% { box-shadow: 0 0 9px 1px rgba(255,94,31,.2); }
        }
        @media (pointer: coarse) { .mv-dgn-dot { display: none; } }
      `}</style>
    </>
  )
}
