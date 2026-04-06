'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Plus, UserPlus, Wrench, Mail } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import { ticketRows, type TicketRow, type TicketStatus } from '@/data/dummies'

function statusTone(status: TicketStatus) {
  switch (status) {
    case 'Open':
      return 'secondary'
    case 'In Progress':
      return 'warning'
    case 'Closed':
      return 'success'
    default:
      return 'default'
  }
}

export function TicketsPage() {
  const [notifyEmail, setNotifyEmail] = React.useState(true)
  const [rows, setRows] = React.useState<TicketRow[]>(ticketRows)
  const [search, setSearch] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => `${r.id} ${r.user} ${r.issue} ${r.status} ${r.assignedTo}`.toLowerCase().includes(q))
  }, [rows, search])

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<'create' | 'assign' | 'status' | 'describe'>('create')
  const [selected, setSelected] = React.useState<TicketRow | null>(null)

  const [form, setForm] = React.useState({
    issue: '',
    assignedTo: 'Sara',
    status: 'Open' as TicketStatus,
    description: '',
  })

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      // Dummy real-time ticket creation.
      if (Math.random() < 0.35) {
        const nextId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`
        const next: TicketRow = {
          id: nextId,
          user: ['mike@northwind.ai', 'sara@aurora.ai', 'alex@northwind.ai'][Math.floor(Math.random() * 3)],
          issue:
            ['New webhook failure (500)', 'Cannot rotate API key', 'Login rate limit triggered', 'Refund requested'][Math.floor(Math.random() * 4)],
          status: 'Open',
          assignedTo: 'Dev',
          lastUpdatedISO: new Date().toISOString(),
        }
        setRows((prev) => [next, ...prev])
        toast.message('New ticket created', { description: next.id })
      }
    }, 12_000)
    return () => window.clearInterval(interval)
  }, [])

  function openCreate() {
    setDialogMode('create')
    setSelected(null)
    setForm({ issue: '', assignedTo: 'Sara', status: 'Open', description: '' })
    setDialogOpen(true)
  }

  function openAssign(row: TicketRow) {
    setDialogMode('assign')
    setSelected(row)
    setForm((f) => ({ ...f, assignedTo: row.assignedTo }))
    setDialogOpen(true)
  }

  function openStatus(row: TicketRow) {
    setDialogMode('status')
    setSelected(row)
    setForm((f) => ({ ...f, status: row.status }))
    setDialogOpen(true)
  }

  function openDescribe(row: TicketRow) {
    setDialogMode('describe')
    setSelected(row)
    setForm((f) => ({ ...f, description: '' }))
    setDialogOpen(true)
  }

  const paginated = React.useMemo(() => filtered.slice(0, 8), [filtered])

  return (
    <div className="space-y-6">
      <PageHeading
        title="Customer Support"
        subtitle="Ticket workflow with assignments, statuses, and real-time updates."
        right={
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 px-3 py-2">
              <Mail className="h-4 w-4 text-[hsl(var(--muted))]" />
              <span className="text-xs text-[hsl(var(--muted))]">Email</span>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </div>
        }
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">Tickets</CardTitle>
          <div className="text-xs text-[hsl(var(--muted))]">
            Showing latest tickets (dummy data).
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full sm:max-w-[360px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets…"
              aria-label="Search tickets"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-[hsl(var(--muted))]">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.user}</TableCell>
                    <TableCell>{row.issue}</TableCell>
                    <TableCell>
                      <Badge variant={statusTone(row.status) as any}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openAssign(row)}>
                          <UserPlus className="h-4 w-4" />
                          Assign Agent
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openStatus(row)}>
                          <Wrench className="h-4 w-4" />
                          Change Status
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDescribe(row)}>
                          Add Description
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-[hsl(var(--muted))]">
              Showing {paginated.length} of {filtered.length} results.
            </div>
            <div className="text-xs text-[hsl(var(--muted))]">
              Tip: use the search box to filter.
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create'
                ? 'Create Ticket'
                : dialogMode === 'assign'
                  ? 'Assign Agent'
                  : dialogMode === 'status'
                    ? 'Change Status'
                    : 'Add Description'}
            </DialogTitle>
            <DialogDescription>
              {selected ? `${selected.id} • ${selected.user}` : 'Dummy form for UI preview'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-4">
            {dialogMode === 'create' ? (
              <>
                <div className="space-y-2">
                  <div className="text-xs text-[hsl(var(--muted))]">Issue</div>
                  <Input
                    value={form.issue}
                    onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                    placeholder="Describe the issue…"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-[hsl(var(--muted))]">Assign To</div>
                  <Input
                    value={form.assignedTo}
                    onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                    placeholder="Agent name"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-[hsl(var(--muted))]">Status</div>
                  <Input
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as TicketStatus,
                      }))
                    }
                  />
                </div>
              </>
            ) : null}

            {dialogMode === 'assign' ? (
              <div className="space-y-2">
                <div className="text-xs text-[hsl(var(--muted))]">Agent</div>
                <Input
                  value={form.assignedTo}
                  onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                  placeholder="Assigned agent"
                />
              </div>
            ) : null}

            {dialogMode === 'status' ? (
              <div className="space-y-2">
                <div className="text-xs text-[hsl(var(--muted))]">Status</div>
                <Input
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as TicketStatus,
                    }))
                  }
                />
              </div>
            ) : null}

            {dialogMode === 'describe' ? (
              <div className="space-y-2">
                <div className="text-xs text-[hsl(var(--muted))]">Description</div>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Add notes for the ticket…"
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (dialogMode === 'create') {
                  const next: TicketRow = {
                    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
                    user: 'you@tenant.ai',
                    issue: form.issue || 'New ticket',
                    status: form.status,
                    assignedTo: form.assignedTo || 'Sara',
                    lastUpdatedISO: new Date().toISOString(),
                  }
                  setRows((prev) => [next, ...prev])
                  toast.success('Ticket created', { description: next.id })
                } else if (selected) {
                  setRows((prev) =>
                    prev.map((r) => {
                      if (r.id !== selected.id) return r
                      if (dialogMode === 'assign')
                        return { ...r, assignedTo: form.assignedTo, lastUpdatedISO: new Date().toISOString() }
                      if (dialogMode === 'status')
                        return { ...r, status: form.status, lastUpdatedISO: new Date().toISOString() }
                      if (dialogMode === 'describe') {
                        toast.message('Description added', { description: `for ${r.id}` })
                        return { ...r, lastUpdatedISO: new Date().toISOString() }
                      }
                      return r
                    })
                  )
                }
                setDialogOpen(false)
              }}
              type="button"
            >
              {dialogMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

