import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { useApp } from '../../state/AppContext'
import { Badge, Button, Field } from '..'
import { Tile } from '../Tile'
import { brands } from '../../theme/brands'

// Every value is read from the live CSS variables, so the page follows the brand / theme toolbar.
const meta = {
  title: 'Foundation/Tokens',
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function useResolved(names: string[]) {
  const { brand, mode } = useApp()
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    // The provider applies data-brand / data-theme in its own effect, which runs after ours.
    const id = setTimeout(() => {
      const cs = getComputedStyle(document.documentElement)
      setValues(Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()])))
    }, 0)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, mode])
  return values
}

const page = { padding: 32, display: 'flex', flexDirection: 'column', gap: 32 } as const
const h2 = { fontSize: 20, fontWeight: 600, margin: 0 } as const
const mono = { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12, color: 'var(--text-muted)' } as const
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 } as const

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h2 style={h2}>{title}</h2>
        {hint && <p style={{ ...mono, margin: '4px 0 0' }}>{hint}</p>}
      </div>
      {children}
    </section>
  )
}

const colorGroups: { title: string; tokens: string[] }[] = [
  { title: 'Brand', tokens: ['--primary', '--primary-hover', '--primary-contrast'] },
  { title: 'Surfaces', tokens: ['--bg', '--surface', '--surface-2', '--border'] },
  { title: 'Text', tokens: ['--text', '--text-muted'] },
  { title: 'Status', tokens: ['--ok', '--warn', '--danger', '--info'] },
  { title: 'Charts', tokens: ['--chart-1', '--chart-2'] },
]

function ColorsPage() {
  const values = useResolved(colorGroups.flatMap((g) => g.tokens))
  return (
    <div style={page}>
      {colorGroups.map((g) => (
        <Section key={g.title} title={g.title}>
          <div style={grid}>
            {g.tokens.map((token) => (
              <div key={token} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ height: 72, background: `var(${token})`, borderBottom: '1px solid var(--border)' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 500 }}>{token.slice(2)}</div>
                  <div style={mono}>var({token})</div>
                  <div style={mono}>{values[token]}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  )
}
export const Colors: Story = { render: () => <ColorsPage /> }

const sizes = [
  ['--text-3xl', 'Page title'],
  ['--text-2xl', 'Display value'],
  ['--text-xl', 'Section title'],
  ['--text-lg', 'Section heading'],
  ['--text-md', 'Card title'],
  ['--text-base', 'Body text, default size'],
  ['--text-sm', 'Secondary text, labels'],
  ['--text-xs', 'Captions, badges'],
] as const
const weights = ['--weight-regular', '--weight-medium', '--weight-semibold', '--weight-bold'] as const

function TypographyPage() {
  const v = useResolved([...sizes.map((s) => s[0]), ...weights, '--font'])
  return (
    <div style={page}>
      <Section title="Font family" hint={v['--font']}>
        <div style={{ fontSize: 28 }}>Aa Bb Cc Ąą Ćć Łł Żż 0123456789 °C m³/h</div>
      </Section>
      <Section title="Sizes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sizes.map(([token, usage]) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'baseline', gap: 16 }}>
              <div style={mono}>{token.slice(2)} · {v[token]}</div>
              <div style={{ fontSize: `var(${token})` }}>{usage}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Weights">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {weights.map((token) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'baseline', gap: 16 }}>
              <div style={mono}>{token.slice(2)} · {v[token]}</div>
              <div style={{ fontSize: 20, fontWeight: `var(${token})` as unknown as number }}>Fresh air, every hour</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
export const Typography: Story = { render: () => <TypographyPage /> }

const spaces = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8', '--space-12']

function SpacingPage() {
  const v = useResolved(spaces)
  return (
    <div style={page}>
      <Section title="Spacing scale" hint="4px base unit. Use for padding, margin and gap.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {spaces.map((token) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: 16 }}>
              <div style={mono}>{token.slice(2)} · {v[token]}</div>
              <div style={{ height: 20, width: `var(${token})`, background: 'var(--primary)', borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
export const Spacing: Story = { render: () => <SpacingPage /> }

const radii = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-nav', '--radius-full']

function RadiusPage() {
  const v = useResolved(radii)
  return (
    <div style={page}>
      <Section title="Corner radius" hint="Set per brand: sm = buttons and inputs, md = menus, lg = cards and tiles, nav = the tab pill. Switch brand in the toolbar to compare.">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {radii.map((token) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 120, height: 80, background: 'var(--surface)', border: '2px solid var(--primary)', borderRadius: `var(${token})` }} />
              <div style={mono}>{token.slice(2)} · {v[token]}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
export const Radius: Story = { render: () => <RadiusPage /> }

function ShadowsPage() {
  return (
    <div style={page}>
      <Section title="Elevation">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {['--shadow', '--shadow-lg'].map((token) => (
            <div key={token} style={{ width: 180, height: 100, background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: `var(${token})`, display: 'grid', placeItems: 'center' }}>
              <span style={mono}>{token.slice(2)}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
export const Shadows: Story = { render: () => <ShadowsPage /> }

// Same components rendered under each brand scope: typeface, radii and surface character differ.
function BrandsPage() {
  const { t, temp } = useApp()
  return (
    <div style={{ ...page, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
      {brands.map((b) => (
        <div
          key={b.id}
          data-brand={b.id}
          style={{ fontFamily: 'var(--font)', color: 'var(--text)', padding: 24, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg)', backgroundImage: 'var(--bg-image)', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div>
            <div style={{ ...mono }}>{b.tagline}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--heading-weight)' as unknown as number, letterSpacing: 'var(--heading-tracking)' }}>{b.name}</div>
          </div>
          <Tile icon="thermo" label={t('tile_supply')} value={temp(20.8)} />
          <Field label={t('email')} placeholder="you@example.com" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button>{t('save')}</Button>
            <Button variant="secondary">{t('cancel')}</Button>
            <Badge tone="ok">{t('conn_online')}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
export const Brands: Story = { render: () => <BrandsPage /> }
