<script setup>
import shape1 from '@/assets/img/template/hero-shape-1.png'
import shape2 from '@/assets/img/template/hero-shape-2.png'
import { profile, socials } from '@/data/portfolio'
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
          <img :src="profile.photos.portrait" :alt="profile.fullName" width="340" height="340" />
        </div>
        <p v-anim class="hero-hello">
          Bonjour, je suis <strong>{{ profile.fullName }}</strong>
          <span class="hero-role">{{ profile.role }}</span>
        </p>
        <h1 v-split class="title">
          Je transforme les idées en <br class="d-none d-xl-block" />
          applications innovantes
        </h1>
      </div>
    </div>
    <div class="hero-thumb-area">
      <div class="hero-thumb fix">
        <img
          v-anim:img-custom-anim-left
          :src="profile.photos.hero"
          :alt="`${profile.fullName} à son poste de travail`"
          width="890"
          height="520"
        />
      </div>
      <div v-anim="'.5s'" class="content">
        <span class="work-text">Disponible pour vos projets</span>
        <p>{{ profile.intro }}</p>
        <div class="hero-btn-area">
          <router-link to="/projets" class="theme-btn">Voir mes projets</router-link>
          <router-link to="/contact" class="theme-btn style-2">Me contacter</router-link>
        </div>
        <div class="link-icon-area">
          <div class="left-link-items">
            <a v-for="s in socials" :key="s.label" :href="s.url" target="_blank" rel="noopener" class="social-icon">
              {{ s.label }}
              <i class="fa-regular fa-arrow-up-right"></i>
            </a>
          </div>
          <a :href="profile.cv" target="_blank" rel="noopener" class="social-icon">Télécharger mon CV</a>
        </div>
        <ul class="hero-facts">
          <li v-for="s in profile.stats.slice(0, 2)" :key="s.label">
            <strong>{{ s.value }}{{ s.suffix }}</strong> {{ s.label }}
          </li>
          <li><i class="fa-solid fa-location-dot"></i> {{ profile.location }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
