import { CheckCircle, XCircle, Warning, Info, X, type Icon } from '@phosphor-icons/react'
import { useToastStore } from '../../../store/toastStore'
import './Toast.scss'

const ICONS: Record<string, Icon> = {
  success: CheckCircle,
  error:   XCircle,
  warning: Warning,
  info:    Info,
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Ico = ICONS[toast.variant] ?? Info
        return (
          <div key={toast.id} className={`toast toast--${toast.variant}`}>
            <span className="toast__icon"><Ico size={20} weight="fill" /></span>
            <span className="toast__message">{toast.message}</span>
            <button className="toast__close" onClick={() => removeToast(toast.id)} aria-label="Fermer"><X weight="bold" /></button>
          </div>
        )
      })}
    </div>
  )
}
