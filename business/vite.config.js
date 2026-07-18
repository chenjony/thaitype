import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        portal: resolve(import.meta.dirname, 'portal.html'),
        assessment: resolve(import.meta.dirname, 'assessment.html')
      }
    }
  }
})
