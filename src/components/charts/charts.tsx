'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'

export function LineChartCard({
  data,
  xKey,
  yKey,
  height = 220,
  color = 'hsl(var(--accent))',
}: {
  data: any[]
  xKey: string
  yKey: string
  height?: number
  color?: string
}) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChartCard({
  data,
  xKey,
  yKey,
  height = 220,
  color = 'hsl(var(--accent))',
}: {
  data: any[]
  xKey: string
  yKey: string
  height?: number
  color?: string
}) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={yKey} fill={color} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChartCard({
  data,
  valueKey = 'value',
  labelKey = 'label',
  height = 240,
}: {
  data: any[]
  valueKey?: string
  labelKey?: string
  height?: number
}) {
  const colors = ['hsl(var(--accent))', 'hsl(var(--muted))']
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={labelKey}
            innerRadius="55%"
            outerRadius="78%"
            stroke="rgba(0,0,0,0)"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

