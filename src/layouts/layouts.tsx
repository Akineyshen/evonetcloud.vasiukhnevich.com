import { Navigate, Outlet, useNavigate, useParams } from 'react-router'
import { useApp } from '../state/AppContext'
import { Header, LanguageMenu, ThemeToggle } from '../ui/Header'
import { Icon, type IconName } from '../ui/Icon'
import { Button } from '../ui'
import { BottomNav } from '../ui/BottomNav'
import { installations } from '../data/mock'
import type { TKey } from '../i18n'

const features: { icon: IconName; label: TKey }[] = [
  { icon: 'thermo', label: 'hero_f1' },
  { icon: 'bell', label: 'hero_f2' },
  { icon: 'chart', label: 'hero_f3' },
]

export function AuthLayout() {
  const { user, t } = useApp()
  if (user) return <Navigate to="/installations" replace />
  return (
    <div className="auth">
      <div className="auth__tools">
        <ThemeToggle />
        <LanguageMenu />
      </div>
      <div className="auth__layout">
        <div className="auth__hero">
          <h2>{t('hero_title')}</h2>
          <p>{t('hero_sub')}</p>
          <ul className="auth__features">
            {features.map((f) => (
              <li key={f.label}>
                <span className="avatar"><Icon name={f.icon} size={20} /></span>
                {t(f.label)}
              </li>
            ))}
          </ul>
        </div>
        <Outlet />
      </div>
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

export function InstallationLayout() {
  const { user, t } = useApp()
  const { id } = useParams()
  const navigate = useNavigate()
  const installation = installations.find((i) => i.id === id)

  if (!user) return <Navigate to="/login" replace />
  if (!installation) return <Navigate to="/installations" replace />

  return (
    <>
      <Header installation={installation} />
      <main className="page page--with-nav">
        <Button variant="ghost" size="sm" className="crumb" onClick={() => navigate('/installations')}>
          <Icon name="back" size={16} /> {t('all_installations')}
        </Button>
        <Outlet context={installation} />
      </main>
      <BottomNav installationId={installation.id} />
    </>
  )
}
