import { Link, useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useAuth } from '../../../context'
import './AdminLayout.scss'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '◧' },
  { to: '/admin/users', label: 'Utilisateurs', icon: '◉' },
  { to: '/admin/products', label: 'Produits', icon: '◫' },
]

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  eyebrow?: string
  ghost?: string
  actions?: ReactNode
}

function AdminLayout({ children, title, eyebrow = 'Administration', ghost, actions }: AdminLayoutProps) {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  return (
    <div className="admin-wrap">
      <aside className="admin-nav">
        <div className="admin-nav__hd">
          <span className="admin-nav__label">PC Aeris</span>
          <div className="admin-nav__title">Console Admin</div>
        </div>

        <div className="admin-nav__body">
          <div className="admin-nav__section">Pilotage</div>
          {NAV_ITEMS.map((it) => {
            const active = pathname === it.to
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`admin-nav__item ${active ? 'admin-nav__item--act' : ''}`}
              >
                <span className="admin-nav__item-ico">{it.icon}</span>
                <span>{it.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="admin-nav__ft">
          {user && (
            <div className="admin-nav__who">
              <div className="admin-nav__who-name">{user.pseudo || user.email}</div>
              <div className="admin-nav__who-role">Administrateur</div>
            </div>
          )}
          <Link to="/" className="admin-nav__back">← Retour au site</Link>
          <button className="admin-nav__back" onClick={() => signOut()}>Déconnexion</button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-hd">
          <div className="admin-hd__left">
            <div className="admin-hd__eyebrow">{eyebrow}</div>
            {title && <div className="admin-hd__title">{title}</div>}
          </div>
          {actions && <div className="admin-hd__actions">{actions}</div>}
          {ghost && <div className="admin-hd__ghost">{ghost}</div>}
        </div>
        <div className="admin-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
