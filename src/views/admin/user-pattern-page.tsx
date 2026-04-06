'use client'

import { useState } from 'react'
import { userPattern } from '@/data/dummies'
import { LineChartCard, BarChartCard } from '@/components/charts/lazy-charts'
import {
  Calendar,
  Filter,
  BarChart3,
  ChevronDown,
  MoreHorizontal,
  Info,
  Pencil,
  Sparkles,
  Save,
  X,
  Globe,
  TrendingUp,
  Users,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react'

/* ─── tiny helpers ─── */
const dateRanges = ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 90 days'] as const
type DateRange = (typeof dateRanges)[number]

function TimeBadge({ label }: { label: string }) {
  return (
    <span className="posthog-time-badge">
      {label}
    </span>
  )
}

function DragHandle() {
  return (
    <div className="posthog-drag-handle" aria-hidden>
      <div className="posthog-drag-dot" />
      <div className="posthog-drag-dot" />
      <div className="posthog-drag-dot" />
      <div className="posthog-drag-dot" />
      <div className="posthog-drag-dot" />
      <div className="posthog-drag-dot" />
    </div>
  )
}

function CardMenu() {
  return (
    <button className="posthog-card-menu" aria-label="Card options">
      <MoreHorizontal className="h-4 w-4" />
    </button>
  )
}

function InfoIcon() {
  return (
    <span className="posthog-info-icon" title="More info">
      <Info className="h-3.5 w-3.5" />
    </span>
  )
}

/* ─────────── DASHBOARD CARD WRAPPER ─────────── */
function DashboardCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`posthog-card ${className}`}>
      {/* drag handles on edges */}
      <DragHandle />
      <div className="posthog-card-inner">
        {children}
      </div>
    </div>
  )
}

/* ─────────── RETENTION TABLE ─────────── */
function RetentionTable() {
  const { retention } = userPattern
  const maxWeeks = retention.rows[0].weeks.length

  function cellColor(val: number | null) {
    if (val === null) return 'transparent'
    if (val >= 80) return 'rgba(54, 130, 245, 0.55)'
    if (val >= 50) return 'rgba(54, 130, 245, 0.40)'
    if (val >= 30) return 'rgba(54, 130, 245, 0.28)'
    if (val >= 15) return 'rgba(54, 130, 245, 0.16)'
    return 'rgba(54, 130, 245, 0.08)'
  }

  // Compute mean
  const meanWeeks = Array.from({ length: maxWeeks }, (_, wi) => {
    const vals = retention.rows
      .map((r) => r.weeks[wi])
      .filter((v): v is number => v !== null)
    if (vals.length === 0) return null
    return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  })
  const meanSize = Math.round(
    retention.rows.reduce((a, r) => a + r.size, 0) / retention.rows.length
  )

  return (
    <div className="posthog-retention-table">
      <table>
        <thead>
          <tr>
            {retention.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Mean row */}
          <tr className="posthog-retention-mean">
            <td>
              <span className="posthog-retention-expand">›</span> Mean
            </td>
            <td>{meanSize}</td>
            {meanWeeks.map((v, i) => (
              <td
                key={i}
                style={{
                  background: cellColor(v),
                }}
              >
                {v !== null ? `${v}%` : ''}
              </td>
            ))}
          </tr>
          {/* Cohort rows */}
          {retention.rows.map((row) => (
            <tr key={row.cohort}>
              <td>{row.cohort}</td>
              <td>{row.size}</td>
              {row.weeks.map((v, i) => (
                <td
                  key={i}
                  style={{
                    background: cellColor(v),
                  }}
                >
                  {v !== null ? `${v}%` : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─────────── GROWTH STACKED BAR ─────────── */
function GrowthAccountingChart() {
  const data = userPattern.growthAccounting
  const maxVal = Math.max(
    ...data.map((d) => d.newUsers + d.returning + d.resurrecting + d.dormant)
  )

  return (
    <div className="posthog-growth-chart">
      <div className="posthog-growth-legend">
        <span className="posthog-growth-legend-item">
          <span className="posthog-growth-dot" style={{ background: '#30A46C' }} /> New
        </span>
        <span className="posthog-growth-legend-item">
          <span className="posthog-growth-dot" style={{ background: '#3682F5' }} /> Returning
        </span>
        <span className="posthog-growth-legend-item">
          <span className="posthog-growth-dot" style={{ background: '#E5484D' }} /> Resurrecting
        </span>
        <span className="posthog-growth-legend-item">
          <span className="posthog-growth-dot" style={{ background: '#9B9B9B' }} /> Dormant
        </span>
      </div>
      <div className="posthog-growth-bars">
        {data.map((d) => {
          const total = d.newUsers + d.returning + d.resurrecting + d.dormant
          return (
            <div key={d.week} className="posthog-growth-bar-col">
              <div
                className="posthog-growth-bar-stack"
                style={{ height: `${(total / maxVal) * 100}%` }}
              >
                <div
                  className="posthog-growth-bar-seg"
                  style={{
                    height: `${(d.newUsers / total) * 100}%`,
                    background: '#30A46C',
                  }}
                  title={`New: ${d.newUsers}`}
                />
                <div
                  className="posthog-growth-bar-seg"
                  style={{
                    height: `${(d.returning / total) * 100}%`,
                    background: '#3682F5',
                  }}
                  title={`Returning: ${d.returning}`}
                />
                <div
                  className="posthog-growth-bar-seg"
                  style={{
                    height: `${(d.resurrecting / total) * 100}%`,
                    background: '#E5484D',
                  }}
                  title={`Resurrecting: ${d.resurrecting}`}
                />
                <div
                  className="posthog-growth-bar-seg"
                  style={{
                    height: `${(d.dormant / total) * 100}%`,
                    background: '#9B9B9B',
                  }}
                  title={`Dormant: ${d.dormant}`}
                />
              </div>
              <span className="posthog-growth-bar-label">{d.week}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────── REFERRING DOMAINS ─────────── */
function ReferringDomains() {
  const data = userPattern.referringDomains

  return (
    <div className="posthog-referring">
      {data.map((d) => (
        <div key={d.domain} className="posthog-referring-row">
          <div className="posthog-referring-domain">
            <Globe className="h-3.5 w-3.5 text-[hsl(var(--muted))]" />
            <span>{d.domain}</span>
          </div>
          <div className="posthog-referring-bar-wrap">
            <div
              className="posthog-referring-bar"
              style={{ width: `${d.pct}%` }}
            />
          </div>
          <span className="posthog-referring-count">{d.visitors.toLocaleString()}</span>
          <span className="posthog-referring-pct">{d.pct}%</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────── FUNNEL ─────────── */
function ConversionFunnel() {
  const data = userPattern.conversionFunnel
  const max = data[0].count

  return (
    <div className="posthog-funnel">
      {data.map((step, i) => {
        const pct = ((step.count / max) * 100).toFixed(1)
        const dropoff =
          i > 0
            ? (((data[i - 1].count - step.count) / data[i - 1].count) * 100).toFixed(1)
            : null

        return (
          <div key={step.step} className="posthog-funnel-step">
            <div className="posthog-funnel-bar-wrap">
              <div
                className="posthog-funnel-bar"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="posthog-funnel-meta">
              <span className="posthog-funnel-label">
                <span className="posthog-funnel-num">{i + 1}</span>
                {step.step}
              </span>
              <span className="posthog-funnel-count">
                {step.count.toLocaleString()}
                <span className="posthog-funnel-pct">({pct}%)</span>
              </span>
              {dropoff && (
                <span className="posthog-funnel-dropoff">
                  <ArrowDownRight className="h-3 w-3" />
                  {dropoff}% drop-off
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────── KPI PILL ─────────── */
function KpiPill({
  label,
  value,
  change,
  positive,
  icon,
}: {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
}) {
  return (
    <div className="posthog-kpi">
      <div className="posthog-kpi-icon">
        {icon}
      </div>
      <div className="posthog-kpi-body">
        <span className="posthog-kpi-label">{label}</span>
        <span className="posthog-kpi-value">{value}</span>
      </div>
      <span className={`posthog-kpi-change ${positive ? 'positive' : 'negative'}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   ═══  MAIN PAGE
   ═══════════════════════════════════════════ */
export function UserPatternPage() {
  const [dateRange, setDateRange] = useState<DateRange>('Last 30 days')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="posthog-dashboard">
      {/* ── Header bar ── */}
      <div className="posthog-header">
        <div className="posthog-header-left">
          <h1 className="posthog-title">
            <Sparkles className="h-5 w-5 text-amber-500" />
            User Pattern Dashboard
            <button className="posthog-edit-btn" aria-label="Edit title">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </h1>
          <p className="posthog-subtitle">
            Product analytics & user growth patterns — inspired by PostHog
          </p>
        </div>

        <div className="posthog-header-actions">
          {isEditing ? (
            <>
              <button className="posthog-btn secondary" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" /> Cancel
              </button>
              <button className="posthog-btn primary" onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4" /> Save
              </button>
            </>
          ) : (
            <button className="posthog-btn secondary" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="posthog-filter-bar">
        <div className="posthog-filter-left">
          <button className="posthog-filter-btn">
            <Calendar className="h-4 w-4" />
            <select
              className="posthog-filter-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
            >
              {dateRanges.map((dr) => (
                <option key={dr}>{dr}</option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button className="posthog-filter-btn">
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button className="posthog-filter-btn">
            <BarChart3 className="h-4 w-4" />
            Breakdown
          </button>
        </div>

        <button className="posthog-collapse-btn">
          Collapse view
        </button>
      </div>

      {/* ── KPI pills ── */}
      <div className="posthog-kpis-row">
        <KpiPill
          label="Daily Active Users"
          value="812"
          change="+14.5%"
          positive
          icon={<Users className="h-4 w-4" />}
        />
        <KpiPill
          label="Weekly Active Users"
          value="4,380"
          change="+6.3%"
          positive
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiPill
          label="Stickiness (DAU/WAU)"
          value="18.5%"
          change="+2.1pp"
          positive
          icon={<Sparkles className="h-4 w-4" />}
        />
        <KpiPill
          label="Avg Session"
          value="8m 42s"
          change="-0.8%"
          positive={false}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* ── Dashboard grid ── */}
      <div className="posthog-grid">
        {/* DAU Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 30 DAYS" />
              <h3 className="posthog-card-title">
                Daily active users (DAUs) <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                Shows the number of unique users that use your app every day.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <LineChartCard data={userPattern.dau} xKey="x" yKey="y" height={220} color="#3682F5" />
          </div>
        </DashboardCard>

        {/* WAU Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 90 DAYS" />
              <h3 className="posthog-card-title">
                Weekly active users (WAUs) <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                Shows the number of unique users that use your app every week.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <LineChartCard data={userPattern.wau} xKey="x" yKey="y" height={220} color="#30A46C" />
          </div>
        </DashboardCard>

        {/* Growth Accounting Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 30 DAYS" />
              <h3 className="posthog-card-title">
                Growth accounting <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                How many of your users are new, returning, resurrecting, or dormant each week.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <GrowthAccountingChart />
          </div>
        </DashboardCard>

        {/* Retention Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="WEEKLY" />
              <h3 className="posthog-card-title">
                Retention <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                Weekly retention of your users.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <RetentionTable />
          </div>
        </DashboardCard>

        {/* Referring Domains Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 14 DAYS" />
              <h3 className="posthog-card-title">
                Referring domain (last 14 days) <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                Shows the most common referring domains for your users over the past 14 days.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <ReferringDomains />
          </div>
        </DashboardCard>

        {/* Conversion Funnel Card */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 7 DAYS" />
              <h3 className="posthog-card-title">
                Conversion funnel <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                This example funnel shows how many of your users have completed each step.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <ConversionFunnel />
          </div>
        </DashboardCard>

        {/* Pageview funnel by browser */}
        <DashboardCard className="posthog-card-wide">
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 7 DAYS" />
              <h3 className="posthog-card-title">
                Pageview funnel, by browser <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                This example funnel shows how many of your users have completed 3 page views, broken down by browser.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <BarChartCard
              data={userPattern.pageviewFunnel}
              xKey="step"
              yKey="chrome"
              height={240}
              color="#3682F5"
            />
          </div>
        </DashboardCard>

        {/* Session Duration (legacy) */}
        <DashboardCard>
          <div className="posthog-card-header">
            <div>
              <TimeBadge label="LAST 30 DAYS" />
              <h3 className="posthog-card-title">
                Session duration distribution <InfoIcon />
              </h3>
              <p className="posthog-card-desc">
                Distribution of user session lengths.
              </p>
            </div>
            <CardMenu />
          </div>
          <div className="posthog-card-chart">
            <BarChartCard
              data={userPattern.sessionDurationMins}
              xKey="label"
              yKey="value"
              height={220}
              color="#E5484D"
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
