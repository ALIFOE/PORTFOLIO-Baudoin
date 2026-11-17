<script setup>
import { ref, reactive } from 'vue'
import { galleryItem, videoEmbed } from '@/content'
import { acceptAttr, startUpload } from '@/admin/uploads'
import { notify, formatSize } from '@/admin/ui'
import AMediaPicker from './AMediaPicker.vue'
import AMedia from './AMedia.vue'

/**
 * Bibliothèque de réalisations d'un domaine : photos et vidéos (fichiers ou YouTube/Vimeo),
 * chacune avec un titre et une description. L'ordre est celui de la galerie du site.
 */
const model = defineModel({ type: Array, default: () => [] })

const fileInput = ref(null)
const picker = ref(false)
const over = ref(false)
const videoUrl = ref('')
const queue = reactive([])
let running = false

const newItem = (data) => ({ type: 'image', src: '', thumb: '', poster: '', url: '', title: '', text: '', ...data })
const preview = (m) => galleryItem(m)

function addFiles(files) {
  for (const file of files) queue.push({ file, job: null })
  run()
}
// Un envoi à la fois : plus fiable sur une connexion lente
async function run() {
  if (running) return
  running = true
  while (queue.some((q) => !q.job)) {
    const entry = queue.find((q) => !q.job)
    entry.job = startUpload(entry.file, { kind: 'media' })
    try {
      const item = await entry.job.promise
      model.value.push(newItem({ type: item.kind === 'video' ? 'video' : 'image', src: item.path, thumb: item.thumb }))
      queue.splice(queue.indexOf(entry), 1)
    } catch (e) {
      if (!e?.data?.aborted) notify(e.message, 'error')
    }
  }
  running = false
}
function dismiss(entry) {
  entry.job?.abort?.()
  const i = queue.indexOf(entry)
  if (i !== -1) queue.splice(i, 1)
}

function onFiles(e) {
  addFiles([...(e.target.files ?? [])])
  e.target.value = ''
}
function onDrop(e) {
  over.value = false
  addFiles([...(e.dataTransfer?.files ?? [])])
}
function addVideoLink() {
  const url = videoUrl.value.trim()
  if (!videoEmbed(url)) {
    notify('Collez le lien d’une vidéo YouTube ou Vimeo (par exemple https://youtu.be/…).', 'error')
    return
  }
  model.value.push(newItem({ type: 'video', url }))
  videoUrl.value = ''
}
function onPick(entries) {
  for (const e of entries) model.value.push(newItem({ type: e.kind === 'video' ? 'video' : 'image', src: e.ref, thumb: e.thumb }))
  picker.value = false
}

function move(i, step) {
  const j = i + step
  if (j < 0 || j >= model.value.length) return
  const [item] = model.value.splice(i, 1)
  model.value.splice(j, 0, item)
}
function remove(i) {
  if (window.confirm('Retirer ce média de la galerie ? (Le fichier reste dans la médiathèque.)')) model.value.splice(i, 1)
}
const typeLabel = (m) => (m.type === 'image' ? 'Photo' : m.url ? (videoEmbed(m.url)?.provider === 'vimeo' ? 'Vimeo' : 'YouTube') : 'Vidéo')

// Clés stables pour que les champs suivent leur élément quand on réordonne
const ids = new WeakMap()
let seq = 0
const keyOf = (m) => (ids.has(m) ? ids.get(m) : (ids.set(m, ++seq), seq))
</script>

<template>
  <div class="adm-gallery is-wide">
    <div
      class="adm-drop"
      :class="{ 'is-over': over }"
      @dragover.prevent="over = true"
      @dragleave.prevent="over = false"
      @drop.prevent="onDrop"
    >
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <p><strong>Glissez-déposez vos photos et vidéos ici</strong> ou</p>
      <div class="adm-actions">
        <button type="button" class="adm-btn adm-btn--primary" @click="fileInput.click()">
          <i class="fa-solid fa-plus"></i>Choisir des fichiers
        </button>
        <button type="button" class="adm-btn" @click="picker = true"><i class="fa-regular fa-images"></i>Médiathèque</button>
      </div>
      <small class="adm-hint">Photos JPG, PNG, WebP · vidéos MP4 (H.264 conseillé), WebM ou MOV. Les grandes photos sont réduites automatiquement.</small>
      <input ref="fileInput" type="file" hidden multiple :accept="acceptAttr('media')" @change="onFiles" />
    </div>

    <div class="adm-gallery__link">
      <label class="adm-field">
        <span>Ajouter une vidéo YouTube ou Vimeo</span>
        <input v-model="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=…" @keydown.enter.prevent="addVideoLink" />
      </label>
      <button type="button" class="adm-btn" @click="addVideoLink"><i class="fa-brands fa-youtube"></i>Ajouter la vidéo</button>
    </div>

    <ul v-if="queue.length" class="adm-uploads">
      <li v-for="(q, k) in queue" :key="k" :class="{ 'is-error': q.job?.status === 'error' }">
        <span class="adm-uploads__name">{{ q.file.name }} <em>{{ formatSize(q.file.size) }}</em></span>
        <span v-if="q.job?.status === 'error'" class="adm-uploads__error">{{ q.job.error }}</span>
        <span v-else-if="!q.job" class="adm-muted">En attente…</span>
        <div v-else class="adm-progress"><span :style="{ width: `${Math.round(q.job.progress * 100)}%` }"></span></div>
        <button type="button" class="adm-icon-btn" :title="q.job?.status === 'error' ? 'Fermer' : 'Annuler'" @click="dismiss(q)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>

    <p v-if="!model.length" class="adm-empty-sm">
      Aucune réalisation dans cette galerie. Ajoutez des photos ou des vidéos : elles apparaîtront sur la page du domaine.
    </p>

    <ul v-else class="adm-gallery__grid">
      <li v-for="(m, i) in model" :key="keyOf(m)" class="adm-gitem">
        <div class="adm-gitem__thumb">
          <img v-if="preview(m).preview" :src="preview(m).preview" alt="" loading="lazy" />
          <video v-else-if="preview(m).kind === 'video'" :src="`${preview(m).full}#t=0.5`" muted preload="metadata"></video>
          <span class="adm-gitem__type"><i :class="m.type === 'image' ? 'fa-regular fa-image' : 'fa-solid fa-circle-play'"></i>{{ typeLabel(m) }}</span>
          <span class="adm-gitem__num">{{ i + 1 }}</span>
        </div>
        <div class="adm-gitem__fields">
          <input v-model="m.title" maxlength="160" placeholder="Titre (facultatif)" aria-label="Titre" />
          <textarea v-model="m.text" rows="2" maxlength="1500" placeholder="Description : événement, client, lieu, date…" aria-label="Description"></textarea>
          <input v-if="m.url" v-model.trim="m.url" type="url" aria-label="Lien de la vidéo" />
          <AMedia
            v-if="m.type === 'video' && !m.url"
            v-model="m.poster"
            label="Image d'aperçu (facultatif)"
            kind="image"
            class="adm-gitem__poster"
          />
        </div>
        <div class="adm-gitem__tools">
          <button type="button" class="adm-icon-btn" :disabled="i === 0" title="Avant" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" class="adm-icon-btn" :disabled="i === model.length - 1" title="Après" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button type="button" class="adm-icon-btn is-danger" title="Retirer de la galerie" @click="remove(i)">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </li>
    </ul>

    <AMediaPicker v-if="picker" kind="media" multiple @pick="onPick" @close="picker = false" />
  </div>
</template>
