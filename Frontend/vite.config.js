import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
  

  server: {
    host: true,  // Allows access from local network (192.168.x.x)
    port: 3000,  // Change port if needed
    open: true,  // Automatically opens in the browser
  },
})
