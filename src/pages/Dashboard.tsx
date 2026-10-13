import { useOutletContext } from 'react-router'
import { useApp } from '../state/AppContext'
import { deviceData as d, energySeriesWeek, temperatureSeriesDay, type Installation } from '../data/mock'
import { Badge } from '../ui'
import { Tile } from '../ui/Tile'
import { BarChartView, LineChartView } from '../ui/Charts'
import { connTone, stateTone } from '../ui/InstallationCard'

export function DashboardPage() {
  const { t, temp } = useApp()
  const inst = useOutletContext<Installation>()

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{inst.name}</h1>
          <p className="muted">{inst.serial} · ecoVENT MINI OEM 3.4</p>
        </div>
        <div className="page-title__actions">
          <Badge tone={stateTone[inst.state]}>{t(`state_${inst.state}`)}</Badge>
          <Badge tone={connTone[inst.connection]}>{t(`conn_${inst.connection}`)}</Badge>
        </div>
      </div>

      <div className="tiles">
        <Tile icon="power" label={t('tile_status')} value={t('tile_running')} tone="ok" />
        <Tile icon="settings" label={t('tile_mode')} value="Auto" />
        <Tile icon="thermo" label={t('tile_outdoor')} value={temp(d.outdoor)} />
        <Tile icon="thermo" label={t('tile_supply')} value={temp(d.supply)} />
        <Tile icon="filterAir" label={t('tile_filter')} value={d.filterExtract} unit="%" progress={d.filterExtract} tone={d.filterExtract > 50 ? 'warn' : 'ok'} />
        <Tile icon="wind" label={t('tile_airflow')} value={d.airflowSupply} unit="m³/h" />
        <Tile icon="bypass" label={t('tile_bypass')} value={t('tile_off')} />
        <Tile icon="alert" label={t('tile_alarms')} value={2} tone="danger" />
        <Tile wide icon="chart" label={t('tile_temp_chart')}>
          <LineChartView
            data={temperatureSeriesDay}
            height={190}
            series={[
              { key: 'supply', name: t('tile_supply'), color: 'var(--chart-1)' },
              { key: 'outdoor', name: t('tile_outdoor'), color: 'var(--chart-2)' },
            ]}
          />
        </Tile>
        <Tile wide icon="bolt" label={t('tile_energy_chart')} value={d.energyToday} unit="kWh">
          <BarChartView
            data={energySeriesWeek}
            height={150}
            legend={false}
            series={[{ key: 'energy', name: 'kWh', color: 'var(--chart-1)' }]}
          />
        </Tile>
      </div>
    </>
  )
}
