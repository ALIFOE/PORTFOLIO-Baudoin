<script setup>
import { profile, about } from '@/data/portfolio'
import PageHeader from '@/components/PageHeader.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import ExpertiseSection from '@/components/sections/ExpertiseSection.vue'
import BrandSection from '@/components/sections/BrandSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
</script>

<template>
  <PageHeader
    title="À propos"
    :crumbs="[{ label: 'À propos' }]"
    text="Découvrez mon parcours, mes valeurs et ma passion pour la technologie et l'innovation."
  />

  <!-- Présentation -->
  <section class="about-section fix">
    <div class="container">
      <div class="about-wrapper-inner section-bg">
        <div class="row align-items-center">
          <div class="col-xl-7">
            <div class="about-content">
              <span v-anim class="work-text">Disponible pour vos projets</span>
              <div class="section-title mb-0">
                <h2 v-split class="style-3 text-white">
                  Bonjour, je suis Baudoin <br />
                  Développeur & Technicien Réseau
                </h2>
              </div>
              <p v-anim="'.2s'" class="about-text">{{ profile.intro }}</p>
              <div v-anim="'.4s'" class="about-btn-area">
                <router-link to="/contact" class="theme-btn">Me contacter</router-link>
                <a :href="profile.cv" target="_blank" rel="noopener" class="social-icon">Télécharger mon CV (PDF)</a>
              </div>
            </div>
          </div>
          <div v-anim="'.3s'" class="col-xl-5 col-lg-5 mt-4 mt-xl-0">
            <div class="about-img">
              <img :src="profile.photos.about" :alt="profile.fullName" width="520" height="520" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <StatsSection />

  <!-- Profil & vision -->
  <section class="about-profile-section section-padding pt-0 fix">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-6">
          <div class="section-title">
            <h2 v-split class="style-3">Mon profil <br />professionnel</h2>
          </div>
          <div v-anim="'.2s'" class="about-content-2 mt-0">
            <p v-for="(para, i) in about.profile" :key="i" class="profile-text">{{ para }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="section-title">
            <h2 v-split class="style-3">Vision <br />& approche</h2>
          </div>
          <div v-anim="'.3s'" class="about-content-2 mt-0">
            <p v-for="(para, i) in about.vision" :key="i" class="profile-text">{{ para }}</p>
            <div class="interests">
              <span class="interests-title">Centres d'intérêt</span>
              <ul>
                <li v-for="it in profile.interests" :key="it.label">
                  <i :class="it.icon"></i>{{ it.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ExpertiseSection title="Domaines <br> d'expertise" />
  <BrandSection />
  <CtaSection />
</template>
