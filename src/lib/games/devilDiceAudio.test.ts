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
		const count = notes.length;
		audio.setMuted(true);
		audio.play('push', 'ice');
		expect(notes).toHaveLength(count);
		audio.dispose();
	});
});
