const $ = (id) => document.getElementById(id);
const layouts = [
	['s0', '1', 17, 12, -16],
	['s2', '3', 58, 10, 23],
	['s4', '5', 41, 29, -19],
	['s7', '8', 85, 28, 28],
	['s1', '2', 14, 47, -13],
	['s8', '9', 62, 55, 17],
	['s5', '6', 38, 62, -27],
	['s3', '4', 85, 65, 12],
	['s6', '7', 14, 79, 18],
	['s9', '5', 60, 83, 14],
	['s10', '9', 86, 95, -20],
	['s17', '8', 36, 94, -11]
];
$('field').innerHTML = layouts
	.map(
		([id, text, x, y, tilt]) =>
			`<span class="piece" data-slot="${id}" role="button" tabindex="0" aria-label="${text}" style="left:${x}%;top:${y}%;--tilt:${tilt}deg">${text}</span>`
	)
	.join('');
let textIndex = 0,
	state = { removed: [], remaining: 9, count: 0 },
	slots = {},
	token = '',
	busy = false,
	ready = false,
	soundOn = false,
	volume = 0.35,
	audio,
	resultTimer;
const storage = {
	get(key) {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch {}
	}
};
let visitor = storage.get('float-visitor');
if (!/^[a-f0-9-]{36}$/i.test(visitor || '')) {
	visitor = crypto.randomUUID();
	storage.set('float-visitor', visitor);
}
function selectableText() {
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT),
		nodes = [];
	while (walker.nextNode()) {
		const n = walker.currentNode;
		if (
			n.textContent.trim() &&
			!n.parentElement.closest(
				'[data-piece],[data-slot],script,style,.sr-only,input,#network-error'
			)
		)
			nodes.push(n);
	}
	for (const n of nodes) {
		const fragment = document.createDocumentFragment();
		for (const ch of n.textContent) {
			if (/\s/u.test(ch)) {
				fragment.append(ch);
				continue;
			}
			const s = document.createElement('span');
			s.textContent = ch;
			s.className = 'text-character';
			s.dataset.piece = 'text-' + textIndex++;
			s.setAttribute('role', 'button');
			s.tabIndex = 0;
			fragment.append(s);
		}
		n.replaceWith(fragment);
	}
}
function render() {
	for (const n of document.querySelectorAll('[data-slot]')) {
		if (slots[n.dataset.slot]) n.dataset.piece = slots[n.dataset.slot];
		else delete n.dataset.piece;
	}
	selectableText();
	document.body.classList.toggle('flat', !!state.clear);
	document.title = state.clear ? 'Flat' : 'Float';
	document.querySelector('h1').setAttribute('aria-label', document.title);
	document.querySelector('main').setAttribute('aria-label', document.title);
	$('counter').textContent = String(state.remaining);
	$('counter').setAttribute('aria-label', `ペア数 ${state.remaining}`);
	for (const n of document.querySelectorAll('[data-piece]')) {
		const gone = state.removed.includes(n.dataset.piece);
		n.classList.toggle('gone', gone);
		n.classList.toggle('selected', state.selected === n.dataset.piece);
		n.setAttribute('aria-pressed', String(state.selected === n.dataset.piece));
		n.setAttribute('aria-disabled', String(gone || state.ended));
		n.tabIndex = gone || state.ended ? -1 : 0;
	}
	$('finish').disabled = !ready || busy || (state.ended && !state.clear);
}
function tick(clear = false) {
	if (!soundOn) return;
	try {
		audio ??= new (window.AudioContext || window.webkitAudioContext)();
		audio.resume();
		for (let i = 0; i < (clear ? 3 : 1); i++) {
			const o = audio.createOscillator(),
				g = audio.createGain(),
				t = audio.currentTime + i * 0.12;
			o.type = 'sine';
			o.frequency.setValueAtTime(clear ? 520 + i * 130 : 680, t);
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(volume * 0.12, t + 0.004);
			g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
			o.connect(g);
			g.connect(audio.destination);
			o.start(t);
			o.stop(t + 0.1);
		}
	} catch {}
}
function open(id) {
	if (!$(id).open) $(id).showModal();
}
function reportError() {
	const n = $('network-error');
	n.textContent = '通信できませんでした。もう一度お試しください。';
	n.hidden = false;
}
async function action(name, piece) {
	if (busy) return null;
	busy = true;
	render();
	try {
		const response = await fetch('./api.php?endpoint=play', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ action: name, token, piece, visitor }),
			signal: AbortSignal.timeout(12000)
		});
		const data = await response.json();
		if (!response.ok) throw new Error();
		token = data.token;
		state = data.state;
		slots = data.slots;
		ready = true;
		try {
			sessionStorage.setItem('float-session', token);
		} catch {}
		$('network-error').hidden = true;
		return data;
	} catch {
		reportError();
		return null;
	} finally {
		busy = false;
		render();
	}
}
async function result() {
	const resultToken = token;
	$('result-title').textContent = state.clear ? '浮いている文字が無くなった！' : '結果';
	$('result-score').textContent = `見つけた数字${state.count}コ`;
	$('result-caption').hidden = !state.clear;
	$('continue').hidden = !!state.clear;
	$('share').hidden = false;
	const fallback = `WEB謎「Float」を解きました！\n\n見つけた数字${state.count}コ！\n\nhttps://sajiqook.jp/game/float\n\n#Float\nhttps://x.com/saji_qook/status/2109237579271008743`;
	$('share').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(fallback);
	render();
	open('result-dialog');
	const config = await fetch('./api.php?endpoint=share', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ token: resultToken }),
		signal: AbortSignal.timeout(8000)
	})
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null);
	if (config?.text && token === resultToken)
		$('share').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(config.text);
}
let selectionQueue = Promise.resolve();
function pick(id) {
	selectionQueue = selectionQueue.then(() => performPick(id));
}
async function performPick(id) {
	if (!ready || busy || state.ended) return;
	const data = await action('choose', id);
	if (!data) return;
	if (['matched', 'forced', 'clear'].includes(data.kind)) tick(data.kind === 'clear');
	if (data.kind === 'clear') analyticsEvent('puzzle_clear');
	if (['forced', 'clear'].includes(data.kind)) {
		document.querySelectorAll('dialog[open]').forEach((d) => d.close());
		clearTimeout(resultTimer);
		resultTimer = setTimeout(result, data.kind === 'clear' ? 1300 : 350);
	}
}
let pointerStart = null,
	suppressClickUntil = 0;
document.addEventListener('pointerdown', (e) => {
	pointerStart = { x: e.clientX, y: e.clientY };
});
document.addEventListener('pointerup', (e) => {
	if (pointerStart && Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) > 6)
		suppressClickUntil = performance.now() + 450;
	pointerStart = null;
});
document.addEventListener('pointercancel', () => {
	pointerStart = null;
	suppressClickUntil = performance.now() + 450;
});
let muteTaps = 0,
	lastMute = 0;
async function records() {
	open('records-dialog');
	$('records-content').textContent = '読み込み中…';
	try {
		const r = await fetch('./api.php?endpoint=records', { cache: 'no-store' });
		const d = await r.json();
		if (!r.ok) throw new Error(d.error);
		$('records-content').textContent =
			`挑戦者数 ${d.plays.toLocaleString()}人\nクリア者数 ${d.clears.toLocaleString()}人\nクリア率 ${d.plays ? ((100 * d.clears) / d.plays).toFixed(1) : '0.0'}%`;
	} catch {
		$('records-content').textContent = '記録サーバー未接続です。接続完了後に表示します。';
	}
	render();
}
document.addEventListener('click', (e) => {
	if (e.target.closest('#sound-status') && !soundOn) {
		const now = performance.now();
		muteTaps = now - lastMute < 2500 ? muteTaps + 1 : 1;
		lastMute = now;
		if (muteTaps === 8) {
			muteTaps = 0;
			records();
			return;
		}
	}
	const close = e.target.closest('[data-close]');
	if (close) {
		$(close.dataset.close).close();
		return;
	}
	const n = e.target.closest('[data-piece]');
	if (!n) return;
	if (performance.now() < suppressClickUntil || window.getSelection()?.toString()) return;
	if (n.closest('button,a')) {
		n.classList.add('touch-glow');
		setTimeout(() => n.classList.remove('touch-glow'), 220);
		return;
	}
	e.stopPropagation();
	pick(n.dataset.piece);
});
document.addEventListener('keydown', (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
		e.preventDefault();
		open('source-dialog');
		return;
	}
	const n = e.target.closest('[role="button"][data-piece]');
	if (n && !n.closest('button,a') && ['Enter', ' '].includes(e.key)) {
		e.preventDefault();
		n.click();
	}
});
$('settings').addEventListener('click', async () => {
	open('settings-dialog');
	await action('settings');
});
function renderSound() {
	$('sound-status').innerHTML = soundOn
		? '音あ<span class="split-ri" aria-label="り"><span class="inline-piece ri-first" data-slot="s11" role="button" tabindex="0">&#xE002;</span><span class="ri-second" data-piece="text-ri-second" role="button" tabindex="0">&#xE003;</span></span>'
		: '無音';
	$('sound').setAttribute('aria-checked', String(soundOn));
	render();
}
$('sound').addEventListener('click', async (e) => {
	e.stopPropagation();
	if (busy) return;
	if (!soundOn) {
		const data = await action('sound');
		if (!data) return;
	}
	soundOn = !soundOn;
	renderSound();
	tick();
});
$('volume').addEventListener('input', (e) => {
	volume = Number(e.target.value) / 100;
});
$('finish').addEventListener('click', async () => {
	if (!ready || busy) return;
	clearTimeout(resultTimer);
	if (state.clear) {
		result();
		return;
	}
	if (await action('finish')) result();
});
$('continue').addEventListener('click', async () => {
	if (await action('resume')) $('result-dialog').close();
});
$('restart').addEventListener('click', () => open('restart-dialog'));
for (const theme of ['white', 'black'])
	$('theme-' + theme).addEventListener('click', () => {
		document.body.classList.toggle('black-paper', theme === 'black');
		for (const t of ['white', 'black'])
			$('theme-' + t).setAttribute('aria-pressed', String(t === theme));
	});
$('restart-confirm').addEventListener('click', async () => {
	if (await action('restart')) {
		clearTimeout(resultTimer);
		document.querySelectorAll('dialog[open]').forEach((d) => d.close());
	}
});
$('result-dialog').addEventListener('close', () => {
	if (state.ended && !state.clear && !busy) action('resume');
});
function analyticsEvent(name) {
	if (typeof window.gtag === 'function')
		window.gtag('event', name, { game_slug: 'float', content_group: 'NAZO' });
}
async function init() {
	render();
	let saved;
	try {
		saved = sessionStorage.getItem('float-session');
	} catch {}
	if (saved) {
		token = saved;
		if (!(await action('restore'))) {
			token = '';
			await action('start');
		}
	} else await action('start');
	if (state.ended) result();
}
init();
if (
	(['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname) &&
		location.pathname.startsWith('/game/')) ||
	location.hostname === 'float-paper-puzzle.shiroikaibutsu.chatgpt.site'
) {
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () {
		window.dataLayer.push(arguments);
	};
	gtag('js', new Date());
	gtag('config', 'G-N4MP03VBEC', {
		content_group: 'NAZO',
		page_location: location.origin + location.pathname
	});
	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://www.googletagmanager.com/gtag/js?id=G-N4MP03VBEC';
	document.head.append(script);
}
