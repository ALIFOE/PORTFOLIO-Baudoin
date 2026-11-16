<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, appReady } from '@/motion'
import { process } from '@/data/portfolio'
import p1 from '@/assets/img/template/process-01.png'
import p2 from '@/assets/img/template/process-02.png'
import p3 from '@/assets/img/template/process-03.png'
import p4 from '@/assets/img/template/process-04.png'

const images = [p1, p2, p3, p4]
const styles = ['', 'style-2', 'style-3', 'style-4']
const root = ref(null)
let mm

// Les cartes se "déploient" en éventail au scroll (desktop)
onMounted(async () => {
  await appReady
  if (!root.value) return
  mm = gsap.matchMedia(root.value)
  mm.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
    const items = root.value.querySelectorAll('.advance-item')
    gsap
      .timeline({
        scrollTrigger: { trigger: root.value.querySelector('.advance-wrap'), start: 'top 60%', toggleActions: 'play none none reverse' },
        defaults: { ease: 'power1.out', duration: 1 },
      })
      .from(items[0], { xPercent: 100, rotate: -8 })
      .from(items[1], { xPercent: 30, rotate: 4.13 }, '<')
      .from(items[2], { xPercent: -30, rotate: -6.42 }, '<')
      .from(items[3], { xPercent: -60, rotate: -12.15 }, '<')
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section ref="root" class="process-section-3 section-padding fix">
    <div class="container">
      <div class="section-title">
        <h2 v-split class="style-3">De l'idée au déploiement : <br />ma méthode</h2>
      </div>
      <div class="row g-4 g-xl-0 advance-wrap">
        <div v-for="(step, i) in process" :key="step.number" class="col-xl-3 col-lg-4 col-md-6">
          <div class="process-box-items-3 advance-item" :class="styles[i]">
            <div class="content">
              <span class="number">{{ step.number }}</span>
              <h3 class="title">{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
            <div class="thumb">
              <img :src="images[i]" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
