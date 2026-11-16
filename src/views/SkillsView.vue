<script setup>
import { skillGroups, designTools, languages, toolbox } from '@/data/portfolio'
import PageHeader from '@/components/PageHeader.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import shape1 from '@/assets/img/template/stack-shape-1.png'
import shape2 from '@/assets/img/template/stack-shape-2.png'
import shape3 from '@/assets/img/template/stack-shape-3.png'

// Deux rangées de pastilles, comme dans le template
const half = Math.ceil(designTools.length / 2)
const toolRows = [designTools.slice(0, half), designTools.slice(half)]
</script>

<template>
  <PageHeader
    title="Compétences"
    :crumbs="[{ label: 'Compétences' }]"
    text="Un ensemble de compétences techniques en développement, réseau et audiovisuel, mises au service de vos projets."
  />

  <!-- Niveaux par domaine -->
  <section class="tech-stack-section-inner section-padding pt-0 fix">
    <div class="container">
      <div class="section-title">
        <span v-anim class="sub-title">{ Savoir-faire }</span>
        <h2 v-split class="style-2"><span>Trois domaines</span> d'expertise</h2>
      </div>
      <div class="row g-3">
        <div
          v-for="(group, i) in skillGroups"
          :key="group.title"
          v-anim="`${0.2 + i * 0.2}s`"
          class="col-xl-4 col-lg-6 col-md-6"
        >
          <div class="tech-stack-items skill-card">
            <div class="tech-top">
              <div class="icon fa-tile"><i :class="group.icon"></i></div>
              <h3 class="title">{{ group.title }}</h3>
            </div>
            <div class="skill-list">
              <div v-for="skill in group.skills" :key="skill.name" class="skill-row">
                <div class="skill-row__head">
                  <span>{{ skill.name }}</span>
                  <em>{{ skill.level }}%</em>
                </div>
                <div
                  class="skill-bar"
                  role="progressbar"
                  :aria-label="skill.name"
                  :aria-valuenow="skill.level"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span class="skill-bar__fill" :style="{ '--level': `${skill.level}%` }"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Design & multimédia -->
  <section class="tech-stack-section section-padding fix section-bg">
    <div class="stack-shape-1"><img :src="shape1" alt="" /></div>
    <div class="stack-shape-2"><img :src="shape2" alt="" /></div>
    <div class="stack-bg-shape"><img :src="shape3" alt="" /></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10">
          <div class="tech-stack-content">
            <div class="section-title text-center">
              <span v-anim class="sub-title">{ Design & multimédia }</span>
              <h2 v-split class="style-2 text-white">
                <span>Créer</span> aussi pour l'œil et l'oreille : visuels, montage vidéo et production audio
              </h2>
            </div>
            <div v-anim="'.3s'" class="stack-list">
              <div v-for="(row, r) in toolRows" :key="r" class="stack-area" :class="{ 'style-2': r === 1 }">
                <span v-for="tool in row" :key="tool" class="stack-icon">{{ tool }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Boîte à outils + langues -->
  <section class="tech-stack-section-2 section-padding pb-0 fix">
    <div class="container">
      <div class="section-title text-center">
        <h2 v-split class="style-3">Ma boîte à outils</h2>
        <p v-anim="'.2s'" class="mt-3">Les technologies et logiciels que j'utilise au quotidien.</p>
      </div>
      <div class="row g-3">
        <div
          v-for="(tool, i) in toolbox"
          :key="tool.title"
          v-anim="`${0.2 + (i % 3) * 0.2}s`"
          class="col-xl-4 col-lg-6 col-md-6"
        >
          <div class="tech-stack-items">
            <div class="tech-top">
              <div class="icon fa-tile"><i :class="tool.icon"></i></div>
              <h3 class="title">{{ tool.title }}</h3>
            </div>
            <p class="tool-items">{{ tool.items }}</p>
          </div>
        </div>
      </div>

      <div v-anim="'.2s'" class="languages-box">
        <h3>Langues</h3>
        <div class="row g-4">
          <div v-for="lang in languages" :key="lang.name" class="col-md-6">
            <div class="skill-row">
              <div class="skill-row__head">
                <span>{{ lang.name }}</span>
                <em>{{ lang.level }}</em>
              </div>
              <div
                class="skill-bar"
                role="progressbar"
                :aria-label="lang.name"
                :aria-valuenow="lang.value"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="skill-bar__fill" :style="{ '--level': `${lang.value}%` }"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CtaSection title="Un projet qui mobilise ces compétences ?" />
</template>
