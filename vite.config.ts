import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase vendor bundle
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // UI library bundle
          'ui-vendor': ['lucide-react', 'sonner', 'react-hook-form', '@hookform/resolvers', 'zod'],
          // Date utilities bundle
          'date-vendor': ['date-fns'],
        },
      },
    },
  },
});
