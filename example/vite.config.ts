import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'webmcp-forms', replacement: resolve(__dirname, '../src/index.ts') },
      { find: 'webmcp-adapter', replacement: resolve(__dirname, '../../webmcp-adapter/src/index.ts') },
      { find: 'webmcp-adapter-react', replacement: resolve(__dirname, '../../webmcp-adapter-react/src/index.ts') },
    ],
  },
})
