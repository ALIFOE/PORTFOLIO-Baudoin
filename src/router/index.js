import { createRouter, createWebHashHistory } from 'vue-router'
import { content, findDomain, findProject } from '@/content'
import HomeView from '@/views/HomeView.vue'

const notFound = (to) => ({ name: 'not-found', params: { pathMatch: to.path.slice(1).split('/') } })

// Espace d'administration : chaque section est une page enfant de AdminLayout
const adminPages = [
  { path: '', name: 'admin', file: 'AdminMessagesView', title: 'Messages' },
  { path: 'a-propos', name: 'admin-profile', file: 'AdminProfileView', title: 'À propos' },
  { path: 'domaines', name: 'admin-domains', file: 'AdminDomainsView', title: "Domaines d'activité" },
  { path: 'experience', name: 'admin-experience', file: 'AdminExperienceView', title: 'Expérience' },
  { path: 'competences', name: 'admin-skills', file: 'AdminSkillsView', title: 'Compétences' },
  { path: 'formation', name: 'admin-education', file: 'AdminEducationView', title: 'Formation' },
  { path: 'projets', name: 'admin-projects', file: 'AdminProjectsView', title: 'Projets' },
  { path: 'cv', name: 'admin-cv', file: 'AdminCvView', title: 'CV' },
  { path: 'medias', name: 'admin-media', file: 'AdminMediaView', title: 'Médiathèque' },
  { path: 'compte', name: 'admin-account', file: 'AdminAccountView', title: 'Mon compte' },
]
const adminViews = import.meta.glob('../views/admin/Admin*View.vue')

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/a-propos', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'À propos' } },
  { path: '/realisations', name: 'works', component: () => import('@/views/WorksView.vue'), meta: { title: 'Réalisations' } },
  {
    path: '/realisations/:slug',
    name: 'domain',
    component: () => import('@/views/DomainView.vue'),
    props: true,
    beforeEnter: (to) => (findDomain(to.params.slug) ? true : notFound(to)),
  },
  { path: '/experience', name: 'experience', component: () => import('@/views/ExperienceView.vue'), meta: { title: 'Expérience' } },
  { path: '/competences', name: 'skills', component: () => import('@/views/SkillsView.vue'), meta: { title: 'Compétences' } },
  { path: '/formation', name: 'education', component: () => import('@/views/EducationView.vue'), meta: { title: 'Formation & Certifications' } },
  { path: '/projets', name: 'projects', component: () => import('@/views/ProjectsView.vue'), meta: { title: 'Projets' } },
  {
    path: '/projets/:slug',
    name: 'project',
    component: () => import('@/views/ProjectDetailView.vue'),
    props: true,
    beforeEnter: (to) => (findProject(to.params.slug) ? true : notFound(to)),
  },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue'), meta: { title: 'Contact' } },

  // Administration. meta.bare = sans en-tête ni pied de page du site.
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { bare: true, requiresAuth: true },
    children: adminPages.map((p) => ({
      path: p.path,
      name: p.name,
      component: adminViews[`../views/admin/${p.file}.vue`],
      meta: { title: `${p.title} — Administration` },
    })),
  },
  {
    path: '/admin/connexion',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
    meta: { title: 'Connexion', bare: true },
  },

  // Anciennes URL .html → nouvelles routes (liens déjà partagés)
  { path: '/index.html', redirect: '/' },
  { path: '/about.html', redirect: '/a-propos' },
  { path: '/experience.html', redirect: '/experience' },
  { path: '/competences.html', redirect: '/competences' },
  { path: '/formation.html', redirect: '/formation' },
  { path: '/mesprojets.html', redirect: '/projets' },
  { path: '/contact.html', redirect: '/contact' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Page introuvable' } },
]

const router = createRouter({
  // Mode hash : fonctionne sur GitHub Pages et tout hébergement statique sans configuration
  history: createWebHashHistory(),
  routes,
  // Le défilement est géré par ScrollSmoother (voir App.vue)
  scrollBehavior: () => false,
})

// L'admin n'est accessible qu'avec une session ouverte côté serveur.
// Import dynamique : le code admin n'est téléchargé que si on va sur ces pages.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth && to.name !== 'admin-login') return true
  const { ensureSession } = await import('@/admin/session')
  const session = await ensureSession()
  if (to.meta.requiresAuth && !session.authenticated) return { name: 'admin-login', query: { next: to.fullPath } }
  if (to.name === 'admin-login' && session.authenticated) return { name: 'admin' }
  return true
})

router.afterEach((to) => {
  const name = content.profile.fullName
  if (to.name === 'home') {
    document.title = `${name} — ${content.profile.role}`
    return
  }
  const page =
    to.name === 'project' ? findProject(to.params.slug)?.title
    : to.name === 'domain' ? findDomain(to.params.slug)?.title
    : to.meta.title
  document.title = `${page ?? 'Page introuvable'} — ${name}`
})

export default router
