"use client"

/**
 * Click Melvin, get his cat.
 *
 * The second easter egg on the site. The first is the orange period in
 * "Yogiana." (dungeon-dot.tsx), which sits in the hero where everyone passes;
 * this one is on /about, which is where you end up if you actually wanted to
 * know who made the thing. Clicking the human and getting the cat is the joke.
 *
 * Canvas rather than DOM nodes. Thirty-odd sprites, each with its own position
 * and rotation, is a per-frame drawImage loop, not thirty absolutely positioned
 * elements for the compositor to carry. Nothing here touches layout, and when
 * the last particle dies the canvas is removed, so the resting cost is zero
 * rather than one cheap rAF forever.
 *
 * The sprite list is read off the filesystem at build time by the page and
 * handed down as a prop, so adding cats is a matter of dropping files into
 * public/purin and nothing else. An empty list disables the whole thing and
 * the photo renders as an ordinary photo.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** One documented layer. Above the page, below the dungeon's screen wipe (100000). */
const Z = 9000

/** How many sprites we actually fetch, however many are on disk. */
const PALETTE = 8
const COUNT_DESKTOP = 34
const COUNT_MOBILE = 18
/** Repeat clicks stack onto one loop; this bounds an enthusiastic clicker. */
const MAX_LIVE = 120

const GRAVITY = 1400 // px/s²
const DRAG = 0.55 // horizontal only, per second
/** A returning background tab hands back a multi-second delta. Unclamped, every
    particle integrates that in one step and teleports off screen. */
const MAX_DT = 0.05

interface Particle {
  x: number; y: number
  vx: number; vy: number
  rot: number; vrot: number
  size: number
  life: number; ttl: number
  img: HTMLImageElement
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Fisher-Yates, then take the head. Which cats you get changes per page load. */
function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

export default function PurinConfetti({
  sprites,
  children,
}: {
  /** Public paths, supplied by the server. Empty means no easter egg. */
  sprites: string[]
  children: React.ReactNode
}) {
  const hostRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const partsRef = useRef<Particle[]>([])
  const imgsRef = useRef<HTMLImageElement[] | null>(null)
  const loadingRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [hint, setHint] = useState<{ x: number; y: number } | null>(null)
  const [calm, setCalm] = useState<{ x: number; y: number; src: string }[]>([])

  useEffect(() => setMounted(true), [])

  /* Dev-only inspection handle. The whole effect depends on rAF, and a hidden
     or backgrounded tab freezes rAF, at which point "no cats appeared" and
     "the code is broken" look identical from the outside. `__purin()` tells
     them apart: if live > 0 and canvas is true, the particles exist and it is
     the clock that stopped. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    Object.assign(window, {
      __purin: () => ({
        imgs: imgsRef.current?.length ?? null,
        live: partsRef.current.length,
        raf: rafRef.current,
        canvas: !!canvasRef.current,
        loading: loadingRef.current,
      }),
    })
  }, [])

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Fetch ahead of the click, on hover, so the first burst is not an empty
     screen while the network catches up.

     Deliberately resolved on `load`, not on `decode()`. decode() prepares an
     image for the *next paint*, and a hidden tab never paints, so the promise
     simply never settles there. Awaiting it left loadingRef stuck true, and
     since preload() early-returns while that flag is set, the easter egg died
     permanently for the rest of the session. drawImage decodes on demand
     anyway, so `load` is all this actually needs. */
  const preload = useCallback(async () => {
    if (imgsRef.current || loadingRef.current || sprites.length === 0) return
    loadingRef.current = true
    try {
      const chosen = sample(sprites, PALETTE)
      const loaded = await Promise.all(
        chosen.map(
          (src) =>
            new Promise<HTMLImageElement | null>((resolve) => {
              const img = new window.Image()
              img.onload = () => resolve(img)
              img.onerror = () => resolve(null)
              img.src = src
            }),
        ),
      )
      const ok = loaded.filter((i): i is HTMLImageElement => i !== null)
      // Only latch a non-empty set, so a flaky load can be retried on the next
      // hover rather than leaving a permanently silent button.
      if (ok.length > 0) imgsRef.current = ok
    } finally {
      loadingRef.current = false
    }
  }, [sprites])

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    canvasRef.current?.remove()
    canvasRef.current = null
    partsRef.current = []
  }, [])

  useEffect(() => stop, [stop])

  const ensureCanvas = useCallback(() => {
    if (canvasRef.current) return canvasRef.current
    const c = document.createElement('canvas')
    c.setAttribute('aria-hidden', 'true')
    c.style.cssText = `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${Z}`
    document.body.appendChild(c)
    canvasRef.current = c
    return c
  }, [])

  const frame = useCallback(
    (prev: number) => (now: number) => {
      const c = canvasRef.current
      if (!c) return
      const ctx = c.getContext('2d')
      if (!ctx) return

      const dt = Math.min((now - prev) / 1000, MAX_DT)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      if (c.width !== Math.floor(w * dpr) || c.height !== Math.floor(h * dpr)) {
        c.width = Math.floor(w * dpr)
        c.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const alive: Particle[] = []
      for (const p of partsRef.current) {
        p.life += dt
        if (p.life >= p.ttl || p.y - p.size > h) continue

        p.vy += GRAVITY * dt
        p.vx -= p.vx * DRAG * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.vrot * dt

        // fade only over the last half second, so most of the flight is solid
        const left = p.ttl - p.life
        ctx.globalAlpha = left < 0.5 ? Math.max(left / 0.5, 0) : 1
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        alive.push(p)
      }
      ctx.globalAlpha = 1
      partsRef.current = alive

      // self-terminating: no particles, no canvas, no loop
      if (alive.length === 0) { stop(); return }
      rafRef.current = requestAnimationFrame(frame(now))
    },
    [stop],
  )

  const burst = useCallback(
    (ox: number, oy: number) => {
      const imgs = imgsRef.current
      if (!imgs || imgs.length === 0) return

      const n = window.innerWidth < 720 ? COUNT_MOBILE : COUNT_DESKTOP
      const room = Math.max(0, MAX_LIVE - partsRef.current.length)
      for (let i = 0; i < Math.min(n, room); i++) {
        // upward-biased fan: cats leap, they do not spill sideways
        const angle = rand(-Math.PI * 0.92, -Math.PI * 0.08)
        const speed = rand(340, 760)
        partsRef.current.push({
          x: ox, y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: rand(0, Math.PI * 2),
          vrot: rand(-Math.PI, Math.PI),
          size: rand(30, 62),
          life: 0,
          ttl: rand(1.6, 2.4),
          img: imgs[Math.floor(Math.random() * imgs.length)],
        })
      }

      ensureCanvas()
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(frame(performance.now()))
      }
    },
    [ensureCanvas, frame],
  )

  /* Reduced motion still gets the joke, just not the physics. Three cats fade
     in around the photo and fade out. Opacity only: nothing moves. */
  const calmBurst = useCallback(() => {
    const host = hostRef.current
    if (!host || sprites.length === 0) return
    const r = host.getBoundingClientRect()
    const picks = sample(sprites, 3)
    setCalm(
      picks.map((src, i) => ({
        src,
        x: r.left + r.width * [0.1, 0.5, 0.9][i],
        y: r.top + r.height * [0.15, -0.08, 0.45][i],
      })),
    )
    window.setTimeout(() => setCalm([]), 1400)
  }, [sprites])

  const fire = useCallback(
    (x: number, y: number) => {
      if (sprites.length === 0) return
      if (reduced()) { calmBurst(); return }
      if (!imgsRef.current) { void preload().then(() => burst(x, y)) ; return }
      burst(x, y)
    },
    [sprites.length, calmBurst, preload, burst],
  )

  if (sprites.length === 0) return <>{children}</>

  return (
    <>
      {/* No aria-label: the button is named by the photo's alt inside it, which
          keeps the name correct in the inert case too. */}
      <button
        ref={hostRef}
        type="button"
        className="mv-purin"
        onPointerEnter={(e) => {
          void preload()
          const r = e.currentTarget.getBoundingClientRect()
          setHint({ x: r.right + 12, y: r.top + 18 })
        }}
        onPointerLeave={() => setHint(null)}
        onClick={(e) => {
          // keyboard activation reports 0,0; burst from the photo instead
          const r = e.currentTarget.getBoundingClientRect()
          const fromKey = e.clientX === 0 && e.clientY === 0
          fire(fromKey ? r.left + r.width / 2 : e.clientX, fromKey ? r.top + r.height / 2 : e.clientY)
        }}
      >
        {children}
      </button>

      {mounted && hint &&
        createPortal(
          <span className="mv-purin-tip" style={{ left: hint.x, top: hint.y }} aria-hidden="true">
            ▸ say hi to purin
          </span>,
          document.body,
        )}

      {mounted && calm.length > 0 &&
        createPortal(
          <div className="mv-purin-calm" aria-hidden="true">
            {calm.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={c.src} alt="" style={{ left: c.x, top: c.y }} />
            ))}
          </div>,
          document.body,
        )}

      <style>{`
        .mv-purin {
          display: block; padding: 0; border: 0; background: none;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .mv-purin:focus-visible { outline: 2px solid #ff5e1f; outline-offset: 3px; }
        .mv-purin-tip {
          position: fixed; z-index: ${Z + 1};
          padding: 6px 9px;
          background: #16100c; color: #ff5e1f;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          white-space: nowrap; line-height: 1; pointer-events: none;
        }
        .mv-purin-calm img {
          position: fixed; z-index: ${Z};
          width: 76px; height: 76px; object-fit: contain;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: mv-purin-calm 1.4s ease both;
        }
        @keyframes mv-purin-calm {
          0%, 100% { opacity: 0; }
          22%, 70% { opacity: 1; }
        }
        @media (max-width: 720px) { .mv-purin-tip { display: none; } }
      `}</style>
    </>
  )
}
