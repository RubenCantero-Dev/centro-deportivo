import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/centro-deportivo/', // Esta línea es crucial para GitHub Pages
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist', // Especifica la carpeta de construcción
    emptyOutDir: true // Limpia la carpeta antes de cada build
  }
})