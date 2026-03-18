import './Container.scss'
import type { HTMLAttributes, ReactNode } from 'react'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  children: ReactNode
}

function Container({ size = 'lg', children, className = '', ...props }: ContainerProps) {
  return (
    <div className={`container ${className}`} data-size={size} {...props}>
      {children}
    </div>
  )
}
export default Container
