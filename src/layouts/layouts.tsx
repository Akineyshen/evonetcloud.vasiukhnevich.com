import { Navigate, NavLink, Outlet, useNavigate, useParams } from 'react-router'
import { useApp } from '../state/AppContext'
import { Header, LanguageMenu, ThemeToggle } from '../ui/Header'
import { Icon } from '../ui/Icon'
import { installations, notifications } from '../data/mock'
import type { TKey } from '../i18n'
import type { IconName } from '../ui/Icon'

export function AuthLayout() {
  const { user } = useApp()
  if (user) return <Navigate to="/installations" replace />
  return (
    <div className="auth">
      <div className="auth__tools">
        <ThemeToggle />
        <LanguageMenu />
      </div>
      <Outlet />
    </div>
  )
}

export function AppLayout() {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}

const nav: { to: string; label: TKey; icon: IconName; end?: boolean }[] = [
  { to: '', label: 'nav_dashboard', icon: 'grid', end: true },
  { to: 'parameters', label: 'nav_parameters', icon: 'sliders' },
  { to: 'charts', label: 'nav_charts', icon: 'chart' },
  { to: 'notifications', label: 'nav_notifications', icon: 'bell' },
]

export function InstallationLayout() {
  const { user, t, readNotifications } = useApp()
  const { id } = useParams()
  const navigate = useNavigate()
  const installation = installations.find((i) => i.id === id)

  if (!user) return <Navigate to="/login" replace />
  if (!installation) return <Navigate to="/installations" replace />

  const unread = notifications.filter((n) => !readNotifications.includes(n.id)).length

  return (
    <>
      <Header installation={installation} />
      <div className="shell">
        <nav className="sidebar" aria-label={installation.name}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
              <Icon name={n.icon} />
              {t(n.label)}
              {n.to === 'notifications' && unread > 0 && <span className="nav-link__count">{unread}</span>}
            </NavLink>
          ))}
          <div className="sidebar__spacer" />
          <button className="nav-link" style={{ border: 0, background: 'none' }} onClick={() => navigate('/installations')}>
            <Icon name="back" />
            {t('all_installations')}
          </button>
        </nav>
        <main className="page" style={{ width: '100%' }}>
          <Outlet context={installation} />
        </main>
      </div>
    </>
  )
}
