import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarChartView, LineChartView } from '../Charts'
import { Card } from '..'
import { energySeriesMonth, energySeriesWeek, temperatureSeriesDay, temperatureSeriesMonth } from '../../data/mock'

const temp = [
  { key: 'supply', name: 'Supply', color: 'var(--chart-1)' },
  { key: 'outdoor', name: 'Outdoor', color: 'var(--chart-2)' },
]
const energy = [
  { key: 'energy', name: 'Used', color: 'var(--chart-1)' },
  { key: 'recovered', name: 'Recovered', color: 'var(--chart-2)' },
]

const meta = {
  title: 'Data/Charts',
  component: LineChartView,
  tags: ['autodocs'],
  args: { legend: true, height: 280, data: temperatureSeriesDay, series: temp },
  argTypes: {
    legend: { control: 'boolean' },
    height: { control: { type: 'range', min: 120, max: 500, step: 10 } },
    data: { control: false },
    series: { control: false },
  },
  decorators: [(Story) => <Card><Story /></Card>],
} satisfies Meta<typeof LineChartView>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {}
export const LineMonth: Story = { args: {
  data: temperatureSeriesMonth,
  legend: false,
  unit: ""
} }
export const Bar: Story = { render: (a) => <BarChartView {...a} data={energySeriesWeek} series={energy} /> }
export const BarMonth: Story = { render: (a) => <BarChartView {...a} data={energySeriesMonth} series={energy} /> }
