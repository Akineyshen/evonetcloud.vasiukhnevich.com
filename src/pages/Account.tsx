import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useApp, type Consents } from '../state/AppContext'
import { Button, Card, Field, PageTitle, Segmented, Switch } from '../ui'
import { Icon } from '../ui/Icon'
import type { Lang, TKey } from '../i18n'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="settings-section">
      <h2>{title}</h2>
      {children}
    </Card>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="setting-row">
      <div>
        <div className="param__label">{label}</div>
        {hint && <div className="muted">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

function ProfileSection() {
  const { user, updateUser, t } = useApp()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saved, setSaved] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    updateUser({ name, email, phone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Section title={t('acc_profile')}>
      <form onSubmit={submit} className="form-grid">
        <Field label={t('full_name')} value={name} onChange={(e) => setName(e.target.value)} />
        <Field label={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label={t('phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="form-actions">
          <Button type="submit">{t('save')}</Button>
          {saved && <span className="field__hint" role="status">{t('saved')}</span>}
        </div>
      </form>
    </Section>
  )
}

function PreferencesSection() {
  const { unit, setUnit, lang, setLang, mode, setMode, t } = useApp()
  return (
    <Section title={t('acc_preferences')}>
      <Row label={t('temp_unit')} hint={t('temp_unit_hint')}>
        <Segmented value={unit} onChange={setUnit} options={[{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }]} />
      </Row>
      <Row label={t('language')}>
        <Segmented<Lang> value={lang} onChange={setLang} options={[{ value: 'en', label: 'English' }, { value: 'pl', label: 'Polski' }]} />
      </Row>
      <Row label={t('theme')}>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'light', label: t('theme_light') }, { value: 'dark', label: t('theme_dark') }]} />
      </Row>
      <Row label={t('help_center')} hint={t('help_center_hint')}>
        <Button variant="secondary" size="sm" onClick={() => window.open('https://example.com/help', '_blank', 'noopener')}>
          <Icon name="help" size={16} /> {t('open')}
        </Button>
      </Row>
    </Section>
  )
}

function PasswordSection() {
  const { t } = useApp()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  const errors = {
    current: !current ? t('err_required') : undefined,
    next: next.length < 8 ? t('err_password_len') : undefined,
    repeat: repeat !== next ? t('err_password_match') : undefined,
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (Object.values(errors).some(Boolean)) return
    setCurrent(''); setNext(''); setRepeat(''); setTouched(false); setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  return (
    <Section title={t('acc_password')}>
      <form onSubmit={submit} className="form-grid" noValidate>
        <Field label={t('current_password')} type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} error={touched ? errors.current : undefined} />
        <Field label={t('new_password')} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} error={touched ? errors.next : undefined} />
        <Field label={t('repeat_password')} type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} error={touched ? errors.repeat : undefined} />
        <div className="form-actions">
          <Button type="submit">{t('change_password')}</Button>
          {done && <span className="field__hint" role="status">{t('password_changed')}</span>}
        </div>
      </form>
    </Section>
  )
}

const consentRows: { key: keyof Consents; label: TKey; hint: TKey; required?: boolean }[] = [
  { key: 'terms', label: 'consent_terms', hint: 'consent_terms_hint', required: true },
  { key: 'analytics', label: 'consent_analytics', hint: 'consent_analytics_hint' },
  { key: 'marketing', label: 'consent_marketing', hint: 'consent_marketing_hint' },
]

function ConsentsSection() {
  const { consents, setConsent, t } = useApp()
  return (
    <Section title={t('acc_consents')}>
      {consentRows.map((c) => (
        <Row key={c.key} label={t(c.label)} hint={t(c.hint)}>
          {c.required ? (
            <span className="muted">{t('required')}</span>
          ) : (
            <Switch checked={consents[c.key]} onChange={(v) => setConsent(c.key, v)} label={t(c.label)} />
          )}
        </Row>
      ))}
    </Section>
  )
}

function DangerSection() {
  const { logout, deleteAccount, user, t } = useApp()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [typed, setTyped] = useState('')

  return (
    <Section title={t('acc_danger')}>
      <Row label={t('logout')} hint={t('logout_hint')}>
        <Button variant="secondary" onClick={() => { logout(); navigate('/login') }}>
          <Icon name="logout" size={18} /> {t('logout')}
        </Button>
      </Row>
      <Row label={t('delete_account')} hint={t('delete_account_hint')}>
        {!confirming && (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <Icon name="trash" size={18} /> {t('delete_account')}
          </Button>
        )}
      </Row>
      {confirming && (
        <div className="confirm-box" role="alertdialog" aria-label={t('delete_account')}>
          <p>{t('delete_confirm', { email: user?.email ?? '' })}</p>
          <Field label={t('email')} value={typed} onChange={(e) => setTyped(e.target.value)} />
          <div className="form-actions">
            <Button variant="danger" disabled={typed !== user?.email} onClick={() => { deleteAccount(); navigate('/login') }}>
              {t('delete_forever')}
            </Button>
            <Button variant="ghost" onClick={() => { setConfirming(false); setTyped('') }}>{t('cancel')}</Button>
          </div>
        </div>
      )}
    </Section>
  )
}

export function AccountPage() {
  const { t } = useApp()
  return (
    <>
      <PageTitle title={t('my_account')} />
      <div className="settings">
        <ProfileSection />
        <PreferencesSection />
        <PasswordSection />
        <ConsentsSection />
        <DangerSection />
      </div>
    </>
  )
}
