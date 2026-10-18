/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: { '/*': ['./.env*', './.anora-data/**', './tests/**', './docs/**'] },
  experimental: { serverActions: { bodySizeLimit: '64kb' } },
  serverExternalPackages: ['node:sqlite', 'nodemailer', 'pdfkit'],
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/track-order',
        destination: '/',
        permanent: false,
      },
    ]
  }
}

export default nextConfig
