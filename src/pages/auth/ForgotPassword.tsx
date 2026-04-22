import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context'
import { AuthVisual } from './AuthVisual'
import './auth.scss'

function ForgotPassword() {
  const { resetPassword, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Veuillez entrer votre email.')
      return
    }
    const { error: authError } = await resetPassword(email)
    if (authError) setError(authError)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="auth-page">
        <AuthVisual />
        <div className="auth-form-side">
          <div className="auth-form">
            <h1 className="auth-form__h1">Email envoyé</h1>
            <p className="auth-form__sub">
              Si un compte existe avec <strong style={{ color: 'var(--text)' }}>{email}</strong>,
              tu recevras un email avec les instructions pour réinitialiser ton mot de passe.
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
          <h1 className="auth-form__h1">Mot de passe oublié</h1>
          <p className="auth-form__sub">
            Entre ton email et nous t'enverrons un lien pour réinitialiser ton mot de passe.
          </p>

          {error && <div className="auth-err">{error}</div>}

          <div className="fg">
            <label className="fg__l" htmlFor="fp-email">Email</label>
            <input
              id="fp-email"
              className="fg__in"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="auth-cta" disabled={isLoading}>
            {isLoading ? 'Envoi…' : 'Envoyer le lien'}
          </button>

          <div className="auth-switch">
            <Link to="/signin">← Retour à la connexion</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
