


(()=>{
"use strict";
const KEY="past-communication-puzzle-v1";
const DAYS={"-1":{date:"2026年9月6日",name:"0日目"},"0":{date:"2026年9月7日",name:"1日目"},"1":{date:"2026年9月8日",name:"2日目"}};
const $=id=>document.getElementById(id);
const fresh=()=>({version:1,day:0,learned:false,stage:1,letters:{"-1":"","0":"","1":""},connectedShown:false,complete:false,completeShown:false});
function read(){
  const nav=performance.getEntriesByType("navigation")[0];
  if(!nav||nav.type!=="reload")return fresh();
  try{const old=JSON.parse(sessionStorage.getItem(KEY)||"null");return old&&old.version===1?old:fresh()}catch{return fresh()}
}
let state=read();
const navigation=performance.getEntriesByType("navigation")[0];
const pastLimit=!!(navigation&&navigation.type==="reload"&&state.learned&&state.day===-1);
const returningToPast=!!(navigation&&navigation.type==="reload"&&state.learned&&!state.complete&&state.day>-1);
if(returningToPast)state.day--;
if(state.stage===1)state.letters["-1"]="";
const content=$("content"),slots=$("slots"),input=$("letter"),error=$("error"),terminal=$("terminal");
let dialogTimer;
const VISITOR_KEY="past-communication-visitor-v1",CLEAR_KEY="past-communication-cleared-v1";
let soundContext;
function getSoundContext(){
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  if(!AudioEngine)return null;
  if(!soundContext)soundContext=new AudioEngine();
  return soundContext;
}
function prepareSound(){
  const context=getSoundContext();
  if(context&&context.state==="suspended")context.resume().catch(()=>{});
}
document.addEventListener("pointerdown",prepareSound,true);
document.addEventListener("keydown",prepareSound,true);
function playSound(kind){
  const context=getSoundContext();
  if(!context)return;
  const play=()=>{
    if(context.state!=="running")return;
    const start=context.currentTime+.006;
    const tone=(from,to,delay,duration,type="sine",volume=.025)=>{
      const oscillator=context.createOscillator(),gain=context.createGain(),at=start+delay;
      oscillator.type=type;oscillator.frequency.setValueAtTime(from,at);oscillator.frequency.exponentialRampToValueAtTime(to,at+duration);
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
      oscillator.connect(gain).connect(context.destination);oscillator.start(at);oscillator.stop(at+duration+.02);
    };
    if(kind==="popup"){
      tone(620,660,0,.12,"sine",.026);tone(780,830,.085,.13,"sine",.024);tone(940,990,.17,.18,"sine",.022);
    }else if(kind==="error"){
      tone(175,125,0,.13,"square",.022);tone(155,110,.165,.13,"square",.018);
    }
  };
  if(context.state==="running")play();
  else context.resume().then(play).catch(()=>{});
}
function visitorId(){
  try{
    let id=localStorage.getItem(VISITOR_KEY);
    if(!id){id=crypto.randomUUID();localStorage.setItem(VISITOR_KEY,id)}
    return id;
  }catch{
    try{
      let id=sessionStorage.getItem(VISITOR_KEY);
      if(!id){id=crypto.randomUUID();sessionStorage.setItem(VISITOR_KEY,id)}
      return id;
    }catch{return null}
  }
}
const visitor=visitorId();
async function statsRequest(action){
  if(location.protocol==="file:")throw new Error("unavailable");
  const options={cache:"no-store"};
  if(action!=="read"){
    if(!visitor)throw new Error("unavailable");
    options.method="POST";options.headers={"Content-Type":"application/json"};
    options.body=JSON.stringify({action,visitorId:visitor});
  }
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),6000);
  try{
    const response=await fetch("stats.php",{...options,signal:controller.signal});
    if(!response.ok)throw new Error("unavailable");
    const data=await response.json();
    if(!Number.isInteger(data.plays)||!Number.isInteger(data.clears))throw new Error("unavailable");
    return data;
  }finally{clearTimeout(timeout)}
}
let statsPending=Promise.resolve();
function count(action){statsPending=statsPending.then(()=>statsRequest(action)).catch(()=>null)}
async function showRecords(){
  openDialog("records");$("plays").textContent=$("clears").textContent="—";$("statsStatus").textContent="読み込み中…";
  try{
    await statsPending;const data=await statsRequest("read");
    $("plays").textContent=data.plays;$("clears").textContent=data.clears;$("statsStatus").textContent="";
  }catch{$("statsStatus").textContent="集計に接続できません。PHP対応サーバーでご確認ください。"}
}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function openDialog(id){const d=$(id);if(!d.open){d.showModal?d.showModal():d.setAttribute("open","");playSound("popup")}}
function closeDialog(id){const d=$(id);if(d.close)d.close();else d.removeAttribute("open")}
function key(day){return String(day)}
function record(day){return state.letters[key(day)]||""}
function firstSolved(){return record(0)==="か"&&record(1)==="こ"}
function secondSolved(){return record(-1)==="み"&&record(0)==="ら"&&record(1)==="い"}
function notice(){
  if(state.day===-1){
    return '<div class="notice"><p>文字を送ってください。</p></div>';
  }
  if(state.day===0){
    const base='<p><strong>時間交信実験</strong><br>一日に送れる文字は、ひとつだけ。必要な言葉は「<span class="red">みらい</span>」で分かる。</p>';
    return `<div class="notice">${base}</div>`;
  }
  if(state.stage===1)return '<div class="notice"><p>通信に必要な言葉は「<span class="red">かこ</span>」。外の世界でこうしんを図り文字を送ってください。</p></div>';
  return '<div class="notice success-line"><p><strong>第二通信を受信しました。</strong></p><p>外の世界でこうしんを図り過去から文字を送ってください。</p></div>';
}
function drawSlots(){
  const days=[-1,0,1].filter(day=>day<=state.day&&record(day));
  slots.innerHTML=days.map(day=>`<div class="slot${state.day===day?" current":""}"><small>${DAYS[key(day)].name}</small><strong>${record(day)}</strong></div>`).join("");
}
function render(){
  clearTimeout(dialogTimer);
  const info=DAYS[key(state.day)];
  $("date").textContent=info.date;$("dayName").textContent=info.name;
  $("next").classList.toggle("at-limit",state.day>=1);
  content.innerHTML=notice();drawSlots();
  input.value=record(state.day);error.textContent="";
  save();
  if(state.stage===2&&!state.connectedShown){state.connectedShown=true;save();dialogTimer=setTimeout(()=>openDialog("connected"),180)}
  if(state.complete&&!state.completeShown){state.completeShown=true;save();dialogTimer=setTimeout(()=>openDialog("complete"),180)}
}
function invalid(){error.textContent="ひらがなを一文字だけ入力してください";playSound("error");terminal.classList.remove("shake");void terminal.offsetWidth;terminal.classList.add("shake")}
function send(){
  if(state.day===-1&&state.stage===1){error.textContent="まだ未来からの信号がない";playSound("error");return}
  const value=input.value.trim();
  if(!/^[ぁ-ん]$/.test(value)){invalid();return}
  state.letters[key(state.day)]=value;
  if(state.stage===1&&firstSolved()){state.stage=2;state.connectedShown=false}
  else if(state.stage===2&&secondSolved()&&!state.complete){
    state.complete=true;state.completeShown=false;
    try{localStorage.setItem(CLEAR_KEY,"1")}catch{}
    count("clear");
  }
  save();render();
}
$("sender").addEventListener("submit",e=>{e.preventDefault();send()});
$("next").onclick=()=>{
  if(state.day>=1){error.textContent="これ以上の未来へは進めない";playSound("error");return}
  state.day++;if(state.day===1)state.learned=true;save();render();
};
let resetTaps=0,lastReset=0;
$("reset").onclick=()=>{
  const now=Date.now();resetTaps=now-lastReset<=4000?resetTaps+1:1;lastReset=now;
  if(resetTaps===8){resetTaps=0;showRecords();return}
  clearTimeout(dialogTimer);
  ["connected","complete","records"].forEach(closeDialog);
  state=fresh();save();render();
};
$("closeRecords").onclick=()=>closeDialog("records");
$("continue").onclick=()=>closeDialog("connected");
$("closeComplete").onclick=()=>closeDialog("complete");
$("shareX").onclick=()=>{
  const message='WEB謎「CONNECT」を解きました！\n\nhttps://sajiqook.jp/game/tconnect\n\n#CONNECT\n\nhttps://x.com/saji_qook/status/2096735237917257782?s=20';
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
};
$("connected").addEventListener("cancel",e=>e.preventDefault());
$("complete").addEventListener("cancel",e=>e.preventDefault());
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("dragstart",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  if(k==="f12"||((e.ctrlKey||e.metaKey)&&k==="u")||((e.ctrlKey||e.metaKey)&&(e.shiftKey||e.altKey)&&["i","j","c","u"].includes(k))){e.preventDefault();e.stopPropagation()}
},true);
function timeGlitch(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const app=document.querySelector("main.app"),rect=app.getBoundingClientRect();
  const overlay=document.createElement("div");overlay.id="timeGlitch";overlay.setAttribute("aria-hidden","true");overlay.inert=true;
  const targets=[...app.querySelectorAll("h1,.terminal-head,.date,.notice p,.sender,.log-title,.slot")];
  const positions=targets.flatMap((node,index)=>{
    const r=node.getBoundingClientRect();
    return [{y:r.top+r.height*.52,h:3+index%4},{y:r.top+r.height*.76,h:2+index%3}];
  }).filter(p=>p.y>=rect.top&&p.y+p.h<=Math.min(rect.bottom,innerHeight));
  positions.slice(0,18).forEach((p,index)=>{
    const band=document.createElement("div");band.className="glitch-band";
    const shift=(index%2?-1:1)*(5+(index%4)*3);
    band.style.cssText=`left:${rect.left}px;top:${p.y}px;width:${rect.width}px;height:${p.h}px;--shift:${shift}px;--delay:${index%4*17}ms`;
    const copy=app.cloneNode(true);
    copy.querySelectorAll("[id]").forEach(node=>node.removeAttribute("id"));
    copy.querySelectorAll("input").forEach(node=>{node.value=input.value;node.removeAttribute("name")});
    copy.style.cssText=`left:0;top:${rect.top-p.y}px;width:${rect.width}px;height:${rect.height}px`;
    band.appendChild(copy);overlay.appendChild(band);
  });
  document.body.appendChild(overlay);
  function finish(){overlay.remove();window.removeEventListener("resize",finish);window.removeEventListener("pagehide",finish)}
  window.addEventListener("resize",finish);window.addEventListener("pagehide",finish);
  setTimeout(finish,850);
}
save();render();if(returningToPast)requestAnimationFrame(timeGlitch);
if(pastLimit){error.textContent="これ以上の過去へは戻れない";playSound("error")}
count("visit");
try{if(localStorage.getItem(CLEAR_KEY)==="1"||state.complete)count("clear")}catch{if(state.complete)count("clear")}
})();

