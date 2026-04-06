'use client'

import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { TopNavbar } from './top-navbar'

export function AppShell({
  panel,
  children,
}: {
  panel: 'admin' | 'super'
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* ── Sticky sidebar (desktop) ── */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] shrink-0 sticky top-0 h-screen border-r border-[hsl(var(--border))] bg-white/75 dark:bg-black/25 backdrop-blur z-20">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sidebar-scroll">
          <Sidebar panel={panel} />
        </div>
      </aside>

      {/* ── Mobile sidebar (sheet) ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left">
          <Sidebar panel={panel} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          panel={panel}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <main className="content-area px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

