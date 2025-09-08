import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: process.env.NODE_ENV === 'production' ? '/ecotrack-ai/' : './',
  build: {
    outDir: 'dist'
  }
})