

<script lang="ts">
export let data: any;


   import type {IRebus} from '#lib/interfaces/index.js'
   import { getPuzzleImageURL } from '#lib/supabase.js';
   import TitleTab from '#lib/components/TitleTab.svelte';
   let content: IRebus = data.content;
let id: number = data.id;

   content.type = 'rebus'
   let solved: boolean = false
   let submitted: boolean = false

   let answer: string = ''
   let duplicate: boolean = false
   let showAnswer: boolean = false
   let pastAnswers: string[] = []

   $: length = pastAnswers.length
   let numHints: number = 0
   $: imgurl = "rebus" + ("0" + id).slice(-2) + ".png"

   let openModal: boolean = false

   async function checkAnswer() {
      if(solved) return

      submitted = true
      duplicate = false
      if(pastAnswers.includes(answer)) {
         duplicate = true
         return
      }

      const guess = answer;
      pastAnswers = [...pastAnswers, guess];
      answer = '';

      try {
         const res = await fetch('/api/puzzle/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'rebus', id, answer: guess })
         });
         const data = await res.json();
         if (data.isCorrect) {
            solved = true;
            openModal = true;
         }
      } catch {
         if(content.answer && guess === content.answer) {
            solved = true;
            openModal = true;
         }
      }
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function revealHint(){
      if(content.hints && numHints < content.hints?.length)
         numHints ++
      scrollBottom()
   }

   function scrollBottom() {
		window.scroll({ top: window.innerHeight + 200, behavior: 'smooth' });
	}

   function clearAns() {
      answer = ''
      pastAnswers = []
      numHints = 0
      submitted = false
      showAnswer = false
   }

	$: if (content) {
		clearAns();
	}

	function focusOnMount(node: HTMLElement) {
		node.focus();
	}

$: ({ content, id } = data);
</script>

<div class="flex flex-col gap-2 pb-10">
   <TitleTab {content} />

   <div class="mx-auto w-full lg:w-1/2">
      {#key imgurl}
         <img src="{getPuzzleImageURL('rebus', imgurl)}" on:error={(e) => { if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = "none"; }} class="aspect-auto object-contain" alt="img">
      {/key}
   </div>
   <h3>ภาพนี้แสดงคำว่าอะไร?</h3>

   <div class="join w-72 mx-auto">
      {#key id}
         <input class="join-item input  w-full" type="text" bind:value={answer} on:keydown={handleKeyPress} use:focusOnMount>
      {/key}
      <div class="join-item btn btn-primary " on:click={checkAnswer}>ตรวจคำตอบ</div>
   </div>
   {#if submitted}
      {#if duplicate}
         <p class="text-warning-content">เคยส่งคำตอบนี้ไปแล้ว</p>
      {/if}
      <h1>คำตอบก่อนหน้านี้</h1>
      {#each pastAnswers as _, idx}
         {#if idx == 0 && solved}
            <p class="text-success-content">"{pastAnswers[length - 1]}" เป็นคำตอบที่ถูกต้อง!</p>
         {:else}
            <p class="text-error-content">"{pastAnswers[length - idx - 1]}" ยังไม่ถูก</p>
         {/if}
      {/each}
   {/if}

   <div class="divider"></div>

   {#if content.hints}
      <div class="w-full lg:w-1/2 mx-auto">
         <h1>คำใบ้</h1>
         {#each content.hints?.slice(0,numHints) as h, idx}
            <div class="btn btn-outline btn-info btn-sm">คำใบ้ที่ {idx+1}</div>
            <p>{h}</p>
            <br>
         {/each}
         {#if numHints < content.hints.length}
            <div class="btn btn-outline btn-sm" on:click={revealHint}>เปิดคำใบ้ที่ {numHints + 1}</div>
         {:else}
            <div class="btn btn-warning btn-sm" on:click={()=>{showAnswer = true; scrollBottom()}}>เฉลย</div>
            {#if showAnswer}
               <p>{content.answer}</p>
            {/if}
         {/if}
      </div>
   {/if}
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">"{content.answer}" เป็นคำตอบที่ถูกต้อง! 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>
