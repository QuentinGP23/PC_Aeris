import { Link } from 'react-router-dom'
import { Form } from '../../../components/common'
import './SignUp.scss'

function SignUp() {
  const handleSubmit = (values: Record<string, string>) => {
    console.log('SignUp values:', values)
  }

  return (
    <div className="signup">
      <div className="signup__container">
        <h1 className="signup__title">Créer un compte</h1>

        <Form
          fields={[
            { name: 'nom', type: 'text', label: 'Nom', placeholder: 'Votre nom' },
            { name: 'prenom', type: 'text', label: 'Prénom', placeholder: 'Votre prénom' },
            { name: 'pseudo', type: 'text', label: 'Pseudo', placeholder: 'Votre pseudo' },
            { name: 'email', type: 'email', label: 'Email', placeholder: 'exemple@email.com' },
            { name: 'tel', type: 'tel', label: 'Téléphone', placeholder: '06 12 34 56 78' },
            { name: 'password', type: 'password', label: 'Mot de passe', placeholder: '••••••••' }
          ]}
          primaryButton={{ label: "S'inscrire" }}
          fullWidthButtons
          onSubmit={handleSubmit}
        />

        <p className="signup__link">
          Déjà un compte ? <Link to="/admin/authentification/signin">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
