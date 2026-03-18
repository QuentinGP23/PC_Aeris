import './Divider.scss'
import type { ReactNode } from 'react'

type DividerOrientation = 'horizontal' | 'vertical'
type DividerVariant = 'solid' | 'dashed' | 'dotted'

interface DividerProps {
  orientation?: DividerOrientation
  variant?: DividerVariant
  label?: ReactNode
  className?: string
}

function Divider({ orientation = 'horizontal', variant = 'solid', label, className = '' }: DividerProps) {
  return (
    <div className={`divider ${className}`} data-orientation={orientation} data-variant={variant} role="separator">
      {label && <span className="divider__label">{label}</span>}
    </div>
  )
}

export default Divider
