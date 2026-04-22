import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import { useAuth } from '../../../context'
import { useConfigStore } from '../../../store'
import './Header.scss'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/configurateur', label: 'Configurateur' },
]

function Header() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const config = useConfigStore(s => s.config)
  const selectedCount = Object.keys(config).length

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          <span className="nav__logo-mark">⚡</span>
          <span>PC Aeris</span>
        </Link>

        <div className="nav__links">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav__link ${isActive(link.to) ? 'nav__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav__gap" />

        <div className="nav__actions">
          {selectedCount > 0 && (
            <button
              type="button"
              className="nav-badge"
              onClick={() => navigate('/configurateur')}
              aria-label="Voir la configuration"
            >
              <span className="nav-badge__dot" />
              {selectedCount} composant{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </button>
          )}

          {isAuthenticated && user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-ghost">Admin</Link>
              )}
              <Link to="/profile" className="btn-ghost">{user.pseudo || user.email}</Link>
              <button type="button" className="btn-primary" onClick={() => void signOut()}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-ghost">Connexion</Link>
              <Link to="/signup" className="btn-primary">Créer un compte</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav__hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="nav__mobile" onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav__mobile-link ${isActive(link.to) ? 'nav__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="nav__mobile-link">Admin</Link>}
              <Link to="/profile" className="nav__mobile-link">Mon profil</Link>
              <button type="button" className="nav__mobile-link nav__mobile-link--danger" onClick={() => void signOut()}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="nav__mobile-link">Connexion</Link>
              <Link to="/signup" className="nav__mobile-link nav__mobile-link--primary">Créer un compte</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
export default Header
