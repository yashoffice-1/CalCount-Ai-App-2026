'use client'

import { Toaster } from 'sonner'

import { ThemeProvider } from '@/state/theme'
import { AuthProvider } from '@/state/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  )
}
