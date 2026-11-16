<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { createSmoother, getSmoother, refreshScroll } from '@/motion'
import { profile } from '@/data/portfolio'

import AppPreloader from '@/components/layout/AppPreloader.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppOffcanvas from '@/components/layout/AppOffcanvas.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MouseCursor from '@/components/layout/MouseCursor.vue'
import BackToTop from '@/components/layout/BackToTop.vue'

const router = useRouter()
const menuOpen = ref(false)
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

onMounted(() => {
  createSmoother()
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
    <BackToTop />
    <MouseCursor />
    <AppOffcanvas v-model:open="menuOpen" />
    <AppHeader @toggle-menu="menuOpen = true" />

    <a
      :href="profile.whatsapp"
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
            <component :is="Component" :key="route.fullPath" />
          </router-view>
        </main>
        <AppFooter />
      </div>
    </div>
  </div>
</template>
