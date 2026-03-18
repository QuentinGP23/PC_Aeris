import './Card.scss'
import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'default' | 'outlined' | 'elevated' | 'flat'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  clickable?: boolean
  children: ReactNode
}

function Card({ variant = 'default', padding = 'md', hoverable = false, clickable = false, children, className = '', ...props }: CardProps) {
  return (
    <div className={`card ${className}`} data-variant={variant} data-padding={padding} data-hoverable={hoverable} data-clickable={clickable} {...props}>
      {children}
    </div>
  )
}

interface CardSectionProps { children: ReactNode; className?: string }

function CardHeader({ children, className = '' }: CardSectionProps) {
  return <div className={`card__header ${className}`}>{children}</div>
}

function CardBody({ children, className = '' }: CardSectionProps) {
  return <div className={`card__body ${className}`}>{children}</div>
}

function CardFooter({ children, className = '' }: CardSectionProps) {
  return <div className={`card__footer ${className}`}>{children}</div>
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
