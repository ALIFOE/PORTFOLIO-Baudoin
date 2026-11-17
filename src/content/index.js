/**
 * Contenu du site, partagé par toutes les pages.
 *
 * Il part du contenu par défaut (src/data/portfolio.js) puis, au démarrage,
 * reçoit les sections modifiées dans l'administration (api/content.php).
 * Les pages lisent toujours `content.xxx` : une section remplacée
 * (après chargement ou enregistrement dans l'admin) se met à jour partout.
 */
import { reactive, computed } from 'vue'
import { defaultContent } from '@/data/portfolio'
import { fetchContent } from '@/api'
import { media } from './media'

export { media, siteAssets, galleryItem, videoEmbed, isVideoFile, isPdf } from './media'

export const clone = (value) => JSON.parse(JSON.stringify(value))

export const content = reactive(clone(defaultContent))

/** Remplace une section par sa version enregistrée (les champs manquants gardent leur valeur par défaut). */
export function setSection(key, data) {
  if (!(key in defaultContent) || data == null) return
  const base = defaultContent[key]
  content[key] = Array.isArray(base) ? (Array.isArray(data) ? clone(data) : clone(base)) : { ...clone(base), ...clone(data) }
}

export function applyContent(sections) {
  for (const [key, data] of Object.entries(sections ?? {})) setSection(key, data)
}

/** Revient au contenu par défaut d'une section. */
export function resetSection(key) {
  if (key in defaultContent) content[key] = clone(defaultContent[key])
}

/** Chargement au démarrage ; en cas d'échec, le site garde son contenu par défaut. */
export async function loadContent() {
  try {
    const data = await fetchContent({ timeout: 4000 })
    applyContent(data.content)
    return true
  } catch {
    return false
  }
}

/* ------------------------------------------------------------------
 * Valeurs dérivées
 * ------------------------------------------------------------------ */
const digits = (value) => String(value ?? '').replace(/\D/g, '')

/** Liens calculés à partir du profil et du CV */
export const links = computed(() => {
  const p = content.profile
  const wa = digits(p.whatsapp || p.phone)
  return {
    phone: p.phone ? `tel:${p.phone.replace(/[^\d+]/g, '')}` : '',
    whatsapp: wa.length >= 8 ? `https://wa.me/${wa}` : '',
    email: p.email ? `mailto:${p.email}` : '',
    cv: media(content.cv.file),
    cvName: content.cv.name || 'CV.pdf',
  }
})

/** Réseaux sociaux (en-tête, pied de page, contact) */
export const socials = computed(() => {
  const p = content.profile
  return [
    { label: 'LinkedIn', url: p.linkedin, icon: 'icon-linkedin' },
    { label: 'WhatsApp', url: links.value.whatsapp, icon: 'fa-brands fa-whatsapp' },
    { label: 'Email', url: links.value.email, icon: 'fa-regular fa-envelope' },
    { label: 'GitHub', url: p.github, icon: 'icon-github' },
    { label: 'Facebook', url: p.facebook, icon: 'fa-brands fa-facebook-f' },
    { label: 'Instagram', url: p.instagram, icon: 'fa-brands fa-instagram' },
    { label: 'YouTube', url: p.youtube, icon: 'fa-brands fa-youtube' },
  ].filter((s) => s.url)
})

export const findDomain = (slug) => content.domains.find((d) => d.slug === slug)
export const findProject = (slug) => content.projects.find((p) => p.slug === slug)
export const domainProjects = (slug) => content.projects.filter((p) => p.domain === slug)
export const domainNumber = (slug) => String(content.domains.findIndex((d) => d.slug === slug) + 1).padStart(2, '0')
