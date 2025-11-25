import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
<<<<<<< HEAD
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          return tag.startsWith('el-')
        }
      }
    }
  }),svgLoader()],
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
=======

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
>>>>>>> origin/tya
  resolve: {
    extensions:['.ts','.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
