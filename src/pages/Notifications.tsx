import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext'
import { notifications, type Severity } from '../data/mock'
import { Badge, Button, Card, Empty, PageTitle, Segmented, Select, type Tone } from '../ui'

const tone: Record<Severity, Tone> = { info: 'info', warning: 'warn', error: 'danger' }

export function NotificationsPage() {
  const { t, lang, readNotifications, markRead } = useApp()
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [status, setStatus] = useState<'all' | 'unread'>('all')

  const isRead = (id: string) => readNotifications.includes(id)
  const list = useMemo(
    () => notifications.filter((n) => (!severity || n.severity === severity) && (status === 'all' || !readNotifications.includes(n.id))),
    [severity, status, readNotifications],
  )
  const unreadIds = notifications.filter((n) => !isRead(n.id)).map((n) => n.id)
  const fmt = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <>
      <PageTitle
        title={t('nav_notifications')}
        actions={<Button variant="secondary" size="sm" disabled={!unreadIds.length} onClick={() => markRead(unreadIds, true)}>{t('mark_all_read')}</Button>}
      />
      <div className="filters">
        <Segmented
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: t('all') }, { value: 'unread', label: `${t('unread')} (${unreadIds.length})` }]}
        />
        <Select aria-label={t('severity')} value={severity} onChange={(e) => setSeverity(e.target.value as Severity | '')}>
          <option value="">{t('severity')}: {t('all')}</option>
          <option value="error">{t('sev_error')}</option>
          <option value="warning">{t('sev_warning')}</option>
          <option value="info">{t('sev_info')}</option>
        </Select>
      </div>
      {list.length === 0 ? (
        <Empty>{t('nothing_found')}</Empty>
      ) : (
        <Card className="notif-list">
          {list.map((n) => (
            <div key={n.id} className={`notif ${isRead(n.id) ? '' : 'notif--unread'}`}>
              <div className="notif__main">
                <div className="notif__title">
                  <Badge tone={tone[n.severity]}>{t(`sev_${n.severity}`)}</Badge>
                  <strong>{t(n.title)}</strong>
                </div>
                <p className="muted">{t(n.body)}</p>
                <time className="notif__time" dateTime={n.time}>{fmt.format(new Date(n.time))}</time>
              </div>
              <Button variant="ghost" size="sm" onClick={() => markRead([n.id], !isRead(n.id))}>
                {t(isRead(n.id) ? 'mark_unread' : 'mark_read')}
              </Button>
            </div>
          ))}
        </Card>
      )}
    </>
  )
}
