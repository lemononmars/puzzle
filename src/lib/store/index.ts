import { localStore } from './localStore';

export const username = localStore('username', 'Guest');
export const adventureLevel = localStore('level', '1');
export const adventureCode = localStore('code', 'start');
export const adventureCodes = localStore('adventure_codes', JSON.stringify({ 1: 'start' }));

export const storeMyInfo = localStore('myInfo', '');
export const storeGameState = localStore('gameState', '');
export const storePlayerList = localStore('playerList', '{}');
