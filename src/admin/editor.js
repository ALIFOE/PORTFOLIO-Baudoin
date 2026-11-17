import { reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { adminApi } from '@/api'
import { content, clone, setSection, resetSection } from '@/content'
import { notify, handleError } from './ui'

/**
 * Édition d'une section du contenu (profil, projets…).
 *
 * - charge la dernière version enregistrée (jamais une copie périmée du navigateur) ;
 * - travaille sur une copie : rien n'est publié avant « Enregistrer » ;
 * - l'API refuse d'écraser une version enregistrée entre-temps ailleurs ;
 * - prévient avant de quitter la page avec des modifications non enregistrées.
 */
export function useSectionEditor(section) {
  const state = reactive({
    loading: true,
    error: '',
    saving: false,
    data: null,
    version: null, // null = jamais enregistrée : contenu d'origine du site
    updatedAt: null,
  })
  let snapshot = ''
  const dirty = computed(() => state.data !== null && JSON.stringify(state.data) !== snapshot)

  function take(data) {
    state.data = clone(data)
    snapshot = JSON.stringify(state.data)
  }

  async function load() {
    state.loading = true
    state.error = ''
    try {
      const { sections } = await adminApi.content()
      for (const [key, entry] of Object.entries(sections)) setSection(key, entry.data)
      const entry = sections[section]
      if (!entry) resetSection(section)
      state.version = entry?.version ?? null
      state.updatedAt = entry?.updated_at ?? null
      take(content[section])
    } catch (e) {
      if (e?.status === 401) handleError(e)
      else state.error = e.message
    } finally {
      state.loading = false
    }
  }

  async function save() {
    if (state.saving || !dirty.value) return false
    state.saving = true
    try {
      const res = await adminApi.save(section, state.data, state.version)
      setSection(section, res.data)
      state.version = res.version
      state.updatedAt = res.updated_at
      take(content[section])
      notify('Modifications enregistrées : elles sont en ligne.')
      return true
    } catch (e) {
      handleError(e)
      return false
    } finally {
      state.saving = false
    }
  }

  function discard() {
    if (window.confirm('Annuler toutes les modifications non enregistrées ?')) take(content[section])
  }

  async function restoreDefaults() {
    if (!window.confirm("Revenir au contenu d'origine de cette section ? Les modifications enregistrées seront perdues.")) return
    try {
      await adminApi.reset(section)
      resetSection(section)
      state.version = null
      state.updatedAt = null
      take(content[section])
      notify("Contenu d'origine rétabli.")
    } catch (e) {
      handleError(e)
    }
  }

  const leaveMessage = 'Des modifications ne sont pas enregistrées. Quitter quand même ?'
  onBeforeRouteLeave(() => !dirty.value || window.confirm(leaveMessage))
  const onBeforeUnload = (e) => {
    if (!dirty.value) return
    e.preventDefault()
    e.returnValue = leaveMessage
  }
  // Ctrl + S (ou Cmd + S) enregistre
  const onKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      save()
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKey)
    load()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', onBeforeUnload)
    window.removeEventListener('keydown', onKey)
  })

  return { state, dirty, load, save, discard, restoreDefaults }
}
