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