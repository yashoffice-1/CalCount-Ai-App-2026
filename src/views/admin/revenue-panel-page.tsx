'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Download,
  Info,
  RefreshCw,
  Share2,
  ChevronDown,
} from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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

function txnBadgeVariant(t: RevenueTxnType): 'warning' | 'info' | 'success' {
  switch (t) {
    case 'TRIAL':
      return 'warning'
    case 'NEW SUB':
      return 'info'
    case 'RENEWAL':
      return 'success'
    default:
      return 'info'
  }
}

export function RevenuePanelPage() {
  const [sandbox, setSandbox] = React.useState(false)

  function exportOverview() {
    const headers = ['Metric', 'Value', 'Note']
    const rows: (string | number)[][] = revenueCatOverviewKpis.map((k) => [
      k.label,
      k.valueIsCurrency ? formatCurrency(k.value) : formatNumber(k.value),
      k.subtitle,
    ])
    downloadCsv({
      filename: 'revenuecat-overview.csv',
      headers,
      rows,
    })
    toast.success('Exported', { description: 'Overview metrics (demo data).' })
  }

  function exportTransactions() {
    downloadCsv({
      filename: 'revenuecat-recent-transactions.csv',
      headers: [
        'Customer ID',
        'Country',
        'Store',
        'Product',
        'Purchased',
        'Expires',
        'Revenue',
        'Type',
      ],
      rows: revenueCatRecentTransactions.map((r) => [
        r.customerId,
        r.country,
        r.store,
        r.product,
        r.purchasedLabel,
        r.expiresLabel,
        r.revenueDisplay,
        r.type,
      ]),
    })
    toast.success('Exported', { description: 'Recent transactions (demo data).' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
            CalCount AI / Revenue
          </div>
          <PageHeading
            title="Overview"
            subtitle="Subscription revenue aligned with RevenueCat-style metrics. Data below is demo-only until you connect the API."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-white/60 px-3 py-2 dark:bg-black/25">
          <span className="text-xs text-[hsl(var(--muted))]">Sandbox data</span>
          <Switch
            checked={sandbox}
            onCheckedChange={(v) => {
              setSandbox(v)
              toast.message(v ? 'Sandbox mode' : 'Production view', {
                description: 'Toggle is local only; wire to RevenueCat sandbox flag.',
              })
            }}
            aria-label="Toggle sandbox data"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {revenueCatOverviewKpis.map((k) => (
          <Card
            key={k.id}
            className="rounded-xl border border-[hsl(var(--border))] bg-white/80 shadow-soft dark:bg-black/30"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[hsl(var(--muted))]">{k.label}</div>
                  <div className="text-2xl font-semibold tracking-tight tabular-nums">
                    {k.valueIsCurrency ? formatCurrency(k.value) : formatNumber(k.value)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[hsl(var(--muted))]">
                    {k.subtitle}
                    <Info className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                  </div>
                </div>
              </div>
              {k.showSparkline && k.sparkline.length > 1 ? (
                <div className="mt-3 flex justify-end border-t border-[hsl(var(--border))]/60 pt-3">
                  <Sparkline points={k.sparkline} color={k.accent} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-white/85 dark:bg-black/35">
        <CardHeader className="border-b border-[hsl(var(--border))] bg-white/50 dark:bg-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] text-[hsl(var(--muted))]">Charts / Revenue</div>
              <CardTitle className="text-base font-semibold">Revenue</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg text-xs" type="button">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-lg text-xs" type="button">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
              <Button size="sm" className="h-8 rounded-lg text-xs" type="button" onClick={exportOverview}>
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Filter', 'Segment', '$ Revenue', 'Daily', 'Last 90 days', 'Compare'].map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-white/70 px-2.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-white dark:bg-black/30 dark:hover:bg-black/45"
              >
                {label}
                <ChevronDown className="h-3.5 w-3.5 text-[hsl(var(--muted))]" />
              </button>
            ))}
            <span className="inline-flex h-8 items-center rounded-lg border border-dashed border-[hsl(var(--border))] px-2.5 text-xs text-[hsl(var(--muted))]">
              Line
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <LineChartCard
            data={revenueCatDailySeries}
            xKey="x"
            yKey="y"
            height={280}
            color="#16a34a"
          />
          <p className="mt-3 text-center text-[11px] text-[hsl(var(--muted))]">
            Demo series — replace with RevenueCat chart payload (daily revenue).
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-[hsl(var(--border))] bg-white/85 dark:bg-black/35">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-[hsl(var(--border))] py-4">
          <CardTitle className="text-sm font-semibold">Recent transactions</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-xs" type="button" onClick={exportTransactions}>
            Export all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[200px]">Customer</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueCatRecentTransactions.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded border border-[hsl(var(--border))] bg-white/80 text-[10px] font-medium dark:bg-black/40"
                          title={r.country}
                        >
                          {r.country}
                        </span>
                        <span className="font-mono text-xs text-[hsl(var(--accent))]">{r.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[hsl(var(--muted))]">{r.store}</TableCell>
                    <TableCell className="text-xs">{r.product}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-[hsl(var(--muted))]">
                      {r.purchasedLabel}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-[hsl(var(--muted))]">
                      {r.expiresLabel}
                    </TableCell>
                    <TableCell className="text-xs font-medium tabular-nums">{r.revenueDisplay}</TableCell>
                    <TableCell>
                      <Badge variant={txnBadgeVariant(r.type)} className="font-mono text-[10px]">
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

      <p className="text-center text-[11px] text-[hsl(var(--muted))]">
        Integration tip: map this UI to{' '}
        <a
          href="https://www.revenuecat.com/docs"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[hsl(var(--accent))] underline-offset-2 hover:underline"
        >
          RevenueCat docs
        </a>{' '}
        (REST &amp; webhooks) for live MRR, revenue, and subscriber events.
      </p>
    </div>
  )
}
