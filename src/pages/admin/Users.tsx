import { useAuth } from "../../context";

function AdminUsers() {
  const { user } = useAuth();

  // TODO: Fetch users from API
  const users = [
    { id: "1", email: "user1@test.com", pseudo: "User1", role: "user" },
    { id: "2", email: "admin@test.com", pseudo: "Admin", role: "admin" },
  ];

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <p>Connecté en tant que : {user?.email}</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Pseudo</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.pseudo}</td>
              <td>{u.role}</td>
              <td>
                <button>Modifier</button>
                <button>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
