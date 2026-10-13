import type { Mode } from './brands'

// A deliberately small set of choices: every combination stays readable and on-brand.
export type FontKey = 'outfit' | 'plex' | 'nunito' | 'system'
export type RadiusKey = 'sharp' | 'soft' | 'round'
export type SurfaceKey = 'glass' | 'flat'

export interface CustomTheme {
  name: string
  primary: string
  accent: string
  font: FontKey
  radius: RadiusKey
  surface: SurfaceKey
  /** Data URL, limited in size by the builder. */
  logo?: string
}

export const defaultCustomTheme: CustomTheme = {
  name: 'My Brand',
  primary: '#6a4a8c',
  accent: '#e8a93a',
  font: 'outfit',
  radius: 'soft',
  surface: 'glass',
}

export const fontOptions: { value: FontKey; label: string }[] = [
  { value: 'outfit', label: 'Outfit' },
  { value: 'plex', label: 'IBM Plex' },
  { value: 'nunito', label: 'Nunito' },
  { value: 'system', label: 'System' },
]

const fonts: Record<FontKey, { family: string; weight: string }> = {
  outfit: { family: "'Outfit Variable', system-ui, sans-serif", weight: '300' },
  plex: { family: "'IBM Plex Sans', system-ui, sans-serif", weight: '600' },
  nunito: { family: "'Nunito Variable', system-ui, sans-serif", weight: '700' },
  system: { family: "system-ui, -apple-system, 'Segoe UI', sans-serif", weight: '600' },
}

const radii: Record<RadiusKey, [string, string, string, string]> = {
  sharp: ['4px', '6px', '10px', '8px'],
  soft: ['14px', '18px', '26px', '999px'],
  round: ['20px', '24px', '34px', '999px'],
}

export const hexOk = (v: string) => /^#[0-9a-f]{6}$/i.test(v)

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex([r, g, b]: number[]) {
  return '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
}

/** Linear blend of two hex colors; amount is the share of `to`. */
function mix(from: string, to: string, amount: number) {
  const a = toRgb(from)
  const b = toRgb(to)
  return toHex(a.map((c, i) => c + (b[i] - c) * amount))
}

function luminance(hex: string) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const DARK_TEXT = '#101018'

/** Picks whichever of white / near-black reads better on the given background. */
export function readableOn(bg: string) {
  return contrastRatio(bg, '#ffffff') >= contrastRatio(bg, DARK_TEXT) ? '#ffffff' : DARK_TEXT
}

/** The accent actually used in a mode: dark mode gets a lighter variant so it stays visible. */
export function resolvePrimary(theme: CustomTheme, mode: Mode) {
  return mode === 'dark' ? mix(theme.primary, '#ffffff', 0.38) : theme.primary
}

export function contrastOnPrimary(theme: CustomTheme, mode: Mode) {
  const p = resolvePrimary(theme, mode)
  return contrastRatio(p, readableOn(p))
}

/** CSS variables to set on <html> (applied theme) or on a preview wrapper. */
export function themeToVars(theme: CustomTheme, mode: Mode): Record<string, string> {
  const primary = resolvePrimary(theme, mode)
  const font = fonts[theme.font]
  const [sm, md, lg, nav] = radii[theme.radius]
  return {
    '--primary': primary,
    '--primary-hover': mix(primary, mode === 'dark' ? '#ffffff' : '#000000', 0.14),
    '--primary-contrast': readableOn(primary),
    '--chart-1': primary,
    '--chart-2': theme.accent,
    '--font': font.family,
    '--heading-weight': font.weight,
    '--radius-sm': sm,
    '--radius-md': md,
    '--radius-lg': lg,
    '--radius-nav': nav,
    '--glass': theme.surface === 'glass' ? '62' : '100',
    '--blur': theme.surface === 'glass' ? '18px' : '0px',
  }
}
