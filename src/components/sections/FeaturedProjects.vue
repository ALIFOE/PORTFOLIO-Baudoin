<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, appReady } from '@/motion'
import { projects, categoryLabel } from '@/data/portfolio'

const featured = projects.filter((p) => p.featured)
const root = ref(null)
let mm

// Panneaux empilés au scroll (effet "pin" du template, desktop uniquement)
onMounted(async () => {
  await appReady
  if (!root.value) return
  mm = gsap.matchMedia(root.value)
  mm.add('(min-width: 1200px)', () => {
    const panels = root.value.querySelectorAll('.tp-service-panel')
    panels.forEach((section, index) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          pin: section,
          scrub: 1,
          start: `top ${120 + index * 120}px`,
          end: 'bottom 80%',
          endTrigger: root.value.querySelector('.tp-service-pin'),
          pinSpacing: false,
        },
      })
    })
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section ref="root" class="website-section-3 section-padding fix">
    <div class="container">
      <div class="section-title-area">
        <div class="section-title">
          <h2 v-split class="style-3">Projets <br />à la une</h2>
        </div>
        <router-link v-anim to="/projets" class="theme-btn">Voir tous les projets</router-link>
      </div>
      <div class="tp-service-pin">
        <div
          v-for="(p, i) in featured"
          :key="p.slug"
          class="website-box-area-3 tp-service-panel"
          :class="{ 'style-2': i > 0 }"
        >
          <div class="row g-4 align-items-center">
            <div class="col-xl-4">
              <div class="website-content">
                <h3 class="title">
                  <router-link :to="`/projets/${p.slug}`">{{ p.title }}</router-link>
                </h3>
                <ul>
                  <li>
                    <p>Type</p>
                    <h4>{{ categoryLabel(p.category) }}</h4>
                  </li>
                  <li>
                    <p>Stack</p>
                    <h4>{{ p.technologies.slice(0, 3).join(', ') }}</h4>
                  </li>
                  <li>
                    <p>Atout</p>
                    <h4>{{ p.highlights[0] }}</h4>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-xl-8">
              <router-link :to="`/projets/${p.slug}`" class="website-thumb d-block" :aria-label="p.title">
                <img :src="p.image" :alt="p.title" loading="lazy" />
                <img :src="p.image" alt="" loading="lazy" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
