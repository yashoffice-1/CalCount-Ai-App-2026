'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChartCard } from '@/components/charts/lazy-charts'
import { cpuMemoryTrend } from '@/data/dummies'

export function ServerConsumptionPage() {
  const [cpuPct, setCpuPct] = React.useState(58)
  const [memoryPct, setMemoryPct] = React.useState(62)
  const threshold = 80
  const [cpuPoints, setCpuPoints] = React.useState(cpuMemoryTrend.cpu)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setCpuPct((prev) => {
        const next = Math.round(Math.max(10, Math.min(95, prev + (Math.random() * 18 - 9))))
        setCpuPoints((p) => {
          const lastX = p[p.length - 1]?.x ?? 'Now'
          const nextPoint = { x: lastX === '21:00' ? 'Now' : 'Now', y: next }
          return [...p.slice(1), nextPoint]
        })
        if (next > threshold) {
          toast.warning('Server alert', {
            description: `CPU at ${next}% is above threshold (${threshold}%).`,
          })
        }
        return next
      })
      setMemoryPct((prev) => {
        const next = Math.round(Math.max(15, Math.min(98, prev + (Math.random() * 10 - 4))))
        return next
      })
    }, 10_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeading
        title="Server Consumption"
        subtitle="Track CPU + memory signals and detect threshold breaches."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Real-time graph</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              CPU usage trend (dummy live updates)
            </div>
          </CardHeader>
          <CardContent>
            <LineChartCard data={cpuPoints} xKey="x" yKey="y" height={260} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">CPU Usage</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              Threshold: {threshold}%
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--muted))]">Current</span>
                <span className="font-semibold">{cpuPct}%</span>
              </div>
              <div className="mt-3">
                <Progress value={cpuPct} />
              </div>
            </div>

            {cpuPct > threshold ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300" />
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                    Alert: CPU above threshold
                  </div>
                </div>
                <div className="mt-1 text-xs text-[hsl(var(--muted))]">
                  Consider scaling to maintain latency targets.
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-sm font-semibold">No active alerts</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted))]">
                  CPU is within the safe range.
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--muted))]">Memory usage</span>
                <span className="font-semibold">{memoryPct}%</span>
              </div>
              <Progress value={memoryPct} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

