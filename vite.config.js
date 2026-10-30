import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacidade: resolve(__dirname, 'privacidade/index.html'),
        termos: resolve(__dirname, 'termos/index.html'),
        confirmada: resolve(__dirname, 'pre-reserva-confirmada/index.html'),
        passa: resolve(__dirname, 'passa-a-clara/index.html'),
      },
    },
  },
  test: { include: ['testes/**/*.test.js'] },
})
