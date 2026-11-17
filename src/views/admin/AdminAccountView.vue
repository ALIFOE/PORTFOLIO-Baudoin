<script setup>
import { reactive } from 'vue'
import { adminApi } from '@/api'
import { session, applySession } from '@/admin/session'
import { notify, handleError } from '@/admin/ui'

/** Identifiant et mot de passe du compte administrateur. */
const form = reactive({ username: session.username, current: '', next: '', confirm: '', error: '', busy: false })

async function submit() {
  form.error = ''
  const username = form.username.trim()
  const changeName = username !== session.username
  if (!changeName && !form.next) {
    form.error = 'Modifiez votre identifiant ou saisissez un nouveau mot de passe.'
    return
  }
  if (form.next && form.next.length < 10) {
    form.error = 'Le nouveau mot de passe doit contenir au moins 10 caractères.'
    return
  }
  if (form.next !== form.confirm) {
    form.error = 'Les deux saisies du nouveau mot de passe ne correspondent pas.'
    return
  }
  if (!form.current) {
    form.error = 'Saisissez votre mot de passe actuel pour confirmer.'
    return
  }
  form.busy = true
  try {
    applySession(await adminApi.account({ username, current: form.current, new: form.next }))
    Object.assign(form, { username: session.username, current: '', next: '', confirm: '' })
    notify('Identifiants mis à jour.')
  } catch (e) {
    if (e?.status === 401) handleError(e)
    else form.error = e.message
  } finally {
    form.busy = false
  }
}
</script>

<template>
  <div class="adm-editor">
    <header class="adm-editor__head">
      <div>
        <h1>Identifiants</h1>
        <p class="adm-muted">Identifiant et mot de passe de connexion à l'administration.</p>
      </div>
    </header>

    <form class="adm-panel adm-account" novalidate @submit.prevent="submit">
      <div class="adm-grid">
        <label class="adm-field">
          <span>Identifiant</span>
          <input v-model="form.username" type="text" autocomplete="username" autocapitalize="none" required />
        </label>
        <span class="adm-grid__spacer"></span>
        <label class="adm-field">
          <span>Nouveau mot de passe</span>
          <input v-model="form.next" type="password" autocomplete="new-password" minlength="10" placeholder="Laisser vide pour le garder" />
          <small class="adm-hint">10 caractères minimum.</small>
        </label>
        <label class="adm-field">
          <span>Confirmer le nouveau mot de passe</span>
          <input v-model="form.confirm" type="password" autocomplete="new-password" minlength="10" />
        </label>
        <label class="adm-field">
          <span>Mot de passe actuel (obligatoire)</span>
          <input v-model="form.current" type="password" autocomplete="current-password" required />
        </label>
      </div>
      <p v-if="form.error" class="adm-alert is-error" role="alert">{{ form.error }}</p>
      <div class="adm-actions">
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="form.busy">
          <i :class="form.busy ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>
