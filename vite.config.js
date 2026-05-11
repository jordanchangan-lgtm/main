import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the Mallouk Group landing page.
// GitHub Pages serves the built `dist/` directory verbatim, so the `base`
// stays at "/" — the repo is published as a project page from a custom
// branch via the pages.yml workflow.
export default defineConfig({
  plugins: [react()],
  // Treat upper-case .PNG and .JPEG (as well as the default lower-case forms)
  // as asset imports — Vite's default glob only catches lower-case extensions.
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.GIF', '**/*.WEBP'],
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
});
