<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { projectCategories, categoryLabel } from '@/data/portfolio'
import { content, media } from '@/content'
import { refreshScroll } from '@/motion'
import PageHeader from '@/components/PageHeader.vue'
import CtaSection from '@/components/sections/CtaSection.vue'

const filter = ref('all')
const count = (key) => (key === 'all' ? content.projects.length : content.projects.filter((p) => p.category === key).length)
// Seules les catégories qui contiennent au moins un projet sont proposées
const categories = computed(() => projectCategories.filter((c) => count(c.key) > 0))
const visible = computed(() =>
  filter.value === 'all' ? content.projects : content.projects.filter((p) => p.category === filter.value),
)

// La hauteur de la page change avec le filtre : on recalcule le défilement
watch(filter, () => nextTick(refreshScroll))
</script>

<template>
  <PageHeader
    title="Projets"
    :crumbs="[{ label: 'Réalisations', to: '/realisations' }, { label: 'Projets' }]"
    text="Une sélection de sites web, d'applications et de créations graphiques réalisés pour des organisations et des entreprises."
  />

  <section class="portfolio-inner-section section-padding fix pt-0">
    <div class="container">
      <div v-if="categories.length > 2" v-anim class="project-filters" role="group" aria-label="Filtrer les projets">
        <button
          v-for="cat in categories"
          :key="cat.key"
          type="button"
          class="filter-btn"
          :class="{ 'is-active': filter === cat.key }"
          :aria-pressed="filter === cat.key"
          @click="filter = cat.key"
        >
          <i :class="cat.icon"></i>
          {{ cat.label }}
          <small>{{ count(cat.key) }}</small>
        </button>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <article
            v-for="(p, i) in visible"
            :key="p.slug"
            v-anim="'.2s'"
            class="portfolio-card-items-new"
            :class="{ 'mb-0': i === visible.length - 1 }"
          >
            <div class="portfolio-thumb">
              <img :src="media(p.image)" :alt="p.title" :loading="i === 0 ? 'eager' : 'lazy'" />
              <span class="project-badge">{{ categoryLabel(p.category) }}</span>
              <router-link :to="`/projets/${p.slug}`" class="project-open" :aria-label="`Voir le projet ${p.title}`">
                <i class="fa-regular fa-arrow-up-right"></i>
              </router-link>
              <div class="portfolio-content style-2">
                <div class="left-content">
                  <h2 class="title">
                    <router-link :to="`/projets/${p.slug}`">{{ p.title }}</router-link>
                  </h2>
                  <span>{{ p.subtitle }}</span>
                  <h3 v-if="p.technologies.length">
                    <span>Technologies :</span>
                    {{ p.technologies.join(', ') }}
                  </h3>
                </div>
                <p>{{ p.excerpt }}</p>
              </div>
            </div>
          </article>

          <p v-if="!visible.length" class="projects-empty">Aucun projet dans cette catégorie pour le moment.</p>
        </div>
      </div>
    </div>
  </section>

  <CtaSection title="Vous avez un projet en tête ?" />
</template>
