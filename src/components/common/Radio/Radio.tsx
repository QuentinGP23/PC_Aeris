import './Radio.scss'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

type RadioSize = 'sm' | 'md' | 'lg'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode
  size?: RadioSize
  error?: string
  hint?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, size = 'md', error, hint, disabled, checked, className = '', ...props }, ref) => {
    return (
      <div className={`radio ${className}`} data-size={size} data-disabled={disabled} data-error={!!error} data-checked={checked}>
        <label className="radio__wrapper">
          <input ref={ref} type="radio" className="radio__input" disabled={disabled} checked={checked} {...props} />
          <span className="radio__circle">
            {checked && <span className="radio__dot" />}
          </span>
          {label && <span className="radio__label">{label}</span>}
        </label>
        {error && <span className="radio__error">{error}</span>}
        {hint && !error && <span className="radio__hint">{hint}</span>}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
export default Radio
