<script setup>
import breadcrumbShape from '@/assets/img/template/breadcrumb-shape.png'
import { marquee } from '@/data/portfolio'

defineProps({
  title: { type: String, required: true },
  crumbs: { type: Array, default: () => [] }, // [{ label, to? }]
  text: { type: String, default: '' },
})

const line = marquee.join('  ⚬  ')
</script>

<template>
  <div class="bread-top-shape">
    <div class="shape">
      <img :src="breadcrumbShape" alt="" />
    </div>
  </div>

  <div class="marquee-section-2" aria-hidden="true">
    <div class="marquee-2">
      <div v-for="g in 2" :key="g" class="marquee-group">
        <span v-for="n in 2" :key="n" class="text">{{ line }} ⚬</span>
      </div>
    </div>
  </div>

  <section class="breadcrumb-wrapper bg-cover">
    <div class="container">
      <div class="page-heading">
        <div class="breadcrumb-title">
          <h1 v-split class="breadcrumb-title">{{ title }}</h1>
          <ul v-anim class="breadcrumb-list">
            <li><router-link to="/">Accueil</router-link></li>
            <template v-for="c in crumbs" :key="c.label">
              <li>/</li>
              <li>
                <router-link v-if="c.to" :to="c.to">{{ c.label }}</router-link>
                <template v-else>{{ c.label }}</template>
              </li>
            </template>
          </ul>
        </div>
        <p v-if="text" v-anim="'.2s'" class="breadcrumb-text">{{ text }}</p>
      </div>
    </div>
  </section>
</template>
