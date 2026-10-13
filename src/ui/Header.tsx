import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useApp } from '../state/AppContext'
import { brandInfo } from '../theme/brands'
import type { Lang } from '../i18n'
import { Icon, type IconName } from './Icon'
import type { Installation } from '../data/mock'

export function Logo() {
  const { brand } = useApp()
  const info = brandInfo(brand)
  return (
    <Link to="/installations" className="logo" aria-label={info.name}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="13" fill="var(--primary)" />
        <path d="M7 11h9a2.5 2.5 0 1 0-2.5-2.5M7 15h13a2.5 2.5 0 1 1-2.5 2.5M7 19h6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
      <span>{info.name}</span>
    </Link>
  )
}

function Dropdown({ icon, label, children }: { icon: IconName; label: string; children: (close: () => void) => ReactNode }) {
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
      <button className="dropdown__trigger" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        <Icon name={icon} />
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
  return (
    <button
      className="icon-btn"
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      aria-label={t(mode === 'light' ? 'theme_dark' : 'theme_light')}
      title={t(mode === 'light' ? 'theme_dark' : 'theme_light')}
    >
      <Icon name={mode === 'light' ? 'moon' : 'sun'} />
    </button>
  )
}

export function Header({ installation }: { installation?: Installation }) {
  const { user, logout, t } = useApp()
  const navigate = useNavigate()

  return (
    <header className="header">
      <Logo />
      {installation && (
        <div className="header__inst">
          <span className="header__inst-name">
            <Icon name="pin" size={16} /> {installation.name}
          </span>
          <button className="btn btn--secondary btn--sm" onClick={() => navigate('/installations')}>
            <Icon name="logout" size={16} />
            <span className="hide-mobile">{t('leave_installation')}</span>
          </button>
        </div>
      )}
      <div className="header__spacer" />
      <ThemeToggle />
      <LanguageMenu />
      <Dropdown icon="user" label={user?.name ?? t('my_account')}>
        {(close) => (
          <>
            <div className="menu-head">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <MenuItem icon="grid" onClick={() => { navigate('/installations'); close() }}>{t('installations')}</MenuItem>
            <MenuItem icon="settings" onClick={() => { navigate('/account'); close() }}>{t('my_account')}</MenuItem>
            <MenuItem icon="logout" danger onClick={() => { logout(); navigate('/login') }}>{t('logout')}</MenuItem>
          </>
        )}
      </Dropdown>
    </header>
  )
}
