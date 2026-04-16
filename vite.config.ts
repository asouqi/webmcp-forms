import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                'react/index': resolve(__dirname, 'src/react/index.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
        },
        rollupOptions: {
            external: ['react', 'webmcp-adapter'],
            output: {
                preserveModules: false,
            },
        },
    },
    plugins: [
        dts({
            include: ['src/**/*'],
            outDir: 'dist',
        }),
    ],
});