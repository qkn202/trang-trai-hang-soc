const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-ClrNNjkj.js","assets/game-data-B80lpGGE.js","assets/sim-Bap4m-rP.js","assets/minigameGpuFx-CQysKWQ1.js","assets/engine-B82YWe7Z.js","assets/puzzleArcadeModal-Cxxilehb.js","assets/webgl2WorldRenderer-kGwJ2CdU.js","assets/vendor-pixi-Du6zZD-X.js","assets/vendor-d6FS5LaX.js"])))=>i.map(i=>d[i]);
var aa=Object.defineProperty;var oa=(e,t,n)=>t in e?aa(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var v=(e,t,n)=>oa(e,typeof t!="symbol"?t+"":t,n);import{F as ke,ah as An,ai as ra,c as Dt,y as Ae,aj as la,g as ne,ak as Wt,al as $i,Q as Ln,G as Re,af as Fe,P as St,s as yn,am as as,M as ot,q as Ye,C as os,U as ca,Z as ri,r as da,w as pa,k as Mt,u as Je,a1 as jt,D as Ke,t as Ft,J as ua,K as ga,R as rs,V as ls,A as ma,I as dn,W as ha,H as Rt,S as fa,an as ba,ag as wt,Y as cs,_ as ds,l as nn,a as En,a0 as Pn,B as Ci,E as ya,X as va,T as ki,a4 as Sa}from"./game-data-B80lpGGE.js";import{i as wa,A as Nt,n as xa,j as rt,k as ps,l as Mi,H as lt,L as sn,M as Ai,m as Li,u as Ta,o as $a,p as Ca,q as Ei,t as Ot,v as Pi,w as De,x as ka,y as Ma,z as qi,B as qn,C as we,D as an,F as _t,G as Aa,I as zt,J as Ii,K as us,N as on,O as La,P as Ea,Q as Pa,R as Wn,S as Bi,U as qa,V as jn,W as Kt,X as li,Y as Ia,Z as Ba,_ as Ha,$ as Hi,a0 as Di,a1 as Tt,a2 as Da,a3 as gs,a4 as Ra,a5 as Na,a6 as pn,a7 as Ri,a8 as Oa,a9 as ms,aa as za,ab as vn,ac as Fa,ad as _a,ae as hs,af as ht,ag as Ge,ah as Ga,ai as un,aj as Va,ak as Ua,al as Ni,am as Wa,an as ft,ao as Gt,ap as Qt,d as ja,aq as In,ar as Bn,as as Qa,at as Xa,au as Ya,av as Ka,aw as Za,ax as Ja,ay as eo,az as Hn,g as Dn,aA as $t,aB as Oi,E as zi,s as to,aC as Rn}from"./sim-Bap4m-rP.js";import{S as no,I as io,i as Fi}from"./engine-B82YWe7Z.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const rn={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function so(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const n=t.documentElement;n.setAttribute("data-colorblind",e.colorblindMode),n.setAttribute("data-font-scale",String(e.fontScale)),n.setAttribute("data-high-contrast",e.highContrast?"true":"false"),n.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function ao(e,t){t.ceiling.setAllVolumes(e.volumes)}const fs=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],oo=.18;function ln(e,t=oo){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const n=e<0?-1:1,o=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((n*Math.min(1,o)).toFixed(3))}function ro(e,t){if(Math.hypot(e,t)<.35)return null;let o=Math.atan2(t,e);o<0&&(o+=Math.PI*2);const s=Math.PI*2/8,a=(o+s*.5)%(Math.PI*2);return Math.floor(a/s)%8}class lo{constructor(){v(this,"prevConfirm",!1);v(this,"prevCancel",!1);v(this,"prevDpadUp",!1);v(this,"prevDpadDown",!1);v(this,"prevDpadLeft",!1);v(this,"prevDpadRight",!1)}poll(t){let n=t??null;if(!n&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const f=navigator.getGamepads();for(const h of f)if(h&&h.connected){n=h;break}}if(!n)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const o=ln(n.axes[0]??0),s=ln(n.axes[1]??0),a=ln(n.axes[2]??0),r=ln(n.axes[3]??0),l=!!n.buttons[0]?.pressed,i=!!n.buttons[1]?.pressed,p=!!n.buttons[4]?.pressed,c=!!n.buttons[12]?.pressed,d=!!n.buttons[13]?.pressed,g=!!n.buttons[14]?.pressed,y=!!n.buttons[15]?.pressed,C=l&&!this.prevConfirm,u=i&&!this.prevCancel,m=(y&&!this.prevDpadRight?1:0)-(g&&!this.prevDpadLeft?1:0),T=(d&&!this.prevDpadDown?1:0)-(c&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=i,this.prevDpadUp=c,this.prevDpadDown=d,this.prevDpadLeft=g,this.prevDpadRight=y;const L=p,$=L?ro(Math.abs(a)>0?a:o,Math.abs(r)>0?r:s):null,k=$!==null?fs[$]?.actionId??null:null;return{connected:!0,panDx:L?0:o,panDy:L?0:s,cursorStepGx:m,cursorStepGy:T,radialOpen:L,radialSliceIndex:$,radialActionId:k,confirmJustPressed:C,cancelJustPressed:u}}}let bs=null,ze=null,Ie=null,Nn=null;function ys(e){!Ie&&typeof document<"u"&&(Ie=document.getElementById("a11y-announcer")),!(!Ie||!e)&&(Ie.textContent="",requestAnimationFrame(()=>{Ie&&(Ie.textContent=e)}))}function co(e){const t=e.state.buildings.find(o=>o.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const n=Date.now();if(t.constructEndsAt>n)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-n)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const o=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-n)/1e3)),s=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${o} giây, tổng ${s} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function Qn(e){const t=e??bs;if(!t||(!ze&&typeof document<"u"&&(ze=document.getElementById("a11y-farm-status")),!ze))return;const n=t.state,o=n.level,s=n.galleons.toLocaleString("vi-VN"),a=n.sandboxMode?"Vô hạn":String(n.match3?.stars??0),r=n.timeSand,l=n.farmBarn?.owlOrders??[],i=l.filter(d=>t.canFulfillFarmOwlOrder(d)).length,p=`${l.length} đơn hàng (${i} đơn đủ nông sản sẵn sàng giao)`,c=co(t);ze.innerHTML=`
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${o}</td></tr>
        <tr><th scope="row">Vàng Galleon</th><td>${s} Galleons</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${a}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${r}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${p}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${c}</td></tr>
      </tbody>
    </table>
  `.trim()}function po(e){bs=e,!(typeof document>"u")&&(Ie||(Ie=document.getElementById("a11y-announcer"),Ie||(Ie=document.createElement("div"),Ie.id="a11y-announcer",Ie.className="visually-hidden",Ie.setAttribute("aria-live","polite"),Ie.setAttribute("aria-atomic","true"),document.body.appendChild(Ie))),ze||(ze=document.getElementById("a11y-farm-status"),ze||(ze=document.createElement("div"),ze.id="a11y-farm-status",ze.className="visually-hidden",ze.setAttribute("role","region"),ze.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(ze))),Qn(e),Nn&&clearInterval(Nn),Nn=setInterval(()=>{Qn()},5e3))}const On={init:po,announce:ys,refresh:()=>Qn()},uo={light:10,medium:20,heavy:35,success:[12,35,22],warning:[26,40,26],levelup:[18,40,28,40,45]};class vs{constructor(){v(this,"runtimeKind","web");v(this,"isNativeShell",!1)}async triggerHaptic(t){try{typeof navigator<"u"&&typeof navigator.vibrate=="function"&&navigator.vibrate(uo[t]??10)}catch{}}async saveLocalBackup(t,n){try{if(typeof localStorage<"u")return localStorage.setItem(`hangsoc_native_bak_${t}`,n),!0}catch{}return!1}async loadLocalBackup(t){try{if(typeof localStorage<"u")return localStorage.getItem(`hangsoc_native_bak_${t}`)}catch{}return null}async scheduleNotification(t){if(typeof window>"u"||!("Notification"in window)||Notification.permission!=="granted")return!1;const n=Math.max(0,t.fireAtMs-Date.now());return n>6*3600*1e3?!1:(window.setTimeout(()=>{try{new Notification(t.title,{body:t.body})}catch{}},n),!0)}}function go(e=typeof window<"u"?window:void 0){if(!e||typeof e!="object")return"web";const t=e;if(t.__TAURI_INTERNALS__||t.__TAURI__)return"tauri-desktop";const n=t.Capacitor;if(n&&typeof n.isNativePlatform=="function"&&n.isNativePlatform()){const o=n.getPlatform?.().toLowerCase();if(o==="ios")return"capacitor-ios";if(o==="android")return"capacitor-android"}return"web"}class mo{constructor(t,n=typeof window<"u"?window:{}){v(this,"runtimeKind");v(this,"isNativeShell",!0);v(this,"fallback",new vs);v(this,"winRef");this.runtimeKind=t,this.winRef=n??{}}async triggerHaptic(t){const n=this.winRef.Capacitor?.Plugins?.Haptics;if(n)try{if(t==="success"||t==="levelup"){if(n.notification){await n.notification({type:"SUCCESS"});return}}else if(t==="warning"){if(n.notification){await n.notification({type:"WARNING"});return}}else if(n.impact){const o=t==="heavy"?"HEAVY":t==="medium"?"MEDIUM":"LIGHT";await n.impact({style:o});return}}catch{}await this.fallback.triggerHaptic(t)}async saveLocalBackup(t,n){const o=`hangsoc_${t.replace(/[^a-zA-Z0-9_-]/g,"_")}.json`;if(this.runtimeKind==="tauri-desktop"&&this.winRef.__TAURI_INTERNALS__?.invoke)try{return await this.winRef.__TAURI_INTERNALS__.invoke("plugin:fs|write_text_file",{path:o,contents:n}),!0}catch{}const s=this.winRef.Capacitor?.Plugins?.Filesystem;if(s?.writeFile)try{return await s.writeFile({path:o,data:n,directory:"DOCUMENTS",encoding:"utf8"}),!0}catch{}return this.fallback.saveLocalBackup(t,n)}async loadLocalBackup(t){const n=`hangsoc_${t.replace(/[^a-zA-Z0-9_-]/g,"_")}.json`;if(this.runtimeKind==="tauri-desktop"&&this.winRef.__TAURI_INTERNALS__?.invoke)try{const s=await this.winRef.__TAURI_INTERNALS__.invoke("plugin:fs|read_text_file",{path:n});if(typeof s=="string")return s}catch{}const o=this.winRef.Capacitor?.Plugins?.Filesystem;if(o?.readFile)try{const s=await o.readFile({path:n,directory:"DOCUMENTS",encoding:"utf8"});if(typeof s?.data=="string")return s.data}catch{}return this.fallback.loadLocalBackup(t)}async scheduleNotification(t){const n=this.winRef.Capacitor?.Plugins?.LocalNotifications;if(n?.schedule)try{return await n.schedule({notifications:[{id:t.id,title:t.title,body:t.body,schedule:{at:new Date(Math.max(Date.now()+1e3,t.fireAtMs))}}]}),!0}catch{}return this.fallback.scheduleNotification(t)}}let zn=null;function ho(e){const t=go(e);return t==="web"?new vs:new mo(t,e)}function fo(){return zn||(zn=ho()),zn}const bo={light:"light",success:"success",harvest:"medium",levelup:"levelup"},yo={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function Ct(e){const t=fo();if(t.isNativeShell)return t.triggerHaptic(bo[e]??"light"),!0;if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const n=navigator.userActivation;if(n&&!n.hasBeenActive)return!1;try{const o=yo[e]??15;return navigator.vibrate(o)}catch{return!1}}function me(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _i(e){return e===1?"🥇 1":e===2?"🥈 2":e===3?"🥉 3":`#${e}`}function Gi(e){return e.replace(/\s*\(Bạn\)\s*$/u,"").trim()||e}const Vi=`
  <div class="parchment-panel modal-inner lb-modal-inner cc-lb-card">
    <div class="modal-header cc-lb-header">
      <div class="cc-lb-title-stack">
        <span class="cc-lb-ribbon-sub">ĐẠI SẢNH ĐƯỜNG HANG SÓC • 4 MÔN TRANH CÚP</span>
        <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng &amp; Cúp 4 Nhà</h2>
      </div>
      <form method="dialog" class="cc-lb-close-form">
        <button type="submit" class="brass-btn" aria-label="Đóng bảng xếp hạng" autofocus>✕</button>
      </form>
    </div>
    <div id="leaderboardLiveAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
    <div id="leaderboardDialogToast" class="cc-lb-toast" hidden></div>
    <div id="leaderboardDialogContent"></div>
  </div>
`;class vo{constructor(t,n){v(this,"activeGameId","match3");v(this,"activeScope","valley");v(this,"activeHouseFilter","all");v(this,"redirectedFromUnscored",null);v(this,"onJumpToGame");v(this,"onVisitNeighbor");v(this,"onOpenNeighborBook");v(this,"root");v(this,"sim");v(this,"closeBound",!1);v(this,"sortingHatSpinning",!1);v(this,"profileDrawerOpen",!1);v(this,"profileDraftName",null);v(this,"profileDraftHouse",null);v(this,"sortingHatAnnouncement","");v(this,"toastTimer",null);v(this,"liveTimer",null);this.root=t,this.sim=n,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");if(t?t.querySelector(".cc-lb-card")||(t.classList.add("cc-lb-dialog"),t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=Vi):(t=document.createElement("dialog"),t.id="leaderboardDialog",t.className="cc-lb-dialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=Vi,this.root.appendChild(t)),!this.closeBound&&(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype))){const n=(s,a)=>{const r=a.getBoundingClientRect();return s.clientX<r.left||s.clientX>r.right||s.clientY<r.top||s.clientY>r.bottom};let o=!1;t.addEventListener("pointerdown",s=>{o=n(s,t)}),t.addEventListener("pointerup",s=>{o&&n(s,t)&&t.close(),o=!1})}return t}showInDialogToast(t){const n=this.root.querySelector("#leaderboardDialogToast"),o=this.root.querySelector("#leaderboardLiveAnnouncer");n&&(n.textContent=t,n.hidden=!1,this.toastTimer!==null&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{n.hidden=!0,this.toastTimer=null},2800)),o&&(this.liveTimer!==null&&window.clearTimeout(this.liveTimer),o.textContent="",this.liveTimer=window.setTimeout(()=>{o.textContent=t,this.liveTimer=null},50))}open(t,n,o){t?wa(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=Nt.includes(this.activeGameId)?this.activeGameId:xa(t)):(this.redirectedFromUnscored=null,Nt.includes(this.activeGameId)||(this.activeGameId="match3")),(n==="valley"||n==="friends"||n==="personal")&&(this.activeScope=n),(o==="all"||o&&rt.includes(o))&&(this.activeHouseFilter=o),this.profileDraftName=null,this.profileDraftHouse=null,this.sortingHatAnnouncement="";const s=this.ensureDialogMounted();this.render(),s.open||s.showModal(),this.scrollSelectedGameTabIntoView(),ps(this.sim.state).catch(()=>{}).then(()=>Promise.all(Nt.map(a=>Mi(a)))).then(()=>{s.open&&!this.profileDrawerOpen&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}scrollSelectedGameTabIntoView(t=!1){const n=this.root.querySelector('.cc-lb-game-tabs [role="tab"][aria-selected="true"]');if(n&&(t&&n.focus(),typeof n.scrollIntoView=="function"))try{n.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"})}catch{n.scrollIntoView({block:"nearest",inline:"nearest"})}}getCurrentWizardDisplayName(){return this.sim.state.neighborSocial?.playerDisplayName?.trim()||this.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc"}renderHouseCupGridHtml(t){return`
      <div class="cc-hourglass-grid" id="house-cup-grid">
        ${t.map(o=>{const s=o.meta,a=this.activeHouseFilter===o.house;return`
          <button
            type="button"
            class="cc-house-cup-card cc-house-${s.cssSlug} ${o.isPlayerHouse?"is-player-house":""} ${a?"is-filtered-house":""}"
            data-lb-house-card="${o.house}"
            aria-pressed="${a}"
          >
            <div class="cc-house-cup-top">
              <span class="cc-house-cup-crest" aria-hidden="true">${s.emblemSvg}</span>
              <div class="cc-house-cup-meta">
                <div class="cc-house-cup-name-row">
                  <strong>#${o.rank} ${me(s.house)}</strong>
                  ${o.isPlayerHouse?'<span class="cc-house-you-pill">Bạn</span>':""}
                </div>
                <div class="cc-house-cup-stats">${o.members} thành viên • ${o.totalStars.toLocaleString("vi-VN")} ★</div>
              </div>
              <span class="cc-house-cup-hourglass" aria-hidden="true">${s.hourglassSvg}</span>
            </div>
            <div class="cc-house-cup-points">${o.points.toLocaleString("vi-VN")} đ</div>
            <div
              class="cc-hourglass-bar"
              role="progressbar"
              aria-valuenow="${o.fillPercent}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Điểm Cúp Nhà ${me(s.house)}"
            >
              <div class="cc-hourglass-bar-fill" style="width:${o.fillPercent}%"></div>
            </div>
          </button>
        `}).join("")}
      </div>
    `}renderProfileDrawerHtml(t){if(!this.profileDrawerOpen)return"";const n=!!(this.sim.state.minigameLeaderboard?.playerHouseLockedByServer&&this.sim.state.minigameLeaderboard?.playerHouse),o=n?t:this.profileDraftHouse??t,s=this.profileDraftName??this.getCurrentWizardDisplayName(),a=lt[o]??lt.Gryffindor,r=rt.map(i=>{const p=lt[i],c=i===o;return`
        <label class="cc-house-option ${c?"selected":""}" data-cc-house-opt="${i}">
          <input
            type="radio"
            name="ccWizardHouse"
            value="${i}"
            ${c?"checked":""}
            ${n?"disabled":""}
          />
          <span class="cc-house-option-crest" aria-hidden="true">${p.emblemSvg}</span>
          <span class="cc-house-option-info">
            <strong>${me(p.house)} (${me(p.vnTitle)})</strong>
            <small>${p.patronusEmoji} ${me(p.patronusNameVi)} • ${me(p.traitsVi)}</small>
          </span>
        </label>
      `}).join(""),l=this.sortingHatAnnouncement||`${a.patronusEmoji} ${a.house}: ${a.quoteVi}`;return`
      <form id="ccLbProfileForm" class="cc-profile-drawer">
        <div class="cc-profile-header">
          <h3 class="cc-profile-heading">🎩 Hồ Sơ Phù Thủy &amp; Lễ Phân Loại Nhà</h3>
          ${n?`<span class="cc-server-house-badge">🏰 Đồng bộ tài khoản HPVN: ${a.mascotEmoji} ${me(t)}</span>`:""}
        </div>

        <div class="cc-field-group">
          <label for="ccWizardNameInput">Tên Phù Thủy hiển thị trên Bảng Xếp Hạng (Tối đa 26 ký tự)</label>
          <div class="cc-input-with-action">
            <input
              id="ccWizardNameInput"
              name="wizardName"
              type="text"
              maxlength="26"
              autocomplete="nickname"
              placeholder="Ví dụ: Minh Khôi Potter..."
              value="${me(s)}"
              required
            />
            ${n?"":`<button
                    id="btnLbRandomHat"
                    type="button"
                    class="cc-pill-btn cc-btn-yellow ${this.sortingHatSpinning?"is-spinning":""}"
                    ${this.sortingHatSpinning?"disabled":""}
                  >
                    🎩 Nón Phân Loại
                  </button>`}
          </div>
        </div>

        <fieldset class="cc-houses-fieldset">
          <legend>${n?"Nhà Hogwarts (Tự động khoá theo tài khoản diễn đàn HPVN)":"Chọn 1 trong 4 Nhà Hogwarts"}</legend>
          <div class="cc-houses-grid" id="ccHousesSelectorGrid">
            ${r}
          </div>
        </fieldset>

        <p id="ccSortingHatQuote" class="cc-dialog-lead">${me(l)}</p>

        <div class="cc-profile-actions">
          <button type="submit" class="cc-pill-btn cc-btn-pink cc-btn-save-profile">
            💾 Cập Nhật Hồ Sơ
          </button>
          <button type="button" id="btnLbCloseProfileDrawer" class="cc-pill-btn cc-btn-slate">
            Thu gọn
          </button>
        </div>
      </form>
    `}renderControlsBarHtml(t){const n=sn[this.activeGameId],o=`
      <div class="cc-lb-scope-pills" role="group" aria-label="Phạm vi bảng xếp hạng">
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope==="valley"?"active":""}"
          data-lb-scope="valley"
          aria-pressed="${this.activeScope==="valley"}"
        >
          🌍 Toàn Trường
        </button>
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope==="friends"?"active":""}"
          data-lb-scope="friends"
          aria-pressed="${this.activeScope==="friends"}"
        >
          🤝 Bạn Bè
        </button>
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope==="personal"?"active":""}"
          data-lb-scope="personal"
          aria-pressed="${this.activeScope==="personal"}"
        >
          📜 Kỷ Lục 4 Môn
        </button>
      </div>
    `,s=this.activeScope==="personal"?"":`
      <div class="cc-lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc theo Nhà Hogwarts">
        <button
          type="button"
          class="cc-filter-pill ${this.activeHouseFilter==="all"?"active":""}"
          data-lb-house-filter="all"
          aria-pressed="${this.activeHouseFilter==="all"}"
        >
          Tất Cả
        </button>
        ${rt.map(a=>{const r=lt[a],l=this.activeHouseFilter===a;return`
            <button
              type="button"
              class="cc-filter-pill ${l?"active":""}"
              data-lb-house-filter="${a}"
              aria-pressed="${l}"
            >
              ${r.mascotEmoji} ${me(r.house)}
            </button>
          `}).join("")}
      </div>
    `;return`
      <div class="cc-lb-controls">
        <div class="cc-lb-filters-stack">
          ${o}
          ${s}
        </div>

        <div class="cc-lb-tools">
          
          <button
            id="btnLbToggleProfile"
            type="button"
            class="cc-pill-btn cc-btn-purple"
            aria-expanded="${this.profileDrawerOpen}"
          >
            🎩 Hồ Sơ &amp; Nhà
          </button>
          <button
            id="btnLbOpenFriendsBook"
            type="button"
            class="cc-pill-btn cc-btn-green"
          >
            🦉 Kết Bạn
          </button>
          ${this.activeScope!=="personal"?`<button
                  id="btnLbExportCsv"
                  type="button"
                  class="cc-pill-btn cc-btn-yellow"
                >
                  📥 Xuất CSV
                </button>`:""}
          <button
            id="btnLbPlayActiveGame"
            type="button"
            class="cc-pill-btn cc-btn-pink"
          >
            ▶️ ${me(n.shortVi)}
          </button>
        </div>
      </div>
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const n=sn[this.activeGameId],o=this.root.querySelector("#leaderboardDialogTitle");o&&(o.textContent=`🏆 Bảng Xếp Hạng & Cúp 4 Nhà • ${n.shortVi}`);const s=Nt.map(l=>{const i=sn[l],p=this.sim.getPlayerMinigameRank(l,"valley"),c=l===this.activeGameId;return`
        <button
          id="ccLbTab-${l}"
          type="button"
          role="tab"
          aria-selected="${c}"
          tabindex="${c?"0":"-1"}"
          data-lb-game="${l}"
          class="cc-lb-game-tab"
        >
          <img src="${i.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
          <span class="cc-lb-tab-label">${me(i.shortVi)}</span>
          <span class="cc-lb-tab-rank">${p<=3?"👑 ":""}#${p}</span>
        </button>
      `}).join(""),a=this.redirectedFromUnscored?`<div class="cc-lb-unscored-note" role="note">
          📌 <strong>${me(sn[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không tính điểm — dưới đây là Cúp 4 Nhà &amp; Bảng Xếp Hạng của <strong>4 môn tranh cúp</strong> (Bùa Gặt • Số Học • Sinh Vật • Tranh Ghép).
        </div>`:"",r=this.activeScope==="personal"?this.renderPersonalThreeGamesViewHtml():this.renderStandingViewHtml(this.activeScope);t.innerHTML=`
      <div class="cc-lb-shell">
        ${a}
        <div class="cc-lb-game-tabs" role="tablist" aria-label="Chọn bộ môn tranh cúp">
          ${s}
        </div>
        <div id="ccLbTabPanel" role="tabpanel" aria-labelledby="ccLbTab-${this.activeGameId}">
          <div class="cc-lb-panel-body">
            ${r}
          </div>
        </div>
      </div>
    `,this.bindEvents(t)}renderStandingRowHtml(t){const n=_i(t.rank),o=lt[t.house]??lt.Gryffindor,s=t.isPlayer?Gi(t.name):t.name,a=t.isPlayer?'<span class="cc-lb-you-tag"> (Bạn)</span>':t.isSeededRival?'<span class="cc-lb-npc-tag"> • Mẫu</span>':t.isCloudPlayer?'<span class="cc-lb-cloud-tag"> • Online</span>':t.isFriend?'<span class="cc-lb-friend-tag"> • Bạn</span>':"",r=!t.isPlayer&&t.neighborId?`<button
            type="button"
            class="cc-lb-visit-btn"
            data-lb-visit="${me(t.neighborId)}"
            aria-label="Thăm điền trang của ${me(s)}"
          >🏡 Thăm</button>`:"",l=t.primaryValue>=Ai?"👑 777/777":`Màn ${Math.max(0,t.primaryValue)}`;return`
      <tr class="${t.isPlayer?"me-row":""}">
        <td class="cc-lb-rank-cell"><strong>${me(n)}</strong></td>
        <th scope="row" class="cc-lb-name-cell">
          <div class="cc-lb-name-wrap">
            <span class="cc-lb-mobile-rank" aria-hidden="true">${me(n)}</span>
            <span class="cc-lb-avatar" aria-hidden="true">${me(t.avatarEmoji)}</span>
            <span class="cc-lb-wiz-name">${me(s)}</span>
            ${a}
            ${r}
          </div>
        </th>
        <td class="cc-lb-house-cell cc-house-ink-${o.cssSlug}">
          <strong>${o.mascotEmoji} ${me(o.house)}</strong>
        </td>
        <td>${me(l)}</td>
        <td>
          <span class="cc-star-glyph" aria-hidden="true">★</span> ${t.stars.toLocaleString("vi-VN")}
        </td>
        <td>
          <strong class="cc-lb-score-val">${t.ratingScore.toLocaleString("vi-VN")}</strong>
        </td>
      </tr>
    `}renderStandingViewHtml(t){const n=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:o,entries:s,playerEntry:a,playerRank:r,totalEntries:l,nextRivalAbove:i,houseStandings:p,playerHouse:c,includeSeededRivals:d}=n,g=i?`🎯 Đang đuổi <strong>#${i.rank} ${me(Gi(i.name))}</strong> (${me(i.primaryDisplayVi)} • ${i.ratingScore.toLocaleString("vi-VN")} đ)`:`👑 Đang dẫn đầu <strong>#1</strong> môn ${me(o.shortVi)}!`,y=s.length>0?s.map(C=>this.renderStandingRowHtml(C)).join(""):`
          <tr>
            <td colspan="6" class="cc-lb-empty-cell">
              Chưa có phù thủy nào thuộc Nhà này trên bảng xếp hạng. Hãy vượt ải ghi điểm ngay!
            </td>
          </tr>
        `;return`
      ${this.renderHouseCupGridHtml(p)}
      ${this.renderProfileDrawerHtml(c)}
      ${this.renderControlsBarHtml(d)}

      <div class="cc-lb-status-strip">
        <div class="cc-lb-status-me">
          <img src="${o.spriteIcon}" alt="" class="cc-lb-status-icon" />
          <span>Hạng của bạn: <strong>#${r}/${l}</strong></span>
          <span class="cc-league-pill tier-${a.league.tierId}">
            ${a.league.icon} ${me(a.league.labelVi)}
          </span>
          <span class="cc-lb-me-stars"><span class="cc-star-glyph" aria-hidden="true">★</span> ${a.stars.toLocaleString("vi-VN")}</span>
        </div>
        <div class="cc-lb-status-chase">${g}</div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="ccLbTableCaption" class="cc-lb-table-wrap">
        <table
          class="cc-lb-table"
          style="--label-3: 'Nhà'; --label-4: 'Tiến độ'; --label-5: 'Sao'; --label-6: 'Tổng điểm';"
        >
          <caption id="ccLbTableCaption" class="cc-lb-caption">
            ${me(o.cupTitleVi)} — Hiển thị ${s.length}/${l} phù thủy
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Phù Thủy</th>
              <th scope="col">Nhà</th>
              <th scope="col">Màn</th>
              <th scope="col">Sao</th>
              <th scope="col">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody id="lb-tbody">
            ${y}
          </tbody>
        </table>
      </div>
    `}renderPersonalThreeGamesViewHtml(){const t=this.sim.getMinigameLeaderboard(this.activeGameId,"valley","all"),o=this.sim.getAllPersonalLeaderboardSummaries().map(s=>{const a=s.gameId===this.activeGameId,r=_i(s.valleyRank),l=s.primaryValue>=Ai?"👑 777/777":`Màn ${Math.max(0,s.primaryValue)}/777`;return`
          <tr class="${a?"me-row":""}">
            <td class="cc-lb-rank-cell"><strong>${me(r)}</strong></td>
            <th scope="row" class="cc-lb-name-cell">
              <div class="cc-lb-name-wrap">
                <span class="cc-lb-mobile-rank" aria-hidden="true">${me(r)}</span>
                <img src="${s.meta.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
                <span class="cc-lb-wiz-name">${me(s.meta.shortVi)}</span>
                <button
                  type="button"
                  class="cc-lb-visit-btn"
                  data-lb-jump-play="${s.gameId}"
                  aria-label="Chơi ngay ${me(s.meta.shortVi)}"
                >▶️ Chơi</button>
              </div>
            </th>
            <td>
              <span class="cc-league-pill tier-${s.league.tierId}">${s.league.icon} ${me(s.league.labelVi)}</span>
            </td>
            <td>${me(l)}</td>
            <td><span class="cc-star-glyph" aria-hidden="true">★</span> ${s.stars.toLocaleString("vi-VN")}</td>
            <td><strong class="cc-lb-score-val">${s.ratingScore.toLocaleString("vi-VN")}</strong></td>
          </tr>
        `}).join("");return`
      ${this.renderHouseCupGridHtml(t.houseStandings)}
      ${this.renderProfileDrawerHtml(t.playerHouse)}
      ${this.renderControlsBarHtml(t.includeSeededRivals)}

      <div tabindex="0" role="region" aria-labelledby="ccLbPersonalCaption" class="cc-lb-table-wrap">
        <table
          class="cc-lb-table"
          style="--label-3: 'Danh hiệu'; --label-4: 'Tiến độ'; --label-5: 'Sao'; --label-6: 'Tổng điểm';"
        >
          <caption id="ccLbPersonalCaption" class="cc-lb-caption">
            Kỷ lục cá nhân trên 4 bộ môn tranh Cúp 4 Nhà Hogwarts
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bộ Môn</th>
              <th scope="col">Danh Hiệu</th>
              <th scope="col">Màn</th>
              <th scope="col">Sao</th>
              <th scope="col">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${o}
          </tbody>
        </table>
      </div>
    `}selectGameDiscipline(t,n=!1){Nt.includes(t)&&(this.sim.audio.playClick(),this.activeGameId=t,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),this.scrollSelectedGameTabIntoView(n),Li(this.sim.state,t).catch(()=>{}).then(()=>Mi(t)).then(()=>{this.activeGameId===t&&!this.profileDrawerOpen&&this.render()}))}bindEvents(t){const n=Array.from(t.querySelectorAll("[data-lb-game]"));n.forEach((s,a)=>{s.addEventListener("click",()=>{const r=s.dataset.lbGame;r&&this.selectGameDiscipline(r,!1)}),s.addEventListener("keydown",r=>{if(n.length===0)return;let l=-1;if(r.key==="ArrowRight"?l=(a+1)%n.length:r.key==="ArrowLeft"?l=(a-1+n.length)%n.length:r.key==="Home"?l=0:r.key==="End"&&(l=n.length-1),l>=0){r.preventDefault();const i=n[l]?.dataset.lbGame;i&&this.selectGameDiscipline(i,!0)}})}),t.querySelectorAll("[data-lb-scope]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbScope;a&&(this.sim.audio.playClick(),this.activeScope=a,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbHouseFilter;a&&(this.sim.audio.playClick(),a==="all"?this.activeHouseFilter="all":rt.includes(a)&&(this.activeHouseFilter=a),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbHouseCard;!a||!rt.includes(a)||(this.sim.audio.playClick(),this.activeScope==="personal"&&(this.activeScope="valley"),this.activeHouseFilter=this.activeHouseFilter===a?"all":a,this.render())})}),t.querySelector("#btnLbToggleProfile")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!this.profileDrawerOpen,this.profileDrawerOpen&&(this.profileDraftName=this.getCurrentWizardDisplayName(),this.profileDraftHouse=this.sim.getPlayerHouse()),this.render(),this.profileDrawerOpen&&t.querySelector("#ccWizardNameInput")?.focus()}),t.querySelector("#btnLbCloseProfileDrawer")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!1,this.render()});const o=t.querySelector("#ccWizardNameInput");o?.addEventListener("input",()=>{this.profileDraftName=o.value}),t.querySelectorAll('input[name="ccWizardHouse"]').forEach(s=>{s.addEventListener("change",()=>{const a=s.value;if(!rt.includes(a))return;this.sim.audio.playClick(),this.profileDraftHouse=a;const r=lt[a];this.sortingHatAnnouncement=`${r.patronusEmoji} ${r.house}: ${r.quoteVi}`,t.querySelectorAll(".cc-house-option").forEach(i=>{i.classList.toggle("selected",i.dataset.ccHouseOpt===a)});const l=t.querySelector("#ccSortingHatQuote");l&&(l.textContent=this.sortingHatAnnouncement)})}),t.querySelector("#btnLbRandomHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0,o&&(this.profileDraftName=o.value);const s=this.sim.rollPlayerSortingHat(this.activeGameId);let a=0;const r=7,l=()=>{if(a+=1,a<r){const p=rt[Math.floor(Math.random()*rt.length)]??s;this.profileDraftHouse=p,t.querySelectorAll(".cc-house-option").forEach(c=>{c.classList.toggle("selected",c.dataset.ccHouseOpt===p)}),window.setTimeout(l,65);return}this.sortingHatSpinning=!1,this.profileDraftHouse=s;const i=lt[s];this.sortingHatAnnouncement=`🎩 NÓN PHÂN LOẠI CHỌN: “${i.house.toUpperCase()}!” — ${i.quoteVi}`,this.activeHouseFilter!=="all"&&(this.activeHouseFilter=s),this.render(),this.showInDialogToast(`🎩 Nón Phân Loại đã chọn Nhà ${i.house} cho bạn!`)};l()}),t.querySelector("#ccLbProfileForm")?.addEventListener("submit",s=>{s.preventDefault();const a=o?.value??this.getCurrentWizardDisplayName(),r=this.profileDraftHouse??this.sim.getPlayerHouse();this.sim.ensureNeighborSocial();const l=Ta(this.sim.state,a,r);l.houseLockedByServer?(this.sim.saveToStorage(),this.sim.onUiChange?.(),Li(this.sim.state,this.activeGameId)):this.sim.setPlayerHouse(l.house,this.activeGameId),this.profileDrawerOpen=!1,this.profileDraftName=l.name,this.profileDraftHouse=l.house,this.render(),this.showInDialogToast(`✨ Đã lưu hồ sơ Phù Thủy ${l.name} (${l.house})!`)}),t.querySelector("#btnLbExportCsv")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeScope==="friends"?"friends":"valley",a=$a(this.sim.state,this.activeGameId,s,this.activeHouseFilter,Ca(this.activeGameId)),r=new Blob(["\uFEFF"+a],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(r),i=document.createElement("a"),p=new Date().toISOString().slice(0,10);i.href=l,i.download=`bxh-${this.activeGameId}-hpvn-${p}.csv`,i.click(),URL.revokeObjectURL(l),this.showInDialogToast("📥 Đã xuất file CSV Bảng Xếp Hạng!")}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeGameId;this.close(),this.onJumpToGame?.(s)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbJumpPlay;a&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(a))})}),t.querySelectorAll("[data-lb-visit]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbVisit;a&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(a))})})}}const Ui=1,Sn=3,So=6,Wi=.15,wo="hangsoc_minigame_orient_v1",xo=8,To=110;function Vt(e){return e==="jigsaw"?So:Sn}function kt(e,t=Sn){if(!Number.isFinite(e))return 1;const n=typeof t=="string"?Vt(t):t,o=Number.isFinite(n)&&n>=Ui?n:Sn,s=Math.min(o,Math.max(Ui,e));return Math.round(s*1e3)/1e3}function Fn(e,t){return((Math.round(e)+Math.round(t))%4+4)%4}function $o(e,t,n,o=!1,s=!1){const a=Math.max(1,t||1024),r=Math.max(1,n||768),l=s?a>=881||a>r*1.05&&a>=560:a>=980||a>r*1.06&&a>=560;return e==="auto"?{effectiveLayout:l?"landscape":"portrait",dialogQuarterTurn:0}:e==="landscape"?a<r?{effectiveLayout:"landscape",dialogQuarterTurn:o?3:1}:{effectiveLayout:"landscape",dialogQuarterTurn:0}:a>r&&r<=640?{effectiveLayout:"portrait",dialogQuarterTurn:o?1:3}:{effectiveLayout:"portrait",dialogQuarterTurn:0}}function _n(e,t,n,o){const s=(e-n.left)/Math.max(1,n.width),a=(t-n.top)/Math.max(1,n.height);switch(o){case 1:return{lu:a,lv:1-s};case 2:return{lu:1-s,lv:1-a};case 3:return{lu:1-a,lv:s};default:return{lu:s,lv:a}}}function ji(e,t,n){switch(n){case 1:return{vx:t,vy:-e};case 2:return{vx:-e,vy:-t};case 3:return{vx:-t,vy:e};default:return{vx:e,vy:t}}}function Qi(e){const{prevZoom:t,nextZoom:n,prevPanX:o,prevPanY:s,prevMidOffsetX:a,prevMidOffsetY:r,currMidOffsetX:l,currMidOffsetY:i,maxZoom:p=Sn}=e,c=n<=1.015?1:kt(n,p);if(c<=1.001)return{zoom:1,panX:0,panY:0};const d=Math.max(.25,t||1),g=c/d;return{zoom:c,panX:l-(a-o)*g,panY:i-(r-s)*g}}function Co(e,t,n,o,s){if(s%2===0||e<=10||t<=10||n<=10||o<=10)return 1;const a=e/o,r=t/n;return Math.min(1,Math.max(.45,Math.min(a,r)))}function ko(e,t,n,o=1){const s=Math.max(120,Math.floor(Number.isFinite(t)?t:320)),a=Math.max(120,Math.floor(Number.isFinite(n)?n:320));if(e==="blocks"||e==="jigsaw"||e==="seedquiz"||!Number.isFinite(o)||o<=0)return{width:s,height:a};const r=Math.min(3,Math.max(.33,o));let l=s,i=Math.round(l/r);return i>a&&(i=a,l=Math.round(i*r)),{width:Math.max(120,Math.min(s,l)),height:Math.max(120,Math.min(a,i))}}function Mo(e,t,n,o,s,a,r,l){if(n<=0||o<=0||s<=0||a<=0||r<=1.005)return{panX:0,panY:0};const i=l%2===1?a:s,p=l%2===1?s:a,c=i*r,d=p*r,g=36,y=36,C=Math.max(0,(c-n)*.5+g),u=Math.max(0,(d-o)*.5+y),m=Math.min(C,Math.max(-C,Number.isFinite(e)?e:0)),T=Math.min(u,Math.max(-u,Number.isFinite(t)?t:0));return{panX:Math.abs(m)<.5?0:Math.round(m*10)/10,panY:Math.abs(T)<.5?0:Math.round(T*10)/10}}class Ao{constructor(){v(this,"states",new Map);v(this,"orientationPref","auto");v(this,"dialogFlip180",!1);v(this,"spacePressed",!1);v(this,"lastPinchEndMs",0);v(this,"activePinchCount",0);v(this,"stageCleanupByHost",new Map);try{typeof sessionStorage<"u"&&sessionStorage.removeItem(wo)}catch{}typeof window<"u"&&(window.addEventListener("keydown",t=>{if(t.code==="Space"){const n=t.target?.tagName;n!=="INPUT"&&n!=="TEXTAREA"&&n!=="BUTTON"&&(this.spacePressed=!0)}}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1)}),window.addEventListener("blur",()=>{this.spacePressed=!1}))}isPinchOrCooldownActive(){return this.activePinchCount>=2?!0:(typeof performance<"u"?performance.now():Date.now())-this.lastPinchEndMs<To}getState(t){let n=this.states.get(t);return n||(n={zoom:1,panX:0,panY:0,boardQuarterTurns:0,panMode:!1},this.states.set(t,n)),n}getOrientationPref(){return this.orientationPref}setOrientationPref(t){this.orientationPref=t,this.dialogFlip180=!1}getViewportResolution(t=!1){const n=typeof window<"u"?Math.round(window.visualViewport?.width||window.innerWidth):1280,o=typeof window<"u"?Math.round(window.visualViewport?.height||window.innerHeight):800;return $o(this.orientationPref,n,o,this.dialogFlip180,t)}unbindStageInteractions(t){const n=this.stageCleanupByHost.get(t);n&&(this.stageCleanupByHost.delete(t),n())}getEffectiveLayout(t=!1){return this.getViewportResolution(t).effectiveLayout}getNetQuarterTurns(t){const n=this.getState(t),{dialogQuarterTurn:o}=this.getViewportResolution(t==="seedquiz");return Fn(o,n.boardQuarterTurns)}toggleOrientation(t=!1){const o=this.getEffectiveLayout(t)==="landscape"?"portrait":"landscape";this.setOrientationPref(o);for(const s of this.states.values())s.panX=0,s.panY=0;return o}stepZoom(t,n){const o=this.getState(t);return o.zoom=kt(o.zoom+n,Vt(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}setZoom(t,n){const o=this.getState(t);return o.zoom=kt(n,Vt(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}resetView(t){const n=this.getState(t);n.zoom=1,n.panX=0,n.panY=0,n.boardQuarterTurns=0,n.panMode=!1}rotate90(t){const n=this.getState(t);return n.boardQuarterTurns=Fn(n.boardQuarterTurns,1),n.panX=0,n.panY=0,n.boardQuarterTurns}togglePanMode(t){const n=this.getState(t);return n.panMode=!n.panMode,n.panMode}renderToolbarHtml(t,n){return""}syncToolbarDOM(t,n){}applyDialogOrientation(t,n,o=!1){const s=this.getViewportResolution(o),a=String(s.dialogQuarterTurn*90);return t?.dataset&&(t.dataset.mgLayout=s.effectiveLayout,t.dataset.mgRotate=a),n?.dataset&&(n.dataset.mgLayout=s.effectiveLayout,n.dataset.mgRotate=a),s}clearDialogOrientation(t,n){t?.dataset&&(delete t.dataset.mgLayout,delete t.dataset.mgRotate),n?.dataset&&(delete n.dataset.mgLayout,delete n.dataset.mgRotate)}applyCanvasStageTransform(t,n,o){const s=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(!1),r=Fn(a,s.boardQuarterTurns);if(!n||!o)return{effectiveScale:s.zoom,netQuarterTurns:r};const l=n.clientWidth,i=n.clientHeight,p=o.offsetWidth,c=o.offsetHeight,d=Co(l,i,p,c,s.boardQuarterTurns),g=s.zoom*d,y=Mo(s.panX,s.panY,l,i,p,c,g,s.boardQuarterTurns);return s.panX=y.panX,s.panY=y.panY,n.dataset.mgPanMode=String(s.panMode),s.panX===0&&s.panY===0&&Math.abs(g-1)<.002&&s.boardQuarterTurns===0?(o.style.transform="",o.style.transformOrigin=""):(o.style.transformOrigin="center center",o.style.transform=s.boardQuarterTurns===0?`translate3d(${s.panX}px, ${s.panY}px, 0) scale(${g.toFixed(4)})`:`translate3d(${s.panX}px, ${s.panY}px, 0) scale(${g.toFixed(4)}) rotate(${s.boardQuarterTurns*90}deg)`),{effectiveScale:g,netQuarterTurns:r}}applyDomScrollStageTransform(t,n,o){const s=this.getState("seedquiz");if(!t||!n||!o)return;const a=s.zoom,r=s.boardQuarterTurns;if(Math.abs(a-1)<.002&&r===0){o.style.transform="",o.style.transformOrigin="",o.style.width="",n.style.width="",n.style.height="";return}o.style.width="100%";const l=o.offsetWidth||t.clientWidth||640,i=o.offsetHeight||480;if(r===0)o.style.transformOrigin="0 0",o.style.transform=`scale(${a.toFixed(4)})`,n.style.width=`${Math.ceil(l*a)}px`,n.style.height=`${Math.ceil(i*a)}px`;else{const p=r*90,c=(r%2===1?i:l)*a,d=(r%2===1?l:i)*a;n.style.width=`${Math.ceil(c)}px`,n.style.height=`${Math.ceil(d)}px`,o.style.transformOrigin="center center";const g=(c-l)*.5,y=(d-i)*.5;o.style.transform=`translate3d(${g.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${a.toFixed(4)}) rotate(${p}deg)`}}bindCanvasStageInteractions(t){const{gameId:n,hostKey:o,panAreaEl:s,canvasShellEl:a,canvasEl:r,getBoardAspectRatio:l,onStageResized:i,canSingleFingerPanAt:p,onTransformUpdated:c}=t,d=o??(n==="match3"?"match3":"arcade");if(this.unbindStageInteractions(d),!s||!a)return;const g=()=>{this.applyCanvasStageTransform(n,s,a),c()};let y=0,C=0,u=0,m=0;const T=(q=!1)=>{if(!r||!s.isConnected)return;const _=Math.floor(s.clientWidth),ee=Math.floor(s.clientHeight);if(_<=24||ee<=24)return;const B=n==="blocks"||n==="jigsaw",j=B?_:Math.max(120,_-2),oe=B?ee:Math.max(120,ee-4),le=l?l(_,ee):B?0:1,re=ko(n,j,oe,le);if(!(q||re.width!==y||re.height!==C||_!==u||ee!==m))return;y=re.width,C=re.height,u=_,m=ee,a.style.width=`${re.width}px`,a.style.height=`${re.height}px`;const de=B?"auto":`${re.width} / ${re.height}`;a.style.aspectRatio=de,r.style.aspectRatio=de,i?.(_,ee,re.width,re.height),this.applyCanvasStageTransform(n,s,a),c()},L=q=>{q.touches&&q.touches.length>=2&&q.preventDefault()};s.addEventListener("touchmove",L,{passive:!1});const $=q=>{q.preventDefault()};s.addEventListener("gesturestart",$,{passive:!1}),s.addEventListener("gesturechange",$,{passive:!1}),s.addEventListener("wheel",q=>{q.preventDefault();const _=this.getState(n),ee=q.ctrlKey?.009:.0018,B=_.zoom*Math.exp(-q.deltaY*ee),j=s.getBoundingClientRect(),{dialogQuarterTurn:oe}=this.getViewportResolution(!1),{lu:le,lv:re}=_n(q.clientX,q.clientY,j,oe),be=(le-.5)*s.clientWidth,de=(re-.5)*s.clientHeight,fe=Qi({prevZoom:_.zoom,nextZoom:B,prevPanX:_.panX,prevPanY:_.panY,prevMidOffsetX:be,prevMidOffsetY:de,currMidOffsetX:be,currMidOffsetY:de,maxZoom:Vt(n)});fe.zoom===_.zoom&&fe.panX===_.panX&&fe.panY===_.panY||(_.zoom=fe.zoom,_.panX=fe.panX,_.panY=fe.panY,g())},{passive:!1}),s.addEventListener("contextmenu",q=>{this.getState(n).zoom>1.01&&q.preventDefault()});const k=new Map;let f=!1,h=0,S=0,E=0,x=null,M=null,R=0,V=0;const P=q=>{if(r){try{r.releasePointerCapture?.(q)}catch{}if(typeof PointerEvent<"u")try{r.dispatchEvent(new PointerEvent("pointercancel",{pointerId:q,bubbles:!0}))}catch{}}};s.addEventListener("pointerdown",q=>{if(q.pointerType==="touch"){if(k.set(q.pointerId,{x:q.clientX,y:q.clientY}),this.activePinchCount=k.size,k.size>=2){x=null;const j=Array.from(k.values());if(h=Math.max(10,Math.hypot(j[1].x-j[0].x,j[1].y-j[0].y)),S=(j[0].x+j[1].x)*.5,E=(j[0].y+j[1].y)*.5,f){P(q.pointerId);try{s.setPointerCapture?.(q.pointerId)}catch{}}else{f=!0;for(const oe of k.keys()){P(oe);try{s.setPointerCapture?.(oe)}catch{}}}q.stopPropagation(),q.preventDefault();return}this.getState(n).zoom>1.02&&p&&p(q.clientX,q.clientY)?x={pointerId:q.pointerId,startX:q.clientX,startY:q.clientY,lastX:q.clientX,lastY:q.clientY,active:!1}:x=null;return}const _=this.getState(n);if(q.button===1||q.button===2&&_.zoom>1.01||q.button===0&&_.zoom>1.01&&(q.altKey||this.spacePressed)){M=q.pointerId,R=q.clientX,V=q.clientY,s.dataset.mgDragging="true";try{s.setPointerCapture?.(q.pointerId)}catch{}q.stopPropagation(),q.preventDefault()}},{capture:!0}),s.addEventListener("pointermove",q=>{if(q.pointerType==="touch"&&k.has(q.pointerId)){if(k.set(q.pointerId,{x:q.clientX,y:q.clientY}),f&&k.size>=2){const _=Array.from(k.values()),ee=Math.max(10,Math.hypot(_[1].x-_[0].x,_[1].y-_[0].y)),B=(_[0].x+_[1].x)*.5,j=(_[0].y+_[1].y)*.5,oe=this.getState(n),le=oe.zoom*(ee/Math.max(10,h)),re=s.getBoundingClientRect(),{dialogQuarterTurn:be}=this.getViewportResolution(!1),de=_n(S,E,re,be),fe=_n(B,j,re,be),et=(de.lu-.5)*s.clientWidth,ge=(de.lv-.5)*s.clientHeight,$e=(fe.lu-.5)*s.clientWidth,Me=(fe.lv-.5)*s.clientHeight,J=Qi({prevZoom:oe.zoom,nextZoom:le,prevPanX:oe.panX,prevPanY:oe.panY,prevMidOffsetX:et,prevMidOffsetY:ge,currMidOffsetX:$e,currMidOffsetY:Me,maxZoom:Vt(n)});oe.zoom=J.zoom,oe.panX=J.panX,oe.panY=J.panY,h=ee,S=B,E=j,g(),q.stopPropagation(),q.preventDefault();return}if(f){q.stopPropagation(),q.preventDefault();return}if(x&&x.pointerId===q.pointerId){const _=Math.hypot(q.clientX-x.startX,q.clientY-x.startY);if(!x.active&&_>=xo){x.active=!0,x.lastX=q.clientX,x.lastY=q.clientY,s.dataset.mgDragging="true",P(q.pointerId);try{s.setPointerCapture?.(q.pointerId)}catch{}}if(x.active){const ee=this.getState(n),{dialogQuarterTurn:B}=this.getViewportResolution(!1),j=ji(q.clientX-x.lastX,q.clientY-x.lastY,B);ee.panX+=j.vx,ee.panY+=j.vy,x.lastX=q.clientX,x.lastY=q.clientY,g(),q.stopPropagation(),q.preventDefault();return}}}if(M===q.pointerId){const _=this.getState(n),{dialogQuarterTurn:ee}=this.getViewportResolution(!1),B=ji(q.clientX-R,q.clientY-V,ee);_.panX+=B.vx,_.panY+=B.vy,R=q.clientX,V=q.clientY,g(),q.stopPropagation(),q.preventDefault()}},{capture:!0});const W=q=>{if(q.pointerType==="touch"&&k.has(q.pointerId)){k.delete(q.pointerId),this.activePinchCount=k.size;try{s.releasePointerCapture?.(q.pointerId)}catch{}if(f){if(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now(),k.size===0)f=!1;else if(k.size>=2){const _=Array.from(k.values());h=Math.max(10,Math.hypot(_[1].x-_[0].x,_[1].y-_[0].y)),S=(_[0].x+_[1].x)*.5,E=(_[0].y+_[1].y)*.5}q.stopPropagation(),q.preventDefault();return}if(x&&x.pointerId===q.pointerId){const _=x.active;if(x=null,delete s.dataset.mgDragging,_){q.stopPropagation(),q.preventDefault();return}}}if(M===q.pointerId){M=null,delete s.dataset.mgDragging;try{s.releasePointerCapture?.(q.pointerId)}catch{}q.stopPropagation(),q.preventDefault()}};s.addEventListener("pointerup",W,{capture:!0}),s.addEventListener("pointercancel",W,{capture:!0});let D=0;const Y=()=>{D||(typeof requestAnimationFrame=="function"?D=requestAnimationFrame(()=>{D=0,T(!1)}):T(!1))};let Z=null;r&&typeof ResizeObserver<"u"&&(Z=new ResizeObserver(()=>{Y()}),Z.observe(s));const ie=typeof window<"u"?window.visualViewport:null,N=()=>{Y()};r&&ie&&ie.addEventListener("resize",N),this.stageCleanupByHost.set(d,()=>{D&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(D),D=0),Z?.disconnect(),Z=null,ie?.removeEventListener("resize",N)}),T(!0),this.applyCanvasStageTransform(n,s,a)}bindDomScrollStageInteractions(t){const{scrollViewportEl:n,sizerEl:o,contentStageEl:s}=t,a="seedquiz",r=()=>{this.applyDomScrollStageTransform(n,o,s)};if(!n||!o||!s)return;const l=m=>{m.preventDefault()};n.addEventListener("gesturestart",l,{passive:!1}),n.addEventListener("gesturechange",l,{passive:!1}),n.addEventListener("wheel",m=>{if(!m.ctrlKey&&!m.metaKey)return;m.preventDefault();const T=this.getState(a),L=T.zoom,$=L*Math.exp(-m.deltaY*.007),k=$<=1.015?1:kt($);if(k===L)return;const f=n.getBoundingClientRect(),h=m.clientX-f.left,S=m.clientY-f.top,E=n.scrollLeft,x=n.scrollTop;T.zoom=k,r();const M=T.zoom/Math.max(.25,L);n.scrollLeft=Math.max(0,(E+h)*M-h),n.scrollTop=Math.max(0,(x+S)*M-S)},{passive:!1});let i=0,p=0,c=0,d=!1;n.addEventListener("touchstart",m=>{if(m.touches.length>=2){d=!0,this.activePinchCount=m.touches.length;const T=m.touches[0],L=m.touches[1];i=Math.max(10,Math.hypot(L.clientX-T.clientX,L.clientY-T.clientY));const $=n.getBoundingClientRect();p=(T.clientX+L.clientX)*.5-$.left,c=(T.clientY+L.clientY)*.5-$.top}},{passive:!0}),n.addEventListener("touchmove",m=>{if(m.touches.length<2)return;m.preventDefault(),d=!0;const T=m.touches[0],L=m.touches[1],$=Math.max(10,Math.hypot(L.clientX-T.clientX,L.clientY-T.clientY)),k=n.getBoundingClientRect(),f=(T.clientX+L.clientX)*.5-k.left,h=(T.clientY+L.clientY)*.5-k.top;if(i>0){const S=this.getState(a),E=S.zoom,x=E*($/i),M=x<=1.015?1:kt(x),R=n.scrollLeft,V=n.scrollTop;S.zoom=M,r();const P=S.zoom/Math.max(.25,E);n.scrollLeft=Math.max(0,(R+p)*P-f),n.scrollTop=Math.max(0,(V+c)*P-h)}i=$,p=f,c=h},{passive:!1});const g=m=>{if(this.activePinchCount=m.touches.length,m.touches.length<2)i>0&&(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now()),i=0;else{const T=m.touches[0],L=m.touches[1];i=Math.max(10,Math.hypot(L.clientX-T.clientX,L.clientY-T.clientY));const $=n.getBoundingClientRect();p=(T.clientX+L.clientX)*.5-$.left,c=(T.clientY+L.clientY)*.5-$.top}};n.addEventListener("touchend",g,{passive:!0}),n.addEventListener("touchcancel",g,{passive:!0});const y=new Map;let C=0;n.addEventListener("pointerdown",m=>{if(!(m.pointerType!=="touch"||d)&&(y.set(m.pointerId,{x:m.clientX,y:m.clientY}),y.size>=2)){const T=Array.from(y.values());C=Math.max(10,Math.hypot(T[1].x-T[0].x,T[1].y-T[0].y))}},{passive:!0}),n.addEventListener("pointermove",m=>{if(!(m.pointerType!=="touch"||d||!y.has(m.pointerId))&&(y.set(m.pointerId,{x:m.clientX,y:m.clientY}),y.size>=2&&C>0)){const T=Array.from(y.values()),L=Math.max(10,Math.hypot(T[1].x-T[0].x,T[1].y-T[0].y)),$=this.getState(a),k=$.zoom*(L/C);$.zoom=k<=1.015?1:kt(k),C=L,r(),m.preventDefault()}},{passive:!1});const u=m=>{y.delete(m.pointerId),y.size<2&&(C=0)};n.addEventListener("pointerup",u,{passive:!0}),n.addEventListener("pointercancel",u,{passive:!0}),r()}}const it=new Ao;function ue(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Gn=["en","ko","zh","es","ja"],Vn=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class Lo{constructor(t,n,o,s,a){v(this,"root");v(this,"sim");v(this,"onRefreshHud");v(this,"onToast");v(this,"onEquipAndSow");v(this,"targetCropId","ottery_wheat");v(this,"pendingPlotUid",null);v(this,"challenge",null);v(this,"answeredOutcome",null);v(this,"selectedChoiceIdx",null);v(this,"placedTokenIndices",[]);v(this,"selectedLeftPairId",null);v(this,"matchedPairIds",new Set);v(this,"flashWrongPairKey",null);v(this,"pairMistakes",0);v(this,"cropFilter","all");v(this,"activeSubView","practice");v(this,"codexQuery","");v(this,"codexBoxFilter","all");v(this,"sessionShownQids",new Set);v(this,"skipFormatOffset",0);v(this,"starterChallengePendingPack",!1);v(this,"dialogCloseBound",!1);v(this,"onOpenLeaderboard");if(this.root=t,this.sim=n,this.onRefreshHud=o,this.onToast=s,this.onEquipAndSow=a,typeof window<"u"){const r=()=>{if(!this.isOpen())return;const l=this.getDialog(),i=typeof l?.querySelector=="function"?l.querySelector(".sq-modal-inner"):null;it.applyDialogOrientation(l,i,!0),this.syncSeedQuizViewportTransform()};window.addEventListener("resize",r),window.visualViewport?.addEventListener("resize",r),window.addEventListener("keydown",l=>{if(!this.isOpen())return;const i=l.target?.tagName;i==="INPUT"||i==="TEXTAREA"||i==="SELECT"||(l.key==="+"||l.key==="="?(l.preventDefault(),it.stepZoom("seedquiz",Wi),this.syncSeedQuizViewportTransform()):l.key==="-"||l.key==="_"?(l.preventDefault(),it.stepZoom("seedquiz",-Wi),this.syncSeedQuizViewportTransform()):l.key==="0"&&(l.ctrlKey||l.metaKey)&&(l.preventDefault(),it.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))})}}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=t.querySelector("#sqScrollViewport"),o=t.querySelector("#sqZoomSizer"),s=t.querySelector("#sqZoomStage");it.applyDomScrollStageTransform(n,o,s),it.syncToolbarDOM(t,"seedquiz")}open(t,n,o,s,a,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(ke).filter(d=>this.sim.state.sandboxMode||this.sim.state.level>=d.unlockLevel);if(t&&ke[t]){const d=ke[t];this.sim.state.sandboxMode||this.sim.state.level>=d.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!ke[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=n??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const i=this.sim.ensureLanguageQuiz();let p=!this.challenge||this.answeredOutcome!==null;o&&Gn.includes(o)&&i.activeLang!==o&&(i.activeLang=o,p=!0),s&&(s==="beginner"||s==="intermediate"||s==="advanced")&&(Ei(i,i.activeLang,s),p=!0),a&&Vn.includes(a)&&(i.preferredFormat=a,p=!0),p||this.challenge?.lang!==i.activeLang?(this.challenge&&!this.answeredOutcome&&Ot(i,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(i.activeLang,!1),this.render());const c=this.root.querySelector("#seedQuizDialog");c&&!c.open&&c.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const n=this.sessionShownQids.values().next().value;if(n===void 0)break;this.sessionShownQids.delete(n)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,n=!1){An(t)||ra(t).then(o=>{const s=this.sim.ensureLanguageQuiz();if(s.activeLang===t){if(o){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=Pi(s,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),n&&s.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&De(a,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),n&&s.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&De(a,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const n=this.sim.ensureLanguageQuiz(),o=An(n.activeLang);this.challenge=Pi(n,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),o?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(n.activeLang,t)),this.sim.saveToStorage(),this.render();const s=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(s&&(s.scrollTop=0),o&&t&&n.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&De(a,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const n=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=n,this.sim.ensureLanguageQuiz().autoSpeak&&De(this.challenge.fullSentence,this.challenge.lang,.95);const s=ke[this.targetCropId];if(n.correct){const a=n.tierAutoPromoted?` • Thăng hạng ${Dt[this.challenge.lang].tierLabels[n.tierAutoPromoted]}!`:"",r=n.phoenixTalismanAwarded?` • 🔥 +${n.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=n.buildReduction&&n.buildReduction.reducedSec>0?` • 🔨 -${Ae(n.buildReduction.reducedSec)} xây ${n.buildReduction.targetName??"công trình"}!`:"",i=n.leaderboardRankUp&&n.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${n.leaderboardRankUp.newRank} (+${n.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${n.seedsAwarded} hạt ${s.emoji} ${s.name} (Túi: ${n.newSeedCount} hạt)${l}${a}${r}${i}`,n.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const n=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,n)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=this.getDialog(),o=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;n&&typeof n.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,n.addEventListener("close",()=>{if(typeof window<"u"&&"speechSynthesis"in window)try{window.speechSynthesis.cancel()}catch{}it.clearDialogOrientation(n,o)})),it.applyDialogOrientation(n,o,!0);const s=t.querySelector("#sqScrollViewport"),a=s?s.scrollTop:0,r=s?s.scrollLeft:0,l=this.sim.ensureLanguageQuiz(),i=l.activeLang,p=Dt[i],c=l.profiles[i],d=ke[this.targetCropId],g=this.sim.getSeedCount(this.targetCropId),y=this.sim.getFarmItemCount(this.targetCropId),C=this.sim.state.galleons,u=d.seedCost,m=d.seedCost*3,T=C>=u,L=C>=m,$=ka(c,this.sim.state.level),k=c.totalAnswered>0?Math.round(c.totalCorrect/c.totalAnswered*100):100,f=Ma(c),h=la(i),S=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),E=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let x="";if(this.pendingPlotUid){const B=this.sim.state.buildings.find(j=>j.uid===this.pendingPlotUid);B&&ne(B.itemId)?.isFarmlandPlot&&!B.cropId&&(x=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${B.gx}, ${B.gy}]</strong></span>
            ${g>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${g})</button>`:""}
          </div>
        `)}const M=Object.values(ke).sort((B,j)=>B.unlockLevel-j.unlockLevel||B.growSec-j.growSec),R=M.filter(B=>B.isFlowerCrop).length,V=M.length-R,P=M.filter(B=>this.cropFilter==="flowers"?!!B.isFlowerCrop:this.cropFilter==="crops"?!B.isFlowerCrop:!0),W=[{id:"all",label:`🌱 (${M.length})`},{id:"flowers",label:`🌸 Hoa (${R})`},{id:"crops",label:`🌾 Cây (${V})`}].map(B=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===B.id?"active":""}"
            data-sq-crop-filter="${B.id}"
            aria-pressed="${this.cropFilter===B.id}"
          >${B.label}</button>
        `).join(""),D=P.map(B=>{const j=!this.sim.state.sandboxMode&&this.sim.state.level<B.unlockLevel,oe=B.id===this.targetCropId,le=this.sim.getSeedCount(B.id),re=Ae(B.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${oe?"active":""} ${j?"locked":""}"
            data-sq-crop="${B.id}"
            aria-pressed="${oe}"
            ${j?"disabled":""}
            title="${j?`Lv.${B.unlockLevel} (⏱️ ${re})`:`${B.name} • ⏱️ ${re} • 🪙 ${B.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${Wt(B.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${ue(B.name)}</span>
              <span class="sq-crop-pill-sub">
                ${j?`🔒 Lv.${B.unlockLevel}`:`🌱 ${le} • ⏱️${re}`}
              </span>
            </span>
          </button>
        `}).join(""),Y={en:"Anh",ko:"Hàn",zh:"Trung",es:"TBN",ja:"Nhật"},Z=Gn.map(B=>{const j=Dt[B],oe=l.profiles[B],le=B===i;return`
        <button
          type="button"
          class="sq-lang-tab ${le?"active":""}"
          data-sq-lang="${B}"
          aria-pressed="${le}"
          title="${j.flag} ${ue(j.academyVi)} — ${ue(j.tierLabels[oe.tier])}"
        >
          <span class="sq-lang-flag">${j.flag}</span>
          <span class="sq-lang-text">
            <strong>${Y[B]}</strong>
            <small>Lv.${oe.masteryScore}</small>
          </span>
        </button>
      `}).join(""),N=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(B=>{const j=c.tier===B.id;return`
          <button
            type="button"
            class="sq-tier-btn ${j?"active":""}"
            data-sq-tier="${B.id}"
            aria-pressed="${j}"
          >
            <span>${B.icon} ${ue(p.tierLabels[B.id])}</span>
            <small>${B.rewardTag}</small>
          </button>
        `}).join(""),q=Vn.map(B=>{const j=$i[B],oe=l.preferredFormat===B;return`
        <button
          type="button"
          class="sq-format-chip ${oe?"active":""}"
          data-sq-format="${B}"
          aria-pressed="${oe}"
        >
          ${j.icon} ${ue(j.labelVi)}
        </button>
      `}).join(""),_=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
        ${x}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${W}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${C.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${ue(d.name)}">
                🌱 ${ue(d.name)}: <strong>×${g}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${E}/8 câu)">
                🔥 <strong>${S}</strong> <small>(${E}/8)</small>
              </span>
              <button
                id="btnSqToggleYuleSkin"
                type="button"
                class="sq-wallet-chip yule-skin-toggle-pill ${this.sim.isYuleVisualThemeActive()?"is-yule-active":""}"
                aria-pressed="${this.sim.isYuleVisualThemeActive()}"
                title="Bật/Tắt giao diện Thư Viện Giáng Sinh"
              >🎄</button>
              ${(()=>{const B=Date.now(),j=this.sim.getActiveConstructions(B);if(j.length===0)return"";const oe=j[0],le=ne(oe.itemId),re=Math.max(1,Math.ceil((oe.constructEndsAt-B)/1e3)),be=this.sim.getBuildingMinFloorSec(oe),de=re<=be;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${ue(le?.name??"Đang xây")}: <strong>${Ae(re)}</strong> <small>${de?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 34 loại hạt giống và hoa">${D}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${Wt(d.id)}" alt="${ue(d.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${ue(d.name)}</h3>
                <p>⏱️ <strong>${Ae(d.growSec)}</strong> • 🌾 <strong>+${d.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${y}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${u.toLocaleString("vi-VN")}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${T?"":"disabled"}
              >
                🪙 +1 Hạt (-${u.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${L?"":"disabled"}
              >
                🪙 +3 Hạt (-${m.toLocaleString("vi-VN")}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${g>0?"has-seeds":"empty-seeds"}">
              <div class="sq-pocket-status">
                🌱 <strong>${ue(d.name)}</strong>: <strong>×${g}</strong>
              </div>
              <button
                id="btnSqSowNow"
                type="button"
                class="brass-btn sq-sow-cta"
                ${g>0?"":"disabled"}
              >
                🌱 Gieo (×${g})
              </button>
            </div>
          </aside>

          <!-- OPTION 2: MULTI-LANGUAGE ADAPTIVE QUIZ -->
          <section class="sq-option-card sq-option-quiz">
            <div class="sq-quiz-top-header">
              <span class="sq-option-ribbon sq-ribbon-quiz">🪄 ĐỐ NHẬN HẠT (0G • +1–2 🌱)</span>
              <label class="sq-autospeak-toggle" title="Tự động phát âm bản xứ">
                <input id="chkSqAutoSpeak" type="checkbox" ${l.autoSpeak?"checked":""} />
                <span>🔊 Tự đọc</span>
              </label>
            </div>

            <!-- 5 LANGUAGE TABS -->
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${Z}</div>

            <!-- PRACTICE VS SRS LEXICON CODEX SWITCH -->
            <div class="sq-view-switch" role="tablist" aria-label="Chọn chế độ Luyện Thần Chú hoặc Sổ Tay Cổ Ngữ">
              <button
                type="button"
                class="sq-view-tab ${this.activeSubView==="practice"?"active":""}"
                data-sq-subview="practice"
                aria-selected="${this.activeSubView==="practice"}"
              >
                🪄 Luyện
              </button>
              <button
                type="button"
                class="sq-view-tab ${this.activeSubView==="codex"?"active":""}"
                data-sq-subview="codex"
                aria-selected="${this.activeSubView==="codex"}"
              >
                📖 Từ Điển (${f.masteredCount}/${h.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(i,c):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${N}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${c.masteryScore}/100 (Quyển ${$}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${p.flag} <strong>Lv.${c.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${c.totalCorrect}/${c.totalAnswered}</strong> (${k}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4,c.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${c.streak}</strong></span>
                        <button
                          type="button"
                          class="sq-stat-pill sq-stat-pill-btn ${f.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${f.masteredCount}</strong> • 🔄 <strong>${f.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${q}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${_}
                `}
          </section>
        </div>
      </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(t);const ee=t.querySelector("#sqScrollViewport");ee&&(a>0||r>0)&&(ee.scrollTop=a,ee.scrollLeft=r)}getLexiconEntrySrsInfo(t,n){const o=t.srsBoxes??{};let s=0,a=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const l=o[`${r}${n}`];l&&(l.box>s&&(s=l.box),l.box<5&&l.dueAtTurn<=t.totalAnswered&&(a=!0))}return{box:s,due:a}}getLanguageLexiconEntries(t){return Ln.filter(n=>n.lang===t).sort((n,o)=>n.levelBand-o.levelBand||n.id.localeCompare(o.id))}renderLexiconCodexPanel(t,n){const o=Dt[t],s=this.getLanguageLexiconEntries(t);let a=0,r=0,l=0;for(const p of s){const{box:c}=this.getLexiconEntrySrsInfo(n,p.id);c>=5?a+=1:c>=1?r+=1:l+=1}const i=[{id:"all",label:`📖 Tất cả (${s.length})`},{id:"mastered",label:`🏆 Thuộc (${a})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(p=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===p.id?"active":""}"
            data-sq-codex-filter="${p.id}"
            aria-pressed="${this.codexBoxFilter===p.id}"
          >${p.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${o.flag} ${ue(o.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${An(t)?`✅ ${s.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${ue(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${i}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,n,s)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,n,o){const s=o??this.getLanguageLexiconEntries(t),a=this.codexQuery.trim().toLowerCase(),r=s.filter(i=>{const{box:p}=this.getLexiconEntrySrsInfo(n,i.id);return this.codexBoxFilter==="mastered"&&p<5||this.codexBoxFilter==="learning"&&(p<1||p>=5)||this.codexBoxFilter==="unseen"&&p>0?!1:a?i.word.toLowerCase().includes(a)||i.phonetic.toLowerCase().includes(a)||i.meaningVi.toLowerCase().includes(a)||i.exampleSentence.toLowerCase().includes(a)||i.exampleVi.toLowerCase().includes(a):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(i=>{const{box:p,due:c}=this.getLexiconEntrySrsInfo(n,i.id),d=qi(i.meaningVi,i.word,i.id);let g="is-unseen",y=`✨ Quyển ${i.levelBand}`;return p>=5?(g="is-box5",y="🏆 Hộp 5/5 • Thuộc"):p>=1&&(g=c?"is-due":"is-learning",y=`📦 Hộp ${p}/5${c?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${d.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${ue(i.id)}"
                title="Nghe phát âm từ ${ue(i.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${ue(i.word)}</strong>
                <span class="sq-vocab-ph">[${ue(i.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${ue(d.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${g}">${y}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${s.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,n){t.querySelectorAll("[data-sq-codex-word]").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.sqCodexWord??"",a=Ln.find(r=>r.id===s);a&&De(a.word,n,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.sqCodexEx??"",a=Ln.find(r=>r.id===s);a&&De(a.exampleSentence,n,.95)})})}renderChallengeStage(t){const n=Dt[t.lang],o=$i[t.format],s=ke[this.targetCropId],a=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",i=t.heroWord??t.stemText,p=t.heroPhonetic??t.stemPhonetic??"",c=t.heroShortVi??qn(t.translationVi);let d="";r==="pic_flashcard"?d=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${ue(i)}</div>
            ${p?`<div class="sq-kid-ph-pill">[${ue(p)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(d=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${ue(c)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${ue(c)}</div>
            ${p?`<div class="sq-kid-ph-pill">🔊 [${ue(p)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let g="";if(r==="pic_flashcard"||r==="word_flashcard"){const C=t.choices??[],u=t.choicePhonetics??[],m=t.choiceSprites??[],T=t.choiceSubtitles??[];g=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${C.map((L,$)=>{let k="";a&&($===t.correctIndex?k="is-correct":$===this.selectedChoiceIdx?k="is-wrong":k="is-dimmed");const f=m[$]??l,h=T[$]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${k}"
                  data-sq-choice="${$}"
                  ${a?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${f}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${ue(L)}</span>
                    ${r==="word_flashcard"&&u[$]?`<small class="sq-choice-ph">[${ue(u[$])}]</small>`:a&&h?`<small class="sq-choice-ph">${ue(h)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const C=t.choices??[],u=t.choicePhonetics??[],m=t.choiceSprites??[];g=`
        <div class="sq-bubble-arena">
          ${C.map((T,L)=>{let $="";a&&(L===t.correctIndex?$="is-correct is-popped":L===this.selectedChoiceIdx?$="is-wrong is-popped":$="is-dimmed");const k=m[L]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${L%4} ${$}"
                  data-sq-choice="${L}"
                  ${a?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${k}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${ue(T)}</span>
                  ${u[L]?`<small class="sq-bubble-ph">[${ue(u[L])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const C=t.shuffledTokens??[],u=t.expectedSentenceTokens??[],m=new Set(this.placedTokenIndices),T=u.map(($,k)=>{const f=this.placedTokenIndices[k],h=f!==void 0?C.find(S=>S.idx===f):void 0;return h?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${k}"
                ${a?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${ue(h.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),L=C.map($=>{const k=m.has($.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${k?"used":""}"
              data-sq-place="${$.idx}"
              ${k||a?"disabled":""}
            >
              ${ue($.text)}
            </button>
          `}).join("");g=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${T}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${L}</div>
          ${a?"":`
                <div class="sq-sentence-actions">
                  <button id="btnSqHintTile" type="button" class="brass-btn" title="Gợi ý 1 mảnh chữ">
                    💡 Gợi ý chữ
                  </button>
                  <button id="btnSqResetSentence" type="button" class="brass-btn" ${this.placedTokenIndices.length===0?"disabled":""}>
                    ↺ Xếp lại
                  </button>
                  <button id="btnSqCheckSentence" type="button" class="brass-btn gold-cta" ${this.placedTokenIndices.length===0?"disabled":""}>
                    ✨ Kiểm Tra
                  </button>
                </div>
              `}
        </div>
      `}else if(t.format==="match_pairs"){const C=t.leftCards??[],u=t.rightCards??[];g=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${n.flag} 🔊 Thẻ Từ</div>
            ${C.map(m=>{const T=this.matchedPairIds.has(m.pairId),L=this.selectedLeftPairId===m.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${T?"matched":""} ${L?"selected":""}"
                    data-sq-left-pair="${ue(m.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${ue(m.word)}</span>
                    <small class="sq-pair-ph">[${ue(m.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${u.map(m=>{const T=this.matchedPairIds.has(m.pairId),L=this.flashWrongPairKey===m.pairId,$=m.spriteSrc??qi(m.meaningVi,m.word,m.pairId).spriteSrc,k=m.shortVi??qn(m.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${T?"matched":""} ${L?"wrong-flash":""}"
                    data-sq-right-pair="${ue(m.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <img src="${$}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${ue(k)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const y=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${o.icon} ${ue(o.labelVi)}</span>
            ${t.isReview?`<span class="sq-badge sq-badge-review">🔄 Ôn (${t.srsBox??1}/5) • +2 ${s.emoji}</span>`:`<span class="sq-badge sq-badge-reward">🎁 +1–2 ${s.emoji}</span>`}
          </div>
          <div class="sq-tts-btns">
            <button id="btnSqSpeakNormal" type="button" class="brass-btn sq-tts-btn" title="Nghe chuẩn (1.0x)">
              🔊 Nghe
            </button>
            <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tts-btn" title="Nghe chậm (0.72x)">
              🐢 Chậm
            </button>
            ${a?"":'<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tts-btn" title="Đổi câu">🔀 Đổi</button>'}
          </div>
        </div>

        ${d}
        ${g}
        ${y}
      </div>
    `}renderVietnameseExplanationCard(t,n){const o=this.sim.getSeedCount(this.targetCropId),s=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",a=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??qn(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${n.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${s}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${n.correct?`🎉 <strong>Giỏi lắm!</strong> +${n.seedsAwarded} 🌱 ${ue(n.cropName)} • +${n.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${n.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${ue(a)}</strong>
              <span class="sq-vocab-ph">[${ue(r)}]</span>
              <span>= 🇻🇳 <strong>${ue(l)}</strong></span>
            </div>
            ${n.buildReduction&&n.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${Ae(n.buildReduction.reducedSec)} (${ue(n.buildReduction.targetName??"công trình")})</div>`:""}
          </div>
          <div class="sq-explain-tts">
            <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tts-btn">🔊</button>
            <button id="btnSqSpeakFullSlow" type="button" class="brass-btn sq-tts-btn">🐢</button>
          </div>
        </div>

        <div class="sq-explain-actions">
          ${o>0?`
                <button id="btnSqExplainSow" type="button" class="brass-btn sq-sow-cta">
                  🌱 Gieo (×${o})
                </button>
              `:""}
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta">
            ➡️ Chơi Tiếp (+1–2 🌱)
          </button>
        </div>
      </div>
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCropFilter;(d==="all"||d==="flowers"||d==="crops")&&(this.cropFilter=d,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCrop;d&&ke[d]&&(this.targetCropId=d,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const c=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(c.msg,c.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const c=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(c.msg,c.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const n=t.querySelector("#chkSqAutoSpeak");n?.addEventListener("change",()=>{const c=this.sim.ensureLanguageQuiz();c.autoSpeak=n.checked,this.sim.saveToStorage()}),t.querySelector("#btnSqToggleYuleSkin")?.addEventListener("click",()=>{this.sim.audio.playClick();const c=this.sim.toggleYuleVisualTheme();typeof document<"u"&&(document.documentElement.dataset.yuleTheme=c?"true":"false"),this.onRefreshHud(),this.render()});const o=t.querySelector(".sq-crop-strip");o?.addEventListener("wheel",c=>{o.scrollWidth>o.clientWidth+4&&Math.abs(c.deltaY)>Math.abs(c.deltaX)&&c.deltaY!==0&&(o.scrollLeft+=c.deltaY,c.preventDefault())},{passive:!1}),t.querySelectorAll("[data-sq-lang]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqLang,g=this.sim.ensureLanguageQuiz();d&&Gn.includes(d)&&g.activeLang!==d&&(this.challenge&&!this.answeredOutcome&&Ot(g,this.challenge),g.activeLang=d,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(d,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqSubview;if((d==="practice"||d==="codex")&&this.activeSubView!==d){if(this.activeSubView=d,d==="codex"){const g=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(g.activeLang)}this.render()}})});const s=t.querySelector("#inpSqCodexSearch");s&&s.addEventListener("input",()=>{this.codexQuery=s.value;const c=t.querySelector("#sqCodexResultsMount");if(c){const d=this.sim.ensureLanguageQuiz(),g=d.activeLang;c.innerHTML=this.renderLexiconCodexRowsHtml(g,d.profiles[g]),this.bindCodexRowSpeakEvents(c,g)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCodexFilter;(d==="all"||d==="mastered"||d==="learning"||d==="unseen")&&(this.codexBoxFilter=d,this.render())})});const a=t.querySelector("#sqCodexResultsMount");if(a){const c=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(a,c.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqTier,g=this.sim.ensureLanguageQuiz();(d==="beginner"||d==="intermediate"||d==="advanced")&&(this.challenge&&!this.answeredOutcome&&Ot(g,this.challenge),Ei(g,g.activeLang,d),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqFormat,g=this.sim.ensureLanguageQuiz();Vn.includes(d)&&g.preferredFormat!==d&&(this.challenge&&!this.answeredOutcome&&Ot(g,this.challenge),g.preferredFormat=d,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&De(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const c=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;De(c,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const c=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;De(c,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&De(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&De(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge)return;const d=Number(c.dataset.sqSpeakWord??-1),g=this.challenge.vocabNotes[d];g&&De(g.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const c=this.sim.ensureLanguageQuiz();Ot(c,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqChoice??-1);this.selectedChoiceIdx=d;const g=d===(this.challenge.correctIndex??0);g?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(g)})});const r=()=>{if(!this.challenge||this.answeredOutcome)return!1;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<c.length)return!1;const g=this.placedTokenIndices.map(C=>d.find(u=>u.idx===C)?.text??""),y=g.length===c.length&&g.every((C,u)=>C===c[u]);return y?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(y),!0};t.querySelectorAll("[data-sq-place]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqPlace??-1);if(d>=0&&!this.placedTokenIndices.includes(d)){this.placedTokenIndices.push(d),this.sim.audio.playMatchPop(1);const g=this.challenge.shuffledTokens?.find(C=>C.idx===d),y=this.sim.ensureLanguageQuiz();g&&y.autoSpeak&&De(g.text,this.challenge.lang,.95),r()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqUnplace??-1);d>=0&&d<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(d,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const y=this.placedTokenIndices.length-1;if(d.find(u=>u.idx===this.placedTokenIndices[y])?.text===c[y])break;this.placedTokenIndices.pop()}const g=this.placedTokenIndices.length;if(g<c.length){const y=c[g],C=d.find(u=>u.text===y&&!this.placedTokenIndices.includes(u.idx));C&&(this.placedTokenIndices.push(C.idx),this.sim.audio.playMatchPop(1),r()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[],g=this.placedTokenIndices.map(C=>d.find(u=>u.idx===C)?.text??""),y=g.length===c.length&&g.every((C,u)=>C===c[u]);this.submitAttempt(y)}),t.querySelectorAll("[data-sq-left-pair]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=c.dataset.sqLeftPair??"";if(!d||this.matchedPairIds.has(d))return;this.selectedLeftPairId=d,this.flashWrongPairKey=null,this.sim.audio.playClick();const g=this.challenge.leftCards?.find(C=>C.pairId===d),y=this.sim.ensureLanguageQuiz();g&&y.autoSpeak&&De(g.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=c.dataset.sqRightPair??"";if(!(!d||this.matchedPairIds.has(d))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===d){this.matchedPairIds.add(d),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const g=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=g){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=d,this.sim.audio.playClick(),this.render()}})});const l=t.querySelector("#sqScrollViewport"),i=t.querySelector("#sqZoomSizer"),p=t.querySelector("#sqZoomStage");it.bindDomScrollStageInteractions({rootScope:t,scrollViewportEl:l,sizerEl:i,contentStageEl:p,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}const bt="https://www.youtube.com/watch?v=jfKfPfyJRdk",Eo=[{id:"cozy_lofi_247",label:"🧣 Lofi Ấm Áp 24/7",url:"https://www.youtube.com/watch?v=jfKfPfyJRdk"},{id:"winter_night_chill",label:"❄️ Đêm Đông Tuyết Rơi",url:"https://www.youtube.com/watch?v=4xDzrJKXOOY"},{id:"relaxing_piano",label:"🎹 Piano Thung Lũng",url:"https://www.youtube.com/watch?v=DWcJFNfaw9c"}],cn=/^[A-Za-z0-9_-]{11}$/,Po=/^[A-Za-z0-9_-]{10,64}$/;function Xn(e){const t=String(e??"").trim();if(!t)return null;if(cn.test(t))return{kind:"video",videoId:t};let n=t;!/^https?:\/\//i.test(n)&&/^(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//i.test(n)&&(n=`https://${n}`);try{const o=new URL(n),s=o.hostname.replace(/^(www\.|m\.|music\.)/i,"").toLowerCase();if(s!=="youtube.com"&&s!=="youtu.be"&&s!=="youtube-nocookie.com")return null;const a=o.searchParams.get("list")?.trim()||void 0,r=a&&Po.test(a)?a:void 0;if(s==="youtu.be"){const p=o.pathname.split("/").filter(Boolean)[0]??"";return cn.test(p)?{kind:"video",videoId:p,...r?{playlistId:r}:{}}:null}const l=o.searchParams.get("v")?.trim()??"";if(cn.test(l))return{kind:"video",videoId:l,...r?{playlistId:r}:{}};const i=o.pathname.split("/").filter(Boolean);if(i.length>=2&&(i[0]==="embed"||i[0]==="live"||i[0]==="shorts"||i[0]==="v")&&cn.test(i[1]))return{kind:"video",videoId:i[1],...r?{playlistId:r}:{}};if(r)return{kind:"playlist",playlistId:r}}catch{return null}return null}let gt=null;function qo(){return typeof window>"u"||typeof document>"u"?Promise.reject(new Error("No DOM environment")):window.YT?.Player?Promise.resolve(window.YT):gt||(gt=new Promise((e,t)=>{const n=window.onYouTubeIframeAPIReady,o=window.setTimeout(()=>{gt=null,t(new Error("YouTube IFrame API timeout"))},12e3);if(window.onYouTubeIframeAPIReady=()=>{window.clearTimeout(o),n?.(),window.YT?.Player?e(window.YT):(gt=null,t(new Error("YT.Player unavailable")))},!document.querySelector('script[data-yt-bgm-api="1"]')){const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api",s.async=!0,s.dataset.ytBgmApi="1",s.onerror=()=>{window.clearTimeout(o),gt=null,t(new Error("Failed to load YouTube IFrame API"))},document.head.appendChild(s)}}),gt)}class Io{constructor(t,n){v(this,"audio");v(this,"onToast");v(this,"onStatusChange");v(this,"hostWrap",null);v(this,"playerMount",null);v(this,"player",null);v(this,"playerReady",!1);v(this,"loadedKey","");v(this,"desiredEnabled",!1);v(this,"desiredBgmMasterOn",!0);v(this,"desiredSource",null);v(this,"desiredVolume",65);v(this,"statusText","Đang tắt (dùng nhạc nền tích hợp sẵn)");v(this,"gestureRetryBound",!1);this.audio=t,this.onToast=n?.onToast,this.onStatusChange=n?.onStatusChange}getStatusText(){return this.statusText}sync(t){if(this.desiredEnabled=!!t.youtubeEnabled,this.desiredBgmMasterOn=!!t.bgmEnabled,this.desiredVolume=Math.max(0,Math.min(100,Math.round(t.volume0to1*100))),this.desiredSource=Xn(t.rawUrl||bt),!this.desiredEnabled||!this.desiredBgmMasterOn||!this.desiredSource){if(this.audio.externalBgmActive=!1,this.player&&this.playerReady)try{this.player.pauseVideo()}catch{}this.hostWrap&&this.hostWrap.classList.add("hidden"),this.setStatus(this.desiredEnabled?this.desiredBgmMasterOn?"Link YouTube chưa hợp lệ — hãy dán link watch?v=... hoặc youtu.be/...":"Đang tạm dừng (công tắc Nhạc nền BGM đang tắt)":"Đang tắt (dùng nhạc nền tích hợp sẵn)");return}this.audio.externalBgmActive=!0,this.audio.stopBgm?.(),this.bindFirstGestureAutoplayUnlock();const n=this.desiredSource.kind==="video"?`v:${this.desiredSource.videoId}:${this.desiredSource.playlistId??""}`:`p:${this.desiredSource.playlistId}`;if(this.player&&this.playerReady){this.hostWrap?.classList.remove("hidden");try{this.player.unMute(),this.player.setVolume(this.desiredVolume),this.loadedKey!==n?(this.loadedKey=n,this.cueCurrentSourceOnReadyPlayer()):this.player.playVideo()}catch{}return}this.setStatus("⏳ Đang kết nối trực tiếp tới YouTube CDN (0 băng thông server)..."),this.ensureHostMounted(),qo().then(o=>{if(!this.desiredEnabled||!this.desiredSource||!o.Player||!this.playerMount||this.player)return;const s=this.desiredSource;this.loadedKey=n;const a={autoplay:1,controls:1,playsinline:1,rel:0,modestbranding:1,loop:1};s.kind==="video"?a.playlist=s.playlistId??s.videoId:(a.listType="playlist",a.list=s.playlistId),this.player=new o.Player(this.playerMount,{host:"https://www.youtube-nocookie.com",width:200,height:112,...s.kind==="video"?{videoId:s.videoId}:{},playerVars:a,events:{onReady:r=>{this.playerReady=!0;try{r.target.unMute(),r.target.setVolume(this.desiredVolume),this.desiredEnabled&&this.desiredBgmMasterOn&&(r.target.playVideo(),this.setStatus("🎶 Sẵn sàng — Chạm nhẹ vào màn hình nếu trình duyệt chờ mở tiếng"))}catch{}},onStateChange:r=>{if(r.data===1)this.audio.externalBgmActive=!0,this.setStatus("🔊 Đang phát trực tiếp từ YouTube (0 băng thông máy chủ)");else if(r.data===0&&this.desiredEnabled&&this.desiredBgmMasterOn)try{r.target.playVideo()}catch{}else r.data===2&&this.desiredEnabled&&this.desiredBgmMasterOn&&this.setStatus("⏸️ Đã tạm dừng — Bấm Phát trên khung mini hoặc chạm vào game")},onError:r=>{this.audio.externalBgmActive=!1;const i=r.data===101||r.data===150?"Chủ kênh YouTube này chặn nhúng ngoài trang — hãy chọn 1 kênh gợi ý hoặc dán link YouTube khác nhé!":"Không tải được link YouTube (đã tự chuyển về nhạc nền sẵn có của game).";this.setStatus(`⚠️ ${i}`),this.onToast?.(i,"🎵")}}})}).catch(()=>{this.audio.externalBgmActive=!1,this.setStatus("⚠️ Không kết nối được YouTube (đang phát nhạc nền sẵn có offline)")})}cueCurrentSourceOnReadyPlayer(){!this.player||!this.playerReady||!this.desiredSource||(this.desiredSource.kind==="video"?this.desiredSource.playlistId?this.player.loadPlaylist({list:this.desiredSource.playlistId,listType:"playlist"}):this.player.loadVideoById(this.desiredSource.videoId):this.player.loadPlaylist({list:this.desiredSource.playlistId,listType:"playlist"}))}ensureHostMounted(){if(!(typeof document>"u")){if(!this.hostWrap){const t=document.createElement("aside");t.id="ytBgmPersistentDock",t.className="yt-bgm-mini-dock",t.setAttribute("aria-label","Trình phát nhạc nền YouTube thu nhỏ"),t.innerHTML=`
        <div class="yt-bgm-mini-head">
          <span>🎵 YouTube BGM</span>
          <button type="button" class="yt-bgm-mini-collapse" data-yt-toggle-min="1" title="Thu gọn / Mở khung hình YouTube">–</button>
        </div>
        <div class="yt-bgm-iframe-slot">
          <div id="ytBgmIframeMount"></div>
        </div>
      `,t.querySelector("[data-yt-toggle-min]")?.addEventListener("click",o=>{const s=o.currentTarget,a=t.classList.toggle("is-collapsed");s.textContent=a?"▢":"–"}),t.classList.add("is-collapsed");const n=t.querySelector("[data-yt-toggle-min]");n&&(n.textContent="▢"),document.body.appendChild(t),this.hostWrap=t,this.playerMount=t.querySelector("#ytBgmIframeMount")}this.hostWrap.classList.remove("hidden")}}bindFirstGestureAutoplayUnlock(){if(this.gestureRetryBound||typeof window>"u")return;this.gestureRetryBound=!0;const t=()=>{if(!(!this.desiredEnabled||!this.desiredBgmMasterOn||!this.player||!this.playerReady))try{const n=this.player.getPlayerState?.();n!==1&&n!==3&&(this.player.unMute(),this.player.setVolume(this.desiredVolume),this.player.playVideo())}catch{}};window.addEventListener("pointerdown",t,{passive:!0}),window.addEventListener("keydown",t,{passive:!0})}setStatus(t){this.statusText!==t&&(this.statusText=t,this.onStatusChange?.())}}function A(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const gn=["path","shop","creature","decor"],Bo=new Set(["path_cobble","path_snow_brick","path_wood_pier","marble_bench","floating_candles_post","patronus_ward_lantern"]);function At(e){return!!e.yuleCollection||e.id.startsWith("yule_")||e.id==="snowy_pines"}function Ss(e){return e.spriteKey?`/trang-trai-hang-soc/sprites/${e.spriteKey}.png`:Bo.has(e.id)?`/trang-trai-hang-soc/paintings/catalog/${e.id}.png`:null}function ye(e){e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.onBuildStateReset?.()}const ws="hangsoc_recent_decor_v1",xs=12;function Ho(){try{if(typeof localStorage>"u")return[];const e=localStorage.getItem(ws);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t.filter(n=>typeof n=="string"&&n.length>0).slice(0,xs):[]}catch{return[]}}function Do(e,t){const n=[t,...e.filter(o=>o!==t)].slice(0,xs);try{typeof localStorage<"u"&&localStorage.setItem(ws,JSON.stringify(n))}catch{}return n}const Ut=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function Ro(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
      <div id="hudFrameTop" class="hud-frame-top">
        <!-- KHU VƯỜN HAGRID × HANG SÓC COMPACT SINGLE-ROW TOP HUD -->
        <header class="ts-top-hud hg-top-hud">
          <!-- 1. TOP-LEFT: Level Ring + Unified Supplies Pill -->
          <div class="ts-hud-topleft hg-top-left">
            <button
              id="btnOpenRoadmap"
              type="button"
              class="hg-level-btn"
              aria-label="Hồ sơ cấp độ và lộ trình 100 cấp"
              title="Cấp Độ Điền Trang &amp; Lộ Trình 100 Cấp"
            >
              <span class="hg-level-ring" aria-hidden="true">
                <span id="lblLevelNum" data-fly-target="xp" class="hg-level-num">1</span>
              </span>
              <span class="sr-only-hud">
                <span id="lblTitle">Người Khai Hoang</span>
                <span id="barLevelTopFill"></span>
                <span id="xpBarShell"><span id="barXpFill"></span><span id="lblXpFraction">0/200</span></span>
              </span>
            </button>

            <div class="hg-supplies-pill" role="group" aria-label="Tài nguyên điền trang">
              <button
                id="chipHudGalleons"
                data-fly-target="galleons"
                type="button"
                class="hg-res-item"
                aria-label="Vàng Galleon — Chạm để chơi kiếm thêm Vàng"
                title="Vàng Galleon — Chạm quay lại game vừa chơi"
              >
                <span class="hg-res-glyph hg-glyph-coin" aria-hidden="true">G</span>
                <span id="lblGalleons" class="hg-res-val">1.450</span>
                <span id="btnPlusGalleons" class="sr-only-hud">+</span>
              </button>

              <button
                id="btnHudSandChip"
                data-fly-target="sand"
                type="button"
                class="hg-res-item"
                aria-label="Ngọc Thời Gian — Chạm mở Đại Sảnh Khảo Thí"
                title="Ngọc &amp; Cát Thời Gian"
              >
                <span class="hg-res-glyph hg-glyph-gem" aria-hidden="true">◆</span>
                <span id="lblSand" class="hg-res-val">28</span>
                <span id="btnPlusSand" class="sr-only-hud">+</span>
              </button>

              <button
                id="btnHudMinigameHub"
                data-fly-target="stars"
                type="button"
                class="hg-res-item"
                aria-label="Sao Phép Thuật — Chạm tiếp tục game vừa chơi"
                title="Sao Phép Thuật dùng mở đất &amp; xây công trình"
              >
                <img src="/trang-trai-hang-soc/sprites/m3_icon_star.png" alt="" class="hg-res-star-img" aria-hidden="true" />
                <strong id="lblHudHubStars" class="hg-res-val">3</strong>
                <span id="lblHudHubTrial" class="sr-only-hud"></span>
              </button>

              <button
                id="btnHudActiveBuilds"
                type="button"
                class="hg-res-item hg-res-build hidden"
                aria-label="Công trình đang xây dựng"
                title="Xem công trình đang thi công"
              >
                <span aria-hidden="true">🔨</span>
                <span id="lblActiveBuilds" class="hg-res-val">0</span>
              </button>
            </div>
          </div>

          <!-- 2. TOP-CENTER: Warm Curved Parchment Scroll Ribbon (Wide Desktop Only) -->
          <div id="tsParchmentBanner" class="ts-parchment-ribbon">
            <div class="ts-ribbon-tail ts-ribbon-tail-left" aria-hidden="true"></div>
            <div class="ts-ribbon-body">
              <div id="lblParkRibbonName" class="ts-ribbon-title">Hang Sóc</div>
            </div>
            <div class="ts-ribbon-tail ts-ribbon-tail-right" aria-hidden="true"></div>
          </div>

          <!-- 3. TOP-RIGHT: Hagrid's Farm Round Brass Buttons (Kho · Floo/Bạn Bè · Menu Vườn) -->
          <div class="ts-hud-topright hg-top-actions">
            <button
              id="chipHudBarn"
              type="button"
              class="hg-round-btn"
              aria-label="Mở Kho Nông Sản và Xưởng Chế Biến"
              title="Kho Nông Sản &amp; Xưởng Chế Biến Hang Sóc"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 42 42" class="hg-round-svg" aria-hidden="true">
                  <path d="M5 18 L21 6 L37 18 L34 18 L34 36 L8 36 L8 18 Z" fill="#d94632" stroke="#231f2e" stroke-width="2.6" stroke-linejoin="round"/>
                  <path d="M4 19 L21 6 L38 19" fill="none" stroke="#f7e6c4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="14" y="21" width="14" height="15" fill="#992315" stroke="#f7e6c4" stroke-width="1.8"/>
                  <path d="M14 21 L28 36 M28 21 L14 36" stroke="#f7e6c4" stroke-width="1.8"/>
                </svg>
              </span>
              <small id="lblStorageBarn" class="hg-round-count">42/60</small>
              <span id="btnOpenStorageBarn" class="sr-only-hud">Kho</span>
            </button>

            <button
              id="btnOpenNeighbors"
              data-fly-target="friendship"
              type="button"
              class="hg-round-btn"
              aria-label="Mạng Floo và Thăm Vườn Bạn Bè"
              title="Mạng Floo &amp; Thăm Vườn Bạn Bè (Phím N)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <img src="/trang-trai-hang-soc/sprites/ui_icon_staff.png" alt="" class="hg-round-img" aria-hidden="true" />
              </span>
              <span id="badgeNeighborCount" class="hg-round-badge hidden">1</span>
            </button>

            <button
              id="btnToggleManageMenu"
              type="button"
              class="hg-round-btn hg-menu-btn"
              aria-label="Menu khu vườn"
              aria-expanded="false"
              aria-controls="managePopoverMenu"
              title="Menu Khu Vườn (Bản Đồ, Lễ Hội, Cúp Nhà, Sổ Tay, Đổi Game &amp; Cài Đặt)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 36 36" class="hg-round-svg" aria-hidden="true">
                  <rect x="8" y="10" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
                  <rect x="8" y="16.3" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
                  <rect x="8" y="22.6" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
                </svg>
              </span>
              <span id="badgeManageMenuDot" class="hg-round-badge hidden">!</span>
            </button>
          </div>
        </header>

        <!-- MENU KHU VƯỜN (PHONG CÁCH VƯỜN HAGRID — GỌN GÀNG, RÕ RÀNG, ĐẦY ĐỦ BẢN ĐỒ & ĐỔI GAME) -->
        <nav id="managePopoverMenu" class="hud-floating-popover hg-garden-menu hidden" aria-label="Menu khu vườn">
          <div class="hg-menu-head">
            <div class="hg-menu-brand">
              <span class="hg-menu-seal" aria-hidden="true">🌿</span>
              <div>
                <strong class="hg-menu-title">Menu Khu Vườn</strong>
                <small class="hg-menu-sub">Hang Sóc &amp; Hogsmeade</small>
              </div>
            </div>
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">🕒 --:--</button>
          </div>

          <div class="manage-status-strip hg-menu-status">
            <button id="btnHudStarChip" type="button" class="stat-chip stat-chip-btn" title="Sao Phép Thuật"><img src="/trang-trai-hang-soc/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></button>
            <button id="btnHudHeartChip" type="button" class="stat-chip stat-chip-btn" title="Tim Bùa Gặt Honeydukes"><img src="/trang-trai-hang-soc/sprites/m3_icon_heart.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></button>
            <button id="btnHappySmiley" type="button" class="stat-chip stat-chip-btn" title="Độ Hạnh Phúc &amp; Sổ Cái">😊 <span id="lblWonder">4.5</span></button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
          </div>

          <!-- Lưới điểm đến chuẩn Vườn Hagrid: Bản đồ, Thăm vườn, Hồ sơ/Cúp Nhà, Lễ hội, Sổ tay, Vali, Kho, Việc quê, Cài đặt -->
          <div class="hg-menu-grid">
            <button id="btnOpenWorldMap" type="button" class="hg-menu-node" title="Đại Bản Đồ 10 Vùng Đất &amp; Lộ Trình 100 Cấp">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_world_map.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Bản Đồ</span>
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="hg-menu-node" title="Cổng Floo &amp; Thăm Vườn Bạn Bè (Phím N)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_staff.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Thăm Vườn</span>
              <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenAlbum" type="button" class="hg-menu-node" title="Hồ Sơ &amp; Cúp 4 Nhà Hogwarts">
              <span class="hg-menu-medal" aria-hidden="true">🏆</span>
              <span class="hg-menu-label">Hồ Sơ &amp; Cúp</span>
              <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenHarvestFeast" type="button" class="hg-menu-node" title="Đại Tiệc Mùa Gặt Hang Sóc (30 Bậc)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Lễ Hội</span>
              <span id="badgeFeastCount" class="badge-dot hidden">1</span>
              <span id="badgeManageFeastCount" class="sr-only-hud hidden">0</span>
            </button>
            <button id="btnOpenMenuSeedQuiz" type="button" class="hg-menu-node" title="Sổ Tay Cổ Ngữ &amp; Học Viện Thần Chú Đa Ngữ">
              <span class="hg-menu-medal" aria-hidden="true">📖</span>
              <span class="hg-menu-label">Sổ Tay</span>
            </button>
            <button id="btnOpenSuitcase" type="button" class="hg-menu-node" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_suitcase.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Vali Thú</span>
              <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="hg-menu-node" title="Kho Nông Sản, Xưởng Chế Biến &amp; Tàu Hàng">
              <span class="hg-menu-medal" aria-hidden="true">🏡</span>
              <span class="hg-menu-label">Kho Xưởng</span>
              <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenFinance" type="button" class="hg-menu-node" title="Sổ Cái Tài Chính &amp; Việc Quê">
              <span class="hg-menu-medal" aria-hidden="true">📊</span>
              <span class="hg-menu-label">Sổ Cái</span>
            </button>
            <button id="btnOpenSettings" type="button" class="hg-menu-node" title="Cài Đặt Âm Nhạc, Thời Tiết &amp; Lưu Game">
              <span class="hg-menu-medal" aria-hidden="true">⚙️</span>
              <span class="hg-menu-label">Cài Đặt</span>
            </button>
          </div>

          <!-- Chọn trực tiếp môn Mini-game (tự động nhớ làm game mặc định cho nút Chơi góc phải) -->
          <div class="hg-menu-games-box">
            <div class="hg-menu-games-head">
              <span>🎮 Chọn Môn Chơi</span>
              <button id="btnOpenLeaderboard" type="button" class="hg-bxh-chip" title="Bảng Xếp Hạng 4 Môn Tính Điểm (Phím L)">🥇 BXH</button>
            </div>
            <div class="hg-menu-games-pills" role="group" aria-label="Đổi trò chơi">
              <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 777 Màn (Phím J)">
                🍬 Bùa Gặt Honeydukes <small id="lblMatch3Lv" class="sr-only-hud">1/777</small>
              </button>
              <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Ngũ Ấn Đạo Tặc (Phím K)">
                🗺️ Ngũ Ấn Đạo Tặc <small id="lblArcadeTowerLv" class="sr-only-hud">0/3885</small>
              </button>
              <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" title="Số Học Huyền Bí">
                🔢 Số Học Huyền Bí
              </button>
              <button type="button" data-switch-minigame="blocks" class="hg-game-pill" title="Sinh Vật Huyền Bí">
                🦄 Sinh Vật Huyền Bí
              </button>
              <button type="button" data-switch-minigame="jigsaw" class="hg-game-pill" title="Tranh Ghép Phép Thuật — 777 Màn">
                🧩 Tranh Ghép Phép Thuật
              </button>
              <button type="button" data-switch-minigame="chess" class="hg-game-pill" title="Cờ Phù Thủy">
                🏰 Cờ Phù Thủy
              </button>
              <button type="button" data-switch-minigame="seedquiz" class="hg-game-pill" title="Học Viện Thần Chú">
                🪄 Học Viện Thần Chú
              </button>
            </div>
          </div>

          <div class="hg-menu-tools-row">
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh &amp; vàng">⚡ Accio</button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" title="Ghim bảng nhiệm vụ">📌 Ghim NV</button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" title="Hiện/ẩn Radar thu nhỏ">🧭 Radar</button>
            <button id="btnMenuRotateCam" type="button" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">🧭 Bắc</button>
            <button id="btnMenuCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">👁️ Xuyên</button>
            <button id="btnMenuGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">✨ Lưới</button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">🌡️ Nhiệt</button>
            <button id="btnPhotoMode" type="button" class="brass-btn" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để chụp ảnh (Phím P)">📷 Ảnh</button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn" title="Cuộn gọn thanh HUD quanh màn hình (Phím H)">📜 Ẩn HUD</button>
            <button id="btnOpenLegalFromMenu" type="button" class="brass-btn" title="Pháp lý, Quyền riêng tư &amp; Bản quyền">⚖️ Pháp Lý</button>
            <button id="btnOpenZones" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Bản Đồ</button>
            <button id="btnToggleHudRollup" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true"><svg><path id="svgHudRollupChevron" d="M13.5 23 L18 18.5 L22.5 23"/></svg></button>
            <button id="btnManageOpenFeast" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Lễ Hội</button>
          </div>
        </nav>

        <!-- COZY PROGRESSIVE-DISCLOSURE POPOVER 2: LIVE WEATHER FORECAST & PARK SPEED -->
        <div id="weatherPopoverMenu" class="hud-floating-popover hidden" role="region" aria-label="Dự báo thời tiết và tốc độ công viên"></div>

        <!-- YULE EVENT BANNER -->
        <button id="yuleEventBanner" type="button" class="yule-event-banner hidden" aria-label="Mở nhiệm vụ Yule">
          <span class="yule-event-banner-icon">🎄</span>
          <span><strong id="yuleEventBannerTitle">Yule</strong><small id="yuleEventBannerTask"></small></span>
          <span id="yuleEventBannerProgress" class="yule-event-banner-progress"></span>
        </button>

        <!-- DRAGGABLE FLOATING BANNER -->
        <div id="floatingModeBanner" class="parchment-dark floating-action-banner hidden">
          <span
            id="floatingBannerGrip"
            class="drag-handle drag-grip hidden"
            tabindex="0"
            role="button"
            aria-label="Kéo hoặc nhấn phím mũi tên để di chuyển thanh điều khiển nổi"
            title="Kéo hoặc dùng phím mũi tên để di chuyển"
          >⠿</span>
          <span id="floatingBannerText" class="floating-banner-text"></span>
          <div class="floating-banner-btns">
            <button id="btnFloatingAutoPlace" type="button" class="brass-btn gold-cta hidden" style="padding:4px 10px;font-size:12px;">⚡ Đặt Ngay</button>
            <button id="btnFloatingSecondary" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingSwap" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingExit" type="button" class="brass-btn gold-cta" aria-label="Thoát" style="padding:4px 8px;font-size:12px;">✕</button>
          </div>
        </div>

        <div class="hud-side-row">
          <!-- LEFT QUEST TRACKER (Hidden by default in clean Township view; toggleable) -->
          <aside id="questTrackerPanel" class="parchment-panel quest-tracker hidden" aria-label="Nhiệm vụ đang làm">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div style="font-weight:800;font-size:13.5px;color:#5c2d0c;">🦉 Nhiệm Vụ</div>
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!e.questCollapsed}" style="padding:3px 9px;font-size:12px;">${e.questCollapsed?"+":"–"}</button>
            </div>
            <div id="questTrackerBody" class="${e.questCollapsed?"hidden":""}"></div>
          </aside>

          <!-- RIGHT INSPECTOR -->
          <aside id="inspectorPanel" class="parchment-panel inspector-panel hidden" aria-label="Chi tiết đối tượng"></aside>
        </div>
      </div>

      <!-- TOUCH PLACEMENT CONFIRM BAR (App Store Mobile/Tablet UX) -->
      <div id="touchConfirmBar" class="parchment-dark touch-confirm-bar hidden">
        <span id="lblTouchConfirm" style="font-size:12.5px;font-weight:800;color:#fde68a;"></span>
        <button id="btnTouchConfirmOk" type="button" class="brass-btn gold-cta" aria-label="Đặt">✓</button>
        <button id="btnTouchRotate" type="button" class="brass-btn" aria-label="Xoay">↻</button>
        <button id="btnTouchCancel" type="button" class="brass-btn" aria-label="Hủy">✕</button>
      </div>

      <!-- INTERACTIVE ISOMETRIC MINIMAP (Tucked cleanly until requested) -->
      <div id="minimapWrap" class="parchment-dark minimap-wrap ts-minimap-docked hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="minimap-title">🧭 Radar</span>
          <button id="btnToggleMinimap" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng bản đồ thu nhỏ" aria-expanded="${!e.minimapCollapsed}" style="padding:2px 7px;font-size:12px;">${e.minimapCollapsed?"+":"–"}</button>
        </div>
        <canvas id="minimapCanvas" class="${e.minimapCollapsed?"hidden":""}" width="168" height="102" aria-label="Bản đồ thu nhỏ công viên"></canvas>
      </div>

      <!-- PHOTO MODE FLOATING BAR -->
      <div id="photoModeBar" class="parchment-dark photo-mode-bar hidden">
        <span style="font-size:12.5px;font-weight:800;color:#fde68a;">📷</span>
        <button id="btnSavePhotoPng" type="button" class="brass-btn gold-cta">💾 PNG</button>
        <button id="btnSaveYulePostcard" type="button" class="brass-btn yule-postcard-btn" title="Xuất ảnh thiệp Giáng Sinh khung thông tuyết (.png)">🎄 Khung Thiệp</button>
        <button id="btnExitPhoto" type="button" class="brass-btn" aria-label="Thoát chế độ chụp ảnh">✕</button>
      </div>

      <!-- ROUND IN-GAME HUD ROLL-UP ORB ("NÚT CUỘN TRÒN INGAME" — TAP TO ROLL/UNROLL ALL HUDS, DRAG TO REPOSITION) -->
      <button
        id="btnHudRoundOrb"
        type="button"
        class="hud-round-orb-btn"
        aria-pressed="false"
        aria-label="Nút cuộn tròn thu gọn hoặc mở rộng toàn bộ HUD"
        title="Chạm để cuộn gọn / mở rộng toàn bộ HUD (Phím H) • Giữ kéo để dời vị trí nút"
      >
        <span class="hud-round-orb-disc" aria-hidden="true">
          <svg viewBox="0 0 40 40" class="hud-round-orb-svg" aria-hidden="true">
            <defs>
              <radialGradient id="hudOrbGold" cx="35%" cy="28%" r="72%">
                <stop offset="0%" stop-color="#fff7c2"/>
                <stop offset="52%" stop-color="#f6b922"/>
                <stop offset="100%" stop-color="#b86508"/>
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#hudOrbGold)" stroke="#3a2212" stroke-width="2.6"/>
            <circle cx="20" cy="20" r="13.8" fill="#fdf4dc" stroke="#92400e" stroke-width="1.6"/>
            <rect x="11" y="10.5" width="18" height="4.6" rx="2.3" fill="#f59e0b" stroke="#3a2212" stroke-width="1.6"/>
            <path d="M13 15.1 H27 V24.5 C27 26.7 25.2 28.5 23 28.5 H17 C14.8 28.5 13 26.7 13 24.5 Z" fill="#fffdf6" stroke="#3a2212" stroke-width="1.6" stroke-linejoin="round"/>
            <path id="svgRoundOrbChevron" d="M16 23.2 L20 19.2 L24 23.2" fill="none" stroke="#92400e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span id="lblHudRoundOrbTag" class="hud-round-orb-tag visually-hidden">HUD</span>
      </button>

      <!-- TOAST STACK -->
      <div id="toastStack" class="owl-toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>

      <!-- RIBBON UNVEIL WEASLEY CELEBRATION BANNER -->
      <div id="ribbonUnveilToastCard" class="ribbon-unveil-banner hidden" role="status" aria-live="polite"></div>

      <!-- FLY-TO-HUD WEB ANIMATIONS LAYER -->
      <div id="flyRewardLayer" class="fly-reward-layer" aria-hidden="true"></div>

      <!-- 4. BOTTOM-LEFT UNIFIED 4-CARD FARM & BUILD DOCK: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Xây Dựng -->
      <div id="tsCornerLeft" class="ts-corner-left hg-farm-dock" role="toolbar" aria-label="Nông trại và xây dựng">
        <button id="btnOpenQuests" type="button" class="ts-card-btn hg-dock-card" title="Đơn Hàng Cú &amp; Nhiệm Vụ Cốt Truyện">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_owl_orders.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Đơn Hàng Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Hạt Giống &amp; Hoa Hang Sóc">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Kho Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Đồng Cỏ Chăn Thả">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_pasture_bell.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Chăn Thả</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Xây Dựng Bản Vẽ Công Trình">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Xây Dựng</span>
          <span id="badgeBuildReadyCount" class="ts-red-badge is-ready-green hidden">1</span>
        </button>
      </div>

      <!-- 5. BOTTOM-RIGHT HERO PLAY BUTTON: Mở lại ngay trò chơi cuối cùng vừa được chơi -->
      <div id="tsCornerRight" class="ts-corner-right hg-play-corner">
        <button
          id="btnCornerPlayPuzzle"
          type="button"
          class="ts-card-btn ts-card-lg ts-card-play-stage hg-hero-play-btn"
          aria-label="Chơi tiếp trò chơi vừa chơi"
          title="Chạm để quay lại ngay trò chơi cuối cùng vừa được chơi"
        >
          <span id="badgeCornerPlayBonus" class="hg-play-game-tag">🍬 Bùa Gặt</span>
          <span class="hg-play-emblem" aria-hidden="true">
            <img id="imgCornerPlayIcon" src="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png" alt="" class="ts-card-art hg-play-art" />
            <span class="hg-play-triangle">▶</span>
          </span>
          <span id="lblCornerPlayStage" class="ts-card-label hg-play-stage">Màn 1</span>
          <small id="lblCornerPlaySub" class="hg-play-sub">Cấp 1 → 2</small>
        </button>
      </div>

      <!-- FLOATING SEED BRUSH TRAY (Swipe-to-Plant across unified Thửa Đất Canh Tác) -->
      <section id="seedBrushTray" class="parchment-panel seed-brush-tray hidden" aria-label="Túi hạt giống gieo nhanh"></section>

      <!-- FLOATING PASTURE ANIMAL BRUSH TRAY (Swipe-to-Stock across unified Đồng Cỏ Chăn Thả) -->
      <section id="pastureBrushTray" class="parchment-panel seed-brush-tray pasture-brush-tray hidden" aria-label="Khay chọn thú chăn thả"></section>

      <!-- VISITOR READ-ONLY & CO-OP DOCK BAR -->
      <section id="visitorDockBar" class="parchment-panel visitor-dock-bar hidden" aria-label="Thanh tham quan và trợ giúp vườn bạn bè"></section>

      <!-- BOTTOM BUILD DOCK SHEET (Pops open cleanly above corner cards when "Xây Dựng" is active) -->
      <section id="bottomDockWrap" class="bottom-dock-wrap ts-build-sheet" aria-label="Thanh công cụ xây dựng">
        <div id="buildDrawerSwipeBar" class="build-drawer-swipe-bar hidden">
          <span id="buildDrawerCatLabel" class="build-drawer-cat-label">🏗️ Danh Mục Xây Dựng</span>
          <div class="build-drawer-scroll-ctrls">
            <span id="buildDrawerSwipeHint" class="build-drawer-swipe-hint" aria-hidden="true">↔ Vuốt ngang</span>
            <button id="btnDrawerScrollPrev" type="button" class="drawer-nav-pill" aria-label="Cuộn sang trái">‹</button>
            <button id="btnDrawerScrollNext" type="button" class="drawer-nav-pill" aria-label="Cuộn sang phải">›</button>
          </div>
        </div>
        <div id="decorCollectionFilterBar" class="decor-collection-filter-bar hidden" role="tablist" aria-label="Bộ sưu tập trang trí"></div>
        <div id="buildDrawer" class="parchment-panel build-drawer hidden"></div>

        <div id="secondaryMapToolsBar" class="parchment-dark secondary-map-tools-bar hidden" role="toolbar" focusgroup="toolbar wrap" aria-label="Công cụ xây dựng chính" aria-controls="gameCanvas">
          <div role="group" aria-label="Thao tác công trình" class="build-toolbar-group">
            <button id="btnMoveTool" type="button" aria-pressed="false" class="brass-btn" title="Di dời công trình (Phím M)">✋ Dời</button>
            <button id="btnBulldoze" type="button" aria-pressed="false" class="brass-btn" title="Xóa công trình hoặc đường (Phím X)">🧹 Xóa</button>
            <button id="btnRotate" type="button" class="brass-btn" title="Xoay công trình 90° (Phím R)">🔄 Xoay</button>
          </div>
          <span role="separator" aria-orientation="vertical" class="build-toolbar-sep"></span>
          <div role="group" aria-label="Hoàn tác và đóng" class="build-toolbar-group">
            <button id="btnBuildUndo" type="button" aria-disabled="true" class="brass-btn" title="Hoàn tác xây dựng (Ctrl/Cmd+Z)">↶ Hoàn tác</button>
            <button id="btnBuildRedo" type="button" aria-disabled="true" class="brass-btn" title="Làm lại xây dựng (Ctrl/Cmd+Y)">↷ Làm lại</button>
            <button id="btnBuildDone" type="button" class="brass-btn gold-cta" title="Đóng chế độ xây dựng (Esc)">✓ Xong</button>
          </div>
        </div>

        <div class="parchment-dark bottom-bar" role="group" aria-label="Nhóm công trình xây dựng">
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_shop.png" alt="" class="hud-3d-icon" aria-hidden="true" /> Công Trình</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_creature.png" alt="" class="hud-3d-icon" aria-hidden="true" /> Sản Xuất</button>
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_path.png" alt="" class="hud-3d-icon" aria-hidden="true" /> Đường</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_decor.png" alt="" class="hud-3d-icon" aria-hidden="true" /> Trang Trí</button>
          <button type="button" data-decor-event="christmas" aria-pressed="false" class="brass-btn"><span class="dock-tool-icon" aria-hidden="true">🎄</span> Giáng Sinh</button>
        </div>
      </section>

      <!-- TOWNSHIP SOFT SPOTLIGHT RING FOR ACTIVE TUTORIAL HUD TARGET (Must follow HUD targets in tree order for CSS Anchor Positioning) -->
      <div id="tutorialHudSpotlight" class="tutorial-hud-spotlight hidden" aria-hidden="true">
        <span id="tutorialHudSpotlightLabel" class="tutorial-hud-spotlight-pill">👇</span>
      </div>

      <!-- BÀ MOLLY WEASLEY 2.5D PERSISTENT TUTORIAL COACH POPOVER -->
      <div
        id="tutorialCoachCard"
        class="tutorial-coach-card"
        popover="manual"
        role="dialog"
        aria-labelledby="tutorialCoachTitle"
      ></div>

      <!-- DIALOG 1: OWL ORDER BOARD & STORY JOURNAL -->
      <dialog id="questDialog" closedby="any" aria-labelledby="questDialogTitle">
        <div class="parchment-panel modal-inner owl-orders-modal-inner">
          <div class="modal-header">
            <h2 id="questDialogTitle" class="modal-title"><img src="/trang-trai-hang-soc/sprites/ui_icon_owl_orders.png" alt="" style="width:28px;height:28px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Đơn Cú &amp; Nhiệm Vụ</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="questDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 2: 100 LEVELS & 10 ZONES ROADMAP -->
      <dialog id="roadmapDialog" closedby="any" aria-labelledby="roadmapDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="roadmapDialogTitle" class="modal-title">🗺️ Bản Đồ &amp; Lộ Trình</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="roadmapDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 3: FINANCE & MICRO-PRICING -->
      <dialog id="financeDialog" closedby="any" aria-labelledby="financeDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="financeDialogTitle" class="modal-title">📊 Sổ Cái</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="financeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 4: HOUSE CUP -->
      <dialog id="albumDialog" closedby="any" aria-labelledby="albumDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="albumDialogTitle" class="modal-title">🏆 Cúp 4 Nhà</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="albumDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 5: SETTINGS, BGM, SAVE & HEADMASTER PREVIEW -->
      <dialog id="settingsDialog" closedby="any" aria-labelledby="settingsDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="settingsDialogTitle" class="modal-title">⚙️ Cài Đặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="settingsDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 6: OFFLINE WELCOME BACK -->
      <dialog id="offlineDialog" closedby="any" aria-labelledby="offlineDialogTitle">
        <div class="parchment-panel modal-inner" style="max-width:480px;">
          <div class="modal-header">
            <h2 id="offlineDialogTitle" class="modal-title">🧦 Thu Hoạch Offline</h2>
            <form method="dialog"><button type="submit" class="brass-btn gold-cta" aria-label="Nhận" autofocus>✓</button></form>
          </div>
          <div id="offlineDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 7: FARMSTEAD STORAGE BARN, WORKSHOP, CARGO TRAIN & SYNERGIES -->
      <dialog id="workshopDialog" closedby="any" aria-labelledby="workshopDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="workshopDialogTitle" class="modal-title">🏡 Kho &amp; Xưởng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="workshopDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 8: MAGICAL CREATURE SANCTUARY SUITCASE -->
      <dialog id="suitcaseDialog" closedby="any" aria-labelledby="suitcaseDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="suitcaseDialogTitle" class="modal-title">🧳 Vali Thú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="suitcaseDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 9: ATTIC HARVEST MATCH-3 -->
      <dialog id="match3Dialog" closedby="any" aria-labelledby="match3DialogTitle">
        <div class="parchment-panel modal-inner m3-modal-inner">
          <div class="modal-header">
            <h2 id="match3DialogTitle" class="modal-title"><img src="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Bùa Gặt Honeydukes</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title"><img src="/trang-trai-hang-soc/sprites/m3_piece_scroll.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Ngũ Ấn Đạo Tặc</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">🪄 Học Viện Thần Chú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">🔥 Cổng Floo &amp; Hàng Xóm</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="neighborDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 13: HARVEST FEAST 30-TIER ACTION SEASON PASS -->
      <dialog id="harvestFeastDialog" closedby="any" aria-labelledby="harvestFeastDialogTitle">
        <div class="parchment-panel modal-inner feast-modal-inner">
          <div class="modal-header">
            <h2 id="harvestFeastDialogTitle" class="modal-title"><img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="feast-title-icon" />Lễ Hội Mùa Gặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="harvestFeastDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 14: PER-MINIGAME LEADERBOARDS & HOGWARTS 4-HOUSE CUP (HANG SÓC PARCHMENT & BRASS EDITION) -->
      <dialog id="leaderboardDialog" class="cc-lb-dialog" closedby="any" aria-labelledby="leaderboardDialogTitle">
        <div class="parchment-panel modal-inner lb-modal-inner cc-lb-card">
          <div class="modal-header cc-lb-header">
            <div class="cc-lb-title-stack">
              <span class="cc-lb-ribbon-sub">ĐẠI SẢNH ĐƯỜNG HANG SÓC • 3 MÔN TRANH CÚP</span>
              <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng &amp; Cúp 4 Nhà</h2>
            </div>
            <form method="dialog" class="cc-lb-close-form">
              <button type="submit" class="brass-btn" aria-label="Đóng bảng xếp hạng" autofocus>✕</button>
            </form>
          </div>
          <div id="leaderboardLiveAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
          <div id="leaderboardDialogToast" class="cc-lb-toast" hidden></div>
          <div id="leaderboardDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 15: DESTRUCTIVE BULLDOZE CONFIRMATION (CROPS / PASTURES / ACTIVE WORKSHOPS) -->
      <dialog id="bulldozeConfirmDialog" aria-labelledby="bulldozeConfirmTitle" class="bulldoze-confirm-dialog">
        <div class="parchment-panel modal-inner bulldoze-confirm-inner">
          <div class="modal-header">
            <h2 id="bulldozeConfirmTitle" class="modal-title">⚠️ Xác Nhận Phá Dỡ</h2>
            <form method="dialog"><button type="submit" value="cancel" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="bulldozeConfirmBody" class="bulldoze-confirm-body"></div>
          <form method="dialog" class="bulldoze-confirm-actions">
            <button type="submit" value="cancel" class="brass-btn" autofocus>Giữ lại</button>
            <button type="submit" value="confirm" class="brass-btn bulldoze-confirm-danger-btn">🧹 Vẫn phá dỡ</button>
          </form>
        </div>
      </dialog>
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function No(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},n=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(u=>{u.addEventListener("click",()=>{const m=u.dataset.switchMinigame;e.closeHudPopovers(),!m||m==="match3"?e.openMatch3Dialog():m==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(m)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",n),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",n),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",n),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",n),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",n);const o=()=>{e.closeHudPopovers();const u=e.sim.getLastPlayedMinigame();u==="caro"||u==="sudoku"||u==="chess"||u==="blocks"||u==="jigsaw"?e.openPuzzleArcadeDialog(u):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",o),e.root.querySelector("#btnPlusSand")?.addEventListener("click",o),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const s=u=>{u?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",u=>{u.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",u=>{u.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",s),e.root.querySelector("#chipHudBarn")?.addEventListener("click",s),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive)e.collapseBuildDock(),ye(e);else{const m=e.selectedCatalogItem,T=!!(m&&At(m)),L=m?.category;e.closeSeedTray(),e.closePastureTray(),ye(e),e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=T,e.activeCategory=T?"decor":L&&gn.includes(L)?L:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const u=e.sim.getActiveConstructions(Date.now());if(u.length===0)return;const m=u[0],T=ne(m.itemId);ye(e),we(e.cam,m.gx+(T?.width??1)*.5,m.gy+(T?.height??1)*.5),e.inspectSelection={kind:"building",uid:m.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",u=>{u.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const a=e.root.querySelector("#btnHudRoundOrb");if(a){let u=null,m=0,T=0,L=0,$=0,k=!1;a.addEventListener("pointerdown",h=>{if(h.button!==0&&h.pointerType==="mouse")return;const S=a.getBoundingClientRect();u=h.pointerId,m=h.clientX,T=h.clientY,L=S.left,$=S.top,k=!1;try{a.setPointerCapture(h.pointerId)}catch{}}),a.addEventListener("pointermove",h=>{if(u!==h.pointerId)return;const S=h.clientX-m,E=h.clientY-T;if(!k&&Math.hypot(S,E)>7&&(k=!0),k){const x=a.offsetWidth||52,M=a.offsetHeight||62,R=Math.max(6,Math.min(window.innerWidth-x-6,L+S)),V=Math.max(6,Math.min(window.innerHeight-M-6,$+E));a.style.left=`${Math.round(R)}px`,a.style.top=`${Math.round(V)}px`,a.style.right="auto",a.style.bottom="auto"}});const f=h=>{if(u===h.pointerId){u=null;try{a.hasPointerCapture(h.pointerId)&&a.releasePointerCapture(h.pointerId)}catch{}}};a.addEventListener("pointerup",f),a.addEventListener("pointercancel",f),a.addEventListener("click",h=>{if(k){h.preventDefault(),h.stopPropagation(),k=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",u=>{u.stopPropagation(),e.toggleWeatherPopover()});const r=e.root.querySelector("#secondaryMapToolsBar");if(r&&typeof HTMLElement<"u"&&!("focusGroup"in HTMLElement.prototype)){const u=Array.from(r.querySelectorAll("button"));u.forEach((m,T)=>{m.tabIndex=T===0?0:-1}),r.addEventListener("focusin",({target:m})=>{m instanceof HTMLButtonElement&&u.includes(m)&&u.forEach(T=>{T.tabIndex=T===m?0:-1})}),r.addEventListener("keydown",m=>{if(u.length===0)return;const T=Math.max(0,u.findIndex(k=>k===document.activeElement)),L=typeof getComputedStyle=="function"&&getComputedStyle(r).direction==="rtl";let $=-1;m.key==="ArrowRight"?$=(T+(L?-1:1)+u.length)%u.length:m.key==="ArrowLeft"?$=(T+(L?1:-1)+u.length)%u.length:m.key==="Home"?$=0:m.key==="End"&&($=u.length-1),$>=0&&(m.preventDefault(),u[$]?.focus())})}const l=u=>{const m=e.root.querySelector("#buildDrawer");if(!m)return;const T=Math.max(180,Math.round(m.clientWidth*.68))*u,L=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;m.scrollBy({left:T,behavior:L?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{l(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{l(1)});const i=(u,m)=>{u?.addEventListener("wheel",T=>{const L=m?u.querySelector(m):u;L&&L.scrollWidth>L.clientWidth+4&&Math.abs(T.deltaY)>Math.abs(T.deltaX)&&T.deltaY!==0&&(L.scrollLeft+=T.deltaY,T.preventDefault())},{passive:!1})};i(e.root.querySelector("#buildDrawer")),i(e.root.querySelector("#decorCollectionFilterBar")),i(e.root.querySelector("#seedBrushTray"),".seed-tray-scroll"),i(e.root.querySelector("#pastureBrushTray"),".seed-tray-scroll"),window.addEventListener("pointerdown",u=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const m=u.target;if(!m)return;const T=e.root.querySelector("#managePopoverMenu"),L=e.root.querySelector("#weatherPopoverMenu"),$=e.root.querySelector("#btnToggleManageMenu"),k=e.root.querySelector("#lblClock");T?.contains(m)||L?.contains(m)||$?.contains(m)||k?.contains(m)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()}),e.root.querySelector("#yuleEventBanner")?.addEventListener("click",()=>{e.activeQuestTab="quests",e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const p=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",p),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",p);const c=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",c),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",c),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const u=e.root.querySelector("#ribbonUnveilToastCard");u&&u.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const d=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",d),e.root.querySelector("#btnOpenZones")?.addEventListener("click",d),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",d),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const u=Ut.findIndex($=>$.mode===e.sim.heatmapMode),m=Ut[(u+1)%Ut.length];e.sim.heatmapMode=m.mode;const T=e.root.querySelector("#btnCycleHeatmap"),L=m.mode!=="none";T.textContent=m.label,T.setAttribute("data-active",String(L)),T.setAttribute("aria-pressed",String(L)),L&&e.showToast(`Đã bật ${m.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)});const g=()=>{const u=e.gameCanvas,m=typeof document<"u"?document.getElementById("gpuWorldCanvas"):null;if(!m||m.style.display==="none"||m.width<=0||m.height<=0)return u;const T=document.createElement("canvas");T.width=Math.max(640,u.width||m.width),T.height=Math.max(360,u.height||m.height);const L=T.getContext("2d");return L&&(L.drawImage(m,0,0,T.width,T.height),L.drawImage(u,0,0,T.width,T.height)),T};e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const u=g().toDataURL("image/png"),m=document.createElement("a");m.href=u,m.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,m.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnSaveYulePostcard")?.addEventListener("click",()=>{const u=g(),m=Math.max(640,u.width),T=Math.max(360,u.height),L=document.createElement("canvas");L.width=m,L.height=T;const $=L.getContext("2d");if(!$)return;$.drawImage(u,0,0,m,T);const k=Math.max(18,Math.round(Math.min(m,T)*.032));$.save(),$.strokeStyle="#14532d",$.lineWidth=k*1.15,$.strokeRect(k*.5,k*.5,m-k,T-k),$.strokeStyle="#f59e0b",$.lineWidth=Math.max(3,k*.18),$.strokeRect(k*.92,k*.92,m-k*1.84,T-k*1.84);const f=["#ef4444","#fbbf24","#34d399","#38bdf8"],h=Math.max(44,Math.round(m/18));for(let W=k*2,D=0;W<=m-k*2;W+=h,D++){const Y=f[D%f.length];$.fillStyle=Y,$.beginPath(),$.arc(W,k*.92,Math.max(4,k*.24),0,Math.PI*2),$.fill()}const S=Math.min(m-k*4,Math.max(360,Math.round(m*.62))),E=Math.max(44,Math.round(T*.078)),x=Math.round((m-S)*.5),M=T-k*1.4-E;$.fillStyle="rgba(20, 42, 32, 0.9)",$.strokeStyle="#fbbf24",$.lineWidth=2.5,$.beginPath(),$.roundRect(x,M,S,E,14),$.fill(),$.stroke();const R=Math.max(15,Math.round(E*.42));$.font=`700 ${R}px "Playfair Display", Georgia, serif`,$.fillStyle="#fef3c7",$.textAlign="center",$.textBaseline="middle",$.fillText(`🎄 Giáng Sinh An Lành • ${e.sim.state.parkName} (Cấp ${e.sim.state.level}) ✨`,m*.5,M+E*.52),$.restore();const V=L.toDataURL("image/png"),P=document.createElement("a");P.href=V,P.download=`thiep-giang-sinh-hang-soc-lv${e.sim.state.level}.png`,P.click(),e.sim.recordFlooShareOrPostcard?.("postcard"),e.showToast("Đã xuất Thiệp Giáng Sinh khung thông tuyết (.png)!","🎄")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",u=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const T=u.currentTarget;T.textContent=e.questCollapsed?"+":"–",T.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",u=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const m=u.currentTarget;m.textContent=e.minimapCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingAutoPlace")?.addEventListener("click",()=>{e.onAutoPlaceSelected?.()}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(an(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${_t[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?e.triggerRotateAction():e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){const u=e.selectedCatalogItem,m=At(u),T=u.category;ye(e),e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=m,e.activeCategory=m?"decor":gn.includes(T)?T:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive||e.moveModeActive||e.bulldozerActive||e.selectedCatalogItem?(ye(e),e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{ye(e),e.onTouchCancelPlace?.(),e.refreshAll()});const y=u=>{const m=e.minimapCanvas.getBoundingClientRect(),T=(u.clientX-m.left)/m.width*e.minimapCanvas.width,L=(u.clientY-m.top)/m.height*e.minimapCanvas.height,$=e.minimapCanvas.width*.46/Re,k=e.minimapCanvas.height*.44/Re,f=(T-e.minimapCanvas.width*.5)/$,h=(L-8)/k,S=(f+h)*.5,E=(h-f)*.5,{fgx:x,fgy:M}=Aa(S,E,e.cam.viewRot??0),R=Math.max(0,Math.min(Re-1,x)),V=Math.max(0,Math.min(Re-1,M));e.rideCamUid=null,we(e.cam,R,V)};let C=!1;e.minimapCanvas.addEventListener("pointerdown",u=>{C=!0,y(u)}),window.addEventListener("pointermove",u=>{C&&y(u)}),window.addEventListener("pointerup",()=>{C=!1}),e.root.querySelectorAll("[data-cat]").forEach(u=>{u.addEventListener("click",()=>{const m=u.dataset.cat;if(!gn.includes(m))return;const T=e.activeCategory===m&&!(m==="decor"&&e.christmasTabActive);ye(e),e.inspectSelection=null,e.christmasTabActive=!1,T?e.activeCategory=null:(e.activeCategory=m,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,m==="decor"&&e.activeDecorFilter!=="recent"&&(e.activeDecorFilter="all")),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelectorAll("[data-decor-event]").forEach(u=>{u.addEventListener("click",()=>{const m=e.activeCategory==="decor"&&e.christmasTabActive;ye(e),e.inspectSelection=null,m?(e.activeCategory=null,e.christmasTabActive=!1):(e.activeCategory="decor",e.christmasTabActive=!0,e.buildSheetOpen=!0,e.mapToolsExpanded=!0),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{const u=!e.moveModeActive;ye(e),u&&(e.moveModeActive=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("✋ Chế độ Di Dời: Chạm công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{const u=!e.bulldozerActive;ye(e),u&&(e.bulldozerActive=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("🧹 Chế độ Xóa: Chạm công trình hoặc đường cần dọn dẹp!","🧹")),e.refreshAll()}),e.root.querySelector("#btnBuildUndo")?.addEventListener("click",u=>{if(u.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể hoàn tác thao tác của bạn bè!","🏡");return}const T=e.sim.undoBuild();e.showToast(T?"↶ Đã hoàn tác thao tác xây dựng gần nhất.":"Không có thao tác nào để hoàn tác.","↶"),e.refreshAll()}),e.root.querySelector("#btnBuildRedo")?.addEventListener("click",u=>{if(u.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể làm lại thao tác của bạn bè!","🏡");return}const T=e.sim.redoBuild();e.showToast(T?"↷ Đã làm lại thao tác xây dựng.":"Không có thao tác nào để làm lại.","↷"),e.refreshAll()}),e.root.querySelector("#btnBuildDone")?.addEventListener("click",()=>{e.collapseBuildDock(),ye(e),e.refreshAll()}),e.root.querySelector("#btnMenuRotateCam")?.addEventListener("click",()=>{an(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${_t[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnMenuCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.closeHudPopovers(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnMenuGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.closeHudPopovers(),e.refreshAll()}),window.addEventListener("keydown",u=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(u.target instanceof HTMLInputElement||u.target instanceof HTMLTextAreaElement||u.target instanceof HTMLSelectElement||u.target instanceof HTMLElement&&u.target.classList.contains("drag-handle"))){if(u.ctrlKey||u.metaKey||u.altKey){(u.ctrlKey||u.metaKey)&&(u.key==="z"||u.key==="Z")?(u.preventDefault(),u.shiftKey?e.sim.redoBuild():e.sim.undoBuild(),e.refreshAll()):(u.ctrlKey||u.metaKey)&&(u.key==="y"||u.key==="Y")&&(u.preventDefault(),e.sim.redoBuild(),e.refreshAll());return}if(u.key==="n"||u.key==="N")e.openNeighborDialog();else if(u.key==="r"||u.key==="R"){if(e.sim.isVisitingNeighbor)return;e.triggerRotateAction()}else if(u.key==="q"||u.key==="Q")an(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${_t[e.cam.viewRot??0]}`,"🧭");else if(u.key==="e"||u.key==="E")an(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${_t[e.cam.viewRot??0]}`,"🧭");else if(u.key==="v"||u.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(u.key==="m"||u.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}const m=!e.moveModeActive;ye(e),m&&(e.moveModeActive=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("✋ Chạm chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(u.key==="b"||u.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(u.key==="j"||u.key==="J")e.openMatch3Dialog();else if(u.key==="k"||u.key==="K")e.openPuzzleArcadeDialog();else if(u.key==="l"||u.key==="L")e.openLeaderboardDialog();else if(u.key==="h"||u.key==="H")e.toggleHudRollup();else if(u.key==="p"||u.key==="P")e.togglePhotoMode();else if(u.key==="x"||u.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}const m=!e.bulldozerActive;ye(e),m&&(e.bulldozerActive=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(u.key==="Escape"){if(e.sim.pendingBuildStroke&&e.sim.cancelBuildStroke(),e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,ye(e),e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else u.key===" "&&(e.rideCamUid=null,we(e.cam,16,18),e.refreshFloatingBanner())}})}function Oo(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive,typeof document<"u"&&(document.body.dataset.photoMode=e.photoModeActive?"true":"false");const n=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||n);const o=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,s=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n||o||s),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!n),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),pi(e),ui(e),Zt(e),e.renderTutorialCoach()}function Ts(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function zo(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(qt(e),pt(e),e.closeSeedTray(),e.closePastureTray()),Zt(e)}function Zt(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const n=Ts(e),o=e.hudRolledUp&&!e.photoModeActive&&!n,s=e.sim.isVisitingNeighbor,a=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,r=!e.photoModeActive&&!s&&(e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen);t.classList.toggle("hud-building-focus",n),t.classList.toggle("hud-compact-rolled",o),t.classList.toggle("hud-sheet-or-tray-open",r),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||s||a||r);const l=e.root.querySelector("#btnToggleHudRollup");l&&(l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.active=String(e.hudRolledUp),l.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const i=e.root.querySelector("#svgHudRollupChevron");i&&i.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const p=e.root.querySelector("#btnManageToggleHudRollup");p&&(p.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const c=e.root.querySelector("#btnHudRoundOrb");c&&(c.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||n),c.setAttribute("aria-pressed",String(e.hudRolledUp)),c.dataset.rolled=String(e.hudRolledUp));const d=e.root.querySelector("#lblHudRoundOrbTag");d&&(d.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const g=e.root.querySelector("#svgRoundOrbChevron");g&&g.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),n&&(qt(e),pt(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#decorCollectionFilterBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function qt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const n=e.root.querySelector("#managePopoverMenu"),o=e.root.querySelector("#weatherPopoverMenu"),s=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");n?.classList.add("hidden"),o?.classList.add("hidden"),s&&(s.setAttribute("aria-expanded","false"),s.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function pt(e){e.buildSheetOpen=!1,e.activeCategory=null,e.christmasTabActive=!1,e.mapToolsExpanded=!1}function Fo(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function _o(e){pt(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.activeSeedCropId=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.activePastureAnimalId=null}function ci(e,t,n){if(!t||!n)return;const o=t.getBoundingClientRect(),s=Math.min(window.innerWidth-16,Math.max(248,n.offsetWidth||336)),a=Math.min(n.offsetHeight||420,window.innerHeight-16),r=o.left<window.innerWidth*.5?o.left:o.right-s,l=Math.max(8,Math.min(r,window.innerWidth-s-8)),i=Math.max(8,Math.min(o.bottom+8,window.innerHeight-a-8));n.style.left=`${Math.round(l)}px`,n.style.top=`${Math.round(i)}px`}function Go(e,t){if(e.sim.isVisitingNeighbor){qt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const n=typeof t=="boolean"?t:!e.manageMenuOpen;if(qt(e),!n)return;e.manageMenuOpen=!0;const o=e.root.querySelector("#managePopoverMenu"),s=e.root.querySelector("#btnToggleManageMenu");o&&s&&(o.classList.remove("hidden"),s.setAttribute("aria-expanded","true"),s.setAttribute("data-active","true"),ci(e,s,o)),e.renderTutorialCoach()}function Vo(e,t){const n=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(qt(e),!n)return;e.weatherPopoverOpen=!0;const o=e.root.querySelector("#weatherPopoverMenu"),s=e.root.querySelector("#lblClock");o&&s&&(di(e),o.classList.remove("hidden"),s.setAttribute("aria-expanded","true"),ci(e,s,o)),e.renderTutorialCoach()}function di(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const n=Date.now(),o=e.sim.getCurrentWeather(n),s=e.sim.getWeatherForecast(4,n),a=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${a?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${o.icon} ${A(o.labelVi)}</div>
        <div class="weather-current-buff">✨ ${A(o.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${s.map((r,l)=>{const i=l===0?"Nay":`+${Fe(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${A(r.labelVi)}</span>
                <span class="weather-slot-meta">${A(i)}</span>
              </div>
            `}).join("")}
      </div>
    `}function $s(e,t){const n=e.root.querySelector("#lblGalleons");if(!n)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),n.textContent="∞",e.displayedGalleons=t;return}const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||o||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,n.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const s=e.displayedGalleons,a=performance.now(),r=420,l=i=>{const p=Math.min(1,(i-a)/r),c=1-Math.pow(1-p,3),d=Math.round(s+(t-s)*c);e.displayedGalleons=d,n.textContent=d.toLocaleString("vi-VN"),p<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function Uo(e,t,n,o,s){const a=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!a||!r)return;const l=()=>{a.classList.remove("hud-chip-pulse"),a.offsetWidth,a.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const i=a.getBoundingClientRect();if(i.width<=0&&i.height<=0)return;const p=i.left+i.width*.5,c=i.top+i.height*.5,d=typeof o=="number"&&Number.isFinite(o)?Math.max(24,Math.min(window.innerWidth-24,o)):window.innerWidth*.5,g=typeof s=="number"&&Number.isFinite(s)?Math.max(24,Math.min(window.innerHeight-24,s)):window.innerHeight*.54,y={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},C=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(n))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,n)))));for(let u=0;u<C;u++){const m=document.createElement("div");m.className="fly-reward-token",m.dataset.kind=t,m.textContent=y[t],r.appendChild(m);const T=u/Math.max(1,C)*Math.PI*2+(Math.random()-.5)*.5,L=14+u%3*9,$=d+Math.cos(T)*L,k=g+Math.sin(T)*L*.7,f=($+p)*.5+(u%2===0?-42:42),h=Math.min(k,c)-(48+u%3*18),S=560+u*48,E=u*52,x=m.animate([{transform:`translate3d(${$}px, ${k}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${$}px, ${k-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${f}px, ${h}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${p}px, ${c}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:S,delay:E,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});x.onfinish=()=>{m.remove(),l(),e.sim.audio.playFlyTick(u)}}}function Wo(e,t="🦉"){const n=e.trim();if(!n)return t.trim();const o=t.trim();if(!o)return n;const s=l=>l.replace(/\uFE0F/g,""),a=s(o);let r=n;for(;a&&s(r).startsWith(`${a} ${a}`);)r=r.slice(o.length).trimStart();return a&&s(r).startsWith(a)||o==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${o} ${r}`}function mn(e){const t=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!t)return null;const n=Array.from(e.root.querySelectorAll("dialog[open]")),o=n.length>0?n[n.length-1]:null;return o?t.parentElement!==o&&(o.appendChild(t),o.addEventListener("close",()=>{const s=Array.from(e.root.querySelectorAll("dialog[open]")),a=s.length>0?s[s.length-1]:e.root;t.parentElement!==a&&a.appendChild(t)},{once:!0})):t.parentElement!==e.root&&e.root.appendChild(t),t}function Ze(e,t,n="🦉"){const o=mn(e);if(!o)return;let s=0;for(;(o.children?.length??0)>=2&&o.firstElementChild&&s<8;)s++,o.firstElementChild.remove();const a=document.createElement("div");a.className="parchment-dark owl-toast",a.textContent=Wo(t,n),o.appendChild(a),window.setTimeout(()=>a.remove(),3500)}function jo(e,t){const n=Math.max(1,Math.round(t.awaySeconds/60)),o=e.root.querySelector("#offlineDialogContent");o.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${n} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function pi(e){const t=e.root.querySelector("#floatingModeBanner"),n=e.root.querySelector("#floatingBannerText"),o=e.root.querySelector("#btnFloatingAutoPlace"),s=e.root.querySelector("#btnFloatingSecondary"),a=e.root.querySelector("#btnFloatingSwap"),r=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!n||!s||!a||!r)){if(o?.classList.add("hidden"),a.classList.add("hidden"),r.classList.add("gold-cta"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const l=e.sim.state.buildings.find(p=>p.uid===e.rideCamUid),i=l?ne(l.itemId):void 0;if(!l||!i)e.rideCamUid=null;else{t.classList.remove("hidden"),n.textContent=`🎥 ${i.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,s.textContent="🧭 90°",s.classList.remove("hidden"),r.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),n.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Chạm ô để thả`:"🤏 Điều phối nhân sự — Chạm ô để thả • Esc hủy",s.classList.add("hidden"),r.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const l=e.sim.state.buildings.find(p=>p.uid===e.movingBuildingUid),i=l?ne(l.itemId):void 0;n.textContent=`✋ ${i?.name??"Dời chỗ"}`,s.textContent=`🔄 ${e.rotation*90}°`,s.classList.remove("hidden"),r.textContent="✕"}else n.textContent="✋ Chọn công trình để dời",s.classList.add("hidden"),r.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),n.textContent="🧹 Phá dỡ",s.classList.add("hidden"),r.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const l=e.selectedCatalogItem,i=l.category!=="path"&&l.category!=="terrain"&&!l.isFarmlandPlot&&!l.connectableGroup&&!l.isZooFence,p=l.category!=="path"&&l.category!=="terrain"&&!l.isCoasterTrackPiece&&!l.isZooFence&&!l.elevationDelta,c=e.sim.getEffectiveItemStarCost(l),d=c>0?`🌟 ${c}`:l.cost===0?"0G":`${l.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),n.textContent=`🏗️ ${l.name} • ${d}`,p&&o&&(o.textContent="⚡ Đặt Ngay",o.classList.remove("hidden"),r.classList.remove("gold-cta")),i?(s.textContent=`🔄 ${e.rotation*90}°`,s.classList.remove("hidden")):s.classList.add("hidden"),a.textContent="📦 Đổi",a.classList.remove("hidden"),r.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const l=ke[e.activeSeedCropId],i=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),n.textContent=`🌱 ${l.emoji} ${l.name} (${i})`,s.textContent="🌱 Đổi",s.classList.remove("hidden"),r.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const l=St[e.activePastureAnimalId];t.classList.remove("hidden"),n.textContent=`🐾 ${l.emoji} ${l.name} (${l.cost.toLocaleString("vi-VN")}G)`,s.textContent="🐾 Đổi",s.classList.remove("hidden"),r.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),n.textContent="👁️ Nhìn xuyên",s.classList.add("hidden"),r.textContent="✕";return}t.classList.add("hidden")}}function ui(e){const t=e.root.querySelector("#touchConfirmBar"),n=e.root.querySelector("#lblTouchConfirm");if(!(!t||!n)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),n.textContent=`📍 ${e.pendingTouchTile.label}`}}function Cs(e){const t=e.root.querySelector("#yuleEventBanner"),n=e.root.querySelector("#yuleEventBannerTitle"),o=e.root.querySelector("#yuleEventBannerTask"),s=e.root.querySelector("#yuleEventBannerProgress");if(!t||!n||!o||!s)return;const a=e.sim.getYuleEventStatus();if(e.photoModeActive||e.sim.isVisitingNeighbor||!a.active||!a.dayDef){t.classList.add("hidden");return}const r=a.dayDef.main,l=e.sim.getYuleTaskProgress(r.id),i=e.sim.getYuleTaskTarget(r.id),p=a.claimedMainDays.includes(a.day);n.textContent=`🎄 Yule • Ngày ${a.day}/36`,o.textContent=p?"Đã nhận phần thưởng":r.titleVi,s.textContent=p?"✓":`${Math.min(l,i)}/${i}`,t.classList.remove("hidden")}function ks(e){const t=e.sim.getYuleEventStatus();if(!t.active||!t.dayDef||e.photoModeActive||e.sim.isVisitingNeighbor){e.yuleReadySig="";return}const o=[t.dayDef.main,...t.dayDef.side].filter(a=>!(a===t.dayDef.main?t.claimedMainDays.includes(t.day):t.claimedSideTaskIds.includes(a.id))&&e.sim.getYuleTaskProgress(a.id)>=a.amount);if(o.length===0){e.yuleReadySig="";return}const s=o.map(a=>a.id).join("|");e.yuleReadySig!==s&&(e.yuleReadySig=s,e.showToast(`🎄 Yule: ${o.length} nhiệm vụ sẵn sàng — mở bảng Nhiệm Vụ để nhận!`,"🎄"))}function Xt(e){const t=e.sim.isVisitingNeighbor;t&&(ye(e),e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Ms(e),Cs(e),ks(e),Ls(e),wn(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t);const n=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,o=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t||n||o),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),pi(e),ui(e),Zt(e),e.renderTutorialCoach()}function Yn(e){const t=new Date,n=String(t.getHours()).padStart(2,"0"),o=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const s=e.sim.getCurrentWeather(t.getTime()),a=e.root.querySelector("#lblClock");if(a){const y=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";a.innerHTML=`${s.icon} <span>${n}:${o}</span>${y}`}e.weatherPopoverOpen&&di(e);const r=e.sim.getActiveFestival(t),l=typeof e.sim.isWinterMainMapActive=="function"&&e.sim.isWinterMainMapActive();if(typeof document<"u"){const y=e.sim.isYuleVisualThemeActive(t)||l?"true":"false";document.documentElement.dataset.yuleTheme!==y&&(document.documentElement.dataset.yuleTheme=y)}const i=e.root.querySelector("#lblFestival");i&&(r==="halloween"?(i.classList.remove("hidden"),i.textContent="🎃 +35% XP"):r==="christmas"?(i.classList.remove("hidden"),i.textContent="🎄 Giáng Sinh +25% 🪙"):r==="quidditch_cup"&&!l?(i.classList.remove("hidden"),i.textContent="🏆 +Cúp"):l?(i.classList.remove("hidden"),i.textContent="🎄 Đồi Tuyết Giáng Sinh"):i.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const p=e.sim.state,c=e.root.querySelector("#lblPuzzleHearts");if(c&&p.match3)if(p.sandboxMode)c.textContent="∞";else if(p.match3.hearts>=yn)c.textContent=`${p.match3.hearts}/${yn}`;else{const y=Math.max(0,Math.ceil((p.match3.nextHeartAt-Date.now())/1e3)),C=Math.floor(y/60),u=String(y%60).padStart(2,"0");c.textContent=`${p.match3.hearts} (${C}:${u})`}const d=e.root.querySelector("#btnHudActiveBuilds"),g=e.root.querySelector("#lblActiveBuilds");if(d&&g){const y=e.sim.getActiveConstructions(Date.now());if(y.length===0)d.classList.add("hidden");else{d.classList.remove("hidden");const C=Math.max(1,Math.ceil((y[0].constructEndsAt-Date.now())/1e3));g.textContent=`${y.length} (${Fe(C)})`}}}function Ms(e){const t=e.sim.state,n=e.sim.getRequiredLevelTrial(),o=Math.max(0,t.xp)%zt,s=Math.max(6,Math.min(100,o/zt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+as(t.level),e.root.querySelector("#barXpFill").style.width=`${s}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const J=e.sim.getActiveVisitingNeighbor();r.textContent=J?`🚂 Thăm: ${J.avatarEmoji} ${J.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getTotalTowerClearedStages(),p=t.level>=ot?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),c=e.root.querySelector("#btnOpenRoadmap");c&&(c.style.setProperty("--hg-lvl-pct",String(p)),c.title=t.level>=ot?`👑 Cấp Tối Đa ${ot} • Rương XP: ${o}/${zt} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${o}/${zt}`);const d=e.root.querySelector("#barLevelTopFill");d&&(d.style.width=`${p}%`,d.parentElement&&(d.parentElement.title=t.level>=ot?`👑 Đã đạt Cấp Tối Đa ${ot} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`));const g=e.root.querySelector("#lblXpFraction");g&&(g.textContent=`🎁 ${o}/${zt}`);const y=e.sim.ensureFarmBarn(),C=e.sim.getBarnTotalUsed(),u=e.root.querySelector("#lblStorageBarn");u&&(u.textContent=`${C}/${y.capacity}`),$s(e,t.galleons);const m=t.sandboxMode?"∞":String(t.match3?.stars??0),T=e.root.querySelector("#lblPuzzleStars");T&&t.match3&&(T.textContent=m);const L=e.root.querySelector("#lblHudHubStars");L&&(L.textContent=m);const $=e.root.querySelector("#lblHudHubTrial");$&&(t.level>=ot||t.sandboxMode||e.sim.isHeadmasterPreview||!n?$.textContent=`♟️ ${i.cleared}/${i.total}`:$.textContent=`🔥 ${n.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const k=e.sim.getDisciplineStageInfo("match3"),f=e.sim.getLastPlayedMinigame();let h="🍬 Bùa Gặt",S="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",E=k.isMaxed?`👑 ${Ye}`:`Màn ${k.currentStage}`;if(f==="caro"){const J=e.sim.getDisciplineStageInfo("caro");h="🗺️ Ngũ Ấn",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=J.isMaxed?`👑 ${Ye}`:`Màn ${J.currentStage}`}else if(f==="sudoku"){const J=e.sim.getDisciplineStageInfo("sudoku");h="🔢 Số Học",S="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",E=J.isMaxed?`👑 ${Ye}`:`Màn ${J.currentStage}`}else if(f==="blocks"){const J=e.sim.getDisciplineStageInfo("blocks");h="🦄 Sinh Vật",S="/trang-trai-hang-soc/sprites/beast_niffler.png",E=J.isMaxed?`👑 ${Ye}`:`Màn ${J.currentStage}`}else if(f==="chess"){const J=e.sim.getDisciplineStageInfo("chess");h="🏰 Cờ Phù Thủy",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=J.isMaxed?`👑 ${Ye}`:`Màn ${J.currentStage}`}else if(f==="jigsaw"){const J=e.sim.getDisciplineStageInfo("jigsaw");h="🧩 Tranh Ghép",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=J.isMaxed?`👑 ${Ye}`:`Màn ${J.currentStage}`}else f==="seedquiz"&&(h="🪄 Thần Chú",S="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",E="Ôn Tập");const x=e.root.querySelector("#imgCornerPlayIcon");x&&x.getAttribute("src")!==S&&x.setAttribute("src",S);const M=e.root.querySelector("#badgeCornerPlayBonus");M&&(M.textContent=h,M.classList.remove("hidden"));const R=e.root.querySelector("#lblCornerPlayStage");R&&(R.textContent=E);const V=e.root.querySelector("#lblCornerPlaySub");V&&(V.textContent=t.level>=ot?`👑 Cấp ${ot}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const P=e.root.querySelector("#btnCornerPlayPuzzle");if(P){const J=`Chơi tiếp ${h} — ${E}`;P.title=J,P.setAttribute("aria-label",J)}e.root.querySelectorAll("[data-switch-minigame]").forEach(J=>{const xe=J.dataset.switchMinigame===f;J.dataset.active=String(xe),J.setAttribute("aria-pressed",String(xe))});const W=e.root.querySelector("#badgeBuildReadyCount");if(W){const J=new Set(t.buildings.map(Le=>Le.itemId)),xe=t.sandboxMode?999:t.match3?.stars??0,Ve=os.filter(Le=>{if(Le.isThemeParkLegacy)return!1;const Ue=e.sim.getEffectiveItemStarCost(Le);return Ue<=0||!e.sim.isCatalogItemUnlocked(Le)?!1:!J.has(Le.id)&&xe>=Ue}).length;Ve>0&&!e.sim.isHeadmasterPreview?(W.textContent=String(Ve),W.classList.remove("hidden")):W.classList.add("hidden")}const D=e.root.querySelector("#lblMatch3Lv");D&&t.match3&&(D.textContent=k.isMaxed?`👑${Ye}`:`${k.currentStage}/${Ye}`);const Y=e.root.querySelector("#lblArcadeTowerLv");if(Y){const J=Math.max(0,i.cleared-k.clearedStages),xe=Ye*5;Y.textContent=J>=xe?`👑${xe}`:`${J}/${xe}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const Z=e.sim.getActiveStoryQuest(),ie=e.sim.getReadyOwlOrdersCount(),N=(Z?.completed?1:0)+t.owlQuests.filter(J=>J.completed&&!J.claimed).length+t.dailyQuests.filter(J=>J.completed&&!J.claimed).length,q=ie+N,_=q>0?q:y.owlOrders.length,ee=e.root.querySelector("#badgeQuestCount");_>0?(ee.textContent=String(_),ee.classList.toggle("is-ready-green",ie>0),ee.classList.remove("hidden")):ee.classList.add("hidden");const B=t.supply.cargoCrates.filter(J=>!J.fulfilled&&(t.sandboxMode||(t.supply.goods[J.goodId]??0)>=J.qtyRequired)).length,j=e.root.querySelector("#badgeWorkshopCount");j&&(B>0?(j.textContent=String(B),j.classList.remove("hidden")):j.classList.add("hidden"));const le=Object.values(t.housePoints).reduce((J,xe)=>J+xe,0)>=t.houseCupMilestoneTier*300,re=e.sim.getClaimableRetentionCount(),be=(le?1:0)+re.total,de=e.root.querySelector("#badgeCardCount");de&&(be>0?(de.textContent=String(be),de.classList.remove("hidden")):de.classList.add("hidden")),e.refreshSuitcaseBadge();const fe=e.root.querySelector("#badgeSuitcaseCount"),et=fe&&!fe.classList.contains("hidden")?Math.max(0,Number.parseInt(fe.textContent||"0",10)||0):0,ge=e.sim.getClaimableHarvestFeastCount(),$e=e.root.querySelector("#badgeManageMenuDot");if($e){const J=B+be+ge+et;J>0?($e.textContent=String(J),$e.classList.remove("hidden")):$e.classList.add("hidden")}As(e),Yn(e);const Me=e.root.querySelector("#btnCycleHeatmap");if(Me){const J=Ut.find(Ve=>Ve.mode===e.sim.heatmapMode)??Ut[0],xe=e.sim.heatmapMode!=="none";Me.textContent=J.label,Me.dataset.active=String(xe),Me.setAttribute("aria-pressed",String(xe))}Yn(e)}function As(e){const t=e.sim.state,n=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,o=t.buildings.some(a=>!!ne(a.itemId)?.isCreatureHabitat),s=(t.match3?.hearts??yn)>=yn&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",s),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",n&&!o),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const a=e.root.querySelector("#btnToggleMinimap");a&&(a.textContent="–",a.setAttribute("aria-expanded","true"))}}function Ls(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const n=e.sim.state,o=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const s=e.sim.getActiveStoryQuest(),a=n.owlQuests.slice(0,2);let r="";if(o&&!n.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getDisciplineStageInfo(o.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${o.icon} ${A(o.shortVi)} (${i.currentStage}/${Ye}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${o.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(s){const l=Math.min(100,Math.round(s.progress/Math.max(1,s.targetAmount)*100)),i=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${A(s.giverEmoji)} ${A(s.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(s.progress,s.targetAmount)}/${s.targetAmount}</span>
            ${s.completed?`<button type="button" data-claim="${A(s.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${s.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${A(i.longLabel)}">${A(i.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const l of a){const i=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${A(l.giverEmoji)} ${A(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${i}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${A(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const i=e.sim.completeStoryStepWithStar();if(i.ok){typeof i.placedGx=="number"&&typeof i.placedGy=="number"&&we(e.cam,i.placedGx,i.placedGy);return}Ze(e,i.msg,i.reason==="missing_gold"?"🪙":i.reason==="locked_level"?"🔒":"🌟"),i.reason==="open_match3"&&e.openTrialMinigame()})})}function wn(e){const t=(x,M)=>{x&&(x.setAttribute("data-active",String(M)),x.setAttribute("aria-pressed",String(M)))},n=e.activeCategory==="decor"&&!!e.christmasTabActive;e.root.querySelectorAll("[data-cat]").forEach(x=>{const M=x.dataset.cat,R=M===e.activeCategory&&!(M==="decor"&&n);t(x,R)}),e.root.querySelectorAll("[data-decor-event]").forEach(x=>{t(x,n)}),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const o=e.root.querySelector("#btnRotate");if(o){const x=(e.rotation??0)*90;o.textContent=x>0?`🔄 Xoay ${x}°`:"🔄 Xoay"}const s=e.root.querySelector("#btnMenuRotateCam");if(s){const x=e.cam.viewRot??0;s.textContent=_t[x]}t(e.root.querySelector("#btnMenuCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnMenuGrid"),e.sim.state.settings.showGrid);const a=e.root.querySelector("#btnBuildUndo"),r=e.root.querySelector("#btnBuildRedo"),l=e.sim.isVisitingNeighbor||(typeof e.sim.canUndoBuild=="function"?!e.sim.canUndoBuild():!0),i=e.sim.isVisitingNeighbor||(typeof e.sim.canRedoBuild=="function"?!e.sim.canRedoBuild():!0);a&&a.setAttribute("aria-disabled",String(l)),r&&r.setAttribute("aria-disabled",String(i));const p=e.root.querySelector("#btnAccioAll");p&&(p.disabled=e.sim.isVisitingNeighbor);const c=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,d=e.root.querySelector("#secondaryMapToolsBar");d&&d.classList.toggle("hidden",!c);const g=c||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",c),Zt(e),t(e.root.querySelector("#btnToggleBuildDock"),g);const C=e.root.querySelector("#buildDrawer"),u=e.root.querySelector("#buildDrawerSwipeBar"),m=e.root.querySelector("#decorCollectionFilterBar"),T=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!gn.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,C.classList.add("hidden"),u?.classList.add("hidden"),m?.classList.add("hidden"),T.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}C.classList.remove("hidden"),C.dataset&&(C.dataset.christmasDrawer=String(n)),T.classList.add("hidden");const L=e.recentDecorIds??[],$=new Map(L.map((x,M)=>[x,M]));if(m)if(e.activeCategory==="decor"&&n){m.classList.remove("hidden");const x=L.filter(V=>{const P=ne(V);return!!(P&&At(P))}).length,M=e.activeChristmasFilter??"all",R=[{id:"all",label:"✨ Tất cả (105)"},{id:"recent",label:x>0?`🕘 Gần đây (${x})`:"🕘 Gần đây"},{id:"yule_trees",label:"🌲 Cây tuyết"},{id:"yule_flowers",label:"🌺 Hoa đông"},{id:"modular",label:"❄️ Hàng rào"},{id:"landmarks",label:"🏰 Địa danh"},{id:"hogwarts_crests",label:"🦁 4 Nhà"},{id:"burrow",label:"🧣 Hang Sóc"},{id:"hogwarts",label:"🕯️ Dạ vũ"},{id:"hogsmeade",label:"🍺 Hogsmeade"},{id:"express",label:"🚂 Cú & Tàu"},{id:"creatures",label:"🦌 Sinh vật"},{id:"book_lore",label:"📖 Điển tích"}];m.innerHTML=R.map(V=>{const P=M===V.id;return`<button type="button" role="tab" aria-selected="${P}" data-decor-filter="${V.id}" class="decor-filter-chip ${P?"active is-active":""}">${V.label}</button>`}).join(""),m.querySelectorAll("[data-decor-filter]").forEach(V=>{V.addEventListener("click",()=>{e.activeChristmasFilter=V.dataset.decorFilter??"all",C.scrollLeft=0,wn(e)})})}else if(e.activeCategory==="decor"){m.classList.remove("hidden");const x=L.filter(V=>{const P=ne(V);return!!(P&&P.category==="decor"&&!At(P))}).length,M=e.activeDecorFilter==="recent"?"recent":"all",R=[{id:"all",label:"✨ Tất cả"},{id:"recent",label:x>0?`🕘 Gần đây (${x})`:"🕘 Gần đây"}];m.innerHTML=R.map(V=>{const P=M===V.id;return`<button type="button" role="tab" aria-selected="${P}" data-decor-filter="${V.id}" class="decor-filter-chip ${P?"active is-active":""}">${V.label}</button>`}).join(""),m.querySelectorAll("[data-decor-filter]").forEach(V=>{V.addEventListener("click",()=>{e.activeDecorFilter=V.dataset.decorFilter??"all",C.scrollLeft=0,wn(e)})})}else m.classList.add("hidden");const k=e.activeCategory==="decor"&&(n?(e.activeChristmasFilter??"all")==="recent":e.activeDecorFilter==="recent"),f=os.filter(x=>{if(x.category==="terrain"||x.isThemeParkLegacy)return!1;if(e.activeCategory==="creature")return x.category==="creature"||x.id==="farmland_plot";if(x.category!==e.activeCategory)return!1;if(e.activeCategory==="decor"){const M=At(x);if(n){if(!M)return!1;const R=e.activeChristmasFilter??"all";return R==="recent"?$.has(x.id):R==="all"?!0:x.id==="snowy_pines"?R==="yule_trees"||R==="hogsmeade":x.yuleCollection===R}return M?!1:e.activeDecorFilter==="recent"?$.has(x.id):!0}return!0});k?f.sort((x,M)=>($.get(x.id)??999)-($.get(M.id)??999)):e.activeCategory==="creature"&&f.sort((x,M)=>x.id==="farmland_plot"?-1:M.id==="farmland_plot"?1:0);const h=e.sim.state.sandboxMode,S=e.sim.state.match3?.stars??0,E=e.sim.state.galleons;if(f.length===0&&k){C.innerHTML=`
        <div class="catalog-empty-hint">
          🕘 Chưa có vật phẩm vừa đặt gần đây — hãy chọn một món trong <strong>✨ Tất cả</strong> nhé!
        </div>
      `,Xi(e,C);return}C.innerHTML=f.map(x=>{const M=Ii(e.sim,x),R=M===0&&!e.sim.isCatalogItemUnlocked(x),V=e.selectedCatalogItem?.id===x.id,P=x.elevationDelta?x.elevationDelta>0?"⛰️":"⛏️":x.isCoasterTrackPiece?"🛤️":x.isZooFence?"🚧":x.isBench?"🪑":x.category==="path"?"🛣️":x.category==="terrain"?"🌿":"🕯️",W=Ss(x),D=W?`<img src="${W}" alt="${A(x.name)}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${P}</div>`,Y=e.sim.getEffectiveItemStarCost(x),ie=Y>0&&!x.connectableGroup&&x.category!=="decor"&&e.sim.state.buildings.some(re=>re.itemId===x.id),N=M===0&&!h&&!R&&Y>0&&S<Y,q=M===0&&!h&&!R&&Y===0&&E<x.cost,_=M===0&&(N&&!ie||q),ee=ca(x),B=ee>0?` • ⏱️ ${Ae(ee)}`:"",j=Y>0?`🌟 ${Y}`:`🪙 ${x.cost.toLocaleString("vi-VN")}G`,oe=M>0?`📦 Kho: ${M} • 0G`:R?`🔒 Cấp ${x.unlockLevel} • ${j}${B}`:ie?N?`✅ Đã xây • 🌟 ${S}/${Y}`:`✅ Đã xây • 🌟 ${Y}`:N?`🌟 ${S}/${Y}${B}`:Y>0?`🌟 ${Y}${B}`:q?`🪙 ${E.toLocaleString("vi-VN")}/${x.cost.toLocaleString("vi-VN")}G${B}`:`🪙 ${x.cost.toLocaleString("vi-VN")}G${B}`,le=n&&At(x);return`
          <button
            type="button"
            class="catalog-card ${le?"yule-festive-card":""} ${R?"locked":""} ${_?"short-resource":""}"
            data-item-id="${x.id}"
            data-selected="${V}"
            aria-pressed="${V}"
            ${R||_?'aria-disabled="true"':""}
          >
            ${le?'<span class="yule-card-twinkle" aria-hidden="true">❄</span>':""}
            ${D}
            <div class="catalog-card-title">${A(x.name)}</div>
            <div class="catalog-card-sub ${_?"is-short":""}">${oe}</div>
          </button>
        `}).join(""),C.querySelectorAll("[data-item-id]").forEach(x=>{x.addEventListener("click",()=>{const M=ne(x.dataset.itemId);if(!M)return;const R=e.sim.getEffectiveItemStarCost(M),V=e.sim.state.match3?.stars??0,P=Ii(e.sim,M)>0;if(!P&&!e.sim.isCatalogItemUnlocked(M)){const D=e.sim.getWinsProgressForCurrentLevel();let Y=Math.max(1,D.required-D.current);for(let ie=e.sim.state.level+1;ie<M.unlockLevel;ie++)Y+=da(ie);const Z=R>0?` hoặc tích đủ ${R} 🌟 Sao (hiện ${V}/${R} 🌟)`:"";Ze(e,`🔒 Bản vẽ "${M.name}" mở ở Cấp ${M.unlockLevel}${Z} — Cần thêm ${Y.toLocaleString("vi-VN")} màn Giải Đố ở nút ▶️ góc phải!`,"🔒");return}if(!P&&!e.sim.state.sandboxMode&&R>0&&V<R){const D=!M.connectableGroup&&M.category!=="decor"?e.sim.state.buildings.find(Z=>Z.itemId===M.id):void 0;if(D){ye(e),e.inspectSelection={kind:"building",uid:D.uid},we(e.cam,D.gx+M.width*.5,D.gy+M.height*.5),e.onCameraJump?.(),pt(e),Xt(e),Ze(e,`📍 Đã chọn "${M.name}" đang có trên bản đồ — Bấm "✋ Dời" ở bảng chi tiết để đổi vị trí (hoặc tích đủ ${R} 🌟 nếu muốn xây thêm)!`,"✋");return}const Y=R-V;Ze(e,`🌟 Thiếu ${Y} Sao Phép Thuật (hiện có ${V}/${R} 🌟) để dựng "${M.name}" — Bấm nút ▶️ góc phải để kiếm thêm Sao nhé!`,"🌟");return}if(!P&&!e.sim.state.sandboxMode&&R===0&&e.sim.state.galleons<M.cost){const D=M.cost-e.sim.state.galleons;Ze(e,`🪙 Thiếu ${D.toLocaleString("vi-VN")}G (hiện có ${e.sim.state.galleons.toLocaleString("vi-VN")}/${M.cost.toLocaleString("vi-VN")}G) để dựng "${M.name}"!`,"🪙");return}ye(e),e.selectedCatalogItem=M,e.inspectSelection=null,pt(e),Xt(e),e.onSelectCatalogItem?.(M);const W=us(M);Ze(e,W?`🏗️ Đã chọn "${M.name}" — Chạm hoặc kéo liên tục trên bản đồ để đặt!`:`🏗️ Đã chọn "${M.name}" — Chạm một lần vào ô xanh để đặt ngay (hoặc bấm ⚡ Đặt Ngay)!`,"🔨")})}),Xi(e,C)}function Qo(e,t){const n=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],o=new Set(e.sim.state.unlockedZones),s=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+ri.filter(i=>e.sim.state.sandboxMode||o.has(i.id)).map(i=>`<option value="${i.id}" ${l===i.id?"selected":""}>📍 ${i.name}</option>`).join(""),a=n.map(l=>{const i=e.sim.state.staffHired[l.key],p=i>=on,c=l.baseCost*(1+i);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${i}/${on}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${p?"":"gold-cta"}"
              ${p?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${p?`✓ ${on}/${on}`:`+ 🪙 ${c}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(l=>{const i=e.sim.state.staffPatrolZones?.[l.id]??l.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${A(l.name)}</div>
            <select data-patrol-staff="${A(l.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${s(i)}
            </select>
            <button type="button" data-pick-staff="${A(l.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=a+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const i=l.dataset.hire;e.sim.hireStaff(i)&&(pt(e),Xt(e),Ze(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const i=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(i,l.value),Ze(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const i=e.sim.staff.find(p=>p.id===l.dataset.pickStaff);i&&(ye(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},pt(e),Xt(e),Ze(e,`Đang gắp ${i.name} — Chạm vào ô bất kỳ trên bản đồ để thả xuống!`,"🤏"))})})}const Xo={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏠 Nhà & Xưởng Chế Biến",creature:"🌾 Sản Xuất, Đồng Cỏ & Thú",decor:"🌳 Vườn Hoa & Trang Trí",staff:"🧙 Phụ Tá Điền Trang"};function Xi(e,t){const n=e.root.querySelector("#buildDrawerSwipeBar"),o=e.root.querySelector("#buildDrawerCatLabel"),s=e.root.querySelector("#btnDrawerScrollPrev"),a=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const l=Array.from(t.querySelectorAll(".catalog-card"));if(!n||l.length===0||!e.activeCategory){n?.classList.add("hidden");return}if(o){const C=e.activeCategory==="decor"&&e.christmasTabActive?"🎄 Giáng Sinh & Mùa Đông":Xo[e.activeCategory]??"🏗️ Danh Mục Xây Dựng",u=e.sim.state.sandboxMode?"∞":String(e.sim.state.match3?.stars??0),m=e.sim.state.sandboxMode?"∞":`${e.sim.state.galleons.toLocaleString("vi-VN")}G`;o.textContent=`${C} (${l.length}) • 🌟 ${u} • 🪙 ${m}`}n.classList.remove("hidden");const i=t.querySelector('.catalog-card[data-selected="true"]');i&&typeof i.scrollIntoView=="function"&&i.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const p=l[0],c=l[l.length-1];let d=!0,g=l.length<=2;const y=()=>{const C=!d||!g||t.scrollWidth>t.clientWidth+6;s&&(s.disabled=d,s.classList.toggle("hidden",!C)),a&&(a.disabled=g,a.classList.toggle("hidden",!C)),r&&r.classList.toggle("hidden",!C),t.dataset.scrollStart=String(!d),t.dataset.scrollEnd=String(!g)};if(typeof IntersectionObserver<"u"){const C=new IntersectionObserver(u=>{for(const m of u)m.target===p&&(d=m.intersectionRatio>=1),m.target===c&&(g=m.intersectionRatio>=1);y()},{root:t,threshold:1,rootMargin:"2px"});C.observe(p),c!==p&&C.observe(c),e.drawerEdgeObserver=C}y()}function Yo(e){const t=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,n=e.root.querySelector("#secondaryMapToolsBar");n&&n.classList.toggle("hidden",!t)}function he(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const n=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(n!==e.lastInspectedKey&&(e.lastInspectedKey=n,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const o=e.inspectSelection.uid,s=e.sim.state.buildings.find(P=>P.uid===o);if(!s){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=ne(s.itemId),r=Date.now(),l=r<s.constructEndsAt,i=Math.max(0,Math.ceil((s.constructEndsAt-r)/1e3)),p=e.sim.getBuildingProductionPerCycle(s,a),c=La(a,s.stars),d=(e.sim.rideQueues.get(s.uid)??[]).length,g=e.sim.isBuildingConnected(s.uid),y=e.sim.activeSynergies.buildingGoldMult.get(s.uid)??1,C=e.sim.activeSynergies.buildingXpMult.get(s.uid)??1,u=a.category==="ride"&&!a.isCoasterTrackPiece,m=!!a.isCustomCoasterStation&&!l,T={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},L=a.isCreatureHabitat?e.sim.biomeCache.get(s.uid):void 0,$=a.isBackstage?e.sim.backstageCache.get(s.uid):void 0,k=!!a.ticketPrice&&!l&&!a.workshopGroupId,f=Ea(a),h=e.sim.getEffectivePrice(s,a),S=e.sim.getPriceValueVerdict(s,a),E=a.isFarmlandPlot&&!l?(()=>{if(!s.cropId){const B=Object.values(ke).sort((ge,$e)=>ge.unlockLevel-$e.unlockLevel||ge.growSec-$e.growSec),j=B.filter(ge=>ge.isFlowerCrop).length,oe=B.length-j,le=B.filter(ge=>e.seedFilterMode==="flowers"?!!ge.isFlowerCrop:e.seedFilterMode==="crops"?!ge.isFlowerCrop:!0),re=[{id:"all",label:`🌱 (${B.length})`},{id:"flowers",label:`🌸 (${j})`},{id:"crops",label:`🌾 (${oe})`}].map(ge=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===ge.id?"active":""}"
                        data-insp-seed-filter="${ge.id}"
                        aria-pressed="${e.seedFilterMode===ge.id}"
                      >${ge.label}</button>
                    `).join(""),be=le.map(ge=>{const $e=!e.sim.state.sandboxMode&&e.sim.state.level<ge.unlockLevel,Me=e.sim.getSeedCount(ge.id),J=e.sim.getFarmItemCount(ge.id),xe=Ae(ge.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${$e?"locked":""} ${!$e&&Me<=0?"out-of-seeds":""}"
                        data-plant-crop="${ge.id}"
                        ${$e?"disabled":""}
                      >
                        <img src="${Wt(ge.id)}" alt="${A(ge.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${A(ge.name)}</span>
                        <span class="seed-card-seed-badge ${Me>0?"has-seed":"no-seed"}">
                          ${$e?`🔒 Lv.${ge.unlockLevel}`:Me>0?`🌱 ×${Me}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${$e?`⏱️ ${xe}`:`⏱️ ${xe} • 🪙${ge.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${J}</span>
                      </button>
                    `}).join(""),de=e.sim.state.plotSoilState?.[`${s.gx},${s.gy}`],fe={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${de?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${fe[de.lastFamily]??de.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${re}</div>
                    <div class="seed-picker-grid">${be}</div>
                  </div>
                `}const P=ke[s.cropId],W=s.cropReadyAt??r,D=s.cropPlantedAt??W-P.growSec*1e3,Y=Math.max(0,Math.ceil((W-r)/1e3)),Z=Y<=0,ie=e.sim.state.cropMastery?.[P.id]??0,N=ma(ie),q=Math.max(0,e.sim.state.morningDewPhials??0),_=P.yieldQty*(s.cropRotatedBonus?2:1),ee=Z?100:Math.max(6,Math.min(98,Math.round((r-D)/Math.max(1e3,W-D)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${Wt(P.id)}" alt="${A(P.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${A(P.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${N.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${Z?"🌾 Chín!":`⏱️ ${Fe(Y)}`}${s.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${ie} vụ • Họ ${pa(P.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${ee}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${Z?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${_})
                          </button>
                        `:s.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!Z&&(q>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${q})
                          </button>`:""}
                  </div>
                </div>
              `})():"",x=a.workshopGroupId&&!l?(()=>{const P=e.sim.getWorkshopRecipesForBuilding(a),W=s.workshopQueue??[],D=s.readyFarmGoods??[],Y=3+Math.min(2,Math.max(0,s.stars-1)),Z=D.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${D.slice(0,5).map(B=>{const j=Mt[B];return`<img src="/trang-trai-hang-soc/sprites/${j.iconKey}.png" alt="${A(j.name)}" title="${A(j.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${D.length})
                      </button>
                    </div>
                  `:"",ie=P.map(B=>{const j=Mt[B.goodId],oe=B.name??j.name,le=B.name&&B.name!==j.name?`title="Ra lò thành phẩm: ${A(j.name)}"`:"",re=!e.sim.state.sandboxMode&&e.sim.state.level<B.unlockLevel,be=!re&&(e.sim.state.sandboxMode||B.inputs.every(fe=>e.sim.getFarmItemCount(fe.itemId)>=fe.qty)),de=B.inputs.map(fe=>{const et=Je(fe.itemId),ge=e.sim.getFarmItemCount(fe.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||ge>=fe.qty?"ok":"lack"}">${A(et.name)} ${e.sim.state.sandboxMode?"∞":ge}/${fe.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${be?"craftable":""} ${re?"locked":""}"
                      data-ws-enqueue="${B.id}"
                      ${le}
                      ${re?"disabled":""}
                    >
                      <div class="ws-recipe-name">${A(oe)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${j.iconKey}.png" alt="${A(oe)}" class="ws-recipe-img" />
                        ${be?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${re?`🔒 Lv.${B.unlockLevel}`:de}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${Ae(B.craftSec)}</div>
                    </button>
                  `}).join(""),N=W[0],q=N?Math.max(0,Math.ceil((N.endsAt-r)/1e3)):0,_=N?Mt[N.goodId]:null,ee=Array.from({length:Math.max(1,Y-1)},(B,j)=>{const oe=W[j+1];if(oe){const le=Mt[oe.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${A(le.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${le.iconKey}.png" alt="${A(le.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return j===W.length-(N?1:0)?`
                    <div class="ws-slot-plus" title="Thêm vào khay">
                      <span>+</span>
                    </div>
                  `:`
                  <div class="ws-slot-card empty" title="Trống">
                    <span style="font-size:11px;font-weight:800;opacity:0.65;">Trống</span>
                  </div>
                `}).join("");return`
                <div class="ws-inspector-board">
                  <div class="ws-board-header">
                    <span>🔥 ${A(a.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${Z}
                  <div class="ws-recipe-grid">${ie}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${N?"baking":""}">
                      <div class="ws-oven-arch">
                        ${_?`<img src="/trang-trai-hang-soc/sprites/${_.iconKey}.png" alt="${A(_.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${N?`<strong>${Fe(q)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${N?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${ee}</div>
                  </div>
                </div>
              `})():"",M=a.isAnimalPasturePlot&&!l?(()=>{if(!s.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(St).map(_=>{const ee=!e.sim.state.sandboxMode&&e.sim.state.level<_.unlockLevel,B=_.goodId?Je(_.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${ee?"locked":""}"
                        data-stock-animal="${_.id}"
                        ${ee?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${_.spritePair[0]}.png" alt="${A(_.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${A(_.name)}</span>
                        <span class="seed-card-seed-badge ${ee?"no-seed":"has-seed"}">
                          ${ee?`🔒 Lv.${_.unlockLevel}`:`🪙 ${_.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${Ae(_.cycleSec)} • +${_.sellValue}G</span>
                        <span class="seed-card-stock">${B?`+${_.yieldQty} ${A(B.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const P=St[s.pastureAnimalId],W=s.pastureReadyAt??r,D=s.pastureStockedAt??W-P.cycleSec*1e3,Y=Math.max(0,Math.ceil((W-r)/1e3)),Z=Y<=0,ie=Z?100:Math.max(6,Math.min(98,Math.round((r-D)/Math.max(1e3,W-D)*100))),N=P.goodId?Je(P.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${P.spritePair[0]}.png" alt="${A(P.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${A(P.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${Z?`🧺 +${P.sellValue}G${N?` +${P.yieldQty} ${A(N.name)}`:""}`:`⏱️ ${Fe(Y)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${ie}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${Z?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${P.sellValue}G)
                          </button>
                        `:s.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!Z&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((a.workshopGroupId||a.isFarmlandPlot||a.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility();const R=Ss(a);t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${R?`<img src="${R}" alt="${A(a.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${A(a.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(s.stars)}${"☆".repeat(5-s.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${a.isFarmlandPlot?"🌱 Ruộng":a.isAnimalPasturePlot?"🐾 Đồng cỏ":a.connectableGroup==="flower_garden"?"🌸 Vườn hoa":a.workshopGroupId?"🔥 Xưởng":`👥 ${s.visitorsServed}`}${u?` • 🎟️ ${d}/${Pa}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${E}
        ${M}
        ${x}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${g?"#15803d":"#dc2626"};">
            ${g?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${y>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((y-1)*100)}%G • +${Math.round((C-1)*100)}%XP</div>`:""}
          ${a.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${jt[a.producesIngredient].emoji} ${jt[a.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const P=Math.max(0,s.buildReducedSec??0),W=Math.max(1e3,a.buildDurationSec*1e3,s.constructEndsAt-(s.placedAt||r-1e3)+P*1e3),D=Math.max(1,Math.min(99,Math.floor((1-(s.constructEndsAt-r)/W)*100))),Y=e.sim.getBuildingMinFloorSec(s),Z=Math.max(0,i-Y),ie=Z<=0&&e.sim.getActiveConstructions(r).some(_=>_.uid!==s.uid&&Math.ceil((_.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(_)),N=Z>0||ie,q=a.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${a.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${D}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${D}" aria-label="${q}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${Fe(i)}</strong>${P>0?` • <span style="color:var(--teal-deep);">-${Ae(P)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1 1 132px;" ${N?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1 1 132px;" ${N?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${Z>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1 1 160px;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
                              🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                            </button>`:""}
                      ${e.sim.state.sandboxMode?`<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1 1 120px;" title="Hoàn tất ngay">
                              ⚡ Xong ngay
                            </button>`:""}
                    </div>
                  </div>
                `})():s.awaitingUnveil?`
                <div class="quest-card-mini feast-unveil-insp-card">
                  <div class="feast-unveil-insp-title">🎀 Hoàn thiện!</div>
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:7px;">
                    🎀 Cắt Băng
                  </button>
                </div>
              `:a.baseIncome>0?(()=>{const P=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,W=ua(s,a),D=Math.max(1,W*P),Y=Math.max(0,(r-(s.lastTickAt||r))/1e3),Z=Math.max(1,Math.ceil(D-Y%D));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${p.galleons}🪙 +${p.xp}⭐</strong> / ${Ae(W)}</div>
                      ${a.cycleSec>0&&!a.isFarmlandPlot&&!a.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${Fe(Z)}</strong> • Kho: <strong>${s.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${s.storedGalleons}🪙</strong></div>`}
                      ${s.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${s.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${u&&!l&&!a.isFlooPortal?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>⚙️ Độ bền:</span>
                  <span style="color:${s.isBrokenDown?"#dc2626":s.durability<50?"#b45309":"#15803d"};">${Math.round(s.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(s.durability)}" aria-label="Độ bền"></progress>
                ${s.isBrokenDown||s.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${s.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">
                        🪄 Sửa (0G)
                      </button>`:""}
              </div>
            `:""}

        ${k?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${f.min}–${f.max}G):</span>
                  <span id="lblBuildingPriceVal">${h}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${f.min}" max="${f.max}" value="${h}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${S.color};">
                  ${S.label}
                </div>
              </div>
            `:""}

        ${a.isCustomCoasterStation&&s.coasterStats&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${s.coasterStats.lengthMeters}m • 🔥 ${s.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `:""}

        ${m?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🎥 Ride Cam
              </button>
            `:""}

        ${(a.isWorkshopBrewery||a.producesIngredient||a.isFireworksLauncher)&&!l?`
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">
                  🧪 Xưởng
                </button>
                ${a.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">🎆 Pháo Hoa</button>':""}
              </div>
            `:""}

        ${a.isCreatureHabitat&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>🐾 ${A(s.creatureNickname||a.creatureName||a.name)}</strong>
                  <span class="morph-pill ${s.creatureMorph==="radiant"?"radiant":s.creatureMorph==="mystic"?"mystic":""}">
                    ${Ke[s.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${s.creatureBondLevel??1}/${Ft} • ${T[s.creatureStage??"baby"]} • 🌿 ${L?.score??50}% • 🥩 ${Math.round(s.creatureHunger??90)}%</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">
                    🥩 Cho ăn
                  </button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1.3;">
                    🧳 Vali
                  </button>
                </div>
              </div>
            `:""}

        ${a.isBackstage&&$&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${$.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${$.shieldCount}/${$.needed} ${$.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        ${a.id==="burrow_honeydukes_canon"&&!l?`
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🍬 Vào Gác Xép Bùa Gặt Honeydukes
              </button>
            `:""}

        ${(a.id==="burrow_owl_post"||a.id==="eeylops_owl_emporium")&&!l?`
              <button id="btnInspOpenOwlOrders" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🦉 Mở Bảng Đơn Hàng Cú
              </button>
            `:""}

        ${a.id==="burrow_feast_marquee"&&!l?`
              <button id="btnInspOpenFeastMarquee" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🎪 Mở Đại Tiệc Mùa Gặt
              </button>
            `:""}

        ${a.id==="floo_fireplace_gate"&&!l?`
              <button id="btnInspOpenNeighbors" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🔥 Mở Sổ Hàng Xóm &amp; Cổng Floo
              </button>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&s.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1 1 100%;">
                  ⬆️ ${s.stars+1}★ (🌟${ga(s.stars)} + 🪙${c.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:var(--green-deep);">🌟 5★ Tối Đa</div>'}
        </div>
        ${!s.isIndestructible&&!e.sim.isVisitingNeighbor?`
              <div class="inspector-build-actions" role="group" aria-label="Thao tác công trình">
                <button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình miễn phí (0G)">✋ Dời</button>
                <button id="btnRotateThis" type="button" class="brass-btn" title="Xoay hướng công trình 90°">🔄 Xoay</button>
                <button id="btnDeleteThis" type="button" class="brass-btn inspector-delete-btn" title="Xóa công trình">🧹 Xóa</button>
              </div>
            `:""}
      `;const V=t.querySelector("#inpBuildingPrice");V&&(e.wireRangeProgressFallback(V),V.addEventListener("input",()=>{const P=Number(V.value);e.sim.setBuildingCustomPrice(s.uid,P);const W=e.sim.getEffectivePrice(s,a),D=t.querySelector("#lblBuildingPriceVal");D&&(D.textContent=`${W} Galleon`);const Y=e.sim.getPriceValueVerdict(s,a),Z=t.querySelector("#lblPriceVerdict");Z&&(Z.textContent=Y.label,Z.style.color=Y.color);const ie=e.sim.getBuildingProductionPerCycle(s,a),N=t.querySelector("#lblBuildingProdVal");N&&(N.textContent=`+${ie.galleons} 🪙 & +${ie.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(s.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=s.uid,e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=s.uid,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(s.uid,!0),he(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(P=>{P.addEventListener("click",()=>{const W=e.sim.useMorningDewPhial(s.uid);e.showToast(W.msg,W.ok?"🧪":"⏳"),he(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),he(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const P=s.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",P)}),t.querySelectorAll("[data-plant-crop]").forEach(P=>{P.addEventListener("click",()=>{const W=P.dataset.plantCrop,D=e.sim.plantCropOnPlot(s.uid,W);if(D.needSeedAcquire){const Y=s.uid;e.activeSeedCropId=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(W,Y);return}if(e.showToast(D.msg,D.ok?"🌱":"🪙"),D.ok){e.activeSeedCropId=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}he(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(P=>{P.addEventListener("click",()=>{const W=P.dataset.inspSeedFilter;(W==="all"||W==="flowers"||W==="crops")&&(e.seedFilterMode=W,he(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(P=>{P.addEventListener("click",()=>{const W=P.dataset.stockAnimal,D=e.sim.stockAnimalOnPasture(s.uid,W);if(e.showToast(D.msg,D.ok?St[W]?.emoji??"🐾":"🪙"),D.ok){e.activePastureAnimalId=null,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}he(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const P=e.sim.feedAnimalPasture(s.uid);e.showToast(P.msg,P.ok?"🌾":"⏳"),he(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const P=e.sim.harvestAnimalPasture(s.uid);e.showToast(P.msg,P.ok?"🧺":"⏳"),he(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const P=e.sim.clearAnimalFromPasture(s.uid);e.showToast(P.msg,P.ok?"🐾":"⚠️"),he(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const P=e.sim.waterCropPlot(s.uid);e.showToast(P.msg,P.ok?"💧":"⏳"),he(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const P=e.sim.harvestCropPlot(s.uid);e.showToast(P.msg,P.ok?"🌾":"🏡"),he(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),he(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(P=>{P.addEventListener("click",()=>{const W=P.dataset.wsEnqueue,D=e.sim.enqueueWorkshopRecipe(s.uid,W);e.showToast(D.msg,D.ok?"🔥":"🧺"),he(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(s.uid),he(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(s.uid),he(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(s.uid),he(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=s.uid,e.inspectSelection=null,he(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${a.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(s.uid),he(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",s.uid)}),t.querySelector("#btnInspOpenHoneydukesMatch3")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openMatch3Dialog()}),t.querySelector("#btnInspOpenOwlOrders")?.addEventListener("click",()=>{e.inspectSelection=null,e.activeQuestTab="orders",e.refreshAll(),e.renderQuestDialog(),e.root.querySelector("#questDialog")?.showModal()}),t.querySelector("#btnInspOpenFeastMarquee")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openHarvestFeastDialog()}),t.querySelector("#btnInspOpenNeighbors")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openNeighborDialog("friends")}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const P=e.sim.upgradeBuildingStar(s.uid);e.showToast(P.msg,P.ok?"🌟":"🪙"),he(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{ye(e),e.moveModeActive=!0,e.movingBuildingUid=s.uid,e.rotation=s.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.onStartMoveBuilding?.(s.uid),e.refreshAll(),e.showToast(`✋ Đang nhấc "${a.name}" — chạm ô đất mới trên bản đồ để đặt xuống!`,"✋")}),t.querySelector("#btnRotateThis")?.addEventListener("click",()=>{const P=e.sim.rotatePlacedBuilding(s.uid);if(!P.ok){e.showToast(P.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}e.rotation=P.newRotation??s.rotation,he(e),e.refreshHeader(),e.refreshDock(),e.showToast(`🔄 Đã xoay "${a.name}" (${(P.newRotation??0)*90}°)`,"🔄")}),t.querySelector("#btnDeleteThis")?.addEventListener("click",()=>{e.sim.beginBuildStroke();let P=!1;try{P=e.sim.removeAtTile(s.gx,s.gy,!1)}finally{e.sim.commitBuildStroke()}P&&(e.inspectSelection=null,e.refreshAll(),e.showToast(`🧹 Đã xóa "${a.name}" (có thể bấm ↶ Hoàn tác trong Xây Dựng nếu nhầm).`,"🧹"))});return}if(e.inspectSelection.kind==="staff"){const o=e.inspectSelection.id,s=e.sim.staff.find(l=>l.id===o);if(!s){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=e.sim.state.staffPatrolZones?.[s.id]??s.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${A(s.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${A(s.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${a==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${ri.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${a===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const i=l.currentTarget.value;e.sim.setStaffPatrolZone(s.id,i),e.showToast(`Đã phân công khu tuần tra cho ${s.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{ye(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const o=rs(e.inspectSelection.zoneId),s=ls(o),a=e.sim.state.level>=o.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${A(o.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>
        <div style="font-size:12.5px;margin-bottom:10px;font-weight:700;">
          🔒 Lv.${o.unlockLevel} • <strong>🌟 ${s}</strong>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${a?"gold-cta":""}" style="width:100%;">
          🔓 Mở (🌟 ${s})
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(o.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,he(e))})}}function gi(e,t){t&&(e.activeWorkshopTab=t),Oe(e);const n=e.root.querySelector("#workshopDialog");n.open||n.showModal()}function Es(e,t,n){e.collapseBuildDock(),Et(e),ye(e),e.inspectSelection=null,e.pendingSowPlotUid=n??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function yt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function Ko(e){e.seedTrayOpen?(yt(e),e.refreshAll()):Es(e,e.activeSeedCropId??void 0)}function Ps(e,t,n){e.collapseBuildDock(),yt(e),ye(e),e.inspectSelection=null,e.pendingStockPastureUid=n??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Et(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function Zo(e){e.pastureTrayOpen?(Et(e),e.refreshAll()):Ps(e,e.activePastureAnimalId??void 0)}function qs(e){const t=e.root.querySelector("#seedBrushTray"),n=e.root.querySelector("#btnOpenSeedSilo");if(n){const f=e.seedTrayOpen||!!e.activeSeedCropId;n.dataset.active=String(f),n.setAttribute("aria-pressed",String(f))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(f=>ne(f.itemId)?.isFarmlandPlot&&!f.cropId&&Date.now()>=f.constructEndsAt).length,s=e.sim.state.buildings.filter(f=>ne(f.itemId)?.isFarmlandPlot).length,a=e.activeSeedCropId?ke[e.activeSeedCropId]:null,r=Object.values(ke).sort((f,h)=>f.unlockLevel-h.unlockLevel||f.growSec-h.growSec),l=r.filter(f=>f.isFlowerCrop).length,i=r.length-l,p=r.filter(f=>e.seedFilterMode==="flowers"?!!f.isFlowerCrop:e.seedFilterMode==="crops"?!f.isFlowerCrop:!0),c=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${i})`}].map(f=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===f.id?"active":""}"
            data-seed-filter="${f.id}"
            aria-pressed="${e.seedFilterMode===f.id}"
          >${f.label}</button>
        `).join(""),d=p.map(f=>{const h=!e.sim.state.sandboxMode&&e.sim.state.level<f.unlockLevel,S=e.activeSeedCropId===f.id,E=e.sim.getSeedCount(f.id),x=e.sim.getFarmItemCount(f.id),M=Ae(f.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${h?"locked":""} ${S?"selected":""} ${!h&&E<=0?"out-of-seeds":""}"
              data-seed-brush="${f.id}"
              aria-pressed="${S}"
              ${h?"disabled":""}
            >
              <img src="${Wt(f.id)}" alt="${A(f.name)}" class="seed-card-img" />
              <span class="seed-card-name">${A(f.name)}</span>
              <span class="seed-card-seed-badge ${E>0?"has-seed":"no-seed"}">
                ${h?`🔒 Cấp ${f.unlockLevel}`:E>0?`🌱 ${E}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${h?`⏱️ ${M}`:`⏱️ ${M} • 🪙${f.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${x}</span>
            </button>
            ${h?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${f.id}" aria-label="Nạp hạt ${A(f.name)}" title="Mua hạt ${A(f.name)} (${f.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-row">
          <div class="seed-tray-title-wrap">
            <div class="seed-tray-title">
              ${a?`🌱 <strong>${A(a.name)}</strong> (${e.sim.getSeedCount(a.id)})`:"🌱 Hạt Giống & Hoa"}
            </div>
            <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
              <span>Ô trống: <strong>${o}/${s}</strong></span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${c}</div>
            </div>
          </div>
          <button id="btnCloseSeedTray" type="button" class="brass-btn seed-tray-close" aria-label="Đóng túi hạt giống">✕</button>
        </div>
        <div class="seed-tray-actions">
          ${e.pendingSowPlotUid&&e.sim.state.buildings.some(f=>f.uid===e.pendingSowPlotUid&&!f.isIndestructible)?'<button id="btnSeedTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời thửa đất này">✋ Dời ô</button>':""}
          <button id="btnSeedTrayPlantAll" type="button" class="brass-btn" title="Gieo hạt giống đã chọn vào tất cả ô đất trống">
            🌱 Gieo tất cả
          </button>
          <button id="btnSeedTrayWaterAll" type="button" class="brass-btn" title="Tưới tất cả luống đang lớn chưa được tưới">
            💧 Tưới tất cả
          </button>
          <button id="btnSeedTrayHarvestAll" type="button" class="brass-btn gold-cta" title="Gặt tất cả luống đã chín vàng">
            🌾 Gặt tất cả
          </button>
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Mua Hạt hoặc Đố Ngoại Ngữ 0G">
            🪄 Hạt 0G
          </button>
          <button id="btnSeedTrayBuyPlot" type="button" class="brass-btn gold-cta" title="Đặt thêm Thửa Đất (30G)">
            + Đất 30G
          </button>
          <button id="btnSeedTrayBuyFlowerGarden" type="button" class="brass-btn" title="Đặt Ô Vườn Hoa (55G)">
            🌸 + Vườn 55G
          </button>
          <button id="btnSeedTrayOpenBarn" type="button" class="brass-btn" title="Mở Kho">
            📦 Kho
          </button>
        </div>
      </div>
      <div class="seed-tray-scroll">${d}</div>
    `;const g=Date.now(),y=e.sim.state.buildings.filter(f=>ne(f.itemId)?.isFarmlandPlot),C=y.map(f=>f.uid),u=y.filter(f=>f.cropId&&f.cropReadyAt&&g>=f.cropReadyAt),m=y.filter(f=>f.cropId&&f.cropReadyAt&&g<f.cropReadyAt&&!f.cropWateredBoost),T=y.filter(f=>!f.cropId&&Date.now()>=f.constructEndsAt),L=t.querySelector("#btnSeedTrayPlantAll"),$=t.querySelector("#btnSeedTrayWaterAll"),k=t.querySelector("#btnSeedTrayHarvestAll");if(L){const f=T.length;L.disabled=f===0,L.textContent=`🌱 Gieo tất cả${f?` (${f})`:""}`,L.addEventListener("click",()=>{const h=e.activeSeedCropId;if(!h){e.showToast("🌱 Chọn một hạt giống trước để Gieo Tất Cả!","🪄");return}const S=e.sim.batchPlantCropPlots(T.map(E=>E.uid),h);e.showToast(S.msg,S.ok?"🌱":"🪄"),e.activeSeedCropId=null,e.refreshAll()})}if($){const f=m.length;$.disabled=f===0,$.textContent=`💧 Tưới tất cả${f?` (${f})`:""}`,$.addEventListener("click",()=>{const h=e.sim.batchWaterCropPlots(C);e.showToast(h.msg,h.ok?"💧":"🌱"),e.refreshAll()})}if(k){const f=u.length;k.disabled=f===0,k.textContent=`🌾 Gặt tất cả${f?` (${f})`:""}`,k.addEventListener("click",()=>{const h=e.sim.batchHarvestCropPlots(C);e.showToast(h.msg,h.ok?"🌾":"🌱"),e.refreshAll()})}t.querySelectorAll("[data-seed-filter]").forEach(f=>{f.addEventListener("click",h=>{h.stopPropagation();const S=f.dataset.seedFilter;(S==="all"||S==="flowers"||S==="crops")&&(e.seedFilterMode=S,qs(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(f=>{f.addEventListener("click",h=>{h.stopPropagation();const S=f.dataset.acquireSeed,E=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(S,E)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const f=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),h=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(h,f)}),t.querySelectorAll("[data-seed-brush]").forEach(f=>{f.addEventListener("click",()=>{const h=f.dataset.seedBrush,S=ke[h],E=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(!e.sim.state.sandboxMode&&e.sim.getSeedCount(h)<=0){e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(h,E);return}if(e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,E){const x=e.sim.state.buildings.find(M=>M.uid===E);if(x&&ne(x.itemId)?.isFarmlandPlot&&!x.cropId){const M=e.sim.plantCropOnPlot(x.uid,h);if(e.activeSeedCropId=null,M.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(h,x.uid);return}e.showToast(M.msg,M.ok?"🌱":"🪙"),e.refreshAll();return}}e.activeSeedCropId=h,e.refreshAll(),e.showToast(`🌱 Đã chọn ${S.emoji} ${S.name} (Túi có ${e.sim.getSeedCount(h)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,S.emoji)})}),t.querySelector("#btnSeedTrayMovePlot")?.addEventListener("click",()=>{const f=e.pendingSowPlotUid,h=f?e.sim.state.buildings.find(E=>E.uid===f):void 0;if(!h||h.isIndestructible)return;const S=ne(h.itemId);yt(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=h.uid,e.rotation=h.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${S?.name??"Thửa đất"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const f=ne("farmland_plot");f&&(yt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=f,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const f=ne("burrow_flower_garden");f&&(yt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=f,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),gi(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{yt(e),e.refreshAll()})}function Jo(e){const t=e.root.querySelector("#pastureBrushTray"),n=e.root.querySelector("#btnOpenPastureTray");if(n){const y=e.pastureTrayOpen||!!e.activePastureAnimalId;n.dataset.active=String(y),n.setAttribute("aria-pressed",String(y))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(y=>ne(y.itemId)?.isAnimalPasturePlot&&!y.pastureAnimalId&&Date.now()>=y.constructEndsAt).length,s=e.sim.state.buildings.filter(y=>ne(y.itemId)?.isAnimalPasturePlot).length,a=e.activePastureAnimalId?St[e.activePastureAnimalId]:null,r=Object.values(St).map(y=>{const C=!e.sim.state.sandboxMode&&e.sim.state.level<y.unlockLevel,u=e.activePastureAnimalId===y.id,m=y.goodId?Je(y.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${C?"locked":""} ${u?"selected":""}"
              data-pasture-brush="${y.id}"
              aria-pressed="${u}"
              ${C?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${y.spritePair[0]}.png" alt="${A(y.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${A(y.name)}</span>
              <span class="seed-card-seed-badge ${C?"no-seed":"has-seed"}">
                ${C?`🔒 Cấp ${y.unlockLevel}`:`🪙 ${y.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${Ae(y.cycleSec)} • +${y.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${m?`+${y.yieldQty} ${A(m.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-row">
          <div class="seed-tray-title-wrap">
            <div class="seed-tray-title">
              ${a?`🐾 <strong>${A(a.name)}</strong> (${a.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
            </div>
            <div class="seed-tray-sub">
              Ô trống: <strong>${o}/${s}</strong>
            </div>
          </div>
          <button id="btnClosePastureTray" type="button" class="brass-btn seed-tray-close" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
        <div class="seed-tray-actions">
          ${e.pendingStockPastureUid&&e.sim.state.buildings.some(y=>y.uid===e.pendingStockPastureUid&&!y.isIndestructible)?'<button id="btnPastureTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời ô đồng cỏ này">✋ Dời ô</button>':""}
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn gold-cta" title="Đặt thêm Đồng Cỏ (45G)">
            🐾 + Đồng Cỏ 45G
          </button>
          <button id="btnPastureFeedAll" type="button" class="brass-btn" title="Cho tất cả đàn thú đang lớn ăn">
            🌾 Cho ăn tất cả
          </button>
          <button id="btnPastureCollectAll" type="button" class="brass-btn gold-cta" title="Thu hoạch tất cả sản vật đã sẵn sàng">
            🧺 Thu hoạch tất cả
          </button>
          <button id="btnPastureTrayOpenBarn" type="button" class="brass-btn" title="Mở Kho">
            📦 Kho
          </button>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${r}</div>
    `;const l=e.sim.state.buildings.filter(y=>ne(y.itemId)?.isAnimalPasturePlot).map(y=>y.uid),i=t.querySelector("#btnPastureFeedAll"),p=t.querySelector("#btnPastureCollectAll"),c=Date.now(),d=e.sim.state.buildings.filter(y=>ne(y.itemId)?.isAnimalPasturePlot&&y.pastureAnimalId&&y.pastureReadyAt&&c<y.pastureReadyAt&&!y.pastureFedBoost).length,g=e.sim.state.buildings.filter(y=>ne(y.itemId)?.isAnimalPasturePlot&&y.pastureAnimalId&&y.pastureReadyAt&&c>=y.pastureReadyAt).length;i&&(i.disabled=d===0,i.textContent=`🌾 Cho ăn tất cả${d?` (${d})`:""}`,i.addEventListener("click",()=>{const y=e.sim.batchFeedAnimalPastures(l);e.showToast(y.msg,y.ok?"🌾":"✨"),e.refreshAll()})),p&&(p.disabled=g===0,p.textContent=`🧺 Thu hoạch tất cả${g?` (${g})`:""}`,p.addEventListener("click",()=>{const y=e.sim.batchHarvestAnimalPastures(l);e.showToast(y.msg,y.ok?"🐾":"✨"),e.refreshAll()})),t.querySelectorAll("[data-pasture-brush]").forEach(y=>{y.addEventListener("click",()=>{const C=y.dataset.pastureBrush,u=St[C];if(!u)return;const m=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,m){const T=e.sim.state.buildings.find(L=>L.uid===m);if(T&&ne(T.itemId)?.isAnimalPasturePlot&&!T.pastureAnimalId){const L=e.sim.stockAnimalOnPasture(T.uid,C);e.activePastureAnimalId=null,e.showToast(L.msg,L.ok?u.emoji:"🪙"),e.refreshAll();return}}e.activePastureAnimalId=C,e.refreshAll(),e.showToast(`🐾 Đang dẫn ${u.emoji} ${u.name} (${u.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,u.emoji)})}),t.querySelector("#btnPastureTrayMovePlot")?.addEventListener("click",()=>{const y=e.pendingStockPastureUid,C=y?e.sim.state.buildings.find(m=>m.uid===y):void 0;if(!C||C.isIndestructible)return;const u=ne(C.itemId);Et(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=C.uid,e.rotation=C.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${u?.name??"Đồng cỏ"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const y=ne("burrow_animal_pasture");y&&(Et(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=y,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),gi(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Et(e),e.refreshAll()})}function er(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();if((n.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){Oe(e);return}if(e.activeWorkshopTab==="brew"){const a=t.querySelector("#btnWsQuickHerb");if(a){const i=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),p=i===0||n.sandboxMode;a.classList.toggle("gold-cta",p),a.textContent=p?"🌿 Hái Thảo Dược":`🌱 (${Ae(i)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&n.supply.activeBrew){const i=dn.find(c=>c.id===n.supply.activeBrew?.goodId),p=Math.max(0,Math.ceil((n.supply.activeBrew.endsAt-o)/1e3));i&&(r.textContent=`🔥 ${i.emoji} ${i.name} (còn ${Fe(p)})`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const i=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),p=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3));if(i<=0&&p<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const c=[];i>0&&c.push(`🍻 +85%G (${Fe(i)})`),p>0&&c.push(`🧪 +35%XP (${Fe(p)})`),l.textContent=`✨ ${c.join(" • ")}`}}}}function Oe(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const s=e.sim.activeSynergies.activeIds.size,a=n.supply.cargoCrates.filter(c=>c.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),i=`
      <div class="workshop-tabs" role="group" aria-label="Kho & Xưởng">
        <button type="button" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-pressed="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          🏡 Kho (${l}/${r.capacity})
        </button>
        <button type="button" data-ws-tab="brew" data-active="${e.activeWorkshopTab==="brew"}" aria-pressed="${e.activeWorkshopTab==="brew"}" class="brass-btn">
          🧪 Vạc Phép
        </button>
        <button type="button" data-ws-tab="cargo" data-active="${e.activeWorkshopTab==="cargo"}" aria-pressed="${e.activeWorkshopTab==="cargo"}" class="brass-btn">
          🚂 Tàu (${a}/3)
        </button>
        <button type="button" data-ws-tab="synergy" data-active="${e.activeWorkshopTab==="synergy"}" aria-pressed="${e.activeWorkshopTab==="synergy"}" class="brass-btn">
          🌟 Combo (${s}/12)
        </button>
      </div>
    `;let p="";if(e.activeWorkshopTab==="barn"){const c=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),d=e.sim.getBarnUpgradeCostInfo(),g=n.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":d.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${d.baseGoldCost})`:`🏡 +20 Ô (🪙${d.effectiveGoldCost} • bù 1🔌)`,y=d.hasPlug?`🔌 ×${d.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${d.plugShortageBuyout}G)`,C=k=>k.map(f=>{const h=Je(f),S=e.sim.getFarmItemCount(f);return`
              <div class="barn-stock-card ${S>0?"in-stock":"empty"}">
                <img src="${h.iconSrc}" alt="${A(h.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${A(h.name)}</div>
                <div class="barn-stock-qty"><strong>×${n.sandboxMode?"∞":S}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${S>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${f}"
                  ${S<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${h.sellValue}G
                </button>
              </div>
            `}).join(""),u=e.sim.getPhoenixTalismanCount(),m=e.sim.getPhoenixTalismanDailyStatus(),T=e.sim.getCraftablePhoenixBarnGood(),L=T?Je(T):null,$=n.sandboxMode||u<Wn&&!!T&&n.galleons>=Bi;p=`
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${l}/${r.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${r.ordersDelivered} • ${y}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${d.canAfford?"":"disabled"}
              style="padding:7px 14px;font-size:12.5px;${d.canAfford?"":"opacity:0.55;cursor:not-allowed;"}"
            >
              ${g}
            </button>
          </div>
          <div class="quest-bar" style="height:10px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${c}%"></div>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <div class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${u}/${Wn}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${m.usedCount}/${m.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${$?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${L?`1 ${A(L.name)}`:"1 Đặc sản"} + ${Bi}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(ke).length})</h3>
        <div class="barn-stock-grid">
          ${C(Object.keys(ke))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(Mt).length})</h3>
        <div class="barn-stock-grid">
          ${C(Object.keys(Mt))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const c=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),d=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),g=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3)),y=n.supply.activeBrew,C=y?dn.find(h=>h.id===y.goodId):void 0,u=y?Math.max(0,Math.ceil((y.endsAt-o)/1e3)):0,m=Math.max(0,n.supply.brewCompletedCount??0),T=m+1,L=n.buildings.some(h=>ne(h.itemId)?.isWorkshopBrewery&&o>=h.constructEndsAt),$=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),k=m===0?"Mẻ #1 (khởi động: 1 giờ)":m===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":m===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${T} (đạt trần tối đa: 6 giờ)`,f=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];p=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${c===0||n.sandboxMode?"gold-cta":""}">
            ${c>0&&!n.sandboxMode?`🌱 (${Ae(c)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${k}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${L?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${$?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${f.map(h=>{const S=jt[h],E=n.supply.ingredients[h]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${S.emoji} ${S.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":E}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${d>0||g>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${d>0?`🍻 +85%G (${Fe(d)}) `:""}${g>0?`• 🧪 +35%XP (${Fe(g)})`:""}
              </div>
            `:""}

        ${y&&C?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${C.emoji} ${A(C.name)} (còn ${Fe(u)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${dn.map(h=>{const S=n.supply.goods[h.id]??0,E=e.sim.getBrewDurationSec(h),x=Ae(E),M=Object.entries(h.inputs).map(([R,V])=>{const P=jt[R],W=n.supply.ingredients[R]??0;return`<span style="color:${n.sandboxMode||W>=(V??0)?"#15803d":"#dc2626"};font-weight:800;">${P.emoji} ${W}/${V}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${h.emoji} ${h.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${n.sandboxMode?"∞":S}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${M}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${h.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${x})
                  </button>
                  <button type="button" data-use-good="${h.id}" class="brass-btn" style="flex:1;">
                    ${h.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const c=Math.round(240+n.level*40),d=Math.round(160+n.level*25);p=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${c.toLocaleString("vi-VN")}🪙 +${d}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((g,y)=>{const C=dn.find(T=>T.id===g.goodId),u=n.supply.goods[g.goodId]??0,m=!g.fulfilled&&(n.sandboxMode||u>=g.qtyRequired);return`
                <div class="crate-card ${g.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${y+1}</span>
                      <span>${g.fulfilled?"✅":`${n.sandboxMode?"∞":u}/${g.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${C.emoji} ${C.name} ×${g.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${g.rewardGalleons}🪙 • +${g.rewardXp}⭐ • +${g.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${g.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':m?`<button type="button" data-fulfill-crate="${g.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else p=`
        <div class="grid-2col">
          ${ha.map(c=>{const d=e.sim.activeSynergies.activeIds.has(c.id),g=c.requiredItems.map(y=>ne(y)?.name??y).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${d?"#d97706":"rgba(138,90,43,0.3)"};background:${d?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${c.emoji} ${A(c.name)}</span>
                  <span style="font-size:12px;font-weight:800;color:${d?"#15803d":"#78350f"};">
                    ${d?"✅":`≤${c.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">🔗 ${g}</div>
                <div style="font-size:12px;font-weight:800;color:#15803d;">
                  +${c.goldBonusPct}%G • +${c.xpBonusPct}%XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=i+p,t.querySelectorAll("[data-ws-tab]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab=c.dataset.wsTab,Oe(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const c=e.sim.upgradeFarmBarn();e.showToast(c.msg,c.ok?"🏡":"🔌"),Oe(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const c=e.sim.craftPhoenixTalismanFromBarn();e.showToast(c.msg,c.ok?"🔥":"🧺"),Oe(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(c=>{c.addEventListener("click",()=>{const d=e.sim.sellFarmItemFromBarn(c.dataset.sellFarmItem,1);d.ok||e.showToast(d.msg,"🧺"),Oe(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const c=e.sim.quickHarvestHerbs();e.showToast(c.msg,c.ok?"🌿":"⏳"),Oe(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&Oe(e)}),t.querySelectorAll("[data-brew-good]").forEach(c=>{c.addEventListener("click",()=>{const d=e.sim.startBrewing(c.dataset.brewGood);e.showToast(d.msg,d.ok?"🧪":"⚠️"),Oe(e)})}),t.querySelectorAll("[data-use-good]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.useGood,g=e.sim.useCraftedGood(d);g.ok?d==="dragon_firework"?e.root.querySelector("#workshopDialog").close():Oe(e):e.showToast(g.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(c=>{c.addEventListener("click",()=>{const d=e.sim.fulfillCargoCrate(c.dataset.fulfillCrate);e.showToast(d.msg,d.ok?"📦":"⚠️"),Oe(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab="brew",Oe(e)})})}const tr="hpvn-burrow-garden",nr=new Set(["auto","dawn","day","dusk","night"]),ir=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),Yi=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function xn(e,t){const n=typeof e=="string"?e.trim():"";if(!n||n==="null")return!1;if(typeof window<"u"&&window.location?.origin&&n===window.location.origin)return!0;const o=t&&t.length>0?[...Yi,...t]:Yi;for(const s of o)if(typeof s=="string"){if(s===n)return!0}else if(s.test(n))return!0;return!1}function sr(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const n=new URL(document.referrer).origin;if(xn(n,t))return n}catch{}return null}function Ki(e){const t=String(e||"day").toLowerCase();return nr.has(t)?t:"day"}function Zi(e){const t=String(e||"clear").toLowerCase();return ir.has(t)?t:"clear"}function Is(e={}){const t=e.parkName||"Trang Trại Hang Sóc",n=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",o=Math.max(1,Math.floor(Number(e.level)||1)),s=Math.max(0,Math.floor(Number(e.magicStars)||0)),a=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",i=e.keeperTitle?` · [${e.keeperTitle}]`:"",p={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},c=e.weatherMode&&p[e.weatherMode]?` (${p[e.weatherMode]})`:"";return`🏰 [${t}${n} · Cấp ${o}${l}${i}]${c} — ${a}/10 vùng mở khóa, ${r} công trình & ${s} 🌟 Sao Phép Thuật!`}function ar(e={}){const t=[],n=e.win??(typeof window<"u"?window:void 0),o=e.nav??(typeof navigator<"u"?navigator:void 0);let s=sr(e.targetOrigin,e.allowedOrigins);function a(i,p={}){const c={source:tr,version:"25.1",type:i,payload:p,sentAt:Date.now()};t.push(c),t.length>24&&t.shift();try{const d=n?.parent;if(d&&d!==n&&typeof d.postMessage=="function"){const g=e.targetOrigin||s||"*";d.postMessage(c,g)}}catch{}return c}function r(i){const p=i;if(p.source!=null&&n?.parent!=null&&p.source!==n.parent)return;if(!e.allowAnyOrigin&&typeof p.origin=="string"&&p.origin.length>0){if(!xn(p.origin,e.allowedOrigins))return;s=p.origin}const c=p?.data;if(!c||typeof c!="object")return;const d=c.payload&&typeof c.payload=="object"?c.payload:{};if(c.type==="hpvn:burrow:set-atmosphere"||c.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(Ki(d.mode??c.mode));else if(c.type==="hpvn:burrow:set-weather"||c.type==="hpvn:host:set-weather")e.onWeatherChange?.(Zi(d.mode??c.mode));else if(c.type==="hpvn:burrow:set-event"||c.type==="hpvn:host:set-event")e.onEventChange?.(String(d.mode??c.mode??"auto"));else if(c.type==="hpvn:burrow:tour-garden"||c.type==="hpvn:host:tour-garden"){const g=d.tourId??c.tourId??null;g?e.onStartTour?.(String(g)):e.onStopTour?.()}else if(c.type==="hpvn:burrow:mute"||c.type==="hpvn:host:mute")e.onMuteChange?.(!!(d.muted??c.muted));else if(c.type==="hpvn:burrow:request-snapshot"||c.type==="hpvn:host:request-snapshot"){const g=e.getSnapshot?e.getSnapshot():{};a("hpvn:burrow:snapshot",g)}}n&&typeof n.addEventListener=="function"&&n.addEventListener("message",r);async function l(i={}){const p=Is(i),c=a("hpvn:burrow:share-floo",{text:p,level:i.level??1,parkName:i.parkName??"Trang Trại Hang Sóc",...i.playerName?{playerName:i.playerName}:{},...i.tourId?{tourId:i.tourId}:{},...i.image?{image:i.image}:{},atmosphereMode:Ki(i.atmosphereMode),weatherMode:Zi(i.weatherMode),eventMode:i.eventMode??"auto"});if(typeof i.sendToFloo=="function"&&await i.sendToFloo(p,i)===!0)return e.notify?.(i.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:p,copied:!1,floo:!0,envelope:c};let d=!1;try{o?.clipboard?.writeText&&(await o.clipboard.writeText(p),d=!0)}catch{d=!1}return e.notify?.(d?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${p}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${p}"`),{ok:!0,text:p,copied:d,envelope:c}}return{notifyReady:(i={})=>a("hpvn:burrow:ready",i),syncState:(i={})=>a("hpvn:burrow:state",i),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{n&&typeof n.removeEventListener=="function"&&n.removeEventListener("message",r)}}}function Kn(e,t={},n){const a=n??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});a.width=640,a.height=380;const r=a.getContext("2d");if(!r)return a;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),i=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),p=Math.max(1,Math.floor(Number(t.level)||1)),c=t.house||"Gryffindor",d=Math.max(0,Math.floor(Number(t.magicStars)||0)),g=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),y=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const u={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(u,614,31),r.textAlign="left";const m=18,T=50,L=604,$=248;r.save(),r.beginPath(),r.rect(m,T,L,$),r.clip();let k=!1;if(e&&e.width>0&&e.height>0)try{const Y=e.width/e.height,Z=L/$;let ie=0,N=0,q=e.width,_=e.height;Y>Z?(q=Math.round(e.height*Z),ie=Math.round((e.width-q)/2)):(_=Math.round(e.width/Z),N=Math.round((e.height-_)/2));const ee=typeof document<"u"&&e.id==="gameCanvas"?document.getElementById("gpuWorldCanvas"):null;if(ee&&ee.style.display!=="none"&&ee.width>0&&ee.height>0){const B=ee.width/ee.height;let j=0,oe=0,le=ee.width,re=ee.height;B>Z?(le=Math.round(ee.height*Z),j=Math.round((ee.width-le)/2)):(re=Math.round(ee.width/Z),oe=Math.round((ee.height-re)/2)),r.drawImage(ee,j,oe,le,re,m,T,L,$)}r.drawImage(e,ie,N,q,_,m,T,L,$),k=!0}catch{k=!1}if(!k){const Y=r.createLinearGradient(m,T,m,T+$);Y.addColorStop(0,"#365843"),Y.addColorStop(.55,"#598249"),Y.addColorStop(1,"#334d2c"),r.fillStyle=Y,r.fillRect(m,T,L,$)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(m,T,L,$);const f=18,h=304,S=604,E=58;r.fillStyle="#f6ebd2",r.fillRect(f,h,S,E),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(f,h,S,E);const M={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[c]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${M} ${l} · Cấp ${p}`,f+14,h+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const R=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${i} · Nhà ${c}${R} · ${y}/10 vùng · ${g} công trình · ${d} 🌟`,f+14,h+42);const V=142,P=34,W=f+S-V-12,D=h+12;return r.fillStyle="#1d5c4b",r.fillRect(W,D,V,P),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(W,D,V,P),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",W+V/2,D+P/2+1),r.textAlign="left",a}function Bs(e,t=.55){try{const n=e.toDataURL("image/webp",t);if(typeof n=="string"&&n.startsWith("data:image/webp"))return n;const o=e.toDataURL("image/png");return typeof o=="string"?o:""}catch{return""}}const or={};function Xe(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),n=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^n&15>>t/4).toString(16)})}function rr(e,t){const n=Math.max(1,Math.floor(Number(t)||1)),o=e.effectivePrice??e.price,s=e.dailyRemaining??e.dailyLimit;let a=0;for(let r=0;r<n;r++)r<s?a+=o:e.overflowMultiplier&&e.overflowMultiplier>1?a+=Math.ceil(o*e.overflowMultiplier):a+=o;return a}const lr=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function Zn(e,t={}){const n=e&&typeof e=="object"?e:{},o=n.details&&typeof n.details=="object"?n.details:{},s=String(n.reason||o.reason||"unknown-error"),a={...lr,...t.labels||{}};switch(s){case"missing-crops":{const r=Array.isArray(o.missing)?o.missing:[];if(r.length>0){const l=r.map(i=>{const p=String(i.resource||"");return`${Math.max(1,Number(i.required||0)-Number(i.have||0))} ${a[p]||p}`});return{reason:s,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:s,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof o.shortBy=="number"?o.shortBy:typeof o.required=="number"&&typeof o.spendable=="number"?Math.max(1,o.required-o.spendable):null;return{reason:s,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(o.required||0),l=Number(o.have||0),i=Math.max(1,r-l);return{reason:s,icon:"🌟",text:`Thiếu ${i} Sao Phép Thuật`}}case"missing-supply":{const r=String(o.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:s,icon:"🌱",item:l,text:`Thiếu hạt ${a[l]||l}`}}return{reason:s,icon:"💧",item:r,text:`Thiếu ${a[r]||"vật tư"}`}}case"wallet-frozen":return{reason:s,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:s,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:s,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:s,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:s,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:s,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:s,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:s,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:s,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:s,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:s,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:s,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:s,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:s,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:s,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(s==="model-rejected"&&typeof o.modelCode=="string"&&t.modelText){const r=t.modelText(o.modelCode);if(r)return{reason:s,icon:"🪄",text:r}}return{reason:s,icon:"🪄",text:n.message||"Máy chủ từ chối thao tác"}}}}function mi(e){let t=null,n=null,o=Promise.resolve();const s=i=>{const p=o.then(i,i);return o=p.catch(()=>{}),p};async function a(i,p){const c=t?.catalogHash,d=c?{...p,catalogHash:c}:p,g=await e(i,d);if(!g||typeof g!="object"||!("garden"in g))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const y=g;return y.catalog===void 0&&c&&y.catalogHash===c&&(y.catalog=t?.catalog),t?.saleAdmin&&y.saleAdmin===void 0&&(y.saleAdmin=!0),t=y,t}async function r(i,p){const c=JSON.stringify({name:i,payload:p});if(n&&n.signature!==c)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");n||(n={signature:c,data:{...p,requestId:Xe()}});try{const d=await a(i,n.data);return n=null,d}catch(d){throw d?.definitive===!0&&(n=null),d}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return n!==null},read:()=>s(()=>a("getBurrowGarden",{})),act:i=>s(()=>r("performBurrowAction",{...i,expectedRevision:l()})),free:(i,p={})=>s(()=>a("performBurrowAction",{...p,action:"freeAction",kind:i,expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),guide:i=>s(()=>a("performBurrowAction",{action:"guideDone",lessonId:i,expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),scene:i=>s(()=>a("performBurrowAction",{action:"setScene",scene:i,expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),syncProfile:i=>s(()=>a("performBurrowAction",{...i,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),submitLeaderboard:i=>s(()=>a("performBurrowAction",{...i,action:"submitLeaderboard",expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),getLeaderboard:(i="match3")=>s(()=>a("performBurrowAction",{action:"getLeaderboard",gameId:i,expectedRevision:t?.garden.progression.revision??0,requestId:Xe()})),visit:(i={})=>s(()=>e("visitBurrowGarden",i)),frame:i=>s(async()=>{const p=await e("setBurrowFlooFrame",{frameKey:i});return t&&Array.isArray(p.frames)&&typeof p.worn=="string"&&(t={...t,flooFrames:{frames:p.frames,worn:p.worn}}),p}),sales:(i={mode:"get"})=>s(()=>e("manageBurrowSales",i)),fireOut:i=>s(()=>e("extinguishBurrowGarden",{...i,requestId:Xe()})),sell:(i,p)=>s(()=>r("sellBurrowGoods",i?{items:i,expectedTotal:p}:{clearance:!0,expectedTotal:p})),buy:(i,p=1)=>s(()=>{const c=t?.catalog?.find(d=>d.id===i);if(!c)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:i,quantity:p,catalogVersion:t?.catalogVersion,expectedTotal:rr(c,p)})}),settleWallet:i=>s(()=>a("settleBurrowWallet",{direction:i.direction,amount:Math.max(1,Math.floor(i.amount)),...i.reasonCode?{reasonCode:i.reasonCode}:{},...i.sourceType?{sourceType:i.sourceType}:{},...typeof i.clientLevel=="number"?{clientLevel:Math.floor(i.clientLevel)}:{},requestId:typeof i.requestId=="string"&&i.requestId?i.requestId:Xe()})),houseCup:()=>s(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(i,p)=>s(()=>e("contributeBurrowHouseCup",{points:i,...p?{house:p}:{}})),postCoop:i=>s(()=>e("postBurrowCoopRequest",{...i,requestId:typeof i.requestId=="string"?i.requestId:Xe()})),fulfillCoop:i=>s(()=>e("fulfillBurrowCoopRequest",i)),listCoop:i=>s(()=>e("getBurrowCoopRequests",i?{hostUid:i}:{}))}}const Un="hpvn-burrow-game";function hi(e=globalThis.location){if(typeof window<"u"&&e===window.location)return qa();const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const n=new URLSearchParams(t);return n.get("burrow-ticket")??n.get("hpvn-ticket")}function cr(e,t=window,n={}){let o=0;const s=new Map;let a=n.targetOrigin&&n.targetOrigin!=="*"?n.targetOrigin:null;if(!a&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;xn(l,n.allowedOrigins)&&(a=l)}catch{}t.addEventListener("message",l=>{if(!n.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!xn(l.origin,n.allowedOrigins))return;a=l.origin}const i=l.data;if(l.source!==t.parent||!i||i.channel!==Un||i.nonce!==e||typeof i.id!="string"||!s.has(i.id))return;const p=s.get(i.id);s.delete(i.id),p(i)});const r=mi((l,i)=>new Promise((p,c)=>{const d=`burrow-${++o}`,g=setTimeout(()=>{s.delete(d),c(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);s.set(d,y=>{if(clearTimeout(g),"result"in y&&y.result&&typeof y.result=="object"){p(y.result);return}const C=new Error(typeof y.error=="string"?y.error:"Máy chủ từ chối thao tác.");C.definitive=y.definitive===!0,C.reason=typeof y.reason=="string"?y.reason:void 0,C.details=y.details&&typeof y.details=="object"?y.details:{},c(C)}),t.parent.postMessage({channel:Un,nonce:e,id:d,action:"burrow",name:l,data:i},n.targetOrigin||a||"*")}));return r.host=(l,i={})=>new Promise(p=>{const c=`host-${++o}`,d=setTimeout(()=>{s.delete(c),p(null)},5e3);s.set(c,g=>{clearTimeout(d),p(g.result??null)}),t.parent.postMessage({...i,channel:Un,nonce:e,id:c,action:l},n.targetOrigin||a||"*")}),r}function dr(e={}){const t=jn(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),n=jn(e.sessionEndpoint??"/api/auth/session"),o=e.fetchImpl??globalThis.fetch.bind(globalThis),s=e.getUid??Kt,a=e.timeoutMs??18e3;let r=null,l=0;async function i(p){if(r&&Date.now()+3e4<l)return r;try{const c=typeof window<"u"?window:void 0,d=c?.__HPVN_CONFIG__?.getIdToken??c?.__HPVN_GET_ID_TOKEN__,g=d?await d().catch(()=>null):null,y=typeof window<"u"?hi(window.location):null,C=await o(n,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":p,...g?{Authorization:`Bearer ${g}`}:{}},body:JSON.stringify({uid:p,...g?{idToken:g}:{},...y?{ticket:y}:{}})});if(!C.ok)return null;const u=await C.json();if(typeof u.uid=="string"&&u.uid&&!e.getUid&&li(u.uid),typeof u.token=="string"&&u.token)return r=u.token,l=Number(u.expiresAt||Date.now()+36e5),r}catch{}return null}return mi(async(p,c)=>{const d=s(),g=await i(d),y=new AbortController,C=setTimeout(()=>y.abort(),a);let u;try{const T={"Content-Type":"application/json","X-User-Id":d};g&&(T.Authorization=`Bearer ${g}`),u=await o(`${t}${p}`,{method:"POST",headers:T,body:JSON.stringify({data:c}),signal:y.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(C)}const m=await u.json();if(m.error||!u.ok){const T=new Error(m.error?.message||`Máy chủ từ chối thao tác (${u.status}).`);throw T.definitive=u.status<500,T.reason=typeof m.error?.details?.reason=="string"?m.error.details.reason:void 0,T.details=m.error?.details??{},T}return m.result??{}})}function pr(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),n=e.fetchImpl??globalThis.fetch.bind(globalThis),o=e.timeoutMs??2e4;return mi(async(s,a)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,i=new AbortController,p=setTimeout(()=>i.abort(),o);let c;try{const g={"Content-Type":"application/json"};l?g.Authorization=`Bearer ${l}`:g["X-User-Id"]=Kt(),c=await n(`${t}${s}`,{method:"POST",headers:g,body:JSON.stringify({data:a}),signal:i.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(p)}const d=await c.json();if(d.error||!c.ok){const g=new Error(d.error?.message||`Cloud Functions từ chối thao tác (${c.status}).`);throw g.definitive=c.status<500,g.reason=typeof d.error?.details?.reason=="string"?d.error.details.reason:void 0,g.details=d.error?.details??{},g}return d.result??{}})}function Hs(){if(typeof window<"u"){const e=hi(window.location);if(e)return cr(e,window);const t=new URLSearchParams(window.location.search);t.get("emulator"),t.get("functionsPort");const n=window.__HPVN_CONFIG__,o=or?.VITE_HPVN_FUNCTIONS_URL,s=n?.functionsBaseUrl||o;if(s)return pr({functionsBaseUrl:s,getIdToken:n?.getIdToken})}return dr()}Promise.resolve();async function ur(e=Hs()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const n=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(n.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(n.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(n.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(n.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}function gr(e){e.closeHudPopovers(),Ds(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function mr(e){const t=e.sim.getClaimableHarvestFeastCount(),n=e.root.querySelector("#badgeFeastCount");n&&(t>0?(n.textContent=String(t),n.classList.remove("hidden")):n.classList.add("hidden"));const o=e.root.querySelector("#badgeManageFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"))}function hr(e,t){const n=e.root.querySelector("#ribbonUnveilToastCard");n&&(n.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${A(t.speakerEmoji)} ${A(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${A(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,n.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{n.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function Ds(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const n=e.sim.ensureHarvestFeast(),o=new Set(n.claimedTiers),s=Rt[Rt.length-1]?.pointsRequired??3e3,a=Math.min(100,Math.round(n.points/Math.max(1,s)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=Rt.every(c=>o.has(c.tier)),i=Rt.find(c=>!o.has(c.tier)),p=Rt.map(c=>{const d=o.has(c.tier),y=n.points>=c.pointsRequired&&!d,C=Ia(c),u=c.tier%5===0;return`
        <article class="feast-tier-card ${d?"is-claimed":y?"is-claimable":"is-locked"} ${u?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${c.tier}</span>
            <span class="feast-tier-pts">🍁 ${c.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${A(c.icon)} ${A(c.titleVi)}</span>
              ${u?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${A(C)}</div>
          </div>
          <div class="feast-tier-cta">
            ${d?'<span class="feast-claimed-pill">✓</span>':y?`<button type="button" data-claim-feast-tier="${c.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(c.pointsRequired-n.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${n.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${n.points.toLocaleString("vi-VN")} / ${s.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${l?"🎉 30/30!":i?` Kế tiếp: #${i.tier} (${i.pointsRequired.toLocaleString("vi-VN")} 🍁)`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${r>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${r})</button>`:""}
            ${l?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${n.seasonCycle+1}</button>`:""}
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${a}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      <div class="feast-tier-list" role="list">
        ${p}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const c=e.sim.claimAllHarvestFeastTiers();e.showToast(c.msg,c.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const c=e.sim.startNextHarvestFeastCycle();e.showToast(c.msg,c.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(c=>{c.addEventListener("click",()=>{const d=Number(c.dataset.claimFeastTier);if(!Number.isFinite(d))return;const g=e.sim.claimHarvestFeastTier(d);e.showToast(g.msg,g.ok?"🎁":"🍁"),e.refreshAll()})})}function fr(e){const t=e.root.querySelector("#financeDialogContent"),n=e.sim.state.finance,o=n.gateRevenue+n.ticketRevenue+n.shopRevenue+n.harvestRevenue,s=n.staffWagesPaid+n.constructionSpent,a=o-s,r=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${n.harvestRevenue.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(n.shopRevenue+n.ticketRevenue+n.gateRevenue).toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${o.toLocaleString("vi-VN")} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${n.constructionSpent.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${r}G/ca):</span><strong>-${n.staffWagesPaid.toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${a>=0?"#15803d":"#b45309"};">
              <span>Ròng:</span><strong>${a>=0?"+":""}${a.toLocaleString("vi-VN")} G</strong>
            </div>
          </div>
        </div>
      </div>
    `}function st(e){const t=e.root.querySelector("#albumDialogContent"),n=e.sim.state;e.sim.checkAndToastAchievements();const o=Ba(n),s=Ha(n),a=Hi.filter(c=>{const d=o.achievements[c.id];return!!(d?.unlockedAt&&!d?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=Di.filter(c=>c.day<=r&&!o.claimedLoginDays.includes(c.day)).length,i=`
      <div class="workshop-tabs" role="tablist" aria-label="Sổ Vàng Hang Sóc" style="margin-bottom:12px;">
        <button type="button" data-atab="cup" data-active="${e.activeAlbumTab==="cup"}" aria-selected="${e.activeAlbumTab==="cup"}" class="brass-btn">
          🏆 Cúp 4 Nhà
        </button>
        <button type="button" data-atab="achievements" data-active="${e.activeAlbumTab==="achievements"}" aria-selected="${e.activeAlbumTab==="achievements"}" class="brass-btn">
          🎖️ Thành Tựu (${s.unlocked}/${s.total})${a>0?` • 🎁${a}`:""}
        </button>
        <button type="button" data-atab="friendship" data-active="${e.activeAlbumTab==="friendship"}" aria-selected="${e.activeAlbumTab==="friendship"}" class="brass-btn">
          💝 Tình Bạn &amp; Phim
        </button>
        <button type="button" data-atab="login7" data-active="${e.activeAlbumTab==="login7"}" aria-selected="${e.activeAlbumTab==="login7"}" class="brass-btn">
          📅 Điểm Danh 7N${l>0?` • 🎁${l}`:""}
        </button>
      </div>
    `;let p="";if(e.activeAlbumTab==="cup"){const c=e.sim.getPlayerHouse(),d=n.weeklyHouseCupServerStandings,g=[{house:"Gryffindor",icon:"🦁",pts:(n.housePoints.Gryffindor??0)+(d?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(n.housePoints.Slytherin??0)+(d?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(n.housePoints.Ravenclaw??0)+(d?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(n.housePoints.Hufflepuff??0)+(d?.totals.Hufflepuff??0)}];g.sort((T,L)=>L.pts-T.pts);const y=Math.max(100,g[0]?.pts??100),C=(n.housePoints.Gryffindor??0)+(n.housePoints.Slytherin??0)+(n.housePoints.Ravenclaw??0)+(n.housePoints.Hufflepuff??0),u=n.houseCupMilestoneTier*300,m=C>=u;p=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${c}</strong>${d?` • Tuần HPVN ${A(d.weekKey)} (đóng góp: +${d.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${n.houseCupMilestoneTier}: ${C} / ${u}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${g.map((T,L)=>{const $=Math.min(100,Math.max(8,Math.round(T.pts/y*100))),k=T.house===c;return`
                  <div class="aaa-hourglass-card" data-house="${T.house}" data-player-house="${k}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${L===0?"👑 ":""}${T.icon} ${T.house}</span>
                      ${k?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${T.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${$}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${u}" value="${Math.min(u,C)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${m?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1 1 200px;">🏆 Nhận Thưởng Cúp Đợt ${n.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="flex:1 1 180px;font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const c=Date.now(),d={farm:Tt(n,"farm",c),building:Tt(n,"building",c),puzzle:Tt(n,"puzzle",c),language:Tt(n,"language",c),social:Tt(n,"social",c),collection:Tt(n,"collection",c)},g=[{id:"all",label:"✨ Tất cả"},{id:"farm",label:"🌾 Mùa vụ"},{id:"building",label:"🏰 Kiến trúc"},{id:"puzzle",label:"🪄 Khảo thí"},{id:"language",label:"📖 Đa ngữ"},{id:"social",label:"🦉 Xã hội"},{id:"collection",label:"🐸 Sưu tầm"}],y=e.activeAchievementFilterCat??"all",C=Hi.filter(u=>y==="all"||u.category===y).slice().sort((u,m)=>{const T=o.achievements[u.id],L=o.achievements[m.id],$=T?.unlockedAt&&!T?.claimedAt?1:0,k=L?.unlockedAt&&!L?.claimedAt?1:0;return $!==k?k-$:0});p=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${s.completionPct}% (${s.unlocked}/${s.total})</span>
              ${a>0?`<button id="btnClaimAllAchievements" type="button" class="brass-btn gold-cta" style="padding:4px 11px;font-size:11.5px;">🎁 Nhận Tất Cả (${a})</button>`:""}
            </div>
          </div>
          <progress max="${s.total}" value="${s.unlocked}" style="width:100%;margin-bottom:8px;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${g.map(u=>`
                  <button type="button" data-ach-cat="${u.id}" data-active="${y===u.id}" aria-pressed="${y===u.id}" class="brass-btn" style="padding:3px 9px;font-size:11px;">
                    ${u.label}
                  </button>
                `).join("")}
          </div>
        </div>
        <div class="aaa-codex-scroll">
          ${C.map(u=>{const m=o.achievements[u.id],T=!!m?.unlockedAt,L=!!m?.claimedAt,$=Math.min(u.target,Math.max(0,d[u.category]??0)),k=$.toLocaleString("vi-VN"),f=u.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${T}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${u.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${u.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${u.descVi} • Thưởng <strong>+${u.rewardGalleons}G, +${u.rewardStars} 🌟</strong></div>
                    ${T?"":`<progress max="${u.target}" value="${$}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${L?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':T?`<button type="button" data-claim-ach="${u.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${k}/${f}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const c=e.sim.getRealTimePeriod(),d=Da();p=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${gs.map(g=>{const y=n.level>=g.unlockLevel||e.sim.isHeadmasterPreview;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${g.titleVi}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">Yêu cầu: Cấp ${g.unlockLevel}</div>
                  <button type="button" data-play-cutscene="${g.id}" ${y?"":"disabled"} class="brass-btn ${y?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                    ${y?"🎬 Phát Phim Camera":`🔒 Mở ở Cấp ${g.unlockLevel}`}
                  </button>
                </div>
              `}).join("")}
          </div>
        </div>
        <div class="aaa-codex-scroll">
          ${Ra.map(g=>{const y=Na(g.id,c),C=o.npcFriendship[g.id]??{villagerId:g.id,level:1,xp:0},u=C.level*60,m=C.lastTalkedDayKey===d;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${g.moodBubble} ${g.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${g.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${C.level}/10 (${C.xp}/${u})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${y.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${g.id}" data-choice="0" ${m?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${m?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${m?"":`<button type="button" data-npc-talk="${g.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else p=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${Di.map(c=>{const d=o.claimedLoginDays.includes(c.day),g=!d&&c.day<=r;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${c.titleVi}</div>
                  <div style="font-size:11.5px;color:var(--ink-soft);">
                    +${c.galleons}G • +${c.magicStars} 🌟${c.phoenixTalismans>0?` • +${c.phoenixTalismans} 🔥`:""}
                  </div>
                  ${d?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận quà</span>':`<button type="button" data-claim-login="${c.day}" ${g?"":"disabled"} class="brass-btn ${g?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                          ${g?"🎁 Nhận Ngay":"🔒 Mở kế tiếp"}
                        </button>`}
                </div>
              `}).join("")}
          </div>
        </div>
      `;t.innerHTML=i+p,t.querySelectorAll("[data-atab]").forEach(c=>{c.addEventListener("click",()=>{e.activeAlbumTab=c.dataset.atab,st(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&st(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const c=await ur();if(c){n.weeklyHouseCupServerStandings=c,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${c.weekKey}!`,"🏆"),st(e);return}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelector("#btnClaimAllAchievements")?.addEventListener("click",()=>{const c=e.sim.claimAllAchievements();e.showToast(c.msg,c.ok?"🎖️":"⚠️"),st(e)}),t.querySelectorAll("[data-ach-cat]").forEach(c=>{c.addEventListener("click",()=>{e.activeAchievementFilterCat=c.dataset.achCat||"all",st(e)})}),t.querySelectorAll("[data-claim-ach]").forEach(c=>{c.addEventListener("click",()=>{const d=e.sim.claimAchievement(String(c.dataset.claimAch));e.showToast(d.msg,d.ok?"🎖️":"⚠️"),st(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(c=>{c.addEventListener("click",()=>{e.playStoryCutscene(String(c.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.npcTalk,g=Number(c.dataset.choice)===1?1:0,y=e.sim.talkWithVillagerChoice(d,g);e.showToast(y.msg,y.ok?"💝":"☕"),st(e)})}),t.querySelectorAll("[data-claim-login]").forEach(c=>{c.addEventListener("click",()=>{const d=e.sim.claimLoginDayReward(Number(c.dataset.claimLogin));e.showToast(d.msg,d.ok?"📅":"🔒"),st(e)})})}function Qe(e){const t=e.root.querySelector("#questDialogContent"),n=e.sim.ensureFarmBarn(),o=e.sim.getActiveStoryQuest(),s=e.sim.getStoryAutoActionPreview(),a=e.sim.getReadyOwlOrdersCount(),r=(o?.completed?1:0)+e.sim.state.owlQuests.filter(h=>h.completed&&!h.claimed).length+e.sim.state.dailyQuests.filter(h=>h.completed&&!h.claimed).length;if(!e.selectedOwlOrderId||!n.owlOrders.some(h=>h.id===e.selectedOwlOrderId)){const h=n.owlOrders.find(S=>e.sim.canFulfillFarmOwlOrder(S));e.selectedOwlOrderId=(h??n.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${a}/${n.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const h=n.owlOrders.find(M=>M.id===e.selectedOwlOrderId)??n.owlOrders[0],S=h?e.sim.canFulfillFarmOwlOrder(h):!1,E=n.owlOrders.map(M=>{const R=h?.id===M.id,V=e.sim.canFulfillFarmOwlOrder(M),P=M.portraitSprite&&/^[a-z0-9_]+$/i.test(M.portraitSprite)?M.portraitSprite:null,W=P?`<img src="/trang-trai-hang-soc/sprites/${P}.png" alt="${A(M.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${A(M.portraitEmoji)}</span>`,D=M.requirements.slice(0,3).map(Y=>{const Z=Je(Y.itemId);return`<img src="${Z.iconSrc}" alt="${A(Z.name)}" title="${Y.qty} ${A(Z.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${R?"selected":""} ${V?"ready":""}"
              data-select-owl="${A(M.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${W}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${A(M.senderName)}</div>
                <div class="owl-note-mini-row">${D}</div>
                ${M.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${V?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),x=h?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${A(h.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${A(h.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${h.requirements.map((M,R)=>{const V=Je(M.itemId),P=e.sim.getFarmItemCount(M.itemId),W=e.sim.ensureNeighborSocial(),D=Math.max(0,pn-W.dailyOwlHelpRequestedCount),Y=e.sim.getOwlRequirementHelpState(h.id,R),Z=!!Y?.fulfilledAt,ie=e.sim.state.sandboxMode||Z||P>=M.qty,N=Z?`<span class="owl-help-tag done">✓ ${A(Y?.helperEmoji??"🦉")}</span>`:Y?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':ie?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${R}" ${D<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${D})</button>`;return`
                    <div class="owl-req-row ${ie?"ok":"lack"}">
                      <img src="${V.iconSrc}" alt="${A(V.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${A(V.name)}</div>
                        <div class="owl-req-count">${Z?"✓":`${e.sim.state.sandboxMode?"∞":P}/${M.qty}`}</div>
                      </div>
                      ${N}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${h.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${h.rewardXp}</span>
                ${h.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${h.rewardMugglePlug}</span>`:""}
                ${(h.isFeastMarquee||(n.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<Wn?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${E}</div>
            ${x}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${S?"ready":"not-ready"}"
            >
              🦉 ${S?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(M=>{M.addEventListener("click",()=>{e.activeQuestTab=M.dataset.qtab,Qe(e)})}),t.querySelectorAll("[data-select-owl]").forEach(M=>{M.addEventListener("click",()=>{e.selectedOwlOrderId=M.dataset.selectOwl??null,Qe(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{h&&(e.sim.refreshFarmOwlOrder(h.id),e.selectedOwlOrderId=null,Qe(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(M=>{M.addEventListener("click",()=>{if(!h)return;const R=Number(M.dataset.askOwlHelp);if(!Number.isFinite(R))return;const V=e.sim.requestPlayerOwlCrateHelp(h.id,R);V.ok||e.showToast(V.msg,"⚠️"),Qe(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!h)return;if(!e.sim.canFulfillFarmOwlOrder(h)){const R=e.sim.fulfillFarmOwlOrder(h.id);e.showToast(R.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const M=e.sim.fulfillFarmOwlOrder(h.id);M.ok&&e.showToast(M.msg,"🦉"),e.selectedOwlOrderId=null,Qe(e)});return}const i=(h,S,E=!1)=>{const x=Math.min(100,Math.round(h.progress/Math.max(1,h.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${A(h.giverEmoji)} ${A(h.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${A(S)}</span>
          </div>
          ${E&&h.dialogue?`<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.35;">${A(h.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${x}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(h.progress,h.targetAmount)}/${h.targetAmount}</span>
            <span>🪙${h.rewardGalleons} • ⭐${h.rewardXp} ${h.rewardTimeSand>0?`• ⏳${h.rewardTimeSand}`:""}</span>
          </div>
          ${h.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':h.completed?`<button type="button" data-modal-claim="${A(h.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:E?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${A(s.shortLabel)}</button>`:""}
        </div>
      `},p=e.sim.getRequiredLevelTrial(),c=e.sim.getWinsProgressForCurrentLevel(),d=h=>{const S=e.sim.getDisciplineStageInfo(h);return S.isMaxed?"👑777":`${S.currentStage}/777`},g=p&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${c.current}/${c.required}): ${p.icon} ${A(p.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${p.kind==="match3"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🍓 (${d("match3")})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${p.kind==="caro"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${d("caro")})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${p.kind==="sudoku"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🔮 (${d("sudoku")})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${p.kind==="chess"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🏰 (${d("chess")})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${p.kind==="blocks"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🦄 (${d("blocks")})</button>
              <button type="button" data-modal-open-trial="jigsaw" class="brass-btn ${p.kind==="jigsaw"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🧩 (${d("jigsaw")})</button>
            </div>
          </div>
        </div>
      `:"",y=o?`Ch.${o.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${fa.length}`:"",C=e.sim.getYuleEventStatus(),u=C.dayDef?.main,m=C.day>0&&C.claimedMainDays.includes(C.day),T=u?Ri(e.sim.state,u):0,L=!!(u&&T>=u.amount),$=u?Math.min(100,Math.round(T/Math.max(1,u.amount)*100)):0,k=C.dayDef?.side.map(h=>{const S=C.claimedSideTaskIds.includes(h.id),E=Ri(e.sim.state,h),x=E>=h.amount;return`<div class="quest-card-mini" style="padding:9px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><span style="font-size:12px;font-weight:700;">${A(h.titleVi)} <span style="color:var(--ink-soft);">(${Math.min(E,h.amount)}/${h.amount} • +${h.rewardSickles.toLocaleString("vi-VN")} 🪙)</span></span>${S?'<span style="color:#15803d;font-weight:800;">✓</span>':`<button type="button" class="brass-btn ${x?"gold-cta":""}" data-yule-side="${A(h.id)}" style="padding:4px 8px;font-size:11px;${x?"":"opacity:0.62;"}">Nhận</button>`}</div>`}).join("")??"",f=C.active&&u?`<div class="quest-card-mini" style="padding:12px;border:1px solid #d97706;background:linear-gradient(135deg,rgba(254,243,199,.9),rgba(219,234,254,.8));"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>🎄 Yule • Ngày ${C.day}/36</strong><span style="font-size:11px;color:var(--ink-soft);">${A(C.dayDef?.titleVi??"")}</span></div><div style="font-size:13px;font-weight:800;margin-top:7px;">${A(u.titleVi)}</div><div class="quest-bar"><div class="quest-bar-fill" style="width:${$}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:3px;">${Math.min(T,u.amount)}/${u.amount}</div>${m?'<div style="margin-top:7px;color:#15803d;font-weight:800;">✓ Đã nhận phần thưởng ngày</div>':`<button type="button" data-yule-main="${C.day}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;${L?"":"opacity:0.65;"}">🎁 Nhận phần thưởng ngày</button>`}<div style="margin-top:9px;font-size:12px;font-weight:800;">Nhiệm vụ phụ (mỗi nhiệm vụ tối đa 5.000 Sickle)</div>${k}</div>`:"";t.innerHTML=`
      ${f}
      ${l}
      ${g}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${o?i(o,y,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(h=>i(h,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(h=>i(h,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(h=>{h.addEventListener("click",()=>{e.activeQuestTab=h.dataset.qtab,Qe(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(h=>{h.addEventListener("click",()=>{const S=h.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(S)})}),t.querySelector("[data-yule-main]")?.addEventListener("click",()=>{const h=Number(t.querySelector("[data-yule-main]")?.dataset.yuleMain),S=e.sim.claimYuleMainDay(h);e.showToast(S.msg,S.ok?"🎄":"⚠️"),Qe(e)}),t.querySelectorAll("[data-yule-side]").forEach(h=>{h.addEventListener("click",()=>{const S=e.sim.claimYuleSideTask(h.dataset.yuleSide);e.showToast(S.msg,S.ok?"🪙":"⚠️"),Qe(e)})}),t.querySelectorAll("[data-modal-claim]").forEach(h=>{h.addEventListener("click",()=>{e.sim.claimQuest(h.dataset.modalClaim),Qe(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const h=e.sim.completeStoryStepWithStar();h.ok?(typeof h.placedGx=="number"&&typeof h.placedGy=="number"&&we(e.cam,h.placedGx,h.placedGy),Qe(e)):(e.showToast(h.msg,h.reason==="missing_gold"?"🪙":h.reason==="locked_level"?"🔒":"🌟"),h.reason==="open_match3"&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function Rs(e){const t=e.root.querySelector("#roadmapDialogContent"),n=new Set(e.sim.state.unlockedZones),o=e.sim.getRequiredLevelTrial(),s=ri.map(r=>{const l=n.has(r.id)||e.sim.state.sandboxMode,i=!l&&e.sim.state.level>=r.unlockLevel,p=ls(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${l?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${p>0?`🌟 ${p}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${i?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),a=ba.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${o&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${o.icon} ${A(o.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${s}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${a.map(r=>{const l=e.sim.state.level>=r.level,i=r.unlockedItemIds.map(p=>ne(p)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${i?`<span style="font-size:12px;margin-left:6px;">${i}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=rs(r.dataset.camZone);we(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),Rs(e)})})}function Ee(e){const t=e.root.querySelector("#settingsDialogContent"),n=e.sim.state,o=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎵 Âm Thanh &amp; Hiển Thị</div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            <label class="switch-row">
              <span>🎼 Nhạc nền (BGM)</span>
              <input id="swBgm" type="checkbox" switch ${n.settings.bgmEnabled?"checked":""} />
            </label>
            <label class="switch-row">
              <span>🔔 Âm hiệu ứng (SFX)</span>
              <input id="swSfx" type="checkbox" switch ${n.settings.soundEnabled?"checked":""} />
            </label>
            <label class="switch-row">
              <span>👁️ Nhìn xuyên nhà (V)</span>
              <input id="swCutaway" type="checkbox" switch ${n.settings.cutawayMode?"checked":""} />
            </label>
            <label class="switch-row">
              <span>✨ Hiện lưới ô</span>
              <input id="swGrid" type="checkbox" switch ${n.settings.showGrid?"checked":""} />
            </label>
            
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["realtime","dawn","day","dusk","night"].map(s=>{const a={realtime:"🕒 24h",dawn:"🌅 Bình minh",day:"☀️ Ngày",dusk:"🌇 Chiều",night:"🌙 Đêm"};return`<button type="button" data-time="${s}" data-active="${n.settings.timeOverride===s}" aria-pressed="${n.settings.timeOverride===s}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[s]}</button>`}).join("")}
          </div>

          

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","clear","cloudy","rain","storm","snow","fog"].map(s=>{const a={auto:"🌦️ Tự động",clear:"☀️ Nắng",cloudy:"⛅ Mây",rain:"🌧️ Mưa",storm:"⛈️ Giông",snow:"❄️ Tuyết",fog:"🌫️ Sương"};return`<button type="button" data-weather="${s}" data-active="${n.settings.weatherOverride===s}" aria-pressed="${n.settings.weatherOverride===s}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[s]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${o}" aria-pressed="${o}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!o}" aria-pressed="${!o}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
          </div>

          <div style="font-size:12px;font-weight:800;margin-top:10px;margin-bottom:5px;color:#78350f;">✨ Engine Đồ Hoạ (Bản đồ chính)</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["webgl2","canvas"].map(s=>{const a=n.settings.rendererMode??"webgl2";return`<button type="button" data-renderer-mode="${s}" data-active="${a===s}" aria-pressed="${a===s}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${{webgl2:"✨ Engine Mới (WebGL2 2.5D HDR)",canvas:"🎨 Cổ Điển (Canvas 2D)"}[s]}</button>`}).join("")}
          </div>

          <div style="font-size:12px;font-weight:800;margin-top:10px;margin-bottom:5px;color:#78350f;">🎄 Giao Diện Giáng Sinh (Thung Lũng &amp; 7 Mini-Game)</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","on","off"].map(s=>{const a=n.settings.yuleThemeMode??"auto";return`<button type="button" data-yule-theme-mode="${s}" data-active="${a===s}" aria-pressed="${a===s}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${{auto:"🎄 Tự động (15/11–05/01)",on:"❄️ Luôn bật",off:"🌿 Tắt"}[s]}</button>`}).join("")}
          </div>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">📺 Nhạc Nền Trực Tiếp Từ YouTube (0 Băng Thông Máy Chủ)</div>
        <div style="font-size:11.5px;opacity:0.86;margin-bottom:8px;">
          Phát trực tiếp luồng nhạc từ CDN YouTube về trình duyệt người chơi, không tốn băng thông server của bạn.
        </div>
        <label class="switch-row" style="margin-bottom:8px;">
          <span>🎶 Bật nhạc nền YouTube trực tiếp</span>
          <input id="swYoutubeBgm" type="checkbox" switch ${n.settings.youtubeBgmEnabled?"checked":""} />
        </label>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
          ${Eo.map(s=>{const a=(n.settings.youtubeBgmUrl||bt).trim()===s.url;return`<button type="button" data-yt-preset="${A(s.url)}" data-active="${a}" aria-pressed="${a}" class="brass-btn" style="padding:4px 8px;font-size:11.5px;">${A(s.label)}</button>`}).join("")}
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <input
            id="inpYoutubeBgmUrl"
            type="url"
            value="${A(n.settings.youtubeBgmUrl||bt)}"
            placeholder="Dán link YouTube (watch?v=..., youtu.be/..., live/..., playlist...)"
            style="flex:1 1 220px;padding:6px 9px;border-radius:8px;border:1.5px solid var(--border-brass);background:var(--surface-chip-top);color:var(--ink);font-size:12px;"
          />
          <button id="btnApplyYoutubeBgm" type="button" class="brass-btn gold-cta" style="padding:6px 11px;font-size:12px;">
            ▶️ Phát Link
          </button>
        </div>
        <div id="lblYoutubeBgmStatus" style="font-size:11.5px;margin-top:6px;font-weight:700;color:var(--ink-soft);">
          ${A(e.youtubeBgm?.getStatusText()??"Đang tắt (dùng nhạc nền tích hợp sẵn)")}
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎚️ Bàn Trộn Âm Thanh 4 Kênh &amp; Tiếp Cận (A11y)</div>
        ${(()=>{const s=e.getEffectiveA11ySettings();return`
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
              ${[{key:"master",label:"🔊 Tổng (Master)"},{key:"music",label:"🎼 Nhạc nền"},{key:"sfx",label:"🔔 Hiệu ứng"},{key:"voice",label:"🗣️ Giọng đọc"}].map(r=>{const l=Math.round((s.volumes[r.key]??.85)*100);return`
                    <label class="aaa-slider-row">
                      <span>${r.label}</span>
                      <input type="range" min="0" max="100" value="${l}" data-vol-bus="${r.key}" />
                      <span data-vol-val="${r.key}">${l}%</span>
                    </label>
                  `}).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;font-weight:700;">🎨 Chế độ màu:</span>
              ${[["none","Mặc định"],["protanopia","Đỏ-Lục (P)"],["deuteranopia","Lục-Đỏ (D)"],["tritanopia","Xanh-Vàng (T)"]].map(([r,l])=>`<button type="button" data-cb-mode="${r}" data-active="${s.colorblindMode===r}" aria-pressed="${s.colorblindMode===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span style="font-size:12px;font-weight:700;">🔠 Cỡ chữ:</span>
              ${[100,125,150].map(r=>`<button type="button" data-font-scale="${r}" data-active="${s.fontScale===r}" aria-pressed="${s.fontScale===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${r}%</button>`).join("")}
              <label class="switch-row" style="margin-left:auto;gap:6px;">
                <span style="font-size:12px;">⚡ Tương phản cao</span>
                <input id="swHighContrast" type="checkbox" switch ${s.highContrast?"checked":""} />
              </label>
            </div>
          `})()}
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">📐 Kiến Trúc Sư Điền Trang (Bố Cục &amp; Cất Nhanh)</div>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((s,a)=>{const r=n.layoutPresets?.[s];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">${r?A(r.label):`Bản Vẽ #${a+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${r?`${r.placements.length} công trình đã lưu`:"Chưa lưu vị trí"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${s}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Lưu</button>
                    <button type="button" data-load-layout="${s}" ${r?"":"disabled"} class="brass-btn ${r?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📐 Áp dụng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn">📦 Cất Nhanh Trang Trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn gold-cta">
            🌸 Bày Lại Trang Trí (${Object.values(n.stashedDecorInventory??{}).reduce((s,a)=>s+a,0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${["slot_1","slot_2","slot_3"].map((s,a)=>{const r=Oa(s),l=!ms()&&!!(r.ok&&(r.state?.sandboxMode||r.state?.sandboxTainted)),i=!!(r.ok&&!l);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${a+1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${l?"Ô lưu thử nghiệm (Đã khóa)":r.ok&&r.meta?`${A(r.meta.parkName)} • Cấp ${r.meta.level}`:"Ô trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-slot="${s}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Ghi</button>
                    <button type="button" data-load-slot="${s}" ${i?"":"disabled"} class="brass-btn ${i?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📂 Tải</button>
                  </div>
                </div>
              `}).join("")}
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🔮 Tiện Ích</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta">
            📖 Hướng Dẫn
          </button>
          
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            🌱 Chơi Lại
          </button>
        </div>
      </div>
    `,"switch"in HTMLInputElement.prototype||wt(()=>import("./vendor-d6FS5LaX.js").then(s=>s.i),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",s=>{n.settings.bgmEnabled=s.currentTarget.checked,e.sim.audio.bgmEnabled=n.settings.bgmEnabled,e.syncYouTubeBgm(),e.sim.saveToStorage()}),t.querySelector("#swYoutubeBgm")?.addEventListener("change",s=>{const a=s.currentTarget.checked,l=(t.querySelector("#inpYoutubeBgmUrl")?.value??n.settings.youtubeBgmUrl??bt).trim();if(a&&!Xn(l)){s.currentTarget.checked=!1,e.showToast("Link YouTube chưa hợp lệ — hãy dán link watch?v=..., youtu.be/... hoặc live/... nhé!","⚠️");return}if(n.settings.youtubeBgmEnabled=a,n.settings.youtubeBgmUrl=l||bt,a&&!n.settings.bgmEnabled){n.settings.bgmEnabled=!0,e.sim.audio.bgmEnabled=!0;const i=t.querySelector("#swBgm");i&&(i.checked=!0)}e.syncYouTubeBgm(),e.sim.saveToStorage(),Ee(e)}),t.querySelectorAll("[data-yt-preset]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.ytPreset||bt;n.settings.youtubeBgmUrl=a,n.settings.youtubeBgmEnabled=!0,n.settings.bgmEnabled||(n.settings.bgmEnabled=!0,e.sim.audio.bgmEnabled=!0),e.syncYouTubeBgm(),e.sim.saveToStorage(),e.showToast("🎶 Đã chuyển sang phát trực tiếp nhạc nền YouTube!","🎵"),Ee(e)})}),t.querySelector("#btnApplyYoutubeBgm")?.addEventListener("click",()=>{const a=(t.querySelector("#inpYoutubeBgmUrl")?.value??"").trim();if(!Xn(a)){e.showToast("Link YouTube chưa hợp lệ — hãy dán link watch?v=..., youtu.be/... hoặc playlist!","⚠️");return}n.settings.youtubeBgmUrl=a,n.settings.youtubeBgmEnabled=!0,n.settings.bgmEnabled||(n.settings.bgmEnabled=!0,e.sim.audio.bgmEnabled=!0),e.syncYouTubeBgm(),e.sim.saveToStorage(),e.showToast("🎶 Đang phát trực tiếp link nhạc YouTube đã chọn!","🎵"),Ee(e)}),t.querySelector("#swSfx")?.addEventListener("change",s=>{n.settings.soundEnabled=s.currentTarget.checked,e.sim.audio.enabled=n.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",s=>{n.settings.cutawayMode=s.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",s=>{n.settings.showGrid=s.currentTarget.checked,e.refreshAll()}),t.querySelectorAll("[data-time]").forEach(s=>{s.addEventListener("click",()=>{n.settings.timeOverride=s.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ee(e)})}),t.querySelectorAll("[data-weather]").forEach(s=>{s.addEventListener("click",()=>{n.settings.weatherOverride=s.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ee(e)})}),t.querySelectorAll("[data-toon]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.toon==="on";e.sprites?.setToonEnabled(a),typeof window<"u"&&window.dispatchEvent(new CustomEvent("hangsoc:toon-changed")),e.refreshAll(),Ee(e)})}),t.querySelectorAll("[data-renderer-mode]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.rendererMode;(a==="webgl2"||a==="canvas")&&(n.settings.rendererMode=a,e.sim.saveToStorage(),e.refreshAll(),Ee(e))})}),t.querySelectorAll("[data-yule-theme-mode]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.yuleThemeMode;(a==="auto"||a==="on"||a==="off")&&(n.settings.yuleThemeMode=a,typeof document<"u"&&(document.documentElement.dataset.yuleTheme=e.sim.isYuleVisualThemeActive()||e.sim.isWinterMainMapActive()?"true":"false"),e.sim.saveToStorage(),e.refreshAll(),Ee(e))})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),we(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(s=>{s.addEventListener("input",()=>{const a=s.dataset.volBus,r=Math.max(0,Math.min(1,Number(s.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[a]=r,n.a11ySettings=l;const i=t.querySelector(`[data-vol-val="${a}"]`);i&&(i.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(s=>{s.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.colorblindMode=s.dataset.cbMode,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ee(e)})}),t.querySelectorAll("[data-font-scale]").forEach(s=>{s.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.fontScale=Number(s.dataset.fontScale),n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ee(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",s=>{const a=e.getEffectiveA11ySettings();a.highContrast=s.currentTarget.checked,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.saveLayout,r=e.sim.saveLayoutPreset(a);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ee(e)})}),t.querySelectorAll("[data-load-layout]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.loadLayout,r=e.sim.applyLayoutPreset(a);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ee(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const s=e.sim.stashAllDecorItems();e.showToast(s.msg,s.ok?"📦":"⚠️"),e.refreshAll(),Ee(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const s=e.sim.restoreAllStashedDecor();e.showToast(s.msg,s.ok?"🌸":"⚠️"),e.refreshAll(),Ee(e)}),t.querySelectorAll("[data-save-slot]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(a);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ee(e)})}),t.querySelectorAll("[data-load-slot]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(a);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function br(e,t,n){t&&(e.activeSuitcaseTab=t),n&&(e.selectedSuitcaseHabitatUid=n),Pe(e);const o=e.root.querySelector("#suitcaseDialog");o.open||o.showModal()}function yr(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const n=e.sim.getSuitcaseReadySummary();n.badgeCount>0?(t.textContent=String(n.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function vr(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=Date.now(),o=e.sim.state.suitcase,s=!!(o.activeIncubation&&n>=o.activeIncubation.endsAt),a=!!(o.activeExpedition&&n>=o.activeExpedition.endsAt);if((s!==e.lastSuitcaseIncReady||a!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){Pe(e);return}if(o.activeIncubation&&n<o.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((o.activeIncubation.endsAt-n)/1e3)),l=Math.max(1e3,o.activeIncubation.endsAt-o.activeIncubation.startedAt),i=Math.min(100,Math.round((n-o.activeIncubation.startedAt)/l*100)),p=t.querySelector("[data-suitcase-inc-left]");p&&(p.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-inc-prog]");c&&(c.value=i)}if(o.activeExpedition&&n<o.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((o.activeExpedition.endsAt-n)/1e3)),l=Math.max(1e3,o.activeExpedition.endsAt-o.activeExpedition.startedAt),i=Math.min(100,Math.round((n-o.activeExpedition.startedAt)/l*100)),p=t.querySelector("[data-suitcase-exp-left]");p&&(p.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-exp-prog]");c&&(c.value=i)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((cs-(n-(r.lastGroomedAt??0)))/1e3)),i=Math.max(0,Math.ceil((ds-(n-(r.lastTrainedAt??0)))/1e3)),p=t.querySelector("#btnScGroom");p&&(p.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const c=t.querySelector("#btnScTrain");c&&(c.textContent=i>0?`🎾 (${i}s)`:"🎾 Tập (20G • +45💝)")}}}function Pe(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=e.sim.state,o=n.suitcase,s=Date.now(),a=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!a.some($=>$.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=a[0]?.building.uid??null);const r=new Set(o.discoveredMorphs),l=En.length*3,i=r.size,p=ya(i),c=n.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(o.activeIncubation&&s>=o.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(o.activeExpedition&&s>=o.activeExpedition.endsAt);const d=o.activeIncubation?s>=o.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",g=o.activeExpedition?s>=o.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${i}/${l}`,y=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${a.length}</strong></span>
        <span>📖 <strong>${i}/${l}</strong> (+${p}%)</span>
        <span>✨ <strong>${n.sandboxMode?"∞":c}</strong> • ⏳ <strong>${n.sandboxMode?"∞":n.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${e.activeSuitcaseTab==="care"}" aria-pressed="${e.activeSuitcaseTab==="care"}" class="brass-btn">
          🐾 Chăm Sóc (${a.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${e.activeSuitcaseTab==="morph"}" aria-pressed="${e.activeSuitcaseTab==="morph"}" class="brass-btn">
          🧬 Ấp Trứng (${d})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${e.activeSuitcaseTab==="expedition"}" aria-pressed="${e.activeSuitcaseTab==="expedition"}" class="brass-btn">
          🧭 Thám Hiểm (${g})
        </button>
      </div>
    `;let C="";if(e.activeSuitcaseTab==="care")if(a.length===0)C=`
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;else{const $=a.find(B=>B.building.uid===e.selectedSuitcaseHabitatUid)??a[0],k=$.building,f=$.item,h=nn(f.id)??En[0],S=k.creatureMorph??"normal",E=Ke[S],x=k.creatureBondLevel??1,M=k.creatureBondXp??0,R=x>=Ft?100:va(x),V=x>=Ft?100:M,P=Math.round((Ci(x)-1)*100),W=k.creatureNickname||f.creatureName||f.name,D=e.sim.getBuildingProductionPerCycle(k,f),Y=e.sim.biomeCache.get(k.uid),Z=Math.round(k.creatureHunger??90),ie=Math.max(8,Math.round(f.cost*.04)),N=n.sandboxMode?0:Math.max(0,Math.ceil((cs-(s-(k.lastGroomedAt??0)))/1e3)),q=n.sandboxMode?0:Math.max(0,Math.ceil((ds-(s-(k.lastTrainedAt??0)))/1e3)),_=o.activeExpedition?.habitatUid===k.uid;C=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${a.map(({building:B,item:j})=>{const oe=nn(j.id),le=B.creatureMorph??"normal",re=Ke[le],be=B.creatureNickname||j.creatureName||j.name,de=B.uid===k.uid;return`
                  <button type="button" data-select-pet="${A(B.uid)}" aria-pressed="${de}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${oe?.beastSpriteKey??j.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${re.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${A(be)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${B.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${h.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${A(h.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${S==="radiant"?"radiant":S==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${E.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${A(W)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${h.beastSpriteKey}.png"
                  alt="${A(W)}"
                  class="suitcase-diorama-img"
                  style="filter:${E.cssFilter} drop-shadow(0 0 18px ${E.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${h.emoji} ${A(W)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${A(h.morphNames[S])}${_?" • 🧭":""}
                </div>
              </div>
            </div>

            <div class="suitcase-care-details">
              <form id="formSuitcaseRename" class="suitcase-rename-form">
                <label for="inpSuitcasePetName" style="font-size:12.5px;font-weight:800;color:#5c2d0c;">
                  🏷️
                </label>
                <input
                  id="inpSuitcasePetName"
                  name="petName"
                  type="text"
                  maxlength="28"
                  enterkeyhint="done"
                  autocomplete="off"
                  class="suitcase-name-input"
                  placeholder="${A(f.creatureName??f.name)}"
                  value="${A(k.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${x}/${Ft} (+${P}%)</span>
                  <span style="color:#b45309;">${x>=Ft?"MAX":`${M}/${R}`}</span>
                </div>
                <progress max="${R}" value="${V}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${A(h.favoriteTreat)} • <strong>+${D.galleons.toLocaleString("vi-VN")}🪙 / ${Ae(f.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${Z}%</span>
                  <span>🌿 ${Y?.score??60}% ${k.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${Z}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${n.sandboxMode?"0G":`${ie}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${N===0?"gold-cta":""}">
                  ${N>0?`🪮 (${N}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${q>0?`🎾 (${q}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const $=o.activeIncubation;let k="";if($){const h=ne($.itemId),S=nn($.itemId),E=s>=$.endsAt,x=Math.max(0,Math.ceil(($.endsAt-s)/1e3)),M=Math.max(1e3,$.endsAt-$.startedAt),R=E?100:Math.min(100,Math.round((s-$.startedAt)/M*100));k=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${A(S?.speciesName??h?.name??"Trứng")}
                ${$.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${E?"✨ Nở!":`${x}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${R}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${E?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else k=`
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(n.sandboxMode||c>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const f=a.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${a.map(({building:h,item:S})=>{const E=nn(S.id),x=h.creatureMorph??"normal",M=e.sim.getMorphIncubationCost(S),R=h.creatureNickname||S.creatureName||S.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${E?.beastSpriteKey??S.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Ke[x].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${A(R)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Ke[x].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(V=>{const P=r.has(`${S.id}:${V}`);return`<span class="morph-pill ${P?V==="radiant"?"radiant":V==="mystic"?"mystic":"":"locked"}">${P?Ke[V].badge:`🔒 ${Ke[V].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${A(h.uid)}"
                        class="brass-btn ${$?"":"gold-cta"}"
                        ${$?"disabled":""}
                      >
                        ${$?"🥚 Đang ấp":`🥚 Ấp (${n.sandboxMode?"0G":`${M}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;C=`${k}${f}`}else{const $=o.activeExpedition;let k="";if($){const h=Pn.find(W=>W.id===$.expeditionId)??Pn[0],S=n.buildings.find(W=>W.uid===$.habitatUid),E=S?ne(S.itemId):void 0,x=S?.creatureNickname||E?.creatureName||"Thú cưng",M=s>=$.endsAt,R=Math.max(0,Math.ceil(($.endsAt-s)/1e3)),V=Math.max(1e3,$.endsAt-$.startedAt),P=M?100:Math.min(100,Math.round((s-$.startedAt)/V*100));k=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${h.emoji} ${A(x)} • ${A(h.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${M?"🎒 Đã về!":`${R}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${P}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${M?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(a.length===0)k=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const S=(a.find(x=>x.building.uid===e.selectedSuitcaseHabitatUid)??a[0]).building,E=Ci(S.creatureBondLevel??1)*Ke[S.creatureMorph??"normal"].incomeMult;k=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${a.map(({building:x,item:M})=>{const R=x.creatureNickname||M.creatureName||M.name,V=Ke[x.creatureMorph??"normal"].shortLabel;return`<option value="${A(x.uid)}" ${x.uid===S.uid?"selected":""}>${A(R)} (💝Lv.${x.creatureBondLevel??1} • ${V})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${Pn.map(x=>{const M=!n.sandboxMode&&n.level<x.minParkLevel,R=Math.round(x.baseGold*E),V=Math.round(x.baseXp*E),P=(S.creatureBondLevel??1)>=5?1:0,W=x.guaranteedIngredients.map(D=>`+${D.qty+P} ${jt[D.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${x.emoji} ${A(x.name)} <span style="font-size:11.5px;color:#78350f;">(${x.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${R}🪙 • +${V}⭐ • ${W}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${x.id}"
                    class="brass-btn ${M?"":"gold-cta"}"
                    ${M?"disabled":""}
                  >
                    ${M?`🔒 Lv.${x.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const f=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${i}/${l})</span>
            <span style="color:#15803d;">+${p}%</span>
          </div>
          <progress max="${l}" value="${i}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${En.map(h=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${h.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${h.emoji} ${A(h.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(S=>{const E=r.has(`${h.habitatItemId}:${S}`);return`<span class="morph-pill ${E?S==="radiant"?"radiant":S==="mystic"?"mystic":"":"locked"}">${E?Ke[S].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;C=`${k}${f}`}t.innerHTML=`${y}${C}`,t.querySelectorAll("[data-sc-tab]").forEach($=>{$.addEventListener("click",()=>{e.activeSuitcaseTab=$.dataset.scTab,Pe(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach($=>{$.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=$.dataset.selectPet??null,Pe(e)})});const u=t.querySelector("#formSuitcaseRename"),m=t.querySelector("#inpSuitcasePetName");if(m&&m.addEventListener("keydown",$=>{$.isComposing||$.stopPropagation()}),u&&m&&e.selectedSuitcaseHabitatUid){const $=e.selectedSuitcaseHabitatUid;u.addEventListener("submit",k=>{k.preventDefault();const f=e.sim.renameCreature($,m.value);e.showToast(f.msg,"🏷️"),Pe(e)})}if(e.selectedSuitcaseHabitatUid){const $=e.selectedSuitcaseHabitatUid,k=()=>{const f=e.sim.groomCreature($);e.showToast(f.msg,f.ok?"🪮":"⏳"),Pe(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",k),t.querySelector("#btnScGroom")?.addEventListener("click",k),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature($),Pe(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const f=e.sim.trainCreatureTrick($);e.showToast(f.msg,f.ok?"🎾":"🪙"),Pe(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const f=n.buildings.find(h=>h.uid===$);f&&(e.root.querySelector("#suitcaseDialog").close(),we(e.cam,f.gx+1,f.gy+1),e.inspectSelection={kind:"building",uid:f.uid},e.renderInspector())})}const T=t.querySelector("#chkScStarlight");T&&T.addEventListener("change",()=>{e.useStarlightForIncubation=T.checked}),t.querySelectorAll("[data-incubate-uid]").forEach($=>{$.addEventListener("click",()=>{const k=$.dataset.incubateUid,f=e.useStarlightForIncubation&&(n.sandboxMode||(n.supply.ingredients.starlight_dust??0)>=1),h=e.sim.startMorphIncubation(k,f);e.showToast(h.msg,h.ok?"🥚":"⚠️"),Pe(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const $=e.sim.speedUpIncubationWithSand();e.showToast($.msg,$.ok?"⏳":"⚠️"),Pe(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),Pe(e)});const L=t.querySelector("#selScExpPet");L&&L.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=L.value,Pe(e)}),t.querySelectorAll("[data-start-exp]").forEach($=>{$.addEventListener("click",()=>{const k=$.dataset.startExp,f=e.selectedSuitcaseHabitatUid??a[0]?.building.uid;if(!f)return;const h=e.sim.startSuitcaseExpedition(f,k);e.showToast(h.msg,h.ok?"🧭":"⚠️"),Pe(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const $=e.sim.speedUpExpeditionWithSand();e.showToast($.msg,$.ok?"⏳":"⚠️"),Pe(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),Pe(e)})}const Sr="/api/track",wr=25,xr=3e4;class Tr{constructor(t={}){v(this,"endpoint");v(this,"batchSize");v(this,"batchIntervalMs");v(this,"queue",[]);v(this,"timer",null);v(this,"lastLevel",null);v(this,"isFlushing",!1);v(this,"isInitialized",!1);this.endpoint=t.endpoint||Sr,this.batchSize=t.batchSize||wr,this.batchIntervalMs=t.batchIntervalMs||xr}track(t,n){const o={id:this.generateEventId(),name:t,props:n?{...n}:void 0,timestamp:Date.now()};this.queue.push(o),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const n=this.queue.splice(0,this.queue.length);if(n.length===0)return;const o={events:n,sentAt:Date.now()},s=JSON.stringify(o),a=jn(this.endpoint);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const r=new Blob([s],{type:"application/json"});if(navigator.sendBeacon(a,r))return}catch{}this.isFlushing=!0;try{await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:s,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",n=>{this.handleGameTick(n)}),window.addEventListener("gamesave:uploaded",n=>{const o=n;this.track("save_uploaded",o.detail||{})});else if(t){const n=t.onUploadSuccess;t.onUploadSuccess=o=>{if(n)try{n(o)}catch{}this.track("save_uploaded",o)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",n="unknown",o="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,n=navigator.language||"vi",o=navigator.userAgent||""),this.track("session_start",{screen:t,language:n,userAgent:o,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const o=t.detail;o&&(this.track("game:tick",{level:o.level,galleons:o.galleons}),typeof o.level=="number"&&(this.lastLevel!==null&&o.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:o.level}),this.lastLevel=o.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}const $r=/^(?:burrow-ticket|hpvn-ticket|ticket|token|id_token|idtoken|access_token|auth|secret|key)$/i;function Jn(e){return e?e.replace(/((?:#|[?&])(?:burrow-ticket|hpvn-ticket|ticket|token|id_token|idtoken|access_token)=)[^&#\s'")]+/gi,"$1[REDACTED]"):""}function Cr(e){if(!e)return"";const t=e.split("#")[0]??"";try{const n=typeof window<"u"&&window.location?.origin?window.location.origin:"https://hangsoc.local",o=new URL(t,n);o.hash="";for(const a of Array.from(o.searchParams.keys()))$r.test(a)&&o.searchParams.delete(a);if(/^https?:\/\//i.test(t))return o.toString();const s=o.searchParams.toString();return`${o.pathname}${s?`?${s}`:""}`}catch{return Jn(t)}}class kr{constructor(t,n={}){v(this,"analytics");v(this,"maxErrorsPerSession");v(this,"isListening",!1);v(this,"seenSignatures",new Set);v(this,"errorCountThisSession",0);v(this,"handleError",t=>{const n=t.message||(t.error?String(t.error):"Uncaught runtime error"),o=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",s=t.filename||(typeof window<"u"?window.location.href:""),a={msg:n,stack:o,url:s,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(a),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});v(this,"handleUnhandledRejection",t=>{const n=t.reason,o=n instanceof Error,s=o?n.message:n?String(n):"Unhandled promise rejection",a=o&&n.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:s,stack:a,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",n)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,n.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const n={...t,msg:Jn(t.msg),...t.stack?{stack:Jn(t.stack)}:{},...t.url?{url:Cr(t.url)}:{}},o=`${n.type||"err"}|${n.msg.slice(0,160)}|${n.line??0}|${n.col??0}`;if(!this.seenSignatures.has(o)){this.seenSignatures.add(o),this.errorCountThisSession+=1;try{this.analytics.track("error",n)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class Mr{constructor(){v(this,"buttonEl",null);v(this,"dialogEl",null);v(this,"activeTab","privacy");v(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
      <div class="legal-modal-inner">
        <header class="legal-modal-header">
          <div class="legal-title-group">
            <span class="legal-modal-icon">📜</span>
            <h2 class="legal-modal-title">Pháp Lý &amp; Bản Quyền</h2>
          </div>
          <button type="button" class="legal-close-btn" aria-label="Đóng hộp thoại">✕</button>
        </header>

        <nav class="legal-nav-tabs" role="tablist" aria-label="Danh mục pháp lý">
          <button type="button" class="legal-tab-btn" role="tab" data-tab="privacy" aria-selected="true" data-active="true">Quyền Riêng Tư</button>
          <button type="button" class="legal-tab-btn" role="tab" data-tab="terms" aria-selected="false" data-active="false">Điều Khoản</button>
          <button type="button" class="legal-tab-btn" role="tab" data-tab="copyright" aria-selected="false" data-active="false">Bản Quyền</button>
        </nav>

        <div class="legal-tab-content">
          <section class="legal-panel" data-panel="privacy" data-active="true" role="tabpanel">
            <h3 class="legal-heading">Chính Sách Quyền Riêng Tư (Privacy Policy)</h3>
            <p><strong>Trang Trại Hang Sóc</strong> cam kết tôn trọng tuyệt đối quyền riêng tư và quyền kiểm soát dữ liệu cá nhân của người chơi:</p>
            <ul class="legal-list">
              <li><strong>Lưu trữ cục bộ trên máy (Local Storage):</strong> Toàn bộ tiến trình game (bản đồ thung lũng, vụ mùa, kho nông sản, thành tích 777 màn Bùa Gặt Honeydukes và 4 môn Đại Sảnh Khảo Thí Hogwarts) được lưu trên trình duyệt của bạn qua khóa <code>burrow_hogsmeade_777_v3</code>.</li>
              <li><strong>Đồng bộ đám mây (Cloud Save):</strong> Tính năng lưu đám mây gửi dữ liệu tiến trình ẩn danh lên hệ thống để đồng bộ giữa các thiết bị. Chúng tôi <em>không</em> thu thập thông tin nhận dạng cá nhân (PII), họ tên, email hay số điện thoại.</li>
              <li><strong>Dữ liệu phân tích &amp; Giám sát lỗi:</strong> Các sự kiện vận hành (khởi động phiên chơi, thăng cấp độ, báo cáo mã lỗi) được thu thập ẩn danh nhằm mục đích duy nhất là cải thiện độ mượt và sửa lỗi trò chơi. Không có mã theo dõi quảng cáo của bên thứ ba.</li>
            </ul>
          </section>

          <section class="legal-panel" data-panel="terms" data-active="false" role="tabpanel" style="display: none;">
            <h3 class="legal-heading">Điều Khoản Dịch Vụ (Terms of Service)</h3>
            <p>Chào mừng bạn đến với thung lũng Hang Sóc &amp; Hogsmeade ấm cúng:</p>
            <ul class="legal-list">
              <li><strong>Mục đích trải nghiệm:</strong> Trò chơi được phát triển phục vụ giải trí thư giãn, rèn luyện tư duy chiến thuật (Bùa Gặt Honeydukes, Ngũ Ấn Đạo Tặc, Số Học Huyền Bí, Cờ Phù Thủy, Sinh Vật Huyền Bí) và hỗ trợ học ngoại ngữ tại Học Viện Thần Chú qua phương pháp lặp lại ngắt quãng SRS.</li>
              <li><strong>Hoàn toàn miễn phí:</strong> Trò chơi không áp dụng cơ chế Pay-to-Win hay bán lượt chơi. Toàn bộ 777 màn và các công trình đều có thể mở khóa thông qua Sao Phép Thuật tự kiếm được trong game.</li>
              <li><strong>Chơi Offline &amp; Ngoại tuyến:</strong> Trò chơi chạy hoàn toàn offline theo tiêu chuẩn Progressive Web App (PWA). Tiến trình sẽ tự động đồng bộ khi thiết bị kết nối mạng Internet.</li>
            </ul>
          </section>

          <section class="legal-panel" data-panel="copyright" data-active="false" role="tabpanel" style="display: none;">
            <h3 class="legal-heading">Bản Quyền &amp; Tri Ân Tác Quyền (Credits)</h3>
            <p>Dự án tri ân người hâm mộ (Fan-Made Tribute):</p>
            <ul class="legal-list">
              <li><strong>Quyền sở hữu Thế Giới Phù Thủy:</strong> Tên địa danh (Trang trại Hang Sóc The Burrow, Thung Lũng Hogsmeade, Trường Hogwarts), tên nhân vật và các thuật ngữ ma thuật liên quan thuộc bản quyền của tác giả J.K. Rowling và Warner Bros. Entertainment Inc. Trò chơi này là dự án phi thương mại vì đam mê sáng tạo cộng đồng.</li>
              <li><strong>Mã nguồn &amp; Thiết kế:</strong> Thuật toán đồ họa 2.5D Canvas Plinth-Free, hệ thống xưởng nông trại Township và 5 engine giải đố được đội ngũ phát triển xây dựng hoàn chỉnh.</li>
              <li><strong>Âm nhạc &amp; Hiệu ứng:</strong> 5 bản nhạc nền giao hưởng không lời thích ứng thời tiết &amp; ngày đêm (Ngày / Đêm / Lễ hội / Mưa / Bão) cùng bộ hiệu ứng âm thanh vật lý Acoustic SFX Atlas và Web Audio API.</li>
            </ul>
          </section>
        </div>

        <footer class="legal-modal-footer">
          <span class="legal-version-tag">Hang Sóc Online • PWA 2026</span>
          <button type="button" class="legal-confirm-btn">Đã Hiểu</button>
        </footer>
      </div>
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const n=this.dialogEl.querySelector(".legal-confirm-btn");n&&n.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",s=>{s.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-tab");a&&this.switchTab(a)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(s=>{const a=s.getAttribute("data-tab")===t;s.setAttribute("aria-selected",a?"true":"false"),s.setAttribute("data-active",a?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(s=>{const a=s.getAttribute("data-panel")===t;s.setAttribute("data-active",a?"true":"false"),s.style.display=a?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}function Ar(e){_a({fetchLeaderboards:async t=>{const n=await e.getLeaderboard(t);return vn(n.leaderboards),n.leaderboards??null},submitLeaderboard:async t=>{const n=await e.submitLeaderboard(t);return vn(n.leaderboards),n.leaderboards??null}})}class Lr{constructor(){v(this,"cloudSave");v(this,"analytics");v(this,"errorMonitor");v(this,"legalModal");v(this,"authoritativeClient");v(this,"hpvnBridge");v(this,"isInitialized",!1);v(this,"lastAuthoritativeWalletBalance",null);v(this,"walletSyncTimer",null);v(this,"isApplyingServerWallet",!1);v(this,"boundSim",null);this.cloudSave=new za,this.analytics=new Tr,this.errorMonitor=new kr(this.analytics),this.legalModal=new Mr,this.authoritativeClient=Hs(),this.hpvnBridge=ar({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(hs):null;if(!t)return{};const n=JSON.parse(t),o=n.match3&&typeof n.match3=="object"?n.match3:null,s=n.settings&&typeof n.settings=="object"?n.settings:null;return{version:Number(n.version||3),parkName:String(n.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(n.level)||1)),xp:Math.max(0,Math.floor(Number(n.xp)||0)),magicStars:Math.max(0,Math.floor(Number(o?.stars??n.magicStars)||0)),unlockedZonesCount:Array.isArray(n.unlockedZones)?n.unlockedZones.length:1,buildingsCount:Array.isArray(n.buildings)?n.buildings.length:0,weatherMode:String(s?.weatherOverride||n.weatherMode||"auto"),atmosphereMode:String(s?.timeOverride||n.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount();const t=!!(typeof window<"u"&&hi(window.location));t||this.cloudSave.init(),Ar(this.authoritativeClient),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",n=>{const o=n.detail;o&&typeof o=="object"&&this.hpvnBridge.syncState(o)}),window.addEventListener("hpvn:share-floo",n=>{const o=n.detail??{};this.hpvnBridge.shareToFloo({...o,sendToFloo:o.sendToFloo??(async(s,a)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const r=await this.authoritativeClient.host("floo-share",{text:s,...a.image?{image:a.image}:{},...a.tourId?{tourId:a.tourId}:{}});return!!(r&&typeof r=="object"&&r.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",n=>{const o=n.detail;o?.hostUid&&this.authoritativeClient.visit({hostUid:o.hostUid,help:!0,buildingUid:o.buildingUid,kind:o.kind||"water_crop",noteText:o.noteText,helperName:o.helperName,helperEmoji:o.helperEmoji}).catch(()=>{})})),typeof navigator>"u"||navigator.onLine?this.authoritativeClient.read().then(n=>{if(vn(n.leaderboards),n.wallet&&typeof n.wallet.spendable=="number"&&this.syncWalletBaseline(n.wallet.spendable),typeof n.uid=="string"&&n.uid){const o=this.cloudSave.getUserId(),s=li(n.uid);t?this.cloudSave.init():s!==o&&Fa(s).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}else t&&this.cloudSave.init();typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:n}))}).catch(()=>{t&&this.cloudSave.init()}):t&&this.cloudSave.init(),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,n={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const o=t.saveToStorage.bind(t),s=Math.max(0,n.debounceMs??180),a=i=>{const p=Math.max(0,Math.floor(i));this.syncWalletBaseline(p),this.isApplyingServerWallet=!0;try{const c=t.homeStateWhileVisiting??t.state;!c.sandboxMode&&!c.sandboxTainted&&(c.galleons=p,t.homeStateWhileVisiting&&(t.state.galleons=p),o(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const i=t.homeStateWhileVisiting??t.state;if(i.sandboxMode||i.sandboxTainted||t.isHeadmasterPreview)return;const p=Math.max(0,Math.floor(Number(i.galleons)||0)),c=p-this.lastAuthoritativeWalletBalance;if(c===0)return;const d=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=p;const g=c<0?"debit":"credit";let y=Math.abs(c);const C=g==="credit"?1e3:5e4;try{let u=null;for(;y>0;){const m=Math.min(y,C);y-=m,u=await this.authoritativeClient.settleWallet({direction:g,amount:m,reasonCode:g==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:g==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(i.level)||1))})}u?.wallet&&typeof u.wallet.spendable=="number"&&(a(u.wallet.spendable),n.onSnapshot?.(u))}catch(u){const m=u;if(m?.definitive===!0){const T=Zn(m);n.onToast?.(`🏦 Gringotts HPVN: ${T.text}`,T.icon);const L=m.details?.spendable;typeof L=="number"&&Number.isFinite(L)?a(L):await this.authoritativeClient.read().then($=>{$.wallet&&typeof $.wallet.spendable=="number"&&a($.wallet.spendable)}).catch(()=>{a(d)})}else this.lastAuthoritativeWalletBalance=d}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const i=t.homeStateWhileVisiting??t.state;i.sandboxMode||i.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(i.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),s===0?r():this.walletSyncTimer=setTimeout(()=>{r()},s))};return t.saveToStorage=()=>{o(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=o,this.boundSim===t&&(this.boundSim=null)}}}const _e=new Lr;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{_e.init()},{once:!0}):_e.init());const hn={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},ei={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function fi(e){return e.sim.getPlayerHouse()}function Lt(e,t,n=""){const o=Ka(e),s=(t||"🧙").trim().slice(0,2);return o?`<span class="floo-avatar-shell ${n}"><img src="${A(o)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${A(s)}</span></span>`:`<span class="floo-avatar-shell ${n}"><span class="floo-avatar-fallback">${A(s)}</span></span>`}function Ns(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function fn(e){const t=e.sim.ensureNeighborSocial(),n=fi(e),o=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:o,level:e.sim.state.level,house:n,keeperTitle:as(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function bi(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),ye(e),e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}const Ji=new Set;function Os(e,t){if(!t||typeof t!="object")return;const n=t,o=e.sim.ensureNeighborSocial(),s=e.sim.homeStateWhileVisiting??e.sim.state;let a=!1;typeof n.uid=="string"&&n.uid.trim()&&li(n.uid),vn(n.leaderboards)&&(a=!0);const r=typeof n.garden?.progression?.friendCode=="string"&&n.garden.progression.friendCode.trim()||(n.profile&&typeof n.profile=="object"&&typeof n.profile.friendCode=="string"?String(n.profile.friendCode).trim():"");if(r&&o.playerFriendCode!==r&&(o.playerFriendCode=r,a=!0),n.wallet&&typeof n.wallet.spendable=="number"&&Number.isFinite(n.wallet.spendable)){const d=Math.max(0,Math.floor(n.wallet.spendable));if(_e.syncWalletBaseline(d),!s.sandboxMode&&!s.sandboxTainted&&!e.sim.isHeadmasterPreview){const g=!!n.receipt,y=Va(s);(g||y||d>=s.galleons)&&s.galleons!==d&&(s.galleons=d,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=d),a=!0)}}const l=n.profile&&typeof n.profile=="object"?n.profile:null,i=Ua(l?.house??n.garden?.progression?.house),p=String(l?.houseSource??n.garden?.progression?.houseSource??"");if(i){const d=p==="hpvn",g=s.minigameLeaderboard;(d||!g?.playerHouseExplicit)&&(g?.playerHouse!==i||!!g?.playerHouseLockedByServer!==d)&&(Ni(s,i,{lockedByServer:d}),e.sim.homeStateWhileVisiting&&Ni(e.sim.state,i,{lockedByServer:d}),a=!0)}if(l){const d=typeof l.username=="string"?l.username.trim():"";d&&d!=="Phù Thủy Hang Sóc"&&d!=="Trang Trại Hang Sóc"&&!o.playerDisplayName&&(o.playerDisplayName=d,a=!0);const g=typeof l.avatarUrl=="string"?l.avatarUrl.trim():"";g&&o.playerAvatarUrl!==g&&(o.playerAvatarUrl=g,a=!0)}if(typeof n.uid=="string"&&n.uid.trim()&&!Ji.has(n.uid)&&!s.sandboxMode&&!s.sandboxTainted&&!e.sim.isHeadmasterPreview){Ji.add(n.uid);const d=Math.max(0,s.match3?.maxClearedLevel??Math.max(0,(s.match3?.currentLevel??1)-1)),g=Math.max(0,s.puzzleArcade?.sudokuCleared??0),y=Math.max(0,s.puzzleArcade?.blockCleared??0),C=Math.max(0,s.puzzleArcade?.jigsawCleared??0);(d>0||g>0||y>0||C>0)&&ps(s).catch(()=>{})}const c=n.daily&&typeof n.daily=="object"?n.daily:null;if(c&&typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ge,Math.floor(c.helpsLeft)));const d=Math.max(0,Ge-e.flooHelpsLeft);d>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=d,a=!0)}if(Array.isArray(n.helpers)&&n.helpers.length>0){e.flooHelpersToday=n.helpers.map(g=>({uid:String(g.uid||""),name:String(g.name||"Bạn HPVN"),avatarEmoji:g.avatarEmoji,avatarUrl:g.avatarUrl,at:Number(g.at||0)}));const d=Wa(e.flooHelpersToday,o.lastSeenHelperAt??0);d&&d.textVi&&d.seenAt>(o.lastSeenHelperAt??0)&&(o.lastSeenHelperAt=d.seenAt,a=!0,e.showToast(d.textVi,"🤝"))}if(n.houseCup&&typeof n.houseCup=="object"){const d=n.houseCup,g=d.houses&&typeof d.houses=="object"?d.houses:null;g&&typeof d.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:d.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(g.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(g.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(g.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(g.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(d.memberTodayPoints)||0)),updatedAt:Date.now()},a=!0)}a&&(e.sim.saveToStorage(),e.refreshAll())}async function Yt(e,t=!1){if(e.flooLoading)return;const n=Date.now();if(!t&&e.flooLastLoadedAt>0&&n-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const o=e.sim.ensureNeighborSocial(),s=fi(e),a=o.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;if(r||Ga(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r){const c=e.sim.state.minigameLeaderboard,d=!!c?.playerHouseExplicit&&!c?.playerHouseLockedByServer;await _e.authoritativeClient.syncProfile({playerName:a,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:o.playerAvatarUrl||"",avatarEmoji:ei[s],...d?{house:s,houseExplicit:!0}:{},level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(g=>Os(e,g)).catch(()=>{})}const l=await _e.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ge,Math.floor(l.helpsLeft)));const c=Math.max(0,Ge-e.flooHelpsLeft);c>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=c)}const i=Array.isArray(l.visits)?l.visits:[],p=un(i,Date.now());e.flooDirectoryRows=p,e.flooQueueRows.length===0&&(e.flooQueueRows=p),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(p,Kt())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&qe(e),e.renderVisitorDockBar()}}function ti(e){const t=fn(e),n=Kn(e.gameCanvas,t),o=Bs(n,.55),s=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:Kt(),image:o||void 0}})),s.rewarded&&e.showToast(s.msg,"🔥"),e.refreshAll()}function zs(e,t,n){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),n&&(e.focusedNeighborId=n),(e.sim.state.level>=ht||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Yt(e),qe(e);const s=e.root.querySelector("#neighborDialog");s&&!s.open&&s.showModal(),n&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${n}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function Fs(e,t){e.closeHudPopovers();const n=e.root.querySelector("#neighborDialog");n?.open&&n.close(),t.kind==="match3"?e.getMatch3Modal().then(o=>o.openRescue(t)):e.getPuzzleArcadeModal().then(o=>o.openRescue(t))}function $n(e,t){bi(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterHonorGardenTour(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),we(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function vt(e,t,n){const o=String(t||"").trim();if(!o)return;if(o.startsWith("tour_")){$n(e,o);return}n&&n.length>0?e.flooQueueRows=[...n]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),bi(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const a=o.startsWith("player_")?o:`player_${o}`,r=o.startsWith("player_")?o.slice(7):o;(async()=>{try{const i=await _e.authoritativeClient.visit({hostUid:r});typeof i.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Ge,Math.floor(i.helpsLeft))));const p=i.visit&&typeof i.visit=="object"?i.visit:null;if(p){const c=p.progression&&typeof p.progression=="object"?p.progression:void 0,d=Date.now(),g=Array.isArray(c?.timers)?c.timers.filter(T=>Number(T.readyAt||0)>d).length:0,y=p.decorations&&typeof p.decorations=="object"?p.decorations:void 0,C={uid:String(p.uid||r),friendCode:typeof p.friendCode=="string"?p.friendCode:void 0,username:String(p.username||"Thành Viên HPVN"),parkName:String(p.parkName||"Thung Lũng Phép Thuật"),house:p.house||"Gryffindor",avatarEmoji:typeof p.avatarEmoji=="string"?p.avatarEmoji:void 0,avatarUrl:typeof p.avatarUrl=="string"?p.avatarUrl:void 0,level:Math.max(1,Number(p.level||1)),growing:g,helped:!!p.helped,hostHelpsLeft:typeof p.hostHelpsLeft=="number"?p.hostHelpsLeft:10,fire:p.fire&&typeof p.fire=="object"?p.fire:null,scene:y?.scene},u=e.sim.syncFlooDirectoryMembers([C],Kt()),m=p.rawClientSave&&typeof p.rawClientSave=="object"?p.rawClientSave:null;if(u[0]&&m){if(Array.isArray(m.buildings)&&m.buildings.length>0){const T=m.buildings.filter(L=>L&&typeof L.itemId=="string"&&!!ne(L.itemId));T.length>0&&(u[0].valleyBuildings=T)}m.tileOverrides&&typeof m.tileOverrides=="object"&&(u[0].valleyTileOverrides=m.tileOverrides),Array.isArray(m.unlockedZones)&&m.unlockedZones.length>0&&(u[0].valleyUnlockedZones=m.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(a);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),we(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function _s(e,t){if(t.startsWith("tour_")){$n(e,t);return}bi(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterNeighborVisit(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),we(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Tn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),we(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const n=new URLSearchParams(window.location.search);if(n.has("visit")||n.has("tour")){n.delete("visit"),n.delete("tour");const o=n.toString();window.history.replaceState(null,"",`${window.location.pathname}${o?`?${o}`:""}${window.location.hash}`)}}e.refreshAll()}function Er(e){const t=e.sim.ensureNeighborSocial(),n=t.playerOwlHelpRequests.filter(p=>!!p.fulfilledAt).length,o=t.playerMinigameSos?.rescuedAt??0,s=!!t.playerMinigameSos?.claimed,a=`${t.lastSocialResetKey}|${t.friendshipTokens}|${n}|${o}|${s}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(a===e.lastSocialLiveSig)return;e.lastSocialLiveSig=a,Gs(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),i=document.activeElement?.id??"";l?.open&&i!=="inpFlooDisplayName"&&qe(e)}function Gs(e){const t=e.sim.ensureNeighborSocial(),n=Math.floor(t.friendshipTokens/ft),o=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,s=t.homeLanternMarks.length,a=n+o+s,l=Math.max(0,Gt-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(d=>d.minigameSos&&!d.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(d.id)).length:0,i=e.sim.state.level>=ht&&(t.dailyGardenHelpsCount??0)<Ge?e.flooDirectoryRows.filter(d=>Qt(d)).length:0,p=e.root.querySelector("#badgeNeighborCount");if(p){const d=a>0?a:l>0?l:i;d>0?(p.textContent=String(d),p.classList.toggle("is-ready-green",a>0),p.classList.remove("hidden")):p.classList.add("hidden")}const c=e.root.querySelector("#badgeManageNeighborCount");c&&(a>0?(c.textContent=String(a),c.classList.remove("hidden")):c.classList.add("hidden"))}function Pr(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.getActiveHonorGardenTour();if(n){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${A(n.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${A(n.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${n.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${A(n.ownerName)} · ${A(hn[n.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const f=e.sim.cycleHonorGardenTour(-1);f.ok&&typeof f.focusGx=="number"&&typeof f.focusGy=="number"&&(e.onCameraJump?.(),we(e.cam,f.focusGx,f.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const f=e.sim.cycleHonorGardenTour(1);f.ok&&typeof f.focusGx=="number"&&typeof f.focusGy=="number"&&(e.onCameraJump?.(),we(e.cam,f.focusGx,f.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{ti(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Tn(e)});return}const o=e.sim.getActiveVisitingNeighbor();if(!o){t.classList.add("hidden"),t.innerHTML="";return}const s=e.sim.ensureNeighborSocial(),a=Date.now(),r=Math.min(Ge,Math.max(s.dailyGardenHelpsCount??0,o.helpedViaFlooToday?1:o.helpedMarksToday.length)),l=Math.max(0,Ge-r),i=!!(o.helpedViaFlooToday||o.helpedMarksToday.length>0),p=(o.hostHelpsLeft??10)<=0,c=!!(o.fireUntilMs&&o.fireUntilMs>a),d=!i&&l>0&&!p,g=s.dailyLikedNeighborIds.includes(o.id),y=s.dailyMysteryClaimedIds.includes(o.id),C=o.owlHelpCrates.filter(f=>!f.fulfilledByPlayerToday).length,u=e.sim.canRescueNeighborMinigame(o.id).ok,m=C+(u?1:0),T=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,L=o.remoteUserId||o.id.replace(/^player_/,""),$=T.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${T.slice(0,12).map(f=>{const h=f.uid===L,S=Qt(f,a),E=!!(f.fire&&f.fire.until>a);return`
                <button
                  type="button"
                  class="floo-strip-dot ${h?"is-current":""} ${S?"is-helpable":""} ${E?"is-fire":""}"
                  data-floo-jump="${A(f.uid)}"
                  title="${A(f.username)} (Lv.${f.level})"
                >
                  ${Lt(f.avatarUrl,f.avatarEmoji||f.username,"floo-strip-avatar")}
                  ${E?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",k=i?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":p?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${$}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${Lt(o.avatarUrl,o.avatarEmoji||o.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${A(o.name)}</strong>
            <span class="visitor-lv-tag">Lv.${o.level}</span>
            ${c?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${Ge}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${s.friendshipTokens}/${ft}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${T.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${d?"gold-cta":""}" ${d?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${k}
        </button>
        ${c?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${g?"disabled":""} title="Thả tim khen vườn">
          ${g?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${y?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${y?"✓ Quà":"🎁 Quà"}
        </button>
        ${m>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${m})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,Ns(t),t.querySelectorAll("[data-floo-jump]").forEach(f=>{f.addEventListener("click",()=>{const h=f.dataset.flooJump;h&&h!==L&&vt(e,h,T)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const f=t.querySelector("#btnVisitorFlooHelp");f&&(f.disabled=!0);let h;if(o.remoteUserId)try{const x=ja(s.selectedPresetNoteId),M=await _e.authoritativeClient.visit({hostUid:o.remoteUserId,help:!0,kind:"water_crop",noteText:x.textVi});typeof M.helpsLeft=="number"&&(h=M.helpsLeft,e.flooHelpsLeft=M.helpsLeft)}catch(x){const M=Zn(x);if(M.reason==="already-helped"||M.reason==="daily-help-cap"||M.reason==="host-help-cap"){e.showToast(`${M.icon} ${M.text}`,M.icon),Yt(e,!0),e.refreshAll();return}}const S=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:h});if(!S.ok){e.showToast(S.msg,"🤝"),e.refreshAll();return}const E=x=>x.map(M=>M.uid===L?{...M,helped:!0}:M);if(e.flooDirectoryRows=E(e.flooDirectoryRows),e.flooQueueRows=E(e.flooQueueRows),e.refreshAll(),S.helpsLeft>0&&e.flooQueueRows.length>1){const x=In(e.flooQueueRows,L,1);x&&x.uid!==L&&Qt(x)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===o.id&&vt(e,x.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const f=t.querySelector("#btnVisitorExtinguish");f&&(f.disabled=!0);try{let h=0;if(o.remoteUserId){const E=await _e.authoritativeClient.fireOut({hostUid:o.remoteUserId});h=Math.max(0,Math.floor(Number(E?.price||0)))}if(h>0){const E=e.sim.homeStateWhileVisiting??e.sim.state;E.galleons=Math.max(0,E.galleons-h),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=E.galleons)}o.fireUntilMs=0;const S=E=>E.map(x=>x.uid===L?{...x,fire:null}:x);e.flooDirectoryRows=S(e.flooDirectoryRows),e.flooQueueRows=S(e.flooQueueRows),e.showToast(h>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name} (-${h} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(h){const S=Zn(h);e.showToast(`${S.icon} ${S.text}`,S.icon),f&&(f.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const f=e.sim.likeVisitedNeighborFarm();f.ok||e.showToast(f.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{y||(e.rideCamUid=null,e.onCameraJump?.(),we(e.cam,o.mysteryGiftGx+.5,o.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{zs(e,"friends",o.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const f=In(T,L,-1);f&&f.uid!==L&&vt(e,f.uid,T)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(T.length>1){const h=In(T,L,1);if(h&&h.uid!==L){vt(e,h.uid,T);return}}const f=e.sim.cycleNextNeighborVisit();f.ok&&typeof f.focusGx=="number"&&typeof f.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),we(e.cam,f.focusGx,f.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Tn(e)})}function qe(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const n=e.sim.ensureNeighborSocial(),o=e.sim.getActiveVisitingNeighbor(),s=e.sim.getActiveHonorGardenTour(),a=Date.now(),r=fi(e),l=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",i=Math.min(Ge,Math.max(0,n.dailyGardenHelpsCount??0)),p=Math.max(0,Ge-i),c=Math.max(0,Gt-n.dailyRescuesGivenIds.length),d=Math.max(0,Gt-n.dailyRescuesReceivedCount),g=Math.max(0,pn-n.dailyOwlHelpRequestedCount),y=n.friendshipTokens>=ft,C=Math.min(100,Math.round(n.friendshipTokens/ft*100)),u=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,m=e.sim.state.level>=ht||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,T=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${n.friendshipTokens}/${ft}</strong>
        ${y?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${p}/${Ge}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${c}/${Gt}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${g}/${pn}</strong></span>
      </div>
    </div>
  `,L=`
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        🖼️ Bưu Thiếp ${n.dailyFlooShareClaimed?"":"(!)"}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        🎁 Rương &amp; SOS ${y||u?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${n.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let $="";if(e.activeNeighborTab==="friends"){const S=[];if(u?.rescuedAt){const R=Bn(u.kind);S.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${A(u.rescuerEmoji??"🦉")} ${A(u.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${R.icon} Màn ${u.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(u){const R=Bn(u.kind);S.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${R.icon} Màn ${u.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}n.homeLanternMarks.length>0&&S.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${n.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${n.homeLanternMarks.length}🍀)</button>
        </div>
      `);const E=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${Lt(n.playerAvatarUrl,ei[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${hn[r]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${A(l)}"
                placeholder="Biệt danh phù thủy của bạn"
                autocomplete="off"
              />
              <button type="submit" class="brass-btn nb-mini-cta">Lưu tên</button>
            </form>
          </div>
        </div>
        <div class="floo-identity-ctas">
          <button id="btnFlooOpenPostcardTab" type="button" class="brass-btn">🖼️ Bưu Thiếp</button>
          <button id="btnFlooQuickInvite" type="button" class="brass-btn gold-cta">
            🔥 Rủ Bạn Trên Mạng Floo ${n.dailyFlooShareClaimed?"":"(+10G)"}
          </button>
        </div>
      </section>
    `;let x="";if(m){const R=un(e.flooDirectoryRows,a),V=R.filter(N=>Qt(N,a)).length,P=[...e.flooHelpersToday,...n.homeLanternMarks.map(N=>({uid:N.helperId,name:N.helperName,avatarEmoji:N.helperEmoji,avatarUrl:N.helperAvatarUrl,at:N.createdAt}))],W=Array.from(new Map(P.map(N=>[N.uid||N.name,N])).values()),D=W.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${W.slice(0,6).map(N=>Lt(N.avatarUrl,N.avatarEmoji||N.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${A(Qa(W))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${W.length*15} phút</strong>!
              </div>
            </div>
          `:"",Y=R.length>0?`
            <div class="floo-portal-grid" role="list">
              ${R.map(N=>{const q=!!(N.fire&&N.fire.until>a),_=Qt(N,a),ee=o?.remoteUserId===N.uid||o?.id===`player_${N.uid}`,B=q?"🔥 Đang cháy · cần dập!":N.helped?"✓ Đã chăm giúp":N.growing>0?`🌱 ${N.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${q?"is-fire":""} ${_?"is-helpable":""} ${N.helped?"is-helped":""} ${ee?"is-visiting":""}"
                      data-floo-portal="${A(N.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${Lt(N.avatarUrl,N.avatarEmoji||N.username,"floo-portal-avatar")}
                        ${q?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${N.level}</span>
                      </div>
                      <strong class="floo-portal-name">${A(N.username)}</strong>
                      <span class="floo-portal-park">${A((N.house?ei[N.house]:"")||"🪄")} ${A(N.parkName||"")}</span>
                      <span class="floo-portal-status">${B}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,Z=n.neighbors.filter(N=>N.owlHelpCrates.some(q=>!q.fulfilledByPlayerToday)||!!(N.minigameSos&&!N.minigameSos.rescuedToday)),ie=Z.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${Z.slice(0,6).map(N=>{const q=e.sim.canRescueNeighborMinigame(N.id),_=N.minigameSos,ee=_?Bn(_.kind):null,B=!!(_&&(_.rescuedToday||n.dailyRescuesGivenIds.includes(N.id))),j=N.owlHelpCrates.filter(le=>!le.fulfilledByPlayerToday).map(le=>{const re=Je(le.itemId),be=e.sim.getFarmItemCount(le.itemId),de=e.sim.state.sandboxMode||be>=le.qty;return`
                          <div class="nb-crate-item">
                            <img src="${re.iconSrc}" alt="${A(re.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${le.qty} ${A(re.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":be}/${le.qty})</span></div>
                              <div class="nb-crate-rew">+${le.rewardTokens}🍀 • +${le.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${de?"gold-cta":""} nb-mini-cta" data-nb-crate="${A(N.id)}|${A(le.id)}" ${de?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),oe=_&&ee&&!B?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${ee.icon} ${A(ee.nameVi)} • <strong>Màn ${_.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${A(N.id)}" ${q.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===N.id?"focused":""}" data-neighbor-card="${A(N.id)}">
                        <div class="nb-card-head">
                          ${Lt(N.avatarUrl,N.avatarEmoji||N.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${A(N.name)}</strong>
                              <span class="nb-badge-pill">Lv.${N.level}</span>
                              <span class="nb-badge-pill house">${hn[N.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${A(N.id)}">🔥 Bay tới</button>
                        </div>
                        ${j?`<div class="nb-coop-section"><div class="nb-crate-list">${j}</div></div>`:""}
                        ${oe}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";x=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN</div>
              <div class="floo-hearth-sub">
                Còn <strong>${p}/${Ge} lượt chăm giúp</strong> hôm nay · <strong>${V}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"⏳…":"🔄"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${R.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${D}
        </section>
        ${Y}
        ${ie}
      `}else{const R=Math.min(100,Math.round(e.sim.state.level/ht*100));x=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${ht}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${ht}</strong> · Khi đạt Cấp ${ht}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${R}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const M=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${Xa.map(R=>{const V=s?.id===R.id;return`
              <article class="honor-garden-card ${V?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${A(R.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${A(R.titleVi)}</strong>
                    <span class="honor-garden-owner">${A(R.ownerName)} · Lv.${R.level} · ${hn[R.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${A(R.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${A(R.weather)} · ${A(R.atmosphere)}</span>
                  ${V?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${A(R.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;$=`
      ${S.join("")}
      ${E}
      ${m?`${x}${M}`:`${M}${x}`}
    `}else if(e.activeNeighborTab==="postcard"){const S=fn(e),E=Is(S);$=`
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🖼️ Bưu Thiếp Thung Lũng &amp; Rủ Bạn Qua Mạng Floo</div>
          <span class="honor-daily-pill">
            ${n.dailyFlooShareClaimed?"✓ Đã nhận quà Bưu Thiếp hôm nay":"🎁 +10G · +1 🍀 · +15 điểm Lễ Hội"}
          </span>
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${A(E)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const S=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(E=>{const x=Je(E.itemId);return`
                <div class="nb-crate-item ${E.fulfilledAt?"done":""}">
                  <img src="${x.iconSrc}" alt="${A(x.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${E.qty} ${A(x.name)}</div>
                    <div class="nb-crate-rew">${E.fulfilledAt?`✓ ${A(E.helperEmoji??"🦉")} ${A(E.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';$=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${n.friendshipTokens}/${ft} 🍀)</div>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${C}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug">🔥 +1</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150G</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${n.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${y?"":"disabled"}>
              🎁 Mở Rương (${ft} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${u?`
                  <div class="nb-alert-banner ${u.rescuedAt?"ready":""}">
                    <span>${u.rescuedAt?`🎉 <strong>${A(u.rescuerEmoji??"🦉")} ${A(u.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${u.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${u.stage}</strong>…`}</span>
                    ${u.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${d}/${Gt}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${g}/${pn}):</div>
            <div class="nb-crate-list">${S}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${Ya.map(E=>{const x=E.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${E.id}" data-active="${x}" aria-pressed="${x}" class="brass-btn nb-note-btn">
                  ${E.emoji} ${A(E.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else $=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(E=>{const x=new Date(E.timestamp),M=String(x.getHours()).padStart(2,"0"),R=String(x.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${A(E.icon)}</span>
                  <span class="nb-log-msg">${A(E.textVi)}</span>
                  <span class="nb-log-time">${M}:${R}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${T}
    ${L}
    ${$}
  `,Ns(t);const k=t.querySelector("#flooPostcardCanvas");k&&Kn(e.gameCanvas,fn(e),k),t.querySelectorAll("[data-nbtab]").forEach(S=>{S.addEventListener("click",()=>{e.activeNeighborTab=S.dataset.nbtab,qe(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",qe(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{ti(e),qe(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{ti(e),qe(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const S=t.querySelector("#flooPostcardCanvas")??Kn(e.gameCanvas,fn(e)),E=Bs(S,.72);if(E){const M=document.createElement("a");M.href=E,M.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${E.startsWith("data:image/webp")?"webp":"png"}`,M.click()}const x=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(x.msg,"🖼️"),qe(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",S=>{S.preventDefault();const x=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);x&&(n.playerDisplayName=x,e.sim.saveToStorage(),Yt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${x}"!`,"🔥"),qe(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Yt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const S=un(e.flooDirectoryRows,Date.now());S.length>0&&vt(e,S[0].uid,S)}),t.querySelectorAll("[data-floo-portal]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.flooPortal;if(!E)return;const x=un(e.flooDirectoryRows,Date.now());vt(e,E,x)})}),t.querySelectorAll("[data-honor-tour]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.honorTour;E&&$n(e,E)})});const h=()=>{const S=e.sim.openFriendshipChest();S.ok||e.showToast(S.msg,"🍀"),e.refreshAll(),qe(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",h),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",h),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(S=>{S.addEventListener("click",()=>{const E=e.sim.claimPlayerMinigameSosRescue();E.ok||e.showToast(E.msg,"⚠️"),e.refreshAll(),qe(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const S=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const E of S)e.sim.claimHomeLanternMark(E.id);e.refreshAll(),qe(e)}),t.querySelectorAll("[data-nb-visit]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.nbVisit;E&&_s(e,E)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Tn(e)}),t.querySelectorAll("[data-nb-crate]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.nbCrate??"",[x,M]=E.split("|");if(!x||!M)return;const R=e.sim.fulfillNeighborOwlCrate(x,M);R.ok||e.showToast(R.msg,"🧺"),e.refreshAll(),qe(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.nbRescue;if(!E)return;const x=e.sim.canRescueNeighborMinigame(E);if(!x.ok||!x.neighbor||!x.sos){e.showToast(x.reason??"Không thể giải cứu màn này lúc này!","🦉");return}Fs(e,{neighborId:x.neighbor.id,neighborName:x.neighbor.name,neighborEmoji:x.neighbor.avatarEmoji,kind:x.sos.kind,stage:x.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(S=>{S.addEventListener("click",()=>{const E=S.dataset.nbNote;E&&(e.sim.setNeighborPresetNote(E),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),qe(e))})})}function bn(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;we(e.cam,t.gx+t.bw*.5+o,t.gy+t.bh*.5+o),e.onCameraJump?.()}function Vs(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const n=Date.now();return e.sim.state.buildings.some(s=>ne(s.itemId)?.isAnimalPasturePlot&&s.pastureAnimalId&&s.pastureReadyAt&&n>=s.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const n=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(n)return{el:n,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function ni(e){const t=e.root.querySelector("#tutorialHudSpotlight"),n=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(p=>p.removeAttribute("data-tutorial-anchor")),!t)return;const o=!!document.querySelector("dialog[open]");if(e.photoModeActive||o||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:s,label:a}=Vs(e);if(!s||s.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=s.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!s.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||s.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const i=6;t.style.setProperty("--spot-left",`${Math.round(r.left-i)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-i)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+i*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+i*2)}px`),t.classList.toggle("pill-below",r.top<110),n&&(n.textContent=a||"👇 Bấm"),t.classList.remove("hidden")}function Us(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function Ws(e,t){if(Us())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function js(e,t){if(Us())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function ii(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const n=!!document.querySelector("dialog[open]"),o=e.manageMenuOpen||e.weatherPopoverOpen,s=e.sim.getCurrentTutorialStep();if(e.photoModeActive||n||o||!s){Ws(e,t),ni(e);return}const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),l=`${s.index}:${s.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${r}`;if(e.lastRenderedTutorialSig!==l){e.lastRenderedTutorialSig=l;const p=ki.map(c=>`<span class="tutorial-step-dot ${c.index<s.index?"done":c.index===s.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${s.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${A(s.title)}</h2>
            </div>
            <button id="btnTutorialExpand" type="button" data-tutorial-focus class="brass-btn gold-cta">▴ Mở</button>
            <button
              id="btnTutorialSkipMini"
              type="button"
              popovertarget="tutorialCoachCard"
              popovertargetaction="hide"
              class="brass-btn tutorial-skip-btn"
              aria-label="Bỏ qua hướng dẫn"
            >✕</button>
          </div>
        `;else{const c=s.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>':s.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${r>0?"🔨 Xây":"🦉 Đơn Cú"}</button>`:"",d=s.id==="build_and_owl_order"?r>0?"🦉 Giao Đơn!":"🔨 Xây Dựng":s.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/trang-trai-hang-soc/sprites/${s.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${ki.length}"
              aria-valuenow="${s.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${p}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${A(s.speakerName)}
              </div>
              <div class="tutorial-top-controls">
                <button
                  id="btnTutorialMinimize"
                  type="button"
                  class="tutorial-ghost-btn"
                  aria-label="Thu gọn bảng hướng dẫn"
                >▾</button>
                <button
                  id="btnTutorialSkip"
                  type="button"
                  popovertarget="tutorialCoachCard"
                  popovertargetaction="hide"
                  class="tutorial-ghost-btn tutorial-skip-btn"
                  aria-label="Bỏ qua hướng dẫn"
                >✕</button>
              </div>
            </div>
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${A(s.title)}</h2>
            <div class="tutorial-hint-strip">${A(s.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${A(s.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${c}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${A(d)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),ii(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),ii(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{Qs(e,s.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{s.id==="earn_magic_star"?e.openPuzzleArcadeDialog():s.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}js(e,t);const i=`${s.index}:${s.id}`;e.lastFocusedTutorialStepKey!==i&&(e.lastFocusedTutorialStepKey=i,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),ni(e)}function Qs(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())bn(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const o=ne("farmland_plot");o&&(e.selectedCatalogItem=o,e.refreshAll())}return}if(t==="sow_and_merge_plot"){bn(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){bn(e);const n=Date.now();e.sim.state.buildings.some(s=>ne(s.itemId)?.isAnimalPasturePlot&&s.pastureAnimalId&&s.pastureReadyAt&&n>=s.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class qr{constructor(t,n,o,s,a){v(this,"sim");v(this,"cam");v(this,"gameCanvas");v(this,"activeCategory",null);v(this,"christmasTabActive",!1);v(this,"activeChristmasFilter","all");v(this,"selectedCatalogItem",null);v(this,"rotation",0);v(this,"activeDecorFilter","all");v(this,"recentDecorIds",[]);v(this,"bulldozerActive",!1);v(this,"moveModeActive",!1);v(this,"movingBuildingUid",null);v(this,"pincerActive",!1);v(this,"pincerPicked",null);v(this,"seedTrayOpen",!1);v(this,"seedFilterMode","all");v(this,"activeSeedCropId",null);v(this,"pendingSowPlotUid",null);v(this,"pastureTrayOpen",!1);v(this,"activePastureAnimalId",null);v(this,"pendingStockPastureUid",null);v(this,"rideCamUid",null);v(this,"rideCamSpeedText","");v(this,"pendingTouchTile",null);v(this,"onTouchConfirmPlace",null);v(this,"onTouchCancelPlace",null);v(this,"onSelectCatalogItem",null);v(this,"onAutoPlaceSelected",null);v(this,"onBuildStateReset",null);v(this,"onRotateActivePlacement",null);v(this,"onStartMoveBuilding",null);v(this,"onCameraJump",null);v(this,"photoModeActive",!1);v(this,"inspectSelection",null);v(this,"minimapCanvas");v(this,"questCollapsed",!1);v(this,"minimapCollapsed",!1);v(this,"manageMenuOpen",!1);v(this,"weatherPopoverOpen",!1);v(this,"mapToolsExpanded",!1);v(this,"buildSheetOpen",!1);v(this,"minimapHudVisible",!1);v(this,"hudRolledUp",!1);v(this,"inspectorCollapsed",!1);v(this,"lastInspectedKey","");v(this,"displayedGalleons",-1);v(this,"galleonRollRaf",0);v(this,"activeWorkshopTab","barn");v(this,"activeQuestTab","orders");v(this,"activeAlbumTab","cup");v(this,"activeAchievementFilterCat","all");v(this,"selectedOwlOrderId",null);v(this,"lastWsBrewId",null);v(this,"activeSuitcaseTab","care");v(this,"selectedSuitcaseHabitatUid",null);v(this,"useStarlightForIncubation",!0);v(this,"lastSuitcaseIncReady",!1);v(this,"lastSuitcaseExpReady",!1);v(this,"activeNeighborTab","friends");v(this,"focusedNeighborId",null);v(this,"flooDirectoryRows",[]);v(this,"flooQueueRows",[]);v(this,"flooHelpsLeft",null);v(this,"flooLoading",!1);v(this,"flooLastLoadedAt",0);v(this,"flooAutoAdvanceTimer",0);v(this,"flooHelpersToday",[]);v(this,"lastSocialLiveSig","");v(this,"tutorialMinimized",!1);v(this,"lastRenderedTutorialSig","");v(this,"lastFocusedTutorialStepKey","");v(this,"ribbonBannerTimer",0);v(this,"yuleReadySig","");v(this,"pendingBulldozeWarning",null);v(this,"drawerEdgeObserver",null);v(this,"dialogOpenObserver",null);v(this,"match3Modal",null);v(this,"puzzleArcadeModal",null);v(this,"match3ModalPromise",null);v(this,"puzzleArcadeModalPromise",null);v(this,"seedQuizModal");v(this,"leaderboardModal");v(this,"youtubeBgm");v(this,"root");v(this,"sprites");this.root=t,this.sim=n,this.cam=o,this.gameCanvas=s,this.sprites=a,this.recentDecorIds=Ho(),this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||wt(()=>import("./vendor-d6FS5LaX.js").then(r=>r.i),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new Lo(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{const i=ke[r];if(l){const p=this.sim.state.buildings.find(c=>c.uid===l);if(p&&ne(p.itemId)?.isFarmlandPlot&&!p.cropId){const c=this.sim.plantCropOnPlot(p.uid,r);this.activeSeedCropId=null,this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(c.msg,c.ok?"🌱":"🪙"),this.refreshAll();return}}this.activeSeedCropId=this.sim.getSeedCount(r)>0||this.sim.state.sandboxMode?r:null,this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.activeSeedCropId&&this.showToast(`🌱 Đang cầm hạt ${i.emoji} ${i.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,i.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new vo(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),i=this.root.querySelector("#puzzleArcadeDialog"),p=this.root.querySelector("#seedQuizDialog");r==="match3"?(i?.close(),p?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),i?.close(),this.openSeedQuizDialog()):(l?.close(),p?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.youtubeBgm=new Io(this.sim.audio,{onToast:(r,l)=>this.showToast(r,l??"🎵"),onStatusChange:()=>{const r=this.root.querySelector("#lblYoutubeBgmStatus");r&&(r.textContent=this.youtubeBgm.getStatusText())}}),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),Cs(this),ks(this),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const i=this.sim.state.buildings.find(d=>this.inspectSelection?.kind==="building"&&d.uid===this.inspectSelection.uid),p=i?ne(i.itemId):void 0,c=Date.now();i&&(c<i.constructEndsAt||i.workshopQueue&&i.workshopQueue.length>0||i.cropId&&i.cropReadyAt&&c<i.cropReadyAt+1200||i.pastureAnimalId&&i.pastureReadyAt&&c<i.pastureReadyAt+1200||p&&p.cycleSec>0&&p.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return Ro(this)}clearBuildToolModes(){ye(this)}recordRecentDecorItem(t){const n=ne(t);!n||n.category!=="decor"||(this.recentDecorIds=Do(this.recentDecorIds,t))}triggerRotateAction(){if(this.sim.isVisitingNeighbor){this.showToast("Chế độ Khách Tham Quan — không thể xoay công trình vườn bạn!","🏡");return}if(!this.selectedCatalogItem&&!(this.moveModeActive&&this.movingBuildingUid)&&this.inspectSelection?.kind==="building"){const t=this.inspectSelection.uid,n=this.sim.state.buildings.find(a=>a.uid===t),o=n?ne(n.itemId):void 0,s=this.sim.rotatePlacedBuilding(t);if(!s.ok){this.showToast(s.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}this.rotation=s.newRotation??this.rotation,this.refreshAll(),this.showToast(`🔄 Đã xoay "${o?.name??"công trình"}" (${(s.newRotation??0)*90}°)`,"🔄");return}this.rotation=(this.rotation+1)%4,this.onRotateActivePlacement?.(),this.refreshDock(),this.refreshFloatingBanner(),this.refreshTouchConfirmBar(),this.showToast(`🔄 Hướng đặt công trình: ${this.rotation*90}°`,"🔄")}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const n=t.returnValue;t.returnValue="";const o=this.pendingBulldozeWarning;if(this.pendingBulldozeWarning=null,n==="confirm"&&o){this.sim.beginBuildStroke();let s=!1;try{s=this.sim.removeAtTile(o.gx,o.gy,!0)}finally{this.sim.commitBuildStroke()}s&&this.inspectSelection?.kind==="building"&&this.inspectSelection.uid===o.uid&&(this.inspectSelection=null),this.refreshAll()}}),this.sim.onRequestBulldozeConfirm=n=>{this.openBulldozeConfirmDialog(n)})}openBulldozeConfirmDialog(t){const n=this.root.querySelector("#bulldozeConfirmDialog"),o=this.root.querySelector("#bulldozeConfirmBody");if(!n||!o){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,o.innerHTML=`
      <div class="quest-card-mini bulldoze-confirm-card">
        <div class="bulldoze-confirm-lead">
          <strong>${A(t.buildingName)}</strong> hiện có:
        </div>
        <div class="bulldoze-confirm-hazard">
          🌾 ${A(t.hazardSummaryVi)}
        </div>
        <div class="bulldoze-confirm-note">
          Nếu phá dỡ ngay bây giờ, phần vụ mùa / sản vật / mẻ đang chạy trên ô này sẽ bị mất vĩnh viễn.
        </div>
        <div class="bulldoze-confirm-refund">
          💰 Khi xóa: <strong>${A(t.refundSummaryVi)}</strong>
        </div>
      </div>
    `,n.returnValue="",n.open||n.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),n=this.root.querySelector("#floatingBannerGrip");if(!t||!n)return;n.classList.remove("hidden");const o=(i,p)=>{t.classList.add("is-floating-dragged");const c=Math.max(0,window.innerWidth-t.offsetWidth),d=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(i,c))}px`,t.style.top=`${Math.max(0,Math.min(p,d))}px`};let s=0,a=0,r=0,l=0;n.addEventListener("pointerdown",i=>{if(i.button!==0)return;const p=t.getBoundingClientRect();s=i.clientX-p.left,a=i.clientY-p.top,r=i.clientX,l=i.clientY,n.setPointerCapture(i.pointerId)}),n.addEventListener("pointermove",i=>{n.hasPointerCapture(i.pointerId)&&(Math.hypot(i.clientX-r,i.clientY-l)>=4&&n.classList.add("dragging"),o(i.clientX-s,i.clientY-a))}),n.addEventListener("lostpointercapture",()=>{n.classList.remove("dragging")}),n.addEventListener("keydown",i=>{let c=0,d=0;if(i.key==="ArrowLeft")c=-15;else if(i.key==="ArrowRight")c=15;else if(i.key==="ArrowUp")d=-15;else if(i.key==="ArrowDown")d=15;else return;i.preventDefault();const g=t.getBoundingClientRect();o(g.left+c,g.top+d)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const i=t.getBoundingClientRect();o(i.left,i.top)}})}installDialogLightDismissFallback(){const t=()=>{const n=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(n)};for(const n of Array.from(this.root.querySelectorAll("dialog")))n.addEventListener("close",()=>{n.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",n=>{const o=n.target;if(o&&typeof o.matches=="function"&&o.matches(".aaa-codex-scroll")){const s=!!n.skipped;o.dataset.cvSkipped=s?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const n=new IntersectionObserver(o=>{for(const s of o)s.target.dataset.cvSkipped=s.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const o of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))n.observe(o)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const n=(o,s)=>{const a=s.getBoundingClientRect();return o.clientX<a.left||o.clientX>a.right||o.clientY<a.top||o.clientY>a.bottom};for(const o of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let s=!1;o.addEventListener("pointerdown",a=>{s=n(a,o)}),o.addEventListener("pointerup",a=>{s&&n(a,o)&&o.close()})}}}wireRangeProgressFallback(t){const n=()=>{const o=Number(t.min||0),s=Number(t.max||100),a=Number(t.value||0),r=Math.round((a-o)/Math.max(1,s-o)*100);t.style.setProperty("--progress",`${r}%`)};n(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",n)}togglePhotoMode(t){return Oo(this,t)}openNeighborDialog(t,n){return zs(this,t,n)}openHarvestFeastDialog(){return gr(this)}refreshHarvestFeastBadges(){return mr(this)}showRibbonUnveilBanner(t){return hr(this,t)}renderHarvestFeastDialog(){return Ds(this)}openMinigameRescue(t){return Fs(this,t)}enterVisitFromHud(t){return _s(this,t)}enterHonorTourFromHud(t){return $n(this,t)}enterFlooMemberVisitFromHud(t,n){return vt(this,t,n)}refreshFlooDirectoryFromHud(t){return Yt(this,t)}applyAuthoritativeSnapshot(t){Os(this,t)}exitVisitFromHud(){return Tn(this)}isBuildingFocusMode(){return Ts(this)}toggleHudRollup(t){return zo(this,t)}syncHudFocusVisibility(){return Zt(this)}openWorkshopDialog(t){return gi(this,t)}openSuitcaseDialog(t,n){return br(this,t,n)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=wt(async()=>{const{Match3ModalController:t}=await import("./match3Modal-ClrNNjkj.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2,3,4])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=n=>this.openPuzzleArcadeDialog(n),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=wt(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-Cxxilehb.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([5,1,2,3,4])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=n=>this.openLeaderboardDialog(n),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,n){this.closeHudPopovers();const o=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(o,n)}openMatch3Dialog(t,n=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(o=>{o.open(t,n),mn(this)})}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(n=>{n.open(t),mn(this)})}openSeedQuizDialog(t,n,o,s,a,r){this.closeHudPopovers(),n||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,n,o,s,a,r),mn(this)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return qt(this)}collapseBuildDock(){return pt(this)}hasOpenFloatingTray(){return Fo(this)}hideOpenFloatingTrays(){return _o(this)}positionFloatingPopover(t,n){return ci(this,t,n)}toggleManagePopover(t){return Go(this,t)}toggleWeatherPopover(t){return Vo(this,t)}renderWeatherPopover(){return di(this)}animateGalleonsTo(t){return $s(this,t)}spawnFlyReward(t,n,o,s){return Uo(this,t,n,o,s)}bindEvents(){return No(this)}showToast(t,n="🦉"){return Ze(this,t,n)}showOfflineModal(t){return jo(this,t)}refreshFloatingBanner(){return pi(this)}openSeedTray(t,n){return Es(this,t,n)}closeSeedTray(){return yt(this)}toggleSeedTray(){return Ko(this)}openPastureTray(t,n){return Ps(this,t,n)}closePastureTray(){return Et(this)}togglePastureTray(){return Zo(this)}renderSeedTray(){return qs(this)}renderPastureTray(){return Jo(this)}refreshTouchConfirmBar(){return ui(this)}refreshAll(){return Xt(this)}refreshHeaderClock(){return Yn(this)}refreshHeader(){return Ms(this)}syncProgressiveHudVisibility(){return As(this)}refreshQuestTracker(){return Ls(this)}refreshDock(){return wn(this)}renderStaffDrawer(t){return Qo(this,t)}syncContextualMapToolsBar(){return Yo(this)}renderInspector(){return he(this)}renderFinanceDialog(){return fr(this)}renderAlbumDialog(){return st(this)}renderQuestDialog(){return Qe(this)}renderRoadmapDialog(){return Rs(this)}updateWorkshopLiveTimers(){return er(this)}renderWorkshopDialog(){return Oe(this)}renderSettingsDialog(){return Ee(this)}refreshSuitcaseBadge(){return yr(this)}updateSuitcaseLiveTimers(){return vr(this)}renderSuitcaseDialog(){return Pe(this)}syncLiveNeighborSocialUI(){return Er(this)}refreshNeighborBadges(){return Gs(this)}renderVisitorDockBar(){return Pr(this)}renderNeighborDialog(){return qe(this)}panCameraToTutorialTarget(){return bn(this)}resolveTutorialHudTarget(){return Vs(this)}updateTutorialHudSpotlight(){return ni(this)}hideTutorialPopover(t){return Ws(this,t)}showTutorialPopover(t){return js(this,t)}renderTutorialCoach(){return ii(this)}handleTutorialPrimaryAction(t){return Qs(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??rn.colorblindMode,fontScale:t?.fontScale??rn.fontScale,highContrast:t?.highContrast??rn.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...rn.volumes,...t?.volumes??{}}}}syncYouTubeBgm(){if(!this.youtubeBgm)return;const t=this.getEffectiveA11ySettings(),n=Math.max(0,Math.min(1,(t.volumes.master??.85)*(t.volumes.music??.85))),o=this.sim.state;this.youtubeBgm.sync({youtubeEnabled:!!o.settings.youtubeBgmEnabled,bgmEnabled:!!o.settings.bgmEnabled,rawUrl:o.settings.youtubeBgmUrl||bt,volume0to1:n})}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();so(t),this.sim.audio?.ceiling&&ao(t,this.sim.audio),this.syncYouTubeBgm()}playStoryCutscene(t){const n=gs.find(s=>s.id===t);if(!n)return;if(this.sim.state.level<n.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${n.unlockLevel} để mở khoá ${n.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${n.titleVi}`,"🎬");let o=120;n.keyframes.forEach((s,a)=>{window.setTimeout(()=>{we(this.cam,s.cameraFocusGx,s.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${s.captionVi}`,a===n.keyframes.length-1?"✨":"🕯️"),n.chapterNumber===3&&a===n.keyframes.length-1&&this.sim.launchFireworksShow(10)},o),o+=s.durationMs})}}let dt=null,Pt=null,es=!1;function ts(){return typeof navigator<"u"&&typeof navigator.install=="function"}function si(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,n=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||n}function ai(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function Xs(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const o=navigator,s=typeof o.install=="function";if(!s&&!dt){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(s&&o.install)await o.install(),t.classList.add("hidden");else if(dt){const a=dt;dt=null,await a.prompt(),((await a.userChoice).outcome==="accepted"||!dt)&&t.classList.add("hidden")}}catch(a){!(a instanceof DOMException&&a.name==="AbortError")&&!dt&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function oi(){!si()||ai()||(Pt||(Pt=Xs()),Pt.classList.remove("hidden"))}function Ys(){Pt&&Pt.classList.add("hidden")}function Ir(){es||typeof window>"u"||(es=!0,!ai()&&(Pt=Xs(),ts()&&si()&&oi(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),dt=e,!ts()&&si()&&!ai()&&oi()}),window.addEventListener("appinstalled",()=>{Ys(),dt=null})))}const Br={init:Ir,show:oi,hide:Ys},Hr="burrow_rollback_backup_v12";function ns(e,t){const n=JSON.stringify({backedUpAt:Date.now(),state:e}),o=typeof localStorage<"u"?localStorage:void 0;try{o?.setItem(Hr,n)}catch{}return n}class Dr{constructor(){v(this,"unhandledErrors",0);v(this,"fpsSamples",[]);v(this,"assetLoadLatencyMs",0);v(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const n=Math.max(1,Math.min(240,t));this.fpsSamples.push(n),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,n={},o=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:n,queuedAt:o})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const n=[...this.offlineQueue];return t(n)?(this.offlineQueue=[],n.length):0}getHealthReport(){const t=this.fpsSamples.length;let n=60,o=60;if(t>0){const s=this.fpsSamples.reduce((l,i)=>l+i,0);n=Number((s/t).toFixed(1));const a=[...this.fpsSamples].sort((l,i)=>l-i),r=Math.max(0,Math.floor((t-1)*.05));o=Number(a[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:n,p5LowFps:o,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}const Ce=160,je=480,ct=32,Rr={galleons:0,stars:1,sand:2,xp:3},is=["#fbbf24","#fde047","#38bdf8","#a78bfa"],ss=["rgba(251, 191, 36, 0.45)","rgba(253, 224, 71, 0.52)","rgba(56, 189, 248, 0.45)","rgba(167, 139, 250, 0.45)"],Nr=["🪙","🌟","⏳","✨"];class Or{constructor(t,n={}){v(this,"root");v(this,"cb");v(this,"canvas",null);v(this,"ctx",null);v(this,"rafId",null);v(this,"lastTs",0);v(this,"arrivalSeq",0);v(this,"fActive",new Uint8Array(Ce));v(this,"fKind",new Uint8Array(Ce));v(this,"fAge",new Float32Array(Ce));v(this,"fDur",new Float32Array(Ce));v(this,"fDelay",new Float32Array(Ce));v(this,"fP0x",new Float32Array(Ce));v(this,"fP0y",new Float32Array(Ce));v(this,"fP1x",new Float32Array(Ce));v(this,"fP1y",new Float32Array(Ce));v(this,"fP2x",new Float32Array(Ce));v(this,"fP2y",new Float32Array(Ce));v(this,"fP3x",new Float32Array(Ce));v(this,"fP3y",new Float32Array(Ce));v(this,"fTrailAccum",new Float32Array(Ce));v(this,"mActive",new Uint8Array(je));v(this,"mKind",new Uint8Array(je));v(this,"mX",new Float32Array(je));v(this,"mY",new Float32Array(je));v(this,"mVx",new Float32Array(je));v(this,"mVy",new Float32Array(je));v(this,"mAge",new Float32Array(je));v(this,"mDur",new Float32Array(je));v(this,"mSize",new Float32Array(je));v(this,"rActive",new Uint8Array(ct));v(this,"rKind",new Uint8Array(ct));v(this,"rX",new Float32Array(ct));v(this,"rY",new Float32Array(ct));v(this,"rAge",new Float32Array(ct));v(this,"rDur",new Float32Array(ct));v(this,"flyerCursor",0);v(this,"moteCursor",0);v(this,"ringCursor",0);this.root=t,this.cb=n}isReducedMotion(){return typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}ensureCanvas(){if(typeof document>"u")return null;if(!this.canvas||!this.canvas.isConnected){const n=document.getElementById("aaaFlyCollectiblesCanvas")??document.createElement("canvas");n.id="aaaFlyCollectiblesCanvas",n.setAttribute("aria-hidden","true"),n.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9400;",n.isConnected||document.body.appendChild(n),this.canvas=n,this.ctx=n.getContext("2d"),this.syncCanvasSize()}return this.ctx}syncCanvasSize(){if(!this.canvas||typeof window>"u")return;const t=Math.min(2,window.devicePixelRatio||1),n=Math.max(1,Math.floor(window.innerWidth*t)),o=Math.max(1,Math.floor(window.innerHeight*t));(this.canvas.width!==n||this.canvas.height!==o)&&(this.canvas.width=n,this.canvas.height=o)}resolveTargetCenter(t){const n=this.root.querySelector(`[data-fly-target="${t}"]`);if(!n)return null;const o=n.getBoundingClientRect();return o.width<=0&&o.height<=0?null:{x:o.left+o.width*.5,y:o.top+o.height*.5,el:n}}pulseHudTarget(t){const n=this.root.querySelector(`[data-fly-target="${t}"]`);n&&(n.classList.remove("hud-chip-pulse"),n.offsetWidth,n.classList.add("hud-chip-pulse"))}spawnBurstToHud(t,n,o,s){const a=this.resolveTargetCenter(t);if(!a)return!1;if(this.isReducedMotion())return this.pulseHudTarget(t),this.cb.onArrival?.(t,0),!0;if(!this.ensureCanvas()||typeof window>"u")return!1;this.syncCanvasSize();const l=typeof o=="number"&&Number.isFinite(o)?Math.max(20,Math.min(window.innerWidth-20,o)):window.innerWidth*.5,i=typeof s=="number"&&Number.isFinite(s)?Math.max(20,Math.min(window.innerHeight-20,s)):window.innerHeight*.54,p=t==="stars"||t==="sand"?Math.min(6,Math.max(1,Math.round(n))):Math.min(8,Math.max(2,Math.ceil(Math.log2(Math.max(2,n))))),c=Rr[t];for(let d=0;d<p;d++){const g=this.allocFlyerSlot(),y=Math.PI*2*d/p+(Math.random()-.5)*.5,C=18+Math.random()*26,u=l+Math.cos(y)*6,m=i+Math.sin(y)*6,T=(d%2===0?1:-1)*(28+Math.random()*44),L=l+Math.cos(y)*C+T,$=i-36-Math.random()*42,k=u+(a.x-u)*.62+T*.35,f=Math.min(i,a.y)-18+(a.y-i)*.32;this.fActive[g]=1,this.fKind[g]=c,this.fAge[g]=0,this.fDur[g]=.52+Math.min(.22,d*.032)+Math.random()*.05,this.fDelay[g]=d*.036,this.fP0x[g]=u,this.fP0y[g]=m,this.fP1x[g]=L,this.fP1y[g]=$,this.fP2x[g]=k,this.fP2y[g]=f,this.fP3x[g]=a.x,this.fP3y[g]=a.y,this.fTrailAccum[g]=0}return this.spawnMoteCluster(c,l,i,6,75),this.ensureLoop(),!0}allocFlyerSlot(){for(let n=0;n<Ce;n++){const o=(this.flyerCursor+n)%Ce;if(this.fActive[o]===0)return this.flyerCursor=(o+1)%Ce,o}const t=this.flyerCursor;return this.flyerCursor=(t+1)%Ce,t}spawnMote(t,n,o,s,a,r,l){const i=this.moteCursor;this.moteCursor=(i+1)%je,this.mActive[i]=1,this.mKind[i]=t,this.mX[i]=n,this.mY[i]=o,this.mVx[i]=s,this.mVy[i]=a,this.mAge[i]=0,this.mDur[i]=l,this.mSize[i]=r}spawnMoteCluster(t,n,o,s,a){for(let r=0;r<s;r++){const l=Math.PI*2*r/s+(Math.random()-.5)*.4,i=a*(.45+Math.random()*.65);this.spawnMote(t,n,o,Math.cos(l)*i,Math.sin(l)*i,2.2+Math.random()*2.3,.24+Math.random()*.16)}}spawnRing(t,n,o){const s=this.ringCursor;this.ringCursor=(s+1)%ct,this.rActive[s]=1,this.rKind[s]=t,this.rX[s]=n,this.rY[s]=o,this.rAge[s]=0,this.rDur[s]=.28}ensureLoop(){if(this.rafId!==null||typeof requestAnimationFrame>"u")return;this.lastTs=performance.now();const t=n=>{const o=Math.min(.05,Math.max(.001,(n-this.lastTs)/1e3));this.lastTs=n,this.tickAndRender(o)?this.rafId=requestAnimationFrame(t):this.rafId=null};this.rafId=requestAnimationFrame(t)}getActiveCount(){let t=0;for(let n=0;n<Ce;n++)this.fActive[n]===1&&t++;return t}tickAndRender(t){const n=this.ctx,o=this.canvas;if(!n||!o)return!1;const s=Math.min(2,(typeof window<"u"?window.devicePixelRatio:1)||1);n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.setTransform(s,0,0,s,0,0);let a=!1;for(let l=0;l<je;l++){if(this.mActive[l]===0)continue;const i=this.mAge[l]+t,p=this.mDur[l];if(i>=p){this.mActive[l]=0;continue}a=!0,this.mAge[l]=i,this.mX[l]=this.mX[l]+this.mVx[l]*t,this.mY[l]=this.mY[l]+this.mVy[l]*t;const c=i/p,d=(1-c)*(1-c),g=this.mSize[l]*(1-c*.45);n.globalAlpha=d*.9,n.fillStyle=is[this.mKind[l]]??"#fbbf24",n.beginPath(),n.arc(this.mX[l],this.mY[l],g,0,Math.PI*2),n.fill()}for(let l=0;l<ct;l++){if(this.rActive[l]===0)continue;const i=this.rAge[l]+t,p=this.rDur[l];if(i>=p){this.rActive[l]=0;continue}a=!0,this.rAge[l]=i;const c=i/p,g=8+(1-Math.pow(1-c,2.2))*22;n.globalAlpha=(1-c)*.85,n.strokeStyle=is[this.rKind[l]]??"#fbbf24",n.lineWidth=2.4*(1-c*.6),n.beginPath(),n.arc(this.rX[l],this.rY[l],g,0,Math.PI*2),n.stroke()}n.textAlign="center",n.textBaseline="middle";const r=["galleons","stars","sand","xp"];for(let l=0;l<Ce;l++){if(this.fActive[l]===0)continue;if(a=!0,this.fDelay[l]>0){this.fDelay[l]=Math.max(0,this.fDelay[l]-t);continue}const i=this.fAge[l]+t,p=this.fDur[l],c=this.fKind[l];if(i>=p){this.fActive[l]=0;const h=this.fP3x[l],S=this.fP3y[l];this.spawnRing(c,h,S),this.spawnMoteCluster(c,h,S,7,92);const E=r[c]??"galleons";this.pulseHudTarget(E),this.arrivalSeq=(this.arrivalSeq+1)%8,this.cb.onArrival?.(E,this.arrivalSeq);continue}this.fAge[l]=i;const d=i/p,g=d<.35?1-Math.pow(1-d/.35,1.8)*.68-.32*(1-d/.35):.32+Math.pow((d-.35)/.65,1.55)*.68,y=Math.max(0,Math.min(1,g)),C=1-y,u=C*C*C,m=3*C*C*y,T=3*C*y*y,L=y*y*y,$=u*this.fP0x[l]+m*this.fP1x[l]+T*this.fP2x[l]+L*this.fP3x[l],k=u*this.fP0y[l]+m*this.fP1y[l]+T*this.fP2y[l]+L*this.fP3y[l];this.fTrailAccum[l]=this.fTrailAccum[l]+t,this.fTrailAccum[l]>=.024&&(this.fTrailAccum[l]=0,this.spawnMote(c,$+(Math.random()-.5)*5,k+(Math.random()-.5)*5,(Math.random()-.5)*20,12+Math.random()*18,2.1+Math.random()*1.4,.2));const f=d<.18?.65+d/.18*.52:1.17-(d-.18)/.82*.28;n.globalAlpha=1,n.fillStyle=ss[c]??ss[0],n.beginPath(),n.arc($,k,12*f,0,Math.PI*2),n.fill(),n.font=`${Math.round(20*f)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,n.fillText(Nr[c]??"🪙",$,k+1)}return n.globalAlpha=1,a}dispose(){this.rafId!==null&&typeof cancelAnimationFrame<"u"&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.fActive.fill(0),this.mActive.fill(0),this.rActive.fill(0),this.canvas?.isConnected&&this.canvas.remove(),this.canvas=null,this.ctx=null}}const mt=us;async function zr(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const n=document.createElement("canvas");n.id="gameCanvas",n.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(n);const o=new Za,s=new no;await s.loadAll();const a=new Ja(o),r={x:0,y:0,zoom:.82,viewRot:0};we(r,18,24.5);const l=new io(n,s),i=new qr(e,a,r,n,s);Br.init(),On.init(a);const p=new URLSearchParams(window.location.search),c=p.get("renderer"),d=p.get("mock")==="gpu"||c==="compare";(c==="canvas"||c==="webgl2")&&(a.state.settings.rendererMode=c);let g=null,y=null,C=null,u=null,m=!1;const T=()=>{window.addEventListener("pointermove",b=>{b.clientX,b.clientY},{passive:!0})};if(d)try{const b=c==="webgl2"||c==="canvas"||c==="compare"?c:"compare",[{GpuMockOverlayController:w},{WebGL2WorldRenderer:I}]=await Promise.all([wt(()=>import("./gpuMockOverlay-DfPMrLhF.js"),[]),wt(()=>import("./webgl2WorldRenderer-kGwJ2CdU.js"),__vite__mapDeps([6,1,4,2,7,8]))]);y=new w(e,n,a,b,"high"),g=new I(y.gpuCanvas,s),p.get("tutorial")||(i.tutorialMinimized=!0),T()}catch(b){console.warn("[WebGL2 Mock] Fallback về Canvas2D:",b),g=null,y=null,m=!0}else try{const{WebGL2WorldRenderer:b}=await wt(async()=>{const{WebGL2WorldRenderer:I}=await import("./webgl2WorldRenderer-kGwJ2CdU.js");return{WebGL2WorldRenderer:I}},__vite__mapDeps([6,1,4,2,7,8])),w=document.createElement("canvas");w.id="gpuWorldCanvas",w.setAttribute("aria-hidden","true"),w.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0;display:block;",n.insertAdjacentElement("beforebegin",w),g=new b(w,s),C=w,u={mode:(a.state.settings.rendererMode??"webgl2")==="canvas"?"canvas":"webgl2",splitRatio:.5,qualityTier:Fi()?"medium":"high",lumosWandEnabled:!1,windStrength:1.15,bloomIntensity:.72,normalStrength:1.12},u.mode==="webgl2"?(n.style.position="relative",n.style.zIndex="1",n.style.background="transparent"):w.style.display="none",T(),window.addEventListener("hangsoc:toon-changed",()=>{g?.invalidateSpriteAtlas()})}catch(b){console.warn("[WebGL2 Engine] Thiết bị không hỗ trợ WebGL2, tự động fallback về Canvas2D:",b),C?.remove(),C=null,g=null,u=null,m=!0,a.state.settings.rendererMode="canvas"}const L=eo,$=!!(p.get("visit")||p.get("tour")||L||p.get("ridecam")==="1");let k=null;if(i.onCameraJump=()=>{k=null},!$&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const b=r.x,w=r.y,I=r.zoom;we(r,17.5,24),r.zoom=.76,k={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:b,toY:w,toZoom:I}}const f=p.get("yule");if((f==="on"||f==="off"||f==="auto")&&(a.state.settings.yuleThemeMode=f,i.refreshAll()),!1){const b=Number(p.get("yuleDay")||0);Number.isFinite(b)&&b>=1&&b<=36&&(a.debugYuleDayOverride=Math.floor(b),i.refreshAll())}if(p.get("ridecam")==="1"){const b=a.state.buildings.find(w=>ne(w.itemId)?.isCustomCoasterStation);b&&(i.rideCamUid=b.uid)}const S=p.get("dialog");if(S==="album")document.getElementById("btnOpenAlbum")?.click();else if(S==="finance")document.getElementById("btnOpenFinance")?.click();else if(S==="orders"||S==="quests"||S==="yule")S==="yule"?(i.activeQuestTab="quests",i.renderQuestDialog(),document.getElementById("questDialog")?.showModal()):document.getElementById("btnOpenQuests")?.click();else if(S==="barn")i.openWorkshopDialog("barn");else if(S==="seeds"){const b=p.get("sfilter");(b==="flowers"||b==="crops"||b==="all")&&(i.seedFilterMode=b),i.openSeedTray()}else if(S==="pasture")i.openPastureTray();else if(S==="seedquiz"){const b=p.get("crop")??void 0,w=p.get("lang")??void 0,I=p.get("tier")??void 0,G=p.get("qformat")??void 0,z=p.get("sqtab"),pe=z==="codex"||z==="practice"?z:void 0;i.openSeedQuizDialog(b,null,w,I,G,pe)}else if(S==="bakery"){const b=a.state.buildings.find(w=>w.itemId==="molly_apple_bakery");b&&(i.inspectSelection={kind:"building",uid:b.uid}),i.openWorkshopDialog("brew")}else if(S==="workshop"){const b=p.get("tab")??"barn";i.openWorkshopDialog(b)}else if(S==="suitcase"){const b=p.get("tab")??"care";i.openSuitcaseDialog(b)}else if(S==="match3"){Number(p.get("m3level")||0),Math.min(777,(a.state.match3.maxClearedLevel??0)+1);const b=void 0,w=!!L;i.openMatch3Dialog(b,w)}else if(S==="puzzle"||S==="caro"||S==="sudoku"||S==="chess"||S==="blocks"||S==="jigsaw"||S==="pikachu"||S==="onet"){const b=S==="puzzle"?p.get("pmode"):S,w=b==="pikachu"||b==="onet"?"blocks":b,I=w==="caro"||w==="sudoku"||w==="chess"||w==="blocks"||w==="jigsaw"?w:void 0;i.openPuzzleArcadeDialog(I)}else if(S==="neighbors"||S==="friends")i.openNeighborDialog();else if(S==="feast")i.openHarvestFeastDialog();else if(S==="leaderboard"){const b=p.get("lbgame"),w=b==="match3"||b==="caro"||b==="sudoku"||b==="chess"||b==="blocks"||b==="jigsaw"||b==="seedquiz"?b:void 0,I=p.get("lbscope"),G=I==="valley"||I==="friends"||I==="personal"?I:void 0;i.openLeaderboardDialog(w,G)}else if(!p.get("tour")&&!p.get("visit")&&!a.isHeadmasterPreview&&!d)try{const b=localStorage.getItem(Hn);if(b){const w=JSON.parse(b),I=Date.now()-Number(w.savedAt||0),G=a.state.puzzleArcade;I>=0&&I<=12*3600*1e3?w.dialog==="puzzleArcade"&&w.mode==="sudoku"&&G.sudokuSession?.stage===G.sudokuStage?i.openPuzzleArcadeDialog("sudoku"):w.dialog==="puzzleArcade"&&w.mode==="caro"&&G.caroSession?.stage===G.caroStage?i.openPuzzleArcadeDialog("caro"):w.dialog==="puzzleArcade"&&w.mode==="chess"&&G.chessSession?.stage===G.chessStage?i.openPuzzleArcadeDialog("chess"):w.dialog==="puzzleArcade"&&w.mode==="blocks"&&G.onetSession?.stage===G.blockStage?i.openPuzzleArcadeDialog("blocks"):w.dialog==="puzzleArcade"&&w.mode==="jigsaw"&&G.jigsawSession?.stage===G.jigsawStage?i.openPuzzleArcadeDialog("jigsaw"):w.dialog==="match3"&&a.state.match3.activeSession?.levelId===a.state.match3.currentLevel?i.openMatch3Dialog():localStorage.removeItem(Hn):localStorage.removeItem(Hn)}}catch{}const E={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},x=b=>{const w=String(b||"").trim();if(!w){i.exitVisitFromHud();return}const I=E[w]||(w.startsWith("tour_")?w:"");I?i.enterHonorTourFromHud(I):w.startsWith("player_")||a.ensureNeighborSocial().neighbors.some(G=>G.id===w)?i.enterVisitFromHud(w):i.enterFlooMemberVisitFromHud(w)},M=p.get("tour")||p.get("visit");M&&x(M);const R=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(R.some(b=>p.has(b))){const b=new URLSearchParams(p);for(const G of R)b.delete(G);const w=b.toString(),I=`${window.location.pathname}${w?`?${w}`:""}${window.location.hash}`;window.history.replaceState(null,"",I)}a.isTutorialActive()&&!$&&i.panCameraToTutorialTarget(),_e.bindSimulationGringottsWallet(a,{onSnapshot:b=>i.applyAuthoritativeSnapshot(b),onToast:(b,w)=>i.showToast(b,w??"🏦")}),_e.authoritativeClient.snapshot&&i.applyAuthoritativeSnapshot(_e.authoritativeClient.snapshot),i.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",b=>{i.applyAuthoritativeSnapshot(b.detail)}),window.addEventListener("hpvn:toast",b=>{const w=b.detail;w?.text&&i.showToast(String(w.text),"🔥")}),window.addEventListener("hpvn:tour-garden",b=>{const w=b.detail;x(String(w?.tourId??""))}),window.addEventListener("gamesave:updated",b=>{if(a.isHeadmasterPreview||a.isVisitingNeighbor)return;const w=b.detail,I=typeof w?.saveJson=="string"&&w.saveJson||(typeof localStorage<"u"?localStorage.getItem(hs):null);if(I){if(!ms())try{const G=JSON.parse(I);if(G&&(G.sandboxMode===!0||G.sandboxTainted===!0||G.isHeadmasterPreview===!0))return}catch{return}ns(a.state),a.importSaveJson(I)&&(_e.authoritativeClient.snapshot&&i.applyAuthoritativeSnapshot(_e.authoritativeClient.snapshot),i.match3Modal?.resetSession(),i.puzzleArcadeModal?.resetSession(),i.refreshAll(),On.refresh(),i.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️"))}}),window.addEventListener("hpvn:atmosphere",b=>{if(a.isVisitingNeighbor)return;const w=b.detail?.mode,I=w==="auto"?"realtime":w;(I==="realtime"||I==="dawn"||I==="day"||I==="dusk"||I==="night")&&(a.state.settings.timeOverride=I,a.saveToStorage(),i.refreshAll())}),window.addEventListener("hpvn:weather",b=>{if(a.isVisitingNeighbor)return;const w=b.detail?.mode;(w==="auto"||w==="clear"||w==="cloudy"||w==="rain"||w==="storm"||w==="snow"||w==="fog"||w==="fireflies")&&(a.state.settings.weatherOverride=w,a.saveToStorage(),i.refreshAll())}),a.onTutorialStepChanged=()=>{i.panCameraToTutorialTarget()},a.onUiChange=()=>{i.refreshAll(),On.refresh()},a.onToast=(b,w)=>{i.showToast(b,w),b.includes("Đạt Cấp")||b.includes("lên cấp")||b.includes("Lên Cấp")?Ct("levelup"):Ct("light"),ys(b)},a.onBuildingTactile=b=>l.triggerSquash(b),a.onBuildingCompleted=b=>{l.triggerCompletionPop(b),l.triggerSquash(b)},a.onRibbonUnveiled=b=>{const w=Dn(b.gx,b.gy,r,n.clientWidth,n.clientHeight,36);l.triggerRibbonUnveilPop(b.uid,w.sx,w.sy),i.showRibbonUnveilBanner(b),Ct("levelup")};const V=new Or(i.root,{onArrival:(b,w)=>{o.playFlyTick(w),w===0&&Ct("light")}});a.onRewardFly=(b,w,I,G)=>{if(typeof I=="number"&&typeof G=="number"){const z=Dn(I,G,r,n.clientWidth,n.clientHeight,32);V.spawnBurstToHud(b,w,z.sx,z.sy)||i.spawnFlyReward(b,w,z.sx,z.sy)}else V.spawnBurstToHud(b,w,n.clientWidth*.5,n.clientHeight*.52)||i.spawnFlyReward(b,w)},a.onLevelUp=b=>{Ct("levelup");const w=Sa(b),I=w.unlockedItemIds.map(z=>ne(z)?.name).filter(Boolean).slice(0,2).join(", "),G=I?` — Mở bản vẽ mới: ${I}!`:w.milestoneNote?` — ${w.milestoneNote}`:"";i.showToast(`🎉 Đạt Cấp Giải Đố ${b}! (+${w.rewardGalleons}🪙)${G}`,"🌟"),i.refreshAll()};const P=a.processOfflineProgress();P&&i.showOfflineModal(P);const W=b=>{const w=a.getActiveVisitingNeighbor();if(!w?.remoteUserId)return;const I=w.helpedMarksToday[w.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:w.remoteUserId,buildingUid:b,kind:I?.kind||"water_crop",noteText:I?.noteText||"Chúc vườn phép thuật bội thu!",helperName:a.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let D=null,Y=!1,Z=!1,ie=!1,N=!1,q=!1,_=0,ee=0,B=0,j=0,oe=0,le=0;const re=(b,w,I,G)=>{const z=i.activeSeedCropId;if(!z)return!1;const pe=Date.now(),X=O=>{if(!O)return null;const U=a.state.buildings.find(te=>te.uid===O);return!U||U.cropId||pe<U.constructEndsAt?null:ne(U.itemId)?.isFarmlandPlot?U:null};let ae=X(a.grid[w]?.[b]?.buildingUid);if(!ae){let O=1/0;for(let U=l.hotspots.length-1;U>=0;U--){const te=l.hotspots[U];if(te.kind!=="building")continue;const Q=Math.hypot(I-te.sx,G-te.sy);if(Q<=Math.max(te.radius*1.35,36)&&Q<O){const H=X(te.id);H&&(O=Q,ae=H)}}}if(!ae)return!1;const K=a.plantCropOnPlot(ae.uid,z);if(!K.ok){if(K.needSeedAcquire)return N=!1,Y=!1,i.activeSeedCropId=null,i.seedTrayOpen=!1,i.inspectSelection=null,i.refreshAll(),i.openSeedQuizDialog(z,ae.uid),!1;const O=Date.now();return O-_>1200&&(_=O,i.showToast(K.msg,"🪙")),!1}return!a.state.sandboxMode&&a.getSeedCount(z)<=0&&(i.activeSeedCropId=null),i.seedTrayOpen?(i.seedTrayOpen=!1,i.renderSeedTray(),i.refreshFloatingBanner()):i.activeSeedCropId||(i.renderSeedTray(),i.refreshFloatingBanner()),!0},be=(b,w,I,G)=>{const z=i.activePastureAnimalId;if(!z)return!1;const pe=Date.now(),X=O=>{if(!O)return null;const U=a.state.buildings.find(te=>te.uid===O);return!U||U.pastureAnimalId||pe<U.constructEndsAt?null:ne(U.itemId)?.isAnimalPasturePlot?U:null};let ae=X(a.grid[w]?.[b]?.buildingUid);if(!ae){let O=1/0;for(let U=l.hotspots.length-1;U>=0;U--){const te=l.hotspots[U];if(te.kind!=="building")continue;const Q=Math.hypot(I-te.sx,G-te.sy);if(Q<=Math.max(te.radius*1.35,36)&&Q<O){const H=X(te.id);H&&(O=Q,ae=H)}}}if(!ae)return!1;const K=a.stockAnimalOnPasture(ae.uid,z);if(!K.ok){const O=Date.now();return O-ee>1200&&(ee=O,i.showToast(K.msg,"🪙")),!1}return i.pastureTrayOpen&&(i.pastureTrayOpen=!1,i.renderPastureTray(),i.refreshFloatingBanner()),!0};let de=null;const fe=(b,w,I,G,z)=>{if(a.isVisitingNeighbor)return null;const pe=Date.now(),X=[],ae=a.grid[w]?.[b]?.buildingUid;ae&&X.push(ae);for(let K=l.hotspots.length-1;K>=0;K--){const O=l.hotspots[K];(O.kind==="water_crop"||O.kind==="feed_pasture"||O.kind==="building")&&Math.hypot(I-O.sx,G-O.sy)<=O.radius&&(X.includes(O.id)||X.push(O.id))}for(const K of X){const O=a.state.buildings.find(te=>te.uid===K);if(!O||pe<O.constructEndsAt||O.awaitingUnveil)continue;const U=ne(O.itemId);if(U){if(U.isFarmlandPlot&&O.cropId&&O.cropReadyAt){const te=pe>=O.cropReadyAt?"harvest_crop":O.cropWateredBoost?null:"water_crop";if(te&&(!z||te===z))return{uid:K,mode:te}}if(U.isAnimalPasturePlot&&O.pastureAnimalId&&O.pastureReadyAt){const te=pe>=O.pastureReadyAt?"harvest_pasture":O.pastureFedBoost?null:"feed_pasture";if(te&&(!z||te===z))return{uid:K,mode:te}}}}return null},et=(b,w,I,G)=>{let z=!1;return w==="harvest_crop"?z=a.harvestCropPlot(b).ok:w==="water_crop"?z=a.waterCropPlot(b).ok:w==="harvest_pasture"?z=a.harvestAnimalPasture(b).ok:w==="feed_pasture"&&(z=a.feedAnimalPasture(b).ok),z&&(l.triggerSquash(b),l.notifyJuice("harvest",I,G),Ct("light")),z},ge=()=>{const b=de;return de=null,!b||!b.active?(a.batchOperationActive=!1,!1):(a.batchOperationActive=!1,b.sweptUids.size>0&&(a.checkAndToastAchievements(),a.saveToStorage(),a.onUiChange?.(),i.inspectSelection=null,i.refreshAll()),b.sweptUids.size>0)},$e=()=>{a.commitBuildStroke()},Me=b=>{a.beginBuildStroke();try{return b()}finally{a.commitBuildStroke()}},J=new Map;let xe=0,Ve=!1,Le=null;const Ue=()=>{Le&&(window.clearTimeout(Le.timer),Le=null)},Ks=[[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],tt=(b,w,I,G,z)=>{if(mt(b))return{gx:w,gy:I};const{bw:pe,bh:X}=a.getBuildingFootprint(b,G),ae=Math.max(0,Math.min(Re-pe,w-Math.floor((pe-1)/2))),K=Math.max(0,Math.min(Re-X,I-Math.floor((X-1)/2)));if(a.canPlaceItem(b,ae,K,G,z).ok)return{gx:ae,gy:K};for(const[O,U]of Ks){const te=ae+O,Q=K+U;if(!(te<0||Q<0||te+pe>Re||Q+X>Re)&&a.canPlaceItem(b,te,Q,G,z).ok)return{gx:te,gy:Q}}return{gx:ae,gy:K}},It=(b,w)=>{const I=n.getBoundingClientRect(),G=I.width||window.innerWidth||1280,z=I.height||window.innerHeight||720,pe=$t(G*.5,z*.5,r,G,z,a.grid),{bw:X,bh:ae}=a.getBuildingFootprint(b,w),K=Math.max(0,Math.min(Re-X,pe.gx-Math.floor((X-1)/2))),O=Math.max(0,Math.min(Re-ae,pe.gy-Math.floor((ae-1)/2)));let U=null;for(let Q=-9;Q<=9;Q++)for(let H=-9;H<=9;H++){const ce=K+H,F=O+Q;if(ce<0||F<0||ce+X>Re||F+ae>Re||!a.canPlaceItem(b,ce,F,w).ok)continue;let se=0;for(let Ne=-1;Ne<=ae&&se===0;Ne++)for(let Be=-1;Be<=X;Be++){const He=(Be===-1||Be===X)&&(Ne===-1||Ne===ae),Te=Be>=0&&Be<X&&Ne>=0&&Ne<ae;if(!(He||Te)&&a.connectedPathTiles.has(`${ce+Be},${F+Ne}`)){se=8;break}}const Se=se-Math.hypot(H,Q);(!U||Se>U.score)&&(U={gx:ce,gy:F,score:Se})}if(U)return{gx:U.gx,gy:U.gy};const te=a.findSmartSpotForStoryBuilding(b,w);if(te&&a.canPlaceItem(b,te.gx,te.gy,w).ok)return te;for(let Q=0;Q<=Re-ae;Q++)for(let H=0;H<=Re-X;H++)if(a.canPlaceItem(b,H,Q,w).ok)return{gx:H,gy:Q};return null};i.onBuildStateReset=()=>{Ue(),D=null},i.onStartMoveBuilding=b=>{const w=a.state.buildings.find(I=>I.uid===b);w&&(D={gx:w.gx,gy:w.gy})},i.onRotateActivePlacement=()=>{if(i.moveModeActive&&i.movingBuildingUid){const b=a.state.buildings.find(I=>I.uid===i.movingBuildingUid),w=b?ne(b.itemId):void 0;if(b&&w){const I=i.pendingTouchTile??D??{gx:b.gx,gy:b.gy},G=tt(w,I.gx,I.gy,i.rotation,i.movingBuildingUid);D=G,i.pendingTouchTile&&(i.pendingTouchTile={gx:G.gx,gy:G.gy,label:i.pendingTouchTile.label})}return}i.selectedCatalogItem&&!mt(i.selectedCatalogItem)&&(D?D=tt(i.selectedCatalogItem,D.gx,D.gy,i.rotation):D=It(i.selectedCatalogItem,i.rotation))},i.onSelectCatalogItem=b=>{i.pendingTouchTile=null,i.refreshTouchConfirmBar();const w=n.getBoundingClientRect(),I=w.width||window.innerWidth||1280,G=w.height||window.innerHeight||720;if(mt(b)){const O=$t(I*.5,G*.5,r,I,G,a.grid);D={gx:O.gx,gy:O.gy};return}const z=It(b,i.rotation);if(!z){const O=$t(I*.5,G*.5,r,I,G,a.grid);D=tt(b,O.gx,O.gy,i.rotation);return}D={gx:z.gx,gy:z.gy};const{bw:pe,bh:X}=a.getBuildingFootprint(b,i.rotation),ae=a.grid[z.gy]?.[z.gx]?.elevation??0,K=Dn(z.gx+pe*.5,z.gy+X*.5,r,I,G,ae*zi);(K.sx<I*.18||K.sx>I*.82||K.sy<G*.2||K.sy>G*.76)&&(k=null,we(r,z.gx+pe*.5,z.gy+X*.5))},i.onAutoPlaceSelected=()=>{const b=i.selectedCatalogItem;if(!b)return;const w=i.rotation;let I=null;if(D&&a.canPlaceItem(b,D.gx,D.gy,w).ok?I={gx:D.gx,gy:D.gy}:I=It(b,w),!I){const ae=a.canPlaceItem(b,18,24,w),{bw:K,bh:O}=a.getBuildingFootprint(b,w);i.showToast(ae.reason&&!ae.reason.includes("Ô đất")?ae.reason:`Chưa tìm thấy khoảng đất trống ${K}×${O} ô trong vùng đã mở khóa!`,"⚠️");return}const G=a.canPlaceItem(b,I.gx,I.gy,w);if(!G.ok){i.showToast(G.reason??"Không thể đặt tại ô này!","⚠️");return}if(!Me(()=>a.placeItem(b,I.gx,I.gy,w)))return;i.recordRecentDecorItem(b.id);const{bw:pe,bh:X}=a.getBuildingFootprint(b,w);k=null,we(r,I.gx+pe*.5,I.gy+X*.5),i.pendingTouchTile=null,Oi(b)?D=It(b,w):(i.selectedCatalogItem=null,D=null),i.refreshAll(),i.showToast(`🔨 Đã khởi công "${b.name}" thành công!`,"✨")},i.onTouchConfirmPlace=()=>{if(!i.pendingTouchTile)return;if(!(i.moveModeActive&&i.movingBuildingUid)){i.pendingTouchTile=null,i.refreshTouchConfirmBar();return}const b=i.movingBuildingUid,w=a.state.buildings.find(X=>X.uid===b),I=w?ne(w.itemId):void 0,{gx:G,gy:z}=i.pendingTouchTile,pe=Me(()=>a.moveBuilding(b,G,z,i.rotation));if(!pe.ok){i.showToast(pe.reason??"Không thể đặt tại ô này!","⚠️");return}i.clearBuildToolModes(),i.refreshAll(),i.showToast(`✋ Đã dời "${I?.name??"công trình"}" sang vị trí mới!`,"✨")},i.onTouchCancelPlace=()=>{D=null};const ve=new Set;window.addEventListener("keydown",b=>{if(document.querySelector("dialog[open]")){ve.clear();return}b.target instanceof HTMLInputElement||b.target instanceof HTMLTextAreaElement||b.target instanceof HTMLSelectElement||b.target instanceof HTMLElement&&b.target.classList.contains("drag-handle")||ve.add(b.key.toLowerCase())}),window.addEventListener("keyup",b=>{ve.delete(b.key.toLowerCase())}),window.addEventListener("blur",()=>{ve.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&ve.clear()}),n.addEventListener("pointermove",b=>{J.has(b.pointerId)&&J.set(b.pointerId,{x:b.clientX,y:b.clientY});const w=n.getBoundingClientRect();if(J.size>=2){Ue(),ie=!1,Ve=!0;const K=Array.from(J.values()),O=Math.hypot(K[1].x-K[0].x,K[1].y-K[0].y),U=(K[0].x+K[1].x)*.5-w.left,te=(K[0].y+K[1].y)*.5-w.top;if(xe>8&&O>8){const Q=(U-w.width*.5)/r.zoom+r.x,H=(te-w.height*.5)/r.zoom+r.y,ce=O/xe;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*ce)),r.x=Q-(U-w.width*.5)/r.zoom,r.y=H-(te-w.height*.5)/r.zoom}xe=O;return}const I=b.clientX-w.left,G=b.clientY-w.top;if(!a.isVisitingNeighbor&&!Z&&!i.movingBuildingUid&&!i.pincerActive)for(const K of l.hotspots)K.kind==="bubble"&&Math.hypot(I-K.sx,G-K.sy)<=K.radius&&a.harvestBuildingBubble(K.id);const z=$t(I,G,r,w.width,w.height,a.grid);if(!i.pendingTouchTile)if(i.selectedCatalogItem&&!mt(i.selectedCatalogItem))D=tt(i.selectedCatalogItem,z.gx,z.gy,i.rotation);else if(i.moveModeActive&&i.movingBuildingUid){const K=a.state.buildings.find(U=>U.uid===i.movingBuildingUid),O=K?ne(K.itemId):void 0;D=O?tt(O,z.gx,z.gy,i.rotation,i.movingBuildingUid):{gx:z.gx,gy:z.gy}}else D={gx:z.gx,gy:z.gy};if(!Y)return;if(Le&&J.size===1&&Math.hypot(b.clientX-B,b.clientY-j)>8){const K=Le;Ue(),ie=!0,a.placeItem(K.item,K.gx,K.gy,K.rot)&&i.recordRecentDecorItem(K.item.id)}if(ie&&i.selectedCatalogItem){a.placeItem(i.selectedCatalogItem,z.gx,z.gy,i.rotation)&&i.recordRecentDecorItem(i.selectedCatalogItem.id);return}if(N&&i.activeSeedCropId){re(z.gx,z.gy,I,G);return}if(q&&i.activePastureAnimalId){be(z.gx,z.gy,I,G);return}if(de&&J.size===1&&!Ve){const K=Math.hypot(b.clientX-B,b.clientY-j);if(!de.active&&K>7&&(de.active=!0,a.batchOperationActive=!0,et(de.initialUid,de.mode,de.initialSx,de.initialSy)&&de.sweptUids.add(de.initialUid)),de.active){const O=fe(z.gx,z.gy,I,G,de.mode);O&&!de.sweptUids.has(O.uid)&&et(O.uid,O.mode,I,G)&&de.sweptUids.add(O.uid);return}}const pe=b.clientX-B,X=b.clientY-j,ae=i.selectedCatalogItem&&!mt(i.selectedCatalogItem)||i.moveModeActive&&i.movingBuildingUid?14:5;Math.hypot(pe,X)>ae&&(Z=!0,i.rideCamUid=null),Z&&(k=null,r.x=oe-pe/r.zoom,r.y=le-X/r.zoom)}),n.addEventListener("pointerdown",b=>{if(J.set(b.pointerId,{x:b.clientX,y:b.clientY}),J.size>=2){Ue(),ge();const X=Array.from(J.values());xe=Math.hypot(X[1].x-X[0].x,X[1].y-X[0].y),Ve=!0,ie=!1;return}if(a.beginBuildStroke(),b.button!==0&&b.button!==2)return;const w=n.getBoundingClientRect(),I=b.clientX-w.left,G=b.clientY-w.top,z=$t(I,G,r,w.width,w.height,a.grid);if(!i.pendingTouchTile)if(i.selectedCatalogItem&&!mt(i.selectedCatalogItem))D=tt(i.selectedCatalogItem,z.gx,z.gy,i.rotation);else if(i.moveModeActive&&i.movingBuildingUid){const X=a.state.buildings.find(K=>K.uid===i.movingBuildingUid),ae=X?ne(X.itemId):void 0;D=ae?tt(ae,z.gx,z.gy,i.rotation,i.movingBuildingUid):{gx:z.gx,gy:z.gy}}else D={gx:z.gx,gy:z.gy};Y=!0,Z=!1,B=b.clientX,j=b.clientY,oe=r.x,le=r.y;const pe=i.selectedCatalogItem;if(b.button===0&&pe&&mt(pe)&&!i.hasOpenFloatingTray()){if(b.pointerType==="touch"){Ue(),ie=!1;const X=i.rotation;Le={item:pe,gx:z.gx,gy:z.gy,rot:X,timer:window.setTimeout(()=>{Le=null,J.size===1&&!Ve&&Y&&(ie=!0,a.placeItem(pe,z.gx,z.gy,X)&&i.recordRecentDecorItem(pe.id))},75)}}else ie=!0,a.placeItem(pe,z.gx,z.gy,i.rotation)&&i.recordRecentDecorItem(pe.id);N=!1,q=!1}else if(b.button===0&&i.activeSeedCropId&&!i.selectedCatalogItem&&!i.moveModeActive&&!i.bulldozerActive&&!i.pincerActive&&re(z.gx,z.gy,I,G))ie=!1,N=!0,q=!1;else if(b.button===0&&i.activePastureAnimalId&&!i.selectedCatalogItem&&!i.moveModeActive&&!i.bulldozerActive&&!i.pincerActive&&be(z.gx,z.gy,I,G))ie=!1,N=!1,q=!0;else if(ie=!1,N=!1,q=!1,b.button===0&&!a.isVisitingNeighbor&&!i.selectedCatalogItem&&!i.activeSeedCropId&&!i.activePastureAnimalId&&!i.moveModeActive&&!i.bulldozerActive&&!i.pincerActive&&!i.hasOpenFloatingTray()){const X=fe(z.gx,z.gy,I,G);de=X?{mode:X.mode,initialUid:X.uid,initialSx:I,initialSy:G,active:!1,sweptUids:new Set}:null}else de=null});const yi=b=>{J.delete(b),J.size<2&&(xe=0)};window.addEventListener("pointercancel",b=>{Ue(),ge(),a.cancelBuildStroke(),yi(b.pointerId),Y=!1,Z=!1,ie=!1,N=!1,q=!1,Ve=!1}),window.addEventListener("pointerup",b=>{if(yi(b.pointerId),Ve){Ue(),ge(),$e(),J.size===0&&(Ve=!1,Y=!1,Z=!1,N=!1,q=!1);return}if(!Y)return;const w=ge();let I=!1;if(Le&&!Z&&b.target===n){const Q=Le;Ue();const H=a.canPlaceItem(Q.item,Q.gx,Q.gy,Q.rot);if(!H.ok){$e(),Y=!1,Z=!1,ie=!1,N=!1,q=!1,i.showToast(H.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(Q.item,Q.gx,Q.gy,Q.rot)&&i.recordRecentDecorItem(Q.item.id),I=!0}else Ue();$e();const G=Z,z=ie||I||N||q||w;if(Y=!1,Z=!1,ie=!1,N=!1,q=!1,G||z)return;if(b.button===2){i.clearBuildToolModes(),i.closeSeedTray(),i.closePastureTray(),i.collapseBuildDock(),i.closeHudPopovers(),i.inspectSelection=null,i.refreshAll();return}if(b.target!==n)return;const pe=i.pendingSowPlotUid,X=i.pendingStockPastureUid;if(i.closeHudPopovers(),i.hasOpenFloatingTray()&&(i.hideOpenFloatingTrays(),i.selectedCatalogItem||i.moveModeActive||i.bulldozerActive||i.pincerActive)){i.refreshAll();return}const ae=n.getBoundingClientRect(),K=b.clientX-ae.left,O=b.clientY-ae.top,U=$t(K,O,r,ae.width,ae.height,a.grid),te=b.pointerType==="touch";if(i.pincerActive){const Q=i.pincerPicked??(a.staff[0]?{kind:"staff",id:a.staff[0].id,label:a.staff[0].name}:null);Q&&a.dropPickedEntity(Q.kind,Q.id,U.gx,U.gy),i.clearBuildToolModes(),i.refreshAll();return}if(i.bulldozerActive){let Q=U.gx,H=U.gy;const ce=a.grid[H]?.[Q];if(!ce?.buildingUid&&(!ce||ce.path==="none")){for(const F of l.hotspots)if(F.kind==="building"&&Math.hypot(K-F.sx,O-F.sy)<=F.radius){const se=a.state.buildings.find(Se=>Se.uid===F.id);se&&(Q=se.gx,H=se.gy);break}}Me(()=>a.removeAtTile(Q,H)),i.refreshDock();return}if(i.moveModeActive){if(i.movingBuildingUid){const ce=i.movingBuildingUid,F=a.state.buildings.find(sa=>sa.uid===ce),se=F?ne(F.itemId):void 0,Se=se?tt(se,U.gx,U.gy,i.rotation,ce):{gx:U.gx,gy:U.gy},{bw:Ne,bh:Be}=se?a.getBuildingFootprint(se,i.rotation):{bw:1,bh:1},He=!!i.pendingTouchTile&&U.gx>=i.pendingTouchTile.gx&&U.gx<i.pendingTouchTile.gx+Ne&&U.gy>=i.pendingTouchTile.gy&&U.gy<i.pendingTouchTile.gy+Be;if(te&&!He&&(!i.pendingTouchTile||i.pendingTouchTile.gx!==Se.gx||i.pendingTouchTile.gy!==Se.gy)){D=Se,i.pendingTouchTile={gx:Se.gx,gy:Se.gy,label:se?.name??"Dời công trình"},i.refreshTouchConfirmBar();return}const Te=He?i.pendingTouchTile.gx:Se.gx,We=He?i.pendingTouchTile.gy:Se.gy,Ht=Me(()=>a.moveBuilding(ce,Te,We,i.rotation));if(!Ht.ok){i.showToast(Ht.reason??"Không thể đặt tại ô này!","⚠️");return}i.clearBuildToolModes(),i.refreshAll(),i.showToast(`✋ Đã dời "${se?.name??"công trình"}" sang vị trí mới!`,"✨");return}let H=a.grid[U.gy]?.[U.gx]?.buildingUid??null;if(!H){for(const ce of l.hotspots)if(ce.kind==="building"&&Math.hypot(K-ce.sx,O-ce.sy)<=ce.radius){H=ce.id;break}}if(H){const ce=a.state.buildings.find(F=>F.uid===H);if(ce?.isIndestructible){i.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(ce){i.movingBuildingUid=ce.uid,i.rotation=ce.rotation,D={gx:ce.gx,gy:ce.gy},i.refreshFloatingBanner();const F=ne(ce.itemId);i.showToast(`✋ Đang nhấc "${F?.name??"công trình"}" — chạm ô mới để đặt xuống!`,"✋");return}}}if(i.selectedCatalogItem){const Q=i.selectedCatalogItem,H=tt(Q,U.gx,U.gy,i.rotation);D=H;const ce=a.canPlaceItem(Q,H.gx,H.gy,i.rotation);if(!ce.ok){i.showToast(ce.reason??"Không thể đặt tại ô này!","⚠️");return}if(!Me(()=>a.placeItem(Q,H.gx,H.gy,i.rotation)))return;i.recordRecentDecorItem(Q.id),i.pendingTouchTile=null,Oi(Q)?te&&(D=It(Q,i.rotation)):(i.selectedCatalogItem=null,D=null,i.showToast(`🔨 Đã khởi công "${Q.name}" thành công!`,"✨")),i.refreshAll();return}for(const Q of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building","building_cutaway"]){let H=null,ce=1/0;for(let F=l.hotspots.length-1;F>=0;F--){const se=l.hotspots[F];if(se.kind!==Q)continue;const Se=Math.hypot(K-se.sx,O-se.sy);if(se.spriteKey&&typeof se.boxLeft=="number"&&typeof se.boxTop=="number"&&typeof se.boxW=="number"&&typeof se.boxH=="number"&&se.boxW>2&&se.boxH>2){const Ne=K>=se.boxLeft&&K<=se.boxLeft+se.boxW&&O>=se.boxTop&&O<=se.boxTop+se.boxH,Be=(K-se.boxLeft)/se.boxW,He=(O-se.boxTop)/se.boxH,Te=Ne&&s.hitTestAlpha(se.spriteKey,Be,He,!!se.flipX),We=(se.kind==="building"||se.kind==="building_cutaway")&&Se<=se.radius*.5;if(!Te&&!We)continue;if((H===null||Se<ce*.82)&&(H=se,ce=Se,Te))break}else Se<=se.radius&&Se<ce&&(ce=Se,H=se)}if(H){if(H.kind==="owl_post"){const F=l.collectOwlPostParcel();F&&a.claimOwlPostDelivery(F.gx,F.gy),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="visitor_gift"){const F=a.claimVisitedNeighborMysteryGift();F.ok?l.notifyJuice("harvest",H.sx,H.sy):i.showToast(F.msg,"🎁"),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="neighbor_help"){l.triggerSquash(H.id);const F=a.helpVisitedNeighborBuilding(H.id);F.ok?(l.notifyJuice("harvest",H.sx,H.sy),W(H.id)):i.showToast(F.msg,"💧"),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="home_lantern"){const F=a.ensureNeighborSocial().homeLanternMarks.find(Se=>Se.id===H.id);F&&l.triggerSquash(F.buildingUid);const se=a.claimHomeLanternMark(H.id);se.ok?l.notifyJuice("harvest",H.sx,H.sy):i.showToast(se.msg,"🏮"),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="unveil_building"){a.unveilBuilding(H.id),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="bubble"){a.harvestBuildingBubble(H.id),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="water_crop"){l.triggerSquash(H.id);const F=a.waterCropPlot(H.id);F.ok?l.notifyJuice("harvest",H.sx,H.sy):i.showToast(F.msg,"💧"),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="feed_pasture"){l.triggerSquash(H.id);const F=a.feedAnimalPasture(H.id);F.ok?l.notifyJuice("harvest",H.sx,H.sy):i.showToast(F.msg,"🌾"),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="escaped"){a.catchEscapedCreature(H.id),i.inspectSelection=null,i.refreshAll();return}if(H.kind==="zone_plaque"){i.clearBuildToolModes(),i.closeSeedTray(),i.inspectSelection={kind:"zone",zoneId:H.id},i.refreshAll();return}if(H.kind==="villager"){a.greetVillager(H.id),i.refreshAll();return}if(H.kind==="building"||H.kind==="building_cutaway"){const F=a.state.buildings.find(se=>se.uid===H.id);if(F){if(!a.isVisitingNeighbor&&F.awaitingUnveil){a.unveilBuilding(F.uid),i.inspectSelection=null,i.refreshAll();return}const se=ne(F.itemId),Se=!!(!a.isVisitingNeighbor&&se?.isFarmlandPlot&&F.cropId&&F.cropReadyAt&&Date.now()>=F.cropReadyAt),Ne=!!(!a.isVisitingNeighbor&&se?.isAnimalPasturePlot&&F.pastureAnimalId&&F.pastureReadyAt&&Date.now()>=F.pastureReadyAt);if(!Se&&!Ne&&l.triggerSquash(H.id),a.isVisitingNeighbor){const Te=a.getVisitedBuildingHelpStatus(F);if(Te.canHelp){const We=a.helpVisitedNeighborBuilding(F.uid);We.ok?(l.notifyJuice("harvest",H.sx,H.sy),W(F.uid)):i.showToast(We.msg,"💧")}else if(Te.existingMark)i.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${Te.existingMark.noteText}”`,"🏮");else{const We=ne(F.itemId),Ht=a.getActiveVisitingNeighbor();i.showToast(`🏡 Đang ngắm "${We?.name??"Công trình"}" (${F.stars}★) tại vườn ${Ht?.name??"bạn bè"}!`,Ht?.avatarEmoji??"🏡")}i.inspectSelection=null,i.refreshAll();return}const Be=a.ensureNeighborSocial().homeLanternMarks.find(Te=>Te.buildingUid===F.uid);if(Be&&a.claimHomeLanternMark(Be.id).ok){l.notifyJuice("harvest",H.sx,H.sy),i.inspectSelection=null,i.refreshAll();return}const He=ne(F.itemId);if(He?.isFarmlandPlot&&F.cropId&&F.cropReadyAt&&Date.now()>=F.cropReadyAt){a.harvestCropPlot(F.uid),i.inspectSelection=null,i.refreshAll();return}else if(He?.isFarmlandPlot&&F.cropId&&F.cropReadyAt&&Date.now()<F.cropReadyAt&&!F.cropWateredBoost){a.waterCropPlot(F.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),i.inspectSelection=null,i.refreshAll();return}else if(He?.isFarmlandPlot&&!F.cropId&&Date.now()>=F.constructEndsAt){if(i.activeSeedCropId){const Te=i.activeSeedCropId,We=a.plantCropOnPlot(F.uid,Te);if(We.needSeedAcquire){i.activeSeedCropId=null,i.inspectSelection=null,i.refreshAll(),i.openSeedQuizDialog(Te,F.uid);return}!a.state.sandboxMode&&a.getSeedCount(Te)<=0&&(i.activeSeedCropId=null),i.showToast(We.msg,We.ok?"🌱":"🪙"),i.inspectSelection=null,i.refreshAll()}else pe===F.uid?(i.inspectSelection={kind:"building",uid:F.uid},i.refreshAll()):i.openSeedTray(void 0,F.uid);return}else if(He?.isAnimalPasturePlot&&F.pastureAnimalId&&F.pastureReadyAt&&Date.now()>=F.pastureReadyAt){a.harvestAnimalPasture(F.uid),i.inspectSelection=null,i.refreshAll();return}else if(He?.isAnimalPasturePlot&&F.pastureAnimalId&&F.pastureReadyAt&&Date.now()<F.pastureReadyAt&&!F.pastureFedBoost){a.feedAnimalPasture(F.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),i.inspectSelection=null,i.refreshAll();return}else if(He?.isAnimalPasturePlot&&!F.pastureAnimalId&&Date.now()>=F.constructEndsAt){if(i.activePastureAnimalId){const Te=a.stockAnimalOnPasture(F.uid,i.activePastureAnimalId);i.showToast(Te.msg,Te.ok?"🐾":"🪙"),i.inspectSelection=null,i.refreshAll()}else X===F.uid?(i.inspectSelection={kind:"building",uid:F.uid},i.refreshAll()):i.openPastureTray(void 0,F.uid);return}else(F.storedGalleons>0||F.readyFarmGoods&&F.readyFarmGoods.length>0)&&a.harvestBuildingBubble(F.uid)}i.clearBuildToolModes(),i.closeSeedTray(),i.closePastureTray(),i.inspectSelection={kind:"building",uid:H.id},i.refreshAll();return}}}i.inspectSelection=null,i.refreshAll()}),n.addEventListener("contextmenu",b=>b.preventDefault()),n.addEventListener("wheel",b=>{b.preventDefault(),k=null;const w=n.getBoundingClientRect(),I=b.clientX-w.left,G=b.clientY-w.top,z=(I-w.width*.5)/r.zoom+r.x,pe=(G-w.height*.5)/r.zoom+r.y,X=b.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*X)),r.x=z-(I-w.width*.5)/r.zoom,r.y=pe-(G-w.height*.5)/r.zoom},{passive:!1});let Jt=performance.now(),xt=0;const Zs=new lo,vi=new Dr;ns(a.state);const nt=document.createElement("div");nt.id="gamepadRadialMenu",nt.className="aaa-gamepad-radial",nt.hidden=!0,nt.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${fs.map(b=>{const w=b.index*Math.PI*2/8,I=50+Math.cos(w)*37,G=50+Math.sin(w)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${b.index}" style="left:${I.toFixed(1)}%;top:${G.toFixed(1)}%;">${b.icon}<br/>${b.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(nt);let ut=null,en=!1;const Si=b=>{switch(b){case"seeds":i.openSeedTray();break;case"barn":i.openWorkshopDialog("barn");break;case"orders":{i.activeQuestTab="orders",i.renderQuestDialog(),i.root.querySelector("#questDialog")?.showModal();break}case"match3":i.openMatch3Dialog();break;case"arcade":i.openPuzzleArcadeDialog();break;case"seedquiz":i.openSeedQuizDialog();break;case"neighbors":i.openNeighborDialog("friends");break;case"feast":i.openHarvestFeastDialog();break}},Js=Fi(),ea=i.root.querySelector("#match3Dialog"),ta=i.root.querySelector("#puzzleArcadeDialog"),na=i.root.querySelector("#seedQuizDialog"),Cn=Array.from(i.root.querySelectorAll("dialog"));let tn=!1,Bt=!1;const kn=()=>{tn=!!(ea?.open||ta?.open||na?.open),Bt=tn||Cn.some(b=>b.open)};if(kn(),typeof MutationObserver<"u"){const b=new MutationObserver(()=>{kn()});for(const w of Cn)b.observe(w,{attributes:!0,attributeFilter:["open"]})}i.root.addEventListener("close",kn,!0);let at=0,wi=0;function Mn(b){if(at=0,document.hidden){Jt=b;return}const w=(b-Jt)/1e3;if(Jt=b,!Bt&&w>.002&&w<.5&&(vi.recordFrameFps(1/w),xt%90===0&&xt>0)){const O=vi.getHealthReport();Js?l.adaptiveDprCap=O.p5LowFps<46?1.15:O.p5LowFps<54?1.35:1.5:l.adaptiveDprCap=O.p5LowFps<46?1.25:O.p5LowFps<54?1.5:2}const I=Zs.poll();if(I.connected){if(I.panDx!==0||I.panDy!==0){k=null,i.rideCamUid=null;const O=380/r.zoom*Math.min(.05,w);r.x+=I.panDx*O,r.y+=I.panDy*O}if(I.radialOpen?(nt.hidden=!1,en=!0,I.radialActionId&&(ut=I.radialActionId),nt.querySelectorAll("[data-radial-idx]").forEach(O=>{O.dataset.selected=String(Number(O.dataset.radialIdx)===I.radialSliceIndex)}),I.confirmJustPressed&&ut&&(nt.hidden=!0,en=!1,Si(ut),ut=null)):en&&(nt.hidden=!0,en=!1,ut&&(Si(ut),ut=null)),I.cancelJustPressed){const O=Cn.filter(U=>U.open);O.length>0?O[O.length-1]?.close():i.hasOpenFloatingTray()&&i.hideOpenFloatingTrays()}}if((ve.has("w")||ve.has("arrowup")||ve.has("s")||ve.has("arrowdown")||ve.has("a")||ve.has("arrowleft")||ve.has("d")||ve.has("arrowright"))&&(k=null),k){const O=Math.min(1,Math.max(0,(b-k.startMs)/k.durationMs)),U=1-Math.pow(1-O,3);r.x=k.fromX+(k.toX-k.fromX)*U,r.y=k.fromY+(k.toY-k.fromY)*U,r.zoom=k.fromZoom+(k.toZoom-k.fromZoom)*U,O>=1&&(k=null)}const G=340/r.zoom*Math.min(.05,w);if(ve.size>0&&Bt&&ve.clear(),(ve.has("w")||ve.has("arrowup"))&&(i.rideCamUid=null,r.y-=G),(ve.has("s")||ve.has("arrowdown"))&&(i.rideCamUid=null,r.y+=G),(ve.has("a")||ve.has("arrowleft"))&&(i.rideCamUid=null,r.x-=G),(ve.has("d")||ve.has("arrowright"))&&(i.rideCamUid=null,r.x+=G),a.update(w),i.rideCamUid&&!tn){const O=a.state.buildings.find(te=>te.uid===i.rideCamUid),U=a.coasterCircuits.get(i.rideCamUid);if(U&&U.waypoints.length>=3){const te=to(U.waypoints,U.isClosed,Date.now()/1e3,3);if(te.length>0){const Q=te[0],H=Rn(Q.gx+.5,Q.gy+.5,r.viewRot??0),ce=H.wx,F=H.wy-(Q.elev*zi+10);r.x+=(ce-r.x)*Math.min(1,w*10),r.y+=(F-r.y)*Math.min(1,w*10),r.zoom+=(1.38-r.zoom)*Math.min(1,w*5),i.rideCamSpeedText=`${Q.speedKmh} km/h (${Q.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,xt%8===0&&i.refreshFloatingBanner()}}else if(O){const te=Date.now()/1e3,Q=O.gx+2+Math.cos(te*2.1)*1.4,H=O.gy+2+Math.sin(te*2.1)*1.4,ce=Rn(Q,H,r.viewRot??0);r.x+=(ce.wx-r.x)*Math.min(1,w*8),r.y+=(ce.wy-22-r.y)*Math.min(1,w*8),r.zoom+=(1.35-r.zoom)*Math.min(1,w*5),i.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",xt%12===0&&i.refreshFloatingBanner()}else i.rideCamUid=null,i.refreshFloatingBanner()}const z=a.getRealTimePeriod(),pe=a.getCurrentWeather(),X=Rn(3,17,r.viewRot??0),ae=Math.hypot(r.x-X.wx,r.y-X.wy)<420;if(o.updateSoundscape(Math.min(.1,w),z==="night"||z==="dusk",r.zoom,ae,pe.kind,a.getActiveFestival()!=="none"),!tn&&(!Bt||b-wi>=80)){wi=b;const O=i.pendingTouchTile?{gx:i.pendingTouchTile.gx,gy:i.pendingTouchTile.gy}:D;if(l.activeSeedBrushCropId=i.activeSeedCropId,l.activePastureBrushAnimalId=i.activePastureAnimalId,u&&!y){const H=!m&&!!(g&&!g.gpuDevice.contextLost)&&(a.state.settings.rendererMode??"webgl2")!=="canvas",ce=H?"webgl2":"canvas";u.mode!==ce&&(u.mode=ce,C&&(C.style.display=H?"block":"none"),H?(n.style.position="relative",n.style.zIndex="1",n.style.background="transparent"):(n.style.position="",n.style.zIndex="",n.style.background=""))}const U=y?.settings??u,te=g&&!g.gpuDevice.contextLost?U?.mode??"canvas":"canvas",Q=i.inspectSelection?.kind==="building"?i.inspectSelection.uid:null;if(te!=="webgl2"&&l.render(a,r,O,i.selectedCatalogItem,i.rotation,i.bulldozerActive,Q,i.movingBuildingUid,i.pincerPicked?.label??null),g&&U&&!g.gpuDevice.contextLost){if(te!=="canvas"){const H={wx:0,wy:0,active:!1};g.renderFrame(a,r,U,H,Date.now(),{hoverTile:O,selectedCatalogItem:i.selectedCatalogItem,rotation:i.rotation,bulldozerActive:i.bulldozerActive,selectedBuildingUid:Q,movingBuildingUid:i.movingBuildingUid,hotspotsOut:te==="webgl2"?l.hotspots:void 0,skipReadyBubbleSprites:te==="webgl2"}),te==="webgl2"&&l.renderWorldUiOverlays(a,r,Q,i.movingBuildingUid,!!(i.movingBuildingUid||i.selectedCatalogItem||i.bulldozerActive),!0,O,i.selectedCatalogItem,i.rotation,i.bulldozerActive,i.pincerPicked?.label??null)}y?.updateTelemetry(g.stats,b)}xt++,!Bt&&xt%6===0&&!i.photoModeActive&&l.renderMinimap(i.minimapCanvas,a,r)}at=requestAnimationFrame(Mn)}at=requestAnimationFrame(Mn),document.addEventListener("visibilitychange",()=>{document.hidden?(at&&(cancelAnimationFrame(at),at=0),a.saveToStorage(),o.pause()):(Jt=performance.now(),o.resume(),at||(at=requestAnimationFrame(Mn)))}),window.addEventListener("pagehide",()=>{a.saveToStorage()}),window.addEventListener("beforeunload",()=>{a.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{a.saveToStorage()});let xi=0,Ti="";const ia=a.onUiChange;a.onUiChange=()=>{ia?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:a.state.level,galleons:a.state.galleons}}));const b=Date.now(),w=`${a.state.level}|${a.state.match3.stars}|${a.state.unlockedZones.length}|${a.state.buildings.length}|${a.state.settings.weatherOverride}|${a.state.settings.timeOverride}`;w!==Ti&&b-xi>=1200&&(Ti=w,xi=b,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:a.state.parkName,level:a.state.level,magicStars:a.state.match3.stars,galleons:a.state.galleons,unlockedZonesCount:a.state.unlockedZones.length,buildingsCount:a.state.buildings.length,weatherMode:a.state.settings.weatherOverride,atmosphereMode:a.state.settings.timeOverride==="realtime"?"auto":a.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",b=>{if(a.isVisitingNeighbor)return;const w=String(b.detail?.mode||"auto");(w==="auto"||w==="none"||w==="halloween"||w==="christmas"||w==="quidditch_cup")&&(a.state.settings.activeFestival=w,a.saveToStorage(),i.refreshAll())}),window.addEventListener("hpvn:mute",b=>{const w=!!b.detail?.muted;a.state.settings.soundEnabled=!w,a.state.settings.bgmEnabled=!w,o.enabled=!w,o.bgmEnabled=!w,w?o.pause():o.resume(),a.saveToStorage(),i.refreshAll()}),window.addEventListener("gamesave:helpers",b=>{const w=b.detail;if(!w)return;const I=a.homeStateWhileVisiting??a.state,G=I===a.state?a.ensureNeighborSocial():I.neighborSocial??(I.neighborSocial=a.ensureNeighborSocial()),z=new Set(G.homeLanternMarks.map(U=>U.id)),pe=I.buildings[0]?.uid||"burrow_main_gate",X=Date.now(),ae=900*1e3,K=3600*1e3;let O=0;for(const U of w.helpers??[]){if(!U?.id||z.has(U.id)||G.homeLanternMarks.length>=5)continue;z.add(U.id);const te=U.buildingUid?I.buildings.find(H=>H.uid===U.buildingUid):void 0,Q=(te&&((te.cropReadyAt??0)>X||(te.pastureReadyAt??0)>X||(te.workshopQueue?.[0]?.endsAt??0)>X||(te.constructEndsAt??0)>X)?te:void 0)??I.buildings.find(H=>(H.cropReadyAt??0)>X||(H.pastureReadyAt??0)>X||(H.workshopQueue?.[0]?.endsAt??0)>X||(H.constructEndsAt??0)>X);if(Q)if((Q.cropReadyAt??0)>X)Q.cropReadyAt=Math.max(X,(Q.cropReadyAt??X)-ae),Q.cropWateredBoost=!0;else if((Q.pastureReadyAt??0)>X)Q.pastureReadyAt=Math.max(X,(Q.pastureReadyAt??X)-ae);else if((Q.workshopQueue?.[0]?.endsAt??0)>X)for(const H of Q.workshopQueue??[])H.startedAt-=ae,H.endsAt=Math.max(X,H.endsAt-ae);else(Q.constructEndsAt??0)>X+K&&(Q.constructEndsAt=Math.max(X+K,(Q.constructEndsAt??X)-ae));G.homeLanternMarks.push({id:U.id,buildingUid:Q?.uid||U.buildingUid||pe,helperId:U.uid,helperName:U.name||"Hàng Xóm Hang Sóc",helperEmoji:U.avatarEmoji||"🧙‍♂️",kind:U.kind||"water_crop",noteVi:U.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:U.at||X}),O++}O>0&&(a.saveToStorage(),i.refreshAll(),w.summaryVi&&i.showToast(w.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",b=>{const w=b.detail;if(!w)return;const I=a.homeStateWhileVisiting??a.state,G=I===a.state?a.ensureNeighborSocial():I.neighborSocial??(I.neighborSocial=a.ensureNeighborSocial());typeof w.dayKey=="string"&&w.dayKey&&(G.lastSocialResetKey=w.dayKey),typeof w.dailyGardenHelpsCount=="number"&&w.dailyGardenHelpsCount>(G.dailyGardenHelpsCount??0)&&(G.dailyGardenHelpsCount=w.dailyGardenHelpsCount)})}zr().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(n.map(o=>o.unregister()))}if("caches"in window){const n=await caches.keys().catch(()=>[]);await Promise.all(n.map(o=>caches.delete(o)))}window.location.reload()}))});export{Wi as M,_n as c,it as s};
