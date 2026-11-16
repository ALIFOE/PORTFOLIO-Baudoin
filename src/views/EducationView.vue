<script setup>
import { ref } from 'vue'
import { education, certifications, continuousLearning } from '@/data/portfolio'
import PageHeader from '@/components/PageHeader.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import shape1 from '@/assets/img/template/stack-shape-1.png'
import shape2 from '@/assets/img/template/stack-shape-2.png'
import shape3 from '@/assets/img/template/stack-shape-3.png'

// La ligne survolée devient "active" (fond violet), comme dans le template
const active = ref(0)
const tilt = ['', 'style-2', 'style-4', 'style-3']
</script>

<template>
  <PageHeader
    title="Formation"
    :crumbs="[{ label: 'Formation' }]"
    text="Mon parcours académique et mes certifications professionnelles, complétés par une veille technologique permanente."
  />

  <!-- Parcours académique -->
  <section class="career-waypoints-section section-padding pt-0 fix">
    <div class="container">
      <div class="section-title text-center text-xl-start">
        <h2 v-split class="style-3">Parcours académique</h2>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <ul class="career-waypoints-list">
            <li
              v-for="(item, i) in education"
              :key="item.title"
              v-anim="`${0.2 + i * 0.2}s`"
              :class="{ active: active === i }"
              @mouseenter="active = i"
            >
              <div class="first-items">
                <span>{{ item.school }}</span>
                <h3 class="title">{{ item.title }}</h3>
              </div>
              <div class="text">
                {{ item.summary }}
                <div class="edu-topics">
                  <span v-for="topic in item.topics" :key="topic">{{ topic }}</span>
                </div>
              </div>
              <h4 class="date">{{ item.period }}</h4>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Certifications -->
  <section class="career-waypoint-section section-padding pt-0 fix">
    <div class="container">
      <div class="section-title">
        <span v-anim class="sub-title">{ Certifications }</span>
        <h2 v-split class="style-2"><span>{{ certifications.length }} certifications</span> professionnelles</h2>
      </div>
      <div class="row g-4">
        <div
          v-for="(cert, i) in certifications"
          :key="cert.title"
          v-anim="`${0.2 + (i % 2) * 0.2}s`"
          class="col-xl-6 col-lg-6"
        >
          <article class="waypoint-box-items experience-card cert-card" :class="tilt[i % tilt.length]">
            <div class="experience-card__head">
              <span>{{ cert.issuer }}</span>
              <img v-if="cert.logo" :src="cert.logo" :alt="cert.issuer" class="experience-card__logo" loading="lazy" />
            </div>
            <h3 class="title">{{ cert.title }}</h3>
            <p>{{ cert.text }}</p>
            <h4>{{ cert.year }}</h4>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- Formation continue -->
  <section class="tech-stack-section section-padding fix section-bg">
    <div class="stack-shape-1"><img :src="shape1" alt="" /></div>
    <div class="stack-shape-2"><img :src="shape2" alt="" /></div>
    <div class="stack-bg-shape"><img :src="shape3" alt="" /></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10">
          <div class="tech-stack-content">
            <div class="section-title text-center">
              <span v-anim class="sub-title">{ Formation continue }</span>
              <h2 v-split class="style-2 text-white"><span>Apprendre</span> en permanence pour rester à la pointe</h2>
            </div>
            <p v-anim="'.2s'" class="stack-lead">{{ continuousLearning.text }}</p>
            <div v-anim="'.3s'" class="stack-list">
              <div class="stack-area">
                <span v-for="topic in continuousLearning.topics" :key="topic" class="stack-icon">{{ topic }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CtaSection />
</template>
