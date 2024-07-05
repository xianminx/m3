import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ToastProvider from "@/lib/react-toastify/ToastProvider"

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, });

export const metadata: Metadata = {
  title: "M3",
  description: "Markdown Mind Map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
        </body>
    </html>
  );
}
