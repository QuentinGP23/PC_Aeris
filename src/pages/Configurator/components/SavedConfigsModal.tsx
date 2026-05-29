import { useEffect, useState } from 'react'
import Modal from '../../../components/common/Modal/Modal'
import { savedConfigsService, type SavedConfig } from '../../../services'
import { CATEGORIES } from '../../../types'
import { useConfigStore, useToast } from '../../../store'
import './SavedConfigsModal.scss'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function SavedConfigsModal({ isOpen, onClose }: Props) {
  const toast = useToast()
  const loadConfig = useConfigStore((s) => s.loadConfig)

  const [configs, setConfigs] = useState<SavedConfig[] | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    async function load() {
      const { data, error } = await savedConfigsService.list()
      if (cancelled) return
      if (error) toast.error(error)
      else setConfigs(data)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [isOpen, toast])

  const loading = configs === null

  const handleLoad = async (cfg: SavedConfig) => {
    const hydrated = await savedConfigsService.hydrate(cfg)
    loadConfig(hydrated.id, hydrated.name, hydrated.products)
    if (hydrated.missing.length > 0) {
      toast.warning(
        `Config chargée — composants indisponibles : ${hydrated.missing
          .map((c) => CATEGORIES.find((cat) => cat.value === c)?.label ?? c)
          .join(', ')}`,
      )
    } else {
      toast.success(`"${hydrated.name}" chargée`)
    }
    onClose()
  }

  const handleDelete = async (cfg: SavedConfig) => {
    if (!window.confirm(`Supprimer la configuration "${cfg.name}" ?`)) return
    const { error } = await savedConfigsService.delete(cfg.id)
    if (error) toast.error(error)
    else {
      toast.success('Configuration supprimée')
      setConfigs((prev) => (prev ?? []).filter((c) => c.id !== cfg.id))
    }
  }

  const startRename = (cfg: SavedConfig) => {
    setRenamingId(cfg.id)
    setRenameValue(cfg.name)
  }

  const submitRename = async (cfg: SavedConfig) => {
    const name = renameValue.trim()
    if (!name || name === cfg.name) {
      setRenamingId(null)
      return
    }
    const { error } = await savedConfigsService.rename(cfg.id, name)
    if (error) toast.error(error)
    else {
      toast.success('Nom mis à jour')
      setConfigs((prev) => (prev ?? []).map((c) => (c.id === cfg.id ? { ...c, name } : c)))
    }
    setRenamingId(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mes configurations" size="lg">
      {loading ? (
        <div className="saved-configs__state">Chargement…</div>
      ) : (configs ?? []).length === 0 ? (
        <div className="saved-configs__state">Aucune configuration sauvegardée.</div>
      ) : (
        <ul className="saved-configs__list">
          {(configs ?? []).map((cfg) => {
            const componentCount = Object.values(cfg.components).filter(Boolean).length
            const isRenaming = renamingId === cfg.id
            return (
              <li key={cfg.id} className="saved-configs__item">
                <div className="saved-configs__main">
                  {isRenaming ? (
                    <input
                      className="saved-configs__rename"
                      autoFocus
                      value={renameValue}
                      maxLength={80}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => void submitRename(cfg)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void submitRename(cfg)
                        if (e.key === 'Escape') setRenamingId(null)
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="saved-configs__name"
                      onClick={() => void handleLoad(cfg)}
                    >
                      {cfg.name}
                    </button>
                  )}
                  <div className="saved-configs__meta">
                    {componentCount}/{CATEGORIES.length} composants · maj {formatDate(cfg.updated_at)}
                  </div>
                </div>
                <div className="saved-configs__actions">
                  <button type="button" className="saved-configs__btn" onClick={() => void handleLoad(cfg)}>
                    Charger
                  </button>
                  <button type="button" className="saved-configs__btn" onClick={() => startRename(cfg)}>
                    Renommer
                  </button>
                  <button
                    type="button"
                    className="saved-configs__btn saved-configs__btn--danger"
                    onClick={() => void handleDelete(cfg)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Modal>
  )
}

export default SavedConfigsModal
