import './Toggle.scss'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

type ToggleSize = 'sm' | 'md' | 'lg'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode
  size?: ToggleSize
  hint?: string
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, size = 'md', hint, disabled, checked, className = '', ...props }, ref) => {
    return (
      <div className={`toggle ${className}`} data-size={size} data-disabled={disabled} data-checked={checked}>
        <label className="toggle__wrapper">
          <input ref={ref} type="checkbox" className="toggle__input" disabled={disabled} checked={checked} role="switch" {...props} />
          <span className="toggle__track">
            <span className="toggle__thumb" />
          </span>
          {label && <span className="toggle__label">{label}</span>}
        </label>
        {hint && <span className="toggle__hint">{hint}</span>}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
export default Toggle
