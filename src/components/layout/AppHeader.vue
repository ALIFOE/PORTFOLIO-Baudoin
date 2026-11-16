<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { navigation, profile } from '@/data/portfolio'
import SiteLogo from './SiteLogo.vue'

defineEmits(['toggle-menu'])

const route = useRoute()
const sticky = ref(false)

const isActive = (item) => (item.to === '/' ? route.path === '/' : route.path.startsWith(item.to))

const onScroll = () => {
  sticky.value = window.scrollY > 250
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header id="header-sticky" class="header-1" :class="{ sticky }">
    <div class="container">
      <div class="mega-menu-wrapper">
        <div class="header-main">
          <router-link to="/" class="logo" aria-label="Accueil">
            <SiteLogo />
          </router-link>

          <div class="mean__menu-wrapper">
            <div class="main-menu">
              <nav aria-label="Navigation principale">
                <ul>
                  <li v-for="item in navigation" :key="item.to" :class="{ active: isActive(item) }">
                    <router-link class="circle-menu-box" :to="item.to">{{ item.label }}</router-link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div class="header-right d-flex justify-content-end align-items-center">
            <a :href="profile.cv" target="_blank" rel="noopener" class="theme-btn d-none d-sm-inline-block">
              Mon CV <i class="fa-regular fa-arrow-down-to-line ms-1"></i>
            </a>
            <div class="header__hamburger d-xl-none my-auto">
              <button class="sidebar__toggle" type="button" aria-label="Ouvrir le menu" @click="$emit('toggle-menu')">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
