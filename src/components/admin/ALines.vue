<script setup>
import { ref, computed, watch } from 'vue'

/**
 * Liste de textes saisie dans une seule zone :
 * une ligne par élément, ou (paragraphs) un paragraphe par bloc séparé d'une ligne vide.
 */
const props = defineProps({
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: '' },
  paragraphs: { type: Boolean, default: false },
  wide: { type: Boolean, default: true },
})
const model = defineModel({ type: Array, default: () => [] })

const separator = computed(() => (props.paragraphs ? '\n\n' : '\n'))
const split = (text) =>
  text
    .split(props.paragraphs ? /\n\s*\n/ : '\n')
    .map((s) => (props.paragraphs ? s.trim().replace(/\s*\n\s*/g, ' ') : s.trim()))
    .filter(Boolean)

const text = ref((model.value ?? []).join(separator.value))
const lineCount = computed(() => text.value.split('\n').length)
const height = computed(() => Math.min(18, Math.max(props.rows, lineCount.value + 1)))
const count = computed(() => split(text.value).length)

watch(text, (t) => {
  const next = split(t)
  if (next.join('\u0000') !== (model.value ?? []).join('\u0000')) model.value = next
})
// Valeur modifiée depuis l'extérieur (rechargement, annulation…)
watch(model, (v) => {
  if ((v ?? []).join('\u0000') !== split(text.value).join('\u0000')) text.value = (v ?? []).join(separator.value)
})
</script>

<template>
  <label class="adm-field" :class="{ 'is-wide': wide }">
    <span>{{ label }} <em class="adm-count">{{ count }}</em></span>
    <textarea v-model="text" :rows="height" :placeholder="placeholder"></textarea>
    <small class="adm-hint">
      {{ hint || (paragraphs ? 'Un paragraphe par bloc : laissez une ligne vide entre deux paragraphes.' : 'Un élément par ligne.') }}
    </small>
  </label>
</template>
