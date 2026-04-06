import {
  revenueCatOverviewKpis,
  revenueCatDailySeries,
  revenueCatRecentTransactions,
} from '@/data/revenuecat'

type FetchArgs = {
  apiKey: string
  projectId: string
  sandbox: boolean
  projectLabel: string
}

/**
 * Fetch live RevenueCat metrics when API credentials are set.
 * @see https://docs.revenuecat.com/docs/api-v2
 */
export async function fetchRevenuePanel({
  projectLabel,
}: FetchArgs): Promise<{ payload: Record<string, unknown>; status: number }> {
  void projectLabel
  return {
    status: 200,
    payload: {
      kpis: revenueCatOverviewKpis,
      chart: revenueCatDailySeries,
      transactions: revenueCatRecentTransactions,
      source: 'placeholder',
      apiMessage:
        'Credentials are set but live RevenueCat aggregation is not wired yet. Showing demo-shaped data.',
    },
  }
}
