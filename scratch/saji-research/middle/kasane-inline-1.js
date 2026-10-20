(() => {
	'use strict';
	const stages = JSON.parse(atob(document.getElementById('puzzle-data').textContent.trim())).stages;
	const byId = (id) => document.getElementById(id);
	const ui = {
		page: byId('page'),
		steps: byId('steps'),
		sample: byId('sample'),
		zone: byId('zone'),
		stack: byId('stack'),
		result: byId('result'),
		shelf: byId('shelf'),
		held: byId('held'),
		notice: byId('notice'),
		synthesize: byId('synthesize'),
		redo: byId('redo'),
		clearCard: byId('clearCard'),
		clearHandle: byId('clearHandle'),
		clearTitle: byId('clearTitle'),
		next: byId('next'),
		completeText: byId('completeText'),
		status: byId('status'),
		share: byId('share'),
		settingsOpen: byId('settingsOpen'),
		settingsDialog: byId('settingsDialog'),
		settingsClose: byId('settingsClose'),
		seVolume: byId('seVolume'),
		volumeValue: byId('volumeValue'),
		mute: byId('mute'),
		recordDialog: byId('recordDialog'),
		recordClose: byId('recordClose'),
		recordPlays: byId('recordPlays'),
		recordClears: byId('recordClears'),
		recordRate: byId('recordRate'),
		recordStatus: byId('recordStatus')
	};
	const initial = () => ({
		stage: 0,
		unlocked: 0,
		solved: stages.map(() => false),
		items: stages.flatMap((stage, index) =>
			stage.tray.map((part) => ({
				...part,
				origin: index,
				stage: index,
				spot: 'shelf',
				tag: '',
				offset: 0,
				usedBy: null
			}))
		),
		stacks: stages.map(() => []),
		heldId: null,
		heldFrom: null,
		popupOffsets: stages.map(() => ({ x: 0, y: 0 }))
	});
	let state = initial();
	let popupDrag = null;
	let swipe = null;
	let ignorePlateClick = null;
	let redoConfirmStage = null;
	let redoTimer = 0;
	let resetTaps = 0;
	let lastResetTap = 0;
	let audio = null;
	let soundSettings = { volume: 65, muted: false };
	try {
		const saved = JSON.parse(window.localStorage.getItem('hikari-sound-v1'));
		if (saved && Number.isFinite(saved.volume))
			soundSettings.volume = Math.max(0, Math.min(100, saved.volume));
		soundSettings.muted = !!saved?.muted;
	} catch {}
	function saveSound() {
		try {
			window.localStorage.setItem('hikari-sound-v1', JSON.stringify(soundSettings));
		} catch {}
	}
	function renderSound() {
		ui.seVolume.value = soundSettings.volume;
		ui.volumeValue.textContent = `${soundSettings.muted ? 0 : soundSettings.volume}%`;
		ui.mute.textContent = soundSettings.muted ? '解除' : '無音';
		ui.mute.setAttribute('aria-pressed', String(soundSettings.muted));
	}
	function sound(kind) {
		if (soundSettings.muted || !soundSettings.volume || !window.AudioContext) return;
		try {
			audio ||= new window.AudioContext();
			if (audio.state === 'suspended') void audio.resume();
			const oscillator = audio.createOscillator();
			const gain = audio.createGain();
			const now = audio.currentTime;
			const notes = { lift: 440, place: 540, slide: 620, miss: 220, clear: 784, reset: 350 };
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(notes[kind] || 440, now);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(
				Math.max(0.001, (soundSettings.volume / 100) * 0.12),
				now + 0.012
			);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'clear' ? 0.35 : 0.12));
			oscillator.connect(gain).connect(audio.destination);
			oscillator.start(now);
			oscillator.stop(now + (kind === 'clear' ? 0.38 : 0.15));
		} catch {}
	}
	function analytics() {
		if (
			typeof location === 'undefined' ||
			!/^https?:$/.test(location.protocol) ||
			!['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname)
		)
			return;
		if (window.__sajiGameAnalyticsLoaded) return;
		window.__sajiGameAnalyticsLoaded = true;
		const id = 'G-N4MP03VBEC';
		window.dataLayer = window.dataLayer || [];
		window.gtag =
			window.gtag ||
			function () {
				window.dataLayer.push(arguments);
			};
		const tag = document.createElement('script');
		tag.async = true;
		tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
		document.head.append(tag);
		window.gtag('js', new Date());
		window.gtag('config', id, { send_page_view: false });
		window.gtag('event', 'page_view', {
			page_title: document.title,
			page_location: location.href,
			page_path: location.pathname,
			content_group: 'NAZO',
			game_slug: location.pathname.split('/')[2] || 'plates'
		});
	}
	const recordsEnabled =
		typeof location !== 'undefined' &&
		location.protocol === 'https:' &&
		['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname);
	let visitorId = null;
	try {
		visitorId = window.localStorage.getItem('hikari-visitor-v1');
		if (!/^[A-Za-z0-9-]{12,100}$/.test(visitorId || '')) {
			visitorId =
				typeof crypto !== 'undefined' && crypto.randomUUID
					? crypto.randomUUID()
					: `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			window.localStorage.setItem('hikari-visitor-v1', visitorId);
		}
	} catch {
		visitorId = null;
	}
	async function recordRequest(action = 'read') {
		if (!recordsEnabled) throw new Error('preview');
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 7000);
		try {
			const response = await fetch('stats.php', {
				method: action === 'read' ? 'GET' : 'POST',
				credentials: 'same-origin',
				cache: 'no-store',
				signal: controller.signal,
				...(action === 'read'
					? {}
					: {
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ action, visitorId })
						})
			});
			if (!response.ok) throw new Error('unavailable');
			return response.status === 204 ? null : await response.json();
		} finally {
			clearTimeout(timer);
		}
	}
	async function recordPlay() {
		if (!recordsEnabled || !visitorId) return;
		try {
			await recordRequest('visit');
		} catch {}
	}
	async function recordClear() {
		if (!recordsEnabled || !visitorId) return;
		try {
			await recordRequest('clear');
		} catch {}
	}
	async function openRecords() {
		ui.recordPlays.textContent = '—';
		ui.recordClears.textContent = '—';
		ui.recordRate.textContent = '—';
		ui.recordStatus.textContent = '読み込み中…';
		ui.recordDialog.showModal();
		try {
			const counts = await recordRequest();
			if (
				!Number.isSafeInteger(counts.plays) ||
				!Number.isSafeInteger(counts.clears) ||
				counts.plays < 0 ||
				counts.clears < 0 ||
				counts.clears > counts.plays ||
				typeof counts.rate !== 'number' ||
				!Number.isFinite(counts.rate) ||
				counts.rate < 0 ||
				counts.rate > 100
			)
				throw new Error('invalid');
			ui.recordPlays.textContent = counts.plays.toLocaleString('ja-JP');
			ui.recordClears.textContent = counts.clears.toLocaleString('ja-JP');
			ui.recordRate.textContent = `${counts.rate}%`;
			ui.recordStatus.textContent = '全体の記録です。反映に最大60秒ほどかかります。';
		} catch (error) {
			ui.recordStatus.textContent =
				error.message === 'preview'
					? '全体の記録は公開後に利用できます。'
					: '記録を取得できませんでした。時間をおいて開き直してください。';
		}
	}

	function currentStage() {
		return stages[state.stage];
	}
	function itemById(id) {
		return state.items.find((item) => item.id === id);
	}
	function lightMarkup(bits, small = false) {
		return `<span class="lights${small ? ' small-lights' : ''}" style="--count:${bits.length}">${[...bits].map((bit) => `<span class="light${bit === '1' ? ' on' : ''}" aria-hidden="true"></span>`).join('')}</span>`;
	}
	function accessibleName(item) {
		return item.tag
			? `ステージ${item.tag}の完成プレート`
			: `プレート ${[...item.bits].map((bit) => (bit === '1' ? '●' : '○')).join('')}`;
	}
	function pieceMarkup(item) {
		return `<button class="piece" type="button" data-id="${item.id}" aria-label="${accessibleName(item)}を持ち上げる">${lightMarkup(item.bits, true)}</button>`;
	}
	function resultBits(index = state.stage) {
		const turns = Array(stages[index].target.length).fill(0);
		for (const id of state.stacks[index]) {
			const item = itemById(id);
			[...item.bits].forEach((bit, position) => {
				if (bit === '1') turns[position + item.offset] ^= 1;
			});
		}
		return turns.join('');
	}
	function slidePart(id, change) {
		const item = itemById(id);
		if (!item || item.spot !== 'stack' || item.stage !== state.stage || state.solved[state.stage])
			return;
		const limit = currentStage().target.length - item.bits.length;
		item.offset = Math.max(0, Math.min(limit, item.offset + change));
		sound('slide');
		say('');
		render();
	}
	function renderSteps() {
		ui.steps.innerHTML = stages
			.map(
				(_, index) =>
					`<button class="step${index === state.stage ? ' current' : ''}" type="button" data-stage="${index}" ${index > state.unlocked ? 'disabled' : ''} aria-current="${index === state.stage ? 'step' : 'false'}">ステージ${index + 1}</button>`
			)
			.join('');
	}
	function renderRedo() {
		const index = state.stage;
		ui.redo.disabled = !state.solved[index] && state.stacks[index].length === 0;
		const confirming = redoConfirmStage === index;
		ui.redo.textContent = confirming
			? `ステージ${index + 2}以降も戻ります。もう一度押す`
			: 'このステージをやり直す';
		ui.redo.classList.toggle('confirming', confirming);
	}
	function renderPopup() {
		const clear = state.solved[state.stage];
		ui.clearCard.hidden = !clear;
		if (!clear) return;
		ui.clearTitle.textContent = `ステージ${state.stage + 1}クリア！`;
		ui.next.hidden = state.stage === stages.length - 1;
		ui.completeText.hidden = state.stage !== stages.length - 1;
		ui.share.hidden = state.stage !== stages.length - 1;
		ui.clearCard.style.top = `${ui.zone.offsetTop + ui.zone.offsetHeight / 2}px`;
		const offset = state.popupOffsets[state.stage];
		ui.clearCard.style.setProperty('--popup-x', `${offset.x}px`);
		ui.clearCard.style.setProperty('--popup-y', `${offset.y}px`);
	}
	function render() {
		renderSteps();
		ui.sample.innerHTML = lightMarkup(currentStage().target);
		const ids = state.stacks[state.stage];
		ui.stack.innerHTML = ids.length
			? ids
					.map((id) => {
						const item = itemById(id);
						const short = item.bits.length < currentStage().target.length;
						const left = short
							? `<button class="slide" type="button" data-slide="${id}" data-change="-1" aria-label="左へずらす" ${item.offset === 0 || state.solved[state.stage] ? 'disabled' : ''}>‹</button>`
							: `<span class="slide-spacer"></span>`;
						const right = short
							? `<button class="slide" type="button" data-slide="${id}" data-change="1" aria-label="右へずらす" ${item.offset >= currentStage().target.length - item.bits.length || state.solved[state.stage] ? 'disabled' : ''}>›</button>`
							: `<span class="slide-spacer"></span>`;
						return `<div class="stack-row">${left}<span class="plate-track" style="--count:${currentStage().target.length}"><button class="stack-plate" type="button" data-id="${id}" style="--shift:${item.offset}" aria-label="${accessibleName(item)}を持ち上げる">${lightMarkup(item.bits)}</button></span>${right}</div>`;
					})
					.join('')
			: `<span class="zone-placeholder">プレートを置く</span>`;
		ui.result.innerHTML = ids.length
			? lightMarkup(resultBits())
			: `<span class="result-empty">まだ置いていません</span>`;
		ui.synthesize.disabled = state.solved[state.stage];
		renderRedo();
		const onShelf = state.items.filter(
			(item) => item.spot === 'shelf' && item.stage === state.stage
		);
		ui.shelf.innerHTML = onShelf.length
			? onShelf.map(pieceMarkup).join('')
			: `<span class="shelf-empty">プレートはありません</span>`;
		ui.zone.classList.toggle('ready', !!state.heldId);
		ui.shelf.classList.toggle('ready', !!state.heldId);
		ui.held.hidden = !state.heldId;
		if (state.heldId) {
			const held = itemById(state.heldId);
			ui.held.innerHTML = `<span class="held-label">持ち上げ中</span>${pieceMarkup(held)}<button id="returnHeld" class="return" type="button">戻す</button>`;
		} else ui.held.innerHTML = '';
		renderPopup();
	}
	function say(message) {
		ui.notice.textContent = message;
		ui.status.textContent = message;
	}
	function pickUp(id) {
		if (state.heldId) return;
		const item = itemById(id);
		if (!item || item.stage !== state.stage || item.spot === 'held') return;
		state.heldFrom = {
			stage: item.stage,
			spot: item.spot,
			index: state.stacks[state.stage].indexOf(id),
			offset: item.offset
		};
		if (item.spot === 'stack')
			state.stacks[state.stage] = state.stacks[state.stage].filter((partId) => partId !== id);
		item.spot = 'held';
		state.heldId = id;
		sound('lift');
		say('');
		render();
	}
	function putDown(spot) {
		if (!state.heldId) return;
		const item = itemById(state.heldId);
		if (spot === 'stack' && state.solved[state.stage] && item.id !== `unit${state.stage + 1}`) {
			say('完成済みの合成台には置けない');
			return;
		}
		if (spot === 'stack' && item.bits.length > currentStage().target.length) {
			say('この合成台には入らない');
			return;
		}
		item.stage = state.stage;
		item.spot = spot;
		if (spot === 'stack') {
			item.offset = 0;
			state.stacks[state.stage].push(item.id);
		}
		state.heldId = null;
		state.heldFrom = null;
		sound('place');
		say('');
		render();
	}
	function returnHeld() {
		if (!state.heldId) return;
		const item = itemById(state.heldId);
		const from = state.heldFrom;
		item.stage = from.stage;
		item.spot = from.spot;
		item.offset = from.offset;
		if (from.spot === 'stack') state.stacks[from.stage].splice(from.index, 0, item.id);
		state.heldId = null;
		state.heldFrom = null;
		say('');
		render();
	}
	function goTo(index) {
		if (index < 0 || index > state.unlocked || index >= stages.length) return;
		cancelRedoConfirmation();
		state.stage = index;
		say('');
		render();
	}
	function synthesize() {
		if (state.solved[state.stage]) return;
		if (state.stacks[state.stage].length === 0) {
			say('プレートを置こう');
			sound('miss');
			return;
		}
		if (resultBits() !== currentStage().target) {
			say('見本とちがうようだ');
			sound('miss');
			return;
		}
		for (const id of state.stacks[state.stage]) {
			const item = itemById(id);
			item.spot = 'used';
			item.usedBy = state.stage + 1;
		}
		const unit = {
			id: `unit${state.stage + 1}`,
			bits: currentStage().target,
			origin: state.stage,
			stage: state.stage,
			spot: 'stack',
			tag: String(state.stage + 1),
			offset: 0,
			usedBy: null
		};
		state.items.push(unit);
		state.stacks[state.stage] = [unit.id];
		state.solved[state.stage] = true;
		state.unlocked = Math.max(state.unlocked, Math.min(state.stage + 1, stages.length - 1));
		say(`ステージ${state.stage + 1}クリア！`);
		sound('clear');
		if (state.stage === stages.length - 1) {
			void recordClear();
			if (window.gtag)
				window.gtag('event', 'game_clear', {
					game_slug:
						typeof location !== 'undefined' ? location.pathname.split('/')[2] || 'plates' : 'plates'
				});
		}
		render();
	}
	function cancelRedoConfirmation() {
		window.clearTimeout(redoTimer);
		redoTimer = 0;
		redoConfirmStage = null;
	}
	function redoStage(number) {
		if (!Number.isInteger(number) || number < 1 || number > stages.length) return;
		cancelRedoConfirmation();
		state.heldId = null;
		state.heldFrom = null;
		popupDrag = null;
		swipe = null;
		ignorePlateClick = null;
		for (let index = number - 1; index < stages.length; index += 1) {
			state.solved[index] = false;
			state.stacks[index] = [];
			state.popupOffsets[index] = { x: 0, y: 0 };
		}
		state.items = state.items.filter((item) => !item.tag || Number(item.tag) < number);
		for (const item of state.items) {
			if (item.usedBy !== null && item.usedBy < number) continue;
			item.usedBy = null;
			item.offset = 0;
			item.stage = item.origin;
			item.spot = item.tag ? 'stack' : 'shelf';
			if (item.tag) state.stacks[item.origin] = [item.id];
		}
		state.unlocked = number - 1;
		state.stage = number - 1;
		say(`ステージ${number}をやり直した`);
		sound('reset');
		render();
	}
	function requestRedo() {
		const index = state.stage;
		if (!state.solved[index] && state.stacks[index].length === 0) return;
		const laterProgress = stages.some(
			(_, later) => later > index && (state.solved[later] || state.stacks[later].length > 0)
		);
		if (!laterProgress || redoConfirmStage === index) {
			redoStage(index + 1);
			return;
		}
		cancelRedoConfirmation();
		redoConfirmStage = index;
		redoTimer = window.setTimeout(() => {
			redoConfirmStage = null;
			redoTimer = 0;
			renderRedo();
		}, 3000);
		renderRedo();
	}
	function movePopup() {
		const offset = state.popupOffsets[state.stage];
		const section = ui.clearCard.parentElement;
		const maxX = Math.max(0, (ui.page.clientWidth - ui.clearCard.offsetWidth) / 2 - 8);
		const baseY = section.offsetTop + ui.zone.offsetTop + ui.zone.offsetHeight / 2;
		const minY = ui.clearCard.offsetHeight / 2 + 8 - baseY;
		const maxY = ui.page.offsetHeight - ui.clearCard.offsetHeight / 2 - 8 - baseY;
		offset.x = Math.max(-maxX, Math.min(maxX, offset.x));
		offset.y = Math.max(minY, Math.min(maxY, offset.y));
		ui.clearCard.style.setProperty('--popup-x', `${offset.x}px`);
		ui.clearCard.style.setProperty('--popup-y', `${offset.y}px`);
	}

	ui.steps.addEventListener('click', (event) => {
		const button = event.target.closest('[data-stage]');
		if (button) goTo(Number(button.dataset.stage));
	});
	ui.shelf.addEventListener('click', (event) => {
		if (state.heldId) {
			putDown('shelf');
			return;
		}
		const button = event.target.closest('[data-id]');
		if (button) pickUp(button.dataset.id);
	});
	ui.zone.addEventListener('click', (event) => {
		const slide = event.target.closest('[data-slide]');
		if (slide) {
			slidePart(slide.dataset.slide, Number(slide.dataset.change));
			return;
		}
		const button = event.target.closest('[data-id]');
		if (button && ignorePlateClick === button.dataset.id) {
			ignorePlateClick = null;
			return;
		}
		if (state.heldId) {
			putDown('stack');
			return;
		}
		if (button) pickUp(button.dataset.id);
	});
	ui.zone.addEventListener('pointerdown', (event) => {
		const button = event.target.closest('.stack-plate');
		if (!button || state.solved[state.stage]) return;
		const item = itemById(button.dataset.id);
		if (item.bits.length >= currentStage().target.length) return;
		swipe = { id: item.id, pointerId: event.pointerId, x: event.clientX };
	});
	ui.zone.addEventListener('pointerup', (event) => {
		if (!swipe || swipe.pointerId !== event.pointerId) return;
		const current = swipe;
		swipe = null;
		const distance = event.clientX - current.x;
		if (Math.abs(distance) < 25) return;
		ignorePlateClick = current.id;
		window.setTimeout(() => {
			if (ignorePlateClick === current.id) ignorePlateClick = null;
		}, 350);
		slidePart(current.id, distance > 0 ? 1 : -1);
	});
	ui.zone.addEventListener('pointercancel', () => {
		swipe = null;
	});
	ui.zone.addEventListener('keydown', (event) => {
		if (event.target !== ui.zone || !['Enter', ' '].includes(event.key)) return;
		event.preventDefault();
		if (state.heldId) putDown('stack');
	});
	ui.held.addEventListener('click', (event) => {
		if (event.target.closest('#returnHeld')) returnHeld();
	});
	ui.synthesize.addEventListener('click', synthesize);
	ui.redo.addEventListener('click', requestRedo);
	ui.next.addEventListener('click', () => goTo(state.stage + 1));
	ui.share.addEventListener('click', () => {
		const message = [
			'WEB謎「kasane」を解きました！',
			'https://sajiqook.jp/game/kasane',
			'',
			'#kasane',
			'https://x.com/saji_qook/status/2103661567275638797?s=20'
		].join('\n');
		window.open(
			`https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
			'_blank',
			'noopener,noreferrer'
		);
	});
	ui.settingsOpen.addEventListener('click', () => ui.settingsDialog.showModal());
	ui.settingsClose.addEventListener('click', () => ui.settingsDialog.close());
	ui.seVolume.addEventListener('input', () => {
		soundSettings.volume = Number(ui.seVolume.value);
		soundSettings.muted = false;
		renderSound();
		saveSound();
		sound('slide');
	});
	ui.mute.addEventListener('click', () => {
		soundSettings.muted = !soundSettings.muted;
		renderSound();
		saveSound();
		if (!soundSettings.muted) sound('place');
	});
	ui.recordClose.addEventListener('click', () => ui.recordDialog.close());
	for (const dialog of [ui.settingsDialog, ui.recordDialog]) {
		dialog.addEventListener('click', (event) => {
			if (event.target !== dialog) return;
			const box = dialog.getBoundingClientRect();
			if (
				event.clientX < box.left ||
				event.clientX > box.right ||
				event.clientY < box.top ||
				event.clientY > box.bottom
			)
				dialog.close();
		});
	}
	byId('reset').addEventListener('click', () => {
		const now = Date.now();
		resetTaps = now - lastResetTap < 1600 ? resetTaps + 1 : 1;
		lastResetTap = now;
		cancelRedoConfirmation();
		state = initial();
		popupDrag = null;
		swipe = null;
		ignorePlateClick = null;
		say('');
		sound('reset');
		render();
		if (resetTaps >= 8) {
			resetTaps = 0;
			void openRecords();
		}
	});
	ui.clearHandle.addEventListener('pointerdown', (event) => {
		event.preventDefault();
		popupDrag = {
			pointerId: event.pointerId,
			stage: state.stage,
			x: event.clientX,
			y: event.clientY,
			origin: { ...state.popupOffsets[state.stage] }
		};
		ui.clearHandle.setPointerCapture(event.pointerId);
	});
	ui.clearHandle.addEventListener('pointermove', (event) => {
		if (!popupDrag || popupDrag.pointerId !== event.pointerId) return;
		const offset = state.popupOffsets[popupDrag.stage];
		offset.x = popupDrag.origin.x + event.clientX - popupDrag.x;
		offset.y = popupDrag.origin.y + event.clientY - popupDrag.y;
		movePopup();
	});
	for (const name of ['pointerup', 'pointercancel'])
		ui.clearHandle.addEventListener(name, () => {
			popupDrag = null;
		});
	ui.clearHandle.addEventListener('keydown', (event) => {
		const step = event.shiftKey ? 30 : 12;
		const movements = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step]
		};
		if (!movements[event.key]) return;
		event.preventDefault();
		state.popupOffsets[state.stage].x += movements[event.key][0];
		state.popupOffsets[state.stage].y += movements[event.key][1];
		movePopup();
	});
	window.addEventListener('resize', movePopup);
	renderSound();
	analytics();
	void recordPlay();
	render();
})();
