/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.gamepix.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'play.gamepix.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://play.gamepix.com https://*.gamepix.com; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig