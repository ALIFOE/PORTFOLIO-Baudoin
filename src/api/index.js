/**
 * Client de l'API interne (dossier public/api, en PHP).
 * Les URL sont relatives à la page : le site fonctionne aussi dans un sous-dossier.
 */
const BASE = `${import.meta.env.BASE_URL}api/`

let csrfToken = ''
export const setCsrf = (token) => {
  csrfToken = token || ''
}

export class ApiError extends Error {
  constructor(message, status = 0, data = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const url = (file, params) => {
  const entries = Object.entries(params ?? {}).filter(([, v]) => v !== '' && v != null)
  return `${BASE}${file}${entries.length ? `?${new URLSearchParams(entries)}` : ''}`
}

/** Lit la réponse JSON de l'API et lève une ApiError si elle signale une erreur. */
function parse(status, ok, data) {
  if (!data || typeof data !== 'object') {
    // réponse non JSON : serveur PHP absent ou hébergement statique
    throw new ApiError("Le serveur n'a pas répondu correctement.", status)
  }
  if (!ok || data.ok === false) {
    throw new ApiError(data.error || 'Une erreur est survenue.', status, data)
  }
  return data
}

async function request(file, { method = 'GET', params, body, timeout } = {}) {
  const controller = timeout ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null
  let res
  try {
    res = await fetch(url(file, params), {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller?.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(method !== 'GET' && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Serveur injoignable. Vérifiez votre connexion.')
  } finally {
    clearTimeout(timer)
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // traité par parse()
  }
  return parse(res.status, res.ok, data)
}

const adminCall = (action, options = {}) =>
  request('admin.php', { ...options, params: { action, ...options.params } })

/**
 * Envoi de fichier avec suivi de progression (fetch ne le permet pas).
 * @returns {{ promise: Promise<object>, abort: () => void }}
 */
function uploadFile(file, { purpose = 'media', onProgress } = {}) {
  const xhr = new XMLHttpRequest()
  const promise = new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('purpose', purpose)
    form.append('file', file)
    xhr.open('POST', url('admin.php', { action: 'upload' }))
    xhr.withCredentials = true
    xhr.setRequestHeader('Accept', 'application/json')
    if (csrfToken) xhr.setRequestHeader('X-CSRF-Token', csrfToken)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onload = () => {
      let data = null
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        if (xhr.status === 413) data = { ok: false, error: 'Fichier trop volumineux pour le serveur.' }
      }
      try {
        resolve(parse(xhr.status, xhr.status >= 200 && xhr.status < 300, data).item)
      } catch (e) {
        reject(e)
      }
    }
    xhr.onerror = () => reject(new ApiError('Envoi impossible : serveur injoignable.'))
    xhr.onabort = () => reject(new ApiError('Envoi annulé.', 0, { aborted: true }))
    xhr.send(form)
  })
  return { promise, abort: () => xhr.abort() }
}

/** Formulaire public */
export const sendContact = (payload) => request('contact.php', { method: 'POST', body: payload })

/** Contenu modifié depuis l'admin (public) */
export const fetchContent = ({ timeout } = {}) => request('content.php', { timeout })

/** Espace d'administration */
export const adminApi = {
  session: () => adminCall('session'),
  login: (username, password) => adminCall('login', { method: 'POST', body: { username, password } }),
  logout: () => adminCall('logout', { method: 'POST', body: {} }),
  account: (payload) => adminCall('account', { method: 'POST', body: payload }),

  list: (filters) => adminCall('list', { params: filters }),
  update: (ids, changes) => adminCall('update', { method: 'POST', body: { ids, ...changes } }),
  remove: (ids) => adminCall('delete', { method: 'POST', body: { ids } }),
  exportUrl: (filters) => url('admin.php', { action: 'export', ...filters }),

  content: () => adminCall('content'),
  save: (section, data, base) => adminCall('save', { method: 'POST', body: { section, data, base } }),
  reset: (section) => adminCall('reset', { method: 'POST', body: { section } }),

  upload: uploadFile,
  media: (kind) => adminCall('media', { params: { kind } }),
  deleteMedia: (ids, force = false) => adminCall('media_delete', { method: 'POST', body: { ids, force } }),
}
