<script setup>
import { computed, ref } from 'vue'
import { categoryLabel, domainOf } from '@/data/portfolio'
import { content, media, findDomain } from '@/content'
import PageHeader from '@/components/PageHeader.vue'
import MediaLightbox from '@/components/MediaLightbox.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const props = defineProps({ slug: { type: String, required: true } })

// La route vérifie que le projet existe à l'entrée (voir router/index.js) ;
// si l'adresse est modifiée à la main d'un projet à l'autre, on affiche la page 404.
const index = computed(() => content.projects.findIndex((p) => p.slug === props.slug))
const project = computed(() => content.projects[index.value])
const domain = computed(() => (project.value ? findDomain(project.value.domain) : null))

// Fonctionnalités réparties sur deux colonnes, comme dans le template
const featureColumns = computed(() => {
  const list = project.value?.features ?? []
  const half = Math.ceil(list.length / 2)
  return [list.slice(0, half), list.slice(half)].filter((col) => col.length)
})

// Image principale + galerie, consultables en grand
const images = computed(() =>
  [project.value?.image, ...(project.value?.gallery ?? [])]
    .map(media)
    .filter(Boolean)
    .map((src, i) => ({ kind: 'image', full: src, title: i ? `${project.value.title} — aperçu ${i + 1}` : project.value.title })),
)
const gallery = computed(() => images.value.slice(1))
const openIndex = ref(null)

// Deux projets suivants (en boucle)
const others = computed(() => {
  const list = content.projects
  return [1, 2].map((step) => list[(index.value + step) % list.length]).filter((p, i, arr) => p && p.slug !== props.slug && arr.indexOf(p) === i)
})
</script>

<template>
  <template v-if="project">
    <PageHeader
      :title="project.title"
      :crumbs="[{ label: 'Projets', to: '/projets' }, { label: project.title }]"
      :text="project.excerpt"
    />

    <section class="portfolio-details-section-1 section-padding fix pt-0">
      <div class="container">
        <div class="portfolio-details-wrapper-1">
          <div class="row">
            <div class="col-xl-12">
              <button
                v-if="images.length"
                v-anim
                type="button"
                class="details-thumb details-thumb--hero"
                aria-label="Agrandir l'image"
                @click="openIndex = 0"
              >
                <img :src="images[0].full" :alt="project.title" />
              </button>

              <div class="details-box-item">
                <div v-anim="'.3s'" class="details-box">
                  <span>Type de projet</span>
                  <p>{{ categoryLabel(project.category) }}</p>
                </div>
                <div v-anim="'.5s'" class="details-box">
                  <span>{{ domain ? 'Domaine' : 'Secteur' }}</span>
                  <p v-if="domain">
                    <router-link :to="`/realisations/${domain.slug}`">{{ domain.shortTitle || domain.title }}</router-link>
                  </p>
                  <p v-else>{{ project.subtitle }}</p>
                </div>
                <div v-anim="'.7s'" class="details-box">
                  <span>{{ project.demoUrl ? 'Site en ligne' : 'Diffusion' }}</span>
                  <p v-if="project.demoUrl">
                    <a :href="project.demoUrl" target="_blank" rel="noopener">{{ domainOf(project.demoUrl) }}</a>
                  </p>
                  <p v-else>Projet privé</p>
                </div>
              </div>

              <h2 v-split>{{ project.title }}<template v-if="project.subtitle"> — {{ project.subtitle }}</template></h2>

              <div class="row g-4">
                <div v-anim="'.2s'" class="col-lg-6">
                  <div class="left-content">
                    <p>{{ project.description }}</p>
                    <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener" class="visit-btn">
                      Visiter le site <i class="fa-regular fa-arrow-up-right"></i>
                    </a>
                    <router-link v-else to="/contact" class="visit-btn">
                      Demander une démonstration <i class="fa-regular fa-arrow-up-right"></i>
                    </router-link>
                  </div>
                </div>
                <div v-anim="'.3s'" class="col-lg-6">
                  <div class="right-content">
                    <template v-if="featureColumns.length">
                      <span>Fonctionnalités clés</span>
                      <div class="list-item">
                        <ul v-for="(col, c) in featureColumns" :key="c" class="list">
                          <li v-for="(feature, k) in col" :key="k">
                            <i class="fa-solid fa-arrow-up-right"></i>
                            {{ feature }}
                          </li>
                        </ul>
                      </div>
                    </template>

                    <template v-if="project.technologies.length">
                      <span>Technologies</span>
                      <div class="tech-tags">
                        <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                      </div>
                    </template>

                    <template v-if="project.highlights.length">
                      <span>Points forts</span>
                      <ul class="list-2 mb-0">
                        <li v-for="(h, k) in project.highlights" :key="k">{{ h }}</li>
                      </ul>
                    </template>
                  </div>
                </div>
              </div>

              <div v-if="gallery.length" class="row g-4 project-gallery">
                <div
                  v-for="(img, g) in gallery"
                  :key="g"
                  v-anim="`${0.2 + g * 0.2}s`"
                  :class="gallery.length > 1 ? 'col-lg-6 col-md-6' : 'col-12'"
                >
                  <button type="button" class="details-thumb" aria-label="Agrandir l'image" @click="openIndex = g + 1">
                    <img :src="img.full" :alt="img.title" loading="lazy" />
                  </button>
                </div>
              </div>

              <div class="project-nav">
                <router-link to="/projets"><i class="fa-regular fa-arrow-left me-2"></i>Tous les projets</router-link>
                <router-link to="/contact">Discuter d'un projet similaire<i class="fa-regular fa-arrow-right ms-2"></i></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="others.length" class="portfolio-inner-section-2 section-padding fix pt-0">
      <div class="container">
        <h2 v-split class="mb-4">Autres projets</h2>
        <div class="row g-4">
          <div v-for="(p, i) in others" :key="p.slug" v-anim="`${0.2 + i * 0.2}s`" class="col-lg-6 col-md-6">
            <div class="portfolio-card-items-new-2">
              <router-link :to="`/projets/${p.slug}`" class="portfolio-thumb" :aria-label="p.title">
                <img :src="media(p.image)" :alt="p.title" loading="lazy" />
              </router-link>
              <div class="portfolio-content">
                <h2 class="title">
                  <router-link :to="`/projets/${p.slug}`">{{ p.title }}</router-link>
                </h2>
                <span>{{ p.subtitle }}</span>
                <h3 v-if="p.technologies.length">
                  <span>Technologies :</span>
                  {{ p.technologies.join(', ') }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <MediaLightbox v-model="openIndex" :items="images" />
    <CtaSection />
  </template>
  <NotFoundView v-else />
</template>
