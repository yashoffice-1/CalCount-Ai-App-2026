'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Slash,
  ExternalLink,
} from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { StatusBadge } from '@/components/common/status-badge'
import { oldApis, newApis, type ApiRow, type ApiStatus } from '@/data/dummies'
import { formatRelativeTime, formatNumber } from '@/lib/format'

function statusTone(status: ApiStatus) {
  switch (status) {
    case 'Healthy':
      return 'success'
    case 'Degraded':
      return 'warning'
    case 'Down':
      return 'danger'
    default:
      return 'info'
  }
}

export function ApiViewPage() {
  const [useNew, setUseNew] = React.useState(true)
  const [selected, setSelected] = React.useState<ApiRow | null>(null)
  const [mode, setMode] = React.useState<'view' | 'edit' | 'disable'>('view')

  const rows = useNew ? newApis : oldApis

  const columns = React.useMemo<DataTableColumn<ApiRow>[]>(
    () => [
      {
        id: 'name',
        header: 'API Name',
        className: 'min-w-[220px]',
        cell: (row) => (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 text-[hsl(var(--muted))]">
              <ExternalLink className="h-4 w-4" />
            </span>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-xs text-[hsl(var(--muted))]">{row.id}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
      },
      {
        id: 'requests',
        header: 'Requests',
        cell: (row) => <span className="font-medium">{formatNumber(row.requests)}</span>,
      },
      {
        id: 'errors',
        header: 'Errors',
        cell: (row) => <span className="text-[hsl(var(--muted))]">{formatNumber(row.errors)}</span>,
      },
      {
        id: 'lastUsed',
        header: 'Last Used',
        cell: (row) => <span className="text-xs text-[hsl(var(--muted))]">{formatRelativeTime(row.lastUsedISO)}</span>,
      },
    ],
    []
  )

  function ApiActions({ row }: { row?: ApiRow }) {
    if (!row) return null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setSelected(row)
              setMode('view')
            }}
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setSelected(row)
              setMode('edit')
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setSelected(row)
              setMode('disable')
            }}
          >
            <Slash className="mr-2 h-4 w-4" /> Disable
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="API View"
        subtitle="Switch between legacy and modern APIs."
        right={
          <div className="flex items-center gap-3">
            <span
              className={`text-xs ${!useNew ? 'font-semibold text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))]'}`}
            >
              Old APIs
            </span>
            <Switch
              checked={useNew}
              onCheckedChange={setUseNew}
              aria-label={useNew ? 'Showing new APIs; switch to old APIs' : 'Showing old APIs; switch to new APIs'}
            />
            <span
              className={`text-xs ${useNew ? 'font-semibold text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))]'}`}
            >
              New APIs
            </span>
          </div>
        }
      />

      <DataTable<ApiRow>
        rows={rows}
        columns={columns}
        searchable
        getSearchText={(r) => `${r.name} ${r.status}`}
        rowActions={<ApiActions />}
        title={useNew ? 'New APIs' : 'Old APIs'}
      />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {mode === 'view'
                    ? 'API Details'
                    : mode === 'edit'
                      ? 'Edit API'
                      : 'Disable API'}
                </DialogTitle>
                <DialogDescription>
                  {selected.name} ({selected.id})
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[hsl(var(--muted))]">Status</span>
                  <Badge variant={statusTone(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[hsl(var(--muted))]">Requests</span>
                  <span className="font-medium">{formatNumber(selected.requests)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[hsl(var(--muted))]">Errors</span>
                  <span className="font-medium">{formatNumber(selected.errors)}</span>
                </div>
                <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                  <div className="text-xs text-[hsl(var(--muted))]">Last used</div>
                  <div className="font-medium mt-1">{formatRelativeTime(selected.lastUsedISO)}</div>
                </div>
              </div>

              <DialogFooter>
                {mode === 'disable' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.success('API disabled', { description: 'Dummy action completed.' })
                      setSelected(null)
                    }}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      toast.success(mode === 'edit' ? 'Changes saved' : 'Viewing details')
                      setSelected(null)
                    }}
                  >
                    {mode === 'edit' ? 'Save changes' : 'Done'}
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

