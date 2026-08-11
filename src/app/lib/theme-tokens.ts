"use client"

/**
 * Live theme-token readers for animation code.
 *
 * An element renders once, but the theme can change. So a colour must never be
 * baked into markup at render time — markup carries a marker (data-fill="acid")
 * and the tween resolves it here, against whatever palette is live when it runs.
 *
 * Both of these colours used to be hardcoded in the home page's GSAP tweens,
 * and both broke on the light ground for the same reason: the ink was '#F2EAE0',
 * so words animated to near-white on near-white, and the accent was '#ff5e1f',
 * which reads 2.75:1 on the light surface and fails even the 3:1 large-text bar.
 *
 * The fallbacks are the dark-theme values, for the case where the tween runs
 * before .te-home is in the document.
 */
const token = (name: string, fallback: string) => {
  const root = document.querySelector('.te-home')
  const v = root ? getComputedStyle(root).getPropertyValue(name).trim() : ''
  return v || fallback
}

export const inkToken = () => token('--ink', '#F2EAE0')
export const acidToken = () => token('--acid', '#ff5e1f')

/** Resolve a `data-fill` marker written by the ink/manifesto markup. */
export const fillToken = (marker: string | undefined) =>
  marker === 'acid' ? acidToken() : inkToken()
