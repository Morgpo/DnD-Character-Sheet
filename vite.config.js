import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths, so the build works under GitHub Pages' /DnD-Character-Sheet/
  // subpath (see .github/workflows/deploy.yml) without hardcoding the repo name.
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true
  }
})
