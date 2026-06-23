/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds to finish even if there are linting errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig