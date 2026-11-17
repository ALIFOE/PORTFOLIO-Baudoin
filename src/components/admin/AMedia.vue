<script setup>
import { ref, computed } from 'vue'
import { media, isVideoFile, isPdf } from '@/content'
import { acceptAttr, startUpload } from '@/admin/uploads'
import { notify } from '@/admin/ui'
import AMediaPicker from './AMediaPicker.vue'

/** Champ « fichier » : aperçu, envoi d'un nouveau fichier, choix dans la médiathèque. */
const props = defineProps({
  label: { type: String, default: 'Image' },
  hint: { type: String, default: '' },
  kind: { type: String, default: 'image' }, // image | video | document | media
  purpose: { type: String, default: 'media' },
  allowLink: { type: Boolean, default: false }, // saisie d'une URL https
})
const model = defineModel({ type: String, default: '' })
const emit = defineEmits(['uploaded'])

const fileInput = ref(null)
const picker = ref(false)
const job = ref(null)
const url = computed(() => media(model.value))
const name = computed(() => {
  if (!model.value) return 'Aucun fichier'
  if (model.value.startsWith('asset:')) return `Image du site : ${model.value.slice(6)}`
  return model.value.split('/').pop()
})
const isVideo = computed(() => isVideoFile(model.value))
const isDoc = computed(() => isPdf(model.value))

async function onFile(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  job.value = startUpload(file, { kind: props.kind, purpose: props.purpose })
  try {
    const item = await job.value.promise
    model.value = item.path
    emit('uploaded', item)
    job.value = null
  } catch (err) {
    notify(err.message, 'error')
  }
}
function onPick(entry) {
  model.value = entry.ref
  picker.value = false
}
</script>

<template>
  <div class="adm-field adm-media">
    <span>{{ label }}</span>
    <div class="adm-media__box">
      <a v-if="url" :href="url" target="_blank" rel="noopener" class="adm-media__preview" title="Ouvrir">
        <video v-if="isVideo" :src="`${url}#t=0.5`" muted preload="metadata"></video>
        <i v-else-if="isDoc" class="fa-regular fa-file-pdf"></i>
        <img v-else :src="url" alt="" />
      </a>
      <span v-else class="adm-media__preview is-empty"><i class="fa-regular fa-image"></i></span>
      <div class="adm-media__side">
        <p class="adm-media__name" :title="model">{{ name }}</p>
        <div class="adm-actions">
          <button type="button" class="adm-btn adm-btn--sm" :disabled="job?.status === 'uploading'" @click="fileInput.click()">
            <i class="fa-solid fa-cloud-arrow-up"></i>Téléverser
          </button>
          <button type="button" class="adm-btn adm-btn--sm" @click="picker = true">
            <i class="fa-regular fa-images"></i>Médiathèque
          </button>
          <button v-if="model" type="button" class="adm-btn adm-btn--sm adm-btn--ghost" @click="model = ''">Retirer</button>
        </div>
        <input v-if="allowLink" v-model.trim="model" class="adm-media__link" placeholder="ou lien https://…" />
        <div v-if="job?.status === 'uploading'" class="adm-progress" :aria-label="`Envoi ${Math.round(job.progress * 100)} %`">
          <span :style="{ width: `${Math.round(job.progress * 100)}%` }"></span>
        </div>
        <small v-if="hint" class="adm-hint">{{ hint }}</small>
      </div>
    </div>
    <input ref="fileInput" type="file" hidden :accept="acceptAttr(kind)" @change="onFile" />
    <AMediaPicker v-if="picker" :kind="kind" @pick="onPick" @close="picker = false" />
  </div>
</template>
