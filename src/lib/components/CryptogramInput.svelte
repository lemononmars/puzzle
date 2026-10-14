<script lang=ts>
   import {splitWord, isUpper, isLower, isTall, isMiddle} from '#lib/utils/thaiwords.js'
   import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	function dispatchSolved() {
		dispatch('solved');
	}

   onMount(()=>{
      setActiveLetters(0)
   })

   export let word: string = "ว่าง"
   export let newlines: number[] = []
   export let showUsedLetters: boolean = false

   const splittedWord = splitWord(word)
   let splittedIndex = splittedWord.map(_ => 0)

   const numBlocks = splittedWord.length
   splittedWord.map(w => w[0])
   const usedLetters: string[] =  splittedWord.map(w => w[0])

   let poolString: string = 'กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาำเแใโไ'
   if(showUsedLetters) {
      poolString = poolString.split("").reduce((previous, current) => usedLetters.includes(current)? previous+current: previous, '')
   }
   let poolArray: string[] = poolString.split("")
   let poolLetterElement = Array(poolString.length).fill(null)
   let usedPoolLetters = Array(poolString.length).fill(false)

   // have lower and uppper characters shown as default
   let inputLetters: string[] = word.split("").map((w) => isLower(w) || isUpper(w) ? w:'')
   let letterElement = Array(word.length).fill(null)
   // determine cryptogram indices
   let cryptogramIndices = splittedWord.map(_ => 0)
   let idx = 1
   for(let i=0; i < splittedWord.length; i ++) {
      if(!cryptogramIndices[i]) {
         cryptogramIndices[i] = idx
         let letter = splittedWord[i][0]
         for(let j = i+1; j < splittedWord.length; j ++) {
            if (splittedWord[j][0] === letter)
               cryptogramIndices[j] = idx
         }
         idx++
      }
   }

   let currentLength = 0
   for(let i = 0; i < numBlocks; i ++) {
      splittedIndex[i] = currentLength
      currentLength += splittedWord[i].length
   }

   // keeping track of which letter is selected
   let activeCryptogramIndex: number = 0
   let activeWordIndex: number = 0

   function setActiveLetters(widx: number) {
      activeWordIndex = widx
      activeCryptogramIndex = cryptogramIndices[widx]
      clearActive()
      letterElement[splittedIndex[activeWordIndex]].classList.add('bg-warning', 'border-info')
      for(let i = 0; i < numBlocks; i ++) {
         if(cryptogramIndices[i] == activeCryptogramIndex)
            letterElement[splittedIndex[i]].classList.add('bg-info-content', 'border-info')
      }
   }

   function clearActive() {
      letterElement.forEach((l) => {
         l.classList.remove('bg-info-content', 'border-info', 'bg-warning')
      })
   }


   function inputLetter(l: string) {
      if(inputLetters[splittedIndex[activeWordIndex]]) // remove existing letter
         usedPoolLetters[poolString.indexOf(inputLetters[splittedIndex[activeWordIndex]])] = false

      // letters can't be used more than once
      if(l !== '') {
         if(usedPoolLetters[poolString.indexOf(l)])
            return
         else
            usedPoolLetters[poolString.indexOf(l)] = true
      }

      for(let i = 0; i < numBlocks; i ++) {
         if(cryptogramIndices[i] == activeCryptogramIndex)
            inputLetters[splittedIndex[i]] = l
      }

      if(l === '') return
      const combined = inputLetters.join("")
      if(combined === word)
         dispatchSolved()

      let found = false
      let startingIndex = activeWordIndex
      do {
         activeWordIndex = (activeWordIndex + 1) % splittedWord.length
         if(inputLetters[splittedIndex[activeWordIndex]] === '') {
            found = true
            setActiveLetters(activeWordIndex)
         }
      } while(!found && activeWordIndex != startingIndex)
      if(!found) {
         activeWordIndex ++
         setActiveLetters(activeWordIndex)
      }
   }

   function handlePool(poolLetter: string, poolIndex: number) {
      if(usedPoolLetters[poolIndex]) {
         setActiveLetters(splittedIndex.indexOf(inputLetters.findIndex(i => i === poolLetter)))
         inputLetter('')
      }
      else {
         inputLetter(poolString[poolIndex])
      }
   }


   function handleKeyPress(event: KeyboardEvent) {
      if(event.key === "ArrowLeft") {
         activeWordIndex = (activeWordIndex + splittedWord.length - 1) % splittedWord.length
         setActiveLetters(activeWordIndex)
         return
      }
      if(event.key === "ArrowRight") {
         activeWordIndex = (activeWordIndex + 1) % splittedWord.length
         setActiveLetters(activeWordIndex)
         return
      }

      if(event.key !== 'Backspace' && event.key !== ' ' && !isMiddle(event.key)) return

      const input = event.key === 'Backspace' || event.key === ' '? '' : event.key
      if(showUsedLetters && input !== '' && !poolString.includes(event.key)) return // prevent users from inputing weird letter
      inputLetter(input)
   }
</script>

<svelte:window on:keydown={handleKeyPress}/>
<div class="puzzle-tiles flex flex-col gap-x-4 mx-2 pt-10">

   <div class="min-h-28 w-full flex flex-row flex-wrap gap-x-1 gap-y-10 justify-center pb-8">
      {#each splittedWord as word, widx}
         <div class="w-8 lg:w-10 h-20 lg:h-28 relative">
            {#each word as l, idx}
               {@const letterIndex = splittedIndex[widx] + idx}
               <div
                  class="absolute {isLower(l) ? 'top-8 lg:top-12': isUpper(l) ? (idx > 0 && isUpper(word[idx-1]) ? '-top-8' : '-top-4') : 'top-0'} left-0 w-full {isLower(l) || isUpper(l) ? 'h-4' :'h-8 lg:h-12'} border-2"
                  class:bg-success={!inputLetters[letterIndex]}
                  bind:this={letterElement[letterIndex]}
                  on:click={()=>setActiveLetters(widx)}
                  on:keypress={()=>{}}
               >
                  {#if inputLetters[letterIndex]}
                     {#if isLower(l)}
                        <p class="-translate-y-4 lg:-translate-y-8 translate-x-2 text-xl lg:text-4xl pointer-events-none">{inputLetters[letterIndex]}</p>
                     {:else if isUpper(l)}
                        <p class="translate-x-2 text-xl lg:text-4xl pointer-events-none">{inputLetters[letterIndex]}</p>
                     {:else if isTall(l)}
                        <p class="text-xl lg:text-4xl lg:translate-y-2">{inputLetters[letterIndex]}</p>
                     {:else}
                        <p class="text-xl lg:text-4xl lg:translate-y-2">{inputLetters[letterIndex]}</p>
                     {/if}
                  {/if}
               </div>
            {/each}
            <div
               class="absolute top-12 lg:top-16 h-4 translate-x-3"
               on:keypress={()=>{}}
            >
               <p class="text text-sm lg:text-base">{cryptogramIndices[widx]}</p>
            </div>
         </div>
         {#if newlines.includes(widx)}
            <div class="w-8"></div>
         {/if}
      {/each}
   </div>
   <div class="divider mt-64 lg:mt-32"></div>

   <div class="flex flex-row flex-wrap justify-center gap-2 mx-auto">
   {#each poolArray as p, index}
         <div
            class="w-10 lg:w-12 h-8 lg:h-12 border-2 bg-none"
            class:w-8={!showUsedLetters}
            class:bg-error={usedPoolLetters[index]}
            bind:this={poolLetterElement[index]}
            on:click={()=>handlePool(p, index)}
            on:keypress={()=>{}}
         >
            <p class="text-lg lg:text-4xl translate-y-1">{p}</p>
         </div>
   {/each}
   </div>
</div>
