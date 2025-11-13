import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  css: {
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  preview: {
    port: 4173,
    strictPort: true,
    open: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
})
