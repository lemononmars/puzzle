(() => {
	'use strict';
	const e = (e) => document.querySelector(e),
		t = e('#view-root');
	let n,
		r = '',
		a = !1,
		o = null,
		s = 65,
		i = !0,
		c = 0,
		d = 0;
	const u = new Map(),
		l = new Map(),
		m = new Map(),
		g = new Set(),
		f = new WeakMap();
	try {
		const e = JSON.parse(localStorage.getItem('kiroku:settings') || '{}');
		((s = Number.isFinite(e.volume) ? Math.max(0, Math.min(100, e.volume)) : 65),
			(i = !1 !== e.muted));
	} catch {}
	function h() {
		try {
			localStorage.setItem('kiroku:settings', JSON.stringify({ volume: s, muted: i }));
		} catch {}
	}
	function y(t) {
		e('#global-message').textContent = t;
	}
	function v() {
		const e = Math.min(innerHeight, window.visualViewport?.height || innerHeight),
			n =
				innerWidth <= 760 &&
				t.contains(document.activeElement) &&
				document.activeElement.matches('.answer-form input:not(:disabled)');
		(document.documentElement.classList.toggle('answer-editing', n),
			document.documentElement.style.setProperty('--viewport-height', e + 'px'),
			document.documentElement.style.setProperty(
				'--viewport-top',
				n ? (window.visualViewport?.offsetTop || 0) + 'px' : '0px'
			));
		const r = t.querySelector('.scene');
		if (!r) return;
		((r.style.width = Math.min(t.clientWidth - 8, innerWidth <= 760 ? 430 : 1260) + 'px'),
			r.style.setProperty('--fit', '1'));
		const a = n ? 1 : Math.min(1, (t.clientHeight - 14) / Math.max(1, r.offsetHeight));
		r.style.setProperty('--fit', String(Math.max(0.2, a)));
	}
	async function w(e, t = {}) {
		const n = JSON.stringify({
			action: e,
			...(r ? { csrf: r } : {}),
			requestId: crypto.randomUUID(),
			...t
		});
		for (let e = 0; e < 3; e++) {
			const t = new AbortController(),
				r = setTimeout(() => t.abort(), 9e3);
			try {
				const e = await fetch('api.php', {
						method: 'POST',
						credentials: 'same-origin',
						cache: 'no-store',
						headers: { 'Content-Type': 'application/json' },
						body: n,
						signal: t.signal
					}),
					r = await e.json();
				if (!e.ok) {
					const t = new Error(r.error || '接続できませんでした。');
					throw ((t.retry = e.status >= 500), t);
				}
				return r;
			} catch (t) {
				if (!1 === t.retry || 2 === e) throw t;
				await new Promise((t) => setTimeout(t, 250 * (e + 1)));
			} finally {
				clearTimeout(r);
			}
		}
	}
	async function p(n, s = {}) {
		if (!a) {
			((a = !0), t.setAttribute('aria-busy', 'true'));
			try {
				const a = await w(n, s);
				if (
					((function (n) {
						if (
							(n.csrf && (r = n.csrf),
							'recorded' in n && (e('#record-save-status').hidden = n.recorded),
							!n.view)
						)
							return;
						((o = n.view), (t.innerHTML = o.html), (e('#connection-status').hidden = !0));
						const a = t.querySelector('.answer-form input');
						(a &&
							((a.value = u.get(o.page) || ''),
							a.addEventListener('input', () => {
								u.set(o.page, a.value);
								const e = t.querySelector('.feedback');
								e && (e.textContent = '');
							})),
							(function () {
								for (const e of t.querySelectorAll('.image-surface')) {
									const t = e.querySelector('img');
									(e.matches('a.title-surface') &&
										(e.removeAttribute('href'),
										e.removeAttribute('target'),
										e.setAttribute('role', 'img'),
										(e.tabIndex = 0)),
										t
											.decode()
											.then(async () => {
												((e.dataset.ready = (await L(e)) ? 'true' : 'error'), v());
											})
											.catch(() => {
												((e.dataset.ready = 'error'),
													y('写真を読み込めませんでした。ページを開き直してください。'));
											}));
								}
							})(),
							v(),
							requestAnimationFrame(v),
							o.clear &&
								!g.has(o.clear) &&
								(g.add(o.clear),
								document.dispatchEvent(new CustomEvent('album-clear', { detail: o.clear }))));
					})(a),
					'answer' === n)
				) {
					!0 === a.correct && E('correct');
					const e = t.querySelector('.feedback');
					e &&
						!1 === a.correct &&
						((e.textContent = a.message), e.closest('form').classList.add('wrong'));
				} else 'init' !== n && E('page');
			} catch (n) {
				const r = t.querySelector('.feedback');
				r
					? (r.textContent = n.message)
					: ((e('#connection-status').hidden = !1),
						(e('#connection-message').textContent = n.message),
						(e('#retry-connection').hidden = !1));
			} finally {
				((a = !1), t.removeAttribute('aria-busy'), v());
			}
		}
	}
	function b() {
		try {
			const e = window.AudioContext || window.webkitAudioContext;
			if (!e || i || !s) return;
			((n && 'closed' !== n.state) || (n = new e()),
				'running' !== n.state && n.resume().catch(() => {}));
		} catch {}
	}
	function E(e = 'page') {
		if (['page', 'correct'].includes(e) && !i && s && (b(), n && 'running' === n.state))
			try {
				const t = n.createGain();
				t.connect(n.destination);
				{
					const r = 'correct' === e,
						a = Math.ceil(n.sampleRate * (r ? 0.26 : 0.14)),
						o = n.createBuffer(1, a, n.sampleRate),
						i = o.getChannelData(0);
					for (let e = 0; e < a; e++) i[e] = (2 * Math.random() - 1) * Math.sin((e / a) * Math.PI);
					const c = n.createBufferSource(),
						d = n.createBiquadFilter();
					((c.buffer = o),
						(d.type = 'bandpass'),
						(d.frequency.value = r ? 850 : 1600),
						(d.Q.value = r ? 0.65 : 1),
						(t.gain.value = ((r ? 0.028 : 0.055) * s) / 100),
						c.connect(d).connect(t),
						c.start(),
						(c.onended = () => {
							(c.disconnect(), d.disconnect(), t.disconnect());
						}));
				}
			} catch {}
	}
	async function L(e) {
		if (!r) return !1;
		if (e.dataset.saveReady) return !0;
		if (f.has(e)) return f.get(e);
		const t = (async () => {
			e.dataset.savePending = 'true';
			const t = e.querySelector('.source-image'),
				n = t.currentSrc || t.src,
				r = document.createElement('span');
			((r.className = 'visible-image'),
				r.setAttribute('aria-hidden', 'true'),
				(r.style.backgroundImage = `url("${n}")`),
				e.append(r));
			try {
				const n = await (async function (e) {
					const t = e.dataset.image;
					if (l.has(t)) return l.get(t);
					if (!m.has(t)) {
						const e = w('reveal', { image: t })
							.then(async (e) => {
								const n = new AbortController(),
									r = setTimeout(() => n.abort(), 12e3);
								try {
									const r = await fetch(e.image, {
										credentials: 'same-origin',
										cache: 'no-store',
										signal: n.signal
									});
									if (!r.ok || !/^image\/png(?:;|$)/i.test(r.headers.get('Content-Type') || ''))
										throw new Error('Image unavailable');
									const a = await r.blob(),
										o = await new Promise((e, t) => {
											const n = new FileReader();
											((n.onload = () =>
												'string' == typeof n.result && n.result.startsWith('data:image/png;base64,')
													? e(n.result)
													: t(new Error('Image unavailable'))),
												(n.onerror = () => t(new Error('Image unavailable'))),
												(n.onabort = () => t(new Error('Image unavailable'))),
												n.readAsDataURL(a));
										});
									return (l.set(t, o), o);
								} finally {
									clearTimeout(r);
								}
							})
							.finally(() => m.delete(t));
						m.set(t, e);
					}
					return m.get(t);
				})(e);
				if (!e.isConnected) return !1;
				const r = new Image();
				return (
					(r.src = n),
					await r.decode(),
					!!e.isConnected && ((t.src = n), await t.decode(), (e.dataset.saveReady = 'true'), !0)
				);
			} catch {
				return (
					(t.src = n),
					r.remove(),
					e.isConnected && y('保存用の写真を準備できませんでした。ページを開き直してください。'),
					!1
				);
			} finally {
				(delete e.dataset.savePending, f.delete(e));
			}
		})();
		return (f.set(e, t), t);
	}
	function k() {
		(e('#sound-button').setAttribute('aria-pressed', String(i)),
			(e('#volume').value = s),
			(e('#volume-value').value = s));
	}
	async function S() {
		((e('#records-status').textContent = '読み込み中……'),
			(e('#records-data').hidden = !0),
			(e('#retry-records').hidden = !0));
		try {
			const t = await w('records');
			if (!t.records) throw new Error(t.error);
			const n = t.records;
			if (
				!['plays', 'clears', 'truthClears', 'rate'].every((e) => Number.isFinite(n[e]) && n[e] >= 0)
			)
				throw new Error('記録を取得できません。');
			const r = e('#records-data');
			r.replaceChildren();
			for (const [e, t] of [
				['総プレイ回数', n.plays.toLocaleString('ja-JP')],
				['通常クリア数', n.clears.toLocaleString('ja-JP')],
				['通常クリア率', n.rate.toFixed(1) + '%'],
				['真相クリア数', n.truthClears.toLocaleString('ja-JP')]
			]) {
				const n = document.createElement('dt'),
					a = document.createElement('dd');
				((n.textContent = e), (a.textContent = t), r.append(n, a));
			}
			((e('#records-status').textContent = ''), (r.hidden = !1));
		} catch (t) {
			((e('#records-status').textContent = t.message || '記録を取得できません。'),
				(e('#retry-records').hidden = !1));
		}
	}
	(document.addEventListener('pointerover', (e) => {
		const t = e.target.closest('.image-surface');
		t && 'mouse' === e.pointerType && L(t);
	}),
		document.addEventListener('focusin', (e) => {
			e.target.matches('.answer-form input') && v();
			const t = e.target.closest('.image-surface');
			t && matchMedia('(hover: hover) and (pointer: fine)').matches && L(t);
		}),
		document.addEventListener('focusout', (e) => {
			e.target.matches('.answer-form input') && requestAnimationFrame(v);
		}),
		document.addEventListener('pointerdown', (e) => {
			e.target.closest('#sound-button') || (c = 0);
		}),
		document.addEventListener('visibilitychange', () => {
			document.hidden || b();
		}),
		document.addEventListener('keydown', (t) => {
			const n = t.key.toLowerCase(),
				r = t.ctrlKey || t.metaKey;
			if (
				'F12' === t.key ||
				(r && 'u' === n) ||
				(t.ctrlKey && t.shiftKey && ['i', 'j', 'c'].includes(n)) ||
				(t.metaKey && t.altKey && ['i', 'j', 'u'].includes(n))
			)
				return (
					t.preventDefault(),
					void (
						e('#source-notice').open ||
						document.querySelector('dialog[open]') ||
						e('#source-notice').showModal()
					)
				);
			const a = t.target.closest('.image-surface');
			if (a && ['Enter', ' '].includes(t.key) && !t.repeat) {
				if ((t.preventDefault(), !a.dataset.saveReady)) return;
				const e = document.createElement('a');
				return ((e.href = a.querySelector('img').src), (e.download = 'photo.png'), void e.click());
			}
			document.querySelector('dialog[open]') ||
				t.target.closest('input,button,a') ||
				r ||
				t.altKey ||
				(['ArrowLeft', 'ArrowRight'].includes(t.key) &&
					!t.repeat &&
					'book' === o?.mode &&
					(t.preventDefault(), p('ArrowLeft' === t.key ? 'previous' : 'next')));
		}),
		document.addEventListener('submit', (e) => {
			if (!e.target.matches('.answer-form')) return;
			e.preventDefault();
			const t = e.target.querySelector('input').value;
			t.trim() && p('answer', { value: t.normalize('NFKC') });
		}),
		document.addEventListener('click', (e) => {
			const t = e.target.closest('[data-action]');
			t && !t.disabled && p(t.dataset.action);
			const n = e.target.closest('[data-close]');
			n && document.getElementById(n.dataset.close).close();
		}),
		e('#restart-button').addEventListener('click', () => {
			a || e('#restart-dialog').showModal();
		}),
		e('#confirm-restart').addEventListener('click', () => {
			(e('#restart-dialog').close(), u.clear(), l.clear(), m.clear(), p('restart'));
		}),
		e('#settings-toggle').addEventListener('click', () => {
			const t = e('#settings-panel'),
				n = t.hidden;
			((t.hidden = !n),
				(t.inert = !n),
				e('#settings-toggle').setAttribute('aria-expanded', String(n)),
				(e('#settings-toggle span').textContent = n ? '−' : '＋'),
				v());
		}),
		e('#volume').addEventListener('input', (t) => {
			((s = Number(t.target.value)), (e('#volume-value').value = s), h(), b());
		}),
		e('#sound-button').addEventListener('click', () => {
			const t = performance.now();
			((c = t - d <= 1400 ? c + 1 : 1),
				(d = t),
				(i = !i),
				k(),
				h(),
				i || E(),
				8 === c && ((c = 0), e('#records-dialog').showModal(), S()));
		}),
		e('#retry-records').addEventListener('click', S),
		e('#retry-connection').addEventListener('click', () => {
			p('init');
		}));
	for (const e of ['pointerup', 'touchend', 'click', 'keydown'])
		document.addEventListener(e, b, { passive: !0 });
	(window.addEventListener('resize', v),
		window.visualViewport?.addEventListener('resize', v),
		window.visualViewport?.addEventListener('scroll', v),
		new ResizeObserver(v).observe(t),
		document.fonts.ready.then(v),
		k(),
		p('init'));
})();
