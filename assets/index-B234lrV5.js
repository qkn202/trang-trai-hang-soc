const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-ClSoQ6I8.js","assets/game-data-LHOZhbEq.js","assets/sim-Bp4X3JYU.js","assets/engine-BQDU7lY5.js","assets/puzzleArcadeModal-CcyT9APp.js"])))=>i.map(i=>d[i]);
var wi=Object.defineProperty;var xi=(e,t,n)=>t in e?wi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var T=(e,t,n)=>xi(e,typeof t!="symbol"?t+"":t,n);import{F as Se,af as cn,ag as Ti,b as bt,w as xe,ah as $i,g as re,ai as Ct,aj as Zn,Q as dn,G as Bt,ae as qe,P as et,q as Qt,ak as $s,M as Ue,o as ze,al as ks,m as ki,Z as On,p as Ci,u as Mi,j as rt,s as Ne,$ as Mt,A as Oe,r as St,E as Li,I as Ai,N as Cs,R as Ms,y as Ei,D as Ft,U as Pi,H as ht,am as $t,S as qi,an as Hi,W as Ls,X as As,k as Dt,C as pn,_ as un,z as Jn,B as Ii,V as Bi,T as Xt,a2 as Di}from"./game-data-LHOZhbEq.js";import{i as ut,j as Nn,k as Oi,A as ft,n as Ni,l as it,m as Es,o as es,H as lt,L as gn,p as Ri,q as ts,t as vt,u as ns,v as Le,w as zi,x as Fi,y as ss,z as mn,B as me,C as wt,D as xt,F as Vi,G as yt,M as Ot,I as Gi,J as _i,K as Ui,N as Cn,P as is,O as ji,Q as Wi,R as Qi,S as as,U as os,V as at,W as Xi,X as Ps,Y as Ki,Z as Yi,_ as Vt,$ as Zi,a0 as Ji,a1 as Kt,a2 as ea,a3 as ta,a4 as qs,a5 as Ye,a6 as Ie,a7 as na,a8 as Gt,a9 as sa,aa as ia,ab as rs,ac as aa,ad as Ze,ae as Tt,af as Lt,d as oa,ag as bn,ah as hn,ai as ra,aj as la,ak as ca,al as da,am as pa,an as ua,ao as fn,g as ls,ap as vn,s as ga,aq as yn,E as ma}from"./sim-Bp4X3JYU.js";import{S as ba,I as ha,i as fa}from"./engine-BQDU7lY5.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const Nt={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function va(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const n=t.documentElement;n.setAttribute("data-colorblind",e.colorblindMode),n.setAttribute("data-font-scale",String(e.fontScale)),n.setAttribute("data-high-contrast",e.highContrast?"true":"false"),n.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function ya(e,t){t.ceiling.setAllVolumes(e.volumes)}const Hs=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],Sa=.18;function Rt(e,t=Sa){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const n=e<0?-1:1,a=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((n*Math.min(1,a)).toFixed(3))}function wa(e,t){if(Math.hypot(e,t)<.35)return null;let a=Math.atan2(t,e);a<0&&(a+=Math.PI*2);const i=Math.PI*2/8,o=(a+i*.5)%(Math.PI*2);return Math.floor(o/i)%8}class xa{constructor(){T(this,"prevConfirm",!1);T(this,"prevCancel",!1);T(this,"prevDpadUp",!1);T(this,"prevDpadDown",!1);T(this,"prevDpadLeft",!1);T(this,"prevDpadRight",!1)}poll(t){let n=t??null;if(!n&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const C=navigator.getGamepads();for(const f of C)if(f&&f.connected){n=f;break}}if(!n)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const a=Rt(n.axes[0]??0),i=Rt(n.axes[1]??0),o=Rt(n.axes[2]??0),r=Rt(n.axes[3]??0),l=!!n.buttons[0]?.pressed,s=!!n.buttons[1]?.pressed,c=!!n.buttons[4]?.pressed,d=!!n.buttons[12]?.pressed,u=!!n.buttons[13]?.pressed,p=!!n.buttons[14]?.pressed,g=!!n.buttons[15]?.pressed,m=l&&!this.prevConfirm,h=s&&!this.prevCancel,b=(g&&!this.prevDpadRight?1:0)-(p&&!this.prevDpadLeft?1:0),x=(u&&!this.prevDpadDown?1:0)-(d&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=s,this.prevDpadUp=d,this.prevDpadDown=u,this.prevDpadLeft=p,this.prevDpadRight=g;const k=c,v=k?wa(Math.abs(o)>0?o:a,Math.abs(r)>0?r:i):null,L=v!==null?Hs[v]?.actionId??null:null;return{connected:!0,panDx:k?0:a,panDy:k?0:i,cursorStepGx:b,cursorStepGy:x,radialOpen:k,radialSliceIndex:v,radialActionId:L,confirmJustPressed:m,cancelJustPressed:h}}}let Is=null,Pe=null,ke=null,Sn=null;function Bs(e){!ke&&typeof document<"u"&&(ke=document.getElementById("a11y-announcer")),!(!ke||!e)&&(ke.textContent="",requestAnimationFrame(()=>{ke&&(ke.textContent=e)}))}function Ta(e){const t=e.state.buildings.find(a=>a.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const n=Date.now();if(t.constructEndsAt>n)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-n)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const a=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-n)/1e3)),i=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${a} giây, tổng ${i} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function Mn(e){const t=e??Is;if(!t||(!Pe&&typeof document<"u"&&(Pe=document.getElementById("a11y-farm-status")),!Pe))return;const n=t.state,a=n.level,i=n.galleons.toLocaleString("vi-VN"),o=n.sandboxMode?"Vô hạn":String(n.match3?.stars??0),r=n.timeSand,l=n.farmBarn?.owlOrders??[],s=l.filter(u=>t.canFulfillFarmOwlOrder(u)).length,c=`${l.length} đơn hàng (${s} đơn đủ nông sản sẵn sàng giao)`,d=Ta(t);Pe.innerHTML=`
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${a}</td></tr>
        <tr><th scope="row">Vàng Galleon</th><td>${i} Galleons</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${o}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${r}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${c}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${d}</td></tr>
      </tbody>
    </table>
  `.trim()}function $a(e){Is=e,!(typeof document>"u")&&(ke||(ke=document.getElementById("a11y-announcer"),ke||(ke=document.createElement("div"),ke.id="a11y-announcer",ke.className="visually-hidden",ke.setAttribute("aria-live","polite"),ke.setAttribute("aria-atomic","true"),document.body.appendChild(ke))),Pe||(Pe=document.getElementById("a11y-farm-status"),Pe||(Pe=document.createElement("div"),Pe.id="a11y-farm-status",Pe.className="visually-hidden",Pe.setAttribute("role","region"),Pe.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(Pe))),Mn(e),Sn&&clearInterval(Sn),Sn=setInterval(()=>{Mn()},5e3))}const wn={init:$a,announce:Bs,refresh:()=>Mn()},ka="hpvn-burrow-garden",Ca=new Set(["auto","dawn","day","dusk","night"]),Ma=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),cs=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function At(e,t){const n=typeof e=="string"?e.trim():"";if(!n||n==="null")return!1;if(typeof window<"u"&&window.location?.origin&&n===window.location.origin)return!0;const a=t&&t.length>0?[...cs,...t]:cs;for(const i of a)if(typeof i=="string"){if(i===n)return!0}else if(i.test(n))return!0;return!1}function La(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const n=new URL(document.referrer).origin;if(At(n,t))return n}catch{}return null}function ds(e){const t=String(e||"day").toLowerCase();return Ca.has(t)?t:"day"}function ps(e){const t=String(e||"clear").toLowerCase();return Ma.has(t)?t:"clear"}function Ds(e={}){const t=e.parkName||"Trang Trại Hang Sóc",n=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",a=Math.max(1,Math.floor(Number(e.level)||1)),i=Math.max(0,Math.floor(Number(e.magicStars)||0)),o=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",s=e.keeperTitle?` · [${e.keeperTitle}]`:"",c={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},d=e.weatherMode&&c[e.weatherMode]?` (${c[e.weatherMode]})`:"";return`🏰 [${t}${n} · Cấp ${a}${l}${s}]${d} — ${o}/10 vùng mở khóa, ${r} công trình & ${i} 🌟 Sao Phép Thuật!`}function Aa(e={}){const t=[],n=e.win??(typeof window<"u"?window:void 0),a=e.nav??(typeof navigator<"u"?navigator:void 0);let i=La(e.targetOrigin,e.allowedOrigins);function o(s,c={}){const d={source:ka,version:"25.1",type:s,payload:c,sentAt:Date.now()};t.push(d),t.length>24&&t.shift();try{const u=n?.parent;if(u&&u!==n&&typeof u.postMessage=="function"){const p=e.targetOrigin||i||"*";u.postMessage(d,p)}}catch{}return d}function r(s){const c=s;if(c.source!=null&&n?.parent!=null&&c.source!==n.parent)return;if(!e.allowAnyOrigin&&typeof c.origin=="string"&&c.origin.length>0){if(!At(c.origin,e.allowedOrigins))return;i=c.origin}const d=c?.data;if(!d||typeof d!="object")return;const u=d.payload&&typeof d.payload=="object"?d.payload:{};if(d.type==="hpvn:burrow:set-atmosphere"||d.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(ds(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-weather"||d.type==="hpvn:host:set-weather")e.onWeatherChange?.(ps(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-event"||d.type==="hpvn:host:set-event")e.onEventChange?.(String(u.mode??d.mode??"auto"));else if(d.type==="hpvn:burrow:tour-garden"||d.type==="hpvn:host:tour-garden"){const p=u.tourId??d.tourId??null;p?e.onStartTour?.(String(p)):e.onStopTour?.()}else if(d.type==="hpvn:burrow:mute"||d.type==="hpvn:host:mute")e.onMuteChange?.(!!(u.muted??d.muted));else if(d.type==="hpvn:burrow:request-snapshot"||d.type==="hpvn:host:request-snapshot"){const p=e.getSnapshot?e.getSnapshot():{};o("hpvn:burrow:snapshot",p)}}n&&typeof n.addEventListener=="function"&&n.addEventListener("message",r);async function l(s={}){const c=Ds(s),d=o("hpvn:burrow:share-floo",{text:c,level:s.level??1,parkName:s.parkName??"Trang Trại Hang Sóc",...s.playerName?{playerName:s.playerName}:{},...s.tourId?{tourId:s.tourId}:{},...s.image?{image:s.image}:{},atmosphereMode:ds(s.atmosphereMode),weatherMode:ps(s.weatherMode),eventMode:s.eventMode??"auto"});if(typeof s.sendToFloo=="function"&&await s.sendToFloo(c,s)===!0)return e.notify?.(s.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:c,copied:!1,floo:!0,envelope:d};let u=!1;try{a?.clipboard?.writeText&&(await a.clipboard.writeText(c),u=!0)}catch{u=!1}return e.notify?.(u?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${c}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${c}"`),{ok:!0,text:c,copied:u,envelope:d}}return{notifyReady:(s={})=>o("hpvn:burrow:ready",s),syncState:(s={})=>o("hpvn:burrow:state",s),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{n&&typeof n.removeEventListener=="function"&&n.removeEventListener("message",r)}}}function Ln(e,t={},n){const o=n??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});o.width=640,o.height=380;const r=o.getContext("2d");if(!r)return o;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),s=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),c=Math.max(1,Math.floor(Number(t.level)||1)),d=t.house||"Gryffindor",u=Math.max(0,Math.floor(Number(t.magicStars)||0)),p=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),g=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const h={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(h,614,31),r.textAlign="left";const b=18,x=50,k=604,v=248;r.save(),r.beginPath(),r.rect(b,x,k,v),r.clip();let L=!1;if(e&&e.width>0&&e.height>0)try{const U=e.width/e.height,ce=k/v;let ie=0,N=0,X=e.width,ae=e.height;U>ce?(X=Math.round(e.height*ce),ie=Math.round((e.width-X)/2)):(ae=Math.round(e.width/ce),N=Math.round((e.height-ae)/2)),r.drawImage(e,ie,N,X,ae,b,x,k,v),L=!0}catch{L=!1}if(!L){const U=r.createLinearGradient(b,x,b,x+v);U.addColorStop(0,"#365843"),U.addColorStop(.55,"#598249"),U.addColorStop(1,"#334d2c"),r.fillStyle=U,r.fillRect(b,x,k,v)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(b,x,k,v);const C=18,f=304,S=604,M=58;r.fillStyle="#f6ebd2",r.fillRect(C,f,S,M),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(C,f,S,M);const H={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[d]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${H} ${l} · Cấp ${c}`,C+14,f+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const O=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${s} · Nhà ${d}${O} · ${g}/10 vùng · ${p} công trình · ${u} 🌟`,C+14,f+42);const E=142,D=34,R=C+S-E-12,j=f+12;return r.fillStyle="#1d5c4b",r.fillRect(R,j,E,D),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(R,j,E,D),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",R+E/2,j+D/2+1),r.textAlign="left",o}function Os(e,t=.55){try{const n=e.toDataURL("image/webp",t);if(typeof n=="string"&&n.startsWith("data:image/webp"))return n;const a=e.toDataURL("image/png");return typeof a=="string"?a:""}catch{return""}}const Ea={};function Be(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),n=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^n&15>>t/4).toString(16)})}function Ns(e,t){const n=Math.max(1,Math.floor(Number(t)||1)),a=e.effectivePrice??e.price,i=e.dailyRemaining??e.dailyLimit;let o=0;for(let r=0;r<n;r++)r<i?o+=a:e.overflowMultiplier&&e.overflowMultiplier>1?o+=Math.ceil(a*e.overflowMultiplier):o+=a;return o}const Pa=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function Yt(e,t={}){const n=e&&typeof e=="object"?e:{},a=n.details&&typeof n.details=="object"?n.details:{},i=String(n.reason||a.reason||"unknown-error"),o={...Pa,...t.labels||{}};switch(i){case"missing-crops":{const r=Array.isArray(a.missing)?a.missing:[];if(r.length>0){const l=r.map(s=>{const c=String(s.resource||"");return`${Math.max(1,Number(s.required||0)-Number(s.have||0))} ${o[c]||c}`});return{reason:i,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:i,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof a.shortBy=="number"?a.shortBy:typeof a.required=="number"&&typeof a.spendable=="number"?Math.max(1,a.required-a.spendable):null;return{reason:i,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(a.required||0),l=Number(a.have||0),s=Math.max(1,r-l);return{reason:i,icon:"🌟",text:`Thiếu ${s} Sao Phép Thuật`}}case"missing-supply":{const r=String(a.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:i,icon:"🌱",item:l,text:`Thiếu hạt ${o[l]||l}`}}return{reason:i,icon:"💧",item:r,text:`Thiếu ${o[r]||"vật tư"}`}}case"wallet-frozen":return{reason:i,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:i,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:i,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:i,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:i,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:i,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:i,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:i,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:i,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:i,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:i,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:i,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:i,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:i,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:i,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(i==="model-rejected"&&typeof a.modelCode=="string"&&t.modelText){const r=t.modelText(a.modelCode);if(r)return{reason:i,icon:"🪄",text:r}}return{reason:i,icon:"🪄",text:n.message||"Máy chủ từ chối thao tác"}}}}function qt(e){let t=null,n=null,a=Promise.resolve();const i=s=>{const c=a.then(s,s);return a=c.catch(()=>{}),c};async function o(s,c){const d=t?.catalogHash,u=d?{...c,catalogHash:d}:c,p=await e(s,u);if(!p||typeof p!="object"||!("garden"in p))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const g=p;return g.catalog===void 0&&d&&g.catalogHash===d&&(g.catalog=t?.catalog),t?.saleAdmin&&g.saleAdmin===void 0&&(g.saleAdmin=!0),t=g,t}async function r(s,c){const d=JSON.stringify({name:s,payload:c});if(n&&n.signature!==d)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");n||(n={signature:d,data:{...c,requestId:Be()}});try{const u=await o(s,n.data);return n=null,u}catch(u){throw u?.definitive===!0&&(n=null),u}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return n!==null},read:()=>i(()=>o("getBurrowGarden",{})),act:s=>i(()=>r("performBurrowAction",{...s,expectedRevision:l()})),free:(s,c={})=>i(()=>o("performBurrowAction",{...c,action:"freeAction",kind:s,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),guide:s=>i(()=>o("performBurrowAction",{action:"guideDone",lessonId:s,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),scene:s=>i(()=>o("performBurrowAction",{action:"setScene",scene:s,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),syncProfile:s=>i(()=>o("performBurrowAction",{...s,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),submitLeaderboard:s=>i(()=>o("performBurrowAction",{...s,action:"submitLeaderboard",expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),getLeaderboard:(s="match3")=>i(()=>o("performBurrowAction",{action:"getLeaderboard",gameId:s,expectedRevision:t?.garden.progression.revision??0,requestId:Be()})),visit:(s={})=>i(()=>e("visitBurrowGarden",s)),frame:s=>i(async()=>{const c=await e("setBurrowFlooFrame",{frameKey:s});return t&&Array.isArray(c.frames)&&typeof c.worn=="string"&&(t={...t,flooFrames:{frames:c.frames,worn:c.worn}}),c}),sales:(s={mode:"get"})=>i(()=>e("manageBurrowSales",s)),fireOut:s=>i(()=>e("extinguishBurrowGarden",{...s,requestId:Be()})),sell:(s,c)=>i(()=>r("sellBurrowGoods",s?{items:s,expectedTotal:c}:{clearance:!0,expectedTotal:c})),buy:(s,c=1)=>i(()=>{const d=t?.catalog?.find(u=>u.id===s);if(!d)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:s,quantity:c,catalogVersion:t?.catalogVersion,expectedTotal:Ns(d,c)})}),settleWallet:s=>i(()=>o("settleBurrowWallet",{direction:s.direction,amount:Math.max(1,Math.floor(s.amount)),...s.reasonCode?{reasonCode:s.reasonCode}:{},...s.sourceType?{sourceType:s.sourceType}:{},...typeof s.clientLevel=="number"?{clientLevel:Math.floor(s.clientLevel)}:{},requestId:typeof s.requestId=="string"&&s.requestId?s.requestId:Be()})),houseCup:()=>i(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(s,c)=>i(()=>e("contributeBurrowHouseCup",{points:s,...c?{house:c}:{}})),postCoop:s=>i(()=>e("postBurrowCoopRequest",{...s,requestId:typeof s.requestId=="string"?s.requestId:Be()})),fulfillCoop:s=>i(()=>e("fulfillBurrowCoopRequest",s)),listCoop:s=>i(()=>e("getBurrowCoopRequests",s?{hostUid:s}:{}))}}const Ve="hpvn-burrow-game";function Rn(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const n=new URLSearchParams(t);return n.get("burrow-ticket")??n.get("hpvn-ticket")}function Rs(e,t=window,n={}){let a=0;const i=new Map;let o=n.targetOrigin&&n.targetOrigin!=="*"?n.targetOrigin:null;if(!o&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;At(l,n.allowedOrigins)&&(o=l)}catch{}t.addEventListener("message",l=>{if(!n.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!At(l.origin,n.allowedOrigins))return;o=l.origin}const s=l.data;if(l.source!==t.parent||!s||s.channel!==Ve||s.nonce!==e||typeof s.id!="string"||!i.has(s.id))return;const c=i.get(s.id);i.delete(s.id),c(s)});const r=qt((l,s)=>new Promise((c,d)=>{const u=`burrow-${++a}`,p=setTimeout(()=>{i.delete(u),d(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);i.set(u,g=>{if(clearTimeout(p),"result"in g&&g.result&&typeof g.result=="object"){c(g.result);return}const m=new Error(typeof g.error=="string"?g.error:"Máy chủ từ chối thao tác.");m.definitive=g.definitive===!0,m.reason=typeof g.reason=="string"?g.reason:void 0,m.details=g.details&&typeof g.details=="object"?g.details:{},d(m)}),t.parent.postMessage({channel:Ve,nonce:e,id:u,action:"burrow",name:l,data:s},n.targetOrigin||o||"*")}));return r.host=(l,s={})=>new Promise(c=>{const d=`host-${++a}`,u=setTimeout(()=>{i.delete(d),c(null)},5e3);i.set(d,p=>{clearTimeout(u),c(p.result??null)}),t.parent.postMessage({...s,channel:Ve,nonce:e,id:d,action:l},n.targetOrigin||o||"*")}),r}function zs(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),n=e.sessionEndpoint??"/api/auth/session",a=e.fetchImpl??globalThis.fetch.bind(globalThis),i=e.getUid??ut,o=e.timeoutMs??18e3;let r=null,l=0;async function s(c){if(r&&Date.now()+3e4<l)return r;try{const d=typeof window<"u"?window:void 0,u=d?.__HPVN_CONFIG__?.getIdToken??d?.__HPVN_GET_ID_TOKEN__,p=u?await u().catch(()=>null):null,g=typeof window<"u"?Rn(window.location):null,m=await a(n,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":c,...p?{Authorization:`Bearer ${p}`}:{}},body:JSON.stringify({uid:c,...p?{idToken:p}:{},...g?{ticket:g}:{}})});if(!m.ok)return null;const h=await m.json();if(typeof h.uid=="string"&&h.uid&&!e.getUid&&Nn(h.uid),typeof h.token=="string"&&h.token)return r=h.token,l=Number(h.expiresAt||Date.now()+36e5),r}catch{}return null}return qt(async(c,d)=>{const u=i(),p=await s(u),g=new AbortController,m=setTimeout(()=>g.abort(),o);let h;try{const x={"Content-Type":"application/json","X-User-Id":u};p&&(x.Authorization=`Bearer ${p}`),h=await a(`${t}${c}`,{method:"POST",headers:x,body:JSON.stringify({data:d}),signal:g.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(m)}const b=await h.json();if(b.error||!h.ok){const x=new Error(b.error?.message||`Máy chủ từ chối thao tác (${h.status}).`);throw x.definitive=h.status<500,x.reason=typeof b.error?.details?.reason=="string"?b.error.details.reason:void 0,x.details=b.error?.details??{},x}return b.result??{}})}const Fs="asia-southeast1",tn="demo-hpvnn-burrow",qa="hpvnn-archive";function De(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function us(e){const t=new TextEncoder().encode(e);let n="";for(let a=0;a<t.length;a++)n+=String.fromCharCode(t[a]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Vs(e,t=tn,n=globalThis.location,a=Date.now()){const i=n?.hostname??"127.0.0.1";if(!De(i))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const o=Math.floor(a/1e3),r=us(JSON.stringify({alg:"none",typ:"JWT"})),l=us(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:o,user_id:e,sub:e,iat:o,exp:o+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${l}.`}function Gs(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!De(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const n=e.host??(t?.hostname||"127.0.0.1");if(!De(n))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const a=e.projectId||tn,i=e.region||Fs,o=e.port||5001,l=`${e.useSameOriginRewrite?"":`http://${n}:${o}`}/${a}/${i}/`,s=e.fetchImpl??globalThis.fetch.bind(globalThis),c=e.getUid??(()=>e.uid||ut()),d=e.now??(()=>Date.now()),u=e.timeoutMs??18e3;return qt(async(p,g)=>{const m=c(),h=Vs(m,a,{hostname:n},d()),b=new AbortController,x=setTimeout(()=>b.abort(),u);let k;try{k=await s(`${l}${p}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify({data:g}),signal:b.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout(x)}const v=await k.json();if(v.error||!k.ok){const L=new Error(v.error?.message||`Emulator từ chối thao tác (${k.status}).`);throw L.definitive=k.status<500,L.reason=typeof v.error?.details?.reason=="string"?v.error.details.reason:void 0,L.details=v.error?.details??{},L}return v.result??{}})}function _s(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),n=e.fetchImpl??globalThis.fetch.bind(globalThis),a=e.timeoutMs??2e4;return qt(async(i,o)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,s=new AbortController,c=setTimeout(()=>s.abort(),a);let d;try{const p={"Content-Type":"application/json"};l?p.Authorization=`Bearer ${l}`:p["X-User-Id"]=ut(),d=await n(`${t}${i}`,{method:"POST",headers:p,body:JSON.stringify({data:o}),signal:s.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(c)}const u=await d.json();if(u.error||!d.ok){const p=new Error(u.error?.message||`Cloud Functions từ chối thao tác (${d.status}).`);throw p.definitive=d.status<500,p.reason=typeof u.error?.details?.reason=="string"?u.error.details.reason:void 0,p.details=u.error?.details??{},p}return u.result??{}})}function Ha(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const n=async a=>{const i=a;if(!e.allowAnyOrigin&&typeof i.origin=="string"&&i.origin.length>0&&!At(i.origin,e.allowedOrigins))return;const o=i.data;if(!o||o.channel!==Ve||o.nonce!==e.nonce||typeof o.id!="string"||e.expectedSource&&i.source!==e.expectedSource)return;const r=i.source;if(!r||typeof r.postMessage!="function")return;const l=typeof i.origin=="string"&&i.origin.length>0&&i.origin!=="null"?i.origin:"*",s=o.id,c=String(o.action||"");if(c==="burrow"||c==="garden"){const d=String(o.name||""),u=o.data&&typeof o.data=="object"?o.data:{};try{const p=await e.transport(d,u);r.postMessage({channel:Ve,nonce:e.nonce,id:s,result:p},l)}catch(p){const g=p;r.postMessage({channel:Ve,nonce:e.nonce,id:s,error:g?.message||"Máy chủ từ chối thao tác.",definitive:g?.definitive===!0,reason:g?.reason,details:g?.details??{}},l)}return}try{const d=e.onHostAction?await e.onHostAction(c,o):{ok:!0};r.postMessage({channel:Ve,nonce:e.nonce,id:s,result:d},l)}catch(d){r.postMessage({channel:Ve,nonce:e.nonce,id:s,error:d instanceof Error?d.message:"Lỗi xử lý lệnh host.",definitive:!0},l)}};return t.addEventListener("message",n),()=>{t.removeEventListener("message",n)}}function gt(){if(typeof window<"u"){const e=Rn(window.location);if(e)return Rs(e,window);const t=new URLSearchParams(window.location.search),n=t.get("emulator"),a=t.get("functionsPort");if((n==="1"||a)&&De(window.location.hostname)){const l=Number(a||5001)||5001,s=t.get("project")||tn,c=t.get("uid")||void 0;return Gs({projectId:s,port:l,uid:c,useSameOriginRewrite:n==="vite"})}const i=window.__HPVN_CONFIG__,o=Ea?.VITE_HPVN_FUNCTIONS_URL,r=i?.functionsBaseUrl||o;if(r)return _s({functionsBaseUrl:r,getIdToken:i?.getIdToken})}return zs()}let gs=Promise.resolve();async function Ia(e,t){const n=typeof navigator<"u"?navigator:void 0,a=n&&"locks"in n?n.locks:void 0;if(a&&typeof a.request=="function")return a.request(e,async()=>t());const i=gs.then(t,t);return gs=i.catch(()=>{}),i}function Ba(e){const t=`${e.scope}-save-envelope`,n=e.persistent!==!1,a=e.storage??globalThis.localStorage,i=e.legacyKeys??[];let o={},r=null;function l(){if(r)return r;if(!n||!a)return o;const c=a.getItem(t);if(c!==null){const u=JSON.parse(c);if(!u||typeof u!="object"||Array.isArray(u))throw new Error("Bản lưu thung lũng không hợp lệ.");return u}const d={};for(const u of i){const p=a.getItem(u);p!==null&&(d[u]=p)}return d}function s(c){n&&a?a.setItem(t,JSON.stringify(c)):o=c}return{storageKey:t,getItem(c){return l()[c]??null},setItem(c,d){r?r[c]=String(d):s({...l(),[c]:String(d)})},transaction(c){if(r)return c();r={...l()};try{const d=c();return s(r),d}finally{r=null}}}}async function Da(e=gt()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const n=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(n.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(n.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(n.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(n.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function Oa(e,t,n=gt()){const a=await n.contributeHouseCup(e,t);if(!a||typeof a!="object")return null;const i=a.totals&&typeof a.totals=="object"?a.totals:{};return{weekKey:String(a.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(i.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(i.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(i.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(i.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(a.playerContribution)||0)),updatedAt:Number(a.updatedAt)||Date.now()}}async function Na(e,t=gt()){return t.postCoop(e)}async function Ra(e,t=gt()){return t.fulfillCoop(e)}const za=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:Ve,HPVN_DEFAULT_EMULATOR_PROJECT:tn,HPVN_FIREBASE_REGION:Fs,HPVN_PROD_FIREBASE_PROJECT:qa,attachHpvnParentShellResponder:Ha,computeClientPackTotal:Ns,contributeWeeklyHouseCupOnline:Oa,createAtomicGardenStorage:Ba,createAutoAuthoritativeClient:gt,createBurrowGardenClient:qt,createEmulatorFixtureToken:Vs,createFirebaseEmulatorClient:Gs,createFirebaseFunctionsClient:_s,createHpvnEmbedClient:Rs,createHttpAuthoritativeClient:zs,fetchWeeklyHouseCupStandingsOnline:Da,formatServerRefusalVi:Yt,fulfillCoopAssistanceOnline:Ra,generateRequestId:Be,getHpvnTicketFromLocation:Rn,isLocalDevelopmentHost:De,postCoopAssistanceOnline:Na,runWithStorageLock:Ia},Symbol.toStringTag,{value:"Module"})),Fa={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function zt(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const t=navigator.userActivation;if(t&&!t.hasBeenActive)return!1;try{const n=Fa[e]??15;return navigator.vibrate(n)}catch{return!1}}function K(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ms(e){const t=lt[e]??lt.Gryffindor;return{emoji:t.mascotEmoji,label:t.house,cls:`house-${t.cssSlug}`}}function Va(e){return e===1?"🥇 #1":e===2?"🥈 #2":e===3?"🥉 #3":`#${e}`}class Ga{constructor(t,n){T(this,"activeGameId","match3");T(this,"activeScope","valley");T(this,"activeHouseFilter","all");T(this,"redirectedFromUnscored",null);T(this,"onJumpToGame");T(this,"onVisitNeighbor");T(this,"onOpenNeighborBook");T(this,"root");T(this,"sim");T(this,"closeBound",!1);T(this,"sortingHatSpinning",!1);this.root=t,this.sim=n,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");return t||(t=document.createElement("dialog"),t.id="leaderboardDialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=`
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      `,this.root.appendChild(t)),this.closeBound||(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)&&t.addEventListener("click",n=>{if(n.target!==t)return;const a=t.getBoundingClientRect();a.top<=n.clientY&&n.clientY<=a.top+a.height&&a.left<=n.clientX&&n.clientX<=a.left+a.width||t.close()})),t}open(t,n,a){t?Oi(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=ft.includes(this.activeGameId)?this.activeGameId:Ni(t)):(this.redirectedFromUnscored=null,ft.includes(this.activeGameId)||(this.activeGameId="match3")),(n==="valley"||n==="friends"||n==="personal")&&(this.activeScope=n),(a==="all"||a&&it.includes(a))&&(this.activeHouseFilter=a);const i=this.ensureDialogMounted();this.render(),i.open||i.showModal(),Es(this.sim.state).catch(()=>{}).then(()=>Promise.all(ft.map(o=>es(o)))).then(()=>{i.open&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}renderHouseCupSectionHtml(t,n){const a=lt[n]??lt.Gryffindor,i=t.map(l=>{const s=l.meta,c=this.activeHouseFilter===l.house,d=l.rank===1?"🥇 #1":l.rank===2?"🥈 #2":l.rank===3?"🥉 #3":`#${l.rank}`;return`
          <button
            type="button"
            class="house-cup-card house-card-${s.cssSlug} ${l.isPlayerHouse?"is-player-house":""} ${c?"is-filtered-house":""}"
            data-lb-house-card="${l.house}"
            aria-pressed="${c}"
            title="${K(s.vnTitle)} (${K(s.gemNameVi)})"
          >
            <div class="house-cup-top">
              <span class="house-cup-crest" aria-hidden="true">${s.emblemSvg}</span>
              <div class="house-cup-meta">
                <div class="house-cup-name-row">
                  <strong>${d} ${K(s.house)}</strong>
                  ${l.isPlayerHouse?'<span class="house-you-pill">Bạn</span>':""}
                </div>
                <div class="house-cup-vn-title">${s.gemEmoji} ${K(s.gemShortVi)} • 👥 ${l.members}</div>
              </div>
              <span class="house-cup-hourglass-icon" aria-hidden="true" title="Đồng hồ cát ${K(s.gemNameVi)}">${s.hourglassSvg}</span>
            </div>
            <div class="house-cup-points-row">
              <span class="house-cup-points">${l.points.toLocaleString("vi-VN")} đ</span>
              <span class="house-cup-patronus" title="${K(s.patronusNameVi)}">${s.patronusEmoji}</span>
            </div>
            <div class="hourglass-bar" role="progressbar" aria-valuenow="${l.fillPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Mực đá quý ${K(s.gemShortVi)} của nhà ${K(s.house)}">
              <div class="hourglass-bar-fill" style="width:${l.fillPercent}%"></div>
            </div>
          </button>
        `}).join(""),o=it.map(l=>{const s=lt[l],c=l===n;return`
        <button
          type="button"
          class="lb-my-house-btn house-pill-${s.cssSlug} ${c?"active":""}"
          data-lb-pick-house="${l}"
          aria-pressed="${c}"
          title="${K(s.vnTitle)} (${K(s.traitsVi)})"
        >
          ${s.mascotEmoji} ${K(s.house)}
        </button>
      `}).join(""),r=[`
        <button
          type="button"
          class="filter-pill ${this.activeHouseFilter==="all"?"active":""}"
          data-lb-house-filter="all"
          aria-pressed="${this.activeHouseFilter==="all"}"
        >
          🏰 Tất Cả
        </button>
      `,...it.map(l=>{const s=lt[l],c=this.activeHouseFilter===l,d=t.find(u=>u.house===l)?.members??0;return`
          <button
            type="button"
            class="filter-pill filter-pill-${s.cssSlug} ${c?"active":""}"
            data-lb-house-filter="${l}"
            aria-pressed="${c}"
          >
            ${s.mascotEmoji} ${K(s.house)} <span class="filter-pill-count">(${d})</span>
          </button>
        `})].join("");return`
      <section class="house-cup-section" aria-label="Cúp 4 Nhà Hogwarts">
        <div class="house-cup-header-bar">
          <div class="house-cup-heading-copy">
            <h3 class="house-cup-heading">🏆 Cúp 4 Nhà Hogwarts</h3>
            <p class="house-cup-quote">🍬 Bùa Gặt Honeydukes • 🔢 Số Học Huyền Bí • 🦄 Sinh Vật Huyền Bí</p>
          </div>
          <div class="lb-sorting-hat-box">
            <div class="lb-sorting-hat-label">
              <span>${this.sim.state.minigameLeaderboard?.playerHouseLockedByServer?"🏰":"🎩"} <strong>${a.mascotEmoji} ${K(a.house)}</strong></span>
              ${this.sim.state.minigameLeaderboard?.playerHouseLockedByServer?'<span class="house-you-pill" title="Tự động đồng bộ theo tài khoản diễn đàn HPVN">Tài khoản HPVN</span>':`<button
                id="btnLbSortingHat"
                type="button"
                class="brass-btn lb-hat-roll-btn ${this.sortingHatSpinning?"is-spinning":""}"
                title="Đội Chiếc Nón Phân Loại"
              >
                🎩 Phân Loại
              </button>`}
            </div>
            ${this.sim.state.minigameLeaderboard?.playerHouseLockedByServer?"":`<div class="lb-my-house-pills" role="group" aria-label="Chọn Nhà Hogwarts của bạn">
              ${o}
            </div>`}
          </div>
        </div>

        <div class="hourglass-grid" id="house-cup-grid">
          ${i}
        </div>

        <div class="lb-controls">
          <div class="lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc bảng xếp hạng theo Nhà Hogwarts">
            ${r}
          </div>
        </div>
      </section>
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const n=gn[this.activeGameId],a=this.root.querySelector("#leaderboardDialogTitle");a&&(a.innerHTML=`🏆 Bảng Xếp Hạng • ${K(n.shortVi)}`);const i=ft.map(s=>{const c=gn[s],d=this.sim.getPlayerMinigameRank(s,"valley"),u=s===this.activeGameId;return`
        <button
          type="button"
          role="tab"
          aria-selected="${u}"
          data-lb-game="${s}"
          class="lb-game-tab ${u?"active":""}"
          title="${K(c.titleVi)} — #${d}"
        >
          <img src="${c.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${K(c.shortVi)}</strong>
            <span class="lb-tab-rank-pill">${d<=3?"👑 ":""}#${d}</span>
          </span>
        </button>
      `}).join(""),o=`
      <div class="lb-toolbar-row">
        <div class="lb-scope-pills" role="tablist" aria-label="Phạm vi bảng xếp hạng">
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope==="valley"}"
            data-lb-scope="valley"
            class="lb-scope-pill ${this.activeScope==="valley"?"active":""}"
          >
            🌍 Thung Lũng
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope==="friends"}"
            data-lb-scope="friends"
            class="lb-scope-pill ${this.activeScope==="friends"?"active":""}"
          >
            🤝 Bạn Bè
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope==="personal"}"
            data-lb-scope="personal"
            class="lb-scope-pill ${this.activeScope==="personal"?"active":""}"
          >
            📜 Kỷ Lục
          </button>
        </div>

        <div class="lb-toolbar-actions">
          ${this.activeScope==="friends"?`<button id="btnLbOpenFriendsBook" type="button" class="brass-btn lb-action-btn" title="Kết bạn qua Mã Điền Trang">
                  🦉 Thêm Bạn
                </button>`:""}
          <button id="btnLbPlayActiveGame" type="button" class="brass-btn gold-cta lb-action-btn">
            ▶️ ${K(n.shortVi)}
          </button>
        </div>
      </div>
    `,r=this.activeScope==="personal"?this.renderPersonalThreeGamesTableHtml():this.renderStandingViewHtml(this.activeScope),l=this.redirectedFromUnscored?`<div class="lb-unscored-note" role="note">
          📌 <strong>${K(gn[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không xếp hạng — dưới đây là Bảng Xếp Hạng <strong>3 môn tính điểm</strong> (Bùa Gặt • Số Học • Sinh Vật).
        </div>`:"";t.innerHTML=`
      <div class="lb-shell">
        ${l}
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">
          ${i}
        </div>
        ${o}
        ${r}
      </div>
    `,this.bindEvents(t)}renderPodiumCardHtml(t,n){if(!t)return"";const a=n===1?"🥇":n===2?"🥈":"🥉",i=ms(t.house),o=t.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${K(t.portraitSprite)}.png" alt="" class="lb-podium-avatar-img" />`:`<span class="lb-podium-avatar-emoji" aria-hidden="true">${K(t.avatarEmoji)}</span>`;return`
      <div class="lb-podium-card place-${n} ${t.isPlayer?"is-player":""}">
        <div class="lb-podium-medal">${a} #${n}</div>
        <div class="lb-podium-avatar-wrap">${o}</div>
        <div class="lb-podium-name">${K(t.name)}</div>
        <div class="lb-podium-house ${i.cls}">${i.emoji} ${i.label}</div>
        <div class="lb-podium-primary">${K(t.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${K(t.ratingDisplayVi)}</div>
      </div>
    `}renderStandingViewHtml(t){const n=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:a,entries:i,playerEntry:o,playerRank:r,totalEntries:l,nextRivalAbove:s,houseStandings:c,playerHouse:d}=n,u=s?`🎯 Đuổi <strong>#${s.rank} ${K(s.name)}</strong> (${K(s.primaryDisplayVi)})`:`👑 Đang dẫn đầu <strong>#1</strong> (${K(a.shortVi)})`,p=this.renderHouseCupSectionHtml(c,d),g=i.length>0?`
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(i[1],2)}
        ${this.renderPodiumCardHtml(i[0],1)}
        ${this.renderPodiumCardHtml(i[2],3)}
      </div>
    `:"",m=i.length>0?i.map(h=>{const b=ms(h.house),x=Va(h.rank),k=h.isPlayer?'<span class="lb-role-tag you">Bạn</span>':h.isCloudPlayer?'<span class="lb-role-tag cloud">🌐</span>':h.isFriend?'<span class="lb-role-tag friend">🤝</span>':"",v=!h.isPlayer&&h.neighborId?`<button type="button" class="lb-mini-visit-btn" data-lb-visit="${K(h.neighborId)}" title="Thăm ${K(h.name)}">🏡</button>`:"";return`
          <tr class="lb-row ${h.isPlayer?"is-player":""} ${h.rank<=3?`top-${h.rank}`:""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <span class="lb-rank-chip rank-${Math.min(4,h.rank)}">${x}</span>
                <span class="lb-avatar-badge" aria-hidden="true">${K(h.avatarEmoji)}</span>
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${K(h.name)}</strong>
                    ${k}
                  </div>
                  <div class="lb-contender-sub">
                    <span class="${b.cls}">${b.emoji} ${b.label}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <span class="lb-league-pill tier-${h.league.tierId}">${h.league.icon} ${K(h.league.labelVi)}</span>
            </td>
            <td class="lb-cell-primary">
              <strong>${K(h.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${K(h.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${K(h.detailDisplayVi)}</span>
                ${v}
              </div>
            </td>
          </tr>
        `}).join(""):`
          <tr class="lb-row lb-empty-house-row">
            <td colspan="5" class="lb-empty-house-cell">
              Chưa có học viên.
            </td>
          </tr>
        `;return`
      <div class="lb-cup-banner">
        <img src="${a.spriteIcon}" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">${K(a.shortVi)}</div>
          <div class="lb-cup-chase">${u}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng</span>
          <strong class="lb-player-rank-num">#${r}<span>/${l}</span></strong>
          <span class="lb-league-pill tier-${o.league.tierId}">${o.league.icon} ${K(o.league.labelVi)}</span>
        </div>
      </div>

      ${p}

      ${g}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Bậc'; --label-3: '${K(a.primaryColVi)}'; --label-4: '${K(a.secondaryColVi)}'; --label-5: 'Chi Tiết';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            ${K(a.shortVi)} (${i.length}/${l})
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bậc</th>
              <th scope="col">${K(a.primaryColVi)}</th>
              <th scope="col">${K(a.secondaryColVi)}</th>
              <th scope="col">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            ${m}
          </tbody>
        </table>
      </div>
    `}renderPersonalThreeGamesTableHtml(){return`
      <div class="lb-cup-banner">
        <img src="/trang-trai-hang-soc/sprites/m3_icon_star.png" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">📜 Kỷ Lục 3 Môn Tính Điểm</div>
          <div class="lb-cup-sub">🍬 Bùa Gặt Honeydukes • 🔢 Số Học Huyền Bí • 🦄 Sinh Vật Huyền Bí</div>
        </div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="lbPersonalTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Hạng'; --label-3: 'Đỉnh'; --label-4: 'Điểm'; --label-5: 'Chơi';"
        >
          <caption id="lbPersonalTableCaption" class="lb-table-caption">
            Kỷ lục cá nhân 3 môn tính điểm
          </caption>
          <thead>
            <tr>
              <th scope="col">Môn</th>
              <th scope="col">Hạng</th>
              <th scope="col">Đỉnh</th>
              <th scope="col">Điểm</th>
              <th scope="col">Chơi</th>
            </tr>
          </thead>
          <tbody>
            ${this.sim.getAllPersonalLeaderboardSummaries().map(a=>`
          <tr class="lb-row ${a.gameId===this.activeGameId?"is-player":""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <img src="${a.meta.spriteIcon}" alt="" class="lb-tab-sprite" />
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${K(a.meta.shortVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${a.league.tierId}">${a.league.icon} ${K(a.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${a.valleyRank}/${a.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 #${a.friendsRank}/${a.friendsTotal}</div>
            </td>
            <td class="lb-cell-primary">
              <strong>${K(a.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${K(a.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${K(a.detailDisplayVi)}</span>
                <button type="button" class="brass-btn gold-cta lb-mini-play-btn" data-lb-jump-play="${a.gameId}">
                  ▶️ Chơi
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
          </tbody>
        </table>
      </div>
    `}bindEvents(t){t.querySelectorAll("[data-lb-game]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbGame;!a||!ft.includes(a)||(this.sim.audio.playClick(),this.activeGameId=a,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),Ri(this.sim.state,a).catch(()=>{}).then(()=>es(a)).then(()=>{this.activeGameId===a&&this.render()}))})}),t.querySelectorAll("[data-lb-scope]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbScope;a&&(this.sim.audio.playClick(),this.activeScope=a,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbHouseFilter;a&&(this.sim.audio.playClick(),a==="all"?this.activeHouseFilter="all":it.includes(a)&&(this.activeHouseFilter=a),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbHouseCard;!a||!it.includes(a)||(this.sim.audio.playClick(),this.activeHouseFilter=this.activeHouseFilter===a?"all":a,this.render())})}),t.querySelectorAll("[data-lb-pick-house]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbPickHouse;!a||!it.includes(a)||(this.sim.setPlayerHouse(a,this.activeGameId),this.activeHouseFilter!=="all"&&(this.activeHouseFilter=a),this.render())})}),t.querySelector("#btnLbSortingHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0;const n=this.sim.rollPlayerSortingHat(this.activeGameId);this.activeHouseFilter!=="all"&&(this.activeHouseFilter=n),this.render(),window.setTimeout(()=>{this.sortingHatSpinning=!1,this.render()},420)}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const n=this.activeGameId;this.close(),this.onJumpToGame?.(n)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbJumpPlay;a&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(a))})}),t.querySelectorAll("[data-lb-visit]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbVisit;a&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(a))})})}}const _a=1,Ua=3,bs=.15,ja="hangsoc_minigame_orient_v1",Wa=8,Qa=110;function ot(e){if(!Number.isFinite(e))return 1;const t=Math.min(Ua,Math.max(_a,e));return Math.round(t*1e3)/1e3}function xn(e,t){return((Math.round(e)+Math.round(t))%4+4)%4}function Xa(e,t,n,a=!1,i=!1){const o=Math.max(1,t||1024),r=Math.max(1,n||768),l=i?o>=881||o>r&&o>=640:o>=980||o>r&&r<=620;return e==="auto"?{effectiveLayout:l?"landscape":"portrait",dialogQuarterTurn:0}:e==="landscape"?o<r?{effectiveLayout:"landscape",dialogQuarterTurn:a?3:1}:{effectiveLayout:"landscape",dialogQuarterTurn:0}:o>r&&r<=640?{effectiveLayout:"portrait",dialogQuarterTurn:a?1:3}:{effectiveLayout:"portrait",dialogQuarterTurn:0}}function Tn(e,t,n,a){const i=(e-n.left)/Math.max(1,n.width),o=(t-n.top)/Math.max(1,n.height);switch(a){case 1:return{lu:o,lv:1-i};case 2:return{lu:1-i,lv:1-o};case 3:return{lu:1-o,lv:i};default:return{lu:i,lv:o}}}function hs(e,t,n){switch(n){case 1:return{vx:t,vy:-e};case 2:return{vx:-e,vy:-t};case 3:return{vx:-t,vy:e};default:return{vx:e,vy:t}}}function fs(e){const{prevZoom:t,nextZoom:n,prevPanX:a,prevPanY:i,prevMidOffsetX:o,prevMidOffsetY:r,currMidOffsetX:l,currMidOffsetY:s}=e,c=n<=1.015?1:ot(n);if(c<=1.001)return{zoom:1,panX:0,panY:0};const d=Math.max(.25,t||1),u=c/d;return{zoom:c,panX:l-(o-a)*u,panY:s-(r-i)*u}}function Ka(e,t,n,a,i){if(i%2===0||e<=10||t<=10||n<=10||a<=10)return 1;const o=e/a,r=t/n;return Math.min(1,Math.max(.45,Math.min(o,r)))}function Ya(e,t,n,a,i,o,r,l){if(n<=0||a<=0||i<=0||o<=0||r<=1.005)return{panX:0,panY:0};const s=l%2===1?o:i,c=l%2===1?i:o,d=s*r,u=c*r,p=36,g=36,m=Math.max(0,(d-n)*.5+p),h=Math.max(0,(u-a)*.5+g),b=Math.min(m,Math.max(-m,Number.isFinite(e)?e:0)),x=Math.min(h,Math.max(-h,Number.isFinite(t)?t:0));return{panX:Math.abs(b)<.5?0:Math.round(b*10)/10,panY:Math.abs(x)<.5?0:Math.round(x*10)/10}}class Za{constructor(){T(this,"states",new Map);T(this,"orientationPref","auto");T(this,"dialogFlip180",!1);T(this,"spacePressed",!1);T(this,"lastPinchEndMs",0);T(this,"activePinchCount",0);try{typeof sessionStorage<"u"&&sessionStorage.removeItem(ja)}catch{}typeof window<"u"&&(window.addEventListener("keydown",t=>{if(t.code==="Space"){const n=t.target?.tagName;n!=="INPUT"&&n!=="TEXTAREA"&&n!=="BUTTON"&&(this.spacePressed=!0)}}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1)}),window.addEventListener("blur",()=>{this.spacePressed=!1}))}isPinchOrCooldownActive(){return this.activePinchCount>=2?!0:(typeof performance<"u"?performance.now():Date.now())-this.lastPinchEndMs<Qa}getState(t){let n=this.states.get(t);return n||(n={zoom:1,panX:0,panY:0,boardQuarterTurns:0,panMode:!1},this.states.set(t,n)),n}getOrientationPref(){return this.orientationPref}setOrientationPref(t){this.orientationPref=t,this.dialogFlip180=!1}getViewportResolution(t=!1){const n=typeof window<"u"?window.innerWidth:1280,a=typeof window<"u"?window.innerHeight:800;return Xa(this.orientationPref,n,a,this.dialogFlip180,t)}getEffectiveLayout(t=!1){return this.getViewportResolution(t).effectiveLayout}getNetQuarterTurns(t){const n=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(t==="seedquiz");return xn(a,n.boardQuarterTurns)}toggleOrientation(t=!1){const a=this.getEffectiveLayout(t)==="landscape"?"portrait":"landscape";this.setOrientationPref(a);for(const i of this.states.values())i.panX=0,i.panY=0;return a}stepZoom(t,n){const a=this.getState(t);return a.zoom=ot(a.zoom+n),a.zoom<=1.01&&(a.panX=0,a.panY=0,a.panMode=!1),a.zoom}setZoom(t,n){const a=this.getState(t);return a.zoom=ot(n),a.zoom<=1.01&&(a.panX=0,a.panY=0,a.panMode=!1),a.zoom}resetView(t){const n=this.getState(t);n.zoom=1,n.panX=0,n.panY=0,n.boardQuarterTurns=0,n.panMode=!1}rotate90(t){const n=this.getState(t);return n.boardQuarterTurns=xn(n.boardQuarterTurns,1),n.panX=0,n.panY=0,n.boardQuarterTurns}togglePanMode(t){const n=this.getState(t);return n.panMode=!n.panMode,n.panMode}renderToolbarHtml(t,n){return""}syncToolbarDOM(t,n){}applyDialogOrientation(t,n,a=!1){const i=this.getViewportResolution(a),o=String(i.dialogQuarterTurn*90);return t?.dataset&&(t.dataset.mgLayout=i.effectiveLayout,t.dataset.mgRotate=o),n?.dataset&&(n.dataset.mgLayout=i.effectiveLayout,n.dataset.mgRotate=o),i}clearDialogOrientation(t,n){t?.dataset&&(delete t.dataset.mgLayout,delete t.dataset.mgRotate),n?.dataset&&(delete n.dataset.mgLayout,delete n.dataset.mgRotate)}applyCanvasStageTransform(t,n,a){const i=this.getState(t),{dialogQuarterTurn:o}=this.getViewportResolution(!1),r=xn(o,i.boardQuarterTurns);if(!n||!a)return{effectiveScale:i.zoom,netQuarterTurns:r};const l=n.clientWidth,s=n.clientHeight,c=a.offsetWidth,d=a.offsetHeight,u=Ka(l,s,c,d,i.boardQuarterTurns),p=i.zoom*u,g=Ya(i.panX,i.panY,l,s,c,d,p,i.boardQuarterTurns);return i.panX=g.panX,i.panY=g.panY,n.dataset.mgPanMode=String(i.panMode),i.panX===0&&i.panY===0&&Math.abs(p-1)<.002&&i.boardQuarterTurns===0?(a.style.transform="",a.style.transformOrigin=""):(a.style.transformOrigin="center center",a.style.transform=i.boardQuarterTurns===0?`translate3d(${i.panX}px, ${i.panY}px, 0) scale(${p.toFixed(4)})`:`translate3d(${i.panX}px, ${i.panY}px, 0) scale(${p.toFixed(4)}) rotate(${i.boardQuarterTurns*90}deg)`),{effectiveScale:p,netQuarterTurns:r}}applyDomScrollStageTransform(t,n,a){const i=this.getState("seedquiz");if(!t||!n||!a)return;const o=i.zoom,r=i.boardQuarterTurns;if(Math.abs(o-1)<.002&&r===0){a.style.transform="",a.style.transformOrigin="",a.style.width="",n.style.width="",n.style.height="";return}a.style.width="100%";const l=a.offsetWidth||t.clientWidth||640,s=a.offsetHeight||480;if(r===0)a.style.transformOrigin="0 0",a.style.transform=`scale(${o.toFixed(4)})`,n.style.width=`${Math.ceil(l*o)}px`,n.style.height=`${Math.ceil(s*o)}px`;else{const c=r*90,d=(r%2===1?s:l)*o,u=(r%2===1?l:s)*o;n.style.width=`${Math.ceil(d)}px`,n.style.height=`${Math.ceil(u)}px`,a.style.transformOrigin="center center";const p=(d-l)*.5,g=(u-s)*.5;a.style.transform=`translate3d(${p.toFixed(1)}px, ${g.toFixed(1)}px, 0) scale(${o.toFixed(4)}) rotate(${c}deg)`}}bindCanvasStageInteractions(t){const{gameId:n,panAreaEl:a,canvasShellEl:i,canvasEl:o,canSingleFingerPanAt:r,onTransformUpdated:l}=t;if(!a||!i)return;const s=()=>{this.applyCanvasStageTransform(n,a,i),l()},c=f=>{f.touches&&f.touches.length>=2&&f.preventDefault()};a.addEventListener("touchmove",c,{passive:!1});const d=f=>{f.preventDefault()};a.addEventListener("gesturestart",d,{passive:!1}),a.addEventListener("gesturechange",d,{passive:!1}),a.addEventListener("wheel",f=>{f.preventDefault();const S=this.getState(n),M=f.ctrlKey?.009:.0018,A=S.zoom*Math.exp(-f.deltaY*M),H=a.getBoundingClientRect(),{dialogQuarterTurn:O}=this.getViewportResolution(!1),{lu:E,lv:D}=Tn(f.clientX,f.clientY,H,O),R=(E-.5)*a.clientWidth,j=(D-.5)*a.clientHeight,U=fs({prevZoom:S.zoom,nextZoom:A,prevPanX:S.panX,prevPanY:S.panY,prevMidOffsetX:R,prevMidOffsetY:j,currMidOffsetX:R,currMidOffsetY:j});U.zoom===S.zoom&&U.panX===S.panX&&U.panY===S.panY||(S.zoom=U.zoom,S.panX=U.panX,S.panY=U.panY,s())},{passive:!1}),a.addEventListener("contextmenu",f=>{this.getState(n).zoom>1.01&&f.preventDefault()});const u=new Map;let p=!1,g=0,m=0,h=0,b=null,x=null,k=0,v=0;const L=f=>{if(o){try{o.releasePointerCapture?.(f)}catch{}if(typeof PointerEvent<"u")try{o.dispatchEvent(new PointerEvent("pointercancel",{pointerId:f,bubbles:!0}))}catch{}}};a.addEventListener("pointerdown",f=>{if(f.pointerType==="touch"){if(u.set(f.pointerId,{x:f.clientX,y:f.clientY}),this.activePinchCount=u.size,u.size>=2){b=null;const H=Array.from(u.values());if(g=Math.max(10,Math.hypot(H[1].x-H[0].x,H[1].y-H[0].y)),m=(H[0].x+H[1].x)*.5,h=(H[0].y+H[1].y)*.5,p){L(f.pointerId);try{a.setPointerCapture?.(f.pointerId)}catch{}}else{p=!0;for(const O of u.keys()){L(O);try{a.setPointerCapture?.(O)}catch{}}}f.stopPropagation(),f.preventDefault();return}this.getState(n).zoom>1.02&&r&&r(f.clientX,f.clientY)?b={pointerId:f.pointerId,startX:f.clientX,startY:f.clientY,lastX:f.clientX,lastY:f.clientY,active:!1}:b=null;return}const S=this.getState(n);if(f.button===1||f.button===2&&S.zoom>1.01||f.button===0&&S.zoom>1.01&&(f.altKey||this.spacePressed)){x=f.pointerId,k=f.clientX,v=f.clientY,a.dataset.mgDragging="true";try{a.setPointerCapture?.(f.pointerId)}catch{}f.stopPropagation(),f.preventDefault()}},{capture:!0}),a.addEventListener("pointermove",f=>{if(f.pointerType==="touch"&&u.has(f.pointerId)){if(u.set(f.pointerId,{x:f.clientX,y:f.clientY}),p&&u.size>=2){const S=Array.from(u.values()),M=Math.max(10,Math.hypot(S[1].x-S[0].x,S[1].y-S[0].y)),A=(S[0].x+S[1].x)*.5,H=(S[0].y+S[1].y)*.5,O=this.getState(n),E=O.zoom*(M/Math.max(10,g)),D=a.getBoundingClientRect(),{dialogQuarterTurn:R}=this.getViewportResolution(!1),j=Tn(m,h,D,R),U=Tn(A,H,D,R),ce=(j.lu-.5)*a.clientWidth,ie=(j.lv-.5)*a.clientHeight,N=(U.lu-.5)*a.clientWidth,X=(U.lv-.5)*a.clientHeight,ae=fs({prevZoom:O.zoom,nextZoom:E,prevPanX:O.panX,prevPanY:O.panY,prevMidOffsetX:ce,prevMidOffsetY:ie,currMidOffsetX:N,currMidOffsetY:X});O.zoom=ae.zoom,O.panX=ae.panX,O.panY=ae.panY,g=M,m=A,h=H,s(),f.stopPropagation(),f.preventDefault();return}if(p){f.stopPropagation(),f.preventDefault();return}if(b&&b.pointerId===f.pointerId){const S=Math.hypot(f.clientX-b.startX,f.clientY-b.startY);if(!b.active&&S>=Wa){b.active=!0,b.lastX=f.clientX,b.lastY=f.clientY,a.dataset.mgDragging="true",L(f.pointerId);try{a.setPointerCapture?.(f.pointerId)}catch{}}if(b.active){const M=this.getState(n),{dialogQuarterTurn:A}=this.getViewportResolution(!1),H=hs(f.clientX-b.lastX,f.clientY-b.lastY,A);M.panX+=H.vx,M.panY+=H.vy,b.lastX=f.clientX,b.lastY=f.clientY,s(),f.stopPropagation(),f.preventDefault();return}}}if(x===f.pointerId){const S=this.getState(n),{dialogQuarterTurn:M}=this.getViewportResolution(!1),A=hs(f.clientX-k,f.clientY-v,M);S.panX+=A.vx,S.panY+=A.vy,k=f.clientX,v=f.clientY,s(),f.stopPropagation(),f.preventDefault()}},{capture:!0});const C=f=>{if(f.pointerType==="touch"&&u.has(f.pointerId)){u.delete(f.pointerId),this.activePinchCount=u.size;try{a.releasePointerCapture?.(f.pointerId)}catch{}if(p){if(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now(),u.size===0)p=!1;else if(u.size>=2){const S=Array.from(u.values());g=Math.max(10,Math.hypot(S[1].x-S[0].x,S[1].y-S[0].y)),m=(S[0].x+S[1].x)*.5,h=(S[0].y+S[1].y)*.5}f.stopPropagation(),f.preventDefault();return}if(b&&b.pointerId===f.pointerId){const S=b.active;if(b=null,delete a.dataset.mgDragging,S){f.stopPropagation(),f.preventDefault();return}}}if(x===f.pointerId){x=null,delete a.dataset.mgDragging;try{a.releasePointerCapture?.(f.pointerId)}catch{}f.stopPropagation(),f.preventDefault()}};a.addEventListener("pointerup",C,{capture:!0}),a.addEventListener("pointercancel",C,{capture:!0}),this.applyCanvasStageTransform(n,a,i)}bindDomScrollStageInteractions(t){const{scrollViewportEl:n,sizerEl:a,contentStageEl:i}=t,o="seedquiz",r=()=>{this.applyDomScrollStageTransform(n,a,i)};if(!n||!a||!i)return;const l=b=>{b.preventDefault()};n.addEventListener("gesturestart",l,{passive:!1}),n.addEventListener("gesturechange",l,{passive:!1}),n.addEventListener("wheel",b=>{if(!b.ctrlKey&&!b.metaKey)return;b.preventDefault();const x=this.getState(o),k=x.zoom,v=k*Math.exp(-b.deltaY*.007),L=v<=1.015?1:ot(v);if(L===k)return;const C=n.getBoundingClientRect(),f=b.clientX-C.left,S=b.clientY-C.top,M=n.scrollLeft,A=n.scrollTop;x.zoom=L,r();const H=x.zoom/Math.max(.25,k);n.scrollLeft=Math.max(0,(M+f)*H-f),n.scrollTop=Math.max(0,(A+S)*H-S)},{passive:!1});let s=0,c=0,d=0,u=!1;n.addEventListener("touchstart",b=>{if(b.touches.length>=2){u=!0,this.activePinchCount=b.touches.length;const x=b.touches[0],k=b.touches[1];s=Math.max(10,Math.hypot(k.clientX-x.clientX,k.clientY-x.clientY));const v=n.getBoundingClientRect();c=(x.clientX+k.clientX)*.5-v.left,d=(x.clientY+k.clientY)*.5-v.top}},{passive:!0}),n.addEventListener("touchmove",b=>{if(b.touches.length<2)return;b.preventDefault(),u=!0;const x=b.touches[0],k=b.touches[1],v=Math.max(10,Math.hypot(k.clientX-x.clientX,k.clientY-x.clientY)),L=n.getBoundingClientRect(),C=(x.clientX+k.clientX)*.5-L.left,f=(x.clientY+k.clientY)*.5-L.top;if(s>0){const S=this.getState(o),M=S.zoom,A=M*(v/s),H=A<=1.015?1:ot(A),O=n.scrollLeft,E=n.scrollTop;S.zoom=H,r();const D=S.zoom/Math.max(.25,M);n.scrollLeft=Math.max(0,(O+c)*D-C),n.scrollTop=Math.max(0,(E+d)*D-f)}s=v,c=C,d=f},{passive:!1});const p=b=>{if(this.activePinchCount=b.touches.length,b.touches.length<2)s>0&&(this.lastPinchEndMs=typeof performance<"u"?performance.now():Date.now()),s=0;else{const x=b.touches[0],k=b.touches[1];s=Math.max(10,Math.hypot(k.clientX-x.clientX,k.clientY-x.clientY));const v=n.getBoundingClientRect();c=(x.clientX+k.clientX)*.5-v.left,d=(x.clientY+k.clientY)*.5-v.top}};n.addEventListener("touchend",p,{passive:!0}),n.addEventListener("touchcancel",p,{passive:!0});const g=new Map;let m=0;n.addEventListener("pointerdown",b=>{if(!(b.pointerType!=="touch"||u)&&(g.set(b.pointerId,{x:b.clientX,y:b.clientY}),g.size>=2)){const x=Array.from(g.values());m=Math.max(10,Math.hypot(x[1].x-x[0].x,x[1].y-x[0].y))}},{passive:!0}),n.addEventListener("pointermove",b=>{if(!(b.pointerType!=="touch"||u||!g.has(b.pointerId))&&(g.set(b.pointerId,{x:b.clientX,y:b.clientY}),g.size>=2&&m>0)){const x=Array.from(g.values()),k=Math.max(10,Math.hypot(x[1].x-x[0].x,x[1].y-x[0].y)),v=this.getState(o),L=v.zoom*(k/m);v.zoom=L<=1.015?1:ot(L),m=k,r(),b.preventDefault()}},{passive:!1});const h=b=>{g.delete(b.pointerId),g.size<2&&(m=0)};n.addEventListener("pointerup",h,{passive:!0}),n.addEventListener("pointercancel",h,{passive:!0}),r()}}const Re=new Za;function J(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const $n=["en","ko","zh","es","ja"],kn=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class Ja{constructor(t,n,a,i,o){T(this,"root");T(this,"sim");T(this,"onRefreshHud");T(this,"onToast");T(this,"onEquipAndSow");T(this,"targetCropId","ottery_wheat");T(this,"pendingPlotUid",null);T(this,"challenge",null);T(this,"answeredOutcome",null);T(this,"selectedChoiceIdx",null);T(this,"placedTokenIndices",[]);T(this,"selectedLeftPairId",null);T(this,"matchedPairIds",new Set);T(this,"flashWrongPairKey",null);T(this,"pairMistakes",0);T(this,"cropFilter","all");T(this,"activeSubView","practice");T(this,"codexQuery","");T(this,"codexBoxFilter","all");T(this,"sessionShownQids",new Set);T(this,"skipFormatOffset",0);T(this,"starterChallengePendingPack",!1);T(this,"dialogCloseBound",!1);T(this,"onOpenLeaderboard");this.root=t,this.sim=n,this.onRefreshHud=a,this.onToast=i,this.onEquipAndSow=o,typeof window<"u"&&(window.addEventListener("resize",()=>{if(!this.isOpen())return;const r=this.getDialog(),l=typeof r?.querySelector=="function"?r.querySelector(".sq-modal-inner"):null;Re.applyDialogOrientation(r,l,!0),this.syncSeedQuizViewportTransform()}),window.addEventListener("keydown",r=>{if(!this.isOpen())return;const l=r.target?.tagName;l==="INPUT"||l==="TEXTAREA"||l==="SELECT"||(r.key==="+"||r.key==="="?(r.preventDefault(),Re.stepZoom("seedquiz",bs),this.syncSeedQuizViewportTransform()):r.key==="-"||r.key==="_"?(r.preventDefault(),Re.stepZoom("seedquiz",-bs),this.syncSeedQuizViewportTransform()):r.key==="0"&&(r.ctrlKey||r.metaKey)&&(r.preventDefault(),Re.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))}))}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=t.querySelector("#sqScrollViewport"),a=t.querySelector("#sqZoomSizer"),i=t.querySelector("#sqZoomStage");Re.applyDomScrollStageTransform(n,a,i),Re.syncToolbarDOM(t,"seedquiz")}open(t,n,a,i,o,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(Se).filter(u=>this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel);if(t&&Se[t]){const u=Se[t];this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!Se[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=n??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const s=this.sim.ensureLanguageQuiz();let c=!this.challenge||this.answeredOutcome!==null;a&&$n.includes(a)&&s.activeLang!==a&&(s.activeLang=a,c=!0),i&&(i==="beginner"||i==="intermediate"||i==="advanced")&&(ts(s,s.activeLang,i),c=!0),o&&kn.includes(o)&&(s.preferredFormat=o,c=!0),c||this.challenge?.lang!==s.activeLang?(this.challenge&&!this.answeredOutcome&&vt(s,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(s.activeLang,!1),this.render());const d=this.root.querySelector("#seedQuizDialog");d&&!d.open&&d.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const n=this.sessionShownQids.values().next().value;if(n===void 0)break;this.sessionShownQids.delete(n)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,n=!1){cn(t)||Ti(t).then(a=>{const i=this.sim.ensureLanguageQuiz();if(i.activeLang===t){if(a){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=ns(i,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),n&&i.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),n&&i.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const n=this.sim.ensureLanguageQuiz(),a=cn(n.activeLang);this.challenge=ns(n,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),a?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(n.activeLang,t)),this.sim.saveToStorage(),this.render();const i=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(i&&(i.scrollTop=0),a&&t&&n.autoSpeak&&this.challenge){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const n=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=n,this.sim.ensureLanguageQuiz().autoSpeak&&Le(this.challenge.fullSentence,this.challenge.lang,.95);const i=Se[this.targetCropId];if(n.correct){const o=n.tierAutoPromoted?` • Thăng hạng ${bt[this.challenge.lang].tierLabels[n.tierAutoPromoted]}!`:"",r=n.phoenixTalismanAwarded?` • 🔥 +${n.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=n.buildReduction&&n.buildReduction.reducedSec>0?` • 🔨 -${xe(n.buildReduction.reducedSec)} xây ${n.buildReduction.targetName??"công trình"}!`:"",s=n.leaderboardRankUp&&n.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${n.leaderboardRankUp.newRank} (+${n.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${n.seedsAwarded} hạt ${i.emoji} ${i.name} (Túi: ${n.newSeedCount} hạt)${l}${o}${r}${s}`,n.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const n=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,n)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=this.getDialog(),a=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;n&&typeof n.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,n.addEventListener("close",()=>{Re.clearDialogOrientation(n,a)})),Re.applyDialogOrientation(n,a,!0);const i=t.querySelector("#sqScrollViewport"),o=i?i.scrollTop:0,r=i?i.scrollLeft:0,l=this.sim.ensureLanguageQuiz(),s=l.activeLang,c=bt[s],d=l.profiles[s],u=Se[this.targetCropId],p=this.sim.getSeedCount(this.targetCropId),g=this.sim.getFarmItemCount(this.targetCropId),m=this.sim.state.galleons,h=u.seedCost,b=u.seedCost*3,x=m>=h,k=m>=b,v=zi(d,this.sim.state.level),L=d.totalAnswered>0?Math.round(d.totalCorrect/d.totalAnswered*100):100,C=Fi(d),f=$i(s),S=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),M=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let A="";if(this.pendingPlotUid){const B=this.sim.state.buildings.find(V=>V.uid===this.pendingPlotUid);B&&re(B.itemId)?.isFarmlandPlot&&!B.cropId&&(A=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${B.gx}, ${B.gy}]</strong></span>
            ${p>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${p})</button>`:""}
          </div>
        `)}const H=Object.values(Se).sort((B,V)=>B.unlockLevel-V.unlockLevel||B.growSec-V.growSec),O=H.filter(B=>B.isFlowerCrop).length,E=H.length-O,D=H.filter(B=>this.cropFilter==="flowers"?!!B.isFlowerCrop:this.cropFilter==="crops"?!B.isFlowerCrop:!0),R=[{id:"all",label:`🌱 (${H.length})`},{id:"flowers",label:`🌸 Hoa (${O})`},{id:"crops",label:`🌾 Cây (${E})`}].map(B=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===B.id?"active":""}"
            data-sq-crop-filter="${B.id}"
            aria-pressed="${this.cropFilter===B.id}"
          >${B.label}</button>
        `).join(""),j=D.map(B=>{const V=!this.sim.state.sandboxMode&&this.sim.state.level<B.unlockLevel,Q=B.id===this.targetCropId,ue=this.sim.getSeedCount(B.id),ne=xe(B.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${Q?"active":""} ${V?"locked":""}"
            data-sq-crop="${B.id}"
            aria-pressed="${Q}"
            ${V?"disabled":""}
            title="${V?`Lv.${B.unlockLevel} (⏱️ ${ne})`:`${B.name} • ⏱️ ${ne} • 🪙 ${B.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${Ct(B.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${J(B.name)}</span>
              <span class="sq-crop-pill-sub">
                ${V?`🔒 Lv.${B.unlockLevel}`:`🌱 ${ue} • ⏱️${ne}`}
              </span>
            </span>
          </button>
        `}).join(""),U=$n.map(B=>{const V=bt[B],Q=l.profiles[B],ue=B===s,ne=Q.tier==="beginner"?"Tập Sự":Q.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${ue?"active":""}"
          data-sq-lang="${B}"
          aria-pressed="${ue}"
          title="${V.flag} ${J(V.academyVi)} — ${J(V.tierLabels[Q.tier])}"
        >
          <span class="sq-lang-flag">${V.flag}</span>
          <span class="sq-lang-text">
            <strong>${J(V.nameVi)}</strong>
            <small>${J(ne)} • Lv.${Q.masteryScore}</small>
          </span>
        </button>
      `}).join(""),ie=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(B=>{const V=d.tier===B.id;return`
          <button
            type="button"
            class="sq-tier-btn ${V?"active":""}"
            data-sq-tier="${B.id}"
            aria-pressed="${V}"
          >
            <span>${B.icon} ${J(c.tierLabels[B.id])}</span>
            <small>${B.rewardTag}</small>
          </button>
        `}).join(""),N=kn.map(B=>{const V=Zn[B],Q=l.preferredFormat===B;return`
        <button
          type="button"
          class="sq-format-chip ${Q?"active":""}"
          data-sq-format="${B}"
          aria-pressed="${Q}"
        >
          ${V.icon} ${J(V.labelVi)}
        </button>
      `}).join(""),X=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
        ${A}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${R}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${m.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${J(u.name)}">
                🌱 ${J(u.name)}: <strong>×${p}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${M}/8 câu)">
                🔥 <strong>${S}</strong> <small>(${M}/8)</small>
              </span>
              ${(()=>{const B=Date.now(),V=this.sim.getActiveConstructions(B);if(V.length===0)return"";const Q=V[0],ue=re(Q.itemId),ne=Math.max(1,Math.ceil((Q.constructEndsAt-B)/1e3)),be=this.sim.getBuildingMinFloorSec(Q),ge=ne<=be;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${J(ue?.name??"Đang xây")}: <strong>${xe(ne)}</strong> <small>${ge?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${j}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${Ct(u.id)}" alt="${J(u.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${J(u.name)}</h3>
                <p>⏱️ <strong>${xe(u.growSec)}</strong> • 🌾 <strong>+${u.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${g}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${h.toLocaleString("vi-VN")}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${x?"":"disabled"}
              >
                🪙 +1 Hạt (-${h.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${k?"":"disabled"}
              >
                🪙 +3 Hạt (-${b.toLocaleString("vi-VN")}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${p>0?"has-seeds":"empty-seeds"}">
              <div class="sq-pocket-status">
                🌱 <strong>${J(u.name)}</strong>: <strong>×${p}</strong>
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
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${U}</div>

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
                📖 Từ Điển (${C.masteredCount}/${f.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(s,d):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${ie}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${d.masteryScore}/100 (Quyển ${v}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${c.flag} <strong>Lv.${d.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${d.totalCorrect}/${d.totalAnswered}</strong> (${L}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4,d.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${d.streak}</strong></span>
                        <button
                          type="button"
                          class="sq-stat-pill sq-stat-pill-btn ${C.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${C.masteredCount}</strong> • 🔄 <strong>${C.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${N}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${X}
                `}
          </section>
        </div>
      </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(t);const ae=t.querySelector("#sqScrollViewport");ae&&(o>0||r>0)&&(ae.scrollTop=o,ae.scrollLeft=r)}getLexiconEntrySrsInfo(t,n){const a=t.srsBoxes??{};let i=0,o=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const l=a[`${r}${n}`];l&&(l.box>i&&(i=l.box),l.box<5&&l.dueAtTurn<=t.totalAnswered&&(o=!0))}return{box:i,due:o}}getLanguageLexiconEntries(t){return dn.filter(n=>n.lang===t).sort((n,a)=>n.levelBand-a.levelBand||n.id.localeCompare(a.id))}renderLexiconCodexPanel(t,n){const a=bt[t],i=this.getLanguageLexiconEntries(t);let o=0,r=0,l=0;for(const c of i){const{box:d}=this.getLexiconEntrySrsInfo(n,c.id);d>=5?o+=1:d>=1?r+=1:l+=1}const s=[{id:"all",label:`📖 Tất cả (${i.length})`},{id:"mastered",label:`🏆 Thuộc (${o})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(c=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===c.id?"active":""}"
            data-sq-codex-filter="${c.id}"
            aria-pressed="${this.codexBoxFilter===c.id}"
          >${c.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${a.flag} ${J(a.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${cn(t)?`✅ ${i.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${J(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${s}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,n,i)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,n,a){const i=a??this.getLanguageLexiconEntries(t),o=this.codexQuery.trim().toLowerCase(),r=i.filter(s=>{const{box:c}=this.getLexiconEntrySrsInfo(n,s.id);return this.codexBoxFilter==="mastered"&&c<5||this.codexBoxFilter==="learning"&&(c<1||c>=5)||this.codexBoxFilter==="unseen"&&c>0?!1:o?s.word.toLowerCase().includes(o)||s.phonetic.toLowerCase().includes(o)||s.meaningVi.toLowerCase().includes(o)||s.exampleSentence.toLowerCase().includes(o)||s.exampleVi.toLowerCase().includes(o):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(s=>{const{box:c,due:d}=this.getLexiconEntrySrsInfo(n,s.id),u=ss(s.meaningVi,s.word,s.id);let p="is-unseen",g=`✨ Quyển ${s.levelBand}`;return c>=5?(p="is-box5",g="🏆 Hộp 5/5 • Thuộc"):c>=1&&(p=d?"is-due":"is-learning",g=`📦 Hộp ${c}/5${d?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${u.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${J(s.id)}"
                title="Nghe phát âm từ ${J(s.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${J(s.word)}</strong>
                <span class="sq-vocab-ph">[${J(s.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${J(u.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${p}">${g}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${i.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,n){t.querySelectorAll("[data-sq-codex-word]").forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.sqCodexWord??"",o=dn.find(r=>r.id===i);o&&Le(o.word,n,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.sqCodexEx??"",o=dn.find(r=>r.id===i);o&&Le(o.exampleSentence,n,.95)})})}renderChallengeStage(t){const n=bt[t.lang],a=Zn[t.format],i=Se[this.targetCropId],o=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",s=t.heroWord??t.stemText,c=t.heroPhonetic??t.stemPhonetic??"",d=t.heroShortVi??mn(t.translationVi);let u="";r==="pic_flashcard"?u=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${J(s)}</div>
            ${c?`<div class="sq-kid-ph-pill">[${J(c)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(u=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${J(d)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${J(d)}</div>
            ${c?`<div class="sq-kid-ph-pill">🔊 [${J(c)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let p="";if(r==="pic_flashcard"||r==="word_flashcard"){const m=t.choices??[],h=t.choicePhonetics??[],b=t.choiceSprites??[],x=t.choiceSubtitles??[];p=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${m.map((k,v)=>{let L="";o&&(v===t.correctIndex?L="is-correct":v===this.selectedChoiceIdx?L="is-wrong":L="is-dimmed");const C=b[v]??l,f=x[v]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${L}"
                  data-sq-choice="${v}"
                  ${o?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${C}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${J(k)}</span>
                    ${r==="word_flashcard"&&h[v]?`<small class="sq-choice-ph">[${J(h[v])}]</small>`:o&&f?`<small class="sq-choice-ph">${J(f)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const m=t.choices??[],h=t.choicePhonetics??[],b=t.choiceSprites??[];p=`
        <div class="sq-bubble-arena">
          ${m.map((x,k)=>{let v="";o&&(k===t.correctIndex?v="is-correct is-popped":k===this.selectedChoiceIdx?v="is-wrong is-popped":v="is-dimmed");const L=b[k]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${k%4} ${v}"
                  data-sq-choice="${k}"
                  ${o?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${L}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${J(x)}</span>
                  ${h[k]?`<small class="sq-bubble-ph">[${J(h[k])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const m=t.shuffledTokens??[],h=t.expectedSentenceTokens??[],b=new Set(this.placedTokenIndices),x=h.map((v,L)=>{const C=this.placedTokenIndices[L],f=C!==void 0?m.find(S=>S.idx===C):void 0;return f?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${L}"
                ${o?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${J(f.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),k=m.map(v=>{const L=b.has(v.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${L?"used":""}"
              data-sq-place="${v.idx}"
              ${L||o?"disabled":""}
            >
              ${J(v.text)}
            </button>
          `}).join("");p=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${x}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${k}</div>
          ${o?"":`
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
      `}else if(t.format==="match_pairs"){const m=t.leftCards??[],h=t.rightCards??[];p=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${n.flag} 🔊 Thẻ Từ</div>
            ${m.map(b=>{const x=this.matchedPairIds.has(b.pairId),k=this.selectedLeftPairId===b.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${x?"matched":""} ${k?"selected":""}"
                    data-sq-left-pair="${J(b.pairId)}"
                    ${x||o?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${J(b.word)}</span>
                    <small class="sq-pair-ph">[${J(b.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${h.map(b=>{const x=this.matchedPairIds.has(b.pairId),k=this.flashWrongPairKey===b.pairId,v=b.spriteSrc??ss(b.meaningVi,b.word,b.pairId).spriteSrc,L=b.shortVi??mn(b.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${x?"matched":""} ${k?"wrong-flash":""}"
                    data-sq-right-pair="${J(b.pairId)}"
                    ${x||o?"disabled":""}
                  >
                    <img src="${v}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${J(L)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const g=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${a.icon} ${J(a.labelVi)}</span>
            ${t.isReview?`<span class="sq-badge sq-badge-review">🔄 Ôn (${t.srsBox??1}/5) • +2 ${i.emoji}</span>`:`<span class="sq-badge sq-badge-reward">🎁 +1–2 ${i.emoji}</span>`}
          </div>
          <div class="sq-tts-btns">
            <button id="btnSqSpeakNormal" type="button" class="brass-btn sq-tts-btn" title="Nghe chuẩn (1.0x)">
              🔊 Nghe
            </button>
            <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tts-btn" title="Nghe chậm (0.72x)">
              🐢 Chậm
            </button>
            ${o?"":'<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tts-btn" title="Đổi câu">🔀 Đổi</button>'}
          </div>
        </div>

        ${u}
        ${p}
        ${g}
      </div>
    `}renderVietnameseExplanationCard(t,n){const a=this.sim.getSeedCount(this.targetCropId),i=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",o=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??mn(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${n.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${i}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${n.correct?`🎉 <strong>Giỏi lắm!</strong> +${n.seedsAwarded} 🌱 ${J(n.cropName)} • +${n.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${n.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${J(o)}</strong>
              <span class="sq-vocab-ph">[${J(r)}]</span>
              <span>= 🇻🇳 <strong>${J(l)}</strong></span>
            </div>
            ${n.buildReduction&&n.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${xe(n.buildReduction.reducedSec)} (${J(n.buildReduction.targetName??"công trình")})</div>`:""}
          </div>
          <div class="sq-explain-tts">
            <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tts-btn">🔊</button>
            <button id="btnSqSpeakFullSlow" type="button" class="brass-btn sq-tts-btn">🐢</button>
          </div>
        </div>

        <div class="sq-explain-actions">
          ${a>0?`
                <button id="btnSqExplainSow" type="button" class="brass-btn sq-sow-cta">
                  🌱 Gieo (×${a})
                </button>
              `:""}
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta">
            ➡️ Chơi Tiếp (+1–2 🌱)
          </button>
        </div>
      </div>
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCropFilter;(d==="all"||d==="flowers"||d==="crops")&&(this.cropFilter=d,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCrop;d&&Se[d]&&(this.targetCropId=d,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const c=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(c.msg,c.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const c=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(c.msg,c.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const n=t.querySelector("#chkSqAutoSpeak");n?.addEventListener("change",()=>{const c=this.sim.ensureLanguageQuiz();c.autoSpeak=n.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqLang,u=this.sim.ensureLanguageQuiz();d&&$n.includes(d)&&u.activeLang!==d&&(this.challenge&&!this.answeredOutcome&&vt(u,this.challenge),u.activeLang=d,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(d,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqSubview;if((d==="practice"||d==="codex")&&this.activeSubView!==d){if(this.activeSubView=d,d==="codex"){const u=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(u.activeLang)}this.render()}})});const a=t.querySelector("#inpSqCodexSearch");a&&a.addEventListener("input",()=>{this.codexQuery=a.value;const c=t.querySelector("#sqCodexResultsMount");if(c){const d=this.sim.ensureLanguageQuiz(),u=d.activeLang;c.innerHTML=this.renderLexiconCodexRowsHtml(u,d.profiles[u]),this.bindCodexRowSpeakEvents(c,u)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqCodexFilter;(d==="all"||d==="mastered"||d==="learning"||d==="unseen")&&(this.codexBoxFilter=d,this.render())})});const i=t.querySelector("#sqCodexResultsMount");if(i){const c=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(i,c.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqTier,u=this.sim.ensureLanguageQuiz();(d==="beginner"||d==="intermediate"||d==="advanced")&&(this.challenge&&!this.answeredOutcome&&vt(u,this.challenge),ts(u,u.activeLang,d),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.sqFormat,u=this.sim.ensureLanguageQuiz();kn.includes(d)&&u.preferredFormat!==d&&(this.challenge&&!this.answeredOutcome&&vt(u,this.challenge),u.preferredFormat=d,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const c=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(c,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const c=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(c,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge)return;const d=Number(c.dataset.sqSpeakWord??-1),u=this.challenge.vocabNotes[d];u&&Le(u.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const c=this.sim.ensureLanguageQuiz();vt(c,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqChoice??-1);this.selectedChoiceIdx=d;const u=d===(this.challenge.correctIndex??0);u?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(u)})});const o=()=>{if(!this.challenge||this.answeredOutcome)return!1;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<c.length)return!1;const u=this.placedTokenIndices.map(g=>d.find(m=>m.idx===g)?.text??""),p=u.length===c.length&&u.every((g,m)=>g===c[m]);return p?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(p),!0};t.querySelectorAll("[data-sq-place]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqPlace??-1);if(d>=0&&!this.placedTokenIndices.includes(d)){this.placedTokenIndices.push(d),this.sim.audio.playMatchPop(1);const u=this.challenge.shuffledTokens?.find(g=>g.idx===d),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Le(u.text,this.challenge.lang,.95),o()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(c.dataset.sqUnplace??-1);d>=0&&d<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(d,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const p=this.placedTokenIndices.length-1;if(d.find(m=>m.idx===this.placedTokenIndices[p])?.text===c[p])break;this.placedTokenIndices.pop()}const u=this.placedTokenIndices.length;if(u<c.length){const p=c[u],g=d.find(m=>m.text===p&&!this.placedTokenIndices.includes(m.idx));g&&(this.placedTokenIndices.push(g.idx),this.sim.audio.playMatchPop(1),o()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const c=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[],u=this.placedTokenIndices.map(g=>d.find(m=>m.idx===g)?.text??""),p=u.length===c.length&&u.every((g,m)=>g===c[m]);this.submitAttempt(p)}),t.querySelectorAll("[data-sq-left-pair]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=c.dataset.sqLeftPair??"";if(!d||this.matchedPairIds.has(d))return;this.selectedLeftPairId=d,this.flashWrongPairKey=null,this.sim.audio.playClick();const u=this.challenge.leftCards?.find(g=>g.pairId===d),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Le(u.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(c=>{c.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=c.dataset.sqRightPair??"";if(!(!d||this.matchedPairIds.has(d))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===d){this.matchedPairIds.add(d),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const u=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=u){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=d,this.sim.audio.playClick(),this.render()}})});const r=t.querySelector("#sqScrollViewport"),l=t.querySelector("#sqZoomSizer"),s=t.querySelector("#sqZoomStage");Re.bindDomScrollStageInteractions({rootScope:t,scrollViewportEl:r,sizerEl:l,contentStageEl:s,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}function $(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const _t=["path","shop","creature","decor","staff"],kt=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function eo(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
              <button id="btnOpenLeaderboard" type="button" class="hg-bxh-chip" title="Bảng Xếp Hạng 3 Môn Tính Điểm (Phím L)">🥇 BXH</button>
            </div>
            <div class="hg-menu-games-pills" role="group" aria-label="Đổi trò chơi">
              <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 777 Màn (Phím J)">
                🍬 Bùa Gặt Honeydukes <small id="lblMatch3Lv" class="sr-only-hud">1/777</small>
              </button>
              <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Ngũ Ấn Đạo Tặc (Phím K)">
                🗺️ Ngũ Ấn Đạo Tặc <small id="lblArcadeTowerLv" class="sr-only-hud">0/3108</small>
              </button>
              <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" title="Số Học Huyền Bí">
                🔢 Số Học Huyền Bí
              </button>
              <button type="button" data-switch-minigame="blocks" class="hg-game-pill" title="Sinh Vật Huyền Bí">
                🦄 Sinh Vật Huyền Bí
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

      <!-- DIALOG 14: PER-MINIGAME LEADERBOARDS (6 WIZARDING DISCIPLINES) -->
      <dialog id="leaderboardDialog" closedby="any" aria-labelledby="leaderboardDialogTitle">
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function to(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},n=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.switchMinigame;e.closeHudPopovers(),!g||g==="match3"?e.openMatch3Dialog():g==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(g)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",n),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",n),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",n),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",n),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",n);const a=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",a),e.root.querySelector("#btnPlusSand")?.addEventListener("click",a),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const i=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",i),e.root.querySelector("#chipHudBarn")?.addEventListener("click",i),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=window.innerWidth>680;const g=e.selectedCatalogItem?.category;e.activeCategory=g&&_t.includes(g)?g:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const g=p[0],m=re(g.itemId);me(e.cam,g.gx+(m?.width??1)*.5,g.gy+(m?.height??1)*.5),e.inspectSelection={kind:"building",uid:g.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const o=e.root.querySelector("#btnHudRoundOrb");if(o){let p=null,g=0,m=0,h=0,b=0,x=!1;o.addEventListener("pointerdown",v=>{if(v.button!==0&&v.pointerType==="mouse")return;const L=o.getBoundingClientRect();p=v.pointerId,g=v.clientX,m=v.clientY,h=L.left,b=L.top,x=!1;try{o.setPointerCapture(v.pointerId)}catch{}}),o.addEventListener("pointermove",v=>{if(p!==v.pointerId)return;const L=v.clientX-g,C=v.clientY-m;if(!x&&Math.hypot(L,C)>7&&(x=!0),x){const f=o.offsetWidth||52,S=o.offsetHeight||62,M=Math.max(6,Math.min(window.innerWidth-f-6,h+L)),A=Math.max(6,Math.min(window.innerHeight-S-6,b+C));o.style.left=`${Math.round(M)}px`,o.style.top=`${Math.round(A)}px`,o.style.right="auto",o.style.bottom="auto"}});const k=v=>{if(p===v.pointerId){p=null;try{o.hasPointerCapture(v.pointerId)&&o.releasePointerCapture(v.pointerId)}catch{}}};o.addEventListener("pointerup",k),o.addEventListener("pointercancel",k),o.addEventListener("click",v=>{if(x){v.preventDefault(),v.stopPropagation(),x=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()});const r=p=>{const g=e.root.querySelector("#buildDrawer");if(!g)return;const m=Math.max(180,Math.round(g.clientWidth*.68))*p,h=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;g.scrollBy({left:m,behavior:h?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{r(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{r(1)}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const g=p.target;if(!g)return;const m=e.root.querySelector("#managePopoverMenu"),h=e.root.querySelector("#weatherPopoverMenu"),b=e.root.querySelector("#btnToggleManageMenu"),x=e.root.querySelector("#lblClock");m?.contains(g)||h?.contains(g)||b?.contains(g)||x?.contains(g)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const l=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",l);const s=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",s),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",s),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const c=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",c),e.root.querySelector("#btnOpenZones")?.addEventListener("click",c),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",c),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=kt.findIndex(b=>b.mode===e.sim.heatmapMode),g=kt[(p+1)%kt.length];e.sim.heatmapMode=g.mode;const m=e.root.querySelector("#btnCycleHeatmap"),h=g.mode!=="none";m.textContent=g.label,m.setAttribute("data-active",String(h)),m.setAttribute("aria-pressed",String(h)),h&&e.showToast(`Đã bật ${g.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),g=document.createElement("a");g.href=p,g.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,g.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const m=p.currentTarget;m.textContent=e.questCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const g=p.currentTarget;g.textContent=e.minimapCollapsed?"+":"–",g.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(wt(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${xt[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=_t.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const d=p=>{const g=e.minimapCanvas.getBoundingClientRect(),m=(p.clientX-g.left)/g.width*e.minimapCanvas.width,h=(p.clientY-g.top)/g.height*e.minimapCanvas.height,b=e.minimapCanvas.width*.46/Bt,x=e.minimapCanvas.height*.44/Bt,k=(m-e.minimapCanvas.width*.5)/b,v=(h-8)/x,L=(k+v)*.5,C=(v-k)*.5,{fgx:f,fgy:S}=Vi(L,C,e.cam.viewRot??0),M=Math.max(0,Math.min(Bt-1,f)),A=Math.max(0,Math.min(Bt-1,S));e.rideCamUid=null,me(e.cam,M,A)};let u=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{u=!0,d(p)}),window.addEventListener("pointermove",p=>{u&&d(p)}),window.addEventListener("pointerup",()=>{u=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.cat;_t.includes(g)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===g?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=g,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{wt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${xt[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(g=>g.itemId==="burrow_house_canon");p?me(e.cam,p.gx+1.5,p.gy+1.5):me(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")wt(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${xt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")wt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${xt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const g=e.sim.staff[0];g&&(e.pincerPicked={kind:"staff",id:g.id,label:g.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,me(e.cam,16,18),e.refreshFloatingBanner())})}function no(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const n=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!n),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),Vn(e),Gn(e),nn(e),e.renderTutorialCoach()}function Us(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function so(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(tt(e),nt(e),e.closeSeedTray(),e.closePastureTray()),nn(e)}function nn(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const n=Us(e),a=e.hudRolledUp&&!e.photoModeActive&&!n;t.classList.toggle("hud-building-focus",n),t.classList.toggle("hud-compact-rolled",a);const i=e.root.querySelector("#btnToggleHudRollup");i&&(i.setAttribute("aria-pressed",String(e.hudRolledUp)),i.dataset.active=String(e.hudRolledUp),i.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const o=e.root.querySelector("#svgHudRollupChevron");o&&o.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const l=e.root.querySelector("#btnHudRoundOrb");l&&(l.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||n),l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.rolled=String(e.hudRolledUp));const s=e.root.querySelector("#lblHudRoundOrbTag");s&&(s.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const c=e.root.querySelector("#svgRoundOrbChevron");c&&c.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),n&&(tt(e),nt(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function tt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const n=e.root.querySelector("#managePopoverMenu"),a=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu"),o=e.root.querySelector("#lblClock");n?.classList.add("hidden"),a?.classList.add("hidden"),i&&(i.setAttribute("aria-expanded","false"),i.setAttribute("data-active","false")),o&&o.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function nt(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function io(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function ao(e){nt(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function zn(e,t,n){if(!t||!n)return;const a=t.getBoundingClientRect(),i=Math.min(window.innerWidth-16,Math.max(248,n.offsetWidth||336)),o=Math.min(n.offsetHeight||420,window.innerHeight-16),r=a.left<window.innerWidth*.5?a.left:a.right-i,l=Math.max(8,Math.min(r,window.innerWidth-i-8)),s=Math.max(8,Math.min(a.bottom+8,window.innerHeight-o-8));n.style.left=`${Math.round(l)}px`,n.style.top=`${Math.round(s)}px`}function oo(e,t){if(e.sim.isVisitingNeighbor){tt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const n=typeof t=="boolean"?t:!e.manageMenuOpen;if(tt(e),!n)return;e.manageMenuOpen=!0;const a=e.root.querySelector("#managePopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu");a&&i&&(a.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),i.setAttribute("data-active","true"),zn(e,i,a)),e.renderTutorialCoach()}function ro(e,t){const n=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(tt(e),!n)return;e.weatherPopoverOpen=!0;const a=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#lblClock");a&&i&&(Fn(e),a.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),zn(e,i,a)),e.renderTutorialCoach()}function Fn(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const n=Date.now(),a=e.sim.getCurrentWeather(n),i=e.sim.getWeatherForecast(4,n),o=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${o?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${a.icon} ${$(a.labelVi)}</div>
        <div class="weather-current-buff">✨ ${$(a.buffVi)}</div>
      </div>
      <div class="speed-toggle-row" role="group" aria-label="Tốc độ nhịp sống công viên">
        <button type="button" data-sim-speed="1" data-active="${e.sim.simSpeed===1}" aria-pressed="${e.sim.simSpeed===1}" class="brass-btn">
          🐢 1×
        </button>
        <button type="button" data-sim-speed="2" data-active="${e.sim.simSpeed===2}" aria-pressed="${e.sim.simSpeed===2}" class="brass-btn">
          ⚡ 2×
        </button>
      </div>
      <div class="weather-forecast-list">
        ${i.map((r,l)=>{const s=l===0?"Nay":`+${qe(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${$(r.labelVi)}</span>
                <span class="weather-slot-meta">${$(s)}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelectorAll("[data-sim-speed]").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation();const s=r.dataset.simSpeed==="2"?2:1;e.sim.simSpeed=s,Jt(e),tt(e),We(e,s===2?"⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!":"🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.",s===2?"⚡":"🌿")})})}function js(e,t){const n=e.root.querySelector("#lblGalleons");if(!n)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),n.textContent="∞",e.displayedGalleons=t;return}const a=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||a||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,n.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const i=e.displayedGalleons,o=performance.now(),r=420,l=s=>{const c=Math.min(1,(s-o)/r),d=1-Math.pow(1-c,3),u=Math.round(i+(t-i)*d);e.displayedGalleons=u,n.textContent=u.toLocaleString("vi-VN"),c<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function lo(e,t,n,a,i){const o=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!o||!r)return;const l=()=>{o.classList.remove("hud-chip-pulse"),o.offsetWidth,o.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const s=o.getBoundingClientRect();if(s.width<=0&&s.height<=0)return;const c=s.left+s.width*.5,d=s.top+s.height*.5,u=typeof a=="number"&&Number.isFinite(a)?Math.max(24,Math.min(window.innerWidth-24,a)):window.innerWidth*.5,p=typeof i=="number"&&Number.isFinite(i)?Math.max(24,Math.min(window.innerHeight-24,i)):window.innerHeight*.54,g={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},m=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(n))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,n)))));for(let h=0;h<m;h++){const b=document.createElement("div");b.className="fly-reward-token",b.dataset.kind=t,b.textContent=g[t],r.appendChild(b);const x=h/Math.max(1,m)*Math.PI*2+(Math.random()-.5)*.5,k=14+h%3*9,v=u+Math.cos(x)*k,L=p+Math.sin(x)*k*.7,C=(v+c)*.5+(h%2===0?-42:42),f=Math.min(L,d)-(48+h%3*18),S=560+h*48,M=h*52,A=b.animate([{transform:`translate3d(${v}px, ${L}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${v}px, ${L-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${C}px, ${f}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${c}px, ${d}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:S,delay:M,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});A.onfinish=()=>{b.remove(),l(),e.sim.audio.playFlyTick(h)}}}function co(e,t="🦉"){const n=e.trim();if(!n)return t.trim();const a=t.trim();if(!a)return n;const i=l=>l.replace(/\uFE0F/g,""),o=i(a);let r=n;for(;o&&i(r).startsWith(`${o} ${o}`);)r=r.slice(a.length).trimStart();return o&&i(r).startsWith(o)||a==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${a} ${r}`}function We(e,t,n="🦉"){const a=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!a)return;const i=Array.from(e.root.querySelectorAll("dialog[open]")),o=i.length>0?i[i.length-1]:null;o?a.parentElement!==o&&(o.appendChild(a),o.addEventListener("close",()=>{const l=Array.from(e.root.querySelectorAll("dialog[open]")),s=l.length>0?l[l.length-1]:e.root;a.parentElement!==s&&s.appendChild(a)},{once:!0})):a.parentElement!==e.root&&e.root.appendChild(a);const r=document.createElement("div");r.className="parchment-dark owl-toast",r.textContent=co(t,n),a.appendChild(r),window.setTimeout(()=>r.remove(),3500)}function po(e,t){const n=Math.max(1,Math.round(t.awaySeconds/60)),a=e.root.querySelector("#offlineDialogContent");a.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${n} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function Vn(e){const t=e.root.querySelector("#floatingModeBanner"),n=e.root.querySelector("#floatingBannerText"),a=e.root.querySelector("#btnFloatingSecondary"),i=e.root.querySelector("#btnFloatingSwap"),o=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!n||!a||!i||!o)){if(i.classList.add("hidden"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const r=e.sim.state.buildings.find(s=>s.uid===e.rideCamUid),l=r?re(r.itemId):void 0;if(!r||!l)e.rideCamUid=null;else{t.classList.remove("hidden"),n.textContent=`🎥 ${l.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,a.textContent="🧭 90°",a.classList.remove("hidden"),o.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),n.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Nhấp ô để thả`:"🤏 Điều phối nhân sự (G) — Nhấp ô cử tới • G/Esc thoát",a.classList.add("hidden"),o.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const r=e.sim.state.buildings.find(s=>s.uid===e.movingBuildingUid),l=r?re(r.itemId):void 0;n.textContent=`✋ ${l?.name??"Dời chỗ"}`,a.textContent=`🔄 ${e.rotation*90}°`,a.classList.remove("hidden"),o.textContent="✕"}else n.textContent="✋ Chọn công trình để dời",a.classList.add("hidden"),o.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),n.textContent="🧹 Phá dỡ",a.classList.add("hidden"),o.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const r=e.selectedCatalogItem,l=r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence,s=e.sim.getEffectiveItemStarCost(r),c=s>0?`🌟 ${s}`:r.cost===0?"0G":`${r.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),n.textContent=`🏗️ ${r.name} • ${c}`,l?(a.textContent=`🔄 ${e.rotation*90}°`,a.classList.remove("hidden")):a.classList.add("hidden"),i.textContent="📦 Đổi",i.classList.remove("hidden"),o.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const r=Se[e.activeSeedCropId],l=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),n.textContent=`🌱 ${r.emoji} ${r.name} (${l})`,a.textContent="🌱 Đổi",a.classList.remove("hidden"),o.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const r=et[e.activePastureAnimalId];t.classList.remove("hidden"),n.textContent=`🐾 ${r.emoji} ${r.name} (${r.cost.toLocaleString("vi-VN")}G)`,a.textContent="🐾 Đổi",a.classList.remove("hidden"),o.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),n.textContent="👁️ Nhìn xuyên",a.classList.add("hidden"),o.textContent="✕";return}t.classList.add("hidden")}}function Gn(e){const t=e.root.querySelector("#touchConfirmBar"),n=e.root.querySelector("#lblTouchConfirm");if(!(!t||!n)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),n.textContent=`📍 ${e.pendingTouchTile.label}`}}function Zt(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Ws(e),Xs(e),Ks(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),Vn(e),Gn(e),nn(e),e.renderTutorialCoach()}function Jt(e){const t=new Date,n=String(t.getHours()).padStart(2,"0"),a=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const i=e.sim.getCurrentWeather(t.getTime()),o=e.root.querySelector("#lblClock");if(o){const p=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";o.innerHTML=`${i.icon} <span>${n}:${a}</span>${p}`}e.weatherPopoverOpen&&Fn(e);const r=e.sim.getActiveFestival(t),l=e.root.querySelector("#lblFestival");l&&(r==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):r==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(l.classList.remove("hidden"),l.textContent="🏆 +Cúp"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const s=e.sim.state,c=e.root.querySelector("#lblPuzzleHearts");if(c&&s.match3)if(s.sandboxMode)c.textContent="∞";else if(s.match3.hearts>=Qt)c.textContent=`${s.match3.hearts}/${Qt}`;else{const p=Math.max(0,Math.ceil((s.match3.nextHeartAt-Date.now())/1e3)),g=Math.floor(p/60),m=String(p%60).padStart(2,"0");c.textContent=`${s.match3.hearts} (${g}:${m})`}const d=e.root.querySelector("#btnHudActiveBuilds"),u=e.root.querySelector("#lblActiveBuilds");if(d&&u){const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)d.classList.add("hidden");else{d.classList.remove("hidden");const g=Math.max(1,Math.ceil((p[0].constructEndsAt-Date.now())/1e3));u.textContent=`${p.length} (${qe(g)})`}}}function Ws(e){const t=e.sim.state,n=e.sim.getRequiredLevelTrial(),a=Math.max(0,t.xp)%yt,i=Math.max(6,Math.min(100,a/yt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+$s(t.level),e.root.querySelector("#barXpFill").style.width=`${i}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const _=e.sim.getActiveVisitingNeighbor();r.textContent=_?`🚂 Thăm: ${_.avatarEmoji} ${_.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getTotalTowerClearedStages(),c=t.level>=Ue?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),d=e.root.querySelector("#btnOpenRoadmap");d&&(d.style.setProperty("--hg-lvl-pct",String(c)),d.title=t.level>=Ue?`👑 Cấp Tối Đa ${Ue} • Rương XP: ${a}/${yt} • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${a}/${yt}`);const u=e.root.querySelector("#barLevelTopFill");u&&(u.style.width=`${c}%`,u.parentElement&&(u.parentElement.title=t.level>=Ue?`👑 Đã đạt Cấp Tối Đa ${Ue} • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`));const p=e.root.querySelector("#lblXpFraction");p&&(p.textContent=`🎁 ${a}/${yt}`);const g=e.sim.ensureFarmBarn(),m=e.sim.getBarnTotalUsed(),h=e.root.querySelector("#lblStorageBarn");h&&(h.textContent=`${m}/${g.capacity}`),js(e,t.galleons);const b=t.sandboxMode?"∞":String(t.match3?.stars??0),x=e.root.querySelector("#lblPuzzleStars");x&&t.match3&&(x.textContent=b);const k=e.root.querySelector("#lblHudHubStars");k&&(k.textContent=b);const v=e.root.querySelector("#lblHudHubTrial");v&&(t.level>=Ue||t.sandboxMode||e.sim.isHeadmasterPreview||!n?v.textContent=`♟️ ${s.cleared}/${s.total}`:v.textContent=`🔥 ${n.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const L=e.sim.getDisciplineStageInfo("match3"),C=e.sim.getLastPlayedMinigame();let f="🍬 Bùa Gặt",S="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",M=L.isMaxed?`👑 ${ze}`:`Màn ${L.currentStage}`;if(C==="caro"){const _=e.sim.getDisciplineStageInfo("caro");f="🗺️ Ngũ Ấn",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=_.isMaxed?`👑 ${ze}`:`Màn ${_.currentStage}`}else if(C==="sudoku"){const _=e.sim.getDisciplineStageInfo("sudoku");f="🔢 Số Học",S="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",M=_.isMaxed?`👑 ${ze}`:`Màn ${_.currentStage}`}else if(C==="blocks"){const _=e.sim.getDisciplineStageInfo("blocks");f="🦄 Sinh Vật",S="/trang-trai-hang-soc/sprites/beast_niffler.png",M=_.isMaxed?`👑 ${ze}`:`Màn ${_.currentStage}`}else if(C==="chess"){const _=e.sim.getDisciplineStageInfo("chess");f="🏰 Cờ Phù Thủy",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=_.isMaxed?`👑 ${ze}`:`Màn ${_.currentStage}`}else C==="seedquiz"&&(f="🪄 Thần Chú",S="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",M="Ôn Tập");const A=e.root.querySelector("#imgCornerPlayIcon");A&&A.getAttribute("src")!==S&&A.setAttribute("src",S);const H=e.root.querySelector("#badgeCornerPlayBonus");H&&(H.textContent=f,H.classList.remove("hidden"));const O=e.root.querySelector("#lblCornerPlayStage");O&&(O.textContent=M);const E=e.root.querySelector("#lblCornerPlaySub");E&&(E.textContent=t.level>=Ue?`👑 Cấp ${Ue}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const D=e.root.querySelector("#btnCornerPlayPuzzle");if(D){const _=`Chơi tiếp ${f} — ${M}`;D.title=_,D.setAttribute("aria-label",_)}e.root.querySelectorAll("[data-switch-minigame]").forEach(_=>{const ve=_.dataset.switchMinigame===C;_.dataset.active=String(ve),_.setAttribute("aria-pressed",String(ve))});const R=e.root.querySelector("#badgeBuildReadyCount");if(R){const _=new Set(t.buildings.map(Ce=>Ce.itemId)),ve=t.sandboxMode?999:t.match3?.stars??0,we=ks.filter(Ce=>{if(Ce.isThemeParkLegacy)return!1;const Xe=ki(Ce);return Xe<=0||!t.sandboxMode&&t.level<Ce.unlockLevel?!1:!_.has(Ce.id)&&ve>=Xe}).length;we>0&&!e.sim.isHeadmasterPreview?(R.textContent=String(we),R.classList.remove("hidden")):R.classList.add("hidden")}const j=e.root.querySelector("#lblMatch3Lv");j&&t.match3&&(j.textContent=L.isMaxed?`👑${ze}`:`${L.currentStage}/${ze}`);const U=e.root.querySelector("#lblArcadeTowerLv");if(U){const _=Math.max(0,s.cleared-L.clearedStages),ve=ze*4;U.textContent=_>=ve?`👑${ve}`:`${_}/${ve}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const ce=e.sim.getActiveStoryQuest(),ie=e.sim.getReadyOwlOrdersCount(),N=(ce?.completed?1:0)+t.owlQuests.filter(_=>_.completed&&!_.claimed).length+t.dailyQuests.filter(_=>_.completed&&!_.claimed).length,X=ie+N,ae=X>0?X:g.owlOrders.length,B=e.root.querySelector("#badgeQuestCount");ae>0?(B.textContent=String(ae),B.classList.toggle("is-ready-green",ie>0),B.classList.remove("hidden")):B.classList.add("hidden");const V=t.supply.cargoCrates.filter(_=>!_.fulfilled&&(t.sandboxMode||(t.supply.goods[_.goodId]??0)>=_.qtyRequired)).length,Q=e.root.querySelector("#badgeWorkshopCount");Q&&(V>0?(Q.textContent=String(V),Q.classList.remove("hidden")):Q.classList.add("hidden"));const ne=Object.values(t.housePoints).reduce((_,ve)=>_+ve,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!ne),e.refreshSuitcaseBadge();const ge=e.root.querySelector("#badgeSuitcaseCount"),te=ge&&!ge.classList.contains("hidden")?Math.max(0,Number.parseInt(ge.textContent||"0",10)||0):0,Qe=e.sim.getClaimableHarvestFeastCount(),le=e.root.querySelector("#badgeManageMenuDot");if(le){const _=V+(ne?1:0)+Qe+te;_>0?(le.textContent=String(_),le.classList.remove("hidden")):le.classList.add("hidden")}Qs(e),Jt(e);const fe=e.root.querySelector("#btnCycleHeatmap");if(fe){const _=kt.find(we=>we.mode===e.sim.heatmapMode)??kt[0],ve=e.sim.heatmapMode!=="none";fe.textContent=_.label,fe.dataset.active=String(ve),fe.setAttribute("aria-pressed",String(ve))}Jt(e)}function Qs(e){const t=e.sim.state,n=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,a=t.buildings.some(o=>!!re(o.itemId)?.isCreatureHabitat),i=(t.match3?.hearts??Qt)>=Qt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",i),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",n&&!a),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",n&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const o=e.root.querySelector("#btnToggleMinimap");o&&(o.textContent="–",o.setAttribute("aria-expanded","true"))}}function Xs(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const n=e.sim.state,a=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const i=e.sim.getActiveStoryQuest(),o=n.owlQuests.slice(0,2);let r="";if(a&&!n.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getDisciplineStageInfo(a.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${a.icon} ${$(a.shortVi)} (${s.currentStage}/${ze}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${a.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
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
      `}for(const l of o){const s=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${$(l.giverEmoji)} ${$(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${s}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${$(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const s=e.sim.completeStoryStepWithStar();if(s.ok){typeof s.placedGx=="number"&&typeof s.placedGy=="number"&&me(e.cam,s.placedGx,s.placedGy);return}We(e,s.msg,s.reason==="missing_gold"?"🪙":"🌟"),(s.reason==="missing_stars"||s.reason==="locked_level"||s.reason==="open_match3")&&e.openTrialMinigame()})})}function Ks(e){const t=(h,b)=>{h&&(h.setAttribute("data-active",String(b)),h.setAttribute("aria-pressed",String(b)))};e.root.querySelectorAll("[data-cat]").forEach(h=>{t(h,h.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const n=e.root.querySelector("#btnRotateCam");if(n){const h=e.cam.viewRot??0;n.textContent=xt[h],t(n,h!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const a=e.mapToolsExpanded,i=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");i&&i.classList.toggle("hidden",!a),o&&(o.setAttribute("aria-expanded",String(a)),t(o,a));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),l);const c=e.root.querySelector("#buildDrawer"),d=e.root.querySelector("#buildDrawerSwipeBar"),u=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!_t.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,c.classList.add("hidden"),d?.classList.add("hidden"),u.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(c.classList.remove("hidden"),u.classList.add("hidden"),e.activeCategory==="staff"){Ys(e,c),vs(e,c);return}const p=ks.filter(h=>h.category===e.activeCategory&&h.category!=="terrain"&&!h.isThemeParkLegacy),g=e.sim.state.level,m=e.sim.state.sandboxMode;c.innerHTML=p.map(h=>{const b=!m&&g<h.unlockLevel,x=e.selectedCatalogItem?.id===h.id,k=h.elevationDelta?h.elevationDelta>0?"⛰️":"⛏️":h.isCoasterTrackPiece?"🛤️":h.isZooFence?"🚧":h.isBench?"🪑":h.category==="path"?"🛣️":h.category==="terrain"?"🌿":"🕯️",v=h.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${h.spriteKey}.png" alt="${h.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${k}</div>`,L=e.sim.getEffectiveItemStarCost(h),C=h.buildDurationSec>0?`🔨 ${xe(h.buildDurationSec)}`:"⚡",f=b?`🔒 Cấp ${h.unlockLevel}`:L>0?`🌟 ${L} • ${C}`:`🪙 ${h.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${b?"locked":""}"
            data-item-id="${h.id}"
            data-selected="${x}"
            aria-pressed="${x}"
            ${b?'aria-disabled="true"':""}
          >
            ${v}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${$(h.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${f}</div>
          </button>
        `}).join(""),c.querySelectorAll("[data-item-id]").forEach(h=>{h.addEventListener("click",()=>{const b=re(h.dataset.itemId);if(!b)return;if(!e.sim.state.sandboxMode&&e.sim.state.level<b.unlockLevel){const k=e.sim.getWinsProgressForCurrentLevel();let v=Math.max(1,k.required-k.current);for(let L=e.sim.state.level+1;L<b.unlockLevel;L++)v+=Ci(L);We(e,`🔒 Bản vẽ "${b.name}" mở ở Cấp Giải Đố ${b.unlockLevel} — Cần thắng thêm ${v.toLocaleString("vi-VN")} màn Giải Đố mới!`,"🧩"),e.openTrialMinigame();return}const x=e.sim.getEffectiveItemStarCost(b);if(!e.sim.state.sandboxMode&&x>0&&e.sim.state.match3.stars<x){const k=x-e.sim.state.match3.stars;We(e,`Cần thêm ${k} 🌟 Sao Phép Thuật (${e.sim.state.match3.stars}/${x} 🌟) để dựng "${b.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,"🌟"),e.openTrialMinigame();return}e.selectedCatalogItem=b,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,nt(e),Zt(e)})}),vs(e,c)}function Ys(e,t){const n=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],a=new Set(e.sim.state.unlockedZones),i=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+On.filter(s=>e.sim.state.sandboxMode||a.has(s.id)).map(s=>`<option value="${s.id}" ${l===s.id?"selected":""}>📍 ${s.name}</option>`).join(""),o=n.map(l=>{const s=e.sim.state.staffHired[l.key],c=s>=Ot,d=l.baseCost*(1+s);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${s}/${Ot}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${c?"":"gold-cta"}"
              ${c?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${c?`✓ ${Ot}/${Ot}`:`+ 🪙 ${d}`}
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
        `}).join("");t.innerHTML=o+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const s=l.dataset.hire;e.sim.hireStaff(s)&&(nt(e),Zt(e),We(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const s=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(s,l.value),We(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const s=e.sim.staff.find(c=>c.id===l.dataset.pickStaff);s&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},nt(e),Zt(e),We(e,`Đang gắp ${s.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}const uo={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏭 Xưởng & Cửa Tiệm",creature:"🦄 Đồng Cỏ & Thú Phép",decor:"🌸 Vườn Hoa & Cảnh Quan",staff:"🧙 Phụ Tá Điền Trang"};function vs(e,t){const n=e.root.querySelector("#buildDrawerSwipeBar"),a=e.root.querySelector("#buildDrawerCatLabel"),i=e.root.querySelector("#btnDrawerScrollPrev"),o=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const l=Array.from(t.querySelectorAll(".catalog-card"));if(!n||l.length===0||!e.activeCategory){n?.classList.add("hidden");return}if(a){const m=uo[e.activeCategory]??"🏗️ Danh Mục Xây Dựng";a.textContent=`${m} (${l.length})`}n.classList.remove("hidden");const s=t.querySelector('.catalog-card[data-selected="true"]');s&&typeof s.scrollIntoView=="function"&&s.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const c=l[0],d=l[l.length-1];let u=!0,p=l.length<=2;const g=()=>{const m=!u||!p||t.scrollWidth>t.clientWidth+6;i&&(i.disabled=u,i.classList.toggle("hidden",!m)),o&&(o.disabled=p,o.classList.toggle("hidden",!m)),r&&r.classList.toggle("hidden",!m),t.dataset.scrollStart=String(!u),t.dataset.scrollEnd=String(!p)};if(typeof IntersectionObserver<"u"){const m=new IntersectionObserver(h=>{for(const b of h)b.target===c&&(u=b.intersectionRatio>=1),b.target===d&&(p=b.intersectionRatio>=1);g()},{root:t,threshold:1,rootMargin:"2px"});m.observe(c),d!==c&&m.observe(d),e.drawerEdgeObserver=m}g()}function go(e){const t=e.mapToolsExpanded,n=e.root.querySelector("#secondaryMapToolsBar"),a=e.root.querySelector("#btnToggleMapTools");n&&n.classList.toggle("hidden",!t),a&&(a.setAttribute("aria-expanded",String(t)),a.setAttribute("data-active",String(t)),a.setAttribute("aria-pressed",String(t)))}function pe(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const n=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(n!==e.lastInspectedKey&&(e.lastInspectedKey=n,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const a=e.inspectSelection.uid,i=e.sim.state.buildings.find(E=>E.uid===a);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=re(i.itemId),r=Date.now(),l=r<i.constructEndsAt,s=Math.max(0,Math.ceil((i.constructEndsAt-r)/1e3)),c=e.sim.getBuildingProductionPerCycle(i,o),d=Gi(o,i.stars),u=(e.sim.rideQueues.get(i.uid)??[]).length,p=e.sim.isBuildingConnected(i.uid),g=e.sim.activeSynergies.buildingGoldMult.get(i.uid)??1,m=e.sim.activeSynergies.buildingXpMult.get(i.uid)??1,h=o.category==="ride"&&!o.isCoasterTrackPiece,b=!!o.isCustomCoasterStation&&!l,x={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},k=o.isCreatureHabitat?e.sim.biomeCache.get(i.uid):void 0,v=o.isBackstage?e.sim.backstageCache.get(i.uid):void 0,L=!!o.ticketPrice&&!l&&!o.workshopGroupId,C=_i(o),f=e.sim.getEffectivePrice(i,o),S=e.sim.getPriceValueVerdict(i,o),M=o.isFarmlandPlot&&!l?(()=>{if(!i.cropId){const B=Object.values(Se).sort((le,fe)=>le.unlockLevel-fe.unlockLevel||le.growSec-fe.growSec),V=B.filter(le=>le.isFlowerCrop).length,Q=B.length-V,ue=B.filter(le=>e.seedFilterMode==="flowers"?!!le.isFlowerCrop:e.seedFilterMode==="crops"?!le.isFlowerCrop:!0),ne=[{id:"all",label:`🌱 (${B.length})`},{id:"flowers",label:`🌸 (${V})`},{id:"crops",label:`🌾 (${Q})`}].map(le=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===le.id?"active":""}"
                        data-insp-seed-filter="${le.id}"
                        aria-pressed="${e.seedFilterMode===le.id}"
                      >${le.label}</button>
                    `).join(""),be=ue.map(le=>{const fe=!e.sim.state.sandboxMode&&e.sim.state.level<le.unlockLevel,_=e.sim.getSeedCount(le.id),ve=e.sim.getFarmItemCount(le.id),we=xe(le.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${fe?"locked":""} ${!fe&&_<=0?"out-of-seeds":""}"
                        data-plant-crop="${le.id}"
                        ${fe?"disabled":""}
                      >
                        <img src="${Ct(le.id)}" alt="${$(le.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${$(le.name)}</span>
                        <span class="seed-card-seed-badge ${_>0?"has-seed":"no-seed"}">
                          ${fe?`🔒 Lv.${le.unlockLevel}`:_>0?`🌱 ×${_}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${fe?`⏱️ ${we}`:`⏱️ ${we} • 🪙${le.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${ve}</span>
                      </button>
                    `}).join(""),ge=e.sim.state.plotSoilState?.[`${i.gx},${i.gy}`],te={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${ge?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${te[ge.lastFamily]??ge.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${ne}</div>
                    <div class="seed-picker-grid">${be}</div>
                  </div>
                `}const E=Se[i.cropId],D=i.cropReadyAt??r,R=i.cropPlantedAt??D-E.growSec*1e3,j=Math.max(0,Math.ceil((D-r)/1e3)),U=j<=0,ce=e.sim.state.cropMastery?.[E.id]??0,ie=Ei(ce),N=Math.max(0,e.sim.state.morningDewPhials??0),X=E.yieldQty*(i.cropRotatedBonus?2:1),ae=U?100:Math.max(6,Math.min(98,Math.round((r-R)/Math.max(1e3,D-R)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${Ct(E.id)}" alt="${$(E.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${$(E.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${ie.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${U?"🌾 Chín!":`⏱️ ${qe(j)}`}${i.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${ce} vụ • Họ ${Mi(E.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${ae}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${U?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${X})
                          </button>
                        `:i.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!U&&(N>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${N})
                          </button>`:""}
                  </div>
                </div>
              `})():"",A=o.workshopGroupId&&!l?(()=>{const E=e.sim.getWorkshopRecipesForBuilding(o),D=i.workshopQueue??[],R=i.readyFarmGoods??[],j=3+Math.min(2,Math.max(0,i.stars-1)),U=R.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${R.slice(0,5).map(B=>{const V=rt[B];return`<img src="/trang-trai-hang-soc/sprites/${V.iconKey}.png" alt="${$(V.name)}" title="${$(V.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${R.length})
                      </button>
                    </div>
                  `:"",ce=E.map(B=>{const V=rt[B.goodId],Q=B.name??V.name,ue=B.name&&B.name!==V.name?`title="Ra lò thành phẩm: ${$(V.name)}"`:"",ne=!e.sim.state.sandboxMode&&e.sim.state.level<B.unlockLevel,be=!ne&&(e.sim.state.sandboxMode||B.inputs.every(te=>e.sim.getFarmItemCount(te.itemId)>=te.qty)),ge=B.inputs.map(te=>{const Qe=Ne(te.itemId),le=e.sim.getFarmItemCount(te.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||le>=te.qty?"ok":"lack"}">${$(Qe.name)} ${e.sim.state.sandboxMode?"∞":le}/${te.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${be?"craftable":""} ${ne?"locked":""}"
                      data-ws-enqueue="${B.id}"
                      ${ue}
                      ${ne?"disabled":""}
                    >
                      <div class="ws-recipe-name">${$(Q)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${V.iconKey}.png" alt="${$(Q)}" class="ws-recipe-img" />
                        ${be?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${ne?`🔒 Lv.${B.unlockLevel}`:ge}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${xe(B.craftSec)}</div>
                    </button>
                  `}).join(""),ie=D[0],N=ie?Math.max(0,Math.ceil((ie.endsAt-r)/1e3)):0,X=ie?rt[ie.goodId]:null,ae=Array.from({length:Math.max(1,j-1)},(B,V)=>{const Q=D[V+1];if(Q){const ue=rt[Q.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${$(ue.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${ue.iconKey}.png" alt="${$(ue.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return V===D.length-(ie?1:0)?`
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
                    <span>🔥 ${$(o.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${U}
                  <div class="ws-recipe-grid">${ce}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${ie?"baking":""}">
                      <div class="ws-oven-arch">
                        ${X?`<img src="/trang-trai-hang-soc/sprites/${X.iconKey}.png" alt="${$(X.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${ie?`<strong>${qe(N)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${ie?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${ae}</div>
                  </div>
                </div>
              `})():"",H=o.isAnimalPasturePlot&&!l?(()=>{if(!i.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(et).map(X=>{const ae=!e.sim.state.sandboxMode&&e.sim.state.level<X.unlockLevel,B=X.goodId?Ne(X.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${ae?"locked":""}"
                        data-stock-animal="${X.id}"
                        ${ae?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${X.spritePair[0]}.png" alt="${$(X.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${$(X.name)}</span>
                        <span class="seed-card-seed-badge ${ae?"no-seed":"has-seed"}">
                          ${ae?`🔒 Lv.${X.unlockLevel}`:`🪙 ${X.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${xe(X.cycleSec)} • +${X.sellValue}G</span>
                        <span class="seed-card-stock">${B?`+${X.yieldQty} ${$(B.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const E=et[i.pastureAnimalId],D=i.pastureReadyAt??r,R=i.pastureStockedAt??D-E.cycleSec*1e3,j=Math.max(0,Math.ceil((D-r)/1e3)),U=j<=0,ce=U?100:Math.max(6,Math.min(98,Math.round((r-R)/Math.max(1e3,D-R)*100))),ie=E.goodId?Ne(E.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${E.spritePair[0]}.png" alt="${$(E.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${$(E.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${U?`🧺 +${E.sellValue}G${ie?` +${E.yieldQty} ${$(ie.name)}`:""}`:`⏱️ ${qe(j)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${ce}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${U?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${E.sellValue}G)
                          </button>
                        `:i.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!U&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((o.workshopGroupId||o.isFarmlandPlot||o.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${o.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${o.spriteKey}.png" alt="${$(o.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${$(o.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(i.stars)}${"☆".repeat(5-i.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${o.isFarmlandPlot?"🌱 Ruộng":o.isAnimalPasturePlot?"🐾 Đồng cỏ":o.connectableGroup==="flower_garden"?"🌸 Vườn hoa":o.workshopGroupId?"🔥 Xưởng":`👥 ${i.visitorsServed}`}${h?` • 🎟️ ${u}/${Ui}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${M}
        ${H}
        ${A}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${p?"#15803d":"#dc2626"};">
            ${p?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${g>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((g-1)*100)}%G • +${Math.round((m-1)*100)}%XP</div>`:""}
          ${o.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${Mt[o.producesIngredient].emoji} ${Mt[o.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const E=Math.max(0,i.buildReducedSec??0),D=Math.max(1e3,o.buildDurationSec*1e3,i.constructEndsAt-(i.placedAt||r-1e3)+E*1e3),R=Math.max(1,Math.min(99,Math.floor((1-(i.constructEndsAt-r)/D)*100))),j=e.sim.getBuildingMinFloorSec(i),U=Math.max(0,s-j),ce=U<=0&&e.sim.getActiveConstructions(r).some(X=>X.uid!==i.uid&&Math.ceil((X.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(X)),ie=U>0||ce,N=o.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${o.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${R}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${R}" aria-label="${N}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${qe(s)}</strong>${E>0?` • <span style="color:var(--teal-deep);">-${xe(E)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${ie?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${ie?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${U>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
                              🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                            </button>`:""}
                      ${e.sim.state.sandboxMode?`<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1;" title="Hoàn tất ngay">
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
              `:o.baseIncome>0?(()=>{const E=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,D=Li(i,o),R=Math.max(1,D*E),j=Math.max(0,(r-(i.lastTickAt||r))/1e3),U=Math.max(1,Math.ceil(R-j%R));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${c.galleons}🪙 +${c.xp}⭐</strong> / ${xe(D)}</div>
                      ${o.cycleSec>0&&!o.isFarmlandPlot&&!o.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${qe(U)}</strong> • Kho: <strong>${i.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${i.storedGalleons}🪙</strong></div>`}
                      ${i.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${i.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${h&&!l&&!o.isFlooPortal?`
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

        ${L?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${C.min}–${C.max}G):</span>
                  <span id="lblBuildingPriceVal">${f}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${C.min}" max="${C.max}" value="${f}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${S.color};">
                  ${S.label}
                </div>
              </div>
            `:""}

        ${o.isCustomCoasterStation&&i.coasterStats&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${i.coasterStats.lengthMeters}m • 🔥 ${i.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `:""}

        ${b?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🎥 Ride Cam
              </button>
            `:""}

        ${(o.isWorkshopBrewery||o.producesIngredient||o.isFireworksLauncher)&&!l?`
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">
                  🧪 Xưởng
                </button>
                ${o.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">🎆 Pháo Hoa</button>':""}
              </div>
            `:""}

        ${o.isCreatureHabitat&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>🐾 ${$(i.creatureNickname||o.creatureName||o.name)}</strong>
                  <span class="morph-pill ${i.creatureMorph==="radiant"?"radiant":i.creatureMorph==="mystic"?"mystic":""}">
                    ${Oe[i.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${i.creatureBondLevel??1}/${St} • ${x[i.creatureStage??"baby"]} • 🌿 ${k?.score??50}% • 🥩 ${Math.round(i.creatureHunger??90)}%</div>
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

        ${o.isBackstage&&v&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${v.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${v.shieldCount}/${v.needed} ${v.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&i.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${i.stars+1}★ (🌟${Ai(i.stars)} + 🪙${d.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${i.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const O=t.querySelector("#inpBuildingPrice");O&&(e.wireRangeProgressFallback(O),O.addEventListener("input",()=>{const E=Number(O.value);e.sim.setBuildingCustomPrice(i.uid,E);const D=e.sim.getEffectivePrice(i,o),R=t.querySelector("#lblBuildingPriceVal");R&&(R.textContent=`${D} Galleon`);const j=e.sim.getPriceValueVerdict(i,o),U=t.querySelector("#lblPriceVerdict");U&&(U.textContent=j.label,U.style.color=j.color);const ce=e.sim.getBuildingProductionPerCycle(i,o),ie=t.querySelector("#lblBuildingProdVal");ie&&(ie.textContent=`+${ce.galleons} 🪙 & +${ce.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(i.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(i.uid,!0),pe(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(E=>{E.addEventListener("click",()=>{const D=e.sim.useMorningDewPhial(i.uid);e.showToast(D.msg,D.ok?"🧪":"⏳"),pe(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const E=i.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",E)}),t.querySelectorAll("[data-plant-crop]").forEach(E=>{E.addEventListener("click",()=>{const D=E.dataset.plantCrop,R=e.sim.plantCropOnPlot(i.uid,D);if(R.needSeedAcquire){const j=i.uid;e.activeSeedCropId=D,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(D,j);return}if(e.showToast(R.msg,R.ok?"🌱":"🪙"),R.ok){e.activeSeedCropId=D,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(E=>{E.addEventListener("click",()=>{const D=E.dataset.inspSeedFilter;(D==="all"||D==="flowers"||D==="crops")&&(e.seedFilterMode=D,pe(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(E=>{E.addEventListener("click",()=>{const D=E.dataset.stockAnimal,R=e.sim.stockAnimalOnPasture(i.uid,D);if(e.showToast(R.msg,R.ok?et[D]?.emoji??"🐾":"🪙"),R.ok){e.activePastureAnimalId=D,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const E=e.sim.feedAnimalPasture(i.uid);e.showToast(E.msg,E.ok?"🌾":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const E=e.sim.harvestAnimalPasture(i.uid);e.showToast(E.msg,E.ok?"🧺":"⏳"),pe(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const E=e.sim.clearAnimalFromPasture(i.uid);e.showToast(E.msg,E.ok?"🐾":"⚠️"),pe(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const E=e.sim.waterCropPlot(i.uid);e.showToast(E.msg,E.ok?"💧":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const E=e.sim.harvestCropPlot(i.uid);e.showToast(E.msg,E.ok?"🌾":"🏡"),pe(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(E=>{E.addEventListener("click",()=>{const D=E.dataset.wsEnqueue,R=e.sim.enqueueWorkshopRecipe(i.uid,D);e.showToast(R.msg,R.ok?"🔥":"🧺"),pe(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(i.uid),pe(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(i.uid),pe(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(i.uid),pe(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=i.uid,e.inspectSelection=null,pe(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${o.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(i.uid),pe(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",i.uid)}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const E=e.sim.upgradeBuildingStar(i.uid);e.showToast(E.msg,E.ok?"🌟":"🪙"),pe(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=i.uid,e.rotation=i.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${o.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const a=e.inspectSelection.id,i=e.sim.staff.find(l=>l.id===a);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=e.sim.state.staffPatrolZones?.[i.id]??i.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
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
            <option value="all" ${o==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${On.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${o===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const s=l.currentTarget.value;e.sim.setStaffPatrolZone(i.id,s),e.showToast(`Đã phân công khu tuần tra cho ${i.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const a=Cs(e.inspectSelection.zoneId),i=Ms(a),o=e.sim.state.level>=a.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${$(a.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>
        <div style="font-size:12.5px;margin-bottom:10px;font-weight:700;">
          🔒 Lv.${a.unlockLevel} • <strong>🌟 ${i}</strong>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${o?"gold-cta":""}" style="width:100%;">
          🔓 Mở (🌟 ${i})
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(a.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,pe(e))})}}function _n(e,t){t&&(e.activeWorkshopTab=t),Ee(e);const n=e.root.querySelector("#workshopDialog");n.open||n.showModal()}function Zs(e,t,n){e.collapseBuildDock(),Et(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=n??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function dt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function mo(e){e.seedTrayOpen?(dt(e),e.refreshAll()):Zs(e,e.activeSeedCropId??void 0)}function Js(e,t,n){e.collapseBuildDock(),dt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=n??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Et(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function bo(e){e.pastureTrayOpen?(Et(e),e.refreshAll()):Js(e,e.activePastureAnimalId??void 0)}function ei(e){const t=e.root.querySelector("#seedBrushTray"),n=e.root.querySelector("#btnOpenSeedSilo");if(n){const p=e.seedTrayOpen||!!e.activeSeedCropId;n.dataset.active=String(p),n.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(p=>re(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,i=e.sim.state.buildings.filter(p=>re(p.itemId)?.isFarmlandPlot).length,o=e.activeSeedCropId?Se[e.activeSeedCropId]:null,r=Object.values(Se).sort((p,g)=>p.unlockLevel-g.unlockLevel||p.growSec-g.growSec),l=r.filter(p=>p.isFlowerCrop).length,s=r.length-l,c=r.filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),d=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${s})`}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),u=c.map(p=>{const g=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,m=e.activeSeedCropId===p.id,h=e.sim.getSeedCount(p.id),b=e.sim.getFarmItemCount(p.id),x=xe(p.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${g?"locked":""} ${m?"selected":""} ${!g&&h<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${m}"
              ${g?"disabled":""}
            >
              <img src="${Ct(p.id)}" alt="${$(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${$(p.name)}</span>
              <span class="seed-card-seed-badge ${h>0?"has-seed":"no-seed"}">
                ${g?`🔒 Cấp ${p.unlockLevel}`:h>0?`🌱 ${h}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${g?`⏱️ ${x}`:`⏱️ ${x} • 🪙${p.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${b}</span>
            </button>
            ${g?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Nạp hạt ${$(p.name)}" title="Mua hạt ${$(p.name)} (${p.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🌱 <strong>${$(o.name)}</strong> (${e.sim.getSeedCount(o.id)})`:"🌱 Hạt Giống & Hoa"}
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${a}/${i}</strong></span>
            <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${d}</div>
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
    `,t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.seedFilter;(m==="all"||m==="flowers"||m==="crops")&&(e.seedFilterMode=m,ei(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",g=>{g.stopPropagation();const m=p.dataset.acquireSeed,h=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,h)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),g=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.seedBrush,m=Se[g],h=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(g)<=0){e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,h);return}if(e.activeSeedCropId=g,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,h){const b=e.sim.state.buildings.find(x=>x.uid===h);if(b&&re(b.itemId)?.isFarmlandPlot&&!b.cropId){const x=e.sim.plantCropOnPlot(b.uid,g);if(x.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(g,b.uid);return}e.showToast(x.msg,x.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${m.emoji} ${m.name} (Túi có ${e.sim.getSeedCount(g)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,m.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=re("farmland_plot");p&&(dt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=re("burrow_flower_garden");p&&(dt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),_n(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{dt(e),e.refreshAll()})}function ho(e){const t=e.root.querySelector("#pastureBrushTray"),n=e.root.querySelector("#btnOpenPastureTray");if(n){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;n.dataset.active=String(l),n.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(l=>re(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,i=e.sim.state.buildings.filter(l=>re(l.itemId)?.isAnimalPasturePlot).length,o=e.activePastureAnimalId?et[e.activePastureAnimalId]:null,r=Object.values(et).map(l=>{const s=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,c=e.activePastureAnimalId===l.id,d=l.goodId?Ne(l.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${s?"locked":""} ${c?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${c}"
              ${s?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.png" alt="${$(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${$(l.name)}</span>
              <span class="seed-card-seed-badge ${s?"no-seed":"has-seed"}">
                ${s?`🔒 Cấp ${l.unlockLevel}`:`🪙 ${l.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${xe(l.cycleSec)} • +${l.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${d?`+${l.yieldQty} ${$(d.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🐾 <strong>${$(o.name)}</strong> (${o.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
          </div>
          <div class="seed-tray-sub">
            Ô trống: <strong>${a}/${i}</strong>
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
    `,t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const s=l.dataset.pastureBrush,c=et[s];if(!c)return;const d=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=s,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,d){const u=e.sim.state.buildings.find(p=>p.uid===d);if(u&&re(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId){const p=e.sim.stockAnimalOnPasture(u.uid,s);e.showToast(p.msg,p.ok?c.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${c.emoji} ${c.name} (${c.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,c.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=re("burrow_animal_pasture");l&&(Et(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),_n(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Et(e),e.refreshAll()})}function fo(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,a=Date.now();if((n.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){Ee(e);return}if(e.activeWorkshopTab==="brew"){const o=t.querySelector("#btnWsQuickHerb");if(o){const s=Math.max(0,Math.ceil((2e4-(a-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),c=s===0||n.sandboxMode;o.classList.toggle("gold-cta",c),o.textContent=c?"🌿 Hái Thảo Dược":`🌱 (${xe(s)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&n.supply.activeBrew){const s=Ft.find(d=>d.id===n.supply.activeBrew?.goodId),c=Math.max(0,Math.ceil((n.supply.activeBrew.endsAt-a)/1e3));s&&(r.textContent=`🔥 ${s.emoji} ${s.name} (còn ${qe(c)})`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const s=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-a)/1e3)),c=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-a)/1e3));if(s<=0&&c<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const d=[];s>0&&d.push(`🍻 +85%G (${qe(s)})`),c>0&&d.push(`🧪 +35%XP (${qe(c)})`),l.textContent=`✨ ${d.join(" • ")}`}}}}function Ee(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,a=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const i=e.sim.activeSynergies.activeIds.size,o=n.supply.cargoCrates.filter(d=>d.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),s=`
      <div class="workshop-tabs" role="group" aria-label="Kho & Xưởng">
        <button type="button" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-pressed="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          🏡 Kho (${l}/${r.capacity})
        </button>
        <button type="button" data-ws-tab="brew" data-active="${e.activeWorkshopTab==="brew"}" aria-pressed="${e.activeWorkshopTab==="brew"}" class="brass-btn">
          🧪 Vạc Phép
        </button>
        <button type="button" data-ws-tab="cargo" data-active="${e.activeWorkshopTab==="cargo"}" aria-pressed="${e.activeWorkshopTab==="cargo"}" class="brass-btn">
          🚂 Tàu (${o}/3)
        </button>
        <button type="button" data-ws-tab="synergy" data-active="${e.activeWorkshopTab==="synergy"}" aria-pressed="${e.activeWorkshopTab==="synergy"}" class="brass-btn">
          🌟 Combo (${i}/12)
        </button>
      </div>
    `;let c="";if(e.activeWorkshopTab==="barn"){const d=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),u=e.sim.getBarnUpgradeCostInfo(),p=n.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":u.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${u.baseGoldCost})`:`🏡 +20 Ô (🪙${u.effectiveGoldCost} • bù 1🔌)`,g=u.hasPlug?`🔌 ×${u.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${u.plugShortageBuyout}G)`,m=L=>L.map(C=>{const f=Ne(C),S=e.sim.getFarmItemCount(C);return`
              <div class="barn-stock-card ${S>0?"in-stock":"empty"}">
                <img src="${f.iconSrc}" alt="${$(f.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${$(f.name)}</div>
                <div class="barn-stock-qty"><strong>×${n.sandboxMode?"∞":S}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${S>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${C}"
                  ${S<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${f.sellValue}G
                </button>
              </div>
            `}).join(""),h=e.sim.getPhoenixTalismanCount(),b=e.sim.getPhoenixTalismanDailyStatus(),x=e.sim.getCraftablePhoenixBarnGood(),k=x?Ne(x):null,v=n.sandboxMode||h<Cn&&!!x&&n.galleons>=is;c=`
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
            <div class="quest-bar-fill" style="width:${d}%"></div>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <div class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${h}/${Cn}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${b.usedCount}/${b.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${v?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${k?`1 ${$(k.name)}`:"1 Đặc sản"} + ${is}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(Se).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(Se))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(rt).length})</h3>
        <div class="barn-stock-grid">
          ${m(Object.keys(rt))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const d=Math.max(0,Math.ceil((2e4-(a-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),u=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-a)/1e3)),p=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-a)/1e3)),g=n.supply.activeBrew,m=g?Ft.find(f=>f.id===g.goodId):void 0,h=g?Math.max(0,Math.ceil((g.endsAt-a)/1e3)):0,b=Math.max(0,n.supply.brewCompletedCount??0),x=b+1,k=n.buildings.some(f=>re(f.itemId)?.isWorkshopBrewery&&a>=f.constructEndsAt),v=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),L=b===0?"Mẻ #1 (khởi động: 1 giờ)":b===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":b===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${x} (đạt trần tối đa: 6 giờ)`,C=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];c=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${d===0||n.sandboxMode?"gold-cta":""}">
            ${d>0&&!n.sandboxMode?`🌱 (${xe(d)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${L}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${k?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${v?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${C.map(f=>{const S=Mt[f],M=n.supply.ingredients[f]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${S.emoji} ${S.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":M}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${u>0||p>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${u>0?`🍻 +85%G (${qe(u)}) `:""}${p>0?`• 🧪 +35%XP (${qe(p)})`:""}
              </div>
            `:""}

        ${g&&m?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${m.emoji} ${$(m.name)} (còn ${qe(h)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Ft.map(f=>{const S=n.supply.goods[f.id]??0,M=e.sim.getBrewDurationSec(f),A=xe(M),H=Object.entries(f.inputs).map(([O,E])=>{const D=Mt[O],R=n.supply.ingredients[O]??0;return`<span style="color:${n.sandboxMode||R>=(E??0)?"#15803d":"#dc2626"};font-weight:800;">${D.emoji} ${R}/${E}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${f.emoji} ${f.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${n.sandboxMode?"∞":S}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${H}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${f.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${A})
                  </button>
                  <button type="button" data-use-good="${f.id}" class="brass-btn" style="flex:1;">
                    ${f.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const d=Math.round(240+n.level*40),u=Math.round(160+n.level*25);c=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${d.toLocaleString("vi-VN")}🪙 +${u}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((p,g)=>{const m=Ft.find(x=>x.id===p.goodId),h=n.supply.goods[p.goodId]??0,b=!p.fulfilled&&(n.sandboxMode||h>=p.qtyRequired);return`
                <div class="crate-card ${p.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${g+1}</span>
                      <span>${p.fulfilled?"✅":`${n.sandboxMode?"∞":h}/${p.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${m.emoji} ${m.name} ×${p.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${p.rewardGalleons}🪙 • +${p.rewardXp}⭐ • +${p.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${p.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':b?`<button type="button" data-fulfill-crate="${p.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else c=`
        <div class="grid-2col">
          ${Pi.map(d=>{const u=e.sim.activeSynergies.activeIds.has(d.id),p=d.requiredItems.map(g=>re(g)?.name??g).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${u?"#d97706":"rgba(138,90,43,0.3)"};background:${u?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${d.emoji} ${$(d.name)}</span>
                  <span style="font-size:12px;font-weight:800;color:${u?"#15803d":"#78350f"};">
                    ${u?"✅":`≤${d.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">🔗 ${p}</div>
                <div style="font-size:12px;font-weight:800;color:#15803d;">
                  +${d.goldBonusPct}%G • +${d.xpBonusPct}%XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=s+c,t.querySelectorAll("[data-ws-tab]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab=d.dataset.wsTab,Ee(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const d=e.sim.upgradeFarmBarn();e.showToast(d.msg,d.ok?"🏡":"🔌"),Ee(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const d=e.sim.craftPhoenixTalismanFromBarn();e.showToast(d.msg,d.ok?"🔥":"🧺"),Ee(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.sellFarmItemFromBarn(d.dataset.sellFarmItem,1);u.ok||e.showToast(u.msg,"🧺"),Ee(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const d=e.sim.quickHarvestHerbs();e.showToast(d.msg,d.ok?"🌿":"⏳"),Ee(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&Ee(e)}),t.querySelectorAll("[data-brew-good]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.startBrewing(d.dataset.brewGood);e.showToast(u.msg,u.ok?"🧪":"⚠️"),Ee(e)})}),t.querySelectorAll("[data-use-good]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.useGood,p=e.sim.useCraftedGood(u);p.ok?u==="dragon_firework"?e.root.querySelector("#workshopDialog").close():Ee(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.fulfillCargoCrate(d.dataset.fulfillCrate);e.showToast(u.msg,u.ok?"📦":"⚠️"),Ee(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab="brew",Ee(e)})})}function vo(e){e.closeHudPopovers(),ti(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function yo(e){const t=e.sim.getClaimableHarvestFeastCount(),n=e.root.querySelector("#badgeFeastCount");n&&(t>0?(n.textContent=String(t),n.classList.remove("hidden")):n.classList.add("hidden"));const a=e.root.querySelector("#badgeManageFeastCount");a&&(t>0?(a.textContent=String(t),a.classList.remove("hidden")):a.classList.add("hidden"))}function So(e,t){const n=e.root.querySelector("#ribbonUnveilToastCard");n&&(n.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${$(t.speakerEmoji)} ${$(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${$(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,n.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{n.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function ti(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const n=e.sim.ensureHarvestFeast(),a=new Set(n.claimedTiers),i=ht[ht.length-1]?.pointsRequired??3e3,o=Math.min(100,Math.round(n.points/Math.max(1,i)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=ht.every(d=>a.has(d.tier)),s=ht.find(d=>!a.has(d.tier)),c=ht.map(d=>{const u=a.has(d.tier),g=n.points>=d.pointsRequired&&!u,m=ji(d),h=d.tier%5===0;return`
        <article class="feast-tier-card ${u?"is-claimed":g?"is-claimable":"is-locked"} ${h?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${d.tier}</span>
            <span class="feast-tier-pts">🍁 ${d.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${$(d.icon)} ${$(d.titleVi)}</span>
              ${h?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${$(m)}</div>
          </div>
          <div class="feast-tier-cta">
            ${u?'<span class="feast-claimed-pill">✓</span>':g?`<button type="button" data-claim-feast-tier="${d.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(d.pointsRequired-n.points).toLocaleString("vi-VN")} 🍁</span>`}
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
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${o}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
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
        ${c}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const d=e.sim.claimAllHarvestFeastTiers();e.showToast(d.msg,d.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const d=e.sim.startNextHarvestFeastCycle();e.showToast(d.msg,d.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.claimFeastTier);if(!Number.isFinite(u))return;const p=e.sim.claimHarvestFeastTier(u);e.showToast(p.msg,p.ok?"🎁":"🍁"),e.refreshAll()})})}function wo(e){const t=e.root.querySelector("#financeDialogContent"),n=e.sim.state.finance,a=n.gateRevenue+n.ticketRevenue+n.shopRevenue+n.harvestRevenue,i=n.staffWagesPaid+n.constructionSpent,o=a-i,r=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${n.harvestRevenue.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(n.shopRevenue+n.ticketRevenue+n.gateRevenue).toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${a.toLocaleString("vi-VN")} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${n.constructionSpent.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${r}G/ca):</span><strong>-${n.staffWagesPaid.toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${o>=0?"#15803d":"#b45309"};">
              <span>Ròng:</span><strong>${o>=0?"+":""}${o.toLocaleString("vi-VN")} G</strong>
            </div>
          </div>
        </div>
      </div>
    `}function Ke(e){const t=e.root.querySelector("#albumDialogContent"),n=e.sim.state;e.sim.checkAndToastAchievements();const a=Wi(n),i=Qi(n),o=as.filter(d=>{const u=a.achievements[d.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=os.filter(d=>d.day<=r&&!a.claimedLoginDays.includes(d.day)).length,s=`
      <div class="workshop-tabs" role="tablist" aria-label="Sổ Vàng Hang Sóc" style="margin-bottom:12px;">
        <button type="button" data-atab="cup" data-active="${e.activeAlbumTab==="cup"}" aria-selected="${e.activeAlbumTab==="cup"}" class="brass-btn">
          🏆 Cúp 4 Nhà
        </button>
        <button type="button" data-atab="achievements" data-active="${e.activeAlbumTab==="achievements"}" aria-selected="${e.activeAlbumTab==="achievements"}" class="brass-btn">
          🎖️ Thành Tựu (${i.unlocked}/${i.total})${o>0?` • 🎁${o}`:""}
        </button>
        <button type="button" data-atab="friendship" data-active="${e.activeAlbumTab==="friendship"}" aria-selected="${e.activeAlbumTab==="friendship"}" class="brass-btn">
          💝 Tình Bạn &amp; Phim
        </button>
        <button type="button" data-atab="login7" data-active="${e.activeAlbumTab==="login7"}" aria-selected="${e.activeAlbumTab==="login7"}" class="brass-btn">
          📅 Điểm Danh 7N${l>0?` • 🎁${l}`:""}
        </button>
      </div>
    `;let c="";if(e.activeAlbumTab==="cup"){const d=e.sim.getPlayerHouse(),u=n.weeklyHouseCupServerStandings,p=[{house:"Gryffindor",icon:"🦁",pts:(n.housePoints.Gryffindor??0)+(u?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(n.housePoints.Slytherin??0)+(u?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(n.housePoints.Ravenclaw??0)+(u?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(n.housePoints.Hufflepuff??0)+(u?.totals.Hufflepuff??0)}];p.sort((x,k)=>k.pts-x.pts);const g=Math.max(100,p[0]?.pts??100),m=(n.housePoints.Gryffindor??0)+(n.housePoints.Slytherin??0)+(n.housePoints.Ravenclaw??0)+(n.housePoints.Hufflepuff??0),h=n.houseCupMilestoneTier*300,b=m>=h;c=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${d}</strong>${u?` • Tuần HPVN ${u.weekKey} (đóng góp: +${u.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${n.houseCupMilestoneTier}: ${m} / ${h}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${p.map((x,k)=>{const v=Math.min(100,Math.max(8,Math.round(x.pts/g*100))),L=x.house===d;return`
                  <div class="aaa-hourglass-card" data-house="${x.house}" data-player-house="${L}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${k===0?"👑 ":""}${x.icon} ${x.house}</span>
                      ${L?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${x.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${v}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${h}" value="${Math.min(h,m)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${b?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${n.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const d=Date.now(),u={farm:at(n,"farm",d),building:at(n,"building",d),puzzle:at(n,"puzzle",d),language:at(n,"language",d),social:at(n,"social",d),collection:at(n,"collection",d)};c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${i.completionPct}% (${i.unlocked}/${i.total})</span>
          </div>
          <progress max="${i.total}" value="${i.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${as.map(p=>{const g=a.achievements[p.id],m=!!g?.unlockedAt,h=!!g?.claimedAt,b=Math.min(p.target,Math.max(0,u[p.category]??0)),x=b.toLocaleString("vi-VN"),k=p.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${m}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${p.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${p.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${p.descVi} • Thưởng <strong>+${p.rewardGalleons}G, +${p.rewardStars} 🌟</strong></div>
                    ${m?"":`<progress max="${p.target}" value="${b}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${h?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':m?`<button type="button" data-claim-ach="${p.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${x}/${k}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const d=e.sim.getRealTimePeriod(),u=Xi();c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${Ps.map(p=>{const g=n.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
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
          ${Ki.map(p=>{const g=Yi(p.id,d),m=a.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},h=m.level*60,b=m.lastTalkedDayKey===u;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${p.moodBubble} ${p.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${p.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${m.level}/10 (${m.xp}/${h})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${g.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${p.id}" data-choice="0" ${b?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${b?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${b?"":`<button type="button" data-npc-talk="${p.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else c=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${os.map(d=>{const u=a.claimedLoginDays.includes(d.day),p=!u&&d.day<=r;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${d.titleVi}</div>
                  <div style="font-size:11.5px;color:var(--ink-soft);">
                    +${d.galleons}G • +${d.magicStars} 🌟${d.phoenixTalismans>0?` • +${d.phoenixTalismans} 🔥`:""}
                  </div>
                  ${u?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận quà</span>':`<button type="button" data-claim-login="${d.day}" ${p?"":"disabled"} class="brass-btn ${p?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                          ${p?"🎁 Nhận Ngay":"🔒 Mở kế tiếp"}
                        </button>`}
                </div>
              `}).join("")}
          </div>
        </div>
      `;t.innerHTML=s+c,t.querySelectorAll("[data-atab]").forEach(d=>{d.addEventListener("click",()=>{e.activeAlbumTab=d.dataset.atab,Ke(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&Ke(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const d=await $t(()=>Promise.resolve().then(()=>za),void 0);if(typeof d.fetchWeeklyHouseCupStandingsOnline=="function"){const u=await d.fetchWeeklyHouseCupStandingsOnline();if(u){n.weeklyHouseCupServerStandings=u,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${u.weekKey}!`,"🏆"),Ke(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(d.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),Ke(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(d=>{d.addEventListener("click",()=>{e.playStoryCutscene(String(d.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.npcTalk,p=Number(d.dataset.choice)===1?1:0,g=e.sim.talkWithVillagerChoice(u,p);e.showToast(g.msg,g.ok?"💝":"☕"),Ke(e)})}),t.querySelectorAll("[data-claim-login]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(d.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),Ke(e)})})}function Fe(e){const t=e.root.querySelector("#questDialogContent"),n=e.sim.ensureFarmBarn(),a=e.sim.getActiveStoryQuest(),i=e.sim.getStoryAutoActionPreview(),o=e.sim.getReadyOwlOrdersCount(),r=(a?.completed?1:0)+e.sim.state.owlQuests.filter(m=>m.completed&&!m.claimed).length+e.sim.state.dailyQuests.filter(m=>m.completed&&!m.claimed).length;if(!e.selectedOwlOrderId||!n.owlOrders.some(m=>m.id===e.selectedOwlOrderId)){const m=n.owlOrders.find(h=>e.sim.canFulfillFarmOwlOrder(h));e.selectedOwlOrderId=(m??n.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${o}/${n.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const m=n.owlOrders.find(k=>k.id===e.selectedOwlOrderId)??n.owlOrders[0],h=m?e.sim.canFulfillFarmOwlOrder(m):!1,b=n.owlOrders.map(k=>{const v=m?.id===k.id,L=e.sim.canFulfillFarmOwlOrder(k),C=k.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${k.portraitSprite}.png" alt="${$(k.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${$(k.portraitEmoji)}</span>`,f=k.requirements.slice(0,3).map(S=>{const M=Ne(S.itemId);return`<img src="${M.iconSrc}" alt="${$(M.name)}" title="${S.qty} ${$(M.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${v?"selected":""} ${L?"ready":""}"
              data-select-owl="${$(k.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${C}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${$(k.senderName)}</div>
                <div class="owl-note-mini-row">${f}</div>
                ${k.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${L?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),x=m?`
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
              ${m.requirements.map((k,v)=>{const L=Ne(k.itemId),C=e.sim.getFarmItemCount(k.itemId),f=e.sim.ensureNeighborSocial(),S=Math.max(0,Vt-f.dailyOwlHelpRequestedCount),M=e.sim.getOwlRequirementHelpState(m.id,v),A=!!M?.fulfilledAt,H=e.sim.state.sandboxMode||A||C>=k.qty,O=A?`<span class="owl-help-tag done">✓ ${$(M?.helperEmoji??"🦉")}</span>`:M?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':H?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${v}" ${S<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${S})</button>`;return`
                    <div class="owl-req-row ${H?"ok":"lack"}">
                      <img src="${L.iconSrc}" alt="${$(L.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${$(L.name)}</div>
                        <div class="owl-req-count">${A?"✓":`${e.sim.state.sandboxMode?"∞":C}/${k.qty}`}</div>
                      </div>
                      ${O}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${m.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${m.rewardXp}</span>
                ${m.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${m.rewardMugglePlug}</span>`:""}
                ${(m.isFeastMarquee||(n.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<Cn?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${b}</div>
            ${x}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${h?"ready":"not-ready"}"
            >
              🦉 ${h?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(k=>{k.addEventListener("click",()=>{e.activeQuestTab=k.dataset.qtab,Fe(e)})}),t.querySelectorAll("[data-select-owl]").forEach(k=>{k.addEventListener("click",()=>{e.selectedOwlOrderId=k.dataset.selectOwl??null,Fe(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{m&&(e.sim.refreshFarmOwlOrder(m.id),e.selectedOwlOrderId=null,Fe(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(k=>{k.addEventListener("click",()=>{if(!m)return;const v=Number(k.dataset.askOwlHelp);if(!Number.isFinite(v))return;const L=e.sim.requestPlayerOwlCrateHelp(m.id,v);L.ok||e.showToast(L.msg,"⚠️"),Fe(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!m)return;if(!e.sim.canFulfillFarmOwlOrder(m)){const v=e.sim.fulfillFarmOwlOrder(m.id);e.showToast(v.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const k=e.sim.fulfillFarmOwlOrder(m.id);k.ok&&e.showToast(k.msg,"🦉"),e.selectedOwlOrderId=null,Fe(e)});return}const s=(m,h,b=!1)=>{const x=Math.min(100,Math.round(m.progress/Math.max(1,m.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${$(m.giverEmoji)} ${$(m.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${$(h)}</span>
          </div>
          ${b&&m.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${$(m.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${x}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(m.progress,m.targetAmount)}/${m.targetAmount}</span>
            <span>🪙${m.rewardGalleons} • ⭐${m.rewardXp} ${m.rewardTimeSand>0?`• ⏳${m.rewardTimeSand}`:""}</span>
          </div>
          ${m.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':m.completed?`<button type="button" data-modal-claim="${$(m.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:b?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${$(i.shortLabel)}</button>`:""}
        </div>
      `},c=e.sim.getRequiredLevelTrial(),d=e.sim.getWinsProgressForCurrentLevel(),u=m=>{const h=e.sim.getDisciplineStageInfo(m);return h.isMaxed?"👑777":`${h.currentStage}/777`},p=c&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${d.current}/${d.required}): ${c.icon} ${$(c.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${c.kind==="match3"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🍓 (${u("match3")})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${c.kind==="caro"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${u("caro")})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${c.kind==="sudoku"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🔮 (${u("sudoku")})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${c.kind==="chess"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🏰 (${u("chess")})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${c.kind==="blocks"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🦄 (${u("blocks")})</button>
            </div>
          </div>
        </div>
      `:"",g=a?`Ch.${a.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${qi.length}`:"";t.innerHTML=`
      ${l}
      ${p}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${a?s(a,g,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(m=>s(m,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(m=>s(m,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(m=>{m.addEventListener("click",()=>{e.activeQuestTab=m.dataset.qtab,Fe(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(m=>{m.addEventListener("click",()=>{const h=m.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(h)})}),t.querySelectorAll("[data-modal-claim]").forEach(m=>{m.addEventListener("click",()=>{e.sim.claimQuest(m.dataset.modalClaim),Fe(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const m=e.sim.completeStoryStepWithStar();m.ok?(typeof m.placedGx=="number"&&typeof m.placedGy=="number"&&me(e.cam,m.placedGx,m.placedGy),Fe(e)):(e.showToast(m.msg,m.reason==="missing_gold"?"🪙":"🌟"),(m.reason==="missing_stars"||m.reason==="locked_level"||m.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function ni(e){const t=e.root.querySelector("#roadmapDialogContent"),n=new Set(e.sim.state.unlockedZones),a=e.sim.getRequiredLevelTrial(),i=On.map(r=>{const l=n.has(r.id)||e.sim.state.sandboxMode,s=!l&&e.sim.state.level>=r.unlockLevel,c=Ms(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${l?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${c>0?`🌟 ${c}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${s?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),o=Hi.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${a&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${a.icon} ${$(a.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${i}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${o.map(r=>{const l=e.sim.state.level>=r.level,s=r.unlockedItemIds.map(c=>re(c)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${s?`<span style="font-size:12px;margin-left:6px;">${s}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=Cs(r.dataset.camZone);me(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),ni(e)})})}function Ae(e){const t=e.root.querySelector("#settingsDialogContent"),n=e.sim.state,a=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
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
            ${typeof window<"u"&&De(window.location.hostname)?`<label class="switch-row">
                    <span>♾️ Sandbox (Dev)</span>
                    <input id="swSandbox" type="checkbox" switch ${n.sandboxMode?"checked":""} />
                  </label>`:""}
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["realtime","dawn","day","dusk","night"].map(i=>{const o={realtime:"🕒 24h",dawn:"🌅 Bình minh",day:"☀️ Ngày",dusk:"🌇 Chiều",night:"🌙 Đêm"};return`<button type="button" data-time="${i}" data-active="${n.settings.timeOverride===i}" aria-pressed="${n.settings.timeOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["auto","halloween","christmas","quidditch_cup"].map(i=>{const o={auto:"🎪 Tự động",halloween:"🎃 Halloween",christmas:"🎄 Giáng Sinh",quidditch_cup:"🏆 Quidditch"};return`<button type="button" data-fest="${i}" data-active="${n.settings.activeFestival===i}" aria-pressed="${n.settings.activeFestival===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","clear","cloudy","rain","storm","snow","fog"].map(i=>{const o={auto:"🌦️ Tự động",clear:"☀️ Nắng",cloudy:"⛅ Mây",rain:"🌧️ Mưa",storm:"⛈️ Giông",snow:"❄️ Tuyết",fog:"🌫️ Sương"};return`<button type="button" data-weather="${i}" data-active="${n.settings.weatherOverride===i}" aria-pressed="${n.settings.weatherOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${a}" aria-pressed="${a}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!a}" aria-pressed="${!a}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
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
          ${["layout_1","layout_2","layout_3"].map((i,o)=>{const r=n.layoutPresets?.[i];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">${r?r.label:`Bản Vẽ #${o+1}`}</div>
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
            🌸 Bày Lại Trang Trí (${Object.values(n.stashedDecorInventory??{}).reduce((i,o)=>i+o,0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${["slot_1","slot_2","slot_3"].map((i,o)=>{const r=Zi(i);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${o+1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${r.ok&&r.meta?`${r.meta.parkName} • Cấp ${r.meta.level}`:"Ô trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-slot="${i}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Ghi</button>
                    <button type="button" data-load-slot="${i}" ${r.ok?"":"disabled"} class="brass-btn ${r.ok?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📂 Tải</button>
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
          ${typeof window<"u"&&De(window.location.hostname)?`<button id="btnPreview100" type="button" class="brass-btn gold-cta">
                  ${e.sim.isHeadmasterPreview?"↩️ Về Save":"🌾 Xem Lv.100"}
                </button>`:""}
          <button id="btnTestFireworks" type="button" class="brass-btn">
            🎆 Pháo Hoa
          </button>
          ${typeof window<"u"&&De(window.location.hostname)?`<button id="btnTestEscape" type="button" class="brass-btn">
                  🐾 Thả Niffler
                </button>`:""}
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
          ${typeof window<"u"&&De(window.location.hostname)?`<label class="brass-btn" style="cursor:pointer;">
                  📤 Nhập (.json)
                  <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
                </label>`:""}
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            🌱 Chơi Lại
          </button>
        </div>
      </div>
    `,"switch"in HTMLInputElement.prototype||$t(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",i=>{n.settings.bgmEnabled=i.currentTarget.checked,e.sim.audio.bgmEnabled=n.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",i=>{n.settings.soundEnabled=i.currentTarget.checked,e.sim.audio.enabled=n.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",i=>{n.settings.cutawayMode=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",i=>{n.settings.showGrid=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",i=>{typeof window<"u"&&De(window.location.hostname)&&(n.sandboxMode=i.currentTarget.checked,n.sandboxMode&&(n.sandboxTainted=!0),e.sim.saveToStorage(),e.refreshAll())}),t.querySelectorAll("[data-time]").forEach(i=>{i.addEventListener("click",()=>{n.settings.timeOverride=i.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-fest]").forEach(i=>{i.addEventListener("click",()=>{n.settings.activeFestival=i.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-weather]").forEach(i=>{i.addEventListener("click",()=>{n.settings.weatherOverride=i.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-toon]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.toon==="on";e.sprites?.setToonEnabled(o),e.refreshAll(),Ae(e)})}),t.querySelector("#btnTestFireworks")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.launchFireworksShow(12)}),t.querySelector("#btnTestEscape")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.triggerPlayfulEscape()}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),Ae(e)}),t.querySelector("#btnExportSave")?.addEventListener("click",()=>{const i=new Blob([e.sim.exportSaveJson()],{type:"application/json"}),o=URL.createObjectURL(i),r=document.createElement("a");r.href=o,r.download=`cong-vien-harry-potter-lv${n.level}.json`,r.click(),URL.revokeObjectURL(o),e.showToast("Đã xuất file Save thành công!","💾")}),t.querySelector("#inpImportSave")?.addEventListener("change",i=>{const o=i.target.files?.[0];if(!o)return;const r=new FileReader;r.onload=()=>{e.sim.importSaveJson(String(r.result))?(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.showToast("Đã khôi phục công viên thành công!","✨"),e.root.querySelector("#settingsDialog").close()):e.showToast("File Save không hợp lệ!","⚠️")},r.readAsText(o)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),me(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(i=>{i.addEventListener("input",()=>{const o=i.dataset.volBus,r=Math.max(0,Math.min(1,Number(i.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[o]=r,n.a11ySettings=l;const s=t.querySelector(`[data-vol-val="${o}"]`);s&&(s.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(i=>{i.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.colorblindMode=i.dataset.cbMode,n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelectorAll("[data-font-scale]").forEach(i=>{i.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.fontScale=Number(i.dataset.fontScale),n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",i=>{const o=e.getEffectiveA11ySettings();o.highContrast=i.currentTarget.checked,n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.saveLayout,r=e.sim.saveLayoutPreset(o);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ae(e)})}),t.querySelectorAll("[data-load-layout]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.loadLayout,r=e.sim.applyLayoutPreset(o);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ae(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const i=e.sim.stashAllDecorItems();e.showToast(i.msg,i.ok?"📦":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const i=e.sim.restoreAllStashedDecor();e.showToast(i.msg,i.ok?"🌸":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelectorAll("[data-save-slot]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(o);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ae(e)})}),t.querySelectorAll("[data-load-slot]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(o);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function xo(e,t,n){t&&(e.activeSuitcaseTab=t),n&&(e.selectedSuitcaseHabitatUid=n),Te(e);const a=e.root.querySelector("#suitcaseDialog");a.open||a.showModal()}function To(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const n=e.sim.getSuitcaseReadySummary();n.badgeCount>0?(t.textContent=String(n.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function $o(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=Date.now(),a=e.sim.state.suitcase,i=!!(a.activeIncubation&&n>=a.activeIncubation.endsAt),o=!!(a.activeExpedition&&n>=a.activeExpedition.endsAt);if((i!==e.lastSuitcaseIncReady||o!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){Te(e);return}if(a.activeIncubation&&n<a.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((a.activeIncubation.endsAt-n)/1e3)),l=Math.max(1e3,a.activeIncubation.endsAt-a.activeIncubation.startedAt),s=Math.min(100,Math.round((n-a.activeIncubation.startedAt)/l*100)),c=t.querySelector("[data-suitcase-inc-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-inc-prog]");d&&(d.value=s)}if(a.activeExpedition&&n<a.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((a.activeExpedition.endsAt-n)/1e3)),l=Math.max(1e3,a.activeExpedition.endsAt-a.activeExpedition.startedAt),s=Math.min(100,Math.round((n-a.activeExpedition.startedAt)/l*100)),c=t.querySelector("[data-suitcase-exp-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-exp-prog]");d&&(d.value=s)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((Ls-(n-(r.lastGroomedAt??0)))/1e3)),s=Math.max(0,Math.ceil((As-(n-(r.lastTrainedAt??0)))/1e3)),c=t.querySelector("#btnScGroom");c&&(c.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const d=t.querySelector("#btnScTrain");d&&(d.textContent=s>0?`🎾 (${s}s)`:"🎾 Tập (20G • +45💝)")}}}function Te(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=e.sim.state,a=n.suitcase,i=Date.now(),o=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!o.some(v=>v.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=o[0]?.building.uid??null);const r=new Set(a.discoveredMorphs),l=pn.length*3,s=r.size,c=Ii(s),d=n.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(a.activeIncubation&&i>=a.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(a.activeExpedition&&i>=a.activeExpedition.endsAt);const u=a.activeIncubation?i>=a.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",p=a.activeExpedition?i>=a.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${s}/${l}`,g=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${o.length}</strong></span>
        <span>📖 <strong>${s}/${l}</strong> (+${c}%)</span>
        <span>✨ <strong>${n.sandboxMode?"∞":d}</strong> • ⏳ <strong>${n.sandboxMode?"∞":n.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${e.activeSuitcaseTab==="care"}" aria-pressed="${e.activeSuitcaseTab==="care"}" class="brass-btn">
          🐾 Chăm Sóc (${o.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${e.activeSuitcaseTab==="morph"}" aria-pressed="${e.activeSuitcaseTab==="morph"}" class="brass-btn">
          🧬 Ấp Trứng (${u})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${e.activeSuitcaseTab==="expedition"}" aria-pressed="${e.activeSuitcaseTab==="expedition"}" class="brass-btn">
          🧭 Thám Hiểm (${p})
        </button>
      </div>
    `;let m="";if(e.activeSuitcaseTab==="care")if(o.length===0)m=`
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;else{const v=o.find(V=>V.building.uid===e.selectedSuitcaseHabitatUid)??o[0],L=v.building,C=v.item,f=Dt(C.id)??pn[0],S=L.creatureMorph??"normal",M=Oe[S],A=L.creatureBondLevel??1,H=L.creatureBondXp??0,O=A>=St?100:Bi(A),E=A>=St?100:H,D=Math.round((Jn(A)-1)*100),R=L.creatureNickname||C.creatureName||C.name,j=e.sim.getBuildingProductionPerCycle(L,C),U=e.sim.biomeCache.get(L.uid),ce=Math.round(L.creatureHunger??90),ie=Math.max(8,Math.round(C.cost*.04)),N=n.sandboxMode?0:Math.max(0,Math.ceil((Ls-(i-(L.lastGroomedAt??0)))/1e3)),X=n.sandboxMode?0:Math.max(0,Math.ceil((As-(i-(L.lastTrainedAt??0)))/1e3)),ae=a.activeExpedition?.habitatUid===L.uid;m=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${o.map(({building:V,item:Q})=>{const ue=Dt(Q.id),ne=V.creatureMorph??"normal",be=Oe[ne],ge=V.creatureNickname||Q.creatureName||Q.name,te=V.uid===L.uid;return`
                  <button type="button" data-select-pet="${$(V.uid)}" aria-pressed="${te}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${ue?.beastSpriteKey??Q.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${be.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${$(ge)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${V.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${f.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${$(f.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${S==="radiant"?"radiant":S==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${M.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${$(R)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${f.beastSpriteKey}.png"
                  alt="${$(R)}"
                  class="suitcase-diorama-img"
                  style="filter:${M.cssFilter} drop-shadow(0 0 18px ${M.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${f.emoji} ${$(R)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${$(f.morphNames[S])}${ae?" • 🧭":""}
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
                  placeholder="${$(C.creatureName??C.name)}"
                  value="${$(L.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${A}/${St} (+${D}%)</span>
                  <span style="color:#b45309;">${A>=St?"MAX":`${H}/${O}`}</span>
                </div>
                <progress max="${O}" value="${E}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${$(f.favoriteTreat)} • <strong>+${j.galleons.toLocaleString("vi-VN")}🪙 / ${xe(C.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${ce}%</span>
                  <span>🌿 ${U?.score??60}% ${L.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${ce}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${n.sandboxMode?"0G":`${ie}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${N===0?"gold-cta":""}">
                  ${N>0?`🪮 (${N}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${X>0?`🎾 (${X}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const v=a.activeIncubation;let L="";if(v){const f=re(v.itemId),S=Dt(v.itemId),M=i>=v.endsAt,A=Math.max(0,Math.ceil((v.endsAt-i)/1e3)),H=Math.max(1e3,v.endsAt-v.startedAt),O=M?100:Math.min(100,Math.round((i-v.startedAt)/H*100));L=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${$(S?.speciesName??f?.name??"Trứng")}
                ${v.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${M?"✨ Nở!":`${A}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${O}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${M?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else L=`
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(n.sandboxMode||d>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const C=o.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${o.map(({building:f,item:S})=>{const M=Dt(S.id),A=f.creatureMorph??"normal",H=e.sim.getMorphIncubationCost(S),O=f.creatureNickname||S.creatureName||S.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${M?.beastSpriteKey??S.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Oe[A].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${$(O)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Oe[A].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(E=>{const D=r.has(`${S.id}:${E}`);return`<span class="morph-pill ${D?E==="radiant"?"radiant":E==="mystic"?"mystic":"":"locked"}">${D?Oe[E].badge:`🔒 ${Oe[E].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${$(f.uid)}"
                        class="brass-btn ${v?"":"gold-cta"}"
                        ${v?"disabled":""}
                      >
                        ${v?"🥚 Đang ấp":`🥚 Ấp (${n.sandboxMode?"0G":`${H}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;m=`${L}${C}`}else{const v=a.activeExpedition;let L="";if(v){const f=un.find(R=>R.id===v.expeditionId)??un[0],S=n.buildings.find(R=>R.uid===v.habitatUid),M=S?re(S.itemId):void 0,A=S?.creatureNickname||M?.creatureName||"Thú cưng",H=i>=v.endsAt,O=Math.max(0,Math.ceil((v.endsAt-i)/1e3)),E=Math.max(1e3,v.endsAt-v.startedAt),D=H?100:Math.min(100,Math.round((i-v.startedAt)/E*100));L=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${f.emoji} ${$(A)} • ${$(f.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${H?"🎒 Đã về!":`${O}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${D}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${H?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(o.length===0)L=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const S=(o.find(A=>A.building.uid===e.selectedSuitcaseHabitatUid)??o[0]).building,M=Jn(S.creatureBondLevel??1)*Oe[S.creatureMorph??"normal"].incomeMult;L=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${o.map(({building:A,item:H})=>{const O=A.creatureNickname||H.creatureName||H.name,E=Oe[A.creatureMorph??"normal"].shortLabel;return`<option value="${$(A.uid)}" ${A.uid===S.uid?"selected":""}>${$(O)} (💝Lv.${A.creatureBondLevel??1} • ${E})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${un.map(A=>{const H=!n.sandboxMode&&n.level<A.minParkLevel,O=Math.round(A.baseGold*M),E=Math.round(A.baseXp*M),D=(S.creatureBondLevel??1)>=5?1:0,R=A.guaranteedIngredients.map(j=>`+${j.qty+D} ${Mt[j.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${A.emoji} ${$(A.name)} <span style="font-size:11.5px;color:#78350f;">(${A.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${O}🪙 • +${E}⭐ • ${R}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${A.id}"
                    class="brass-btn ${H?"":"gold-cta"}"
                    ${H?"disabled":""}
                  >
                    ${H?`🔒 Lv.${A.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const C=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${s}/${l})</span>
            <span style="color:#15803d;">+${c}%</span>
          </div>
          <progress max="${l}" value="${s}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${pn.map(f=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${f.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${f.emoji} ${$(f.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(S=>{const M=r.has(`${f.habitatItemId}:${S}`);return`<span class="morph-pill ${M?S==="radiant"?"radiant":S==="mystic"?"mystic":"":"locked"}">${M?Oe[S].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;m=`${L}${C}`}t.innerHTML=`${g}${m}`,t.querySelectorAll("[data-sc-tab]").forEach(v=>{v.addEventListener("click",()=>{e.activeSuitcaseTab=v.dataset.scTab,Te(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(v=>{v.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=v.dataset.selectPet??null,Te(e)})});const h=t.querySelector("#formSuitcaseRename"),b=t.querySelector("#inpSuitcasePetName");if(b&&b.addEventListener("keydown",v=>{v.isComposing||v.stopPropagation()}),h&&b&&e.selectedSuitcaseHabitatUid){const v=e.selectedSuitcaseHabitatUid;h.addEventListener("submit",L=>{L.preventDefault();const C=e.sim.renameCreature(v,b.value);e.showToast(C.msg,"🏷️"),Te(e)})}if(e.selectedSuitcaseHabitatUid){const v=e.selectedSuitcaseHabitatUid,L=()=>{const C=e.sim.groomCreature(v);e.showToast(C.msg,C.ok?"🪮":"⏳"),Te(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",L),t.querySelector("#btnScGroom")?.addEventListener("click",L),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(v),Te(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const C=e.sim.trainCreatureTrick(v);e.showToast(C.msg,C.ok?"🎾":"🪙"),Te(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const C=n.buildings.find(f=>f.uid===v);C&&(e.root.querySelector("#suitcaseDialog").close(),me(e.cam,C.gx+1,C.gy+1),e.inspectSelection={kind:"building",uid:C.uid},e.renderInspector())})}const x=t.querySelector("#chkScStarlight");x&&x.addEventListener("change",()=>{e.useStarlightForIncubation=x.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(v=>{v.addEventListener("click",()=>{const L=v.dataset.incubateUid,C=e.useStarlightForIncubation&&(n.sandboxMode||(n.supply.ingredients.starlight_dust??0)>=1),f=e.sim.startMorphIncubation(L,C);e.showToast(f.msg,f.ok?"🥚":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const v=e.sim.speedUpIncubationWithSand();e.showToast(v.msg,v.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),Te(e)});const k=t.querySelector("#selScExpPet");k&&k.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=k.value,Te(e)}),t.querySelectorAll("[data-start-exp]").forEach(v=>{v.addEventListener("click",()=>{const L=v.dataset.startExp,C=e.selectedSuitcaseHabitatUid??o[0]?.building.uid;if(!C)return;const f=e.sim.startSuitcaseExpedition(C,L);e.showToast(f.msg,f.ok?"🧭":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const v=e.sim.speedUpExpeditionWithSand();e.showToast(v.msg,v.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),Te(e)})}const ko="/api/track",Co=25,Mo=3e4;class Lo{constructor(t={}){T(this,"endpoint");T(this,"batchSize");T(this,"batchIntervalMs");T(this,"queue",[]);T(this,"timer",null);T(this,"lastLevel",null);T(this,"isFlushing",!1);T(this,"isInitialized",!1);this.endpoint=t.endpoint||ko,this.batchSize=t.batchSize||Co,this.batchIntervalMs=t.batchIntervalMs||Mo}track(t,n){const a={id:this.generateEventId(),name:t,props:n?{...n}:void 0,timestamp:Date.now()};this.queue.push(a),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const n=this.queue.splice(0,this.queue.length);if(n.length===0)return;const a={events:n,sentAt:Date.now()},i=JSON.stringify(a);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const o=new Blob([i],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,o))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",n=>{this.handleGameTick(n)}),window.addEventListener("gamesave:uploaded",n=>{const a=n;this.track("save_uploaded",a.detail||{})});else if(t){const n=t.onUploadSuccess;t.onUploadSuccess=a=>{if(n)try{n(a)}catch{}this.track("save_uploaded",a)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",n="unknown",a="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,n=navigator.language||"vi",a=navigator.userAgent||""),this.track("session_start",{screen:t,language:n,userAgent:a,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const a=t.detail;a&&(this.track("game:tick",{level:a.level,galleons:a.galleons}),typeof a.level=="number"&&(this.lastLevel!==null&&a.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:a.level}),this.lastLevel=a.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class Ao{constructor(t,n={}){T(this,"analytics");T(this,"maxErrorsPerSession");T(this,"isListening",!1);T(this,"seenSignatures",new Set);T(this,"errorCountThisSession",0);T(this,"handleError",t=>{const n=t.message||(t.error?String(t.error):"Uncaught runtime error"),a=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",i=t.filename||(typeof window<"u"?window.location.href:""),o={msg:n,stack:a,url:i,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(o),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});T(this,"handleUnhandledRejection",t=>{const n=t.reason,a=n instanceof Error,i=a?n.message:n?String(n):"Unhandled promise rejection",o=a&&n.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:i,stack:o,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",n)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,n.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const n=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(n)){this.seenSignatures.add(n),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class Eo{constructor(){T(this,"buttonEl",null);T(this,"dialogEl",null);T(this,"activeTab","privacy");T(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const n=this.dialogEl.querySelector(".legal-confirm-btn");n&&n.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",i=>{i.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-tab");o&&this.switchTab(o)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{const o=i.getAttribute("data-tab")===t;i.setAttribute("aria-selected",o?"true":"false"),i.setAttribute("data-active",o?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(i=>{const o=i.getAttribute("data-panel")===t;i.setAttribute("data-active",o?"true":"false"),i.style.display=o?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}function Po(e){ta({fetchLeaderboards:async t=>{const n=await e.getLeaderboard(t);return Kt(n.leaderboards),n.leaderboards??null},submitLeaderboard:async t=>{const n=await e.submitLeaderboard(t);return Kt(n.leaderboards),n.leaderboards??null}})}class qo{constructor(){T(this,"cloudSave");T(this,"analytics");T(this,"errorMonitor");T(this,"legalModal");T(this,"authoritativeClient");T(this,"hpvnBridge");T(this,"isInitialized",!1);T(this,"lastAuthoritativeWalletBalance",null);T(this,"walletSyncTimer",null);T(this,"isApplyingServerWallet",!1);T(this,"boundSim",null);this.cloudSave=new Ji,this.analytics=new Lo,this.errorMonitor=new Ao(this.analytics),this.legalModal=new Eo,this.authoritativeClient=gt(),this.hpvnBridge=Aa({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(qs):null;if(!t)return{};const n=JSON.parse(t),a=n.match3&&typeof n.match3=="object"?n.match3:null,i=n.settings&&typeof n.settings=="object"?n.settings:null;return{version:Number(n.version||3),parkName:String(n.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(n.level)||1)),xp:Math.max(0,Math.floor(Number(n.xp)||0)),magicStars:Math.max(0,Math.floor(Number(a?.stars??n.magicStars)||0)),unlockedZonesCount:Array.isArray(n.unlockedZones)?n.unlockedZones.length:1,buildingsCount:Array.isArray(n.buildings)?n.buildings.length:0,weatherMode:String(i?.weatherOverride||n.weatherMode||"auto"),atmosphereMode:String(i?.timeOverride||n.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount(),this.cloudSave.init(),Po(this.authoritativeClient),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",t=>{const n=t.detail;n&&typeof n=="object"&&this.hpvnBridge.syncState(n)}),window.addEventListener("hpvn:share-floo",t=>{const n=t.detail??{};this.hpvnBridge.shareToFloo({...n,sendToFloo:n.sendToFloo??(async(a,i)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const o=await this.authoritativeClient.host("floo-share",{text:a,...i.image?{image:i.image}:{},...i.tourId?{tourId:i.tourId}:{}});return!!(o&&typeof o=="object"&&o.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",t=>{const n=t.detail;n?.hostUid&&this.authoritativeClient.visit({hostUid:n.hostUid,help:!0,buildingUid:n.buildingUid,kind:n.kind||"water_crop",noteText:n.noteText,helperName:n.helperName,helperEmoji:n.helperEmoji}).catch(()=>{})})),(typeof navigator>"u"||navigator.onLine)&&this.authoritativeClient.read().then(t=>{if(Kt(t.leaderboards),t.wallet&&typeof t.wallet.spendable=="number"&&this.syncWalletBaseline(t.wallet.spendable),typeof t.uid=="string"&&t.uid){const n=this.cloudSave.getUserId(),a=Nn(t.uid);a!==n&&ea(a).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:t}))}).catch(()=>{}),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,n={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const a=t.saveToStorage.bind(t),i=Math.max(0,n.debounceMs??180),o=s=>{const c=Math.max(0,Math.floor(s));this.syncWalletBaseline(c),this.isApplyingServerWallet=!0;try{const d=t.homeStateWhileVisiting??t.state;!d.sandboxMode&&!d.sandboxTainted&&(d.galleons=c,t.homeStateWhileVisiting&&(t.state.galleons=c),a(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;if(s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview)return;const c=Math.max(0,Math.floor(Number(s.galleons)||0)),d=c-this.lastAuthoritativeWalletBalance;if(d===0)return;const u=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=c;const p=d<0?"debit":"credit";let g=Math.abs(d);const m=p==="credit"?1e3:5e4;try{let h=null;for(;g>0;){const b=Math.min(g,m);g-=b,h=await this.authoritativeClient.settleWallet({direction:p,amount:b,reasonCode:p==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:p==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(s.level)||1))})}h?.wallet&&typeof h.wallet.spendable=="number"&&(o(h.wallet.spendable),n.onSnapshot?.(h))}catch(h){const b=h;if(b?.definitive===!0){const x=Yt(b);n.onToast?.(`🏦 Gringotts HPVN: ${x.text}`,x.icon);const k=b.details?.spendable;typeof k=="number"&&Number.isFinite(k)?o(k):await this.authoritativeClient.read().then(v=>{v.wallet&&typeof v.wallet.spendable=="number"&&o(v.wallet.spendable)}).catch(()=>{o(u)})}else this.lastAuthoritativeWalletBalance=u}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(s.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),i===0?r():this.walletSyncTimer=setTimeout(()=>{r()},i))};return t.saveToStorage=()=>{a(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=a,this.boundSim===t&&(this.boundSim=null)}}}const He=new qo;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{He.init()},{once:!0}):He.init());const Ut={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},An={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Un(e){return e.sim.getPlayerHouse()}function ct(e,t,n=""){const a=da(e),i=(t||"🧙").trim().slice(0,2);return a?`<span class="floo-avatar-shell ${n}"><img src="${$(a)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${$(i)}</span></span>`:`<span class="floo-avatar-shell ${n}"><span class="floo-avatar-fallback">${$(i)}</span></span>`}function si(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function jt(e){const t=e.sim.ensureNeighborSocial(),n=Un(e),a=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:a,level:e.sim.state.level,house:n,keeperTitle:$s(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function jn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}const ys=new Set;function ii(e,t){if(!t||typeof t!="object")return;const n=t,a=e.sim.ensureNeighborSocial(),i=e.sim.homeStateWhileVisiting??e.sim.state;let o=!1;typeof n.uid=="string"&&n.uid.trim()&&Nn(n.uid),Kt(n.leaderboards)&&(o=!0);const r=typeof n.garden?.progression?.friendCode=="string"&&n.garden.progression.friendCode.trim()||(n.profile&&typeof n.profile=="object"&&typeof n.profile.friendCode=="string"?String(n.profile.friendCode).trim():"");if(r&&a.playerFriendCode!==r&&(a.playerFriendCode=r,o=!0),n.wallet&&typeof n.wallet.spendable=="number"&&Number.isFinite(n.wallet.spendable)){const u=Math.max(0,Math.floor(n.wallet.spendable));if(He.syncWalletBaseline(u),!i.sandboxMode&&!i.sandboxTainted&&!e.sim.isHeadmasterPreview){const p=!!n.receipt,g=sa(i);(p||g||u>=i.galleons)&&i.galleons!==u&&(i.galleons=u,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=u),o=!0)}}const l=n.profile&&typeof n.profile=="object"?n.profile:null,s=ia(l?.house??n.garden?.progression?.house),c=String(l?.houseSource??n.garden?.progression?.houseSource??"");if(s){const u=c==="hpvn",p=i.minigameLeaderboard;(u||!p?.playerHouseExplicit)&&(p?.playerHouse!==s||!!p?.playerHouseLockedByServer!==u)&&(rs(i,s,{lockedByServer:u}),e.sim.homeStateWhileVisiting&&rs(e.sim.state,s,{lockedByServer:u}),o=!0)}if(l){const u=typeof l.username=="string"?l.username.trim():"";u&&u!=="Phù Thủy Hang Sóc"&&u!=="Trang Trại Hang Sóc"&&!a.playerDisplayName&&(a.playerDisplayName=u,o=!0);const p=typeof l.avatarUrl=="string"?l.avatarUrl.trim():"";p&&a.playerAvatarUrl!==p&&(a.playerAvatarUrl=p,o=!0)}if(typeof n.uid=="string"&&n.uid.trim()&&!ys.has(n.uid)&&!i.sandboxMode&&!i.sandboxTainted&&!e.sim.isHeadmasterPreview){ys.add(n.uid);const u=Math.max(0,i.match3?.maxClearedLevel??Math.max(0,(i.match3?.currentLevel??1)-1)),p=Math.max(0,i.puzzleArcade?.sudokuCleared??0),g=Math.max(0,i.puzzleArcade?.blockCleared??0);(u>0||p>0||g>0)&&Es(i).catch(()=>{})}const d=n.daily&&typeof n.daily=="object"?n.daily:null;if(d&&typeof d.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(d.helpsLeft)));const u=Math.max(0,Ie-e.flooHelpsLeft);u>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=u,o=!0)}if(Array.isArray(n.helpers)&&n.helpers.length>0){e.flooHelpersToday=n.helpers.map(p=>({uid:String(p.uid||""),name:String(p.name||"Bạn HPVN"),avatarEmoji:p.avatarEmoji,avatarUrl:p.avatarUrl,at:Number(p.at||0)}));const u=aa(e.flooHelpersToday,a.lastSeenHelperAt??0);u&&u.textVi&&u.seenAt>(a.lastSeenHelperAt??0)&&(a.lastSeenHelperAt=u.seenAt,o=!0,e.showToast(u.textVi,"🤝"))}if(n.houseCup&&typeof n.houseCup=="object"){const u=n.houseCup,p=u.houses&&typeof u.houses=="object"?u.houses:null;p&&typeof u.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:u.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(p.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(p.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(p.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(p.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(u.memberTodayPoints)||0)),updatedAt:Date.now()},o=!0)}o&&(e.sim.saveToStorage(),e.refreshAll())}async function Pt(e,t=!1){if(e.flooLoading)return;const n=Date.now();if(!t&&e.flooLastLoadedAt>0&&n-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const a=e.sim.ensureNeighborSocial(),i=Un(e),o=a.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;if(r||na(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r){const d=e.sim.state.minigameLeaderboard,u=!!d?.playerHouseExplicit&&!d?.playerHouseLockedByServer;await He.authoritativeClient.syncProfile({playerName:o,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:a.playerAvatarUrl||"",avatarEmoji:An[i],...u?{house:i,houseExplicit:!0}:{},level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(p=>ii(e,p)).catch(()=>{})}const l=await He.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(l.helpsLeft)));const d=Math.max(0,Ie-e.flooHelpsLeft);d>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=d)}const s=Array.isArray(l.visits)?l.visits:[],c=Gt(s,Date.now());e.flooDirectoryRows=c,e.flooQueueRows.length===0&&(e.flooQueueRows=c),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(c,ut())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&$e(e),e.renderVisitorDockBar()}}function En(e){const t=jt(e),n=Ln(e.gameCanvas,t),a=Os(n,.55),i=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:ut(),image:a||void 0}})),i.rewarded&&e.showToast(i.msg,"🔥"),e.refreshAll()}function ai(e,t,n){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),n&&(e.focusedNeighborId=n),(e.sim.state.level>=Ye||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Pt(e),$e(e);const i=e.root.querySelector("#neighborDialog");i&&!i.open&&i.showModal(),n&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${n}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function oi(e,t){e.closeHudPopovers();const n=e.root.querySelector("#neighborDialog");n?.open&&n.close(),t.kind==="match3"?e.getMatch3Modal().then(a=>a.openRescue(t)):e.getPuzzleArcadeModal().then(a=>a.openRescue(t))}function sn(e,t){jn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const a=e.sim.enterHonorGardenTour(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function Je(e,t,n){const a=String(t||"").trim();if(!a)return;if(a.startsWith("tour_")){sn(e,a);return}n&&n.length>0?e.flooQueueRows=[...n]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),jn(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const o=a.startsWith("player_")?a:`player_${a}`,r=a.startsWith("player_")?a.slice(7):a;(async()=>{try{const s=await He.authoritativeClient.visit({hostUid:r});typeof s.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(s.helpsLeft))));const c=s.visit&&typeof s.visit=="object"?s.visit:null;if(c){const d=c.progression&&typeof c.progression=="object"?c.progression:void 0,u=Date.now(),p=Array.isArray(d?.timers)?d.timers.filter(x=>Number(x.readyAt||0)>u).length:0,g=c.decorations&&typeof c.decorations=="object"?c.decorations:void 0,m={uid:String(c.uid||r),friendCode:typeof c.friendCode=="string"?c.friendCode:void 0,username:String(c.username||"Thành Viên HPVN"),parkName:String(c.parkName||"Thung Lũng Phép Thuật"),house:c.house||"Gryffindor",avatarEmoji:typeof c.avatarEmoji=="string"?c.avatarEmoji:void 0,avatarUrl:typeof c.avatarUrl=="string"?c.avatarUrl:void 0,level:Math.max(1,Number(c.level||1)),growing:p,helped:!!c.helped,hostHelpsLeft:typeof c.hostHelpsLeft=="number"?c.hostHelpsLeft:10,fire:c.fire&&typeof c.fire=="object"?c.fire:null,scene:g?.scene},h=e.sim.syncFlooDirectoryMembers([m],ut()),b=c.rawClientSave&&typeof c.rawClientSave=="object"?c.rawClientSave:null;if(h[0]&&b){if(Array.isArray(b.buildings)&&b.buildings.length>0){const x=b.buildings.filter(k=>k&&typeof k.itemId=="string"&&!!re(k.itemId));x.length>0&&(h[0].valleyBuildings=x)}b.tileOverrides&&typeof b.tileOverrides=="object"&&(h[0].valleyTileOverrides=b.tileOverrides),Array.isArray(b.unlockedZones)&&b.unlockedZones.length>0&&(h[0].valleyUnlockedZones=b.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(o);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function ri(e,t){if(t.startsWith("tour_")){sn(e,t);return}jn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const a=e.sim.enterNeighborVisit(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function en(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const n=new URLSearchParams(window.location.search);if(n.has("visit")||n.has("tour")){n.delete("visit"),n.delete("tour");const a=n.toString();window.history.replaceState(null,"",`${window.location.pathname}${a?`?${a}`:""}${window.location.hash}`)}}e.refreshAll()}function Ho(e){const t=e.sim.ensureNeighborSocial(),n=t.playerOwlHelpRequests.filter(c=>!!c.fulfilledAt).length,a=t.playerMinigameSos?.rescuedAt??0,i=!!t.playerMinigameSos?.claimed,o=`${t.lastSocialResetKey}|${t.friendshipTokens}|${n}|${a}|${i}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(o===e.lastSocialLiveSig)return;e.lastSocialLiveSig=o,li(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),s=document.activeElement?.id??"";l?.open&&s!=="inpFlooDisplayName"&&$e(e)}function li(e){const t=e.sim.ensureNeighborSocial(),n=Math.floor(t.friendshipTokens/Ze),a=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,i=t.homeLanternMarks.length,o=n+a+i,l=Math.max(0,Tt-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(u=>u.minigameSos&&!u.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(u.id)).length:0,s=e.sim.state.level>=Ye&&(t.dailyGardenHelpsCount??0)<Ie?e.flooDirectoryRows.filter(u=>Lt(u)).length:0,c=e.root.querySelector("#badgeNeighborCount");if(c){const u=o>0?o:l>0?l:s;u>0?(c.textContent=String(u),c.classList.toggle("is-ready-green",o>0),c.classList.remove("hidden")):c.classList.add("hidden")}const d=e.root.querySelector("#badgeManageNeighborCount");d&&(o>0?(d.textContent=String(o),d.classList.remove("hidden")):d.classList.add("hidden"))}function Io(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.getActiveHonorGardenTour();if(n){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${$(n.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${$(n.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${n.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${$(n.ownerName)} · ${$(Ut[n.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const C=e.sim.cycleHonorGardenTour(-1);C.ok&&typeof C.focusGx=="number"&&typeof C.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,C.focusGx,C.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const C=e.sim.cycleHonorGardenTour(1);C.ok&&typeof C.focusGx=="number"&&typeof C.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,C.focusGx,C.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{En(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{en(e)});return}const a=e.sim.getActiveVisitingNeighbor();if(!a){t.classList.add("hidden"),t.innerHTML="";return}const i=e.sim.ensureNeighborSocial(),o=Date.now(),r=Math.min(Ie,Math.max(i.dailyGardenHelpsCount??0,a.helpedViaFlooToday?1:a.helpedMarksToday.length)),l=Math.max(0,Ie-r),s=!!(a.helpedViaFlooToday||a.helpedMarksToday.length>0),c=(a.hostHelpsLeft??10)<=0,d=!!(a.fireUntilMs&&a.fireUntilMs>o),u=!s&&l>0&&!c,p=i.dailyLikedNeighborIds.includes(a.id),g=i.dailyMysteryClaimedIds.includes(a.id),m=a.owlHelpCrates.filter(C=>!C.fulfilledByPlayerToday).length,h=e.sim.canRescueNeighborMinigame(a.id).ok,b=m+(h?1:0),x=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,k=a.remoteUserId||a.id.replace(/^player_/,""),v=x.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${x.slice(0,12).map(C=>{const f=C.uid===k,S=Lt(C,o),M=!!(C.fire&&C.fire.until>o);return`
                <button
                  type="button"
                  class="floo-strip-dot ${f?"is-current":""} ${S?"is-helpable":""} ${M?"is-fire":""}"
                  data-floo-jump="${$(C.uid)}"
                  title="${$(C.username)} (Lv.${C.level})"
                >
                  ${ct(C.avatarUrl,C.avatarEmoji||C.username,"floo-strip-avatar")}
                  ${M?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",L=s?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":c?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${v}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${ct(a.avatarUrl,a.avatarEmoji||a.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${$(a.name)}</strong>
            <span class="visitor-lv-tag">Lv.${a.level}</span>
            ${d?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${Ie}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${i.friendshipTokens}/${Ze}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${x.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${u?"gold-cta":""}" ${u?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${L}
        </button>
        ${d?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${p?"disabled":""} title="Thả tim khen vườn">
          ${p?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${g?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${g?"✓ Quà":"🎁 Quà"}
        </button>
        ${b>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${b})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,si(t),t.querySelectorAll("[data-floo-jump]").forEach(C=>{C.addEventListener("click",()=>{const f=C.dataset.flooJump;f&&f!==k&&Je(e,f,x)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const C=t.querySelector("#btnVisitorFlooHelp");C&&(C.disabled=!0);let f;if(a.remoteUserId)try{const A=oa(i.selectedPresetNoteId),H=await He.authoritativeClient.visit({hostUid:a.remoteUserId,help:!0,kind:"water_crop",noteText:A.textVi});typeof H.helpsLeft=="number"&&(f=H.helpsLeft,e.flooHelpsLeft=H.helpsLeft)}catch(A){const H=Yt(A);if(H.reason==="already-helped"||H.reason==="daily-help-cap"||H.reason==="host-help-cap"){e.showToast(`${H.icon} ${H.text}`,H.icon),Pt(e,!0),e.refreshAll();return}}const S=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:f});if(!S.ok){e.showToast(S.msg,"🤝"),e.refreshAll();return}const M=A=>A.map(H=>H.uid===k?{...H,helped:!0}:H);if(e.flooDirectoryRows=M(e.flooDirectoryRows),e.flooQueueRows=M(e.flooQueueRows),e.refreshAll(),S.helpsLeft>0&&e.flooQueueRows.length>1){const A=bn(e.flooQueueRows,k,1);A&&A.uid!==k&&Lt(A)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===a.id&&Je(e,A.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const C=t.querySelector("#btnVisitorExtinguish");C&&(C.disabled=!0);try{let f=0;if(a.remoteUserId){const M=await He.authoritativeClient.fireOut({hostUid:a.remoteUserId});f=Math.max(0,Math.floor(Number(M?.price||0)))}if(f>0){const M=e.sim.homeStateWhileVisiting??e.sim.state;M.galleons=Math.max(0,M.galleons-f),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=M.galleons)}a.fireUntilMs=0;const S=M=>M.map(A=>A.uid===k?{...A,fire:null}:A);e.flooDirectoryRows=S(e.flooDirectoryRows),e.flooQueueRows=S(e.flooQueueRows),e.showToast(f>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name} (-${f} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(f){const S=Yt(f);e.showToast(`${S.icon} ${S.text}`,S.icon),C&&(C.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const C=e.sim.likeVisitedNeighborFarm();C.ok||e.showToast(C.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{g||(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,a.mysteryGiftGx+.5,a.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{ai(e,"friends",a.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const C=bn(x,k,-1);C&&C.uid!==k&&Je(e,C.uid,x)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(x.length>1){const f=bn(x,k,1);if(f&&f.uid!==k){Je(e,f.uid,x);return}}const C=e.sim.cycleNextNeighborVisit();C.ok&&typeof C.focusGx=="number"&&typeof C.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,C.focusGx,C.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{en(e)})}function $e(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const n=e.sim.ensureNeighborSocial(),a=e.sim.getActiveVisitingNeighbor(),i=e.sim.getActiveHonorGardenTour(),o=Date.now(),r=Un(e),l=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",s=Math.min(Ie,Math.max(0,n.dailyGardenHelpsCount??0)),c=Math.max(0,Ie-s),d=Math.max(0,Tt-n.dailyRescuesGivenIds.length),u=Math.max(0,Tt-n.dailyRescuesReceivedCount),p=Math.max(0,Vt-n.dailyOwlHelpRequestedCount),g=n.friendshipTokens>=Ze,m=Math.min(100,Math.round(n.friendshipTokens/Ze*100)),h=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,b=e.sim.state.level>=Ye||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,x=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${n.friendshipTokens}/${Ze}</strong>
        ${g?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${c}/${Ie}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${d}/${Tt}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${p}/${Vt}</strong></span>
      </div>
    </div>
  `,k=`
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        🖼️ Bưu Thiếp ${n.dailyFlooShareClaimed?"":"(!)"}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        🎁 Rương &amp; SOS ${g||h?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${n.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let v="";if(e.activeNeighborTab==="friends"){const S=[];if(h?.rescuedAt){const O=hn(h.kind);S.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${$(h.rescuerEmoji??"🦉")} ${$(h.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${O.icon} Màn ${h.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(h){const O=hn(h.kind);S.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${O.icon} Màn ${h.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}n.homeLanternMarks.length>0&&S.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${n.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${n.homeLanternMarks.length}🍀)</button>
        </div>
      `);const M=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${ct(n.playerAvatarUrl,An[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${Ut[r]}</span>
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
    `;let A="";if(b){const O=Gt(e.flooDirectoryRows,o),E=O.filter(N=>Lt(N,o)).length,D=[...e.flooHelpersToday,...n.homeLanternMarks.map(N=>({uid:N.helperId,name:N.helperName,avatarEmoji:N.helperEmoji,avatarUrl:N.helperAvatarUrl,at:N.createdAt}))],R=Array.from(new Map(D.map(N=>[N.uid||N.name,N])).values()),j=R.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${R.slice(0,6).map(N=>ct(N.avatarUrl,N.avatarEmoji||N.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${$(ra(R))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${R.length*15} phút</strong>!
              </div>
            </div>
          `:"",U=O.length>0?`
            <div class="floo-portal-grid" role="list">
              ${O.map(N=>{const X=!!(N.fire&&N.fire.until>o),ae=Lt(N,o),B=a?.remoteUserId===N.uid||a?.id===`player_${N.uid}`,V=X?"🔥 Đang cháy · cần dập!":N.helped?"✓ Đã chăm giúp":N.growing>0?`🌱 ${N.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${X?"is-fire":""} ${ae?"is-helpable":""} ${N.helped?"is-helped":""} ${B?"is-visiting":""}"
                      data-floo-portal="${$(N.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${ct(N.avatarUrl,N.avatarEmoji||N.username,"floo-portal-avatar")}
                        ${X?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${N.level}</span>
                      </div>
                      <strong class="floo-portal-name">${$(N.username)}</strong>
                      <span class="floo-portal-park">${$((N.house?An[N.house]:"")||"🪄")} ${$(N.parkName||"")}</span>
                      <span class="floo-portal-status">${V}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,ce=n.neighbors.filter(N=>N.owlHelpCrates.some(X=>!X.fulfilledByPlayerToday)||!!(N.minigameSos&&!N.minigameSos.rescuedToday)),ie=ce.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${ce.slice(0,6).map(N=>{const X=e.sim.canRescueNeighborMinigame(N.id),ae=N.minigameSos,B=ae?hn(ae.kind):null,V=!!(ae&&(ae.rescuedToday||n.dailyRescuesGivenIds.includes(N.id))),Q=N.owlHelpCrates.filter(ne=>!ne.fulfilledByPlayerToday).map(ne=>{const be=Ne(ne.itemId),ge=e.sim.getFarmItemCount(ne.itemId),te=e.sim.state.sandboxMode||ge>=ne.qty;return`
                          <div class="nb-crate-item">
                            <img src="${be.iconSrc}" alt="${$(be.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${ne.qty} ${$(be.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":ge}/${ne.qty})</span></div>
                              <div class="nb-crate-rew">+${ne.rewardTokens}🍀 • +${ne.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${te?"gold-cta":""} nb-mini-cta" data-nb-crate="${$(N.id)}|${$(ne.id)}" ${te?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),ue=ae&&B&&!V?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${B.icon} ${$(B.nameVi)} • <strong>Màn ${ae.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${$(N.id)}" ${X.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===N.id?"focused":""}" data-neighbor-card="${$(N.id)}">
                        <div class="nb-card-head">
                          ${ct(N.avatarUrl,N.avatarEmoji||N.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${$(N.name)}</strong>
                              <span class="nb-badge-pill">Lv.${N.level}</span>
                              <span class="nb-badge-pill house">${Ut[N.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${$(N.id)}">🔥 Bay tới</button>
                        </div>
                        ${Q?`<div class="nb-coop-section"><div class="nb-crate-list">${Q}</div></div>`:""}
                        ${ue}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";A=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN</div>
              <div class="floo-hearth-sub">
                Còn <strong>${c}/${Ie} lượt chăm giúp</strong> hôm nay · <strong>${E}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"⏳…":"🔄"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${O.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${j}
        </section>
        ${U}
        ${ie}
      `}else{const O=Math.min(100,Math.round(e.sim.state.level/Ye*100));A=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${Ye}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${Ye}</strong> · Khi đạt Cấp ${Ye}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${O}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const H=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${la.map(O=>{const E=i?.id===O.id;return`
              <article class="honor-garden-card ${E?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${$(O.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${$(O.titleVi)}</strong>
                    <span class="honor-garden-owner">${$(O.ownerName)} · Lv.${O.level} · ${Ut[O.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${$(O.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${$(O.weather)} · ${$(O.atmosphere)}</span>
                  ${E?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${$(O.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;v=`
      ${S.join("")}
      ${M}
      ${b?`${A}${H}`:`${H}${A}`}
    `}else if(e.activeNeighborTab==="postcard"){const S=jt(e),M=Ds(S);v=`
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
        <div class="floo-postcard-caption">${$(M)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const S=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(M=>{const A=Ne(M.itemId);return`
                <div class="nb-crate-item ${M.fulfilledAt?"done":""}">
                  <img src="${A.iconSrc}" alt="${$(A.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${M.qty} ${$(A.name)}</div>
                    <div class="nb-crate-rew">${M.fulfilledAt?`✓ ${$(M.helperEmoji??"🦉")} ${$(M.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';v=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${n.friendshipTokens}/${Ze} 🍀)</div>
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
              🎁 Mở Rương (${Ze} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${h?`
                  <div class="nb-alert-banner ${h.rescuedAt?"ready":""}">
                    <span>${h.rescuedAt?`🎉 <strong>${$(h.rescuerEmoji??"🦉")} ${$(h.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${h.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${h.stage}</strong>…`}</span>
                    ${h.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${u}/${Tt}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${p}/${Vt}):</div>
            <div class="nb-crate-list">${S}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${ca.map(M=>{const A=M.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${M.id}" data-active="${A}" aria-pressed="${A}" class="brass-btn nb-note-btn">
                  ${M.emoji} ${$(M.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else v=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(M=>{const A=new Date(M.timestamp),H=String(A.getHours()).padStart(2,"0"),O=String(A.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${$(M.icon)}</span>
                  <span class="nb-log-msg">${$(M.textVi)}</span>
                  <span class="nb-log-time">${H}:${O}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${x}
    ${k}
    ${v}
  `,si(t);const L=t.querySelector("#flooPostcardCanvas");L&&Ln(e.gameCanvas,jt(e),L),t.querySelectorAll("[data-nbtab]").forEach(S=>{S.addEventListener("click",()=>{e.activeNeighborTab=S.dataset.nbtab,$e(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",$e(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{En(e),$e(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{En(e),$e(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const S=t.querySelector("#flooPostcardCanvas")??Ln(e.gameCanvas,jt(e)),M=Os(S,.72);if(M){const H=document.createElement("a");H.href=M,H.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${M.startsWith("data:image/webp")?"webp":"png"}`,H.click()}const A=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(A.msg,"🖼️"),$e(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",S=>{S.preventDefault();const A=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);A&&(n.playerDisplayName=A,e.sim.saveToStorage(),Pt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${A}"!`,"🔥"),$e(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Pt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const S=Gt(e.flooDirectoryRows,Date.now());S.length>0&&Je(e,S[0].uid,S)}),t.querySelectorAll("[data-floo-portal]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.flooPortal;if(!M)return;const A=Gt(e.flooDirectoryRows,Date.now());Je(e,M,A)})}),t.querySelectorAll("[data-honor-tour]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.honorTour;M&&sn(e,M)})});const f=()=>{const S=e.sim.openFriendshipChest();S.ok||e.showToast(S.msg,"🍀"),e.refreshAll(),$e(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",f),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",f),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(S=>{S.addEventListener("click",()=>{const M=e.sim.claimPlayerMinigameSosRescue();M.ok||e.showToast(M.msg,"⚠️"),e.refreshAll(),$e(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const S=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const M of S)e.sim.claimHomeLanternMark(M.id);e.refreshAll(),$e(e)}),t.querySelectorAll("[data-nb-visit]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbVisit;M&&ri(e,M)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),en(e)}),t.querySelectorAll("[data-nb-crate]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbCrate??"",[A,H]=M.split("|");if(!A||!H)return;const O=e.sim.fulfillNeighborOwlCrate(A,H);O.ok||e.showToast(O.msg,"🧺"),e.refreshAll(),$e(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbRescue;if(!M)return;const A=e.sim.canRescueNeighborMinigame(M);if(!A.ok||!A.neighbor||!A.sos){e.showToast(A.reason??"Không thể giải cứu màn này lúc này!","🦉");return}oi(e,{neighborId:A.neighbor.id,neighborName:A.neighbor.name,neighborEmoji:A.neighbor.avatarEmoji,kind:A.sos.kind,stage:A.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbNote;M&&(e.sim.setNeighborPresetNote(M),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),$e(e))})})}function Wt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;me(e.cam,t.gx+t.bw*.5+a,t.gy+t.bh*.5+a),e.onCameraJump?.()}function ci(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const n=Date.now();return e.sim.state.buildings.some(i=>re(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const n=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(n)return{el:n,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function Pn(e){const t=e.root.querySelector("#tutorialHudSpotlight"),n=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(c=>c.removeAttribute("data-tutorial-anchor")),!t)return;const a=!!document.querySelector("dialog[open]");if(e.photoModeActive||a||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:i,label:o}=ci(e);if(!i||i.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=i.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!i.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||i.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const s=6;t.style.setProperty("--spot-left",`${Math.round(r.left-s)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-s)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+s*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+s*2)}px`),t.classList.toggle("pill-below",r.top<110),n&&(n.textContent=o||"👇 Bấm"),t.classList.remove("hidden")}function di(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function pi(e,t){if(di())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function ui(e,t){if(di())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function qn(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const n=!!document.querySelector("dialog[open]"),a=e.manageMenuOpen||e.weatherPopoverOpen,i=e.sim.getCurrentTutorialStep();if(e.photoModeActive||n||a||!i){pi(e,t),Pn(e);return}const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",o),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),l=`${i.index}:${i.id}:${e.tutorialMinimized?1:0}:${o?1:0}:${r}`;if(e.lastRenderedTutorialSig!==l){e.lastRenderedTutorialSig=l;const c=Xt.map(d=>`<span class="tutorial-step-dot ${d.index<i.index?"done":d.index===i.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
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
        `;else{const d=i.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>':i.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${r>0?"🔨 Xây":"🦉 Đơn Cú"}</button>`:"",u=i.id==="build_and_owl_order"?r>0?"🦉 Giao Đơn!":"🔨 Xây Dựng":i.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${Xt.length}"
              aria-valuenow="${i.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${c}
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
                ${d}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${$(u)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),qn(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),qn(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{gi(e,i.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{i.id==="earn_magic_star"?e.openPuzzleArcadeDialog():i.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}ui(e,t);const s=`${i.index}:${i.id}`;e.lastFocusedTutorialStepKey!==s&&(e.lastFocusedTutorialStepKey=s,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),Pn(e)}function gi(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())Wt(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const a=re("farmland_plot");a&&(e.selectedCatalogItem=a,e.refreshAll())}return}if(t==="sow_and_merge_plot"){Wt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){Wt(e);const n=Date.now();e.sim.state.buildings.some(i=>re(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Bo{constructor(t,n,a,i,o){T(this,"sim");T(this,"cam");T(this,"gameCanvas");T(this,"activeCategory",null);T(this,"selectedCatalogItem",null);T(this,"rotation",0);T(this,"bulldozerActive",!1);T(this,"moveModeActive",!1);T(this,"movingBuildingUid",null);T(this,"pincerActive",!1);T(this,"pincerPicked",null);T(this,"seedTrayOpen",!1);T(this,"seedFilterMode","all");T(this,"activeSeedCropId",null);T(this,"pendingSowPlotUid",null);T(this,"pastureTrayOpen",!1);T(this,"activePastureAnimalId",null);T(this,"pendingStockPastureUid",null);T(this,"rideCamUid",null);T(this,"rideCamSpeedText","");T(this,"pendingTouchTile",null);T(this,"onTouchConfirmPlace",null);T(this,"onTouchCancelPlace",null);T(this,"onCameraJump",null);T(this,"photoModeActive",!1);T(this,"inspectSelection",null);T(this,"minimapCanvas");T(this,"questCollapsed",!1);T(this,"minimapCollapsed",!1);T(this,"manageMenuOpen",!1);T(this,"weatherPopoverOpen",!1);T(this,"mapToolsExpanded",!1);T(this,"buildSheetOpen",!1);T(this,"minimapHudVisible",!1);T(this,"hudRolledUp",!1);T(this,"inspectorCollapsed",!1);T(this,"lastInspectedKey","");T(this,"displayedGalleons",-1);T(this,"galleonRollRaf",0);T(this,"activeWorkshopTab","barn");T(this,"activeQuestTab","orders");T(this,"activeAlbumTab","cup");T(this,"selectedOwlOrderId",null);T(this,"lastWsBrewId",null);T(this,"activeSuitcaseTab","care");T(this,"selectedSuitcaseHabitatUid",null);T(this,"useStarlightForIncubation",!0);T(this,"lastSuitcaseIncReady",!1);T(this,"lastSuitcaseExpReady",!1);T(this,"activeNeighborTab","friends");T(this,"focusedNeighborId",null);T(this,"flooDirectoryRows",[]);T(this,"flooQueueRows",[]);T(this,"flooHelpsLeft",null);T(this,"flooLoading",!1);T(this,"flooLastLoadedAt",0);T(this,"flooAutoAdvanceTimer",0);T(this,"flooHelpersToday",[]);T(this,"lastSocialLiveSig","");T(this,"tutorialMinimized",!1);T(this,"lastRenderedTutorialSig","");T(this,"lastFocusedTutorialStepKey","");T(this,"ribbonBannerTimer",0);T(this,"pendingBulldozeWarning",null);T(this,"drawerEdgeObserver",null);T(this,"dialogOpenObserver",null);T(this,"match3Modal",null);T(this,"puzzleArcadeModal",null);T(this,"match3ModalPromise",null);T(this,"puzzleArcadeModalPromise",null);T(this,"seedQuizModal");T(this,"leaderboardModal");T(this,"root");T(this,"sprites");this.root=t,this.sim=n,this.cam=a,this.gameCanvas=i,this.sprites=o,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||$t(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new Ja(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{this.activeSeedCropId=r;const s=Se[r];if(l){const c=this.sim.state.buildings.find(d=>d.uid===l);if(c&&re(c.itemId)?.isFarmlandPlot&&!c.cropId){const d=this.sim.plantCropOnPlot(c.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(d.msg,d.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${s.emoji} ${s.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,s.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new Ga(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),s=this.root.querySelector("#puzzleArcadeDialog"),c=this.root.querySelector("#seedQuizDialog");r==="match3"?(s?.close(),c?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),s?.close(),this.openSeedQuizDialog()):(l?.close(),c?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const s=this.sim.state.buildings.find(u=>this.inspectSelection?.kind==="building"&&u.uid===this.inspectSelection.uid),c=s?re(s.itemId):void 0,d=Date.now();s&&(d<s.constructEndsAt||s.workshopQueue&&s.workshopQueue.length>0||s.cropId&&s.cropReadyAt&&d<s.cropReadyAt+1200||s.pastureAnimalId&&s.pastureReadyAt&&d<s.pastureReadyAt+1200||c&&c.cycleSec>0&&c.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return eo(this)}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const n=t.returnValue;t.returnValue="";const a=this.pendingBulldozeWarning;this.pendingBulldozeWarning=null,n==="confirm"&&a&&(this.sim.removeAtTile(a.gx,a.gy,!0),this.refreshAll())}),this.sim.onRequestBulldozeConfirm=n=>{this.openBulldozeConfirmDialog(n)})}openBulldozeConfirmDialog(t){const n=this.root.querySelector("#bulldozeConfirmDialog"),a=this.root.querySelector("#bulldozeConfirmBody");if(!n||!a){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,a.innerHTML=`
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
    `,n.returnValue="",n.open||n.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),n=this.root.querySelector("#floatingBannerGrip");if(!t||!n)return;n.classList.remove("hidden");const a=(s,c)=>{t.classList.add("is-floating-dragged");const d=Math.max(0,window.innerWidth-t.offsetWidth),u=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(s,d))}px`,t.style.top=`${Math.max(0,Math.min(c,u))}px`};let i=0,o=0,r=0,l=0;n.addEventListener("pointerdown",s=>{if(s.button!==0)return;const c=t.getBoundingClientRect();i=s.clientX-c.left,o=s.clientY-c.top,r=s.clientX,l=s.clientY,n.setPointerCapture(s.pointerId)}),n.addEventListener("pointermove",s=>{n.hasPointerCapture(s.pointerId)&&(Math.hypot(s.clientX-r,s.clientY-l)>=4&&n.classList.add("dragging"),a(s.clientX-i,s.clientY-o))}),n.addEventListener("lostpointercapture",()=>{n.classList.remove("dragging")}),n.addEventListener("keydown",s=>{let d=0,u=0;if(s.key==="ArrowLeft")d=-15;else if(s.key==="ArrowRight")d=15;else if(s.key==="ArrowUp")u=-15;else if(s.key==="ArrowDown")u=15;else return;s.preventDefault();const p=t.getBoundingClientRect();a(p.left+d,p.top+u)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const s=t.getBoundingClientRect();a(s.left,s.top)}})}installDialogLightDismissFallback(){const t=()=>{const n=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(n)};for(const n of Array.from(this.root.querySelectorAll("dialog")))n.addEventListener("close",()=>{n.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",n=>{const a=n.target;if(a&&typeof a.matches=="function"&&a.matches(".aaa-codex-scroll")){const i=!!n.skipped;a.dataset.cvSkipped=i?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const n=new IntersectionObserver(a=>{for(const i of a)i.target.dataset.cvSkipped=i.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const a of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))n.observe(a)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const n=(a,i)=>{const o=i.getBoundingClientRect();return a.clientX<o.left||a.clientX>o.right||a.clientY<o.top||a.clientY>o.bottom};for(const a of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let i=!1;a.addEventListener("pointerdown",o=>{i=n(o,a)}),a.addEventListener("pointerup",o=>{i&&n(o,a)&&a.close()})}}}wireRangeProgressFallback(t){const n=()=>{const a=Number(t.min||0),i=Number(t.max||100),o=Number(t.value||0),r=Math.round((o-a)/Math.max(1,i-a)*100);t.style.setProperty("--progress",`${r}%`)};n(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",n)}togglePhotoMode(t){return no(this,t)}openNeighborDialog(t,n){return ai(this,t,n)}openHarvestFeastDialog(){return vo(this)}refreshHarvestFeastBadges(){return yo(this)}showRibbonUnveilBanner(t){return So(this,t)}renderHarvestFeastDialog(){return ti(this)}openMinigameRescue(t){return oi(this,t)}enterVisitFromHud(t){return ri(this,t)}enterHonorTourFromHud(t){return sn(this,t)}enterFlooMemberVisitFromHud(t,n){return Je(this,t,n)}refreshFlooDirectoryFromHud(t){return Pt(this,t)}applyAuthoritativeSnapshot(t){ii(this,t)}exitVisitFromHud(){return en(this)}isBuildingFocusMode(){return Us(this)}toggleHudRollup(t){return so(this,t)}syncHudFocusVisibility(){return nn(this)}openWorkshopDialog(t){return _n(this,t)}openSuitcaseDialog(t,n){return xo(this,t,n)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=$t(async()=>{const{Match3ModalController:t}=await import("./match3Modal-ClSoQ6I8.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2,3])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(n,a)=>this.showToast(n,a),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=n=>this.openPuzzleArcadeDialog(n),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=$t(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-CcyT9APp.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([4,1,2,3])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(n,a)=>this.showToast(n,a),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=n=>this.openLeaderboardDialog(n),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,n){this.closeHudPopovers();const a=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(a,n)}openMatch3Dialog(t,n=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(a=>a.open(t,n))}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(n=>n.open(t))}openSeedQuizDialog(t,n,a,i,o,r){this.closeHudPopovers(),n||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,n,a,i,o,r)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return tt(this)}collapseBuildDock(){return nt(this)}hasOpenFloatingTray(){return io(this)}hideOpenFloatingTrays(){return ao(this)}positionFloatingPopover(t,n){return zn(this,t,n)}toggleManagePopover(t){return oo(this,t)}toggleWeatherPopover(t){return ro(this,t)}renderWeatherPopover(){return Fn(this)}animateGalleonsTo(t){return js(this,t)}spawnFlyReward(t,n,a,i){return lo(this,t,n,a,i)}bindEvents(){return to(this)}showToast(t,n="🦉"){return We(this,t,n)}showOfflineModal(t){return po(this,t)}refreshFloatingBanner(){return Vn(this)}openSeedTray(t,n){return Zs(this,t,n)}closeSeedTray(){return dt(this)}toggleSeedTray(){return mo(this)}openPastureTray(t,n){return Js(this,t,n)}closePastureTray(){return Et(this)}togglePastureTray(){return bo(this)}renderSeedTray(){return ei(this)}renderPastureTray(){return ho(this)}refreshTouchConfirmBar(){return Gn(this)}refreshAll(){return Zt(this)}refreshHeaderClock(){return Jt(this)}refreshHeader(){return Ws(this)}syncProgressiveHudVisibility(){return Qs(this)}refreshQuestTracker(){return Xs(this)}refreshDock(){return Ks(this)}renderStaffDrawer(t){return Ys(this,t)}syncContextualMapToolsBar(){return go(this)}renderInspector(){return pe(this)}renderFinanceDialog(){return wo(this)}renderAlbumDialog(){return Ke(this)}renderQuestDialog(){return Fe(this)}renderRoadmapDialog(){return ni(this)}updateWorkshopLiveTimers(){return fo(this)}renderWorkshopDialog(){return Ee(this)}renderSettingsDialog(){return Ae(this)}refreshSuitcaseBadge(){return To(this)}updateSuitcaseLiveTimers(){return $o(this)}renderSuitcaseDialog(){return Te(this)}syncLiveNeighborSocialUI(){return Ho(this)}refreshNeighborBadges(){return li(this)}renderVisitorDockBar(){return Io(this)}renderNeighborDialog(){return $e(this)}panCameraToTutorialTarget(){return Wt(this)}resolveTutorialHudTarget(){return ci(this)}updateTutorialHudSpotlight(){return Pn(this)}hideTutorialPopover(t){return pi(this,t)}showTutorialPopover(t){return ui(this,t)}renderTutorialCoach(){return qn(this)}handleTutorialPrimaryAction(t){return gi(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Nt.colorblindMode,fontScale:t?.fontScale??Nt.fontScale,highContrast:t?.highContrast??Nt.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Nt.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();va(t),this.sim.audio?.ceiling&&ya(t,this.sim.audio)}playStoryCutscene(t){const n=Ps.find(i=>i.id===t);if(!n)return;if(this.sim.state.level<n.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${n.unlockLevel} để mở khoá ${n.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${n.titleVi}`,"🎬");let a=120;n.keyframes.forEach((i,o)=>{window.setTimeout(()=>{me(this.cam,i.cameraFocusGx,i.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${i.captionVi}`,o===n.keyframes.length-1?"✨":"🕯️"),n.chapterNumber===3&&o===n.keyframes.length-1&&this.sim.launchFireworksShow(10)},a),a+=i.durationMs})}}let je=null,pt=null,Ss=!1;function ws(){return typeof navigator<"u"&&typeof navigator.install=="function"}function Hn(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,n=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||n}function In(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function mi(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const a=navigator,i=typeof a.install=="function";if(!i&&!je){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(i&&a.install)await a.install(),t.classList.add("hidden");else if(je){const o=je;je=null,await o.prompt(),((await o.userChoice).outcome==="accepted"||!je)&&t.classList.add("hidden")}}catch(o){!(o instanceof DOMException&&o.name==="AbortError")&&!je&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function Bn(){!Hn()||In()||(pt||(pt=mi()),pt.classList.remove("hidden"))}function bi(){pt&&pt.classList.add("hidden")}function Do(){Ss||typeof window>"u"||(Ss=!0,!In()&&(pt=mi(),ws()&&Hn()&&Bn(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),je=e,!ws()&&Hn()&&!In()&&Bn()}),window.addEventListener("appinstalled",()=>{bi(),je=null})))}const Oo={init:Do,show:Bn,hide:bi},No="burrow_rollback_backup_v12";function xs(e,t){const n=JSON.stringify({backedUpAt:Date.now(),state:e}),a=typeof localStorage<"u"?localStorage:void 0;try{a?.setItem(No,n)}catch{}return n}class Ro{constructor(){T(this,"unhandledErrors",0);T(this,"fpsSamples",[]);T(this,"assetLoadLatencyMs",0);T(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const n=Math.max(1,Math.min(240,t));this.fpsSamples.push(n),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,n={},a=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:n,queuedAt:a})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const n=[...this.offlineQueue];return t(n)?(this.offlineQueue=[],n.length):0}getHealthReport(){const t=this.fpsSamples.length;let n=60,a=60;if(t>0){const i=this.fpsSamples.reduce((l,s)=>l+s,0);n=Number((i/t).toFixed(1));const o=[...this.fpsSamples].sort((l,s)=>l-s),r=Math.max(0,Math.floor((t-1)*.05));a=Number(o[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:n,p5LowFps:a,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function Dn(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function Ts(e){return Dn(e)||e.category==="decor"}async function zo(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const n=document.createElement("canvas");n.id="gameCanvas",n.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(n);const a=new pa,i=new ba;await i.loadAll();const o=new ua(a),r={x:0,y:0,zoom:.82,viewRot:0};me(r,18,24.5);const l=new ha(n,i),s=new Bo(e,o,r,n,i);Oo.init(),wn.init(o);const c=new URLSearchParams(window.location.search),d=!!(c.get("preview")==="100"||c.get("visit")||c.get("tour")||c.get("zoom")||c.get("cx")||c.get("cy")||c.get("ridecam")==="1");let u=null;if(s.onCameraJump=()=>{u=null},!d&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const y=r.x,w=r.y,P=r.zoom;me(r,17.5,24),r.zoom=.76,u={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:y,toY:w,toZoom:P}}const p=De(window.location.hostname);if(c.get("preview")==="100"&&p){o.toggleHeadmasterPreview(100),!c.get("tutorial")&&o.isTutorialActive()&&o.skipTutorial();const y=Number(c.get("zoom")||.62);r.zoom=Number.isFinite(y)&&y>=.32&&y<=2.15?y:.62;const w=Number(c.get("cx")),P=Number(c.get("cy")),F=Number.isFinite(w)&&c.get("cx")?w:24.5,W=Number.isFinite(P)&&c.get("cy")?P:23;me(r,F,W)}const g=c.get("tutorial");g==="1"||g==="reset"?(o.restartTutorial(),s.tutorialMinimized=!1):(g==="0"||g==="off")&&o.isTutorialActive()&&o.skipTutorial();const m=c.get("tstep");if(m!==null&&p){const y=Math.max(0,Math.min(Xt.length-1,Number(m)||0)),w=o.ensureTutorialState();w.active=!0,delete w.completedAt,w.skipped=!1,w.stepIndex=y,w.stepId=Xt[y].id,w.pastureHarvestedInStep3=!1}const h=Number(c.get("rot")||0);if(h>=1&&h<=3)for(let y=0;y<h;y++)wt(r,1);c.get("cutaway")==="1"&&(o.state.settings.cutawayMode=!0);const b=c.get("time");(b==="night"||b==="day"||b==="dusk"||b==="dawn")&&(o.state.settings.timeOverride=b);const x=c.get("weather");if((x==="auto"||x==="clear"||x==="cloudy"||x==="rain"||x==="storm"||x==="snow"||x==="fog"||x==="fireflies")&&(o.state.settings.weatherOverride=x),c.get("zoom")&&c.get("preview")!=="100"){const y=Number(c.get("zoom"));Number.isFinite(y)&&y>=.32&&y<=2.15&&(r.zoom=y)}if((c.get("cx")||c.get("cy"))&&c.get("preview")!=="100"){const y=Number(c.get("cx")),w=Number(c.get("cy")),P=Number.isFinite(y)&&c.get("cx")?y:18,F=Number.isFinite(w)&&c.get("cy")?w:24.5;me(r,P,F)}const k=c.get("heatmap");if(k&&(o.heatmapMode=k),c.get("fireworks")==="1"&&o.launchFireworksShow(12),c.get("ridecam")==="1"){const y=o.state.buildings.find(w=>re(w.itemId)?.isCustomCoasterStation);y&&(s.rideCamUid=y.uid)}const v=c.get("dialog");if(v==="album")document.getElementById("btnOpenAlbum")?.click();else if(v==="finance")document.getElementById("btnOpenFinance")?.click();else if(v==="orders"||v==="quests")document.getElementById("btnOpenQuests")?.click();else if(v==="barn")s.openWorkshopDialog("barn");else if(v==="seeds"){const y=c.get("sfilter");(y==="flowers"||y==="crops"||y==="all")&&(s.seedFilterMode=y),s.openSeedTray()}else if(v==="pasture")s.openPastureTray();else if(v==="seedquiz"){const y=c.get("crop")??void 0,w=c.get("lang")??void 0,P=c.get("tier")??void 0,F=c.get("qformat")??void 0,W=c.get("sqtab"),de=W==="codex"||W==="practice"?W:void 0;s.openSeedQuizDialog(y,null,w,P,F,de)}else if(v==="bakery"){const y=o.state.buildings.find(w=>w.itemId==="molly_apple_bakery");y&&(s.inspectSelection={kind:"building",uid:y.uid}),s.openWorkshopDialog("brew")}else if(v==="workshop"){const y=c.get("tab")??"barn";s.openWorkshopDialog(y)}else if(v==="suitcase"){const y=c.get("tab")??"care";s.openSuitcaseDialog(y)}else if(v==="match3"){const y=Number(c.get("m3level")||0),w=p?777:Math.min(777,(o.state.match3.maxClearedLevel??0)+1),P=Number.isFinite(y)&&y>=1?Math.min(w,Math.floor(y)):void 0,F=!!(p&&P&&P>(o.state.match3.maxClearedLevel??0)+1);s.openMatch3Dialog(P,F)}else if(v==="puzzle"||v==="caro"||v==="sudoku"||v==="chess"||v==="blocks"||v==="pikachu"||v==="onet"){const y=v==="puzzle"?c.get("pmode"):v,w=y==="pikachu"||y==="onet"?"blocks":y,P=w==="caro"||w==="sudoku"||w==="chess"||w==="blocks"?w:void 0;s.openPuzzleArcadeDialog(P)}else if(v==="neighbors"||v==="friends")s.openNeighborDialog();else if(v==="feast")s.openHarvestFeastDialog();else if(v==="leaderboard"){const y=c.get("lbgame"),w=y==="match3"||y==="caro"||y==="sudoku"||y==="chess"||y==="blocks"||y==="seedquiz"?y:void 0,P=c.get("lbscope"),F=P==="valley"||P==="friends"||P==="personal"?P:void 0;s.openLeaderboardDialog(w,F)}else if(!c.get("tour")&&!c.get("visit")&&!o.isHeadmasterPreview)try{const y=localStorage.getItem(fn);if(y){const w=JSON.parse(y),P=Date.now()-Number(w.savedAt||0),F=o.state.puzzleArcade;P>=0&&P<=12*3600*1e3?w.dialog==="puzzleArcade"&&w.mode==="sudoku"&&F.sudokuSession?.stage===F.sudokuStage?s.openPuzzleArcadeDialog("sudoku"):w.dialog==="puzzleArcade"&&w.mode==="caro"&&F.caroSession?.stage===F.caroStage?s.openPuzzleArcadeDialog("caro"):w.dialog==="puzzleArcade"&&w.mode==="chess"&&F.chessSession?.stage===F.chessStage?s.openPuzzleArcadeDialog("chess"):w.dialog==="puzzleArcade"&&w.mode==="blocks"&&F.onetSession?.stage===F.blockStage?s.openPuzzleArcadeDialog("blocks"):w.dialog==="match3"&&o.state.match3.activeSession?.levelId===o.state.match3.currentLevel?s.openMatch3Dialog():localStorage.removeItem(fn):localStorage.removeItem(fn)}}catch{}const L={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},C=y=>{const w=String(y||"").trim();if(!w){s.exitVisitFromHud();return}const P=L[w]||(w.startsWith("tour_")?w:"");P?s.enterHonorTourFromHud(P):w.startsWith("player_")||o.ensureNeighborSocial().neighbors.some(F=>F.id===w)?s.enterVisitFromHud(w):s.enterFlooMemberVisitFromHud(w)},f=c.get("tour")||c.get("visit");f&&C(f);const S=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(S.some(y=>c.has(y))){const y=new URLSearchParams(c);for(const F of S)y.delete(F);const w=y.toString(),P=`${window.location.pathname}${w?`?${w}`:""}${window.location.hash}`;window.history.replaceState(null,"",P)}o.isTutorialActive()&&!d&&s.panCameraToTutorialTarget(),He.bindSimulationGringottsWallet(o,{onSnapshot:y=>s.applyAuthoritativeSnapshot(y),onToast:(y,w)=>s.showToast(y,w??"🏦")}),He.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),s.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",y=>{s.applyAuthoritativeSnapshot(y.detail)}),window.addEventListener("hpvn:toast",y=>{const w=y.detail;w?.text&&s.showToast(String(w.text),"🔥")}),window.addEventListener("hpvn:tour-garden",y=>{const w=y.detail;C(String(w?.tourId??""))}),window.addEventListener("gamesave:updated",y=>{if(o.isHeadmasterPreview||o.isVisitingNeighbor)return;const w=y.detail,P=typeof w?.saveJson=="string"&&w.saveJson||(typeof localStorage<"u"?localStorage.getItem(qs):null);P&&(xs(o.state),o.importSaveJson(P)&&(He.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),s.match3Modal?.resetSession(),s.puzzleArcadeModal?.resetSession(),s.refreshAll(),wn.refresh(),s.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️")))}),window.addEventListener("hpvn:atmosphere",y=>{if(o.isVisitingNeighbor)return;const w=y.detail?.mode,P=w==="auto"?"realtime":w;(P==="realtime"||P==="dawn"||P==="day"||P==="dusk"||P==="night")&&(o.state.settings.timeOverride=P,o.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:weather",y=>{if(o.isVisitingNeighbor)return;const w=y.detail?.mode;(w==="auto"||w==="clear"||w==="cloudy"||w==="rain"||w==="storm"||w==="snow"||w==="fog"||w==="fireflies")&&(o.state.settings.weatherOverride=w,o.saveToStorage(),s.refreshAll())}),o.onTutorialStepChanged=()=>{s.panCameraToTutorialTarget()},o.onUiChange=()=>{s.refreshAll(),wn.refresh()},o.onToast=(y,w)=>{s.showToast(y,w),y.includes("Đạt Cấp")||y.includes("lên cấp")||y.includes("Lên Cấp")?zt("levelup"):zt("light"),Bs(y)},o.onBuildingTactile=y=>l.triggerSquash(y),o.onBuildingCompleted=y=>{l.triggerCompletionPop(y),l.triggerSquash(y)},o.onRibbonUnveiled=y=>{const w=ls(y.gx,y.gy,r,n.clientWidth,n.clientHeight,36);l.triggerRibbonUnveilPop(y.uid,w.sx,w.sy),s.showRibbonUnveilBanner(y),zt("levelup")},o.onRewardFly=(y,w,P,F)=>{if(typeof P=="number"&&typeof F=="number"){const W=ls(P,F,r,n.clientWidth,n.clientHeight,32);s.spawnFlyReward(y,w,W.sx,W.sy)}else s.spawnFlyReward(y,w)},o.onLevelUp=y=>{zt("levelup");const w=Di(y),P=w.unlockedItemIds.map(W=>re(W)?.name).filter(Boolean).slice(0,2).join(", "),F=P?` — Mở bản vẽ mới: ${P}!`:w.milestoneNote?` — ${w.milestoneNote}`:"";s.showToast(`🎉 Đạt Cấp Giải Đố ${y}! (+${w.rewardGalleons}🪙)${F}`,"🌟"),s.refreshAll()};const M=o.processOfflineProgress();M&&s.showOfflineModal(M);const A=y=>{const w=o.getActiveVisitingNeighbor();if(!w?.remoteUserId)return;const P=w.helpedMarksToday[w.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:w.remoteUserId,buildingUid:y,kind:P?.kind||"water_crop",noteText:P?.noteText||"Chúc vườn phép thuật bội thu!",helperName:o.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let H=null,O=!1,E=!1,D=!1,R=!1,j=!1,U=0,ce=0,ie=0,N=0,X=0,ae=0;const B=(y,w,P,F)=>{const W=s.activeSeedCropId;if(!W)return!1;let de=o.grid[w]?.[y]?.buildingUid??null;if(!de)for(let z=l.hotspots.length-1;z>=0;z--){const Y=l.hotspots[z];if(Y.kind==="building"&&Math.hypot(P-Y.sx,F-Y.sy)<=Y.radius){de=Y.id;break}}if(!de)return!1;const G=o.state.buildings.find(z=>z.uid===de);if(!G||G.cropId||Date.now()<G.constructEndsAt||!re(G.itemId)?.isFarmlandPlot)return!1;const he=o.plantCropOnPlot(G.uid,W);if(!he.ok){if(he.needSeedAcquire)return R=!1,O=!1,s.seedTrayOpen=!1,s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(W,G.uid),!1;const z=Date.now();return z-U>1200&&(U=z,s.showToast(he.msg,"🪙")),!1}return s.seedTrayOpen&&(s.seedTrayOpen=!1,s.renderSeedTray(),s.refreshFloatingBanner()),!0},V=(y,w,P,F)=>{const W=s.activePastureAnimalId;if(!W)return!1;let de=o.grid[w]?.[y]?.buildingUid??null;if(!de)for(let z=l.hotspots.length-1;z>=0;z--){const Y=l.hotspots[z];if(Y.kind==="building"&&Math.hypot(P-Y.sx,F-Y.sy)<=Y.radius){de=Y.id;break}}if(!de)return!1;const G=o.state.buildings.find(z=>z.uid===de);if(!G||G.pastureAnimalId||Date.now()<G.constructEndsAt||!re(G.itemId)?.isAnimalPasturePlot)return!1;const he=o.stockAnimalOnPasture(G.uid,W);if(!he.ok){const z=Date.now();return z-ce>1200&&(ce=z,s.showToast(he.msg,"🪙")),!1}return s.pastureTrayOpen&&(s.pastureTrayOpen=!1,s.renderPastureTray(),s.refreshFloatingBanner()),!0},Q=new Map;let ue=0,ne=!1,be=null;const ge=()=>{be&&(window.clearTimeout(be.timer),be=null)};s.onTouchConfirmPlace=()=>{if(!s.pendingTouchTile)return;const{gx:y,gy:w}=s.pendingTouchTile;if(s.moveModeActive&&s.movingBuildingUid){const P=o.moveBuilding(s.movingBuildingUid,y,w,s.rotation);if(!P.ok){s.showToast(P.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}if(s.selectedCatalogItem){const P=s.selectedCatalogItem,F=o.canPlaceItem(P,y,w,s.rotation);if(!F.ok){s.showToast(F.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(P,y,w,s.rotation),s.pendingTouchTile=null,Ts(P)||(s.selectedCatalogItem=null),s.refreshAll()}},s.onTouchCancelPlace=()=>{H=null};const te=new Set;window.addEventListener("keydown",y=>{if(document.querySelector("dialog[open]")){te.clear();return}y.target instanceof HTMLInputElement||y.target instanceof HTMLTextAreaElement||y.target instanceof HTMLSelectElement||y.target instanceof HTMLElement&&y.target.classList.contains("drag-handle")||te.add(y.key.toLowerCase())}),window.addEventListener("keyup",y=>{te.delete(y.key.toLowerCase())}),window.addEventListener("blur",()=>{te.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&te.clear()}),n.addEventListener("pointermove",y=>{Q.has(y.pointerId)&&Q.set(y.pointerId,{x:y.clientX,y:y.clientY});const w=n.getBoundingClientRect();if(Q.size>=2){ge(),D=!1,ne=!0;const oe=Array.from(Q.values()),he=Math.hypot(oe[1].x-oe[0].x,oe[1].y-oe[0].y),z=(oe[0].x+oe[1].x)*.5-w.left,Y=(oe[0].y+oe[1].y)*.5-w.top;if(ue>8&&he>8){const se=(z-w.width*.5)/r.zoom+r.x,I=(Y-w.height*.5)/r.zoom+r.y,ee=he/ue;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*ee)),r.x=se-(z-w.width*.5)/r.zoom,r.y=I-(Y-w.height*.5)/r.zoom}ue=he;return}const P=y.clientX-w.left,F=y.clientY-w.top;if(!o.isVisitingNeighbor&&!E&&!s.movingBuildingUid&&!s.pincerActive)for(const oe of l.hotspots)oe.kind==="bubble"&&Math.hypot(P-oe.sx,F-oe.sy)<=oe.radius&&o.harvestBuildingBubble(oe.id);const W=vn(P,F,r,w.width,w.height,o.grid);if(s.pendingTouchTile||(H={gx:W.gx,gy:W.gy}),!O)return;if(be&&Q.size===1&&Math.hypot(y.clientX-ie,y.clientY-N)>8){const oe=be;ge(),D=!0,o.placeItem(oe.item,oe.gx,oe.gy,oe.rot)}if(D&&s.selectedCatalogItem){o.placeItem(s.selectedCatalogItem,W.gx,W.gy,s.rotation);return}if(R&&s.activeSeedCropId){B(W.gx,W.gy,P,F);return}if(j&&s.activePastureAnimalId){V(W.gx,W.gy,P,F);return}const de=y.clientX-ie,G=y.clientY-N;Math.hypot(de,G)>5&&(E=!0,s.rideCamUid=null),E&&(u=null,r.x=X-de/r.zoom,r.y=ae-G/r.zoom)}),n.addEventListener("pointerdown",y=>{if(Q.set(y.pointerId,{x:y.clientX,y:y.clientY}),Q.size>=2){ge();const G=Array.from(Q.values());ue=Math.hypot(G[1].x-G[0].x,G[1].y-G[0].y),ne=!0,D=!1;return}if(y.button!==0&&y.button!==2)return;const w=n.getBoundingClientRect(),P=y.clientX-w.left,F=y.clientY-w.top,W=vn(P,F,r,w.width,w.height,o.grid);s.pendingTouchTile||(H={gx:W.gx,gy:W.gy}),O=!0,E=!1,ie=y.clientX,N=y.clientY,X=r.x,ae=r.y;const de=s.selectedCatalogItem;if(y.button===0&&de&&Dn(de)&&!s.hasOpenFloatingTray()){if(y.pointerType==="touch"){ge(),D=!1;const G=s.rotation;be={item:de,gx:W.gx,gy:W.gy,rot:G,timer:window.setTimeout(()=>{be=null,Q.size===1&&!ne&&O&&(D=!0,o.placeItem(de,W.gx,W.gy,G))},75)}}else D=!0,o.placeItem(de,W.gx,W.gy,s.rotation);R=!1,j=!1}else y.button===0&&s.activeSeedCropId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&B(W.gx,W.gy,P,F)?(D=!1,R=!0,j=!1):y.button===0&&s.activePastureAnimalId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&V(W.gx,W.gy,P,F)?(D=!1,R=!1,j=!0):(D=!1,R=!1,j=!1)});const Qe=y=>{Q.delete(y),Q.size<2&&(ue=0)};window.addEventListener("pointercancel",y=>{ge(),Qe(y.pointerId),O=!1,E=!1,D=!1,R=!1,j=!1,ne=!1}),window.addEventListener("pointerup",y=>{if(Qe(y.pointerId),ne){ge(),Q.size===0&&(ne=!1,O=!1,E=!1,R=!1,j=!1);return}if(!O)return;let w=!1;if(be&&!E&&y.target===n){const se=be;ge(),o.placeItem(se.item,se.gx,se.gy,se.rot),w=!0}else ge();const P=E,F=D||w||R||j;if(O=!1,E=!1,D=!1,R=!1,j=!1,P||F)return;if(y.button===2){s.selectedCatalogItem=null,s.bulldozerActive=!1,s.moveModeActive=!1,s.movingBuildingUid=null,s.pincerActive=!1,s.pincerPicked=null,s.closeSeedTray(),s.closePastureTray(),s.collapseBuildDock(),s.closeHudPopovers(),s.pendingTouchTile=null,s.inspectSelection=null,s.refreshAll();return}if(y.target!==n)return;const W=s.pendingSowPlotUid,de=s.pendingStockPastureUid;if(s.closeHudPopovers(),s.hasOpenFloatingTray()&&(s.hideOpenFloatingTrays(),s.selectedCatalogItem||s.moveModeActive||s.bulldozerActive||s.pincerActive)){s.refreshAll();return}const G=n.getBoundingClientRect(),oe=y.clientX-G.left,he=y.clientY-G.top,z=vn(oe,he,r,G.width,G.height,o.grid),Y=y.pointerType==="touch";if(s.pincerActive){const se=s.pincerPicked??(o.staff[0]?{kind:"staff",id:o.staff[0].id,label:o.staff[0].name}:null);se&&o.dropPickedEntity(se.kind,se.id,z.gx,z.gy),s.pincerPicked=null,s.pincerActive=!1,s.refreshAll();return}if(s.bulldozerActive){let se=z.gx,I=z.gy;const ee=o.grid[I]?.[se];if(!ee?.buildingUid&&(!ee||ee.path==="none")){for(const q of l.hotspots)if(q.kind==="building"&&Math.hypot(oe-q.sx,he-q.sy)<=q.radius){const Z=o.state.buildings.find(Me=>Me.uid===q.id);Z&&(se=Z.gx,I=Z.gy);break}}o.removeAtTile(se,I);return}if(s.moveModeActive){if(s.movingBuildingUid){if(Y&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==z.gx||s.pendingTouchTile.gy!==z.gy)){const q=o.state.buildings.find(Me=>Me.uid===s.movingBuildingUid),Z=q?re(q.itemId):void 0;H={gx:z.gx,gy:z.gy},s.pendingTouchTile={gx:z.gx,gy:z.gy,label:Z?.name??"Dời công trình"},s.refreshTouchConfirmBar();return}const ee=o.moveBuilding(s.movingBuildingUid,z.gx,z.gy,s.rotation);if(!ee.ok){s.showToast(ee.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}let I=o.grid[z.gy]?.[z.gx]?.buildingUid??null;if(!I){for(const ee of l.hotspots)if(ee.kind==="building"&&Math.hypot(oe-ee.sx,he-ee.sy)<=ee.radius){I=ee.id;break}}if(I){const ee=o.state.buildings.find(q=>q.uid===I);if(ee?.isIndestructible){s.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(ee){s.movingBuildingUid=ee.uid,s.rotation=ee.rotation,s.refreshFloatingBanner();const q=re(ee.itemId);s.showToast(`Đã nhấc "${q?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(s.selectedCatalogItem){const se=s.selectedCatalogItem;if(Y&&!Dn(se)&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==z.gx||s.pendingTouchTile.gy!==z.gy)){H={gx:z.gx,gy:z.gy},s.pendingTouchTile={gx:z.gx,gy:z.gy,label:se.name},s.refreshTouchConfirmBar();return}const I=o.canPlaceItem(se,z.gx,z.gy,s.rotation);if(!I.ok){s.showToast(I.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(se,z.gx,z.gy,s.rotation),s.pendingTouchTile=null,Ts(se)||(s.selectedCatalogItem=null),s.refreshAll();return}for(const se of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let I=null,ee=1/0;for(let q=l.hotspots.length-1;q>=0;q--){const Z=l.hotspots[q];if(Z.kind!==se)continue;const Me=Math.hypot(oe-Z.sx,he-Z.sy);if(Z.spriteKey&&typeof Z.boxLeft=="number"&&typeof Z.boxTop=="number"&&typeof Z.boxW=="number"&&typeof Z.boxH=="number"&&Z.boxW>2&&Z.boxH>2){const ln=oe>=Z.boxLeft&&oe<=Z.boxLeft+Z.boxW&&he>=Z.boxTop&&he<=Z.boxTop+Z.boxH,It=(oe-Z.boxLeft)/Z.boxW,_e=(he-Z.boxTop)/Z.boxH,ye=ln&&i.hitTestAlpha(Z.spriteKey,It,_e,!!Z.flipX),st=Z.kind==="building"&&Me<=Z.radius*.5;if(!ye&&!st)continue;if((I===null||Me<ee*.82)&&(I=Z,ee=Me,ye))break}else Me<=Z.radius&&Me<ee&&(ee=Me,I=Z)}if(I){if(I.kind==="owl_post"){const q=l.collectOwlPostParcel();q&&o.claimOwlPostDelivery(q.gx,q.gy),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="visitor_gift"){const q=o.claimVisitedNeighborMysteryGift();q.ok?l.notifyJuice("harvest",I.sx,I.sy):s.showToast(q.msg,"🎁"),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="neighbor_help"){l.triggerSquash(I.id);const q=o.helpVisitedNeighborBuilding(I.id);q.ok?(l.notifyJuice("harvest",I.sx,I.sy),A(I.id)):s.showToast(q.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="home_lantern"){const q=o.ensureNeighborSocial().homeLanternMarks.find(Me=>Me.id===I.id);q&&l.triggerSquash(q.buildingUid);const Z=o.claimHomeLanternMark(I.id);Z.ok?l.notifyJuice("harvest",I.sx,I.sy):s.showToast(Z.msg,"🏮"),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="unveil_building"){o.unveilBuilding(I.id),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="bubble"){o.harvestBuildingBubble(I.id),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="water_crop"){l.triggerSquash(I.id);const q=o.waterCropPlot(I.id);q.ok?l.notifyJuice("harvest",I.sx,I.sy):s.showToast(q.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="feed_pasture"){l.triggerSquash(I.id);const q=o.feedAnimalPasture(I.id);q.ok?l.notifyJuice("harvest",I.sx,I.sy):s.showToast(q.msg,"🌾"),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="escaped"){o.catchEscapedCreature(I.id),s.inspectSelection=null,s.refreshAll();return}if(I.kind==="zone_plaque"){s.closeSeedTray(),s.inspectSelection={kind:"zone",zoneId:I.id},s.refreshAll();return}if(I.kind==="villager"){o.greetVillager(I.id),s.refreshAll();return}if(I.kind==="building"){const q=o.state.buildings.find(Z=>Z.uid===I.id);if(q){if(!o.isVisitingNeighbor&&q.awaitingUnveil){o.unveilBuilding(q.uid),s.inspectSelection=null,s.refreshAll();return}const Z=re(q.itemId),Me=!!(!o.isVisitingNeighbor&&Z?.isFarmlandPlot&&q.cropId&&q.cropReadyAt&&Date.now()>=q.cropReadyAt),ln=!!(!o.isVisitingNeighbor&&Z?.isAnimalPasturePlot&&q.pastureAnimalId&&q.pastureReadyAt&&Date.now()>=q.pastureReadyAt);if(!Me&&!ln&&l.triggerSquash(I.id),o.isVisitingNeighbor){const ye=o.getVisitedBuildingHelpStatus(q);if(ye.canHelp){const st=o.helpVisitedNeighborBuilding(q.uid);st.ok?(l.notifyJuice("harvest",I.sx,I.sy),A(q.uid)):s.showToast(st.msg,"💧")}else if(ye.existingMark)s.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${ye.existingMark.noteText}”`,"🏮");else{const st=re(q.itemId),Yn=o.getActiveVisitingNeighbor();s.showToast(`🏡 Đang ngắm "${st?.name??"Công trình"}" (${q.stars}★) tại vườn ${Yn?.name??"bạn bè"}!`,Yn?.avatarEmoji??"🏡")}s.inspectSelection=null,s.refreshAll();return}const It=o.ensureNeighborSocial().homeLanternMarks.find(ye=>ye.buildingUid===q.uid);if(It&&o.claimHomeLanternMark(It.id).ok){l.notifyJuice("harvest",I.sx,I.sy),s.inspectSelection=null,s.refreshAll();return}if(q.itemId==="burrow_honeydukes_canon"){s.closeSeedTray(),s.inspectSelection=null,s.refreshAll(),s.openMatch3Dialog();return}const _e=re(q.itemId);if(_e?.isFarmlandPlot&&q.cropId&&q.cropReadyAt&&Date.now()>=q.cropReadyAt){o.harvestCropPlot(q.uid),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isFarmlandPlot&&q.cropId&&q.cropReadyAt&&Date.now()<q.cropReadyAt&&!q.cropWateredBoost){o.waterCropPlot(q.uid).ok&&l.notifyJuice("harvest",I.sx,I.sy),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isFarmlandPlot&&!q.cropId&&Date.now()>=q.constructEndsAt){if(s.activeSeedCropId){const ye=o.plantCropOnPlot(q.uid,s.activeSeedCropId);if(ye.needSeedAcquire){s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(s.activeSeedCropId,q.uid);return}s.showToast(ye.msg,ye.ok?"🌱":"🪙"),s.inspectSelection=null,s.refreshAll()}else W===q.uid?(s.inspectSelection=null,s.refreshAll()):s.openSeedTray(void 0,q.uid);return}else if(_e?.isAnimalPasturePlot&&q.pastureAnimalId&&q.pastureReadyAt&&Date.now()>=q.pastureReadyAt){o.harvestAnimalPasture(q.uid),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isAnimalPasturePlot&&q.pastureAnimalId&&q.pastureReadyAt&&Date.now()<q.pastureReadyAt&&!q.pastureFedBoost){o.feedAnimalPasture(q.uid).ok&&l.notifyJuice("harvest",I.sx,I.sy),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isAnimalPasturePlot&&!q.pastureAnimalId&&Date.now()>=q.constructEndsAt){if(s.activePastureAnimalId){const ye=o.stockAnimalOnPasture(q.uid,s.activePastureAnimalId);s.showToast(ye.msg,ye.ok?"🐾":"🪙"),s.inspectSelection=null,s.refreshAll()}else de===q.uid?(s.inspectSelection=null,s.refreshAll()):s.openPastureTray(void 0,q.uid);return}else(q.storedGalleons>0||q.readyFarmGoods&&q.readyFarmGoods.length>0)&&o.harvestBuildingBubble(q.uid)}s.closeSeedTray(),s.closePastureTray(),s.inspectSelection={kind:"building",uid:I.id},s.refreshAll();return}}}s.inspectSelection=null,s.refreshAll()}),n.addEventListener("contextmenu",y=>y.preventDefault()),n.addEventListener("wheel",y=>{y.preventDefault(),u=null;const w=n.getBoundingClientRect(),P=y.clientX-w.left,F=y.clientY-w.top,W=(P-w.width*.5)/r.zoom+r.x,de=(F-w.height*.5)/r.zoom+r.y,G=y.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*G)),r.x=W-(P-w.width*.5)/r.zoom,r.y=de-(F-w.height*.5)/r.zoom},{passive:!1});let le=performance.now(),fe=0;const _=new xa,ve=new Ro;xs(o.state);const we=document.createElement("div");we.id="gamepadRadialMenu",we.className="aaa-gamepad-radial",we.hidden=!0,we.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${Hs.map(y=>{const w=y.index*Math.PI*2/8,P=50+Math.cos(w)*37,F=50+Math.sin(w)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${y.index}" style="left:${P.toFixed(1)}%;top:${F.toFixed(1)}%;">${y.icon}<br/>${y.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(we);let Ce=null,Xe=!1;const Wn=y=>{switch(y){case"seeds":s.openSeedTray();break;case"barn":s.openWorkshopDialog("barn");break;case"orders":{s.activeQuestTab="orders",s.renderQuestDialog(),s.root.querySelector("#questDialog")?.showModal();break}case"match3":s.openMatch3Dialog();break;case"arcade":s.openPuzzleArcadeDialog();break;case"seedquiz":s.openSeedQuizDialog();break;case"neighbors":s.openNeighborDialog("friends");break;case"feast":s.openHarvestFeastDialog();break}},hi=fa(),fi=s.root.querySelector("#match3Dialog"),vi=s.root.querySelector("#puzzleArcadeDialog"),yi=s.root.querySelector("#seedQuizDialog"),an=Array.from(s.root.querySelectorAll("dialog"));let Ht=!1,mt=!1;const on=()=>{Ht=!!(fi?.open||vi?.open||yi?.open),mt=Ht||an.some(y=>y.open)};if(on(),typeof MutationObserver<"u"){const y=new MutationObserver(()=>{on()});for(const w of an)y.observe(w,{attributes:!0,attributeFilter:["open"]})}s.root.addEventListener("close",on,!0);let Ge=0,Qn=0;function rn(y){if(Ge=0,document.hidden){le=y;return}const w=(y-le)/1e3;if(le=y,!mt&&w>.002&&w<.5&&(ve.recordFrameFps(1/w),fe%90===0&&fe>0)){const z=ve.getHealthReport();hi?l.adaptiveDprCap=z.p5LowFps<46?1.15:z.p5LowFps<54?1.35:1.5:l.adaptiveDprCap=z.p5LowFps<46?1.25:z.p5LowFps<54?1.5:2}const P=_.poll();if(P.connected){if(P.panDx!==0||P.panDy!==0){u=null,s.rideCamUid=null;const z=380/r.zoom*Math.min(.05,w);r.x+=P.panDx*z,r.y+=P.panDy*z}if(P.radialOpen?(we.hidden=!1,Xe=!0,P.radialActionId&&(Ce=P.radialActionId),we.querySelectorAll("[data-radial-idx]").forEach(z=>{z.dataset.selected=String(Number(z.dataset.radialIdx)===P.radialSliceIndex)}),P.confirmJustPressed&&Ce&&(we.hidden=!0,Xe=!1,Wn(Ce),Ce=null)):Xe&&(we.hidden=!0,Xe=!1,Ce&&(Wn(Ce),Ce=null)),P.cancelJustPressed){const z=an.filter(Y=>Y.open);z.length>0?z[z.length-1]?.close():s.hasOpenFloatingTray()&&s.hideOpenFloatingTrays()}}if((te.has("w")||te.has("arrowup")||te.has("s")||te.has("arrowdown")||te.has("a")||te.has("arrowleft")||te.has("d")||te.has("arrowright"))&&(u=null),u){const z=Math.min(1,Math.max(0,(y-u.startMs)/u.durationMs)),Y=1-Math.pow(1-z,3);r.x=u.fromX+(u.toX-u.fromX)*Y,r.y=u.fromY+(u.toY-u.fromY)*Y,r.zoom=u.fromZoom+(u.toZoom-u.fromZoom)*Y,z>=1&&(u=null)}const F=340/r.zoom*Math.min(.05,w);if(te.size>0&&mt&&te.clear(),(te.has("w")||te.has("arrowup"))&&(s.rideCamUid=null,r.y-=F),(te.has("s")||te.has("arrowdown"))&&(s.rideCamUid=null,r.y+=F),(te.has("a")||te.has("arrowleft"))&&(s.rideCamUid=null,r.x-=F),(te.has("d")||te.has("arrowright"))&&(s.rideCamUid=null,r.x+=F),o.update(w),s.rideCamUid&&!Ht){const z=o.state.buildings.find(se=>se.uid===s.rideCamUid),Y=o.coasterCircuits.get(s.rideCamUid);if(Y&&Y.waypoints.length>=3){const se=ga(Y.waypoints,Y.isClosed,Date.now()/1e3,3);if(se.length>0){const I=se[0],ee=yn(I.gx+.5,I.gy+.5,r.viewRot??0),q=ee.wx,Z=ee.wy-(I.elev*ma+10);r.x+=(q-r.x)*Math.min(1,w*10),r.y+=(Z-r.y)*Math.min(1,w*10),r.zoom+=(1.38-r.zoom)*Math.min(1,w*5),s.rideCamSpeedText=`${I.speedKmh} km/h (${I.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,fe%8===0&&s.refreshFloatingBanner()}}else if(z){const se=Date.now()/1e3,I=z.gx+2+Math.cos(se*2.1)*1.4,ee=z.gy+2+Math.sin(se*2.1)*1.4,q=yn(I,ee,r.viewRot??0);r.x+=(q.wx-r.x)*Math.min(1,w*8),r.y+=(q.wy-22-r.y)*Math.min(1,w*8),r.zoom+=(1.35-r.zoom)*Math.min(1,w*5),s.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",fe%12===0&&s.refreshFloatingBanner()}else s.rideCamUid=null,s.refreshFloatingBanner()}const W=o.getRealTimePeriod(),de=o.getCurrentWeather(),G=yn(3,17,r.viewRot??0),oe=Math.hypot(r.x-G.wx,r.y-G.wy)<420;if(a.updateSoundscape(Math.min(.1,w),W==="night"||W==="dusk",r.zoom,oe,de.kind,o.getActiveFestival()!=="none"),!Ht&&(!mt||y-Qn>=80)){Qn=y;const z=s.pendingTouchTile?{gx:s.pendingTouchTile.gx,gy:s.pendingTouchTile.gy}:H;l.activeSeedBrushCropId=s.activeSeedCropId,l.activePastureBrushAnimalId=s.activePastureAnimalId,l.render(o,r,z,s.selectedCatalogItem,s.rotation,s.bulldozerActive,s.inspectSelection?.kind==="building"?s.inspectSelection.uid:null,s.movingBuildingUid,s.pincerPicked?.label??null),fe++,!mt&&fe%6===0&&!s.photoModeActive&&l.renderMinimap(s.minimapCanvas,o,r)}Ge=requestAnimationFrame(rn)}Ge=requestAnimationFrame(rn),document.addEventListener("visibilitychange",()=>{document.hidden?(Ge&&(cancelAnimationFrame(Ge),Ge=0),o.saveToStorage(),a.pause()):(le=performance.now(),a.resume(),Ge||(Ge=requestAnimationFrame(rn)))}),window.addEventListener("pagehide",()=>{o.saveToStorage()}),window.addEventListener("beforeunload",()=>{o.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{o.saveToStorage()});let Xn=0,Kn="";const Si=o.onUiChange;o.onUiChange=()=>{Si?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:o.state.level,galleons:o.state.galleons}}));const y=Date.now(),w=`${o.state.level}|${o.state.match3.stars}|${o.state.unlockedZones.length}|${o.state.buildings.length}|${o.state.settings.weatherOverride}|${o.state.settings.timeOverride}`;w!==Kn&&y-Xn>=1200&&(Kn=w,Xn=y,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:o.state.parkName,level:o.state.level,magicStars:o.state.match3.stars,galleons:o.state.galleons,unlockedZonesCount:o.state.unlockedZones.length,buildingsCount:o.state.buildings.length,weatherMode:o.state.settings.weatherOverride,atmosphereMode:o.state.settings.timeOverride==="realtime"?"auto":o.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",y=>{if(o.isVisitingNeighbor)return;const w=String(y.detail?.mode||"auto");(w==="auto"||w==="none"||w==="halloween"||w==="christmas"||w==="quidditch_cup")&&(o.state.settings.activeFestival=w,o.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:mute",y=>{const w=!!y.detail?.muted;o.state.settings.soundEnabled=!w,o.state.settings.bgmEnabled=!w,a.enabled=!w,a.bgmEnabled=!w,w?a.pause():a.resume(),o.saveToStorage(),s.refreshAll()}),window.addEventListener("gamesave:helpers",y=>{const w=y.detail;if(!w)return;const P=o.homeStateWhileVisiting??o.state,F=P===o.state?o.ensureNeighborSocial():P.neighborSocial??(P.neighborSocial=o.ensureNeighborSocial()),W=new Set(F.homeLanternMarks.map(Y=>Y.id)),de=P.buildings[0]?.uid||"burrow_main_gate",G=Date.now(),oe=900*1e3,he=3600*1e3;let z=0;for(const Y of w.helpers??[]){if(!Y?.id||W.has(Y.id)||F.homeLanternMarks.length>=5)continue;W.add(Y.id);const se=Y.buildingUid?P.buildings.find(ee=>ee.uid===Y.buildingUid):void 0,I=(se&&((se.cropReadyAt??0)>G||(se.pastureReadyAt??0)>G||(se.workshopQueue?.[0]?.endsAt??0)>G||(se.constructEndsAt??0)>G)?se:void 0)??P.buildings.find(ee=>(ee.cropReadyAt??0)>G||(ee.pastureReadyAt??0)>G||(ee.workshopQueue?.[0]?.endsAt??0)>G||(ee.constructEndsAt??0)>G);if(I)if((I.cropReadyAt??0)>G)I.cropReadyAt=Math.max(G,(I.cropReadyAt??G)-oe),I.cropWateredBoost=!0;else if((I.pastureReadyAt??0)>G)I.pastureReadyAt=Math.max(G,(I.pastureReadyAt??G)-oe);else if((I.workshopQueue?.[0]?.endsAt??0)>G)for(const ee of I.workshopQueue??[])ee.startedAt-=oe,ee.endsAt=Math.max(G,ee.endsAt-oe);else(I.constructEndsAt??0)>G+he&&(I.constructEndsAt=Math.max(G+he,(I.constructEndsAt??G)-oe));F.homeLanternMarks.push({id:Y.id,buildingUid:I?.uid||Y.buildingUid||de,helperId:Y.uid,helperName:Y.name||"Hàng Xóm Hang Sóc",helperEmoji:Y.avatarEmoji||"🧙‍♂️",kind:Y.kind||"water_crop",noteVi:Y.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:Y.at||G}),z++}z>0&&(o.saveToStorage(),s.refreshAll(),w.summaryVi&&s.showToast(w.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",y=>{const w=y.detail;if(!w)return;const P=o.homeStateWhileVisiting??o.state,F=P===o.state?o.ensureNeighborSocial():P.neighborSocial??(P.neighborSocial=o.ensureNeighborSocial());typeof w.dayKey=="string"&&w.dayKey&&(F.lastSocialResetKey=w.dayKey),typeof w.dailyGardenHelpsCount=="number"&&w.dailyGardenHelpsCount>(F.dailyGardenHelpsCount??0)&&(F.dailyGardenHelpsCount=w.dailyGardenHelpsCount)})}zo().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(n.map(a=>a.unregister()))}if("caches"in window){const n=await caches.keys().catch(()=>[]);await Promise.all(n.map(a=>caches.delete(a)))}window.location.reload()}))});export{bs as M,Tn as c,Re as s};
