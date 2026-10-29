<script lang="ts">
 import BookOpenIcon from '@lucide/svelte/icons/book-open';
 import { round1Leaderboard, round2Leaderboard, answerLogsData, statsComments } from '#lib/data/puzzles/tbs2021.js';
 let showRound1Time = true;
 let showRound2Time = true;
 let hoveredTimeIndex: number | null = null;
 const times = (entries: typeof round1Leaderboard) => entries.filter(e=>Number(e.timetotal)>0 && Number(e.timetotal)<36000000).sort((a,b)=>Number(a.timetotal)-Number(b.timetotal)).map(e=>({name:decodeURIComponent(e.name),hours:Number(e.timetotal)/3600000,timetotal:e.timetotal}));
 const r1TimeList=times(round1Leaderboard), r2TimeList=times(round2Leaderboard);
 function getChartX(index:number,total:number) { return total<=1 ? 60 : 60+(index/(total-1))*700; }
 function getChartY(hours:number) { return 250-(Math.min(hours,10)/10)*220; }
 const r1PolylinePoints=r1TimeList.map((p,i)=>`${getChartX(i,r1TimeList.length)},${getChartY(p.hours)}`).join(' ');
 const r2PolylinePoints=r2TimeList.map((p,i)=>`${getChartX(i,r2TimeList.length)},${getChartY(p.hours)}`).join(' ');
 function formatDurationMs(value:string) { const seconds=Math.floor(Number(value)/1000); if(!seconds)return '-'; return `${Math.floor(seconds/3600)} ชม. ${Math.floor(seconds%3600/60)} นาที ${seconds%60} วินาที`; }
</script>
<div class="flex flex-col lg:flex-row gap-8 items-start text-left w-full">
			<!-- Table of Contents (Sticky sidebar, no dots, left justified) -->
			<div class="w-full lg:w-64 shrink-0 bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 shadow-xl lg:sticky lg:top-20 text-left">
				<h3 class="font-black text-sm text-base-content mb-3 flex items-center gap-2 border-b border-base-300 pb-2 text-left">
					<BookOpenIcon size={16} class="text-primary" />
					<span>สารบัญ</span>
				</h3>
				<ul class="text-xs font-medium space-y-2 text-base-content/70 list-none pl-0 text-left">
					<li><a href="#beginning" class="hover:text-primary block py-0.5 transition-colors text-left">ที่มา</a></li>
					<li><a href="#platform" class="hover:text-primary block py-0.5 transition-colors text-left">แพลตฟอร์ม</a></li>
					<li><a href="#webapp" class="hover:text-primary block py-0.5 transition-colors text-left">ทำไมกลายเป็นเว็บไปได้?</a></li>
					<li><a href="#time" class="hover:text-primary block py-0.5 transition-colors text-left">เวลาที่ใช้</a></li>
					<li><a href="#guesses" class="hover:text-primary block py-0.5 transition-colors text-left">จำนวนครั้งที่ตอบผิด</a></li>
					<li><a href="#rates" class="hover:text-primary block py-0.5 transition-colors text-left">คะแนนโหวต</a></li>
					<li><a href="#comments" class="hover:text-primary block py-0.5 transition-colors text-left">ความเห็น</a></li>
					<li><a href="#reflection" class="hover:text-primary block py-0.5 transition-colors text-left">ประเมินตัวเอง</a></li>
					<li><a href="#thanks" class="hover:text-primary block py-0.5 transition-colors text-left">ขอบคุณ</a></li>
					<li><a href="#backstage" class="hover:text-primary block py-0.5 transition-colors text-left">เก็บตก</a></li>
				</ul>
			</div>

			<!-- Main Article Content (Verbatim writeups, left justified, min-w-0 to prevent clipping) -->
			<div class="flex-1 min-w-0 w-full bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-10 text-base-content leading-relaxed text-sm sm:text-base text-left break-words">
				<!-- Section 1: ที่มา -->
				<section id="beginning" class="scroll-mt-24 space-y-3 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">ที่มา</h2>
					<p class="text-left">ก่อนหน้านี้ในงาน Thailand Board Game Show 2020 ได้มีการจัดกิจกรรมแก้ปริศนาในงาน โดยงานนั้นซูมจัดการ 100% เนื่องจากผมยุ่งตัวเป็นเกลียว</p>
					<p class="text-left">ในปีนี้ ผู้จัดงาน Thailand Board Game Show 2021 เลยไว้ใจให้จัดกิจกรรมแก้ปริศนาอีกครั้งหนึ่ง นั่นก็คือเป็นครั้งที่สองของทั้ง TBS และทั้ง Code Breaker</p>
				</section>

				<!-- Section 2: แพลตฟอร์ม -->
				<section id="platform" class="scroll-mt-24 space-y-3 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">แพลตฟอร์ม</h2>
					<p class="text-left">แพลตฟอร์มที่ใช้คือ gather.town จึงนับว่าเป็นกิจกรรมปริศนาออนไลน์เต็มรูปแบบ โดยใน gather.town ผู้ใช้งานจะมีปฏิสัมพันธ์กับสิ่งของได้ดังนี้</p>
					<ul class="list-disc list-inside space-y-1 pl-2 text-left">
						<li>แสดงข้อความหรือภาพเมื่อเดินไปใกล้ช่อง (prompt message)</li>
						<li>กด x เพื่อเปิดสื่อ ได้แก่ โน้ต, เว็บไซต์, วีดีโอ, ภาพ</li>
					</ul>
					<p class="text-left">ถ้ามี role เป็น admin, owner หรือ builder จะทำได้มากกว่านี้ คือเพิ่มสิ่งกีดขวาง และเพิ่มจุดวาร์ปไปช่องอื่น แต่เนื่องจากไม่มี role เหล่านั้นเลยไม่สามารถใช้ลูกเล่นนั้นได้ ทำให้ต้องเปลี่ยนปริศนาข้อนึงที่ให้ผู้เล่นเดินเขาวงกตล่องหน ให้เป็นเดินหาข้อความแทน</p>
					<p class="text-left">มีตะกุกตะกักบ้างตอนวางของในแผนที่ เชคของเป็นครั้งคราวเพราะคนอื่นต้องเข้ามาจัดบูธเวลาเดียวกัน บางทีของที่ตั้งไว้ก็โดนลบไป (แต่เราก็ไปลบของคนอื่นโดยไม่ได้ตั้งใจเหมือนกัน เช่นเรือโจรสลัดลำใหญ่มหึมาของ Siam Board Games ที่น่าจะเผลอลบไป 3 ครั้ง ได้)</p>
					<p class="text-left">ลูกเล่นนึงที่ใช้คือ ประตูเข้ารหัส เป็นลูกเล่นของ gather.town ที่ยังเป็น beta ตั้งค่าวุ่นวายหน่อย แต่ก็ใช้งานได้ ติดปัญหาเล็กน้อยคือประตูจะเปิดค้าง 5 วินาที จึงอาจมีคนหลุดเข้าไปบ้าง แต่ไม่ได้เป็นอะไรที่ซีเรียสนัก</p>
				</section>

				<!-- Section 3: ทำไมกลายเป็นเว็บไปได้? -->
				<section id="webapp" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">ทำไมกลายเป็นเว็บไปได้?</h2>
					<p class="text-left">ในตอนแรกสุดมีการวางแผนให้ผู้เล่นต้องเดินไปหาสตาฟเพื่อตรวจคำตอบ แต่ในเมื่อเราเล่นแบบออนไลน์รูปแบบอยู่แล้ว ถ้ามีหน้าสำหรับตรวจคำตอบให้เลยจะสะดวกกว่า จึงคิดว่าจะใช้แนบลิงก์ Google Sites หรือ Google Forms ให้ใน gather.town เลย แต่ไป ๆ มา ๆ ด้วยความที่เพิ่งได้รู้จักกับ Svelte หมาด ๆ เลยนึกครึ้มทำเป็น web app ซะเลย</p>
					<p class="text-left">ที่จริง มี github project ที่ใช้สร้างเว็บสำหรับ puzzle hunt โดยเฉพาะ ที่ <a href="https://github.com/galacticpuzzlehunt/gph-site" target="_blank" rel="noopener noreferrer" class="text-primary underline font-bold">gph-site</a> และได้เคยลอง fork มาทำเล่นจนเสร็จแล้ว แต่ติดตรงที่ต้องให้ผู้เล่นสร้างบัญชีในเว็บ ซึ่งจะวุ่นวายถ้าต้องกรอกข้อมูลนู่นนี่นั่นเพียงเพื่อแก้ปริศนาสั้น ๆ (ที่ลงท้ายดันนานกว่าที่คิด) เลยไม่สามารถใช้ได้ อย่างไรก็ตาม ลูกเล่นหลายอย่างก็หยิบจาก gph-site นี่หละ เอามาเขียนใหม่เอง</p>
					<p class="text-left">ตอนแรก ๆ ก็กะว่าทำเป็นหน้าแยกกัน ตรวจคำตอบแล้วจบ อย่างน้อยสุดก็ให้ผู้เล่นกรอกชื่อและอีเมลหลังเล่นเสร็จ เพื่อส่งให้ทีมงานไปแจกรางวัล แต่นึกสนุกอยากทำให้เหมือน puzzle hunt ที่เคยไปเล่น ก็เลยใส่ลูกเล่นเพิ่ม ไป ๆ มา ๆ กลายเป็น full-stack ไปได้ (...) ถ้ามี login ด้วยนี่คือครบเลย tech ที่ใช้เขียนเว็บได้แก่: Svelte, Sapper, Node.js, PostgresSQL, host บน Heroku ส่วน user interface ใช้ <a href="https://sveltematerialui.com/" target="_blank" rel="noopener noreferrer" class="text-primary underline font-bold">Svelte Material UI</a></p>

					<p class="font-bold text-base-content pt-2 text-left">ลูกเล่นที่วางแผนใส่ในเว็บ และใส่เป็นที่เรียบร้อยแล้ว เป็นลำดับตามนี้</p>
					<ol class="list-decimal list-inside space-y-3 pl-2 text-left">
						<li><strong>ตรวจคำตอบบน server</strong> - ตอนแรกว่าจะฝังคำตอบที่เข้ารหัสไว้ใน javascript เลย แต่ด้วยความที่ต้องใช้ server เพื่อทำอย่างอื่นอยู่แล้วเลยตรวจคำตอบบน server ไปเลย ส่วนหนึ่งก็คือกันโกงนั่นแหละ แต่อีกส่วนคือจะได้เก็บข้อมูลอื่น ๆ ได้</li>
						<li><strong>แสดงคำใบ้</strong> - ในด่าน 1 ให้คำใบ้ตรง ๆ เลย แต่ผู้เล่นสามารถเลือกเปิดได้ ส่วนในด่าน 2 เป็นของซูม ไม่แน่ใจว่าตอนแรกวางแผนอะไรไว้ แต่สุดท้ายก็เลือกให้แสดงเมื่อเปิดปริศนา 20 นาที (30 นาทีสำหรับข้อสุดท้าย)</li>
						<li><strong>ตารางอักษร</strong> - ตอนแรกวางแผนใช้ภาพนิ่ง แต่นึกได้ว่าถ้าทำให้ตารางเป็นปุ่มช่วยทดด้วย น่าจะเล่นสะดวกขึ้นมาก ก็เลยออกมาเป็นอย่างที่เห็น ที่จริงซ่าคิดจะใส่ลูกเล่นแพรวพราว เช่น ทดได้ เปลี่ยนสีได้ แต่กลัวจะไม่ได้ทำอย่างอื่นเลยพับไป</li>
						<li><strong>บันทึกคำตอบ</strong> - ผู้เล่นบางคนไม่ได้เล่นต่อเนื่องตั้งแต่ต้นจนจบ เลยเพิ่มลูกเล่นนี้ขึ้นมา จะได้ไม่ต้องขุดคำตอบเก่า ๆ มาตอบใหม่อีกที นอกจากนั้นทำให้สามารถกันไม่ให้ใช้เครื่องเดียวกันส่งคำตอบซ้ำ ๆ หลายครั้ง เพื่อกรอกอีเมลหลีายคนได้ (แต่ถ้า clear cache เป็นก็ทำได้อยู่ดีแหละ...) <br><br> ซึ่งกลายเป็นว่าลูกเล่นสำคัญในด่านที่ 2 เพราะว่าผู้เล่นต้องเดินไปมาระหว่างกระดาน ถ้าต้องทดคำตอบแล้วเดินมาตอบที่กระดานกลางก็จะดูน่าหงุดหงิดมาก เลยเก็บคำตอบไว้ใช่ระหว่างหน้าได้</li>
						<li><strong>ตารางอันดับ</strong> - ตอนแรกไม่ได้คิดถึงขั้นนี้ เพราะรู้ว่าต้องสร้าง database ซึ่งไม่เคยใช้มาก่อนเลย แต่พอคิดขึ้นได้ว่าสุดท้ายต้องเก็บข้อมูลผู้เล่นที่เล่นจบอยู่ดี เลยไปศึกษาและโชคดีที่ทำเสร็จได้ไม่ยากนัก เนื่องจาก heroku มี PostgresSQL เป็น add-on ให้อยู่แล้ว</li>
						<li><strong>เก็บข้อมูลเวลา และจำนวนครั้งที่ตอบผิด</strong> - อธิบายละเอียดด้านล่าง ข้อมูลเหล่านี้จะเป็นประโยชน์มากเวลาออกแบบกิจกรรมปริศนาในภายภาคหน้า ซึ่งส่วนนี้ทำได้ไม่ยากเพราะต้องตรวจคำตอบบน server อยู่แล้ว</li>
						<li><strong>Discord</strong> - ได้ไอเดียมาจาก gph-site ที่แจ้งเตือนใน Discord ทุกครั้งที่มีการส่งคำตอบ เลยลองทำขึ้นมาดูบ้าง เนื่องจากเป็นระบบส่งข้อความอย่างเดียว เลยสามารถใช้ webhook ได้ ไม่ต้องถึงขั้นเขียน bot <br><br>
						ทีแรกก็ว่าจะมาเชคเป็นบางครั้งบางคราว แต่ปรากฏว่าอ่านแล้วสนุก ก็เลยแทบจะเปิดค้างไว้... โดยเฉพาะตอนที่เข้าไปดูคนอื่นเล่นอยู่ ทำให้บางครั้งสามารถเดินเข้าไปบอกคำใบ้ได้เลย (แต่ใจนึงก็กลัวเป็น unsolicited advice ยังไงไม่รู้)<br><br>
						สิ่งนึงที่เพิ่มตอนหลัง ๆ คือ สร้าง alias ให้ทุกคน (เช่น mountain_dew) เวลาอ่านใน Discord จะได้รู้ว่าเป็นคำตอบของใคร โดยไม่ต้องรู้ว่าเป็นใคร</li>
						<li><strong>ให้คำใบ้เวลาคำตอบใกล้เคียง</strong> - ข้อดีของการเล่นบนเว็บคือ สามารถให้คำใบ้ได้ถ้ามาถูกทางแล้วแต่ยังตอบไม่ถูก โดยเฉพาะข้อที่เมื่อแก้ในขั้นแรกแล้วได้วลี ที่ต้องเอาไปทำต่ออีกทีหนึ่ง (ในภาษา puzzle hunt คือ keep going)<br><br>
						สิ่งที่ต่างจาก puzzle hunt ทั่วไปคือ แจ้งให้ผู้เล่นทราบถ้าคำตอบผิดไปเพียง 1 ตัวอักษร ซึ่งในกิจกรรมปริศนาปกติจะไม่ค่อยมีกัน เพราะถ้าผิดแล้วจะผิดแบบไปคนละโลกเลย แต่ด่านที่ 1 มีความแปลกตรงที่ให้หาตำแหน่งของตัวอักษรในตาราง ทำให้บางครั้งผู้เล่นอาจอ่านผิดไปเป็นช่องข้าง ๆ แทน หรือตัวอักษรบางตัวอาจจะยากเกินไป (เช่น มีชู้ = #) ทำให้หาได้ไม่ครบ จึงดูสมเหตสมผลที่จะแจ้งให้ และดีใจที่ผู้เล่นชอบ<br><br>
						จะเห็นว่า ลูกเล่นนี้ใส่ไว้ตอนท้าย ๆ ... ไม่ใช่ว่าไม่สำคัญ แต่เพราะรู้ว่าใช้เวลาไม่นานมาก</li>
						<li><strong>แชร์ลงโซเชียล</strong> - ได้รับแรงบันดาลใจจากปริศนาใน LINE ของค่าย riddler ว่าเวลาเล่นจบแล้วเราอยากแชร์ (=ขิง) ว่าได้อันดับเท่าไหร่ ดีที่มีคนเขียน component ไว้ให้ใช้ได้เลย ไม่ต้องขุด api มาศึกษาเอง (แต่ที่จริงก็อ่านไประดับนึงละ)</li>
						<li><strong>ให้คะแนนปริศนา</strong> - ในเมื่อมี database แล้ว ก็เลยนึกสนุกอยากเก็บข้อมูลให้มากขึ้น เลยใส่ระบบลงคะแนนหลังจากตอบเสร็จแล้ว</li>
					</ol>

					<p class="font-bold text-base-content pt-2 text-left">รายการสิ่งที่อยากทำแต่ไม่ได้ทำ</p>
					<ul class="list-disc list-inside space-y-2 pl-2 text-left">
						<li><strong>Notification</strong> - แจ้งเตือน เตือนอะไร? เตือนให้ทุกคนเห็นว่ามีคนแก้ข้อนี้ได้แล้ว! เนื่องจากใช้ socket.io อยู่แล้วเลยทำได้ไม่ยาก แต่คิดไปคิดมาคนเล่นน่าจะรู้สึกกดดันมากกว่าท้าทาย ก็เลยพับไป เหลือเพียงแค่นับจำนวนคนที่เล่น ณ เวลานั้น</li>
						<li><strong>แก้ snackbar</strong> - หลังจากที่ผู้เล่นส่งคำตอบ จะมีข้อความโผล่ด้านล่างว่าถูกหรือไม่ (snackbar) โดยใช้ของ default บน Svelte Material UI แต่พอใช้จริงก็มีปัญหาว่าโผล่สั้นไป ตัวอักษรเล็กไป หรือไปชนกับ interface ของ gather.town แต่ว่าไม่ได้ย้อนกลับมาทำส่วนนี้ เพราะเท่าที่มีอยู่ก็พอใช้ได้แล้ว รอบหน้าต้องหาทางออกใหม่</li>
						<li><strong>Badge</strong> - เรามี point แล้ว (นับว่าทำเสร็จไปกี่ข้อ) มี leaderboard แล้ว จะครบสามเกลอ PBL ได้ก็ต้องเพิ่ม badge สิ! แต่พอจะนั่งเขียนโค้ดก็เห็นว่าต้องเก็บข้อมูลเยอะมาก และละเอียดมาก (เช่น badge คนที่คลิกตารางครบ 100 ครั้ง) ก็เลยล้มเลิกไป แต่งานหน้าก็อาจซ่าลองทำดู</li>
						<li><strong>ห้องแชท</strong> - ถ้าผู้เล่นที่เล่นพร้อมกันสามารถส่งข้อความหากันได้ทันทีเลย ก็ดูน่าสนุกนะ แต่ต้องกรองแสปม กันสปอยล์ ก็เลยไม่ได้ทำ และในงานจริงก็ค้นพบว่าผู้เล่นส่งข้อความคุยกันใน gather.town กันได้ ก็เลยคิดว่าดีแล้วที่ไม่ไปทำซ้ำซ้อน</li>
						<li><strong>ใส่เสียง</strong> - พยายามมาพักนึง อยากให้มีเสียงกระดิ่งเวลาตอบถูกหรือเสียงออดเวลาตอบผิด เพิ่ม immediate feedback แต่ไม่สำเร็จ ทั้ง ๆ ที่เป็น html ปกติซะด้วยซ้ำ รอบหน้าแก้ตัวใหม่</li>
					</ul>

					<p class="text-left">หลังจากงานนี้เสร็จสิ้นและย้ายหน้าเว็บไปเป็นแบบ static เรียบร้อย และลบรหัสสำคัญ (database, webhook) แล้ว จะลงลิงก์ source code ให้เอาไป fork ต่อได้ตามอัธยาศัย</p>
				</section>

				<!-- Section 4: เวลาที่ใช้ (Interactive Chart with X-Y axes for both stages) -->
				<section id="time" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">เวลาที่ใช้</h2>
					<p class="text-left">เนื่องจากงานนี้จัดเพียง 3 วัน และมีกิจกรรมอื่นในงานให้ร่วมสนุกอีก เลยไม่อยากให้ใช้เวลากับปริศนามากเกินไป จึงได้เก็บข้อมูลว่าผู้เล่นใช้เวลากับปริศนาเท่าไหร่ แต่เป็นการเก็บข้อมูลแบบหยาบ ๆ นั่นคือ จับเวลาเริ่มครั้งเดียวตอนที่เปิดหน้าปริศนาครั้งแรก และนับจนถึงเวลาที่ส่งคำตอบสุดท้ายของด่าน 1 และด่าน 2 จึงมีบางคนที่เปิดวันแรก แต่ได้เริ่มเล่นจริงวันสุดท้าย ทำให้เวลาไม่ตรงกับความเป็นจริง</p>
					<p class="text-left">ฉะนั้นจึงตัดเวลาที่เกิน 10 ชั่วโมงออก และนำเวลาที่เหลือมาเรียงลำดับได้ตามนี้</p>

					<!-- Interactive Time Graph with X-Y axes -->
					<div class="bg-base-200 text-base-content p-4 sm:p-6 rounded-2xl border border-base-300 space-y-4 text-left">
						<div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-3">
							<div class="flex items-center gap-3 text-xs font-bold">
								<button
									class="flex items-center gap-2 px-3 py-1.5 rounded-xl border {showRound1Time ? 'bg-base-200 text-base-content border-secondary text-secondary' : 'bg-base-100 text-base-content border-base-300 text-base-content/70'}"
									on:click={() => (showRound1Time = !showRound1Time)}
								>
									<span class="w-3 h-3 rounded-full bg-purple-400"></span>
									<span>เวลาที่ใช้ในด่าน 1 ({r1TimeList.length} คน)</span>
								</button>
								<button
									class="flex items-center gap-2 px-3 py-1.5 rounded-xl border {showRound2Time ? 'bg-base-200 text-base-content border-primary text-primary' : 'bg-base-100 text-base-content border-base-300 text-base-content/70'}"
									on:click={() => (showRound2Time = !showRound2Time)}
								>
									<span class="w-3 h-3 rounded-full bg-teal-400"></span>
									<span>เวลาที่ใช้ในด่าน 2 ({r2TimeList.length} คน)</span>
								</button>
							</div>
							<span class="text-xs text-base-content/70">เอาเมาส์ชี้บนกราฟเพื่อดูรายละเอียด</span>
						</div>

						<div class="relative w-full overflow-x-auto">
							<svg viewBox="0 0 800 300" class="w-full min-w-[600px] h-auto overflow-visible select-none">
								<!-- Grid Lines & Y Axis -->
								{#each [0, 2, 4, 6, 8, 10] as h}
									{@const y = getChartY(h)}
									<line x1="60" y1={y} x2="760" y2={y} stroke="var(--color-base-300)" stroke-width="1" stroke-dasharray={h === 0 ? '0' : '4 4'} />
									<text x="50" y={y + 4} text-anchor="end" fill="var(--color-base-content)" font-size={11} font-family="DM Sans, Sarabun">{h} ชม.</text>
								{/each}

								<!-- Axis lines -->
								<line x1="60" y1="30" x2="60" y2="250" stroke="var(--color-base-300)" stroke-width="1.5" />
								<line x1="60" y1="250" x2="760" y2="250" stroke="var(--color-base-300)" stroke-width="1.5" />

								<!-- Axis Labels -->
								<text x="60" y="20" text-anchor="start" fill="var(--color-base-content)" font-size={11} font-weight="bold">แกน Y: ชั่วโมง (Hours)</text>
								<text x="60" y="275" text-anchor="start" fill="var(--color-base-content)" font-size={11}>ผู้เล่นที่เร็วสุด (ซ้าย)</text>
								<text x="760" y="275" text-anchor="end" fill="var(--color-base-content)" font-size={11}>ผู้เล่นที่ช้าสุด (ขวา)</text>

								<!-- Round 1 Curve -->
								{#if showRound1Time}
									<polyline fill="none" stroke="var(--color-secondary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points={r1PolylinePoints} />
									{#each r1TimeList as p, i}
										<circle
											cx={getChartX(i, r1TimeList.length)}
											cy={getChartY(p.hours)}
											r={hoveredTimeIndex === i ? 6 : 3}
											fill="var(--color-secondary)"
											stroke="var(--color-base-100)"
											stroke-width="1.5"
											class="cursor-pointer"
											role="button" tabindex="0" aria-label={`Show player ${i + 1} time`} on:mouseenter={() => (hoveredTimeIndex = i)} on:focus={() => (hoveredTimeIndex = i)} on:keydown={(event) => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); hoveredTimeIndex=i; } }}
										/>
									{/each}
								{/if}

								<!-- Round 2 Curve -->
								{#if showRound2Time}
									<polyline fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points={r2PolylinePoints} />
									{#each r2TimeList as p, i}
										<circle
											cx={getChartX(i, r2TimeList.length)}
											cy={getChartY(p.hours)}
											r={hoveredTimeIndex === i ? 6 : 3}
											fill="var(--color-primary)"
											stroke="var(--color-base-100)"
											stroke-width="1.5"
											class="cursor-pointer"
											role="button" tabindex="0" aria-label={`Show player ${i + 1} time`} on:mouseenter={() => (hoveredTimeIndex = i)} on:focus={() => (hoveredTimeIndex = i)} on:keydown={(event) => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); hoveredTimeIndex=i; } }}
										/>
									{/each}
								{/if}

								<!-- Vertical Hover Guide Line -->
								{#if hoveredTimeIndex !== null}
									{@const hoverX = getChartX(hoveredTimeIndex, Math.max(r1TimeList.length, r2TimeList.length))}
									<line x1={hoverX} y1="30" x2={hoverX} y2="250" stroke="var(--color-accent-content)" stroke-width="1" stroke-dasharray="3 3" />
								{/if}
							</svg>
						</div>

						<!-- Interactive Tooltip Display -->
						{#if hoveredTimeIndex !== null}
							{@const p1 = r1TimeList[hoveredTimeIndex]}
							{@const p2 = r2TimeList[hoveredTimeIndex]}
							<div class="bg-base-100 text-base-content border border-base-300 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-left">
								<div class="font-bold text-base-content">
									อันดับตามลำดับเวลา: <span class="text-accent-content font-mono">#{hoveredTimeIndex + 1}</span>
								</div>
								<div class="flex flex-wrap gap-4 text-left">
									{#if p1}
										<div class="flex items-center gap-2 text-secondary">
											<span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
											<span>ด่าน 1: <strong>{p1.name}</strong> ({p1.hours.toFixed(2)} ชม. / {formatDurationMs(p1.timetotal)})</span>
										</div>
									{/if}
									{#if p2}
										<div class="flex items-center gap-2 text-primary">
											<span class="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
											<span>ด่าน 2: <strong>{p2.name}</strong> ({p2.hours.toFixed(2)} ชม. / {formatDurationMs(p2.timetotal)})</span>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>

					<p class="text-left">ครึ่งนึงของผู้เล่นจบด่านที่ 1 ได้ใน 2 ชั่วโมง นานกว่าที่คิดไว้มากกกกกกกก เพราะมี 6 ข้อ แต่ต้องเดินรอบแผนที่ด้วย ก็เลยบอกไม่ได้ว่านานที่ปริศนาเอง หรือนานเพราะหาคำใบ้</p>
					<p class="text-left">และจบด่านที่ 2 ใน 4 ชั่วโมง ถ้าหักด่านแรกก็เหลือ 2 ชั่วโมง ก็คือพอ ๆ กัน (แต่ไม่ต้องเดินรอบแผนที่แล้ว)</p>
					<p class="text-left">โดยรวมนับว่าสนุกสำหรับคนที่ชอบเล่นอยู่แล้ว นั่นคือ 11 ข้อ ข้อละ 20 นาทีแต่ก็นานเกินไปมากโขถ้าเป้าหมายการออกแบบคือบุคคลทั่วไป</p>
					<p class="text-left">แต่ก็จะเห็นได้ว่า มีผู้เล่นจำนวนหนึ่งที่ใช้เวลาถึง 3 ชั่วโมงในด่านที่ 1 และ 6 ชั่วในด่านที่ 2 ส่วนผู้เล่นที่ใช้เวลาถึง 8 ชั่วโมง มีถึง 7 คน ก็ไม่น่าจะใช่เรื่องบังเอิญที่จะเป็นกลุ่มที่ไม่ได้เล่นต่อเนื่องทั้งหมด</p>
				</section>

				<!-- Section 5: จำนวนครั้งที่ตอบผิด -->
				<section id="guesses" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">จำนวนครั้งที่ตอบผิด</h2>
					<p class="text-left">ก่อนจะถึงเป้าหมายก็ต้องมีการล้มลุกคลุกคลานกันบ้าง เลยรวบรวมว่าข้อไหนที่มีคนตอบผิดเยอะสุด โดยวัดจากอัตราส่วนคำตอบที่ผิด และคำตอบที่ถูก</p>

					<!-- Guesses Ratio Card -->
					<div class="bg-base-200 text-base-content p-6 rounded-2xl border border-base-300 space-y-3 text-left">
						<h4 class="font-bold text-xs text-rose-400 uppercase tracking-wider text-left">อัตราส่วนของจำนวนครั้งที่ตอบผิดกับจำนวนที่ตอบถูก</h4>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
							{#each answerLogsData as item}
								{@const ratio = (parseInt(item.incorrect, 10) / parseInt(item.correct, 10)).toFixed(1)}
								{@const label = item.round === '0' ? `1-${item.id === '5' ? 'Final' : parseInt(item.id, 10) + 1}` : `2-${item.id === '4' ? 'Final' : parseInt(item.id, 10) + 1}`}
								<div class="flex items-center gap-3 text-xs text-left">
									<span class="font-mono w-14 text-base-content/70 font-bold">{label}</span>
									<div class="flex-1 bg-base-100 text-base-content rounded-full h-3.5 overflow-hidden p-0.5 border border-base-300">
										<div class="bg-primary h-full rounded-full" style="width: {Math.min(parseFloat(ratio) * 6, 100)}%"></div>
									</div>
									<span class="w-12 text-right font-mono font-bold text-error-content">{ratio}x</span>
								</div>
							{/each}
						</div>
					</div>

					<p class="text-left">เช่น ในข้อ 1-1 (ปลา) โดยเฉลี่ยแล้วผู้เล่นจะตอบผิด 2 ครั้ง ก่อนจะตอบถูก 1 ครั้ง ส่วนข้อ 2-2 (วงกลม) ผู้เล่นจะตอบผิด 15 ครั้งก่อนจะเจอคำตอบที่ถูก (!!!) ซึ่งนับว่าเยอะมาก</p>
					<p class="text-left">ข้อที่มีคนตอบผิดบ่อยเป็นอันดับ 1 คือ ข้อ 2-2 (Puzzle B) เพราะข้อมูลกระจายหลายจุด เวลาตอบเลยต้องค่อย ๆ ตอบเท่าที่หาได้ แล้วเพิ่มไปเรื่อย ๆ</p>
					<p class="text-left">ข้อที่มีคนตอบผิดมากเป็นอันดับ 2 คือ ข้อ 1-5 (ดาบ) เพราะผู้เล่นมองไม่ออกว่าดาบห่างจากช่องที่ยืนอยู่กี่ช่อง</p>
				</section>

				<!-- Section 6: คะแนนโหวต -->
				<section id="rates" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">คะแนนโหวต</h2>
					<p class="text-left">ลูกเล่นนึงคือ การให้คนเล่นลงคะแนนหลังจากแก้ปริศนาเสร็จ เพื่อจะได้รับ feedback ทันที โดยมีข้อมูลสรุปดังนี้</p>

					<!-- Ratings Chart Card -->
					<div class="bg-base-200 text-base-content p-6 rounded-2xl border border-base-300 space-y-3 text-left">
						<div class="flex items-center justify-between text-xs font-bold text-base-content/70 pb-2 border-b border-base-300">
							<span class="text-success-content">ความสนุก (Fun)</span>
							<span class="text-secondary">ความยาก (Difficulty)</span>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
							{#each answerLogsData.slice(0, 10) as item}
								{@const fun = (parseInt(item.fun, 10) / parseInt(item.num, 10)).toFixed(1)}
								{@const diff = (parseInt(item.difficulty, 10) / parseInt(item.num, 10)).toFixed(1)}
								{@const label = item.round === '0' ? `1-${item.id === '5' ? 'Final' : parseInt(item.id, 10) + 1}` : `2-${item.id === '4' ? 'Final' : parseInt(item.id, 10) + 1}`}
								<div class="flex flex-col gap-1 text-xs text-left">
									<div class="flex justify-between text-base-content/70 font-bold">
										<span>ข้อ {label}</span>
										<span>สนุก: <strong class="text-success-content">{fun}</strong> | ยาก: <strong class="text-secondary">{diff}</strong></span>
									</div>
									<div class="flex gap-2">
										<div class="flex-1 bg-base-100 text-base-content rounded-full h-2 overflow-hidden border border-base-300">
											<div class="bg-emerald-400 h-full rounded-full" style="width: {(parseFloat(fun) / 5) * 100}%"></div>
										</div>
										<div class="flex-1 bg-base-100 text-base-content rounded-full h-2 overflow-hidden border border-base-300">
											<div class="bg-purple-400 h-full rounded-full" style="width: {(parseFloat(diff) / 5) * 100}%"></div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<p class="text-xs text-base-content/70 italic text-left">หมายเหตุ - เอ๊ะ ข้อสุดท้ายหายไปไหนนะ? อ้อ ถ้าตอบข้อสุดท้ายถูกแล้วจะเปลี่ยนไปหน้ากรอกข้อมูลทันที เลยไม่มีคนลงกลับมาลงคะแนนให้...</p>
					<p class="text-left">คะแนนความสนุกไม่ห่างกันเลย อยู่ 3.5 - 4.5 อันนี้ไม่รู้เหมือนกันว่าทำไมเกาะกลุ่มกัน เพราะโจทย์คล้าย ๆ กัน เพราะความสนุกกะยาก หรือเพราะไม่กล้าโหวตว่าไม่สนุกกันนะ</p>
					<p class="text-left">ข้อที่สนุกสุด กลับเป็น 2-3 (จราจร) ที่ไม่ได้มีอะไรซ่อนไว้เบื้องหลัง</p>
				</section>

				<!-- Section 7: ความเห็น -->
				<section id="comments" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">ความเห็น</h2>
					<p class="text-left">หลังจากที่เล่นจบด่าน 2 แล้ว ได้เปิดโอกาสให้ผู้ชนะได้ส่งความเห็นสั้น ๆ มา ซึ่งรวบรวมได้ดังนี้</p>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 text-left">
						{#each statsComments as comment}
							<div class="bg-base-200 text-base-content/90 p-3.5 rounded-xl border border-base-300 text-xs text-base-content text-left">
								"{comment}"
							</div>
						{/each}
					</div>
				</section>

				<!-- Section 8: ประเมินตัวเอง -->
				<section id="reflection" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">ประเมินตัวเอง</h2>

					<h3 class="text-xl font-bold text-primary pt-2 text-left">ด้านของปริศนา</h3>
					<p class="text-left">ปริศนาด่านที่ 2 ซูมเป็นคนเขียน โดยได้ไป playtest และแก้บ้าง จึงละไว้ (เว้นแต่ว่าซูมจะเขียนเพิ่ม ก็จะเอามาไว้ตรงนี้) แต่ที่พอจะคอมเมนท์ได้คือ มีการสื่อสารผิดพลาด ในตอนแรกเข้าใจว่าฝั่ง TBS จะทำกราฟฟิคให้ใหม่ แต่สุดท้ายก็ใช้ภาพที่ร่างไว้ ก็เลยเป็นภาพพื้นหลังสีขาวธรรมดา ๆ</p>
					<p class="text-left">ส่วนปริศนาด่านที่ 1 นับว่าทำออกมาได้เป็นที่น่าพอใจตามโจทย์ที่ได้รับมา คือให้เดินทั่วงานเพื่อหาคำใบ้ อย่างคำใบ้ข้อปลาบางจุดที่ถึงกับต้องเดินเข้าไปในบูธถึงจะเห็น และได้ใช้ลูกเล่นของ gather.town พอสมควร (prompt message, blank object)</p>
					<p class="text-left">ที่จริงแล้ว มีเป้าหมายการออกแบบอีกอย่าง คือออกแบบ pure puzzle ที่ใช้แค่คำใบ้ก็หาคำตอบได้ ในการทดสอบตอนแรก (2 คน) คนทดสอบทำได้แม้จะไม่บอกอะไรเลย นอกจากว่าใช้ตาราง 5x5 แต่สำหรับคนทั่วไปก็ท้าทายเกิน อย่างข้อปลา (1-1) ในตอนแรกกะให้หาปลา แล้วสังเกตว่าจำนวนช่องรวมกันได้ 25 ช่อง เต็มตารางพอดี และมีวิธีวางให้ลงทุกช่อง แต่คนทดสอบนึกไม่ถึง สุดท้ายเลยต้องเขียนเป็นคำสั่งว่าให้เอากลุ่มปลามาวางเหมือน tetris ก็เลยต้องล้มพับเป้าหมายนี้ไป</p>
					<p class="text-left">แล้วทำไมถึงไม่เอาคำอธิบายใส่ในแผนที่เลยหละ? เพราะมันจะรกมาก ยิ่งต้องเดินไปมาหาข้อมูล แล้วเดินกลับมาอ่านคำอธิบายอีก ซึ่งถ้าข้อมูลเยอะไปสุดท้ายผู้เล่นก็ต้องจดลงกระดาษอยู่ดี และอาจสงสัย (พลางสาปแช่ง) ว่า แล้วทำไมไม่เขียนออกมาให้เลยในหน้ากระดาษเดียว ก็เลยสรุปได้ออกมาเป็นผลลัพธ์อย่างที่เห็น</p>

					<p class="font-bold text-base-content pt-2 text-left">ส่วนที่เปลี่ยน หลังจาก draft แรก</p>
					<ul class="list-disc list-inside space-y-3 pl-2 text-left">
						<li><strong>เปลี่ยนคำตอบ</strong> - ในตอนแรกใช้คำว่า READ UNDER LETTERS USED TWICE ซึ่งก็ตรงไปตรงมา แต่พบว่าต้องมาหาต่อว่าข้อไหนใช้กี่ตัวอักษร และต้องบอกใบ้ในแผนที่ว่าเป็นคำใบ้ที่เท่าไหร่ ผู้เล่นจะได้รู้ว่าหาครบหรือยัง ทำให้นึกขึ้นได้ว่าที่จริงแล้วก็ทำให้เป็น 5 ตัวอักษรให้หมดเลย จะได้จำง่าย โชคดีที่ปรับคำตอบข้ออื่นได้ไม่ยากมาก เช่น จาก READ เป็น READS จาก LETTERS เป็น CELLS จาก USED เป็น TAKEN แต่ก็ต้องเพิ่มคำแปลให้ จะได้ไม่สับสนเกินไป ส่วนคำตอบสุดท้ายยังเหมือนเดิม<br><br>
						ถามว่าทำไมต้องอ่านข้างล่าง ไม่อ่านในช่องไปเลย? เหตุผลหนึ่งคือจะได้เป็นการบังคับทางอ้อมให้แก้ปริศนาครบ 5 ข้อ เพราะถ้าขาด 1 ข้อ จะขาดตัวอักษร 2 ตัวเลย ทำให้เดายากขึ้น อีกเหตุผลนึงคือ จะได้ขยายให้เป็นคำสั่งที่มี 5 คำ ถ้าเป็นแค่ READS CELLS TAKEN TWICE มันจะขาดไปคำนึง ก็ต้องเพิ่มคำสร้อยไป อย่าง THEN, ONLY, WHICH</li>
						<li>เรียงตำแหน่งให้อ่านจากบนลงล่าง หรือซ้ายไปขวา อย่างใดอย่างหนึ่ง ทำให้ไม่ต้องใบ้ในแผนที่ว่าข้อมูลนี้เป็นตัวอักษรที่เท่าไหร่ เพราะถ้าหาข้อมูลครบแล้วคำตอบจะอ่านได้ชัด</li>
						<li>ทว่าการปรับให้เล่นง่ายขึ้น ก็ต้องแลกมาด้วยการสร้างตารางใหม่หมด และแก้ปริศนาหลายข้อ อย่างข้อ 1-3 (ใบเฟิร์น) ต้องใช้ตัวอักษรในตารางมาสร้างคำใบ้ แม้จะมีเงื่อนไขเต็มไปหมด แต่ก็โชคดีที่สร้างตารางได้แถมใช้เวลาไม่นานนัก แต่กลับมีผลข้างเคียงที่ไม่ตั้งใจคือ ตัวอักษรเดียวกันซ้อนบนล่างกันหลายคู่ ไม่รู้ว่ามาอย่างไรเหมือนกัน</li>
						<li><strong>ข้อปลา (1-1)</strong> - จากที่ต้องมาเรียงตัวอักษรเอาเองโดยดูจากขนาดของตัวต่อ (3,4,5,6,7) ให้เป็นการอ่านเรียงจากบนลงล่าง แต่ก็ยังคงออกแบบให้อ่านเรียงจากขนาดได้เช่นเก่า</li>
						<li><strong>ข้อ minesweeper (1-2)</strong>- ตอนแรกทำเป็นเขาวงกต แต่พอไม่ได้มี role ใน gather.town เลยสร้างไม่ได้ จึงเปลี่ยนมาเป็น logic puzzle ที่คนส่วนใหญ่รู้จัก โดยยังคงวิธีหาข้อมูลเหมือนเดิม คือการเดินไปบนช่องเปล่า ๆ แล้วมีข้อมูลโผล่ขึ้นมา</li>
						<li><strong>ข้อใบเฟิร์น (1-3)</strong> - ให้อ่านจากปลายหนึ่งไปอีกปลายหนึ่ง ตอนแรกผู้เล่นต้องเอาใบเฟิร์นไปไล่ทาบในตารางจนเจอตัวอักษรที่ตรง แต่ผู้ทดสอบบอกว่าสับสนไป และอีกอย่างคือปรับให้ตัวอักษรที่ใช้ตอบอยู่ในคำเลย เพราะในตอนแรกต้องหยิบตัวอักษรอื่นที่วางตรงกับตำแหน่งของไฟที่ติดกับใบเฟิร์น</li>
						<li><strong>ข้อดาบ (1-4)</strong> - ปรับจากที่ต้องเอาตัวอักษรมาเรียงใหม่ตามเลข (เช่น 1/7 หมายถึงเป็นตัวอักษรแรก) เป็นอ่านจากบนลงล่าง โดยยังเก็บตัวเลขที่บอกลำดับไว้เหมือนเดิม ส่วนวิธีหาข้อมูลและวิธีอ่านตำแหน่งยังคงเหมือนเดิม</li>
						<li><strong>ข้อวิทยุ (1-5)</strong> - ตอนแรกเขียนคำใบ้เป็น
							<ol class="list-decimal list-inside pl-4 my-2 space-y-1 text-left">
								<li>ชี้เมาอีโทวันอังคาร</li>
								<li>นางโกหกโอเอกวันพฤหัส</li>
								<li>กลางกิ๊กเอจัตวาวันศุกร์</li>
								<li>ก้อยฆ่าไอสามัญวันจันทร์</li>
								<li>#####</li>
							</ol>
							ผู้เล่นต้องคิดต่อว่า 1) ประโยคแต่ละประโยคแยกออกมาได้เป็น 5 คำ 2) เป้าหมายคือต้องหาคำตอบที่หายไป 3) เวลาอ่านให้อ่านเป็นแถวแนวนอน แต่ตอน playtest ต้องอธิบายอยู่ดีว่าทำอะไร สุดท้ายเลยปรับเป็นแบบที่เห็นในงานคือบอกเลยว่า "แถวที่ 1 - มีชู้ = #" และบอกหมวดหมู่เลยว่าเป็นหมวดอะไร เช่น นิ้ว วัน สระภาษาอังกฤษ เสียงวรรณยุกต์ แต่ก็ดันลืมบอกแถวแรกว่าเป็นศีล ก็เลยทำให้สับสนกัน (ซึ่งกลายเป็นว่าคนส่วนใหญ่คิดไปว่า การมีชู้คือมี 3 คน ทำให้ได้เลขที่ถูกโดยไม่ตั้งใจ)
						</li>
					</ul>

					<div class="flex justify-center p-4 bg-base-200 text-base-content rounded-2xl border border-base-300 my-4">
						<img src="/puzzles/tbs2021/solution round 1.png" alt="solution round 1" class="rounded-xl max-w-full shadow-lg" />
					</div>

					<h3 class="text-xl font-bold text-primary pt-2 text-left">ด้านการเขียนเว็บ</h3>
					<p class="text-left">นับว่าประสบความสำเร็จ เพราะไม่ได้มีเป้าหมายจะมาไกลขนาดนี้ในทีแรก ตอนแรกก็กลัวว่าถ้า server มีปัญหาที่หาวิธีแก้ไม่ได้แล้วจะหายนะ แต่ก็ไม่ได้เกิดปัญหาใหญ่มาก ก็จะมี server ล่มสองครั้ง ซึ่งพอ restart ก็กลับมาเป็นปกติ ถ้าในอนาคตต้องทำโปรเจคใหญ่กว่านี้ มีคนเล่นพร้อมกันหลักพัน (!?!) (ในงานนี้ มีเล่นพร้อมกันสูงสุด 80 คน) ต้องหา solution ที่ดีกว่านี้ อาจจะต้องจ้างคนมาทำจริงจังเลย และอาจต้องจ่ายเงินค่า domain name, host, database, etc.</p>

					<h3 class="text-xl font-bold text-primary pt-2 text-left">ด้านผลตอบรับของผู้เล่น</h3>
					<p class="text-left">ผู้จัดงานถึงกับบอกว่าปริศนาเป็นตัวชูโรงของงานเลย (!!!)</p>

					<h3 class="text-xl font-bold text-primary pt-2 text-left">รอบหน้าอยากเพิ่มอะไร</h3>
					<ul class="list-disc list-inside space-y-1 pl-2 text-left">
						<li>อยากใส่โจทย์ที่ต้องเล่นบนเว็บ (เช่น <a href="https://2020.galacticpuzzlehunt.com/puzzle/so-you-think-you-can-spell#right" target="_blank" rel="noopener noreferrer" class="text-primary underline font-bold">GPH Spell Puzzle</a>) อาจจะเป็นอักษรไขว้ธรรมดาก็ได้</li>
						<li>อยากใส่โจทย์ความรู้ทั่วไป (trivia) ที่เกี่ยวกับบอร์ดเกม เป็นส่วนหนึ่งของปริศนา</li>
					</ul>
				</section>

				<!-- Section 9: ขอบคุณ -->
				<section id="thanks" class="scroll-mt-24 space-y-3 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">ขอบคุณ</h2>
					<ul class="list-disc list-inside space-y-2 pl-2 text-left">
						<li>ขอบคุณพี่มิลค์ ผู้จัดงาน Thailand Board Game Show ที่ให้ Code Breaker ได้เป็นส่วนร่วมงานครั้งนี้</li>
						<li>ขอบคุณอิมและธนะ ที่เป็นผู้ทดสอบ draft แรกสุด</li>
						<li>ขอบคุณผู้เล่นกลุ่มแรก ๆ ที่ให้ feedback เรื่องความยากของปริศนา ทำให้สามารถนำไปใช้เพื่อปรับหรือเพิ่มคำใบ้ได้ทันที่ และทำให้คนอื่นที่มาเล่นทีหลังได้เล่นสนุกขึ้น</li>
						<li>ขอบคุณข้อติชม ทั้งจากแบบสอบถามบนเว็บ จากข้อความใน chat บน gather.town และจากการที่ได้พูดคุยโดยตรงใน gather.town เลย ้โดยเฉพาะ <a href="https://www.twitch.tv/beaver41" target="_blank" rel="noopener noreferrer" class="text-primary underline font-bold">Twitch beaver41</a> ที่อัดไลฟ์ระหว่างไข เลยกลับมาดูย้อนหลังได้ว่าติดตรงไหน</li>
					</ul>
				</section>

				<!-- Section 10: เก็บตก -->
				<section id="backstage" class="scroll-mt-24 space-y-4 text-left">
					<h2 class="text-2xl sm:text-3xl font-black text-base-content border-b border-base-300 pb-2 text-left">เก็บตก</h2>
					<ul class="list-disc list-inside space-y-4 pl-2 text-left">
						<li>
							<span>ข้อ 2-3 (จราจร) แทบจะทุกคนจะตอบ CDREAKW ก่อน (คือใส่ครบ 7 ตัว) แล้วตามด้วย CDRAW เพราะคิดว่า 1 เป็นจำนวนเฉพาะ ซึ่งก็ปกติ แต่มีผู้เล่นคนนึงที่คิดว่า 2 ไม่ใช่จำนวนเฉพาะ เลยตอบโดยไม่มีตัว D ทำให้งมอยู่นานมาก</span>
							<div class="mt-2 pl-4">
								<img src="/puzzles/tbs2021/extra even prime.png" alt="spam answer" class="rounded-xl max-w-sm border border-base-300 shadow-md" />
							</div>
						</li>
						<li>
							<span>ในตอนเปิดงาน มีคนเขียน script ส่งคำตอบเป็นตัวอักษร 5 ตัวทั้งหมดที่เป็นไปได้! ถ้าจะไล่คำ 5 ตัวอักษรทั้งหมด จะได้ 26x26x26x26x26 กรณี แต่ด้วยเงื่อนไขที่เพิ่มขึ้นมาว่าต้องอ่านบนลงล่างหรือซ้ายไปขวาได้ เลยเหลือเพียง 2x(5x5x5x5x5) = 6250 กรณี ถ้าส่งคำตอบวินาทีละ 10 ครั้งก็จะใช้เวลาเพียง 10 นาทีก็จะไล่จนครบ</span>
							<div class="mt-2 pl-4">
								<img src="/puzzles/tbs2021/extra spam.png" alt="spam answer" class="rounded-xl max-w-sm border border-base-300 shadow-md" />
							</div>
							<span class="block mt-2">แต่ยังดีที่ server ยังไม่ล่ม และใช้ script แค่ 2 ข้อจาก 5 ข้อ เลยไม่ได้ส่งผลกระทบอะไรต่อคนอื่น เสียดายอย่างคือพอได้คำตอบเสร็จก็ไม่ได้เล่นต่อ .... หรือเปลี่ยนเครื่องก็ไม่รู้เหมือนกัน</span>
						</li>
						<li>
							<span>มีคนตั้งสมมติฐานว่า ถ้าเปิดประตูโดยใช้รหัสว่า ENTER ก็น่าจะแก้ปริศนาชิงรางวัลว่า PRIZE นะ (!!!) ไม่แน่ใจว่าสุดท้ายได้ลองจริงมั้ย</span>
						</li>
						<li>
							<span>มีคนแอบมาเล่นตอนตี 5 ด้วย! ที่ตลกคือ alias เป็นคำว่า restless night พอดี</span>
							<div class="mt-2 pl-4">
								<img src="/puzzles/tbs2021/extra restless.png" alt="spam answer" class="rounded-xl max-w-md border border-base-300 shadow-md" />
							</div>
						</li>
					</ul>
				</section>
			</div>
		</div>
<style>section[id] { scroll-margin-top:90px; } img { height:auto; max-width:100%; } section { min-width:0; max-width:100%; overflow-wrap:anywhere; }</style>
