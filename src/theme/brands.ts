export type Brand = 'ecovent' | 'aeroflow' | 'greenair'
export type Mode = 'light' | 'dark'

export interface BrandInfo {
  id: Brand
  name: string
  tagline: string
}

// Colors live in src/styles/tokens.css, keyed by [data-brand] and [data-theme].
export const brands: BrandInfo[] = [
  { id: 'ecovent', name: 'ecoVENT', tagline: 'Heat recovery' },
  { id: 'aeroflow', name: 'AeroFlow', tagline: 'Air handling' },
  { id: 'greenair', name: 'GreenAir', tagline: 'Fresh air systems' },
]

export const defaultBrand: Brand = (import.meta.env.VITE_BRAND as Brand) || 'ecovent'

export function applyTheme(brand: Brand, mode: Mode) {
  const root = document.documentElement
  root.dataset.brand = brand
  root.dataset.theme = mode
}

export function brandInfo(id: Brand) {
  return brands.find((b) => b.id === id) ?? brands[0]
}
