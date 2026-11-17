<script setup>
import { useSectionEditor } from '@/admin/editor'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ALines from '@/components/admin/ALines.vue'
import ATags from '@/components/admin/ATags.vue'
import AList from '@/components/admin/AList.vue'
import AIcon from '@/components/admin/AIcon.vue'
import AMedia from '@/components/admin/AMedia.vue'

const editor = useSectionEditor('experience')

const newJob = () => ({
  role: '',
  company: '',
  period: '',
  current: false,
  logo: '',
  tasks: [],
  reference: { name: '', role: '', email: '', phones: [] },
})
const jobLabel = (j) => [j.role, j.company].filter(Boolean).join(' — ')
</script>

<template>
  <ASection
    title="Expérience"
    text="Parcours professionnel, engagement bénévole, compétences clés et logos des organisations. L'accueil affiche les 4 premières expériences."
    preview="/experience"
    :editor="editor"
  >
    <template #default="{ data }">
      <template v-for="group in [
        { key: 'experiences', title: 'Expériences professionnelles', icon: 'fa-solid fa-briefcase', add: 'Ajouter une expérience' },
        { key: 'volunteering', title: 'Engagement bénévole', icon: 'fa-solid fa-hand-holding-heart', add: 'Ajouter un engagement' },
      ]" :key="group.key">
        <ABlock :title="group.title" :icon="group.icon" text="Dans l'ordre d'affichage : mettez la plus récente ou la plus importante en premier.">
          <AList v-model="data[group.key]" :new-item="newJob" :item-label="jobLabel" :add-label="group.add" collapsible>
            <template #badges="{ item }">
              <span v-if="item.current" class="adm-badge is-demande">En cours</span>
              <span class="adm-item__sub">{{ item.period }}</span>
            </template>
            <template #default="{ item }">
              <AField v-model="item.role" label="Poste" />
              <AField v-model="item.company" label="Organisation" />
              <AField v-model="item.period" label="Période" placeholder="2023 — Présent" />
              <label class="adm-check">
                <input v-model="item.current" type="checkbox" />
                <span>Poste actuel (badge « En cours »)</span>
              </label>
              <AMedia v-model="item.logo" label="Logo de l'organisation" />
              <ALines v-model="item.tasks" label="Missions" :rows="4" />
              <fieldset class="adm-subgrid is-wide">
                <legend>Référence (facultatif)</legend>
                <AField v-model="item.reference.name" label="Nom" />
                <AField v-model="item.reference.role" label="Fonction" />
                <AField v-model="item.reference.email" label="Email" type="email" />
                <ATags v-model="item.reference.phones" label="Téléphones" placeholder="+228 …" :wide="false" />
              </fieldset>
            </template>
          </AList>
        </ABlock>
      </template>

      <ABlock title="Compétences clés développées" icon="fa-solid fa-star" text="Bas de la page Expérience.">
        <AList
          v-model="data.keySkills"
          :new-item="() => ({ title: '', icon: 'fa-solid fa-star', text: '' })"
          :item-label="(k) => k.title"
          add-label="Ajouter une compétence clé"
          collapsible
        >
          <template #default="{ item }">
            <AField v-model="item.title" label="Titre" />
            <AIcon v-model="item.icon" />
            <AField v-model="item.text" label="Texte" multiline wide />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Ils m'ont fait confiance" icon="fa-solid fa-handshake" text="Logos affichés sur l'accueil et la page À propos.">
        <AList
          v-model="data.organizations"
          :new-item="() => ({ name: '', logo: '' })"
          :item-label="(o) => o.name"
          add-label="Ajouter une organisation"
          compact
        >
          <template #default="{ item }">
            <AField v-model="item.name" label="Nom" />
            <AMedia v-model="item.logo" label="Logo" />
          </template>
        </AList>
      </ABlock>
    </template>
  </ASection>
</template>
