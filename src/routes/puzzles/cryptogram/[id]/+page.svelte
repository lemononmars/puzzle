<script lang="ts">
export let data: any;


   import type {ICryptogram} from '#lib/interfaces/index.js'
   import CryptogramInput from '#lib/components/CryptogramInput.svelte';
   import TitleTab from '#lib/components/TitleTab.svelte';

   let content: ICryptogram = data.content;

   let openModal: boolean = false

$: ({ content } = data);
</script>

<TitleTab {content}/>

{#key content}
<div class="flex flex-col gap-2 pb-10">
   <CryptogramInput word={content.answer} newlines={content.newlines} showUsedLetters={content.showUsedLetters}
      on:solved={()=>openModal=true}
   />
</div>
{/key}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false} on:keypress={()=>{}}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">ถูกต้อง 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false} on:keypress={()=>{}}>เย่!</div>
   </label>
</label>
