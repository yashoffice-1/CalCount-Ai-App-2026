/**
 * Dashboard mock data in the shape of RevenueCat-style metrics & transactions.
 * For production, replace fetches with the RevenueCat API:
 * @see https://www.revenuecat.com/docs — project metrics, charts, customer / transaction exports
 */

export type RevenueTxnType = 'TRIAL' | 'NEW SUB' | 'RENEWAL'

export type RevenueOverviewKpi = {
  id: string
  label: string
  value: number
  valueIsCurrency?: boolean
  subtitle: string
  sparkline: number[]
  /** Tailwind-friendly stroke color for sparkline */
  accent: string
  showSparkline: boolean
}

export type RevenueTransactionRow = {
  id: string
  customerId: string
  country: string
  store: string
  product: string
  purchasedLabel: string
  expiresLabel: string
  revenueDisplay: string
  type: RevenueTxnType
}

/** Overview-style KPIs (similar to RevenueCat Overview). */
export const revenueCatOverviewKpis: RevenueOverviewKpi[] = [
  {
    id: 'trials',
    label: 'Active Trials',
    value: 1019,
    subtitle: 'In total',
    sparkline: [820, 880, 910, 890, 940, 980, 1019],
    accent: '#ea580c',
    showSparkline: true,
  },
  {
    id: 'subs',
    label: 'Active Subscriptions',
    value: 4922,
    subtitle: 'In total',
    sparkline: [4100, 4300, 4450, 4600, 4750, 4880, 4922],
    accent: '#16a34a',
    showSparkline: true,
  },
  {
    id: 'mrr',
    label: 'MRR',
    value: 20461,
    valueIsCurrency: true,
    subtitle: 'Monthly Recurring Revenue',
    sparkline: [],
    accent: '#2563eb',
    showSparkline: false,
  },
  {
    id: 'revenue28',
    label: 'Revenue',
    value: 68470,
    valueIsCurrency: true,
    subtitle: 'Last 28 days',
    sparkline: [42000, 45000, 51000, 48000, 52000, 61000, 68470],
    accent: '#16a34a',
    showSparkline: true,
  },
  {
    id: 'new_cust',
    label: 'New Customers',
    value: 32065,
    subtitle: 'Last 28 days',
    sparkline: [28000, 29000, 30000, 30500, 31200, 31800, 32065],
    accent: '#2563eb',
    showSparkline: true,
  },
  {
    id: 'active_cust',
    label: 'Active Customers',
    value: 58476,
    subtitle: 'Last 28 days',
    sparkline: [56000, 56500, 57200, 57800, 58000, 58200, 58476],
    accent: '#2563eb',
    showSparkline: true,
  },
]

/** Daily revenue series for the main chart (last ~12 points). */
export const revenueCatDailySeries: { x: string; y: number }[] = [
  { x: 'Apr 01', y: 2100 },
  { x: 'Apr 04', y: 2320 },
  { x: 'Apr 08', y: 1980 },
  { x: 'Apr 12', y: 2650 },
  { x: 'Apr 16', y: 2410 },
  { x: 'Apr 20', y: 2890 },
  { x: 'Apr 24', y: 3120 },
  { x: 'Apr 28', y: 2980 },
  { x: 'May 01', y: 3350 },
  { x: 'May 04', y: 3180 },
  { x: 'May 08', y: 3640 },
  { x: 'May 12', y: 3420 },
]

export const revenueCatRecentTransactions: RevenueTransactionRow[] = [
  {
    id: 'txn_1',
    customerId: '4xwYhujhzsM1k2…',
    country: 'US',
    store: 'App Store',
    product: 'Yearly',
    purchasedLabel: '11 minutes ago',
    expiresLabel: 'in 364 days',
    revenueDisplay: '$38.36',
    type: 'NEW SUB',
  },
  {
    id: 'txn_2',
    customerId: 'LHntJHEfXyMq…',
    country: 'IL',
    store: 'App Store',
    product: 'monthly',
    purchasedLabel: '2 hours ago',
    expiresLabel: 'in 28 days',
    revenueDisplay: '—',
    type: 'TRIAL',
  },
  {
    id: 'txn_3',
    customerId: 'pQ9mK2vLxRn…',
    country: 'DE',
    store: 'Play Store',
    product: 'Yearly',
    purchasedLabel: 'Yesterday',
    expiresLabel: 'in 340 days',
    revenueDisplay: '$39.99',
    type: 'RENEWAL',
  },
  {
    id: 'txn_4',
    customerId: 'aB3cD4eF5gH6…',
    country: 'GB',
    store: 'App Store',
    product: 'monthly',
    purchasedLabel: '3 days ago',
    expiresLabel: 'in 25 days',
    revenueDisplay: '$4.99',
    type: 'RENEWAL',
  },
  {
    id: 'txn_5',
    customerId: 'Zk8jY7wQ6vU5…',
    country: 'JP',
    store: 'App Store',
    product: 'Yearly',
    purchasedLabel: '5 days ago',
    expiresLabel: 'in 360 days',
    revenueDisplay: '—',
    type: 'TRIAL',
  },
]
