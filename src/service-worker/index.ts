/// <reference types="@sveltejs/kit" />
import { version } from '$app/env';
import { immutable, assets } from '$app/manifest';
import { asset } from '$app/paths';

const CACHE_NAME = `puzzle-v${version}`;

// Precache only the shell. Route chunks, dictionaries, workers, and puzzle
// images are cached when requested, so an unrelated visit stays lightweight.
const immutablePaths=immutable.map(({path})=>path);
const staticPaths=assets.map(({path})=>asset(path));
const PRECACHE_ASSETS=[
 ...immutablePaths.filter(path=>path.includes('/entry/')||path.endsWith('.css')),
 ...staticPaths.filter(path=>['/favicon.svg','/favicon.png','/manifest.webmanifest','/icons/apple-touch-icon.png'].includes(path))
];
const ASSET_SET=new Set([...immutablePaths,...staticPaths]);

self.addEventListener('install', (event: any) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_ASSETS))
			.then(() => (self as any).skipWaiting())
	);
});

self.addEventListener('activate', (event: any) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== CACHE_NAME) {
					await caches.delete(key);
				}
			}
			await (self as any).clients.claim();
		})
	);
});

self.addEventListener('fetch', (event: any) => {
	const request = event.request;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
 if(url.origin!==self.location.origin)return;

	// Bypass dynamic API, auth, supabase realtime, and dev hot-module-reloading
	if (
		url.pathname.startsWith('/api/') ||
		url.pathname === '/board-games' ||
		url.pathname.startsWith('/board-games/') ||
		url.pathname.startsWith('/auth/') ||
		url.hostname.includes('supabase') ||
		url.pathname.startsWith('/__vite_ping') ||
		url.protocol === 'ws:' ||
		url.protocol === 'wss:'
	) {
		return;
	}

	// 1. Static build assets: Cache First
	if (ASSET_SET.has(url.pathname)) {
		event.respondWith(
			caches.match(request).then((cached) => {
				if (cached) return cached;
				return fetch(request).then((response) => {
					if (response.status === 200) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
					}
					return response;
				});
			})
		);
		return;
	}

	// 2. Navigation / Page Requests: Network First with Cache Fallback
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.status === 200) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
					}
					return response;
				})
				.catch(async () => {
					const cached = await caches.match(request);
					if (cached) return cached;
					const fallback = await caches.match('/');
					if (fallback) return fallback;
					return new Response('คุณกำลังออฟไลน์ (Offline Mode)', {
						headers: { 'Content-Type': 'text/html; charset=utf-8' }
					});
				})
		);
		return;
	}

	// 3. Other GET requests (Images, data, fonts): Stale-While-Revalidate
	event.respondWith(
		caches.match(request).then((cached) => {
			const networkFetch = fetch(request)
				.then((response) => {
					if (response.status === 200) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
					}
					return response;
				})
				.catch(() => cached || new Response('Offline resource unavailable', { status: 503 }));

			return cached || networkFetch;
		})
	);
});
