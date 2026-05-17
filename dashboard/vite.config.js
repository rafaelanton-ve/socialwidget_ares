import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'

function copyWidget() {
  return {
    name: 'copy-widget',
    closeBundle() {
      const distWidget = './dist/widget'
      if (!existsSync(distWidget)) {
        mkdirSync(distWidget, { recursive: true })
      }
      copyFileSync('./public/widget/widget.min.js', './dist/widget/widget.min.js')
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyWidget()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true
  }
})