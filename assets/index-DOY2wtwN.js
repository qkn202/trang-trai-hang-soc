const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-cb1LGc61.js","assets/game-data-k4NCjdHW.js","assets/sim-C7vfV02g.js","assets/engine-Dz--EfFJ.js","assets/puzzleArcadeModal-DzK4OX6v.js"])))=>i.map(i=>d[i]);
var Li=Object.defineProperty;var Ai=(e,t,n)=>t in e?Li(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var w=(e,t,n)=>Ai(e,typeof t!="symbol"?t+"":t,n);import{F as Te,af as mn,ag as Pi,b as ft,w as $e,ah as Ei,g as le,ai as Lt,aj as ts,Q as hn,G as Ee,ae as Ie,P as ot,q as tn,ak as Hs,M as Ke,o as Fe,al as Is,Z as Gn,p as qi,u as Hi,j as ct,s as _e,$ as At,A as Ge,r as xt,E as Ii,I as Bi,N as Bs,R as Ds,y as Di,D as Wt,U as Ni,H as vt,am as kt,S as Oi,an as Ri,W as Ns,X as Os,k as Rt,C as bn,_ as fn,z as ns,B as zi,V as Fi,T as ss,a2 as Gi}from"./game-data-k4NCjdHW.js";import{i as Vi,A as yt,n as _i,j as Ye,k as Rs,l as is,H as Ze,L as zt,M as as,m as os,u as Ui,o as ji,p as Wi,q as rs,t as St,v as ls,w as Pe,x as Qi,y as Xi,z as cs,B as vn,C as fe,D as Ft,F as Tt,G as Ki,I as wt,J as Gt,K as Yi,N as Zi,O as Ji,P as En,Q as ds,R as ea,S as ta,U as na,V as ps,W as us,X as rt,Y as sa,Z as zs,_ as ia,$ as aa,a0 as Qt,a1 as oa,a2 as Fs,a3 as mt,a4 as Vn,a5 as ra,a6 as nn,a7 as la,a8 as ca,a9 as Gs,aa as st,ab as De,ac as da,ad as Xt,ae as pa,af as ua,ag as gs,ah as ga,ai as it,aj as $t,ak as Pt,d as ma,al as yn,am as Sn,an as ha,ao as ba,ap as fa,aq as va,ar as ya,as as Sa,at as wa,au as wn,g as xn,av as Vt,E as ms,s as xa,aw as Tn}from"./sim-C7vfV02g.js";import{S as Ta,I as $a,i as hs}from"./engine-Dz--EfFJ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const _t={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function Ca(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const n=t.documentElement;n.setAttribute("data-colorblind",e.colorblindMode),n.setAttribute("data-font-scale",String(e.fontScale)),n.setAttribute("data-high-contrast",e.highContrast?"true":"false"),n.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function ka(e,t){t.ceiling.setAllVolumes(e.volumes)}const Vs=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],Ma=.18;function Ut(e,t=Ma){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const n=e<0?-1:1,o=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((n*Math.min(1,o)).toFixed(3))}function La(e,t){if(Math.hypot(e,t)<.35)return null;let o=Math.atan2(t,e);o<0&&(o+=Math.PI*2);const i=Math.PI*2/8,a=(o+i*.5)%(Math.PI*2);return Math.floor(a/i)%8}class Aa{constructor(){w(this,"prevConfirm",!1);w(this,"prevCancel",!1);w(this,"prevDpadUp",!1);w(this,"prevDpadDown",!1);w(this,"prevDpadLeft",!1);w(this,"prevDpadRight",!1)}poll(t){let n=t??null;if(!n&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const S=navigator.getGamepads();for(const L of S)if(L&&L.connected){n=L;break}}if(!n)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const o=Ut(n.axes[0]??0),i=Ut(n.axes[1]??0),a=Ut(n.axes[2]??0),r=Ut(n.axes[3]??0),l=!!n.buttons[0]?.pressed,s=!!n.buttons[1]?.pressed,d=!!n.buttons[4]?.pressed,c=!!n.buttons[12]?.pressed,u=!!n.buttons[13]?.pressed,p=!!n.buttons[14]?.pressed,g=!!n.buttons[15]?.pressed,m=l&&!this.prevConfirm,T=s&&!this.prevCancel,h=(g&&!this.prevDpadRight?1:0)-(p&&!this.prevDpadLeft?1:0),y=(u&&!this.prevDpadDown?1:0)-(c&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=s,this.prevDpadUp=c,this.prevDpadDown=u,this.prevDpadLeft=p,this.prevDpadRight=g;const C=d,v=C?La(Math.abs(a)>0?a:o,Math.abs(r)>0?r:i):null,k=v!==null?Vs[v]?.actionId??null:null;return{connected:!0,panDx:C?0:o,panDy:C?0:i,cursorStepGx:h,cursorStepGy:y,radialOpen:C,radialSliceIndex:v,radialActionId:k,confirmJustPressed:m,cancelJustPressed:T}}}let _s=null,He=null,Le=null,$n=null;function Us(e){!Le&&typeof document<"u"&&(Le=document.getElementById("a11y-announcer")),!(!Le||!e)&&(Le.textContent="",requestAnimationFrame(()=>{Le&&(Le.textContent=e)}))}function Pa(e){const t=e.state.buildings.find(o=>o.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const n=Date.now();if(t.constructEndsAt>n)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-n)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const o=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-n)/1e3)),i=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${o} giây, tổng ${i} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function qn(e){const t=e??_s;if(!t||(!He&&typeof document<"u"&&(He=document.getElementById("a11y-farm-status")),!He))return;const n=t.state,o=n.level,i=n.galleons.toLocaleString("vi-VN"),a=n.sandboxMode?"Vô hạn":String(n.match3?.stars??0),r=n.timeSand,l=n.farmBarn?.owlOrders??[],s=l.filter(u=>t.canFulfillFarmOwlOrder(u)).length,d=`${l.length} đơn hàng (${s} đơn đủ nông sản sẵn sàng giao)`,c=Pa(t);He.innerHTML=`
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${o}</td></tr>
        <tr><th scope="row">Vàng Galleon</th><td>${i} Galleons</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${a}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${r}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${d}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${c}</td></tr>
      </tbody>
    </table>
  `.trim()}function Ea(e){_s=e,!(typeof document>"u")&&(Le||(Le=document.getElementById("a11y-announcer"),Le||(Le=document.createElement("div"),Le.id="a11y-announcer",Le.className="visually-hidden",Le.setAttribute("aria-live","polite"),Le.setAttribute("aria-atomic","true"),document.body.appendChild(Le))),He||(He=document.getElementById("a11y-farm-status"),He||(He=document.createElement("div"),He.id="a11y-farm-status",He.className="visually-hidden",He.setAttribute("role","region"),He.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(He))),qn(e),$n&&clearInterval($n),$n=setInterval(()=>{qn()},5e3))}const Cn={init:Ea,announce:Us,refresh:()=>qn()},qa={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function jt(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const t=navigator.userActivation;if(t&&!t.hasBeenActive)return!1;try{const n=qa[e]??15;return navigator.vibrate(n)}catch{return!1}}function ge(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function bs(e){return e===1?"🥇 1":e===2?"🥈 2":e===3?"🥉 3":`#${e}`}function fs(e){return e.replace(/\s*\(Bạn\)\s*$/u,"").trim()||e}const vs=`
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
`;class Ha{constructor(t,n){w(this,"activeGameId","match3");w(this,"activeScope","valley");w(this,"activeHouseFilter","all");w(this,"redirectedFromUnscored",null);w(this,"onJumpToGame");w(this,"onVisitNeighbor");w(this,"onOpenNeighborBook");w(this,"root");w(this,"sim");w(this,"closeBound",!1);w(this,"sortingHatSpinning",!1);w(this,"profileDrawerOpen",!1);w(this,"profileDraftName",null);w(this,"profileDraftHouse",null);w(this,"sortingHatAnnouncement","");w(this,"toastTimer",null);w(this,"liveTimer",null);this.root=t,this.sim=n,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");if(t?t.querySelector(".cc-lb-card")||(t.classList.add("cc-lb-dialog"),t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=vs):(t=document.createElement("dialog"),t.id="leaderboardDialog",t.className="cc-lb-dialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=vs,this.root.appendChild(t)),!this.closeBound&&(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype))){const n=(i,a)=>{const r=a.getBoundingClientRect();return i.clientX<r.left||i.clientX>r.right||i.clientY<r.top||i.clientY>r.bottom};let o=!1;t.addEventListener("pointerdown",i=>{o=n(i,t)}),t.addEventListener("pointerup",i=>{o&&n(i,t)&&t.close(),o=!1})}return t}showInDialogToast(t){const n=this.root.querySelector("#leaderboardDialogToast"),o=this.root.querySelector("#leaderboardLiveAnnouncer");n&&(n.textContent=t,n.hidden=!1,this.toastTimer!==null&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{n.hidden=!0,this.toastTimer=null},2800)),o&&(this.liveTimer!==null&&window.clearTimeout(this.liveTimer),o.textContent="",this.liveTimer=window.setTimeout(()=>{o.textContent=t,this.liveTimer=null},50))}open(t,n,o){t?Vi(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=yt.includes(this.activeGameId)?this.activeGameId:_i(t)):(this.redirectedFromUnscored=null,yt.includes(this.activeGameId)||(this.activeGameId="match3")),(n==="valley"||n==="friends"||n==="personal")&&(this.activeScope=n),(o==="all"||o&&Ye.includes(o))&&(this.activeHouseFilter=o),this.profileDraftName=null,this.profileDraftHouse=null,this.sortingHatAnnouncement="";const i=this.ensureDialogMounted();this.render(),i.open||i.showModal(),this.scrollSelectedGameTabIntoView(),Rs(this.sim.state).catch(()=>{}).then(()=>Promise.all(yt.map(a=>is(a)))).then(()=>{i.open&&!this.profileDrawerOpen&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}scrollSelectedGameTabIntoView(t=!1){const n=this.root.querySelector('.cc-lb-game-tabs [role="tab"][aria-selected="true"]');if(n&&(t&&n.focus(),typeof n.scrollIntoView=="function"))try{n.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"})}catch{n.scrollIntoView({block:"nearest",inline:"nearest"})}}getCurrentWizardDisplayName(){return this.sim.state.neighborSocial?.playerDisplayName?.trim()||this.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc"}renderHouseCupGridHtml(t){return`
      <div class="cc-hourglass-grid" id="house-cup-grid">
        ${t.map(o=>{const i=o.meta,a=this.activeHouseFilter===o.house;return`
          <button
            type="button"
            class="cc-house-cup-card cc-house-${i.cssSlug} ${o.isPlayerHouse?"is-player-house":""} ${a?"is-filtered-house":""}"
            data-lb-house-card="${o.house}"
            aria-pressed="${a}"
          >
            <div class="cc-house-cup-top">
              <span class="cc-house-cup-crest" aria-hidden="true">${i.emblemSvg}</span>
              <div class="cc-house-cup-meta">
                <div class="cc-house-cup-name-row">
                  <strong>#${o.rank} ${ge(i.house)}</strong>
                  ${o.isPlayerHouse?'<span class="cc-house-you-pill">Bạn</span>':""}
                </div>
                <div class="cc-house-cup-stats">${o.members} thành viên • ${o.totalStars.toLocaleString("vi-VN")} ★</div>
              </div>
              <span class="cc-house-cup-hourglass" aria-hidden="true">${i.hourglassSvg}</span>
            </div>
            <div class="cc-house-cup-points">${o.points.toLocaleString("vi-VN")} đ</div>
            <div
              class="cc-hourglass-bar"
              role="progressbar"
              aria-valuenow="${o.fillPercent}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Điểm Cúp Nhà ${ge(i.house)}"
            >
              <div class="cc-hourglass-bar-fill" style="width:${o.fillPercent}%"></div>
            </div>
          </button>
        `}).join("")}
      </div>
    `}renderProfileDrawerHtml(t){if(!this.profileDrawerOpen)return"";const n=!!(this.sim.state.minigameLeaderboard?.playerHouseLockedByServer&&this.sim.state.minigameLeaderboard?.playerHouse),o=n?t:this.profileDraftHouse??t,i=this.profileDraftName??this.getCurrentWizardDisplayName(),a=Ze[o]??Ze.Gryffindor,r=Ye.map(s=>{const d=Ze[s],c=s===o;return`
        <label class="cc-house-option ${c?"selected":""}" data-cc-house-opt="${s}">
          <input
            type="radio"
            name="ccWizardHouse"
            value="${s}"
            ${c?"checked":""}
            ${n?"disabled":""}
          />
          <span class="cc-house-option-crest" aria-hidden="true">${d.emblemSvg}</span>
          <span class="cc-house-option-info">
            <strong>${ge(d.house)} (${ge(d.vnTitle)})</strong>
            <small>${d.patronusEmoji} ${ge(d.patronusNameVi)} • ${ge(d.traitsVi)}</small>
          </span>
        </label>
      `}).join(""),l=this.sortingHatAnnouncement||`${a.patronusEmoji} ${a.house}: ${a.quoteVi}`;return`
      <form id="ccLbProfileForm" class="cc-profile-drawer">
        <div class="cc-profile-header">
          <h3 class="cc-profile-heading">🎩 Hồ Sơ Phù Thủy &amp; Lễ Phân Loại Nhà</h3>
          ${n?`<span class="cc-server-house-badge">🏰 Đồng bộ tài khoản HPVN: ${a.mascotEmoji} ${ge(t)}</span>`:""}
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
              value="${ge(i)}"
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

        <p id="ccSortingHatQuote" class="cc-dialog-lead">${ge(l)}</p>

        <div class="cc-profile-actions">
          <button type="submit" class="cc-pill-btn cc-btn-pink cc-btn-save-profile">
            💾 Cập Nhật Hồ Sơ
          </button>
          <button type="button" id="btnLbCloseProfileDrawer" class="cc-pill-btn cc-btn-slate">
            Thu gọn
          </button>
        </div>
      </form>
    `}renderControlsBarHtml(t){const n=zt[this.activeGameId],o=`
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
    `,i=this.activeScope==="personal"?"":`
      <div class="cc-lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc theo Nhà Hogwarts">
        <button
          type="button"
          class="cc-filter-pill ${this.activeHouseFilter==="all"?"active":""}"
          data-lb-house-filter="all"
          aria-pressed="${this.activeHouseFilter==="all"}"
        >
          Tất Cả
        </button>
        ${Ye.map(a=>{const r=Ze[a],l=this.activeHouseFilter===a;return`
            <button
              type="button"
              class="cc-filter-pill ${l?"active":""}"
              data-lb-house-filter="${a}"
              aria-pressed="${l}"
            >
              ${r.mascotEmoji} ${ge(r.house)}
            </button>
          `}).join("")}
      </div>
    `;return`
      <div class="cc-lb-controls">
        <div class="cc-lb-filters-stack">
          ${o}
          ${i}
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
            ▶️ ${ge(n.shortVi)}
          </button>
        </div>
      </div>
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const n=zt[this.activeGameId],o=this.root.querySelector("#leaderboardDialogTitle");o&&(o.textContent=`🏆 Bảng Xếp Hạng & Cúp 4 Nhà • ${n.shortVi}`);const i=yt.map(l=>{const s=zt[l],d=this.sim.getPlayerMinigameRank(l,"valley"),c=l===this.activeGameId;return`
        <button
          id="ccLbTab-${l}"
          type="button"
          role="tab"
          aria-selected="${c}"
          tabindex="${c?"0":"-1"}"
          data-lb-game="${l}"
          class="cc-lb-game-tab"
        >
          <img src="${s.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
          <span class="cc-lb-tab-label">${ge(s.shortVi)}</span>
          <span class="cc-lb-tab-rank">${d<=3?"👑 ":""}#${d}</span>
        </button>
      `}).join(""),a=this.redirectedFromUnscored?`<div class="cc-lb-unscored-note" role="note">
          📌 <strong>${ge(zt[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không tính điểm — dưới đây là Cúp 4 Nhà &amp; Bảng Xếp Hạng của <strong>4 môn tranh cúp</strong> (Bùa Gặt • Số Học • Sinh Vật • Tranh Ghép).
        </div>`:"",r=this.activeScope==="personal"?this.renderPersonalThreeGamesViewHtml():this.renderStandingViewHtml(this.activeScope);t.innerHTML=`
      <div class="cc-lb-shell">
        ${a}
        <div class="cc-lb-game-tabs" role="tablist" aria-label="Chọn bộ môn tranh cúp">
          ${i}
        </div>
        <div id="ccLbTabPanel" role="tabpanel" aria-labelledby="ccLbTab-${this.activeGameId}">
          <div class="cc-lb-panel-body">
            ${r}
          </div>
        </div>
      </div>
    `,this.bindEvents(t)}renderStandingRowHtml(t){const n=bs(t.rank),o=Ze[t.house]??Ze.Gryffindor,i=t.isPlayer?fs(t.name):t.name,a=t.isPlayer?'<span class="cc-lb-you-tag"> (Bạn)</span>':t.isSeededRival?'<span class="cc-lb-npc-tag"> • Mẫu</span>':t.isCloudPlayer?'<span class="cc-lb-cloud-tag"> • Online</span>':t.isFriend?'<span class="cc-lb-friend-tag"> • Bạn</span>':"",r=!t.isPlayer&&t.neighborId?`<button
            type="button"
            class="cc-lb-visit-btn"
            data-lb-visit="${ge(t.neighborId)}"
            aria-label="Thăm điền trang của ${ge(i)}"
          >🏡 Thăm</button>`:"",l=t.primaryValue>=as?"👑 777/777":`Màn ${Math.max(0,t.primaryValue)}`;return`
      <tr class="${t.isPlayer?"me-row":""}">
        <td class="cc-lb-rank-cell"><strong>${ge(n)}</strong></td>
        <th scope="row" class="cc-lb-name-cell">
          <div class="cc-lb-name-wrap">
            <span class="cc-lb-mobile-rank" aria-hidden="true">${ge(n)}</span>
            <span class="cc-lb-avatar" aria-hidden="true">${ge(t.avatarEmoji)}</span>
            <span class="cc-lb-wiz-name">${ge(i)}</span>
            ${a}
            ${r}
          </div>
        </th>
        <td class="cc-lb-house-cell cc-house-ink-${o.cssSlug}">
          <strong>${o.mascotEmoji} ${ge(o.house)}</strong>
        </td>
        <td>${ge(l)}</td>
        <td>
          <span class="cc-star-glyph" aria-hidden="true">★</span> ${t.stars.toLocaleString("vi-VN")}
        </td>
        <td>
          <strong class="cc-lb-score-val">${t.ratingScore.toLocaleString("vi-VN")}</strong>
        </td>
      </tr>
    `}renderStandingViewHtml(t){const n=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:o,entries:i,playerEntry:a,playerRank:r,totalEntries:l,nextRivalAbove:s,houseStandings:d,playerHouse:c,includeSeededRivals:u}=n,p=s?`🎯 Đang đuổi <strong>#${s.rank} ${ge(fs(s.name))}</strong> (${ge(s.primaryDisplayVi)} • ${s.ratingScore.toLocaleString("vi-VN")} đ)`:`👑 Đang dẫn đầu <strong>#1</strong> môn ${ge(o.shortVi)}!`,g=i.length>0?i.map(m=>this.renderStandingRowHtml(m)).join(""):`
          <tr>
            <td colspan="6" class="cc-lb-empty-cell">
              Chưa có phù thủy nào thuộc Nhà này trên bảng xếp hạng. Hãy vượt ải ghi điểm ngay!
            </td>
          </tr>
        `;return`
      ${this.renderHouseCupGridHtml(d)}
      ${this.renderProfileDrawerHtml(c)}
      ${this.renderControlsBarHtml(u)}

      <div class="cc-lb-status-strip">
        <div class="cc-lb-status-me">
          <img src="${o.spriteIcon}" alt="" class="cc-lb-status-icon" />
          <span>Hạng của bạn: <strong>#${r}/${l}</strong></span>
          <span class="cc-league-pill tier-${a.league.tierId}">
            ${a.league.icon} ${ge(a.league.labelVi)}
          </span>
          <span class="cc-lb-me-stars"><span class="cc-star-glyph" aria-hidden="true">★</span> ${a.stars.toLocaleString("vi-VN")}</span>
        </div>
        <div class="cc-lb-status-chase">${p}</div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="ccLbTableCaption" class="cc-lb-table-wrap">
        <table
          class="cc-lb-table"
          style="--label-3: 'Nhà'; --label-4: 'Tiến độ'; --label-5: 'Sao'; --label-6: 'Tổng điểm';"
        >
          <caption id="ccLbTableCaption" class="cc-lb-caption">
            ${ge(o.cupTitleVi)} — Hiển thị ${i.length}/${l} phù thủy
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
            ${g}
          </tbody>
        </table>
      </div>
    `}renderPersonalThreeGamesViewHtml(){const t=this.sim.getMinigameLeaderboard(this.activeGameId,"valley","all"),o=this.sim.getAllPersonalLeaderboardSummaries().map(i=>{const a=i.gameId===this.activeGameId,r=bs(i.valleyRank),l=i.primaryValue>=as?"👑 777/777":`Màn ${Math.max(0,i.primaryValue)}/777`;return`
          <tr class="${a?"me-row":""}">
            <td class="cc-lb-rank-cell"><strong>${ge(r)}</strong></td>
            <th scope="row" class="cc-lb-name-cell">
              <div class="cc-lb-name-wrap">
                <span class="cc-lb-mobile-rank" aria-hidden="true">${ge(r)}</span>
                <img src="${i.meta.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
                <span class="cc-lb-wiz-name">${ge(i.meta.shortVi)}</span>
                <button
                  type="button"
                  class="cc-lb-visit-btn"
                  data-lb-jump-play="${i.gameId}"
                  aria-label="Chơi ngay ${ge(i.meta.shortVi)}"
                >▶️ Chơi</button>
              </div>
            </th>
            <td>
              <span class="cc-league-pill tier-${i.league.tierId}">${i.league.icon} ${ge(i.league.labelVi)}</span>
            </td>
            <td>${ge(l)}</td>
            <td><span class="cc-star-glyph" aria-hidden="true">★</span> ${i.stars.toLocaleString("vi-VN")}</td>
            <td><strong class="cc-lb-score-val">${i.ratingScore.toLocaleString("vi-VN")}</strong></td>
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
    `}selectGameDiscipline(t,n=!1){yt.includes(t)&&(this.sim.audio.playClick(),this.activeGameId=t,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),this.scrollSelectedGameTabIntoView(n),os(this.sim.state,t).catch(()=>{}).then(()=>is(t)).then(()=>{this.activeGameId===t&&!this.profileDrawerOpen&&this.render()}))}bindEvents(t){const n=Array.from(t.querySelectorAll("[data-lb-game]"));n.forEach((i,a)=>{i.addEventListener("click",()=>{const r=i.dataset.lbGame;r&&this.selectGameDiscipline(r,!1)}),i.addEventListener("keydown",r=>{if(n.length===0)return;let l=-1;if(r.key==="ArrowRight"?l=(a+1)%n.length:r.key==="ArrowLeft"?l=(a-1+n.length)%n.length:r.key==="Home"?l=0:r.key==="End"&&(l=n.length-1),l>=0){r.preventDefault();const s=n[l]?.dataset.lbGame;s&&this.selectGameDiscipline(s,!0)}})}),t.querySelectorAll("[data-lb-scope]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.lbScope;a&&(this.sim.audio.playClick(),this.activeScope=a,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.lbHouseFilter;a&&(this.sim.audio.playClick(),a==="all"?this.activeHouseFilter="all":Ye.includes(a)&&(this.activeHouseFilter=a),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.lbHouseCard;!a||!Ye.includes(a)||(this.sim.audio.playClick(),this.activeScope==="personal"&&(this.activeScope="valley"),this.activeHouseFilter=this.activeHouseFilter===a?"all":a,this.render())})}),t.querySelector("#btnLbToggleProfile")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!this.profileDrawerOpen,this.profileDrawerOpen&&(this.profileDraftName=this.getCurrentWizardDisplayName(),this.profileDraftHouse=this.sim.getPlayerHouse()),this.render(),this.profileDrawerOpen&&t.querySelector("#ccWizardNameInput")?.focus()}),t.querySelector("#btnLbCloseProfileDrawer")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!1,this.render()});const o=t.querySelector("#ccWizardNameInput");o?.addEventListener("input",()=>{this.profileDraftName=o.value}),t.querySelectorAll('input[name="ccWizardHouse"]').forEach(i=>{i.addEventListener("change",()=>{const a=i.value;if(!Ye.includes(a))return;this.sim.audio.playClick(),this.profileDraftHouse=a;const r=Ze[a];this.sortingHatAnnouncement=`${r.patronusEmoji} ${r.house}: ${r.quoteVi}`,t.querySelectorAll(".cc-house-option").forEach(s=>{s.classList.toggle("selected",s.dataset.ccHouseOpt===a)});const l=t.querySelector("#ccSortingHatQuote");l&&(l.textContent=this.sortingHatAnnouncement)})}),t.querySelector("#btnLbRandomHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0,o&&(this.profileDraftName=o.value);const i=this.sim.rollPlayerSortingHat(this.activeGameId);let a=0;const r=7,l=()=>{if(a+=1,a<r){const d=Ye[Math.floor(Math.random()*Ye.length)]??i;this.profileDraftHouse=d,t.querySelectorAll(".cc-house-option").forEach(c=>{c.classList.toggle("selected",c.dataset.ccHouseOpt===d)}),window.setTimeout(l,65);return}this.sortingHatSpinning=!1,this.profileDraftHouse=i;const s=Ze[i];this.sortingHatAnnouncement=`🎩 NÓN PHÂN LOẠI CHỌN: “${s.house.toUpperCase()}!” — ${s.quoteVi}`,this.activeHouseFilter!=="all"&&(this.activeHouseFilter=i),this.render(),this.showInDialogToast(`🎩 Nón Phân Loại đã chọn Nhà ${s.house} cho bạn!`)};l()}),t.querySelector("#ccLbProfileForm")?.addEventListener("submit",i=>{i.preventDefault();const a=o?.value??this.getCurrentWizardDisplayName(),r=this.profileDraftHouse??this.sim.getPlayerHouse();this.sim.ensureNeighborSocial();const l=Ui(this.sim.state,a,r);l.houseLockedByServer?(this.sim.saveToStorage(),this.sim.onUiChange?.(),os(this.sim.state,this.activeGameId)):this.sim.setPlayerHouse(l.house,this.activeGameId),this.profileDrawerOpen=!1,this.profileDraftName=l.name,this.profileDraftHouse=l.house,this.render(),this.showInDialogToast(`✨ Đã lưu hồ sơ Phù Thủy ${l.name} (${l.house})!`)}),t.querySelector("#btnLbExportCsv")?.addEventListener("click",()=>{this.sim.audio.playClick();const i=this.activeScope==="friends"?"friends":"valley",a=ji(this.sim.state,this.activeGameId,i,this.activeHouseFilter,Wi(this.activeGameId)),r=new Blob(["\uFEFF"+a],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(r),s=document.createElement("a"),d=new Date().toISOString().slice(0,10);s.href=l,s.download=`bxh-${this.activeGameId}-hpvn-${d}.csv`,s.click(),URL.revokeObjectURL(l),this.showInDialogToast("📥 Đã xuất file CSV Bảng Xếp Hạng!")}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const i=this.activeGameId;this.close(),this.onJumpToGame?.(i)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.lbJumpPlay;a&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(a))})}),t.querySelectorAll("[data-lb-visit]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.lbVisit;a&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(a))})})}}const ys=1,sn=3,Ia=6,Ss=.15,Ba="hangsoc_minigame_orient_v1",Da=8,Na=110;function Ct(e){return e==="jigsaw"?Ia:sn}function lt(e,t=sn){if(!Number.isFinite(e))return 1;const n=typeof t=="string"?Ct(t):t,o=Number.isFinite(n)&&n>=ys?n:sn,i=Math.min(o,Math.max(ys,e));return Math.round(i*1e3)/1e3}function kn(e,t){return((Math.round(e)+Math.round(t))%4+4)%4}function Oa(e,t,n,o=!1,i=!1){const a=Math.max(1,t||1024),r=Math.max(1,n||768),l=i?a>=881||a>r*1.05&&a>=560:a>=980||a>r*1.06&&a>=560;return e==="auto"?{effectiveLayout:l?"landscape":"portrait",dialogQuarterTurn:0}:e==="landscape"?a<r?{effectiveLayout:"landscape",dialogQuarterTurn:o?3:1}:{effectiveLayout:"landscape",dialogQuarterTurn:0}:a>r&&r<=640?{effectiveLayout:"portrait",dialogQuarterTurn:o?1:3}:{effectiveLayout:"portrait",dialogQuarterTurn:0}}function Mn(e,t,n,o){const i=(e-n.left)/Math.max(1,n.width),a=(t-n.top)/Math.max(1,n.height);switch(o){case 1:return{lu:a,lv:1-i};case 2:return{lu:1-i,lv:1-a};case 3:return{lu:1-a,lv:i};default:return{lu:i,lv:a}}}function ws(e,t,n){switch(n){case 1:return{vx:t,vy:-e};case 2:return{vx:-e,vy:-t};case 3:return{vx:-t,vy:e};default:return{vx:e,vy:t}}}function xs(e){const{prevZoom:t,nextZoom:n,prevPanX:o,prevPanY:i,prevMidOffsetX:a,prevMidOffsetY:r,currMidOffsetX:l,currMidOffsetY:s,maxZoom:d=sn}=e,c=n<=1.015?1:lt(n,d);if(c<=1.001)return{zoom:1,panX:0,panY:0};const u=Math.max(.25,t||1),p=c/u;return{zoom:c,panX:l-(a-o)*p,panY:s-(r-i)*p}}function Ra(e,t,n,o,i){if(i%2===0||e<=10||t<=10||n<=10||o<=10)return 1;const a=e/o,r=t/n;return Math.min(1,Math.max(.45,Math.min(a,r)))}function za(e,t,n,o=1){const i=Math.max(120,Math.floor(Number.isFinite(t)?t:320)),a=Math.max(120,Math.floor(Number.isFinite(n)?n:320));if(e==="blocks"||e==="jigsaw"||e==="seedquiz"||!Number.isFinite(o)||o<=0)return{width:i,height:a};const r=Math.min(3,Math.max(.33,o));let l=i,s=Math.round(l/r);return s>a&&(s=a,l=Math.round(s*r)),{width:Math.max(120,Math.min(i,l)),height:Math.max(120,Math.min(a,s))}}function Fa(e,t,n,o,i,a,r,l){if(n<=0||o<=0||i<=0||a<=0||r<=1.005)return{panX:0,panY:0};const s=l%2===1?a:i,d=l%2===1?i:a,c=s*r,u=d*r,p=36,g=36,m=Math.max(0,(c-n)*.5+p),T=Math.max(0,(u-o)*.5+g),h=Math.min(m,Math.max(-m,Number.isFinite(e)?e:0)),y=Math.min(T,Math.max(-T,Number.isFinite(t)?t:0));return{panX:Math.abs(h)<.5?0:Math.round(h*10)/10,panY:Math.abs(y)<.5?0:Math.round(y*10)/10}}class Ga{constructor(){w(this,"states",new Map);w(this,"orientationPref","auto");w(this,"dialogFlip180",!1);w(this,"spacePressed",!1);w(this,"lastPinchEndMs",0);w(this,"activePinchCount",0);w(this,"stageCleanupByHost",new Map);try{typeof sessionStorage<"u"&&sessionStorage.removeItem(Ba)}catch{}typeof window<"u"&&(window.addEventListener("keydown",t=>{if(t.code==="Space"){const n=t.target?.tagName;n!=="INPUT"&&n!=="TEXTAREA"&&n!=="BUTTON"&&(this.spacePressed=!0)}}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1)}),window.addEventListener("blur",()=>{this.spacePressed=!1}))}isPinchOrCooldownActive(){return this.activePinchCount>=2?!0:(typeof performance<"u"?performance.now():Date.now())-this.lastPinchEndMs<Na}getState(t){let n=this.states.get(t);return n||(n={zoom:1,panX:0,panY:0,boardQuarterTurns:0,panMode:!1},this.states.set(t,n)),n}getOrientationPref(){return this.orientationPref}setOrientationPref(t){this.orientationPref=t,this.dialogFlip180=!1}getViewportResolution(t=!1){const n=typeof window<"u"?Math.round(window.visualViewport?.width||window.innerWidth):1280,o=typeof window<"u"?Math.round(window.visualViewport?.height||window.innerHeight):800;return Oa(this.orientationPref,n,o,this.dialogFlip180,t)}unbindStageInteractions(t){const n=this.stageCleanupByHost.get(t);n&&(this.stageCleanupByHost.delete(t),n())}getEffectiveLayout(t=!1){return this.getViewportResolution(t).effectiveLayout}getNetQuarterTurns(t){const n=this.getState(t),{dialogQuarterTurn:o}=this.getViewportResolution(t==="seedquiz");return kn(o,n.boardQuarterTurns)}toggleOrientation(t=!1){const o=this.getEffectiveLayout(t)==="landscape"?"portrait":"landscape";this.setOrientationPref(o);for(const i of this.states.values())i.panX=0,i.panY=0;return o}stepZoom(t,n){const o=this.getState(t);return o.zoom=lt(o.zoom+n,Ct(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}setZoom(t,n){const o=this.getState(t);return o.zoom=lt(n,Ct(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}resetView(t){const n=this.getState(t);n.zoom=1,n.panX=0,n.panY=0,n.boardQuarterTurns=0,n.panMode=!1}rotate90(t){const n=this.getState(t);return n.boardQuarterTurns=kn(n.boardQuarterTurns,1),n.panX=0,n.panY=0,n.boardQuarterTurns}togglePanMode(t){const n=this.getState(t);return n.panMode=!n.panMode,n.panMode}renderToolbarHtml(t,n){return""}syncToolbarDOM(t,n){}applyDialogOrientation(t,n,o=!1){const i=this.getViewportResolution(o),a=String(i.dialogQuarterTurn*90);return t?.dataset&&(t.dataset.mgLayout=i.effectiveLayout,t.dataset.mgRotate=a),n?.dataset&&(n.dataset.mgLayout=i.effectiveLayout,n.dataset.mgRotate=a),i}clearDialogOrientation(t,n){t?.dataset&&(delete t.dataset.mgLayout,delete t.dataset.mgRotate),n?.dataset&&(delete n.dataset.mgLayout,delete n.dataset.mgRotate)}applyCanvasStageTransform(t,n,o){const i=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(!1),r=kn(a,i.boardQuarterTurns);if(!n||!o)return{effectiveScale:i.zoom,netQuarterTurns:r};const l=n.clientWidth,s=n.clientHeight,d=o.offsetWidth,c=o.offsetHeight,u=Ra(l,s,d,c,i.boardQuarterTurns),p=i.zoom*u,g=Fa(i.panX,i.panY,l,s,d,c,p,i.boardQuarterTurns);return i.panX=g.panX,i.panY=g.panY,n.dataset.mgPanMode=String(i.panMode),i.panX===0&&i.panY===0&&Math.abs(p-1)<.002&&i.boardQuarterTurns===0?(o.style.transform="",o.style.transformOrigin=""):(o.style.transformOrigin="center center",o.style.transform=i.boardQuarterTurns===0?`translate3d(${i.panX}px, ${i.panY}px, 0) scale(${p.toFixed(4)})`:`translate3d(${i.panX}px, ${i.panY}px, 0) scale(${p.toFixed(4)}) rotate(${i.boardQuarterTurns*90}deg)`),{effectiveScale:p,netQuarterTurns:r}}applyDomScrollStageTransform(t,n,o){const i=this.getState("seedquiz");if(!t||!n||!o)return;const a=i.zoom,r=i.boardQuarterTurns;if(Math.abs(a-1)<.002&&r===0){o.style.transform="",o.style.transformOrigin="",o.style.width="",n.style.width="",n.style.height="";return}o.style.width="100%";const l=o.offsetWidth||t.clientWidth||640,s=o.offsetHeight||480;if(r===0)o.style.transformOrigin="0 0",o.style.transform=`scale(${a.toFixed(4)})`,n.style.width=`${Math.ceil(l*a)}px`,n.style.height=`${Math.ceil(s*a)}px`;else{const d=r*90,c=(r%2===1?s:l)*a,u=(r%2===1?l:s)*a;n.style.width=`${Math.ceil(c)}px`,n.style.height=`${Math.ceil(u)}px`,o.style.transformOrigin="center center";const p=(c-l)*.5,g=(u-s)*.5;o.style.transform=`translate3d(${p.toFixed(1)}px, ${g.toFixed(1)}px, 0) scale(${a.toFixed(4)}) rotate(${d}deg)`}}bindCanvasStageInteractions(t){const{gameId:n,hostKey:o,panAreaEl:i,canvasShellEl:a,canvasEl:r,getBoardAspectRatio:l,onStageResized:s,canSingleFingerPanAt:d,onTransformUpdated:c}=t,u=o??(n==="match3"?"match3":"arcade");if(this.unbindStageInteractions(u),!i||!a)return;const p=()=>{this.applyCanvasStageTransform(n,i,a),c()};let g=0,m=0,T=0,h=0;const y=(P=!1)=>{if(!r||!i.isConnected)return;const D=Math.floor(i.clientWidth),q=Math.floor(i.clientHeight);if(D<=24||q<=24)return;const _=n==="blocks"||n==="jigsaw",Q=_?D:Math.max(120,D-2),re=_?q:Math.max(120,q-4),X=l?l(D,q):_?0:1,pe=za(n,Q,re,X);if(!(P||pe.width!==g||pe.height!==m||D!==T||q!==h))return;g=pe.width,m=pe.height,T=D,h=q,a.style.width=`${pe.width}px`,a.style.height=`${pe.height}px`;const ue=_?"auto":`${pe.width} / ${pe.height}`;a.style.aspectRatio=ue,r.style.aspectRatio=ue,s?.(D,q,pe.width,pe.height),this.applyCanvasStageTransform(n,i,a),c()},C=P=>{P.touches&&P.touches.length>=2&&P.preventDefault()};i.addEventListener("touchmove",C,{passive:!1});const v=P=>{P.preventDefault()};i.addEventListener("gesturestart",v,{passive:!1}),i.addEventListener("gesturechange",v,{passive:!1}),i.addEventListener("wheel",P=>{P.preventDefault();const D=this.getState(n),q=P.ctrlKey?.009:.0018,_=D.zoom*Math.exp(-P.deltaY*q),Q=i.getBoundingClientRect(),{dialogQuarterTurn:re}=this.getViewportResolution(!1),{lu:X,lv:pe}=Mn(P.clientX,P.clientY,Q,re),me=(X-.5)*i.clientWidth,ue=(pe-.5)*i.clientHeight,Ce=xs({prevZoom:D.zoom,nextZoom:_,prevPanX:D.panX,prevPanY:D.panY,prevMidOffsetX:me,prevMidOffsetY:ue,currMidOffsetX:me,currMidOffsetY:ue,maxZoom:Ct(n)});Ce.zoom===D.zoom&&Ce.panX===D.panX&&Ce.panY===D.panY||(D.zoom=Ce.zoom,D.panX=Ce.panX,D.panY=Ce.panY,p())},{passive:!1}),i.addEventListener("contextmenu",P=>{this.getState(n).zoom>1.01&&P.preventDefault()});const k=new Map;let S=!1,L=0,x=0,A=0,M=null,O=null,U=0,I=0;const V=P=>{if(r){try{r.releasePointerCapture?.(P)}catch{}if(typeof PointerEvent<"u")try{r.dispatchEvent(new PointerEvent("pointercancel",{pointerId:P,bubbles:!0}))}catch{}}};i.addEventListener("pointerdown",P=>{if(P.pointerType==="touch"){if(k.set(P.pointerId,{x:P.clientX,y:P.clientY}),this.activePinchCount=k.size,k.size>=2){M=null;const Q=Array.from(k.values());if(L=Math.max(10,Math.hypot(Q[1].x-Q[0].x,Q[1].y-Q[0].y)),x=(Q[0].x+Q[1].x)*.5,A=(Q[0].y+Q[1].y)*.5,S){V(P.pointerId);try{i.setPointerCapture?.(P.pointerId)}catch{}}else{S=!0;for(const re of k.keys()){V(re);try{i.setPointerCapture?.(re)}catch{}}}P.stopPropagation(),P.preventDefault();return}this.getState(n).zoom>1.02&&d&&d(P.clientX,P.clientY)?M={pointerId:P.pointerId,startX:P.clientX,startY:P.clientY,lastX:P.clientX,lastY:P.clientY,active:!1}:M=null;return}const D=this.getState(n);if(P.button===1||P.button===2&&D.zoom>1.01||P.button===0&&D.zoom>1.01&&(P.altKey||this.spacePressed)){O=P.pointerId,U=P.clientX,I=P.clientY,i.dataset.mgDragging="true";try{i.setPointerCapture?.(P.pointerId)}catch{}P.stopPropagation(),P.preventDefault()}},{capture:!0}),i.addEventListener("pointermove",P=>{if(P.pointerType==="touch"&&k.has(P.pointerId)){if(k.set(P.pointerId,{x:P.clientX,y:P.clientY}),S&&k.size>=2){const D=Array.from(k.values()),q=Math.max(10,Math.hypot(D[1].x-D[0].x,D[1].y-D[0].y)),_=(D[0].x+D[1].x)*.5,Q=(D[0].y+D[1].y)*.5,re=this.getState(n),X=re.zoom*(q/Math.max(10,L)),pe=i.getBoundingClientRect(),{dialogQuarterTurn:me}=this.getViewportResolution(!1),ue=Mn(x,A,pe,me),Ce=Mn(_,Q,pe,me),ce=(ue.lu-.5)*i.clientWidth,be=(ue.lv-.5)*i.clientHeight,W=(Ce.lu-.5)*i.clientWidth,ve=(Ce.lv-.5)*i.clientHeight,Ae=xs({prevZoom:re.zoom,nextZoom:X,prevPanX:re.panX,prevPanY:re.panY,prevMidOffsetX:ce,prevMidOffsetY:be,currMidOffsetX:W,currMidOffsetY:ve,maxZoom:Ct(n)});re.zoom=Ae.zoom,re.panX=Ae.panX,re.panY=Ae.panY,L=q,x=_,A=Q,p(),P.stopPropagation(),P.preventDefault();return}if(S){P.stopPropagation(),P.preventDefault();return}if(M&&M.pointerId===P.pointerId){const D=Math.hypot(P.clientX-M.startX,P.clientY-M.startY);if(!M.active&&D>=Da){M.active=!0,M.lastX=P.clientX,M.lastY=P.clientY,i.dataset.mgDragging="true",V(P.pointerId);try{i.setPointerCapture?.(P.pointerId)}catch{}}if(M.active){const q=this.getState(n),{dialogQuarterTurn:_}=this.getViewportResolution(!1),Q=ws(P.clientX-M.lastX,P.clientY-M.lastY,_);q.panX+=Q.vx,q.panY+=Q.vy,M.lastX=P.clientX,M.lastY=P.clientY,p(),P.stopPropagation(),P.preventDefault();return}}}if(O===P.pointerId){const D=this.getState(n),{dialogQuarterTurn:q}=this.getViewportResolution(!1),_=ws(P.clientX-U,P.clientY-I,q);D.panX+=_.vx,D.panY+=_.vy,U=P.clientX,I=P.clientY,p(),P.stopPropagation(),P.preventDefault()}},{capture:!0});const j=P=>{if(P.pointerType==="touch"&&k.has(P.pointerId)){k.delete(P.pointerId),this.activePinchCount=k.size;try{i.releasePointerCapture?.(P.pointerId)}catch{}if(S){if(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now(),k.size===0)S=!1;else if(k.size>=2){const D=Array.from(k.values());L=Math.max(10,Math.hypot(D[1].x-D[0].x,D[1].y-D[0].y)),x=(D[0].x+D[1].x)*.5,A=(D[0].y+D[1].y)*.5}P.stopPropagation(),P.preventDefault();return}if(M&&M.pointerId===P.pointerId){const D=M.active;if(M=null,delete i.dataset.mgDragging,D){P.stopPropagation(),P.preventDefault();return}}}if(O===P.pointerId){O=null,delete i.dataset.mgDragging;try{i.releasePointerCapture?.(P.pointerId)}catch{}P.stopPropagation(),P.preventDefault()}};i.addEventListener("pointerup",j,{capture:!0}),i.addEventListener("pointercancel",j,{capture:!0});let ne=0;const se=()=>{ne||(typeof requestAnimationFrame=="function"?ne=requestAnimationFrame(()=>{ne=0,y(!1)}):y(!1))};let de=null;r&&typeof ResizeObserver<"u"&&(de=new ResizeObserver(()=>{se()}),de.observe(i));const te=typeof window<"u"?window.visualViewport:null,N=()=>{se()};r&&te&&te.addEventListener("resize",N),this.stageCleanupByHost.set(u,()=>{ne&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(ne),ne=0),de?.disconnect(),de=null,te?.removeEventListener("resize",N)}),y(!0),this.applyCanvasStageTransform(n,i,a)}bindDomScrollStageInteractions(t){const{scrollViewportEl:n,sizerEl:o,contentStageEl:i}=t,a="seedquiz",r=()=>{this.applyDomScrollStageTransform(n,o,i)};if(!n||!o||!i)return;const l=h=>{h.preventDefault()};n.addEventListener("gesturestart",l,{passive:!1}),n.addEventListener("gesturechange",l,{passive:!1}),n.addEventListener("wheel",h=>{if(!h.ctrlKey&&!h.metaKey)return;h.preventDefault();const y=this.getState(a),C=y.zoom,v=C*Math.exp(-h.deltaY*.007),k=v<=1.015?1:lt(v);if(k===C)return;const S=n.getBoundingClientRect(),L=h.clientX-S.left,x=h.clientY-S.top,A=n.scrollLeft,M=n.scrollTop;y.zoom=k,r();const O=y.zoom/Math.max(.25,C);n.scrollLeft=Math.max(0,(A+L)*O-L),n.scrollTop=Math.max(0,(M+x)*O-x)},{passive:!1});let s=0,d=0,c=0,u=!1;n.addEventListener("touchstart",h=>{if(h.touches.length>=2){u=!0,this.activePinchCount=h.touches.length;const y=h.touches[0],C=h.touches[1];s=Math.max(10,Math.hypot(C.clientX-y.clientX,C.clientY-y.clientY));const v=n.getBoundingClientRect();d=(y.clientX+C.clientX)*.5-v.left,c=(y.clientY+C.clientY)*.5-v.top}},{passive:!0}),n.addEventListener("touchmove",h=>{if(h.touches.length<2)return;h.preventDefault(),u=!0;const y=h.touches[0],C=h.touches[1],v=Math.max(10,Math.hypot(C.clientX-y.clientX,C.clientY-y.clientY)),k=n.getBoundingClientRect(),S=(y.clientX+C.clientX)*.5-k.left,L=(y.clientY+C.clientY)*.5-k.top;if(s>0){const x=this.getState(a),A=x.zoom,M=A*(v/s),O=M<=1.015?1:lt(M),U=n.scrollLeft,I=n.scrollTop;x.zoom=O,r();const V=x.zoom/Math.max(.25,A);n.scrollLeft=Math.max(0,(U+d)*V-S),n.scrollTop=Math.max(0,(I+c)*V-L)}s=v,d=S,c=L},{passive:!1});const p=h=>{if(this.activePinchCount=h.touches.length,h.touches.length<2)s>0&&(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now()),s=0;else{const y=h.touches[0],C=h.touches[1];s=Math.max(10,Math.hypot(C.clientX-y.clientX,C.clientY-y.clientY));const v=n.getBoundingClientRect();d=(y.clientX+C.clientX)*.5-v.left,c=(y.clientY+C.clientY)*.5-v.top}};n.addEventListener("touchend",p,{passive:!0}),n.addEventListener("touchcancel",p,{passive:!0});const g=new Map;let m=0;n.addEventListener("pointerdown",h=>{if(!(h.pointerType!=="touch"||u)&&(g.set(h.pointerId,{x:h.clientX,y:h.clientY}),g.size>=2)){const y=Array.from(g.values());m=Math.max(10,Math.hypot(y[1].x-y[0].x,y[1].y-y[0].y))}},{passive:!0}),n.addEventListener("pointermove",h=>{if(!(h.pointerType!=="touch"||u||!g.has(h.pointerId))&&(g.set(h.pointerId,{x:h.clientX,y:h.clientY}),g.size>=2&&m>0)){const y=Array.from(g.values()),C=Math.max(10,Math.hypot(y[1].x-y[0].x,y[1].y-y[0].y)),v=this.getState(a),k=v.zoom*(C/m);v.zoom=k<=1.015?1:lt(k),m=C,r(),h.preventDefault()}},{passive:!1});const T=h=>{g.delete(h.pointerId),g.size<2&&(m=0)};n.addEventListener("pointerup",T,{passive:!0}),n.addEventListener("pointercancel",T,{passive:!0}),r()}}const Ue=new Ga;function ie(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ln=["en","ko","zh","es","ja"],An=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class Va{constructor(t,n,o,i,a){w(this,"root");w(this,"sim");w(this,"onRefreshHud");w(this,"onToast");w(this,"onEquipAndSow");w(this,"targetCropId","ottery_wheat");w(this,"pendingPlotUid",null);w(this,"challenge",null);w(this,"answeredOutcome",null);w(this,"selectedChoiceIdx",null);w(this,"placedTokenIndices",[]);w(this,"selectedLeftPairId",null);w(this,"matchedPairIds",new Set);w(this,"flashWrongPairKey",null);w(this,"pairMistakes",0);w(this,"cropFilter","all");w(this,"activeSubView","practice");w(this,"codexQuery","");w(this,"codexBoxFilter","all");w(this,"sessionShownQids",new Set);w(this,"skipFormatOffset",0);w(this,"starterChallengePendingPack",!1);w(this,"dialogCloseBound",!1);w(this,"onOpenLeaderboard");if(this.root=t,this.sim=n,this.onRefreshHud=o,this.onToast=i,this.onEquipAndSow=a,typeof window<"u"){const r=()=>{if(!this.isOpen())return;const l=this.getDialog(),s=typeof l?.querySelector=="function"?l.querySelector(".sq-modal-inner"):null;Ue.applyDialogOrientation(l,s,!0),this.syncSeedQuizViewportTransform()};window.addEventListener("resize",r),window.visualViewport?.addEventListener("resize",r),window.addEventListener("keydown",l=>{if(!this.isOpen())return;const s=l.target?.tagName;s==="INPUT"||s==="TEXTAREA"||s==="SELECT"||(l.key==="+"||l.key==="="?(l.preventDefault(),Ue.stepZoom("seedquiz",Ss),this.syncSeedQuizViewportTransform()):l.key==="-"||l.key==="_"?(l.preventDefault(),Ue.stepZoom("seedquiz",-Ss),this.syncSeedQuizViewportTransform()):l.key==="0"&&(l.ctrlKey||l.metaKey)&&(l.preventDefault(),Ue.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))})}}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=t.querySelector("#sqScrollViewport"),o=t.querySelector("#sqZoomSizer"),i=t.querySelector("#sqZoomStage");Ue.applyDomScrollStageTransform(n,o,i),Ue.syncToolbarDOM(t,"seedquiz")}open(t,n,o,i,a,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(Te).filter(u=>this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel);if(t&&Te[t]){const u=Te[t];this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!Te[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=n??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const s=this.sim.ensureLanguageQuiz();let d=!this.challenge||this.answeredOutcome!==null;o&&Ln.includes(o)&&s.activeLang!==o&&(s.activeLang=o,d=!0),i&&(i==="beginner"||i==="intermediate"||i==="advanced")&&(rs(s,s.activeLang,i),d=!0),a&&An.includes(a)&&(s.preferredFormat=a,d=!0),d||this.challenge?.lang!==s.activeLang?(this.challenge&&!this.answeredOutcome&&St(s,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(s.activeLang,!1),this.render());const c=this.root.querySelector("#seedQuizDialog");c&&!c.open&&c.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const n=this.sessionShownQids.values().next().value;if(n===void 0)break;this.sessionShownQids.delete(n)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,n=!1){mn(t)||Pi(t).then(o=>{const i=this.sim.ensureLanguageQuiz();if(i.activeLang===t){if(o){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=ls(i,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),n&&i.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Pe(a,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),n&&i.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Pe(a,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const n=this.sim.ensureLanguageQuiz(),o=mn(n.activeLang);this.challenge=ls(n,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),o?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(n.activeLang,t)),this.sim.saveToStorage(),this.render();const i=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(i&&(i.scrollTop=0),o&&t&&n.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Pe(a,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const n=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=n,this.sim.ensureLanguageQuiz().autoSpeak&&Pe(this.challenge.fullSentence,this.challenge.lang,.95);const i=Te[this.targetCropId];if(n.correct){const a=n.tierAutoPromoted?` • Thăng hạng ${ft[this.challenge.lang].tierLabels[n.tierAutoPromoted]}!`:"",r=n.phoenixTalismanAwarded?` • 🔥 +${n.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=n.buildReduction&&n.buildReduction.reducedSec>0?` • 🔨 -${$e(n.buildReduction.reducedSec)} xây ${n.buildReduction.targetName??"công trình"}!`:"",s=n.leaderboardRankUp&&n.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${n.leaderboardRankUp.newRank} (+${n.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${n.seedsAwarded} hạt ${i.emoji} ${i.name} (Túi: ${n.newSeedCount} hạt)${l}${a}${r}${s}`,n.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const n=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,n)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=this.getDialog(),o=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;n&&typeof n.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,n.addEventListener("close",()=>{Ue.clearDialogOrientation(n,o)})),Ue.applyDialogOrientation(n,o,!0);const i=t.querySelector("#sqScrollViewport"),a=i?i.scrollTop:0,r=i?i.scrollLeft:0,l=this.sim.ensureLanguageQuiz(),s=l.activeLang,d=ft[s],c=l.profiles[s],u=Te[this.targetCropId],p=this.sim.getSeedCount(this.targetCropId),g=this.sim.getFarmItemCount(this.targetCropId),m=this.sim.state.galleons,T=u.seedCost,h=u.seedCost*3,y=m>=T,C=m>=h,v=Qi(c,this.sim.state.level),k=c.totalAnswered>0?Math.round(c.totalCorrect/c.totalAnswered*100):100,S=Xi(c),L=Ei(s),x=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),A=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let M="";if(this.pendingPlotUid){const q=this.sim.state.buildings.find(_=>_.uid===this.pendingPlotUid);q&&le(q.itemId)?.isFarmlandPlot&&!q.cropId&&(M=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${q.gx}, ${q.gy}]</strong></span>
            ${p>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${p})</button>`:""}
          </div>
        `)}const O=Object.values(Te).sort((q,_)=>q.unlockLevel-_.unlockLevel||q.growSec-_.growSec),U=O.filter(q=>q.isFlowerCrop).length,I=O.length-U,V=O.filter(q=>this.cropFilter==="flowers"?!!q.isFlowerCrop:this.cropFilter==="crops"?!q.isFlowerCrop:!0),j=[{id:"all",label:`🌱 (${O.length})`},{id:"flowers",label:`🌸 Hoa (${U})`},{id:"crops",label:`🌾 Cây (${I})`}].map(q=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===q.id?"active":""}"
            data-sq-crop-filter="${q.id}"
            aria-pressed="${this.cropFilter===q.id}"
          >${q.label}</button>
        `).join(""),ne=V.map(q=>{const _=!this.sim.state.sandboxMode&&this.sim.state.level<q.unlockLevel,Q=q.id===this.targetCropId,re=this.sim.getSeedCount(q.id),X=$e(q.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${Q?"active":""} ${_?"locked":""}"
            data-sq-crop="${q.id}"
            aria-pressed="${Q}"
            ${_?"disabled":""}
            title="${_?`Lv.${q.unlockLevel} (⏱️ ${X})`:`${q.name} • ⏱️ ${X} • 🪙 ${q.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${Lt(q.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${ie(q.name)}</span>
              <span class="sq-crop-pill-sub">
                ${_?`🔒 Lv.${q.unlockLevel}`:`🌱 ${re} • ⏱️${X}`}
              </span>
            </span>
          </button>
        `}).join(""),se=Ln.map(q=>{const _=ft[q],Q=l.profiles[q],re=q===s,X=Q.tier==="beginner"?"Tập Sự":Q.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${re?"active":""}"
          data-sq-lang="${q}"
          aria-pressed="${re}"
          title="${_.flag} ${ie(_.academyVi)} — ${ie(_.tierLabels[Q.tier])}"
        >
          <span class="sq-lang-flag">${_.flag}</span>
          <span class="sq-lang-text">
            <strong>${ie(_.nameVi)}</strong>
            <small>${ie(X)} • Lv.${Q.masteryScore}</small>
          </span>
        </button>
      `}).join(""),te=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(q=>{const _=c.tier===q.id;return`
          <button
            type="button"
            class="sq-tier-btn ${_?"active":""}"
            data-sq-tier="${q.id}"
            aria-pressed="${_}"
          >
            <span>${q.icon} ${ie(d.tierLabels[q.id])}</span>
            <small>${q.rewardTag}</small>
          </button>
        `}).join(""),N=An.map(q=>{const _=ts[q],Q=l.preferredFormat===q;return`
        <button
          type="button"
          class="sq-format-chip ${Q?"active":""}"
          data-sq-format="${q}"
          aria-pressed="${Q}"
        >
          ${_.icon} ${ie(_.labelVi)}
        </button>
      `}).join(""),P=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
        ${M}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${j}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${m.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${ie(u.name)}">
                🌱 ${ie(u.name)}: <strong>×${p}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${A}/8 câu)">
                🔥 <strong>${x}</strong> <small>(${A}/8)</small>
              </span>
              ${(()=>{const q=Date.now(),_=this.sim.getActiveConstructions(q);if(_.length===0)return"";const Q=_[0],re=le(Q.itemId),X=Math.max(1,Math.ceil((Q.constructEndsAt-q)/1e3)),pe=this.sim.getBuildingMinFloorSec(Q),me=X<=pe;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${ie(re?.name??"Đang xây")}: <strong>${$e(X)}</strong> <small>${me?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${ne}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${Lt(u.id)}" alt="${ie(u.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${ie(u.name)}</h3>
                <p>⏱️ <strong>${$e(u.growSec)}</strong> • 🌾 <strong>+${u.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${g}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${T.toLocaleString("vi-VN")}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${y?"":"disabled"}
              >
                🪙 +1 Hạt (-${T.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${C?"":"disabled"}
              >
                🪙 +3 Hạt (-${h.toLocaleString("vi-VN")}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${p>0?"has-seeds":"empty-seeds"}">
              <div class="sq-pocket-status">
                🌱 <strong>${ie(u.name)}</strong>: <strong>×${p}</strong>
              </div>
              <button
                id="btnSqSowNow"
                type="button"
                class="brass-btn sq-sow-cta"
                ${p>0?"":"disabled"}
              >
                🌱 Gieo (×${p})
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
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${se}</div>

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
                📖 Từ Điển (${S.masteredCount}/${L.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(s,c):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${te}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${c.masteryScore}/100 (Quyển ${v}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${d.flag} <strong>Lv.${c.masteryScore}/100</strong></span>
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
                          class="sq-stat-pill sq-stat-pill-btn ${S.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${S.masteredCount}</strong> • 🔄 <strong>${S.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${N}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${P}
                `}
          </section>
        </div>
      </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(t);const D=t.querySelector("#sqScrollViewport");D&&(a>0||r>0)&&(D.scrollTop=a,D.scrollLeft=r)}getLexiconEntrySrsInfo(t,n){const o=t.srsBoxes??{};let i=0,a=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const l=o[`${r}${n}`];l&&(l.box>i&&(i=l.box),l.box<5&&l.dueAtTurn<=t.totalAnswered&&(a=!0))}return{box:i,due:a}}getLanguageLexiconEntries(t){return hn.filter(n=>n.lang===t).sort((n,o)=>n.levelBand-o.levelBand||n.id.localeCompare(o.id))}renderLexiconCodexPanel(t,n){const o=ft[t],i=this.getLanguageLexiconEntries(t);let a=0,r=0,l=0;for(const d of i){const{box:c}=this.getLexiconEntrySrsInfo(n,d.id);c>=5?a+=1:c>=1?r+=1:l+=1}const s=[{id:"all",label:`📖 Tất cả (${i.length})`},{id:"mastered",label:`🏆 Thuộc (${a})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(d=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===d.id?"active":""}"
            data-sq-codex-filter="${d.id}"
            aria-pressed="${this.codexBoxFilter===d.id}"
          >${d.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${o.flag} ${ie(o.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${mn(t)?`✅ ${i.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${ie(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${s}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,n,i)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,n,o){const i=o??this.getLanguageLexiconEntries(t),a=this.codexQuery.trim().toLowerCase(),r=i.filter(s=>{const{box:d}=this.getLexiconEntrySrsInfo(n,s.id);return this.codexBoxFilter==="mastered"&&d<5||this.codexBoxFilter==="learning"&&(d<1||d>=5)||this.codexBoxFilter==="unseen"&&d>0?!1:a?s.word.toLowerCase().includes(a)||s.phonetic.toLowerCase().includes(a)||s.meaningVi.toLowerCase().includes(a)||s.exampleSentence.toLowerCase().includes(a)||s.exampleVi.toLowerCase().includes(a):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(s=>{const{box:d,due:c}=this.getLexiconEntrySrsInfo(n,s.id),u=cs(s.meaningVi,s.word,s.id);let p="is-unseen",g=`✨ Quyển ${s.levelBand}`;return d>=5?(p="is-box5",g="🏆 Hộp 5/5 • Thuộc"):d>=1&&(p=c?"is-due":"is-learning",g=`📦 Hộp ${d}/5${c?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${u.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${ie(s.id)}"
                title="Nghe phát âm từ ${ie(s.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${ie(s.word)}</strong>
                <span class="sq-vocab-ph">[${ie(s.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${ie(u.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${p}">${g}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${i.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,n){t.querySelectorAll("[data-sq-codex-word]").forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.sqCodexWord??"",a=hn.find(r=>r.id===i);a&&Pe(a.word,n,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.sqCodexEx??"",a=hn.find(r=>r.id===i);a&&Pe(a.exampleSentence,n,.95)})})}renderChallengeStage(t){const n=ft[t.lang],o=ts[t.format],i=Te[this.targetCropId],a=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",s=t.heroWord??t.stemText,d=t.heroPhonetic??t.stemPhonetic??"",c=t.heroShortVi??vn(t.translationVi);let u="";r==="pic_flashcard"?u=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${ie(s)}</div>
            ${d?`<div class="sq-kid-ph-pill">[${ie(d)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(u=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${ie(c)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${ie(c)}</div>
            ${d?`<div class="sq-kid-ph-pill">🔊 [${ie(d)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let p="";if(r==="pic_flashcard"||r==="word_flashcard"){const m=t.choices??[],T=t.choicePhonetics??[],h=t.choiceSprites??[],y=t.choiceSubtitles??[];p=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${m.map((C,v)=>{let k="";a&&(v===t.correctIndex?k="is-correct":v===this.selectedChoiceIdx?k="is-wrong":k="is-dimmed");const S=h[v]??l,L=y[v]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${k}"
                  data-sq-choice="${v}"
                  ${a?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${S}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${ie(C)}</span>
                    ${r==="word_flashcard"&&T[v]?`<small class="sq-choice-ph">[${ie(T[v])}]</small>`:a&&L?`<small class="sq-choice-ph">${ie(L)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const m=t.choices??[],T=t.choicePhonetics??[],h=t.choiceSprites??[];p=`
        <div class="sq-bubble-arena">
          ${m.map((y,C)=>{let v="";a&&(C===t.correctIndex?v="is-correct is-popped":C===this.selectedChoiceIdx?v="is-wrong is-popped":v="is-dimmed");const k=h[C]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${C%4} ${v}"
                  data-sq-choice="${C}"
                  ${a?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${k}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${ie(y)}</span>
                  ${T[C]?`<small class="sq-bubble-ph">[${ie(T[C])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const m=t.shuffledTokens??[],T=t.expectedSentenceTokens??[],h=new Set(this.placedTokenIndices),y=T.map((v,k)=>{const S=this.placedTokenIndices[k],L=S!==void 0?m.find(x=>x.idx===S):void 0;return L?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${k}"
                ${a?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${ie(L.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),C=m.map(v=>{const k=h.has(v.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${k?"used":""}"
              data-sq-place="${v.idx}"
              ${k||a?"disabled":""}
            >
              ${ie(v.text)}
            </button>
          `}).join("");p=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${y}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${C}</div>
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
      `}else if(t.format==="match_pairs"){const m=t.leftCards??[],T=t.rightCards??[];p=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${n.flag} 🔊 Thẻ Từ</div>
            ${m.map(h=>{const y=this.matchedPairIds.has(h.pairId),C=this.selectedLeftPairId===h.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${y?"matched":""} ${C?"selected":""}"
                    data-sq-left-pair="${ie(h.pairId)}"
                    ${y||a?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${ie(h.word)}</span>
                    <small class="sq-pair-ph">[${ie(h.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${T.map(h=>{const y=this.matchedPairIds.has(h.pairId),C=this.flashWrongPairKey===h.pairId,v=h.spriteSrc??cs(h.meaningVi,h.word,h.pairId).spriteSrc,k=h.shortVi??vn(h.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${y?"matched":""} ${C?"wrong-flash":""}"
                    data-sq-right-pair="${ie(h.pairId)}"
                    ${y||a?"disabled":""}
                  >
                    <img src="${v}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${ie(k)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const g=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${o.icon} ${ie(o.labelVi)}</span>
            ${t.isReview?`<span class="sq-badge sq-badge-review">🔄 Ôn (${t.srsBox??1}/5) • +2 ${i.emoji}</span>`:`<span class="sq-badge sq-badge-reward">🎁 +1–2 ${i.emoji}</span>`}
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

        ${u}
        ${p}
        ${g}
      </div>
    `}renderVietnameseExplanationCard(t,n){const o=this.sim.getSeedCount(this.targetCropId),i=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",a=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??vn(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${n.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${i}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${n.correct?`🎉 <strong>Giỏi lắm!</strong> +${n.seedsAwarded} 🌱 ${ie(n.cropName)} • +${n.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${n.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${ie(a)}</strong>
              <span class="sq-vocab-ph">[${ie(r)}]</span>
              <span>= 🇻🇳 <strong>${ie(l)}</strong></span>
            </div>
            ${n.buildReduction&&n.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${$e(n.buildReduction.reducedSec)} (${ie(n.buildReduction.targetName??"công trình")})</div>`:""}
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
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCropFilter;(c==="all"||c==="flowers"||c==="crops")&&(this.cropFilter=c,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCrop;c&&Te[c]&&(this.targetCropId=c,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const d=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(d.msg,d.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const d=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(d.msg,d.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const n=t.querySelector("#chkSqAutoSpeak");n?.addEventListener("change",()=>{const d=this.sim.ensureLanguageQuiz();d.autoSpeak=n.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqLang,u=this.sim.ensureLanguageQuiz();c&&Ln.includes(c)&&u.activeLang!==c&&(this.challenge&&!this.answeredOutcome&&St(u,this.challenge),u.activeLang=c,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(c,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqSubview;if((c==="practice"||c==="codex")&&this.activeSubView!==c){if(this.activeSubView=c,c==="codex"){const u=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(u.activeLang)}this.render()}})});const o=t.querySelector("#inpSqCodexSearch");o&&o.addEventListener("input",()=>{this.codexQuery=o.value;const d=t.querySelector("#sqCodexResultsMount");if(d){const c=this.sim.ensureLanguageQuiz(),u=c.activeLang;d.innerHTML=this.renderLexiconCodexRowsHtml(u,c.profiles[u]),this.bindCodexRowSpeakEvents(d,u)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCodexFilter;(c==="all"||c==="mastered"||c==="learning"||c==="unseen")&&(this.codexBoxFilter=c,this.render())})});const i=t.querySelector("#sqCodexResultsMount");if(i){const d=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(i,d.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqTier,u=this.sim.ensureLanguageQuiz();(c==="beginner"||c==="intermediate"||c==="advanced")&&(this.challenge&&!this.answeredOutcome&&St(u,this.challenge),rs(u,u.activeLang,c),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqFormat,u=this.sim.ensureLanguageQuiz();An.includes(c)&&u.preferredFormat!==c&&(this.challenge&&!this.answeredOutcome&&St(u,this.challenge),u.preferredFormat=c,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const d=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Pe(d,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const d=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Pe(d,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge)return;const c=Number(d.dataset.sqSpeakWord??-1),u=this.challenge.vocabNotes[c];u&&Pe(u.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const d=this.sim.ensureLanguageQuiz();St(d,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqChoice??-1);this.selectedChoiceIdx=c;const u=c===(this.challenge.correctIndex??0);u?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(u)})});const a=()=>{if(!this.challenge||this.answeredOutcome)return!1;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<d.length)return!1;const u=this.placedTokenIndices.map(g=>c.find(m=>m.idx===g)?.text??""),p=u.length===d.length&&u.every((g,m)=>g===d[m]);return p?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(p),!0};t.querySelectorAll("[data-sq-place]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqPlace??-1);if(c>=0&&!this.placedTokenIndices.includes(c)){this.placedTokenIndices.push(c),this.sim.audio.playMatchPop(1);const u=this.challenge.shuffledTokens?.find(g=>g.idx===c),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Pe(u.text,this.challenge.lang,.95),a()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqUnplace??-1);c>=0&&c<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(c,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const p=this.placedTokenIndices.length-1;if(c.find(m=>m.idx===this.placedTokenIndices[p])?.text===d[p])break;this.placedTokenIndices.pop()}const u=this.placedTokenIndices.length;if(u<d.length){const p=d[u],g=c.find(m=>m.text===p&&!this.placedTokenIndices.includes(m.idx));g&&(this.placedTokenIndices.push(g.idx),this.sim.audio.playMatchPop(1),a()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[],u=this.placedTokenIndices.map(g=>c.find(m=>m.idx===g)?.text??""),p=u.length===d.length&&u.every((g,m)=>g===d[m]);this.submitAttempt(p)}),t.querySelectorAll("[data-sq-left-pair]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=d.dataset.sqLeftPair??"";if(!c||this.matchedPairIds.has(c))return;this.selectedLeftPairId=c,this.flashWrongPairKey=null,this.sim.audio.playClick();const u=this.challenge.leftCards?.find(g=>g.pairId===c),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Pe(u.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=d.dataset.sqRightPair??"";if(!(!c||this.matchedPairIds.has(c))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===c){this.matchedPairIds.add(c),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const u=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=u){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=c,this.sim.audio.playClick(),this.render()}})});const r=t.querySelector("#sqScrollViewport"),l=t.querySelector("#sqZoomSizer"),s=t.querySelector("#sqZoomStage");Ue.bindDomScrollStageInteractions({rootScope:t,scrollViewportEl:r,sizerEl:l,contentStageEl:s,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}function $(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Kt=["path","shop","creature","decor","staff"],Mt=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function _a(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
        <div id="buildDrawer" class="parchment-panel build-drawer hidden"></div>

        <div id="secondaryMapToolsBar" class="parchment-dark secondary-map-tools-bar hidden" role="region" aria-label="Công cụ chỉnh sửa và bản đồ">
          <button id="btnMoveTool" type="button" aria-pressed="false" class="brass-btn" title="Di dời công trình (Phím M)">✋ Dời</button>
          <button id="btnBulldoze" type="button" aria-pressed="false" class="brass-btn" title="Phá dỡ (Phím X)">🧹 Xóa</button>
          <button id="btnRotate" type="button" class="brass-btn" title="Xoay hướng công trình (Phím R)">🔄 90°</button>
          <button id="btnRotateCam" type="button" aria-pressed="false" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">🧭 Bắc</button>
          <button id="btnPincerTool" type="button" aria-pressed="false" class="brass-btn" title="Kẹp Gắp Nhân Sự (Phím G)">🤏 Gắp</button>
          <button id="btnCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">👁️ Xuyên</button>
          <button id="btnGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">✨ Lưới</button>
          <button id="btnHomeCam" type="button" class="brass-btn" title="Về Hang Sóc">🏡 Nhà</button>
        </div>

        <div class="parchment-dark bottom-bar">
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_path.png" alt="" class="hud-3d-icon" /> Đường</button>
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_shop.png" alt="" class="hud-3d-icon" /> Xưởng</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_creature.png" alt="" class="hud-3d-icon" /> Thú</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_decor.png" alt="" class="hud-3d-icon" /> Cảnh</button>
          <button type="button" data-cat="staff" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_staff.png" alt="" class="hud-3d-icon" /> Phụ Tá</button>

          <span class="dock-divider" aria-hidden="true">|</span>

          <button id="btnToggleMapTools" type="button" aria-pressed="false" aria-expanded="false" aria-controls="secondaryMapToolsBar" class="brass-btn" title="Công cụ Sửa &amp; Góc Nhìn"><span class="dock-tool-icon" aria-hidden="true">🛠️</span> Công Cụ</button>
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function Ua(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},n=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.switchMinigame;e.closeHudPopovers(),!g||g==="match3"?e.openMatch3Dialog():g==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(g)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",n),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",n),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",n),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",n),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",n);const o=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"||p==="jigsaw"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",o),e.root.querySelector("#btnPlusSand")?.addEventListener("click",o),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const i=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",i),e.root.querySelector("#chipHudBarn")?.addEventListener("click",i),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=window.innerWidth>680;const g=e.selectedCatalogItem?.category;e.activeCategory=g&&Kt.includes(g)?g:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const g=p[0],m=le(g.itemId);fe(e.cam,g.gx+(m?.width??1)*.5,g.gy+(m?.height??1)*.5),e.inspectSelection={kind:"building",uid:g.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const a=e.root.querySelector("#btnHudRoundOrb");if(a){let p=null,g=0,m=0,T=0,h=0,y=!1;a.addEventListener("pointerdown",v=>{if(v.button!==0&&v.pointerType==="mouse")return;const k=a.getBoundingClientRect();p=v.pointerId,g=v.clientX,m=v.clientY,T=k.left,h=k.top,y=!1;try{a.setPointerCapture(v.pointerId)}catch{}}),a.addEventListener("pointermove",v=>{if(p!==v.pointerId)return;const k=v.clientX-g,S=v.clientY-m;if(!y&&Math.hypot(k,S)>7&&(y=!0),y){const L=a.offsetWidth||52,x=a.offsetHeight||62,A=Math.max(6,Math.min(window.innerWidth-L-6,T+k)),M=Math.max(6,Math.min(window.innerHeight-x-6,h+S));a.style.left=`${Math.round(A)}px`,a.style.top=`${Math.round(M)}px`,a.style.right="auto",a.style.bottom="auto"}});const C=v=>{if(p===v.pointerId){p=null;try{a.hasPointerCapture(v.pointerId)&&a.releasePointerCapture(v.pointerId)}catch{}}};a.addEventListener("pointerup",C),a.addEventListener("pointercancel",C),a.addEventListener("click",v=>{if(y){v.preventDefault(),v.stopPropagation(),y=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()});const r=p=>{const g=e.root.querySelector("#buildDrawer");if(!g)return;const m=Math.max(180,Math.round(g.clientWidth*.68))*p,T=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;g.scrollBy({left:m,behavior:T?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{r(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{r(1)}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const g=p.target;if(!g)return;const m=e.root.querySelector("#managePopoverMenu"),T=e.root.querySelector("#weatherPopoverMenu"),h=e.root.querySelector("#btnToggleManageMenu"),y=e.root.querySelector("#lblClock");m?.contains(g)||T?.contains(g)||h?.contains(g)||y?.contains(g)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const l=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",l);const s=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",s),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",s),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const d=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",d),e.root.querySelector("#btnOpenZones")?.addEventListener("click",d),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",d),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=Mt.findIndex(h=>h.mode===e.sim.heatmapMode),g=Mt[(p+1)%Mt.length];e.sim.heatmapMode=g.mode;const m=e.root.querySelector("#btnCycleHeatmap"),T=g.mode!=="none";m.textContent=g.label,m.setAttribute("data-active",String(T)),m.setAttribute("aria-pressed",String(T)),T&&e.showToast(`Đã bật ${g.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),g=document.createElement("a");g.href=p,g.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,g.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const m=p.currentTarget;m.textContent=e.questCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const g=p.currentTarget;g.textContent=e.minimapCollapsed?"+":"–",g.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingAutoPlace")?.addEventListener("click",()=>{e.onAutoPlaceSelected?.()}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(Ft(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${Tt[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=Kt.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const c=p=>{const g=e.minimapCanvas.getBoundingClientRect(),m=(p.clientX-g.left)/g.width*e.minimapCanvas.width,T=(p.clientY-g.top)/g.height*e.minimapCanvas.height,h=e.minimapCanvas.width*.46/Ee,y=e.minimapCanvas.height*.44/Ee,C=(m-e.minimapCanvas.width*.5)/h,v=(T-8)/y,k=(C+v)*.5,S=(v-C)*.5,{fgx:L,fgy:x}=Ki(k,S,e.cam.viewRot??0),A=Math.max(0,Math.min(Ee-1,L)),M=Math.max(0,Math.min(Ee-1,x));e.rideCamUid=null,fe(e.cam,A,M)};let u=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{u=!0,c(p)}),window.addEventListener("pointermove",p=>{u&&c(p)}),window.addEventListener("pointerup",()=>{u=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.cat;Kt.includes(g)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===g?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=g,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{Ft(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${Tt[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(g=>g.itemId==="burrow_house_canon");p?fe(e.cam,p.gx+1.5,p.gy+1.5):fe(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")Ft(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${Tt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")Ft(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${Tt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const g=e.sim.staff[0];g&&(e.pincerPicked={kind:"staff",id:g.id,label:g.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,fe(e.cam,16,18),e.refreshFloatingBanner())})}function ja(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const n=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||n);const o=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n||o),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!n),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),jn(e),Wn(e),ln(e),e.renderTutorialCoach()}function js(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function Wa(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(gt(e),tt(e),e.closeSeedTray(),e.closePastureTray()),ln(e)}function ln(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const n=js(e),o=e.hudRolledUp&&!e.photoModeActive&&!n;t.classList.toggle("hud-building-focus",n),t.classList.toggle("hud-compact-rolled",o);const i=e.root.querySelector("#btnToggleHudRollup");i&&(i.setAttribute("aria-pressed",String(e.hudRolledUp)),i.dataset.active=String(e.hudRolledUp),i.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const a=e.root.querySelector("#svgHudRollupChevron");a&&a.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const l=e.root.querySelector("#btnHudRoundOrb");l&&(l.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||n),l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.rolled=String(e.hudRolledUp));const s=e.root.querySelector("#lblHudRoundOrbTag");s&&(s.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const d=e.root.querySelector("#svgRoundOrbChevron");d&&d.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),n&&(gt(e),tt(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function gt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const n=e.root.querySelector("#managePopoverMenu"),o=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");n?.classList.add("hidden"),o?.classList.add("hidden"),i&&(i.setAttribute("aria-expanded","false"),i.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function tt(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function Qa(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function Xa(e){tt(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function _n(e,t,n){if(!t||!n)return;const o=t.getBoundingClientRect(),i=Math.min(window.innerWidth-16,Math.max(248,n.offsetWidth||336)),a=Math.min(n.offsetHeight||420,window.innerHeight-16),r=o.left<window.innerWidth*.5?o.left:o.right-i,l=Math.max(8,Math.min(r,window.innerWidth-i-8)),s=Math.max(8,Math.min(o.bottom+8,window.innerHeight-a-8));n.style.left=`${Math.round(l)}px`,n.style.top=`${Math.round(s)}px`}function Ka(e,t){if(e.sim.isVisitingNeighbor){gt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const n=typeof t=="boolean"?t:!e.manageMenuOpen;if(gt(e),!n)return;e.manageMenuOpen=!0;const o=e.root.querySelector("#managePopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu");o&&i&&(o.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),i.setAttribute("data-active","true"),_n(e,i,o)),e.renderTutorialCoach()}function Ya(e,t){const n=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(gt(e),!n)return;e.weatherPopoverOpen=!0;const o=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#lblClock");o&&i&&(Un(e),o.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),_n(e,i,o)),e.renderTutorialCoach()}function Un(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const n=Date.now(),o=e.sim.getCurrentWeather(n),i=e.sim.getWeatherForecast(4,n),a=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${a?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${o.icon} ${$(o.labelVi)}</div>
        <div class="weather-current-buff">✨ ${$(o.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${i.map((r,l)=>{const s=l===0?"Nay":`+${Ie(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${$(r.labelVi)}</span>
                <span class="weather-slot-meta">${$(s)}</span>
              </div>
            `}).join("")}
      </div>
    `}function Ws(e,t){const n=e.root.querySelector("#lblGalleons");if(!n)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),n.textContent="∞",e.displayedGalleons=t;return}const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||o||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,n.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const i=e.displayedGalleons,a=performance.now(),r=420,l=s=>{const d=Math.min(1,(s-a)/r),c=1-Math.pow(1-d,3),u=Math.round(i+(t-i)*c);e.displayedGalleons=u,n.textContent=u.toLocaleString("vi-VN"),d<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function Za(e,t,n,o,i){const a=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!a||!r)return;const l=()=>{a.classList.remove("hud-chip-pulse"),a.offsetWidth,a.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const s=a.getBoundingClientRect();if(s.width<=0&&s.height<=0)return;const d=s.left+s.width*.5,c=s.top+s.height*.5,u=typeof o=="number"&&Number.isFinite(o)?Math.max(24,Math.min(window.innerWidth-24,o)):window.innerWidth*.5,p=typeof i=="number"&&Number.isFinite(i)?Math.max(24,Math.min(window.innerHeight-24,i)):window.innerHeight*.54,g={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},m=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(n))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,n)))));for(let T=0;T<m;T++){const h=document.createElement("div");h.className="fly-reward-token",h.dataset.kind=t,h.textContent=g[t],r.appendChild(h);const y=T/Math.max(1,m)*Math.PI*2+(Math.random()-.5)*.5,C=14+T%3*9,v=u+Math.cos(y)*C,k=p+Math.sin(y)*C*.7,S=(v+d)*.5+(T%2===0?-42:42),L=Math.min(k,c)-(48+T%3*18),x=560+T*48,A=T*52,M=h.animate([{transform:`translate3d(${v}px, ${k}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${v}px, ${k-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${S}px, ${L}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${d}px, ${c}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:x,delay:A,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});M.onfinish=()=>{h.remove(),l(),e.sim.audio.playFlyTick(T)}}}function Ja(e,t="🦉"){const n=e.trim();if(!n)return t.trim();const o=t.trim();if(!o)return n;const i=l=>l.replace(/\uFE0F/g,""),a=i(o);let r=n;for(;a&&i(r).startsWith(`${a} ${a}`);)r=r.slice(o.length).trimStart();return a&&i(r).startsWith(a)||o==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${o} ${r}`}function Yt(e){const t=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!t)return null;const n=Array.from(e.root.querySelectorAll("dialog[open]")),o=n.length>0?n[n.length-1]:null;return o?t.parentElement!==o&&(o.appendChild(t),o.addEventListener("close",()=>{const i=Array.from(e.root.querySelectorAll("dialog[open]")),a=i.length>0?i[i.length-1]:e.root;t.parentElement!==a&&a.appendChild(t)},{once:!0})):t.parentElement!==e.root&&e.root.appendChild(t),t}function Ve(e,t,n="🦉"){const o=Yt(e);if(!o)return;const i=document.createElement("div");i.className="parchment-dark owl-toast",i.textContent=Ja(t,n),o.appendChild(i),window.setTimeout(()=>i.remove(),3500)}function eo(e,t){const n=Math.max(1,Math.round(t.awaySeconds/60)),o=e.root.querySelector("#offlineDialogContent");o.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${n} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function jn(e){const t=e.root.querySelector("#floatingModeBanner"),n=e.root.querySelector("#floatingBannerText"),o=e.root.querySelector("#btnFloatingAutoPlace"),i=e.root.querySelector("#btnFloatingSecondary"),a=e.root.querySelector("#btnFloatingSwap"),r=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!n||!i||!a||!r)){if(o?.classList.add("hidden"),a.classList.add("hidden"),r.classList.add("gold-cta"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const l=e.sim.state.buildings.find(d=>d.uid===e.rideCamUid),s=l?le(l.itemId):void 0;if(!l||!s)e.rideCamUid=null;else{t.classList.remove("hidden"),n.textContent=`🎥 ${s.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,i.textContent="🧭 90°",i.classList.remove("hidden"),r.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),n.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Nhấp ô để thả`:"🤏 Điều phối nhân sự (G) — Nhấp ô cử tới • G/Esc thoát",i.classList.add("hidden"),r.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const l=e.sim.state.buildings.find(d=>d.uid===e.movingBuildingUid),s=l?le(l.itemId):void 0;n.textContent=`✋ ${s?.name??"Dời chỗ"}`,i.textContent=`🔄 ${e.rotation*90}°`,i.classList.remove("hidden"),r.textContent="✕"}else n.textContent="✋ Chọn công trình để dời",i.classList.add("hidden"),r.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),n.textContent="🧹 Phá dỡ",i.classList.add("hidden"),r.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const l=e.selectedCatalogItem,s=l.category!=="path"&&l.category!=="terrain"&&!l.isFarmlandPlot&&!l.connectableGroup&&!l.isZooFence,d=l.category!=="path"&&l.category!=="terrain"&&!l.isCoasterTrackPiece&&!l.isZooFence&&!l.elevationDelta,c=e.sim.getEffectiveItemStarCost(l),u=c>0?`🌟 ${c}`:l.cost===0?"0G":`${l.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),n.textContent=`🏗️ ${l.name} • ${u}`,d&&o&&(o.textContent="⚡ Đặt Ngay",o.classList.remove("hidden"),r.classList.remove("gold-cta")),s?(i.textContent=`🔄 ${e.rotation*90}°`,i.classList.remove("hidden")):i.classList.add("hidden"),a.textContent="📦 Đổi",a.classList.remove("hidden"),r.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const l=Te[e.activeSeedCropId],s=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),n.textContent=`🌱 ${l.emoji} ${l.name} (${s})`,i.textContent="🌱 Đổi",i.classList.remove("hidden"),r.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const l=ot[e.activePastureAnimalId];t.classList.remove("hidden"),n.textContent=`🐾 ${l.emoji} ${l.name} (${l.cost.toLocaleString("vi-VN")}G)`,i.textContent="🐾 Đổi",i.classList.remove("hidden"),r.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),n.textContent="👁️ Nhìn xuyên",i.classList.add("hidden"),r.textContent="✕";return}t.classList.add("hidden")}}function Wn(e){const t=e.root.querySelector("#touchConfirmBar"),n=e.root.querySelector("#lblTouchConfirm");if(!(!t||!n)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),n.textContent=`📍 ${e.pendingTouchTile.label}`}}function Et(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Qs(e),Ks(e),Ys(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t);const n=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t||n),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),jn(e),Wn(e),ln(e),e.renderTutorialCoach()}function Hn(e){const t=new Date,n=String(t.getHours()).padStart(2,"0"),o=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const i=e.sim.getCurrentWeather(t.getTime()),a=e.root.querySelector("#lblClock");if(a){const p=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";a.innerHTML=`${i.icon} <span>${n}:${o}</span>${p}`}e.weatherPopoverOpen&&Un(e);const r=e.sim.getActiveFestival(t),l=e.root.querySelector("#lblFestival");l&&(r==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):r==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(l.classList.remove("hidden"),l.textContent="🏆 +Cúp"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const s=e.sim.state,d=e.root.querySelector("#lblPuzzleHearts");if(d&&s.match3)if(s.sandboxMode)d.textContent="∞";else if(s.match3.hearts>=tn)d.textContent=`${s.match3.hearts}/${tn}`;else{const p=Math.max(0,Math.ceil((s.match3.nextHeartAt-Date.now())/1e3)),g=Math.floor(p/60),m=String(p%60).padStart(2,"0");d.textContent=`${s.match3.hearts} (${g}:${m})`}const c=e.root.querySelector("#btnHudActiveBuilds"),u=e.root.querySelector("#lblActiveBuilds");if(c&&u){const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)c.classList.add("hidden");else{c.classList.remove("hidden");const g=Math.max(1,Math.ceil((p[0].constructEndsAt-Date.now())/1e3));u.textContent=`${p.length} (${Ie(g)})`}}}function Qs(e){const t=e.sim.state,n=e.sim.getRequiredLevelTrial(),o=Math.max(0,t.xp)%wt,i=Math.max(6,Math.min(100,o/wt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+Hs(t.level),e.root.querySelector("#barXpFill").style.width=`${i}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const W=e.sim.getActiveVisitingNeighbor();r.textContent=W?`🚂 Thăm: ${W.avatarEmoji} ${W.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getTotalTowerClearedStages(),d=t.level>=Ke?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),c=e.root.querySelector("#btnOpenRoadmap");c&&(c.style.setProperty("--hg-lvl-pct",String(d)),c.title=t.level>=Ke?`👑 Cấp Tối Đa ${Ke} • Rương XP: ${o}/${wt} • Tháp 6 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${o}/${wt}`);const u=e.root.querySelector("#barLevelTopFill");u&&(u.style.width=`${d}%`,u.parentElement&&(u.parentElement.title=t.level>=Ke?`👑 Đã đạt Cấp Tối Đa ${Ke} • Tháp 6 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 6 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`));const p=e.root.querySelector("#lblXpFraction");p&&(p.textContent=`🎁 ${o}/${wt}`);const g=e.sim.ensureFarmBarn(),m=e.sim.getBarnTotalUsed(),T=e.root.querySelector("#lblStorageBarn");T&&(T.textContent=`${m}/${g.capacity}`),Ws(e,t.galleons);const h=t.sandboxMode?"∞":String(t.match3?.stars??0),y=e.root.querySelector("#lblPuzzleStars");y&&t.match3&&(y.textContent=h);const C=e.root.querySelector("#lblHudHubStars");C&&(C.textContent=h);const v=e.root.querySelector("#lblHudHubTrial");v&&(t.level>=Ke||t.sandboxMode||e.sim.isHeadmasterPreview||!n?v.textContent=`♟️ ${s.cleared}/${s.total}`:v.textContent=`🔥 ${n.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const k=e.sim.getDisciplineStageInfo("match3"),S=e.sim.getLastPlayedMinigame();let L="🍬 Bùa Gặt",x="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",A=k.isMaxed?`👑 ${Fe}`:`Màn ${k.currentStage}`;if(S==="caro"){const W=e.sim.getDisciplineStageInfo("caro");L="🗺️ Ngũ Ấn",x="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",A=W.isMaxed?`👑 ${Fe}`:`Màn ${W.currentStage}`}else if(S==="sudoku"){const W=e.sim.getDisciplineStageInfo("sudoku");L="🔢 Số Học",x="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",A=W.isMaxed?`👑 ${Fe}`:`Màn ${W.currentStage}`}else if(S==="blocks"){const W=e.sim.getDisciplineStageInfo("blocks");L="🦄 Sinh Vật",x="/trang-trai-hang-soc/sprites/beast_niffler.png",A=W.isMaxed?`👑 ${Fe}`:`Màn ${W.currentStage}`}else if(S==="chess"){const W=e.sim.getDisciplineStageInfo("chess");L="🏰 Cờ Phù Thủy",x="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",A=W.isMaxed?`👑 ${Fe}`:`Màn ${W.currentStage}`}else if(S==="jigsaw"){const W=e.sim.getDisciplineStageInfo("jigsaw");L="🧩 Tranh Ghép",x="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",A=W.isMaxed?`👑 ${Fe}`:`Màn ${W.currentStage}`}else S==="seedquiz"&&(L="🪄 Thần Chú",x="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",A="Ôn Tập");const M=e.root.querySelector("#imgCornerPlayIcon");M&&M.getAttribute("src")!==x&&M.setAttribute("src",x);const O=e.root.querySelector("#badgeCornerPlayBonus");O&&(O.textContent=L,O.classList.remove("hidden"));const U=e.root.querySelector("#lblCornerPlayStage");U&&(U.textContent=A);const I=e.root.querySelector("#lblCornerPlaySub");I&&(I.textContent=t.level>=Ke?`👑 Cấp ${Ke}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const V=e.root.querySelector("#btnCornerPlayPuzzle");if(V){const W=`Chơi tiếp ${L} — ${A}`;V.title=W,V.setAttribute("aria-label",W)}e.root.querySelectorAll("[data-switch-minigame]").forEach(W=>{const ve=W.dataset.switchMinigame===S;W.dataset.active=String(ve),W.setAttribute("aria-pressed",String(ve))});const j=e.root.querySelector("#badgeBuildReadyCount");if(j){const W=new Set(t.buildings.map(Qe=>Qe.itemId)),ve=t.sandboxMode?999:t.match3?.stars??0,Ae=Is.filter(Qe=>{if(Qe.isThemeParkLegacy)return!1;const Dt=e.sim.getEffectiveItemStarCost(Qe);return Dt<=0||!e.sim.isCatalogItemUnlocked(Qe)?!1:!W.has(Qe.id)&&ve>=Dt}).length;Ae>0&&!e.sim.isHeadmasterPreview?(j.textContent=String(Ae),j.classList.remove("hidden")):j.classList.add("hidden")}const ne=e.root.querySelector("#lblMatch3Lv");ne&&t.match3&&(ne.textContent=k.isMaxed?`👑${Fe}`:`${k.currentStage}/${Fe}`);const se=e.root.querySelector("#lblArcadeTowerLv");if(se){const W=Math.max(0,s.cleared-k.clearedStages),ve=Fe*5;se.textContent=W>=ve?`👑${ve}`:`${W}/${ve}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const de=e.sim.getActiveStoryQuest(),te=e.sim.getReadyOwlOrdersCount(),N=(de?.completed?1:0)+t.owlQuests.filter(W=>W.completed&&!W.claimed).length+t.dailyQuests.filter(W=>W.completed&&!W.claimed).length,P=te+N,D=P>0?P:g.owlOrders.length,q=e.root.querySelector("#badgeQuestCount");D>0?(q.textContent=String(D),q.classList.toggle("is-ready-green",te>0),q.classList.remove("hidden")):q.classList.add("hidden");const _=t.supply.cargoCrates.filter(W=>!W.fulfilled&&(t.sandboxMode||(t.supply.goods[W.goodId]??0)>=W.qtyRequired)).length,Q=e.root.querySelector("#badgeWorkshopCount");Q&&(_>0?(Q.textContent=String(_),Q.classList.remove("hidden")):Q.classList.add("hidden"));const X=Object.values(t.housePoints).reduce((W,ve)=>W+ve,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!X),e.refreshSuitcaseBadge();const me=e.root.querySelector("#badgeSuitcaseCount"),ue=me&&!me.classList.contains("hidden")?Math.max(0,Number.parseInt(me.textContent||"0",10)||0):0,Ce=e.sim.getClaimableHarvestFeastCount(),ce=e.root.querySelector("#badgeManageMenuDot");if(ce){const W=_+(X?1:0)+Ce+ue;W>0?(ce.textContent=String(W),ce.classList.remove("hidden")):ce.classList.add("hidden")}Xs(e),Hn(e);const be=e.root.querySelector("#btnCycleHeatmap");if(be){const W=Mt.find(Ae=>Ae.mode===e.sim.heatmapMode)??Mt[0],ve=e.sim.heatmapMode!=="none";be.textContent=W.label,be.dataset.active=String(ve),be.setAttribute("aria-pressed",String(ve))}Hn(e)}function Xs(e){const t=e.sim.state,n=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,o=t.buildings.some(a=>!!le(a.itemId)?.isCreatureHabitat),i=(t.match3?.hearts??tn)>=tn&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",i),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",n&&!o),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",n&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const a=e.root.querySelector("#btnToggleMinimap");a&&(a.textContent="–",a.setAttribute("aria-expanded","true"))}}function Ks(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const n=e.sim.state,o=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const i=e.sim.getActiveStoryQuest(),a=n.owlQuests.slice(0,2);let r="";if(o&&!n.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getDisciplineStageInfo(o.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${o.icon} ${$(o.shortVi)} (${s.currentStage}/${Fe}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${o.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(i){const l=Math.min(100,Math.round(i.progress/Math.max(1,i.targetAmount)*100)),s=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${$(i.giverEmoji)} ${$(i.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(i.progress,i.targetAmount)}/${i.targetAmount}</span>
            ${i.completed?`<button type="button" data-claim="${$(i.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${i.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${$(s.longLabel)}">${$(s.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const l of a){const s=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${$(l.giverEmoji)} ${$(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${s}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${$(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const s=e.sim.completeStoryStepWithStar();if(s.ok){typeof s.placedGx=="number"&&typeof s.placedGy=="number"&&fe(e.cam,s.placedGx,s.placedGy);return}Ve(e,s.msg,s.reason==="missing_gold"?"🪙":s.reason==="locked_level"?"🔒":"🌟"),s.reason==="open_match3"&&e.openTrialMinigame()})})}function Ys(e){const t=(h,y)=>{h&&(h.setAttribute("data-active",String(y)),h.setAttribute("aria-pressed",String(y)))};e.root.querySelectorAll("[data-cat]").forEach(h=>{t(h,h.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const n=e.root.querySelector("#btnRotateCam");if(n){const h=e.cam.viewRot??0;n.textContent=Tt[h],t(n,h!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const o=e.mapToolsExpanded,i=e.root.querySelector("#secondaryMapToolsBar"),a=e.root.querySelector("#btnToggleMapTools");i&&i.classList.toggle("hidden",!o),a&&(a.setAttribute("aria-expanded",String(o)),t(a,o));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),l);const d=e.root.querySelector("#buildDrawer"),c=e.root.querySelector("#buildDrawerSwipeBar"),u=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Kt.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,d.classList.add("hidden"),c?.classList.add("hidden"),u.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(d.classList.remove("hidden"),u.classList.add("hidden"),e.activeCategory==="staff"){Zs(e,d),Ts(e,d);return}const p=Is.filter(h=>h.category===e.activeCategory&&h.category!=="terrain"&&!h.isThemeParkLegacy),g=e.sim.state.sandboxMode,m=e.sim.state.match3?.stars??0,T=e.sim.state.galleons;d.innerHTML=p.map(h=>{const y=!e.sim.isCatalogItemUnlocked(h),C=e.selectedCatalogItem?.id===h.id,v=h.elevationDelta?h.elevationDelta>0?"⛰️":"⛏️":h.isCoasterTrackPiece?"🛤️":h.isZooFence?"🚧":h.isBench?"🪑":h.category==="path"?"🛣️":h.category==="terrain"?"🌿":"🕯️",k=h.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${h.spriteKey}.png" alt="${h.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${v}</div>`,S=e.sim.getEffectiveItemStarCost(h),x=S>0&&!h.connectableGroup&&h.category!=="decor"&&e.sim.state.buildings.some(V=>V.itemId===h.id),A=!g&&!y&&S>0&&m<S,M=!g&&!y&&S===0&&T<h.cost,O=A&&!x||M,U=h.buildDurationSec>0?`🔨 ${$e(h.buildDurationSec)}`:"⚡",I=y?`🔒 Cấp ${h.unlockLevel}`:x?A?`✅ Đã xây • 🌟 ${m}/${S}`:`✅ Đã xây • 🌟 ${S}`:A?`🌟 ${m}/${S} • ${U}`:S>0?`🌟 ${S} • ${U}`:M?`🪙 ${T.toLocaleString("vi-VN")}/${h.cost.toLocaleString("vi-VN")}G`:`🪙 ${h.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${y?"locked":""} ${O?"short-resource":""}"
            data-item-id="${h.id}"
            data-selected="${C}"
            aria-pressed="${C}"
            ${y||O?'aria-disabled="true"':""}
          >
            ${k}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${$(h.name)}</div>
            <div class="catalog-card-sub ${O?"is-short":""}">${I}</div>
          </button>
        `}).join(""),d.querySelectorAll("[data-item-id]").forEach(h=>{h.addEventListener("click",()=>{const y=le(h.dataset.itemId);if(!y)return;const C=e.sim.getEffectiveItemStarCost(y),v=e.sim.state.match3?.stars??0;if(!e.sim.isCatalogItemUnlocked(y)){const S=e.sim.getWinsProgressForCurrentLevel();let L=Math.max(1,S.required-S.current);for(let A=e.sim.state.level+1;A<y.unlockLevel;A++)L+=qi(A);const x=C>0?` hoặc tích đủ ${C} 🌟 Sao (hiện ${v}/${C} 🌟)`:"";Ve(e,`🔒 Bản vẽ "${y.name}" mở ở Cấp ${y.unlockLevel}${x} — Cần thêm ${L.toLocaleString("vi-VN")} màn Giải Đố ở nút ▶️ góc phải!`,"🔒");return}if(!e.sim.state.sandboxMode&&C>0&&v<C){const S=!y.connectableGroup&&y.category!=="decor"?e.sim.state.buildings.find(x=>x.itemId===y.id):void 0;if(S){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection={kind:"building",uid:S.uid},fe(e.cam,S.gx+y.width*.5,S.gy+y.height*.5),e.onCameraJump?.(),tt(e),Et(e),Ve(e,`📍 Đã chọn "${y.name}" đang có trên bản đồ — Bấm "✋ Dời" ở bảng chi tiết để đổi vị trí (hoặc tích đủ ${C} 🌟 nếu muốn xây thêm)!`,"✋");return}const L=C-v;Ve(e,`🌟 Thiếu ${L} Sao Phép Thuật (hiện có ${v}/${C} 🌟) để dựng "${y.name}" — Bấm nút ▶️ góc phải để kiếm thêm Sao nhé!`,"🌟");return}if(!e.sim.state.sandboxMode&&C===0&&e.sim.state.galleons<y.cost){const S=y.cost-e.sim.state.galleons;Ve(e,`🪙 Thiếu ${S.toLocaleString("vi-VN")}G (hiện có ${e.sim.state.galleons.toLocaleString("vi-VN")}/${y.cost.toLocaleString("vi-VN")}G) để dựng "${y.name}"!`,"🪙");return}e.selectedCatalogItem=y,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,tt(e),Et(e),e.onSelectCatalogItem?.(y);const k=y.category==="path"||y.category==="terrain"||!!y.isCoasterTrackPiece||!!y.isZooFence||!!y.elevationDelta;Ve(e,k?`🏗️ Đã chọn "${y.name}" — Nhấp hoặc kéo trên bản đồ để đặt!`:`🏗️ Đã chọn "${y.name}" — Bấm "⚡ Đặt Ngay" trên thanh nổi hoặc nhấp ô xanh để khởi công!`,"🔨")})}),Ts(e,d)}function Zs(e,t){const n=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],o=new Set(e.sim.state.unlockedZones),i=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+Gn.filter(s=>e.sim.state.sandboxMode||o.has(s.id)).map(s=>`<option value="${s.id}" ${l===s.id?"selected":""}>📍 ${s.name}</option>`).join(""),a=n.map(l=>{const s=e.sim.state.staffHired[l.key],d=s>=Gt,c=l.baseCost*(1+s);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${s}/${Gt}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${d?"":"gold-cta"}"
              ${d?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${d?`✓ ${Gt}/${Gt}`:`+ 🪙 ${c}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(l=>{const s=e.sim.state.staffPatrolZones?.[l.id]??l.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${$(l.name)}</div>
            <select data-patrol-staff="${$(l.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${i(s)}
            </select>
            <button type="button" data-pick-staff="${$(l.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=a+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const s=l.dataset.hire;e.sim.hireStaff(s)&&(tt(e),Et(e),Ve(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const s=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(s,l.value),Ve(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const s=e.sim.staff.find(d=>d.id===l.dataset.pickStaff);s&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},tt(e),Et(e),Ve(e,`Đang gắp ${s.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}const to={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏭 Xưởng & Cửa Tiệm",creature:"🦄 Đồng Cỏ & Thú Phép",decor:"🌸 Vườn Hoa & Cảnh Quan",staff:"🧙 Phụ Tá Điền Trang"};function Ts(e,t){const n=e.root.querySelector("#buildDrawerSwipeBar"),o=e.root.querySelector("#buildDrawerCatLabel"),i=e.root.querySelector("#btnDrawerScrollPrev"),a=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const l=Array.from(t.querySelectorAll(".catalog-card"));if(!n||l.length===0||!e.activeCategory){n?.classList.add("hidden");return}if(o){const m=to[e.activeCategory]??"🏗️ Danh Mục Xây Dựng",T=e.sim.state.sandboxMode?"∞":String(e.sim.state.match3?.stars??0),h=e.sim.state.sandboxMode?"∞":`${e.sim.state.galleons.toLocaleString("vi-VN")}G`;o.textContent=`${m} (${l.length}) • 🌟 ${T} • 🪙 ${h}`}n.classList.remove("hidden");const s=t.querySelector('.catalog-card[data-selected="true"]');s&&typeof s.scrollIntoView=="function"&&s.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const d=l[0],c=l[l.length-1];let u=!0,p=l.length<=2;const g=()=>{const m=!u||!p||t.scrollWidth>t.clientWidth+6;i&&(i.disabled=u,i.classList.toggle("hidden",!m)),a&&(a.disabled=p,a.classList.toggle("hidden",!m)),r&&r.classList.toggle("hidden",!m),t.dataset.scrollStart=String(!u),t.dataset.scrollEnd=String(!p)};if(typeof IntersectionObserver<"u"){const m=new IntersectionObserver(T=>{for(const h of T)h.target===d&&(u=h.intersectionRatio>=1),h.target===c&&(p=h.intersectionRatio>=1);g()},{root:t,threshold:1,rootMargin:"2px"});m.observe(d),c!==d&&m.observe(c),e.drawerEdgeObserver=m}g()}function no(e){const t=e.mapToolsExpanded,n=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");n&&n.classList.toggle("hidden",!t),o&&(o.setAttribute("aria-expanded",String(t)),o.setAttribute("data-active",String(t)),o.setAttribute("aria-pressed",String(t)))}function he(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const n=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(n!==e.lastInspectedKey&&(e.lastInspectedKey=n,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const o=e.inspectSelection.uid,i=e.sim.state.buildings.find(I=>I.uid===o);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=le(i.itemId),r=Date.now(),l=r<i.constructEndsAt,s=Math.max(0,Math.ceil((i.constructEndsAt-r)/1e3)),d=e.sim.getBuildingProductionPerCycle(i,a),c=Yi(a,i.stars),u=(e.sim.rideQueues.get(i.uid)??[]).length,p=e.sim.isBuildingConnected(i.uid),g=e.sim.activeSynergies.buildingGoldMult.get(i.uid)??1,m=e.sim.activeSynergies.buildingXpMult.get(i.uid)??1,T=a.category==="ride"&&!a.isCoasterTrackPiece,h=!!a.isCustomCoasterStation&&!l,y={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},C=a.isCreatureHabitat?e.sim.biomeCache.get(i.uid):void 0,v=a.isBackstage?e.sim.backstageCache.get(i.uid):void 0,k=!!a.ticketPrice&&!l&&!a.workshopGroupId,S=Zi(a),L=e.sim.getEffectivePrice(i,a),x=e.sim.getPriceValueVerdict(i,a),A=a.isFarmlandPlot&&!l?(()=>{if(!i.cropId){const q=Object.values(Te).sort((ce,be)=>ce.unlockLevel-be.unlockLevel||ce.growSec-be.growSec),_=q.filter(ce=>ce.isFlowerCrop).length,Q=q.length-_,re=q.filter(ce=>e.seedFilterMode==="flowers"?!!ce.isFlowerCrop:e.seedFilterMode==="crops"?!ce.isFlowerCrop:!0),X=[{id:"all",label:`🌱 (${q.length})`},{id:"flowers",label:`🌸 (${_})`},{id:"crops",label:`🌾 (${Q})`}].map(ce=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===ce.id?"active":""}"
                        data-insp-seed-filter="${ce.id}"
                        aria-pressed="${e.seedFilterMode===ce.id}"
                      >${ce.label}</button>
                    `).join(""),pe=re.map(ce=>{const be=!e.sim.state.sandboxMode&&e.sim.state.level<ce.unlockLevel,W=e.sim.getSeedCount(ce.id),ve=e.sim.getFarmItemCount(ce.id),Ae=$e(ce.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${be?"locked":""} ${!be&&W<=0?"out-of-seeds":""}"
                        data-plant-crop="${ce.id}"
                        ${be?"disabled":""}
                      >
                        <img src="${Lt(ce.id)}" alt="${$(ce.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${$(ce.name)}</span>
                        <span class="seed-card-seed-badge ${W>0?"has-seed":"no-seed"}">
                          ${be?`🔒 Lv.${ce.unlockLevel}`:W>0?`🌱 ×${W}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${be?`⏱️ ${Ae}`:`⏱️ ${Ae} • 🪙${ce.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${ve}</span>
                      </button>
                    `}).join(""),me=e.sim.state.plotSoilState?.[`${i.gx},${i.gy}`],ue={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${me?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${ue[me.lastFamily]??me.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${X}</div>
                    <div class="seed-picker-grid">${pe}</div>
                  </div>
                `}const I=Te[i.cropId],V=i.cropReadyAt??r,j=i.cropPlantedAt??V-I.growSec*1e3,ne=Math.max(0,Math.ceil((V-r)/1e3)),se=ne<=0,de=e.sim.state.cropMastery?.[I.id]??0,te=Di(de),N=Math.max(0,e.sim.state.morningDewPhials??0),P=I.yieldQty*(i.cropRotatedBonus?2:1),D=se?100:Math.max(6,Math.min(98,Math.round((r-j)/Math.max(1e3,V-j)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${Lt(I.id)}" alt="${$(I.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${$(I.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${te.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${se?"🌾 Chín!":`⏱️ ${Ie(ne)}`}${i.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${de} vụ • Họ ${Hi(I.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${D}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${se?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${P})
                          </button>
                        `:i.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!se&&(N>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${N})
                          </button>`:""}
                  </div>
                </div>
              `})():"",M=a.workshopGroupId&&!l?(()=>{const I=e.sim.getWorkshopRecipesForBuilding(a),V=i.workshopQueue??[],j=i.readyFarmGoods??[],ne=3+Math.min(2,Math.max(0,i.stars-1)),se=j.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${j.slice(0,5).map(q=>{const _=ct[q];return`<img src="/trang-trai-hang-soc/sprites/${_.iconKey}.png" alt="${$(_.name)}" title="${$(_.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${j.length})
                      </button>
                    </div>
                  `:"",de=I.map(q=>{const _=ct[q.goodId],Q=q.name??_.name,re=q.name&&q.name!==_.name?`title="Ra lò thành phẩm: ${$(_.name)}"`:"",X=!e.sim.state.sandboxMode&&e.sim.state.level<q.unlockLevel,pe=!X&&(e.sim.state.sandboxMode||q.inputs.every(ue=>e.sim.getFarmItemCount(ue.itemId)>=ue.qty)),me=q.inputs.map(ue=>{const Ce=_e(ue.itemId),ce=e.sim.getFarmItemCount(ue.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||ce>=ue.qty?"ok":"lack"}">${$(Ce.name)} ${e.sim.state.sandboxMode?"∞":ce}/${ue.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${pe?"craftable":""} ${X?"locked":""}"
                      data-ws-enqueue="${q.id}"
                      ${re}
                      ${X?"disabled":""}
                    >
                      <div class="ws-recipe-name">${$(Q)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${_.iconKey}.png" alt="${$(Q)}" class="ws-recipe-img" />
                        ${pe?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${X?`🔒 Lv.${q.unlockLevel}`:me}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${$e(q.craftSec)}</div>
                    </button>
                  `}).join(""),te=V[0],N=te?Math.max(0,Math.ceil((te.endsAt-r)/1e3)):0,P=te?ct[te.goodId]:null,D=Array.from({length:Math.max(1,ne-1)},(q,_)=>{const Q=V[_+1];if(Q){const re=ct[Q.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${$(re.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${re.iconKey}.png" alt="${$(re.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return _===V.length-(te?1:0)?`
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
                    <span>🔥 ${$(a.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${se}
                  <div class="ws-recipe-grid">${de}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${te?"baking":""}">
                      <div class="ws-oven-arch">
                        ${P?`<img src="/trang-trai-hang-soc/sprites/${P.iconKey}.png" alt="${$(P.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${te?`<strong>${Ie(N)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${te?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${D}</div>
                  </div>
                </div>
              `})():"",O=a.isAnimalPasturePlot&&!l?(()=>{if(!i.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(ot).map(P=>{const D=!e.sim.state.sandboxMode&&e.sim.state.level<P.unlockLevel,q=P.goodId?_e(P.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${D?"locked":""}"
                        data-stock-animal="${P.id}"
                        ${D?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${P.spritePair[0]}.png" alt="${$(P.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${$(P.name)}</span>
                        <span class="seed-card-seed-badge ${D?"no-seed":"has-seed"}">
                          ${D?`🔒 Lv.${P.unlockLevel}`:`🪙 ${P.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${$e(P.cycleSec)} • +${P.sellValue}G</span>
                        <span class="seed-card-stock">${q?`+${P.yieldQty} ${$(q.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const I=ot[i.pastureAnimalId],V=i.pastureReadyAt??r,j=i.pastureStockedAt??V-I.cycleSec*1e3,ne=Math.max(0,Math.ceil((V-r)/1e3)),se=ne<=0,de=se?100:Math.max(6,Math.min(98,Math.round((r-j)/Math.max(1e3,V-j)*100))),te=I.goodId?_e(I.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${I.spritePair[0]}.png" alt="${$(I.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${$(I.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${se?`🧺 +${I.sellValue}G${te?` +${I.yieldQty} ${$(te.name)}`:""}`:`⏱️ ${Ie(ne)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${de}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${se?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${I.sellValue}G)
                          </button>
                        `:i.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!se&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((a.workshopGroupId||a.isFarmlandPlot||a.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${a.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${a.spriteKey}.png" alt="${$(a.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${$(a.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(i.stars)}${"☆".repeat(5-i.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${a.isFarmlandPlot?"🌱 Ruộng":a.isAnimalPasturePlot?"🐾 Đồng cỏ":a.connectableGroup==="flower_garden"?"🌸 Vườn hoa":a.workshopGroupId?"🔥 Xưởng":`👥 ${i.visitorsServed}`}${T?` • 🎟️ ${u}/${Ji}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${A}
        ${O}
        ${M}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${p?"#15803d":"#dc2626"};">
            ${p?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${g>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((g-1)*100)}%G • +${Math.round((m-1)*100)}%XP</div>`:""}
          ${a.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${At[a.producesIngredient].emoji} ${At[a.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const I=Math.max(0,i.buildReducedSec??0),V=Math.max(1e3,a.buildDurationSec*1e3,i.constructEndsAt-(i.placedAt||r-1e3)+I*1e3),j=Math.max(1,Math.min(99,Math.floor((1-(i.constructEndsAt-r)/V)*100))),ne=e.sim.getBuildingMinFloorSec(i),se=Math.max(0,s-ne),de=se<=0&&e.sim.getActiveConstructions(r).some(P=>P.uid!==i.uid&&Math.ceil((P.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(P)),te=se>0||de,N=a.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${a.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${j}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${j}" aria-label="${N}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${Ie(s)}</strong>${I>0?` • <span style="color:var(--teal-deep);">-${$e(I)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1 1 132px;" ${te?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1 1 132px;" ${te?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${se>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1 1 160px;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
                              🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                            </button>`:""}
                      ${e.sim.state.sandboxMode?`<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1 1 120px;" title="Hoàn tất ngay">
                              ⚡ Xong ngay
                            </button>`:""}
                    </div>
                  </div>
                `})():i.awaitingUnveil?`
                <div class="quest-card-mini feast-unveil-insp-card">
                  <div class="feast-unveil-insp-title">🎀 Hoàn thiện!</div>
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:7px;">
                    🎀 Cắt Băng
                  </button>
                </div>
              `:a.baseIncome>0?(()=>{const I=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,V=Ii(i,a),j=Math.max(1,V*I),ne=Math.max(0,(r-(i.lastTickAt||r))/1e3),se=Math.max(1,Math.ceil(j-ne%j));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${d.galleons}🪙 +${d.xp}⭐</strong> / ${$e(V)}</div>
                      ${a.cycleSec>0&&!a.isFarmlandPlot&&!a.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${Ie(se)}</strong> • Kho: <strong>${i.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${i.storedGalleons}🪙</strong></div>`}
                      ${i.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${i.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${T&&!l&&!a.isFlooPortal?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>⚙️ Độ bền:</span>
                  <span style="color:${i.isBrokenDown?"#dc2626":i.durability<50?"#b45309":"#15803d"};">${Math.round(i.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(i.durability)}" aria-label="Độ bền"></progress>
                ${i.isBrokenDown||i.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${i.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">
                        🪄 Sửa (0G)
                      </button>`:""}
              </div>
            `:""}

        ${k?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${S.min}–${S.max}G):</span>
                  <span id="lblBuildingPriceVal">${L}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${S.min}" max="${S.max}" value="${L}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${x.color};">
                  ${x.label}
                </div>
              </div>
            `:""}

        ${a.isCustomCoasterStation&&i.coasterStats&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${i.coasterStats.lengthMeters}m • 🔥 ${i.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `:""}

        ${h?`
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
                  <strong>🐾 ${$(i.creatureNickname||a.creatureName||a.name)}</strong>
                  <span class="morph-pill ${i.creatureMorph==="radiant"?"radiant":i.creatureMorph==="mystic"?"mystic":""}">
                    ${Ge[i.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${i.creatureBondLevel??1}/${xt} • ${y[i.creatureStage??"baby"]} • 🌿 ${C?.score??50}% • 🥩 ${Math.round(i.creatureHunger??90)}%</div>
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

        ${a.isBackstage&&v&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${v.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${v.shieldCount}/${v.needed} ${v.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        ${a.id==="burrow_honeydukes_canon"&&!l?`
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🍬 Vào Gác Xép Bùa Gặt Honeydukes
              </button>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&i.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1 1 170px;">
                  ⬆️ ${i.stars+1}★ (🌟${Bi(i.stars)} + 🪙${c.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${i.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" style="flex:0 1 auto;" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const U=t.querySelector("#inpBuildingPrice");U&&(e.wireRangeProgressFallback(U),U.addEventListener("input",()=>{const I=Number(U.value);e.sim.setBuildingCustomPrice(i.uid,I);const V=e.sim.getEffectivePrice(i,a),j=t.querySelector("#lblBuildingPriceVal");j&&(j.textContent=`${V} Galleon`);const ne=e.sim.getPriceValueVerdict(i,a),se=t.querySelector("#lblPriceVerdict");se&&(se.textContent=ne.label,se.style.color=ne.color);const de=e.sim.getBuildingProductionPerCycle(i,a),te=t.querySelector("#lblBuildingProdVal");te&&(te.textContent=`+${de.galleons} 🪙 & +${de.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(i.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(i.uid,!0),he(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(I=>{I.addEventListener("click",()=>{const V=e.sim.useMorningDewPhial(i.uid);e.showToast(V.msg,V.ok?"🧪":"⏳"),he(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),he(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const I=i.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",I)}),t.querySelectorAll("[data-plant-crop]").forEach(I=>{I.addEventListener("click",()=>{const V=I.dataset.plantCrop,j=e.sim.plantCropOnPlot(i.uid,V);if(j.needSeedAcquire){const ne=i.uid;e.activeSeedCropId=V,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(V,ne);return}if(e.showToast(j.msg,j.ok?"🌱":"🪙"),j.ok){e.activeSeedCropId=V,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}he(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(I=>{I.addEventListener("click",()=>{const V=I.dataset.inspSeedFilter;(V==="all"||V==="flowers"||V==="crops")&&(e.seedFilterMode=V,he(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(I=>{I.addEventListener("click",()=>{const V=I.dataset.stockAnimal,j=e.sim.stockAnimalOnPasture(i.uid,V);if(e.showToast(j.msg,j.ok?ot[V]?.emoji??"🐾":"🪙"),j.ok){e.activePastureAnimalId=V,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}he(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const I=e.sim.feedAnimalPasture(i.uid);e.showToast(I.msg,I.ok?"🌾":"⏳"),he(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const I=e.sim.harvestAnimalPasture(i.uid);e.showToast(I.msg,I.ok?"🧺":"⏳"),he(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const I=e.sim.clearAnimalFromPasture(i.uid);e.showToast(I.msg,I.ok?"🐾":"⚠️"),he(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const I=e.sim.waterCropPlot(i.uid);e.showToast(I.msg,I.ok?"💧":"⏳"),he(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const I=e.sim.harvestCropPlot(i.uid);e.showToast(I.msg,I.ok?"🌾":"🏡"),he(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),he(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(I=>{I.addEventListener("click",()=>{const V=I.dataset.wsEnqueue,j=e.sim.enqueueWorkshopRecipe(i.uid,V);e.showToast(j.msg,j.ok?"🔥":"🧺"),he(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(i.uid),he(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(i.uid),he(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(i.uid),he(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=i.uid,e.inspectSelection=null,he(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${a.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(i.uid),he(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",i.uid)}),t.querySelector("#btnInspOpenHoneydukesMatch3")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openMatch3Dialog()}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const I=e.sim.upgradeBuildingStar(i.uid);e.showToast(I.msg,I.ok?"🌟":"🪙"),he(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=i.uid,e.rotation=i.rotation,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${a.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const o=e.inspectSelection.id,i=e.sim.staff.find(l=>l.id===o);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=e.sim.state.staffPatrolZones?.[i.id]??i.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${$(i.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${$(i.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${a==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${Gn.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${a===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const s=l.currentTarget.value;e.sim.setStaffPatrolZone(i.id,s),e.showToast(`Đã phân công khu tuần tra cho ${i.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const o=Bs(e.inspectSelection.zoneId),i=Ds(o),a=e.sim.state.level>=o.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${$(o.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>
        <div style="font-size:12.5px;margin-bottom:10px;font-weight:700;">
          🔒 Lv.${o.unlockLevel} • <strong>🌟 ${i}</strong>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${a?"gold-cta":""}" style="width:100%;">
          🔓 Mở (🌟 ${i})
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,he(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,he(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(o.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,he(e))})}}function Qn(e,t){t&&(e.activeWorkshopTab=t),qe(e);const n=e.root.querySelector("#workshopDialog");n.open||n.showModal()}function Js(e,t,n){e.collapseBuildDock(),qt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=n??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function pt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function so(e){e.seedTrayOpen?(pt(e),e.refreshAll()):Js(e,e.activeSeedCropId??void 0)}function ei(e,t,n){e.collapseBuildDock(),pt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=n??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function qt(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function io(e){e.pastureTrayOpen?(qt(e),e.refreshAll()):ei(e,e.activePastureAnimalId??void 0)}function ti(e){const t=e.root.querySelector("#seedBrushTray"),n=e.root.querySelector("#btnOpenSeedSilo");if(n){const p=e.seedTrayOpen||!!e.activeSeedCropId;n.dataset.active=String(p),n.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(p=>le(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,i=e.sim.state.buildings.filter(p=>le(p.itemId)?.isFarmlandPlot).length,a=e.activeSeedCropId?Te[e.activeSeedCropId]:null,r=Object.values(Te).sort((p,g)=>p.unlockLevel-g.unlockLevel||p.growSec-g.growSec),l=r.filter(p=>p.isFlowerCrop).length,s=r.length-l,d=r.filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),c=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${s})`}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),u=d.map(p=>{const g=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,m=e.activeSeedCropId===p.id,T=e.sim.getSeedCount(p.id),h=e.sim.getFarmItemCount(p.id),y=$e(p.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${g?"locked":""} ${m?"selected":""} ${!g&&T<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${m}"
              ${g?"disabled":""}
            >
              <img src="${Lt(p.id)}" alt="${$(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${$(p.name)}</span>
              <span class="seed-card-seed-badge ${T>0?"has-seed":"no-seed"}">
                ${g?`🔒 Cấp ${p.unlockLevel}`:T>0?`🌱 ${T}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${g?`⏱️ ${y}`:`⏱️ ${y} • 🪙${p.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${h}</span>
            </button>
            ${g?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Nạp hạt ${$(p.name)}" title="Mua hạt ${$(p.name)} (${p.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🌱 <strong>${$(a.name)}</strong> (${e.sim.getSeedCount(a.id)})`:"🌱 Hạt Giống & Hoa"}
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${o}/${i}</strong></span>
            <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${c}</div>
          </div>
        </div>
        <div class="seed-tray-actions">
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
          <button id="btnCloseSeedTray" type="button" class="brass-btn" aria-label="Đóng túi hạt giống">✕</button>
        </div>
      </div>
      <div class="seed-tray-scroll">${u}</div>
    `,t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.seedFilter;(m==="all"||m==="flowers"||m==="crops")&&(e.seedFilterMode=m,ti(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.acquireSeed,T=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,T)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),g=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.seedBrush,m=Te[g],T=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(g)<=0){e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,T);return}if(e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,T){const h=e.sim.state.buildings.find(y=>y.uid===T);if(h&&le(h.itemId)?.isFarmlandPlot&&!h.cropId){const y=e.sim.plantCropOnPlot(h.uid,g);if(y.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(g,h.uid);return}e.showToast(y.msg,y.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${m.emoji} ${m.name} (Túi có ${e.sim.getSeedCount(g)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,m.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=le("farmland_plot");p&&(pt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=le("burrow_flower_garden");p&&(pt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Qn(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{pt(e),e.refreshAll()})}function ao(e){const t=e.root.querySelector("#pastureBrushTray"),n=e.root.querySelector("#btnOpenPastureTray");if(n){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;n.dataset.active=String(l),n.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(l=>le(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,i=e.sim.state.buildings.filter(l=>le(l.itemId)?.isAnimalPasturePlot).length,a=e.activePastureAnimalId?ot[e.activePastureAnimalId]:null,r=Object.values(ot).map(l=>{const s=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,d=e.activePastureAnimalId===l.id,c=l.goodId?_e(l.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${s?"locked":""} ${d?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${d}"
              ${s?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.png" alt="${$(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${$(l.name)}</span>
              <span class="seed-card-seed-badge ${s?"no-seed":"has-seed"}">
                ${s?`🔒 Cấp ${l.unlockLevel}`:`🪙 ${l.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${$e(l.cycleSec)} • +${l.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${c?`+${l.yieldQty} ${$(c.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🐾 <strong>${$(a.name)}</strong> (${a.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
          </div>
          <div class="seed-tray-sub">
            Ô trống: <strong>${o}/${i}</strong>
          </div>
        </div>
        <div class="seed-tray-actions">
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn gold-cta" title="Đặt thêm Đồng Cỏ (45G)">
            🐾 + Đồng Cỏ 45G
          </button>
          <button id="btnPastureTrayOpenBarn" type="button" class="brass-btn" title="Mở Kho">
            📦 Kho
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${r}</div>
    `,t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const s=l.dataset.pastureBrush,d=ot[s];if(!d)return;const c=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=s,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,c){const u=e.sim.state.buildings.find(p=>p.uid===c);if(u&&le(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId){const p=e.sim.stockAnimalOnPasture(u.uid,s);e.showToast(p.msg,p.ok?d.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${d.emoji} ${d.name} (${d.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,d.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=le("burrow_animal_pasture");l&&(qt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Qn(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{qt(e),e.refreshAll()})}function oo(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();if((n.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){qe(e);return}if(e.activeWorkshopTab==="brew"){const a=t.querySelector("#btnWsQuickHerb");if(a){const s=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),d=s===0||n.sandboxMode;a.classList.toggle("gold-cta",d),a.textContent=d?"🌿 Hái Thảo Dược":`🌱 (${$e(s)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&n.supply.activeBrew){const s=Wt.find(c=>c.id===n.supply.activeBrew?.goodId),d=Math.max(0,Math.ceil((n.supply.activeBrew.endsAt-o)/1e3));s&&(r.textContent=`🔥 ${s.emoji} ${s.name} (còn ${Ie(d)})`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const s=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),d=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3));if(s<=0&&d<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const c=[];s>0&&c.push(`🍻 +85%G (${Ie(s)})`),d>0&&c.push(`🧪 +35%XP (${Ie(d)})`),l.textContent=`✨ ${c.join(" • ")}`}}}}function qe(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const i=e.sim.activeSynergies.activeIds.size,a=n.supply.cargoCrates.filter(c=>c.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),s=`
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
          🌟 Combo (${i}/12)
        </button>
      </div>
    `;let d="";if(e.activeWorkshopTab==="barn"){const c=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),u=e.sim.getBarnUpgradeCostInfo(),p=n.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":u.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${u.baseGoldCost})`:`🏡 +20 Ô (🪙${u.effectiveGoldCost} • bù 1🔌)`,g=u.hasPlug?`🔌 ×${u.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${u.plugShortageBuyout}G)`,m=k=>k.map(S=>{const L=_e(S),x=e.sim.getFarmItemCount(S);return`
              <div class="barn-stock-card ${x>0?"in-stock":"empty"}">
                <img src="${L.iconSrc}" alt="${$(L.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${$(L.name)}</div>
                <div class="barn-stock-qty"><strong>×${n.sandboxMode?"∞":x}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${x>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${S}"
                  ${x<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${L.sellValue}G
                </button>
              </div>
            `}).join(""),T=e.sim.getPhoenixTalismanCount(),h=e.sim.getPhoenixTalismanDailyStatus(),y=e.sim.getCraftablePhoenixBarnGood(),C=y?_e(y):null,v=n.sandboxMode||T<En&&!!y&&n.galleons>=ds;d=`
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${l}/${r.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${r.ordersDelivered} • ${g}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${u.canAfford?"":"disabled"}
              style="padding:7px 14px;font-size:12.5px;${u.canAfford?"":"opacity:0.55;cursor:not-allowed;"}"
            >
              ${p}
            </button>
          </div>
          <div class="quest-bar" style="height:10px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${c}%"></div>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <div class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${T}/${En}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${h.usedCount}/${h.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${v?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${C?`1 ${$(C.name)}`:"1 Đặc sản"} + ${ds}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(Te).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(Te))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(ct).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(ct))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const c=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),u=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),p=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3)),g=n.supply.activeBrew,m=g?Wt.find(L=>L.id===g.goodId):void 0,T=g?Math.max(0,Math.ceil((g.endsAt-o)/1e3)):0,h=Math.max(0,n.supply.brewCompletedCount??0),y=h+1,C=n.buildings.some(L=>le(L.itemId)?.isWorkshopBrewery&&o>=L.constructEndsAt),v=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),k=h===0?"Mẻ #1 (khởi động: 1 giờ)":h===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":h===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${y} (đạt trần tối đa: 6 giờ)`,S=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];d=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${c===0||n.sandboxMode?"gold-cta":""}">
            ${c>0&&!n.sandboxMode?`🌱 (${$e(c)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${k}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${C?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${v?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${S.map(L=>{const x=At[L],A=n.supply.ingredients[L]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${x.emoji} ${x.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":A}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${u>0||p>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${u>0?`🍻 +85%G (${Ie(u)}) `:""}${p>0?`• 🧪 +35%XP (${Ie(p)})`:""}
              </div>
            `:""}

        ${g&&m?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${m.emoji} ${$(m.name)} (còn ${Ie(T)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Wt.map(L=>{const x=n.supply.goods[L.id]??0,A=e.sim.getBrewDurationSec(L),M=$e(A),O=Object.entries(L.inputs).map(([U,I])=>{const V=At[U],j=n.supply.ingredients[U]??0;return`<span style="color:${n.sandboxMode||j>=(I??0)?"#15803d":"#dc2626"};font-weight:800;">${V.emoji} ${j}/${I}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${L.emoji} ${L.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${n.sandboxMode?"∞":x}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${O}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${L.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${M})
                  </button>
                  <button type="button" data-use-good="${L.id}" class="brass-btn" style="flex:1;">
                    ${L.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const c=Math.round(240+n.level*40),u=Math.round(160+n.level*25);d=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${c.toLocaleString("vi-VN")}🪙 +${u}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((p,g)=>{const m=Wt.find(y=>y.id===p.goodId),T=n.supply.goods[p.goodId]??0,h=!p.fulfilled&&(n.sandboxMode||T>=p.qtyRequired);return`
                <div class="crate-card ${p.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${g+1}</span>
                      <span>${p.fulfilled?"✅":`${n.sandboxMode?"∞":T}/${p.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${m.emoji} ${m.name} ×${p.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${p.rewardGalleons}🪙 • +${p.rewardXp}⭐ • +${p.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${p.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':h?`<button type="button" data-fulfill-crate="${p.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else d=`
        <div class="grid-2col">
          ${Ni.map(c=>{const u=e.sim.activeSynergies.activeIds.has(c.id),p=c.requiredItems.map(g=>le(g)?.name??g).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${u?"#d97706":"rgba(138,90,43,0.3)"};background:${u?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${c.emoji} ${$(c.name)}</span>
                  <span style="font-size:12px;font-weight:800;color:${u?"#15803d":"#78350f"};">
                    ${u?"✅":`≤${c.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">🔗 ${p}</div>
                <div style="font-size:12px;font-weight:800;color:#15803d;">
                  +${c.goldBonusPct}%G • +${c.xpBonusPct}%XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=s+d,t.querySelectorAll("[data-ws-tab]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab=c.dataset.wsTab,qe(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const c=e.sim.upgradeFarmBarn();e.showToast(c.msg,c.ok?"🏡":"🔌"),qe(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const c=e.sim.craftPhoenixTalismanFromBarn();e.showToast(c.msg,c.ok?"🔥":"🧺"),qe(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.sellFarmItemFromBarn(c.dataset.sellFarmItem,1);u.ok||e.showToast(u.msg,"🧺"),qe(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const c=e.sim.quickHarvestHerbs();e.showToast(c.msg,c.ok?"🌿":"⏳"),qe(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&qe(e)}),t.querySelectorAll("[data-brew-good]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.startBrewing(c.dataset.brewGood);e.showToast(u.msg,u.ok?"🧪":"⚠️"),qe(e)})}),t.querySelectorAll("[data-use-good]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.useGood,p=e.sim.useCraftedGood(u);p.ok?u==="dragon_firework"?e.root.querySelector("#workshopDialog").close():qe(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.fulfillCargoCrate(c.dataset.fulfillCrate);e.showToast(u.msg,u.ok?"📦":"⚠️"),qe(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab="brew",qe(e)})})}function ro(e){e.closeHudPopovers(),ni(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function lo(e){const t=e.sim.getClaimableHarvestFeastCount(),n=e.root.querySelector("#badgeFeastCount");n&&(t>0?(n.textContent=String(t),n.classList.remove("hidden")):n.classList.add("hidden"));const o=e.root.querySelector("#badgeManageFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"))}function co(e,t){const n=e.root.querySelector("#ribbonUnveilToastCard");n&&(n.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${$(t.speakerEmoji)} ${$(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${$(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,n.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{n.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function ni(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const n=e.sim.ensureHarvestFeast(),o=new Set(n.claimedTiers),i=vt[vt.length-1]?.pointsRequired??3e3,a=Math.min(100,Math.round(n.points/Math.max(1,i)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=vt.every(c=>o.has(c.tier)),s=vt.find(c=>!o.has(c.tier)),d=vt.map(c=>{const u=o.has(c.tier),g=n.points>=c.pointsRequired&&!u,m=ea(c),T=c.tier%5===0;return`
        <article class="feast-tier-card ${u?"is-claimed":g?"is-claimable":"is-locked"} ${T?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${c.tier}</span>
            <span class="feast-tier-pts">🍁 ${c.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${$(c.icon)} ${$(c.titleVi)}</span>
              ${T?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${$(m)}</div>
          </div>
          <div class="feast-tier-cta">
            ${u?'<span class="feast-claimed-pill">✓</span>':g?`<button type="button" data-claim-feast-tier="${c.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(c.pointsRequired-n.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${n.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${n.points.toLocaleString("vi-VN")} / ${i.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${l?"🎉 30/30!":s?` Kế tiếp: #${s.tier} (${s.pointsRequired.toLocaleString("vi-VN")} 🍁)`:""}
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
        ${d}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const c=e.sim.claimAllHarvestFeastTiers();e.showToast(c.msg,c.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const c=e.sim.startNextHarvestFeastCycle();e.showToast(c.msg,c.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(c=>{c.addEventListener("click",()=>{const u=Number(c.dataset.claimFeastTier);if(!Number.isFinite(u))return;const p=e.sim.claimHarvestFeastTier(u);e.showToast(p.msg,p.ok?"🎁":"🍁"),e.refreshAll()})})}function po(e){const t=e.root.querySelector("#financeDialogContent"),n=e.sim.state.finance,o=n.gateRevenue+n.ticketRevenue+n.shopRevenue+n.harvestRevenue,i=n.staffWagesPaid+n.constructionSpent,a=o-i,r=e.sim.getHourlyStaffWage();t.innerHTML=`
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
    `}function nt(e){const t=e.root.querySelector("#albumDialogContent"),n=e.sim.state;e.sim.checkAndToastAchievements();const o=ta(n),i=na(n),a=ps.filter(c=>{const u=o.achievements[c.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=us.filter(c=>c.day<=r&&!o.claimedLoginDays.includes(c.day)).length,s=`
      <div class="workshop-tabs" role="tablist" aria-label="Sổ Vàng Hang Sóc" style="margin-bottom:12px;">
        <button type="button" data-atab="cup" data-active="${e.activeAlbumTab==="cup"}" aria-selected="${e.activeAlbumTab==="cup"}" class="brass-btn">
          🏆 Cúp 4 Nhà
        </button>
        <button type="button" data-atab="achievements" data-active="${e.activeAlbumTab==="achievements"}" aria-selected="${e.activeAlbumTab==="achievements"}" class="brass-btn">
          🎖️ Thành Tựu (${i.unlocked}/${i.total})${a>0?` • 🎁${a}`:""}
        </button>
        <button type="button" data-atab="friendship" data-active="${e.activeAlbumTab==="friendship"}" aria-selected="${e.activeAlbumTab==="friendship"}" class="brass-btn">
          💝 Tình Bạn &amp; Phim
        </button>
        <button type="button" data-atab="login7" data-active="${e.activeAlbumTab==="login7"}" aria-selected="${e.activeAlbumTab==="login7"}" class="brass-btn">
          📅 Điểm Danh 7N${l>0?` • 🎁${l}`:""}
        </button>
      </div>
    `;let d="";if(e.activeAlbumTab==="cup"){const c=e.sim.getPlayerHouse(),u=n.weeklyHouseCupServerStandings,p=[{house:"Gryffindor",icon:"🦁",pts:(n.housePoints.Gryffindor??0)+(u?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(n.housePoints.Slytherin??0)+(u?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(n.housePoints.Ravenclaw??0)+(u?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(n.housePoints.Hufflepuff??0)+(u?.totals.Hufflepuff??0)}];p.sort((y,C)=>C.pts-y.pts);const g=Math.max(100,p[0]?.pts??100),m=(n.housePoints.Gryffindor??0)+(n.housePoints.Slytherin??0)+(n.housePoints.Ravenclaw??0)+(n.housePoints.Hufflepuff??0),T=n.houseCupMilestoneTier*300,h=m>=T;d=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${c}</strong>${u?` • Tuần HPVN ${u.weekKey} (đóng góp: +${u.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${n.houseCupMilestoneTier}: ${m} / ${T}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${p.map((y,C)=>{const v=Math.min(100,Math.max(8,Math.round(y.pts/g*100))),k=y.house===c;return`
                  <div class="aaa-hourglass-card" data-house="${y.house}" data-player-house="${k}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${C===0?"👑 ":""}${y.icon} ${y.house}</span>
                      ${k?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${y.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${v}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${T}" value="${Math.min(T,m)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${h?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${n.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const c=Date.now(),u={farm:rt(n,"farm",c),building:rt(n,"building",c),puzzle:rt(n,"puzzle",c),language:rt(n,"language",c),social:rt(n,"social",c),collection:rt(n,"collection",c)};d=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${i.completionPct}% (${i.unlocked}/${i.total})</span>
          </div>
          <progress max="${i.total}" value="${i.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${ps.map(p=>{const g=o.achievements[p.id],m=!!g?.unlockedAt,T=!!g?.claimedAt,h=Math.min(p.target,Math.max(0,u[p.category]??0)),y=h.toLocaleString("vi-VN"),C=p.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${m}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${p.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${p.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${p.descVi} • Thưởng <strong>+${p.rewardGalleons}G, +${p.rewardStars} 🌟</strong></div>
                    ${m?"":`<progress max="${p.target}" value="${h}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${T?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':m?`<button type="button" data-claim-ach="${p.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${y}/${C}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const c=e.sim.getRealTimePeriod(),u=sa();d=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${zs.map(p=>{const g=n.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${p.titleVi}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">Yêu cầu: Cấp ${p.unlockLevel}</div>
                  <button type="button" data-play-cutscene="${p.id}" ${g?"":"disabled"} class="brass-btn ${g?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                    ${g?"🎬 Phát Phim Camera":`🔒 Mở ở Cấp ${p.unlockLevel}`}
                  </button>
                </div>
              `}).join("")}
          </div>
        </div>
        <div class="aaa-codex-scroll">
          ${ia.map(p=>{const g=aa(p.id,c),m=o.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},T=m.level*60,h=m.lastTalkedDayKey===u;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${p.moodBubble} ${p.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${p.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${m.level}/10 (${m.xp}/${T})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${g.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${p.id}" data-choice="0" ${h?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${h?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${h?"":`<button type="button" data-npc-talk="${p.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else d=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${us.map(c=>{const u=o.claimedLoginDays.includes(c.day),p=!u&&c.day<=r;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${c.titleVi}</div>
                  <div style="font-size:11.5px;color:var(--ink-soft);">
                    +${c.galleons}G • +${c.magicStars} 🌟${c.phoenixTalismans>0?` • +${c.phoenixTalismans} 🔥`:""}
                  </div>
                  ${u?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận quà</span>':`<button type="button" data-claim-login="${c.day}" ${p?"":"disabled"} class="brass-btn ${p?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                          ${p?"🎁 Nhận Ngay":"🔒 Mở kế tiếp"}
                        </button>`}
                </div>
              `}).join("")}
          </div>
        </div>
      `;t.innerHTML=s+d,t.querySelectorAll("[data-atab]").forEach(c=>{c.addEventListener("click",()=>{e.activeAlbumTab=c.dataset.atab,nt(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&nt(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const c=await kt(()=>Promise.resolve().then(()=>Eo),void 0);if(typeof c.fetchWeeklyHouseCupStandingsOnline=="function"){const u=await c.fetchWeeklyHouseCupStandingsOnline();if(u){n.weeklyHouseCupServerStandings=u,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${u.weekKey}!`,"🏆"),nt(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(c.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),nt(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(c=>{c.addEventListener("click",()=>{e.playStoryCutscene(String(c.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.npcTalk,p=Number(c.dataset.choice)===1?1:0,g=e.sim.talkWithVillagerChoice(u,p);e.showToast(g.msg,g.ok?"💝":"☕"),nt(e)})}),t.querySelectorAll("[data-claim-login]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(c.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),nt(e)})})}function je(e){const t=e.root.querySelector("#questDialogContent"),n=e.sim.ensureFarmBarn(),o=e.sim.getActiveStoryQuest(),i=e.sim.getStoryAutoActionPreview(),a=e.sim.getReadyOwlOrdersCount(),r=(o?.completed?1:0)+e.sim.state.owlQuests.filter(m=>m.completed&&!m.claimed).length+e.sim.state.dailyQuests.filter(m=>m.completed&&!m.claimed).length;if(!e.selectedOwlOrderId||!n.owlOrders.some(m=>m.id===e.selectedOwlOrderId)){const m=n.owlOrders.find(T=>e.sim.canFulfillFarmOwlOrder(T));e.selectedOwlOrderId=(m??n.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${a}/${n.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const m=n.owlOrders.find(C=>C.id===e.selectedOwlOrderId)??n.owlOrders[0],T=m?e.sim.canFulfillFarmOwlOrder(m):!1,h=n.owlOrders.map(C=>{const v=m?.id===C.id,k=e.sim.canFulfillFarmOwlOrder(C),S=C.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${C.portraitSprite}.png" alt="${$(C.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${$(C.portraitEmoji)}</span>`,L=C.requirements.slice(0,3).map(x=>{const A=_e(x.itemId);return`<img src="${A.iconSrc}" alt="${$(A.name)}" title="${x.qty} ${$(A.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${v?"selected":""} ${k?"ready":""}"
              data-select-owl="${$(C.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${S}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${$(C.senderName)}</div>
                <div class="owl-note-mini-row">${L}</div>
                ${C.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${k?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),y=m?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${$(m.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${$(m.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${m.requirements.map((C,v)=>{const k=_e(C.itemId),S=e.sim.getFarmItemCount(C.itemId),L=e.sim.ensureNeighborSocial(),x=Math.max(0,Qt-L.dailyOwlHelpRequestedCount),A=e.sim.getOwlRequirementHelpState(m.id,v),M=!!A?.fulfilledAt,O=e.sim.state.sandboxMode||M||S>=C.qty,U=M?`<span class="owl-help-tag done">✓ ${$(A?.helperEmoji??"🦉")}</span>`:A?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':O?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${v}" ${x<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${x})</button>`;return`
                    <div class="owl-req-row ${O?"ok":"lack"}">
                      <img src="${k.iconSrc}" alt="${$(k.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${$(k.name)}</div>
                        <div class="owl-req-count">${M?"✓":`${e.sim.state.sandboxMode?"∞":S}/${C.qty}`}</div>
                      </div>
                      ${U}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${m.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${m.rewardXp}</span>
                ${m.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${m.rewardMugglePlug}</span>`:""}
                ${(m.isFeastMarquee||(n.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<En?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${h}</div>
            ${y}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${T?"ready":"not-ready"}"
            >
              🦉 ${T?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(C=>{C.addEventListener("click",()=>{e.activeQuestTab=C.dataset.qtab,je(e)})}),t.querySelectorAll("[data-select-owl]").forEach(C=>{C.addEventListener("click",()=>{e.selectedOwlOrderId=C.dataset.selectOwl??null,je(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{m&&(e.sim.refreshFarmOwlOrder(m.id),e.selectedOwlOrderId=null,je(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(C=>{C.addEventListener("click",()=>{if(!m)return;const v=Number(C.dataset.askOwlHelp);if(!Number.isFinite(v))return;const k=e.sim.requestPlayerOwlCrateHelp(m.id,v);k.ok||e.showToast(k.msg,"⚠️"),je(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!m)return;if(!e.sim.canFulfillFarmOwlOrder(m)){const v=e.sim.fulfillFarmOwlOrder(m.id);e.showToast(v.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const C=e.sim.fulfillFarmOwlOrder(m.id);C.ok&&e.showToast(C.msg,"🦉"),e.selectedOwlOrderId=null,je(e)});return}const s=(m,T,h=!1)=>{const y=Math.min(100,Math.round(m.progress/Math.max(1,m.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${$(m.giverEmoji)} ${$(m.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${$(T)}</span>
          </div>
          ${h&&m.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${$(m.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${y}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(m.progress,m.targetAmount)}/${m.targetAmount}</span>
            <span>🪙${m.rewardGalleons} • ⭐${m.rewardXp} ${m.rewardTimeSand>0?`• ⏳${m.rewardTimeSand}`:""}</span>
          </div>
          ${m.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':m.completed?`<button type="button" data-modal-claim="${$(m.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:h?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${$(i.shortLabel)}</button>`:""}
        </div>
      `},d=e.sim.getRequiredLevelTrial(),c=e.sim.getWinsProgressForCurrentLevel(),u=m=>{const T=e.sim.getDisciplineStageInfo(m);return T.isMaxed?"👑777":`${T.currentStage}/777`},p=d&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${c.current}/${c.required}): ${d.icon} ${$(d.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${d.kind==="match3"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🍓 (${u("match3")})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${d.kind==="caro"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${u("caro")})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${d.kind==="sudoku"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🔮 (${u("sudoku")})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${d.kind==="chess"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🏰 (${u("chess")})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${d.kind==="blocks"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🦄 (${u("blocks")})</button>
              <button type="button" data-modal-open-trial="jigsaw" class="brass-btn ${d.kind==="jigsaw"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🧩 (${u("jigsaw")})</button>
            </div>
          </div>
        </div>
      `:"",g=o?`Ch.${o.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${Oi.length}`:"";t.innerHTML=`
      ${l}
      ${p}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${o?s(o,g,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(m=>s(m,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(m=>s(m,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(m=>{m.addEventListener("click",()=>{e.activeQuestTab=m.dataset.qtab,je(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(m=>{m.addEventListener("click",()=>{const T=m.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(T)})}),t.querySelectorAll("[data-modal-claim]").forEach(m=>{m.addEventListener("click",()=>{e.sim.claimQuest(m.dataset.modalClaim),je(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const m=e.sim.completeStoryStepWithStar();m.ok?(typeof m.placedGx=="number"&&typeof m.placedGy=="number"&&fe(e.cam,m.placedGx,m.placedGy),je(e)):(e.showToast(m.msg,m.reason==="missing_gold"?"🪙":"🌟"),(m.reason==="missing_stars"||m.reason==="locked_level"||m.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function si(e){const t=e.root.querySelector("#roadmapDialogContent"),n=new Set(e.sim.state.unlockedZones),o=e.sim.getRequiredLevelTrial(),i=Gn.map(r=>{const l=n.has(r.id)||e.sim.state.sandboxMode,s=!l&&e.sim.state.level>=r.unlockLevel,d=Ds(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${l?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${d>0?`🌟 ${d}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${s?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),a=Ri.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${o&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${o.icon} ${$(o.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${i}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${a.map(r=>{const l=e.sim.state.level>=r.level,s=r.unlockedItemIds.map(d=>le(d)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${s?`<span style="font-size:12px;margin-left:6px;">${s}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=Bs(r.dataset.camZone);fe(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),si(e)})})}function Re(e){const t=e.root.querySelector("#settingsDialogContent"),n=e.sim.state,o=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
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
            ${["realtime","dawn","day","dusk","night"].map(i=>{const a={realtime:"🕒 24h",dawn:"🌅 Bình minh",day:"☀️ Ngày",dusk:"🌇 Chiều",night:"🌙 Đêm"};return`<button type="button" data-time="${i}" data-active="${n.settings.timeOverride===i}" aria-pressed="${n.settings.timeOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[i]}</button>`}).join("")}
          </div>

          

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","clear","cloudy","rain","storm","snow","fog"].map(i=>{const a={auto:"🌦️ Tự động",clear:"☀️ Nắng",cloudy:"⛅ Mây",rain:"🌧️ Mưa",storm:"⛈️ Giông",snow:"❄️ Tuyết",fog:"🌫️ Sương"};return`<button type="button" data-weather="${i}" data-active="${n.settings.weatherOverride===i}" aria-pressed="${n.settings.weatherOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${o}" aria-pressed="${o}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!o}" aria-pressed="${!o}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
          </div>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎚️ Bàn Trộn Âm Thanh 4 Kênh &amp; Tiếp Cận (A11y)</div>
        ${(()=>{const i=e.getEffectiveA11ySettings();return`
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
              ${[{key:"master",label:"🔊 Tổng (Master)"},{key:"music",label:"🎼 Nhạc nền"},{key:"sfx",label:"🔔 Hiệu ứng"},{key:"voice",label:"🗣️ Giọng đọc"}].map(r=>{const l=Math.round((i.volumes[r.key]??.85)*100);return`
                    <label class="aaa-slider-row">
                      <span>${r.label}</span>
                      <input type="range" min="0" max="100" value="${l}" data-vol-bus="${r.key}" />
                      <span data-vol-val="${r.key}">${l}%</span>
                    </label>
                  `}).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;font-weight:700;">🎨 Chế độ màu:</span>
              ${[["none","Mặc định"],["protanopia","Đỏ-Lục (P)"],["deuteranopia","Lục-Đỏ (D)"],["tritanopia","Xanh-Vàng (T)"]].map(([r,l])=>`<button type="button" data-cb-mode="${r}" data-active="${i.colorblindMode===r}" aria-pressed="${i.colorblindMode===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span style="font-size:12px;font-weight:700;">🔠 Cỡ chữ:</span>
              ${[100,125,150].map(r=>`<button type="button" data-font-scale="${r}" data-active="${i.fontScale===r}" aria-pressed="${i.fontScale===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${r}%</button>`).join("")}
              <label class="switch-row" style="margin-left:auto;gap:6px;">
                <span style="font-size:12px;">⚡ Tương phản cao</span>
                <input id="swHighContrast" type="checkbox" switch ${i.highContrast?"checked":""} />
              </label>
            </div>
          `})()}
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">📐 Kiến Trúc Sư Điền Trang (Bố Cục &amp; Cất Nhanh)</div>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((i,a)=>{const r=n.layoutPresets?.[i];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">${r?r.label:`Bản Vẽ #${a+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${r?`${r.placements.length} công trình đã lưu`:"Chưa lưu vị trí"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${i}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Lưu</button>
                    <button type="button" data-load-layout="${i}" ${r?"":"disabled"} class="brass-btn ${r?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📐 Áp dụng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn">📦 Cất Nhanh Trang Trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn gold-cta">
            🌸 Bày Lại Trang Trí (${Object.values(n.stashedDecorInventory??{}).reduce((i,a)=>i+a,0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${["slot_1","slot_2","slot_3"].map((i,a)=>{const r=oa(i),l=!Fs()&&!!(r.ok&&(r.state?.sandboxMode||r.state?.sandboxTainted)),s=!!(r.ok&&!l);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${a+1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${l?"Ô lưu thử nghiệm (Đã khóa)":r.ok&&r.meta?`${$(r.meta.parkName)} • Cấp ${r.meta.level}`:"Ô trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-slot="${i}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Ghi</button>
                    <button type="button" data-load-slot="${i}" ${s?"":"disabled"} class="brass-btn ${s?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📂 Tải</button>
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
    `,"switch"in HTMLInputElement.prototype||kt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",i=>{n.settings.bgmEnabled=i.currentTarget.checked,e.sim.audio.bgmEnabled=n.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",i=>{n.settings.soundEnabled=i.currentTarget.checked,e.sim.audio.enabled=n.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",i=>{n.settings.cutawayMode=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",i=>{n.settings.showGrid=i.currentTarget.checked,e.refreshAll()}),t.querySelectorAll("[data-time]").forEach(i=>{i.addEventListener("click",()=>{n.settings.timeOverride=i.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Re(e)})}),t.querySelectorAll("[data-weather]").forEach(i=>{i.addEventListener("click",()=>{n.settings.weatherOverride=i.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Re(e)})}),t.querySelectorAll("[data-toon]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.toon==="on";e.sprites?.setToonEnabled(a),e.refreshAll(),Re(e)})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),fe(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(i=>{i.addEventListener("input",()=>{const a=i.dataset.volBus,r=Math.max(0,Math.min(1,Number(i.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[a]=r,n.a11ySettings=l;const s=t.querySelector(`[data-vol-val="${a}"]`);s&&(s.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(i=>{i.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.colorblindMode=i.dataset.cbMode,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Re(e)})}),t.querySelectorAll("[data-font-scale]").forEach(i=>{i.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.fontScale=Number(i.dataset.fontScale),n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Re(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",i=>{const a=e.getEffectiveA11ySettings();a.highContrast=i.currentTarget.checked,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.saveLayout,r=e.sim.saveLayoutPreset(a);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Re(e)})}),t.querySelectorAll("[data-load-layout]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.loadLayout,r=e.sim.applyLayoutPreset(a);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Re(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const i=e.sim.stashAllDecorItems();e.showToast(i.msg,i.ok?"📦":"⚠️"),e.refreshAll(),Re(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const i=e.sim.restoreAllStashedDecor();e.showToast(i.msg,i.ok?"🌸":"⚠️"),e.refreshAll(),Re(e)}),t.querySelectorAll("[data-save-slot]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(a);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Re(e)})}),t.querySelectorAll("[data-load-slot]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(a);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function uo(e,t,n){t&&(e.activeSuitcaseTab=t),n&&(e.selectedSuitcaseHabitatUid=n),ke(e);const o=e.root.querySelector("#suitcaseDialog");o.open||o.showModal()}function go(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const n=e.sim.getSuitcaseReadySummary();n.badgeCount>0?(t.textContent=String(n.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function mo(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=Date.now(),o=e.sim.state.suitcase,i=!!(o.activeIncubation&&n>=o.activeIncubation.endsAt),a=!!(o.activeExpedition&&n>=o.activeExpedition.endsAt);if((i!==e.lastSuitcaseIncReady||a!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){ke(e);return}if(o.activeIncubation&&n<o.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((o.activeIncubation.endsAt-n)/1e3)),l=Math.max(1e3,o.activeIncubation.endsAt-o.activeIncubation.startedAt),s=Math.min(100,Math.round((n-o.activeIncubation.startedAt)/l*100)),d=t.querySelector("[data-suitcase-inc-left]");d&&(d.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-inc-prog]");c&&(c.value=s)}if(o.activeExpedition&&n<o.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((o.activeExpedition.endsAt-n)/1e3)),l=Math.max(1e3,o.activeExpedition.endsAt-o.activeExpedition.startedAt),s=Math.min(100,Math.round((n-o.activeExpedition.startedAt)/l*100)),d=t.querySelector("[data-suitcase-exp-left]");d&&(d.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-exp-prog]");c&&(c.value=s)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((Ns-(n-(r.lastGroomedAt??0)))/1e3)),s=Math.max(0,Math.ceil((Os-(n-(r.lastTrainedAt??0)))/1e3)),d=t.querySelector("#btnScGroom");d&&(d.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const c=t.querySelector("#btnScTrain");c&&(c.textContent=s>0?`🎾 (${s}s)`:"🎾 Tập (20G • +45💝)")}}}function ke(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=e.sim.state,o=n.suitcase,i=Date.now(),a=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!a.some(v=>v.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=a[0]?.building.uid??null);const r=new Set(o.discoveredMorphs),l=bn.length*3,s=r.size,d=zi(s),c=n.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(o.activeIncubation&&i>=o.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(o.activeExpedition&&i>=o.activeExpedition.endsAt);const u=o.activeIncubation?i>=o.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",p=o.activeExpedition?i>=o.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${s}/${l}`,g=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${a.length}</strong></span>
        <span>📖 <strong>${s}/${l}</strong> (+${d}%)</span>
        <span>✨ <strong>${n.sandboxMode?"∞":c}</strong> • ⏳ <strong>${n.sandboxMode?"∞":n.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${e.activeSuitcaseTab==="care"}" aria-pressed="${e.activeSuitcaseTab==="care"}" class="brass-btn">
          🐾 Chăm Sóc (${a.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${e.activeSuitcaseTab==="morph"}" aria-pressed="${e.activeSuitcaseTab==="morph"}" class="brass-btn">
          🧬 Ấp Trứng (${u})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${e.activeSuitcaseTab==="expedition"}" aria-pressed="${e.activeSuitcaseTab==="expedition"}" class="brass-btn">
          🧭 Thám Hiểm (${p})
        </button>
      </div>
    `;let m="";if(e.activeSuitcaseTab==="care")if(a.length===0)m=`
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;else{const v=a.find(_=>_.building.uid===e.selectedSuitcaseHabitatUid)??a[0],k=v.building,S=v.item,L=Rt(S.id)??bn[0],x=k.creatureMorph??"normal",A=Ge[x],M=k.creatureBondLevel??1,O=k.creatureBondXp??0,U=M>=xt?100:Fi(M),I=M>=xt?100:O,V=Math.round((ns(M)-1)*100),j=k.creatureNickname||S.creatureName||S.name,ne=e.sim.getBuildingProductionPerCycle(k,S),se=e.sim.biomeCache.get(k.uid),de=Math.round(k.creatureHunger??90),te=Math.max(8,Math.round(S.cost*.04)),N=n.sandboxMode?0:Math.max(0,Math.ceil((Ns-(i-(k.lastGroomedAt??0)))/1e3)),P=n.sandboxMode?0:Math.max(0,Math.ceil((Os-(i-(k.lastTrainedAt??0)))/1e3)),D=o.activeExpedition?.habitatUid===k.uid;m=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${a.map(({building:_,item:Q})=>{const re=Rt(Q.id),X=_.creatureMorph??"normal",pe=Ge[X],me=_.creatureNickname||Q.creatureName||Q.name,ue=_.uid===k.uid;return`
                  <button type="button" data-select-pet="${$(_.uid)}" aria-pressed="${ue}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${re?.beastSpriteKey??Q.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${pe.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${$(me)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${_.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${L.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${$(L.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${x==="radiant"?"radiant":x==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${A.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${$(j)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${L.beastSpriteKey}.png"
                  alt="${$(j)}"
                  class="suitcase-diorama-img"
                  style="filter:${A.cssFilter} drop-shadow(0 0 18px ${A.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${L.emoji} ${$(j)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${$(L.morphNames[x])}${D?" • 🧭":""}
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
                  placeholder="${$(S.creatureName??S.name)}"
                  value="${$(k.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${M}/${xt} (+${V}%)</span>
                  <span style="color:#b45309;">${M>=xt?"MAX":`${O}/${U}`}</span>
                </div>
                <progress max="${U}" value="${I}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${$(L.favoriteTreat)} • <strong>+${ne.galleons.toLocaleString("vi-VN")}🪙 / ${$e(S.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${de}%</span>
                  <span>🌿 ${se?.score??60}% ${k.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${de}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${n.sandboxMode?"0G":`${te}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${N===0?"gold-cta":""}">
                  ${N>0?`🪮 (${N}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${P>0?`🎾 (${P}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const v=o.activeIncubation;let k="";if(v){const L=le(v.itemId),x=Rt(v.itemId),A=i>=v.endsAt,M=Math.max(0,Math.ceil((v.endsAt-i)/1e3)),O=Math.max(1e3,v.endsAt-v.startedAt),U=A?100:Math.min(100,Math.round((i-v.startedAt)/O*100));k=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${$(x?.speciesName??L?.name??"Trứng")}
                ${v.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${A?"✨ Nở!":`${M}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${U}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${A?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
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
        `;const S=a.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${a.map(({building:L,item:x})=>{const A=Rt(x.id),M=L.creatureMorph??"normal",O=e.sim.getMorphIncubationCost(x),U=L.creatureNickname||x.creatureName||x.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${A?.beastSpriteKey??x.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Ge[M].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${$(U)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Ge[M].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(I=>{const V=r.has(`${x.id}:${I}`);return`<span class="morph-pill ${V?I==="radiant"?"radiant":I==="mystic"?"mystic":"":"locked"}">${V?Ge[I].badge:`🔒 ${Ge[I].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${$(L.uid)}"
                        class="brass-btn ${v?"":"gold-cta"}"
                        ${v?"disabled":""}
                      >
                        ${v?"🥚 Đang ấp":`🥚 Ấp (${n.sandboxMode?"0G":`${O}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;m=`${k}${S}`}else{const v=o.activeExpedition;let k="";if(v){const L=fn.find(j=>j.id===v.expeditionId)??fn[0],x=n.buildings.find(j=>j.uid===v.habitatUid),A=x?le(x.itemId):void 0,M=x?.creatureNickname||A?.creatureName||"Thú cưng",O=i>=v.endsAt,U=Math.max(0,Math.ceil((v.endsAt-i)/1e3)),I=Math.max(1e3,v.endsAt-v.startedAt),V=O?100:Math.min(100,Math.round((i-v.startedAt)/I*100));k=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${L.emoji} ${$(M)} • ${$(L.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${O?"🎒 Đã về!":`${U}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${V}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${O?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(a.length===0)k=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const x=(a.find(M=>M.building.uid===e.selectedSuitcaseHabitatUid)??a[0]).building,A=ns(x.creatureBondLevel??1)*Ge[x.creatureMorph??"normal"].incomeMult;k=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${a.map(({building:M,item:O})=>{const U=M.creatureNickname||O.creatureName||O.name,I=Ge[M.creatureMorph??"normal"].shortLabel;return`<option value="${$(M.uid)}" ${M.uid===x.uid?"selected":""}>${$(U)} (💝Lv.${M.creatureBondLevel??1} • ${I})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${fn.map(M=>{const O=!n.sandboxMode&&n.level<M.minParkLevel,U=Math.round(M.baseGold*A),I=Math.round(M.baseXp*A),V=(x.creatureBondLevel??1)>=5?1:0,j=M.guaranteedIngredients.map(ne=>`+${ne.qty+V} ${At[ne.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${M.emoji} ${$(M.name)} <span style="font-size:11.5px;color:#78350f;">(${M.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${U}🪙 • +${I}⭐ • ${j}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${M.id}"
                    class="brass-btn ${O?"":"gold-cta"}"
                    ${O?"disabled":""}
                  >
                    ${O?`🔒 Lv.${M.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const S=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${s}/${l})</span>
            <span style="color:#15803d;">+${d}%</span>
          </div>
          <progress max="${l}" value="${s}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${bn.map(L=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${L.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${L.emoji} ${$(L.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(x=>{const A=r.has(`${L.habitatItemId}:${x}`);return`<span class="morph-pill ${A?x==="radiant"?"radiant":x==="mystic"?"mystic":"":"locked"}">${A?Ge[x].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;m=`${k}${S}`}t.innerHTML=`${g}${m}`,t.querySelectorAll("[data-sc-tab]").forEach(v=>{v.addEventListener("click",()=>{e.activeSuitcaseTab=v.dataset.scTab,ke(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(v=>{v.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=v.dataset.selectPet??null,ke(e)})});const T=t.querySelector("#formSuitcaseRename"),h=t.querySelector("#inpSuitcasePetName");if(h&&h.addEventListener("keydown",v=>{v.isComposing||v.stopPropagation()}),T&&h&&e.selectedSuitcaseHabitatUid){const v=e.selectedSuitcaseHabitatUid;T.addEventListener("submit",k=>{k.preventDefault();const S=e.sim.renameCreature(v,h.value);e.showToast(S.msg,"🏷️"),ke(e)})}if(e.selectedSuitcaseHabitatUid){const v=e.selectedSuitcaseHabitatUid,k=()=>{const S=e.sim.groomCreature(v);e.showToast(S.msg,S.ok?"🪮":"⏳"),ke(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",k),t.querySelector("#btnScGroom")?.addEventListener("click",k),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(v),ke(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const S=e.sim.trainCreatureTrick(v);e.showToast(S.msg,S.ok?"🎾":"🪙"),ke(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const S=n.buildings.find(L=>L.uid===v);S&&(e.root.querySelector("#suitcaseDialog").close(),fe(e.cam,S.gx+1,S.gy+1),e.inspectSelection={kind:"building",uid:S.uid},e.renderInspector())})}const y=t.querySelector("#chkScStarlight");y&&y.addEventListener("change",()=>{e.useStarlightForIncubation=y.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(v=>{v.addEventListener("click",()=>{const k=v.dataset.incubateUid,S=e.useStarlightForIncubation&&(n.sandboxMode||(n.supply.ingredients.starlight_dust??0)>=1),L=e.sim.startMorphIncubation(k,S);e.showToast(L.msg,L.ok?"🥚":"⚠️"),ke(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const v=e.sim.speedUpIncubationWithSand();e.showToast(v.msg,v.ok?"⏳":"⚠️"),ke(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),ke(e)});const C=t.querySelector("#selScExpPet");C&&C.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=C.value,ke(e)}),t.querySelectorAll("[data-start-exp]").forEach(v=>{v.addEventListener("click",()=>{const k=v.dataset.startExp,S=e.selectedSuitcaseHabitatUid??a[0]?.building.uid;if(!S)return;const L=e.sim.startSuitcaseExpedition(S,k);e.showToast(L.msg,L.ok?"🧭":"⚠️"),ke(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const v=e.sim.speedUpExpeditionWithSand();e.showToast(v.msg,v.ok?"⏳":"⚠️"),ke(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),ke(e)})}const ho="hpvn-burrow-garden",bo=new Set(["auto","dawn","day","dusk","night"]),fo=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),$s=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function Ht(e,t){const n=typeof e=="string"?e.trim():"";if(!n||n==="null")return!1;if(typeof window<"u"&&window.location?.origin&&n===window.location.origin)return!0;const o=t&&t.length>0?[...$s,...t]:$s;for(const i of o)if(typeof i=="string"){if(i===n)return!0}else if(i.test(n))return!0;return!1}function vo(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const n=new URL(document.referrer).origin;if(Ht(n,t))return n}catch{}return null}function Cs(e){const t=String(e||"day").toLowerCase();return bo.has(t)?t:"day"}function ks(e){const t=String(e||"clear").toLowerCase();return fo.has(t)?t:"clear"}function ii(e={}){const t=e.parkName||"Trang Trại Hang Sóc",n=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",o=Math.max(1,Math.floor(Number(e.level)||1)),i=Math.max(0,Math.floor(Number(e.magicStars)||0)),a=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",s=e.keeperTitle?` · [${e.keeperTitle}]`:"",d={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},c=e.weatherMode&&d[e.weatherMode]?` (${d[e.weatherMode]})`:"";return`🏰 [${t}${n} · Cấp ${o}${l}${s}]${c} — ${a}/10 vùng mở khóa, ${r} công trình & ${i} 🌟 Sao Phép Thuật!`}function yo(e={}){const t=[],n=e.win??(typeof window<"u"?window:void 0),o=e.nav??(typeof navigator<"u"?navigator:void 0);let i=vo(e.targetOrigin,e.allowedOrigins);function a(s,d={}){const c={source:ho,version:"25.1",type:s,payload:d,sentAt:Date.now()};t.push(c),t.length>24&&t.shift();try{const u=n?.parent;if(u&&u!==n&&typeof u.postMessage=="function"){const p=e.targetOrigin||i||"*";u.postMessage(c,p)}}catch{}return c}function r(s){const d=s;if(d.source!=null&&n?.parent!=null&&d.source!==n.parent)return;if(!e.allowAnyOrigin&&typeof d.origin=="string"&&d.origin.length>0){if(!Ht(d.origin,e.allowedOrigins))return;i=d.origin}const c=d?.data;if(!c||typeof c!="object")return;const u=c.payload&&typeof c.payload=="object"?c.payload:{};if(c.type==="hpvn:burrow:set-atmosphere"||c.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(Cs(u.mode??c.mode));else if(c.type==="hpvn:burrow:set-weather"||c.type==="hpvn:host:set-weather")e.onWeatherChange?.(ks(u.mode??c.mode));else if(c.type==="hpvn:burrow:set-event"||c.type==="hpvn:host:set-event")e.onEventChange?.(String(u.mode??c.mode??"auto"));else if(c.type==="hpvn:burrow:tour-garden"||c.type==="hpvn:host:tour-garden"){const p=u.tourId??c.tourId??null;p?e.onStartTour?.(String(p)):e.onStopTour?.()}else if(c.type==="hpvn:burrow:mute"||c.type==="hpvn:host:mute")e.onMuteChange?.(!!(u.muted??c.muted));else if(c.type==="hpvn:burrow:request-snapshot"||c.type==="hpvn:host:request-snapshot"){const p=e.getSnapshot?e.getSnapshot():{};a("hpvn:burrow:snapshot",p)}}n&&typeof n.addEventListener=="function"&&n.addEventListener("message",r);async function l(s={}){const d=ii(s),c=a("hpvn:burrow:share-floo",{text:d,level:s.level??1,parkName:s.parkName??"Trang Trại Hang Sóc",...s.playerName?{playerName:s.playerName}:{},...s.tourId?{tourId:s.tourId}:{},...s.image?{image:s.image}:{},atmosphereMode:Cs(s.atmosphereMode),weatherMode:ks(s.weatherMode),eventMode:s.eventMode??"auto"});if(typeof s.sendToFloo=="function"&&await s.sendToFloo(d,s)===!0)return e.notify?.(s.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:d,copied:!1,floo:!0,envelope:c};let u=!1;try{o?.clipboard?.writeText&&(await o.clipboard.writeText(d),u=!0)}catch{u=!1}return e.notify?.(u?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${d}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${d}"`),{ok:!0,text:d,copied:u,envelope:c}}return{notifyReady:(s={})=>a("hpvn:burrow:ready",s),syncState:(s={})=>a("hpvn:burrow:state",s),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{n&&typeof n.removeEventListener=="function"&&n.removeEventListener("message",r)}}}function In(e,t={},n){const a=n??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});a.width=640,a.height=380;const r=a.getContext("2d");if(!r)return a;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),s=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),d=Math.max(1,Math.floor(Number(t.level)||1)),c=t.house||"Gryffindor",u=Math.max(0,Math.floor(Number(t.magicStars)||0)),p=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),g=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const T={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(T,614,31),r.textAlign="left";const h=18,y=50,C=604,v=248;r.save(),r.beginPath(),r.rect(h,y,C,v),r.clip();let k=!1;if(e&&e.width>0&&e.height>0)try{const se=e.width/e.height,de=C/v;let te=0,N=0,P=e.width,D=e.height;se>de?(P=Math.round(e.height*de),te=Math.round((e.width-P)/2)):(D=Math.round(e.width/de),N=Math.round((e.height-D)/2)),r.drawImage(e,te,N,P,D,h,y,C,v),k=!0}catch{k=!1}if(!k){const se=r.createLinearGradient(h,y,h,y+v);se.addColorStop(0,"#365843"),se.addColorStop(.55,"#598249"),se.addColorStop(1,"#334d2c"),r.fillStyle=se,r.fillRect(h,y,C,v)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(h,y,C,v);const S=18,L=304,x=604,A=58;r.fillStyle="#f6ebd2",r.fillRect(S,L,x,A),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(S,L,x,A);const O={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[c]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${O} ${l} · Cấp ${d}`,S+14,L+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const U=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${s} · Nhà ${c}${U} · ${g}/10 vùng · ${p} công trình · ${u} 🌟`,S+14,L+42);const I=142,V=34,j=S+x-I-12,ne=L+12;return r.fillStyle="#1d5c4b",r.fillRect(j,ne,I,V),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(j,ne,I,V),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",j+I/2,ne+V/2+1),r.textAlign="left",a}function ai(e,t=.55){try{const n=e.toDataURL("image/webp",t);if(typeof n=="string"&&n.startsWith("data:image/webp"))return n;const o=e.toDataURL("image/png");return typeof o=="string"?o:""}catch{return""}}const So={};function ze(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),n=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^n&15>>t/4).toString(16)})}function oi(e,t){const n=Math.max(1,Math.floor(Number(t)||1)),o=e.effectivePrice??e.price,i=e.dailyRemaining??e.dailyLimit;let a=0;for(let r=0;r<n;r++)r<i?a+=o:e.overflowMultiplier&&e.overflowMultiplier>1?a+=Math.ceil(o*e.overflowMultiplier):a+=o;return a}const wo=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function an(e,t={}){const n=e&&typeof e=="object"?e:{},o=n.details&&typeof n.details=="object"?n.details:{},i=String(n.reason||o.reason||"unknown-error"),a={...wo,...t.labels||{}};switch(i){case"missing-crops":{const r=Array.isArray(o.missing)?o.missing:[];if(r.length>0){const l=r.map(s=>{const d=String(s.resource||"");return`${Math.max(1,Number(s.required||0)-Number(s.have||0))} ${a[d]||d}`});return{reason:i,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:i,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof o.shortBy=="number"?o.shortBy:typeof o.required=="number"&&typeof o.spendable=="number"?Math.max(1,o.required-o.spendable):null;return{reason:i,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(o.required||0),l=Number(o.have||0),s=Math.max(1,r-l);return{reason:i,icon:"🌟",text:`Thiếu ${s} Sao Phép Thuật`}}case"missing-supply":{const r=String(o.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:i,icon:"🌱",item:l,text:`Thiếu hạt ${a[l]||l}`}}return{reason:i,icon:"💧",item:r,text:`Thiếu ${a[r]||"vật tư"}`}}case"wallet-frozen":return{reason:i,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:i,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:i,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:i,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:i,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:i,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:i,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:i,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:i,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:i,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:i,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:i,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:i,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:i,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:i,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(i==="model-rejected"&&typeof o.modelCode=="string"&&t.modelText){const r=t.modelText(o.modelCode);if(r)return{reason:i,icon:"🪄",text:r}}return{reason:i,icon:"🪄",text:n.message||"Máy chủ từ chối thao tác"}}}}function Bt(e){let t=null,n=null,o=Promise.resolve();const i=s=>{const d=o.then(s,s);return o=d.catch(()=>{}),d};async function a(s,d){const c=t?.catalogHash,u=c?{...d,catalogHash:c}:d,p=await e(s,u);if(!p||typeof p!="object"||!("garden"in p))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const g=p;return g.catalog===void 0&&c&&g.catalogHash===c&&(g.catalog=t?.catalog),t?.saleAdmin&&g.saleAdmin===void 0&&(g.saleAdmin=!0),t=g,t}async function r(s,d){const c=JSON.stringify({name:s,payload:d});if(n&&n.signature!==c)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");n||(n={signature:c,data:{...d,requestId:ze()}});try{const u=await a(s,n.data);return n=null,u}catch(u){throw u?.definitive===!0&&(n=null),u}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return n!==null},read:()=>i(()=>a("getBurrowGarden",{})),act:s=>i(()=>r("performBurrowAction",{...s,expectedRevision:l()})),free:(s,d={})=>i(()=>a("performBurrowAction",{...d,action:"freeAction",kind:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),guide:s=>i(()=>a("performBurrowAction",{action:"guideDone",lessonId:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),scene:s=>i(()=>a("performBurrowAction",{action:"setScene",scene:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),syncProfile:s=>i(()=>a("performBurrowAction",{...s,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),submitLeaderboard:s=>i(()=>a("performBurrowAction",{...s,action:"submitLeaderboard",expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),getLeaderboard:(s="match3")=>i(()=>a("performBurrowAction",{action:"getLeaderboard",gameId:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),visit:(s={})=>i(()=>e("visitBurrowGarden",s)),frame:s=>i(async()=>{const d=await e("setBurrowFlooFrame",{frameKey:s});return t&&Array.isArray(d.frames)&&typeof d.worn=="string"&&(t={...t,flooFrames:{frames:d.frames,worn:d.worn}}),d}),sales:(s={mode:"get"})=>i(()=>e("manageBurrowSales",s)),fireOut:s=>i(()=>e("extinguishBurrowGarden",{...s,requestId:ze()})),sell:(s,d)=>i(()=>r("sellBurrowGoods",s?{items:s,expectedTotal:d}:{clearance:!0,expectedTotal:d})),buy:(s,d=1)=>i(()=>{const c=t?.catalog?.find(u=>u.id===s);if(!c)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:s,quantity:d,catalogVersion:t?.catalogVersion,expectedTotal:oi(c,d)})}),settleWallet:s=>i(()=>a("settleBurrowWallet",{direction:s.direction,amount:Math.max(1,Math.floor(s.amount)),...s.reasonCode?{reasonCode:s.reasonCode}:{},...s.sourceType?{sourceType:s.sourceType}:{},...typeof s.clientLevel=="number"?{clientLevel:Math.floor(s.clientLevel)}:{},requestId:typeof s.requestId=="string"&&s.requestId?s.requestId:ze()})),houseCup:()=>i(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(s,d)=>i(()=>e("contributeBurrowHouseCup",{points:s,...d?{house:d}:{}})),postCoop:s=>i(()=>e("postBurrowCoopRequest",{...s,requestId:typeof s.requestId=="string"?s.requestId:ze()})),fulfillCoop:s=>i(()=>e("fulfillBurrowCoopRequest",s)),listCoop:s=>i(()=>e("getBurrowCoopRequests",s?{hostUid:s}:{}))}}const We="hpvn-burrow-game";function cn(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const n=new URLSearchParams(t);return n.get("burrow-ticket")??n.get("hpvn-ticket")}function ri(e,t=window,n={}){let o=0;const i=new Map;let a=n.targetOrigin&&n.targetOrigin!=="*"?n.targetOrigin:null;if(!a&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;Ht(l,n.allowedOrigins)&&(a=l)}catch{}t.addEventListener("message",l=>{if(!n.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!Ht(l.origin,n.allowedOrigins))return;a=l.origin}const s=l.data;if(l.source!==t.parent||!s||s.channel!==We||s.nonce!==e||typeof s.id!="string"||!i.has(s.id))return;const d=i.get(s.id);i.delete(s.id),d(s)});const r=Bt((l,s)=>new Promise((d,c)=>{const u=`burrow-${++o}`,p=setTimeout(()=>{i.delete(u),c(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);i.set(u,g=>{if(clearTimeout(p),"result"in g&&g.result&&typeof g.result=="object"){d(g.result);return}const m=new Error(typeof g.error=="string"?g.error:"Máy chủ từ chối thao tác.");m.definitive=g.definitive===!0,m.reason=typeof g.reason=="string"?g.reason:void 0,m.details=g.details&&typeof g.details=="object"?g.details:{},c(m)}),t.parent.postMessage({channel:We,nonce:e,id:u,action:"burrow",name:l,data:s},n.targetOrigin||a||"*")}));return r.host=(l,s={})=>new Promise(d=>{const c=`host-${++o}`,u=setTimeout(()=>{i.delete(c),d(null)},5e3);i.set(c,p=>{clearTimeout(u),d(p.result??null)}),t.parent.postMessage({...s,channel:We,nonce:e,id:c,action:l},n.targetOrigin||a||"*")}),r}function li(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),n=e.sessionEndpoint??"/api/auth/session",o=e.fetchImpl??globalThis.fetch.bind(globalThis),i=e.getUid??mt,a=e.timeoutMs??18e3;let r=null,l=0;async function s(d){if(r&&Date.now()+3e4<l)return r;try{const c=typeof window<"u"?window:void 0,u=c?.__HPVN_CONFIG__?.getIdToken??c?.__HPVN_GET_ID_TOKEN__,p=u?await u().catch(()=>null):null,g=typeof window<"u"?cn(window.location):null,m=await o(n,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":d,...p?{Authorization:`Bearer ${p}`}:{}},body:JSON.stringify({uid:d,...p?{idToken:p}:{},...g?{ticket:g}:{}})});if(!m.ok)return null;const T=await m.json();if(typeof T.uid=="string"&&T.uid&&!e.getUid&&Vn(T.uid),typeof T.token=="string"&&T.token)return r=T.token,l=Number(T.expiresAt||Date.now()+36e5),r}catch{}return null}return Bt(async(d,c)=>{const u=i(),p=await s(u),g=new AbortController,m=setTimeout(()=>g.abort(),a);let T;try{const y={"Content-Type":"application/json","X-User-Id":u};p&&(y.Authorization=`Bearer ${p}`),T=await o(`${t}${d}`,{method:"POST",headers:y,body:JSON.stringify({data:c}),signal:g.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(m)}const h=await T.json();if(h.error||!T.ok){const y=new Error(h.error?.message||`Máy chủ từ chối thao tác (${T.status}).`);throw y.definitive=T.status<500,y.reason=typeof h.error?.details?.reason=="string"?h.error.details.reason:void 0,y.details=h.error?.details??{},y}return h.result??{}})}const ci="asia-southeast1",Xn="demo-hpvnn-burrow",xo="hpvnn-archive";function on(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function Ms(e){const t=new TextEncoder().encode(e);let n="";for(let o=0;o<t.length;o++)n+=String.fromCharCode(t[o]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function di(e,t=Xn,n=globalThis.location,o=Date.now()){const i=n?.hostname??"127.0.0.1";if(!on(i))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const a=Math.floor(o/1e3),r=Ms(JSON.stringify({alg:"none",typ:"JWT"})),l=Ms(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:a,user_id:e,sub:e,iat:a,exp:a+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${l}.`}function To(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!on(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const n=e.host??(t?.hostname||"127.0.0.1");if(!on(n))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const o=e.projectId||Xn,i=e.region||ci,a=e.port||5001,l=`${e.useSameOriginRewrite?"":`http://${n}:${a}`}/${o}/${i}/`,s=e.fetchImpl??globalThis.fetch.bind(globalThis),d=e.getUid??(()=>e.uid||mt()),c=e.now??(()=>Date.now()),u=e.timeoutMs??18e3;return Bt(async(p,g)=>{const m=d(),T=di(m,o,{hostname:n},c()),h=new AbortController,y=setTimeout(()=>h.abort(),u);let C;try{C=await s(`${l}${p}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${T}`},body:JSON.stringify({data:g}),signal:h.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout(y)}const v=await C.json();if(v.error||!C.ok){const k=new Error(v.error?.message||`Emulator từ chối thao tác (${C.status}).`);throw k.definitive=C.status<500,k.reason=typeof v.error?.details?.reason=="string"?v.error.details.reason:void 0,k.details=v.error?.details??{},k}return v.result??{}})}function pi(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),n=e.fetchImpl??globalThis.fetch.bind(globalThis),o=e.timeoutMs??2e4;return Bt(async(i,a)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,s=new AbortController,d=setTimeout(()=>s.abort(),o);let c;try{const p={"Content-Type":"application/json"};l?p.Authorization=`Bearer ${l}`:p["X-User-Id"]=mt(),c=await n(`${t}${i}`,{method:"POST",headers:p,body:JSON.stringify({data:a}),signal:s.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(d)}const u=await c.json();if(u.error||!c.ok){const p=new Error(u.error?.message||`Cloud Functions từ chối thao tác (${c.status}).`);throw p.definitive=c.status<500,p.reason=typeof u.error?.details?.reason=="string"?u.error.details.reason:void 0,p.details=u.error?.details??{},p}return u.result??{}})}function $o(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const n=async o=>{const i=o;if(!e.allowAnyOrigin&&typeof i.origin=="string"&&i.origin.length>0&&!Ht(i.origin,e.allowedOrigins))return;const a=i.data;if(!a||a.channel!==We||a.nonce!==e.nonce||typeof a.id!="string"||e.expectedSource&&i.source!==e.expectedSource)return;const r=i.source;if(!r||typeof r.postMessage!="function")return;const l=typeof i.origin=="string"&&i.origin.length>0&&i.origin!=="null"?i.origin:"*",s=a.id,d=String(a.action||"");if(d==="burrow"||d==="garden"){const c=String(a.name||""),u=a.data&&typeof a.data=="object"?a.data:{};try{const p=await e.transport(c,u);r.postMessage({channel:We,nonce:e.nonce,id:s,result:p},l)}catch(p){const g=p;r.postMessage({channel:We,nonce:e.nonce,id:s,error:g?.message||"Máy chủ từ chối thao tác.",definitive:g?.definitive===!0,reason:g?.reason,details:g?.details??{}},l)}return}try{const c=e.onHostAction?await e.onHostAction(d,a):{ok:!0};r.postMessage({channel:We,nonce:e.nonce,id:s,result:c},l)}catch(c){r.postMessage({channel:We,nonce:e.nonce,id:s,error:c instanceof Error?c.message:"Lỗi xử lý lệnh host.",definitive:!0},l)}};return t.addEventListener("message",n),()=>{t.removeEventListener("message",n)}}function ht(){if(typeof window<"u"){const e=cn(window.location);if(e)return ri(e,window);const t=new URLSearchParams(window.location.search);t.get("emulator"),t.get("functionsPort");const n=window.__HPVN_CONFIG__,o=So?.VITE_HPVN_FUNCTIONS_URL,i=n?.functionsBaseUrl||o;if(i)return pi({functionsBaseUrl:i,getIdToken:n?.getIdToken})}return li()}let Ls=Promise.resolve();async function Co(e,t){const n=typeof navigator<"u"?navigator:void 0,o=n&&"locks"in n?n.locks:void 0;if(o&&typeof o.request=="function")return o.request(e,async()=>t());const i=Ls.then(t,t);return Ls=i.catch(()=>{}),i}function ko(e){const t=`${e.scope}-save-envelope`,n=e.persistent!==!1,o=e.storage??globalThis.localStorage,i=e.legacyKeys??[];let a={},r=null;function l(){if(r)return r;if(!n||!o)return a;const d=o.getItem(t);if(d!==null){const u=JSON.parse(d);if(!u||typeof u!="object"||Array.isArray(u))throw new Error("Bản lưu thung lũng không hợp lệ.");return u}const c={};for(const u of i){const p=o.getItem(u);p!==null&&(c[u]=p)}return c}function s(d){n&&o?o.setItem(t,JSON.stringify(d)):a=d}return{storageKey:t,getItem(d){return l()[d]??null},setItem(d,c){r?r[d]=String(c):s({...l(),[d]:String(c)})},transaction(d){if(r)return d();r={...l()};try{const c=d();return s(r),c}finally{r=null}}}}async function Mo(e=ht()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const n=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(n.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(n.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(n.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(n.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function Lo(e,t,n=ht()){const o=await n.contributeHouseCup(e,t);if(!o||typeof o!="object")return null;const i=o.totals&&typeof o.totals=="object"?o.totals:{};return{weekKey:String(o.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(i.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(i.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(i.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(i.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(o.playerContribution)||0)),updatedAt:Number(o.updatedAt)||Date.now()}}async function Ao(e,t=ht()){return t.postCoop(e)}async function Po(e,t=ht()){return t.fulfillCoop(e)}const Eo=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:We,HPVN_DEFAULT_EMULATOR_PROJECT:Xn,HPVN_FIREBASE_REGION:ci,HPVN_PROD_FIREBASE_PROJECT:xo,attachHpvnParentShellResponder:$o,computeClientPackTotal:oi,contributeWeeklyHouseCupOnline:Lo,createAtomicGardenStorage:ko,createAutoAuthoritativeClient:ht,createBurrowGardenClient:Bt,createEmulatorFixtureToken:di,createFirebaseEmulatorClient:To,createFirebaseFunctionsClient:pi,createHpvnEmbedClient:ri,createHttpAuthoritativeClient:li,fetchWeeklyHouseCupStandingsOnline:Mo,formatServerRefusalVi:an,fulfillCoopAssistanceOnline:Po,generateRequestId:ze,getHpvnTicketFromLocation:cn,isLocalDevelopmentHost:on,postCoopAssistanceOnline:Ao,runWithStorageLock:Co},Symbol.toStringTag,{value:"Module"})),qo="/api/track",Ho=25,Io=3e4;class Bo{constructor(t={}){w(this,"endpoint");w(this,"batchSize");w(this,"batchIntervalMs");w(this,"queue",[]);w(this,"timer",null);w(this,"lastLevel",null);w(this,"isFlushing",!1);w(this,"isInitialized",!1);this.endpoint=t.endpoint||qo,this.batchSize=t.batchSize||Ho,this.batchIntervalMs=t.batchIntervalMs||Io}track(t,n){const o={id:this.generateEventId(),name:t,props:n?{...n}:void 0,timestamp:Date.now()};this.queue.push(o),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const n=this.queue.splice(0,this.queue.length);if(n.length===0)return;const o={events:n,sentAt:Date.now()},i=JSON.stringify(o);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const a=new Blob([i],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,a))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",n=>{this.handleGameTick(n)}),window.addEventListener("gamesave:uploaded",n=>{const o=n;this.track("save_uploaded",o.detail||{})});else if(t){const n=t.onUploadSuccess;t.onUploadSuccess=o=>{if(n)try{n(o)}catch{}this.track("save_uploaded",o)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",n="unknown",o="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,n=navigator.language||"vi",o=navigator.userAgent||""),this.track("session_start",{screen:t,language:n,userAgent:o,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const o=t.detail;o&&(this.track("game:tick",{level:o.level,galleons:o.galleons}),typeof o.level=="number"&&(this.lastLevel!==null&&o.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:o.level}),this.lastLevel=o.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class Do{constructor(t,n={}){w(this,"analytics");w(this,"maxErrorsPerSession");w(this,"isListening",!1);w(this,"seenSignatures",new Set);w(this,"errorCountThisSession",0);w(this,"handleError",t=>{const n=t.message||(t.error?String(t.error):"Uncaught runtime error"),o=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",i=t.filename||(typeof window<"u"?window.location.href:""),a={msg:n,stack:o,url:i,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(a),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});w(this,"handleUnhandledRejection",t=>{const n=t.reason,o=n instanceof Error,i=o?n.message:n?String(n):"Unhandled promise rejection",a=o&&n.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:i,stack:a,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",n)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,n.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const n=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(n)){this.seenSignatures.add(n),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class No{constructor(){w(this,"buttonEl",null);w(this,"dialogEl",null);w(this,"activeTab","privacy");w(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const n=this.dialogEl.querySelector(".legal-confirm-btn");n&&n.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",i=>{i.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{i.addEventListener("click",()=>{const a=i.getAttribute("data-tab");a&&this.switchTab(a)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{const a=i.getAttribute("data-tab")===t;i.setAttribute("aria-selected",a?"true":"false"),i.setAttribute("data-active",a?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(i=>{const a=i.getAttribute("data-panel")===t;i.setAttribute("data-active",a?"true":"false"),i.style.display=a?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}function Oo(e){ca({fetchLeaderboards:async t=>{const n=await e.getLeaderboard(t);return nn(n.leaderboards),n.leaderboards??null},submitLeaderboard:async t=>{const n=await e.submitLeaderboard(t);return nn(n.leaderboards),n.leaderboards??null}})}class Ro{constructor(){w(this,"cloudSave");w(this,"analytics");w(this,"errorMonitor");w(this,"legalModal");w(this,"authoritativeClient");w(this,"hpvnBridge");w(this,"isInitialized",!1);w(this,"lastAuthoritativeWalletBalance",null);w(this,"walletSyncTimer",null);w(this,"isApplyingServerWallet",!1);w(this,"boundSim",null);this.cloudSave=new ra,this.analytics=new Bo,this.errorMonitor=new Do(this.analytics),this.legalModal=new No,this.authoritativeClient=ht(),this.hpvnBridge=yo({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(Gs):null;if(!t)return{};const n=JSON.parse(t),o=n.match3&&typeof n.match3=="object"?n.match3:null,i=n.settings&&typeof n.settings=="object"?n.settings:null;return{version:Number(n.version||3),parkName:String(n.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(n.level)||1)),xp:Math.max(0,Math.floor(Number(n.xp)||0)),magicStars:Math.max(0,Math.floor(Number(o?.stars??n.magicStars)||0)),unlockedZonesCount:Array.isArray(n.unlockedZones)?n.unlockedZones.length:1,buildingsCount:Array.isArray(n.buildings)?n.buildings.length:0,weatherMode:String(i?.weatherOverride||n.weatherMode||"auto"),atmosphereMode:String(i?.timeOverride||n.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount();const t=!!(typeof window<"u"&&cn(window.location));t||this.cloudSave.init(),Oo(this.authoritativeClient),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",n=>{const o=n.detail;o&&typeof o=="object"&&this.hpvnBridge.syncState(o)}),window.addEventListener("hpvn:share-floo",n=>{const o=n.detail??{};this.hpvnBridge.shareToFloo({...o,sendToFloo:o.sendToFloo??(async(i,a)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const r=await this.authoritativeClient.host("floo-share",{text:i,...a.image?{image:a.image}:{},...a.tourId?{tourId:a.tourId}:{}});return!!(r&&typeof r=="object"&&r.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",n=>{const o=n.detail;o?.hostUid&&this.authoritativeClient.visit({hostUid:o.hostUid,help:!0,buildingUid:o.buildingUid,kind:o.kind||"water_crop",noteText:o.noteText,helperName:o.helperName,helperEmoji:o.helperEmoji}).catch(()=>{})})),typeof navigator>"u"||navigator.onLine?this.authoritativeClient.read().then(n=>{if(nn(n.leaderboards),n.wallet&&typeof n.wallet.spendable=="number"&&this.syncWalletBaseline(n.wallet.spendable),typeof n.uid=="string"&&n.uid){const o=this.cloudSave.getUserId(),i=Vn(n.uid);t?this.cloudSave.init():i!==o&&la(i).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}else t&&this.cloudSave.init();typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:n}))}).catch(()=>{t&&this.cloudSave.init()}):t&&this.cloudSave.init(),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,n={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const o=t.saveToStorage.bind(t),i=Math.max(0,n.debounceMs??180),a=s=>{const d=Math.max(0,Math.floor(s));this.syncWalletBaseline(d),this.isApplyingServerWallet=!0;try{const c=t.homeStateWhileVisiting??t.state;!c.sandboxMode&&!c.sandboxTainted&&(c.galleons=d,t.homeStateWhileVisiting&&(t.state.galleons=d),o(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;if(s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview)return;const d=Math.max(0,Math.floor(Number(s.galleons)||0)),c=d-this.lastAuthoritativeWalletBalance;if(c===0)return;const u=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=d;const p=c<0?"debit":"credit";let g=Math.abs(c);const m=p==="credit"?1e3:5e4;try{let T=null;for(;g>0;){const h=Math.min(g,m);g-=h,T=await this.authoritativeClient.settleWallet({direction:p,amount:h,reasonCode:p==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:p==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(s.level)||1))})}T?.wallet&&typeof T.wallet.spendable=="number"&&(a(T.wallet.spendable),n.onSnapshot?.(T))}catch(T){const h=T;if(h?.definitive===!0){const y=an(h);n.onToast?.(`🏦 Gringotts HPVN: ${y.text}`,y.icon);const C=h.details?.spendable;typeof C=="number"&&Number.isFinite(C)?a(C):await this.authoritativeClient.read().then(v=>{v.wallet&&typeof v.wallet.spendable=="number"&&a(v.wallet.spendable)}).catch(()=>{a(u)})}else this.lastAuthoritativeWalletBalance=u}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(s.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),i===0?r():this.walletSyncTimer=setTimeout(()=>{r()},i))};return t.saveToStorage=()=>{o(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=o,this.boundSim===t&&(this.boundSim=null)}}}const Be=new Ro;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{Be.init()},{once:!0}):Be.init());const Zt={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},Bn={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Kn(e){return e.sim.getPlayerHouse()}function dt(e,t,n=""){const o=va(e),i=(t||"🧙").trim().slice(0,2);return o?`<span class="floo-avatar-shell ${n}"><img src="${$(o)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${$(i)}</span></span>`:`<span class="floo-avatar-shell ${n}"><span class="floo-avatar-fallback">${$(i)}</span></span>`}function ui(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Jt(e){const t=e.sim.ensureNeighborSocial(),n=Kn(e),o=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:o,level:e.sim.state.level,house:n,keeperTitle:Hs(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function Yn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}const As=new Set;function gi(e,t){if(!t||typeof t!="object")return;const n=t,o=e.sim.ensureNeighborSocial(),i=e.sim.homeStateWhileVisiting??e.sim.state;let a=!1;typeof n.uid=="string"&&n.uid.trim()&&Vn(n.uid),nn(n.leaderboards)&&(a=!0);const r=typeof n.garden?.progression?.friendCode=="string"&&n.garden.progression.friendCode.trim()||(n.profile&&typeof n.profile=="object"&&typeof n.profile.friendCode=="string"?String(n.profile.friendCode).trim():"");if(r&&o.playerFriendCode!==r&&(o.playerFriendCode=r,a=!0),n.wallet&&typeof n.wallet.spendable=="number"&&Number.isFinite(n.wallet.spendable)){const u=Math.max(0,Math.floor(n.wallet.spendable));if(Be.syncWalletBaseline(u),!i.sandboxMode&&!i.sandboxTainted&&!e.sim.isHeadmasterPreview){const p=!!n.receipt,g=pa(i);(p||g||u>=i.galleons)&&i.galleons!==u&&(i.galleons=u,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=u),a=!0)}}const l=n.profile&&typeof n.profile=="object"?n.profile:null,s=ua(l?.house??n.garden?.progression?.house),d=String(l?.houseSource??n.garden?.progression?.houseSource??"");if(s){const u=d==="hpvn",p=i.minigameLeaderboard;(u||!p?.playerHouseExplicit)&&(p?.playerHouse!==s||!!p?.playerHouseLockedByServer!==u)&&(gs(i,s,{lockedByServer:u}),e.sim.homeStateWhileVisiting&&gs(e.sim.state,s,{lockedByServer:u}),a=!0)}if(l){const u=typeof l.username=="string"?l.username.trim():"";u&&u!=="Phù Thủy Hang Sóc"&&u!=="Trang Trại Hang Sóc"&&!o.playerDisplayName&&(o.playerDisplayName=u,a=!0);const p=typeof l.avatarUrl=="string"?l.avatarUrl.trim():"";p&&o.playerAvatarUrl!==p&&(o.playerAvatarUrl=p,a=!0)}if(typeof n.uid=="string"&&n.uid.trim()&&!As.has(n.uid)&&!i.sandboxMode&&!i.sandboxTainted&&!e.sim.isHeadmasterPreview){As.add(n.uid);const u=Math.max(0,i.match3?.maxClearedLevel??Math.max(0,(i.match3?.currentLevel??1)-1)),p=Math.max(0,i.puzzleArcade?.sudokuCleared??0),g=Math.max(0,i.puzzleArcade?.blockCleared??0),m=Math.max(0,i.puzzleArcade?.jigsawCleared??0);(u>0||p>0||g>0||m>0)&&Rs(i).catch(()=>{})}const c=n.daily&&typeof n.daily=="object"?n.daily:null;if(c&&typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(De,Math.floor(c.helpsLeft)));const u=Math.max(0,De-e.flooHelpsLeft);u>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=u,a=!0)}if(Array.isArray(n.helpers)&&n.helpers.length>0){e.flooHelpersToday=n.helpers.map(p=>({uid:String(p.uid||""),name:String(p.name||"Bạn HPVN"),avatarEmoji:p.avatarEmoji,avatarUrl:p.avatarUrl,at:Number(p.at||0)}));const u=ga(e.flooHelpersToday,o.lastSeenHelperAt??0);u&&u.textVi&&u.seenAt>(o.lastSeenHelperAt??0)&&(o.lastSeenHelperAt=u.seenAt,a=!0,e.showToast(u.textVi,"🤝"))}if(n.houseCup&&typeof n.houseCup=="object"){const u=n.houseCup,p=u.houses&&typeof u.houses=="object"?u.houses:null;p&&typeof u.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:u.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(p.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(p.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(p.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(p.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(u.memberTodayPoints)||0)),updatedAt:Date.now()},a=!0)}a&&(e.sim.saveToStorage(),e.refreshAll())}async function It(e,t=!1){if(e.flooLoading)return;const n=Date.now();if(!t&&e.flooLastLoadedAt>0&&n-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const o=e.sim.ensureNeighborSocial(),i=Kn(e),a=o.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;if(r||da(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r){const c=e.sim.state.minigameLeaderboard,u=!!c?.playerHouseExplicit&&!c?.playerHouseLockedByServer;await Be.authoritativeClient.syncProfile({playerName:a,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:o.playerAvatarUrl||"",avatarEmoji:Bn[i],...u?{house:i,houseExplicit:!0}:{},level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(p=>gi(e,p)).catch(()=>{})}const l=await Be.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(De,Math.floor(l.helpsLeft)));const c=Math.max(0,De-e.flooHelpsLeft);c>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=c)}const s=Array.isArray(l.visits)?l.visits:[],d=Xt(s,Date.now());e.flooDirectoryRows=d,e.flooQueueRows.length===0&&(e.flooQueueRows=d),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(d,mt())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&Me(e),e.renderVisitorDockBar()}}function Dn(e){const t=Jt(e),n=In(e.gameCanvas,t),o=ai(n,.55),i=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:mt(),image:o||void 0}})),i.rewarded&&e.showToast(i.msg,"🔥"),e.refreshAll()}function mi(e,t,n){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),n&&(e.focusedNeighborId=n),(e.sim.state.level>=st||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&It(e),Me(e);const i=e.root.querySelector("#neighborDialog");i&&!i.open&&i.showModal(),n&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${n}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function hi(e,t){e.closeHudPopovers();const n=e.root.querySelector("#neighborDialog");n?.open&&n.close(),t.kind==="match3"?e.getMatch3Modal().then(o=>o.openRescue(t)):e.getPuzzleArcadeModal().then(o=>o.openRescue(t))}function dn(e,t){Yn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterHonorGardenTour(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function at(e,t,n){const o=String(t||"").trim();if(!o)return;if(o.startsWith("tour_")){dn(e,o);return}n&&n.length>0?e.flooQueueRows=[...n]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),Yn(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const a=o.startsWith("player_")?o:`player_${o}`,r=o.startsWith("player_")?o.slice(7):o;(async()=>{try{const s=await Be.authoritativeClient.visit({hostUid:r});typeof s.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(De,Math.floor(s.helpsLeft))));const d=s.visit&&typeof s.visit=="object"?s.visit:null;if(d){const c=d.progression&&typeof d.progression=="object"?d.progression:void 0,u=Date.now(),p=Array.isArray(c?.timers)?c.timers.filter(y=>Number(y.readyAt||0)>u).length:0,g=d.decorations&&typeof d.decorations=="object"?d.decorations:void 0,m={uid:String(d.uid||r),friendCode:typeof d.friendCode=="string"?d.friendCode:void 0,username:String(d.username||"Thành Viên HPVN"),parkName:String(d.parkName||"Thung Lũng Phép Thuật"),house:d.house||"Gryffindor",avatarEmoji:typeof d.avatarEmoji=="string"?d.avatarEmoji:void 0,avatarUrl:typeof d.avatarUrl=="string"?d.avatarUrl:void 0,level:Math.max(1,Number(d.level||1)),growing:p,helped:!!d.helped,hostHelpsLeft:typeof d.hostHelpsLeft=="number"?d.hostHelpsLeft:10,fire:d.fire&&typeof d.fire=="object"?d.fire:null,scene:g?.scene},T=e.sim.syncFlooDirectoryMembers([m],mt()),h=d.rawClientSave&&typeof d.rawClientSave=="object"?d.rawClientSave:null;if(T[0]&&h){if(Array.isArray(h.buildings)&&h.buildings.length>0){const y=h.buildings.filter(C=>C&&typeof C.itemId=="string"&&!!le(C.itemId));y.length>0&&(T[0].valleyBuildings=y)}h.tileOverrides&&typeof h.tileOverrides=="object"&&(T[0].valleyTileOverrides=h.tileOverrides),Array.isArray(h.unlockedZones)&&h.unlockedZones.length>0&&(T[0].valleyUnlockedZones=h.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(a);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function bi(e,t){if(t.startsWith("tour_")){dn(e,t);return}Yn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterNeighborVisit(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function rn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const n=new URLSearchParams(window.location.search);if(n.has("visit")||n.has("tour")){n.delete("visit"),n.delete("tour");const o=n.toString();window.history.replaceState(null,"",`${window.location.pathname}${o?`?${o}`:""}${window.location.hash}`)}}e.refreshAll()}function zo(e){const t=e.sim.ensureNeighborSocial(),n=t.playerOwlHelpRequests.filter(d=>!!d.fulfilledAt).length,o=t.playerMinigameSos?.rescuedAt??0,i=!!t.playerMinigameSos?.claimed,a=`${t.lastSocialResetKey}|${t.friendshipTokens}|${n}|${o}|${i}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(a===e.lastSocialLiveSig)return;e.lastSocialLiveSig=a,fi(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),s=document.activeElement?.id??"";l?.open&&s!=="inpFlooDisplayName"&&Me(e)}function fi(e){const t=e.sim.ensureNeighborSocial(),n=Math.floor(t.friendshipTokens/it),o=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,i=t.homeLanternMarks.length,a=n+o+i,l=Math.max(0,$t-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(u=>u.minigameSos&&!u.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(u.id)).length:0,s=e.sim.state.level>=st&&(t.dailyGardenHelpsCount??0)<De?e.flooDirectoryRows.filter(u=>Pt(u)).length:0,d=e.root.querySelector("#badgeNeighborCount");if(d){const u=a>0?a:l>0?l:s;u>0?(d.textContent=String(u),d.classList.toggle("is-ready-green",a>0),d.classList.remove("hidden")):d.classList.add("hidden")}const c=e.root.querySelector("#badgeManageNeighborCount");c&&(a>0?(c.textContent=String(a),c.classList.remove("hidden")):c.classList.add("hidden"))}function Fo(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.getActiveHonorGardenTour();if(n){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${$(n.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${$(n.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${n.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${$(n.ownerName)} · ${$(Zt[n.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const S=e.sim.cycleHonorGardenTour(-1);S.ok&&typeof S.focusGx=="number"&&typeof S.focusGy=="number"&&(e.onCameraJump?.(),fe(e.cam,S.focusGx,S.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const S=e.sim.cycleHonorGardenTour(1);S.ok&&typeof S.focusGx=="number"&&typeof S.focusGy=="number"&&(e.onCameraJump?.(),fe(e.cam,S.focusGx,S.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{Dn(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{rn(e)});return}const o=e.sim.getActiveVisitingNeighbor();if(!o){t.classList.add("hidden"),t.innerHTML="";return}const i=e.sim.ensureNeighborSocial(),a=Date.now(),r=Math.min(De,Math.max(i.dailyGardenHelpsCount??0,o.helpedViaFlooToday?1:o.helpedMarksToday.length)),l=Math.max(0,De-r),s=!!(o.helpedViaFlooToday||o.helpedMarksToday.length>0),d=(o.hostHelpsLeft??10)<=0,c=!!(o.fireUntilMs&&o.fireUntilMs>a),u=!s&&l>0&&!d,p=i.dailyLikedNeighborIds.includes(o.id),g=i.dailyMysteryClaimedIds.includes(o.id),m=o.owlHelpCrates.filter(S=>!S.fulfilledByPlayerToday).length,T=e.sim.canRescueNeighborMinigame(o.id).ok,h=m+(T?1:0),y=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,C=o.remoteUserId||o.id.replace(/^player_/,""),v=y.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${y.slice(0,12).map(S=>{const L=S.uid===C,x=Pt(S,a),A=!!(S.fire&&S.fire.until>a);return`
                <button
                  type="button"
                  class="floo-strip-dot ${L?"is-current":""} ${x?"is-helpable":""} ${A?"is-fire":""}"
                  data-floo-jump="${$(S.uid)}"
                  title="${$(S.username)} (Lv.${S.level})"
                >
                  ${dt(S.avatarUrl,S.avatarEmoji||S.username,"floo-strip-avatar")}
                  ${A?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",k=s?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":d?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${v}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${dt(o.avatarUrl,o.avatarEmoji||o.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${$(o.name)}</strong>
            <span class="visitor-lv-tag">Lv.${o.level}</span>
            ${c?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${De}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${i.friendshipTokens}/${it}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${y.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${u?"gold-cta":""}" ${u?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${k}
        </button>
        ${c?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${p?"disabled":""} title="Thả tim khen vườn">
          ${p?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${g?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${g?"✓ Quà":"🎁 Quà"}
        </button>
        ${h>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${h})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,ui(t),t.querySelectorAll("[data-floo-jump]").forEach(S=>{S.addEventListener("click",()=>{const L=S.dataset.flooJump;L&&L!==C&&at(e,L,y)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const S=t.querySelector("#btnVisitorFlooHelp");S&&(S.disabled=!0);let L;if(o.remoteUserId)try{const M=ma(i.selectedPresetNoteId),O=await Be.authoritativeClient.visit({hostUid:o.remoteUserId,help:!0,kind:"water_crop",noteText:M.textVi});typeof O.helpsLeft=="number"&&(L=O.helpsLeft,e.flooHelpsLeft=O.helpsLeft)}catch(M){const O=an(M);if(O.reason==="already-helped"||O.reason==="daily-help-cap"||O.reason==="host-help-cap"){e.showToast(`${O.icon} ${O.text}`,O.icon),It(e,!0),e.refreshAll();return}}const x=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:L});if(!x.ok){e.showToast(x.msg,"🤝"),e.refreshAll();return}const A=M=>M.map(O=>O.uid===C?{...O,helped:!0}:O);if(e.flooDirectoryRows=A(e.flooDirectoryRows),e.flooQueueRows=A(e.flooQueueRows),e.refreshAll(),x.helpsLeft>0&&e.flooQueueRows.length>1){const M=yn(e.flooQueueRows,C,1);M&&M.uid!==C&&Pt(M)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===o.id&&at(e,M.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const S=t.querySelector("#btnVisitorExtinguish");S&&(S.disabled=!0);try{let L=0;if(o.remoteUserId){const A=await Be.authoritativeClient.fireOut({hostUid:o.remoteUserId});L=Math.max(0,Math.floor(Number(A?.price||0)))}if(L>0){const A=e.sim.homeStateWhileVisiting??e.sim.state;A.galleons=Math.max(0,A.galleons-L),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=A.galleons)}o.fireUntilMs=0;const x=A=>A.map(M=>M.uid===C?{...M,fire:null}:M);e.flooDirectoryRows=x(e.flooDirectoryRows),e.flooQueueRows=x(e.flooQueueRows),e.showToast(L>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name} (-${L} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(L){const x=an(L);e.showToast(`${x.icon} ${x.text}`,x.icon),S&&(S.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const S=e.sim.likeVisitedNeighborFarm();S.ok||e.showToast(S.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{g||(e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,o.mysteryGiftGx+.5,o.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{mi(e,"friends",o.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const S=yn(y,C,-1);S&&S.uid!==C&&at(e,S.uid,y)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(y.length>1){const L=yn(y,C,1);if(L&&L.uid!==C){at(e,L.uid,y);return}}const S=e.sim.cycleNextNeighborVisit();S.ok&&typeof S.focusGx=="number"&&typeof S.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,S.focusGx,S.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{rn(e)})}function Me(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const n=e.sim.ensureNeighborSocial(),o=e.sim.getActiveVisitingNeighbor(),i=e.sim.getActiveHonorGardenTour(),a=Date.now(),r=Kn(e),l=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",s=Math.min(De,Math.max(0,n.dailyGardenHelpsCount??0)),d=Math.max(0,De-s),c=Math.max(0,$t-n.dailyRescuesGivenIds.length),u=Math.max(0,$t-n.dailyRescuesReceivedCount),p=Math.max(0,Qt-n.dailyOwlHelpRequestedCount),g=n.friendshipTokens>=it,m=Math.min(100,Math.round(n.friendshipTokens/it*100)),T=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,h=e.sim.state.level>=st||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,y=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${n.friendshipTokens}/${it}</strong>
        ${g?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${d}/${De}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${c}/${$t}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${p}/${Qt}</strong></span>
      </div>
    </div>
  `,C=`
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        🖼️ Bưu Thiếp ${n.dailyFlooShareClaimed?"":"(!)"}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        🎁 Rương &amp; SOS ${g||T?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${n.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let v="";if(e.activeNeighborTab==="friends"){const x=[];if(T?.rescuedAt){const U=Sn(T.kind);x.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${$(T.rescuerEmoji??"🦉")} ${$(T.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${U.icon} Màn ${T.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(T){const U=Sn(T.kind);x.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${U.icon} Màn ${T.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}n.homeLanternMarks.length>0&&x.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${n.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${n.homeLanternMarks.length}🍀)</button>
        </div>
      `);const A=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${dt(n.playerAvatarUrl,Bn[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${Zt[r]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${$(l)}"
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
    `;let M="";if(h){const U=Xt(e.flooDirectoryRows,a),I=U.filter(N=>Pt(N,a)).length,V=[...e.flooHelpersToday,...n.homeLanternMarks.map(N=>({uid:N.helperId,name:N.helperName,avatarEmoji:N.helperEmoji,avatarUrl:N.helperAvatarUrl,at:N.createdAt}))],j=Array.from(new Map(V.map(N=>[N.uid||N.name,N])).values()),ne=j.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${j.slice(0,6).map(N=>dt(N.avatarUrl,N.avatarEmoji||N.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${$(ha(j))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${j.length*15} phút</strong>!
              </div>
            </div>
          `:"",se=U.length>0?`
            <div class="floo-portal-grid" role="list">
              ${U.map(N=>{const P=!!(N.fire&&N.fire.until>a),D=Pt(N,a),q=o?.remoteUserId===N.uid||o?.id===`player_${N.uid}`,_=P?"🔥 Đang cháy · cần dập!":N.helped?"✓ Đã chăm giúp":N.growing>0?`🌱 ${N.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${P?"is-fire":""} ${D?"is-helpable":""} ${N.helped?"is-helped":""} ${q?"is-visiting":""}"
                      data-floo-portal="${$(N.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${dt(N.avatarUrl,N.avatarEmoji||N.username,"floo-portal-avatar")}
                        ${P?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${N.level}</span>
                      </div>
                      <strong class="floo-portal-name">${$(N.username)}</strong>
                      <span class="floo-portal-park">${$((N.house?Bn[N.house]:"")||"🪄")} ${$(N.parkName||"")}</span>
                      <span class="floo-portal-status">${_}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,de=n.neighbors.filter(N=>N.owlHelpCrates.some(P=>!P.fulfilledByPlayerToday)||!!(N.minigameSos&&!N.minigameSos.rescuedToday)),te=de.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${de.slice(0,6).map(N=>{const P=e.sim.canRescueNeighborMinigame(N.id),D=N.minigameSos,q=D?Sn(D.kind):null,_=!!(D&&(D.rescuedToday||n.dailyRescuesGivenIds.includes(N.id))),Q=N.owlHelpCrates.filter(X=>!X.fulfilledByPlayerToday).map(X=>{const pe=_e(X.itemId),me=e.sim.getFarmItemCount(X.itemId),ue=e.sim.state.sandboxMode||me>=X.qty;return`
                          <div class="nb-crate-item">
                            <img src="${pe.iconSrc}" alt="${$(pe.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${X.qty} ${$(pe.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":me}/${X.qty})</span></div>
                              <div class="nb-crate-rew">+${X.rewardTokens}🍀 • +${X.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${ue?"gold-cta":""} nb-mini-cta" data-nb-crate="${$(N.id)}|${$(X.id)}" ${ue?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),re=D&&q&&!_?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${q.icon} ${$(q.nameVi)} • <strong>Màn ${D.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${$(N.id)}" ${P.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===N.id?"focused":""}" data-neighbor-card="${$(N.id)}">
                        <div class="nb-card-head">
                          ${dt(N.avatarUrl,N.avatarEmoji||N.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${$(N.name)}</strong>
                              <span class="nb-badge-pill">Lv.${N.level}</span>
                              <span class="nb-badge-pill house">${Zt[N.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${$(N.id)}">🔥 Bay tới</button>
                        </div>
                        ${Q?`<div class="nb-coop-section"><div class="nb-crate-list">${Q}</div></div>`:""}
                        ${re}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";M=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN</div>
              <div class="floo-hearth-sub">
                Còn <strong>${d}/${De} lượt chăm giúp</strong> hôm nay · <strong>${I}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"⏳…":"🔄"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${U.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${ne}
        </section>
        ${se}
        ${te}
      `}else{const U=Math.min(100,Math.round(e.sim.state.level/st*100));M=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${st}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${st}</strong> · Khi đạt Cấp ${st}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${U}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const O=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${ba.map(U=>{const I=i?.id===U.id;return`
              <article class="honor-garden-card ${I?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${$(U.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${$(U.titleVi)}</strong>
                    <span class="honor-garden-owner">${$(U.ownerName)} · Lv.${U.level} · ${Zt[U.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${$(U.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${$(U.weather)} · ${$(U.atmosphere)}</span>
                  ${I?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${$(U.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;v=`
      ${x.join("")}
      ${A}
      ${h?`${M}${O}`:`${O}${M}`}
    `}else if(e.activeNeighborTab==="postcard"){const x=Jt(e),A=ii(x);v=`
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
        <div class="floo-postcard-caption">${$(A)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const x=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(A=>{const M=_e(A.itemId);return`
                <div class="nb-crate-item ${A.fulfilledAt?"done":""}">
                  <img src="${M.iconSrc}" alt="${$(M.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${A.qty} ${$(M.name)}</div>
                    <div class="nb-crate-rew">${A.fulfilledAt?`✓ ${$(A.helperEmoji??"🦉")} ${$(A.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';v=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${n.friendshipTokens}/${it} 🍀)</div>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${m}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug">🔥 +1</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150G</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${n.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${g?"":"disabled"}>
              🎁 Mở Rương (${it} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${T?`
                  <div class="nb-alert-banner ${T.rescuedAt?"ready":""}">
                    <span>${T.rescuedAt?`🎉 <strong>${$(T.rescuerEmoji??"🦉")} ${$(T.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${T.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${T.stage}</strong>…`}</span>
                    ${T.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${u}/${$t}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${p}/${Qt}):</div>
            <div class="nb-crate-list">${x}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${fa.map(A=>{const M=A.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${A.id}" data-active="${M}" aria-pressed="${M}" class="brass-btn nb-note-btn">
                  ${A.emoji} ${$(A.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else v=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(A=>{const M=new Date(A.timestamp),O=String(M.getHours()).padStart(2,"0"),U=String(M.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${$(A.icon)}</span>
                  <span class="nb-log-msg">${$(A.textVi)}</span>
                  <span class="nb-log-time">${O}:${U}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${y}
    ${C}
    ${v}
  `,ui(t);const k=t.querySelector("#flooPostcardCanvas");k&&In(e.gameCanvas,Jt(e),k),t.querySelectorAll("[data-nbtab]").forEach(x=>{x.addEventListener("click",()=>{e.activeNeighborTab=x.dataset.nbtab,Me(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",Me(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{Dn(e),Me(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{Dn(e),Me(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const x=t.querySelector("#flooPostcardCanvas")??In(e.gameCanvas,Jt(e)),A=ai(x,.72);if(A){const O=document.createElement("a");O.href=A,O.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${A.startsWith("data:image/webp")?"webp":"png"}`,O.click()}const M=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(M.msg,"🖼️"),Me(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",x=>{x.preventDefault();const M=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);M&&(n.playerDisplayName=M,e.sim.saveToStorage(),It(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${M}"!`,"🔥"),Me(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{It(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const x=Xt(e.flooDirectoryRows,Date.now());x.length>0&&at(e,x[0].uid,x)}),t.querySelectorAll("[data-floo-portal]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.flooPortal;if(!A)return;const M=Xt(e.flooDirectoryRows,Date.now());at(e,A,M)})}),t.querySelectorAll("[data-honor-tour]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.honorTour;A&&dn(e,A)})});const L=()=>{const x=e.sim.openFriendshipChest();x.ok||e.showToast(x.msg,"🍀"),e.refreshAll(),Me(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",L),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",L),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(x=>{x.addEventListener("click",()=>{const A=e.sim.claimPlayerMinigameSosRescue();A.ok||e.showToast(A.msg,"⚠️"),e.refreshAll(),Me(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const x=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const A of x)e.sim.claimHomeLanternMark(A.id);e.refreshAll(),Me(e)}),t.querySelectorAll("[data-nb-visit]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.nbVisit;A&&bi(e,A)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),rn(e)}),t.querySelectorAll("[data-nb-crate]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.nbCrate??"",[M,O]=A.split("|");if(!M||!O)return;const U=e.sim.fulfillNeighborOwlCrate(M,O);U.ok||e.showToast(U.msg,"🧺"),e.refreshAll(),Me(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.nbRescue;if(!A)return;const M=e.sim.canRescueNeighborMinigame(A);if(!M.ok||!M.neighbor||!M.sos){e.showToast(M.reason??"Không thể giải cứu màn này lúc này!","🦉");return}hi(e,{neighborId:M.neighbor.id,neighborName:M.neighbor.name,neighborEmoji:M.neighbor.avatarEmoji,kind:M.sos.kind,stage:M.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(x=>{x.addEventListener("click",()=>{const A=x.dataset.nbNote;A&&(e.sim.setNeighborPresetNote(A),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),Me(e))})})}function en(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;fe(e.cam,t.gx+t.bw*.5+o,t.gy+t.bh*.5+o),e.onCameraJump?.()}function vi(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const n=Date.now();return e.sim.state.buildings.some(i=>le(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const n=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(n)return{el:n,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function Nn(e){const t=e.root.querySelector("#tutorialHudSpotlight"),n=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(d=>d.removeAttribute("data-tutorial-anchor")),!t)return;const o=!!document.querySelector("dialog[open]");if(e.photoModeActive||o||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:i,label:a}=vi(e);if(!i||i.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=i.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!i.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||i.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const s=6;t.style.setProperty("--spot-left",`${Math.round(r.left-s)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-s)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+s*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+s*2)}px`),t.classList.toggle("pill-below",r.top<110),n&&(n.textContent=a||"👇 Bấm"),t.classList.remove("hidden")}function yi(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function Si(e,t){if(yi())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function wi(e,t){if(yi())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function On(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const n=!!document.querySelector("dialog[open]"),o=e.manageMenuOpen||e.weatherPopoverOpen,i=e.sim.getCurrentTutorialStep();if(e.photoModeActive||n||o||!i){Si(e,t),Nn(e);return}const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),l=`${i.index}:${i.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${r}`;if(e.lastRenderedTutorialSig!==l){e.lastRenderedTutorialSig=l;const d=ss.map(c=>`<span class="tutorial-step-dot ${c.index<i.index?"done":c.index===i.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${$(i.title)}</h2>
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
        `;else{const c=i.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>':i.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${r>0?"🔨 Xây":"🦉 Đơn Cú"}</button>`:"",u=i.id==="build_and_owl_order"?r>0?"🦉 Giao Đơn!":"🔨 Xây Dựng":i.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${ss.length}"
              aria-valuenow="${i.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${d}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${$(i.speakerName)}
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${$(i.title)}</h2>
            <div class="tutorial-hint-strip">${$(i.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${$(i.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${c}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${$(u)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),On(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),On(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{xi(e,i.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{i.id==="earn_magic_star"?e.openPuzzleArcadeDialog():i.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}wi(e,t);const s=`${i.index}:${i.id}`;e.lastFocusedTutorialStepKey!==s&&(e.lastFocusedTutorialStepKey=s,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),Nn(e)}function xi(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())en(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const o=le("farmland_plot");o&&(e.selectedCatalogItem=o,e.refreshAll())}return}if(t==="sow_and_merge_plot"){en(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){en(e);const n=Date.now();e.sim.state.buildings.some(i=>le(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Go{constructor(t,n,o,i,a){w(this,"sim");w(this,"cam");w(this,"gameCanvas");w(this,"activeCategory",null);w(this,"selectedCatalogItem",null);w(this,"rotation",0);w(this,"bulldozerActive",!1);w(this,"moveModeActive",!1);w(this,"movingBuildingUid",null);w(this,"pincerActive",!1);w(this,"pincerPicked",null);w(this,"seedTrayOpen",!1);w(this,"seedFilterMode","all");w(this,"activeSeedCropId",null);w(this,"pendingSowPlotUid",null);w(this,"pastureTrayOpen",!1);w(this,"activePastureAnimalId",null);w(this,"pendingStockPastureUid",null);w(this,"rideCamUid",null);w(this,"rideCamSpeedText","");w(this,"pendingTouchTile",null);w(this,"onTouchConfirmPlace",null);w(this,"onTouchCancelPlace",null);w(this,"onSelectCatalogItem",null);w(this,"onAutoPlaceSelected",null);w(this,"onCameraJump",null);w(this,"photoModeActive",!1);w(this,"inspectSelection",null);w(this,"minimapCanvas");w(this,"questCollapsed",!1);w(this,"minimapCollapsed",!1);w(this,"manageMenuOpen",!1);w(this,"weatherPopoverOpen",!1);w(this,"mapToolsExpanded",!1);w(this,"buildSheetOpen",!1);w(this,"minimapHudVisible",!1);w(this,"hudRolledUp",!1);w(this,"inspectorCollapsed",!1);w(this,"lastInspectedKey","");w(this,"displayedGalleons",-1);w(this,"galleonRollRaf",0);w(this,"activeWorkshopTab","barn");w(this,"activeQuestTab","orders");w(this,"activeAlbumTab","cup");w(this,"selectedOwlOrderId",null);w(this,"lastWsBrewId",null);w(this,"activeSuitcaseTab","care");w(this,"selectedSuitcaseHabitatUid",null);w(this,"useStarlightForIncubation",!0);w(this,"lastSuitcaseIncReady",!1);w(this,"lastSuitcaseExpReady",!1);w(this,"activeNeighborTab","friends");w(this,"focusedNeighborId",null);w(this,"flooDirectoryRows",[]);w(this,"flooQueueRows",[]);w(this,"flooHelpsLeft",null);w(this,"flooLoading",!1);w(this,"flooLastLoadedAt",0);w(this,"flooAutoAdvanceTimer",0);w(this,"flooHelpersToday",[]);w(this,"lastSocialLiveSig","");w(this,"tutorialMinimized",!1);w(this,"lastRenderedTutorialSig","");w(this,"lastFocusedTutorialStepKey","");w(this,"ribbonBannerTimer",0);w(this,"pendingBulldozeWarning",null);w(this,"drawerEdgeObserver",null);w(this,"dialogOpenObserver",null);w(this,"match3Modal",null);w(this,"puzzleArcadeModal",null);w(this,"match3ModalPromise",null);w(this,"puzzleArcadeModalPromise",null);w(this,"seedQuizModal");w(this,"leaderboardModal");w(this,"root");w(this,"sprites");this.root=t,this.sim=n,this.cam=o,this.gameCanvas=i,this.sprites=a,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||kt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new Va(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{this.activeSeedCropId=r;const s=Te[r];if(l){const d=this.sim.state.buildings.find(c=>c.uid===l);if(d&&le(d.itemId)?.isFarmlandPlot&&!d.cropId){const c=this.sim.plantCropOnPlot(d.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(c.msg,c.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${s.emoji} ${s.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,s.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new Ha(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),s=this.root.querySelector("#puzzleArcadeDialog"),d=this.root.querySelector("#seedQuizDialog");r==="match3"?(s?.close(),d?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),s?.close(),this.openSeedQuizDialog()):(l?.close(),d?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const s=this.sim.state.buildings.find(u=>this.inspectSelection?.kind==="building"&&u.uid===this.inspectSelection.uid),d=s?le(s.itemId):void 0,c=Date.now();s&&(c<s.constructEndsAt||s.workshopQueue&&s.workshopQueue.length>0||s.cropId&&s.cropReadyAt&&c<s.cropReadyAt+1200||s.pastureAnimalId&&s.pastureReadyAt&&c<s.pastureReadyAt+1200||d&&d.cycleSec>0&&d.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return _a(this)}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const n=t.returnValue;t.returnValue="";const o=this.pendingBulldozeWarning;this.pendingBulldozeWarning=null,n==="confirm"&&o&&(this.sim.removeAtTile(o.gx,o.gy,!0),this.refreshAll())}),this.sim.onRequestBulldozeConfirm=n=>{this.openBulldozeConfirmDialog(n)})}openBulldozeConfirmDialog(t){const n=this.root.querySelector("#bulldozeConfirmDialog"),o=this.root.querySelector("#bulldozeConfirmBody");if(!n||!o){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,o.innerHTML=`
      <div class="quest-card-mini bulldoze-confirm-card">
        <div class="bulldoze-confirm-lead">
          <strong>${$(t.buildingName)}</strong> hiện có:
        </div>
        <div class="bulldoze-confirm-hazard">
          🌾 ${$(t.hazardSummaryVi)}
        </div>
        <div class="bulldoze-confirm-note">
          Nếu phá dỡ ngay bây giờ, phần vụ mùa / sản vật / mẻ đang chạy trên ô này sẽ bị mất vĩnh viễn.
        </div>
        <div class="bulldoze-confirm-refund">
          💰 Khi xóa: <strong>${$(t.refundSummaryVi)}</strong>
        </div>
      </div>
    `,n.returnValue="",n.open||n.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),n=this.root.querySelector("#floatingBannerGrip");if(!t||!n)return;n.classList.remove("hidden");const o=(s,d)=>{t.classList.add("is-floating-dragged");const c=Math.max(0,window.innerWidth-t.offsetWidth),u=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(s,c))}px`,t.style.top=`${Math.max(0,Math.min(d,u))}px`};let i=0,a=0,r=0,l=0;n.addEventListener("pointerdown",s=>{if(s.button!==0)return;const d=t.getBoundingClientRect();i=s.clientX-d.left,a=s.clientY-d.top,r=s.clientX,l=s.clientY,n.setPointerCapture(s.pointerId)}),n.addEventListener("pointermove",s=>{n.hasPointerCapture(s.pointerId)&&(Math.hypot(s.clientX-r,s.clientY-l)>=4&&n.classList.add("dragging"),o(s.clientX-i,s.clientY-a))}),n.addEventListener("lostpointercapture",()=>{n.classList.remove("dragging")}),n.addEventListener("keydown",s=>{let c=0,u=0;if(s.key==="ArrowLeft")c=-15;else if(s.key==="ArrowRight")c=15;else if(s.key==="ArrowUp")u=-15;else if(s.key==="ArrowDown")u=15;else return;s.preventDefault();const p=t.getBoundingClientRect();o(p.left+c,p.top+u)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const s=t.getBoundingClientRect();o(s.left,s.top)}})}installDialogLightDismissFallback(){const t=()=>{const n=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(n)};for(const n of Array.from(this.root.querySelectorAll("dialog")))n.addEventListener("close",()=>{n.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",n=>{const o=n.target;if(o&&typeof o.matches=="function"&&o.matches(".aaa-codex-scroll")){const i=!!n.skipped;o.dataset.cvSkipped=i?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const n=new IntersectionObserver(o=>{for(const i of o)i.target.dataset.cvSkipped=i.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const o of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))n.observe(o)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const n=(o,i)=>{const a=i.getBoundingClientRect();return o.clientX<a.left||o.clientX>a.right||o.clientY<a.top||o.clientY>a.bottom};for(const o of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let i=!1;o.addEventListener("pointerdown",a=>{i=n(a,o)}),o.addEventListener("pointerup",a=>{i&&n(a,o)&&o.close()})}}}wireRangeProgressFallback(t){const n=()=>{const o=Number(t.min||0),i=Number(t.max||100),a=Number(t.value||0),r=Math.round((a-o)/Math.max(1,i-o)*100);t.style.setProperty("--progress",`${r}%`)};n(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",n)}togglePhotoMode(t){return ja(this,t)}openNeighborDialog(t,n){return mi(this,t,n)}openHarvestFeastDialog(){return ro(this)}refreshHarvestFeastBadges(){return lo(this)}showRibbonUnveilBanner(t){return co(this,t)}renderHarvestFeastDialog(){return ni(this)}openMinigameRescue(t){return hi(this,t)}enterVisitFromHud(t){return bi(this,t)}enterHonorTourFromHud(t){return dn(this,t)}enterFlooMemberVisitFromHud(t,n){return at(this,t,n)}refreshFlooDirectoryFromHud(t){return It(this,t)}applyAuthoritativeSnapshot(t){gi(this,t)}exitVisitFromHud(){return rn(this)}isBuildingFocusMode(){return js(this)}toggleHudRollup(t){return Wa(this,t)}syncHudFocusVisibility(){return ln(this)}openWorkshopDialog(t){return Qn(this,t)}openSuitcaseDialog(t,n){return uo(this,t,n)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=kt(async()=>{const{Match3ModalController:t}=await import("./match3Modal-cb1LGc61.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2,3])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=n=>this.openPuzzleArcadeDialog(n),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=kt(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-DzK4OX6v.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([4,1,2,3])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=n=>this.openLeaderboardDialog(n),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,n){this.closeHudPopovers();const o=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(o,n)}openMatch3Dialog(t,n=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(o=>{o.open(t,n),Yt(this)})}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(n=>{n.open(t),Yt(this)})}openSeedQuizDialog(t,n,o,i,a,r){this.closeHudPopovers(),n||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,n,o,i,a,r),Yt(this)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return gt(this)}collapseBuildDock(){return tt(this)}hasOpenFloatingTray(){return Qa(this)}hideOpenFloatingTrays(){return Xa(this)}positionFloatingPopover(t,n){return _n(this,t,n)}toggleManagePopover(t){return Ka(this,t)}toggleWeatherPopover(t){return Ya(this,t)}renderWeatherPopover(){return Un(this)}animateGalleonsTo(t){return Ws(this,t)}spawnFlyReward(t,n,o,i){return Za(this,t,n,o,i)}bindEvents(){return Ua(this)}showToast(t,n="🦉"){return Ve(this,t,n)}showOfflineModal(t){return eo(this,t)}refreshFloatingBanner(){return jn(this)}openSeedTray(t,n){return Js(this,t,n)}closeSeedTray(){return pt(this)}toggleSeedTray(){return so(this)}openPastureTray(t,n){return ei(this,t,n)}closePastureTray(){return qt(this)}togglePastureTray(){return io(this)}renderSeedTray(){return ti(this)}renderPastureTray(){return ao(this)}refreshTouchConfirmBar(){return Wn(this)}refreshAll(){return Et(this)}refreshHeaderClock(){return Hn(this)}refreshHeader(){return Qs(this)}syncProgressiveHudVisibility(){return Xs(this)}refreshQuestTracker(){return Ks(this)}refreshDock(){return Ys(this)}renderStaffDrawer(t){return Zs(this,t)}syncContextualMapToolsBar(){return no(this)}renderInspector(){return he(this)}renderFinanceDialog(){return po(this)}renderAlbumDialog(){return nt(this)}renderQuestDialog(){return je(this)}renderRoadmapDialog(){return si(this)}updateWorkshopLiveTimers(){return oo(this)}renderWorkshopDialog(){return qe(this)}renderSettingsDialog(){return Re(this)}refreshSuitcaseBadge(){return go(this)}updateSuitcaseLiveTimers(){return mo(this)}renderSuitcaseDialog(){return ke(this)}syncLiveNeighborSocialUI(){return zo(this)}refreshNeighborBadges(){return fi(this)}renderVisitorDockBar(){return Fo(this)}renderNeighborDialog(){return Me(this)}panCameraToTutorialTarget(){return en(this)}resolveTutorialHudTarget(){return vi(this)}updateTutorialHudSpotlight(){return Nn(this)}hideTutorialPopover(t){return Si(this,t)}showTutorialPopover(t){return wi(this,t)}renderTutorialCoach(){return On(this)}handleTutorialPrimaryAction(t){return xi(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??_t.colorblindMode,fontScale:t?.fontScale??_t.fontScale,highContrast:t?.highContrast??_t.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{..._t.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();Ca(t),this.sim.audio?.ceiling&&ka(t,this.sim.audio)}playStoryCutscene(t){const n=zs.find(i=>i.id===t);if(!n)return;if(this.sim.state.level<n.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${n.unlockLevel} để mở khoá ${n.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${n.titleVi}`,"🎬");let o=120;n.keyframes.forEach((i,a)=>{window.setTimeout(()=>{fe(this.cam,i.cameraFocusGx,i.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${i.captionVi}`,a===n.keyframes.length-1?"✨":"🕯️"),n.chapterNumber===3&&a===n.keyframes.length-1&&this.sim.launchFireworksShow(10)},o),o+=i.durationMs})}}let et=null,ut=null,Ps=!1;function Es(){return typeof navigator<"u"&&typeof navigator.install=="function"}function Rn(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,n=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||n}function zn(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function Ti(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const o=navigator,i=typeof o.install=="function";if(!i&&!et){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(i&&o.install)await o.install(),t.classList.add("hidden");else if(et){const a=et;et=null,await a.prompt(),((await a.userChoice).outcome==="accepted"||!et)&&t.classList.add("hidden")}}catch(a){!(a instanceof DOMException&&a.name==="AbortError")&&!et&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function Fn(){!Rn()||zn()||(ut||(ut=Ti()),ut.classList.remove("hidden"))}function $i(){ut&&ut.classList.add("hidden")}function Vo(){Ps||typeof window>"u"||(Ps=!0,!zn()&&(ut=Ti(),Es()&&Rn()&&Fn(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),et=e,!Es()&&Rn()&&!zn()&&Fn()}),window.addEventListener("appinstalled",()=>{$i(),et=null})))}const _o={init:Vo,show:Fn,hide:$i},Uo="burrow_rollback_backup_v12";function qs(e,t){const n=JSON.stringify({backedUpAt:Date.now(),state:e}),o=typeof localStorage<"u"?localStorage:void 0;try{o?.setItem(Uo,n)}catch{}return n}class jo{constructor(){w(this,"unhandledErrors",0);w(this,"fpsSamples",[]);w(this,"assetLoadLatencyMs",0);w(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const n=Math.max(1,Math.min(240,t));this.fpsSamples.push(n),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,n={},o=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:n,queuedAt:o})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const n=[...this.offlineQueue];return t(n)?(this.offlineQueue=[],n.length):0}getHealthReport(){const t=this.fpsSamples.length;let n=60,o=60;if(t>0){const i=this.fpsSamples.reduce((l,s)=>l+s,0);n=Number((i/t).toFixed(1));const a=[...this.fpsSamples].sort((l,s)=>l-s),r=Math.max(0,Math.floor((t-1)*.05));o=Number(a[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:n,p5LowFps:o,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function Je(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function Pn(e){return Je(e)||e.category==="decor"}async function Wo(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const n=document.createElement("canvas");n.id="gameCanvas",n.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(n);const o=new ya,i=new Ta;await i.loadAll();const a=new Sa(o),r={x:0,y:0,zoom:.82,viewRot:0};fe(r,18,24.5);const l=new $a(n,i),s=new Go(e,a,r,n,i);_o.init(),Cn.init(a);const d=new URLSearchParams(window.location.search),c=wa,u=!!(d.get("visit")||d.get("tour")||c||d.get("ridecam")==="1");let p=null;if(s.onCameraJump=()=>{p=null},!u&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const b=r.x,f=r.y,E=r.zoom;fe(r,17.5,24),r.zoom=.76,p={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:b,toY:f,toZoom:E}}if(d.get("ridecam")==="1"){const b=a.state.buildings.find(f=>le(f.itemId)?.isCustomCoasterStation);b&&(s.rideCamUid=b.uid)}const g=d.get("dialog");if(g==="album")document.getElementById("btnOpenAlbum")?.click();else if(g==="finance")document.getElementById("btnOpenFinance")?.click();else if(g==="orders"||g==="quests")document.getElementById("btnOpenQuests")?.click();else if(g==="barn")s.openWorkshopDialog("barn");else if(g==="seeds"){const b=d.get("sfilter");(b==="flowers"||b==="crops"||b==="all")&&(s.seedFilterMode=b),s.openSeedTray()}else if(g==="pasture")s.openPastureTray();else if(g==="seedquiz"){const b=d.get("crop")??void 0,f=d.get("lang")??void 0,E=d.get("tier")??void 0,z=d.get("qformat")??void 0,G=d.get("sqtab"),oe=G==="codex"||G==="practice"?G:void 0;s.openSeedQuizDialog(b,null,f,E,z,oe)}else if(g==="bakery"){const b=a.state.buildings.find(f=>f.itemId==="molly_apple_bakery");b&&(s.inspectSelection={kind:"building",uid:b.uid}),s.openWorkshopDialog("brew")}else if(g==="workshop"){const b=d.get("tab")??"barn";s.openWorkshopDialog(b)}else if(g==="suitcase"){const b=d.get("tab")??"care";s.openSuitcaseDialog(b)}else if(g==="match3"){Number(d.get("m3level")||0),Math.min(777,(a.state.match3.maxClearedLevel??0)+1);const b=void 0,f=!!c;s.openMatch3Dialog(b,f)}else if(g==="puzzle"||g==="caro"||g==="sudoku"||g==="chess"||g==="blocks"||g==="jigsaw"||g==="pikachu"||g==="onet"){const b=g==="puzzle"?d.get("pmode"):g,f=b==="pikachu"||b==="onet"?"blocks":b,E=f==="caro"||f==="sudoku"||f==="chess"||f==="blocks"||f==="jigsaw"?f:void 0;s.openPuzzleArcadeDialog(E)}else if(g==="neighbors"||g==="friends")s.openNeighborDialog();else if(g==="feast")s.openHarvestFeastDialog();else if(g==="leaderboard"){const b=d.get("lbgame"),f=b==="match3"||b==="caro"||b==="sudoku"||b==="chess"||b==="blocks"||b==="jigsaw"||b==="seedquiz"?b:void 0,E=d.get("lbscope"),z=E==="valley"||E==="friends"||E==="personal"?E:void 0;s.openLeaderboardDialog(f,z)}else if(!d.get("tour")&&!d.get("visit")&&!a.isHeadmasterPreview)try{const b=localStorage.getItem(wn);if(b){const f=JSON.parse(b),E=Date.now()-Number(f.savedAt||0),z=a.state.puzzleArcade;E>=0&&E<=12*3600*1e3?f.dialog==="puzzleArcade"&&f.mode==="sudoku"&&z.sudokuSession?.stage===z.sudokuStage?s.openPuzzleArcadeDialog("sudoku"):f.dialog==="puzzleArcade"&&f.mode==="caro"&&z.caroSession?.stage===z.caroStage?s.openPuzzleArcadeDialog("caro"):f.dialog==="puzzleArcade"&&f.mode==="chess"&&z.chessSession?.stage===z.chessStage?s.openPuzzleArcadeDialog("chess"):f.dialog==="puzzleArcade"&&f.mode==="blocks"&&z.onetSession?.stage===z.blockStage?s.openPuzzleArcadeDialog("blocks"):f.dialog==="puzzleArcade"&&f.mode==="jigsaw"&&z.jigsawSession?.stage===z.jigsawStage?s.openPuzzleArcadeDialog("jigsaw"):f.dialog==="match3"&&a.state.match3.activeSession?.levelId===a.state.match3.currentLevel?s.openMatch3Dialog():localStorage.removeItem(wn):localStorage.removeItem(wn)}}catch{}const m={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},T=b=>{const f=String(b||"").trim();if(!f){s.exitVisitFromHud();return}const E=m[f]||(f.startsWith("tour_")?f:"");E?s.enterHonorTourFromHud(E):f.startsWith("player_")||a.ensureNeighborSocial().neighbors.some(z=>z.id===f)?s.enterVisitFromHud(f):s.enterFlooMemberVisitFromHud(f)},h=d.get("tour")||d.get("visit");h&&T(h);const y=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(y.some(b=>d.has(b))){const b=new URLSearchParams(d);for(const z of y)b.delete(z);const f=b.toString(),E=`${window.location.pathname}${f?`?${f}`:""}${window.location.hash}`;window.history.replaceState(null,"",E)}a.isTutorialActive()&&!u&&s.panCameraToTutorialTarget(),Be.bindSimulationGringottsWallet(a,{onSnapshot:b=>s.applyAuthoritativeSnapshot(b),onToast:(b,f)=>s.showToast(b,f??"🏦")}),Be.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(Be.authoritativeClient.snapshot),s.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",b=>{s.applyAuthoritativeSnapshot(b.detail)}),window.addEventListener("hpvn:toast",b=>{const f=b.detail;f?.text&&s.showToast(String(f.text),"🔥")}),window.addEventListener("hpvn:tour-garden",b=>{const f=b.detail;T(String(f?.tourId??""))}),window.addEventListener("gamesave:updated",b=>{if(a.isHeadmasterPreview||a.isVisitingNeighbor)return;const f=b.detail,E=typeof f?.saveJson=="string"&&f.saveJson||(typeof localStorage<"u"?localStorage.getItem(Gs):null);if(E){if(!Fs())try{const z=JSON.parse(E);if(z&&(z.sandboxMode===!0||z.sandboxTainted===!0||z.isHeadmasterPreview===!0))return}catch{return}qs(a.state),a.importSaveJson(E)&&(Be.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(Be.authoritativeClient.snapshot),s.match3Modal?.resetSession(),s.puzzleArcadeModal?.resetSession(),s.refreshAll(),Cn.refresh(),s.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️"))}}),window.addEventListener("hpvn:atmosphere",b=>{if(a.isVisitingNeighbor)return;const f=b.detail?.mode,E=f==="auto"?"realtime":f;(E==="realtime"||E==="dawn"||E==="day"||E==="dusk"||E==="night")&&(a.state.settings.timeOverride=E,a.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:weather",b=>{if(a.isVisitingNeighbor)return;const f=b.detail?.mode;(f==="auto"||f==="clear"||f==="cloudy"||f==="rain"||f==="storm"||f==="snow"||f==="fog"||f==="fireflies")&&(a.state.settings.weatherOverride=f,a.saveToStorage(),s.refreshAll())}),a.onTutorialStepChanged=()=>{s.panCameraToTutorialTarget()},a.onUiChange=()=>{s.refreshAll(),Cn.refresh()},a.onToast=(b,f)=>{s.showToast(b,f),b.includes("Đạt Cấp")||b.includes("lên cấp")||b.includes("Lên Cấp")?jt("levelup"):jt("light"),Us(b)},a.onBuildingTactile=b=>l.triggerSquash(b),a.onBuildingCompleted=b=>{l.triggerCompletionPop(b),l.triggerSquash(b)},a.onRibbonUnveiled=b=>{const f=xn(b.gx,b.gy,r,n.clientWidth,n.clientHeight,36);l.triggerRibbonUnveilPop(b.uid,f.sx,f.sy),s.showRibbonUnveilBanner(b),jt("levelup")},a.onRewardFly=(b,f,E,z)=>{if(typeof E=="number"&&typeof z=="number"){const G=xn(E,z,r,n.clientWidth,n.clientHeight,32);s.spawnFlyReward(b,f,G.sx,G.sy)}else s.spawnFlyReward(b,f)},a.onLevelUp=b=>{jt("levelup");const f=Gi(b),E=f.unlockedItemIds.map(G=>le(G)?.name).filter(Boolean).slice(0,2).join(", "),z=E?` — Mở bản vẽ mới: ${E}!`:f.milestoneNote?` — ${f.milestoneNote}`:"";s.showToast(`🎉 Đạt Cấp Giải Đố ${b}! (+${f.rewardGalleons}🪙)${z}`,"🌟"),s.refreshAll()};const C=a.processOfflineProgress();C&&s.showOfflineModal(C);const v=b=>{const f=a.getActiveVisitingNeighbor();if(!f?.remoteUserId)return;const E=f.helpedMarksToday[f.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:f.remoteUserId,buildingUid:b,kind:E?.kind||"water_crop",noteText:E?.noteText||"Chúc vườn phép thuật bội thu!",helperName:a.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let k=null,S=!1,L=!1,x=!1,A=!1,M=!1,O=0,U=0,I=0,V=0,j=0,ne=0;const se=(b,f,E,z)=>{const G=s.activeSeedCropId;if(!G)return!1;let oe=a.grid[f]?.[b]?.buildingUid??null;if(!oe)for(let R=l.hotspots.length-1;R>=0;R--){const Z=l.hotspots[R];if(Z.kind==="building"&&Math.hypot(E-Z.sx,z-Z.sy)<=Z.radius){oe=Z.id;break}}if(!oe)return!1;const F=a.state.buildings.find(R=>R.uid===oe);if(!F||F.cropId||Date.now()<F.constructEndsAt||!le(F.itemId)?.isFarmlandPlot)return!1;const Y=a.plantCropOnPlot(F.uid,G);if(!Y.ok){if(Y.needSeedAcquire)return A=!1,S=!1,s.seedTrayOpen=!1,s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(G,F.uid),!1;const R=Date.now();return R-O>1200&&(O=R,s.showToast(Y.msg,"🪙")),!1}return s.seedTrayOpen&&(s.seedTrayOpen=!1,s.renderSeedTray(),s.refreshFloatingBanner()),!0},de=(b,f,E,z)=>{const G=s.activePastureAnimalId;if(!G)return!1;let oe=a.grid[f]?.[b]?.buildingUid??null;if(!oe)for(let R=l.hotspots.length-1;R>=0;R--){const Z=l.hotspots[R];if(Z.kind==="building"&&Math.hypot(E-Z.sx,z-Z.sy)<=Z.radius){oe=Z.id;break}}if(!oe)return!1;const F=a.state.buildings.find(R=>R.uid===oe);if(!F||F.pastureAnimalId||Date.now()<F.constructEndsAt||!le(F.itemId)?.isAnimalPasturePlot)return!1;const Y=a.stockAnimalOnPasture(F.uid,G);if(!Y.ok){const R=Date.now();return R-U>1200&&(U=R,s.showToast(Y.msg,"🪙")),!1}return s.pastureTrayOpen&&(s.pastureTrayOpen=!1,s.renderPastureTray(),s.refreshFloatingBanner()),!0},te=new Map;let N=0,P=!1,D=null;const q=()=>{D&&(window.clearTimeout(D.timer),D=null)},_=[[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],Q=(b,f,E,z,G)=>{if(Je(b))return{gx:f,gy:E};const{bw:oe,bh:F}=a.getBuildingFootprint(b,z),ae=Math.max(0,Math.min(Ee-oe,f-Math.floor((oe-1)/2))),Y=Math.max(0,Math.min(Ee-F,E-Math.floor((F-1)/2)));if(a.canPlaceItem(b,ae,Y,z,G).ok)return{gx:ae,gy:Y};for(const[R,Z]of _){const ee=ae+R,H=Y+Z;if(!(ee<0||H<0||ee+oe>Ee||H+F>Ee)&&a.canPlaceItem(b,ee,H,z,G).ok)return{gx:ee,gy:H}}return{gx:ae,gy:Y}},re=(b,f)=>{const E=n.getBoundingClientRect(),z=E.width||window.innerWidth||1280,G=E.height||window.innerHeight||720,oe=Vt(z*.5,G*.5,r,z,G,a.grid),{bw:F,bh:ae}=a.getBuildingFootprint(b,f),Y=Math.max(0,Math.min(Ee-F,oe.gx-Math.floor((F-1)/2))),R=Math.max(0,Math.min(Ee-ae,oe.gy-Math.floor((ae-1)/2)));let Z=null;for(let H=-9;H<=9;H++)for(let J=-9;J<=9;J++){const B=Y+J,K=R+H;if(B<0||K<0||B+F>Ee||K+ae>Ee||!a.canPlaceItem(b,B,K,f).ok)continue;let Se=0;for(let we=-1;we<=ae&&Se===0;we++)for(let xe=-1;xe<=F;xe++){const ye=(xe===-1||xe===F)&&(we===-1||we===ae),Oe=xe>=0&&xe<F&&we>=0&&we<ae;if(!(ye||Oe)&&a.connectedPathTiles.has(`${B+xe},${K+we}`)){Se=8;break}}const Ne=Se-Math.hypot(J,H);(!Z||Ne>Z.score)&&(Z={gx:B,gy:K,score:Ne})}if(Z)return{gx:Z.gx,gy:Z.gy};const ee=a.findSmartSpotForStoryBuilding(b,f);if(ee&&a.canPlaceItem(b,ee.gx,ee.gy,f).ok)return ee;for(let H=0;H<=Ee-ae;H++)for(let J=0;J<=Ee-F;J++)if(a.canPlaceItem(b,J,H,f).ok)return{gx:J,gy:H};return null};s.onSelectCatalogItem=b=>{if(Je(b))return;const f=re(b,s.rotation);if(!f)return;k={gx:f.gx,gy:f.gy};const{bw:E,bh:z}=a.getBuildingFootprint(b,s.rotation),G=n.getBoundingClientRect(),oe=G.width||window.innerWidth||1280,F=G.height||window.innerHeight||720,ae=a.grid[f.gy]?.[f.gx]?.elevation??0,Y=xn(f.gx+E*.5,f.gy+z*.5,r,oe,F,ae*ms);(Y.sx<oe*.18||Y.sx>oe*.82||Y.sy<F*.2||Y.sy>F*.76)&&(p=null,fe(r,f.gx+E*.5,f.gy+z*.5)),hs()&&(s.pendingTouchTile={gx:f.gx,gy:f.gy,label:b.name},s.refreshTouchConfirmBar())},s.onAutoPlaceSelected=()=>{const b=s.selectedCatalogItem;if(!b)return;const f=s.rotation;let E=null;if(s.pendingTouchTile&&a.canPlaceItem(b,s.pendingTouchTile.gx,s.pendingTouchTile.gy,f).ok?E={gx:s.pendingTouchTile.gx,gy:s.pendingTouchTile.gy}:k&&a.canPlaceItem(b,k.gx,k.gy,f).ok?E={gx:k.gx,gy:k.gy}:E=re(b,f),!E){const ae=a.canPlaceItem(b,18,24,f),{bw:Y,bh:R}=a.getBuildingFootprint(b,f);s.showToast(ae.reason&&!ae.reason.includes("Ô đất")?ae.reason:`Chưa tìm thấy khoảng đất trống ${Y}×${R} ô trong vùng đã mở khóa!`,"⚠️");return}const z=a.canPlaceItem(b,E.gx,E.gy,f);if(!z.ok){s.showToast(z.reason??"Không thể đặt tại ô này!","⚠️");return}if(!a.placeItem(b,E.gx,E.gy,f))return;const{bw:oe,bh:F}=a.getBuildingFootprint(b,f);p=null,fe(r,E.gx+oe*.5,E.gy+F*.5),s.pendingTouchTile=null,Pn(b)?k=re(b,f):(s.selectedCatalogItem=null,k=null),s.refreshAll(),s.showToast(`🔨 Đã khởi công "${b.name}" thành công!`,"✨")},s.onTouchConfirmPlace=()=>{if(!s.pendingTouchTile)return;const{gx:b,gy:f}=s.pendingTouchTile;if(s.moveModeActive&&s.movingBuildingUid){const E=a.moveBuilding(s.movingBuildingUid,b,f,s.rotation);if(!E.ok){s.showToast(E.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}if(s.selectedCatalogItem){const E=s.selectedCatalogItem,z=a.canPlaceItem(E,b,f,s.rotation);if(!z.ok){s.showToast(z.reason??"Không thể đặt tại ô này!","⚠️");return}if(a.placeItem(E,b,f,s.rotation),s.pendingTouchTile=null,!Pn(E))s.selectedCatalogItem=null,k=null,s.showToast(`🔨 Đã khởi công "${E.name}" thành công!`,"✨");else{const G=re(E,s.rotation);k=G,G&&(s.pendingTouchTile={gx:G.gx,gy:G.gy,label:E.name})}s.refreshAll()}},s.onTouchCancelPlace=()=>{k=null};const X=new Set;window.addEventListener("keydown",b=>{if(document.querySelector("dialog[open]")){X.clear();return}b.target instanceof HTMLInputElement||b.target instanceof HTMLTextAreaElement||b.target instanceof HTMLSelectElement||b.target instanceof HTMLElement&&b.target.classList.contains("drag-handle")||X.add(b.key.toLowerCase())}),window.addEventListener("keyup",b=>{X.delete(b.key.toLowerCase())}),window.addEventListener("blur",()=>{X.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&X.clear()}),n.addEventListener("pointermove",b=>{te.has(b.pointerId)&&te.set(b.pointerId,{x:b.clientX,y:b.clientY});const f=n.getBoundingClientRect();if(te.size>=2){q(),x=!1,P=!0;const Y=Array.from(te.values()),R=Math.hypot(Y[1].x-Y[0].x,Y[1].y-Y[0].y),Z=(Y[0].x+Y[1].x)*.5-f.left,ee=(Y[0].y+Y[1].y)*.5-f.top;if(N>8&&R>8){const H=(Z-f.width*.5)/r.zoom+r.x,J=(ee-f.height*.5)/r.zoom+r.y,B=R/N;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*B)),r.x=H-(Z-f.width*.5)/r.zoom,r.y=J-(ee-f.height*.5)/r.zoom}N=R;return}const E=b.clientX-f.left,z=b.clientY-f.top;if(!a.isVisitingNeighbor&&!L&&!s.movingBuildingUid&&!s.pincerActive)for(const Y of l.hotspots)Y.kind==="bubble"&&Math.hypot(E-Y.sx,z-Y.sy)<=Y.radius&&a.harvestBuildingBubble(Y.id);const G=Vt(E,z,r,f.width,f.height,a.grid);if(!s.pendingTouchTile)if(s.selectedCatalogItem&&!Je(s.selectedCatalogItem))k=Q(s.selectedCatalogItem,G.gx,G.gy,s.rotation);else if(s.moveModeActive&&s.movingBuildingUid){const Y=a.state.buildings.find(Z=>Z.uid===s.movingBuildingUid),R=Y?le(Y.itemId):void 0;k=R?Q(R,G.gx,G.gy,s.rotation,s.movingBuildingUid):{gx:G.gx,gy:G.gy}}else k={gx:G.gx,gy:G.gy};if(!S)return;if(D&&te.size===1&&Math.hypot(b.clientX-I,b.clientY-V)>8){const Y=D;q(),x=!0,a.placeItem(Y.item,Y.gx,Y.gy,Y.rot)}if(x&&s.selectedCatalogItem){a.placeItem(s.selectedCatalogItem,G.gx,G.gy,s.rotation);return}if(A&&s.activeSeedCropId){se(G.gx,G.gy,E,z);return}if(M&&s.activePastureAnimalId){de(G.gx,G.gy,E,z);return}const oe=b.clientX-I,F=b.clientY-V,ae=s.selectedCatalogItem&&!Je(s.selectedCatalogItem)||s.moveModeActive&&s.movingBuildingUid?14:5;Math.hypot(oe,F)>ae&&(L=!0,s.rideCamUid=null),L&&(p=null,r.x=j-oe/r.zoom,r.y=ne-F/r.zoom)}),n.addEventListener("pointerdown",b=>{if(te.set(b.pointerId,{x:b.clientX,y:b.clientY}),te.size>=2){q();const F=Array.from(te.values());N=Math.hypot(F[1].x-F[0].x,F[1].y-F[0].y),P=!0,x=!1;return}if(b.button!==0&&b.button!==2)return;const f=n.getBoundingClientRect(),E=b.clientX-f.left,z=b.clientY-f.top,G=Vt(E,z,r,f.width,f.height,a.grid);if(!s.pendingTouchTile)if(s.selectedCatalogItem&&!Je(s.selectedCatalogItem))k=Q(s.selectedCatalogItem,G.gx,G.gy,s.rotation);else if(s.moveModeActive&&s.movingBuildingUid){const F=a.state.buildings.find(Y=>Y.uid===s.movingBuildingUid),ae=F?le(F.itemId):void 0;k=ae?Q(ae,G.gx,G.gy,s.rotation,s.movingBuildingUid):{gx:G.gx,gy:G.gy}}else k={gx:G.gx,gy:G.gy};S=!0,L=!1,I=b.clientX,V=b.clientY,j=r.x,ne=r.y;const oe=s.selectedCatalogItem;if(b.button===0&&oe&&Je(oe)&&!s.hasOpenFloatingTray()){if(b.pointerType==="touch"){q(),x=!1;const F=s.rotation;D={item:oe,gx:G.gx,gy:G.gy,rot:F,timer:window.setTimeout(()=>{D=null,te.size===1&&!P&&S&&(x=!0,a.placeItem(oe,G.gx,G.gy,F))},75)}}else x=!0,a.placeItem(oe,G.gx,G.gy,s.rotation);A=!1,M=!1}else b.button===0&&s.activeSeedCropId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&se(G.gx,G.gy,E,z)?(x=!1,A=!0,M=!1):b.button===0&&s.activePastureAnimalId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&de(G.gx,G.gy,E,z)?(x=!1,A=!1,M=!0):(x=!1,A=!1,M=!1)});const pe=b=>{te.delete(b),te.size<2&&(N=0)};window.addEventListener("pointercancel",b=>{q(),pe(b.pointerId),S=!1,L=!1,x=!1,A=!1,M=!1,P=!1}),window.addEventListener("pointerup",b=>{if(pe(b.pointerId),P){q(),te.size===0&&(P=!1,S=!1,L=!1,A=!1,M=!1);return}if(!S)return;let f=!1;if(D&&!L&&b.target===n){const ee=D;q(),a.placeItem(ee.item,ee.gx,ee.gy,ee.rot),f=!0}else q();const E=L,z=x||f||A||M;if(S=!1,L=!1,x=!1,A=!1,M=!1,E||z)return;if(b.button===2){s.selectedCatalogItem=null,s.bulldozerActive=!1,s.moveModeActive=!1,s.movingBuildingUid=null,s.pincerActive=!1,s.pincerPicked=null,s.closeSeedTray(),s.closePastureTray(),s.collapseBuildDock(),s.closeHudPopovers(),s.pendingTouchTile=null,s.inspectSelection=null,s.refreshAll();return}if(b.target!==n)return;const G=s.pendingSowPlotUid,oe=s.pendingStockPastureUid;if(s.closeHudPopovers(),s.hasOpenFloatingTray()&&(s.hideOpenFloatingTrays(),s.selectedCatalogItem||s.moveModeActive||s.bulldozerActive||s.pincerActive)){s.refreshAll();return}const F=n.getBoundingClientRect(),ae=b.clientX-F.left,Y=b.clientY-F.top,R=Vt(ae,Y,r,F.width,F.height,a.grid),Z=b.pointerType==="touch";if(s.pincerActive){const ee=s.pincerPicked??(a.staff[0]?{kind:"staff",id:a.staff[0].id,label:a.staff[0].name}:null);ee&&a.dropPickedEntity(ee.kind,ee.id,R.gx,R.gy),s.pincerPicked=null,s.pincerActive=!1,s.refreshAll();return}if(s.bulldozerActive){let ee=R.gx,H=R.gy;const J=a.grid[H]?.[ee];if(!J?.buildingUid&&(!J||J.path==="none")){for(const B of l.hotspots)if(B.kind==="building"&&Math.hypot(ae-B.sx,Y-B.sy)<=B.radius){const K=a.state.buildings.find(Se=>Se.uid===B.id);K&&(ee=K.gx,H=K.gy);break}}a.removeAtTile(ee,H);return}if(s.moveModeActive){if(s.movingBuildingUid){const J=a.state.buildings.find(Ot=>Ot.uid===s.movingBuildingUid),B=J?le(J.itemId):void 0,K=B?Q(B,R.gx,R.gy,s.rotation,s.movingBuildingUid):{gx:R.gx,gy:R.gy},{bw:Se,bh:Ne}=B?a.getBuildingFootprint(B,s.rotation):{bw:1,bh:1},we=!!s.pendingTouchTile&&R.gx>=s.pendingTouchTile.gx&&R.gx<s.pendingTouchTile.gx+Se&&R.gy>=s.pendingTouchTile.gy&&R.gy<s.pendingTouchTile.gy+Ne;if(Z&&!we&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==K.gx||s.pendingTouchTile.gy!==K.gy)){k=K,s.pendingTouchTile={gx:K.gx,gy:K.gy,label:B?.name??"Dời công trình"},s.refreshTouchConfirmBar();return}const xe=we?s.pendingTouchTile.gx:K.gx,ye=we?s.pendingTouchTile.gy:K.gy,Oe=a.moveBuilding(s.movingBuildingUid,xe,ye,s.rotation);if(!Oe.ok){s.showToast(Oe.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}let H=a.grid[R.gy]?.[R.gx]?.buildingUid??null;if(!H){for(const J of l.hotspots)if(J.kind==="building"&&Math.hypot(ae-J.sx,Y-J.sy)<=J.radius){H=J.id;break}}if(H){const J=a.state.buildings.find(B=>B.uid===H);if(J?.isIndestructible){s.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(J){s.movingBuildingUid=J.uid,s.rotation=J.rotation,s.refreshFloatingBanner();const B=le(J.itemId);s.showToast(`Đã nhấc "${B?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(s.selectedCatalogItem){const ee=s.selectedCatalogItem,H=Q(ee,R.gx,R.gy,s.rotation),{bw:J,bh:B}=a.getBuildingFootprint(ee,s.rotation),K=!!s.pendingTouchTile&&R.gx>=s.pendingTouchTile.gx&&R.gx<s.pendingTouchTile.gx+J&&R.gy>=s.pendingTouchTile.gy&&R.gy<s.pendingTouchTile.gy+B;if(Z&&!Je(ee)&&!K&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==H.gx||s.pendingTouchTile.gy!==H.gy)){k=H,s.pendingTouchTile={gx:H.gx,gy:H.gy,label:ee.name},s.refreshTouchConfirmBar();return}const Se=K?s.pendingTouchTile.gx:H.gx,Ne=K?s.pendingTouchTile.gy:H.gy,we=a.canPlaceItem(ee,Se,Ne,s.rotation);if(!we.ok){s.showToast(we.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(ee,Se,Ne,s.rotation),s.pendingTouchTile=null,Pn(ee)||(s.selectedCatalogItem=null,k=null,s.showToast(`🔨 Đã khởi công "${ee.name}" thành công!`,"✨")),s.refreshAll();return}for(const ee of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let H=null,J=1/0;for(let B=l.hotspots.length-1;B>=0;B--){const K=l.hotspots[B];if(K.kind!==ee)continue;const Se=Math.hypot(ae-K.sx,Y-K.sy);if(K.spriteKey&&typeof K.boxLeft=="number"&&typeof K.boxTop=="number"&&typeof K.boxW=="number"&&typeof K.boxH=="number"&&K.boxW>2&&K.boxH>2){const Ne=ae>=K.boxLeft&&ae<=K.boxLeft+K.boxW&&Y>=K.boxTop&&Y<=K.boxTop+K.boxH,we=(ae-K.boxLeft)/K.boxW,xe=(Y-K.boxTop)/K.boxH,ye=Ne&&i.hitTestAlpha(K.spriteKey,we,xe,!!K.flipX),Oe=K.kind==="building"&&Se<=K.radius*.5;if(!ye&&!Oe)continue;if((H===null||Se<J*.82)&&(H=K,J=Se,ye))break}else Se<=K.radius&&Se<J&&(J=Se,H=K)}if(H){if(H.kind==="owl_post"){const B=l.collectOwlPostParcel();B&&a.claimOwlPostDelivery(B.gx,B.gy),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="visitor_gift"){const B=a.claimVisitedNeighborMysteryGift();B.ok?l.notifyJuice("harvest",H.sx,H.sy):s.showToast(B.msg,"🎁"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="neighbor_help"){l.triggerSquash(H.id);const B=a.helpVisitedNeighborBuilding(H.id);B.ok?(l.notifyJuice("harvest",H.sx,H.sy),v(H.id)):s.showToast(B.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="home_lantern"){const B=a.ensureNeighborSocial().homeLanternMarks.find(Se=>Se.id===H.id);B&&l.triggerSquash(B.buildingUid);const K=a.claimHomeLanternMark(H.id);K.ok?l.notifyJuice("harvest",H.sx,H.sy):s.showToast(K.msg,"🏮"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="unveil_building"){a.unveilBuilding(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="bubble"){a.harvestBuildingBubble(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="water_crop"){l.triggerSquash(H.id);const B=a.waterCropPlot(H.id);B.ok?l.notifyJuice("harvest",H.sx,H.sy):s.showToast(B.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="feed_pasture"){l.triggerSquash(H.id);const B=a.feedAnimalPasture(H.id);B.ok?l.notifyJuice("harvest",H.sx,H.sy):s.showToast(B.msg,"🌾"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="escaped"){a.catchEscapedCreature(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="zone_plaque"){s.closeSeedTray(),s.inspectSelection={kind:"zone",zoneId:H.id},s.refreshAll();return}if(H.kind==="villager"){a.greetVillager(H.id),s.refreshAll();return}if(H.kind==="building"){const B=a.state.buildings.find(K=>K.uid===H.id);if(B){if(!a.isVisitingNeighbor&&B.awaitingUnveil){a.unveilBuilding(B.uid),s.inspectSelection=null,s.refreshAll();return}const K=le(B.itemId),Se=!!(!a.isVisitingNeighbor&&K?.isFarmlandPlot&&B.cropId&&B.cropReadyAt&&Date.now()>=B.cropReadyAt),Ne=!!(!a.isVisitingNeighbor&&K?.isAnimalPasturePlot&&B.pastureAnimalId&&B.pastureReadyAt&&Date.now()>=B.pastureReadyAt);if(!Se&&!Ne&&l.triggerSquash(H.id),a.isVisitingNeighbor){const ye=a.getVisitedBuildingHelpStatus(B);if(ye.canHelp){const Oe=a.helpVisitedNeighborBuilding(B.uid);Oe.ok?(l.notifyJuice("harvest",H.sx,H.sy),v(B.uid)):s.showToast(Oe.msg,"💧")}else if(ye.existingMark)s.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${ye.existingMark.noteText}”`,"🏮");else{const Oe=le(B.itemId),Ot=a.getActiveVisitingNeighbor();s.showToast(`🏡 Đang ngắm "${Oe?.name??"Công trình"}" (${B.stars}★) tại vườn ${Ot?.name??"bạn bè"}!`,Ot?.avatarEmoji??"🏡")}s.inspectSelection=null,s.refreshAll();return}const we=a.ensureNeighborSocial().homeLanternMarks.find(ye=>ye.buildingUid===B.uid);if(we&&a.claimHomeLanternMark(we.id).ok){l.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}const xe=le(B.itemId);if(xe?.isFarmlandPlot&&B.cropId&&B.cropReadyAt&&Date.now()>=B.cropReadyAt){a.harvestCropPlot(B.uid),s.inspectSelection=null,s.refreshAll();return}else if(xe?.isFarmlandPlot&&B.cropId&&B.cropReadyAt&&Date.now()<B.cropReadyAt&&!B.cropWateredBoost){a.waterCropPlot(B.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}else if(xe?.isFarmlandPlot&&!B.cropId&&Date.now()>=B.constructEndsAt){if(s.activeSeedCropId){const ye=a.plantCropOnPlot(B.uid,s.activeSeedCropId);if(ye.needSeedAcquire){s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(s.activeSeedCropId,B.uid);return}s.showToast(ye.msg,ye.ok?"🌱":"🪙"),s.inspectSelection=null,s.refreshAll()}else G===B.uid?(s.inspectSelection={kind:"building",uid:B.uid},s.refreshAll()):s.openSeedTray(void 0,B.uid);return}else if(xe?.isAnimalPasturePlot&&B.pastureAnimalId&&B.pastureReadyAt&&Date.now()>=B.pastureReadyAt){a.harvestAnimalPasture(B.uid),s.inspectSelection=null,s.refreshAll();return}else if(xe?.isAnimalPasturePlot&&B.pastureAnimalId&&B.pastureReadyAt&&Date.now()<B.pastureReadyAt&&!B.pastureFedBoost){a.feedAnimalPasture(B.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}else if(xe?.isAnimalPasturePlot&&!B.pastureAnimalId&&Date.now()>=B.constructEndsAt){if(s.activePastureAnimalId){const ye=a.stockAnimalOnPasture(B.uid,s.activePastureAnimalId);s.showToast(ye.msg,ye.ok?"🐾":"🪙"),s.inspectSelection=null,s.refreshAll()}else oe===B.uid?(s.inspectSelection={kind:"building",uid:B.uid},s.refreshAll()):s.openPastureTray(void 0,B.uid);return}else(B.storedGalleons>0||B.readyFarmGoods&&B.readyFarmGoods.length>0)&&a.harvestBuildingBubble(B.uid)}s.closeSeedTray(),s.closePastureTray(),s.inspectSelection={kind:"building",uid:H.id},s.refreshAll();return}}}s.inspectSelection=null,s.refreshAll()}),n.addEventListener("contextmenu",b=>b.preventDefault()),n.addEventListener("wheel",b=>{b.preventDefault(),p=null;const f=n.getBoundingClientRect(),E=b.clientX-f.left,z=b.clientY-f.top,G=(E-f.width*.5)/r.zoom+r.x,oe=(z-f.height*.5)/r.zoom+r.y,F=b.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*F)),r.x=G-(E-f.width*.5)/r.zoom,r.y=oe-(z-f.height*.5)/r.zoom},{passive:!1});let me=performance.now(),ue=0;const Ce=new Aa,ce=new jo;qs(a.state);const be=document.createElement("div");be.id="gamepadRadialMenu",be.className="aaa-gamepad-radial",be.hidden=!0,be.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${Vs.map(b=>{const f=b.index*Math.PI*2/8,E=50+Math.cos(f)*37,z=50+Math.sin(f)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${b.index}" style="left:${E.toFixed(1)}%;top:${z.toFixed(1)}%;">${b.icon}<br/>${b.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(be);let W=null,ve=!1;const Ae=b=>{switch(b){case"seeds":s.openSeedTray();break;case"barn":s.openWorkshopDialog("barn");break;case"orders":{s.activeQuestTab="orders",s.renderQuestDialog(),s.root.querySelector("#questDialog")?.showModal();break}case"match3":s.openMatch3Dialog();break;case"arcade":s.openPuzzleArcadeDialog();break;case"seedquiz":s.openSeedQuizDialog();break;case"neighbors":s.openNeighborDialog("friends");break;case"feast":s.openHarvestFeastDialog();break}},Qe=hs(),Dt=s.root.querySelector("#match3Dialog"),Ci=s.root.querySelector("#puzzleArcadeDialog"),ki=s.root.querySelector("#seedQuizDialog"),pn=Array.from(s.root.querySelectorAll("dialog"));let Nt=!1,bt=!1;const un=()=>{Nt=!!(Dt?.open||Ci?.open||ki?.open),bt=Nt||pn.some(b=>b.open)};if(un(),typeof MutationObserver<"u"){const b=new MutationObserver(()=>{un()});for(const f of pn)b.observe(f,{attributes:!0,attributeFilter:["open"]})}s.root.addEventListener("close",un,!0);let Xe=0,Zn=0;function gn(b){if(Xe=0,document.hidden){me=b;return}const f=(b-me)/1e3;if(me=b,!bt&&f>.002&&f<.5&&(ce.recordFrameFps(1/f),ue%90===0&&ue>0)){const R=ce.getHealthReport();Qe?l.adaptiveDprCap=R.p5LowFps<46?1.15:R.p5LowFps<54?1.35:1.5:l.adaptiveDprCap=R.p5LowFps<46?1.25:R.p5LowFps<54?1.5:2}const E=Ce.poll();if(E.connected){if(E.panDx!==0||E.panDy!==0){p=null,s.rideCamUid=null;const R=380/r.zoom*Math.min(.05,f);r.x+=E.panDx*R,r.y+=E.panDy*R}if(E.radialOpen?(be.hidden=!1,ve=!0,E.radialActionId&&(W=E.radialActionId),be.querySelectorAll("[data-radial-idx]").forEach(R=>{R.dataset.selected=String(Number(R.dataset.radialIdx)===E.radialSliceIndex)}),E.confirmJustPressed&&W&&(be.hidden=!0,ve=!1,Ae(W),W=null)):ve&&(be.hidden=!0,ve=!1,W&&(Ae(W),W=null)),E.cancelJustPressed){const R=pn.filter(Z=>Z.open);R.length>0?R[R.length-1]?.close():s.hasOpenFloatingTray()&&s.hideOpenFloatingTrays()}}if((X.has("w")||X.has("arrowup")||X.has("s")||X.has("arrowdown")||X.has("a")||X.has("arrowleft")||X.has("d")||X.has("arrowright"))&&(p=null),p){const R=Math.min(1,Math.max(0,(b-p.startMs)/p.durationMs)),Z=1-Math.pow(1-R,3);r.x=p.fromX+(p.toX-p.fromX)*Z,r.y=p.fromY+(p.toY-p.fromY)*Z,r.zoom=p.fromZoom+(p.toZoom-p.fromZoom)*Z,R>=1&&(p=null)}const z=340/r.zoom*Math.min(.05,f);if(X.size>0&&bt&&X.clear(),(X.has("w")||X.has("arrowup"))&&(s.rideCamUid=null,r.y-=z),(X.has("s")||X.has("arrowdown"))&&(s.rideCamUid=null,r.y+=z),(X.has("a")||X.has("arrowleft"))&&(s.rideCamUid=null,r.x-=z),(X.has("d")||X.has("arrowright"))&&(s.rideCamUid=null,r.x+=z),a.update(f),s.rideCamUid&&!Nt){const R=a.state.buildings.find(ee=>ee.uid===s.rideCamUid),Z=a.coasterCircuits.get(s.rideCamUid);if(Z&&Z.waypoints.length>=3){const ee=xa(Z.waypoints,Z.isClosed,Date.now()/1e3,3);if(ee.length>0){const H=ee[0],J=Tn(H.gx+.5,H.gy+.5,r.viewRot??0),B=J.wx,K=J.wy-(H.elev*ms+10);r.x+=(B-r.x)*Math.min(1,f*10),r.y+=(K-r.y)*Math.min(1,f*10),r.zoom+=(1.38-r.zoom)*Math.min(1,f*5),s.rideCamSpeedText=`${H.speedKmh} km/h (${H.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,ue%8===0&&s.refreshFloatingBanner()}}else if(R){const ee=Date.now()/1e3,H=R.gx+2+Math.cos(ee*2.1)*1.4,J=R.gy+2+Math.sin(ee*2.1)*1.4,B=Tn(H,J,r.viewRot??0);r.x+=(B.wx-r.x)*Math.min(1,f*8),r.y+=(B.wy-22-r.y)*Math.min(1,f*8),r.zoom+=(1.35-r.zoom)*Math.min(1,f*5),s.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",ue%12===0&&s.refreshFloatingBanner()}else s.rideCamUid=null,s.refreshFloatingBanner()}const G=a.getRealTimePeriod(),oe=a.getCurrentWeather(),F=Tn(3,17,r.viewRot??0),ae=Math.hypot(r.x-F.wx,r.y-F.wy)<420;if(o.updateSoundscape(Math.min(.1,f),G==="night"||G==="dusk",r.zoom,ae,oe.kind,a.getActiveFestival()!=="none"),!Nt&&(!bt||b-Zn>=80)){Zn=b;const R=s.pendingTouchTile?{gx:s.pendingTouchTile.gx,gy:s.pendingTouchTile.gy}:k;l.activeSeedBrushCropId=s.activeSeedCropId,l.activePastureBrushAnimalId=s.activePastureAnimalId,l.render(a,r,R,s.selectedCatalogItem,s.rotation,s.bulldozerActive,s.inspectSelection?.kind==="building"?s.inspectSelection.uid:null,s.movingBuildingUid,s.pincerPicked?.label??null),ue++,!bt&&ue%6===0&&!s.photoModeActive&&l.renderMinimap(s.minimapCanvas,a,r)}Xe=requestAnimationFrame(gn)}Xe=requestAnimationFrame(gn),document.addEventListener("visibilitychange",()=>{document.hidden?(Xe&&(cancelAnimationFrame(Xe),Xe=0),a.saveToStorage(),o.pause()):(me=performance.now(),o.resume(),Xe||(Xe=requestAnimationFrame(gn)))}),window.addEventListener("pagehide",()=>{a.saveToStorage()}),window.addEventListener("beforeunload",()=>{a.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{a.saveToStorage()});let Jn=0,es="";const Mi=a.onUiChange;a.onUiChange=()=>{Mi?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:a.state.level,galleons:a.state.galleons}}));const b=Date.now(),f=`${a.state.level}|${a.state.match3.stars}|${a.state.unlockedZones.length}|${a.state.buildings.length}|${a.state.settings.weatherOverride}|${a.state.settings.timeOverride}`;f!==es&&b-Jn>=1200&&(es=f,Jn=b,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:a.state.parkName,level:a.state.level,magicStars:a.state.match3.stars,galleons:a.state.galleons,unlockedZonesCount:a.state.unlockedZones.length,buildingsCount:a.state.buildings.length,weatherMode:a.state.settings.weatherOverride,atmosphereMode:a.state.settings.timeOverride==="realtime"?"auto":a.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",b=>{if(a.isVisitingNeighbor)return;const f=String(b.detail?.mode||"auto");(f==="auto"||f==="none"||f==="halloween"||f==="christmas"||f==="quidditch_cup")&&(a.state.settings.activeFestival=f,a.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:mute",b=>{const f=!!b.detail?.muted;a.state.settings.soundEnabled=!f,a.state.settings.bgmEnabled=!f,o.enabled=!f,o.bgmEnabled=!f,f?o.pause():o.resume(),a.saveToStorage(),s.refreshAll()}),window.addEventListener("gamesave:helpers",b=>{const f=b.detail;if(!f)return;const E=a.homeStateWhileVisiting??a.state,z=E===a.state?a.ensureNeighborSocial():E.neighborSocial??(E.neighborSocial=a.ensureNeighborSocial()),G=new Set(z.homeLanternMarks.map(Z=>Z.id)),oe=E.buildings[0]?.uid||"burrow_main_gate",F=Date.now(),ae=900*1e3,Y=3600*1e3;let R=0;for(const Z of f.helpers??[]){if(!Z?.id||G.has(Z.id)||z.homeLanternMarks.length>=5)continue;G.add(Z.id);const ee=Z.buildingUid?E.buildings.find(J=>J.uid===Z.buildingUid):void 0,H=(ee&&((ee.cropReadyAt??0)>F||(ee.pastureReadyAt??0)>F||(ee.workshopQueue?.[0]?.endsAt??0)>F||(ee.constructEndsAt??0)>F)?ee:void 0)??E.buildings.find(J=>(J.cropReadyAt??0)>F||(J.pastureReadyAt??0)>F||(J.workshopQueue?.[0]?.endsAt??0)>F||(J.constructEndsAt??0)>F);if(H)if((H.cropReadyAt??0)>F)H.cropReadyAt=Math.max(F,(H.cropReadyAt??F)-ae),H.cropWateredBoost=!0;else if((H.pastureReadyAt??0)>F)H.pastureReadyAt=Math.max(F,(H.pastureReadyAt??F)-ae);else if((H.workshopQueue?.[0]?.endsAt??0)>F)for(const J of H.workshopQueue??[])J.startedAt-=ae,J.endsAt=Math.max(F,J.endsAt-ae);else(H.constructEndsAt??0)>F+Y&&(H.constructEndsAt=Math.max(F+Y,(H.constructEndsAt??F)-ae));z.homeLanternMarks.push({id:Z.id,buildingUid:H?.uid||Z.buildingUid||oe,helperId:Z.uid,helperName:Z.name||"Hàng Xóm Hang Sóc",helperEmoji:Z.avatarEmoji||"🧙‍♂️",kind:Z.kind||"water_crop",noteVi:Z.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:Z.at||F}),R++}R>0&&(a.saveToStorage(),s.refreshAll(),f.summaryVi&&s.showToast(f.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",b=>{const f=b.detail;if(!f)return;const E=a.homeStateWhileVisiting??a.state,z=E===a.state?a.ensureNeighborSocial():E.neighborSocial??(E.neighborSocial=a.ensureNeighborSocial());typeof f.dayKey=="string"&&f.dayKey&&(z.lastSocialResetKey=f.dayKey),typeof f.dailyGardenHelpsCount=="number"&&f.dailyGardenHelpsCount>(z.dailyGardenHelpsCount??0)&&(z.dailyGardenHelpsCount=f.dailyGardenHelpsCount)})}Wo().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(n.map(o=>o.unregister()))}if("caches"in window){const n=await caches.keys().catch(()=>[]);await Promise.all(n.map(o=>caches.delete(o)))}window.location.reload()}))});export{Ss as M,Mn as c,Ue as s};
