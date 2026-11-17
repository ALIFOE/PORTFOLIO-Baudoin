<script setup>
import { formatDate } from '@/admin/ui'

/**
 * Cadre commun des pages d'édition : titre, état, boutons, barre « non enregistré ».
 * editor = useSectionEditor(...)
 */
const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  preview: { type: String, default: '' }, // page du site concernée
  editor: { type: Object, required: true },
})
const state = props.editor.state
</script>

<template>
  <div class="adm-editor">
    <header class="adm-editor__head">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="text" class="adm-muted">{{ text }}</p>
        <p v-if="!state.loading && !state.error" class="adm-editor__meta">
          <template v-if="state.version">
            <i class="fa-solid fa-circle-check"></i> Version personnalisée, enregistrée le {{ formatDate(state.updatedAt) }}
          </template>
          <template v-else><i class="fa-regular fa-circle"></i> Contenu d'origine du site (jamais modifié ici)</template>
        </p>
      </div>
      <div class="adm-actions">
        <a v-if="preview" :href="`#${preview}`" target="_blank" rel="noopener" class="adm-btn">
          <i class="fa-regular fa-eye"></i>Voir sur le site
        </a>
        <button v-if="state.version" type="button" class="adm-btn adm-btn--ghost" @click="editor.restoreDefaults">
          <i class="fa-solid fa-rotate-left"></i>Contenu d'origine
        </button>
        <button
          type="button"
          class="adm-btn adm-btn--primary"
          :disabled="!editor.dirty.value || state.saving"
          @click="editor.save"
        >
          <i :class="state.saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>Enregistrer
        </button>
      </div>
    </header>

    <div v-if="state.loading" class="adm-empty"><i class="fa-solid fa-spinner fa-spin"></i> Chargement…</div>
    <p v-else-if="state.error" class="adm-alert is-error" role="alert">
      {{ state.error }}
      <button type="button" class="adm-link" @click="editor.load">Réessayer</button>
    </p>
    <div v-else class="adm-editor__body">
      <slot :data="state.data" />
    </div>

    <Teleport to="body">
      <div v-if="editor.dirty.value" class="adm adm-savebar" role="region" aria-label="Modifications non enregistrées">
        <span><i class="fa-solid fa-pen"></i> Modifications non enregistrées</span>
        <div class="adm-actions">
          <button type="button" class="adm-btn" :disabled="state.saving" @click="editor.discard">Annuler</button>
          <button type="button" class="adm-btn adm-btn--primary" :disabled="state.saving" @click="editor.save">
            <i :class="state.saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>Enregistrer et publier
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
