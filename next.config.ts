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
      // Vehicle photos (mainImage/images/galleryMedia) from the Datendrehscheibe come
      // from HubSpot's CDN, signed URLs with an Expires/Signature query string — no
      // `search` restriction here, and no fixed pathname since it varies per file.
      // `**.` matches the numeric portal-id subdomain Datendrehscheibe returns
      // (e.g. 147753997.cdnp1.hubspotusercontent-eu1.net).
      {
        protocol: 'https',
        hostname: '**.hubspotusercontent-eu1.net',
      },
    ],
  },
}

export default nextConfig
