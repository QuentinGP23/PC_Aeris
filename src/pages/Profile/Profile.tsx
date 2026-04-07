import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'
import { Button, Input, Alert, Avatar, Divider, Modal } from '../../components/common'
import { Container } from '../../components/layout'
import './Profile.scss'

function Profile() {
  const { user, updateProfile, updatePassword, signOut } = useAuth()
  const navigate = useNavigate()

  // ── Profile form ─────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    pseudo:    user?.pseudo    ?? '',
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    phone:     user?.phone     ?? '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError,   setProfileError]   = useState<string | null>(null)

  const handleProfileSave = async () => {
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)
    const { error } = await updateProfile({
      pseudo:    profileForm.pseudo    || undefined,
      firstName: profileForm.firstName || undefined,
      lastName:  profileForm.lastName  || undefined,
      phone:     profileForm.phone     || undefined,
    })
    setProfileLoading(false)
    if (error) { setProfileError(error); return }
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  // ── Password form ─────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ newPassword: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError,   setPwError]   = useState<string | null>(null)

  const handlePasswordSave = async () => {
    setPwError(null)
    setPwSuccess(false)
    if (pwForm.newPassword.length < 6) {
      setPwError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('Les mots de passe ne correspondent pas.')
      return
    }
    setPwLoading(true)
    const { error } = await updatePassword(pwForm.newPassword)
    setPwLoading(false)
    if (error) { setPwError(error); return }
    setPwSuccess(true)
    setPwForm({ newPassword: '', confirm: '' })
    setTimeout(() => setPwSuccess(false), 3000)
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  const [signOutLoading, setSignOutLoading] = useState(false)

  const handleSignOut = async () => {
    setSignOutLoading(true)
    await signOut()
    navigate('/')
  }

  // ── Delete account ────────────────────────────────────────────────────────
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const DELETE_KEYWORD = 'SUPPRIMER'

  if (!user) return null

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.pseudo || user.email

  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="profile">
      <Container size="md">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="profile__header">
          <Avatar name={displayName} size="xl" />
          <div className="profile__header-info">
            <h1 className="profile__name">{displayName}</h1>
            <p className="profile__email">{user.email}</p>
            <div className="profile__meta">
              <span className={`profile__role profile__role--${user.role}`}>
                {user.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
              <span className="profile__since">Inscrit le {memberSince}</span>
            </div>
          </div>
          <div className="profile__header-actions">
            <Button variant="outline" size="sm" onClick={handleSignOut} isLoading={signOutLoading}>
              Déconnexion
            </Button>
          </div>
        </div>

        <Divider />

        {/* ── Profile info ─────────────────────────────────────────────────── */}
        <section className="profile__section">
          <div className="profile__section-header">
            <h2 className="profile__section-title">Informations personnelles</h2>
            <p className="profile__section-desc">Modifie ton pseudo et tes coordonnées.</p>
          </div>

          {profileSuccess && (
            <Alert variant="success" className="profile__alert">
              Profil mis à jour avec succès.
            </Alert>
          )}
          {profileError && (
            <Alert variant="error" className="profile__alert">{profileError}</Alert>
          )}

          <div className="profile__form">
            <div className="profile__form-row">
              <Input
                label="Prénom"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                fullWidth
              />
              <Input
                label="Nom"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                fullWidth
              />
            </div>
            <Input
              label="Pseudo"
              value={profileForm.pseudo}
              onChange={(e) => setProfileForm({ ...profileForm, pseudo: e.target.value })}
              fullWidth
            />
            <Input
              label="Téléphone"
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              fullWidth
            />
            <Input
              label="Email"
              value={user.email}
              disabled
              fullWidth
              hint="L'email ne peut pas être modifié."
            />
            <div className="profile__form-actions">
              <Button onClick={() => { void handleProfileSave() }} isLoading={profileLoading}>
                Enregistrer
              </Button>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Password ─────────────────────────────────────────────────────── */}
        <section className="profile__section">
          <div className="profile__section-header">
            <h2 className="profile__section-title">Mot de passe</h2>
            <p className="profile__section-desc">Choisis un nouveau mot de passe sécurisé.</p>
          </div>

          {pwSuccess && (
            <Alert variant="success" className="profile__alert">
              Mot de passe mis à jour avec succès.
            </Alert>
          )}
          {pwError && (
            <Alert variant="error" className="profile__alert">{pwError}</Alert>
          )}

          <div className="profile__form">
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              hint="Minimum 6 caractères."
              fullWidth
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              fullWidth
            />
            <div className="profile__form-actions">
              <Button onClick={() => { void handlePasswordSave() }} isLoading={pwLoading}>
                Changer le mot de passe
              </Button>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Danger zone ──────────────────────────────────────────────────── */}
        <section className="profile__section">
          <div className="profile__section-header">
            <h2 className="profile__section-title">Zone de danger</h2>
            <p className="profile__section-desc">Ces actions sont définitives. Lis bien avant d'agir.</p>
          </div>

          <div className="profile__danger-zone">
            {/* Se déconnecter */}
            <div className="profile__danger-item">
              <div className="profile__danger-item-info">
                <p className="profile__danger-item-title">Se déconnecter</p>
                <p className="profile__danger-item-desc">
                  Ferme ta session sur cet appareil. Tu pourras te reconnecter à tout moment.
                </p>
              </div>
              <Button variant="outline" onClick={() => { void handleSignOut() }} isLoading={signOutLoading}>
                Déconnexion
              </Button>
            </div>

            <div className="profile__danger-divider" />

            {/* Supprimer le compte */}
            <div className="profile__danger-item profile__danger-item--destructive">
              <div className="profile__danger-item-info">
                <p className="profile__danger-item-title">Supprimer le compte</p>
                <p className="profile__danger-item-desc">
                  Supprime définitivement ton compte et toutes tes données. Cette action est irréversible.
                </p>
              </div>
              <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </section>

      </Container>

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteConfirm('') }}
        title="Supprimer le compte"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setDeleteModalOpen(false); setDeleteConfirm('') }}>
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={deleteConfirm !== DELETE_KEYWORD}
            >
              Supprimer définitivement
            </Button>
          </>
        }
      >
        <div className="profile__delete-modal">
          <p className="profile__delete-modal-text">
            Cette action supprimera <strong>définitivement</strong> ton compte, tes configurations sauvegardées et toutes tes données associées.
          </p>
          <p className="profile__delete-modal-instruction">
            Tape <strong>{DELETE_KEYWORD}</strong> pour confirmer.
          </p>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={DELETE_KEYWORD}
            fullWidth
          />
        </div>
      </Modal>
    </div>
  )
}

export default Profile
