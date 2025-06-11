import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared-components/src'),
      '@features': path.resolve(__dirname, '../new-features'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
})
