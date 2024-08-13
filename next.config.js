import NextBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
let nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

    async redirects() {
        return [];
    },
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer-core',
            '@sparticuz/chromium',
        ],
    },
};

const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

nextConfig = withMDX(nextConfig);
nextConfig = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);
export default nextConfig;
