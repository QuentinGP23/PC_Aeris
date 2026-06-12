import { useEffect, useState } from 'react'
import { Button, Alert, Modal, AddressFields, emptyAddress, validateAddress } from '../../components/common'
import { addressesService, type Address, type AddressInput } from '../../services'
import './AddressBook.scss'

function AddressBook() {
  const [list, setList] = useState<Address[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressInput>(emptyAddress)
  const [formErr, setFormErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    void addressesService.list().then(({ data, error }) => {
      if (error) setError(error)
      else setList(data)
    })
  }
  useEffect(load, [])

  const openAdd = () => { setEditId(null); setForm(emptyAddress); setFormErr(null); setModalOpen(true) }
  const openEdit = (a: Address) => {
    setEditId(a.id)
    setForm({ label: a.label ?? '', fullName: a.fullName, address: a.address, zip: a.zip, city: a.city, phone: a.phone })
    setFormErr(null)
    setModalOpen(true)
  }

  const save = async () => {
    const v = validateAddress(form)
    if (v) { setFormErr(v); return }
    setSaving(true)
    const { error } = editId
      ? await addressesService.update(editId, form)
      : await addressesService.create(form)
    setSaving(false)
    if (error) { setFormErr(error); return }
    setModalOpen(false)
    load()
  }

  const setDefault = async (id: string) => {
    const { error } = await addressesService.setDefault(id)
    if (error) setError(error)
    else load()
  }
  const remove = async (id: string) => {
    const { error } = await addressesService.remove(id)
    if (error) setError(error)
    else load()
  }

  return (
    <section className="profile__section">
      <div className="profile__section-header">
        <h2 className="profile__section-title">Adresses de livraison</h2>
        <p className="profile__section-desc">Enregistre une ou plusieurs adresses pour aller plus vite au moment de commander.</p>
      </div>

      {error && <Alert variant="error" className="profile__alert">{error}</Alert>}

      <div className="addrbook">
        {list?.map((a) => (
          <div key={a.id} className={`addrbook__card ${a.isDefault ? 'is-default' : ''}`}>
            <div className="addrbook__top">
              <span className="addrbook__label">{a.label || 'Adresse'}</span>
              {a.isDefault && <span className="addrbook__badge">Par défaut</span>}
            </div>
            <p className="addrbook__name">{a.fullName}</p>
            <p className="addrbook__lines">{a.address}<br />{a.zip} {a.city}</p>
            <p className="addrbook__phone">{a.phone}</p>
            <div className="addrbook__actions">
              {!a.isDefault && <button className="addrbook__act" onClick={() => void setDefault(a.id)}>Définir par défaut</button>}
              <button className="addrbook__act" onClick={() => openEdit(a)}>Modifier</button>
              <button className="addrbook__act addrbook__act--del" onClick={() => void remove(a.id)}>Supprimer</button>
            </div>
          </div>
        ))}

        <button className="addrbook__add" onClick={openAdd}>
          <span className="addrbook__add-plus">+</span>
          Ajouter une adresse
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={() => { void save() }} isLoading={saving}>Enregistrer</Button>
          </>
        }
      >
        <div className="addrbook__form">
          {formErr && <Alert variant="error">{formErr}</Alert>}
          <AddressFields value={form} onChange={setForm} />
        </div>
      </Modal>
    </section>
  )
}

export default AddressBook
