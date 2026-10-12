<script lang="ts">
export let data: any;


   import { decode } from '../../../helper'

   let title: string = data.title ?? ('');
   let answer: string = data.answer ?? ('');

   $: decodedTitle = decode(title);
   $: decodedAnswer = decode(answer);

   function checkAnswer(){
      loading = true
      lastSubmission = submission
      correct = (submission.trim().toUpperCase() === decodedAnswer.toUpperCase())
      setTimeout(()=> loading = false, 500) // wait 0.5 seconds before revealing
   }

   function handleKey(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         checkAnswer();
      }
   }

   let submission:string = ''
   let lastSubmission:string = ''
   let correct:boolean = false
   let loading:boolean = false

$: ({ title, answer } = data);
</script>

<svelte:head>
   <title>ตรวจคำตอบ | {decodedTitle}</title>
</svelte:head>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none">
   <h1>{decodedTitle}</h1>
   <div class="">ใส่คำตอบ</div>
   <input class="input  text-3xl transition-colors" type="text" bind:value={submission} on:keydown={handleKey}>
   <div class="btn btn-primary w-48 m-auto" on:click={checkAnswer}>ตรวจ</div>

   <div class="text-center">
      {#if lastSubmission.length > 0}
         {#if loading}
            <p class="text-warning-content">กำลังตรวจคำตอบ...</p>
         {:else}
            {#if correct}
               <p class="text-success-content">{lastSubmission} ✔️ เป็นคำตอบที่ถูกต้อง</p>
            {:else}
               <p class="text-error-content">{lastSubmission} ❌ ยังไม่ถูก</p>
            {/if}
         {/if}
      {/if}
   </div>
</div>
