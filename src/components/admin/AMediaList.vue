<script setup>
import { ref, reactive } from 'vue'
import { media } from '@/content'
import { acceptAttr, startUpload } from '@/admin/uploads'
import { notify } from '@/admin/ui'
import AMediaPicker from './AMediaPicker.vue'

/** Liste d'images (galerie d'un projet) : envoi multiple, choix, ordre, suppression. */
defineProps({
  label: { type: String, default: 'Galerie' },
  hint: { type: String, default: '' },
})
const model = defineModel({ type: Array, default: () => [] })
const fileInput = ref(null)
const picker = ref(false)
const jobs = reactive([])

async function onFiles(e) {
  const files = [...(e.target.files ?? [])]
  e.target.value = ''
  for (const file of files) {
    const job = startUpload(file, { kind: 'image' })
    jobs.push(job)
    try {
      const item = await job.promise
      model.value = [...model.value, item.path]
      jobs.splice(jobs.indexOf(job), 1)
    } catch (err) {
      notify(err.message, 'error')
      setTimeout(() => jobs.splice(jobs.indexOf(job), 1), 4000)
    }
  }
}
function onPick(entries) {
  model.value = [...model.value, ...entries.map((x) => x.ref).filter((r) => !model.value.includes(r))]
  picker.value = false
}
const remove = (i) => (model.value = model.value.filter((_, k) => k !== i))
function move(i, step) {
  const j = i + step
  if (j < 0 || j >= model.value.length) return
  const next = [...model.value]
  ;[next[i], next[j]] = [next[j], next[i]]
  model.value = next
}
</script>

<template>
  <div class="adm-field is-wide">
    <span>{{ label }} <em class="adm-count">{{ model.length }}</em></span>
    <ul class="adm-thumbs">
      <li v-for="(refValue, i) in model" :key="refValue + i" class="adm-thumb">
        <a :href="media(refValue)" target="_blank" rel="noopener"><img :src="media(refValue)" alt="" loading="lazy" /></a>
        <div class="adm-thumb__tools">
          <button type="button" class="adm-icon-btn" :disabled="i === 0" title="Avant" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" class="adm-icon-btn" :disabled="i === model.length - 1" title="Après" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button type="button" class="adm-icon-btn is-danger" title="Retirer" @click="remove(i)">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </li>
      <li v-for="(job, k) in jobs" :key="`job${k}`" class="adm-thumb is-pending">
        <span class="adm-thumb__job">
          <template v-if="job.status === 'error'"><i class="fa-solid fa-triangle-exclamation"></i> Échec</template>
          <template v-else>{{ Math.round(job.progress * 100) }} %</template>
        </span>
        <div class="adm-progress"><span :style="{ width: `${Math.round(job.progress * 100)}%` }"></span></div>
      </li>
    </ul>
    <div class="adm-actions">
      <button type="button" class="adm-btn adm-btn--sm" @click="fileInput.click()">
        <i class="fa-solid fa-cloud-arrow-up"></i>Téléverser des images
      </button>
      <button type="button" class="adm-btn adm-btn--sm" @click="picker = true">
        <i class="fa-regular fa-images"></i>Médiathèque
      </button>
    </div>
    <small v-if="hint" class="adm-hint">{{ hint }}</small>
    <input ref="fileInput" type="file" hidden multiple :accept="acceptAttr('image')" @change="onFiles" />
    <AMediaPicker v-if="picker" kind="image" multiple @pick="onPick" @close="picker = false" />
  </div>
</template>
