import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* Development only, and it has no effect on a build or on production.
     Next blocks requests to /_next/* dev resources from any origin other than
     the one the server prints as "Local", which means opening the "Network"
     URL on a phone serves the HTML but not the client bundle. The page looks
     completely normal and nothing on it responds, because React never
     hydrated — the failure is a silent one-line warning in the dev server log,
     not an error in the browser.

     Add whatever address the dev server prints as "Network". A DHCP lease can
     move it, hence the subnet as well as the current host. */
  allowedDevOrigins: ["192.168.4.241", "192.168.4.*", "192.168.1.*"],

  async headers() {
    return [
      {
        // Every route, including /api/*. Vercel already sends HSTS.
        source: "/:path*",
        headers: [
          {
            // Everything this site loads is same-origin: next/font/google
            // self-hosts the four faces at build time, there are no remote
            // images, no <Script> tags, and no third-party analytics. The only
            // outbound origins in the source are plain anchor hrefs, which a
            // CSP doesn't govern. So 'self' is genuinely enough.
            //
            // script-src keeps 'unsafe-inline' deliberately. The alternative is
            // per-request nonces, which need middleware, and middleware would
            // make every page dynamic -- the whole site is prerendered today
            // (X-Nextjs-Prerender: 1 on every HTML response) and that is worth
            // more than the marginal hardening. Next's own bootstrap, the
            // next-themes flash-guard, and the JSON-LD blocks are all inline.
            // Read this line as "no external script origins", not "no XSS".
            //
            // style-src likewise: GSAP animates by writing inline styles.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              // data: for the three.js canvas textures, blob: for anything it
              // generates at runtime.
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "media-src 'self'", // dungeon audio under /public/audio
              "connect-src 'self'", // the client only ever calls /api/*
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // frame-ancestors above covers modern browsers; this is the older
          // header for the same thing, and costs one line.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL same-origin (so the referrer panel on /stats
          // still distinguishes internal navigation) but only the origin
          // outward, and nothing at all when downgrading to http.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here asks for any of these.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        // /projects was a separate, older index of the same work. The complete
        // one now lives at /projects/all — permanent, so the link equity of any
        // existing inbound link follows it rather than being spent twice.
        // Exact match only: /projects/data and /projects/software are untouched.
        source: "/projects",
        destination: "/projects/all",
        permanent: true,
      },
    ]
  },
}

export default nextConfig