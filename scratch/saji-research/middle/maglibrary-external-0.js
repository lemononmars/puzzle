(() => {
	'use strict';

	const footprint = [
		'.#..#..#.',
		'#########',
		'.#..#..#.',
		'.#..#..#.',
		'#########',
		'.#..#..#.',
		'.#..#..#.',
		'###.#.###',
		'.#..#..#.',
		'....#....',
		'.#.##....'
	];

	const packedRooms =
		'W3siMSI6IuOBhiIsIjQiOiLjgY8iLCI3Ijoi44GZIn0seyIwIjoi44GEIiwiMSI6IuOBgiIsIjIiOiLjgYgiLCIzIjoi44GNIiwiNCI6IuOBiyIsIjUiOiLjgZEiLCI2Ijoi44GXIiwiNyI6IuOBlSIsIjgiOiLjgZsifSx7IjEiOiLjgYoiLCI0Ijoi44GTIiwiNyI6IuOBnSJ9LHsiMSI6IuOBpCIsIjQiOiLjgawiLCI3Ijoi44G1In0seyIwIjoi44GhIiwiMSI6IuOBnyIsIjIiOiLjgaYiLCIzIjoi44GrIiwiNCI6IuOBqiIsIjUiOiLjga0iLCI2Ijoi44GyIiwiNyI6IuOBryIsIjgiOiLjgbgifSx7IjEiOiLjgagiLCI0Ijoi44GuIiwiNyI6IuOBuyJ9LHsiMSI6IuOCgCIsIjQiOiLjgoYiLCI3Ijoi44KLIn0seyIwIjoi44G/IiwiMSI6IuOBviIsIjIiOiLjgoEiLCI0Ijoi44KEIiwiNiI6IuOCiiIsIjciOiLjgokiLCI4Ijoi44KMIn0seyIxIjoi44KCIiwiNCI6IuOCiCIsIjciOiLjgo0ifSx7IjQiOiLjgpMifSx7IjEiOiJzZWNyZXQiLCIzIjoi44KSIiwiNCI6IuOCjyJ9XQ==';
	const kanaRows = JSON.parse(
		new TextDecoder().decode(Uint8Array.from(atob(packedRooms), (char) => char.charCodeAt(0)))
	);
	const label = (...points) => String.fromCharCode(...points);

	const chapters = [
		{
			word: label(12411, 12375),
			title: '第一章 / はじめての探索',
			copy: '光る部屋へ歩き、書架を調べましょう。',
			count: 2,
			signature: '44G7H+OBlw==',
			ending: '本の文字が、静かに光りました。'
		},
		{
			word: label(12414, 12411, 12358),
			title: '第二章 / 光のない探索',
			copy: '',
			count: 3,
			signature: '44G+H+OBux/jgYY=',
			ending: '「まほう」を覚えました。魔法の手帖を開いてみましょう。'
		},
		{
			word: label(12426, 12421, 12358),
			title: '第三章 / 秘密の部屋',
			copy: '',
			count: 4,
			signature: '44KKH+OChh9zZWNyZXQf44GG',
			ending: '見習い司書の最初の三冊が、書架にそろいました。'
		}
	];
	const specialBook = {
		word: label(12392, 12367, 12375, 12421, 12414, 12411, 12358),
		title: 'もう一冊の本',
		copy: '',
		count: 8,
		signature: '44GoH+OBjx/jgZcf44KGH3NlY3JldB/jgb4f44G7H+OBhg==',
		ending: 'とくしゅまほうを覚えました。'
	};

	const $ = (selector) => document.querySelector(selector);
	const els = {
		board: $('#board'),
		boardOuter: $('#boardOuter'),
		rooms: $('#rooms'),
		avatar: $('#avatar'),
		edgeExit: $('#edgeExit'),
		exploreTab: $('#exploreTab'),
		magicTab: $('#magicTab'),
		explorePanel: $('#explorePanel'),
		magicPanel: $('#magicPanel'),
		chapterNumber: $('#chapterNumber'),
		storyTitle: $('#storyTitle'),
		storyCopy: $('#storyCopy'),
		bookSelect: $('#bookSelect'),
		searchButton: $('#searchButton'),
		letterSlots: $('#letterSlots'),
		returnFragmentButton: $('#returnFragmentButton'),
		trackFill: $('#trackFill'),
		trackSteps: [...document.querySelectorAll('.track-step')],
		teleportButton: $('#teleportButton'),
		specialMagicToggle: $('#specialMagicToggle'),
		specialMagicList: $('#specialMagicList'),
		specialSpells: [...document.querySelectorAll('.special-spell')],
		messageToast: $('#messageToast'),
		chapterOverlay: $('#chapterOverlay'),
		completionEyebrow: $('#completionEyebrow'),
		completionTitle: $('#completionTitle'),
		completionCopy: $('#completionCopy'),
		nextChapterButton: $('#nextChapterButton'),
		shareButton: $('#shareButton'),
		guideOpen: $('#guideOpen'),
		guideDialog: $('#guideDialog'),
		guideClose: $('#guideClose'),
		settingsOpen: $('#settingsOpen'),
		settingsDialog: $('#settingsDialog'),
		settingsClose: $('#settingsClose'),
		seVolume: $('#seVolume'),
		volumeValue: $('#volumeValue'),
		muteButton: $('#muteButton'),
		recordDialog: $('#recordDialog'),
		recordClose: $('#recordClose'),
		recordPlays: $('#recordPlays'),
		recordClears: $('#recordClears'),
		recordSpecialClears: $('#recordSpecialClears'),
		recordRate: $('#recordRate'),
		recordStatus: $('#recordStatus')
	};

	const key = (row, col) => `${row},${col}`;
	const rooms = new Map();
	const aDanKana = new Set('あかさたなはまやらわ');
	const state = {
		row: 1,
		col: 4,
		chapter: 0,
		activeBook: 'chapter',
		progress: 0,
		attempts: { 0: [], 1: [], 2: [], special: [] },
		foundBooks: new Set(),
		checking: false,
		unlocked: false,
		specialUnlocked: false,
		illuminated: false,
		floating: false,
		lastSpecialUsed: null,
		shareMode: 'normal',
		gameCleared: false,
		specialUsed: false,
		overlayAction: 'advance',
		inSecret: false,
		returnTo: null,
		moving: false,
		complete: false,
		tab: 'explore'
	};
	let toastTimer = 0;
	let checkTimer = 0;
	let frameGlowTimer = 0;
	let lightFrame = 0;
	let positionFrame = 0;
	let bookSelectPointerChoice = false;
	const smallKana = new Set(['あ', 'い', 'う', 'え', 'お', 'つ', 'や', 'ゆ', 'よ', 'わ']);
	const activeKey = () =>
		state.activeBook === 'chapter'
			? String(state.chapter)
			: state.activeBook === 'magic'
				? '1'
				: 'special';
	const activeBook = () =>
		state.activeBook === 'chapter'
			? chapters[state.chapter]
			: state.activeBook === 'magic'
				? chapters[1]
				: specialBook;
	const activeAttempt = () => state.attempts[activeKey()];
	function attemptSignature(attempt) {
		const bytes = new TextEncoder().encode(attempt.join('\u001f'));
		return btoa(String.fromCharCode(...bytes));
	}
	let soundSettings = { volume: 65, muted: false };
	try {
		const saved = JSON.parse(localStorage.getItem('maglibrary-sound-v1'));
		if (Number.isFinite(saved?.volume))
			soundSettings.volume = Math.max(0, Math.min(100, saved.volume));
		soundSettings.muted = !!saved?.muted;
	} catch {}
	let audioContext = null;
	let muteTaps = 0;
	let lastMuteTap = 0;
	const recordsEnabled =
		location.protocol === 'https:' &&
		['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname);
	let visitorId = null;
	try {
		visitorId = localStorage.getItem('maglibrary-visitor-v1');
		if (!/^[A-Za-z0-9-]{12,100}$/.test(visitorId || '')) {
			visitorId =
				crypto.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			localStorage.setItem('maglibrary-visitor-v1', visitorId);
		}
	} catch {
		visitorId = null;
	}

	function renderSoundSettings() {
		els.seVolume.value = soundSettings.volume;
		els.volumeValue.textContent = `${soundSettings.muted ? 0 : soundSettings.volume}%`;
		els.muteButton.setAttribute('aria-pressed', String(soundSettings.muted));
	}

	function saveSoundSettings() {
		try {
			localStorage.setItem('maglibrary-sound-v1', JSON.stringify(soundSettings));
		} catch {}
		renderSoundSettings();
	}

	function sound(kind = 'tap') {
		if (soundSettings.muted || !soundSettings.volume || !window.AudioContext) return;
		try {
			audioContext ||= new AudioContext();
			if (audioContext.state === 'suspended') void audioContext.resume();
			if (kind === 'move' || kind === 'success') {
				const now = audioContext.currentTime;
				const volume = soundSettings.volume / 100;
				const notes =
					kind === 'move'
						? [
								[0, 190, 0.075],
								[0.12, 165, 0.075]
							]
						: [
								[0, 523, 0.24],
								[0.13, 659, 0.24],
								[0.26, 784, 0.42]
							];
				notes.forEach(([offset, frequency, length]) => {
					const oscillator = audioContext.createOscillator();
					const gain = audioContext.createGain();
					const start = now + offset;
					oscillator.type = kind === 'move' ? 'triangle' : 'sine';
					oscillator.frequency.setValueAtTime(frequency, start);
					if (kind === 'move')
						oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.58, start + length);
					gain.gain.setValueAtTime(0.0001, start);
					gain.gain.exponentialRampToValueAtTime(
						Math.max(0.001, volume * (kind === 'move' ? 0.11 : 0.1)),
						start + 0.008
					);
					gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
					oscillator.connect(gain).connect(audioContext.destination);
					oscillator.start(start);
					oscillator.stop(start + length + 0.01);
					if (kind === 'move') {
						const click = audioContext.createOscillator();
						const clickGain = audioContext.createGain();
						click.type = 'square';
						click.frequency.setValueAtTime(520, start);
						clickGain.gain.setValueAtTime(0.0001, start);
						clickGain.gain.exponentialRampToValueAtTime(
							Math.max(0.001, volume * 0.025),
							start + 0.003
						);
						clickGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.025);
						click.connect(clickGain).connect(audioContext.destination);
						click.start(start);
						click.stop(start + 0.03);
					}
				});
				return;
			}
			const oscillator = audioContext.createOscillator();
			const gain = audioContext.createGain();
			const now = audioContext.currentTime;
			oscillator.type = 'sine';
			oscillator.frequency.value = { tap: 470, spell: 820, miss: 220 }[kind] || 470;
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(
				Math.max(0.001, (soundSettings.volume / 100) * 0.09),
				now + 0.015
			);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'spell' ? 0.32 : 0.13));
			oscillator.connect(gain).connect(audioContext.destination);
			oscillator.start(now);
			oscillator.stop(now + (kind === 'spell' ? 0.35 : 0.16));
		} catch {}
	}

	async function recordRequest(action = 'read', specialUsed = false) {
		if (!recordsEnabled) throw new Error('preview');
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 7000);
		try {
			const response = await fetch('./stats.php', {
				method: action === 'read' ? 'GET' : 'POST',
				credentials: 'same-origin',
				cache: 'no-store',
				signal: controller.signal,
				...(action === 'read'
					? {}
					: {
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								action,
								visitorId,
								...(action === 'clear' ? { specialUsed } : {})
							})
						})
			});
			if (!response.ok) throw new Error('unavailable');
			return response.status === 204 ? null : await response.json();
		} finally {
			clearTimeout(timeout);
		}
	}

	async function recordPlay() {
		if (!recordsEnabled || !visitorId) return;
		try {
			await recordRequest('visit');
		} catch {}
	}

	async function recordClear(specialUsed = false) {
		if (!recordsEnabled || !visitorId) return;
		try {
			await recordRequest('clear', specialUsed);
		} catch {}
	}

	async function showRecords() {
		els.recordPlays.textContent = '—';
		els.recordClears.textContent = '—';
		els.recordSpecialClears.textContent = '—';
		els.recordRate.textContent = '—';
		els.recordStatus.textContent = '読み込み中…';
		els.settingsDialog.close();
		els.recordDialog.showModal();
		try {
			const totals = await recordRequest();
			if (
				!Number.isSafeInteger(totals.plays) ||
				!Number.isSafeInteger(totals.clears) ||
				!Number.isSafeInteger(totals.specialClears) ||
				totals.plays < 0 ||
				totals.clears < 0 ||
				totals.clears > totals.plays ||
				totals.specialClears < 0 ||
				totals.specialClears > totals.clears ||
				!Number.isFinite(totals.rate) ||
				totals.rate < 0 ||
				totals.rate > 100
			)
				throw new Error('invalid');
			els.recordPlays.textContent = totals.plays.toLocaleString('ja-JP');
			els.recordClears.textContent = totals.clears.toLocaleString('ja-JP');
			els.recordSpecialClears.textContent = totals.specialClears.toLocaleString('ja-JP');
			els.recordRate.textContent = `${totals.rate}%`;
			els.recordStatus.textContent = '公開ページ全体の記録です。';
		} catch (error) {
			els.recordStatus.textContent =
				error.message === 'preview'
					? '全体の記録は公開後に利用できます。'
					: '記録を取得できませんでした。';
		}
	}

	function createRooms() {
		footprint.forEach((line, row) =>
			[...line].forEach((mark, col) => {
				if (mark !== '#') return;
				const id = key(row, col);
				const name = kanaRows[row][col];
				if (!name) throw new Error(`No kana in occupied room ${id}`);
				const button = document.createElement('button');
				button.className = `room${name === 'secret' ? ' is-secret' : ''}${aDanKana.has(name) ? ' is-a-dan' : ''}`;
				button.type = 'button';
				button.style.gridRow = String(row + 1);
				button.style.gridColumn = String(col + 1);
				button.setAttribute(
					'aria-label',
					name === 'secret' ? '離れた秘密の部屋' : `${row + 1}行${col + 1}列の部屋`
				);
				button.addEventListener('click', () => chooseRoom(row, col));
				els.rooms.append(button);
				rooms.set(id, { row, col, name, button });
			})
		);
	}

	function syncLightToAvatar() {
		const style = getComputedStyle(els.avatar);
		const x = Number.parseFloat(style.left) + els.avatar.offsetWidth / 2;
		const y = Number.parseFloat(style.top) + els.avatar.offsetHeight * 0.79;
		els.board.style.setProperty('--glow-x', `${x}px`);
		els.board.style.setProperty('--glow-y', `${y}px`);
	}

	function trackMovingLight() {
		syncLightToAvatar();
		lightFrame = state.moving ? requestAnimationFrame(trackMovingLight) : 0;
	}

	function positionAvatar(instant = false) {
		const reference = rooms.get(key(1, 4)).button;
		const neighbour = rooms.get(key(1, 5)).button;
		const tile = reference.offsetWidth;
		const step = neighbour.offsetLeft - reference.offsetLeft;
		const avatarWidth = els.avatar.offsetWidth;
		const avatarHeight = els.avatar.offsetHeight;
		if (
			!tile ||
			!step ||
			!avatarWidth ||
			!avatarHeight ||
			!els.boardOuter.clientWidth ||
			!els.boardOuter.clientHeight
		)
			return;
		const x = reference.offsetLeft + (state.col - 4) * step + tile / 2;
		const y = reference.offsetTop + (state.row - 1) * step + tile / 2;
		if (instant) {
			els.avatar.style.transition = 'none';
			els.board.style.transition = 'none';
		}
		els.avatar.style.left = `${x - avatarWidth / 2}px`;
		els.avatar.style.top = `${y - avatarHeight * 0.79}px`;
		const scale = state.illuminated ? 0.72 : 1;
		const cameraX = Math.round(els.boardOuter.clientWidth / 2 - x * scale);
		const cameraY = Math.round(els.boardOuter.clientHeight / 2 - y * scale);
		els.board.style.transform = `translate3d(${cameraX}px, ${cameraY}px, 0) scale(${scale})`;
		syncLightToAvatar();
		rooms.forEach((room) => {
			const visible =
				Math.abs(room.row - state.row) <= (state.illuminated ? 4 : 2) &&
				Math.abs(room.col - state.col) <= (state.illuminated ? 4 : 2);
			room.button.tabIndex = visible ? 0 : -1;
			room.button.setAttribute('aria-hidden', String(!visible));
			if (!visible && document.activeElement === room.button) room.button.blur();
		});
		els.board.classList.add('is-ready');
		if (instant) {
			void els.board.offsetWidth;
			requestAnimationFrame(() => {
				els.avatar.style.transition = '';
				els.board.style.transition = '';
			});
		}
	}

	function queuePosition() {
		if (positionFrame) return;
		positionFrame = requestAnimationFrame(() => {
			positionFrame = 0;
			positionAvatar(true);
		});
	}

	function shortestPath(from, to) {
		const start = key(from.row, from.col);
		const finish = key(to.row, to.col);
		if (start === finish) return [];
		if (!rooms.has(start) || !rooms.has(finish)) return null;
		const queue = [start];
		const before = new Map([[start, null]]);
		for (let head = 0; head < queue.length; head += 1) {
			const current = rooms.get(queue[head]);
			for (const [dr, dc] of [
				[-1, 0],
				[1, 0],
				[0, -1],
				[0, 1]
			]) {
				const nextId = key(current.row + dr, current.col + dc);
				const next = rooms.get(nextId);
				if (!next || next.name === 'secret' || before.has(nextId)) continue;
				before.set(nextId, queue[head]);
				if (nextId === finish) {
					const path = [];
					for (let cursor = finish; cursor !== start; cursor = before.get(cursor))
						path.unshift(rooms.get(cursor));
					return path;
				}
				queue.push(nextId);
			}
		}
		return null;
	}

	function nearestGroundPosition(row, col) {
		let nearest = null;
		let distance = Infinity;
		for (const room of rooms.values()) {
			if (room.name === 'secret') continue;
			const nextDistance = Math.abs(room.row - row) + Math.abs(room.col - col);
			if (nextDistance < distance) {
				nearest = room;
				distance = nextDistance;
			}
		}
		return nearest;
	}

	function chooseRoom(row, col) {
		if (state.moving || state.checking || state.complete || !els.chapterOverlay.hidden) return;
		const target = rooms.get(key(row, col));
		if (!target) return;
		if (state.floating) {
			if (target.name === 'secret' && !state.inSecret)
				state.returnTo = { row: state.row, col: state.col };
			state.inSecret = target.name === 'secret';
			moveAlong([target]);
			return;
		}
		if (target.name === 'secret') {
			switchTab('magic');
			if (!state.unlocked) toast('ここへ入るには「まほう」が必要です。');
			return;
		}
		if (state.inSecret) {
			switchTab('magic');
			return;
		}
		const path = shortestPath(state, target);
		if (path?.length) moveAlong(path);
	}

	async function moveAlong(path) {
		state.moving = true;
		if (!lightFrame) lightFrame = requestAnimationFrame(trackMovingLight);
		els.avatar.classList.add('is-walking');
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const duration = reduced ? 5 : 245;
		for (const room of path) {
			let direction = 'down';
			if (room.col < state.col) direction = 'left';
			else if (room.col > state.col) direction = 'right';
			else if (room.row < state.row) direction = 'up';
			els.avatar.classList.remove(
				'is-facing-left',
				'is-facing-right',
				'is-facing-up',
				'is-facing-down'
			);
			els.avatar.classList.add(`is-facing-${direction}`);
			state.row = room.row;
			state.col = room.col;
			positionAvatar();
			if (!state.floating && !reduced) sound('move');
			await new Promise((resolve) => setTimeout(resolve, duration));
			if (state.complete) break;
		}
		state.moving = false;
		els.avatar.classList.remove('is-walking');
		updateRoute();
		renderStory();
		if (state.floating && state.row === 10 && state.col === 8) leaveByAir();
	}

	function searchCurrentRoom() {
		const book = activeBook();
		const attempt = activeAttempt();
		if (
			state.moving ||
			state.checking ||
			state.complete ||
			!els.chapterOverlay.hidden ||
			state.foundBooks.has(activeKey()) ||
			attempt.length >= book.count
		)
			return;
		switchTab('explore');
		const room = rooms.get(key(state.row, state.col));
		if (!room) {
			toast('ここには書架がありません。');
			return;
		}
		if (room.name === 'secret' && !smallKana.has(attempt.at(-1))) {
			toast('この部屋のかけらは、直前に入力した本のかけらに影響を及ぼすようだ。', 4200);
			return;
		}
		room.button.classList.add('is-visited');
		attempt.push(room.name);
		state.progress = attempt.length;
		renderStory();
		toast('本のかけらを入力しました');
		if (attempt.length === book.count) {
			state.checking = true;
			renderStory();
			checkTimer = setTimeout(() => {
				checkTimer = 0;
				if (attemptSignature(attempt) === book.signature) {
					state.checking = false;
					finishBook(activeKey());
				} else {
					state.checking = false;
					renderStory();
					toast('本のかけらがそろいませんでした。');
				}
			}, 1050);
		}
	}

	function returnFragment() {
		const attempt = activeAttempt();
		if (state.moving || state.complete || !els.chapterOverlay.hidden || !attempt.length) return;
		clearTimeout(checkTimer);
		checkTimer = 0;
		state.checking = false;
		attempt.pop();
		state.progress = attempt.length;
		renderStory();
		toast('かけらを一つ消しました');
	}

	function showCurrentBookRooms(index) {
		if (
			index > 1 ||
			(index === 0 && state.chapter !== 0 && !state.foundBooks.has('0')) ||
			(index === 1 && state.chapter < 1 && !state.foundBooks.has('1')) ||
			state.complete ||
			!els.chapterOverlay.hidden
		)
			return;
		clearTimeout(frameGlowTimer);
		rooms.forEach((room) => room.button.classList.remove('is-book-hint'));
		const hints = new Set([...chapters[index].word]);
		for (const room of rooms.values()) {
			if (hints.has(room.name)) room.button.classList.add('is-book-hint');
		}
		frameGlowTimer = setTimeout(
			() => rooms.forEach((room) => room.button.classList.remove('is-book-hint')),
			5000
		);
	}

	function hasUnexpectedFragment(attempt, word) {
		const expected = [...word];
		return attempt.some((name, index) => name !== expected[index]);
	}

	function updateRoute() {
		rooms.forEach((room) => room.button.classList.remove('is-route', 'is-goal'));
		if (
			state.chapter !== 0 ||
			state.activeBook !== 'chapter' ||
			state.complete ||
			state.illuminated
		)
			return;
		if (hasUnexpectedFragment(state.attempts[0], chapters[0].word)) return;
		const wanted = [12411, 12375].map((code) => String.fromCharCode(code))[
			state.attempts[0].length
		];
		const target = [...rooms.values()].find((room) => room.name === wanted);
		if (!target) return;
		const path = shortestPath(state, target) || [];
		path.forEach((room) => room.button.classList.add('is-route'));
		target.button.classList.add('is-goal');
	}

	function refinementState(attempt) {
		let visibleCount = 0;
		let precedingKana = null;
		const refinedIndices = new Set();
		for (const name of attempt) {
			if (name === 'secret') {
				if (visibleCount && smallKana.has(precedingKana)) refinedIndices.add(visibleCount - 1);
			} else {
				visibleCount += 1;
			}
			precedingKana = name;
		}
		return { visibleCount, refinedIndices };
	}

	function renderStory() {
		const book = activeBook();
		const attempt = activeAttempt();
		const found = state.foundBooks.has(activeKey());
		els.chapterNumber.textContent =
			state.activeBook === 'chapter'
				? book.title
				: book.title === chapters[1].title
					? 'もう一冊の本'
					: book.title;
		els.storyTitle.textContent = found
			? `「${book.word}」の本を送った`
			: state.activeBook === 'chapter'
				? `「${book.word}」の本を探そう`
				: '名のない本を探そう';
		els.storyCopy.textContent = state.activeBook === 'chapter' ? book.copy : '';
		els.storyCopy.hidden = !els.storyCopy.textContent;
		els.bookSelect.options[0].textContent = `いまの本${state.foundBooks.has(String(state.chapter)) ? ' ✓' : ''}`;
		els.bookSelect.options[1].textContent = state.foundBooks.has('1') ? 'まほうの本 ✓' : '別の本 Ⅰ';
		els.bookSelect.options[2].textContent = state.foundBooks.has('special')
			? 'とくしゅまほうの本 ✓'
			: '別の本 Ⅱ';
		els.bookSelect.value = state.activeBook;
		els.letterSlots.replaceChildren();
		const { visibleCount, refinedIndices } = refinementState(attempt);
		[...book.word].forEach((_, index) => {
			const slot = document.createElement('span');
			slot.className = 'letter-slot';
			const hasFragment = visibleCount > index;
			slot.textContent = '？';
			if (hasFragment) slot.classList.add('is-found');
			if (refinedIndices.has(index)) slot.classList.add('is-smallified');
			slot.setAttribute(
				'aria-label',
				hasFragment ? '手に取ったかけら' : 'まだ手に取っていないかけら'
			);
			els.letterSlots.append(slot);
		});
		els.returnFragmentButton.disabled = attempt.length === 0 || state.complete || found;
		els.searchButton.disabled =
			state.moving || state.checking || state.complete || found || attempt.length >= book.count;
		els.trackFill.style.width = `${(state.chapter / 2) * 100}%`;
		els.trackSteps.forEach((step, index) => {
			step.classList.toggle('is-current', index === state.chapter);
			step.classList.toggle(
				'is-done',
				index < state.chapter || state.foundBooks.has(String(index))
			);
			step.disabled =
				state.complete ||
				(index === 0
					? state.chapter !== 0 && !state.foundBooks.has('0')
					: index === 1
						? state.chapter < 1 && !state.foundBooks.has('1')
						: true);
		});
		renderMagic();
		updateRoute();
	}

	function renderMagic() {
		els.edgeExit.tabIndex = state.floating && !state.complete ? 0 : -1;
		els.teleportButton.disabled = !state.unlocked || state.moving || state.checking;
		els.teleportButton.textContent = !state.unlocked
			? 'まだ使えない'
			: state.inSecret
				? '元の書架へもどる'
				: '秘密の部屋へ';
		const spellNames = ['ルーモフ', 'ミンガーディアム・レピオーサ', 'アバダ・ケバブダ'];
		els.specialSpells.forEach((button, index) => {
			button.textContent = state.specialUnlocked
				? spellNames[index]
				: [...spellNames[index]].map((char) => (char === '・' ? '・' : '？')).join('');
			button.disabled = !state.specialUnlocked || state.moving || state.checking;
			const active = index === 0 ? state.illuminated : index === 1 ? state.floating : false;
			button.classList.toggle('is-active', active);
			if (index < 2) button.setAttribute('aria-pressed', String(active));
		});
	}

	function finishBook(bookKey) {
		state.complete = true;
		state.foundBooks.add(bookKey);
		sound('success');
		if (bookKey === '1') state.unlocked = true;
		if (bookKey === 'special') state.specialUnlocked = true;
		els.returnFragmentButton.disabled = true;
		els.searchButton.disabled = true;
		renderMagic();
		const book = bookKey === 'special' ? specialBook : chapters[Number(bookKey)];
		const isMainBook = bookKey !== 'special' && bookKey === String(state.chapter);
		const final = bookKey === '2' && isMainBook;
		els.completionEyebrow.textContent =
			bookKey === 'special'
				? 'とくしゅまほうの本'
				: `${['一冊目', '二冊目', '三冊目'][Number(bookKey)]}の本`;
		els.completionTitle.textContent = `「${book.word}」の本を送った！`;
		els.completionCopy.textContent =
			bookKey === '0' && state.foundBooks.has('1')
				? '第二章はクリア済みです。第三章へ進めます。'
				: book.ending;
		state.overlayAction = final ? 'final' : isMainBook ? 'advance' : 'resume';
		els.nextChapterButton.textContent =
			final || !isMainBook
				? 'まだ探索する'
				: bookKey === '0' && state.foundBooks.has('1')
					? '第三章へ進む'
					: '次の本へ';
		els.shareButton.hidden = !final;
		if (final) markGameClear();
		els.chapterOverlay.hidden = false;
		els.nextChapterButton.focus();
	}

	function nextChapter() {
		els.chapterOverlay.hidden = true;
		clearTimeout(checkTimer);
		clearTimeout(frameGlowTimer);
		rooms.forEach((room) => room.button.classList.remove('is-book-hint'));
		checkTimer = 0;
		if (state.overlayAction === 'advance')
			state.chapter =
				state.chapter === 0 && state.foundBooks.has('1') ? 2 : Math.min(2, state.chapter + 1);
		state.activeBook = 'chapter';
		state.progress = state.attempts[state.chapter].length;
		state.checking = false;
		state.complete = false;
		renderStory();
		switchTab('explore');
	}

	function markGameClear(mode = null) {
		state.shareMode = mode || (state.floating ? 'float' : state.illuminated ? 'light' : 'normal');
		state.gameCleared = true;
		// Server-side inserts are idempotent, so a later special-magic clear can update an earlier normal clear.
		void recordClear(state.specialUsed || mode === 'float' || mode === 'kebab');
	}

	function shareResult() {
		const opening = {
			normal: 'WEB謎「魔法使いの書庫」を解きました！',
			light: 'WEB謎「魔法使いの書庫」を明るくして解きました！',
			float: 'WEB謎「魔法使いの書庫」を浮遊して解きました！',
			kebab: 'WEB謎「魔法使いの書庫」にて亡き者となりましたが謎は解きました！'
		}[state.shareMode];
		const message = `${opening}\nhttps://sajiqook.jp/game/maglibrary\n\n#魔法使いの書庫\nhttps://x.com/saji_qook/status/2104707736495865944`;
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
			'_blank',
			'noopener,noreferrer'
		);
	}

	function useSpecialSpell(kind) {
		if (!state.specialUnlocked || state.moving || state.checking || !els.chapterOverlay.hidden)
			return;
		state.specialUsed = true;
		if (kind === 'light') {
			state.illuminated = !state.illuminated;
			els.board.classList.toggle('is-illuminated', state.illuminated);
			positionAvatar(true);
			updateRoute();
			renderMagic();
			toast(state.illuminated ? '書庫が明るくなりました。' : '明かりを消しました。');
			sound('spell');
		} else if (kind === 'float') {
			state.floating = !state.floating;
			els.boardOuter.classList.toggle('is-floating', state.floating);
			if (!state.floating && !rooms.has(key(state.row, state.col))) {
				const nearest = nearestGroundPosition(state.row, state.col);
				state.row = nearest.row;
				state.col = nearest.col;
				state.inSecret = false;
				positionAvatar(true);
			}
			if (
				!state.floating &&
				state.inSecret &&
				state.returnTo &&
				!rooms.has(key(state.returnTo.row, state.returnTo.col))
			) {
				const nearest = nearestGroundPosition(state.returnTo.row, state.returnTo.col);
				state.returnTo = { row: nearest.row, col: nearest.col };
			}
			updateRoute();
			renderMagic();
			toast(state.floating ? '体が浮き上がりました。' : '地面に降りました。');
			sound('spell');
		} else if (kind === 'kebab') {
			sound('miss');
			state.complete = true;
			state.overlayAction = 'final';
			markGameClear('kebab');
			els.completionEyebrow.textContent = 'とくしゅまほう';
			els.completionTitle.textContent = 'アバダ・ケバブダ！';
			els.completionCopy.textContent =
				'ケバブを食べて死んでしまいました。けれど、謎は解けています。';
			els.nextChapterButton.textContent = 'まだ探索する';
			els.shareButton.hidden = false;
			els.chapterOverlay.hidden = false;
			els.nextChapterButton.focus();
		}
	}

	function leaveByAir() {
		if (
			!state.floating ||
			state.row !== 10 ||
			state.col !== 8 ||
			state.moving ||
			state.checking ||
			state.complete ||
			!els.chapterOverlay.hidden
		)
			return;
		state.complete = true;
		state.overlayAction = 'final';
		markGameClear('float');
		els.completionEyebrow.textContent = 'とくしゅまほう';
		els.completionTitle.textContent = '書庫の外へたどり着いた！';
		els.completionCopy.textContent = '浮遊して、書庫の端に隠された出口を見つけました。';
		els.nextChapterButton.textContent = 'まだ探索する';
		els.shareButton.hidden = false;
		els.chapterOverlay.hidden = false;
		renderMagic();
		els.nextChapterButton.focus();
	}

	function chooseAirPosition(event) {
		if (
			!state.floating ||
			state.moving ||
			state.checking ||
			state.complete ||
			!els.chapterOverlay.hidden ||
			event.target.closest('.room')
		)
			return;
		const rect = els.board.getBoundingClientRect();
		const scale = state.illuminated ? 0.72 : 1;
		const tile = rooms.get(key(1, 4)).button.offsetWidth;
		const neighbour = rooms.get(key(1, 5)).button;
		const gap = neighbour.offsetLeft - rooms.get(key(1, 4)).button.offsetLeft - tile;
		const col = Math.max(
			0,
			Math.min(8, Math.round(((event.clientX - rect.left) / scale - tile / 2) / (tile + gap)))
		);
		const row = Math.max(
			0,
			Math.min(10, Math.round(((event.clientY - rect.top) / scale - tile / 2) / (tile + gap)))
		);
		if (row === 10 && col === 1 && !state.inSecret)
			state.returnTo = { row: state.row, col: state.col };
		state.inSecret = row === 10 && col === 1;
		moveAlong([{ row, col }]);
	}

	function switchTab(tab) {
		state.tab = tab;
		const magic = tab === 'magic';
		els.explorePanel.hidden = magic;
		els.magicPanel.hidden = !magic;
		els.exploreTab.classList.toggle('is-active', !magic);
		els.magicTab.classList.toggle('is-active', magic);
		els.magicTab.setAttribute('aria-expanded', String(magic));
	}

	function teleport() {
		if (!state.unlocked || state.moving || state.checking || !els.chapterOverlay.hidden) return;
		state.moving = true;
		els.avatar.classList.add('is-teleporting');
		els.boardOuter.classList.add('is-teleporting');
		els.teleportButton.disabled = true;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		setTimeout(
			() => {
				if (state.inSecret) {
					state.row = state.returnTo?.row ?? 1;
					state.col = state.returnTo?.col ?? 4;
					state.inSecret = false;
				} else {
					state.returnTo = { row: state.row, col: state.col };
					state.row = 10;
					state.col = 1;
					state.inSecret = true;
				}
				positionAvatar(true);
				renderMagic();
				updateRoute();
				setTimeout(
					() => {
						els.avatar.classList.remove('is-teleporting');
						els.boardOuter.classList.remove('is-teleporting');
						setTimeout(
							() => {
								state.moving = false;
								renderMagic();
							},
							reduced ? 5 : 200
						);
					},
					reduced ? 5 : 220
				);
			},
			reduced ? 5 : 210
		);
	}

	function toast(message, duration = 2550) {
		clearTimeout(toastTimer);
		els.messageToast.textContent = message;
		els.messageToast.classList.add('is-visible');
		toastTimer = setTimeout(() => els.messageToast.classList.remove('is-visible'), duration);
	}

	function handleArrow(event) {
		if (
			!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) ||
			state.moving ||
			state.checking ||
			state.complete ||
			!els.chapterOverlay.hidden ||
			els.guideDialog.open ||
			els.settingsDialog.open ||
			els.recordDialog.open ||
			event.target === els.bookSelect ||
			document.activeElement === els.bookSelect
		)
			return;
		event.preventDefault();
		const [dr, dc] = {
			ArrowUp: [-1, 0],
			ArrowDown: [1, 0],
			ArrowLeft: [0, -1],
			ArrowRight: [0, 1]
		}[event.key];
		if (state.floating) {
			const row = Math.max(0, Math.min(10, state.row + dr));
			const col = Math.max(0, Math.min(8, state.col + dc));
			if (row === 10 && col === 1 && !state.inSecret)
				state.returnTo = { row: state.row, col: state.col };
			state.inSecret = row === 10 && col === 1;
			moveAlong([{ row, col }]);
			return;
		}
		chooseRoom(state.row + dr, state.col + dc);
	}

	function prepareSprite() {
		const sprites = [
			'./assets/protagonist-option-b-walk-v2.png',
			'./assets/protagonist-option-b-up-v2.png',
			'./assets/protagonist-option-b-down.png'
		];
		let loaded = 0;
		sprites.forEach((src) => {
			const picture = new Image();
			picture.onload = () => {
				loaded += 1;
				if (loaded === sprites.length) els.avatar.classList.add('asset-ready');
			};
			picture.src = src;
		});
	}

	createRooms();
	prepareSprite();
	queuePosition();
	renderStory();
	renderSoundSettings();
	void recordPlay();
	els.exploreTab.addEventListener('click', () => switchTab('explore'));
	els.searchButton.addEventListener('click', searchCurrentRoom);
	els.magicTab.addEventListener('click', () => switchTab('magic'));
	els.bookSelect.addEventListener('pointerdown', () => {
		bookSelectPointerChoice = true;
	});
	els.bookSelect.addEventListener('keydown', (event) => {
		if (event.key.startsWith('Arrow')) bookSelectPointerChoice = false;
		if (event.key === 'Enter' || event.key === 'Escape')
			requestAnimationFrame(() => els.bookSelect.blur());
	});
	els.bookSelect.addEventListener('blur', () => {
		bookSelectPointerChoice = false;
	});
	els.bookSelect.addEventListener('change', () => {
		if (state.checking || state.complete) {
			els.bookSelect.value = state.activeBook;
		} else {
			state.activeBook = els.bookSelect.value;
			state.progress = activeAttempt().length;
			renderStory();
			sound('tap');
		}
		if (bookSelectPointerChoice) requestAnimationFrame(() => els.bookSelect.blur());
	});
	els.trackSteps.forEach((step, index) =>
		step.addEventListener('click', () => showCurrentBookRooms(index))
	);
	els.returnFragmentButton.addEventListener('click', returnFragment);
	els.teleportButton.addEventListener('click', teleport);
	els.specialMagicToggle.addEventListener('click', () => {
		const opening = els.specialMagicList.hidden;
		els.specialMagicList.hidden = !opening;
		els.specialMagicToggle.setAttribute('aria-expanded', String(opening));
		sound('tap');
	});
	els.specialSpells.forEach((button) =>
		button.addEventListener('click', () => useSpecialSpell(button.dataset.spell))
	);
	els.board.addEventListener('click', chooseAirPosition);
	els.nextChapterButton.addEventListener('click', nextChapter);
	els.shareButton.addEventListener('click', shareResult);
	els.guideOpen.addEventListener('click', () => {
		els.guideDialog.showModal();
		sound('tap');
	});
	els.guideClose.addEventListener('click', () => els.guideDialog.close());
	els.settingsOpen.addEventListener('click', () => {
		els.settingsDialog.showModal();
		sound('tap');
	});
	els.settingsClose.addEventListener('click', () => els.settingsDialog.close());
	els.recordClose.addEventListener('click', () => els.recordDialog.close());
	els.seVolume.addEventListener('input', () => {
		soundSettings.volume = Number(els.seVolume.value);
		soundSettings.muted = false;
		saveSoundSettings();
	});
	els.muteButton.addEventListener('click', () => {
		const now = Date.now();
		muteTaps = now - lastMuteTap < 1100 ? muteTaps + 1 : 1;
		lastMuteTap = now;
		soundSettings.muted = !soundSettings.muted;
		saveSoundSettings();
		if (muteTaps >= 8) {
			muteTaps = 0;
			void showRecords();
		}
	});
	window.addEventListener('resize', queuePosition);
	window.addEventListener('orientationchange', queuePosition);
	window.addEventListener('pageshow', queuePosition);
	window.addEventListener('load', queuePosition);
	window.visualViewport?.addEventListener('resize', queuePosition);
	window.visualViewport?.addEventListener('scroll', queuePosition);
	if (window.ResizeObserver) {
		const observer = new ResizeObserver(queuePosition);
		observer.observe(els.boardOuter);
		observer.observe(rooms.get(key(1, 4)).button);
	}
	document.addEventListener('keydown', handleArrow);
})();
