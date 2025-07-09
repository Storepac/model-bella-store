/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Redireciona chamadas /api/* para o backend definido em NEXT_PUBLIC_BACKEND_URL
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/images/**',
      },
    ],
  },
}

export default nextConfig