import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/kiuchi_quest/',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 8192
  }
})
