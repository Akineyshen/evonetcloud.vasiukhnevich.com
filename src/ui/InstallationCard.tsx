import { useApp } from '../state/AppContext'
import type { Connection, InstState, Installation } from '../data/mock'
import { Badge, Button, type Tone } from '.'
import { Icon } from './Icon'

export const stateTone: Record<InstState, Tone> = { running: 'ok', standby: 'neutral', alarm: 'danger' }
export const connTone: Record<Connection, Tone> = { online: 'ok', weak: 'warn', offline: 'danger' }

export function InstallationCard({
  installation,
  favorite,
  onToggleFavorite,
  onSelect,
}: {
  installation: Installation
  favorite: boolean
  onToggleFavorite: () => void
  onSelect: () => void
}) {
  const { t } = useApp()
  return (
    <article className={`inst-card ${favorite ? 'inst-card--fav' : ''}`}>
      <header className="inst-card__head">
        <h3>{installation.name}</h3>
        <button
          className={`fav-btn ${favorite ? 'is-on' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={favorite}
          aria-label={t(favorite ? 'remove_favorite' : 'add_favorite')}
          title={t(favorite ? 'remove_favorite' : 'add_favorite')}
        >
          <Icon name="star" filled={favorite} />
        </button>
      </header>
      <dl className="inst-card__info">
        <dt>{t('serial')}</dt>
        <dd>{installation.serial}</dd>
        <dt>{t('address')}</dt>
        <dd>{installation.address}</dd>
        <dt>{t('status')}</dt>
        <dd><Badge tone={stateTone[installation.state]}>{t(`state_${installation.state}`)}</Badge></dd>
        <dt>{t('connection')}</dt>
        <dd><Badge tone={connTone[installation.connection]}>{t(`conn_${installation.connection}`)}</Badge></dd>
      </dl>
      <Button onClick={onSelect}>{t('select')}</Button>
    </article>
  )
}
