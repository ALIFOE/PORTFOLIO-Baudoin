<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { scrollToTop } from '@/motion'

const show = ref(false)
const onScroll = () => {
  show.value = window.scrollY > 700
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button id="back-top" class="back-to-top" :class="{ show }" type="button" aria-label="Retour en haut" @click="scrollToTop()">
    <i class="fa-regular fa-arrow-up"></i>
  </button>
</template>
