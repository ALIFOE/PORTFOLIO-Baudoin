import { createApp } from 'vue'

// Styles du template Devix (convertis tels quels) + ajustements du portfolio
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/all.min.css'
import '@/assets/css/animate.css'
import '@/assets/css/icomoon.css'
import '@/assets/css/main.css'
import '@/assets/css/portfolio.css'

import App from './App.vue'
import router from './router'
import motion from './motion'

createApp(App).use(router).use(motion).mount('#app')
