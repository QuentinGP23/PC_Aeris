import './Textarea.scss'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

type TextareaSize = 'sm' | 'md' | 'lg'
type TextareaVariant = 'default' | 'filled' | 'outline'
type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize
  variant?: TextareaVariant
  label?: string
  error?: string
  hint?: string
  resize?: TextareaResize
  fullWidth?: boolean
  showCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'md', variant = 'default', label, error, hint, resize = 'vertical', fullWidth = false, showCount = false, maxLength, disabled, className = '', value, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0
    return (
      <div className={`textarea ${className}`} data-size={size} data-variant={variant} data-full-width={fullWidth} data-disabled={disabled} data-error={!!error}>
        {label && <label className="textarea__label" htmlFor={props.id || props.name}>{label}</label>}
        <textarea ref={ref} className="textarea__field" disabled={disabled} maxLength={maxLength} value={value} style={{ resize }} {...props} />
        <div className="textarea__footer">
          {error && <span className="textarea__error">{error}</span>}
          {hint && !error && <span className="textarea__hint">{hint}</span>}
          {showCount && maxLength && <span className="textarea__count">{charCount}/{maxLength}</span>}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
