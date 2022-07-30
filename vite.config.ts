import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    host: '127.0.0.1',
    open: true,
    port: 3000,
    https: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/scss/var.scss";'
      }
    }
  }
})
