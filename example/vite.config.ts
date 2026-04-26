import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'webmcp-adapter', replacement: resolve(__dirname, '../../webmcp-adapter/src/index.ts') },
      { find: 'webmcp-forms/react', replacement: resolve(__dirname, '../src/react/index.ts') },
      { find: 'webmcp-forms', replacement: resolve(__dirname, '../src/index.ts') },
    ],
  },
})