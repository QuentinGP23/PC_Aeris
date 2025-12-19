import './Button.scss'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'main' | 'secondary'
  fullWidth?: boolean
  onClick?: () => void
}

function Button({ children, variant = 'main', fullWidth = false, onClick }: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${fullWidth ? 'button--full' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
