<script setup>
import { computed } from 'vue'
import { projects, categoryLabel, domainOf } from '@/data/portfolio'
import PageHeader from '@/components/PageHeader.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const props = defineProps({ slug: { type: String, required: true } })

// La route vérifie que le projet existe à l'entrée (voir router/index.js) ;
// si l'adresse est modifiée à la main d'un projet à l'autre, on affiche la page 404.
const index = computed(() => projects.findIndex((p) => p.slug === props.slug))
const project = computed(() => projects[index.value])

// Fonctionnalités réparties sur deux colonnes, comme dans le template
const featureColumns = computed(() => {
  const list = project.value?.features ?? []
  const half = Math.ceil(list.length / 2)
  return [list.slice(0, half), list.slice(half)].filter((col) => col.length)
})

// Deux projets suivants (en boucle)
const others = computed(() =>
  [1, 2].map((step) => projects[(index.value + step) % projects.length]).filter((p) => p && p.slug !== props.slug),
)
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
              <div v-anim class="details-thumb details-thumb--hero">
                <img :src="project.image" :alt="project.title" />
              </div>

              <div class="details-box-item">
                <div v-anim="'.3s'" class="details-box">
                  <span>Type de projet</span>
                  <p>{{ categoryLabel(project.category) }}</p>
                </div>
                <div v-anim="'.5s'" class="details-box">
                  <span>Domaine</span>
                  <p>{{ project.subtitle }}</p>
                </div>
                <div v-anim="'.7s'" class="details-box">
                  <span>{{ project.demoUrl ? 'Site en ligne' : 'Diffusion' }}</span>
                  <p v-if="project.demoUrl">
                    <a :href="project.demoUrl" target="_blank" rel="noopener">{{ domainOf(project.demoUrl) }}</a>
                  </p>
                  <p v-else>Projet privé</p>
                </div>
              </div>

              <h2 v-split>{{ project.title }} — {{ project.subtitle }}</h2>

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
                    <span>Fonctionnalités clés</span>
                    <div class="list-item">
                      <ul v-for="(col, c) in featureColumns" :key="c" class="list">
                        <li v-for="feature in col" :key="feature">
                          <i class="fa-solid fa-arrow-up-right"></i>
                          {{ feature }}
                        </li>
                      </ul>
                    </div>

                    <span>Technologies</span>
                    <div class="tech-tags">
                      <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                    </div>

                    <span>Points forts</span>
                    <ul class="list-2 mb-0">
                      <li v-for="h in project.highlights" :key="h">{{ h }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div v-if="project.gallery.length" class="row g-4 project-gallery">
                <div
                  v-for="(img, g) in project.gallery"
                  :key="g"
                  v-anim="`${0.2 + g * 0.2}s`"
                  :class="project.gallery.length > 1 ? 'col-lg-6 col-md-6' : 'col-12'"
                >
                  <div class="details-thumb">
                    <img :src="img" :alt="`${project.title} — aperçu ${g + 2}`" loading="lazy" />
                  </div>
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
                <img :src="p.image" :alt="p.title" loading="lazy" />
              </router-link>
              <div class="portfolio-content">
                <h2 class="title">
                  <router-link :to="`/projets/${p.slug}`">{{ p.title }}</router-link>
                </h2>
                <span>{{ p.subtitle }}</span>
                <h3>
                  <span>Technologies :</span>
                  {{ p.technologies.join(', ') }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </template>
  <NotFoundView v-else />
</template>
