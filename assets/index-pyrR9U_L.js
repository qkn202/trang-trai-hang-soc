const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/seedQuizModal-DtW4AwJK.js","assets/game-data-BOwPeJa2.js","assets/sim-Cl6wRP0D.js","assets/minigameViewControls-CwO15pO8.js","assets/engine-CxL6P-XD.js","assets/seedQuizModal-Zz7Es-eq.css","assets/leaderboardModal-BsTCni7F.js","assets/match3Modal-D4SMxqUf.js","assets/levelBar-CRLODwLK.js","assets/levelBar-DNU9jeQj.css","assets/match3Modal-DmNrzkuL.css","assets/puzzleArcadeModal-h2lh13nQ.js","assets/webgl2WorldRenderer-BEz9ulJA.js"])))=>i.map(i=>d[i]);
var Ai=Object.defineProperty;var Li=(e,t,s)=>t in e?Ai(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var L=(e,t,s)=>Li(e,typeof t!="symbol"?t+"":t,s);import{g as le,G as Ye,ar as Ge,F as tt,P as kt,x as zs,at as Ea,v as ft,M as Wt,Z as es,a4 as Ia,C as Xt,a3 as Pi,D as st,w as Ei,B as qs,e as Ve,Y as Ja,A as Ii,au as ua,ao as Bi,ap as Hi,f as Ot,L as qi,ab as Us,V as wt,y as ls,_ as Di,a2 as Tn,N as Ri,O as Ni,R as Ds,a5 as Fi,H as jt,S as Oi,av as Ft,aw as _i,a7 as $n,a8 as kn,p as Ms,d as sa,aa,U as en,X as Vi,a6 as zi,T as Gs,ae as Ui}from"./game-data-BOwPeJa2.js";import{i as Be,j as ma,k as cs,C as ds,u as Gi,F as rs,l as Et,m as Cn,M as As,n as Wi,o as ji,p as Ki,q as ba,P as tn,t as Qi,v as Xi,x as Yi,y as Mn,H as Zi,z as Ji,A as fa,B as Ys,D as eo,G as to,I as An,J as Rs,K as so,L as ao,N as no,O as io,S as oo,Q as ro,R as Ln,U as Ba,V as lo,W as co,X as sn,Y as an,Z as Kt,_ as Pn,$ as po,a0 as go,a1 as uo,a2 as ha,a3 as nn,a4 as mo,a5 as bo,a6 as fo,a7 as En,a8 as Ws,a9 as ho,aa as js,ab as Yt,ac as pt,ad as Ns,ae as vo,af as Zt,ag as ps,ah as fs,d as yo,ai as na,aj as So,ak as wo,al as xo,am as on,an as rn,ao as To,ap as $o,aq as ko,ar as Co,as as Mo,at as Ao,au as Lo,av as Po,g as Ls,aw as At,ax as ia,E as ln,w as Qt,s as Eo,ay as Io,az as Bo,aA as Ho}from"./sim-Cl6wRP0D.js";import{s as qo,a as Do,i as Ro,b as Bt,c as No,f as cn,m as dn,d as Fo,e as Oo,S as _o,I as Vo,g as pn,C as zo}from"./engine-CxL6P-XD.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const r of l)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(l){const r={};return l.integrity&&(r.integrity=l.integrity),l.referrerPolicy&&(r.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?r.credentials="include":l.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(l){if(l.ep)return;l.ep=!0;const r=s(l);fetch(l.href,r)}})();const Ps={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function Uo(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const s=t.documentElement;s.setAttribute("data-colorblind",e.colorblindMode),s.setAttribute("data-font-scale",String(e.fontScale)),s.setAttribute("data-high-contrast",e.highContrast?"true":"false"),s.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function Go(e,t){t.ceiling.setAllVolumes(e.volumes)}const In=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Dò Mìn Phép Thuật",icon:"🧨"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],Wo=.18;function Es(e,t=Wo){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const s=e<0?-1:1,o=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((s*Math.min(1,o)).toFixed(3))}function jo(e,t){if(Math.hypot(e,t)<.35)return null;let o=Math.atan2(t,e);o<0&&(o+=Math.PI*2);const l=Math.PI*2/8,r=(o+l*.5)%(Math.PI*2);return Math.floor(r/l)%8}class Ko{constructor(){L(this,"prevConfirm",!1);L(this,"prevCancel",!1);L(this,"prevDpadUp",!1);L(this,"prevDpadDown",!1);L(this,"prevDpadLeft",!1);L(this,"prevDpadRight",!1)}poll(t){let s=t??null;if(!s&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const p=navigator.getGamepads();for(const g of p)if(g&&g.connected){s=g;break}}if(!s)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const o=Es(s.axes[0]??0),l=Es(s.axes[1]??0),r=Es(s.axes[2]??0),n=Es(s.axes[3]??0),c=!!s.buttons[0]?.pressed,i=!!s.buttons[1]?.pressed,d=!!s.buttons[4]?.pressed,a=!!s.buttons[12]?.pressed,$=!!s.buttons[13]?.pressed,f=!!s.buttons[14]?.pressed,u=!!s.buttons[15]?.pressed,S=c&&!this.prevConfirm,w=i&&!this.prevCancel,I=(u&&!this.prevDpadRight?1:0)-(f&&!this.prevDpadLeft?1:0),q=($&&!this.prevDpadDown?1:0)-(a&&!this.prevDpadUp?1:0);this.prevConfirm=c,this.prevCancel=i,this.prevDpadUp=a,this.prevDpadDown=$,this.prevDpadLeft=f,this.prevDpadRight=u;const P=d,h=P?jo(Math.abs(r)>0?r:o,Math.abs(n)>0?n:l):null,k=h!==null?In[h]?.actionId??null:null;return{connected:!0,panDx:P?0:o,panDy:P?0:l,cursorStepGx:I,cursorStepGy:q,radialOpen:P,radialSliceIndex:h,radialActionId:k,confirmJustPressed:S,cancelJustPressed:w}}}let Bn=null,ot=null,et=null,oa=null;function Hn(e){!et&&typeof document<"u"&&(et=document.getElementById("a11y-announcer")),!(!et||!e)&&(et.textContent="",requestAnimationFrame(()=>{et&&(et.textContent=e)}))}function Qo(e){const t=e.state.buildings.find(o=>o.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const s=Date.now();if(t.constructEndsAt>s)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-s)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const o=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-s)/1e3)),l=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${o} giây, tổng ${l} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function va(e){const t=e??Bn;if(!t||(!ot&&typeof document<"u"&&(ot=document.getElementById("a11y-farm-status")),!ot))return;const s=t.state,o=s.level,l=s.galleons.toLocaleString("vi-VN"),r=s.sandboxMode?"Vô hạn":String(s.match3?.stars??0),n=s.timeSand,c=s.farmBarn?.owlOrders??[],i=c.filter($=>t.canFulfillFarmOwlOrder($)).length,d=`${c.length} đơn hàng (${i} đơn đủ nông sản sẵn sàng giao)`,a=Qo(t);ot.innerHTML=`
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${o}</td></tr>
        <tr><th scope="row">Sickle</th><td>${l} Sickle</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${r}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${n}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${d}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${a}</td></tr>
      </tbody>
    </table>
  `.trim()}function Xo(e){Bn=e,!(typeof document>"u")&&(et||(et=document.getElementById("a11y-announcer"),et||(et=document.createElement("div"),et.id="a11y-announcer",et.className="visually-hidden",et.setAttribute("aria-live","polite"),et.setAttribute("aria-atomic","true"),document.body.appendChild(et))),ot||(ot=document.getElementById("a11y-farm-status"),ot||(ot=document.createElement("div"),ot.id="a11y-farm-status",ot.className="visually-hidden",ot.setAttribute("role","region"),ot.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(ot))),va(e),oa&&clearInterval(oa),oa=setInterval(()=>{va()},5e3))}const ra={init:Xo,announce:Hn,refresh:()=>va()},Yo={light:10,medium:20,heavy:35,success:[12,35,22],warning:[26,40,26],levelup:[18,40,28,40,45]};class qn{constructor(){L(this,"runtimeKind","web");L(this,"isNativeShell",!1)}async triggerHaptic(t){try{typeof navigator<"u"&&typeof navigator.vibrate=="function"&&navigator.vibrate(Yo[t]??10)}catch{}}async saveLocalBackup(t,s){return!1}async loadLocalBackup(t){return null}async scheduleNotification(t){if(typeof window>"u"||!("Notification"in window)||Notification.permission!=="granted")return!1;const s=Math.max(0,t.fireAtMs-Date.now());return s>6*3600*1e3?!1:(window.setTimeout(()=>{try{new Notification(t.title,{body:t.body})}catch{}},s),!0)}}function Zo(e=typeof window<"u"?window:void 0){if(!e||typeof e!="object")return"web";const t=e;if(t.__TAURI_INTERNALS__||t.__TAURI__)return"tauri-desktop";const s=t.Capacitor;if(s&&typeof s.isNativePlatform=="function"&&s.isNativePlatform()){const o=s.getPlatform?.().toLowerCase();if(o==="ios")return"capacitor-ios";if(o==="android")return"capacitor-android"}return"web"}class Jo{constructor(t,s=typeof window<"u"?window:{}){L(this,"runtimeKind");L(this,"isNativeShell",!0);L(this,"fallback",new qn);L(this,"winRef");this.runtimeKind=t,this.winRef=s??{}}async triggerHaptic(t){const s=this.winRef.Capacitor?.Plugins?.Haptics;if(s)try{if(t==="success"||t==="levelup"){if(s.notification){await s.notification({type:"SUCCESS"});return}}else if(t==="warning"){if(s.notification){await s.notification({type:"WARNING"});return}}else if(s.impact){const o=t==="heavy"?"HEAVY":t==="medium"?"MEDIUM":"LIGHT";await s.impact({style:o});return}}catch{}await this.fallback.triggerHaptic(t)}async saveLocalBackup(t,s){const o=`hangsoc_${t.replace(/[^a-zA-Z0-9_-]/g,"_")}.json`;if(this.runtimeKind==="tauri-desktop"&&this.winRef.__TAURI_INTERNALS__?.invoke)try{return await this.winRef.__TAURI_INTERNALS__.invoke("plugin:fs|write_text_file",{path:o,contents:s}),!0}catch{}const l=this.winRef.Capacitor?.Plugins?.Filesystem;if(l?.writeFile)try{return await l.writeFile({path:o,data:s,directory:"DOCUMENTS",encoding:"utf8"}),!0}catch{}return this.fallback.saveLocalBackup(t,s)}async loadLocalBackup(t){const s=`hangsoc_${t.replace(/[^a-zA-Z0-9_-]/g,"_")}.json`;if(this.runtimeKind==="tauri-desktop"&&this.winRef.__TAURI_INTERNALS__?.invoke)try{const l=await this.winRef.__TAURI_INTERNALS__.invoke("plugin:fs|read_text_file",{path:s});if(typeof l=="string")return l}catch{}const o=this.winRef.Capacitor?.Plugins?.Filesystem;if(o?.readFile)try{const l=await o.readFile({path:s,directory:"DOCUMENTS",encoding:"utf8"});if(typeof l?.data=="string")return l.data}catch{}return this.fallback.loadLocalBackup(t)}async scheduleNotification(t){const s=this.winRef.Capacitor?.Plugins?.LocalNotifications;if(s?.schedule)try{return await s.schedule({notifications:[{id:t.id,title:t.title,body:t.body,schedule:{at:new Date(Math.max(Date.now()+1e3,t.fireAtMs))}}]}),!0}catch{}return this.fallback.scheduleNotification(t)}}let la=null;function er(e){const t=Zo(e);return t==="web"?new qn:new Jo(t,e)}function tr(){return la||(la=er()),la}const sr={light:"light",success:"success",harvest:"medium",levelup:"levelup"},ar={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function Nt(e){const t=tr();if(t.isNativeShell)return t.triggerHaptic(sr[e]??"light"),!0;if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const s=navigator.userActivation;if(s&&!s.hasBeenActive)return!1;try{const o=ar[e]??15;return navigator.vibrate(o)}catch{return!1}}function x(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Fs=["path","shop","creature","decor"];function nr(e){return e.isZooFence||e.id==="burrow_stone_rune_fence"||e.id==="halloween_arch"||e.id==="hogsmeade_stone_bridge"||e.id==="floo_fireplace_gate"?"fences":e.isBench||e.id==="floating_candles_post"||e.id==="patronus_ward_lantern"?"lights":e.isFarmlandPlot||e.connectableGroup||e.id==="burrow_apple_orchard"||e.id==="whomping_willow"||e.id==="burrow_oak_tree"||e.id==="burrow_pine_tree"||e.id==="burrow_magic_tree"?"nature":"landmarks"}const ir=new Set(["path_cobble","path_snow_brick","path_wood_pier","marble_bench","floating_candles_post","patronus_ward_lantern","burrow_stone_rune_fence"]);function $t(e){return!!e.yuleCollection||e.id.startsWith("yule_")||e.id==="snowy_pines"}function Dn(e){return e.spriteKey?`/trang-trai-hang-soc/sprites/${e.spriteKey}.webp`:ir.has(e.id)?`/trang-trai-hang-soc/paintings/catalog/${e.id}.webp`:null}function Le(e){e.selectedCatalogItem=null,e.moveModeActive=!1,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.onBuildStateReset?.()}const or=12;function rr(){return[]}function lr(e,t){return[t,...e.filter(o=>o!==t)].slice(0,or)}const ms=[{mode:"none",label:"Nhiệt"},{mode:"cleanliness",label:"Vệ Sinh"},{mode:"wonder",label:"Kỳ Diệu"},{mode:"biome",label:"Sinh Thái"}];function cr(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
                id="chipHudSickle"
                data-fly-target="galleons"
                type="button"
                class="hg-res-item"
                aria-label="Sickle — Sổ Cái và Quầy Gringotts"
                title="Sổ Cái &amp; Quầy Gringotts"
              >
                <span class="hg-res-glyph hg-glyph-coin" aria-hidden="true">S</span>
                <span id="lblSickle" class="hg-res-val">1.450</span>
                <span id="btnPlusSickle" class="sr-only-hud">+</span>
              </button>

              <span
                id="btnHudSandChip"
                data-fly-target="sand"
                class="hg-res-item is-readonly"
                aria-label="Cát Thời Gian"
                title="Cát Thời Gian"
              >
                <span class="hg-res-glyph hg-glyph-gem" aria-hidden="true">◆</span>
                <span id="lblSand" class="hg-res-val">28</span>
                <span id="btnPlusSand" class="sr-only-hud">+</span>
              </span>

              <span
                id="btnHudMinigameHub"
                data-fly-target="stars"
                class="hg-res-item is-readonly"
                aria-label="Sao Phép Thuật"
                title="Sao Phép Thuật"
              >
                <img src="/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="hg-res-star-img" aria-hidden="true" />
                <strong id="lblHudHubStars" class="hg-res-val">3</strong>
                <span id="lblHudHubTrial" class="sr-only-hud"></span>
              </span>

              <button
                id="btnHudActiveBuilds"
                type="button"
                class="hg-res-item hg-res-build hidden"
                aria-label="Công trình đang xây dựng"
                title="Đang xây"
              >
                <span aria-hidden="true">🔨</span>
                <span id="lblActiveBuilds" class="hg-res-val">0</span>
              </button>
            </div>
          </div>

          <div id="tsParchmentBanner" class="sr-only-hud" aria-hidden="true">
            <span id="lblParkRibbonName">Hang Sóc</span>
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
                <img src="/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-round-img" aria-hidden="true" />
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
                  <rect x="8.5" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="8.5" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
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
            <button id="btnCloseManageMenu" type="button" class="hpvn-menu-close" aria-label="Đóng">✕</button>
          </div>

          <div class="manage-status-strip hg-menu-status">
            <span id="btnHudStarChip" class="stat-chip" title="Sao Phép Thuật"><img src="/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></span>
            <span id="btnHudHeartChip" class="stat-chip" title="Tim Bùa Gặt"><img src="/trang-trai-hang-soc/sprites/m3_icon_heart.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></span>
            <button id="btnHappySmiley" type="button" class="stat-chip stat-chip-btn" title="Sổ Cái">Vui <span id="lblWonder">4.5</span></button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">--:--</button>
          </div>

          <!-- Lưới điểm đến chuẩn Vườn Hagrid: Bản đồ, Thăm vườn, Hồ sơ/Cúp Nhà, Lễ hội, Sổ tay, Vali, Kho, Việc quê, Cài đặt -->
          <p class="hg-menu-group" id="hgMenuGroupPlaces">Điểm đến</p>
          <div class="hg-menu-grid" role="group" aria-labelledby="hgMenuGroupPlaces">
            <button id="btnOpenWorldMap" type="button" class="hg-menu-node" title="Đại Bản Đồ 10 Vùng Đất &amp; Lộ Trình 100 Cấp">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_world_map.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Bản Đồ</span>
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="hg-menu-node" title="Cổng Floo &amp; Thăm Vườn Bạn Bè (Phím N)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Thăm Vườn</span>
              <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenAlbum" type="button" class="hg-menu-node" title="Hồ Sơ, Cúp 4 Nhà &amp; Bảng Xếp Hạng">
              <span class="hg-menu-medal" aria-hidden="true">🏆</span>
              <span class="hg-menu-label">Hồ Sơ &amp; BXH</span>
              <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenHarvestFeast" type="button" class="hg-menu-node" title="Đại Tiệc Mùa Gặt Hang Sóc (30 Bậc)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Lễ Hội</span>
              <span id="badgeFeastCount" class="badge-dot hidden">1</span>
              <span id="badgeManageFeastCount" class="sr-only-hud hidden">0</span>
            </button>
            <button id="btnOpenMenuSeedQuiz" type="button" class="hg-menu-node" title="Sổ Tay Cổ Ngữ &amp; Học Viện Thần Chú Đa Ngữ">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_notebook.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Tay</span>
            </button>
            <button id="btnOpenSuitcase" type="button" class="hg-menu-node" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_suitcase.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Vali Thú</span>
              <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="hg-menu-node" title="Kho Nông Sản, Xưởng Chế Biến &amp; Tàu Hàng">
              <span class="hg-menu-medal" aria-hidden="true">🏡</span>
              <span class="hg-menu-label">Kho Xưởng</span>
              <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenFinance" type="button" class="hg-menu-node" title="Sổ Cái Tài Chính &amp; Việc Quê">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_ledger.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Cái</span>
            </button>
            <button id="btnOpenSettings" type="button" class="hg-menu-node" title="Cài Đặt Âm Nhạc, Thời Tiết &amp; Lưu Game">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_settings_gear.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Cài Đặt</span>
            </button>
          </div>

          <!-- HPVN 15/11: each group has a small name; seven games by their short tab names plus BXH, on the same 3-column grid -->
          <p class="hg-menu-group" id="hgMenuGroupGames">Trò chơi</p>
          <div class="hg-menu-games-pills" role="group" aria-labelledby="hgMenuGroupGames">
            <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 7.777 Màn (Phím J)">
              Bùa Gặt <small id="lblMatch3Lv" class="sr-only-hud">1/7777</small>
            </button>
            <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Dò Mìn Phép Thuật (Phím K)">
              Dò Mìn <small id="lblArcadeTowerLv" class="sr-only-hud">0/3885</small>
            </button>
            <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" aria-label="Số Học Huyền Bí">Số Học</button>
            <button type="button" data-switch-minigame="blocks" class="hg-game-pill" aria-label="Sinh Vật Huyền Bí">Sinh Vật</button>
            <button type="button" data-switch-minigame="jigsaw" class="hg-game-pill" aria-label="Tranh Ghép Phép Thuật">Tranh Ghép</button>
            <button type="button" data-switch-minigame="chess" class="hg-game-pill" aria-label="Bắn Cá Hồ Đen">Bắn Cá</button>
            <button type="button" data-switch-minigame="seedquiz" class="hg-game-pill" aria-label="Học Viện Thần Chú">Thần Chú</button>
          </div>

          <p class="hg-menu-group" id="hgMenuGroupTools">Công cụ</p>
          <div class="hg-menu-tools-row" role="group" aria-labelledby="hgMenuGroupTools">
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh &amp; vàng">Accio</button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" aria-pressed="false" title="Ghim bảng nhiệm vụ">Ghim NV</button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" aria-pressed="false" title="Hiện/ẩn Radar thu nhỏ">Radar</button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">Nhiệt</button>
            <button id="btnPhotoMode" type="button" class="brass-btn" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để chụp ảnh (Phím P)">Ảnh</button>
            <button id="btnMenuRotateCam" type="button" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">Bắc</button>
            <button id="btnMenuCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">Xuyên</button>
            <button id="btnMenuGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">Lưới</button>
            <button id="btnMenuLayoutEdit" type="button" aria-pressed="false" class="brass-btn" title="Chế độ quy hoạch toàn cảnh (Lưu/Hủy nháp &amp; 3 bản vẽ)">Quy hoạch</button>
            <button id="btnMenuStrollMode" type="button" aria-pressed="false" class="brass-btn" title="Chế độ đi dạo nhập vai trong thung lũng">Đi dạo</button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn" aria-pressed="false" title="Cuộn gọn thanh HUD quanh màn hình (Phím H)">Ẩn HUD</button>
            <!-- HPVN: the legal screen is gone, so no «Pháp Lý» button -->
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
              <div class="hs-section-title">🦉 Nhiệm Vụ</div>
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!e.questCollapsed}" style="padding:3px 9px;font-size:12px;">${e.questCollapsed?"+":"–"}</button>
            </div>
            <div id="questTrackerBody" class="${e.questCollapsed?"hidden":""}"></div>
          </aside>
        </div>
      </div>

      <!-- TOUCH PLACEMENT CONFIRM BAR (App Store Mobile/Tablet UX) -->
      <div id="touchConfirmBar" class="parchment-dark touch-confirm-bar hidden">
        <span id="lblTouchConfirm" style="font-size:13px;font-weight:700;color:#fde68a;"></span>
        <button id="btnTouchConfirmOk" type="button" class="brass-btn gold-cta" aria-label="Đặt">✓</button>
        <button id="btnTouchRotate" type="button" class="brass-btn" aria-label="Xoay">↻</button>
        <button id="btnTouchStash" type="button" class="brass-btn hidden" aria-label="Cất vào kho" title="Cất vào Kho Trang Trí (0 Sickle)">Cất</button>
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
        <span style="font-size:13px;font-weight:700;color:#fde68a;">Chụp ảnh</span>
        <button id="btnSavePhotoPng" type="button" class="brass-btn gold-cta">🔥 Floo</button>
        <button id="btnSaveYulePostcard" type="button" class="brass-btn yule-postcard-btn" title="Gửi ảnh thiệp Giáng Sinh khung thông tuyết qua Mạng Floo">Khung Thiệp</button>
        <button id="btnExitPhoto" type="button" class="brass-btn" aria-label="Thoát chế độ chụp ảnh">✕</button>
      </div>

      <!-- BUILDER LAYOUT EDIT MODE FLOATING BAR -->
      <div id="layoutEditBar" class="parchment-dark photo-mode-bar hidden" role="toolbar" aria-label="Chế độ quy hoạch toàn cảnh">
        <span style="font-size:12px;font-weight:700;color:#fde68a;">🔨 Quy hoạch</span>
        <button type="button" data-edit-preset="layout_1" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 1</button>
        <button type="button" data-edit-preset="layout_2" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 2</button>
        <button type="button" data-edit-preset="layout_3" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 3</button>
        <button id="btnEditSavePreset" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;" title="Lưu bố cục hiện tại vào ô bản vẽ đang chọn">Lưu bản</button>
        <button id="btnEditStashAll" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;">📦 Cất TT</button>
        <button id="btnEditRestoreAll" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;">🌸 Bày lại</button>
        <button id="btnEditCommit" type="button" class="brass-btn gold-cta" style="padding:4px 10px;font-size:12px;">✓ Lưu</button>
        <button id="btnEditCancel" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;" title="Hoàn nguyên về trước khi quy hoạch">✕ Hủy</button>
      </div>

      <!-- COMPACT RESTORE PILL WHEN HUD IS ROLLED UP -->
      <button
        id="btnHudRoundOrb"
        type="button"
        class="hud-round-orb-btn hidden"
        aria-pressed="false"
        aria-label="Hiện giao diện HUD"
      >
        <span id="lblHudRoundOrbTag" class="hud-round-orb-tag">Hiện HUD</span>
      </button>

      <!-- TOAST STACK -->
      <div id="toastStack" class="owl-toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>

      <!-- RIBBON UNVEIL WEASLEY CELEBRATION BANNER -->
      <div id="ribbonUnveilToastCard" class="ribbon-unveil-banner hidden" role="status" aria-live="polite"></div>

      <!-- FLY-TO-HUD WEB ANIMATIONS LAYER -->
      <div id="flyRewardLayer" class="fly-reward-layer" aria-hidden="true"></div>

      <!-- 4. BOTTOM-LEFT UNIFIED 4-CARD FARM & BUILD DOCK: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Xây Dựng -->
      <div id="tsCornerLeft" class="ts-corner-left hg-farm-dock" role="toolbar" aria-label="Nông trại và xây dựng">
        <button id="btnOpenQuests" type="button" class="ts-card-btn hg-dock-card" title="Đơn Hàng Cú &amp; Nhiệm Vụ Cốt Truyện" aria-label="Đơn Hàng Cú &amp; Nhiệm Vụ">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Đơn Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Hạt Giống &amp; Hoa Hang Sóc" aria-label="Kho Hạt Giống">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Kho Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Đồng Cỏ Chăn Thả" aria-label="Đồng Cỏ Chăn Thả">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_pasture_bell.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Chăn Thả</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Xây Dựng Bản Vẽ Công Trình" aria-label="Xây Dựng">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.webp" alt="" class="ts-card-art" aria-hidden="true" />
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
          <span id="badgeCornerPlayBonus" class="hg-play-game-tag">Bùa Gặt</span>
          <span class="hg-play-emblem" aria-hidden="true">
            <img id="imgCornerPlayIcon" src="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp" alt="" class="ts-card-art hg-play-art" />
            <span class="hg-play-triangle">▶</span>
          </span>
          <span id="lblCornerPlayStage" class="ts-card-label hg-play-stage">Màn 1</span>
          <small id="lblCornerPlaySub" class="hg-play-sub">0/1 màn</small>
        </button>
      </div>

      <!-- FLOATING SEED BRUSH TRAY (Swipe-to-Plant across unified Thửa Đất Canh Tác) -->
      <section id="seedBrushTray" class="parchment-panel seed-brush-tray hidden" aria-label="Túi hạt giống gieo nhanh"></section>

      <!-- FLOATING PASTURE ANIMAL BRUSH TRAY (Swipe-to-Stock across unified Đồng Cỏ Chăn Thả) -->
      <section id="pastureBrushTray" class="parchment-panel seed-brush-tray pasture-brush-tray hidden" aria-label="Khay chọn thú chăn thả"></section>

      <!-- BOTTOM OBJECT INSPECTOR SHEET -->
      <aside id="inspectorPanel" class="parchment-panel inspector-panel hidden" aria-label="Chi tiết đối tượng"></aside>

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
            <button id="btnToggleLayoutEdit" type="button" aria-pressed="false" class="brass-btn" title="Bật/tắt Chế Độ Quy Hoạch Nháp (có Lưu / Hoàn nguyên &amp; 3 Bản vẽ)">🔨 Quy hoạch</button>
          </div>
          <span role="separator" aria-orientation="vertical" class="build-toolbar-sep"></span>
          <div role="group" aria-label="Hoàn tác và đóng" class="build-toolbar-group">
            <button id="btnBuildUndo" type="button" aria-disabled="true" class="brass-btn" title="Hoàn tác xây dựng (Ctrl/Cmd+Z)">↶ Hoàn tác</button>
            <button id="btnBuildRedo" type="button" aria-disabled="true" class="brass-btn" title="Làm lại xây dựng (Ctrl/Cmd+Y)">↷ Làm lại</button>
            <button id="btnBuildDone" type="button" class="brass-btn gold-cta" title="Đóng chế độ xây dựng (Esc)">✓ Xong</button>
          </div>
        </div>

        <div class="parchment-dark bottom-bar" role="group" aria-label="Nhóm công trình xây dựng">
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_shop.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Công Trình</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_creature.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Sản Xuất</button>
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_path.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Đường</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_decor.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Trang Trí</button>
          <button type="button" data-decor-event="christmas" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_gift_box.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Giáng Sinh</button>
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
            <h2 id="questDialogTitle" class="modal-title">Đơn Cú &amp; Nhiệm Vụ</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="questDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 2: 100 LEVELS & 10 ZONES ROADMAP -->
      <dialog id="roadmapDialog" closedby="any" aria-labelledby="roadmapDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="roadmapDialogTitle" class="modal-title">Bản Đồ &amp; Lộ Trình</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="roadmapDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 3: FINANCE & MICRO-PRICING -->
      <dialog id="financeDialog" closedby="any" aria-labelledby="financeDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="financeDialogTitle" class="modal-title">Sổ Cái</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="financeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 4: UNIFIED PROFILE, HOUSE CUP & MINIGAME LEADERBOARDS -->
      <dialog id="albumDialog" closedby="any" aria-labelledby="albumDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="albumDialogTitle" class="modal-title">Hồ Sơ &amp; Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="albumDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 5: SETTINGS, BGM, SAVE & HEADMASTER PREVIEW -->
      <dialog id="settingsDialog" closedby="any" aria-labelledby="settingsDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="settingsDialogTitle" class="modal-title">Cài Đặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="settingsDialogContent"></div>
        </div>
      </dialog>

      <!-- HPVN: confirm before a demolition destroys a ready crop / animals / workshop job -->
      <dialog id="confirmDialog" closedby="any" aria-labelledby="confirmDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="confirmDialogTitle" class="modal-title">Xóa công trình?</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="confirmDialogText"></div>
          <div>
            <button id="btnConfirmKeep" type="button" class="brass-btn">Giữ lại</button>
            <button id="btnConfirmDelete" type="button" class="brass-btn gold-cta">Vẫn xóa</button>
          </div>
        </div>
      </dialog>

      <!-- DIALOG 6: OFFLINE WELCOME BACK -->
      <dialog id="offlineDialog" closedby="any" aria-labelledby="offlineDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="offlineDialogTitle" class="modal-title">Thu Hoạch Offline</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="offlineDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 7: FARMSTEAD STORAGE BARN, WORKSHOP, CARGO TRAIN & SYNERGIES -->
      <dialog id="workshopDialog" closedby="any" aria-labelledby="workshopDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="workshopDialogTitle" class="modal-title">Kho &amp; Xưởng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="workshopDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 8: MAGICAL CREATURE SANCTUARY SUITCASE -->
      <dialog id="suitcaseDialog" closedby="any" aria-labelledby="suitcaseDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="suitcaseDialogTitle" class="modal-title">Vali Thú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="suitcaseDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 9: ATTIC HARVEST MATCH-3 -->
      <dialog id="match3Dialog" closedby="any" aria-labelledby="match3DialogTitle">
        <div class="parchment-panel modal-inner m3-modal-inner">
          <div class="modal-header">
            <h2 id="match3DialogTitle" class="modal-title">Bùa Gặt Honeydukes</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title">Dò Mìn Phép Thuật</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">Học Viện Thần Chú</h2>
            <button id="btnSqHeaderSubView" type="button" class="brass-btn sq-header-subview-btn">Từ điển</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">Cổng Floo</h2>
            <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta nb-bxh-chip">BXH</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="neighborDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 13: HARVEST FEAST 30-TIER ACTION SEASON PASS -->
      <dialog id="harvestFeastDialog" closedby="any" aria-labelledby="harvestFeastDialogTitle">
        <div class="parchment-panel modal-inner feast-modal-inner">
          <div class="modal-header">
            <h2 id="harvestFeastDialogTitle" class="modal-title">Lễ Hội Mùa Gặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="harvestFeastDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 14: HOUSE CUP STARTUP INFO POPUP -->
      <dialog id="houseCupIntroDialog" closedby="any" aria-labelledby="houseCupIntroDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="houseCupIntroDialogTitle" class="modal-title">Cúp 4 Nhà Hogwarts</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="houseCupIntroDialogContent"></div>
        </div>
      </dialog>

    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function dr(e){const t=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.switchMinigame;e.closeHudPopovers(),!S||S==="match3"?e.openMatch3Dialog():S==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(S)})});const s=()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog")?.showModal()};e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",t),e.root.querySelector("#chipHudSickle")?.addEventListener("click",s),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")});const o=u=>{u?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",u=>{u.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",u=>{u.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",o),e.root.querySelector("#chipHudBarn")?.addEventListener("click",o),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive)e.collapseBuildDock(),Le(e);else{const S=e.selectedCatalogItem,w=!!(S&&$t(S)),I=S?.category;e.closeSeedTray(),e.closePastureTray(),Le(e),e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=w,e.activeCategory=w?"decor":I&&Fs.includes(I)?I:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers();const u=e.root.querySelector("#questTrackerPanel");u?.classList.toggle("hidden"),e.root.querySelector("#btnToggleQuestTrackerHud")?.setAttribute("aria-pressed",String(!!u&&!u.classList.contains("hidden")))}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const u=e.sim.getActiveConstructions(Date.now());if(u.length===0)return;e.activeBuildCycleIdx=(e.activeBuildCycleIdx+1)%u.length;const S=u[e.activeBuildCycleIdx],w=le(S.itemId),I=S.gx+(w?.width??1)*.5,q=S.gy+(w?.height??1)*.5;Le(e),e.onFocusGridSmooth?e.onFocusGridSmooth(I,q,Math.max(e.cam.zoom,.95)):Be(e.cam,I,q),e.inspectSelection={kind:"building",uid:S.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",u=>{u.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnHudRoundOrb")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#lblClock")?.addEventListener("click",u=>{u.stopPropagation(),e.toggleWeatherPopover()});const l=()=>{if(e.closeHudPopovers(),e.sim.isLayoutEditModeActive()){const u=e.sim.commitLayoutEditMode();Le(e),e.showToast(u.msg,"🔨")}else{const u=e.sim.enterLayoutEditMode();u.ok&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0),e.showToast(u.msg,u.ok?"🔨":"⚠️")}e.refreshAll()};e.root.querySelector("#btnToggleLayoutEdit")?.addEventListener("click",l),e.root.querySelector("#btnMenuLayoutEdit")?.addEventListener("click",l),e.root.querySelector("#btnMenuStrollMode")?.addEventListener("click",()=>{e.closeHudPopovers(),Le(e);const u=e.sim.toggleStrollMode();e.showToast(u.msg,"🧙"),e.refreshAll()}),e.root.querySelector("#btnEditCommit")?.addEventListener("click",()=>{const u=e.sim.commitLayoutEditMode();Le(e),e.showToast(u.msg,"🔨"),e.refreshAll()}),e.root.querySelector("#btnEditCancel")?.addEventListener("click",()=>{const u=e.sim.cancelLayoutEditMode();Le(e),e.showToast(u.msg,"↩"),e.refreshAll()}),e.root.querySelector("#btnEditStashAll")?.addEventListener("click",()=>{const u=e.sim.stashAllDecorItems();e.showToast(u.msg,u.ok?"📦":"⚠️"),e.refreshAll()}),e.root.querySelector("#btnEditRestoreAll")?.addEventListener("click",()=>{const u=e.sim.restoreAllStashedDecor();e.showToast(u.msg,u.ok?"🌸":"⚠️"),e.refreshAll()}),e.root.querySelectorAll("[data-edit-preset]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.editPreset;if(e.sim.activePresetSlot=S,e.sim.state.layoutPresets?.[S]){const w=e.sim.applyLayoutPreset(S);e.showToast(w.msg,w.ok?"🔨":"⚠️")}else{const w=e.sim.saveLayoutPreset(S);e.showToast(`Đã lưu "${w.label}" (${w.placements.length} công trình)!`,"🔨")}e.refreshAll()})}),e.root.querySelector("#btnEditSavePreset")?.addEventListener("click",()=>{const u=e.sim.activePresetSlot||"layout_1",S=e.sim.saveLayoutPreset(u);e.showToast(`Đã cập nhật "${S.label}" (${S.placements.length} công trình)!`,"🔨"),e.refreshAll()});const r=e.root.querySelector("#secondaryMapToolsBar");if(r&&typeof HTMLElement<"u"&&!("focusGroup"in HTMLElement.prototype)){const u=Array.from(r.querySelectorAll("button"));u.forEach((S,w)=>{S.tabIndex=w===0?0:-1}),r.addEventListener("focusin",({target:S})=>{S instanceof HTMLButtonElement&&u.includes(S)&&u.forEach(w=>{w.tabIndex=w===S?0:-1})}),r.addEventListener("keydown",S=>{if(u.length===0)return;const w=Math.max(0,u.findIndex(P=>P===document.activeElement)),I=typeof getComputedStyle=="function"&&getComputedStyle(r).direction==="rtl";let q=-1;S.key==="ArrowRight"?q=(w+(I?-1:1)+u.length)%u.length:S.key==="ArrowLeft"?q=(w+(I?1:-1)+u.length)%u.length:S.key==="Home"?q=0:S.key==="End"&&(q=u.length-1),q>=0&&(S.preventDefault(),u[q]?.focus())})}const n=u=>{const S=e.root.querySelector("#buildDrawer");if(!S)return;const w=Math.max(180,Math.round(S.clientWidth*.68))*u,I=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;S.scrollBy({left:w,behavior:I?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{n(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{n(1)});const c=(u,S)=>{u?.addEventListener("wheel",w=>{const I=S?u.querySelector(S):u;I&&I.scrollWidth>I.clientWidth+4&&Math.abs(w.deltaY)>Math.abs(w.deltaX)&&w.deltaY!==0&&(I.scrollLeft+=w.deltaY,w.preventDefault())},{passive:!1})};c(e.root.querySelector("#buildDrawer")),c(e.root.querySelector("#decorCollectionFilterBar")),c(e.root.querySelector("#seedBrushTray"),".seed-tray-scroll"),c(e.root.querySelector("#pastureBrushTray"),".seed-tray-scroll"),window.addEventListener("pointerdown",u=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const S=u.target;if(!S)return;const w=e.root.querySelector("#managePopoverMenu"),I=e.root.querySelector("#weatherPopoverMenu"),q=e.root.querySelector("#btnToggleManageMenu"),P=e.root.querySelector("#lblClock");w?.contains(S)||I?.contains(S)||q?.contains(S)||P?.contains(S)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnCloseManageMenu")?.addEventListener("click",()=>e.closeHudPopovers()),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()}),e.root.querySelector("#yuleEventBanner")?.addEventListener("click",()=>{e.activeQuestTab="quests",e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const i=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",i),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",i);const d=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",d),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",d),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const u=e.root.querySelector("#ribbonUnveilToastCard");u&&u.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const a=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",a),e.root.querySelector("#btnOpenZones")?.addEventListener("click",a),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",a),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const u=ms.findIndex(q=>q.mode===e.sim.heatmapMode),S=ms[(u+1)%ms.length];e.sim.heatmapMode=S.mode;const w=e.root.querySelector("#btnCycleHeatmap"),I=S.mode!=="none";w.textContent=S.label,w.setAttribute("data-active",String(I)),w.setAttribute("aria-pressed",String(I)),I&&e.showToast(`Đã bật ${S.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",u=>{const S=u.currentTarget;S.disabled||(S.disabled=!0,ma(e.gameCanvas,`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`).then(()=>e.showToast("Ảnh đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🔥")).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{S.disabled=!1}))}),e.root.querySelector("#btnSaveYulePostcard")?.addEventListener("click",u=>{const S=u.currentTarget;if(S.disabled)return;const w=e.gameCanvas,I=document.getElementById("gpuWorldCanvas"),q=document.createElement("canvas");q.width=Math.max(640,w.width),q.height=Math.max(360,w.height);const P=q.getContext("2d");if(!P)return;I&&I.style.display!=="none"&&I.width>0&&I.height>0&&P.drawImage(I,0,0,q.width,q.height),P.drawImage(w,0,0,q.width,q.height);const h=Math.max(640,q.width),k=Math.max(360,q.height),p=document.createElement("canvas");p.width=h,p.height=k;const g=p.getContext("2d");if(!g)return;g.drawImage(q,0,0,h,k);const b=Math.max(18,Math.round(Math.min(h,k)*.032));g.save(),g.strokeStyle="#14532d",g.lineWidth=b*1.15,g.strokeRect(b*.5,b*.5,h-b,k-b),g.strokeStyle="#f59e0b",g.lineWidth=Math.max(3,b*.18),g.strokeRect(b*.92,b*.92,h-b*1.84,k-b*1.84);const v=["#ef4444","#fbbf24","#34d399","#38bdf8"],T=Math.max(44,Math.round(h/18));for(let Z=b*2,re=0;Z<=h-b*2;Z+=T,re++){const B=v[re%v.length];g.fillStyle=B,g.beginPath(),g.arc(Z,b*.92,Math.max(4,b*.24),0,Math.PI*2),g.fill()}const F=Math.min(h-b*4,Math.max(360,Math.round(h*.62))),A=Math.max(44,Math.round(k*.078)),H=Math.round((h-F)*.5),K=k-b*1.4-A;g.fillStyle="rgba(20, 42, 32, 0.9)",g.strokeStyle="#fbbf24",g.lineWidth=2.5,g.beginPath(),g.roundRect(H,K,F,A,14),g.fill(),g.stroke();const V=Math.max(15,Math.round(A*.42));g.font=`700 ${V}px "Be Vietnam Pro", system-ui, sans-serif`,g.fillStyle="#fef3c7",g.textAlign="center",g.textBaseline="middle",g.fillText(`🎄 Giáng Sinh An Lành • ${e.sim.state.parkName} (Cấp ${e.sim.state.level}) ✨`,h*.5,K+A*.52),g.restore(),S.disabled=!0,ma(p,`Thiệp Giáng Sinh từ ${e.sim.state.parkName}, cấp ${e.sim.state.level}!`).then(()=>{e.sim.recordFlooShareOrPostcard?.("postcard"),e.showToast("Thiệp đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🎄")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{S.disabled=!1})}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",u=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const w=u.currentTarget;w.textContent=e.questCollapsed?"+":"–",w.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",u=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const S=u.currentTarget;S.textContent=e.minimapCollapsed?"+":"–",S.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingAutoPlace")?.addEventListener("click",()=>{e.onAutoPlaceSelected?.()}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{if(e.rideCamUid)cs(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${ds[e.cam.viewRot??0]}!`,"🧭");else if(e.sim.strollModeActive){const u=e.sim.castStrollCareWave();u.msg&&e.showToast(u.msg,"🪄"),e.refreshAll()}else e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?e.triggerRotateAction():e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){const u=e.selectedCatalogItem,S=$t(u),w=u.category;Le(e),e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=S,e.activeCategory=S?"decor":Fs.includes(w)?w:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive||e.moveModeActive||e.bulldozerActive||e.selectedCatalogItem?(Le(e),e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.strollModeActive?(e.sim.toggleStrollMode(!1),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnTouchStash")?.addEventListener("click",()=>{e.onTouchStashActiveBuilding?.()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{if(e.moveModeActive&&e.moveKeepActiveAfterDrop&&e.movingBuildingUid){e.movingBuildingUid=null,e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshAll();return}Le(e),e.onTouchCancelPlace?.(),e.refreshAll()});const $=u=>{const S=e.minimapCanvas.getBoundingClientRect(),w=(u.clientX-S.left)/S.width*e.minimapCanvas.width,I=(u.clientY-S.top)/S.height*e.minimapCanvas.height,q=e.minimapCanvas.width*.46/Ye,P=e.minimapCanvas.height*.44/Ye,h=(w-e.minimapCanvas.width*.5)/q,k=(I-8)/P,p=(h+k)*.5,g=(k-h)*.5,{fgx:b,fgy:v}=Gi(p,g,e.cam.viewRot??0),T=Math.max(0,Math.min(Ye-1,b)),F=Math.max(0,Math.min(Ye-1,v));e.rideCamUid=null,Be(e.cam,T,F)};let f=!1;e.minimapCanvas.addEventListener("pointerdown",u=>{f=!0,$(u)}),window.addEventListener("pointermove",u=>{f&&$(u)}),window.addEventListener("pointerup",()=>{f=!1}),e.root.querySelectorAll("[data-cat]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.cat;if(!Fs.includes(S))return;const w=e.activeCategory===S&&!(S==="decor"&&e.christmasTabActive);Le(e),e.inspectSelection=null,e.christmasTabActive=!1,w?e.activeCategory=null:(e.activeCategory=S,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,S==="decor"&&!["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)&&(e.activeDecorFilter="all")),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelectorAll("[data-decor-event]").forEach(u=>{u.addEventListener("click",()=>{const S=e.activeCategory==="decor"&&e.christmasTabActive;Le(e),e.inspectSelection=null,S?(e.activeCategory=null,e.christmasTabActive=!1):(e.activeCategory="decor",e.christmasTabActive=!0,e.buildSheetOpen=!0,e.mapToolsExpanded=!0),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{const u=!e.moveModeActive;Le(e),u&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời liên hoàn: Chạm từng công trình để dời chỗ (0 Sickle)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{const u=!e.bulldozerActive;Le(e),u&&(e.bulldozerActive=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("🧹 Chế độ Xóa: Kéo lướt để xóa đường/rào hoặc chạm công trình cần dọn!","🧹")),e.refreshAll()}),e.root.querySelector("#btnBuildUndo")?.addEventListener("click",u=>{if(u.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể hoàn tác thao tác của bạn bè!","🏡");return}const w=e.sim.undoBuild();e.showToast(w?"↶ Đã hoàn tác thao tác xây dựng gần nhất.":"Không có thao tác nào để hoàn tác.","↶"),e.refreshAll()}),e.root.querySelector("#btnBuildRedo")?.addEventListener("click",u=>{if(u.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể làm lại thao tác của bạn bè!","🏡");return}const w=e.sim.redoBuild();e.showToast(w?"↷ Đã làm lại thao tác xây dựng.":"Không có thao tác nào để làm lại.","↷"),e.refreshAll()}),e.root.querySelector("#btnBuildDone")?.addEventListener("click",()=>{e.collapseBuildDock(),Le(e),e.refreshAll()}),e.root.querySelector("#btnMenuRotateCam")?.addEventListener("click",()=>{cs(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${ds[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnMenuCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.closeHudPopovers(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnMenuGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.sim.saveToStorage(),e.closeHudPopovers(),e.refreshAll()}),window.addEventListener("keydown",u=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(u.target instanceof HTMLInputElement||u.target instanceof HTMLTextAreaElement||u.target instanceof HTMLSelectElement||u.target instanceof HTMLElement&&(u.target.isContentEditable||u.target.classList.contains("drag-handle")||u.target.closest('button, a, summary, [role="button"], [popover]')))){if(u.ctrlKey||u.metaKey||u.altKey){(u.ctrlKey||u.metaKey)&&(u.key==="z"||u.key==="Z")?(u.preventDefault(),u.shiftKey?e.sim.redoBuild():e.sim.undoBuild(),e.refreshAll()):(u.ctrlKey||u.metaKey)&&(u.key==="y"||u.key==="Y")&&(u.preventDefault(),e.sim.redoBuild(),e.refreshAll());return}if(u.key==="n"||u.key==="N")e.openNeighborDialog();else if(u.key==="r"||u.key==="R"){if(e.sim.isVisitingNeighbor)return;e.triggerRotateAction()}else if(u.key==="q"||u.key==="Q")cs(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${ds[e.cam.viewRot??0]}`,"🧭");else if(u.key==="e"||u.key==="E")cs(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${ds[e.cam.viewRot??0]}`,"🧭");else if(u.key==="v"||u.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(u.key==="m"||u.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}const S=!e.moveModeActive;Le(e),S&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("✋ Chạm chọn từng công trình để di dời liên hoàn (0 Sickle)!","✋")),e.refreshAll()}else if(u.key==="b"||u.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(u.key==="j"||u.key==="J")e.openMatch3Dialog();else if(u.key==="k"||u.key==="K")e.openPuzzleArcadeDialog();else if(u.key==="l"||u.key==="L")e.openLeaderboardDialog();else if(u.key==="h"||u.key==="H")e.toggleHudRollup();else if(u.key==="p"||u.key==="P")e.togglePhotoMode();else if(u.key==="x"||u.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}const S=!e.bulldozerActive;Le(e),S&&(e.bulldozerActive=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(u.key==="Escape"){if(e.sim.pendingBuildStroke&&e.sim.cancelBuildStroke(),e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,Le(e),e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else u.key===" "&&(e.rideCamUid=null,Be(e.cam,18,24.5),e.refreshFloatingBanner())}})}const pr=new RegExp("^\\s*(\\p{Extended_Pictographic}[️‍\\p{Extended_Pictographic}]*)\\s*","u"),gr=["#btnPaPhoenixTalisman, #btnM3PhoenixTalisman",".aaa-snack-btn","#btnPaRestart, #btnM3RestartStage","#btnPaAskFriendSos, #btnM3AskFriendSos"];function ur(e){const t=e?.ownerDocument;if(!e||!t?.createTreeWalker||e.querySelector(".pa-ico"))return;const s=t.createTreeWalker(e,4);for(let o=s.nextNode();o;o=s.nextNode()){const l=o.nodeValue??"";if(!l.trim())continue;const r=pr.exec(l);if(!r)return;o.nodeValue=l.slice(r[0].length);const n=qo(r[1]),c=Do(r[1]);if(!n&&!c)return;const i=t.createElement("span");i.className="pa-ico",n?i.append(Ro(t,n)):i.textContent=c,o.parentNode?.insertBefore(i,o);return}}function mr(e){const t=e.ownerDocument,s=t.defaultView,o=e.closest("dialog"),l=o?.dataset?.mgLayout;if(!s||!o?.id||!l||!(l==="portrait"||!!s.matchMedia?.("(max-height: 450px) and (orientation: landscape)").matches)||!("popover"in s.HTMLElement.prototype)||e.querySelector(".pa-more-menu"))return;const n=gr.map(d=>e.querySelector(d)).filter(d=>!!d);if(!n.length)return;const c=t.createElement("div");c.className="pa-more-menu",c.id=`${o.id}MoreMenu`,c.setAttribute("popover","auto"),c.append(...n);const i=t.createElement("button");i.type="button",i.className="pa-tool-btn pa-more-btn",i.setAttribute("popovertarget",c.id),i.setAttribute("aria-label","Thêm"),i.innerHTML='<span class="pa-ico">…</span><span class="pa-more-lbl">Thêm</span>',c.addEventListener("beforetoggle",d=>{d.newState==="open"&&(c.style.bottom=`${Math.round(s.innerHeight-e.getBoundingClientRect().top+6)}px`)}),c.addEventListener("click",d=>{d.target?.closest("button")&&c.hidePopover()}),e.append(i,c)}function fl(e){e?.querySelectorAll?.(".pa-controls-bar button").forEach(ur),e?.querySelectorAll?.(".pa-controls-bar").forEach(mr)}const bs=".pa-mode-tabs, .workshop-tabs, .lb-game-tabs, .lb-scope-pills, .hs-tabs, .sq-lang-tabs, .sq-view-switch, .pa-submode-switch";function br(e){(e instanceof HTMLElement&&e.matches(bs)?[e]:e.querySelectorAll(bs)).forEach(s=>{if(s.scrollWidth<=s.clientWidth+1)return;const o=s.querySelector(':scope > :is(.active, [aria-selected="true"], [data-active="true"], [aria-pressed="true"])');o&&(s.scrollLeft+=o.getBoundingClientRect().left-s.getBoundingClientRect().left-(s.clientWidth-o.offsetWidth)/2)})}function fr(e=document.body){const t=new Set,s=l=>l.nodeType===1&&(l.matches(bs)||!!l.querySelector(bs)),o=()=>{const l=[...t];t.clear(),l.forEach(r=>{r.isConnected&&br(r)})};new MutationObserver(l=>{const r=t.size===0;for(const n of l)n.type==="attributes"?n.target.hasAttribute("open")&&t.add(n.target):n.addedNodes.forEach(c=>{s(c)&&t.add(c)});r&&t.size&&requestAnimationFrame(o)}).observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["open"]}),e.addEventListener("click",l=>{const r=l.target?.closest?.(`:is(${bs}) > *`)?.closest('[id$="DialogContent"]');r&&requestAnimationFrame(()=>{r.scrollTop=0})},!0)}function hr(e){if(e<1e4)return e.toLocaleString("vi-VN");const[t,s]=e<1e6?[1e3,"k"]:e<1e9?[1e6,"tr"]:[1e9,"tỷ"];return`${(Math.floor(e/t*10)/10).toLocaleString("vi-VN")}${s}`}function vr(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive,typeof document<"u"&&(document.body.dataset.photoMode=e.photoModeActive?"true":"false");const s=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||s);const o=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,l=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||s||o||l),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!s),e.root.querySelector("#inspectorPanel")?.classList.toggle("hidden",e.photoModeActive||!e.inspectSelection),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),Da(e),Ra(e),ws(e),e.renderTutorialCoach()}function Rn(e){return e.photoModeActive?!1:!!e.inspectSelection||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function yr(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(as(e),Ht(e),e.closeSeedTray(),e.closePastureTray()),ws(e)}function ws(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const s=Rn(e),o=e.hudRolledUp&&!e.photoModeActive&&!s,l=e.sim.isVisitingNeighbor,r=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,n=!e.photoModeActive&&!l&&(e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen);t.classList.toggle("hud-building-focus",s),t.classList.toggle("hud-compact-rolled",o),t.classList.toggle("hud-sheet-or-tray-open",n),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||l||r||n);const c=e.root.querySelector("#btnToggleHudRollup");c&&(c.setAttribute("aria-pressed",String(e.hudRolledUp)),c.dataset.active=String(e.hudRolledUp),c.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const i=e.root.querySelector("#svgHudRollupChevron");i&&i.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const d=e.root.querySelector("#btnManageToggleHudRollup");d&&(d.textContent=e.hudRolledUp?"Mở HUD":"Ẩn HUD",d.setAttribute("aria-pressed",String(e.hudRolledUp)));const a=e.root.querySelector("#btnHudRoundOrb");a&&(a.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||s),a.setAttribute("aria-pressed",String(e.hudRolledUp)),a.dataset.rolled=String(e.hudRolledUp));const $=e.root.querySelector("#lblHudRoundOrbTag");$&&($.textContent="Hiện HUD");const f=e.root.querySelector("#svgRoundOrbChevron");f&&f.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),s&&(as(e),Ht(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#decorCollectionFilterBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function as(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const s=e.root.querySelector("#managePopoverMenu"),o=e.root.querySelector("#weatherPopoverMenu"),l=e.root.querySelector("#btnToggleManageMenu"),r=e.root.querySelector("#lblClock");s?.classList.add("hidden"),o?.classList.add("hidden"),l&&(l.setAttribute("aria-expanded","false"),l.setAttribute("data-active","false")),r&&r.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function Ht(e){e.buildSheetOpen=!1,e.activeCategory=null,e.christmasTabActive=!1,e.mapToolsExpanded=!1}function Nn(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function Fn(e){Ht(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.activeSeedCropId=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.activePastureAnimalId=null}function Ha(e,t,s){if(!t||!s)return;const o=t.getBoundingClientRect(),l=getComputedStyle(document.documentElement),r=w=>parseFloat(l.getPropertyValue(w))||0,n=Math.max(8,r("--host-inset-top")),c=Math.max(8,r("--host-inset-right")),i=Math.max(8,r("--host-inset-left")),d=Math.max(8,r("--host-inset-bottom"),r("--hpvn-safe-bottom"),r("--hpvn-dock")),a=Math.min(window.innerWidth-i-c,Math.max(248,s.offsetWidth||336)),$=Math.min(s.offsetHeight||420,window.innerHeight-n-d),f=o.left<window.innerWidth*.5?o.left:o.right-a,u=Math.max(i,Math.min(f,window.innerWidth-a-c)),S=Math.max(n,Math.min(o.bottom+8,window.innerHeight-d-$));s.style.left=`${Math.round(u)}px`,s.style.top=`${Math.round(S)}px`}function Sr(e,t){if(e.sim.isVisitingNeighbor){as(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const s=typeof t=="boolean"?t:!e.manageMenuOpen;if(as(e),!s)return;(Nn(e)||e.inspectSelection)&&(Fn(e),e.inspectSelection=null,e.refreshAll()),e.manageMenuOpen=!0;const o=e.root.querySelector("#managePopoverMenu"),l=e.root.querySelector("#btnToggleManageMenu");o&&l&&(o.classList.remove("hidden"),l.setAttribute("aria-expanded","true"),l.setAttribute("data-active","true"),Ha(e,l,o)),e.renderTutorialCoach()}function wr(e,t){const s=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(as(e),!s)return;e.weatherPopoverOpen=!0;const o=e.root.querySelector("#weatherPopoverMenu"),l=e.root.querySelector("#lblClock");o&&l&&(qa(e),o.classList.remove("hidden"),l.setAttribute("aria-expanded","true"),Ha(e,l,o)),e.renderTutorialCoach()}function qa(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const s=Date.now(),o=e.sim.getCurrentWeather(s),l=e.sim.getWeatherForecast(4,s),r=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${r?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${o.icon} ${x(o.labelVi)}</div>
        <div class="weather-current-buff">✨ ${x(o.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${l.map((n,c)=>{const i=c===0?"Nay":`+${Ge(Math.max(1,n.startsInSec))}`;return`
              <div class="weather-slot-row ${c===0?"is-now":""}">
                <span>${n.icon} ${x(n.labelVi)}</span>
                <span class="weather-slot-meta">${x(i)}</span>
              </div>
            `}).join("")}
      </div>
    `}function gn(e,t,s=!0){const o=t.toLocaleString("vi-VN");e.textContent=window.matchMedia("(max-width: 599px)").matches?hr(t):o,s&&(e.title=`${o} Sickle`,e.closest("button")?.setAttribute("aria-label",`${o} Sickle — Chạm để chơi kiếm thêm Sickle`))}function On(e,t){const s=e.root.querySelector("#lblSickle");if(!s)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),s.textContent="∞",e.displayedSickle=t;return}const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedSickle<0||o||Math.abs(t-e.displayedSickle)<=1){e.displayedSickle=t,gn(s,Math.round(t));return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const l=e.displayedSickle,r=performance.now(),n=420,c=i=>{const d=Math.min(1,(i-r)/n),a=1-Math.pow(1-d,3),$=Math.round(l+(t-l)*a);e.displayedSickle=$,gn(s,$,d>=1),d<1?e.galleonRollRaf=requestAnimationFrame(c):(e.displayedSickle=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(c)}function xr(e,t,s,o,l){const r=e.root.querySelector(`[data-fly-target="${t}"]`),n=e.root.querySelector("#flyRewardLayer");if(!r||!n)return;const c=()=>{r.classList.remove("hud-chip-pulse"),r.offsetWidth,r.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){c(),e.sim.audio.playFlyTick(0);return}const i=r.getBoundingClientRect();if(i.width<=0&&i.height<=0)return;const d=i.left+i.width*.5,a=i.top+i.height*.5,$=typeof o=="number"&&Number.isFinite(o)?Math.max(24,Math.min(window.innerWidth-24,o)):window.innerWidth*.5,f=typeof l=="number"&&Number.isFinite(l)?Math.max(24,Math.min(window.innerHeight-24,l)):window.innerHeight*.54,u={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},S=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(s))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,s)))));for(let w=0;w<S;w++){const I=document.createElement("div");I.className="fly-reward-token",I.dataset.kind=t,I.textContent=u[t],n.appendChild(I);const q=w/Math.max(1,S)*Math.PI*2+(Math.random()-.5)*.5,P=14+w%3*9,h=$+Math.cos(q)*P,k=f+Math.sin(q)*P*.7,p=(h+d)*.5+(w%2===0?-42:42),g=Math.min(k,a)-(48+w%3*18),b=560+w*48,v=w*52,T=I.animate([{transform:`translate3d(${h}px, ${k}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${h}px, ${k-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${p}px, ${g}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${d}px, ${a}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:b,delay:v,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});T.onfinish=()=>{I.remove(),c(),e.sim.audio.playFlyTick(w)}}}function ya(e,t=""){const s=e.trim();return s.replace(/^(?:[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]|\s)+/u,"")||s}const Tr=1200,It=[];let un=0,ca=0,Os=null;function yt(e,t,s="🦉"){const o=ya(t,s);if(o){if(Os?.isConnected&&Os.dataset.msg===o)return _n(Os);o!==It[It.length-1]&&(It.length>=3&&It.shift(),It.push(o),Sa(e))}}let mn=0;function _n(e,t){window.clearTimeout(mn),mn=window.setTimeout(()=>{const s=t??e.parentElement;e.remove();const o=s;if(o&&!o.childElementCount&&typeof o.hidePopover=="function")try{o.matches(":popover-open")&&o.hidePopover()}catch{}},3500)}function _s(e){const t=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!t)return null;const s=Array.from(e.root.querySelectorAll("dialog[open]")),o=s.length>0?s[s.length-1]:null;return o?t.parentElement!==o&&(o.appendChild(t),o.addEventListener("close",()=>{const l=Array.from(e.root.querySelectorAll("dialog[open]")),r=l.length>0?l[l.length-1]:e.root;t.parentElement!==r&&r.appendChild(t)},{once:!0})):t.parentElement!==e.root&&e.root.appendChild(t),t}function Sa(e){if(ca)return;const t=_s(e);if(!t){It.length=0;return}const s=t.childElementCount?un+Tr-Date.now():0;if(s>0){ca=window.setTimeout(()=>{ca=0,Sa(e)},s);return}const o=It.shift();if(!o)return;const l=document.createElement("div");l.className="parchment-dark owl-toast",l.dataset.msg=o,l.appendChild(document.createElement("span")).textContent=o,t.replaceChildren(l);const r=t;if(typeof r.showPopover=="function")try{t.hasAttribute("popover")||t.setAttribute("popover","manual"),t.matches(":popover-open")&&r.hidePopover?.(),r.showPopover()}catch{}Os=l,un=Date.now(),_n(l,t),It.length&&Sa(e)}function $r(e,t){const s=Math.max(1,Math.round(t.awaySeconds/60)),o=e.root.querySelector("#offlineDialogContent");o.innerHTML=`
      <dl class="hs-rows">
        <div><dt>Vắng mặt</dt><dd>${s.toLocaleString("vi-VN")} phút</dd></div>
        <div><dt>Sickle</dt><dd>+${t.galleonsEarned.toLocaleString("vi-VN")} Sickle</dd></div>
        <div><dt>XP</dt><dd>+${t.xpEarned.toLocaleString("vi-VN")}</dd></div>
        <div><dt>Công trình xong</dt><dd>${t.buildingsFinished}</dd></div>
      </dl>
      <form method="dialog" class="hs-dlg-actions"><button type="submit" class="brass-btn gold-cta">Nhận</button></form>
    `,e.root.querySelector("#offlineDialog").showModal()}function Da(e){const t=e.root.querySelector("#floatingModeBanner"),s=e.root.querySelector("#floatingBannerText"),o=e.root.querySelector("#btnFloatingAutoPlace"),l=e.root.querySelector("#btnFloatingSecondary"),r=e.root.querySelector("#btnFloatingSwap"),n=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!s||!l||!r||!n)){if(o?.classList.add("hidden"),r.classList.add("hidden"),n.classList.add("gold-cta"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const c=e.sim.state.buildings.find(d=>d.uid===e.rideCamUid),i=c?le(c.itemId):void 0;if(!c||!i)e.rideCamUid=null;else{t.classList.remove("hidden"),s.textContent=`🎥 ${i.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,l.textContent="🧭 90°",l.classList.remove("hidden"),n.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),s.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Chạm ô để thả`:"🤏 Điều phối nhân sự — Chạm ô để thả • Esc hủy",l.classList.add("hidden"),n.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const c=e.sim.state.buildings.find(d=>d.uid===e.movingBuildingUid),i=c?le(c.itemId):void 0;s.textContent=`✋ ${i?.name??"Dời chỗ"}`,l.textContent=`🔄 ${e.rotation*90}°`,l.classList.remove("hidden"),n.textContent="✕"}else s.textContent="✋ Chọn công trình để dời",l.classList.add("hidden"),n.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),s.textContent="🧹 Phá dỡ",l.classList.add("hidden"),n.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const c=e.selectedCatalogItem,i=c.category!=="path"&&c.category!=="terrain"&&!c.isFarmlandPlot&&!c.connectableGroup&&!c.isZooFence,d=c.category!=="path"&&c.category!=="terrain"&&!c.isCoasterTrackPiece&&!c.isZooFence&&!c.elevationDelta,a=e.sim.getEffectiveItemStarCost(c),$=a>0?`🌟 ${a}`:c.cost===0?"0 Sickle":`${c.cost.toLocaleString("vi-VN")} Sickle`;t.classList.remove("hidden"),s.textContent=`🏗️ ${c.name} • ${$}`,d&&o&&(o.textContent="⚡ Đặt Ngay",o.classList.remove("hidden"),n.classList.remove("gold-cta")),i?(l.textContent=`🔄 ${e.rotation*90}°`,l.classList.remove("hidden")):l.classList.add("hidden"),r.textContent="📦 Đổi",r.classList.remove("hidden"),n.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const c=tt[e.activeSeedCropId],i=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),s.textContent=`🌱 ${c.emoji} ${c.name} (${i})`,l.textContent="🌱 Đổi",l.classList.remove("hidden"),n.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const c=kt[e.activePastureAnimalId];t.classList.remove("hidden"),s.textContent=`🐾 ${c.emoji} ${c.name} (${c.cost.toLocaleString("vi-VN")} Sickle)`,l.textContent="🐾 Đổi",l.classList.remove("hidden"),n.textContent="✕";return}if(e.sim.strollModeActive&&!e.sim.isVisitingNeighbor){t.classList.remove("hidden"),s.textContent="🧙 Đi dạo · Chạm đường hoặc WASD",l.textContent="🪄 Chăm quanh",l.classList.remove("hidden"),n.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),s.textContent="👁️ Nhìn xuyên",l.classList.add("hidden"),n.textContent="✕";return}t.classList.add("hidden")}}function Ra(e){const t=e.root.querySelector("#touchConfirmBar"),s=e.root.querySelector("#lblTouchConfirm"),o=e.root.querySelector("#btnTouchRotate"),l=e.root.querySelector("#btnTouchStash");if(!t||!s)return;if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}const r=e.selectedCatalogItem??(e.moveModeActive&&e.movingBuildingUid?le(e.sim.state.buildings.find(i=>i.uid===e.movingBuildingUid)?.itemId??"")??null:null),n=!!(r&&r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence),c=!!(e.moveModeActive&&e.movingBuildingUid&&e.sim.canStashBuilding(e.movingBuildingUid));o?.classList.toggle("hidden",!n),l?.classList.toggle("hidden",!c),t.classList.remove("hidden"),s.textContent=`📍 ${e.pendingTouchTile.label}`}function Vn(e){const t=e.root.querySelector("#yuleEventBanner"),s=e.root.querySelector("#yuleEventBannerTitle"),o=e.root.querySelector("#yuleEventBannerTask"),l=e.root.querySelector("#yuleEventBannerProgress");if(!t||!s||!o||!l)return;const r=e.sim.getYuleEventStatus();if(e.photoModeActive||e.sim.isVisitingNeighbor||!r.active||!r.dayDef){t.classList.add("hidden");return}const n=r.dayDef.main,c=e.sim.getYuleTaskProgress(n.id),i=e.sim.getYuleTaskTarget(n.id),d=r.claimedMainDays.includes(r.day);s.textContent=`🎄 Yule • Ngày ${r.day}/36`,o.textContent=d?"Đã nhận phần thưởng":n.titleVi,l.textContent=d?"✓":`${Math.min(c,i)}/${i}`,t.classList.remove("hidden")}function zn(e){const t=e.sim.getYuleEventStatus();if(!t.active||!t.dayDef||e.photoModeActive||e.sim.isVisitingNeighbor){e.yuleReadySig="";return}const o=[t.dayDef.main,...t.dayDef.side].filter(r=>!(r===t.dayDef.main?t.claimedMainDays.includes(t.day):t.claimedSideTaskIds.includes(r.id))&&e.sim.getYuleTaskProgress(r.id)>=r.amount);if(o.length===0){e.yuleReadySig="";return}const l=o.map(r=>r.id).join("|");e.yuleReadySig!==l&&(e.yuleReadySig=l,e.showToast(`🎄 Yule: ${o.length} nhiệm vụ sẵn sàng — mở bảng Nhiệm Vụ để nhận!`,"🎄"))}function ts(e){const t=e.sim.isVisitingNeighbor;t&&(Le(e),e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Gn(e),Vn(e),zn(e),jn(e),Ks(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t);const s=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,o=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t||s||o),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),Da(e),Ra(e),ws(e),e.renderTutorialCoach()}function Un(e){const t=new Date,s=String(t.getHours()).padStart(2,"0"),o=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const l=e.sim.getCurrentWeather(t.getTime()),r=e.root.querySelector("#lblClock");if(r){const u=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";r.innerHTML=`<span>${s}:${o}</span>${u}`,r.setAttribute("aria-label",`${s}:${o} · ${l.labelVi}`),r.title=l.labelVi}e.weatherPopoverOpen&&qa(e);const n=e.sim.getActiveFestival(t),c=typeof e.sim.isWinterMainMapActive=="function"&&e.sim.isWinterMainMapActive();if(typeof document<"u"){const u=e.sim.isYuleVisualThemeActive(t)||c?"true":"false";document.documentElement.dataset.yuleTheme!==u&&(document.documentElement.dataset.yuleTheme=u)}const i=e.root.querySelector("#lblFestival");i&&(n==="lunar_tet"?(i.classList.remove("hidden"),i.textContent="🏮 Tết Việt +15% 🪙"):n==="mid_autumn"?(i.classList.remove("hidden"),i.textContent="🥮 Trung Thu +Hoa"):n==="halloween"?(i.classList.remove("hidden"),i.textContent="🎃 +35% XP"):n==="christmas"?(i.classList.remove("hidden"),i.textContent="🎄 Giáng Sinh +25% 🪙"):n==="quidditch_cup"&&!c?(i.classList.remove("hidden"),i.textContent="🏆 Quidditch +Cúp"):c?(i.classList.remove("hidden"),i.textContent="🎄 Đồi Tuyết Giáng Sinh"):i.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const d=e.sim.state,a=e.root.querySelector("#lblPuzzleHearts");if(a&&d.match3)if(d.sandboxMode)a.textContent="∞";else if(d.match3.hearts>=zs)a.textContent=`${d.match3.hearts}/${zs}`;else{const u=Math.max(0,Math.ceil((d.match3.nextHeartAt-Date.now())/1e3)),S=Math.floor(u/60),w=String(u%60).padStart(2,"0");a.textContent=`${d.match3.hearts} (${S}:${w})`}const $=e.root.querySelector("#btnHudActiveBuilds"),f=e.root.querySelector("#lblActiveBuilds");if($&&f){const u=e.sim.getActiveConstructions(Date.now());if(u.length===0)$.classList.add("hidden");else{$.classList.remove("hidden");const S=Math.max(1,Math.ceil((u[0].constructEndsAt-Date.now())/1e3));f.textContent=String(u.length),$.title=`Đang xây (${Ge(S)})`}}}function Gn(e){const t=e.sim.state,s=e.sim.getRequiredLevelTrial(),o=Math.max(0,t.xp)%rs,l=Math.max(6,Math.min(100,o/rs*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+Ea(t.level),e.root.querySelector("#barXpFill").style.width=`${l}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const n=e.root.querySelector("#lblParkRibbonName");if(n){const se=e.sim.getActiveVisitingNeighbor();n.textContent=se?`🚂 Thăm: ${se.avatarEmoji} ${se.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const c=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getTotalTowerClearedStages(),d=t.level>=ft?100:Math.min(100,Math.max(8,Math.round(c.current/Math.max(1,c.required)*100))),a=e.root.querySelector("#btnOpenRoadmap");a&&(a.style.setProperty("--hg-lvl-pct",String(d)),a.title=t.level>=ft?`👑 Cấp Tối Đa ${ft} • Rương XP: ${o}/${rs} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${c.current}/${c.required} màn • Rương XP: ${o}/${rs}`);const $=e.root.querySelector("#barLevelTopFill");$&&($.style.width=`${d}%`,$.parentElement&&($.parentElement.title=t.level>=ft?`👑 Đã đạt Cấp Tối Đa ${ft} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${c.current}/${c.required} màn mới • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`));const f=e.root.querySelector("#lblXpFraction");f&&(f.textContent=`🎁 ${o}/${rs}`);const u=e.sim.ensureFarmBarn(),S=e.sim.getBarnTotalUsed(),w=e.root.querySelector("#lblStorageBarn");w&&(w.textContent=`${S}/${u.capacity}`),On(e,t.galleons);const I=t.sandboxMode?"∞":String(t.match3?.stars??0),q=e.root.querySelector("#lblPuzzleStars");q&&t.match3&&(q.textContent=I);const P=e.root.querySelector("#lblHudHubStars");P&&(P.textContent=I);const h=e.root.querySelector("#lblHudHubTrial");h&&(t.level>=ft||t.sandboxMode||e.sim.isHeadmasterPreview||!s?h.textContent=`🌟 ${i.cleared}/${i.total}`:h.textContent=`🔥 ${s.icon} ${c.current}/${c.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const k=e.sim.getDisciplineStageInfo("match3"),p=e.sim.getLastPlayedMinigame();let g="🍬 Bùa Gặt",b="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp",v=k.isMaxed?`👑 ${k.maxStage}`:`Màn ${k.currentStage}`;if(p==="caro"){const se=e.sim.getDisciplineStageInfo("caro");g="🧨 Dò Mìn",b="/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1",v=se.isMaxed?`👑 ${Wt}`:`Màn ${se.currentStage}`}else if(p==="sudoku"){const se=e.sim.getDisciplineStageInfo("sudoku");g="🔢 Số Học",b="/trang-trai-hang-soc/sprites/m3_piece_scroll.webp",v=se.isMaxed?`👑 ${Wt}`:`Màn ${se.currentStage}`}else if(p==="blocks"){const se=e.sim.getDisciplineStageInfo("blocks");g="🦄 Sinh Vật",b="/trang-trai-hang-soc/sprites/beast_niffler.webp",v=se.isMaxed?`👑 ${Wt}`:`Màn ${se.currentStage}`}else if(p==="chess"){const se=e.sim.getDisciplineStageInfo("chess");g="🎯 Bắn Cá",b="/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2",v=se.isMaxed?`👑 ${Wt}`:`Màn ${se.currentStage}`}else if(p==="jigsaw"){const se=e.sim.getDisciplineStageInfo("jigsaw");g="🧩 Tranh Ghép",b="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp",v=se.isMaxed?`👑 ${Wt}`:`Màn ${se.currentStage}`}else p==="seedquiz"&&(g="🪄 Thần Chú",b="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp",v="Ôn Tập");const T=e.root.querySelector("#imgCornerPlayIcon");T&&T.getAttribute("src")!==b&&T.setAttribute("src",b);const F=ya(g),A=ya(v.replace("👑","Màn"));let H=0;if(!t.sandboxMode&&p==="match3"&&t.level<ft){const se=t.match3?.stars??0,Se=new Set(t.buildings.map(qe=>qe.itemId)),He=new Set(t.unlockedZones);for(const qe of es){if(He.has(qe.id)||t.level<qe.unlockLevel)continue;const Re=Ia(qe)-se;Re>=1&&Re<=25&&(H===0||Re<H)&&(H=Re)}for(const qe of Xt){if(qe.isThemeParkLegacy||Se.has(qe.id)||!e.sim.isCatalogItemUnlocked(qe))continue;const Re=e.sim.getEffectiveItemStarCost(qe),je=Re-se;Re>0&&je>=1&&je<=25&&(H===0||je<H)&&(H=je)}}const K=t.level>=ft?`Cấp ${ft}`:H>0?`Cần +${H} Sao`:`${c.current}/${c.required} màn`,V=t.level>=ft?`Cấp ${ft}`:H>0?`Cần thêm ${H} Sao · Lên cấp ${t.level+1}: ${c.current}/${c.required} màn`:`Lên cấp ${t.level+1}: ${c.current}/${c.required} màn`,Z=e.root.querySelector("#badgeCornerPlayBonus");Z&&(Z.textContent=F,Z.classList.remove("hidden"));const re=e.root.querySelector("#lblCornerPlayStage");re&&(re.textContent=A);const B=e.root.querySelector("#lblCornerPlaySub");B&&(B.textContent=K);const U=e.root.querySelector("#btnCornerPlayPuzzle");if(U){const se=`Chơi tiếp ${F} — ${A} · ${V}`;U.title=se,U.setAttribute("aria-label",se)}e.root.querySelectorAll("[data-switch-minigame]").forEach(se=>{const Se=se.dataset.switchMinigame===p;se.dataset.active=String(Se),Se?se.setAttribute("aria-current","true"):se.removeAttribute("aria-current")});const E=e.root.querySelector("#badgeBuildReadyCount");if(E){const se=new Set(t.buildings.map(qe=>qe.itemId)),Se=t.sandboxMode?999:t.match3?.stars??0,He=Xt.filter(qe=>{if(qe.isThemeParkLegacy)return!1;const Re=e.sim.getEffectiveItemStarCost(qe);return Re<=0||!e.sim.isCatalogItemUnlocked(qe)?!1:!se.has(qe.id)&&Se>=Re}).length;He>0&&!e.sim.isHeadmasterPreview?(E.textContent=String(He),E.classList.remove("hidden")):E.classList.add("hidden"),E.closest("button")?.setAttribute("aria-label",He>0&&!e.sim.isHeadmasterPreview?`Xây Dựng · ${He} bản vẽ đủ sao`:"Xây Dựng")}const de=e.root.querySelector("#lblMatch3Lv");de&&t.match3&&(de.textContent=k.isMaxed?`👑${k.maxStage}`:`${k.currentStage}/${k.maxStage}`);const oe=e.root.querySelector("#lblArcadeTowerLv");if(oe){const se=Math.max(0,i.cleared-k.clearedStages),Se=Wt*5;oe.textContent=se>=Se?`👑${Se}`:`${se}/${Se}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const he=e.sim.getActiveStoryQuest(),Ie=e.sim.getReadyOwlOrdersCount(),fe=(he?.completed?1:0)+t.owlQuests.filter(se=>se.completed&&!se.claimed).length+t.dailyQuests.filter(se=>se.completed&&!se.claimed).length,J=Ie+fe,M=J>0?J:u.owlOrders.length,O=e.root.querySelector("#badgeQuestCount");M>0?(O.textContent=String(M),O.classList.toggle("is-ready-green",Ie>0),O.classList.remove("hidden")):O.classList.add("hidden"),O.closest("button")?.setAttribute("aria-label",J>0?`Đơn Hàng Cú & Nhiệm Vụ · ${J} xong`:M>0?`Đơn Hàng Cú & Nhiệm Vụ · ${M} đơn`:"Đơn Hàng Cú & Nhiệm Vụ");const ee=e.sim.ensureMarketFairState().deals.filter(se=>!se.claimed&&(t.sandboxMode||e.sim.getFarmItemCount(se.inputItemId)>=se.inputQty)).length,ce=t.supply.cargoCrates.filter(se=>e.sim.getCargoCrateStockInfo(se).canFulfill).length+ee,ue=e.root.querySelector("#badgeWorkshopCount");ue&&(ce>0?(ue.textContent=String(ce),ue.classList.remove("hidden")):ue.classList.add("hidden"));const ge=e.sim.getClaimableRetentionCount().total,me=e.root.querySelector("#badgeCardCount");me&&(ge>0?(me.textContent=String(ge),me.classList.remove("hidden")):me.classList.add("hidden")),e.refreshSuitcaseBadge();const ve=e.root.querySelector("#badgeSuitcaseCount"),Te=ve&&!ve.classList.contains("hidden")?Math.max(0,Number.parseInt(ve.textContent||"0",10)||0):0,Ae=e.sim.getClaimableHarvestFeastCount(),ye=e.root.querySelector("#badgeManageMenuDot");if(ye){const se=ce+ge+Ae+Te;se>0?(ye.textContent=String(se),ye.classList.remove("hidden")):ye.classList.add("hidden")}Wn(e);const Ce=e.root.querySelector("#btnCycleHeatmap");if(Ce){const se=ms.find(He=>He.mode===e.sim.heatmapMode)??ms[0],Se=e.sim.heatmapMode!=="none";Ce.textContent=se.label,Ce.dataset.active=String(Se),Ce.setAttribute("aria-pressed",String(Se))}Un(e)}function Wn(e){const t=e.sim.state,s=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,o=t.buildings.some(r=>!!le(r.itemId)?.isCreatureHabitat),l=(t.match3?.hearts??zs)>=zs&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",l),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",s&&!o),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const r=e.root.querySelector("#btnToggleMinimap");r&&(r.textContent="–",r.setAttribute("aria-expanded","true"))}}function jn(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const s=e.sim.state,o=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const l=e.sim.getActiveStoryQuest(),r=s.owlQuests.slice(0,2);let n="";if(o&&!s.sandboxMode&&!e.sim.isHeadmasterPreview){const c=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getDisciplineStageInfo(o.kind);n+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:700;">
            <span>🔥 ${o.icon} ${x(o.shortVi)} (${i.currentStage}/${i.maxStage}) • ${c.current}/${c.required}</span>
            <button type="button" data-open-trial="${o.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(l){const c=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100)),i=e.sim.getStoryAutoActionPreview();n+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">${x(l.giverEmoji)} ${x(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${c}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${x(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${l.rewardSickle} Sickle</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;" title="${x(i.longLabel)}">${x(i.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const c of r){const i=Math.min(100,Math.round(c.progress/Math.max(1,c.targetAmount)*100));n+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${x(c.giverEmoji)} ${x(c.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${i}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(c.progress,c.targetAmount)}/${c.targetAmount}</span>
            ${c.completed?`<button type="button" data-claim="${x(c.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${c.rewardSickle}🪙 +${c.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=n,t.querySelectorAll("[data-claim]").forEach(c=>{c.addEventListener("click",()=>{e.sim.claimQuest(c.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(c=>{c.addEventListener("click",()=>{e.openTrialMinigame(c.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(c=>{c.addEventListener("click",()=>{const i=e.sim.completeStoryStepWithStar();if(i.ok){typeof i.placedGx=="number"&&typeof i.placedGy=="number"&&Be(e.cam,i.placedGx,i.placedGy);return}yt(e,i.msg,i.reason==="missing_gold"?"🪙":i.reason==="locked_level"?"🔒":"🌟"),i.reason==="open_match3"&&e.openTrialMinigame()})})}function Ks(e){const t=(B,U)=>{B&&(B.setAttribute("data-active",String(U)),B.setAttribute("aria-pressed",String(U)))},s=e.activeCategory==="decor"&&!!e.christmasTabActive;e.root.querySelectorAll("[data-cat]").forEach(B=>{const U=B.dataset.cat,E=U===e.activeCategory&&!(U==="decor"&&s);t(B,E)}),e.root.querySelectorAll("[data-decor-event]").forEach(B=>{t(B,s)}),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const o=e.root.querySelector("#btnRotate");if(o){const B=(e.rotation??0)*90;o.textContent=B>0?`🔄 Xoay ${B}°`:"🔄 Xoay"}const l=e.root.querySelector("#btnMenuRotateCam");if(l){const B=e.cam.viewRot??0;l.textContent=ds[B]}t(e.root.querySelector("#btnMenuCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnMenuGrid"),e.sim.state.settings.showGrid);const r=e.sim.isLayoutEditModeActive();t(e.root.querySelector("#btnToggleLayoutEdit"),r),t(e.root.querySelector("#btnMenuLayoutEdit"),r),t(e.root.querySelector("#btnMenuStrollMode"),e.sim.strollModeActive);const n=e.root.querySelector("#layoutEditBar");n&&(n.classList.toggle("hidden",!r||e.photoModeActive||e.sim.isVisitingNeighbor),n.querySelectorAll("[data-edit-preset]").forEach(B=>{const U=B.dataset.editPreset,E=e.sim.activePresetSlot===U,de=!!e.sim.state.layoutPresets?.[U];B.classList.toggle("gold-cta",E),B.setAttribute("aria-pressed",String(E));const oe=U==="layout_1"?1:U==="layout_2"?2:3;B.textContent=de?`Bản ${oe} ✓`:`Bản ${oe}`}));const c=e.root.querySelector("#btnBuildUndo"),i=e.root.querySelector("#btnBuildRedo"),d=e.sim.isVisitingNeighbor||(typeof e.sim.canUndoBuild=="function"?!e.sim.canUndoBuild():!0),a=e.sim.isVisitingNeighbor||(typeof e.sim.canRedoBuild=="function"?!e.sim.canRedoBuild():!0);c&&c.setAttribute("aria-disabled",String(d)),i&&i.setAttribute("aria-disabled",String(a));const $=e.root.querySelector("#btnAccioAll");$&&($.disabled=e.sim.isVisitingNeighbor);const f=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,u=e.root.querySelector("#secondaryMapToolsBar");u&&u.classList.toggle("hidden",!f);const S=f||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",f),ws(e),t(e.root.querySelector("#btnToggleBuildDock"),S);const I=e.root.querySelector("#buildDrawer"),q=e.root.querySelector("#buildDrawerSwipeBar"),P=e.root.querySelector("#decorCollectionFilterBar"),h=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Fs.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,I.classList.add("hidden"),q?.classList.add("hidden"),P?.classList.add("hidden"),h.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}I.classList.remove("hidden"),I.dataset&&(I.dataset.christmasDrawer=String(s)),h.classList.add("hidden");const k=e.recentDecorIds??[],p=new Map(k.map((B,U)=>[B,U])),g=new Map;for(const B of e.sim.state.buildings)g.set(B.itemId,(g.get(B.itemId)??0)+1);let b=0;for(const B of Object.values(e.sim.state.tileOverrides))B?.zooFence&&b++;b>0&&g.set("burrow_stone_rune_fence",b);const v=Xt.reduce((B,U)=>U.category==="decor"&&!U.isThemeParkLegacy&&$t(U)?B+Et(e.sim,U):B,0),T=Xt.reduce((B,U)=>U.category==="decor"&&!U.isThemeParkLegacy&&!$t(U)?B+Et(e.sim,U):B,0);if(P)if(e.activeCategory==="decor"&&s){P.classList.remove("hidden");const B=k.filter(oe=>{const he=le(oe);return!!(he&&$t(he))}).length,U=Xt.filter(oe=>oe.category==="decor"&&!oe.isThemeParkLegacy&&$t(oe)).length,E=e.activeChristmasFilter??"all",de=[{id:"all",label:`✨ Tất cả (${U})`},{id:"recent",label:B>0?`Gần đây (${B})`:"Gần đây"},{id:"stashed",label:v>0?`📦 Trong kho (${v})`:"📦 Trong kho"},{id:"vietnam_noel",label:"🏮 Noel Việt Nam"},{id:"yule_trees",label:"🌲 Cây tuyết"},{id:"yule_flowers",label:"🌺 Hoa đông"},{id:"modular",label:"❄️ Hàng rào"},{id:"landmarks",label:"🏰 Địa danh"},{id:"hogwarts_crests",label:"🦁 4 Nhà"},{id:"burrow",label:"Hang Sóc"},{id:"hogwarts",label:"🕯️ Dạ vũ"},{id:"hogsmeade",label:"🍺 Hogsmeade"},{id:"express",label:"🚂 Cú & Tàu"},{id:"creatures",label:"🦌 Sinh vật"},{id:"book_lore",label:"📖 Điển tích"}];P.innerHTML=de.map(oe=>{const he=E===oe.id;return`<button type="button" role="tab" aria-selected="${he}" data-decor-filter="${oe.id}" class="decor-filter-chip ${he?"active is-active":""}">${oe.label}</button>`}).join(""),P.querySelectorAll("[data-decor-filter]").forEach(oe=>{oe.addEventListener("click",()=>{e.activeChristmasFilter=oe.dataset.decorFilter??"all",I.scrollLeft=0,Ks(e)})})}else if(e.activeCategory==="decor"){P.classList.remove("hidden");const B=k.filter(oe=>{const he=le(oe);return!!(he&&he.category==="decor"&&he.id!=="farmland_plot"&&!$t(he))}).length,E=["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)?e.activeDecorFilter:"all",de=[{id:"all",label:"✨ Tất cả"},{id:"recent",label:B>0?`Gần đây (${B})`:"Gần đây"},{id:"stashed",label:T>0?`📦 Trong kho (${T})`:"📦 Trong kho"},{id:"nature",label:"🌿 Cây & Hoa"},{id:"fences",label:"🚧 Rào & Cổng"},{id:"lights",label:"🕯️ Đèn & Ghế"},{id:"landmarks",label:"⛲ Tiểu cảnh"}];P.innerHTML=de.map(oe=>{const he=E===oe.id;return`<button type="button" role="tab" aria-selected="${he}" data-decor-filter="${oe.id}" class="decor-filter-chip ${he?"active is-active":""}">${oe.label}</button>`}).join(""),P.querySelectorAll("[data-decor-filter]").forEach(oe=>{oe.addEventListener("click",()=>{e.activeDecorFilter=oe.dataset.decorFilter??"all",I.scrollLeft=0,Ks(e)})})}else P.classList.add("hidden");const F=e.activeCategory==="decor"&&(s?(e.activeChristmasFilter??"all")==="recent":e.activeDecorFilter==="recent"),A=e.activeCategory==="decor"&&(s?(e.activeChristmasFilter??"all")==="stashed":e.activeDecorFilter==="stashed"),H=["farmland_plot","burrow_animal_pasture","burrow_flower_garden","burrow_chicken_coop","burrow_pumpkin_gnomes","burrow_apple_orchard"],K=Xt.filter(B=>{if(B.category==="terrain"||B.isThemeParkLegacy)return!1;if(e.activeCategory==="creature")return B.category==="creature"||H.includes(B.id);if(B.category!==e.activeCategory)return!1;if(e.activeCategory==="decor"){const U=$t(B);if(s){if(!U)return!1;const de=e.activeChristmasFilter??"all";return de==="recent"?p.has(B.id):de==="stashed"?Et(e.sim,B)>0:de==="all"?!0:B.id==="snowy_pines"?de==="yule_trees"||de==="hogsmeade":B.yuleCollection===de}if(U||B.id==="farmland_plot")return!1;const E=e.activeDecorFilter;return E==="recent"?p.has(B.id):E==="stashed"?Et(e.sim,B)>0:E==="nature"||E==="fences"||E==="lights"||E==="landmarks"?nr(B)===E:!0}return!0});F?K.sort((B,U)=>(p.get(B.id)??999)-(p.get(U.id)??999)):e.activeCategory==="creature"&&K.sort((B,U)=>{const E=H.indexOf(B.id),de=H.indexOf(U.id);return E!==-1||de!==-1?(E===-1?999:E)-(de===-1?999:de):B.unlockLevel-U.unlockLevel});const V=e.sim.state.sandboxMode,Z=e.sim.state.match3?.stars??0,re=e.sim.state.galleons;if(K.length===0&&(F||A)){I.innerHTML=`
        <div class="catalog-empty-hint">
          ${A?"Kho Trang Trí hiện đang trống — bấm vào món trang trí ngoài sân rồi chọn <strong>Cất</strong> để lưu giữ nhé!":"Chưa có vật phẩm vừa đặt gần đây — hãy chọn một món trong <strong>✨ Tất cả</strong> nhé!"}
        </div>
      `,bn(e,I);return}I.innerHTML=K.map(B=>{const U=Et(e.sim,B),E=U===0&&!e.sim.isCatalogItemUnlocked(B),de=e.selectedCatalogItem?.id===B.id,oe=B.elevationDelta?B.elevationDelta>0?"⛰️":"⛏️":B.isCoasterTrackPiece?"🛤️":B.isZooFence?"🚧":B.isBench?"🪑":B.category==="path"?"🛣️":B.category==="terrain"?"🌿":"🕯️",he=Dn(B),Ie=he?`<img src="${he}" alt="${x(B.name)}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${oe}</div>`,fe=e.sim.getEffectiveItemStarCost(B),M=fe>0&&!B.connectableGroup&&B.category!=="decor"&&e.sim.state.buildings.some(ye=>ye.itemId===B.id),O=U===0&&!V&&!E&&fe>0&&Z<fe,j=U===0&&!V&&!E&&fe===0&&re<B.cost,ee=U===0&&(O&&!M||j),ce=Pi(B),ue=ce>0?` • ⏱️ ${st(ce)}`:"",ge=fe>0?`🌟 ${fe}`:`🪙 ${B.cost.toLocaleString("vi-VN")} Sickle`,me=U>0?`📦 Kho: ${U} • 0 Sickle`:E?`🔒 Cấp ${B.unlockLevel} • ${ge}${ue}`:M?O?`✅ Đã xây • 🌟 ${Z}/${fe}`:`✅ Đã xây • 🌟 ${fe}`:O?`🌟 ${Z}/${fe}${ue}`:fe>0?`🌟 ${fe}${ue}`:j?`🪙 ${re.toLocaleString("vi-VN")}/${B.cost.toLocaleString("vi-VN")} Sickle${ue}`:`🪙 ${B.cost.toLocaleString("vi-VN")} Sickle${ue}`,ve=s&&$t(B),Te=g.get(B.id)??0,Ae=Te>0&&(!M||Te>1)?`<span class="catalog-card-placed-badge">Đã đặt ${Te}</span>`:"";return`
          <button
            type="button"
            class="catalog-card ${ve?"yule-festive-card":""} ${E?"locked":""} ${ee?"short-resource":""}"
            data-item-id="${B.id}"
            data-selected="${de}"
            aria-pressed="${de}"
            ${E||ee?'aria-disabled="true"':""}
          >
            ${Ae}
            ${ve?'<span class="yule-card-twinkle" aria-hidden="true">❄</span>':""}
            ${Ie}
            <div class="catalog-card-title">${x(B.name)}</div>
            <div class="catalog-card-sub ${ee?"is-short":""}">${me}</div>
          </button>
        `}).join(""),I.querySelectorAll("[data-item-id]").forEach(B=>{B.addEventListener("click",()=>{const U=le(B.dataset.itemId);if(!U)return;const E=e.sim.getEffectiveItemStarCost(U),de=e.sim.state.match3?.stars??0,oe=Et(e.sim,U)>0;if(!oe&&!e.sim.isCatalogItemUnlocked(U)){const fe=e.sim.getWinsProgressForCurrentLevel();let J=Math.max(1,fe.required-fe.current);for(let O=e.sim.state.level+1;O<U.unlockLevel;O++)J+=Ei(O);const M=E>0?` hoặc ${E} Sao (${de}/${E})`:"";yt(e,`Mở ở Cấp ${U.unlockLevel}${M} · cần thêm ${J.toLocaleString("vi-VN")} màn.`,"🔒");return}if(!oe&&!e.sim.state.sandboxMode&&E>0&&de<E){const fe=!U.connectableGroup&&U.category!=="decor"?e.sim.state.buildings.find(M=>M.itemId===U.id):void 0;if(fe){Le(e),e.inspectSelection={kind:"building",uid:fe.uid},Be(e.cam,fe.gx+U.width*.5,fe.gy+U.height*.5),e.onCameraJump?.(),Ht(e),ts(e),yt(e,`Đã chọn "${U.name}" · bấm "✋ Dời" để đổi vị trí.`,"✋");return}const J=E-de;yt(e,`Thiếu ${J} Sao (${de}/${E}).`,"🌟");return}if(!oe&&!e.sim.state.sandboxMode&&E===0&&e.sim.state.galleons<U.cost){const fe=U.cost-e.sim.state.galleons;yt(e,`🪙 Thiếu ${fe.toLocaleString("vi-VN")} Sickle (hiện có ${e.sim.state.galleons.toLocaleString("vi-VN")}/${U.cost.toLocaleString("vi-VN")} Sickle) để dựng "${U.name}"!`,"🪙");return}Le(e),e.selectedCatalogItem=U,e.inspectSelection=null,Ht(e),ts(e),e.onSelectCatalogItem?.(U);const he=Cn(U),Ie=typeof window<"u"&&!!window.matchMedia?.("(pointer: coarse)")?.matches;yt(e,he?`🏗️ Đã chọn "${U.name}" — Chạm hoặc kéo liên tục trên bản đồ để đặt!`:Ie?`🏗️ Đã chọn "${U.name}" — Kéo/chạm ô chỉnh vị trí rồi bấm ✓ Đặt (hoặc bấm ⚡ Đặt Ngay)!`:`🏗️ Đã chọn "${U.name}" — Chạm một lần vào ô xanh để đặt ngay (hoặc bấm ⚡ Đặt Ngay)!`,"🔨")})}),bn(e,I)}function Kn(e,t){const s=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Sickle về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],o=new Set(e.sim.state.unlockedZones),l=c=>`<option value="all" ${c==="all"?"selected":""}>🗺️ Toàn công viên</option>`+es.filter(i=>e.sim.state.sandboxMode||o.has(i.id)).map(i=>`<option value="${i.id}" ${c===i.id?"selected":""}>📍 ${i.name}</option>`).join(""),r=s.map(c=>{const i=e.sim.state.staffHired[c.key],d=i>=As,a=c.baseCost*(1+i);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:18px;">${c.icon} <span style="font-size:12px;font-weight:700;">${i}/${As}</span></div>
            <div style="font-size:13px;font-weight:700;">${c.name}</div>
            <button
              type="button"
              data-hire="${c.key}"
              class="brass-btn ${d?"":"gold-cta"}"
              ${d?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${d?`✓ ${As}/${As}`:`+ 🪙 ${a}`}
            </button>
            ${i>0?`<button type="button" data-dismiss="${c.key}" class="brass-btn" style="width:100%;margin-top:4px;padding:4px 8px;font-size:12px;">Cho nghỉ</button>`:""}
          </div>
        `}).join(""),n=e.sim.staff.map(c=>{const i=e.sim.state.staffPatrolZones?.[c.id]??c.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:700;color:#7c2d12;">🧙 <span class="hs-raw">${x(c.name)}</span></div>
            <select data-patrol-staff="${x(c.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${l(i)}
            </select>
            <button type="button" data-pick-staff="${x(c.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=r+n,t.querySelectorAll("[data-hire]").forEach(c=>{c.addEventListener("click",()=>{const i=c.dataset.hire;e.sim.hireStaff(i)&&(Ht(e),ts(e),yt(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-dismiss]").forEach(c=>{c.addEventListener("click",()=>{const i=c.dataset.dismiss;e.sim.dismissStaff(i)&&(ts(e),Kn(e,t),yt(e,"Đã cho phụ tá tạm nghỉ ngơi!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(c=>{c.addEventListener("change",()=>{const i=c.dataset.patrolStaff;e.sim.setStaffPatrolZone(i,c.value),yt(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(c=>{c.addEventListener("click",()=>{const i=e.sim.staff.find(d=>d.id===c.dataset.pickStaff);i&&(Le(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},Ht(e),ts(e),yt(e,`Đang gắp ${i.name} — Chạm vào ô bất kỳ trên bản đồ để thả xuống!`,"🤏"))})})}const kr={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏠 Nhà & Xưởng Chế Biến",creature:"🌾 Sản Xuất, Đồng Cỏ & Thú",decor:"🌳 Vườn Hoa & Trang Trí",staff:"🧙 Phụ Tá Điền Trang"};function bn(e,t){const s=e.root.querySelector("#buildDrawerSwipeBar"),o=e.root.querySelector("#buildDrawerCatLabel"),l=e.root.querySelector("#btnDrawerScrollPrev"),r=e.root.querySelector("#btnDrawerScrollNext"),n=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const c=Array.from(t.querySelectorAll(".catalog-card"));if(!s||c.length===0||!e.activeCategory){s?.classList.add("hidden");return}if(o){const S=e.activeCategory==="decor"&&e.christmasTabActive?"🎄 Giáng Sinh & Mùa Đông":kr[e.activeCategory]??"🏗️ Danh Mục Xây Dựng",w=e.sim.state.sandboxMode?"∞":String(e.sim.state.match3?.stars??0),I=e.sim.state.sandboxMode?"∞":`${e.sim.state.galleons.toLocaleString("vi-VN")} Sickle`;o.textContent=`${S} (${c.length}) • 🌟 ${w} • 🪙 ${I}`}s.classList.remove("hidden");const i=t.querySelector('.catalog-card[data-selected="true"]');i&&typeof i.scrollIntoView=="function"&&i.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const d=c[0],a=c[c.length-1];let $=!0,f=c.length<=2;const u=()=>{const S=!$||!f||t.scrollWidth>t.clientWidth+6;l&&(l.disabled=$,l.classList.toggle("hidden",!S)),r&&(r.disabled=f,r.classList.toggle("hidden",!S)),n&&n.classList.toggle("hidden",!S),t.dataset.scrollStart=String(!$),t.dataset.scrollEnd=String(!f)};if(typeof IntersectionObserver<"u"){const S=new IntersectionObserver(w=>{for(const I of w)I.target===d&&($=I.intersectionRatio>=1),I.target===a&&(f=I.intersectionRatio>=1);u()},{root:t,threshold:1,rootMargin:"2px"});S.observe(d),a!==d&&S.observe(a),e.drawerEdgeObserver=S}u()}function Cr(e){const t=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,s=e.root.querySelector("#secondaryMapToolsBar");s&&s.classList.toggle("hidden",!t)}function Me(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,delete t.dataset.inspSig,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const s=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`,o=s===e.lastInspectedKey;if(o||(e.lastInspectedKey=s),e.inspectorCollapsed=!1,t.classList.remove("inspector-collapsed"),e.inspectSelection.kind==="building"){const l=e.inspectSelection.uid,r=e.sim.state.buildings.find(M=>M.uid===l);if(!r){e.inspectSelection=null,delete t.dataset.inspSig,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const n=le(r.itemId),c=Date.now(),i=c<r.constructEndsAt,d=Math.max(0,Math.ceil((r.constructEndsAt-c)/1e3)),a=e.sim.getBuildingProductionPerCycle(r,n),$=Wi(n,r.stars),f=(e.sim.rideQueues.get(r.uid)??[]).length,u=e.sim.isBuildingConnected(r.uid),S=e.sim.activeSynergies.buildingGoldMult.get(r.uid)??1,w=n.category==="ride"&&!n.isCoasterTrackPiece,I=!!n.isCustomCoasterStation&&!i;let q="none",P="",h=0;if(n.isFarmlandPlot&&!i){const M=e.sim.getPlotEffectiveSoilTier(r),O=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),ee=e.sim.getPlotSoilUpgradeCostInfo(r.uid)?.canAfford?1:0;if(r.cropId){const ce=tt[r.cropId],ue=r.cropReadyAt??c,ge=e.sim.state.cropMastery?.[ce.id]??0,me=qs(0,!1,ge,ce.growSec).growSec,ve=r.cropPlantedAt??ue-me*1e3,Te=Math.max(0,Math.ceil((ue-c)/1e3)),Ae=Te<=0;h=Ae?100:Math.max(6,Math.min(98,Math.round((c-ve)/Math.max(1e3,ue-ve)*100))),P=`${Ae?"Chín":Ge(Te)}${r.cropRotatedBonus?" · ×2":""}`,q=`${ce.id}:${Ae?1:0}:${r.cropWateredBoost?1:0}:${r.cropRotatedBonus?1:0}:${M}:${r.cropCompostBoost?1:0}:${O}:${ee}:${e.sim.state.morningDewPhials??0}`}else{const ce=e.sim.state.plotSoilState?.[`${r.gx},${r.gy}`],ue=Object.keys(tt).map(ge=>e.sim.getSeedCount(ge)).join(".");q=`empty:${e.seedFilterMode}:${e.activeSeedCropId??""}:${ce?.lastFamily??""}:${r.harvestCycleCount??0}:${M}:${r.cropCompostBoost?1:0}:${O}:${ee}:${ue}`}}let k="none",p="",g=0;if(n.isAnimalPasturePlot&&!i)if(!r.pastureAnimalId)k="empty";else{const M=kt[r.pastureAnimalId],O=r.pastureReadyAt??c,j=r.pastureStockedAt??O-M.cycleSec*1e3,ee=Math.max(0,Math.ceil((O-c)/1e3)),ce=ee<=0;g=ce?100:Math.max(6,Math.min(98,Math.round((c-j)/Math.max(1e3,O-j)*100)));const ue=M.goodId?Ve(M.goodId):null,ge=r.pastureGourmetBoost?2:1,me=r.pastureGourmetBoost?1.5:1,ve=Math.round(M.sellValue*me),Te=M.yieldQty*ge,Ae=r.pastureGourmetBoost?2:1;p=ce?`🧺 +${ve} Sickle${ue?` +${Te} ${ue.name}`:""} +${Ae} 🌿`:`⏱️ ${Ge(ee)}${r.pastureGourmetBoost?" · 🌽 ×2":""}`;const ye=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),Ce=e.sim.getAvailableGourmetFeedCrop()??"none";k=`${r.pastureAnimalId}:${ce?1:0}:${r.pastureFedBoost?1:0}:${r.pastureGourmetBoost?1:0}:${ye}:${Ce}:${e.sim.state.morningDewPhials??0}`}let b="none",v="";if(n.workshopGroupId&&!i){const M=e.sim.getWorkshopRecipesForBuilding(n),O=r.workshopQueue??[],j=r.readyFarmGoods??[],ee=M.map(ge=>{const me=!e.sim.state.sandboxMode&&e.sim.state.level<ge.unlockLevel,ve=!me&&(e.sim.state.sandboxMode||ge.inputs.every(Te=>e.sim.getFarmItemCount(Te.itemId)>=Te.qty));return`${ge.id}:${me?"L":ve?"Y":"N"}:${ge.inputs.map(Te=>e.sim.state.sandboxMode?"X":e.sim.getFarmItemCount(Te.itemId)).join(".")}`}).join(","),ce=O[0],ue=ce?Math.max(0,Math.ceil((ce.endsAt-c)/1e3)):0;v=ce?Ge(ue):"Trống",b=`${j.join(",")}|${O.map(ge=>ge.goodId).join(",")}|${ee}`}let T="done",F=100,A="",H="";if(i){const M=Math.max(0,r.buildReducedSec??0),O=Math.max(1e3,n.buildDurationSec*1e3,r.constructEndsAt-(r.placedAt||c-1e3)+M*1e3);F=Math.max(1,Math.min(99,Math.floor((1-(r.constructEndsAt-c)/O)*100)));const j=e.sim.getBuildingMinFloorSec(r),ee=Math.max(0,d-j),ce=ee<=0&&e.sim.getActiveConstructions(c).some(ge=>ge.uid!==r.uid&&Math.ceil((ge.constructEndsAt-c)/1e3)>e.sim.getBuildingMinFloorSec(ge)),ue=ee>0||ce;A=`${Ge(d)}${M>0?` (−${st(M)})`:""}`,H=`${F}%`,T=`1:${M}:${ee>0?1:0}:${ue?1:0}:${e.sim.state.morningDewPhials??0}`}let K="";if(!i&&!r.awaitingUnveil&&n.baseIncome>0&&n.cycleSec>0&&!n.isFarmlandPlot&&!n.isAnimalPasturePlot){const M=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,O=Ja(r,n),j=Math.max(1,O*M),ee=Math.max(0,(c-(r.lastTickAt||c))/1e3),ce=Math.max(1,Math.ceil(j-ee%j));K=Ge(ce)}const V=n.isCreatureHabitat?e.sim.biomeCache.get(r.uid):void 0,Z=n.isBackstage?e.sim.backstageCache.get(r.uid):void 0,re=[r.uid,r.itemId,r.stars,r.rotation,r.awaitingUnveil?1:0,u?1:0,S.toFixed(2),r.visitorsServed,f,r.storedSickle,a.galleons,a.xp,Math.round(r.durability),r.isBrokenDown?1:0,r.needsTreeRevival?1:0,r.lastPlantedCropId??"",(r.readyFruitCrops??[]).length,r.creatureBondLevel??1,r.creatureStage??"",Math.round(r.creatureHunger??90),V?.score??50,Z?`${Z.shieldCount}/${Z.needed}`:"",e.sim.state.level,e.sim.state.sandboxMode?1:0,e.sim.isVisitingNeighbor?1:0,!i&&e.sim.canStashBuilding(r.uid)?1:0,e.sim.getActiveFestival(),T,q,k,b].join("#");if(!t.classList.contains("hidden")&&t.dataset.inspSig===re){const M=(O,j)=>{const ee=t.querySelector(`[data-insp-live="${O}"]`);ee&&ee.textContent!==j&&(ee.textContent=j)};if(P){M("crop-timer",P);const O=t.querySelector('[data-insp-live="crop-bar"]');O&&(O.style.width=`${h}%`)}if(p){M("pasture-timer",p);const O=t.querySelector('[data-insp-live="pasture-bar"]');O&&(O.style.width=`${g}%`)}if(b!=="none"&&M("ws-timer",v),i){M("build-timer",A),M("build-pct",H);const O=t.querySelector('[data-insp-live="build-bar"]');O&&(O.value=F)}K&&M("prod-cycle",K);return}t.dataset.inspSig=re;const B={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"};ji(n),e.sim.getEffectivePrice(r,n),e.sim.getPriceValueVerdict(r,n);const U=n.isFarmlandPlot&&!i?(()=>{const M=e.sim.getPlotEffectiveSoilTier(r),O=Ri(M),j=e.sim.getPlotSoilUpgradeCostInfo(r.uid),ee=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),ce=!r.cropCompostBoost&&(!!e.sim.state.sandboxMode||ee>=1),ue=`
                <div class="soil-tier-banner">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                    <strong>🌱 Bậc ${O.labelRom} · ${x(O.nameVi)}</strong>
                    <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 ×${e.sim.state.sandboxMode?"∞":ee}</span>
                  </div>
                  <div class="hs-stat-pills">
                    <span class="hs-stat-pill" title="Sản lượng cộng thêm mỗi vụ">🌱 +${O.yieldBonus}</span>
                    <span class="hs-stat-pill" title="Hệ số thưởng Sickle và XP khi thu hoạch">🪙 ×${O.harvestGoldXpMult.toFixed(2)}</span>
                    ${O.rejuvenateOnRotate?'<span class="hs-stat-pill" title="Luân canh khác họ giúp hồi sức đất">🍀 Hồi đất</span>':""}
                    ${r.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Đã bón Phân Ủ Thảo Dược: cộng 2 nông sản vụ này">🌿 +2</span>':""}
                  </div>
                  <div class="soil-tier-actions">
                    ${j?.nextTier&&j.nextMeta?`<button type="button" class="brass-btn ${j.canAfford?"gold-cta":""}" data-insp-upgrade-soil="1" title="${j.unlockedByLevel?`Nâng cấp lên Đất Bậc ${j.nextMeta.labelRom}`:`Mở khoá Đất Bậc ${j.nextMeta.labelRom} tại Cấp ${j.nextMeta.unlockLevel}`}" ${j.unlockedByLevel?"":"disabled"}>${j.unlockedByLevel?e.sim.state.sandboxMode?`Bậc ${j.nextMeta.labelRom} · 0 Sickle`:`Nâng Bậc ${j.nextMeta.labelRom} · ${j.compostCost}🌿 · 🪙${j.effectiveSickleCost.toLocaleString("vi-VN")}`:`🔒 Bậc ${j.nextMeta.labelRom} (Cấp ${j.nextMeta.unlockLevel})`}</button>`:'<span class="hs-stat-pill is-active" title="Đất canh tác đã đạt cấp tối đa Bậc V">⭐ Bậc V</span>'}
                    ${r.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Thửa đất đã bón Phân Ủ vụ này">🌿 Đã bón</span>':`<button type="button" class="brass-btn" data-insp-compost-plot="1" title="Bón 1 Phân Ủ Thảo Dược: cộng 2 nông sản và xoá mỏi đất" ${ce?"":"disabled"}>🌿 Bón đất (+2)</button>`}
                  </div>
                </div>
              `;if(!r.cropId){const Re=e.sim.state.plotSoilState?.[`${r.gx},${r.gy}`],je=Math.max(r.harvestCycleCount??0,Re?.fatigueStep??0),gt=Object.values(tt).sort(($e,Xe)=>$e.unlockLevel-Xe.unlockLevel||$e.growSec-Xe.growSec).filter($e=>e.seedFilterMode==="flowers"?!!$e.isFlowerCrop:e.seedFilterMode==="crops"?!$e.isFlowerCrop:!0),zt=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map($e=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===$e.id?"active":""}"
                        data-insp-seed-filter="${$e.id}"
                        aria-pressed="${e.seedFilterMode===$e.id}"
                      >${$e.label}</button>
                    `).join(""),Js=gt.map($e=>{const Xe=!e.sim.state.sandboxMode&&e.sim.state.level<$e.unlockLevel,Ct=e.sim.getSeedCount($e.id),xt=Ii($e.id),We=!!(Re&&Re.lastFamily!==xt),qt=e.sim.state.cropMastery?.[$e.id]??0,rt=qs(je,We,qt,$e.growSec),ut=`${st(rt.growSec)}${rt.isRotatedBonus?" · 🍀 ×2":""}`,lt=e.activeSeedCropId===$e.id;return`
                      <div class="seed-card-slot ${Xe?"locked":""} ${lt?"selected":""} ${!Xe&&Ct<=0?"out-of-seeds":""}">
                        <button
                          type="button"
                          class="seed-card seed-tray-card ${Xe?"locked":""} ${lt?"selected":""} ${!Xe&&Ct<=0?"out-of-seeds":""}"
                          data-plant-crop="${$e.id}"
                          ${Xe?"disabled":""}
                        >
                          <span class="seed-card-seed-badge ${Xe?"is-locked":Ct>0?"has-seed":"no-seed"}">
                            ${Xe?`Cấp ${$e.unlockLevel}`:`×${Ct}`}
                          </span>
                          <img src="${ua($e.id)}" alt="${x($e.name)}" class="seed-card-img" />
                          <span class="seed-card-name">${x($e.name)}</span>
                          <span class="seed-card-meta">${ut}</span>
                        </button>
                        ${Xe?"":`<button type="button" class="seed-card-add-btn" data-insp-buy-seed="${$e.id}" aria-label="Mua 1 hạt ${x($e.name)} (${$e.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${x($e.name)} (${$e.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":$e.seedCost.toLocaleString("vi-VN")}</button>`}
                      </div>
                    `}).join(""),xs={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"},Ts=Re?.lastFamily?`<div class="hs-insp-note">Luân canh ×2 · Khác họ <strong>${xs[Re.lastFamily]??Re.lastFamily}</strong></div>`:"",Fe=r.lastPlantedCropId??e.sim.ensureFarmBarn().lastPlantedCropId,Ut=Fe?tt[Fe]:null;return`
                  <div class="ws-inspector-board">
                    ${ue}
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>Chọn hạt</span>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${Ut?`<button id="btnInspReplantLast" type="button" class="brass-btn gold-cta" title="Gieo lại ${x(Ut.name)}">🌱 Gieo lại ${x(Ut.name)}</button>`:""}
                        <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta">
                          Đố nhận hạt
                        </button>
                      </div>
                    </div>
                    ${Ts}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${zt}</div>
                    <div class="seed-picker-grid">${Js}</div>
                  </div>
                `}const ge=tt[r.cropId],me=r.cropReadyAt??c,ve=e.sim.state.cropMastery?.[ge.id]??0,Te=qs(0,!1,ve,ge.growSec).growSec,Ae=r.cropPlantedAt??me-Te*1e3,ye=Math.max(0,Math.ceil((me-c)/1e3)),Ce=ye<=0,se=Ni(ve),Se=Math.max(0,e.sim.state.morningDewPhials??0),He=ge.yieldQty*(r.cropRotatedBonus?2:1)+O.yieldBonus+(r.cropRotatedBonus?O.extraRotateYield:0)+(r.cropCompostBoost?2:0),qe=Ce?100:Math.max(6,Math.min(98,Math.round((c-Ae)/Math.max(1e3,me-Ae)*100)));return`
                <div class="ws-inspector-board">
                  ${ue}
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="${ua(ge.id)}" alt="${x(ge.name)}" style="width:40px;height:40px;object-fit:contain;" />
                    <div style="flex:1;min-width:0;">
                      <div class="hs-insp-name">${x(ge.name)} <span class="hs-insp-meta">· Bậc ${se.labelRom}</span></div>
                      <div class="hs-insp-stat" data-insp-live="crop-timer">
                        ${Ce?"Chín":Ge(ye)}${r.cropRotatedBonus?" · ×2":""}
                      </div>
                      <div class="hs-insp-meta">${ve} vụ</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="crop-bar" style="width:${qe}%"></div>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${Ce?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                            Gặt +${He}
                          </button>
                        `:r.cropWateredBoost?'<div class="hs-insp-meta" style="flex:1;text-align:center;padding:8px 4px;">Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              Tưới −30%
                            </button>
                          `}
                    ${!Ce&&(Se>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            Sương Mai ×${Se}
                          </button>`:""}
                  </div>
                </div>
              `})():"",E=n.workshopGroupId&&!i?(()=>{const M=e.sim.getWorkshopRecipesForBuilding(n),O=r.workshopQueue??[],j=r.readyFarmGoods??[],ee=Bi(r.stars),ce=Hi(r.stars),ue=j.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${j.slice(0,5).map(ye=>{const Ce=Ot[ye];return`<img src="/trang-trai-hang-soc/sprites/${Ce.iconKey}.webp" alt="${x(Ce.name)}" title="${x(Ce.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${j.length})
                      </button>
                    </div>
                  `:"",ge=M.map(ye=>{const Ce=Ot[ye.goodId],se=ye.name??Ce.name,Se=ye.name&&ye.name!==Ce.name?`title="Ra lò thành phẩm: ${x(Ce.name)}"`:"",He=!e.sim.state.sandboxMode&&e.sim.state.level<ye.unlockLevel,qe=!He&&(e.sim.state.sandboxMode||ye.inputs.every(je=>e.sim.getFarmItemCount(je.itemId)>=je.qty)),Re=ye.inputs.map(je=>{const Qe=Ve(je.itemId),gt=e.sim.getFarmItemCount(je.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||gt>=je.qty?"ok":"lack"}">${x(Qe.name)} ${e.sim.state.sandboxMode?"∞":gt}/${je.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${qe?"craftable":""} ${He?"locked":""}"
                      data-ws-enqueue="${ye.id}"
                      ${Se}
                      ${He?"disabled":""}
                    >
                      <div class="ws-recipe-name">${x(se)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${Ce.iconKey}.webp" alt="${x(se)}" class="ws-recipe-img" />
                        ${qe?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${He?`🔒 Lv.${ye.unlockLevel}`:Re}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${st(Math.max(5,Math.round(ye.craftSec*ce)))}</div>
                    </button>
                  `}).join(""),me=O[0],ve=me?Math.max(0,Math.ceil((me.endsAt-c)/1e3)):0,Te=me?Ot[me.goodId]:null,Ae=Array.from({length:Math.max(1,ee-1)},(ye,Ce)=>{const se=O[Ce+1];if(se){const Se=Ot[se.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${x(Se.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${Se.iconKey}.webp" alt="${x(Se.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return Ce===O.length-(me?1:0)?`
                    <div class="ws-slot-plus" title="Thêm vào khay">
                      <span>+</span>
                    </div>
                  `:`
                  <div class="ws-slot-card empty" title="Trống">
                    <span style="font-size:11px;font-weight:700;opacity:0.65;">Trống</span>
                  </div>
                `}).join("");return`
                <div class="ws-inspector-board">
                  ${ue}
                  <div class="ws-recipe-grid">${ge}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${me?"baking":""}">
                      <div class="ws-oven-arch">
                        ${Te?`<img src="/trang-trai-hang-soc/sprites/${Te.iconKey}.webp" alt="${x(Te.name)}" class="ws-oven-good-img" />`:'<span style="font-size:18px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${me?`<strong data-insp-live="ws-timer">${Ge(ve)}</strong>`:'<strong data-insp-live="ws-timer">Trống</strong>'}
                      </div>
                      ${me?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${Ae}</div>
                  </div>
                </div>
              `})():"",de=n.isAnimalPasturePlot&&!i?(()=>{if(!r.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>Chọn thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(kt).map(Se=>{const He=!e.sim.state.sandboxMode&&e.sim.state.level<Se.unlockLevel;return`
                      <button
                        type="button"
                        class="seed-card ${He?"locked":""}"
                        data-stock-animal="${Se.id}"
                        ${He?"disabled":""}
                      >
                        <span class="seed-card-seed-badge ${He?"is-locked":"has-seed"}">
                          ${He?`Cấp ${Se.unlockLevel}`:`🪙${Se.cost.toLocaleString("vi-VN")}`}
                        </span>
                        <img src="/trang-trai-hang-soc/sprites/${Se.spritePair[0]}.webp" alt="${x(Se.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${x(Se.name)}</span>
                        <span class="seed-card-meta">${st(Se.cycleSec)} · +🪙${Se.sellValue}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const M=kt[r.pastureAnimalId],O=r.pastureReadyAt??c,j=r.pastureStockedAt??O-M.cycleSec*1e3,ee=Math.max(0,Math.ceil((O-c)/1e3)),ce=ee<=0,ue=ce?100:Math.max(6,Math.min(98,Math.round((c-j)/Math.max(1e3,O-j)*100))),ge=M.goodId?Ve(M.goodId):null,me=e.sim.getAvailableGourmetFeedCrop(),ve=me?tt[me]:null,Te=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),Ae=r.pastureGourmetBoost?2:1,ye=Math.round(M.sellValue*(r.pastureGourmetBoost?1.5:1)),Ce=r.pastureGourmetBoost?2:1;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${M.spritePair[0]}.webp" alt="${x(M.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div class="hs-insp-title">${x(M.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;" data-insp-live="pasture-timer">
                        ${ce?`🧺 +${ye} Sickle${ge?` +${M.yieldQty*Ae} ${x(ge.name)}`:""} +${Ce} 🌿`:`⏱️ ${Ge(ee)}${r.pastureGourmetBoost?" · 🌽 ×2":""}`}
                      </div>
                      <div class="hs-stat-pills">
                        <span class="hs-stat-pill" title="Thu hoạch nhận thêm Phân Ủ Thảo Dược">🌿 +${Ce} (Kho: ×${e.sim.state.sandboxMode?"∞":Te})</span>
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="pasture-bar" style="width:${ue}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${ce?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${ye} Sickle · +${Ce}🌿)
                          </button>
                        `:`
                          ${r.pastureFedBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho thú ăn cỏ thường">🌾 Đã cho ăn</span>':`
                                <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;" title="Cho thú ăn cỏ giúp rút ngắn 35% thời gian chờ">
                                  🌾 Cho ăn (-35%)
                                </button>
                              `}
                          ${r.pastureGourmetBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho ăn khẩu phần thượng hạng: nhân đôi sản vật và nhận 2 Phân Ủ">🌿 Đã ăn (×2 · +2🌿)</span>':`<button id="btnInspFeedPastureGourmet" type="button" class="brass-btn ${ve||e.sim.state.sandboxMode?"gold-cta":""}" style="flex:1;" title="Cho ăn ${e.sim.state.sandboxMode?0:qi} nông sản để nhân đôi sản vật và nhận 2 Phân Ủ">${ve?ve.emoji:"🌽"} Thượng hạng (×2 · +2🌿)</button>`}
                        `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!ce&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 -15p (×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"",oe=`${n.isFarmlandPlot?"Ruộng":n.isAnimalPasturePlot?"Đồng cỏ":n.connectableGroup==="flower_garden"?"Vườn hoa":n.workshopGroupId?"Xưởng":`${r.visitorsServed} lượt`}${w?` · ${f}/${Ki}`:""}`;t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((n.workshopGroupId||n.isFarmlandPlot||n.isAnimalPasturePlot)&&!i)),e.syncHudFocusVisibility();const he=Dn(n),Ie=o?t.scrollTop:0;t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-head-main">
            ${he?`<img src="${he}" alt="${x(n.name)}" class="inspector-thumb" />`:""}
            <div class="hs-insp-head-copy">
              <div class="hs-insp-title">${x(n.name)}</div>
              <div class="hs-insp-meta"><span class="hs-insp-stars-inline">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</span> · ${oe}${u?"":' · <span class="hs-insp-warn">Chưa nối đường</span>'}${S>1?` · +${Math.round((S-1)*100)}%`:""}</div>
            </div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        ${U}
        ${de}
        ${E}
        ${n.id==="burrow_apple_orchard"&&!i?r.needsTreeRevival?`<div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                  <div style="font-weight:700;margin-bottom:6px;">🍎 Cây táo cần hồi sinh sau 3 vụ (bón 1 🌿 Phân Ủ hoặc nhờ bạn bè chăm giúp)</div>
                  <button id="btnInspReviveTree" type="button" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">🌿 Hồi sinh Vườn Táo (+2 🍎)</button>
                </div>`:`<div class="hs-insp-drop-meta">🍎 Mùa trái cây lâu năm: còn <strong>${Math.max(0,3-(r.orchardHarvestsUsed??0))}/3</strong> vụ trước khi cần hồi sinh</div>`:""}

        ${n.producesIngredient&&!i?`<div class="hs-insp-drop-meta">Rơi: <strong>${Us[n.producesIngredient].name}</strong></div>`:""}

        ${i?(()=>{const M=Math.max(0,r.buildReducedSec??0),O=Math.max(1e3,n.buildDurationSec*1e3,r.constructEndsAt-(r.placedAt||c-1e3)+M*1e3),j=Math.max(1,Math.min(99,Math.floor((1-(r.constructEndsAt-c)/O)*100))),ee=e.sim.getBuildingMinFloorSec(r),ce=Math.max(0,d-ee),ue=ce<=0&&e.sim.getActiveConstructions(c).some(ve=>ve.uid!==r.uid&&Math.ceil((ve.constructEndsAt-c)/1e3)>e.sim.getBuildingMinFloorSec(ve)),ge=ce>0||ue,me=n.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="hs-insp-build-wrap">
                    <div class="hs-insp-build-head">
                      <span>${n.isCreatureHabitat?"Đang ấp":"Đang xây"} · <strong data-insp-live="build-timer">${Ge(d)}${M>0?` (−${st(M)})`:""}</strong></span>
                      <span data-insp-live="build-pct">${j}%</span>
                    </div>
                    <progress class="ts-build-progress" data-insp-live="build-bar" max="100" value="${j}" aria-label="${me}"></progress>
                    <div class="hs-insp-actions-row">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta hs-insp-speed-btn" ${ge?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">Khảo thí −30p</button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn hs-insp-speed-btn" ${ge?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">Thần chú −10p</button>
                      ${ce>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">−15p ×${e.sim.state.morningDewPhials??0}</button>`:""}
                      ${e.sim.state.sandboxMode?'<button id="btnFinishNowSand" type="button" class="brass-btn" title="Hoàn tất ngay">Xong</button>':""}
                      ${r.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình">Dời</button>'}
                    </div>
                  </div>
                `})():r.awaitingUnveil?`
                <div class="hs-insp-actions-row">
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="flex:1;">Cắt băng khánh thành</button>
                </div>
              `:n.baseIncome>0?(()=>{const M=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,O=Ja(r,n),j=n.isAnimalPasturePlot&&r.pastureAnimalId?kt[r.pastureAnimalId]:null,ee=Math.max(1,O*M),ce=Math.max(0,(c-(r.lastTickAt||c))/1e3),ue=Math.max(1,Math.ceil(ee-ce%ee));return`
                    <div class="hs-insp-prod-row">
                      <div class="hs-insp-prod-copy">
                        <strong id="lblBuildingProdVal">+${j?.sellValue??a.galleons}🪙 +${j?.xp??a.xp}⭐</strong> / ${st(j?.cycleSec??O)}${n.cycleSec>0&&!n.isFarmlandPlot&&!n.isAnimalPasturePlot?` · <span data-insp-live="prod-cycle">${Ge(ue)}</span>`:""} · Kho: <strong>${r.storedSickle}🪙</strong>
                      </div>
                      ${r.storedSickle>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta">Thu +${r.storedSickle} Sickle</button>`:""}
                    </div>
                  `})():""}

        ${w&&!i&&!n.isFlooPortal&&r.isBrokenDown?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
                  <span>Độ bền</span>
                  <span style="color:${r.isBrokenDown?"#dc2626":r.durability<50?"#b45309":"#15803d"};">${Math.round(r.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(r.durability)}" aria-label="Độ bền"></progress>
                ${r.isBrokenDown||r.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${r.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">Sửa (0 Sickle)</button>`:""}
              </div>
            `:""}

        

        ${n.isCustomCoasterStation&&r.coasterStats&&!i?`
              <div class="hs-insp-prod-row">
                <span class="hs-insp-prod-copy">Ray ${r.coasterStats.lengthMeters}m · Hứng khởi ${r.coasterStats.excitement}/10</span>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta">Tự lắp ray</button>
              </div>
            `:""}

        ${I?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Ride Cam</button>
            `:""}

        ${(n.isWorkshopBrewery||n.producesIngredient||n.isFireworksLauncher)&&!i?`
              <div class="hs-insp-actions-row" style="margin-bottom:6px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">Xưởng</button>
                ${n.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">Pháo hoa</button>':""}
              </div>
            `:""}

        ${n.isCreatureHabitat&&!i?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>${x(r.creatureNickname||n.creatureName||n.name)}</strong>
                  <span class="morph-pill ${r.creatureMorph==="radiant"?"radiant":r.creatureMorph==="mystic"?"mystic":""}">
                    ${wt[r.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>Lv.${r.creatureBondLevel??1}/${ls} · ${B[r.creatureStage??"baby"]} · Môi trường ${V?.score??50}% · No ${Math.round(r.creatureHunger??90)}%</div>
                <div class="hs-insp-actions-row" style="margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">Cho ăn</button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1;">Vali</button>
                </div>
              </div>
            `:""}

        ${n.isBackstage&&Z&&!i?`
              <div class="hs-insp-drop-meta" style="color:${Z.isShielded?"#15803d":"#dc2626"};">
                Che chắn: ${Z.shieldCount}/${Z.needed} ${Z.isShielded?"✓ (+25% Sickle)":""}
              </div>
            `:""}

        ${n.id==="burrow_honeydukes_canon"&&!i?`
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Vào Bùa Gặt Honeydukes</button>
            `:""}

        ${(n.id==="burrow_owl_post"||n.id==="eeylops_owl_emporium")&&!i?'<button id="btnInspOpenOwlOrders" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Bảng Đơn Hàng Cú</button>':""}
        ${n.id==="burrow_feast_marquee"&&!i?'<button id="btnInspOpenFeastMarquee" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Đại Tiệc Mùa Gặt</button>':""}
        ${n.id==="floo_fireplace_gate"&&!i?'<button id="btnInspOpenNeighbors" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Sổ Hàng Xóm &amp; Cổng Floo</button>':""}
        ${i?"":`<div class="hs-insp-actions-row">
                ${r.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn hs-insp-upg-btn">${n.workshopGroupId?`Nâng ${r.stars+1}★ (+1 khay, −8% giờ lò)`:`Nâng ${r.stars+1}★`} · 🌟${Di(r.stars)} + 🪙${$.toLocaleString("vi-VN")}</button>`:'<span class="hs-insp-max-stars">5★ Tối đa</span>'}
              </div>`}
        ${!r.isIndestructible&&!e.sim.isVisitingNeighbor?`<div class="inspector-build-actions ${!i&&e.sim.canStashBuilding(r.uid)?"has-stash":""}" role="group" aria-label="Thao tác công trình">
                <button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình miễn phí (0 Sickle)">Dời</button>
                <button id="btnRotateThis" type="button" class="brass-btn" title="Xoay hướng công trình 90°">Xoay</button>
                ${!i&&e.sim.canStashBuilding(r.uid)?'<button id="btnStashThis" type="button" class="brass-btn hs-insp-stash-btn" title="Cất vào Kho Trang Trí (đặt lại miễn phí 0 Sickle)">Cất</button>':""}
                <button id="btnDeleteThis" type="button" class="brass-btn inspector-delete-btn" title="Xóa công trình">Xóa</button>
              </div>`:""}
      `,Ie>0&&(t.scrollTop=Ie);const fe=t.querySelector("#inpBuildingPrice");fe&&(e.wireRangeProgressFallback(fe),fe.addEventListener("input",()=>{const M=Number(fe.value);e.sim.setBuildingCustomPrice(r.uid,M);const O=e.sim.getEffectivePrice(r,n),j=t.querySelector("#lblBuildingPriceVal");j&&(j.textContent=`${O} Sickle`);const ee=e.sim.getPriceValueVerdict(r,n),ce=t.querySelector("#lblPriceVerdict");ce&&(ce.textContent=ee.label,ce.style.color=ee.color);const ue=e.sim.getBuildingProductionPerCycle(r,n),ge=t.querySelector("#lblBuildingProdVal");ge&&(ge.textContent=`+${ue.galleons} 🪙 & +${ue.xp} ⭐`)})),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Me(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(r.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=r.uid,e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=r.uid,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(r.uid,!0),Me(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(M=>{M.addEventListener("click",()=>{const O=e.sim.useMorningDewPhial(r.uid);e.showToast(O.msg,O.ok?"🧪":"⏳"),Me(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(r.uid),Me(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const M=r.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",M)}),t.querySelector("#btnInspReplantLast")?.addEventListener("click",()=>{const M=e.sim.replantPlotLastCrop(r.uid);if(M.needSeedAcquire&&M.cropId){const O=r.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(M.cropId,O);return}e.showToast(M.msg,M.ok?"🌱":"🪙"),M.ok?(e.inspectSelection=null,e.refreshAll()):Me(e)}),t.querySelector("#btnInspReviveTree")?.addEventListener("click",()=>{const M=e.sim.reviveFruitTree(r.uid);e.showToast(M.msg,M.ok?"🍎":"🌿"),Me(e),e.refreshHeader()}),t.querySelectorAll("[data-plant-crop]").forEach(M=>{M.addEventListener("click",()=>{const O=M.dataset.plantCrop,j=e.sim.plantCropOnPlot(r.uid,O);if(j.needSeedAcquire){const ee=r.uid;e.activeSeedCropId=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(O,ee);return}if(e.showToast(j.msg,j.ok?"🌱":"🪙"),j.ok){const ee=!!e.sim.state.sandboxMode||e.sim.getSeedCount(O)>0;e.activeSeedCropId=ee?O:null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}Me(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-buy-seed]").forEach(M=>{M.addEventListener("click",O=>{O.stopPropagation();const j=M.dataset.inspBuySeed,ee=e.sim.buyCropSeedWithGold(j,1);e.showToast(ee.msg,ee.ok?"🌱":"🪙"),ee.ok&&(e.activeSeedCropId=j,Me(e),e.renderSeedTray(),e.refreshHeader(),e.refreshFloatingBanner())})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(M=>{M.addEventListener("click",()=>{const O=M.dataset.inspSeedFilter;(O==="all"||O==="flowers"||O==="crops")&&(e.seedFilterMode=O,Me(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(M=>{M.addEventListener("click",()=>{const O=M.dataset.stockAnimal,j=e.sim.stockAnimalOnPasture(r.uid,O);if(e.showToast(j.msg,j.ok?kt[O]?.emoji??"🐾":"🪙"),j.ok){e.activePastureAnimalId=null,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}Me(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const M=e.sim.feedAnimalPasture(r.uid);e.showToast(M.msg,M.ok?"🌾":"⏳"),Me(e)}),t.querySelector("#btnInspFeedPastureGourmet")?.addEventListener("click",()=>{const M=e.sim.feedAnimalPastureGourmet(r.uid);e.showToast(M.msg,M.ok?"🌽":"🧺"),Me(e),e.refreshHeader()}),t.querySelectorAll("[data-insp-upgrade-soil]").forEach(M=>{M.addEventListener("click",()=>{const O=e.sim.upgradePlotSoilTier(r.uid);e.showToast(O.msg,O.ok?"🌱":"🪙"),Me(e),e.refreshHeader()})}),t.querySelectorAll("[data-insp-compost-plot]").forEach(M=>{M.addEventListener("click",()=>{const O=e.sim.fertilizeCropPlotWithCompost(r.uid);e.showToast(O.msg,O.ok?"🌿":"🧺"),Me(e),e.refreshHeader()})}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const M=e.sim.harvestAnimalPasture(r.uid);e.showToast(M.msg,M.ok?"🧺":"⏳"),Me(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const M=e.sim.clearAnimalFromPasture(r.uid);e.showToast(M.msg,M.ok?"🐾":"⚠️"),Me(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const M=e.sim.waterCropPlot(r.uid);e.showToast(M.msg,M.ok?"💧":"⏳"),Me(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const M=e.sim.harvestCropPlot(r.uid);e.showToast(M.msg,M.ok?"🌾":"🏡"),Me(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(r.uid),Me(e)}),t.querySelectorAll("[data-ws-enqueue]").forEach(M=>{M.addEventListener("click",()=>{const O=M.dataset.wsEnqueue,j=e.sim.enqueueWorkshopRecipe(r.uid,O);e.showToast(j.msg,j.ok?"🔥":"🧺"),Me(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(r.uid),Me(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(r.uid),Me(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(r.uid),Me(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=r.uid,e.inspectSelection=null,Me(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${n.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(r.uid),Me(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",r.uid)}),t.querySelector("#btnInspOpenHoneydukesMatch3")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openMatch3Dialog()}),t.querySelector("#btnInspOpenOwlOrders")?.addEventListener("click",()=>{e.inspectSelection=null,e.activeQuestTab="orders",e.refreshAll(),e.renderQuestDialog(),e.root.querySelector("#questDialog")?.showModal()}),t.querySelector("#btnInspOpenFeastMarquee")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openHarvestFeastDialog()}),t.querySelector("#btnInspOpenNeighbors")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openNeighborDialog("friends")}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const M=e.sim.upgradeBuildingStar(r.uid);e.showToast(M.msg,M.ok?"🌟":"🪙"),Me(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{Le(e),e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=r.uid,e.rotation=r.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.onStartMoveBuilding?.(r.uid),e.refreshAll(),e.showToast(`✋ Đang nhấc "${n.name}" — chạm ô đất mới trên bản đồ để đặt xuống!`,"✋")}),t.querySelector("#btnStashThis")?.addEventListener("click",()=>{const M=e.sim.stashBuilding(r.uid);M.ok&&(e.inspectSelection=null,e.refreshAll()),e.showToast(M.msg,M.ok?"📦":"⚠️")}),t.querySelector("#btnRotateThis")?.addEventListener("click",()=>{const M=e.sim.rotatePlacedBuilding(r.uid);if(!M.ok){e.showToast(M.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}e.rotation=M.newRotation??r.rotation,Me(e),e.refreshHeader(),e.refreshDock(),e.showToast(`🔄 Đã xoay "${n.name}" (${(M.newRotation??0)*90}°)`,"🔄")}),t.querySelector("#btnDeleteThis")?.addEventListener("click",()=>{const M=e.sim.getRemovalLossText(r.gx,r.gy);M?e.askConfirm(M).then(O=>{O&&J()}):J()});const J=()=>{e.sim.beginBuildStroke();let M=!1;try{M=e.sim.removeAtTile(r.gx,r.gy)}finally{e.sim.commitBuildStroke()}M&&(e.inspectSelection=null,e.refreshAll(),e.showToast(`🧹 Đã xóa "${n.name}" (có thể bấm ↶ Hoàn tác trong Xây Dựng nếu nhầm).`,"🧹"))};return}if(e.inspectSelection.kind==="staff"){delete t.dataset.inspSig;const l=e.inspectSelection.id,r=e.sim.staff.find(i=>i.id===l);if(!r){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const n=e.sim.state.staffPatrolZones?.[r.id]??r.patrolZoneId??"all",c=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-title">${x(r.name)}</div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        <div class="hs-insp-drop-meta">"${x(r.actionText)}"</div>

        <div class="hs-insp-actions-row">
          <select id="selInspPatrolZone" aria-label="Khu vực tuần tra" style="flex:1;min-height:40px;padding:6px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${n==="all"?"selected":""}>Toàn bộ</option>
            ${es.filter(i=>e.sim.state.sandboxMode||c.has(i.id)).map(i=>`<option value="${i.id}" ${n===i.id?"selected":""}>${i.name}</option>`).join("")}
          </select>
          <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta">Gắp</button>
        </div>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Me(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",i=>{const d=i.currentTarget.value;e.sim.setStaffPatrolZone(r.id,d),e.showToast(`Đã phân công ${r.name}.`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{Le(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:r.id,label:r.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){delete t.dataset.inspSig;const l=Tn(e.inspectSelection.zoneId),r=Ia(l),n=l.unlockCost>0?` · ${l.unlockCost.toLocaleString("vi-VN")} Sickle`:"",c=e.sim.state.level>=l.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div>
            <div class="hs-insp-title">${x(l.name)}</div>
            <div class="hs-insp-meta">Cấp ${l.unlockLevel} · 🌟 ${r}${n}</div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${c?"gold-cta":""}" style="width:100%;">Mở khu vực · 🌟 ${r}${n}</button>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Me(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const i=e.sim.unlockZone(l.id);e.showToast(i.msg,i.ok?"✨":"🔒"),i.ok&&(e.inspectSelection=null,e.refreshAll())})}}function Na(e,t){t&&(e.activeWorkshopTab=t),De(e);const s=e.root.querySelector("#workshopDialog");s.open||s.showModal()}function Qn(e,t,s){e.collapseBuildDock(),ss(e),Le(e),e.inspectSelection=null,e.pendingSowPlotUid=s??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function _t(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function Mr(e){e.seedTrayOpen?(_t(e),e.refreshAll()):Qn(e,e.activeSeedCropId??void 0)}function Xn(e,t,s){e.collapseBuildDock(),_t(e),Le(e),e.inspectSelection=null,e.pendingStockPastureUid=s??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function ss(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function Ar(e){e.pastureTrayOpen?(ss(e),e.refreshAll()):Xn(e,e.activePastureAnimalId??void 0)}function Yn(e){const t=e.root.querySelector("#seedBrushTray"),s=e.root.querySelector("#btnOpenSeedSilo");if(s){const p=e.seedTrayOpen||!!e.activeSeedCropId;s.dataset.active=String(p),s.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(p=>le(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,l=e.sim.state.buildings.filter(p=>le(p.itemId)?.isFarmlandPlot).length,r=e.activeSeedCropId?tt[e.activeSeedCropId]:null,c=Object.values(tt).sort((p,g)=>p.unlockLevel-g.unlockLevel||p.growSec-g.growSec).filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),i=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),d=c.map(p=>{const g=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,b=e.activeSeedCropId===p.id,v=e.sim.getSeedCount(p.id),T=e.sim.state.cropMastery?.[p.id]??0,F=qs(0,!1,T,p.growSec).growSec,A=st(F);return`
          <div class="seed-card-slot ${g?"locked":""} ${b?"selected":""} ${!g&&v<=0?"out-of-seeds":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${g?"locked":""} ${b?"selected":""} ${!g&&v<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${b}"
              ${g?"disabled":""}
            >
              <span class="seed-card-seed-badge ${g?"is-locked":v>0?"has-seed":"no-seed"}">
                ${g?`Cấp ${p.unlockLevel}`:`×${v}`}
              </span>
              <img src="${ua(p.id)}" alt="${x(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${x(p.name)}</span>
              <span class="seed-card-meta">${A}</span>
            </button>
            ${g?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Mua 1 hạt ${x(p.name)} (${p.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${x(p.name)} (${p.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":p.seedCost.toLocaleString("vi-VN")}</button>`}
          </div>
        `}).join(""),a=t.querySelector(".seed-tray-scroll")?.scrollLeft??0;t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${r?`${x(r.name)} · ×${e.sim.getSeedCount(r.id)}`:"Hạt Giống & Hoa"}</span>
            <span class="seed-tray-sub">Trống ${o}/${l}</span>
          </div>
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Đố nhận hạt 0 Sickle">
            Đố nhận hạt
          </button>
          <button id="btnCloseSeedTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng túi hạt giống">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${i}</div>
          <div class="seed-tray-actions">
            ${e.pendingSowPlotUid&&e.sim.state.buildings.some(p=>p.uid===e.pendingSowPlotUid&&!p.isIndestructible)?'<button id="btnSeedTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời thửa đất này">Dời ô</button>':""}
            <button id="btnSeedTrayPlantAll" type="button" class="brass-btn" title="Gieo hạt giống đã chọn vào tất cả ô đất trống">Gieo tất cả</button>
            ${e.sim.ensureFarmBarn().lastPlantedCropId?'<button id="btnSeedTrayReplantLast" type="button" class="brass-btn" title="Gieo lại hạt giống vụ trước trên các ô đất trống">🌱 Gieo lại</button>':""}
            <button id="btnSeedTrayWaterAll" type="button" class="brass-btn" title="Tưới tất cả luống đang lớn chưa được tưới">Tưới tất cả</button>
            <button id="btnSeedTrayHarvestAll" type="button" class="brass-btn gold-cta" title="Gặt tất cả luống đã chín vàng">Gặt tất cả</button>
            <button id="btnSeedTrayBuyPlot" type="button" class="brass-btn" title="Đặt Thửa Đất (30 Sickle)">
              + Đất 🪙30
            </button>
            <button id="btnSeedTrayBuyFlowerGarden" type="button" class="brass-btn" title="Đặt Vườn Hoa (55 Sickle)">
              + Vườn 🪙55
            </button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll">${d}</div>
    `;const $=t.querySelector(".seed-tray-scroll");$&&a>0&&($.scrollLeft=a);const f=Date.now(),u=e.sim.state.buildings.filter(p=>le(p.itemId)?.isFarmlandPlot),S=u.map(p=>p.uid),w=u.filter(p=>p.cropId&&p.cropReadyAt&&f>=p.cropReadyAt),I=u.filter(p=>p.cropId&&p.cropReadyAt&&f<p.cropReadyAt&&!p.cropWateredBoost),q=u.filter(p=>!p.cropId&&Date.now()>=p.constructEndsAt),P=t.querySelector("#btnSeedTrayPlantAll"),h=t.querySelector("#btnSeedTrayWaterAll"),k=t.querySelector("#btnSeedTrayHarvestAll");if(P){const p=q.length;P.disabled=p===0,P.textContent=`Gieo tất cả${p?` (${p})`:""}`,P.addEventListener("click",()=>{const g=e.activeSeedCropId;if(!g){e.showToast("🌱 Chọn một hạt giống trước để Gieo Tất Cả!","🪄");return}const b=e.sim.batchPlantCropPlots(q.map(v=>v.uid),g);e.showToast(b.msg,b.ok?"🌱":"🪄"),e.activeSeedCropId=null,e.refreshAll()})}if(h){const p=I.length;h.disabled=p===0,h.textContent=`Tưới tất cả${p?` (${p})`:""}`,h.addEventListener("click",()=>{const g=e.sim.batchWaterCropPlots(S);e.showToast(g.msg,g.ok?"💧":"🌱"),e.refreshAll()})}if(k){const p=w.length;k.disabled=p===0,k.textContent=`Gặt tất cả${p?` (${p})`:""}`,k.addEventListener("click",()=>{const g=e.sim.batchHarvestCropPlots(S);e.showToast(g.msg,g.ok?"🌾":"🌱"),e.refreshAll()})}t.querySelector("#btnSeedTrayReplantLast")?.addEventListener("click",()=>{const p=e.sim.batchReplantLastCrops();e.showToast(p.msg,p.ok?"🌱":"🪙"),e.refreshAll()}),t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const b=p.dataset.seedFilter;(b==="all"||b==="flowers"||b==="crops")&&(e.seedFilterMode=b,Yn(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const b=p.dataset.acquireSeed,v=e.sim.buyCropSeedWithGold(b,1);e.showToast(v.msg,v.ok?"🌱":"🪙"),v.ok&&(e.activeSeedCropId=b,e.refreshAll())})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),g=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.seedBrush,b=tt[g],v=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(!e.sim.state.sandboxMode&&e.sim.getSeedCount(g)<=0){e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,v);return}if(e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,v){const T=e.sim.state.buildings.find(F=>F.uid===v);if(T&&le(T.itemId)?.isFarmlandPlot&&!T.cropId){const F=e.sim.plantCropOnPlot(T.uid,g);if(F.needSeedAcquire){e.activeSeedCropId=null,e.refreshAll(),e.openSeedQuizDialog(g,T.uid);return}const A=!!e.sim.state.sandboxMode||e.sim.getSeedCount(g)>0;e.activeSeedCropId=F.ok&&A?g:null,e.showToast(F.msg,F.ok?"🌱":"🪙"),e.refreshAll();return}}e.activeSeedCropId=g,e.refreshAll(),e.showToast(`${b.name} · ${e.sim.getSeedCount(g)} hạt`,b.emoji)})}),t.querySelector("#btnSeedTrayMovePlot")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid,g=p?e.sim.state.buildings.find(v=>v.uid===p):void 0;if(!g||g.isIndestructible)return;const b=le(g.itemId);_t(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=g.uid,e.rotation=g.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${b?.name??"Thửa đất"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=le("farmland_plot");p&&(_t(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("Thửa đất · 30 Sickle/ô","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=le("burrow_flower_garden");p&&(_t(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("Vườn hoa · 55 Sickle/ô","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Na(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{const p=e.activeSeedCropId;if(p&&(e.sim.state.sandboxMode||e.sim.getSeedCount(p)>0)){const g=e.pendingSowPlotUid;if(e.seedTrayOpen=!1,e.pendingSowPlotUid=null,g){const b=e.sim.state.buildings.find(v=>v.uid===g);if(b&&le(b.itemId)?.isFarmlandPlot&&!b.cropId){const v=e.sim.plantCropOnPlot(b.uid,p),T=!!e.sim.state.sandboxMode||e.sim.getSeedCount(p)>0;e.activeSeedCropId=v.ok&&T?p:null,e.showToast(v.msg,v.ok?"🌱":"🪙")}}e.refreshAll();return}_t(e),e.refreshAll()})}function Lr(e){const t=e.root.querySelector("#pastureBrushTray"),s=e.root.querySelector("#btnOpenPastureTray");if(s){const u=e.pastureTrayOpen||!!e.activePastureAnimalId;s.dataset.active=String(u),s.setAttribute("aria-pressed",String(u))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(u=>le(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId&&Date.now()>=u.constructEndsAt).length,l=e.sim.state.buildings.filter(u=>le(u.itemId)?.isAnimalPasturePlot).length,r=e.activePastureAnimalId?kt[e.activePastureAnimalId]:null,n=Object.values(kt).map(u=>{const S=!e.sim.state.sandboxMode&&e.sim.state.level<u.unlockLevel,w=e.activePastureAnimalId===u.id;return`
          <div class="seed-card-slot pasture-card-slot ${S?"locked":""} ${w?"selected":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${S?"locked":""} ${w?"selected":""}"
              data-pasture-brush="${u.id}"
              aria-pressed="${w}"
              ${S?"disabled":""}
            >
              <span class="seed-card-seed-badge ${S?"is-locked":"has-seed"}">
                ${S?`Cấp ${u.unlockLevel}`:`🪙${u.cost.toLocaleString("vi-VN")}`}
              </span>
              <img src="/trang-trai-hang-soc/sprites/${u.spritePair[0]}.webp" alt="${x(u.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${x(u.name)}</span>
              <span class="seed-card-meta">${st(u.cycleSec)} · +🪙${u.sellValue}</span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${r?x(r.name):"Chăn Thả"}</span>
            <span class="seed-tray-sub">Trống ${o}/${l}</span>
          </div>
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn" title="Đặt Đồng Cỏ (45 Sickle)">
            + Đồng cỏ 🪙45
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-tray-actions">
            ${e.pendingStockPastureUid&&e.sim.state.buildings.some(u=>u.uid===e.pendingStockPastureUid&&!u.isIndestructible)?'<button id="btnPastureTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời ô đồng cỏ này">Dời ô</button>':""}
            <button id="btnPastureFeedAll" type="button" class="brass-btn" title="Cho tất cả đàn thú đang lớn ăn">Cho ăn tất cả</button>
            <button id="btnPastureCollectAll" type="button" class="brass-btn gold-cta" title="Thu hoạch tất cả sản vật đã sẵn sàng">Thu hoạch tất cả</button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${n}</div>
    `;const c=e.sim.state.buildings.filter(u=>le(u.itemId)?.isAnimalPasturePlot).map(u=>u.uid),i=t.querySelector("#btnPastureFeedAll"),d=t.querySelector("#btnPastureCollectAll"),a=Date.now(),$=e.sim.state.buildings.filter(u=>le(u.itemId)?.isAnimalPasturePlot&&u.pastureAnimalId&&u.pastureReadyAt&&a<u.pastureReadyAt&&!u.pastureFedBoost).length,f=e.sim.state.buildings.filter(u=>le(u.itemId)?.isAnimalPasturePlot&&u.pastureAnimalId&&u.pastureReadyAt&&a>=u.pastureReadyAt).length;i&&(i.disabled=$===0,i.textContent=`Cho ăn tất cả${$?` (${$})`:""}`,i.addEventListener("click",()=>{const u=e.sim.batchFeedAnimalPastures(c);e.showToast(u.msg,u.ok?"🌾":"✨"),e.refreshAll()})),d&&(d.disabled=f===0,d.textContent=`Thu hoạch tất cả${f?` (${f})`:""}`,d.addEventListener("click",()=>{const u=e.sim.batchHarvestAnimalPastures(c);e.showToast(u.msg,u.ok?"🐾":"✨"),e.refreshAll()})),t.querySelectorAll("[data-pasture-brush]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.pastureBrush,w=kt[S];if(!w)return;const I=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,I){const q=e.sim.state.buildings.find(P=>P.uid===I);if(q&&le(q.itemId)?.isAnimalPasturePlot&&!q.pastureAnimalId){const P=e.sim.stockAnimalOnPasture(q.uid,S);e.activePastureAnimalId=null,e.showToast(P.msg,P.ok?w.emoji:"🪙"),e.refreshAll();return}}e.activePastureAnimalId=S,e.refreshAll(),e.showToast(`${w.name} · ${w.cost.toLocaleString("vi-VN")} Sickle/ô`,w.emoji)})}),t.querySelector("#btnPastureTrayMovePlot")?.addEventListener("click",()=>{const u=e.pendingStockPastureUid,S=u?e.sim.state.buildings.find(I=>I.uid===u):void 0;if(!S||S.isIndestructible)return;const w=le(S.itemId);ss(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=S.uid,e.rotation=S.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${w?.name??"Đồng cỏ"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const u=le("burrow_animal_pasture");u&&(ss(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=u,e.refreshAll(),e.showToast("Đồng cỏ · 45 Sickle/ô","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Na(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{ss(e),e.refreshAll()})}function Pr(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,o=Date.now();if((s.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){De(e);return}if(e.activeWorkshopTab==="cargo"){const r=s.supply.cargoCrates.map(n=>`${n.id}:${n.fulfilled?1:0}:${n.helpRequestedAt?1:0}:${n.helpedByNeighborName??""}`).join("|");if(t.dataset.cargoSig&&t.dataset.cargoSig!==r){De(e);return}}if(e.activeWorkshopTab==="brew"){const r=t.querySelector("#btnWsQuickHerb");if(r){const i=Math.max(0,Math.ceil((2e4-(o-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),d=i===0||s.sandboxMode;r.classList.toggle("gold-cta",d),r.textContent=d?"🌿 Hái Thảo Dược":`🌱 (${st(i)})`}const n=t.querySelector("[data-ws-brew-left]");if(n&&s.supply.activeBrew){const i=Ds.find(a=>a.id===s.supply.activeBrew?.goodId),d=Math.max(0,Math.ceil((s.supply.activeBrew.endsAt-o)/1e3));i&&(n.textContent=`🔥 ${i.emoji} ${i.name} (còn ${Ge(d)})`)}const c=t.querySelector("[data-ws-buff-banner]");if(c){const i=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-o)/1e3)),d=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-o)/1e3));if(i<=0&&d<=0)c.classList.add("hidden");else{c.classList.remove("hidden");const a=[];i>0&&a.push(`🍻 +85% Sickle (${Ge(i)})`),d>0&&a.push(`🧪 +35%XP (${Ge(d)})`),c.textContent=`✨ ${a.join(" • ")}`}}}}function De(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,o=Date.now();e.lastWsBrewId=s.supply.activeBrew?.goodId??null;const l=e.sim.activeSynergies.activeIds.size,r=s.supply.cargoCrates.filter(h=>h.fulfilled).length,n=e.sim.ensureFarmBarn(),c=e.sim.getBarnTotalUsed(),i=e.sim.ensureMarketFairState(),d=Math.max(0,Math.floor(s.herbalCompost??0)),a=Math.max(0,3-i.spotlightLotsSold),$=i.deals.filter(h=>!h.claimed&&(s.sandboxMode||e.sim.getFarmItemCount(h.inputItemId)>=h.inputQty)).length,f=a>0&&(s.sandboxMode||e.sim.getFarmItemCount(i.spotlightCropId)>=2||e.sim.getFarmItemCount(i.spotlightGoodId)>=1),u=$+(f?1:0),S=e.sim.ensureRoadsideStand(),w=S.slots.filter(h=>!!(h.itemId&&h.soldAt)).length,I=S.slots.filter(h=>!!h.itemId).length,q=`
      <div class="workshop-tabs" role="tablist" aria-label="Kho, Sạp Ngõ, Chợ Phiên &amp; Xưởng">
        <button type="button" role="tab" id="wsTabBarn" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-selected="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          <span class="nb-tab-ico">🏡</span> Kho <span class="nb-tab-badge">${c}/${n.capacity}</span>
        </button>
        <button type="button" role="tab" id="wsTabStand" data-ws-tab="stand" data-active="${e.activeWorkshopTab==="stand"}" aria-selected="${e.activeWorkshopTab==="stand"}" class="brass-btn">
          <span class="nb-tab-ico">🧺</span> <span class="hs-long">Sạp Ngõ</span><span class="hs-short">Sạp</span> <span class="nb-tab-badge">${w>0?`${w} xong`:`${I}/6`}</span>
        </button>
        <button type="button" role="tab" id="wsTabMarket" data-ws-tab="market" data-active="${e.activeWorkshopTab==="market"}" aria-selected="${e.activeWorkshopTab==="market"}" class="brass-btn">
          <span class="nb-tab-ico">🎪</span> <span class="hs-long">Chợ Phiên</span><span class="hs-short">Chợ</span> <span class="nb-tab-badge">${u>0?`${u} sẵn`:`${a}/3`}</span>
        </button>
        <button type="button" role="tab" id="wsTabCargo" data-ws-tab="cargo" data-active="${e.activeWorkshopTab==="cargo"}" aria-selected="${e.activeWorkshopTab==="cargo"}" class="brass-btn">
          <span class="nb-tab-ico">🚂</span> Tàu <span class="nb-tab-badge">${r}/3</span>
        </button>
        <button type="button" role="tab" id="wsTabBrew" data-ws-tab="brew" data-active="${e.activeWorkshopTab==="brew"}" aria-selected="${e.activeWorkshopTab==="brew"}" class="brass-btn">
          <span class="nb-tab-ico">🧪</span> <span class="hs-long">Vạc Phép</span><span class="hs-short">Vạc</span>
        </button>
        <button type="button" role="tab" id="wsTabSynergy" data-ws-tab="synergy" data-active="${e.activeWorkshopTab==="synergy"}" aria-selected="${e.activeWorkshopTab==="synergy"}" class="brass-btn">
          <span class="nb-tab-ico">🌟</span> Combo <span class="nb-tab-badge">${l}/12</span>
        </button>
      </div>
    `;let P="";if(e.activeWorkshopTab==="barn"){const h=Math.min(100,Math.round(c/Math.max(1,n.capacity)*100)),k=e.sim.getBarnUpgradeCostInfo(),p=s.sandboxMode?"+20 Ô (Miễn phí)":k.hasPlug?`+20 Ô (1 🔌 + ${k.baseGoldCost} Sickle)`:`+20 Ô (${k.effectiveGoldCost} Sickle)`,g=k.hasPlug?`🔌 ×${k.plugsInBarn}`:`🔌 ×0 (bù +${k.plugShortageBuyout} Sickle)`,b=Ve(i.spotlightCropId),v=Ve(i.spotlightGoodId),T=Z=>Z.map(re=>{const B=Ve(re),U=e.sim.getFarmItemCount(re),E=e.sim.isItemMarketSpotlight(re);return`
              <div class="barn-stock-card ${U>0?"in-stock":"empty"}">
                <img src="${B.iconSrc}" alt="${x(B.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${x(B.name)} ${E?'<span class="owl-spotlight-tag">🎪 Tiêu điểm</span>':""}</div>
                <div class="barn-stock-qty"><strong>×${s.sandboxMode?"∞":U}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${U>0||s.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${re}"
                  ${U<=0&&!s.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:12px;"
                >
                  🪙 +${B.sellValue} Sickle
                </button>
              </div>
            `}).join(""),F=e.sim.getPhoenixTalismanCount(),A=e.sim.getPhoenixTalismanDailyStatus(),H=e.sim.getCraftablePhoenixBarnGood(),K=H?Ve(H):null,V=s.sandboxMode||F<ba&&!!H&&s.galleons>=tn;P=`
        <div class="barn-header-card">
          <div class="barn-head-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="barn-head-text">
              <div class="hs-card-title">🏡 Kho Đỏ (${c}/${n.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${n.ordersDelivered} · ${g} · 🌿 Phân Ủ: ×${s.sandboxMode?"∞":d}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${k.canAfford?"":"disabled"}
              style="padding:7px 14px;font-size:13px;${k.canAfford?"":"opacity:0.55;cursor:not-allowed;"}"
            >
              ${p}
            </button>
          </div>
          <div class="quest-bar" style="height:8px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${h}%"></div>
          </div>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;white-space:normal;overflow-wrap:break-word;">
            🎪 <strong>Tiêu Điểm Hôm Nay:</strong> ${b.emoji} ${x(b.name)} &amp; ${v.emoji} ${x(v.name)}
          </div>
          <button type="button" class="brass-btn gold-cta" data-ws-tab="market" style="padding:5px 10px;font-size:12px;">
            🎪 Vào Chợ Phiên (+60%)
          </button>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;">
            <div>🧙 <strong>Phụ Tá Gia Tinh Bà Molly:</strong> ${n.farmHelperEndsAt&&n.farmHelperEndsAt>o?`<span style="color:#15803d;">Đang trực (${st(Math.ceil((n.farmHelperEndsAt-o)/1e3))})</span>`:"Tự động tưới luống mới &amp; gom thành phẩm xưởng vào Kho Đỏ"}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${n.farmHelperFreeDayKey!==Qi()?'<button type="button" class="brass-btn gold-cta" data-activate-helper="free_daily" style="padding:5px 10px;font-size:12px;">🎁 30p Miễn phí</button>':""}
            <button type="button" class="brass-btn" data-activate-helper="feast_points" style="padding:5px 10px;font-size:12px;">🍁 2h (20 điểm)</button>
            <button type="button" class="brass-btn" data-activate-helper="sickle" style="padding:5px 10px;font-size:12px;">🪙 2h (120 Sickle)</button>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <h3 class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${s.sandboxMode?"∞":`${F}/${ba}`})
            </h3>
            <div class="barn-talisman-forge-sub" style="margin-top:2px;">
              Hôm nay: ${A.usedCount}/${A.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${V?"":"disabled"}
            style="padding:8px 12px;font-size:12px;"
          >
            🔥 Rèn +1 (${K?`1 ${x(K.name)}`:"1 Đặc sản"} + ${tn} Sickle)
          </button>
        </div>

        <h3 class="hs-section-title" style="margin:12px 0 6px;">Nông sản (${Object.keys(tt).length})</h3>
        <div class="barn-stock-grid">
          ${T(Object.keys(tt))}
        </div>

        <h3 class="hs-section-title" style="margin:14px 0 6px;">Đặc sản (${Object.keys(Ot).length})</h3>
        <div class="barn-stock-grid">
          ${T(Object.keys(Ot))}
        </div>
      `}else if(e.activeWorkshopTab==="stand"){const k=[...Object.keys(tt),...Object.keys(Ot)].filter(T=>s.sandboxMode||e.sim.getFarmItemCount(T)>0);k.length>0&&!k.includes(e.selectedStandItemId)&&(e.selectedStandItemId=k[0]);const p=Ve(e.selectedStandItemId),g=e.sim.getFarmItemCount(e.selectedStandItemId),b=Xi(e.selectedStandItemId,e.selectedStandPriceTier),v=Math.max(1,Math.min(3,s.sandboxMode?2:g));P=`
        <div class="quest-card-mini">
          <div class="hs-card-title">🧺 Sạp Hàng Đầu Ngõ Hang Sóc (6 Ô)</div>
          <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 8px;">
            Bày nông sản hoặc đặc sản dư trong Kho để khách lữ hành Hogsmeade và hàng xóm ghé mua lấy Sickle!
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="selStandItem" aria-label="Chọn nông sản bày sạp" style="flex:1;min-width:160px;min-height:38px;padding:4px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:var(--ink);font-weight:700;">
              ${(k.length>0?k:["ottery_wheat"]).map(T=>{const F=Ve(T),A=e.sim.getFarmItemCount(T);return`<option value="${T}" ${T===e.selectedStandItemId?"selected":""}>${x(F.name)} (×${s.sandboxMode?"∞":A})</option>`}).join("")}
            </select>
            <div style="display:flex;gap:4px;">
              ${[["bargain","Giá hời (nhanh)"],["fair","Chuẩn (+15%)"],["premium","Cao (+35%)"]].map(([T,F])=>`<button type="button" data-stand-tier="${T}" data-active="${e.selectedStandPriceTier===T}" aria-pressed="${e.selectedStandPriceTier===T}" class="brass-btn ${e.selectedStandPriceTier===T?"gold-cta":""}" style="padding:4px 8px;font-size:12px;">${F}</button>`).join("")}
            </div>
          </div>
          <div style="font-size:12px;font-weight:700;margin-top:6px;">
            Lô mẫu: <strong>${v} × ${x(p.name)}</strong> → <strong>+${b*v} Sickle</strong>
          </div>
        </div>

        <div class="market-deal-grid" style="margin-top:8px;">
          ${S.slots.map(T=>{if(!T.itemId){const V=s.sandboxMode||g>=1;return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">Ô Sạp #${T.slotIndex+1} · Trống</div>
                    <div style="font-size:12px;color:var(--ink-soft);margin:4px 0;">Sẵn sàng bày ${v} ${x(p.name)}</div>
                    <button type="button" data-stand-list="${T.slotIndex}" ${V?"":"disabled"} class="brass-btn ${V?"gold-cta":""}" style="width:100%;">
                      🧺 Bày bán (+${b*v} Sickle)
                    </button>
                  </div>
                `}const F=Ve(T.itemId),A=T.qty*T.unitPrice;if(T.soldAt)return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">${T.buyerEmoji??"🍺"} ${x(T.buyerName??"Khách lữ hành")} đã mua!</div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${F.iconSrc}" alt="${x(F.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">${T.qty} × ${x(F.name)}</div>
                    </div>
                    <button type="button" data-stand-claim="${T.slotIndex}" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">
                      🪙 Thu +${A} Sickle
                    </button>
                  </div>
                `;const H=Yi(T.unitPrice,F.sellValue),K=Math.max(1,Math.ceil((T.listedAt+H-o)/1e3));return`
                <div class="market-deal-card">
                  <div class="hs-card-title">Ô Sạp #${T.slotIndex+1} · Đang rao</div>
                  <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                    <img src="${F.iconSrc}" alt="${x(F.name)}" style="width:32px;height:32px;object-fit:contain;" />
                    <div>
                      <div style="font-size:13px;font-weight:700;">${T.qty} × ${x(F.name)}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">Giá ${A} Sickle · khách ghé ~${st(K)}</div>
                    </div>
                  </div>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="market"){const h=Ve(i.spotlightCropId),k=Ve(i.spotlightGoodId),p=e.sim.getFarmItemCount(i.spotlightCropId),g=e.sim.getFarmItemCount(i.spotlightGoodId),b=Math.max(16,Math.round(h.sellValue*2*1.6)+12),v=Math.max(16,Math.round(k.sellValue*1*1.6)+12),T=a>0&&(s.sandboxMode||p>=2),F=a>0&&(s.sandboxMode||g>=1),A=Math.max(0,1-i.rerollsUsed);P=`
        <div class="market-spotlight-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div>
              <div class="hs-card-title">Sạp Tiêu Điểm (${a}/3 lô hôm nay)</div>
              <div class="hs-stat-pills">
                <span class="hs-stat-pill" title="Thu mua giá cao cộng thêm 60% Sickle mỗi lô sỉ">🪙 +60% Sickle</span>
                <span class="hs-stat-pill" title="Tặng thêm 1 Phân Ủ Thảo Dược mỗi lô">🌿 +1</span>
                <span class="hs-stat-pill" title="Tặng 12 điểm Đại Tiệc Mùa Gặt mỗi lô">🍁 +12</span>
                <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 Kho: ×${s.sandboxMode?"∞":d}</span>
                <span class="hs-stat-pill is-active" title="Đơn Hàng Cú có món Tiêu Điểm hôm nay thưởng thêm 1 Phân Ủ, 8 XP và 6 điểm Đại Tiệc">🦉 +1🌿 · +8⭐</span>
              </div>
            </div>
          </div>

          <div class="market-deal-grid">
            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${h.iconSrc}" alt="${x(h.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">2 × ${x(h.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${s.sandboxMode?"∞":p}/2</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${T?"gold-cta":""}" data-sell-spotlight="crop" title="Bán 2 nông sản Tiêu Điểm lấy ${b} Sickle và 1 Phân Ủ" ${T?"":"disabled"} style="width:100%;">
                🪙 +${b} · +1 🌿
              </button>
            </div>

            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${k.iconSrc}" alt="${x(k.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">1 × ${x(k.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${s.sandboxMode?"∞":g}/1</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${F?"gold-cta":""}" data-sell-spotlight="good" title="Bán 1 đặc sản Tiêu Điểm lấy ${v} Sickle và 1 Phân Ủ" ${F?"":"disabled"} style="width:100%;">
                🪙 +${v} · +1 🌿
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:10px 0 8px;">
          <h3 class="hs-section-title" style="margin:0;">3 Thương Vụ Thương Lái Hogsmeade</h3>
          <button id="btnRerollMarketFair" type="button" class="brass-btn" ${A<=0&&!s.sandboxMode?"disabled":""}>
            🔄 Đổi Sạp (${s.sandboxMode?"∞":`${A}/1`})
          </button>
        </div>

        <div class="market-deal-grid">
          ${i.deals.map(H=>{const K=Ve(H.inputItemId),V=e.sim.getFarmItemCount(H.inputItemId),Z=!H.claimed&&(s.sandboxMode||V>=H.inputQty),re=[{label:`🪙 +${H.rewardSickle}`,tip:`Thưởng ${H.rewardSickle} Sickle`},{label:`⭐ +${H.rewardXp}`,tip:`Thưởng ${H.rewardXp} XP`}];if(H.rewardCompost&&re.push({label:`🌿 +${H.rewardCompost}`,tip:`Thưởng ${H.rewardCompost} Phân Ủ Thảo Dược`}),H.rewardSeedCropId&&H.rewardSeedQty){const B=tt[H.rewardSeedCropId];re.push({label:`🌱 +${H.rewardSeedQty} ${x(B.name)}`,tip:`Tặng ${H.rewardSeedQty} hạt ${x(B.name)}`})}return H.rewardMorningDew&&re.push({label:`💧 +${H.rewardMorningDew}`,tip:`Thưởng ${H.rewardMorningDew} Bình Sương Mai`}),H.rewardMugglePlug&&re.push({label:`🔌 +${H.rewardMugglePlug}`,tip:`Thưởng ${H.rewardMugglePlug} Phích Cắm`}),H.rewardTimeSand&&re.push({label:`⏳ +${H.rewardTimeSand}`,tip:`Thưởng ${H.rewardTimeSand} Cát Xoay Thời Gian`}),`
                <div class="market-deal-card ${H.claimed?"claimed":""}">
                  <div>
                    <div class="hs-card-title" style="margin-bottom:6px;">${H.merchantEmoji} ${x(H.merchantName)}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <img src="${K.iconSrc}" alt="${x(K.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">
                        ${x(K.name)} (${s.sandboxMode?"∞":V}/${H.inputQty})
                      </div>
                    </div>
                    <div class="hs-stat-pills">
                      ${re.map(B=>`<span class="hs-stat-pill" title="${B.tip}">${B.label}</span>`).join("")}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="brass-btn ${Z?"gold-cta":""}"
                    data-claim-market-deal="${x(H.id)}"
                    title="${H.claimed?"Đã giao dịch thương vụ này hôm nay":`Đổi ${H.inputQty} ${x(K.name)} lấy thương vụ`}"
                    ${H.claimed||!Z?"disabled":""}
                    style="width:100%;"
                  >
                    ${H.claimed?"✓ Đã chốt":"🪙 Chốt đơn"}
                  </button>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const h=Math.max(0,Math.ceil((2e4-(o-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),k=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-o)/1e3)),p=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-o)/1e3)),g=s.supply.activeBrew,b=g?Ds.find(Z=>Z.id===g.goodId):void 0,v=g?Math.max(0,Math.ceil((g.endsAt-o)/1e3)):0,T=Math.max(0,s.supply.brewCompletedCount??0),F=T+1,A=s.buildings.some(Z=>le(Z.itemId)?.isWorkshopBrewery&&o>=Z.constructEndsAt),H=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),K=T===0?"Mẻ #1 (1h)":T===1?"Mẻ #2 (2h)":T===2?"Mẻ #3 (4h)":`Mẻ #${F} (6h)`,V=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];P=`
        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div class="hs-card-title">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${h===0||s.sandboxMode?"gold-cta":""}">
            ${h>0&&!s.sandboxMode?`🌱 (${st(h)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="font-size:12px;line-height:1.45;">
          <div style="font-size:13px;font-weight:700;color:var(--brand-strong);">
            🔥 Nhiệt Vạc · ${K}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Chu kỳ 1h → 2h → 4h → 6h.${A?" ✓ −45% Xưởng.":" Dựng Xưởng −45%."}${H?" ✓ −22% Combo.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${V.map(Z=>{const re=Us[Z],B=s.supply.ingredients[Z]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
                    <span>${re.emoji} ${re.name}</span>
                    <span style="color:#b45309;">×${s.sandboxMode?"∞":B}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${k>0||p>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="font-size:12px;font-weight:700;color:#15803d;">
                ✨ ${k>0?`🍻 +85% Sickle (${Ge(k)}) `:""}${p>0?`• 🧪 +35% XP (${Ge(p)})`:""}
              </div>
            `:""}

        ${g&&b?`
              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13px;font-weight:700;color:#6b21a8;">
                    🔥 ${b.emoji} ${x(b.name)} (${Ge(v)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Ds.map(Z=>{const re=s.supply.goods[Z.id]??0,B=e.sim.getBrewDurationSec(Z),U=st(B),E=Object.entries(Z.inputs).map(([de,oe])=>{const he=Us[de],Ie=s.supply.ingredients[de]??0;return`<span style="color:${s.sandboxMode||Ie>=(oe??0)?"#15803d":"#dc2626"};font-weight:700;">${he.emoji} ${Ie}/${oe}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="hs-card-title">${Z.emoji} ${Z.name}</span>
                    <span style="font-size:12px;font-weight:700;color:#7c2d12;">×${s.sandboxMode?"∞":re}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${E}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${Z.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${U})
                  </button>
                  <button type="button" data-use-good="${Z.id}" class="brass-btn" style="flex:1;">
                    ${Z.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const h=Math.max(1,Math.round((240+s.level*40)/5)),k=Math.round(160+s.level*25),p=s.supply.cargoCrates.some(g=>!!(g.helpRequestedAt||g.helpedByNeighborName));P=`
        <div class="quest-card-mini">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="hs-card-title">
              🚂 Tàu #${s.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:700;">+${h.toLocaleString("vi-VN")} Sickle · +${k} ⭐ · +2 ⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${s.supply.cargoCrates.map((g,b)=>{const v=e.sim.getCargoCrateStockInfo(g),T=Ve(v.barnItemId),F=Ds.find(A=>A.id===g.goodId);return`
                <div class="crate-card ${g.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#92400e;">
                      <span>#${b+1}</span>
                      <span>${g.fulfilled?"✓":`${s.sandboxMode?"∞":v.haveBarn}/${g.qtyRequired}`}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${T.iconSrc}" alt="${x(T.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div>
                        <div class="hs-card-title">${x(T.name)} ×${g.qtyRequired}</div>
                        ${v.allowBrewEquiv&&F&&v.haveBrew>0?`<div style="font-size:11px;opacity:0.8;">+ ${v.haveBrew} mẻ ${x(F.name)} (Vạc Phép)</div>`:""}
                      </div>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${g.rewardSickle} Sickle · +${g.rewardXp} ⭐ · +${g.rewardTimeSand} ⏳
                    </div>
                  </div>
                  ${g.fulfilled?`<div style="font-size:12px;font-weight:700;color:#15803d;text-align:center;padding:6px 0;">${g.helpedByNeighborName?`✓ ${x(g.helpedByNeighborEmoji??"🤝")} ${x(g.helpedByNeighborName)} đóng hộ`:"✓ Đã chất"}</div>`:v.canFulfill?`<button type="button" data-fulfill-crate="${x(g.id)}" class="brass-btn gold-cta" style="width:100%;">📦 Chất hàng</button>`:`<div style="display:flex;flex-direction:column;gap:6px;">
                            <button type="button" data-jump-cargo-item="${x(v.barnItemId)}" class="brass-btn gold-cta" style="width:100%;">→ Tìm / Sản xuất</button>
                            ${g.helpRequestedAt?'<div style="font-size:12px;font-weight:700;color:var(--brand-strong);text-align:center;padding:4px 0;">🦉 Đang gọi...</div>':`<button type="button" data-help-cargo-crate="${x(g.id)}" class="brass-btn" style="width:100%;" title="Nhờ hàng xóm đóng hộ kiện hàng này (tối đa 1 kiện mỗi chuyến tàu)" ${p?"disabled":""}>🦉 Nhờ đóng hộ (1/tàu)</button>`}
                            ${v.allowBrewEquiv?'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu ở Vạc Phép</button>':""}
                          </div>`}
                </div>
              `}).join("")}
        </div>
      `}else P=`
        <div class="grid-2col">
          ${Fi.map(h=>{const k=e.sim.activeSynergies.activeIds.has(h.id),p=h.requiredItems.map(g=>le(g)?.name??g).join(" + ");return`
              <div class="quest-card-mini" style="border-color:${k?"#d97706":"rgba(176, 125, 67, 0.45)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span class="hs-card-title">${h.emoji} ${x(h.name)}</span>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;color:${k?"#15803d":"#78350f"};">
                    ${k?"✓":`≤${h.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">${p}</div>
                <div style="font-size:12px;font-weight:700;color:#15803d;">
                  +${h.goldBonusPct}% Sickle · +${h.xpBonusPct}% XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=q+P,t.dataset.cargoSig=s.supply.cargoCrates.map(h=>`${h.id}:${h.fulfilled?1:0}:${h.helpRequestedAt?1:0}:${h.helpedByNeighborName??""}`).join("|"),t.querySelectorAll("[data-ws-tab]").forEach(h=>{h.addEventListener("click",()=>{e.activeWorkshopTab=h.dataset.wsTab,De(e),t.querySelector(`[data-ws-tab="${e.activeWorkshopTab}"]`)?.scrollIntoView?.({block:"nearest",inline:"nearest",container:"nearest"})})}),t.querySelectorAll("[data-sell-spotlight]").forEach(h=>{h.addEventListener("click",()=>{const k=h.dataset.sellSpotlight==="good"?"good":"crop",p=e.sim.sellMarketSpotlightLot(k);p.ok||e.showToast(p.msg,"🎪"),De(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-market-deal]").forEach(h=>{h.addEventListener("click",()=>{const k=e.sim.fulfillMarketFairDeal(h.dataset.claimMarketDeal);k.ok||e.showToast(k.msg,"🎪"),De(e),e.refreshHeader()})}),t.querySelector("#btnRerollMarketFair")?.addEventListener("click",()=>{const h=e.sim.rerollMarketFairDeals();h.ok||e.showToast(h.msg,"🎪"),De(e)}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const h=e.sim.upgradeFarmBarn();e.showToast(h.msg,h.ok?"🏡":"🔌"),De(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const h=e.sim.craftPhoenixTalismanFromBarn();e.showToast(h.msg,h.ok?"🔥":"🧺"),De(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(h=>{h.addEventListener("click",()=>{const k=e.sim.sellFarmItemFromBarn(h.dataset.sellFarmItem,1);k.ok||e.showToast(k.msg,"🧺"),De(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const h=e.sim.quickHarvestHerbs();e.showToast(h.msg,h.ok?"🌿":"⏳"),De(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&De(e)}),t.querySelectorAll("[data-brew-good]").forEach(h=>{h.addEventListener("click",()=>{const k=e.sim.startBrewing(h.dataset.brewGood);e.showToast(k.msg,k.ok?"🧪":"⚠️"),De(e)})}),t.querySelectorAll("[data-use-good]").forEach(h=>{h.addEventListener("click",()=>{const k=h.dataset.useGood,p=e.sim.useCraftedGood(k);p.ok?k==="dragon_firework"?e.root.querySelector("#workshopDialog").close():De(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(h=>{h.addEventListener("click",()=>{const k=e.sim.fulfillCargoCrate(h.dataset.fulfillCrate);e.showToast(k.msg,k.ok?"📦":"⚠️"),De(e),e.refreshHeader()})}),t.querySelectorAll("[data-help-cargo-crate]").forEach(h=>{h.addEventListener("click",()=>{const k=e.sim.requestCargoCrateHelp(h.dataset.helpCargoCrate);e.showToast(k.msg,k.ok?"🤝":"🚂"),De(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(h=>{h.addEventListener("click",()=>{e.activeWorkshopTab="brew",De(e)})}),t.querySelectorAll("[data-jump-cargo-item]").forEach(h=>{h.addEventListener("click",()=>{const k=h.dataset.jumpCargoItem;e.root.querySelector("#workshopDialog")?.close(),e.jumpToMissingFarmItem(k)})}),t.querySelectorAll("[data-activate-helper]").forEach(h=>{h.addEventListener("click",()=>{const k=h.dataset.activateHelper,p=e.sim.activateFarmHelper(k);e.showToast(p.msg,p.ok?"🧙":"🪙"),De(e),e.refreshHeader()})}),t.querySelector("#selStandItem")?.addEventListener("change",h=>{e.selectedStandItemId=h.currentTarget.value,De(e)}),t.querySelectorAll("[data-stand-tier]").forEach(h=>{h.addEventListener("click",()=>{e.selectedStandPriceTier=h.dataset.standTier,De(e)})}),t.querySelectorAll("[data-stand-list]").forEach(h=>{h.addEventListener("click",()=>{const k=Number(h.dataset.standList),p=e.sim.getFarmItemCount(e.selectedStandItemId),g=Math.max(1,Math.min(3,s.sandboxMode?2:p)),b=e.sim.listOnRoadsideStand(k,e.selectedStandItemId,g,e.selectedStandPriceTier);e.showToast(b.msg,b.ok?"🧺":"⚠️"),De(e),e.refreshHeader()})}),t.querySelectorAll("[data-stand-claim]").forEach(h=>{h.addEventListener("click",()=>{const k=Number(h.dataset.standClaim),p=e.sim.claimRoadsideStandSlot(k);e.showToast(p.msg,p.ok?"🪙":"🧺"),De(e),e.refreshHeader()})})}const Pe=e=>e.toLocaleString("vi-VN"),wa=7*36e5,da=864e5,Er={match3:"Bùa Gặt",caro:"Dò Mìn",sudoku:"Số Học",chess:"Bắn Cá",blocks:"Sinh Vật",jigsaw:"Tranh Ghép"},ns=["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"],Fa=so,xa=ao,Oa=eo,_a=Zi,Va=to,za=Ji,Ir=Date.UTC(2026,10,20,10,0,0,0),Qs=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),hs=10,Zn=[1e6],Ua=10,Br=1e5,Hr=3e5;function Ta(e,t=hs){const s=Math.max(0,Math.floor(Number(e)||0)),o=Math.max(1,Math.floor(Number(t)||hs));return s<o?0:Math.floor(s/o)}function fn(e,t,s,o){const l=Math.max(1,Math.floor(Number(e.reverseSicklePerGalleon)||hs)),r=Ta(o,l);if(!e.reverseEnabled)return{ok:!1,galleonsOut:r,reason:"Chiều đổi Sickle sang Galleons đang đóng."};if(e.reverseFlagged)return{ok:!1,galleonsOut:r,reason:e.reverseBlockedReason||"Tài khoản đang tạm khóa đổi ngược do phát hiện biến động Sickle bất thường."};const n=Math.max(1,Math.floor(Number(e.reverseMinLevel)||Ua));if(s<n)return{ok:!1,galleonsOut:r,reason:`Cần Điền Trang đạt Cấp ${n} trở lên để đổi Sickle sang Galleons.`};if(r<=0||o<=0)return{ok:!1,galleonsOut:0,reason:"Gói quy đổi không hợp lệ."};if(t<o)return{ok:!1,galleonsOut:r,reason:`Chưa đủ ${Pe(o)} Sickle trong trang trại.`};const c=Math.max(0,Math.floor(Number(e.reverseDailyCapGalleons)||0)),i=Math.max(0,Math.floor(Number(e.reverseTodayGalleons)||0));if(c>0&&i+r>c)return{ok:!1,galleonsOut:r,reason:`Vượt hạn mức ngày (${Pe(i)}/${Pe(c)} Galleons).`};const d=Math.max(0,Math.floor(Number(e.reverseWeeklyCapGalleons)||0)),a=Math.max(0,Math.floor(Number(e.reverseWeekGalleons)||0));return d>0&&a+r>d?{ok:!1,galleonsOut:r,reason:`Vượt hạn mức tuần (${Pe(a)}/${Pe(d)} Galleons).`}:{ok:!0,galleonsOut:r}}function qr(){return{enabled:!0,sicklePerGalleon:1,packs:[100,500,1e3],balance:25e4,reverseEnabled:!0,reverseSicklePerGalleon:hs,reversePacks:[...Zn],reverseMinLevel:Ua,reverseDailyCapGalleons:Br,reverseTodayGalleons:0,reverseWeeklyCapGalleons:Hr,reverseWeekGalleons:0,reverseFlagged:!1}}const Dr=()=>fa?Promise.resolve(qr()):Ys("farm",{op:"wallet"});let Is=null,Bs=null;async function Rr(e){Is?.galleons!==e&&(Is={galleons:e,requestId:crypto.randomUUID()});const t=await Ys("farm",{op:"sickles",...Is});return Is=null,An(t?.inbox),t}async function Nr(e){const t=Math.max(1,Math.floor(Number(e)||0));Bs?.sickles!==t&&(Bs={sickles:t,requestId:crypto.randomUUID()}),await Rs();const s=await Ys("farm",{op:"galleons",...Bs});return Bs=null,An(s?.inbox),s}function pa(e){const t=new Date(e+wa),s=t.getUTCFullYear(),o=String(t.getUTCMonth()+1).padStart(2,"0"),l=String(t.getUTCDate()).padStart(2,"0");return`${s}-${o}-${l}`}function Jn(e=Date.now(),t){const s=Math.max(0,Math.min(6,Math.floor(Number(t?.startWeekdayVn??Oa)))),o=Math.max(0,Math.min(23,Math.floor(Number(t?.startHourVn??_a)))),l=Math.max(0,Math.min(6,Math.floor(Number(t?.payoutWeekdayVn??Va)))),r=Math.max(0,Math.min(23,Math.floor(Number(t?.payoutHourVn??za)))),n=t?.firstSeasonStartMs??Ir,i=((l-s+7)%7||7)*da+(r-o)*36e5,d=`Bắt đầu ${String(o).padStart(2,"0")}:00 ${ns[s]??"Thứ Sáu"}`,a=`Kết thúc ${String(r).padStart(2,"0")}:00 ${ns[l]??"Thứ Sáu"}`;if(e<n){const h=n,k=h+i;return{phase:"upcoming",startsAt:h,endsAt:k,targetAt:h,cycleKey:pa(k),labelVi:d}}const $=e+wa,f=new Date($),u=(f.getUTCDay()-s+7)%7;let S=Date.UTC(f.getUTCFullYear(),f.getUTCMonth(),f.getUTCDate()-u,o,0,0,0);S>$&&(S-=7*da);const w=S-wa,I=w+i;if(e<I)return{phase:"active",startsAt:w,endsAt:I,targetAt:I,cycleKey:pa(I),labelVi:a};const q=w+7*da,P=q+i;return{phase:"break",startsAt:q,endsAt:P,targetAt:q,cycleKey:pa(P),labelVi:d}}function ei(e,t=Date.now(),s="Sắp mở"){const o=Math.max(0,Math.floor(e-t));if(o<6e4)return s;const l=Math.floor(o/6e4),r=Math.floor(l/1440),n=Math.floor(l%1440/60),c=l%60;return r>0?`Còn ${r} ngày ${n} giờ`:n>0?c>0?`Còn ${n} giờ ${c} phút`:`Còn ${n} giờ`:`Còn ${c} phút`}function Fr(e,t=Fa){const s=Math.max(0,Math.floor(Number(t)||0)),o=Math.max(0,Math.floor(Number(e)||0));if(o<=0||s<=0)return{poolGalleons:s,qualifiedMembers:o,perMemberGalleons:0,remainderGalleons:s};const l=Math.floor(s/o);return{poolGalleons:s,qualifiedMembers:o,perMemberGalleons:l,remainderGalleons:s-l*o}}function Or(e,t=xa){const s=Math.max(1,Math.floor(Number(t)||xa));let o=0,l=null;if(e)for(const r of no){const n=Math.max(0,Math.floor(Number(e[r])||0));n>o&&(o=n,l=r)}return{qualified:o>=s,bestPlays:o,bestDiscipline:l,remainingGames:Math.max(0,s-o)}}function _r(e){const t=e.cup?.allianceReward??Mn();if(!t.enabled)return"";const s=e.nowMs??Date.now(),o=Math.max(0,Math.floor(t.poolAmount||Fa)),l=Math.max(1,Math.floor(t.minGamesAnyMinigame||xa)),r=t.startWeekdayVn??Oa,n=t.startHourVn??_a,c=t.payoutWeekdayVn??Va,i=t.payoutHourVn??za,d=Jn(s,{startWeekdayVn:r,startHourVn:n,payoutWeekdayVn:c,payoutHourVn:i});let a=d.labelVi,$=d.targetAt,f=d.phase==="active"?"Sắp chốt thưởng":"Sắp bắt đầu";typeof t.seasonStartsAt=="number"&&t.seasonStartsAt>s?($=t.seasonStartsAt,a=`Bắt đầu ${String(n).padStart(2,"0")}:00 ${ns[r]??"Thứ Sáu"}`,f="Sắp bắt đầu"):typeof t.nextPayoutAt=="number"&&t.nextPayoutAt>s&&($=t.nextPayoutAt,a=`Kết thúc ${String(i).padStart(2,"0")}:00 ${ns[c]??"Thứ Sáu"}`,f="Sắp chốt thưởng");const u=ei($,s,f),S=typeof t.memberBestPlays=="number",w=Or(e.localPlays,l),I=S?Math.max(0,Math.floor(t.memberBestPlays)):w.bestPlays,q=S?t.memberBestDiscipline??null:w.bestDiscipline,P=S?!!(t.memberQualified??I>=l):w.qualified,h=q?` · ${Er[q]}`:"",k=typeof t.qualifiedCount=="number"&&t.qualifiedCount>0?Fr(t.qualifiedCount,o):null,p=k?`<div class="hs-cup-prize-meta"><strong>~${Pe(t.estimatedPerMember||k.perMemberGalleons)} Galleons/người</strong> · ${Pe(k.qualifiedMembers)} thành viên</div>`:"",g=!!(!e.noHouse&&e.playerAlliance&&e.playerAlliance.id===e.leadingAlliance.id);let b="";e.noHouse?b='<div class="hs-cup-prize-status">Chưa phân Nhà</div>':P?b=`<div class="hs-cup-prize-status is-ok">Đủ điều kiện (${Pe(I)}/${l} ván${h})${g?" · Đang dẫn đầu":""}</div>`:b=`<div class="hs-cup-prize-status">${Pe(I)}/${l} ván${h}</div>`;const v=t.lastPayout?`<div class="hs-cup-prize-meta">Kỳ trước (${Qs(t.lastPayout.cycleKey)}): <strong>${Qs(t.lastPayout.allianceNameVi)}</strong> · +${Pe(t.lastPayout.perMemberAmount)} Galleons/người</div>`:"";return`
    <div class="hs-cup-prize">
      <div class="hs-cup-prize-head">
        <strong>Thưởng Liên Minh #1 · ${Pe(o)} Galleons</strong>
        <span class="hs-cup-prize-pill">${a} · ${u}</span>
      </div>
      ${p}
      ${b}
      ${v}
    </div>`}function gs(e,t){if(e.className="quest-card-mini hpvn-exchange",e.style.cssText="padding:12px;margin-top:12px;",t.sim.isHeadmasterPreview||t.sim.state.sandboxMode){e.textContent="🏦 Quầy Gringotts không mở trong chế độ thử.";return}e.textContent="🏦 Đang mở quầy Gringotts…",Dr().then(s=>{if(!e.isConnected)return;if(!s.enabled&&!s.reverseEnabled){e.textContent="🏦 Quầy Gringotts đang đóng.";return}const o=Math.max(0,Math.floor(t.sim.state.galleons??0)),l=Math.max(1,Math.floor(t.sim.state.level??1)),r=s.enabled?`
        <div class="hs-gringotts-head">
          <span>🏦 Đổi Galleons → Sickle</span><span>Ví: ${Pe(s.balance)} Galleons</span>
        </div>
        <div class="hs-gringotts-packs">${s.packs.map(w=>`
          <button type="button" class="brass-btn" data-pack="${w}" ${s.balance<w?"disabled":""}>${Pe(w)} Galleons → ${Pe(w*s.sicklePerGalleon)} Sickle</button>`).join("")}
        </div>`:"";let n='<div class="hs-gringotts-note">Một chiều: Sickle không đổi lại được Galleons.</div>';if(s.reverseEnabled){const w=Math.max(1,Math.floor(Number(s.reverseSicklePerGalleon)||hs)),I=Array.isArray(s.reversePacks)&&s.reversePacks.length>0?s.reversePacks.filter(H=>Number.isFinite(H)&&H>=w):[...Zn],q=I[0]??1e6,P=Ta(q,w),h=Math.max(0,Math.floor(Number(s.reverseDailyCapGalleons)||0)),k=Math.max(0,Math.floor(Number(s.reverseTodayGalleons)||0)),p=Math.max(0,Math.floor(Number(s.reverseWeeklyCapGalleons)||0)),g=Math.max(0,Math.floor(Number(s.reverseWeekGalleons)||0)),b=Math.max(1,Math.floor(Number(s.reverseMinLevel)||Ua)),v=[`Tỷ lệ: ${Pe(q)} Sickle = ${Pe(P)} Galleons`];h>0&&v.push(`Hôm nay: ${Pe(k)}/${Pe(h)}`),p>0&&v.push(`Tuần: ${Pe(g)}/${Pe(p)}`);const T=fn(s,o,l,q),F=s.reverseFlagged?`<div class="hs-gringotts-warn">${Qs(s.reverseBlockedReason||"Tài khoản đang tạm khóa đổi ngược để kiểm tra biến động Sickle bất thường.")}</div>`:l<b?`<div class="hs-gringotts-note">Cần Điền Trang đạt Cấp ${b} trở lên mới mở đổi ngược (hiện Cấp ${l}).</div>`:!T.ok&&T.reason?`<div class="hs-gringotts-note">${Qs(T.reason)}</div>`:"",A=I.map(H=>{const K=fn(s,o,l,H);return`<button type="button" class="brass-btn" data-reverse-pack="${H}" ${K.ok?"":"disabled"}>${Pe(H)} Sickle → ${Pe(K.galleonsOut)} Galleons</button>`}).join("");n=`
        <div class="hs-gringotts-reverse">
          <div class="hs-gringotts-head">
            <span>Đổi Sickle → Galleons</span><span>Trang trại: ${Pe(o)} Sickle</span>
          </div>
          <div class="hs-gringotts-packs">${A}</div>
          <div class="hs-gringotts-note">${v.join(" · ")}</div>
          ${F}
        </div>`}const c=Mn(),i=Math.max(0,Math.floor(c.poolAmount||Fa)),d=Date.now(),a=Jn(d,{startWeekdayVn:c.startWeekdayVn,startHourVn:c.startHourVn,payoutWeekdayVn:c.payoutWeekdayVn,payoutHourVn:c.payoutHourVn}),$=typeof c.seasonStartsAt=="number"&&c.seasonStartsAt>d?c.seasonStartsAt:typeof c.nextPayoutAt=="number"&&c.nextPayoutAt>d?c.nextPayoutAt:a.targetAt,f=typeof c.seasonStartsAt=="number"&&c.seasonStartsAt>d?`Bắt đầu ${String(c.startHourVn??_a).padStart(2,"0")}:00 ${ns[c.startWeekdayVn??Oa]??"Thứ Sáu"}`:typeof c.nextPayoutAt=="number"&&c.nextPayoutAt>d?`Kết thúc ${String(c.payoutHourVn??za).padStart(2,"0")}:00 ${ns[c.payoutWeekdayVn??Va]??"Thứ Sáu"}`:a.labelVi,u=c.enabled?`<div class="hs-gringotts-prize"><strong>Thưởng Liên Minh #1:</strong> ${Pe(i)} Galleons · ${f} (${ei($,d,a.phase==="active"?"Sắp chốt thưởng":"Sắp bắt đầu")})</div>`:"";e.innerHTML=`${r}${n}${u}`;const S=()=>{e.querySelectorAll('[data-armed="1"]').forEach(w=>{w.dataset.armed="",w.textContent=w.dataset.label??""})};e.querySelectorAll("[data-pack]").forEach(w=>{const I=w.textContent??"";w.addEventListener("click",()=>{if(w.dataset.armed!=="1"){S(),w.dataset.armed="1",w.dataset.label=I,w.textContent=`Chạm lần nữa: trừ ${Pe(Number(w.dataset.pack))} Galleons`;return}e.querySelectorAll("[data-pack], [data-reverse-pack]").forEach(q=>{q.disabled=!0}),Rr(Number(w.dataset.pack)).then(()=>gs(e,t),q=>{t.showToast(q.message||"Chưa đổi được, thử lại nhé.","🦉"),gs(e,t)})})}),e.querySelectorAll("[data-reverse-pack]").forEach(w=>{const I=w.textContent??"",q=Number(w.dataset.reversePack);w.addEventListener("click",()=>{if(w.dataset.armed!=="1"){S(),w.dataset.armed="1",w.dataset.label=I,w.textContent=`Chạm lần nữa: trừ ${Pe(q)} Sickle`;return}e.querySelectorAll("[data-pack], [data-reverse-pack]").forEach(P=>{P.disabled=!0}),Nr(q).then(P=>{const h=Math.max(0,Math.floor(Number(P?.sicklesDeducted)||q)),k=Math.max(0,Math.floor(t.sim.state.galleons??0)),p=typeof P?.remainingSickles=="number"&&Number.isFinite(P.remainingSickles)?Math.max(0,Math.min(k,Math.floor(P.remainingSickles))):Math.max(0,k-h);t.sim.state.galleons=p,t.sim.saveToStorage(),t.refreshAll();const g=Math.max(0,Math.floor(Number(P?.galleons)||Ta(q,s.reverseSicklePerGalleon)));t.showToast(`Đã đổi ${Pe(h)} Sickle → +${Pe(g)} Galleons vào ví HPVN!`,"🦉"),gs(e,t)},P=>{t.showToast(P.message||"Chưa đổi ngược được, thử lại nhé.","🦉"),gs(e,t)})})})},s=>{e.isConnected&&(e.textContent=`🏦 ${s.message||"Chưa mở được quầy Gringotts."}`)})}function Vr(e){e.closeHudPopovers(),ti(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function zr(e){const t=e.sim.getClaimableHarvestFeastCount(),s=e.root.querySelector("#badgeFeastCount");s&&(t>0?(s.textContent=String(t),s.classList.remove("hidden")):s.classList.add("hidden"));const o=e.root.querySelector("#badgeManageFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"))}function Ur(e,t){const s=e.root.querySelector("#ribbonUnveilToastCard");s&&(s.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${x(t.speakerEmoji)} ${x(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${x(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">${t.bonusSickle>0?`+${t.bonusSickle.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁`:"Thưởng khánh thành chỉ nhận một lần cho mỗi loại công trình"}</div>
        </div>
      </div>
    `,s.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{s.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function ti(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const s=e.sim.ensureHarvestFeast(),o=new Set(s.claimedTiers),l=jt[jt.length-1]?.pointsRequired??3e3,r=Math.min(100,Math.round(s.points/Math.max(1,l)*100)),n=e.sim.getClaimableHarvestFeastCount(),c=jt.every($=>o.has($.tier)),i=jt.find($=>s.points<$.pointsRequired),d=i??jt.find($=>!o.has($.tier)),a=jt.map($=>{const f=o.has($.tier),S=s.points>=$.pointsRequired&&!f,w=io($),I=$.tier%5===0;return`
        <article class="feast-tier-card ${f?"is-claimed":S?"is-claimable":"is-locked"} ${I?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${$.tier}</span>
            <span class="feast-tier-pts">🍁 ${$.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${x($.icon)} ${x($.titleVi)}</span>
              ${I?'<span class="feast-grand-pill">Mốc lớn</span>':""}
            </div>
            <div class="feast-tier-reward">${x(w)}</div>
          </div>
          <div class="feast-tier-cta">
            ${f?'<span class="feast-claimed-pill">✓</span>':S?`<button type="button" data-claim-feast-tier="${$.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">Còn ${($.pointsRequired-s.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${s.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${s.points.toLocaleString("vi-VN")} / ${l.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${c?"🎉 30/30!":i?`Kế tiếp: #${i.tier} (🍁 ${i.pointsRequired.toLocaleString("vi-VN")})`:d?`Sẵn sàng nhận thưởng #${d.tier}!`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${n>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${n})</button>`:""}
            ${c?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${s.seasonCycle+1}</button>`:""}
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${r}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      ${(()=>{const $=e.sim.getActiveSeasonalFestivalDef()??oo.lunar_tet,f=ro(e.sim.state),u=Ln(),S=f.lastLiXiClaimDayKey===u,w=e.sim.getActiveFestival()===$.festival,I=[["lunar_tet","🏮 Tết Việt"],["mid_autumn","🥮 Trung Thu"],["halloween","🎃 Halloween"],["christmas","🎄 Giáng Sinh"]].map(([P,h])=>{const k=$.festival===P;return`<button type="button" data-feast-switch-fest="${P}" class="brass-btn ${k?"gold-cta":""}" style="font-size:12px;padding:3px 8px;">${h}</button>`}).join(""),q=$.tasks.map(P=>{const h=f.claimedTaskIds.includes(P.id),k=e.sim.getSeasonalFestivalTaskProgress(P.id),p=!h&&(e.sim.state.sandboxMode||k>=P.target);return`
              <div class="quest-card-mini" style="margin-top:6px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${$.icon} ${x(P.titleVi)} (${Math.min(k,P.target)}/${P.target})</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${x(P.descVi)} · +${P.rewardSickle} Sickle${P.rewardStars?` · +${P.rewardStars} 🌟`:""}</div>
                  </div>
                  ${h?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-seasonal-task="${P.id}" ${p?"":"disabled"} class="brass-btn ${p?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận</button>`}
                </div>
              </div>
            `}).join("");return`
          <section class="quest-card-mini" style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div>
                <div style="font-size:13px;font-weight:700;">${x($.kickerVi)}</div>
                <div style="font-size:12px;color:var(--ink-soft);">${x($.buffSummaryVi)}</div>
              </div>
              ${$.hasDailyLiXi&&w?`<button id="btnClaimTetLiXi" type="button" ${S?"disabled":""} class="brass-btn ${S?"":"gold-cta"}" style="font-size:12px;padding:4px 10px;">${S?"✓ Đã nhận Lộc Xuân":"🏮 Nhận Lộc Xuân (+68 Sickle)"}</button>`:""}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px;">${I}</div>
            ${q}
          </section>
        `})()}

      <div class="feast-tier-list" role="list">
        ${a}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const $=e.sim.claimAllHarvestFeastTiers();e.showToast($.msg,$.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const $=e.sim.startNextHarvestFeastCycle();e.showToast($.msg,$.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach($=>{$.addEventListener("click",()=>{const f=Number($.dataset.claimFeastTier);if(!Number.isFinite(f))return;const u=e.sim.claimHarvestFeastTier(f);e.showToast(u.msg,u.ok?"🎁":"🍁"),e.refreshAll()})}),t.querySelectorAll("[data-feast-switch-fest]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.feastSwitchFest;e.sim.state.settings.activeFestival=f,e.sim.saveToStorage(),e.refreshAll()})}),t.querySelectorAll("[data-claim-seasonal-task]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.claimSeasonalTask??"";if(!f)return;const u=e.sim.claimSeasonalFestivalTask(f);e.showToast(u.msg,u.ok?"🏮":"⏳"),e.refreshAll()})}),t.querySelector("#btnClaimTetLiXi")?.addEventListener("click",()=>{const $=e.sim.claimDailyTetLiXi();e.showToast($.msg,$.ok?"🏮":"⏳"),e.refreshAll()})}function Gr(e){const t=e.root.querySelector("#financeDialogContent"),s=e.sim.state.finance,o=s.gateRevenue+s.ticketRevenue+s.shopRevenue+s.harvestRevenue,l=s.staffWagesPaid+s.constructionSpent,r=o-l,n=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:16px;">
        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#15803d;">📈 Thu</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú</span><strong>+${s.harvestRevenue.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm</span><strong>+${(s.shopRevenue+s.ticketRevenue+s.gateRevenue).toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#15803d;"><span>Tổng thu</span><strong>+${o.toLocaleString("vi-VN")} Sickle</strong></div>
          </div>
        </div>

        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#9a3412;">📉 Chi</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây &amp; Nâng sao</span><strong>-${s.constructionSpent.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${n}/ca)</span><strong>-${s.staffWagesPaid.toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${r>=0?"#15803d":"#b45309"};">
              <span>Ròng</span><strong>${r>=0?"+":""}${r.toLocaleString("vi-VN")} Sickle</strong>
            </div>
          </div>
        </div>
      </div>
      <div id="hpvnExchange"></div>
    `,gs(t.querySelector("#hpvnExchange"),e)}function si(e){const t=Ws();return mo().then(s=>{const o=e.root.querySelector("#albumDialog");s!==t&&o?.open&&e.activeAlbumTab==="cup"&&dt(e);const l=e.root.querySelector("#houseCupIntroDialog");return s!==t&&l?.open&&Ga(e),s})}const ai={match3:{nameVi:"Bùa Gặt",spriteIcon:"/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp"},caro:{nameVi:"Dò Mìn",spriteIcon:"/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1"},sudoku:{nameVi:"Số Học",spriteIcon:"/trang-trai-hang-soc/sprites/m3_piece_scroll.webp"},chess:{nameVi:"Bắn Cá",spriteIcon:"/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2"},blocks:{nameVi:"Sinh Vật",spriteIcon:"/trang-trai-hang-soc/sprites/beast_niffler.webp"},jigsaw:{nameVi:"Tranh Ghép",spriteIcon:"/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp"}};function $a(e,t){t==="match3"?e.openMatch3Dialog():e.openPuzzleArcadeDialog(t)}function Wr(e,t){const s=Ba();return s.length===0?"":`
    <div class="hs-cup-disciplines">
      <div class="hs-cup-disc-title-row">
        <span class="hs-cup-kicker">Đấu trường từng môn (chạm để đua ngay)</span>
      </div>
      <div class="hs-cup-disc-grid">${s.map(l=>{const r=ai[l.id],n=l.byHouse[e],c=!t&&l.leaderHouse!==null&&n?.rank===1&&n.rawPoints>0,i=l.leaderHouse?`<span class="hs-cup-disc-lead" data-house="${l.leaderHouse}">
            <img class="hs-cup-disc-crest" src="/trang-trai-hang-soc/sprites/crest-${l.leaderHouse.toLowerCase()}.webp" alt="" width="16" height="16">
            <span>${l.leaderHouse}</span>
            <strong>${l.leaderRawPoints.toLocaleString("vi-VN")}</strong>
          </span>`:'<span class="hs-cup-disc-lead is-empty">Chưa có đội dẫn đầu</span>';let d="Chưa phân Nhà";return!t&&n&&(n.rawPoints<=0?d="Nhà bạn: 0 đ (+0 Cúp)":n.rank===1?d=`Hạng 1 · +${n.cupPoints} đ Cúp`:d=`Hạng ${n.rank} (+${n.cupPoints} đ) · Kém ${n.gapToFirst.toLocaleString("vi-VN")}`),`
        <button type="button" class="hs-cup-disc-card${c?" is-leading":""}" data-cup-play="${l.id}">
          <span class="hs-cup-disc-head">
            <img class="hs-cup-disc-ico" src="${r.spriteIcon}" alt="" width="22" height="22">
            <strong class="hs-cup-disc-name">${r.nameVi}</strong>
            <span class="hs-cup-disc-cta">Đua</span>
          </span>
          ${i}
          <span class="hs-cup-disc-me">${d}</span>
        </button>`}).join("")}</div>
    </div>`}function ni(e,t,s){typeof e.querySelectorAll=="function"&&e.querySelectorAll("[data-cup-play]").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.cupPlay;!l||!(l in ai)||(s.root.querySelector(t)?.close(),$a(s,l))})})}function jr(e,t,s){const[o,l]=En(t?null:e),r=o.isPlayerAlliance?o:l.isPlayerAlliance?l:null,n=(d,a)=>{const[$,f]=d.houses;return`
      <div class="hs-cup-ally-side${d.isPlayerAlliance?" is-mine":""}" data-slot="${a}">
        <div class="hs-cup-ally-head">
          <span class="hs-cup-ally-crests">
            <img src="/trang-trai-hang-soc/sprites/crest-${$.toLowerCase()}.webp" alt="${$}" width="22" height="22">
            <img src="/trang-trai-hang-soc/sprites/crest-${f.toLowerCase()}.webp" alt="${f}" width="22" height="22">
          </span>
          <strong class="hs-cup-ally-pts">${s?`${d.points.toLocaleString("vi-VN")} đ`:"…"}</strong>
        </div>
        <div class="hs-cup-ally-name">${x(d.nameVi)}${d.isPlayerAlliance?'<span class="hs-cup-ally-badge">Liên minh bạn</span>':""}</div>
        <div class="hs-cup-ally-houses">${$} + ${f}</div>
      </div>`},c=Math.max(12,Math.min(88,o.sharePercent)),i=r?.allyHouse?`<div class="hs-cup-ally-foot">Đồng minh tuần này: Nhà ${r.allyHouse}</div>`:"";return`
    <div class="hs-cup-alliances">
      <div class="hs-cup-ally-title-row">
        <span class="hs-cup-kicker">Liên Minh Tuần Này (2 vs 2)</span>
      </div>
      <div class="hs-cup-ally-vs">
        ${n(o,"a")}
        <span class="hs-cup-ally-divider" aria-hidden="true">VS</span>
        ${n(l,"b")}
      </div>
      <div class="hs-cup-tugbar" aria-hidden="true">
        <i class="is-a" style="width:${c}%"></i>
        <i class="is-b" style="width:${100-c}%"></i>
      </div>
      ${i}
    </div>`}function ii(e,t,s){const o=Ba(),l=t?.mode==="medals"||o.length>0,r=l?bo():null,n=["Gryffindor","Slytherin","Ravenclaw","Hufflepuff"].map(h=>({house:h,pts:fo(h),firsts:r?.[h]??0})).sort((h,k)=>k.pts-h.pts||k.firsts-h.firsts),c=Math.max(1,n[0].pts),i=t?.house===null,d=h=>`${h.toLocaleString("vi-VN")} đ`,a=n.map(h=>{const k=!i&&h.house===e,p=l&&h.firsts>0?`<span class="hs-cup-medals">${h.firsts} nhất môn</span>`:"",g=`${h.house}${k?'<span class="hs-cup-you">Nhà bạn</span>':""}${p}`,b=`<img class="hs-cup-crest" src="/trang-trai-hang-soc/sprites/crest-${h.house.toLowerCase()}.webp" alt="" width="32" height="32">`,v=Math.round(h.pts/c*100);return`
        <li class="hs-cup-row" data-house="${h.house}" data-mine="${k}">
          ${b}
          <span class="hs-cup-name">${g}</span>
          <span class="hs-cup-pts">${t?d(h.pts):"…"}</span>
          <span class="hs-cup-bar"><i style="width:${v}%"></i></span>
        </li>`}).join(""),$=t?.perTier??300,f=Math.min($,t?.memberBank??0),u=jr(e,i,t),[S,w]=En(i?null:e),I=S.isPlayerAlliance?S:w.isPlayerAlliance?w:null,q=_r({cup:t,leadingAlliance:S,playerAlliance:I,noHouse:i,localPlays:s}),P=l?Wr(e,i):"";return{alliancesHtml:u,prizeBannerHtml:q,listHtml:a,disciplinesHtml:P,isMedalMode:l,noHouse:i,perTier:$,bank:f}}function oi(e){e.hasShownHouseCupIntro=!0,e.closeHudPopovers(),Ga(e);const t=e.root.querySelector("#houseCupIntroDialog");t&&!t.open&&t.showModal()}function Ga(e){const t=e.root.querySelector("#houseCupIntroDialogContent");if(!t)return;const s=e.sim.getPlayerHouse(),o=Ws();si(e).catch(()=>{});const{alliancesHtml:l,prizeBannerHtml:r,listHtml:n,disciplinesHtml:c,isMedalMode:i,noHouse:d,perTier:a,bank:$}=ii(s,o,e.sim.state.minigamePlays),f=o?.memberTier??1,u=o?.memberDailyCap??0,S=o?.memberTodayPoints??0,w=Ba(),I=d?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${s.toLowerCase()}.webp`,q=i&&(o?.unlimited||u===0)?`Hôm nay: ${S.toLocaleString("vi-VN")} đ`:`Hôm nay: ${S.toLocaleString("vi-VN")}${u>0?`/${u.toLocaleString("vi-VN")}`:""} đ`,P=d?"Chưa phân Nhà":o?`${q} · Cúp Đợt ${f}: ${$.toLocaleString("vi-VN")}/${a.toLocaleString("vi-VN")} đ`:"Đang tải…";t.innerHTML=`
    <div class="hs-cup hs-cup-intro">
      <div class="hs-cup-intro-hero" data-house="${d?"":x(s)}">
        <img class="hs-cup-intro-crest" src="${I}" alt="" width="40" height="40" />
        <div class="hs-cup-intro-copy">
          <span class="hs-cup-kicker">${o?.weekKey?`Mùa giải Tuần ${x(o.weekKey)}`:"Cúp 4 Nhà"}</span>
          <strong class="hs-cup-intro-title">${d?"Chưa phân Nhà trên HPVN":`Nhà ${x(s)}`}</strong>
          <span class="hs-cup-intro-sub">${P}</span>
        </div>
      </div>

      ${l}
      ${r}
      <ol class="hs-cup-list hs-cup-intro-standings">${n}</ol>
      ${c}

      <div class="hs-dlg-actions">
        <button id="btnCupIntroPlay" type="button" class="brass-btn">Thi đấu ngay</button>
        <button id="btnCupIntroClose" type="button" class="brass-btn gold-cta">Vào trang trại</button>
      </div>
    </div>
  `,t.querySelector("#btnCupIntroClose")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close()}),t.querySelector("#btnCupIntroPlay")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close();const h=e.sim.getLastPlayedMinigame();if(i){const k=new Set(w.map(p=>p.id));if(h!=="seedquiz"&&k.has(h)){$a(e,h);return}if(!d&&w.length>0){const p=w.filter(g=>(g.byHouse[s]?.rank??4)>1).sort((g,b)=>(g.byHouse[s]?.gapToFirst??0)-(b.byHouse[s]?.gapToFirst??0));if(p.length>0){$a(e,p[0].id);return}}}h==="caro"||h==="sudoku"||h==="chess"||h==="blocks"||h==="jigsaw"?e.openPuzzleArcadeDialog(h):e.openMatch3Dialog()}),ni(t,"#houseCupIntroDialog",e)}function dt(e){const t=e.root.querySelector("#albumDialogContent"),s=e.sim.homeStateWhileVisiting??e.sim.state;e.sim.checkAndToastAchievements();const o=lo(s),l=co(s),r=sn.filter(f=>{const u=o.achievements[f.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,n=e.sim.getUnlockedLoginDayMax(s),c=an.filter(f=>f.day<=n&&!o.claimedLoginDays.includes(f.day)).length,i=r+c,d=(f,u,S=0)=>`<button type="button" role="tab" data-atab="${f}" aria-selected="${e.activeAlbumTab===f}" class="hs-tab">${u}${S>0?`<span class="hs-tab-badge">${S}</span>`:""}</button>`,a=`
      <div class="hs-tabs" role="tablist" aria-label="Hồ Sơ, Cúp &amp; Xếp Hạng">
        ${d("profile","Hồ sơ",i)}${d("cup","Cúp Nhà")}${d("leaderboard","Xếp hạng")}
      </div>
    `;let $="";if(e.activeAlbumTab==="cup"){const f=e.sim.getPlayerHouse(),u=Ws();si(e).catch(()=>{});const{alliancesHtml:S,prizeBannerHtml:w,listHtml:I,disciplinesHtml:q,noHouse:P,perTier:h,bank:k}=ii(f,u,s.minigamePlays),p=v=>`${v.toLocaleString("vi-VN")} đ`,g=(v,T,F,A,H="",K=!1)=>`
        <li class="hs-cup-row"${H?` data-house="${H}" data-mine="${K}"`:""}>
          <span></span>
          <span class="hs-cup-name">${T}</span>
          <span class="hs-cup-pts">${F}</span>
          ${A===null?"":`<span class="hs-cup-bar"><i style="width:${A}%"></i></span>`}
        </li>`,b=u?P?g("","Chưa phân Nhà trên HPVN","0 đ",null):g("","Hôm nay",p(u.memberTodayPoints),null)+g("",`Đợt ${u.memberTier}`,`${k} / ${p(h)}`,Math.round(k/h*100)):"";$=`
        <div class="hs-cup">
          <div class="hs-cup-kicker hs-cup-kicker-row">
            <span>${u?.weekKey?`Tuần ${u.weekKey}`:"Đang tải…"}</span>
          </div>
          ${S}
          ${w}
          <ol class="hs-cup-list">${I}</ol>
          ${q}
          ${b?`<ul class="hs-cup-me">${b}</ul>`:""}
        </div>
      `}else if(e.activeAlbumTab==="leaderboard")$='<div id="leaderboardTabMount"></div>';else{const f=e.sim.getPlayerHouse(),S=Ws()?.house===null,w=S?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${f.toLowerCase()}.webp`,I=S?"Chưa phân Nhà":f,q=(h,k,p=0)=>`<button type="button" role="tab" data-psub="${h}" aria-selected="${e.activeProfileSubTab===h}" class="lb-scope-pill ${e.activeProfileSubTab===h?"active":""}">${k}${p>0?`<span class="hs-tab-badge">${p}</span>`:""}</button>`;let P="";if(e.activeProfileSubTab==="achievements"){const h=Date.now(),k={farm:Kt(s,"farm",h),building:Kt(s,"building",h),puzzle:Kt(s,"puzzle",h),language:Kt(s,"language",h),social:Kt(s,"social",h),collection:Kt(s,"collection",h)},p=[["all","Tất cả"],["farm","Mùa vụ"],["building","Kiến trúc"],["puzzle","Khảo thí"],["language","Đa ngữ"],["social","Xã hội"],["collection","Sưu tầm"]],g=e.activeAchievementFilterCat??"all",b=sn.filter(v=>g==="all"||v.category===g).slice().sort((v,T)=>{const F=A=>o.achievements[A]?.unlockedAt&&!o.achievements[A]?.claimedAt?1:0;return F(T.id)-F(v.id)});P=`
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
              <h3 class="hs-section-title" style="margin:0;">52 Thành tựu</h3>
              <span style="font-size:12px;font-weight:700;color:var(--ink-gold);">${l.unlocked}/${l.total} (${l.completionPct}%)</span>
              ${r>0?`<button id="btnClaimAllAchievements" type="button" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận tất cả (${r})</button>`:""}
            </div>
            <progress max="${l.total}" value="${l.unlocked}" style="width:100%;margin-bottom:8px;"></progress>
            <div class="lb-scope-pills" role="group" aria-label="Lọc thành tựu theo nhóm">
              ${p.map(([v,T])=>`<button type="button" data-ach-cat="${v}" aria-pressed="${g===v}" class="lb-scope-pill ${g===v?"active":""}">${T}</button>`).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${b.map(v=>{const T=o.achievements[v.id],F=!!T?.unlockedAt,A=!!T?.claimedAt,H=Math.min(v.target,Math.max(0,k[v.category]??0)),K=H.toLocaleString("vi-VN"),V=v.target.toLocaleString("vi-VN");return`
                <div class="aaa-ach-card" data-unlocked="${F}">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                    <div style="min-width:0;flex:1;">
                      <div class="hs-card-title">${v.titleVi}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">${v.descVi} · <strong>+${v.rewardSickle} Sickle, +${v.rewardStars} 🌟</strong></div>
                      ${F?"":`<progress max="${v.target}" value="${H}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                    </div>
                  </div>
                  <div style="flex-shrink:0;text-align:right;">
                    ${A?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':F?`<button type="button" data-claim-ach="${v.id}" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">${K}/${V}</span>`}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="friendship"){const h=e.sim.getRealTimePeriod(),k=Ln();P=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Phim cốt truyện</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">
              ${Pn.map(p=>{const g=s.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${p.titleVi}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">Cấp ${p.unlockLevel}</div>
                    <button type="button" data-play-cutscene="${p.id}" ${g?"":"disabled"} class="brass-btn ${g?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${g?"Xem":`Cấp ${p.unlockLevel}`}
                    </button>
                  </div>
                `}).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${po.map(p=>{const g=go(p.id,h),b=o.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},v=b.level*60,T=b.lastTalkedDayKey===k,F=b.lastGiftedDayKey===k,A=uo[p.id],H=!!b.claimedMilestones?.includes(5),K=!H&&(b.level>=5||s.sandboxMode);return`
                <div class="aaa-slot-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong class="hs-card-title">${p.nameVi}</strong>
                      <span style="font-size:12px;color:var(--ink-soft);"> · ${p.titleVi}</span>
                    </div>
                    <span style="font-size:12px;font-weight:700;color:var(--berry);">Cấp ${b.level}/10 (${b.xp}/${v})</span>
                  </div>
                  <div style="font-size:12px;color:var(--ink-soft);">${g.activityVi}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    <button type="button" data-npc-talk="${p.id}" data-choice="0" ${T?"disabled":""} class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${T?"✓ Đã trò chuyện":"Trò chuyện (+35 XP)"}
                    </button>
                    ${T?"":`<button type="button" data-npc-talk="${p.id}" data-choice="1" class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">Gợi chuyện (+25 XP)</button>`}
                    ${H?`<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);align-self:center;">✓ ${x(A.keepsakeNameVi)}</span>`:`<button type="button" data-npc-keepsake="${p.id}" ${K?"":"disabled"} class="brass-btn ${K?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;" title="${x(A.keepsakeBonusVi)}">🎁 Kỷ vật Lv.5</button>`}
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;">
                    ${F&&!s.sandboxMode?'<span style="font-size:11px;font-weight:700;color:var(--farm-green-text);">✓ Hôm nay đã tặng quà thân thiết</span>':A.favoriteGifts.map(V=>{const Z=Ve(V),re=e.sim.getFarmItemCount(V),B=s.sandboxMode||re>=1;return`<button type="button" data-npc-gift="${p.id}" data-gift-item="${V}" ${B?"":"disabled"} class="brass-btn ${B?"gold-cta":""}" style="min-height:34px;font-size:11px;padding:2px 8px;">💝 Tặng ${x(Z.name)} (${s.sandboxMode?"∞":re})</button>`}).join("")}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="almanac"){const h=e.sim.evaluateCollectionAlmanac(),k=h.chapters.map(g=>{const b=Math.min(100,Math.round(g.discoveredCount/Math.max(1,g.totalCount)*100)),v=g.sampleEntries.map(T=>`<span class="owl-rew-pill ${T.unlocked?"xp":""}" style="opacity:${T.unlocked?"1":"0.45"};font-size:11px;">${T.icon} ${x(T.nameVi)}</span>`).join("");return`
              <div class="quest-card-mini" style="margin-bottom:8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${g.icon} ${x(g.titleVi)}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${x(g.subtitleVi)} · ${x(g.rewardLabelVi)}</div>
                  </div>
                  ${g.claimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-almanac="${g.id}" ${g.canClaim?"":"disabled"} class="brass-btn ${g.canClaim?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận chương</button>`}
                </div>
                <div class="quest-bar" style="margin:6px 0;"><div class="quest-bar-fill" style="width:${b}%"></div></div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">${v}</div>
              </div>
            `}).join("");P=`
          <div class="quest-card-mini" style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div>
                <div style="font-size:13px;font-weight:700;">🏆 Đại Học Giả Bách Khoa Hang Sóc</div>
                <div style="font-size:12px;color:var(--ink-soft);">Hoàn thành cả 4 Chương Bách Khoa · Thưởng +190 Sickle &amp; +2 🌟</div>
              </div>
              ${h.grandTrophyClaimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Danh hiệu vĩnh viễn</span>':`<button type="button" data-claim-almanac="grand_trophy" ${h.allChaptersClaimed||s.sandboxMode?"":"disabled"} class="brass-btn ${h.allChaptersClaimed||s.sandboxMode?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🏆 Nhận Đại Cúp</button>`}
            </div>
          </div>
        `+k}else P=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Điểm danh 7 ngày</h3>
            <div class="aaa-slot-grid">
              ${an.map(h=>{const k=o.claimedLoginDays.includes(h.day),p=!k&&h.day<=n;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${h.titleVi}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">
                      +${h.galleons} Sickle · +${h.magicStars} 🌟${h.phoenixTalismans>0?` · +${h.phoenixTalismans} Bùa`:""}
                    </div>
                    ${k?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-login="${h.day}" ${p?"":"disabled"} class="brass-btn ${p?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                            ${p?"Nhận":"Chờ mở"}
                          </button>`}
                  </div>
                `}).join("")}
            </div>
          </div>
        `;$=`
        <div class="hs-profile-card" data-house="${x(f)}">
          <img class="hs-profile-crest" src="${w}" alt="" width="36" height="36" />
          <div class="hs-profile-info">
            <div class="hs-profile-head">
              <strong class="hs-profile-name">${x(s.parkName)}</strong>
              <span class="hs-profile-house">${x(I)}</span>
            </div>
            <div class="hs-profile-meta">Cấp ${s.level} · ${x(Ea(s.level))} · 🌟 ${(s.match3?.stars??0).toLocaleString("vi-VN")} · Thành tựu ${l.unlocked}/${l.total}</div>
          </div>
        </div>
        <div class="lb-scope-pills hs-profile-subtabs" role="tablist" aria-label="Chi tiết hồ sơ">
          ${q("login7","Điểm danh",c)}${q("achievements","Thành tựu",r)}${q("friendship","Dân làng")}${q("almanac","Bách khoa",e.sim.evaluateCollectionAlmanac().claimableCount)}
        </div>
        ${P}
      `}if(t.innerHTML=a+$,e.activeAlbumTab==="leaderboard"){const f=t.querySelector("#leaderboardTabMount");e.leaderboardModal?e.leaderboardModal.render(f):(f&&(f.innerHTML='<p class="hs-lb-note">Đang tải…</p>'),e.getLeaderboardModal().then(u=>{u.configure(e.sim.getLastPlayedMinigame()),e.activeAlbumTab==="leaderboard"&&(u.render(),u.syncCloud())},()=>{}))}t.querySelector("#btnOpenCupIntroFromTab")?.addEventListener("click",()=>{e.root.querySelector("#albumDialog")?.close(),oi(e)}),ni(t,"#albumDialog",e),t.querySelectorAll("[data-atab]").forEach(f=>{f.addEventListener("click",()=>{const u=f.dataset.atab;e.activeAlbumTab=u,dt(e),u==="leaderboard"&&e.leaderboardModal&&e.leaderboardModal.syncCloud()})}),t.querySelectorAll("[data-psub]").forEach(f=>{f.addEventListener("click",()=>{e.activeProfileSubTab=f.dataset.psub,dt(e)})}),t.querySelector("#btnClaimAllAchievements")?.addEventListener("click",()=>{const f=e.sim.claimAllAchievements();e.showToast(f.msg,f.ok?"🎖️":"⚠️"),dt(e)}),t.querySelectorAll("[data-ach-cat]").forEach(f=>{f.addEventListener("click",()=>{e.activeAchievementFilterCat=f.dataset.achCat||"all",dt(e)})}),t.querySelectorAll("[data-claim-ach]").forEach(f=>{f.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(f.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),dt(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(f=>{f.addEventListener("click",()=>{e.playStoryCutscene(String(f.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(f=>{f.addEventListener("click",()=>{const u=f.dataset.npcTalk,S=Number(f.dataset.choice)===1?1:0,w=e.sim.talkWithVillagerChoice(u,S);e.showToast(w.msg,w.ok?"💝":"☕"),dt(e)})}),t.querySelectorAll("[data-npc-gift]").forEach(f=>{f.addEventListener("click",()=>{const u=f.dataset.npcGift,S=f.dataset.giftItem,w=e.sim.giftItemToVillager(u,S);e.showToast(w.msg,w.ok?"💝":"🧺"),dt(e),e.refreshHeader()})}),t.querySelectorAll("[data-npc-keepsake]").forEach(f=>{f.addEventListener("click",()=>{const u=f.dataset.npcKeepsake,S=e.sim.claimVillagerKeepsake(u);e.showToast(S.msg,S.ok?"🎁":"🔒"),dt(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-almanac]").forEach(f=>{f.addEventListener("click",()=>{const u=f.dataset.claimAlmanac,S=e.sim.claimAlmanacChapterReward(u);e.showToast(S.msg,S.ok?"📚":"🔒"),dt(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-login]").forEach(f=>{f.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(f.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),dt(e)})})}function vt(e){const t=e.root.querySelector("#questDialogContent"),s=e.sim.ensureFarmBarn(),o=e.sim.getActiveStoryQuest(),l=e.sim.getStoryAutoActionPreview(),r=e.sim.getReadyOwlOrdersCount(),n=(o?.completed?1:0)+e.sim.state.owlQuests.filter(g=>g.completed&&!g.claimed).length+e.sim.state.dailyQuests.filter(g=>g.completed&&!g.claimed).length;if(!e.selectedOwlOrderId||!s.owlOrders.some(g=>g.id===e.selectedOwlOrderId)){const g=s.owlOrders.find(b=>e.sim.canFulfillFarmOwlOrder(b));e.selectedOwlOrderId=(g??s.owlOrders[0])?.id??null}const c=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          Đơn Cú <span class="nb-tab-badge">${r}/${s.owlOrders.length}</span>
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          Nhiệm Vụ ${n>0?`<span class="nb-tab-badge">${n}</span>`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const g=s.owlOrders.find(A=>A.id===e.selectedOwlOrderId)??s.owlOrders[0],b=g?e.sim.canFulfillFarmOwlOrder(g):!1,v=s.owlOrders.map(A=>{const H=g?.id===A.id,K=e.sim.canFulfillFarmOwlOrder(A),V=A.portraitSprite&&/^[a-z0-9_]+$/i.test(A.portraitSprite)?A.portraitSprite:null,Z=V?`<img src="/trang-trai-hang-soc/sprites/${V}.webp" alt="${x(A.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${x(Bt(A.portraitEmoji,A.senderName))}</span>`,re=A.requirements.slice(0,3).map(U=>{const E=Ve(U.itemId);return`<img src="${E.iconSrc}" alt="${x(E.name)}" title="${U.qty} ${x(E.name)}" class="owl-note-mini-item" />`}).join(""),B=e.sim.getOwlOrderSpotlightBonus(A);return`
            <button
              type="button"
              class="owl-pin-note ${H?"selected":""} ${K?"ready":""}"
              data-select-owl="${x(A.id)}"
            >
              <div class="owl-note-avatar-box">${Z}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${x(A.senderName)}</div>
                <div class="owl-note-mini-row">${re}</div>
                ${A.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
                ${B.hasSpotlight?'<span class="owl-spotlight-tag">🎪 +1🌿</span>':""}
              </div>
              ${K?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),T=g?e.sim.getOwlOrderSpotlightBonus(g):null,F=g?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${x(g.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${x(g.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:12px;" ${e.sim.getOwlRerollsLeft()>0?`title="Đổi đơn (còn ${e.sim.getOwlRerollsLeft()} lượt hôm nay)"`:'disabled title="Hết lượt đổi hôm nay"'}>
                ${e.sim.getOwlRerollsLeft()>0?`🔄 Đổi (${e.sim.getOwlRerollsLeft()})`:"Hết lượt đổi"}
              </button>
            </div>

            <div class="owl-req-list">
              ${g.requirements.map((A,H)=>{const K=Ve(A.itemId),V=e.sim.getFarmItemCount(A.itemId),Z=e.sim.ensureNeighborSocial(),re=Math.max(0,ha-Z.dailyOwlHelpRequestedCount),B=e.sim.getOwlRequirementHelpState(g.id,H),U=!!B?.fulfilledAt,E=e.sim.state.sandboxMode||U||V>=A.qty,de=U?`<span class="owl-help-tag done">✓ ${x(B?.helperEmoji??"🦉")}</span>`:B?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':E?'<span class="owl-req-status">✓</span>':`<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                            <button type="button" class="brass-btn owl-ask-help-btn" data-jump-owl-item="${x(A.itemId)}" title="Dẫn tới ruộng hoặc xưởng sản xuất món này">→ Tìm</button>
                            <button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${H}" ${re<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${re})</button>
                          </div>`;return`
                    <div class="owl-req-row ${E?"ok":"lack"}">
                      <img src="${K.iconSrc}" alt="${x(K.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${x(K.name)}</div>
                        <div class="owl-req-count">${U?"✓":`${e.sim.state.sandboxMode?"∞":V}/${A.qty}`}</div>
                      </div>
                      ${de}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${g.rewardSickle}</span>
                <span class="owl-rew-pill xp">⭐ +${g.rewardXp+(T?.bonusXp??0)}</span>
                ${T?.hasSpotlight?`<span class="owl-rew-pill plug">🎪 +${T.bonusCompost}🌿</span>`:""}
                ${g.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${g.rewardMugglePlug}</span>`:""}
                ${(g.isFeastMarquee||(s.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<ba?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${c}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${v}</div>
            ${F}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${b?"ready":"not-ready"}"
            >
              ${b?"Giao hàng":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(A=>{A.addEventListener("click",()=>{e.activeQuestTab=A.dataset.qtab,vt(e)})}),t.querySelectorAll("[data-select-owl]").forEach(A=>{A.addEventListener("click",()=>{e.selectedOwlOrderId=A.dataset.selectOwl??null,vt(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{g&&(e.sim.refreshFarmOwlOrder(g.id),e.selectedOwlOrderId=null,vt(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(A=>{A.addEventListener("click",()=>{if(!g)return;const H=Number(A.dataset.askOwlHelp);if(!Number.isFinite(H))return;const K=e.sim.requestPlayerOwlCrateHelp(g.id,H);K.ok||e.showToast(K.msg,"⚠️"),vt(e)})}),t.querySelectorAll("[data-jump-owl-item]").forEach(A=>{A.addEventListener("click",()=>{const H=A.dataset.jumpOwlItem;e.root.querySelector("#questDialog")?.close(),e.jumpToMissingFarmItem(H)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!g)return;if(!e.sim.canFulfillFarmOwlOrder(g)){const H=e.sim.fulfillFarmOwlOrder(g.id);e.showToast(H.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const A=e.sim.fulfillFarmOwlOrder(g.id);A.ok&&e.showToast(A.msg,"🦉"),e.selectedOwlOrderId=null,vt(e)});return}const i=(g,b,v=!1)=>{const T=Math.min(100,Math.round(g.progress/Math.max(1,g.targetAmount)*100));return`
        <div class="quest-card-mini" style="color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span class="hs-card-title" style="color:var(--ink);">${x(g.giverEmoji)} ${x(g.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${x(b)}</span>
          </div>
          ${v&&g.dialogue?`<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.35;">${x(g.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${T}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:var(--ink);">
            <span>${Math.min(g.progress,g.targetAmount)}/${g.targetAmount}</span>
            <span>🪙${g.rewardSickle} · ⭐${g.rewardXp} ${g.rewardTimeSand>0?`· ⏳${g.rewardTimeSand}`:""}</span>
          </div>
          ${g.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':g.completed?`<button type="button" data-modal-claim="${x(g.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:v?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${x(l.shortLabel)}</button>`:""}
        </div>
      `},d=e.sim.getRequiredLevelTrial(),a=e.sim.getWinsProgressForCurrentLevel(),$=g=>{const b=e.sim.getDisciplineStageInfo(g);return b.isMaxed?`👑${b.maxStage}`:`${b.currentStage}/${b.maxStage}`},f=d&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div class="hs-card-title">
              🔥 Đề Cử (${a.current}/${a.required}): ${d.icon} ${x(d.shortVi)} (${$(d.kind)})
            </div>
            <button type="button" data-modal-open-trial="${d.kind}" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">▶️ Chơi</button>
          </div>
        </div>
      `:"",u=o?`Ch.${o.chapter??1} · ${e.sim.state.storyQuestIndex+1}/${Oi.length}`:"",S=e.sim.getYuleEventStatus(),w=S.dayDef?.main,I=S.day>0&&S.claimedMainDays.includes(S.day),q=w?nn(e.sim.state,w):0,P=!!(w&&q>=w.amount),h=w?Math.min(100,Math.round(q/Math.max(1,w.amount)*100)):0,k=S.dayDef?.side.map(g=>{const b=S.claimedSideTaskIds.includes(g.id),v=nn(e.sim.state,g),T=v>=g.amount;return`<div class="quest-card-mini" style="padding:9px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><span style="font-size:12px;font-weight:700;">${x(g.titleVi)} <span style="color:var(--ink-soft);">(${Math.min(v,g.amount)}/${g.amount} • +${g.rewardSickles.toLocaleString("vi-VN")} 🪙)</span></span>${b?'<span style="color:#15803d;font-weight:800;">✓</span>':`<button type="button" class="brass-btn ${T?"gold-cta":""}" data-yule-side="${x(g.id)}" style="padding:4px 8px;font-size:11px;${T?"":"opacity:0.62;"}">Nhận</button>`}</div>`}).join("")??"",p=S.active&&w?`<div class="quest-card-mini" style="padding:12px;border:1px solid #d97706;background:linear-gradient(135deg,rgba(254,243,199,.9),rgba(219,234,254,.8));"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>🎄 Yule • Ngày ${S.day}/36</strong><span style="font-size:11px;color:var(--ink-soft);">${x(S.dayDef?.titleVi??"")}</span></div><div style="font-size:13px;font-weight:800;margin-top:7px;">${x(w.titleVi)}</div><div class="quest-bar"><div class="quest-bar-fill" style="width:${h}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:3px;">${Math.min(q,w.amount)}/${w.amount}</div>${I?'<div style="margin-top:7px;color:#15803d;font-weight:800;">✓ Đã nhận phần thưởng ngày</div>':`<button type="button" data-yule-main="${S.day}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;${P?"":"opacity:0.65;"}">🎁 Nhận phần thưởng ngày</button>`}<div style="margin-top:9px;font-size:12px;font-weight:800;">Nhiệm vụ phụ (mỗi nhiệm vụ tối đa 5.000 Sickle)</div>${k}</div>`:"";t.innerHTML=`
      ${p}
      ${c}
      ${f}
      <h3 class="hs-section-title">📖 Cốt Truyện</h3>
      ${o?i(o,u,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 class="hs-section-title" style="margin-top:14px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(g=>i(g,"Xoay vòng")).join("")}
      </div>

      <h3 class="hs-section-title" style="margin-top:14px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(g=>i(g,`⏳ ${Ge(ho())}`)).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(g=>{g.addEventListener("click",()=>{e.activeQuestTab=g.dataset.qtab,vt(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(g=>{g.addEventListener("click",()=>{const b=g.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(b)})}),t.querySelector("[data-yule-main]")?.addEventListener("click",()=>{const g=Number(t.querySelector("[data-yule-main]")?.dataset.yuleMain),b=e.sim.claimYuleMainDay(g);e.showToast(b.msg,b.ok?"🎄":"⚠️"),vt(e)}),t.querySelectorAll("[data-yule-side]").forEach(g=>{g.addEventListener("click",()=>{const b=e.sim.claimYuleSideTask(g.dataset.yuleSide);e.showToast(b.msg,b.ok?"🪙":"⚠️"),vt(e)})}),t.querySelectorAll("[data-modal-claim]").forEach(g=>{g.addEventListener("click",()=>{e.sim.claimQuest(g.dataset.modalClaim),vt(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const g=e.sim.completeStoryStepWithStar();g.ok?(typeof g.placedGx=="number"&&typeof g.placedGy=="number"&&Be(e.cam,g.placedGx,g.placedGy),vt(e)):(e.showToast(g.msg,g.reason==="missing_gold"?"🪙":g.reason==="locked_level"?"🔒":"🌟"),g.reason==="open_match3"&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}let Hs="zones";function ka(e){const t=e.root.querySelector("#roadmapDialogContent"),s=new Set(e.sim.state.unlockedZones),o=e.sim.getRequiredLevelTrial(),l=es.filter(i=>s.has(i.id)||e.sim.state.sandboxMode).length,r=`
      <div class="hs-tabs" role="tablist" aria-label="Bản Đồ &amp; Lộ Trình">
        <button type="button" role="tab" data-rmtab="zones" aria-selected="${Hs==="zones"}" class="hs-tab">Vùng đất <span class="hs-tab-badge">${l}/${es.length}</span></button>
        <button type="button" role="tab" data-rmtab="milestones" aria-selected="${Hs==="milestones"}" class="hs-tab">Cột mốc <span class="hs-tab-badge">Lv.${e.sim.state.level}</span></button>
      </div>
    `,n=o&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const i=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div class="hs-card-title">
                🔥 Đề Cử Lv.${e.sim.state.level} (${i.current}/${i.required}): ${o.icon} ${x(o.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">
                ▶️ Chơi
              </button>
            </div>`})():"";let c="";if(Hs==="zones"){const i=es.map(d=>{const a=s.has(d.id)||e.sim.state.sandboxMode,$=!a&&e.sim.state.level>=d.unlockLevel,f=Ia(d);return`
          <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
            <div class="hs-card-title">${a?"✅":"🌫️"} ${d.name}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
              <span>Lv.${d.unlockLevel} · ${f>0?`🌟 ${f}`:"✓"}</span>
              <div style="display:flex;gap:5px;">
                <button type="button" data-cam-zone="${d.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
                ${$?`<button type="button" data-unlock-zone="${d.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
              </div>
            </div>
          </div>
        `}).join("");c=`${n}<div class="grid-2col">${i}</div>`}else c=`
        <div class="hs-card-list">
          ${_i.filter(d=>d.unlockedItemIds.length>0||d.unlockedZoneId||d.milestoneNote||d.level%10===0).map(d=>{const a=e.sim.state.level>=d.level,$=d.unlockedItemIds.map(f=>le(f)?.name).filter(Boolean).join(", ");return`
                <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${a?"1":"0.78"};">
                  <div>
                    <span style="font-weight:700;font-size:13px;">${a?"🌟":"🔒"} Lv.${d.level}</span>
                    ${$?`<span style="font-size:12px;margin-left:6px;">${$}</span>`:""}
                  </div>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${d.rewardSickle}</span>
                </div>
              `}).join("")}
        </div>
      `;t.innerHTML=r+c,t.querySelectorAll("[data-rmtab]").forEach(i=>{i.addEventListener("click",()=>{Hs=i.dataset.rmtab==="milestones"?"milestones":"zones",ka(e)})}),t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(i=>{i.addEventListener("click",()=>{const d=Tn(i.dataset.camZone);Be(e.cam,(d.x1+d.x2)*.5,(d.y1+d.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(i=>{i.addEventListener("click",()=>{const d=e.sim.unlockZone(i.dataset.unlockZone);e.showToast(d.msg,d.ok?"✨":"🔒"),ka(e)})})}function Lt(e,t,s,o,l=s.length,r=s.length){const n=s.map(([c,i])=>`<button type="button" data-${t}="${c}" data-active="${c===o}" aria-pressed="${c===o}">${i}</button>`).join("");return`<div class="hs-set-row"><span class="hs-set-k">${e}</span><div class="hs-seg" role="group" aria-label="${e}" style="--hs-seg-cols:${l};--hs-seg-wide:${r}">${n}</div></div>`}function Je(e){const t=e.root.querySelector("#settingsDialogContent"),s=e.sim.state,o=e.sprites?e.sprites.isToonEnabled():!0,l=e.getEffectiveA11ySettings(),r=typeof window<"u"&&!1,n=[{key:"master",label:"Tổng"},{key:"music",label:"Nhạc nền"},{key:"sfx",label:"Hiệu ứng"},{key:"voice",label:"Giọng đọc"}],c=Object.values(s.stashedDecorInventory??{}).reduce((i,d)=>i+d,0);t.innerHTML=`
      <div class="quest-card-mini">
        <h3 class="hs-section-title">Âm thanh</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label class="switch-row">
            <span>Nhạc nền</span>
            <input id="swBgm" type="checkbox" switch ${s.settings.bgmEnabled?"checked":""} />
          </label>
          <label class="switch-row">
            <span>Hiệu ứng</span>
            <input id="swSfx" type="checkbox" switch ${s.settings.soundEnabled?"checked":""} />
          </label>
          ${n.map(i=>{const d=Math.round((l.volumes[i.key]??.85)*100);return`
                <label class="aaa-slider-row" style="font-size:12px;font-weight:700;">
                  <span>${i.label}</span>
                  <input type="range" min="0" max="100" value="${d}" data-vol-bus="${i.key}" />
                  <span data-vol-val="${i.key}">${d}%</span>
                </label>
              `}).join("")}
        </div>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Hiển thị &amp; Trợ năng</h3>
        ${Lt("Kiểu vẽ","toon",[["on","Viền nâu"],["off","2.5D"]],o?"on":"off")}
        ${Lt("Đồ hoạ","renderer-mode",[["webgl2","WebGL2"],["canvas","Cổ điển"]],s.settings.rendererMode??"webgl2")}
        ${Lt("Giáng Sinh","yule-theme-mode",[["auto","Tự động"],["on","Luôn bật"],["off","Tắt"]],s.settings.yuleThemeMode??"auto")}
        ${Lt("Chế độ màu","cb-mode",[["none","Mặc định"],["protanopia","Đỏ-Lục"],["deuteranopia","Lục-Đỏ"],["tritanopia","Xanh-Vàng"]],l.colorblindMode,2,4)}
        ${Lt("Cỡ chữ","font-scale",[["100","100%"],["125","125%"],["150","150%"]],String(l.fontScale))}
        <label class="switch-row">
          <span>Tương phản cao</span>
          <input id="swHighContrast" type="checkbox" switch ${l.highContrast?"checked":""} />
        </label>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Bầu trời &amp; Nhịp độ</h3>
        ${Lt("Giờ","time",[["realtime","Tự động"],["dawn","Bình minh"],["day","Ngày"],["dusk","Chiều"],["night","Đêm"]],s.settings.timeOverride,3)}
        ${Lt("Lễ hội","fest",[["auto","Tự động"],["lunar_tet","Tết Việt"],["mid_autumn","Trung Thu"],["halloween","Halloween"],["christmas","Giáng Sinh"],["quidditch_cup","Quidditch"]],s.settings.activeFestival,3,6)}
        ${Lt("Thời tiết","weather",[["auto","Tự động"],["clear","Nắng"],["cloudy","Mây"],["rain","Mưa"],["storm","Giông"],["snow","Tuyết"],["fog","Sương"]],s.settings.weatherOverride,4,7)}
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Điền trang &amp; Cẩm nang</h3>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((i,d)=>{const a=s.layoutPresets?.[i];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:700;">${a?x(a.label):`Bản vẽ #${d+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${a?`${a.placements.length} công trình`:"Trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${i}" class="brass-btn" style="flex:1;padding:4px 6px;font-size:12px;">Lưu</button>
                    <button type="button" data-load-layout="${i}" ${a?"":"disabled"} class="brass-btn ${a?"gold-cta":""}" style="flex:1;padding:4px 6px;font-size:12px;">Dùng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn" style="font-size:12px;">Cất trang trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn ${c>0?"gold-cta":""}" ${c>0?"":"disabled"} style="font-size:12px;">
            Bày lại (${c})
          </button>
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta" style="font-size:12px;">
            Hướng dẫn
          </button>
          <button id="btnResetPark" type="button" class="brass-btn" style="font-size:12px;border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            Chơi lại
          </button>
        </div>
        <div style="font-size:12px;color:var(--ink-soft);">Đã tự lưu trên HPVN.</div>
        ${r?`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                <label class="switch-row" style="width:100%;">
                  <span>Sandbox (Dev)</span>
                  <input id="swSandbox" type="checkbox" switch ${s.sandboxMode?"checked":""} />
                </label>
                <button id="btnPreview100" type="button" class="brass-btn" style="font-size:12px;">${e.sim.isHeadmasterPreview?"Về Save":"Xem Lv.100"}</button>
                <button id="btnTestFireworks" type="button" class="brass-btn" style="font-size:12px;">Pháo hoa</button>
                <button id="btnTestEscape" type="button" class="brass-btn" style="font-size:12px;">Thả Niffler</button>
              </div>`:""}
      </div>
    `,"switch"in HTMLInputElement.prototype||Ft(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",i=>{s.settings.bgmEnabled=i.currentTarget.checked,e.sim.audio.bgmEnabled=s.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",i=>{s.settings.soundEnabled=i.currentTarget.checked,e.sim.audio.enabled=s.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",i=>{s.settings.cutawayMode=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",i=>{s.settings.showGrid=i.currentTarget.checked,e.sim.saveToStorage(),e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",i=>{typeof window<"u"}),t.querySelectorAll("[data-time]").forEach(i=>{i.addEventListener("click",()=>{s.settings.timeOverride=i.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Je(e)})}),t.querySelectorAll("[data-fest]").forEach(i=>{i.addEventListener("click",()=>{s.settings.activeFestival=i.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),Je(e)})}),t.querySelectorAll("[data-weather]").forEach(i=>{i.addEventListener("click",()=>{s.settings.weatherOverride=i.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Je(e)})}),t.querySelectorAll("[data-toon]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.toon==="on";e.sim.state.settings.toonEnabled=d,e.sim.saveToStorage(),Je(e),(e.sprites?e.sprites.setToonEnabledAsync(d):Promise.resolve()).then(()=>{e.sim.state.settings.toonEnabled===d&&(typeof window<"u"&&window.dispatchEvent(new CustomEvent("hangsoc:toon-changed")),e.refreshAll())})})}),t.querySelectorAll("[data-renderer-mode]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.rendererMode;(d==="webgl2"||d==="canvas")&&(s.settings.rendererMode=d,e.sim.saveToStorage(),e.refreshAll(),Je(e))})}),t.querySelectorAll("[data-yule-theme-mode]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.yuleThemeMode;(d==="auto"||d==="on"||d==="off")&&(s.settings.yuleThemeMode=d,typeof document<"u"&&(document.documentElement.dataset.yuleTheme=e.sim.isYuleVisualThemeActive()||e.sim.isWinterMainMapActive()?"true":"false"),e.sim.saveToStorage(),e.refreshAll(),Je(e))})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),Je(e)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),Be(e.cam,18,24.5),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(i=>{i.addEventListener("input",()=>{const d=i.dataset.volBus,a=Math.max(0,Math.min(1,Number(i.value)/100)),$=e.getEffectiveA11ySettings();$.volumes[d]=a,s.a11ySettings=$;const f=t.querySelector(`[data-vol-val="${d}"]`);f&&(f.textContent=`${Math.round(a*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(i=>{i.addEventListener("click",()=>{const d=e.getEffectiveA11ySettings();d.colorblindMode=i.dataset.cbMode,s.a11ySettings=d,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Je(e)})}),t.querySelectorAll("[data-font-scale]").forEach(i=>{i.addEventListener("click",()=>{const d=e.getEffectiveA11ySettings();d.fontScale=Number(i.dataset.fontScale),s.a11ySettings=d,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Je(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",i=>{const d=e.getEffectiveA11ySettings();d.highContrast=i.currentTarget.checked,s.a11ySettings=d,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.saveLayout,a=e.sim.saveLayoutPreset(d);e.showToast(`📐 Đã lưu "${a.label}" (${a.placements.length} công trình)!`,"📐"),Je(e)})}),t.querySelectorAll("[data-load-layout]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.loadLayout,a=e.sim.applyLayoutPreset(d);e.showToast(a.msg,a.ok?"📐":"⚠️"),e.refreshAll(),Je(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const i=e.sim.stashAllDecorItems();e.showToast(i.msg,i.ok?"📦":"⚠️"),e.refreshAll(),Je(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const i=e.sim.restoreAllStashedDecor();e.showToast(i.msg,i.ok?"🌸":"⚠️"),e.refreshAll(),Je(e)}),t.querySelectorAll("[data-save-slot]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.saveSlot,a=e.sim.saveNamedProfileSlot(d);e.showToast(`💾 Đã ghi ${a.label} (Cấp ${a.level})!`,"💾"),Je(e)})}),t.querySelectorAll("[data-load-slot]").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.loadSlot,a=e.sim.loadNamedProfileSlot(d);a.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(a.msg,a.ok?"📂":"⚠️")})})}function Kr(e,t,s){t&&(e.activeSuitcaseTab=t),s&&(e.selectedSuitcaseHabitatUid=s),Ke(e);const o=e.root.querySelector("#suitcaseDialog");o.open||o.showModal()}function Qr(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const s=e.sim.getSuitcaseReadySummary();s.badgeCount>0?(t.textContent=String(s.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function Xr(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=Date.now(),o=e.sim.state.suitcase,l=!!(o.activeIncubation&&s>=o.activeIncubation.endsAt),r=!!(o.activeExpedition&&s>=o.activeExpedition.endsAt);if((l!==e.lastSuitcaseIncReady||r!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){Ke(e);return}if(o.activeIncubation&&s<o.activeIncubation.endsAt){const n=Math.max(1,Math.ceil((o.activeIncubation.endsAt-s)/1e3)),c=Math.max(1e3,o.activeIncubation.endsAt-o.activeIncubation.startedAt),i=Math.min(100,Math.round((s-o.activeIncubation.startedAt)/c*100)),d=t.querySelector("[data-suitcase-inc-left]");d&&(d.textContent=`${n}s`);const a=t.querySelector("[data-suitcase-inc-prog]");a&&(a.value=i)}if(o.activeExpedition&&s<o.activeExpedition.endsAt){const n=Math.max(1,Math.ceil((o.activeExpedition.endsAt-s)/1e3)),c=Math.max(1e3,o.activeExpedition.endsAt-o.activeExpedition.startedAt),i=Math.min(100,Math.round((s-o.activeExpedition.startedAt)/c*100)),d=t.querySelector("[data-suitcase-exp-left]");d&&(d.textContent=`${n}s`);const a=t.querySelector("[data-suitcase-exp-prog]");a&&(a.value=i)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const n=e.sim.state.buildings.find(c=>c.uid===e.selectedSuitcaseHabitatUid);if(n){const c=Math.max(0,Math.ceil(($n-(s-(n.lastGroomedAt??0)))/1e3)),i=Math.max(0,Math.ceil((kn-(s-(n.lastTrainedAt??0)))/1e3)),d=t.querySelector("#btnScGroom");d&&(d.textContent=c>0?`🪮 (${c}s)`:"🪮 Chải (+30💝)");const a=t.querySelector("#btnScTrain");a&&(a.textContent=i>0?`🎾 (${i}s)`:"🎾 Tập (20 Sickle • +45💝)")}}}function Ke(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=e.sim.state,o=s.suitcase,l=Date.now(),r=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!r.some(p=>p.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=r[0]?.building.uid??null);const n=new Set(o.discoveredMorphs),c=sa.length*3,i=n.size,d=Vi(i),a=s.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(o.activeIncubation&&l>=o.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(o.activeExpedition&&l>=o.activeExpedition.endsAt);const $=p=>p?`<span class="nb-tab-badge">${p}</span>`:"",f=(p,g,b,v="")=>p?l>=p.endsAt?`<span class="nb-tab-badge" aria-label="${g}">!</span>`:`<span class="nb-tab-badge hs-tab-dot" aria-label="${b}"></span>`:v,u=f(o.activeIncubation,"trứng đã nở","đang ấp"),S=f(o.activeExpedition,"đã về","đang đi",$(`${i}/${c}`)),w=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${r.length}</strong></span>
        <span>📖 <strong>${i}/${c}</strong> (+${d}%)</span>
        <span>Bụi Sao <strong>${s.sandboxMode?"∞":a}</strong> • ⏳ <strong>${s.sandboxMode?"∞":s.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${e.activeSuitcaseTab==="care"}" aria-pressed="${e.activeSuitcaseTab==="care"}" class="brass-btn">
          Chăm Sóc ${$(r.length)}
        </button>
        <button type="button" data-sc-tab="morph" data-active="${e.activeSuitcaseTab==="morph"}" aria-pressed="${e.activeSuitcaseTab==="morph"}" class="brass-btn">
          Ấp Trứng ${u}
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${e.activeSuitcaseTab==="expedition"}" aria-pressed="${e.activeSuitcaseTab==="expedition"}" class="brass-btn">
          Thám Hiểm ${S}
        </button>
      </div>
    `;let I="";if(e.activeSuitcaseTab==="care")if(r.length===0)I=`
          <div class="quest-card-mini" style="text-align:center;">
            <div class="hs-card-title" style="color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây chuồng
            </button>
          </div>
        `;else{const p=r.find(J=>J.building.uid===e.selectedSuitcaseHabitatUid)??r[0],g=p.building,b=p.item,v=Ms(b.id)??sa[0],T=g.creatureMorph??"normal",F=wt[T],A=g.creatureBondLevel??1,H=g.creatureBondXp??0,K=A>=ls?100:zi(A),V=A>=ls?100:H,Z=Math.round((en(A)-1)*100),re=g.creatureNickname||b.creatureName||b.name,B=e.sim.getBuildingProductionPerCycle(g,b),U=e.sim.biomeCache.get(g.uid),E=Math.round(g.creatureHunger??90),de=Math.max(8,Math.round(b.cost*.04)),oe=s.sandboxMode?0:Math.max(0,Math.ceil(($n-(l-(g.lastGroomedAt??0)))/1e3)),he=s.sandboxMode?0:Math.max(0,Math.ceil((kn-(l-(g.lastTrainedAt??0)))/1e3)),Ie=o.activeExpedition?.habitatUid===g.uid;I=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${r.map(({building:J,item:M})=>{const O=Ms(M.id),j=J.creatureMorph??"normal",ee=wt[j],ce=J.creatureNickname||M.creatureName||M.name,ue=J.uid===g.uid;return`
                  <button type="button" data-select-pet="${x(J.uid)}" aria-pressed="${ue}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${O?.beastSpriteKey??M.spriteKey}.webp" alt="" class="suitcase-pet-chip-img" style="filter:${ee.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${x(ce)}
                      </div>
                      <div style="font-size:11px;color:#78350f;font-weight:700;">
                        💝 Lv.${J.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${v.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
                <span>🏡 ${x(v.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${T==="radiant"?"radiant":T==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${F.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${x(re)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${v.beastSpriteKey}.webp"
                  alt="${x(re)}"
                  class="suitcase-diorama-img"
                  style="filter:${F.cssFilter} drop-shadow(0 0 18px ${F.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:16px;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${v.emoji} ${x(re)}
                </div>
                <div style="font-size:12px;opacity:0.92;margin-top:2px;">
                  ${x(v.morphNames[T])}${Ie?" • 🧭":""}
                </div>
              </div>
            </div>

            <div class="suitcase-care-details">
              <form id="formSuitcaseRename" class="suitcase-rename-form">
                <label for="inpSuitcasePetName" style="font-size:13px;font-weight:700;color:#5c2d0c;">
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
                  placeholder="${x(b.creatureName??b.name)}"
                  value="${x(g.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;margin-bottom:4px;">
                  <span>💝 Lv.${A}/${ls} (+${Z}%)</span>
                  <span style="color:#b45309;">${A>=ls?"MAX":`${H}/${K}`}</span>
                </div>
                <progress max="${K}" value="${V}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${x(v.favoriteTreat)} · <strong>+${B.galleons.toLocaleString("vi-VN")} Sickle / ${st(b.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:4px;">
                  <span>🥩 ${E}%</span>
                  <span>🌿 ${U?.score??60}% ${g.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${E}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${s.sandboxMode?"0 Sickle":`${de} Sickle`} · +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${oe===0?"gold-cta":""}">
                  ${oe>0?`🪮 (${oe}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${he>0?`🎾 (${he}s)`:"🎾 Tập (20 Sickle · +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới chuồng
                </button>
                <button id="btnScToggleRoam" type="button" class="brass-btn ${o.activeRoamingPetId===g.uid?"gold-cta":""}" style="grid-column:1 / -1;">
                  ${o.activeRoamingPetId===g.uid?"🏡 Đang đi dạo ngoài sân (Bấm cho về chuồng)":"🐾 Dắt thú cưng đi dạo ngoài sân"}
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const p=o.activeIncubation;let g="";if(p){const v=le(p.itemId),T=Ms(p.itemId),F=l>=p.endsAt,A=Math.max(0,Math.ceil((p.endsAt-l)/1e3)),H=Math.max(1e3,p.endsAt-p.startedAt),K=F?100:Math.min(100,Math.round((l-p.startedAt)/H*100));g=`
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:700;color:#78350f;">
                🥚 ${x(T?.speciesName??v?.name??"Trứng")}
                ${p.boostedWithStarlight?'<span style="color:#0369a1;"> · Bụi Sao ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:700;color:#b45309;">
                ${F?"✨ Nở!":`${A}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${K}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${F?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else g=`
          <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div class="hs-card-title" style="color:#7c2d12;">🧬 Lồng ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(s.sandboxMode||a>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const b=r.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${r.map(({building:v,item:T})=>{const F=Ms(T.id),A=v.creatureMorph??"normal",H=e.sim.getMorphIncubationCost(T),K=v.creatureNickname||T.creatureName||T.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${F?.beastSpriteKey??T.spriteKey}.webp" alt="" style="width:52px;height:52px;object-fit:contain;filter:${wt[A].cssFilter};" />
                        <div style="min-width:0;">
                          <div class="hs-card-title" style="color:#45230c;">${x(K)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${wt[A].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(V=>{const Z=n.has(`${T.id}:${V}`);return`<span class="morph-pill ${Z?V==="radiant"?"radiant":V==="mystic"?"mystic":"":"locked"}">${Z?wt[V].badge:`🔒 ${wt[V].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${x(v.uid)}"
                        class="brass-btn ${p?"":"gold-cta"}"
                        ${p?"disabled":""}
                      >
                        ${p?"🥚 Đang ấp":`🥚 Ấp (${s.sandboxMode?"0 Sickle":`${H} Sickle`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;I=`${g}${b}`}else{const p=o.activeExpedition;let g="";if(p){const v=aa.find(re=>re.id===p.expeditionId)??aa[0],T=s.buildings.find(re=>re.uid===p.habitatUid),F=T?le(T.itemId):void 0,A=T?.creatureNickname||F?.creatureName||"Thú cưng",H=l>=p.endsAt,K=Math.max(0,Math.ceil((p.endsAt-l)/1e3)),V=Math.max(1e3,p.endsAt-p.startedAt),Z=H?100:Math.min(100,Math.round((l-p.startedAt)/V*100));g=`
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:700;color:#14532d;">
                ${v.emoji} ${x(A)} · ${x(v.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:700;color:#15803d;">
                ${H?"🎒 Đã về!":`${K}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${Z}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${H?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(r.length===0)g=`
          <div class="quest-card-mini" style="font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const T=(r.find(A=>A.building.uid===e.selectedSuitcaseHabitatUid)??r[0]).building,F=en(T.creatureBondLevel??1)*wt[T.creatureMorph??"normal"].incomeMult;g=`
          <div class="quest-card-mini" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:700;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${r.map(({building:A,item:H})=>{const K=A.creatureNickname||H.creatureName||H.name,V=wt[A.creatureMorph??"normal"].shortLabel;return`<option value="${x(A.uid)}" ${A.uid===T.uid?"selected":""}>${x(K)} (💝Lv.${A.creatureBondLevel??1} • ${V})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${aa.map(A=>{const H=!s.sandboxMode&&s.level<A.minParkLevel,K=Math.round(A.baseGold*F),V=Math.round(A.baseXp*F),Z=(T.creatureBondLevel??1)>=5?1:0,re=A.guaranteedIngredients.map(B=>`+${B.qty+Z} ${Us[B.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div class="hs-card-title" style="color:#45230c;">
                    ${A.emoji} ${x(A.name)} <span style="font-size:12px;color:#78350f;">(${A.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${K} Sickle · +${V} ⭐ · ${re}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${A.id}"
                    class="brass-btn ${H?"":"gold-cta"}"
                    ${H?"disabled":""}
                  >
                    ${H?`🔒 Lv.${A.minParkLevel}`:"🧭 Cử đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const b=`
        <div class="quest-card-mini">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;margin-bottom:4px;">
            <span>📖 Sổ tay (${i}/${c})</span>
            <span style="color:#15803d;">+${d}%</span>
          </div>
          <progress max="${c}" value="${i}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${sa.map(v=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${v.beastSpriteKey}.webp" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:700;color:#45230c;">${v.emoji} ${x(v.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(T=>{const F=n.has(`${v.habitatItemId}:${T}`);return`<span class="morph-pill ${F?T==="radiant"?"radiant":T==="mystic"?"mystic":"":"locked"}">${F?wt[T].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;I=`${g}${b}`}t.innerHTML=`${w}${I}`,t.querySelectorAll("[data-sc-tab]").forEach(p=>{p.addEventListener("click",()=>{e.activeSuitcaseTab=p.dataset.scTab,Ke(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(p=>{p.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=p.dataset.selectPet??null,Ke(e)})});const q=t.querySelector("#formSuitcaseRename"),P=t.querySelector("#inpSuitcasePetName");if(P&&P.addEventListener("keydown",p=>{p.isComposing||p.stopPropagation()}),q&&P&&e.selectedSuitcaseHabitatUid){const p=e.selectedSuitcaseHabitatUid;q.addEventListener("submit",g=>{g.preventDefault();const b=e.sim.renameCreature(p,P.value);e.showToast(b.msg,"🏷️"),Ke(e)})}if(e.selectedSuitcaseHabitatUid){const p=e.selectedSuitcaseHabitatUid,g=()=>{const b=e.sim.groomCreature(p);e.showToast(b.msg,b.ok?"🪮":"⏳"),Ke(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",g),t.querySelector("#btnScGroom")?.addEventListener("click",g),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(p),Ke(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const b=e.sim.trainCreatureTrick(p);e.showToast(b.msg,b.ok?"🎾":"🪙"),Ke(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const b=s.buildings.find(v=>v.uid===p);b&&(e.root.querySelector("#suitcaseDialog").close(),Be(e.cam,b.gx+1,b.gy+1),e.inspectSelection={kind:"building",uid:b.uid},e.renderInspector())}),t.querySelector("#btnScToggleRoam")?.addEventListener("click",()=>{const b=o.activeRoamingPetId===p?null:p,v=e.sim.setActiveRoamingPet(b);e.showToast(v.msg,"🐾"),Ke(e),e.refreshAll()})}const h=t.querySelector("#chkScStarlight");h&&h.addEventListener("change",()=>{e.useStarlightForIncubation=h.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.incubateUid,b=e.useStarlightForIncubation&&(s.sandboxMode||(s.supply.ingredients.starlight_dust??0)>=1),v=e.sim.startMorphIncubation(g,b);e.showToast(v.msg,v.ok?"🥚":"⚠️"),Ke(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const p=e.sim.speedUpIncubationWithSand();e.showToast(p.msg,p.ok?"⏳":"⚠️"),Ke(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),Ke(e)});const k=t.querySelector("#selScExpPet");k&&k.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=k.value,Ke(e)}),t.querySelectorAll("[data-start-exp]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.startExp,b=e.selectedSuitcaseHabitatUid??r[0]?.building.uid;if(!b)return;const v=e.sim.startSuitcaseExpedition(b,g);e.showToast(v.msg,v.ok?"🧭":"⚠️"),Ke(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const p=e.sim.speedUpExpeditionWithSand();e.showToast(p.msg,p.ok?"⏳":"⚠️"),Ke(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),Ke(e)})}const hn=(e,t)=>Ys("farm",{op:e,...typeof t=="string"?{hostUid:t}:{}}),vs={authoritativeClient:{snapshot:null,visit:(e={})=>hn(e.help===!0?"help":"visit",e.hostUid),fireOut:e=>hn("fire-out",e.hostUid),syncProfile:async e=>({profile:{username:js?.displayName??""}})},syncWalletBaseline:e=>{}};function vn(e){return{reason:"hpvn-server",icon:"🦉",text:e instanceof Error&&e.message?e.message:"Chưa kết nối được HPVN, thử lại nhé."}}async function Yr(e){return!1}const ri=()=>js?.uid??"hpvn-local",Zr=e=>{},Jr=e=>!1;function el(e={}){const t=e.parkName||"Trang Trại Hang Sóc",s=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",o=Math.max(1,Math.floor(Number(e.level)||1)),l=Math.max(0,Math.floor(Number(e.magicStars)||0)),r=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),n=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),c=e.house?` · Nhà ${e.house}`:"",i=e.keeperTitle?` · ${e.keeperTitle}`:"",d={rain:"Mưa phùn",storm:"Giông phép",snow:"Tuyết rơi",fog:"Sương mù",fireflies:"Đom đóm đêm"},a=e.weatherMode&&d[e.weatherMode]?` (${d[e.weatherMode]})`:"";return`[${t}${s} · Cấp ${o}${c}${i}]${a} — ${r}/10 vùng mở khóa, ${n} công trình & ${l} Sao Phép Thuật!`}const tl={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"},li=()=>Promise.race([No(["crest-gryffindor","crest-ravenclaw","crest-hufflepuff","crest-slytherin","ui_icon_hammer_wand","m3_icon_star"]),new Promise(e=>setTimeout(e,2e3))]);function ci(e,t={},s){const r=s??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});r.width=640,r.height=380;const n=r.getContext("2d");if(!n)return r;const c=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),i=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),d=Math.max(1,Math.floor(Number(t.level)||1)),a=t.house||"Gryffindor",$=Math.max(0,Math.floor(Number(t.magicStars)||0)),f=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),u=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1)),S=t.theme||"classic_burrow",w=S==="starry_hogwarts"?{frameBg:"#121b33",outerBorder:"#93c5fd",innerBorder:"rgba(224, 242, 254, 0.45)",headerBg:"#1e293b",headerText:"#e0f2fe",headerTitle:"🌙 ĐÊM SAO HOGWARTS · BƯU THIẾP THUNG LŨNG",parchmentBg:"#eff6ff",parchmentBorder:"#60a5fa"}:S==="festive_lantern"?{frameBg:"#451212",outerBorder:"#fbbf24",innerBorder:"rgba(254, 243, 199, 0.48)",headerBg:"#691919",headerText:"#fef08a",headerTitle:"🏮 ĐÈN LỒNG LỄ HỘI · BƯU THIẾP THUNG LŨNG",parchmentBg:"#fefce8",parchmentBorder:"#f59e0b"}:{frameBg:"#2b1910",outerBorder:"#d4a238",innerBorder:"rgba(248, 236, 200, 0.38)",headerBg:"#3b2316",headerText:"#f6df9e",headerTitle:"🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",parchmentBg:"#f6ebd2",parchmentBorder:"#b9852c"};n.fillStyle=w.frameBg,n.fillRect(0,0,640,380),n.strokeStyle=w.outerBorder,n.lineWidth=4,n.strokeRect(6,6,628,368),n.strokeStyle=w.innerBorder,n.lineWidth=1.5,n.strokeRect(12,12,616,356),n.fillStyle=w.headerBg,n.fillRect(16,16,608,30),n.fillStyle=w.headerText,n.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',n.textBaseline="middle",n.fillText(w.headerTitle,26,31);const q={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";n.textAlign="right",n.fillStyle="#ebd4a7",n.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',n.fillText(q,614,31),n.textAlign="left";const P=18,h=50,k=604,p=248;n.save(),n.beginPath(),n.rect(P,h,k,p),n.clip();let g=!1;const b=E=>{const de=k/p;let oe=0,he=0,Ie=E.width,fe=E.height;Ie/fe>de?(Ie=Math.round(E.height*de),oe=Math.round((E.width-Ie)/2)):(fe=Math.round(E.width/de),he=Math.round((E.height-fe)/2)),n.drawImage(E,oe,he,Ie,fe,P,h,k,p)};if(e&&e.width>0&&e.height>0)try{const E=typeof document<"u"&&e.id==="gameCanvas"?document.getElementById("gpuWorldCanvas"):null;E&&E.style.display!=="none"&&E.width>0&&E.height>0&&b(E),b(e),g=!0}catch{g=!1}if(!g){const E=n.createLinearGradient(P,h,P,h+p);E.addColorStop(0,"#365843"),E.addColorStop(.55,"#598249"),E.addColorStop(1,"#334d2c"),n.fillStyle=E,n.fillRect(P,h,k,p)}n.restore(),n.strokeStyle="#c89632",n.lineWidth=2,n.strokeRect(P,h,k,p);const v=18,T=304,F=604,A=58;n.fillStyle=w.parchmentBg,n.fillRect(v,T,F,A),n.strokeStyle=w.parchmentBorder,n.lineWidth=1.5,n.strokeRect(v,T,F,A);const H=tl[a]||"🪄";n.fillStyle="#2d1a0e",n.font='700 16px "Be Vietnam Pro", sans-serif',n.fillText(`${H} `,v+14,T+21);const K=v+14+n.measureText(`${H} `).width;cn(n,c,K,T+21),n.fillText(` · Cấp ${d}`,K+dn(n,c),T+21),n.fillStyle="#5c3d24",n.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const V=t.keeperTitle?` · ${t.keeperTitle}`:"";cn(n,i,v+14,T+42),n.fillText(` · Nhà ${a}${V} · ${u}/10 vùng · ${f} công trình · ${$} 🌟`,v+14+dn(n,i),T+42);const Z=142,re=34,B=v+F-Z-12,U=T+12;return n.fillStyle="#1d5c4b",n.fillRect(B,U,Z,re),n.strokeStyle="#7fe5bd",n.lineWidth=1.5,n.strokeRect(B,U,Z,re),n.fillStyle="#f7fff9",n.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',n.textAlign="center",n.fillText("🔥 RỦ BẠN BAY FLOO",B+Z/2,U+re/2+1),n.textAlign="left",r}const Vs={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},yn={clear:"Nắng ấm",cloudy:"Mây nhẹ",rain:"Mưa phùn",storm:"Giông phép",snow:"Tuyết rơi",fog:"Sương mù",fireflies:"Đom đóm",dawn:"Bình minh",day:"Ngày",dusk:"Chiều",night:"Đêm"},Ca={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Wa(e){return e.sim.getPlayerHouse()}function Jt(e,t,s=""){const o=ko(e),l=(t||"🧙").trim().slice(0,2);return o?`<span class="floo-avatar-shell ${s}"><img src="${x(o)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${x(l)}</span></span>`:`<span class="floo-avatar-shell ${s}"><span class="floo-avatar-fallback">${x(l)}</span></span>`}function di(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Ma(e){const t=e.sim.ensureNeighborSocial(),s=Wa(e),o=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:o,level:e.sim.state.level,house:s,keeperTitle:Ea(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day",theme:t.postcardTheme||"classic_burrow"}}function ja(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),Le(e),e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function pi(e,t){if(!t||typeof t!="object")return;const s=t,o=e.sim.ensureNeighborSocial();let l=!1;typeof s.uid=="string"&&s.uid.trim()&&Zr(s.uid);const r=typeof s.garden?.progression?.friendCode=="string"&&s.garden.progression.friendCode.trim()||(s.profile&&typeof s.profile=="object"&&typeof s.profile.friendCode=="string"?String(s.profile.friendCode).trim():"");if(r&&o.playerFriendCode!==r&&(o.playerFriendCode=r,l=!0),s.wallet&&typeof s.wallet.spendable=="number"&&Number.isFinite(s.wallet.spendable)){const i=e.sim.homeStateWhileVisiting??e.sim.state,d=Math.max(0,Math.floor(s.wallet.spendable));if(!i.sandboxMode&&!i.sandboxTainted&&!e.sim.isHeadmasterPreview){const a=!!s.receipt,$=Jr();(a||$||d>=i.galleons)&&i.galleons!==d&&(d>i.galleons&&(e.sim.pendingInboxSickles+=d-i.galleons),i.galleons=d,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=d),l=!0)}}const n=s.profile&&typeof s.profile=="object"?s.profile:null;if(n){const i=typeof n.username=="string"?n.username.trim():"";i&&i!=="Phù Thủy Hang Sóc"&&i!=="Trang Trại Hang Sóc"&&!o.playerDisplayName&&(o.playerDisplayName=i,l=!0);const d=typeof n.avatarUrl=="string"?n.avatarUrl.trim():"";d&&o.playerAvatarUrl!==d&&(o.playerAvatarUrl=d,l=!0)}const c=s.daily&&typeof s.daily=="object"?s.daily:null;if(c&&typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(pt,Math.floor(c.helpsLeft)));const i=Math.max(0,pt-e.flooHelpsLeft);i>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=i,l=!0)}if(Array.isArray(s.helpers)&&s.helpers.length>0){e.flooHelpersToday=s.helpers.map(d=>({uid:String(d.uid||""),name:String(d.name||"Bạn HPVN"),avatarEmoji:d.avatarEmoji,avatarUrl:d.avatarUrl,at:Number(d.at||0)}));const i=vo(e.flooHelpersToday,o.lastSeenHelperAt??0);i&&i.textVi&&i.seenAt>(o.lastSeenHelperAt??0)&&(o.lastSeenHelperAt=i.seenAt,l=!0,e.showToast(i.textVi,"🤝"))}l&&(e.sim.saveToStorage(),e.refreshAll())}async function ys(e,t=!1){if(e.flooLoading)return;const s=Date.now();if(!t&&e.flooLastLoadedAt>0&&s-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const o=e.sim.ensureNeighborSocial(),l=Wa(e),r=o.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const n=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;n||Yr(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!n&&await vs.authoritativeClient.syncProfile({playerName:r,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:o.playerAvatarUrl||"",avatarEmoji:Ca[l],house:l,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(a=>pi(e,a)).catch(()=>{});const c=await vs.authoritativeClient.visit({});if(typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(pt,Math.floor(c.helpsLeft)));const a=Math.max(0,pt-e.flooHelpsLeft);a>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=a)}const i=Array.isArray(c.visits)?c.visits:[],d=Ns(i,Date.now());e.flooDirectoryRows=d,e.flooQueueRows.length===0&&(e.flooQueueRows=d),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(d,ri())}catch{}finally{e.flooLoading=!1;const n=e.root.querySelector("#neighborDialog"),c=document.activeElement?.id??"";n?.open&&c!=="inpFlooDisplayName"&&Ue(e),e.renderVisitorDockBar()}}let ga=!1;function Aa(e){if(ga)return;ga=!0;const t=e.root.querySelectorAll("#btnPostcardShareFloo, #btnFlooQuickInvite, #btnHonorShareFloo");t.forEach(o=>o.disabled=!0);const s=Ma(e);li().then(()=>ma(ci(e.gameCanvas,s),`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`)).then(()=>{const o=e.sim.recordFlooShareOrPostcard("shareFloo");e.showToast(o.msg,"🔥")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{ga=!1,t.forEach(o=>o.disabled=!1),e.refreshAll(),e.root.querySelector("#neighborDialog")?.open&&Ue(e)})}function gi(e,t,s){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),s&&(e.focusedNeighborId=s),(e.sim.state.level>=Yt||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&ys(e),Ue(e);const l=e.root.querySelector("#neighborDialog");l&&!l.open&&l.showModal(),s&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${s}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function ui(e,t){e.closeHudPopovers();const s=e.root.querySelector("#neighborDialog");s?.open&&s.close(),t.kind==="match3"?e.getMatch3Modal().then(o=>o.openRescue(t)):e.getPuzzleArcadeModal().then(o=>o.openRescue(t))}function Zs(e,t){ja(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const o=e.sim.enterHonorGardenTour(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),Be(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Vt(e,t,s){const o=String(t||"").trim();if(!o)return;if(o.startsWith("tour_")){Zs(e,o);return}s&&s.length>0?e.flooQueueRows=[...s]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),ja(e);const l=e.root.querySelector("#neighborDialog");l?.open&&l.close();const r=o.startsWith("player_")?o:`player_${o}`,n=o.startsWith("player_")?o.slice(7):o;(async()=>{try{const i=await vs.authoritativeClient.visit({hostUid:n});typeof i.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(pt,Math.floor(i.helpsLeft))));const d=i.visit&&typeof i.visit=="object"?i.visit:null;if(d){const a=d.progression&&typeof d.progression=="object"?d.progression:void 0,$=Date.now(),f=Array.isArray(a?.timers)?a.timers.filter(q=>Number(q.readyAt||0)>$).length:0,u=d.decorations&&typeof d.decorations=="object"?d.decorations:void 0,S={uid:String(d.uid||n),friendCode:typeof d.friendCode=="string"?d.friendCode:void 0,username:String(d.username||"Thành Viên HPVN"),parkName:String(d.parkName||"Thung Lũng Phép Thuật"),house:d.house||"Gryffindor",avatarEmoji:typeof d.avatarEmoji=="string"?d.avatarEmoji:void 0,avatarUrl:typeof d.avatarUrl=="string"?d.avatarUrl:void 0,level:Math.max(1,Number(d.level||1)),growing:f,helped:!!d.helped,hostHelpsLeft:typeof d.hostHelpsLeft=="number"?d.hostHelpsLeft:10,fire:d.fire&&typeof d.fire=="object"?d.fire:null,scene:u?.scene},w=e.sim.syncFlooDirectoryMembers([S],ri()),I=d.rawClientSave&&typeof d.rawClientSave=="object"?d.rawClientSave:null;if(w[0]&&I){if(Array.isArray(I.buildings)&&I.buildings.length>0){const q=I.buildings.filter(P=>P&&typeof P.itemId=="string"&&!!le(P.itemId));q.length>0&&(w[0].valleyBuildings=q)}I.tileOverrides&&typeof I.tileOverrides=="object"&&(w[0].valleyTileOverrides=I.tileOverrides),Array.isArray(I.unlockedZones)&&I.unlockedZones.length>0&&(w[0].valleyUnlockedZones=I.unlockedZones)}}}catch{}const c=e.sim.enterNeighborVisit(r);c.ok&&typeof c.focusGx=="number"&&typeof c.focusGy=="number"?(e.onCameraJump?.(),Be(e.cam,c.focusGx,c.focusGy)):c.ok||e.showToast(c.msg,"⚠️"),e.refreshAll()})()}function mi(e,t){if(t.startsWith("tour_")){Zs(e,t);return}ja(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const o=e.sim.enterNeighborVisit(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),Be(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Xs(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),Be(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const s=new URLSearchParams(window.location.search);if(s.has("visit")||s.has("tour")){s.delete("visit"),s.delete("tour");const o=s.toString();window.history.replaceState(null,"",`${window.location.pathname}${o?`?${o}`:""}${window.location.hash}`)}}e.refreshAll()}function sl(e){const t=e.sim.ensureNeighborSocial(),s=t.playerOwlHelpRequests.filter(d=>!!d.fulfilledAt).length,o=t.playerMinigameSos?.rescuedAt??0,l=!!t.playerMinigameSos?.claimed,r=`${t.lastSocialResetKey}|${t.friendshipTokens}|${s}|${o}|${l}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(r===e.lastSocialLiveSig)return;e.lastSocialLiveSig=r,bi(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const c=e.root.querySelector("#neighborDialog"),i=document.activeElement?.id??"";c?.open&&i!=="inpFlooDisplayName"&&Ue(e)}function bi(e){const t=e.sim.ensureNeighborSocial(),s=Math.floor(t.friendshipTokens/Zt),o=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,l=t.homeLanternMarks.length,r=s+o+l,c=Math.max(0,ps-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter($=>$.minigameSos&&!$.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes($.id)).length:0,i=e.sim.state.level>=Yt&&(t.dailyGardenHelpsCount??0)<pt?e.flooDirectoryRows.filter($=>fs($)).length:0,d=e.root.querySelector("#badgeNeighborCount");if(d){const $=r>0?r:c>0?c:i;$>0?(d.textContent=String($),d.classList.toggle("is-ready-green",r>0),d.classList.remove("hidden")):d.classList.add("hidden")}const a=e.root.querySelector("#badgeManageNeighborCount");a&&(r>0?(a.textContent=String(r),a.classList.remove("hidden")):a.classList.add("hidden"))}function al(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const s=e.sim.getActiveHonorGardenTour();if(s){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${x(Bt(s.avatarEmoji,s.titleVi))}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${x(s.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${s.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span><span class="hs-raw">${x(s.ownerName)}</span> · ${x(Vs[s.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const p=e.sim.cycleHonorGardenTour(-1);p.ok&&typeof p.focusGx=="number"&&typeof p.focusGy=="number"&&(e.onCameraJump?.(),Be(e.cam,p.focusGx,p.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const p=e.sim.cycleHonorGardenTour(1);p.ok&&typeof p.focusGx=="number"&&typeof p.focusGy=="number"&&(e.onCameraJump?.(),Be(e.cam,p.focusGx,p.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{Aa(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Xs(e)});return}const o=e.sim.getActiveVisitingNeighbor();if(!o){t.classList.add("hidden"),t.innerHTML="";return}const l=e.sim.ensureNeighborSocial(),r=Date.now(),n=Math.min(pt,Math.max(l.dailyGardenHelpsCount??0,o.helpedViaFlooToday?1:o.helpedMarksToday.length)),c=Math.max(0,pt-n),i=!!(o.helpedViaFlooToday||o.helpedMarksToday.length>0),d=(o.hostHelpsLeft??10)<=0,a=!!(o.fireUntilMs&&o.fireUntilMs>r),$=!i&&c>0&&!d,f=l.dailyLikedNeighborIds.includes(o.id),u=l.dailyMysteryClaimedIds.includes(o.id),S=o.owlHelpCrates.filter(p=>!p.fulfilledByPlayerToday).length,w=e.sim.canRescueNeighborMinigame(o.id).ok,I=S+(w?1:0),q=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,P=o.remoteUserId||o.id.replace(/^player_/,""),h=q.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${q.slice(0,12).map(p=>{const g=p.uid===P,b=fs(p,r),v=!!(p.fire&&p.fire.until>r);return`
                <button
                  type="button"
                  class="floo-strip-dot ${g?"is-current":""} ${b?"is-helpable":""} ${v?"is-fire":""}"
                  data-floo-jump="${x(p.uid)}"
                  title="${x(p.username)} (Lv.${p.level})"
                >
                  ${Jt(p.avatarUrl,Bt(p.avatarEmoji,p.username),"floo-strip-avatar")}
                  ${v?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",k=i?"✓ Đã giúp (-15p)":c<=0?"Hết lượt (5/5)":d?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${h}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${Jt(o.avatarUrl,Bt(o.avatarEmoji,o.name),"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong class="hs-raw">${x(o.name)}</strong>
            <span class="visitor-lv-tag">Lv.${o.level}</span>
            ${a?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${c}/${pt}</strong> lượt</span>
            <span>•</span>
            <span>Rương Tình Bạn <strong>${l.friendshipTokens}/${Zt}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${q.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${$?"gold-cta":""}" ${$?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${k}
        </button>
        ${a?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${f?"disabled":""} title="Thả tim khen vườn">
          ${f?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${u?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${u?"✓ Quà":"🎁 Quà"}
        </button>
        <button id="btnVisitorLeaveGift" type="button" class="brass-btn" ${(l.dailyMysterySentIds??[]).includes(o.id)?"disabled":""} title="Giấu Rương Quà Bất Ngờ tặng chủ vườn (+2 🍀)">
          ${(l.dailyMysterySentIds??[]).includes(o.id)?"✓ Đã tặng":"🎁 Giấu quà"}
        </button>
        <button id="btnVisitorBuyStand" type="button" class="brass-btn" ${(e.sim.homeStateWhileVisiting??e.sim.state).roadsideStand?.dailyFriendBoughtIds?.includes(o.id)?"disabled":""} title="Mua 1 giỏ nông sản ưu đãi từ Sạp Đầu Ngõ của bạn">
          ${(e.sim.homeStateWhileVisiting??e.sim.state).roadsideStand?.dailyFriendBoughtIds?.includes(o.id)?"✓ Sạp":"🧺 Sạp"}
        </button>
        ${I>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${I})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,di(t),t.querySelectorAll("[data-floo-jump]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.flooJump;g&&g!==P&&Vt(e,g,q)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const p=t.querySelector("#btnVisitorFlooHelp");p&&(p.disabled=!0);let g;if(o.remoteUserId)try{const T=yo(l.selectedPresetNoteId),F=await vs.authoritativeClient.visit({hostUid:o.remoteUserId,help:!0,kind:"water_crop",noteText:T.textVi});typeof F.helpsLeft=="number"&&(g=F.helpsLeft,e.flooHelpsLeft=F.helpsLeft)}catch(T){const F=vn(T);e.showToast(`${F.icon} ${F.text}`,F.icon),ys(e,!0),e.refreshAll();return}const b=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:g});if(!b.ok){e.showToast(b.msg,"🤝"),e.refreshAll();return}const v=T=>T.map(F=>F.uid===P?{...F,helped:!0}:F);if(e.flooDirectoryRows=v(e.flooDirectoryRows),e.flooQueueRows=v(e.flooQueueRows),e.refreshAll(),b.helpsLeft>0&&e.flooQueueRows.length>1){const T=na(e.flooQueueRows,P,1);T&&T.uid!==P&&fs(T)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===o.id&&Vt(e,T.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const p=t.querySelector("#btnVisitorExtinguish");p&&(p.disabled=!0);try{let g=0;if(o.remoteUserId){const v=await vs.authoritativeClient.fireOut({hostUid:o.remoteUserId});g=Math.max(0,Math.floor(Number(v?.price||0)))}if(g>0){const v=e.sim.homeStateWhileVisiting??e.sim.state;v.galleons=Math.max(0,v.galleons-g),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=v.galleons)}o.fireUntilMs=0;const b=v=>v.map(T=>T.uid===P?{...T,fire:null}:T);e.flooDirectoryRows=b(e.flooDirectoryRows),e.flooQueueRows=b(e.flooQueueRows),e.showToast(g>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name} (-${g} Sickle)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(g){const b=vn(g);e.showToast(`${b.icon} ${b.text}`,b.icon),p&&(p.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const p=e.sim.likeVisitedNeighborFarm();p.ok||e.showToast(p.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{u||(e.rideCamUid=null,e.onCameraJump?.(),Be(e.cam,o.mysteryGiftGx+.5,o.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{gi(e,"friends",o.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const p=na(q,P,-1);p&&p.uid!==P&&Vt(e,p.uid,q)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(q.length>1){const g=na(q,P,1);if(g&&g.uid!==P){Vt(e,g.uid,q);return}}const p=e.sim.cycleNextNeighborVisit();p.ok&&typeof p.focusGx=="number"&&typeof p.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),Be(e.cam,p.focusGx,p.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Xs(e)}),t.querySelector("#btnVisitorBuyStand")?.addEventListener("click",()=>{const p=e.sim.buyVisitedNeighborRoadsideOffer();p.ok||e.showToast(p.msg,"🧺"),e.refreshAll()}),t.querySelector("#btnVisitorLeaveGift")?.addEventListener("click",()=>{const p=e.sim.leaveMysteryGiftForNeighbor();p.ok||e.showToast(p.msg,"🎁"),e.refreshAll()})}function Ue(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const s=e.sim.ensureNeighborSocial(),o=e.sim.getActiveVisitingNeighbor(),l=e.sim.getActiveHonorGardenTour(),r=Date.now(),n=Wa(e),c=s.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",i=Math.min(pt,Math.max(0,s.dailyGardenHelpsCount??0)),d=Math.max(0,pt-i),a=Math.max(0,ps-s.dailyRescuesGivenIds.length),$=Math.max(0,ps-s.dailyRescuesReceivedCount),f=Math.max(0,ha-s.dailyOwlHelpRequestedCount),u=s.friendshipTokens>=Zt,S=Math.min(100,Math.round(s.friendshipTokens/Zt*100)),w=s.playerMinigameSos&&!s.playerMinigameSos.claimed?s.playerMinigameSos:null,I=e.sim.state.level>=Yt||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,q=`
    <div class="workshop-tabs nb-tabs" role="group" aria-label="Cổng Floo">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        <span class="hs-long">Cổng Floo</span><span class="hs-short">Floo</span>
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        Bưu Thiếp ${s.dailyFlooShareClaimed?"":'<span class="nb-tab-badge" aria-label="có quà">!</span>'}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        <span class="hs-long">Rương &amp; SOS</span><span class="hs-short">Rương</span> ${u||w?.rescuedAt?'<span class="nb-tab-badge" aria-label="có quà">!</span>':""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        Lưu Bút ${s.activityLog.length?`<span class="nb-tab-badge">${s.activityLog.length}</span>`:""}
      </button>
    </div>
  `;let P="";if(e.activeNeighborTab==="friends"){const b=[];(s.homeVisitorGifts?.length??0)>0&&b.push(`
        <div class="nb-alert-banner ready">
          <span>🎁 <strong>${s.homeVisitorGifts.length} Rương Quà Bạn Bè</strong> tại sân</span>
          <button id="btnNbClaimVisitorGift" type="button" class="brass-btn gold-cta nb-mini-cta">Mở quà</button>
        </div>
      `),s.homeLanternMarks.length>0&&b.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 <strong>${s.homeLanternMarks.length} Đèn Lồng</strong> tại vườn</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận +${s.homeLanternMarks.length} 🍀</button>
        </div>
      `);const v=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${Jt(s.playerAvatarUrl,Ca[n],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <strong class="hs-card-title hs-raw">${x(c)}</strong>
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${Vs[n]}</span>
              <span class="floo-verified-tag">HPVN</span>
            </div>
          </div>
        </div>
      </section>
    `;let T="";if(I){const A=Ns(e.flooDirectoryRows,r),H=A.filter(E=>fs(E,r)).length,K=[...e.flooHelpersToday,...s.homeLanternMarks.map(E=>({uid:E.helperId,name:E.helperName,avatarEmoji:E.helperEmoji,avatarUrl:E.helperAvatarUrl,at:E.createdAt}))],V=Array.from(new Map(K.map(E=>[E.uid||E.name,E])).values()),Z=V.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${V.slice(0,6).map(E=>Jt(E.avatarUrl,Bt(E.avatarEmoji,E.name),"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                <strong>${x(So(V))}</strong> đã giúp · −${V.length*15} phút
              </div>
            </div>
          `:"",re=A.length>0?`
            <div class="floo-portal-grid" role="list">
              ${A.map(E=>{const de=!!(E.fire&&E.fire.until>r),oe=fs(E,r),he=o?.remoteUserId===E.uid||o?.id===`player_${E.uid}`,Ie=de?"🔥 Đang cháy":E.helped?"✓ Đã giúp":E.growing>0?`🌱 ${E.growing} mẻ`:"🌿 Yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${de?"is-fire":""} ${oe?"is-helpable":""} ${E.helped?"is-helped":""} ${he?"is-visiting":""}"
                      data-floo-portal="${x(E.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${Jt(E.avatarUrl,Bt(E.avatarEmoji,E.username),"floo-portal-avatar")}
                        ${de?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${E.level}</span>
                      </div>
                      <strong class="floo-portal-name hs-raw">${x(E.username)}</strong>
                      <span class="floo-portal-park">${x((E.house?Ca[E.house]:"")||"🪄")} ${x(E.parkName||"")}</span>
                      <span class="floo-portal-status">${Ie}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"Đang kết nối Cổng Floo…":"Chưa có vườn trực tuyến."}
            </div>
          `,B=s.neighbors.filter(E=>E.owlHelpCrates.some(de=>!de.fulfilledByPlayerToday)||!!(E.minigameSos&&!E.minigameSos.rescuedToday)),U=B.length>0?`
            <section class="floo-coop-board">
              <h3 class="nb-section-title">Tương trợ</h3>
              <div class="nb-friends-list">
                ${B.slice(0,6).map(E=>{const de=e.sim.canRescueNeighborMinigame(E.id),oe=E.minigameSos,he=oe?wo(oe.kind):null,Ie=!!(oe&&(oe.rescuedToday||s.dailyRescuesGivenIds.includes(E.id))),fe=E.owlHelpCrates.filter(M=>!M.fulfilledByPlayerToday).map(M=>{const O=Ve(M.itemId),j=e.sim.getFarmItemCount(M.itemId),ee=e.sim.state.sandboxMode||j>=M.qty;return`
                          <div class="nb-crate-item">
                            <img src="${O.iconSrc}" alt="${x(O.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${M.qty} ${x(O.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":j}/${M.qty})</span></div>
                              <div class="nb-crate-rew">+${M.rewardTokens} 🍀 · +${M.rewardSickle} Sickle</div>
                            </div>
                            <button type="button" class="brass-btn ${ee?"gold-cta":""} nb-mini-cta" data-nb-crate="${x(E.id)}|${x(M.id)}" ${ee?"":"disabled"}>Đóng giúp</button>
                          </div>
                        `}).join(""),J=oe&&he&&!Ie?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">${he.icon} ${x(he.nameVi)} · <strong>Màn ${oe.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${x(E.id)}" ${de.ok?"":"disabled"}>Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===E.id?"focused":""}" data-neighbor-card="${x(E.id)}">
                        <div class="nb-card-head">
                          ${Jt(E.avatarUrl,Bt(E.avatarEmoji,E.name),"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name hs-raw">${x(E.name)}</strong>
                              <span class="nb-badge-pill">Lv.${E.level}</span>
                              <span class="nb-badge-pill house">${Vs[E.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${x(E.id)}">Bay tới</button>
                        </div>
                        ${fe?`<div class="nb-coop-section"><div class="nb-crate-list">${fe}</div></div>`:""}
                        ${J}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";T=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng</h3>
              <div class="floo-hearth-sub">
                Giúp vườn: ${d}/${pt} · ${H} vườn chờ (−15p)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" aria-label="Làm mới" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"…":"Làm mới"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${A.length===0?"disabled":""}>
                Bay Floo
              </button>
            </div>
          </div>
          ${Z}
        </section>
        ${re}
        ${U}
      `}else{const A=Math.min(100,Math.round(e.sim.state.level/Yt*100));T=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng · Mở Cấp ${Yt}</h3>
              <div class="floo-hearth-sub">
                Cấp ${e.sim.state.level}/${Yt} · Tự kết nối vườn thành viên HPVN
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${A}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const F=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Vườn mẫu</h3>
          <span class="honor-daily-pill">
            ${s.dailyHonorTourClaimed?"✓ Đã nhận hôm nay":"+8 Sickle · +15 XP/ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${xo.map(A=>{const H=l?.id===A.id;return`
              <article class="honor-garden-card ${H?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${x(Bt(A.avatarEmoji,A.ownerName))}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${x(A.titleVi)}</strong>
                    <span class="honor-garden-owner"><span class="hs-raw">${x(A.ownerName)}</span> · Lv.${A.level} · ${Vs[A.house]}</span>
                  </div>
                </div>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">${x(yn[A.weather]??A.weather)} · ${x(yn[A.atmosphere]??A.atmosphere)}</span>
                  ${H?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${x(A.id)}">Tham quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;P=`
      ${b.join("")}
      ${v}
      ${I?`${T}${F}`:`${F}${T}`}
    `}else if(e.activeNeighborTab==="postcard"){const b=Ma(e),v=el(b),T=s.postcardTheme||"classic_burrow",F=Object.keys(on).map(A=>{const H=on[A],K=A===T;return`<button type="button" data-postcard-theme="${A}" data-active="${K}" aria-pressed="${K}" class="brass-btn ${K?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">${H.badgeVi} · ${x(H.labelVi)}</button>`}).join("");P=`
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Bưu thiếp</h3>
          <span class="honor-daily-pill">
            ${s.dailyFlooShareClaimed?"✓ Đã nhận hôm nay":"+10 Sickle · +1 🍀"}
          </span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;" role="group" aria-label="Chủ đề khung bưu thiếp">
          ${F}
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${x(v)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            Chia sẻ lên Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const b=s.playerOwlHelpRequests.length>0?s.playerOwlHelpRequests.map(v=>{const T=Ve(v.itemId);return`
                <div class="nb-crate-item ${v.fulfilledAt?"done":""}">
                  <img src="${T.iconSrc}" alt="${x(T.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${v.qty} ${x(T.name)}</div>
                    <div class="nb-crate-rew">${v.fulfilledAt?`✓ ${x(v.helperEmoji??"🦉")} <span class="hs-raw">${x(v.helperName??"Bạn HPVN")}</span>`:"Đang chờ bạn giúp"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có đơn nhờ giúp.</div>';P=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <h3 class="nb-section-title">Rương Tình Bạn (${s.friendshipTokens}/${Zt})</h3>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${S}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug"><img class="hs-ico" src="/trang-trai-hang-soc/sprites/beast_phoenix.webp" alt="" aria-hidden="true" draggable="false"> +1 Bùa</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150 Sickle</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${s.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${u?"":"disabled"}>
              Mở rương (🍀 ${Zt})
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">Kiện Hàng Tương Trợ Chung (${e.sim.ensureCoopSupplyCrate().contributedPoints}/500)</h3>
          ${(()=>{const v=e.sim.ensureCoopSupplyCrate(),T=Math.min(100,Math.round(v.contributedPoints/500*100)),A=["ottery_wheat","honey_carrot","garden_pumpkin","burrow_apple","cinnamon_apple_pie","farm_egg_wool"].map(K=>{const V=e.sim.getFarmItemCount(K),Z=(e.sim.state.sandboxMode||V>=2)&&(e.sim.state.sandboxMode||v.playerContributedToday<rn),re=Ve(K);return`<button type="button" data-coop-contrib="${K}" ${Z?"":"disabled"} class="brass-btn ${Z?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">Góp 2 ${x(re.name)} (${e.sim.state.sandboxMode?"∞":V})</button>`}).join(""),H=To.map(K=>{const V=v.claimedMilestones.includes(K.step),Z=!V&&(e.sim.state.sandboxMode||v.contributedPoints>=K.target);return`<button type="button" data-coop-milestone="${K.step}" ${Z?"":"disabled"} class="brass-btn ${Z?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">${V?`✓ Mốc ${K.step}`:`🎁 Mốc ${K.step} (${K.target}đ)`}</button>`}).join("");return`
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${T}%"></div>
              </div>
              <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 6px;">
                Đã góp hôm nay: ${v.playerContributedToday}/${rn} lượt · Mỗi lượt +1 🍀 &amp; điểm mở 3 rương chung
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${H}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">${A}</div>
            `})()}
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">SOS &amp; Đơn Cú</h3>
          <div class="floo-sos-wrap">
            ${w?`
                  <div class="nb-alert-banner ${w.rescuedAt?"ready":""}">
                    <span>${w.rescuedAt?`<strong>${x(w.rescuerEmoji??"🦉")} ${x(w.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${w.stage}</strong>`:`Đang gọi cứu <strong>Màn ${w.stage}</strong>`}</span>
                    ${w.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">Cứu hộ: ${a}/${ps} · Nhận cứu: ${$}/${ps}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">Đơn Cú nhờ bạn (${f}/${ha})</div>
            <div class="nb-crate-list">${b}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">Lời nhắn thăm vườn</h3>
          <div class="nb-preset-notes">
            ${$o.map(v=>{const T=v.id===s.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${v.id}" data-active="${T}" aria-pressed="${T}" class="brass-btn nb-note-btn">
                  ${v.emoji} ${x(v.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else P=`<div class="nb-log-list">${s.activityLog.length>0?s.activityLog.map(v=>{const T=new Date(v.timestamp),F=String(T.getHours()).padStart(2,"0"),A=String(T.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${x(v.icon)}</span>
                  <span class="nb-log-msg">${x(v.textVi)}</span>
                  <span class="nb-log-time">${F}:${A}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Chưa có lưu bút.</div>'}</div>`;t.innerHTML=`
    ${q}
    ${P}
  `,di(t);const h=t.querySelector("#flooPostcardCanvas");if(h){const b=Ma(e);li().then(()=>ci(e.gameCanvas,b,h))}t.querySelectorAll("[data-nbtab]").forEach(b=>{b.addEventListener("click",()=>{e.activeNeighborTab=b.dataset.nbtab,Ue(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",Ue(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{Aa(e),Ue(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{Aa(e),Ue(e)}),t.querySelectorAll("[data-postcard-theme]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.postcardTheme;e.sim.setPostcardFrameTheme(v),Ue(e)})}),t.querySelector("#btnNbClaimVisitorGift")?.addEventListener("click",()=>{const b=e.sim.claimHomeVisitorMysteryGift();b.ok||e.showToast(b.msg,"🎁"),e.refreshAll(),Ue(e)}),t.querySelectorAll("[data-coop-contrib]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.coopContrib,T=e.sim.contributeToCoopSupplyCrate(v,2);e.showToast(T.msg,T.ok?"📦":"🧺"),e.refreshAll(),Ue(e)})}),t.querySelectorAll("[data-coop-milestone]").forEach(b=>{b.addEventListener("click",()=>{const v=Number(b.dataset.coopMilestone),T=e.sim.claimCoopCrateMilestone(v);e.showToast(T.msg,T.ok?"🎁":"📦"),e.refreshAll(),Ue(e)})}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",b=>{b.preventDefault();const T=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);T&&(s.playerDisplayName=T,e.sim.saveToStorage(),ys(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${T}"!`,"🔥"),Ue(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{ys(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const b=Ns(e.flooDirectoryRows,Date.now());b.length>0&&Vt(e,b[0].uid,b)}),t.querySelectorAll("[data-floo-portal]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.flooPortal;if(!v)return;const T=Ns(e.flooDirectoryRows,Date.now());Vt(e,v,T)})}),t.querySelectorAll("[data-honor-tour]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.honorTour;v&&Zs(e,v)})});const p=()=>{const b=e.sim.openFriendshipChest();b.ok||e.showToast(b.msg,"🍀"),e.refreshAll(),Ue(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",p),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",p);const g=e.root.querySelector("#btnNbOpenFriendsLeaderboard");g&&(g.onclick=()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(b=>{b.addEventListener("click",()=>{const v=e.sim.claimPlayerMinigameSosRescue();v.ok||e.showToast(v.msg,"⚠️"),e.refreshAll(),Ue(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const b=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const v of b)e.sim.claimHomeLanternMark(v.id);e.refreshAll(),Ue(e)}),t.querySelectorAll("[data-nb-visit]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.nbVisit;v&&mi(e,v)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Xs(e)}),t.querySelectorAll("[data-nb-crate]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.nbCrate??"",[T,F]=v.split("|");if(!T||!F)return;const A=e.sim.fulfillNeighborOwlCrate(T,F);A.ok||e.showToast(A.msg,"🧺"),e.refreshAll(),Ue(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.nbRescue;if(!v)return;const T=e.sim.canRescueNeighborMinigame(v);if(!T.ok||!T.neighbor||!T.sos){e.showToast(T.reason??"Không thể giải cứu màn này lúc này!","🦉");return}ui(e,{neighborId:T.neighbor.id,neighborName:T.neighbor.name,neighborEmoji:T.neighbor.avatarEmoji,kind:T.sos.kind,stage:T.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(b=>{b.addEventListener("click",()=>{const v=b.dataset.nbNote;v&&(e.sim.setNeighborPresetNote(v),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),Ue(e))})})}function us(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:e.tutorialMinimized?0:.95;Be(e.cam,t.gx+t.bw*.5+o,t.gy+t.bh*.5+o),e.onCameraJump?.()}function fi(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const s=Date.now();return e.sim.state.buildings.some(l=>le(l.itemId)?.isAnimalPasturePlot&&l.pastureAnimalId&&l.pastureReadyAt&&s>=l.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0 Sickle"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const s=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(s)return{el:s,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function La(e){const t=e.root.querySelector("#tutorialHudSpotlight"),s=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(d=>d.removeAttribute("data-tutorial-anchor")),!t)return;const o=!!document.querySelector("dialog[open]");if(e.photoModeActive||o||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:l,label:r}=fi(e);if(!l||l.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const n=l.getBoundingClientRect();if(n.width<8||n.height<8){t.classList.add("hidden");return}const c=!!l.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");c||l.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!c);const i=6;t.style.setProperty("--spot-left",`${Math.round(n.left-i)}px`),t.style.setProperty("--spot-top",`${Math.round(n.top-i)}px`),t.style.setProperty("--spot-w",`${Math.round(n.width+i*2)}px`),t.style.setProperty("--spot-h",`${Math.round(n.height+i*2)}px`),t.classList.toggle("pill-below",n.top<110),s&&(s.textContent=r||"👇 Bấm"),t.classList.remove("hidden")}function hi(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function vi(e,t){if(hi())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function yi(e,t){if(hi())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function Ss(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const s=!!document.querySelector("dialog[open]"),o=e.manageMenuOpen||e.weatherPopoverOpen,l=e.sim.getCurrentTutorialStep();if(e.photoModeActive||s||o||!l){vi(e,t),La(e);return}e.sim.state.tutorial&&typeof e.sim.state.tutorial.minimized=="boolean"&&(e.tutorialMinimized=e.sim.state.tutorial.minimized);const r=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",r),t.classList.toggle("is-minimized",e.tutorialMinimized);const n=e.sim.getReadyOwlOrdersCount(),c=`${l.index}:${l.id}:${e.tutorialMinimized?1:0}:${r?1:0}:${n}`;if(e.lastRenderedTutorialSig!==c){e.lastRenderedTutorialSig=c;const d=Gs.map(a=>`<span class="tutorial-step-dot ${a.index<l.index?"done":a.index===l.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${l.pose}.webp" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${x(l.title)}</h2>
            </div>
            <button id="btnTutorialExpand" type="button" data-tutorial-focus class="brass-btn gold-cta">Mở</button>
            <button
              id="btnTutorialSkipMini"
              type="button"
              popovertarget="tutorialCoachCard"
              popovertargetaction="hide"
              class="brass-btn tutorial-skip-btn"
              aria-label="Bỏ qua hướng dẫn"
            >✕</button>
          </div>
        `;else{const a=l.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">4 Môn</button>':l.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${n>0?"Xây":"Đơn Cú"}</button>`:"",$=l.id==="build_and_owl_order"?n>0?"Giao đơn":"Xây dựng":l.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <img src="/trang-trai-hang-soc/sprites/${l.pose}.webp" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${Gs.length}"
              aria-valuenow="${l.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${d}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">${x(l.speakerName)}</div>
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${x(l.title)}</h2>
            <div class="tutorial-hint-strip">${x(l.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">Thưởng: ${x(l.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${a}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${x($)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),Ss(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),Ss(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{Si(e,l.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{l.id==="earn_magic_star"?e.openPuzzleArcadeDialog():l.id==="build_and_owl_order"&&(n>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}yi(e,t);const i=`${l.index}:${l.id}`;e.lastFocusedTutorialStepKey!==i&&(e.lastFocusedTutorialStepKey=i,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),La(e)}function Si(e,t){if(t==="harvest_wheat"){const s=e.sim.getTutorialWorldTarget();if(s)e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),us(e),e.sim.onBuildingTactile?.(s.uid),Ss(e),e.showToast("Chạm vào ô Lúa Mì chín vàng để gặt!","🌾");else{const o=le("farmland_plot");o&&(e.selectedCatalogItem=o,e.refreshAll())}return}if(t==="sow_and_merge_plot"){us(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){const s=Date.now();if(e.sim.state.buildings.some(l=>le(l.itemId)?.isAnimalPasturePlot&&l.pastureAnimalId&&l.pastureReadyAt&&s>=l.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3){const l=e.sim.getTutorialWorldTarget();e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),us(e),l&&e.sim.onBuildingTactile?.(l.uid),Ss(e),e.showToast("Chạm vào ô Đồng Cỏ có trứng để thu hoạch!","🥚")}else us(e),e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class nl{constructor(t,s,o,l,r){L(this,"sim");L(this,"cam");L(this,"gameCanvas");L(this,"activeCategory",null);L(this,"christmasTabActive",!1);L(this,"activeChristmasFilter","all");L(this,"selectedCatalogItem",null);L(this,"rotation",0);L(this,"activeDecorFilter","all");L(this,"recentDecorIds",[]);L(this,"bulldozerActive",!1);L(this,"moveModeActive",!1);L(this,"moveKeepActiveAfterDrop",!1);L(this,"movingBuildingUid",null);L(this,"pincerActive",!1);L(this,"pincerPicked",null);L(this,"seedTrayOpen",!1);L(this,"seedFilterMode","all");L(this,"activeSeedCropId",null);L(this,"pendingSowPlotUid",null);L(this,"pastureTrayOpen",!1);L(this,"activePastureAnimalId",null);L(this,"pendingStockPastureUid",null);L(this,"rideCamUid",null);L(this,"rideCamSpeedText","");L(this,"pendingTouchTile",null);L(this,"onTouchConfirmPlace",null);L(this,"onTouchCancelPlace",null);L(this,"onTouchStashActiveBuilding",null);L(this,"onSelectCatalogItem",null);L(this,"onAutoPlaceSelected",null);L(this,"onBuildStateReset",null);L(this,"onRotateActivePlacement",null);L(this,"onStartMoveBuilding",null);L(this,"onCameraJump",null);L(this,"onFocusGridSmooth",null);L(this,"activeBuildCycleIdx",-1);L(this,"photoModeActive",!1);L(this,"inspectSelection",null);L(this,"minimapCanvas");L(this,"questCollapsed",!1);L(this,"minimapCollapsed",!1);L(this,"manageMenuOpen",!1);L(this,"weatherPopoverOpen",!1);L(this,"mapToolsExpanded",!1);L(this,"buildSheetOpen",!1);L(this,"minimapHudVisible",!1);L(this,"hudRolledUp",!1);L(this,"inspectorCollapsed",!1);L(this,"lastInspectedKey","");L(this,"displayedSickle",-1);L(this,"galleonRollRaf",0);L(this,"activeWorkshopTab","barn");L(this,"selectedStandItemId","ottery_wheat");L(this,"selectedStandPriceTier","fair");L(this,"activeQuestTab","orders");L(this,"activeAlbumTab","cup");L(this,"hasShownHouseCupIntro",!1);L(this,"activeProfileSubTab","login7");L(this,"activeAchievementFilterCat","all");L(this,"selectedOwlOrderId",null);L(this,"lastWsBrewId",null);L(this,"activeSuitcaseTab","care");L(this,"selectedSuitcaseHabitatUid",null);L(this,"useStarlightForIncubation",!0);L(this,"lastSuitcaseIncReady",!1);L(this,"lastSuitcaseExpReady",!1);L(this,"activeNeighborTab","friends");L(this,"focusedNeighborId",null);L(this,"flooDirectoryRows",[]);L(this,"flooQueueRows",[]);L(this,"flooHelpsLeft",null);L(this,"flooLoading",!1);L(this,"flooLastLoadedAt",0);L(this,"flooAutoAdvanceTimer",0);L(this,"flooHelpersToday",[]);L(this,"lastSocialLiveSig","");L(this,"tutorialMinimized",!1);L(this,"lastRenderedTutorialSig","");L(this,"lastFocusedTutorialStepKey","");L(this,"ribbonBannerTimer",0);L(this,"yuleReadySig","");L(this,"drawerEdgeObserver",null);L(this,"dialogOpenObserver",null);L(this,"match3Modal",null);L(this,"puzzleArcadeModal",null);L(this,"leaderboardModal",null);L(this,"match3ModalPromise",null);L(this,"puzzleArcadeModalPromise",null);L(this,"seedQuizModalPromise",null);L(this,"leaderboardModalPromise",null);L(this,"root");L(this,"sprites");this.root=t,this.sim=s,this.cam=o,this.gameCanvas=l,this.sprites=r,this.recentDecorIds=rr(),this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||Ft(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(d=>{for(const a of d)if(a.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll();const n=this.root.querySelector("#match3Dialog"),c=this.root.querySelector("#puzzleArcadeDialog"),i=this.root.querySelector("#seedQuizDialog");window.setInterval(()=>{if(this.match3Modal?.tickLiveHeaderTimer(),n?.open||c?.open||i?.open)return;if(this.refreshHeaderClock(),this.refreshFloatingBanner(),Vn(this),zn(this),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const $=this.sim.state.buildings.find(S=>this.inspectSelection?.kind==="building"&&S.uid===this.inspectSelection.uid),f=$?le($.itemId):void 0,u=Date.now();$&&(u<$.constructEndsAt||$.workshopQueue&&$.workshopQueue.length>0||$.cropId&&$.cropReadyAt&&u<$.cropReadyAt+1200||$.pastureAnimalId&&$.pastureReadyAt&&u<$.pastureReadyAt+1200||f&&f.cycleSec>0&&f.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return cr(this)}clearBuildToolModes(){Le(this)}recordRecentDecorItem(t){const s=le(t);!s||s.category!=="decor"||(this.recentDecorIds=lr(this.recentDecorIds,t))}triggerRotateAction(){if(this.sim.isVisitingNeighbor){this.showToast("Chế độ Khách Tham Quan — không thể xoay công trình vườn bạn!","🏡");return}if(!this.selectedCatalogItem&&!(this.moveModeActive&&this.movingBuildingUid)&&this.inspectSelection?.kind==="building"){const t=this.inspectSelection.uid,s=this.sim.state.buildings.find(r=>r.uid===t),o=s?le(s.itemId):void 0,l=this.sim.rotatePlacedBuilding(t);if(!l.ok){this.showToast(l.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}this.rotation=l.newRotation??this.rotation,this.refreshAll(),this.showToast(`🔄 Đã xoay "${o?.name??"công trình"}" (${(l.newRotation??0)*90}°)`,"🔄");return}this.rotation=(this.rotation+1)%4,this.onRotateActivePlacement?.(),this.refreshDock(),this.refreshFloatingBanner(),this.refreshTouchConfirmBar(),this.showToast(`🔄 Hướng đặt công trình: ${this.rotation*90}°`,"🔄")}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),s=this.root.querySelector("#floatingBannerGrip");if(!t||!s)return;s.classList.remove("hidden");const o=(i,d)=>{t.classList.add("is-floating-dragged");const a=Math.max(0,window.innerWidth-t.offsetWidth),$=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(i,a))}px`,t.style.top=`${Math.max(0,Math.min(d,$))}px`};let l=0,r=0,n=0,c=0;s.addEventListener("pointerdown",i=>{if(i.button!==0)return;const d=t.getBoundingClientRect();l=i.clientX-d.left,r=i.clientY-d.top,n=i.clientX,c=i.clientY,s.setPointerCapture(i.pointerId)}),s.addEventListener("pointermove",i=>{s.hasPointerCapture(i.pointerId)&&(Math.hypot(i.clientX-n,i.clientY-c)>=4&&s.classList.add("dragging"),o(i.clientX-l,i.clientY-r))}),s.addEventListener("lostpointercapture",()=>{s.classList.remove("dragging")}),s.addEventListener("keydown",i=>{let a=0,$=0;if(i.key==="ArrowLeft")a=-15;else if(i.key==="ArrowRight")a=15;else if(i.key==="ArrowUp")$=-15;else if(i.key==="ArrowDown")$=15;else return;i.preventDefault();const f=t.getBoundingClientRect();o(f.left+a,f.top+$)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const i=t.getBoundingClientRect();o(i.left,i.top)}})}installDialogLightDismissFallback(){const t=()=>{const s=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(s)};for(const s of Array.from(this.root.querySelectorAll("dialog")))s.addEventListener("close",()=>{s.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",s=>{const o=s.target;if(o&&typeof o.matches=="function"&&o.matches(".aaa-codex-scroll")){const l=!!s.skipped;o.dataset.cvSkipped=l?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const s=new IntersectionObserver(o=>{for(const l of o)l.target.dataset.cvSkipped=l.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const o of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))s.observe(o)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const s=(o,l)=>{const r=l.getBoundingClientRect();return o.clientX<r.left||o.clientX>r.right||o.clientY<r.top||o.clientY>r.bottom};for(const o of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let l=!1;o.addEventListener("pointerdown",r=>{l=s(r,o)}),o.addEventListener("pointerup",r=>{l&&s(r,o)&&o.close()})}}}wireRangeProgressFallback(t){const s=()=>{const o=Number(t.min||0),l=Number(t.max||100),r=Number(t.value||0),n=Math.round((r-o)/Math.max(1,l-o)*100);t.style.setProperty("--progress",`${n}%`)};s(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",s)}togglePhotoMode(t){return vr(this,t)}openNeighborDialog(t,s){return gi(this,t,s)}openHarvestFeastDialog(){return Vr(this)}refreshHarvestFeastBadges(){return zr(this)}showRibbonUnveilBanner(t){return Ur(this,t)}renderHarvestFeastDialog(){return ti(this)}openMinigameRescue(t){return ui(this,t)}enterVisitFromHud(t){return mi(this,t)}enterHonorTourFromHud(t){return Zs(this,t)}enterFlooMemberVisitFromHud(t,s){return Vt(this,t,s)}refreshFlooDirectoryFromHud(t){return ys(this,t)}applyAuthoritativeSnapshot(t){pi(this,t)}exitVisitFromHud(){return Xs(this)}isBuildingFocusMode(){return Rn(this)}toggleHudRollup(t){return yr(this,t)}syncHudFocusVisibility(){return ws(this)}openWorkshopDialog(t){return Na(this,t)}jumpToMissingFarmItem(t){const s=this.sim.locateItemSource(t);if(this.showToast(s.msg,s.kind==="workshop"?"🔥":s.kind==="pasture"?"🐾":"🌱"),typeof s.gx=="number"&&typeof s.gy=="number"&&(this.onFocusGridSmooth?this.onFocusGridSmooth(s.gx,s.gy,1.05):Be(this.cam,s.gx,s.gy)),s.kind==="plot"&&s.cropId){const o=s.uid?this.sim.state.buildings.find(l=>l.uid===s.uid):void 0;o&&!o.cropId?this.openSeedTray(s.cropId,o.uid):o&&(this.inspectSelection={kind:"building",uid:o.uid},this.refreshAll())}else if(s.kind==="pasture"&&s.uid){const o=this.sim.state.buildings.find(l=>l.uid===s.uid);o&&!o.pastureAnimalId&&s.animalId?this.openPastureTray(s.animalId,o.uid):o&&(this.inspectSelection={kind:"building",uid:o.uid},this.refreshAll())}else s.kind==="workshop"&&s.uid&&(this.inspectSelection={kind:"building",uid:s.uid},this.refreshAll())}openSuitcaseDialog(t,s){return Kr(this,t,s)}getSeedQuizModal(){return this.seedQuizModalPromise??(this.seedQuizModalPromise=Ft(async()=>{const{SeedQuizModalController:t}=await import("./seedQuizModal-DtW4AwJK.js");return{SeedQuizModalController:t}},__vite__mapDeps([0,1,2,3,4,5])).then(({SeedQuizModalController:t})=>{const s=new t(this.root,this.sim,()=>this.refreshAll(),(o,l)=>this.showToast(o,l),(o,l)=>{const r=tt[o];if(l){const c=this.sim.state.buildings.find(i=>i.uid===l);if(c&&le(c.itemId)?.isFarmlandPlot&&!c.cropId){const i=this.sim.plantCropOnPlot(c.uid,o),d=!!this.sim.state.sandboxMode||this.sim.getSeedCount(o)>0;this.activeSeedCropId=i.ok&&d?o:null,this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(i.msg,i.ok?"🌱":"🪙"),this.refreshAll();return}}const n=!!this.sim.state.sandboxMode||this.sim.getSeedCount(o)>0;this.activeSeedCropId=n?o:null,this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.activeSeedCropId&&this.showToast(`${r.name} · ${this.sim.getSeedCount(o)} hạt · chạm hoặc kéo qua ô đất trống để gieo`,r.emoji)});return s.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),s}).catch(t=>{throw this.seedQuizModalPromise=null,console.error(t),this.showToast("Chưa mở được Học Viện — hãy bấm lại nhé."),t})),this.seedQuizModalPromise}getLeaderboardModal(){return this.leaderboardModalPromise??(this.leaderboardModalPromise=Ft(async()=>{const{LeaderboardModalController:t}=await import("./leaderboardModal-BsTCni7F.js");return{LeaderboardModalController:t}},__vite__mapDeps([6,4,2,1])).then(({LeaderboardModalController:t})=>{const s=new t(this.root,this.sim);return this.leaderboardModal=s,s.onJumpToGame=o=>{const l=this.root.querySelector("#match3Dialog"),r=this.root.querySelector("#puzzleArcadeDialog"),n=this.root.querySelector("#seedQuizDialog");o==="match3"?(r?.close(),n?.close(),this.openMatch3Dialog()):o==="seedquiz"?(l?.close(),r?.close(),this.openSeedQuizDialog()):(l?.close(),n?.close(),this.openPuzzleArcadeDialog(o))},s.onVisitNeighbor=o=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(o)},s.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},s}).catch(t=>{throw this.leaderboardModalPromise=null,console.error(t),this.showToast("Chưa mở được Bảng Xếp Hạng — hãy bấm lại nhé."),t})),this.leaderboardModalPromise}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=Ft(async()=>{const{Match3ModalController:t}=await import("./match3Modal-D4SMxqUf.js");return{Match3ModalController:t}},__vite__mapDeps([7,8,9,1,4,2,3,10])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(s,o)=>this.showToast(s,o),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=s=>this.openPuzzleArcadeDialog(s),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal)).catch(t=>{throw this.match3ModalPromise=null,console.error(t),this.showToast("Chưa mở được màn chơi — hãy bấm lại nhé."),t})),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=Ft(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-h2lh13nQ.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([11,8,9,1,2,3,4])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(s,o)=>this.showToast(s,o),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=s=>this.openLeaderboardDialog(s),this.puzzleArcadeModal)).catch(t=>{throw this.puzzleArcadeModalPromise=null,console.error(t),this.showToast("Chưa mở được màn chơi — hãy bấm lại nhé."),t})),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,s){this.closeHudPopovers(),this.root.querySelector("#neighborDialog")?.close();const o=t??this.sim.getLastPlayedMinigame();this.activeAlbumTab="leaderboard",this.getLeaderboardModal().then(l=>{l.configure(o,s),this.renderAlbumDialog();const r=this.root.querySelector("#albumDialog");r&&!r.open&&r.showModal(),l.syncCloud()},()=>{})}openMatch3Dialog(t,s=!1){this.closeHudPopovers(),this.hideOpenFloatingTrays(),this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(o=>{o.open(t,s),_s(this)},()=>{})}openPuzzleArcadeDialog(t){this.closeHudPopovers(),this.hideOpenFloatingTrays(),t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(s=>{s.open(t),_s(this)},()=>{})}openSeedQuizDialog(t,s,o,l,r,n){this.closeHudPopovers(),this.hideOpenFloatingTrays(),s||this.sim.setLastPlayedMinigame("seedquiz"),this.getSeedQuizModal().then(c=>{c.open(t,s,o,l,r,n),_s(this)},()=>{})}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return as(this)}collapseBuildDock(){return Ht(this)}hasOpenFloatingTray(){return Nn(this)}hideOpenFloatingTrays(){return Fn(this)}positionFloatingPopover(t,s){return Ha(this,t,s)}toggleManagePopover(t){return Sr(this,t)}toggleWeatherPopover(t){return wr(this,t)}renderWeatherPopover(){return qa(this)}animateSickleTo(t){return On(this,t)}spawnFlyReward(t,s,o,l){return xr(this,t,s,o,l)}bindEvents(){return dr(this)}showToast(t,s="🦉"){return yt(this,t,s)}showOfflineModal(t){return $r(this,t)}refreshFloatingBanner(){return Da(this)}openSeedTray(t,s){return Qn(this,t,s)}closeSeedTray(){return _t(this)}toggleSeedTray(){return Mr(this)}openPastureTray(t,s){return Xn(this,t,s)}closePastureTray(){return ss(this)}togglePastureTray(){return Ar(this)}renderSeedTray(){return Yn(this)}renderPastureTray(){return Lr(this)}askConfirm(t){const s=this.root.querySelector("#confirmDialog");return s.querySelector("#confirmDialogText").textContent=t,new Promise(o=>{let l=!1;s.querySelector("#btnConfirmDelete").onclick=()=>{l=!0,s.close()},s.querySelector("#btnConfirmKeep").onclick=()=>s.close(),s.onclose=()=>{s.onclose=null,o(l)},s.showModal()})}refreshTouchConfirmBar(){return Ra(this)}refreshAll(){return ts(this)}refreshHeaderClock(){return Un(this)}refreshHeader(){return Gn(this)}syncProgressiveHudVisibility(){return Wn(this)}refreshQuestTracker(){return jn(this)}refreshDock(){return Ks(this)}renderStaffDrawer(t){return Kn(this,t)}syncContextualMapToolsBar(){return Cr(this)}renderInspector(){return Me(this)}renderFinanceDialog(){return Gr(this)}openHouseCupIntroDialog(){return oi(this)}renderHouseCupIntroDialog(){return Ga(this)}renderAlbumDialog(){return dt(this)}renderQuestDialog(){return vt(this)}renderRoadmapDialog(){return ka(this)}updateWorkshopLiveTimers(){return Pr(this)}renderWorkshopDialog(){return De(this)}renderSettingsDialog(){return Je(this)}refreshSuitcaseBadge(){return Qr(this)}updateSuitcaseLiveTimers(){return Xr(this)}renderSuitcaseDialog(){return Ke(this)}syncLiveNeighborSocialUI(){return sl(this)}refreshNeighborBadges(){return bi(this)}renderVisitorDockBar(){return al(this)}renderNeighborDialog(){return Ue(this)}panCameraToTutorialTarget(){return us(this)}resolveTutorialHudTarget(){return fi(this)}updateTutorialHudSpotlight(){return La(this)}hideTutorialPopover(t){return vi(this,t)}showTutorialPopover(t){return yi(this,t)}renderTutorialCoach(){return Ss(this)}handleTutorialPrimaryAction(t){return Si(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Ps.colorblindMode,fontScale:t?.fontScale??Ps.fontScale,highContrast:t?.highContrast??Ps.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Ps.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();Uo(t),this.sim.audio?.ceiling&&Go(t,this.sim.audio)}playStoryCutscene(t){const s=Pn.find(l=>l.id===t);if(!s)return;if(this.sim.state.level<s.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${s.unlockLevel} để mở khoá ${s.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${s.titleVi}`,"🎬");let o=120;s.keyframes.forEach((l,r)=>{window.setTimeout(()=>{Be(this.cam,l.cameraFocusGx,l.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${l.captionVi}`,r===s.keyframes.length-1?"✨":"🕯️"),s.chapterNumber===3&&r===s.keyframes.length-1&&this.sim.launchFireworksShow(10)},o),o+=l.durationMs})}}class il{constructor(){L(this,"unhandledErrors",0);L(this,"fpsSamples",[]);L(this,"assetLoadLatencyMs",0);L(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const s=Math.max(1,Math.min(240,t));this.fpsSamples.push(s),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,s={},o=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:s,queuedAt:o})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const s=[...this.offlineQueue];return t(s)?(this.offlineQueue=[],s.length):0}getHealthReport(){const t=this.fpsSamples.length;let s=60,o=60;if(t>0){const l=this.fpsSamples.reduce((c,i)=>c+i,0);s=Number((l/t).toFixed(1));const r=[...this.fpsSamples].sort((c,i)=>c-i),n=Math.max(0,Math.floor((t-1)*.05));o=Number(r[n].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:s,p5LowFps:o,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}const Sn=900*1e3;function ol(e,t,s=Date.now(),o=e){if(!Array.isArray(t))return[];const l=t.filter(r=>Number.isSafeInteger(r?.seq)&&r.seq>(e.hpvnInboxSeq??0)).sort((r,n)=>r.seq-n.seq);for(const r of l){if(r.kind==="sickles"||r.kind==="cup")Number.isSafeInteger(r.sickle)&&r.sickle>0&&(o.galleons+=r.sickle),r.kind==="cup"&&Number.isSafeInteger(r.sand)&&r.sand>0&&(o.timeSand+=r.sand);else if(r.kind==="help")for(const n of e.buildings)n.needsTreeRevival?(n.needsTreeRevival=!1,n.orchardHarvestsUsed=0,n.readyFruitCrops=[...n.readyFruitCrops??[],"burrow_apple"],n.readyBubbles=Math.max(1,n.readyBubbles)):n.cropId&&n.cropReadyAt&&s<n.cropReadyAt?(n.cropWateredBoost=!0,n.cropReadyAt=Math.max(s+3e4,n.cropReadyAt-Sn)):n.workshopQueue?.length&&s<n.workshopQueue[0].endsAt&&(n.workshopQueue[0].endsAt=Math.max(s+2e4,n.workshopQueue[0].endsAt-Sn));e.hpvnInboxSeq=r.seq}return l}const _e=160,ht=480,Pt=32,rl={galleons:0,stars:1,sand:2,xp:3},wn=["#fbbf24","#fde047","#38bdf8","#a78bfa"],xn=["rgba(251, 191, 36, 0.45)","rgba(253, 224, 71, 0.52)","rgba(56, 189, 248, 0.45)","rgba(167, 139, 250, 0.45)"],ll=["🪙","🌟","⏳","✨"];class cl{constructor(t,s={}){L(this,"root");L(this,"cb");L(this,"canvas",null);L(this,"ctx",null);L(this,"rafId",null);L(this,"lastTs",0);L(this,"arrivalSeq",0);L(this,"fActive",new Uint8Array(_e));L(this,"fKind",new Uint8Array(_e));L(this,"fAge",new Float32Array(_e));L(this,"fDur",new Float32Array(_e));L(this,"fDelay",new Float32Array(_e));L(this,"fP0x",new Float32Array(_e));L(this,"fP0y",new Float32Array(_e));L(this,"fP1x",new Float32Array(_e));L(this,"fP1y",new Float32Array(_e));L(this,"fP2x",new Float32Array(_e));L(this,"fP2y",new Float32Array(_e));L(this,"fP3x",new Float32Array(_e));L(this,"fP3y",new Float32Array(_e));L(this,"fTrailAccum",new Float32Array(_e));L(this,"mActive",new Uint8Array(ht));L(this,"mKind",new Uint8Array(ht));L(this,"mX",new Float32Array(ht));L(this,"mY",new Float32Array(ht));L(this,"mVx",new Float32Array(ht));L(this,"mVy",new Float32Array(ht));L(this,"mAge",new Float32Array(ht));L(this,"mDur",new Float32Array(ht));L(this,"mSize",new Float32Array(ht));L(this,"rActive",new Uint8Array(Pt));L(this,"rKind",new Uint8Array(Pt));L(this,"rX",new Float32Array(Pt));L(this,"rY",new Float32Array(Pt));L(this,"rAge",new Float32Array(Pt));L(this,"rDur",new Float32Array(Pt));L(this,"flyerCursor",0);L(this,"moteCursor",0);L(this,"ringCursor",0);L(this,"lastPulseByKind",new Map);this.root=t,this.cb=s}isReducedMotion(){return typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}ensureCanvas(){if(typeof document>"u")return null;if(!this.canvas||!this.canvas.isConnected){const s=document.getElementById("aaaFlyCollectiblesCanvas")??document.createElement("canvas");s.id="aaaFlyCollectiblesCanvas",s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9400;",s.isConnected||document.body.appendChild(s),this.canvas=s,this.ctx=s.getContext("2d"),this.syncCanvasSize()}return this.ctx}syncCanvasSize(){if(!this.canvas||typeof window>"u")return;const t=Math.min(2,window.devicePixelRatio||1),s=Math.max(1,Math.floor(window.innerWidth*t)),o=Math.max(1,Math.floor(window.innerHeight*t));(this.canvas.width!==s||this.canvas.height!==o)&&(this.canvas.width=s,this.canvas.height=o)}resolveTargetCenter(t){const s=this.root.querySelector(`[data-fly-target="${t}"]`);if(!s)return null;const o=s.getBoundingClientRect();return o.width<=0&&o.height<=0?null:{x:o.left+o.width*.5,y:o.top+o.height*.5,el:s}}pulseHudTarget(t){const s=this.root.querySelector(`[data-fly-target="${t}"]`);if(!s)return;const o=typeof performance<"u"?performance.now():Date.now(),l=this.lastPulseByKind.get(t)??0;o-l<120||(this.lastPulseByKind.set(t,o),typeof s.animate=="function"?s.animate([{transform:"scale(1)"},{transform:"scale(1.15)"},{transform:"scale(1)"}],{duration:220,easing:"ease-out"}):s.classList.add("hud-chip-pulse"))}spawnBurstToHud(t,s,o,l){const r=this.resolveTargetCenter(t);if(!r)return!1;if(this.isReducedMotion())return this.pulseHudTarget(t),this.cb.onArrival?.(t,0),!0;if(!this.ensureCanvas()||typeof window>"u")return!1;this.syncCanvasSize();const c=typeof o=="number"&&Number.isFinite(o)?Math.max(20,Math.min(window.innerWidth-20,o)):window.innerWidth*.5,i=typeof l=="number"&&Number.isFinite(l)?Math.max(20,Math.min(window.innerHeight-20,l)):window.innerHeight*.54,d=t==="stars"||t==="sand"?Math.min(6,Math.max(1,Math.round(s))):Math.min(8,Math.max(2,Math.ceil(Math.log2(Math.max(2,s))))),a=rl[t];for(let $=0;$<d;$++){const f=this.allocFlyerSlot(),u=Math.PI*2*$/d+(Math.random()-.5)*.5,S=18+Math.random()*26,w=c+Math.cos(u)*6,I=i+Math.sin(u)*6,q=($%2===0?1:-1)*(28+Math.random()*44),P=c+Math.cos(u)*S+q,h=i-36-Math.random()*42,k=w+(r.x-w)*.62+q*.35,p=Math.min(i,r.y)-18+(r.y-i)*.32;this.fActive[f]=1,this.fKind[f]=a,this.fAge[f]=0,this.fDur[f]=.52+Math.min(.22,$*.032)+Math.random()*.05,this.fDelay[f]=$*.036,this.fP0x[f]=w,this.fP0y[f]=I,this.fP1x[f]=P,this.fP1y[f]=h,this.fP2x[f]=k,this.fP2y[f]=p,this.fP3x[f]=r.x,this.fP3y[f]=r.y,this.fTrailAccum[f]=0}return this.spawnMoteCluster(a,c,i,6,75),this.ensureLoop(),!0}allocFlyerSlot(){for(let s=0;s<_e;s++){const o=(this.flyerCursor+s)%_e;if(this.fActive[o]===0)return this.flyerCursor=(o+1)%_e,o}const t=this.flyerCursor;return this.flyerCursor=(t+1)%_e,t}spawnMote(t,s,o,l,r,n,c){const i=this.moteCursor;this.moteCursor=(i+1)%ht,this.mActive[i]=1,this.mKind[i]=t,this.mX[i]=s,this.mY[i]=o,this.mVx[i]=l,this.mVy[i]=r,this.mAge[i]=0,this.mDur[i]=c,this.mSize[i]=n}spawnMoteCluster(t,s,o,l,r){for(let n=0;n<l;n++){const c=Math.PI*2*n/l+(Math.random()-.5)*.4,i=r*(.45+Math.random()*.65);this.spawnMote(t,s,o,Math.cos(c)*i,Math.sin(c)*i,2.2+Math.random()*2.3,.24+Math.random()*.16)}}spawnRing(t,s,o){const l=this.ringCursor;this.ringCursor=(l+1)%Pt,this.rActive[l]=1,this.rKind[l]=t,this.rX[l]=s,this.rY[l]=o,this.rAge[l]=0,this.rDur[l]=.28}ensureLoop(){if(this.rafId!==null||typeof requestAnimationFrame>"u")return;this.lastTs=performance.now();const t=s=>{const o=Math.min(.05,Math.max(.001,(s-this.lastTs)/1e3));this.lastTs=s,this.tickAndRender(o)?this.rafId=requestAnimationFrame(t):this.rafId=null};this.rafId=requestAnimationFrame(t)}getActiveCount(){let t=0;for(let s=0;s<_e;s++)this.fActive[s]===1&&t++;return t}tickAndRender(t){const s=this.ctx,o=this.canvas;if(!s||!o)return!1;const l=Math.min(2,(typeof window<"u"?window.devicePixelRatio:1)||1);s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,o.width,o.height),s.setTransform(l,0,0,l,0,0);let r=!1;for(let c=0;c<ht;c++){if(this.mActive[c]===0)continue;const i=this.mAge[c]+t,d=this.mDur[c];if(i>=d){this.mActive[c]=0;continue}r=!0,this.mAge[c]=i,this.mX[c]=this.mX[c]+this.mVx[c]*t,this.mY[c]=this.mY[c]+this.mVy[c]*t;const a=i/d,$=(1-a)*(1-a),f=this.mSize[c]*(1-a*.45);s.globalAlpha=$*.9,s.fillStyle=wn[this.mKind[c]]??"#fbbf24",s.beginPath(),s.arc(this.mX[c],this.mY[c],f,0,Math.PI*2),s.fill()}for(let c=0;c<Pt;c++){if(this.rActive[c]===0)continue;const i=this.rAge[c]+t,d=this.rDur[c];if(i>=d){this.rActive[c]=0;continue}r=!0,this.rAge[c]=i;const a=i/d,f=8+(1-Math.pow(1-a,2.2))*22;s.globalAlpha=(1-a)*.85,s.strokeStyle=wn[this.rKind[c]]??"#fbbf24",s.lineWidth=2.4*(1-a*.6),s.beginPath(),s.arc(this.rX[c],this.rY[c],f,0,Math.PI*2),s.stroke()}s.textAlign="center",s.textBaseline="middle";const n=["galleons","stars","sand","xp"];for(let c=0;c<_e;c++){if(this.fActive[c]===0)continue;if(r=!0,this.fDelay[c]>0){this.fDelay[c]=Math.max(0,this.fDelay[c]-t);continue}const i=this.fAge[c]+t,d=this.fDur[c],a=this.fKind[c];if(i>=d){this.fActive[c]=0;const g=this.fP3x[c],b=this.fP3y[c];this.spawnRing(a,g,b),this.spawnMoteCluster(a,g,b,7,92);const v=n[a]??"galleons";this.pulseHudTarget(v),this.arrivalSeq=(this.arrivalSeq+1)%8,this.cb.onArrival?.(v,this.arrivalSeq);continue}this.fAge[c]=i;const $=i/d,f=$<.35?1-Math.pow(1-$/.35,1.8)*.68-.32*(1-$/.35):.32+Math.pow(($-.35)/.65,1.55)*.68,u=Math.max(0,Math.min(1,f)),S=1-u,w=S*S*S,I=3*S*S*u,q=3*S*u*u,P=u*u*u,h=w*this.fP0x[c]+I*this.fP1x[c]+q*this.fP2x[c]+P*this.fP3x[c],k=w*this.fP0y[c]+I*this.fP1y[c]+q*this.fP2y[c]+P*this.fP3y[c];this.fTrailAccum[c]=this.fTrailAccum[c]+t,this.fTrailAccum[c]>=.024&&(this.fTrailAccum[c]=0,this.spawnMote(a,h+(Math.random()-.5)*5,k+(Math.random()-.5)*5,(Math.random()-.5)*20,12+Math.random()*18,2.1+Math.random()*1.4,.2));const p=$<.18?.65+$/.18*.52:1.17-($-.18)/.82*.28;s.globalAlpha=1,s.fillStyle=xn[a]??xn[0],s.beginPath(),s.arc(h,k,12*p,0,Math.PI*2),s.fill(),s.font=`${Math.round(20*p)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,s.fillText(ll[a]??"🪙",h,k+1)}return s.globalAlpha=1,r}dispose(){this.rafId!==null&&typeof cancelAnimationFrame<"u"&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.fActive.fill(0),this.mActive.fill(0),this.rActive.fill(0),this.canvas?.isConnected&&this.canvas.remove(),this.canvas=null,this.ctx=null}}const ct=Cn,dl=e=>ct(e);async function pl(){const e=document.getElementById("app");Fo(),fr(),document.addEventListener("focusin",m=>{const y=m.target,C=y.closest?.("input:not([type=checkbox], [type=radio], [type=range]), textarea")?y.closest("dialog [id$='DialogContent']"):null;C&&matchMedia("(pointer: coarse)").matches&&(C.scrollTop+=y.getBoundingClientRect().top-C.getBoundingClientRect().top-8)}),Oo();const t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const s=document.createElement("canvas");if(s.id="gameCanvas",s.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(s),!js)throw Object.assign(new Error("Hãy mở Trang Trại Hang Sóc từ Phòng Sinh Hoạt Chung trên HPVN."),{hpvn:!0});const o=await Co();fa||Io({read:()=>o,write:Bo});const l=new Mo,r=new _o;await r.loadAll();const n=new Ao(l);typeof n.state.settings.toonEnabled=="boolean"&&r.setToonEnabled(n.state.settings.toonEnabled);const c={gryffindor:"Gryffindor",slytherin:"Slytherin",ravenclaw:"Ravenclaw",hufflepuff:"Hufflepuff"}[String(js.house).toLowerCase()];c&&n.lockPlayerHouse(c);const i={x:0,y:0,zoom:.82,viewRot:0};Be(i,18,24.5);const d=new Vo(s,r);r.onBatchLoaded(()=>{d.groundCacheKey=""});const a=new nl(e,n,i,s,r),$=e.querySelector(".ts-hud-topleft");$&&!fa&&Lo($),ra.init(n),Ho(m=>{m==="replaced"?Pa("Bạn đang chơi Trang Trại Hang Sóc ở nơi khác","Trang trại này không lưu nữa. Tải lại để chơi tiếp ở đây."):m==="too-big"?a.showToast("Trang trại quá lớn để lưu lên HPVN, hãy dọn bớt đồ trang trí.","⚠️"):m==="error"&&a.showToast("Chưa lưu được lên HPVN, sẽ thử lại.","⚠️")}),Po(m=>{const y=ol(n.homeStateWhileVisiting??n.state,m,Date.now(),n.state);if(!y.length)return;const C=y.reduce((R,W)=>R+(W.kind==="sickles"?W.sickle??0:0),0);C&&a.showToast(`Gringotts đã chuyển ${C.toLocaleString("vi-VN")} Sickle vào trang trại!`,"🏦");const G=y.filter(R=>R.kind==="cup"),D=G.reduce((R,W)=>R+(Number.isSafeInteger(W.sickle)&&W.sickle>0?W.sickle:0),0),ne=G.reduce((R,W)=>R+(Number.isSafeInteger(W.sand)&&W.sand>0&&Number.isSafeInteger(W.sickle)&&W.sickle>0?W.sand:0),0);n.creditVerifiedInboxGrant(C+D,ne);const ae=y.filter(R=>R.kind==="help");for(const R of ae)a.flooHelpersToday.push({uid:R.uid??"",name:R.name??"",avatarUrl:R.avatarUrl,at:R.at});ae.length&&a.showToast(`${ae[0].name}${ae.length>1?` +${ae.length-1} bạn`:""} chăm giúp · cây chín sớm 15 phút`,"🤝");for(const R of y)R.kind==="fire-out"&&a.showToast(`${R.name} đã dập lửa giúp trang trại!`,"🧯");for(const R of G)Number.isSafeInteger(R.xp)&&R.xp>0&&n.addXp(R.xp);if(G.length){const R=Q=>Number.isSafeInteger(Q)&&Q>0,W=Q=>G.reduce((ie,Ee)=>ie+(R(Ee[Q])&&(Q!=="sand"||R(Ee.sickle))?Ee[Q]:0),0),N=[...new Set(G.map(Q=>Q.tier).filter(Q=>R(Q)))].sort((Q,ie)=>Q-ie).join(", "),X=[["sickle","Sickle"],["xp","XP"],["sand","Cát"]].map(([Q,ie])=>[W(Q),ie]).filter(([Q])=>Q>0).map(([Q,ie])=>`+${Q.toLocaleString("vi-VN")} ${ie}`);a.showToast([N?`Cúp Đợt ${N}`:"Cúp Đợt",...X].join(" · "),"🏆")}n.saveToStorage(),(C||y.some(R=>R.kind==="cup"))&&Rs(),a.refreshAll()});const f=new URLSearchParams("");let u=null,S=null,w=null,I=!1;const q={x:0,y:0,moved:!1},P={wx:0,wy:0,active:!1},h=()=>{window.addEventListener("pointermove",m=>{q.x=m.clientX,q.y=m.clientY,q.moved=!0},{passive:!0})};try{const{WebGL2WorldRenderer:m}=await Ft(async()=>{const{WebGL2WorldRenderer:C}=await import("./webgl2WorldRenderer-BEz9ulJA.js");return{WebGL2WorldRenderer:C}},__vite__mapDeps([12,1,4,2])),y=document.createElement("canvas");y.id="gpuWorldCanvas",y.setAttribute("aria-hidden","true"),y.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0;display:block;",s.insertAdjacentElement("beforebegin",y),u=new m(y,r),S=y,w={mode:(n.state.settings.rendererMode??"webgl2")==="canvas"?"canvas":"webgl2",splitRatio:.5,qualityTier:pn()?"medium":"high",lumosWandEnabled:!1,windStrength:1.15,bloomIntensity:.72,normalStrength:1.12},w.mode==="webgl2"?(s.style.position="relative",s.style.zIndex="1",s.style.background="transparent"):y.style.display="none",h(),window.addEventListener("hangsoc:toon-changed",()=>{d.groundCacheKey="",u?.invalidateSpriteAtlas()})}catch(m){console.warn("[WebGL2 Engine] Thiết bị không hỗ trợ WebGL2, tự động fallback về Canvas2D:",m),S?.remove(),S=null,u=null,w=null,I=!0,n.state.settings.rendererMode="canvas"}const k=!!(f.get("preview")==="100"||f.get("visit")||f.get("tour")||f.get("zoom")||f.get("cx")||f.get("cy")||f.get("ridecam")==="1");let p=null;const g=new zo;if(a.onCameraJump=()=>{p=null,g.cancel()},a.onFocusGridSmooth=(m,y,C)=>{p=null,a.rideCamUid=null,g.panToGrid(i,m,y,{targetZoom:C,durationMs:480,reducedMotion:d.reducedMotion})},!k&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const m=i.x,y=i.y,C=i.zoom;Be(i,17.5,24),i.zoom=.76,p={startMs:performance.now(),durationMs:1450,fromX:i.x,fromY:i.y,fromZoom:i.zoom,toX:m,toY:y,toZoom:C}}const b=!1;if(f.get("preview")==="100"&&b){n.toggleHeadmasterPreview(100),!f.get("tutorial")&&n.isTutorialActive()&&n.skipTutorial();const m=Number(f.get("zoom")||.62);i.zoom=Number.isFinite(m)&&m>=.32&&m<=2.15?m:.62;const y=Number(f.get("cx")),C=Number(f.get("cy")),G=Number.isFinite(y)&&f.get("cx")?y:24.5,D=Number.isFinite(C)&&f.get("cy")?C:23;Be(i,G,D)}const v=f.get("tutorial");v==="1"||v==="reset"?(n.restartTutorial(),a.tutorialMinimized=!1):(v==="0"||v==="off")&&n.isTutorialActive()&&n.skipTutorial();const T=f.get("tstep");if(T!==null&&b){const m=Math.max(0,Math.min(Gs.length-1,Number(T)||0)),y=n.ensureTutorialState();y.active=!0,delete y.completedAt,y.skipped=!1,y.stepIndex=m,y.stepId=Gs[m].id,y.pastureHarvestedInStep3=!1,y.minimized=!1,a.tutorialMinimized=!1}const F=Number(f.get("rot")||0);if(F>=1&&F<=3)for(let m=0;m<F;m++)cs(i,1);f.get("cutaway")==="1"&&(n.state.settings.cutawayMode=!0);const A=f.get("time");(A==="night"||A==="day"||A==="dusk"||A==="dawn")&&(n.state.settings.timeOverride=A);const H=f.get("weather");if((H==="auto"||H==="clear"||H==="cloudy"||H==="rain"||H==="storm"||H==="snow"||H==="fog"||H==="fireflies")&&(n.state.settings.weatherOverride=H),f.get("zoom")&&f.get("preview")!=="100"){const m=Number(f.get("zoom"));Number.isFinite(m)&&m>=.32&&m<=2.15&&(i.zoom=m)}if((f.get("cx")||f.get("cy"))&&f.get("preview")!=="100"){const m=Number(f.get("cx")),y=Number(f.get("cy")),C=Number.isFinite(m)&&f.get("cx")?m:18,G=Number.isFinite(y)&&f.get("cy")?y:24.5;Be(i,C,G)}const K=f.get("heatmap");if(K&&(n.heatmapMode=K),f.get("fireworks")==="1"&&n.launchFireworksShow(12),f.get("ridecam")==="1"){const m=n.state.buildings.find(y=>le(y.itemId)?.isCustomCoasterStation);m&&(a.rideCamUid=m.uid)}const V=f.get("dialog");if(V==="album"){const m=f.get("tab");(m==="profile"||m==="cup"||m==="leaderboard")&&(a.activeAlbumTab=m);const y=f.get("psub");(y==="login7"||y==="achievements"||y==="friendship")&&(a.activeProfileSubTab=y),document.getElementById("btnOpenAlbum")?.click()}else if(V==="finance")document.getElementById("btnOpenFinance")?.click();else if(V==="orders"||V==="quests"||V==="yule")V==="yule"?(a.activeQuestTab="quests",a.renderQuestDialog(),document.getElementById("questDialog")?.showModal()):document.getElementById("btnOpenQuests")?.click();else if(V==="barn")a.openWorkshopDialog("barn");else if(V==="market")a.openWorkshopDialog("market");else if(V==="seeds"){const m=f.get("sfilter");(m==="flowers"||m==="crops"||m==="all")&&(a.seedFilterMode=m),a.openSeedTray()}else if(V==="pasture")a.openPastureTray();else if(V==="seedquiz"){const m=f.get("crop")??void 0,y=f.get("lang")??void 0,C=f.get("tier")??void 0,G=f.get("qformat")??void 0,D=f.get("sqtab"),ne=D==="codex"||D==="practice"?D:void 0;a.openSeedQuizDialog(m,null,y,C,G,ne)}else if(V==="bakery"){const m=n.state.buildings.find(y=>y.itemId==="molly_apple_bakery");m&&(a.inspectSelection={kind:"building",uid:m.uid}),a.openWorkshopDialog("brew")}else if(V==="workshop"){const m=f.get("tab")??"barn";a.openWorkshopDialog(m)}else if(V==="suitcase"){const m=f.get("tab")??"care";a.openSuitcaseDialog(m)}else if(V==="match3"){const m=Number(f.get("m3level")||0),y=b?7777:Math.min(7777,(n.state.match3.maxClearedLevel??0)+1),C=Number.isFinite(m)&&m>=1?Math.min(y,Math.floor(m)):void 0,G=!!(b&&C&&C>(n.state.match3.maxClearedLevel??0)+1);a.openMatch3Dialog(C,G)}else if(V==="puzzle"||V==="caro"||V==="mines"||V==="minesweeper"||V==="domin"||V==="sudoku"||V==="chess"||V==="fishing"||V==="fish"||V==="banca"||V==="blocks"||V==="jigsaw"||V==="pikachu"||V==="onet"){const m=V==="puzzle"?f.get("pmode"):V,y=m==="pikachu"||m==="onet"?"blocks":m==="mines"||m==="minesweeper"||m==="domin"?"caro":m==="fishing"||m==="fish"||m==="banca"?"chess":m,C=y==="caro"||y==="sudoku"||y==="chess"||y==="blocks"||y==="jigsaw"?y:void 0;a.openPuzzleArcadeDialog(C)}else if(V==="neighbors"||V==="friends")a.openNeighborDialog();else if(V==="feast")a.openHarvestFeastDialog();else if(V==="cupinfo")a.openHouseCupIntroDialog();else if(V==="leaderboard"){const m=f.get("lbgame"),y=m==="pikachu"||m==="onet"?"blocks":m==="2048"||m==="9x9"?"sudoku":m==="ghep-tranh"?"jigsaw":m==="mines"||m==="domin"||m==="minesweeper"?"caro":m==="fish"||m==="fishing"||m==="banca"?"chess":m,C=y==="match3"||y==="caro"||y==="sudoku"||y==="chess"||y==="blocks"||y==="jigsaw"||y==="seedquiz"?y:void 0,G=f.get("lbscope"),D=G==="valley"||G==="friends"||G==="personal"?G:void 0;a.openLeaderboardDialog(C,D)}else if(!f.get("tour")&&!f.get("visit")&&!n.isHeadmasterPreview)try{const m=n.state.activeMinigameResume;if(m){const y=Date.now()-Number(m.savedAt||0),C=n.state.puzzleArcade;y>=0&&y<=12*3600*1e3?m.dialog==="puzzleArcade"&&m.mode==="sudoku"&&C.sudokuSession?.stage===C.sudokuStage&&C.sudokuSession.status!=="lost"?a.openPuzzleArcadeDialog("sudoku"):m.dialog==="puzzleArcade"&&m.mode==="caro"&&C.minesSession?.stage===C.caroStage&&C.minesSession.status!=="lost"?a.openPuzzleArcadeDialog("caro"):m.dialog==="puzzleArcade"&&m.mode==="chess"&&C.fishingSession?.stage===C.chessStage&&C.fishingSession.status!=="lost"?a.openPuzzleArcadeDialog("chess"):m.dialog==="puzzleArcade"&&m.mode==="blocks"&&C.onetSession?.stage===C.blockStage&&C.onetSession.status!=="lost"?a.openPuzzleArcadeDialog("blocks"):m.dialog==="puzzleArcade"&&m.mode==="jigsaw"&&C.jigsawSession?.stage===C.jigsawStage&&C.jigsawSession.status!=="lost"?a.openPuzzleArcadeDialog("jigsaw"):m.dialog==="match3"&&n.state.match3.activeSession?.levelId===n.state.match3.currentLevel?a.openMatch3Dialog():(delete n.state.activeMinigameResume,n.saveToStorage()):(delete n.state.activeMinigameResume,n.saveToStorage())}}catch{}const Z={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},re=m=>{const y=String(m||"").trim();if(!y){a.exitVisitFromHud();return}const C=Z[y]||(y.startsWith("tour_")?y:"");C?a.enterHonorTourFromHud(C):y.startsWith("player_")||n.ensureNeighborSocial().neighbors.some(G=>G.id===y)?a.enterVisitFromHud(y):a.enterFlooMemberVisitFromHud(y)},B=f.get("tour")||f.get("visit");B&&re(B);const U=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(U.some(m=>f.has(m))){const m=new URLSearchParams(f);for(const G of U)m.delete(G);const y=m.toString(),C=`${window.location.pathname}${y?`?${y}`:""}${window.location.hash}`;window.history.replaceState(null,"",C)}n.isTutorialActive()&&!k&&a.panCameraToTutorialTarget(),a.refreshAll(),window.addEventListener("hpvn:toast",m=>{const y=m.detail;y?.text&&a.showToast(String(y.text),"🔥")}),window.addEventListener("hpvn:tour-garden",m=>{const y=m.detail;re(String(y?.tourId??""))}),window.addEventListener("hpvn:atmosphere",m=>{if(n.isVisitingNeighbor)return;const y=m.detail?.mode,C=y==="auto"?"realtime":y;(C==="realtime"||C==="dawn"||C==="day"||C==="dusk"||C==="night")&&(n.state.settings.timeOverride=C,n.saveToStorage(),a.refreshAll())}),window.addEventListener("hpvn:weather",m=>{if(n.isVisitingNeighbor)return;const y=m.detail?.mode;(y==="auto"||y==="clear"||y==="cloudy"||y==="rain"||y==="storm"||y==="snow"||y==="fog"||y==="fireflies")&&(n.state.settings.weatherOverride=y,n.saveToStorage(),a.refreshAll())});let E=!1,de=!1,oe=!1;n.onTutorialStepChanged=()=>{a.tutorialMinimized=!!n.state.tutorial?.minimized,a.panCameraToTutorialTarget()},n.onUiChange=()=>{if(E){oe=!0;return}a.refreshAll(),ra.refresh()},n.onToast=(m,y)=>{a.showToast(m,y),m.includes("Đạt Cấp")||m.includes("lên cấp")||m.includes("Lên Cấp")?Nt("levelup"):Nt("light"),Hn(m)},n.onBuildingTactile=m=>d.triggerSquash(m),n.onBuildingCompleted=m=>{d.triggerCompletionPop(m),d.triggerSquash(m)},n.onRibbonUnveiled=m=>{document.querySelector("dialog[open]")||(p=null,a.rideCamUid=null,g.panToGrid(i,m.gx,m.gy,{targetZoom:Math.max(i.zoom,.96),durationMs:460,reducedMotion:d.reducedMotion}));const y=Ls(m.gx,m.gy,i,s.clientWidth,s.clientHeight,36);d.triggerRibbonUnveilPop(m.uid,y.sx,y.sy),a.showRibbonUnveilBanner(m),Nt("levelup")},n.onZoneUnlocked=(m,y,C)=>{document.querySelector("dialog[open]")||(p=null,a.rideCamUid=null,g.panToGrid(i,y,C,{targetZoom:Math.min(i.zoom,.86),durationMs:620,reducedMotion:d.reducedMotion}))};const he=new cl(a.root,{onArrival:(m,y)=>{l.playFlyTick(y),y===0&&Nt("light")}});n.onRewardFly=(m,y,C,G)=>{if(typeof C=="number"&&typeof G=="number"){const D=Ls(C,G,i,s.clientWidth,s.clientHeight,32);he.spawnBurstToHud(m,y,D.sx,D.sy)||a.spawnFlyReward(m,y,D.sx,D.sy)}else he.spawnBurstToHud(m,y,s.clientWidth*.5,s.clientHeight*.52)||a.spawnFlyReward(m,y)},n.onLevelUp=m=>{Nt("levelup");const y=Ui(m),C=y.unlockedItemIds.map(D=>le(D)?.name).filter(Boolean).slice(0,2).join(", "),G=C?` · Mở: ${C}`:y.milestoneNote?` · ${y.milestoneNote}`:"";a.showToast(`Cấp Giải Đố ${m} · +${y.rewardSickle} Sickle${G}`,"🌟"),a.refreshAll()};const Ie=n.processOfflineProgress();if(Ie&&a.showOfflineModal(Ie),!V&&!B&&!f.get("tutorial")&&!n.isVisitingNeighbor&&!n.isHeadmasterPreview&&!n.state.activeMinigameResume&&!a.hasShownHouseCupIntro){const m=e.querySelector("dialog[open]");m?m.addEventListener("close",()=>{!a.hasShownHouseCupIntro&&!n.isVisitingNeighbor&&!e.querySelector("dialog[open]")&&a.openHouseCupIntroDialog()},{once:!0}):a.openHouseCupIntroDialog()}const fe=m=>{const y=n.getActiveVisitingNeighbor();if(!y?.remoteUserId)return;const C=y.helpedMarksToday[y.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:y.remoteUserId,buildingUid:m,kind:C?.kind||"water_crop",noteText:C?.noteText||"Chúc vườn phép thuật bội thu!",helperName:n.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let J=null,M=!1,O=!1,j=!1,ee=!1,ce=!1,ue=0,ge=0,me=!1,ve=!1,Te=!1,Ae=!1,ye=!1,Ce=0,se=0,Se=0,He=0,qe=0,Re=0;const je=430;let Qe=null;const gt=()=>{Qe&&(window.clearTimeout(Qe.timer),Qe=null)},zt=m=>{if(Et(n,m)>0)return`${m.name} • Kho (0 Sickle)`;if(n.state.sandboxMode)return`${m.name} • 0 Sickle`;const C=n.getEffectiveItemStarCost(m);return C>0?`${m.name} • ${C} Sao`:`${m.name} • ${m.cost.toLocaleString("vi-VN")} Sickle`},Js=m=>{if(n.state.sandboxMode||Et(n,m)>0)return!0;const y=n.getEffectiveItemStarCost(m);return y>0?(n.state.match3?.stars??0)>=y:n.state.galleons>=m.cost},xs=(m,y,C,G)=>{const D=a.activeSeedCropId;if(!D)return!1;const ne=Date.now(),ae=N=>{if(!N)return null;const Y=n.state.buildings.find(X=>X.uid===N);return!Y||Y.cropId||ne<Y.constructEndsAt?null:le(Y.itemId)?.isFarmlandPlot?Y:null};let R=ae(n.grid[y]?.[m]?.buildingUid);if(!R){let N=1/0;for(let Y=d.hotspots.length-1;Y>=0;Y--){const X=d.hotspots[Y];if(X.kind!=="building")continue;const Q=Math.hypot(C-X.sx,G-X.sy);if(Q<=Math.max(X.radius*1.35,36)&&Q<N){const ie=ae(X.id);ie&&(N=Q,R=ie)}}}if(!R)return!1;const W=n.plantCropOnPlot(R.uid,D);if(!W.ok){if(W.needSeedAcquire)return Ae=!1,M=!1,a.activeSeedCropId=null,a.seedTrayOpen=!1,a.inspectSelection=null,a.refreshAll(),a.openSeedQuizDialog(D,R.uid),!1;const N=Date.now();return N-Ce>1200&&(Ce=N,a.showToast(W.msg,"🪙")),!1}return!n.state.sandboxMode&&n.getSeedCount(D)<=0&&(a.activeSeedCropId=null),a.seedTrayOpen?(a.seedTrayOpen=!1,a.renderSeedTray(),a.refreshFloatingBanner()):a.activeSeedCropId||(a.renderSeedTray(),a.refreshFloatingBanner()),!0},Ts=(m,y,C,G)=>{const D=a.activePastureAnimalId;if(!D)return!1;const ne=Date.now(),ae=N=>{if(!N)return null;const Y=n.state.buildings.find(X=>X.uid===N);return!Y||Y.pastureAnimalId||ne<Y.constructEndsAt?null:le(Y.itemId)?.isAnimalPasturePlot?Y:null};let R=ae(n.grid[y]?.[m]?.buildingUid);if(!R){let N=1/0;for(let Y=d.hotspots.length-1;Y>=0;Y--){const X=d.hotspots[Y];if(X.kind!=="building")continue;const Q=Math.hypot(C-X.sx,G-X.sy);if(Q<=Math.max(X.radius*1.35,36)&&Q<N){const ie=ae(X.id);ie&&(N=Q,R=ie)}}}if(!R)return!1;const W=n.stockAnimalOnPasture(R.uid,D);if(!W.ok){const N=Date.now();return N-se>1200&&(se=N,a.showToast(W.msg,"🪙")),!1}return a.pastureTrayOpen&&(a.pastureTrayOpen=!1,a.renderPastureTray(),a.refreshFloatingBanner()),!0};let Fe=null;const Ut=(m,y,C,G,D)=>{if(n.isVisitingNeighbor)return null;const ne=Date.now(),ae=[],R=n.grid[y]?.[m]?.buildingUid;R&&ae.push(R);for(let W=d.hotspots.length-1;W>=0;W--){const N=d.hotspots[W];(N.kind==="water_crop"||N.kind==="feed_pasture"||N.kind==="building")&&Math.hypot(C-N.sx,G-N.sy)<=N.radius&&(ae.includes(N.id)||ae.push(N.id))}for(const W of ae){const N=n.state.buildings.find(X=>X.uid===W);if(!N||ne<N.constructEndsAt||N.awaitingUnveil)continue;const Y=le(N.itemId);if(Y){if(Y.isFarmlandPlot&&N.cropId&&N.cropReadyAt){const X=ne>=N.cropReadyAt?"harvest_crop":N.cropWateredBoost?null:"water_crop";if(X&&(!D||X===D))return{uid:W,mode:X}}if(Y.isAnimalPasturePlot&&N.pastureAnimalId&&N.pastureReadyAt){const X=ne>=N.pastureReadyAt?"harvest_pasture":N.pastureFedBoost?null:"feed_pasture";if(X&&(!D||X===D))return{uid:W,mode:X}}}}return null},$e=(m,y,C,G)=>{let D=!1;return y==="harvest_crop"?D=n.harvestCropPlot(m).ok:y==="water_crop"?D=n.waterCropPlot(m).ok:y==="harvest_pasture"?D=n.harvestAnimalPasture(m).ok:y==="feed_pasture"&&(D=n.feedAnimalPasture(m).ok),D&&(d.triggerSquash(m),d.notifyJuice("harvest",C,G),Nt("light")),D},Xe=()=>{const m=Fe;return Fe=null,!m||!m.active?(n.batchOperationActive=!1,!1):(n.batchOperationActive=!1,m.sweptUids.size>0&&(n.checkAndToastAchievements(),n.saveToStorage(),n.onUiChange?.(),a.inspectSelection=null,a.refreshAll()),m.sweptUids.size>0)},Ct=()=>{n.commitBuildStroke()},xt=m=>{n.beginBuildStroke();try{return m()}finally{n.commitBuildStroke()}},We=new Map;let qt=0,rt=!1,ut=null;const lt=()=>{ut&&(window.clearTimeout(ut.timer),ut=null)},wi=[[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],mt=(m,y,C,G,D)=>{if(ct(m))return{gx:y,gy:C};const{bw:ne,bh:ae}=n.getBuildingFootprint(m,G),R=Math.max(0,Math.min(Ye-ne,y-Math.floor((ne-1)/2))),W=Math.max(0,Math.min(Ye-ae,C-Math.floor((ae-1)/2)));if(n.canPlaceItem(m,R,W,G,D).ok)return{gx:R,gy:W};for(const[N,Y]of wi){const X=R+N,Q=W+Y;if(!(X<0||Q<0||X+ne>Ye||Q+ae>Ye)&&n.canPlaceItem(m,X,Q,G,D).ok)return{gx:X,gy:Q}}return{gx:R,gy:W}},is=(m,y)=>{const C=s.getBoundingClientRect(),G=C.width||window.innerWidth||1280,D=C.height||window.innerHeight||720,ne=At(G*.5,D*.5,i,G,D,n.grid),{bw:ae,bh:R}=n.getBuildingFootprint(m,y),W=Math.max(0,Math.min(Ye-ae,ne.gx-Math.floor((ae-1)/2))),N=Math.max(0,Math.min(Ye-R,ne.gy-Math.floor((R-1)/2)));let Y=null;for(let Q=-9;Q<=9;Q++)for(let ie=-9;ie<=9;ie++){const Ee=W+ie,ze=N+Q;if(Ee<0||ze<0||Ee+ae>Ye||ze+R>Ye||!n.canPlaceItem(m,Ee,ze,y).ok)continue;let xe=0;for(let Ze=-1;Ze<=R&&xe===0;Ze++)for(let pe=-1;pe<=ae;pe++){const z=(pe===-1||pe===ae)&&(Ze===-1||Ze===R),we=pe>=0&&pe<ae&&Ze>=0&&Ze<R;if(!(z||we)&&n.connectedPathTiles.has(`${Ee+pe},${ze+Ze}`)){xe=8;break}}const St=xe-Math.hypot(ie,Q);(!Y||St>Y.score)&&(Y={gx:Ee,gy:ze,score:St})}if(Y)return{gx:Y.gx,gy:Y.gy};const X=n.findSmartSpotForStoryBuilding(m,y);if(X&&n.canPlaceItem(m,X.gx,X.gy,y).ok)return X;for(let Q=0;Q<=Ye-R;Q++)for(let ie=0;ie<=Ye-ae;ie++)if(n.canPlaceItem(m,ie,Q,y).ok)return{gx:ie,gy:Q};return null};a.onBuildStateReset=()=>{lt(),J=null},a.onStartMoveBuilding=m=>{const y=n.state.buildings.find(C=>C.uid===m);y&&(J={gx:y.gx,gy:y.gy})},a.onRotateActivePlacement=()=>{if(a.moveModeActive&&a.movingBuildingUid){const m=n.state.buildings.find(C=>C.uid===a.movingBuildingUid),y=m?le(m.itemId):void 0;if(m&&y){const C=a.pendingTouchTile??J??{gx:m.gx,gy:m.gy},G=mt(y,C.gx,C.gy,a.rotation,a.movingBuildingUid);J=G,a.pendingTouchTile&&(a.pendingTouchTile={gx:G.gx,gy:G.gy,label:a.pendingTouchTile.label})}return}if(a.selectedCatalogItem&&!ct(a.selectedCatalogItem)){const m=a.pendingTouchTile??J;m?J=mt(a.selectedCatalogItem,m.gx,m.gy,a.rotation):J=is(a.selectedCatalogItem,a.rotation),a.pendingTouchTile&&J&&(a.pendingTouchTile={gx:J.gx,gy:J.gy,label:a.pendingTouchTile.label},a.refreshTouchConfirmBar())}},a.onSelectCatalogItem=m=>{a.pendingTouchTile=null,a.refreshTouchConfirmBar();const y=s.getBoundingClientRect(),C=y.width||window.innerWidth||1280,G=y.height||window.innerHeight||720;if(ct(m)){const ne=At(C*.5,G*.5,i,C,G,n.grid);J={gx:ne.gx,gy:ne.gy};return}const D=is(m,a.rotation);if(D){J={gx:D.gx,gy:D.gy};const{bw:ne,bh:ae}=n.getBuildingFootprint(m,a.rotation),R=n.grid[D.gy]?.[D.gx]?.elevation??0,W=Ls(D.gx+ne*.5,D.gy+ae*.5,i,C,G,R*ln);(W.sx<C*.18||W.sx>C*.82||W.sy<G*.2||W.sy>G*.76)&&(p=null,g.cancel(),Be(i,D.gx+ne*.5,D.gy+ae*.5))}else{const ne=At(C*.5,G*.5,i,C,G,n.grid);J=mt(m,ne.gx,ne.gy,a.rotation)}J&&window.matchMedia?.("(pointer: coarse)")?.matches&&(a.pendingTouchTile={gx:J.gx,gy:J.gy,label:zt(m)},a.refreshTouchConfirmBar())},a.onAutoPlaceSelected=()=>{const m=a.selectedCatalogItem;if(!m)return;const y=a.rotation;let C=null;if(J&&n.canPlaceItem(m,J.gx,J.gy,y).ok?C={gx:J.gx,gy:J.gy}:C=is(m,y),!C){const R=n.canPlaceItem(m,18,24,y),{bw:W,bh:N}=n.getBuildingFootprint(m,y);a.showToast(R.reason&&!R.reason.includes("Ô đất")?R.reason:`Chưa tìm thấy khoảng đất trống ${W}×${N} ô trong vùng đã mở khóa!`,"⚠️");return}const G=n.canPlaceItem(m,C.gx,C.gy,y);if(!G.ok){a.showToast(G.reason??"Không thể đặt tại ô này!","⚠️");return}if(!xt(()=>n.placeItem(m,C.gx,C.gy,y)))return;a.recordRecentDecorItem(m.id);const{bw:ne,bh:ae}=n.getBuildingFootprint(m,y);p=null,g.cancel(),Be(i,C.gx+ne*.5,C.gy+ae*.5),a.pendingTouchTile=null,ia(m)?J=is(m,y):(a.selectedCatalogItem=null,J=null),a.refreshAll(),a.showToast(`🔨 Đã khởi công "${m.name}" thành công!`,"✨")},a.onTouchConfirmPlace=()=>{if(!a.pendingTouchTile)return;const{gx:m,gy:y}=a.pendingTouchTile;if(a.moveModeActive&&a.movingBuildingUid){const C=a.movingBuildingUid,G=n.state.buildings.find(ae=>ae.uid===C),D=G?le(G.itemId):void 0,ne=xt(()=>n.moveBuilding(C,m,y,a.rotation));if(!ne.ok){a.showToast(ne.reason??"Không thể đặt tại ô này!","⚠️");return}a.moveKeepActiveAfterDrop?(a.movingBuildingUid=null,a.pendingTouchTile=null,J=null):(a.clearBuildToolModes(),J=null),a.refreshAll(),a.showToast(`✋ Đã dời "${D?.name??"công trình"}" sang vị trí mới!`,"✨");return}if(a.selectedCatalogItem&&!ct(a.selectedCatalogItem)){const C=a.selectedCatalogItem,G=n.canPlaceItem(C,m,y,a.rotation);if(!G.ok){a.showToast(G.reason??"Không thể đặt tại ô này!","⚠️");return}if(!xt(()=>n.placeItem(C,m,y,a.rotation)))return;if(a.recordRecentDecorItem(C.id),ia(C)&&Js(C)){const ne=is(C,a.rotation);ne?(J=ne,a.pendingTouchTile={gx:ne.gx,gy:ne.gy,label:zt(C)}):(a.selectedCatalogItem=null,a.pendingTouchTile=null,J=null)}else a.selectedCatalogItem=null,a.pendingTouchTile=null,J=null,a.showToast(`🔨 Đã khởi công "${C.name}" thành công!`,"✨");a.refreshAll();return}a.pendingTouchTile=null,a.refreshTouchConfirmBar()},a.onTouchStashActiveBuilding=()=>{if(!(a.moveModeActive&&a.movingBuildingUid))return;const m=n.stashBuilding(a.movingBuildingUid);m.ok&&(a.moveKeepActiveAfterDrop?(a.movingBuildingUid=null,a.pendingTouchTile=null,J=null):(a.clearBuildToolModes(),J=null),a.refreshAll()),a.showToast(m.msg,m.ok?"📦":"⚠️")},a.onTouchCancelPlace=()=>{J=null};const ke=new Set;window.addEventListener("keydown",m=>{if(document.querySelector("dialog[open]")){ke.clear();return}m.target instanceof HTMLInputElement||m.target instanceof HTMLTextAreaElement||m.target instanceof HTMLSelectElement||m.target instanceof HTMLElement&&m.target.classList.contains("drag-handle")||ke.add(m.key.toLowerCase())}),window.addEventListener("keyup",m=>{ke.delete(m.key.toLowerCase())}),window.addEventListener("blur",()=>{ke.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&ke.clear()}),s.addEventListener("pointermove",m=>{We.has(m.pointerId)&&We.set(m.pointerId,{x:m.clientX,y:m.clientY});const y=s.getBoundingClientRect();if(We.size>=2){g.cancel(),lt(),gt(),j=!1,ee=!1,ce=!1,me=!1,ve=!1,rt=!0;const N=Array.from(We.values()),Y=Math.hypot(N[1].x-N[0].x,N[1].y-N[0].y),X=(N[0].x+N[1].x)*.5-y.left,Q=(N[0].y+N[1].y)*.5-y.top;if(qt>8&&Y>8){const ie=(X-y.width*.5)/i.zoom+i.x,Ee=(Q-y.height*.5)/i.zoom+i.y,ze=Y/qt;i.zoom=Math.max(.32,Math.min(2.15,i.zoom*ze)),i.x=ie-(X-y.width*.5)/i.zoom,i.y=Ee-(Q-y.height*.5)/i.zoom}qt=Y;return}const C=m.clientX-y.left,G=m.clientY-y.top;if(!n.isVisitingNeighbor&&!O&&!a.movingBuildingUid&&!a.pincerActive)for(const N of d.hotspots)N.kind==="bubble"&&Math.hypot(C-N.sx,G-N.sy)<=N.radius&&n.harvestBuildingBubble(N.id);const D=At(C,G,i,y.width,y.height,n.grid);if(!a.pendingTouchTile)if(a.selectedCatalogItem&&!ct(a.selectedCatalogItem))J=mt(a.selectedCatalogItem,D.gx,D.gy,a.rotation);else if(a.moveModeActive&&a.movingBuildingUid){const N=n.state.buildings.find(X=>X.uid===a.movingBuildingUid),Y=N?le(N.itemId):void 0;J=Y?mt(Y,D.gx,D.gy,a.rotation,a.movingBuildingUid):{gx:D.gx,gy:D.gy}}else J={gx:D.gx,gy:D.gy};if(!M)return;const ne=Math.hypot(m.clientX-Se,m.clientY-He);if(Qe&&ne>8&&gt(),me&&!ve&&ne>6&&(ve=!0),ve&&We.size===1){if(a.moveModeActive&&a.movingBuildingUid){const N=n.state.buildings.find(Q=>Q.uid===a.movingBuildingUid),Y=N?le(N.itemId):void 0,X=Y?mt(Y,D.gx,D.gy,a.rotation,a.movingBuildingUid):{gx:D.gx,gy:D.gy};J=X,a.pendingTouchTile&&(a.pendingTouchTile={gx:X.gx,gy:X.gy,label:a.pendingTouchTile.label},a.refreshTouchConfirmBar());return}if(a.selectedCatalogItem&&!ct(a.selectedCatalogItem)){const N=mt(a.selectedCatalogItem,D.gx,D.gy,a.rotation);J=N,a.pendingTouchTile&&(a.pendingTouchTile={gx:N.gx,gy:N.gy,label:a.pendingTouchTile.label},a.refreshTouchConfirmBar());return}}if(ce&&a.bulldozerActive&&We.size===1&&!rt&&(!ee&&ne>7&&(ee=!0,n.eraseBrushAtTile(ue,ge)),ee)){n.eraseBrushAtTile(D.gx,D.gy);return}if(ut&&We.size===1&&ne>8){const N=ut;lt(),j=!0,n.placeItem(N.item,N.gx,N.gy,N.rot)&&a.recordRecentDecorItem(N.item.id)}if(j&&a.selectedCatalogItem){n.placeItem(a.selectedCatalogItem,D.gx,D.gy,a.rotation)&&a.recordRecentDecorItem(a.selectedCatalogItem.id);return}if(Ae&&a.activeSeedCropId){xs(D.gx,D.gy,C,G);return}if(ye&&a.activePastureAnimalId){Ts(D.gx,D.gy,C,G);return}if(Fe&&We.size===1&&!rt){const N=Math.hypot(m.clientX-Se,m.clientY-He);if(!Fe.active&&N>7&&(Fe.active=!0,n.batchOperationActive=!0,$e(Fe.initialUid,Fe.mode,Fe.initialSx,Fe.initialSy)&&Fe.sweptUids.add(Fe.initialUid)),Fe.active){const Y=Ut(D.gx,D.gy,C,G,Fe.mode);Y&&!Fe.sweptUids.has(Y.uid)&&$e(Y.uid,Y.mode,C,G)&&Fe.sweptUids.add(Y.uid);return}}const ae=m.clientX-Se,R=m.clientY-He,W=a.selectedCatalogItem&&!ct(a.selectedCatalogItem)||a.moveModeActive&&a.movingBuildingUid?14:5;Math.hypot(ae,R)>W&&(O=!0,a.rideCamUid=null),O&&(p=null,g.cancel(),i.x=qe-ae/i.zoom,i.y=Re-R/i.zoom)}),s.addEventListener("pointerdown",m=>{if(We.set(m.pointerId,{x:m.clientX,y:m.clientY}),We.size>=2){lt(),gt(),Xe();const ae=Array.from(We.values());qt=Math.hypot(ae[1].x-ae[0].x,ae[1].y-ae[0].y),rt=!0,j=!1,ee=!1,ce=!1,me=!1,ve=!1;return}if(n.beginBuildStroke(),m.button!==0&&m.button!==2)return;const y=s.getBoundingClientRect(),C=m.clientX-y.left,G=m.clientY-y.top,D=At(C,G,i,y.width,y.height,n.grid);if(!a.pendingTouchTile)if(a.selectedCatalogItem&&!ct(a.selectedCatalogItem))J=mt(a.selectedCatalogItem,D.gx,D.gy,a.rotation);else if(a.moveModeActive&&a.movingBuildingUid){const ae=n.state.buildings.find(W=>W.uid===a.movingBuildingUid),R=ae?le(ae.itemId):void 0;J=R?mt(R,D.gx,D.gy,a.rotation,a.movingBuildingUid):{gx:D.gx,gy:D.gy}}else J={gx:D.gx,gy:D.gy};if(M=!0,O=!1,ee=!1,ce=!1,me=!1,ve=!1,Te=!1,gt(),Se=m.clientX,He=m.clientY,qe=i.x,Re=i.y,m.button===0&&a.pendingTouchTile&&!a.hasOpenFloatingTray()){const ae=a.selectedCatalogItem??(a.moveModeActive&&a.movingBuildingUid?le(n.state.buildings.find(R=>R.uid===a.movingBuildingUid)?.itemId??"")??null:null);if(ae&&!ct(ae)){const{bw:R,bh:W}=n.getBuildingFootprint(ae,a.rotation),N=a.pendingTouchTile;D.gx>=N.gx-1&&D.gx<=N.gx+R&&D.gy>=N.gy-1&&D.gy<=N.gy+W&&(me=!0)}}const ne=a.selectedCatalogItem;if(m.button===0&&a.bulldozerActive&&!a.hasOpenFloatingTray())j=!1,Ae=!1,ye=!1,ce=!0,ue=D.gx,ge=D.gy;else if(m.button===0&&ne&&ct(ne)&&!a.hasOpenFloatingTray()){if(m.pointerType==="touch"){lt(),j=!1;const ae=a.rotation;ut={item:ne,gx:D.gx,gy:D.gy,rot:ae,timer:window.setTimeout(()=>{ut=null,We.size===1&&!rt&&M&&(j=!0,n.placeItem(ne,D.gx,D.gy,ae)&&a.recordRecentDecorItem(ne.id))},75)}}else j=!0,n.placeItem(ne,D.gx,D.gy,a.rotation)&&a.recordRecentDecorItem(ne.id);Ae=!1,ye=!1}else if(m.button===0&&a.activeSeedCropId&&!a.selectedCatalogItem&&!a.moveModeActive&&!a.bulldozerActive&&!a.pincerActive&&xs(D.gx,D.gy,C,G))j=!1,Ae=!0,ye=!1;else if(m.button===0&&a.activePastureAnimalId&&!a.selectedCatalogItem&&!a.moveModeActive&&!a.bulldozerActive&&!a.pincerActive&&Ts(D.gx,D.gy,C,G))j=!1,Ae=!1,ye=!0;else if(j=!1,Ae=!1,ye=!1,m.button===0&&!n.isVisitingNeighbor&&!a.selectedCatalogItem&&!a.activeSeedCropId&&!a.activePastureAnimalId&&!a.moveModeActive&&!a.bulldozerActive&&!a.pincerActive&&!a.hasOpenFloatingTray()){const ae=Ut(D.gx,D.gy,C,G);if(Fe=ae?{mode:ae.mode,initialUid:ae.uid,initialSx:C,initialSy:G,active:!1,sweptUids:new Set}:null,!a.photoModeActive&&!d.hotspots.some(W=>(W.kind==="owl_post"||W.kind==="visitor_gift"||W.kind==="neighbor_help"||W.kind==="home_lantern"||W.kind==="unveil_building"||W.kind==="bubble")&&Math.hypot(C-W.sx,G-W.sy)<=W.radius)){let W=n.grid[D.gy]?.[D.gx]?.buildingUid??null;if(!W){let Y=1/0;for(let X=d.hotspots.length-1;X>=0;X--){const Q=d.hotspots[X];if(Q.kind!=="building")continue;const ie=Math.hypot(C-Q.sx,G-Q.sy);ie<=Q.radius&&ie<Y&&(Y=ie,W=Q.id)}}const N=W?n.state.buildings.find(Y=>Y.uid===W):null;if(N&&!N.isIndestructible){const Y=m.pointerType;Qe={uid:N.uid,startMs:performance.now(),sx:C,sy:G,pointerType:Y,timer:window.setTimeout(()=>{const X=Qe;if(Qe=null,!X||!M||rt||We.size>1)return;const Q=n.state.buildings.find(Ee=>Ee.uid===X.uid);if(!Q||Q.isIndestructible||n.isVisitingNeighbor)return;Fe=null,n.batchOperationActive=!1;const ie=le(Q.itemId);a.clearBuildToolModes(),a.inspectSelection=null,a.moveModeActive=!0,a.moveKeepActiveAfterDrop=!1,a.movingBuildingUid=Q.uid,a.rotation=Q.rotation,J={gx:Q.gx,gy:Q.gy},X.pointerType==="touch"&&(a.pendingTouchTile={gx:Q.gx,gy:Q.gy,label:ie?.name??"Dời công trình"},me=!0,ve=!0),Te=!0,d.triggerSquash(Q.uid),n.audio.playClick(),Nt("light"),a.refreshAll(),a.showToast(`✋ Đã nhấc "${ie?.name??"công trình"}" — kéo tới ô mới để đặt!`,"✋")},je)}}}}else Fe=null});const Ka=m=>{We.delete(m),We.size<2&&(qt=0)};window.addEventListener("pointercancel",m=>{lt(),gt(),Xe(),n.cancelBuildStroke(),Ka(m.pointerId),M=!1,O=!1,j=!1,ee=!1,ce=!1,me=!1,ve=!1,Te=!1,Ae=!1,ye=!1,rt=!1}),window.addEventListener("pointerup",m=>{if(Ka(m.pointerId),gt(),rt){lt(),Xe(),Ct(),We.size===0&&(rt=!1,M=!1,O=!1,ee=!1,ce=!1,me=!1,ve=!1,Te=!1,Ae=!1,ye=!1);return}if(!M)return;const y=Xe(),C=ee,G=ve,D=Te;let ne=!1;if(ut&&!O&&m.target===s){const pe=ut;lt();const z=n.canPlaceItem(pe.item,pe.gx,pe.gy,pe.rot);if(!z.ok){Ct(),M=!1,O=!1,j=!1,ee=!1,ce=!1,me=!1,ve=!1,Te=!1,Ae=!1,ye=!1,a.showToast(z.reason??"Không thể đặt tại ô này!","⚠️");return}n.placeItem(pe.item,pe.gx,pe.gy,pe.rot)&&a.recordRecentDecorItem(pe.item.id),ne=!0}else lt();Ct();const ae=O,R=j||ne||C||Ae||ye||y,W=j||ne;if(M=!1,O=!1,j=!1,ee=!1,ce=!1,me=!1,ve=!1,Te=!1,Ae=!1,ye=!1,C){a.refreshDock();return}if(D||G){a.refreshTouchConfirmBar(),a.refreshFloatingBanner();return}if(W&&a.selectedCatalogItem&&!dl(a.selectedCatalogItem)&&(a.selectedCatalogItem=null,a.refreshAll()),ae||R)return;if(m.button===2){a.clearBuildToolModes(),a.closeSeedTray(),a.closePastureTray(),a.collapseBuildDock(),a.closeHudPopovers(),a.inspectSelection=null,a.refreshAll();return}if(m.target!==s)return;const N=a.pendingSowPlotUid,Y=a.pendingStockPastureUid,X=a.activeSeedCropId,Q=a.activePastureAnimalId;if(a.closeHudPopovers(),a.hasOpenFloatingTray()){if(a.hideOpenFloatingTrays(),a.selectedCatalogItem||a.moveModeActive||a.bulldozerActive||a.pincerActive){a.refreshAll();return}X&&(n.state.sandboxMode||n.getSeedCount(X)>0)&&(a.activeSeedCropId=X),Q&&(a.activePastureAnimalId=Q),a.renderSeedTray(),a.renderPastureTray(),a.refreshFloatingBanner()}const ie=s.getBoundingClientRect(),Ee=m.clientX-ie.left,ze=m.clientY-ie.top,xe=At(Ee,ze,i,ie.width,ie.height,n.grid),St=m.pointerType==="touch";if(a.pincerActive){const pe=a.pincerPicked??(n.staff[0]?{kind:"staff",id:n.staff[0].id,label:n.staff[0].name}:null);pe&&n.dropPickedEntity(pe.kind,pe.id,xe.gx,xe.gy),a.clearBuildToolModes(),a.refreshAll();return}if(a.bulldozerActive){let pe=xe.gx,z=xe.gy;const we=n.grid[z]?.[pe];if(!we?.buildingUid&&(!we||we.path==="none")){for(const te of d.hotspots)if(te.kind==="building"&&Math.hypot(Ee-te.sx,ze-te.sy)<=te.radius){const be=n.state.buildings.find(at=>at.uid===te.id);be&&(pe=be.gx,z=be.gy);break}}const _=n.getRemovalLossText(pe,z);if(_){a.askConfirm(_).then(te=>{te&&(xt(()=>n.removeAtTile(pe,z)),a.refreshDock())});return}xt(()=>n.removeAtTile(pe,z)),a.refreshDock();return}if(a.moveModeActive){if(a.movingBuildingUid){const we=a.movingBuildingUid,_=n.state.buildings.find(Cs=>Cs.uid===we),te=_?le(_.itemId):void 0,be=te?mt(te,xe.gx,xe.gy,a.rotation,we):{gx:xe.gx,gy:xe.gy},{bw:at,bh:bt}=te?n.getBuildingFootprint(te,a.rotation):{bw:1,bh:1},nt=!!a.pendingTouchTile&&xe.gx>=a.pendingTouchTile.gx&&xe.gx<a.pendingTouchTile.gx+at&&xe.gy>=a.pendingTouchTile.gy&&xe.gy<a.pendingTouchTile.gy+bt;if(St&&!nt&&(!a.pendingTouchTile||a.pendingTouchTile.gx!==be.gx||a.pendingTouchTile.gy!==be.gy)){J=be,a.pendingTouchTile={gx:be.gx,gy:be.gy,label:te?.name??"Dời công trình"},a.refreshTouchConfirmBar();return}const it=nt?a.pendingTouchTile.gx:be.gx,Ne=nt?a.pendingTouchTile.gy:be.gy,Oe=xt(()=>n.moveBuilding(we,it,Ne,a.rotation));if(!Oe.ok){a.showToast(Oe.reason??"Không thể đặt tại ô này!","⚠️");return}a.moveKeepActiveAfterDrop?(a.movingBuildingUid=null,a.pendingTouchTile=null,J=null):(a.clearBuildToolModes(),J=null),a.refreshAll(),a.showToast(`✋ Đã dời "${te?.name??"công trình"}" sang vị trí mới!`,"✨");return}let z=n.grid[xe.gy]?.[xe.gx]?.buildingUid??null;if(!z){for(const we of d.hotspots)if(we.kind==="building"&&Math.hypot(Ee-we.sx,ze-we.sy)<=we.radius){z=we.id;break}}if(z){const we=n.state.buildings.find(_=>_.uid===z);if(we?.isIndestructible){a.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(we){a.movingBuildingUid=we.uid,a.rotation=we.rotation,J={gx:we.gx,gy:we.gy};const _=le(we.itemId);St&&(a.pendingTouchTile={gx:we.gx,gy:we.gy,label:_?.name??"Dời công trình"}),a.refreshTouchConfirmBar(),a.refreshFloatingBanner(),a.showToast(`✋ Đang nhấc "${_?.name??"công trình"}" — chạm ô mới để đặt xuống!`,"✋");return}}}if(a.selectedCatalogItem){const pe=a.selectedCatalogItem,z=mt(pe,xe.gx,xe.gy,a.rotation);if(St&&!ct(pe)){const{bw:te,bh:be}=n.getBuildingFootprint(pe,a.rotation);if(!(!!a.pendingTouchTile&&xe.gx>=a.pendingTouchTile.gx&&xe.gx<a.pendingTouchTile.gx+te&&xe.gy>=a.pendingTouchTile.gy&&xe.gy<a.pendingTouchTile.gy+be)&&(!a.pendingTouchTile||a.pendingTouchTile.gx!==z.gx||a.pendingTouchTile.gy!==z.gy)){J=z,a.pendingTouchTile={gx:z.gx,gy:z.gy,label:zt(pe)},a.refreshTouchConfirmBar();return}a.onTouchConfirmPlace?.();return}J=z;const we=n.canPlaceItem(pe,z.gx,z.gy,a.rotation);if(!we.ok){a.showToast(we.reason??"Không thể đặt tại ô này!","⚠️");return}if(!xt(()=>n.placeItem(pe,z.gx,z.gy,a.rotation)))return;a.recordRecentDecorItem(pe.id),a.pendingTouchTile=null,ia(pe)||(a.selectedCatalogItem=null,J=null,a.showToast(`🔨 Đã khởi công "${pe.name}" thành công!`,"✨")),a.refreshAll();return}for(const pe of["owl_post","field_micro_event","roaming_pet","home_visitor_gift","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building","building_cutaway"]){let z=null,we=1/0;for(let _=d.hotspots.length-1;_>=0;_--){const te=d.hotspots[_];if(te.kind!==pe)continue;const be=Math.hypot(Ee-te.sx,ze-te.sy);if(te.spriteKey&&typeof te.boxLeft=="number"&&typeof te.boxTop=="number"&&typeof te.boxW=="number"&&typeof te.boxH=="number"&&te.boxW>2&&te.boxH>2){const at=Ee>=te.boxLeft&&Ee<=te.boxLeft+te.boxW&&ze>=te.boxTop&&ze<=te.boxTop+te.boxH,bt=(Ee-te.boxLeft)/te.boxW,nt=(ze-te.boxTop)/te.boxH,it=at&&r.hitTestAlpha(te.spriteKey,bt,nt,!!te.flipX),Ne=(te.kind==="building"||te.kind==="building_cutaway")&&be<=te.radius*.5;if(!it&&!Ne)continue;if((z===null||be<we*.82)&&(z=te,we=be,it))break}else be<=te.radius&&be<we&&(we=be,z=te)}if(z){if(z.kind==="owl_post"){const _=d.collectOwlPostParcel();_&&n.claimOwlPostDelivery(_.gx,_.gy),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="field_micro_event"){n.claimFieldMicroEvent().ok&&d.notifyJuice("harvest",z.sx,z.sy),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="roaming_pet"){const _=n.petRoamingCompanion();_.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(_.msg,"🐾"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="home_visitor_gift"){const _=n.claimHomeVisitorMysteryGift(z.id);_.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(_.msg,"🎁"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="visitor_gift"){const _=n.claimVisitedNeighborMysteryGift();_.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(_.msg,"🎁"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="neighbor_help"){d.triggerSquash(z.id);const _=n.helpVisitedNeighborBuilding(z.id);_.ok?(d.notifyJuice("harvest",z.sx,z.sy),fe(z.id)):a.showToast(_.msg,"💧"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="home_lantern"){const _=n.ensureNeighborSocial().homeLanternMarks.find(be=>be.id===z.id);_&&d.triggerSquash(_.buildingUid);const te=n.claimHomeLanternMark(z.id);te.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(te.msg,"🏮"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="unveil_building"){n.unveilBuilding(z.id),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="bubble"){n.harvestBuildingBubble(z.id),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="water_crop"){d.triggerSquash(z.id);const _=n.waterCropPlot(z.id);_.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(_.msg,"💧"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="feed_pasture"){d.triggerSquash(z.id);const _=n.feedAnimalPasture(z.id);_.ok?d.notifyJuice("harvest",z.sx,z.sy):a.showToast(_.msg,"🌾"),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="escaped"){n.catchEscapedCreature(z.id),a.inspectSelection=null,a.refreshAll();return}if(z.kind==="zone_plaque"){a.clearBuildToolModes(),a.closeSeedTray(),a.inspectSelection={kind:"zone",zoneId:z.id},a.refreshAll();return}if(z.kind==="villager"){n.greetVillager(z.id),a.refreshAll();return}if(z.kind==="building"||z.kind==="building_cutaway"){const _=n.state.buildings.find(be=>be.uid===z.id);if(_){if(!n.isVisitingNeighbor&&_.awaitingUnveil){n.unveilBuilding(_.uid),a.inspectSelection=null,a.refreshAll();return}const be=le(_.itemId),at=!!(!n.isVisitingNeighbor&&be?.isFarmlandPlot&&_.cropId&&_.cropReadyAt&&Date.now()>=_.cropReadyAt),bt=!!(!n.isVisitingNeighbor&&be?.isAnimalPasturePlot&&_.pastureAnimalId&&_.pastureReadyAt&&Date.now()>=_.pastureReadyAt);if(!at&&!bt&&d.triggerSquash(z.id),n.isVisitingNeighbor){const Ne=n.getVisitedBuildingHelpStatus(_);if(Ne.canHelp){const Oe=n.helpVisitedNeighborBuilding(_.uid);Oe.ok?(d.notifyJuice("harvest",z.sx,z.sy),fe(_.uid)):a.showToast(Oe.msg,"💧")}else if(Ne.existingMark)a.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${Ne.existingMark.noteText}”`,"🏮");else{const Oe=le(_.itemId),Cs=n.getActiveVisitingNeighbor();a.showToast(`🏡 Đang ngắm "${Oe?.name??"Công trình"}" (${_.stars}★) tại vườn ${Cs?.name??"bạn bè"}!`,Cs?.avatarEmoji??"🏡")}a.inspectSelection=null,a.refreshAll();return}const nt=n.ensureNeighborSocial().homeLanternMarks.find(Ne=>Ne.buildingUid===_.uid);if(nt&&n.claimHomeLanternMark(nt.id).ok){d.notifyJuice("harvest",z.sx,z.sy),a.inspectSelection=null,a.refreshAll();return}const it=le(_.itemId);if(it?.isFarmlandPlot&&_.cropId&&_.cropReadyAt&&Date.now()>=_.cropReadyAt){n.harvestCropPlot(_.uid),a.inspectSelection=null,a.refreshAll();return}else if(it?.isFarmlandPlot&&_.cropId&&_.cropReadyAt&&Date.now()<_.cropReadyAt&&!_.cropWateredBoost){n.waterCropPlot(_.uid).ok&&d.notifyJuice("harvest",z.sx,z.sy),a.inspectSelection=null,a.refreshAll();return}else if(it?.isFarmlandPlot&&!_.cropId&&Date.now()>=_.constructEndsAt){if(a.activeSeedCropId){const Ne=a.activeSeedCropId,Oe=n.plantCropOnPlot(_.uid,Ne);if(Oe.needSeedAcquire){a.activeSeedCropId=null,a.inspectSelection=null,a.refreshAll(),a.openSeedQuizDialog(Ne,_.uid);return}!n.state.sandboxMode&&n.getSeedCount(Ne)<=0&&(a.activeSeedCropId=null),a.showToast(Oe.msg,Oe.ok?"🌱":"🪙"),a.inspectSelection=null,a.refreshAll()}else N===_.uid?(a.inspectSelection={kind:"building",uid:_.uid},a.refreshAll()):a.openSeedTray(void 0,_.uid);return}else if(it?.isAnimalPasturePlot&&_.pastureAnimalId&&_.pastureReadyAt&&Date.now()>=_.pastureReadyAt){n.harvestAnimalPasture(_.uid),a.inspectSelection=null,a.refreshAll();return}else if(it?.isAnimalPasturePlot&&_.pastureAnimalId&&_.pastureReadyAt&&Date.now()<_.pastureReadyAt&&!_.pastureFedBoost){n.feedAnimalPasture(_.uid).ok&&d.notifyJuice("harvest",z.sx,z.sy),a.inspectSelection=null,a.refreshAll();return}else if(it?.isAnimalPasturePlot&&!_.pastureAnimalId&&Date.now()>=_.constructEndsAt){if(a.activePastureAnimalId){const Ne=n.stockAnimalOnPasture(_.uid,a.activePastureAnimalId);a.showToast(Ne.msg,Ne.ok?"🐾":"🪙"),a.inspectSelection=null,a.refreshAll()}else Y===_.uid?(a.inspectSelection={kind:"building",uid:_.uid},a.refreshAll()):a.openPastureTray(void 0,_.uid);return}else(_.storedSickle>0||_.readyFarmGoods&&_.readyFarmGoods.length>0)&&n.harvestBuildingBubble(_.uid)}a.clearBuildToolModes(),a.closeSeedTray(),a.closePastureTray(),a.inspectSelection={kind:"building",uid:z.id};const te=s.getBoundingClientRect();z.sy>te.height-190&&(i.y+=(z.sy-(te.height-210))/i.zoom),a.refreshAll();return}}}const Ze=n.grid[xe.gy]?.[xe.gx];if(!n.isVisitingNeighbor&&Ze&&!n.state.unlockedZones.includes(Ze.zoneId)){a.clearBuildToolModes(),a.closeSeedTray(),a.closePastureTray(),a.inspectSelection={kind:"zone",zoneId:Ze.zoneId},a.refreshAll();return}if(n.strollModeActive&&!n.isVisitingNeighbor){n.setStrollDestination(xe.fgx??xe.gx,xe.fgy??xe.gy),a.inspectSelection=null,a.refreshAll();return}a.inspectSelection=null,a.refreshAll()}),s.addEventListener("contextmenu",m=>m.preventDefault()),s.addEventListener("wheel",m=>{m.preventDefault(),p=null,g.cancel();const y=s.getBoundingClientRect(),C=m.clientX-y.left,G=m.clientY-y.top,D=(C-y.width*.5)/i.zoom+i.x,ne=(G-y.height*.5)/i.zoom+i.y,ae=m.deltaY<0?1.1:.91;i.zoom=Math.max(.32,Math.min(2.15,i.zoom*ae)),i.x=D-(C-y.width*.5)/i.zoom,i.y=ne-(G-y.height*.5)/i.zoom},{passive:!1});let os=performance.now(),Gt=0;const xi=window.matchMedia?.("(pointer: coarse)").matches?1e3/30-2:0,Ti=new Ko,Qa=new il,Tt=document.createElement("div");Tt.id="gamepadRadialMenu",Tt.className="aaa-gamepad-radial",Tt.hidden=!0,Tt.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${In.map(m=>{const y=m.index*Math.PI*2/8,C=50+Math.cos(y)*37,G=50+Math.sin(y)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${m.index}" style="left:${C.toFixed(1)}%;top:${G.toFixed(1)}%;">${m.icon}<br/>${m.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(Tt);let Dt=null,$s=!1;const Xa=m=>{switch(m){case"seeds":a.openSeedTray();break;case"barn":a.openWorkshopDialog("barn");break;case"orders":{a.activeQuestTab="orders",a.renderQuestDialog(),a.root.querySelector("#questDialog")?.showModal();break}case"match3":a.openMatch3Dialog();break;case"arcade":a.openPuzzleArcadeDialog();break;case"seedquiz":a.openSeedQuizDialog();break;case"neighbors":a.openNeighborDialog("friends");break;case"feast":a.openHarvestFeastDialog();break}},$i=pn(),ki=a.root.querySelector("#match3Dialog"),Ci=a.root.querySelector("#puzzleArcadeDialog"),Mi=a.root.querySelector("#seedQuizDialog"),ea=Array.from(a.root.querySelectorAll("dialog")),ta=()=>{const m=E;E=!!(ki?.open||Ci?.open||Mi?.open),de=E||ea.some(y=>y.open),m&&!E&&oe&&(oe=!1,a.refreshAll(),ra.refresh())};if(ta(),typeof MutationObserver<"u"){const m=new MutationObserver(()=>{ta()});for(const y of ea)m.observe(y,{attributes:!0,attributeFilter:["open"]})}a.root.addEventListener("close",ta,!0);let Mt=0,Ya=0,Rt=0;function ks(m){if(Mt=0,document.hidden){os=m;return}if(m-os<xi){requestAnimationFrame(ks);return}const y=(m-os)/1e3;if(os=m,!de&&y>.002&&y<.5&&(Qa.recordFrameFps(1/y),Gt%90===0&&Gt>0)){const R=Qa.getHealthReport();$i?d.adaptiveDprCap=R.p5LowFps<46?1.15:R.p5LowFps<54?1.35:1.5:d.adaptiveDprCap=R.p5LowFps<46?1.25:R.p5LowFps<54?1.5:2}const C=Ti.poll();if(C.connected){if(C.panDx!==0||C.panDy!==0){p=null,g.cancel(),a.rideCamUid=null;const R=380/i.zoom*Math.min(.05,y);i.x+=C.panDx*R,i.y+=C.panDy*R}if(C.radialOpen?(Tt.hidden=!1,$s=!0,C.radialActionId&&(Dt=C.radialActionId),Tt.querySelectorAll("[data-radial-idx]").forEach(R=>{R.dataset.selected=String(Number(R.dataset.radialIdx)===C.radialSliceIndex)}),C.confirmJustPressed&&Dt&&(Tt.hidden=!0,$s=!1,Xa(Dt),Dt=null)):$s&&(Tt.hidden=!0,$s=!1,Dt&&(Xa(Dt),Dt=null)),C.cancelJustPressed){const R=ea.filter(W=>W.open);R.length>0?R[R.length-1]?.close():a.hasOpenFloatingTray()&&a.hideOpenFloatingTrays()}}if((ke.has("w")||ke.has("arrowup")||ke.has("s")||ke.has("arrowdown")||ke.has("a")||ke.has("arrowleft")||ke.has("d")||ke.has("arrowright"))&&(p=null,g.cancel()),p){const R=Math.min(1,Math.max(0,(m-p.startMs)/p.durationMs)),W=1-Math.pow(1-R,3);i.x=p.fromX+(p.toX-p.fromX)*W,i.y=p.fromY+(p.toY-p.fromY)*W,i.zoom=p.fromZoom+(p.toZoom-p.fromZoom)*W,R>=1&&(p=null)}else a.rideCamUid||g.update(i,y);const G=340/i.zoom*Math.min(.05,y);if(ke.size>0&&de&&ke.clear(),n.strollModeActive&&n.playerStrollAvatar&&!n.isVisitingNeighbor){let R=0,W=0;if((ke.has("w")||ke.has("arrowup"))&&(W-=1),(ke.has("s")||ke.has("arrowdown"))&&(W+=1),(ke.has("a")||ke.has("arrowleft"))&&(R-=1),(ke.has("d")||ke.has("arrowright"))&&(R+=1),R!==0||W!==0){const Y=Ls(n.playerStrollAvatar.gx,n.playerStrollAvatar.gy,i,window.innerWidth,window.innerHeight),X=At(Y.sx+R*54*i.zoom,Y.sy+W*54*i.zoom,i,window.innerWidth,window.innerHeight);n.setStrollDestination(X.fgx,X.fgy)}const N=Qt(n.playerStrollAvatar.gx,n.playerStrollAvatar.gy,i.viewRot??0);i.x+=(N.wx-i.x)*Math.min(1,y*6.5),i.y+=(N.wy-14-i.y)*Math.min(1,y*6.5)}else(ke.has("w")||ke.has("arrowup"))&&(a.rideCamUid=null,i.y-=G),(ke.has("s")||ke.has("arrowdown"))&&(a.rideCamUid=null,i.y+=G),(ke.has("a")||ke.has("arrowleft"))&&(a.rideCamUid=null,i.x-=G),(ke.has("d")||ke.has("arrowright"))&&(a.rideCamUid=null,i.x+=G);let D=!0,ne=Math.min(.1,y);if(E)if(Rt+=y,Rt>=1){const R=Math.min(2.5,Rt);Rt=0,n.update(R),ne=Math.min(.1,R)}else D=!1;else if(Rt>0){const R=Math.min(2.5,y+Rt);Rt=0,n.update(R)}else n.update(y);if(a.rideCamUid&&!E){const R=n.state.buildings.find(N=>N.uid===a.rideCamUid),W=n.coasterCircuits.get(a.rideCamUid);if(W&&W.waypoints.length>=3){const N=Eo(W.waypoints,W.isClosed,Date.now()/1e3,3);if(N.length>0){const Y=N[0],X=Qt(Y.gx+.5,Y.gy+.5,i.viewRot??0),Q=X.wx,ie=X.wy-(Y.elev*ln+10);i.x+=(Q-i.x)*Math.min(1,y*10),i.y+=(ie-i.y)*Math.min(1,y*10),i.zoom+=(1.38-i.zoom)*Math.min(1,y*5),a.rideCamSpeedText=`${Y.speedKmh} km/h (${Y.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,Gt%8===0&&a.refreshFloatingBanner()}}else if(R){const N=Date.now()/1e3,Y=R.gx+2+Math.cos(N*2.1)*1.4,X=R.gy+2+Math.sin(N*2.1)*1.4,Q=Qt(Y,X,i.viewRot??0);i.x+=(Q.wx-i.x)*Math.min(1,y*8),i.y+=(Q.wy-22-i.y)*Math.min(1,y*8),i.zoom+=(1.35-i.zoom)*Math.min(1,y*5),a.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",Gt%12===0&&a.refreshFloatingBanner()}else a.rideCamUid=null,a.refreshFloatingBanner()}if(D){const R=n.getRealTimePeriod(),W=n.getCurrentWeather(),N=i.viewRot??0,Y=Qt(3,17,N),X=Math.hypot(i.x-Y.wx,i.y-Y.wy)<420,Q=At(window.innerWidth*.5,window.innerHeight*.5,i,window.innerWidth,window.innerHeight),ie=Math.max(0,Math.min(Ye-1,Math.round(Q.fgx))),Ee=Math.max(0,Math.min(Ye-1,Math.round(Q.fgy)));let ze=Number.POSITIVE_INFINITY;for(let _=-5;_<=5;_++){const te=n.grid[Ee+_];if(te)for(let be=-5;be<=5;be++){const at=te[ie+be];if(!at||at.terrain!=="water")continue;const bt=Qt(ie+be+.5,Ee+_+.5,N),nt=Math.hypot(i.x-bt.wx,i.y-bt.wy);nt<ze&&(ze=nt)}}let xe=Number.POSITIVE_INFINITY,St=Number.POSITIVE_INFINITY,Ze=Number.POSITIVE_INFINITY,pe=Number.POSITIVE_INFINITY;const z=Date.now(),we=!!(n.state.supply.activeBrew&&n.state.supply.activeBrew.endsAt>z);for(let _=0;_<n.state.buildings.length;_++){const te=n.state.buildings[_];if(z<te.constructEndsAt)continue;const be=le(te.itemId);if(!be)continue;const at=!!(te.workshopQueue&&te.workshopQueue.length>0&&te.workshopQueue[0].endsAt>z)||!!(be.isWorkshopBrewery&&we),bt=!!(be.isAnimalPasturePlot&&te.pastureAnimalId),nt=be.id==="burrow_apple_orchard"||be.id==="burrow_flower_garden"||!!(be.isFarmlandPlot&&te.cropId),it=be.id.startsWith("yule_")||be.id==="halloween_arch"||be.id==="burrow_feast_marquee";if(!at&&!bt&&!nt&&!it)continue;const Ne=Qt(te.gx+.5,te.gy+.5,N),Oe=Math.hypot(i.x-Ne.wx,i.y-Ne.wy);at&&Oe<xe&&(xe=Oe),bt&&Oe<St&&(St=Oe),nt&&Oe<Ze&&(Ze=Oe),it&&Oe<pe&&(pe=Oe)}l.updateSoundscape(ne,R==="night"||R==="dusk",i.zoom,X,W.kind,n.getActiveFestival()!=="none",R,{waterDistPx:ze,activeWorkshopDistPx:xe,pastureDistPx:St,orchardDistPx:Ze,festiveDistPx:pe})}if(!E&&(!de||m-Ya>=80)){Ya=m;const R=a.pendingTouchTile?{gx:a.pendingTouchTile.gx,gy:a.pendingTouchTile.gy}:J;if(d.activeSeedBrushCropId=a.activeSeedCropId,d.activePastureBrushAnimalId=a.activePastureAnimalId,w){const X=!I&&!!(u&&!u.gpuDevice.contextLost)&&(n.state.settings.rendererMode??"webgl2")!=="canvas",Q=X?"webgl2":"canvas";w.mode!==Q&&(w.mode=Q,S&&(S.style.display=X?"block":"none"),X?(s.style.position="relative",s.style.zIndex="1",s.style.background="transparent"):(s.style.position="",s.style.zIndex="",s.style.background=""))}const W=w,N=u&&!u.gpuDevice.contextLost?W?.mode??"canvas":"canvas",Y=a.inspectSelection?.kind==="building"?a.inspectSelection.uid:null;if(N!=="webgl2"&&d.render(n,i,R,a.selectedCatalogItem,a.rotation,a.bulldozerActive,Y,a.movingBuildingUid,a.pincerPicked?.label??null),u&&W&&!u.gpuDevice.contextLost&&N!=="canvas"){if(q.moved&&!document.querySelector("dialog[open]")){const X=Math.max(1,window.innerWidth),Q=Math.max(1,window.innerHeight),ie=1/Math.max(.15,i.zoom);P.wx=(q.x-X*.5)*ie+i.x,P.wy=(q.y-Q*.5)*ie+i.y,P.active=!0}else P.active=!1;u.renderFrame(n,i,W,P,Date.now(),{hoverTile:R,selectedCatalogItem:a.selectedCatalogItem,rotation:a.rotation,bulldozerActive:a.bulldozerActive,selectedBuildingUid:Y,movingBuildingUid:a.movingBuildingUid,hotspotsOut:N==="webgl2"?d.hotspots:void 0,skipReadyBubbleSprites:N==="webgl2"}),N==="webgl2"&&d.renderWorldUiOverlays(n,i,Y,a.movingBuildingUid,!!(a.movingBuildingUid||a.selectedCatalogItem||a.bulldozerActive),!0,R,a.selectedCatalogItem,a.rotation,a.bulldozerActive,a.pincerPicked?.label??null)}if(Qe){const X=m-Qe.startMs;if(X>=95){const Q=Math.max(0,Math.min(1,(X-95)/(je-95))),ie=d.ctx,Ee=window.devicePixelRatio||1;ie.save(),ie.setTransform(Ee,0,0,Ee,0,0),ie.beginPath(),ie.arc(Qe.sx,Qe.sy-18,17,0,Math.PI*2),ie.strokeStyle="rgba(36, 23, 19, 0.52)",ie.lineWidth=5,ie.stroke(),ie.beginPath(),ie.arc(Qe.sx,Qe.sy-18,17,-Math.PI*.5,-Math.PI*.5+Math.PI*2*Q),ie.strokeStyle="#fde047",ie.lineCap="round",ie.lineWidth=3.5,ie.stroke(),ie.restore()}}Gt++,!de&&Gt%6===0&&!a.photoModeActive&&d.renderMinimap(a.minimapCanvas,n,i)}Mt=requestAnimationFrame(ks)}Mt=requestAnimationFrame(ks),document.addEventListener("visibilitychange",()=>{document.hidden?(Mt&&(cancelAnimationFrame(Mt),Mt=0),n.saveToStorage(),Rs(),l.pause()):(os=performance.now(),l.resume(),Mt||(Mt=requestAnimationFrame(ks)))});const Za=()=>{n.saveToStorage(),Rs()};window.addEventListener("pagehide",Za),window.addEventListener("beforeunload",Za)}function Pa(e,t){const s=document.createElement("div");s.className="hpvn-stop",s.innerHTML='<div><h2></h2><p></p><button type="button">Tải lại</button></div>',s.querySelector("h2").textContent=e,s.querySelector("p").textContent=t,s.querySelector("button").addEventListener("click",()=>window.location.reload()),document.body.appendChild(s)}pl().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e),e?.hpvn?Pa("Cần mở game từ HPVN",e.message):Pa("Chưa tải được trang trại","Máy chủ HPVN chưa trả lời. Kiểm tra mạng rồi tải lại.")});export{fl as a,Jt as b,hr as c,ur as l,di as w};
