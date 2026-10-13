import { useState, type ChangeEvent, type CSSProperties } from 'react'
import { useApp } from '../state/AppContext'
import {
  contrastOnPrimary,
  defaultCustomTheme,
  fontOptions,
  hexOk,
  themeToVars,
  type CustomTheme,
} from '../theme/custom'
import type { Mode } from '../theme/brands'
import { deviceData as d, temperatureSeriesDay } from '../data/mock'
import { Badge, Button, Card, Field, PageTitle, Segmented } from '../ui'
import { Icon } from '../ui/Icon'
import { Tile } from '../ui/Tile'
import { LineChartView } from '../ui/Charts'

const MAX_LOGO_BYTES = 150 * 1024

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="color-field">
        <input type="color" value={hexOk(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <input className={`input ${hexOk(value) ? '' : 'input--error'}`} value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} maxLength={7} />
      </div>
    </div>
  )
}

/** Renders real components under the draft variables, so what you see is what ships. */
function ThemePreview({ theme, mode }: { theme: CustomTheme; mode: Mode }) {
  const { t, temp } = useApp()
  const style = { ...themeToVars(theme, mode), fontFamily: 'var(--font)', color: 'var(--text)' } as CSSProperties
  return (
    <div className="tb-preview" data-brand="ecovent" data-theme={mode} style={style}>
      <div className="tb-preview__bar">
        <span className="logo">
          <span className="logo__mark">
            {theme.logo ? <img src={theme.logo} alt="" className="logo__img" /> : <Icon name="wind" size={22} />}
          </span>
          {theme.name || '—'}
        </span>
        <span className="nav-pill">
          <a className="active">{t('nav_dashboard')}</a>
          <a>{t('nav_charts')}</a>
        </span>
      </div>
      <h3 className="tb-preview__title">{t(mode === 'light' ? 'theme_light' : 'theme_dark')}</h3>
      <Tile icon="thermo" label={t('tile_supply')} value={temp(d.supply)} />
      <Tile icon="chart" label={t('tile_temp_chart')}>
        <LineChartView
          data={temperatureSeriesDay}
          height={120}
          legend={false}
          series={[
            { key: 'supply', name: t('tile_supply'), color: 'var(--chart-1)' },
            { key: 'outdoor', name: t('tile_outdoor'), color: 'var(--chart-2)' },
          ]}
        />
      </Tile>
      <Field label={t('email')} placeholder="you@example.com" />
      <div className="tb-preview__row">
        <Button>{t('save')}</Button>
        <Button variant="secondary">{t('cancel')}</Button>
        <Badge tone="ok">{t('conn_online')}</Badge>
      </div>
    </div>
  )
}

export function ThemeBuilderPage() {
  const { t, customTheme, setCustomTheme } = useApp()
  const [draft, setDraft] = useState<CustomTheme>(customTheme ?? defaultCustomTheme)
  const [logoError, setLogoError] = useState('')
  const [notice, setNotice] = useState('')

  const patch = (p: Partial<CustomTheme>) => setDraft((d) => ({ ...d, ...p }))
  const flash = (text: string) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 2500)
  }

  // Colors only reach the preview once they are valid hex, so typing never breaks the page.
  const valid = hexOk(draft.primary) && hexOk(draft.accent)
  const preview = valid ? draft : { ...draft, primary: hexOk(draft.primary) ? draft.primary : '#6a4a8c', accent: hexOk(draft.accent) ? draft.accent : '#e8a93a' }
  const ratioLight = contrastOnPrimary(preview, 'light')
  const ratioDark = contrastOnPrimary(preview, 'dark')
  const ratio = Math.min(ratioLight, ratioDark)

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!/^image\/(png|jpeg|svg\+xml)$/.test(file.type) || file.size > MAX_LOGO_BYTES) {
      setLogoError(t('tb_logo_err'))
      return
    }
    setLogoError('')
    const reader = new FileReader()
    reader.onload = () => patch({ logo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  const apply = () => {
    setCustomTheme(preview)
    flash(t('tb_applied'))
  }
  const reset = () => {
    setCustomTheme(null)
    setDraft(defaultCustomTheme)
    setLogoError('')
    flash(t('tb_reset_done'))
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ ...preview, logo: preview.logo ? '(data-url)' : undefined }, null, 2))
      flash(t('tb_copied'))
    } catch {
      flash('—')
    }
  }

  return (
    <>
      <PageTitle title={t('brand_settings')} />
      <p className="muted" style={{ marginTop: -16, marginBottom: 24 }}>{t('tb_sub')}</p>
      <div className="tb">
        <Card className="tb__form">
          <Field label={t('tb_name')} value={draft.name} maxLength={24} onChange={(e) => patch({ name: e.target.value })} />
          <ColorField label={t('tb_primary')} value={draft.primary} onChange={(v) => patch({ primary: v })} />
          <ColorField label={t('tb_accent')} value={draft.accent} onChange={(v) => patch({ accent: v })} />
          <div className="tb__contrast">
            <Badge tone={ratio >= 4.5 ? 'ok' : 'warn'}>
              {t('tb_contrast')}: {ratio.toFixed(1)}:1
            </Badge>
            {ratio < 4.5 && <span className="field__hint">{t('tb_contrast_warn')}</span>}
          </div>

          <div className="field">
            <label>{t('tb_font')}</label>
            <Segmented value={draft.font} onChange={(v) => patch({ font: v })} options={fontOptions} />
          </div>
          <div className="field">
            <label>{t('tb_radius')}</label>
            <Segmented
              value={draft.radius}
              onChange={(v) => patch({ radius: v })}
              options={[
                { value: 'sharp', label: t('tb_radius_sharp') },
                { value: 'soft', label: t('tb_radius_soft') },
                { value: 'round', label: t('tb_radius_round') },
              ]}
            />
          </div>
          <div className="field">
            <label>{t('tb_surface')}</label>
            <Segmented
              value={draft.surface}
              onChange={(v) => patch({ surface: v })}
              options={[{ value: 'glass', label: t('tb_surface_glass') }, { value: 'flat', label: t('tb_surface_flat') }]}
            />
          </div>

          <div className="field">
            <label>{t('tb_logo')}</label>
            <div className="tb__logo">
              {draft.logo && <img src={draft.logo} alt="" />}
              <label className="btn btn--secondary btn--sm">
                {t('tb_logo_upload')}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={onLogo} hidden />
              </label>
              {draft.logo && <Button variant="ghost" size="sm" onClick={() => patch({ logo: undefined })}>{t('cancel')}</Button>}
            </div>
            {logoError ? <span className="field__error">{logoError}</span> : <span className="field__hint">{t('tb_logo_hint')}</span>}
          </div>

          <div className="tb__actions">
            <Button onClick={apply} disabled={!valid}>{t('tb_apply')}</Button>
            <Button variant="secondary" onClick={copy}>{t('tb_export')}</Button>
            <Button variant="ghost" onClick={reset}>{t('tb_reset')}</Button>
          </div>
          {notice && <span className="field__hint" role="status">{notice}</span>}
        </Card>

        <div className="tb__previews">
          <ThemePreview theme={preview} mode="light" />
          <ThemePreview theme={preview} mode="dark" />
        </div>
      </div>
    </>
  )
}
