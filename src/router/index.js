import { createRouter, createWebHashHistory } from 'vue-router'
import { projects, profile } from '@/data/portfolio'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: profile.title } },
  { path: '/a-propos', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'À propos' } },
  { path: '/experience', name: 'experience', component: () => import('@/views/ExperienceView.vue'), meta: { title: 'Expérience' } },
  { path: '/competences', name: 'skills', component: () => import('@/views/SkillsView.vue'), meta: { title: 'Compétences' } },
  { path: '/formation', name: 'education', component: () => import('@/views/EducationView.vue'), meta: { title: 'Formation & Certifications' } },
  { path: '/projets', name: 'projects', component: () => import('@/views/ProjectsView.vue'), meta: { title: 'Projets' } },
  {
    path: '/projets/:slug',
    name: 'project',
    component: () => import('@/views/ProjectDetailView.vue'),
    props: true,
    beforeEnter: (to) => (projects.some((p) => p.slug === to.params.slug) ? true : { name: 'not-found', params: { pathMatch: to.path.slice(1).split('/') } }),
  },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue'), meta: { title: 'Contact' } },
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

router.afterEach((to) => {
  const project = to.name === 'project' ? projects.find((p) => p.slug === to.params.slug) : null
  const page = project ? project.title : (to.meta.title ?? 'Page introuvable')
  document.title = to.name === 'home' ? `${profile.fullName} — ${page}` : `${page} — ${profile.fullName}`
})

export default router
