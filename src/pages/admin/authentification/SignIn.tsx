import { Link } from 'react-router-dom'
import { Form } from '../../../components/common'
import './SignIn.scss'

function SignIn() {
  const handleSubmit = (values: Record<string, string>) => {
    console.log('SignIn values:', values)
  }

  return (
    <div className="signin">
      <div className="signin__container">
        <h1 className="signin__title">Connexion</h1>

        <Form
          fields={[
            { name: 'email', type: 'email', label: 'Email ou Pseudo', placeholder: 'Entrez votre email ou pseudo' },
            { name: 'password', type: 'password', label: 'Mot de passe', placeholder: '••••••••' }
          ]}
          primaryButton={{ label: 'Se connecter' }}
          fullWidthButtons
          onSubmit={handleSubmit}
        />

        <p className="signin__link">
          Pas encore de compte ? <Link to="/admin/authentification/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
