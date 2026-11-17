<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { galleryItem } from '@/content'
import { refreshScroll } from '@/motion'
import MediaLightbox from './MediaLightbox.vue'

/** Galerie de réalisations (photos et vidéos) avec filtre et visionneuse. */
const props = defineProps({
  items: { type: Array, required: true }, // [{ type, src, thumb, poster, url, title, text }]
})

const all = computed(() => props.items.map(galleryItem).filter((m) => m.full || m.embed))
const counts = computed(() => ({
  all: all.value.length,
  image: all.value.filter((m) => m.kind === 'image').length,
  video: all.value.filter((m) => m.kind !== 'image').length,
}))
const filter = ref('all')
const visible = computed(() =>
  filter.value === 'all' ? all.value : all.value.filter((m) => (filter.value === 'image' ? m.kind === 'image' : m.kind !== 'image')),
)
const openIndex = ref(null)

watch(filter, () => nextTick(refreshScroll))
</script>

<template>
  <div class="media-gallery">
    <div v-if="counts.image && counts.video" class="project-filters" role="group" aria-label="Filtrer la galerie">
      <button
        v-for="f in [
          { key: 'all', label: 'Tout', icon: 'fa-solid fa-grid-2' },
          { key: 'image', label: 'Photos & visuels', icon: 'fa-regular fa-image' },
          { key: 'video', label: 'Vidéos', icon: 'fa-solid fa-circle-play' },
        ]"
        :key="f.key"
        type="button"
        class="filter-btn"
        :class="{ 'is-active': filter === f.key }"
        :aria-pressed="filter === f.key"
        @click="filter = f.key"
      >
        <i :class="f.icon"></i>{{ f.label }}<small>{{ counts[f.key] }}</small>
      </button>
    </div>

    <ul class="media-grid">
      <li v-for="(m, i) in visible" :key="`${m.src}|${m.url}|${i}`" class="media-tile" :class="`is-${m.kind}`">
        <button type="button" class="media-tile__open" :aria-label="`Agrandir : ${m.title || 'réalisation ' + (i + 1)}`" @click="openIndex = i">
          <img v-if="m.preview" :src="m.preview" :alt="m.title || ''" loading="lazy" />
          <video v-else-if="m.kind === 'video'" :src="`${m.full}#t=0.5`" muted preload="metadata" playsinline></video>
          <span v-else class="media-tile__placeholder"><i class="fa-solid fa-film"></i></span>
          <span v-if="m.kind !== 'image'" class="media-tile__play"><i class="fa-solid fa-play"></i></span>
          <span v-if="m.title" class="media-tile__caption">{{ m.title }}</span>
        </button>
      </li>
    </ul>

    <MediaLightbox v-model="openIndex" :items="visible" />
  </div>
</template>
