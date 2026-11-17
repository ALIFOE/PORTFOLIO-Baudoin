/**
 * Références de fichiers utilisées dans le contenu :
 *   asset:projects/x.jpg    image fournie avec le site (src/assets/img/projects/x.jpg)
 *   uploads/2026/11/x.jpg   fichier envoyé depuis l'administration
 *   docs/x.pdf              document du dossier public/docs
 *   https://…               fichier hébergé ailleurs
 */
const files = import.meta.glob('../assets/img/{portfolio,projects,logos}/*.{jpg,jpeg,png,webp,gif}', {
  eager: true,
  import: 'default',
})

/** Images fournies avec le site : { 'projects/x.jpg': url } */
export const siteAssets = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace('../assets/img/', ''), url]),
)

/** URL affichable d'une référence de fichier ('' si elle n'est pas reconnue). */
export function media(ref) {
  if (typeof ref !== 'string' || !ref) return ''
  if (ref.startsWith('asset:')) return siteAssets[ref.slice(6)] ?? ''
  if (/^(uploads|docs)\/[\w./-]+$/.test(ref) && !ref.includes('..')) return `${import.meta.env.BASE_URL}${ref}`
  if (/^https:\/\//i.test(ref)) return ref
  return ''
}

export const isVideoFile = (ref) => /\.(mp4|webm|mov|m4v)$/i.test(ref || '')
export const isPdf = (ref) => /\.pdf$/i.test(ref || '')

/**
 * Vidéo YouTube ou Vimeo à partir de son lien de partage.
 * @returns {{ provider: string, id: string, embed: string, thumb: string } | null}
 */
export function videoEmbed(url) {
  if (typeof url !== 'string' || !url) return null
  let m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i)
  if (m) {
    return {
      provider: 'youtube',
      id: m[1],
      embed: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`,
      thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`,
    }
  }
  m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/i)
  if (m) {
    return { provider: 'vimeo', id: m[1], embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1`, thumb: '' }
  }
  return null
}

/**
 * Élément de galerie prêt à afficher.
 * Entrée : { type: 'image'|'video', src, thumb, poster, url, title, text }
 */
export function galleryItem(item) {
  const embed = item.type === 'video' && item.url ? videoEmbed(item.url) : null
  const src = media(item.src)
  const poster = media(item.poster) || (embed?.thumb ?? '')
  return {
    ...item,
    kind: item.type === 'video' ? (embed ? 'embed' : 'video') : 'image',
    full: src,
    preview: media(item.thumb) || (item.type === 'video' ? poster : src),
    poster,
    embed,
  }
}
