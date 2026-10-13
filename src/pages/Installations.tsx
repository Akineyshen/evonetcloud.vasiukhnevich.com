import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../state/AppContext'
import { installations, type Connection, type InstState } from '../data/mock'
import { Button, Empty, PageTitle, Select } from '../ui'
import { Icon } from '../ui/Icon'
import { InstallationCard } from '../ui/InstallationCard'

export function InstallationsPage() {
  const { t, favorites, toggleFavorite } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [state, setState] = useState<InstState | ''>('')
  const [conn, setConn] = useState<Connection | ''>('')
  const [onlyFav, setOnlyFav] = useState(false)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return installations
      .filter((i) => !q || [i.name, i.serial, i.address].some((v) => v.toLowerCase().includes(q)))
      .filter((i) => !state || i.state === state)
      .filter((i) => !conn || i.connection === conn)
      .filter((i) => !onlyFav || favorites.includes(i.id))
      // Favorites first; stable sort keeps the original order inside each group.
      .sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)))
  }, [query, state, conn, onlyFav, favorites])

  const hasFilters = query || state || conn || onlyFav
  const reset = () => { setQuery(''); setState(''); setConn(''); setOnlyFav(false) }

  return (
    <>
      <PageTitle title={t('installations')} />
      <div className="filters">
        <div className="search">
          <Icon name="search" size={18} />
          <input className="input" placeholder={t('search_installations')} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t('search')} />
        </div>
        <Select aria-label={t('status')} value={state} onChange={(e) => setState(e.target.value as InstState | '')}>
          <option value="">{t('status')}: {t('all')}</option>
          <option value="running">{t('state_running')}</option>
          <option value="standby">{t('state_standby')}</option>
          <option value="alarm">{t('state_alarm')}</option>
        </Select>
        <Select aria-label={t('connection')} value={conn} onChange={(e) => setConn(e.target.value as Connection | '')}>
          <option value="">{t('connection')}: {t('all')}</option>
          <option value="online">{t('conn_online')}</option>
          <option value="weak">{t('conn_weak')}</option>
          <option value="offline">{t('conn_offline')}</option>
        </Select>
        <Button variant={onlyFav ? 'primary' : 'secondary'} onClick={() => setOnlyFav((v) => !v)} aria-pressed={onlyFav}>
          <Icon name="star" size={18} filled={onlyFav} /> {t('favorites')}
        </Button>
        {hasFilters && <Button variant="ghost" onClick={reset}>{t('reset')}</Button>}
      </div>

      {list.length === 0 ? (
        <Empty>{t('nothing_found')}</Empty>
      ) : (
        <div className="inst-grid">
          {list.map((i) => (
            <InstallationCard
              key={i.id}
              installation={i}
              favorite={favorites.includes(i.id)}
              onToggleFavorite={() => toggleFavorite(i.id)}
              onSelect={() => navigate(`/i/${i.id}`)}
            />
          ))}
        </div>
      )}
    </>
  )
}
