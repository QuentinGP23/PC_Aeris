import './Alert.scss'
import type { ReactNode } from 'react'
import { CheckCircle, Warning, XCircle, Info, X } from '@phosphor-icons/react'

type AlertVariant = 'success' | 'warning' | 'error' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const ICONS = { success: CheckCircle, warning: Warning, error: XCircle, info: Info }

function Alert({ variant = 'info', title, children, dismissible = false, onDismiss, className = '' }: AlertProps) {
  const Icon = ICONS[variant]
  return (
    <div className={`alert ${className}`} data-variant={variant} role="alert">
      <span className="alert__icon"><Icon size={20} weight="fill" /></span>
      <div className="alert__content">
        {title && <p className="alert__title">{title}</p>}
        <div className="alert__body">{children}</div>
      </div>
      {dismissible && (
        <button className="alert__dismiss" onClick={onDismiss} aria-label="Fermer"><X size={16} /></button>
      )}
    </div>
  )
}

export default Alert
