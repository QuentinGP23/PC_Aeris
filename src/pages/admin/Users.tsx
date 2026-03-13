import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context";
import { adminService } from "../../services";
import type { AdminUser } from "../../services";
import { Button, Input, Select } from "../../components/common";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    pseudo: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "user",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { users: data, error: err } = await adminService.listUsers();
    setUsers(data);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setEditForm({
      pseudo: u.pseudo || "",
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      phone_number: u.phone_number || "",
      role: u.role || "user",
    });
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    const { error: err } = await adminService.updateUser(editingUser.id, editForm);
    setEditLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setEditingUser(null);
    fetchUsers();
  };

  const openDelete = (u: AdminUser) => {
    setDeletingUser(u);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    const { error: err } = await adminService.deleteUser(deletingUser.id);
    setDeleteLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setDeletingUser(null);
    fetchUsers();
  };

  return (
    <div className="admin-users">
      <h1>Gestion des utilisateurs</h1>
      <p>Connect&eacute; en tant que : {user?.email}</p>

      {error && (
        <div className="admin-users__error">
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Fermer
          </Button>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Pseudo</th>
              <th>Pr&eacute;nom</th>
              <th>Nom</th>
              <th>R&ocirc;le</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.pseudo || "-"}</td>
                <td>{u.first_name || "-"}</td>
                <td>{u.last_name || "-"}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="admin-users__actions">
                  <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDelete(u)}
                    disabled={u.id === user?.id}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Edit */}
      {editingUser && (
        <div className="admin-users__modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-users__modal" onClick={(e) => e.stopPropagation()}>
            <h2>Modifier l'utilisateur</h2>
            <p className="admin-users__modal-email">{editingUser.email}</p>

            <Input
              label="Pseudo"
              value={editForm.pseudo}
              onChange={(e) => setEditForm({ ...editForm, pseudo: e.target.value })}
              fullWidth
            />
            <Input
              label="Pr&eacute;nom"
              value={editForm.first_name}
              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
              fullWidth
            />
            <Input
              label="Nom"
              value={editForm.last_name}
              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
              fullWidth
            />
            <Input
              label="T&eacute;l&eacute;phone"
              type="tel"
              value={editForm.phone_number}
              onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
              fullWidth
            />
            <Select
              label="R&ocirc;le"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              options={[
                { value: "user", label: "Utilisateur" },
                { value: "admin", label: "Administrateur" },
              ]}
              fullWidth
            />

            <div className="admin-users__modal-actions">
              <Button variant="secondary" onClick={() => setEditingUser(null)}>
                Annuler
              </Button>
              <Button onClick={handleEdit} isLoading={editLoading}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deletingUser && (
        <div className="admin-users__modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="admin-users__modal" onClick={(e) => e.stopPropagation()}>
            <h2>Supprimer l'utilisateur</h2>
            <p>
              Es-tu s&ucirc;r de vouloir supprimer <strong>{deletingUser.pseudo || deletingUser.email}</strong> ?
            </p>
            <p className="admin-users__modal-warning">Cette action est irr&eacute;versible.</p>

            <div className="admin-users__modal-actions">
              <Button variant="secondary" onClick={() => setDeletingUser(null)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={handleDelete} isLoading={deleteLoading}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      <Link to="/admin">
        <Button variant="secondary">Retour au dashboard</Button>
      </Link>
    </div>
  );
}

export default AdminUsers;
