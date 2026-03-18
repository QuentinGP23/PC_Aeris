import './Badge.scss'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  rounded?: boolean
  className?: string
}

function Badge({ children, variant = 'default', size = 'md', dot = false, rounded = false, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${className}`} data-variant={variant} data-size={size} data-rounded={rounded}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  )
}

export default Badge
