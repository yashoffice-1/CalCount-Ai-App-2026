export type ApiStatus = 'Healthy' | 'Degraded' | 'Down' | 'Maintenance'

export type ApiRow = {
  id: string
  name: string
  status: ApiStatus
  requests: number
  errors: number
  lastUsedISO: string
}

export type TicketStatus = 'Open' | 'In Progress' | 'Closed'

export type TicketRow = {
  id: string
  user: string
  issue: string
  status: TicketStatus
  assignedTo: string
  lastUpdatedISO: string
}

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical'
export type IssueStatus = 'Investigating' | 'Monitoring' | 'Resolved'
export type IssueLevel = 'error' | 'warning' | 'info' | 'fatal'

export const issueStatuses: IssueStatus[] = ['Investigating', 'Monitoring', 'Resolved']

export type IssueRow = {
  id: string
  shortId: string
  title: string
  culprit: string
  source: string
  severity: IssueSeverity
  level: IssueLevel
  status: IssueStatus
  openedISO: string
  updatedISO: string
  lastSeenISO: string
  firstSeenISO: string
  assignedTo: string
  assigneeAvatar?: string
  summary: string
  impact: string
  requestId: string
  region: string
  errorCode: string
  stackTrace: string
  affectedServices: string[]
  relatedTickets: string[]
  reproduction: string
  events: number
  users: number
  platform: string
  isBookmarked?: boolean
  sparkline: number[]
}

export const issuesRows: IssueRow[] = [
  {
    id: 'ISS-7781',
    shortId: 'CALCOUNT-4A',
    title: 'TimeoutError: upstream connector timeout after 8000ms',
    culprit: 'AnalyticsIngest.handleBatch in ingest.js',
    source: 'API: /v2/analytics/events',
    severity: 'High',
    level: 'error',
    status: 'Investigating',
    openedISO: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    assignedTo: 'Dev Chen',
    assigneeAvatar: 'DC',
    summary:
      'p95 latency for the analytics ingest endpoint climbed above 2s during peak traffic. Error budget burn increased in the last hour.',
    impact:
      'Roughly 12% of event batches are retried; downstream dashboards may show 2–5 minute delays.',
    requestId: 'req_anl_9f3c2a1b',
    region: 'us-east-1',
    errorCode: 'ANL_TIMEOUT_504',
    stackTrace:
      'at AnalyticsIngest.handleBatch (ingest.js:442)\n  at async Worker.process (queue.js:88)\n  Caused by: upstream connector timeout after 8000ms',
    affectedServices: ['analytics-ingest', 'event-queue', 'metrics-aggregator'],
    relatedTickets: ['TCK-1042', 'TCK-1038'],
    reproduction:
      'POST /v2/analytics/events with batch size > 500 during 14:00–16:00 UTC; observe intermittent 504 from load balancer.',
    events: 2847,
    users: 342,
    platform: 'node',
    isBookmarked: true,
    sparkline: [12, 28, 45, 32, 56, 78, 64, 89, 72, 94, 85, 67],
  },
  {
    id: 'ISS-7769',
    shortId: 'CALCOUNT-39',
    title: 'InfraError: CPU usage sustained above threshold (78%)',
    culprit: 'worker-tier-eu health monitor',
    source: 'Server: eu-west-1',
    severity: 'Medium',
    level: 'warning',
    status: 'Monitoring',
    openedISO: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    assignedTo: 'Sara Kim',
    assigneeAvatar: 'SK',
    summary:
      'Auto-scaling added two nodes; CPU remains at 78–85% on remaining instances. GC pause times slightly elevated.',
    impact: 'No user-facing outages; API latency +80ms vs baseline for EU traffic.',
    requestId: 'req_srv_7d21e4c0',
    region: 'eu-west-1',
    errorCode: 'INFRA_CPU_HIGH',
    stackTrace:
      'Node metrics: process.cpu.usage sustained > 0.78\n  heap: 1.9GB / 2.4GB\n  GC: young gen collection 45ms p99',
    affectedServices: ['api-gateway-eu', 'worker-tier-eu'],
    relatedTickets: ['TCK-1041'],
    reproduction: 'Compare CloudWatch CPUUtilization for asg-eu-app vs last 7d same hour; spike visible since 09:15 UTC.',
    events: 1432,
    users: 0,
    platform: 'infrastructure',
    sparkline: [5, 8, 12, 18, 24, 32, 28, 35, 42, 38, 45, 41],
  },
  {
    id: 'ISS-7755',
    shortId: 'CALCOUNT-35',
    title: 'JsonWebTokenError: invalid signature',
    culprit: 'legacyAuth in middleware/legacy.js',
    source: 'API: /v1/legacy/user/profile',
    severity: 'Critical',
    level: 'fatal',
    status: 'Resolved',
    openedISO: new Date(Date.now() - 1000 * 60 * 520).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    assignedTo: 'Priya Shah',
    assigneeAvatar: 'PS',
    summary:
      'Auth middleware rejected tokens signed with deprecated secret after rotation. Legacy clients without refresh failed closed.',
    impact: '100% failure for v1 profile calls until rollback; ~340 failed requests in 18 minutes.',
    requestId: 'req_leg_0aa11ff3',
    region: 'multi-region',
    errorCode: 'AUTH_JWT_INVALID',
    stackTrace:
      'JsonWebTokenError: invalid signature\n    at verify (jwt.js:112)\n    at legacyAuth (middleware/legacy.js:34)',
    affectedServices: ['legacy-api', 'auth-service'],
    relatedTickets: ['TCK-1039'],
    reproduction: 'Call GET /v1/legacy/user/profile with token issued before 2026-04-01 secret rotation.',
    events: 340,
    users: 187,
    platform: 'node',
    sparkline: [0, 0, 2, 85, 120, 95, 42, 8, 0, 0, 0, 0],
  },
  {
    id: 'ISS-7790',
    shortId: 'CALCOUNT-4F',
    title: 'TypeError: Cannot read properties of undefined (reading \'mealData\')',
    culprit: 'CalorieTracker.render in tracker.tsx',
    source: 'Frontend: /dashboard/tracker',
    severity: 'High',
    level: 'error',
    status: 'Investigating',
    openedISO: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    assignedTo: 'Dev Chen',
    assigneeAvatar: 'DC',
    summary:
      'Users intermittently see a blank tracker page when meal data API returns partial response. Occurs when network is slow.',
    impact: '~8% of page loads on the tracker fail to render.',
    requestId: 'req_fe_c2a1b3d4',
    region: 'global',
    errorCode: 'REACT_RENDER_ERR',
    stackTrace:
      'TypeError: Cannot read properties of undefined (reading \'mealData\')\n    at CalorieTracker.render (tracker.tsx:156)\n    at renderWithHooks (react-dom.js:1234)',
    affectedServices: ['frontend', 'meal-api'],
    relatedTickets: [],
    reproduction: 'Throttle network to Slow 3G, load /dashboard/tracker, observe blank page ~1 in 10 loads.',
    events: 4521,
    users: 892,
    platform: 'javascript',
    isBookmarked: true,
    sparkline: [45, 52, 68, 42, 78, 92, 105, 88, 124, 135, 148, 156],
  },
  {
    id: 'ISS-7788',
    shortId: 'CALCOUNT-4D',
    title: 'RateLimitError: Too many requests from single IP',
    culprit: 'rateLimiter middleware in api-gateway',
    source: 'API: /v2/food/search',
    severity: 'Low',
    level: 'warning',
    status: 'Monitoring',
    openedISO: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    assignedTo: 'Sara Kim',
    assigneeAvatar: 'SK',
    summary:
      'Burst of 429 responses from food search endpoint. Likely a scraper or misbehaving integration.',
    impact: 'Legitimate users unaffected. Rate limiter is working as designed.',
    requestId: 'req_rl_5e6f7a8b',
    region: 'us-east-1',
    errorCode: 'RATE_LIMIT_429',
    stackTrace: 'RateLimitError: 429 Too Many Requests\n    at rateLimiter (middleware/rate-limit.js:89)',
    affectedServices: ['api-gateway', 'food-search'],
    relatedTickets: [],
    reproduction: 'Send > 100 requests/min from single IP to /v2/food/search.',
    events: 8923,
    users: 3,
    platform: 'node',
    sparkline: [200, 180, 350, 420, 280, 190, 520, 310, 250, 180, 400, 350],
  },
  {
    id: 'ISS-7785',
    shortId: 'CALCOUNT-4B',
    title: 'DatabaseError: connection pool exhausted',
    culprit: 'pg.Pool.connect in db/pool.js',
    source: 'Database: primary-rw',
    severity: 'High',
    level: 'error',
    status: 'Resolved',
    openedISO: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    assignedTo: 'Priya Shah',
    assigneeAvatar: 'PS',
    summary:
      'Connection pool max (50) reached during bulk import job. Queries began timing out.',
    impact: 'Bulk import users experienced 30s+ delays. Regular API unaffected.',
    requestId: 'req_db_a1b2c3d4',
    region: 'us-east-1',
    errorCode: 'PG_POOL_EXHAUSTED',
    stackTrace: 'DatabaseError: connection pool exhausted\n    at Pool.connect (db/pool.js:67)\n    at BulkImport.run (import.js:234)',
    affectedServices: ['database', 'bulk-import', 'api-service'],
    relatedTickets: ['TCK-1040'],
    reproduction: 'Trigger bulk import with > 10k records while pool max is 50.',
    events: 567,
    users: 45,
    platform: 'node',
    sparkline: [0, 0, 5, 45, 120, 89, 34, 12, 3, 0, 0, 0],
  },
  {
    id: 'ISS-7792',
    shortId: 'CALCOUNT-51',
    title: 'UnhandledRejection: Network request failed',
    culprit: 'fetchNutritionData in api/nutrition.ts',
    source: 'Frontend: /meal/add',
    severity: 'Medium',
    level: 'error',
    status: 'Investigating',
    openedISO: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    assignedTo: '',
    summary:
      'Mobile users on poor connections get unhandled promise rejection when adding meals. Missing error boundary.',
    impact: 'Meal add flow crashes for ~5% of mobile users.',
    requestId: 'req_fe_d4e5f6a7',
    region: 'global',
    errorCode: 'PROMISE_REJECTION',
    stackTrace: 'UnhandledRejection: Network request failed\n    at fetchNutritionData (api/nutrition.ts:45)\n    at MealForm.handleSubmit (meal-form.tsx:89)',
    affectedServices: ['frontend', 'nutrition-api'],
    relatedTickets: [],
    reproduction: 'Enable airplane mode after loading /meal/add, then submit form.',
    events: 1256,
    users: 678,
    platform: 'javascript',
    sparkline: [8, 15, 22, 34, 45, 52, 48, 62, 71, 78, 85, 92],
  },
  {
    id: 'ISS-7794',
    shortId: 'CALCOUNT-53',
    title: 'DeprecationWarning: Buffer() is deprecated',
    culprit: 'imageProcessor in utils/image.js',
    source: 'Worker: image-processor',
    severity: 'Low',
    level: 'info',
    status: 'Monitoring',
    openedISO: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedISO: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    lastSeenISO: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    firstSeenISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    assignedTo: 'Dev Chen',
    assigneeAvatar: 'DC',
    summary:
      'Node.js deprecation warning for Buffer() constructor in food image processing pipeline.',
    impact: 'No immediate impact. Will break in Node.js 22+.',
    requestId: 'req_wrk_b2c3d4e5',
    region: 'us-east-1',
    errorCode: 'DEP0005',
    stackTrace: 'DeprecationWarning: Buffer() is deprecated\n    at imageProcessor (utils/image.js:23)',
    affectedServices: ['image-processor'],
    relatedTickets: [],
    reproduction: 'Upload any food image; warning appears in worker logs.',
    events: 24560,
    users: 0,
    platform: 'node',
    sparkline: [100, 98, 102, 105, 99, 103, 101, 100, 104, 97, 102, 100],
  },
]

export type UserRow = {
  id: string
  name: string
  email: string
  plan: 'Free' | 'Pro' | 'Enterprise'
  activity: string
  suspended?: boolean
}

export const dashboardKpis = {
  totalUsers: 7842,
  activeApis: 38,
  revenueToday: 12840,
  activeTickets: 27,
}

export const apiUsageTrend = {
  points: [
    { x: 'Mon', y: 120 },
    { x: 'Tue', y: 156 },
    { x: 'Wed', y: 132 },
    { x: 'Thu', y: 190 },
    { x: 'Fri', y: 220 },
    { x: 'Sat', y: 176 },
    { x: 'Sun', y: 210 },
  ],
}

export const revenueTrend = {
  points: [
    { x: 'Week 1', y: 12000 },
    { x: 'Week 2', y: 16400 },
    { x: 'Week 3', y: 14250 },
    { x: 'Week 4', y: 19800 },
  ],
}

export const cpuMemoryTrend = {
  cpu: [
    { x: '00:00', y: 28 },
    { x: '03:00', y: 42 },
    { x: '06:00', y: 38 },
    { x: '09:00', y: 55 },
    { x: '12:00', y: 61 },
    { x: '15:00', y: 49 },
    { x: '18:00', y: 66 },
    { x: '21:00', y: 58 },
  ],
  memory: [
    { x: '00:00', y: 46 },
    { x: '03:00', y: 49 },
    { x: '06:00', y: 52 },
    { x: '09:00', y: 55 },
    { x: '12:00', y: 59 },
    { x: '15:00', y: 57 },
    { x: '18:00', y: 61 },
    { x: '21:00', y: 60 },
  ],
}

export const oldApis: ApiRow[] = [
  {
    id: 'api_old_1',
    name: '/v1/legacy/checkout',
    status: 'Degraded',
    requests: 8231,
    errors: 12,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: 'api_old_2',
    name: '/v1/legacy/invoices',
    status: 'Healthy',
    requests: 11290,
    errors: 3,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'api_old_3',
    name: '/v1/legacy/user/profile',
    status: 'Down',
    requests: 4012,
    errors: 96,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
  },
]

export const newApis: ApiRow[] = [
  {
    id: 'api_new_1',
    name: '/v2/payments/checkout',
    status: 'Healthy',
    requests: 12840,
    errors: 1,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 'api_new_2',
    name: '/v2/support/tickets',
    status: 'Healthy',
    requests: 8450,
    errors: 6,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
  },
  {
    id: 'api_new_3',
    name: '/v2/analytics/events',
    status: 'Maintenance',
    requests: 3310,
    errors: 0,
    lastUsedISO: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
  },
]

export const ticketRows: TicketRow[] = [
  {
    id: 'TCK-1042',
    user: 'mike@northwind.ai',
    issue: 'Webhook retries failing (400)',
    status: 'In Progress',
    assignedTo: 'Sara',
    lastUpdatedISO: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  },
  {
    id: 'TCK-1041',
    user: 'sara@aurora.ai',
    issue: 'API keys rotation request',
    status: 'Open',
    assignedTo: 'Dev',
    lastUpdatedISO: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
  },
  {
    id: 'TCK-1039',
    user: 'alex@northwind.ai',
    issue: 'Billing mismatch on monthly plan',
    status: 'Closed',
    assignedTo: 'Priya',
    lastUpdatedISO: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
]

export const revenueFilters = ['Daily', 'Weekly', 'Monthly'] as const
export type RevenueFilter = (typeof revenueFilters)[number]

export const revenueDataByFilter: Record<
  RevenueFilter,
  {
    kpis: {
      totalRevenue: number
      paidUsers: number
      trialUsers: number
      cancellations: number
    }
    trend: { x: string; y: number }[]
    conversion: { label: string; value: number }[]
  }
> = {
  Daily: {
    kpis: {
      totalRevenue: 4280,
      paidUsers: 3120,
      trialUsers: 410,
      cancellations: 12,
    },
    trend: [
      { x: '8AM', y: 850 },
      { x: '11AM', y: 1120 },
      { x: '2PM', y: 920 },
      { x: '5PM', y: 1180 },
      { x: '8PM', y: 990 },
    ],
    conversion: [
      { label: 'Converted', value: 62 },
      { label: 'Not converted', value: 38 },
    ],
  },
  Weekly: {
    kpis: {
      totalRevenue: 26840,
      paidUsers: 3190,
      trialUsers: 460,
      cancellations: 19,
    },
    trend: [
      { x: 'Mon', y: 3200 },
      { x: 'Tue', y: 4100 },
      { x: 'Wed', y: 3900 },
      { x: 'Thu', y: 4600 },
      { x: 'Fri', y: 5200 },
      { x: 'Sat', y: 3800 },
      { x: 'Sun', y: 3140 },
    ],
    conversion: [
      { label: 'Converted', value: 58 },
      { label: 'Not converted', value: 42 },
    ],
  },
  Monthly: {
    kpis: {
      totalRevenue: 124000,
      paidUsers: 3320,
      trialUsers: 520,
      cancellations: 44,
    },
    trend: [
      { x: 'Wk 1', y: 12000 },
      { x: 'Wk 2', y: 16400 },
      { x: 'Wk 3', y: 14250 },
      { x: 'Wk 4', y: 19800 },
    ],
    conversion: [
      { label: 'Converted', value: 64 },
      { label: 'Not converted', value: 36 },
    ],
  },
}




export const userPattern = {
  /* ── Daily Active Users (DAU) ─ Last 30 days ── */
  dau: [
    { x: 'Mar 5', y: 412 }, { x: 'Mar 6', y: 438 }, { x: 'Mar 7', y: 465 },
    { x: 'Mar 8', y: 321 }, { x: 'Mar 9', y: 289 }, { x: 'Mar 10', y: 478 },
    { x: 'Mar 11', y: 502 }, { x: 'Mar 12', y: 519 }, { x: 'Mar 13', y: 534 },
    { x: 'Mar 14', y: 498 }, { x: 'Mar 15', y: 356 }, { x: 'Mar 16', y: 312 },
    { x: 'Mar 17', y: 541 }, { x: 'Mar 18', y: 567 }, { x: 'Mar 19', y: 589 },
    { x: 'Mar 20', y: 612 }, { x: 'Mar 21', y: 578 }, { x: 'Mar 22', y: 398 },
    { x: 'Mar 23', y: 367 }, { x: 'Mar 24', y: 623 }, { x: 'Mar 25', y: 645 },
    { x: 'Mar 26', y: 678 }, { x: 'Mar 27', y: 701 }, { x: 'Mar 28', y: 689 },
    { x: 'Mar 29', y: 432 }, { x: 'Mar 30', y: 401 }, { x: 'Mar 31', y: 734 },
    { x: 'Apr 1', y: 756 }, { x: 'Apr 2', y: 789 }, { x: 'Apr 3', y: 812 },
  ],

  /* ── Weekly Active Users (WAU) ─ Last 90 days ── */
  wau: [
    { x: 'Jan 6', y: 2120 }, { x: 'Jan 13', y: 2340 }, { x: 'Jan 20', y: 2510 },
    { x: 'Jan 27', y: 2680 }, { x: 'Feb 3', y: 2450 }, { x: 'Feb 10', y: 2890 },
    { x: 'Feb 17', y: 3120 }, { x: 'Feb 24', y: 3340 }, { x: 'Mar 3', y: 3010 },
    { x: 'Mar 10', y: 3560 }, { x: 'Mar 17', y: 3780 }, { x: 'Mar 24', y: 4120 },
    { x: 'Mar 31', y: 4380 },
  ],

  /* ── Growth Accounting ─ Last 30 days ── */
  growthAccounting: [
    { week: 'W9',  newUsers: 120, returning: 280, resurrecting: 45, dormant: 62 },
    { week: 'W10', newUsers: 145, returning: 310, resurrecting: 38, dormant: 55 },
    { week: 'W11', newUsers: 168, returning: 345, resurrecting: 52, dormant: 48 },
    { week: 'W12', newUsers: 192, returning: 378, resurrecting: 41, dormant: 43 },
    { week: 'W13', newUsers: 215, returning: 412, resurrecting: 58, dormant: 38 },
  ],

  /* ── Retention  ─ weekly cohorts ── */
  retention: {
    headers: ['Cohort', 'Size', 'Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
    rows: [
      { cohort: 'Mar 1 to Mar 7',   size: 412,  weeks: [100, 42.3, 31.8, 24.1, 18.6] },
      { cohort: 'Mar 8 to Mar 14',  size: 478,  weeks: [100, 45.1, 33.2, 25.9, null] },
      { cohort: 'Mar 15 to Mar 21', size: 534,  weeks: [100, 48.7, 35.6, null, null] },
      { cohort: 'Mar 22 to Mar 28', size: 623,  weeks: [100, 51.2, null, null, null] },
      { cohort: 'Mar 29 to Apr 4',  size: 756,  weeks: [100, null, null, null, null] },
    ],
  },

  /* ── Referring domains ─ last 14 days ── */
  referringDomains: [
    { domain: 'google.com', visitors: 1245, pct: 38.2 },
    { domain: 'twitter.com', visitors: 623, pct: 19.1 },
    { domain: 'github.com', visitors: 456, pct: 14.0 },
    { domain: 'linkedin.com', visitors: 312, pct: 9.6 },
    { domain: 'producthunt.com', visitors: 234, pct: 7.2 },
    { domain: 'direct / none', visitors: 389, pct: 11.9 },
  ],

  /* ── Pageview funnel ─ by browser ── */
  pageviewFunnel: [
    { step: 'Landing page', chrome: 2450, firefox: 890, safari: 1120, edge: 340 },
    { step: 'Sign up page', chrome: 1230, firefox: 445, safari: 560, edge: 170 },
    { step: 'Onboarding',   chrome: 820,  firefox: 297, safari: 373, edge: 113 },
  ],

  /* ── Conversion funnel ── */
  conversionFunnel: [
    { step: 'Visited site',    count: 4800 },
    { step: 'Signed up',       count: 2405 },
    { step: 'Completed onboarding', count: 1603 },
    { step: 'First action',    count: 1124 },
    { step: 'Subscribed',      count: 678 },
  ],

  /* ── Legacy fields (kept for backward compat) ── */
  activeUsers: [
    { x: '1', y: 1200 }, { x: '2', y: 1320 }, { x: '3', y: 1410 },
    { x: '4', y: 1560 }, { x: '5', y: 1720 }, { x: '6', y: 1650 },
    { x: '7', y: 1820 }, { x: '8', y: 1990 },
  ],
  sessionDurationMins: [
    { label: '0-5m', value: 24 }, { label: '5-15m', value: 41 },
    { label: '15-30m', value: 28 }, { label: '30m+', value: 17 },
  ],
  heatmap: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hours: ['9', '11', '13', '15', '17', '19'],
    values: [
      [10, 16, 22, 28, 19, 14],
      [12, 18, 26, 32, 24, 18],
      [8, 14, 20, 25, 17, 12],
      [9, 17, 24, 30, 22, 16],
      [7, 13, 19, 27, 18, 11],
    ],
  },
}

export const usersRows: UserRow[] = [
  { id: 'usr_1', name: 'Mike Jordan', email: 'mike@northwind.ai', plan: 'Enterprise', activity: 'Last seen 2h ago' },
  { id: 'usr_2', name: 'Sara Kim', email: 'sara@aurora.ai', plan: 'Pro', activity: 'Last seen yesterday' },
  { id: 'usr_3', name: 'Alex Chen', email: 'alex@northwind.ai', plan: 'Free', activity: 'No activity 9d' },
  { id: 'usr_4', name: 'Priya Shah', email: 'priya@aurora.ai', plan: 'Enterprise', activity: 'API calls 1,240/day', suspended: false },
]

export type AdminSubRole = 'Admin' | 'Support' | 'Viewer'

export const userRoleMatrix = {
  users: [
    { id: 'usr_1', name: 'Mike Jordan', subRole: 'Admin' as AdminSubRole },
    { id: 'usr_2', name: 'Sara Kim', subRole: 'Support' as AdminSubRole },
    { id: 'usr_3', name: 'Alex Chen', subRole: 'Viewer' as AdminSubRole },
  ],
}

export type AdminRole = AdminSubRole

export const permissions = {
  columns: ['Admin', 'Support', 'Viewer'] as AdminRole[],
  rows: [
    { key: 'apIs', label: 'Manage APIs', values: [true, false, false] },
    { key: 'users', label: 'Manage Users', values: [true, false, false] },
    { key: 'revenue', label: 'View Revenue', values: [true, true, false] },
    { key: 'tickets', label: 'Manage Tickets', values: [true, true, false] },
    { key: 'issues', label: 'Resolve Issues', values: [true, true, false] },
    { key: 'audit', label: 'Audit Logs', values: [true, false, false] },
  ],
} satisfies {
  columns: AdminRole[]
  rows: { key: string; label: string; values: boolean[] }[]
}

export const globalMonitoring = {
  cpuPct: 62,
  memoryPct: 57,
  apiLoadPct: 44,
  errorRatePct: 0.8,
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR'
export type LogRow = {
  id: string
  timestampISO: string
  level: LogLevel
  source: string
  message: string
}

export const systemLogs: LogRow[] = Array.from({ length: 18 }).map((_, idx) => {
  const level: LogLevel = idx % 9 === 0 ? 'ERROR' : idx % 5 === 0 ? 'WARN' : 'INFO'
  const sources = ['edge-gateway', 'api-service', 'worker-queue', 'billing', 'auth']
  const source = sources[idx % sources.length]
  const messages = [
    'Cache warmed successfully',
    'Request latency p95 improved',
    'Background job processed',
    'Rate limit header updated',
    'Token refresh succeeded',
    'Retry policy applied for transient failure',
    'Webhook delivery succeeded',
    'Webhook delivery failed, will retry',
    'Disk usage warning on node',
  ]
  return {
    id: `log_${idx + 1}`,
    timestampISO: new Date(Date.now() - 1000 * 60 * (idx * 7 + 12)).toISOString(),
    level,
    source,
    message: messages[idx % messages.length],
  }
})

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT'
export type AuditRow = {
  id: string
  timestampISO: string
  actor: string
  action: AuditAction
  resource: string
  detail: string
}

export const auditLogs: AuditRow[] = Array.from({ length: 14 }).map((_, idx) => {
  const actions: AuditAction[] = ['CREATE', 'UPDATE', 'APPROVE', 'REJECT', 'DELETE']
  const action = actions[idx % actions.length]
  const actors = ['Priya', 'Dev', 'System Bot']
  const actor = actors[idx % actors.length]
  const resources = ['API policy', 'User role', 'Ticket workflow', 'Server config', 'Revenue rules']
  const resource = resources[idx % resources.length]
  const details = [
    'Changed rate limit policy',
    'Updated permissions matrix',
    'Approved pending admin request',
    'Disabled an API endpoint',
    'Adjusted revenue reporting window',
  ]
  return {
    id: `aud_${idx + 101}`,
    timestampISO: new Date(Date.now() - 1000 * 60 * (idx * 18 + 40)).toISOString(),
    actor,
    action,
    resource,
    detail: details[idx % details.length],
  }
})

