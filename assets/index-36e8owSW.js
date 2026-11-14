const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-Bc0sRHJQ.js","assets/game-data-S4tdt-yC.js","assets/sim-DDGqsX3x.js","assets/engine-CmmptflP.js","assets/puzzleArcadeModal-DHRXfL25.js"])))=>i.map(i=>d[i]);
var xi=Object.defineProperty;var Ti=(e,t,n)=>t in e?xi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var S=(e,t,n)=>Ti(e,typeof t!="symbol"?t+"":t,n);import{F as we,af as ln,ag as $i,b as mt,w as xe,ah as Ci,g as re,ai as Ct,aj as Yn,Q as cn,G as It,ae as Pe,P as Je,q as Xt,ak as As,M as Ue,o as De,al as Es,m as ki,Z as Dn,p as Mi,u as Li,j as ot,s as Oe,$ as kt,A as Ne,r as yt,E as Ai,I as Ei,N as Ps,R as qs,y as Pi,D as Gt,U as qi,H as ht,am as Tt,S as Hi,an as Ii,W as Hs,X as Is,k as Bt,C as dn,_ as pn,z as Zn,B as Bi,V as Di,T as Jn,a2 as Ni}from"./game-data-S4tdt-yC.js";import{i as Oi,A as bt,n as Ri,j as je,k as Bs,l as es,H as We,L as Dt,M as ts,m as ns,u as zi,o as Fi,p as Gi,q as ss,t as ft,v as is,w as Me,x as Vi,y as _i,z as as,B as un,C as fe,D as Nt,F as St,G as Ui,I as vt,J as Ot,K as ji,N as Wi,O as Qi,P as $n,Q as os,R as Xi,S as Ki,U as Yi,V as rs,W as ls,X as it,Y as Zi,Z as Ds,_ as Ji,$ as ea,a0 as Vt,a1 as ta,a2 as Ns,a3 as pt,a4 as Nn,a5 as na,a6 as Kt,a7 as sa,a8 as ia,a9 as Os,aa as Ke,ab as He,ac as aa,ad as _t,ae as oa,af as ra,ag as cs,ah as la,ai as Ye,aj as wt,ak as Mt,d as ca,al as gn,am as mn,an as da,ao as pa,ap as ua,aq as ga,ar as ma,as as ha,at as ba,au as hn,g as ds,av as bn,s as fa,aw as fn,E as va}from"./sim-DDGqsX3x.js";import{S as ya,I as Sa,i as wa}from"./engine-CmmptflP.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const Rt={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function xa(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const n=t.documentElement;n.setAttribute("data-colorblind",e.colorblindMode),n.setAttribute("data-font-scale",String(e.fontScale)),n.setAttribute("data-high-contrast",e.highContrast?"true":"false"),n.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function Ta(e,t){t.ceiling.setAllVolumes(e.volumes)}const Rs=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],$a=.18;function zt(e,t=$a){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const n=e<0?-1:1,o=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((n*Math.min(1,o)).toFixed(3))}function Ca(e,t){if(Math.hypot(e,t)<.35)return null;let o=Math.atan2(t,e);o<0&&(o+=Math.PI*2);const s=Math.PI*2/8,a=(o+s*.5)%(Math.PI*2);return Math.floor(a/s)%8}class ka{constructor(){S(this,"prevConfirm",!1);S(this,"prevCancel",!1);S(this,"prevDpadUp",!1);S(this,"prevDpadDown",!1);S(this,"prevDpadLeft",!1);S(this,"prevDpadRight",!1)}poll(t){let n=t??null;if(!n&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const $=navigator.getGamepads();for(const L of $)if(L&&L.connected){n=L;break}}if(!n)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const o=zt(n.axes[0]??0),s=zt(n.axes[1]??0),a=zt(n.axes[2]??0),r=zt(n.axes[3]??0),l=!!n.buttons[0]?.pressed,i=!!n.buttons[1]?.pressed,d=!!n.buttons[4]?.pressed,c=!!n.buttons[12]?.pressed,u=!!n.buttons[13]?.pressed,p=!!n.buttons[14]?.pressed,g=!!n.buttons[15]?.pressed,m=l&&!this.prevConfirm,b=i&&!this.prevCancel,h=(g&&!this.prevDpadRight?1:0)-(p&&!this.prevDpadLeft?1:0),T=(u&&!this.prevDpadDown?1:0)-(c&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=i,this.prevDpadUp=c,this.prevDpadDown=u,this.prevDpadLeft=p,this.prevDpadRight=g;const C=d,f=C?Ca(Math.abs(a)>0?a:o,Math.abs(r)>0?r:s):null,k=f!==null?Rs[f]?.actionId??null:null;return{connected:!0,panDx:C?0:o,panDy:C?0:s,cursorStepGx:h,cursorStepGy:T,radialOpen:C,radialSliceIndex:f,radialActionId:k,confirmJustPressed:m,cancelJustPressed:b}}}let zs=null,Ee=null,Ce=null,vn=null;function Fs(e){!Ce&&typeof document<"u"&&(Ce=document.getElementById("a11y-announcer")),!(!Ce||!e)&&(Ce.textContent="",requestAnimationFrame(()=>{Ce&&(Ce.textContent=e)}))}function Ma(e){const t=e.state.buildings.find(o=>o.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const n=Date.now();if(t.constructEndsAt>n)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-n)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const o=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-n)/1e3)),s=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${o} giây, tổng ${s} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function Cn(e){const t=e??zs;if(!t||(!Ee&&typeof document<"u"&&(Ee=document.getElementById("a11y-farm-status")),!Ee))return;const n=t.state,o=n.level,s=n.galleons.toLocaleString("vi-VN"),a=n.sandboxMode?"Vô hạn":String(n.match3?.stars??0),r=n.timeSand,l=n.farmBarn?.owlOrders??[],i=l.filter(u=>t.canFulfillFarmOwlOrder(u)).length,d=`${l.length} đơn hàng (${i} đơn đủ nông sản sẵn sàng giao)`,c=Ma(t);Ee.innerHTML=`
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
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${d}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${c}</td></tr>
      </tbody>
    </table>
  `.trim()}function La(e){zs=e,!(typeof document>"u")&&(Ce||(Ce=document.getElementById("a11y-announcer"),Ce||(Ce=document.createElement("div"),Ce.id="a11y-announcer",Ce.className="visually-hidden",Ce.setAttribute("aria-live","polite"),Ce.setAttribute("aria-atomic","true"),document.body.appendChild(Ce))),Ee||(Ee=document.getElementById("a11y-farm-status"),Ee||(Ee=document.createElement("div"),Ee.id="a11y-farm-status",Ee.className="visually-hidden",Ee.setAttribute("role","region"),Ee.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(Ee))),Cn(e),vn&&clearInterval(vn),vn=setInterval(()=>{Cn()},5e3))}const yn={init:La,announce:Fs,refresh:()=>Cn()},Aa={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function Ft(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const t=navigator.userActivation;if(t&&!t.hasBeenActive)return!1;try{const n=Aa[e]??15;return navigator.vibrate(n)}catch{return!1}}function de(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ps(e){return e===1?"🥇 1":e===2?"🥈 2":e===3?"🥉 3":`#${e}`}function us(e){return e.replace(/\s*\(Bạn\)\s*$/u,"").trim()||e}const gs=`
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
`;class Ea{constructor(t,n){S(this,"activeGameId","match3");S(this,"activeScope","valley");S(this,"activeHouseFilter","all");S(this,"redirectedFromUnscored",null);S(this,"onJumpToGame");S(this,"onVisitNeighbor");S(this,"onOpenNeighborBook");S(this,"root");S(this,"sim");S(this,"closeBound",!1);S(this,"sortingHatSpinning",!1);S(this,"profileDrawerOpen",!1);S(this,"profileDraftName",null);S(this,"profileDraftHouse",null);S(this,"sortingHatAnnouncement","");S(this,"toastTimer",null);S(this,"liveTimer",null);this.root=t,this.sim=n,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");if(t?t.querySelector(".cc-lb-card")||(t.classList.add("cc-lb-dialog"),t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=gs):(t=document.createElement("dialog"),t.id="leaderboardDialog",t.className="cc-lb-dialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=gs,this.root.appendChild(t)),!this.closeBound&&(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype))){const n=(s,a)=>{const r=a.getBoundingClientRect();return s.clientX<r.left||s.clientX>r.right||s.clientY<r.top||s.clientY>r.bottom};let o=!1;t.addEventListener("pointerdown",s=>{o=n(s,t)}),t.addEventListener("pointerup",s=>{o&&n(s,t)&&t.close(),o=!1})}return t}showInDialogToast(t){const n=this.root.querySelector("#leaderboardDialogToast"),o=this.root.querySelector("#leaderboardLiveAnnouncer");n&&(n.textContent=t,n.hidden=!1,this.toastTimer!==null&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{n.hidden=!0,this.toastTimer=null},2800)),o&&(this.liveTimer!==null&&window.clearTimeout(this.liveTimer),o.textContent="",this.liveTimer=window.setTimeout(()=>{o.textContent=t,this.liveTimer=null},50))}open(t,n,o){t?Oi(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=bt.includes(this.activeGameId)?this.activeGameId:Ri(t)):(this.redirectedFromUnscored=null,bt.includes(this.activeGameId)||(this.activeGameId="match3")),(n==="valley"||n==="friends"||n==="personal")&&(this.activeScope=n),(o==="all"||o&&je.includes(o))&&(this.activeHouseFilter=o),this.profileDraftName=null,this.profileDraftHouse=null,this.sortingHatAnnouncement="";const s=this.ensureDialogMounted();this.render(),s.open||s.showModal(),this.scrollSelectedGameTabIntoView(),Bs(this.sim.state).catch(()=>{}).then(()=>Promise.all(bt.map(a=>es(a)))).then(()=>{s.open&&!this.profileDrawerOpen&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}scrollSelectedGameTabIntoView(t=!1){const n=this.root.querySelector('.cc-lb-game-tabs [role="tab"][aria-selected="true"]');if(n&&(t&&n.focus(),typeof n.scrollIntoView=="function"))try{n.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"})}catch{n.scrollIntoView({block:"nearest",inline:"nearest"})}}getCurrentWizardDisplayName(){return this.sim.state.neighborSocial?.playerDisplayName?.trim()||this.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc"}renderHouseCupGridHtml(t){return`
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
                  <strong>#${o.rank} ${de(s.house)}</strong>
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
              aria-label="Điểm Cúp Nhà ${de(s.house)}"
            >
              <div class="cc-hourglass-bar-fill" style="width:${o.fillPercent}%"></div>
            </div>
          </button>
        `}).join("")}
      </div>
    `}renderProfileDrawerHtml(t){if(!this.profileDrawerOpen)return"";const n=!!(this.sim.state.minigameLeaderboard?.playerHouseLockedByServer&&this.sim.state.minigameLeaderboard?.playerHouse),o=n?t:this.profileDraftHouse??t,s=this.profileDraftName??this.getCurrentWizardDisplayName(),a=We[o]??We.Gryffindor,r=je.map(i=>{const d=We[i],c=i===o;return`
        <label class="cc-house-option ${c?"selected":""}" data-cc-house-opt="${i}">
          <input
            type="radio"
            name="ccWizardHouse"
            value="${i}"
            ${c?"checked":""}
            ${n?"disabled":""}
          />
          <span class="cc-house-option-crest" aria-hidden="true">${d.emblemSvg}</span>
          <span class="cc-house-option-info">
            <strong>${de(d.house)} (${de(d.vnTitle)})</strong>
            <small>${d.patronusEmoji} ${de(d.patronusNameVi)} • ${de(d.traitsVi)}</small>
          </span>
        </label>
      `}).join(""),l=this.sortingHatAnnouncement||`${a.patronusEmoji} ${a.house}: ${a.quoteVi}`;return`
      <form id="ccLbProfileForm" class="cc-profile-drawer">
        <div class="cc-profile-header">
          <h3 class="cc-profile-heading">🎩 Hồ Sơ Phù Thủy &amp; Lễ Phân Loại Nhà</h3>
          ${n?`<span class="cc-server-house-badge">🏰 Đồng bộ tài khoản HPVN: ${a.mascotEmoji} ${de(t)}</span>`:""}
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
              value="${de(s)}"
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

        <p id="ccSortingHatQuote" class="cc-dialog-lead">${de(l)}</p>

        <div class="cc-profile-actions">
          <button type="submit" class="cc-pill-btn cc-btn-pink cc-btn-save-profile">
            💾 Cập Nhật Hồ Sơ
          </button>
          <button type="button" id="btnLbCloseProfileDrawer" class="cc-pill-btn cc-btn-slate">
            Thu gọn
          </button>
        </div>
      </form>
    `}renderControlsBarHtml(t){const n=Dt[this.activeGameId],o=`
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
        ${je.map(a=>{const r=We[a],l=this.activeHouseFilter===a;return`
            <button
              type="button"
              class="cc-filter-pill ${l?"active":""}"
              data-lb-house-filter="${a}"
              aria-pressed="${l}"
            >
              ${r.mascotEmoji} ${de(r.house)}
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
            ▶️ ${de(n.shortVi)}
          </button>
        </div>
      </div>
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const n=Dt[this.activeGameId],o=this.root.querySelector("#leaderboardDialogTitle");o&&(o.textContent=`🏆 Bảng Xếp Hạng & Cúp 4 Nhà • ${n.shortVi}`);const s=bt.map(l=>{const i=Dt[l],d=this.sim.getPlayerMinigameRank(l,"valley"),c=l===this.activeGameId;return`
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
          <span class="cc-lb-tab-label">${de(i.shortVi)}</span>
          <span class="cc-lb-tab-rank">${d<=3?"👑 ":""}#${d}</span>
        </button>
      `}).join(""),a=this.redirectedFromUnscored?`<div class="cc-lb-unscored-note" role="note">
          📌 <strong>${de(Dt[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không tính điểm — dưới đây là Cúp 4 Nhà &amp; Bảng Xếp Hạng của <strong>4 môn tranh cúp</strong> (Bùa Gặt • Số Học • Sinh Vật • Tranh Ghép).
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
    `,this.bindEvents(t)}renderStandingRowHtml(t){const n=ps(t.rank),o=We[t.house]??We.Gryffindor,s=t.isPlayer?us(t.name):t.name,a=t.isPlayer?'<span class="cc-lb-you-tag"> (Bạn)</span>':t.isSeededRival?'<span class="cc-lb-npc-tag"> • Mẫu</span>':t.isCloudPlayer?'<span class="cc-lb-cloud-tag"> • Online</span>':t.isFriend?'<span class="cc-lb-friend-tag"> • Bạn</span>':"",r=!t.isPlayer&&t.neighborId?`<button
            type="button"
            class="cc-lb-visit-btn"
            data-lb-visit="${de(t.neighborId)}"
            aria-label="Thăm điền trang của ${de(s)}"
          >🏡 Thăm</button>`:"",l=t.primaryValue>=ts?"👑 777/777":`Màn ${Math.max(0,t.primaryValue)}`;return`
      <tr class="${t.isPlayer?"me-row":""}">
        <td class="cc-lb-rank-cell"><strong>${de(n)}</strong></td>
        <th scope="row" class="cc-lb-name-cell">
          <div class="cc-lb-name-wrap">
            <span class="cc-lb-mobile-rank" aria-hidden="true">${de(n)}</span>
            <span class="cc-lb-avatar" aria-hidden="true">${de(t.avatarEmoji)}</span>
            <span class="cc-lb-wiz-name">${de(s)}</span>
            ${a}
            ${r}
          </div>
        </th>
        <td class="cc-lb-house-cell cc-house-ink-${o.cssSlug}">
          <strong>${o.mascotEmoji} ${de(o.house)}</strong>
        </td>
        <td>${de(l)}</td>
        <td>
          <span class="cc-star-glyph" aria-hidden="true">★</span> ${t.stars.toLocaleString("vi-VN")}
        </td>
        <td>
          <strong class="cc-lb-score-val">${t.ratingScore.toLocaleString("vi-VN")}</strong>
        </td>
      </tr>
    `}renderStandingViewHtml(t){const n=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:o,entries:s,playerEntry:a,playerRank:r,totalEntries:l,nextRivalAbove:i,houseStandings:d,playerHouse:c,includeSeededRivals:u}=n,p=i?`🎯 Đang đuổi <strong>#${i.rank} ${de(us(i.name))}</strong> (${de(i.primaryDisplayVi)} • ${i.ratingScore.toLocaleString("vi-VN")} đ)`:`👑 Đang dẫn đầu <strong>#1</strong> môn ${de(o.shortVi)}!`,g=s.length>0?s.map(m=>this.renderStandingRowHtml(m)).join(""):`
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
            ${a.league.icon} ${de(a.league.labelVi)}
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
            ${de(o.cupTitleVi)} — Hiển thị ${s.length}/${l} phù thủy
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
    `}renderPersonalThreeGamesViewHtml(){const t=this.sim.getMinigameLeaderboard(this.activeGameId,"valley","all"),o=this.sim.getAllPersonalLeaderboardSummaries().map(s=>{const a=s.gameId===this.activeGameId,r=ps(s.valleyRank),l=s.primaryValue>=ts?"👑 777/777":`Màn ${Math.max(0,s.primaryValue)}/777`;return`
          <tr class="${a?"me-row":""}">
            <td class="cc-lb-rank-cell"><strong>${de(r)}</strong></td>
            <th scope="row" class="cc-lb-name-cell">
              <div class="cc-lb-name-wrap">
                <span class="cc-lb-mobile-rank" aria-hidden="true">${de(r)}</span>
                <img src="${s.meta.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
                <span class="cc-lb-wiz-name">${de(s.meta.shortVi)}</span>
                <button
                  type="button"
                  class="cc-lb-visit-btn"
                  data-lb-jump-play="${s.gameId}"
                  aria-label="Chơi ngay ${de(s.meta.shortVi)}"
                >▶️ Chơi</button>
              </div>
            </th>
            <td>
              <span class="cc-league-pill tier-${s.league.tierId}">${s.league.icon} ${de(s.league.labelVi)}</span>
            </td>
            <td>${de(l)}</td>
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
    `}selectGameDiscipline(t,n=!1){bt.includes(t)&&(this.sim.audio.playClick(),this.activeGameId=t,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),this.scrollSelectedGameTabIntoView(n),ns(this.sim.state,t).catch(()=>{}).then(()=>es(t)).then(()=>{this.activeGameId===t&&!this.profileDrawerOpen&&this.render()}))}bindEvents(t){const n=Array.from(t.querySelectorAll("[data-lb-game]"));n.forEach((s,a)=>{s.addEventListener("click",()=>{const r=s.dataset.lbGame;r&&this.selectGameDiscipline(r,!1)}),s.addEventListener("keydown",r=>{if(n.length===0)return;let l=-1;if(r.key==="ArrowRight"?l=(a+1)%n.length:r.key==="ArrowLeft"?l=(a-1+n.length)%n.length:r.key==="Home"?l=0:r.key==="End"&&(l=n.length-1),l>=0){r.preventDefault();const i=n[l]?.dataset.lbGame;i&&this.selectGameDiscipline(i,!0)}})}),t.querySelectorAll("[data-lb-scope]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbScope;a&&(this.sim.audio.playClick(),this.activeScope=a,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbHouseFilter;a&&(this.sim.audio.playClick(),a==="all"?this.activeHouseFilter="all":je.includes(a)&&(this.activeHouseFilter=a),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbHouseCard;!a||!je.includes(a)||(this.sim.audio.playClick(),this.activeScope==="personal"&&(this.activeScope="valley"),this.activeHouseFilter=this.activeHouseFilter===a?"all":a,this.render())})}),t.querySelector("#btnLbToggleProfile")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!this.profileDrawerOpen,this.profileDrawerOpen&&(this.profileDraftName=this.getCurrentWizardDisplayName(),this.profileDraftHouse=this.sim.getPlayerHouse()),this.render(),this.profileDrawerOpen&&t.querySelector("#ccWizardNameInput")?.focus()}),t.querySelector("#btnLbCloseProfileDrawer")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.profileDrawerOpen=!1,this.render()});const o=t.querySelector("#ccWizardNameInput");o?.addEventListener("input",()=>{this.profileDraftName=o.value}),t.querySelectorAll('input[name="ccWizardHouse"]').forEach(s=>{s.addEventListener("change",()=>{const a=s.value;if(!je.includes(a))return;this.sim.audio.playClick(),this.profileDraftHouse=a;const r=We[a];this.sortingHatAnnouncement=`${r.patronusEmoji} ${r.house}: ${r.quoteVi}`,t.querySelectorAll(".cc-house-option").forEach(i=>{i.classList.toggle("selected",i.dataset.ccHouseOpt===a)});const l=t.querySelector("#ccSortingHatQuote");l&&(l.textContent=this.sortingHatAnnouncement)})}),t.querySelector("#btnLbRandomHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0,o&&(this.profileDraftName=o.value);const s=this.sim.rollPlayerSortingHat(this.activeGameId);let a=0;const r=7,l=()=>{if(a+=1,a<r){const d=je[Math.floor(Math.random()*je.length)]??s;this.profileDraftHouse=d,t.querySelectorAll(".cc-house-option").forEach(c=>{c.classList.toggle("selected",c.dataset.ccHouseOpt===d)}),window.setTimeout(l,65);return}this.sortingHatSpinning=!1,this.profileDraftHouse=s;const i=We[s];this.sortingHatAnnouncement=`🎩 NÓN PHÂN LOẠI CHỌN: “${i.house.toUpperCase()}!” — ${i.quoteVi}`,this.activeHouseFilter!=="all"&&(this.activeHouseFilter=s),this.render(),this.showInDialogToast(`🎩 Nón Phân Loại đã chọn Nhà ${i.house} cho bạn!`)};l()}),t.querySelector("#ccLbProfileForm")?.addEventListener("submit",s=>{s.preventDefault();const a=o?.value??this.getCurrentWizardDisplayName(),r=this.profileDraftHouse??this.sim.getPlayerHouse();this.sim.ensureNeighborSocial();const l=zi(this.sim.state,a,r);l.houseLockedByServer?(this.sim.saveToStorage(),this.sim.onUiChange?.(),ns(this.sim.state,this.activeGameId)):this.sim.setPlayerHouse(l.house,this.activeGameId),this.profileDrawerOpen=!1,this.profileDraftName=l.name,this.profileDraftHouse=l.house,this.render(),this.showInDialogToast(`✨ Đã lưu hồ sơ Phù Thủy ${l.name} (${l.house})!`)}),t.querySelector("#btnLbExportCsv")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeScope==="friends"?"friends":"valley",a=Fi(this.sim.state,this.activeGameId,s,this.activeHouseFilter,Gi(this.activeGameId)),r=new Blob(["\uFEFF"+a],{type:"text/csv;charset=utf-8;"}),l=URL.createObjectURL(r),i=document.createElement("a"),d=new Date().toISOString().slice(0,10);i.href=l,i.download=`bxh-${this.activeGameId}-hpvn-${d}.csv`,i.click(),URL.revokeObjectURL(l),this.showInDialogToast("📥 Đã xuất file CSV Bảng Xếp Hạng!")}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeGameId;this.close(),this.onJumpToGame?.(s)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbJumpPlay;a&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(a))})}),t.querySelectorAll("[data-lb-visit]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.lbVisit;a&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(a))})})}}const ms=1,Yt=3,Pa=6,hs=.15,qa="hangsoc_minigame_orient_v1",Ha=8,Ia=110;function xt(e){return e==="jigsaw"?Pa:Yt}function at(e,t=Yt){if(!Number.isFinite(e))return 1;const n=typeof t=="string"?xt(t):t,o=Number.isFinite(n)&&n>=ms?n:Yt,s=Math.min(o,Math.max(ms,e));return Math.round(s*1e3)/1e3}function Sn(e,t){return((Math.round(e)+Math.round(t))%4+4)%4}function Ba(e,t,n,o=!1,s=!1){const a=Math.max(1,t||1024),r=Math.max(1,n||768),l=s?a>=881||a>r*1.05&&a>=560:a>=980||a>r*1.06&&a>=560;return e==="auto"?{effectiveLayout:l?"landscape":"portrait",dialogQuarterTurn:0}:e==="landscape"?a<r?{effectiveLayout:"landscape",dialogQuarterTurn:o?3:1}:{effectiveLayout:"landscape",dialogQuarterTurn:0}:a>r&&r<=640?{effectiveLayout:"portrait",dialogQuarterTurn:o?1:3}:{effectiveLayout:"portrait",dialogQuarterTurn:0}}function wn(e,t,n,o){const s=(e-n.left)/Math.max(1,n.width),a=(t-n.top)/Math.max(1,n.height);switch(o){case 1:return{lu:a,lv:1-s};case 2:return{lu:1-s,lv:1-a};case 3:return{lu:1-a,lv:s};default:return{lu:s,lv:a}}}function bs(e,t,n){switch(n){case 1:return{vx:t,vy:-e};case 2:return{vx:-e,vy:-t};case 3:return{vx:-t,vy:e};default:return{vx:e,vy:t}}}function fs(e){const{prevZoom:t,nextZoom:n,prevPanX:o,prevPanY:s,prevMidOffsetX:a,prevMidOffsetY:r,currMidOffsetX:l,currMidOffsetY:i,maxZoom:d=Yt}=e,c=n<=1.015?1:at(n,d);if(c<=1.001)return{zoom:1,panX:0,panY:0};const u=Math.max(.25,t||1),p=c/u;return{zoom:c,panX:l-(a-o)*p,panY:i-(r-s)*p}}function Da(e,t,n,o,s){if(s%2===0||e<=10||t<=10||n<=10||o<=10)return 1;const a=e/o,r=t/n;return Math.min(1,Math.max(.45,Math.min(a,r)))}function Na(e,t,n,o=1){const s=Math.max(120,Math.floor(Number.isFinite(t)?t:320)),a=Math.max(120,Math.floor(Number.isFinite(n)?n:320));if(e==="blocks"||e==="jigsaw"||e==="seedquiz"||!Number.isFinite(o)||o<=0)return{width:s,height:a};const r=Math.min(3,Math.max(.33,o));let l=s,i=Math.round(l/r);return i>a&&(i=a,l=Math.round(i*r)),{width:Math.max(120,Math.min(s,l)),height:Math.max(120,Math.min(a,i))}}function Oa(e,t,n,o,s,a,r,l){if(n<=0||o<=0||s<=0||a<=0||r<=1.005)return{panX:0,panY:0};const i=l%2===1?a:s,d=l%2===1?s:a,c=i*r,u=d*r,p=36,g=36,m=Math.max(0,(c-n)*.5+p),b=Math.max(0,(u-o)*.5+g),h=Math.min(m,Math.max(-m,Number.isFinite(e)?e:0)),T=Math.min(b,Math.max(-b,Number.isFinite(t)?t:0));return{panX:Math.abs(h)<.5?0:Math.round(h*10)/10,panY:Math.abs(T)<.5?0:Math.round(T*10)/10}}class Ra{constructor(){S(this,"states",new Map);S(this,"orientationPref","auto");S(this,"dialogFlip180",!1);S(this,"spacePressed",!1);S(this,"lastPinchEndMs",0);S(this,"activePinchCount",0);S(this,"stageCleanupByHost",new Map);try{typeof sessionStorage<"u"&&sessionStorage.removeItem(qa)}catch{}typeof window<"u"&&(window.addEventListener("keydown",t=>{if(t.code==="Space"){const n=t.target?.tagName;n!=="INPUT"&&n!=="TEXTAREA"&&n!=="BUTTON"&&(this.spacePressed=!0)}}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1)}),window.addEventListener("blur",()=>{this.spacePressed=!1}))}isPinchOrCooldownActive(){return this.activePinchCount>=2?!0:(typeof performance<"u"?performance.now():Date.now())-this.lastPinchEndMs<Ia}getState(t){let n=this.states.get(t);return n||(n={zoom:1,panX:0,panY:0,boardQuarterTurns:0,panMode:!1},this.states.set(t,n)),n}getOrientationPref(){return this.orientationPref}setOrientationPref(t){this.orientationPref=t,this.dialogFlip180=!1}getViewportResolution(t=!1){const n=typeof window<"u"?Math.round(window.visualViewport?.width||window.innerWidth):1280,o=typeof window<"u"?Math.round(window.visualViewport?.height||window.innerHeight):800;return Ba(this.orientationPref,n,o,this.dialogFlip180,t)}unbindStageInteractions(t){const n=this.stageCleanupByHost.get(t);n&&(this.stageCleanupByHost.delete(t),n())}getEffectiveLayout(t=!1){return this.getViewportResolution(t).effectiveLayout}getNetQuarterTurns(t){const n=this.getState(t),{dialogQuarterTurn:o}=this.getViewportResolution(t==="seedquiz");return Sn(o,n.boardQuarterTurns)}toggleOrientation(t=!1){const o=this.getEffectiveLayout(t)==="landscape"?"portrait":"landscape";this.setOrientationPref(o);for(const s of this.states.values())s.panX=0,s.panY=0;return o}stepZoom(t,n){const o=this.getState(t);return o.zoom=at(o.zoom+n,xt(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}setZoom(t,n){const o=this.getState(t);return o.zoom=at(n,xt(t)),o.zoom<=1.01&&(o.panX=0,o.panY=0,o.panMode=!1),o.zoom}resetView(t){const n=this.getState(t);n.zoom=1,n.panX=0,n.panY=0,n.boardQuarterTurns=0,n.panMode=!1}rotate90(t){const n=this.getState(t);return n.boardQuarterTurns=Sn(n.boardQuarterTurns,1),n.panX=0,n.panY=0,n.boardQuarterTurns}togglePanMode(t){const n=this.getState(t);return n.panMode=!n.panMode,n.panMode}renderToolbarHtml(t,n){return""}syncToolbarDOM(t,n){}applyDialogOrientation(t,n,o=!1){const s=this.getViewportResolution(o),a=String(s.dialogQuarterTurn*90);return t?.dataset&&(t.dataset.mgLayout=s.effectiveLayout,t.dataset.mgRotate=a),n?.dataset&&(n.dataset.mgLayout=s.effectiveLayout,n.dataset.mgRotate=a),s}clearDialogOrientation(t,n){t?.dataset&&(delete t.dataset.mgLayout,delete t.dataset.mgRotate),n?.dataset&&(delete n.dataset.mgLayout,delete n.dataset.mgRotate)}applyCanvasStageTransform(t,n,o){const s=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(!1),r=Sn(a,s.boardQuarterTurns);if(!n||!o)return{effectiveScale:s.zoom,netQuarterTurns:r};const l=n.clientWidth,i=n.clientHeight,d=o.offsetWidth,c=o.offsetHeight,u=Da(l,i,d,c,s.boardQuarterTurns),p=s.zoom*u,g=Oa(s.panX,s.panY,l,i,d,c,p,s.boardQuarterTurns);return s.panX=g.panX,s.panY=g.panY,n.dataset.mgPanMode=String(s.panMode),s.panX===0&&s.panY===0&&Math.abs(p-1)<.002&&s.boardQuarterTurns===0?(o.style.transform="",o.style.transformOrigin=""):(o.style.transformOrigin="center center",o.style.transform=s.boardQuarterTurns===0?`translate3d(${s.panX}px, ${s.panY}px, 0) scale(${p.toFixed(4)})`:`translate3d(${s.panX}px, ${s.panY}px, 0) scale(${p.toFixed(4)}) rotate(${s.boardQuarterTurns*90}deg)`),{effectiveScale:p,netQuarterTurns:r}}applyDomScrollStageTransform(t,n,o){const s=this.getState("seedquiz");if(!t||!n||!o)return;const a=s.zoom,r=s.boardQuarterTurns;if(Math.abs(a-1)<.002&&r===0){o.style.transform="",o.style.transformOrigin="",o.style.width="",n.style.width="",n.style.height="";return}o.style.width="100%";const l=o.offsetWidth||t.clientWidth||640,i=o.offsetHeight||480;if(r===0)o.style.transformOrigin="0 0",o.style.transform=`scale(${a.toFixed(4)})`,n.style.width=`${Math.ceil(l*a)}px`,n.style.height=`${Math.ceil(i*a)}px`;else{const d=r*90,c=(r%2===1?i:l)*a,u=(r%2===1?l:i)*a;n.style.width=`${Math.ceil(c)}px`,n.style.height=`${Math.ceil(u)}px`,o.style.transformOrigin="center center";const p=(c-l)*.5,g=(u-i)*.5;o.style.transform=`translate3d(${p.toFixed(1)}px, ${g.toFixed(1)}px, 0) scale(${a.toFixed(4)}) rotate(${d}deg)`}}bindCanvasStageInteractions(t){const{gameId:n,hostKey:o,panAreaEl:s,canvasShellEl:a,canvasEl:r,getBoardAspectRatio:l,onStageResized:i,canSingleFingerPanAt:d,onTransformUpdated:c}=t,u=o??(n==="match3"?"match3":"arcade");if(this.unbindStageInteractions(u),!s||!a)return;const p=()=>{this.applyCanvasStageTransform(n,s,a),c()};let g=0,m=0,b=0,h=0;const T=(A=!1)=>{if(!r||!s.isConnected)return;const N=Math.floor(s.clientWidth),P=Math.floor(s.clientHeight);if(N<=24||P<=24)return;const H=n==="blocks"||n==="jigsaw",U=H?N:Math.max(120,N-2),se=H?P:Math.max(120,P-4),K=l?l(N,P):H?0:1,pe=Na(n,U,se,K);if(!(A||pe.width!==g||pe.height!==m||N!==b||P!==h))return;g=pe.width,m=pe.height,b=N,h=P,a.style.width=`${pe.width}px`,a.style.height=`${pe.height}px`;const le=H?"auto":`${pe.width} / ${pe.height}`;a.style.aspectRatio=le,r.style.aspectRatio=le,i?.(N,P,pe.width,pe.height),this.applyCanvasStageTransform(n,s,a),c()},C=A=>{A.touches&&A.touches.length>=2&&A.preventDefault()};s.addEventListener("touchmove",C,{passive:!1});const f=A=>{A.preventDefault()};s.addEventListener("gesturestart",f,{passive:!1}),s.addEventListener("gesturechange",f,{passive:!1}),s.addEventListener("wheel",A=>{A.preventDefault();const N=this.getState(n),P=A.ctrlKey?.009:.0018,H=N.zoom*Math.exp(-A.deltaY*P),U=s.getBoundingClientRect(),{dialogQuarterTurn:se}=this.getViewportResolution(!1),{lu:K,lv:pe}=wn(A.clientX,A.clientY,U,se),me=(K-.5)*s.clientWidth,le=(pe-.5)*s.clientHeight,he=fs({prevZoom:N.zoom,nextZoom:H,prevPanX:N.panX,prevPanY:N.panY,prevMidOffsetX:me,prevMidOffsetY:le,currMidOffsetX:me,currMidOffsetY:le,maxZoom:xt(n)});he.zoom===N.zoom&&he.panX===N.panX&&he.panY===N.panY||(N.zoom=he.zoom,N.panX=he.panX,N.panY=he.panY,p())},{passive:!1}),s.addEventListener("contextmenu",A=>{this.getState(n).zoom>1.01&&A.preventDefault()});const k=new Map;let $=!1,L=0,w=0,E=0,M=null,R=null,G=0,q=0;const F=A=>{if(r){try{r.releasePointerCapture?.(A)}catch{}if(typeof PointerEvent<"u")try{r.dispatchEvent(new PointerEvent("pointercancel",{pointerId:A,bubbles:!0}))}catch{}}};s.addEventListener("pointerdown",A=>{if(A.pointerType==="touch"){if(k.set(A.pointerId,{x:A.clientX,y:A.clientY}),this.activePinchCount=k.size,k.size>=2){M=null;const U=Array.from(k.values());if(L=Math.max(10,Math.hypot(U[1].x-U[0].x,U[1].y-U[0].y)),w=(U[0].x+U[1].x)*.5,E=(U[0].y+U[1].y)*.5,$){F(A.pointerId);try{s.setPointerCapture?.(A.pointerId)}catch{}}else{$=!0;for(const se of k.keys()){F(se);try{s.setPointerCapture?.(se)}catch{}}}A.stopPropagation(),A.preventDefault();return}this.getState(n).zoom>1.02&&d&&d(A.clientX,A.clientY)?M={pointerId:A.pointerId,startX:A.clientX,startY:A.clientY,lastX:A.clientX,lastY:A.clientY,active:!1}:M=null;return}const N=this.getState(n);if(A.button===1||A.button===2&&N.zoom>1.01||A.button===0&&N.zoom>1.01&&(A.altKey||this.spacePressed)){R=A.pointerId,G=A.clientX,q=A.clientY,s.dataset.mgDragging="true";try{s.setPointerCapture?.(A.pointerId)}catch{}A.stopPropagation(),A.preventDefault()}},{capture:!0}),s.addEventListener("pointermove",A=>{if(A.pointerType==="touch"&&k.has(A.pointerId)){if(k.set(A.pointerId,{x:A.clientX,y:A.clientY}),$&&k.size>=2){const N=Array.from(k.values()),P=Math.max(10,Math.hypot(N[1].x-N[0].x,N[1].y-N[0].y)),H=(N[0].x+N[1].x)*.5,U=(N[0].y+N[1].y)*.5,se=this.getState(n),K=se.zoom*(P/Math.max(10,L)),pe=s.getBoundingClientRect(),{dialogQuarterTurn:me}=this.getViewportResolution(!1),le=wn(w,E,pe,me),he=wn(H,U,pe,me),ie=(le.lu-.5)*s.clientWidth,ve=(le.lv-.5)*s.clientHeight,j=(he.lu-.5)*s.clientWidth,ye=(he.lv-.5)*s.clientHeight,Le=fs({prevZoom:se.zoom,nextZoom:K,prevPanX:se.panX,prevPanY:se.panY,prevMidOffsetX:ie,prevMidOffsetY:ve,currMidOffsetX:j,currMidOffsetY:ye,maxZoom:xt(n)});se.zoom=Le.zoom,se.panX=Le.panX,se.panY=Le.panY,L=P,w=H,E=U,p(),A.stopPropagation(),A.preventDefault();return}if($){A.stopPropagation(),A.preventDefault();return}if(M&&M.pointerId===A.pointerId){const N=Math.hypot(A.clientX-M.startX,A.clientY-M.startY);if(!M.active&&N>=Ha){M.active=!0,M.lastX=A.clientX,M.lastY=A.clientY,s.dataset.mgDragging="true",F(A.pointerId);try{s.setPointerCapture?.(A.pointerId)}catch{}}if(M.active){const P=this.getState(n),{dialogQuarterTurn:H}=this.getViewportResolution(!1),U=bs(A.clientX-M.lastX,A.clientY-M.lastY,H);P.panX+=U.vx,P.panY+=U.vy,M.lastX=A.clientX,M.lastY=A.clientY,p(),A.stopPropagation(),A.preventDefault();return}}}if(R===A.pointerId){const N=this.getState(n),{dialogQuarterTurn:P}=this.getViewportResolution(!1),H=bs(A.clientX-G,A.clientY-q,P);N.panX+=H.vx,N.panY+=H.vy,G=A.clientX,q=A.clientY,p(),A.stopPropagation(),A.preventDefault()}},{capture:!0});const V=A=>{if(A.pointerType==="touch"&&k.has(A.pointerId)){k.delete(A.pointerId),this.activePinchCount=k.size;try{s.releasePointerCapture?.(A.pointerId)}catch{}if($){if(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now(),k.size===0)$=!1;else if(k.size>=2){const N=Array.from(k.values());L=Math.max(10,Math.hypot(N[1].x-N[0].x,N[1].y-N[0].y)),w=(N[0].x+N[1].x)*.5,E=(N[0].y+N[1].y)*.5}A.stopPropagation(),A.preventDefault();return}if(M&&M.pointerId===A.pointerId){const N=M.active;if(M=null,delete s.dataset.mgDragging,N){A.stopPropagation(),A.preventDefault();return}}}if(R===A.pointerId){R=null,delete s.dataset.mgDragging;try{s.releasePointerCapture?.(A.pointerId)}catch{}A.stopPropagation(),A.preventDefault()}};s.addEventListener("pointerup",V,{capture:!0}),s.addEventListener("pointercancel",V,{capture:!0});let Z=0;const J=()=>{Z||(typeof requestAnimationFrame=="function"?Z=requestAnimationFrame(()=>{Z=0,T(!1)}):T(!1))};let ce=null;r&&typeof ResizeObserver<"u"&&(ce=new ResizeObserver(()=>{J()}),ce.observe(s));const Q=typeof window<"u"?window.visualViewport:null,O=()=>{J()};r&&Q&&Q.addEventListener("resize",O),this.stageCleanupByHost.set(u,()=>{Z&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(Z),Z=0),ce?.disconnect(),ce=null,Q?.removeEventListener("resize",O)}),T(!0),this.applyCanvasStageTransform(n,s,a)}bindDomScrollStageInteractions(t){const{scrollViewportEl:n,sizerEl:o,contentStageEl:s}=t,a="seedquiz",r=()=>{this.applyDomScrollStageTransform(n,o,s)};if(!n||!o||!s)return;const l=h=>{h.preventDefault()};n.addEventListener("gesturestart",l,{passive:!1}),n.addEventListener("gesturechange",l,{passive:!1}),n.addEventListener("wheel",h=>{if(!h.ctrlKey&&!h.metaKey)return;h.preventDefault();const T=this.getState(a),C=T.zoom,f=C*Math.exp(-h.deltaY*.007),k=f<=1.015?1:at(f);if(k===C)return;const $=n.getBoundingClientRect(),L=h.clientX-$.left,w=h.clientY-$.top,E=n.scrollLeft,M=n.scrollTop;T.zoom=k,r();const R=T.zoom/Math.max(.25,C);n.scrollLeft=Math.max(0,(E+L)*R-L),n.scrollTop=Math.max(0,(M+w)*R-w)},{passive:!1});let i=0,d=0,c=0,u=!1;n.addEventListener("touchstart",h=>{if(h.touches.length>=2){u=!0,this.activePinchCount=h.touches.length;const T=h.touches[0],C=h.touches[1];i=Math.max(10,Math.hypot(C.clientX-T.clientX,C.clientY-T.clientY));const f=n.getBoundingClientRect();d=(T.clientX+C.clientX)*.5-f.left,c=(T.clientY+C.clientY)*.5-f.top}},{passive:!0}),n.addEventListener("touchmove",h=>{if(h.touches.length<2)return;h.preventDefault(),u=!0;const T=h.touches[0],C=h.touches[1],f=Math.max(10,Math.hypot(C.clientX-T.clientX,C.clientY-T.clientY)),k=n.getBoundingClientRect(),$=(T.clientX+C.clientX)*.5-k.left,L=(T.clientY+C.clientY)*.5-k.top;if(i>0){const w=this.getState(a),E=w.zoom,M=E*(f/i),R=M<=1.015?1:at(M),G=n.scrollLeft,q=n.scrollTop;w.zoom=R,r();const F=w.zoom/Math.max(.25,E);n.scrollLeft=Math.max(0,(G+d)*F-$),n.scrollTop=Math.max(0,(q+c)*F-L)}i=f,d=$,c=L},{passive:!1});const p=h=>{if(this.activePinchCount=h.touches.length,h.touches.length<2)i>0&&(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now()),i=0;else{const T=h.touches[0],C=h.touches[1];i=Math.max(10,Math.hypot(C.clientX-T.clientX,C.clientY-T.clientY));const f=n.getBoundingClientRect();d=(T.clientX+C.clientX)*.5-f.left,c=(T.clientY+C.clientY)*.5-f.top}};n.addEventListener("touchend",p,{passive:!0}),n.addEventListener("touchcancel",p,{passive:!0});const g=new Map;let m=0;n.addEventListener("pointerdown",h=>{if(!(h.pointerType!=="touch"||u)&&(g.set(h.pointerId,{x:h.clientX,y:h.clientY}),g.size>=2)){const T=Array.from(g.values());m=Math.max(10,Math.hypot(T[1].x-T[0].x,T[1].y-T[0].y))}},{passive:!0}),n.addEventListener("pointermove",h=>{if(!(h.pointerType!=="touch"||u||!g.has(h.pointerId))&&(g.set(h.pointerId,{x:h.clientX,y:h.clientY}),g.size>=2&&m>0)){const T=Array.from(g.values()),C=Math.max(10,Math.hypot(T[1].x-T[0].x,T[1].y-T[0].y)),f=this.getState(a),k=f.zoom*(C/m);f.zoom=k<=1.015?1:at(k),m=C,r(),h.preventDefault()}},{passive:!1});const b=h=>{g.delete(h.pointerId),g.size<2&&(m=0)};n.addEventListener("pointerup",b,{passive:!0}),n.addEventListener("pointercancel",b,{passive:!0}),r()}}const Re=new Ra;function te(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const xn=["en","ko","zh","es","ja"],Tn=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class za{constructor(t,n,o,s,a){S(this,"root");S(this,"sim");S(this,"onRefreshHud");S(this,"onToast");S(this,"onEquipAndSow");S(this,"targetCropId","ottery_wheat");S(this,"pendingPlotUid",null);S(this,"challenge",null);S(this,"answeredOutcome",null);S(this,"selectedChoiceIdx",null);S(this,"placedTokenIndices",[]);S(this,"selectedLeftPairId",null);S(this,"matchedPairIds",new Set);S(this,"flashWrongPairKey",null);S(this,"pairMistakes",0);S(this,"cropFilter","all");S(this,"activeSubView","practice");S(this,"codexQuery","");S(this,"codexBoxFilter","all");S(this,"sessionShownQids",new Set);S(this,"skipFormatOffset",0);S(this,"starterChallengePendingPack",!1);S(this,"dialogCloseBound",!1);S(this,"onOpenLeaderboard");if(this.root=t,this.sim=n,this.onRefreshHud=o,this.onToast=s,this.onEquipAndSow=a,typeof window<"u"){const r=()=>{if(!this.isOpen())return;const l=this.getDialog(),i=typeof l?.querySelector=="function"?l.querySelector(".sq-modal-inner"):null;Re.applyDialogOrientation(l,i,!0),this.syncSeedQuizViewportTransform()};window.addEventListener("resize",r),window.visualViewport?.addEventListener("resize",r),window.addEventListener("keydown",l=>{if(!this.isOpen())return;const i=l.target?.tagName;i==="INPUT"||i==="TEXTAREA"||i==="SELECT"||(l.key==="+"||l.key==="="?(l.preventDefault(),Re.stepZoom("seedquiz",hs),this.syncSeedQuizViewportTransform()):l.key==="-"||l.key==="_"?(l.preventDefault(),Re.stepZoom("seedquiz",-hs),this.syncSeedQuizViewportTransform()):l.key==="0"&&(l.ctrlKey||l.metaKey)&&(l.preventDefault(),Re.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))})}}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=t.querySelector("#sqScrollViewport"),o=t.querySelector("#sqZoomSizer"),s=t.querySelector("#sqZoomStage");Re.applyDomScrollStageTransform(n,o,s),Re.syncToolbarDOM(t,"seedquiz")}open(t,n,o,s,a,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(we).filter(u=>this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel);if(t&&we[t]){const u=we[t];this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!we[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=n??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const i=this.sim.ensureLanguageQuiz();let d=!this.challenge||this.answeredOutcome!==null;o&&xn.includes(o)&&i.activeLang!==o&&(i.activeLang=o,d=!0),s&&(s==="beginner"||s==="intermediate"||s==="advanced")&&(ss(i,i.activeLang,s),d=!0),a&&Tn.includes(a)&&(i.preferredFormat=a,d=!0),d||this.challenge?.lang!==i.activeLang?(this.challenge&&!this.answeredOutcome&&ft(i,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(i.activeLang,!1),this.render());const c=this.root.querySelector("#seedQuizDialog");c&&!c.open&&c.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const n=this.sessionShownQids.values().next().value;if(n===void 0)break;this.sessionShownQids.delete(n)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,n=!1){ln(t)||$i(t).then(o=>{const s=this.sim.ensureLanguageQuiz();if(s.activeLang===t){if(o){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=is(s,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),n&&s.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Me(a,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),n&&s.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Me(a,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const n=this.sim.ensureLanguageQuiz(),o=ln(n.activeLang);this.challenge=is(n,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),o?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(n.activeLang,t)),this.sim.saveToStorage(),this.render();const s=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(s&&(s.scrollTop=0),o&&t&&n.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Me(a,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const n=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=n,this.sim.ensureLanguageQuiz().autoSpeak&&Me(this.challenge.fullSentence,this.challenge.lang,.95);const s=we[this.targetCropId];if(n.correct){const a=n.tierAutoPromoted?` • Thăng hạng ${mt[this.challenge.lang].tierLabels[n.tierAutoPromoted]}!`:"",r=n.phoenixTalismanAwarded?` • 🔥 +${n.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=n.buildReduction&&n.buildReduction.reducedSec>0?` • 🔨 -${xe(n.buildReduction.reducedSec)} xây ${n.buildReduction.targetName??"công trình"}!`:"",i=n.leaderboardRankUp&&n.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${n.leaderboardRankUp.newRank} (+${n.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${n.seedsAwarded} hạt ${s.emoji} ${s.name} (Túi: ${n.newSeedCount} hạt)${l}${a}${r}${i}`,n.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const n=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,n)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=this.getDialog(),o=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;n&&typeof n.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,n.addEventListener("close",()=>{Re.clearDialogOrientation(n,o)})),Re.applyDialogOrientation(n,o,!0);const s=t.querySelector("#sqScrollViewport"),a=s?s.scrollTop:0,r=s?s.scrollLeft:0,l=this.sim.ensureLanguageQuiz(),i=l.activeLang,d=mt[i],c=l.profiles[i],u=we[this.targetCropId],p=this.sim.getSeedCount(this.targetCropId),g=this.sim.getFarmItemCount(this.targetCropId),m=this.sim.state.galleons,b=u.seedCost,h=u.seedCost*3,T=m>=b,C=m>=h,f=Vi(c,this.sim.state.level),k=c.totalAnswered>0?Math.round(c.totalCorrect/c.totalAnswered*100):100,$=_i(c),L=Ci(i),w=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),E=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let M="";if(this.pendingPlotUid){const P=this.sim.state.buildings.find(H=>H.uid===this.pendingPlotUid);P&&re(P.itemId)?.isFarmlandPlot&&!P.cropId&&(M=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${P.gx}, ${P.gy}]</strong></span>
            ${p>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${p})</button>`:""}
          </div>
        `)}const R=Object.values(we).sort((P,H)=>P.unlockLevel-H.unlockLevel||P.growSec-H.growSec),G=R.filter(P=>P.isFlowerCrop).length,q=R.length-G,F=R.filter(P=>this.cropFilter==="flowers"?!!P.isFlowerCrop:this.cropFilter==="crops"?!P.isFlowerCrop:!0),V=[{id:"all",label:`🌱 (${R.length})`},{id:"flowers",label:`🌸 Hoa (${G})`},{id:"crops",label:`🌾 Cây (${q})`}].map(P=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===P.id?"active":""}"
            data-sq-crop-filter="${P.id}"
            aria-pressed="${this.cropFilter===P.id}"
          >${P.label}</button>
        `).join(""),Z=F.map(P=>{const H=!this.sim.state.sandboxMode&&this.sim.state.level<P.unlockLevel,U=P.id===this.targetCropId,se=this.sim.getSeedCount(P.id),K=xe(P.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${U?"active":""} ${H?"locked":""}"
            data-sq-crop="${P.id}"
            aria-pressed="${U}"
            ${H?"disabled":""}
            title="${H?`Lv.${P.unlockLevel} (⏱️ ${K})`:`${P.name} • ⏱️ ${K} • 🪙 ${P.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${Ct(P.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${te(P.name)}</span>
              <span class="sq-crop-pill-sub">
                ${H?`🔒 Lv.${P.unlockLevel}`:`🌱 ${se} • ⏱️${K}`}
              </span>
            </span>
          </button>
        `}).join(""),J=xn.map(P=>{const H=mt[P],U=l.profiles[P],se=P===i,K=U.tier==="beginner"?"Tập Sự":U.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${se?"active":""}"
          data-sq-lang="${P}"
          aria-pressed="${se}"
          title="${H.flag} ${te(H.academyVi)} — ${te(H.tierLabels[U.tier])}"
        >
          <span class="sq-lang-flag">${H.flag}</span>
          <span class="sq-lang-text">
            <strong>${te(H.nameVi)}</strong>
            <small>${te(K)} • Lv.${U.masteryScore}</small>
          </span>
        </button>
      `}).join(""),Q=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(P=>{const H=c.tier===P.id;return`
          <button
            type="button"
            class="sq-tier-btn ${H?"active":""}"
            data-sq-tier="${P.id}"
            aria-pressed="${H}"
          >
            <span>${P.icon} ${te(d.tierLabels[P.id])}</span>
            <small>${P.rewardTag}</small>
          </button>
        `}).join(""),O=Tn.map(P=>{const H=Yn[P],U=l.preferredFormat===P;return`
        <button
          type="button"
          class="sq-format-chip ${U?"active":""}"
          data-sq-format="${P}"
          aria-pressed="${U}"
        >
          ${H.icon} ${te(H.labelVi)}
        </button>
      `}).join(""),A=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
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
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${V}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${m.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${te(u.name)}">
                🌱 ${te(u.name)}: <strong>×${p}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${E}/8 câu)">
                🔥 <strong>${w}</strong> <small>(${E}/8)</small>
              </span>
              ${(()=>{const P=Date.now(),H=this.sim.getActiveConstructions(P);if(H.length===0)return"";const U=H[0],se=re(U.itemId),K=Math.max(1,Math.ceil((U.constructEndsAt-P)/1e3)),pe=this.sim.getBuildingMinFloorSec(U),me=K<=pe;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${te(se?.name??"Đang xây")}: <strong>${xe(K)}</strong> <small>${me?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${Z}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${Ct(u.id)}" alt="${te(u.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${te(u.name)}</h3>
                <p>⏱️ <strong>${xe(u.growSec)}</strong> • 🌾 <strong>+${u.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${g}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${b.toLocaleString("vi-VN")}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${T?"":"disabled"}
              >
                🪙 +1 Hạt (-${b.toLocaleString("vi-VN")}G)
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
                🌱 <strong>${te(u.name)}</strong>: <strong>×${p}</strong>
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
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${J}</div>

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
                📖 Từ Điển (${$.masteredCount}/${L.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(i,c):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${Q}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${c.masteryScore}/100 (Quyển ${f}/10)">
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
                          class="sq-stat-pill sq-stat-pill-btn ${$.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${$.masteredCount}</strong> • 🔄 <strong>${$.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${O}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${A}
                `}
          </section>
        </div>
      </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(t);const N=t.querySelector("#sqScrollViewport");N&&(a>0||r>0)&&(N.scrollTop=a,N.scrollLeft=r)}getLexiconEntrySrsInfo(t,n){const o=t.srsBoxes??{};let s=0,a=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const l=o[`${r}${n}`];l&&(l.box>s&&(s=l.box),l.box<5&&l.dueAtTurn<=t.totalAnswered&&(a=!0))}return{box:s,due:a}}getLanguageLexiconEntries(t){return cn.filter(n=>n.lang===t).sort((n,o)=>n.levelBand-o.levelBand||n.id.localeCompare(o.id))}renderLexiconCodexPanel(t,n){const o=mt[t],s=this.getLanguageLexiconEntries(t);let a=0,r=0,l=0;for(const d of s){const{box:c}=this.getLexiconEntrySrsInfo(n,d.id);c>=5?a+=1:c>=1?r+=1:l+=1}const i=[{id:"all",label:`📖 Tất cả (${s.length})`},{id:"mastered",label:`🏆 Thuộc (${a})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(d=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===d.id?"active":""}"
            data-sq-codex-filter="${d.id}"
            aria-pressed="${this.codexBoxFilter===d.id}"
          >${d.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${o.flag} ${te(o.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${ln(t)?`✅ ${s.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${te(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${i}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,n,s)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,n,o){const s=o??this.getLanguageLexiconEntries(t),a=this.codexQuery.trim().toLowerCase(),r=s.filter(i=>{const{box:d}=this.getLexiconEntrySrsInfo(n,i.id);return this.codexBoxFilter==="mastered"&&d<5||this.codexBoxFilter==="learning"&&(d<1||d>=5)||this.codexBoxFilter==="unseen"&&d>0?!1:a?i.word.toLowerCase().includes(a)||i.phonetic.toLowerCase().includes(a)||i.meaningVi.toLowerCase().includes(a)||i.exampleSentence.toLowerCase().includes(a)||i.exampleVi.toLowerCase().includes(a):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(i=>{const{box:d,due:c}=this.getLexiconEntrySrsInfo(n,i.id),u=as(i.meaningVi,i.word,i.id);let p="is-unseen",g=`✨ Quyển ${i.levelBand}`;return d>=5?(p="is-box5",g="🏆 Hộp 5/5 • Thuộc"):d>=1&&(p=c?"is-due":"is-learning",g=`📦 Hộp ${d}/5${c?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${u.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${te(i.id)}"
                title="Nghe phát âm từ ${te(i.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${te(i.word)}</strong>
                <span class="sq-vocab-ph">[${te(i.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${te(u.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${p}">${g}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${s.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,n){t.querySelectorAll("[data-sq-codex-word]").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.sqCodexWord??"",a=cn.find(r=>r.id===s);a&&Me(a.word,n,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.sqCodexEx??"",a=cn.find(r=>r.id===s);a&&Me(a.exampleSentence,n,.95)})})}renderChallengeStage(t){const n=mt[t.lang],o=Yn[t.format],s=we[this.targetCropId],a=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",i=t.heroWord??t.stemText,d=t.heroPhonetic??t.stemPhonetic??"",c=t.heroShortVi??un(t.translationVi);let u="";r==="pic_flashcard"?u=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${te(i)}</div>
            ${d?`<div class="sq-kid-ph-pill">[${te(d)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(u=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${te(c)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${te(c)}</div>
            ${d?`<div class="sq-kid-ph-pill">🔊 [${te(d)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let p="";if(r==="pic_flashcard"||r==="word_flashcard"){const m=t.choices??[],b=t.choicePhonetics??[],h=t.choiceSprites??[],T=t.choiceSubtitles??[];p=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${m.map((C,f)=>{let k="";a&&(f===t.correctIndex?k="is-correct":f===this.selectedChoiceIdx?k="is-wrong":k="is-dimmed");const $=h[f]??l,L=T[f]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${k}"
                  data-sq-choice="${f}"
                  ${a?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${$}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${te(C)}</span>
                    ${r==="word_flashcard"&&b[f]?`<small class="sq-choice-ph">[${te(b[f])}]</small>`:a&&L?`<small class="sq-choice-ph">${te(L)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const m=t.choices??[],b=t.choicePhonetics??[],h=t.choiceSprites??[];p=`
        <div class="sq-bubble-arena">
          ${m.map((T,C)=>{let f="";a&&(C===t.correctIndex?f="is-correct is-popped":C===this.selectedChoiceIdx?f="is-wrong is-popped":f="is-dimmed");const k=h[C]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${C%4} ${f}"
                  data-sq-choice="${C}"
                  ${a?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${k}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${te(T)}</span>
                  ${b[C]?`<small class="sq-bubble-ph">[${te(b[C])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const m=t.shuffledTokens??[],b=t.expectedSentenceTokens??[],h=new Set(this.placedTokenIndices),T=b.map((f,k)=>{const $=this.placedTokenIndices[k],L=$!==void 0?m.find(w=>w.idx===$):void 0;return L?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${k}"
                ${a?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${te(L.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),C=m.map(f=>{const k=h.has(f.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${k?"used":""}"
              data-sq-place="${f.idx}"
              ${k||a?"disabled":""}
            >
              ${te(f.text)}
            </button>
          `}).join("");p=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${T}
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
      `}else if(t.format==="match_pairs"){const m=t.leftCards??[],b=t.rightCards??[];p=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${n.flag} 🔊 Thẻ Từ</div>
            ${m.map(h=>{const T=this.matchedPairIds.has(h.pairId),C=this.selectedLeftPairId===h.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${T?"matched":""} ${C?"selected":""}"
                    data-sq-left-pair="${te(h.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${te(h.word)}</span>
                    <small class="sq-pair-ph">[${te(h.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${b.map(h=>{const T=this.matchedPairIds.has(h.pairId),C=this.flashWrongPairKey===h.pairId,f=h.spriteSrc??as(h.meaningVi,h.word,h.pairId).spriteSrc,k=h.shortVi??un(h.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${T?"matched":""} ${C?"wrong-flash":""}"
                    data-sq-right-pair="${te(h.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <img src="${f}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${te(k)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const g=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${o.icon} ${te(o.labelVi)}</span>
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

        ${u}
        ${p}
        ${g}
      </div>
    `}renderVietnameseExplanationCard(t,n){const o=this.sim.getSeedCount(this.targetCropId),s=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",a=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??un(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${n.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${s}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${n.correct?`🎉 <strong>Giỏi lắm!</strong> +${n.seedsAwarded} 🌱 ${te(n.cropName)} • +${n.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${n.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${te(a)}</strong>
              <span class="sq-vocab-ph">[${te(r)}]</span>
              <span>= 🇻🇳 <strong>${te(l)}</strong></span>
            </div>
            ${n.buildReduction&&n.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${xe(n.buildReduction.reducedSec)} (${te(n.buildReduction.targetName??"công trình")})</div>`:""}
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
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCropFilter;(c==="all"||c==="flowers"||c==="crops")&&(this.cropFilter=c,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCrop;c&&we[c]&&(this.targetCropId=c,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const d=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(d.msg,d.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const d=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(d.msg,d.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const n=t.querySelector("#chkSqAutoSpeak");n?.addEventListener("change",()=>{const d=this.sim.ensureLanguageQuiz();d.autoSpeak=n.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqLang,u=this.sim.ensureLanguageQuiz();c&&xn.includes(c)&&u.activeLang!==c&&(this.challenge&&!this.answeredOutcome&&ft(u,this.challenge),u.activeLang=c,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(c,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqSubview;if((c==="practice"||c==="codex")&&this.activeSubView!==c){if(this.activeSubView=c,c==="codex"){const u=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(u.activeLang)}this.render()}})});const o=t.querySelector("#inpSqCodexSearch");o&&o.addEventListener("input",()=>{this.codexQuery=o.value;const d=t.querySelector("#sqCodexResultsMount");if(d){const c=this.sim.ensureLanguageQuiz(),u=c.activeLang;d.innerHTML=this.renderLexiconCodexRowsHtml(u,c.profiles[u]),this.bindCodexRowSpeakEvents(d,u)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqCodexFilter;(c==="all"||c==="mastered"||c==="learning"||c==="unseen")&&(this.codexBoxFilter=c,this.render())})});const s=t.querySelector("#sqCodexResultsMount");if(s){const d=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(s,d.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqTier,u=this.sim.ensureLanguageQuiz();(c==="beginner"||c==="intermediate"||c==="advanced")&&(this.challenge&&!this.answeredOutcome&&ft(u,this.challenge),ss(u,u.activeLang,c),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sqFormat,u=this.sim.ensureLanguageQuiz();Tn.includes(c)&&u.preferredFormat!==c&&(this.challenge&&!this.answeredOutcome&&ft(u,this.challenge),u.preferredFormat=c,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Me(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const d=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Me(d,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const d=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Me(d,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Me(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Me(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge)return;const c=Number(d.dataset.sqSpeakWord??-1),u=this.challenge.vocabNotes[c];u&&Me(u.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const d=this.sim.ensureLanguageQuiz();ft(d,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqChoice??-1);this.selectedChoiceIdx=c;const u=c===(this.challenge.correctIndex??0);u?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(u)})});const a=()=>{if(!this.challenge||this.answeredOutcome)return!1;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<d.length)return!1;const u=this.placedTokenIndices.map(g=>c.find(m=>m.idx===g)?.text??""),p=u.length===d.length&&u.every((g,m)=>g===d[m]);return p?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(p),!0};t.querySelectorAll("[data-sq-place]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqPlace??-1);if(c>=0&&!this.placedTokenIndices.includes(c)){this.placedTokenIndices.push(c),this.sim.audio.playMatchPop(1);const u=this.challenge.shuffledTokens?.find(g=>g.idx===c),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Me(u.text,this.challenge.lang,.95),a()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=Number(d.dataset.sqUnplace??-1);c>=0&&c<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(c,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const p=this.placedTokenIndices.length-1;if(c.find(m=>m.idx===this.placedTokenIndices[p])?.text===d[p])break;this.placedTokenIndices.pop()}const u=this.placedTokenIndices.length;if(u<d.length){const p=d[u],g=c.find(m=>m.text===p&&!this.placedTokenIndices.includes(m.idx));g&&(this.placedTokenIndices.push(g.idx),this.sim.audio.playMatchPop(1),a()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=this.challenge.expectedSentenceTokens??[],c=this.challenge.shuffledTokens??[],u=this.placedTokenIndices.map(g=>c.find(m=>m.idx===g)?.text??""),p=u.length===d.length&&u.every((g,m)=>g===d[m]);this.submitAttempt(p)}),t.querySelectorAll("[data-sq-left-pair]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=d.dataset.sqLeftPair??"";if(!c||this.matchedPairIds.has(c))return;this.selectedLeftPairId=c,this.flashWrongPairKey=null,this.sim.audio.playClick();const u=this.challenge.leftCards?.find(g=>g.pairId===c),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Me(u.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(d=>{d.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=d.dataset.sqRightPair??"";if(!(!c||this.matchedPairIds.has(c))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===c){this.matchedPairIds.add(c),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const u=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=u){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=c,this.sim.audio.playClick(),this.render()}})});const r=t.querySelector("#sqScrollViewport"),l=t.querySelector("#sqZoomSizer"),i=t.querySelector("#sqZoomStage");Re.bindDomScrollStageInteractions({rootScope:t,scrollViewportEl:r,sizerEl:l,contentStageEl:i,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}function x(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ut=["path","shop","creature","decor","staff"],$t=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function Fa(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function Ga(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},n=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.switchMinigame;e.closeHudPopovers(),!g||g==="match3"?e.openMatch3Dialog():g==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(g)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",n),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",n),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",n),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",n),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",n);const o=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"||p==="jigsaw"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",o),e.root.querySelector("#btnPlusSand")?.addEventListener("click",o),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const s=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",s),e.root.querySelector("#chipHudBarn")?.addEventListener("click",s),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=window.innerWidth>680;const g=e.selectedCatalogItem?.category;e.activeCategory=g&&Ut.includes(g)?g:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const g=p[0],m=re(g.itemId);fe(e.cam,g.gx+(m?.width??1)*.5,g.gy+(m?.height??1)*.5),e.inspectSelection={kind:"building",uid:g.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const a=e.root.querySelector("#btnHudRoundOrb");if(a){let p=null,g=0,m=0,b=0,h=0,T=!1;a.addEventListener("pointerdown",f=>{if(f.button!==0&&f.pointerType==="mouse")return;const k=a.getBoundingClientRect();p=f.pointerId,g=f.clientX,m=f.clientY,b=k.left,h=k.top,T=!1;try{a.setPointerCapture(f.pointerId)}catch{}}),a.addEventListener("pointermove",f=>{if(p!==f.pointerId)return;const k=f.clientX-g,$=f.clientY-m;if(!T&&Math.hypot(k,$)>7&&(T=!0),T){const L=a.offsetWidth||52,w=a.offsetHeight||62,E=Math.max(6,Math.min(window.innerWidth-L-6,b+k)),M=Math.max(6,Math.min(window.innerHeight-w-6,h+$));a.style.left=`${Math.round(E)}px`,a.style.top=`${Math.round(M)}px`,a.style.right="auto",a.style.bottom="auto"}});const C=f=>{if(p===f.pointerId){p=null;try{a.hasPointerCapture(f.pointerId)&&a.releasePointerCapture(f.pointerId)}catch{}}};a.addEventListener("pointerup",C),a.addEventListener("pointercancel",C),a.addEventListener("click",f=>{if(T){f.preventDefault(),f.stopPropagation(),T=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()});const r=p=>{const g=e.root.querySelector("#buildDrawer");if(!g)return;const m=Math.max(180,Math.round(g.clientWidth*.68))*p,b=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;g.scrollBy({left:m,behavior:b?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{r(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{r(1)}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const g=p.target;if(!g)return;const m=e.root.querySelector("#managePopoverMenu"),b=e.root.querySelector("#weatherPopoverMenu"),h=e.root.querySelector("#btnToggleManageMenu"),T=e.root.querySelector("#lblClock");m?.contains(g)||b?.contains(g)||h?.contains(g)||T?.contains(g)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const l=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",l);const i=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",i),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",i),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const d=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",d),e.root.querySelector("#btnOpenZones")?.addEventListener("click",d),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",d),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=$t.findIndex(h=>h.mode===e.sim.heatmapMode),g=$t[(p+1)%$t.length];e.sim.heatmapMode=g.mode;const m=e.root.querySelector("#btnCycleHeatmap"),b=g.mode!=="none";m.textContent=g.label,m.setAttribute("data-active",String(b)),m.setAttribute("aria-pressed",String(b)),b&&e.showToast(`Đã bật ${g.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),g=document.createElement("a");g.href=p,g.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,g.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const m=p.currentTarget;m.textContent=e.questCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const g=p.currentTarget;g.textContent=e.minimapCollapsed?"+":"–",g.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(Nt(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${St[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=Ut.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const c=p=>{const g=e.minimapCanvas.getBoundingClientRect(),m=(p.clientX-g.left)/g.width*e.minimapCanvas.width,b=(p.clientY-g.top)/g.height*e.minimapCanvas.height,h=e.minimapCanvas.width*.46/It,T=e.minimapCanvas.height*.44/It,C=(m-e.minimapCanvas.width*.5)/h,f=(b-8)/T,k=(C+f)*.5,$=(f-C)*.5,{fgx:L,fgy:w}=Ui(k,$,e.cam.viewRot??0),E=Math.max(0,Math.min(It-1,L)),M=Math.max(0,Math.min(It-1,w));e.rideCamUid=null,fe(e.cam,E,M)};let u=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{u=!0,c(p)}),window.addEventListener("pointermove",p=>{u&&c(p)}),window.addEventListener("pointerup",()=>{u=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.cat;Ut.includes(g)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===g?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=g,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{Nt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${St[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(g=>g.itemId==="burrow_house_canon");p?fe(e.cam,p.gx+1.5,p.gy+1.5):fe(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")Nt(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${St[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")Nt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${St[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const g=e.sim.staff[0];g&&(e.pincerPicked={kind:"staff",id:g.id,label:g.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,fe(e.cam,16,18),e.refreshFloatingBanner())})}function Va(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const n=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!n),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),zn(e),Fn(e),nn(e),e.renderTutorialCoach()}function Gs(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function _a(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(dt(e),tt(e),e.closeSeedTray(),e.closePastureTray()),nn(e)}function nn(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const n=Gs(e),o=e.hudRolledUp&&!e.photoModeActive&&!n;t.classList.toggle("hud-building-focus",n),t.classList.toggle("hud-compact-rolled",o);const s=e.root.querySelector("#btnToggleHudRollup");s&&(s.setAttribute("aria-pressed",String(e.hudRolledUp)),s.dataset.active=String(e.hudRolledUp),s.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const a=e.root.querySelector("#svgHudRollupChevron");a&&a.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const l=e.root.querySelector("#btnHudRoundOrb");l&&(l.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||n),l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.rolled=String(e.hudRolledUp));const i=e.root.querySelector("#lblHudRoundOrbTag");i&&(i.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const d=e.root.querySelector("#svgRoundOrbChevron");d&&d.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),n&&(dt(e),tt(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function dt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const n=e.root.querySelector("#managePopoverMenu"),o=e.root.querySelector("#weatherPopoverMenu"),s=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");n?.classList.add("hidden"),o?.classList.add("hidden"),s&&(s.setAttribute("aria-expanded","false"),s.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function tt(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function Ua(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function ja(e){tt(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function On(e,t,n){if(!t||!n)return;const o=t.getBoundingClientRect(),s=Math.min(window.innerWidth-16,Math.max(248,n.offsetWidth||336)),a=Math.min(n.offsetHeight||420,window.innerHeight-16),r=o.left<window.innerWidth*.5?o.left:o.right-s,l=Math.max(8,Math.min(r,window.innerWidth-s-8)),i=Math.max(8,Math.min(o.bottom+8,window.innerHeight-a-8));n.style.left=`${Math.round(l)}px`,n.style.top=`${Math.round(i)}px`}function Wa(e,t){if(e.sim.isVisitingNeighbor){dt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const n=typeof t=="boolean"?t:!e.manageMenuOpen;if(dt(e),!n)return;e.manageMenuOpen=!0;const o=e.root.querySelector("#managePopoverMenu"),s=e.root.querySelector("#btnToggleManageMenu");o&&s&&(o.classList.remove("hidden"),s.setAttribute("aria-expanded","true"),s.setAttribute("data-active","true"),On(e,s,o)),e.renderTutorialCoach()}function Qa(e,t){const n=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(dt(e),!n)return;e.weatherPopoverOpen=!0;const o=e.root.querySelector("#weatherPopoverMenu"),s=e.root.querySelector("#lblClock");o&&s&&(Rn(e),o.classList.remove("hidden"),s.setAttribute("aria-expanded","true"),On(e,s,o)),e.renderTutorialCoach()}function Rn(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const n=Date.now(),o=e.sim.getCurrentWeather(n),s=e.sim.getWeatherForecast(4,n),a=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${a?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${o.icon} ${x(o.labelVi)}</div>
        <div class="weather-current-buff">✨ ${x(o.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${s.map((r,l)=>{const i=l===0?"Nay":`+${Pe(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${x(r.labelVi)}</span>
                <span class="weather-slot-meta">${x(i)}</span>
              </div>
            `}).join("")}
      </div>
    `}function Vs(e,t){const n=e.root.querySelector("#lblGalleons");if(!n)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),n.textContent="∞",e.displayedGalleons=t;return}const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||o||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,n.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const s=e.displayedGalleons,a=performance.now(),r=420,l=i=>{const d=Math.min(1,(i-a)/r),c=1-Math.pow(1-d,3),u=Math.round(s+(t-s)*c);e.displayedGalleons=u,n.textContent=u.toLocaleString("vi-VN"),d<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function Xa(e,t,n,o,s){const a=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!a||!r)return;const l=()=>{a.classList.remove("hud-chip-pulse"),a.offsetWidth,a.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const i=a.getBoundingClientRect();if(i.width<=0&&i.height<=0)return;const d=i.left+i.width*.5,c=i.top+i.height*.5,u=typeof o=="number"&&Number.isFinite(o)?Math.max(24,Math.min(window.innerWidth-24,o)):window.innerWidth*.5,p=typeof s=="number"&&Number.isFinite(s)?Math.max(24,Math.min(window.innerHeight-24,s)):window.innerHeight*.54,g={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},m=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(n))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,n)))));for(let b=0;b<m;b++){const h=document.createElement("div");h.className="fly-reward-token",h.dataset.kind=t,h.textContent=g[t],r.appendChild(h);const T=b/Math.max(1,m)*Math.PI*2+(Math.random()-.5)*.5,C=14+b%3*9,f=u+Math.cos(T)*C,k=p+Math.sin(T)*C*.7,$=(f+d)*.5+(b%2===0?-42:42),L=Math.min(k,c)-(48+b%3*18),w=560+b*48,E=b*52,M=h.animate([{transform:`translate3d(${f}px, ${k}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${f}px, ${k-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${$}px, ${L}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${d}px, ${c}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:w,delay:E,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});M.onfinish=()=>{h.remove(),l(),e.sim.audio.playFlyTick(b)}}}function Ka(e,t="🦉"){const n=e.trim();if(!n)return t.trim();const o=t.trim();if(!o)return n;const s=l=>l.replace(/\uFE0F/g,""),a=s(o);let r=n;for(;a&&s(r).startsWith(`${a} ${a}`);)r=r.slice(o.length).trimStart();return a&&s(r).startsWith(a)||o==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${o} ${r}`}function et(e,t,n="🦉"){const o=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!o)return;const s=Array.from(e.root.querySelectorAll("dialog[open]")),a=s.length>0?s[s.length-1]:null;a?o.parentElement!==a&&(a.appendChild(o),a.addEventListener("close",()=>{const l=Array.from(e.root.querySelectorAll("dialog[open]")),i=l.length>0?l[l.length-1]:e.root;o.parentElement!==i&&i.appendChild(o)},{once:!0})):o.parentElement!==e.root&&e.root.appendChild(o);const r=document.createElement("div");r.className="parchment-dark owl-toast",r.textContent=Ka(t,n),o.appendChild(r),window.setTimeout(()=>r.remove(),3500)}function Ya(e,t){const n=Math.max(1,Math.round(t.awaySeconds/60)),o=e.root.querySelector("#offlineDialogContent");o.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${n} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function zn(e){const t=e.root.querySelector("#floatingModeBanner"),n=e.root.querySelector("#floatingBannerText"),o=e.root.querySelector("#btnFloatingSecondary"),s=e.root.querySelector("#btnFloatingSwap"),a=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!n||!o||!s||!a)){if(s.classList.add("hidden"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const r=e.sim.state.buildings.find(i=>i.uid===e.rideCamUid),l=r?re(r.itemId):void 0;if(!r||!l)e.rideCamUid=null;else{t.classList.remove("hidden"),n.textContent=`🎥 ${l.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,o.textContent="🧭 90°",o.classList.remove("hidden"),a.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),n.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Nhấp ô để thả`:"🤏 Điều phối nhân sự (G) — Nhấp ô cử tới • G/Esc thoát",o.classList.add("hidden"),a.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const r=e.sim.state.buildings.find(i=>i.uid===e.movingBuildingUid),l=r?re(r.itemId):void 0;n.textContent=`✋ ${l?.name??"Dời chỗ"}`,o.textContent=`🔄 ${e.rotation*90}°`,o.classList.remove("hidden"),a.textContent="✕"}else n.textContent="✋ Chọn công trình để dời",o.classList.add("hidden"),a.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),n.textContent="🧹 Phá dỡ",o.classList.add("hidden"),a.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const r=e.selectedCatalogItem,l=r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence,i=e.sim.getEffectiveItemStarCost(r),d=i>0?`🌟 ${i}`:r.cost===0?"0G":`${r.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),n.textContent=`🏗️ ${r.name} • ${d}`,l?(o.textContent=`🔄 ${e.rotation*90}°`,o.classList.remove("hidden")):o.classList.add("hidden"),s.textContent="📦 Đổi",s.classList.remove("hidden"),a.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const r=we[e.activeSeedCropId],l=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),n.textContent=`🌱 ${r.emoji} ${r.name} (${l})`,o.textContent="🌱 Đổi",o.classList.remove("hidden"),a.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const r=Je[e.activePastureAnimalId];t.classList.remove("hidden"),n.textContent=`🐾 ${r.emoji} ${r.name} (${r.cost.toLocaleString("vi-VN")}G)`,o.textContent="🐾 Đổi",o.classList.remove("hidden"),a.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),n.textContent="👁️ Nhìn xuyên",o.classList.add("hidden"),a.textContent="✕";return}t.classList.add("hidden")}}function Fn(e){const t=e.root.querySelector("#touchConfirmBar"),n=e.root.querySelector("#lblTouchConfirm");if(!(!t||!n)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),n.textContent=`📍 ${e.pendingTouchTile.label}`}}function Zt(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),_s(e),js(e),Ws(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),zn(e),Fn(e),nn(e),e.renderTutorialCoach()}function kn(e){const t=new Date,n=String(t.getHours()).padStart(2,"0"),o=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const s=e.sim.getCurrentWeather(t.getTime()),a=e.root.querySelector("#lblClock");if(a){const p=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";a.innerHTML=`${s.icon} <span>${n}:${o}</span>${p}`}e.weatherPopoverOpen&&Rn(e);const r=e.sim.getActiveFestival(t),l=e.root.querySelector("#lblFestival");l&&(r==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):r==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(l.classList.remove("hidden"),l.textContent="🏆 +Cúp"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const i=e.sim.state,d=e.root.querySelector("#lblPuzzleHearts");if(d&&i.match3)if(i.sandboxMode)d.textContent="∞";else if(i.match3.hearts>=Xt)d.textContent=`${i.match3.hearts}/${Xt}`;else{const p=Math.max(0,Math.ceil((i.match3.nextHeartAt-Date.now())/1e3)),g=Math.floor(p/60),m=String(p%60).padStart(2,"0");d.textContent=`${i.match3.hearts} (${g}:${m})`}const c=e.root.querySelector("#btnHudActiveBuilds"),u=e.root.querySelector("#lblActiveBuilds");if(c&&u){const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)c.classList.add("hidden");else{c.classList.remove("hidden");const g=Math.max(1,Math.ceil((p[0].constructEndsAt-Date.now())/1e3));u.textContent=`${p.length} (${Pe(g)})`}}}function _s(e){const t=e.sim.state,n=e.sim.getRequiredLevelTrial(),o=Math.max(0,t.xp)%vt,s=Math.max(6,Math.min(100,o/vt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+As(t.level),e.root.querySelector("#barXpFill").style.width=`${s}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const j=e.sim.getActiveVisitingNeighbor();r.textContent=j?`🚂 Thăm: ${j.avatarEmoji} ${j.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getTotalTowerClearedStages(),d=t.level>=Ue?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),c=e.root.querySelector("#btnOpenRoadmap");c&&(c.style.setProperty("--hg-lvl-pct",String(d)),c.title=t.level>=Ue?`👑 Cấp Tối Đa ${Ue} • Rương XP: ${o}/${vt} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${o}/${vt}`);const u=e.root.querySelector("#barLevelTopFill");u&&(u.style.width=`${d}%`,u.parentElement&&(u.parentElement.title=t.level>=Ue?`👑 Đã đạt Cấp Tối Đa ${Ue} • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 6 Môn: ${i.cleared.toLocaleString("vi-VN")}/${i.total.toLocaleString("vi-VN")} Màn`));const p=e.root.querySelector("#lblXpFraction");p&&(p.textContent=`🎁 ${o}/${vt}`);const g=e.sim.ensureFarmBarn(),m=e.sim.getBarnTotalUsed(),b=e.root.querySelector("#lblStorageBarn");b&&(b.textContent=`${m}/${g.capacity}`),Vs(e,t.galleons);const h=t.sandboxMode?"∞":String(t.match3?.stars??0),T=e.root.querySelector("#lblPuzzleStars");T&&t.match3&&(T.textContent=h);const C=e.root.querySelector("#lblHudHubStars");C&&(C.textContent=h);const f=e.root.querySelector("#lblHudHubTrial");f&&(t.level>=Ue||t.sandboxMode||e.sim.isHeadmasterPreview||!n?f.textContent=`♟️ ${i.cleared}/${i.total}`:f.textContent=`🔥 ${n.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const k=e.sim.getDisciplineStageInfo("match3"),$=e.sim.getLastPlayedMinigame();let L="🍬 Bùa Gặt",w="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",E=k.isMaxed?`👑 ${De}`:`Màn ${k.currentStage}`;if($==="caro"){const j=e.sim.getDisciplineStageInfo("caro");L="🗺️ Ngũ Ấn",w="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=j.isMaxed?`👑 ${De}`:`Màn ${j.currentStage}`}else if($==="sudoku"){const j=e.sim.getDisciplineStageInfo("sudoku");L="🔢 Số Học",w="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",E=j.isMaxed?`👑 ${De}`:`Màn ${j.currentStage}`}else if($==="blocks"){const j=e.sim.getDisciplineStageInfo("blocks");L="🦄 Sinh Vật",w="/trang-trai-hang-soc/sprites/beast_niffler.png",E=j.isMaxed?`👑 ${De}`:`Màn ${j.currentStage}`}else if($==="chess"){const j=e.sim.getDisciplineStageInfo("chess");L="🏰 Cờ Phù Thủy",w="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=j.isMaxed?`👑 ${De}`:`Màn ${j.currentStage}`}else if($==="jigsaw"){const j=e.sim.getDisciplineStageInfo("jigsaw");L="🧩 Tranh Ghép",w="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",E=j.isMaxed?`👑 ${De}`:`Màn ${j.currentStage}`}else $==="seedquiz"&&(L="🪄 Thần Chú",w="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",E="Ôn Tập");const M=e.root.querySelector("#imgCornerPlayIcon");M&&M.getAttribute("src")!==w&&M.setAttribute("src",w);const R=e.root.querySelector("#badgeCornerPlayBonus");R&&(R.textContent=L,R.classList.remove("hidden"));const G=e.root.querySelector("#lblCornerPlayStage");G&&(G.textContent=E);const q=e.root.querySelector("#lblCornerPlaySub");q&&(q.textContent=t.level>=Ue?`👑 Cấp ${Ue}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const F=e.root.querySelector("#btnCornerPlayPuzzle");if(F){const j=`Chơi tiếp ${L} — ${E}`;F.title=j,F.setAttribute("aria-label",j)}e.root.querySelectorAll("[data-switch-minigame]").forEach(j=>{const ye=j.dataset.switchMinigame===$;j.dataset.active=String(ye),j.setAttribute("aria-pressed",String(ye))});const V=e.root.querySelector("#badgeBuildReadyCount");if(V){const j=new Set(t.buildings.map(Ge=>Ge.itemId)),ye=t.sandboxMode?999:t.match3?.stars??0,Le=Es.filter(Ge=>{if(Ge.isThemeParkLegacy)return!1;const nt=ki(Ge);return nt<=0||!t.sandboxMode&&t.level<Ge.unlockLevel?!1:!j.has(Ge.id)&&ye>=nt}).length;Le>0&&!e.sim.isHeadmasterPreview?(V.textContent=String(Le),V.classList.remove("hidden")):V.classList.add("hidden")}const Z=e.root.querySelector("#lblMatch3Lv");Z&&t.match3&&(Z.textContent=k.isMaxed?`👑${De}`:`${k.currentStage}/${De}`);const J=e.root.querySelector("#lblArcadeTowerLv");if(J){const j=Math.max(0,i.cleared-k.clearedStages),ye=De*5;J.textContent=j>=ye?`👑${ye}`:`${j}/${ye}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const ce=e.sim.getActiveStoryQuest(),Q=e.sim.getReadyOwlOrdersCount(),O=(ce?.completed?1:0)+t.owlQuests.filter(j=>j.completed&&!j.claimed).length+t.dailyQuests.filter(j=>j.completed&&!j.claimed).length,A=Q+O,N=A>0?A:g.owlOrders.length,P=e.root.querySelector("#badgeQuestCount");N>0?(P.textContent=String(N),P.classList.toggle("is-ready-green",Q>0),P.classList.remove("hidden")):P.classList.add("hidden");const H=t.supply.cargoCrates.filter(j=>!j.fulfilled&&(t.sandboxMode||(t.supply.goods[j.goodId]??0)>=j.qtyRequired)).length,U=e.root.querySelector("#badgeWorkshopCount");U&&(H>0?(U.textContent=String(H),U.classList.remove("hidden")):U.classList.add("hidden"));const K=Object.values(t.housePoints).reduce((j,ye)=>j+ye,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!K),e.refreshSuitcaseBadge();const me=e.root.querySelector("#badgeSuitcaseCount"),le=me&&!me.classList.contains("hidden")?Math.max(0,Number.parseInt(me.textContent||"0",10)||0):0,he=e.sim.getClaimableHarvestFeastCount(),ie=e.root.querySelector("#badgeManageMenuDot");if(ie){const j=H+(K?1:0)+he+le;j>0?(ie.textContent=String(j),ie.classList.remove("hidden")):ie.classList.add("hidden")}Us(e),kn(e);const ve=e.root.querySelector("#btnCycleHeatmap");if(ve){const j=$t.find(Le=>Le.mode===e.sim.heatmapMode)??$t[0],ye=e.sim.heatmapMode!=="none";ve.textContent=j.label,ve.dataset.active=String(ye),ve.setAttribute("aria-pressed",String(ye))}kn(e)}function Us(e){const t=e.sim.state,n=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,o=t.buildings.some(a=>!!re(a.itemId)?.isCreatureHabitat),s=(t.match3?.hearts??Xt)>=Xt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",s),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",n&&!o),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",n&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const a=e.root.querySelector("#btnToggleMinimap");a&&(a.textContent="–",a.setAttribute("aria-expanded","true"))}}function js(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const n=e.sim.state,o=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const s=e.sim.getActiveStoryQuest(),a=n.owlQuests.slice(0,2);let r="";if(o&&!n.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),i=e.sim.getDisciplineStageInfo(o.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${o.icon} ${x(o.shortVi)} (${i.currentStage}/${De}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${o.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(s){const l=Math.min(100,Math.round(s.progress/Math.max(1,s.targetAmount)*100)),i=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${x(s.giverEmoji)} ${x(s.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(s.progress,s.targetAmount)}/${s.targetAmount}</span>
            ${s.completed?`<button type="button" data-claim="${x(s.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${s.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${x(i.longLabel)}">${x(i.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const l of a){const i=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${x(l.giverEmoji)} ${x(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${i}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${x(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const i=e.sim.completeStoryStepWithStar();if(i.ok){typeof i.placedGx=="number"&&typeof i.placedGy=="number"&&fe(e.cam,i.placedGx,i.placedGy);return}et(e,i.msg,i.reason==="missing_gold"?"🪙":"🌟"),(i.reason==="missing_stars"||i.reason==="locked_level"||i.reason==="open_match3")&&e.openTrialMinigame()})})}function Ws(e){const t=(b,h)=>{b&&(b.setAttribute("data-active",String(h)),b.setAttribute("aria-pressed",String(h)))};e.root.querySelectorAll("[data-cat]").forEach(b=>{t(b,b.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const n=e.root.querySelector("#btnRotateCam");if(n){const b=e.cam.viewRot??0;n.textContent=St[b],t(n,b!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const o=e.mapToolsExpanded,s=e.root.querySelector("#secondaryMapToolsBar"),a=e.root.querySelector("#btnToggleMapTools");s&&s.classList.toggle("hidden",!o),a&&(a.setAttribute("aria-expanded",String(o)),t(a,o));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),l);const d=e.root.querySelector("#buildDrawer"),c=e.root.querySelector("#buildDrawerSwipeBar"),u=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Ut.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,d.classList.add("hidden"),c?.classList.add("hidden"),u.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(d.classList.remove("hidden"),u.classList.add("hidden"),e.activeCategory==="staff"){Qs(e,d),vs(e,d);return}const p=Es.filter(b=>b.category===e.activeCategory&&b.category!=="terrain"&&!b.isThemeParkLegacy),g=e.sim.state.level,m=e.sim.state.sandboxMode;d.innerHTML=p.map(b=>{const h=!m&&g<b.unlockLevel,T=e.selectedCatalogItem?.id===b.id,C=b.elevationDelta?b.elevationDelta>0?"⛰️":"⛏️":b.isCoasterTrackPiece?"🛤️":b.isZooFence?"🚧":b.isBench?"🪑":b.category==="path"?"🛣️":b.category==="terrain"?"🌿":"🕯️",f=b.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${b.spriteKey}.png" alt="${b.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${C}</div>`,k=e.sim.getEffectiveItemStarCost(b),$=b.buildDurationSec>0?`🔨 ${xe(b.buildDurationSec)}`:"⚡",L=h?`🔒 Cấp ${b.unlockLevel}`:k>0?`🌟 ${k} • ${$}`:`🪙 ${b.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${h?"locked":""}"
            data-item-id="${b.id}"
            data-selected="${T}"
            aria-pressed="${T}"
            ${h?'aria-disabled="true"':""}
          >
            ${f}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${x(b.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${L}</div>
          </button>
        `}).join(""),d.querySelectorAll("[data-item-id]").forEach(b=>{b.addEventListener("click",()=>{const h=re(b.dataset.itemId);if(!h)return;if(!e.sim.state.sandboxMode&&e.sim.state.level<h.unlockLevel){const C=e.sim.getWinsProgressForCurrentLevel();let f=Math.max(1,C.required-C.current);for(let k=e.sim.state.level+1;k<h.unlockLevel;k++)f+=Mi(k);et(e,`🔒 Bản vẽ "${h.name}" mở ở Cấp Giải Đố ${h.unlockLevel} — Cần thắng thêm ${f.toLocaleString("vi-VN")} màn Giải Đố mới!`,"🧩"),e.openTrialMinigame();return}const T=e.sim.getEffectiveItemStarCost(h);if(!e.sim.state.sandboxMode&&T>0&&e.sim.state.match3.stars<T){const C=T-e.sim.state.match3.stars;et(e,`Cần thêm ${C} 🌟 Sao Phép Thuật (${e.sim.state.match3.stars}/${T} 🌟) để dựng "${h.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,"🌟"),e.openTrialMinigame();return}e.selectedCatalogItem=h,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,tt(e),Zt(e)})}),vs(e,d)}function Qs(e,t){const n=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],o=new Set(e.sim.state.unlockedZones),s=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+Dn.filter(i=>e.sim.state.sandboxMode||o.has(i.id)).map(i=>`<option value="${i.id}" ${l===i.id?"selected":""}>📍 ${i.name}</option>`).join(""),a=n.map(l=>{const i=e.sim.state.staffHired[l.key],d=i>=Ot,c=l.baseCost*(1+i);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${i}/${Ot}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${d?"":"gold-cta"}"
              ${d?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${d?`✓ ${Ot}/${Ot}`:`+ 🪙 ${c}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(l=>{const i=e.sim.state.staffPatrolZones?.[l.id]??l.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${x(l.name)}</div>
            <select data-patrol-staff="${x(l.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${s(i)}
            </select>
            <button type="button" data-pick-staff="${x(l.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=a+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const i=l.dataset.hire;e.sim.hireStaff(i)&&(tt(e),Zt(e),et(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const i=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(i,l.value),et(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const i=e.sim.staff.find(d=>d.id===l.dataset.pickStaff);i&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},tt(e),Zt(e),et(e,`Đang gắp ${i.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}const Za={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏭 Xưởng & Cửa Tiệm",creature:"🦄 Đồng Cỏ & Thú Phép",decor:"🌸 Vườn Hoa & Cảnh Quan",staff:"🧙 Phụ Tá Điền Trang"};function vs(e,t){const n=e.root.querySelector("#buildDrawerSwipeBar"),o=e.root.querySelector("#buildDrawerCatLabel"),s=e.root.querySelector("#btnDrawerScrollPrev"),a=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const l=Array.from(t.querySelectorAll(".catalog-card"));if(!n||l.length===0||!e.activeCategory){n?.classList.add("hidden");return}if(o){const m=Za[e.activeCategory]??"🏗️ Danh Mục Xây Dựng";o.textContent=`${m} (${l.length})`}n.classList.remove("hidden");const i=t.querySelector('.catalog-card[data-selected="true"]');i&&typeof i.scrollIntoView=="function"&&i.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const d=l[0],c=l[l.length-1];let u=!0,p=l.length<=2;const g=()=>{const m=!u||!p||t.scrollWidth>t.clientWidth+6;s&&(s.disabled=u,s.classList.toggle("hidden",!m)),a&&(a.disabled=p,a.classList.toggle("hidden",!m)),r&&r.classList.toggle("hidden",!m),t.dataset.scrollStart=String(!u),t.dataset.scrollEnd=String(!p)};if(typeof IntersectionObserver<"u"){const m=new IntersectionObserver(b=>{for(const h of b)h.target===d&&(u=h.intersectionRatio>=1),h.target===c&&(p=h.intersectionRatio>=1);g()},{root:t,threshold:1,rootMargin:"2px"});m.observe(d),c!==d&&m.observe(c),e.drawerEdgeObserver=m}g()}function Ja(e){const t=e.mapToolsExpanded,n=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");n&&n.classList.toggle("hidden",!t),o&&(o.setAttribute("aria-expanded",String(t)),o.setAttribute("data-active",String(t)),o.setAttribute("aria-pressed",String(t)))}function ge(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const n=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(n!==e.lastInspectedKey&&(e.lastInspectedKey=n,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const o=e.inspectSelection.uid,s=e.sim.state.buildings.find(q=>q.uid===o);if(!s){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=re(s.itemId),r=Date.now(),l=r<s.constructEndsAt,i=Math.max(0,Math.ceil((s.constructEndsAt-r)/1e3)),d=e.sim.getBuildingProductionPerCycle(s,a),c=ji(a,s.stars),u=(e.sim.rideQueues.get(s.uid)??[]).length,p=e.sim.isBuildingConnected(s.uid),g=e.sim.activeSynergies.buildingGoldMult.get(s.uid)??1,m=e.sim.activeSynergies.buildingXpMult.get(s.uid)??1,b=a.category==="ride"&&!a.isCoasterTrackPiece,h=!!a.isCustomCoasterStation&&!l,T={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},C=a.isCreatureHabitat?e.sim.biomeCache.get(s.uid):void 0,f=a.isBackstage?e.sim.backstageCache.get(s.uid):void 0,k=!!a.ticketPrice&&!l&&!a.workshopGroupId,$=Wi(a),L=e.sim.getEffectivePrice(s,a),w=e.sim.getPriceValueVerdict(s,a),E=a.isFarmlandPlot&&!l?(()=>{if(!s.cropId){const P=Object.values(we).sort((ie,ve)=>ie.unlockLevel-ve.unlockLevel||ie.growSec-ve.growSec),H=P.filter(ie=>ie.isFlowerCrop).length,U=P.length-H,se=P.filter(ie=>e.seedFilterMode==="flowers"?!!ie.isFlowerCrop:e.seedFilterMode==="crops"?!ie.isFlowerCrop:!0),K=[{id:"all",label:`🌱 (${P.length})`},{id:"flowers",label:`🌸 (${H})`},{id:"crops",label:`🌾 (${U})`}].map(ie=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===ie.id?"active":""}"
                        data-insp-seed-filter="${ie.id}"
                        aria-pressed="${e.seedFilterMode===ie.id}"
                      >${ie.label}</button>
                    `).join(""),pe=se.map(ie=>{const ve=!e.sim.state.sandboxMode&&e.sim.state.level<ie.unlockLevel,j=e.sim.getSeedCount(ie.id),ye=e.sim.getFarmItemCount(ie.id),Le=xe(ie.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${ve?"locked":""} ${!ve&&j<=0?"out-of-seeds":""}"
                        data-plant-crop="${ie.id}"
                        ${ve?"disabled":""}
                      >
                        <img src="${Ct(ie.id)}" alt="${x(ie.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${x(ie.name)}</span>
                        <span class="seed-card-seed-badge ${j>0?"has-seed":"no-seed"}">
                          ${ve?`🔒 Lv.${ie.unlockLevel}`:j>0?`🌱 ×${j}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${ve?`⏱️ ${Le}`:`⏱️ ${Le} • 🪙${ie.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${ye}</span>
                      </button>
                    `}).join(""),me=e.sim.state.plotSoilState?.[`${s.gx},${s.gy}`],le={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${me?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${le[me.lastFamily]??me.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${K}</div>
                    <div class="seed-picker-grid">${pe}</div>
                  </div>
                `}const q=we[s.cropId],F=s.cropReadyAt??r,V=s.cropPlantedAt??F-q.growSec*1e3,Z=Math.max(0,Math.ceil((F-r)/1e3)),J=Z<=0,ce=e.sim.state.cropMastery?.[q.id]??0,Q=Pi(ce),O=Math.max(0,e.sim.state.morningDewPhials??0),A=q.yieldQty*(s.cropRotatedBonus?2:1),N=J?100:Math.max(6,Math.min(98,Math.round((r-V)/Math.max(1e3,F-V)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${Ct(q.id)}" alt="${x(q.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${x(q.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${Q.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${J?"🌾 Chín!":`⏱️ ${Pe(Z)}`}${s.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${ce} vụ • Họ ${Li(q.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${N}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${J?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${A})
                          </button>
                        `:s.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!J&&(O>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${O})
                          </button>`:""}
                  </div>
                </div>
              `})():"",M=a.workshopGroupId&&!l?(()=>{const q=e.sim.getWorkshopRecipesForBuilding(a),F=s.workshopQueue??[],V=s.readyFarmGoods??[],Z=3+Math.min(2,Math.max(0,s.stars-1)),J=V.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${V.slice(0,5).map(P=>{const H=ot[P];return`<img src="/trang-trai-hang-soc/sprites/${H.iconKey}.png" alt="${x(H.name)}" title="${x(H.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${V.length})
                      </button>
                    </div>
                  `:"",ce=q.map(P=>{const H=ot[P.goodId],U=P.name??H.name,se=P.name&&P.name!==H.name?`title="Ra lò thành phẩm: ${x(H.name)}"`:"",K=!e.sim.state.sandboxMode&&e.sim.state.level<P.unlockLevel,pe=!K&&(e.sim.state.sandboxMode||P.inputs.every(le=>e.sim.getFarmItemCount(le.itemId)>=le.qty)),me=P.inputs.map(le=>{const he=Oe(le.itemId),ie=e.sim.getFarmItemCount(le.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||ie>=le.qty?"ok":"lack"}">${x(he.name)} ${e.sim.state.sandboxMode?"∞":ie}/${le.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${pe?"craftable":""} ${K?"locked":""}"
                      data-ws-enqueue="${P.id}"
                      ${se}
                      ${K?"disabled":""}
                    >
                      <div class="ws-recipe-name">${x(U)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${H.iconKey}.png" alt="${x(U)}" class="ws-recipe-img" />
                        ${pe?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${K?`🔒 Lv.${P.unlockLevel}`:me}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${xe(P.craftSec)}</div>
                    </button>
                  `}).join(""),Q=F[0],O=Q?Math.max(0,Math.ceil((Q.endsAt-r)/1e3)):0,A=Q?ot[Q.goodId]:null,N=Array.from({length:Math.max(1,Z-1)},(P,H)=>{const U=F[H+1];if(U){const se=ot[U.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${x(se.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${se.iconKey}.png" alt="${x(se.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return H===F.length-(Q?1:0)?`
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
                    <span>🔥 ${x(a.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${J}
                  <div class="ws-recipe-grid">${ce}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${Q?"baking":""}">
                      <div class="ws-oven-arch">
                        ${A?`<img src="/trang-trai-hang-soc/sprites/${A.iconKey}.png" alt="${x(A.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${Q?`<strong>${Pe(O)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${Q?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${N}</div>
                  </div>
                </div>
              `})():"",R=a.isAnimalPasturePlot&&!l?(()=>{if(!s.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(Je).map(A=>{const N=!e.sim.state.sandboxMode&&e.sim.state.level<A.unlockLevel,P=A.goodId?Oe(A.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${N?"locked":""}"
                        data-stock-animal="${A.id}"
                        ${N?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${A.spritePair[0]}.png" alt="${x(A.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${x(A.name)}</span>
                        <span class="seed-card-seed-badge ${N?"no-seed":"has-seed"}">
                          ${N?`🔒 Lv.${A.unlockLevel}`:`🪙 ${A.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${xe(A.cycleSec)} • +${A.sellValue}G</span>
                        <span class="seed-card-stock">${P?`+${A.yieldQty} ${x(P.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const q=Je[s.pastureAnimalId],F=s.pastureReadyAt??r,V=s.pastureStockedAt??F-q.cycleSec*1e3,Z=Math.max(0,Math.ceil((F-r)/1e3)),J=Z<=0,ce=J?100:Math.max(6,Math.min(98,Math.round((r-V)/Math.max(1e3,F-V)*100))),Q=q.goodId?Oe(q.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${q.spritePair[0]}.png" alt="${x(q.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${x(q.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${J?`🧺 +${q.sellValue}G${Q?` +${q.yieldQty} ${x(Q.name)}`:""}`:`⏱️ ${Pe(Z)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${ce}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${J?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${q.sellValue}G)
                          </button>
                        `:s.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!J&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((a.workshopGroupId||a.isFarmlandPlot||a.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${a.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${a.spriteKey}.png" alt="${x(a.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${x(a.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(s.stars)}${"☆".repeat(5-s.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${a.isFarmlandPlot?"🌱 Ruộng":a.isAnimalPasturePlot?"🐾 Đồng cỏ":a.connectableGroup==="flower_garden"?"🌸 Vườn hoa":a.workshopGroupId?"🔥 Xưởng":`👥 ${s.visitorsServed}`}${b?` • 🎟️ ${u}/${Qi}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${E}
        ${R}
        ${M}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${p?"#15803d":"#dc2626"};">
            ${p?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${g>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((g-1)*100)}%G • +${Math.round((m-1)*100)}%XP</div>`:""}
          ${a.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${kt[a.producesIngredient].emoji} ${kt[a.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const q=Math.max(0,s.buildReducedSec??0),F=Math.max(1e3,a.buildDurationSec*1e3,s.constructEndsAt-(s.placedAt||r-1e3)+q*1e3),V=Math.max(1,Math.min(99,Math.floor((1-(s.constructEndsAt-r)/F)*100))),Z=e.sim.getBuildingMinFloorSec(s),J=Math.max(0,i-Z),ce=J<=0&&e.sim.getActiveConstructions(r).some(A=>A.uid!==s.uid&&Math.ceil((A.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(A)),Q=J>0||ce,O=a.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${a.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${V}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${V}" aria-label="${O}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${Pe(i)}</strong>${q>0?` • <span style="color:var(--teal-deep);">-${xe(q)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${Q?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${Q?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${J>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
                              🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                            </button>`:""}
                      ${e.sim.state.sandboxMode?`<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1;" title="Hoàn tất ngay">
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
              `:a.baseIncome>0?(()=>{const q=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,F=Ai(s,a),V=Math.max(1,F*q),Z=Math.max(0,(r-(s.lastTickAt||r))/1e3),J=Math.max(1,Math.ceil(V-Z%V));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${d.galleons}🪙 +${d.xp}⭐</strong> / ${xe(F)}</div>
                      ${a.cycleSec>0&&!a.isFarmlandPlot&&!a.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${Pe(J)}</strong> • Kho: <strong>${s.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${s.storedGalleons}🪙</strong></div>`}
                      ${s.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${s.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${b&&!l&&!a.isFlooPortal?`
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
                  <span>🎟️ Giá (${$.min}–${$.max}G):</span>
                  <span id="lblBuildingPriceVal">${L}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${$.min}" max="${$.max}" value="${L}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${w.color};">
                  ${w.label}
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
                  <strong>🐾 ${x(s.creatureNickname||a.creatureName||a.name)}</strong>
                  <span class="morph-pill ${s.creatureMorph==="radiant"?"radiant":s.creatureMorph==="mystic"?"mystic":""}">
                    ${Ne[s.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${s.creatureBondLevel??1}/${yt} • ${T[s.creatureStage??"baby"]} • 🌿 ${C?.score??50}% • 🥩 ${Math.round(s.creatureHunger??90)}%</div>
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

        ${a.isBackstage&&f&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${f.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${f.shieldCount}/${f.needed} ${f.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&s.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${s.stars+1}★ (🌟${Ei(s.stars)} + 🪙${c.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${s.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const G=t.querySelector("#inpBuildingPrice");G&&(e.wireRangeProgressFallback(G),G.addEventListener("input",()=>{const q=Number(G.value);e.sim.setBuildingCustomPrice(s.uid,q);const F=e.sim.getEffectivePrice(s,a),V=t.querySelector("#lblBuildingPriceVal");V&&(V.textContent=`${F} Galleon`);const Z=e.sim.getPriceValueVerdict(s,a),J=t.querySelector("#lblPriceVerdict");J&&(J.textContent=Z.label,J.style.color=Z.color);const ce=e.sim.getBuildingProductionPerCycle(s,a),Q=t.querySelector("#lblBuildingProdVal");Q&&(Q.textContent=`+${ce.galleons} 🪙 & +${ce.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,ge(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,ge(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(s.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(s.uid,!0),ge(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(q=>{q.addEventListener("click",()=>{const F=e.sim.useMorningDewPhial(s.uid);e.showToast(F.msg,F.ok?"🧪":"⏳"),ge(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),ge(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const q=s.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",q)}),t.querySelectorAll("[data-plant-crop]").forEach(q=>{q.addEventListener("click",()=>{const F=q.dataset.plantCrop,V=e.sim.plantCropOnPlot(s.uid,F);if(V.needSeedAcquire){const Z=s.uid;e.activeSeedCropId=F,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(F,Z);return}if(e.showToast(V.msg,V.ok?"🌱":"🪙"),V.ok){e.activeSeedCropId=F,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}ge(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(q=>{q.addEventListener("click",()=>{const F=q.dataset.inspSeedFilter;(F==="all"||F==="flowers"||F==="crops")&&(e.seedFilterMode=F,ge(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(q=>{q.addEventListener("click",()=>{const F=q.dataset.stockAnimal,V=e.sim.stockAnimalOnPasture(s.uid,F);if(e.showToast(V.msg,V.ok?Je[F]?.emoji??"🐾":"🪙"),V.ok){e.activePastureAnimalId=F,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}ge(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const q=e.sim.feedAnimalPasture(s.uid);e.showToast(q.msg,q.ok?"🌾":"⏳"),ge(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const q=e.sim.harvestAnimalPasture(s.uid);e.showToast(q.msg,q.ok?"🧺":"⏳"),ge(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const q=e.sim.clearAnimalFromPasture(s.uid);e.showToast(q.msg,q.ok?"🐾":"⚠️"),ge(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const q=e.sim.waterCropPlot(s.uid);e.showToast(q.msg,q.ok?"💧":"⏳"),ge(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const q=e.sim.harvestCropPlot(s.uid);e.showToast(q.msg,q.ok?"🌾":"🏡"),ge(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),ge(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(q=>{q.addEventListener("click",()=>{const F=q.dataset.wsEnqueue,V=e.sim.enqueueWorkshopRecipe(s.uid,F);e.showToast(V.msg,V.ok?"🔥":"🧺"),ge(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(s.uid),ge(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(s.uid),ge(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(s.uid),ge(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=s.uid,e.inspectSelection=null,ge(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${a.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(s.uid),ge(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",s.uid)}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const q=e.sim.upgradeBuildingStar(s.uid);e.showToast(q.msg,q.ok?"🌟":"🪙"),ge(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=s.uid,e.rotation=s.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${a.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const o=e.inspectSelection.id,s=e.sim.staff.find(l=>l.id===o);if(!s){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=e.sim.state.staffPatrolZones?.[s.id]??s.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${x(s.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${x(s.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${a==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${Dn.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${a===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,ge(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,ge(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const i=l.currentTarget.value;e.sim.setStaffPatrolZone(s.id,i),e.showToast(`Đã phân công khu tuần tra cho ${s.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const o=Ps(e.inspectSelection.zoneId),s=qs(o),a=e.sim.state.level>=o.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${x(o.name)}</div>
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
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,ge(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,ge(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(o.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,ge(e))})}}function Gn(e,t){t&&(e.activeWorkshopTab=t),Ae(e);const n=e.root.querySelector("#workshopDialog");n.open||n.showModal()}function Xs(e,t,n){e.collapseBuildDock(),Lt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=n??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function lt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function eo(e){e.seedTrayOpen?(lt(e),e.refreshAll()):Xs(e,e.activeSeedCropId??void 0)}function Ks(e,t,n){e.collapseBuildDock(),lt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=n??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Lt(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function to(e){e.pastureTrayOpen?(Lt(e),e.refreshAll()):Ks(e,e.activePastureAnimalId??void 0)}function Ys(e){const t=e.root.querySelector("#seedBrushTray"),n=e.root.querySelector("#btnOpenSeedSilo");if(n){const p=e.seedTrayOpen||!!e.activeSeedCropId;n.dataset.active=String(p),n.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(p=>re(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,s=e.sim.state.buildings.filter(p=>re(p.itemId)?.isFarmlandPlot).length,a=e.activeSeedCropId?we[e.activeSeedCropId]:null,r=Object.values(we).sort((p,g)=>p.unlockLevel-g.unlockLevel||p.growSec-g.growSec),l=r.filter(p=>p.isFlowerCrop).length,i=r.length-l,d=r.filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),c=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${i})`}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),u=d.map(p=>{const g=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,m=e.activeSeedCropId===p.id,b=e.sim.getSeedCount(p.id),h=e.sim.getFarmItemCount(p.id),T=xe(p.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${g?"locked":""} ${m?"selected":""} ${!g&&b<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${m}"
              ${g?"disabled":""}
            >
              <img src="${Ct(p.id)}" alt="${x(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${x(p.name)}</span>
              <span class="seed-card-seed-badge ${b>0?"has-seed":"no-seed"}">
                ${g?`🔒 Cấp ${p.unlockLevel}`:b>0?`🌱 ${b}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${g?`⏱️ ${T}`:`⏱️ ${T} • 🪙${p.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${h}</span>
            </button>
            ${g?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Nạp hạt ${x(p.name)}" title="Mua hạt ${x(p.name)} (${p.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🌱 <strong>${x(a.name)}</strong> (${e.sim.getSeedCount(a.id)})`:"🌱 Hạt Giống & Hoa"}
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${o}/${s}</strong></span>
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
    `,t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.seedFilter;(m==="all"||m==="flowers"||m==="crops")&&(e.seedFilterMode=m,Ys(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.acquireSeed,b=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,b)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),g=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.seedBrush,m=we[g],b=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(g)<=0){e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,b);return}if(e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,b){const h=e.sim.state.buildings.find(T=>T.uid===b);if(h&&re(h.itemId)?.isFarmlandPlot&&!h.cropId){const T=e.sim.plantCropOnPlot(h.uid,g);if(T.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(g,h.uid);return}e.showToast(T.msg,T.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${m.emoji} ${m.name} (Túi có ${e.sim.getSeedCount(g)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,m.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=re("farmland_plot");p&&(lt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=re("burrow_flower_garden");p&&(lt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Gn(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{lt(e),e.refreshAll()})}function no(e){const t=e.root.querySelector("#pastureBrushTray"),n=e.root.querySelector("#btnOpenPastureTray");if(n){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;n.dataset.active=String(l),n.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(l=>re(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,s=e.sim.state.buildings.filter(l=>re(l.itemId)?.isAnimalPasturePlot).length,a=e.activePastureAnimalId?Je[e.activePastureAnimalId]:null,r=Object.values(Je).map(l=>{const i=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,d=e.activePastureAnimalId===l.id,c=l.goodId?Oe(l.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${i?"locked":""} ${d?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${d}"
              ${i?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.png" alt="${x(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${x(l.name)}</span>
              <span class="seed-card-seed-badge ${i?"no-seed":"has-seed"}">
                ${i?`🔒 Cấp ${l.unlockLevel}`:`🪙 ${l.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${xe(l.cycleSec)} • +${l.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${c?`+${l.yieldQty} ${x(c.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🐾 <strong>${x(a.name)}</strong> (${a.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
          </div>
          <div class="seed-tray-sub">
            Ô trống: <strong>${o}/${s}</strong>
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
    `,t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const i=l.dataset.pastureBrush,d=Je[i];if(!d)return;const c=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=i,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,c){const u=e.sim.state.buildings.find(p=>p.uid===c);if(u&&re(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId){const p=e.sim.stockAnimalOnPasture(u.uid,i);e.showToast(p.msg,p.ok?d.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${d.emoji} ${d.name} (${d.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,d.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=re("burrow_animal_pasture");l&&(Lt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Gn(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Lt(e),e.refreshAll()})}function so(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();if((n.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){Ae(e);return}if(e.activeWorkshopTab==="brew"){const a=t.querySelector("#btnWsQuickHerb");if(a){const i=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),d=i===0||n.sandboxMode;a.classList.toggle("gold-cta",d),a.textContent=d?"🌿 Hái Thảo Dược":`🌱 (${xe(i)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&n.supply.activeBrew){const i=Gt.find(c=>c.id===n.supply.activeBrew?.goodId),d=Math.max(0,Math.ceil((n.supply.activeBrew.endsAt-o)/1e3));i&&(r.textContent=`🔥 ${i.emoji} ${i.name} (còn ${Pe(d)})`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const i=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),d=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3));if(i<=0&&d<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const c=[];i>0&&c.push(`🍻 +85%G (${Pe(i)})`),d>0&&c.push(`🧪 +35%XP (${Pe(d)})`),l.textContent=`✨ ${c.join(" • ")}`}}}}function Ae(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,o=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const s=e.sim.activeSynergies.activeIds.size,a=n.supply.cargoCrates.filter(c=>c.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),i=`
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
    `;let d="";if(e.activeWorkshopTab==="barn"){const c=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),u=e.sim.getBarnUpgradeCostInfo(),p=n.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":u.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${u.baseGoldCost})`:`🏡 +20 Ô (🪙${u.effectiveGoldCost} • bù 1🔌)`,g=u.hasPlug?`🔌 ×${u.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${u.plugShortageBuyout}G)`,m=k=>k.map($=>{const L=Oe($),w=e.sim.getFarmItemCount($);return`
              <div class="barn-stock-card ${w>0?"in-stock":"empty"}">
                <img src="${L.iconSrc}" alt="${x(L.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${x(L.name)}</div>
                <div class="barn-stock-qty"><strong>×${n.sandboxMode?"∞":w}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${w>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${$}"
                  ${w<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${L.sellValue}G
                </button>
              </div>
            `}).join(""),b=e.sim.getPhoenixTalismanCount(),h=e.sim.getPhoenixTalismanDailyStatus(),T=e.sim.getCraftablePhoenixBarnGood(),C=T?Oe(T):null,f=n.sandboxMode||b<$n&&!!T&&n.galleons>=os;d=`
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
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${b}/${$n}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${h.usedCount}/${h.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${f?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${C?`1 ${x(C.name)}`:"1 Đặc sản"} + ${os}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(we).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(we))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(ot).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(ot))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const c=Math.max(0,Math.ceil((2e4-(o-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),u=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-o)/1e3)),p=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-o)/1e3)),g=n.supply.activeBrew,m=g?Gt.find(L=>L.id===g.goodId):void 0,b=g?Math.max(0,Math.ceil((g.endsAt-o)/1e3)):0,h=Math.max(0,n.supply.brewCompletedCount??0),T=h+1,C=n.buildings.some(L=>re(L.itemId)?.isWorkshopBrewery&&o>=L.constructEndsAt),f=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),k=h===0?"Mẻ #1 (khởi động: 1 giờ)":h===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":h===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${T} (đạt trần tối đa: 6 giờ)`,$=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];d=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${c===0||n.sandboxMode?"gold-cta":""}">
            ${c>0&&!n.sandboxMode?`🌱 (${xe(c)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${k}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${C?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${f?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${$.map(L=>{const w=kt[L],E=n.supply.ingredients[L]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${w.emoji} ${w.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":E}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${u>0||p>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${u>0?`🍻 +85%G (${Pe(u)}) `:""}${p>0?`• 🧪 +35%XP (${Pe(p)})`:""}
              </div>
            `:""}

        ${g&&m?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${m.emoji} ${x(m.name)} (còn ${Pe(b)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Gt.map(L=>{const w=n.supply.goods[L.id]??0,E=e.sim.getBrewDurationSec(L),M=xe(E),R=Object.entries(L.inputs).map(([G,q])=>{const F=kt[G],V=n.supply.ingredients[G]??0;return`<span style="color:${n.sandboxMode||V>=(q??0)?"#15803d":"#dc2626"};font-weight:800;">${F.emoji} ${V}/${q}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${L.emoji} ${L.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${n.sandboxMode?"∞":w}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${R}</div>
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
          ${n.supply.cargoCrates.map((p,g)=>{const m=Gt.find(T=>T.id===p.goodId),b=n.supply.goods[p.goodId]??0,h=!p.fulfilled&&(n.sandboxMode||b>=p.qtyRequired);return`
                <div class="crate-card ${p.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${g+1}</span>
                      <span>${p.fulfilled?"✅":`${n.sandboxMode?"∞":b}/${p.qtyRequired}`}</span>
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
          ${qi.map(c=>{const u=e.sim.activeSynergies.activeIds.has(c.id),p=c.requiredItems.map(g=>re(g)?.name??g).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${u?"#d97706":"rgba(138,90,43,0.3)"};background:${u?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${c.emoji} ${x(c.name)}</span>
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
      `;t.innerHTML=i+d,t.querySelectorAll("[data-ws-tab]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab=c.dataset.wsTab,Ae(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const c=e.sim.upgradeFarmBarn();e.showToast(c.msg,c.ok?"🏡":"🔌"),Ae(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const c=e.sim.craftPhoenixTalismanFromBarn();e.showToast(c.msg,c.ok?"🔥":"🧺"),Ae(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.sellFarmItemFromBarn(c.dataset.sellFarmItem,1);u.ok||e.showToast(u.msg,"🧺"),Ae(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const c=e.sim.quickHarvestHerbs();e.showToast(c.msg,c.ok?"🌿":"⏳"),Ae(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&Ae(e)}),t.querySelectorAll("[data-brew-good]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.startBrewing(c.dataset.brewGood);e.showToast(u.msg,u.ok?"🧪":"⚠️"),Ae(e)})}),t.querySelectorAll("[data-use-good]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.useGood,p=e.sim.useCraftedGood(u);p.ok?u==="dragon_firework"?e.root.querySelector("#workshopDialog").close():Ae(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.fulfillCargoCrate(c.dataset.fulfillCrate);e.showToast(u.msg,u.ok?"📦":"⚠️"),Ae(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(c=>{c.addEventListener("click",()=>{e.activeWorkshopTab="brew",Ae(e)})})}function io(e){e.closeHudPopovers(),Zs(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function ao(e){const t=e.sim.getClaimableHarvestFeastCount(),n=e.root.querySelector("#badgeFeastCount");n&&(t>0?(n.textContent=String(t),n.classList.remove("hidden")):n.classList.add("hidden"));const o=e.root.querySelector("#badgeManageFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"))}function oo(e,t){const n=e.root.querySelector("#ribbonUnveilToastCard");n&&(n.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${x(t.speakerEmoji)} ${x(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${x(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,n.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{n.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function Zs(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const n=e.sim.ensureHarvestFeast(),o=new Set(n.claimedTiers),s=ht[ht.length-1]?.pointsRequired??3e3,a=Math.min(100,Math.round(n.points/Math.max(1,s)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=ht.every(c=>o.has(c.tier)),i=ht.find(c=>!o.has(c.tier)),d=ht.map(c=>{const u=o.has(c.tier),g=n.points>=c.pointsRequired&&!u,m=Xi(c),b=c.tier%5===0;return`
        <article class="feast-tier-card ${u?"is-claimed":g?"is-claimable":"is-locked"} ${b?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${c.tier}</span>
            <span class="feast-tier-pts">🍁 ${c.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${x(c.icon)} ${x(c.titleVi)}</span>
              ${b?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${x(m)}</div>
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
        ${d}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const c=e.sim.claimAllHarvestFeastTiers();e.showToast(c.msg,c.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const c=e.sim.startNextHarvestFeastCycle();e.showToast(c.msg,c.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(c=>{c.addEventListener("click",()=>{const u=Number(c.dataset.claimFeastTier);if(!Number.isFinite(u))return;const p=e.sim.claimHarvestFeastTier(u);e.showToast(p.msg,p.ok?"🎁":"🍁"),e.refreshAll()})})}function ro(e){const t=e.root.querySelector("#financeDialogContent"),n=e.sim.state.finance,o=n.gateRevenue+n.ticketRevenue+n.shopRevenue+n.harvestRevenue,s=n.staffWagesPaid+n.constructionSpent,a=o-s,r=e.sim.getHourlyStaffWage();t.innerHTML=`
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
    `}function Xe(e){const t=e.root.querySelector("#albumDialogContent"),n=e.sim.state;e.sim.checkAndToastAchievements();const o=Ki(n),s=Yi(n),a=rs.filter(c=>{const u=o.achievements[c.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=ls.filter(c=>c.day<=r&&!o.claimedLoginDays.includes(c.day)).length,i=`
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
    `;let d="";if(e.activeAlbumTab==="cup"){const c=e.sim.getPlayerHouse(),u=n.weeklyHouseCupServerStandings,p=[{house:"Gryffindor",icon:"🦁",pts:(n.housePoints.Gryffindor??0)+(u?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(n.housePoints.Slytherin??0)+(u?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(n.housePoints.Ravenclaw??0)+(u?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(n.housePoints.Hufflepuff??0)+(u?.totals.Hufflepuff??0)}];p.sort((T,C)=>C.pts-T.pts);const g=Math.max(100,p[0]?.pts??100),m=(n.housePoints.Gryffindor??0)+(n.housePoints.Slytherin??0)+(n.housePoints.Ravenclaw??0)+(n.housePoints.Hufflepuff??0),b=n.houseCupMilestoneTier*300,h=m>=b;d=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${c}</strong>${u?` • Tuần HPVN ${u.weekKey} (đóng góp: +${u.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${n.houseCupMilestoneTier}: ${m} / ${b}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${p.map((T,C)=>{const f=Math.min(100,Math.max(8,Math.round(T.pts/g*100))),k=T.house===c;return`
                  <div class="aaa-hourglass-card" data-house="${T.house}" data-player-house="${k}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${C===0?"👑 ":""}${T.icon} ${T.house}</span>
                      ${k?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${T.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${f}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${b}" value="${Math.min(b,m)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${h?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${n.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const c=Date.now(),u={farm:it(n,"farm",c),building:it(n,"building",c),puzzle:it(n,"puzzle",c),language:it(n,"language",c),social:it(n,"social",c),collection:it(n,"collection",c)};d=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${s.completionPct}% (${s.unlocked}/${s.total})</span>
          </div>
          <progress max="${s.total}" value="${s.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${rs.map(p=>{const g=o.achievements[p.id],m=!!g?.unlockedAt,b=!!g?.claimedAt,h=Math.min(p.target,Math.max(0,u[p.category]??0)),T=h.toLocaleString("vi-VN"),C=p.target.toLocaleString("vi-VN");return`
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
                  ${b?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':m?`<button type="button" data-claim-ach="${p.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${T}/${C}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const c=e.sim.getRealTimePeriod(),u=Zi();d=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${Ds.map(p=>{const g=n.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
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
          ${Ji.map(p=>{const g=ea(p.id,c),m=o.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},b=m.level*60,h=m.lastTalkedDayKey===u;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${p.moodBubble} ${p.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${p.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${m.level}/10 (${m.xp}/${b})</span>
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
            ${ls.map(c=>{const u=o.claimedLoginDays.includes(c.day),p=!u&&c.day<=r;return`
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
      `;t.innerHTML=i+d,t.querySelectorAll("[data-atab]").forEach(c=>{c.addEventListener("click",()=>{e.activeAlbumTab=c.dataset.atab,Xe(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&Xe(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const c=await Tt(()=>Promise.resolve().then(()=>Lo),void 0);if(typeof c.fetchWeeklyHouseCupStandingsOnline=="function"){const u=await c.fetchWeeklyHouseCupStandingsOnline();if(u){n.weeklyHouseCupServerStandings=u,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${u.weekKey}!`,"🏆"),Xe(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(c.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),Xe(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(c=>{c.addEventListener("click",()=>{e.playStoryCutscene(String(c.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.npcTalk,p=Number(c.dataset.choice)===1?1:0,g=e.sim.talkWithVillagerChoice(u,p);e.showToast(g.msg,g.ok?"💝":"☕"),Xe(e)})}),t.querySelectorAll("[data-claim-login]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(c.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),Xe(e)})})}function ze(e){const t=e.root.querySelector("#questDialogContent"),n=e.sim.ensureFarmBarn(),o=e.sim.getActiveStoryQuest(),s=e.sim.getStoryAutoActionPreview(),a=e.sim.getReadyOwlOrdersCount(),r=(o?.completed?1:0)+e.sim.state.owlQuests.filter(m=>m.completed&&!m.claimed).length+e.sim.state.dailyQuests.filter(m=>m.completed&&!m.claimed).length;if(!e.selectedOwlOrderId||!n.owlOrders.some(m=>m.id===e.selectedOwlOrderId)){const m=n.owlOrders.find(b=>e.sim.canFulfillFarmOwlOrder(b));e.selectedOwlOrderId=(m??n.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${a}/${n.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const m=n.owlOrders.find(C=>C.id===e.selectedOwlOrderId)??n.owlOrders[0],b=m?e.sim.canFulfillFarmOwlOrder(m):!1,h=n.owlOrders.map(C=>{const f=m?.id===C.id,k=e.sim.canFulfillFarmOwlOrder(C),$=C.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${C.portraitSprite}.png" alt="${x(C.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${x(C.portraitEmoji)}</span>`,L=C.requirements.slice(0,3).map(w=>{const E=Oe(w.itemId);return`<img src="${E.iconSrc}" alt="${x(E.name)}" title="${w.qty} ${x(E.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${f?"selected":""} ${k?"ready":""}"
              data-select-owl="${x(C.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${$}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${x(C.senderName)}</div>
                <div class="owl-note-mini-row">${L}</div>
                ${C.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${k?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),T=m?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${x(m.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${x(m.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${m.requirements.map((C,f)=>{const k=Oe(C.itemId),$=e.sim.getFarmItemCount(C.itemId),L=e.sim.ensureNeighborSocial(),w=Math.max(0,Vt-L.dailyOwlHelpRequestedCount),E=e.sim.getOwlRequirementHelpState(m.id,f),M=!!E?.fulfilledAt,R=e.sim.state.sandboxMode||M||$>=C.qty,G=M?`<span class="owl-help-tag done">✓ ${x(E?.helperEmoji??"🦉")}</span>`:E?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':R?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${f}" ${w<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${w})</button>`;return`
                    <div class="owl-req-row ${R?"ok":"lack"}">
                      <img src="${k.iconSrc}" alt="${x(k.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${x(k.name)}</div>
                        <div class="owl-req-count">${M?"✓":`${e.sim.state.sandboxMode?"∞":$}/${C.qty}`}</div>
                      </div>
                      ${G}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${m.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${m.rewardXp}</span>
                ${m.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${m.rewardMugglePlug}</span>`:""}
                ${(m.isFeastMarquee||(n.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<$n?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${h}</div>
            ${T}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${b?"ready":"not-ready"}"
            >
              🦉 ${b?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(C=>{C.addEventListener("click",()=>{e.activeQuestTab=C.dataset.qtab,ze(e)})}),t.querySelectorAll("[data-select-owl]").forEach(C=>{C.addEventListener("click",()=>{e.selectedOwlOrderId=C.dataset.selectOwl??null,ze(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{m&&(e.sim.refreshFarmOwlOrder(m.id),e.selectedOwlOrderId=null,ze(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(C=>{C.addEventListener("click",()=>{if(!m)return;const f=Number(C.dataset.askOwlHelp);if(!Number.isFinite(f))return;const k=e.sim.requestPlayerOwlCrateHelp(m.id,f);k.ok||e.showToast(k.msg,"⚠️"),ze(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!m)return;if(!e.sim.canFulfillFarmOwlOrder(m)){const f=e.sim.fulfillFarmOwlOrder(m.id);e.showToast(f.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const C=e.sim.fulfillFarmOwlOrder(m.id);C.ok&&e.showToast(C.msg,"🦉"),e.selectedOwlOrderId=null,ze(e)});return}const i=(m,b,h=!1)=>{const T=Math.min(100,Math.round(m.progress/Math.max(1,m.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${x(m.giverEmoji)} ${x(m.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${x(b)}</span>
          </div>
          ${h&&m.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${x(m.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${T}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(m.progress,m.targetAmount)}/${m.targetAmount}</span>
            <span>🪙${m.rewardGalleons} • ⭐${m.rewardXp} ${m.rewardTimeSand>0?`• ⏳${m.rewardTimeSand}`:""}</span>
          </div>
          ${m.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':m.completed?`<button type="button" data-modal-claim="${x(m.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:h?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${x(s.shortLabel)}</button>`:""}
        </div>
      `},d=e.sim.getRequiredLevelTrial(),c=e.sim.getWinsProgressForCurrentLevel(),u=m=>{const b=e.sim.getDisciplineStageInfo(m);return b.isMaxed?"👑777":`${b.currentStage}/777`},p=d&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${c.current}/${c.required}): ${d.icon} ${x(d.shortVi)}
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
      `:"",g=o?`Ch.${o.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${Hi.length}`:"";t.innerHTML=`
      ${l}
      ${p}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${o?i(o,g,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(m=>i(m,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(m=>i(m,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(m=>{m.addEventListener("click",()=>{e.activeQuestTab=m.dataset.qtab,ze(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(m=>{m.addEventListener("click",()=>{const b=m.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(b)})}),t.querySelectorAll("[data-modal-claim]").forEach(m=>{m.addEventListener("click",()=>{e.sim.claimQuest(m.dataset.modalClaim),ze(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const m=e.sim.completeStoryStepWithStar();m.ok?(typeof m.placedGx=="number"&&typeof m.placedGy=="number"&&fe(e.cam,m.placedGx,m.placedGy),ze(e)):(e.showToast(m.msg,m.reason==="missing_gold"?"🪙":"🌟"),(m.reason==="missing_stars"||m.reason==="locked_level"||m.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function Js(e){const t=e.root.querySelector("#roadmapDialogContent"),n=new Set(e.sim.state.unlockedZones),o=e.sim.getRequiredLevelTrial(),s=Dn.map(r=>{const l=n.has(r.id)||e.sim.state.sandboxMode,i=!l&&e.sim.state.level>=r.unlockLevel,d=qs(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${l?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${d>0?`🌟 ${d}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${i?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),a=Ii.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${o&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${o.icon} ${x(o.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${s}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${a.map(r=>{const l=e.sim.state.level>=r.level,i=r.unlockedItemIds.map(d=>re(d)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${i?`<span style="font-size:12px;margin-left:6px;">${i}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=Ps(r.dataset.camZone);fe(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),Js(e)})})}function Ie(e){const t=e.root.querySelector("#settingsDialogContent"),n=e.sim.state,o=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
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
                  <div style="font-size:12px;font-weight:800;">${r?r.label:`Bản Vẽ #${a+1}`}</div>
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
          ${["slot_1","slot_2","slot_3"].map((s,a)=>{const r=ta(s),l=!Ns()&&!!(r.ok&&(r.state?.sandboxMode||r.state?.sandboxTainted)),i=!!(r.ok&&!l);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${a+1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${l?"Ô lưu thử nghiệm (Đã khóa)":r.ok&&r.meta?`${x(r.meta.parkName)} • Cấp ${r.meta.level}`:"Ô trống"}</div>
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
    `,"switch"in HTMLInputElement.prototype||Tt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",s=>{n.settings.bgmEnabled=s.currentTarget.checked,e.sim.audio.bgmEnabled=n.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",s=>{n.settings.soundEnabled=s.currentTarget.checked,e.sim.audio.enabled=n.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",s=>{n.settings.cutawayMode=s.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",s=>{n.settings.showGrid=s.currentTarget.checked,e.refreshAll()}),t.querySelectorAll("[data-time]").forEach(s=>{s.addEventListener("click",()=>{n.settings.timeOverride=s.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ie(e)})}),t.querySelectorAll("[data-weather]").forEach(s=>{s.addEventListener("click",()=>{n.settings.weatherOverride=s.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ie(e)})}),t.querySelectorAll("[data-toon]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.toon==="on";e.sprites?.setToonEnabled(a),e.refreshAll(),Ie(e)})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),fe(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(s=>{s.addEventListener("input",()=>{const a=s.dataset.volBus,r=Math.max(0,Math.min(1,Number(s.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[a]=r,n.a11ySettings=l;const i=t.querySelector(`[data-vol-val="${a}"]`);i&&(i.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(s=>{s.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.colorblindMode=s.dataset.cbMode,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ie(e)})}),t.querySelectorAll("[data-font-scale]").forEach(s=>{s.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.fontScale=Number(s.dataset.fontScale),n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ie(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",s=>{const a=e.getEffectiveA11ySettings();a.highContrast=s.currentTarget.checked,n.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.saveLayout,r=e.sim.saveLayoutPreset(a);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ie(e)})}),t.querySelectorAll("[data-load-layout]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.loadLayout,r=e.sim.applyLayoutPreset(a);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ie(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const s=e.sim.stashAllDecorItems();e.showToast(s.msg,s.ok?"📦":"⚠️"),e.refreshAll(),Ie(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const s=e.sim.restoreAllStashedDecor();e.showToast(s.msg,s.ok?"🌸":"⚠️"),e.refreshAll(),Ie(e)}),t.querySelectorAll("[data-save-slot]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(a);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ie(e)})}),t.querySelectorAll("[data-load-slot]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(a);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function lo(e,t,n){t&&(e.activeSuitcaseTab=t),n&&(e.selectedSuitcaseHabitatUid=n),Te(e);const o=e.root.querySelector("#suitcaseDialog");o.open||o.showModal()}function co(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const n=e.sim.getSuitcaseReadySummary();n.badgeCount>0?(t.textContent=String(n.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function po(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=Date.now(),o=e.sim.state.suitcase,s=!!(o.activeIncubation&&n>=o.activeIncubation.endsAt),a=!!(o.activeExpedition&&n>=o.activeExpedition.endsAt);if((s!==e.lastSuitcaseIncReady||a!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){Te(e);return}if(o.activeIncubation&&n<o.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((o.activeIncubation.endsAt-n)/1e3)),l=Math.max(1e3,o.activeIncubation.endsAt-o.activeIncubation.startedAt),i=Math.min(100,Math.round((n-o.activeIncubation.startedAt)/l*100)),d=t.querySelector("[data-suitcase-inc-left]");d&&(d.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-inc-prog]");c&&(c.value=i)}if(o.activeExpedition&&n<o.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((o.activeExpedition.endsAt-n)/1e3)),l=Math.max(1e3,o.activeExpedition.endsAt-o.activeExpedition.startedAt),i=Math.min(100,Math.round((n-o.activeExpedition.startedAt)/l*100)),d=t.querySelector("[data-suitcase-exp-left]");d&&(d.textContent=`${r}s`);const c=t.querySelector("[data-suitcase-exp-prog]");c&&(c.value=i)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((Hs-(n-(r.lastGroomedAt??0)))/1e3)),i=Math.max(0,Math.ceil((Is-(n-(r.lastTrainedAt??0)))/1e3)),d=t.querySelector("#btnScGroom");d&&(d.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const c=t.querySelector("#btnScTrain");c&&(c.textContent=i>0?`🎾 (${i}s)`:"🎾 Tập (20G • +45💝)")}}}function Te(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=e.sim.state,o=n.suitcase,s=Date.now(),a=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!a.some(f=>f.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=a[0]?.building.uid??null);const r=new Set(o.discoveredMorphs),l=dn.length*3,i=r.size,d=Bi(i),c=n.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(o.activeIncubation&&s>=o.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(o.activeExpedition&&s>=o.activeExpedition.endsAt);const u=o.activeIncubation?s>=o.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",p=o.activeExpedition?s>=o.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${i}/${l}`,g=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${a.length}</strong></span>
        <span>📖 <strong>${i}/${l}</strong> (+${d}%)</span>
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
        `;else{const f=a.find(H=>H.building.uid===e.selectedSuitcaseHabitatUid)??a[0],k=f.building,$=f.item,L=Bt($.id)??dn[0],w=k.creatureMorph??"normal",E=Ne[w],M=k.creatureBondLevel??1,R=k.creatureBondXp??0,G=M>=yt?100:Di(M),q=M>=yt?100:R,F=Math.round((Zn(M)-1)*100),V=k.creatureNickname||$.creatureName||$.name,Z=e.sim.getBuildingProductionPerCycle(k,$),J=e.sim.biomeCache.get(k.uid),ce=Math.round(k.creatureHunger??90),Q=Math.max(8,Math.round($.cost*.04)),O=n.sandboxMode?0:Math.max(0,Math.ceil((Hs-(s-(k.lastGroomedAt??0)))/1e3)),A=n.sandboxMode?0:Math.max(0,Math.ceil((Is-(s-(k.lastTrainedAt??0)))/1e3)),N=o.activeExpedition?.habitatUid===k.uid;m=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${a.map(({building:H,item:U})=>{const se=Bt(U.id),K=H.creatureMorph??"normal",pe=Ne[K],me=H.creatureNickname||U.creatureName||U.name,le=H.uid===k.uid;return`
                  <button type="button" data-select-pet="${x(H.uid)}" aria-pressed="${le}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${se?.beastSpriteKey??U.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${pe.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${x(me)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${H.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${L.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${x(L.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${w==="radiant"?"radiant":w==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${E.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${x(V)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${L.beastSpriteKey}.png"
                  alt="${x(V)}"
                  class="suitcase-diorama-img"
                  style="filter:${E.cssFilter} drop-shadow(0 0 18px ${E.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${L.emoji} ${x(V)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${x(L.morphNames[w])}${N?" • 🧭":""}
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
                  placeholder="${x($.creatureName??$.name)}"
                  value="${x(k.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${M}/${yt} (+${F}%)</span>
                  <span style="color:#b45309;">${M>=yt?"MAX":`${R}/${G}`}</span>
                </div>
                <progress max="${G}" value="${q}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${x(L.favoriteTreat)} • <strong>+${Z.galleons.toLocaleString("vi-VN")}🪙 / ${xe($.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${ce}%</span>
                  <span>🌿 ${J?.score??60}% ${k.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${ce}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${n.sandboxMode?"0G":`${Q}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${O===0?"gold-cta":""}">
                  ${O>0?`🪮 (${O}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${A>0?`🎾 (${A}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const f=o.activeIncubation;let k="";if(f){const L=re(f.itemId),w=Bt(f.itemId),E=s>=f.endsAt,M=Math.max(0,Math.ceil((f.endsAt-s)/1e3)),R=Math.max(1e3,f.endsAt-f.startedAt),G=E?100:Math.min(100,Math.round((s-f.startedAt)/R*100));k=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${x(w?.speciesName??L?.name??"Trứng")}
                ${f.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${E?"✨ Nở!":`${M}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${G}" aria-label="Tiến độ ấp trứng"></progress>
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
        `;const $=a.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${a.map(({building:L,item:w})=>{const E=Bt(w.id),M=L.creatureMorph??"normal",R=e.sim.getMorphIncubationCost(w),G=L.creatureNickname||w.creatureName||w.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${E?.beastSpriteKey??w.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Ne[M].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${x(G)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Ne[M].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(q=>{const F=r.has(`${w.id}:${q}`);return`<span class="morph-pill ${F?q==="radiant"?"radiant":q==="mystic"?"mystic":"":"locked"}">${F?Ne[q].badge:`🔒 ${Ne[q].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${x(L.uid)}"
                        class="brass-btn ${f?"":"gold-cta"}"
                        ${f?"disabled":""}
                      >
                        ${f?"🥚 Đang ấp":`🥚 Ấp (${n.sandboxMode?"0G":`${R}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;m=`${k}${$}`}else{const f=o.activeExpedition;let k="";if(f){const L=pn.find(V=>V.id===f.expeditionId)??pn[0],w=n.buildings.find(V=>V.uid===f.habitatUid),E=w?re(w.itemId):void 0,M=w?.creatureNickname||E?.creatureName||"Thú cưng",R=s>=f.endsAt,G=Math.max(0,Math.ceil((f.endsAt-s)/1e3)),q=Math.max(1e3,f.endsAt-f.startedAt),F=R?100:Math.min(100,Math.round((s-f.startedAt)/q*100));k=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${L.emoji} ${x(M)} • ${x(L.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${R?"🎒 Đã về!":`${G}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${F}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${R?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(a.length===0)k=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const w=(a.find(M=>M.building.uid===e.selectedSuitcaseHabitatUid)??a[0]).building,E=Zn(w.creatureBondLevel??1)*Ne[w.creatureMorph??"normal"].incomeMult;k=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${a.map(({building:M,item:R})=>{const G=M.creatureNickname||R.creatureName||R.name,q=Ne[M.creatureMorph??"normal"].shortLabel;return`<option value="${x(M.uid)}" ${M.uid===w.uid?"selected":""}>${x(G)} (💝Lv.${M.creatureBondLevel??1} • ${q})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${pn.map(M=>{const R=!n.sandboxMode&&n.level<M.minParkLevel,G=Math.round(M.baseGold*E),q=Math.round(M.baseXp*E),F=(w.creatureBondLevel??1)>=5?1:0,V=M.guaranteedIngredients.map(Z=>`+${Z.qty+F} ${kt[Z.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${M.emoji} ${x(M.name)} <span style="font-size:11.5px;color:#78350f;">(${M.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${G}🪙 • +${q}⭐ • ${V}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${M.id}"
                    class="brass-btn ${R?"":"gold-cta"}"
                    ${R?"disabled":""}
                  >
                    ${R?`🔒 Lv.${M.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const $=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${i}/${l})</span>
            <span style="color:#15803d;">+${d}%</span>
          </div>
          <progress max="${l}" value="${i}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${dn.map(L=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${L.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${L.emoji} ${x(L.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(w=>{const E=r.has(`${L.habitatItemId}:${w}`);return`<span class="morph-pill ${E?w==="radiant"?"radiant":w==="mystic"?"mystic":"":"locked"}">${E?Ne[w].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;m=`${k}${$}`}t.innerHTML=`${g}${m}`,t.querySelectorAll("[data-sc-tab]").forEach(f=>{f.addEventListener("click",()=>{e.activeSuitcaseTab=f.dataset.scTab,Te(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(f=>{f.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=f.dataset.selectPet??null,Te(e)})});const b=t.querySelector("#formSuitcaseRename"),h=t.querySelector("#inpSuitcasePetName");if(h&&h.addEventListener("keydown",f=>{f.isComposing||f.stopPropagation()}),b&&h&&e.selectedSuitcaseHabitatUid){const f=e.selectedSuitcaseHabitatUid;b.addEventListener("submit",k=>{k.preventDefault();const $=e.sim.renameCreature(f,h.value);e.showToast($.msg,"🏷️"),Te(e)})}if(e.selectedSuitcaseHabitatUid){const f=e.selectedSuitcaseHabitatUid,k=()=>{const $=e.sim.groomCreature(f);e.showToast($.msg,$.ok?"🪮":"⏳"),Te(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",k),t.querySelector("#btnScGroom")?.addEventListener("click",k),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(f),Te(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const $=e.sim.trainCreatureTrick(f);e.showToast($.msg,$.ok?"🎾":"🪙"),Te(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const $=n.buildings.find(L=>L.uid===f);$&&(e.root.querySelector("#suitcaseDialog").close(),fe(e.cam,$.gx+1,$.gy+1),e.inspectSelection={kind:"building",uid:$.uid},e.renderInspector())})}const T=t.querySelector("#chkScStarlight");T&&T.addEventListener("change",()=>{e.useStarlightForIncubation=T.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(f=>{f.addEventListener("click",()=>{const k=f.dataset.incubateUid,$=e.useStarlightForIncubation&&(n.sandboxMode||(n.supply.ingredients.starlight_dust??0)>=1),L=e.sim.startMorphIncubation(k,$);e.showToast(L.msg,L.ok?"🥚":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const f=e.sim.speedUpIncubationWithSand();e.showToast(f.msg,f.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),Te(e)});const C=t.querySelector("#selScExpPet");C&&C.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=C.value,Te(e)}),t.querySelectorAll("[data-start-exp]").forEach(f=>{f.addEventListener("click",()=>{const k=f.dataset.startExp,$=e.selectedSuitcaseHabitatUid??a[0]?.building.uid;if(!$)return;const L=e.sim.startSuitcaseExpedition($,k);e.showToast(L.msg,L.ok?"🧭":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const f=e.sim.speedUpExpeditionWithSand();e.showToast(f.msg,f.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),Te(e)})}const uo="hpvn-burrow-garden",go=new Set(["auto","dawn","day","dusk","night"]),mo=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),ys=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function At(e,t){const n=typeof e=="string"?e.trim():"";if(!n||n==="null")return!1;if(typeof window<"u"&&window.location?.origin&&n===window.location.origin)return!0;const o=t&&t.length>0?[...ys,...t]:ys;for(const s of o)if(typeof s=="string"){if(s===n)return!0}else if(s.test(n))return!0;return!1}function ho(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const n=new URL(document.referrer).origin;if(At(n,t))return n}catch{}return null}function Ss(e){const t=String(e||"day").toLowerCase();return go.has(t)?t:"day"}function ws(e){const t=String(e||"clear").toLowerCase();return mo.has(t)?t:"clear"}function ei(e={}){const t=e.parkName||"Trang Trại Hang Sóc",n=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",o=Math.max(1,Math.floor(Number(e.level)||1)),s=Math.max(0,Math.floor(Number(e.magicStars)||0)),a=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",i=e.keeperTitle?` · [${e.keeperTitle}]`:"",d={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},c=e.weatherMode&&d[e.weatherMode]?` (${d[e.weatherMode]})`:"";return`🏰 [${t}${n} · Cấp ${o}${l}${i}]${c} — ${a}/10 vùng mở khóa, ${r} công trình & ${s} 🌟 Sao Phép Thuật!`}function bo(e={}){const t=[],n=e.win??(typeof window<"u"?window:void 0),o=e.nav??(typeof navigator<"u"?navigator:void 0);let s=ho(e.targetOrigin,e.allowedOrigins);function a(i,d={}){const c={source:uo,version:"25.1",type:i,payload:d,sentAt:Date.now()};t.push(c),t.length>24&&t.shift();try{const u=n?.parent;if(u&&u!==n&&typeof u.postMessage=="function"){const p=e.targetOrigin||s||"*";u.postMessage(c,p)}}catch{}return c}function r(i){const d=i;if(d.source!=null&&n?.parent!=null&&d.source!==n.parent)return;if(!e.allowAnyOrigin&&typeof d.origin=="string"&&d.origin.length>0){if(!At(d.origin,e.allowedOrigins))return;s=d.origin}const c=d?.data;if(!c||typeof c!="object")return;const u=c.payload&&typeof c.payload=="object"?c.payload:{};if(c.type==="hpvn:burrow:set-atmosphere"||c.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(Ss(u.mode??c.mode));else if(c.type==="hpvn:burrow:set-weather"||c.type==="hpvn:host:set-weather")e.onWeatherChange?.(ws(u.mode??c.mode));else if(c.type==="hpvn:burrow:set-event"||c.type==="hpvn:host:set-event")e.onEventChange?.(String(u.mode??c.mode??"auto"));else if(c.type==="hpvn:burrow:tour-garden"||c.type==="hpvn:host:tour-garden"){const p=u.tourId??c.tourId??null;p?e.onStartTour?.(String(p)):e.onStopTour?.()}else if(c.type==="hpvn:burrow:mute"||c.type==="hpvn:host:mute")e.onMuteChange?.(!!(u.muted??c.muted));else if(c.type==="hpvn:burrow:request-snapshot"||c.type==="hpvn:host:request-snapshot"){const p=e.getSnapshot?e.getSnapshot():{};a("hpvn:burrow:snapshot",p)}}n&&typeof n.addEventListener=="function"&&n.addEventListener("message",r);async function l(i={}){const d=ei(i),c=a("hpvn:burrow:share-floo",{text:d,level:i.level??1,parkName:i.parkName??"Trang Trại Hang Sóc",...i.playerName?{playerName:i.playerName}:{},...i.tourId?{tourId:i.tourId}:{},...i.image?{image:i.image}:{},atmosphereMode:Ss(i.atmosphereMode),weatherMode:ws(i.weatherMode),eventMode:i.eventMode??"auto"});if(typeof i.sendToFloo=="function"&&await i.sendToFloo(d,i)===!0)return e.notify?.(i.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:d,copied:!1,floo:!0,envelope:c};let u=!1;try{o?.clipboard?.writeText&&(await o.clipboard.writeText(d),u=!0)}catch{u=!1}return e.notify?.(u?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${d}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${d}"`),{ok:!0,text:d,copied:u,envelope:c}}return{notifyReady:(i={})=>a("hpvn:burrow:ready",i),syncState:(i={})=>a("hpvn:burrow:state",i),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{n&&typeof n.removeEventListener=="function"&&n.removeEventListener("message",r)}}}function Mn(e,t={},n){const a=n??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});a.width=640,a.height=380;const r=a.getContext("2d");if(!r)return a;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),i=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),d=Math.max(1,Math.floor(Number(t.level)||1)),c=t.house||"Gryffindor",u=Math.max(0,Math.floor(Number(t.magicStars)||0)),p=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),g=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const b={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(b,614,31),r.textAlign="left";const h=18,T=50,C=604,f=248;r.save(),r.beginPath(),r.rect(h,T,C,f),r.clip();let k=!1;if(e&&e.width>0&&e.height>0)try{const J=e.width/e.height,ce=C/f;let Q=0,O=0,A=e.width,N=e.height;J>ce?(A=Math.round(e.height*ce),Q=Math.round((e.width-A)/2)):(N=Math.round(e.width/ce),O=Math.round((e.height-N)/2)),r.drawImage(e,Q,O,A,N,h,T,C,f),k=!0}catch{k=!1}if(!k){const J=r.createLinearGradient(h,T,h,T+f);J.addColorStop(0,"#365843"),J.addColorStop(.55,"#598249"),J.addColorStop(1,"#334d2c"),r.fillStyle=J,r.fillRect(h,T,C,f)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(h,T,C,f);const $=18,L=304,w=604,E=58;r.fillStyle="#f6ebd2",r.fillRect($,L,w,E),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect($,L,w,E);const R={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[c]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${R} ${l} · Cấp ${d}`,$+14,L+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const G=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${i} · Nhà ${c}${G} · ${g}/10 vùng · ${p} công trình · ${u} 🌟`,$+14,L+42);const q=142,F=34,V=$+w-q-12,Z=L+12;return r.fillStyle="#1d5c4b",r.fillRect(V,Z,q,F),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(V,Z,q,F),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",V+q/2,Z+F/2+1),r.textAlign="left",a}function ti(e,t=.55){try{const n=e.toDataURL("image/webp",t);if(typeof n=="string"&&n.startsWith("data:image/webp"))return n;const o=e.toDataURL("image/png");return typeof o=="string"?o:""}catch{return""}}const fo={};function Be(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),n=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^n&15>>t/4).toString(16)})}function ni(e,t){const n=Math.max(1,Math.floor(Number(t)||1)),o=e.effectivePrice??e.price,s=e.dailyRemaining??e.dailyLimit;let a=0;for(let r=0;r<n;r++)r<s?a+=o:e.overflowMultiplier&&e.overflowMultiplier>1?a+=Math.ceil(o*e.overflowMultiplier):a+=o;return a}const vo=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function Jt(e,t={}){const n=e&&typeof e=="object"?e:{},o=n.details&&typeof n.details=="object"?n.details:{},s=String(n.reason||o.reason||"unknown-error"),a={...vo,...t.labels||{}};switch(s){case"missing-crops":{const r=Array.isArray(o.missing)?o.missing:[];if(r.length>0){const l=r.map(i=>{const d=String(i.resource||"");return`${Math.max(1,Number(i.required||0)-Number(i.have||0))} ${a[d]||d}`});return{reason:s,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:s,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof o.shortBy=="number"?o.shortBy:typeof o.required=="number"&&typeof o.spendable=="number"?Math.max(1,o.required-o.spendable):null;return{reason:s,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(o.required||0),l=Number(o.have||0),i=Math.max(1,r-l);return{reason:s,icon:"🌟",text:`Thiếu ${i} Sao Phép Thuật`}}case"missing-supply":{const r=String(o.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:s,icon:"🌱",item:l,text:`Thiếu hạt ${a[l]||l}`}}return{reason:s,icon:"💧",item:r,text:`Thiếu ${a[r]||"vật tư"}`}}case"wallet-frozen":return{reason:s,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:s,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:s,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:s,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:s,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:s,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:s,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:s,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:s,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:s,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:s,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:s,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:s,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:s,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:s,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(s==="model-rejected"&&typeof o.modelCode=="string"&&t.modelText){const r=t.modelText(o.modelCode);if(r)return{reason:s,icon:"🪄",text:r}}return{reason:s,icon:"🪄",text:n.message||"Máy chủ từ chối thao tác"}}}}function Pt(e){let t=null,n=null,o=Promise.resolve();const s=i=>{const d=o.then(i,i);return o=d.catch(()=>{}),d};async function a(i,d){const c=t?.catalogHash,u=c?{...d,catalogHash:c}:d,p=await e(i,u);if(!p||typeof p!="object"||!("garden"in p))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const g=p;return g.catalog===void 0&&c&&g.catalogHash===c&&(g.catalog=t?.catalog),t?.saleAdmin&&g.saleAdmin===void 0&&(g.saleAdmin=!0),t=g,t}async function r(i,d){const c=JSON.stringify({name:i,payload:d});if(n&&n.signature!==c)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");n||(n={signature:c,data:{...d,requestId:Be()}});try{const u=await a(i,n.data);return n=null,u}catch(u){throw u?.definitive===!0&&(n=null),u}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return n!==null},read:()=>s(()=>a("getBurrowGarden",{})),act:i=>s(()=>r("performBurrowAction",{...i,expectedRevision:l()})),free:(i,d={})=>s(()=>a("performBurrowAction",{...d,action:"freeAction",kind:i,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),guide:i=>s(()=>a("performBurrowAction",{action:"guideDone",lessonId:i,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),scene:i=>s(()=>a("performBurrowAction",{action:"setScene",scene:i,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),syncProfile:i=>s(()=>a("performBurrowAction",{...i,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),submitLeaderboard:i=>s(()=>a("performBurrowAction",{...i,action:"submitLeaderboard",expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),getLeaderboard:(i="match3")=>s(()=>a("performBurrowAction",{action:"getLeaderboard",gameId:i,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),visit:(i={})=>s(()=>e("visitBurrowGarden",i)),frame:i=>s(async()=>{const d=await e("setBurrowFlooFrame",{frameKey:i});return t&&Array.isArray(d.frames)&&typeof d.worn=="string"&&(t={...t,flooFrames:{frames:d.frames,worn:d.worn}}),d}),sales:(i={mode:"get"})=>s(()=>e("manageBurrowSales",i)),fireOut:i=>s(()=>e("extinguishBurrowGarden",{...i,requestId:Be()})),sell:(i,d)=>s(()=>r("sellBurrowGoods",i?{items:i,expectedTotal:d}:{clearance:!0,expectedTotal:d})),buy:(i,d=1)=>s(()=>{const c=t?.catalog?.find(u=>u.id===i);if(!c)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:i,quantity:d,catalogVersion:t?.catalogVersion,expectedTotal:ni(c,d)})}),settleWallet:i=>s(()=>a("settleBurrowWallet",{direction:i.direction,amount:Math.max(1,Math.floor(i.amount)),...i.reasonCode?{reasonCode:i.reasonCode}:{},...i.sourceType?{sourceType:i.sourceType}:{},...typeof i.clientLevel=="number"?{clientLevel:Math.floor(i.clientLevel)}:{},requestId:typeof i.requestId=="string"&&i.requestId?i.requestId:Be()})),houseCup:()=>s(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(i,d)=>s(()=>e("contributeBurrowHouseCup",{points:i,...d?{house:d}:{}})),postCoop:i=>s(()=>e("postBurrowCoopRequest",{...i,requestId:typeof i.requestId=="string"?i.requestId:Be()})),fulfillCoop:i=>s(()=>e("fulfillBurrowCoopRequest",i)),listCoop:i=>s(()=>e("getBurrowCoopRequests",i?{hostUid:i}:{}))}}const Fe="hpvn-burrow-game";function Vn(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const n=new URLSearchParams(t);return n.get("burrow-ticket")??n.get("hpvn-ticket")}function si(e,t=window,n={}){let o=0;const s=new Map;let a=n.targetOrigin&&n.targetOrigin!=="*"?n.targetOrigin:null;if(!a&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;At(l,n.allowedOrigins)&&(a=l)}catch{}t.addEventListener("message",l=>{if(!n.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!At(l.origin,n.allowedOrigins))return;a=l.origin}const i=l.data;if(l.source!==t.parent||!i||i.channel!==Fe||i.nonce!==e||typeof i.id!="string"||!s.has(i.id))return;const d=s.get(i.id);s.delete(i.id),d(i)});const r=Pt((l,i)=>new Promise((d,c)=>{const u=`burrow-${++o}`,p=setTimeout(()=>{s.delete(u),c(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);s.set(u,g=>{if(clearTimeout(p),"result"in g&&g.result&&typeof g.result=="object"){d(g.result);return}const m=new Error(typeof g.error=="string"?g.error:"Máy chủ từ chối thao tác.");m.definitive=g.definitive===!0,m.reason=typeof g.reason=="string"?g.reason:void 0,m.details=g.details&&typeof g.details=="object"?g.details:{},c(m)}),t.parent.postMessage({channel:Fe,nonce:e,id:u,action:"burrow",name:l,data:i},n.targetOrigin||a||"*")}));return r.host=(l,i={})=>new Promise(d=>{const c=`host-${++o}`,u=setTimeout(()=>{s.delete(c),d(null)},5e3);s.set(c,p=>{clearTimeout(u),d(p.result??null)}),t.parent.postMessage({...i,channel:Fe,nonce:e,id:c,action:l},n.targetOrigin||a||"*")}),r}function ii(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),n=e.sessionEndpoint??"/api/auth/session",o=e.fetchImpl??globalThis.fetch.bind(globalThis),s=e.getUid??pt,a=e.timeoutMs??18e3;let r=null,l=0;async function i(d){if(r&&Date.now()+3e4<l)return r;try{const c=typeof window<"u"?window:void 0,u=c?.__HPVN_CONFIG__?.getIdToken??c?.__HPVN_GET_ID_TOKEN__,p=u?await u().catch(()=>null):null,g=typeof window<"u"?Vn(window.location):null,m=await o(n,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":d,...p?{Authorization:`Bearer ${p}`}:{}},body:JSON.stringify({uid:d,...p?{idToken:p}:{},...g?{ticket:g}:{}})});if(!m.ok)return null;const b=await m.json();if(typeof b.uid=="string"&&b.uid&&!e.getUid&&Nn(b.uid),typeof b.token=="string"&&b.token)return r=b.token,l=Number(b.expiresAt||Date.now()+36e5),r}catch{}return null}return Pt(async(d,c)=>{const u=s(),p=await i(u),g=new AbortController,m=setTimeout(()=>g.abort(),a);let b;try{const T={"Content-Type":"application/json","X-User-Id":u};p&&(T.Authorization=`Bearer ${p}`),b=await o(`${t}${d}`,{method:"POST",headers:T,body:JSON.stringify({data:c}),signal:g.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(m)}const h=await b.json();if(h.error||!b.ok){const T=new Error(h.error?.message||`Máy chủ từ chối thao tác (${b.status}).`);throw T.definitive=b.status<500,T.reason=typeof h.error?.details?.reason=="string"?h.error.details.reason:void 0,T.details=h.error?.details??{},T}return h.result??{}})}const ai="asia-southeast1",_n="demo-hpvnn-burrow",yo="hpvnn-archive";function en(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function xs(e){const t=new TextEncoder().encode(e);let n="";for(let o=0;o<t.length;o++)n+=String.fromCharCode(t[o]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function oi(e,t=_n,n=globalThis.location,o=Date.now()){const s=n?.hostname??"127.0.0.1";if(!en(s))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const a=Math.floor(o/1e3),r=xs(JSON.stringify({alg:"none",typ:"JWT"})),l=xs(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:a,user_id:e,sub:e,iat:a,exp:a+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${l}.`}function So(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!en(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const n=e.host??(t?.hostname||"127.0.0.1");if(!en(n))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const o=e.projectId||_n,s=e.region||ai,a=e.port||5001,l=`${e.useSameOriginRewrite?"":`http://${n}:${a}`}/${o}/${s}/`,i=e.fetchImpl??globalThis.fetch.bind(globalThis),d=e.getUid??(()=>e.uid||pt()),c=e.now??(()=>Date.now()),u=e.timeoutMs??18e3;return Pt(async(p,g)=>{const m=d(),b=oi(m,o,{hostname:n},c()),h=new AbortController,T=setTimeout(()=>h.abort(),u);let C;try{C=await i(`${l}${p}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`},body:JSON.stringify({data:g}),signal:h.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout(T)}const f=await C.json();if(f.error||!C.ok){const k=new Error(f.error?.message||`Emulator từ chối thao tác (${C.status}).`);throw k.definitive=C.status<500,k.reason=typeof f.error?.details?.reason=="string"?f.error.details.reason:void 0,k.details=f.error?.details??{},k}return f.result??{}})}function ri(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),n=e.fetchImpl??globalThis.fetch.bind(globalThis),o=e.timeoutMs??2e4;return Pt(async(s,a)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,i=new AbortController,d=setTimeout(()=>i.abort(),o);let c;try{const p={"Content-Type":"application/json"};l?p.Authorization=`Bearer ${l}`:p["X-User-Id"]=pt(),c=await n(`${t}${s}`,{method:"POST",headers:p,body:JSON.stringify({data:a}),signal:i.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(d)}const u=await c.json();if(u.error||!c.ok){const p=new Error(u.error?.message||`Cloud Functions từ chối thao tác (${c.status}).`);throw p.definitive=c.status<500,p.reason=typeof u.error?.details?.reason=="string"?u.error.details.reason:void 0,p.details=u.error?.details??{},p}return u.result??{}})}function wo(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const n=async o=>{const s=o;if(!e.allowAnyOrigin&&typeof s.origin=="string"&&s.origin.length>0&&!At(s.origin,e.allowedOrigins))return;const a=s.data;if(!a||a.channel!==Fe||a.nonce!==e.nonce||typeof a.id!="string"||e.expectedSource&&s.source!==e.expectedSource)return;const r=s.source;if(!r||typeof r.postMessage!="function")return;const l=typeof s.origin=="string"&&s.origin.length>0&&s.origin!=="null"?s.origin:"*",i=a.id,d=String(a.action||"");if(d==="burrow"||d==="garden"){const c=String(a.name||""),u=a.data&&typeof a.data=="object"?a.data:{};try{const p=await e.transport(c,u);r.postMessage({channel:Fe,nonce:e.nonce,id:i,result:p},l)}catch(p){const g=p;r.postMessage({channel:Fe,nonce:e.nonce,id:i,error:g?.message||"Máy chủ từ chối thao tác.",definitive:g?.definitive===!0,reason:g?.reason,details:g?.details??{}},l)}return}try{const c=e.onHostAction?await e.onHostAction(d,a):{ok:!0};r.postMessage({channel:Fe,nonce:e.nonce,id:i,result:c},l)}catch(c){r.postMessage({channel:Fe,nonce:e.nonce,id:i,error:c instanceof Error?c.message:"Lỗi xử lý lệnh host.",definitive:!0},l)}};return t.addEventListener("message",n),()=>{t.removeEventListener("message",n)}}function ut(){if(typeof window<"u"){const e=Vn(window.location);if(e)return si(e,window);const t=new URLSearchParams(window.location.search);t.get("emulator"),t.get("functionsPort");const n=window.__HPVN_CONFIG__,o=fo?.VITE_HPVN_FUNCTIONS_URL,s=n?.functionsBaseUrl||o;if(s)return ri({functionsBaseUrl:s,getIdToken:n?.getIdToken})}return ii()}let Ts=Promise.resolve();async function xo(e,t){const n=typeof navigator<"u"?navigator:void 0,o=n&&"locks"in n?n.locks:void 0;if(o&&typeof o.request=="function")return o.request(e,async()=>t());const s=Ts.then(t,t);return Ts=s.catch(()=>{}),s}function To(e){const t=`${e.scope}-save-envelope`,n=e.persistent!==!1,o=e.storage??globalThis.localStorage,s=e.legacyKeys??[];let a={},r=null;function l(){if(r)return r;if(!n||!o)return a;const d=o.getItem(t);if(d!==null){const u=JSON.parse(d);if(!u||typeof u!="object"||Array.isArray(u))throw new Error("Bản lưu thung lũng không hợp lệ.");return u}const c={};for(const u of s){const p=o.getItem(u);p!==null&&(c[u]=p)}return c}function i(d){n&&o?o.setItem(t,JSON.stringify(d)):a=d}return{storageKey:t,getItem(d){return l()[d]??null},setItem(d,c){r?r[d]=String(c):i({...l(),[d]:String(c)})},transaction(d){if(r)return d();r={...l()};try{const c=d();return i(r),c}finally{r=null}}}}async function $o(e=ut()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const n=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(n.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(n.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(n.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(n.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function Co(e,t,n=ut()){const o=await n.contributeHouseCup(e,t);if(!o||typeof o!="object")return null;const s=o.totals&&typeof o.totals=="object"?o.totals:{};return{weekKey:String(o.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(s.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(s.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(s.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(s.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(o.playerContribution)||0)),updatedAt:Number(o.updatedAt)||Date.now()}}async function ko(e,t=ut()){return t.postCoop(e)}async function Mo(e,t=ut()){return t.fulfillCoop(e)}const Lo=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:Fe,HPVN_DEFAULT_EMULATOR_PROJECT:_n,HPVN_FIREBASE_REGION:ai,HPVN_PROD_FIREBASE_PROJECT:yo,attachHpvnParentShellResponder:wo,computeClientPackTotal:ni,contributeWeeklyHouseCupOnline:Co,createAtomicGardenStorage:To,createAutoAuthoritativeClient:ut,createBurrowGardenClient:Pt,createEmulatorFixtureToken:oi,createFirebaseEmulatorClient:So,createFirebaseFunctionsClient:ri,createHpvnEmbedClient:si,createHttpAuthoritativeClient:ii,fetchWeeklyHouseCupStandingsOnline:$o,formatServerRefusalVi:Jt,fulfillCoopAssistanceOnline:Mo,generateRequestId:Be,getHpvnTicketFromLocation:Vn,isLocalDevelopmentHost:en,postCoopAssistanceOnline:ko,runWithStorageLock:xo},Symbol.toStringTag,{value:"Module"})),Ao="/api/track",Eo=25,Po=3e4;class qo{constructor(t={}){S(this,"endpoint");S(this,"batchSize");S(this,"batchIntervalMs");S(this,"queue",[]);S(this,"timer",null);S(this,"lastLevel",null);S(this,"isFlushing",!1);S(this,"isInitialized",!1);this.endpoint=t.endpoint||Ao,this.batchSize=t.batchSize||Eo,this.batchIntervalMs=t.batchIntervalMs||Po}track(t,n){const o={id:this.generateEventId(),name:t,props:n?{...n}:void 0,timestamp:Date.now()};this.queue.push(o),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const n=this.queue.splice(0,this.queue.length);if(n.length===0)return;const o={events:n,sentAt:Date.now()},s=JSON.stringify(o);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const a=new Blob([s],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,a))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:s,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",n=>{this.handleGameTick(n)}),window.addEventListener("gamesave:uploaded",n=>{const o=n;this.track("save_uploaded",o.detail||{})});else if(t){const n=t.onUploadSuccess;t.onUploadSuccess=o=>{if(n)try{n(o)}catch{}this.track("save_uploaded",o)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",n="unknown",o="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,n=navigator.language||"vi",o=navigator.userAgent||""),this.track("session_start",{screen:t,language:n,userAgent:o,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const o=t.detail;o&&(this.track("game:tick",{level:o.level,galleons:o.galleons}),typeof o.level=="number"&&(this.lastLevel!==null&&o.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:o.level}),this.lastLevel=o.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class Ho{constructor(t,n={}){S(this,"analytics");S(this,"maxErrorsPerSession");S(this,"isListening",!1);S(this,"seenSignatures",new Set);S(this,"errorCountThisSession",0);S(this,"handleError",t=>{const n=t.message||(t.error?String(t.error):"Uncaught runtime error"),o=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",s=t.filename||(typeof window<"u"?window.location.href:""),a={msg:n,stack:o,url:s,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(a),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});S(this,"handleUnhandledRejection",t=>{const n=t.reason,o=n instanceof Error,s=o?n.message:n?String(n):"Unhandled promise rejection",a=o&&n.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:s,stack:a,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",n)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,n.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const n=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(n)){this.seenSignatures.add(n),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class Io{constructor(){S(this,"buttonEl",null);S(this,"dialogEl",null);S(this,"activeTab","privacy");S(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const n=this.dialogEl.querySelector(".legal-confirm-btn");n&&n.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",s=>{s.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-tab");a&&this.switchTab(a)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(s=>{const a=s.getAttribute("data-tab")===t;s.setAttribute("aria-selected",a?"true":"false"),s.setAttribute("data-active",a?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(s=>{const a=s.getAttribute("data-panel")===t;s.setAttribute("data-active",a?"true":"false"),s.style.display=a?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}function Bo(e){ia({fetchLeaderboards:async t=>{const n=await e.getLeaderboard(t);return Kt(n.leaderboards),n.leaderboards??null},submitLeaderboard:async t=>{const n=await e.submitLeaderboard(t);return Kt(n.leaderboards),n.leaderboards??null}})}class Do{constructor(){S(this,"cloudSave");S(this,"analytics");S(this,"errorMonitor");S(this,"legalModal");S(this,"authoritativeClient");S(this,"hpvnBridge");S(this,"isInitialized",!1);S(this,"lastAuthoritativeWalletBalance",null);S(this,"walletSyncTimer",null);S(this,"isApplyingServerWallet",!1);S(this,"boundSim",null);this.cloudSave=new na,this.analytics=new qo,this.errorMonitor=new Ho(this.analytics),this.legalModal=new Io,this.authoritativeClient=ut(),this.hpvnBridge=bo({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(Os):null;if(!t)return{};const n=JSON.parse(t),o=n.match3&&typeof n.match3=="object"?n.match3:null,s=n.settings&&typeof n.settings=="object"?n.settings:null;return{version:Number(n.version||3),parkName:String(n.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(n.level)||1)),xp:Math.max(0,Math.floor(Number(n.xp)||0)),magicStars:Math.max(0,Math.floor(Number(o?.stars??n.magicStars)||0)),unlockedZonesCount:Array.isArray(n.unlockedZones)?n.unlockedZones.length:1,buildingsCount:Array.isArray(n.buildings)?n.buildings.length:0,weatherMode:String(s?.weatherOverride||n.weatherMode||"auto"),atmosphereMode:String(s?.timeOverride||n.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount(),this.cloudSave.init(),Bo(this.authoritativeClient),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",t=>{const n=t.detail;n&&typeof n=="object"&&this.hpvnBridge.syncState(n)}),window.addEventListener("hpvn:share-floo",t=>{const n=t.detail??{};this.hpvnBridge.shareToFloo({...n,sendToFloo:n.sendToFloo??(async(o,s)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const a=await this.authoritativeClient.host("floo-share",{text:o,...s.image?{image:s.image}:{},...s.tourId?{tourId:s.tourId}:{}});return!!(a&&typeof a=="object"&&a.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",t=>{const n=t.detail;n?.hostUid&&this.authoritativeClient.visit({hostUid:n.hostUid,help:!0,buildingUid:n.buildingUid,kind:n.kind||"water_crop",noteText:n.noteText,helperName:n.helperName,helperEmoji:n.helperEmoji}).catch(()=>{})})),(typeof navigator>"u"||navigator.onLine)&&this.authoritativeClient.read().then(t=>{if(Kt(t.leaderboards),t.wallet&&typeof t.wallet.spendable=="number"&&this.syncWalletBaseline(t.wallet.spendable),typeof t.uid=="string"&&t.uid){const n=this.cloudSave.getUserId(),o=Nn(t.uid);o!==n&&sa(o).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:t}))}).catch(()=>{}),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,n={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const o=t.saveToStorage.bind(t),s=Math.max(0,n.debounceMs??180),a=i=>{const d=Math.max(0,Math.floor(i));this.syncWalletBaseline(d),this.isApplyingServerWallet=!0;try{const c=t.homeStateWhileVisiting??t.state;!c.sandboxMode&&!c.sandboxTainted&&(c.galleons=d,t.homeStateWhileVisiting&&(t.state.galleons=d),o(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const i=t.homeStateWhileVisiting??t.state;if(i.sandboxMode||i.sandboxTainted||t.isHeadmasterPreview)return;const d=Math.max(0,Math.floor(Number(i.galleons)||0)),c=d-this.lastAuthoritativeWalletBalance;if(c===0)return;const u=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=d;const p=c<0?"debit":"credit";let g=Math.abs(c);const m=p==="credit"?1e3:5e4;try{let b=null;for(;g>0;){const h=Math.min(g,m);g-=h,b=await this.authoritativeClient.settleWallet({direction:p,amount:h,reasonCode:p==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:p==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(i.level)||1))})}b?.wallet&&typeof b.wallet.spendable=="number"&&(a(b.wallet.spendable),n.onSnapshot?.(b))}catch(b){const h=b;if(h?.definitive===!0){const T=Jt(h);n.onToast?.(`🏦 Gringotts HPVN: ${T.text}`,T.icon);const C=h.details?.spendable;typeof C=="number"&&Number.isFinite(C)?a(C):await this.authoritativeClient.read().then(f=>{f.wallet&&typeof f.wallet.spendable=="number"&&a(f.wallet.spendable)}).catch(()=>{a(u)})}else this.lastAuthoritativeWalletBalance=u}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const i=t.homeStateWhileVisiting??t.state;i.sandboxMode||i.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(i.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),s===0?r():this.walletSyncTimer=setTimeout(()=>{r()},s))};return t.saveToStorage=()=>{o(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=o,this.boundSim===t&&(this.boundSim=null)}}}const qe=new Do;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{qe.init()},{once:!0}):qe.init());const jt={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},Ln={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Un(e){return e.sim.getPlayerHouse()}function rt(e,t,n=""){const o=ga(e),s=(t||"🧙").trim().slice(0,2);return o?`<span class="floo-avatar-shell ${n}"><img src="${x(o)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${x(s)}</span></span>`:`<span class="floo-avatar-shell ${n}"><span class="floo-avatar-fallback">${x(s)}</span></span>`}function li(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Wt(e){const t=e.sim.ensureNeighborSocial(),n=Un(e),o=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:o,level:e.sim.state.level,house:n,keeperTitle:As(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function jn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}const $s=new Set;function ci(e,t){if(!t||typeof t!="object")return;const n=t,o=e.sim.ensureNeighborSocial(),s=e.sim.homeStateWhileVisiting??e.sim.state;let a=!1;typeof n.uid=="string"&&n.uid.trim()&&Nn(n.uid),Kt(n.leaderboards)&&(a=!0);const r=typeof n.garden?.progression?.friendCode=="string"&&n.garden.progression.friendCode.trim()||(n.profile&&typeof n.profile=="object"&&typeof n.profile.friendCode=="string"?String(n.profile.friendCode).trim():"");if(r&&o.playerFriendCode!==r&&(o.playerFriendCode=r,a=!0),n.wallet&&typeof n.wallet.spendable=="number"&&Number.isFinite(n.wallet.spendable)){const u=Math.max(0,Math.floor(n.wallet.spendable));if(qe.syncWalletBaseline(u),!s.sandboxMode&&!s.sandboxTainted&&!e.sim.isHeadmasterPreview){const p=!!n.receipt,g=oa(s);(p||g||u>=s.galleons)&&s.galleons!==u&&(s.galleons=u,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=u),a=!0)}}const l=n.profile&&typeof n.profile=="object"?n.profile:null,i=ra(l?.house??n.garden?.progression?.house),d=String(l?.houseSource??n.garden?.progression?.houseSource??"");if(i){const u=d==="hpvn",p=s.minigameLeaderboard;(u||!p?.playerHouseExplicit)&&(p?.playerHouse!==i||!!p?.playerHouseLockedByServer!==u)&&(cs(s,i,{lockedByServer:u}),e.sim.homeStateWhileVisiting&&cs(e.sim.state,i,{lockedByServer:u}),a=!0)}if(l){const u=typeof l.username=="string"?l.username.trim():"";u&&u!=="Phù Thủy Hang Sóc"&&u!=="Trang Trại Hang Sóc"&&!o.playerDisplayName&&(o.playerDisplayName=u,a=!0);const p=typeof l.avatarUrl=="string"?l.avatarUrl.trim():"";p&&o.playerAvatarUrl!==p&&(o.playerAvatarUrl=p,a=!0)}if(typeof n.uid=="string"&&n.uid.trim()&&!$s.has(n.uid)&&!s.sandboxMode&&!s.sandboxTainted&&!e.sim.isHeadmasterPreview){$s.add(n.uid);const u=Math.max(0,s.match3?.maxClearedLevel??Math.max(0,(s.match3?.currentLevel??1)-1)),p=Math.max(0,s.puzzleArcade?.sudokuCleared??0),g=Math.max(0,s.puzzleArcade?.blockCleared??0),m=Math.max(0,s.puzzleArcade?.jigsawCleared??0);(u>0||p>0||g>0||m>0)&&Bs(s).catch(()=>{})}const c=n.daily&&typeof n.daily=="object"?n.daily:null;if(c&&typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(He,Math.floor(c.helpsLeft)));const u=Math.max(0,He-e.flooHelpsLeft);u>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=u,a=!0)}if(Array.isArray(n.helpers)&&n.helpers.length>0){e.flooHelpersToday=n.helpers.map(p=>({uid:String(p.uid||""),name:String(p.name||"Bạn HPVN"),avatarEmoji:p.avatarEmoji,avatarUrl:p.avatarUrl,at:Number(p.at||0)}));const u=la(e.flooHelpersToday,o.lastSeenHelperAt??0);u&&u.textVi&&u.seenAt>(o.lastSeenHelperAt??0)&&(o.lastSeenHelperAt=u.seenAt,a=!0,e.showToast(u.textVi,"🤝"))}if(n.houseCup&&typeof n.houseCup=="object"){const u=n.houseCup,p=u.houses&&typeof u.houses=="object"?u.houses:null;p&&typeof u.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:u.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(p.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(p.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(p.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(p.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(u.memberTodayPoints)||0)),updatedAt:Date.now()},a=!0)}a&&(e.sim.saveToStorage(),e.refreshAll())}async function Et(e,t=!1){if(e.flooLoading)return;const n=Date.now();if(!t&&e.flooLastLoadedAt>0&&n-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const o=e.sim.ensureNeighborSocial(),s=Un(e),a=o.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;if(r||aa(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r){const c=e.sim.state.minigameLeaderboard,u=!!c?.playerHouseExplicit&&!c?.playerHouseLockedByServer;await qe.authoritativeClient.syncProfile({playerName:a,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:o.playerAvatarUrl||"",avatarEmoji:Ln[s],...u?{house:s,houseExplicit:!0}:{},level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(p=>ci(e,p)).catch(()=>{})}const l=await qe.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(He,Math.floor(l.helpsLeft)));const c=Math.max(0,He-e.flooHelpsLeft);c>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=c)}const i=Array.isArray(l.visits)?l.visits:[],d=_t(i,Date.now());e.flooDirectoryRows=d,e.flooQueueRows.length===0&&(e.flooQueueRows=d),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(d,pt())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&$e(e),e.renderVisitorDockBar()}}function An(e){const t=Wt(e),n=Mn(e.gameCanvas,t),o=ti(n,.55),s=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:pt(),image:o||void 0}})),s.rewarded&&e.showToast(s.msg,"🔥"),e.refreshAll()}function di(e,t,n){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),n&&(e.focusedNeighborId=n),(e.sim.state.level>=Ke||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Et(e),$e(e);const s=e.root.querySelector("#neighborDialog");s&&!s.open&&s.showModal(),n&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${n}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function pi(e,t){e.closeHudPopovers();const n=e.root.querySelector("#neighborDialog");n?.open&&n.close(),t.kind==="match3"?e.getMatch3Modal().then(o=>o.openRescue(t)):e.getPuzzleArcadeModal().then(o=>o.openRescue(t))}function sn(e,t){jn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterHonorGardenTour(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Ze(e,t,n){const o=String(t||"").trim();if(!o)return;if(o.startsWith("tour_")){sn(e,o);return}n&&n.length>0?e.flooQueueRows=[...n]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),jn(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const a=o.startsWith("player_")?o:`player_${o}`,r=o.startsWith("player_")?o.slice(7):o;(async()=>{try{const i=await qe.authoritativeClient.visit({hostUid:r});typeof i.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(He,Math.floor(i.helpsLeft))));const d=i.visit&&typeof i.visit=="object"?i.visit:null;if(d){const c=d.progression&&typeof d.progression=="object"?d.progression:void 0,u=Date.now(),p=Array.isArray(c?.timers)?c.timers.filter(T=>Number(T.readyAt||0)>u).length:0,g=d.decorations&&typeof d.decorations=="object"?d.decorations:void 0,m={uid:String(d.uid||r),friendCode:typeof d.friendCode=="string"?d.friendCode:void 0,username:String(d.username||"Thành Viên HPVN"),parkName:String(d.parkName||"Thung Lũng Phép Thuật"),house:d.house||"Gryffindor",avatarEmoji:typeof d.avatarEmoji=="string"?d.avatarEmoji:void 0,avatarUrl:typeof d.avatarUrl=="string"?d.avatarUrl:void 0,level:Math.max(1,Number(d.level||1)),growing:p,helped:!!d.helped,hostHelpsLeft:typeof d.hostHelpsLeft=="number"?d.hostHelpsLeft:10,fire:d.fire&&typeof d.fire=="object"?d.fire:null,scene:g?.scene},b=e.sim.syncFlooDirectoryMembers([m],pt()),h=d.rawClientSave&&typeof d.rawClientSave=="object"?d.rawClientSave:null;if(b[0]&&h){if(Array.isArray(h.buildings)&&h.buildings.length>0){const T=h.buildings.filter(C=>C&&typeof C.itemId=="string"&&!!re(C.itemId));T.length>0&&(b[0].valleyBuildings=T)}h.tileOverrides&&typeof h.tileOverrides=="object"&&(b[0].valleyTileOverrides=h.tileOverrides),Array.isArray(h.unlockedZones)&&h.unlockedZones.length>0&&(b[0].valleyUnlockedZones=h.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(a);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function ui(e,t){if(t.startsWith("tour_")){sn(e,t);return}jn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const o=e.sim.enterNeighborVisit(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),fe(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function tn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const n=new URLSearchParams(window.location.search);if(n.has("visit")||n.has("tour")){n.delete("visit"),n.delete("tour");const o=n.toString();window.history.replaceState(null,"",`${window.location.pathname}${o?`?${o}`:""}${window.location.hash}`)}}e.refreshAll()}function No(e){const t=e.sim.ensureNeighborSocial(),n=t.playerOwlHelpRequests.filter(d=>!!d.fulfilledAt).length,o=t.playerMinigameSos?.rescuedAt??0,s=!!t.playerMinigameSos?.claimed,a=`${t.lastSocialResetKey}|${t.friendshipTokens}|${n}|${o}|${s}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(a===e.lastSocialLiveSig)return;e.lastSocialLiveSig=a,gi(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),i=document.activeElement?.id??"";l?.open&&i!=="inpFlooDisplayName"&&$e(e)}function gi(e){const t=e.sim.ensureNeighborSocial(),n=Math.floor(t.friendshipTokens/Ye),o=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,s=t.homeLanternMarks.length,a=n+o+s,l=Math.max(0,wt-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(u=>u.minigameSos&&!u.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(u.id)).length:0,i=e.sim.state.level>=Ke&&(t.dailyGardenHelpsCount??0)<He?e.flooDirectoryRows.filter(u=>Mt(u)).length:0,d=e.root.querySelector("#badgeNeighborCount");if(d){const u=a>0?a:l>0?l:i;u>0?(d.textContent=String(u),d.classList.toggle("is-ready-green",a>0),d.classList.remove("hidden")):d.classList.add("hidden")}const c=e.root.querySelector("#badgeManageNeighborCount");c&&(a>0?(c.textContent=String(a),c.classList.remove("hidden")):c.classList.add("hidden"))}function Oo(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.getActiveHonorGardenTour();if(n){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${x(n.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${x(n.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${n.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${x(n.ownerName)} · ${x(jt[n.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const $=e.sim.cycleHonorGardenTour(-1);$.ok&&typeof $.focusGx=="number"&&typeof $.focusGy=="number"&&(e.onCameraJump?.(),fe(e.cam,$.focusGx,$.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const $=e.sim.cycleHonorGardenTour(1);$.ok&&typeof $.focusGx=="number"&&typeof $.focusGy=="number"&&(e.onCameraJump?.(),fe(e.cam,$.focusGx,$.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{An(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{tn(e)});return}const o=e.sim.getActiveVisitingNeighbor();if(!o){t.classList.add("hidden"),t.innerHTML="";return}const s=e.sim.ensureNeighborSocial(),a=Date.now(),r=Math.min(He,Math.max(s.dailyGardenHelpsCount??0,o.helpedViaFlooToday?1:o.helpedMarksToday.length)),l=Math.max(0,He-r),i=!!(o.helpedViaFlooToday||o.helpedMarksToday.length>0),d=(o.hostHelpsLeft??10)<=0,c=!!(o.fireUntilMs&&o.fireUntilMs>a),u=!i&&l>0&&!d,p=s.dailyLikedNeighborIds.includes(o.id),g=s.dailyMysteryClaimedIds.includes(o.id),m=o.owlHelpCrates.filter($=>!$.fulfilledByPlayerToday).length,b=e.sim.canRescueNeighborMinigame(o.id).ok,h=m+(b?1:0),T=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,C=o.remoteUserId||o.id.replace(/^player_/,""),f=T.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${T.slice(0,12).map($=>{const L=$.uid===C,w=Mt($,a),E=!!($.fire&&$.fire.until>a);return`
                <button
                  type="button"
                  class="floo-strip-dot ${L?"is-current":""} ${w?"is-helpable":""} ${E?"is-fire":""}"
                  data-floo-jump="${x($.uid)}"
                  title="${x($.username)} (Lv.${$.level})"
                >
                  ${rt($.avatarUrl,$.avatarEmoji||$.username,"floo-strip-avatar")}
                  ${E?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",k=i?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":d?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${f}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${rt(o.avatarUrl,o.avatarEmoji||o.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${x(o.name)}</strong>
            <span class="visitor-lv-tag">Lv.${o.level}</span>
            ${c?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${He}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${s.friendshipTokens}/${Ye}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${T.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
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
  `,li(t),t.querySelectorAll("[data-floo-jump]").forEach($=>{$.addEventListener("click",()=>{const L=$.dataset.flooJump;L&&L!==C&&Ze(e,L,T)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const $=t.querySelector("#btnVisitorFlooHelp");$&&($.disabled=!0);let L;if(o.remoteUserId)try{const M=ca(s.selectedPresetNoteId),R=await qe.authoritativeClient.visit({hostUid:o.remoteUserId,help:!0,kind:"water_crop",noteText:M.textVi});typeof R.helpsLeft=="number"&&(L=R.helpsLeft,e.flooHelpsLeft=R.helpsLeft)}catch(M){const R=Jt(M);if(R.reason==="already-helped"||R.reason==="daily-help-cap"||R.reason==="host-help-cap"){e.showToast(`${R.icon} ${R.text}`,R.icon),Et(e,!0),e.refreshAll();return}}const w=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:L});if(!w.ok){e.showToast(w.msg,"🤝"),e.refreshAll();return}const E=M=>M.map(R=>R.uid===C?{...R,helped:!0}:R);if(e.flooDirectoryRows=E(e.flooDirectoryRows),e.flooQueueRows=E(e.flooQueueRows),e.refreshAll(),w.helpsLeft>0&&e.flooQueueRows.length>1){const M=gn(e.flooQueueRows,C,1);M&&M.uid!==C&&Mt(M)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===o.id&&Ze(e,M.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const $=t.querySelector("#btnVisitorExtinguish");$&&($.disabled=!0);try{let L=0;if(o.remoteUserId){const E=await qe.authoritativeClient.fireOut({hostUid:o.remoteUserId});L=Math.max(0,Math.floor(Number(E?.price||0)))}if(L>0){const E=e.sim.homeStateWhileVisiting??e.sim.state;E.galleons=Math.max(0,E.galleons-L),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=E.galleons)}o.fireUntilMs=0;const w=E=>E.map(M=>M.uid===C?{...M,fire:null}:M);e.flooDirectoryRows=w(e.flooDirectoryRows),e.flooQueueRows=w(e.flooQueueRows),e.showToast(L>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name} (-${L} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(L){const w=Jt(L);e.showToast(`${w.icon} ${w.text}`,w.icon),$&&($.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const $=e.sim.likeVisitedNeighborFarm();$.ok||e.showToast($.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{g||(e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,o.mysteryGiftGx+.5,o.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{di(e,"friends",o.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const $=gn(T,C,-1);$&&$.uid!==C&&Ze(e,$.uid,T)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(T.length>1){const L=gn(T,C,1);if(L&&L.uid!==C){Ze(e,L.uid,T);return}}const $=e.sim.cycleNextNeighborVisit();$.ok&&typeof $.focusGx=="number"&&typeof $.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),fe(e.cam,$.focusGx,$.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{tn(e)})}function $e(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const n=e.sim.ensureNeighborSocial(),o=e.sim.getActiveVisitingNeighbor(),s=e.sim.getActiveHonorGardenTour(),a=Date.now(),r=Un(e),l=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",i=Math.min(He,Math.max(0,n.dailyGardenHelpsCount??0)),d=Math.max(0,He-i),c=Math.max(0,wt-n.dailyRescuesGivenIds.length),u=Math.max(0,wt-n.dailyRescuesReceivedCount),p=Math.max(0,Vt-n.dailyOwlHelpRequestedCount),g=n.friendshipTokens>=Ye,m=Math.min(100,Math.round(n.friendshipTokens/Ye*100)),b=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,h=e.sim.state.level>=Ke||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,T=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${n.friendshipTokens}/${Ye}</strong>
        ${g?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${d}/${He}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${c}/${wt}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${p}/${Vt}</strong></span>
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
        🎁 Rương &amp; SOS ${g||b?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${n.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let f="";if(e.activeNeighborTab==="friends"){const w=[];if(b?.rescuedAt){const G=mn(b.kind);w.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${x(b.rescuerEmoji??"🦉")} ${x(b.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${G.icon} Màn ${b.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(b){const G=mn(b.kind);w.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${G.icon} Màn ${b.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}n.homeLanternMarks.length>0&&w.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${n.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${n.homeLanternMarks.length}🍀)</button>
        </div>
      `);const E=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${rt(n.playerAvatarUrl,Ln[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${jt[r]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${x(l)}"
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
    `;let M="";if(h){const G=_t(e.flooDirectoryRows,a),q=G.filter(O=>Mt(O,a)).length,F=[...e.flooHelpersToday,...n.homeLanternMarks.map(O=>({uid:O.helperId,name:O.helperName,avatarEmoji:O.helperEmoji,avatarUrl:O.helperAvatarUrl,at:O.createdAt}))],V=Array.from(new Map(F.map(O=>[O.uid||O.name,O])).values()),Z=V.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${V.slice(0,6).map(O=>rt(O.avatarUrl,O.avatarEmoji||O.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${x(da(V))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${V.length*15} phút</strong>!
              </div>
            </div>
          `:"",J=G.length>0?`
            <div class="floo-portal-grid" role="list">
              ${G.map(O=>{const A=!!(O.fire&&O.fire.until>a),N=Mt(O,a),P=o?.remoteUserId===O.uid||o?.id===`player_${O.uid}`,H=A?"🔥 Đang cháy · cần dập!":O.helped?"✓ Đã chăm giúp":O.growing>0?`🌱 ${O.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${A?"is-fire":""} ${N?"is-helpable":""} ${O.helped?"is-helped":""} ${P?"is-visiting":""}"
                      data-floo-portal="${x(O.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${rt(O.avatarUrl,O.avatarEmoji||O.username,"floo-portal-avatar")}
                        ${A?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${O.level}</span>
                      </div>
                      <strong class="floo-portal-name">${x(O.username)}</strong>
                      <span class="floo-portal-park">${x((O.house?Ln[O.house]:"")||"🪄")} ${x(O.parkName||"")}</span>
                      <span class="floo-portal-status">${H}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,ce=n.neighbors.filter(O=>O.owlHelpCrates.some(A=>!A.fulfilledByPlayerToday)||!!(O.minigameSos&&!O.minigameSos.rescuedToday)),Q=ce.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${ce.slice(0,6).map(O=>{const A=e.sim.canRescueNeighborMinigame(O.id),N=O.minigameSos,P=N?mn(N.kind):null,H=!!(N&&(N.rescuedToday||n.dailyRescuesGivenIds.includes(O.id))),U=O.owlHelpCrates.filter(K=>!K.fulfilledByPlayerToday).map(K=>{const pe=Oe(K.itemId),me=e.sim.getFarmItemCount(K.itemId),le=e.sim.state.sandboxMode||me>=K.qty;return`
                          <div class="nb-crate-item">
                            <img src="${pe.iconSrc}" alt="${x(pe.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${K.qty} ${x(pe.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":me}/${K.qty})</span></div>
                              <div class="nb-crate-rew">+${K.rewardTokens}🍀 • +${K.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${le?"gold-cta":""} nb-mini-cta" data-nb-crate="${x(O.id)}|${x(K.id)}" ${le?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),se=N&&P&&!H?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${P.icon} ${x(P.nameVi)} • <strong>Màn ${N.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${x(O.id)}" ${A.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===O.id?"focused":""}" data-neighbor-card="${x(O.id)}">
                        <div class="nb-card-head">
                          ${rt(O.avatarUrl,O.avatarEmoji||O.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${x(O.name)}</strong>
                              <span class="nb-badge-pill">Lv.${O.level}</span>
                              <span class="nb-badge-pill house">${jt[O.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${x(O.id)}">🔥 Bay tới</button>
                        </div>
                        ${U?`<div class="nb-coop-section"><div class="nb-crate-list">${U}</div></div>`:""}
                        ${se}
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
                Còn <strong>${d}/${He} lượt chăm giúp</strong> hôm nay · <strong>${q}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"⏳…":"🔄"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${G.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${Z}
        </section>
        ${J}
        ${Q}
      `}else{const G=Math.min(100,Math.round(e.sim.state.level/Ke*100));M=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${Ke}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${Ke}</strong> · Khi đạt Cấp ${Ke}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${G}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const R=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${pa.map(G=>{const q=s?.id===G.id;return`
              <article class="honor-garden-card ${q?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${x(G.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${x(G.titleVi)}</strong>
                    <span class="honor-garden-owner">${x(G.ownerName)} · Lv.${G.level} · ${jt[G.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${x(G.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${x(G.weather)} · ${x(G.atmosphere)}</span>
                  ${q?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${x(G.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;f=`
      ${w.join("")}
      ${E}
      ${h?`${M}${R}`:`${R}${M}`}
    `}else if(e.activeNeighborTab==="postcard"){const w=Wt(e),E=ei(w);f=`
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
        <div class="floo-postcard-caption">${x(E)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const w=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(E=>{const M=Oe(E.itemId);return`
                <div class="nb-crate-item ${E.fulfilledAt?"done":""}">
                  <img src="${M.iconSrc}" alt="${x(M.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${E.qty} ${x(M.name)}</div>
                    <div class="nb-crate-rew">${E.fulfilledAt?`✓ ${x(E.helperEmoji??"🦉")} ${x(E.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';f=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${n.friendshipTokens}/${Ye} 🍀)</div>
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
              🎁 Mở Rương (${Ye} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${b?`
                  <div class="nb-alert-banner ${b.rescuedAt?"ready":""}">
                    <span>${b.rescuedAt?`🎉 <strong>${x(b.rescuerEmoji??"🦉")} ${x(b.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${b.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${b.stage}</strong>…`}</span>
                    ${b.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${u}/${wt}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${p}/${Vt}):</div>
            <div class="nb-crate-list">${w}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${ua.map(E=>{const M=E.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${E.id}" data-active="${M}" aria-pressed="${M}" class="brass-btn nb-note-btn">
                  ${E.emoji} ${x(E.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else f=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(E=>{const M=new Date(E.timestamp),R=String(M.getHours()).padStart(2,"0"),G=String(M.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${x(E.icon)}</span>
                  <span class="nb-log-msg">${x(E.textVi)}</span>
                  <span class="nb-log-time">${R}:${G}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${T}
    ${C}
    ${f}
  `,li(t);const k=t.querySelector("#flooPostcardCanvas");k&&Mn(e.gameCanvas,Wt(e),k),t.querySelectorAll("[data-nbtab]").forEach(w=>{w.addEventListener("click",()=>{e.activeNeighborTab=w.dataset.nbtab,$e(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",$e(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{An(e),$e(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{An(e),$e(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const w=t.querySelector("#flooPostcardCanvas")??Mn(e.gameCanvas,Wt(e)),E=ti(w,.72);if(E){const R=document.createElement("a");R.href=E,R.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${E.startsWith("data:image/webp")?"webp":"png"}`,R.click()}const M=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(M.msg,"🖼️"),$e(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",w=>{w.preventDefault();const M=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);M&&(n.playerDisplayName=M,e.sim.saveToStorage(),Et(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${M}"!`,"🔥"),$e(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Et(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const w=_t(e.flooDirectoryRows,Date.now());w.length>0&&Ze(e,w[0].uid,w)}),t.querySelectorAll("[data-floo-portal]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.flooPortal;if(!E)return;const M=_t(e.flooDirectoryRows,Date.now());Ze(e,E,M)})}),t.querySelectorAll("[data-honor-tour]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.honorTour;E&&sn(e,E)})});const L=()=>{const w=e.sim.openFriendshipChest();w.ok||e.showToast(w.msg,"🍀"),e.refreshAll(),$e(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",L),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",L),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(w=>{w.addEventListener("click",()=>{const E=e.sim.claimPlayerMinigameSosRescue();E.ok||e.showToast(E.msg,"⚠️"),e.refreshAll(),$e(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const w=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const E of w)e.sim.claimHomeLanternMark(E.id);e.refreshAll(),$e(e)}),t.querySelectorAll("[data-nb-visit]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.nbVisit;E&&ui(e,E)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),tn(e)}),t.querySelectorAll("[data-nb-crate]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.nbCrate??"",[M,R]=E.split("|");if(!M||!R)return;const G=e.sim.fulfillNeighborOwlCrate(M,R);G.ok||e.showToast(G.msg,"🧺"),e.refreshAll(),$e(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.nbRescue;if(!E)return;const M=e.sim.canRescueNeighborMinigame(E);if(!M.ok||!M.neighbor||!M.sos){e.showToast(M.reason??"Không thể giải cứu màn này lúc này!","🦉");return}pi(e,{neighborId:M.neighbor.id,neighborName:M.neighbor.name,neighborEmoji:M.neighbor.avatarEmoji,kind:M.sos.kind,stage:M.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(w=>{w.addEventListener("click",()=>{const E=w.dataset.nbNote;E&&(e.sim.setNeighborPresetNote(E),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),$e(e))})})}function Qt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;fe(e.cam,t.gx+t.bw*.5+o,t.gy+t.bh*.5+o),e.onCameraJump?.()}function mi(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const n=Date.now();return e.sim.state.buildings.some(s=>re(s.itemId)?.isAnimalPasturePlot&&s.pastureAnimalId&&s.pastureReadyAt&&n>=s.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const n=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(n)return{el:n,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function En(e){const t=e.root.querySelector("#tutorialHudSpotlight"),n=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(d=>d.removeAttribute("data-tutorial-anchor")),!t)return;const o=!!document.querySelector("dialog[open]");if(e.photoModeActive||o||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:s,label:a}=mi(e);if(!s||s.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=s.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!s.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||s.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const i=6;t.style.setProperty("--spot-left",`${Math.round(r.left-i)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-i)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+i*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+i*2)}px`),t.classList.toggle("pill-below",r.top<110),n&&(n.textContent=a||"👇 Bấm"),t.classList.remove("hidden")}function hi(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function bi(e,t){if(hi())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function fi(e,t){if(hi())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function Pn(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const n=!!document.querySelector("dialog[open]"),o=e.manageMenuOpen||e.weatherPopoverOpen,s=e.sim.getCurrentTutorialStep();if(e.photoModeActive||n||o||!s){bi(e,t),En(e);return}const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),l=`${s.index}:${s.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${r}`;if(e.lastRenderedTutorialSig!==l){e.lastRenderedTutorialSig=l;const d=Jn.map(c=>`<span class="tutorial-step-dot ${c.index<s.index?"done":c.index===s.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${s.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${x(s.title)}</h2>
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
        `;else{const c=s.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>':s.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${r>0?"🔨 Xây":"🦉 Đơn Cú"}</button>`:"",u=s.id==="build_and_owl_order"?r>0?"🦉 Giao Đơn!":"🔨 Xây Dựng":s.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/trang-trai-hang-soc/sprites/${s.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${Jn.length}"
              aria-valuenow="${s.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${d}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${x(s.speakerName)}
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${x(s.title)}</h2>
            <div class="tutorial-hint-strip">${x(s.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${x(s.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${c}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${x(u)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),Pn(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),Pn(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{vi(e,s.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{s.id==="earn_magic_star"?e.openPuzzleArcadeDialog():s.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}fi(e,t);const i=`${s.index}:${s.id}`;e.lastFocusedTutorialStepKey!==i&&(e.lastFocusedTutorialStepKey=i,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),En(e)}function vi(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())Qt(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const o=re("farmland_plot");o&&(e.selectedCatalogItem=o,e.refreshAll())}return}if(t==="sow_and_merge_plot"){Qt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){Qt(e);const n=Date.now();e.sim.state.buildings.some(s=>re(s.itemId)?.isAnimalPasturePlot&&s.pastureAnimalId&&s.pastureReadyAt&&n>=s.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Ro{constructor(t,n,o,s,a){S(this,"sim");S(this,"cam");S(this,"gameCanvas");S(this,"activeCategory",null);S(this,"selectedCatalogItem",null);S(this,"rotation",0);S(this,"bulldozerActive",!1);S(this,"moveModeActive",!1);S(this,"movingBuildingUid",null);S(this,"pincerActive",!1);S(this,"pincerPicked",null);S(this,"seedTrayOpen",!1);S(this,"seedFilterMode","all");S(this,"activeSeedCropId",null);S(this,"pendingSowPlotUid",null);S(this,"pastureTrayOpen",!1);S(this,"activePastureAnimalId",null);S(this,"pendingStockPastureUid",null);S(this,"rideCamUid",null);S(this,"rideCamSpeedText","");S(this,"pendingTouchTile",null);S(this,"onTouchConfirmPlace",null);S(this,"onTouchCancelPlace",null);S(this,"onCameraJump",null);S(this,"photoModeActive",!1);S(this,"inspectSelection",null);S(this,"minimapCanvas");S(this,"questCollapsed",!1);S(this,"minimapCollapsed",!1);S(this,"manageMenuOpen",!1);S(this,"weatherPopoverOpen",!1);S(this,"mapToolsExpanded",!1);S(this,"buildSheetOpen",!1);S(this,"minimapHudVisible",!1);S(this,"hudRolledUp",!1);S(this,"inspectorCollapsed",!1);S(this,"lastInspectedKey","");S(this,"displayedGalleons",-1);S(this,"galleonRollRaf",0);S(this,"activeWorkshopTab","barn");S(this,"activeQuestTab","orders");S(this,"activeAlbumTab","cup");S(this,"selectedOwlOrderId",null);S(this,"lastWsBrewId",null);S(this,"activeSuitcaseTab","care");S(this,"selectedSuitcaseHabitatUid",null);S(this,"useStarlightForIncubation",!0);S(this,"lastSuitcaseIncReady",!1);S(this,"lastSuitcaseExpReady",!1);S(this,"activeNeighborTab","friends");S(this,"focusedNeighborId",null);S(this,"flooDirectoryRows",[]);S(this,"flooQueueRows",[]);S(this,"flooHelpsLeft",null);S(this,"flooLoading",!1);S(this,"flooLastLoadedAt",0);S(this,"flooAutoAdvanceTimer",0);S(this,"flooHelpersToday",[]);S(this,"lastSocialLiveSig","");S(this,"tutorialMinimized",!1);S(this,"lastRenderedTutorialSig","");S(this,"lastFocusedTutorialStepKey","");S(this,"ribbonBannerTimer",0);S(this,"pendingBulldozeWarning",null);S(this,"drawerEdgeObserver",null);S(this,"dialogOpenObserver",null);S(this,"match3Modal",null);S(this,"puzzleArcadeModal",null);S(this,"match3ModalPromise",null);S(this,"puzzleArcadeModalPromise",null);S(this,"seedQuizModal");S(this,"leaderboardModal");S(this,"root");S(this,"sprites");this.root=t,this.sim=n,this.cam=o,this.gameCanvas=s,this.sprites=a,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||Tt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new za(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{this.activeSeedCropId=r;const i=we[r];if(l){const d=this.sim.state.buildings.find(c=>c.uid===l);if(d&&re(d.itemId)?.isFarmlandPlot&&!d.cropId){const c=this.sim.plantCropOnPlot(d.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(c.msg,c.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${i.emoji} ${i.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,i.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new Ea(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),i=this.root.querySelector("#puzzleArcadeDialog"),d=this.root.querySelector("#seedQuizDialog");r==="match3"?(i?.close(),d?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),i?.close(),this.openSeedQuizDialog()):(l?.close(),d?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const i=this.sim.state.buildings.find(u=>this.inspectSelection?.kind==="building"&&u.uid===this.inspectSelection.uid),d=i?re(i.itemId):void 0,c=Date.now();i&&(c<i.constructEndsAt||i.workshopQueue&&i.workshopQueue.length>0||i.cropId&&i.cropReadyAt&&c<i.cropReadyAt+1200||i.pastureAnimalId&&i.pastureReadyAt&&c<i.pastureReadyAt+1200||d&&d.cycleSec>0&&d.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return Fa(this)}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const n=t.returnValue;t.returnValue="";const o=this.pendingBulldozeWarning;this.pendingBulldozeWarning=null,n==="confirm"&&o&&(this.sim.removeAtTile(o.gx,o.gy,!0),this.refreshAll())}),this.sim.onRequestBulldozeConfirm=n=>{this.openBulldozeConfirmDialog(n)})}openBulldozeConfirmDialog(t){const n=this.root.querySelector("#bulldozeConfirmDialog"),o=this.root.querySelector("#bulldozeConfirmBody");if(!n||!o){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,o.innerHTML=`
      <div class="quest-card-mini bulldoze-confirm-card">
        <div class="bulldoze-confirm-lead">
          <strong>${x(t.buildingName)}</strong> hiện có:
        </div>
        <div class="bulldoze-confirm-hazard">
          🌾 ${x(t.hazardSummaryVi)}
        </div>
        <div class="bulldoze-confirm-note">
          Nếu phá dỡ ngay bây giờ, phần vụ mùa / sản vật / mẻ đang chạy trên ô này sẽ bị mất vĩnh viễn.
        </div>
        <div class="bulldoze-confirm-refund">
          💰 Khi xóa: <strong>${x(t.refundSummaryVi)}</strong>
        </div>
      </div>
    `,n.returnValue="",n.open||n.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),n=this.root.querySelector("#floatingBannerGrip");if(!t||!n)return;n.classList.remove("hidden");const o=(i,d)=>{t.classList.add("is-floating-dragged");const c=Math.max(0,window.innerWidth-t.offsetWidth),u=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(i,c))}px`,t.style.top=`${Math.max(0,Math.min(d,u))}px`};let s=0,a=0,r=0,l=0;n.addEventListener("pointerdown",i=>{if(i.button!==0)return;const d=t.getBoundingClientRect();s=i.clientX-d.left,a=i.clientY-d.top,r=i.clientX,l=i.clientY,n.setPointerCapture(i.pointerId)}),n.addEventListener("pointermove",i=>{n.hasPointerCapture(i.pointerId)&&(Math.hypot(i.clientX-r,i.clientY-l)>=4&&n.classList.add("dragging"),o(i.clientX-s,i.clientY-a))}),n.addEventListener("lostpointercapture",()=>{n.classList.remove("dragging")}),n.addEventListener("keydown",i=>{let c=0,u=0;if(i.key==="ArrowLeft")c=-15;else if(i.key==="ArrowRight")c=15;else if(i.key==="ArrowUp")u=-15;else if(i.key==="ArrowDown")u=15;else return;i.preventDefault();const p=t.getBoundingClientRect();o(p.left+c,p.top+u)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const i=t.getBoundingClientRect();o(i.left,i.top)}})}installDialogLightDismissFallback(){const t=()=>{const n=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(n)};for(const n of Array.from(this.root.querySelectorAll("dialog")))n.addEventListener("close",()=>{n.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",n=>{const o=n.target;if(o&&typeof o.matches=="function"&&o.matches(".aaa-codex-scroll")){const s=!!n.skipped;o.dataset.cvSkipped=s?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const n=new IntersectionObserver(o=>{for(const s of o)s.target.dataset.cvSkipped=s.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const o of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))n.observe(o)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const n=(o,s)=>{const a=s.getBoundingClientRect();return o.clientX<a.left||o.clientX>a.right||o.clientY<a.top||o.clientY>a.bottom};for(const o of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let s=!1;o.addEventListener("pointerdown",a=>{s=n(a,o)}),o.addEventListener("pointerup",a=>{s&&n(a,o)&&o.close()})}}}wireRangeProgressFallback(t){const n=()=>{const o=Number(t.min||0),s=Number(t.max||100),a=Number(t.value||0),r=Math.round((a-o)/Math.max(1,s-o)*100);t.style.setProperty("--progress",`${r}%`)};n(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",n)}togglePhotoMode(t){return Va(this,t)}openNeighborDialog(t,n){return di(this,t,n)}openHarvestFeastDialog(){return io(this)}refreshHarvestFeastBadges(){return ao(this)}showRibbonUnveilBanner(t){return oo(this,t)}renderHarvestFeastDialog(){return Zs(this)}openMinigameRescue(t){return pi(this,t)}enterVisitFromHud(t){return ui(this,t)}enterHonorTourFromHud(t){return sn(this,t)}enterFlooMemberVisitFromHud(t,n){return Ze(this,t,n)}refreshFlooDirectoryFromHud(t){return Et(this,t)}applyAuthoritativeSnapshot(t){ci(this,t)}exitVisitFromHud(){return tn(this)}isBuildingFocusMode(){return Gs(this)}toggleHudRollup(t){return _a(this,t)}syncHudFocusVisibility(){return nn(this)}openWorkshopDialog(t){return Gn(this,t)}openSuitcaseDialog(t,n){return lo(this,t,n)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=Tt(async()=>{const{Match3ModalController:t}=await import("./match3Modal-Bc0sRHJQ.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2,3])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=n=>this.openPuzzleArcadeDialog(n),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=Tt(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-DHRXfL25.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([4,1,2,3])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(n,o)=>this.showToast(n,o),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=n=>this.openLeaderboardDialog(n),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,n){this.closeHudPopovers();const o=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(o,n)}openMatch3Dialog(t,n=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(o=>o.open(t,n))}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(n=>n.open(t))}openSeedQuizDialog(t,n,o,s,a,r){this.closeHudPopovers(),n||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,n,o,s,a,r)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return dt(this)}collapseBuildDock(){return tt(this)}hasOpenFloatingTray(){return Ua(this)}hideOpenFloatingTrays(){return ja(this)}positionFloatingPopover(t,n){return On(this,t,n)}toggleManagePopover(t){return Wa(this,t)}toggleWeatherPopover(t){return Qa(this,t)}renderWeatherPopover(){return Rn(this)}animateGalleonsTo(t){return Vs(this,t)}spawnFlyReward(t,n,o,s){return Xa(this,t,n,o,s)}bindEvents(){return Ga(this)}showToast(t,n="🦉"){return et(this,t,n)}showOfflineModal(t){return Ya(this,t)}refreshFloatingBanner(){return zn(this)}openSeedTray(t,n){return Xs(this,t,n)}closeSeedTray(){return lt(this)}toggleSeedTray(){return eo(this)}openPastureTray(t,n){return Ks(this,t,n)}closePastureTray(){return Lt(this)}togglePastureTray(){return to(this)}renderSeedTray(){return Ys(this)}renderPastureTray(){return no(this)}refreshTouchConfirmBar(){return Fn(this)}refreshAll(){return Zt(this)}refreshHeaderClock(){return kn(this)}refreshHeader(){return _s(this)}syncProgressiveHudVisibility(){return Us(this)}refreshQuestTracker(){return js(this)}refreshDock(){return Ws(this)}renderStaffDrawer(t){return Qs(this,t)}syncContextualMapToolsBar(){return Ja(this)}renderInspector(){return ge(this)}renderFinanceDialog(){return ro(this)}renderAlbumDialog(){return Xe(this)}renderQuestDialog(){return ze(this)}renderRoadmapDialog(){return Js(this)}updateWorkshopLiveTimers(){return so(this)}renderWorkshopDialog(){return Ae(this)}renderSettingsDialog(){return Ie(this)}refreshSuitcaseBadge(){return co(this)}updateSuitcaseLiveTimers(){return po(this)}renderSuitcaseDialog(){return Te(this)}syncLiveNeighborSocialUI(){return No(this)}refreshNeighborBadges(){return gi(this)}renderVisitorDockBar(){return Oo(this)}renderNeighborDialog(){return $e(this)}panCameraToTutorialTarget(){return Qt(this)}resolveTutorialHudTarget(){return mi(this)}updateTutorialHudSpotlight(){return En(this)}hideTutorialPopover(t){return bi(this,t)}showTutorialPopover(t){return fi(this,t)}renderTutorialCoach(){return Pn(this)}handleTutorialPrimaryAction(t){return vi(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Rt.colorblindMode,fontScale:t?.fontScale??Rt.fontScale,highContrast:t?.highContrast??Rt.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Rt.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();xa(t),this.sim.audio?.ceiling&&Ta(t,this.sim.audio)}playStoryCutscene(t){const n=Ds.find(s=>s.id===t);if(!n)return;if(this.sim.state.level<n.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${n.unlockLevel} để mở khoá ${n.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${n.titleVi}`,"🎬");let o=120;n.keyframes.forEach((s,a)=>{window.setTimeout(()=>{fe(this.cam,s.cameraFocusGx,s.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${s.captionVi}`,a===n.keyframes.length-1?"✨":"🕯️"),n.chapterNumber===3&&a===n.keyframes.length-1&&this.sim.launchFireworksShow(10)},o),o+=s.durationMs})}}let Qe=null,ct=null,Cs=!1;function ks(){return typeof navigator<"u"&&typeof navigator.install=="function"}function qn(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,n=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||n}function Hn(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function yi(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const o=navigator,s=typeof o.install=="function";if(!s&&!Qe){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(s&&o.install)await o.install(),t.classList.add("hidden");else if(Qe){const a=Qe;Qe=null,await a.prompt(),((await a.userChoice).outcome==="accepted"||!Qe)&&t.classList.add("hidden")}}catch(a){!(a instanceof DOMException&&a.name==="AbortError")&&!Qe&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function In(){!qn()||Hn()||(ct||(ct=yi()),ct.classList.remove("hidden"))}function Si(){ct&&ct.classList.add("hidden")}function zo(){Cs||typeof window>"u"||(Cs=!0,!Hn()&&(ct=yi(),ks()&&qn()&&In(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),Qe=e,!ks()&&qn()&&!Hn()&&In()}),window.addEventListener("appinstalled",()=>{Si(),Qe=null})))}const Fo={init:zo,show:In,hide:Si},Go="burrow_rollback_backup_v12";function Ms(e,t){const n=JSON.stringify({backedUpAt:Date.now(),state:e}),o=typeof localStorage<"u"?localStorage:void 0;try{o?.setItem(Go,n)}catch{}return n}class Vo{constructor(){S(this,"unhandledErrors",0);S(this,"fpsSamples",[]);S(this,"assetLoadLatencyMs",0);S(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const n=Math.max(1,Math.min(240,t));this.fpsSamples.push(n),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,n={},o=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:n,queuedAt:o})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const n=[...this.offlineQueue];return t(n)?(this.offlineQueue=[],n.length):0}getHealthReport(){const t=this.fpsSamples.length;let n=60,o=60;if(t>0){const s=this.fpsSamples.reduce((l,i)=>l+i,0);n=Number((s/t).toFixed(1));const a=[...this.fpsSamples].sort((l,i)=>l-i),r=Math.max(0,Math.floor((t-1)*.05));o=Number(a[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:n,p5LowFps:o,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function Bn(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function Ls(e){return Bn(e)||e.category==="decor"}async function _o(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const n=document.createElement("canvas");n.id="gameCanvas",n.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(n);const o=new ma,s=new ya;await s.loadAll();const a=new ha(o),r={x:0,y:0,zoom:.82,viewRot:0};fe(r,18,24.5);const l=new Sa(n,s),i=new Ro(e,a,r,n,s);Fo.init(),yn.init(a);const d=new URLSearchParams(window.location.search),c=ba,u=!!(d.get("visit")||d.get("tour")||c||d.get("ridecam")==="1");let p=null;if(i.onCameraJump=()=>{p=null},!u&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const v=r.x,y=r.y,B=r.zoom;fe(r,17.5,24),r.zoom=.76,p={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:v,toY:y,toZoom:B}}if(d.get("ridecam")==="1"){const v=a.state.buildings.find(y=>re(y.itemId)?.isCustomCoasterStation);v&&(i.rideCamUid=v.uid)}const g=d.get("dialog");if(g==="album")document.getElementById("btnOpenAlbum")?.click();else if(g==="finance")document.getElementById("btnOpenFinance")?.click();else if(g==="orders"||g==="quests")document.getElementById("btnOpenQuests")?.click();else if(g==="barn")i.openWorkshopDialog("barn");else if(g==="seeds"){const v=d.get("sfilter");(v==="flowers"||v==="crops"||v==="all")&&(i.seedFilterMode=v),i.openSeedTray()}else if(g==="pasture")i.openPastureTray();else if(g==="seedquiz"){const v=d.get("crop")??void 0,y=d.get("lang")??void 0,B=d.get("tier")??void 0,_=d.get("qformat")??void 0,X=d.get("sqtab"),ue=X==="codex"||X==="practice"?X:void 0;i.openSeedQuizDialog(v,null,y,B,_,ue)}else if(g==="bakery"){const v=a.state.buildings.find(y=>y.itemId==="molly_apple_bakery");v&&(i.inspectSelection={kind:"building",uid:v.uid}),i.openWorkshopDialog("brew")}else if(g==="workshop"){const v=d.get("tab")??"barn";i.openWorkshopDialog(v)}else if(g==="suitcase"){const v=d.get("tab")??"care";i.openSuitcaseDialog(v)}else if(g==="match3"){Number(d.get("m3level")||0),Math.min(777,(a.state.match3.maxClearedLevel??0)+1);const v=void 0,y=!!c;i.openMatch3Dialog(v,y)}else if(g==="puzzle"||g==="caro"||g==="sudoku"||g==="chess"||g==="blocks"||g==="jigsaw"||g==="pikachu"||g==="onet"){const v=g==="puzzle"?d.get("pmode"):g,y=v==="pikachu"||v==="onet"?"blocks":v,B=y==="caro"||y==="sudoku"||y==="chess"||y==="blocks"||y==="jigsaw"?y:void 0;i.openPuzzleArcadeDialog(B)}else if(g==="neighbors"||g==="friends")i.openNeighborDialog();else if(g==="feast")i.openHarvestFeastDialog();else if(g==="leaderboard"){const v=d.get("lbgame"),y=v==="match3"||v==="caro"||v==="sudoku"||v==="chess"||v==="blocks"||v==="jigsaw"||v==="seedquiz"?v:void 0,B=d.get("lbscope"),_=B==="valley"||B==="friends"||B==="personal"?B:void 0;i.openLeaderboardDialog(y,_)}else if(!d.get("tour")&&!d.get("visit")&&!a.isHeadmasterPreview)try{const v=localStorage.getItem(hn);if(v){const y=JSON.parse(v),B=Date.now()-Number(y.savedAt||0),_=a.state.puzzleArcade;B>=0&&B<=12*3600*1e3?y.dialog==="puzzleArcade"&&y.mode==="sudoku"&&_.sudokuSession?.stage===_.sudokuStage?i.openPuzzleArcadeDialog("sudoku"):y.dialog==="puzzleArcade"&&y.mode==="caro"&&_.caroSession?.stage===_.caroStage?i.openPuzzleArcadeDialog("caro"):y.dialog==="puzzleArcade"&&y.mode==="chess"&&_.chessSession?.stage===_.chessStage?i.openPuzzleArcadeDialog("chess"):y.dialog==="puzzleArcade"&&y.mode==="blocks"&&_.onetSession?.stage===_.blockStage?i.openPuzzleArcadeDialog("blocks"):y.dialog==="puzzleArcade"&&y.mode==="jigsaw"&&_.jigsawSession?.stage===_.jigsawStage?i.openPuzzleArcadeDialog("jigsaw"):y.dialog==="match3"&&a.state.match3.activeSession?.levelId===a.state.match3.currentLevel?i.openMatch3Dialog():localStorage.removeItem(hn):localStorage.removeItem(hn)}}catch{}const m={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},b=v=>{const y=String(v||"").trim();if(!y){i.exitVisitFromHud();return}const B=m[y]||(y.startsWith("tour_")?y:"");B?i.enterHonorTourFromHud(B):y.startsWith("player_")||a.ensureNeighborSocial().neighbors.some(_=>_.id===y)?i.enterVisitFromHud(y):i.enterFlooMemberVisitFromHud(y)},h=d.get("tour")||d.get("visit");h&&b(h);const T=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(T.some(v=>d.has(v))){const v=new URLSearchParams(d);for(const _ of T)v.delete(_);const y=v.toString(),B=`${window.location.pathname}${y?`?${y}`:""}${window.location.hash}`;window.history.replaceState(null,"",B)}a.isTutorialActive()&&!u&&i.panCameraToTutorialTarget(),qe.bindSimulationGringottsWallet(a,{onSnapshot:v=>i.applyAuthoritativeSnapshot(v),onToast:(v,y)=>i.showToast(v,y??"🏦")}),qe.authoritativeClient.snapshot&&i.applyAuthoritativeSnapshot(qe.authoritativeClient.snapshot),i.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",v=>{i.applyAuthoritativeSnapshot(v.detail)}),window.addEventListener("hpvn:toast",v=>{const y=v.detail;y?.text&&i.showToast(String(y.text),"🔥")}),window.addEventListener("hpvn:tour-garden",v=>{const y=v.detail;b(String(y?.tourId??""))}),window.addEventListener("gamesave:updated",v=>{if(a.isHeadmasterPreview||a.isVisitingNeighbor)return;const y=v.detail,B=typeof y?.saveJson=="string"&&y.saveJson||(typeof localStorage<"u"?localStorage.getItem(Os):null);if(B){if(!Ns())try{const _=JSON.parse(B);if(_&&(_.sandboxMode===!0||_.sandboxTainted===!0||_.isHeadmasterPreview===!0))return}catch{return}Ms(a.state),a.importSaveJson(B)&&(qe.authoritativeClient.snapshot&&i.applyAuthoritativeSnapshot(qe.authoritativeClient.snapshot),i.match3Modal?.resetSession(),i.puzzleArcadeModal?.resetSession(),i.refreshAll(),yn.refresh(),i.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️"))}}),window.addEventListener("hpvn:atmosphere",v=>{if(a.isVisitingNeighbor)return;const y=v.detail?.mode,B=y==="auto"?"realtime":y;(B==="realtime"||B==="dawn"||B==="day"||B==="dusk"||B==="night")&&(a.state.settings.timeOverride=B,a.saveToStorage(),i.refreshAll())}),window.addEventListener("hpvn:weather",v=>{if(a.isVisitingNeighbor)return;const y=v.detail?.mode;(y==="auto"||y==="clear"||y==="cloudy"||y==="rain"||y==="storm"||y==="snow"||y==="fog"||y==="fireflies")&&(a.state.settings.weatherOverride=y,a.saveToStorage(),i.refreshAll())}),a.onTutorialStepChanged=()=>{i.panCameraToTutorialTarget()},a.onUiChange=()=>{i.refreshAll(),yn.refresh()},a.onToast=(v,y)=>{i.showToast(v,y),v.includes("Đạt Cấp")||v.includes("lên cấp")||v.includes("Lên Cấp")?Ft("levelup"):Ft("light"),Fs(v)},a.onBuildingTactile=v=>l.triggerSquash(v),a.onBuildingCompleted=v=>{l.triggerCompletionPop(v),l.triggerSquash(v)},a.onRibbonUnveiled=v=>{const y=ds(v.gx,v.gy,r,n.clientWidth,n.clientHeight,36);l.triggerRibbonUnveilPop(v.uid,y.sx,y.sy),i.showRibbonUnveilBanner(v),Ft("levelup")},a.onRewardFly=(v,y,B,_)=>{if(typeof B=="number"&&typeof _=="number"){const X=ds(B,_,r,n.clientWidth,n.clientHeight,32);i.spawnFlyReward(v,y,X.sx,X.sy)}else i.spawnFlyReward(v,y)},a.onLevelUp=v=>{Ft("levelup");const y=Ni(v),B=y.unlockedItemIds.map(X=>re(X)?.name).filter(Boolean).slice(0,2).join(", "),_=B?` — Mở bản vẽ mới: ${B}!`:y.milestoneNote?` — ${y.milestoneNote}`:"";i.showToast(`🎉 Đạt Cấp Giải Đố ${v}! (+${y.rewardGalleons}🪙)${_}`,"🌟"),i.refreshAll()};const C=a.processOfflineProgress();C&&i.showOfflineModal(C);const f=v=>{const y=a.getActiveVisitingNeighbor();if(!y?.remoteUserId)return;const B=y.helpedMarksToday[y.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:y.remoteUserId,buildingUid:v,kind:B?.kind||"water_crop",noteText:B?.noteText||"Chúc vườn phép thuật bội thu!",helperName:a.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let k=null,$=!1,L=!1,w=!1,E=!1,M=!1,R=0,G=0,q=0,F=0,V=0,Z=0;const J=(v,y,B,_)=>{const X=i.activeSeedCropId;if(!X)return!1;let ue=a.grid[y]?.[v]?.buildingUid??null;if(!ue)for(let z=l.hotspots.length-1;z>=0;z--){const Y=l.hotspots[z];if(Y.kind==="building"&&Math.hypot(B-Y.sx,_-Y.sy)<=Y.radius){ue=Y.id;break}}if(!ue)return!1;const W=a.state.buildings.find(z=>z.uid===ue);if(!W||W.cropId||Date.now()<W.constructEndsAt||!re(W.itemId)?.isFarmlandPlot)return!1;const be=a.plantCropOnPlot(W.uid,X);if(!be.ok){if(be.needSeedAcquire)return E=!1,$=!1,i.seedTrayOpen=!1,i.inspectSelection=null,i.refreshAll(),i.openSeedQuizDialog(X,W.uid),!1;const z=Date.now();return z-R>1200&&(R=z,i.showToast(be.msg,"🪙")),!1}return i.seedTrayOpen&&(i.seedTrayOpen=!1,i.renderSeedTray(),i.refreshFloatingBanner()),!0},ce=(v,y,B,_)=>{const X=i.activePastureAnimalId;if(!X)return!1;let ue=a.grid[y]?.[v]?.buildingUid??null;if(!ue)for(let z=l.hotspots.length-1;z>=0;z--){const Y=l.hotspots[z];if(Y.kind==="building"&&Math.hypot(B-Y.sx,_-Y.sy)<=Y.radius){ue=Y.id;break}}if(!ue)return!1;const W=a.state.buildings.find(z=>z.uid===ue);if(!W||W.pastureAnimalId||Date.now()<W.constructEndsAt||!re(W.itemId)?.isAnimalPasturePlot)return!1;const be=a.stockAnimalOnPasture(W.uid,X);if(!be.ok){const z=Date.now();return z-G>1200&&(G=z,i.showToast(be.msg,"🪙")),!1}return i.pastureTrayOpen&&(i.pastureTrayOpen=!1,i.renderPastureTray(),i.refreshFloatingBanner()),!0},Q=new Map;let O=0,A=!1,N=null;const P=()=>{N&&(window.clearTimeout(N.timer),N=null)};i.onTouchConfirmPlace=()=>{if(!i.pendingTouchTile)return;const{gx:v,gy:y}=i.pendingTouchTile;if(i.moveModeActive&&i.movingBuildingUid){const B=a.moveBuilding(i.movingBuildingUid,v,y,i.rotation);if(!B.ok){i.showToast(B.reason??"Không thể đặt tại ô này!","⚠️");return}i.movingBuildingUid=null,i.moveModeActive=!1,i.pendingTouchTile=null,i.refreshAll();return}if(i.selectedCatalogItem){const B=i.selectedCatalogItem,_=a.canPlaceItem(B,v,y,i.rotation);if(!_.ok){i.showToast(_.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(B,v,y,i.rotation),i.pendingTouchTile=null,Ls(B)||(i.selectedCatalogItem=null),i.refreshAll()}},i.onTouchCancelPlace=()=>{k=null};const H=new Set;window.addEventListener("keydown",v=>{if(document.querySelector("dialog[open]")){H.clear();return}v.target instanceof HTMLInputElement||v.target instanceof HTMLTextAreaElement||v.target instanceof HTMLSelectElement||v.target instanceof HTMLElement&&v.target.classList.contains("drag-handle")||H.add(v.key.toLowerCase())}),window.addEventListener("keyup",v=>{H.delete(v.key.toLowerCase())}),window.addEventListener("blur",()=>{H.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&H.clear()}),n.addEventListener("pointermove",v=>{Q.has(v.pointerId)&&Q.set(v.pointerId,{x:v.clientX,y:v.clientY});const y=n.getBoundingClientRect();if(Q.size>=2){P(),w=!1,A=!0;const oe=Array.from(Q.values()),be=Math.hypot(oe[1].x-oe[0].x,oe[1].y-oe[0].y),z=(oe[0].x+oe[1].x)*.5-y.left,Y=(oe[0].y+oe[1].y)*.5-y.top;if(O>8&&be>8){const ae=(z-y.width*.5)/r.zoom+r.x,D=(Y-y.height*.5)/r.zoom+r.y,ne=be/O;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*ne)),r.x=ae-(z-y.width*.5)/r.zoom,r.y=D-(Y-y.height*.5)/r.zoom}O=be;return}const B=v.clientX-y.left,_=v.clientY-y.top;if(!a.isVisitingNeighbor&&!L&&!i.movingBuildingUid&&!i.pincerActive)for(const oe of l.hotspots)oe.kind==="bubble"&&Math.hypot(B-oe.sx,_-oe.sy)<=oe.radius&&a.harvestBuildingBubble(oe.id);const X=bn(B,_,r,y.width,y.height,a.grid);if(i.pendingTouchTile||(k={gx:X.gx,gy:X.gy}),!$)return;if(N&&Q.size===1&&Math.hypot(v.clientX-q,v.clientY-F)>8){const oe=N;P(),w=!0,a.placeItem(oe.item,oe.gx,oe.gy,oe.rot)}if(w&&i.selectedCatalogItem){a.placeItem(i.selectedCatalogItem,X.gx,X.gy,i.rotation);return}if(E&&i.activeSeedCropId){J(X.gx,X.gy,B,_);return}if(M&&i.activePastureAnimalId){ce(X.gx,X.gy,B,_);return}const ue=v.clientX-q,W=v.clientY-F;Math.hypot(ue,W)>5&&(L=!0,i.rideCamUid=null),L&&(p=null,r.x=V-ue/r.zoom,r.y=Z-W/r.zoom)}),n.addEventListener("pointerdown",v=>{if(Q.set(v.pointerId,{x:v.clientX,y:v.clientY}),Q.size>=2){P();const W=Array.from(Q.values());O=Math.hypot(W[1].x-W[0].x,W[1].y-W[0].y),A=!0,w=!1;return}if(v.button!==0&&v.button!==2)return;const y=n.getBoundingClientRect(),B=v.clientX-y.left,_=v.clientY-y.top,X=bn(B,_,r,y.width,y.height,a.grid);i.pendingTouchTile||(k={gx:X.gx,gy:X.gy}),$=!0,L=!1,q=v.clientX,F=v.clientY,V=r.x,Z=r.y;const ue=i.selectedCatalogItem;if(v.button===0&&ue&&Bn(ue)&&!i.hasOpenFloatingTray()){if(v.pointerType==="touch"){P(),w=!1;const W=i.rotation;N={item:ue,gx:X.gx,gy:X.gy,rot:W,timer:window.setTimeout(()=>{N=null,Q.size===1&&!A&&$&&(w=!0,a.placeItem(ue,X.gx,X.gy,W))},75)}}else w=!0,a.placeItem(ue,X.gx,X.gy,i.rotation);E=!1,M=!1}else v.button===0&&i.activeSeedCropId&&!i.selectedCatalogItem&&!i.moveModeActive&&!i.bulldozerActive&&!i.pincerActive&&J(X.gx,X.gy,B,_)?(w=!1,E=!0,M=!1):v.button===0&&i.activePastureAnimalId&&!i.selectedCatalogItem&&!i.moveModeActive&&!i.bulldozerActive&&!i.pincerActive&&ce(X.gx,X.gy,B,_)?(w=!1,E=!1,M=!0):(w=!1,E=!1,M=!1)});const U=v=>{Q.delete(v),Q.size<2&&(O=0)};window.addEventListener("pointercancel",v=>{P(),U(v.pointerId),$=!1,L=!1,w=!1,E=!1,M=!1,A=!1}),window.addEventListener("pointerup",v=>{if(U(v.pointerId),A){P(),Q.size===0&&(A=!1,$=!1,L=!1,E=!1,M=!1);return}if(!$)return;let y=!1;if(N&&!L&&v.target===n){const ae=N;P(),a.placeItem(ae.item,ae.gx,ae.gy,ae.rot),y=!0}else P();const B=L,_=w||y||E||M;if($=!1,L=!1,w=!1,E=!1,M=!1,B||_)return;if(v.button===2){i.selectedCatalogItem=null,i.bulldozerActive=!1,i.moveModeActive=!1,i.movingBuildingUid=null,i.pincerActive=!1,i.pincerPicked=null,i.closeSeedTray(),i.closePastureTray(),i.collapseBuildDock(),i.closeHudPopovers(),i.pendingTouchTile=null,i.inspectSelection=null,i.refreshAll();return}if(v.target!==n)return;const X=i.pendingSowPlotUid,ue=i.pendingStockPastureUid;if(i.closeHudPopovers(),i.hasOpenFloatingTray()&&(i.hideOpenFloatingTrays(),i.selectedCatalogItem||i.moveModeActive||i.bulldozerActive||i.pincerActive)){i.refreshAll();return}const W=n.getBoundingClientRect(),oe=v.clientX-W.left,be=v.clientY-W.top,z=bn(oe,be,r,W.width,W.height,a.grid),Y=v.pointerType==="touch";if(i.pincerActive){const ae=i.pincerPicked??(a.staff[0]?{kind:"staff",id:a.staff[0].id,label:a.staff[0].name}:null);ae&&a.dropPickedEntity(ae.kind,ae.id,z.gx,z.gy),i.pincerPicked=null,i.pincerActive=!1,i.refreshAll();return}if(i.bulldozerActive){let ae=z.gx,D=z.gy;const ne=a.grid[D]?.[ae];if(!ne?.buildingUid&&(!ne||ne.path==="none")){for(const I of l.hotspots)if(I.kind==="building"&&Math.hypot(oe-I.sx,be-I.sy)<=I.radius){const ee=a.state.buildings.find(ke=>ke.uid===I.id);ee&&(ae=ee.gx,D=ee.gy);break}}a.removeAtTile(ae,D);return}if(i.moveModeActive){if(i.movingBuildingUid){if(Y&&(!i.pendingTouchTile||i.pendingTouchTile.gx!==z.gx||i.pendingTouchTile.gy!==z.gy)){const I=a.state.buildings.find(ke=>ke.uid===i.movingBuildingUid),ee=I?re(I.itemId):void 0;k={gx:z.gx,gy:z.gy},i.pendingTouchTile={gx:z.gx,gy:z.gy,label:ee?.name??"Dời công trình"},i.refreshTouchConfirmBar();return}const ne=a.moveBuilding(i.movingBuildingUid,z.gx,z.gy,i.rotation);if(!ne.ok){i.showToast(ne.reason??"Không thể đặt tại ô này!","⚠️");return}i.movingBuildingUid=null,i.moveModeActive=!1,i.pendingTouchTile=null,i.refreshAll();return}let D=a.grid[z.gy]?.[z.gx]?.buildingUid??null;if(!D){for(const ne of l.hotspots)if(ne.kind==="building"&&Math.hypot(oe-ne.sx,be-ne.sy)<=ne.radius){D=ne.id;break}}if(D){const ne=a.state.buildings.find(I=>I.uid===D);if(ne?.isIndestructible){i.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(ne){i.movingBuildingUid=ne.uid,i.rotation=ne.rotation,i.refreshFloatingBanner();const I=re(ne.itemId);i.showToast(`Đã nhấc "${I?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(i.selectedCatalogItem){const ae=i.selectedCatalogItem;if(Y&&!Bn(ae)&&(!i.pendingTouchTile||i.pendingTouchTile.gx!==z.gx||i.pendingTouchTile.gy!==z.gy)){k={gx:z.gx,gy:z.gy},i.pendingTouchTile={gx:z.gx,gy:z.gy,label:ae.name},i.refreshTouchConfirmBar();return}const D=a.canPlaceItem(ae,z.gx,z.gy,i.rotation);if(!D.ok){i.showToast(D.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(ae,z.gx,z.gy,i.rotation),i.pendingTouchTile=null,Ls(ae)||(i.selectedCatalogItem=null),i.refreshAll();return}for(const ae of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let D=null,ne=1/0;for(let I=l.hotspots.length-1;I>=0;I--){const ee=l.hotspots[I];if(ee.kind!==ae)continue;const ke=Math.hypot(oe-ee.sx,be-ee.sy);if(ee.spriteKey&&typeof ee.boxLeft=="number"&&typeof ee.boxTop=="number"&&typeof ee.boxW=="number"&&typeof ee.boxH=="number"&&ee.boxW>2&&ee.boxH>2){const rn=oe>=ee.boxLeft&&oe<=ee.boxLeft+ee.boxW&&be>=ee.boxTop&&be<=ee.boxTop+ee.boxH,Ht=(oe-ee.boxLeft)/ee.boxW,_e=(be-ee.boxTop)/ee.boxH,Se=rn&&s.hitTestAlpha(ee.spriteKey,Ht,_e,!!ee.flipX),st=ee.kind==="building"&&ke<=ee.radius*.5;if(!Se&&!st)continue;if((D===null||ke<ne*.82)&&(D=ee,ne=ke,Se))break}else ke<=ee.radius&&ke<ne&&(ne=ke,D=ee)}if(D){if(D.kind==="owl_post"){const I=l.collectOwlPostParcel();I&&a.claimOwlPostDelivery(I.gx,I.gy),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="visitor_gift"){const I=a.claimVisitedNeighborMysteryGift();I.ok?l.notifyJuice("harvest",D.sx,D.sy):i.showToast(I.msg,"🎁"),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="neighbor_help"){l.triggerSquash(D.id);const I=a.helpVisitedNeighborBuilding(D.id);I.ok?(l.notifyJuice("harvest",D.sx,D.sy),f(D.id)):i.showToast(I.msg,"💧"),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="home_lantern"){const I=a.ensureNeighborSocial().homeLanternMarks.find(ke=>ke.id===D.id);I&&l.triggerSquash(I.buildingUid);const ee=a.claimHomeLanternMark(D.id);ee.ok?l.notifyJuice("harvest",D.sx,D.sy):i.showToast(ee.msg,"🏮"),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="unveil_building"){a.unveilBuilding(D.id),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="bubble"){a.harvestBuildingBubble(D.id),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="water_crop"){l.triggerSquash(D.id);const I=a.waterCropPlot(D.id);I.ok?l.notifyJuice("harvest",D.sx,D.sy):i.showToast(I.msg,"💧"),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="feed_pasture"){l.triggerSquash(D.id);const I=a.feedAnimalPasture(D.id);I.ok?l.notifyJuice("harvest",D.sx,D.sy):i.showToast(I.msg,"🌾"),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="escaped"){a.catchEscapedCreature(D.id),i.inspectSelection=null,i.refreshAll();return}if(D.kind==="zone_plaque"){i.closeSeedTray(),i.inspectSelection={kind:"zone",zoneId:D.id},i.refreshAll();return}if(D.kind==="villager"){a.greetVillager(D.id),i.refreshAll();return}if(D.kind==="building"){const I=a.state.buildings.find(ee=>ee.uid===D.id);if(I){if(!a.isVisitingNeighbor&&I.awaitingUnveil){a.unveilBuilding(I.uid),i.inspectSelection=null,i.refreshAll();return}const ee=re(I.itemId),ke=!!(!a.isVisitingNeighbor&&ee?.isFarmlandPlot&&I.cropId&&I.cropReadyAt&&Date.now()>=I.cropReadyAt),rn=!!(!a.isVisitingNeighbor&&ee?.isAnimalPasturePlot&&I.pastureAnimalId&&I.pastureReadyAt&&Date.now()>=I.pastureReadyAt);if(!ke&&!rn&&l.triggerSquash(D.id),a.isVisitingNeighbor){const Se=a.getVisitedBuildingHelpStatus(I);if(Se.canHelp){const st=a.helpVisitedNeighborBuilding(I.uid);st.ok?(l.notifyJuice("harvest",D.sx,D.sy),f(I.uid)):i.showToast(st.msg,"💧")}else if(Se.existingMark)i.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${Se.existingMark.noteText}”`,"🏮");else{const st=re(I.itemId),Kn=a.getActiveVisitingNeighbor();i.showToast(`🏡 Đang ngắm "${st?.name??"Công trình"}" (${I.stars}★) tại vườn ${Kn?.name??"bạn bè"}!`,Kn?.avatarEmoji??"🏡")}i.inspectSelection=null,i.refreshAll();return}const Ht=a.ensureNeighborSocial().homeLanternMarks.find(Se=>Se.buildingUid===I.uid);if(Ht&&a.claimHomeLanternMark(Ht.id).ok){l.notifyJuice("harvest",D.sx,D.sy),i.inspectSelection=null,i.refreshAll();return}if(I.itemId==="burrow_honeydukes_canon"){i.closeSeedTray(),i.inspectSelection=null,i.refreshAll(),i.openMatch3Dialog();return}const _e=re(I.itemId);if(_e?.isFarmlandPlot&&I.cropId&&I.cropReadyAt&&Date.now()>=I.cropReadyAt){a.harvestCropPlot(I.uid),i.inspectSelection=null,i.refreshAll();return}else if(_e?.isFarmlandPlot&&I.cropId&&I.cropReadyAt&&Date.now()<I.cropReadyAt&&!I.cropWateredBoost){a.waterCropPlot(I.uid).ok&&l.notifyJuice("harvest",D.sx,D.sy),i.inspectSelection=null,i.refreshAll();return}else if(_e?.isFarmlandPlot&&!I.cropId&&Date.now()>=I.constructEndsAt){if(i.activeSeedCropId){const Se=a.plantCropOnPlot(I.uid,i.activeSeedCropId);if(Se.needSeedAcquire){i.inspectSelection=null,i.refreshAll(),i.openSeedQuizDialog(i.activeSeedCropId,I.uid);return}i.showToast(Se.msg,Se.ok?"🌱":"🪙"),i.inspectSelection=null,i.refreshAll()}else X===I.uid?(i.inspectSelection=null,i.refreshAll()):i.openSeedTray(void 0,I.uid);return}else if(_e?.isAnimalPasturePlot&&I.pastureAnimalId&&I.pastureReadyAt&&Date.now()>=I.pastureReadyAt){a.harvestAnimalPasture(I.uid),i.inspectSelection=null,i.refreshAll();return}else if(_e?.isAnimalPasturePlot&&I.pastureAnimalId&&I.pastureReadyAt&&Date.now()<I.pastureReadyAt&&!I.pastureFedBoost){a.feedAnimalPasture(I.uid).ok&&l.notifyJuice("harvest",D.sx,D.sy),i.inspectSelection=null,i.refreshAll();return}else if(_e?.isAnimalPasturePlot&&!I.pastureAnimalId&&Date.now()>=I.constructEndsAt){if(i.activePastureAnimalId){const Se=a.stockAnimalOnPasture(I.uid,i.activePastureAnimalId);i.showToast(Se.msg,Se.ok?"🐾":"🪙"),i.inspectSelection=null,i.refreshAll()}else ue===I.uid?(i.inspectSelection=null,i.refreshAll()):i.openPastureTray(void 0,I.uid);return}else(I.storedGalleons>0||I.readyFarmGoods&&I.readyFarmGoods.length>0)&&a.harvestBuildingBubble(I.uid)}i.closeSeedTray(),i.closePastureTray(),i.inspectSelection={kind:"building",uid:D.id},i.refreshAll();return}}}i.inspectSelection=null,i.refreshAll()}),n.addEventListener("contextmenu",v=>v.preventDefault()),n.addEventListener("wheel",v=>{v.preventDefault(),p=null;const y=n.getBoundingClientRect(),B=v.clientX-y.left,_=v.clientY-y.top,X=(B-y.width*.5)/r.zoom+r.x,ue=(_-y.height*.5)/r.zoom+r.y,W=v.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*W)),r.x=X-(B-y.width*.5)/r.zoom,r.y=ue-(_-y.height*.5)/r.zoom},{passive:!1});let se=performance.now(),K=0;const pe=new ka,me=new Vo;Ms(a.state);const le=document.createElement("div");le.id="gamepadRadialMenu",le.className="aaa-gamepad-radial",le.hidden=!0,le.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${Rs.map(v=>{const y=v.index*Math.PI*2/8,B=50+Math.cos(y)*37,_=50+Math.sin(y)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${v.index}" style="left:${B.toFixed(1)}%;top:${_.toFixed(1)}%;">${v.icon}<br/>${v.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(le);let he=null,ie=!1;const ve=v=>{switch(v){case"seeds":i.openSeedTray();break;case"barn":i.openWorkshopDialog("barn");break;case"orders":{i.activeQuestTab="orders",i.renderQuestDialog(),i.root.querySelector("#questDialog")?.showModal();break}case"match3":i.openMatch3Dialog();break;case"arcade":i.openPuzzleArcadeDialog();break;case"seedquiz":i.openSeedQuizDialog();break;case"neighbors":i.openNeighborDialog("friends");break;case"feast":i.openHarvestFeastDialog();break}},j=wa(),ye=i.root.querySelector("#match3Dialog"),Le=i.root.querySelector("#puzzleArcadeDialog"),Ge=i.root.querySelector("#seedQuizDialog"),nt=Array.from(i.root.querySelectorAll("dialog"));let qt=!1,gt=!1;const an=()=>{qt=!!(ye?.open||Le?.open||Ge?.open),gt=qt||nt.some(v=>v.open)};if(an(),typeof MutationObserver<"u"){const v=new MutationObserver(()=>{an()});for(const y of nt)v.observe(y,{attributes:!0,attributeFilter:["open"]})}i.root.addEventListener("close",an,!0);let Ve=0,Wn=0;function on(v){if(Ve=0,document.hidden){se=v;return}const y=(v-se)/1e3;if(se=v,!gt&&y>.002&&y<.5&&(me.recordFrameFps(1/y),K%90===0&&K>0)){const z=me.getHealthReport();j?l.adaptiveDprCap=z.p5LowFps<46?1.15:z.p5LowFps<54?1.35:1.5:l.adaptiveDprCap=z.p5LowFps<46?1.25:z.p5LowFps<54?1.5:2}const B=pe.poll();if(B.connected){if(B.panDx!==0||B.panDy!==0){p=null,i.rideCamUid=null;const z=380/r.zoom*Math.min(.05,y);r.x+=B.panDx*z,r.y+=B.panDy*z}if(B.radialOpen?(le.hidden=!1,ie=!0,B.radialActionId&&(he=B.radialActionId),le.querySelectorAll("[data-radial-idx]").forEach(z=>{z.dataset.selected=String(Number(z.dataset.radialIdx)===B.radialSliceIndex)}),B.confirmJustPressed&&he&&(le.hidden=!0,ie=!1,ve(he),he=null)):ie&&(le.hidden=!0,ie=!1,he&&(ve(he),he=null)),B.cancelJustPressed){const z=nt.filter(Y=>Y.open);z.length>0?z[z.length-1]?.close():i.hasOpenFloatingTray()&&i.hideOpenFloatingTrays()}}if((H.has("w")||H.has("arrowup")||H.has("s")||H.has("arrowdown")||H.has("a")||H.has("arrowleft")||H.has("d")||H.has("arrowright"))&&(p=null),p){const z=Math.min(1,Math.max(0,(v-p.startMs)/p.durationMs)),Y=1-Math.pow(1-z,3);r.x=p.fromX+(p.toX-p.fromX)*Y,r.y=p.fromY+(p.toY-p.fromY)*Y,r.zoom=p.fromZoom+(p.toZoom-p.fromZoom)*Y,z>=1&&(p=null)}const _=340/r.zoom*Math.min(.05,y);if(H.size>0&&gt&&H.clear(),(H.has("w")||H.has("arrowup"))&&(i.rideCamUid=null,r.y-=_),(H.has("s")||H.has("arrowdown"))&&(i.rideCamUid=null,r.y+=_),(H.has("a")||H.has("arrowleft"))&&(i.rideCamUid=null,r.x-=_),(H.has("d")||H.has("arrowright"))&&(i.rideCamUid=null,r.x+=_),a.update(y),i.rideCamUid&&!qt){const z=a.state.buildings.find(ae=>ae.uid===i.rideCamUid),Y=a.coasterCircuits.get(i.rideCamUid);if(Y&&Y.waypoints.length>=3){const ae=fa(Y.waypoints,Y.isClosed,Date.now()/1e3,3);if(ae.length>0){const D=ae[0],ne=fn(D.gx+.5,D.gy+.5,r.viewRot??0),I=ne.wx,ee=ne.wy-(D.elev*va+10);r.x+=(I-r.x)*Math.min(1,y*10),r.y+=(ee-r.y)*Math.min(1,y*10),r.zoom+=(1.38-r.zoom)*Math.min(1,y*5),i.rideCamSpeedText=`${D.speedKmh} km/h (${D.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,K%8===0&&i.refreshFloatingBanner()}}else if(z){const ae=Date.now()/1e3,D=z.gx+2+Math.cos(ae*2.1)*1.4,ne=z.gy+2+Math.sin(ae*2.1)*1.4,I=fn(D,ne,r.viewRot??0);r.x+=(I.wx-r.x)*Math.min(1,y*8),r.y+=(I.wy-22-r.y)*Math.min(1,y*8),r.zoom+=(1.35-r.zoom)*Math.min(1,y*5),i.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",K%12===0&&i.refreshFloatingBanner()}else i.rideCamUid=null,i.refreshFloatingBanner()}const X=a.getRealTimePeriod(),ue=a.getCurrentWeather(),W=fn(3,17,r.viewRot??0),oe=Math.hypot(r.x-W.wx,r.y-W.wy)<420;if(o.updateSoundscape(Math.min(.1,y),X==="night"||X==="dusk",r.zoom,oe,ue.kind,a.getActiveFestival()!=="none"),!qt&&(!gt||v-Wn>=80)){Wn=v;const z=i.pendingTouchTile?{gx:i.pendingTouchTile.gx,gy:i.pendingTouchTile.gy}:k;l.activeSeedBrushCropId=i.activeSeedCropId,l.activePastureBrushAnimalId=i.activePastureAnimalId,l.render(a,r,z,i.selectedCatalogItem,i.rotation,i.bulldozerActive,i.inspectSelection?.kind==="building"?i.inspectSelection.uid:null,i.movingBuildingUid,i.pincerPicked?.label??null),K++,!gt&&K%6===0&&!i.photoModeActive&&l.renderMinimap(i.minimapCanvas,a,r)}Ve=requestAnimationFrame(on)}Ve=requestAnimationFrame(on),document.addEventListener("visibilitychange",()=>{document.hidden?(Ve&&(cancelAnimationFrame(Ve),Ve=0),a.saveToStorage(),o.pause()):(se=performance.now(),o.resume(),Ve||(Ve=requestAnimationFrame(on)))}),window.addEventListener("pagehide",()=>{a.saveToStorage()}),window.addEventListener("beforeunload",()=>{a.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{a.saveToStorage()});let Qn=0,Xn="";const wi=a.onUiChange;a.onUiChange=()=>{wi?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:a.state.level,galleons:a.state.galleons}}));const v=Date.now(),y=`${a.state.level}|${a.state.match3.stars}|${a.state.unlockedZones.length}|${a.state.buildings.length}|${a.state.settings.weatherOverride}|${a.state.settings.timeOverride}`;y!==Xn&&v-Qn>=1200&&(Xn=y,Qn=v,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:a.state.parkName,level:a.state.level,magicStars:a.state.match3.stars,galleons:a.state.galleons,unlockedZonesCount:a.state.unlockedZones.length,buildingsCount:a.state.buildings.length,weatherMode:a.state.settings.weatherOverride,atmosphereMode:a.state.settings.timeOverride==="realtime"?"auto":a.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",v=>{if(a.isVisitingNeighbor)return;const y=String(v.detail?.mode||"auto");(y==="auto"||y==="none"||y==="halloween"||y==="christmas"||y==="quidditch_cup")&&(a.state.settings.activeFestival=y,a.saveToStorage(),i.refreshAll())}),window.addEventListener("hpvn:mute",v=>{const y=!!v.detail?.muted;a.state.settings.soundEnabled=!y,a.state.settings.bgmEnabled=!y,o.enabled=!y,o.bgmEnabled=!y,y?o.pause():o.resume(),a.saveToStorage(),i.refreshAll()}),window.addEventListener("gamesave:helpers",v=>{const y=v.detail;if(!y)return;const B=a.homeStateWhileVisiting??a.state,_=B===a.state?a.ensureNeighborSocial():B.neighborSocial??(B.neighborSocial=a.ensureNeighborSocial()),X=new Set(_.homeLanternMarks.map(Y=>Y.id)),ue=B.buildings[0]?.uid||"burrow_main_gate",W=Date.now(),oe=900*1e3,be=3600*1e3;let z=0;for(const Y of y.helpers??[]){if(!Y?.id||X.has(Y.id)||_.homeLanternMarks.length>=5)continue;X.add(Y.id);const ae=Y.buildingUid?B.buildings.find(ne=>ne.uid===Y.buildingUid):void 0,D=(ae&&((ae.cropReadyAt??0)>W||(ae.pastureReadyAt??0)>W||(ae.workshopQueue?.[0]?.endsAt??0)>W||(ae.constructEndsAt??0)>W)?ae:void 0)??B.buildings.find(ne=>(ne.cropReadyAt??0)>W||(ne.pastureReadyAt??0)>W||(ne.workshopQueue?.[0]?.endsAt??0)>W||(ne.constructEndsAt??0)>W);if(D)if((D.cropReadyAt??0)>W)D.cropReadyAt=Math.max(W,(D.cropReadyAt??W)-oe),D.cropWateredBoost=!0;else if((D.pastureReadyAt??0)>W)D.pastureReadyAt=Math.max(W,(D.pastureReadyAt??W)-oe);else if((D.workshopQueue?.[0]?.endsAt??0)>W)for(const ne of D.workshopQueue??[])ne.startedAt-=oe,ne.endsAt=Math.max(W,ne.endsAt-oe);else(D.constructEndsAt??0)>W+be&&(D.constructEndsAt=Math.max(W+be,(D.constructEndsAt??W)-oe));_.homeLanternMarks.push({id:Y.id,buildingUid:D?.uid||Y.buildingUid||ue,helperId:Y.uid,helperName:Y.name||"Hàng Xóm Hang Sóc",helperEmoji:Y.avatarEmoji||"🧙‍♂️",kind:Y.kind||"water_crop",noteVi:Y.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:Y.at||W}),z++}z>0&&(a.saveToStorage(),i.refreshAll(),y.summaryVi&&i.showToast(y.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",v=>{const y=v.detail;if(!y)return;const B=a.homeStateWhileVisiting??a.state,_=B===a.state?a.ensureNeighborSocial():B.neighborSocial??(B.neighborSocial=a.ensureNeighborSocial());typeof y.dayKey=="string"&&y.dayKey&&(_.lastSocialResetKey=y.dayKey),typeof y.dailyGardenHelpsCount=="number"&&y.dailyGardenHelpsCount>(_.dailyGardenHelpsCount??0)&&(_.dailyGardenHelpsCount=y.dailyGardenHelpsCount)})}_o().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(n.map(o=>o.unregister()))}if("caches"in window){const n=await caches.keys().catch(()=>[]);await Promise.all(n.map(o=>caches.delete(o)))}window.location.reload()}))});export{hs as M,wn as c,Re as s};
