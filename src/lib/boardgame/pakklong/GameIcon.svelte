<script lang="ts">
	import Flower from '@lucide/svelte/icons/flower-2';
	import Star from '@lucide/svelte/icons/star';
	import Trophy from '@lucide/svelte/icons/trophy';
	import Coins from '@lucide/svelte/icons/coins';
	import Ribbon from '@lucide/svelte/icons/ribbon';
	import Box from '@lucide/svelte/icons/box';
	import Clock from '@lucide/svelte/icons/clock';
	import Vase from '@lucide/svelte/icons/amphora';
	import Book from '@lucide/svelte/icons/book-open';
	import Send from '@lucide/svelte/icons/send';
	import Check from '@lucide/svelte/icons/check';
	import Arrow from '@lucide/svelte/icons/arrow-right';
	import Bot from '@lucide/svelte/icons/bot';
	import Settings from '@lucide/svelte/icons/settings';
	import Leave from '@lucide/svelte/icons/log-out';
	import Help from '@lucide/svelte/icons/circle-help';
	import type { GameIconName } from './types';
	export let name: GameIconName;
	export let size = 20;
	const icons: Record<GameIconName, typeof Flower> = {
		flower: Flower,
		star: Star,
		trophy: Trophy,
		coins: Coins,
		ribbon: Ribbon,
		box: Box,
		clock: Clock,
		vase: Vase,
		book: Book,
		send: Send,
		check: Check,
		arrow: Arrow,
		bot: Bot,
		settings: Settings,
		leave: Leave,
		help: Help
	};
	$: Icon = icons[name];
</script>

<svelte:component this={Icon} {size} strokeWidth={1.8} aria-hidden="true" />
