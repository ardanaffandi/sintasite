/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['placeholder.svg', 'via.placeholder.com'],
  },
  experimental: {
    esmExternals: false,
  },
}

export default nextConfig
