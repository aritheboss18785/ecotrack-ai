import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/ecotrack-ai/', // For GitHub Pages compatibility
  build: {
    outDir: 'dist'
  }
})
