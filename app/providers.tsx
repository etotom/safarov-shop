'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './lib/theme.tsx'
import { LanguageProvider } from './lib/language.tsx'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
