<script setup>
import { ref } from 'vue'
import { ICONS } from '@/admin/icons'

/** Choix d'une icône Font Awesome : grille de suggestions ou saisie libre. */
defineProps({ label: { type: String, default: 'Icône' } })
const model = defineModel({ type: String, default: '' })
const open = ref(false)
const pick = (value) => {
  model.value = value
  open.value = false
}
</script>

<template>
  <div class="adm-field adm-icon">
    <span>{{ label }}</span>
    <div class="adm-icon__row">
      <button type="button" class="adm-icon__current" :aria-expanded="open" title="Choisir une icône" @click="open = !open">
        <i :class="model || 'fa-regular fa-square'"></i>
      </button>
      <input v-model.trim="model" placeholder="fa-solid fa-code" @focus="open = false" />
    </div>
    <div v-if="open" class="adm-icon__grid">
      <button
        v-for="ic in ICONS"
        :key="ic.value"
        type="button"
        :title="ic.label"
        :class="{ 'is-active': model === ic.value }"
        @click="pick(ic.value)"
      >
        <i :class="ic.value"></i>
      </button>
    </div>
  </div>
</template>
