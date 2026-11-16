import type { Preview } from '@storybook/react-vite'
import { useEffect, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import '../src/styles/fonts'
import '../src/styles/tokens.css'
import '../src/styles/ui.css'
import '../src/styles/layout.css'
import '../src/styles/pages.css'
import { AppProvider } from '../src/state/AppContext'
import { brands, type Brand, type Mode } from '../src/theme/brands'
import type { Lang } from '../src/i18n'
import { themeToVars } from '../src/theme/custom'
import { GLOBAL_KEY, defaultBuilderState, readState, type BuilderState } from './brand-builder/constants'

/** Puts the Brand builder panel's choices on <html>, the same way the app applies a saved custom theme. */
function BrandBuilderVars({ state, mode, children }: { state: BuilderState; mode: Mode; children: ReactNode }) {
  const { enabled, primary, accent, font, radius, surface } = state
  useEffect(() => {
    if (!enabled) return
    const vars = themeToVars({ name: '', primary, accent, font, radius, surface }, mode)
    const root = document.documentElement
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
    root.dataset.customBrand = 'true'
    return () => {
      for (const k of Object.keys(vars)) root.style.removeProperty(k)
      delete root.dataset.customBrand
    }
  }, [enabled, primary, accent, font, radius, surface, mode])
  return <>{children}</>
}

// Toolbar globals drive the same data-brand / data-theme attributes the real app uses.
const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    options: { storySort: { order: ['Presentation', 'Foundation', 'Form', 'Data', '*'] } },
  },
  initialGlobals: { brand: 'ecovent', mode: 'light', lang: 'en', [GLOBAL_KEY]: defaultBuilderState },
  globalTypes: {
    brand: {
      description: 'White-label brand',
      toolbar: { title: 'Brand', icon: 'paintbrush', dynamicTitle: true, items: brands.map((b) => ({ value: b.id, title: b.name })) },
    },
    mode: {
      description: 'Light / dark theme',
      toolbar: { title: 'Theme', icon: 'circlehollow', dynamicTitle: true, items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }] },
    },
    lang: {
      description: 'Language',
      toolbar: { title: 'Language', icon: 'globe', dynamicTitle: true, items: [{ value: 'en', title: 'English' }, { value: 'pl', title: 'Polski' }] },
    },
  },
  decorators: [
    (Story, ctx) => {
      const { brand, mode, lang } = ctx.globals as { brand: Brand; mode: Mode; lang: Lang }
      return (
        <AppProvider overrides={{ brand, mode, lang }}>
          <BrandBuilderVars state={readState(ctx.globals[GLOBAL_KEY])} mode={mode}>
            <MemoryRouter>
              <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)', padding: 24, margin: -16, minHeight: '100vh' }}>
                <Story />
              </div>
            </MemoryRouter>
          </BrandBuilderVars>
        </AppProvider>
      )
    },
  ],
}

export default preview
