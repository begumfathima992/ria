import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset paths keep the production build portable on cPanel and
  // other static hosts, including deployment inside a subdirectory.
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
