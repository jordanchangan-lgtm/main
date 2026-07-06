import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  assetsInclude: ['**/*.PNG','**/*.JPG','**/*.JPEG','**/*.GIF','**/*.WEBP'],
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 100000,
    rollupOptions: { input: 'preview.html' },
  },
});
