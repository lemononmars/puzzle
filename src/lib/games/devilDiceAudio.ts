import type { Kind } from './devilDice.js';
export type MovementSound = 'walk' | 'roll' | 'push' | 'pip';
const materials: Record<
	Kind,
	{ pitches: number[]; wave: OscillatorType; decay: number; bend: number }
> = {
	normal: { pitches: [210, 150, 95], wave: 'triangle', decay: 0.1, bend: 0.6 },
	wood: { pitches: [180, 350, 120], wave: 'triangle', decay: 0.14, bend: 0.82 },
	ice: { pitches: [740, 1110, 1480], wave: 'sine', decay: 0.25, bend: 0.96 },
	stone: { pitches: [85, 57, 42], wave: 'sine', decay: 0.16, bend: 0.45 },
	metal: { pitches: [460, 1237, 1784], wave: 'sine', decay: 0.34, bend: 0.99 }
};
export function createMovementAudio() {
	let context: AudioContext | undefined,
		muted = false;
	const unlock = () => {
		if (!context) {
			const Constructor =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
			if (Constructor) context = new Constructor();
		}
		if (context?.state === 'suspended') void context.resume().catch(() => {});
	};
	return {
		unlock,
		setMuted(value: boolean) {
			muted = value;
		},
		play(kind: MovementSound, material: Kind = 'normal') {
			if (muted) return;
			unlock();
			if (!context || context.state === 'closed') return;
			const playTones = () => {
				if (muted || !context || context.state !== 'running') return;
				const start = context.currentTime;
				const profile =
					kind === 'pip'
						? { pitches: [523, 659, 1046], wave: 'sine' as OscillatorType, decay: 0.18, bend: 1.12 }
						: materials[material];
				const pitches =
					kind === 'walk'
						? [material === 'normal' ? 310 : profile.pitches[0]]
						: kind === 'push' && material === 'normal'
							? [105, 70]
							: profile.pitches;
				pitches.forEach((frequency, i) => {
					const oscillator = context!.createOscillator(),
						gain = context!.createGain(),
						time = start + i * (kind === 'pip' ? 0.065 : 0.035);
					oscillator.type = kind === 'walk' ? 'sine' : profile.wave;
					oscillator.frequency.setValueAtTime(frequency, time);
					oscillator.frequency.exponentialRampToValueAtTime(
						frequency * profile.bend,
						time + profile.decay * 0.75
					);
					gain.gain.setValueAtTime(0.001, time);
					gain.gain.exponentialRampToValueAtTime(kind === 'walk' ? 0.025 : 0.045, time + 0.008);
					gain.gain.exponentialRampToValueAtTime(0.001, time + profile.decay);
					oscillator.connect(gain);
					gain.connect(context!.destination);
					oscillator.start(time);
					oscillator.stop(time + profile.decay + 0.01);
					oscillator.onended = () => {
						oscillator.disconnect();
						gain.disconnect();
					};
				});
			};
			if (context.state === 'running') playTones();
			else
				void context
					.resume()
					.then(playTones)
					.catch(() => {});
		},
		dispose() {
			if (context) void context.close().catch(() => {});
		}
	};
}
