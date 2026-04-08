'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Download,
  Info,
  RefreshCw,
  Share2,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Users,
  Activity,
  ArrowRight
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChartCard } from '@/components/charts/lazy-charts'
import { Sparkline } from '@/components/revenue/sparkline'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { downloadCsv } from '@/lib/csv'
import {
  revenueCatOverviewKpis,
  revenueCatDailySeries,
  revenueCatRecentTransactions,
  type RevenueTxnType,
} from '@/data/revenuecat'
import { formatCurrency, formatNumber } from '@/lib/format'

function txnBadgeVariant(t: RevenueTxnType) {
  switch (t) {
    case 'TRIAL':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'NEW SUB':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'RENEWAL':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default:
      return 'bg-blue-100 text-blue-700 border-blue-200'
  }
}

export function RevenuePanelPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  function exportOverview() {
    const headers = ['Metric', 'Value', 'Note']
    const rows: (string | number)[][] = revenueCatOverviewKpis.map((k) => [
      k.label,
      k.valueIsCurrency ? formatCurrency(k.value) : formatNumber(k.value),
      k.subtitle,
    ])
    downloadCsv({ filename: 'revenue-overview.csv', headers, rows })
    toast.success('Metrics exported successfully.')
  }

  function exportTransactions() {
    downloadCsv({
      filename: 'recent-transactions.csv',
      headers: ['Customer ID', 'Country', 'Store', 'Product', 'Purchased', 'Expires', 'Revenue', 'Type'],
      rows: revenueCatRecentTransactions.map((r) => [
        r.customerId, r.country, r.store, r.product, r.purchasedLabel, r.expiresLabel, r.revenueDisplay, r.type
      ]),
    })
    toast.success('Transactions exported successfully.')
  }

  if (!mounted) return <div className="min-h-screen" />

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/30 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12" suppressHydrationWarning>
      {/* Header Area */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-2 pt-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-indigo-600 mb-2">
            <Activity className="h-4 w-4" />
            <span>FINANCIAL OVERVIEW</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Revenue Metrics</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            Real-time analytics for recurring subscriptions, MRR trends, and latest conversion events across all connected apps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm transition-all hover:shadow-md text-gray-700" onClick={exportOverview}>
            <Download className="h-4 w-4 mr-2 text-indigo-500" />
            Export Data
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* 1. Overview KPIs Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {revenueCatOverviewKpis.map((k, i) => (
          <Card
            key={k.id}
            className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-indigo-100 hover:-translate-y-1"
          >
            {/* Soft background gradient */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-${i === 0 ? 'indigo' : i === 1 ? 'emerald' : i === 2 ? 'rose' : 'amber'}-500 to-transparent`} />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${i === 0 ? 'indigo' : i === 1 ? 'emerald' : i === 2 ? 'rose' : 'amber'}-50`}>
                      {i === 0 ? <TrendingUp className={`h-4 w-4 text-indigo-600`} /> :
                        i === 1 ? <Users className={`h-4 w-4 text-emerald-600`} /> :
                          i === 2 ? <CreditCard className={`h-4 w-4 text-rose-600`} /> :
                            <Activity className={`h-4 w-4 text-amber-600`} />}
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{k.label}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
                      {k.valueIsCurrency ? formatCurrency(k.value) : formatNumber(k.value)}
                    </span>
                    <span className={`text-xs font-semibold ${k.subtitle.includes('+') ? 'text-emerald-500 bg-emerald-50' : 'text-gray-500 bg-gray-50'} px-2 py-0.5 rounded-full`}>
                      {k.subtitle}
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Charts Section */}
      <Card className="rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Revenue Trend (Last 30 Days)</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Aggregated daily MRR and one-time purchases</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg overflow-hidden ring-1 ring-gray-200">
                <button className="px-4 py-1.5 text-sm font-semibold bg-white hover:bg-gray-50 text-gray-700 transition-colors">Daily</button>
                <button className="px-4 py-1.5 text-sm font-semibold bg-indigo-50 border-x border-indigo-100 text-indigo-700 transition-colors">Weekly</button>
                <button className="px-4 py-1.5 text-sm font-semibold bg-white hover:bg-gray-50 text-gray-700 transition-colors">Monthly</button>
              </div>
              <Button variant="outline" className="h-9 gap-2 rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-700 shadow-sm">
                <Share2 className="h-4 w-4 text-gray-400" />
                Share Report
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {['All Segments', 'United States', '$ Revenue', 'Last 90 days'].map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex h-8 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                {label}
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <LineChartCard
            data={revenueCatDailySeries}
            xKey="x"
            yKey="y"
            height={320}
            color="#4f46e5" // indigo-600
          />
        </CardContent>
      </Card>

      {/* 3. Recent Transactions Section */}
      <Card className="rounded-2xl border-0 bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Recent Transactions</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Latest subscription and renewal conversions matching active filters</p>
          </div>
          <Button variant="ghost" className="h-9 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-2" onClick={exportTransactions}>
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100 bg-white">
                  <TableHead className="min-w-[200px] text-xs font-bold text-gray-400 uppercase tracking-wider py-4 pl-6">Customer</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Store</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Product</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Purchased</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Expires</TableHead>
                  <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Revenue</TableHead>
                  <TableHead className="w-[140px] text-xs font-bold text-gray-400 uppercase tracking-wider py-4 pr-6">Event Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueCatRecentTransactions.map((r, i) => (
                  <TableRow key={r.id} className="hover:bg-gray-50/60 border-b border-gray-50 last:border-0 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-indigo-100" title={r.country}>
                          {r.country}
                        </div>
                        <span className="font-mono text-sm font-semibold text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors">{r.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {r.store}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-800 py-4">{r.product}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500 py-4">{r.purchasedLabel}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500 py-4">{r.expiresLabel}</TableCell>
                    <TableCell className="text-sm font-bold text-gray-900 tabular-nums py-4">{r.revenueDisplay}</TableCell>
                    <TableCell className="pr-6 py-4">
                      <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wider border font-bold px-2.5 py-0.5 rounded-full ${txnBadgeVariant(r.type)}`}>
                        {r.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
