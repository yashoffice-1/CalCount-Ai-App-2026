'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth, type AdminSubRole } from '@/state/auth'

const roleOptions: AdminSubRole[] = ['Admin', 'Support', 'Viewer']

export function SignupPage() {
  const { signup } = useAuth()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [requestedSubRole, setRequestedSubRole] = React.useState<AdminSubRole>('Viewer')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please complete all fields')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    signup({
      name: name.trim(),
      email: email.trim(),
      password,
      requestedSubRole,
    })
    setLoading(false)
  }

  return (
    <Card className="border border-[hsl(var(--border))]/80 bg-white/75 shadow-glow backdrop-blur-xl dark:bg-black/45 dark:shadow-black/40 rounded-2xl">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-sm font-bold text-white shadow-lg shadow-[hsl(var(--accent))]/30">
          C
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            New admins go through Super Admin approval before they can access the console.
          </CardDescription>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))]/70 bg-white/40 px-3 py-2.5 text-xs text-[hsl(var(--muted))] dark:bg-black/25">
          <span className="font-medium text-[hsl(var(--foreground))]">Flow: </span>
          Signup → Pending → Super Admin approves → Role assigned → Sign in
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]">Full name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]">Requested role</label>
            <select
              value={requestedSubRole}
              onChange={(e) => setRequestedSubRole(e.target.value as AdminSubRole)}
              className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-white/60 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-black/30"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]">Verify password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>

          <Button className="h-11 w-full rounded-xl text-[15px] font-medium" type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Request access'}
          </Button>

          <p className="text-center text-xs text-[hsl(var(--muted))]">
            Already have an account?{' '}
            <Link className="font-medium text-[hsl(var(--accent))] underline-offset-4 hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
