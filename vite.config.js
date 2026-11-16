import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' → le build fonctionne dans n'importe quel dossier
// (sous-dossier GitHub Pages, hébergement mutualisé, etc.)
// Le routeur utilise le mode "hash" (#/projets) pour ne jamais produire de 404.
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
})
