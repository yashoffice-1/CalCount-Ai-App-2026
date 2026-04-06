'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/state/auth'

export function ApprovalPage() {
  const { user, logout } = useAuth()

  React.useEffect(() => {
    if (user?.approvalStatus !== 'pending') return
    const interval = window.setInterval(() => {
      if (Math.random() < 0.2)
        toast.message('Waiting for Super Admin…', {
          description: 'Approval status updates will appear here.',
        })
    }, 15_000)
    return () => window.clearInterval(interval)
  }, [user?.approvalStatus])

  return (
    <Card className="border border-[hsl(var(--border))]/80 bg-white/75 shadow-glow backdrop-blur-xl dark:bg-black/45 dark:shadow-black/40 rounded-2xl">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Pending approval</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Your admin access request is waiting for a Super Admin to confirm.
          </CardDescription>
        </div>
        <Button variant="outline" className="shrink-0 rounded-xl" onClick={logout}>
          Logout
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--border))]/70 bg-white/40 px-3 py-2 text-xs text-[hsl(var(--muted))] dark:bg-black/25">
          <span className="font-medium text-[hsl(var(--foreground))]">Account: </span>
          {user ? `${user.email} · requested ${user.subRole ?? 'Viewer'}` : '—'}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 p-4 dark:bg-black/25">
            <div className="text-sm font-semibold">Current status</div>
            <div className="mt-1 text-xs text-[hsl(var(--muted))]">
              Super Admin must approve before your role is assigned.
            </div>
            <div className="mt-4 text-xs text-[hsl(var(--muted))]">
              You can keep this page open while waiting (demo UX).
            </div>
          </div>
          <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 p-4 dark:bg-black/25">
            <div className="text-sm font-semibold">What happens next</div>
            <ul className="mt-2 space-y-2 text-xs text-[hsl(var(--muted))]">
              <li>1. Super Admin reviews your requested role.</li>
              <li>2. If approved, your access becomes active.</li>
              <li>3. If rejected, you can request again.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
