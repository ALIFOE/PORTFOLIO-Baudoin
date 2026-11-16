<script setup>
import icon from '@/assets/img/logos/concepttech-icon.png'
import { profile } from '@/data/portfolio'

defineProps({ light: { type: Boolean, default: false } })
</script>

<template>
  <span class="site-logo" :class="{ 'site-logo--light': light }">
    <img :src="icon" alt="" width="29" height="32" />
    <span class="site-logo__text">{{ profile.logoText }}<b>.</b></span>
  </span>
</template>
