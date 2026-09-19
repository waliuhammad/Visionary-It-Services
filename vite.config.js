import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Site is served from the domain root on Hostinger (public_html)
  base: '/',
  server: {
    port: 5173,
    // Local development: forward API calls to the backend so cookies stay same-origin
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rolldownOptions: {
      output: {
        // Split large vendor libraries into their own cacheable files
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'firebase', test: /node_modules[\\/]@?firebase/ },
            { name: 'charts', test: /node_modules[\\/](chart\.js|react-chartjs-2)/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)/ },
          ],
        },
      },
    },
  },
})
