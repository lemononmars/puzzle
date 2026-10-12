<script lang="ts">
export let data: any;


   import { goto } from '$app/navigation';
   import type { ISpellingBee } from '#lib/interfaces/index.js';
   import { numPuzzles } from '#lib/data/puzzles/spellingbee/index.js';
   import { search, isUpper, isLower, getSubWords } from '#lib/utils/thaiwords.js';
   import { XCircleIcon, RefreshCwIcon, CheckCircleIcon, Maximize2Icon, Minimize2Icon } from 'svelte-feather-icons';
   import { flip } from 'svelte/animate';
   import { onMount } from 'svelte';

   let isFullscreen = false;
   function toggleFullscreen() {
      const elem = document.getElementById('spellingbee-game-container');
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

   let content: ISpellingBee = data.content;

   let answer: string = '';
   let pastAnswers: string[] = [];
   interface SubmissionLog {
      answer: string;
      response: string;
   }
   let logs: SubmissionLog[] = [];

   $: currentWord = content?.word || 'กงเกวียน';
   $: solutions = getSubWords(currentWord, false).filter((s) => s.length >= 3);
   $: letters = shuffle(currentWord.split(''));
   $: solved = new Array(solutions.length).fill(false);

   let openModal: boolean = false;

   async function checkAnswer() {
      if (answer.length === 0) return;

      if (pastAnswers.includes(answer)) {
         logs = [{ answer, response: 'duplicate' }, ...logs];
         triggleWiggle();
         answer = '';
         return;
      }

      if (answer.length < 3) {
         logs = [{ answer, response: 'short' }, ...logs];
         triggleWiggle();
         answer = '';
         return;
      }

      if (answer.split('').some((l) => !letters.includes(l))) {
         logs = [{ answer, response: 'illegal' }, ...logs];
         triggleWiggle();
         answer = '';
         return;
      }

      try {
         const res = await fetch('/api/spellingbee/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ puzzleWord: currentWord, guess: answer })
         });
         const data = await res.json();
         if (data.isValid) {
            pastAnswers = [...pastAnswers, answer];
            const idx = solutions.indexOf(answer);
            if (idx !== -1) solved[idx] = true;
            logs = [{ answer, response: 'correct' }, ...logs];

            if (answer === currentWord || (solved.length > 0 && solved.every(Boolean))) {
               openModal = true;
            }
         } else {
            logs = [{ answer, response: data.reason === 'not_in_dictionary' ? 'wordless' : (data.reason || 'wordless') }, ...logs];
            triggleWiggle();
         }
      } catch {
         if (search(answer)) {
            pastAnswers = [...pastAnswers, answer];
            const idx = solutions.indexOf(answer);
            if (idx !== -1) solved[idx] = true;
            logs = [{ answer, response: 'correct' }, ...logs];
         } else {
            logs = [{ answer, response: 'wordless' }, ...logs];
            triggleWiggle();
         }
      }

      answer = '';
   }

   function handleKeyPress(event: KeyboardEvent) {
      if (event.code === 'Enter') {
         checkAnswer();
      }
   }

   function shuffle(arr: string[]) {
      const s = [...arr];
      const l = s.length;
      for (let i = 0; i < l; i++) {
         const newIndex = Math.floor(Math.random() * (l - i - 1));
         const temp = s[newIndex];
         s[newIndex] = s[i];
         s[i] = temp;
      }
      return s;
   }

   function handleShuffle() {
      letters = shuffle(letters);
   }

   function giveUp() {
      solved = new Array(solutions.length).fill(true);
      logs = [{ answer: currentWord, response: 'correct' }, ...logs];
   }

   function addLetter(l: string) {
      answer += l;
   }

   let isWiggle: boolean = false;
   function triggleWiggle() {
      isWiggle = true;
      setTimeout(() => (isWiggle = false), 600);
   }

   function newPuzzle() {
      const nextId = Math.floor(Math.random() * numPuzzles);
      goto(`/puzzles/spellingbee/${nextId}`);
   }

$: ({ content } = data);
</script>

<svelte:head>
	<title>Code Breaker | Spelling Bee 🐝</title>
	<meta name="description" content="ผสมคำจากตัวอักษร 7 ตัวที่กำหนด" />
</svelte:head>

<svelte:body on:keydown={handleKeyPress} />

<div id="spellingbee-game-container" class="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 select-none">
   <div class="bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col gap-3 items-center relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header controls -->
      <div class="w-full flex justify-between items-center border-b border-base-300/80 pb-2">
         <div class="flex items-center gap-2 overflow-hidden">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0"></span>
            <h1 class="text-base sm:text-xl font-extrabold text-base-content tracking-tight truncate">
               Spelling Bee <span class="text-xs text-base-content/70 font-medium hidden sm:inline">(#{content?.id ?? 'Random'})</span>
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
               on:click={newPuzzle}
               class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-primary hover:bg-primary/20"
            >
               <span>สุ่มข้อใหม่</span> 🎲
            </button>
         </div>
      </div>

      <!-- Letter Tiles Grid -->
      <div class="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-w-xl py-3">
         {#each letters as l (l)}
            <div animate:flip={{ duration: 300 }}>
               <button
                  on:click={() => addLetter(l)}
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 font-black text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                  {answer.includes(l)
                     ? 'bg-primary text-primary-content border-primary'
                     : 'bg-base-200 text-base-content border-base-300 hover:border-primary'}"
               >
                  <span class={isUpper(l) || isLower(l) ? 'translate-x-0.5' : ''}>{l}</span>
               </button>
            </div>
         {/each}
      </div>

      <!-- Input controls -->
      <div class="w-full max-w-md flex flex-col sm:flex-row items-center gap-2.5">
         <button
            on:click={handleShuffle}
            class="btn btn-square btn-outline btn-primary p-3.5 rounded-2xl transition-colors shadow-inner"
            title="สลับอักษร"
         >
            <RefreshCwIcon size="20" />
         </button>

         <div class="relative flex-1 w-full" class:wiggle={isWiggle}>
            <input
               type="text"
               bind:value={answer}
               placeholder=""
               class="input  w-full px-4 py-3 rounded-2xl bg-base-300 text-base-content text-xl font-black focus:outline-none focus:border-primary transition-colors shadow-inner"
            />
            {#if answer}
               <button
                  on:click={() => (answer = '')}
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
               >
                  <XCircleIcon size="18" />
               </button>
            {/if}
         </div>

         <button
            on:click={checkAnswer}
            class="btn btn-primary text-primary-content w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-base shadow-lg"
         >
            ส่ง
         </button>
      </div>

      <div class="flex gap-3 pt-1">
         <button
            on:click={giveUp}
            class="btn btn-error text-error-content btn-sm rounded-xl font-bold transition-colors"
         >
            เฉลยทั้งหมด
         </button>
      </div>
   </div>

   <!-- Submissions & Answers grid -->
   <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-5 h-64 flex flex-col shadow-xl">
         <h2 class="font-bold text-base-content mb-3 text-center border-b border-base-300 pb-2 text-sm tracking-wide">คำตอบก่อนหน้านี้</h2>
         <div class="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 text-sm">
            {#each logs as l}
               {#if l.response === 'correct'}
                  <p class="text-success-content font-semibold">{l.answer} ✔️</p>
               {:else if l.response === 'duplicate'}
                  <p class="text-warning-content font-semibold">{l.answer} เคยตอบไปแล้ว</p>
               {:else if l.response === 'illegal'}
                  <p class="text-error-content font-semibold">{l.answer} ❌ มีตัวอักษรที่ห้ามใช้</p>
               {:else if l.response === 'wordless'}
                  <p class="text-error-content font-semibold">{l.answer} ❌ ไม่อยู่ในพจนานุกรม</p>
               {:else if l.response === 'short'}
                  <p class="text-error-content font-semibold">{l.answer} ❌ สั้นกว่า 3 ตัวอักษร</p>
               {/if}
            {/each}
         </div>
      </div>

      <div class="bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-5 h-64 flex flex-col shadow-xl">
         <h3 class="font-bold text-base-content mb-3 text-center border-b border-base-300 pb-2 text-sm tracking-wide">คำที่หาเจอแล้ว ({solved.filter(Boolean).length}/{solutions.length})</h3>
         <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1 overflow-y-auto flex-1">
            {#each solutions as s, idx}
               <div
                  class="rounded-xl border transition-all h-9 flex items-center justify-center cursor-pointer text-xs font-bold
                  {solved[idx] ? 'bg-success text-success-content border-success' : 'bg-base-200 border-base-300 text-base-content/70 hover:border-primary'}"
                  on:click={() => (solved[idx] = true)}
               >
                  {#if solved[idx]}
                     <span>{s}</span>
                  {:else}
                     <span>{s.length} อักษร</span>
                  {/if}
               </div>
            {/each}
         </div>
      </div>
   </div>
</div>

<!-- Success Modal -->
<input type="checkbox" id="submit-modal" class="modal-toggle" />
<div class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={() => (openModal = false)}>
   <div class="modal-box relative bg-base-100 text-base-content border border-base-300 text-base-content rounded-3xl p-6 shadow-2xl">
      <h3 class="text-2xl font-black mb-2 text-primary flex items-center gap-2">
         <CheckCircleIcon size="24" /> หาคำศัพท์ครบแล้ว! 🎉
      </h3>
      <p class="text-base-content/70 text-sm mb-6">คุณเฉลยคำศัพท์ครบทุกคำในปริศนานี้สำเร็จแล้ว</p>
      <div class="flex gap-3">
         <button class="flex-1 py-3 rounded-2xl font-black bg-cyan-500 hover:bg-cyan-400 text-base-content/70 transition-colors" on:click={newPuzzle}>
            เล่นข้อถัดไป 🎲
         </button>
         <button class="px-5 py-3 rounded-2xl font-bold bg-base-100 text-base-content text-base-content/70 hover:bg-base-100 text-base-content transition-colors" on:click={() => (openModal = false)}>
            ปิด
         </button>
      </div>
   </div>
</div>

<style>
   @keyframes pos-x-wiggle {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
   }
   .wiggle {
      animation: pos-x-wiggle 0.4s ease-in-out;
   }
</style>
