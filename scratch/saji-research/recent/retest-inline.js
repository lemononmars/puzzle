(() => {
	'use strict';
	const b = document.getElementById('main'),
		h = document.querySelector('.sheet'),
		w = document.querySelector('.paper-inner'),
		L = document.querySelector('.page'),
		B = document.getElementById('connection-message');
	let o = null,
		N = !1,
		u = !1,
		$,
		F = Promise.resolve(),
		i = { volume: 65, muted: !1 };
	try {
		const e = JSON.parse(localStorage.getItem('retest-preferences') || '{}');
		i = { volume: e.volume ?? 65, muted: e.muted === !0 };
	} catch {}
	((typeof i.volume != 'number' || !Number.isFinite(i.volume)) && (i.volume = 65),
		(i.volume = Math.max(0, Math.min(100, i.volume))),
		(i.muted = i.muted === !0));
	const v = (e) =>
			String(e).replace(
				/[&<>"']/g,
				(t) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[t]
			),
		K = (e, t = '') =>
			Array.isArray(t)
				? `<span class="word pencil mixed-kana">${Array.from(e[1], (n, s) => `<span class="${v(t[s] || '')}">${v(n)}</span>`).join('')}</span>`
				: `<span class="word pencil ${t}"><ruby>${v(e[0])}<rt>${v(e[1])}</rt></ruby></span>`,
		P = (e, t, n) =>
			`<div class="equation">${e ? K(e, n) : Array.isArray(n) ? `<span class="unknown pencil">${n.map((s) => `<span class="${v(s)}">\uFF1F</span>`).join('')}</span>` : `<span class="unknown pencil ${n}">\uFF1F\uFF1F\uFF1F</span>`}<span class="arrow pencil" aria-hidden="true">\u2192</span>${t ? K(t) : `<span class="unknown pencil">${'\uFF1F'.repeat(e ? Array.from(e[1]).length : 3)}</span>`}</div>`,
		D =
			['sajiqook.jp', 'www.sajiqook.jp'].includes(location.hostname) &&
			/^\/game\/retest(?:\/|$)/.test(location.pathname);
	function T(e, t = {}) {
		D && typeof window.gtag == 'function' && window.gtag('event', e, { game_slug: 'retest', ...t });
	}
	if (D) {
		((window.dataLayer = window.dataLayer || []),
			(window.gtag =
				window.gtag ||
				function () {
					window.dataLayer.push(arguments);
				}));
		const e = document.createElement('script');
		((e.async = !0),
			(e.src = 'https://www.googletagmanager.com/gtag/js?id=G-N4MP03VBEC'),
			document.head.append(e),
			window.gtag('js', new Date()),
			window.gtag('config', 'G-N4MP03VBEC', { send_page_view: !1 }),
			T('page_view', {
				page_title: 'retest',
				page_location: location.origin + location.pathname,
				page_path: location.pathname,
				content_group: 'WEB\u8B0E'
			}));
	}
	let r, k;
	function x(e = 'tap') {
		if (!(i.muted || i.volume === 0))
			try {
				((r = r || new (window.AudioContext || window.webkitAudioContext)()), r.resume());
				const t = r.currentTime,
					n = i.volume / 100;
				if (e === 'pencil' || e === 'finish') {
					if (!k) {
						k = r.createBuffer(1, Math.ceil(r.sampleRate * 0.65), r.sampleRate);
						const p = k.getChannelData(0);
						let c = 0;
						for (let l = 0; l < p.length; l++) {
							const d = Math.random() * 2 - 1;
							((c = c * 0.82 + d * 0.18),
								(p[l] =
									(d * 0.65 + c * 0.35) * (0.72 + 0.28 * Math.sin((l / r.sampleRate) * 173))));
						}
					}
					const m = (p, c, l = 1, d = !1) => {
						const f = r.createBufferSource(),
							E = r.createBiquadFilter(),
							y = r.createGain(),
							M = t + p;
						((f.buffer = k),
							(E.type = d ? 'lowpass' : 'bandpass'),
							(E.frequency.value = d ? 300 : 2600),
							(E.Q.value = 0.65),
							y.gain.setValueAtTime(0, M),
							y.gain.linearRampToValueAtTime(n * (d ? 0.08 : 0.17) * l, M + 0.008),
							y.gain.exponentialRampToValueAtTime(1e-4, M + c),
							f.connect(E),
							E.connect(y),
							y.connect(r.destination),
							f.start(M, 0, c),
							(f.onended = () => {
								(f.disconnect(), E.disconnect(), y.disconnect());
							}));
					};
					e === 'pencil'
						? m(0, 0.19)
						: (m(0, 0.07, 0.7), m(0.11, 0.08, 0.75), m(0.23, 0.26, 1), m(0.51, 0.07, 0.6, !0));
					return;
				}
				const s = r.createOscillator(),
					a = r.createGain();
				((s.type = 'sine'),
					s.frequency.setValueAtTime(420, t),
					s.frequency.exponentialRampToValueAtTime(300, t + 0.07),
					a.gain.setValueAtTime(0, t),
					a.gain.linearRampToValueAtTime(n * 0.055, t + 0.007),
					a.gain.exponentialRampToValueAtTime(1e-4, t + 0.09),
					s.connect(a),
					a.connect(r.destination),
					s.start(t),
					s.stop(t + 0.1),
					(s.onended = () => {
						(s.disconnect(), a.disconnect());
					}));
			} catch {}
	}
	function H() {
		try {
			localStorage.setItem('retest-preferences', JSON.stringify(i));
		} catch {}
	}
	let O = 0;
	function g() {
		(cancelAnimationFrame(O), (O = requestAnimationFrame(I)));
	}
	function I() {
		const e = window.visualViewport,
			t = !e || Math.abs(e.scale - 1) < 0.05,
			n = t && e ? e.height : window.innerHeight;
		((L.style.height = `${n}px`),
			(L.style.top = `${t && e ? e.offsetTop : 0}px`),
			(L.style.left = `${t && e ? e.offsetLeft : 0}px`),
			(L.style.width = `${t && e ? e.width : window.innerWidth}px`));
		const s = document.getElementById('answer-input'),
			a = s && document.activeElement === s,
			m = a || (t && e && e.height < window.innerHeight - 120);
		if (
			(L.classList.toggle('editing', !!m),
			(w.style.transform = ''),
			(w.style.width = '100%'),
			(w.style.height = '100%'),
			m)
		) {
			if (((w.style.height = 'auto'), a)) {
				const d = h.getBoundingClientRect(),
					f = s.getBoundingClientRect(),
					E = s.closest('form').querySelector('.actions').getBoundingClientRect(),
					y = Math.min(E.bottom, f.bottom + 70);
				y > d.bottom - 12
					? (h.scrollTop += y - (d.bottom - 12))
					: f.top < d.top + 12 && (h.scrollTop -= d.top + 12 - f.top);
			}
			return;
		}
		h.scrollTop = 0;
		const p = getComputedStyle(h),
			c = h.clientHeight - parseFloat(p.paddingTop) - parseFloat(p.paddingBottom),
			l = Math.min(1, c / Math.max(w.scrollHeight, c));
		l < 0.995 &&
			((w.style.width = `${100 / l}%`),
			(w.style.height = `${c / l}px`),
			(w.style.transform = `scale(${l})`));
	}
	function j() {
		(document.documentElement.style.setProperty('--text-scale', 1),
			(document.getElementById('volume').value = i.volume),
			document.getElementById('mute').setAttribute('aria-pressed', i.muted),
			requestAnimationFrame(I));
	}
	function R(e) {
		((N = e),
			document
				.querySelectorAll('[data-stage]')
				.forEach((s) => (s.disabled = e || !o?.unlocked[Number(s.dataset.stage)])),
			(document.getElementById('restart').disabled = e || !o));
		const t = b.querySelector('[type=submit]'),
			n = b.querySelector('input');
		(t && (t.disabled = e), n && (n.readOnly = e));
	}
	async function C(e, t = {}) {
		const n = async () => {
				const a = new AbortController(),
					m = setTimeout(() => a.abort(), 1e4);
				try {
					const p = await fetch('api.php', {
							method: 'POST',
							credentials: 'same-origin',
							cache: 'no-store',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								action: e,
								...(e === 'init' ? {} : { token: o.token, revision: o.revision }),
								...t
							}),
							signal: a.signal
						}),
						c = await p.json();
					if (!p.ok)
						throw new Error(
							c.error || '\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002'
						);
					return ((o = c), (B.textContent = ''), c.newClear && T('puzzle_clear'), c);
				} finally {
					clearTimeout(m);
				}
			},
			s = F.then(n);
		return ((F = s.catch(() => {})), s);
	}
	async function z() {
		clearTimeout($);
		const e = document.getElementById('answer-input');
		if (!e || u) return;
		const t = e.value;
		e.dataset.edited === 'true' &&
			(await C('edit', { text: t }), e.value === t && delete e.dataset.edited);
	}
	function _() {
		(clearTimeout($),
			($ = setTimeout(() => {
				z().catch((e) => {
					B.textContent = e.message;
				});
			}, 450)));
	}
	async function S(e, t = {}) {
		if (!(N || (u && e !== 'restart'))) {
			(e === 'restart' &&
				(document.getElementById('answer-input')?.blur(), (u = !1), clearTimeout($)),
				R(!0),
				x(e === 'submit' ? (o.view >= 2 ? 'finish' : 'pencil') : 'tap'));
			try {
				const n = typeof o.view == 'number' ? o.view + 1 : 0;
				(e !== 'restart' && (await z()),
					await C(e, t),
					W(),
					e === 'submit' &&
						(T('stage_submit', { stage: n }),
						o.result && T('retest_score', { score: o.result.score })));
			} catch (n) {
				((B.textContent = n.message),
					e === 'visit' &&
						history.replaceState(
							null,
							'',
							typeof o.view == 'number' ? `#${o.view + 1}` : '#result'
						));
			} finally {
				(R(!1), requestAnimationFrame(I));
			}
		}
	}
	function W() {
		const e = o.view,
			t = document.getElementById('stage-points');
		if (
			(h.classList.remove('loading'),
			(t.hidden = typeof e != 'number'),
			(t.textContent = o.stage ? `${o.stage.points}\u70B9` : ''),
			document.querySelectorAll('[data-stage]').forEach((n) => {
				Number(n.dataset.stage) === e
					? n.setAttribute('aria-current', 'step')
					: n.removeAttribute('aria-current');
			}),
			typeof e == 'number')
		) {
			const n = o.stage;
			((b.className = n.example ? '' : 'third'),
				(b.innerHTML = `${n.example ? `<section class="group"><h2 class="pencil">\u4F8B\u984C</h2>${P(n.example[0], n.example[1], n.tone)}</section>` : ''}<section class="group"><h2 class="pencil">\u554F\u984C</h2>${P(n.source, n.destination, n.tone)}</section><form id="answer-form" class="answer" autocomplete="off"><label class="label pencil" for="answer-input">\u89E3\u7B54</label><div class="entry${o.answer.confirmed ? ' submitted' : ''}"><input id="answer-input" aria-label="\u89E3\u7B54" type="text" maxlength="40" spellcheck="false" autocapitalize="off" autocomplete="off" value="${v(o.answer.text)}"></div><div class="actions"><button type="submit" class="paper-button pencil">${e >= 2 ? '\u5168\u3066\u306E\u89E3\u7B54\u3092\u78BA\u5B9A' : '\u78BA\u5B9A'}</button></div></form>`));
			const s = document.getElementById('answer-input');
			(s.closest('.entry').classList.toggle('literal', o.answer.tone === 'black'),
				s.addEventListener('compositionstart', () => {
					((u = !0), clearTimeout($));
				}),
				s.addEventListener('compositionend', () => {
					((u = !1),
						(s.dataset.edited = 'true'),
						s.closest('.entry').classList.remove('submitted'),
						_());
				}),
				s.addEventListener('focus', () => {
					(I(), setTimeout(g, 80), setTimeout(g, 350));
				}),
				s.addEventListener('blur', () => {
					((u = !1), s.dataset.edited === 'true' && _(), g(), setTimeout(g, 350));
				}),
				s.addEventListener('input', () => {
					((s.dataset.edited = 'true'),
						s.closest('.entry').classList.remove('submitted'),
						u || _());
				}),
				s.addEventListener('keydown', (a) => {
					a.key === 'Enter' && (a.isComposing || u || a.keyCode === 229) && a.preventDefault();
				}),
				document.getElementById('answer-form').addEventListener('submit', (a) => {
					(a.preventDefault(), S('submit'));
				}));
		} else {
			const { score: n, displayMaxScore: s, perfect: a } = o.result;
			((b.className = `result${a ? ' perfect' : ''}`),
				(b.innerHTML = `<h2 class="pencil">\u63A1\u70B9\u7D50\u679C</h2><p class="score pencil" aria-label="${n}\u70B9\u3001${s}\u70B9\u6E80\u70B9">${n}<span class="denominator">/ ${s} \u70B9</span></p><p class="result-message pencil">${v(o.result.message)}</p><div class="actions"><button id="revisit" class="paper-button pencil" type="button">\u898B\u76F4\u3059</button><a id="share" class="paper-button pencil" href="${v(U())}" target="_blank" rel="noopener noreferrer">X\u3067\u30B7\u30A7\u30A2</a></div>`),
				document
					.getElementById('revisit')
					.addEventListener('click', () => void S('visit', { index: 0 })),
				document.getElementById('share').addEventListener('click', () => {
					(x(), T('share', { method: 'X' }));
				}));
		}
		((u = !1),
			history.replaceState(null, '', typeof e == 'number' ? `#${e + 1}` : '#result'),
			(document.getElementById('announcement').textContent =
				typeof e == 'number'
					? `\u7B2C${e + 1}\u554F`
					: `${o.result.score}\u70B9\u3001${o.result.displayMaxScore}\u70B9\u6E80\u70B9\u3002`),
			R(!1),
			j());
	}
	const G = 'https://x.com/saji_qook/status/2108331613654483221';
	function U() {
		const e = [o.result.shareText, 'https://sajiqook.jp/game/retest', '', '#retest'];
		return (
			G && e.push(G),
			`https://x.com/intent/tweet?text=${encodeURIComponent(
				e.join(`
`)
			)}`
		);
	}
	document
		.querySelectorAll('[data-stage]')
		.forEach((e) =>
			e.addEventListener('click', () => void S('visit', { index: Number(e.dataset.stage) }))
		);
	const V = document.getElementById('restart-confirm');
	(document.getElementById('restart').addEventListener('click', () => {
		N ||
			!o ||
			(document.getElementById('answer-input')?.blur(), (u = !1), x(), V.open || V.showModal());
	}),
		document.getElementById('restart-accept').addEventListener('click', () => {
			(V.close(), S('restart'));
		}));
	const X = document.getElementById('settings'),
		A = document.getElementById('settings-open');
	(A.addEventListener('click', () => {
		(x(), X.showModal(), A.setAttribute('aria-expanded', 'true'));
	}),
		X.addEventListener('close', () => {
			(A.setAttribute('aria-expanded', 'false'), A.focus({ preventScroll: !0 }));
		}),
		document.querySelectorAll('[data-close]').forEach((e) =>
			e.addEventListener('click', () => {
				(x(), e.closest('dialog').close());
			})
		),
		document.querySelectorAll('dialog').forEach((e) =>
			e.addEventListener('click', (t) => {
				if (t.target === e) {
					const n = e.getBoundingClientRect();
					(t.clientX < n.left ||
						t.clientX > n.right ||
						t.clientY < n.top ||
						t.clientY > n.bottom) &&
						e.close();
				}
			})
		),
		document.getElementById('volume').addEventListener('input', (e) => {
			((i.volume = Number(e.target.value)), H());
		}),
		document.getElementById('volume').addEventListener('change', () => x()));
	let q = 0,
		J = 0;
	document.getElementById('mute').addEventListener('click', () => {
		((i.muted = !i.muted), j(), H(), x());
		const e = Date.now();
		((q = e - J < 1600 ? q + 1 : 1), (J = e), q === 8 && ((q = 0), Y()));
	});
	async function Y() {
		const e = document.getElementById('records'),
			t = document.getElementById('records-message');
		t.textContent = '\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026';
		for (const n of ['plays', 'clears', 'rate', 'full-score'])
			document.getElementById('record-' + n).textContent = '\u2014';
		e.showModal();
		try {
			const n = await fetch('records.php', { cache: 'no-store', signal: AbortSignal.timeout(8e3) }),
				s = await n.json();
			if (!n.ok)
				throw new Error(
					s.error ||
						'\u8A18\u9332\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002'
				);
			if (!Number.isInteger(s.plays) || !Number.isInteger(s.clears))
				throw new Error(
					'\u8A18\u9332\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002'
				);
			((document.getElementById('record-plays').textContent = s.plays.toLocaleString()),
				(document.getElementById('record-clears').textContent = s.clears.toLocaleString()),
				(document.getElementById('record-rate').textContent = s.rate + '%'),
				Number.isInteger(s.fullScoreWinners) && s.fullScoreWinners >= 0
					? ((document.getElementById('record-full-score').textContent =
							s.fullScoreWinners.toLocaleString()),
						(t.textContent = ''))
					: (t.textContent =
							'150\u70B9\u7372\u5F97\u8005\u6570\u306F\u96C6\u8A08\u6E96\u5099\u4E2D\u3067\u3059\u3002'));
		} catch (n) {
			t.textContent =
				n.name === 'TimeoutError'
					? '\u63A5\u7D9A\u304C\u9045\u308C\u3066\u3044\u307E\u3059\u3002\u6642\u9593\u3092\u304A\u3044\u3066\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002'
					: n.message;
		}
	}
	(document.addEventListener('keydown', (e) => {
		const t = e.key.toLowerCase();
		if (
			t === 'f12' ||
			(e.ctrlKey && !e.shiftKey && t === 'u') ||
			(e.metaKey && e.altKey && t === 'u') ||
			((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(t)) ||
			(e.metaKey && e.altKey && ['i', 'j', 'c'].includes(t))
		) {
			e.preventDefault();
			const s = document.getElementById('source-notice');
			s.open || s.showModal();
		}
	}),
		window.addEventListener('resize', g),
		window.visualViewport?.addEventListener('resize', g),
		window.visualViewport?.addEventListener('scroll', g),
		window.addEventListener('pageshow', g),
		document.addEventListener('visibilitychange', () => {
			document.hidden || g();
		}));
	function Q() {
		if (!o) return;
		const e = location.hash,
			t = /^#[1-9]\d*$/.test(e) ? Number(e.slice(1)) - 1 : null;
		t !== null && t !== o.view
			? S('visit', { index: t })
			: (e !== '#result' || o.view !== 'result') &&
				history.replaceState(null, '', typeof o.view == 'number' ? `#${o.view + 1}` : '#result');
	}
	(window.addEventListener('hashchange', Q),
		j(),
		C('init')
			.then(async () => {
				const e = location.hash,
					t = /^#[1-9]\d*$/.test(e) ? Number(e.slice(1)) - 1 : null;
				if (t !== null && t !== o.view)
					try {
						await C('visit', { index: t });
					} catch (n) {
						B.textContent = n.message;
					}
				(W(), document.fonts.ready.then(I));
			})
			.catch((e) => {
				(h.classList.remove('loading'),
					(b.innerHTML =
						'<p>\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002</p><div class="actions"><button class="paper-button" id="reconnect" type="button">\u518D\u63A5\u7D9A</button></div>'),
					(B.textContent = e.message),
					document.getElementById('reconnect').addEventListener('click', () => location.reload()));
			}));
})();
