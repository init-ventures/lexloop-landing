import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Exclude functions folder - it's for Cloudflare Pages Functions, not Vite
      ignored: [path.resolve(__dirname, 'functions/**')],
    },
  },
  optimizeDeps: {
    // Don't process functions folder
    exclude: ['functions'],
  },
})
