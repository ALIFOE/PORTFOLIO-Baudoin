<script setup>
import PageHeader from '@/components/PageHeader.vue'
import DomainsSection from '@/components/sections/DomainsSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
</script>

<template>
  <PageHeader
    title="Réalisations"
    :crumbs="[{ label: 'Réalisations' }]"
    text="Mes trois domaines d'activité et ce que j'y ai réalisé : sites et applications, photo, vidéo et design, sonorisation d'événements."
  />
  <DomainsSection title="Choisissez un domaine <br>pour voir mes réalisations" :all-link="false" preview class="pt-0" />
  <CtaSection title="Un projet dans l'un de ces domaines ?" />
</template>
