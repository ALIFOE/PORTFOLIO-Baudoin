<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { adminApi } from '@/api'
import { content } from '@/content'
import { notify, handleError as handle, inbox, formatDate } from '@/admin/ui'

const TABS = [
  { key: 'active', label: 'Boîte de réception' },
  { key: 'new', label: 'Nouveaux' },
  { key: 'read', label: 'Lus' },
  { key: 'done', label: 'Traités' },
  { key: 'archived', label: 'Archives' },
]
const STATUS = {
  new: { label: 'Nouveau', icon: 'fa-solid fa-circle' },
  read: { label: 'Lu', icon: 'fa-regular fa-envelope-open' },
  done: { label: 'Traité', icon: 'fa-solid fa-check' },
  archived: { label: 'Archivé', icon: 'fa-solid fa-box-archive' },
}
const KIND = { contact: 'Contact', demande: 'Demande de projet' }

const filters = reactive({ status: 'active', kind: '', q: '', page: 1 })
const list = reactive({
  items: [],
  total: 0,
  pages: 1,
  counts: { active: 0, new: 0, read: 0, done: 0, archived: 0, contact: 0, demande: 0, total: 0 },
  loading: true,
  loaded: false,
  error: '',
})
const openId = ref(null)
const noteDrafts = reactive({})
const busyId = ref(null)
let lastLoad = 0

const stats = computed(() => [
  { label: 'Nouveaux', value: list.counts.new, icon: 'fa-solid fa-bell', accent: true },
  { label: 'Demandes de projet', value: list.counts.demande, icon: 'fa-solid fa-briefcase' },
  { label: 'Messages de contact', value: list.counts.contact, icon: 'fa-regular fa-envelope' },
  { label: 'Total reçus', value: list.counts.total, icon: 'fa-solid fa-inbox' },
])
const activeFilters = computed(() => ({ status: filters.status, kind: filters.kind, q: filters.q.trim() }))
const exportUrl = computed(() => adminApi.exportUrl(activeFilters.value))

const excerpt = (text) => (text.length > 140 ? `${text.slice(0, 140).trimEnd()}…` : text)
const replyLink = (m) =>
  `mailto:${m.email}?subject=${encodeURIComponent(`Votre message — ${content.profile.shortName}`)}`
const whatsappLink = (m) => {
  const digits = m.whatsapp.replace(/\D/g, '')
  return digits.length >= 8 ? `https://wa.me/${digits}` : ''
}

async function load({ quiet = false } = {}) {
  if (!quiet) list.loading = true
  list.error = ''
  try {
    const data = await adminApi.list({ ...activeFilters.value, page: filters.page, per_page: 20 })
    Object.assign(list, { items: data.items, total: data.total, pages: data.pages, counts: data.counts, loaded: true })
    inbox.newCount = data.counts.new
    filters.page = data.page
    if (!data.items.some((m) => m.id === openId.value)) openId.value = null
    lastLoad = Date.now()
  } catch (e) {
    if (e?.status === 401) handle(e)
    else list.error = e.message
  } finally {
    list.loading = false
  }
}

function replaceItems(updated, counts) {
  for (const item of updated) {
    const i = list.items.findIndex((m) => m.id === item.id)
    if (i !== -1) list.items[i] = item
  }
  if (counts) {
    list.counts = counts
    inbox.newCount = counts.new
  }
}

const matchesTab = (m) => (filters.status === 'active' ? m.status !== 'archived' : m.status === filters.status)

async function setStatus(message, status, { silent = false } = {}) {
  if (message.status === status) return
  busyId.value = message.id
  try {
    const data = await adminApi.update([message.id], { status })
    replaceItems(data.items, data.counts)
    if (!silent) notify(`Message marqué « ${STATUS[status].label} ».`)
    // Le message ne correspond plus à l'onglet affiché : on recharge la liste
    if (!silent && !matchesTab(data.items[0])) await load({ quiet: true })
  } catch (e) {
    handle(e)
  } finally {
    busyId.value = null
  }
}

async function toggle(message) {
  if (openId.value === message.id) {
    openId.value = null
  } else {
    openId.value = message.id
    noteDrafts[message.id] ??= message.note
    // Ouvrir un nouveau message le marque comme lu, sans recharger la liste (il reste affiché là où il est)
    if (message.status === 'new') setStatus(message, 'read', { silent: true })
  }
}

async function saveNote(message) {
  busyId.value = message.id
  try {
    const data = await adminApi.update([message.id], { note: noteDrafts[message.id] ?? '' })
    replaceItems(data.items)
    noteDrafts[message.id] = data.items[0].note
    notify('Note enregistrée.')
  } catch (e) {
    handle(e)
  } finally {
    busyId.value = null
  }
}

async function remove(message) {
  if (!window.confirm(`Supprimer définitivement le message de ${message.name} ? Cette action est irréversible.`)) return
  busyId.value = message.id
  try {
    const data = await adminApi.remove([message.id])
    inbox.newCount = data.counts.new
    delete noteDrafts[message.id]
    notify('Message supprimé.')
    await load({ quiet: true })
  } catch (e) {
    handle(e)
  } finally {
    busyId.value = null
  }
}

/* ---------- Filtres ---------- */
let searchTimer
watch(
  () => [filters.status, filters.kind],
  () => {
    filters.page = 1
    openId.value = null
    load()
  },
)
watch(
  () => filters.q,
  () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      filters.page = 1
      load()
    }, 350)
  },
)
function goTo(page) {
  if (page < 1 || page > list.pages || page === filters.page) return
  filters.page = page
  openId.value = null
  load()
}

/* ---------- Actualisation au retour sur l'onglet ---------- */
const onVisible = () => {
  if (document.visibilityState === 'visible' && Date.now() - lastLoad > 30000) load({ quiet: true })
}
onMounted(() => {
  load()
  document.addEventListener('visibilitychange', onVisible)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisible)
  clearTimeout(searchTimer)
})
</script>

<template>
  <div class="adm-messages">
    <header class="adm-editor__head">
      <div>
        <h1>Messages</h1>
        <p class="adm-muted">Messages et demandes de projet envoyés depuis le formulaire de contact du site.</p>
      </div>
    </header>

    <!-- Chiffres clés -->
    <div class="adm-stats">
      <div v-for="s in stats" :key="s.label" class="adm-stat" :class="{ 'is-accent': s.accent && s.value > 0 }">
        <i :class="s.icon"></i>
        <div>
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="adm-toolbar">
      <div class="adm-tabs" role="tablist" aria-label="Filtrer par statut">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          type="button"
          role="tab"
          class="adm-tab"
          :class="{ 'is-active': filters.status === tab.key }"
          :aria-selected="filters.status === tab.key"
          @click="filters.status = tab.key"
        >
          {{ tab.label }}
          <small>{{ list.counts[tab.key] }}</small>
        </button>
      </div>
      <div class="adm-toolbar__right">
        <select v-model="filters.kind" class="adm-select" aria-label="Type de message">
          <option value="">Tous les types</option>
          <option value="demande">Demandes de projet</option>
          <option value="contact">Messages de contact</option>
        </select>
        <label class="adm-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input v-model="filters.q" type="search" placeholder="Rechercher un nom, un email, un mot…" aria-label="Rechercher" />
        </label>
        <button type="button" class="adm-btn" :disabled="list.loading" title="Actualiser" @click="load()">
          <i class="fa-solid fa-rotate" :class="{ 'fa-spin': list.loading }"></i><span class="adm-hide-sm">Actualiser</span>
        </button>
        <a :href="exportUrl" class="adm-btn" :class="{ 'is-disabled': !list.total }" download>
          <i class="fa-solid fa-file-arrow-down"></i><span class="adm-hide-sm">Exporter (CSV)</span>
        </a>
      </div>
    </div>

    <!-- Liste -->
    <p v-if="list.error" class="adm-alert is-error" role="alert">
      {{ list.error }}
      <button type="button" class="adm-link" @click="load()">Réessayer</button>
    </p>

    <div v-else-if="!list.loaded" class="adm-empty"><i class="fa-solid fa-spinner fa-spin"></i> Chargement des messages…</div>

    <div v-else-if="!list.items.length" class="adm-empty">
      <i class="fa-regular fa-envelope-open"></i>
      <p v-if="activeFilters.q || activeFilters.kind">Aucun message ne correspond à ces filtres.</p>
      <p v-else-if="filters.status === 'active'">Aucun message pour le moment. Ils apparaîtront ici dès qu'un visiteur utilisera le formulaire de contact.</p>
      <p v-else>Aucun message dans cette catégorie.</p>
    </div>

    <ul v-else class="adm-list" :class="{ 'is-loading': list.loading }">
      <li
        v-for="m in list.items"
        :key="m.id"
        class="adm-msg"
        :class="[`is-${m.status}`, { 'is-open': openId === m.id }]"
      >
        <button type="button" class="adm-msg__head" :aria-expanded="openId === m.id" @click="toggle(m)">
          <span class="adm-msg__dot" :title="STATUS[m.status].label"></span>
          <span class="adm-msg__who">
            <strong>{{ m.name }}</strong>
            <em>{{ m.email }}</em>
          </span>
          <span class="adm-msg__summary">
            <span class="adm-badge" :class="`is-${m.kind}`">{{ KIND[m.kind] }}</span>
            <span v-if="m.status !== 'new'" class="adm-badge is-status">{{ STATUS[m.status].label }}</span>
            <span class="adm-msg__excerpt">{{ excerpt(m.message) }}</span>
          </span>
          <time class="adm-msg__date" :datetime="m.created_at">{{ formatDate(m.created_at) }}</time>
          <i class="fa-solid fa-chevron-down adm-msg__chevron"></i>
        </button>

        <div v-if="openId === m.id" class="adm-msg__body">
          <div class="adm-msg__main">
            <div v-if="m.services.length" class="adm-msg__services">
              <span>Type de projet</span>
              <b v-for="s in m.services" :key="s">{{ s }}</b>
            </div>
            <p class="adm-msg__text">{{ m.message }}</p>
            <div class="adm-actions">
              <a :href="replyLink(m)" class="adm-btn adm-btn--primary"><i class="fa-regular fa-envelope"></i>Répondre par email</a>
              <a v-if="whatsappLink(m)" :href="whatsappLink(m)" target="_blank" rel="noopener" class="adm-btn">
                <i class="fa-brands fa-whatsapp"></i>WhatsApp
              </a>
              <a v-if="m.whatsapp" :href="`tel:${m.whatsapp.replace(/[^\d+]/g, '')}`" class="adm-btn">
                <i class="fa-solid fa-phone"></i>{{ m.whatsapp }}
              </a>
            </div>
          </div>

          <aside class="adm-msg__side">
            <div class="adm-side-block">
              <span class="adm-label">Statut</span>
              <div class="adm-status">
                <button
                  v-for="(s, key) in STATUS"
                  :key="key"
                  type="button"
                  class="adm-chip"
                  :class="{ 'is-active': m.status === key }"
                  :aria-pressed="m.status === key"
                  :disabled="busyId === m.id"
                  @click="setStatus(m, key)"
                >
                  <i :class="s.icon"></i>{{ s.label }}
                </button>
              </div>
            </div>

            <label class="adm-side-block adm-field">
              <span class="adm-label">Note interne</span>
              <textarea
                v-model="noteDrafts[m.id]"
                rows="3"
                maxlength="5000"
                placeholder="Visible uniquement dans l'administration"
              ></textarea>
            </label>
            <div class="adm-actions adm-actions--between">
              <button
                type="button"
                class="adm-btn"
                :disabled="busyId === m.id || (noteDrafts[m.id] ?? '') === m.note"
                @click="saveNote(m)"
              >
                Enregistrer la note
              </button>
              <button type="button" class="adm-btn adm-btn--danger" :disabled="busyId === m.id" @click="remove(m)">
                <i class="fa-regular fa-trash-can"></i>Supprimer
              </button>
            </div>
            <p class="adm-muted adm-msg__meta">Message n° {{ m.id }} · reçu le {{ formatDate(m.created_at) }}</p>
          </aside>
        </div>
      </li>
    </ul>

    <!-- Pagination -->
    <nav v-if="list.pages > 1" class="adm-pager" aria-label="Pagination">
      <button type="button" class="adm-btn" :disabled="filters.page <= 1" @click="goTo(filters.page - 1)">
        <i class="fa-regular fa-arrow-left"></i>Précédent
      </button>
      <span>Page {{ filters.page }} sur {{ list.pages }} · {{ list.total }} messages</span>
      <button type="button" class="adm-btn" :disabled="filters.page >= list.pages" @click="goTo(filters.page + 1)">
        Suivant<i class="fa-regular fa-arrow-right"></i>
      </button>
    </nav>
  </div>
</template>
