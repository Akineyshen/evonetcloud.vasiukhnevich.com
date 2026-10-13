import { useId } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface Series {
  key: string
  name: string
  color: string
}

const axis = { stroke: 'var(--text-muted)', fontSize: 12, tickLine: false, axisLine: false } as const
const tooltipStyle = {
  background: 'var(--surface-solid)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text)',
  boxShadow: 'var(--shadow-lg)',
}

interface Props {
  data: Record<string, string | number>[]
  series: Series[]
  height?: number | `${number}%`
  legend?: boolean
  unit?: string
}

/** Smooth lines with a soft gradient under each one. */
export function LineChartView({ data, series, height = 220, legend = true, unit }: Props) {
  const uid = useId().replace(/:/g, '')
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 6" vertical={false} />
        <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis {...axis} unit={unit} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--border)' }} />
        {legend && <Legend iconType="circle" iconSize={8} />}
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2.4}
            fill={`url(#${uid}-${s.key})`}
            type="monotone"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface-solid)' }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarChartView({ data, series, height = 220, legend = true, unit }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barGap={4}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 6" vertical={false} />
        <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={16} />
        <YAxis {...axis} unit={unit} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface-2)', radius: 8 }} />
        {legend && <Legend iconType="circle" iconSize={8} />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[8, 8, 3, 3]} maxBarSize={30} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
