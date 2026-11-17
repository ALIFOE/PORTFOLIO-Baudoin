<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi } from '@/api'
import { session, logout } from '@/admin/session'
import { toast, inbox } from '@/admin/ui'
import SiteLogo from '@/components/layout/SiteLogo.vue'
import '@/assets/css/admin.css'

const router = useRouter()

const groups = [
  { title: null, items: [{ to: { name: 'admin' }, label: 'Messages', icon: 'fa-regular fa-envelope', badge: true }] },
  {
    title: 'Contenu du site',
    items: [
      { to: { name: 'admin-profile' }, label: 'À propos', icon: 'fa-regular fa-user' },
      { to: { name: 'admin-domains' }, label: "Domaines d'activité", icon: 'fa-solid fa-layer-group' },
      { to: { name: 'admin-experience' }, label: 'Expérience', icon: 'fa-solid fa-briefcase' },
      { to: { name: 'admin-skills' }, label: 'Compétences', icon: 'fa-solid fa-sliders' },
      { to: { name: 'admin-education' }, label: 'Formation', icon: 'fa-solid fa-graduation-cap' },
      { to: { name: 'admin-projects' }, label: 'Projets', icon: 'fa-solid fa-diagram-project' },
    ],
  },
  {
    title: 'Fichiers',
    items: [
      { to: { name: 'admin-cv' }, label: 'Mon CV', icon: 'fa-regular fa-file-pdf' },
      { to: { name: 'admin-media' }, label: 'Médiathèque', icon: 'fa-regular fa-images' },
    ],
  },
  { title: 'Compte', items: [{ to: { name: 'admin-account' }, label: 'Identifiants', icon: 'fa-solid fa-key' }] },
]

async function signOut() {
  await logout().catch(() => {})
  router.replace({ name: 'admin-login' })
}

onMounted(async () => {
  try {
    inbox.newCount = (await adminApi.list({ status: 'new', per_page: 5 })).counts.new
  } catch {
    // pastille facultative
  }
})
</script>

<template>
  <section class="adm adm-shell">
    <header class="adm-top">
      <div class="adm-top__inner">
        <div class="adm-top__brand">
          <router-link to="/" aria-label="Voir le site"><SiteLogo /></router-link>
          <span>Administration</span>
        </div>
        <div class="adm-top__actions">
          <span class="adm-user"><i class="fa-regular fa-user"></i>{{ session.username }}</span>
          <a href="#/" target="_blank" rel="noopener" class="adm-btn"><i class="fa-regular fa-arrow-up-right"></i><span class="adm-hide-sm">Voir le site</span></a>
          <button type="button" class="adm-btn adm-btn--dark" @click="signOut">
            <i class="fa-solid fa-right-from-bracket"></i><span class="adm-hide-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>

    <div class="adm-shell__body">
      <nav class="adm-nav" aria-label="Sections de l'administration">
        <div v-for="(g, k) in groups" :key="k" class="adm-nav__group">
          <span v-if="g.title" class="adm-nav__title">{{ g.title }}</span>
          <router-link
            v-for="item in g.items"
            :key="item.label"
            :to="item.to"
            class="adm-nav__link"
            exact-active-class="is-active"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <small v-if="item.badge && inbox.newCount" class="adm-nav__badge">{{ inbox.newCount }}</small>
          </router-link>
        </div>
      </nav>

      <main class="adm-main">
        <router-view />
      </main>
    </div>

    <Teleport to="body">
      <p v-if="toast.text" class="adm-toast" :class="`is-${toast.kind}`" role="status" aria-live="polite">{{ toast.text }}</p>
    </Teleport>
  </section>
</template>
