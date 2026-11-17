<script setup>
import footerShape from '@/assets/img/template/footer-shape.png'
import { navigation } from '@/data/portfolio'
import { content, links, socials } from '@/content'
import { scrollToTop } from '@/motion'

const year = new Date().getFullYear()
const pages = navigation.filter((n) => n.to !== '/')
</script>

<template>
  <footer class="footer-section fix pb-0">
    <div class="footer-shape">
      <img :src="footerShape" alt="" />
    </div>
    <div class="container">
      <div class="footer-widget-wrapper">
        <div class="row justify-content-between">
          <div v-anim="'.3s'" class="col-xxl-2 col-xl-2 col-lg-6 col-md-5">
            <div class="footer-widget-items">
              <div class="widget-head">
                <h3>Navigation</h3>
              </div>
              <ul class="list-area">
                <li v-for="item in pages" :key="item.to">
                  <router-link :to="item.to">
                    <i class="icon-footer-arrow"></i>
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <div v-anim="'.5s'" class="col-xxl-4 col-xl-5 col-lg-6 col-md-7">
            <div class="footer-widget-items">
              <div class="widget-head">
                <h3>Mes domaines</h3>
              </div>
              <ul class="footer-domains">
                <li v-for="(d, i) in content.domains" :key="d.slug">
                  <router-link :to="`/realisations/${d.slug}`">
                    <em>{{ String(i + 1).padStart(2, '0') }}</em>{{ d.title }}
                  </router-link>
                </li>
              </ul>
              <div class="social-list mt-4">
                <div class="social-icon-area mb-0">
                  <a
                    v-for="s in socials"
                    :key="s.label"
                    :href="s.url"
                    target="_blank"
                    rel="noopener"
                    class="social-icon"
                  >
                    <i :class="s.icon"></i>
                    {{ s.label }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-anim="'.7s'" class="col-xxl-4 col-xl-5 col-lg-6">
            <div class="footer-widget-items">
              <div class="widget-head">
                <h3>Contact direct</h3>
              </div>
              <ul class="footer-contact">
                <li><i class="fa-solid fa-location-dot"></i>{{ content.profile.location }}</li>
                <li v-if="content.profile.phone">
                  <i class="fa-solid fa-phone"></i><a :href="links.phone">{{ content.profile.phone }}</a>
                </li>
                <li v-if="content.profile.email">
                  <i class="fa-regular fa-envelope"></i><a :href="links.email">{{ content.profile.email }}</a>
                </li>
              </ul>
              <div class="footer-button mt-4">
                <router-link to="/contact" class="theme-btn">Démarrer un projet</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom-wrapper">
        <p>© {{ year }} {{ content.profile.fullName }} — Tous droits réservés.</p>
        <button type="button" class="theme-btn" @click="scrollToTop()">Retour en haut</button>
      </div>
    </div>
  </footer>
</template>
