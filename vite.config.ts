import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Exclude api folder - it's for Vercel serverless, not Vite
      ignored: [path.resolve(__dirname, 'api/**')],
    },
  },
  optimizeDeps: {
    // Don't process api folder
    exclude: ['api'],
  },
})
