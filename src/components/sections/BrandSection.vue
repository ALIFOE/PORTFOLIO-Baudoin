<script setup>
import { computed } from 'vue'
import { content, media } from '@/content'

defineProps({
  title: { type: String, default: 'Ils m’ont fait <br> confiance' },
})

// Le template affiche les logos par colonnes de deux
const columns = computed(() => {
  const orgs = content.experience.organizations.filter((o) => media(o.logo))
  const cols = []
  for (let i = 0; i < orgs.length; i += 2) cols.push(orgs.slice(i, i + 2))
  return cols
})
// 4 colonnes par ligne (template) ; au-delà, toutes les colonnes sur une même ligne,
// et sur petit écran chaque colonne devient une ligne de deux logos (grille régulière)
const many = computed(() => columns.value.length > 4)
const colClass = computed(() => (many.value ? 'col-lg col-12' : 'col-xl-3 col-lg-3 col-md-6'))
</script>

<template>
  <section v-if="columns.length" class="brand-section-3 brand-section-light section-padding fix">
    <div class="container">
      <div class="section-title text-center">
        <h2 v-split class="style-3" v-html="title"></h2>
      </div>
      <div class="row g-0" :class="{ 'brand-wall--many': many }">
        <div
          v-for="(col, i) in columns"
          :key="i"
          v-anim="`${0.2 + (i % 5) * 0.15}s`"
          :class="colClass"
        >
          <div class="brand-items bb-right">
            <div v-for="(org, j) in col" :key="org.name + j" class="brand-image" :class="{ 'bb-bottom': j === 0 }">
              <img :src="media(org.logo)" :alt="org.name" :title="org.name" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
