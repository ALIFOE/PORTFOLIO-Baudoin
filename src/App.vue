<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createSmoother, destroySmoother, getSmoother, refreshScroll } from '@/motion'
import { links } from '@/content'

import AppPreloader from '@/components/layout/AppPreloader.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppOffcanvas from '@/components/layout/AppOffcanvas.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MouseCursor from '@/components/layout/MouseCursor.vue'
import BackToTop from '@/components/layout/BackToTop.vue'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)
// Pages « nues » (administration) : sans en-tête, menu, pied de page ni bouton WhatsApp
const bare = computed(() => !!route.meta.bare)
// Une page publique est recréée à chaque URL (animations d'entrée) ; l'admin garde sa mise en page
const viewKey = (r) => (r.meta.bare ? r.matched[0]?.path : r.fullPath)
const content = ref(null)

// Chaque changement de page : on ferme le menu, on remonte en haut
// et on recalcule les ScrollTrigger (hauteur de page différente).
const stopAfterEach = router.afterEach((to, from) => {
  menuOpen.value = false
  if (to.fullPath === from.fullPath) return
  nextTick(() => {
    const smoother = getSmoother()
    if (smoother) smoother.scrollTop(0)
    else window.scrollTo(0, 0)
    refreshScroll()
  })
})

// Les images qui se chargent changent la hauteur de la page
const onAssetLoad = (e) => {
  if (e.target?.tagName === 'IMG') refreshScroll()
}

// Défilement fluide sur le site public, défilement natif dans l'administration
watch(bare, (isBare) => (isBare ? destroySmoother() : createSmoother()))

onMounted(() => {
  if (!bare.value) createSmoother()
  content.value?.addEventListener('load', onAssetLoad, true)
})

onBeforeUnmount(() => {
  stopAfterEach()
  content.value?.removeEventListener('load', onAssetLoad, true)
})
</script>

<template>
  <div class="page-wrapper">
    <AppPreloader />
    <BackToTop v-if="!bare" />
    <MouseCursor />
    <AppOffcanvas v-if="!bare" v-model:open="menuOpen" />
    <AppHeader v-if="!bare" @toggle-menu="menuOpen = true" />

    <a
      v-if="!bare && links.whatsapp"
      :href="links.whatsapp"
      target="_blank"
      rel="noopener"
      class="whatsapp-float"
      aria-label="Discuter sur WhatsApp"
    >
      <i class="fa-brands fa-whatsapp"></i>
    </a>

    <div id="smooth-wrapper">
      <div id="smooth-content" ref="content">
        <main>
          <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="viewKey(route)" />
          </router-view>
        </main>
        <AppFooter v-if="!bare" />
      </div>
    </div>
  </div>
</template>
