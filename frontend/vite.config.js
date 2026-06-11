import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Tell Vite to stop warning you for chunks under 3MB
    chunkSizeWarningLimit: 3000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          // If the module originates from monaco or y-monaco, split it out
          if (
            id.includes('monaco-editor') || 
            id.includes('@monaco-editor/react') || 
            id.includes('y-monaco')
          ) {
            return 'monaco-vendor';
          }
        },
      },
    },
  },
})