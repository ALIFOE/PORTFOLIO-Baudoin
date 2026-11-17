<script setup>
import { ref } from 'vue'

/** Liste courte (technologies, outils…) sous forme d'étiquettes. */
const props = defineProps({
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  placeholder: { type: String, default: 'Ajouter…' },
  wide: { type: Boolean, default: true },
})
const model = defineModel({ type: Array, default: () => [] })
const draft = ref('')
const input = ref(null)

function add() {
  const parts = draft.value
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
  draft.value = ''
  const next = [...model.value]
  for (const p of parts) if (!next.includes(p)) next.push(p)
  if (next.length !== model.value.length) model.value = next
}
const remove = (i) => (model.value = model.value.filter((_, k) => k !== i))
function move(i, step) {
  const j = i + step
  if (j < 0 || j >= model.value.length) return
  const next = [...model.value]
  ;[next[i], next[j]] = [next[j], next[i]]
  model.value = next
}
function onKey(e) {
  if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
    e.preventDefault()
    add()
  } else if (e.key === 'Backspace' && !draft.value && model.value.length) {
    remove(model.value.length - 1)
  }
}
</script>

<template>
  <div class="adm-field" :class="{ 'is-wide': props.wide }">
    <span>{{ label }} <em class="adm-count">{{ model.length }}</em></span>
    <div class="adm-tags" @click.self="input?.focus()">
      <span v-for="(t, i) in model" :key="t + i" class="adm-tag">
        <button v-if="i > 0" type="button" class="adm-tag__move" title="Déplacer à gauche" @click="move(i, -1)">‹</button>
        {{ t }}
        <button type="button" class="adm-tag__remove" :aria-label="`Retirer ${t}`" @click="remove(i)">×</button>
      </span>
      <input ref="input" v-model="draft" :placeholder="placeholder" @keydown="onKey" @blur="add" />
    </div>
    <small class="adm-hint">{{ hint || 'Entrée ou virgule pour ajouter ; × pour retirer.' }}</small>
  </div>
</template>
