import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        // In development, proxy to Vercel serverless functions
        target: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback to direct API calls in production
          if (process.env.NODE_ENV === 'production') {
            return false;
          }
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          charts: ['chart.js']
        }
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false
  }
})
