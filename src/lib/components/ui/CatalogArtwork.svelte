<script lang="ts">
 let { category }: { category:string } = $props();
</script>
<svg class="category-illustration" viewBox="0 0 200 150" aria-hidden="true">
 <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
 {#if category === 'quizzes'}
  <path class="paper" d="M30 18H151Q165 18 165 32V80Q165 94 151 94H83L62 112V94H30Q16 94 16 80V32Q16 18 30 18Z" />
  <text x="91" y="73" text-anchor="middle" stroke="none" fill="currentColor" font-size="48">?</text>
  <ellipse class="accent" cx="150" cy="125" rx="31" ry="10"/><path d="M131 119V111Q150 89 169 111V119" class="ink"/><path d="M173 100L184 90M150 94V84M125 101L117 93"/>
 {:else if category === 'crafted'}
  <g transform="rotate(-8 90 78)"><rect class="paper" x="33" y="14" width="122" height="124" rx="10"/><path d="M51 34H119M51 46H104"/><rect class="accent" x="48" y="65" width="36" height="36" rx="5"/><text x="66" y="91" text-anchor="middle" stroke="none" fill="currentColor" font-size="24">ก</text><rect x="89" y="65" width="36" height="36" rx="5"/><text x="107" y="91" text-anchor="middle" stroke="none" fill="currentColor" font-size="23">A</text><path d="M51 119H126" stroke-dasharray="4 6"/></g>
  <g transform="rotate(30 160 70)"><path class="accent" d="M153 21H167V111L160 128L153 111Z"/><path d="M153 32H167M153 110H167"/></g>
 {:else if category === 'generated'}
  <path class="paper" d="M27 30H140V103H27Z"/><path d="M38 30V18H128V30M38 103V127H128V103"/><path class="accent" d="M47 104H120V135H47Z"/><text x="83" y="126" text-anchor="middle" stroke="none" fill="currentColor" font-size="20">Aa</text>
  <circle cx="83" cy="66" r="23"/><circle class="accent" cx="83" cy="66" r="8"/>{#each [0,45,90,135,180,225,270,315] as angle}<path d="M83 37V31" transform={`rotate(${angle} 83 66)`}/>{/each}
  <path d="M148 61H178M171 54L178 61L171 68"/><rect class="paper" x="160" y="94" width="30" height="30" rx="8"/><text x="175" y="116" text-anchor="middle" stroke="none" fill="currentColor" font-size="20">?</text>
 {:else if category === 'logic'}
  <rect class="paper" x="20" y="18" width="112" height="112" rx="7"/><path d="M48 18V130M76 18V130M104 18V130M20 46H132M20 74H132M20 102H132"/>
  <path class="ink" d="M49 47H75V73H49ZM77 75H103V101H77ZM105 103H131V129H105Z" stroke="none"/>
  <path d="M153 35V73H176V113"/><circle class="accent" cx="153" cy="35" r="11"/><circle class="paper" cx="176" cy="73" r="11"/><circle class="ink" cx="176" cy="113" r="11"/>
 {:else if category === 'explore'}
  <path d="M19 120Q65 116 73 75T156 27" stroke-dasharray="4 7"/><circle cx="72" cy="80" r="49" class="paper"/><circle cx="72" cy="80" r="36"/><path class="accent" d="M89 49L80 86L55 111L64 74Z"/><path d="M64 74L80 86M72 35V42M72 118V125M27 80H34M110 80H117"/><path d="M157 16V81M158 17H190L180 32L190 47H158" class="accent"/>
 {:else if category === 'builders'}
  <path class="paper" d="M26 20H118V119H26Z"/><path d="M39 34H73M39 49H99M39 64H88"/>
  <g transform="rotate(35 142 80)"><rect class="accent" x="130" y="18" width="26" height="113" rx="3"/><path d="M131 32H141M131 47H147M131 62H141M131 77H147M131 92H141M131 107H147"/></g><path class="ink" d="M82 111L157 36L169 48L94 123L75 130Z"/><path d="M81 112L94 124" stroke="var(--color-base-100)"/>
 {:else if category === 'solvers'}
  <path class="paper" d="M50 24H104V51H77V105H50V78H23V51H50Z"/><path d="M77 24V51M50 51H77M50 51V78M50 78H77"/>
  <rect class="accent" x="127" y="90" width="14" height="48" rx="7" transform="rotate(-45 134 60)"/><circle cx="134" cy="60" r="30" class="paper"/><path d="M120 60L130 70L149 49"/>
 {:else if category === 'hosting'}
  <rect class="paper" x="19" y="24" width="163" height="106" rx="8"/><path class="accent" d="M20 25H61L49 88L20 108ZM181 25H140L152 88L181 108Z"/><path d="M19 116H181"/><rect x="83" y="48" width="31" height="45" rx="15"/><path d="M75 76V82Q98 111 123 82V76M99 101V115"/><path d="M65 31H136" stroke-dasharray="2 11"/>
 {:else if category === 'play-aids'}
  <g transform="rotate(-8 74 61)"><rect class="paper" x="20" y="26" width="47" height="52" rx="8"/><rect class="accent" x="73" y="26" width="47" height="52" rx="8"/><text x="43.5" y="62" text-anchor="middle" stroke="none" fill="currentColor" font-size="28">ก</text><text x="96.5" y="62" text-anchor="middle" stroke="none" fill="currentColor" font-size="28">า</text></g>
  <path d="M33 99H102M94 91L102 99L94 107" stroke-dasharray="4 5"/><ellipse class="paper" cx="150" cy="123" rx="35" ry="11"/><path class="accent" d="M122 119V111Q150 78 178 111V119Z"/><path d="M150 82V70M121 89L113 80M178 89L186 80"/>
 {:else if category === 'checking'}
  <rect class="paper" x="38" y="22" width="122" height="115" rx="9"/><rect class="accent" x="71" y="12" width="55" height="21" rx="6"/><path d="M53 56L61 64L74 48M87 56H142M53 84L61 92L74 76M87 84H131M53 111L61 119L74 103M87 111H116"/><circle class="accent" cx="157" cy="113" r="24"/><path d="M144 113L153 122L171 104"/>
 {:else if category === 'ciphers'}
  <circle class="paper" cx="78" cy="77" r="51"/><circle cx="78" cy="77" r="36"/><circle class="accent" cx="78" cy="77" r="18"/><path d="M78 26V38M78 116V128M27 77H39M116 77H129M42 41L50 49M107 106L115 114"/><text x="78" y="85" text-anchor="middle" stroke="none" fill="currentColor" font-size="23">X</text><path class="accent" d="M136 66H188V123H136Z"/><path d="M146 66V51Q162 26 178 51V66"/><circle class="ink" cx="162" cy="89" r="5"/><path d="M162 94V105"/>
 {:else if category === 'spellingdictionary'}
  <path class="paper" d="M100 33Q66 12 20 29V126Q62 109 100 128Q138 109 180 126V29Q135 12 100 33Z"/><path d="M100 34V128M33 92H81M33 105H71M119 92H166M119 105H155"/><text x="58" y="77" text-anchor="middle" stroke="none" fill="currentColor" font-size="39">ก</text><path d="M126 60L137 72L163 46"/><path class="accent" d="M88 31H111V78L100 68L88 78Z"/>
 {:else if category === 'knowledge'}
  <circle class="paper" cx="101" cy="76" r="38"/><ellipse cx="101" cy="76" rx="17" ry="38"/><path d="M64 66H138M66 91H136"/><ellipse cx="101" cy="76" rx="82" ry="24" transform="rotate(-25 101 76)"/><circle class="accent" cx="31" cy="109" r="11"/><circle class="accent" cx="170" cy="40" r="8"/><path d="M32 22V38M24 30H40M161 108V124M153 116H169"/>
 {:else if category === 'mechanics'}
  <circle class="paper" cx="70" cy="70" r="34"/><circle class="accent" cx="70" cy="70" r="12"/><path d="M70 36V20M70 104V120M36 70H20M104 70H120M46 46L34 34M94 94L106 106M94 46L106 34M46 94L34 106"/><circle class="paper" cx="145" cy="110" r="23"/><circle class="accent" cx="145" cy="110" r="8"/><path d="M145 87V77M145 133V143M122 110H112M168 110H178M128 93L121 86M162 127L169 134M162 93L169 86M128 127L121 134M120 27H166V60M158 53L166 61L174 53"/><rect class="accent" x="127" y="18" width="16" height="16" rx="3"/>
 {:else if category === 'logictutorial'}
  <rect class="paper" x="20" y="18" width="161" height="100" rx="10"/><path d="M20 101H181M77 134H127M101 119V134"/><path class="accent" d="M88 39L121 59L88 79Z"/><rect class="paper" x="137" y="78" width="47" height="47" rx="4"/><path d="M153 79V125M169 79V125M137 94H184M137 109H184"/><path class="ink" d="M154 95H168V108H154Z" stroke="none"/>
 {/if}
 </g>
</svg>
<style>
 .category-illustration { width:200px; height:150px; max-width:80%; color:var(--color-primary); transition:transform .25s; }
 .paper { fill:var(--color-base-100); } .accent { fill:var(--color-accent); } .ink { fill:var(--color-primary); }
</style>
