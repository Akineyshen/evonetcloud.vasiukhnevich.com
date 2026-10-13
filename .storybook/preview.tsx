import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import '../src/styles/tokens.css'
import '../src/styles/ui.css'
import '../src/styles/layout.css'
import '../src/styles/pages.css'
import { AppProvider } from '../src/state/AppContext'
import { brands, type Brand, type Mode } from '../src/theme/brands'
import type { Lang } from '../src/i18n'

// Toolbar globals drive the same data-brand / data-theme attributes the real app uses.
const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    options: { storySort: { order: ['Form', 'Data', '*'] } },
  },
  initialGlobals: { brand: 'ecovent', mode: 'light', lang: 'en' },
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
          <MemoryRouter>
            <div style={{ background: 'var(--bg)', color: 'var(--text)', padding: 24, margin: -16, minHeight: '100vh' }}>
              <Story />
            </div>
          </MemoryRouter>
        </AppProvider>
      )
    },
  ],
}

export default preview
