/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mssql']
  },
  // Enable standalone output for Docker optimization
  output: 'standalone'
}

module.exports = nextConfig
