// @ts-nocheck -- Imported SNOWBOARD JavaScript; preserve the existing runtime model.
import { createClient } from '@supabase/supabase-js';
export const boardgameConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || 'https://unconfigured.supabase.co', import.meta.env.VITE_SUPABASE_ANON_KEY || 'unconfigured');
