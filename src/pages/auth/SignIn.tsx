import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'
import { useToast } from '../../store'
import { AuthVisual } from './AuthVisual'
import './auth.scss'

function SignIn() {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState({ identifier: '', password: '', rememberMe: false })
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = k === 'rememberMe' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [k]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.identifier || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    const { user, error: authError } = await signIn({
      identifier: form.identifier,
      password: form.password,
    })
    if (authError) {
      setError(authError)
    } else if (user) {
      toast.success(`Bienvenue ${user.pseudo ?? user.firstName ?? ''} !`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    }
  }

  return (
    <div className="auth-page">
      <AuthVisual />
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form__h1">Connexion</h1>
          <p className="auth-form__sub">Bienvenue de retour. Connecte-toi pour accéder à tes configs.</p>

          {error && <div className="auth-err">{error}</div>}

          <div className="fg">
            <label className="fg__l" htmlFor="auth-identifier">Email ou pseudo</label>
            <input
              id="auth-identifier"
              className="fg__in"
              type="text"
              placeholder="exemple@email.com"
              value={form.identifier}
              onChange={set('identifier')}
              autoComplete="username"
              required
            />
          </div>

          <div className="fg">
            <label className="fg__l" htmlFor="auth-password">Mot de passe</label>
            <input
              id="auth-password"
              className="fg__in"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-row">
            <label>
              <input type="checkbox" checked={form.rememberMe} onChange={set('rememberMe')} />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="auth-cta" disabled={isLoading}>
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </button>

          <div className="auth-switch">
            Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
