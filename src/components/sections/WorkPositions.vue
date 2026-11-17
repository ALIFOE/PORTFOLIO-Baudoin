<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, default: 'Parcours professionnel' },
  items: { type: Array, required: true },
  padded: { type: Boolean, default: true },
  more: { type: Boolean, default: false },
})

// L'élément survolé devient "actif" (fond violet), comme dans le template
const active = ref(0)
</script>

<template>
  <section v-if="items.length" class="work-positions fix" :class="{ 'section-padding': padded }">
    <div class="container">
      <div class="section-title text-center text-xl-start">
        <h2 v-split class="style-3" v-html="title"></h2>
      </div>
      <div
        v-for="(job, i) in items"
        :key="i"
        v-anim="`${0.2 + (i % 4) * 0.15}s`"
        class="work-positions-items"
        :class="{ active: active === i }"
        @mouseenter="active = i"
      >
        <span class="year">
          {{ job.period }}
          <em v-if="job.current" class="badge-current">En cours</em>
        </span>
        <h3 class="title">{{ job.company }}</h3>
        <div class="content">
          <h4 class="title-2">{{ job.role }}</h4>
          <ul>
            <li v-for="(t, k) in job.tasks.slice(0, 2)" :key="k">• {{ t }}</li>
          </ul>
        </div>
      </div>
      <div v-if="more" v-anim class="text-center text-xl-start mt-5">
        <router-link to="/experience" class="theme-btn">Tout mon parcours</router-link>
      </div>
    </div>
  </section>
</template>
