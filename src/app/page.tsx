'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/state/auth'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.approvalStatus === 'pending') {
      router.replace('/approval')
      return
    }
    if (user.topRole === 'super_admin') {
      router.replace('/super/system-control')
      return
    }
    router.replace('/admin/dashboard')
  }, [user, router])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[hsl(var(--accent))] border-t-transparent" />
    </div>
  )
}
