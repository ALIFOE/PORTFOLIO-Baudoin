<script setup>
import { reactive } from 'vue'
import { expertise } from '@/data/portfolio'

defineProps({
  title: { type: String, default: "Domaines d'expertise <br> au service de vos projets" },
})

// Image qui suit la souris au survol (comportement du template)
const hover = reactive({})
const onMove = (i, e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  hover[i] = {
    opacity: 1,
    visibility: 'visible',
    transform: `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) rotate(10deg)`,
  }
}
const onLeave = (i) => {
  hover[i] = { opacity: 0, visibility: 'hidden', transform: 'translateY(-50%) rotate(10deg)' }
}
</script>

<template>
  <section class="comprehensive-section-3 section-padding fix section-bg">
    <div class="container">
      <div class="section-title">
        <h2 v-split class="style-3 text-white" v-html="title"></h2>
      </div>
      <div class="comprehensive-wrapper">
        <div
          v-for="(item, i) in expertise"
          :key="item.title"
          v-anim="`${0.3 + i * 0.2}s`"
          class="comprehensive-items"
          :class="{ 'mt-0': i === 0 }"
          @mousemove="onMove(i, $event)"
          @mouseleave="onLeave(i)"
        >
          <div class="icon expertise-icon">
            <i :class="item.icon"></i>
          </div>
          <h3 class="title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <div class="hover-image" :style="hover[i]">
            <img :src="item.image" alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
