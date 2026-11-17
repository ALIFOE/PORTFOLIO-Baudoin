<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { getSmoother } from '@/motion'

/**
 * Visionneuse plein écran (photos, vidéos, YouTube/Vimeo).
 * items : éléments préparés par galleryItem() ; v-model = index affiché (null = fermé).
 */
const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue'])

const open = computed(() => props.modelValue != null && !!props.items[props.modelValue])
const current = computed(() => (open.value ? props.items[props.modelValue] : null))
const closeBtn = ref(null)
let lastFocus = null
let touchX = null

const close = () => emit('update:modelValue', null)
const go = (step) => {
  const n = props.items.length
  if (n > 1) emit('update:modelValue', (props.modelValue + step + n) % n)
}

function onKey(e) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}
const onTouchStart = (e) => {
  touchX = e.touches[0]?.clientX ?? null
}
const onTouchEnd = (e) => {
  if (touchX == null) return
  const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  touchX = null
}

function lock(locked) {
  getSmoother()?.paused(locked)
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
}

watch(open, (isOpen) => {
  lock(isOpen)
  if (isOpen) {
    lastFocus = document.activeElement
    nextTick(() => closeBtn.value?.focus())
  } else {
    lastFocus?.focus?.({ preventScroll: true })
  }
})
onBeforeUnmount(() => {
  if (open.value) lock(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="current"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="current.title || 'Aperçu'"
      @click.self="close"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <button ref="closeBtn" type="button" class="lightbox__btn lightbox__close" aria-label="Fermer" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <template v-if="items.length > 1">
        <button type="button" class="lightbox__btn lightbox__nav is-prev" aria-label="Précédent" @click="go(-1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="lightbox__btn lightbox__nav is-next" aria-label="Suivant" @click="go(1)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </template>

      <figure class="lightbox__figure" @click.self="close">
        <div :key="modelValue" class="lightbox__media" :class="`is-${current.kind}`">
          <img v-if="current.kind === 'image'" :src="current.full" :alt="current.title || ''" />
          <video
            v-else-if="current.kind === 'video'"
            :src="current.full"
            :poster="current.poster || undefined"
            controls
            autoplay
            playsinline
          ></video>
          <iframe
            v-else
            :src="current.embed.embed"
            :title="current.title || 'Vidéo'"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
        <figcaption v-if="current.title || current.text" class="lightbox__caption">
          <strong v-if="current.title">{{ current.title }}</strong>
          <p v-if="current.text">{{ current.text }}</p>
        </figcaption>
      </figure>

      <span v-if="items.length > 1" class="lightbox__count">{{ modelValue + 1 }} / {{ items.length }}</span>
    </div>
  </Teleport>
</template>
