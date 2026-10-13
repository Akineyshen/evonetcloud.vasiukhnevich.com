import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, Button, Card, Field, Segmented, Switch } from '.'
import { Icon } from './Icon'
import { Tile } from './Tile'
import { InstallationCard } from './InstallationCard'
import { BarChartView, LineChartView } from './Charts'
import { energySeriesWeek, installations, temperatureSeriesDay } from '../data/mock'
import { useApp } from '../state/AppContext'

// Labels come from the dictionary so the Storybook language switcher affects every story.
const meta: Meta = { title: 'UI/Components' }
export default meta
type Story = StoryObj

function ButtonsDemo() {
  const { t } = useApp()
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button>{t('save')}</Button>
      <Button variant="secondary">{t('open')}</Button>
      <Button variant="ghost">{t('cancel')}</Button>
      <Button variant="danger">{t('delete_account')}</Button>
      <Button disabled>{t('select')}</Button>
      <Button size="sm"><Icon name="star" size={16} /> {t('favorites')}</Button>
    </div>
  )
}
export const Buttons: Story = { render: () => <ButtonsDemo /> }

function InputsDemo() {
  const { t } = useApp()
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Field label={t('email')} placeholder="you@example.com" />
      <Field label={t('password')} type="password" hint={t('err_password_len')} />
      <Field label={t('repeat_password')} defaultValue="oops" error={t('err_password_match')} />
    </div>
  )
}
export const Inputs: Story = { render: () => <InputsDemo /> }

function BadgesDemo() {
  const { t } = useApp()
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="ok">{t('conn_online')}</Badge>
      <Badge tone="warn">{t('conn_weak')}</Badge>
      <Badge tone="danger">{t('state_alarm')}</Badge>
      <Badge tone="info">{t('sev_info')}</Badge>
      <Badge>{t('state_standby')}</Badge>
    </div>
  )
}
export const Badges: Story = { render: () => <BadgesDemo /> }

function ControlsDemo() {
  const { t } = useApp()
  const [on, setOn] = useState(true)
  const [v, setV] = useState('light')
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch checked={on} onChange={setOn} label={t('p_power')} />
      <Segmented
        value={v}
        onChange={setV}
        options={[{ value: 'light', label: t('theme_light') }, { value: 'dark', label: t('theme_dark') }]}
      />
    </div>
  )
}
export const Controls: Story = { render: () => <ControlsDemo /> }

function TilesDemo() {
  const { t, temp } = useApp()
  return (
    <div className="tiles">
      <Tile icon="thermo" label={t('tile_outdoor')} value={temp(-2.4)} />
      <Tile icon="filterAir" label={t('tile_filter')} value={52} unit="%" progress={52} tone="warn" />
      <Tile icon="power" label={t('tile_status')} value={t('tile_running')} tone="ok" />
      <Tile icon="alert" label={t('tile_alarms')} value={2} tone="danger" />
    </div>
  )
}
export const Tiles: Story = { render: () => <TilesDemo /> }

function InstallationCardsDemo() {
  const [fav, setFav] = useState(true)
  return (
    <div className="inst-grid">
      <InstallationCard installation={installations[0]} favorite={fav} onToggleFavorite={() => setFav((f) => !f)} onSelect={() => {}} />
      <InstallationCard installation={installations[3]} favorite={false} onToggleFavorite={() => {}} onSelect={() => {}} />
      <InstallationCard installation={installations[6]} favorite={false} onToggleFavorite={() => {}} onSelect={() => {}} />
    </div>
  )
}
export const InstallationCards: Story = { render: () => <InstallationCardsDemo /> }

function ChartsDemo() {
  const { t } = useApp()
  return (
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <Card>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{t('tile_temp_chart')}</h2>
        <LineChartView
          data={temperatureSeriesDay}
          series={[
            { key: 'supply', name: t('tile_supply'), color: 'var(--chart-1)' },
            { key: 'outdoor', name: t('tile_outdoor'), color: 'var(--chart-2)' },
          ]}
        />
      </Card>
      <Card>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{t('tile_energy_chart')}</h2>
        <BarChartView
          data={energySeriesWeek}
          series={[
            { key: 'energy', name: t('energy_used'), color: 'var(--chart-1)' },
            { key: 'recovered', name: t('energy_recovered'), color: 'var(--chart-2)' },
          ]}
        />
      </Card>
    </div>
  )
}
export const Charts: Story = { render: () => <ChartsDemo /> }
