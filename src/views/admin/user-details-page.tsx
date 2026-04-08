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
import { usersRows, type UserRow } from '@/data/dummies'

export function UserDetailsPage() {
  const [search, setSearch] = React.useState('')
  const [rows, setRows] = React.useState<UserRow[]>(usersRows)
  const [planFilter, setPlanFilter] = React.useState('All')
  const [ticketFilter, setTicketFilter] = React.useState('All')
  const [statusFilter, setStatusFilter] = React.useState('All')

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      // 1. Search Query
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || `${r.name} ${r.email} ${r.plan} ${r.ticket}`.toLowerCase().includes(q)
      
      // 2. Plan Filter
      const matchesPlan = planFilter === 'All' || r.plan === planFilter

      // 3. Ticket Filter
      let matchesTicket = true
      if (ticketFilter === 'Active') matchesTicket = r.ticket.includes('Active') || r.ticket.includes('Open')
      if (ticketFilter === 'Closed') matchesTicket = r.ticket.includes('Closed')
      if (ticketFilter === 'None') matchesTicket = r.ticket === 'None'

      // 4. Status Filter
      let matchesStatus = true
      if (statusFilter === 'Active') matchesStatus = !r.suspended
      if (statusFilter === 'Disabled') matchesStatus = !!r.suspended
      
      return matchesSearch && matchesPlan && matchesTicket && matchesStatus
    })
  }, [rows, search, planFilter, ticketFilter, statusFilter])



  function suspendUser(userId: string) {
    setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u)))
  }

  function assignRole(userId: string, newRoleId: string) {
    setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u)))
    toast.success('Role updated successfully', { description: `User role changed to ${newRoleId}` })
  }

  if (!mounted) return <div className="min-h-screen" suppressHydrationWarning />

  return (
    <div className="space-y-6" suppressHydrationWarning>
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
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search users…" 
              className="w-full sm:max-w-[300px]" 
            />
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="flex h-10 w-full sm:w-auto items-center justify-between rounded-md border border-[hsl(var(--border))] bg-white/50 px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                <option value="All">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full sm:w-auto items-center justify-between rounded-md border border-[hsl(var(--border))] bg-white/50 px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Disabled">Disabled Only</option>
              </select>

              <select 
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
                className="flex h-10 w-full sm:w-auto items-center justify-between rounded-md border border-[hsl(var(--border))] bg-white/50 px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                <option value="All">All Tickets</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-[hsl(var(--muted))]">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-[hsl(var(--foreground))]">{row.name}</TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">{row.email}</TableCell>
                    <TableCell>
                      <Badge variant={row.ticket === 'None' ? 'secondary' : row.ticket.includes('Active') ? 'warning' : 'outline' as any}>
                        {row.ticket}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.plan === 'Enterprise' ? 'info' : row.plan === 'Pro' ? 'secondary' : 'default'} className={row.plan === 'Free' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 shadow-none' : 'shadow-sm'}>
                        {row.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!row.suspended ? (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                      ) : (
                        <Badge variant="danger" className="bg-red-50 text-red-700 border-red-200">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-gray-500">
                      {row.joinedAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


    </div>
  )
}

