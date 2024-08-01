import NextBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/mind/interactive',
            permanent: true,
          }
        ]
      },
    experimental: {
        serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
    },

};

export default NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(nextConfig);
