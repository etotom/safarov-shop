'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, LanguageProvider } from '../lib'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
