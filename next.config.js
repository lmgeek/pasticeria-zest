/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['thinking-orbs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('nodemailer')
    }
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
