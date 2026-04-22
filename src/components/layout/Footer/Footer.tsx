import { Link } from 'react-router-dom'
import './Footer.scss'

const LEGAL_LINKS = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/cgv', label: 'CGV' },
  { to: '/confidentialite', label: 'Confidentialité' },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="c">
        <div className="footer__inner">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark">⚡</span>
            <span>PC Aeris</span>
          </Link>

          <div className="footer__links">
            {LEGAL_LINKS.map(link => (
              <Link key={link.to} to={link.to} className="footer__link">{link.label}</Link>
            ))}
          </div>

          <div className="footer__copy">© {new Date().getFullYear()} PC Aeris. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
