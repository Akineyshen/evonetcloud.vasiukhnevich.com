import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useApp } from '../state/AppContext'
import { Logo } from '../ui/Header'
import { Button, Card, Field } from '../ui'

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v)

export function LoginPage() {
  const { login, t } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!emailOk(email) || !password) return
    login(email)
    navigate('/installations')
  }

  return (
    <Card className="auth__card">
      <Logo />
      <h1>{t('login_title')}</h1>
      <p className="auth__sub">{t('login_sub')}</p>
      <form onSubmit={submit} noValidate style={{ display: 'contents' }}>
        <Field label={t('email')} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
          error={touched && !emailOk(email) ? t('err_email') : undefined} />
        <Field label={t('password')} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
          error={touched && !password ? t('err_required') : undefined} />
        <Button type="submit">{t('login')}</Button>
      </form>
      <p className="auth__alt">
        {t('no_account')} <Link to="/register">{t('register')}</Link>
      </p>
    </Card>
  )
}

export function RegisterPage() {
  const { register, t } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState(false)

  const errors = {
    name: !name.trim() ? t('err_required') : undefined,
    email: !emailOk(email) ? t('err_email') : undefined,
    password: password.length < 8 ? t('err_password_len') : undefined,
    repeat: repeat !== password ? t('err_password_match') : undefined,
    agree: !agree ? t('err_terms') : undefined,
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (Object.values(errors).some(Boolean)) return
    register(name.trim(), email)
    navigate('/installations')
  }

  return (
    <Card className="auth__card">
      <Logo />
      <h1>{t('register_title')}</h1>
      <p className="auth__sub">{t('register_sub')}</p>
      <form onSubmit={submit} noValidate style={{ display: 'contents' }}>
        <Field label={t('full_name')} value={name} onChange={(e) => setName(e.target.value)} error={touched ? errors.name : undefined} />
        <Field label={t('email')} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={touched ? errors.email : undefined} />
        <Field label={t('password')} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={touched ? errors.password : undefined} />
        <Field label={t('repeat_password')} type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} error={touched ? errors.repeat : undefined} />
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>{t('agree_terms')}{touched && errors.agree && <span className="field__error"> — {errors.agree}</span>}</span>
        </label>
        <Button type="submit">{t('register')}</Button>
      </form>
      <p className="auth__alt">
        {t('have_account')} <Link to="/login">{t('login')}</Link>
      </p>
    </Card>
  )
}
