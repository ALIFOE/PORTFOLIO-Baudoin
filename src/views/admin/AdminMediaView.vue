<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { adminApi } from '@/api'
import { media } from '@/content'
import { acceptAttr, startUpload } from '@/admin/uploads'
import { session } from '@/admin/session'
import { notify, handleError, formatDate, formatSize } from '@/admin/ui'

/** Tous les fichiers envoyés : aperçu, utilisation sur le site, suppression. */
const items = ref([])
const loading = ref(true)
const filter = ref('')
const fileInput = ref(null)
const jobs = reactive([])
const busy = ref(null)

const FILTERS = [
  { key: '', label: 'Tous' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Vidéos' },
  { key: 'document', label: 'Documents' },
]
const visible = computed(() => (filter.value ? items.value.filter((m) => m.kind === filter.value) : items.value))
const count = (key) => (key ? items.value.filter((m) => m.kind === key).length : items.value.length)
const totalSize = computed(() => items.value.reduce((sum, m) => sum + m.size, 0))

async function load() {
  loading.value = true
  try {
    items.value = (await adminApi.media()).items
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

async function onFiles(e) {
  const files = [...(e.target.files ?? [])]
  e.target.value = ''
  for (const file of files) {
    const kind = file.type === 'application/pdf' ? 'document' : 'media'
    const job = startUpload(file, { kind })
    jobs.push(job)
    try {
      await job.promise
      jobs.splice(jobs.indexOf(job), 1)
    } catch (err) {
      notify(err.message, 'error')
      jobs.splice(jobs.indexOf(job), 1)
    }
  }
  await load()
}

async function remove(item) {
  const question = item.used
    ? `« ${item.name} » est encore utilisé sur le site : il n'y apparaîtra plus. Supprimer quand même ?`
    : `Supprimer définitivement « ${item.name} » ?`
  if (!window.confirm(question)) return
  busy.value = item.id
  try {
    await adminApi.deleteMedia([item.id], item.used)
    items.value = items.value.filter((m) => m.id !== item.id)
    notify('Fichier supprimé.')
  } catch (e) {
    handleError(e)
  } finally {
    busy.value = null
  }
}

async function copyLink(item) {
  const link = new URL(media(item.path), window.location.href).href
  try {
    await navigator.clipboard.writeText(link)
    notify('Lien copié.')
  } catch {
    window.prompt('Lien du fichier :', link)
  }
}

onMounted(load)
</script>

<template>
  <div class="adm-editor">
    <header class="adm-editor__head">
      <div>
        <h1>Médiathèque</h1>
        <p class="adm-muted">
          Tous les fichiers envoyés depuis l'administration ({{ items.length }} · {{ formatSize(totalSize) }}).
          <template v-if="session.uploadLimit">Taille maximale par fichier sur ce serveur : {{ formatSize(session.uploadLimit) }}.</template>
        </p>
      </div>
      <div class="adm-actions">
        <button type="button" class="adm-btn adm-btn--primary" @click="fileInput.click()">
          <i class="fa-solid fa-cloud-arrow-up"></i>Téléverser
        </button>
        <input ref="fileInput" type="file" hidden multiple :accept="`${acceptAttr('media')},${acceptAttr('document')}`" @change="onFiles" />
      </div>
    </header>

    <div class="adm-toolbar">
      <div class="adm-tabs" role="tablist" aria-label="Type de fichier">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          type="button"
          role="tab"
          class="adm-tab"
          :class="{ 'is-active': filter === f.key }"
          :aria-selected="filter === f.key"
          @click="filter = f.key"
        >
          {{ f.label }} <small>{{ count(f.key) }}</small>
        </button>
      </div>
    </div>

    <ul v-if="jobs.length" class="adm-uploads">
      <li v-for="(job, k) in jobs" :key="k">
        <span class="adm-uploads__name">{{ job.name }}</span>
        <div class="adm-progress"><span :style="{ width: `${Math.round(job.progress * 100)}%` }"></span></div>
      </li>
    </ul>

    <div v-if="loading" class="adm-empty"><i class="fa-solid fa-spinner fa-spin"></i> Chargement…</div>
    <div v-else-if="!visible.length" class="adm-empty">
      <i class="fa-regular fa-images"></i>
      <p>Aucun fichier pour le moment. Les fichiers envoyés depuis les pages de contenu apparaissent aussi ici.</p>
    </div>
    <ul v-else class="adm-library">
      <li v-for="item in visible" :key="item.id" class="adm-libitem">
        <a :href="media(item.path)" target="_blank" rel="noopener" class="adm-libitem__thumb">
          <img v-if="item.kind === 'image'" :src="media(item.thumb || item.path)" alt="" loading="lazy" />
          <video v-else-if="item.kind === 'video'" :src="`${media(item.path)}#t=0.5`" muted preload="metadata"></video>
          <i v-else class="fa-regular fa-file-pdf"></i>
          <span v-if="item.used" class="adm-libitem__used">Utilisé</span>
        </a>
        <div class="adm-libitem__info">
          <strong :title="item.name">{{ item.name }}</strong>
          <small class="adm-muted">
            {{ formatSize(item.size) }}<template v-if="item.width"> · {{ item.width }}×{{ item.height }}</template>
            · {{ formatDate(item.created_at) }}
          </small>
        </div>
        <div class="adm-libitem__tools">
          <button type="button" class="adm-icon-btn" title="Copier le lien" @click="copyLink(item)"><i class="fa-solid fa-link"></i></button>
          <button type="button" class="adm-icon-btn is-danger" title="Supprimer" :disabled="busy === item.id" @click="remove(item)">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
