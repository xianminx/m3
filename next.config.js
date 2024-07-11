import NextBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
    },

};

export default NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(nextConfig);
