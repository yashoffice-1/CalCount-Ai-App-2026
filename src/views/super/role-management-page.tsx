'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { 
  ShieldCheck, 
  UserCog, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react'

import { PageHeading } from '@/components/common/page-heading'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type RoleModule = 'Users' | 'Tickets' | 'API' | 'Revenue'
type RoleAction = 'view' | 'create' | 'edit' | 'delete'

export type RolePermissions = Record<RoleModule, Record<RoleAction, boolean>>

export type RoleData = {
  id: string
  name: string
  description: string
  permissions: RolePermissions
  usersAssigned: number
  isSystem?: boolean // system roles can't be deleted
}

// Initial default RBAC Roles
const defaultRoles: RoleData[] = [
  {
    id: 'role_super',
    name: 'Super Admin',
    description: 'Full access to all system-level resources.',
    isSystem: true,
    usersAssigned: 2,
    permissions: {
      Users: { view: true, create: true, edit: true, delete: true },
      Tickets: { view: true, create: true, edit: true, delete: true },
      API: { view: true, create: true, edit: true, delete: true },
      Revenue: { view: true, create: true, edit: true, delete: true },
    }
  },
  {
    id: 'role_admin',
    name: 'Admin',
    description: 'Manage users, tickets, and analytics.',
    isSystem: true,
    usersAssigned: 5,
    permissions: {
      Users: { view: true, create: true, edit: true, delete: false },
      Tickets: { view: true, create: true, edit: true, delete: true },
      API: { view: true, create: false, edit: false, delete: false },
      Revenue: { view: true, create: false, edit: true, delete: false },
    }
  },
  {
    id: 'role_support',
    name: 'Support Agent',
    description: 'Handles tickets only.',
    isSystem: true,
    usersAssigned: 12,
    permissions: {
      Users: { view: true, create: false, edit: false, delete: false },
      Tickets: { view: true, create: true, edit: true, delete: false },
      API: { view: false, create: false, edit: false, delete: false },
      Revenue: { view: false, create: false, edit: false, delete: false },
    }
  },
  {
    id: 'role_viewer',
    name: 'Viewer',
    description: 'Read-only access across the board.',
    isSystem: true,
    usersAssigned: 28,
    permissions: {
      Users: { view: true, create: false, edit: false, delete: false },
      Tickets: { view: true, create: false, edit: false, delete: false },
      API: { view: true, create: false, edit: false, delete: false },
      Revenue: { view: true, create: false, edit: false, delete: false },
    }
  }
]

const ALL_MODULES: RoleModule[] = ['Users', 'Tickets', 'API', 'Revenue']
const ALL_ACTIONS: RoleAction[] = ['view', 'create', 'edit', 'delete']

const emptyPermissions = (): RolePermissions => ({
  Users: { view: false, create: false, edit: false, delete: false },
  Tickets: { view: false, create: false, edit: false, delete: false },
  API: { view: false, create: false, edit: false, delete: false },
  Revenue: { view: false, create: false, edit: false, delete: false },
})

export function RoleManagementPage() {
  const [roles, setRoles] = React.useState<RoleData[]>(defaultRoles)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<RoleData | null>(null)
  
  // Pending Admin Approvals (Super Admin Flow)
  const [pendingAdmins, setPendingAdmins] = React.useState([
    { id: 'usr_p1', name: 'James Doe', email: 'james@startup.io', status: 'Pending' }
  ])

  const [formName, setFormName] = React.useState('')
  const [formDesc, setFormDesc] = React.useState('')
  const [formPerms, setFormPerms] = React.useState<RolePermissions>(emptyPermissions())

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen p-6" suppressHydrationWarning />
  }

  function openCreateModal() {
    setEditingRole(null)
    setFormName('')
    setFormDesc('')
    setFormPerms(emptyPermissions())
    setIsModalOpen(true)
  }

  function openEditModal(role: RoleData) {
    if (role.isSystem) {
      toast.error('System roles cannot be edited.')
      return
    }
    setEditingRole(role)
    setFormName(role.name)
    setFormDesc(role.description)
    setFormPerms(JSON.parse(JSON.stringify(role.permissions)))
    setIsModalOpen(true)
  }

  function handleDeleteRole(role: RoleData) {
    if (role.isSystem) {
      toast.error('System roles cannot be deleted.')
      return
    }
    if (role.usersAssigned > 0) {
      toast.error('Cannot delete role. Reassign users first.')
      return
    }
    setRoles(prev => prev.filter(r => r.id !== role.id))
    toast.success(`Role ${role.name} deleted successfully, audit log stored.`)
  }

  function handleSaveRole() {
    if (!formName.trim() || !formDesc.trim()) {
      toast.error('Name and Description are required.')
      return
    }

    if (editingRole) {
      // Update
      setRoles(prev => prev.map(r => r.id === editingRole.id ? {
        ...r,
        name: formName,
        description: formDesc,
        permissions: formPerms
      } : r))
      toast.success(`Role ${formName} updated.`)
    } else {
      // Create
      const newRole: RoleData = {
        id: `role_${Date.now()}`,
        name: formName,
        description: formDesc,
        permissions: formPerms,
        usersAssigned: 0,
      }
      setRoles(prev => [...prev, newRole])
      toast.success(`Role ${formName} created successfully.`)
    }
    setIsModalOpen(false)
  }

  function handleApprovePending(userId: string) {
    setPendingAdmins(prev => prev.filter(u => u.id !== userId))
    toast.success('Admin request approved. Assigning Viewer role default.')
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300" suppressHydrationWarning>
      <PageHeading
        title="Role Management (RBAC)"
        subtitle="Configure role-based access control policies, permissions, and approve new administrators."
        right={
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Role List */}
        <Card className="rounded-2xl lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4 rounded-t-2xl">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> System Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-600">Role Name</TableHead>
                  <TableHead className="font-semibold text-gray-600 w-[40%]">Description</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Perms Count</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Users</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  let permsCount = 0
                  ALL_MODULES.forEach(m => {
                    ALL_ACTIONS.forEach(a => {
                      if (role.permissions[m][a]) permsCount++
                    })
                  })

                  return (
                    <TableRow key={role.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-bold text-gray-900">
                        {role.name}
                        {role.isSystem && <Badge variant="secondary" className="ml-2 text-[10px] uppercase shadow-sm">System</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{role.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 font-bold">{permsCount} / 16</Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-gray-700">
                        <div className="flex items-center justify-center gap-1.5"><Users className="h-4 w-4 text-gray-400" /> {role.usersAssigned}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(role)} disabled={role.isSystem}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDeleteRole(role)} disabled={role.isSystem}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column: Super Admin Approvals & Audit log */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-3 border-b border-orange-100">
              <CardTitle className="text-sm font-bold text-orange-900 flex items-center gap-2">
                <UserCog className="h-4 w-4 text-orange-600" /> Pending Admin Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {pendingAdmins.length === 0 ? (
                <div className="text-sm text-orange-600/70 text-center py-4">No pending requests.</div>
              ) : (
                pendingAdmins.map(pa => (
                  <div key={pa.id} className="flex flex-col gap-3 bg-white p-3 rounded-xl border border-orange-200 shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{pa.name}</p>
                      <p className="text-xs text-gray-500">{pa.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => handleApprovePending(pa.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="w-full text-gray-600" onClick={() => setPendingAdmins(prev => prev.filter(u => u.id !== pa.id))}>Reject</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-sm font-bold text-gray-700">Audit Logs</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <p className="text-gray-600"><span className="font-semibold text-gray-900">System Bot</span> auto-assigned role <b>Viewer</b> to <b>alex@northwind.ai</b> (2m ago)</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-gray-600"><span className="font-semibold text-gray-900">Super Admin</span> modified permissions for role <b>Support Agent</b> (1h ago)</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <p className="text-gray-600"><span className="font-semibold text-gray-900">System Bot</span> created systemic blueprint for <b>RBAC V2</b> (1d ago)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Creation/Editing Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-xl">{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>
              Define the role identity and assign explicit module-level permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Role Name</label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="E.g. Financial Analyst" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <Input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Brief definition of responsibilities..." />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Permission Matrix</label>
                <span className="text-xs text-gray-500"><AlertCircle className="h-3.5 w-3.5 inline mr-1" /> Checked indicates granted</span>
              </div>
              
              <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold text-gray-900 w-[160px]">Module</TableHead>
                      <TableHead className="text-center font-semibold text-gray-600"><Badge variant="outline" className="bg-white">View</Badge></TableHead>
                      <TableHead className="text-center font-semibold text-gray-600"><Badge variant="outline" className="bg-white">Create</Badge></TableHead>
                      <TableHead className="text-center font-semibold text-gray-600"><Badge variant="outline" className="bg-white">Edit</Badge></TableHead>
                      <TableHead className="text-center font-semibold text-gray-600"><Badge variant="outline" className="bg-white">Delete</Badge></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ALL_MODULES.map(module => (
                      <TableRow key={module} className="hover:bg-white border-b border-gray-50 last:border-0">
                        <TableCell className="font-bold text-gray-700 bg-gray-50/50 border-r border-gray-100">{module}</TableCell>
                        {ALL_ACTIONS.map(action => (
                          <TableCell key={action} className="text-center py-3">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                              checked={formPerms[module][action]}
                              onChange={(e) => {
                                const checked = e.target.checked
                                setFormPerms(prev => ({
                                  ...prev,
                                  [module]: {
                                    ...prev[module],
                                    [action]: checked
                                  }
                                }))
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
          </div>
          <DialogFooter className="border-t border-gray-100 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              {editingRole ? 'Save Role Changes' : 'Create Custom Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
