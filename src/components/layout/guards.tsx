'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/state/auth'

function AuthGateFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      suppressHydrationWarning
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[hsl(var(--accent))] border-t-transparent"
        suppressHydrationWarning
      />
    </div>
  )
}

export function RequireAdminApproval({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  const allowed = React.useMemo(() => {
    if (!user) return false
    if (user.approvalStatus === 'pending') return false
    if (user.topRole !== 'admin' && user.topRole !== 'super_admin') return false
    return true
  }, [user])

  React.useLayoutEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.approvalStatus === 'pending') {
      router.replace('/approval')
      return
    }
    if (user.topRole !== 'admin' && user.topRole !== 'super_admin') {
      router.replace('/super/system-control')
    }
  }, [user, router])

  if (!allowed) return <AuthGateFallback />
  return <>{children}</>
}

export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  const allowed = React.useMemo(() => {
    if (!user) return false
    if (user.approvalStatus === 'pending') return false
    if (user.topRole !== 'super_admin') return false
    return true
  }, [user])

  React.useLayoutEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.approvalStatus === 'pending') {
      router.replace('/approval')
      return
    }
    if (user.topRole !== 'super_admin') {
      router.replace('/admin/dashboard')
    }
  }, [user, router])

  if (!allowed) return <AuthGateFallback />
  return <>{children}</>
}
