<script setup>
import { ref, onMounted } from 'vue'
import { gsap, markAppReady, prefersReducedMotion } from '@/motion'

const root = ref(null)
const path = ref(null)
const done = ref(false)
const letters = 'Chargement'.split('')

onMounted(() => {
  if (prefersReducedMotion()) {
    done.value = true
    markAppReady()
    return
  }
  // Même animation que le template : texte qui s'efface puis rideau SVG qui remonte
  const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
  const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z'
  const tl = gsap.timeline({
    onComplete: () => {
      done.value = true
    },
  })
  tl.to(root.value.querySelector('.load-text'), { delay: 0.9, y: -100, opacity: 0 })
    .to(path.value, { duration: 0.5, attr: { d: curve }, ease: 'power2.in' })
    .to(path.value, { duration: 0.5, attr: { d: flat }, ease: 'power2.out' })
    .add(markAppReady, '-=0.35')
    .to(root.value, { delay: 0.2, y: -1500, duration: 0.6 })
})
</script>

<template>
  <div v-if="!done" ref="root" class="preloader" aria-hidden="true">
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <path ref="path" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"></path>
    </svg>
    <div class="preloader-heading">
      <div class="load-text">
        <span v-for="(l, i) in letters" :key="i">{{ l }}</span>
      </div>
    </div>
  </div>
</template>
