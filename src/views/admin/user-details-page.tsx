'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { UserRound, Ban } from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usersRows, type UserRow } from '@/data/dummies'

export function UserDetailsPage() {
  const [search, setSearch] = React.useState('')
  const [rows, setRows] = React.useState<UserRow[]>(usersRows)
  const [selected, setSelected] = React.useState<UserRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => `${r.name} ${r.email} ${r.plan} ${r.activity}`.toLowerCase().includes(q))
  }, [rows, search])

  function suspendUser(user: UserRow) {
    setRows((prev) => prev.map((u) => (u.id === user.id ? { ...u, suspended: !u.suspended } : u)))
    toast.success(user.suspended ? 'User unsuspended' : 'User suspended', { description: user.email })
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="User Details"
        subtitle="Inspect users and apply suspension actions."
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">Users</CardTitle>
          <div className="text-xs text-[hsl(var(--muted))]">Dummy data table with search.</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full sm:max-w-[360px]">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="w-[240px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-[hsl(var(--muted))]">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.email}</TableCell>
                    <TableCell>
                      <Badge variant={row.plan === 'Enterprise' ? 'info' : row.plan === 'Pro' ? 'secondary' : 'warning' as any}>
                        {row.plan}
                      </Badge>
                      {row.suspended ? (
                        <div className="mt-2">
                          <Badge variant="danger">Suspended</Badge>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted))]">{row.activity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelected(row)}>
                          <UserRound className="h-4 w-4" />
                          View profile
                        </Button>
                        <Button
                          variant={row.suspended ? 'secondary' : 'destructive'}
                          size="sm"
                          onClick={() => suspendUser(row)}
                        >
                          <Ban className="h-4 w-4" />
                          {row.suspended ? 'Unsuspend' : 'Suspend user'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.name} • ${selected.email}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-xs text-[hsl(var(--muted))]">Plan</div>
                <div className="mt-1 font-medium">{selected.plan}</div>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-3">
                <div className="text-xs text-[hsl(var(--muted))]">Activity</div>
                <div className="mt-1 font-medium">{selected.activity}</div>
              </div>
              {selected.suspended ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                    This user is currently suspended.
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button onClick={() => setSelected(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

