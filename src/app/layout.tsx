import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PlausibleProvider from 'next-plausible';
import NavBar from '@/components/navbar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false });

export const metadata: Metadata = {
    title: 'M3',
    description: 'Markdown Mind Map',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || '';
    const customDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN;
    return (
        <html lang="en" suppressHydrationWarning>
            {' '}
            <head>
                <PlausibleProvider domain={domain} customDomain={customDomain} />
            </head>
            <body className={inter.className}>
                <Providers>
                    <main className="flex flex-col min-h-dvh">
                        <NavBar />
                        {children}
                        <Footer />
                    </main>
                </Providers>
            </body>
        </html>
    );
}
