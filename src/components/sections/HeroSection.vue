<script setup>
import shape1 from '@/assets/img/template/hero-shape-1.png'
import shape2 from '@/assets/img/template/hero-shape-2.png'
import { content, links, socials, media } from '@/content'
</script>

<template>
  <section class="hero-section-3 hero-3 fix">
    <div class="hero-shape-1">
      <img :src="shape1" alt="" />
    </div>
    <div class="hero-shape-2">
      <img :src="shape2" alt="" />
    </div>
    <div class="container">
      <div class="hero-content">
        <div v-anim="'.3s'" class="hero-circle-img">
          <img :src="media(content.profile.photos.portrait)" :alt="content.profile.fullName" width="340" height="340" />
        </div>
        <p v-anim class="hero-hello">
          Bonjour, je suis <strong>{{ content.profile.fullName }}</strong>
          <span class="hero-role">{{ content.profile.role }}</span>
        </p>
        <h1 v-split class="title">{{ content.profile.headline }}</h1>
        <!-- Les domaines d'activité, dans l'ordre d'importance -->
        <ul v-anim="'.4s'" class="hero-domains" aria-label="Domaines d'activité">
          <li v-for="(d, i) in content.domains" :key="d.slug" :class="{ 'is-main': i === 0 }">
            <router-link :to="`/realisations/${d.slug}`">
              <em>{{ String(i + 1).padStart(2, '0') }}</em>
              <i :class="d.icon"></i>
              {{ d.shortTitle || d.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="hero-thumb-area">
      <div class="hero-thumb fix">
        <img
          v-anim:img-custom-anim-left
          :src="media(content.profile.photos.hero)"
          :alt="`${content.profile.fullName} à son poste de travail`"
          width="890"
          height="520"
        />
      </div>
      <div v-anim="'.5s'" class="content">
        <span class="work-text">Disponible pour vos projets</span>
        <p>{{ content.profile.intro }}</p>
        <div class="hero-btn-area">
          <router-link to="/realisations" class="theme-btn">Voir mes réalisations</router-link>
          <router-link to="/contact" class="theme-btn style-2">Me contacter</router-link>
        </div>
        <div class="link-icon-area">
          <div class="left-link-items">
            <a v-for="s in socials.slice(0, 3)" :key="s.label" :href="s.url" target="_blank" rel="noopener" class="social-icon">
              {{ s.label }}
              <i class="fa-regular fa-arrow-up-right"></i>
            </a>
          </div>
          <a v-if="links.cv" :href="links.cv" target="_blank" rel="noopener" class="social-icon">Télécharger mon CV</a>
        </div>
        <ul class="hero-facts">
          <li v-for="s in content.profile.stats.slice(0, 2)" :key="s.label">
            <strong>{{ s.value }}{{ s.suffix }}</strong> {{ s.label }}
          </li>
          <li><i class="fa-solid fa-location-dot"></i> {{ content.profile.location }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
