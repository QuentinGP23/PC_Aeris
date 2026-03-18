import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { List, X, ComputerTower } from '@phosphor-icons/react'
import { useAuth } from '../../../context'
import './Header.scss'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/configurateur', label: 'Configurateur' },
]

function Header() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <ComputerTower size={28} weight="fill" />
          <span className="header__logo-text">PC Aeris</span>
        </Link>

        {/* Desktop nav */}
        <nav className="header__nav">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className={`header__nav-link ${pathname === link.to ? 'header__nav-link--active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {isAuthenticated && user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="header__nav-link">Admin</Link>
              )}
              <div className="header__user">
                <span className="header__user-name">{user.pseudo || user.email}</span>
                <button className="header__signout" onClick={() => signOut()}>Déconnexion</button>
              </div>
            </>
          ) : (
            <div className="header__auth">
              <Link to="/signin" className="header__btn header__btn--ghost">Connexion</Link>
              <Link to="/signup" className="header__btn header__btn--primary">Créer un compte</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="header__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="header__mobile-menu" onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className={`header__mobile-link ${pathname === link.to ? 'header__mobile-link--active' : ''}`}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="header__mobile-link">Admin</Link>}
              <button className="header__mobile-signout" onClick={() => signOut()}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="header__mobile-link">Connexion</Link>
              <Link to="/signup" className="header__mobile-link header__mobile-link--primary">Créer un compte</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
export default Header
