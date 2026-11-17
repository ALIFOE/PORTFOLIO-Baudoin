<script setup>
import { reactive } from 'vue'

/**
 * Liste d'éléments modifiables : ajout, suppression, ordre (l'ordre est celui du site).
 * Le contenu de chaque élément est fourni par le slot { item, index }.
 */
const props = defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  itemLabel: { type: Function, default: null }, // (item, index) => texte de l'en-tête
  newItem: { type: Function, required: true },
  addLabel: { type: String, default: 'Ajouter' },
  empty: { type: String, default: 'Aucun élément pour le moment.' },
  collapsible: { type: Boolean, default: false },
  compact: { type: Boolean, default: false }, // éléments sur une ligne
  max: { type: Number, default: 0 },
  confirmRemove: { type: Boolean, default: true },
})
const model = defineModel({ type: Array, required: true })

// Éléments dépliés, repérés par leur position
const opened = reactive(new Set())
const isOpen = (i) => !props.collapsible || opened.has(i)
const toggle = (i) => (opened.has(i) ? opened.delete(i) : opened.add(i))

// Clé stable par objet (les champs gardent leur état quand on réordonne)
const ids = new WeakMap()
let seq = 0
const keyOf = (item, i) => {
  if (item === null || typeof item !== 'object') return `v${i}`
  if (!ids.has(item)) ids.set(item, ++seq)
  return ids.get(item)
}

function add() {
  model.value.push(props.newItem())
  opened.add(model.value.length - 1)
}
function remove(i) {
  const label = props.itemLabel?.(model.value[i], i)
  if (props.confirmRemove && !window.confirm(`Supprimer ${label ? `« ${label} »` : 'cet élément'} ?`)) return
  model.value.splice(i, 1)
  const next = [...opened].filter((k) => k !== i).map((k) => (k > i ? k - 1 : k))
  opened.clear()
  next.forEach((k) => opened.add(k))
}
function move(i, step) {
  const j = i + step
  if (j < 0 || j >= model.value.length) return
  const [item] = model.value.splice(i, 1)
  model.value.splice(j, 0, item)
  const a = opened.has(i)
  const b = opened.has(j)
  opened.delete(i)
  opened.delete(j)
  if (a) opened.add(j)
  if (b) opened.add(i)
}
</script>

<template>
  <div class="adm-list-editor is-wide" :class="{ 'is-compact': compact }">
    <div v-if="title" class="adm-list-editor__head">
      <h3>{{ title }} <em class="adm-count">{{ model.length }}</em></h3>
      <p v-if="text" class="adm-muted">{{ text }}</p>
    </div>

    <p v-if="!model.length" class="adm-empty-sm">{{ empty }}</p>

    <div v-for="(item, i) in model" :key="keyOf(item, i)" class="adm-item" :class="{ 'is-open': isOpen(i) }">
      <div class="adm-item__head">
        <button
          v-if="collapsible"
          type="button"
          class="adm-item__toggle"
          :aria-expanded="isOpen(i)"
          @click="toggle(i)"
        >
          <i class="fa-solid fa-chevron-right"></i>
          <span class="adm-item__num">{{ i + 1 }}</span>
          <strong>{{ itemLabel?.(item, i) || 'Nouvel élément' }}</strong>
          <slot name="badges" :item="item" :index="i" />
        </button>
        <span v-else class="adm-item__num">{{ i + 1 }}</span>

        <div v-if="!collapsible" class="adm-item__inline">
          <slot :item="item" :index="i" />
        </div>

        <div class="adm-item__tools">
          <button type="button" class="adm-icon-btn" :disabled="i === 0" title="Monter" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button type="button" class="adm-icon-btn" :disabled="i === model.length - 1" title="Descendre" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button type="button" class="adm-icon-btn is-danger" title="Supprimer" @click="remove(i)">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div v-if="collapsible && isOpen(i)" class="adm-item__body adm-grid">
        <slot :item="item" :index="i" />
      </div>
    </div>

    <button v-if="!max || model.length < max" type="button" class="adm-btn adm-list-editor__add" @click="add">
      <i class="fa-solid fa-plus"></i>{{ addLabel }}
    </button>
  </div>
</template>
