'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeading } from '@/components/common/page-heading'
import { Button } from '@/components/ui/button'

export function SystemControlPage() {
  const [access, setAccess] = React.useState({
    apis: true,
    users: true,
    revenue: true,
    tickets: true,
  })
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)

  return (
    <div className="space-y-6">
      <PageHeading
        title="System Control"
        subtitle="Super Admin full access switches and operational controls."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Access controls</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">
              Enable/disable console modules (dummy UI).
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                ['APIs', 'apis', 'API configuration & keys'],
                ['Users', 'users', 'Admin/tenant user management'],
                ['Revenue', 'revenue', 'Billing, conversions and exports'],
                ['Tickets', 'tickets', 'Support workflow and notifications'],
              ] as const
            ).map(([label, key, desc]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-4"
              >
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-[hsl(var(--muted))]">{desc}</div>
                </div>
                <Switch
                  checked={(access as any)[key]}
                  onCheckedChange={(v) => setAccess((prev) => ({ ...prev, [key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Maintenance mode</CardTitle>
            <div className="text-xs text-[hsl(var(--muted))]">Disable writes system-wide.</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[hsl(var(--border))] bg-white/50 dark:bg-black/20 p-4">
              <div>
                <div className="text-sm font-semibold">{maintenanceMode ? 'Enabled' : 'Disabled'}</div>
                <div className="text-xs text-[hsl(var(--muted))]">Dummy flag for UI preview</div>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={(v) => setMaintenanceMode(v)}
              />
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                toast.message('System control saved', { description: 'Dummy action completed.' })
              }}
            >
              Save changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

