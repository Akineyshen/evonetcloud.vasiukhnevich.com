import { useState, type ReactNode } from 'react'
import { useApp } from '../state/AppContext'
import { energySeriesMonth, energySeriesWeek, temperatureSeriesDay, temperatureSeriesMonth } from '../data/mock'
import { Card, PageTitle, Segmented } from '../ui'
import { BarChartView, LineChartView } from '../ui/Charts'

type View = 'both' | 'line' | 'bar'
type Range = 'day' | 'month'

function ChartCard({ title, full, children }: { title: string; full: boolean; children: (height: number | `${number}%`) => ReactNode }) {
  return (
    <Card className={`chart-card ${full ? 'chart-card--full' : ''}`}>
      <h2>{title}</h2>
      <div className="chart-card__body">{children(full ? '100%' : 300)}</div>
    </Card>
  )
}

export function ChartsPage() {
  const { t } = useApp()
  const [view, setView] = useState<View>('both')
  const [range, setRange] = useState<Range>('day')

  const lineData = range === 'day' ? temperatureSeriesDay : temperatureSeriesMonth
  const barData = range === 'day' ? energySeriesWeek : energySeriesMonth
  const full = view !== 'both'

  return (
    <div className={`charts-page ${full ? 'charts-page--full' : ''}`}>
      <PageTitle
        title={t('nav_charts')}
        actions={
          <>
            <Segmented
              value={range}
              onChange={setRange}
              options={[{ value: 'day', label: t('range_day') }, { value: 'month', label: t('range_month') }]}
            />
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'both', label: t('view_both') },
                { value: 'line', label: t('view_line') },
                { value: 'bar', label: t('view_bar') },
              ]}
            />
          </>
        }
      />
      <div className="charts-grid">
        {view !== 'bar' && (
          <ChartCard title={t('tile_temp_chart')} full={full}>
            {(h) => (
              <LineChartView
                data={lineData}
                height={h}
                unit="°"
                series={[
                  { key: 'supply', name: t('tile_supply'), color: 'var(--chart-1)' },
                  { key: 'extract', name: t('tile_extract'), color: 'var(--ok)' },
                  { key: 'outdoor', name: t('tile_outdoor'), color: 'var(--chart-2)' },
                ]}
              />
            )}
          </ChartCard>
        )}
        {view !== 'line' && (
          <ChartCard title={t('tile_energy_chart')} full={full}>
            {(h) => (
              <BarChartView
                data={barData}
                height={h}
                series={[
                  { key: 'energy', name: t('energy_used'), color: 'var(--chart-1)' },
                  { key: 'recovered', name: t('energy_recovered'), color: 'var(--chart-2)' },
                ]}
              />
            )}
          </ChartCard>
        )}
      </div>
    </div>
  )
}
