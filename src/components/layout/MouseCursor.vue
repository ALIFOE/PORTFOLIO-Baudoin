<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Curseur personnalisé du template (désactivé sur écrans tactiles)
const inner = ref(null)
const outer = ref(null)
const enabled = ref(false)
const hover = ref(false)
const INTERACTIVE = 'a, button, input, textarea, select, label, .cursor-pointer'

const onMove = (e) => {
  const t = `translate(${e.clientX}px, ${e.clientY}px)`
  if (outer.value) outer.value.style.transform = t
  if (inner.value) inner.value.style.transform = t
}
const onOver = (e) => {
  hover.value = !!e.target.closest?.(INTERACTIVE)
}

onMounted(() => {
  enabled.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!enabled.value) return
  window.addEventListener('mousemove', onMove, { passive: true })
  document.addEventListener('mouseover', onOver, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onOver)
})
</script>

<template>
  <template v-if="enabled">
    <div ref="outer" class="mouseCursor cursor-outer" :class="{ 'cursor-hover': hover }" style="visibility: visible"></div>
    <div ref="inner" class="mouseCursor cursor-inner" :class="{ 'cursor-hover': hover }" style="visibility: visible"></div>
  </template>
</template>
