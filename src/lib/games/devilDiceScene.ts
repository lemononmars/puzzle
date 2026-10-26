import * as THREE from 'three';
import { defaultAvatar, seedColors, leafColors, type Avatar } from './demonDiceAvatar.js';
import {
	at,
	inside,
	slideProgress,
	SINK_DURATION,
	SPAWN_WARNING_MS,
	type Die,
	type Kind,
	type State
} from './devilDice.js';
import {
	dieColors,
	facingAngle,
	dieElevation,
	dieOpacity,
	dieMovementDuration
} from './devilDiceVisuals.js';

// Keep the renderer independent of rules; snapshots describe every logical face and position.
export function createDiceScene(host: HTMLDivElement) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.localClippingEnabled = true;
	const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
	renderer.domElement.setAttribute('aria-hidden', 'true');
	host.appendChild(renderer.domElement);
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
	camera.position.set(8, 10, 11);
	camera.lookAt(0, 0, 0);
	scene.add(new THREE.HemisphereLight(0xffffff, 0x66705b, 0.65));
	const light = new THREE.DirectionalLight(0xffffff, 0.7);
	light.position.set(-3, 10, 4);
	scene.add(light);
	const sampler = document.createElement('canvas');
	sampler.width = sampler.height = 1;
	const sample = sampler.getContext('2d')!;
	const probe = document.createElement('span');
	// Theme color transitions must not interpolate the palette sampling probe.
	probe.style.transition = 'none';
	probe.style.animation = 'none';
	host.appendChild(probe);
	function color(token: string) {
		probe.style.color = `var(--color-${token})`;
		sample.fillStyle = getComputedStyle(probe).color;
		sample.fillRect(0, 0, 1, 1);
		const [r, g, b] = sample.getImageData(0, 0, 1, 1).data;
		return `rgb(${r},${g},${b})`;
	}
	const ink = color('base-content'),
		cream = color('base-100');
	const primary = color('primary'),
		primaryInk = color('primary-content'),
		success = color('success'),
		accent = color('accent');
	probe.remove();
	const materialCache = new Map<string, THREE.MeshStandardMaterial>();
	const dots: Record<number, number[][]> = {
		1: [[0, 0]],
		2: [
			[-1, -1],
			[1, 1]
		],
		3: [
			[-1, -1],
			[0, 0],
			[1, 1]
		],
		4: [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		],
		5: [
			[-1, -1],
			[1, -1],
			[0, 0],
			[-1, 1],
			[1, 1]
		],
		6: [
			[-1, -1],
			[1, -1],
			[-1, 0],
			[1, 0],
			[-1, 1],
			[1, 1]
		]
	};
	function material(kind: Kind, n: number) {
		const key = `${kind}:${n}`;
		const cached = materialCache.get(key);
		if (cached) return cached;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 192;
		const ctx = canvas.getContext('2d')!;
		const palette = dieColors(kind, n),
			surface = palette.surface,
			content = palette.pip;
		ctx.fillStyle = surface;
		ctx.fillRect(0, 0, 192, 192);
		ctx.globalAlpha = 0.15;
		if (kind === 'wood')
			for (let i = 15; i < 190; i += 13) {
				ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.bezierCurveTo(i + 18, 60, i - 12, 120, i + 3, 192);
				ctx.stroke();
			}
		if (kind === 'ice')
			for (let i = -192; i < 384; i += 48) {
				ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.lineTo(i + 192, 192);
				ctx.stroke();
			}
		if (kind === 'stone')
			for (let i = 0; i < 60; i++) {
				ctx.fillStyle = content;
				ctx.fillRect((i * 47) % 188, (i * 73) % 188, 3, 3);
			}
		ctx.globalAlpha = 1;
		ctx.fillStyle = palette.pip;
		for (const [x, y] of dots[n]) {
			ctx.beginPath();
			ctx.arc(96 + x * 42, 91 + y * 40, 11, 0, Math.PI * 2);
			ctx.fill();
		}
		if (kind === 'metal')
			for (const [x, y] of [
				[15, 15],
				[177, 15],
				[15, 177],
				[177, 177]
			]) {
				ctx.beginPath();
				ctx.arc(x, y, 4, 0, 7);
				ctx.fill();
			}
		const map = new THREE.CanvasTexture(canvas);
		map.encoding = THREE.sRGBEncoding;
		map.anisotropy = 4;
		const mat = new THREE.MeshStandardMaterial({
			map,
			transparent: true,
			clippingPlanes: [groundPlane],
			roughness: kind === 'metal' ? 0.3 : 0.75,
			metalness: kind === 'metal' ? 0.65 : 0
		});
		materialCache.set(key, mat);
		return mat;
	}
	const faces = (d: Die) =>
		[d.east, 7 - d.east, d.top, 7 - d.top, 7 - d.north, d.north].map((n) => material(d.kind, n));
	const geometry = new THREE.BoxGeometry(0.87, 0.87, 0.87);
	const edgeGeometry = new THREE.EdgesGeometry(geometry);
	const edgeMaterial = new THREE.LineBasicMaterial({
		color: ink,
		transparent: true,
		opacity: 0.3,
		clippingPlanes: [groundPlane]
	});
	const floor = new THREE.Group();
	scene.add(floor);
	const tileGeometry = new THREE.BoxGeometry(0.97, 0.12, 0.97);
	const turf = document.createElement('canvas');
	turf.width = turf.height = 128;
	const turfPaint = turf.getContext('2d')!;
	turfPaint.fillStyle = cream;
	turfPaint.fillRect(0, 0, 128, 128);
	turfPaint.strokeStyle = primary;
	turfPaint.globalAlpha = 0.14;
	for (let i = 0; i < 85; i++) {
		const x = (i * 47) % 128,
			y = (i * 73) % 128;
		turfPaint.beginPath();
		turfPaint.moveTo(x, y);
		turfPaint.lineTo(x + 2, y - 4);
		turfPaint.stroke();
	}
	const turfMap = new THREE.CanvasTexture(turf);
	turfMap.encoding = THREE.sRGBEncoding;
	const tileMaterials = [
		new THREE.MeshStandardMaterial({
			color: new THREE.Color(primary).lerp(new THREE.Color(cream), 0.65),
			map: turfMap,
			roughness: 1
		}),
		new THREE.MeshStandardMaterial({
			color: new THREE.Color(primary).lerp(new THREE.Color(cream), 0.8),
			map: turfMap,
			roughness: 1
		})
	];
	const baseMaterial = new THREE.MeshStandardMaterial({ color: primary, roughness: 1 });
	const leafGeometry = new THREE.SphereGeometry(0.12, 7, 5);
	const stemGeometry = new THREE.CylinderGeometry(0.018, 0.025, 0.23, 5);
	const leafMaterial = new THREE.MeshStandardMaterial({ color: primary });
	const petalMaterial = new THREE.MeshStandardMaterial({ color: accent });
	const flowerCenterMaterial = new THREE.MeshStandardMaterial({ color: cream });
	function plant(x: number, z: number, flower: boolean) {
		const cluster = new THREE.Group();
		cluster.position.set(x, -0.12, z);
		for (let i = 0; i < 3; i++) {
			const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
			leaf.scale.set(0.65, 0.4, 1.7);
			leaf.position.y = 0.05;
			leaf.rotation.set(0.2, (i * Math.PI * 2) / 3, 0.3);
			cluster.add(leaf);
		}
		if (flower) {
			const stem = new THREE.Mesh(stemGeometry, leafMaterial);
			stem.position.y = 0.15;
			cluster.add(stem);
			for (let i = 0; i < 5; i++) {
				const petal = new THREE.Mesh(leafGeometry, petalMaterial),
					angle = (i * Math.PI * 2) / 5;
				petal.position.set(Math.cos(angle) * 0.09, 0.29, Math.sin(angle) * 0.09);
				petal.scale.set(0.65, 0.3, 0.65);
				cluster.add(petal);
			}
			const center = new THREE.Mesh(leafGeometry, flowerCenterMaterial);
			center.scale.set(0.38, 0.3, 0.38);
			center.position.y = 0.32;
			cluster.add(center);
		}
		floor.add(cluster);
	}
	let baseGeometry: THREE.BoxGeometry | undefined;
	type Visual = {
		mesh: THREE.Mesh;
		outline: THREE.LineSegments;
		die: Die;
		from: THREE.Vector3;
		start: number;
		duration: number;
		rotation: THREE.Quaternion;
		fromRotation: THREE.Quaternion;
		materials: THREE.MeshStandardMaterial[];
		rolling: boolean;
	};
	const dice = new Map<number, Visual>();
	const previewScene = new THREE.Scene();
	previewScene.add(new THREE.HemisphereLight(0xffffff, 0x66705b, 0.8));
	const previewLight = new THREE.DirectionalLight(0xffffff, 0.8);
	previewLight.position.copy(light.position);
	previewScene.add(previewLight);
	const previewCamera = new THREE.OrthographicCamera(-0.85, 0.85, 0.85, -0.85, 0.1, 30);
	previewCamera.position.copy(camera.position);
	previewCamera.lookAt(0, 0, 0);
	let preview: THREE.Mesh | undefined;
	let previewId: number | undefined;
	let previewMaterials: THREE.MeshStandardMaterial[] = [];
	const warnings = new Map<number, { group: THREE.Group; material: THREE.MeshBasicMaterial }>();
	const warningGeometry = new THREE.RingGeometry(0.22, 0.36, 36);
	const markerGeometry = new THREE.OctahedronGeometry(0.1);
	const starMaterial = new THREE.MeshBasicMaterial({ color: accent });
	const stars = new THREE.Group();
	for (let i = 0; i < 5; i++) {
		const star = new THREE.Mesh(markerGeometry, starMaterial);
		stars.add(star);
	}
	stars.visible = false;
	scene.add(stars);
	let lossStart: number | undefined;
	let winStart: number | undefined;
	let state: State | undefined,
		reduced = false,
		width = 0,
		height = 0,
		frozenWall: number | undefined;
	const character = new THREE.Group();
	const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#bd8766', roughness: 0.85 });
	const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#302e25' });
	const bodyGeo = new THREE.SphereGeometry(0.19, 16, 12),
		eyeGeo = new THREE.SphereGeometry(0.028, 8, 8);
	const mouthGeo = new THREE.TorusGeometry(0.043, 0.008, 6, 12, Math.PI);
	const body = new THREE.Mesh(bodyGeo, bodyMaterial);
	body.position.y = 0.24;
	body.scale.set(1, 1.25, 0.85);
	character.add(body);
	const crown = new THREE.Group();
	const crownMaterial = leafMaterial.clone();
	crown.position.y = 0.48;
	const stem = new THREE.Mesh(stemGeometry, crownMaterial);
	stem.scale.setScalar(0.5);
	stem.position.y = 0.035;
	crown.add(stem);
	const roots: THREE.Mesh[] = [];
	for (const sign of [-1, 1]) {
		const leaf = new THREE.Mesh(leafGeometry, crownMaterial);
		leaf.position.set(sign * 0.105, 0.09, 0);
		leaf.scale.set(1.1, 0.32, 0.55);
		leaf.rotation.z = sign * 0.5;
		crown.add(leaf);
		const root = new THREE.Mesh(bodyGeo, bodyMaterial);
		root.position.set(sign * 0.105, 0.035, 0.07);
		root.scale.set(0.42, 0.18, 0.55);
		character.add(root);
		roots.push(root);
		const eye = new THREE.Mesh(eyeGeo, eyeMaterial);
		eye.position.set(sign * 0.07, 0.3, 0.15);
		eye.scale.set(1, 1.2, 0.7);
		character.add(eye);
		const glint = new THREE.Mesh(eyeGeo, flowerCenterMaterial);
		glint.scale.setScalar(0.28);
		glint.position.set(sign * 0.07 + 0.006, 0.31, 0.169);
		character.add(glint);
	}
	const mouth = new THREE.Mesh(mouthGeo, eyeMaterial);
	mouth.position.set(0, 0.22, 0.164);
	mouth.rotation.z = Math.PI;
	character.add(mouth);
	character.add(crown);
	const mascotFlower = new THREE.Group();
	mascotFlower.name = 'mascotFlower';
	for (let i = 0; i < 5; i++) {
		const petal = new THREE.Mesh(leafGeometry, petalMaterial);
		petal.scale.set(0.35, 0.3, 0.35);
		petal.position.set(
			Math.cos((i * Math.PI * 2) / 5) * 0.045,
			0.65 + Math.sin((i * Math.PI * 2) / 5) * 0.045,
			0.025
		);
		mascotFlower.add(petal);
	}
	const mascotBow = new THREE.Mesh(markerGeometry, petalMaterial);
	mascotBow.name = 'mascotBow';
	mascotBow.position.set(0, 0.43, 0.1);
	mascotBow.scale.set(1.2, 0.45, 0.45);
	mascotFlower.visible = mascotBow.visible = false;
	character.add(mascotFlower, mascotBow);
	character.rotation.y = 0;
	scene.add(character);
	let rival:
		| {
				group: THREE.Group;
				body: THREE.MeshStandardMaterial;
				crown: THREE.MeshStandardMaterial;
				position: State['player'];
		  }
		| undefined;
	let playerFrom = new THREE.Vector3(),
		playerStart = 0;
	const position = (x: number, y: number) =>
		new THREE.Vector3(x - (width - 1) / 2, 0.435, y - (height - 1) / 2);
	function resize() {
		const w = host.clientWidth,
			h = host.clientHeight;
		renderer.setSize(w, h);
		const aspect = w / Math.max(1, h);
		// Fit the projected board bounds, rather than leaving a large square camera margin.
		const span =
			Math.max(
				(width * 0.35 + height * 0.48 + 1.8) / 2,
				(width * 0.81 + height * 0.59 + 0.5) / (2 * aspect)
			) * 1.06;
		camera.left = -span * aspect;
		camera.right = span * aspect;
		camera.top = span;
		camera.bottom = -span;
		camera.updateProjectionMatrix();
	}
	function sync(next: State, animate = true) {
		const now = performance.now();
		if (width !== next.width || height !== next.height) {
			width = next.width;
			height = next.height;
			floor.clear();
			baseGeometry?.dispose();
			baseGeometry = new THREE.BoxGeometry(width + 0.22, 0.28, height + 0.22);
			if (!next.removedTiles?.length) {
				const base = new THREE.Mesh(baseGeometry, baseMaterial);
				base.position.y = -0.24;
				floor.add(base);
			}
			for (let y = 0; y < height; y++)
				for (let x = 0; x < width; x++) {
					if (!inside(next, x, y)) continue;
					const tile = new THREE.Mesh(tileGeometry, tileMaterials[(x + y) % 2]);
					tile.position.set(x - (width - 1) / 2, -0.065, y - (height - 1) / 2);
					floor.add(tile);
				}
			for (const sign of [-1, 1]) {
				for (let i = 0; i < width; i += 2)
					plant(i - (width - 1) / 2, sign * (height / 2 + 0.16), i % 4 === 0);
				for (let i = 0; i < height; i += 2)
					plant(sign * (width / 2 + 0.16), i - (height - 1) / 2, i % 4 === 0);
			}
			resize();
		}
		for (const [id, v] of dice)
			if (!next.dice.some((d) => d.id === id)) {
				scene.remove(v.mesh);
				v.materials.forEach((m) => m.dispose());
				(v.outline.material as THREE.LineBasicMaterial).dispose();
				dice.delete(id);
			}
		for (const [id, v] of warnings)
			if (!next.trial?.warnings.some((w) => w.id === id)) {
				scene.remove(v.group);
				v.material.dispose();
				warnings.delete(id);
			}
		for (const warning of next.trial?.warnings ?? []) {
			let v = warnings.get(warning.id);
			if (!v) {
				const material = new THREE.MeshBasicMaterial({
					color: accent,
					transparent: true,
					opacity: 0.7,
					side: THREE.DoubleSide,
					depthWrite: false
				});
				const group = new THREE.Group();
				const ring = new THREE.Mesh(warningGeometry, material);
				ring.rotation.x = -Math.PI / 2;
				group.add(ring);
				const marker = new THREE.Mesh(markerGeometry, material);
				marker.position.y = 0.14;
				group.add(marker);
				scene.add(group);
				v = { group, material };
				warnings.set(warning.id, v);
			}
			v.group.position.set(warning.x - (width - 1) / 2, 0.025, warning.y - (height - 1) / 2);
		}
		for (const d of next.dice) {
			let v = dice.get(d.id);
			if (!v) {
				const materials = faces(d).map((m) => {
					const copy = m.clone();
					return copy;
				});
				const mesh = new THREE.Mesh(geometry, materials);
				mesh.position.copy(position(d.x, d.y));
				const outline = new THREE.LineSegments(edgeGeometry, edgeMaterial.clone());
				mesh.add(outline);
				scene.add(mesh);
				v = {
					mesh,
					outline,
					die: { ...d },
					from: mesh.position.clone(),
					start: 0,
					duration: 0,
					rotation: new THREE.Quaternion(),
					fromRotation: new THREE.Quaternion(),
					materials,
					rolling: false
				};
				dice.set(d.id, v);
			}
			const moved = v.die.x !== d.x || v.die.y !== d.y;
			if (moved) {
				v.from.copy(v.mesh.position);
				v.fromRotation.copy(v.mesh.quaternion);
				v.start = now;
				v.duration = animate && !reduced ? dieMovementDuration(v.die, d) : 0;
				if (d.slide && !reduced) {
					v.from.copy(position(d.slide.fromX, d.slide.fromY));
					v.start = now + d.slide.started - Date.now();
					v.duration = d.slide.duration;
				}
				v.rolling = v.die.top !== d.top || v.die.north !== d.north || v.die.east !== d.east;
				const dx = Math.sign(d.x - v.die.x),
					dz = Math.sign(d.y - v.die.y);
				if (v.rolling) {
					const turn = new THREE.Quaternion().setFromAxisAngle(
						new THREE.Vector3(dz, 0, -dx),
						Math.PI / 2
					);
					v.rotation.premultiply(turn).normalize();
				}
				if (!v.duration) {
					v.mesh.position.copy(position(d.x, d.y));
					v.mesh.quaternion.copy(v.rotation);
				}
			}
			v.die = { ...d };
			(v.outline.material as THREE.LineBasicMaterial).color.set(
				d.sinking !== undefined ? success : ink
			);
		}
		if (!state || !animate || reduced) {
			character.position.copy(position(next.player.x, next.player.y));
			character.position.y = next.player.riding ? 0.87 : 0;
			playerStart = 0;
		} else if (
			state.player.x !== next.player.x ||
			state.player.y !== next.player.y ||
			state.player.riding !== next.player.riding
		) {
			playerFrom.copy(character.position);
			playerStart = now;
		}
		character.rotation.y = facingAngle[next.player.facing ?? 'down'];
		host.dataset.facing = next.player.facing ?? 'down';
		state = next;
	}
	const observer = new ResizeObserver(resize);
	observer.observe(host);
	let frame = 0,
		disposed = false;
	function render() {
		if (disposed) return;
		const now = performance.now(),
			wall = frozenWall ?? Date.now();
		let active = 0;
		for (const warning of state?.trial?.warnings ?? []) {
			const v = warnings.get(warning.id);
			if (!v) continue;
			const progress = Math.max(0, 1 - (warning.appearsAt - wall) / SPAWN_WARNING_MS);
			const pulse = reduced ? 1 : 1 + Math.sin(wall / 120) * 0.12;
			v.group.scale.setScalar(pulse);
			v.material.opacity = 0.35 + progress * 0.6;
			v.group.rotation.y = reduced ? 0 : wall / 900;
		}
		for (const v of dice.values()) {
			const t =
				!reduced && v.die.slide
					? slideProgress(v.die, wall)
					: v.duration
						? Math.max(0, Math.min(1, (now - v.start) / v.duration))
						: 1;
			const e = v.die.slide ? slideProgress(v.die, wall) : t * t * (3 - 2 * t);
			v.mesh.position.lerpVectors(v.from, position(v.die.x, v.die.y), v.duration ? e : 1);
			if (t < 1) {
				active++;
				if (v.rolling) {
					v.mesh.quaternion.slerpQuaternions(v.fromRotation, v.rotation, e);
					v.mesh.position.y += Math.sin(e * Math.PI) * 0.18;
				}
			} else if (v.duration) {
				v.duration = 0;
				v.mesh.quaternion.copy(v.rotation);
			}
			v.mesh.scale.set(1, 1, 1);
			const elevation = dieElevation(v.die, wall, state?.sinkDuration ?? SINK_DURATION, reduced);
			const opacity = dieOpacity(v.die, wall, state?.sinkDuration ?? SINK_DURATION);
			for (const material of v.materials) {
				material.opacity = opacity;
				material.depthWrite = true;
			}
			(v.outline.material as THREE.LineBasicMaterial).opacity =
				opacity * (v.die.sinking !== undefined ? 1 : 0.3);
			if (!v.duration || !v.rolling) v.mesh.position.y = elevation;
		}
		if (state) {
			if (rival) {
				const support = rival.position.riding
					? at(state, rival.position.x, rival.position.y)
					: undefined;
				const visual = support ? dice.get(support.id) : undefined;
				const dest = position(rival.position.x, rival.position.y);
				dest.y = visual ? Math.max(0, visual.mesh.position.y + 0.435) : 0;
				rival.group.position.lerp(dest, reduced ? 1 : 0.16);
				rival.group.rotation.y = facingAngle[rival.position.facing ?? 'down'];
			}
			const p = state.player;
			body.scale.y = (p.riding ? 1.1 : 1.25) + (reduced ? 0 : Math.sin(now / 700) * 0.025);
			crown.rotation.z = reduced
				? 0
				: Math.sin(now / (playerStart ? 80 : 650)) * (playerStart ? 0.16 : 0.06);
			crown.rotation.x = lossStart !== undefined ? 0.85 : 0;
			const ridden = p.riding ? at(state, p.x, p.y) : undefined;
			const visual = ridden ? dice.get(ridden.id) : undefined;
			if (visual && previewId !== ridden?.id) {
				if (preview) previewScene.remove(preview);
				previewMaterials.forEach((material) => material.dispose());
				previewMaterials = visual.materials.map((material) => {
					const copy = material.clone();
					copy.clippingPlanes = [];
					copy.opacity = 1;
					copy.transparent = false;
					return copy;
				});
				preview = new THREE.Mesh(geometry, previewMaterials);
				previewScene.add(preview);
				previewId = ridden?.id;
			}
			if (preview) {
				preview.visible = !!visual;
				if (visual) preview.quaternion.copy(visual.mesh.quaternion);
			}
			host.dataset.preview = visual ? String(ridden!.id) : '';
			host.dataset.previewRotation = visual ? visual.mesh.quaternion.toArray().join(',') : '';
			host.dataset.ridingRotation = visual
				? visual.mesh.quaternion
						.toArray()
						.map((n) => n.toFixed(4))
						.join(',')
				: '';
			const dest = position(p.x, p.y);
			dest.y = visual ? Math.max(0, visual.mesh.position.y + 0.435) : 0;
			if (playerStart && !reduced) {
				const t = Math.min(1, (now - playerStart) / 420);
				character.position.lerpVectors(playerFrom, dest, t * t * (3 - 2 * t));
				character.position.y += Math.sin(t * Math.PI) * 0.025;
				roots.forEach((root, i) => {
					root.rotation.x = Math.sin(t * Math.PI * 4 + i * Math.PI) * 0.4;
				});
				if (t === 1) playerStart = 0;
			} else {
				character.position.copy(dest);
				roots.forEach((root) => (root.rotation.x = 0));
			}
			if (winStart !== undefined) {
				const t = reduced ? 1 : Math.min(1, (now - winStart) / 1600);
				character.position.y += Math.abs(Math.sin(t * Math.PI * 3)) * 0.28 * (1 - t * 0.5);
				character.rotation.y = facingAngle[p.facing ?? 'down'] + t * Math.PI * 2;
				crown.rotation.z = reduced ? 0 : Math.sin(t * Math.PI * 8) * 0.22 * (1 - t);
				roots.forEach(
					(root, i) =>
						(root.rotation.x = reduced
							? 0
							: Math.sin(t * Math.PI * 6 + i * Math.PI) * 0.4 * (1 - t))
				);
			}
			if (lossStart !== undefined) {
				const t = reduced ? 1 : Math.min(1, (now - lossStart) / 1500);
				character.position.y += Math.sin(t * Math.PI) * 0.3;
				character.rotation.y = facingAngle[p.facing ?? 'down'];
				character.rotation.z = Math.sin(t * Math.PI * 3) * 0.12 * (1 - t);
				body.scale.y = 1.1 - t * 0.2;
				stars.visible = true;
				stars.position.copy(character.position);
				stars.children.forEach((star, i) => {
					const a = (i / 5) * Math.PI * 2 + (reduced ? 0 : now / 250);
					star.position.set(Math.cos(a) * 0.4, 0.7 + Math.sin(a * 2) * 0.06, Math.sin(a) * 0.4);
				});
			}
		}
		host.dataset.animating = String(active);
		host.dataset.warnings = String(warnings.size);
		renderer.autoClear = false;
		renderer.setViewport(0, 0, host.clientWidth, host.clientHeight);
		renderer.clear();
		renderer.render(scene, camera);
		if (preview?.visible) {
			const size = Math.min(110, host.clientWidth * 0.25);
			renderer.setScissorTest(true);
			renderer.setScissor(8, host.clientHeight - size - 8, size, size);
			renderer.setViewport(8, host.clientHeight - size - 8, size, size);
			renderer.clearDepth();
			renderer.render(previewScene, previewCamera);
			renderer.setScissorTest(false);
		}
		frame = requestAnimationFrame(render);
	}
	render();
	return {
		sync,
		setAvatar(avatar: Avatar = defaultAvatar) {
			bodyMaterial.color.set(seedColors[avatar.seed]);
			crownMaterial.color.set(leafColors[avatar.leaves]);
			mascotFlower.visible = avatar.accessory === 'flower';
			mascotBow.visible = avatar.accessory === 'bow';
		},
		setOpponent(opponent: { position: State['player']; avatar: Avatar; name: string } | undefined) {
			if (!opponent) {
				if (rival) {
					scene.remove(rival.group);
					rival.body.dispose();
					rival.crown.dispose();
					rival = undefined;
				}
				return;
			}
			if (!rival) {
				const group = character.clone(true),
					bodyCopy = bodyMaterial.clone(),
					crownCopy = crownMaterial.clone();
				group.traverse((object) => {
					if (object instanceof THREE.Mesh) {
						if (object.material === bodyMaterial) object.material = bodyCopy;
						else if (object.material === crownMaterial) object.material = crownCopy;
					}
				});
				group.position.copy(position(opponent.position.x, opponent.position.y));
				scene.add(group);
				rival = { group, body: bodyCopy, crown: crownCopy, position: opponent.position };
			}
			rival.position = opponent.position;
			rival.body.color.set(seedColors[opponent.avatar.seed]);
			rival.crown.color.set(leafColors[opponent.avatar.leaves]);
			rival.group.getObjectByName('mascotFlower')!.visible = opponent.avatar.accessory === 'flower';
			rival.group.getObjectByName('mascotBow')!.visible = opponent.avatar.accessory === 'bow';
			host.dataset.opponent = opponent.name;
		},
		setWon(value: boolean) {
			if (value && winStart === undefined) winStart = performance.now();
			else if (!value) winStart = undefined;
			host.dataset.celebrating = String(value);
		},
		setLost(value: boolean) {
			if (value && lossStart === undefined) lossStart = performance.now();
			else if (!value) {
				lossStart = undefined;
				stars.visible = false;
				character.rotation.z = 0;
			}
		},
		setPaused(value: boolean) {
			if (value && frozenWall === undefined) frozenWall = Date.now();
			else if (!value) frozenWall = undefined;
		},
		setReduced(value: boolean) {
			reduced = value;
			if (value) {
				playerStart = 0;
				for (const v of dice.values()) {
					v.duration = 0;
					v.mesh.quaternion.copy(v.rotation);
				}
			}
		},
		dispose() {
			disposed = true;
			cancelAnimationFrame(frame);
			observer.disconnect();
			geometry.dispose();
			edgeGeometry.dispose();
			tileGeometry.dispose();
			turfMap.dispose();
			leafGeometry.dispose();
			stemGeometry.dispose();
			leafMaterial.dispose();
			petalMaterial.dispose();
			flowerCenterMaterial.dispose();
			baseGeometry?.dispose();
			bodyGeo.dispose();
			crownMaterial.dispose();
			if (rival) {
				rival.body.dispose();
				rival.crown.dispose();
			}
			warningGeometry.dispose();
			markerGeometry.dispose();
			starMaterial.dispose();
			for (const w of warnings.values()) w.material.dispose();
			mouthGeo.dispose();
			eyeGeo.dispose();
			for (const m of [...tileMaterials, baseMaterial, bodyMaterial, eyeMaterial, edgeMaterial])
				m.dispose();
			for (const m of materialCache.values()) {
				m.map?.dispose();
				m.dispose();
			}
			for (const v of dice.values()) {
				v.materials.forEach((m) => m.dispose());
				(v.outline.material as THREE.LineBasicMaterial).dispose();
			}
			previewMaterials.forEach((material) => material.dispose());
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		}
	};
}
