'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { ShieldCheck, UserCog } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { permissions, userRoleMatrix, type AdminSubRole } from '@/data/dummies'

function roleTone(role: AdminSubRole) {
  switch (role) {
    case 'Admin':
      return 'info'
    case 'Support':
      return 'warning'
    case 'Viewer':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function RoleManagementPage() {
  const [rows, setRows] = React.useState(userRoleMatrix.users)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<AdminSubRole>('Viewer')
  const [open, setOpen] = React.useState(false)

  const selectedUser = React.useMemo(
    () => rows.find((u) => u.id === selectedUserId) ?? null,
    [rows, selectedUserId]
  )

  function openAssign(userId: string) {
    const u = rows.find((x) => x.id === userId)
    if (!u) return
    setSelectedUserId(userId)
    setSelectedRole(u.subRole)
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Role Management"
        subtitle="Assign admin/support/viewer roles and review permissions."
        right={
          <div className="hidden sm:flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
            <ShieldCheck className="h-4 w-4" />
            Permissions matrix
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Users & Roles</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              Change role assignments for support and viewer access.
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant={roleTone(row.subRole) as any}>{row.subRole}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openAssign(row.id)}>
                        <UserCog className="h-4 w-4" />
                        Assign roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Permissions Matrix</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">What each role can do.</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-[hsl(var(--muted))] font-medium pb-2">
                      Permission
                    </th>
                    {permissions.columns.map((c) => (
                      <th
                        key={c}
                        className="text-left text-xs text-[hsl(var(--muted))] font-medium pb-2"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.rows.map((r) => (
                    <tr key={r.key} className="border-t border-[hsl(var(--border))]">
                      <td className="py-2 pr-3 text-sm">{r.label}</td>
                      {r.values.map((val, idx) => (
                        <td key={`${r.key}_${idx}`} className="py-2">
                          {val ? (
                            <Badge variant="success">Allowed</Badge>
                          ) : (
                            <Badge variant="secondary">—</Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
              <div className="text-xs text-[hsl(var(--muted))]">
                UX note
              </div>
              <div className="mt-1 text-sm">
                Update role assignments to immediately reflect feature availability in this UI.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign role</DialogTitle>
            <DialogDescription>
              {selectedUser ? `${selectedUser.name} (${selectedUser.id})` : 'Select a user.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <div className="text-xs text-[hsl(var(--muted))]">Role</div>
              <Input
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminSubRole)}
                placeholder="Admin | Support | Viewer"
              />
            </div>
            <div className="text-xs text-[hsl(var(--muted))]">
              Dummy UI: saves to in-memory state.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedUserId) return
                setRows((prev) =>
                  prev.map((u) => (u.id === selectedUserId ? { ...u, subRole: selectedRole } : u))
                )
                toast.success('Role updated', {
                  description: `${selectedUserId} -> ${selectedRole}`,
                })
                setOpen(false)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

