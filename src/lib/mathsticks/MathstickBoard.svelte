<script lang="ts">
	import { DIGIT_MASKS, OPERATOR_MASKS } from './solver';

	export let equationTokens: string[] = ['6', '+', '4', '=', '4'];
	export let initialTokens: string[] = ['6', '+', '4', '=', '4'];
	export let movesCount = 0;
	export let onMove: () => void = () => {};
	export let isSolved = false;
	export let showHelperText = true;
	export let showParsedLabels = true;
	export let showBorder = true;

	let selectedIndex: number | null = null;
	let selectedSegment: number | null = null;

	// Segment coordinates for 7-segment digit (60x100 box)
	const DIGIT_SEGMENTS = [
		{ id: 0, x1: 12, y1: 10, x2: 48, y2: 10, vert: false },  // a: top
		{ id: 1, x1: 50, y1: 12, x2: 50, y2: 48, vert: true },   // b: top-right
		{ id: 2, x1: 50, y1: 52, x2: 50, y2: 88, vert: true },   // c: bot-right
		{ id: 3, x1: 12, y1: 90, x2: 48, y2: 90, vert: false },  // d: bot
		{ id: 4, x1: 10, y1: 52, x2: 10, y2: 88, vert: true },   // e: bot-left
		{ id: 5, x1: 10, y1: 12, x2: 10, y2: 48, vert: true },   // f: top-left
		{ id: 6, x1: 12, y1: 50, x2: 48, y2: 50, vert: false }   // g: mid
	];

	// Segment coordinates for Operators (+, -, =) (60x100 box)
	const OPERATOR_SEGMENTS = [
		{ id: 0, x1: 12, y1: 50, x2: 48, y2: 50, vert: false },  // 0: mid horizontal (-)
		{ id: 1, x1: 30, y1: 32, x2: 30, y2: 68, vert: true },   // 1: mid vertical (+)
		{ id: 2, x1: 12, y1: 40, x2: 48, y2: 40, vert: false },  // 2: top eq horizontal (=)
		{ id: 3, x1: 12, y1: 60, x2: 48, y2: 60, vert: false }   // 3: bot eq horizontal (=)
	];

	let currentMasks: number[] = [];
	let initialMasks: number[] = [];

	$: if (initialTokens) {
		initialMasks = initialTokens.map((t) => getMask(t));
		if (movesCount === 0 || currentMasks.length !== initialTokens.length) {
			currentMasks = [...initialMasks];
		}
	}

	function getMask(t: string): number {
		if (DIGIT_MASKS[t] !== undefined) return DIGIT_MASKS[t];
		if (OPERATOR_MASKS[t] !== undefined) return OPERATOR_MASKS[t];
		return 0;
	}

	function getDigitCharFromMask(mask: number): string {
		for (const [char, m] of Object.entries(DIGIT_MASKS)) {
			if (m === mask) return char;
		}
		return '?';
	}

	function getOperatorCharFromMask(mask: number): string {
		if (mask === OPERATOR_MASKS['+']) return '+';
		if (mask === OPERATOR_MASKS['=']) return '=';
		if (mask === OPERATOR_MASKS['-'] || mask === (1 << 2) || mask === (1 << 3)) return '-';
		return '?';
	}

	// Drag and drop state
	let dragSource: { tokenIdx: number; segId: number; isVertical: boolean } | null = null;
	let dragPos: { x: number; y: number } | null = null;
	let snapTarget: { tokenIdx: number; segId: number; x: number; y: number; isVertical: boolean } | null = null;

	function handlePointerDown(e: PointerEvent | TouchEvent, tokenIdx: number, segId: number, isPresent: boolean, isVertical: boolean) {
		if (!isPresent) {
			handleSegmentClick(tokenIdx, segId);
			return;
		}

		const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as PointerEvent).clientX;
		const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as PointerEvent).clientY;

		dragSource = { tokenIdx, segId, isVertical };
		dragPos = { x: clientX, y: clientY };
		selectedIndex = tokenIdx;
		selectedSegment = segId;

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('touchend', handlePointerUp);
	}

	function handlePointerMove(e: PointerEvent) {
		updateSnapTarget(e.clientX, e.clientY);
	}

	function handleTouchMove(e: TouchEvent) {
		if (dragSource && e.touches.length > 0) {
			e.preventDefault();
			updateSnapTarget(e.touches[0].clientX, e.touches[0].clientY);
		}
	}

	function updateSnapTarget(clientX: number, clientY: number) {
		dragPos = { x: clientX, y: clientY };

		const slots = document.querySelectorAll<HTMLElement>('[data-empty-slot="true"]');
		let closestDist = 55; // Snap distance
		let closestSlot: typeof snapTarget = null;

		slots.forEach((el) => {
			const rect = el.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dist = Math.hypot(clientX - cx, clientY - cy);
			if (dist < closestDist) {
				closestDist = dist;
				closestSlot = {
					tokenIdx: Number(el.dataset.tokenIdx),
					segId: Number(el.dataset.segId),
					x: cx,
					y: cy,
					isVertical: el.dataset.vert === '1'
				};
			}
		});

		snapTarget = closestSlot;
	}

	function handlePointerUp() {
		if (dragSource && snapTarget) {
			const fromIdx = dragSource.tokenIdx;
			const fromSeg = dragSource.segId;
			const toIdx = snapTarget.tokenIdx;
			const toSeg = snapTarget.segId;

			const sourceIsDigit = /[0-9]/.test(initialTokens[fromIdx]);
			const targetIsDigit = /[0-9]/.test(initialTokens[toIdx]);

			currentMasks[fromIdx] &= ~(1 << fromSeg);
			currentMasks[toIdx] |= (1 << toSeg);

			equationTokens[fromIdx] = sourceIsDigit
				? getDigitCharFromMask(currentMasks[fromIdx])
				: getOperatorCharFromMask(currentMasks[fromIdx]);

			equationTokens[toIdx] = targetIsDigit
				? getDigitCharFromMask(currentMasks[toIdx])
				: getOperatorCharFromMask(currentMasks[toIdx]);

			movesCount += 1;
			onMove();
		}

		dragSource = null;
		dragPos = null;
		snapTarget = null;
		selectedIndex = null;
		selectedSegment = null;

		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handlePointerUp);
	}

	function handleSegmentClick(tokenIdx: number, segId: number) {
		const currentMask = currentMasks[tokenIdx];
		const isPresent = (currentMask & (1 << segId)) !== 0;

		if (selectedIndex === null) {
			if (isPresent) {
				selectedIndex = tokenIdx;
				selectedSegment = segId;
			}
		} else {
			if (selectedIndex === tokenIdx && selectedSegment === segId) {
				selectedIndex = null;
				selectedSegment = null;
				return;
			}

			if (!isPresent) {
				const sourceIsDigit = /[0-9]/.test(initialTokens[selectedIndex]);
				const targetIsDigit = /[0-9]/.test(initialTokens[tokenIdx]);

				currentMasks[selectedIndex] &= ~(1 << selectedSegment!);
				currentMasks[tokenIdx] |= (1 << segId);

				equationTokens[selectedIndex] = sourceIsDigit
					? getDigitCharFromMask(currentMasks[selectedIndex])
					: getOperatorCharFromMask(currentMasks[selectedIndex]);

				equationTokens[tokenIdx] = targetIsDigit
					? getDigitCharFromMask(currentMasks[tokenIdx])
					: getOperatorCharFromMask(currentMasks[tokenIdx]);

				movesCount += 1;
				selectedIndex = null;
				selectedSegment = null;
				onMove();
			} else {
				selectedIndex = tokenIdx;
				selectedSegment = segId;
			}
		}
	}
</script>

<!-- Board Container -->
<div
	class={`flex flex-nowrap items-center justify-center select-none ${
		showBorder
			? `gap-1 sm:gap-3 md:gap-5 py-3 px-2 sm:py-6 sm:px-6 bg-base-100 text-base-content border rounded-2xl sm:rounded-3xl transition-all duration-500 w-full overflow-x-auto ${
					isSolved ? 'border-primary/30 shadow-[0_0_35px_rgba(34,197,94,0.4)]' : 'border-base-300 shadow-2xl'
			  }`
			: 'gap-1 bg-transparent p-0 border-none shadow-none overflow-hidden'
	}`}
>
	{#each equationTokens as token, idx}
		{@const isDigit = /[0-9]/.test(initialTokens[idx]) || !['-', '+', '=', '*', '/'].includes(initialTokens[idx])}
		{@const isOperator = ['-', '+', '='].includes(initialTokens[idx])}

		<div class="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0">
			{#if isDigit}
				<!-- 7-Segment Digit Box -->
				<div class="relative w-9 h-[60px] xs:w-11 xs:h-[72px] sm:w-16 sm:h-28 flex items-center justify-center">
					<svg viewBox="0 0 60 100" class="w-full h-full touch-none">
						{#each DIGIT_SEGMENTS as seg}
							{@const isPresent = (currentMasks[idx] & (1 << seg.id)) !== 0}
							{@const isInitial = (initialMasks[idx] & (1 << seg.id)) !== 0}
							{@const isMoved = isPresent && !isInitial}
							{@const isRemoved = !isPresent && isInitial}
							{@const isSelected = selectedIndex === idx && selectedSegment === seg.id}
							{@const isDraggingThis = dragSource?.tokenIdx === idx && dragSource?.segId === seg.id}
							{@const isTargeted = snapTarget?.tokenIdx === idx && snapTarget?.segId === seg.id}

							<g
								class="cursor-pointer"
								data-empty-slot={!isPresent}
								data-token-idx={idx}
								data-seg-id={seg.id}
								data-vert={seg.vert ? '1' : '0'}
								on:pointerdown={(e) => handlePointerDown(e, idx, seg.id, isPresent, seg.vert)}
							>
								{#if isPresent && isDraggingThis}
									<!-- Ghost Matchstick (Ghost Image / Drag Placeholder) -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#f59e0b"
										stroke-width="4.5"
										stroke-linecap="round"
										stroke-dasharray="3 3"
										opacity="0.45"
									/>
									<circle cx={seg.x1} cy={seg.y1} r="3" fill="#ef4444" opacity="0.45" />
								{:else if isPresent}
									<!-- Matchstick Body -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke={isSelected ? '#38bdf8' : isMoved ? '#c084fc' : '#f59e0b'}
										stroke-width={isSelected || isMoved ? '6.5' : '5'}
										stroke-linecap="round"
										class={isSelected ? 'animate-pulse' : isMoved ? 'drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'hover:stroke-amber-300'}
									/>
									<!-- Matchstick Red Tip Head -->
									<circle
										cx={seg.x1}
										cy={seg.y1}
										r={isSelected || isMoved ? '4' : '3.2'}
										fill={isSelected ? '#0284c7' : isMoved ? '#a855f7' : '#ef4444'}
									/>
								{:else if isTargeted}
									<!-- Snap Highlight -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#22c55e"
										stroke-width="7"
										stroke-linecap="round"
										class="animate-pulse drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]"
									/>
								{:else if isRemoved}
									<!-- Highlighted Removed Stick (Ghost Red Outline) -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#f43f5e"
										stroke-width="4"
										stroke-linecap="round"
										stroke-dasharray="3 3"
										opacity="0.65"
										class="hover:opacity-100"
									/>
									<circle cx={seg.x1} cy={seg.y1} r="3" fill="#f43f5e" opacity="0.65" />
								{:else}
									<!-- Empty Slot Dotted Line -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke={selectedIndex !== null ? '#22c55e' : '#475569'}
										stroke-width="3.5"
										stroke-linecap="round"
										stroke-dasharray="2 3"
										opacity={selectedIndex !== null ? '0.85' : '0.2'}
										class="hover:opacity-100 hover:stroke-emerald-400"
									/>
								{/if}
							</g>
						{/each}
					</svg>
				</div>
			{:else if isOperator}
				<!-- Matchstick Operator Box (+, -, =) -->
				<div class="relative w-9 h-[60px] xs:w-11 xs:h-[72px] sm:w-16 sm:h-28 flex items-center justify-center">
					<svg viewBox="0 0 60 100" class="w-full h-full touch-none">
						{#each OPERATOR_SEGMENTS as seg}
							{@const isPresent = (currentMasks[idx] & (1 << seg.id)) !== 0}
							{@const isInitial = (initialMasks[idx] & (1 << seg.id)) !== 0}
							{@const isMoved = isPresent && !isInitial}
							{@const isRemoved = !isPresent && isInitial}
							{@const isSelected = selectedIndex === idx && selectedSegment === seg.id}
							{@const isDraggingThis = dragSource?.tokenIdx === idx && dragSource?.segId === seg.id}
							{@const isTargeted = snapTarget?.tokenIdx === idx && snapTarget?.segId === seg.id}

							<g
								class="cursor-pointer"
								data-empty-slot={!isPresent}
								data-token-idx={idx}
								data-seg-id={seg.id}
								data-vert={seg.vert ? '1' : '0'}
								on:pointerdown={(e) => handlePointerDown(e, idx, seg.id, isPresent, seg.vert)}
							>
								{#if isPresent && isDraggingThis}
									<!-- Ghost Matchstick (Ghost Image / Drag Placeholder) -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#f59e0b"
										stroke-width="4.5"
										stroke-linecap="round"
										stroke-dasharray="3 3"
										opacity="0.45"
									/>
									<circle cx={seg.x1} cy={seg.y1} r="3" fill="#ef4444" opacity="0.45" />
								{:else if isPresent}
									<!-- Matchstick Body -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke={isSelected ? '#38bdf8' : isMoved ? '#c084fc' : '#f59e0b'}
										stroke-width={isSelected || isMoved ? '6.5' : '5'}
										stroke-linecap="round"
										class={isSelected ? 'animate-pulse' : isMoved ? 'drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'hover:stroke-amber-300'}
									/>
									<!-- Matchstick Red Tip Head -->
									<circle
										cx={seg.x1}
										cy={seg.y1}
										r={isSelected || isMoved ? '4' : '3.2'}
										fill={isSelected ? '#0284c7' : isMoved ? '#a855f7' : '#ef4444'}
									/>
								{:else if isTargeted}
									<!-- Snap Highlight -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#22c55e"
										stroke-width="7"
										stroke-linecap="round"
										class="animate-pulse drop-shadow-[0_0_10px_rgba(34,197,94,0.9)]"
									/>
								{:else if isRemoved}
									<!-- Highlighted Removed Stick (Ghost Red Outline) -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke="#f43f5e"
										stroke-width="4"
										stroke-linecap="round"
										stroke-dasharray="3 3"
										opacity="0.65"
										class="hover:opacity-100"
									/>
									<circle cx={seg.x1} cy={seg.y1} r="3" fill="#f43f5e" opacity="0.65" />
								{:else}
									<!-- Empty Slot Dotted Line -->
									<line
										x1={seg.x1}
										y1={seg.y1}
										x2={seg.x2}
										y2={seg.y2}
										stroke={selectedIndex !== null ? '#22c55e' : '#475569'}
										stroke-width="3.5"
										stroke-linecap="round"
										stroke-dasharray="2 3"
										opacity={selectedIndex !== null ? '0.85' : '0.2'}
										class="hover:opacity-100 hover:stroke-emerald-400"
									/>
								{/if}
							</g>
						{/each}
					</svg>
				</div>
			{:else}
				<!-- Fixed Symbol (*, /) -->
				<div class="text-2xl sm:text-4xl font-extrabold text-base-content/70 px-1 sm:px-2 h-[60px] sm:h-28 flex items-center">
					{token}
				</div>
			{/if}

			{#if showParsedLabels}
				<!-- Parsed Text Symbol Label under each matchstick group -->
				<span class={`text-xs sm:text-base font-extrabold font-mono px-2 py-0.5 rounded transition-all ${
					token === '?' ? 'text-error-content bg-error border border-red-500/60 shadow-md shadow-red-900/40 animate-pulse font-black px-2.5' : 'text-warning-content bg-warning border border-base-300'
				}`}>
					{token}
				</span>
			{/if}
		</div>
	{/each}
</div>

{#if showHelperText && !isSolved}
	<div class="text-center text-xs sm:text-sm font-bold animate-pulse mt-2 sm:mt-3 text-amber-400">
		🔥 ลาก หรือ คลิกเลือกไม้ขีดไฟเพื่อย้ายตำแหน่ง
	</div>
{/if}

<!-- Floating Dragged Matchstick with Snapping Rotation -->
{#if dragSource && dragPos}
	{@const activeAngle = snapTarget ? (snapTarget.isVertical ? 90 : 0) : (dragSource.isVertical ? 90 : 0)}
	{@const posX = snapTarget ? snapTarget.x : dragPos.x}
	{@const posY = snapTarget ? snapTarget.y : dragPos.y}

	<div
		class="fixed pointer-events-none z-50 transition-transform duration-100 ease-out"
		style="left: {posX}px; top: {posY}px; transform: translate(-50%, -50%) rotate({activeAngle}deg);"
	>
		<svg width="60" height="24" viewBox="0 0 60 24" class="drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]">
			<!-- Matchstick Body -->
			<line x1="8" y1="12" x2="52" y2="12" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
			<!-- Matchstick Red Tip Head -->
			<circle cx="8" cy="12" r="4.5" fill="#0284c7" />
		</svg>
	</div>
{/if}
