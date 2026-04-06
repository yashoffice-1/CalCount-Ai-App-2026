import type { ReactNode } from 'react'

import { PanelRouteLayout } from '@/components/layout/panel-route-layout'

export default function SuperLayout({ children }: { children: ReactNode }) {
  return <PanelRouteLayout panel="super">{children}</PanelRouteLayout>
}
