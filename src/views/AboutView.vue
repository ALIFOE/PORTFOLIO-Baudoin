<script setup>
import { content, links, media } from '@/content'
import PageHeader from '@/components/PageHeader.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import ExpertiseSection from '@/components/sections/ExpertiseSection.vue'
import BrandSection from '@/components/sections/BrandSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'

const firstName = () => content.profile.shortName.split(' ').pop() || content.profile.fullName
</script>

<template>
  <PageHeader
    title="À propos"
    :crumbs="[{ label: 'À propos' }]"
    text="Découvrez mon parcours, mes métiers et ma passion pour la technologie et la création."
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
                <h2 v-split class="style-3 text-white">Bonjour, je suis {{ firstName() }}</h2>
              </div>
              <ul v-anim="'.1s'" class="about-domains">
                <li v-for="(d, i) in content.domains" :key="d.slug">
                  <em>{{ String(i + 1).padStart(2, '0') }}</em>{{ d.title }}
                </li>
              </ul>
              <p v-anim="'.2s'" class="about-text">{{ content.profile.intro }}</p>
              <div v-anim="'.4s'" class="about-btn-area">
                <router-link to="/contact" class="theme-btn">Me contacter</router-link>
                <a v-if="links.cv" :href="links.cv" target="_blank" rel="noopener" class="social-icon">Télécharger mon CV (PDF)</a>
              </div>
            </div>
          </div>
          <div v-anim="'.3s'" class="col-xl-5 col-lg-5 mt-4 mt-xl-0">
            <div class="about-img">
              <img :src="media(content.profile.photos.about)" :alt="content.profile.fullName" width="520" height="520" />
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
            <p v-for="(para, i) in content.profile.about.profile" :key="i" class="profile-text">{{ para }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="section-title">
            <h2 v-split class="style-3">Vision <br />& approche</h2>
          </div>
          <div v-anim="'.3s'" class="about-content-2 mt-0">
            <p v-for="(para, i) in content.profile.about.vision" :key="i" class="profile-text">{{ para }}</p>
            <div v-if="content.profile.interests.length" class="interests">
              <span class="interests-title">Centres d'intérêt</span>
              <ul>
                <li v-for="it in content.profile.interests" :key="it.label">
                  <i v-if="it.icon" :class="it.icon"></i>{{ it.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ExpertiseSection title="Mes domaines <br> d'activité" />
  <BrandSection />
  <CtaSection />
</template>
