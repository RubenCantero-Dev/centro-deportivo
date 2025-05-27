import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/centro-deportivo/',
  server: {
    port: 3000,
    open: true,
    strictPort: true // Evita que Vite cambie el puerto si 3000 está ocupado
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets', // Organiza mejor los recursos estáticos
    sourcemap: false, // Mejor rendimiento en producción
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  preview: {
    port: 3000 // Mismo puerto para el preview
  }


});