<script setup>
import { reactive, ref, computed } from 'vue'
import { contactServices } from '@/data/portfolio'
import { content, links } from '@/content'
import { sendContact } from '@/api'

defineProps({ variant: { type: String, default: '' } })

// « website » est un champ piège invisible : seuls les robots le remplissent
const form = reactive({ name: '', whatsapp: '', email: '', message: '', services: [], website: '' })
const status = ref('idle') // idle | sending | success | error
const feedback = ref('')
const showFallback = ref(false) // propose WhatsApp / email quand l'envoi n'a pas abouti

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
  return links.value.whatsapp ? `${links.value.whatsapp}?text=${encodeURIComponent(text.trim())}` : ''
})

function validate() {
  if (form.name.trim().length < 2) return 'Veuillez entrer votre nom complet.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Veuillez entrer une adresse email valide.'
  if (form.message.trim().length < 10) return 'Le message doit contenir au moins 10 caractères.'
  return ''
}

async function submit() {
  if (status.value === 'sending') return
  showFallback.value = false
  const error = validate()
  if (error) {
    status.value = 'error'
    feedback.value = error
    return
  }
  status.value = 'sending'
  feedback.value = 'Envoi en cours…'
  try {
    // Enregistré par l'API interne, puis consultable dans l'espace d'administration
    await sendContact({
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      services: [...form.services],
      message: form.message.trim(),
      website: form.website,
    })
    status.value = 'success'
    feedback.value = 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
    Object.assign(form, { name: '', whatsapp: '', email: '', message: '', services: [], website: '' })
    window.gtag?.('event', 'contact_form_submit', { event_category: 'Contact' })
  } catch (e) {
    status.value = 'error'
    if (e?.status === 422) {
      // Saisie refusée par le serveur : son message dit quoi corriger
      feedback.value = e.message
    } else {
      feedback.value =
        e?.status === 429 ? e.message : "L'envoi a échoué. Vous pouvez m'écrire directement sur WhatsApp ou par email."
      showFallback.value = true
    }
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
      <div class="form-trap" aria-hidden="true">
        <label>
          Ne pas remplir ce champ
          <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
        </label>
      </div>
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
            <template v-if="status === 'error' && showFallback">
              <br />
              <template v-if="whatsappFallback"><a :href="whatsappFallback" target="_blank" rel="noopener">WhatsApp</a> · </template>
              <a :href="`mailto:${content.profile.email}?subject=${encodeURIComponent(subject)}`">{{ content.profile.email }}</a>
            </template>
          </p>
          <div class="contact-button">
            <button type="submit" class="theme-btn" :disabled="status === 'sending'">
              <template v-if="status === 'sending'"><i class="fa-solid fa-spinner fa-spin me-2"></i>Envoi…</template>
              <template v-else>Envoyer</template>
            </button>
            <p>
              <a :href="links.email">{{ content.profile.email }}</a>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
