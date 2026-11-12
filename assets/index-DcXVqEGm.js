const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-BZdAOK74.js","assets/game-data-LHOZhbEq.js","assets/sim-CY-59B_l.js","assets/engine-BJ-09slw.js","assets/puzzleArcadeModal-BWTcXiCM.js"])))=>i.map(i=>d[i]);
var Si=Object.defineProperty;var wi=(e,t,n)=>t in e?Si(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var x=(e,t,n)=>wi(e,typeof t!="symbol"?t+"":t,n);import{F as Se,af as cn,ag as xi,b as ht,w as xe,ah as Ti,g as ae,ai as Mt,aj as Jn,Q as dn,G as Dt,ae as Pe,P as et,q as Xt,ak as $s,M as Ue,o as Re,al as ks,m as $i,Z as Nn,p as ki,u as Ci,j as rt,s as Ne,$ as Lt,A as Oe,r as wt,E as Mi,I as Li,N as Cs,R as Ms,y as Ai,D as Vt,U as qi,H as ft,am as kt,S as Ei,an as Pi,W as Ls,X as As,k as Ot,C as pn,_ as un,z as es,B as Hi,V as Ii,T as Kt,a2 as Bi}from"./game-data-LHOZhbEq.js";import{i as gt,j as Rn,k as Di,A as vt,n as Oi,l as it,m as ts,o as ns,H as lt,L as gn,p as ss,q as yt,t as is,u as Le,v as Ni,w as Ri,x as as,y as mn,z as me,B as xt,C as Tt,D as zi,F as St,M as Nt,G as Fi,I as Vi,J as Gi,K as kn,P as os,N as _i,O as Ui,Q as ji,R as rs,S as ls,U as at,V as Wi,W as qs,X as Qi,Y as Xi,Z as Gt,_ as Ki,$ as Yi,a0 as Zi,a1 as Es,a2 as Ye,a3 as Ie,a4 as Ji,a5 as _t,a6 as ea,a7 as ta,a8 as Ze,a9 as $t,aa as At,d as na,ab as bn,ac as hn,ad as sa,ae as ia,af as aa,ag as oa,ah as ra,ai as la,aj as fn,g as cs,ak as vn,s as ca,al as yn,E as da}from"./sim-CY-59B_l.js";import{S as pa,I as ua,i as ga}from"./engine-BJ-09slw.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const Rt={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function ma(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const n=t.documentElement;n.setAttribute("data-colorblind",e.colorblindMode),n.setAttribute("data-font-scale",String(e.fontScale)),n.setAttribute("data-high-contrast",e.highContrast?"true":"false"),n.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function ba(e,t){t.ceiling.setAllVolumes(e.volumes)}const Ps=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],ha=.18;function zt(e,t=ha){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const n=e<0?-1:1,a=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((n*Math.min(1,a)).toFixed(3))}function fa(e,t){if(Math.hypot(e,t)<.35)return null;let a=Math.atan2(t,e);a<0&&(a+=Math.PI*2);const i=Math.PI*2/8,o=(a+i*.5)%(Math.PI*2);return Math.floor(o/i)%8}class va{constructor(){x(this,"prevConfirm",!1);x(this,"prevCancel",!1);x(this,"prevDpadUp",!1);x(this,"prevDpadDown",!1);x(this,"prevDpadLeft",!1);x(this,"prevDpadRight",!1)}poll(t){let n=t??null;if(!n&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const k=navigator.getGamepads();for(const v of k)if(v&&v.connected){n=v;break}}if(!n)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const a=zt(n.axes[0]??0),i=zt(n.axes[1]??0),o=zt(n.axes[2]??0),r=zt(n.axes[3]??0),c=!!n.buttons[0]?.pressed,s=!!n.buttons[1]?.pressed,l=!!n.buttons[4]?.pressed,d=!!n.buttons[12]?.pressed,u=!!n.buttons[13]?.pressed,p=!!n.buttons[14]?.pressed,m=!!n.buttons[15]?.pressed,g=c&&!this.prevConfirm,b=s&&!this.prevCancel,w=(m&&!this.prevDpadRight?1:0)-(p&&!this.prevDpadLeft?1:0),$=(u&&!this.prevDpadDown?1:0)-(d&&!this.prevDpadUp?1:0);this.prevConfirm=c,this.prevCancel=s,this.prevDpadUp=d,this.prevDpadDown=u,this.prevDpadLeft=p,this.prevDpadRight=m;const C=l,h=C?fa(Math.abs(o)>0?o:a,Math.abs(r)>0?r:i):null,A=h!==null?Ps[h]?.actionId??null:null;return{connected:!0,panDx:C?0:a,panDy:C?0:i,cursorStepGx:w,cursorStepGy:$,radialOpen:C,radialSliceIndex:h,radialActionId:A,confirmJustPressed:g,cancelJustPressed:b}}}let Hs=null,Ee=null,ke=null,Sn=null;function Is(e){!ke&&typeof document<"u"&&(ke=document.getElementById("a11y-announcer")),!(!ke||!e)&&(ke.textContent="",requestAnimationFrame(()=>{ke&&(ke.textContent=e)}))}function ya(e){const t=e.state.buildings.find(a=>a.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const n=Date.now();if(t.constructEndsAt>n)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-n)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const a=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-n)/1e3)),i=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${a} giây, tổng ${i} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function Cn(e){const t=e??Hs;if(!t||(!Ee&&typeof document<"u"&&(Ee=document.getElementById("a11y-farm-status")),!Ee))return;const n=t.state,a=n.level,i=n.galleons.toLocaleString("vi-VN"),o=n.sandboxMode?"Vô hạn":String(n.match3?.stars??0),r=n.timeSand,c=n.farmBarn?.owlOrders??[],s=c.filter(u=>t.canFulfillFarmOwlOrder(u)).length,l=`${c.length} đơn hàng (${s} đơn đủ nông sản sẵn sàng giao)`,d=ya(t);Ee.innerHTML=`
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
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${l}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${d}</td></tr>
      </tbody>
    </table>
  `.trim()}function Sa(e){Hs=e,!(typeof document>"u")&&(ke||(ke=document.getElementById("a11y-announcer"),ke||(ke=document.createElement("div"),ke.id="a11y-announcer",ke.className="visually-hidden",ke.setAttribute("aria-live","polite"),ke.setAttribute("aria-atomic","true"),document.body.appendChild(ke))),Ee||(Ee=document.getElementById("a11y-farm-status"),Ee||(Ee=document.createElement("div"),Ee.id="a11y-farm-status",Ee.className="visually-hidden",Ee.setAttribute("role","region"),Ee.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(Ee))),Cn(e),Sn&&clearInterval(Sn),Sn=setInterval(()=>{Cn()},5e3))}const wn={init:Sa,announce:Is,refresh:()=>Cn()},wa="hpvn-burrow-garden",xa=new Set(["auto","dawn","day","dusk","night"]),Ta=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),ds=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function qt(e,t){const n=typeof e=="string"?e.trim():"";if(!n||n==="null")return!1;if(typeof window<"u"&&window.location?.origin&&n===window.location.origin)return!0;const a=t&&t.length>0?[...ds,...t]:ds;for(const i of a)if(typeof i=="string"){if(i===n)return!0}else if(i.test(n))return!0;return!1}function $a(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const n=new URL(document.referrer).origin;if(qt(n,t))return n}catch{}return null}function ps(e){const t=String(e||"day").toLowerCase();return xa.has(t)?t:"day"}function us(e){const t=String(e||"clear").toLowerCase();return Ta.has(t)?t:"clear"}function Bs(e={}){const t=e.parkName||"Trang Trại Hang Sóc",n=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",a=Math.max(1,Math.floor(Number(e.level)||1)),i=Math.max(0,Math.floor(Number(e.magicStars)||0)),o=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),c=e.house?` · Nhà ${e.house}`:"",s=e.keeperTitle?` · [${e.keeperTitle}]`:"",l={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},d=e.weatherMode&&l[e.weatherMode]?` (${l[e.weatherMode]})`:"";return`🏰 [${t}${n} · Cấp ${a}${c}${s}]${d} — ${o}/10 vùng mở khóa, ${r} công trình & ${i} 🌟 Sao Phép Thuật!`}function ka(e={}){const t=[],n=e.win??(typeof window<"u"?window:void 0),a=e.nav??(typeof navigator<"u"?navigator:void 0);let i=$a(e.targetOrigin,e.allowedOrigins);function o(s,l={}){const d={source:wa,version:"25.1",type:s,payload:l,sentAt:Date.now()};t.push(d),t.length>24&&t.shift();try{const u=n?.parent;if(u&&u!==n&&typeof u.postMessage=="function"){const p=e.targetOrigin||i||"*";u.postMessage(d,p)}}catch{}return d}function r(s){const l=s;if(l.source!=null&&n?.parent!=null&&l.source!==n.parent)return;if(!e.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!qt(l.origin,e.allowedOrigins))return;i=l.origin}const d=l?.data;if(!d||typeof d!="object")return;const u=d.payload&&typeof d.payload=="object"?d.payload:{};if(d.type==="hpvn:burrow:set-atmosphere"||d.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(ps(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-weather"||d.type==="hpvn:host:set-weather")e.onWeatherChange?.(us(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-event"||d.type==="hpvn:host:set-event")e.onEventChange?.(String(u.mode??d.mode??"auto"));else if(d.type==="hpvn:burrow:tour-garden"||d.type==="hpvn:host:tour-garden"){const p=u.tourId??d.tourId??null;p?e.onStartTour?.(String(p)):e.onStopTour?.()}else if(d.type==="hpvn:burrow:mute"||d.type==="hpvn:host:mute")e.onMuteChange?.(!!(u.muted??d.muted));else if(d.type==="hpvn:burrow:request-snapshot"||d.type==="hpvn:host:request-snapshot"){const p=e.getSnapshot?e.getSnapshot():{};o("hpvn:burrow:snapshot",p)}}n&&typeof n.addEventListener=="function"&&n.addEventListener("message",r);async function c(s={}){const l=Bs(s),d=o("hpvn:burrow:share-floo",{text:l,level:s.level??1,parkName:s.parkName??"Trang Trại Hang Sóc",...s.playerName?{playerName:s.playerName}:{},...s.tourId?{tourId:s.tourId}:{},...s.image?{image:s.image}:{},atmosphereMode:ps(s.atmosphereMode),weatherMode:us(s.weatherMode),eventMode:s.eventMode??"auto"});if(typeof s.sendToFloo=="function"&&await s.sendToFloo(l,s)===!0)return e.notify?.(s.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:l,copied:!1,floo:!0,envelope:d};let u=!1;try{a?.clipboard?.writeText&&(await a.clipboard.writeText(l),u=!0)}catch{u=!1}return e.notify?.(u?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${l}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${l}"`),{ok:!0,text:l,copied:u,envelope:d}}return{notifyReady:(s={})=>o("hpvn:burrow:ready",s),syncState:(s={})=>o("hpvn:burrow:state",s),shareToFloo:c,shareGardenToFloo:c,history:()=>[...t],destroy:()=>{n&&typeof n.removeEventListener=="function"&&n.removeEventListener("message",r)}}}function Mn(e,t={},n){const o=n??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});o.width=640,o.height=380;const r=o.getContext("2d");if(!r)return o;const c=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),s=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),l=Math.max(1,Math.floor(Number(t.level)||1)),d=t.house||"Gryffindor",u=Math.max(0,Math.floor(Number(t.magicStars)||0)),p=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),m=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const b={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(b,614,31),r.textAlign="left";const w=18,$=50,C=604,h=248;r.save(),r.beginPath(),r.rect(w,$,C,h),r.clip();let A=!1;if(e&&e.width>0&&e.height>0)try{const Y=e.width/e.height,de=C/h;let re=0,D=0,X=e.width,le=e.height;Y>de?(X=Math.round(e.height*de),re=Math.round((e.width-X)/2)):(le=Math.round(e.width/de),D=Math.round((e.height-le)/2)),r.drawImage(e,re,D,X,le,w,$,C,h),A=!0}catch{A=!1}if(!A){const Y=r.createLinearGradient(w,$,w,$+h);Y.addColorStop(0,"#365843"),Y.addColorStop(.55,"#598249"),Y.addColorStop(1,"#334d2c"),r.fillStyle=Y,r.fillRect(w,$,C,h)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(w,$,C,h);const k=18,v=304,S=604,M=58;r.fillStyle="#f6ebd2",r.fillRect(k,v,S,M),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(k,v,S,M);const O={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[d]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${O} ${c} · Cấp ${l}`,k+14,v+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const R=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${s} · Nhà ${d}${R} · ${m}/10 vùng · ${p} công trình · ${u} 🌟`,k+14,v+42);const q=142,B=34,N=k+S-q-12,W=v+12;return r.fillStyle="#1d5c4b",r.fillRect(N,W,q,B),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(N,W,q,B),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",N+q/2,W+B/2+1),r.textAlign="left",o}function Ds(e,t=.55){try{const n=e.toDataURL("image/webp",t);if(typeof n=="string"&&n.startsWith("data:image/webp"))return n;const a=e.toDataURL("image/png");return typeof a=="string"?a:""}catch{return""}}const Ca={};function ze(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),n=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^n&15>>t/4).toString(16)})}function Os(e,t){const n=Math.max(1,Math.floor(Number(t)||1)),a=e.effectivePrice??e.price,i=e.dailyRemaining??e.dailyLimit;let o=0;for(let r=0;r<n;r++)r<i?o+=a:e.overflowMultiplier&&e.overflowMultiplier>1?o+=Math.ceil(a*e.overflowMultiplier):o+=a;return o}const Ma=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function Yt(e,t={}){const n=e&&typeof e=="object"?e:{},a=n.details&&typeof n.details=="object"?n.details:{},i=String(n.reason||a.reason||"unknown-error"),o={...Ma,...t.labels||{}};switch(i){case"missing-crops":{const r=Array.isArray(a.missing)?a.missing:[];if(r.length>0){const c=r.map(s=>{const l=String(s.resource||"");return`${Math.max(1,Number(s.required||0)-Number(s.have||0))} ${o[l]||l}`});return{reason:i,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${c.join(" · ")}`}}return{reason:i,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof a.shortBy=="number"?a.shortBy:typeof a.required=="number"&&typeof a.spendable=="number"?Math.max(1,a.required-a.spendable):null;return{reason:i,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(a.required||0),c=Number(a.have||0),s=Math.max(1,r-c);return{reason:i,icon:"🌟",text:`Thiếu ${s} Sao Phép Thuật`}}case"missing-supply":{const r=String(a.resource||"");if(r.startsWith("seeds.")){const c=r.slice(6);return{reason:i,icon:"🌱",item:c,text:`Thiếu hạt ${o[c]||c}`}}return{reason:i,icon:"💧",item:r,text:`Thiếu ${o[r]||"vật tư"}`}}case"wallet-frozen":return{reason:i,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:i,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:i,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:i,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:i,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:i,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:i,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:i,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:i,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:i,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:i,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:i,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:i,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:i,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:i,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(i==="model-rejected"&&typeof a.modelCode=="string"&&t.modelText){const r=t.modelText(a.modelCode);if(r)return{reason:i,icon:"🪄",text:r}}return{reason:i,icon:"🪄",text:n.message||"Máy chủ từ chối thao tác"}}}}function Ht(e){let t=null,n=null,a=Promise.resolve();const i=s=>{const l=a.then(s,s);return a=l.catch(()=>{}),l};async function o(s,l){const d=t?.catalogHash,u=d?{...l,catalogHash:d}:l,p=await e(s,u);if(!p||typeof p!="object"||!("garden"in p))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const m=p;return m.catalog===void 0&&d&&m.catalogHash===d&&(m.catalog=t?.catalog),t?.saleAdmin&&m.saleAdmin===void 0&&(m.saleAdmin=!0),t=m,t}async function r(s,l){const d=JSON.stringify({name:s,payload:l});if(n&&n.signature!==d)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");n||(n={signature:d,data:{...l,requestId:ze()}});try{const u=await o(s,n.data);return n=null,u}catch(u){throw u?.definitive===!0&&(n=null),u}}const c=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return n!==null},read:()=>i(()=>o("getBurrowGarden",{})),act:s=>i(()=>r("performBurrowAction",{...s,expectedRevision:c()})),free:(s,l={})=>i(()=>o("performBurrowAction",{...l,action:"freeAction",kind:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),guide:s=>i(()=>o("performBurrowAction",{action:"guideDone",lessonId:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),scene:s=>i(()=>o("performBurrowAction",{action:"setScene",scene:s,expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),syncProfile:s=>i(()=>o("performBurrowAction",{...s,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:ze()})),visit:(s={})=>i(()=>e("visitBurrowGarden",s)),frame:s=>i(async()=>{const l=await e("setBurrowFlooFrame",{frameKey:s});return t&&Array.isArray(l.frames)&&typeof l.worn=="string"&&(t={...t,flooFrames:{frames:l.frames,worn:l.worn}}),l}),sales:(s={mode:"get"})=>i(()=>e("manageBurrowSales",s)),fireOut:s=>i(()=>e("extinguishBurrowGarden",{...s,requestId:ze()})),sell:(s,l)=>i(()=>r("sellBurrowGoods",s?{items:s,expectedTotal:l}:{clearance:!0,expectedTotal:l})),buy:(s,l=1)=>i(()=>{const d=t?.catalog?.find(u=>u.id===s);if(!d)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:s,quantity:l,catalogVersion:t?.catalogVersion,expectedTotal:Os(d,l)})}),settleWallet:s=>i(()=>o("settleBurrowWallet",{direction:s.direction,amount:Math.max(1,Math.floor(s.amount)),...s.reasonCode?{reasonCode:s.reasonCode}:{},...s.sourceType?{sourceType:s.sourceType}:{},...typeof s.clientLevel=="number"?{clientLevel:Math.floor(s.clientLevel)}:{},requestId:typeof s.requestId=="string"&&s.requestId?s.requestId:ze()})),houseCup:()=>i(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(s,l)=>i(()=>e("contributeBurrowHouseCup",{points:s,...l?{house:l}:{}})),postCoop:s=>i(()=>e("postBurrowCoopRequest",{...s,requestId:typeof s.requestId=="string"?s.requestId:ze()})),fulfillCoop:s=>i(()=>e("fulfillBurrowCoopRequest",s)),listCoop:s=>i(()=>e("getBurrowCoopRequests",s?{hostUid:s}:{}))}}const Ve="hpvn-burrow-game";function zn(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const n=new URLSearchParams(t);return n.get("burrow-ticket")??n.get("hpvn-ticket")}function Ns(e,t=window,n={}){let a=0;const i=new Map;let o=n.targetOrigin&&n.targetOrigin!=="*"?n.targetOrigin:null;if(!o&&typeof document<"u"&&document.referrer)try{const c=new URL(document.referrer).origin;qt(c,n.allowedOrigins)&&(o=c)}catch{}t.addEventListener("message",c=>{if(!n.allowAnyOrigin&&typeof c.origin=="string"&&c.origin.length>0){if(!qt(c.origin,n.allowedOrigins))return;o=c.origin}const s=c.data;if(c.source!==t.parent||!s||s.channel!==Ve||s.nonce!==e||typeof s.id!="string"||!i.has(s.id))return;const l=i.get(s.id);i.delete(s.id),l(s)});const r=Ht((c,s)=>new Promise((l,d)=>{const u=`burrow-${++a}`,p=setTimeout(()=>{i.delete(u),d(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);i.set(u,m=>{if(clearTimeout(p),"result"in m&&m.result&&typeof m.result=="object"){l(m.result);return}const g=new Error(typeof m.error=="string"?m.error:"Máy chủ từ chối thao tác.");g.definitive=m.definitive===!0,g.reason=typeof m.reason=="string"?m.reason:void 0,g.details=m.details&&typeof m.details=="object"?m.details:{},d(g)}),t.parent.postMessage({channel:Ve,nonce:e,id:u,action:"burrow",name:c,data:s},n.targetOrigin||o||"*")}));return r.host=(c,s={})=>new Promise(l=>{const d=`host-${++a}`,u=setTimeout(()=>{i.delete(d),l(null)},5e3);i.set(d,p=>{clearTimeout(u),l(p.result??null)}),t.parent.postMessage({...s,channel:Ve,nonce:e,id:d,action:c},n.targetOrigin||o||"*")}),r}function Rs(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),n=e.sessionEndpoint??"/api/auth/session",a=e.fetchImpl??globalThis.fetch.bind(globalThis),i=e.getUid??gt,o=e.timeoutMs??18e3;let r=null,c=0;async function s(l){if(r&&Date.now()+3e4<c)return r;try{const d=typeof window<"u"?window:void 0,u=d?.__HPVN_CONFIG__?.getIdToken??d?.__HPVN_GET_ID_TOKEN__,p=u?await u().catch(()=>null):null,m=typeof window<"u"?zn(window.location):null,g=await a(n,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":l,...p?{Authorization:`Bearer ${p}`}:{}},body:JSON.stringify({uid:l,...p?{idToken:p}:{},...m?{ticket:m}:{}})});if(!g.ok)return null;const b=await g.json();if(typeof b.uid=="string"&&b.uid&&!e.getUid&&Rn(b.uid),typeof b.token=="string"&&b.token)return r=b.token,c=Number(b.expiresAt||Date.now()+36e5),r}catch{}return null}return Ht(async(l,d)=>{const u=i(),p=await s(u),m=new AbortController,g=setTimeout(()=>m.abort(),o);let b;try{const $={"Content-Type":"application/json","X-User-Id":u};p&&($.Authorization=`Bearer ${p}`),b=await a(`${t}${l}`,{method:"POST",headers:$,body:JSON.stringify({data:d}),signal:m.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(g)}const w=await b.json();if(w.error||!b.ok){const $=new Error(w.error?.message||`Máy chủ từ chối thao tác (${b.status}).`);throw $.definitive=b.status<500,$.reason=typeof w.error?.details?.reason=="string"?w.error.details.reason:void 0,$.details=w.error?.details??{},$}return w.result??{}})}const zs="asia-southeast1",tn="demo-hpvnn-burrow",La="hpvnn-archive";function Be(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function gs(e){const t=new TextEncoder().encode(e);let n="";for(let a=0;a<t.length;a++)n+=String.fromCharCode(t[a]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Fs(e,t=tn,n=globalThis.location,a=Date.now()){const i=n?.hostname??"127.0.0.1";if(!Be(i))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const o=Math.floor(a/1e3),r=gs(JSON.stringify({alg:"none",typ:"JWT"})),c=gs(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:o,user_id:e,sub:e,iat:o,exp:o+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${c}.`}function Vs(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!Be(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const n=e.host??(t?.hostname||"127.0.0.1");if(!Be(n))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const a=e.projectId||tn,i=e.region||zs,o=e.port||5001,c=`${e.useSameOriginRewrite?"":`http://${n}:${o}`}/${a}/${i}/`,s=e.fetchImpl??globalThis.fetch.bind(globalThis),l=e.getUid??(()=>e.uid||gt()),d=e.now??(()=>Date.now()),u=e.timeoutMs??18e3;return Ht(async(p,m)=>{const g=l(),b=Fs(g,a,{hostname:n},d()),w=new AbortController,$=setTimeout(()=>w.abort(),u);let C;try{C=await s(`${c}${p}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`},body:JSON.stringify({data:m}),signal:w.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout($)}const h=await C.json();if(h.error||!C.ok){const A=new Error(h.error?.message||`Emulator từ chối thao tác (${C.status}).`);throw A.definitive=C.status<500,A.reason=typeof h.error?.details?.reason=="string"?h.error.details.reason:void 0,A.details=h.error?.details??{},A}return h.result??{}})}function Gs(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),n=e.fetchImpl??globalThis.fetch.bind(globalThis),a=e.timeoutMs??2e4;return Ht(async(i,o)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,c=e.getIdToken?await e.getIdToken():r?await r():null,s=new AbortController,l=setTimeout(()=>s.abort(),a);let d;try{const p={"Content-Type":"application/json"};c?p.Authorization=`Bearer ${c}`:p["X-User-Id"]=gt(),d=await n(`${t}${i}`,{method:"POST",headers:p,body:JSON.stringify({data:o}),signal:s.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(l)}const u=await d.json();if(u.error||!d.ok){const p=new Error(u.error?.message||`Cloud Functions từ chối thao tác (${d.status}).`);throw p.definitive=d.status<500,p.reason=typeof u.error?.details?.reason=="string"?u.error.details.reason:void 0,p.details=u.error?.details??{},p}return u.result??{}})}function Aa(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const n=async a=>{const i=a;if(!e.allowAnyOrigin&&typeof i.origin=="string"&&i.origin.length>0&&!qt(i.origin,e.allowedOrigins))return;const o=i.data;if(!o||o.channel!==Ve||o.nonce!==e.nonce||typeof o.id!="string"||e.expectedSource&&i.source!==e.expectedSource)return;const r=i.source;if(!r||typeof r.postMessage!="function")return;const c=typeof i.origin=="string"&&i.origin.length>0&&i.origin!=="null"?i.origin:"*",s=o.id,l=String(o.action||"");if(l==="burrow"||l==="garden"){const d=String(o.name||""),u=o.data&&typeof o.data=="object"?o.data:{};try{const p=await e.transport(d,u);r.postMessage({channel:Ve,nonce:e.nonce,id:s,result:p},c)}catch(p){const m=p;r.postMessage({channel:Ve,nonce:e.nonce,id:s,error:m?.message||"Máy chủ từ chối thao tác.",definitive:m?.definitive===!0,reason:m?.reason,details:m?.details??{}},c)}return}try{const d=e.onHostAction?await e.onHostAction(l,o):{ok:!0};r.postMessage({channel:Ve,nonce:e.nonce,id:s,result:d},c)}catch(d){r.postMessage({channel:Ve,nonce:e.nonce,id:s,error:d instanceof Error?d.message:"Lỗi xử lý lệnh host.",definitive:!0},c)}};return t.addEventListener("message",n),()=>{t.removeEventListener("message",n)}}function mt(){if(typeof window<"u"){const e=zn(window.location);if(e)return Ns(e,window);const t=new URLSearchParams(window.location.search),n=t.get("emulator"),a=t.get("functionsPort");if((n==="1"||a)&&Be(window.location.hostname)){const c=Number(a||5001)||5001,s=t.get("project")||tn,l=t.get("uid")||void 0;return Vs({projectId:s,port:c,uid:l,useSameOriginRewrite:n==="vite"})}const i=window.__HPVN_CONFIG__,o=Ca?.VITE_HPVN_FUNCTIONS_URL,r=i?.functionsBaseUrl||o;if(r)return Gs({functionsBaseUrl:r,getIdToken:i?.getIdToken})}return Rs()}let ms=Promise.resolve();async function qa(e,t){const n=typeof navigator<"u"?navigator:void 0,a=n&&"locks"in n?n.locks:void 0;if(a&&typeof a.request=="function")return a.request(e,async()=>t());const i=ms.then(t,t);return ms=i.catch(()=>{}),i}function Ea(e){const t=`${e.scope}-save-envelope`,n=e.persistent!==!1,a=e.storage??globalThis.localStorage,i=e.legacyKeys??[];let o={},r=null;function c(){if(r)return r;if(!n||!a)return o;const l=a.getItem(t);if(l!==null){const u=JSON.parse(l);if(!u||typeof u!="object"||Array.isArray(u))throw new Error("Bản lưu thung lũng không hợp lệ.");return u}const d={};for(const u of i){const p=a.getItem(u);p!==null&&(d[u]=p)}return d}function s(l){n&&a?a.setItem(t,JSON.stringify(l)):o=l}return{storageKey:t,getItem(l){return c()[l]??null},setItem(l,d){r?r[l]=String(d):s({...c(),[l]:String(d)})},transaction(l){if(r)return l();r={...c()};try{const d=l();return s(r),d}finally{r=null}}}}async function Pa(e=mt()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const n=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(n.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(n.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(n.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(n.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function Ha(e,t,n=mt()){const a=await n.contributeHouseCup(e,t);if(!a||typeof a!="object")return null;const i=a.totals&&typeof a.totals=="object"?a.totals:{};return{weekKey:String(a.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(i.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(i.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(i.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(i.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(a.playerContribution)||0)),updatedAt:Number(a.updatedAt)||Date.now()}}async function Ia(e,t=mt()){return t.postCoop(e)}async function Ba(e,t=mt()){return t.fulfillCoop(e)}const Da=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:Ve,HPVN_DEFAULT_EMULATOR_PROJECT:tn,HPVN_FIREBASE_REGION:zs,HPVN_PROD_FIREBASE_PROJECT:La,attachHpvnParentShellResponder:Aa,computeClientPackTotal:Os,contributeWeeklyHouseCupOnline:Ha,createAtomicGardenStorage:Ea,createAutoAuthoritativeClient:mt,createBurrowGardenClient:Ht,createEmulatorFixtureToken:Fs,createFirebaseEmulatorClient:Vs,createFirebaseFunctionsClient:Gs,createHpvnEmbedClient:Ns,createHttpAuthoritativeClient:Rs,fetchWeeklyHouseCupStandingsOnline:Pa,formatServerRefusalVi:Yt,fulfillCoopAssistanceOnline:Ba,generateRequestId:ze,getHpvnTicketFromLocation:zn,isLocalDevelopmentHost:Be,postCoopAssistanceOnline:Ia,runWithStorageLock:qa},Symbol.toStringTag,{value:"Module"})),Oa={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function Ft(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const t=navigator.userActivation;if(t&&!t.hasBeenActive)return!1;try{const n=Oa[e]??15;return navigator.vibrate(n)}catch{return!1}}function Q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function bs(e){const t=lt[e]??lt.Gryffindor;return{emoji:t.mascotEmoji,label:t.house,cls:`house-${t.cssSlug}`}}function Na(e){return e===1?"🥇 #1":e===2?"🥈 #2":e===3?"🥉 #3":`#${e}`}class Ra{constructor(t,n){x(this,"activeGameId","match3");x(this,"activeScope","valley");x(this,"activeHouseFilter","all");x(this,"redirectedFromUnscored",null);x(this,"onJumpToGame");x(this,"onVisitNeighbor");x(this,"onOpenNeighborBook");x(this,"root");x(this,"sim");x(this,"closeBound",!1);x(this,"sortingHatSpinning",!1);this.root=t,this.sim=n,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");return t||(t=document.createElement("dialog"),t.id="leaderboardDialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=`
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      `,this.root.appendChild(t)),this.closeBound||(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)&&t.addEventListener("click",n=>{if(n.target!==t)return;const a=t.getBoundingClientRect();a.top<=n.clientY&&n.clientY<=a.top+a.height&&a.left<=n.clientX&&n.clientX<=a.left+a.width||t.close()})),t}open(t,n,a){t?Di(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=vt.includes(this.activeGameId)?this.activeGameId:Oi(t)):(this.redirectedFromUnscored=null,vt.includes(this.activeGameId)||(this.activeGameId="match3")),(n==="valley"||n==="friends"||n==="personal")&&(this.activeScope=n),(a==="all"||a&&it.includes(a))&&(this.activeHouseFilter=a);const i=this.ensureDialogMounted();this.render(),i.open||i.showModal();const o=this.activeGameId;ts(this.sim.state,o).catch(()=>{}).then(()=>Promise.all(vt.map(r=>ns(r)))).then(r=>{i.open&&r.some(c=>c.length>0)&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}renderHouseCupSectionHtml(t,n){const a=lt[n]??lt.Gryffindor,i=t.map(c=>{const s=c.meta,l=this.activeHouseFilter===c.house,d=c.rank===1?"🥇 #1":c.rank===2?"🥈 #2":c.rank===3?"🥉 #3":`#${c.rank}`;return`
          <button
            type="button"
            class="house-cup-card house-card-${s.cssSlug} ${c.isPlayerHouse?"is-player-house":""} ${l?"is-filtered-house":""}"
            data-lb-house-card="${c.house}"
            aria-pressed="${l}"
            title="${Q(s.vnTitle)} (${Q(s.gemNameVi)})"
          >
            <div class="house-cup-top">
              <span class="house-cup-crest" aria-hidden="true">${s.emblemSvg}</span>
              <div class="house-cup-meta">
                <div class="house-cup-name-row">
                  <strong>${d} ${Q(s.house)}</strong>
                  ${c.isPlayerHouse?'<span class="house-you-pill">Bạn</span>':""}
                </div>
                <div class="house-cup-vn-title">${s.gemEmoji} ${Q(s.gemShortVi)} • 👥 ${c.members}</div>
              </div>
              <span class="house-cup-hourglass-icon" aria-hidden="true" title="Đồng hồ cát ${Q(s.gemNameVi)}">${s.hourglassSvg}</span>
            </div>
            <div class="house-cup-points-row">
              <span class="house-cup-points">${c.points.toLocaleString("vi-VN")} đ</span>
              <span class="house-cup-patronus" title="${Q(s.patronusNameVi)}">${s.patronusEmoji}</span>
            </div>
            <div class="hourglass-bar" role="progressbar" aria-valuenow="${c.fillPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Mực đá quý ${Q(s.gemShortVi)} của nhà ${Q(s.house)}">
              <div class="hourglass-bar-fill" style="width:${c.fillPercent}%"></div>
            </div>
          </button>
        `}).join(""),o=it.map(c=>{const s=lt[c],l=c===n;return`
        <button
          type="button"
          class="lb-my-house-btn house-pill-${s.cssSlug} ${l?"active":""}"
          data-lb-pick-house="${c}"
          aria-pressed="${l}"
          title="${Q(s.vnTitle)} (${Q(s.traitsVi)})"
        >
          ${s.mascotEmoji} ${Q(s.house)}
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
      `,...it.map(c=>{const s=lt[c],l=this.activeHouseFilter===c,d=t.find(u=>u.house===c)?.members??0;return`
          <button
            type="button"
            class="filter-pill filter-pill-${s.cssSlug} ${l?"active":""}"
            data-lb-house-filter="${c}"
            aria-pressed="${l}"
          >
            ${s.mascotEmoji} ${Q(s.house)} <span class="filter-pill-count">(${d})</span>
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
              <span>🎩 <strong>${a.mascotEmoji} ${Q(a.house)}</strong></span>
              <button
                id="btnLbSortingHat"
                type="button"
                class="brass-btn lb-hat-roll-btn ${this.sortingHatSpinning?"is-spinning":""}"
                title="Đội Chiếc Nón Phân Loại"
              >
                🎩 Phân Loại
              </button>
            </div>
            <div class="lb-my-house-pills" role="group" aria-label="Chọn Nhà Hogwarts của bạn">
              ${o}
            </div>
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
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const n=gn[this.activeGameId],a=this.root.querySelector("#leaderboardDialogTitle");a&&(a.innerHTML=`🏆 Bảng Xếp Hạng • ${Q(n.shortVi)}`);const i=vt.map(s=>{const l=gn[s],d=this.sim.getPlayerMinigameRank(s,"valley"),u=s===this.activeGameId;return`
        <button
          type="button"
          role="tab"
          aria-selected="${u}"
          data-lb-game="${s}"
          class="lb-game-tab ${u?"active":""}"
          title="${Q(l.titleVi)} — #${d}"
        >
          <img src="${l.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${Q(l.shortVi)}</strong>
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
            ▶️ ${Q(n.shortVi)}
          </button>
        </div>
      </div>
    `,r=this.activeScope==="personal"?this.renderPersonalThreeGamesTableHtml():this.renderStandingViewHtml(this.activeScope),c=this.redirectedFromUnscored?`<div class="lb-unscored-note" role="note">
          📌 <strong>${Q(gn[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không xếp hạng — dưới đây là Bảng Xếp Hạng <strong>3 môn tính điểm</strong> (Bùa Gặt • Số Học • Sinh Vật).
        </div>`:"";t.innerHTML=`
      <div class="lb-shell">
        ${c}
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">
          ${i}
        </div>
        ${o}
        ${r}
      </div>
    `,this.bindEvents(t)}renderPodiumCardHtml(t,n){if(!t)return"";const a=n===1?"🥇":n===2?"🥈":"🥉",i=bs(t.house),o=t.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${Q(t.portraitSprite)}.png" alt="" class="lb-podium-avatar-img" />`:`<span class="lb-podium-avatar-emoji" aria-hidden="true">${Q(t.avatarEmoji)}</span>`;return`
      <div class="lb-podium-card place-${n} ${t.isPlayer?"is-player":""}">
        <div class="lb-podium-medal">${a} #${n}</div>
        <div class="lb-podium-avatar-wrap">${o}</div>
        <div class="lb-podium-name">${Q(t.name)}</div>
        <div class="lb-podium-house ${i.cls}">${i.emoji} ${i.label}</div>
        <div class="lb-podium-primary">${Q(t.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${Q(t.ratingDisplayVi)}</div>
      </div>
    `}renderStandingViewHtml(t){const n=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:a,entries:i,playerEntry:o,playerRank:r,totalEntries:c,nextRivalAbove:s,houseStandings:l,playerHouse:d}=n,u=s?`🎯 Đuổi <strong>#${s.rank} ${Q(s.name)}</strong> (${Q(s.primaryDisplayVi)})`:`👑 Đang dẫn đầu <strong>#1</strong> (${Q(a.shortVi)})`,p=this.renderHouseCupSectionHtml(l,d),m=i.length>0?`
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(i[1],2)}
        ${this.renderPodiumCardHtml(i[0],1)}
        ${this.renderPodiumCardHtml(i[2],3)}
      </div>
    `:"",g=i.length>0?i.map(b=>{const w=bs(b.house),$=Na(b.rank),C=b.isPlayer?'<span class="lb-role-tag you">Bạn</span>':b.isCloudPlayer?'<span class="lb-role-tag cloud">🌐</span>':b.isFriend?'<span class="lb-role-tag friend">🤝</span>':"",h=!b.isPlayer&&b.neighborId?`<button type="button" class="lb-mini-visit-btn" data-lb-visit="${Q(b.neighborId)}" title="Thăm ${Q(b.name)}">🏡</button>`:"";return`
          <tr class="lb-row ${b.isPlayer?"is-player":""} ${b.rank<=3?`top-${b.rank}`:""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <span class="lb-rank-chip rank-${Math.min(4,b.rank)}">${$}</span>
                <span class="lb-avatar-badge" aria-hidden="true">${Q(b.avatarEmoji)}</span>
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${Q(b.name)}</strong>
                    ${C}
                  </div>
                  <div class="lb-contender-sub">
                    <span class="${w.cls}">${w.emoji} ${w.label}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <span class="lb-league-pill tier-${b.league.tierId}">${b.league.icon} ${Q(b.league.labelVi)}</span>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(b.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(b.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(b.detailDisplayVi)}</span>
                ${h}
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
          <div class="lb-cup-title">${Q(a.shortVi)}</div>
          <div class="lb-cup-chase">${u}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng</span>
          <strong class="lb-player-rank-num">#${r}<span>/${c}</span></strong>
          <span class="lb-league-pill tier-${o.league.tierId}">${o.league.icon} ${Q(o.league.labelVi)}</span>
        </div>
      </div>

      ${p}

      ${m}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Bậc'; --label-3: '${Q(a.primaryColVi)}'; --label-4: '${Q(a.secondaryColVi)}'; --label-5: 'Chi Tiết';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            ${Q(a.shortVi)} (${i.length}/${c})
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bậc</th>
              <th scope="col">${Q(a.primaryColVi)}</th>
              <th scope="col">${Q(a.secondaryColVi)}</th>
              <th scope="col">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            ${g}
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
                    <strong>${Q(a.meta.shortVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${a.league.tierId}">${a.league.icon} ${Q(a.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${a.valleyRank}/${a.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 #${a.friendsRank}/${a.friendsTotal}</div>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(a.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(a.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(a.detailDisplayVi)}</span>
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
    `}bindEvents(t){t.querySelectorAll("[data-lb-game]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbGame;!a||!vt.includes(a)||(this.sim.audio.playClick(),this.activeGameId=a,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),ts(this.sim.state,a).catch(()=>{}).then(()=>ns(a)).then(i=>{i.length>0&&this.activeGameId===a&&this.render()}))})}),t.querySelectorAll("[data-lb-scope]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbScope;a&&(this.sim.audio.playClick(),this.activeScope=a,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbHouseFilter;a&&(this.sim.audio.playClick(),a==="all"?this.activeHouseFilter="all":it.includes(a)&&(this.activeHouseFilter=a),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbHouseCard;!a||!it.includes(a)||(this.sim.audio.playClick(),this.activeHouseFilter=this.activeHouseFilter===a?"all":a,this.render())})}),t.querySelectorAll("[data-lb-pick-house]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbPickHouse;!a||!it.includes(a)||(this.sim.setPlayerHouse(a,this.activeGameId),this.activeHouseFilter!=="all"&&(this.activeHouseFilter=a),this.render())})}),t.querySelector("#btnLbSortingHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0;const n=this.sim.rollPlayerSortingHat(this.activeGameId);this.activeHouseFilter!=="all"&&(this.activeHouseFilter=n),this.render(),window.setTimeout(()=>{this.sortingHatSpinning=!1,this.render()},420)}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const n=this.activeGameId;this.close(),this.onJumpToGame?.(n)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbJumpPlay;a&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(a))})}),t.querySelectorAll("[data-lb-visit]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.lbVisit;a&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(a))})})}}const Ln=.65,An=2.2,ct=.15,hs="hangsoc_minigame_orient_v1";function ot(e){if(!Number.isFinite(e))return 1;const t=Math.min(An,Math.max(Ln,e));return Math.round(t*100)/100}function xn(e,t){return((Math.round(e)+Math.round(t))%4+4)%4}function za(e,t,n,a=!1,i=!1){const o=Math.max(1,t||1024),r=Math.max(1,n||768),c=i?o>=881||o>r&&o>=640:o>=980||o>r&&r<=620;return e==="auto"?{effectiveLayout:c?"landscape":"portrait",dialogQuarterTurn:0}:e==="landscape"?o<r?{effectiveLayout:"landscape",dialogQuarterTurn:a?3:1}:{effectiveLayout:"landscape",dialogQuarterTurn:0}:o>r&&r<=640?{effectiveLayout:"portrait",dialogQuarterTurn:a?1:3}:{effectiveLayout:"portrait",dialogQuarterTurn:0}}function Fa(e,t,n,a){const i=(e-n.left)/Math.max(1,n.width),o=(t-n.top)/Math.max(1,n.height);switch(a){case 1:return{lu:o,lv:1-i};case 2:return{lu:1-i,lv:1-o};case 3:return{lu:1-o,lv:i};default:return{lu:i,lv:o}}}function fs(e,t,n){switch(n){case 1:return{vx:t,vy:-e};case 2:return{vx:-e,vy:-t};case 3:return{vx:-t,vy:e};default:return{vx:e,vy:t}}}function Va(e,t,n,a,i){if(i%2===0||e<=10||t<=10||n<=10||a<=10)return 1;const o=e/a,r=t/n;return Math.min(1,Math.max(.45,Math.min(o,r)))}function Ga(e,t,n,a,i,o,r,c){if(n<=0||a<=0||i<=0||o<=0)return{panX:0,panY:0};const s=c%2===1?o:i,l=c%2===1?i:o,d=s*r,u=l*r,p=r>1.01?44:0,m=r>1.01?44:0,g=Math.max(0,(d-n)*.5+p),b=Math.max(0,(u-a)*.5+m),w=Math.min(g,Math.max(-g,Number.isFinite(e)?e:0)),$=Math.min(b,Math.max(-b,Number.isFinite(t)?t:0));return{panX:Math.abs(w)<.5?0:Math.round(w*10)/10,panY:Math.abs($)<.5?0:Math.round($*10)/10}}function vs(e){if(typeof screen>"u")return;const t=screen.orientation;if(t)try{e==="unlock"?t.unlock?.():typeof t.lock=="function"&&t.lock(e).catch(()=>{})}catch{}}class _a{constructor(){x(this,"states",new Map);x(this,"orientationPref","auto");x(this,"dialogFlip180",!1);x(this,"spacePressed",!1);this.loadPersistedOrientation(),typeof window<"u"&&(window.addEventListener("keydown",t=>{if(t.code==="Space"){const n=t.target?.tagName;n!=="INPUT"&&n!=="TEXTAREA"&&n!=="BUTTON"&&(this.spacePressed=!0)}}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1)}),window.addEventListener("blur",()=>{this.spacePressed=!1}))}loadPersistedOrientation(){try{if(typeof sessionStorage>"u")return;const t=sessionStorage.getItem(hs);(t==="landscape"||t==="portrait"||t==="auto")&&(this.orientationPref=t)}catch{}}savePersistedOrientation(){try{if(typeof sessionStorage>"u")return;sessionStorage.setItem(hs,this.orientationPref)}catch{}}getState(t){let n=this.states.get(t);return n||(n={zoom:1,panX:0,panY:0,boardQuarterTurns:0,panMode:!1},this.states.set(t,n)),n}getOrientationPref(){return this.orientationPref}setOrientationPref(t){this.orientationPref=t,this.dialogFlip180=!1,this.savePersistedOrientation(),vs(t==="auto"?"unlock":t)}getViewportResolution(t=!1){const n=typeof window<"u"?window.innerWidth:1280,a=typeof window<"u"?window.innerHeight:800;return za(this.orientationPref,n,a,this.dialogFlip180,t)}getEffectiveLayout(t=!1){return this.getViewportResolution(t).effectiveLayout}getNetQuarterTurns(t){const n=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(t==="seedquiz");return xn(a,n.boardQuarterTurns)}toggleOrientation(t=!1){const a=this.getEffectiveLayout(t)==="landscape"?"portrait":"landscape";this.setOrientationPref(a);for(const i of this.states.values())i.panX=0,i.panY=0;return a}stepZoom(t,n){const a=this.getState(t);return a.zoom=ot(a.zoom+n),a.zoom<=1.01&&(a.panX=0,a.panY=0,a.panMode=!1),a.zoom}setZoom(t,n){const a=this.getState(t);return a.zoom=ot(n),a.zoom<=1.01&&(a.panX=0,a.panY=0,a.panMode=!1),a.zoom}resetView(t){const n=this.getState(t);n.zoom=1,n.panX=0,n.panY=0,n.boardQuarterTurns=0,n.panMode=!1}rotate90(t){const n=this.getState(t),{dialogQuarterTurn:a}=this.getViewportResolution(t==="seedquiz");return t==="seedquiz"&&a!==0&&n.boardQuarterTurns===0?(this.dialogFlip180=!this.dialogFlip180,this.getNetQuarterTurns(t)):(n.boardQuarterTurns=xn(n.boardQuarterTurns,1),n.panX=0,n.panY=0,n.boardQuarterTurns)}togglePanMode(t){const n=this.getState(t);return n.panMode=!n.panMode,n.panMode}renderToolbarHtml(t,n){const a=this.getState(t),i=t==="seedquiz",o=n?.showPanToggle??!i,r=this.getEffectiveLayout(i),c=Math.round(a.zoom*100),s=r==="landscape"?"↕️ Dọc":"↔️ Ngang",l=r==="landscape"?"Đang ở chế độ Ngang — bấm để xoay sang chế độ Dọc":"Đang ở chế độ Dọc — bấm để xoay sang chế độ Ngang",d=a.boardQuarterTurns*90;return`
      <div class="mg-view-toolbar${n?.extraClass?` ${n.extraClass}`:""}" data-mg-toolbar="${t}" role="toolbar" aria-label="Phóng to, thu nhỏ và xoay màn hình game">
        <button type="button" class="mg-view-btn" data-mg-act="zoom-out" title="Thu nhỏ (-)" aria-label="Thu nhỏ" ${a.zoom<=Ln+.005?"disabled":""}>➖</button>
        <button type="button" class="mg-view-btn mg-view-pct ${c!==100||a.boardQuarterTurns!==0?"is-modified":""}" data-mg-act="zoom-reset" title="Đặt lại góc nhìn 100%" aria-label="Đặt lại phóng to 100 phần trăm">${c}%</button>
        <button type="button" class="mg-view-btn" data-mg-act="zoom-in" title="Phóng to (+)" aria-label="Phóng to" ${a.zoom>=An-.005?"disabled":""}>➕</button>
        ${o?`<button type="button" class="mg-view-btn mg-view-pan ${a.panMode?"active":""}" data-mg-act="toggle-pan" aria-pressed="${a.panMode}" title="Bật/tắt chế độ kéo trượt bàn chơi bằng 1 ngón hoặc chuột trái">✋</button>`:""}
        <span class="mg-view-sep" aria-hidden="true"></span>
        <button type="button" class="mg-view-btn mg-view-orient ${this.orientationPref!=="auto"?"active":""}" data-mg-act="toggle-orient" title="${l}">${s}</button>
        <button type="button" class="mg-view-btn ${a.boardQuarterTurns!==0?"active":""}" data-mg-act="rotate-90" title="Xoay bàn chơi 90° (hiện tại ${d}°)" aria-label="Xoay bàn chơi 90 độ">↪️${d>0?`<small>${d}°</small>`:""}</button>
      </div>
    `}syncToolbarDOM(t,n){if(!t||typeof t.querySelector!="function")return;const a=t.querySelector(`[data-mg-toolbar="${n}"]`);if(!a||typeof a.querySelector!="function")return;const i=this.getState(n),o=n==="seedquiz",r=this.getEffectiveLayout(o),c=Math.round(i.zoom*100),s=i.boardQuarterTurns*90,l=a.querySelector('[data-mg-act="zoom-out"]');l&&(l.disabled=i.zoom<=Ln+.005);const d=a.querySelector('[data-mg-act="zoom-in"]');d&&(d.disabled=i.zoom>=An-.005);const u=a.querySelector('[data-mg-act="zoom-reset"]');u&&(u.textContent=`${c}%`,u.classList.toggle("is-modified",c!==100||i.boardQuarterTurns!==0));const p=a.querySelector('[data-mg-act="toggle-pan"]');p&&(p.classList.toggle("active",i.panMode),p.setAttribute("aria-pressed",String(i.panMode)));const m=a.querySelector('[data-mg-act="toggle-orient"]');m&&(m.textContent=r==="landscape"?"↕️ Dọc":"↔️ Ngang",m.classList.toggle("active",this.orientationPref!=="auto"));const g=a.querySelector('[data-mg-act="rotate-90"]');g&&(g.innerHTML=`↪️${s>0?`<small>${s}°</small>`:""}`,g.classList.toggle("active",i.boardQuarterTurns!==0),g.title=`Xoay bàn chơi 90° (hiện tại ${s}°)`)}applyDialogOrientation(t,n,a=!1){const i=this.getViewportResolution(a),o=String(i.dialogQuarterTurn*90);return t?.dataset&&(t.dataset.mgLayout=i.effectiveLayout,t.dataset.mgRotate=o),n?.dataset&&(n.dataset.mgLayout=i.effectiveLayout,n.dataset.mgRotate=o),i}clearDialogOrientation(t,n){t?.dataset&&(delete t.dataset.mgLayout,delete t.dataset.mgRotate),n?.dataset&&(delete n.dataset.mgLayout,delete n.dataset.mgRotate)}applyCanvasStageTransform(t,n,a){const i=this.getState(t),{dialogQuarterTurn:o}=this.getViewportResolution(!1),r=xn(o,i.boardQuarterTurns);if(!n||!a)return{effectiveScale:i.zoom,netQuarterTurns:r};const c=n.clientWidth,s=n.clientHeight,l=a.offsetWidth,d=a.offsetHeight,u=Va(c,s,l,d,i.boardQuarterTurns),p=i.zoom*u,m=Ga(i.panX,i.panY,c,s,l,d,p,i.boardQuarterTurns);return i.panX=m.panX,i.panY=m.panY,n.dataset.mgPanMode=String(i.panMode),i.panX===0&&i.panY===0&&Math.abs(p-1)<.002&&i.boardQuarterTurns===0?(a.style.transform="",a.style.transformOrigin=""):(a.style.transformOrigin="center center",a.style.transform=`translate3d(${i.panX}px, ${i.panY}px, 0) scale(${p.toFixed(4)}) rotate(${i.boardQuarterTurns*90}deg)`),{effectiveScale:p,netQuarterTurns:r}}applyDomScrollStageTransform(t,n,a){const i=this.getState("seedquiz");if(!t||!n||!a)return;const o=i.zoom,r=i.boardQuarterTurns;if(Math.abs(o-1)<.002&&r===0){a.style.transform="",a.style.transformOrigin="",a.style.width="",n.style.width="",n.style.height="";return}a.style.width=o<1?`${(100/o).toFixed(2)}%`:"100%",a.style.transform="";const c=a.offsetWidth||t.clientWidth||640,s=a.offsetHeight||480;if(r===0)a.style.transformOrigin="0 0",a.style.transform=`scale(${o.toFixed(4)})`,n.style.width=`${Math.ceil(c*o)}px`,n.style.height=`${Math.ceil(s*o)}px`;else{const l=r*90,d=(r%2===1?s:c)*o,u=(r%2===1?c:s)*o;n.style.width=`${Math.ceil(d)}px`,n.style.height=`${Math.ceil(u)}px`,a.style.transformOrigin="center center";const p=(d-c)*.5,m=(u-s)*.5;a.style.transform=`translate3d(${p.toFixed(1)}px, ${m.toFixed(1)}px, 0) scale(${o.toFixed(4)}) rotate(${l}deg)`}}bindCanvasStageInteractions(t){const{gameId:n,rootScope:a,panAreaEl:i,canvasShellEl:o,canvasEl:r,onTransformUpdated:c,onOrientationToggled:s,onPlayClick:l}=t,d=()=>{this.applyCanvasStageTransform(n,i,o),this.syncToolbarDOM(a,n),c()},u=typeof a?.querySelector=="function"?a.querySelector(`[data-mg-toolbar="${n}"]`):null;if(u&&typeof u.querySelectorAll=="function"&&u.querySelectorAll("[data-mg-act]").forEach(v=>{v.addEventListener("click",S=>{S.stopPropagation(),l?.();const M=v.dataset.mgAct;M==="zoom-in"?(this.stepZoom(n,ct),d()):M==="zoom-out"?(this.stepZoom(n,-ct),d()):M==="zoom-reset"?(this.resetView(n),d()):M==="toggle-pan"?(this.togglePanMode(n),d()):M==="toggle-orient"?(this.toggleOrientation(!1),s()):M==="rotate-90"&&(this.rotate90(n),d())})}),!i||!o){this.syncToolbarDOM(a,n);return}i.addEventListener("wheel",v=>{v.preventDefault();const S=this.getState(n),M=v.ctrlKey?.0085:.0018,L=ot(S.zoom*Math.exp(-v.deltaY*M));if(L===S.zoom)return;const O=i.getBoundingClientRect(),{dialogQuarterTurn:R}=this.getViewportResolution(!1),{lu:q,lv:B}=Fa(v.clientX,v.clientY,O,R),N=(q-.5)*i.clientWidth,W=(B-.5)*i.clientHeight,Y=L/Math.max(.2,S.zoom);S.panX=N-(N-S.panX)*Y,S.panY=W-(W-S.panY)*Y,S.zoom=L,S.zoom<=1.01&&(S.panX=0,S.panY=0,S.panMode=!1),d()},{passive:!1}),i.addEventListener("contextmenu",v=>{(this.getState(n).zoom>1.01||this.getState(n).panMode)&&v.preventDefault()});const p=new Map;let m=!1,g=0,b=0,w=0,$=null,C=0,h=0;const A=v=>{if(!(!r||typeof PointerEvent>"u"))try{r.dispatchEvent(new PointerEvent("pointercancel",{pointerId:v,bubbles:!0}))}catch{}};i.addEventListener("pointerdown",v=>{if(v.pointerType==="touch"&&(p.set(v.pointerId,{x:v.clientX,y:v.clientY}),p.size>=2)){const L=Array.from(p.values());if(g=Math.max(12,Math.hypot(L[1].x-L[0].x,L[1].y-L[0].y)),b=(L[0].x+L[1].x)*.5,w=(L[0].y+L[1].y)*.5,!m){m=!0;for(const O of p.keys())A(O)}v.stopPropagation(),v.preventDefault();return}const S=this.getState(n);if(v.button===1||v.button===2&&S.zoom>1.01||v.button===0&&(S.panMode||v.altKey||this.spacePressed)){$=v.pointerId,C=v.clientX,h=v.clientY,i.dataset.mgDragging="true";try{i.setPointerCapture?.(v.pointerId)}catch{}v.stopPropagation(),v.preventDefault()}},{capture:!0}),i.addEventListener("pointermove",v=>{if(v.pointerType==="touch"&&p.has(v.pointerId)){if(p.set(v.pointerId,{x:v.clientX,y:v.clientY}),m&&p.size>=2){const S=Array.from(p.values()),M=Math.max(12,Math.hypot(S[1].x-S[0].x,S[1].y-S[0].y)),L=(S[0].x+S[1].x)*.5,O=(S[0].y+S[1].y)*.5,R=this.getState(n),q=M/Math.max(12,g);R.zoom=ot(R.zoom*q);const{dialogQuarterTurn:B}=this.getViewportResolution(!1),N=fs(L-b,O-w,B);R.panX+=N.vx,R.panY+=N.vy,g=M,b=L,w=O,d(),v.stopPropagation(),v.preventDefault();return}if(m){v.stopPropagation(),v.preventDefault();return}}if($===v.pointerId){const S=this.getState(n),{dialogQuarterTurn:M}=this.getViewportResolution(!1),L=fs(v.clientX-C,v.clientY-h,M);S.panX+=L.vx,S.panY+=L.vy,C=v.clientX,h=v.clientY,d(),v.stopPropagation(),v.preventDefault()}},{capture:!0});const k=v=>{if(v.pointerType==="touch"&&p.has(v.pointerId)&&(p.delete(v.pointerId),m)){if(p.size===0)m=!1;else if(p.size>=2){const S=Array.from(p.values());g=Math.max(12,Math.hypot(S[1].x-S[0].x,S[1].y-S[0].y)),b=(S[0].x+S[1].x)*.5,w=(S[0].y+S[1].y)*.5}v.stopPropagation(),v.preventDefault();return}if($===v.pointerId){$=null,delete i.dataset.mgDragging;try{i.releasePointerCapture?.(v.pointerId)}catch{}v.stopPropagation(),v.preventDefault()}};i.addEventListener("pointerup",k,{capture:!0}),i.addEventListener("pointercancel",k,{capture:!0}),this.applyCanvasStageTransform(n,i,o),this.syncToolbarDOM(a,n)}bindDomScrollStageInteractions(t){const{rootScope:n,scrollViewportEl:a,sizerEl:i,contentStageEl:o,onOrientationToggled:r,onPlayClick:c}=t,s="seedquiz",l=()=>{this.applyDomScrollStageTransform(a,i,o),this.syncToolbarDOM(n,s)},d=typeof n?.querySelector=="function"?n.querySelector(`[data-mg-toolbar="${s}"]`):null;if(d&&typeof d.querySelectorAll=="function"&&d.querySelectorAll("[data-mg-act]").forEach(u=>{u.addEventListener("click",p=>{p.stopPropagation(),c?.();const m=u.dataset.mgAct;m==="zoom-in"?(this.stepZoom(s,ct),l()):m==="zoom-out"?(this.stepZoom(s,-ct),l()):m==="zoom-reset"?(this.resetView(s),l()):m==="toggle-orient"?(this.toggleOrientation(!0),r()):m==="rotate-90"&&(this.rotate90(s),r())})}),a){a.addEventListener("wheel",g=>{if(!g.ctrlKey&&!g.metaKey)return;g.preventDefault();const b=this.getState(s);b.zoom=ot(b.zoom*Math.exp(-g.deltaY*.006)),l()},{passive:!1});const u=new Map;let p=0;a.addEventListener("pointerdown",g=>{if(g.pointerType==="touch"&&(u.set(g.pointerId,{x:g.clientX,y:g.clientY}),u.size>=2)){const b=Array.from(u.values());p=Math.max(12,Math.hypot(b[1].x-b[0].x,b[1].y-b[0].y))}},{passive:!0}),a.addEventListener("pointermove",g=>{if(!(g.pointerType!=="touch"||!u.has(g.pointerId))&&(u.set(g.pointerId,{x:g.clientX,y:g.clientY}),u.size>=2&&p>0)){const b=Array.from(u.values()),w=Math.max(12,Math.hypot(b[1].x-b[0].x,b[1].y-b[0].y)),$=this.getState(s);$.zoom=ot($.zoom*(w/p)),p=w,l(),g.preventDefault()}},{passive:!1});const m=g=>{u.delete(g.pointerId),u.size<2&&(p=0)};a.addEventListener("pointerup",m,{passive:!0}),a.addEventListener("pointercancel",m,{passive:!0})}l()}}const De=new _a;function J(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Tn=["en","ko","zh","es","ja"],$n=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class Ua{constructor(t,n,a,i,o){x(this,"root");x(this,"sim");x(this,"onRefreshHud");x(this,"onToast");x(this,"onEquipAndSow");x(this,"targetCropId","ottery_wheat");x(this,"pendingPlotUid",null);x(this,"challenge",null);x(this,"answeredOutcome",null);x(this,"selectedChoiceIdx",null);x(this,"placedTokenIndices",[]);x(this,"selectedLeftPairId",null);x(this,"matchedPairIds",new Set);x(this,"flashWrongPairKey",null);x(this,"pairMistakes",0);x(this,"cropFilter","all");x(this,"activeSubView","practice");x(this,"codexQuery","");x(this,"codexBoxFilter","all");x(this,"sessionShownQids",new Set);x(this,"skipFormatOffset",0);x(this,"starterChallengePendingPack",!1);x(this,"dialogCloseBound",!1);x(this,"onOpenLeaderboard");this.root=t,this.sim=n,this.onRefreshHud=a,this.onToast=i,this.onEquipAndSow=o,typeof window<"u"&&(window.addEventListener("resize",()=>{if(!this.isOpen())return;const r=this.getDialog(),c=typeof r?.querySelector=="function"?r.querySelector(".sq-modal-inner"):null;De.applyDialogOrientation(r,c,!0),this.syncSeedQuizViewportTransform()}),window.addEventListener("keydown",r=>{if(!this.isOpen())return;const c=r.target?.tagName;c==="INPUT"||c==="TEXTAREA"||c==="SELECT"||(r.key==="+"||r.key==="="?(r.preventDefault(),De.stepZoom("seedquiz",ct),this.syncSeedQuizViewportTransform()):r.key==="-"||r.key==="_"?(r.preventDefault(),De.stepZoom("seedquiz",-ct),this.syncSeedQuizViewportTransform()):r.key==="0"&&(r.ctrlKey||r.metaKey)&&(r.preventDefault(),De.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))}))}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=t.querySelector("#sqScrollViewport"),a=t.querySelector("#sqZoomSizer"),i=t.querySelector("#sqZoomStage");De.applyDomScrollStageTransform(n,a,i),De.syncToolbarDOM(t,"seedquiz")}open(t,n,a,i,o,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const c=Object.values(Se).filter(u=>this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel);if(t&&Se[t]){const u=Se[t];this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel?this.targetCropId=t:c.length>0&&(this.targetCropId=c[0].id)}else!Se[this.targetCropId]&&c.length>0&&(this.targetCropId=c[0].id);this.pendingPlotUid=n??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const s=this.sim.ensureLanguageQuiz();let l=!this.challenge||this.answeredOutcome!==null;a&&Tn.includes(a)&&s.activeLang!==a&&(s.activeLang=a,l=!0),i&&(i==="beginner"||i==="intermediate"||i==="advanced")&&(ss(s,s.activeLang,i),l=!0),o&&$n.includes(o)&&(s.preferredFormat=o,l=!0),l||this.challenge?.lang!==s.activeLang?(this.challenge&&!this.answeredOutcome&&yt(s,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(s.activeLang,!1),this.render());const d=this.root.querySelector("#seedQuizDialog");d&&!d.open&&d.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const n=this.sessionShownQids.values().next().value;if(n===void 0)break;this.sessionShownQids.delete(n)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,n=!1){cn(t)||xi(t).then(a=>{const i=this.sim.ensureLanguageQuiz();if(i.activeLang===t){if(a){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=is(i,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),n&&i.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),n&&i.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const n=this.sim.ensureLanguageQuiz(),a=cn(n.activeLang);this.challenge=is(n,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),a?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(n.activeLang,t)),this.sim.saveToStorage(),this.render();const i=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(i&&(i.scrollTop=0),a&&t&&n.autoSpeak&&this.challenge){const o=this.challenge.ttsPromptText||this.challenge.fullSentence;o&&Le(o,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const n=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=n,this.sim.ensureLanguageQuiz().autoSpeak&&Le(this.challenge.fullSentence,this.challenge.lang,.95);const i=Se[this.targetCropId];if(n.correct){const o=n.tierAutoPromoted?` • Thăng hạng ${ht[this.challenge.lang].tierLabels[n.tierAutoPromoted]}!`:"",r=n.phoenixTalismanAwarded?` • 🔥 +${n.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",c=n.buildReduction&&n.buildReduction.reducedSec>0?` • 🔨 -${xe(n.buildReduction.reducedSec)} xây ${n.buildReduction.targetName??"công trình"}!`:"",s=n.leaderboardRankUp&&n.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${n.leaderboardRankUp.newRank} (+${n.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${n.seedsAwarded} hạt ${i.emoji} ${i.name} (Túi: ${n.newSeedCount} hạt)${c}${o}${r}${s}`,n.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const n=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,n)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const n=this.getDialog(),a=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;n&&typeof n.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,n.addEventListener("close",()=>{De.clearDialogOrientation(n,a)})),De.applyDialogOrientation(n,a,!0);const i=t.querySelector("#sqScrollViewport"),o=i?i.scrollTop:0,r=i?i.scrollLeft:0,c=this.sim.ensureLanguageQuiz(),s=c.activeLang,l=ht[s],d=c.profiles[s],u=Se[this.targetCropId],p=this.sim.getSeedCount(this.targetCropId),m=this.sim.getFarmItemCount(this.targetCropId),g=this.sim.state.galleons,b=u.seedCost,w=u.seedCost*3,$=g>=b,C=g>=w,h=Ni(d,this.sim.state.level),A=d.totalAnswered>0?Math.round(d.totalCorrect/d.totalAnswered*100):100,k=Ri(d),v=Ti(s),S=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),M=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let L="";if(this.pendingPlotUid){const I=this.sim.state.buildings.find(V=>V.uid===this.pendingPlotUid);I&&ae(I.itemId)?.isFarmlandPlot&&!I.cropId&&(L=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${I.gx}, ${I.gy}]</strong></span>
            ${p>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${p})</button>`:""}
          </div>
        `)}const O=Object.values(Se).sort((I,V)=>I.unlockLevel-V.unlockLevel||I.growSec-V.growSec),R=O.filter(I=>I.isFlowerCrop).length,q=O.length-R,B=O.filter(I=>this.cropFilter==="flowers"?!!I.isFlowerCrop:this.cropFilter==="crops"?!I.isFlowerCrop:!0),N=[{id:"all",label:`🌱 (${O.length})`},{id:"flowers",label:`🌸 Hoa (${R})`},{id:"crops",label:`🌾 Cây (${q})`}].map(I=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===I.id?"active":""}"
            data-sq-crop-filter="${I.id}"
            aria-pressed="${this.cropFilter===I.id}"
          >${I.label}</button>
        `).join(""),W=B.map(I=>{const V=!this.sim.state.sandboxMode&&this.sim.state.level<I.unlockLevel,j=I.id===this.targetCropId,ue=this.sim.getSeedCount(I.id),ne=xe(I.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${j?"active":""} ${V?"locked":""}"
            data-sq-crop="${I.id}"
            aria-pressed="${j}"
            ${V?"disabled":""}
            title="${V?`Lv.${I.unlockLevel} (⏱️ ${ne})`:`${I.name} • ⏱️ ${ne} • 🪙 ${I.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${Mt(I.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${J(I.name)}</span>
              <span class="sq-crop-pill-sub">
                ${V?`🔒 Lv.${I.unlockLevel}`:`🌱 ${ue} • ⏱️${ne}`}
              </span>
            </span>
          </button>
        `}).join(""),Y=Tn.map(I=>{const V=ht[I],j=c.profiles[I],ue=I===s,ne=j.tier==="beginner"?"Tập Sự":j.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${ue?"active":""}"
          data-sq-lang="${I}"
          aria-pressed="${ue}"
          title="${V.flag} ${J(V.academyVi)} — ${J(V.tierLabels[j.tier])}"
        >
          <span class="sq-lang-flag">${V.flag}</span>
          <span class="sq-lang-text">
            <strong>${J(V.nameVi)}</strong>
            <small>${J(ne)} • Lv.${j.masteryScore}</small>
          </span>
        </button>
      `}).join(""),re=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(I=>{const V=d.tier===I.id;return`
          <button
            type="button"
            class="sq-tier-btn ${V?"active":""}"
            data-sq-tier="${I.id}"
            aria-pressed="${V}"
          >
            <span>${I.icon} ${J(l.tierLabels[I.id])}</span>
            <small>${I.rewardTag}</small>
          </button>
        `}).join(""),D=$n.map(I=>{const V=Jn[I],j=c.preferredFormat===I;return`
        <button
          type="button"
          class="sq-format-chip ${j?"active":""}"
          data-sq-format="${I}"
          aria-pressed="${j}"
        >
          ${V.icon} ${J(V.labelVi)}
        </button>
      `}).join(""),X=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-view-bar-row">
        <span class="sq-view-bar-hint">🔍 Phóng to / thu nhỏ &amp; xoay dọc ngang</span>
        ${De.renderToolbarHtml("seedquiz",{showPanToggle:!1,extraClass:"sq-view-toolbar"})}
      </div>
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
        ${L}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${N}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${g.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${J(u.name)}">
                🌱 ${J(u.name)}: <strong>×${p}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${M}/8 câu)">
                🔥 <strong>${S}</strong> <small>(${M}/8)</small>
              </span>
              ${(()=>{const I=Date.now(),V=this.sim.getActiveConstructions(I);if(V.length===0)return"";const j=V[0],ue=ae(j.itemId),ne=Math.max(1,Math.ceil((j.constructEndsAt-I)/1e3)),be=this.sim.getBuildingMinFloorSec(j),ge=ne<=be;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${J(ue?.name??"Đang xây")}: <strong>${xe(ne)}</strong> <small>${ge?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${W}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${Mt(u.id)}" alt="${J(u.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${J(u.name)}</h3>
                <p>⏱️ <strong>${xe(u.growSec)}</strong> • 🌾 <strong>+${u.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${m}</strong></p>
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
                ${$?"":"disabled"}
              >
                🪙 +1 Hạt (-${b.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${C?"":"disabled"}
              >
                🪙 +3 Hạt (-${w.toLocaleString("vi-VN")}G)
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
                <input id="chkSqAutoSpeak" type="checkbox" ${c.autoSpeak?"checked":""} />
                <span>🔊 Tự đọc</span>
              </label>
            </div>

            <!-- 5 LANGUAGE TABS -->
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${Y}</div>

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
                📖 Từ Điển (${k.masteredCount}/${v.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(s,d):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${re}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${d.masteryScore}/100 (Quyển ${h}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${l.flag} <strong>Lv.${d.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${d.totalCorrect}/${d.totalAnswered}</strong> (${A}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4,d.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${d.streak}</strong></span>
                        <button
                          type="button"
                          class="sq-stat-pill sq-stat-pill-btn ${k.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${k.masteredCount}</strong> • 🔄 <strong>${k.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${D}</div>
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
    `,this.bindRenderedEvents(t);const le=t.querySelector("#sqScrollViewport");le&&(o>0||r>0)&&(le.scrollTop=o,le.scrollLeft=r)}getLexiconEntrySrsInfo(t,n){const a=t.srsBoxes??{};let i=0,o=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const c=a[`${r}${n}`];c&&(c.box>i&&(i=c.box),c.box<5&&c.dueAtTurn<=t.totalAnswered&&(o=!0))}return{box:i,due:o}}getLanguageLexiconEntries(t){return dn.filter(n=>n.lang===t).sort((n,a)=>n.levelBand-a.levelBand||n.id.localeCompare(a.id))}renderLexiconCodexPanel(t,n){const a=ht[t],i=this.getLanguageLexiconEntries(t);let o=0,r=0,c=0;for(const l of i){const{box:d}=this.getLexiconEntrySrsInfo(n,l.id);d>=5?o+=1:d>=1?r+=1:c+=1}const s=[{id:"all",label:`📖 Tất cả (${i.length})`},{id:"mastered",label:`🏆 Thuộc (${o})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${c})`}].map(l=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===l.id?"active":""}"
            data-sq-codex-filter="${l.id}"
            aria-pressed="${this.codexBoxFilter===l.id}"
          >${l.label}</button>
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
    `}renderLexiconCodexRowsHtml(t,n,a){const i=a??this.getLanguageLexiconEntries(t),o=this.codexQuery.trim().toLowerCase(),r=i.filter(s=>{const{box:l}=this.getLexiconEntrySrsInfo(n,s.id);return this.codexBoxFilter==="mastered"&&l<5||this.codexBoxFilter==="learning"&&(l<1||l>=5)||this.codexBoxFilter==="unseen"&&l>0?!1:o?s.word.toLowerCase().includes(o)||s.phonetic.toLowerCase().includes(o)||s.meaningVi.toLowerCase().includes(o)||s.exampleSentence.toLowerCase().includes(o)||s.exampleVi.toLowerCase().includes(o):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const c=r.map(s=>{const{box:l,due:d}=this.getLexiconEntrySrsInfo(n,s.id),u=as(s.meaningVi,s.word,s.id);let p="is-unseen",m=`✨ Quyển ${s.levelBand}`;return l>=5?(p="is-box5",m="🏆 Hộp 5/5 • Thuộc"):l>=1&&(p=d?"is-due":"is-learning",m=`📦 Hộp ${l}/5${d?" • Ôn":""}`),`
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
            <div class="sq-codex-srs ${p}">${m}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${i.length} mục từ</div>
      <div class="sq-codex-list" role="list">${c}</div>
    `}bindCodexRowSpeakEvents(t,n){t.querySelectorAll("[data-sq-codex-word]").forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.sqCodexWord??"",o=dn.find(r=>r.id===i);o&&Le(o.word,n,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.sqCodexEx??"",o=dn.find(r=>r.id===i);o&&Le(o.exampleSentence,n,.95)})})}renderChallengeStage(t){const n=ht[t.lang],a=Jn[t.format],i=Se[this.targetCropId],o=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),c=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",s=t.heroWord??t.stemText,l=t.heroPhonetic??t.stemPhonetic??"",d=t.heroShortVi??mn(t.translationVi);let u="";r==="pic_flashcard"?u=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${J(s)}</div>
            ${l?`<div class="sq-kid-ph-pill">[${J(l)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(u=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${c}" alt="${J(d)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${J(d)}</div>
            ${l?`<div class="sq-kid-ph-pill">🔊 [${J(l)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let p="";if(r==="pic_flashcard"||r==="word_flashcard"){const g=t.choices??[],b=t.choicePhonetics??[],w=t.choiceSprites??[],$=t.choiceSubtitles??[];p=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${g.map((C,h)=>{let A="";o&&(h===t.correctIndex?A="is-correct":h===this.selectedChoiceIdx?A="is-wrong":A="is-dimmed");const k=w[h]??c,v=$[h]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${A}"
                  data-sq-choice="${h}"
                  ${o?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${k}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${J(C)}</span>
                    ${r==="word_flashcard"&&b[h]?`<small class="sq-choice-ph">[${J(b[h])}]</small>`:o&&v?`<small class="sq-choice-ph">${J(v)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const g=t.choices??[],b=t.choicePhonetics??[],w=t.choiceSprites??[];p=`
        <div class="sq-bubble-arena">
          ${g.map(($,C)=>{let h="";o&&(C===t.correctIndex?h="is-correct is-popped":C===this.selectedChoiceIdx?h="is-wrong is-popped":h="is-dimmed");const A=w[C]??c;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${C%4} ${h}"
                  data-sq-choice="${C}"
                  ${o?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${A}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${J($)}</span>
                  ${b[C]?`<small class="sq-bubble-ph">[${J(b[C])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const g=t.shuffledTokens??[],b=t.expectedSentenceTokens??[],w=new Set(this.placedTokenIndices),$=b.map((h,A)=>{const k=this.placedTokenIndices[A],v=k!==void 0?g.find(S=>S.idx===k):void 0;return v?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${A}"
                ${o?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${J(v.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),C=g.map(h=>{const A=w.has(h.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${A?"used":""}"
              data-sq-place="${h.idx}"
              ${A||o?"disabled":""}
            >
              ${J(h.text)}
            </button>
          `}).join("");p=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${$}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${C}</div>
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
      `}else if(t.format==="match_pairs"){const g=t.leftCards??[],b=t.rightCards??[];p=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${n.flag} 🔊 Thẻ Từ</div>
            ${g.map(w=>{const $=this.matchedPairIds.has(w.pairId),C=this.selectedLeftPairId===w.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${$?"matched":""} ${C?"selected":""}"
                    data-sq-left-pair="${J(w.pairId)}"
                    ${$||o?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${J(w.word)}</span>
                    <small class="sq-pair-ph">[${J(w.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${b.map(w=>{const $=this.matchedPairIds.has(w.pairId),C=this.flashWrongPairKey===w.pairId,h=w.spriteSrc??as(w.meaningVi,w.word,w.pairId).spriteSrc,A=w.shortVi??mn(w.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${$?"matched":""} ${C?"wrong-flash":""}"
                    data-sq-right-pair="${J(w.pairId)}"
                    ${$||o?"disabled":""}
                  >
                    <img src="${h}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${J(A)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const m=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
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
        ${m}
      </div>
    `}renderVietnameseExplanationCard(t,n){const a=this.sim.getSeedCount(this.targetCropId),i=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",o=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,c=t.heroShortVi??mn(t.translationVi);return`
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
              <span>= 🇻🇳 <strong>${J(c)}</strong></span>
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
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqCropFilter;(d==="all"||d==="flowers"||d==="crops")&&(this.cropFilter=d,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqCrop;d&&Se[d]&&(this.targetCropId=d,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const l=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(l.msg,l.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const l=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(l.msg,l.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const n=t.querySelector("#chkSqAutoSpeak");n?.addEventListener("change",()=>{const l=this.sim.ensureLanguageQuiz();l.autoSpeak=n.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqLang,u=this.sim.ensureLanguageQuiz();d&&Tn.includes(d)&&u.activeLang!==d&&(this.challenge&&!this.answeredOutcome&&yt(u,this.challenge),u.activeLang=d,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(d,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqSubview;if((d==="practice"||d==="codex")&&this.activeSubView!==d){if(this.activeSubView=d,d==="codex"){const u=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(u.activeLang)}this.render()}})});const a=t.querySelector("#inpSqCodexSearch");a&&a.addEventListener("input",()=>{this.codexQuery=a.value;const l=t.querySelector("#sqCodexResultsMount");if(l){const d=this.sim.ensureLanguageQuiz(),u=d.activeLang;l.innerHTML=this.renderLexiconCodexRowsHtml(u,d.profiles[u]),this.bindCodexRowSpeakEvents(l,u)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqCodexFilter;(d==="all"||d==="mastered"||d==="learning"||d==="unseen")&&(this.codexBoxFilter=d,this.render())})});const i=t.querySelector("#sqCodexResultsMount");if(i){const l=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(i,l.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqTier,u=this.sim.ensureLanguageQuiz();(d==="beginner"||d==="intermediate"||d==="advanced")&&(this.challenge&&!this.answeredOutcome&&yt(u,this.challenge),ss(u,u.activeLang,d),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sqFormat,u=this.sim.ensureLanguageQuiz();$n.includes(d)&&u.preferredFormat!==d&&(this.challenge&&!this.answeredOutcome&&yt(u,this.challenge),u.preferredFormat=d,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const l=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(l,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const l=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(l,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge)return;const d=Number(l.dataset.sqSpeakWord??-1),u=this.challenge.vocabNotes[d];u&&Le(u.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const l=this.sim.ensureLanguageQuiz();yt(l,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(l.dataset.sqChoice??-1);this.selectedChoiceIdx=d;const u=d===(this.challenge.correctIndex??0);u?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(u)})});const o=()=>{if(!this.challenge||this.answeredOutcome)return!1;const l=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<l.length)return!1;const u=this.placedTokenIndices.map(m=>d.find(g=>g.idx===m)?.text??""),p=u.length===l.length&&u.every((m,g)=>m===l[g]);return p?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(p),!0};t.querySelectorAll("[data-sq-place]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(l.dataset.sqPlace??-1);if(d>=0&&!this.placedTokenIndices.includes(d)){this.placedTokenIndices.push(d),this.sim.audio.playMatchPop(1);const u=this.challenge.shuffledTokens?.find(m=>m.idx===d),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Le(u.text,this.challenge.lang,.95),o()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=Number(l.dataset.sqUnplace??-1);d>=0&&d<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(d,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const p=this.placedTokenIndices.length-1;if(d.find(g=>g.idx===this.placedTokenIndices[p])?.text===l[p])break;this.placedTokenIndices.pop()}const u=this.placedTokenIndices.length;if(u<l.length){const p=l[u],m=d.find(g=>g.text===p&&!this.placedTokenIndices.includes(g.idx));m&&(this.placedTokenIndices.push(m.idx),this.sim.audio.playMatchPop(1),o()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=this.challenge.expectedSentenceTokens??[],d=this.challenge.shuffledTokens??[],u=this.placedTokenIndices.map(m=>d.find(g=>g.idx===m)?.text??""),p=u.length===l.length&&u.every((m,g)=>m===l[g]);this.submitAttempt(p)}),t.querySelectorAll("[data-sq-left-pair]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=l.dataset.sqLeftPair??"";if(!d||this.matchedPairIds.has(d))return;this.selectedLeftPairId=d,this.flashWrongPairKey=null,this.sim.audio.playClick();const u=this.challenge.leftCards?.find(m=>m.pairId===d),p=this.sim.ensureLanguageQuiz();u&&p.autoSpeak&&Le(u.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(l=>{l.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const d=l.dataset.sqRightPair??"";if(!(!d||this.matchedPairIds.has(d))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===d){this.matchedPairIds.add(d),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const u=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=u){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=d,this.sim.audio.playClick(),this.render()}})});const r=t.querySelector("#sqScrollViewport"),c=t.querySelector("#sqZoomSizer"),s=t.querySelector("#sqZoomStage");De.bindDomScrollStageInteractions({rootScope:t,scrollViewportEl:r,sizerEl:c,contentStageEl:s,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}function T(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ut=["path","shop","creature","decor","staff"],Ct=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function ja(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function Wa(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},n=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.switchMinigame;e.closeHudPopovers(),!m||m==="match3"?e.openMatch3Dialog():m==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(m)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",n),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",n),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",n),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",n),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",n);const a=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",a),e.root.querySelector("#btnPlusSand")?.addEventListener("click",a),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const i=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",i),e.root.querySelector("#chipHudBarn")?.addEventListener("click",i),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=window.innerWidth>680;const m=e.selectedCatalogItem?.category;e.activeCategory=m&&Ut.includes(m)?m:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const m=p[0],g=ae(m.itemId);me(e.cam,m.gx+(g?.width??1)*.5,m.gy+(g?.height??1)*.5),e.inspectSelection={kind:"building",uid:m.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const o=e.root.querySelector("#btnHudRoundOrb");if(o){let p=null,m=0,g=0,b=0,w=0,$=!1;o.addEventListener("pointerdown",h=>{if(h.button!==0&&h.pointerType==="mouse")return;const A=o.getBoundingClientRect();p=h.pointerId,m=h.clientX,g=h.clientY,b=A.left,w=A.top,$=!1;try{o.setPointerCapture(h.pointerId)}catch{}}),o.addEventListener("pointermove",h=>{if(p!==h.pointerId)return;const A=h.clientX-m,k=h.clientY-g;if(!$&&Math.hypot(A,k)>7&&($=!0),$){const v=o.offsetWidth||52,S=o.offsetHeight||62,M=Math.max(6,Math.min(window.innerWidth-v-6,b+A)),L=Math.max(6,Math.min(window.innerHeight-S-6,w+k));o.style.left=`${Math.round(M)}px`,o.style.top=`${Math.round(L)}px`,o.style.right="auto",o.style.bottom="auto"}});const C=h=>{if(p===h.pointerId){p=null;try{o.hasPointerCapture(h.pointerId)&&o.releasePointerCapture(h.pointerId)}catch{}}};o.addEventListener("pointerup",C),o.addEventListener("pointercancel",C),o.addEventListener("click",h=>{if($){h.preventDefault(),h.stopPropagation(),$=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()});const r=p=>{const m=e.root.querySelector("#buildDrawer");if(!m)return;const g=Math.max(180,Math.round(m.clientWidth*.68))*p,b=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;m.scrollBy({left:g,behavior:b?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{r(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{r(1)}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const m=p.target;if(!m)return;const g=e.root.querySelector("#managePopoverMenu"),b=e.root.querySelector("#weatherPopoverMenu"),w=e.root.querySelector("#btnToggleManageMenu"),$=e.root.querySelector("#lblClock");g?.contains(m)||b?.contains(m)||w?.contains(m)||$?.contains(m)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const c=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",c),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",c);const s=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",s),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",s),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const l=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",l),e.root.querySelector("#btnOpenZones")?.addEventListener("click",l),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",l),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=Ct.findIndex(w=>w.mode===e.sim.heatmapMode),m=Ct[(p+1)%Ct.length];e.sim.heatmapMode=m.mode;const g=e.root.querySelector("#btnCycleHeatmap"),b=m.mode!=="none";g.textContent=m.label,g.setAttribute("data-active",String(b)),g.setAttribute("aria-pressed",String(b)),b&&e.showToast(`Đã bật ${m.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),m=document.createElement("a");m.href=p,m.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,m.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const g=p.currentTarget;g.textContent=e.questCollapsed?"+":"–",g.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const m=p.currentTarget;m.textContent=e.minimapCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(xt(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${Tt[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=Ut.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const d=p=>{const m=e.minimapCanvas.getBoundingClientRect(),g=(p.clientX-m.left)/m.width*e.minimapCanvas.width,b=(p.clientY-m.top)/m.height*e.minimapCanvas.height,w=e.minimapCanvas.width*.46/Dt,$=e.minimapCanvas.height*.44/Dt,C=(g-e.minimapCanvas.width*.5)/w,h=(b-8)/$,A=(C+h)*.5,k=(h-C)*.5,{fgx:v,fgy:S}=zi(A,k,e.cam.viewRot??0),M=Math.max(0,Math.min(Dt-1,v)),L=Math.max(0,Math.min(Dt-1,S));e.rideCamUid=null,me(e.cam,M,L)};let u=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{u=!0,d(p)}),window.addEventListener("pointermove",p=>{u&&d(p)}),window.addEventListener("pointerup",()=>{u=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.cat;Ut.includes(m)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===m?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=m,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{xt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${Tt[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(m=>m.itemId==="burrow_house_canon");p?me(e.cam,p.gx+1.5,p.gy+1.5):me(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")xt(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${Tt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")xt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${Tt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const m=e.sim.staff[0];m&&(e.pincerPicked={kind:"staff",id:m.id,label:m.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,me(e.cam,16,18),e.refreshFloatingBanner())})}function Qa(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const n=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!n),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),Gn(e),_n(e),nn(e),e.renderTutorialCoach()}function _s(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function Xa(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(tt(e),nt(e),e.closeSeedTray(),e.closePastureTray()),nn(e)}function nn(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const n=_s(e),a=e.hudRolledUp&&!e.photoModeActive&&!n;t.classList.toggle("hud-building-focus",n),t.classList.toggle("hud-compact-rolled",a);const i=e.root.querySelector("#btnToggleHudRollup");i&&(i.setAttribute("aria-pressed",String(e.hudRolledUp)),i.dataset.active=String(e.hudRolledUp),i.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const o=e.root.querySelector("#svgHudRollupChevron");o&&o.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const c=e.root.querySelector("#btnHudRoundOrb");c&&(c.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||n),c.setAttribute("aria-pressed",String(e.hudRolledUp)),c.dataset.rolled=String(e.hudRolledUp));const s=e.root.querySelector("#lblHudRoundOrbTag");s&&(s.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const l=e.root.querySelector("#svgRoundOrbChevron");l&&l.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),n&&(tt(e),nt(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function tt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const n=e.root.querySelector("#managePopoverMenu"),a=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu"),o=e.root.querySelector("#lblClock");n?.classList.add("hidden"),a?.classList.add("hidden"),i&&(i.setAttribute("aria-expanded","false"),i.setAttribute("data-active","false")),o&&o.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function nt(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function Ka(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function Ya(e){nt(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function Fn(e,t,n){if(!t||!n)return;const a=t.getBoundingClientRect(),i=Math.min(window.innerWidth-16,Math.max(248,n.offsetWidth||336)),o=Math.min(n.offsetHeight||420,window.innerHeight-16),r=a.left<window.innerWidth*.5?a.left:a.right-i,c=Math.max(8,Math.min(r,window.innerWidth-i-8)),s=Math.max(8,Math.min(a.bottom+8,window.innerHeight-o-8));n.style.left=`${Math.round(c)}px`,n.style.top=`${Math.round(s)}px`}function Za(e,t){if(e.sim.isVisitingNeighbor){tt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const n=typeof t=="boolean"?t:!e.manageMenuOpen;if(tt(e),!n)return;e.manageMenuOpen=!0;const a=e.root.querySelector("#managePopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu");a&&i&&(a.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),i.setAttribute("data-active","true"),Fn(e,i,a)),e.renderTutorialCoach()}function Ja(e,t){const n=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(tt(e),!n)return;e.weatherPopoverOpen=!0;const a=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#lblClock");a&&i&&(Vn(e),a.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),Fn(e,i,a)),e.renderTutorialCoach()}function Vn(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const n=Date.now(),a=e.sim.getCurrentWeather(n),i=e.sim.getWeatherForecast(4,n),o=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${o?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${a.icon} ${T(a.labelVi)}</div>
        <div class="weather-current-buff">✨ ${T(a.buffVi)}</div>
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
        ${i.map((r,c)=>{const s=c===0?"Nay":`+${Pe(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${c===0?"is-now":""}">
                <span>${r.icon} ${T(r.labelVi)}</span>
                <span class="weather-slot-meta">${T(s)}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelectorAll("[data-sim-speed]").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const s=r.dataset.simSpeed==="2"?2:1;e.sim.simSpeed=s,Jt(e),tt(e),We(e,s===2?"⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!":"🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.",s===2?"⚡":"🌿")})})}function Us(e,t){const n=e.root.querySelector("#lblGalleons");if(!n)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),n.textContent="∞",e.displayedGalleons=t;return}const a=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||a||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,n.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const i=e.displayedGalleons,o=performance.now(),r=420,c=s=>{const l=Math.min(1,(s-o)/r),d=1-Math.pow(1-l,3),u=Math.round(i+(t-i)*d);e.displayedGalleons=u,n.textContent=u.toLocaleString("vi-VN"),l<1?e.galleonRollRaf=requestAnimationFrame(c):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(c)}function eo(e,t,n,a,i){const o=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!o||!r)return;const c=()=>{o.classList.remove("hud-chip-pulse"),o.offsetWidth,o.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){c(),e.sim.audio.playFlyTick(0);return}const s=o.getBoundingClientRect();if(s.width<=0&&s.height<=0)return;const l=s.left+s.width*.5,d=s.top+s.height*.5,u=typeof a=="number"&&Number.isFinite(a)?Math.max(24,Math.min(window.innerWidth-24,a)):window.innerWidth*.5,p=typeof i=="number"&&Number.isFinite(i)?Math.max(24,Math.min(window.innerHeight-24,i)):window.innerHeight*.54,m={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},g=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(n))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,n)))));for(let b=0;b<g;b++){const w=document.createElement("div");w.className="fly-reward-token",w.dataset.kind=t,w.textContent=m[t],r.appendChild(w);const $=b/Math.max(1,g)*Math.PI*2+(Math.random()-.5)*.5,C=14+b%3*9,h=u+Math.cos($)*C,A=p+Math.sin($)*C*.7,k=(h+l)*.5+(b%2===0?-42:42),v=Math.min(A,d)-(48+b%3*18),S=560+b*48,M=b*52,L=w.animate([{transform:`translate3d(${h}px, ${A}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${h}px, ${A-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${k}px, ${v}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${l}px, ${d}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:S,delay:M,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});L.onfinish=()=>{w.remove(),c(),e.sim.audio.playFlyTick(b)}}}function to(e,t="🦉"){const n=e.trim();if(!n)return t.trim();const a=t.trim();if(!a)return n;const i=c=>c.replace(/\uFE0F/g,""),o=i(a);let r=n;for(;o&&i(r).startsWith(`${o} ${o}`);)r=r.slice(a.length).trimStart();return o&&i(r).startsWith(o)||a==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${a} ${r}`}function We(e,t,n="🦉"){const a=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!a)return;const i=Array.from(e.root.querySelectorAll("dialog[open]")),o=i.length>0?i[i.length-1]:null;o?a.parentElement!==o&&(o.appendChild(a),o.addEventListener("close",()=>{const c=Array.from(e.root.querySelectorAll("dialog[open]")),s=c.length>0?c[c.length-1]:e.root;a.parentElement!==s&&s.appendChild(a)},{once:!0})):a.parentElement!==e.root&&e.root.appendChild(a);const r=document.createElement("div");r.className="parchment-dark owl-toast",r.textContent=to(t,n),a.appendChild(r),window.setTimeout(()=>r.remove(),3500)}function no(e,t){const n=Math.max(1,Math.round(t.awaySeconds/60)),a=e.root.querySelector("#offlineDialogContent");a.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${n} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function Gn(e){const t=e.root.querySelector("#floatingModeBanner"),n=e.root.querySelector("#floatingBannerText"),a=e.root.querySelector("#btnFloatingSecondary"),i=e.root.querySelector("#btnFloatingSwap"),o=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!n||!a||!i||!o)){if(i.classList.add("hidden"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const r=e.sim.state.buildings.find(s=>s.uid===e.rideCamUid),c=r?ae(r.itemId):void 0;if(!r||!c)e.rideCamUid=null;else{t.classList.remove("hidden"),n.textContent=`🎥 ${c.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,a.textContent="🧭 90°",a.classList.remove("hidden"),o.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),n.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Nhấp ô để thả`:"🤏 Điều phối nhân sự (G) — Nhấp ô cử tới • G/Esc thoát",a.classList.add("hidden"),o.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const r=e.sim.state.buildings.find(s=>s.uid===e.movingBuildingUid),c=r?ae(r.itemId):void 0;n.textContent=`✋ ${c?.name??"Dời chỗ"}`,a.textContent=`🔄 ${e.rotation*90}°`,a.classList.remove("hidden"),o.textContent="✕"}else n.textContent="✋ Chọn công trình để dời",a.classList.add("hidden"),o.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),n.textContent="🧹 Phá dỡ",a.classList.add("hidden"),o.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const r=e.selectedCatalogItem,c=r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence,s=e.sim.getEffectiveItemStarCost(r),l=s>0?`🌟 ${s}`:r.cost===0?"0G":`${r.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),n.textContent=`🏗️ ${r.name} • ${l}`,c?(a.textContent=`🔄 ${e.rotation*90}°`,a.classList.remove("hidden")):a.classList.add("hidden"),i.textContent="📦 Đổi",i.classList.remove("hidden"),o.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const r=Se[e.activeSeedCropId],c=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),n.textContent=`🌱 ${r.emoji} ${r.name} (${c})`,a.textContent="🌱 Đổi",a.classList.remove("hidden"),o.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const r=et[e.activePastureAnimalId];t.classList.remove("hidden"),n.textContent=`🐾 ${r.emoji} ${r.name} (${r.cost.toLocaleString("vi-VN")}G)`,a.textContent="🐾 Đổi",a.classList.remove("hidden"),o.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),n.textContent="👁️ Nhìn xuyên",a.classList.add("hidden"),o.textContent="✕";return}t.classList.add("hidden")}}function _n(e){const t=e.root.querySelector("#touchConfirmBar"),n=e.root.querySelector("#lblTouchConfirm");if(!(!t||!n)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),n.textContent=`📍 ${e.pendingTouchTile.label}`}}function Zt(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),js(e),Qs(e),Xs(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),Gn(e),_n(e),nn(e),e.renderTutorialCoach()}function Jt(e){const t=new Date,n=String(t.getHours()).padStart(2,"0"),a=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const i=e.sim.getCurrentWeather(t.getTime()),o=e.root.querySelector("#lblClock");if(o){const p=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";o.innerHTML=`${i.icon} <span>${n}:${a}</span>${p}`}e.weatherPopoverOpen&&Vn(e);const r=e.sim.getActiveFestival(t),c=e.root.querySelector("#lblFestival");c&&(r==="halloween"?(c.classList.remove("hidden"),c.textContent="🎃 +35% XP"):r==="christmas"?(c.classList.remove("hidden"),c.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(c.classList.remove("hidden"),c.textContent="🏆 +Cúp"):c.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const s=e.sim.state,l=e.root.querySelector("#lblPuzzleHearts");if(l&&s.match3)if(s.sandboxMode)l.textContent="∞";else if(s.match3.hearts>=Xt)l.textContent=`${s.match3.hearts}/${Xt}`;else{const p=Math.max(0,Math.ceil((s.match3.nextHeartAt-Date.now())/1e3)),m=Math.floor(p/60),g=String(p%60).padStart(2,"0");l.textContent=`${s.match3.hearts} (${m}:${g})`}const d=e.root.querySelector("#btnHudActiveBuilds"),u=e.root.querySelector("#lblActiveBuilds");if(d&&u){const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)d.classList.add("hidden");else{d.classList.remove("hidden");const m=Math.max(1,Math.ceil((p[0].constructEndsAt-Date.now())/1e3));u.textContent=`${p.length} (${Pe(m)})`}}}function js(e){const t=e.sim.state,n=e.sim.getRequiredLevelTrial(),a=Math.max(0,t.xp)%St,i=Math.max(6,Math.min(100,a/St*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+$s(t.level),e.root.querySelector("#barXpFill").style.width=`${i}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const _=e.sim.getActiveVisitingNeighbor();r.textContent=_?`🚂 Thăm: ${_.avatarEmoji} ${_.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const c=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getTotalTowerClearedStages(),l=t.level>=Ue?100:Math.min(100,Math.max(8,Math.round(c.current/Math.max(1,c.required)*100))),d=e.root.querySelector("#btnOpenRoadmap");d&&(d.style.setProperty("--hg-lvl-pct",String(l)),d.title=t.level>=Ue?`👑 Cấp Tối Đa ${Ue} • Rương XP: ${a}/${St} • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${c.current}/${c.required} màn • Rương XP: ${a}/${St}`);const u=e.root.querySelector("#barLevelTopFill");u&&(u.style.width=`${l}%`,u.parentElement&&(u.parentElement.title=t.level>=Ue?`👑 Đã đạt Cấp Tối Đa ${Ue} • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${c.current}/${c.required} màn mới • Tháp 5 Môn: ${s.cleared.toLocaleString("vi-VN")}/${s.total.toLocaleString("vi-VN")} Màn`));const p=e.root.querySelector("#lblXpFraction");p&&(p.textContent=`🎁 ${a}/${St}`);const m=e.sim.ensureFarmBarn(),g=e.sim.getBarnTotalUsed(),b=e.root.querySelector("#lblStorageBarn");b&&(b.textContent=`${g}/${m.capacity}`),Us(e,t.galleons);const w=t.sandboxMode?"∞":String(t.match3?.stars??0),$=e.root.querySelector("#lblPuzzleStars");$&&t.match3&&($.textContent=w);const C=e.root.querySelector("#lblHudHubStars");C&&(C.textContent=w);const h=e.root.querySelector("#lblHudHubTrial");h&&(t.level>=Ue||t.sandboxMode||e.sim.isHeadmasterPreview||!n?h.textContent=`♟️ ${s.cleared}/${s.total}`:h.textContent=`🔥 ${n.icon} ${c.current}/${c.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const A=e.sim.getDisciplineStageInfo("match3"),k=e.sim.getLastPlayedMinigame();let v="🍬 Bùa Gặt",S="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",M=A.isMaxed?`👑 ${Re}`:`Màn ${A.currentStage}`;if(k==="caro"){const _=e.sim.getDisciplineStageInfo("caro");v="🗺️ Ngũ Ấn",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=_.isMaxed?`👑 ${Re}`:`Màn ${_.currentStage}`}else if(k==="sudoku"){const _=e.sim.getDisciplineStageInfo("sudoku");v="🔢 Số Học",S="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",M=_.isMaxed?`👑 ${Re}`:`Màn ${_.currentStage}`}else if(k==="blocks"){const _=e.sim.getDisciplineStageInfo("blocks");v="🦄 Sinh Vật",S="/trang-trai-hang-soc/sprites/beast_niffler.png",M=_.isMaxed?`👑 ${Re}`:`Màn ${_.currentStage}`}else if(k==="chess"){const _=e.sim.getDisciplineStageInfo("chess");v="🏰 Cờ Phù Thủy",S="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=_.isMaxed?`👑 ${Re}`:`Màn ${_.currentStage}`}else k==="seedquiz"&&(v="🪄 Thần Chú",S="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",M="Ôn Tập");const L=e.root.querySelector("#imgCornerPlayIcon");L&&L.getAttribute("src")!==S&&L.setAttribute("src",S);const O=e.root.querySelector("#badgeCornerPlayBonus");O&&(O.textContent=v,O.classList.remove("hidden"));const R=e.root.querySelector("#lblCornerPlayStage");R&&(R.textContent=M);const q=e.root.querySelector("#lblCornerPlaySub");q&&(q.textContent=t.level>=Ue?`👑 Cấp ${Ue}`:`Cấp ${t.level+1} (${c.current}/${c.required})`);const B=e.root.querySelector("#btnCornerPlayPuzzle");if(B){const _=`Chơi tiếp ${v} — ${M}`;B.title=_,B.setAttribute("aria-label",_)}e.root.querySelectorAll("[data-switch-minigame]").forEach(_=>{const ve=_.dataset.switchMinigame===k;_.dataset.active=String(ve),_.setAttribute("aria-pressed",String(ve))});const N=e.root.querySelector("#badgeBuildReadyCount");if(N){const _=new Set(t.buildings.map(Ce=>Ce.itemId)),ve=t.sandboxMode?999:t.match3?.stars??0,we=ks.filter(Ce=>{if(Ce.isThemeParkLegacy)return!1;const Xe=$i(Ce);return Xe<=0||!t.sandboxMode&&t.level<Ce.unlockLevel?!1:!_.has(Ce.id)&&ve>=Xe}).length;we>0&&!e.sim.isHeadmasterPreview?(N.textContent=String(we),N.classList.remove("hidden")):N.classList.add("hidden")}const W=e.root.querySelector("#lblMatch3Lv");W&&t.match3&&(W.textContent=A.isMaxed?`👑${Re}`:`${A.currentStage}/${Re}`);const Y=e.root.querySelector("#lblArcadeTowerLv");if(Y){const _=Math.max(0,s.cleared-A.clearedStages),ve=Re*4;Y.textContent=_>=ve?`👑${ve}`:`${_}/${ve}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const de=e.sim.getActiveStoryQuest(),re=e.sim.getReadyOwlOrdersCount(),D=(de?.completed?1:0)+t.owlQuests.filter(_=>_.completed&&!_.claimed).length+t.dailyQuests.filter(_=>_.completed&&!_.claimed).length,X=re+D,le=X>0?X:m.owlOrders.length,I=e.root.querySelector("#badgeQuestCount");le>0?(I.textContent=String(le),I.classList.toggle("is-ready-green",re>0),I.classList.remove("hidden")):I.classList.add("hidden");const V=t.supply.cargoCrates.filter(_=>!_.fulfilled&&(t.sandboxMode||(t.supply.goods[_.goodId]??0)>=_.qtyRequired)).length,j=e.root.querySelector("#badgeWorkshopCount");j&&(V>0?(j.textContent=String(V),j.classList.remove("hidden")):j.classList.add("hidden"));const ne=Object.values(t.housePoints).reduce((_,ve)=>_+ve,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!ne),e.refreshSuitcaseBadge();const ge=e.root.querySelector("#badgeSuitcaseCount"),te=ge&&!ge.classList.contains("hidden")?Math.max(0,Number.parseInt(ge.textContent||"0",10)||0):0,Qe=e.sim.getClaimableHarvestFeastCount(),oe=e.root.querySelector("#badgeManageMenuDot");if(oe){const _=V+(ne?1:0)+Qe+te;_>0?(oe.textContent=String(_),oe.classList.remove("hidden")):oe.classList.add("hidden")}Ws(e),Jt(e);const fe=e.root.querySelector("#btnCycleHeatmap");if(fe){const _=Ct.find(we=>we.mode===e.sim.heatmapMode)??Ct[0],ve=e.sim.heatmapMode!=="none";fe.textContent=_.label,fe.dataset.active=String(ve),fe.setAttribute("aria-pressed",String(ve))}Jt(e)}function Ws(e){const t=e.sim.state,n=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,a=t.buildings.some(o=>!!ae(o.itemId)?.isCreatureHabitat),i=(t.match3?.hearts??Xt)>=Xt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",i),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",n&&!a),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",n&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const o=e.root.querySelector("#btnToggleMinimap");o&&(o.textContent="–",o.setAttribute("aria-expanded","true"))}}function Qs(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const n=e.sim.state,a=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const i=e.sim.getActiveStoryQuest(),o=n.owlQuests.slice(0,2);let r="";if(a&&!n.sandboxMode&&!e.sim.isHeadmasterPreview){const c=e.sim.getWinsProgressForCurrentLevel(),s=e.sim.getDisciplineStageInfo(a.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${a.icon} ${T(a.shortVi)} (${s.currentStage}/${Re}) • ${c.current}/${c.required}</span>
            <button type="button" data-open-trial="${a.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(i){const c=Math.min(100,Math.round(i.progress/Math.max(1,i.targetAmount)*100)),s=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${T(i.giverEmoji)} ${T(i.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${c}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(i.progress,i.targetAmount)}/${i.targetAmount}</span>
            ${i.completed?`<button type="button" data-claim="${T(i.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${i.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${T(s.longLabel)}">${T(s.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const c of o){const s=Math.min(100,Math.round(c.progress/Math.max(1,c.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${T(c.giverEmoji)} ${T(c.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${s}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(c.progress,c.targetAmount)}/${c.targetAmount}</span>
            ${c.completed?`<button type="button" data-claim="${T(c.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${c.rewardGalleons}🪙 +${c.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(c=>{c.addEventListener("click",()=>{e.sim.claimQuest(c.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(c=>{c.addEventListener("click",()=>{e.openTrialMinigame(c.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(c=>{c.addEventListener("click",()=>{const s=e.sim.completeStoryStepWithStar();if(s.ok){typeof s.placedGx=="number"&&typeof s.placedGy=="number"&&me(e.cam,s.placedGx,s.placedGy);return}We(e,s.msg,s.reason==="missing_gold"?"🪙":"🌟"),(s.reason==="missing_stars"||s.reason==="locked_level"||s.reason==="open_match3")&&e.openTrialMinigame()})})}function Xs(e){const t=(b,w)=>{b&&(b.setAttribute("data-active",String(w)),b.setAttribute("aria-pressed",String(w)))};e.root.querySelectorAll("[data-cat]").forEach(b=>{t(b,b.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const n=e.root.querySelector("#btnRotateCam");if(n){const b=e.cam.viewRot??0;n.textContent=Tt[b],t(n,b!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const a=e.mapToolsExpanded,i=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");i&&i.classList.toggle("hidden",!a),o&&(o.setAttribute("aria-expanded",String(a)),t(o,a));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,c=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),c);const l=e.root.querySelector("#buildDrawer"),d=e.root.querySelector("#buildDrawerSwipeBar"),u=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Ut.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,l.classList.add("hidden"),d?.classList.add("hidden"),u.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(l.classList.remove("hidden"),u.classList.add("hidden"),e.activeCategory==="staff"){Ks(e,l),ys(e,l);return}const p=ks.filter(b=>b.category===e.activeCategory&&b.category!=="terrain"&&!b.isThemeParkLegacy),m=e.sim.state.level,g=e.sim.state.sandboxMode;l.innerHTML=p.map(b=>{const w=!g&&m<b.unlockLevel,$=e.selectedCatalogItem?.id===b.id,C=b.elevationDelta?b.elevationDelta>0?"⛰️":"⛏️":b.isCoasterTrackPiece?"🛤️":b.isZooFence?"🚧":b.isBench?"🪑":b.category==="path"?"🛣️":b.category==="terrain"?"🌿":"🕯️",h=b.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${b.spriteKey}.png" alt="${b.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${C}</div>`,A=e.sim.getEffectiveItemStarCost(b),k=b.buildDurationSec>0?`🔨 ${xe(b.buildDurationSec)}`:"⚡",v=w?`🔒 Cấp ${b.unlockLevel}`:A>0?`🌟 ${A} • ${k}`:`🪙 ${b.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${w?"locked":""}"
            data-item-id="${b.id}"
            data-selected="${$}"
            aria-pressed="${$}"
            ${w?'aria-disabled="true"':""}
          >
            ${h}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${T(b.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${v}</div>
          </button>
        `}).join(""),l.querySelectorAll("[data-item-id]").forEach(b=>{b.addEventListener("click",()=>{const w=ae(b.dataset.itemId);if(!w)return;if(!e.sim.state.sandboxMode&&e.sim.state.level<w.unlockLevel){const C=e.sim.getWinsProgressForCurrentLevel();let h=Math.max(1,C.required-C.current);for(let A=e.sim.state.level+1;A<w.unlockLevel;A++)h+=ki(A);We(e,`🔒 Bản vẽ "${w.name}" mở ở Cấp Giải Đố ${w.unlockLevel} — Cần thắng thêm ${h.toLocaleString("vi-VN")} màn Giải Đố mới!`,"🧩"),e.openTrialMinigame();return}const $=e.sim.getEffectiveItemStarCost(w);if(!e.sim.state.sandboxMode&&$>0&&e.sim.state.match3.stars<$){const C=$-e.sim.state.match3.stars;We(e,`Cần thêm ${C} 🌟 Sao Phép Thuật (${e.sim.state.match3.stars}/${$} 🌟) để dựng "${w.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,"🌟"),e.openTrialMinigame();return}e.selectedCatalogItem=w,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,nt(e),Zt(e)})}),ys(e,l)}function Ks(e,t){const n=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],a=new Set(e.sim.state.unlockedZones),i=c=>`<option value="all" ${c==="all"?"selected":""}>🗺️ Toàn công viên</option>`+Nn.filter(s=>e.sim.state.sandboxMode||a.has(s.id)).map(s=>`<option value="${s.id}" ${c===s.id?"selected":""}>📍 ${s.name}</option>`).join(""),o=n.map(c=>{const s=e.sim.state.staffHired[c.key],l=s>=Nt,d=c.baseCost*(1+s);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${c.icon} <span style="font-size:12px;font-weight:800;">${s}/${Nt}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${c.name}</div>
            <button
              type="button"
              data-hire="${c.key}"
              class="brass-btn ${l?"":"gold-cta"}"
              ${l?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${l?`✓ ${Nt}/${Nt}`:`+ 🪙 ${d}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(c=>{const s=e.sim.state.staffPatrolZones?.[c.id]??c.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${T(c.name)}</div>
            <select data-patrol-staff="${T(c.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${i(s)}
            </select>
            <button type="button" data-pick-staff="${T(c.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=o+r,t.querySelectorAll("[data-hire]").forEach(c=>{c.addEventListener("click",()=>{const s=c.dataset.hire;e.sim.hireStaff(s)&&(nt(e),Zt(e),We(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(c=>{c.addEventListener("change",()=>{const s=c.dataset.patrolStaff;e.sim.setStaffPatrolZone(s,c.value),We(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(c=>{c.addEventListener("click",()=>{const s=e.sim.staff.find(l=>l.id===c.dataset.pickStaff);s&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},nt(e),Zt(e),We(e,`Đang gắp ${s.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}const so={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏭 Xưởng & Cửa Tiệm",creature:"🦄 Đồng Cỏ & Thú Phép",decor:"🌸 Vườn Hoa & Cảnh Quan",staff:"🧙 Phụ Tá Điền Trang"};function ys(e,t){const n=e.root.querySelector("#buildDrawerSwipeBar"),a=e.root.querySelector("#buildDrawerCatLabel"),i=e.root.querySelector("#btnDrawerScrollPrev"),o=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const c=Array.from(t.querySelectorAll(".catalog-card"));if(!n||c.length===0||!e.activeCategory){n?.classList.add("hidden");return}if(a){const g=so[e.activeCategory]??"🏗️ Danh Mục Xây Dựng";a.textContent=`${g} (${c.length})`}n.classList.remove("hidden");const s=t.querySelector('.catalog-card[data-selected="true"]');s&&typeof s.scrollIntoView=="function"&&s.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const l=c[0],d=c[c.length-1];let u=!0,p=c.length<=2;const m=()=>{const g=!u||!p||t.scrollWidth>t.clientWidth+6;i&&(i.disabled=u,i.classList.toggle("hidden",!g)),o&&(o.disabled=p,o.classList.toggle("hidden",!g)),r&&r.classList.toggle("hidden",!g),t.dataset.scrollStart=String(!u),t.dataset.scrollEnd=String(!p)};if(typeof IntersectionObserver<"u"){const g=new IntersectionObserver(b=>{for(const w of b)w.target===l&&(u=w.intersectionRatio>=1),w.target===d&&(p=w.intersectionRatio>=1);m()},{root:t,threshold:1,rootMargin:"2px"});g.observe(l),d!==l&&g.observe(d),e.drawerEdgeObserver=g}m()}function io(e){const t=e.mapToolsExpanded,n=e.root.querySelector("#secondaryMapToolsBar"),a=e.root.querySelector("#btnToggleMapTools");n&&n.classList.toggle("hidden",!t),a&&(a.setAttribute("aria-expanded",String(t)),a.setAttribute("data-active",String(t)),a.setAttribute("aria-pressed",String(t)))}function pe(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const n=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(n!==e.lastInspectedKey&&(e.lastInspectedKey=n,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const a=e.inspectSelection.uid,i=e.sim.state.buildings.find(q=>q.uid===a);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=ae(i.itemId),r=Date.now(),c=r<i.constructEndsAt,s=Math.max(0,Math.ceil((i.constructEndsAt-r)/1e3)),l=e.sim.getBuildingProductionPerCycle(i,o),d=Fi(o,i.stars),u=(e.sim.rideQueues.get(i.uid)??[]).length,p=e.sim.isBuildingConnected(i.uid),m=e.sim.activeSynergies.buildingGoldMult.get(i.uid)??1,g=e.sim.activeSynergies.buildingXpMult.get(i.uid)??1,b=o.category==="ride"&&!o.isCoasterTrackPiece,w=!!o.isCustomCoasterStation&&!c,$={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},C=o.isCreatureHabitat?e.sim.biomeCache.get(i.uid):void 0,h=o.isBackstage?e.sim.backstageCache.get(i.uid):void 0,A=!!o.ticketPrice&&!c&&!o.workshopGroupId,k=Vi(o),v=e.sim.getEffectivePrice(i,o),S=e.sim.getPriceValueVerdict(i,o),M=o.isFarmlandPlot&&!c?(()=>{if(!i.cropId){const I=Object.values(Se).sort((oe,fe)=>oe.unlockLevel-fe.unlockLevel||oe.growSec-fe.growSec),V=I.filter(oe=>oe.isFlowerCrop).length,j=I.length-V,ue=I.filter(oe=>e.seedFilterMode==="flowers"?!!oe.isFlowerCrop:e.seedFilterMode==="crops"?!oe.isFlowerCrop:!0),ne=[{id:"all",label:`🌱 (${I.length})`},{id:"flowers",label:`🌸 (${V})`},{id:"crops",label:`🌾 (${j})`}].map(oe=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===oe.id?"active":""}"
                        data-insp-seed-filter="${oe.id}"
                        aria-pressed="${e.seedFilterMode===oe.id}"
                      >${oe.label}</button>
                    `).join(""),be=ue.map(oe=>{const fe=!e.sim.state.sandboxMode&&e.sim.state.level<oe.unlockLevel,_=e.sim.getSeedCount(oe.id),ve=e.sim.getFarmItemCount(oe.id),we=xe(oe.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${fe?"locked":""} ${!fe&&_<=0?"out-of-seeds":""}"
                        data-plant-crop="${oe.id}"
                        ${fe?"disabled":""}
                      >
                        <img src="${Mt(oe.id)}" alt="${T(oe.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${T(oe.name)}</span>
                        <span class="seed-card-seed-badge ${_>0?"has-seed":"no-seed"}">
                          ${fe?`🔒 Lv.${oe.unlockLevel}`:_>0?`🌱 ×${_}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${fe?`⏱️ ${we}`:`⏱️ ${we} • 🪙${oe.seedCost}G`}
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
                `}const q=Se[i.cropId],B=i.cropReadyAt??r,N=i.cropPlantedAt??B-q.growSec*1e3,W=Math.max(0,Math.ceil((B-r)/1e3)),Y=W<=0,de=e.sim.state.cropMastery?.[q.id]??0,re=Ai(de),D=Math.max(0,e.sim.state.morningDewPhials??0),X=q.yieldQty*(i.cropRotatedBonus?2:1),le=Y?100:Math.max(6,Math.min(98,Math.round((r-N)/Math.max(1e3,B-N)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${Mt(q.id)}" alt="${T(q.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${T(q.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${re.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${Y?"🌾 Chín!":`⏱️ ${Pe(W)}`}${i.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${de} vụ • Họ ${Ci(q.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${le}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${Y?`
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
                    ${!Y&&(D>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${D})
                          </button>`:""}
                  </div>
                </div>
              `})():"",L=o.workshopGroupId&&!c?(()=>{const q=e.sim.getWorkshopRecipesForBuilding(o),B=i.workshopQueue??[],N=i.readyFarmGoods??[],W=3+Math.min(2,Math.max(0,i.stars-1)),Y=N.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${N.slice(0,5).map(I=>{const V=rt[I];return`<img src="/trang-trai-hang-soc/sprites/${V.iconKey}.png" alt="${T(V.name)}" title="${T(V.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${N.length})
                      </button>
                    </div>
                  `:"",de=q.map(I=>{const V=rt[I.goodId],j=I.name??V.name,ue=I.name&&I.name!==V.name?`title="Ra lò thành phẩm: ${T(V.name)}"`:"",ne=!e.sim.state.sandboxMode&&e.sim.state.level<I.unlockLevel,be=!ne&&(e.sim.state.sandboxMode||I.inputs.every(te=>e.sim.getFarmItemCount(te.itemId)>=te.qty)),ge=I.inputs.map(te=>{const Qe=Ne(te.itemId),oe=e.sim.getFarmItemCount(te.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||oe>=te.qty?"ok":"lack"}">${T(Qe.name)} ${e.sim.state.sandboxMode?"∞":oe}/${te.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${be?"craftable":""} ${ne?"locked":""}"
                      data-ws-enqueue="${I.id}"
                      ${ue}
                      ${ne?"disabled":""}
                    >
                      <div class="ws-recipe-name">${T(j)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${V.iconKey}.png" alt="${T(j)}" class="ws-recipe-img" />
                        ${be?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${ne?`🔒 Lv.${I.unlockLevel}`:ge}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${xe(I.craftSec)}</div>
                    </button>
                  `}).join(""),re=B[0],D=re?Math.max(0,Math.ceil((re.endsAt-r)/1e3)):0,X=re?rt[re.goodId]:null,le=Array.from({length:Math.max(1,W-1)},(I,V)=>{const j=B[V+1];if(j){const ue=rt[j.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${T(ue.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${ue.iconKey}.png" alt="${T(ue.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return V===B.length-(re?1:0)?`
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
                    <span>🔥 ${T(o.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${Y}
                  <div class="ws-recipe-grid">${de}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${re?"baking":""}">
                      <div class="ws-oven-arch">
                        ${X?`<img src="/trang-trai-hang-soc/sprites/${X.iconKey}.png" alt="${T(X.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${re?`<strong>${Pe(D)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${re?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${le}</div>
                  </div>
                </div>
              `})():"",O=o.isAnimalPasturePlot&&!c?(()=>{if(!i.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(et).map(X=>{const le=!e.sim.state.sandboxMode&&e.sim.state.level<X.unlockLevel,I=X.goodId?Ne(X.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${le?"locked":""}"
                        data-stock-animal="${X.id}"
                        ${le?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${X.spritePair[0]}.png" alt="${T(X.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${T(X.name)}</span>
                        <span class="seed-card-seed-badge ${le?"no-seed":"has-seed"}">
                          ${le?`🔒 Lv.${X.unlockLevel}`:`🪙 ${X.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${xe(X.cycleSec)} • +${X.sellValue}G</span>
                        <span class="seed-card-stock">${I?`+${X.yieldQty} ${T(I.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const q=et[i.pastureAnimalId],B=i.pastureReadyAt??r,N=i.pastureStockedAt??B-q.cycleSec*1e3,W=Math.max(0,Math.ceil((B-r)/1e3)),Y=W<=0,de=Y?100:Math.max(6,Math.min(98,Math.round((r-N)/Math.max(1e3,B-N)*100))),re=q.goodId?Ne(q.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${q.spritePair[0]}.png" alt="${T(q.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${T(q.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${Y?`🧺 +${q.sellValue}G${re?` +${q.yieldQty} ${T(re.name)}`:""}`:`⏱️ ${Pe(W)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${de}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${Y?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${q.sellValue}G)
                          </button>
                        `:i.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!Y&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((o.workshopGroupId||o.isFarmlandPlot||o.isAnimalPasturePlot)&&!c)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${o.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${o.spriteKey}.png" alt="${T(o.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${T(o.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(i.stars)}${"☆".repeat(5-i.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${o.isFarmlandPlot?"🌱 Ruộng":o.isAnimalPasturePlot?"🐾 Đồng cỏ":o.connectableGroup==="flower_garden"?"🌸 Vườn hoa":o.workshopGroupId?"🔥 Xưởng":`👥 ${i.visitorsServed}`}${b?` • 🎟️ ${u}/${Gi}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${M}
        ${O}
        ${L}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${p?"#15803d":"#dc2626"};">
            ${p?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${m>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((m-1)*100)}%G • +${Math.round((g-1)*100)}%XP</div>`:""}
          ${o.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${Lt[o.producesIngredient].emoji} ${Lt[o.producesIngredient].name}</strong></div>`:""}
        </div>

        ${c?(()=>{const q=Math.max(0,i.buildReducedSec??0),B=Math.max(1e3,o.buildDurationSec*1e3,i.constructEndsAt-(i.placedAt||r-1e3)+q*1e3),N=Math.max(1,Math.min(99,Math.floor((1-(i.constructEndsAt-r)/B)*100))),W=e.sim.getBuildingMinFloorSec(i),Y=Math.max(0,s-W),de=Y<=0&&e.sim.getActiveConstructions(r).some(X=>X.uid!==i.uid&&Math.ceil((X.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(X)),re=Y>0||de,D=o.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${o.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${N}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${N}" aria-label="${D}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${Pe(s)}</strong>${q>0?` • <span style="color:var(--teal-deep);">-${xe(q)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${re?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${re?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${Y>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
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
              `:o.baseIncome>0?(()=>{const q=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,B=Mi(i,o),N=Math.max(1,B*q),W=Math.max(0,(r-(i.lastTickAt||r))/1e3),Y=Math.max(1,Math.ceil(N-W%N));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${l.galleons}🪙 +${l.xp}⭐</strong> / ${xe(B)}</div>
                      ${o.cycleSec>0&&!o.isFarmlandPlot&&!o.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${Pe(Y)}</strong> • Kho: <strong>${i.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${i.storedGalleons}🪙</strong></div>`}
                      ${i.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${i.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${b&&!c&&!o.isFlooPortal?`
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

        ${A?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${k.min}–${k.max}G):</span>
                  <span id="lblBuildingPriceVal">${v}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${k.min}" max="${k.max}" value="${v}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${S.color};">
                  ${S.label}
                </div>
              </div>
            `:""}

        ${o.isCustomCoasterStation&&i.coasterStats&&!c?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${i.coasterStats.lengthMeters}m • 🔥 ${i.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `:""}

        ${w?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🎥 Ride Cam
              </button>
            `:""}

        ${(o.isWorkshopBrewery||o.producesIngredient||o.isFireworksLauncher)&&!c?`
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">
                  🧪 Xưởng
                </button>
                ${o.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">🎆 Pháo Hoa</button>':""}
              </div>
            `:""}

        ${o.isCreatureHabitat&&!c?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>🐾 ${T(i.creatureNickname||o.creatureName||o.name)}</strong>
                  <span class="morph-pill ${i.creatureMorph==="radiant"?"radiant":i.creatureMorph==="mystic"?"mystic":""}">
                    ${Oe[i.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${i.creatureBondLevel??1}/${wt} • ${$[i.creatureStage??"baby"]} • 🌿 ${C?.score??50}% • 🥩 ${Math.round(i.creatureHunger??90)}%</div>
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

        ${o.isBackstage&&h&&!c?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${h.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${h.shieldCount}/${h.needed} ${h.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!c&&i.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${i.stars+1}★ (🌟${Li(i.stars)} + 🪙${d.toLocaleString("vi-VN")})
                </button>`:c?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${i.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const R=t.querySelector("#inpBuildingPrice");R&&(e.wireRangeProgressFallback(R),R.addEventListener("input",()=>{const q=Number(R.value);e.sim.setBuildingCustomPrice(i.uid,q);const B=e.sim.getEffectivePrice(i,o),N=t.querySelector("#lblBuildingPriceVal");N&&(N.textContent=`${B} Galleon`);const W=e.sim.getPriceValueVerdict(i,o),Y=t.querySelector("#lblPriceVerdict");Y&&(Y.textContent=W.label,Y.style.color=W.color);const de=e.sim.getBuildingProductionPerCycle(i,o),re=t.querySelector("#lblBuildingProdVal");re&&(re.textContent=`+${de.galleons} 🪙 & +${de.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(i.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(i.uid,!0),pe(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(q=>{q.addEventListener("click",()=>{const B=e.sim.useMorningDewPhial(i.uid);e.showToast(B.msg,B.ok?"🧪":"⏳"),pe(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const q=i.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",q)}),t.querySelectorAll("[data-plant-crop]").forEach(q=>{q.addEventListener("click",()=>{const B=q.dataset.plantCrop,N=e.sim.plantCropOnPlot(i.uid,B);if(N.needSeedAcquire){const W=i.uid;e.activeSeedCropId=B,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(B,W);return}if(e.showToast(N.msg,N.ok?"🌱":"🪙"),N.ok){e.activeSeedCropId=B,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(q=>{q.addEventListener("click",()=>{const B=q.dataset.inspSeedFilter;(B==="all"||B==="flowers"||B==="crops")&&(e.seedFilterMode=B,pe(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(q=>{q.addEventListener("click",()=>{const B=q.dataset.stockAnimal,N=e.sim.stockAnimalOnPasture(i.uid,B);if(e.showToast(N.msg,N.ok?et[B]?.emoji??"🐾":"🪙"),N.ok){e.activePastureAnimalId=B,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const q=e.sim.feedAnimalPasture(i.uid);e.showToast(q.msg,q.ok?"🌾":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const q=e.sim.harvestAnimalPasture(i.uid);e.showToast(q.msg,q.ok?"🧺":"⏳"),pe(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const q=e.sim.clearAnimalFromPasture(i.uid);e.showToast(q.msg,q.ok?"🐾":"⚠️"),pe(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const q=e.sim.waterCropPlot(i.uid);e.showToast(q.msg,q.ok?"💧":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const q=e.sim.harvestCropPlot(i.uid);e.showToast(q.msg,q.ok?"🌾":"🏡"),pe(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(q=>{q.addEventListener("click",()=>{const B=q.dataset.wsEnqueue,N=e.sim.enqueueWorkshopRecipe(i.uid,B);e.showToast(N.msg,N.ok?"🔥":"🧺"),pe(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(i.uid),pe(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(i.uid),pe(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(i.uid),pe(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=i.uid,e.inspectSelection=null,pe(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${o.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(i.uid),pe(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",i.uid)}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const q=e.sim.upgradeBuildingStar(i.uid);e.showToast(q.msg,q.ok?"🌟":"🪙"),pe(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=i.uid,e.rotation=i.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${o.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const a=e.inspectSelection.id,i=e.sim.staff.find(c=>c.id===a);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=e.sim.state.staffPatrolZones?.[i.id]??i.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${T(i.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${T(i.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${o==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${Nn.filter(c=>e.sim.state.sandboxMode||r.has(c.id)).map(c=>`<option value="${c.id}" ${o===c.id?"selected":""}>📍 ${c.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",c=>{const s=c.currentTarget.value;e.sim.setStaffPatrolZone(i.id,s),e.showToast(`Đã phân công khu tuần tra cho ${i.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const a=Cs(e.inspectSelection.zoneId),i=Ms(a),o=e.sim.state.level>=a.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${T(a.name)}</div>
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
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(a.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,pe(e))})}}function Un(e,t){t&&(e.activeWorkshopTab=t),qe(e);const n=e.root.querySelector("#workshopDialog");n.open||n.showModal()}function Ys(e,t,n){e.collapseBuildDock(),Et(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=n??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function pt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function ao(e){e.seedTrayOpen?(pt(e),e.refreshAll()):Ys(e,e.activeSeedCropId??void 0)}function Zs(e,t,n){e.collapseBuildDock(),pt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=n??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Et(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function oo(e){e.pastureTrayOpen?(Et(e),e.refreshAll()):Zs(e,e.activePastureAnimalId??void 0)}function Js(e){const t=e.root.querySelector("#seedBrushTray"),n=e.root.querySelector("#btnOpenSeedSilo");if(n){const p=e.seedTrayOpen||!!e.activeSeedCropId;n.dataset.active=String(p),n.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(p=>ae(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,i=e.sim.state.buildings.filter(p=>ae(p.itemId)?.isFarmlandPlot).length,o=e.activeSeedCropId?Se[e.activeSeedCropId]:null,r=Object.values(Se).sort((p,m)=>p.unlockLevel-m.unlockLevel||p.growSec-m.growSec),c=r.filter(p=>p.isFlowerCrop).length,s=r.length-c,l=r.filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),d=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${c})`},{id:"crops",label:`🌾 (${s})`}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),u=l.map(p=>{const m=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,g=e.activeSeedCropId===p.id,b=e.sim.getSeedCount(p.id),w=e.sim.getFarmItemCount(p.id),$=xe(p.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${m?"locked":""} ${g?"selected":""} ${!m&&b<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${g}"
              ${m?"disabled":""}
            >
              <img src="${Mt(p.id)}" alt="${T(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${T(p.name)}</span>
              <span class="seed-card-seed-badge ${b>0?"has-seed":"no-seed"}">
                ${m?`🔒 Cấp ${p.unlockLevel}`:b>0?`🌱 ${b}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${m?`⏱️ ${$}`:`⏱️ ${$} • 🪙${p.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${w}</span>
            </button>
            ${m?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Nạp hạt ${T(p.name)}" title="Mua hạt ${T(p.name)} (${p.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🌱 <strong>${T(o.name)}</strong> (${e.sim.getSeedCount(o.id)})`:"🌱 Hạt Giống & Hoa"}
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
    `,t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const g=p.dataset.seedFilter;(g==="all"||g==="flowers"||g==="crops")&&(e.seedFilterMode=g,Js(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const g=p.dataset.acquireSeed,b=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,b)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),m=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.seedBrush,g=Se[m],b=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(m)<=0){e.activeSeedCropId=m,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,b);return}if(e.activeSeedCropId=m,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,b){const w=e.sim.state.buildings.find($=>$.uid===b);if(w&&ae(w.itemId)?.isFarmlandPlot&&!w.cropId){const $=e.sim.plantCropOnPlot(w.uid,m);if($.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(m,w.uid);return}e.showToast($.msg,$.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${g.emoji} ${g.name} (Túi có ${e.sim.getSeedCount(m)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,g.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=ae("farmland_plot");p&&(pt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=ae("burrow_flower_garden");p&&(pt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Un(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{pt(e),e.refreshAll()})}function ro(e){const t=e.root.querySelector("#pastureBrushTray"),n=e.root.querySelector("#btnOpenPastureTray");if(n){const c=e.pastureTrayOpen||!!e.activePastureAnimalId;n.dataset.active=String(c),n.setAttribute("aria-pressed",String(c))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(c=>ae(c.itemId)?.isAnimalPasturePlot&&!c.pastureAnimalId&&Date.now()>=c.constructEndsAt).length,i=e.sim.state.buildings.filter(c=>ae(c.itemId)?.isAnimalPasturePlot).length,o=e.activePastureAnimalId?et[e.activePastureAnimalId]:null,r=Object.values(et).map(c=>{const s=!e.sim.state.sandboxMode&&e.sim.state.level<c.unlockLevel,l=e.activePastureAnimalId===c.id,d=c.goodId?Ne(c.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${s?"locked":""} ${l?"selected":""}"
              data-pasture-brush="${c.id}"
              aria-pressed="${l}"
              ${s?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${c.spritePair[0]}.png" alt="${T(c.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${T(c.name)}</span>
              <span class="seed-card-seed-badge ${s?"no-seed":"has-seed"}">
                ${s?`🔒 Cấp ${c.unlockLevel}`:`🪙 ${c.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${xe(c.cycleSec)} • +${c.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${d?`+${c.yieldQty} ${T(d.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🐾 <strong>${T(o.name)}</strong> (${o.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
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
    `,t.querySelectorAll("[data-pasture-brush]").forEach(c=>{c.addEventListener("click",()=>{const s=c.dataset.pastureBrush,l=et[s];if(!l)return;const d=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=s,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,d){const u=e.sim.state.buildings.find(p=>p.uid===d);if(u&&ae(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId){const p=e.sim.stockAnimalOnPasture(u.uid,s);e.showToast(p.msg,p.ok?l.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${l.emoji} ${l.name} (${l.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,l.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const c=ae("burrow_animal_pasture");c&&(Et(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=c,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Un(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Et(e),e.refreshAll()})}function lo(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,a=Date.now();if((n.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){qe(e);return}if(e.activeWorkshopTab==="brew"){const o=t.querySelector("#btnWsQuickHerb");if(o){const s=Math.max(0,Math.ceil((2e4-(a-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),l=s===0||n.sandboxMode;o.classList.toggle("gold-cta",l),o.textContent=l?"🌿 Hái Thảo Dược":`🌱 (${xe(s)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&n.supply.activeBrew){const s=Vt.find(d=>d.id===n.supply.activeBrew?.goodId),l=Math.max(0,Math.ceil((n.supply.activeBrew.endsAt-a)/1e3));s&&(r.textContent=`🔥 ${s.emoji} ${s.name} (còn ${Pe(l)})`)}const c=t.querySelector("[data-ws-buff-banner]");if(c){const s=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-a)/1e3)),l=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-a)/1e3));if(s<=0&&l<=0)c.classList.add("hidden");else{c.classList.remove("hidden");const d=[];s>0&&d.push(`🍻 +85%G (${Pe(s)})`),l>0&&d.push(`🧪 +35%XP (${Pe(l)})`),c.textContent=`✨ ${d.join(" • ")}`}}}}function qe(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const n=e.sim.state,a=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const i=e.sim.activeSynergies.activeIds.size,o=n.supply.cargoCrates.filter(d=>d.fulfilled).length,r=e.sim.ensureFarmBarn(),c=e.sim.getBarnTotalUsed(),s=`
      <div class="workshop-tabs" role="group" aria-label="Kho & Xưởng">
        <button type="button" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-pressed="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          🏡 Kho (${c}/${r.capacity})
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
    `;let l="";if(e.activeWorkshopTab==="barn"){const d=Math.min(100,Math.round(c/Math.max(1,r.capacity)*100)),u=e.sim.getBarnUpgradeCostInfo(),p=n.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":u.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${u.baseGoldCost})`:`🏡 +20 Ô (🪙${u.effectiveGoldCost} • bù 1🔌)`,m=u.hasPlug?`🔌 ×${u.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${u.plugShortageBuyout}G)`,g=A=>A.map(k=>{const v=Ne(k),S=e.sim.getFarmItemCount(k);return`
              <div class="barn-stock-card ${S>0?"in-stock":"empty"}">
                <img src="${v.iconSrc}" alt="${T(v.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${T(v.name)}</div>
                <div class="barn-stock-qty"><strong>×${n.sandboxMode?"∞":S}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${S>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${k}"
                  ${S<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${v.sellValue}G
                </button>
              </div>
            `}).join(""),b=e.sim.getPhoenixTalismanCount(),w=e.sim.getPhoenixTalismanDailyStatus(),$=e.sim.getCraftablePhoenixBarnGood(),C=$?Ne($):null,h=n.sandboxMode||b<kn&&!!$&&n.galleons>=os;l=`
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${c}/${r.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${r.ordersDelivered} • ${m}
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
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${b}/${kn}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${w.usedCount}/${w.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${h?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${C?`1 ${T(C.name)}`:"1 Đặc sản"} + ${os}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(Se).length})</h3>
        <div class="barn-stock-grid">
          ${g(Object.keys(Se))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(rt).length})</h3>
        <div class="barn-stock-grid">
          ${g(Object.keys(rt))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const d=Math.max(0,Math.ceil((2e4-(a-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),u=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-a)/1e3)),p=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-a)/1e3)),m=n.supply.activeBrew,g=m?Vt.find(v=>v.id===m.goodId):void 0,b=m?Math.max(0,Math.ceil((m.endsAt-a)/1e3)):0,w=Math.max(0,n.supply.brewCompletedCount??0),$=w+1,C=n.buildings.some(v=>ae(v.itemId)?.isWorkshopBrewery&&a>=v.constructEndsAt),h=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),A=w===0?"Mẻ #1 (khởi động: 1 giờ)":w===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":w===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${$} (đạt trần tối đa: 6 giờ)`,k=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];l=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${d===0||n.sandboxMode?"gold-cta":""}">
            ${d>0&&!n.sandboxMode?`🌱 (${xe(d)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${A}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${C?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${h?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${k.map(v=>{const S=Lt[v],M=n.supply.ingredients[v]??0;return`
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
                ✨ ${u>0?`🍻 +85%G (${Pe(u)}) `:""}${p>0?`• 🧪 +35%XP (${Pe(p)})`:""}
              </div>
            `:""}

        ${m&&g?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${g.emoji} ${T(g.name)} (còn ${Pe(b)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Vt.map(v=>{const S=n.supply.goods[v.id]??0,M=e.sim.getBrewDurationSec(v),L=xe(M),O=Object.entries(v.inputs).map(([R,q])=>{const B=Lt[R],N=n.supply.ingredients[R]??0;return`<span style="color:${n.sandboxMode||N>=(q??0)?"#15803d":"#dc2626"};font-weight:800;">${B.emoji} ${N}/${q}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${v.emoji} ${v.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${n.sandboxMode?"∞":S}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${O}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${v.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${L})
                  </button>
                  <button type="button" data-use-good="${v.id}" class="brass-btn" style="flex:1;">
                    ${v.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const d=Math.round(240+n.level*40),u=Math.round(160+n.level*25);l=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${d.toLocaleString("vi-VN")}🪙 +${u}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((p,m)=>{const g=Vt.find($=>$.id===p.goodId),b=n.supply.goods[p.goodId]??0,w=!p.fulfilled&&(n.sandboxMode||b>=p.qtyRequired);return`
                <div class="crate-card ${p.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${m+1}</span>
                      <span>${p.fulfilled?"✅":`${n.sandboxMode?"∞":b}/${p.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${g.emoji} ${g.name} ×${p.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${p.rewardGalleons}🪙 • +${p.rewardXp}⭐ • +${p.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${p.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':w?`<button type="button" data-fulfill-crate="${p.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else l=`
        <div class="grid-2col">
          ${qi.map(d=>{const u=e.sim.activeSynergies.activeIds.has(d.id),p=d.requiredItems.map(m=>ae(m)?.name??m).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${u?"#d97706":"rgba(138,90,43,0.3)"};background:${u?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${d.emoji} ${T(d.name)}</span>
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
      `;t.innerHTML=s+l,t.querySelectorAll("[data-ws-tab]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab=d.dataset.wsTab,qe(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const d=e.sim.upgradeFarmBarn();e.showToast(d.msg,d.ok?"🏡":"🔌"),qe(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const d=e.sim.craftPhoenixTalismanFromBarn();e.showToast(d.msg,d.ok?"🔥":"🧺"),qe(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.sellFarmItemFromBarn(d.dataset.sellFarmItem,1);u.ok||e.showToast(u.msg,"🧺"),qe(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const d=e.sim.quickHarvestHerbs();e.showToast(d.msg,d.ok?"🌿":"⏳"),qe(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&qe(e)}),t.querySelectorAll("[data-brew-good]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.startBrewing(d.dataset.brewGood);e.showToast(u.msg,u.ok?"🧪":"⚠️"),qe(e)})}),t.querySelectorAll("[data-use-good]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.useGood,p=e.sim.useCraftedGood(u);p.ok?u==="dragon_firework"?e.root.querySelector("#workshopDialog").close():qe(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.fulfillCargoCrate(d.dataset.fulfillCrate);e.showToast(u.msg,u.ok?"📦":"⚠️"),qe(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab="brew",qe(e)})})}function co(e){e.closeHudPopovers(),ei(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function po(e){const t=e.sim.getClaimableHarvestFeastCount(),n=e.root.querySelector("#badgeFeastCount");n&&(t>0?(n.textContent=String(t),n.classList.remove("hidden")):n.classList.add("hidden"));const a=e.root.querySelector("#badgeManageFeastCount");a&&(t>0?(a.textContent=String(t),a.classList.remove("hidden")):a.classList.add("hidden"))}function uo(e,t){const n=e.root.querySelector("#ribbonUnveilToastCard");n&&(n.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${T(t.speakerEmoji)} ${T(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${T(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,n.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{n.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function ei(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const n=e.sim.ensureHarvestFeast(),a=new Set(n.claimedTiers),i=ft[ft.length-1]?.pointsRequired??3e3,o=Math.min(100,Math.round(n.points/Math.max(1,i)*100)),r=e.sim.getClaimableHarvestFeastCount(),c=ft.every(d=>a.has(d.tier)),s=ft.find(d=>!a.has(d.tier)),l=ft.map(d=>{const u=a.has(d.tier),m=n.points>=d.pointsRequired&&!u,g=_i(d),b=d.tier%5===0;return`
        <article class="feast-tier-card ${u?"is-claimed":m?"is-claimable":"is-locked"} ${b?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${d.tier}</span>
            <span class="feast-tier-pts">🍁 ${d.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${T(d.icon)} ${T(d.titleVi)}</span>
              ${b?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${T(g)}</div>
          </div>
          <div class="feast-tier-cta">
            ${u?'<span class="feast-claimed-pill">✓</span>':m?`<button type="button" data-claim-feast-tier="${d.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(d.pointsRequired-n.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${n.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${n.points.toLocaleString("vi-VN")} / ${i.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${c?"🎉 30/30!":s?` Kế tiếp: #${s.tier} (${s.pointsRequired.toLocaleString("vi-VN")} 🍁)`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${r>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${r})</button>`:""}
            ${c?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${n.seasonCycle+1}</button>`:""}
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
        ${l}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const d=e.sim.claimAllHarvestFeastTiers();e.showToast(d.msg,d.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const d=e.sim.startNextHarvestFeastCycle();e.showToast(d.msg,d.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.claimFeastTier);if(!Number.isFinite(u))return;const p=e.sim.claimHarvestFeastTier(u);e.showToast(p.msg,p.ok?"🎁":"🍁"),e.refreshAll()})})}function go(e){const t=e.root.querySelector("#financeDialogContent"),n=e.sim.state.finance,a=n.gateRevenue+n.ticketRevenue+n.shopRevenue+n.harvestRevenue,i=n.staffWagesPaid+n.constructionSpent,o=a-i,r=e.sim.getHourlyStaffWage();t.innerHTML=`
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
    `}function Ke(e){const t=e.root.querySelector("#albumDialogContent"),n=e.sim.state;e.sim.checkAndToastAchievements();const a=Ui(n),i=ji(n),o=rs.filter(d=>{const u=a.achievements[d.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),c=ls.filter(d=>d.day<=r&&!a.claimedLoginDays.includes(d.day)).length,s=`
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
          📅 Điểm Danh 7N${c>0?` • 🎁${c}`:""}
        </button>
      </div>
    `;let l="";if(e.activeAlbumTab==="cup"){const d=e.sim.getPlayerHouse(),u=n.weeklyHouseCupServerStandings,p=[{house:"Gryffindor",icon:"🦁",pts:(n.housePoints.Gryffindor??0)+(u?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(n.housePoints.Slytherin??0)+(u?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(n.housePoints.Ravenclaw??0)+(u?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(n.housePoints.Hufflepuff??0)+(u?.totals.Hufflepuff??0)}];p.sort(($,C)=>C.pts-$.pts);const m=Math.max(100,p[0]?.pts??100),g=(n.housePoints.Gryffindor??0)+(n.housePoints.Slytherin??0)+(n.housePoints.Ravenclaw??0)+(n.housePoints.Hufflepuff??0),b=n.houseCupMilestoneTier*300,w=g>=b;l=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${d}</strong>${u?` • Tuần HPVN ${u.weekKey} (đóng góp: +${u.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${n.houseCupMilestoneTier}: ${g} / ${b}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${p.map(($,C)=>{const h=Math.min(100,Math.max(8,Math.round($.pts/m*100))),A=$.house===d;return`
                  <div class="aaa-hourglass-card" data-house="${$.house}" data-player-house="${A}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${C===0?"👑 ":""}${$.icon} ${$.house}</span>
                      ${A?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${$.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${h}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${b}" value="${Math.min(b,g)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${w?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${n.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const d=Date.now(),u={farm:at(n,"farm",d),building:at(n,"building",d),puzzle:at(n,"puzzle",d),language:at(n,"language",d),social:at(n,"social",d),collection:at(n,"collection",d)};l=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${i.completionPct}% (${i.unlocked}/${i.total})</span>
          </div>
          <progress max="${i.total}" value="${i.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${rs.map(p=>{const m=a.achievements[p.id],g=!!m?.unlockedAt,b=!!m?.claimedAt,w=Math.min(p.target,Math.max(0,u[p.category]??0)),$=w.toLocaleString("vi-VN"),C=p.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${g}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${p.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${p.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${p.descVi} • Thưởng <strong>+${p.rewardGalleons}G, +${p.rewardStars} 🌟</strong></div>
                    ${g?"":`<progress max="${p.target}" value="${w}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${b?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':g?`<button type="button" data-claim-ach="${p.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${$}/${C}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const d=e.sim.getRealTimePeriod(),u=Wi();l=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${qs.map(p=>{const m=n.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${p.titleVi}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">Yêu cầu: Cấp ${p.unlockLevel}</div>
                  <button type="button" data-play-cutscene="${p.id}" ${m?"":"disabled"} class="brass-btn ${m?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                    ${m?"🎬 Phát Phim Camera":`🔒 Mở ở Cấp ${p.unlockLevel}`}
                  </button>
                </div>
              `}).join("")}
          </div>
        </div>
        <div class="aaa-codex-scroll">
          ${Qi.map(p=>{const m=Xi(p.id,d),g=a.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},b=g.level*60,w=g.lastTalkedDayKey===u;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${p.moodBubble} ${p.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${p.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${g.level}/10 (${g.xp}/${b})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${m.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${p.id}" data-choice="0" ${w?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${w?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${w?"":`<button type="button" data-npc-talk="${p.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else l=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${ls.map(d=>{const u=a.claimedLoginDays.includes(d.day),p=!u&&d.day<=r;return`
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
      `;t.innerHTML=s+l,t.querySelectorAll("[data-atab]").forEach(d=>{d.addEventListener("click",()=>{e.activeAlbumTab=d.dataset.atab,Ke(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&Ke(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const d=await kt(()=>Promise.resolve().then(()=>Da),void 0);if(typeof d.fetchWeeklyHouseCupStandingsOnline=="function"){const u=await d.fetchWeeklyHouseCupStandingsOnline();if(u){n.weeklyHouseCupServerStandings=u,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${u.weekKey}!`,"🏆"),Ke(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(d.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),Ke(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(d=>{d.addEventListener("click",()=>{e.playStoryCutscene(String(d.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.npcTalk,p=Number(d.dataset.choice)===1?1:0,m=e.sim.talkWithVillagerChoice(u,p);e.showToast(m.msg,m.ok?"💝":"☕"),Ke(e)})}),t.querySelectorAll("[data-claim-login]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(d.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),Ke(e)})})}function Fe(e){const t=e.root.querySelector("#questDialogContent"),n=e.sim.ensureFarmBarn(),a=e.sim.getActiveStoryQuest(),i=e.sim.getStoryAutoActionPreview(),o=e.sim.getReadyOwlOrdersCount(),r=(a?.completed?1:0)+e.sim.state.owlQuests.filter(g=>g.completed&&!g.claimed).length+e.sim.state.dailyQuests.filter(g=>g.completed&&!g.claimed).length;if(!e.selectedOwlOrderId||!n.owlOrders.some(g=>g.id===e.selectedOwlOrderId)){const g=n.owlOrders.find(b=>e.sim.canFulfillFarmOwlOrder(b));e.selectedOwlOrderId=(g??n.owlOrders[0])?.id??null}const c=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${o}/${n.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const g=n.owlOrders.find(C=>C.id===e.selectedOwlOrderId)??n.owlOrders[0],b=g?e.sim.canFulfillFarmOwlOrder(g):!1,w=n.owlOrders.map(C=>{const h=g?.id===C.id,A=e.sim.canFulfillFarmOwlOrder(C),k=C.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${C.portraitSprite}.png" alt="${T(C.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${T(C.portraitEmoji)}</span>`,v=C.requirements.slice(0,3).map(S=>{const M=Ne(S.itemId);return`<img src="${M.iconSrc}" alt="${T(M.name)}" title="${S.qty} ${T(M.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${h?"selected":""} ${A?"ready":""}"
              data-select-owl="${T(C.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${k}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${T(C.senderName)}</div>
                <div class="owl-note-mini-row">${v}</div>
                ${C.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${A?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),$=g?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${T(g.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${T(g.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${g.requirements.map((C,h)=>{const A=Ne(C.itemId),k=e.sim.getFarmItemCount(C.itemId),v=e.sim.ensureNeighborSocial(),S=Math.max(0,Gt-v.dailyOwlHelpRequestedCount),M=e.sim.getOwlRequirementHelpState(g.id,h),L=!!M?.fulfilledAt,O=e.sim.state.sandboxMode||L||k>=C.qty,R=L?`<span class="owl-help-tag done">✓ ${T(M?.helperEmoji??"🦉")}</span>`:M?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':O?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${h}" ${S<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${S})</button>`;return`
                    <div class="owl-req-row ${O?"ok":"lack"}">
                      <img src="${A.iconSrc}" alt="${T(A.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${T(A.name)}</div>
                        <div class="owl-req-count">${L?"✓":`${e.sim.state.sandboxMode?"∞":k}/${C.qty}`}</div>
                      </div>
                      ${R}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${g.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${g.rewardXp}</span>
                ${g.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${g.rewardMugglePlug}</span>`:""}
                ${(g.isFeastMarquee||(n.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<kn?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${c}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${w}</div>
            ${$}
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
      `,t.querySelectorAll("[data-qtab]").forEach(C=>{C.addEventListener("click",()=>{e.activeQuestTab=C.dataset.qtab,Fe(e)})}),t.querySelectorAll("[data-select-owl]").forEach(C=>{C.addEventListener("click",()=>{e.selectedOwlOrderId=C.dataset.selectOwl??null,Fe(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{g&&(e.sim.refreshFarmOwlOrder(g.id),e.selectedOwlOrderId=null,Fe(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(C=>{C.addEventListener("click",()=>{if(!g)return;const h=Number(C.dataset.askOwlHelp);if(!Number.isFinite(h))return;const A=e.sim.requestPlayerOwlCrateHelp(g.id,h);A.ok||e.showToast(A.msg,"⚠️"),Fe(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!g)return;if(!e.sim.canFulfillFarmOwlOrder(g)){const h=e.sim.fulfillFarmOwlOrder(g.id);e.showToast(h.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const C=e.sim.fulfillFarmOwlOrder(g.id);C.ok&&e.showToast(C.msg,"🦉"),e.selectedOwlOrderId=null,Fe(e)});return}const s=(g,b,w=!1)=>{const $=Math.min(100,Math.round(g.progress/Math.max(1,g.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${T(g.giverEmoji)} ${T(g.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${T(b)}</span>
          </div>
          ${w&&g.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${T(g.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${$}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(g.progress,g.targetAmount)}/${g.targetAmount}</span>
            <span>🪙${g.rewardGalleons} • ⭐${g.rewardXp} ${g.rewardTimeSand>0?`• ⏳${g.rewardTimeSand}`:""}</span>
          </div>
          ${g.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':g.completed?`<button type="button" data-modal-claim="${T(g.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:w?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${T(i.shortLabel)}</button>`:""}
        </div>
      `},l=e.sim.getRequiredLevelTrial(),d=e.sim.getWinsProgressForCurrentLevel(),u=g=>{const b=e.sim.getDisciplineStageInfo(g);return b.isMaxed?"👑777":`${b.currentStage}/777`},p=l&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${d.current}/${d.required}): ${l.icon} ${T(l.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${l.kind==="match3"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🍓 (${u("match3")})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${l.kind==="caro"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${u("caro")})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${l.kind==="sudoku"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🔮 (${u("sudoku")})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${l.kind==="chess"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🏰 (${u("chess")})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${l.kind==="blocks"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🦄 (${u("blocks")})</button>
            </div>
          </div>
        </div>
      `:"",m=a?`Ch.${a.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${Ei.length}`:"";t.innerHTML=`
      ${c}
      ${p}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${a?s(a,m,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(g=>s(g,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(g=>s(g,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(g=>{g.addEventListener("click",()=>{e.activeQuestTab=g.dataset.qtab,Fe(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(g=>{g.addEventListener("click",()=>{const b=g.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(b)})}),t.querySelectorAll("[data-modal-claim]").forEach(g=>{g.addEventListener("click",()=>{e.sim.claimQuest(g.dataset.modalClaim),Fe(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const g=e.sim.completeStoryStepWithStar();g.ok?(typeof g.placedGx=="number"&&typeof g.placedGy=="number"&&me(e.cam,g.placedGx,g.placedGy),Fe(e)):(e.showToast(g.msg,g.reason==="missing_gold"?"🪙":"🌟"),(g.reason==="missing_stars"||g.reason==="locked_level"||g.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function ti(e){const t=e.root.querySelector("#roadmapDialogContent"),n=new Set(e.sim.state.unlockedZones),a=e.sim.getRequiredLevelTrial(),i=Nn.map(r=>{const c=n.has(r.id)||e.sim.state.sandboxMode,s=!c&&e.sim.state.level>=r.unlockLevel,l=Ms(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${c?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${l>0?`🌟 ${l}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${s?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),o=Pi.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${a&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${a.icon} ${T(a.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${i}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${o.map(r=>{const c=e.sim.state.level>=r.level,s=r.unlockedItemIds.map(l=>ae(l)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${c?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${c?"🌟":"🔒"} Lv.${r.level}</span>
                  ${s?`<span style="font-size:12px;margin-left:6px;">${s}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const c=Cs(r.dataset.camZone);me(e.cam,(c.x1+c.x2)*.5,(c.y1+c.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const c=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(c.msg,c.ok?"✨":"🔒"),ti(e)})})}function Ae(e){const t=e.root.querySelector("#settingsDialogContent"),n=e.sim.state,a=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
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
            ${typeof window<"u"&&Be(window.location.hostname)?`<label class="switch-row">
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
              ${[{key:"master",label:"🔊 Tổng (Master)"},{key:"music",label:"🎼 Nhạc nền"},{key:"sfx",label:"🔔 Hiệu ứng"},{key:"voice",label:"🗣️ Giọng đọc"}].map(r=>{const c=Math.round((i.volumes[r.key]??.85)*100);return`
                    <label class="aaa-slider-row">
                      <span>${r.label}</span>
                      <input type="range" min="0" max="100" value="${c}" data-vol-bus="${r.key}" />
                      <span data-vol-val="${r.key}">${c}%</span>
                    </label>
                  `}).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;font-weight:700;">🎨 Chế độ màu:</span>
              ${[["none","Mặc định"],["protanopia","Đỏ-Lục (P)"],["deuteranopia","Lục-Đỏ (D)"],["tritanopia","Xanh-Vàng (T)"]].map(([r,c])=>`<button type="button" data-cb-mode="${r}" data-active="${i.colorblindMode===r}" aria-pressed="${i.colorblindMode===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${c}</button>`).join("")}
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
          ${["slot_1","slot_2","slot_3"].map((i,o)=>{const r=Ki(i);return`
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
          ${typeof window<"u"&&Be(window.location.hostname)?`<button id="btnPreview100" type="button" class="brass-btn gold-cta">
                  ${e.sim.isHeadmasterPreview?"↩️ Về Save":"🌾 Xem Lv.100"}
                </button>`:""}
          <button id="btnTestFireworks" type="button" class="brass-btn">
            🎆 Pháo Hoa
          </button>
          ${typeof window<"u"&&Be(window.location.hostname)?`<button id="btnTestEscape" type="button" class="brass-btn">
                  🐾 Thả Niffler
                </button>`:""}
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
          ${typeof window<"u"&&Be(window.location.hostname)?`<label class="brass-btn" style="cursor:pointer;">
                  📤 Nhập (.json)
                  <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
                </label>`:""}
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            🌱 Chơi Lại
          </button>
        </div>
      </div>
    `,"switch"in HTMLInputElement.prototype||kt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",i=>{n.settings.bgmEnabled=i.currentTarget.checked,e.sim.audio.bgmEnabled=n.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",i=>{n.settings.soundEnabled=i.currentTarget.checked,e.sim.audio.enabled=n.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",i=>{n.settings.cutawayMode=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",i=>{n.settings.showGrid=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",i=>{typeof window<"u"&&Be(window.location.hostname)&&(n.sandboxMode=i.currentTarget.checked,n.sandboxMode&&(n.sandboxTainted=!0),e.sim.saveToStorage(),e.refreshAll())}),t.querySelectorAll("[data-time]").forEach(i=>{i.addEventListener("click",()=>{n.settings.timeOverride=i.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-fest]").forEach(i=>{i.addEventListener("click",()=>{n.settings.activeFestival=i.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-weather]").forEach(i=>{i.addEventListener("click",()=>{n.settings.weatherOverride=i.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-toon]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.toon==="on";e.sprites?.setToonEnabled(o),e.refreshAll(),Ae(e)})}),t.querySelector("#btnTestFireworks")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.launchFireworksShow(12)}),t.querySelector("#btnTestEscape")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.triggerPlayfulEscape()}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),Ae(e)}),t.querySelector("#btnExportSave")?.addEventListener("click",()=>{const i=new Blob([e.sim.exportSaveJson()],{type:"application/json"}),o=URL.createObjectURL(i),r=document.createElement("a");r.href=o,r.download=`cong-vien-harry-potter-lv${n.level}.json`,r.click(),URL.revokeObjectURL(o),e.showToast("Đã xuất file Save thành công!","💾")}),t.querySelector("#inpImportSave")?.addEventListener("change",i=>{const o=i.target.files?.[0];if(!o)return;const r=new FileReader;r.onload=()=>{e.sim.importSaveJson(String(r.result))?(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.showToast("Đã khôi phục công viên thành công!","✨"),e.root.querySelector("#settingsDialog").close()):e.showToast("File Save không hợp lệ!","⚠️")},r.readAsText(o)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),me(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(i=>{i.addEventListener("input",()=>{const o=i.dataset.volBus,r=Math.max(0,Math.min(1,Number(i.value)/100)),c=e.getEffectiveA11ySettings();c.volumes[o]=r,n.a11ySettings=c;const s=t.querySelector(`[data-vol-val="${o}"]`);s&&(s.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(i=>{i.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.colorblindMode=i.dataset.cbMode,n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelectorAll("[data-font-scale]").forEach(i=>{i.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.fontScale=Number(i.dataset.fontScale),n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",i=>{const o=e.getEffectiveA11ySettings();o.highContrast=i.currentTarget.checked,n.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.saveLayout,r=e.sim.saveLayoutPreset(o);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ae(e)})}),t.querySelectorAll("[data-load-layout]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.loadLayout,r=e.sim.applyLayoutPreset(o);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ae(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const i=e.sim.stashAllDecorItems();e.showToast(i.msg,i.ok?"📦":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const i=e.sim.restoreAllStashedDecor();e.showToast(i.msg,i.ok?"🌸":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelectorAll("[data-save-slot]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(o);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ae(e)})}),t.querySelectorAll("[data-load-slot]").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(o);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function mo(e,t,n){t&&(e.activeSuitcaseTab=t),n&&(e.selectedSuitcaseHabitatUid=n),Te(e);const a=e.root.querySelector("#suitcaseDialog");a.open||a.showModal()}function bo(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const n=e.sim.getSuitcaseReadySummary();n.badgeCount>0?(t.textContent=String(n.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function ho(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=Date.now(),a=e.sim.state.suitcase,i=!!(a.activeIncubation&&n>=a.activeIncubation.endsAt),o=!!(a.activeExpedition&&n>=a.activeExpedition.endsAt);if((i!==e.lastSuitcaseIncReady||o!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){Te(e);return}if(a.activeIncubation&&n<a.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((a.activeIncubation.endsAt-n)/1e3)),c=Math.max(1e3,a.activeIncubation.endsAt-a.activeIncubation.startedAt),s=Math.min(100,Math.round((n-a.activeIncubation.startedAt)/c*100)),l=t.querySelector("[data-suitcase-inc-left]");l&&(l.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-inc-prog]");d&&(d.value=s)}if(a.activeExpedition&&n<a.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((a.activeExpedition.endsAt-n)/1e3)),c=Math.max(1e3,a.activeExpedition.endsAt-a.activeExpedition.startedAt),s=Math.min(100,Math.round((n-a.activeExpedition.startedAt)/c*100)),l=t.querySelector("[data-suitcase-exp-left]");l&&(l.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-exp-prog]");d&&(d.value=s)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(c=>c.uid===e.selectedSuitcaseHabitatUid);if(r){const c=Math.max(0,Math.ceil((Ls-(n-(r.lastGroomedAt??0)))/1e3)),s=Math.max(0,Math.ceil((As-(n-(r.lastTrainedAt??0)))/1e3)),l=t.querySelector("#btnScGroom");l&&(l.textContent=c>0?`🪮 (${c}s)`:"🪮 Chải (+30💝)");const d=t.querySelector("#btnScTrain");d&&(d.textContent=s>0?`🎾 (${s}s)`:"🎾 Tập (20G • +45💝)")}}}function Te(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const n=e.sim.state,a=n.suitcase,i=Date.now(),o=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!o.some(h=>h.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=o[0]?.building.uid??null);const r=new Set(a.discoveredMorphs),c=pn.length*3,s=r.size,l=Hi(s),d=n.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(a.activeIncubation&&i>=a.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(a.activeExpedition&&i>=a.activeExpedition.endsAt);const u=a.activeIncubation?i>=a.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",p=a.activeExpedition?i>=a.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${s}/${c}`,m=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${o.length}</strong></span>
        <span>📖 <strong>${s}/${c}</strong> (+${l}%)</span>
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
    `;let g="";if(e.activeSuitcaseTab==="care")if(o.length===0)g=`
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;else{const h=o.find(V=>V.building.uid===e.selectedSuitcaseHabitatUid)??o[0],A=h.building,k=h.item,v=Ot(k.id)??pn[0],S=A.creatureMorph??"normal",M=Oe[S],L=A.creatureBondLevel??1,O=A.creatureBondXp??0,R=L>=wt?100:Ii(L),q=L>=wt?100:O,B=Math.round((es(L)-1)*100),N=A.creatureNickname||k.creatureName||k.name,W=e.sim.getBuildingProductionPerCycle(A,k),Y=e.sim.biomeCache.get(A.uid),de=Math.round(A.creatureHunger??90),re=Math.max(8,Math.round(k.cost*.04)),D=n.sandboxMode?0:Math.max(0,Math.ceil((Ls-(i-(A.lastGroomedAt??0)))/1e3)),X=n.sandboxMode?0:Math.max(0,Math.ceil((As-(i-(A.lastTrainedAt??0)))/1e3)),le=a.activeExpedition?.habitatUid===A.uid;g=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${o.map(({building:V,item:j})=>{const ue=Ot(j.id),ne=V.creatureMorph??"normal",be=Oe[ne],ge=V.creatureNickname||j.creatureName||j.name,te=V.uid===A.uid;return`
                  <button type="button" data-select-pet="${T(V.uid)}" aria-pressed="${te}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${ue?.beastSpriteKey??j.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${be.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${T(ge)}
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
            <div class="suitcase-diorama" style="background:${v.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${T(v.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${S==="radiant"?"radiant":S==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${M.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${T(N)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${v.beastSpriteKey}.png"
                  alt="${T(N)}"
                  class="suitcase-diorama-img"
                  style="filter:${M.cssFilter} drop-shadow(0 0 18px ${M.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${v.emoji} ${T(N)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${T(v.morphNames[S])}${le?" • 🧭":""}
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
                  placeholder="${T(k.creatureName??k.name)}"
                  value="${T(A.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${L}/${wt} (+${B}%)</span>
                  <span style="color:#b45309;">${L>=wt?"MAX":`${O}/${R}`}</span>
                </div>
                <progress max="${R}" value="${q}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${T(v.favoriteTreat)} • <strong>+${W.galleons.toLocaleString("vi-VN")}🪙 / ${xe(k.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${de}%</span>
                  <span>🌿 ${Y?.score??60}% ${A.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${de}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${n.sandboxMode?"0G":`${re}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${D===0?"gold-cta":""}">
                  ${D>0?`🪮 (${D}s)`:"🪮 Chải (+30💝)"}
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
        `}else if(e.activeSuitcaseTab==="morph"){const h=a.activeIncubation;let A="";if(h){const v=ae(h.itemId),S=Ot(h.itemId),M=i>=h.endsAt,L=Math.max(0,Math.ceil((h.endsAt-i)/1e3)),O=Math.max(1e3,h.endsAt-h.startedAt),R=M?100:Math.min(100,Math.round((i-h.startedAt)/O*100));A=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${T(S?.speciesName??v?.name??"Trứng")}
                ${h.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${M?"✨ Nở!":`${L}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${R}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${M?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else A=`
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(n.sandboxMode||d>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const k=o.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${o.map(({building:v,item:S})=>{const M=Ot(S.id),L=v.creatureMorph??"normal",O=e.sim.getMorphIncubationCost(S),R=v.creatureNickname||S.creatureName||S.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${M?.beastSpriteKey??S.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Oe[L].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${T(R)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Oe[L].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(q=>{const B=r.has(`${S.id}:${q}`);return`<span class="morph-pill ${B?q==="radiant"?"radiant":q==="mystic"?"mystic":"":"locked"}">${B?Oe[q].badge:`🔒 ${Oe[q].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${T(v.uid)}"
                        class="brass-btn ${h?"":"gold-cta"}"
                        ${h?"disabled":""}
                      >
                        ${h?"🥚 Đang ấp":`🥚 Ấp (${n.sandboxMode?"0G":`${O}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;g=`${A}${k}`}else{const h=a.activeExpedition;let A="";if(h){const v=un.find(N=>N.id===h.expeditionId)??un[0],S=n.buildings.find(N=>N.uid===h.habitatUid),M=S?ae(S.itemId):void 0,L=S?.creatureNickname||M?.creatureName||"Thú cưng",O=i>=h.endsAt,R=Math.max(0,Math.ceil((h.endsAt-i)/1e3)),q=Math.max(1e3,h.endsAt-h.startedAt),B=O?100:Math.min(100,Math.round((i-h.startedAt)/q*100));A=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${v.emoji} ${T(L)} • ${T(v.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${O?"🎒 Đã về!":`${R}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${B}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${O?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(o.length===0)A=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const S=(o.find(L=>L.building.uid===e.selectedSuitcaseHabitatUid)??o[0]).building,M=es(S.creatureBondLevel??1)*Oe[S.creatureMorph??"normal"].incomeMult;A=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${o.map(({building:L,item:O})=>{const R=L.creatureNickname||O.creatureName||O.name,q=Oe[L.creatureMorph??"normal"].shortLabel;return`<option value="${T(L.uid)}" ${L.uid===S.uid?"selected":""}>${T(R)} (💝Lv.${L.creatureBondLevel??1} • ${q})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${un.map(L=>{const O=!n.sandboxMode&&n.level<L.minParkLevel,R=Math.round(L.baseGold*M),q=Math.round(L.baseXp*M),B=(S.creatureBondLevel??1)>=5?1:0,N=L.guaranteedIngredients.map(W=>`+${W.qty+B} ${Lt[W.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${L.emoji} ${T(L.name)} <span style="font-size:11.5px;color:#78350f;">(${L.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${R}🪙 • +${q}⭐ • ${N}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${L.id}"
                    class="brass-btn ${O?"":"gold-cta"}"
                    ${O?"disabled":""}
                  >
                    ${O?`🔒 Lv.${L.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const k=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${s}/${c})</span>
            <span style="color:#15803d;">+${l}%</span>
          </div>
          <progress max="${c}" value="${s}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${pn.map(v=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${v.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${v.emoji} ${T(v.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(S=>{const M=r.has(`${v.habitatItemId}:${S}`);return`<span class="morph-pill ${M?S==="radiant"?"radiant":S==="mystic"?"mystic":"":"locked"}">${M?Oe[S].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;g=`${A}${k}`}t.innerHTML=`${m}${g}`,t.querySelectorAll("[data-sc-tab]").forEach(h=>{h.addEventListener("click",()=>{e.activeSuitcaseTab=h.dataset.scTab,Te(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(h=>{h.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=h.dataset.selectPet??null,Te(e)})});const b=t.querySelector("#formSuitcaseRename"),w=t.querySelector("#inpSuitcasePetName");if(w&&w.addEventListener("keydown",h=>{h.isComposing||h.stopPropagation()}),b&&w&&e.selectedSuitcaseHabitatUid){const h=e.selectedSuitcaseHabitatUid;b.addEventListener("submit",A=>{A.preventDefault();const k=e.sim.renameCreature(h,w.value);e.showToast(k.msg,"🏷️"),Te(e)})}if(e.selectedSuitcaseHabitatUid){const h=e.selectedSuitcaseHabitatUid,A=()=>{const k=e.sim.groomCreature(h);e.showToast(k.msg,k.ok?"🪮":"⏳"),Te(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",A),t.querySelector("#btnScGroom")?.addEventListener("click",A),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(h),Te(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const k=e.sim.trainCreatureTrick(h);e.showToast(k.msg,k.ok?"🎾":"🪙"),Te(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const k=n.buildings.find(v=>v.uid===h);k&&(e.root.querySelector("#suitcaseDialog").close(),me(e.cam,k.gx+1,k.gy+1),e.inspectSelection={kind:"building",uid:k.uid},e.renderInspector())})}const $=t.querySelector("#chkScStarlight");$&&$.addEventListener("change",()=>{e.useStarlightForIncubation=$.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(h=>{h.addEventListener("click",()=>{const A=h.dataset.incubateUid,k=e.useStarlightForIncubation&&(n.sandboxMode||(n.supply.ingredients.starlight_dust??0)>=1),v=e.sim.startMorphIncubation(A,k);e.showToast(v.msg,v.ok?"🥚":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const h=e.sim.speedUpIncubationWithSand();e.showToast(h.msg,h.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),Te(e)});const C=t.querySelector("#selScExpPet");C&&C.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=C.value,Te(e)}),t.querySelectorAll("[data-start-exp]").forEach(h=>{h.addEventListener("click",()=>{const A=h.dataset.startExp,k=e.selectedSuitcaseHabitatUid??o[0]?.building.uid;if(!k)return;const v=e.sim.startSuitcaseExpedition(k,A);e.showToast(v.msg,v.ok?"🧭":"⚠️"),Te(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const h=e.sim.speedUpExpeditionWithSand();e.showToast(h.msg,h.ok?"⏳":"⚠️"),Te(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),Te(e)})}const fo="/api/track",vo=25,yo=3e4;class So{constructor(t={}){x(this,"endpoint");x(this,"batchSize");x(this,"batchIntervalMs");x(this,"queue",[]);x(this,"timer",null);x(this,"lastLevel",null);x(this,"isFlushing",!1);x(this,"isInitialized",!1);this.endpoint=t.endpoint||fo,this.batchSize=t.batchSize||vo,this.batchIntervalMs=t.batchIntervalMs||yo}track(t,n){const a={id:this.generateEventId(),name:t,props:n?{...n}:void 0,timestamp:Date.now()};this.queue.push(a),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const n=this.queue.splice(0,this.queue.length);if(n.length===0)return;const a={events:n,sentAt:Date.now()},i=JSON.stringify(a);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const o=new Blob([i],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,o))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",n=>{this.handleGameTick(n)}),window.addEventListener("gamesave:uploaded",n=>{const a=n;this.track("save_uploaded",a.detail||{})});else if(t){const n=t.onUploadSuccess;t.onUploadSuccess=a=>{if(n)try{n(a)}catch{}this.track("save_uploaded",a)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",n="unknown",a="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,n=navigator.language||"vi",a=navigator.userAgent||""),this.track("session_start",{screen:t,language:n,userAgent:a,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const a=t.detail;a&&(this.track("game:tick",{level:a.level,galleons:a.galleons}),typeof a.level=="number"&&(this.lastLevel!==null&&a.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:a.level}),this.lastLevel=a.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class wo{constructor(t,n={}){x(this,"analytics");x(this,"maxErrorsPerSession");x(this,"isListening",!1);x(this,"seenSignatures",new Set);x(this,"errorCountThisSession",0);x(this,"handleError",t=>{const n=t.message||(t.error?String(t.error):"Uncaught runtime error"),a=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",i=t.filename||(typeof window<"u"?window.location.href:""),o={msg:n,stack:a,url:i,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(o),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});x(this,"handleUnhandledRejection",t=>{const n=t.reason,a=n instanceof Error,i=a?n.message:n?String(n):"Unhandled promise rejection",o=a&&n.stack||"",r=typeof window<"u"?window.location.href:"",c={msg:i,stack:o,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(c),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",n)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,n.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const n=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(n)){this.seenSignatures.add(n),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class xo{constructor(){x(this,"buttonEl",null);x(this,"dialogEl",null);x(this,"activeTab","privacy");x(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const n=this.dialogEl.querySelector(".legal-confirm-btn");n&&n.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",i=>{i.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-tab");o&&this.switchTab(o)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{const o=i.getAttribute("data-tab")===t;i.setAttribute("aria-selected",o?"true":"false"),i.setAttribute("data-active",o?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(i=>{const o=i.getAttribute("data-panel")===t;i.setAttribute("data-active",o?"true":"false"),i.style.display=o?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}class To{constructor(){x(this,"cloudSave");x(this,"analytics");x(this,"errorMonitor");x(this,"legalModal");x(this,"authoritativeClient");x(this,"hpvnBridge");x(this,"isInitialized",!1);x(this,"lastAuthoritativeWalletBalance",null);x(this,"walletSyncTimer",null);x(this,"isApplyingServerWallet",!1);x(this,"boundSim",null);this.cloudSave=new Yi,this.analytics=new So,this.errorMonitor=new wo(this.analytics),this.legalModal=new xo,this.authoritativeClient=mt(),this.hpvnBridge=ka({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(Es):null;if(!t)return{};const n=JSON.parse(t),a=n.match3&&typeof n.match3=="object"?n.match3:null,i=n.settings&&typeof n.settings=="object"?n.settings:null;return{version:Number(n.version||3),parkName:String(n.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(n.level)||1)),xp:Math.max(0,Math.floor(Number(n.xp)||0)),magicStars:Math.max(0,Math.floor(Number(a?.stars??n.magicStars)||0)),unlockedZonesCount:Array.isArray(n.unlockedZones)?n.unlockedZones.length:1,buildingsCount:Array.isArray(n.buildings)?n.buildings.length:0,weatherMode:String(i?.weatherOverride||n.weatherMode||"auto"),atmosphereMode:String(i?.timeOverride||n.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount(),this.cloudSave.init(),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",t=>{const n=t.detail;n&&typeof n=="object"&&this.hpvnBridge.syncState(n)}),window.addEventListener("hpvn:share-floo",t=>{const n=t.detail??{};this.hpvnBridge.shareToFloo({...n,sendToFloo:n.sendToFloo??(async(a,i)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const o=await this.authoritativeClient.host("floo-share",{text:a,...i.image?{image:i.image}:{},...i.tourId?{tourId:i.tourId}:{}});return!!(o&&typeof o=="object"&&o.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",t=>{const n=t.detail;n?.hostUid&&this.authoritativeClient.visit({hostUid:n.hostUid,help:!0,buildingUid:n.buildingUid,kind:n.kind||"water_crop",noteText:n.noteText,helperName:n.helperName,helperEmoji:n.helperEmoji}).catch(()=>{})})),(typeof navigator>"u"||navigator.onLine)&&this.authoritativeClient.read().then(t=>{if(t.wallet&&typeof t.wallet.spendable=="number"&&this.syncWalletBaseline(t.wallet.spendable),typeof t.uid=="string"&&t.uid){const n=this.cloudSave.getUserId(),a=Rn(t.uid);a!==n&&Zi(a).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:t}))}).catch(()=>{}),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,n={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const a=t.saveToStorage.bind(t),i=Math.max(0,n.debounceMs??180),o=s=>{const l=Math.max(0,Math.floor(s));this.syncWalletBaseline(l),this.isApplyingServerWallet=!0;try{const d=t.homeStateWhileVisiting??t.state;!d.sandboxMode&&!d.sandboxTainted&&(d.galleons=l,t.homeStateWhileVisiting&&(t.state.galleons=l),a(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;if(s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview)return;const l=Math.max(0,Math.floor(Number(s.galleons)||0)),d=l-this.lastAuthoritativeWalletBalance;if(d===0)return;const u=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=l;const p=d<0?"debit":"credit";let m=Math.abs(d);const g=p==="credit"?1e3:5e4;try{let b=null;for(;m>0;){const w=Math.min(m,g);m-=w,b=await this.authoritativeClient.settleWallet({direction:p,amount:w,reasonCode:p==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:p==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(s.level)||1))})}b?.wallet&&typeof b.wallet.spendable=="number"&&(o(b.wallet.spendable),n.onSnapshot?.(b))}catch(b){const w=b;if(w?.definitive===!0){const $=Yt(w);n.onToast?.(`🏦 Gringotts HPVN: ${$.text}`,$.icon);const C=w.details?.spendable;typeof C=="number"&&Number.isFinite(C)?o(C):await this.authoritativeClient.read().then(h=>{h.wallet&&typeof h.wallet.spendable=="number"&&o(h.wallet.spendable)}).catch(()=>{o(u)})}else this.lastAuthoritativeWalletBalance=u}},c=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const s=t.homeStateWhileVisiting??t.state;s.sandboxMode||s.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(s.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),i===0?r():this.walletSyncTimer=setTimeout(()=>{r()},i))};return t.saveToStorage=()=>{a(),c()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=a,this.boundSim===t&&(this.boundSim=null)}}}const He=new To;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{He.init()},{once:!0}):He.init());const jt={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},qn={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function jn(e){const t=e.sim.state.housePoints,n=["Gryffindor","Ravenclaw","Hufflepuff","Slytherin"];let a="Gryffindor",i=-1;for(const o of n){const r=Number(t?.[o]??0);r>i&&(i=r,a=o)}return a}function dt(e,t,n=""){const a=oa(e),i=(t||"🧙").trim().slice(0,2);return a?`<span class="floo-avatar-shell ${n}"><img src="${T(a)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${T(i)}</span></span>`:`<span class="floo-avatar-shell ${n}"><span class="floo-avatar-fallback">${T(i)}</span></span>`}function ni(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Wt(e){const t=e.sim.ensureNeighborSocial(),n=jn(e),a=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:a,level:e.sim.state.level,house:n,keeperTitle:$s(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function Wn(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function si(e,t){if(!t||typeof t!="object")return;const n=t,a=e.sim.ensureNeighborSocial();let i=!1;typeof n.uid=="string"&&n.uid.trim()&&Rn(n.uid);const o=typeof n.garden?.progression?.friendCode=="string"&&n.garden.progression.friendCode.trim()||(n.profile&&typeof n.profile=="object"&&typeof n.profile.friendCode=="string"?String(n.profile.friendCode).trim():"");if(o&&a.playerFriendCode!==o&&(a.playerFriendCode=o,i=!0),n.wallet&&typeof n.wallet.spendable=="number"&&Number.isFinite(n.wallet.spendable)){const s=e.sim.homeStateWhileVisiting??e.sim.state,l=Math.max(0,Math.floor(n.wallet.spendable));if(He.syncWalletBaseline(l),!s.sandboxMode&&!s.sandboxTainted&&!e.sim.isHeadmasterPreview){const d=!!n.receipt,u=ea(s);(d||u||l>=s.galleons)&&s.galleons!==l&&(s.galleons=l,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=l),i=!0)}}const r=n.profile&&typeof n.profile=="object"?n.profile:null;if(r){const s=typeof r.username=="string"?r.username.trim():"";s&&s!=="Phù Thủy Hang Sóc"&&s!=="Trang Trại Hang Sóc"&&!a.playerDisplayName&&(a.playerDisplayName=s,i=!0);const l=typeof r.avatarUrl=="string"?r.avatarUrl.trim():"";l&&a.playerAvatarUrl!==l&&(a.playerAvatarUrl=l,i=!0)}const c=n.daily&&typeof n.daily=="object"?n.daily:null;if(c&&typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(c.helpsLeft)));const s=Math.max(0,Ie-e.flooHelpsLeft);s>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=s,i=!0)}if(Array.isArray(n.helpers)&&n.helpers.length>0){e.flooHelpersToday=n.helpers.map(l=>({uid:String(l.uid||""),name:String(l.name||"Bạn HPVN"),avatarEmoji:l.avatarEmoji,avatarUrl:l.avatarUrl,at:Number(l.at||0)}));const s=ta(e.flooHelpersToday,a.lastSeenHelperAt??0);s&&s.textVi&&s.seenAt>(a.lastSeenHelperAt??0)&&(a.lastSeenHelperAt=s.seenAt,i=!0,e.showToast(s.textVi,"🤝"))}if(n.houseCup&&typeof n.houseCup=="object"){const s=n.houseCup,l=s.houses&&typeof s.houses=="object"?s.houses:null;l&&typeof s.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:s.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(l.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(l.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(l.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(l.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(s.memberTodayPoints)||0)),updatedAt:Date.now()},i=!0)}i&&(e.sim.saveToStorage(),e.refreshAll())}async function Pt(e,t=!1){if(e.flooLoading)return;const n=Date.now();if(!t&&e.flooLastLoadedAt>0&&n-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const a=e.sim.ensureNeighborSocial(),i=jn(e),o=a.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;r||Ji(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r&&await He.authoritativeClient.syncProfile({playerName:o,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:a.playerAvatarUrl||"",avatarEmoji:qn[i],house:i,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(d=>si(e,d)).catch(()=>{});const c=await He.authoritativeClient.visit({});if(typeof c.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(c.helpsLeft)));const d=Math.max(0,Ie-e.flooHelpsLeft);d>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=d)}const s=Array.isArray(c.visits)?c.visits:[],l=_t(s,Date.now());e.flooDirectoryRows=l,e.flooQueueRows.length===0&&(e.flooQueueRows=l),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(l,gt())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),c=document.activeElement?.id??"";r?.open&&c!=="inpFlooDisplayName"&&$e(e),e.renderVisitorDockBar()}}function En(e){const t=Wt(e),n=Mn(e.gameCanvas,t),a=Ds(n,.55),i=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:gt(),image:a||void 0}})),i.rewarded&&e.showToast(i.msg,"🔥"),e.refreshAll()}function ii(e,t,n){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),n&&(e.focusedNeighborId=n),(e.sim.state.level>=Ye||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Pt(e),$e(e);const i=e.root.querySelector("#neighborDialog");i&&!i.open&&i.showModal(),n&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${n}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function ai(e,t){e.closeHudPopovers();const n=e.root.querySelector("#neighborDialog");n?.open&&n.close(),t.kind==="match3"?e.getMatch3Modal().then(a=>a.openRescue(t)):e.getPuzzleArcadeModal().then(a=>a.openRescue(t))}function sn(e,t){Wn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const a=e.sim.enterHonorGardenTour(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function Je(e,t,n){const a=String(t||"").trim();if(!a)return;if(a.startsWith("tour_")){sn(e,a);return}n&&n.length>0?e.flooQueueRows=[...n]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),Wn(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const o=a.startsWith("player_")?a:`player_${a}`,r=a.startsWith("player_")?a.slice(7):a;(async()=>{try{const s=await He.authoritativeClient.visit({hostUid:r});typeof s.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(s.helpsLeft))));const l=s.visit&&typeof s.visit=="object"?s.visit:null;if(l){const d=l.progression&&typeof l.progression=="object"?l.progression:void 0,u=Date.now(),p=Array.isArray(d?.timers)?d.timers.filter($=>Number($.readyAt||0)>u).length:0,m=l.decorations&&typeof l.decorations=="object"?l.decorations:void 0,g={uid:String(l.uid||r),friendCode:typeof l.friendCode=="string"?l.friendCode:void 0,username:String(l.username||"Thành Viên HPVN"),parkName:String(l.parkName||"Thung Lũng Phép Thuật"),house:l.house||"Gryffindor",avatarEmoji:typeof l.avatarEmoji=="string"?l.avatarEmoji:void 0,avatarUrl:typeof l.avatarUrl=="string"?l.avatarUrl:void 0,level:Math.max(1,Number(l.level||1)),growing:p,helped:!!l.helped,hostHelpsLeft:typeof l.hostHelpsLeft=="number"?l.hostHelpsLeft:10,fire:l.fire&&typeof l.fire=="object"?l.fire:null,scene:m?.scene},b=e.sim.syncFlooDirectoryMembers([g],gt()),w=l.rawClientSave&&typeof l.rawClientSave=="object"?l.rawClientSave:null;if(b[0]&&w){if(Array.isArray(w.buildings)&&w.buildings.length>0){const $=w.buildings.filter(C=>C&&typeof C.itemId=="string"&&!!ae(C.itemId));$.length>0&&(b[0].valleyBuildings=$)}w.tileOverrides&&typeof w.tileOverrides=="object"&&(b[0].valleyTileOverrides=w.tileOverrides),Array.isArray(w.unlockedZones)&&w.unlockedZones.length>0&&(b[0].valleyUnlockedZones=w.unlockedZones)}}}catch{}const c=e.sim.enterNeighborVisit(o);c.ok&&typeof c.focusGx=="number"&&typeof c.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,c.focusGx,c.focusGy)):c.ok||e.showToast(c.msg,"⚠️"),e.refreshAll()})()}function oi(e,t){if(t.startsWith("tour_")){sn(e,t);return}Wn(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const a=e.sim.enterNeighborVisit(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function en(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const n=new URLSearchParams(window.location.search);if(n.has("visit")||n.has("tour")){n.delete("visit"),n.delete("tour");const a=n.toString();window.history.replaceState(null,"",`${window.location.pathname}${a?`?${a}`:""}${window.location.hash}`)}}e.refreshAll()}function $o(e){const t=e.sim.ensureNeighborSocial(),n=t.playerOwlHelpRequests.filter(l=>!!l.fulfilledAt).length,a=t.playerMinigameSos?.rescuedAt??0,i=!!t.playerMinigameSos?.claimed,o=`${t.lastSocialResetKey}|${t.friendshipTokens}|${n}|${a}|${i}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(o===e.lastSocialLiveSig)return;e.lastSocialLiveSig=o,ri(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const c=e.root.querySelector("#neighborDialog"),s=document.activeElement?.id??"";c?.open&&s!=="inpFlooDisplayName"&&$e(e)}function ri(e){const t=e.sim.ensureNeighborSocial(),n=Math.floor(t.friendshipTokens/Ze),a=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,i=t.homeLanternMarks.length,o=n+a+i,c=Math.max(0,$t-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(u=>u.minigameSos&&!u.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(u.id)).length:0,s=e.sim.state.level>=Ye&&(t.dailyGardenHelpsCount??0)<Ie?e.flooDirectoryRows.filter(u=>At(u)).length:0,l=e.root.querySelector("#badgeNeighborCount");if(l){const u=o>0?o:c>0?c:s;u>0?(l.textContent=String(u),l.classList.toggle("is-ready-green",o>0),l.classList.remove("hidden")):l.classList.add("hidden")}const d=e.root.querySelector("#badgeManageNeighborCount");d&&(o>0?(d.textContent=String(o),d.classList.remove("hidden")):d.classList.add("hidden"))}function ko(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.getActiveHonorGardenTour();if(n){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${T(n.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${T(n.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${n.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${T(n.ownerName)} · ${T(jt[n.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const k=e.sim.cycleHonorGardenTour(-1);k.ok&&typeof k.focusGx=="number"&&typeof k.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,k.focusGx,k.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const k=e.sim.cycleHonorGardenTour(1);k.ok&&typeof k.focusGx=="number"&&typeof k.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,k.focusGx,k.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{En(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{en(e)});return}const a=e.sim.getActiveVisitingNeighbor();if(!a){t.classList.add("hidden"),t.innerHTML="";return}const i=e.sim.ensureNeighborSocial(),o=Date.now(),r=Math.min(Ie,Math.max(i.dailyGardenHelpsCount??0,a.helpedViaFlooToday?1:a.helpedMarksToday.length)),c=Math.max(0,Ie-r),s=!!(a.helpedViaFlooToday||a.helpedMarksToday.length>0),l=(a.hostHelpsLeft??10)<=0,d=!!(a.fireUntilMs&&a.fireUntilMs>o),u=!s&&c>0&&!l,p=i.dailyLikedNeighborIds.includes(a.id),m=i.dailyMysteryClaimedIds.includes(a.id),g=a.owlHelpCrates.filter(k=>!k.fulfilledByPlayerToday).length,b=e.sim.canRescueNeighborMinigame(a.id).ok,w=g+(b?1:0),$=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,C=a.remoteUserId||a.id.replace(/^player_/,""),h=$.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${$.slice(0,12).map(k=>{const v=k.uid===C,S=At(k,o),M=!!(k.fire&&k.fire.until>o);return`
                <button
                  type="button"
                  class="floo-strip-dot ${v?"is-current":""} ${S?"is-helpable":""} ${M?"is-fire":""}"
                  data-floo-jump="${T(k.uid)}"
                  title="${T(k.username)} (Lv.${k.level})"
                >
                  ${dt(k.avatarUrl,k.avatarEmoji||k.username,"floo-strip-avatar")}
                  ${M?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",A=s?"✓ Đã giúp (-15p)":c<=0?"Hết lượt (5/5)":l?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${h}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${dt(a.avatarUrl,a.avatarEmoji||a.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${T(a.name)}</strong>
            <span class="visitor-lv-tag">Lv.${a.level}</span>
            ${d?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${c}/${Ie}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${i.friendshipTokens}/${Ze}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${$.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${u?"gold-cta":""}" ${u?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${A}
        </button>
        ${d?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${p?"disabled":""} title="Thả tim khen vườn">
          ${p?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${m?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${m?"✓ Quà":"🎁 Quà"}
        </button>
        ${w>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${w})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,ni(t),t.querySelectorAll("[data-floo-jump]").forEach(k=>{k.addEventListener("click",()=>{const v=k.dataset.flooJump;v&&v!==C&&Je(e,v,$)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const k=t.querySelector("#btnVisitorFlooHelp");k&&(k.disabled=!0);let v;if(a.remoteUserId)try{const L=na(i.selectedPresetNoteId),O=await He.authoritativeClient.visit({hostUid:a.remoteUserId,help:!0,kind:"water_crop",noteText:L.textVi});typeof O.helpsLeft=="number"&&(v=O.helpsLeft,e.flooHelpsLeft=O.helpsLeft)}catch(L){const O=Yt(L);if(O.reason==="already-helped"||O.reason==="daily-help-cap"||O.reason==="host-help-cap"){e.showToast(`${O.icon} ${O.text}`,O.icon),Pt(e,!0),e.refreshAll();return}}const S=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:v});if(!S.ok){e.showToast(S.msg,"🤝"),e.refreshAll();return}const M=L=>L.map(O=>O.uid===C?{...O,helped:!0}:O);if(e.flooDirectoryRows=M(e.flooDirectoryRows),e.flooQueueRows=M(e.flooQueueRows),e.refreshAll(),S.helpsLeft>0&&e.flooQueueRows.length>1){const L=bn(e.flooQueueRows,C,1);L&&L.uid!==C&&At(L)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===a.id&&Je(e,L.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const k=t.querySelector("#btnVisitorExtinguish");k&&(k.disabled=!0);try{let v=0;if(a.remoteUserId){const M=await He.authoritativeClient.fireOut({hostUid:a.remoteUserId});v=Math.max(0,Math.floor(Number(M?.price||0)))}if(v>0){const M=e.sim.homeStateWhileVisiting??e.sim.state;M.galleons=Math.max(0,M.galleons-v),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=M.galleons)}a.fireUntilMs=0;const S=M=>M.map(L=>L.uid===C?{...L,fire:null}:L);e.flooDirectoryRows=S(e.flooDirectoryRows),e.flooQueueRows=S(e.flooQueueRows),e.showToast(v>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name} (-${v} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(v){const S=Yt(v);e.showToast(`${S.icon} ${S.text}`,S.icon),k&&(k.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const k=e.sim.likeVisitedNeighborFarm();k.ok||e.showToast(k.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{m||(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,a.mysteryGiftGx+.5,a.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{ii(e,"friends",a.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const k=bn($,C,-1);k&&k.uid!==C&&Je(e,k.uid,$)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if($.length>1){const v=bn($,C,1);if(v&&v.uid!==C){Je(e,v.uid,$);return}}const k=e.sim.cycleNextNeighborVisit();k.ok&&typeof k.focusGx=="number"&&typeof k.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,k.focusGx,k.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{en(e)})}function $e(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const n=e.sim.ensureNeighborSocial(),a=e.sim.getActiveVisitingNeighbor(),i=e.sim.getActiveHonorGardenTour(),o=Date.now(),r=jn(e),c=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",s=Math.min(Ie,Math.max(0,n.dailyGardenHelpsCount??0)),l=Math.max(0,Ie-s),d=Math.max(0,$t-n.dailyRescuesGivenIds.length),u=Math.max(0,$t-n.dailyRescuesReceivedCount),p=Math.max(0,Gt-n.dailyOwlHelpRequestedCount),m=n.friendshipTokens>=Ze,g=Math.min(100,Math.round(n.friendshipTokens/Ze*100)),b=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,w=e.sim.state.level>=Ye||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,$=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${n.friendshipTokens}/${Ze}</strong>
        ${m?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${l}/${Ie}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${d}/${$t}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${p}/${Gt}</strong></span>
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
        🎁 Rương &amp; SOS ${m||b?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${n.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let h="";if(e.activeNeighborTab==="friends"){const S=[];if(b?.rescuedAt){const R=hn(b.kind);S.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${T(b.rescuerEmoji??"🦉")} ${T(b.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${R.icon} Màn ${b.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(b){const R=hn(b.kind);S.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${R.icon} Màn ${b.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}n.homeLanternMarks.length>0&&S.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${n.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${n.homeLanternMarks.length}🍀)</button>
        </div>
      `);const M=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${dt(n.playerAvatarUrl,qn[r],"floo-identity-avatar")}
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
                value="${T(c)}"
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
    `;let L="";if(w){const R=_t(e.flooDirectoryRows,o),q=R.filter(D=>At(D,o)).length,B=[...e.flooHelpersToday,...n.homeLanternMarks.map(D=>({uid:D.helperId,name:D.helperName,avatarEmoji:D.helperEmoji,avatarUrl:D.helperAvatarUrl,at:D.createdAt}))],N=Array.from(new Map(B.map(D=>[D.uid||D.name,D])).values()),W=N.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${N.slice(0,6).map(D=>dt(D.avatarUrl,D.avatarEmoji||D.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${T(sa(N))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${N.length*15} phút</strong>!
              </div>
            </div>
          `:"",Y=R.length>0?`
            <div class="floo-portal-grid" role="list">
              ${R.map(D=>{const X=!!(D.fire&&D.fire.until>o),le=At(D,o),I=a?.remoteUserId===D.uid||a?.id===`player_${D.uid}`,V=X?"🔥 Đang cháy · cần dập!":D.helped?"✓ Đã chăm giúp":D.growing>0?`🌱 ${D.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${X?"is-fire":""} ${le?"is-helpable":""} ${D.helped?"is-helped":""} ${I?"is-visiting":""}"
                      data-floo-portal="${T(D.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${dt(D.avatarUrl,D.avatarEmoji||D.username,"floo-portal-avatar")}
                        ${X?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${D.level}</span>
                      </div>
                      <strong class="floo-portal-name">${T(D.username)}</strong>
                      <span class="floo-portal-park">${T((D.house?qn[D.house]:"")||"🪄")} ${T(D.parkName||"")}</span>
                      <span class="floo-portal-status">${V}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,de=n.neighbors.filter(D=>D.owlHelpCrates.some(X=>!X.fulfilledByPlayerToday)||!!(D.minigameSos&&!D.minigameSos.rescuedToday)),re=de.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${de.slice(0,6).map(D=>{const X=e.sim.canRescueNeighborMinigame(D.id),le=D.minigameSos,I=le?hn(le.kind):null,V=!!(le&&(le.rescuedToday||n.dailyRescuesGivenIds.includes(D.id))),j=D.owlHelpCrates.filter(ne=>!ne.fulfilledByPlayerToday).map(ne=>{const be=Ne(ne.itemId),ge=e.sim.getFarmItemCount(ne.itemId),te=e.sim.state.sandboxMode||ge>=ne.qty;return`
                          <div class="nb-crate-item">
                            <img src="${be.iconSrc}" alt="${T(be.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${ne.qty} ${T(be.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":ge}/${ne.qty})</span></div>
                              <div class="nb-crate-rew">+${ne.rewardTokens}🍀 • +${ne.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${te?"gold-cta":""} nb-mini-cta" data-nb-crate="${T(D.id)}|${T(ne.id)}" ${te?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),ue=le&&I&&!V?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${I.icon} ${T(I.nameVi)} • <strong>Màn ${le.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${T(D.id)}" ${X.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===D.id?"focused":""}" data-neighbor-card="${T(D.id)}">
                        <div class="nb-card-head">
                          ${dt(D.avatarUrl,D.avatarEmoji||D.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${T(D.name)}</strong>
                              <span class="nb-badge-pill">Lv.${D.level}</span>
                              <span class="nb-badge-pill house">${jt[D.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${T(D.id)}">🔥 Bay tới</button>
                        </div>
                        ${j?`<div class="nb-coop-section"><div class="nb-crate-list">${j}</div></div>`:""}
                        ${ue}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";L=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN</div>
              <div class="floo-hearth-sub">
                Còn <strong>${l}/${Ie} lượt chăm giúp</strong> hôm nay · <strong>${q}</strong> thung lũng đang chờ tiếp sức (-15 phút)
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
          ${W}
        </section>
        ${Y}
        ${re}
      `}else{const R=Math.min(100,Math.round(e.sim.state.level/Ye*100));L=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${Ye}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${Ye}</strong> · Khi đạt Cấp ${Ye}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${R}%"></div>
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
          ${ia.map(R=>{const q=i?.id===R.id;return`
              <article class="honor-garden-card ${q?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${T(R.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${T(R.titleVi)}</strong>
                    <span class="honor-garden-owner">${T(R.ownerName)} · Lv.${R.level} · ${jt[R.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${T(R.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${T(R.weather)} · ${T(R.atmosphere)}</span>
                  ${q?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${T(R.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;h=`
      ${S.join("")}
      ${M}
      ${w?`${L}${O}`:`${O}${L}`}
    `}else if(e.activeNeighborTab==="postcard"){const S=Wt(e),M=Bs(S);h=`
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
        <div class="floo-postcard-caption">${T(M)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const S=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(M=>{const L=Ne(M.itemId);return`
                <div class="nb-crate-item ${M.fulfilledAt?"done":""}">
                  <img src="${L.iconSrc}" alt="${T(L.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${M.qty} ${T(L.name)}</div>
                    <div class="nb-crate-rew">${M.fulfilledAt?`✓ ${T(M.helperEmoji??"🦉")} ${T(M.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';h=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${n.friendshipTokens}/${Ze} 🍀)</div>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${g}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug">🔥 +1</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150G</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${n.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${m?"":"disabled"}>
              🎁 Mở Rương (${Ze} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${b?`
                  <div class="nb-alert-banner ${b.rescuedAt?"ready":""}">
                    <span>${b.rescuedAt?`🎉 <strong>${T(b.rescuerEmoji??"🦉")} ${T(b.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${b.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${b.stage}</strong>…`}</span>
                    ${b.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${u}/${$t}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${p}/${Gt}):</div>
            <div class="nb-crate-list">${S}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${aa.map(M=>{const L=M.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${M.id}" data-active="${L}" aria-pressed="${L}" class="brass-btn nb-note-btn">
                  ${M.emoji} ${T(M.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else h=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(M=>{const L=new Date(M.timestamp),O=String(L.getHours()).padStart(2,"0"),R=String(L.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${T(M.icon)}</span>
                  <span class="nb-log-msg">${T(M.textVi)}</span>
                  <span class="nb-log-time">${O}:${R}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${$}
    ${C}
    ${h}
  `,ni(t);const A=t.querySelector("#flooPostcardCanvas");A&&Mn(e.gameCanvas,Wt(e),A),t.querySelectorAll("[data-nbtab]").forEach(S=>{S.addEventListener("click",()=>{e.activeNeighborTab=S.dataset.nbtab,$e(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",$e(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{En(e),$e(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{En(e),$e(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const S=t.querySelector("#flooPostcardCanvas")??Mn(e.gameCanvas,Wt(e)),M=Ds(S,.72);if(M){const O=document.createElement("a");O.href=M,O.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${M.startsWith("data:image/webp")?"webp":"png"}`,O.click()}const L=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(L.msg,"🖼️"),$e(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",S=>{S.preventDefault();const L=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);L&&(n.playerDisplayName=L,e.sim.saveToStorage(),Pt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${L}"!`,"🔥"),$e(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Pt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const S=_t(e.flooDirectoryRows,Date.now());S.length>0&&Je(e,S[0].uid,S)}),t.querySelectorAll("[data-floo-portal]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.flooPortal;if(!M)return;const L=_t(e.flooDirectoryRows,Date.now());Je(e,M,L)})}),t.querySelectorAll("[data-honor-tour]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.honorTour;M&&sn(e,M)})});const v=()=>{const S=e.sim.openFriendshipChest();S.ok||e.showToast(S.msg,"🍀"),e.refreshAll(),$e(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",v),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",v),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(S=>{S.addEventListener("click",()=>{const M=e.sim.claimPlayerMinigameSosRescue();M.ok||e.showToast(M.msg,"⚠️"),e.refreshAll(),$e(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const S=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const M of S)e.sim.claimHomeLanternMark(M.id);e.refreshAll(),$e(e)}),t.querySelectorAll("[data-nb-visit]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbVisit;M&&oi(e,M)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),en(e)}),t.querySelectorAll("[data-nb-crate]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbCrate??"",[L,O]=M.split("|");if(!L||!O)return;const R=e.sim.fulfillNeighborOwlCrate(L,O);R.ok||e.showToast(R.msg,"🧺"),e.refreshAll(),$e(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbRescue;if(!M)return;const L=e.sim.canRescueNeighborMinigame(M);if(!L.ok||!L.neighbor||!L.sos){e.showToast(L.reason??"Không thể giải cứu màn này lúc này!","🦉");return}ai(e,{neighborId:L.neighbor.id,neighborName:L.neighbor.name,neighborEmoji:L.neighbor.avatarEmoji,kind:L.sos.kind,stage:L.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(S=>{S.addEventListener("click",()=>{const M=S.dataset.nbNote;M&&(e.sim.setNeighborPresetNote(M),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),$e(e))})})}function Qt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;me(e.cam,t.gx+t.bw*.5+a,t.gy+t.bh*.5+a),e.onCameraJump?.()}function li(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const n=Date.now();return e.sim.state.buildings.some(i=>ae(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const n=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(n)return{el:n,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function Pn(e){const t=e.root.querySelector("#tutorialHudSpotlight"),n=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(l=>l.removeAttribute("data-tutorial-anchor")),!t)return;const a=!!document.querySelector("dialog[open]");if(e.photoModeActive||a||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:i,label:o}=li(e);if(!i||i.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=i.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const c=!!i.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");c||i.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!c);const s=6;t.style.setProperty("--spot-left",`${Math.round(r.left-s)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-s)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+s*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+s*2)}px`),t.classList.toggle("pill-below",r.top<110),n&&(n.textContent=o||"👇 Bấm"),t.classList.remove("hidden")}function ci(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function di(e,t){if(ci())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function pi(e,t){if(ci())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function Hn(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const n=!!document.querySelector("dialog[open]"),a=e.manageMenuOpen||e.weatherPopoverOpen,i=e.sim.getCurrentTutorialStep();if(e.photoModeActive||n||a||!i){di(e,t),Pn(e);return}const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",o),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),c=`${i.index}:${i.id}:${e.tutorialMinimized?1:0}:${o?1:0}:${r}`;if(e.lastRenderedTutorialSig!==c){e.lastRenderedTutorialSig=c;const l=Kt.map(d=>`<span class="tutorial-step-dot ${d.index<i.index?"done":d.index===i.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${T(i.title)}</h2>
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
              aria-valuemax="${Kt.length}"
              aria-valuenow="${i.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${l}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${T(i.speakerName)}
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${T(i.title)}</h2>
            <div class="tutorial-hint-strip">${T(i.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${T(i.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${d}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${T(u)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),Hn(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),Hn(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{ui(e,i.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{i.id==="earn_magic_star"?e.openPuzzleArcadeDialog():i.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}pi(e,t);const s=`${i.index}:${i.id}`;e.lastFocusedTutorialStepKey!==s&&(e.lastFocusedTutorialStepKey=s,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),Pn(e)}function ui(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())Qt(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const a=ae("farmland_plot");a&&(e.selectedCatalogItem=a,e.refreshAll())}return}if(t==="sow_and_merge_plot"){Qt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){Qt(e);const n=Date.now();e.sim.state.buildings.some(i=>ae(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&n>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Co{constructor(t,n,a,i,o){x(this,"sim");x(this,"cam");x(this,"gameCanvas");x(this,"activeCategory",null);x(this,"selectedCatalogItem",null);x(this,"rotation",0);x(this,"bulldozerActive",!1);x(this,"moveModeActive",!1);x(this,"movingBuildingUid",null);x(this,"pincerActive",!1);x(this,"pincerPicked",null);x(this,"seedTrayOpen",!1);x(this,"seedFilterMode","all");x(this,"activeSeedCropId",null);x(this,"pendingSowPlotUid",null);x(this,"pastureTrayOpen",!1);x(this,"activePastureAnimalId",null);x(this,"pendingStockPastureUid",null);x(this,"rideCamUid",null);x(this,"rideCamSpeedText","");x(this,"pendingTouchTile",null);x(this,"onTouchConfirmPlace",null);x(this,"onTouchCancelPlace",null);x(this,"onCameraJump",null);x(this,"photoModeActive",!1);x(this,"inspectSelection",null);x(this,"minimapCanvas");x(this,"questCollapsed",!1);x(this,"minimapCollapsed",!1);x(this,"manageMenuOpen",!1);x(this,"weatherPopoverOpen",!1);x(this,"mapToolsExpanded",!1);x(this,"buildSheetOpen",!1);x(this,"minimapHudVisible",!1);x(this,"hudRolledUp",!1);x(this,"inspectorCollapsed",!1);x(this,"lastInspectedKey","");x(this,"displayedGalleons",-1);x(this,"galleonRollRaf",0);x(this,"activeWorkshopTab","barn");x(this,"activeQuestTab","orders");x(this,"activeAlbumTab","cup");x(this,"selectedOwlOrderId",null);x(this,"lastWsBrewId",null);x(this,"activeSuitcaseTab","care");x(this,"selectedSuitcaseHabitatUid",null);x(this,"useStarlightForIncubation",!0);x(this,"lastSuitcaseIncReady",!1);x(this,"lastSuitcaseExpReady",!1);x(this,"activeNeighborTab","friends");x(this,"focusedNeighborId",null);x(this,"flooDirectoryRows",[]);x(this,"flooQueueRows",[]);x(this,"flooHelpsLeft",null);x(this,"flooLoading",!1);x(this,"flooLastLoadedAt",0);x(this,"flooAutoAdvanceTimer",0);x(this,"flooHelpersToday",[]);x(this,"lastSocialLiveSig","");x(this,"tutorialMinimized",!1);x(this,"lastRenderedTutorialSig","");x(this,"lastFocusedTutorialStepKey","");x(this,"ribbonBannerTimer",0);x(this,"pendingBulldozeWarning",null);x(this,"drawerEdgeObserver",null);x(this,"dialogOpenObserver",null);x(this,"match3Modal",null);x(this,"puzzleArcadeModal",null);x(this,"match3ModalPromise",null);x(this,"puzzleArcadeModalPromise",null);x(this,"seedQuizModal");x(this,"leaderboardModal");x(this,"root");x(this,"sprites");this.root=t,this.sim=n,this.cam=a,this.gameCanvas=i,this.sprites=o,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||kt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const c of r)if(c.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new Ua(this.root,this.sim,()=>this.refreshAll(),(r,c)=>this.showToast(r,c),(r,c)=>{this.activeSeedCropId=r;const s=Se[r];if(c){const l=this.sim.state.buildings.find(d=>d.uid===c);if(l&&ae(l.itemId)?.isFarmlandPlot&&!l.cropId){const d=this.sim.plantCropOnPlot(l.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(d.msg,d.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${s.emoji} ${s.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,s.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new Ra(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const c=this.root.querySelector("#match3Dialog"),s=this.root.querySelector("#puzzleArcadeDialog"),l=this.root.querySelector("#seedQuizDialog");r==="match3"?(s?.close(),l?.close(),this.openMatch3Dialog()):r==="seedquiz"?(c?.close(),s?.close(),this.openSeedQuizDialog()):(c?.close(),l?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const s=this.sim.state.buildings.find(u=>this.inspectSelection?.kind==="building"&&u.uid===this.inspectSelection.uid),l=s?ae(s.itemId):void 0,d=Date.now();s&&(d<s.constructEndsAt||s.workshopQueue&&s.workshopQueue.length>0||s.cropId&&s.cropReadyAt&&d<s.cropReadyAt+1200||s.pastureAnimalId&&s.pastureReadyAt&&d<s.pastureReadyAt+1200||l&&l.cycleSec>0&&l.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return ja(this)}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const n=t.returnValue;t.returnValue="";const a=this.pendingBulldozeWarning;this.pendingBulldozeWarning=null,n==="confirm"&&a&&(this.sim.removeAtTile(a.gx,a.gy,!0),this.refreshAll())}),this.sim.onRequestBulldozeConfirm=n=>{this.openBulldozeConfirmDialog(n)})}openBulldozeConfirmDialog(t){const n=this.root.querySelector("#bulldozeConfirmDialog"),a=this.root.querySelector("#bulldozeConfirmBody");if(!n||!a){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,a.innerHTML=`
      <div class="quest-card-mini bulldoze-confirm-card">
        <div class="bulldoze-confirm-lead">
          <strong>${T(t.buildingName)}</strong> hiện có:
        </div>
        <div class="bulldoze-confirm-hazard">
          🌾 ${T(t.hazardSummaryVi)}
        </div>
        <div class="bulldoze-confirm-note">
          Nếu phá dỡ ngay bây giờ, phần vụ mùa / sản vật / mẻ đang chạy trên ô này sẽ bị mất vĩnh viễn.
        </div>
        <div class="bulldoze-confirm-refund">
          💰 Khi xóa: <strong>${T(t.refundSummaryVi)}</strong>
        </div>
      </div>
    `,n.returnValue="",n.open||n.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),n=this.root.querySelector("#floatingBannerGrip");if(!t||!n)return;n.classList.remove("hidden");const a=(s,l)=>{t.classList.add("is-floating-dragged");const d=Math.max(0,window.innerWidth-t.offsetWidth),u=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(s,d))}px`,t.style.top=`${Math.max(0,Math.min(l,u))}px`};let i=0,o=0,r=0,c=0;n.addEventListener("pointerdown",s=>{if(s.button!==0)return;const l=t.getBoundingClientRect();i=s.clientX-l.left,o=s.clientY-l.top,r=s.clientX,c=s.clientY,n.setPointerCapture(s.pointerId)}),n.addEventListener("pointermove",s=>{n.hasPointerCapture(s.pointerId)&&(Math.hypot(s.clientX-r,s.clientY-c)>=4&&n.classList.add("dragging"),a(s.clientX-i,s.clientY-o))}),n.addEventListener("lostpointercapture",()=>{n.classList.remove("dragging")}),n.addEventListener("keydown",s=>{let d=0,u=0;if(s.key==="ArrowLeft")d=-15;else if(s.key==="ArrowRight")d=15;else if(s.key==="ArrowUp")u=-15;else if(s.key==="ArrowDown")u=15;else return;s.preventDefault();const p=t.getBoundingClientRect();a(p.left+d,p.top+u)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const s=t.getBoundingClientRect();a(s.left,s.top)}})}installDialogLightDismissFallback(){const t=()=>{const n=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(n)};for(const n of Array.from(this.root.querySelectorAll("dialog")))n.addEventListener("close",()=>{n.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",n=>{const a=n.target;if(a&&typeof a.matches=="function"&&a.matches(".aaa-codex-scroll")){const i=!!n.skipped;a.dataset.cvSkipped=i?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const n=new IntersectionObserver(a=>{for(const i of a)i.target.dataset.cvSkipped=i.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const a of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))n.observe(a)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const n=(a,i)=>{const o=i.getBoundingClientRect();return a.clientX<o.left||a.clientX>o.right||a.clientY<o.top||a.clientY>o.bottom};for(const a of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let i=!1;a.addEventListener("pointerdown",o=>{i=n(o,a)}),a.addEventListener("pointerup",o=>{i&&n(o,a)&&a.close()})}}}wireRangeProgressFallback(t){const n=()=>{const a=Number(t.min||0),i=Number(t.max||100),o=Number(t.value||0),r=Math.round((o-a)/Math.max(1,i-a)*100);t.style.setProperty("--progress",`${r}%`)};n(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",n)}togglePhotoMode(t){return Qa(this,t)}openNeighborDialog(t,n){return ii(this,t,n)}openHarvestFeastDialog(){return co(this)}refreshHarvestFeastBadges(){return po(this)}showRibbonUnveilBanner(t){return uo(this,t)}renderHarvestFeastDialog(){return ei(this)}openMinigameRescue(t){return ai(this,t)}enterVisitFromHud(t){return oi(this,t)}enterHonorTourFromHud(t){return sn(this,t)}enterFlooMemberVisitFromHud(t,n){return Je(this,t,n)}refreshFlooDirectoryFromHud(t){return Pt(this,t)}applyAuthoritativeSnapshot(t){si(this,t)}exitVisitFromHud(){return en(this)}isBuildingFocusMode(){return _s(this)}toggleHudRollup(t){return Xa(this,t)}syncHudFocusVisibility(){return nn(this)}openWorkshopDialog(t){return Un(this,t)}openSuitcaseDialog(t,n){return mo(this,t,n)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=kt(async()=>{const{Match3ModalController:t}=await import("./match3Modal-BZdAOK74.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2,3])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(n,a)=>this.showToast(n,a),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=n=>this.openPuzzleArcadeDialog(n),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=kt(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-BWTcXiCM.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([4,1,2,3])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(n,a)=>this.showToast(n,a),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=n=>this.openLeaderboardDialog(n),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,n){this.closeHudPopovers();const a=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(a,n)}openMatch3Dialog(t,n=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(a=>a.open(t,n))}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(n=>n.open(t))}openSeedQuizDialog(t,n,a,i,o,r){this.closeHudPopovers(),n||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,n,a,i,o,r)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return tt(this)}collapseBuildDock(){return nt(this)}hasOpenFloatingTray(){return Ka(this)}hideOpenFloatingTrays(){return Ya(this)}positionFloatingPopover(t,n){return Fn(this,t,n)}toggleManagePopover(t){return Za(this,t)}toggleWeatherPopover(t){return Ja(this,t)}renderWeatherPopover(){return Vn(this)}animateGalleonsTo(t){return Us(this,t)}spawnFlyReward(t,n,a,i){return eo(this,t,n,a,i)}bindEvents(){return Wa(this)}showToast(t,n="🦉"){return We(this,t,n)}showOfflineModal(t){return no(this,t)}refreshFloatingBanner(){return Gn(this)}openSeedTray(t,n){return Ys(this,t,n)}closeSeedTray(){return pt(this)}toggleSeedTray(){return ao(this)}openPastureTray(t,n){return Zs(this,t,n)}closePastureTray(){return Et(this)}togglePastureTray(){return oo(this)}renderSeedTray(){return Js(this)}renderPastureTray(){return ro(this)}refreshTouchConfirmBar(){return _n(this)}refreshAll(){return Zt(this)}refreshHeaderClock(){return Jt(this)}refreshHeader(){return js(this)}syncProgressiveHudVisibility(){return Ws(this)}refreshQuestTracker(){return Qs(this)}refreshDock(){return Xs(this)}renderStaffDrawer(t){return Ks(this,t)}syncContextualMapToolsBar(){return io(this)}renderInspector(){return pe(this)}renderFinanceDialog(){return go(this)}renderAlbumDialog(){return Ke(this)}renderQuestDialog(){return Fe(this)}renderRoadmapDialog(){return ti(this)}updateWorkshopLiveTimers(){return lo(this)}renderWorkshopDialog(){return qe(this)}renderSettingsDialog(){return Ae(this)}refreshSuitcaseBadge(){return bo(this)}updateSuitcaseLiveTimers(){return ho(this)}renderSuitcaseDialog(){return Te(this)}syncLiveNeighborSocialUI(){return $o(this)}refreshNeighborBadges(){return ri(this)}renderVisitorDockBar(){return ko(this)}renderNeighborDialog(){return $e(this)}panCameraToTutorialTarget(){return Qt(this)}resolveTutorialHudTarget(){return li(this)}updateTutorialHudSpotlight(){return Pn(this)}hideTutorialPopover(t){return di(this,t)}showTutorialPopover(t){return pi(this,t)}renderTutorialCoach(){return Hn(this)}handleTutorialPrimaryAction(t){return ui(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Rt.colorblindMode,fontScale:t?.fontScale??Rt.fontScale,highContrast:t?.highContrast??Rt.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Rt.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();ma(t),this.sim.audio?.ceiling&&ba(t,this.sim.audio)}playStoryCutscene(t){const n=qs.find(i=>i.id===t);if(!n)return;if(this.sim.state.level<n.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${n.unlockLevel} để mở khoá ${n.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${n.titleVi}`,"🎬");let a=120;n.keyframes.forEach((i,o)=>{window.setTimeout(()=>{me(this.cam,i.cameraFocusGx,i.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${i.captionVi}`,o===n.keyframes.length-1?"✨":"🕯️"),n.chapterNumber===3&&o===n.keyframes.length-1&&this.sim.launchFireworksShow(10)},a),a+=i.durationMs})}}let je=null,ut=null,Ss=!1;function ws(){return typeof navigator<"u"&&typeof navigator.install=="function"}function In(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,n=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||n}function Bn(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function gi(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const a=navigator,i=typeof a.install=="function";if(!i&&!je){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(i&&a.install)await a.install(),t.classList.add("hidden");else if(je){const o=je;je=null,await o.prompt(),((await o.userChoice).outcome==="accepted"||!je)&&t.classList.add("hidden")}}catch(o){!(o instanceof DOMException&&o.name==="AbortError")&&!je&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function Dn(){!In()||Bn()||(ut||(ut=gi()),ut.classList.remove("hidden"))}function mi(){ut&&ut.classList.add("hidden")}function Mo(){Ss||typeof window>"u"||(Ss=!0,!Bn()&&(ut=gi(),ws()&&In()&&Dn(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),je=e,!ws()&&In()&&!Bn()&&Dn()}),window.addEventListener("appinstalled",()=>{mi(),je=null})))}const Lo={init:Mo,show:Dn,hide:mi},Ao="burrow_rollback_backup_v12";function xs(e,t){const n=JSON.stringify({backedUpAt:Date.now(),state:e}),a=typeof localStorage<"u"?localStorage:void 0;try{a?.setItem(Ao,n)}catch{}return n}class qo{constructor(){x(this,"unhandledErrors",0);x(this,"fpsSamples",[]);x(this,"assetLoadLatencyMs",0);x(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const n=Math.max(1,Math.min(240,t));this.fpsSamples.push(n),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,n={},a=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:n,queuedAt:a})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const n=[...this.offlineQueue];return t(n)?(this.offlineQueue=[],n.length):0}getHealthReport(){const t=this.fpsSamples.length;let n=60,a=60;if(t>0){const i=this.fpsSamples.reduce((c,s)=>c+s,0);n=Number((i/t).toFixed(1));const o=[...this.fpsSamples].sort((c,s)=>c-s),r=Math.max(0,Math.floor((t-1)*.05));a=Number(o[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:n,p5LowFps:a,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function On(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function Ts(e){return On(e)||e.category==="decor"}async function Eo(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const n=document.createElement("canvas");n.id="gameCanvas",n.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(n);const a=new ra,i=new pa;await i.loadAll();const o=new la(a),r={x:0,y:0,zoom:.82,viewRot:0};me(r,18,24.5);const c=new ua(n,i),s=new Co(e,o,r,n,i);Lo.init(),wn.init(o);const l=new URLSearchParams(window.location.search),d=!!(l.get("preview")==="100"||l.get("visit")||l.get("tour")||l.get("zoom")||l.get("cx")||l.get("cy")||l.get("ridecam")==="1");let u=null;if(s.onCameraJump=()=>{u=null},!d&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const f=r.x,y=r.y,E=r.zoom;me(r,17.5,24),r.zoom=.76,u={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:f,toY:y,toZoom:E}}const p=Be(window.location.hostname);if(l.get("preview")==="100"&&p){o.toggleHeadmasterPreview(100),!l.get("tutorial")&&o.isTutorialActive()&&o.skipTutorial();const f=Number(l.get("zoom")||.62);r.zoom=Number.isFinite(f)&&f>=.32&&f<=2.15?f:.62;const y=Number(l.get("cx")),E=Number(l.get("cy")),F=Number.isFinite(y)&&l.get("cx")?y:24.5,U=Number.isFinite(E)&&l.get("cy")?E:23;me(r,F,U)}const m=l.get("tutorial");m==="1"||m==="reset"?(o.restartTutorial(),s.tutorialMinimized=!1):(m==="0"||m==="off")&&o.isTutorialActive()&&o.skipTutorial();const g=l.get("tstep");if(g!==null&&p){const f=Math.max(0,Math.min(Kt.length-1,Number(g)||0)),y=o.ensureTutorialState();y.active=!0,delete y.completedAt,y.skipped=!1,y.stepIndex=f,y.stepId=Kt[f].id,y.pastureHarvestedInStep3=!1}const b=Number(l.get("rot")||0);if(b>=1&&b<=3)for(let f=0;f<b;f++)xt(r,1);l.get("cutaway")==="1"&&(o.state.settings.cutawayMode=!0);const w=l.get("time");(w==="night"||w==="day"||w==="dusk"||w==="dawn")&&(o.state.settings.timeOverride=w);const $=l.get("weather");if(($==="auto"||$==="clear"||$==="cloudy"||$==="rain"||$==="storm"||$==="snow"||$==="fog"||$==="fireflies")&&(o.state.settings.weatherOverride=$),l.get("zoom")&&l.get("preview")!=="100"){const f=Number(l.get("zoom"));Number.isFinite(f)&&f>=.32&&f<=2.15&&(r.zoom=f)}if((l.get("cx")||l.get("cy"))&&l.get("preview")!=="100"){const f=Number(l.get("cx")),y=Number(l.get("cy")),E=Number.isFinite(f)&&l.get("cx")?f:18,F=Number.isFinite(y)&&l.get("cy")?y:24.5;me(r,E,F)}const C=l.get("heatmap");if(C&&(o.heatmapMode=C),l.get("fireworks")==="1"&&o.launchFireworksShow(12),l.get("ridecam")==="1"){const f=o.state.buildings.find(y=>ae(y.itemId)?.isCustomCoasterStation);f&&(s.rideCamUid=f.uid)}const h=l.get("dialog");if(h==="album")document.getElementById("btnOpenAlbum")?.click();else if(h==="finance")document.getElementById("btnOpenFinance")?.click();else if(h==="orders"||h==="quests")document.getElementById("btnOpenQuests")?.click();else if(h==="barn")s.openWorkshopDialog("barn");else if(h==="seeds"){const f=l.get("sfilter");(f==="flowers"||f==="crops"||f==="all")&&(s.seedFilterMode=f),s.openSeedTray()}else if(h==="pasture")s.openPastureTray();else if(h==="seedquiz"){const f=l.get("crop")??void 0,y=l.get("lang")??void 0,E=l.get("tier")??void 0,F=l.get("qformat")??void 0,U=l.get("sqtab"),ce=U==="codex"||U==="practice"?U:void 0;s.openSeedQuizDialog(f,null,y,E,F,ce)}else if(h==="bakery"){const f=o.state.buildings.find(y=>y.itemId==="molly_apple_bakery");f&&(s.inspectSelection={kind:"building",uid:f.uid}),s.openWorkshopDialog("brew")}else if(h==="workshop"){const f=l.get("tab")??"barn";s.openWorkshopDialog(f)}else if(h==="suitcase"){const f=l.get("tab")??"care";s.openSuitcaseDialog(f)}else if(h==="match3"){const f=Number(l.get("m3level")||0),y=p?777:Math.min(777,(o.state.match3.maxClearedLevel??0)+1),E=Number.isFinite(f)&&f>=1?Math.min(y,Math.floor(f)):void 0,F=!!(p&&E&&E>(o.state.match3.maxClearedLevel??0)+1);s.openMatch3Dialog(E,F)}else if(h==="puzzle"||h==="caro"||h==="sudoku"||h==="chess"||h==="blocks"||h==="pikachu"||h==="onet"){const f=h==="puzzle"?l.get("pmode"):h,y=f==="pikachu"||f==="onet"?"blocks":f,E=y==="caro"||y==="sudoku"||y==="chess"||y==="blocks"?y:void 0;s.openPuzzleArcadeDialog(E)}else if(h==="neighbors"||h==="friends")s.openNeighborDialog();else if(h==="feast")s.openHarvestFeastDialog();else if(h==="leaderboard"){const f=l.get("lbgame"),y=f==="match3"||f==="caro"||f==="sudoku"||f==="chess"||f==="blocks"||f==="seedquiz"?f:void 0,E=l.get("lbscope"),F=E==="valley"||E==="friends"||E==="personal"?E:void 0;s.openLeaderboardDialog(y,F)}else if(!l.get("tour")&&!l.get("visit")&&!o.isHeadmasterPreview)try{const f=localStorage.getItem(fn);if(f){const y=JSON.parse(f),E=Date.now()-Number(y.savedAt||0),F=o.state.puzzleArcade;E>=0&&E<=12*3600*1e3?y.dialog==="puzzleArcade"&&y.mode==="sudoku"&&F.sudokuSession?.stage===F.sudokuStage?s.openPuzzleArcadeDialog("sudoku"):y.dialog==="puzzleArcade"&&y.mode==="caro"&&F.caroSession?.stage===F.caroStage?s.openPuzzleArcadeDialog("caro"):y.dialog==="puzzleArcade"&&y.mode==="chess"&&F.chessSession?.stage===F.chessStage?s.openPuzzleArcadeDialog("chess"):y.dialog==="puzzleArcade"&&y.mode==="blocks"&&F.onetSession?.stage===F.blockStage?s.openPuzzleArcadeDialog("blocks"):y.dialog==="match3"&&o.state.match3.activeSession?.levelId===o.state.match3.currentLevel?s.openMatch3Dialog():localStorage.removeItem(fn):localStorage.removeItem(fn)}}catch{}const A={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},k=f=>{const y=String(f||"").trim();if(!y){s.exitVisitFromHud();return}const E=A[y]||(y.startsWith("tour_")?y:"");E?s.enterHonorTourFromHud(E):y.startsWith("player_")||o.ensureNeighborSocial().neighbors.some(F=>F.id===y)?s.enterVisitFromHud(y):s.enterFlooMemberVisitFromHud(y)},v=l.get("tour")||l.get("visit");v&&k(v);const S=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if(S.some(f=>l.has(f))){const f=new URLSearchParams(l);for(const F of S)f.delete(F);const y=f.toString(),E=`${window.location.pathname}${y?`?${y}`:""}${window.location.hash}`;window.history.replaceState(null,"",E)}o.isTutorialActive()&&!d&&s.panCameraToTutorialTarget(),He.bindSimulationGringottsWallet(o,{onSnapshot:f=>s.applyAuthoritativeSnapshot(f),onToast:(f,y)=>s.showToast(f,y??"🏦")}),He.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),s.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",f=>{s.applyAuthoritativeSnapshot(f.detail)}),window.addEventListener("hpvn:toast",f=>{const y=f.detail;y?.text&&s.showToast(String(y.text),"🔥")}),window.addEventListener("hpvn:tour-garden",f=>{const y=f.detail;k(String(y?.tourId??""))}),window.addEventListener("gamesave:updated",f=>{if(o.isHeadmasterPreview||o.isVisitingNeighbor)return;const y=f.detail,E=typeof y?.saveJson=="string"&&y.saveJson||(typeof localStorage<"u"?localStorage.getItem(Es):null);E&&(xs(o.state),o.importSaveJson(E)&&(He.authoritativeClient.snapshot&&s.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),s.match3Modal?.resetSession(),s.puzzleArcadeModal?.resetSession(),s.refreshAll(),wn.refresh(),s.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️")))}),window.addEventListener("hpvn:atmosphere",f=>{if(o.isVisitingNeighbor)return;const y=f.detail?.mode,E=y==="auto"?"realtime":y;(E==="realtime"||E==="dawn"||E==="day"||E==="dusk"||E==="night")&&(o.state.settings.timeOverride=E,o.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:weather",f=>{if(o.isVisitingNeighbor)return;const y=f.detail?.mode;(y==="auto"||y==="clear"||y==="cloudy"||y==="rain"||y==="storm"||y==="snow"||y==="fog"||y==="fireflies")&&(o.state.settings.weatherOverride=y,o.saveToStorage(),s.refreshAll())}),o.onTutorialStepChanged=()=>{s.panCameraToTutorialTarget()},o.onUiChange=()=>{s.refreshAll(),wn.refresh()},o.onToast=(f,y)=>{s.showToast(f,y),f.includes("Đạt Cấp")||f.includes("lên cấp")||f.includes("Lên Cấp")?Ft("levelup"):Ft("light"),Is(f)},o.onBuildingTactile=f=>c.triggerSquash(f),o.onBuildingCompleted=f=>{c.triggerCompletionPop(f),c.triggerSquash(f)},o.onRibbonUnveiled=f=>{const y=cs(f.gx,f.gy,r,n.clientWidth,n.clientHeight,36);c.triggerRibbonUnveilPop(f.uid,y.sx,y.sy),s.showRibbonUnveilBanner(f),Ft("levelup")},o.onRewardFly=(f,y,E,F)=>{if(typeof E=="number"&&typeof F=="number"){const U=cs(E,F,r,n.clientWidth,n.clientHeight,32);s.spawnFlyReward(f,y,U.sx,U.sy)}else s.spawnFlyReward(f,y)},o.onLevelUp=f=>{Ft("levelup");const y=Bi(f),E=y.unlockedItemIds.map(U=>ae(U)?.name).filter(Boolean).slice(0,2).join(", "),F=E?` — Mở bản vẽ mới: ${E}!`:y.milestoneNote?` — ${y.milestoneNote}`:"";s.showToast(`🎉 Đạt Cấp Giải Đố ${f}! (+${y.rewardGalleons}🪙)${F}`,"🌟"),s.refreshAll()};const M=o.processOfflineProgress();M&&s.showOfflineModal(M);const L=f=>{const y=o.getActiveVisitingNeighbor();if(!y?.remoteUserId)return;const E=y.helpedMarksToday[y.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:y.remoteUserId,buildingUid:f,kind:E?.kind||"water_crop",noteText:E?.noteText||"Chúc vườn phép thuật bội thu!",helperName:o.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let O=null,R=!1,q=!1,B=!1,N=!1,W=!1,Y=0,de=0,re=0,D=0,X=0,le=0;const I=(f,y,E,F)=>{const U=s.activeSeedCropId;if(!U)return!1;let ce=o.grid[y]?.[f]?.buildingUid??null;if(!ce)for(let z=c.hotspots.length-1;z>=0;z--){const K=c.hotspots[z];if(K.kind==="building"&&Math.hypot(E-K.sx,F-K.sy)<=K.radius){ce=K.id;break}}if(!ce)return!1;const G=o.state.buildings.find(z=>z.uid===ce);if(!G||G.cropId||Date.now()<G.constructEndsAt||!ae(G.itemId)?.isFarmlandPlot)return!1;const he=o.plantCropOnPlot(G.uid,U);if(!he.ok){if(he.needSeedAcquire)return N=!1,R=!1,s.seedTrayOpen=!1,s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(U,G.uid),!1;const z=Date.now();return z-Y>1200&&(Y=z,s.showToast(he.msg,"🪙")),!1}return s.seedTrayOpen&&(s.seedTrayOpen=!1,s.renderSeedTray(),s.refreshFloatingBanner()),!0},V=(f,y,E,F)=>{const U=s.activePastureAnimalId;if(!U)return!1;let ce=o.grid[y]?.[f]?.buildingUid??null;if(!ce)for(let z=c.hotspots.length-1;z>=0;z--){const K=c.hotspots[z];if(K.kind==="building"&&Math.hypot(E-K.sx,F-K.sy)<=K.radius){ce=K.id;break}}if(!ce)return!1;const G=o.state.buildings.find(z=>z.uid===ce);if(!G||G.pastureAnimalId||Date.now()<G.constructEndsAt||!ae(G.itemId)?.isAnimalPasturePlot)return!1;const he=o.stockAnimalOnPasture(G.uid,U);if(!he.ok){const z=Date.now();return z-de>1200&&(de=z,s.showToast(he.msg,"🪙")),!1}return s.pastureTrayOpen&&(s.pastureTrayOpen=!1,s.renderPastureTray(),s.refreshFloatingBanner()),!0},j=new Map;let ue=0,ne=!1,be=null;const ge=()=>{be&&(window.clearTimeout(be.timer),be=null)};s.onTouchConfirmPlace=()=>{if(!s.pendingTouchTile)return;const{gx:f,gy:y}=s.pendingTouchTile;if(s.moveModeActive&&s.movingBuildingUid){const E=o.moveBuilding(s.movingBuildingUid,f,y,s.rotation);if(!E.ok){s.showToast(E.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}if(s.selectedCatalogItem){const E=s.selectedCatalogItem,F=o.canPlaceItem(E,f,y,s.rotation);if(!F.ok){s.showToast(F.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(E,f,y,s.rotation),s.pendingTouchTile=null,Ts(E)||(s.selectedCatalogItem=null),s.refreshAll()}},s.onTouchCancelPlace=()=>{O=null};const te=new Set;window.addEventListener("keydown",f=>{if(document.querySelector("dialog[open]")){te.clear();return}f.target instanceof HTMLInputElement||f.target instanceof HTMLTextAreaElement||f.target instanceof HTMLSelectElement||f.target instanceof HTMLElement&&f.target.classList.contains("drag-handle")||te.add(f.key.toLowerCase())}),window.addEventListener("keyup",f=>{te.delete(f.key.toLowerCase())}),window.addEventListener("blur",()=>{te.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&te.clear()}),n.addEventListener("pointermove",f=>{j.has(f.pointerId)&&j.set(f.pointerId,{x:f.clientX,y:f.clientY});const y=n.getBoundingClientRect();if(j.size>=2){ge(),B=!1,ne=!0;const ie=Array.from(j.values()),he=Math.hypot(ie[1].x-ie[0].x,ie[1].y-ie[0].y),z=(ie[0].x+ie[1].x)*.5-y.left,K=(ie[0].y+ie[1].y)*.5-y.top;if(ue>8&&he>8){const se=(z-y.width*.5)/r.zoom+r.x,H=(K-y.height*.5)/r.zoom+r.y,ee=he/ue;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*ee)),r.x=se-(z-y.width*.5)/r.zoom,r.y=H-(K-y.height*.5)/r.zoom}ue=he;return}const E=f.clientX-y.left,F=f.clientY-y.top;if(!o.isVisitingNeighbor&&!q&&!s.movingBuildingUid&&!s.pincerActive)for(const ie of c.hotspots)ie.kind==="bubble"&&Math.hypot(E-ie.sx,F-ie.sy)<=ie.radius&&o.harvestBuildingBubble(ie.id);const U=vn(E,F,r,y.width,y.height,o.grid);if(s.pendingTouchTile||(O={gx:U.gx,gy:U.gy}),!R)return;if(be&&j.size===1&&Math.hypot(f.clientX-re,f.clientY-D)>8){const ie=be;ge(),B=!0,o.placeItem(ie.item,ie.gx,ie.gy,ie.rot)}if(B&&s.selectedCatalogItem){o.placeItem(s.selectedCatalogItem,U.gx,U.gy,s.rotation);return}if(N&&s.activeSeedCropId){I(U.gx,U.gy,E,F);return}if(W&&s.activePastureAnimalId){V(U.gx,U.gy,E,F);return}const ce=f.clientX-re,G=f.clientY-D;Math.hypot(ce,G)>5&&(q=!0,s.rideCamUid=null),q&&(u=null,r.x=X-ce/r.zoom,r.y=le-G/r.zoom)}),n.addEventListener("pointerdown",f=>{if(j.set(f.pointerId,{x:f.clientX,y:f.clientY}),j.size>=2){ge();const G=Array.from(j.values());ue=Math.hypot(G[1].x-G[0].x,G[1].y-G[0].y),ne=!0,B=!1;return}if(f.button!==0&&f.button!==2)return;const y=n.getBoundingClientRect(),E=f.clientX-y.left,F=f.clientY-y.top,U=vn(E,F,r,y.width,y.height,o.grid);s.pendingTouchTile||(O={gx:U.gx,gy:U.gy}),R=!0,q=!1,re=f.clientX,D=f.clientY,X=r.x,le=r.y;const ce=s.selectedCatalogItem;if(f.button===0&&ce&&On(ce)&&!s.hasOpenFloatingTray()){if(f.pointerType==="touch"){ge(),B=!1;const G=s.rotation;be={item:ce,gx:U.gx,gy:U.gy,rot:G,timer:window.setTimeout(()=>{be=null,j.size===1&&!ne&&R&&(B=!0,o.placeItem(ce,U.gx,U.gy,G))},75)}}else B=!0,o.placeItem(ce,U.gx,U.gy,s.rotation);N=!1,W=!1}else f.button===0&&s.activeSeedCropId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&I(U.gx,U.gy,E,F)?(B=!1,N=!0,W=!1):f.button===0&&s.activePastureAnimalId&&!s.selectedCatalogItem&&!s.moveModeActive&&!s.bulldozerActive&&!s.pincerActive&&V(U.gx,U.gy,E,F)?(B=!1,N=!1,W=!0):(B=!1,N=!1,W=!1)});const Qe=f=>{j.delete(f),j.size<2&&(ue=0)};window.addEventListener("pointercancel",f=>{ge(),Qe(f.pointerId),R=!1,q=!1,B=!1,N=!1,W=!1,ne=!1}),window.addEventListener("pointerup",f=>{if(Qe(f.pointerId),ne){ge(),j.size===0&&(ne=!1,R=!1,q=!1,N=!1,W=!1);return}if(!R)return;let y=!1;if(be&&!q&&f.target===n){const se=be;ge(),o.placeItem(se.item,se.gx,se.gy,se.rot),y=!0}else ge();const E=q,F=B||y||N||W;if(R=!1,q=!1,B=!1,N=!1,W=!1,E||F)return;if(f.button===2){s.selectedCatalogItem=null,s.bulldozerActive=!1,s.moveModeActive=!1,s.movingBuildingUid=null,s.pincerActive=!1,s.pincerPicked=null,s.closeSeedTray(),s.closePastureTray(),s.collapseBuildDock(),s.closeHudPopovers(),s.pendingTouchTile=null,s.inspectSelection=null,s.refreshAll();return}if(f.target!==n)return;const U=s.pendingSowPlotUid,ce=s.pendingStockPastureUid;if(s.closeHudPopovers(),s.hasOpenFloatingTray()&&(s.hideOpenFloatingTrays(),s.selectedCatalogItem||s.moveModeActive||s.bulldozerActive||s.pincerActive)){s.refreshAll();return}const G=n.getBoundingClientRect(),ie=f.clientX-G.left,he=f.clientY-G.top,z=vn(ie,he,r,G.width,G.height,o.grid),K=f.pointerType==="touch";if(s.pincerActive){const se=s.pincerPicked??(o.staff[0]?{kind:"staff",id:o.staff[0].id,label:o.staff[0].name}:null);se&&o.dropPickedEntity(se.kind,se.id,z.gx,z.gy),s.pincerPicked=null,s.pincerActive=!1,s.refreshAll();return}if(s.bulldozerActive){let se=z.gx,H=z.gy;const ee=o.grid[H]?.[se];if(!ee?.buildingUid&&(!ee||ee.path==="none")){for(const P of c.hotspots)if(P.kind==="building"&&Math.hypot(ie-P.sx,he-P.sy)<=P.radius){const Z=o.state.buildings.find(Me=>Me.uid===P.id);Z&&(se=Z.gx,H=Z.gy);break}}o.removeAtTile(se,H);return}if(s.moveModeActive){if(s.movingBuildingUid){if(K&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==z.gx||s.pendingTouchTile.gy!==z.gy)){const P=o.state.buildings.find(Me=>Me.uid===s.movingBuildingUid),Z=P?ae(P.itemId):void 0;O={gx:z.gx,gy:z.gy},s.pendingTouchTile={gx:z.gx,gy:z.gy,label:Z?.name??"Dời công trình"},s.refreshTouchConfirmBar();return}const ee=o.moveBuilding(s.movingBuildingUid,z.gx,z.gy,s.rotation);if(!ee.ok){s.showToast(ee.reason??"Không thể đặt tại ô này!","⚠️");return}s.movingBuildingUid=null,s.moveModeActive=!1,s.pendingTouchTile=null,s.refreshAll();return}let H=o.grid[z.gy]?.[z.gx]?.buildingUid??null;if(!H){for(const ee of c.hotspots)if(ee.kind==="building"&&Math.hypot(ie-ee.sx,he-ee.sy)<=ee.radius){H=ee.id;break}}if(H){const ee=o.state.buildings.find(P=>P.uid===H);if(ee?.isIndestructible){s.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(ee){s.movingBuildingUid=ee.uid,s.rotation=ee.rotation,s.refreshFloatingBanner();const P=ae(ee.itemId);s.showToast(`Đã nhấc "${P?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(s.selectedCatalogItem){const se=s.selectedCatalogItem;if(K&&!On(se)&&(!s.pendingTouchTile||s.pendingTouchTile.gx!==z.gx||s.pendingTouchTile.gy!==z.gy)){O={gx:z.gx,gy:z.gy},s.pendingTouchTile={gx:z.gx,gy:z.gy,label:se.name},s.refreshTouchConfirmBar();return}const H=o.canPlaceItem(se,z.gx,z.gy,s.rotation);if(!H.ok){s.showToast(H.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(se,z.gx,z.gy,s.rotation),s.pendingTouchTile=null,Ts(se)||(s.selectedCatalogItem=null),s.refreshAll();return}for(const se of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let H=null,ee=1/0;for(let P=c.hotspots.length-1;P>=0;P--){const Z=c.hotspots[P];if(Z.kind!==se)continue;const Me=Math.hypot(ie-Z.sx,he-Z.sy);if(Z.spriteKey&&typeof Z.boxLeft=="number"&&typeof Z.boxTop=="number"&&typeof Z.boxW=="number"&&typeof Z.boxH=="number"&&Z.boxW>2&&Z.boxH>2){const ln=ie>=Z.boxLeft&&ie<=Z.boxLeft+Z.boxW&&he>=Z.boxTop&&he<=Z.boxTop+Z.boxH,Bt=(ie-Z.boxLeft)/Z.boxW,_e=(he-Z.boxTop)/Z.boxH,ye=ln&&i.hitTestAlpha(Z.spriteKey,Bt,_e,!!Z.flipX),st=Z.kind==="building"&&Me<=Z.radius*.5;if(!ye&&!st)continue;if((H===null||Me<ee*.82)&&(H=Z,ee=Me,ye))break}else Me<=Z.radius&&Me<ee&&(ee=Me,H=Z)}if(H){if(H.kind==="owl_post"){const P=c.collectOwlPostParcel();P&&o.claimOwlPostDelivery(P.gx,P.gy),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="visitor_gift"){const P=o.claimVisitedNeighborMysteryGift();P.ok?c.notifyJuice("harvest",H.sx,H.sy):s.showToast(P.msg,"🎁"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="neighbor_help"){c.triggerSquash(H.id);const P=o.helpVisitedNeighborBuilding(H.id);P.ok?(c.notifyJuice("harvest",H.sx,H.sy),L(H.id)):s.showToast(P.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="home_lantern"){const P=o.ensureNeighborSocial().homeLanternMarks.find(Me=>Me.id===H.id);P&&c.triggerSquash(P.buildingUid);const Z=o.claimHomeLanternMark(H.id);Z.ok?c.notifyJuice("harvest",H.sx,H.sy):s.showToast(Z.msg,"🏮"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="unveil_building"){o.unveilBuilding(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="bubble"){o.harvestBuildingBubble(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="water_crop"){c.triggerSquash(H.id);const P=o.waterCropPlot(H.id);P.ok?c.notifyJuice("harvest",H.sx,H.sy):s.showToast(P.msg,"💧"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="feed_pasture"){c.triggerSquash(H.id);const P=o.feedAnimalPasture(H.id);P.ok?c.notifyJuice("harvest",H.sx,H.sy):s.showToast(P.msg,"🌾"),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="escaped"){o.catchEscapedCreature(H.id),s.inspectSelection=null,s.refreshAll();return}if(H.kind==="zone_plaque"){s.closeSeedTray(),s.inspectSelection={kind:"zone",zoneId:H.id},s.refreshAll();return}if(H.kind==="villager"){o.greetVillager(H.id),s.refreshAll();return}if(H.kind==="building"){const P=o.state.buildings.find(Z=>Z.uid===H.id);if(P){if(!o.isVisitingNeighbor&&P.awaitingUnveil){o.unveilBuilding(P.uid),s.inspectSelection=null,s.refreshAll();return}const Z=ae(P.itemId),Me=!!(!o.isVisitingNeighbor&&Z?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()>=P.cropReadyAt),ln=!!(!o.isVisitingNeighbor&&Z?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()>=P.pastureReadyAt);if(!Me&&!ln&&c.triggerSquash(H.id),o.isVisitingNeighbor){const ye=o.getVisitedBuildingHelpStatus(P);if(ye.canHelp){const st=o.helpVisitedNeighborBuilding(P.uid);st.ok?(c.notifyJuice("harvest",H.sx,H.sy),L(P.uid)):s.showToast(st.msg,"💧")}else if(ye.existingMark)s.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${ye.existingMark.noteText}”`,"🏮");else{const st=ae(P.itemId),Zn=o.getActiveVisitingNeighbor();s.showToast(`🏡 Đang ngắm "${st?.name??"Công trình"}" (${P.stars}★) tại vườn ${Zn?.name??"bạn bè"}!`,Zn?.avatarEmoji??"🏡")}s.inspectSelection=null,s.refreshAll();return}const Bt=o.ensureNeighborSocial().homeLanternMarks.find(ye=>ye.buildingUid===P.uid);if(Bt&&o.claimHomeLanternMark(Bt.id).ok){c.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}if(P.itemId==="burrow_honeydukes_canon"){s.closeSeedTray(),s.inspectSelection=null,s.refreshAll(),s.openMatch3Dialog();return}const _e=ae(P.itemId);if(_e?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()>=P.cropReadyAt){o.harvestCropPlot(P.uid),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()<P.cropReadyAt&&!P.cropWateredBoost){o.waterCropPlot(P.uid).ok&&c.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isFarmlandPlot&&!P.cropId&&Date.now()>=P.constructEndsAt){if(s.activeSeedCropId){const ye=o.plantCropOnPlot(P.uid,s.activeSeedCropId);if(ye.needSeedAcquire){s.inspectSelection=null,s.refreshAll(),s.openSeedQuizDialog(s.activeSeedCropId,P.uid);return}s.showToast(ye.msg,ye.ok?"🌱":"🪙"),s.inspectSelection=null,s.refreshAll()}else U===P.uid?(s.inspectSelection=null,s.refreshAll()):s.openSeedTray(void 0,P.uid);return}else if(_e?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()>=P.pastureReadyAt){o.harvestAnimalPasture(P.uid),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()<P.pastureReadyAt&&!P.pastureFedBoost){o.feedAnimalPasture(P.uid).ok&&c.notifyJuice("harvest",H.sx,H.sy),s.inspectSelection=null,s.refreshAll();return}else if(_e?.isAnimalPasturePlot&&!P.pastureAnimalId&&Date.now()>=P.constructEndsAt){if(s.activePastureAnimalId){const ye=o.stockAnimalOnPasture(P.uid,s.activePastureAnimalId);s.showToast(ye.msg,ye.ok?"🐾":"🪙"),s.inspectSelection=null,s.refreshAll()}else ce===P.uid?(s.inspectSelection=null,s.refreshAll()):s.openPastureTray(void 0,P.uid);return}else(P.storedGalleons>0||P.readyFarmGoods&&P.readyFarmGoods.length>0)&&o.harvestBuildingBubble(P.uid)}s.closeSeedTray(),s.closePastureTray(),s.inspectSelection={kind:"building",uid:H.id},s.refreshAll();return}}}s.inspectSelection=null,s.refreshAll()}),n.addEventListener("contextmenu",f=>f.preventDefault()),n.addEventListener("wheel",f=>{f.preventDefault(),u=null;const y=n.getBoundingClientRect(),E=f.clientX-y.left,F=f.clientY-y.top,U=(E-y.width*.5)/r.zoom+r.x,ce=(F-y.height*.5)/r.zoom+r.y,G=f.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*G)),r.x=U-(E-y.width*.5)/r.zoom,r.y=ce-(F-y.height*.5)/r.zoom},{passive:!1});let oe=performance.now(),fe=0;const _=new va,ve=new qo;xs(o.state);const we=document.createElement("div");we.id="gamepadRadialMenu",we.className="aaa-gamepad-radial",we.hidden=!0,we.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${Ps.map(f=>{const y=f.index*Math.PI*2/8,E=50+Math.cos(y)*37,F=50+Math.sin(y)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${f.index}" style="left:${E.toFixed(1)}%;top:${F.toFixed(1)}%;">${f.icon}<br/>${f.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(we);let Ce=null,Xe=!1;const Qn=f=>{switch(f){case"seeds":s.openSeedTray();break;case"barn":s.openWorkshopDialog("barn");break;case"orders":{s.activeQuestTab="orders",s.renderQuestDialog(),s.root.querySelector("#questDialog")?.showModal();break}case"match3":s.openMatch3Dialog();break;case"arcade":s.openPuzzleArcadeDialog();break;case"seedquiz":s.openSeedQuizDialog();break;case"neighbors":s.openNeighborDialog("friends");break;case"feast":s.openHarvestFeastDialog();break}},bi=ga(),hi=s.root.querySelector("#match3Dialog"),fi=s.root.querySelector("#puzzleArcadeDialog"),vi=s.root.querySelector("#seedQuizDialog"),an=Array.from(s.root.querySelectorAll("dialog"));let It=!1,bt=!1;const on=()=>{It=!!(hi?.open||fi?.open||vi?.open),bt=It||an.some(f=>f.open)};if(on(),typeof MutationObserver<"u"){const f=new MutationObserver(()=>{on()});for(const y of an)f.observe(y,{attributes:!0,attributeFilter:["open"]})}s.root.addEventListener("close",on,!0);let Ge=0,Xn=0;function rn(f){if(Ge=0,document.hidden){oe=f;return}const y=(f-oe)/1e3;if(oe=f,!bt&&y>.002&&y<.5&&(ve.recordFrameFps(1/y),fe%90===0&&fe>0)){const z=ve.getHealthReport();bi?c.adaptiveDprCap=z.p5LowFps<46?1.15:z.p5LowFps<54?1.35:1.5:c.adaptiveDprCap=z.p5LowFps<46?1.25:z.p5LowFps<54?1.5:2}const E=_.poll();if(E.connected){if(E.panDx!==0||E.panDy!==0){u=null,s.rideCamUid=null;const z=380/r.zoom*Math.min(.05,y);r.x+=E.panDx*z,r.y+=E.panDy*z}if(E.radialOpen?(we.hidden=!1,Xe=!0,E.radialActionId&&(Ce=E.radialActionId),we.querySelectorAll("[data-radial-idx]").forEach(z=>{z.dataset.selected=String(Number(z.dataset.radialIdx)===E.radialSliceIndex)}),E.confirmJustPressed&&Ce&&(we.hidden=!0,Xe=!1,Qn(Ce),Ce=null)):Xe&&(we.hidden=!0,Xe=!1,Ce&&(Qn(Ce),Ce=null)),E.cancelJustPressed){const z=an.filter(K=>K.open);z.length>0?z[z.length-1]?.close():s.hasOpenFloatingTray()&&s.hideOpenFloatingTrays()}}if((te.has("w")||te.has("arrowup")||te.has("s")||te.has("arrowdown")||te.has("a")||te.has("arrowleft")||te.has("d")||te.has("arrowright"))&&(u=null),u){const z=Math.min(1,Math.max(0,(f-u.startMs)/u.durationMs)),K=1-Math.pow(1-z,3);r.x=u.fromX+(u.toX-u.fromX)*K,r.y=u.fromY+(u.toY-u.fromY)*K,r.zoom=u.fromZoom+(u.toZoom-u.fromZoom)*K,z>=1&&(u=null)}const F=340/r.zoom*Math.min(.05,y);if(te.size>0&&bt&&te.clear(),(te.has("w")||te.has("arrowup"))&&(s.rideCamUid=null,r.y-=F),(te.has("s")||te.has("arrowdown"))&&(s.rideCamUid=null,r.y+=F),(te.has("a")||te.has("arrowleft"))&&(s.rideCamUid=null,r.x-=F),(te.has("d")||te.has("arrowright"))&&(s.rideCamUid=null,r.x+=F),o.update(y),s.rideCamUid&&!It){const z=o.state.buildings.find(se=>se.uid===s.rideCamUid),K=o.coasterCircuits.get(s.rideCamUid);if(K&&K.waypoints.length>=3){const se=ca(K.waypoints,K.isClosed,Date.now()/1e3,3);if(se.length>0){const H=se[0],ee=yn(H.gx+.5,H.gy+.5,r.viewRot??0),P=ee.wx,Z=ee.wy-(H.elev*da+10);r.x+=(P-r.x)*Math.min(1,y*10),r.y+=(Z-r.y)*Math.min(1,y*10),r.zoom+=(1.38-r.zoom)*Math.min(1,y*5),s.rideCamSpeedText=`${H.speedKmh} km/h (${H.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,fe%8===0&&s.refreshFloatingBanner()}}else if(z){const se=Date.now()/1e3,H=z.gx+2+Math.cos(se*2.1)*1.4,ee=z.gy+2+Math.sin(se*2.1)*1.4,P=yn(H,ee,r.viewRot??0);r.x+=(P.wx-r.x)*Math.min(1,y*8),r.y+=(P.wy-22-r.y)*Math.min(1,y*8),r.zoom+=(1.35-r.zoom)*Math.min(1,y*5),s.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",fe%12===0&&s.refreshFloatingBanner()}else s.rideCamUid=null,s.refreshFloatingBanner()}const U=o.getRealTimePeriod(),ce=o.getCurrentWeather(),G=yn(3,17,r.viewRot??0),ie=Math.hypot(r.x-G.wx,r.y-G.wy)<420;if(a.updateSoundscape(Math.min(.1,y),U==="night"||U==="dusk",r.zoom,ie,ce.kind,o.getActiveFestival()!=="none"),!It&&(!bt||f-Xn>=80)){Xn=f;const z=s.pendingTouchTile?{gx:s.pendingTouchTile.gx,gy:s.pendingTouchTile.gy}:O;c.activeSeedBrushCropId=s.activeSeedCropId,c.activePastureBrushAnimalId=s.activePastureAnimalId,c.render(o,r,z,s.selectedCatalogItem,s.rotation,s.bulldozerActive,s.inspectSelection?.kind==="building"?s.inspectSelection.uid:null,s.movingBuildingUid,s.pincerPicked?.label??null),fe++,!bt&&fe%6===0&&!s.photoModeActive&&c.renderMinimap(s.minimapCanvas,o,r)}Ge=requestAnimationFrame(rn)}Ge=requestAnimationFrame(rn),document.addEventListener("visibilitychange",()=>{document.hidden?(Ge&&(cancelAnimationFrame(Ge),Ge=0),o.saveToStorage(),a.pause()):(oe=performance.now(),a.resume(),Ge||(Ge=requestAnimationFrame(rn)))}),window.addEventListener("pagehide",()=>{o.saveToStorage()}),window.addEventListener("beforeunload",()=>{o.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{o.saveToStorage()});let Kn=0,Yn="";const yi=o.onUiChange;o.onUiChange=()=>{yi?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:o.state.level,galleons:o.state.galleons}}));const f=Date.now(),y=`${o.state.level}|${o.state.match3.stars}|${o.state.unlockedZones.length}|${o.state.buildings.length}|${o.state.settings.weatherOverride}|${o.state.settings.timeOverride}`;y!==Yn&&f-Kn>=1200&&(Yn=y,Kn=f,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:o.state.parkName,level:o.state.level,magicStars:o.state.match3.stars,galleons:o.state.galleons,unlockedZonesCount:o.state.unlockedZones.length,buildingsCount:o.state.buildings.length,weatherMode:o.state.settings.weatherOverride,atmosphereMode:o.state.settings.timeOverride==="realtime"?"auto":o.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",f=>{if(o.isVisitingNeighbor)return;const y=String(f.detail?.mode||"auto");(y==="auto"||y==="none"||y==="halloween"||y==="christmas"||y==="quidditch_cup")&&(o.state.settings.activeFestival=y,o.saveToStorage(),s.refreshAll())}),window.addEventListener("hpvn:mute",f=>{const y=!!f.detail?.muted;o.state.settings.soundEnabled=!y,o.state.settings.bgmEnabled=!y,a.enabled=!y,a.bgmEnabled=!y,y?a.pause():a.resume(),o.saveToStorage(),s.refreshAll()}),window.addEventListener("gamesave:helpers",f=>{const y=f.detail;if(!y)return;const E=o.homeStateWhileVisiting??o.state,F=E===o.state?o.ensureNeighborSocial():E.neighborSocial??(E.neighborSocial=o.ensureNeighborSocial()),U=new Set(F.homeLanternMarks.map(K=>K.id)),ce=E.buildings[0]?.uid||"burrow_main_gate",G=Date.now(),ie=900*1e3,he=3600*1e3;let z=0;for(const K of y.helpers??[]){if(!K?.id||U.has(K.id)||F.homeLanternMarks.length>=5)continue;U.add(K.id);const se=K.buildingUid?E.buildings.find(ee=>ee.uid===K.buildingUid):void 0,H=(se&&((se.cropReadyAt??0)>G||(se.pastureReadyAt??0)>G||(se.workshopQueue?.[0]?.endsAt??0)>G||(se.constructEndsAt??0)>G)?se:void 0)??E.buildings.find(ee=>(ee.cropReadyAt??0)>G||(ee.pastureReadyAt??0)>G||(ee.workshopQueue?.[0]?.endsAt??0)>G||(ee.constructEndsAt??0)>G);if(H)if((H.cropReadyAt??0)>G)H.cropReadyAt=Math.max(G,(H.cropReadyAt??G)-ie),H.cropWateredBoost=!0;else if((H.pastureReadyAt??0)>G)H.pastureReadyAt=Math.max(G,(H.pastureReadyAt??G)-ie);else if((H.workshopQueue?.[0]?.endsAt??0)>G)for(const ee of H.workshopQueue??[])ee.startedAt-=ie,ee.endsAt=Math.max(G,ee.endsAt-ie);else(H.constructEndsAt??0)>G+he&&(H.constructEndsAt=Math.max(G+he,(H.constructEndsAt??G)-ie));F.homeLanternMarks.push({id:K.id,buildingUid:H?.uid||K.buildingUid||ce,helperId:K.uid,helperName:K.name||"Hàng Xóm Hang Sóc",helperEmoji:K.avatarEmoji||"🧙‍♂️",kind:K.kind||"water_crop",noteVi:K.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:K.at||G}),z++}z>0&&(o.saveToStorage(),s.refreshAll(),y.summaryVi&&s.showToast(y.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",f=>{const y=f.detail;if(!y)return;const E=o.homeStateWhileVisiting??o.state,F=E===o.state?o.ensureNeighborSocial():E.neighborSocial??(E.neighborSocial=o.ensureNeighborSocial());typeof y.dayKey=="string"&&y.dayKey&&(F.lastSocialResetKey=y.dayKey),typeof y.dailyGardenHelpsCount=="number"&&y.dailyGardenHelpsCount>(F.dailyGardenHelpsCount??0)&&(F.dailyGardenHelpsCount=y.dailyGardenHelpsCount)})}Eo().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(n.map(a=>a.unregister()))}if("caches"in window){const n=await caches.keys().catch(()=>[]);await Promise.all(n.map(a=>caches.delete(a)))}window.location.reload()}))});export{ct as M,Fa as c,De as s};
