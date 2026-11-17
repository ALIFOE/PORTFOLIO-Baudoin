<script setup>
/** Bloc de formulaire avec titre (une partie d'une section). */
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <section class="adm-panel adm-block">
    <header class="adm-block__head">
      <h2><i v-if="icon" :class="icon"></i>{{ title }}</h2>
      <p v-if="text" class="adm-muted">{{ text }}</p>
      <slot name="head" />
    </header>
    <div class="adm-grid">
      <slot />
    </div>
  </section>
</template>
