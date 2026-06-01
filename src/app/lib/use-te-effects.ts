"use client"

import { useEffect } from 'react'

export function useTeEffects() {
  useEffect(() => {
    document.body.classList.add('te-home-page')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Header scroll
    const head = document.querySelector<HTMLElement>('.te-home .site-head')
    const onScroll = () => { if (head) head.classList.toggle('scrolled', window.scrollY > 24) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Reveal on scroll
    const revs = Array.from(document.querySelectorAll<Element>('.te-home [data-reveal]'))
    const show = (el: Element) => el.classList.add('in')
    const inView = (el: Element) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh * 0.92 && r.bottom > 0
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    revs.forEach((el) => io.observe(el))
    const sweep = () => revs.forEach((el) => { if (inView(el)) show(el) })
    requestAnimationFrame(sweep)
    window.addEventListener('load', sweep)
    window.addEventListener('scroll', sweep, { passive: true })
    const revealTimeout = setTimeout(() => revs.forEach(show), 2600)

    // Bar fills (both .pb-fill and .bfill and .fbar)
    const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-bar]'))
    const barsIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        barsIo.unobserve(e.target)
        const el = e.target as HTMLElement
        setTimeout(() => { el.style.width = (el.dataset.bar ?? '0') + '%' }, 80)
      })
    }, { threshold: 0.4 })
    bars.forEach((b) => barsIo.observe(b))

    // Animated counters
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))
    const fmt = (v: number, dec: number) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        cio.unobserve(el)
        const end = parseFloat(el.dataset.count!)
        const dec = (el.dataset.count!.split('.')[1] || '').length
        const pre = el.dataset.pre || ''
        const suf = el.dataset.suf || ''
        if (reduce) { el.textContent = pre + fmt(end, dec) + suf; return }
        const dur = 1400; const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = pre + fmt(end * eased, dec) + suf
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = pre + fmt(end, dec) + suf
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.6 })
    counters.forEach((c) => cio.observe(c))

    // Role rotator (no-op if element absent)
    const rotor = document.querySelector<HTMLElement>('[data-rotator]')
    let rotorInterval: ReturnType<typeof setInterval> | null = null
    if (rotor && !reduce) {
      const words: string[] = JSON.parse(rotor.getAttribute('data-rotator') || '[]')
      let i = 0
      rotor.textContent = words[0]
      rotorInterval = setInterval(() => {
        rotor.style.transition = 'opacity .35s ease, transform .35s ease'
        rotor.style.opacity = '0'
        rotor.style.transform = 'translateY(-10px)'
        setTimeout(() => {
          i = (i + 1) % words.length
          rotor.textContent = words[i]
          rotor.style.transform = 'translateY(10px)'
          requestAnimationFrame(() => { rotor.style.opacity = '1'; rotor.style.transform = 'translateY(0)' })
        }, 360)
      }, 2400)
    }

    // Card spotlight
    const spotCleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('.pcard').forEach((card) => {
      const onMove = (ev: PointerEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width) * 100 + '%')
        card.style.setProperty('--my', ((ev.clientY - r.top) / r.height) * 100 + '%')
      }
      card.addEventListener('pointermove', onMove)
      spotCleanups.push(() => card.removeEventListener('pointermove', onMove))
    })

    // Magnetic buttons
    const magneticCleanups: (() => void)[] = []
    if (!reduce && window.matchMedia('(pointer:fine)').matches) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = 0.32
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`
        }
        const onLeave = () => { el.style.transform = 'translate(0,0)' }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        magneticCleanups.push(() => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        })
      })
    }

    // Copy email
    const copyCleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('[data-copy]').forEach((btn) => {
      const onClick = (e: Event) => {
        e.preventDefault()
        const val = btn.getAttribute('data-copy')!
        navigator.clipboard?.writeText(val).then(() => {
          const label = btn.querySelector<HTMLElement>('[data-copy-label]') || btn
          const prev = label.textContent
          label.textContent = 'copied ✓'
          setTimeout(() => { label.textContent = prev }, 1500)
        })
      }
      btn.addEventListener('click', onClick)
      copyCleanups.push(() => btn.removeEventListener('click', onClick))
    })

    return () => {
      document.body.classList.remove('te-home-page')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', sweep)
      window.removeEventListener('scroll', sweep)
      clearTimeout(revealTimeout)
      if (rotorInterval) clearInterval(rotorInterval)
      io.disconnect(); barsIo.disconnect(); cio.disconnect()
      spotCleanups.forEach((fn) => fn())
      magneticCleanups.forEach((fn) => fn())
      copyCleanups.forEach((fn) => fn())
    }
  }, [])
}
