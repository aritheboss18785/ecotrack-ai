  base: '/ecotrack-ai/', // For GitHub Pages compatibility
>>>>>>> c30709ce98605b1239c1b6f184e8a32fa15cd879
  build: {
    outDir: 'dist'
  }
})
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
=======
  base: '/ecotrack-ai/', // For GitHub Pages compatibility
>>>>>>> c30709ce98605b1239c1b6f184e8a32fa15cd879
  build: {
    outDir: 'dist'
  }
})
