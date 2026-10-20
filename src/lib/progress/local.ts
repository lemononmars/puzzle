import { writable } from 'svelte/store';
export type SavedEntry = {
	path: string;
	title: string;
	favorite: boolean;
	note: string;
	status: 'saved' | 'in-progress' | 'solved';
	updatedAt: number;
};
export const library = writable<SavedEntry[]>([]);
export const storageMessage = writable('');
const libraryKey = 'puzzle-library:v1';
const gamePrefix = 'puzzle-save:v1:';
let entries: SavedEntry[] = [];
let initialized = false;
let savingEnabled = true;
const localPath = (value: unknown): value is string =>
	typeof value === 'string' &&
	/^\/(puzzles|tools|resources)(\/[^?#\s]*)?$/.test(value) &&
	!value.includes('..') &&
	value.length < 300;
const owned = (key: string) =>
	key === libraryKey ||
	key.startsWith(gamePrefix) ||
	key.startsWith('puzzle-answer-history:') ||
	key.startsWith('puzzle-answer-draft:') ||
	['mathdle-attempts', 'tbs2021-letter-marks'].includes(key);
function read(key: string) {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
	} catch {
		storageMessage.set('บันทึกลงเครื่องไม่ได้ / Local storage is unavailable.');
		return null;
	}
}
function write(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
		return true;
	} catch {
		storageMessage.set(
			'บันทึกลงเครื่องไม่ได้ ข้อมูลยังอยู่ในหน้านี้ / Could not save locally. Export a backup before leaving.'
		);
		return false;
	}
}
function validEntry(value: any): value is SavedEntry {
	return (
		value &&
		localPath(value.path) &&
		typeof value.title === 'string' &&
		value.title.length <= 160 &&
		typeof value.note === 'string' &&
		value.note.length <= 4000 &&
		typeof value.favorite === 'boolean' &&
		['saved', 'in-progress', 'solved'].includes(value.status) &&
		Number.isFinite(value.updatedAt)
	);
}
export function initializeLibrary() {
	if (initialized || typeof window === 'undefined') return;
	initialized = true;
	try {
		const saved = JSON.parse(read(libraryKey) ?? '[]');
		if (Array.isArray(saved)) entries = saved.filter(validEntry).slice(0, 200);
	} catch {}
	library.set(entries);
}
export function updateEntry(
	path: string,
	title: string,
	patch: Partial<Pick<SavedEntry, 'favorite' | 'note' | 'status'>>
) {
	if (!localPath(path) || typeof window === 'undefined') return;
	initializeLibrary();
	const previous = entries.find((item) => item.path === path);
	const item: SavedEntry = {
		path,
		title: title.slice(0, 160),
		favorite: false,
		note: '',
		status: 'saved',
		...previous,
		...patch,
		updatedAt: Date.now()
	};
	item.note = item.note.slice(0, 4000);
	entries = [item, ...entries.filter((entry) => entry.path !== path)].slice(0, 200);
	library.set(entries);
	write(libraryKey, JSON.stringify(entries));
}
export function saveGame(path: string, title: string, state: unknown, solved = false) {
	if (!savingEnabled || typeof window === 'undefined' || !localPath(path)) return;
	const serialized = JSON.stringify({ version: 1, state });
	if (serialized.length > 400000) return;
	if (write(gamePrefix + path, serialized))
		updateEntry(path, title, { status: solved ? 'solved' : 'in-progress' });
}
export function loadGame<T>(path: string): T | null {
	try {
		const parsed = JSON.parse(read(gamePrefix + path) ?? 'null');
		return parsed?.version === 1 ? (parsed.state as T) : null;
	} catch {
		return null;
	}
}
export function resetGame(path: string) {
	try {
		localStorage.removeItem(gamePrefix + path);
	} catch {}
	initializeLibrary();
	entries = entries.filter((item) => item.path !== path);
	library.set(entries);
	write(libraryKey, JSON.stringify(entries));
}
export function exportBackup() {
	const data: Record<string, string> = {};
	for (let index = 0; index < localStorage.length; index++) {
		const key = localStorage.key(index)!;
		if (owned(key)) data[key] = localStorage.getItem(key)!;
	}
	data[libraryKey] = JSON.stringify(entries);
	return JSON.stringify(
		{ format: 'puzzle-local-backup', version: 1, exportedAt: new Date().toISOString(), data },
		null,
		2
	);
}
export function importBackup(text: string) {
	if (text.length > 5000000) throw new Error('Backup is too large (maximum 5 MB).');
	const backup = JSON.parse(text);
	if (
		backup?.format !== 'puzzle-local-backup' ||
		backup.version !== 1 ||
		!backup.data ||
		typeof backup.data !== 'object' ||
		Array.isArray(backup.data)
	)
		throw new Error('This is not a supported Puzzle backup.');
	const pairs = Object.entries(backup.data);
	if (pairs.length > 1000) throw new Error('Too many backup records.');
	for (const [key, value] of pairs) {
		if (
			!owned(key) ||
			typeof value !== 'string' ||
			value.length > (key === libraryKey ? 1000000 : 400000)
		)
			throw new Error('Backup contains unsupported data.');
		if (key.startsWith(gamePrefix) && !localPath(key.slice(gamePrefix.length)))
			throw new Error('Invalid puzzle path.');
		if (key === libraryKey) {
			const list = JSON.parse(value);
			if (!Array.isArray(list) || list.length > 200 || !list.every(validEntry))
				throw new Error('Invalid library records.');
		} else JSON.parse(value);
	}
	for (const [key, value] of pairs)
		if (!write(key, value as string)) throw new Error('Not enough storage to restore this backup.');
	savingEnabled = false;
	storageMessage.set('Backup restored. Reload the page to resume and save progress.');
	initialized = false;
	initializeLibrary();
	return pairs.length;
}
export function resetAllProgress() {
	const keys = [];
	for (let index = 0; index < localStorage.length; index++) {
		const key = localStorage.key(index)!;
		if (owned(key)) keys.push(key);
	}
	for (const key of keys) localStorage.removeItem(key);
	savingEnabled = false;
	storageMessage.set('Progress cleared. Reload the page to start fresh and save again.');
	entries = [];
	initialized = false;
	library.set([]);
	initializeLibrary();
}
export function fingerprint(value: unknown) {
	const text = JSON.stringify(value) ?? '';
	let hash = 2166136261;
	for (let index = 0; index < text.length; index++) {
		hash ^= text.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(36);
}
