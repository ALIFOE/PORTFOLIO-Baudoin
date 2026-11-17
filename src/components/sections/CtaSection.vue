<script setup>
import { links, socials } from '@/content'

defineProps({
  title: { type: String, default: 'Travaillons ensemble sur votre prochain projet' },
  text: { type: String, default: 'Je suis toujours ouvert aux nouvelles opportunités et collaborations. Je réponds généralement sous 24 heures.' },
})
</script>

<template>
  <section class="contact-section-4 section-padding fix">
    <div class="container">
      <div class="cta-box section-bg">
        <div class="row g-4 align-items-center">
          <div class="col-xl-7 col-lg-7">
            <div class="contact-left-items-3 style-3">
              <div class="section-title mb-0">
                <span class="cta-kicker">Disponible pour vos projets</span>
                <h2 v-split class="style-3 text-white">{{ title }}</h2>
              </div>
              <p v-anim="'.2s'" class="contact-text text-white-50">{{ text }}</p>
            </div>
          </div>
          <div class="col-xl-5 col-lg-5">
            <div v-anim="'.3s'" class="cta-actions">
              <router-link to="/contact" class="theme-btn">Me contacter</router-link>
              <div class="social-list">
                <a v-for="s in socials.slice(0, 3)" :key="s.label" :href="s.url" target="_blank" rel="noopener">
                  {{ s.label }} <i class="fa-sharp fa-solid fa-arrow-up-right"></i>
                </a>
                <a v-if="links.cv" :href="links.cv" target="_blank" rel="noopener" class="mb-0">
                  Mon CV (PDF) <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
