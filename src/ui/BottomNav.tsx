import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { useApp } from '../state/AppContext'
import { Icon, type IconName } from './Icon'
import { notifications } from '../data/mock'
import type { TKey } from '../i18n'

const items: { to: string; label: TKey; icon: IconName; end?: boolean }[] = [
  { to: '', label: 'nav_dashboard', icon: 'grid', end: true },
  { to: 'parameters', label: 'tab_parameters', icon: 'sliders' },
  { to: 'charts', label: 'nav_charts', icon: 'chart' },
  { to: 'notifications', label: 'nav_notifications', icon: 'bell' },
]

const TEXT_FIELD = 'input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=file]):not([type=range]), textarea, select'

/** Mobile tab bar. Slides away while a text field is focused so the on-screen keyboard never covers or pushes it. */
export function BottomNav({ installationId }: { installationId: string }) {
  const { t, readNotifications } = useApp()
  const [hidden, setHidden] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const unread = notifications.filter((n) => !readNotifications.includes(n.id)).length

  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && e.target.matches(TEXT_FIELD)) {
        clearTimeout(timer.current)
        setHidden(true)
      }
    }
    // Delay so moving focus between two fields does not flash the bar.
    const onOut = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setHidden(false), 120)
    }
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])

  return (
    <nav className={`bottom-nav ${hidden ? 'bottom-nav--hidden' : ''}`} aria-label={t('nav_dashboard')}>
      {items.map((i) => (
        <NavLink key={i.to} to={i.to ? `/i/${installationId}/${i.to}` : `/i/${installationId}`} end={i.end} className="bottom-nav__item">
          <span className="bottom-nav__icon">
            <Icon name={i.icon} size={22} />
            {i.to === 'notifications' && unread > 0 && <span className="bottom-nav__badge">{unread}</span>}
          </span>
          <span className="bottom-nav__label">{t(i.label)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
