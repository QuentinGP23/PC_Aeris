import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'
import { AuthVisual } from './AuthVisual'
import './auth.scss'

function ResetPassword() {
  const navigate = useNavigate()
  const { updatePassword, isLoading } = useAuth()

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.password || !form.confirm) {
      setError('Veuillez remplir tous les champs.')
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
    const { error: authError } = await updatePassword(form.password)
    if (authError) setError(authError)
    else navigate('/signin')
  }

  return (
    <div className="auth-page">
      <AuthVisual />
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form__h1">Nouveau mot de passe</h1>
          <p className="auth-form__sub">Choisis un mot de passe sécurisé pour ton compte.</p>

          {error && <div className="auth-err">{error}</div>}

          <div className="fg">
            <label className="fg__l" htmlFor="rp-password">Nouveau mot de passe</label>
            <input
              id="rp-password"
              className="fg__in"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              required
            />
            <div className="fg__hint">Minimum 6 caractères</div>
          </div>

          <div className="fg">
            <label className="fg__l" htmlFor="rp-confirm">Confirmer le mot de passe</label>
            <input
              id="rp-confirm"
              className="fg__in"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set('confirm')}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-cta" disabled={isLoading}>
            {isLoading ? 'Mise à jour…' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
