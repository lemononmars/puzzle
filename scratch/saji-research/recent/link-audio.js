(function (root) {
	'use strict';
	const durations = {
		tap: 0.075,
		select: 0.06,
		seat: 0.13,
		power: 0.23,
		complete: 0.35,
		undo: 0.1,
		reset: 0.17,
		fail: 0.14
	};
	function synthesize(kind, sampleRate = 44100) {
		const length = Math.ceil((durations[kind] || durations.tap) * sampleRate),
			samples = new Float32Array(length);
		let seed = 2463534242,
			lastNoise = 0,
			filtered = 0;
		const tone = (time, start, duration, from, to, level) => {
			const t = time - start;
			if (t < 0 || t >= duration) return 0;
			const envelope = Math.min(1, t / 0.003) * Math.pow(1 - t / duration, 2);
			const phase = 2 * Math.PI * (from * t + ((to - from) * t * t) / (2 * duration));
			return Math.sin(phase) * envelope * level;
		};
		const impulse = (time, start, decay, level) =>
			time >= start ? Math.exp(-(time - start) / decay) * level : 0;
		for (let i = 0; i < length; i++) {
			const t = i / sampleRate;
			seed ^= seed << 13;
			seed ^= seed >>> 17;
			seed ^= seed << 5;
			const noise = (seed >>> 0) / 2147483648 - 1;
			filtered = 0.48 * filtered + 0.52 * (noise - lastNoise);
			lastNoise = noise;
			let value = 0;
			if (kind === 'seat') {
				value = filtered * (impulse(t, 0.002, 0.005, 0.34) + impulse(t, 0.028, 0.006, 0.19));
				value += tone(t, 0, 0.042, 1350, 700, 0.17) + tone(t, 0.026, 0.06, 240, 145, 0.12);
			} else if (kind === 'power' || kind === 'complete') {
				const notes = kind === 'complete' ? [880, 1320, 1760] : [1100, 1650];
				notes.forEach((frequency, index) => {
					value += tone(t, index * 0.075, 0.105, frequency, frequency, 0.14);
					value += tone(t, index * 0.075, 0.105, frequency * 3, frequency * 3, 0.02);
				});
			} else if (kind === 'select') value = tone(t, 0, 0.045, 420, 360, 0.085);
			else if (kind === 'undo')
				value = tone(t, 0, 0.075, 680, 350, 0.12) + filtered * impulse(t, 0, 0.004, 0.07);
			else if (kind === 'reset')
				value = tone(t, 0, 0.14, 440, 155, 0.12) + filtered * impulse(t, 0, 0.006, 0.11);
			else if (kind === 'fail')
				value = tone(t, 0, 0.07, 220, 185, 0.11) + tone(t, 0.07, 0.055, 175, 155, 0.085);
			else
				value =
					filtered * (impulse(t, 0.001, 0.003, 0.36) + impulse(t, 0.014, 0.004, 0.23)) +
					tone(t, 0.002, 0.035, 230, 95, 0.13) +
					tone(t, 0.015, 0.024, 720, 360, 0.04);
			const tail = Math.min(1, (length - 1 - i) / (sampleRate * 0.003));
			samples[i] = Math.max(-0.5, Math.min(0.5, value)) * tail;
		}
		return samples;
	}
	let context, master;
	let settings = { volume: 65, muted: false };
	const buffers = new Map();
	function unlock() {
		try {
			if (!context) {
				context = new (root.AudioContext || root.webkitAudioContext)();
				master = context.createGain();
				master.gain.value = settings.muted ? 0 : (settings.volume / 100) * 0.55;
				master.connect(context.destination);
			}
			if (context.state === 'suspended') context.resume().catch(() => {});
		} catch {}
	}
	function configure({ volume = settings.volume, muted = settings.muted } = {}) {
		settings = {
			volume: Number.isFinite(volume) ? Math.max(0, Math.min(100, volume)) : 65,
			muted: Boolean(muted)
		};
		if (master) {
			const now = context.currentTime;
			master.gain.cancelScheduledValues(now);
			master.gain.setTargetAtTime(settings.muted ? 0 : (settings.volume / 100) * 0.55, now, 0.005);
		}
	}
	function play(kind = 'tap', { volume = 65, muted = false, delay = 0 } = {}) {
		configure({ volume, muted });
		if (muted || volume <= 0) return;
		unlock();
		if (!context) return;
		try {
			let buffer = buffers.get(kind);
			if (!buffer) {
				const samples = synthesize(kind, context.sampleRate);
				buffer = context.createBuffer(1, samples.length, context.sampleRate);
				buffer.getChannelData(0).set(samples);
				buffers.set(kind, buffer);
			}
			const source = context.createBufferSource();
			source.buffer = buffer;
			source.connect(master);
			source.onended = () => source.disconnect();
			source.start(context.currentTime + Math.max(0, delay));
		} catch {}
	}
	if (typeof module === 'object' && module.exports)
		module.exports = { synthesize, durations, play, unlock, configure };
	else root.PanelAudio = { play, unlock, configure };
})(typeof globalThis === 'object' ? globalThis : window);
