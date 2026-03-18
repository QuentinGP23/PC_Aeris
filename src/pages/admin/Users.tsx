import './Users.scss'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context'
import { adminService, type AdminUser } from '../../services'
import { Button, Input, Select, Table, Modal, Badge, Alert, Spinner, Avatar } from '../../components/common'
import './Users.scss'

const ROLE_OPTIONS = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'admin', label: 'Administrateur' },
]

function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState({ pseudo: '', first_name: '', last_name: '', phone_number: '', role: 'user' })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { users: data, error: err } = await adminService.listUsers()
      if (cancelled) return
      setUsers(data)
      setError(err)
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const openEdit = (u: AdminUser) => {
    setEditingUser(u)
    setEditError(null)
    setEditForm({ pseudo: u.pseudo ?? '', first_name: u.first_name ?? '', last_name: u.last_name ?? '', phone_number: u.phone_number ?? '', role: u.role ?? 'user' })
  }

  const handleEdit = async () => {
    if (!editingUser) return
    setEditLoading(true)
    setEditError(null)
    const { error: err } = await adminService.updateUser(editingUser.id, editForm)
    setEditLoading(false)
    if (err) { setEditError(err); return }
    setEditingUser(null)
    const { users: data } = await adminService.listUsers()
    setUsers(data)
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    setDeleteLoading(true)
    const { error: err } = await adminService.deleteUser(deletingUser.id)
    setDeleteLoading(false)
    if (err) { setError(err); setDeletingUser(null); return }
    setDeletingUser(null)
    const { users: data } = await adminService.listUsers()
    setUsers(data)
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.email.toLowerCase().includes(q) || (u.pseudo ?? '').toLowerCase().includes(q) || (u.first_name ?? '').toLowerCase().includes(q) || (u.last_name ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="admin-users-page">
      {error && (
        <Alert variant="error" dismissible onDismiss={() => setError(null)} className="admin-users-page__alert">
          {error}
        </Alert>
      )}

      <div className="admin-users-page__toolbar">
        <Input
          type="search"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          clearable
          onClear={() => setSearch('')}
        />
        <span className="admin-users-page__count">{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="admin-users-page__loading"><Spinner size="lg" /></div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.Row>
              <Table.Th>Utilisateur</Table.Th>
              <Table.Th>Pseudo</Table.Th>
              <Table.Th>Nom complet</Table.Th>
              <Table.Th>Téléphone</Table.Th>
              <Table.Th>Rôle</Table.Th>
              <Table.Th>Inscription</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filtered.map((u) => (
              <Table.Row key={u.id}>
                <Table.Td>
                  <div className="admin-users-page__user-cell">
                    <Avatar name={u.pseudo || u.email} size="sm" />
                    <span className="admin-users-page__email">{u.email}</span>
                    {u.id === currentUser?.id && <Badge variant="primary" size="sm">Moi</Badge>}
                  </div>
                </Table.Td>
                <Table.Td>{u.pseudo || <span className="admin-users-page__empty">—</span>}</Table.Td>
                <Table.Td>
                  {u.first_name || u.last_name
                    ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
                    : <span className="admin-users-page__empty">—</span>}
                </Table.Td>
                <Table.Td>{u.phone_number || <span className="admin-users-page__empty">—</span>}</Table.Td>
                <Table.Td>
                  <Badge variant={u.role === 'admin' ? 'error' : 'default'} rounded>
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</Table.Td>
                <Table.Td>
                  <div className="admin-users-page__actions">
                    <Button variant="outline" size="sm" onClick={() => openEdit(u)}>Modifier</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeletingUser(u)} disabled={u.id === currentUser?.id}>
                      Supprimer
                    </Button>
                  </div>
                </Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Edit modal */}
      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Modifier l'utilisateur" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingUser(null)}>Annuler</Button>
            <Button onClick={handleEdit} isLoading={editLoading}>Enregistrer</Button>
          </>
        }
      >
        {editError && <Alert variant="error" className="admin-users-page__modal-alert">{editError}</Alert>}
        {editingUser && <p className="admin-users-page__modal-email">{editingUser.email}</p>}
        <div className="admin-users-page__modal-form">
          <Input label="Pseudo" value={editForm.pseudo} onChange={(e) => setEditForm({ ...editForm, pseudo: e.target.value })} fullWidth />
          <Input label="Prénom" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} fullWidth />
          <Input label="Nom" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} fullWidth />
          <Input label="Téléphone" type="tel" value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} fullWidth />
          <Select label="Rôle" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} options={ROLE_OPTIONS} fullWidth />
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} title="Supprimer l'utilisateur" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingUser(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteLoading}>Supprimer</Button>
          </>
        }
      >
        <p className="admin-users-page__delete-text">
          Es-tu sûr de vouloir supprimer <strong>{deletingUser?.pseudo || deletingUser?.email}</strong> ?
        </p>
        <p className="admin-users-page__delete-warning">Cette action est irréversible.</p>
      </Modal>
    </div>
  )
}

export default AdminUsers
