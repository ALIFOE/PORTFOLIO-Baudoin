<script setup>
import { organizations } from '@/data/portfolio'

defineProps({
  title: { type: String, default: 'Ils m’ont fait <br> confiance' },
})

// Le template affiche les logos par colonnes de deux
const columns = []
for (let i = 0; i < organizations.length; i += 2) columns.push(organizations.slice(i, i + 2))
</script>

<template>
  <section class="brand-section-3 brand-section-light section-padding fix">
    <div class="container">
      <div class="section-title text-center">
        <h2 v-split class="style-3" v-html="title"></h2>
      </div>
      <div class="row g-0">
        <div
          v-for="(col, i) in columns"
          :key="i"
          v-anim="`${0.2 + i * 0.2}s`"
          class="col-xl-3 col-lg-3 col-md-6"
        >
          <div class="brand-items bb-right">
            <div v-for="(org, j) in col" :key="org.name" class="brand-image" :class="{ 'bb-bottom': j === 0 }">
              <img :src="org.logo" :alt="org.name" :title="org.name" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
