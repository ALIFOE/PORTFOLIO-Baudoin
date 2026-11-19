<script setup>
import logo from '@/assets/img/logos/baudoin-concept.png'

defineProps({ light: { type: Boolean, default: false } })
</script>

<template>
  <span class="site-logo" :class="{ 'site-logo--light': light }">
    <img :src="logo" alt="Baudoin Concept" width="371" height="200" />
  </span>
</template>
