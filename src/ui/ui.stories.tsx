import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, Button, Card, Field, Segmented, Switch } from '.'
import { Icon } from './Icon'
import { Tile } from './Tile'
import { InstallationCard } from './InstallationCard'
import { BarChartView, LineChartView } from './Charts'
import { energySeriesWeek, installations, temperatureSeriesDay } from '../data/mock'

const meta: Meta = { title: 'UI/Components' }
export default meta
type Story = StoryObj

export const Buttons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
      <Button size="sm"><Icon name="star" size={16} /> Small</Button>
    </div>
  ),
}

export const Inputs: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Field label="Email" placeholder="you@example.com" />
      <Field label="Password" type="password" hint="At least 8 characters" />
      <Field label="With error" defaultValue="oops" error="Something is wrong" />
    </div>
  ),
}

export const Badges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="ok">Online</Badge>
      <Badge tone="warn">Weak signal</Badge>
      <Badge tone="danger">Alarm</Badge>
      <Badge tone="info">Info</Badge>
      <Badge>Standby</Badge>
    </div>
  ),
}

export const Controls: Story = {
  render: function Render() {
    const [on, setOn] = useState(true)
    const [v, setV] = useState('a')
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Switch checked={on} onChange={setOn} label="Demo" />
        <Segmented value={v} onChange={setV} options={[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]} />
      </div>
    )
  },
}

export const Tiles: Story = {
  render: () => (
    <div className="tiles">
      <Tile icon="thermo" label="Outdoor temp." value="-2.4 °C" />
      <Tile icon="filterAir" label="Filter wear" value={52} unit="%" progress={52} tone="warn" />
      <Tile icon="power" label="Unit status" value="Running" tone="ok" />
      <Tile icon="alert" label="Active alarms" value={2} tone="danger" />
    </div>
  ),
}

export const InstallationCards: Story = {
  render: function Render() {
    const [fav, setFav] = useState(true)
    return (
      <div className="inst-grid">
        <InstallationCard installation={installations[0]} favorite={fav} onToggleFavorite={() => setFav((f) => !f)} onSelect={() => {}} />
        <InstallationCard installation={installations[3]} favorite={false} onToggleFavorite={() => {}} onSelect={() => {}} />
        <InstallationCard installation={installations[6]} favorite={false} onToggleFavorite={() => {}} onSelect={() => {}} />
      </div>
    )
  },
}

export const Charts: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <Card>
        <LineChartView data={temperatureSeriesDay} series={[{ key: 'supply', name: 'Supply', color: 'var(--chart-1)' }, { key: 'outdoor', name: 'Outdoor', color: 'var(--chart-2)' }]} />
      </Card>
      <Card>
        <BarChartView data={energySeriesWeek} series={[{ key: 'energy', name: 'Used', color: 'var(--chart-1)' }, { key: 'recovered', name: 'Recovered', color: 'var(--chart-2)' }]} />
      </Card>
    </div>
  ),
}
