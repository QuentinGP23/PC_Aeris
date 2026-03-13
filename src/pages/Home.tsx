import { Link } from "react-router-dom";
import { useAuth } from "../context";
import { Button } from "../components/common";
import { HeroBanner } from "../components/ui";

function Home() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div>
      <HeroBanner />

      <section style={{ padding: "2rem" }}>
        {isAuthenticated && user ? (
          <div>
            <h2>Mon profil</h2>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: 2 }}>
              <li><strong>ID :</strong> {user.id}</li>
              <li><strong>Email :</strong> {user.email}</li>
              <li><strong>Pseudo :</strong> {user.pseudo || "—"}</li>
              <li><strong>Prénom :</strong> {user.firstName || "—"}</li>
              <li><strong>Nom :</strong> {user.lastName || "—"}</li>
              <li><strong>Téléphone :</strong> {user.phone || "—"}</li>
              <li><strong>Rôle :</strong> {user.role}</li>
              <li><strong>Créé le :</strong> {new Date(user.createdAt).toLocaleDateString("fr-FR")}</li>
              <li><strong>Mis à jour le :</strong> {new Date(user.updatedAt).toLocaleDateString("fr-FR")}</li>
            </ul>

            {user.role === "admin" && (
              <Link to="/admin">
                <Button variant="secondary">Admin Dashboard</Button>
              </Link>
            )}

            <Button onClick={() => signOut()} variant="outline">
              Déconnexion
            </Button>
          </div>
        ) : (
          <div>
            <Link to="/signin">
              <Button>Connexion</Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary">Créer un compte</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
