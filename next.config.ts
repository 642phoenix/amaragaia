
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev','http://localhost:3000', '192.168.1.2'],
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;

