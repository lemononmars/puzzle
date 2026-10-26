import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
// Separate optimizer output for concurrent preview ports and production/check runs.
const portIndex = process.argv.indexOf('--port');
const requestedPort = process.argv.find(arg => arg.startsWith('--port='))?.slice(7)
	?? (portIndex >= 0 ? process.argv[portIndex + 1] : undefined)
	?? process.env.npm_config_port
	?? '5173';
const cachePort = /^\d{1,5}$/.test(requestedPort) ? requestedPort : '5173';
export default defineConfig(async ({ command }) => ({
	cacheDir: command === 'serve' ? `node_modules/.vite/dev-${cachePort}` : 'node_modules/.vite/build',
	server: { port: 5173, strictPort: true },
	optimizeDeps: { exclude: ['@lucide/svelte'] },
	plugins: [
		tailwindcss(),
		sveltekit({
			// Deployment adapters are only needed by the production build.
			adapter: command === 'build'
				? (await import(process.env.VERCEL ? '@sveltejs/adapter-vercel' : '@sveltejs/adapter-node')).default()
				: undefined,
			extensions: ['.svelte', '.svx', '.md'],
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] }), vitePreprocess()],
			compilerOptions: { compatibility: { componentApi: 4 } }
		})
	],
	worker: { format: 'es' },
	build: { chunkSizeWarningLimit: 500 },
}));
