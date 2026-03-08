import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const frontendRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  root: frontendRoot,
  plugins: [react()],
  base: '/',
  cacheDir: fileURLToPath(new URL('./node_modules/.vite', import.meta.url)),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
    holdUntilCrawlEnd: false,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    open: true,
  },
})
