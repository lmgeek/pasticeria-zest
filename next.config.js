/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['thinking-orbs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('nodemailer')
    }
    return config
  },
}

module.exports = nextConfig
