import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/forms': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/finance': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/hr': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/customers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/marketing': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/workshop/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/projects': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/logistics': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  }
})
