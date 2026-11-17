<script setup>
import { computed } from 'vue'
import { content, links, socials } from '@/content'
import PageHeader from '@/components/PageHeader.vue'
import ContactForm from '@/components/ContactForm.vue'
import iconMessage from '@/assets/img/template/contact-icon-01.png'
import iconChat from '@/assets/img/template/contact-icon-02.png'
import iconCall from '@/assets/img/template/contact-icon-03.png'

const channels = computed(() => [
  {
    icon: iconMessage,
    title: 'Écrivez-moi',
    text: 'Pour une demande détaillée, un devis ou une proposition de collaboration.',
    label: content.profile.email,
    href: links.value.email,
  },
  {
    icon: iconChat,
    title: 'Discutons',
    text: 'Le plus rapide : une réponse sur WhatsApp, généralement dans la journée.',
    label: 'Ouvrir WhatsApp',
    href: links.value.whatsapp,
    external: true,
  },
  {
    icon: iconCall,
    title: 'Appelez-moi',
    text: `Basé à ${content.profile.location}, disponible aux horaires indiqués ci-dessous.`,
    label: content.profile.phone,
    href: links.value.phone,
  },
].filter((c) => c.href))
</script>

<template>
  <PageHeader
    title="Contact"
    :crumbs="[{ label: 'Contact' }]"
    text="Une idée, un projet, une question ? Écrivez-moi : je réponds généralement sous 24 heures."
  />

  <!-- Moyens de contact -->
  <section class="contact-me-section section-padding fix pt-0">
    <div class="container">
      <div class="section-title text-center">
        <h2 v-split class="style-3">Restons en contact</h2>
      </div>
      <div class="row g-3">
        <div
          v-for="(c, i) in channels"
          :key="c.title"
          v-anim="`${0.3 + i * 0.2}s`"
          class="col-xl-4 col-lg-6 col-md-6"
        >
          <div class="contact-me-box-items">
            <div class="icon">
              <img :src="c.icon" alt="" />
            </div>
            <div class="content">
              <h3 class="title">{{ c.title }}</h3>
              <p>{{ c.text }}</p>
              <a
                :href="c.href"
                class="box-link"
                :target="c.external ? '_blank' : undefined"
                :rel="c.external ? 'noopener' : undefined"
              >
                {{ c.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Formulaire -->
  <section class="contact-section-4 section-padding pt-0 fix">
    <div class="container">
      <div class="row g-4">
        <div class="col-xl-6 col-lg-6">
          <div class="contact-left-items-3 style-3">
            <div class="section-title mb-0">
              <span>Disponible pour vos projets</span>
              <h2 v-split class="style-3">Travaillons ensemble sur votre prochain projet</h2>
            </div>
            <p v-anim="'.2s'" class="contact-text">
              Décrivez votre besoin dans le formulaire ou contactez-moi directement par l'un des moyens ci-dessus.
            </p>

            <h3 class="availability-title">Disponibilités</h3>
            <ul v-anim="'.3s'" class="availability">
              <li v-for="slot in content.profile.availability" :key="slot.day">
                <span>{{ slot.day }}</span>
                <span>{{ slot.hours }}</span>
              </li>
            </ul>

            <div class="social-list">
              <a
                v-for="(s, i) in socials"
                :key="s.label"
                :href="s.url"
                target="_blank"
                rel="noopener"
                :class="{ 'mb-0': i === socials.length - 1 }"
              >
                {{ s.label }} <i class="fa-sharp fa-solid fa-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-lg-6">
          <ContactForm variant="style-bg-2 mt-0" />
        </div>
      </div>
    </div>
  </section>
</template>
