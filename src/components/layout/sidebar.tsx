'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CircleDollarSign,
  LifeBuoy,
  LayoutDashboard,
  DatabaseZap,
  Server,
  AlertTriangle,
  Users,
  UserCog,
  ShieldCheck,
  KeyRound,
  ClipboardList,
  Clock,
} from 'lucide-react'

import { cn } from '@/lib/utils'

export type SidebarItem = {
  label: string
  to: string
  icon: React.ReactNode
}

const commonItems: SidebarItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'API View', to: '/admin/api-view', icon: <DatabaseZap className="h-4 w-4" /> },
  { label: 'Server Consumption', to: '/admin/server-consumption', icon: <Server className="h-4 w-4" /> },
  { label: 'Customer Support', to: '/admin/tickets', icon: <LifeBuoy className="h-4 w-4" /> },
  { label: 'Revenue Panel', to: '/admin/revenue', icon: <CircleDollarSign className="h-4 w-4" /> },
  { label: 'Issues', to: '/admin/issues', icon: <AlertTriangle className="h-4 w-4" /> },
  { label: 'User Pattern', to: '/admin/user-pattern', icon: <Clock className="h-4 w-4" /> },
  { label: 'User Details', to: '/admin/user-details', icon: <Users className="h-4 w-4" /> },
]

const superItems: SidebarItem[] = [
  { label: 'Admin Management', to: '/super/admin-management', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'System Control', to: '/super/system-control', icon: <UserCog className="h-4 w-4" /> },
  { label: 'Advanced Monitoring', to: '/super/advanced-monitoring', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Audit Logs', to: '/super/audit-logs', icon: <DatabaseZap className="h-4 w-4" /> },
  { label: 'Role Management', to: '/super/role-management', icon: <KeyRound className="h-4 w-4" /> },
]

export function Sidebar({
  panel,
  onNavigate,
  className,
}: {
  panel: 'admin' | 'super'
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  const items = panel === 'super' ? superItems : commonItems

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Brand Header */}
      <div className="px-3 mb-6 pt-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[hsl(var(--border))] shadow-soft">
            <img 
              src="/brand-logo.jpg" 
              alt="CalCount Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-bold leading-none tracking-tight text-[hsl(var(--foreground))]">CalCount Admin</div>
            <div className="text-[11px] font-medium text-[hsl(var(--muted))] mt-1 uppercase tracking-wider">
              {panel === 'super' ? 'Super Admin' : 'Admin'} console
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={onNavigate}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border border-[hsl(var(--border))] bg-white shadow-sm dark:bg-[hsl(var(--card))] text-[hsl(var(--accent))]'
                  : 'text-[hsl(var(--muted))] hover:bg-white/80 dark:hover:bg-black/10 hover:text-[hsl(var(--foreground))]'
              )}
            >
              <span className={cn('transition-colors', isActive ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] group-hover:text-[hsl(var(--foreground))]')}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
