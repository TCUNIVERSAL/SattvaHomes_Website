import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Builds the site with every image and font inlined, so it can be packed into one shareable HTML file.
export default defineConfig({
  base: './',
  define: {
    'import.meta.env.VITE_MEDIA_VERSION': JSON.stringify(Date.now().toString(36)),
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
  },
})
