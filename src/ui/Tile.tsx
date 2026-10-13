import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import type { Tone } from '.'

export function Tile({
  icon,
  label,
  value,
  unit,
  tone = 'neutral',
  progress,
  wide,
  children,
}: {
  icon?: IconName
  label: string
  value?: ReactNode
  unit?: string
  tone?: Tone
  /** 0-100, renders a thin progress bar under the value. */
  progress?: number
  wide?: boolean
  children?: ReactNode
}) {
  return (
    <section className={`tile tile--${tone} ${wide ? 'tile--wide' : ''}`}>
      <header className="tile__label">
        {icon && <Icon name={icon} size={18} />}
        {label}
      </header>
      {value !== undefined && (
        <div className="tile__value">
          {value}
          {unit && <small>{unit}</small>}
        </div>
      )}
      {progress !== undefined && (
        <div className="tile__bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {children}
    </section>
  )
}
