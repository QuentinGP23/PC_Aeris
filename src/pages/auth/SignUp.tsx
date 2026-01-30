import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { Button, Input, Form, Checkbox } from "../../components/common";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    pseudo: "",
    firstName: "",
    lastName: "",
    phone: "",
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, acceptTerms: e.target.checked }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.email || !formData.password || !formData.pseudo) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      pseudo: formData.pseudo,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });

    if (error) {
      setError(error);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1>Créer un compte</h1>

        <Form onSubmit={handleSubmit}>
          {error && <Form.Error message={error} />}

          <Form.Row columns={2}>
            <Form.Group>
              <Input
                type="text"
                label="Prénom"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                fullWidth
              />
            </Form.Group>

            <Form.Group>
              <Input
                type="text"
                label="Nom"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                fullWidth
              />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Input
              type="text"
              label="Pseudo *"
              placeholder="Votre pseudo"
              value={formData.pseudo}
              onChange={handleChange("pseudo")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Group>
            <Input
              type="email"
              label="Email *"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleChange("email")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Group>
            <Input
              type="tel"
              label="Téléphone"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange("phone")}
              fullWidth
            />
          </Form.Group>

          <Form.Divider />

          <Form.Group>
            <Input
              type="password"
              label="Mot de passe *"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange("password")}
              hint="Minimum 6 caractères"
              required
              fullWidth
            />
          </Form.Group>

          <Form.Group>
            <Input
              type="password"
              label="Confirmer le mot de passe *"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Group>
            <Checkbox
              label="J'accepte les conditions d'utilisation et la politique de confidentialité"
              checked={formData.acceptTerms}
              onChange={handleCheckboxChange}
            />
          </Form.Group>

          <Form.Actions>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Créer mon compte
            </Button>
          </Form.Actions>
        </Form>

        <p>
          Déjà un compte ? <Link to="/signin">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
