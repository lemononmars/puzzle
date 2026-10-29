import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMovementAudio } from './devilDiceAudio.js';
import type { Kind } from './devilDice.js';

afterEach(() => vi.unstubAllGlobals());
describe('Dice material sounds', () => {
	it('synthesizes distinct material timbres and respects mute', () => {
		const notes: { pitch: number; wave: string; stop: number }[] = [];
		class Context {
			state = 'running';
			currentTime = 0;
			destination = {};
			createOscillator() {
				const note = { pitch: 0, wave: '', stop: 0 };
				notes.push(note);
				return {
					type: 'sine',
					frequency: {
						setValueAtTime(value: number) {
							note.pitch = value;
						},
						exponentialRampToValueAtTime() {}
					},
					connect() {},
					disconnect() {},
					start() {
						note.wave = this.type;
					},
					stop(time: number) {
						note.stop = time;
					}
				};
			}
			createGain() {
				return {
					gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
					connect() {},
					disconnect() {}
				};
			}
			close() {
				return Promise.resolve();
			}
		}
		vi.stubGlobal('window', { AudioContext: Context });
		const audio = createMovementAudio();
		const first = new Map<Kind, (typeof notes)[number]>();
		for (const kind of ['normal', 'wood', 'ice', 'stone', 'metal'] as const) {
			const offset = notes.length;
			audio.play('roll', kind);
			first.set(kind, notes[offset]);
		}
		expect(
			new Set([...first.values()].map((note) => `${note.pitch}:${note.wave}:${note.stop}`)).size
		).toBe(5);
		expect(first.get('stone')!.pitch).toBeLessThan(first.get('wood')!.pitch);
		expect(first.get('ice')!.pitch).toBeGreaterThan(first.get('normal')!.pitch);
		expect(first.get('metal')!.stop).toBeGreaterThan(first.get('wood')!.stop);
		const blockedOffset = notes.length;
		audio.play('blocked');
		expect(notes[blockedOffset].pitch).toBe(155);
		expect(notes.length - blockedOffset).toBe(2);
		const walkOffset = notes.length;
		audio.play('walk');
		expect(notes.slice(walkOffset).map((note) => note.pitch)).toEqual([310, 260]);
		const slideOffset = notes.length;
		audio.play('slide');
		expect(notes.slice(slideOffset).map((note) => note.pitch)).toEqual([273, 210]);
		const clearOffset = notes.length;
		audio.play('clear');
		expect(notes.slice(clearOffset).map((note) => note.pitch)).toEqual([523, 659, 784, 1046]);
		const count = notes.length;
		audio.setMuted(true);
		audio.play('push', 'ice');
		expect(notes).toHaveLength(count);
		audio.dispose();
	});
});
