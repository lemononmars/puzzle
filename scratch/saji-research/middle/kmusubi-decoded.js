(() => {
	'use strict';
	function createRecordsClient({ storage, request, uuid, enabled = true, now = Date.now }) {
		const prefix = 'kotonoha-records-v1-';
		const attempted = new Set();
		let player = null,
			cached = null,
			cachedAt = 0,
			reading = null;
		const get = (key) => {
			try {
				return storage?.getItem(prefix + key);
			} catch {
				return null;
			}
		};
		const put = (key, value) => {
			try {
				storage?.setItem(prefix + key, value);
				return get(key) === value;
			} catch {
				return false;
			}
		};
		function id() {
			if (player) return player;
			const saved = get('id');
			if (/^[a-f0-9-]{36}$/i.test(saved || '')) return (player = saved);
			const next = uuid();
			return put('id', next) ? (player = next) : null;
		}
		async function send(action) {
			if (!enabled || get(action) === '1' || attempted.has(action)) return;
			const playerId = id();
			if (!playerId) return;
			attempted.add(action);
			try {
				await request('POST', {
					id: playerId,
					action,
					...(action === 'clear' ? { proof: 'l-923cbf41' } : {})
				});
				put(action, '1');
				if (action === 'clear') {
					put('play', '1');
					put('pending-clear', '0');
				}
			} catch {
				/* Retry only on a later page load, never in a loop. */
			}
		}
		return {
			start() {
				return send(get('pending-clear') === '1' ? 'clear' : 'play');
			},
			clear() {
				if (!enabled) return Promise.resolve();
				if (get('clear') !== '1') put('pending-clear', '1');
				return send('clear');
			},
			async summary() {
				if (!enabled) throw new Error('preview');
				if (cached && now() - cachedAt < 60000) return cached;
				if (reading) return reading;
				reading = (async () => {
					const result = await request('GET');
					if (
						!result ||
						!Number.isSafeInteger(result.plays) ||
						!Number.isSafeInteger(result.clears) ||
						result.plays < 0 ||
						result.clears < 0 ||
						result.clears > result.plays
					)
						throw new Error('Invalid records');
					cached = {
						...result,
						rate: result.plays ? Math.round((result.clears / result.plays) * 1000) / 10 : 0
					};
					cachedAt = now();
					return cached;
				})();
				try {
					return await reading;
				} finally {
					reading = null;
				}
			}
		};
	}
	async function recordsRequest(method, body) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 7000);
		try {
			const response = await fetch('records.php', {
				method,
				signal: controller.signal,
				credentials: 'same-origin',
				...(method === 'POST'
					? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
					: {})
			});
			if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json'))
				throw new Error('Records unavailable');
			return method === 'POST' ? null : await response.json();
		} finally {
			clearTimeout(timeout);
		}
	}

	const BEAT = 60 / 69;

	const phrases = [
		[[62, 1]],
		[[60, 1]],
		[
			[62, 1],
			[64, 1]
		],
		[
			[67, 1],
			[64, 1]
		],
		[[62, 2]],
		[[64, 1]],
		[[67, 1]],
		[
			[69, 1],
			[67, 0.5],
			[69, 0.5]
		],
		[[74, 1]],
		[[71, 1]],
		[[69, 1]],
		[[67, 1]],
		[[64, 1]],
		[[67, 1]],
		[[69, 2]],
		[[74, 1]],
		[[72, 1]],
		[[74, 2]],
		[[64, 1]],
		[[67, 1]],
		[[69, 1]],
		[[67, 1]],
		[[64, 1.5]],
		[[67, 0.5]],
		[[62, 2]],
		[[69, 1]],
		[[72, 1]],
		[[74, 2]],
		[
			[72, 1],
			[74, 1]
		],
		[
			[69, 1],
			[67, 1]
		],
		[
			[69, 1],
			[67, 0.5],
			[64, 0.5]
		],
		[[62, 2]]
	];
	const LEAD = 1;
	const lengths = phrases.map((p) => p.reduce((a, n) => a + n[1], 0)),
		starts = [];
	let total = LEAD;
	lengths.forEach((n) => {
		starts.push(total);
		total += n;
	});
	const $ = (id) => document.getElementById(id),
		grid = $('grid'),
		slots = $('slots'),
		scrub = $('scrub'),
		message = $('message');
	let audio,
		master,
		audioPrimed = false,
		selected = null,
		answer = [null, null, null, null],
		position = 0,
		running = false,
		epoch = 0,
		raf = 0,
		drag = null,
		solved = false,
		resumeAfterHidden = false,
		resumeAfterSettings = false;
	const nodes = new Set(),
		timers = new Map(),
		cells = [],
		chips = [],
		targets = [],
		history = [];
	let preferences = { volume: 65, muted: false };
	try {
		const saved = JSON.parse(localStorage.getItem('kotonoha-preferences') || '{}');
		preferences = {
			volume: Number.isFinite(saved.volume) ? Math.min(100, Math.max(0, saved.volume)) : 65,
			muted: saved.muted === true
		};
	} catch {}
	let muteTaps = 0,
		recordStatus = 'idle',
		recordSnapshot = null;
	function remember() {
		history.push({ answer: [...answer], selected });
		if (history.length > 100) history.shift();
	}
	function returnCircle(index) {
		if (!answer.includes(index)) return;
		remember();
		answer = answer.map((v) => (v === index ? null : v));
		render();
		choose(index, false);
	}
	scrub.max = total;
	lengths.forEach((n, i) => {
		const part = document.createElement('span');
		part.className = 'segment';
		part.style.left = (starts[i] / total) * 100 + '%';
		part.style.width = (n / total) * 100 + '%';
		part.dataset.index = i;
		$('segments').append(part);
	});
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 7; col++) {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const x = 100 + 100 * col,
				y = 50 + row * 100;
			path.setAttribute(
				'd',
				row % 2 ? 'M' + (x + 9) + ' ' + y + ' h-18' : 'M' + (x - 9) + ' ' + y + ' h18'
			);
			path.setAttribute('marker-end', 'url(#arrow)');
			$('arrows').append(path);
		}
	}
	for (let row = 0; row < 3; row++) {
		const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		p.setAttribute('d', `M${row % 2 ? 13 : 787} ${row * 100 + 91} v18`);
		p.setAttribute('marker-end', 'url(#arrow)');
		$('arrows').append(p);
	}
	function stopSound() {
		for (const node of nodes) {
			try {
				node.stop();
			} catch {}
		}
		nodes.clear();
	}
	function ensureAudio() {
		if (!audio) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			if (!AudioContext) throw new Error('audio unsupported');
			audio = new AudioContext();
			master = audio.createGain();
			master.gain.value = preferences.muted ? 0 : preferences.volume / 100;
			master.connect(audio.destination);
		}
		if (audio.state === 'suspended') {
			const resumed = audio.resume();
			if (resumed?.catch) resumed.catch(() => {});
		}
		if (!audioPrimed) {
			audioPrimed = true;
			const silent = audio.createBufferSource();
			silent.buffer = audio.createBuffer(1, 1, audio.sampleRate);
			silent.connect(master);
			silent.start();
			silent.stop(audio.currentTime + 0.01);
			silent.onended = () => silent.disconnect();
		}
	}
	function tone(index) {
		try {
			ensureAudio();
			let t = audio.currentTime + 0.018;
			for (const [midi, beats] of phrases[index]) {
				const duration = beats * BEAT,
					frequency = 440 * Math.pow(2, (midi - 69) / 12);
				for (const [harmonic, volume] of [
					[1, 0.21],
					[2, 0.046],
					[3, 0.012]
				]) {
					const oscillator = audio.createOscillator(),
						gain = audio.createGain();
					oscillator.type = 'sine';
					oscillator.frequency.value = frequency * harmonic;
					gain.gain.setValueAtTime(0, t);
					gain.gain.linearRampToValueAtTime(volume, t + 0.014);
					gain.gain.exponentialRampToValueAtTime(
						volume * 0.32,
						t + Math.min(0.23, duration * 0.45)
					);
					gain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.98 + 0.09);
					oscillator.connect(gain);
					gain.connect(master);
					oscillator.start(t);
					oscillator.stop(t + duration + 0.11);
					nodes.add(oscillator);
					oscillator.onended = () => {
						nodes.delete(oscillator);
						oscillator.disconnect();
						gain.disconnect();
					};
				}
				t += duration;
			}
		} catch {
			message.textContent = '音を再生できませんでした。もう一度、丸を押してください。';
		}
	}
	document.addEventListener('pointerdown', ensureAudio, { capture: true, once: true });
	document.addEventListener('touchstart', ensureAudio, {
		capture: true,
		once: true,
		passive: true
	});
	function choose(index, makeSound = true) {
		selected = index;
		chips.forEach((chip, i) => {
			chip.classList.toggle('selected', index === i);
			chip.setAttribute('aria-pressed', String(index === i));
		});
		if (makeSound) {
			tone(index);
			const chip = chips[index];
			chip.classList.remove('sounding');
			void chip.offsetWidth;
			chip.classList.add('sounding');
			clearTimeout(timers.get(index));
			timers.set(
				index,
				setTimeout(() => chip.classList.remove('sounding'), 650)
			);
		}
	}
	function render() {
		cells.forEach((cell, i) => {
			if (answer.includes(i)) {
				if (!cell.querySelector('.origin')) {
					const back = document.createElement('button');
					back.className = 'origin';
					back.setAttribute('aria-label', `${i + 1}番の丸を元に戻す`);
					back.addEventListener('click', () => {
						returnCircle(i);
					});
					cell.replaceChildren(back);
				}
			} else cell.replaceChildren(chips[i]);
		});
		targets.forEach((target, i) => {
			target.replaceChildren();
			if (answer[i] !== null) target.append(chips[answer[i]]);
			target.setAttribute(
				'aria-label',
				`答えの${i + 1}文字目${answer[i] !== null ? '、配置済み' : ''}`
			);
		});
		chips.forEach((chip, i) => {
			chip.classList.toggle('selected', selected === i);
			chip.setAttribute('aria-pressed', String(selected === i));
		});
		$('submit').disabled = answer.some((v) => v === null);
		$('undo').disabled = history.length === 0;
		message.textContent = '';
	}
	function place(index, targetIndex) {
		if (answer[targetIndex] === index) return;
		remember();
		const source = answer.indexOf(index),
			old = answer[targetIndex];
		if (source !== -1) answer[source] = old;
		answer[targetIndex] = index;
		render();
		choose(index, false);
	}
	function cancelDrag() {
		if (!drag) return;
		drag.ghost?.remove();
		drag.chip.classList.remove('drag-source');
		targets.forEach((x) => x.classList.remove('drop'));
		drag = null;
	}
	function begin(event, index) {
		if (event.button !== 0 && event.pointerType === 'mouse') return;
		event.preventDefault();
		cancelDrag();
		choose(index);
		drag = {
			id: event.pointerId,
			index,
			x: event.clientX,
			y: event.clientY,
			chip: chips[index],
			moved: false,
			ghost: null
		};
		chips[index].setPointerCapture(event.pointerId);
	}
	for (let i = 0; i < 32; i++) {
		const row = Math.floor(i / 8),
			col = row % 2 ? 7 - (i % 8) : i % 8,
			cell = document.createElement('div'),
			chip = document.createElement('button');
		cell.className = 'cell';
		cell.style.gridRow = row + 1;
		cell.style.gridColumn = col + 1;
		chip.className = 'chip' + (i % 2 ? ' red' : '');
		chip.dataset.index = i;
		chip.setAttribute('aria-label', `${i + 1}番の丸`);
		chip.setAttribute('aria-pressed', 'false');
		chip.addEventListener('pointerdown', (e) => begin(e, i));
		chip.addEventListener('click', (e) => {
			e.stopPropagation();
			if (e.detail === 0) choose(i);
		});
		chip.addEventListener('contextmenu', (e) => e.preventDefault());
		cells.push(cell);
		chips.push(chip);
		cell.append(chip);
		grid.append(cell);
	}
	for (let i = 0; i < 4; i++) {
		const target = document.createElement('div');
		target.className = 'slot';
		target.tabIndex = 0;
		target.setAttribute('role', 'button');
		target.addEventListener('click', () => {
			if (selected !== null) place(selected, i);
		});
		target.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (selected !== null) place(selected, i);
			}
		});
		targets.push(target);
		slots.append(target);
	}
	window.addEventListener(
		'pointermove',
		(event) => {
			if (!drag || drag.id !== event.pointerId) return;
			if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8) {
				drag.moved = true;
				drag.ghost = drag.chip.cloneNode(false);
				drag.ghost.removeAttribute('aria-pressed');
				drag.ghost.setAttribute('aria-hidden', 'true');
				drag.ghost.tabIndex = -1;
				drag.ghost.className = 'chip ghost' + (drag.index % 2 ? ' red' : '');
				document.body.append(drag.ghost);
				drag.chip.classList.add('drag-source');
			}
			if (drag.moved) {
				event.preventDefault();
				drag.ghost.style.left = event.clientX + 'px';
				drag.ghost.style.top = event.clientY + 'px';
				targets.forEach((target) => {
					const r = target.getBoundingClientRect();
					target.classList.toggle(
						'drop',
						event.clientX >= r.left &&
							event.clientX <= r.right &&
							event.clientY >= r.top &&
							event.clientY <= r.bottom
					);
				});
			}
		},
		{ passive: false }
	);
	window.addEventListener('pointerup', (event) => {
		if (!drag || drag.id !== event.pointerId) return;
		const { index, moved } = drag;
		if (moved) {
			const slot = targets.findIndex((target) => {
				const r = target.getBoundingClientRect();
				return (
					event.clientX >= r.left &&
					event.clientX <= r.right &&
					event.clientY >= r.top &&
					event.clientY <= r.bottom
				);
			});
			cancelDrag();
			if (slot >= 0) place(index, slot);
			else {
				const r = grid.getBoundingClientRect();
				if (
					event.clientX >= r.left &&
					event.clientX <= r.right &&
					event.clientY >= r.top &&
					event.clientY <= r.bottom
				) {
					returnCircle(index);
				}
			}
		} else cancelDrag();
	});
	window.addEventListener('pointercancel', cancelDrag);
	function paint() {
		scrub.value = position;
		const percent = (position / total) * 100,
			leadPercent = (LEAD / total) * 100;
		$('needle').style.left = percent + '%';
		$('elapsed').style.left = leadPercent + '%';
		$('elapsed').style.width = Math.max(0, percent - leadPercent) + '%';
		const current =
			position >= total
				? -1
				: starts.findIndex((start, i) => position >= start && position < start + lengths[i]);
		[...$('segments').children].forEach((s, i) => s.classList.toggle('current', current === i));
		scrub.setAttribute('aria-valuetext', Math.round(percent) + '%');
	}
	function pause() {
		if (running) position = Math.max(0, (performance.now() - epoch) / 1000 / BEAT) % total;
		running = false;
		cancelAnimationFrame(raf);
		paint();
	}
	function tick() {
		if (!running) return;
		position = Math.max(0, (performance.now() - epoch) / 1000 / BEAT) % total;
		paint();
		raf = requestAnimationFrame(tick);
	}
	function start() {
		if (running) return;
		cancelAnimationFrame(raf);
		if (position >= total) position = 0;
		running = true;
		epoch = performance.now() - position * BEAT * 1000;
		raf = requestAnimationFrame(tick);
	}
	scrub.addEventListener('input', () => {
		position = Number(scrub.value);
		if (running) epoch = performance.now() - position * BEAT * 1000;
		stopSound();
		paint();
	});
	$('undo').addEventListener('click', () => {
		const previous = history.pop();
		if (!previous) return;
		cancelDrag();
		answer = [...previous.answer];
		selected = previous.selected;
		render();
	});
	$('reset').addEventListener('click', () => {
		cancelDrag();
		pause();
		stopSound();
		answer.fill(null);
		history.length = 0;
		selected = null;
		position = 0;
		solved = false;
		render();
		paint();
		start();
	});
	scrub.addEventListener('pointerdown', (event) => {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		event.preventDefault();
		scrub.setPointerCapture(event.pointerId);
		seekFromPointer(event);
	});
	scrub.addEventListener('pointermove', (event) => {
		if (scrub.hasPointerCapture(event.pointerId)) {
			event.preventDefault();
			seekFromPointer(event);
		}
	});
	function seekFromPointer(event) {
		const rect = scrub.getBoundingClientRect();
		position = Math.min(total, Math.max(0, ((event.clientX - rect.left) / rect.width) * total));
		if (running) epoch = performance.now() - position * BEAT * 1000;
		stopSound();
		paint();
	}

	async function check() {
		if (answer.some((v) => v === null)) return false;
		const snapshot = answer.join(':');
		const digest = await crypto.subtle.digest(
			'SHA-256',
			new TextEncoder().encode('leaf-v2:' + snapshot)
		);
		const token = Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, '0')).join(
			''
		);
		if (snapshot !== answer.join(':')) return false;
		const correct = [
			'05f7a56b0e16929d9b42f80a83562b756e0e81815d93d5d218608463e7f79d0d',
			'5b580ba0f0364dbb325b47ce6aa2b1f0ee00f214917df284dd9cc10340041c74'
		].includes(token);
		if (correct) {
			if (!solved) void records.clear();
			solved = true;
			pause();
			stopSound();
			if (!$('success').open) $('success').showModal();
		} else {
			message.textContent = '繋がらないようです。';
			slots.classList.remove('shake');
			void slots.offsetWidth;
			slots.classList.add('shake');
		}
		return correct;
	}
	$('submit').addEventListener('click', check);
	$('close').addEventListener('click', () => $('success').close());
	$('finish').addEventListener('click', () => $('success').close());
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			resumeAfterHidden = running;
			pause();
			stopSound();
			cancelDrag();
		} else if (resumeAfterHidden) {
			resumeAfterHidden = false;
			if (!document.querySelector('dialog[open]')) start();
		}
	});
	window.addEventListener('blur', cancelDrag);
	function updateShareLink() {
		const repostUrl = 'https://x.com/saji_qook/status/2100359081605362140';
		const lines = ['WEB謎「結び」を解きました！', 'https://sajiqook.jp/game/kmusubi', '#結び'];
		if (repostUrl) lines.push(repostUrl);
		$('share-x').href =
			'https://x.com/intent/tweet?' + new URLSearchParams({ text: lines.join('\n\n') });
	}
	function savePreferences() {
		try {
			localStorage.setItem('kotonoha-preferences', JSON.stringify(preferences));
		} catch {}
	}
	function applyPreferences() {
		updateShareLink();
		$('volume').value = preferences.volume;
		$('volume-value').value = (preferences.muted ? 0 : preferences.volume) + '%';
		$('mute').setAttribute('aria-pressed', String(preferences.muted));
		$('mute').textContent = preferences.muted ? '解除' : '無音';
		renderRecords();
		if (master)
			master.gain.setTargetAtTime(
				preferences.muted ? 0 : preferences.volume / 100,
				audio.currentTime,
				0.015
			);
	}
	$('settings-open').addEventListener('click', () => {
		muteTaps = 0;
		resumeAfterSettings = running;
		pause();
		stopSound();
		cancelDrag();
		$('settings').showModal();
	});
	$('settings').addEventListener('close', () => {
		muteTaps = 0;
		if (resumeAfterSettings && !document.hidden) start();
		resumeAfterSettings = false;
	});
	$('settings-close').addEventListener('click', () => $('settings').close());
	$('volume').addEventListener('input', () => {
		preferences.volume = Number($('volume').value);
		preferences.muted = false;
		applyPreferences();
		savePreferences();
	});
	$('mute').addEventListener('click', () => {
		preferences.muted = !preferences.muted;
		applyPreferences();
		savePreferences();
		muteTaps++;
		if (muteTaps === 8) {
			muteTaps = 0;
			void openRecords();
		}
	});
	$('source-close').addEventListener('click', () => $('source-notice').close());
	for (const id of ['source-notice', 'success'])
		$(id).addEventListener('close', () => {
			if (document.querySelector('dialog[open]')) return;
			if (document.hidden) resumeAfterHidden = true;
			else start();
		});
	document.addEventListener('keydown', (event) => {
		const key = event.key.toLowerCase();
		const inspect =
			key === 'f12' ||
			(event.ctrlKey && key === 'u') ||
			(event.metaKey && event.altKey && key === 'u') ||
			(((event.ctrlKey && event.shiftKey) || (event.metaKey && event.altKey)) &&
				['i', 'j', 'c'].includes(key));
		if (inspect) {
			event.preventDefault();
			pause();
			stopSound();
			if (!$('source-notice').open) $('source-notice').showModal();
		}
	});
	let recordStorage;
	try {
		recordStorage = window.localStorage;
	} catch {}
	const records =
		typeof createRecordsClient === 'function'
			? createRecordsClient({
					storage: recordStorage,
					request: recordsRequest,
					uuid: () => crypto.randomUUID(),
					enabled:
						location.protocol === 'https:' &&
						['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname)
				})
			: {
					start: async () => {},
					clear: async () => {},
					summary: async () => {
						throw new Error('preview');
					}
				};
	function renderRecords() {
		$('record-plays').textContent = recordSnapshot
			? recordSnapshot.plays.toLocaleString('ja-JP')
			: '—';
		$('record-clears').textContent = recordSnapshot
			? recordSnapshot.clears.toLocaleString('ja-JP')
			: '—';
		$('record-rate').textContent = recordSnapshot ? recordSnapshot.rate + '%' : '—';
		const labels = {
			idle: '',
			loading: '読み込み中…',
			ready: '全体の記録です。反映に最大60秒ほどかかります。',
			preview: '全体の記録は、公開後に利用できます。',
			error: '記録を取得できませんでした。時間をおいて開き直してください。'
		};
		$('record-status').textContent = labels[recordStatus] || '';
	}
	async function openRecords() {
		recordSnapshot = null;
		recordStatus = 'loading';
		renderRecords();
		if (!$('records').open) $('records').showModal();
		try {
			recordSnapshot = await records.summary();
			recordStatus = 'ready';
		} catch (error) {
			recordStatus = error.message === 'preview' ? 'preview' : 'error';
		}
		renderRecords();
	}
	$('records-close').addEventListener('click', () => $('records').close());
	for (const id of ['settings', 'records']) {
		const dialog = $(id);
		let backdropStart = false;
		const outside = (event) => {
			const r = dialog.getBoundingClientRect();
			return (
				event.clientX < r.left ||
				event.clientX > r.right ||
				event.clientY < r.top ||
				event.clientY > r.bottom
			);
		};
		dialog.addEventListener('pointerdown', (event) => {
			backdropStart = event.target === dialog && outside(event);
		});
		dialog.addEventListener('pointercancel', () => {
			backdropStart = false;
		});
		dialog.addEventListener('click', (event) => {
			if (event.target === dialog && backdropStart && outside(event)) dialog.close();
			backdropStart = false;
		});
	}
	void records.start();
	render();
	paint();
	applyPreferences();
	if (document.hidden) resumeAfterHidden = true;
	else start();
	const context = document.modelContext;
	if (context?.registerTool) {
		const controller = new AbortController();
		const state = () => ({
			selected: selected === null ? null : selected + 1,
			answer: answer.map((v) => (v === null ? null : v + 1)),
			position,
			running,
			solved
		});
		try {
			Promise.resolve(
				context.registerTool(
					{
						name: 'arrange_sound_circles',
						description:
							'番号で指定した4つの音の丸を、画面内の解答欄へ並べます。まだ解答は確定しません。',
						inputSchema: {
							type: 'object',
							properties: {
								circles: {
									type: 'array',
									items: { type: 'integer', minimum: 1, maximum: 32 },
									minItems: 4,
									maxItems: 4
								}
							},
							required: ['circles'],
							additionalProperties: false
						},
						annotations: { readOnlyHint: false },
						execute(input) {
							const ids = input?.circles;
							if (
								!Array.isArray(ids) ||
								ids.length !== 4 ||
								ids.some((v) => !Number.isInteger(v) || v < 1 || v > 32) ||
								new Set(ids).size !== 4
							)
								throw new Error('1から32までの重複しない丸を4つ指定してください。');
							remember();
							answer = ids.map((v) => v - 1);
							selected = null;
							render();
							return state();
						}
					},
					{ signal: controller.signal }
				)
			).catch(() => {});
			Promise.resolve(
				context.registerTool(
					{
						name: 'submit_sound_answer',
						description: '解答欄に並べた4つの丸を解答として確定します。',
						inputSchema: { type: 'object', properties: {}, additionalProperties: false },
						annotations: { readOnlyHint: false },
						async execute() {
							return { correct: await check(), ...state() };
						}
					},
					{ signal: controller.signal }
				)
			).catch(() => {});
		} catch {}
		window.addEventListener('pagehide', () => controller.abort(), { once: true });
	}
})();
