<script setup>
import { content } from '@/content'
import HeroSection from '@/components/sections/HeroSection.vue'
import DomainsSection from '@/components/sections/DomainsSection.vue'
import FeaturedProjects from '@/components/sections/FeaturedProjects.vue'
import WorkPositions from '@/components/sections/WorkPositions.vue'
import BrandSection from '@/components/sections/BrandSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <HeroSection />
  <DomainsSection />
  <FeaturedProjects />
  <WorkPositions title="Expériences <br> professionnelles" :items="content.experience.experiences.slice(0, 4)" more />
  <BrandSection />
  <ProcessSection />
  <ContactSection />
</template>
