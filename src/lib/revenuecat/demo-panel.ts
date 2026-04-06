import {
  revenueCatOverviewKpis,
  revenueCatDailySeries,
  revenueCatRecentTransactions,
} from '@/data/revenuecat'

/** Serializable payload for the Revenue panel API when keys are not configured. */
export const DEMO_PANEL = {
  kpis: revenueCatOverviewKpis,
  chart: revenueCatDailySeries,
  transactions: revenueCatRecentTransactions,
}
