


    (()=>{
      "use strict";
      const unpack=e=>new TextDecoder().decode(Uint8Array.from(atob(e),c=>c.charCodeAt(0)));
      const TOKENS=[["44GE44Gh",2],["44Gr",1],["44GV44KT",2],["44GX",1],["44GU",1]].map(([e,d])=>({text:unpack(e),dots:d}));
      const LABELS={
        "69cf02b8bcdf8e44517af6faf3c5683bf43e51d96a7caa3387d4c327502fa1d3":"5LiD5LqU5LiJ",
        "24560f24bf93a935301571609ced4fd6dbd8e1bd61f3b657ca04b9950b70996b":"5pyA5paw5YCk",
        "3de3f7858382e6225c4e65acd4bd27dd890495d2e9c9d9a2feea52974dd1dd90":"5pyA5paw6Kqe",
        "037d7a4e0a5a013a1324781d25441919fe12c5cf0b1a614d3820d5395737f140":"5YWE44GV44KT",
        "d6655f4435cf746658b8fdfad07f25752020a7282646ce06943449b9728987da":"6Kaq5pel",
        "1d9c0fedad217cd1917dc989f62551c4a84ae89253607ee2a43216ea73876f93":"5LiD5LiJ",
        "eb8ef2f95ec28768ef2d2573692ba08bc7430707224e37277c189c8c7977e39b":"5LiD6KiA",
        "a2a7d57bee1f86c4f980ca031d2e84d7cf2da073b962591754023ec0cb752db1":"6LOH55Sj5YCk",
        "06d0ad893583c658341c168e9be22c3c34093c6ca0693f4ea3e7e782cb03c7d3":"5LiJ5pel",
        "a5c8bff2327be928adee3fac0892bfa9f6d9a1e99b43cc974aaf64423c593bb1":"5YaN5Lu7",
        "4079552d0dd1c7f1f27ac5fc12a984594f1cdb7fb687a41c4cb9d8f79d5c9f57":"56Wt5pel",
        "5db355fa7646642b83d41f4cbf24a5615c8dfe068f5a30ac6a24ea0b74fe5909":"5pyA5paw",
        "8e5266a0fb0487c084144e8c2a0cfb8a2cc3fe65d3b8335bc5bf8648ca58d564":"5LiA5Lq6",
        "a950ede554647d9ac25d33d2831b278b6611809673dd15783ba0c7058806a58c":"5LiA6KiA",
        "22be78661a19c62ed878840df7f03c84a1bafd93d3144d8fb96384c76134ae55":"6KqN55+l",
        "fa855b2f42ddb3f8442c385a85fdc94e3c1b86e50013e425ef1bdbb6d1c5f49a":"6bCK",
        "03123d651be0227ffbfc3caba1bdc1dc414a6e31a5aca3d6c5b81f3719b4a136":"5LqM6KiA",
        "732bc364a60de25ef4c3eae753ad1db3bb884eafcc44e1135f03f877b60822e8":"5paw5Zyw",
        "2a79122a867c60f460f4d21216a6ac32a3a894ff342e6d7ea4bec7642dfcaac8":"5paw6Kqe",
        "a6519309d51807f478d4cfc910fd04c947dc66dd1b16a41cc41bae5c76293cac":"6KaW6KqN",
        "308700a5a0586fcddcc9a8c1c61396dd739f39f6a0e39b037a35a09ebb0859f3":"6LOH55Sj",
        "8abb00f628b7621da18642a643c03ef66b3a54e9457e83975bc6c2cfa4307f8b":"55Sj5Zyw",
        "5d2a7bad8202e8cb664ae75cc6dd6657313acd80f3cdd41246555909381a60f4":"54+K55Ga",
        "3fbb91f6c6425b3f799fb21f9777ea6e52b3d0e45e30eb7b592e971cd7e1266a":"5omN55+l",
        "ec3e69fa489bb08a88637a72e1c38323afb46c7eb832c69a8dcbf844427164e9":"56Wt56WA",
        "c6a70453e9993a3bbda4f04eb33f20b2fe092b7c8f2c5558a01d7c751e292035":"5pyA5b6M",
        "632dac83a139a304aa23abb7890e2c8e8723190d8997f6cb9165c0608f3ee9c6":"5LqU5Lq6",
        "4299b068bf6935931f28cf8b20dcff03635334acc4996d7dddf5db4e77557664":"5LqU5pel",
        "0b47d10c717e9892001914598120dbea019526d23bec7fce7f4567184d206c34":"6Kqk6Ki6",
        "ea1e2d3180866677fa3c667e9e669c09a326d1db1a3270241683878f5fef07bf":"6Kqk566X",
        "cdaed8278a326fc6530150b8202cc8b67d873518f5972266f5f307cd3062b8fa":"56KB55+z",
        "97e1dbee190e0d043cac711ec6271e2e766f1d25f8f44f3d8f82c0d102a4f00b":"5aeU5Lu7",
        "9326e08974a3da35d705cd624a421e8617dd37ef219dcfba94f693aade1da12b":"6Iu6",
        "f39f8e9472f145eae715c95cf6f8226282edd2b597d21b8ab608c2495f712e58":"57at5paw",
        "b7b92d7becb708877d04223871e9d1f182aa71bd64a559fe6df4e1be17cc5e87":"6YG655Sj",
        "474fa66a0ab1c87f89fd798649b5a3a6dbabc556e93b29fdc36b65f7df0686e7":"56CC5a2Q",
        "eafc9d5009434fb03b4eb195a8c21ef0e2555b945141240f38cce99882a8d52c":"6YG66KiA",
        "7f4ec6bf229c364e11f16802ed50efe18c733e3c7c39932009b00c7fd5997971":"5Lq6",
        "7c3fc643351a7e46664fda9331bc824f5e94854ddc423c9907b873321cdc6a31":"5pel",
        "0438b0b2b7bb198d83719d3b11d6d40648e588f38d0562c2cecd445c80417cd7":"6KW/",
        "d31dee86940ea84ce3be29afdf338bf13d47e5d243149e4865476d9cfa2f5a48":"6Iqv",
        "57dcda9b2a4b6dc2cb497d46784d89cb94c18776a1175ddb485deb63c4f50c87":"5LiD",
        "b9fe7a1dcc8a50315c8df2e767da244b89ebb62e03211a7461a18cefd5eea49a":"56eB6Kqe",
        "38ae3d1705d8e330921184710e612e264bc75ce6bfdee4e4080875f2aa84b9af":"5LqU5oyH",
        "6f649784b6e2de3737fe7de539cca2250dbe8f5b5d8a40ce60dd7fc56205ad41":"5L2N572u",
        "2607c779016e788c066fc765b7e5bfb7c96e5be5bf4ebe6b67d3f5b7325e4d1b":"55+z",
        "d361cc57c50e17c68dbf6fe8bc8970d75c6a32c3e96815b3d74950d136df19b5":"5Zuy56KB",
        "5f945f18ef58973201d6df7fc5efda98c57557242b02afb62e8023aacc832b54":"6I23",
        "a01669e6ccf908c0900fad6846096bbcbee7c1ceb1ed509b0f4fd373b8ea515e":"6Kqe",
        "1bb602cd1cb019533d75bd7c40521f38b7f08905b86192c9d937e1982b7d211e":"6Kmp",
        "93663a351728650fd9e971a97b44a6240558e0dc3da048fe22e19b7dc45cd3ff":"6YW4",
        "a2e6f3ef8e4af7eeae10c88c77ce27e5b9abba7d0e884d2277a81d97d60e6bba":"5YaN5LiJ5YaN5Zub",
        "f4293fe596dbb28edcaa294f2f6ce44b85b9a360f7912ed288291555cb5f7271":"5a+p5p+75aeU5ZOh",
        "7c04b4739fd7f15a892c5bcdefde69056f1a10f0461d1b321317c8d74236de26":"5LiD5LiD5pel",
        "4282511cefa3677073743476a527de0a7e8633d52bdf8ba759688015475988e2":"5LiJ5LiD5pel",
        "10d188127a22ff930c2f45b62984d76db3256a70c846a485319003459f0eec65":"5LiJ44CF5LqU44CF",
        "02d0d3ff4330faa94b27eda0578682ac8a8e31808eed4fe4c609dbf311e1f334":"5paw5Lu75Zyw",
        "9d8d287b303720eff346e076d32d266db97428d2f6dbc761c093e6ce4ebcde3f":"5a+p5p+75ZOh",
        "a9c95f00c11d298f43e40c29249ded50f1aa75d694c0ec2c1cc6e186c8897592":"55yf6KiA5bir",
        "d03a24e85848e692017918be1e1e2434a25e94424f95ddfd9d9dcd3ff8c336cb":"5YaN5a+p5p+7",
        "42b136525b5093b77a4aa4867f61a9f608e0271d9ac95199965672dc1edf87ef":"5LqU5LiD5pel",
        "f83262a8342e2d4ecc809229a4c517d54db997e456facef7e520bf572db61db2":"5Lq65Lq6",
        "1506310630abb3eda2d8efafcdf77e311d6443ef213a5f3942baab61b02ab497":"5aaK5aig",
        "2df837264adcc408211f97750bae09f4eef4f3f4f3f3f6956b5539d0c075f91f":"5aaK55Sj",
        "be143a08788eb79d00311f7587ac141b969afe05a235d07aad692e889067a72f":"5pel5pel",
        "fccf311ab282b11ae093cd377f2fc4c97d415827746d48424f881e890a76563a":"5rKI5rKI",
        "f9f8fe8beade4fcc6b970f2f2a327433209ca9ed1c6e19c4d21abf47fa1d7e68":"5paw5Lu7",
        "751c2db30a4eee731582cfcc49a988a15580f65bf7e825dc42d9936434f0ce86":"5paw6Zmz",
        "b4fb7d3d7c1189e636d5d31edababb8036a54e91a1ef84d0ebc4f12a889bb7f2":"5b+D6Lqr",
        "01cfcb4e02646407a3f9a5591a20818388dfa0a6858ee1939d5256247c156102":"5paw5Y+C",
        "32d2d6388149d3c278c7e48da593522768f3194e4626714d0a62cd6407631415":"55yf6KiA",
        "224c2dfcd96d460304554c4a1b56c47d2630fa3cc4cfb75a58a1c6a301057793":"5b+D5Zug",
        "3340d067a71b814f91d1b8453cfcb9e1ce51996d5338a8233e26ed3195e415f7":"5LiJ5oyv",
        "eb2f6d531d128bdccf97dfeb307730160b48dbae103aeb03bcfa50999ecc71bb":"54em44CF",
        "c7159f6ba6046d4474583695f00d561802bb4cb1e4fdeca5cfe573bc6e91297a":"5bGx6I+c",
        "832503949508b40f1825b956007d28593aa8b6625c1051112dca58511a282c35":"5bGx6Zmw",
        "d84dbe10c3cf3323a9358b67f8372961fcf6e6d29502934b3bcefdde51d06226":"56y55LqU5L2N",
        "eccc84118a940e45e568c97774e8b0d6727ac74fb6bd62acaf368eaa6787a6bc":"5o6h566X",
        "b7f2b1695a03fce84c8281bd16dca910f4c7ab0596fac859e75cd4f1153e48ff":"5YaN44CF",
        "ec0323747ce9a898d81aae965aa40b49d4e4e060540cebf91ddb8efe99bec267":"5paO6Zmi",
        "989526fa493ccbbd84347376666b49717529ea4425e2118263d155c2a7b6b8f8":"5LqU5LiD5LqU",
        "35c266cfb941378e719bfb0b80fbbcae655ad157ac4cbfea6c363e5a07dac1e3":"6Zqg5b+N",
        "9573daf022d380a5bb96d8b044a9491a748edb337bce680ae436aff02bae1655":"5q636LOR",
        "9f3af4969abfc4449c0855d66d809d676fccf75b22267fc1ff063035592cb261":"6Zmw5oOo",
        "fe6a2e11631ab66c38e879d2ec0f02808c14e0c9fb346455079c75dcfecead3f":"5q6344CF",
        "be4ceaca2218e82a276ee5a55febe6e8ba06fa3322d11f76f51e34ea363208ef":"5LiA5pel",
        "a152665ce4a93013770560279ea841be92162cdfce076e769e84c8404fd8f5ff":"5LiA5ZOh",
        "8d3ba541838ca0f80ed95e8aa301b4ce49596d0cf364b69df137fb296f7e5688":"5LiA44CF",
        "f48cdb9c15d93d7289769b3ee46208f03076c48e1437ff61fbd67e8d1ed40871":"5bGF5b+D5Zyw",
        "6af66a79a3b30c2d84cd2848b4e9ca33e97c86dbdca105883445ae299ef80903":"55+l5pel",
        "4c7d7dd1e56e30f2b62f8f2e5595fdd4dfd13b0e87d51714b2b057b60157ab37":"57Sz5aOr",
        "473e68ea4e2ce0a86508f8947f20e583dff2635707ef54638cca5ab8ca444764":"5oyH6Yed",
        "cf5c0876019d5673fd531e6115f90560c7f92b72a72bd9f915a1002502a3d722":"5LiJ5Y+J",
        "28b962e4b84d6326e434a7e392c94b15adb1b0c1bcb306d63861a74b14449b46":"5Lqb57Sw",
        "a4feed2c44caea27b7c487f0529c027df68f4b98e6235e7174877f7d0caa1463":"5q2z5beu",
        "fa299924582091f7883cee7cf18016cc4eaec224613aa1f332ea82c9cc0d0648":"5paO6KGj",
        "c2c4f1c71042c769fb5f1045e39bf5e44bd6979d8a4082e88d954acd102a8c05":"6KiA6Kqe",
        "b10436f436e1fc49db9722c970615558357f9d438bcaf466267da27cb9799f9b":"5LqU6KiA",
        "f2e534fd82ab5276ca330e6b67a26a45c7c4095916f15ead91c58b59f426175d":"6Zmw6JCO",
        "c83f5ebfbb50455d24aecd66bcfc816275a1149bd868d8f96905d761b4886f0f":"5LiA5L2N",
        "3b79a43aaeabaee93538da237fc0c65140e8b3b3ba9d1b57d3b2f0a5048cf7fb":"55Ww5b2p",
        "3d70fb17d2ed6917ab0919f6e0e9e735f502192aaf89e0cc4cf3665036cfe3af":"5aeU5ZOh",
        "3497b4c6e6d4bf140a29eb5d8230c6114d9588562652dff8ece346f622e770ec":"54i2",
        "e0d23381cf1a14611a817ba46c80fcefa5a5f72c315fd58985f5839da81754b0":"542F5a2Q",
        "cccb7b98222748c49c54876672ffe8bba7cca64f3b8f700191589161f3466934":"56y5",
        "1cd76d18794609e500e8423cd66da1cbc84ec96841749fd788d67a24b75ed1a8":"5Y2I5b6M"
      };
      const GOAL="c6a70453e9993a3bbda4f04eb33f20b2fe092b7c8f2c5558a01d7c751e292035";
      const $=id=>document.getElementById(id),result=$("result"),prediction=$("prediction"),wordLine=$("wordLine"),characters=$("characters"),divider=$("divider"),holdButton=$("holdButton"),resetButton=$("resetButton"),message=$("message"),successDialog=$("successDialog"),recordDialog=$("recordDialog"),playCount=$("playCount"),clearCount=$("clearCount");
      let value="",dividerIndex=0,holding=false,heldPointerId=null,heldAt=0,activeStage=-1,animationFrame=0,draggingDivider=false,solved=false,renderVersion=0,secretTapCount=0;
      const statsEndpoint="stats.php",visitorStorageKey="hold-words-global-visitor-id";
      const createVisitorId=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);
      const visitorId=(()=>{try{const saved=localStorage.getItem(visitorStorageKey);if(saved)return saved;const made=createVisitorId();localStorage.setItem(visitorStorageKey,made);return made}catch{return createVisitorId()}})();
      const hashText=async text=>{const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("")};
      const applyStats=s=>{if(!s||!Number.isFinite(s.plays)||!Number.isFinite(s.clears))return;playCount.textContent=String(s.plays);clearCount.textContent=String(s.clears)};
      const syncStats=async(action="read")=>{try{const options=action==="read"?{cache:"no-store"}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,visitorId})};const response=await fetch(statsEndpoint,options);if(!response.ok)throw 0;applyStats(await response.json())}catch{playCount.textContent="—";clearCount.textContent="—"}};
      const renderPrediction=stage=>{prediction.replaceChildren();if(stage<0){prediction.setAttribute("aria-label","入力予測なし");return}const token=TOKENS[stage];for(let i=0;i<token.dots;i++){const dot=document.createElement("span");dot.className="prediction-dot";prediction.append(dot)}prediction.setAttribute("aria-label",token.dots+"文字の入力予測")};
      const showModal=dialog=>typeof dialog.showModal==="function"?dialog.showModal():dialog.setAttribute("open","");
      const closeModal=dialog=>typeof dialog.close==="function"?dialog.close():dialog.removeAttribute("open");
      const renderResult=async()=>{const version=++renderVersion,source=value;result.classList.remove("is-visible");result.textContent="";result.removeAttribute("aria-label");if(!source)return;const key=await hashText(source);if(version!==renderVersion||source!==value)return;const encoded=LABELS[key];if(!encoded)return;const visible=unpack(encoded);result.textContent=visible;result.setAttribute("aria-label",visible);requestAnimationFrame(()=>result.classList.add("is-visible"));if(key===GOAL&&!solved){solved=true;syncStats("clear");setTimeout(()=>showModal(successDialog),480)}};
      const boundaryPositions=()=>{const boxes=[...characters.querySelectorAll(".character")],line=wordLine.getBoundingClientRect();if(!boxes.length)return[line.width/2];const positions=[],first=boxes[0].getBoundingClientRect();positions.push(first.left-line.left);for(let i=1;i<boxes.length;i++){const a=boxes[i-1].getBoundingClientRect(),b=boxes[i].getBoundingClientRect();positions.push((a.right+b.left)/2-line.left)}positions.push(boxes[boxes.length-1].getBoundingClientRect().right-line.left);return positions};
      const placeDivider=()=>{if(!value){divider.classList.remove("is-visible");return}const positions=boundaryPositions();dividerIndex=Math.max(0,Math.min(dividerIndex,positions.length-1));divider.style.left=positions[dividerIndex]+"px";divider.classList.add("is-visible");divider.setAttribute("aria-valuemin","0");divider.setAttribute("aria-valuemax",String(value.length));divider.setAttribute("aria-valuenow",String(dividerIndex))};
      const renderWord=()=>{characters.replaceChildren();[...value].forEach(()=>{const box=document.createElement("span");box.className="character";box.textContent="●";characters.append(box)});characters.setAttribute("aria-label",value?value.length+"文字入力済み":"入力なし");resetButton.disabled=!value;requestAnimationFrame(placeDivider)};
      const writeToken=token=>{if(solved)return;const source=[...value],writing=[...token],length=Math.max(source.length,dividerIndex+writing.length);if(length>7)return;writing.forEach((c,i)=>source[dividerIndex+i]=c);value=source.join("");dividerIndex+=writing.length;message.textContent="";renderWord();renderResult()};
      const finishHold=commit=>{if(!holding)return;holding=false;cancelAnimationFrame(animationFrame);holdButton.classList.remove("is-held");holdButton.setAttribute("aria-pressed","false");if(heldPointerId!==null&&holdButton.hasPointerCapture(heldPointerId))holdButton.releasePointerCapture(heldPointerId);heldPointerId=null;const stage=activeStage;activeStage=-1;renderPrediction(-1);if(commit&&stage>=0)writeToken(TOKENS[stage].text)};
      const updateHold=now=>{if(!holding)return;const elapsed=now-heldAt;if(elapsed>=6000){finishHold(false);return}const stage=elapsed<1000?-1:Math.min(4,Math.floor(elapsed/1000)-1);if(stage!==activeStage){activeStage=stage;renderPrediction(stage)}animationFrame=requestAnimationFrame(updateHold)};
      const beginHold=(pointerId=null)=>{if(holding||solved)return;holding=true;heldPointerId=pointerId;heldAt=performance.now();activeStage=-1;holdButton.classList.add("is-held");holdButton.setAttribute("aria-pressed","true");renderPrediction(-1);animationFrame=requestAnimationFrame(updateHold)};
      const moveDividerTo=x=>{const line=wordLine.getBoundingClientRect(),positions=boundaryPositions(),local=x-line.left;let nearest=0;positions.forEach((p,i)=>{if(Math.abs(p-local)<Math.abs(positions[nearest]-local))nearest=i});dividerIndex=nearest;placeDivider()};
      holdButton.addEventListener("pointerdown",e=>{e.preventDefault();holdButton.setPointerCapture(e.pointerId);beginHold(e.pointerId)});holdButton.addEventListener("pointerup",e=>{e.preventDefault();finishHold(true)});holdButton.addEventListener("pointercancel",()=>finishHold(false));holdButton.addEventListener("contextmenu",e=>e.preventDefault());holdButton.addEventListener("keydown",e=>{if((e.key===" "||e.key==="Enter")&&!e.repeat){e.preventDefault();beginHold()}});holdButton.addEventListener("keyup",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();finishHold(true)}});
      divider.addEventListener("pointerdown",e=>{e.preventDefault();draggingDivider=true;divider.classList.add("is-dragging");divider.setPointerCapture(e.pointerId);moveDividerTo(e.clientX)});divider.addEventListener("pointermove",e=>{if(draggingDivider)moveDividerTo(e.clientX)});const stopDrag=e=>{if(!draggingDivider)return;draggingDivider=false;divider.classList.remove("is-dragging");if(divider.hasPointerCapture(e.pointerId))divider.releasePointerCapture(e.pointerId)};divider.addEventListener("pointerup",stopDrag);divider.addEventListener("pointercancel",stopDrag);divider.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();dividerIndex=Math.max(0,dividerIndex-1);placeDivider()}if(e.key==="ArrowRight"){e.preventDefault();dividerIndex=Math.min(value.length,dividerIndex+1);placeDivider()}});
      resetButton.addEventListener("click",()=>{finishHold(false);value="";dividerIndex=0;solved=false;message.textContent="";renderWord();renderResult()});
      $("statsTrigger").addEventListener("click",async e=>{e.stopPropagation();secretTapCount++;if(secretTapCount<8)return;secretTapCount=0;await syncStats("read");showModal(recordDialog)});document.addEventListener("click",e=>{if(e.target!==$("statsTrigger"))secretTapCount=0});$("successClose").addEventListener("click",()=>closeModal(successDialog));$("recordClose").addEventListener("click",()=>closeModal(recordDialog));
      $("shareButton").addEventListener("click",()=>{const repostUrl="https://x.com/saji_qook/status/2094560869149774195?s=20";let shareText="WEB謎「その間に」を解きました！\n\nhttps://sajiqook.jp/game/sonokanni\n\n#その間に";if(repostUrl)shareText+="\n"+repostUrl;const params=new URLSearchParams({text:shareText});window.open("https://twitter.com/intent/tweet?"+params.toString(),"_blank","noopener,noreferrer")});
      window.addEventListener("resize",()=>requestAnimationFrame(placeDivider));document.addEventListener("visibilitychange",()=>{if(document.hidden)finishHold(false)});renderWord();renderResult();renderPrediction(-1);syncStats("visit");
    })();
  
