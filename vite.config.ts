import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Root base path for web and Vercel deployments.
  base: '/',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, strictPort: true },
})
