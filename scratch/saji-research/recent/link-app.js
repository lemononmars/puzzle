(() => {
	'use strict';
	const $ = (id) => document.getElementById(id);
	let current = null,
		token = '',
		busy = false,
		muteStreak = 0,
		muteTime = 0;
	let visitorId,
		volume = 65,
		muted = false;
	const uuid = () =>
		crypto.randomUUID
			? crypto.randomUUID()
			: '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
					(
						Number(c) ^
						(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
					).toString(16)
				);
	try {
		visitorId = localStorage.getItem('akari-visitor');
		if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(visitorId || '')) {
			visitorId = uuid();
			localStorage.setItem('akari-visitor', visitorId);
		}
		const saved = JSON.parse(localStorage.getItem('akari-audio') || '{}');
		volume = Number.isFinite(saved.volume) ? Math.max(0, Math.min(100, saved.volume)) : 65;
		muted = saved.muted === true;
	} catch {
		visitorId ||= uuid();
	}
	function sound(kind = 'tap', delay = 0) {
		window.PanelAudio?.play(kind, { volume, muted, delay });
	}
	function saveAudio() {
		$('volume').value = volume;
		$('volume-value').textContent = `${volume}%`;
		$('mute').setAttribute('aria-pressed', String(muted));
		window.PanelAudio?.configure({ volume, muted });
		try {
			localStorage.setItem('akari-audio', JSON.stringify({ volume, muted }));
		} catch {}
	}
	function open(id) {
		if (!$(id).open) $(id).showModal();
	}
	function close(id) {
		$(id).close();
	}
	function lock() {
		document
			.querySelectorAll('.stage-tab, .switch, #confirm, #reset, #undo, #next')
			.forEach((button) => {
				button.disabled =
					busy ||
					!current ||
					(button.classList.contains('switch') && current.finished) ||
					(button.id === 'undo' && (!current.canUndo || current.finished));
			});
		$('reconnect').disabled = busy;
	}
	function render(data, initial = false) {
		const before = current;
		current = data;
		$('game-title').replaceChildren(
			...Array.from(data.title, (letter) => {
				const part = document.createElement('span');
				part.textContent = letter;
				if (letter === 'I') part.className = 'title-lamp';
				return part;
			})
		);
		document.title = `${data.title}｜WEB謎`;
		const page = document.querySelector('.page');
		page.classList.remove('check-failed');
		$('stage-nav').replaceChildren();
		const inserted = !initial && before && data.rows.length > before.rows.length;
		for (let slotNumber = 1; slotNumber <= 3; slotNumber++) {
			const slot = document.createElement('div');
			slot.className = 'stage-slot';
			const row = data.rows.find((item) => item.number === slotNumber);
			if (!row) {
				slot.setAttribute('aria-hidden', 'true');
				$('stage-nav').append(slot);
				continue;
			}
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'stage-tab';
			const oldRow = before?.rows.find((item) => item.number === row.number);
			if ((inserted && !oldRow) || (!before && data.stage === 1))
				button.classList.add('plate-enter');
			row.lights.forEach((light, index) => {
				const dot = document.createElement('span');
				dot.className = 'mini-light';
				dot.dataset.lit = String(light.on);
				if (!initial && light.on && oldRow?.lights[index].on === false)
					dot.classList.add('just-lit');
				dot.setAttribute('aria-hidden', 'true');
				button.append(dot);
			});
			button.setAttribute(
				'aria-label',
				`箱${row.number}：${row.lights.map((light) => (light.on ? '点灯' : '消灯')).join('、')}`
			);
			if (row.number === data.view) button.setAttribute('aria-current', 'step');
			button.addEventListener('click', () => {
				sound('select');
				act('view', { number: row.number });
			});
			slot.append(button);
			$('stage-nav').append(slot);
		}
		if (inserted) sound('seat', 0.31);
		const row = data.rows.find((item) => item.number === data.view);
		const panel = document.createElement('section');
		panel.className = 'panel';
		panel.setAttribute('aria-label', `箱${row.number}`);
		const lights = document.createElement('div');
		lights.className = 'lights';
		row.lights.forEach((light, index) => {
			const control = document.createElement(light.control ? 'button' : 'div');
			control.className = `light ${light.control ? 'switch' : 'indicator'}`;
			control.dataset.lit = String(light.on);
			const oldRow = before?.rows.find((item) => item.number === row.number);
			if (!initial && light.on && oldRow?.lights[index].on === false)
				control.classList.add('just-lit');
			control.setAttribute(
				'aria-label',
				`${index + 1}番目：${light.on ? '点灯' : '消灯'}${light.control ? '' : '（表示灯）'}`
			);
			if (light.control) {
				control.type = 'button';
				control.setAttribute('aria-pressed', String(light.on));
				control.addEventListener('click', () => {
					sound();
					act('press', { control: light.control });
				});
			} else control.setAttribute('role', 'img');
			const bulb = document.createElement('span');
			bulb.className = 'bulb';
			bulb.setAttribute('aria-hidden', 'true');
			control.append(bulb);
			lights.append(control);
		});
		panel.append(lights);
		$('board').replaceChildren(panel);
		$('confirm').hidden = data.pending || data.finished;
		$('notice').textContent =
			data.notice || (data.recordSaved === false ? '記録の保存に接続できません。' : '');
		$('announcement').textContent =
			`箱${data.view}：${row.lights.map((light) => (light.on ? '点灯' : '消灯')).join('、')}`;
		if (data.pending && data.outcome) {
			$('clear-title').textContent = data.outcome.title;
			$('next').textContent = data.outcome.nextLabel;
			open('clear-dialog');
			if (!before?.pending && !initial) {
				sound('power');
				window.akariAnalytics?.('stage_complete', { stage: data.stage });
			}
		} else close('clear-dialog');
		if (data.finished && data.outcome) {
			$('finish-title').textContent = data.outcome.title;
			$('share').href =
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.outcome.shareText)}`;
			$('share').hidden = false;
			if (!before?.finished || initial) open('finish-dialog');
			if (!before?.finished && !initial) {
				sound('complete');
				window.akariAnalytics?.('puzzle_complete');
			}
		} else {
			close('finish-dialog');
			$('finish-title').textContent = '';
			$('share').removeAttribute('href');
			$('share').hidden = true;
		}
		if ((data.checkFailed || data.notice) && !initial) sound('fail');
		if (data.checkFailed && !initial) {
			void page.offsetWidth;
			page.classList.add('check-failed');
		}
		lock();
	}
	async function request(body) {
		const controller = new AbortController(),
			timeout = setTimeout(() => controller.abort(), 8000);
		try {
			const response = await fetch('api.php', {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				signal: controller.signal
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || '接続を確認してください。');
			return result;
		} finally {
			clearTimeout(timeout);
		}
	}
	async function act(action, extra = {}) {
		if (busy) return;
		if (!muted && volume > 0 && action !== 'init') window.PanelAudio?.unlock();
		busy = true;
		lock();
		$('reconnect').hidden = true;
		try {
			const init = action === 'init';
			const data = await request(
				init ? { action, visitorId } : { action, token, revision: current.revision, ...extra }
			);
			token = data.token || token;
			render(data, init);
			if (init && !current.finished) window.akariAnalytics?.('puzzle_start');
		} catch (error) {
			$('notice').textContent =
				error.name === 'AbortError'
					? '通信に時間がかかっています。再接続してください。'
					: error.message;
			$('reconnect').hidden = false;
		} finally {
			busy = false;
			lock();
		}
	}
	async function records() {
		open('records-dialog');
		$('records-content').textContent = '読み込み中…';
		$('records-retry').hidden = true;
		const controller = new AbortController(),
			timer = setTimeout(() => controller.abort(), 8000);
		try {
			const response = await fetch('records.php', {
				credentials: 'same-origin',
				cache: 'no-store',
				signal: controller.signal
			});
			const data = await response.json();
			if (
				!response.ok ||
				!Number.isFinite(data.plays) ||
				!Number.isFinite(data.clears) ||
				!Number.isFinite(data.shortestClears)
			)
				throw new Error();
			const grid = document.createElement('div');
			grid.className = 'record-grid';
			[
				['総プレイ数', data.plays],
				['クリア数', data.clears],
				['最短手数でのクリア数', data.shortestClears]
			].forEach(([label, value]) => {
				const item = document.createElement('div');
				item.className = 'record-item';
				item.textContent = label;
				const number = document.createElement('strong');
				number.textContent = value.toLocaleString('ja-JP');
				item.append(number);
				grid.append(item);
			});
			const rate = document.createElement('div');
			rate.className = 'record-item rate';
			rate.textContent = 'クリア率';
			const percent = document.createElement('strong');
			percent.textContent = `${Number(data.rate).toFixed(1)}%`;
			rate.append(percent);
			$('records-content').replaceChildren(grid, rate);
		} catch {
			$('records-content').textContent = '記録を読み込めませんでした。';
			$('records-retry').hidden = false;
		} finally {
			clearTimeout(timer);
		}
	}
	$('settings-open').addEventListener('click', () => open('settings-dialog'));
	document.querySelector('.page').addEventListener('animationend', (event) => {
		if (['check-shake', 'check-feedback'].includes(event.animationName))
			event.currentTarget.classList.remove('check-failed');
	});
	document
		.querySelectorAll('[data-close]')
		.forEach((button) => button.addEventListener('click', () => close(button.dataset.close)));
	document.querySelectorAll('dialog').forEach((dialog) =>
		dialog.addEventListener('click', (event) => {
			if (event.target === dialog && dialog.id !== 'clear-dialog') {
				const rect = dialog.getBoundingClientRect();
				if (
					event.clientX < rect.left ||
					event.clientX > rect.right ||
					event.clientY < rect.top ||
					event.clientY > rect.bottom
				)
					dialog.close();
			}
		})
	);
	$('clear-dialog').addEventListener('cancel', (event) => event.preventDefault());
	$('volume').addEventListener('input', () => {
		volume = Number($('volume').value);
		saveAudio();
	});
	$('volume').addEventListener('change', () => sound('tap'));
	$('mute').addEventListener('click', () => {
		muted = !muted;
		saveAudio();
		const now = Date.now();
		muteStreak = now - muteTime < 2500 ? muteStreak + 1 : 1;
		muteTime = now;
		if (muteStreak === 8) {
			muteStreak = 0;
			records();
		}
	});
	document.addEventListener('click', (event) => {
		if (event.target !== $('mute')) muteStreak = 0;
	});
	$('records-retry').addEventListener('click', records);
	$('undo').addEventListener('click', () => {
		sound('undo');
		act('undo');
	});
	$('reset').addEventListener('click', () => {
		sound('reset');
		act('reset');
	});
	$('confirm').addEventListener('click', () => act('confirm'));
	$('next').addEventListener('click', () => act('next'));
	$('reconnect').addEventListener('click', () => act('init'));
	$('share').addEventListener('click', () => window.akariAnalytics?.('share', { method: 'X' }));
	document.addEventListener('dblclick', (event) => {
		if (event.target.closest('button')) event.preventDefault();
	});
	document.addEventListener('keydown', (event) => {
		const key = event.key.toLowerCase();
		if (
			key === 'f12' ||
			(event.ctrlKey && (key === 'u' || (event.shiftKey && ['i', 'j', 'c'].includes(key)))) ||
			(event.metaKey && event.altKey && ['u', 'i', 'j', 'c'].includes(key))
		) {
			event.preventDefault();
			open('source-dialog');
		}
	});
	saveAudio();
	act('init');
})();
