'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { PageHeading } from '@/components/common/page-heading'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChartCard, BarChartCard } from '@/components/charts/lazy-charts'
import { Progress } from '@/components/ui/progress'

import { dashboardKpis, apiUsageTrend, revenueTrend, cpuMemoryTrend } from '@/data/dummies'
import { formatCurrency, formatNumber } from '@/lib/format'

export function DashboardPage() {
  const [kpis, setKpis] = React.useState(dashboardKpis)
  const [cpuPct, setCpuPct] = React.useState(61)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setKpis((prev) => ({
        ...prev,
        activeTickets: prev.activeTickets + (Math.random() > 0.85 ? 1 : 0),
      }))
      setCpuPct((prev) => {
        const next = Math.round(Math.max(10, Math.min(95, prev + (Math.random() * 16 - 8))))
        if (next > 80) {
          toast.warning('CPU threshold exceeded', { description: 'Scaling recommendation created.' })
        }
        return next
      })
    }, 12_000)
    return () => window.clearInterval(interval)
  }, [])
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen p-6" />
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <PageHeading
        title="Dashboard"
        subtitle="Operational overview for your SaaS tenants."
        right={
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-xs text-[hsl(var(--muted))]">Live CPU</div>
            <div className="w-[180px]">
              <Progress value={cpuPct} />
            </div>
            <div className="text-xs font-semibold">{cpuPct}%</div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Users" value={formatNumber(kpis.totalUsers)} tone="accent" />
        <KpiCard label="Active APIs" value={String(kpis.activeApis)} tone="success" />
        <KpiCard label="Revenue Today" value={formatCurrency(kpis.revenueToday)} tone="warning" />
        <KpiCard label="Active Tickets" value={String(kpis.activeTickets)} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">API usage trend</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              Requests per day (dummy)
            </div>
          </CardHeader>
          <CardContent>
            <LineChartCard data={apiUsageTrend.points} xKey="x" yKey="y" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Revenue trend</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              Weekly revenue (dummy)
            </div>
          </CardHeader>
          <CardContent>
            <BarChartCard data={revenueTrend.points} xKey="x" yKey="y" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Server consumption (quick view)</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">CPU + Memory signals</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[hsl(var(--muted))]">CPU usage</span>
                  <span className="font-semibold">{cpuPct}%</span>
                </div>
                <div className="mt-2">
                  <Progress value={cpuPct} />
                </div>
                <div className="mt-3 text-xs text-[hsl(var(--muted))]">
                  Threshold: 80% (alerts when exceeded)
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[hsl(var(--muted))]">Memory usage</span>
                  <span className="font-semibold">58%</span>
                </div>
                <Progress value={58} />
                <div className="text-xs text-[hsl(var(--muted))]">
                  Trend line shown below.
                </div>
              </div>
            </div>
            <div className="mt-4">
              <LineChartCard data={cpuMemoryTrend.cpu} xKey="x" yKey="y" height={240} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Realtime alerts</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Live threshold checks</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cpuPct > 80 ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                    CPU spike detected
                  </div>
                  <div className="text-xs text-[hsl(var(--muted))]">
                    Consider autoscaling and query optimization.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                  <div className="text-sm font-semibold">All systems nominal</div>
                  <div className="text-xs text-[hsl(var(--muted))]">
                    CPU is below the alert threshold.
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-sm font-semibold">Ticket queue health</div>
                <div className="text-xs text-[hsl(var(--muted))]">
                  {kpis.activeTickets} active tickets across support agents.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

