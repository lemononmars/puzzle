

<script lang="ts">
   import {goto} from '$app/navigation'

   function startGame(){
      goto('/puzzles/adventure/1')
   }
</script>

<h1>Are You Ready?</h1>
<div class="btn btn-outline btn-wide my-48" on:click={startGame}>Yes</div>

<div class="text-left">
<h2>วิธีเล่น</h2>

<ul>
<li>* แก้ปริศนาในแต่ละด่าน</li>
<li>* ใส่คำตอบในช่องตรวจคำตอบ โดยคำตอบจะเป็นตัวอักษรภาษาอังกฤษตัวเล็ก หรือตัวเลข หรือทั้งสองอย่างปนกัน</li>
<li>* ไม่ต้องเปิด html เพื่อหาข้อมูล ข้อมูลทั้งหมดที่จำเป็นต่อการแก้ปริศนาอยู่ในหน้าปริศนาแล้ว</li>
<li>* อาจต้องใช้ความรู้เรื่องการถอดรหัสจากแหล่งภายนอก (เช่น รหัสมอส ASCII อักษรเบรลล์)</li>
<li>* ความคืบหน้าถูกบันทึกใน local storage โดยไม่ต้องตั้งค่าอะไรเพิ่มเติม แต่ถ้ามีการย้ายอุปกรณ์แล้วข้อมูลจะไม่ถูกย้ายตามไปด้วย</li>
</ul>
</div>
