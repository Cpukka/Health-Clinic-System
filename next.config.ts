import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: 'standalone', // Important for Docker
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig