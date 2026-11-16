<script setup>
import { profile } from '@/data/portfolio'
import ContactForm from '@/components/ContactForm.vue'
</script>

<template>
  <section class="contact-section-3 section-padding fix">
    <div class="container">
      <div class="section-title">
        <h2 v-split class="style-3">Transformons vos idées en réalité. <br />Contactez-moi !</h2>
      </div>
      <div class="row">
        <div v-anim="'.3s'" class="col-xl-5 col-lg-6">
          <div class="contact-thumb-3">
            <img :src="profile.photos.contact" :alt="profile.fullName" loading="lazy" />
            <img :src="profile.photos.contact" alt="" loading="lazy" />
          </div>
        </div>
        <div class="col-xl-7 col-lg-6">
          <ContactForm />
        </div>
      </div>
    </div>
  </section>
</template>
