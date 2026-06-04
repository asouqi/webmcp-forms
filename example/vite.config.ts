import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'

    return {
        plugins: [react()],
        base: '/webmcp-forms/',
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false,
        },
        resolve: {
            alias: isDev
                ? [
                    { find: 'webmcp-forms', replacement: resolve(__dirname, '../src/index.ts') },
                    { find: 'webmcp-adapter', replacement: resolve(__dirname, '../../webmcp-adapter/src/index.ts') },
                    { find: 'webmcp-adapter-react', replacement: resolve(__dirname, '../../webmcp-adapter-react/src/index.ts') },
                ]
                : [],
        },
    }
})