import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base './' ensures built assets work both at root and within a subfolder like /mes/ or /app/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../mes',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
});
