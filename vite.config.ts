import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Root base path for web and Vercel deployments.
  base: '/',
  // A fresh URL for each build prevents browsers retaining an older video file.
  define: {
    'import.meta.env.VITE_MEDIA_VERSION': JSON.stringify(Date.now().toString(36)),
  },
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, strictPort: true },
})
