<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { navigation } from '@/data/portfolio'
import { content, links, socials } from '@/content'
import { useNavigation } from './navigation'
import SiteLogo from './SiteLogo.vue'

const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['update:open'])
const close = () => emit('update:open', false)
const { childrenOf } = useNavigation(useRoute())

const onKey = (e) => {
  if (e.key === 'Escape') close()
}
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
)
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="fix-area">
    <div class="offcanvas__info" :class="{ 'info-open': open }" :aria-hidden="!open">
      <div class="offcanvas__wrapper">
        <div class="offcanvas__content">
          <div class="offcanvas__top d-flex justify-content-between align-items-center">
            <div class="offcanvas__logo">
              <router-link to="/" @click="close"><SiteLogo light /></router-link>
            </div>
            <div class="offcanvas__close">
              <button type="button" aria-label="Fermer le menu" @click="close">
                <i class="fa-thin fa-times"></i>
              </button>
            </div>
          </div>
          <p class="text d-none d-xl-block">{{ content.profile.intro }}</p>

          <div class="mobile-menu fix">
            <div class="mean-container">
              <div class="mean-bar">
                <nav class="mean-nav" aria-label="Navigation mobile">
                  <ul>
                    <li v-for="item in navigation" :key="item.to">
                      <router-link :to="item.to" @click="close">{{ item.label }}</router-link>
                      <ul v-if="item.children" class="mobile-submenu">
                        <li v-for="child in childrenOf(item)" :key="child.to">
                          <router-link :to="child.to" @click="close">
                            <em v-if="child.number">{{ child.number }}</em>{{ child.label }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div class="off-contact-info">
            <span class="info-title">Contact</span>
            <div v-if="content.profile.phone" class="contact-details">
              <span class="sub-info">Téléphone / WhatsApp</span>
              <p><a :href="links.phone">{{ content.profile.phone }}</a></p>
            </div>
            <div v-if="content.profile.email" class="contact-details">
              <span class="sub-info">Email</span>
              <p><a :href="links.email">{{ content.profile.email }}</a></p>
            </div>
            <div class="contact-details">
              <span class="sub-info">Localisation</span>
              <p>{{ content.profile.location }}</p>
            </div>
          </div>
        </div>
        <div class="social-icon-list">
          <span class="follow-title">Suivez-moi :</span>
          <div class="social-icon d-flex align-items-center">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.url"
              :aria-label="s.label"
              target="_blank"
              rel="noopener"
            >
              <i :class="s.icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="offcanvas__overlay" :class="{ 'overlay-open': open }" @click="close"></div>
</template>
