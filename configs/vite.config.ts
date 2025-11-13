import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
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
      proxy: {
        // Proxy API requests to the backend server
        // This helps bypass CORS issues during development
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3002',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
