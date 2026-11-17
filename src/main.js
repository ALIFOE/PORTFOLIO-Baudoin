import { createApp } from 'vue'

// Styles du template Devix (convertis tels quels) + ajustements du portfolio
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/all.min.css'
import '@/assets/css/animate.css'
import '@/assets/css/icomoon.css'
import '@/assets/css/main.css'
import '@/assets/css/portfolio.css'
import '@/assets/css/domains.css'

import App from './App.vue'
import router from './router'
import motion from './motion'
import { loadContent } from './content'

// Le contenu modifié dans l'admin est chargé avant le premier affichage
// (sinon le site s'affiche avec son contenu par défaut, au plus tard après 4 s).
loadContent().finally(() => {
  createApp(App).use(router).use(motion).mount('#app')
})
