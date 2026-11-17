<script setup>
import { media } from '@/content'

defineProps({
  job: { type: Object, required: true },
  variant: { type: String, default: '' },
})
const tel = (n) => `tel:${n.replace(/[^\d+]/g, '')}`
</script>

<template>
  <article class="waypoint-box-items experience-card" :class="variant">
    <div class="experience-card__head">
      <span>{{ job.company }}</span>
      <img v-if="media(job.logo)" :src="media(job.logo)" :alt="job.company" class="experience-card__logo" loading="lazy" />
    </div>
    <h3 class="title">
      {{ job.role }}
      <em v-if="job.current" class="badge-current">En cours</em>
    </h3>
    <ul class="experience-card__tasks">
      <li v-for="(t, i) in job.tasks" :key="i">{{ t }}</li>
    </ul>
    <div v-if="job.reference?.name" class="experience-card__ref">
      <small>Référence</small>
      <strong>{{ job.reference.name }}</strong>
      <span v-if="job.reference.role" class="ref-role">{{ job.reference.role }}</span>
      <div class="ref-links">
        <a v-if="job.reference.email" :href="`mailto:${job.reference.email}`"><i class="fa-regular fa-envelope"></i>{{ job.reference.email }}</a>
        <a v-for="p in job.reference.phones" :key="p" :href="tel(p)"><i class="fa-solid fa-phone"></i>{{ p }}</a>
      </div>
    </div>
    <h4>{{ job.period }}</h4>
  </article>
</template>
