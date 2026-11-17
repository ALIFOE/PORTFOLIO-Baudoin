<script setup>
import { computed } from 'vue'
import { content, media, findDomain, domainProjects } from '@/content'
import PageHeader from '@/components/PageHeader.vue'
import MediaGallery from '@/components/MediaGallery.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const props = defineProps({ slug: { type: String, required: true } })

const domain = computed(() => findDomain(props.slug))
const index = computed(() => content.domains.findIndex((d) => d.slug === props.slug))
const number = computed(() => String(index.value + 1).padStart(2, '0'))
const projects = computed(() => domainProjects(props.slug))
const others = computed(() => content.domains.filter((d) => d.slug !== props.slug))
</script>

<template>
  <template v-if="domain">
    <PageHeader
      :title="domain.title"
      :crumbs="[{ label: 'Réalisations', to: '/realisations' }, { label: domain.shortTitle || domain.title }]"
      :text="domain.tagline"
    />

    <!-- Présentation du domaine -->
    <section class="domain-intro section-padding pt-0 fix">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div v-anim="'.2s'" class="col-lg-6">
            <div class="domain-intro__thumb">
              <img v-if="media(domain.cover)" :src="media(domain.cover)" :alt="domain.title" />
              <span class="domain-intro__num">{{ number }}</span>
            </div>
          </div>
          <div class="col-lg-6">
            <span v-anim class="domain-intro__kicker">
              <i :class="domain.icon"></i> Domaine {{ number }}<template v-if="index === 0"> · Activité principale</template>
            </span>
            <h2 v-split class="domain-intro__title">{{ domain.shortTitle || domain.title }}</h2>
            <p v-anim="'.2s'" class="domain-intro__text">{{ domain.description }}</p>
            <ul v-if="domain.services.length" v-anim="'.3s'" class="domain-intro__services">
              <li v-for="s in domain.services" :key="s"><i class="fa-solid fa-check"></i>{{ s }}</li>
            </ul>
            <div v-if="domain.tools.length" v-anim="'.4s'" class="domain-intro__tools">
              <span v-for="t in domain.tools" :key="t">{{ t }}</span>
            </div>
            <router-link v-anim="'.5s'" to="/contact" class="theme-btn mt-4">Discuter de votre projet</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Galerie de réalisations -->
    <section v-if="domain.media.length" class="domain-gallery section-padding pt-0 fix">
      <div class="container">
        <div class="section-title">
          <span v-anim class="sub-title">{ Galerie }</span>
          <h2 v-split class="style-2"><span>Réalisations</span> en images</h2>
        </div>
        <MediaGallery :items="domain.media" />
      </div>
    </section>

    <!-- Projets rattachés à ce domaine -->
    <section v-if="projects.length" class="portfolio-inner-section-2 section-padding fix pt-0">
      <div class="container">
        <div class="section-title">
          <span v-anim class="sub-title">{ Projets }</span>
          <h2 v-split class="style-2"><span>{{ projects.length }} projet{{ projects.length > 1 ? 's' : '' }}</span> réalisé{{ projects.length > 1 ? 's' : '' }}</h2>
        </div>
        <div class="row g-4">
          <div v-for="(p, i) in projects" :key="p.slug" v-anim="`${0.2 + (i % 2) * 0.2}s`" class="col-lg-6 col-md-6">
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

    <section v-if="!domain.media.length && !projects.length" class="section-padding pt-0 fix">
      <div class="container">
        <div v-anim class="domain-empty">
          <i :class="domain.icon"></i>
          <p>La galerie de ce domaine est en cours de constitution. Contactez-moi pour voir des exemples de réalisations.</p>
          <router-link to="/contact" class="theme-btn">Me contacter</router-link>
        </div>
      </div>
    </section>

    <!-- Autres domaines -->
    <section v-if="others.length" class="section-padding pt-0 fix">
      <div class="container">
        <div class="domain-others">
          <span>Mes autres domaines</span>
          <router-link v-for="d in others" :key="d.slug" :to="`/realisations/${d.slug}`">
            <i :class="d.icon"></i>{{ d.title }} <i class="fa-regular fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <CtaSection :title="`Besoin d'un professionnel en ${(domain.shortTitle || domain.title).toLowerCase()} ?`" />
  </template>
  <NotFoundView v-else />
</template>
