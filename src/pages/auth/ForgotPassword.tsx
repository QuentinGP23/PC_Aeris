import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context";
import { Button, Input, Form } from "../../components/common";
import "./auth.scss";

function ForgotPassword() {
  const { resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    const { error } = await resetPassword(email);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-page__container">
          <h1>Email envoyé !</h1>
          <p>
            Si un compte existe avec l'adresse {email}, vous recevrez un email
            avec les instructions pour réinitialiser votre mot de passe.
          </p>
          <Link to="/signin">Retour à la connexion</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1>Mot de passe oublié</h1>
        <p>
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        <Form onSubmit={handleSubmit}>
          {error && <Form.Error message={error} />}

          <Form.Group>
            <Input
              type="email"
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Actions>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Envoyer le lien
            </Button>
          </Form.Actions>
        </Form>

        <p>
          <Link to="/signin">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
