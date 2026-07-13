"use client"

// the secret is the orange full stop in "Yogiana." itself. hovering it
// whispers "play the game"; clicking (or tapping, on mobile) commits: the
// orange swallows the screen from the dot's exact spot, then the dungeon
// takes over. coming back plays the whole thing in reverse.

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

const ACID = '#ff5e1f'

function makeWipe(dot: HTMLElement): HTMLDivElement {
  const r = dot.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height * 0.7 // the period's ink sits near the baseline
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
  const [chip, setChip] = useState<{ x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // coming back from the dungeon: the orange contracts into the period
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
    // once the hero act has scrolled away, the period is invisible — ignore it
    const act = dot.closest('.h3-a')
    return !act || parseFloat(getComputedStyle(act).opacity) >= 0.5
  }

  const onEnter = () => {
    const dot = dotRef.current
    if (!dot || !heroVisible()) return
    router.prefetch('/dungeon')
    const r = dot.getBoundingClientRect()
    setChip({
      x: Math.min(r.right + 14, window.innerWidth - 200),
      y: r.top + r.height * 0.55,
    })
  }

  const onLeave = () => setChip(null)

  const onClick = () => {
    if (goingRef.current || !heroVisible()) return
    const dot = dotRef.current
    if (!dot) return
    router.prefetch('/dungeon')
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
      <span
        ref={dotRef}
        className="h3-ch h3-dot mv-dgn-dot"
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onClick}
      >
        .
      </span>
      {mounted &&
        chip &&
        createPortal(
          <span className="mv-dgn-tip" style={{ left: chip.x, top: chip.y }} aria-hidden="true">
            ▸ play the game
          </span>,
          document.body,
        )}
      <style>{`
        .mv-dgn-dot {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          animation: mv-dgn-glow 3.4s ease-in-out infinite;
        }
        @keyframes mv-dgn-glow {
          0%, 100% { text-shadow: 0 0 0 rgba(255,94,31,0); }
          50% { text-shadow: 0 0 20px rgba(255,94,31,.55); }
        }
        .mv-dgn-tip {
          position: fixed; z-index: 9500;
          transform: translateY(-50%);
          padding: 6px 9px;
          background: #16100c; color: ${ACID};
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          white-space: nowrap; line-height: 1;
          box-shadow: 0 -2px 0 0 #000, 0 2px 0 0 #000, -2px 0 0 0 #000, 2px 0 0 0 #000, 3px 4px 0 0 rgba(0,0,0,.55);
          pointer-events: none;
          animation: mv-dgn-tip-in .18s ease;
        }
        @keyframes mv-dgn-tip-in {
          from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </>
  )
}
