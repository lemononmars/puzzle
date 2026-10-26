import { writable } from 'svelte/store';
export const storageMessage = writable('');
const gamePrefix = 'puzzle-save:v1:';
let savingEnabled = true;
const localPath = (value) => typeof value === 'string' &&
    /^\/(puzzles|tools|resources)(\/[^?#\s]*)?$/.test(value) &&
    !value.includes('..') &&
    value.length < 300;
const owned = (key) => key.startsWith(gamePrefix) ||
    key.startsWith('puzzle-answer-history:') ||
    key.startsWith('puzzle-answer-draft:') ||
    ['mathdle-attempts', 'tbs2021-letter-marks'].includes(key);
function read(key) {
    try {
        return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    }
    catch {
        storageMessage.set('บันทึกลงเครื่องไม่ได้ / Local storage is unavailable.');
        return null;
    }
}
function write(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    }
    catch {
        storageMessage.set('บันทึกลงเครื่องไม่ได้ ข้อมูลยังอยู่ในหน้านี้ / Could not save locally. Export a backup before leaving.');
        return false;
    }
}
export function saveGame(path, _title, state, _solved = false) {
    if (!savingEnabled || typeof window === 'undefined' || !localPath(path))
        return;
    const serialized = JSON.stringify({ version: 1, state });
    if (serialized.length > 400000)
        return;
    write(gamePrefix + path, serialized);
}
export function loadGame(path) {
    try {
        const parsed = JSON.parse(read(gamePrefix + path) ?? 'null');
        return parsed?.version === 1 ? parsed.state : null;
    }
    catch {
        return null;
    }
}
export function resetGame(path) {
    try {
        localStorage.removeItem(gamePrefix + path);
    }
    catch { }
}
export function exportBackup() {
    const data = {};
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (owned(key))
            data[key] = localStorage.getItem(key);
    }
    return JSON.stringify({ format: 'puzzle-local-backup', version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}
export function importBackup(text) {
    if (text.length > 5000000)
        throw new Error('Backup is too large (maximum 5 MB).');
    const backup = JSON.parse(text);
    if (backup?.format !== 'puzzle-local-backup' ||
        backup.version !== 1 ||
        !backup.data ||
        typeof backup.data !== 'object' ||
        Array.isArray(backup.data))
        throw new Error('This is not a supported Puzzle backup.');
    const pairs = Object.entries(backup.data);
    if (pairs.length > 1000)
        throw new Error('Too many backup records.');
    for (const [key, value] of pairs) {
        if (!owned(key) ||
            typeof value !== 'string' ||
            value.length > 400000)
            throw new Error('Backup contains unsupported data.');
        if (key.startsWith(gamePrefix) && !localPath(key.slice(gamePrefix.length)))
            throw new Error('Invalid puzzle path.');
        JSON.parse(value);
    }
    for (const [key, value] of pairs)
        if (!write(key, value))
            throw new Error('Not enough storage to restore this backup.');
    savingEnabled = false;
    storageMessage.set('Backup restored. Reload the page to resume and save progress.');
    return pairs.length;
}
export function resetAllProgress() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (owned(key))
            keys.push(key);
    }
    for (const key of keys)
        localStorage.removeItem(key);
    savingEnabled = false;
    storageMessage.set('Progress cleared. Reload the page to start fresh and save again.');
}
export function fingerprint(value) {
    const text = JSON.stringify(value) ?? '';
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}
