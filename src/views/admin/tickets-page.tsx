'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  Send, 
  Paperclip,
  CheckCircle2,
  AlertOctagon,
  Bot,
  User,
  ShieldAlert,
  Calendar,
  Tag,
  Mail,
  History,
  Plus,
  ShieldCheck,
  RotateCcw,
  Trash2,
  FileDown,
  StickyNote,
  CornerUpLeft,
  ChevronDown,
  Copy
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'

import { 
  ticketRows, 
  ticketComments,
  type TicketRow, 
  type TicketStatus,
  type TicketComment,
  type TicketPriority
} from '@/data/dummies'

function statusPattern(status: TicketStatus) {
  switch (status) {
    case 'Open': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'Escalated': return 'bg-red-100 text-red-700 border-red-200'
    case 'Resolved': return 'bg-green-100 text-green-700 border-green-200'
    case 'Closed': return 'bg-slate-800 text-slate-100 border-slate-700'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function priorityColor(priority: TicketPriority) {
  switch (priority) {
    case 'Low': return 'text-slate-500'
    case 'Medium': return 'text-blue-500'
    case 'High': return 'text-orange-500 font-medium'
    default: return 'text-red-600 font-bold'
  }
}

export function TicketsPage() {
  const [tickets, setTickets] = React.useState<TicketRow[]>(ticketRows)
  const [comments, setComments] = React.useState<TicketComment[]>(ticketComments)
  
  const [view, setView] = React.useState<'table' | 'detail'>('table')
  const [activeTicket, setActiveTicket] = React.useState<TicketRow | null>(null)
  
  const [search, setSearch] = React.useState('')
  const [replyText, setReplyText] = React.useState('')
  const [isReplyOpen, setIsReplyOpen] = React.useState(false)
  const [isNoteOpen, setIsNoteOpen] = React.useState(false)
  const [noteText, setNoteText] = React.useState('')

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  // Create Ticket State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [createForm, setCreateForm] = React.useState({
    title: '',
    description: '',
    category: 'API' as TicketRow['category'],
    priority: 'Medium' as TicketRow['priority'],
  })

  // Derived state for the table
  const filteredTickets = React.useMemo(() => {
    if (!search) return tickets
    const q = search.toLowerCase()
    return tickets.filter(t => 
      t.id.toLowerCase().includes(q) || 
      t.title.toLowerCase().includes(q) || 
      t.user.toLowerCase().includes(q)
    )
  }, [tickets, search])

  // Handlers for Detail View
  function openTicket(t: TicketRow) {
    setActiveTicket(t)
    setView('detail')
  }

  function handleStatusChange(newStatus: TicketStatus) {
    if (!activeTicket) return
    const updated = { ...activeTicket, status: newStatus }
    setActiveTicket(updated)
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
    toast.success(`Ticket status: ${newStatus}`)
    
    // Auto-create a system comment (Audit Log entry)
    setComments(prev => [...prev, {
      id: `c_${Date.now()}`,
      ticketId: activeTicket.id,
      sender: 'agent',
      message: `Status transitioned to ${newStatus}`,
      createdAtISO: new Date().toISOString()
    }])
  }

  function handleAssign(agent: string | null) {
    if (!activeTicket) return
    const updated = { ...activeTicket, assignedTo: agent, status: agent ? 'Assigned' : 'Open' as TicketStatus }
    setActiveTicket(updated)
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
    toast.success(agent ? `Assigned to ${agent}` : 'Ticket unassigned')
    
    setComments(prev => [...prev, {
      id: `c_${Date.now()}`,
      ticketId: activeTicket.id,
      sender: 'agent',
      message: agent ? `Assigned to ${agent}` : 'Agent removed from ticket',
      createdAtISO: new Date().toISOString()
    }])
  }

  function handleSendReply() {
    if (!activeTicket || !replyText.trim()) return
    const newComment: TicketComment = {
      id: `c_${Date.now()}`,
      ticketId: activeTicket.id,
      sender: 'agent',
      message: replyText,
      createdAtISO: new Date().toISOString()
    }
    setComments(prev => [...prev, newComment])
    setReplyText('')
    
    if (activeTicket.status === 'Open') {
      handleStatusChange('In Progress')
    }
  }

  function handleCreateSubmit() {
    // Basic validation
    if (!createForm.title.trim() || !createForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    // Auto-assignment Logic
    let assignedTo: string | null = null
    let autoStatus: TicketStatus = 'Open'

    if (createForm.category === 'API' || createForm.category === 'Server') {
      assignedTo = 'Dev Chen'
      autoStatus = 'Assigned'
    } else if (createForm.category === 'Billing') {
      assignedTo = 'Priya Shah'
      autoStatus = 'Assigned'
    }

    const newTicket: TicketRow = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: createForm.title,
      description: createForm.description,
      category: createForm.category,
      priority: createForm.priority,
      status: autoStatus,
      user: 'guest_user@domain.com', // Demo user
      assignedTo,
      attachments: [],
      createdAtISO: new Date().toISOString(),
      updatedAtISO: new Date().toISOString(),
      slaHours: createForm.priority === 'High' ? 12 : createForm.priority === 'Medium' ? 24 : 48
    }

    setTickets(prev => [newTicket, ...prev])
    setIsCreateOpen(false)
    
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      category: 'API',
      priority: 'Medium',
    })

    toast.success(`Ticket ${newTicket.id} Created!`, {
      description: assignedTo ? `Auto-assigned to ${assignedTo}` : 'Ticket is currently Open.'
    })
  }

  if (!mounted) return <div className="min-h-screen p-6" suppressHydrationWarning />

  // --- Admin Panel Table View ---
  if (view === 'table') {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300 relative" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage customer issues, escalations, and SLA timers.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 rounded-xl border border-border bg-white/50 dark:bg-black/20 px-3 py-2 shadow-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Auto-Notify</span>
                <Switch defaultChecked />
              </div>
            <Button onClick={() => setIsCreateOpen(true)}>Create Ticket</Button>
          </div>
        </div>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search tickets..." 
                  className="pl-8 bg-white border-gray-200 shadow-sm transition-all focus:ring-2 focus:ring-blue-100" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-9 gap-2 shadow-sm border-gray-200">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 shadow-sm border-gray-200 text-xs font-semibold">Bulk Assign</Button>
              <Button variant="outline" className="h-9 shadow-sm border-gray-200 text-xs font-semibold hover:bg-green-50 hover:text-green-700 hover:border-green-200">Resolve</Button>
              <Button variant="outline" className="h-9 shadow-sm border-gray-200 text-xs font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-200">Escalate</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[40px] pl-4"><input type="checkbox" className="rounded border-gray-300" /></TableHead>
                  <TableHead className="font-semibold text-gray-600">Ticket ID</TableHead>
                  <TableHead className="font-semibold text-gray-600">User</TableHead>
                  <TableHead className="font-semibold text-gray-600">Category</TableHead>
                  <TableHead className="font-semibold text-gray-600">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600">Assigned To</TableHead>
                  <TableHead className="font-semibold text-gray-600">SLA Timer</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map(t => {
                  const isOverdue = t.slaHours < 12 && t.status !== 'Resolved' && t.status !== 'Closed'
                  return (
                    <TableRow key={t.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openTicket(t)}>
                      <TableCell className="pl-4" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                      <TableCell className="font-medium text-gray-900">{t.id}</TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[150px]">{t.user}</span>
                          <span className="text-[10px] text-gray-400">{new Date(t.createdAtISO).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="shadow-sm font-medium">{t.category}</Badge></TableCell>
                      <TableCell className={`text-sm ${priorityColor(t.priority)}`}>{t.priority}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border shadow-sm font-semibold ${statusPattern(t.status)}`}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-700">
                        {t.assignedTo ? (
                          <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">{t.assignedTo.charAt(0)}</div> {t.assignedTo}</div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {['Resolved', 'Closed'].includes(t.status) ? (
                          <span className="text-gray-400 text-xs">Stopped</span>
                        ) : (
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {t.slaHours}h remaining
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredTickets.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={9} className="py-8 text-center text-gray-500">No tickets found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Ticket Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Ticket</DialogTitle>
              <DialogDescription>
                Fill out the details. Auto-assignment runs instantly upon creation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject / Title</label>
                <Input 
                  placeholder="E.g. API limit reached unexpectedly" 
                  value={createForm.title}
                  onChange={e => setCreateForm({...createForm, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  placeholder="Provide steps to reproduce, IDs, or relevant logs..."
                  rows={4}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={createForm.description}
                  onChange={e => setCreateForm({...createForm, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select 
                    value={createForm.category} 
                    onChange={e => setCreateForm({...createForm, category: e.target.value as TicketRow['category']})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="API">API</option>
                    <option value="Billing">Billing</option>
                    <option value="Server">Server</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select 
                    value={createForm.priority} 
                    onChange={e => setCreateForm({...createForm, priority: e.target.value as TicketRow['priority']})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Attachments (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-medium hover:border-gray-400">
                  <Paperclip className="h-4 w-4 mr-2" /> Click to attach files
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // --- Detail View ---
  if (!activeTicket) return null

  const activeComments = comments.filter(c => c.ticketId === activeTicket.id).sort((a,b) => new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime())
  
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto animate-in slide-in-from-right-8 duration-300 relative h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-2 px-3 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={() => setView('table')}>
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{activeTicket.id}</span>
            <Badge variant="outline" className={`shadow-sm font-semibold text-[10px] uppercase h-5 px-1.5 ${statusPattern(activeTicket.status)}`}>
              {activeTicket.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 1. Assign Dropdown */}
          <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-gray-200">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  {activeTicket.assignedTo || 'Assign'}
                  <ChevronDown className="h-3 w-3 opacity-50" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Change Agent</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAssign('Dev Chen')}>Assign to Dev Chen</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAssign('Priya Shah')}>Assign to Priya Shah</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAssign('Sara Kim')}>Assign to Sara Kim</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAssign(null)} className="text-red-600">Unassign</DropdownMenuItem>
             </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-gray-200">
                  Status: {activeTicket.status}
                  <ChevronDown className="h-3 w-3 opacity-50" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
               <DropdownMenuItem onClick={() => handleStatusChange('Open')}>Open</DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStatusChange('In Progress')}>In Progress</DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStatusChange('On Hold' as any)}>On Hold</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* 3. Main Actions */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setIsReplyOpen(true)}
          >
             <MessageSquare className="h-3.5 w-3.5" /> Reply
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-gray-200 text-gray-600"
            onClick={() => setIsNoteOpen(true)}
          >
             <StickyNote className="h-3.5 w-3.5" /> Add Note
          </Button>

          {(activeTicket.status !== 'Resolved' && activeTicket.status !== 'Closed') ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => handleStatusChange('Escalated')}
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Escalate
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                className="h-8 text-xs font-semibold gap-1.5 shadow-sm bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleStatusChange('Resolved')}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs font-semibold gap-1.5 shadow-sm border-gray-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => handleStatusChange('In Progress')}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reopen Ticket
            </Button>
          )}

          {/* 4. More Options (...) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" /> Copy Ticket ID
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <FileDown className="h-4 w-4 mr-2" /> Download Ticket (PDF)
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <History className="h-4 w-4 mr-2" /> View Full Audit Logs
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               {activeTicket.status !== 'Closed' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('Closed')}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Close Ticket (Final)
                  </DropdownMenuItem>
               )}
               <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Ticket
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Ticket Info */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-1">
          
          <Card className="shadow-sm border-gray-200 flex-shrink-0">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{activeTicket.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="font-semibold text-xs text-gray-600 shadow-sm"><Tag className="h-3 w-3 mr-1" />{activeTicket.category}</Badge>
                <div className={`text-xs font-bold ${priorityColor(activeTicket.priority)} flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm`}>
                  Priority: {activeTicket.priority}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {activeTicket.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                 <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">User</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-gray-400" /> {activeTicket.user}</p>
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Assigned Agent</p>
                    {activeTicket.assignedTo ? (
                      <p className="font-medium text-indigo-600 hover:underline cursor-pointer">{activeTicket.assignedTo}</p>
                    ) : (
                      <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => handleStatusChange('Assigned')}>Assign to me</Button>
                    )}
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Created At</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {new Date(activeTicket.createdAtISO).toLocaleDateString()}</p>
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">SLA Timer</p>
                    <div className={`font-semibold p-1.5 rounded inline-flex items-center gap-1.5 ${activeTicket.slaHours < 12 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                      <Clock className="h-3.5 w-3.5" /> {activeTicket.slaHours} Hours Left
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="shadow-sm border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white flex-shrink-0">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-500" /> AI Insights
                </CardTitle>
             </CardHeader>
             <CardContent className="text-sm space-y-3">
               <div>
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Sentiment</p>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none rounded">Frustrated (High Risk)</Badge>
               </div>
               <div>
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1.5">Suggested Replies</p>
                  <div className="flex flex-col gap-1.5">
                    <button className="text-left text-[13px] bg-white border border-indigo-100 p-2 rounded-lg shadow-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors" onClick={() => setReplyText("I understand this is frustrating. I'm investigating the webhook error right now.")}>
                      "I understand this is frustrating. I'm investigating..."
                    </button>
                     <button className="text-left text-[13px] bg-white border border-indigo-100 p-2 rounded-lg shadow-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors" onClick={() => setReplyText("Could you provide the exact timestamp of the failed request? That would help us trace it.")}>
                      "Could you provide the exact timestamp..."
                    </button>
                  </div>
               </div>
             </CardContent>
          </Card>

        </div>

        {/* Right Column: Chat/Conversation */}
        {/* Right Column: Ticket History & Details */}
        <Card className="flex-1 shrink-0 flex flex-col shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2"><History className="h-4 w-4 text-indigo-500" /> Ticket Life-cycle & History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-100 before:via-gray-200 before:to-transparent">
              
              {/* Timeline Item: Created */}
              <div className="relative flex items-center gap-6 group">
                <div className="absolute left-0 w-10 flex justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform">
                    <Plus className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-14 flex-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-gray-900">Ticket Initialized</p>
                    <time className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">{new Date(activeTicket.createdAtISO).toLocaleString()}</time>
                  </div>
                  <p className="text-sm text-gray-600">Ticket record created in system via Dashboard. Status set to <Badge variant="secondary" className="scale-75 origin-left">OPEN</Badge></p>
                </div>
              </div>

              {/* Timeline Item: Auto-Assignment */}
              <div className="relative flex items-center gap-6 group">
                 <div className="absolute left-0 w-10 flex justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-14 flex-1 bg-blue-50/20 p-4 rounded-xl border border-blue-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-blue-900">AI Assignment Engine</p>
                    <time className="text-[10px] uppercase font-bold text-blue-300 tracking-wider font-mono">1m since creation</time>
                  </div>
                  <p className="text-sm text-blue-700">Auto-routed to queue. Primary agent set to <span className="font-semibold text-indigo-600 uppercase text-xs">{activeTicket.assignedTo || 'Unassigned'}</span> based on category: {activeTicket.category}.</p>
                </div>
              </div>

              {/* Status Update Item */}
              {activeTicket.status !== 'Open' && (
                <div className="relative flex items-center gap-6 group">
                  <div className="absolute left-0 w-10 flex justify-center">
                    <div className="h-10 w-10 rounded-full border-4 border-white bg-green-50 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-14 flex-1 bg-green-50/20 p-4 rounded-xl border border-green-50 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-green-900">Status Change Verified</p>
                      <time className="text-[10px] uppercase font-bold text-green-300 tracking-wider font-mono">Current</time>
                    </div>
                    <p className="text-sm text-green-700">Audit trail confirms status transition to: <Badge variant="outline" className={`scale-75 origin-left ${statusPattern(activeTicket.status)}`}>{activeTicket.status}</Badge></p>
                  </div>
                </div>
              )}

              {/* Activity Log Placeholder */}
              <div className="relative flex items-center gap-6 group opacity-50 grayscale">
                 <div className="absolute left-0 w-10 flex justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center shadow-sm z-10">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="ml-14 flex-1 border border-dashed border-gray-200 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 italic">No further internal updates or technical logs available for this period.</p>
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
             <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <div className="flex flex-col">
                   <span className="uppercase text-[10px] text-gray-400">Total Updates</span>
                   <span className="text-gray-900">3 Verified Events</span>
                </div>
             </div>
             <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200 shadow-sm">
                View Raw Technical Logs
             </Button>
          </CardFooter>
        </Card>

      </div>
      {/* Reply Modal */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Customer</DialogTitle>
            <DialogDescription>This message will be visible to the user.</DialogDescription>
          </DialogHeader>
          <textarea 
            className="w-full h-32 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none text-sm"
            placeholder="Type your response..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsReplyOpen(false)}>Cancel</Button>
             <Button 
               onClick={() => {
                 handleSendReply()
                 setIsReplyOpen(false)
               }}
               className="bg-blue-600 hover:bg-blue-700"
             >
               Send Reply
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Internal Note Modal */}
      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-700"><StickyNote className="h-4 w-4" /> Add Internal Note</DialogTitle>
            <DialogDescription>Internal notes are only visible to other agents.</DialogDescription>
          </DialogHeader>
          <textarea 
            className="w-full h-32 p-3 rounded-md bg-yellow-50/30 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-100 resize-none text-sm"
            placeholder="Technical details, pending ops, etc..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsNoteOpen(false)}>Cancel</Button>
             <Button 
               onClick={() => {
                 setComments(prev => [...prev, {
                   id: `note_${Date.now()}`,
                   ticketId: activeTicket.id,
                   sender: 'agent',
                   message: `Internal Note: ${noteText}`,
                   createdAtISO: new Date().toISOString()
                 }])
                 setNoteText('')
                 setIsNoteOpen(false)
                 toast.success('Internal note added')
               }}
               className="bg-yellow-600 hover:bg-yellow-700 text-white"
             >
               Add Note
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


