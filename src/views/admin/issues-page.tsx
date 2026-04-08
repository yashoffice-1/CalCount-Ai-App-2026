'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Users,
  BarChart3,
  Clock,
  Tag,
  ExternalLink,
  Copy,
  Star,
  Filter,
  ArrowUpDown,
  Layers,
  Globe,
  Terminal,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  issuesRows,
  issueStatuses,
  type IssueRow,
  type IssueLevel,
  type IssueStatus,
} from '@/data/dummies'
import { formatRelativeTime } from '@/lib/format'

/* ─── Level color mapping (Sentry-style) ─── */
function levelColor(level: IssueLevel) {
  switch (level) {
    case 'fatal': return '#d6336c'
    case 'error': return '#e5484d'
    case 'warning': return '#f5a623'
    case 'info': return '#3b82f6'
  }
}

function levelIcon(level: IssueLevel) {
  switch (level) {
    case 'fatal': return <XCircle className="h-4 w-4" style={{ color: '#d6336c' }} />
    case 'error': return <AlertTriangle className="h-4 w-4" style={{ color: '#e5484d' }} />
    case 'warning': return <AlertTriangle className="h-4 w-4" style={{ color: '#f5a623' }} />
    case 'info': return <Info className="h-4 w-4" style={{ color: '#3b82f6' }} />
  }
}

function levelLabel(level: IssueLevel) {
  switch (level) {
    case 'fatal': return 'Fatal'
    case 'error': return 'Error'
    case 'warning': return 'Warning'
    case 'info': return 'Info'
  }
}

function platformIcon(platform: string) {
  switch (platform) {
    case 'javascript': return '🟨'
    case 'node': return '🟩'
    case 'infrastructure': return '⚙️'
    default: return '📦'
  }
}

/* ─── Mini sparkline SVG ─── */
function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const w = 80
  const h = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="sentry-sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill={`${color}15`}
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  )
}

/* ─── Format number compactly ─── */
function formatCompact(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

/* ─── Assignee avatar ─── */
function AssigneeAvatar({ initials, name, size = 'sm' }: { initials?: string; name?: string, size?: 'xs' | 'sm' }) {
  const sizeClass = size === 'xs' ? 'h-5 w-5 text-[10px]' : 'h-6 w-6 text-xs';
  return (
    <div className={`${sizeClass} rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border border-indigo-200 shrink-0`} title={name}>
      {initials || '?'}
    </div>
  )
}

function cloneIssues(seed: IssueRow[]): IssueRow[] {
  return seed.map((r) => ({
    ...r,
    affectedServices: [...r.affectedServices],
    relatedTickets: [...r.relatedTickets],
    sparkline: [...r.sparkline],
  }))
}

/* ╔═══════════════════════════════════════╗
   ║         MAIN ISSUES PAGE             ║
   ╚═══════════════════════════════════════╝ */
export function IssuesPage() {
  const [rows, setRows] = React.useState<IssueRow[]>(() => cloneIssues(issuesRows))
  const [search, setSearch] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = React.useState<'all' | IssueStatus>('all')
  const [levelFilter, setLevelFilter] = React.useState<'all' | IssueLevel>('all')
  const [sortBy, setSortBy] = React.useState<'lastSeen' | 'events' | 'users' | 'firstSeen'>('lastSeen')

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  const selected = selectedId ? rows.find((r) => r.id === selectedId) ?? null : null

  const filtered = React.useMemo(() => {
    let result = rows

    // text search
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((r) => {
        const hay = [r.id, r.shortId, r.title, r.culprit, r.source, r.severity, r.status, r.assignedTo, r.errorCode, r.platform, ...r.affectedServices]
          .join(' ').toLowerCase()
        return hay.includes(q)
      })
    }

    // status filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }

    // level filter
    if (levelFilter !== 'all') {
      result = result.filter((r) => r.level === levelFilter)
    }

    // sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'events': return b.events - a.events
        case 'users': return b.users - a.users
        case 'firstSeen': return new Date(b.firstSeenISO).getTime() - new Date(a.firstSeenISO).getTime()
        default: return new Date(b.lastSeenISO).getTime() - new Date(a.lastSeenISO).getTime()
      }
    })

    return result
  }, [search, rows, statusFilter, levelFilter, sortBy])

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (checkedIds.size === filtered.length) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(filtered.map((r) => r.id)))
    }
  }

  function toggleBookmark(id: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r
      ))
  }

  function updateStatus(id: string, status: IssueStatus) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, updatedISO: new Date().toISOString() } : r
      )
    )
    toast.success('Status updated', { description: `${id} → ${status}` })
  }

  function resolveSelected() {
    checkedIds.forEach((id) => updateStatus(id, 'Resolved'))
    setCheckedIds(new Set())
    toast.success(`Resolved ${checkedIds.size} issue(s)`)
  }

  // Stats
  const totalEvents = rows.reduce((a, r) => a + r.events, 0)
  const unresolvedCount = rows.filter((r) => r.status !== 'Resolved').length

  if (!mounted) return <div className="sentry-page" />

  return (
    <div className="sentry-page" suppressHydrationWarning>
      {/* ── Header ── */}
      <div className="sentry-page-header">
        <div className="sentry-page-header-left">
          <h1 className="sentry-page-title">Issues</h1>
          <div className="sentry-page-stats">
            <span className="sentry-stat">
              <Layers className="h-3.5 w-3.5" />
              {unresolvedCount} Unresolved
            </span>
            <span className="sentry-stat-sep">·</span>
            <span className="sentry-stat">
              <BarChart3 className="h-3.5 w-3.5" />
              {formatCompact(totalEvents)} Events
            </span>
          </div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="sentry-search-bar">
        <div className="sentry-search-input-wrap">
          <Search className="h-4 w-4 sentry-search-icon" />
          <input
            className="sentry-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues by title, error code, service, assignee..."
            aria-label="Search issues"
          />
        </div>
        <div className="sentry-filter-pills">
          <select
            className="sentry-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">All Statuses</option>
            {issueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="sentry-filter-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}
          >
            <option value="all">All Levels</option>
            <option value="fatal">Fatal</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <select
            className="sentry-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="lastSeen">Last Seen</option>
            <option value="firstSeen">First Seen</option>
            <option value="events">Events</option>
            <option value="users">Users</option>
          </select>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {checkedIds.size > 0 && (
        <div className="sentry-bulk-bar">
          <span className="sentry-bulk-count">{checkedIds.size} selected</span>
          <button className="sentry-bulk-btn resolve" onClick={resolveSelected}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
          </button>
          <button className="sentry-bulk-btn" onClick={() => setCheckedIds(new Set())}>
            Clear
          </button>
        </div>
        
      )}

      {/* ── Issue list ── */}
      <div className="sentry-issue-list">
        {/* Table header */}
        <div className="sentry-issue-header">
          <div className="sentry-issue-check">
            <input
              type="checkbox"
              className="sentry-checkbox"
              checked={checkedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              aria-label="Select all"
            />
          </div>
          <div className="sentry-issue-main-col">Issue</div>
          <div className="sentry-issue-graph-col">
            <button className="sentry-col-sort" onClick={() => setSortBy('events')}>
              Graph
            </button>
          </div>
          <div className="sentry-issue-events-col">
            <button className="sentry-col-sort" onClick={() => setSortBy('events')}>
              Events <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
          <div className="sentry-issue-users-col">
            <button className="sentry-col-sort" onClick={() => setSortBy('users')}>
              Users <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
          <div className="sentry-issue-assign-col">Assignee</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="sentry-empty">
            <Layers className="h-10 w-10" />
            <p>No issues matching your filters</p>
          </div>
        ) : (
          filtered.map((row) => (
            <div
              key={row.id}
              className={`sentry-issue-row ${checkedIds.has(row.id) ? 'checked' : ''} ${row.status === 'Resolved' ? 'resolved' : ''}`}
            >
              {/* Level indicator bar */}
              <div className="sentry-level-bar" style={{ background: levelColor(row.level) }} />

              {/* Checkbox */}
              <div className="sentry-issue-check">
                <input
                  type="checkbox"
                  className="sentry-checkbox"
                  checked={checkedIds.has(row.id)}
                  onChange={() => toggleCheck(row.id)}
                  aria-label={`Select ${row.id}`}
                />
              </div>

              {/* Main content */}
              <div className="sentry-issue-main-col">
                <div className="sentry-issue-title-row">
                  {/* Level icon */}
                  {levelIcon(row.level)}

                  {/* Title & culprit */}
                  <div className="sentry-issue-title-group">
                    <button
                      className="sentry-issue-title"
                      onClick={() => setSelectedId(row.id)}
                    >
                      {row.title}
                    </button>
                    <span className="sentry-issue-culprit">{row.culprit}</span>
                  </div>

                  {/* Bookmark */}
                  <button
                    className={`sentry-bookmark ${row.isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark(row.id)}
                    aria-label="Bookmark"
                  >
                    {row.isBookmarked
                      ? <Star className="h-3.5 w-3.5" fill="currentColor" />
                      : <Star className="h-3.5 w-3.5" />
                    }
                  </button>
                </div>

                {/* Meta row */}
                <div className="sentry-issue-meta">
                  <span className="sentry-issue-id">{row.shortId}</span>
                  <span className="sentry-issue-platform">{platformIcon(row.platform)}</span>
                  <span className="sentry-issue-time">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(row.lastSeenISO)}
                  </span>
                  <span className="sentry-issue-first-seen">
                    First seen {formatRelativeTime(row.firstSeenISO)}
                  </span>
                  <span className={`sentry-issue-level-badge level-${row.level}`}>
                    {levelLabel(row.level)}
                  </span>
                  {row.status === 'Resolved' && (
                    <span className="sentry-resolved-badge">
                      <CheckCircle2 className="h-3 w-3" /> Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline */}
              <div className="sentry-issue-graph-col">
                <Sparkline data={row.sparkline} color={levelColor(row.level)} />
              </div>

              {/* Events */}
              <div className="sentry-issue-events-col">
                <span className="sentry-metric-value">{formatCompact(row.events)}</span>
              </div>

              {/* Users */}
              <div className="sentry-issue-users-col">
                <span className="sentry-metric-value">{row.users > 0 ? formatCompact(row.users) : '—'}</span>
              </div>

              {/* Assignee */}
              <div className="sentry-issue-assign-col">
                <AssigneeAvatar initials={row.assigneeAvatar} name={row.assignedTo} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="sentry-results-footer">
        Showing {filtered.length} of {rows.length} issues
      </div>

      {/* ── Detail dialog ── */}
      <Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-h-[min(90vh,800px)] max-w-3xl overflow-hidden">
          <DialogHeader className="pb-2 border-b border-[hsl(var(--border))]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold flex items-center gap-2 leading-tight">
                  {selected && levelIcon(selected.level)}
                  <span>{selected?.title ?? 'Issue'}</span>
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                   <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-bold text-gray-600">{selected?.shortId}</span>
                   <span>•</span>
                   <span className="font-medium text-indigo-600">{selected?.culprit}</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {selected ? (
            <div className="max-h-[calc(min(90vh,800px)-10rem)] space-y-4 overflow-y-auto pr-1 text-sm">
              {/* Action bar */}
              <div className="sentry-detail-actions">
                <div className="flex items-center gap-2">
                  <span className={`sentry-level-pill level-${selected.level}`}>
                    {levelLabel(selected.level)}
                  </span>
                  <select
                    className="sentry-detail-status-select"
                    value={selected.status}
                    aria-label="Issue status"
                    onChange={(e) => updateStatus(selected.id, e.target.value as IssueStatus)}
                  >
                    {issueStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <div className="h-4 w-px bg-[hsl(var(--border))] mx-1" />

                  <div className="flex items-center gap-2 px-2 py-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--muted-background))]">
                     <AssigneeAvatar initials={selected.assigneeAvatar} name={selected.assignedTo} size="xs" />
                     <select 
                       className="bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer outline-none"
                       value={selected.assignedTo || ''}
                       onChange={(e) => {
                         const val = e.target.value;
                         setRows(prev => prev.map(r => r.id === selected.id ? { ...r, assignedTo: val, assigneeAvatar: val.split(' ').map(n=>n[0]).join('') } : r));
                         toast.success(`Assigned to ${val}`);
                       }}
                     >
                        <option value="">Unassigned</option>
                        <option value="Sara Kim">Sara Kim</option>
                        <option value="Dev Chen">Dev Chen</option>
                        <option value="Mike Jordan">Mike Jordan</option>
                        <option value="Priya Shah">Priya Shah</option>
                     </select>
                  </div>
                </div>

                <div className="sentry-detail-meta-pills">
                  <span className="sentry-detail-meta-pill">
                    <BarChart3 className="h-3 w-3" /> {selected.events.toLocaleString()} events
                  </span>
                  <span className="sentry-detail-meta-pill">
                    <Users className="h-3 w-3" /> {selected.users} users
                  </span>
                  <span className="sentry-detail-meta-pill">
                    <Globe className="h-3 w-3" /> {selected.region}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="sentry-detail-timeline">
                <div className="sentry-timeline-item">
                  <span className="sentry-timeline-dot" /> First seen: {formatRelativeTime(selected.firstSeenISO)}
                </div>
                <div className="sentry-timeline-item">
                  <span className="sentry-timeline-dot" /> Last seen: {formatRelativeTime(selected.lastSeenISO)}
                </div>
                <div className="sentry-timeline-item">
                  <span className="sentry-timeline-dot" /> Last updated: {formatRelativeTime(selected.updatedISO)}
                </div>
              </div>

              {/* Sparkline in detail */}
              <div className="sentry-detail-sparkline-wrap">
                <span className="text-xs font-medium text-[hsl(var(--muted))]">Event frequency (12h)</span>
                <Sparkline data={selected.sparkline} color={levelColor(selected.level)} />
              </div>

              {/* Summary */}
              <div className="sentry-detail-section">
                <h4 className="sentry-detail-section-title">Summary</h4>
                <p className="sentry-detail-text">{selected.summary}</p>
              </div>

              {/* Impact */}
              <div className="sentry-detail-section">
                <h4 className="sentry-detail-section-title">Impact</h4>
                <p className="sentry-detail-text">{selected.impact}</p>
              </div>

              {/* Stack trace */}
              <div className="sentry-detail-section">
                <h4 className="sentry-detail-section-title">
                  <Terminal className="h-3.5 w-3.5" /> Stack Trace
                </h4>
                <pre className="sentry-stacktrace">{selected.stackTrace}</pre>
              </div>

              {/* Tags grid */}
              <div className="sentry-tags-grid">
                <SentryTag label="Error Code" value={selected.errorCode} mono />
                <SentryTag label="Request ID" value={selected.requestId} mono />
                <SentryTag label="Region" value={selected.region} />
                <SentryTag label="Platform" value={selected.platform} />
                <SentryTag label="Assignee" value={selected.assignedTo || 'Unassigned'} />
                <SentryTag label="Source" value={selected.source} />
              </div>

              {/* Affected services */}
              <div className="sentry-detail-section">
                <h4 className="sentry-detail-section-title">Affected Services</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.affectedServices.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Related tickets */}
              {selected.relatedTickets.length > 0 && (
                <div className="sentry-detail-section">
                  <h4 className="sentry-detail-section-title">Related Tickets</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.relatedTickets.map((t) => (
                      <span key={t} className="sentry-ticket-link">
                        <ExternalLink className="h-3 w-3" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reproduction */}
              <div className="sentry-detail-section">
                <h4 className="sentry-detail-section-title">Reproduction Steps</h4>
                <p className="sentry-detail-text">{selected.reproduction}</p>
              </div>

              {/* AI Insight */}
              <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-indigo-200">
                   <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                     AI Assignment Engine
                     <Badge className="bg-indigo-600 text-[10px] h-4">Beta</Badge>
                   </h4>
                   <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                     Based on the culprit <span className="font-semibold">{selected.culprit}</span> and stack trace, 
                     this issue matches previous fixes by <span className="underline font-medium">Dev Chen</span>.
                   </p>
                   <button 
                     onClick={() => {
                        setRows(prev => prev.map(r => r.id === selected.id ? { ...r, assignedTo: 'Dev Chen', assigneeAvatar: 'DC' } : r));
                        toast.success('Assigned to Dev Chen via AI Insight');
                     }}
                     className="mt-3 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 transition-colors uppercase tracking-wider"
                   >
                     Assign to Dev Chen
                   </button>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="border-t border-[hsl(var(--border))] pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (selected) {
                  navigator.clipboard?.writeText(selected.id)
                  toast.message('Copied issue ID')
                }
              }}
            >
              <Copy className="h-4 w-4" /> Copy ID
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedId(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (selected) {
                  updateStatus(selected.id, 'Resolved')
                  toast.success('Issue resolved', { description: selected.id })
                }
                setSelectedId(null)
              }}
            >
              <CheckCircle2 className="h-4 w-4" /> Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─── Sentry-style tag ─── */
function SentryTag({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="sentry-tag">
      <span className="sentry-tag-label">{label}</span>
      <span className={`sentry-tag-value ${mono ? 'mono' : ''}`}>{value}</span>
    </div>
  )
}
