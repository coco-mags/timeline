import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    strictPort: true,        // fail fast rather than silently picking a new port
    open: false,
    watch: {
      // Don't trigger reloads for build output, tests, or editor temp files
      ignored: ['**/dist/**', '**/node_modules/**', '**/.git/**', '**/*.swp'],
    },
  },
})
