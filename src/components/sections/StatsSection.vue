<script setup>
import { profile } from '@/data/portfolio'
</script>

<template>
  <section class="counter-feature-section section-padding fix pt-0">
    <div class="container">
      <div class="row g-4">
        <div v-for="(s, i) in profile.stats" :key="s.label" v-anim="`${0.3 + i * 0.2}s`" class="col-xl-4 col-lg-4 col-md-6">
          <div class="counter-feature-box style-2">
            <div class="counter-top">
              <div class="icon stat-icon">
                <i :class="s.icon"></i>
              </div>
              <h2><span v-count="s.value">{{ s.value }}</span>{{ s.suffix }}</h2>
            </div>
            <p>{{ s.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
