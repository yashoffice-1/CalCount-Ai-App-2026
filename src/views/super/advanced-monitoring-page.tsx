'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeading } from '@/components/common/page-heading'
import { Progress } from '@/components/ui/progress'
import { LineChartCard } from '@/components/charts/lazy-charts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import { cpuMemoryTrend, globalMonitoring, systemLogs, type LogLevel, type LogRow } from '@/data/dummies'
import { formatRelativeTime } from '@/lib/format'

function levelTone(level: LogLevel) {
  switch (level) {
    case 'ERROR':
      return 'danger'
    case 'WARN':
      return 'warning'
    default:
      return 'secondary'
  }
}

export function AdvancedMonitoringPage() {
  const [cpuPct, setCpuPct] = React.useState(globalMonitoring.cpuPct)
  const [memoryPct, setMemoryPct] = React.useState(globalMonitoring.memoryPct)
  const [apiLoadPct, setApiLoadPct] = React.useState(globalMonitoring.apiLoadPct)
  const [errorRatePct, setErrorRatePct] = React.useState(globalMonitoring.errorRatePct)

  const [search, setSearch] = React.useState('')

  const [logs, setLogs] = React.useState<LogRow[]>(systemLogs)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setCpuPct((p) => Math.round(Math.max(8, Math.min(97, p + (Math.random() * 14 - 7)))))
      setMemoryPct((p) => Math.round(Math.max(12, Math.min(98, p + (Math.random() * 10 - 4)))))
      setApiLoadPct((p) => Math.round(Math.max(5, Math.min(92, p + (Math.random() * 10 - 5)))))
      setErrorRatePct((p) => Math.max(0.1, Math.round((p + (Math.random() * 0.55 - 0.25)) * 10) / 10))

      if (Math.random() < 0.25) {
        const next: LogRow = {
          id: `log_live_${Date.now()}`,
          timestampISO: new Date().toISOString(),
          level: Math.random() < 0.15 ? 'ERROR' : Math.random() < 0.45 ? 'WARN' : 'INFO',
          source: ['edge-gateway', 'api-service', 'worker-queue', 'billing', 'auth'][Math.floor(Math.random() * 5)],
          message: ['Request p95 spike detected', 'Retry policy applied', 'Webhook delivery succeeded', 'Cache warmed successfully'][Math.floor(Math.random() * 4)],
        }
        setLogs((prev) => [next, ...prev].slice(0, 30))
      }
    }, 10_000)
    return () => window.clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (cpuPct > 85) toast.warning('CPU spike', { description: 'Investigate hot endpoints.' })
    if (errorRatePct > 2.2) toast.error('Error rate rising', { description: 'Check logs for ERROR events.' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuPct, errorRatePct])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return logs
    return logs.filter((l) => `${l.id} ${l.source} ${l.message} ${l.level}`.toLowerCase().includes(q))
  }, [logs, search])
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen p-6 flex flex-col gap-4" suppressHydrationWarning>
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <PageHeading
        title="Advanced Monitoring"
        subtitle="Global server stats, live logs, and alert signals."
        right={
          <Button variant="outline" onClick={() => toast.message('Logs refreshed', { description: 'Dummy action.' })}>
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">CPU (live)</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Progress + trend preview.</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={cpuPct} />
            <LineChartCard data={cpuMemoryTrend.cpu} xKey="x" yKey="y" height={220} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Memory</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Usage</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
              <span>Current</span>
              <span className="font-semibold">{memoryPct}%</span>
            </div>
            <Progress value={memoryPct} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">API Load</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Traffic pressure</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
              <span>Now</span>
              <span className="font-semibold">{apiLoadPct}%</span>
            </div>
            <Progress value={apiLoadPct} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Error Rate</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">% of failing requests</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold">{errorRatePct}%</div>
            <Badge variant={errorRatePct > 2 ? 'danger' : errorRatePct > 1 ? 'warning' : 'secondary'}>
              {errorRatePct > 2 ? 'Degraded' : errorRatePct > 1 ? 'Watch' : 'Healthy'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">System-wide logs</CardTitle>
          <div className="text-xs text-[hsl(var(--muted))]">Filter by level/source/message.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full sm:max-w-[360px]">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs…" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-[hsl(var(--muted))]">
                    No logs match your filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.slice(0, 12).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-[hsl(var(--muted))]">
                      {formatRelativeTime(row.timestampISO)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={levelTone(row.level) as any}>{row.level}</Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.source}</TableCell>
                    <TableCell>{row.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="text-xs text-[hsl(var(--muted))]">
            Showing the latest {Math.min(12, filtered.length)} entries (dummy).
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

