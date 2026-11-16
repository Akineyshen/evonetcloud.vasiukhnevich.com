// The manager bundle compiles JSX with the classic runtime, so React must be in scope.
import React, { useState, type CSSProperties, type ReactNode } from 'react'
void React
import { addons, types, useGlobals } from 'storybook/manager-api'
import { AddonPanel } from 'storybook/internal/components'
import { useTheme } from 'storybook/theming'
import { contrastOnPrimary, fontOptions, hexOk } from '../src/theme/custom'
import {
  ADDON_ID,
  GLOBAL_KEY,
  PANEL_ID,
  accentSwatches,
  defaultBuilderState,
  presets,
  primarySwatches,
  readState,
  type BuilderState,
} from './brand-builder/constants'

const radiusOptions = [
  { value: 'sharp', label: 'Sharp', preview: 4 },
  { value: 'soft', label: 'Soft', preview: 12 },
  { value: 'round', label: 'Round', preview: 20 },
] as const

const surfaceOptions = [
  { value: 'glass', label: 'Glass' },
  { value: 'flat', label: 'Flat' },
] as const

const fontFamilies: Record<string, string> = {
  outfit: "'Outfit Variable', system-ui, sans-serif",
  plex: "'IBM Plex Sans', system-ui, sans-serif",
  nunito: "'Nunito Variable', system-ui, sans-serif",
  system: "system-ui, -apple-system, 'Segoe UI', sans-serif",
}

function useBuilder() {
  const [globals, updateGlobals] = useGlobals()
  const state = readState(globals[GLOBAL_KEY])
  const set = (patch: Partial<BuilderState>) => updateGlobals({ [GLOBAL_KEY]: { ...state, enabled: true, ...patch } })
  const reset = () => updateGlobals({ [GLOBAL_KEY]: defaultBuilderState })
  return { state, set, reset }
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  const theme = useTheme()
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 20, height: 20, borderRadius: 999, display: 'inline-grid', placeItems: 'center', fontSize: 11,
            background: theme.color.secondary, color: theme.color.lightest,
          }}
        >
          {n}
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function ColorPicker({ value, swatches, onChange, label }: { value: string; swatches: string[]; onChange: (v: string) => void; label: string }) {
  const theme = useTheme()
  const [draft, setDraft] = useState(value)
  // While the typed text is incomplete show it as is; otherwise follow the real value (presets change it too).
  const shown = hexOk(draft) ? value : draft
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {swatches.map((c) => {
          const active = c.toLowerCase() === value.toLowerCase()
          return (
            <button
              key={c}
              type="button"
              title={c}
              aria-label={`${label} ${c}`}
              aria-pressed={active}
              onClick={() => { setDraft(c); onChange(c) }}
              style={{
                width: 28, height: 28, borderRadius: 8, background: c, cursor: 'pointer', padding: 0,
                border: `2px solid ${active ? theme.color.defaultText : 'transparent'}`,
                boxShadow: active ? `0 0 0 2px ${theme.background.content} inset` : 'none',
              }}
            />
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          aria-label={label}
          value={hexOk(value) ? value : '#000000'}
          onChange={(e) => { setDraft(e.target.value); onChange(e.target.value) }}
          style={{ width: 36, height: 30, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
        />
        <input
          value={shown}
          spellCheck={false}
          maxLength={7}
          onChange={(e) => {
            setDraft(e.target.value)
            if (hexOk(e.target.value)) onChange(e.target.value)
          }}
          style={{
            width: 96, padding: '6px 8px', borderRadius: 6, fontFamily: 'ui-monospace, monospace', fontSize: 12,
            border: `1px solid ${hexOk(shown) ? theme.appBorderColor : theme.color.negative}`,
            background: theme.input.background, color: theme.input.color,
          }}
        />
      </div>
    </div>
  )
}

function Choice<T extends string>({
  value,
  options,
  onChange,
  render,
}: {
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (v: T) => void
  render?: (o: { value: T; label: string }) => ReactNode
}) {
  const theme = useTheme()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            style={{
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
              border: `1px solid ${active ? theme.color.secondary : theme.appBorderColor}`,
              background: active ? `${theme.color.secondary}1f` : theme.background.content,
              color: theme.color.defaultText,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 64,
            }}
          >
            {render ? render(o) : o.label}
          </button>
        )
      })}
    </div>
  )
}

function BrandBuilderPanel() {
  const theme = useTheme()
  const { state, set, reset } = useBuilder()
  const [copied, setCopied] = useState(false)

  const ratio = Math.min(
    contrastOnPrimary({ ...state, name: '' }, 'light'),
    contrastOnPrimary({ ...state, name: '' }, 'dark'),
  )

  const copy = async () => {
    const { enabled: _enabled, ...theme } = state
    try {
      await navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }

  const button: CSSProperties = {
    padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
    border: `1px solid ${theme.appBorderColor}`, background: theme.background.content, color: theme.color.defaultText,
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 22, fontSize: 12, maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, cursor: 'pointer' }}>
          <input type="checkbox" checked={state.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
          Apply custom brand
        </label>
        <span style={{ color: theme.textMutedColor }}>
          {state.enabled ? 'Every story uses the choices below.' : 'Off: stories use the brand picked in the toolbar.'}
        </span>
      </div>

      <Step n={1} title="Start from a preset">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {presets.map((p) => (
            <button key={p.name} type="button" onClick={() => set(p.theme)} style={{ ...button, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <span style={{ display: 'flex' }}>
                <span style={{ width: 14, height: 14, borderRadius: 999, background: p.theme.primary }} />
                <span style={{ width: 14, height: 14, borderRadius: 999, background: p.theme.accent, marginLeft: -4 }} />
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </Step>

      <Step n={2} title="Main color">
        <ColorPicker label="Main color" value={state.primary} swatches={primarySwatches} onChange={(v) => set({ primary: v })} />
        <span style={{ color: ratio >= 4.5 ? theme.color.positiveText : theme.color.warningText }}>
          Text contrast on buttons: {ratio.toFixed(1)}:1 {ratio >= 4.5 ? '✓ readable' : '— too low, pick a deeper or lighter shade'}
        </span>
      </Step>

      <Step n={3} title="Accent color">
        <ColorPicker label="Accent color" value={state.accent} swatches={accentSwatches} onChange={(v) => set({ accent: v })} />
      </Step>

      <Step n={4} title="Font">
        <Choice
          value={state.font}
          options={fontOptions}
          onChange={(v) => set({ font: v })}
          render={(o) => (
            <>
              <span style={{ fontFamily: fontFamilies[o.value], fontSize: 20, lineHeight: 1 }}>Aa</span>
              {o.label}
            </>
          )}
        />
      </Step>

      <Step n={5} title="Corner radius">
        <Choice
          value={state.radius}
          options={radiusOptions}
          onChange={(v) => set({ radius: v })}
          render={(o) => (
            <>
              <span
                style={{
                  width: 34, height: 22, border: `2px solid ${theme.color.secondary}`,
                  borderRadius: radiusOptions.find((r) => r.value === o.value)!.preview,
                }}
              />
              {o.label}
            </>
          )}
        />
      </Step>

      <Step n={6} title="Surfaces">
        <Choice value={state.surface} options={surfaceOptions} onChange={(v) => set({ surface: v })} />
      </Step>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" style={button} onClick={copy}>{copied ? 'Copied ✓' : 'Copy theme JSON'}</button>
        <button type="button" style={button} onClick={reset}>Reset</button>
      </div>
      <span style={{ color: theme.textMutedColor }}>
        Tip: open “Presentation / Brand showcase” to see the whole UI react, and share the page URL to keep the look.
      </span>
    </div>
  )
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Brand builder',
    render: ({ active }) => (
      <AddonPanel active={!!active}>
        <BrandBuilderPanel />
      </AddonPanel>
    ),
  })
})
