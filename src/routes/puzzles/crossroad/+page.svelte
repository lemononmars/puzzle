<script lang="ts">
   import crossroad from '#lib/utils/crossroad_word.json'
   import {wordLength} from '#lib/utils/thaiwords.js'
   import {PlayCircleIcon, ArrowDownIcon, ArrowRightIcon, RefreshCcwIcon, HelpCircleIcon, CheckSquareIcon, PlusCircleIcon, SkipForwardIcon, Maximize2Icon, Minimize2Icon} from 'svelte-feather-icons'
   import {onMount} from 'svelte'

   import {fly, fade} from 'svelte/transition'

   let isFullscreen = false;
   function toggleFullscreen() {
      const elem = document.getElementById('crossroad-game-container');
      if (!elem) return;
      if (!document.fullscreenElement) {
         elem.requestFullscreen().catch((err) => console.error(err));
      } else {
         document.exitFullscreen().catch(() => {});
      }
   }

   onMount(() => {
      const handleFsChange = () => {
         isFullscreen = !!document.fullscreenElement;
      };
      document.addEventListener('fullscreenchange', handleFsChange);
      return () => {
         document.removeEventListener('fullscreenchange', handleFsChange);
      };
   });

   let answer: string = ''
   let score: number = 0

   let isCoolingDown: boolean = false
   const wordListLength: number = Object.keys(crossroad).length

   let currentAnswer: string = ''
   let currentAnswerIndex: number = 0
   let currentPre: string[] = []
   let currentPost: string[] = []
   let currentPreClues: string[] = ['', '']
   let currentPostClues: string[] = ['', '']
   let answerHistory: string[][] = []
   let correctHistory: boolean[] = []

   let numCorrect: number = 0
   let numSkip: number = 0
   let numHint: number = 0

   onMount(async()=>{

   })

   let currentPuzzleToken = '';

   async function getNewAnswer() {
      try {
         const res = await fetch(`/api/crossroad/puzzle?length=${answerLength}`);
         const data = await res.json();
         if (data.token && data.clues) {
            currentPuzzleToken = data.token;
            currentPostClues = [data.clues.top, data.clues.left];
            currentPreClues = [data.clues.right, data.clues.bottom];
            answer = '';
            return;
         }
      } catch {
         // Offline fallback
      }

      // search until we get a word with the desired length
      do {
         currentAnswerIndex = Math.floor(Math.random()*wordListLength)
         currentAnswer = Object.keys(crossroad)[currentAnswerIndex]
      } while(answerLength > 0 && wordLength(currentAnswer) != answerLength)

      const {pre, post} = Object.values(crossroad)[currentAnswerIndex]
      currentPre = pre
      currentPost = post
      getNewClues()
      answer = ''
      answerHistory.push(
        [...currentPostClues, currentAnswer, ...currentPreClues]
      )
   }

   function getHints () {
      score --
      numHint ++
      getNewClues()
   }

   function getNewClues () {
      currentPreClues = getRandomClues(currentPre)
      currentPostClues = getRandomClues(currentPost)
   }

   function getRandomClues(list: string[]) {
      const l = list.length
      const clue1 = Math.floor(Math.random()*l)
      const clue2 = Math.floor(Math.random()*(l-1))
      return [
         list[clue1],
         list[(clue1 + clue2 + 1) % l]
      ]
   }

   function handleKeyPress(event: KeyboardEvent) {
      if(isPlaying) return

      if(event.code == "Enter")
         if(isFinished)
            isFinished = false
         else if(!openModal)
            play()
      if(event.code == "Space")
         openModal = !openModal
   }

   async function handleAnswer (event: KeyboardEvent) {
      if(isCoolingDown) return

      let isCorrect = answer === currentAnswer;

      if (currentPuzzleToken) {
         try {
            const res = await fetch('/api/crossroad/verify', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ token: currentPuzzleToken, answer })
            });
            const data = await res.json();
            if (data.isCorrect) isCorrect = true;
         } catch {
            // fallback
         }
      }

      if(isCorrect) {
         isWiggle = true
         isCoolingDown = true
         correctHistory.push(true)
         numCorrect++
         score += 10
         time += 1000 // compensation for animation
         setTimeout(()=>{
            isWiggle = false
            isCoolingDown = false
            getNewAnswer()
         }, 1000)
         return
      }

      switch(event.code) {
         case "ArrowUp":
         case "ArrowDown":
            getHints()
            break
         case "ArrowRight":
            giveUp()
            break
      }
   }

   function giveUp() {
      if(isCoolingDown) return

      isCoolingDown = true
      correctHistory.push(false)
      answer = currentAnswer
      numSkip ++
      setTimeout(()=>{
         isCoolingDown = false
         getNewAnswer()
      }, 1000)
   }

   // game settings
   let isTimed: boolean = true
   let answerLength: number = 0 // 0 for any, 2,3,4

   let time: number = 0
   let maxTime: number = 60000 // 1 minute

   $: timeString = (Math.floor(time/1000)) + ' วินาที'
   let timer: string|number|NodeJS.Timeout|undefined
   let isWiggle: boolean = false
   let isPlaying: boolean = false
   let isFinished: boolean = false
   let openModal: boolean = false

   function play() {
      isPlaying = true
      clearInterval(timer)
      score = 0
      numCorrect = 0
      numSkip = 0
      numHint = 0
      answerHistory = []
      correctHistory = []
      getNewAnswer()
      if(isTimed) {
         time = maxTime
         timer = setInterval(()=>{
            time -= 100
            if(time <= 0) {
               isPlaying = false
               isFinished = true
               clearInterval(timer)
               time = 0
            }
         }, 100)
      }
      else {
         time = 0
         timer = setInterval(()=>time += 100, 100)
      }
   }

   function focusOnMount(node: any) {
		node.focus();
	}
</script>

<svelte:head>
	<title>Code Breaker | Crossroad 🔀</title>
	<meta name="description" content="เติมคำเพื่อสร้างคำทั้งสี่ทิศทาง" />
</svelte:head>

<svelte:body on:keypress={handleKeyPress}/>

<div id="crossroad-game-container" class="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 select-none">
	<div class="bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col gap-3 relative overflow-hidden">
		<div class="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

		<!-- Compact Header -->
		<div class="flex items-center justify-between gap-2 border-b border-base-300/80 pb-2">
			<div class="flex items-center gap-2 overflow-hidden">
				<span class="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0"></span>
				<h1 class="text-base sm:text-xl font-extrabold text-base-content tracking-tight truncate">
					Crossroad <span class="text-xs text-base-content/70 font-medium hidden sm:inline">(ทางแยกคำ)</span>
				</h1>
			</div>

			<div class="flex items-center gap-1 shrink-0">
				<button
					on:click={toggleFullscreen}
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-primary hover:bg-primary/20"
					title={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
				>
					{#if isFullscreen}
						<Minimize2Icon size="16" />
						<span class="hidden sm:inline">ออกจากเต็มจอ</span>
					{:else}
						<Maximize2Icon size="16" />
						<span class="hidden sm:inline">เต็มจอ</span>
					{/if}
				</button>
				<button
					on:click={() => (openModal = true)}
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-base-content hover:bg-base-200"
				>
					<HelpCircleIcon size="16" />
					<span class="hidden sm:inline">วิธีเล่น</span>
				</button>
			</div>
		</div>

		<div class="flex flex-col z-10 py-2">
			{#if isPlaying}
				<div class="relative t-0 w-80 h-80 lg:w-96 lg:h-96 mx-auto">
					{#if isTimed}
						<div class="radial-progress absolute top-0 left-0 w-20 m-4 text-sm text-primary font-bold border border-primary/20 rounded-full"
							style="--value:{100*time/maxTime};"
						>{timeString}</div>
					{:else}
						<button class="btn btn-outline btn-error text-error-content flex flex-col absolute top-0 left-0 w-20 h-20 m-4 text-sm gap-1"
							on:click={()=>{isFinished = true; isPlaying = false}}
						>
							<div>{timeString}</div>
							<div class="text-xs text-error-content font-bold">หยุด</div>
						</button>
					{/if}

					<!-- top clue -->
					{#key currentAnswer}
						<div class="btn btn-xl absolute top-0 inset-x-0 m-auto w-20 h-20 lg:w-24 lg:h-24 text-xl lg:text-3xl bg-base-200 border-base-300 text-primary font-black shadow-lg"
							in:fly={{y:10, delay:100}}
						>{currentPostClues[0]}</div>
					{/key}

					<!-- top right score -->
					<div class="btn btn-xl btn-outline btn-primary text-primary-content absolute top-0 right-0 m-4 w-20 h-20 text-3xl font-black"
					>{score}</div>

					<!-- center left clue -->
					{#key currentAnswer}
					<div class="btn btn-xl absolute left-0 inset-y-0 m-auto w-20 h-20 lg:w-24 lg:h-24 text-xl lg:text-3xl bg-base-200 border-base-300 text-primary font-black shadow-lg"
						in:fly={{x:10, delay:200}}
					>{currentPostClues[1]}</div>
					{/key}

					<!-- center middle input -->
					<input
						class="input  absolute border-2 border-base-300 bg-base-300 text-base-content font-black text-center text-xl lg:text-3xl w-24 h-24 lg:w-32 lg:h-32 transition-colors inset-x-0 inset-y-0 m-auto rounded-2xl focus:border-primary focus:outline-none"
						class:input-success={answer === currentAnswer}
						class:text-success-content={answer === currentAnswer}
						class:wiggle={isWiggle}
						type="text"
						use:focusOnMount
						bind:value={answer}
						on:keyup={handleAnswer}>

					<!-- center right clue -->
					{#key currentAnswer}
						<div class="btn btn-xl absolute text-xl lg:text-3xl right-0 inset-y-0 m-auto w-20 h-20 lg:w-24 lg:h-24 bg-base-200 border-base-300 text-primary font-black shadow-lg"
							in:fly={{x:-10, delay:300}}
						>{currentPreClues[0]}</div>
					{/key}

					<!-- bottom left change clue -->
					<button class="btn btn-secondary text-secondary-content absolute bottom-0 right-0 w-20 h-20 m-4 flex flex-col justify-center items-center text-xs gap-1" on:click={getHints}>
						<span class="text-[10px] text-secondary-content">เปลี่ยนคำใบ้</span>
					</button>

					<!-- bottom middle clue -->
					{#key currentAnswer}
						<div class="btn btn-xl absolute text-xl lg:text-3xl bottom-0 inset-x-0 m-auto w-20 h-20 lg:w-24 lg:h-24 bg-base-200 border-base-300 text-primary font-black shadow-lg"
							in:fly={{y:-10, delay:400}}
						>{currentPreClues[1]}</div>
					{/key}

					<!-- bottom right skip -->
					<button class="btn btn-warning text-warning-content absolute bottom-0 left-0 w-20 h-20 m-4 flex flex-col justify-center items-center text-xs font-bold" on:click={giveUp}>
						<span>ข้าม</span>
					</button>

					<ArrowDownIcon class="absolute top-1/4 m-auto inset-x-0 translate-y-1 text-primary/60" size=20/>
					<ArrowDownIcon class="absolute bottom-1/4 m-auto inset-x-0 -translate-y-1 text-primary/60" size=20/>
					<ArrowRightIcon class="absolute m-auto inset-y-0 left-1/4 translate-x-1 text-primary/60" size=20/>
					<ArrowRightIcon class="absolute m-auto inset-y-0 right-1/4 -translate-x-1 text-primary/60" size=20/>
				</div>
			{:else if isFinished}
				<div class="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200 border border-base-300 rounded-2xl p-2 overflow-clip mx-2">
					<div class="stat" in:fly={{y:10, delay:1000}}>
						<div class="stat-figure text-primary">
							<PlusCircleIcon size=20/>
						</div>
						<div class="stat-title text-base-content/70">คะแนนรวม</div>
						<div class="stat-value text-primary">{score}</div>
					</div>
					<div class="stat" in:fly={{y:10, delay:2000}}>
						<div class="stat-figure text-success-content">
							<CheckSquareIcon size=20/>
						</div>
						<div class="stat-title text-base-content/70">ตอบถูก</div>
						<div class="stat-value text-success-content">{numCorrect} ข้อ</div>
					</div>
					<div class="stat" in:fly={{y:10, delay:3000}}>
						<div class="stat-figure text-error-content">
							<SkipForwardIcon size=20/>
						</div>
						<div class="stat-title text-base-content/70">ข้าม</div>
						<div class="stat-value text-error-content">{numSkip} ข้อ</div>
					</div>
					<div class="stat" in:fly={{y:10, delay:4000}}>
						<div class="stat-figure text-warning-content">
							<HelpCircleIcon size=20/>
						</div>
						<div class="stat-title text-base-content/70">จำนวนคำใบ้</div>
						<div class="stat-value text-warning-content">{numHint}</div>
					</div>
				</div>

				<h2 class="mx-auto my-4 text-xl font-bold text-base-content" in:fly={{y:10, delay:5000}}>
					{#if score < 20}
						เกรด F: 😢 ลองใหม่นะ
					{:else if score < 40}
						เกรด D: 😤 เริ่มจับทางได้แล้ว
					{:else if score < 60}
						เกรด C: 🧐 เครื่องกำลังมาแล้ว
					{:else if score < 80}
						เกรด B: 🤩 ร.ร.ร.เร็ว!
					{:else if score < 100}
						เกรด A: 🤯 สุดยอดไปเลย!
					{:else if score < 120}
						เกรด S: 😱 รับข้าน้อยเป็นศิษย์ด้วย!
					{:else}
						เกรด SS+: 🤖 คุณไม่ใช่คนแล้ว!!!
					{/if}
				</h2>
				<button class="btn btn-primary text-primary-content px-8 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all mx-auto m-4 flex items-center gap-3"
					on:click={()=>{isFinished = false}}
				>
					<span>เล่นอีกครั้ง</span> <RefreshCcwIcon size=24/>
				</button>

				<div class="grid grid-cols-6 w-full lg:w-1/2 h-32 mx-auto overflow-y-auto justify-center bg-base-100 text-base-content p-4 rounded-2xl border border-base-300"
				in:fade={{delay:7000, duration:1000}}>
					{#each answerHistory as h, index}
						<div>{correctHistory[index]? '✅':'❌'}</div>
						<div class="text-sm text-base-content/70">
							{h[0]},{h[1]}
						</div>
						<div class="text-base-content/70">></div>
						<div class="text-sm font-bold text-primary">{h[2]}</div>
						<div class="text-base-content/70">></div>
						<div class="text-sm text-base-content/70">
							{h[3]},{h[4]}
						</div>
					{/each}
				</div>
			{:else}
				<button class="btn btn-primary text-primary-content font-black text-2xl sm:text-3xl px-10 py-4 rounded-2xl shadow-lg active:scale-95 transition-all mx-auto my-6 flex items-center justify-center gap-3"
					on:click={play}>
					<span>เริ่มเล่น</span> <PlayCircleIcon size=32/>
				</button>

				<div class="mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 my-4 p-6 bg-base-200 text-base-content rounded-2xl border border-base-300">
					<div class="font-bold text-base-content">ตั้งค่าเกม:</div>
					<div class="flex flex-col justify-center">
						<h3 class="text-xs font-bold text-primary mb-2">ความยาวคำตอบ</h3>
						<div class="flex flex-row gap-3">
						{#each [0,2,3,4] as len}
							<label class="label cursor-pointer flex items-center gap-1.5 text-xs text-base-content">
								<input type="radio" name="answerLength" class="radio radio-primary radio-xs" value={len} bind:group={answerLength}/>
								<span>{len == 0 ? 'รวม':len}</span>
							</label>
							{/each}
						</div>
					</div>
					<div class="flex flex-col justify-center">
						<h3 class="text-xs font-bold text-primary mb-2">เวลาจำกัด</h3>
						<div class="flex flex-row gap-3">
							{#each [true, false] as time}
								<label class="label cursor-pointer flex items-center gap-1.5 text-xs text-base-content">
									<input type="radio" name="timed" class="radio radio-primary radio-xs" value={time} bind:group={isTimed}/>
									<span>{time? '1 นาที':'ไม่จำกัด'}</span>
								</label>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<label class="modal cursor-pointer w-screen" for="submit-modal" class:modal-open={openModal} on:click={()=>openModal = false} on:keypress={()=>{}}>
   <div class="modal-box relative bg-base-100 text-base-content border border-base-300 text-base-content/70 rounded-3xl">
      <div class="text m-2">
         <h1 class="text-xl font-bold text-base-content mb-2">วิธีเล่น Crossroad</h1>
         พิมพ์คำลงในช่องตรงกลาง เพื่อให้ช่องที่ติดกันอ่านตามลูกศรได้คำ 4 คำ เช่น

         <div class="relative w-48 h-32 mx-auto border border-base-300 bg-base-100 text-base-content rounded-xl p-4 my-4">
            <div class="absolute top-1 inset-x-0 m-auto text-primary font-bold text-sm">กึ่ง</div>
            <div class="absolute top-1/2 left-1 -translate-y-1/2 px-2 text-primary font-bold text-sm">คน</div>
            <div class="absolute top-1/2 right-1 -translate-y-1/2 px-2 text-primary font-bold text-sm">คน</div>
            <div class="absolute bottom-1 inset-x-0 m-auto text-primary font-bold text-sm">วัน</div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><span class="border border-primary/30 text-primary font-bold px-1 rounded">????</span></div>
            <ArrowDownIcon class="absolute top-1/4 m-auto inset-x-0 -translate-y-2 text-base-content/70" size=16/>
            <ArrowDownIcon class="absolute bottom-1/4 m-auto inset-x-0 translate-y-2 text-base-content/70" size=16/>
            <ArrowRightIcon class="absolute m-auto inset-y-0 left-1/4 translate-x-0 text-base-content/70" size=16/>
            <ArrowRightIcon class="absolute m-auto inset-y-0 right-1/4 -translate-x-0 text-base-content/70" size=16/>
         </div>

         ถ้าใส่คำว่า <span class="underline font-bold text-primary">กลาง</span> ลงไปในช่อง จะเกิดเป็นคำว่า

         <br>
         - กึ่งกลาง, คนกลาง, กลางคน และกลางวัน -
         <br><br>

         ฉะนั้นคำตอบคือ <span class="underline font-bold text-primary">กลาง</span> (คำตอบมี 2-4 ช่องอักษร)

         <div class="mt-6 flex justify-center">
            <button class="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-base-content/70 font-bold text-sm transition-all"
               on:click={()=>openModal = false}>
               <span>เข้าใจแล้ว!</span>
            </button>
         </div>
      </div>
   </div>
</label>

<style>
	@keyframes pos-x-wiggle {
		0% {
			transform: rotate(0);
		}
		25% {
			transform: rotate(10deg);
		}
		50% {
			transform: rotate(0);
		}
		75% {
			transform: rotate(-10deg);
		}
		100% {
			transform: rotate(0);
		}
	}
	.wiggle {
		animation-duration: 0.5s;
		animation-fill-mode: both;
		animation-name: pos-x-wiggle;
		animation-play-state: running;
	}
</style>
