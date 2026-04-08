'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { auditLogs, type AuditAction, type AuditRow } from '@/data/dummies'
import { formatRelativeTime } from '@/lib/format'
import { downloadCsv } from '@/lib/csv'

function actionTone(action: AuditAction) {
  switch (action) {
    case 'APPROVE':
      return 'success'
    case 'REJECT':
      return 'danger'
    case 'DELETE':
      return 'danger'
    case 'UPDATE':
      return 'warning'
    case 'CREATE':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function AuditLogsPage() {
  const [search, setSearch] = React.useState('')
  const [rows] = React.useState<AuditRow[]>(auditLogs)

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => `${r.actor} ${r.action} ${r.resource} ${r.detail}`.toLowerCase().includes(q))
  }, [rows, search])

  function exportAudit() {
    downloadCsv({
      filename: 'audit-logs.csv',
      headers: ['Time', 'Actor', 'Action', 'Resource', 'Detail'],
      rows: filtered.map((r) => [r.timestampISO, r.actor, r.action, r.resource, r.detail]),
    })
    toast.success('Exported audit logs', { description: `${filtered.length} rows` })
  }
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-gray-500 text-sm">Loading audit logs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <PageHeading
        title="Audit Logs"
        subtitle="Track admin actions, role changes, API changes, and system updates."
        right={
          <Button variant="outline" onClick={exportAudit}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">Admin activity</CardTitle>
          <div className="text-xs text-[hsl(var(--muted))]">Search everything.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full sm:max-w-[360px]">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs…" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-[hsl(var(--muted))]">
                    No matching audit events.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.slice(0, 14).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-[hsl(var(--muted))]">{formatRelativeTime(row.timestampISO)}</TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.actor}</TableCell>
                    <TableCell>
                      <Badge variant={actionTone(row.action) as any}>{row.action}</Badge>
                    </TableCell>
                    <TableCell>{row.resource}</TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.detail}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="text-xs text-[hsl(var(--muted))]">
            Showing latest {Math.min(14, filtered.length)} events (dummy UI).
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

