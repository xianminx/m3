'use client';
import Footer from '@/components/footer';
import NavBar from '@/components/navbar';
import PlausibleProvider from 'next-plausible';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const domain = process.env.NEXT_PUBLIC_DOMAIN || '';
    const customDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN;
    const isMindPage = pathname.startsWith('/mind'); // Hide footer for /mind and its subpages



    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <PlausibleProvider domain={domain} customDomain={customDomain} />
            </head>
            <body className={inter.className}>
                <Providers>
                    <main className={`flex flex-col min-h-dvh ${isMindPage ? 'h-screen': ''}`}>
                        <NavBar />
                        {children}
                        {!isMindPage && <Footer />}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
