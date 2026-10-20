(() => {
	'use strict';
	const $ = (id) => document.getElementById(id);
	const KEY = 'silent-line-transfers-v3';
	const SOUND_KEY = 'silent-line-sound-v1';
	const NOTICE_KEY = 'relay-environment-notice-v1';
	const accessCode = () =>
		[98, 102, 100, 99].map((value) => String.fromCharCode(value ^ 85)).join('');
	const sourceDialog = $('source-dialog');
	const showSourceNotice = () => {
		if (!sourceDialog.open) sourceDialog.showModal();
	};
	$('source-close').addEventListener('click', () => sourceDialog.close());
	document.addEventListener(
		'keydown',
		(event) => {
			const key = event.key.toLowerCase();
			const source = (event.ctrlKey || event.metaKey) && key === 'u';
			const tools =
				event.key === 'F12' ||
				(((event.ctrlKey && event.shiftKey) || (event.metaKey && event.altKey)) &&
					['i', 'j', 'c'].includes(key));
			if (!source && !tools) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			showSourceNotice();
		},
		true
	);
	document.addEventListener('contextmenu', (event) => {
		if (event.pointerType && event.pointerType !== 'mouse') return;
		event.preventDefault();
		showSourceNotice();
	});
	$('environment-start').addEventListener('click', () => {
		try {
			sessionStorage.setItem(NOTICE_KEY, '1');
		} catch {}
		$('environment-dialog').close();
	});
	let sound = { volume: 65, muted: false };
	try {
		const saved = JSON.parse(localStorage.getItem(SOUND_KEY));
		if (saved && Number.isFinite(saved.volume))
			sound = { volume: Math.min(100, Math.max(0, saved.volume)), muted: saved.muted === true };
	} catch {}
	let audio = null;
	let master = null;
	function updateSound() {
		$('volume').value = String(sound.volume);
		$('volume-value').textContent = sound.volume + '%';
		$('mute').setAttribute('aria-pressed', String(sound.muted));
		$('mute').setAttribute('aria-label', sound.muted ? '無音を解除' : '無音にする');
		$('volume').setAttribute('aria-valuetext', sound.volume + '%');
		if (master && audio)
			master.gain.setValueAtTime(sound.muted ? 0 : sound.volume / 100, audio.currentTime);
		try {
			localStorage.setItem(SOUND_KEY, JSON.stringify(sound));
		} catch {}
	}
	function playSound(kind = 'tap') {
		if (sound.muted || sound.volume === 0) return;
		try {
			if (!audio) {
				const Audio = window.AudioContext || window.webkitAudioContext;
				if (!Audio) return;
				audio = new Audio();
				master = audio.createGain();
				master.gain.value = sound.volume / 100;
				master.connect(audio.destination);
			}
			if (audio.state === 'suspended') void audio.resume().catch(() => {});
			const notes = kind === 'success' ? [660, 880] : kind === 'error' ? [220] : [540];
			notes.forEach((frequency, index) => {
				const oscillator = audio.createOscillator();
				const envelope = audio.createGain();
				const start = audio.currentTime + index * 0.12;
				const duration = kind === 'tap' ? 0.045 : 0.12;
				oscillator.type = 'sine';
				oscillator.frequency.value = frequency;
				envelope.gain.setValueAtTime(0, start);
				envelope.gain.linearRampToValueAtTime(0.055, start + 0.008);
				envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
				oscillator.connect(envelope);
				envelope.connect(master);
				oscillator.start(start);
				oscillator.stop(start + duration + 0.01);
				oscillator.onended = () => {
					oscillator.disconnect();
					envelope.disconnect();
				};
			});
		} catch {}
	}
	const settings = $('settings');
	const resetSettingsPosition = () => {
		settings.style.left = '50%';
		settings.style.top = '50%';
		settings.style.transform = 'translate(-50%,-50%)';
	};
	function updateConnectionIndicator() {
		const shielded = settings.open;
		document.body.dataset.settingsOpen = String(shielded);
		document.body.dataset.signal = 's' + (shielded ? 2 : connected ? 0 : 1);
		const label = shielded ? '秘匿中' : connected ? '接続中' : '通信切断';
		$('connection-label').textContent = label;
		$('records-open').setAttribute('aria-label', '通信状態：' + label);
		$('settings-open').setAttribute('aria-expanded', String(shielded));
	}
	$('settings-open').addEventListener('click', () => {
		if (!settings.open) {
			resetSettingsPosition();
			settings.show();
		} else resetSettingsPosition();
		updateConnectionIndicator();
		settings.focus();
	});
	function afterSettingsClose() {
		resetSettingsPosition();
		updateConnectionIndicator();
	}
	$('settings-close').addEventListener('click', () => settings.close());
	settings.addEventListener('close', afterSettingsClose);
	let settingsDrag = null;
	function placeSettings(clientX, clientY) {
		const width = settings.offsetWidth,
			height = settings.offsetHeight;
		const visible = 48;
		const left = Math.min(
			Math.max(-width + visible, clientX - settingsDrag.offsetX),
			innerWidth - visible
		);
		const top = Math.min(Math.max(-20, clientY - settingsDrag.offsetY), innerHeight - visible);
		settings.style.left = left + 'px';
		settings.style.top = top + 'px';
		settings.style.transform = 'none';
	}
	settings.addEventListener('pointerdown', (event) => {
		if (
			(event.pointerType === 'mouse' && event.button !== 0) ||
			event.target.closest('button,a,input,select,textarea,label,output')
		)
			return;
		const box = settings.getBoundingClientRect();
		settingsDrag = {
			id: event.pointerId,
			offsetX: event.clientX - box.left,
			offsetY: event.clientY - box.top
		};
		settings.classList.add('dragging');
		settings.setPointerCapture(event.pointerId);
		placeSettings(event.clientX, event.clientY);
		event.preventDefault();
	});
	settings.addEventListener('pointermove', (event) => {
		if (settingsDrag?.id === event.pointerId) placeSettings(event.clientX, event.clientY);
	});
	function endSettingsDrag(event) {
		if (settingsDrag?.id !== event.pointerId) return;
		settingsDrag = null;
		settings.classList.remove('dragging');
		if (settings.hasPointerCapture(event.pointerId))
			settings.releasePointerCapture(event.pointerId);
	}
	settings.addEventListener('pointerup', endSettingsDrag);
	settings.addEventListener('pointercancel', endSettingsDrag);
	window.addEventListener('resize', () => {
		if (!settings.open || settings.style.transform !== 'none') return;
		const box = settings.getBoundingClientRect();
		settingsDrag = { offsetX: 0, offsetY: 0 };
		placeSettings(box.left, box.top);
		settingsDrag = null;
	});
	$('volume').addEventListener('input', () => {
		sound.volume = Number($('volume').value);
		updateSound();
	});
	$('volume').addEventListener('change', () => playSound());
	let muteTaps = 0,
		lastMuteTap = 0;
	async function openRecords() {
		$('records').showModal();
		for (const id of ['plays', 'clears', 'rate']) $('record-' + id).textContent = '—';
		$('records-message').textContent = '読み込み中…';
		try {
			const totals = await window.relayRecords.summary();
			$('record-plays').textContent = totals.plays.toLocaleString();
			$('record-clears').textContent = totals.clears.toLocaleString();
			$('record-rate').textContent = totals.rate + '%';
			$('records-message').textContent = '';
		} catch {
			$('records-message').textContent = navigator.onLine
				? '記録を取得できません。時間をおいてお試しください。'
				: '通信が切れています。接続後にご確認ください。';
		}
	}
	$('mute').addEventListener('click', () => {
		sound.muted = !sound.muted;
		updateSound();
		if (!sound.muted) playSound();
		const now = Date.now();
		muteTaps = now - lastMuteTap < 1500 ? muteTaps + 1 : 1;
		lastMuteTap = now;
		if (muteTaps === 8) {
			muteTaps = 0;
			void openRecords();
		}
	});
	document.addEventListener('click', (event) => {
		const button = event.target.closest('button');
		if (button && !button.disabled && button.id !== 'mute') playSound();
	});
	updateSound();
	$('records-close').addEventListener('click', () => $('records').close());
	$('records').addEventListener('click', (event) => {
		if (event.target !== $('records')) return;
		const r = $('records').getBoundingClientRect();
		if (
			event.clientX < r.left ||
			event.clientX > r.right ||
			event.clientY < r.top ||
			event.clientY > r.bottom
		)
			$('records').close();
	});
	const reportSignals = { A: 0, B: 1, C: 2 };
	const ids = Object.keys(reportSignals);
	const initial = () => ({ stage: 'entry', opened: [], sent: [] });
	let state = initial();
	try {
		const saved = JSON.parse(sessionStorage.getItem(KEY));
		if (saved && ['entry', 'lobby', 'mission', 'complete'].includes(saved.stage)) {
			const opened = ids.filter((id) => Array.isArray(saved.opened) && saved.opened.includes(id));
			const sent = ids.filter(
				(id) => opened.includes(id) && Array.isArray(saved.sent) && saved.sent.includes(id)
			);
			state = { stage: saved.stage, opened, sent };
		}
	} catch {}
	let connected = navigator.onLine;
	let activeTransfer = null;
	let receiving = false;
	let revision = 0;
	let probeTask = null;
	const save = () => {
		try {
			sessionStorage.setItem(KEY, JSON.stringify(state));
		} catch {}
	};
	const normalize = (value) => value.normalize('NFKC').replace(/\s/g, '').toLowerCase();
	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	function render() {
		document.body.dataset.online = String(connected);
		updateConnectionIndicator();
		for (const stage of ['entry', 'lobby', 'mission', 'complete'])
			$(stage).hidden = state.stage !== stage;
		$('local-note').hidden = connected;
		$('local-code').textContent = connected ? '' : accessCode();
		for (const id of ids) {
			const opened = state.opened.includes(id);
			const sent = state.sent.includes(id);
			const card = $('port-' + id).closest('article');
			card.dataset.opened = String(opened);
			card.dataset.sent = String(sent);
			$('port-' + id).setAttribute(
				'aria-label',
				'資料' + id + (opened ? ' 接続済み' : ' 接続待ち')
			);
			const button = $('transfer-' + id);
			button.disabled = !!activeTransfer;
			button.textContent = activeTransfer === id ? '転送中' : '転送';
			button.setAttribute('aria-label', '資料' + id + 'を本部へ転送');
			button.hidden = !opened || sent;
			$('sent-' + id).hidden = !sent;
		}
		$('receive').disabled = receiving;
		$('share').hidden = !connected;
		$('share-note').hidden = connected;
	}
	const signalLayer = $('signal-layer'),
		signalLines = [$('signal-halo'), $('signal-line')],
		lampButton = $('records-open');
	let signalDrag = null;
	const currentSignal = () => (settings.open ? 2 : connected ? 0 : 1);
	const sizeSignalLayer = () =>
		signalLayer.setAttribute('viewBox', '0 0 ' + innerWidth + ' ' + innerHeight);
	function drawSignal(x1, y1, x2, y2) {
		for (const line of signalLines) {
			line.setAttribute('x1', x1);
			line.setAttribute('y1', y1);
			line.setAttribute('x2', x2);
			line.setAttribute('y2', y2);
		}
	}
	const portAt = (x, y) => {
		let best = null,
			distance = 30;
		for (const port of document.querySelectorAll('[data-port]')) {
			const box = port.getBoundingClientRect();
			const dx = x - (box.left + box.width / 2),
				dy = y - (box.top + box.height / 2),
				next = Math.hypot(dx, dy);
			if (next <= distance) {
				best = port;
				distance = next;
			}
		}
		return best;
	};
	const clearNearPorts = () =>
		document
			.querySelectorAll('[data-port][data-near="true"]')
			.forEach((port) => delete port.dataset.near);
	lampButton.addEventListener('pointerdown', (event) => {
		if ((event.pointerType === 'mouse' && event.button !== 0) || state.stage !== 'mission') return;
		const lamp = lampButton.querySelector('.lamp').getBoundingClientRect();
		const x = lamp.left + lamp.width / 2,
			y = lamp.top + lamp.height / 2;
		sizeSignalLayer();
		signalDrag = { id: event.pointerId, signal: currentSignal(), x, y, moved: false };
		signalLayer.dataset.signal = 's' + signalDrag.signal;
		drawSignal(x, y, x, y);
		lampButton.setPointerCapture(event.pointerId);
	});
	lampButton.addEventListener('pointermove', (event) => {
		if (signalDrag?.id !== event.pointerId) return;
		if (Math.hypot(event.clientX - signalDrag.x, event.clientY - signalDrag.y) > 5) {
			signalDrag.moved = true;
			signalLayer.removeAttribute('hidden');
		}
		clearNearPorts();
		const port = portAt(event.clientX, event.clientY);
		if (port) {
			port.dataset.near = 'true';
			const box = port.getBoundingClientRect();
			drawSignal(signalDrag.x, signalDrag.y, box.left + box.width / 2, box.top + box.height / 2);
		} else drawSignal(signalDrag.x, signalDrag.y, event.clientX, event.clientY);
		event.preventDefault();
	});
	function finishSignalDrag(event, allowDrop = true) {
		if (signalDrag?.id !== event.pointerId) return;
		const drag = signalDrag,
			port = allowDrop ? portAt(event.clientX, event.clientY) : null;
		signalDrag = null;
		signalLayer.setAttribute('hidden', '');
		clearNearPorts();
		if (lampButton.hasPointerCapture(event.pointerId))
			lampButton.releasePointerCapture(event.pointerId);
		if (!drag.moved || state.stage !== 'mission') return;
		if (!port) return;
		const id = port.dataset.port;
		if (!ids.includes(id) || state.opened.includes(id)) return;
		if (reportSignals[id] !== drag.signal) {
			const card = port.closest('.report-card');
			delete card.dataset.error;
			void card.offsetWidth;
			card.dataset.error = 'true';
			setTimeout(() => {
				delete card.dataset.error;
			}, 450);
			playSound('error');
			return;
		}
		state.opened.push(id);
		save();
		render();
		playSound('success');
	}
	lampButton.addEventListener('pointerup', (event) => finishSignalDrag(event));
	lampButton.addEventListener('pointercancel', (event) => finishSignalDrag(event, false));
	lampButton.addEventListener('lostpointercapture', (event) => finishSignalDrag(event, false));
	window.addEventListener('blur', () => {
		if (signalDrag)
			finishSignalDrag({ pointerId: signalDrag.id, clientX: -100, clientY: -100 }, false);
	});
	window.addEventListener('resize', sizeSignalLayer);
	function setConnection(value) {
		const changed = connected !== value;
		connected = value;
		if (changed) revision++;
		if (!connected && activeTransfer) {
			$('transfer-message-' + activeTransfer).textContent =
				'転送できません。通信を確認してください。';
			activeTransfer = null;
		}
		render();
	}
	async function probe() {
		if (!navigator.onLine) return false;
		if (location.protocol === 'file:') return true;
		if (probeTask) return probeTask;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 4000);
		probeTask = (async () => {
			try {
				const response = await fetch('./connection.txt?t=' + Date.now(), {
					cache: 'no-store',
					signal: controller.signal
				});
				return response.ok && (await response.text()).trim() === 'silent-line-ok-v1';
			} catch {
				return false;
			} finally {
				clearTimeout(timeout);
				probeTask = null;
			}
		})();
		return probeTask;
	}
	async function refreshConnection() {
		if (!navigator.onLine) {
			setConnection(false);
			return;
		}
		const snapshot = revision;
		const value = await probe();
		if (snapshot === revision) setConnection(value && navigator.onLine);
	}
	async function transfer(id) {
		if (
			activeTransfer ||
			state.stage !== 'mission' ||
			!state.opened.includes(id) ||
			state.sent.includes(id)
		)
			return;
		const message = $('transfer-message-' + id);
		if (!connected || settings.open) {
			message.textContent = '通信を接続してください。';
			playSound('error');
			return;
		}
		message.textContent = '本部へ接続しています。';
		activeTransfer = id;
		render();
		const snapshot = revision,
			reachable = await probe();
		await wait(650);
		if (activeTransfer !== id) return;
		activeTransfer = null;
		if (!reachable || !navigator.onLine || snapshot !== revision || !connected || settings.open) {
			message.textContent = '転送できません。通信を確認してください。';
			if (!reachable) setConnection(false);
			render();
			playSound('error');
			return;
		}
		state.sent.push(id);
		message.textContent = '';
		if (ids.every((item) => state.sent.includes(item))) {
			state.stage = 'complete';
			save();
			render();
			playSound('success');
			void window.relayRecords?.clear();
			$('complete-title').setAttribute('tabindex', '-1');
			$('complete-title').focus();
		} else {
			save();
			render();
			playSound('success');
		}
	}
	$('enter').addEventListener('click', () => {
		$('password-message').textContent = '';
		$('entry-dialog').showModal();
	});
	$('close-entry').addEventListener('click', () => $('entry-dialog').close());
	$('entry-form').addEventListener('submit', (event) => {
		event.preventDefault();
		if (normalize($('password').value) !== accessCode()) {
			$('password-message').textContent = '認証できません。パスワードを確認してください。';
			playSound('error');
			return;
		}
		state.stage = 'lobby';
		save();
		$('entry-dialog').close();
		render();
	});
	$('receive').addEventListener('click', async () => {
		if (receiving) return;
		$('receive-message').textContent = '';
		if (!connected) {
			$('receive-message').textContent = '本部との回線が切れています。';
			return;
		}
		receiving = true;
		render();
		const snapshot = revision;
		const reachable = await probe();
		await wait(500);
		receiving = false;
		if (state.stage !== 'lobby') {
			render();
			return;
		}
		if (!reachable || !navigator.onLine || snapshot !== revision || !connected) {
			if (!reachable) setConnection(false);
			$('receive-message').textContent = '受信できません。回線の接続を確認してください。';
			render();
			return;
		}
		state.stage = 'mission';
		save();
		render();
	});
	$('reports').addEventListener('click', (event) => {
		const button = event.target.closest('[data-transfer]');
		if (!button || button.disabled) return;
		const id = button.dataset.transfer;
		if (ids.includes(id)) void transfer(id);
	});
	$('restart').addEventListener('click', () => $('restart-dialog').showModal());
	for (const id of ['close-restart', 'cancel-restart'])
		$(id).addEventListener('click', () => $('restart-dialog').close());
	$('confirm-restart').addEventListener('click', () => {
		revision++;
		activeTransfer = null;
		state = initial();
		save();
		$('password').value = '';
		for (const id of [
			'password-message',
			'receive-message',
			...ids.map((id) => 'transfer-message-' + id)
		])
			$(id).textContent = '';
		$('restart-dialog').close();
		render();
	});
	const shareText =
		'WEB謎「RELAY」を解きました！\n\nhttps://sajiqook.jp/game/relayr\n\n#RELAY\n\nhttps://x.com/saji_qook/status/2101446240378741145?s=20';
	$('share').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(shareText);
	window.addEventListener('offline', () => setConnection(false));
	window.addEventListener('online', () => void refreshConnection());
	window.addEventListener('pageshow', () => void refreshConnection());
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') void refreshConnection();
		else if (signalDrag)
			finishSignalDrag({ pointerId: signalDrag.id, clientX: -100, clientY: -100 }, false);
	});
	setInterval(() => {
		if (document.visibilityState === 'visible') void refreshConnection();
	}, 12000);
	render();
	void refreshConnection();
	try {
		if (sessionStorage.getItem(NOTICE_KEY) !== '1') $('environment-dialog').showModal();
	} catch {
		$('environment-dialog').showModal();
	}
	void window.relayRecords?.start();
	if (state.stage === 'complete') void window.relayRecords?.clear();
	window.addEventListener('online', () => void window.relayRecords?.start());
	if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol))
		navigator.serviceWorker.register('./sw.js').catch(() => {});
	if (document.modelContext?.registerTool) {
		try {
			Promise.resolve(
				document.modelContext.registerTool({
					name: 'read_mission_screen',
					description: '現在表示されている任務画面と通信状態を読む。隠された情報は返さない。',
					inputSchema: { type: 'object', properties: {}, additionalProperties: false },
					annotations: { readOnlyHint: true },
					execute: () => ({
						connection: currentSignal().toUpperCase(),
						screen: $(state.stage).innerText
					})
				})
			).catch(() => {});
		} catch {}
	}
})();
