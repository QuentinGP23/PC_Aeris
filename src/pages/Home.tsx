import { Link } from "react-router-dom";
import { useAuth } from "../context";
import { Button } from "../components/common";

function Home() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div>
      <h1>PC Aeris</h1>
      <p>Configurateur de PC sur mesure</p>

      {isAuthenticated ? (
        <div>
          <p>Bienvenue, {user?.pseudo || user?.email} !</p>
          <p>Rôle : {user?.role}</p>

          {user?.role === "admin" && (
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
    </div>
  );
}

export default Home;
