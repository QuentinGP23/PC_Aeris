import { Link } from "react-router-dom";
import { useAuth } from "../../context";
import { Button } from "../../components/common";

function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Bienvenue, {user?.pseudo || user?.email}</p>

      <nav>
        <ul>
          <li>
            <Link to="/admin/users">Gestion des utilisateurs</Link>
          </li>
          <li>
            <Link to="/admin/components">Gestion des composants</Link>
          </li>
          <li>
            <Link to="/admin/orders">Gestion des commandes</Link>
          </li>
        </ul>
      </nav>

      <Link to="/">
        <Button variant="secondary">Retour au site</Button>
      </Link>

      <Button onClick={() => signOut()} variant="outline">
        Déconnexion
      </Button>
    </div>
  );
}

export default AdminDashboard;
