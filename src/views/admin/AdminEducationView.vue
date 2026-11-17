<script setup>
import { useSectionEditor } from '@/admin/editor'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ATags from '@/components/admin/ATags.vue'
import AList from '@/components/admin/AList.vue'
import AMedia from '@/components/admin/AMedia.vue'

const editor = useSectionEditor('education')
</script>

<template>
  <ASection
    title="Formation"
    text="Parcours académique, certifications et formation continue."
    preview="/formation"
    :editor="editor"
  >
    <template #default="{ data }">
      <ABlock title="Parcours académique" icon="fa-solid fa-graduation-cap">
        <AList
          v-model="data.education"
          :new-item="() => ({ title: '', school: '', period: '', current: false, summary: '', topics: [] })"
          :item-label="(e) => [e.title, e.school].filter(Boolean).join(' — ')"
          add-label="Ajouter une formation"
          collapsible
        >
          <template #badges="{ item }">
            <span v-if="item.current" class="adm-badge is-demande">En cours</span>
            <span class="adm-item__sub">{{ item.period }}</span>
          </template>
          <template #default="{ item }">
            <AField v-model="item.title" label="Diplôme / formation" />
            <AField v-model="item.school" label="Établissement" />
            <AField v-model="item.period" label="Période" placeholder="2020 — 2021" />
            <label class="adm-check">
              <input v-model="item.current" type="checkbox" />
              <span>Formation en cours</span>
            </label>
            <AField v-model="item.summary" label="Résumé" multiline :rows="2" wide />
            <ATags v-model="item.topics" label="Matières / thèmes" />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Certifications" icon="fa-solid fa-certificate">
        <AList
          v-model="data.certifications"
          :new-item="() => ({ title: '', issuer: '', year: '', logo: '', text: '' })"
          :item-label="(c) => [c.title, c.issuer].filter(Boolean).join(' — ')"
          add-label="Ajouter une certification"
          collapsible
        >
          <template #badges="{ item }">
            <span class="adm-item__sub">{{ item.year }}</span>
          </template>
          <template #default="{ item }">
            <AField v-model="item.title" label="Intitulé" />
            <AField v-model="item.issuer" label="Organisme" />
            <AField v-model="item.year" label="Année" />
            <AMedia v-model="item.logo" label="Logo de l'organisme" />
            <AField v-model="item.text" label="Description" multiline wide />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Formation continue" icon="fa-solid fa-book">
        <AField v-model="data.continuousLearning.text" label="Texte" multiline :rows="3" wide />
        <ATags v-model="data.continuousLearning.topics" label="Thèmes" />
      </ABlock>
    </template>
  </ASection>
</template>
