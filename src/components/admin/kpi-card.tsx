import { Card } from '@/components/ui/card'

export function KpiCard({
  label,
  value,
  tone = 'accent',
  subtitle,
}: {
  label: string
  value: string
  tone?: 'accent' | 'success' | 'warning' | 'danger'
  subtitle?: string
}) {
  const toneStyle =
    tone === 'success'
      ? 'from-emerald-500/25 to-emerald-500/7'
      : tone === 'warning'
        ? 'from-amber-500/25 to-amber-500/7'
        : tone === 'danger'
          ? 'from-red-500/25 to-red-500/7'
          : 'from-[hsl(var(--accent))]/25 to-[hsl(var(--accent))]/7'

  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className={`h-1 w-full bg-gradient-to-r ${toneStyle}`} />
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <div className="text-xs font-medium text-[hsl(var(--muted))]">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-[hsl(var(--muted))]">{subtitle}</div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

