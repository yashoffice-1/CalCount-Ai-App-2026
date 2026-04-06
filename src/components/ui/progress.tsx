import { cn } from '@/lib/utils'

export function Progress({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-3 w-full rounded-full border border-[hsl(var(--border))] bg-white/60 dark:bg-black/20', className)}>
      <div
        className="h-full rounded-full bg-[hsl(var(--accent))] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

