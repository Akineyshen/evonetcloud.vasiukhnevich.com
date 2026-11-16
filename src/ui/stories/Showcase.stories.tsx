import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useApp } from '../../state/AppContext'
import { Badge, Button, Card, Field, Segmented, Switch } from '..'
import { Icon } from '../Icon'
import { Tile } from '../Tile'
import { InstallationCard } from '../InstallationCard'
import { BarChartView, LineChartView } from '../Charts'
import { deviceData as d, energySeriesWeek, installations, temperatureSeriesDay } from '../../data/mock'

/**
 * One screen of real components for brand presentations: open the "Brand builder" panel
 * below the canvas and change color, font, radius and surfaces while the client watches.
 */
const meta = {
  title: 'Presentation/Brand showcase',
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Showcase() {
  const { t, temp } = useApp()
  const [range, setRange] = useState<'day' | 'week'>('day')
  const [auto, setAuto] = useState(true)
  const [favs, setFavs] = useState<string[]>(['inst-1'])

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1180, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span className="logo">
          <span className="logo__mark"><Icon name="wind" size={22} /></span>
          Brand preview
        </span>
        <span className="nav-pill">
          <a className="active">{t('nav_dashboard')}</a>
          <a>{t('nav_charts')}</a>
        </span>
      </header>

      <section>
        <h1 style={{ fontSize: 40, fontWeight: 'var(--heading-weight)' as never, margin: '0 0 8px', lineHeight: 1.1 }}>{t('hero_title')}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 16 }}>{t('hero_sub')}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <Button>{t('save')}</Button>
          <Button variant="secondary">{t('cancel')}</Button>
          <Button variant="ghost">{t('nav_charts')}</Button>
          <Badge tone="ok">{t('conn_online')}</Badge>
          <Badge tone="warn">Warning</Badge>
          <Badge tone="danger">Alarm</Badge>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Tile icon="thermo" label={t('tile_supply')} value={temp(d.supply)} />
        <Tile icon="thermo" label={t('tile_outdoor')} value={temp(d.outdoor)} />
        <Tile icon="wind" label="Airflow" value={String(d.airflowSupply)} unit="m³/h" />
        <Tile icon="chart" label="Energy today" value={String(d.energyToday)} unit="kWh" />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
            <strong>{t('tile_temp_chart')}</strong>
            <Segmented value={range} onChange={setRange} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
          </div>
          {range === 'day' ? (
            <LineChartView
              data={temperatureSeriesDay}
              height={200}
              series={[
                { key: 'supply', name: t('tile_supply'), color: 'var(--chart-1)' },
                { key: 'outdoor', name: t('tile_outdoor'), color: 'var(--chart-2)' },
              ]}
            />
          ) : (
            <BarChartView
              data={energySeriesWeek}
              height={200}
              series={[
                { key: 'energy', name: 'Energy', color: 'var(--chart-1)' },
                { key: 'recovered', name: 'Recovered', color: 'var(--chart-2)' },
              ]}
            />
          )}
        </Card>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <strong>{t('brand_settings')}</strong>
            <Field label={t('email')} placeholder="you@example.com" />
            <Field label="Password" type="password" defaultValue="secret" />
            <Switch checked={auto} onChange={setAuto} label="Automatic mode" />
            <div style={{ display: 'flex', gap: 10 }}>
              <Button>{t('save')}</Button>
              <Button variant="secondary">{t('cancel')}</Button>
            </div>
          </div>
        </Card>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {installations.slice(0, 3).map((inst) => (
          <InstallationCard
            key={inst.id}
            installation={inst}
            favorite={favs.includes(inst.id)}
            onToggleFavorite={() => setFavs((f) => (f.includes(inst.id) ? f.filter((x) => x !== inst.id) : [...f, inst.id]))}
            onSelect={() => {}}
          />
        ))}
      </section>
    </div>
  )
}

export const BrandShowcase: Story = { name: 'Brand showcase', render: () => <Showcase /> }
