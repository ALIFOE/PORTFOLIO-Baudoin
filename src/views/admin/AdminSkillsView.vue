<script setup>
import { useSectionEditor } from '@/admin/editor'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ATags from '@/components/admin/ATags.vue'
import AList from '@/components/admin/AList.vue'
import AIcon from '@/components/admin/AIcon.vue'

const editor = useSectionEditor('skills')
</script>

<template>
  <ASection
    title="Compétences"
    text="Niveaux par domaine, outils de design et multimédia, boîte à outils et langues."
    preview="/competences"
    :editor="editor"
  >
    <template #default="{ data }">
      <ABlock title="Domaines de compétence" icon="fa-solid fa-sliders" text="Chaque groupe affiche ses compétences avec une barre de niveau (0 à 100 %).">
        <AList
          v-model="data.groups"
          :new-item="() => ({ title: '', icon: 'fa-solid fa-star', skills: [] })"
          :item-label="(g) => g.title"
          add-label="Ajouter un groupe"
          collapsible
          :max="8"
        >
          <template #badges="{ item }">
            <span class="adm-item__sub">{{ item.skills.length }} compétence{{ item.skills.length > 1 ? 's' : '' }}</span>
          </template>
          <template #default="{ item }">
            <AField v-model="item.title" label="Titre du groupe" />
            <AIcon v-model="item.icon" />
            <AList
              v-model="item.skills"
              :new-item="() => ({ name: '', level: 80 })"
              :item-label="(s) => s.name"
              add-label="Ajouter une compétence"
              compact
              :confirm-remove="false"
            >
              <template #default="{ item: skill }">
                <AField v-model="skill.name" label="Compétence" />
                <label class="adm-field adm-level">
                  <span>Niveau : {{ skill.level }} %</span>
                  <input v-model.number="skill.level" type="range" min="0" max="100" step="5" />
                </label>
              </template>
            </AList>
          </template>
        </AList>
      </ABlock>

      <ABlock title="Design & multimédia" icon="fa-solid fa-pen-nib" text="Pastilles de la bande sombre de la page Compétences.">
        <ATags v-model="data.designTools" label="Logiciels" />
      </ABlock>

      <ABlock title="Boîte à outils" icon="fa-solid fa-toolbox">
        <AList
          v-model="data.toolbox"
          :new-item="() => ({ title: '', icon: 'fa-solid fa-star', items: '' })"
          :item-label="(t) => t.title"
          add-label="Ajouter une catégorie"
          collapsible
        >
          <template #default="{ item }">
            <AField v-model="item.title" label="Catégorie" />
            <AIcon v-model="item.icon" />
            <AField v-model="item.items" label="Outils" wide hint="Séparés par des virgules." />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Langues" icon="fa-solid fa-language">
        <AList
          v-model="data.languages"
          :new-item="() => ({ name: '', level: '', value: 50 })"
          :item-label="(l) => l.name"
          add-label="Ajouter une langue"
          compact
        >
          <template #default="{ item }">
            <AField v-model="item.name" label="Langue" />
            <AField v-model="item.level" label="Niveau (texte)" placeholder="Courant" />
            <label class="adm-field adm-level">
              <span>Barre : {{ item.value }} %</span>
              <input v-model.number="item.value" type="range" min="0" max="100" step="5" />
            </label>
          </template>
        </AList>
      </ABlock>
    </template>
  </ASection>
</template>
