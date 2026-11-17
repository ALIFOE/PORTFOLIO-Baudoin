import { fileURLToPath, URL } from 'node:url'
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// L'API (public/api, en PHP) tourne en local sur ce port ; Vite lui transmet les appels /api.
const API_PORT = Number(process.env.API_PORT) || 8088

/**
 * Lance le serveur PHP intégré en même temps que « npm run dev » / « npm run preview »,
 * pour que le formulaire de contact et l'administration fonctionnent en local.
 * (En production, c'est le serveur web de l'hébergeur qui exécute public/api.)
 */
function phpApi() {
  const start = (logger) => {
    // Conservé d'un redémarrage de Vite à l'autre : un seul serveur PHP par processus
    if (globalThis.__portfolioPhpApi) return
    // Limites larges pour pouvoir envoyer des vidéos depuis l'admin en local
    const limits = ['-d', 'upload_max_filesize=1024M', '-d', 'post_max_size=1100M', '-d', 'memory_limit=512M']
    const child = spawn(process.env.PHP_BIN || 'php', [...limits, '-S', `127.0.0.1:${API_PORT}`, '-t', 'public'], {
      cwd: fileURLToPath(new URL('.', import.meta.url)),
      stdio: ['ignore', 'ignore', 'pipe'],
      windowsHide: true,
    })
    globalThis.__portfolioPhpApi = child
    const forget = () => {
      if (globalThis.__portfolioPhpApi === child) globalThis.__portfolioPhpApi = null
    }
    child.on('error', () => {
      forget()
      logger.warn(
        "[api] PHP introuvable : le formulaire de contact et l'admin ne fonctionneront pas en local. " +
          'Installez PHP ou indiquez son chemin dans la variable PHP_BIN.',
      )
    })
    child.on('exit', forget)
    child.stderr.on('data', (chunk) => {
      const text = String(chunk)
      // Port déjà utilisé = une autre instance sert déjà l'API : rien à signaler
      if (/Failed to listen/i.test(text)) return
      if (/PHP (Warning|Fatal|Parse|Deprecated|Notice)|\[portfolio-api\]/i.test(text)) logger.warn(`[api] ${text.trim()}`)
    })
    process.once('exit', () => child.kill())
    logger.info(`  ➜  API PHP : http://127.0.0.1:${API_PORT}/api/ (via /api)`)
  }
  return {
    name: 'portfolio-php-api',
    apply: 'serve',
    configureServer: (server) => start(server.config.logger),
    configurePreviewServer: (server) => start(server.config.logger),
  }
}

/**
 * Les fichiers envoyés depuis l'admin en local (public/uploads) ne doivent jamais partir
 * dans dist/ : ils écraseraient ceux du serveur lors d'une mise en ligne.
 */
function keepUploadsOutOfBuild() {
  let outDir = 'dist'
  return {
    name: 'portfolio-no-uploads',
    apply: 'build',
    configResolved: (config) => {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle: () => rmSync(resolve(outDir, 'uploads'), { recursive: true, force: true }),
  }
}

// base: './' → le build fonctionne dans n'importe quel dossier
// (hébergement mutualisé, sous-dossier, etc.)
// Le routeur utilise le mode "hash" (#/projets) pour ne jamais produire de 404.
export default defineConfig({
  base: './',
  plugins: [vue(), phpApi(), keepUploadsOutOfBuild()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': `http://127.0.0.1:${API_PORT}`,
    },
  },
  // npm run preview sert dist/ : les fichiers envoyés (public/uploads) viennent du serveur PHP
  preview: {
    proxy: {
      '/api': `http://127.0.0.1:${API_PORT}`,
      '/uploads': `http://127.0.0.1:${API_PORT}`,
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
})
