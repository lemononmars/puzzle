<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import GameIcon from '#lib/boardgame/pakklong/GameIcon.svelte';
	import FlowerCard from '#lib/boardgame/pakklong/FlowerCard.svelte';
	import {
		achievementString,
		achievementRewards,
		toolCost,
		toolAmount
	} from '#lib/boardgame/pakklong/constants.ts';
	const contents = [
		['overview', 'At a glance'],
		['setup', 'Setup'],
		['symbols', 'Symbols & resources'],
		['round', 'The five phases'],
		['shops', 'The six shops'],
		['tools', 'Tools & upgrades'],
		['bouquets', 'Arranging bouquets'],
		['bonuses', 'Flower tracks & bonuses'],
		['achievements', 'Achievements'],
		['endgame', 'End of the game'],
		['examples', 'Worked examples'],
		['reference', 'Quick reference'],
		['notes', 'Digital rules notes']
	];
	const tools = ['Clock', 'Vase', 'Ribbons', 'Flower voucher', 'Tie priority', 'Action cubes'];
	const exampleOrder = { flowers: [1, 1, 0], quality: 7, score: 4 };
</script>

<svelte:head
	><title>Pakklong Talat Rulebook | Chi Fun</title><meta
		name="description"
		content="Complete rules for the Pakklong Talat digital board game: setup, planning, buying, bouquets, bonuses and scoring."
	/></svelte:head
>
<div class="rulebook">
	<PageHeading
		eyebrow="PAKKLONG TALAT · DIGITAL EDITION"
		title="Rulebook"
		description="Build a flower shop, time your market visits, and turn fresh flowers into valuable bouquets."
	/>
	<a class="btn btn-primary mb-6" href="/web-game/pakklongboard">Find a table</a>
	<div class="rulebook-layout">
		<nav aria-label="Rulebook contents">
			<h2>Contents</h2>
			{#each contents as [id, label]}<a href={'#' + id}>{label}</a>{/each}
		</nav>
		<article>
			<section id="overview">
				<h2>At a glance</h2>
				<p>
					You are a florist at Pak Khlong Talat. Visit six market stalls, gather flowers and orders,
					improve your shop, and arrange bouquets to earn points. The winner has the most points
					when the game ends.
				</p>
				<div class="overview-grid">
					<div>
						<strong>Players</strong>
						<p>Up to 6 seats, including bots. A single player can practise alone.</p>
					</div>
					<div>
						<strong>Goal</strong>
						<p>Score through bouquets, upgrades and achievements.</p>
					</div>
					<div>
						<strong>Game length</strong>
						<p>At most 10 turns, each containing five phases.</p>
					</div>
				</div>
				<p class="reference-note">
					This rulebook describes the current digital implementation. Read the digital rules notes
					for prototype-specific behavior.
				</p>
			</section>
			<section id="setup">
				<h2>1. Setup</h2>
				<ol>
					<li>
						Create a room or join an existing room from the lobby. Choose the number of computer
						players before starting. The host keeps their tab open to run the table.
					</li>
					<li>
						The game randomly chooses a tie-break order. This order also determines starting money
						and ribbons.
					</li>
					<li>
						Each player begins with 3 empty vases, 1 starting bouquet order, clock level 0, 0 action
						cubes, 0 points and no arranged flowers.
					</li>
					<li>
						Starting money is 5 plus half your zero-based position in tie-break order, rounded down.
						Players in positions 1–6 therefore receive 5, 5, 6, 6, 7, 7 money. Ribbons alternate 0,
						1, 0, 1, 0, 1 in that same order.
					</li>
					<li>
						Each player receives a different random mapping of the three flower colors to quality,
						money and point bonuses. All bonus tracks start at 0.
					</li>
					<li>
						The game selects one shared achievement per player from the eight possible achievements,
						then generates the first marketplace.
					</li>
				</ol>
				<p>
					Because everyone starts without action cubes, the first turn normally advances directly
					into Planning.
				</p>
			</section>
			<section id="symbols">
				<h2>2. Symbols & resources</h2>
				<div class="rules-table">
					<table>
						<thead><tr><th>Symbol</th><th>Meaning</th><th>Use</th></tr></thead><tbody
							><tr
								><td><GameIcon name="coins" /></td><td>Money</td><td
									>Pay for flowers and tools. There is no automatic income or end-game conversion.</td
								></tr
							><tr
								><td><GameIcon name="ribbon" /></td><td>Ribbon</td><td
									>Spend during arranging; each adds 2 quality to one bouquet.</td
								></tr
							><tr
								><td><GameIcon name="box" /></td><td>Action cube</td><td
									>Spend 3 for an Early bird action or 2 for an Aftermarket action. Passing in
									Market buying gains 1 cube.</td
								></tr
							><tr
								><td><GameIcon name="clock" /></td><td>Clock level</td><td
									>Changes which six time tokens are available to plan your visits.</td
								></tr
							><tr
								><td><GameIcon name="vase" /></td><td>Vase capacity</td><td
									>Holds one fresh flower token per vase. Starts at 3; maximum capacity is 6.</td
								></tr
							><tr
								><td><GameIcon name="star" /></td><td>Quality</td><td
									>A flower contributes its quality; an order shows the minimum total quality
									needed.</td
								></tr
							><tr
								><td><GameIcon name="trophy" /></td><td>Victory points</td><td
									>Your score. Highest score wins.</td
								></tr
							><tr
								><td><GameIcon name="book" /></td><td>Bouquet order</td><td
									>Specifies exact flower colors and quantities, minimum quality and base points.</td
								></tr
							><tr
								><td><GameIcon name="flower" /></td><td>Flower</td><td
									>Pink roses, blue orchids or white mums. Color is shown by the flower/token, never
									a substitute color.</td
								></tr
							></tbody
						>
					</table>
				</div>
				<p>
					In your flower shop, hover over an icon or focus it with the keyboard to read its label.
					On a small screen use Market, Your shop and Players & goals to change views.
				</p>
			</section>
			<section id="round">
				<h2>3. The five phases</h2>
				<p>
					A numbered turn proceeds through these phases in order. Resources, orders, ribbons and
					arranged-flower tracks persist between turns. The market is regenerated for a new turn.
				</p>
				<h3>① Early bird</h3>
				<p>
					In tie-break order, each player with at least 3 action cubes gets one opportunity to
					choose a good from any shop, claim an eligible achievement, or pass. A successful shop
					action costs 3 cubes in addition to the item's money cost. Claiming an achievement does
					not spend cubes. Passing does not spend cubes.
				</p>
				<h3>② Planning — simultaneous</h3>
				<ol>
					<li>
						Your six available tokens come from the values 0, 1, 2, 3, 4, 5, 6 with your clock-level
						value removed. Values 5 and 6 both display as “x”. At level 0 you therefore see 1, 2, 3,
						4, x, x.
					</li>
					<li>
						Select one token, then select a shop, or select a shop first to open its token picker.
						Each shop holds at most one of your tokens; choosing a token already assigned elsewhere
						swaps the two shop assignments.
					</li>
					<li>
						Place at least 4 tokens. Remove a placed token to make it available again, or replace it
						by selecting another token and that shop.
					</li>
					<li>
						Submit Planning. Your plan locks until every player has submitted. Any unfilled shop
						receives the internal value 5.
					</li>
				</ol>
				<p>
					Lower values get earlier access. The two x tokens are low-priority visits, not guaranteed
					skips in this digital version.
				</p>
				<h3>③ Market buying</h3>
				<p>
					Resolve shops in order: Restaurant, Rose, Orchid, Mums, Bookstore, Tool. At each shop,
					players act in ascending time-token order; equal values use the tie-break order. Each
					player may take one legal item from that shop or pass. This phase has no action-cube cost.
					A pass, including an automatic pass at an empty shop, gains 1 action cube.
				</p>
				<p>
					After every player has had an opportunity at a shop, move to the next shop. A Flower
					voucher tool includes its immediate flower follow-up before the next player acts.
				</p>
				<h3>④ Aftermarket</h3>
				<p>
					In tie-break order, each player with at least 2 action cubes gets one opportunity to take
					a remaining good from any shop, claim an eligible achievement, or pass. A successful shop
					action costs 2 cubes in addition to its normal money cost. A claim or pass does not spend
					cubes.
				</p>
				<h3>⑤ Arranging — simultaneous</h3>
				<p>
					Complete any orders you can make with your flowers, bonus quality and ribbons. You may
					complete several bouquets in the same phase. When you are finished, select the check icon
					to Finish arranging. Your actions lock while you wait for the other players. When everyone
					is done, the game checks for its ending conditions; otherwise the next turn begins.
				</p>
			</section>
			<section id="shops">
				<h2>4. The six shops</h2>
				<div class="rules-table">
					<table>
						<thead><tr><th>Shop</th><th>Action</th><th>Limits & exceptions</th></tr></thead><tbody
							><tr
								><td>1 · Restaurant</td><td>Take the money amount printed on a coin offer.</td><td
									>The coin offer is removed during Market buying. In Early bird and Aftermarket it
									stays available after collection.</td
								></tr
							><tr
								><td>2 · Rose</td><td>Pay 1 money and take one pink flower.</td><td
									>You need an empty vase. The token is removed from the stall.</td
								></tr
							><tr
								><td>3 · Orchid</td><td>Pay 1 money and take one blue flower.</td><td
									>You need an empty vase. Quality is printed beside a star.</td
								></tr
							><tr
								><td>4 · Mums</td><td>Pay 1 money and take one white flower.</td><td
									>You need an empty vase. Colors cannot substitute for each other.</td
								></tr
							><tr
								><td>5 · Bookstore</td><td>Draw one visible bouquet order for no money cost.</td><td
									>Hand limit: 4 orders. The chosen order is removed from the market.</td
								></tr
							><tr
								><td>6 · Tool</td><td>Pay the displayed cost and gain the displayed upgrade.</td><td
									>The offer drops one tier after purchase. Tier 0 is exhausted and disappears until
									the next market.</td
								></tr
							></tbody
						>
					</table>
				</div>
				<p>
					Each new market creates up to one coin offer per player, two fresh flower tokens per
					player, one bouquet order per player, and six tool-type tier rolls. Some coin rolls create
					no offer and some tools start exhausted. Empty stalls are normal.
				</p>
			</section>
			<section id="tools">
				<h2>5. Tools & upgrades</h2>
				<p>
					Read the displayed price and effect. The table lists the currently purchasable tiers, with
					cost followed by effect. Tier 2 is not always more expensive than tier 1.
				</p>
				<div class="rules-table">
					<table>
						<thead
							><tr><th>Tool</th><th>Tier 1</th><th>Tier 2</th><th>Additional rule</th></tr></thead
						><tbody
							>{#each tools as name, type}<tr
									><td>{name}</td>{#each [1, 2] as tier}<td
											>{toolCost[type][tier]} money → {type === 4
												? 'first in ties'
												: type === 3
													? '1 flower follow-up'
													: `+${toolAmount[type][tier]}`}</td
										>{/each}<td
										>{type === 0
											? 'Gain the same number of points as clock steps. Clock level caps at 6.'
											: type === 1
												? 'Gain the upgrade amount in points. Capacity caps at 6 vases.'
												: type === 2
													? 'Keep ribbons until they are used.'
													: type === 3
														? 'Choose one remaining flower from any of the three flower stalls without paying its normal 1 money. You still need a free vase.'
														: type === 4
															? 'Move immediately to the front of the tie-break order.'
															: 'Keep cubes for later Early bird or Aftermarket opportunities.'}</td
									></tr
								>{/each}</tbody
						>
					</table>
				</div>
				<p>
					The Flower voucher includes an immediate follow-up choice. Until you choose a flower or
					pass, other shop types are blocked. This is one combined shop action, not a second paid
					visit.
				</p>
			</section>
			<section id="bouquets">
				<h2>6. Arranging bouquets</h2>
				<ol>
					<li>
						In Your shop, select an order. Colored flower icons show the exact number of flowers of
						each color. A missing color icon means zero flowers of that color.
					</li>
					<li>
						Select the exact required flowers from your vases. Extra flowers are not allowed, even
						if their quality would help.
					</li>
					<li>
						Add the quality of the selected flowers and your quality-track bonus. If needed, choose
						ribbons; each ribbon adds 2 quality.
					</li>
					<li>
						Your total must reach or exceed the order's star value. Use only as many ribbons as
						needed: if removing one ribbon would still meet the target, the current implementation
						rejects the excess.
					</li>
					<li>
						Select Arrange Bouquet. The order and used flowers leave your shop, the chosen ribbons
						are spent, and you earn the card's printed points plus your current point bonus and
						money bonus.
					</li>
					<li>
						Increase your arranged-flower tracks by the number of pink, blue and white flowers
						printed on the completed order. These increases improve future bonuses.
					</li>
				</ol>
				<p>
					You can arrange another bouquet immediately if you still have a valid order and flowers.
					When done, select Finish arranging.
				</p>
			</section>
			<section id="bonuses">
				<h2>7. Flower tracks & bonuses</h2>
				<p>
					Your three arranged-flower tracks count flowers used in completed bouquets, not flowers
					currently in vases. At setup each color is assigned to exactly one bonus:
				</p>
				<ul>
					<li>
						<strong>Quality:</strong> add that color's arranged-flower count to the quality of every bouquet
						you attempt.
					</li>
					<li>
						<strong>Money:</strong> receive that color's count in money each time you complete a bouquet.
					</li>
					<li>
						<strong>Points:</strong> receive that color's count as extra points each time you complete
						a bouquet.
					</li>
				</ul>
				<p>
					The icon pairs in your shop show which flower color powers each bonus and its current
					value. Bonuses are evaluated before adding the new bouquet's flowers to the tracks. A
					newly increased track helps the next bouquet, including another bouquet in the same
					arranging phase.
				</p>
			</section>
			<section id="achievements">
				<h2>8. Achievements</h2>
				<p>
					Only the randomly selected achievements are available this game. While you are the active
					player in Early bird or Aftermarket, select an achievement whose requirement you meet.
					Each player may claim each available achievement once; another player's claim does not
					block yours. Claims do not consume the required flower tracks or spend action cubes, but
					they end your current opportunity.
				</p>
				<div class="rules-table">
					<table>
						<thead><tr><th>Requirement</th><th>Reward</th></tr></thead><tbody
							>{#each achievementString as text, index}<tr
									><td
										>{text
											.replace('pink', 'pink flowers')
											.replace('blue', 'blue flowers')
											.replace('white', 'white flowers')}</td
									><td
										>{achievementRewards[index][0]
											? '+1 to each arranged-flower track and 5 money'
											: `${achievementRewards[index][3]} points${achievementRewards[index][4] ? ` and ${achievementRewards[index][4]} money` : ''}`}</td
									></tr
								>{/each}</tbody
						>
					</table>
				</div>
				<p>
					“Finished cards” means completed bouquet orders. Flower requirements use your
					arranged-flower tracks. Achievement rewards that add flowers increase those tracks
					directly; they do not put fresh tokens in your vases.
				</p>
			</section>
			<section id="endgame">
				<h2>9. End of the game</h2>
				<p>At the end of Arranging, the game ends if any of the following is true:</p>
				<ul>
					<li>The current turn is 10.</li>
					<li>A player has at least 7 arranged flowers in one color.</li>
					<li>A player has at least 40 points.</li>
				</ul>
				<p>
					On an end check before turn 10, each player with at least 7 in any one flower track gains
					2 points. The winner is the player with the highest final score. Ties go to the player
					earlier in the current tie-break order.
				</p>
				<p>
					There is no extra scoring for leftover money, unused ribbons, fresh flowers or unfinished
					orders. The digital turn-10 check returns immediately, so it does not apply the additional
					2-point flower-track award.
				</p>
			</section>
			<section id="examples">
				<h2>10. Worked examples</h2>
				<h3>Planning out of shop order</h3>
				<p>
					You want an order before other players choose it. Select token 1 and place it at the
					Bookstore, then put token 2 at Rose, token 3 at Restaurant and token 4 at Mums. You may
					submit with those four placements; the unfilled Orchid and Tool visits get value 5. The
					game still resolves the Restaurant first, but your Bookstore token gives you an earlier
					position at that shop.
				</p>
				<h3>Meeting a quality target</h3>
				<div class="example">
					<div class="example-order"><FlowerCard card={exampleOrder} disabled /></div>
					<p>
						This order needs exactly 1 pink and 1 blue flower, at least 7 quality, and pays 4 base
						points. Pink quality 3 plus blue quality 2 totals 5. With no quality bonus, spend 1
						ribbon to reach 7. A second ribbon is unnecessary and is rejected. A white flower cannot
						replace either required flower.
					</p>
				</div>
				<h3>Using growing bonuses</h3>
				<p>
					Your current quality bonus is 2, money bonus is 1 and point bonus is 3. Completing the
					example order requires only 5 quality from flowers, pays 7 points in total and earns 1
					money. Its pink and blue flower counts are added to your tracks after that payment,
					potentially improving the next bouquet.
				</p>
				<h3>Passing to prepare for later</h3>
				<p>
					Passing in Market buying gives you 1 action cube. Saving 3 cubes makes you eligible for an
					Early bird opportunity next turn; saving 2 is enough for an Aftermarket opportunity. A
					pass in those two phases gives no extra cube.
				</p>
			</section>
			<section id="reference">
				<h2>Quick reference</h2>
				<div class="rules-table">
					<table>
						<thead><tr><th>Phase</th><th>Who acts?</th><th>Cube cost</th><th>Pass</th></tr></thead
						><tbody
							><tr
								><td>Early bird</td><td>Eligible players, tie-break order</td><td
									>3 per successful shop action</td
								><td>No cost, no reward</td></tr
							><tr
								><td>Planning</td><td>Everyone simultaneously</td><td>None</td><td
									>Submit at least 4 tokens</td
								></tr
							><tr
								><td>Market buying</td><td>Token order at each shop, 1 → 6</td><td>None</td><td
									>Gain 1 cube</td
								></tr
							><tr
								><td>Aftermarket</td><td>Eligible players, tie-break order</td><td
									>2 per successful shop action</td
								><td>No cost, no reward</td></tr
							><tr
								><td>Arranging</td><td>Everyone simultaneously</td><td>None</td><td
									>Finish arranging to lock your actions</td
								></tr
							></tbody
						>
					</table>
				</div>
				<p>
					<strong>Limits:</strong> 4 orders in hand · 6 vases maximum · clock level 6 maximum · 1 fresh
					flower per vase · exact flower counts per bouquet.
				</p>
			</section>
			<section id="notes">
				<h2>Digital rules notes</h2>
				<details>
					<summary>What do the two x tokens do?</summary>
					<p>
						They are two separate internal values, 5 and 6, both shown as x. They sort after values
						0–4. In this version they still appear in the buying queue; an x is not automatically
						skipped. Unplanned visits use value 5.
					</p>
				</details>
				<details>
					<summary>What happens to the market between turns?</summary>
					<p>
						The host creates a new market. Unsold offers are replaced rather than carried over.
						Player resources and orders carry over.
					</p>
				</details>
				<details>
					<summary>Can I reload, leave, or close the host tab?</summary>
					<p>
						Game state is hosted in the live tabs. The host must remain connected. Leaving a room
						removes your room membership; durable game restoration is not implemented. The rulebook
						opens in another tab so reading it does not leave your table.
					</p>
				</details>
				<details>
					<summary>How do bots and Autoplay behave?</summary>
					<p>
						The host runs computer players; each human player’s own tab runs Autoplay for their
						seat. They use a simple heuristic for buying, planning and arranging. The robot button
						toggles Autoplay for your seat. Treat it as prototype assistance rather than a
						difficulty-balanced opponent.
					</p>
				</details>
				<details>
					<summary>Which rules are authoritative?</summary>
					<p>
						This page follows the current game controller, pure rules and constants. It
						intentionally documents the Restaurant reuse rule, low-priority x visits, one
						opportunity per eligible player in Early bird/Aftermarket, and the turn-10 scoring
						exception instead of substituting guessed tabletop rules.
					</p>
				</details>
			</section>
			<section class="rulebook-sources">
				<h2>Rulebook references</h2>
				<p>
					The organization of this guide uses a short overview, ordered setup, phase-by-phase play,
					examples and a quick-reference section. Presentation references: <a
						href="https://www.lookout-spiele.de/upload/en_patchworkanniversary.html_PW10_Rules_EN_web.pdf"
						target="_blank"
						rel="noreferrer">Lookout Games — Patchwork anniversary rulebook</a
					>
					and
					<a href="https://wingspan.rulepop.com/" target="_blank" rel="noreferrer"
						>Stonemaier Games — official Wingspan rules reference</a
					>. Pakklong's game rules and examples above are written from this project's code.
				</p>
			</section>
		</article>
	</div>
</div>

<style>
	.rulebook {
		max-width: 1100px;
		margin: 0 auto;
		text-align: left;
	}
	.rulebook-layout {
		display: grid;
		grid-template-columns: 205px minmax(0, 1fr);
		gap: 32px;
		align-items: start;
	}
	.rulebook nav {
		position: sticky;
		top: 90px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 18px;
		border-radius: 18px;
		background: var(--color-base-100);
		color: var(--color-base-content);
		border: 1px solid var(--color-base-300);
	}
	.rulebook nav h2 {
		margin: 0 0 8px;
		font-size: 0.95rem;
	}
	.rulebook nav a {
		font-size: 0.8rem;
		padding-block: 4px;
	}
	.rulebook nav a:hover,
	.rulebook article a {
		text-decoration: underline;
	}
	.rulebook article {
		min-width: 0;
	}
	.rulebook section {
		margin-bottom: 24px;
		padding: 24px;
		border: 1px solid var(--color-base-300);
		border-radius: 20px;
		background: var(--color-base-100);
		color: var(--color-base-content);
		scroll-margin-top: 90px;
	}
	.rulebook section h2 {
		margin: 0 0 14px;
		font-size: 1.3rem;
	}
	.rulebook section h3 {
		margin-top: 20px;
		font-size: 1rem;
	}
	.rulebook p,
	.rulebook li,
	.rulebook td,
	.rulebook th {
		font-size: 0.875rem;
		line-height: 1.8;
	}
	.rulebook p + p {
		margin-top: 12px;
	}
	.rulebook ol,
	.rulebook ul {
		margin-block: 12px;
		padding-left: 20px;
		list-style-position: outside;
	}
	.rulebook li + li {
		margin-top: 8px;
	}
	.rulebook .rules-table {
		overflow-x: auto;
	}
	.rulebook table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
	.rulebook th,
	.rulebook td {
		padding: 10px;
		border-bottom: 1px solid var(--color-base-300);
		vertical-align: top;
	}
	.rulebook th {
		background: var(--color-base-200);
		color: var(--color-base-content);
	}
	.rulebook .overview-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-block: 16px;
	}
	.rulebook .reference-note {
		opacity: 0.75;
	}
	.rulebook .example {
		display: flex;
		flex-wrap: wrap;
		align-items: start;
		gap: 20px;
	}
	.rulebook .example p {
		flex: 1;
		min-width: 160px;
	}
	.rulebook .example-order :global(button) {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		border: 1px solid var(--color-base-300);
		border-radius: 12px;
	}
	.rulebook .example-order :global(.flower-requirements),
	.rulebook .example-order :global(.flower-count),
	.rulebook .example-order :global(.order-values),
	.rulebook .example-order :global(.quality-mark) {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.rulebook details {
		margin-block: 12px;
		border-top: 1px solid var(--color-base-300);
		padding-top: 12px;
	}
	.rulebook summary {
		cursor: pointer;
		font-weight: 600;
		font-size: 0.875rem;
	}
	.rulebook details p {
		margin-top: 10px;
	}
	@media (max-width: 800px) {
		.rulebook-layout {
			grid-template-columns: minmax(0, 1fr);
			gap: 20px;
		}
		.rulebook nav {
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 6px 16px;
		}
		.rulebook nav h2 {
			flex-basis: 100%;
		}
		.rulebook section {
			padding: 18px;
		}
		.rulebook .overview-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
		}
	}
</style>
