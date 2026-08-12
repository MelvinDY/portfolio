import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // other config options can stay here
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