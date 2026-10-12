import { createClient } from '@supabase/supabase-js';

type SupaStorageBucket = 'puzzles' | 'assets' | 'hiddenlink';
const DIR_IMAGE = 'https://ojjggolcfmjnovmipaav.supabase.in/storage/v1/object/';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl =
	typeof rawUrl === 'string' && rawUrl.length > 0 && rawUrl !== 'undefined'
		? rawUrl
		: 'https://ojjggolcfmjnovmipaav.supabase.co';

const supabaseKey =
	typeof rawKey === 'string' && rawKey.length > 0 && rawKey !== 'undefined'
		? rawKey
		: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
	auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

/**
 * Convenience re-exports for typed selections
 *
 */
export const storage = supabaseClient.storage;

/**
 *
 * @param table The Supabase table to act upon
 * @returns {data, error}
 */
export const from = (table: string) => supabaseClient.from(table);
/**
 *
 * @param bucket The Supabase storage bucket to act upon
 * @returns url
 */
export const fromBucket = (bucket: SupaStorageBucket) => supabaseClient.storage.from(bucket);

export function getImageURL(type: SupaStorageBucket, url: string) {
	try {
		return fromBucket(type).getPublicUrl(url).data?.publicUrl;
	} catch {
		return undefined;
	}
}

export function getPuzzleImageURL(type: string, filename: string) {
	return getImageURL('puzzles', type + '/' + filename);
}

export function getHiddenLinkImageURL(filename: string) {
	return `/puzzles/hiddenlink/${filename}`;
}
