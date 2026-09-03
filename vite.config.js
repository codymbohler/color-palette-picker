import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/color-palette-picker/',
  plugins: [react(), tailwindcss()],
})
