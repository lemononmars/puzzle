// @ts-nocheck -- Imported SNOWBOARD JavaScript; preserve the existing runtime model.
import { writable } from 'svelte/store';
import socket from './socket';
export const persistStore = (key, initial) => {
 const { subscribe, set, update } = writable(initial);
 let initialized = false;
 return { subscribe, set, update, useLocalStorage: () => {
  if (initialized || typeof localStorage === 'undefined') return;
  initialized = true;
  try {
   const stored = JSON.parse(localStorage.getItem(key) || 'null');
   if (stored && typeof stored.userID === 'string' && typeof stored.username === 'string') set({ ...initial, ...stored });
  } catch { /* Use a fresh identity when storage is unavailable or malformed. */ }
  const unsubscribe = subscribe(value => {
   try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* In-memory play still works. */ }
   socket.emit('use local storage', value);
  });
  return unsubscribe;
 } };
};
