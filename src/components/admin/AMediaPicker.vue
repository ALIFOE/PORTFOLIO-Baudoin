<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { adminApi } from '@/api'
import { media, siteAssets } from '@/content'
import { handleError, formatSize } from '@/admin/ui'

/**
 * Fenêtre de choix d'un fichier déjà envoyé (ou d'une image fournie avec le site).
 * kind : image | video | document | media (images et vidéos)
 * Émet pick(item) avec { ref, thumb, kind } ; multiple → plusieurs éléments à la fois.
 */
const props = defineProps({
  kind: { type: String, default: 'image' },
  multiple: { type: Boolean, default: false },
})
const emit = defineEmits(['pick', 'close'])

const tab = ref('uploads')
const items = ref([])
const loading = ref(true)
const selected = ref([])
const query = ref('')

const allowsImages = computed(() => props.kind === 'image' || props.kind === 'media')
const accepts = (k) => (props.kind === 'media' ? k === 'image' || k === 'video' : k === props.kind)

const uploads = computed(() =>
  items.value
    .filter((m) => accepts(m.kind))
    .filter((m) => !query.value || m.name.toLowerCase().includes(query.value.toLowerCase()))
    .map((m) => ({ ref: m.path, thumb: m.thumb, kind: m.kind, name: m.name, url: media(m.thumb || m.path), meta: formatSize(m.size) })),
)
const assets = computed(() =>
  Object.keys(siteAssets)
    .filter((k) => !query.value || k.toLowerCase().includes(query.value.toLowerCase()))
    .map((k) => ({ ref: `asset:${k}`, thumb: '', kind: 'image', name: k, url: siteAssets[k], meta: 'Image du site' })),
)
const list = computed(() => (tab.value === 'uploads' ? uploads.value : assets.value))

function choose(entry) {
  if (!props.multiple) {
    emit('pick', entry)
    return
  }
  const i = selected.value.findIndex((s) => s.ref === entry.ref)
  if (i === -1) selected.value.push(entry)
  else selected.value.splice(i, 1)
}
const isSelected = (entry) => selected.value.some((s) => s.ref === entry.ref)

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(async () => {
  window.addEventListener('keydown', onKey)
  try {
    items.value = (await adminApi.media(props.kind === 'media' ? '' : props.kind)).items
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div class="adm adm-modal" role="dialog" aria-modal="true" aria-label="Médiathèque" @click.self="emit('close')">
      <div class="adm-modal__card">
        <header class="adm-modal__head">
          <h2>Choisir {{ multiple ? 'des fichiers' : 'un fichier' }}</h2>
          <button type="button" class="adm-icon-btn" aria-label="Fermer" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>
        <div class="adm-modal__bar">
          <div v-if="allowsImages" class="adm-tabs">
            <button type="button" class="adm-tab" :class="{ 'is-active': tab === 'uploads' }" @click="tab = 'uploads'">
              Fichiers envoyés <small>{{ uploads.length }}</small>
            </button>
            <button type="button" class="adm-tab" :class="{ 'is-active': tab === 'assets' }" @click="tab = 'assets'">
              Images du site <small>{{ assets.length }}</small>
            </button>
          </div>
          <label class="adm-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="query" type="search" placeholder="Rechercher un nom…" aria-label="Rechercher" />
          </label>
        </div>

        <div class="adm-modal__body">
          <p v-if="loading && tab === 'uploads'" class="adm-empty-sm"><i class="fa-solid fa-spinner fa-spin"></i> Chargement…</p>
          <p v-else-if="!list.length" class="adm-empty-sm">
            Aucun fichier ici pour le moment. Utilisez le bouton « Téléverser » pour en envoyer.
          </p>
          <ul v-else class="adm-pick-grid">
            <li v-for="entry in list" :key="entry.ref">
              <button type="button" class="adm-pick" :class="{ 'is-selected': isSelected(entry) }" @click="choose(entry)">
                <img v-if="entry.kind === 'image'" :src="entry.url" alt="" loading="lazy" />
                <video v-else-if="entry.kind === 'video'" :src="`${entry.url}#t=0.5`" muted preload="metadata"></video>
                <span v-else class="adm-pick__doc"><i class="fa-regular fa-file-pdf"></i></span>
                <span class="adm-pick__name">{{ entry.name }}</span>
                <span class="adm-pick__meta">{{ entry.meta }}</span>
              </button>
            </li>
          </ul>
        </div>

        <footer v-if="multiple" class="adm-modal__foot">
          <span class="adm-muted">{{ selected.length }} sélectionné{{ selected.length > 1 ? 's' : '' }}</span>
          <button type="button" class="adm-btn" @click="emit('close')">Annuler</button>
          <button type="button" class="adm-btn adm-btn--primary" :disabled="!selected.length" @click="emit('pick', selected)">
            Ajouter
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
