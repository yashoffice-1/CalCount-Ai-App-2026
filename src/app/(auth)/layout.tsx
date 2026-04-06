import type { ReactNode } from 'react'

import { AuthLayoutShell } from '@/components/layout/auth-layout-shell'

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>
}
