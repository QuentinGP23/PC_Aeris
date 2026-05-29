import { Link, useLocation } from 'react-router-dom'
import { type ReactNode, useEffect, useState } from 'react'
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Ferme le drawer à chaque changement de route.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Empêche le scroll body quand drawer ouvert.
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const sidebar = (
    <>
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
              onClick={() => setDrawerOpen(false)}
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
        <button type="button" className="admin-nav__back" onClick={() => signOut()}>Déconnexion</button>
      </div>
    </>
  )

  return (
    <div className="admin-wrap">
      {/* Sidebar desktop : toujours visible en grid à gauche. */}
      <aside className="admin-nav admin-nav--desktop">
        {sidebar}
      </aside>

      {/* Drawer mobile : overlay + panneau slide-in à gauche. */}
      {drawerOpen && (
        <div className="admin-drawer">
          <div className="admin-drawer__backdrop" onClick={() => setDrawerOpen(false)} />
          <aside className="admin-nav admin-nav--mobile">
            <button
              type="button"
              className="admin-drawer__close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fermer le menu"
            >
              ×
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="admin-content">
        <div className="admin-hd">
          <button
            type="button"
            className="admin-hd__burger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu admin"
          >
            <span /><span /><span />
          </button>
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
