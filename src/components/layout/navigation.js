import { content } from '@/content'

/** Sous-menus et état actif de la navigation (en-tête et menu mobile). */
export function useNavigation(route) {
  // « Réalisations » : un lien par domaine d'activité (dans l'ordre d'importance) + tous les projets
  const childrenOf = (item) =>
    item.children === 'domains'
      ? [
          ...content.domains.map((d, i) => ({
            label: d.shortTitle || d.title,
            to: `/realisations/${d.slug}`,
            number: String(i + 1).padStart(2, '0'),
          })),
          { label: 'Tous les projets web', to: '/projets' },
        ]
      : []

  const isActive = (item) => {
    if (item.to === '/') return route.path === '/'
    return (item.match ?? [item.to]).some((prefix) => route.path.startsWith(prefix))
  }

  return { childrenOf, isActive }
}
