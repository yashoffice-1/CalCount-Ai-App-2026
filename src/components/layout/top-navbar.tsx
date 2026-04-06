'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
} from 'lucide-react'

import { useAuth } from '@/state/auth'
import { useTheme } from '@/state/theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function TopNavbar({
  panel,
  onMobileMenu,
}: {
  panel: 'admin' | 'super'
  onMobileMenu?: () => void
}) {
  const { user, switchViewMode, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const unreadCount = React.useMemo(() => {
    const seed = pathname.length
    return 2 + (seed % 5)
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-white/85 dark:bg-black/35 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-white/60 dark:bg-black/20 shadow-soft"
            onClick={onMobileMenu}
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-white shadow-soft">
              C
            </span>
            <div className="hidden sm:block">
              <div className="text-sm leading-none">CalCount Admin</div>
              <div className="text-xs text-[hsl(var(--muted))]">
                {panel === 'super' ? 'Super Admin' : 'Admin'} console
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
            <Input
              aria-label="Search"
              placeholder="Search APIs, users, tickets, issues…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--accent))] px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>CPU spike detected</DropdownMenuItem>
              <DropdownMenuItem disabled>New ticket created</DropdownMenuItem>
              <DropdownMenuItem disabled>API error rate increased</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-xl px-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/50 border border-[hsl(var(--border))]">
                  <span className="text-xs font-semibold">{user?.name?.[0] ?? 'U'}</span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name?.split(' ')[0] ?? 'Admin'}
                </span>
                <ChevronDown className="h-4 w-4 text-[hsl(var(--muted))]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{user?.email ?? '—'}</span>
                  {panel === 'super' ? (
                    <Badge variant="info">Super</Badge>
                  ) : (
                    <Badge variant="secondary">Admin</Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => switchViewMode('admin')}
                disabled={user?.topRole !== 'super_admin' || panel === 'admin'}
              >
                Switch to Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => switchViewMode('super_admin')}
                disabled={user?.topRole !== 'super_admin' || panel === 'super'}
              >
                Switch to Super Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

