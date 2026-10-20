!(function (e = window, t = document) {
	let n = 0;
	const a = () => {
			n = 0;
			const a = (function ({ innerHeight: e, clientHeight: t, visualHeight: n, scale: a = 1 }) {
				const s = [e, t];
				Math.abs(a - 1) < 0.02 && s.push(n);
				const o = s.filter((e) => Number.isFinite(e) && e > 0);
				return o.length ? Math.floor(Math.min(...o)) : null;
			})({
				innerHeight: e.innerHeight,
				clientHeight: t.documentElement.clientHeight,
				visualHeight: e.visualViewport?.height,
				scale: e.visualViewport?.scale ?? 1
			});
			a &&
				(t.documentElement.style.setProperty('--visible-height', a + 'px'),
				(t.documentElement.dataset.compact = String(a < 540)),
				(t.documentElement.dataset.short = String(a < 400)));
		},
		s = () => {
			n || (n = e.requestAnimationFrame(a));
		},
		o = () => {
			(s(), e.setTimeout(s, 100), e.setTimeout(s, 400));
		};
	for (const t of ['resize', 'orientationchange', 'pageshow', 'focus', 'load'])
		e.addEventListener(t, o, { passive: !0 });
	for (const t of ['resize', 'scroll']) e.visualViewport?.addEventListener(t, s, { passive: !0 });
	(t.addEventListener('visibilitychange', () => {
		t.hidden || o();
	}),
		a());
})();
const e = (e) => document.getElementById(e);
let t,
	n = null,
	a = !1,
	s = 0.65,
	o = Promise.resolve(),
	i = 0,
	r = {},
	c = 0,
	l = 0;
try {
	const e = JSON.parse(localStorage.getItem('breakfast-preferences-v1') || '{}');
	((a = !!e.sound), 'number' == typeof e.volume && (s = Math.max(0, Math.min(1, e.volume))));
} catch {}
function d() {
	try {
		localStorage.setItem('breakfast-preferences-v1', JSON.stringify({ sound: a, volume: s }));
	} catch {}
}
function u() {
	if (a)
		try {
			((t ??= new (window.AudioContext || window.webkitAudioContext)()), t.resume());
			const e = Math.floor(0.05 * t.sampleRate),
				n = t.createBuffer(1, e, t.sampleRate),
				a = n.getChannelData(0);
			for (let t = 0; t < e; t++) a[t] = (2 * Math.random() - 1) * (1 - t / e) * 0.14 * s;
			const o = t.createBufferSource();
			o.buffer = n;
			const i = t.createBiquadFilter();
			((i.type = 'bandpass'),
				(i.frequency.value = 1700),
				o.connect(i),
				i.connect(t.destination),
				o.start());
		} catch {}
}
function g(e) {
	'function' == typeof window.gtag &&
		window.gtag('event', e, {
			game_slug: r.shareUrl ? r.shareUrl.split('/').filter(Boolean).at(-1) : 'breakfast-preview'
		});
}
function h(t) {
	e(t).open || e(t).showModal();
}
function m(t) {
	(e('choices').classList.toggle('concealed', !t),
		e('choices').setAttribute('aria-hidden', String(!t)),
		(e('choices').inert = !t));
}
function f(e, t) {
	const a = document.createElement('button');
	return (
		(a.className = 'choice-dot' + (n.smallChoices?.[t]?.[e] ? ' small-dot' : '')),
		(a.type = 'button'),
		a.setAttribute('aria-label', `${'left' === t ? '左' : '右'}の${e + 1}文字目を選ぶ`),
		a.addEventListener('click', () => w('pick', { side: t, index: e })),
		a
	);
}
function p() {
	if (!n) return;
	((e('sense-name').textContent = n.sense.label),
		(document.querySelector('.scene').dataset.sense = n.sense.id),
		e('left-choice').replaceChildren(
			...Array.from({ length: n.choices?.left || 0 }, (e, t) => f(t, 'left'))
		),
		e('right-choice').replaceChildren(
			...Array.from({ length: n.choices?.right || 0 }, (e, t) => f(t, 'right'))
		),
		m(!!n.choices));
	const t = document.createDocumentFragment();
	for (let e = 0; e < Math.max(6, n.length); e++) {
		const a = document.createElement('span');
		((a.className =
			e < n.length ? 'entered-dot' + (n.smallInput?.[e] ? ' small-dot' : '') : 'empty-dot'),
			t.append(a));
	}
	(e('input').replaceChildren(t),
		e('input').setAttribute('aria-label', `入力は${n.length}文字`),
		e('input').classList.toggle('dense', n.length > 18),
		(e('erase').disabled = 0 === n.length),
		(e('confirm').disabled = 0 === n.length),
		(e('clear-input').disabled = 0 === n.length),
		(e('sound').textContent = a ? '音あり' : '無音'),
		e('sound').setAttribute('aria-checked', String(a)),
		(e('volume').value = String(Math.round(100 * s))));
}
function v(t, n) {
	((e('result-heading').textContent = t.heading),
		e('result-heading').classList.toggle('discovery', !t.clear),
		(e('result-art').src = t.image),
		(e('clear-message').hidden = !t.message),
		(e('clear-message').textContent = t.message),
		(e('other-meanings').hidden = t.total < 2),
		(e('meaning-count').textContent = `${t.index + 1} / ${t.total}`));
	const a = 'string' == typeof n && n.startsWith('https://x.com/intent/tweet?');
	((e('share').hidden = !t.clear || !a),
		a ? (e('share').href = n) : e('share').removeAttribute('href'),
		h('result-dialog'));
}
function w(t, a = {}) {
	('shift' === t && m(!1), i++, e('paper').setAttribute('aria-busy', 'true'));
	const s = o.then(async () => {
		try {
			const s = await (async function (e, t = {}) {
				const a = await fetch('./api', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'same-origin',
					cache: 'no-store',
					body: JSON.stringify({ action: e, csrf: n?.csrf, ...t }),
					signal: AbortSignal.timeout(12e3)
				});
				let s;
				try {
					s = await a.json();
				} catch {
					throw Error('接続できません。再読み込みしてお試しください。');
				}
				if (!a.ok) throw Error(s.error || '接続を確認してください。');
				return s;
			})(t, a);
			return (
				(n = s.state),
				(e('connection-message').hidden = !0),
				p(),
				s.newStart && g('puzzle_start'),
				'submit' === t
					? s.match
						? (v(s.match, s.share), g(s.match.clear ? 'puzzle_clear' : 'puzzle_discovery'))
						: (e('input').classList.remove('wrong'),
							e('input').offsetWidth,
							e('input').classList.add('wrong'),
							(e('live-status').textContent = '何もできなかった。'))
					: 'meaning' === t && s.match && v(s.match, s.share),
				s
			);
		} catch (t) {
			return (
				(s =
					'TimeoutError' === t.name
						? '接続に時間がかかっています。もう一度お試しください。'
						: t.message),
				(e('connection-message').textContent = s),
				(e('connection-message').hidden = !1),
				null
			);
		} finally {
			(i--, e('paper').setAttribute('aria-busy', String(i > 0)));
		}
		var s;
	});
	return ((o = s.then(() => {})), s);
}
async function y() {
	(e('settings-dialog').close(),
		(e('record-values').hidden = !0),
		(e('records-message').hidden = !1),
		(e('records-message').textContent = '読み込み中…'),
		h('records-dialog'));
	const t = await w('records');
	if (t?.records?.available) {
		((e('records-message').hidden = !0),
			(e('record-values').hidden = !1),
			(e('record-plays').textContent = Number(t.records.plays).toLocaleString('ja-JP')));
		for (const n of ['breakfast', 'lunch', 'space', 'staple'])
			e('record-' + n).textContent =
				'number' == typeof t.records.mealClears?.[n]
					? t.records.mealClears[n].toLocaleString('ja-JP') + '人'
					: '—';
		e('record-rate').textContent = Number(t.records.rate).toFixed(1) + '%';
	} else e('records-message').textContent = t?.records?.message || '記録を取得できませんでした。';
}
for (const [t, n] of [
	['previous', -1],
	['next', 1]
])
	e(t).addEventListener('click', () => {
		(u(), w('shift', { delta: n }));
	});
(e('toast').addEventListener('click', async () => {
	(await w('reveal')) &&
		(e('toast').classList.remove('picked'),
		e('toast').offsetWidth,
		e('toast').classList.add('picked'),
		'hear' === n.sense.id
			? (u(),
				setTimeout(u, 85),
				setTimeout(u, 160),
				e('toast').classList.add('listening'),
				setTimeout(() => e('toast').classList.remove('listening'), 500))
			: u());
}),
	e('erase').addEventListener('click', () => {
		(u(), w('erase'));
	}),
	e('confirm').addEventListener('click', () => {
		(u(), w('submit'));
	}),
	e('settings-button').addEventListener('click', () => {
		((c = 0), p(), h('settings-dialog'));
	}),
	e('sound').addEventListener('click', () => {
		((a = !a), d(), p(), u());
		const e = Date.now();
		((c = e - l > 3e3 ? 1 : c + 1), (l = e), c >= 8 && ((c = 0), y()));
	}),
	e('volume').addEventListener('input', () => {
		((s = Number(e('volume').value) / 100), d());
	}),
	e('clear-input').addEventListener('click', () => {
		(u(), w('empty'));
	}));
for (const [t, n] of [
	['meaning-previous', -1],
	['meaning-next', 1]
])
	e(t).addEventListener('click', () => w('meaning', { delta: n }));
(e('records-retry').addEventListener('click', y),
	e('share').addEventListener('click', () => g('share_clicked')),
	document.addEventListener('click', (t) => {
		const n = t.target.closest('[data-close]');
		n && e(n.dataset.close).close();
	}),
	document.addEventListener('keydown', (e) => {
		const t = e.key.toLowerCase();
		((e.ctrlKey && ('u' === t || (e.shiftKey && ['i', 'j', 'c'].includes(t)))) ||
			(e.metaKey && e.altKey && ['u', 'i', 'j'].includes(t)) ||
			'f12' === t) &&
			(e.preventDefault(), h('source-dialog'));
	}),
	(async function () {
		let t;
		try {
			t = JSON.parse(localStorage.getItem('breakfast-senses-progress-v1') || 'null');
		} catch {}
		const n = await w('init', { legacy: t });
		if (n) {
			((r = n.config || {}),
				r.title && (document.title = r.title),
				(function (e) {
					if (!/^G-[A-Z0-9]+$/.test(e) || ['localhost', '127.0.0.1'].includes(location.hostname))
						return;
					((window.dataLayer = window.dataLayer || []),
						(window.gtag = function () {
							window.dataLayer.push(arguments);
						}));
					const t = document.createElement('script');
					((t.async = !0),
						(t.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(e)),
						document.head.append(t),
						window.gtag('js', new Date()),
						window.gtag('config', e, { send_page_view: !1 }),
						window.gtag('event', 'page_view', {
							page_title: r.title || document.title,
							page_location: location.href,
							page_path: location.pathname,
							content_group: 'NAZO'
						}));
				})(r.ga));
			try {
				localStorage.removeItem('breakfast-senses-progress-v1');
			} catch {}
			((e('loading').hidden = !0), p());
		}
	})());
