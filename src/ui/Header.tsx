import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useApp } from '../state/AppContext'
import { brandInfo } from '../theme/brands'
import type { Lang, TKey } from '../i18n'
import { Icon, type IconName } from './Icon'
import { Button } from '.'
import { notifications, type Installation } from '../data/mock'

export function Logo({ compact = false }: { compact?: boolean }) {
  const { brand, customTheme } = useApp()
  const info = customTheme ? { name: customTheme.name } : brandInfo(brand)
  return (
    <Link to="/installations" className="logo" aria-label={info.name}>
      <span className="logo__mark">
        {customTheme?.logo ? <img src={customTheme.logo} alt="" className="logo__img" /> : <Icon name="wind" size={22} />}
      </span>
      {!compact && <span className="hide-mobile">{info.name}</span>}
    </Link>
  )
}

function Dropdown({ icon, label, avatar, children }: { icon?: IconName; label: string; avatar?: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`dropdown__trigger ${avatar ? 'dropdown__trigger--avatar' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
      >
        {avatar ? <span className="avatar">{avatar}</span> : icon && <Icon name={icon} />}
        <span className="dropdown__label">{label}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div className="dropdown__menu" role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ icon, children, onClick, active, danger }: { icon?: IconName; children: ReactNode; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button role="menuitem" className={`menu-item ${active ? 'is-active' : ''} ${danger ? 'is-danger' : ''}`} onClick={onClick}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}

export function LanguageMenu() {
  const { lang, setLang } = useApp()
  const langs: { id: Lang; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'pl', label: 'Polski' },
  ]
  return (
    <Dropdown icon="globe" label={lang.toUpperCase()}>
      {(close) =>
        langs.map((l) => (
          <MenuItem key={l.id} active={l.id === lang} onClick={() => { setLang(l.id); close() }}>
            {l.label}
          </MenuItem>
        ))
      }
    </Dropdown>
  )
}

export function ThemeToggle() {
  const { mode, setMode, t } = useApp()
  const label = t(mode === 'light' ? 'theme_dark' : 'theme_light')
  return (
    <button className="icon-btn" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} aria-label={label} title={label}>
      <Icon name={mode === 'light' ? 'moon' : 'sun'} />
    </button>
  )
}

const nav: { to: string; label: TKey; end?: boolean }[] = [
  { to: '', label: 'nav_dashboard', end: true },
  { to: 'parameters', label: 'nav_parameters' },
  { to: 'charts', label: 'nav_charts' },
  { to: 'notifications', label: 'nav_notifications' },
]

export function Header({ installation }: { installation?: Installation }) {
  const { user, logout, t, readNotifications } = useApp()
  const navigate = useNavigate()
  const unread = notifications.filter((n) => !readNotifications.includes(n.id)).length

  return (
    <header className="header">
      <Logo />
      {installation && <span className="header__title">{installation.name}</span>}
      {installation && (
        <nav className="nav-pill" aria-label={installation.name}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to ? `/i/${installation.id}/${n.to}` : `/i/${installation.id}`} end={n.end}>
              {t(n.label)}
              {n.to === 'notifications' && unread > 0 && <span className="nav-pill__count">{unread}</span>}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="header__spacer" />
      {installation && (
        <Button variant="secondary" size="sm" className="header__leave" onClick={() => navigate('/installations')}>
          <Icon name="logout" size={16} />
          <span className="hide-mobile">{t('leave_installation')}</span>
        </Button>
      )}
      <ThemeToggle />
      <LanguageMenu />
      <Dropdown avatar={(user?.name ?? '?').charAt(0)} label={user?.name ?? t('my_account')}>
        {(close) => (
          <>
            <div className="menu-head">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <MenuItem icon="grid" onClick={() => { navigate('/installations'); close() }}>{t('installations')}</MenuItem>
            <MenuItem icon="settings" onClick={() => { navigate('/account'); close() }}>{t('my_account')}</MenuItem>
            <MenuItem icon="sliders" onClick={() => { navigate('/theme'); close() }}>{t('brand_settings')}</MenuItem>
            <MenuItem icon="logout" danger onClick={() => { logout(); navigate('/login') }}>{t('logout')}</MenuItem>
          </>
        )}
      </Dropdown>
    </header>
  )
}
