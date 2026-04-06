import { Badge } from '@/components/ui/badge'

export function StatusBadge({
  label,
  tone,
}: {
  label: string
  tone: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}) {
  return <Badge variant={tone}>{label}</Badge>
}

