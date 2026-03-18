import './Avatar.scss'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarVariant = 'circle' | 'rounded' | 'square'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  variant?: AvatarVariant
  className?: string
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function Avatar({ src, alt, name, size = 'md', variant = 'circle', className = '' }: AvatarProps) {
  return (
    <div className={`avatar ${className}`} data-size={size} data-variant={variant}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="avatar__img" />
      ) : name ? (
        <span className="avatar__initials">{getInitials(name)}</span>
      ) : (
        <span className="avatar__fallback">?</span>
      )}
    </div>
  )
}

export default Avatar
