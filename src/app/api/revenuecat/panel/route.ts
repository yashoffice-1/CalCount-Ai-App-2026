import { NextResponse } from 'next/server'

import { DEMO_PANEL } from '@/lib/revenuecat/demo-panel'
import { fetchRevenuePanel } from '@/lib/revenuecat/build-panel'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sandbox = searchParams.get('sandbox') === '1'

  const apiKey = process.env.REVENUECAT_API_KEY
  const projectId = process.env.REVENUECAT_PROJECT_ID
  const projectLabel = process.env.REVENUECAT_PROJECT_NAME ?? 'CalCount AI'

  if (!apiKey || !projectId) {
    return NextResponse.json({
      ...DEMO_PANEL,
      environment: sandbox ? 'sandbox' : 'production',
      projectLabel,
      apiMessage:
        'Demo data — add REVENUECAT_API_KEY and REVENUECAT_PROJECT_ID to .env.local. See RevenueCat REST API v2: https://docs.revenuecat.com/docs/api-v2',
    })
  }

  const { payload, status } = await fetchRevenuePanel({
    apiKey,
    projectId,
    sandbox,
    projectLabel,
  })

  return NextResponse.json(payload, { status: status >= 400 ? status : 200 })
}
