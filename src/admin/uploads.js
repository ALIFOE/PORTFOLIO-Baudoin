import { reactive } from 'vue'
import { adminApi, ApiError } from '@/api'
import { session } from './session'
import { formatSize } from './ui'

const ACCEPT = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf'],
}
ACCEPT.media = [...ACCEPT.image, ...ACCEPT.video]

/** Valeur de l'attribut accept des champs fichier */
export const acceptAttr = (kind) => (ACCEPT[kind] ?? ACCEPT.media).join(',')

/** Vérifie un fichier avant envoi ; renvoie un message d'erreur ou '' */
export function checkFile(file, kind = 'media') {
  const types = ACCEPT[kind] ?? ACCEPT.media
  const byExtension = /\.(jpe?g|png|webp|gif|mp4|webm|mov|m4v|pdf)$/i.test(file.name)
  if (file.type ? !types.includes(file.type) : !byExtension) {
    return kind === 'document'
      ? `« ${file.name} » n'est pas un PDF.`
      : `« ${file.name} » : format non accepté (JPG, PNG, WebP, GIF, MP4, WebM ou MOV).`
  }
  if (session.uploadLimit && file.size > session.uploadLimit) {
    return `« ${file.name} » (${formatSize(file.size)}) dépasse la taille maximale acceptée par le serveur (${formatSize(session.uploadLimit)}).`
  }
  return ''
}

/**
 * Envoi d'un fichier avec suivi : renvoie un objet réactif
 * { name, progress, status: 'uploading'|'done'|'error', error, item, promise, abort }.
 */
export function startUpload(file, { kind = 'media', purpose = 'media' } = {}) {
  const job = reactive({ name: file.name, size: file.size, progress: 0, status: 'uploading', error: '', item: null })
  const problem = checkFile(file, kind)
  if (problem) {
    job.status = 'error'
    job.error = problem
    job.promise = Promise.reject(new ApiError(problem))
    job.promise.catch(() => {})
    job.abort = () => {}
    return job
  }
  const { promise, abort } = adminApi.upload(file, { purpose, onProgress: (p) => (job.progress = p) })
  job.abort = abort
  job.promise = promise.then(
    (item) => {
      job.status = 'done'
      job.progress = 1
      job.item = item
      return item
    },
    (e) => {
      job.status = 'error'
      job.error = e.message
      throw e
    },
  )
  job.promise.catch(() => {})
  return job
}
