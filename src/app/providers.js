'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from 'next/navigation'
import ToastProvider from '@/lib/react-toastify/ToastProvider';

export function Providers({children}) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
      <ToastProvider>

        {children}
        </ToastProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}