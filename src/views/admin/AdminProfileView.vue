<script setup>
import { useSectionEditor } from '@/admin/editor'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ALines from '@/components/admin/ALines.vue'
import AList from '@/components/admin/AList.vue'
import AIcon from '@/components/admin/AIcon.vue'
import AMedia from '@/components/admin/AMedia.vue'

const editor = useSectionEditor('profile')
</script>

<template>
  <ASection
    title="À propos"
    text="Votre identité, votre présentation, vos coordonnées et vos photos : elles apparaissent sur tout le site."
    preview="/a-propos"
    :editor="editor"
  >
    <template #default="{ data: p }">
      <ABlock title="Identité" icon="fa-regular fa-id-card">
        <AField v-model="p.fullName" label="Nom complet" />
        <AField v-model="p.shortName" label="Nom court" hint="Utilisé dans les emails de réponse et « Bonjour, je suis … »." />
        <AField v-model="p.role" label="Métier principal" hint="Pastille à côté de votre nom sur l'accueil." />
        <AField v-model="p.logoText" label="Texte du logo" />
        <AField v-model="p.title" label="Titre complet" hint="Pied de page et référencement." wide />
        <AField v-model="p.headline" label="Grand titre de l'accueil" wide />
        <AField v-model="p.intro" label="Présentation courte" multiline :rows="4" wide hint="Accueil, page À propos et menu mobile." />
      </ABlock>

      <ABlock title="Présentation détaillée" icon="fa-solid fa-align-left" text="Page À propos.">
        <ALines v-model="p.about.profile" label="Mon profil professionnel" paragraphs :rows="8" />
        <ALines v-model="p.about.vision" label="Vision & approche" paragraphs :rows="6" />
      </ABlock>

      <ABlock title="Coordonnées et réseaux" icon="fa-regular fa-address-book">
        <AField v-model="p.location" label="Localisation" />
        <AField v-model="p.email" label="Email" type="email" />
        <AField v-model="p.phone" label="Téléphone" placeholder="+228 …" />
        <AField v-model="p.whatsapp" label="Numéro WhatsApp" placeholder="+228 …" hint="Bouton WhatsApp du site (laisser vide = téléphone)." />
        <AField v-model="p.linkedin" label="LinkedIn" type="url" placeholder="https://linkedin.com/in/…" />
        <AField v-model="p.github" label="GitHub" type="url" placeholder="https://github.com/…" />
        <AField v-model="p.facebook" label="Facebook" type="url" placeholder="https://facebook.com/…" />
        <AField v-model="p.instagram" label="Instagram" type="url" placeholder="https://instagram.com/…" />
        <AField v-model="p.youtube" label="YouTube" type="url" placeholder="https://youtube.com/@…" />
      </ABlock>

      <ABlock title="Photos" icon="fa-regular fa-image" text="Format conseillé : photos nettes, au moins 1000 px de large.">
        <AMedia v-model="p.photos.portrait" label="Portrait rond (accueil)" />
        <AMedia v-model="p.photos.hero" label="Grande photo de l'accueil" />
        <AMedia v-model="p.photos.about" label="Photo de la page À propos" />
        <AMedia v-model="p.photos.contact" label="Photo du bloc contact" />
      </ABlock>

      <ABlock title="Chiffres clés" icon="fa-solid fa-chart-simple">
        <AList
          v-model="p.stats"
          :new-item="() => ({ value: 0, suffix: '+', label: '', icon: 'fa-solid fa-star' })"
          :item-label="(s) => s.label"
          add-label="Ajouter un chiffre"
          :max="6"
          compact
        >
          <template #default="{ item }">
            <AField v-model="item.value" label="Valeur" type="number" />
            <AField v-model="item.suffix" label="Suffixe" placeholder="+" />
            <AField v-model="item.label" label="Libellé" />
            <AIcon v-model="item.icon" />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Centres d'intérêt" icon="fa-regular fa-heart">
        <AList
          v-model="p.interests"
          :new-item="() => ({ label: '', icon: 'fa-solid fa-star' })"
          :item-label="(s) => s.label"
          add-label="Ajouter un centre d'intérêt"
          :max="12"
          compact
          :confirm-remove="false"
        >
          <template #default="{ item }">
            <AField v-model="item.label" label="Libellé" />
            <AIcon v-model="item.icon" />
          </template>
        </AList>
      </ABlock>

      <ABlock title="Disponibilités" icon="fa-regular fa-clock" text="Page Contact.">
        <AList
          v-model="p.availability"
          :new-item="() => ({ day: '', hours: '' })"
          :item-label="(s) => s.day"
          add-label="Ajouter un créneau"
          :max="7"
          compact
          :confirm-remove="false"
        >
          <template #default="{ item }">
            <AField v-model="item.day" label="Jours" />
            <AField v-model="item.hours" label="Horaires" />
          </template>
        </AList>
      </ABlock>
    </template>
  </ASection>
</template>
