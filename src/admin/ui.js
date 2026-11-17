import { reactive } from 'vue'
import router from '@/router'
import { markExpired } from './session'

/** Message temporaire affiché en bas de l'écran */
export const toast = reactive({ text: '', kind: 'info' })
let toastTimer

export function notify(text, kind = 'info') {
  toast.text = text
  toast.kind = kind
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.text = ''), kind === 'error' ? 7000 : 3500)
}

/** Nombre de nouveaux messages (pastille du menu) */
export const inbox = reactive({ newCount: 0 })

/** Erreur d'API : session expirée → page de connexion ; sinon message d'erreur. */
export function handleError(error, fallback = 'Une erreur est survenue.') {
  if (error?.status === 401) {
    markExpired()
    router.replace({ name: 'admin-login', query: { next: router.currentRoute.value.fullPath } })
    return
  }
  notify(error?.message || fallback, 'error')
}

export function formatSize(bytes) {
  if (!bytes) return '0 Ko'
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1).replace('.', ',')} Go`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1).replace('.', ',')} Mo`
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
export const formatDate = (iso) => (iso ? dateFormat.format(new Date(iso)) : '')

export const pad = (n) => String(n).padStart(2, '0')
