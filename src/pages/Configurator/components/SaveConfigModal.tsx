import { useEffect, useRef, useState } from 'react'
import Modal from '../../../components/common/Modal/Modal'
import './SaveConfigModal.scss'

interface Props {
  isOpen: boolean
  defaultName: string
  saving: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

const MAX_LEN = 80

function SaveConfigModal({ isOpen, defaultName, saving, onClose, onSubmit }: Props) {
  const [name, setName] = useState(defaultName)
  const [wasOpen, setWasOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Réinitialise le champ à l'ouverture — pattern React : ajuster l'état au
  // changement de prop pendant le rendu (plutôt qu'un setState dans un effet).
  if (isOpen && !wasOpen) {
    setWasOpen(true)
    setName(defaultName)
  } else if (!isOpen && wasOpen) {
    setWasOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    // Focus + pré-sélection au prochain frame (modal monté).
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
    return () => cancelAnimationFrame(id)
  }, [isOpen])

  const trimmed = name.trim()
  const valid = trimmed.length > 0 && trimmed.length <= MAX_LEN

  const submit = () => {
    if (!valid || saving) return
    onSubmit(trimmed)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={saving ? () => {} : onClose}
      title="Sauvegarder la configuration"
      size="sm"
      className="save-config-modal"
      closeOnOverlay={!saving}
      footer={
        <>
          <button type="button" className="btn btn--ghost2" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button type="button" className="btn btn--ind" onClick={submit} disabled={!valid || saving}>
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </>
      }
    >
      <label className="save-config__label" htmlFor="save-config-name">
        Nom de la configuration
      </label>
      <input
        id="save-config-name"
        ref={inputRef}
        className="save-config__input"
        value={name}
        maxLength={MAX_LEN}
        placeholder="Ma config gaming"
        disabled={saving}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submit()
          }
        }}
      />
      <div className="save-config__hint">{trimmed.length}/{MAX_LEN}</div>
    </Modal>
  )
}

export default SaveConfigModal
