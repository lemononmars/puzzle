// Original, deterministic Demon Dice compositions. Requires Node and ffmpeg.
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const RATE = 32000;
const hz = (n) => 440 * 2 ** ((n - 69) / 12);
function compose(name, bpm, chords, melody, endless) {
	const beat = 60 / bpm,
		bars = 16,
		seconds = bars * 4 * beat,
		size = Math.round(seconds * RATE);
	const left = new Float32Array(size),
		right = new Float32Array(size);
	let seed = endless ? 8021 : 7013;
	const noise = () => {
		seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
		return (seed >>> 0) / 2147483648 - 1;
	};
	function note(time, midi, duration, level, pan = 0, voice = 'keys') {
		const f = hz(midi),
			len = Math.ceil(duration * RATE);
		for (let j = 0; j < len; j++) {
			const t = j / RATE,
				u = t / duration,
				attack = Math.min(1, t / 0.025),
				release = Math.min(1, (duration - t) / 0.24);
			let v;
			if (voice === 'pad')
				v =
					(Math.sin(2 * Math.PI * f * t) +
						0.24 * Math.sin(2 * Math.PI * f * 1.002 * t) +
						0.12 * Math.sin(4 * Math.PI * f * t)) *
					Math.sin(Math.PI * u) ** 0.7 *
					0.42;
			else if (voice === 'bass')
				v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 1.3) * attack * release;
			else
				v =
					(Math.sin(2 * Math.PI * f * t + 1.2 * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 4)) +
						0.16 * Math.sin(6 * Math.PI * f * t) * Math.exp(-t * 3)) *
					Math.exp(-t * (voice === 'bell' ? 1.8 : 1.35)) *
					attack *
					release;
			v *= level;
			const index = (Math.round(time * RATE) + j) % size;
			left[index] += v * Math.sqrt((1 - pan) / 2);
			right[index] += v * Math.sqrt((1 + pan) / 2);
		}
	}
	function drum(time, kind, level) {
		const duration = kind === 'kick' ? 0.35 : kind === 'brush' ? 0.18 : 0.065;
		for (let j = 0; j < duration * RATE; j++) {
			const t = j / RATE;
			let v =
				kind === 'kick'
					? Math.sin(2 * Math.PI * (47 * t + 2.6 * (1 - Math.exp(-t * 28)))) * Math.exp(-t * 15)
					: noise() * Math.exp(-t * (kind === 'brush' ? 37 : 85)) * 0.45;
			const i = (Math.round(time * RATE) + j) % size;
			left[i] += v * level * 0.67;
			right[i] += v * level * 0.73;
		}
	}
	for (let bar = 0; bar < bars; bar++) {
		const chord = chords[bar % chords.length],
			start = bar * 4 * beat;
		chord.forEach((n, i) => {
			note(start + i * 0.018, n, beat * 3.8, 0.048, (i - 2) * 0.18);
			note(start, n + 12, beat * 4.8, 0.018, (2 - i) * 0.22, 'pad');
		});
		note(start, chord[0] - 24, beat * 2.1, 0.092, -0.06, 'bass');
		note(start + 2.5 * beat, chord[0] - 24, beat * 1.3, 0.055, 0.06, 'bass');
		const phrase = melody[bar % melody.length];
		phrase.forEach(([offset, n]) =>
			note(start + offset * beat, n, beat * 2.2, 0.045, Math.sin(bar + offset) * 0.4, 'bell')
		);
		if (endless) {
			drum(start, 'kick', 0.1);
			drum(start + 2 * beat, 'kick', 0.075);
			drum(start + beat, 'brush', 0.052);
			drum(start + 3 * beat, 'brush', 0.052);
			for (let k = 0; k < 8; k++)
				drum(start + (k * 0.5 + (k % 2 ? 0.055 : 0)) * beat, 'hat', k % 2 ? 0.023 : 0.017);
			note(start + 1.5 * beat, chord[2] + 12, beat * 1.1, 0.025, 0.45);
		} else {
			drum(start + beat, 'brush', 0.025);
			drum(start + 3 * beat, 'brush', 0.025);
			for (let k = 0; k < 4; k++) drum(start + (k + 0.5) * beat, 'hat', 0.012);
		}
	}
	// Circular stereo delay/reverb includes the preceding loop's tails at the start.
	const dryL = left.slice(),
		dryR = right.slice();
	for (const [delay, amount] of [
		[beat * 0.75, 0.18],
		[beat * 1.5, 0.12],
		[0.113, 0.11],
		[0.229, 0.075],
		[0.397, 0.05]
	]) {
		const shift = Math.round(delay * RATE);
		for (let i = 0; i < size; i++) {
			const source = (i - shift + size) % size;
			left[i] += dryR[source] * amount;
			right[i] += dryL[source] * amount;
		}
	}
	// Gentle saturation and one fixed master gain, keeping the music beneath effects.
	let peak = 0,
		sum = 0;
	for (let i = 0; i < size; i++) {
		left[i] = Math.tanh(left[i] * 1.5);
		right[i] = Math.tanh(right[i] * 1.5);
		peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
		sum += left[i] ** 2 + right[i] ** 2;
	}
	const gain = 0.7 / peak,
		buffer = Buffer.alloc(44 + size * 4);
	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(buffer.length - 8, 4);
	buffer.write('WAVEfmt ', 8);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(2, 22);
	buffer.writeUInt32LE(RATE, 24);
	buffer.writeUInt32LE(RATE * 4, 28);
	buffer.writeUInt16LE(4, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(size * 4, 40);
	for (let i = 0; i < size; i++) {
		buffer.writeInt16LE(Math.round(left[i] * gain * 32767), 44 + i * 4);
		buffer.writeInt16LE(Math.round(right[i] * gain * 32767), 46 + i * 4);
	}
	mkdirSync('scratch/demon-music', { recursive: true });
	writeFileSync(`scratch/demon-music/${name}.wav`, buffer);
	mkdirSync('static/audio/demon-dice', { recursive: true });
	const encoded = spawnSync(
		'ffmpeg',
		[
			'-hide_banner',
			'-loglevel',
			'error',
			'-y',
			'-i',
			`scratch/demon-music/${name}.wav`,
			'-codec:a',
			'libmp3lame',
			'-b:a',
			'128k',
			'-metadata',
			`title=${endless ? 'Twilight Drift' : 'Garden Steps'}`,
			'-metadata',
			'artist=Demon Dice',
			`static/audio/demon-dice/${name}.mp3`
		],
		{ stdio: 'inherit' }
	);
	if (encoded.error || encoded.status !== 0)
		throw encoded.error ?? new Error('Music encoding failed');
	console.log(name, { bpm, seconds, rms: Math.sqrt(sum / (size * 2)) * gain, peak: 0.7 });
}
compose(
	'tutorial-garden',
	72,
	[
		[60, 64, 67, 71, 74],
		[57, 60, 64, 67, 71],
		[53, 57, 60, 64, 67],
		[55, 59, 62, 67, 69]
	],
	[
		[
			[0.5, 76],
			[2, 74],
			[3.25, 71]
		],
		[
			[0.5, 72],
			[2.5, 71]
		],
		[
			[1, 69],
			[2.5, 67],
			[3.5, 64]
		],
		[
			[0.5, 67],
			[2, 69],
			[3, 74]
		]
	],
	false
);
compose(
	'endless-twilight',
	84,
	[
		[50, 57, 60, 64, 69],
		[46, 53, 57, 60, 65],
		[53, 60, 64, 67, 72],
		[48, 55, 60, 62, 67]
	],
	[
		[
			[0.75, 76],
			[2.5, 72]
		],
		[
			[0.5, 77],
			[1.75, 72],
			[3.25, 69]
		],
		[
			[1.25, 79],
			[2.75, 76]
		],
		[
			[0.5, 74],
			[2.25, 72],
			[3.5, 67]
		]
	],
	true
);
