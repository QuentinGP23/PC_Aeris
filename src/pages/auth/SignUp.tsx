import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context'
import { validateSignUpData } from '../../services/auth.service'
import { AuthVisual } from './AuthVisual'
import './auth.scss'

function SignUp() {
  const { signUp, isLoading } = useAuth()

  const [form, setForm] = useState({
    pseudo: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirm: '',
    acceptTerms: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = k === 'acceptTerms' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [k]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pseudo || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (!form.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.")
      return
    }

    const validationError = validateSignUpData({
      email: form.email,
      password: form.password,
      pseudo: form.pseudo,
      firstName: form.firstName,
      lastName: form.lastName,
    })
    if (validationError) {
      setError(validationError)
      return
    }

    const { error: authError } = await signUp({
      email: form.email,
      password: form.password,
      pseudo: form.pseudo,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    })

    if (authError) {
      setError(authError)
    } else {
      setEmailSent(true)
    }
  }

  if (emailSent) {
    return (
      <div className="auth-page">
        <AuthVisual />
        <div className="auth-form-side">
          <div className="auth-form">
            <h1 className="auth-form__h1">Vérifie ta boîte mail</h1>
            <p className="auth-form__sub">
              Un email de confirmation a été envoyé à <strong style={{ color: 'var(--text)' }}>{form.email}</strong>.
              Clique sur le lien pour activer ton compte.
            </p>
            <Link to="/signin" className="auth-cta" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <AuthVisual />
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form__h1">Créer un compte</h1>
          <p className="auth-form__sub">Rejoins la communauté et sauvegarde tes configurations.</p>

          {error && <div className="auth-err">{error}</div>}

          <div className="fg">
            <label className="fg__l" htmlFor="su-pseudo">Pseudo *</label>
            <input
              id="su-pseudo"
              className="fg__in"
              type="text"
              placeholder="supergamer42"
              value={form.pseudo}
              onChange={set('pseudo')}
              required
            />
          </div>

          <div className="fg">
            <label className="fg__l" htmlFor="su-email">Email *</label>
            <input
              id="su-email"
              className="fg__in"
              type="email"
              placeholder="exemple@email.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              required
            />
          </div>

          <div className="fg">
            <label className="fg__l" htmlFor="su-password">Mot de passe *</label>
            <input
              id="su-password"
              className="fg__in"
              type="password"
              placeholder="6 caractères minimum"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              required
            />
            <div className="fg__hint">Minimum 6 caractères</div>
          </div>

          <div className="fg">
            <label className="fg__l" htmlFor="su-confirm">Confirmer le mot de passe *</label>
            <input
              id="su-confirm"
              className="fg__in"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set('confirm')}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <label>
              <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} />
              <span>
                J'accepte les <Link to="/cgv" style={{ color: 'var(--ind-l)' }}>CGV</Link> et la{' '}
                <Link to="/confidentialite" style={{ color: 'var(--ind-l)' }}>politique de confidentialité</Link>
              </span>
            </label>
          </div>

          <button type="submit" className="auth-cta" disabled={isLoading}>
            {isLoading ? 'Création…' : 'Créer mon compte'}
          </button>

          <div className="auth-switch">
            Déjà un compte ? <Link to="/signin">Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
