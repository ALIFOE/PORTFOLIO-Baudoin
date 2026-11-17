<script setup>
import { content } from '@/content'
import PageHeader from '@/components/PageHeader.vue'
import ExperienceCard from '@/components/ExperienceCard.vue'
import WorkPositions from '@/components/sections/WorkPositions.vue'
import CtaSection from '@/components/sections/CtaSection.vue'

const tilt = ['', 'style-2', 'style-3', 'style-4', 'style-5', 'style-6']
</script>

<template>
  <PageHeader
    title="Expérience"
    :crumbs="[{ label: 'Expérience' }]"
    text="Un parcours diversifié dans le domaine de la technologie et du développement, façonné par la passion et l'innovation."
  />

  <section class="career-waypoint-section section-padding pt-0 fix">
    <div class="container">
      <div class="section-title">
        <span v-anim class="sub-title">{ Parcours professionnel }</span>
        <h2 v-split class="style-2"><span>Expérience</span> riche & diversifiée</h2>
      </div>
      <div class="row g-4">
        <div
          v-for="(job, i) in content.experience.experiences"
          :key="i"
          v-anim="`${0.2 + (i % 2) * 0.2}s`"
          class="col-xl-6 col-lg-6"
        >
          <ExperienceCard :job="job" :variant="tilt[i % tilt.length]" />
        </div>
      </div>
    </div>
  </section>

  <WorkPositions title="Engagement <br> bénévole" :items="content.experience.volunteering" :padded="false" />

  <section v-if="content.experience.keySkills.length" class="tech-stack-section-inner section-padding fix">
    <div class="container">
      <div class="section-title text-center">
        <h2 v-split class="style-3">Compétences clés développées</h2>
        <p v-anim="'.2s'" class="mt-3">Une combinaison d'expertise technique et de qualités humaines, forgée sur le terrain.</p>
      </div>
      <div class="row g-3">
        <div v-for="(k, i) in content.experience.keySkills" :key="k.title" v-anim="`${0.3 + i * 0.2}s`" class="col-xl-4 col-lg-6 col-md-6">
          <div class="tech-stack-items">
            <div class="tech-top">
              <div class="icon fa-tile"><i :class="k.icon"></i></div>
              <h3 class="title">{{ k.title }}</h3>
            </div>
            <p>{{ k.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CtaSection />
</template>
