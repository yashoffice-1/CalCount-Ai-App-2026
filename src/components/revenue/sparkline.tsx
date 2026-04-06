'use client'

type SparklineProps = {
  points: number[]
  color: string
  className?: string
}

export function Sparkline({ points, color, className }: SparklineProps) {
  if (points.length < 2) return <div className={`h-8 ${className ?? ''}`} />

  const w = 128
  const h = 36
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / range) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden
    >
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
