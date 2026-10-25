// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Базовый путь для корректной работы роутинга на статическом хостинге
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Гарантирует, что Vite корректно обрабатывает SPA-маршруты при сборке
    emptyOutDir: true,
  },
});
