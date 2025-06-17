import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Adjust to your backend server port
        changeOrigin: true,
      },
      '/india-states.json': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
  
})
