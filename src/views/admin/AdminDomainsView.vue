<script setup>
import { ref, computed, watch } from 'vue'
import { useSectionEditor } from '@/admin/editor'
import { pad } from '@/admin/ui'
import ASection from '@/components/admin/ASection.vue'
import ABlock from '@/components/admin/ABlock.vue'
import AField from '@/components/admin/AField.vue'
import ALines from '@/components/admin/ALines.vue'
import ATags from '@/components/admin/ATags.vue'
import AIcon from '@/components/admin/AIcon.vue'
import AMedia from '@/components/admin/AMedia.vue'
import AGallery from '@/components/admin/AGallery.vue'

const editor = useSectionEditor('domains')
const list = computed(() => editor.state.data ?? [])
const active = ref(0)
const domain = computed(() => list.value[active.value])
watch(
  () => list.value.length,
  (n) => {
    if (active.value >= n) active.value = Math.max(0, n - 1)
  },
)

function add() {
  list.value.push({
    slug: '',
    title: 'Nouveau domaine',
    shortTitle: '',
    icon: 'fa-solid fa-star',
    tagline: '',
    description: '',
    cover: '',
    services: [],
    tools: [],
    media: [],
  })
  active.value = list.value.length - 1
}
function move(step) {
  const i = active.value
  const j = i + step
  if (j < 0 || j >= list.value.length) return
  const [item] = list.value.splice(i, 1)
  list.value.splice(j, 0, item)
  active.value = j
}
function remove() {
  const d = domain.value
  if (!window.confirm(`Supprimer le domaine « ${d.title} » et sa galerie (${d.media.length} média${d.media.length > 1 ? 's' : ''}) ?`)) return
  list.value.splice(active.value, 1)
}
</script>

<template>
  <ASection
    title="Domaines d'activité"
    text="Vos métiers, dans l'ordre d'importance : le premier est mis en avant partout sur le site. Chaque domaine a sa page et sa galerie de réalisations."
    preview="/realisations"
    :editor="editor"
  >
    <template #default="{ data }">
      <div class="adm-domain-tabs" role="tablist" aria-label="Domaines">
        <button
          v-for="(d, i) in data"
          :key="i"
          type="button"
          role="tab"
          class="adm-domain-tab"
          :class="{ 'is-active': active === i }"
          :aria-selected="active === i"
          @click="active = i"
        >
          <em>{{ pad(i + 1) }}</em>
          <span>
            <strong>{{ d.shortTitle || d.title || 'Sans titre' }}</strong>
            <small>{{ d.media.length }} média{{ d.media.length > 1 ? 's' : '' }}{{ i === 0 ? ' · principal' : '' }}</small>
          </span>
        </button>
        <button v-if="data.length < 6" type="button" class="adm-domain-tab is-add" @click="add">
          <i class="fa-solid fa-plus"></i><span>Ajouter un domaine</span>
        </button>
      </div>

      <template v-if="domain">
        <div class="adm-domain-bar">
          <span class="adm-muted">
            Position {{ active + 1 }} sur {{ data.length }}{{ active === 0 ? ' — activité principale' : '' }}
          </span>
          <div class="adm-actions">
            <button type="button" class="adm-btn adm-btn--sm" :disabled="active === 0" @click="move(-1)">
              <i class="fa-solid fa-arrow-left"></i>Plus important
            </button>
            <button type="button" class="adm-btn adm-btn--sm" :disabled="active === data.length - 1" @click="move(1)">
              Moins important<i class="fa-solid fa-arrow-right"></i>
            </button>
            <a :href="`#/realisations/${domain.slug}`" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">
              <i class="fa-regular fa-eye"></i>Voir la page
            </a>
            <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="remove">
              <i class="fa-regular fa-trash-can"></i>Supprimer
            </button>
          </div>
        </div>

        <ABlock title="Présentation" icon="fa-solid fa-layer-group">
          <AField v-model="domain.title" label="Titre complet" />
          <AField v-model="domain.shortTitle" label="Titre court" hint="Menu, boutons et étiquettes." />
          <AIcon v-model="domain.icon" />
          <AField
            v-model="domain.slug"
            label="Adresse de la page"
            :hint="`#/realisations/${domain.slug || '…'} — si vous la changez, vérifiez le domaine de vos projets.`"
          />
          <AField v-model="domain.tagline" label="Accroche" wide />
          <AField v-model="domain.description" label="Description" multiline :rows="5" wide />
          <AMedia v-model="domain.cover" label="Image de couverture" />
        </ABlock>

        <ABlock title="Services et outils" icon="fa-solid fa-list-check">
          <ALines v-model="domain.services" label="Services proposés" :rows="5" />
          <ATags v-model="domain.tools" label="Outils et technologies" />
        </ABlock>

        <ABlock
          title="Galerie de réalisations"
          icon="fa-regular fa-images"
          :text="`${domain.media.length} média${domain.media.length > 1 ? 's' : ''} — affichés dans cet ordre sur la page du domaine. Les projets rattachés à ce domaine (page Projets) s'affichent en plus.`"
        >
          <AGallery v-model="domain.media" />
        </ABlock>
      </template>
      <p v-else class="adm-empty">Aucun domaine. Ajoutez-en un avec le bouton ci-dessus.</p>
    </template>
  </ASection>
</template>
