import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// The app is served from https://alexg0dev.github.io/vue-flashcards/
export default defineConfig({
  base: '/vue-flashcards/',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
  },
})
