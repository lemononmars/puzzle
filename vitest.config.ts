import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss(), svelte({ configFile: false, compilerOptions: { compatibility: { componentApi: 4 } } })],
    resolve: {
        alias: {
            '#lib': path.resolve(import.meta.dirname, './src/lib')
        }
    },
    environments: { client: { resolve: { conditions: ['browser'] } } },
    test: {
        maxWorkers: 2,
        include: ['src/**/*.{test,spec}.{js,ts}'],
        setupFiles: ['./vitest.setup.ts']
    }
});
