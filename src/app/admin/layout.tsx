import type { ReactNode } from 'react'

import { PanelRouteLayout } from '@/components/layout/panel-route-layout'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <PanelRouteLayout panel="admin">{children}</PanelRouteLayout>
}
