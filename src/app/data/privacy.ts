/**
 * Privacy content, rebuilt from what the code actually does.
 *
 * The previous page said "I might use basic analytics" and "sharing your info
 * (spoiler: I don't)". Both were vaguer than the truth in a way that
 * undersells it: this site runs its own analytics rather than embedding
 * someone else's, stores nine named fields, derives identity from a salted
 * hash that rotates daily, sets no cookies at all, and publishes the resulting
 * data openly. It also genuinely does hand data to four processors, which the
 * old page did not mention.
 *
 * Every claim below was checked against the source: the tracker route, the
 * analytics helper, the email route and the chat route. Nothing here is
 * aspirational.
 *
 * The author's voice is kept. The headings were already good, and a privacy
 * page that sounds like a person is worth more than one that sounds like a
 * template.
 */

export const LAST_UPDATED = '4 August 2026'

export const summary = [
  { k: 'Cookies', v: 'None. Not one, not even a "functional" one.' },
  { k: 'Accounts', v: 'There are none. Nothing to sign up for, nothing to delete.' },
  { k: 'Who sees the data', v: 'Me, and you: the traffic figures are public at /stats.' },
]

/** Exactly what one pageview writes, in the order the insert lists them. */
export const storedFields: { field: string; example: string; note: string }[] = [
  { field: 'visitor_id', example: 'a1f4…', note: 'A hash, described below. Not an account, not an ID you carry.' },
  { field: 'path', example: '/projects/data', note: 'Which page. Query strings are dropped before storage.' },
  { field: 'referrer_host', example: 'linkedin.com', note: 'The site you arrived from, host only. Never the full URL.' },
  { field: 'country', example: 'AU', note: 'From the edge request header, never an IP lookup.' },
  { field: 'device', example: 'mobile', note: 'One of desktop, mobile or tablet.' },
  { field: 'browser', example: 'safari', note: 'Bucketed from the user agent. Anything unknown becomes Other.' },
  { field: 'os', example: 'iOS', note: 'Same source, same bucketing.' },
  { field: 'utm_source', example: 'newsletter', note: 'Only if a link you clicked carried one.' },
  { field: 'event', example: 'null', note: 'Null for a plain pageview.' },
]

export const identity = {
  title: 'How I count you without knowing you',
  body: [
    'There is no cookie and no stored identifier. The visitor id is a hash of a secret salt, the current Sydney date, your IP address and your user agent. Your IP is used to compute that hash and is then thrown away. It is never written down.',
    'Because the date is part of the hash, the id changes at midnight Sydney time. Tomorrow you are a different visitor to this site, which means there is no way to follow anyone across days even if I wanted to.',
    'The one clever use of it is honest: the live feed on the stats page can mark which row is you, because the same hash gets recomputed for your request and compared in the query. The hash itself never leaves the server. Your browser only ever receives a yes or no.',
  ],
}

export const processors = [
  { name: 'Vercel', role: 'Hosts the site and serves every request.', data: 'Standard server logs, plus the country header the tracker reads.' },
  { name: 'Neon', role: 'Runs the Postgres database.', data: 'The nine fields listed above, nothing else.' },
  { name: 'Resend', role: 'Delivers contact-form messages to my inbox.', data: 'Your name, email and message, in transit.' },
  { name: 'Google Gemini', role: 'Answers the chat box on the site.', data: 'Whatever you type into it, sent to the model to get a reply.' },
]

export const sections = [
  {
    id: 'contact-form',
    title: 'If you use the contact form',
    body: [
      'I get your name, email address and message, delivered to my inbox through Resend. They are not written to the database. I use them to reply to you and nothing else: no list, no newsletter, no forwarding.',
    ],
  },
  {
    id: 'chat',
    title: 'If you use the chat box',
    body: [
      'What you type is sent to Google Gemini to generate a reply, the same way any chat assistant works. Do not paste anything into it you would not want leaving this site, because it does leave this site.',
    ],
  },
  {
    id: 'storage',
    title: 'What is stored on your device',
    body: [
      'One thing, and only if you find the hidden game: whether you muted its sound. That is a localStorage flag called mv-dgn-muted. Clearing your site data removes it and nothing else breaks.',
    ],
  },
  {
    id: 'selling',
    title: 'Selling your data',
    body: [
      'No. There is nothing to sell that anyone would want, and I would not sell it if there were. If you ever send me something sensitive by accident, email me and I will delete it.',
    ],
  },
  {
    id: 'security',
    title: 'Security, honestly',
    body: [
      'The contact and chat endpoints are rate limited, the database is not exposed to the browser, and the analytics data has nothing personal in it by design. That said, no system is airtight, and anyone who tells you otherwise is selling something.',
    ],
  },
  {
    id: 'changes',
    title: 'If this changes',
    body: [
      'The date at the top moves and the page changes with it. There is no mailing list to notify, because there is no mailing list.',
    ],
  },
]

export const links = [
  { label: 'See the data yourself', href: '/stats', note: 'The live dashboard, public.' },
  { label: 'Email me', href: 'mailto:melvindarialyogiana@gmail.com', note: 'Questions, or a deletion request.' },
]
