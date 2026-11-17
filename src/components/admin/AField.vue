<script setup>
/** Champ texte (une ligne ou plusieurs) avec son libellé. */
defineProps({
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  type: { type: String, default: 'text' },
  multiline: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  placeholder: { type: String, default: '' },
  maxlength: { type: [Number, String], default: undefined },
  wide: { type: Boolean, default: false },
})
const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <label class="adm-field" :class="{ 'is-wide': wide }">
    <span v-if="label">{{ label }}</span>
    <textarea v-if="multiline" v-model="model" :rows="rows" :placeholder="placeholder" :maxlength="maxlength"></textarea>
    <input v-else v-model="model" :type="type" :placeholder="placeholder" :maxlength="maxlength" />
    <small v-if="hint" class="adm-hint">{{ hint }}</small>
  </label>
</template>
