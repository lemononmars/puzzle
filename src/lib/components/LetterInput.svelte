<script lang=ts>
   import {splitWord, isUpper, isLower, isTall} from '#lib/utils/thai-text.js'
   import {fade} from 'svelte/transition'

   import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function togglePlay() {
		dispatch('togglePlay');
	}

   export let word: string = 'ว่าง'

   const splittedWord = splitWord(word)
   let splittedIndex = splittedWord.map(_ => 0)
   const numLetters = word.length
   const numBlocks = splittedWord.length

   let activeLetterIndex: number = 0
   let revealedLetters: boolean[] = Array(word.length).fill(false)
   let letterElement = Array(word.length).fill(null)

   let solved: boolean = false
   // splitted by unit

   let currentLength = 0
   for(let i = 0; i < numBlocks; i ++) {
      splittedIndex[i] = currentLength
      currentLength += splittedWord[i].length
   }

   let interval = 100 // run every (in ms)
   const revealInterval = 2000 // reveal every (in ms)
   const maxTime = numLetters * revealInterval
   let time = maxTime
   let timer: any

   function countdown() {
      if(Math.floor(time/revealInterval) > Math.floor((time-interval)/revealInterval)) {
         setActiveLetter(Math.floor(Math.random()*numLetters))
         reveal(nextHiddenLetter())
      }

      time -= interval
      if(time <= 0)
         clearInterval(timer)
   }

   function setActiveLetter(index: number) {
      letterElement[activeLetterIndex].classList.remove('animate-pulse', 'border-info')
      activeLetterIndex = index
      letterElement[activeLetterIndex].classList.add('animate-pulse', 'border-info')
   }

   function nextHiddenLetter() {
      let offset = 1
      while(offset < numLetters) {
         const idx = (activeLetterIndex + offset) % numLetters
         if(!revealedLetters[idx]) {
            setActiveLetter(idx)
            break;
         }
         offset ++
      }

      if(offset == numLetters)
         solved = true

      return activeLetterIndex
   }

   // function handleKeyPress(event: KeyboardEvent) {
	// 	if (event.code === "Tab" || event.code === 'Space' || event.code === 'ArrowRight')
   //       nextHiddenLetter()
   //    else if (event.code === 'Enter') {
   //       reveal(activeLetterIndex)
   //       nextHiddenLetter()
   //    }
   //    else if (event.code === 'ArrowLeft')
   //       setActiveLetter((activeLetterIndex + numLetters - 1) % numLetters)
	// }

   function reveal(index: number){
      revealedLetters[index] = true
   }

   function clickReveal(index: number) {
      revealedLetters[index] = true
      time -= revealInterval
   }

   let isPaused: boolean = false

   function pause() {
      isPaused = true
      clearInterval(timer)
      togglePlay()
   }

   function play() {
      isPaused = false
      timer = setInterval(countdown,interval)
      togglePlay()
   }
</script>

<!-- <svelte:window on:keydown={handleKeyPress}/> -->
<div class="flex flex-col gap-4">
<div class="radial-progress mx-auto" style="--value:{time*100/maxTime};" class:text-warning-content={isPaused}>
   <div class="countdown">
      <p style="--value:{Math.floor(time/1000)};"></p>
   </div>
</div>

<div class="puzzle-tiles h-20 w-full flex flex-row gap-1 justify-center">
   {#each splittedWord as word, widx}
      <div class="w-12 relative">
         {#each word as l, idx}
            {@const letterIndex = splittedIndex[widx] + idx}
            <div
               class="absolute {isLower(l) ? 'top-12': isUpper(l) ? (idx > 0 && isUpper(word[idx-1]) ? '-top-8' : '-top-4') : isTall(l) ? '-top-4' : 'top-0'} left-0 w-full {isLower(l) || isUpper(l) ? 'h-4' : isTall(l) ? 'h-16' :'h-12'} border-2"
               class:bg-success={!revealedLetters[letterIndex]}
               bind:this={letterElement[letterIndex]}
               on:click={()=>clickReveal(letterIndex)}
            >
               {#if revealedLetters[letterIndex]}
                  {#if isLower(l)}
                     <p class="-translate-y-8 translate-x-2 text-xl lg:text-4xl" transition:fade>{l}</p>
                  {:else if isUpper(l)}
                     <p class="translate-x-2 -translate-y-1 text-xl lg:text-4xl" transition:fade>{l}</p>
                  {:else if isTall(l)}
                     <p class="text-xl lg:text-4xl translate-y-4" transition:fade>{l}</p>
                  {:else}
                     <p class="text-xl lg:text-4xl" transition:fade>{l}</p>
                  {/if}
               {/if}
            </div>
         {/each}
      </div>
   {/each}
</div>

{#if time == maxTime}
   <div class="btn btn-info" on:click={play}>
      เริ่ม!
   </div>
{/if}

{#if isPaused}
   <div class="btn btn-info" on:click={play}>
      ดูตัวอักษรเพิ่ม
   </div>
{:else if time < maxTime}
   <div class="btn btn-error" on:click={pause}>
      ขอตอบ!
   </div>
{/if}
</div>
