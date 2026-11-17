<script setup>
import { useSectionEditor } from '@/admin/editor'
import { content } from '@/content'
import { categoryLabel } from '@/data/portfolio'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ALines from '@/components/admin/ALines.vue'
import ATags from '@/components/admin/ATags.vue'
import AList from '@/components/admin/AList.vue'
import AMedia from '@/components/admin/AMedia.vue'
import AMediaList from '@/components/admin/AMediaList.vue'

const editor = useSectionEditor('projects')
const categories = ['web', 'application', 'mobile', 'design']

const newProject = () => ({
  slug: '',
  title: '',
  subtitle: '',
  category: 'web',
  domain: content.domains[0]?.slug ?? '',
  image: '',
  gallery: [],
  excerpt: '',
  description: '',
  highlights: [],
  technologies: [],
  features: [],
  demoUrl: '',
  featured: false,
})
const domainTitle = (slug) => content.domains.find((d) => d.slug === slug)?.shortTitle ?? ''
</script>

<template>
  <ASection
    title="Projets"
    text="Sites, applications et créations. L'ordre de la liste est celui de la page Projets ; les projets « à la une » apparaissent sur l'accueil."
    preview="/projets"
    :editor="editor"
  >
    <template #default="{ data }">
      <ABlock title="Liste des projets" icon="fa-solid fa-diagram-project">
        <AList
          :model-value="data"
          :new-item="newProject"
          :item-label="(p) => p.title"
          add-label="Ajouter un projet"
          collapsible
        >
          <template #badges="{ item }">
            <span class="adm-badge">{{ categoryLabel(item.category) }}</span>
            <span v-if="item.featured" class="adm-badge is-demande"><i class="fa-solid fa-star"></i> À la une</span>
            <span class="adm-item__sub">{{ domainTitle(item.domain) }}</span>
          </template>
          <template #default="{ item }">
            <AField v-model="item.title" label="Nom du projet" />
            <AField v-model="item.subtitle" label="Sous-titre / secteur" placeholder="Coopérative agricole" />
            <label class="adm-field">
              <span>Type de projet</span>
              <select v-model="item.category">
                <option v-for="c in categories" :key="c" :value="c">{{ categoryLabel(c) }}</option>
              </select>
            </label>
            <label class="adm-field">
              <span>Domaine d'activité</span>
              <select v-model="item.domain">
                <option value="">— Aucun —</option>
                <option v-for="d in content.domains" :key="d.slug" :value="d.slug">{{ d.title }}</option>
              </select>
              <small class="adm-hint">Le projet apparaît aussi sur la page de ce domaine.</small>
            </label>
            <AField v-model="item.demoUrl" label="Site en ligne" type="url" placeholder="https://…" />
            <AField v-model="item.slug" label="Adresse de la page" :hint="`#/projets/${item.slug || '…'} (rempli automatiquement si vide)`" />
            <label class="adm-check is-wide">
              <input v-model="item.featured" type="checkbox" />
              <span>À la une sur l'accueil</span>
            </label>
            <AMedia v-model="item.image" label="Image principale" hint="Capture d'écran du site : 1440 × 900 px conseillé." />
            <AMediaList v-model="item.gallery" label="Autres images" />
            <AField v-model="item.excerpt" label="Résumé (liste des projets)" multiline :rows="2" wide />
            <AField v-model="item.description" label="Description (page du projet)" multiline :rows="5" wide />
            <ALines v-model="item.features" label="Fonctionnalités clés" :rows="5" />
            <ALines v-model="item.highlights" label="Points forts" :rows="3" hint="Un par ligne ; le premier s'affiche sur l'accueil." />
            <ATags v-model="item.technologies" label="Technologies" />
          </template>
        </AList>
      </ABlock>
    </template>
  </ASection>
</template>
