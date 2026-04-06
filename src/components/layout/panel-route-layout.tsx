'use client'

import * as React from 'react'

import { AppShell } from '@/components/layout/app-shell'
import { RequireAdminApproval, RequireSuperAdmin } from '@/components/layout/guards'

export function PanelRouteLayout({
  panel,
  children,
}: {
  panel: 'admin' | 'super'
  children: React.ReactNode
}) {
  const Guard = panel === 'super' ? RequireSuperAdmin : RequireAdminApproval
  return (
    <Guard>
      <AppShell panel={panel}>{children}</AppShell>
    </Guard>
  )
}
