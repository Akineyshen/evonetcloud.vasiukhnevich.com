import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface Series {
  key: string
  name: string
  color: string
}

const axis = { stroke: 'var(--text-muted)', fontSize: 12, tickLine: false, axisLine: false } as const
const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  boxShadow: 'var(--shadow)',
}

interface Props {
  data: Record<string, string | number>[]
  series: Series[]
  height?: number | `${number}%`
  legend?: boolean
  unit?: string
}

export function LineChartView({ data, series, height = 220, legend = true, unit }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis {...axis} unit={unit} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--border)' }} />
        {legend && <Legend iconType="plainline" />}
        {series.map((s) => (
          <Line key={s.key} dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.2} dot={false} type="monotone" />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BarChartView({ data, series, height = 220, legend = true, unit }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={16} />
        <YAxis {...axis} unit={unit} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface-2)' }} />
        {legend && <Legend iconType="circle" />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={32} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
