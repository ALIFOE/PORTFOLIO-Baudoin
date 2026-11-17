import { reactive } from 'vue'
import { adminApi, setCsrf } from '@/api'

/** État de la session administrateur, partagé entre le routeur et les vues admin. */
export const session = reactive({ checked: false, authenticated: false, username: '', uploadLimit: 0 })

export function applySession(data) {
  session.checked = true
  session.authenticated = !!data.authenticated
  session.username = data.username || ''
  session.uploadLimit = Number(data.upload_limit) || 0
  setCsrf(data.csrf)
}

let pending = null

/** Interroge le serveur une seule fois (sauf force) pour savoir si une session est ouverte. */
export function ensureSession(force = false) {
  if (session.checked && !force) return Promise.resolve(session)
  pending ??= adminApi
    .session()
    .then(applySession, () => applySession({ authenticated: false }))
    .then(() => session)
    .finally(() => {
      pending = null
    })
  return pending
}

export async function login(username, password) {
  applySession(await adminApi.login(username, password))
}

export async function logout() {
  try {
    await adminApi.logout()
  } finally {
    applySession({ authenticated: false })
  }
}

/** À appeler quand l'API répond 401 : la session a expiré côté serveur. */
export function markExpired() {
  applySession({ authenticated: false })
}
