import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),svgLoader()],
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  resolve: {
    extensions:['.ts','.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
