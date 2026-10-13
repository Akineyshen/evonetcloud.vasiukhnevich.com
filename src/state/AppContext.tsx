import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { applyTheme, defaultBrand, type Brand, type Mode } from '../theme/brands'
import { dictionaries, type Lang, type TKey } from '../i18n'

export type Unit = 'C' | 'F'

export interface User {
  name: string
  email: string
  phone: string
}

export interface Consents {
  terms: boolean
  marketing: boolean
  analytics: boolean
}

interface Persisted {
  user: User | null
  lang: Lang
  unit: Unit
  mode: Mode
  favorites: string[]
  readNotifications: string[]
  consents: Consents
}

const STORAGE_KEY = 'vent-app-state'

const initial: Persisted = {
  user: null,
  lang: 'en',
  unit: 'C',
  mode: 'light',
  favorites: ['inst-1'],
  readNotifications: [],
  consents: { terms: true, marketing: false, analytics: true },
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initial, ...JSON.parse(raw) }
  } catch {
    /* ignore corrupt storage */
  }
  return initial
}

interface AppContextValue extends Persisted {
  brand: Brand
  setBrand: (b: Brand) => void
  login: (email: string) => void
  register: (name: string, email: string) => void
  logout: () => void
  deleteAccount: () => void
  updateUser: (patch: Partial<User>) => void
  setLang: (l: Lang) => void
  setUnit: (u: Unit) => void
  setMode: (m: Mode) => void
  toggleFavorite: (id: string) => void
  markRead: (ids: string[], read: boolean) => void
  setConsent: (key: keyof Consents, value: boolean) => void
  t: (key: TKey, vars?: Record<string, string | number>) => string
  /** Converts a Celsius value to the selected unit and formats it. */
  temp: (celsius: number, digits?: number) => string
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({
  children,
  overrides,
}: {
  children: ReactNode
  /** Used by Storybook to force brand / mode / language from the toolbar. */
  overrides?: Partial<Pick<Persisted, 'lang' | 'mode'>> & { brand?: Brand }
}) {
  const [state, setState] = useState<Persisted>(load)
  const [brand, setBrand] = useState<Brand>(defaultBrand)

  const lang = overrides?.lang ?? state.lang
  const mode = overrides?.mode ?? state.mode
  const activeBrand = overrides?.brand ?? brand

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  useEffect(() => {
    applyTheme(activeBrand, mode)
    document.documentElement.lang = lang
  }, [activeBrand, mode, lang])

  const patch = useCallback((p: Partial<Persisted>) => setState((s) => ({ ...s, ...p })), [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      lang,
      mode,
      brand: activeBrand,
      setBrand,
      login: (email) =>
        setState((s) => ({
          ...s,
          user: s.user ?? { name: email.split('@')[0] || 'User', email, phone: '+48 600 100 200' },
        })),
      register: (name, email) => patch({ user: { name, email, phone: '' } }),
      logout: () => patch({ user: null }),
      deleteAccount: () => setState((s) => ({ ...initial, lang: s.lang, mode: s.mode })),
      updateUser: (p) => setState((s) => (s.user ? { ...s, user: { ...s.user, ...p } } : s)),
      setLang: (l) => patch({ lang: l }),
      setUnit: (u) => patch({ unit: u }),
      setMode: (m) => patch({ mode: m }),
      toggleFavorite: (id) =>
        setState((s) => ({
          ...s,
          favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
        })),
      markRead: (ids, read) =>
        setState((s) => ({
          ...s,
          readNotifications: read
            ? Array.from(new Set([...s.readNotifications, ...ids]))
            : s.readNotifications.filter((n) => !ids.includes(n)),
        })),
      setConsent: (key, v) => setState((s) => ({ ...s, consents: { ...s.consents, [key]: v } })),
      t: (key, vars) => {
        let text: string = dictionaries[lang][key] ?? key
        if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v))
        return text
      },
      temp: (c, digits = 1) =>
        state.unit === 'F' ? `${(c * 1.8 + 32).toFixed(digits)} °F` : `${c.toFixed(digits)} °C`,
    }),
    [state, lang, mode, activeBrand, patch],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
