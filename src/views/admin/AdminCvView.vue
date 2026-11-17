<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '@/api'
import { content, media, setSection, resetSection } from '@/content'
import { startUpload } from '@/admin/uploads'
import { notify, handleError, formatDate, formatSize } from '@/admin/ui'

/** Remplacement du CV : chaque PDF envoyé est publié aussitôt. */
const loading = ref(true)
const version = ref(null)
const job = ref(null)
const over = ref(false)
const fileInput = ref(null)
const history = ref([])

const cv = computed(() => content.cv)
const url = computed(() => media(cv.value.file))
const isDefault = computed(() => version.value === null)

async function load() {
  loading.value = true
  try {
    const { sections } = await adminApi.content()
    if (sections.cv) setSection('cv', sections.cv.data)
    else resetSection('cv')
    version.value = sections.cv?.version ?? null
    history.value = (await adminApi.media('document')).items
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

async function publish(file, name) {
  const data = { file, name, updatedAt: new Date().toISOString() }
  const res = await adminApi.save('cv', data, version.value)
  setSection('cv', res.data)
  version.value = res.version
}

async function send(file) {
  if (!file) return
  job.value = startUpload(file, { kind: 'document', purpose: 'cv' })
  try {
    const item = await job.value.promise
    await publish(item.path, item.name || file.name)
    notify('Nouveau CV en ligne : les boutons « Mon CV » du site pointent maintenant vers ce fichier.')
    history.value = (await adminApi.media('document')).items
    job.value = null
  } catch (e) {
    handleError(e)
  }
}
async function use(item) {
  try {
    await publish(item.path, item.name)
    notify('Ce CV est maintenant celui du site.')
  } catch (e) {
    handleError(e)
  }
}
async function restore() {
  if (!window.confirm("Remettre le CV d'origine du site ?")) return
  try {
    await adminApi.reset('cv')
    resetSection('cv')
    version.value = null
    notify("CV d'origine rétabli.")
  } catch (e) {
    handleError(e)
  }
}

const onFile = (e) => {
  send(e.target.files?.[0])
  e.target.value = ''
}
const onDrop = (e) => {
  over.value = false
  send(e.dataTransfer?.files?.[0])
}

onMounted(load)
</script>

<template>
  <div class="adm-editor">
    <header class="adm-editor__head">
      <div>
        <h1>Mon CV</h1>
        <p class="adm-muted">Le CV proposé au téléchargement sur le site (en-tête, accueil, À propos, contact). Format PDF.</p>
      </div>
    </header>

    <div v-if="loading" class="adm-empty"><i class="fa-solid fa-spinner fa-spin"></i> Chargement…</div>
    <template v-else>
      <section class="adm-panel adm-cv">
        <span class="adm-cv__icon"><i class="fa-regular fa-file-pdf"></i></span>
        <div class="adm-cv__info">
          <span class="adm-label">CV actuellement en ligne</span>
          <strong>{{ cv.name || cv.file.split('/').pop() }}</strong>
          <p class="adm-muted">
            <template v-if="isDefault">CV d'origine du site</template>
            <template v-else-if="cv.updatedAt">Mis en ligne le {{ formatDate(cv.updatedAt) }}</template>
          </p>
        </div>
        <div class="adm-actions">
          <a v-if="url" :href="url" target="_blank" rel="noopener" class="adm-btn"><i class="fa-regular fa-eye"></i>Ouvrir</a>
          <button v-if="!isDefault" type="button" class="adm-btn adm-btn--ghost" @click="restore">
            <i class="fa-solid fa-rotate-left"></i>CV d'origine
          </button>
        </div>
      </section>

      <div
        class="adm-drop adm-drop--large"
        :class="{ 'is-over': over }"
        @dragover.prevent="over = true"
        @dragleave.prevent="over = false"
        @drop.prevent="onDrop"
      >
        <i class="fa-solid fa-file-arrow-up"></i>
        <p><strong>Remplacer mon CV</strong> — glissez-déposez le nouveau PDF ici ou</p>
        <button type="button" class="adm-btn adm-btn--primary" :disabled="job?.status === 'uploading'" @click="fileInput.click()">
          <i class="fa-solid fa-cloud-arrow-up"></i>Choisir le PDF
        </button>
        <div v-if="job?.status === 'uploading'" class="adm-progress"><span :style="{ width: `${Math.round(job.progress * 100)}%` }"></span></div>
        <small class="adm-hint">Le nouveau CV est publié immédiatement. Les anciennes versions restent ci-dessous.</small>
        <input ref="fileInput" type="file" hidden accept="application/pdf" @change="onFile" />
      </div>

      <section v-if="history.length" class="adm-panel">
        <h2>Versions envoyées</h2>
        <ul class="adm-files">
          <li v-for="item in history" :key="item.id">
            <i class="fa-regular fa-file-pdf"></i>
            <span class="adm-files__name">
              <strong>{{ item.name }}</strong>
              <small class="adm-muted">{{ formatDate(item.created_at) }} · {{ formatSize(item.size) }}</small>
            </span>
            <span v-if="item.path === cv.file" class="adm-badge is-demande">En ligne</span>
            <a :href="media(item.path)" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">Ouvrir</a>
            <button v-if="item.path !== cv.file" type="button" class="adm-btn adm-btn--sm" @click="use(item)">Utiliser</button>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
