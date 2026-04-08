'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/state/auth'

type LoginFlow = 'admin' | 'super_admin'

const FLOW_CONFIG: Record<LoginFlow, { label: string; email: string; hint: string }> = {
  admin: {
    label: 'Admin',
    email: 'admin@calcount.ai',
    hint: 'Standard admin console',
  },
  super_admin: {
    label: 'Super Admin',
    email: 'super@calcount.ai',
    hint: 'Full platform control',
  },
}

export function LoginPage() {
  const { loginByEmail } = useAuth()
  const [flow, setFlow] = React.useState<LoginFlow>('admin')
  const [email, setEmail] = React.useState(FLOW_CONFIG.admin.email)
  const [password, setPassword] = React.useState('••••••••')
  const [loading, setLoading] = React.useState(false)

  function applyFlow(next: LoginFlow) {
    setFlow(next)
    setEmail(FLOW_CONFIG[next].email)
  }

  function onEmailChange(value: string) {
    setEmail(value)
    const lower = value.trim().toLowerCase()
    if (lower === FLOW_CONFIG.super_admin.email) setFlow('super_admin')
    else if (lower === FLOW_CONFIG.admin.email) setFlow('admin')
  }

  function onLogin(e: React.FormEvent) {
    e.preventDefault()
    const before = email.trim()
    if (!before) {
      toast.error('Enter email')
      return
    }
    setLoading(true)
    loginByEmail(before, password)
    setLoading(false)
  }

  return (
    <Card className="border border-[hsl(var(--border))]/80 bg-white/75 shadow-glow backdrop-blur-xl dark:bg-black/45 dark:shadow-black/40 rounded-2xl" suppressHydrationWarning>
      <CardHeader className="space-y-3 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[hsl(var(--border))] overflow-hidden shadow-lg bg-white">
          <img src="/brand-logo.jpg" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Pick the console you want to open, then continue with the preview account email.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onLogin}>
          <div className="space-y-2">
            <span className="text-xs font-medium text-[hsl(var(--foreground))]">Console</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-between rounded-xl border-[hsl(var(--border))] bg-white/50 font-normal dark:bg-black/25"
                >
                  <span className="flex flex-col items-start gap-0.5">
                    <span>{FLOW_CONFIG[flow].label}</span>
                    <span className="text-[11px] font-normal text-[hsl(var(--muted))]">
                      {FLOW_CONFIG[flow].hint}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl"
              >
                <DropdownMenuLabel className="text-xs">Choose flow</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg py-2.5" onSelect={() => applyFlow('admin')}>
                  <div className="flex flex-col gap-0.5">
                    <span>{FLOW_CONFIG.admin.label}</span>
                    <span className="text-xs text-[hsl(var(--muted))]">{FLOW_CONFIG.admin.hint}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg py-2.5"
                  onSelect={() => applyFlow('super_admin')}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{FLOW_CONFIG.super_admin.label}</span>
                    <span className="text-xs text-[hsl(var(--muted))]">
                      {FLOW_CONFIG.super_admin.hint}
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[hsl(var(--foreground))]" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@company.com"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[hsl(var(--foreground))]" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-[11px] font-medium text-[hsl(var(--accent))] hover:underline">
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border-[hsl(var(--border))] bg-white/60 dark:bg-black/30"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-[15px] font-medium">
            {loading ? 'Signing in…' : 'Continue'}
          </Button>
          <p className="text-center text-xs text-[hsl(var(--muted))]">
            New here?{' '}
            <Link className="font-medium text-[hsl(var(--accent))] underline-offset-4 hover:underline" href="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
