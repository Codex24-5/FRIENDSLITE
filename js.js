let users=JSON.parse(localStorage.U||'[]'),cu='',cw='',mode=0,repId=0,img='',vid='',shareId=0;
const show=id=>{document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active')};

// Image preview
imgFile.onchange=e=>{
 let f=e.target.files[0];if(!f)return;
 let r=new FileReader();r.onload=ev=>{img=ev.target.result;imgPreview.src=img;imgPreview.style.display='block'};r.readAsDataURL(f)
}

// Video preview
vidFile.onchange=e=>{
 let f=e.target.files[0];if(!f)return;
 let r=new FileReader();r.onload=ev=>{vid=ev.target.result;vidPreview.src=vid;vidPreview.style.display='block'};r.readAsDataURL(f)
}

function signup(){let u=su.value.trim(),p=sp.value.trim();if(!u||!p)return alert('Fill both');if(users.find(x=>x.u==u))return alert('Taken');users.push({u,p});localStorage.U=JSON.stringify(users);alert('Created');show('login')}
function login(){let u=lu.value.trim(),p=lp.value.trim();if(!users.find(x=>x.u==u&&x.p==p))return alert('Wrong');cu=u;loadUsers();show('app')}
function logout(){cu=cw='';show('login')}

function switchMode(){mode=(mode+1)%3;modeBtn.textContent=mode==0?'💬':mode==1?'📰':'🎥';title.textContent=mode==0?'Messages':mode==1?'Feed':'Reels';
chat.style.display=mode==0?'flex':'none';feed.style.display=mode==1?'flex':'none';reels.style.display=mode==2?'flex':'none';
if(mode==1)renderFeed();if(mode==2)renderReels()}

function loadUsers(){userList.innerHTML=users.filter(x=>x.u!=cu).map(x=>`<button onclick="openChat('${x.u}')">${x.u}</button>`).join('')||'<span style="color:var(--muted)">No users</span>';if(users.length>1&&!cw)openChat(users.find(x=>x.u!=cu).u)}
function openChat(u){cw=u;document.querySelectorAll('.users button').forEach(b=>b.style.background=b.textContent==u?'var(--a)':'var(--bg)');loadChat()}
function sendMsg(){let t=msgInput.value.trim();if(!t||!cw)return;let k=`c_${cu}_${cw}`,r=`c_${cw}_${cu}`,m=JSON.parse(localStorage[k]||'[]');m.push({f:cu,t,d:Date.now()});localStorage[k]=localStorage[r]=JSON.stringify(m);msgInput.value='';loadChat()}
function loadChat(){let k=`c_${cu}_${cw}`,m=JSON.parse(localStorage[k]||'[]');chatBox.innerHTML=m.map(x=>`<div class="msg ${x.f==cu?'me':'other'}">${x.t}</div>`).join('');chatBox.scrollTop=chatBox.scrollHeight}

function post(){let t=postInput.value.trim();if(!t&&!img)return alert('Add text or image');let p=JSON.parse(localStorage.P||'[]');p.unshift({id:Date.now(),u:cu,x:t,img,d:Date.now(),r:{},c:[],rp:[]});localStorage.P=JSON.stringify(p);postInput.value='';img='';imgPreview.style.display='none';imgFile.value='';renderFeed()}
function renderFeed(){let p=JSON.parse(localStorage.P||'[]');feedBox.innerHTML=p.map(x=>{
 let rb=['👍','❤️','😂'].map(e=>`<button onclick="react(${x.id},'${e}')">${e} ${x.r[e]?x.r[e].length:0}</button>`).join('');
 let cm=x.c.map(c=>`<div style="font-size:13px;margin-top:5px;background:var(--bg);padding:7px 10px;border-radius:10px"><b style="color:var(--a)">${c.u}:</b> ${c.t}</div>`).join('');
 return `<div class="post"><div class="postHead"><b>${x.u}</b><div><span>${new Date(x.d).toLocaleTimeString().slice(0,5)}</span>${x.u!=cu?`<button style="background:0;border:0;color:var(--d);margin-left:10px;font-size:18px" onclick="openReport(${x.id})">🚩${x.rp?x.rp.length:''}</button>`:''}</div></div><div style="margin-bottom:8px;line-height:1.4">${x.x}</div>${x.img?`<img src="${x.img}" class="postImg">`:''}<div class="actions">${rb}</div>${cm}<div style="display:flex;gap:6px;margin-top:8px"><input id="c${x.id}" placeholder="Comment..." style="font-size:14px;padding:10px"><button onclick="comment(${x.id})" style="width:auto;padding:10px 14px">Send</button></div></div>`
}).join('')||'<div style="text-align:center;color:var(--muted);margin-top:50px">No posts yet</div>'}
function react(id,e){let p=JSON.parse(localStorage.P||'[]'),post=p.find(x=>x.id==id);if(!post.r[e])post.r[e]=[];let i=post.r[e].indexOf(cu);i>-1?post.r[e].splice(i,1):post.r[e].push(cu);localStorage.P=JSON.stringify(p);renderFeed()}
function comment(id){let inp=document.getElementById('c'+id),t=inp.value.trim();if(!t)return;let p=JSON.parse(localStorage.P||'[]'),post=p.find(x=>x.id==id);post.c.push({u:cu,t});localStorage.P=JSON.stringify(p);inp.value='';renderFeed()}
function openReport(id){repId=id;reportModal.classList.add('active')}
function report(){let p=JSON.parse(localStorage.P||'[]'),post=p.find(x=>x.id==repId);if(!post.rp)post.rp=[];if(post.rp.find(r=>r.u==cu))return alert('Already reported');post.rp.push({u:cu,z:reason.value});localStorage.P=JSON.stringify(p);alert('Reported');reportModal.classList.remove('active');renderFeed()}

function postReel(){let cap=reelCap.value.trim();if(!vid)return alert('Pick video');let r=JSON.parse(localStorage.R||'[]');r.unshift({id:Date.now(),u:cu,cap,vid,d:Date.now(),r:{},c:[],s:[]});localStorage.R=JSON.stringify(r);reelCap.value='';vid='';vidPreview.style.display='none';vidFile.value='';renderReels()}
function renderReels(){let r=JSON.parse(localStorage.R||'[]');reelsBox.innerHTML=r.map(x=>{
 let likes=x.r['❤️']?x.r['❤️'].length:0;
 let cm=x.c.map(c=>`<div style="font-size:13px;margin-top:4px;background:#0007;padding:6px 10px;border-radius:8px"><b>${c.u}:</b> ${c.t}</div>`).join('');
 return `<div class="reel"><video src="${x.vid}" controls playsinline loop></video><div class="reelInfo"><div class="reelUser">@${x.u}</div><div>${x.cap}</div><div style="display:flex;gap:6px;margin-top:8px"><input id="cr${x.id}" placeholder="Comment..." style="flex:1;padding:8px;border-radius:16px;border:0;background:#0007;color:#fff"><button onclick="commentReel(${x.id})" style="width:auto;padding:8px 12px;font-size:13px">Send</button></div>${cm}</div><div class="reelBtns"><div><button class="reelBtn" onclick="reactReel(${x.id},'❤️')">❤️</button><div style="font-size:12px;margin-top:4px">${likes}</div></div><div><button class="reelBtn" onclick="openShare(${x.id})">📤</button><div style="font-size:12px;margin-top:4px">${x.s?x.s.length:0}</div></div></div></div>`
}).join('')||'<div style="color:#fff;text-align:center;margin-top:50vh">No reels yet</div>'}
function reactReel(id,e){let r=JSON.parse(localStorage.R||'[]'),reel=r.find(x=>x.id==id);if(!reel.r[e])reel.r[e]=[];let i=reel.r[e].indexOf(cu);i>-1?reel.r[e].splice(i,1):reel.r[e].push(cu);localStorage.R=JSON.stringify(r);renderReels()}
function commentReel(id){let inp=document.getElementById('cr'+id),t=inp.value.trim();if(!t)return;let r=JSON.parse(localStorage.R||'[]'),reel=r.find(x=>x.id==id);reel.c.push({u:cu,t});localStorage.R=JSON.stringify(r);inp.value='';renderReels()}
function openShare(id){shareId=id;shareList.innerHTML=users.filter(x=>x.u!=cu).map(x=>`<div class="shareUser" onclick="share('${x.u}')">${x.u}<span>➤</span></div>`).join('');shareModal.classList.add('active')}
function share(u){let r=JSON.parse(localStorage.R||'[]'),reel=r.find(x=>x.id==shareId);if(!reel.s)reel.s=[];reel.s.push({to:u,from:cu,t:Date.now()});localStorage.R=JSON.stringify(r);alert('Shared to '+u);shareModal.classList.remove('active')}

