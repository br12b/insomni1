import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5200, 
    open: true,
    proxy: {
      '/tefas-api': {
        target: 'https://www.tefas.gov.tr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tefas-api/, '')
      }
    }
  }
})
