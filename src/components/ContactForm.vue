<script setup>
import { reactive, ref, computed } from 'vue'
import { profile, contactServices } from '@/data/portfolio'

defineProps({ variant: { type: String, default: '' } })

const form = reactive({ name: '', whatsapp: '', email: '', message: '', services: [] })
const status = ref('idle') // idle | sending | success | error
const feedback = ref('')

const toggleService = (s) => {
  const i = form.services.indexOf(s)
  if (i === -1) form.services.push(s)
  else form.services.splice(i, 1)
}

const subject = computed(() =>
  form.services.length ? `Projet : ${form.services.join(', ')}` : 'Nouveau message depuis le portfolio',
)

// Lien WhatsApp pré-rempli, proposé en secours si l'envoi échoue
const whatsappFallback = computed(() => {
  const text = `Bonjour Baudoin, je suis ${form.name || '…'}. ${subject.value}. ${form.message}`
  return `${profile.whatsapp}?text=${encodeURIComponent(text.trim())}`
})

function validate() {
  if (form.name.trim().length < 2) return 'Veuillez entrer votre nom complet.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Veuillez entrer une adresse email valide.'
  if (form.message.trim().length < 10) return 'Le message doit contenir au moins 10 caractères.'
  return ''
}

async function submit() {
  const error = validate()
  if (error) {
    status.value = 'error'
    feedback.value = error
    return
  }
  status.value = 'sending'
  feedback.value = 'Envoi en cours…'
  const data = new FormData()
  data.append('name', form.name.trim())
  data.append('whatsapp', form.whatsapp.trim())
  data.append('email', form.email.trim())
  data.append('subject', subject.value)
  data.append('services', form.services.join(', '))
  data.append('message', form.message.trim())
  data.append('_subject', subject.value)
  try {
    const res = await fetch(profile.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    status.value = 'success'
    feedback.value = 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
    Object.assign(form, { name: '', whatsapp: '', email: '', message: '', services: [] })
    window.gtag?.('event', 'contact_form_submit', { event_category: 'Contact' })
  } catch {
    status.value = 'error'
    feedback.value = "L'envoi a échoué. Vous pouvez m'écrire directement sur WhatsApp ou par email."
  }
}
</script>

<template>
  <div class="contact-content-3" :class="variant">
    <div v-anim="'.3s'" class="select-service-area">
      <span>Type de projet</span>
      <div class="select-service" role="group" aria-label="Type de projet">
        <button
          v-for="s in contactServices"
          :key="s"
          type="button"
          class="theme-btn"
          :class="{ 'is-selected': form.services.includes(s) }"
          :aria-pressed="form.services.includes(s)"
          @click="toggleService(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <form class="contact-form-box" novalidate @submit.prevent="submit">
      <div class="row g-4 align-items-center justify-content-center">
        <div v-anim="'.2s'" class="col-lg-6 col-md-6">
          <label class="form-clt">
            <span>Nom complet *</span>
            <input v-model="form.name" type="text" name="name" autocomplete="name" placeholder="Votre nom" required />
          </label>
        </div>
        <div v-anim="'.4s'" class="col-lg-6 col-md-6">
          <label class="form-clt">
            <span>Email *</span>
            <input v-model="form.email" type="email" name="email" autocomplete="email" placeholder="vous@exemple.com" required />
          </label>
        </div>
        <div v-anim="'.5s'" class="col-lg-12">
          <label class="form-clt">
            <span>Numéro WhatsApp</span>
            <input v-model="form.whatsapp" type="tel" name="whatsapp" autocomplete="tel" placeholder="+228 …" />
          </label>
        </div>
        <div v-anim="'.6s'" class="col-lg-12">
          <label class="form-clt">
            <span>Message *</span>
            <textarea v-model="form.message" name="message" placeholder="Décrivez votre projet…" required></textarea>
          </label>
        </div>
        <div class="col-lg-12">
          <p
            v-if="status !== 'idle'"
            class="form-feedback"
            :class="`is-${status}`"
            role="status"
            aria-live="polite"
          >
            {{ feedback }}
            <template v-if="status === 'error' && feedback.startsWith('L')">
              <br />
              <a :href="whatsappFallback" target="_blank" rel="noopener">WhatsApp</a> ·
              <a :href="`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`">{{ profile.email }}</a>
            </template>
          </p>
          <div class="contact-button">
            <button type="submit" class="theme-btn" :disabled="status === 'sending'">
              <template v-if="status === 'sending'"><i class="fa-solid fa-spinner fa-spin me-2"></i>Envoi…</template>
              <template v-else>Envoyer</template>
            </button>
            <p>
              <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
