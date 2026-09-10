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
    ],
  },
}

export default nextConfig
