import { useState, useEffect } from 'react'
import { useAuth } from '../../context'
import { adminService, type AdminUser } from '../../services'
import './Users.scss'

const ROLE_OPTIONS = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'admin', label: 'Administrateur' },
]

function initialFromName(s: string): string {
  return (s || '?').trim().charAt(0)
}

function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState({
    pseudo: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'user',
  })
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
    setEditForm({
      pseudo: u.pseudo ?? '',
      first_name: u.first_name ?? '',
      last_name: u.last_name ?? '',
      phone_number: u.phone_number ?? '',
      role: u.role ?? 'user',
    })
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
    if (!q) return true
    return u.email.toLowerCase().includes(q)
      || (u.pseudo ?? '').toLowerCase().includes(q)
      || (u.first_name ?? '').toLowerCase().includes(q)
      || (u.last_name ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="admin-users">
      {error && (
        <div className="ad-alert-err">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Fermer">×</button>
        </div>
      )}

      <div className="ad-toolbar">
        <input
          className="ad-input"
          type="search"
          placeholder="Rechercher un utilisateur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 280 }}
        />
        <span className="ad-count">{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="ad-loading">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="ad-empty-state">Aucun utilisateur trouvé.</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Pseudo</th>
                <th>Nom complet</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Inscription</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-users__cell">
                      <div className="ad-avatar">{initialFromName(u.pseudo || u.email)}</div>
                      <span className="td-main">{u.email}</span>
                      {u.id === currentUser?.id && <span className="ad-badge ad-badge--me">Moi</span>}
                    </div>
                  </td>
                  <td>{u.pseudo || <span className="ad-empty-cell">—</span>}</td>
                  <td>
                    {u.first_name || u.last_name
                      ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
                      : <span className="ad-empty-cell">—</span>}
                  </td>
                  <td className="td-mono">{u.phone_number || <span className="ad-empty-cell">—</span>}</td>
                  <td>
                    <span className={`ad-badge ${u.role === 'admin' ? 'ad-badge--admin' : 'ad-badge--user'}`}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="td-mono">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="admin-users__actions">
                      <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => openEdit(u)}>
                        Modifier
                      </button>
                      <button
                        className="ad-btn ad-btn--danger ad-btn--sm"
                        onClick={() => setDeletingUser(u)}
                        disabled={u.id === currentUser?.id}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editingUser && (
        <div className="ad-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="ad-modal ad-modal--md" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal__hd">
              <div className="ad-modal__title">Modifier l'utilisateur</div>
              <button className="ad-modal__close" onClick={() => setEditingUser(null)} aria-label="Fermer">×</button>
            </div>
            <div className="ad-modal__body">
              {editError && <div className="ad-alert-err">{editError}</div>}
              <p className="admin-users__modal-email">{editingUser.email}</p>

              <div className="ad-form">
                <div className="ad-fg">
                  <label className="ad-fg__l">Pseudo</label>
                  <input
                    className="ad-fg__in"
                    value={editForm.pseudo}
                    onChange={(e) => setEditForm({ ...editForm, pseudo: e.target.value })}
                  />
                </div>
                <div className="ad-row ad-row--2">
                  <div className="ad-fg">
                    <label className="ad-fg__l">Prénom</label>
                    <input
                      className="ad-fg__in"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    />
                  </div>
                  <div className="ad-fg">
                    <label className="ad-fg__l">Nom</label>
                    <input
                      className="ad-fg__in"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-fg">
                  <label className="ad-fg__l">Téléphone</label>
                  <input
                    className="ad-fg__in"
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                  />
                </div>
                <div className="ad-fg">
                  <label className="ad-fg__l">Rôle</label>
                  <select
                    className="ad-fg__sel"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="ad-modal__ft">
              <button className="ad-btn ad-btn--ghost" onClick={() => setEditingUser(null)}>Annuler</button>
              <button className="ad-btn ad-btn--ind" onClick={handleEdit} disabled={editLoading}>
                {editLoading ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deletingUser && (
        <div className="ad-modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="ad-modal ad-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal__hd">
              <div className="ad-modal__title">Supprimer l'utilisateur</div>
              <button className="ad-modal__close" onClick={() => setDeletingUser(null)} aria-label="Fermer">×</button>
            </div>
            <div className="ad-modal__body">
              <p className="ad-warn-text">
                Es-tu sûr de vouloir supprimer <strong style={{ color: 'var(--text)' }}>{deletingUser.pseudo || deletingUser.email}</strong> ?
              </p>
              <p className="ad-warn-danger">Cette action est irréversible.</p>
            </div>
            <div className="ad-modal__ft">
              <button className="ad-btn ad-btn--ghost" onClick={() => setDeletingUser(null)}>Annuler</button>
              <button className="ad-btn ad-btn--danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
