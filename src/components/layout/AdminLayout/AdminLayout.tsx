import { Link, useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'
import { Gauge, Users, Package, ComputerTower, SignOut } from '@phosphor-icons/react'
import { useAuth } from '../../../context'
import './AdminLayout.scss'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: Gauge },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/products', label: 'Produits', icon: Package },
]

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

function AdminLayout({ children, title }: AdminLayoutProps) {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__sidebar-header">
          <Link to="/" className="admin-layout__brand">
            <ComputerTower size={22} weight="fill" />
            <span>PC Aeris</span>
          </Link>
          <span className="admin-layout__badge">Admin</span>
        </div>

        <nav className="admin-layout__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`admin-layout__nav-item ${pathname === to ? 'admin-layout__nav-item--active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-layout__sidebar-footer">
          <div className="admin-layout__user">
            <span className="admin-layout__user-name">{user?.pseudo || user?.email}</span>
            <span className="admin-layout__user-role">Administrateur</span>
          </div>
          <button className="admin-layout__signout" onClick={() => signOut()} title="Déconnexion">
            <SignOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-layout__main">
        {title && (
          <div className="admin-layout__page-header">
            <h1>{title}</h1>
          </div>
        )}
        <div className="admin-layout__content">
          {children}
        </div>
      </div>
    </div>
  )
}
export default AdminLayout
