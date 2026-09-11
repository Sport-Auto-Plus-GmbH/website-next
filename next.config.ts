import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required by the Dockerfile (see .github/workflows/c_build_and_deploy.yml).
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      // Vehicle photos are NOT loaded from their upstream CDN directly — see
      // app/api/vehicles/[vehicleViewId]/image/route.ts, which proxies them through this
      // Website's own origin so the client never sees the Datendrehscheibe/HubSpot URL.
      // A same-origin `src` needs no remotePattern, so no entry for that CDN here.
    ],
  },
}

export default nextConfig
