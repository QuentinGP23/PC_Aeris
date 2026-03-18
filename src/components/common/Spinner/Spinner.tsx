import './Spinner.scss'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'primary' | 'white' | 'neutral'

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  className?: string
}

function Spinner({ size = 'md', variant = 'primary', label, className = '' }: SpinnerProps) {
  return (
    <span className={`spinner ${className}`} data-size={size} data-variant={variant} role="status">
      <span className="spinner__circle" />
      {label && <span className="spinner__label">{label}</span>}
    </span>
  )
}

export default Spinner
