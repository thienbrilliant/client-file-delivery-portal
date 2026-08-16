import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  devIndicators: false,
  experimental: {
    serverActions: {
      // GitHub Codespaces terminates the public request at a proxy, so the
      // forwarded host is *.app.github.dev while Next sees localhost:3000.
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        '*.github.dev',
        '*.githubpreview.dev',
      ],
    },
  },
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }]; },
};

export default nextConfig;
