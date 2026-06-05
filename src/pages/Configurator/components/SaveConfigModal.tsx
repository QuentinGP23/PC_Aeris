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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setName(defaultName)
    // Focus + pré-sélection du nom par défaut au prochain frame (modal monté).
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
    return () => cancelAnimationFrame(id)
  }, [isOpen, defaultName])

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
