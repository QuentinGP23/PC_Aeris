import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { Button, Input, Form } from "../../components/common";
import "./auth.scss";

function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleSubmit = async () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs");
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

    const { error } = await updatePassword(formData.password);

    if (error) {
      setError(error);
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1>Nouveau mot de passe</h1>

        <Form onSubmit={handleSubmit}>
          {error && <Form.Error message={error} />}

          <Form.Group>
            <Input
              type="password"
              label="Nouveau mot de passe"
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
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
              fullWidth
            />
          </Form.Group>

          <Form.Actions>
            <Button type="submit" isLoading={isLoading} fullWidth>
              Réinitialiser le mot de passe
            </Button>
          </Form.Actions>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
