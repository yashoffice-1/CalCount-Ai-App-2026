'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth, type AdminSubRole, type AuthUser } from '@/state/auth'

const roles: AdminSubRole[] = ['Admin', 'Support', 'Viewer']

function approvalTone(status: AuthUser['approvalStatus']) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

export function AdminManagementPage() {
  const { pendingAdmins, approvedAdmins, rejectedAdmins, approvePendingAdmin, rejectPendingAdmin } = useAuth()
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [selectedAction, setSelectedAction] = React.useState<'approve' | 'reject'>('approve')
  const [roleOverrideById, setRoleOverrideById] = React.useState<Record<string, AdminSubRole>>({})

  const confirmUser = React.useMemo(() => pendingAdmins.find((u) => u.id === selectedId) ?? null, [pendingAdmins, selectedId])

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-gray-500 text-sm">Loading admin data...</div>
      </div>
    )
  }

  const pending = pendingAdmins
  return (
    <div className="space-y-6" suppressHydrationWarning>
      <PageHeading
        title="Admin Management"
        subtitle="Approve or reject new admin requests."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Pending approvals</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Set role & approve access.</div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.length === 0 ? (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-4 text-xs text-[hsl(var(--muted))]">
                No pending admin requests.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead className="w-[260px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((row) => {
                    const override = roleOverrideById[row.id] ?? row.subRole ?? 'Viewer'
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-[hsl(var(--muted))]">{row.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge variant="secondary">{row.subRole ?? 'Viewer'}</Badge>
                            <select
                              value={override}
                              onChange={(e) =>
                                setRoleOverrideById((p) => ({ ...p, [row.id]: e.target.value as AdminSubRole }))
                              }
                              className="h-9 rounded-lg border border-[hsl(var(--border))] bg-white/60 dark:bg-black/20 px-3 text-sm"
                            >
                              {roles.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => {
                                setSelectedId(row.id)
                                setSelectedAction('approve')
                                setOpenConfirm(true)
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setSelectedId(row.id)
                                setSelectedAction('reject')
                                setOpenConfirm(true)
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Summary</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">System-wide admin status.</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
              <div className="text-xs text-[hsl(var(--muted))]">Approved</div>
              <div className="mt-1 text-lg font-semibold">{approvedAdmins.length}</div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
              <div className="text-xs text-[hsl(var(--muted))]">Rejected</div>
              <div className="mt-1 text-lg font-semibold">{rejectedAdmins.length}</div>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <div className="text-xs text-[hsl(var(--muted))]">Security note</div>
              <div className="mt-1 text-sm">
                Super Admin approvals are required before any admin can access the console.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approve' ? 'Approve admin' : 'Reject admin'}
            </DialogTitle>
            <DialogDescription>
              {confirmUser ? `${confirmUser.name} • ${confirmUser.email}` : ''}
            </DialogDescription>
          </DialogHeader>

          {confirmUser ? (
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-xs text-[hsl(var(--muted))]">Requested</div>
                <div className="mt-1">
                  <Badge variant={approvalTone(confirmUser.approvalStatus) as any}>
                    {confirmUser.subRole ?? 'Viewer'}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-xs text-[hsl(var(--muted))]">Role override</div>
                <div className="mt-1">
                  <Badge variant="success">{roleOverrideById[confirmUser.id] ?? confirmUser.subRole ?? 'Viewer'}</Badge>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!confirmUser) return
                if (selectedAction === 'approve') {
                  const override = roleOverrideById[confirmUser.id]
                  approvePendingAdmin(confirmUser.id, override)
                  toast.success('Admin approved', { description: confirmUser.email })
                } else {
                  rejectPendingAdmin(confirmUser.id)
                  toast.error('Admin rejected', { description: confirmUser.email })
                }
                setOpenConfirm(false)
              }}
            >
              {selectedAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

