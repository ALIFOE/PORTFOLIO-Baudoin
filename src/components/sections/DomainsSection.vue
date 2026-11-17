<script setup>
import { content, media, galleryItem, domainProjects } from '@/content'

/** Les domaines d'activité, dans l'ordre d'importance : le premier est mis en avant. */
defineProps({
  title: { type: String, default: 'Trois métiers, <br>une même exigence' },
  kicker: { type: String, default: "{ Domaines d'activité }" },
  allLink: { type: Boolean, default: true },
  preview: { type: Boolean, default: false }, // aperçu des dernières réalisations
})

const number = (i) => String(i + 1).padStart(2, '0')

function stats(d) {
  const projects = domainProjects(d.slug).length
  const media = d.media.length
  return [projects && `${projects} projet${projects > 1 ? 's' : ''}`, media && `${media} média${media > 1 ? 's' : ''}`]
    .filter(Boolean)
    .join(' · ')
}

/** Quatre vignettes : médias de la galerie, à défaut images des projets du domaine */
function thumbs(d) {
  const fromMedia = d.media.map(galleryItem).map((m) => m.preview).filter(Boolean)
  const fromProjects = domainProjects(d.slug).map((p) => media(p.image)).filter(Boolean)
  return [...fromMedia, ...fromProjects].slice(0, 4)
}
</script>

<template>
  <section class="domains-section section-padding fix">
    <div class="container">
      <div class="section-title-area">
        <div class="section-title">
          <span v-if="kicker" v-anim class="sub-title">{{ kicker }}</span>
          <h2 v-split class="style-3" v-html="title"></h2>
        </div>
        <router-link v-if="allLink" v-anim to="/realisations" class="theme-btn">Toutes mes réalisations</router-link>
      </div>

      <div class="domains-grid">
        <article
          v-for="(d, i) in content.domains"
          :key="d.slug"
          v-anim="`${0.2 + i * 0.15}s`"
          class="domain-card"
          :class="{ 'is-main': i === 0 }"
        >
          <router-link :to="`/realisations/${d.slug}`" class="domain-card__thumb" tabindex="-1" aria-hidden="true">
            <img v-if="media(d.cover)" :src="media(d.cover)" alt="" loading="lazy" />
            <span class="domain-card__icon"><i :class="d.icon"></i></span>
          </router-link>
          <div class="domain-card__body">
            <div class="domain-card__top">
              <span class="domain-card__num">{{ number(i) }}</span>
              <span v-if="i === 0" class="domain-card__badge">Activité principale</span>
            </div>
            <h3 class="domain-card__title">
              <router-link :to="`/realisations/${d.slug}`">{{ d.title }}</router-link>
            </h3>
            <p class="domain-card__text">{{ d.tagline }}</p>
            <ul class="domain-card__services">
              <li v-for="s in d.services.slice(0, i === 0 ? 6 : 4)" :key="s">{{ s }}</li>
            </ul>
            <div v-if="preview && thumbs(d).length" class="domain-card__preview">
              <img v-for="(src, k) in thumbs(d)" :key="k" :src="src" alt="" loading="lazy" />
            </div>
            <div class="domain-card__foot">
              <router-link :to="`/realisations/${d.slug}`" class="theme-btn">Voir les réalisations</router-link>
              <span v-if="stats(d)" class="domain-card__stats">{{ stats(d) }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
