import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { Button, Input, Form, Checkbox } from "../../components/common";

function SignIn() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const { error } = await signIn({
      email: formData.email,
      password: formData.password,
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
        <h1>Connexion</h1>

        <Form onSubmit={handleSubmit}>
          {error && <Form.Error message={error} />}

          <Form.Group>
            <Input
              type="email"
              label="Email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleChange("email")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Group>
            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange("password")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Row>
            <Checkbox
              label="Se souvenir de moi"
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
            />
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </Form.Row>

          <Form.Actions>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Se connecter
            </Button>
          </Form.Actions>
        </Form>

        <p>
          Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
