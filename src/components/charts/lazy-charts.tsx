'use client'

import dynamic from 'next/dynamic'

function ChartSkeleton() {
  return (
    <div
      className="h-[240px] w-full animate-pulse rounded-xl bg-black/[0.04] dark:bg-white/[0.06]"
      aria-hidden
    />
  )
}

export const LineChartCard = dynamic(
  () => import('./charts').then((m) => m.LineChartCard),
  { ssr: false, loading: ChartSkeleton }
)

export const BarChartCard = dynamic(
  () => import('./charts').then((m) => m.BarChartCard),
  { ssr: false, loading: ChartSkeleton }
)

export const PieChartCard = dynamic(
  () => import('./charts').then((m) => m.PieChartCard),
  { ssr: false, loading: ChartSkeleton }
)
