import { copyFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Dev stays at /. Production project Pages use /GiveMeTech/. */
const base = process.env.VITE_BASE_PATH ?? '/'

/** GitHub Pages serves 404.html for unknown paths, which keeps client routes working on refresh. */
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
        },
      },
    },
  },
})
