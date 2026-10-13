import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext'
import { paramGroups, params as initialParams, type Param, type ParamGroup } from '../data/mock'
import { PageTitle, Select, Switch, Card, Empty } from '../ui'
import { Icon } from '../ui/Icon'

function Control({ param, onChange }: { param: Param; onChange: (v: boolean | number | string) => void }) {
  const { t } = useApp()
  const c = param.control
  switch (c.kind) {
    case 'switch':
      return <Switch checked={c.value} onChange={onChange} label={t(param.label)} />
    case 'number':
      return (
        <span className="param__number">
          <input
            className="input"
            type="number"
            min={c.min}
            max={c.max}
            value={c.value}
            aria-label={t(param.label)}
            onChange={(e) => onChange(Math.min(c.max, Math.max(c.min, Number(e.target.value))))}
          />
          <span>{c.unit}</span>
        </span>
      )
    case 'select':
      return (
        <Select aria-label={t(param.label)} value={c.value} onChange={(e) => onChange(e.target.value)}>
          {c.options.map((o) => <option key={o}>{o}</option>)}
        </Select>
      )
    case 'readonly':
      return <span className="muted">{c.value}</span>
  }
}

export function ParametersPage() {
  const { t } = useApp()
  const [items, setItems] = useState(initialParams)
  const [group, setGroup] = useState<ParamGroup | 'all'>('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((p) => (group === 'all' || p.group === group) && (!q || t(p.label).toLowerCase().includes(q)))
  }, [items, group, query, t])

  const update = (id: string, value: boolean | number | string) =>
    setItems((list) => list.map((p) => (p.id === id ? ({ ...p, control: { ...p.control, value } } as Param) : p)))

  return (
    <>
      <PageTitle title={t('nav_parameters')} />
      <div className="params-layout">
        <nav className="params-menu" aria-label={t('settings_menu')}>
          <button className={group === 'all' ? 'is-active' : ''} onClick={() => setGroup('all')}>{t('all')}</button>
          {paramGroups.map((g) => (
            <button key={g} className={group === g ? 'is-active' : ''} onClick={() => setGroup(g)}>{t(`group_${g}`)}</button>
          ))}
        </nav>
        <div>
          <div className="search" style={{ marginBottom: 16 }}>
            <Icon name="search" size={18} />
            <input className="input" placeholder={t('search_params')} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t('search')} />
          </div>
          <Card className="params-list">
            {visible.length === 0 && <Empty>{t('nothing_found')}</Empty>}
            {visible.map((p) => (
              <div className="param" key={p.id}>
                <div>
                  <div className="param__label">{t(p.label)}</div>
                  <div className="param__group">{t(`group_${p.group}`)}</div>
                </div>
                <Control param={p} onChange={(v) => update(p.id, v)} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  )
}
