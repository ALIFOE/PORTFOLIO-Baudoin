<script setup>
import { experiences } from '@/data/portfolio'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturedProjects from '@/components/sections/FeaturedProjects.vue'
import ExpertiseSection from '@/components/sections/ExpertiseSection.vue'
import WorkPositions from '@/components/sections/WorkPositions.vue'
import BrandSection from '@/components/sections/BrandSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <HeroSection />
  <FeaturedProjects />
  <ExpertiseSection />
  <WorkPositions title="Expériences <br> professionnelles" :items="experiences.slice(0, 4)" more />
  <BrandSection />
  <ProcessSection />
  <ContactSection />
</template>
