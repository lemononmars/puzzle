import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: process.env.VERCEL ? vercel() : node(),
			extensions: ['.svelte', '.svx', '.md'],
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] }), vitePreprocess()],
			compilerOptions: { compatibility: { componentApi: 4 } }
		})
	],
	build: { chunkSizeWarningLimit: 18000 },
});
