<script lang="ts">
   import {encode} from './helper'

   const create = ()=>{
      submitted = true
      link = `${prefix}/${encode(title.toUpperCase())}/${encode(answer)}`
   }

   let submitted:boolean = false
   let title:string = ''
   let answer:string = ''
   let prefix:string = 'https://codebreaker-ten.vercel.app/check/v1' // probably v2 for more secured version
   let link:string = ''
</script>

<svelte:head>
   <title>Create Answer Checker</title>
</svelte:head>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none">
   <h1>สร้างลิงก์ตรวจคำตอบ</h1>
   <div class="">ใส่ชื่อโจทย์</div>
   <input class="input  text-3xl" type="text" bind:value={title}>
   <div class="">ใส่คำตอบ</div>
   <input class="input  text-3xl" type="text" bind:value={answer}>
   <div class="btn btn-primary w-48 m-auto" on:click={create} on:keypress={()=>{}}>สร้าง</div>

   <div class="text-center">
      {#if submitted}
         <a href="{link}" target="_blank">{link}</a>
      {/if}
   </div>
</div>
