import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'elite_shine_logo.png'],
      manifest: {
        name: 'Elite Shine ERP',
        short_name: 'EliteShine',
        description: 'Elite Shine Group of Companies ERP System',
        theme_color: '#0a0c10',
        background_color: '#0a0c10',
        display: 'standalone',
        icons: [
          {
            src: 'elite_shine_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'elite_shine_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
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
