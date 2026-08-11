/**
 * Renders both resume variants to PDFs in /public.
 *
 * The PDFs are generated from the same /resume page the site serves, so what a
 * recruiter downloads is what the page says. Doing it by hand meant remembering
 * a Chrome path and two long flag strings, which is the kind of step that gets
 * skipped and leaves a stale PDF shipping alongside fresh copy. That already
 * happened once: the previous CV predated a whole job.
 *
 * Usage: npm run dev, then npm run resume:pdf
 */

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = process.env.RESUME_BASE_URL ?? 'http://localhost:3000'

const TARGETS = [
  { url: `${BASE}/resume`, out: 'public/Melvin-Yogiana-Data-Analyst.pdf' },
  { url: `${BASE}/resume?for=engineer`, out: 'public/Melvin-Yogiana-Software-Engineer.pdf' },
]

/* Chrome is not on PATH on Windows, and the install location differs per
   platform, so probe rather than hardcode. CHROME_PATH overrides everything. */
const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const chrome = CANDIDATES.find(p => existsSync(p))
if (!chrome) {
  console.error('Could not find Chrome. Set CHROME_PATH to the executable and try again.')
  process.exit(1)
}

const reachable = await fetch(`${BASE}/resume`, { method: 'HEAD' })
  .then(r => r.ok)
  .catch(() => false)
if (!reachable) {
  console.error(`Nothing answering at ${BASE}/resume. Start the dev server first: npm run dev`)
  process.exit(1)
}

for (const { url, out } of TARGETS) {
  const abs = resolve(process.cwd(), out)
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      // Chrome's own header and footer would stamp a URL and page numbers
      // across a document meant to look typeset.
      '--no-pdf-header-footer',
      `--print-to-pdf=${abs}`,
      // Give fonts and layout time to settle before the snapshot.
      '--virtual-time-budget=8000',
      url,
    ],
    { stdio: 'ignore' },
  )
  console.log(`${out}  <-  ${url}`)
}

console.log('\nDone. Check both open, and that neither runs past two pages.')
