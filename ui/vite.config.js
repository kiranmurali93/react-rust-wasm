import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Ensure WASM is handled correctly
    exclude: ['calculator'],
  },
  worker: {
    format: 'es',
  },
  // Add WASM support
  assetsInclude: ['**/*.wasm'],
  resolve: {
    alias: {
      '@calculator': path.resolve(__dirname, '/pkg/calculator/')
    }
  }
});