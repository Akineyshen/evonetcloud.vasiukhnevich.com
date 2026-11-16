import { defaultCustomTheme, type CustomTheme } from '../../src/theme/custom'

export const ADDON_ID = 'brand-builder'
export const PANEL_ID = `${ADDON_ID}/panel`
export const TOOL_ID = `${ADDON_ID}/tool`

/**
 * The builder keeps its state in one Storybook global. Globals are shared by the manager
 * (the panel) and the preview (the decorator), and they survive in the URL, so a configured
 * look can be sent as a link.
 */
export const GLOBAL_KEY = 'brandBuilder'

export type BuilderTheme = Pick<CustomTheme, 'primary' | 'accent' | 'font' | 'radius' | 'surface'>

export interface BuilderState extends BuilderTheme {
  enabled: boolean
}

export const defaultBuilderState: BuilderState = {
  enabled: false,
  primary: defaultCustomTheme.primary,
  accent: defaultCustomTheme.accent,
  font: defaultCustomTheme.font,
  radius: defaultCustomTheme.radius,
  surface: defaultCustomTheme.surface,
}

/** Merges a possibly partial or stale global (old URL, hand-edited link) with the defaults. */
export function readState(value: unknown): BuilderState {
  if (!value || typeof value !== 'object') return defaultBuilderState
  const v = value as Partial<Record<keyof BuilderState, unknown>>
  return {
    ...defaultBuilderState,
    ...(v as Partial<BuilderState>),
    enabled: v.enabled === true || v.enabled === 'true',
  }
}

/** Ready-made palettes so a presentation can jump between looks with one click. */
export const presets: { name: string; theme: BuilderTheme }[] = [
  { name: 'Plum', theme: { primary: '#6a4a8c', accent: '#e8a93a', font: 'outfit', radius: 'soft', surface: 'glass' } },
  { name: 'Ocean', theme: { primary: '#1f6fb2', accent: '#22b8a6', font: 'plex', radius: 'sharp', surface: 'flat' } },
  { name: 'Forest', theme: { primary: '#2f7d4f', accent: '#c7a43b', font: 'nunito', radius: 'round', surface: 'glass' } },
  { name: 'Ember', theme: { primary: '#c2462e', accent: '#3a7bd5', font: 'system', radius: 'soft', surface: 'flat' } },
  { name: 'Graphite', theme: { primary: '#2d3340', accent: '#ff7a59', font: 'plex', radius: 'sharp', surface: 'glass' } },
]

export const primarySwatches = ['#6a4a8c', '#1f6fb2', '#2f7d4f', '#c2462e', '#2d3340', '#0f8b8d', '#b5367a', '#5b5bd6']
export const accentSwatches = ['#e8a93a', '#22b8a6', '#c7a43b', '#3a7bd5', '#ff7a59', '#8bc34a', '#f06292', '#9c7cf4']
