<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/admin/session'
import SiteLogo from '@/components/layout/SiteLogo.vue'
import '@/assets/css/admin.css'

const router = useRouter()
const route = useRoute()
const form = reactive({ username: '', password: '' })
const error = ref('')
const busy = ref(false)

async function submit() {
  if (busy.value) return
  error.value = ''
  if (!form.username.trim() || !form.password) {
    error.value = 'Saisissez votre identifiant et votre mot de passe.'
    return
  }
  busy.value = true
  try {
    await login(form.username.trim(), form.password)
    // Retour à la page demandée avant la connexion (uniquement dans l'admin)
    const next = typeof route.query.next === 'string' && route.query.next.startsWith('/admin') ? route.query.next : null
    router.replace(next ?? { name: 'admin' })
  } catch (e) {
    error.value = e.message
    form.password = ''
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="adm adm-login">
    <form class="adm-login__card" novalidate @submit.prevent="submit">
      <router-link to="/" class="adm-login__logo" aria-label="Retour au site"><SiteLogo /></router-link>
      <h1>Administration</h1>
      <p class="adm-muted">Connectez-vous pour gérer le contenu du site et consulter les messages reçus.</p>

      <label class="adm-field">
        <span>Identifiant</span>
        <input v-model="form.username" type="text" name="username" autocomplete="username" autocapitalize="none" required />
      </label>
      <label class="adm-field">
        <span>Mot de passe</span>
        <input v-model="form.password" type="password" name="password" autocomplete="current-password" required />
      </label>

      <p v-if="error" class="adm-alert is-error" role="alert">{{ error }}</p>

      <button type="submit" class="adm-btn adm-btn--primary adm-btn--block" :disabled="busy">
        <i v-if="busy" class="fa-solid fa-spinner fa-spin"></i>
        {{ busy ? 'Connexion…' : 'Se connecter' }}
      </button>
      <router-link to="/" class="adm-login__back"><i class="fa-regular fa-arrow-left"></i> Retour au site</router-link>
    </form>
  </section>
</template>
