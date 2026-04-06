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
  { label: 'Role Management', to: '/admin/role-management', icon: <KeyRound className="h-4 w-4" /> },
]

const superItems: SidebarItem[] = [
  { label: 'Admin Management', to: '/super/admin-management', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'System Control', to: '/super/system-control', icon: <UserCog className="h-4 w-4" /> },
  { label: 'Advanced Monitoring', to: '/super/advanced-monitoring', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Audit Logs', to: '/super/audit-logs', icon: <DatabaseZap className="h-4 w-4" /> },
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
    <nav className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => {
        const isActive = pathname === item.to
        return (
          <Link
            key={item.to}
            href={item.to}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border border-[hsl(var(--border))] bg-white/90 shadow-soft dark:bg-black/35'
                : 'text-[hsl(var(--foreground))] hover:bg-white/70 dark:hover:bg-black/20'
            )}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
