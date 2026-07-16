import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: { manualChunks: { data: ['src/data/enemies', 'src/data/items', 'src/data/events'] } }
    }
  }
})
