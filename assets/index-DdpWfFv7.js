const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-Bh2a0z2t.js","assets/game-data-LHOZhbEq.js","assets/sim-5LbHIhRi.js","assets/puzzleArcadeModal-C-SNPI7s.js"])))=>i.map(i=>d[i]);
var ei=Object.defineProperty;var ti=(e,t,s)=>t in e?ei(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var w=(e,t,s)=>ti(e,typeof t!="symbol"?t+"":t,s);import{F as Se,af as es,ag as si,b as pt,w as xe,ah as ni,g as ie,ai as xt,aj as zs,Q as ts,G as Et,ae as Pe,P as Ze,q as Vt,ak as cn,M as Ve,o as Re,al as dn,m as ii,Z as Cs,p as ai,u as oi,j as it,s as De,$ as $t,A as Ne,r as ht,E as ri,I as li,N as pn,R as un,y as ci,D as Nt,U as di,H as ut,am as St,S as pi,an as ui,W as gn,X as mn,k as qt,C as ss,_ as ns,z as Fs,B as gi,V as mi,T as _t,a2 as bi}from"./game-data-LHOZhbEq.js";import{i as ct,j as Ms,k as hi,A as gt,n as fi,l as st,m as Gs,o as Vs,H as at,L as is,p as _s,q as mt,t as Us,u as Le,v as vi,w as yi,x as js,y as as,z as ue,B as ft,C as vt,D as Si,F as bt,M as Pt,G as wi,I as xi,J as $i,K as bs,P as Ws,N as Ti,O as ki,Q as Ci,R as Qs,S as Ks,U as nt,V as Mi,W as bn,X as Li,Y as Ai,Z as Dt,_ as Ei,$ as qi,a0 as Pi,a1 as hn,a2 as Ke,a3 as Ie,a4 as Hi,a5 as Rt,a6 as Ii,a7 as Bi,a8 as Xe,a9 as yt,aa as Tt,d as Ni,ab as os,ac as rs,ad as Di,ae as Ri,af as Oi,ag as zi,ah as Fi,ai as Gi,aj as ls,g as Xs,ak as cs,s as Vi,al as ds,E as _i}from"./sim-5LbHIhRi.js";import{S as Ui,I as ji}from"./engine-CeJlUX3u.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const Ht={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function Wi(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const s=t.documentElement;s.setAttribute("data-colorblind",e.colorblindMode),s.setAttribute("data-font-scale",String(e.fontScale)),s.setAttribute("data-high-contrast",e.highContrast?"true":"false"),s.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function Qi(e,t){t.ceiling.setAllVolumes(e.volumes)}const fn=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],Ki=.18;function It(e,t=Ki){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const s=e<0?-1:1,o=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((s*Math.min(1,o)).toFixed(3))}function Xi(e,t){if(Math.hypot(e,t)<.35)return null;let o=Math.atan2(t,e);o<0&&(o+=Math.PI*2);const i=Math.PI*2/8,a=(o+i*.5)%(Math.PI*2);return Math.floor(a/i)%8}class Yi{constructor(){w(this,"prevConfirm",!1);w(this,"prevCancel",!1);w(this,"prevDpadUp",!1);w(this,"prevDpadDown",!1);w(this,"prevDpadLeft",!1);w(this,"prevDpadRight",!1)}poll(t){let s=t??null;if(!s&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const x=navigator.getGamepads();for(const C of x)if(C&&C.connected){s=C;break}}if(!s)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const o=It(s.axes[0]??0),i=It(s.axes[1]??0),a=It(s.axes[2]??0),r=It(s.axes[3]??0),l=!!s.buttons[0]?.pressed,n=!!s.buttons[1]?.pressed,c=!!s.buttons[4]?.pressed,d=!!s.buttons[12]?.pressed,u=!!s.buttons[13]?.pressed,p=!!s.buttons[14]?.pressed,m=!!s.buttons[15]?.pressed,b=l&&!this.prevConfirm,g=n&&!this.prevCancel,y=(m&&!this.prevDpadRight?1:0)-(p&&!this.prevDpadLeft?1:0),T=(u&&!this.prevDpadDown?1:0)-(d&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=n,this.prevDpadUp=d,this.prevDpadDown=u,this.prevDpadLeft=p,this.prevDpadRight=m;const k=c,h=k?Xi(Math.abs(a)>0?a:o,Math.abs(r)>0?r:i):null,L=h!==null?fn[h]?.actionId??null:null;return{connected:!0,panDx:k?0:o,panDy:k?0:i,cursorStepGx:y,cursorStepGy:T,radialOpen:k,radialSliceIndex:h,radialActionId:L,confirmJustPressed:b,cancelJustPressed:g}}}let vn=null,qe=null,ke=null,ps=null;function yn(e){!ke&&typeof document<"u"&&(ke=document.getElementById("a11y-announcer")),!(!ke||!e)&&(ke.textContent="",requestAnimationFrame(()=>{ke&&(ke.textContent=e)}))}function Zi(e){const t=e.state.buildings.find(o=>o.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const s=Date.now();if(t.constructEndsAt>s)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-s)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const o=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-s)/1e3)),i=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${o} giây, tổng ${i} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function hs(e){const t=e??vn;if(!t||(!qe&&typeof document<"u"&&(qe=document.getElementById("a11y-farm-status")),!qe))return;const s=t.state,o=s.level,i=s.galleons.toLocaleString("vi-VN"),a=s.sandboxMode?"Vô hạn":String(s.match3?.stars??0),r=s.timeSand,l=s.farmBarn?.owlOrders??[],n=l.filter(u=>t.canFulfillFarmOwlOrder(u)).length,c=`${l.length} đơn hàng (${n} đơn đủ nông sản sẵn sàng giao)`,d=Zi(t);qe.innerHTML=`
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
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${c}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${d}</td></tr>
      </tbody>
    </table>
  `.trim()}function Ji(e){vn=e,!(typeof document>"u")&&(ke||(ke=document.getElementById("a11y-announcer"),ke||(ke=document.createElement("div"),ke.id="a11y-announcer",ke.className="visually-hidden",ke.setAttribute("aria-live","polite"),ke.setAttribute("aria-atomic","true"),document.body.appendChild(ke))),qe||(qe=document.getElementById("a11y-farm-status"),qe||(qe=document.createElement("div"),qe.id="a11y-farm-status",qe.className="visually-hidden",qe.setAttribute("role","region"),qe.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(qe))),hs(e),ps&&clearInterval(ps),ps=setInterval(()=>{hs()},5e3))}const us={init:Ji,announce:yn,refresh:()=>hs()},ea="hpvn-burrow-garden",ta=new Set(["auto","dawn","day","dusk","night"]),sa=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),Ys=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function kt(e,t){const s=typeof e=="string"?e.trim():"";if(!s||s==="null")return!1;if(typeof window<"u"&&window.location?.origin&&s===window.location.origin)return!0;const o=t&&t.length>0?[...Ys,...t]:Ys;for(const i of o)if(typeof i=="string"){if(i===s)return!0}else if(i.test(s))return!0;return!1}function na(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const s=new URL(document.referrer).origin;if(kt(s,t))return s}catch{}return null}function Zs(e){const t=String(e||"day").toLowerCase();return ta.has(t)?t:"day"}function Js(e){const t=String(e||"clear").toLowerCase();return sa.has(t)?t:"clear"}function Sn(e={}){const t=e.parkName||"Trang Trại Hang Sóc",s=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",o=Math.max(1,Math.floor(Number(e.level)||1)),i=Math.max(0,Math.floor(Number(e.magicStars)||0)),a=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",n=e.keeperTitle?` · [${e.keeperTitle}]`:"",c={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},d=e.weatherMode&&c[e.weatherMode]?` (${c[e.weatherMode]})`:"";return`🏰 [${t}${s} · Cấp ${o}${l}${n}]${d} — ${a}/10 vùng mở khóa, ${r} công trình & ${i} 🌟 Sao Phép Thuật!`}function ia(e={}){const t=[],s=e.win??(typeof window<"u"?window:void 0),o=e.nav??(typeof navigator<"u"?navigator:void 0);let i=na(e.targetOrigin,e.allowedOrigins);function a(n,c={}){const d={source:ea,version:"25.1",type:n,payload:c,sentAt:Date.now()};t.push(d),t.length>24&&t.shift();try{const u=s?.parent;if(u&&u!==s&&typeof u.postMessage=="function"){const p=e.targetOrigin||i||"*";u.postMessage(d,p)}}catch{}return d}function r(n){const c=n;if(c.source!=null&&s?.parent!=null&&c.source!==s.parent)return;if(!e.allowAnyOrigin&&typeof c.origin=="string"&&c.origin.length>0){if(!kt(c.origin,e.allowedOrigins))return;i=c.origin}const d=c?.data;if(!d||typeof d!="object")return;const u=d.payload&&typeof d.payload=="object"?d.payload:{};if(d.type==="hpvn:burrow:set-atmosphere"||d.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(Zs(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-weather"||d.type==="hpvn:host:set-weather")e.onWeatherChange?.(Js(u.mode??d.mode));else if(d.type==="hpvn:burrow:set-event"||d.type==="hpvn:host:set-event")e.onEventChange?.(String(u.mode??d.mode??"auto"));else if(d.type==="hpvn:burrow:tour-garden"||d.type==="hpvn:host:tour-garden"){const p=u.tourId??d.tourId??null;p?e.onStartTour?.(String(p)):e.onStopTour?.()}else if(d.type==="hpvn:burrow:mute"||d.type==="hpvn:host:mute")e.onMuteChange?.(!!(u.muted??d.muted));else if(d.type==="hpvn:burrow:request-snapshot"||d.type==="hpvn:host:request-snapshot"){const p=e.getSnapshot?e.getSnapshot():{};a("hpvn:burrow:snapshot",p)}}s&&typeof s.addEventListener=="function"&&s.addEventListener("message",r);async function l(n={}){const c=Sn(n),d=a("hpvn:burrow:share-floo",{text:c,level:n.level??1,parkName:n.parkName??"Trang Trại Hang Sóc",...n.playerName?{playerName:n.playerName}:{},...n.tourId?{tourId:n.tourId}:{},...n.image?{image:n.image}:{},atmosphereMode:Zs(n.atmosphereMode),weatherMode:Js(n.weatherMode),eventMode:n.eventMode??"auto"});if(typeof n.sendToFloo=="function"&&await n.sendToFloo(c,n)===!0)return e.notify?.(n.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:c,copied:!1,floo:!0,envelope:d};let u=!1;try{o?.clipboard?.writeText&&(await o.clipboard.writeText(c),u=!0)}catch{u=!1}return e.notify?.(u?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${c}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${c}"`),{ok:!0,text:c,copied:u,envelope:d}}return{notifyReady:(n={})=>a("hpvn:burrow:ready",n),syncState:(n={})=>a("hpvn:burrow:state",n),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{s&&typeof s.removeEventListener=="function"&&s.removeEventListener("message",r)}}}function fs(e,t={},s){const a=s??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});a.width=640,a.height=380;const r=a.getContext("2d");if(!r)return a;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),n=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),c=Math.max(1,Math.floor(Number(t.level)||1)),d=t.house||"Gryffindor",u=Math.max(0,Math.floor(Number(t.magicStars)||0)),p=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),m=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const g={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(g,614,31),r.textAlign="left";const y=18,T=50,k=604,h=248;r.save(),r.beginPath(),r.rect(y,T,k,h),r.clip();let L=!1;if(e&&e.width>0&&e.height>0)try{const I=e.width/e.height,_=k/h;let W=0,B=0,V=e.width,le=e.height;I>_?(V=Math.round(e.height*_),W=Math.round((e.width-V)/2)):(le=Math.round(e.width/_),B=Math.round((e.height-le)/2)),r.drawImage(e,W,B,V,le,y,T,k,h),L=!0}catch{L=!1}if(!L){const I=r.createLinearGradient(y,T,y,T+h);I.addColorStop(0,"#365843"),I.addColorStop(.55,"#598249"),I.addColorStop(1,"#334d2c"),r.fillStyle=I,r.fillRect(y,T,k,h)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(y,T,k,h);const x=18,C=304,$=604,M=58;r.fillStyle="#f6ebd2",r.fillRect(x,C,$,M),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(x,C,$,M);const O={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[d]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${O} ${l} · Cấp ${c}`,x+14,C+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const z=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${n} · Nhà ${d}${z} · ${m}/10 vùng · ${p} công trình · ${u} 🌟`,x+14,C+42);const E=142,N=34,D=x+$-E-12,K=C+12;return r.fillStyle="#1d5c4b",r.fillRect(D,K,E,N),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(D,K,E,N),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",D+E/2,K+N/2+1),r.textAlign="left",a}function wn(e,t=.55){try{const s=e.toDataURL("image/webp",t);if(typeof s=="string"&&s.startsWith("data:image/webp"))return s;const o=e.toDataURL("image/png");return typeof o=="string"?o:""}catch{return""}}const aa={};function Oe(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),s=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^s&15>>t/4).toString(16)})}function xn(e,t){const s=Math.max(1,Math.floor(Number(t)||1)),o=e.effectivePrice??e.price,i=e.dailyRemaining??e.dailyLimit;let a=0;for(let r=0;r<s;r++)r<i?a+=o:e.overflowMultiplier&&e.overflowMultiplier>1?a+=Math.ceil(o*e.overflowMultiplier):a+=o;return a}const oa=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function Ut(e,t={}){const s=e&&typeof e=="object"?e:{},o=s.details&&typeof s.details=="object"?s.details:{},i=String(s.reason||o.reason||"unknown-error"),a={...oa,...t.labels||{}};switch(i){case"missing-crops":{const r=Array.isArray(o.missing)?o.missing:[];if(r.length>0){const l=r.map(n=>{const c=String(n.resource||"");return`${Math.max(1,Number(n.required||0)-Number(n.have||0))} ${a[c]||c}`});return{reason:i,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:i,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof o.shortBy=="number"?o.shortBy:typeof o.required=="number"&&typeof o.spendable=="number"?Math.max(1,o.required-o.spendable):null;return{reason:i,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(o.required||0),l=Number(o.have||0),n=Math.max(1,r-l);return{reason:i,icon:"🌟",text:`Thiếu ${n} Sao Phép Thuật`}}case"missing-supply":{const r=String(o.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:i,icon:"🌱",item:l,text:`Thiếu hạt ${a[l]||l}`}}return{reason:i,icon:"💧",item:r,text:`Thiếu ${a[r]||"vật tư"}`}}case"wallet-frozen":return{reason:i,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:i,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:i,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:i,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:i,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:i,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:i,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:i,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:i,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:i,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:i,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:i,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:i,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:i,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:i,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(i==="model-rejected"&&typeof o.modelCode=="string"&&t.modelText){const r=t.modelText(o.modelCode);if(r)return{reason:i,icon:"🪄",text:r}}return{reason:i,icon:"🪄",text:s.message||"Máy chủ từ chối thao tác"}}}}function Lt(e){let t=null,s=null,o=Promise.resolve();const i=n=>{const c=o.then(n,n);return o=c.catch(()=>{}),c};async function a(n,c){const d=t?.catalogHash,u=d?{...c,catalogHash:d}:c,p=await e(n,u);if(!p||typeof p!="object"||!("garden"in p))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const m=p;return m.catalog===void 0&&d&&m.catalogHash===d&&(m.catalog=t?.catalog),t?.saleAdmin&&m.saleAdmin===void 0&&(m.saleAdmin=!0),t=m,t}async function r(n,c){const d=JSON.stringify({name:n,payload:c});if(s&&s.signature!==d)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");s||(s={signature:d,data:{...c,requestId:Oe()}});try{const u=await a(n,s.data);return s=null,u}catch(u){throw u?.definitive===!0&&(s=null),u}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return s!==null},read:()=>i(()=>a("getBurrowGarden",{})),act:n=>i(()=>r("performBurrowAction",{...n,expectedRevision:l()})),free:(n,c={})=>i(()=>a("performBurrowAction",{...c,action:"freeAction",kind:n,expectedRevision:t?.garden.progression.revision??0,requestId:Oe()})),guide:n=>i(()=>a("performBurrowAction",{action:"guideDone",lessonId:n,expectedRevision:t?.garden.progression.revision??0,requestId:Oe()})),scene:n=>i(()=>a("performBurrowAction",{action:"setScene",scene:n,expectedRevision:t?.garden.progression.revision??0,requestId:Oe()})),syncProfile:n=>i(()=>a("performBurrowAction",{...n,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:Oe()})),visit:(n={})=>i(()=>e("visitBurrowGarden",n)),frame:n=>i(async()=>{const c=await e("setBurrowFlooFrame",{frameKey:n});return t&&Array.isArray(c.frames)&&typeof c.worn=="string"&&(t={...t,flooFrames:{frames:c.frames,worn:c.worn}}),c}),sales:(n={mode:"get"})=>i(()=>e("manageBurrowSales",n)),fireOut:n=>i(()=>e("extinguishBurrowGarden",{...n,requestId:Oe()})),sell:(n,c)=>i(()=>r("sellBurrowGoods",n?{items:n,expectedTotal:c}:{clearance:!0,expectedTotal:c})),buy:(n,c=1)=>i(()=>{const d=t?.catalog?.find(u=>u.id===n);if(!d)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:n,quantity:c,catalogVersion:t?.catalogVersion,expectedTotal:xn(d,c)})}),settleWallet:n=>i(()=>a("settleBurrowWallet",{direction:n.direction,amount:Math.max(1,Math.floor(n.amount)),...n.reasonCode?{reasonCode:n.reasonCode}:{},...n.sourceType?{sourceType:n.sourceType}:{},...typeof n.clientLevel=="number"?{clientLevel:Math.floor(n.clientLevel)}:{},requestId:typeof n.requestId=="string"&&n.requestId?n.requestId:Oe()})),houseCup:()=>i(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(n,c)=>i(()=>e("contributeBurrowHouseCup",{points:n,...c?{house:c}:{}})),postCoop:n=>i(()=>e("postBurrowCoopRequest",{...n,requestId:typeof n.requestId=="string"?n.requestId:Oe()})),fulfillCoop:n=>i(()=>e("fulfillBurrowCoopRequest",n)),listCoop:n=>i(()=>e("getBurrowCoopRequests",n?{hostUid:n}:{}))}}const Fe="hpvn-burrow-game";function Ls(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const s=new URLSearchParams(t);return s.get("burrow-ticket")??s.get("hpvn-ticket")}function $n(e,t=window,s={}){let o=0;const i=new Map;let a=s.targetOrigin&&s.targetOrigin!=="*"?s.targetOrigin:null;if(!a&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;kt(l,s.allowedOrigins)&&(a=l)}catch{}t.addEventListener("message",l=>{if(!s.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!kt(l.origin,s.allowedOrigins))return;a=l.origin}const n=l.data;if(l.source!==t.parent||!n||n.channel!==Fe||n.nonce!==e||typeof n.id!="string"||!i.has(n.id))return;const c=i.get(n.id);i.delete(n.id),c(n)});const r=Lt((l,n)=>new Promise((c,d)=>{const u=`burrow-${++o}`,p=setTimeout(()=>{i.delete(u),d(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);i.set(u,m=>{if(clearTimeout(p),"result"in m&&m.result&&typeof m.result=="object"){c(m.result);return}const b=new Error(typeof m.error=="string"?m.error:"Máy chủ từ chối thao tác.");b.definitive=m.definitive===!0,b.reason=typeof m.reason=="string"?m.reason:void 0,b.details=m.details&&typeof m.details=="object"?m.details:{},d(b)}),t.parent.postMessage({channel:Fe,nonce:e,id:u,action:"burrow",name:l,data:n},s.targetOrigin||a||"*")}));return r.host=(l,n={})=>new Promise(c=>{const d=`host-${++o}`,u=setTimeout(()=>{i.delete(d),c(null)},5e3);i.set(d,p=>{clearTimeout(u),c(p.result??null)}),t.parent.postMessage({...n,channel:Fe,nonce:e,id:d,action:l},s.targetOrigin||a||"*")}),r}function Tn(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),s=e.sessionEndpoint??"/api/auth/session",o=e.fetchImpl??globalThis.fetch.bind(globalThis),i=e.getUid??ct,a=e.timeoutMs??18e3;let r=null,l=0;async function n(c){if(r&&Date.now()+3e4<l)return r;try{const d=typeof window<"u"?window:void 0,u=d?.__HPVN_CONFIG__?.getIdToken??d?.__HPVN_GET_ID_TOKEN__,p=u?await u().catch(()=>null):null,m=typeof window<"u"?Ls(window.location):null,b=await o(s,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":c,...p?{Authorization:`Bearer ${p}`}:{}},body:JSON.stringify({uid:c,...p?{idToken:p}:{},...m?{ticket:m}:{}})});if(!b.ok)return null;const g=await b.json();if(typeof g.uid=="string"&&g.uid&&!e.getUid&&Ms(g.uid),typeof g.token=="string"&&g.token)return r=g.token,l=Number(g.expiresAt||Date.now()+36e5),r}catch{}return null}return Lt(async(c,d)=>{const u=i(),p=await n(u),m=new AbortController,b=setTimeout(()=>m.abort(),a);let g;try{const T={"Content-Type":"application/json","X-User-Id":u};p&&(T.Authorization=`Bearer ${p}`),g=await o(`${t}${c}`,{method:"POST",headers:T,body:JSON.stringify({data:d}),signal:m.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(b)}const y=await g.json();if(y.error||!g.ok){const T=new Error(y.error?.message||`Máy chủ từ chối thao tác (${g.status}).`);throw T.definitive=g.status<500,T.reason=typeof y.error?.details?.reason=="string"?y.error.details.reason:void 0,T.details=y.error?.details??{},T}return y.result??{}})}const kn="asia-southeast1",Kt="demo-hpvnn-burrow",ra="hpvnn-archive";function Be(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function en(e){const t=new TextEncoder().encode(e);let s="";for(let o=0;o<t.length;o++)s+=String.fromCharCode(t[o]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Cn(e,t=Kt,s=globalThis.location,o=Date.now()){const i=s?.hostname??"127.0.0.1";if(!Be(i))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const a=Math.floor(o/1e3),r=en(JSON.stringify({alg:"none",typ:"JWT"})),l=en(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:a,user_id:e,sub:e,iat:a,exp:a+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${l}.`}function Mn(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!Be(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const s=e.host??(t?.hostname||"127.0.0.1");if(!Be(s))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const o=e.projectId||Kt,i=e.region||kn,a=e.port||5001,l=`${e.useSameOriginRewrite?"":`http://${s}:${a}`}/${o}/${i}/`,n=e.fetchImpl??globalThis.fetch.bind(globalThis),c=e.getUid??(()=>e.uid||ct()),d=e.now??(()=>Date.now()),u=e.timeoutMs??18e3;return Lt(async(p,m)=>{const b=c(),g=Cn(b,o,{hostname:s},d()),y=new AbortController,T=setTimeout(()=>y.abort(),u);let k;try{k=await n(`${l}${p}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`},body:JSON.stringify({data:m}),signal:y.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout(T)}const h=await k.json();if(h.error||!k.ok){const L=new Error(h.error?.message||`Emulator từ chối thao tác (${k.status}).`);throw L.definitive=k.status<500,L.reason=typeof h.error?.details?.reason=="string"?h.error.details.reason:void 0,L.details=h.error?.details??{},L}return h.result??{}})}function Ln(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),s=e.fetchImpl??globalThis.fetch.bind(globalThis),o=e.timeoutMs??2e4;return Lt(async(i,a)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,n=new AbortController,c=setTimeout(()=>n.abort(),o);let d;try{const p={"Content-Type":"application/json"};l?p.Authorization=`Bearer ${l}`:p["X-User-Id"]=ct(),d=await s(`${t}${i}`,{method:"POST",headers:p,body:JSON.stringify({data:a}),signal:n.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(c)}const u=await d.json();if(u.error||!d.ok){const p=new Error(u.error?.message||`Cloud Functions từ chối thao tác (${d.status}).`);throw p.definitive=d.status<500,p.reason=typeof u.error?.details?.reason=="string"?u.error.details.reason:void 0,p.details=u.error?.details??{},p}return u.result??{}})}function la(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const s=async o=>{const i=o;if(!e.allowAnyOrigin&&typeof i.origin=="string"&&i.origin.length>0&&!kt(i.origin,e.allowedOrigins))return;const a=i.data;if(!a||a.channel!==Fe||a.nonce!==e.nonce||typeof a.id!="string"||e.expectedSource&&i.source!==e.expectedSource)return;const r=i.source;if(!r||typeof r.postMessage!="function")return;const l=typeof i.origin=="string"&&i.origin.length>0&&i.origin!=="null"?i.origin:"*",n=a.id,c=String(a.action||"");if(c==="burrow"||c==="garden"){const d=String(a.name||""),u=a.data&&typeof a.data=="object"?a.data:{};try{const p=await e.transport(d,u);r.postMessage({channel:Fe,nonce:e.nonce,id:n,result:p},l)}catch(p){const m=p;r.postMessage({channel:Fe,nonce:e.nonce,id:n,error:m?.message||"Máy chủ từ chối thao tác.",definitive:m?.definitive===!0,reason:m?.reason,details:m?.details??{}},l)}return}try{const d=e.onHostAction?await e.onHostAction(c,a):{ok:!0};r.postMessage({channel:Fe,nonce:e.nonce,id:n,result:d},l)}catch(d){r.postMessage({channel:Fe,nonce:e.nonce,id:n,error:d instanceof Error?d.message:"Lỗi xử lý lệnh host.",definitive:!0},l)}};return t.addEventListener("message",s),()=>{t.removeEventListener("message",s)}}function dt(){if(typeof window<"u"){const e=Ls(window.location);if(e)return $n(e,window);const t=new URLSearchParams(window.location.search),s=t.get("emulator"),o=t.get("functionsPort");if((s==="1"||o)&&Be(window.location.hostname)){const l=Number(o||5001)||5001,n=t.get("project")||Kt,c=t.get("uid")||void 0;return Mn({projectId:n,port:l,uid:c,useSameOriginRewrite:s==="vite"})}const i=window.__HPVN_CONFIG__,a=aa?.VITE_HPVN_FUNCTIONS_URL,r=i?.functionsBaseUrl||a;if(r)return Ln({functionsBaseUrl:r,getIdToken:i?.getIdToken})}return Tn()}let tn=Promise.resolve();async function ca(e,t){const s=typeof navigator<"u"?navigator:void 0,o=s&&"locks"in s?s.locks:void 0;if(o&&typeof o.request=="function")return o.request(e,async()=>t());const i=tn.then(t,t);return tn=i.catch(()=>{}),i}function da(e){const t=`${e.scope}-save-envelope`,s=e.persistent!==!1,o=e.storage??globalThis.localStorage,i=e.legacyKeys??[];let a={},r=null;function l(){if(r)return r;if(!s||!o)return a;const c=o.getItem(t);if(c!==null){const u=JSON.parse(c);if(!u||typeof u!="object"||Array.isArray(u))throw new Error("Bản lưu thung lũng không hợp lệ.");return u}const d={};for(const u of i){const p=o.getItem(u);p!==null&&(d[u]=p)}return d}function n(c){s&&o?o.setItem(t,JSON.stringify(c)):a=c}return{storageKey:t,getItem(c){return l()[c]??null},setItem(c,d){r?r[c]=String(d):n({...l(),[c]:String(d)})},transaction(c){if(r)return c();r={...l()};try{const d=c();return n(r),d}finally{r=null}}}}async function pa(e=dt()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const s=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(s.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(s.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(s.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(s.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function ua(e,t,s=dt()){const o=await s.contributeHouseCup(e,t);if(!o||typeof o!="object")return null;const i=o.totals&&typeof o.totals=="object"?o.totals:{};return{weekKey:String(o.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(i.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(i.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(i.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(i.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(o.playerContribution)||0)),updatedAt:Number(o.updatedAt)||Date.now()}}async function ga(e,t=dt()){return t.postCoop(e)}async function ma(e,t=dt()){return t.fulfillCoop(e)}const ba=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:Fe,HPVN_DEFAULT_EMULATOR_PROJECT:Kt,HPVN_FIREBASE_REGION:kn,HPVN_PROD_FIREBASE_PROJECT:ra,attachHpvnParentShellResponder:la,computeClientPackTotal:xn,contributeWeeklyHouseCupOnline:ua,createAtomicGardenStorage:da,createAutoAuthoritativeClient:dt,createBurrowGardenClient:Lt,createEmulatorFixtureToken:Cn,createFirebaseEmulatorClient:Mn,createFirebaseFunctionsClient:Ln,createHpvnEmbedClient:$n,createHttpAuthoritativeClient:Tn,fetchWeeklyHouseCupStandingsOnline:pa,formatServerRefusalVi:Ut,fulfillCoopAssistanceOnline:ma,generateRequestId:Oe,getHpvnTicketFromLocation:Ls,isLocalDevelopmentHost:Be,postCoopAssistanceOnline:ga,runWithStorageLock:ca},Symbol.toStringTag,{value:"Module"})),ha={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function Bt(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;const t=navigator.userActivation;if(t&&!t.hasBeenActive)return!1;try{const s=ha[e]??15;return navigator.vibrate(s)}catch{return!1}}function Q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function sn(e){const t=at[e]??at.Gryffindor;return{emoji:t.mascotEmoji,label:t.house,cls:`house-${t.cssSlug}`}}function fa(e){return e===1?"🥇 #1":e===2?"🥈 #2":e===3?"🥉 #3":`#${e}`}class va{constructor(t,s){w(this,"activeGameId","match3");w(this,"activeScope","valley");w(this,"activeHouseFilter","all");w(this,"redirectedFromUnscored",null);w(this,"onJumpToGame");w(this,"onVisitNeighbor");w(this,"onOpenNeighborBook");w(this,"root");w(this,"sim");w(this,"closeBound",!1);w(this,"sortingHatSpinning",!1);this.root=t,this.sim=s,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");return t||(t=document.createElement("dialog"),t.id="leaderboardDialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=`
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      `,this.root.appendChild(t)),this.closeBound||(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)&&t.addEventListener("click",s=>{if(s.target!==t)return;const o=t.getBoundingClientRect();o.top<=s.clientY&&s.clientY<=o.top+o.height&&o.left<=s.clientX&&s.clientX<=o.left+o.width||t.close()})),t}open(t,s,o){t?hi(t)?(this.redirectedFromUnscored=null,this.activeGameId=t):(this.redirectedFromUnscored=t,this.activeGameId=gt.includes(this.activeGameId)?this.activeGameId:fi(t)):(this.redirectedFromUnscored=null,gt.includes(this.activeGameId)||(this.activeGameId="match3")),(s==="valley"||s==="friends"||s==="personal")&&(this.activeScope=s),(o==="all"||o&&st.includes(o))&&(this.activeHouseFilter=o);const i=this.ensureDialogMounted();this.render(),i.open||i.showModal();const a=this.activeGameId;Gs(this.sim.state,a).catch(()=>{}).then(()=>Promise.all(gt.map(r=>Vs(r)))).then(r=>{i.open&&r.some(l=>l.length>0)&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}renderHouseCupSectionHtml(t,s){const o=at[s]??at.Gryffindor,i=t.map(l=>{const n=l.meta,c=this.activeHouseFilter===l.house,d=l.rank===1?"🥇 #1":l.rank===2?"🥈 #2":l.rank===3?"🥉 #3":`#${l.rank}`;return`
          <button
            type="button"
            class="house-cup-card house-card-${n.cssSlug} ${l.isPlayerHouse?"is-player-house":""} ${c?"is-filtered-house":""}"
            data-lb-house-card="${l.house}"
            aria-pressed="${c}"
            title="${Q(n.vnTitle)} (${Q(n.gemNameVi)})"
          >
            <div class="house-cup-top">
              <span class="house-cup-crest" aria-hidden="true">${n.emblemSvg}</span>
              <div class="house-cup-meta">
                <div class="house-cup-name-row">
                  <strong>${d} ${Q(n.house)}</strong>
                  ${l.isPlayerHouse?'<span class="house-you-pill">Bạn</span>':""}
                </div>
                <div class="house-cup-vn-title">${n.gemEmoji} ${Q(n.gemShortVi)} • 👥 ${l.members}</div>
              </div>
              <span class="house-cup-hourglass-icon" aria-hidden="true" title="Đồng hồ cát ${Q(n.gemNameVi)}">${n.hourglassSvg}</span>
            </div>
            <div class="house-cup-points-row">
              <span class="house-cup-points">${l.points.toLocaleString("vi-VN")} đ</span>
              <span class="house-cup-patronus" title="${Q(n.patronusNameVi)}">${n.patronusEmoji}</span>
            </div>
            <div class="hourglass-bar" role="progressbar" aria-valuenow="${l.fillPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Mực đá quý ${Q(n.gemShortVi)} của nhà ${Q(n.house)}">
              <div class="hourglass-bar-fill" style="width:${l.fillPercent}%"></div>
            </div>
          </button>
        `}).join(""),a=st.map(l=>{const n=at[l],c=l===s;return`
        <button
          type="button"
          class="lb-my-house-btn house-pill-${n.cssSlug} ${c?"active":""}"
          data-lb-pick-house="${l}"
          aria-pressed="${c}"
          title="${Q(n.vnTitle)} (${Q(n.traitsVi)})"
        >
          ${n.mascotEmoji} ${Q(n.house)}
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
      `,...st.map(l=>{const n=at[l],c=this.activeHouseFilter===l,d=t.find(u=>u.house===l)?.members??0;return`
          <button
            type="button"
            class="filter-pill filter-pill-${n.cssSlug} ${c?"active":""}"
            data-lb-house-filter="${l}"
            aria-pressed="${c}"
          >
            ${n.mascotEmoji} ${Q(n.house)} <span class="filter-pill-count">(${d})</span>
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
              <span>🎩 <strong>${o.mascotEmoji} ${Q(o.house)}</strong></span>
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
              ${a}
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
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const s=is[this.activeGameId],o=this.root.querySelector("#leaderboardDialogTitle");o&&(o.innerHTML=`🏆 Bảng Xếp Hạng • ${Q(s.shortVi)}`);const i=gt.map(n=>{const c=is[n],d=this.sim.getPlayerMinigameRank(n,"valley"),u=n===this.activeGameId;return`
        <button
          type="button"
          role="tab"
          aria-selected="${u}"
          data-lb-game="${n}"
          class="lb-game-tab ${u?"active":""}"
          title="${Q(c.titleVi)} — #${d}"
        >
          <img src="${c.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${Q(c.shortVi)}</strong>
            <span class="lb-tab-rank-pill">${d<=3?"👑 ":""}#${d}</span>
          </span>
        </button>
      `}).join(""),a=`
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
            ▶️ ${Q(s.shortVi)}
          </button>
        </div>
      </div>
    `,r=this.activeScope==="personal"?this.renderPersonalThreeGamesTableHtml():this.renderStandingViewHtml(this.activeScope),l=this.redirectedFromUnscored?`<div class="lb-unscored-note" role="note">
          📌 <strong>${Q(is[this.redirectedFromUnscored]?.shortVi??"")}</strong> là môn rèn luyện tự do không xếp hạng — dưới đây là Bảng Xếp Hạng <strong>3 môn tính điểm</strong> (Bùa Gặt • Số Học • Sinh Vật).
        </div>`:"";t.innerHTML=`
      <div class="lb-shell">
        ${l}
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">
          ${i}
        </div>
        ${a}
        ${r}
      </div>
    `,this.bindEvents(t)}renderPodiumCardHtml(t,s){if(!t)return"";const o=s===1?"🥇":s===2?"🥈":"🥉",i=sn(t.house),a=t.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${Q(t.portraitSprite)}.png" alt="" class="lb-podium-avatar-img" />`:`<span class="lb-podium-avatar-emoji" aria-hidden="true">${Q(t.avatarEmoji)}</span>`;return`
      <div class="lb-podium-card place-${s} ${t.isPlayer?"is-player":""}">
        <div class="lb-podium-medal">${o} #${s}</div>
        <div class="lb-podium-avatar-wrap">${a}</div>
        <div class="lb-podium-name">${Q(t.name)}</div>
        <div class="lb-podium-house ${i.cls}">${i.emoji} ${i.label}</div>
        <div class="lb-podium-primary">${Q(t.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${Q(t.ratingDisplayVi)}</div>
      </div>
    `}renderStandingViewHtml(t){const s=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:o,entries:i,playerEntry:a,playerRank:r,totalEntries:l,nextRivalAbove:n,houseStandings:c,playerHouse:d}=s,u=n?`🎯 Đuổi <strong>#${n.rank} ${Q(n.name)}</strong> (${Q(n.primaryDisplayVi)})`:`👑 Đang dẫn đầu <strong>#1</strong> (${Q(o.shortVi)})`,p=this.renderHouseCupSectionHtml(c,d),m=i.length>0?`
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(i[1],2)}
        ${this.renderPodiumCardHtml(i[0],1)}
        ${this.renderPodiumCardHtml(i[2],3)}
      </div>
    `:"",b=i.length>0?i.map(g=>{const y=sn(g.house),T=fa(g.rank),k=g.isPlayer?'<span class="lb-role-tag you">Bạn</span>':g.isCloudPlayer?'<span class="lb-role-tag cloud">🌐</span>':g.isFriend?'<span class="lb-role-tag friend">🤝</span>':"",h=!g.isPlayer&&g.neighborId?`<button type="button" class="lb-mini-visit-btn" data-lb-visit="${Q(g.neighborId)}" title="Thăm ${Q(g.name)}">🏡</button>`:"";return`
          <tr class="lb-row ${g.isPlayer?"is-player":""} ${g.rank<=3?`top-${g.rank}`:""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <span class="lb-rank-chip rank-${Math.min(4,g.rank)}">${T}</span>
                <span class="lb-avatar-badge" aria-hidden="true">${Q(g.avatarEmoji)}</span>
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${Q(g.name)}</strong>
                    ${k}
                  </div>
                  <div class="lb-contender-sub">
                    <span class="${y.cls}">${y.emoji} ${y.label}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <span class="lb-league-pill tier-${g.league.tierId}">${g.league.icon} ${Q(g.league.labelVi)}</span>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(g.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(g.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(g.detailDisplayVi)}</span>
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
        <img src="${o.spriteIcon}" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">${Q(o.shortVi)}</div>
          <div class="lb-cup-chase">${u}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng</span>
          <strong class="lb-player-rank-num">#${r}<span>/${l}</span></strong>
          <span class="lb-league-pill tier-${a.league.tierId}">${a.league.icon} ${Q(a.league.labelVi)}</span>
        </div>
      </div>

      ${p}

      ${m}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Bậc'; --label-3: '${Q(o.primaryColVi)}'; --label-4: '${Q(o.secondaryColVi)}'; --label-5: 'Chi Tiết';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            ${Q(o.shortVi)} (${i.length}/${l})
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bậc</th>
              <th scope="col">${Q(o.primaryColVi)}</th>
              <th scope="col">${Q(o.secondaryColVi)}</th>
              <th scope="col">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            ${b}
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
            ${this.sim.getAllPersonalLeaderboardSummaries().map(o=>`
          <tr class="lb-row ${o.gameId===this.activeGameId?"is-player":""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <img src="${o.meta.spriteIcon}" alt="" class="lb-tab-sprite" />
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${Q(o.meta.shortVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${o.league.tierId}">${o.league.icon} ${Q(o.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${o.valleyRank}/${o.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 #${o.friendsRank}/${o.friendsTotal}</div>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(o.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(o.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(o.detailDisplayVi)}</span>
                <button type="button" class="brass-btn gold-cta lb-mini-play-btn" data-lb-jump-play="${o.gameId}">
                  ▶️ Chơi
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
          </tbody>
        </table>
      </div>
    `}bindEvents(t){t.querySelectorAll("[data-lb-game]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbGame;!o||!gt.includes(o)||(this.sim.audio.playClick(),this.activeGameId=o,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),Gs(this.sim.state,o).catch(()=>{}).then(()=>Vs(o)).then(i=>{i.length>0&&this.activeGameId===o&&this.render()}))})}),t.querySelectorAll("[data-lb-scope]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbScope;o&&(this.sim.audio.playClick(),this.activeScope=o,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbHouseFilter;o&&(this.sim.audio.playClick(),o==="all"?this.activeHouseFilter="all":st.includes(o)&&(this.activeHouseFilter=o),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbHouseCard;!o||!st.includes(o)||(this.sim.audio.playClick(),this.activeHouseFilter=this.activeHouseFilter===o?"all":o,this.render())})}),t.querySelectorAll("[data-lb-pick-house]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbPickHouse;!o||!st.includes(o)||(this.sim.setPlayerHouse(o,this.activeGameId),this.activeHouseFilter!=="all"&&(this.activeHouseFilter=o),this.render())})}),t.querySelector("#btnLbSortingHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0;const s=this.sim.rollPlayerSortingHat(this.activeGameId);this.activeHouseFilter!=="all"&&(this.activeHouseFilter=s),this.render(),window.setTimeout(()=>{this.sortingHatSpinning=!1,this.render()},420)}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeGameId;this.close(),this.onJumpToGame?.(s)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbJumpPlay;o&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(o))})}),t.querySelectorAll("[data-lb-visit]").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.lbVisit;o&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(o))})})}}function Y(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const gs=["en","ko","zh","es","ja"],ms=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class ya{constructor(t,s,o,i,a){w(this,"root");w(this,"sim");w(this,"onRefreshHud");w(this,"onToast");w(this,"onEquipAndSow");w(this,"targetCropId","ottery_wheat");w(this,"pendingPlotUid",null);w(this,"challenge",null);w(this,"answeredOutcome",null);w(this,"selectedChoiceIdx",null);w(this,"placedTokenIndices",[]);w(this,"selectedLeftPairId",null);w(this,"matchedPairIds",new Set);w(this,"flashWrongPairKey",null);w(this,"pairMistakes",0);w(this,"cropFilter","all");w(this,"activeSubView","practice");w(this,"codexQuery","");w(this,"codexBoxFilter","all");w(this,"sessionShownQids",new Set);w(this,"skipFormatOffset",0);w(this,"starterChallengePendingPack",!1);w(this,"onOpenLeaderboard");this.root=t,this.sim=s,this.onRefreshHud=o,this.onToast=i,this.onEquipAndSow=a}open(t,s,o,i,a,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(Se).filter(u=>this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel);if(t&&Se[t]){const u=Se[t];this.sim.state.sandboxMode||this.sim.state.level>=u.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!Se[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=s??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const n=this.sim.ensureLanguageQuiz();let c=!this.challenge||this.answeredOutcome!==null;o&&gs.includes(o)&&n.activeLang!==o&&(n.activeLang=o,c=!0),i&&(i==="beginner"||i==="intermediate"||i==="advanced")&&(_s(n,n.activeLang,i),c=!0),a&&ms.includes(a)&&(n.preferredFormat=a,c=!0),c||this.challenge?.lang!==n.activeLang?(this.challenge&&!this.answeredOutcome&&mt(n,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(n.activeLang,!1),this.render());const d=this.root.querySelector("#seedQuizDialog");d&&!d.open&&d.showModal(),this.onRefreshHud()}recordSessionShownQid(t){for(this.sessionShownQids.delete(t),this.sessionShownQids.add(t);this.sessionShownQids.size>350;){const s=this.sessionShownQids.values().next().value;if(s===void 0)break;this.sessionShownQids.delete(s)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(t,s=!1){es(t)||si(t).then(o=>{const i=this.sim.ensureLanguageQuiz();if(i.activeLang===t){if(o){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=Us(i,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),s&&i.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Le(a,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),s&&i.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Le(a,this.challenge.lang,.94)}}})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const s=this.sim.ensureLanguageQuiz(),o=es(s.activeLang);this.challenge=Us(s,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),o?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(s.activeLang,t)),this.sim.saveToStorage(),this.render();const i=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(i&&(i.scrollTop=0),o&&t&&s.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Le(a,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const s=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=s,this.sim.ensureLanguageQuiz().autoSpeak&&Le(this.challenge.fullSentence,this.challenge.lang,.95);const i=Se[this.targetCropId];if(s.correct){const a=s.tierAutoPromoted?` • Thăng hạng ${pt[this.challenge.lang].tierLabels[s.tierAutoPromoted]}!`:"",r=s.phoenixTalismanAwarded?` • 🔥 +${s.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=s.buildReduction&&s.buildReduction.reducedSec>0?` • 🔨 -${xe(s.buildReduction.reducedSec)} xây ${s.buildReduction.targetName??"công trình"}!`:"",n=s.leaderboardRankUp&&s.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${s.leaderboardRankUp.newRank} (+${s.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${s.seedsAwarded} hạt ${i.emoji} ${i.name} (Túi: ${s.newSeedCount} hạt)${l}${a}${r}${n}`,s.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const s=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,s)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const s=this.sim.ensureLanguageQuiz(),o=s.activeLang,i=pt[o],a=s.profiles[o],r=Se[this.targetCropId],l=this.sim.getSeedCount(this.targetCropId),n=this.sim.getFarmItemCount(this.targetCropId),c=this.sim.state.galleons,d=r.seedCost,u=r.seedCost*3,p=c>=d,m=c>=u,b=vi(a,this.sim.state.level),g=a.totalAnswered>0?Math.round(a.totalCorrect/a.totalAnswered*100):100,y=yi(a),T=ni(o),k=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),h=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let L="";if(this.pendingPlotUid){const I=this.sim.state.buildings.find(_=>_.uid===this.pendingPlotUid);I&&ie(I.itemId)?.isFarmlandPlot&&!I.cropId&&(L=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${I.gx}, ${I.gy}]</strong></span>
            ${l>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${l})</button>`:""}
          </div>
        `)}const x=Object.values(Se).sort((I,_)=>I.unlockLevel-_.unlockLevel||I.growSec-_.growSec),C=x.filter(I=>I.isFlowerCrop).length,$=x.length-C,M=x.filter(I=>this.cropFilter==="flowers"?!!I.isFlowerCrop:this.cropFilter==="crops"?!I.isFlowerCrop:!0),A=[{id:"all",label:`🌱 (${x.length})`},{id:"flowers",label:`🌸 Hoa (${C})`},{id:"crops",label:`🌾 Cây (${$})`}].map(I=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===I.id?"active":""}"
            data-sq-crop-filter="${I.id}"
            aria-pressed="${this.cropFilter===I.id}"
          >${I.label}</button>
        `).join(""),O=M.map(I=>{const _=!this.sim.state.sandboxMode&&this.sim.state.level<I.unlockLevel,W=I.id===this.targetCropId,B=this.sim.getSeedCount(I.id),V=xe(I.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${W?"active":""} ${_?"locked":""}"
            data-sq-crop="${I.id}"
            aria-pressed="${W}"
            ${_?"disabled":""}
            title="${_?`Lv.${I.unlockLevel} (⏱️ ${V})`:`${I.name} • ⏱️ ${V} • 🪙 ${I.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${xt(I.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${Y(I.name)}</span>
              <span class="sq-crop-pill-sub">
                ${_?`🔒 Lv.${I.unlockLevel}`:`🌱 ${B} • ⏱️${V}`}
              </span>
            </span>
          </button>
        `}).join(""),z=gs.map(I=>{const _=pt[I],W=s.profiles[I],B=I===o,V=W.tier==="beginner"?"Tập Sự":W.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${B?"active":""}"
          data-sq-lang="${I}"
          aria-pressed="${B}"
          title="${_.flag} ${Y(_.academyVi)} — ${Y(_.tierLabels[W.tier])}"
        >
          <span class="sq-lang-flag">${_.flag}</span>
          <span class="sq-lang-text">
            <strong>${Y(_.nameVi)}</strong>
            <small>${Y(V)} • Lv.${W.masteryScore}</small>
          </span>
        </button>
      `}).join(""),N=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(I=>{const _=a.tier===I.id;return`
          <button
            type="button"
            class="sq-tier-btn ${_?"active":""}"
            data-sq-tier="${I.id}"
            aria-pressed="${_}"
          >
            <span>${I.icon} ${Y(i.tierLabels[I.id])}</span>
            <small>${I.rewardTag}</small>
          </button>
        `}).join(""),D=ms.map(I=>{const _=zs[I],W=s.preferredFormat===I;return`
        <button
          type="button"
          class="sq-format-chip ${W?"active":""}"
          data-sq-format="${I}"
          aria-pressed="${W}"
        >
          ${_.icon} ${Y(_.labelVi)}
        </button>
      `}).join(""),K=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-root">
        ${L}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${A}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${c.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${Y(r.name)}">
                🌱 ${Y(r.name)}: <strong>×${l}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${h}/8 câu)">
                🔥 <strong>${k}</strong> <small>(${h}/8)</small>
              </span>
              ${(()=>{const I=Date.now(),_=this.sim.getActiveConstructions(I);if(_.length===0)return"";const W=_[0],B=ie(W.itemId),V=Math.max(1,Math.ceil((W.constructEndsAt-I)/1e3)),le=this.sim.getBuildingMinFloorSec(W),te=V<=le;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${Y(B?.name??"Đang xây")}: <strong>${xe(V)}</strong> <small>${te?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${O}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${xt(r.id)}" alt="${Y(r.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${Y(r.name)}</h3>
                <p>⏱️ <strong>${xe(r.growSec)}</strong> • 🌾 <strong>+${r.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${n}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${d.toLocaleString("vi-VN")}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${p?"":"disabled"}
              >
                🪙 +1 Hạt (-${d.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${m?"":"disabled"}
              >
                🪙 +3 Hạt (-${u.toLocaleString("vi-VN")}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${l>0?"has-seeds":"empty-seeds"}">
              <div class="sq-pocket-status">
                🌱 <strong>${Y(r.name)}</strong>: <strong>×${l}</strong>
              </div>
              <button
                id="btnSqSowNow"
                type="button"
                class="brass-btn sq-sow-cta"
                ${l>0?"":"disabled"}
              >
                🌱 Gieo (×${l})
              </button>
            </div>
          </aside>

          <!-- OPTION 2: MULTI-LANGUAGE ADAPTIVE QUIZ -->
          <section class="sq-option-card sq-option-quiz">
            <div class="sq-quiz-top-header">
              <span class="sq-option-ribbon sq-ribbon-quiz">🪄 ĐỐ NHẬN HẠT (0G • +1–2 🌱)</span>
              <label class="sq-autospeak-toggle" title="Tự động phát âm bản xứ">
                <input id="chkSqAutoSpeak" type="checkbox" ${s.autoSpeak?"checked":""} />
                <span>🔊 Tự đọc</span>
              </label>
            </div>

            <!-- 5 LANGUAGE TABS -->
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${z}</div>

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
                📖 Từ Điển (${y.masteredCount}/${T.lexiconCount})
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(o,a):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${N}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${a.masteryScore}/100 (Quyển ${b}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${i.flag} <strong>Lv.${a.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${a.totalCorrect}/${a.totalAnswered}</strong> (${g}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4,a.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${a.streak}</strong></span>
                        <button
                          type="button"
                          class="sq-stat-pill sq-stat-pill-btn ${y.dueCount>0?"has-review":""}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${y.masteredCount}</strong> • 🔄 <strong>${y.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${D}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${K}
                `}
          </section>
        </div>
      </div>
    `,this.bindRenderedEvents(t)}getLexiconEntrySrsInfo(t,s){const o=t.srsBoxes??{};let i=0,a=!1;for(const r of["vocab:","pairs:","cloze:","bubble:","tiles:"]){const l=o[`${r}${s}`];l&&(l.box>i&&(i=l.box),l.box<5&&l.dueAtTurn<=t.totalAnswered&&(a=!0))}return{box:i,due:a}}getLanguageLexiconEntries(t){return ts.filter(s=>s.lang===t).sort((s,o)=>s.levelBand-o.levelBand||s.id.localeCompare(o.id))}renderLexiconCodexPanel(t,s){const o=pt[t],i=this.getLanguageLexiconEntries(t);let a=0,r=0,l=0;for(const c of i){const{box:d}=this.getLexiconEntrySrsInfo(s,c.id);d>=5?a+=1:d>=1?r+=1:l+=1}const n=[{id:"all",label:`📖 Tất cả (${i.length})`},{id:"mastered",label:`🏆 Thuộc (${a})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(c=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===c.id?"active":""}"
            data-sq-codex-filter="${c.id}"
            aria-pressed="${this.codexBoxFilter===c.id}"
          >${c.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${o.flag} ${Y(o.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${es(t)?`✅ ${i.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${Y(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${n}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,s,i)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,s,o){const i=o??this.getLanguageLexiconEntries(t),a=this.codexQuery.trim().toLowerCase(),r=i.filter(n=>{const{box:c}=this.getLexiconEntrySrsInfo(s,n.id);return this.codexBoxFilter==="mastered"&&c<5||this.codexBoxFilter==="learning"&&(c<1||c>=5)||this.codexBoxFilter==="unseen"&&c>0?!1:a?n.word.toLowerCase().includes(a)||n.phonetic.toLowerCase().includes(a)||n.meaningVi.toLowerCase().includes(a)||n.exampleSentence.toLowerCase().includes(a)||n.exampleVi.toLowerCase().includes(a):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(n=>{const{box:c,due:d}=this.getLexiconEntrySrsInfo(s,n.id),u=js(n.meaningVi,n.word,n.id);let p="is-unseen",m=`✨ Quyển ${n.levelBand}`;return c>=5?(p="is-box5",m="🏆 Hộp 5/5 • Thuộc"):c>=1&&(p=d?"is-due":"is-learning",m=`📦 Hộp ${c}/5${d?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${u.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${Y(n.id)}"
                title="Nghe phát âm từ ${Y(n.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${Y(n.word)}</strong>
                <span class="sq-vocab-ph">[${Y(n.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${Y(u.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${p}">${m}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${i.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,s){t.querySelectorAll("[data-sq-codex-word]").forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.sqCodexWord??"",a=ts.find(r=>r.id===i);a&&Le(a.word,s,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.sqCodexEx??"",a=ts.find(r=>r.id===i);a&&Le(a.exampleSentence,s,.95)})})}renderChallengeStage(t){const s=pt[t.lang],o=zs[t.format],i=Se[this.targetCropId],a=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",n=t.heroWord??t.stemText,c=t.heroPhonetic??t.stemPhonetic??"",d=t.heroShortVi??as(t.translationVi);let u="";r==="pic_flashcard"?u=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${Y(n)}</div>
            ${c?`<div class="sq-kid-ph-pill">[${Y(c)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(u=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${Y(d)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${Y(d)}</div>
            ${c?`<div class="sq-kid-ph-pill">🔊 [${Y(c)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let p="";if(r==="pic_flashcard"||r==="word_flashcard"){const b=t.choices??[],g=t.choicePhonetics??[],y=t.choiceSprites??[],T=t.choiceSubtitles??[];p=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${b.map((k,h)=>{let L="";a&&(h===t.correctIndex?L="is-correct":h===this.selectedChoiceIdx?L="is-wrong":L="is-dimmed");const x=y[h]??l,C=T[h]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${L}"
                  data-sq-choice="${h}"
                  ${a?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${x}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${Y(k)}</span>
                    ${r==="word_flashcard"&&g[h]?`<small class="sq-choice-ph">[${Y(g[h])}]</small>`:a&&C?`<small class="sq-choice-ph">${Y(C)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const b=t.choices??[],g=t.choicePhonetics??[],y=t.choiceSprites??[];p=`
        <div class="sq-bubble-arena">
          ${b.map((T,k)=>{let h="";a&&(k===t.correctIndex?h="is-correct is-popped":k===this.selectedChoiceIdx?h="is-wrong is-popped":h="is-dimmed");const L=y[k]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${k%4} ${h}"
                  data-sq-choice="${k}"
                  ${a?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${L}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${Y(T)}</span>
                  ${g[k]?`<small class="sq-bubble-ph">[${Y(g[k])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const b=t.shuffledTokens??[],g=t.expectedSentenceTokens??[],y=new Set(this.placedTokenIndices),T=g.map((h,L)=>{const x=this.placedTokenIndices[L],C=x!==void 0?b.find($=>$.idx===x):void 0;return C?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${L}"
                ${a?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${Y(C.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),k=b.map(h=>{const L=y.has(h.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${L?"used":""}"
              data-sq-place="${h.idx}"
              ${L||a?"disabled":""}
            >
              ${Y(h.text)}
            </button>
          `}).join("");p=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${T}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${k}</div>
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
      `}else if(t.format==="match_pairs"){const b=t.leftCards??[],g=t.rightCards??[];p=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${s.flag} 🔊 Thẻ Từ</div>
            ${b.map(y=>{const T=this.matchedPairIds.has(y.pairId),k=this.selectedLeftPairId===y.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${T?"matched":""} ${k?"selected":""}"
                    data-sq-left-pair="${Y(y.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${Y(y.word)}</span>
                    <small class="sq-pair-ph">[${Y(y.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${g.map(y=>{const T=this.matchedPairIds.has(y.pairId),k=this.flashWrongPairKey===y.pairId,h=y.spriteSrc??js(y.meaningVi,y.word,y.pairId).spriteSrc,L=y.shortVi??as(y.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${T?"matched":""} ${k?"wrong-flash":""}"
                    data-sq-right-pair="${Y(y.pairId)}"
                    ${T||a?"disabled":""}
                  >
                    <img src="${h}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${Y(L)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const m=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${o.icon} ${Y(o.labelVi)}</span>
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
        ${m}
      </div>
    `}renderVietnameseExplanationCard(t,s){const o=this.sim.getSeedCount(this.targetCropId),i=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",a=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??as(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${s.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${i}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${s.correct?`🎉 <strong>Giỏi lắm!</strong> +${s.seedsAwarded} 🌱 ${Y(s.cropName)} • +${s.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${s.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${Y(a)}</strong>
              <span class="sq-vocab-ph">[${Y(r)}]</span>
              <span>= 🇻🇳 <strong>${Y(l)}</strong></span>
            </div>
            ${s.buildReduction&&s.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${xe(s.buildReduction.reducedSec)} (${Y(s.buildReduction.targetName??"công trình")})</div>`:""}
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
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCropFilter;(l==="all"||l==="flowers"||l==="crops")&&(this.cropFilter=l,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCrop;l&&Se[l]&&(this.targetCropId=l,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const r=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(r.msg,r.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const r=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(r.msg,r.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const s=t.querySelector("#chkSqAutoSpeak");s?.addEventListener("change",()=>{const r=this.sim.ensureLanguageQuiz();r.autoSpeak=s.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqLang,n=this.sim.ensureLanguageQuiz();l&&gs.includes(l)&&n.activeLang!==l&&(this.challenge&&!this.answeredOutcome&&mt(n,this.challenge),n.activeLang=l,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(l,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-subview]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqSubview;if((l==="practice"||l==="codex")&&this.activeSubView!==l){if(this.activeSubView=l,l==="codex"){const n=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(n.activeLang)}this.render()}})});const o=t.querySelector("#inpSqCodexSearch");o&&o.addEventListener("input",()=>{this.codexQuery=o.value;const r=t.querySelector("#sqCodexResultsMount");if(r){const l=this.sim.ensureLanguageQuiz(),n=l.activeLang;r.innerHTML=this.renderLexiconCodexRowsHtml(n,l.profiles[n]),this.bindCodexRowSpeakEvents(r,n)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCodexFilter;(l==="all"||l==="mastered"||l==="learning"||l==="unseen")&&(this.codexBoxFilter=l,this.render())})});const i=t.querySelector("#sqCodexResultsMount");if(i){const r=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(i,r.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqTier,n=this.sim.ensureLanguageQuiz();(l==="beginner"||l==="intermediate"||l==="advanced")&&(this.challenge&&!this.answeredOutcome&&mt(n,this.challenge),_s(n,n.activeLang,l),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqFormat,n=this.sim.ensureLanguageQuiz();ms.includes(l)&&n.preferredFormat!==l&&(this.challenge&&!this.answeredOutcome&&mt(n,this.challenge),n.preferredFormat=l,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const r=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(r,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const r=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Le(r,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Le(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge)return;const l=Number(r.dataset.sqSpeakWord??-1),n=this.challenge.vocabNotes[l];n&&Le(n.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const r=this.sim.ensureLanguageQuiz();mt(r,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqChoice??-1);this.selectedChoiceIdx=l;const n=l===(this.challenge.correctIndex??0);n?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(n)})});const a=()=>{if(!this.challenge||this.answeredOutcome)return!1;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<r.length)return!1;const n=this.placedTokenIndices.map(d=>l.find(u=>u.idx===d)?.text??""),c=n.length===r.length&&n.every((d,u)=>d===r[u]);return c?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(c),!0};t.querySelectorAll("[data-sq-place]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqPlace??-1);if(l>=0&&!this.placedTokenIndices.includes(l)){this.placedTokenIndices.push(l),this.sim.audio.playMatchPop(1);const n=this.challenge.shuffledTokens?.find(d=>d.idx===l),c=this.sim.ensureLanguageQuiz();n&&c.autoSpeak&&Le(n.text,this.challenge.lang,.95),a()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqUnplace??-1);l>=0&&l<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(l,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const c=this.placedTokenIndices.length-1;if(l.find(u=>u.idx===this.placedTokenIndices[c])?.text===r[c])break;this.placedTokenIndices.pop()}const n=this.placedTokenIndices.length;if(n<r.length){const c=r[n],d=l.find(u=>u.text===c&&!this.placedTokenIndices.includes(u.idx));d&&(this.placedTokenIndices.push(d.idx),this.sim.audio.playMatchPop(1),a()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[],n=this.placedTokenIndices.map(d=>l.find(u=>u.idx===d)?.text??""),c=n.length===r.length&&n.every((d,u)=>d===r[u]);this.submitAttempt(c)}),t.querySelectorAll("[data-sq-left-pair]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=r.dataset.sqLeftPair??"";if(!l||this.matchedPairIds.has(l))return;this.selectedLeftPairId=l,this.flashWrongPairKey=null,this.sim.audio.playClick();const n=this.challenge.leftCards?.find(d=>d.pairId===l),c=this.sim.ensureLanguageQuiz();n&&c.autoSpeak&&Le(n.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=r.dataset.sqRightPair??"";if(!(!l||this.matchedPairIds.has(l))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===l){this.matchedPairIds.add(l),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const n=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=n){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=l,this.sim.audio.playClick(),this.render()}})})}}function S(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ot=["path","shop","creature","decor","staff"],wt=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function Sa(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function wa(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},s=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.switchMinigame;e.closeHudPopovers(),!m||m==="match3"?e.openMatch3Dialog():m==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(m)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",s),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",s),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",s),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",s),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",s);const o=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",o),e.root.querySelector("#btnPlusSand")?.addEventListener("click",o),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const i=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",i),e.root.querySelector("#chipHudBarn")?.addEventListener("click",i),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=window.innerWidth>680;const m=e.selectedCatalogItem?.category;e.activeCategory=m&&Ot.includes(m)?m:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const m=p[0],b=ie(m.itemId);ue(e.cam,m.gx+(b?.width??1)*.5,m.gy+(b?.height??1)*.5),e.inspectSelection={kind:"building",uid:m.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const a=e.root.querySelector("#btnHudRoundOrb");if(a){let p=null,m=0,b=0,g=0,y=0,T=!1;a.addEventListener("pointerdown",h=>{if(h.button!==0&&h.pointerType==="mouse")return;const L=a.getBoundingClientRect();p=h.pointerId,m=h.clientX,b=h.clientY,g=L.left,y=L.top,T=!1;try{a.setPointerCapture(h.pointerId)}catch{}}),a.addEventListener("pointermove",h=>{if(p!==h.pointerId)return;const L=h.clientX-m,x=h.clientY-b;if(!T&&Math.hypot(L,x)>7&&(T=!0),T){const C=a.offsetWidth||52,$=a.offsetHeight||62,M=Math.max(6,Math.min(window.innerWidth-C-6,g+L)),A=Math.max(6,Math.min(window.innerHeight-$-6,y+x));a.style.left=`${Math.round(M)}px`,a.style.top=`${Math.round(A)}px`,a.style.right="auto",a.style.bottom="auto"}});const k=h=>{if(p===h.pointerId){p=null;try{a.hasPointerCapture(h.pointerId)&&a.releasePointerCapture(h.pointerId)}catch{}}};a.addEventListener("pointerup",k),a.addEventListener("pointercancel",k),a.addEventListener("click",h=>{if(T){h.preventDefault(),h.stopPropagation(),T=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()});const r=p=>{const m=e.root.querySelector("#buildDrawer");if(!m)return;const b=Math.max(180,Math.round(m.clientWidth*.68))*p,g=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;m.scrollBy({left:b,behavior:g?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{r(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{r(1)}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const m=p.target;if(!m)return;const b=e.root.querySelector("#managePopoverMenu"),g=e.root.querySelector("#weatherPopoverMenu"),y=e.root.querySelector("#btnToggleManageMenu"),T=e.root.querySelector("#lblClock");b?.contains(m)||g?.contains(m)||y?.contains(m)||T?.contains(m)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const l=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",l);const n=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",n),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",n),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const c=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",c),e.root.querySelector("#btnOpenZones")?.addEventListener("click",c),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",c),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=wt.findIndex(y=>y.mode===e.sim.heatmapMode),m=wt[(p+1)%wt.length];e.sim.heatmapMode=m.mode;const b=e.root.querySelector("#btnCycleHeatmap"),g=m.mode!=="none";b.textContent=m.label,b.setAttribute("data-active",String(g)),b.setAttribute("aria-pressed",String(g)),g&&e.showToast(`Đã bật ${m.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),m=document.createElement("a");m.href=p,m.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,m.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const b=p.currentTarget;b.textContent=e.questCollapsed?"+":"–",b.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const m=p.currentTarget;m.textContent=e.minimapCollapsed?"+":"–",m.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(ft(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${vt[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=Ot.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const d=p=>{const m=e.minimapCanvas.getBoundingClientRect(),b=(p.clientX-m.left)/m.width*e.minimapCanvas.width,g=(p.clientY-m.top)/m.height*e.minimapCanvas.height,y=e.minimapCanvas.width*.46/Et,T=e.minimapCanvas.height*.44/Et,k=(b-e.minimapCanvas.width*.5)/y,h=(g-8)/T,L=(k+h)*.5,x=(h-k)*.5,{fgx:C,fgy:$}=Si(L,x,e.cam.viewRot??0),M=Math.max(0,Math.min(Et-1,C)),A=Math.max(0,Math.min(Et-1,$));e.rideCamUid=null,ue(e.cam,M,A)};let u=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{u=!0,d(p)}),window.addEventListener("pointermove",p=>{u&&d(p)}),window.addEventListener("pointerup",()=>{u=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.cat;Ot.includes(m)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===m?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=m,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{ft(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${vt[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(m=>m.itemId==="burrow_house_canon");p?ue(e.cam,p.gx+1.5,p.gy+1.5):ue(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")ft(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${vt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")ft(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${vt[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const m=e.sim.staff[0];m&&(e.pincerPicked={kind:"staff",id:m.id,label:m.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,ue(e.cam,16,18),e.refreshFloatingBanner())})}function xa(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const s=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!s),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),qs(e),Ps(e),Xt(e),e.renderTutorialCoach()}function An(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function $a(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(Je(e),et(e),e.closeSeedTray(),e.closePastureTray()),Xt(e)}function Xt(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const s=An(e),o=e.hudRolledUp&&!e.photoModeActive&&!s;t.classList.toggle("hud-building-focus",s),t.classList.toggle("hud-compact-rolled",o);const i=e.root.querySelector("#btnToggleHudRollup");i&&(i.setAttribute("aria-pressed",String(e.hudRolledUp)),i.dataset.active=String(e.hudRolledUp),i.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const a=e.root.querySelector("#svgHudRollupChevron");a&&a.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const l=e.root.querySelector("#btnHudRoundOrb");l&&(l.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||s),l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.rolled=String(e.hudRolledUp));const n=e.root.querySelector("#lblHudRoundOrbTag");n&&(n.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const c=e.root.querySelector("#svgRoundOrbChevron");c&&c.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),s&&(Je(e),et(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function Je(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const s=e.root.querySelector("#managePopoverMenu"),o=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");s?.classList.add("hidden"),o?.classList.add("hidden"),i&&(i.setAttribute("aria-expanded","false"),i.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function et(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function Ta(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function ka(e){et(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function As(e,t,s){if(!t||!s)return;const o=t.getBoundingClientRect(),i=Math.min(window.innerWidth-16,Math.max(248,s.offsetWidth||336)),a=Math.min(s.offsetHeight||420,window.innerHeight-16),r=o.left<window.innerWidth*.5?o.left:o.right-i,l=Math.max(8,Math.min(r,window.innerWidth-i-8)),n=Math.max(8,Math.min(o.bottom+8,window.innerHeight-a-8));s.style.left=`${Math.round(l)}px`,s.style.top=`${Math.round(n)}px`}function Ca(e,t){if(e.sim.isVisitingNeighbor){Je(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const s=typeof t=="boolean"?t:!e.manageMenuOpen;if(Je(e),!s)return;e.manageMenuOpen=!0;const o=e.root.querySelector("#managePopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu");o&&i&&(o.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),i.setAttribute("data-active","true"),As(e,i,o)),e.renderTutorialCoach()}function Ma(e,t){const s=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(Je(e),!s)return;e.weatherPopoverOpen=!0;const o=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#lblClock");o&&i&&(Es(e),o.classList.remove("hidden"),i.setAttribute("aria-expanded","true"),As(e,i,o)),e.renderTutorialCoach()}function Es(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const s=Date.now(),o=e.sim.getCurrentWeather(s),i=e.sim.getWeatherForecast(4,s),a=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${a?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${o.icon} ${S(o.labelVi)}</div>
        <div class="weather-current-buff">✨ ${S(o.buffVi)}</div>
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
        ${i.map((r,l)=>{const n=l===0?"Nay":`+${Pe(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${S(r.labelVi)}</span>
                <span class="weather-slot-meta">${S(n)}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelectorAll("[data-sim-speed]").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation();const n=r.dataset.simSpeed==="2"?2:1;e.sim.simSpeed=n,Wt(e),Je(e),Ue(e,n===2?"⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!":"🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.",n===2?"⚡":"🌿")})})}function En(e,t){const s=e.root.querySelector("#lblGalleons");if(!s)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),s.textContent="∞",e.displayedGalleons=t;return}const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||o||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,s.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const i=e.displayedGalleons,a=performance.now(),r=420,l=n=>{const c=Math.min(1,(n-a)/r),d=1-Math.pow(1-c,3),u=Math.round(i+(t-i)*d);e.displayedGalleons=u,s.textContent=u.toLocaleString("vi-VN"),c<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function La(e,t,s,o,i){const a=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!a||!r)return;const l=()=>{a.classList.remove("hud-chip-pulse"),a.offsetWidth,a.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const n=a.getBoundingClientRect();if(n.width<=0&&n.height<=0)return;const c=n.left+n.width*.5,d=n.top+n.height*.5,u=typeof o=="number"&&Number.isFinite(o)?Math.max(24,Math.min(window.innerWidth-24,o)):window.innerWidth*.5,p=typeof i=="number"&&Number.isFinite(i)?Math.max(24,Math.min(window.innerHeight-24,i)):window.innerHeight*.54,m={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},b=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(s))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,s)))));for(let g=0;g<b;g++){const y=document.createElement("div");y.className="fly-reward-token",y.dataset.kind=t,y.textContent=m[t],r.appendChild(y);const T=g/Math.max(1,b)*Math.PI*2+(Math.random()-.5)*.5,k=14+g%3*9,h=u+Math.cos(T)*k,L=p+Math.sin(T)*k*.7,x=(h+c)*.5+(g%2===0?-42:42),C=Math.min(L,d)-(48+g%3*18),$=560+g*48,M=g*52,A=y.animate([{transform:`translate3d(${h}px, ${L}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${h}px, ${L-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${x}px, ${C}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${c}px, ${d}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:$,delay:M,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});A.onfinish=()=>{y.remove(),l(),e.sim.audio.playFlyTick(g)}}}function Aa(e,t="🦉"){const s=e.trim();if(!s)return t.trim();const o=t.trim();if(!o)return s;const i=l=>l.replace(/\uFE0F/g,""),a=i(o);let r=s;for(;a&&i(r).startsWith(`${a} ${a}`);)r=r.slice(o.length).trimStart();return a&&i(r).startsWith(a)||o==="🦉"&&new RegExp("^\\p{Extended_Pictographic}","u").test(r)?r:`${o} ${r}`}function Ue(e,t,s="🦉"){const o=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!o)return;const i=Array.from(e.root.querySelectorAll("dialog[open]")),a=i.length>0?i[i.length-1]:null;a?o.parentElement!==a&&(a.appendChild(o),a.addEventListener("close",()=>{const l=Array.from(e.root.querySelectorAll("dialog[open]")),n=l.length>0?l[l.length-1]:e.root;o.parentElement!==n&&n.appendChild(o)},{once:!0})):o.parentElement!==e.root&&e.root.appendChild(o);const r=document.createElement("div");r.className="parchment-dark owl-toast",r.textContent=Aa(t,s),o.appendChild(r),window.setTimeout(()=>r.remove(),3500)}function Ea(e,t){const s=Math.max(1,Math.round(t.awaySeconds/60)),o=e.root.querySelector("#offlineDialogContent");o.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${s} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function qs(e){const t=e.root.querySelector("#floatingModeBanner"),s=e.root.querySelector("#floatingBannerText"),o=e.root.querySelector("#btnFloatingSecondary"),i=e.root.querySelector("#btnFloatingSwap"),a=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!s||!o||!i||!a)){if(i.classList.add("hidden"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const r=e.sim.state.buildings.find(n=>n.uid===e.rideCamUid),l=r?ie(r.itemId):void 0;if(!r||!l)e.rideCamUid=null;else{t.classList.remove("hidden"),s.textContent=`🎥 ${l.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,o.textContent="🧭 90°",o.classList.remove("hidden"),a.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),s.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Nhấp ô để thả`:"🤏 Điều phối nhân sự (G) — Nhấp ô cử tới • G/Esc thoát",o.classList.add("hidden"),a.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const r=e.sim.state.buildings.find(n=>n.uid===e.movingBuildingUid),l=r?ie(r.itemId):void 0;s.textContent=`✋ ${l?.name??"Dời chỗ"}`,o.textContent=`🔄 ${e.rotation*90}°`,o.classList.remove("hidden"),a.textContent="✕"}else s.textContent="✋ Chọn công trình để dời",o.classList.add("hidden"),a.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),s.textContent="🧹 Phá dỡ",o.classList.add("hidden"),a.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const r=e.selectedCatalogItem,l=r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence,n=e.sim.getEffectiveItemStarCost(r),c=n>0?`🌟 ${n}`:r.cost===0?"0G":`${r.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),s.textContent=`🏗️ ${r.name} • ${c}`,l?(o.textContent=`🔄 ${e.rotation*90}°`,o.classList.remove("hidden")):o.classList.add("hidden"),i.textContent="📦 Đổi",i.classList.remove("hidden"),a.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const r=Se[e.activeSeedCropId],l=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),s.textContent=`🌱 ${r.emoji} ${r.name} (${l})`,o.textContent="🌱 Đổi",o.classList.remove("hidden"),a.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const r=Ze[e.activePastureAnimalId];t.classList.remove("hidden"),s.textContent=`🐾 ${r.emoji} ${r.name} (${r.cost.toLocaleString("vi-VN")}G)`,o.textContent="🐾 Đổi",o.classList.remove("hidden"),a.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),s.textContent="👁️ Nhìn xuyên",o.classList.add("hidden"),a.textContent="✕";return}t.classList.add("hidden")}}function Ps(e){const t=e.root.querySelector("#touchConfirmBar"),s=e.root.querySelector("#lblTouchConfirm");if(!(!t||!s)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),s.textContent=`📍 ${e.pendingTouchTile.label}`}}function jt(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),qn(e),Hn(e),In(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),qs(e),Ps(e),Xt(e),e.renderTutorialCoach()}function Wt(e){const t=new Date,s=String(t.getHours()).padStart(2,"0"),o=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const i=e.sim.getCurrentWeather(t.getTime()),a=e.root.querySelector("#lblClock");if(a){const p=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";a.innerHTML=`${i.icon} <span>${s}:${o}</span>${p}`}e.weatherPopoverOpen&&Es(e);const r=e.sim.getActiveFestival(t),l=e.root.querySelector("#lblFestival");l&&(r==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):r==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(l.classList.remove("hidden"),l.textContent="🏆 +Cúp"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const n=e.sim.state,c=e.root.querySelector("#lblPuzzleHearts");if(c&&n.match3)if(n.sandboxMode)c.textContent="∞";else if(n.match3.hearts>=Vt)c.textContent=`${n.match3.hearts}/${Vt}`;else{const p=Math.max(0,Math.ceil((n.match3.nextHeartAt-Date.now())/1e3)),m=Math.floor(p/60),b=String(p%60).padStart(2,"0");c.textContent=`${n.match3.hearts} (${m}:${b})`}const d=e.root.querySelector("#btnHudActiveBuilds"),u=e.root.querySelector("#lblActiveBuilds");if(d&&u){const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)d.classList.add("hidden");else{d.classList.remove("hidden");const m=Math.max(1,Math.ceil((p[0].constructEndsAt-Date.now())/1e3));u.textContent=`${p.length} (${Pe(m)})`}}}function qn(e){const t=e.sim.state,s=e.sim.getRequiredLevelTrial(),o=Math.max(0,t.xp)%bt,i=Math.max(6,Math.min(100,o/bt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+cn(t.level),e.root.querySelector("#barXpFill").style.width=`${i}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const U=e.sim.getActiveVisitingNeighbor();r.textContent=U?`🚂 Thăm: ${U.avatarEmoji} ${U.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),n=e.sim.getTotalTowerClearedStages(),c=t.level>=Ve?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),d=e.root.querySelector("#btnOpenRoadmap");d&&(d.style.setProperty("--hg-lvl-pct",String(c)),d.title=t.level>=Ve?`👑 Cấp Tối Đa ${Ve} • Rương XP: ${o}/${bt} • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${o}/${bt}`);const u=e.root.querySelector("#barLevelTopFill");u&&(u.style.width=`${c}%`,u.parentElement&&(u.parentElement.title=t.level>=Ve?`👑 Đã đạt Cấp Tối Đa ${Ve} • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`));const p=e.root.querySelector("#lblXpFraction");p&&(p.textContent=`🎁 ${o}/${bt}`);const m=e.sim.ensureFarmBarn(),b=e.sim.getBarnTotalUsed(),g=e.root.querySelector("#lblStorageBarn");g&&(g.textContent=`${b}/${m.capacity}`),En(e,t.galleons);const y=t.sandboxMode?"∞":String(t.match3?.stars??0),T=e.root.querySelector("#lblPuzzleStars");T&&t.match3&&(T.textContent=y);const k=e.root.querySelector("#lblHudHubStars");k&&(k.textContent=y);const h=e.root.querySelector("#lblHudHubTrial");h&&(t.level>=Ve||t.sandboxMode||e.sim.isHeadmasterPreview||!s?h.textContent=`♟️ ${n.cleared}/${n.total}`:h.textContent=`🔥 ${s.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const L=e.sim.getDisciplineStageInfo("match3"),x=e.sim.getLastPlayedMinigame();let C="🍬 Bùa Gặt",$="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",M=L.isMaxed?`👑 ${Re}`:`Màn ${L.currentStage}`;if(x==="caro"){const U=e.sim.getDisciplineStageInfo("caro");C="🗺️ Ngũ Ấn",$="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(x==="sudoku"){const U=e.sim.getDisciplineStageInfo("sudoku");C="🔢 Số Học",$="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",M=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(x==="blocks"){const U=e.sim.getDisciplineStageInfo("blocks");C="🦄 Sinh Vật",$="/trang-trai-hang-soc/sprites/beast_niffler.png",M=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(x==="chess"){const U=e.sim.getDisciplineStageInfo("chess");C="🏰 Cờ Phù Thủy",$="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",M=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else x==="seedquiz"&&(C="🪄 Thần Chú",$="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",M="Ôn Tập");const A=e.root.querySelector("#imgCornerPlayIcon");A&&A.getAttribute("src")!==$&&A.setAttribute("src",$);const O=e.root.querySelector("#badgeCornerPlayBonus");O&&(O.textContent=C,O.classList.remove("hidden"));const z=e.root.querySelector("#lblCornerPlayStage");z&&(z.textContent=M);const E=e.root.querySelector("#lblCornerPlaySub");E&&(E.textContent=t.level>=Ve?`👑 Cấp ${Ve}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const N=e.root.querySelector("#btnCornerPlayPuzzle");if(N){const U=`Chơi tiếp ${C} — ${M}`;N.title=U,N.setAttribute("aria-label",U)}e.root.querySelectorAll("[data-switch-minigame]").forEach(U=>{const ve=U.dataset.switchMinigame===x;U.dataset.active=String(ve),U.setAttribute("aria-pressed",String(ve))});const D=e.root.querySelector("#badgeBuildReadyCount");if(D){const U=new Set(t.buildings.map(Ce=>Ce.itemId)),ve=t.sandboxMode?999:t.match3?.stars??0,we=dn.filter(Ce=>{if(Ce.isThemeParkLegacy)return!1;const We=ii(Ce);return We<=0||!t.sandboxMode&&t.level<Ce.unlockLevel?!1:!U.has(Ce.id)&&ve>=We}).length;we>0&&!e.sim.isHeadmasterPreview?(D.textContent=String(we),D.classList.remove("hidden")):D.classList.add("hidden")}const K=e.root.querySelector("#lblMatch3Lv");K&&t.match3&&(K.textContent=L.isMaxed?`👑${Re}`:`${L.currentStage}/${Re}`);const I=e.root.querySelector("#lblArcadeTowerLv");if(I){const U=Math.max(0,n.cleared-L.clearedStages),ve=Re*4;I.textContent=U>=ve?`👑${ve}`:`${U}/${ve}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const _=e.sim.getActiveStoryQuest(),W=e.sim.getReadyOwlOrdersCount(),B=(_?.completed?1:0)+t.owlQuests.filter(U=>U.completed&&!U.claimed).length+t.dailyQuests.filter(U=>U.completed&&!U.claimed).length,V=W+B,le=V>0?V:m.owlOrders.length,te=e.root.querySelector("#badgeQuestCount");le>0?(te.textContent=String(le),te.classList.toggle("is-ready-green",W>0),te.classList.remove("hidden")):te.classList.add("hidden");const oe=t.supply.cargoCrates.filter(U=>!U.fulfilled&&(t.sandboxMode||(t.supply.goods[U.goodId]??0)>=U.qtyRequired)).length,re=e.root.querySelector("#badgeWorkshopCount");re&&(oe>0?(re.textContent=String(oe),re.classList.remove("hidden")):re.classList.add("hidden"));const ce=Object.values(t.housePoints).reduce((U,ve)=>U+ve,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!ce),e.refreshSuitcaseBadge();const ge=e.root.querySelector("#badgeSuitcaseCount"),ee=ge&&!ge.classList.contains("hidden")?Math.max(0,Number.parseInt(ge.textContent||"0",10)||0):0,je=e.sim.getClaimableHarvestFeastCount(),ae=e.root.querySelector("#badgeManageMenuDot");if(ae){const U=oe+(ce?1:0)+je+ee;U>0?(ae.textContent=String(U),ae.classList.remove("hidden")):ae.classList.add("hidden")}Pn(e),Wt(e);const he=e.root.querySelector("#btnCycleHeatmap");if(he){const U=wt.find(we=>we.mode===e.sim.heatmapMode)??wt[0],ve=e.sim.heatmapMode!=="none";he.textContent=U.label,he.dataset.active=String(ve),he.setAttribute("aria-pressed",String(ve))}Wt(e)}function Pn(e){const t=e.sim.state,s=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,o=t.buildings.some(a=>!!ie(a.itemId)?.isCreatureHabitat),i=(t.match3?.hearts??Vt)>=Vt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",i),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",s&&!o),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",s&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const a=e.root.querySelector("#btnToggleMinimap");a&&(a.textContent="–",a.setAttribute("aria-expanded","true"))}}function Hn(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const s=e.sim.state,o=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const i=e.sim.getActiveStoryQuest(),a=s.owlQuests.slice(0,2);let r="";if(o&&!s.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),n=e.sim.getDisciplineStageInfo(o.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${o.icon} ${S(o.shortVi)} (${n.currentStage}/${Re}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${o.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(i){const l=Math.min(100,Math.round(i.progress/Math.max(1,i.targetAmount)*100)),n=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${S(i.giverEmoji)} ${S(i.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(i.progress,i.targetAmount)}/${i.targetAmount}</span>
            ${i.completed?`<button type="button" data-claim="${S(i.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${i.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${S(n.longLabel)}">${S(n.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const l of a){const n=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${S(l.giverEmoji)} ${S(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${n}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${S(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const n=e.sim.completeStoryStepWithStar();if(n.ok){typeof n.placedGx=="number"&&typeof n.placedGy=="number"&&ue(e.cam,n.placedGx,n.placedGy);return}Ue(e,n.msg,n.reason==="missing_gold"?"🪙":"🌟"),(n.reason==="missing_stars"||n.reason==="locked_level"||n.reason==="open_match3")&&e.openTrialMinigame()})})}function In(e){const t=(g,y)=>{g&&(g.setAttribute("data-active",String(y)),g.setAttribute("aria-pressed",String(y)))};e.root.querySelectorAll("[data-cat]").forEach(g=>{t(g,g.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const s=e.root.querySelector("#btnRotateCam");if(s){const g=e.cam.viewRot??0;s.textContent=vt[g],t(s,g!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const o=e.mapToolsExpanded,i=e.root.querySelector("#secondaryMapToolsBar"),a=e.root.querySelector("#btnToggleMapTools");i&&i.classList.toggle("hidden",!o),a&&(a.setAttribute("aria-expanded",String(o)),t(a,o));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),l);const c=e.root.querySelector("#buildDrawer"),d=e.root.querySelector("#buildDrawerSwipeBar"),u=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Ot.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,c.classList.add("hidden"),d?.classList.add("hidden"),u.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(c.classList.remove("hidden"),u.classList.add("hidden"),e.activeCategory==="staff"){Bn(e,c),nn(e,c);return}const p=dn.filter(g=>g.category===e.activeCategory&&g.category!=="terrain"&&!g.isThemeParkLegacy),m=e.sim.state.level,b=e.sim.state.sandboxMode;c.innerHTML=p.map(g=>{const y=!b&&m<g.unlockLevel,T=e.selectedCatalogItem?.id===g.id,k=g.elevationDelta?g.elevationDelta>0?"⛰️":"⛏️":g.isCoasterTrackPiece?"🛤️":g.isZooFence?"🚧":g.isBench?"🪑":g.category==="path"?"🛣️":g.category==="terrain"?"🌿":"🕯️",h=g.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${g.spriteKey}.png" alt="${g.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${k}</div>`,L=e.sim.getEffectiveItemStarCost(g),x=g.buildDurationSec>0?`🔨 ${xe(g.buildDurationSec)}`:"⚡",C=y?`🔒 Cấp ${g.unlockLevel}`:L>0?`🌟 ${L} • ${x}`:`🪙 ${g.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${y?"locked":""}"
            data-item-id="${g.id}"
            data-selected="${T}"
            aria-pressed="${T}"
            ${y?'aria-disabled="true"':""}
          >
            ${h}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${S(g.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${C}</div>
          </button>
        `}).join(""),c.querySelectorAll("[data-item-id]").forEach(g=>{g.addEventListener("click",()=>{const y=ie(g.dataset.itemId);if(!y)return;if(!e.sim.state.sandboxMode&&e.sim.state.level<y.unlockLevel){const k=e.sim.getWinsProgressForCurrentLevel();let h=Math.max(1,k.required-k.current);for(let L=e.sim.state.level+1;L<y.unlockLevel;L++)h+=ai(L);Ue(e,`🔒 Bản vẽ "${y.name}" mở ở Cấp Giải Đố ${y.unlockLevel} — Cần thắng thêm ${h.toLocaleString("vi-VN")} màn Giải Đố mới!`,"🧩"),e.openTrialMinigame();return}const T=e.sim.getEffectiveItemStarCost(y);if(!e.sim.state.sandboxMode&&T>0&&e.sim.state.match3.stars<T){const k=T-e.sim.state.match3.stars;Ue(e,`Cần thêm ${k} 🌟 Sao Phép Thuật (${e.sim.state.match3.stars}/${T} 🌟) để dựng "${y.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,"🌟"),e.openTrialMinigame();return}e.selectedCatalogItem=y,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,et(e),jt(e)})}),nn(e,c)}function Bn(e,t){const s=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],o=new Set(e.sim.state.unlockedZones),i=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+Cs.filter(n=>e.sim.state.sandboxMode||o.has(n.id)).map(n=>`<option value="${n.id}" ${l===n.id?"selected":""}>📍 ${n.name}</option>`).join(""),a=s.map(l=>{const n=e.sim.state.staffHired[l.key],c=n>=Pt,d=l.baseCost*(1+n);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${n}/${Pt}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${c?"":"gold-cta"}"
              ${c?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${c?`✓ ${Pt}/${Pt}`:`+ 🪙 ${d}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(l=>{const n=e.sim.state.staffPatrolZones?.[l.id]??l.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${S(l.name)}</div>
            <select data-patrol-staff="${S(l.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${i(n)}
            </select>
            <button type="button" data-pick-staff="${S(l.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=a+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const n=l.dataset.hire;e.sim.hireStaff(n)&&(et(e),jt(e),Ue(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const n=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(n,l.value),Ue(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const n=e.sim.staff.find(c=>c.id===l.dataset.pickStaff);n&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:n.id,label:n.name},et(e),jt(e),Ue(e,`Đang gắp ${n.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}const qa={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏭 Xưởng & Cửa Tiệm",creature:"🦄 Đồng Cỏ & Thú Phép",decor:"🌸 Vườn Hoa & Cảnh Quan",staff:"🧙 Phụ Tá Điền Trang"};function nn(e,t){const s=e.root.querySelector("#buildDrawerSwipeBar"),o=e.root.querySelector("#buildDrawerCatLabel"),i=e.root.querySelector("#btnDrawerScrollPrev"),a=e.root.querySelector("#btnDrawerScrollNext"),r=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const l=Array.from(t.querySelectorAll(".catalog-card"));if(!s||l.length===0||!e.activeCategory){s?.classList.add("hidden");return}if(o){const b=qa[e.activeCategory]??"🏗️ Danh Mục Xây Dựng";o.textContent=`${b} (${l.length})`}s.classList.remove("hidden");const n=t.querySelector('.catalog-card[data-selected="true"]');n&&typeof n.scrollIntoView=="function"&&n.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const c=l[0],d=l[l.length-1];let u=!0,p=l.length<=2;const m=()=>{const b=!u||!p||t.scrollWidth>t.clientWidth+6;i&&(i.disabled=u,i.classList.toggle("hidden",!b)),a&&(a.disabled=p,a.classList.toggle("hidden",!b)),r&&r.classList.toggle("hidden",!b),t.dataset.scrollStart=String(!u),t.dataset.scrollEnd=String(!p)};if(typeof IntersectionObserver<"u"){const b=new IntersectionObserver(g=>{for(const y of g)y.target===c&&(u=y.intersectionRatio>=1),y.target===d&&(p=y.intersectionRatio>=1);m()},{root:t,threshold:1,rootMargin:"2px"});b.observe(c),d!==c&&b.observe(d),e.drawerEdgeObserver=b}m()}function Pa(e){const t=e.mapToolsExpanded,s=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");s&&s.classList.toggle("hidden",!t),o&&(o.setAttribute("aria-expanded",String(t)),o.setAttribute("data-active",String(t)),o.setAttribute("aria-pressed",String(t)))}function pe(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const s=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(s!==e.lastInspectedKey&&(e.lastInspectedKey=s,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const o=e.inspectSelection.uid,i=e.sim.state.buildings.find(E=>E.uid===o);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=ie(i.itemId),r=Date.now(),l=r<i.constructEndsAt,n=Math.max(0,Math.ceil((i.constructEndsAt-r)/1e3)),c=e.sim.getBuildingProductionPerCycle(i,a),d=wi(a,i.stars),u=(e.sim.rideQueues.get(i.uid)??[]).length,p=e.sim.isBuildingConnected(i.uid),m=e.sim.activeSynergies.buildingGoldMult.get(i.uid)??1,b=e.sim.activeSynergies.buildingXpMult.get(i.uid)??1,g=a.category==="ride"&&!a.isCoasterTrackPiece,y=!!a.isCustomCoasterStation&&!l,T={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},k=a.isCreatureHabitat?e.sim.biomeCache.get(i.uid):void 0,h=a.isBackstage?e.sim.backstageCache.get(i.uid):void 0,L=!!a.ticketPrice&&!l&&!a.workshopGroupId,x=xi(a),C=e.sim.getEffectivePrice(i,a),$=e.sim.getPriceValueVerdict(i,a),M=a.isFarmlandPlot&&!l?(()=>{if(!i.cropId){const te=Object.values(Se).sort((ae,he)=>ae.unlockLevel-he.unlockLevel||ae.growSec-he.growSec),oe=te.filter(ae=>ae.isFlowerCrop).length,re=te.length-oe,fe=te.filter(ae=>e.seedFilterMode==="flowers"?!!ae.isFlowerCrop:e.seedFilterMode==="crops"?!ae.isFlowerCrop:!0),ce=[{id:"all",label:`🌱 (${te.length})`},{id:"flowers",label:`🌸 (${oe})`},{id:"crops",label:`🌾 (${re})`}].map(ae=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===ae.id?"active":""}"
                        data-insp-seed-filter="${ae.id}"
                        aria-pressed="${e.seedFilterMode===ae.id}"
                      >${ae.label}</button>
                    `).join(""),be=fe.map(ae=>{const he=!e.sim.state.sandboxMode&&e.sim.state.level<ae.unlockLevel,U=e.sim.getSeedCount(ae.id),ve=e.sim.getFarmItemCount(ae.id),we=xe(ae.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${he?"locked":""} ${!he&&U<=0?"out-of-seeds":""}"
                        data-plant-crop="${ae.id}"
                        ${he?"disabled":""}
                      >
                        <img src="${xt(ae.id)}" alt="${S(ae.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${S(ae.name)}</span>
                        <span class="seed-card-seed-badge ${U>0?"has-seed":"no-seed"}">
                          ${he?`🔒 Lv.${ae.unlockLevel}`:U>0?`🌱 ×${U}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${he?`⏱️ ${we}`:`⏱️ ${we} • 🪙${ae.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${ve}</span>
                      </button>
                    `}).join(""),ge=e.sim.state.plotSoilState?.[`${i.gx},${i.gy}`],ee={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${ge?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${ee[ge.lastFamily]??ge.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${ce}</div>
                    <div class="seed-picker-grid">${be}</div>
                  </div>
                `}const E=Se[i.cropId],N=i.cropReadyAt??r,D=i.cropPlantedAt??N-E.growSec*1e3,K=Math.max(0,Math.ceil((N-r)/1e3)),I=K<=0,_=e.sim.state.cropMastery?.[E.id]??0,W=ci(_),B=Math.max(0,e.sim.state.morningDewPhials??0),V=E.yieldQty*(i.cropRotatedBonus?2:1),le=I?100:Math.max(6,Math.min(98,Math.round((r-D)/Math.max(1e3,N-D)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${xt(E.id)}" alt="${S(E.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${S(E.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${W.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${I?"🌾 Chín!":`⏱️ ${Pe(K)}`}${i.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${_} vụ • Họ ${oi(E.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${le}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${I?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${V})
                          </button>
                        `:i.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!I&&(B>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${B})
                          </button>`:""}
                  </div>
                </div>
              `})():"",A=a.workshopGroupId&&!l?(()=>{const E=e.sim.getWorkshopRecipesForBuilding(a),N=i.workshopQueue??[],D=i.readyFarmGoods??[],K=3+Math.min(2,Math.max(0,i.stars-1)),I=D.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${D.slice(0,5).map(te=>{const oe=it[te];return`<img src="/trang-trai-hang-soc/sprites/${oe.iconKey}.png" alt="${S(oe.name)}" title="${S(oe.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${D.length})
                      </button>
                    </div>
                  `:"",_=E.map(te=>{const oe=it[te.goodId],re=te.name??oe.name,fe=te.name&&te.name!==oe.name?`title="Ra lò thành phẩm: ${S(oe.name)}"`:"",ce=!e.sim.state.sandboxMode&&e.sim.state.level<te.unlockLevel,be=!ce&&(e.sim.state.sandboxMode||te.inputs.every(ee=>e.sim.getFarmItemCount(ee.itemId)>=ee.qty)),ge=te.inputs.map(ee=>{const je=De(ee.itemId),ae=e.sim.getFarmItemCount(ee.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||ae>=ee.qty?"ok":"lack"}">${S(je.name)} ${e.sim.state.sandboxMode?"∞":ae}/${ee.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${be?"craftable":""} ${ce?"locked":""}"
                      data-ws-enqueue="${te.id}"
                      ${fe}
                      ${ce?"disabled":""}
                    >
                      <div class="ws-recipe-name">${S(re)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${oe.iconKey}.png" alt="${S(re)}" class="ws-recipe-img" />
                        ${be?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${ce?`🔒 Lv.${te.unlockLevel}`:ge}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${xe(te.craftSec)}</div>
                    </button>
                  `}).join(""),W=N[0],B=W?Math.max(0,Math.ceil((W.endsAt-r)/1e3)):0,V=W?it[W.goodId]:null,le=Array.from({length:Math.max(1,K-1)},(te,oe)=>{const re=N[oe+1];if(re){const fe=it[re.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${S(fe.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${fe.iconKey}.png" alt="${S(fe.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return oe===N.length-(W?1:0)?`
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
                    <span>🔥 ${S(a.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${I}
                  <div class="ws-recipe-grid">${_}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${W?"baking":""}">
                      <div class="ws-oven-arch">
                        ${V?`<img src="/trang-trai-hang-soc/sprites/${V.iconKey}.png" alt="${S(V.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${W?`<strong>${Pe(B)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${W?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${le}</div>
                  </div>
                </div>
              `})():"",O=a.isAnimalPasturePlot&&!l?(()=>{if(!i.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(Ze).map(V=>{const le=!e.sim.state.sandboxMode&&e.sim.state.level<V.unlockLevel,te=V.goodId?De(V.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${le?"locked":""}"
                        data-stock-animal="${V.id}"
                        ${le?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${V.spritePair[0]}.png" alt="${S(V.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${S(V.name)}</span>
                        <span class="seed-card-seed-badge ${le?"no-seed":"has-seed"}">
                          ${le?`🔒 Lv.${V.unlockLevel}`:`🪙 ${V.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${xe(V.cycleSec)} • +${V.sellValue}G</span>
                        <span class="seed-card-stock">${te?`+${V.yieldQty} ${S(te.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const E=Ze[i.pastureAnimalId],N=i.pastureReadyAt??r,D=i.pastureStockedAt??N-E.cycleSec*1e3,K=Math.max(0,Math.ceil((N-r)/1e3)),I=K<=0,_=I?100:Math.max(6,Math.min(98,Math.round((r-D)/Math.max(1e3,N-D)*100))),W=E.goodId?De(E.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${E.spritePair[0]}.png" alt="${S(E.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${S(E.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${I?`🧺 +${E.sellValue}G${W?` +${E.yieldQty} ${S(W.name)}`:""}`:`⏱️ ${Pe(K)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${_}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${I?`
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
                    ${!I&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((a.workshopGroupId||a.isFarmlandPlot||a.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${a.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${a.spriteKey}.png" alt="${S(a.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${S(a.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(i.stars)}${"☆".repeat(5-i.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${a.isFarmlandPlot?"🌱 Ruộng":a.isAnimalPasturePlot?"🐾 Đồng cỏ":a.connectableGroup==="flower_garden"?"🌸 Vườn hoa":a.workshopGroupId?"🔥 Xưởng":`👥 ${i.visitorsServed}`}${g?` • 🎟️ ${u}/${$i}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${M}
        ${O}
        ${A}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${p?"#15803d":"#dc2626"};">
            ${p?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${m>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((m-1)*100)}%G • +${Math.round((b-1)*100)}%XP</div>`:""}
          ${a.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${$t[a.producesIngredient].emoji} ${$t[a.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const E=Math.max(0,i.buildReducedSec??0),N=Math.max(1e3,a.buildDurationSec*1e3,i.constructEndsAt-(i.placedAt||r-1e3)+E*1e3),D=Math.max(1,Math.min(99,Math.floor((1-(i.constructEndsAt-r)/N)*100))),K=e.sim.getBuildingMinFloorSec(i),I=Math.max(0,n-K),_=I<=0&&e.sim.getActiveConstructions(r).some(V=>V.uid!==i.uid&&Math.ceil((V.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(V)),W=I>0||_,B=a.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${a.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${D}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${D}" aria-label="${B}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${Pe(n)}</strong>${E>0?` • <span style="color:var(--teal-deep);">-${xe(E)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${W?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${W?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${I>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
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
              `:a.baseIncome>0?(()=>{const E=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,N=ri(i,a),D=Math.max(1,N*E),K=Math.max(0,(r-(i.lastTickAt||r))/1e3),I=Math.max(1,Math.ceil(D-K%D));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${c.galleons}🪙 +${c.xp}⭐</strong> / ${xe(N)}</div>
                      ${a.cycleSec>0&&!a.isFarmlandPlot&&!a.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${Pe(I)}</strong> • Kho: <strong>${i.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${i.storedGalleons}🪙</strong></div>`}
                      ${i.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${i.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${g&&!l&&!a.isFlooPortal?`
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
                  <span>🎟️ Giá (${x.min}–${x.max}G):</span>
                  <span id="lblBuildingPriceVal">${C}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${x.min}" max="${x.max}" value="${C}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${$.color};">
                  ${$.label}
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

        ${y?`
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
                  <strong>🐾 ${S(i.creatureNickname||a.creatureName||a.name)}</strong>
                  <span class="morph-pill ${i.creatureMorph==="radiant"?"radiant":i.creatureMorph==="mystic"?"mystic":""}">
                    ${Ne[i.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${i.creatureBondLevel??1}/${ht} • ${T[i.creatureStage??"baby"]} • 🌿 ${k?.score??50}% • 🥩 ${Math.round(i.creatureHunger??90)}%</div>
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

        ${a.isBackstage&&h&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${h.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${h.shieldCount}/${h.needed} ${h.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&i.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${i.stars+1}★ (🌟${li(i.stars)} + 🪙${d.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${i.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const z=t.querySelector("#inpBuildingPrice");z&&(e.wireRangeProgressFallback(z),z.addEventListener("input",()=>{const E=Number(z.value);e.sim.setBuildingCustomPrice(i.uid,E);const N=e.sim.getEffectivePrice(i,a),D=t.querySelector("#lblBuildingPriceVal");D&&(D.textContent=`${N} Galleon`);const K=e.sim.getPriceValueVerdict(i,a),I=t.querySelector("#lblPriceVerdict");I&&(I.textContent=K.label,I.style.color=K.color);const _=e.sim.getBuildingProductionPerCycle(i,a),W=t.querySelector("#lblBuildingProdVal");W&&(W.textContent=`+${_.galleons} 🪙 & +${_.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(i.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(i.uid,!0),pe(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(E=>{E.addEventListener("click",()=>{const N=e.sim.useMorningDewPhial(i.uid);e.showToast(N.msg,N.ok?"🧪":"⏳"),pe(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const E=i.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",E)}),t.querySelectorAll("[data-plant-crop]").forEach(E=>{E.addEventListener("click",()=>{const N=E.dataset.plantCrop,D=e.sim.plantCropOnPlot(i.uid,N);if(D.needSeedAcquire){const K=i.uid;e.activeSeedCropId=N,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(N,K);return}if(e.showToast(D.msg,D.ok?"🌱":"🪙"),D.ok){e.activeSeedCropId=N,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(E=>{E.addEventListener("click",()=>{const N=E.dataset.inspSeedFilter;(N==="all"||N==="flowers"||N==="crops")&&(e.seedFilterMode=N,pe(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(E=>{E.addEventListener("click",()=>{const N=E.dataset.stockAnimal,D=e.sim.stockAnimalOnPasture(i.uid,N);if(e.showToast(D.msg,D.ok?Ze[N]?.emoji??"🐾":"🪙"),D.ok){e.activePastureAnimalId=N,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const E=e.sim.feedAnimalPasture(i.uid);e.showToast(E.msg,E.ok?"🌾":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const E=e.sim.harvestAnimalPasture(i.uid);e.showToast(E.msg,E.ok?"🧺":"⏳"),pe(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const E=e.sim.clearAnimalFromPasture(i.uid);e.showToast(E.msg,E.ok?"🐾":"⚠️"),pe(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const E=e.sim.waterCropPlot(i.uid);e.showToast(E.msg,E.ok?"💧":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const E=e.sim.harvestCropPlot(i.uid);e.showToast(E.msg,E.ok?"🌾":"🏡"),pe(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(i.uid),pe(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(E=>{E.addEventListener("click",()=>{const N=E.dataset.wsEnqueue,D=e.sim.enqueueWorkshopRecipe(i.uid,N);e.showToast(D.msg,D.ok?"🔥":"🧺"),pe(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(i.uid),pe(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(i.uid),pe(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(i.uid),pe(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=i.uid,e.inspectSelection=null,pe(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${a.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(i.uid),pe(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",i.uid)}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const E=e.sim.upgradeBuildingStar(i.uid);e.showToast(E.msg,E.ok?"🌟":"🪙"),pe(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=i.uid,e.rotation=i.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${a.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const o=e.inspectSelection.id,i=e.sim.staff.find(l=>l.id===o);if(!i){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const a=e.sim.state.staffPatrolZones?.[i.id]??i.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${S(i.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${S(i.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${a==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${Cs.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${a===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const n=l.currentTarget.value;e.sim.setStaffPatrolZone(i.id,n),e.showToast(`Đã phân công khu tuần tra cho ${i.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:i.id,label:i.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const o=pn(e.inspectSelection.zoneId),i=un(o),a=e.sim.state.level>=o.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${S(o.name)}</div>
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
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(o.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,pe(e))})}}function Hs(e,t){t&&(e.activeWorkshopTab=t),Ee(e);const s=e.root.querySelector("#workshopDialog");s.open||s.showModal()}function Nn(e,t,s){e.collapseBuildDock(),Ct(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=s??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function rt(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function Ha(e){e.seedTrayOpen?(rt(e),e.refreshAll()):Nn(e,e.activeSeedCropId??void 0)}function Dn(e,t,s){e.collapseBuildDock(),rt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=s??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Ct(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function Ia(e){e.pastureTrayOpen?(Ct(e),e.refreshAll()):Dn(e,e.activePastureAnimalId??void 0)}function Rn(e){const t=e.root.querySelector("#seedBrushTray"),s=e.root.querySelector("#btnOpenSeedSilo");if(s){const p=e.seedTrayOpen||!!e.activeSeedCropId;s.dataset.active=String(p),s.setAttribute("aria-pressed",String(p))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(p=>ie(p.itemId)?.isFarmlandPlot&&!p.cropId&&Date.now()>=p.constructEndsAt).length,i=e.sim.state.buildings.filter(p=>ie(p.itemId)?.isFarmlandPlot).length,a=e.activeSeedCropId?Se[e.activeSeedCropId]:null,r=Object.values(Se).sort((p,m)=>p.unlockLevel-m.unlockLevel||p.growSec-m.growSec),l=r.filter(p=>p.isFlowerCrop).length,n=r.length-l,c=r.filter(p=>e.seedFilterMode==="flowers"?!!p.isFlowerCrop:e.seedFilterMode==="crops"?!p.isFlowerCrop:!0),d=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${n})`}].map(p=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===p.id?"active":""}"
            data-seed-filter="${p.id}"
            aria-pressed="${e.seedFilterMode===p.id}"
          >${p.label}</button>
        `).join(""),u=c.map(p=>{const m=!e.sim.state.sandboxMode&&e.sim.state.level<p.unlockLevel,b=e.activeSeedCropId===p.id,g=e.sim.getSeedCount(p.id),y=e.sim.getFarmItemCount(p.id),T=xe(p.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${m?"locked":""} ${b?"selected":""} ${!m&&g<=0?"out-of-seeds":""}"
              data-seed-brush="${p.id}"
              aria-pressed="${b}"
              ${m?"disabled":""}
            >
              <img src="${xt(p.id)}" alt="${S(p.name)}" class="seed-card-img" />
              <span class="seed-card-name">${S(p.name)}</span>
              <span class="seed-card-seed-badge ${g>0?"has-seed":"no-seed"}">
                ${m?`🔒 Cấp ${p.unlockLevel}`:g>0?`🌱 ${g}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${m?`⏱️ ${T}`:`⏱️ ${T} • 🪙${p.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${y}</span>
            </button>
            ${m?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${p.id}" aria-label="Nạp hạt ${S(p.name)}" title="Mua hạt ${S(p.name)} (${p.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🌱 <strong>${S(a.name)}</strong> (${e.sim.getSeedCount(a.id)})`:"🌱 Hạt Giống & Hoa"}
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${o}/${i}</strong></span>
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
    `,t.querySelectorAll("[data-seed-filter]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const b=p.dataset.seedFilter;(b==="all"||b==="flowers"||b==="crops")&&(e.seedFilterMode=b,Rn(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const b=p.dataset.acquireSeed,g=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(b,g)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const p=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),m=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,p)}),t.querySelectorAll("[data-seed-brush]").forEach(p=>{p.addEventListener("click",()=>{const m=p.dataset.seedBrush,b=Se[m],g=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(m)<=0){e.activeSeedCropId=m,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(m,g);return}if(e.activeSeedCropId=m,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,g){const y=e.sim.state.buildings.find(T=>T.uid===g);if(y&&ie(y.itemId)?.isFarmlandPlot&&!y.cropId){const T=e.sim.plantCropOnPlot(y.uid,m);if(T.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(m,y.uid);return}e.showToast(T.msg,T.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${b.emoji} ${b.name} (Túi có ${e.sim.getSeedCount(m)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,b.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const p=ie("farmland_plot");p&&(rt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const p=ie("burrow_flower_garden");p&&(rt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=p,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Hs(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{rt(e),e.refreshAll()})}function Ba(e){const t=e.root.querySelector("#pastureBrushTray"),s=e.root.querySelector("#btnOpenPastureTray");if(s){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;s.dataset.active=String(l),s.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const o=e.sim.state.buildings.filter(l=>ie(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,i=e.sim.state.buildings.filter(l=>ie(l.itemId)?.isAnimalPasturePlot).length,a=e.activePastureAnimalId?Ze[e.activePastureAnimalId]:null,r=Object.values(Ze).map(l=>{const n=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,c=e.activePastureAnimalId===l.id,d=l.goodId?De(l.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${n?"locked":""} ${c?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${c}"
              ${n?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.png" alt="${S(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${S(l.name)}</span>
              <span class="seed-card-seed-badge ${n?"no-seed":"has-seed"}">
                ${n?`🔒 Cấp ${l.unlockLevel}`:`🪙 ${l.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${xe(l.cycleSec)} • +${l.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${d?`+${l.yieldQty} ${S(d.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${a?`🐾 <strong>${S(a.name)}</strong> (${a.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
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
    `,t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const n=l.dataset.pastureBrush,c=Ze[n];if(!c)return;const d=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=n,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,d){const u=e.sim.state.buildings.find(p=>p.uid===d);if(u&&ie(u.itemId)?.isAnimalPasturePlot&&!u.pastureAnimalId){const p=e.sim.stockAnimalOnPasture(u.uid,n);e.showToast(p.msg,p.ok?c.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${c.emoji} ${c.name} (${c.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,c.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=ie("burrow_animal_pasture");l&&(Ct(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Hs(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Ct(e),e.refreshAll()})}function Na(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,o=Date.now();if((s.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){Ee(e);return}if(e.activeWorkshopTab==="brew"){const a=t.querySelector("#btnWsQuickHerb");if(a){const n=Math.max(0,Math.ceil((2e4-(o-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),c=n===0||s.sandboxMode;a.classList.toggle("gold-cta",c),a.textContent=c?"🌿 Hái Thảo Dược":`🌱 (${xe(n)})`}const r=t.querySelector("[data-ws-brew-left]");if(r&&s.supply.activeBrew){const n=Nt.find(d=>d.id===s.supply.activeBrew?.goodId),c=Math.max(0,Math.ceil((s.supply.activeBrew.endsAt-o)/1e3));n&&(r.textContent=`🔥 ${n.emoji} ${n.name} (còn ${Pe(c)})`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const n=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-o)/1e3)),c=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-o)/1e3));if(n<=0&&c<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const d=[];n>0&&d.push(`🍻 +85%G (${Pe(n)})`),c>0&&d.push(`🧪 +35%XP (${Pe(c)})`),l.textContent=`✨ ${d.join(" • ")}`}}}}function Ee(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,o=Date.now();e.lastWsBrewId=s.supply.activeBrew?.goodId??null;const i=e.sim.activeSynergies.activeIds.size,a=s.supply.cargoCrates.filter(d=>d.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),n=`
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
    `;let c="";if(e.activeWorkshopTab==="barn"){const d=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),u=e.sim.getBarnUpgradeCostInfo(),p=s.sandboxMode?"🏡 +20 Ô (Miễn phí Sandbox)":u.hasPlug?`🔌 +20 Ô (1🔌 + 🪙${u.baseGoldCost})`:`🏡 +20 Ô (🪙${u.effectiveGoldCost} • bù 1🔌)`,m=u.hasPlug?`🔌 ×${u.plugsInBarn}`:`🔌 ×0 (thiếu 1🔌 → bù +${u.plugShortageBuyout}G)`,b=L=>L.map(x=>{const C=De(x),$=e.sim.getFarmItemCount(x);return`
              <div class="barn-stock-card ${$>0?"in-stock":"empty"}">
                <img src="${C.iconSrc}" alt="${S(C.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${S(C.name)}</div>
                <div class="barn-stock-qty"><strong>×${s.sandboxMode?"∞":$}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${$>0||s.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${x}"
                  ${$<=0&&!s.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${C.sellValue}G
                </button>
              </div>
            `}).join(""),g=e.sim.getPhoenixTalismanCount(),y=e.sim.getPhoenixTalismanDailyStatus(),T=e.sim.getCraftablePhoenixBarnGood(),k=T?De(T):null,h=s.sandboxMode||g<bs&&!!T&&s.galleons>=Ws;c=`
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${l}/${r.capacity})</div>
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
              🔥 Bùa Phượng Hoàng (${s.sandboxMode?"∞":`${g}/${bs}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${y.usedCount}/${y.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${h?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${k?`1 ${S(k.name)}`:"1 Đặc sản"} + ${Ws}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(Se).length})</h3>
        <div class="barn-stock-grid">
          ${b(Object.keys(Se))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(it).length})</h3>
        <div class="barn-stock-grid">
          ${b(Object.keys(it))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const d=Math.max(0,Math.ceil((2e4-(o-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),u=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-o)/1e3)),p=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-o)/1e3)),m=s.supply.activeBrew,b=m?Nt.find(C=>C.id===m.goodId):void 0,g=m?Math.max(0,Math.ceil((m.endsAt-o)/1e3)):0,y=Math.max(0,s.supply.brewCompletedCount??0),T=y+1,k=s.buildings.some(C=>ie(C.itemId)?.isWorkshopBrewery&&o>=C.constructEndsAt),h=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),L=y===0?"Mẻ #1 (khởi động: 1 giờ)":y===1?"Mẻ #2 (tăng nhiệt ×2: 2 giờ)":y===2?"Mẻ #3 (tăng nhiệt ×4: 4 giờ)":`Mẻ #${T} (đạt trần tối đa: 6 giờ)`,x=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];c=`
        <div class="quest-card-mini" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${d===0||s.sandboxMode?"gold-cta":""}">
            ${d>0&&!s.sandboxMode?`🌱 (${xe(d)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="margin-bottom:12px;padding:9px 11px;font-size:12px;line-height:1.45;">
          <div style="font-weight:900;color:var(--brand-strong);">
            🔥 Nhiệt Vạc Phép — ${L}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Mỗi mẻ ủ hoàn tất làm vạc tăng nhiệt: <strong>1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ</strong>.
            ${k?"✅ Đang giảm 45% nhờ Xưởng Chế Biến.":"💡 Dựng Xưởng Chế Biến để giảm 45% giờ ủ."}
            ${h?" ✅ Combo Thảo Dược giảm thêm 22%.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${x.map(C=>{const $=$t[C],M=s.supply.ingredients[C]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${$.emoji} ${$.name}</span>
                    <span style="color:#b45309;">×${s.sandboxMode?"∞":M}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${u>0||p>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${u>0?`🍻 +85%G (${Pe(u)}) `:""}${p>0?`• 🧪 +35%XP (${Pe(p)})`:""}
              </div>
            `:""}

        ${m&&b?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${b.emoji} ${S(b.name)} (còn ${Pe(g)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Nt.map(C=>{const $=s.supply.goods[C.id]??0,M=e.sim.getBrewDurationSec(C),A=xe(M),O=Object.entries(C.inputs).map(([z,E])=>{const N=$t[z],D=s.supply.ingredients[z]??0;return`<span style="color:${s.sandboxMode||D>=(E??0)?"#15803d":"#dc2626"};font-weight:800;">${N.emoji} ${D}/${E}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${C.emoji} ${C.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${s.sandboxMode?"∞":$}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${O}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${C.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${A})
                  </button>
                  <button type="button" data-use-good="${C.id}" class="brass-btn" style="flex:1;">
                    ${C.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const d=Math.round(240+s.level*40),u=Math.round(160+s.level*25);c=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${s.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${d.toLocaleString("vi-VN")}🪙 +${u}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${s.supply.cargoCrates.map((p,m)=>{const b=Nt.find(T=>T.id===p.goodId),g=s.supply.goods[p.goodId]??0,y=!p.fulfilled&&(s.sandboxMode||g>=p.qtyRequired);return`
                <div class="crate-card ${p.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${m+1}</span>
                      <span>${p.fulfilled?"✅":`${s.sandboxMode?"∞":g}/${p.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${b.emoji} ${b.name} ×${p.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${p.rewardGalleons}🪙 • +${p.rewardXp}⭐ • +${p.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${p.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':y?`<button type="button" data-fulfill-crate="${p.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else c=`
        <div class="grid-2col">
          ${di.map(d=>{const u=e.sim.activeSynergies.activeIds.has(d.id),p=d.requiredItems.map(m=>ie(m)?.name??m).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${u?"#d97706":"rgba(138,90,43,0.3)"};background:${u?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${d.emoji} ${S(d.name)}</span>
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
      `;t.innerHTML=n+c,t.querySelectorAll("[data-ws-tab]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab=d.dataset.wsTab,Ee(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const d=e.sim.upgradeFarmBarn();e.showToast(d.msg,d.ok?"🏡":"🔌"),Ee(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const d=e.sim.craftPhoenixTalismanFromBarn();e.showToast(d.msg,d.ok?"🔥":"🧺"),Ee(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.sellFarmItemFromBarn(d.dataset.sellFarmItem,1);u.ok||e.showToast(u.msg,"🧺"),Ee(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const d=e.sim.quickHarvestHerbs();e.showToast(d.msg,d.ok?"🌿":"⏳"),Ee(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&Ee(e)}),t.querySelectorAll("[data-brew-good]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.startBrewing(d.dataset.brewGood);e.showToast(u.msg,u.ok?"🧪":"⚠️"),Ee(e)})}),t.querySelectorAll("[data-use-good]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.useGood,p=e.sim.useCraftedGood(u);p.ok?u==="dragon_firework"?e.root.querySelector("#workshopDialog").close():Ee(e):e.showToast(p.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.fulfillCargoCrate(d.dataset.fulfillCrate);e.showToast(u.msg,u.ok?"📦":"⚠️"),Ee(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab="brew",Ee(e)})})}function Da(e){e.closeHudPopovers(),On(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function Ra(e){const t=e.sim.getClaimableHarvestFeastCount(),s=e.root.querySelector("#badgeFeastCount");s&&(t>0?(s.textContent=String(t),s.classList.remove("hidden")):s.classList.add("hidden"));const o=e.root.querySelector("#badgeManageFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"))}function Oa(e,t){const s=e.root.querySelector("#ribbonUnveilToastCard");s&&(s.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${S(t.speakerEmoji)} ${S(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${S(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,s.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{s.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function On(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const s=e.sim.ensureHarvestFeast(),o=new Set(s.claimedTiers),i=ut[ut.length-1]?.pointsRequired??3e3,a=Math.min(100,Math.round(s.points/Math.max(1,i)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=ut.every(d=>o.has(d.tier)),n=ut.find(d=>!o.has(d.tier)),c=ut.map(d=>{const u=o.has(d.tier),m=s.points>=d.pointsRequired&&!u,b=Ti(d),g=d.tier%5===0;return`
        <article class="feast-tier-card ${u?"is-claimed":m?"is-claimable":"is-locked"} ${g?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${d.tier}</span>
            <span class="feast-tier-pts">🍁 ${d.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${S(d.icon)} ${S(d.titleVi)}</span>
              ${g?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${S(b)}</div>
          </div>
          <div class="feast-tier-cta">
            ${u?'<span class="feast-claimed-pill">✓</span>':m?`<button type="button" data-claim-feast-tier="${d.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(d.pointsRequired-s.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${s.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${s.points.toLocaleString("vi-VN")} / ${i.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${l?"🎉 30/30!":n?` Kế tiếp: #${n.tier} (${n.pointsRequired.toLocaleString("vi-VN")} 🍁)`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${r>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${r})</button>`:""}
            ${l?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${s.seasonCycle+1}</button>`:""}
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
        ${c}
      </div>
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const d=e.sim.claimAllHarvestFeastTiers();e.showToast(d.msg,d.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const d=e.sim.startNextHarvestFeastCycle();e.showToast(d.msg,d.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(d=>{d.addEventListener("click",()=>{const u=Number(d.dataset.claimFeastTier);if(!Number.isFinite(u))return;const p=e.sim.claimHarvestFeastTier(u);e.showToast(p.msg,p.ok?"🎁":"🍁"),e.refreshAll()})})}function za(e){const t=e.root.querySelector("#financeDialogContent"),s=e.sim.state.finance,o=s.gateRevenue+s.ticketRevenue+s.shopRevenue+s.harvestRevenue,i=s.staffWagesPaid+s.constructionSpent,a=o-i,r=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${s.harvestRevenue.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(s.shopRevenue+s.ticketRevenue+s.gateRevenue).toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${o.toLocaleString("vi-VN")} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${s.constructionSpent.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${r}G/ca):</span><strong>-${s.staffWagesPaid.toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${a>=0?"#15803d":"#b45309"};">
              <span>Ròng:</span><strong>${a>=0?"+":""}${a.toLocaleString("vi-VN")} G</strong>
            </div>
          </div>
        </div>
      </div>
    `}function Qe(e){const t=e.root.querySelector("#albumDialogContent"),s=e.sim.state;e.sim.checkAndToastAchievements();const o=ki(s),i=Ci(s),a=Qs.filter(d=>{const u=o.achievements[d.id];return!!(u?.unlockedAt&&!u?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=Ks.filter(d=>d.day<=r&&!o.claimedLoginDays.includes(d.day)).length,n=`
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
    `;let c="";if(e.activeAlbumTab==="cup"){const d=e.sim.getPlayerHouse(),u=s.weeklyHouseCupServerStandings,p=[{house:"Gryffindor",icon:"🦁",pts:(s.housePoints.Gryffindor??0)+(u?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(s.housePoints.Slytherin??0)+(u?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(s.housePoints.Ravenclaw??0)+(u?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(s.housePoints.Hufflepuff??0)+(u?.totals.Hufflepuff??0)}];p.sort((T,k)=>k.pts-T.pts);const m=Math.max(100,p[0]?.pts??100),b=(s.housePoints.Gryffindor??0)+(s.housePoints.Slytherin??0)+(s.housePoints.Ravenclaw??0)+(s.housePoints.Hufflepuff??0),g=s.houseCupMilestoneTier*300,y=b>=g;c=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${d}</strong>${u?` • Tuần HPVN ${u.weekKey} (đóng góp: +${u.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${s.houseCupMilestoneTier}: ${b} / ${g}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${p.map((T,k)=>{const h=Math.min(100,Math.max(8,Math.round(T.pts/m*100))),L=T.house===d;return`
                  <div class="aaa-hourglass-card" data-house="${T.house}" data-player-house="${L}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${k===0?"👑 ":""}${T.icon} ${T.house}</span>
                      ${L?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${T.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${h}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${g}" value="${Math.min(g,b)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${y?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${s.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const d=Date.now(),u={farm:nt(s,"farm",d),building:nt(s,"building",d),puzzle:nt(s,"puzzle",d),language:nt(s,"language",d),social:nt(s,"social",d),collection:nt(s,"collection",d)};c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${i.completionPct}% (${i.unlocked}/${i.total})</span>
          </div>
          <progress max="${i.total}" value="${i.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${Qs.map(p=>{const m=o.achievements[p.id],b=!!m?.unlockedAt,g=!!m?.claimedAt,y=Math.min(p.target,Math.max(0,u[p.category]??0)),T=y.toLocaleString("vi-VN"),k=p.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${b}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${p.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${p.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${p.descVi} • Thưởng <strong>+${p.rewardGalleons}G, +${p.rewardStars} 🌟</strong></div>
                    ${b?"":`<progress max="${p.target}" value="${y}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${g?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':b?`<button type="button" data-claim-ach="${p.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${T}/${k}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const d=e.sim.getRealTimePeriod(),u=Mi();c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${bn.map(p=>{const m=s.level>=p.unlockLevel||e.sim.isHeadmasterPreview;return`
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
          ${Li.map(p=>{const m=Ai(p.id,d),b=o.npcFriendship[p.id]??{villagerId:p.id,level:1,xp:0},g=b.level*60,y=b.lastTalkedDayKey===u;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${p.moodBubble} ${p.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${p.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${b.level}/10 (${b.xp}/${g})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${m.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${p.id}" data-choice="0" ${y?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${y?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${y?"":`<button type="button" data-npc-talk="${p.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else c=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${Ks.map(d=>{const u=o.claimedLoginDays.includes(d.day),p=!u&&d.day<=r;return`
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
      `;t.innerHTML=n+c,t.querySelectorAll("[data-atab]").forEach(d=>{d.addEventListener("click",()=>{e.activeAlbumTab=d.dataset.atab,Qe(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&Qe(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const d=await St(()=>Promise.resolve().then(()=>ba),void 0);if(typeof d.fetchWeeklyHouseCupStandingsOnline=="function"){const u=await d.fetchWeeklyHouseCupStandingsOnline();if(u){s.weeklyHouseCupServerStandings=u,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${u.weekKey}!`,"🏆"),Qe(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimAchievement(String(d.dataset.claimAch));e.showToast(u.msg,u.ok?"🎖️":"⚠️"),Qe(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(d=>{d.addEventListener("click",()=>{e.playStoryCutscene(String(d.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.npcTalk,p=Number(d.dataset.choice)===1?1:0,m=e.sim.talkWithVillagerChoice(u,p);e.showToast(m.msg,m.ok?"💝":"☕"),Qe(e)})}),t.querySelectorAll("[data-claim-login]").forEach(d=>{d.addEventListener("click",()=>{const u=e.sim.claimLoginDayReward(Number(d.dataset.claimLogin));e.showToast(u.msg,u.ok?"📅":"🔒"),Qe(e)})})}function ze(e){const t=e.root.querySelector("#questDialogContent"),s=e.sim.ensureFarmBarn(),o=e.sim.getActiveStoryQuest(),i=e.sim.getStoryAutoActionPreview(),a=e.sim.getReadyOwlOrdersCount(),r=(o?.completed?1:0)+e.sim.state.owlQuests.filter(b=>b.completed&&!b.claimed).length+e.sim.state.dailyQuests.filter(b=>b.completed&&!b.claimed).length;if(!e.selectedOwlOrderId||!s.owlOrders.some(b=>b.id===e.selectedOwlOrderId)){const b=s.owlOrders.find(g=>e.sim.canFulfillFarmOwlOrder(g));e.selectedOwlOrderId=(b??s.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${a}/${s.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const b=s.owlOrders.find(k=>k.id===e.selectedOwlOrderId)??s.owlOrders[0],g=b?e.sim.canFulfillFarmOwlOrder(b):!1,y=s.owlOrders.map(k=>{const h=b?.id===k.id,L=e.sim.canFulfillFarmOwlOrder(k),x=k.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${k.portraitSprite}.png" alt="${S(k.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${S(k.portraitEmoji)}</span>`,C=k.requirements.slice(0,3).map($=>{const M=De($.itemId);return`<img src="${M.iconSrc}" alt="${S(M.name)}" title="${$.qty} ${S(M.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${h?"selected":""} ${L?"ready":""}"
              data-select-owl="${S(k.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${x}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${S(k.senderName)}</div>
                <div class="owl-note-mini-row">${C}</div>
                ${k.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${L?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),T=b?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${S(b.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${S(b.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${b.requirements.map((k,h)=>{const L=De(k.itemId),x=e.sim.getFarmItemCount(k.itemId),C=e.sim.ensureNeighborSocial(),$=Math.max(0,Dt-C.dailyOwlHelpRequestedCount),M=e.sim.getOwlRequirementHelpState(b.id,h),A=!!M?.fulfilledAt,O=e.sim.state.sandboxMode||A||x>=k.qty,z=A?`<span class="owl-help-tag done">✓ ${S(M?.helperEmoji??"🦉")}</span>`:M?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':O?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${h}" ${$<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${$})</button>`;return`
                    <div class="owl-req-row ${O?"ok":"lack"}">
                      <img src="${L.iconSrc}" alt="${S(L.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${S(L.name)}</div>
                        <div class="owl-req-count">${A?"✓":`${e.sim.state.sandboxMode?"∞":x}/${k.qty}`}</div>
                      </div>
                      ${z}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${b.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${b.rewardXp}</span>
                ${b.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${b.rewardMugglePlug}</span>`:""}
                ${(b.isFeastMarquee||(s.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<bs?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${y}</div>
            ${T}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${g?"ready":"not-ready"}"
            >
              🦉 ${g?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(k=>{k.addEventListener("click",()=>{e.activeQuestTab=k.dataset.qtab,ze(e)})}),t.querySelectorAll("[data-select-owl]").forEach(k=>{k.addEventListener("click",()=>{e.selectedOwlOrderId=k.dataset.selectOwl??null,ze(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{b&&(e.sim.refreshFarmOwlOrder(b.id),e.selectedOwlOrderId=null,ze(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(k=>{k.addEventListener("click",()=>{if(!b)return;const h=Number(k.dataset.askOwlHelp);if(!Number.isFinite(h))return;const L=e.sim.requestPlayerOwlCrateHelp(b.id,h);L.ok||e.showToast(L.msg,"⚠️"),ze(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!b)return;if(!e.sim.canFulfillFarmOwlOrder(b)){const h=e.sim.fulfillFarmOwlOrder(b.id);e.showToast(h.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const k=e.sim.fulfillFarmOwlOrder(b.id);k.ok&&e.showToast(k.msg,"🦉"),e.selectedOwlOrderId=null,ze(e)});return}const n=(b,g,y=!1)=>{const T=Math.min(100,Math.round(b.progress/Math.max(1,b.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${S(b.giverEmoji)} ${S(b.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${S(g)}</span>
          </div>
          ${y&&b.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${S(b.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${T}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(b.progress,b.targetAmount)}/${b.targetAmount}</span>
            <span>🪙${b.rewardGalleons} • ⭐${b.rewardXp} ${b.rewardTimeSand>0?`• ⏳${b.rewardTimeSand}`:""}</span>
          </div>
          ${b.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':b.completed?`<button type="button" data-modal-claim="${S(b.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:y?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${S(i.shortLabel)}</button>`:""}
        </div>
      `},c=e.sim.getRequiredLevelTrial(),d=e.sim.getWinsProgressForCurrentLevel(),u=b=>{const g=e.sim.getDisciplineStageInfo(b);return g.isMaxed?"👑777":`${g.currentStage}/777`},p=c&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${d.current}/${d.required}): ${c.icon} ${S(c.shortVi)}
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
      `:"",m=o?`Ch.${o.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${pi.length}`:"";t.innerHTML=`
      ${l}
      ${p}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${o?n(o,m,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(b=>n(b,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(b=>n(b,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(b=>{b.addEventListener("click",()=>{e.activeQuestTab=b.dataset.qtab,ze(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(b=>{b.addEventListener("click",()=>{const g=b.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(g)})}),t.querySelectorAll("[data-modal-claim]").forEach(b=>{b.addEventListener("click",()=>{e.sim.claimQuest(b.dataset.modalClaim),ze(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const b=e.sim.completeStoryStepWithStar();b.ok?(typeof b.placedGx=="number"&&typeof b.placedGy=="number"&&ue(e.cam,b.placedGx,b.placedGy),ze(e)):(e.showToast(b.msg,b.reason==="missing_gold"?"🪙":"🌟"),(b.reason==="missing_stars"||b.reason==="locked_level"||b.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function zn(e){const t=e.root.querySelector("#roadmapDialogContent"),s=new Set(e.sim.state.unlockedZones),o=e.sim.getRequiredLevelTrial(),i=Cs.map(r=>{const l=s.has(r.id)||e.sim.state.sandboxMode,n=!l&&e.sim.state.level>=r.unlockLevel,c=un(r);return`
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${l?"✅":"🌫️"} ${r.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${r.unlockLevel} • ${c>0?`🌟 ${c}`:"✓"}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${r.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${n?`<button type="button" data-unlock-zone="${r.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
            </div>
          </div>
        </div>
      `}).join(""),a=ui.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${o&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${o.icon} ${S(o.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${i}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${a.map(r=>{const l=e.sim.state.level>=r.level,n=r.unlockedItemIds.map(c=>ie(c)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${n?`<span style="font-size:12px;margin-left:6px;">${n}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=pn(r.dataset.camZone);ue(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),zn(e)})})}function Ae(e){const t=e.root.querySelector("#settingsDialogContent"),s=e.sim.state,o=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎵 Âm Thanh &amp; Hiển Thị</div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            <label class="switch-row">
              <span>🎼 Nhạc nền (BGM)</span>
              <input id="swBgm" type="checkbox" switch ${s.settings.bgmEnabled?"checked":""} />
            </label>
            <label class="switch-row">
              <span>🔔 Âm hiệu ứng (SFX)</span>
              <input id="swSfx" type="checkbox" switch ${s.settings.soundEnabled?"checked":""} />
            </label>
            <label class="switch-row">
              <span>👁️ Nhìn xuyên nhà (V)</span>
              <input id="swCutaway" type="checkbox" switch ${s.settings.cutawayMode?"checked":""} />
            </label>
            <label class="switch-row">
              <span>✨ Hiện lưới ô</span>
              <input id="swGrid" type="checkbox" switch ${s.settings.showGrid?"checked":""} />
            </label>
            ${typeof window<"u"&&Be(window.location.hostname)?`<label class="switch-row">
                    <span>♾️ Sandbox (Dev)</span>
                    <input id="swSandbox" type="checkbox" switch ${s.sandboxMode?"checked":""} />
                  </label>`:""}
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["realtime","dawn","day","dusk","night"].map(i=>{const a={realtime:"🕒 24h",dawn:"🌅 Bình minh",day:"☀️ Ngày",dusk:"🌇 Chiều",night:"🌙 Đêm"};return`<button type="button" data-time="${i}" data-active="${s.settings.timeOverride===i}" aria-pressed="${s.settings.timeOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["auto","halloween","christmas","quidditch_cup"].map(i=>{const a={auto:"🎪 Tự động",halloween:"🎃 Halloween",christmas:"🎄 Giáng Sinh",quidditch_cup:"🏆 Quidditch"};return`<button type="button" data-fest="${i}" data-active="${s.settings.activeFestival===i}" aria-pressed="${s.settings.activeFestival===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[i]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","clear","cloudy","rain","storm","snow","fog"].map(i=>{const a={auto:"🌦️ Tự động",clear:"☀️ Nắng",cloudy:"⛅ Mây",rain:"🌧️ Mưa",storm:"⛈️ Giông",snow:"❄️ Tuyết",fog:"🌫️ Sương"};return`<button type="button" data-weather="${i}" data-active="${s.settings.weatherOverride===i}" aria-pressed="${s.settings.weatherOverride===i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${a[i]}</button>`}).join("")}
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
          ${["layout_1","layout_2","layout_3"].map((i,a)=>{const r=s.layoutPresets?.[i];return`
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
            🌸 Bày Lại Trang Trí (${Object.values(s.stashedDecorInventory??{}).reduce((i,a)=>i+a,0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${["slot_1","slot_2","slot_3"].map((i,a)=>{const r=Ei(i);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${a+1}</div>
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
    `,"switch"in HTMLInputElement.prototype||St(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",i=>{s.settings.bgmEnabled=i.currentTarget.checked,e.sim.audio.bgmEnabled=s.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",i=>{s.settings.soundEnabled=i.currentTarget.checked,e.sim.audio.enabled=s.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",i=>{s.settings.cutawayMode=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",i=>{s.settings.showGrid=i.currentTarget.checked,e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",i=>{typeof window<"u"&&Be(window.location.hostname)&&(s.sandboxMode=i.currentTarget.checked,s.sandboxMode&&(s.sandboxTainted=!0),e.sim.saveToStorage(),e.refreshAll())}),t.querySelectorAll("[data-time]").forEach(i=>{i.addEventListener("click",()=>{s.settings.timeOverride=i.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-fest]").forEach(i=>{i.addEventListener("click",()=>{s.settings.activeFestival=i.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-weather]").forEach(i=>{i.addEventListener("click",()=>{s.settings.weatherOverride=i.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ae(e)})}),t.querySelectorAll("[data-toon]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.toon==="on";e.sprites?.setToonEnabled(a),e.refreshAll(),Ae(e)})}),t.querySelector("#btnTestFireworks")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.launchFireworksShow(12)}),t.querySelector("#btnTestEscape")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.triggerPlayfulEscape()}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),Ae(e)}),t.querySelector("#btnExportSave")?.addEventListener("click",()=>{const i=new Blob([e.sim.exportSaveJson()],{type:"application/json"}),a=URL.createObjectURL(i),r=document.createElement("a");r.href=a,r.download=`cong-vien-harry-potter-lv${s.level}.json`,r.click(),URL.revokeObjectURL(a),e.showToast("Đã xuất file Save thành công!","💾")}),t.querySelector("#inpImportSave")?.addEventListener("change",i=>{const a=i.target.files?.[0];if(!a)return;const r=new FileReader;r.onload=()=>{e.sim.importSaveJson(String(r.result))?(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.showToast("Đã khôi phục công viên thành công!","✨"),e.root.querySelector("#settingsDialog").close()):e.showToast("File Save không hợp lệ!","⚠️")},r.readAsText(a)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),ue(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(i=>{i.addEventListener("input",()=>{const a=i.dataset.volBus,r=Math.max(0,Math.min(1,Number(i.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[a]=r,s.a11ySettings=l;const n=t.querySelector(`[data-vol-val="${a}"]`);n&&(n.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(i=>{i.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.colorblindMode=i.dataset.cbMode,s.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelectorAll("[data-font-scale]").forEach(i=>{i.addEventListener("click",()=>{const a=e.getEffectiveA11ySettings();a.fontScale=Number(i.dataset.fontScale),s.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ae(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",i=>{const a=e.getEffectiveA11ySettings();a.highContrast=i.currentTarget.checked,s.a11ySettings=a,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.saveLayout,r=e.sim.saveLayoutPreset(a);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ae(e)})}),t.querySelectorAll("[data-load-layout]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.loadLayout,r=e.sim.applyLayoutPreset(a);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ae(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const i=e.sim.stashAllDecorItems();e.showToast(i.msg,i.ok?"📦":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const i=e.sim.restoreAllStashedDecor();e.showToast(i.msg,i.ok?"🌸":"⚠️"),e.refreshAll(),Ae(e)}),t.querySelectorAll("[data-save-slot]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(a);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ae(e)})}),t.querySelectorAll("[data-load-slot]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(a);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function Fa(e,t,s){t&&(e.activeSuitcaseTab=t),s&&(e.selectedSuitcaseHabitatUid=s),$e(e);const o=e.root.querySelector("#suitcaseDialog");o.open||o.showModal()}function Ga(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const s=e.sim.getSuitcaseReadySummary();s.badgeCount>0?(t.textContent=String(s.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function Va(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=Date.now(),o=e.sim.state.suitcase,i=!!(o.activeIncubation&&s>=o.activeIncubation.endsAt),a=!!(o.activeExpedition&&s>=o.activeExpedition.endsAt);if((i!==e.lastSuitcaseIncReady||a!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){$e(e);return}if(o.activeIncubation&&s<o.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((o.activeIncubation.endsAt-s)/1e3)),l=Math.max(1e3,o.activeIncubation.endsAt-o.activeIncubation.startedAt),n=Math.min(100,Math.round((s-o.activeIncubation.startedAt)/l*100)),c=t.querySelector("[data-suitcase-inc-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-inc-prog]");d&&(d.value=n)}if(o.activeExpedition&&s<o.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((o.activeExpedition.endsAt-s)/1e3)),l=Math.max(1e3,o.activeExpedition.endsAt-o.activeExpedition.startedAt),n=Math.min(100,Math.round((s-o.activeExpedition.startedAt)/l*100)),c=t.querySelector("[data-suitcase-exp-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-exp-prog]");d&&(d.value=n)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((gn-(s-(r.lastGroomedAt??0)))/1e3)),n=Math.max(0,Math.ceil((mn-(s-(r.lastTrainedAt??0)))/1e3)),c=t.querySelector("#btnScGroom");c&&(c.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const d=t.querySelector("#btnScTrain");d&&(d.textContent=n>0?`🎾 (${n}s)`:"🎾 Tập (20G • +45💝)")}}}function $e(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=e.sim.state,o=s.suitcase,i=Date.now(),a=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!a.some(h=>h.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=a[0]?.building.uid??null);const r=new Set(o.discoveredMorphs),l=ss.length*3,n=r.size,c=gi(n),d=s.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(o.activeIncubation&&i>=o.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(o.activeExpedition&&i>=o.activeExpedition.endsAt);const u=o.activeIncubation?i>=o.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",p=o.activeExpedition?i>=o.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${n}/${l}`,m=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${a.length}</strong></span>
        <span>📖 <strong>${n}/${l}</strong> (+${c}%)</span>
        <span>✨ <strong>${s.sandboxMode?"∞":d}</strong> • ⏳ <strong>${s.sandboxMode?"∞":s.timeSand}</strong></span>
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
    `;let b="";if(e.activeSuitcaseTab==="care")if(a.length===0)b=`
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;else{const h=a.find(oe=>oe.building.uid===e.selectedSuitcaseHabitatUid)??a[0],L=h.building,x=h.item,C=qt(x.id)??ss[0],$=L.creatureMorph??"normal",M=Ne[$],A=L.creatureBondLevel??1,O=L.creatureBondXp??0,z=A>=ht?100:mi(A),E=A>=ht?100:O,N=Math.round((Fs(A)-1)*100),D=L.creatureNickname||x.creatureName||x.name,K=e.sim.getBuildingProductionPerCycle(L,x),I=e.sim.biomeCache.get(L.uid),_=Math.round(L.creatureHunger??90),W=Math.max(8,Math.round(x.cost*.04)),B=s.sandboxMode?0:Math.max(0,Math.ceil((gn-(i-(L.lastGroomedAt??0)))/1e3)),V=s.sandboxMode?0:Math.max(0,Math.ceil((mn-(i-(L.lastTrainedAt??0)))/1e3)),le=o.activeExpedition?.habitatUid===L.uid;b=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${a.map(({building:oe,item:re})=>{const fe=qt(re.id),ce=oe.creatureMorph??"normal",be=Ne[ce],ge=oe.creatureNickname||re.creatureName||re.name,ee=oe.uid===L.uid;return`
                  <button type="button" data-select-pet="${S(oe.uid)}" aria-pressed="${ee}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${fe?.beastSpriteKey??re.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${be.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${S(ge)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${oe.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${C.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${S(C.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${$==="radiant"?"radiant":$==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${M.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${S(D)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${C.beastSpriteKey}.png"
                  alt="${S(D)}"
                  class="suitcase-diorama-img"
                  style="filter:${M.cssFilter} drop-shadow(0 0 18px ${M.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${C.emoji} ${S(D)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${S(C.morphNames[$])}${le?" • 🧭":""}
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
                  placeholder="${S(x.creatureName??x.name)}"
                  value="${S(L.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${A}/${ht} (+${N}%)</span>
                  <span style="color:#b45309;">${A>=ht?"MAX":`${O}/${z}`}</span>
                </div>
                <progress max="${z}" value="${E}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${S(C.favoriteTreat)} • <strong>+${K.galleons.toLocaleString("vi-VN")}🪙 / ${xe(x.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${_}%</span>
                  <span>🌿 ${I?.score??60}% ${L.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${_}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${s.sandboxMode?"0G":`${W}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${B===0?"gold-cta":""}">
                  ${B>0?`🪮 (${B}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${V>0?`🎾 (${V}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const h=o.activeIncubation;let L="";if(h){const C=ie(h.itemId),$=qt(h.itemId),M=i>=h.endsAt,A=Math.max(0,Math.ceil((h.endsAt-i)/1e3)),O=Math.max(1e3,h.endsAt-h.startedAt),z=M?100:Math.min(100,Math.round((i-h.startedAt)/O*100));L=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${S($?.speciesName??C?.name??"Trứng")}
                ${h.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${M?"✨ Nở!":`${A}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${z}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${M?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else L=`
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(s.sandboxMode||d>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const x=a.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${a.map(({building:C,item:$})=>{const M=qt($.id),A=C.creatureMorph??"normal",O=e.sim.getMorphIncubationCost($),z=C.creatureNickname||$.creatureName||$.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${M?.beastSpriteKey??$.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Ne[A].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${S(z)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Ne[A].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(E=>{const N=r.has(`${$.id}:${E}`);return`<span class="morph-pill ${N?E==="radiant"?"radiant":E==="mystic"?"mystic":"":"locked"}">${N?Ne[E].badge:`🔒 ${Ne[E].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${S(C.uid)}"
                        class="brass-btn ${h?"":"gold-cta"}"
                        ${h?"disabled":""}
                      >
                        ${h?"🥚 Đang ấp":`🥚 Ấp (${s.sandboxMode?"0G":`${O}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;b=`${L}${x}`}else{const h=o.activeExpedition;let L="";if(h){const C=ns.find(D=>D.id===h.expeditionId)??ns[0],$=s.buildings.find(D=>D.uid===h.habitatUid),M=$?ie($.itemId):void 0,A=$?.creatureNickname||M?.creatureName||"Thú cưng",O=i>=h.endsAt,z=Math.max(0,Math.ceil((h.endsAt-i)/1e3)),E=Math.max(1e3,h.endsAt-h.startedAt),N=O?100:Math.min(100,Math.round((i-h.startedAt)/E*100));L=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${C.emoji} ${S(A)} • ${S(C.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${O?"🎒 Đã về!":`${z}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${N}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${O?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(a.length===0)L=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const $=(a.find(A=>A.building.uid===e.selectedSuitcaseHabitatUid)??a[0]).building,M=Fs($.creatureBondLevel??1)*Ne[$.creatureMorph??"normal"].incomeMult;L=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${a.map(({building:A,item:O})=>{const z=A.creatureNickname||O.creatureName||O.name,E=Ne[A.creatureMorph??"normal"].shortLabel;return`<option value="${S(A.uid)}" ${A.uid===$.uid?"selected":""}>${S(z)} (💝Lv.${A.creatureBondLevel??1} • ${E})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${ns.map(A=>{const O=!s.sandboxMode&&s.level<A.minParkLevel,z=Math.round(A.baseGold*M),E=Math.round(A.baseXp*M),N=($.creatureBondLevel??1)>=5?1:0,D=A.guaranteedIngredients.map(K=>`+${K.qty+N} ${$t[K.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${A.emoji} ${S(A.name)} <span style="font-size:11.5px;color:#78350f;">(${A.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${z}🪙 • +${E}⭐ • ${D}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${A.id}"
                    class="brass-btn ${O?"":"gold-cta"}"
                    ${O?"disabled":""}
                  >
                    ${O?`🔒 Lv.${A.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const x=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${n}/${l})</span>
            <span style="color:#15803d;">+${c}%</span>
          </div>
          <progress max="${l}" value="${n}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${ss.map(C=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${C.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${C.emoji} ${S(C.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map($=>{const M=r.has(`${C.habitatItemId}:${$}`);return`<span class="morph-pill ${M?$==="radiant"?"radiant":$==="mystic"?"mystic":"":"locked"}">${M?Ne[$].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;b=`${L}${x}`}t.innerHTML=`${m}${b}`,t.querySelectorAll("[data-sc-tab]").forEach(h=>{h.addEventListener("click",()=>{e.activeSuitcaseTab=h.dataset.scTab,$e(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(h=>{h.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=h.dataset.selectPet??null,$e(e)})});const g=t.querySelector("#formSuitcaseRename"),y=t.querySelector("#inpSuitcasePetName");if(y&&y.addEventListener("keydown",h=>{h.isComposing||h.stopPropagation()}),g&&y&&e.selectedSuitcaseHabitatUid){const h=e.selectedSuitcaseHabitatUid;g.addEventListener("submit",L=>{L.preventDefault();const x=e.sim.renameCreature(h,y.value);e.showToast(x.msg,"🏷️"),$e(e)})}if(e.selectedSuitcaseHabitatUid){const h=e.selectedSuitcaseHabitatUid,L=()=>{const x=e.sim.groomCreature(h);e.showToast(x.msg,x.ok?"🪮":"⏳"),$e(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",L),t.querySelector("#btnScGroom")?.addEventListener("click",L),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(h),$e(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const x=e.sim.trainCreatureTrick(h);e.showToast(x.msg,x.ok?"🎾":"🪙"),$e(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const x=s.buildings.find(C=>C.uid===h);x&&(e.root.querySelector("#suitcaseDialog").close(),ue(e.cam,x.gx+1,x.gy+1),e.inspectSelection={kind:"building",uid:x.uid},e.renderInspector())})}const T=t.querySelector("#chkScStarlight");T&&T.addEventListener("change",()=>{e.useStarlightForIncubation=T.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(h=>{h.addEventListener("click",()=>{const L=h.dataset.incubateUid,x=e.useStarlightForIncubation&&(s.sandboxMode||(s.supply.ingredients.starlight_dust??0)>=1),C=e.sim.startMorphIncubation(L,x);e.showToast(C.msg,C.ok?"🥚":"⚠️"),$e(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const h=e.sim.speedUpIncubationWithSand();e.showToast(h.msg,h.ok?"⏳":"⚠️"),$e(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),$e(e)});const k=t.querySelector("#selScExpPet");k&&k.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=k.value,$e(e)}),t.querySelectorAll("[data-start-exp]").forEach(h=>{h.addEventListener("click",()=>{const L=h.dataset.startExp,x=e.selectedSuitcaseHabitatUid??a[0]?.building.uid;if(!x)return;const C=e.sim.startSuitcaseExpedition(x,L);e.showToast(C.msg,C.ok?"🧭":"⚠️"),$e(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const h=e.sim.speedUpExpeditionWithSand();e.showToast(h.msg,h.ok?"⏳":"⚠️"),$e(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),$e(e)})}const _a="/api/track",Ua=25,ja=3e4;class Wa{constructor(t={}){w(this,"endpoint");w(this,"batchSize");w(this,"batchIntervalMs");w(this,"queue",[]);w(this,"timer",null);w(this,"lastLevel",null);w(this,"isFlushing",!1);w(this,"isInitialized",!1);this.endpoint=t.endpoint||_a,this.batchSize=t.batchSize||Ua,this.batchIntervalMs=t.batchIntervalMs||ja}track(t,s){const o={id:this.generateEventId(),name:t,props:s?{...s}:void 0,timestamp:Date.now()};this.queue.push(o),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const s=this.queue.splice(0,this.queue.length);if(s.length===0)return;const o={events:s,sentAt:Date.now()},i=JSON.stringify(o);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const a=new Blob([i],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,a))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:i,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",s=>{this.handleGameTick(s)}),window.addEventListener("gamesave:uploaded",s=>{const o=s;this.track("save_uploaded",o.detail||{})});else if(t){const s=t.onUploadSuccess;t.onUploadSuccess=o=>{if(s)try{s(o)}catch{}this.track("save_uploaded",o)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",s="unknown",o="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,s=navigator.language||"vi",o=navigator.userAgent||""),this.track("session_start",{screen:t,language:s,userAgent:o,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const o=t.detail;o&&(this.track("game:tick",{level:o.level,galleons:o.galleons}),typeof o.level=="number"&&(this.lastLevel!==null&&o.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:o.level}),this.lastLevel=o.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class Qa{constructor(t,s={}){w(this,"analytics");w(this,"maxErrorsPerSession");w(this,"isListening",!1);w(this,"seenSignatures",new Set);w(this,"errorCountThisSession",0);w(this,"handleError",t=>{const s=t.message||(t.error?String(t.error):"Uncaught runtime error"),o=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",i=t.filename||(typeof window<"u"?window.location.href:""),a={msg:s,stack:o,url:i,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(a),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});w(this,"handleUnhandledRejection",t=>{const s=t.reason,o=s instanceof Error,i=o?s.message:s?String(s):"Unhandled promise rejection",a=o&&s.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:i,stack:a,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",s)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,s.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const s=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(s)){this.seenSignatures.add(s),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class Ka{constructor(){w(this,"buttonEl",null);w(this,"dialogEl",null);w(this,"activeTab","privacy");w(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const s=this.dialogEl.querySelector(".legal-confirm-btn");s&&s.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",i=>{i.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{i.addEventListener("click",()=>{const a=i.getAttribute("data-tab");a&&this.switchTab(a)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(i=>{const a=i.getAttribute("data-tab")===t;i.setAttribute("aria-selected",a?"true":"false"),i.setAttribute("data-active",a?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(i=>{const a=i.getAttribute("data-panel")===t;i.setAttribute("data-active",a?"true":"false"),i.style.display=a?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}class Xa{constructor(){w(this,"cloudSave");w(this,"analytics");w(this,"errorMonitor");w(this,"legalModal");w(this,"authoritativeClient");w(this,"hpvnBridge");w(this,"isInitialized",!1);w(this,"lastAuthoritativeWalletBalance",null);w(this,"walletSyncTimer",null);w(this,"isApplyingServerWallet",!1);w(this,"boundSim",null);this.cloudSave=new qi,this.analytics=new Wa,this.errorMonitor=new Qa(this.analytics),this.legalModal=new Ka,this.authoritativeClient=dt(),this.hpvnBridge=ia({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(hn):null;if(!t)return{};const s=JSON.parse(t),o=s.match3&&typeof s.match3=="object"?s.match3:null,i=s.settings&&typeof s.settings=="object"?s.settings:null;return{version:Number(s.version||3),parkName:String(s.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(s.level)||1)),xp:Math.max(0,Math.floor(Number(s.xp)||0)),magicStars:Math.max(0,Math.floor(Number(o?.stars??s.magicStars)||0)),unlockedZonesCount:Array.isArray(s.unlockedZones)?s.unlockedZones.length:1,buildingsCount:Array.isArray(s.buildings)?s.buildings.length:0,weatherMode:String(i?.weatherOverride||s.weatherMode||"auto"),atmosphereMode:String(i?.timeOverride||s.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount(),this.cloudSave.init(),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",t=>{const s=t.detail;s&&typeof s=="object"&&this.hpvnBridge.syncState(s)}),window.addEventListener("hpvn:share-floo",t=>{const s=t.detail??{};this.hpvnBridge.shareToFloo({...s,sendToFloo:s.sendToFloo??(async(o,i)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const a=await this.authoritativeClient.host("floo-share",{text:o,...i.image?{image:i.image}:{},...i.tourId?{tourId:i.tourId}:{}});return!!(a&&typeof a=="object"&&a.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",t=>{const s=t.detail;s?.hostUid&&this.authoritativeClient.visit({hostUid:s.hostUid,help:!0,buildingUid:s.buildingUid,kind:s.kind||"water_crop",noteText:s.noteText,helperName:s.helperName,helperEmoji:s.helperEmoji}).catch(()=>{})})),(typeof navigator>"u"||navigator.onLine)&&this.authoritativeClient.read().then(t=>{if(t.wallet&&typeof t.wallet.spendable=="number"&&this.syncWalletBaseline(t.wallet.spendable),typeof t.uid=="string"&&t.uid){const s=this.cloudSave.getUserId(),o=Ms(t.uid);o!==s&&Pi(o).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:t}))}).catch(()=>{}),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,s={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const o=t.saveToStorage.bind(t),i=Math.max(0,s.debounceMs??180),a=n=>{const c=Math.max(0,Math.floor(n));this.syncWalletBaseline(c),this.isApplyingServerWallet=!0;try{const d=t.homeStateWhileVisiting??t.state;!d.sandboxMode&&!d.sandboxTainted&&(d.galleons=c,t.homeStateWhileVisiting&&(t.state.galleons=c),o(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const n=t.homeStateWhileVisiting??t.state;if(n.sandboxMode||n.sandboxTainted||t.isHeadmasterPreview)return;const c=Math.max(0,Math.floor(Number(n.galleons)||0)),d=c-this.lastAuthoritativeWalletBalance;if(d===0)return;const u=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=c;const p=d<0?"debit":"credit";let m=Math.abs(d);const b=p==="credit"?1e3:5e4;try{let g=null;for(;m>0;){const y=Math.min(m,b);m-=y,g=await this.authoritativeClient.settleWallet({direction:p,amount:y,reasonCode:p==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:p==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(n.level)||1))})}g?.wallet&&typeof g.wallet.spendable=="number"&&(a(g.wallet.spendable),s.onSnapshot?.(g))}catch(g){const y=g;if(y?.definitive===!0){const T=Ut(y);s.onToast?.(`🏦 Gringotts HPVN: ${T.text}`,T.icon);const k=y.details?.spendable;typeof k=="number"&&Number.isFinite(k)?a(k):await this.authoritativeClient.read().then(h=>{h.wallet&&typeof h.wallet.spendable=="number"&&a(h.wallet.spendable)}).catch(()=>{a(u)})}else this.lastAuthoritativeWalletBalance=u}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const n=t.homeStateWhileVisiting??t.state;n.sandboxMode||n.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(n.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),i===0?r():this.walletSyncTimer=setTimeout(()=>{r()},i))};return t.saveToStorage=()=>{o(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=o,this.boundSim===t&&(this.boundSim=null)}}}const He=new Xa;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{He.init()},{once:!0}):He.init());const zt={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},vs={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Is(e){const t=e.sim.state.housePoints,s=["Gryffindor","Ravenclaw","Hufflepuff","Slytherin"];let o="Gryffindor",i=-1;for(const a of s){const r=Number(t?.[a]??0);r>i&&(i=r,o=a)}return o}function ot(e,t,s=""){const o=zi(e),i=(t||"🧙").trim().slice(0,2);return o?`<span class="floo-avatar-shell ${s}"><img src="${S(o)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${S(i)}</span></span>`:`<span class="floo-avatar-shell ${s}"><span class="floo-avatar-fallback">${S(i)}</span></span>`}function Fn(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Ft(e){const t=e.sim.ensureNeighborSocial(),s=Is(e),o=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:o,level:e.sim.state.level,house:s,keeperTitle:cn(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function Bs(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function Gn(e,t){if(!t||typeof t!="object")return;const s=t,o=e.sim.ensureNeighborSocial();let i=!1;typeof s.uid=="string"&&s.uid.trim()&&Ms(s.uid);const a=typeof s.garden?.progression?.friendCode=="string"&&s.garden.progression.friendCode.trim()||(s.profile&&typeof s.profile=="object"&&typeof s.profile.friendCode=="string"?String(s.profile.friendCode).trim():"");if(a&&o.playerFriendCode!==a&&(o.playerFriendCode=a,i=!0),s.wallet&&typeof s.wallet.spendable=="number"&&Number.isFinite(s.wallet.spendable)){const n=e.sim.homeStateWhileVisiting??e.sim.state,c=Math.max(0,Math.floor(s.wallet.spendable));if(He.syncWalletBaseline(c),!n.sandboxMode&&!n.sandboxTainted&&!e.sim.isHeadmasterPreview){const d=!!s.receipt,u=Ii(n);(d||u||c>=n.galleons)&&n.galleons!==c&&(n.galleons=c,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=c),i=!0)}}const r=s.profile&&typeof s.profile=="object"?s.profile:null;if(r){const n=typeof r.username=="string"?r.username.trim():"";n&&n!=="Phù Thủy Hang Sóc"&&n!=="Trang Trại Hang Sóc"&&!o.playerDisplayName&&(o.playerDisplayName=n,i=!0);const c=typeof r.avatarUrl=="string"?r.avatarUrl.trim():"";c&&o.playerAvatarUrl!==c&&(o.playerAvatarUrl=c,i=!0)}const l=s.daily&&typeof s.daily=="object"?s.daily:null;if(l&&typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(l.helpsLeft)));const n=Math.max(0,Ie-e.flooHelpsLeft);n>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=n,i=!0)}if(Array.isArray(s.helpers)&&s.helpers.length>0){e.flooHelpersToday=s.helpers.map(c=>({uid:String(c.uid||""),name:String(c.name||"Bạn HPVN"),avatarEmoji:c.avatarEmoji,avatarUrl:c.avatarUrl,at:Number(c.at||0)}));const n=Bi(e.flooHelpersToday,o.lastSeenHelperAt??0);n&&n.textVi&&n.seenAt>(o.lastSeenHelperAt??0)&&(o.lastSeenHelperAt=n.seenAt,i=!0,e.showToast(n.textVi,"🤝"))}if(s.houseCup&&typeof s.houseCup=="object"){const n=s.houseCup,c=n.houses&&typeof n.houses=="object"?n.houses:null;c&&typeof n.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:n.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(c.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(c.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(c.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(c.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(n.memberTodayPoints)||0)),updatedAt:Date.now()},i=!0)}i&&(e.sim.saveToStorage(),e.refreshAll())}async function Mt(e,t=!1){if(e.flooLoading)return;const s=Date.now();if(!t&&e.flooLastLoadedAt>0&&s-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const o=e.sim.ensureNeighborSocial(),i=Is(e),a=o.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;r||Hi(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r&&await He.authoritativeClient.syncProfile({playerName:a,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:o.playerAvatarUrl||"",avatarEmoji:vs[i],house:i,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(d=>Gn(e,d)).catch(()=>{});const l=await He.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(l.helpsLeft)));const d=Math.max(0,Ie-e.flooHelpsLeft);d>(o.dailyGardenHelpsCount??0)&&(o.dailyGardenHelpsCount=d)}const n=Array.isArray(l.visits)?l.visits:[],c=Rt(n,Date.now());e.flooDirectoryRows=c,e.flooQueueRows.length===0&&(e.flooQueueRows=c),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(c,ct())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&Te(e),e.renderVisitorDockBar()}}function ys(e){const t=Ft(e),s=fs(e.gameCanvas,t),o=wn(s,.55),i=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:ct(),image:o||void 0}})),i.rewarded&&e.showToast(i.msg,"🔥"),e.refreshAll()}function Vn(e,t,s){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),s&&(e.focusedNeighborId=s),(e.sim.state.level>=Ke||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Mt(e),Te(e);const i=e.root.querySelector("#neighborDialog");i&&!i.open&&i.showModal(),s&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${s}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function _n(e,t){e.closeHudPopovers();const s=e.root.querySelector("#neighborDialog");s?.open&&s.close(),t.kind==="match3"?e.getMatch3Modal().then(o=>o.openRescue(t)):e.getPuzzleArcadeModal().then(o=>o.openRescue(t))}function Yt(e,t){Bs(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const o=e.sim.enterHonorGardenTour(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),ue(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Ye(e,t,s){const o=String(t||"").trim();if(!o)return;if(o.startsWith("tour_")){Yt(e,o);return}s&&s.length>0?e.flooQueueRows=[...s]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),Bs(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const a=o.startsWith("player_")?o:`player_${o}`,r=o.startsWith("player_")?o.slice(7):o;(async()=>{try{const n=await He.authoritativeClient.visit({hostUid:r});typeof n.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Ie,Math.floor(n.helpsLeft))));const c=n.visit&&typeof n.visit=="object"?n.visit:null;if(c){const d=c.progression&&typeof c.progression=="object"?c.progression:void 0,u=Date.now(),p=Array.isArray(d?.timers)?d.timers.filter(T=>Number(T.readyAt||0)>u).length:0,m=c.decorations&&typeof c.decorations=="object"?c.decorations:void 0,b={uid:String(c.uid||r),friendCode:typeof c.friendCode=="string"?c.friendCode:void 0,username:String(c.username||"Thành Viên HPVN"),parkName:String(c.parkName||"Thung Lũng Phép Thuật"),house:c.house||"Gryffindor",avatarEmoji:typeof c.avatarEmoji=="string"?c.avatarEmoji:void 0,avatarUrl:typeof c.avatarUrl=="string"?c.avatarUrl:void 0,level:Math.max(1,Number(c.level||1)),growing:p,helped:!!c.helped,hostHelpsLeft:typeof c.hostHelpsLeft=="number"?c.hostHelpsLeft:10,fire:c.fire&&typeof c.fire=="object"?c.fire:null,scene:m?.scene},g=e.sim.syncFlooDirectoryMembers([b],ct()),y=c.rawClientSave&&typeof c.rawClientSave=="object"?c.rawClientSave:null;if(g[0]&&y){if(Array.isArray(y.buildings)&&y.buildings.length>0){const T=y.buildings.filter(k=>k&&typeof k.itemId=="string"&&!!ie(k.itemId));T.length>0&&(g[0].valleyBuildings=T)}y.tileOverrides&&typeof y.tileOverrides=="object"&&(g[0].valleyTileOverrides=y.tileOverrides),Array.isArray(y.unlockedZones)&&y.unlockedZones.length>0&&(g[0].valleyUnlockedZones=y.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(a);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),ue(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function Un(e,t){if(t.startsWith("tour_")){Yt(e,t);return}Bs(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const o=e.sim.enterNeighborVisit(t);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),ue(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()}function Qt(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),ue(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const s=new URLSearchParams(window.location.search);if(s.has("visit")||s.has("tour")){s.delete("visit"),s.delete("tour");const o=s.toString();window.history.replaceState(null,"",`${window.location.pathname}${o?`?${o}`:""}${window.location.hash}`)}}e.refreshAll()}function Ya(e){const t=e.sim.ensureNeighborSocial(),s=t.playerOwlHelpRequests.filter(c=>!!c.fulfilledAt).length,o=t.playerMinigameSos?.rescuedAt??0,i=!!t.playerMinigameSos?.claimed,a=`${t.lastSocialResetKey}|${t.friendshipTokens}|${s}|${o}|${i}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(a===e.lastSocialLiveSig)return;e.lastSocialLiveSig=a,jn(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),n=document.activeElement?.id??"";l?.open&&n!=="inpFlooDisplayName"&&Te(e)}function jn(e){const t=e.sim.ensureNeighborSocial(),s=Math.floor(t.friendshipTokens/Xe),o=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,i=t.homeLanternMarks.length,a=s+o+i,l=Math.max(0,yt-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(u=>u.minigameSos&&!u.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(u.id)).length:0,n=e.sim.state.level>=Ke&&(t.dailyGardenHelpsCount??0)<Ie?e.flooDirectoryRows.filter(u=>Tt(u)).length:0,c=e.root.querySelector("#badgeNeighborCount");if(c){const u=a>0?a:l>0?l:n;u>0?(c.textContent=String(u),c.classList.toggle("is-ready-green",a>0),c.classList.remove("hidden")):c.classList.add("hidden")}const d=e.root.querySelector("#badgeManageNeighborCount");d&&(a>0?(d.textContent=String(a),d.classList.remove("hidden")):d.classList.add("hidden"))}function Za(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const s=e.sim.getActiveHonorGardenTour();if(s){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${S(s.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${S(s.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${s.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${S(s.ownerName)} · ${S(zt[s.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const x=e.sim.cycleHonorGardenTour(-1);x.ok&&typeof x.focusGx=="number"&&typeof x.focusGy=="number"&&(e.onCameraJump?.(),ue(e.cam,x.focusGx,x.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const x=e.sim.cycleHonorGardenTour(1);x.ok&&typeof x.focusGx=="number"&&typeof x.focusGy=="number"&&(e.onCameraJump?.(),ue(e.cam,x.focusGx,x.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{ys(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Qt(e)});return}const o=e.sim.getActiveVisitingNeighbor();if(!o){t.classList.add("hidden"),t.innerHTML="";return}const i=e.sim.ensureNeighborSocial(),a=Date.now(),r=Math.min(Ie,Math.max(i.dailyGardenHelpsCount??0,o.helpedViaFlooToday?1:o.helpedMarksToday.length)),l=Math.max(0,Ie-r),n=!!(o.helpedViaFlooToday||o.helpedMarksToday.length>0),c=(o.hostHelpsLeft??10)<=0,d=!!(o.fireUntilMs&&o.fireUntilMs>a),u=!n&&l>0&&!c,p=i.dailyLikedNeighborIds.includes(o.id),m=i.dailyMysteryClaimedIds.includes(o.id),b=o.owlHelpCrates.filter(x=>!x.fulfilledByPlayerToday).length,g=e.sim.canRescueNeighborMinigame(o.id).ok,y=b+(g?1:0),T=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,k=o.remoteUserId||o.id.replace(/^player_/,""),h=T.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${T.slice(0,12).map(x=>{const C=x.uid===k,$=Tt(x,a),M=!!(x.fire&&x.fire.until>a);return`
                <button
                  type="button"
                  class="floo-strip-dot ${C?"is-current":""} ${$?"is-helpable":""} ${M?"is-fire":""}"
                  data-floo-jump="${S(x.uid)}"
                  title="${S(x.username)} (Lv.${x.level})"
                >
                  ${ot(x.avatarUrl,x.avatarEmoji||x.username,"floo-strip-avatar")}
                  ${M?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",L=n?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":c?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${h}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${ot(o.avatarUrl,o.avatarEmoji||o.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${S(o.name)}</strong>
            <span class="visitor-lv-tag">Lv.${o.level}</span>
            ${d?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${Ie}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${i.friendshipTokens}/${Xe}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${T.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${u?"gold-cta":""}" ${u?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${L}
        </button>
        ${d?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${p?"disabled":""} title="Thả tim khen vườn">
          ${p?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${m?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${m?"✓ Quà":"🎁 Quà"}
        </button>
        ${y>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${y})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,Fn(t),t.querySelectorAll("[data-floo-jump]").forEach(x=>{x.addEventListener("click",()=>{const C=x.dataset.flooJump;C&&C!==k&&Ye(e,C,T)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const x=t.querySelector("#btnVisitorFlooHelp");x&&(x.disabled=!0);let C;if(o.remoteUserId)try{const A=Ni(i.selectedPresetNoteId),O=await He.authoritativeClient.visit({hostUid:o.remoteUserId,help:!0,kind:"water_crop",noteText:A.textVi});typeof O.helpsLeft=="number"&&(C=O.helpsLeft,e.flooHelpsLeft=O.helpsLeft)}catch(A){const O=Ut(A);if(O.reason==="already-helped"||O.reason==="daily-help-cap"||O.reason==="host-help-cap"){e.showToast(`${O.icon} ${O.text}`,O.icon),Mt(e,!0),e.refreshAll();return}}const $=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:C});if(!$.ok){e.showToast($.msg,"🤝"),e.refreshAll();return}const M=A=>A.map(O=>O.uid===k?{...O,helped:!0}:O);if(e.flooDirectoryRows=M(e.flooDirectoryRows),e.flooQueueRows=M(e.flooQueueRows),e.refreshAll(),$.helpsLeft>0&&e.flooQueueRows.length>1){const A=os(e.flooQueueRows,k,1);A&&A.uid!==k&&Tt(A)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===o.id&&Ye(e,A.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const x=t.querySelector("#btnVisitorExtinguish");x&&(x.disabled=!0);try{let C=0;if(o.remoteUserId){const M=await He.authoritativeClient.fireOut({hostUid:o.remoteUserId});C=Math.max(0,Math.floor(Number(M?.price||0)))}if(C>0){const M=e.sim.homeStateWhileVisiting??e.sim.state;M.galleons=Math.max(0,M.galleons-C),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=M.galleons)}o.fireUntilMs=0;const $=M=>M.map(A=>A.uid===k?{...A,fire:null}:A);e.flooDirectoryRows=$(e.flooDirectoryRows),e.flooQueueRows=$(e.flooQueueRows),e.showToast(C>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name} (-${C} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${o.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(C){const $=Ut(C);e.showToast(`${$.icon} ${$.text}`,$.icon),x&&(x.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const x=e.sim.likeVisitedNeighborFarm();x.ok||e.showToast(x.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{m||(e.rideCamUid=null,e.onCameraJump?.(),ue(e.cam,o.mysteryGiftGx+.5,o.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{Vn(e,"friends",o.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const x=os(T,k,-1);x&&x.uid!==k&&Ye(e,x.uid,T)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(T.length>1){const C=os(T,k,1);if(C&&C.uid!==k){Ye(e,C.uid,T);return}}const x=e.sim.cycleNextNeighborVisit();x.ok&&typeof x.focusGx=="number"&&typeof x.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),ue(e.cam,x.focusGx,x.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Qt(e)})}function Te(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const s=e.sim.ensureNeighborSocial(),o=e.sim.getActiveVisitingNeighbor(),i=e.sim.getActiveHonorGardenTour(),a=Date.now(),r=Is(e),l=s.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",n=Math.min(Ie,Math.max(0,s.dailyGardenHelpsCount??0)),c=Math.max(0,Ie-n),d=Math.max(0,yt-s.dailyRescuesGivenIds.length),u=Math.max(0,yt-s.dailyRescuesReceivedCount),p=Math.max(0,Dt-s.dailyOwlHelpRequestedCount),m=s.friendshipTokens>=Xe,b=Math.min(100,Math.round(s.friendshipTokens/Xe*100)),g=s.playerMinigameSos&&!s.playerMinigameSos.claimed?s.playerMinigameSos:null,y=e.sim.state.level>=Ke||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,T=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${s.friendshipTokens}/${Xe}</strong>
        ${m?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${c}/${Ie}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${d}/${yt}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${p}/${Dt}</strong></span>
      </div>
    </div>
  `,k=`
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        🖼️ Bưu Thiếp ${s.dailyFlooShareClaimed?"":"(!)"}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        🎁 Rương &amp; SOS ${m||g?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${s.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let h="";if(e.activeNeighborTab==="friends"){const $=[];if(g?.rescuedAt){const z=rs(g.kind);$.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${S(g.rescuerEmoji??"🦉")} ${S(g.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${z.icon} Màn ${g.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(g){const z=rs(g.kind);$.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${z.icon} Màn ${g.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}s.homeLanternMarks.length>0&&$.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${s.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${s.homeLanternMarks.length}🍀)</button>
        </div>
      `);const M=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${ot(s.playerAvatarUrl,vs[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${zt[r]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${S(l)}"
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
            🔥 Rủ Bạn Trên Mạng Floo ${s.dailyFlooShareClaimed?"":"(+10G)"}
          </button>
        </div>
      </section>
    `;let A="";if(y){const z=Rt(e.flooDirectoryRows,a),E=z.filter(B=>Tt(B,a)).length,N=[...e.flooHelpersToday,...s.homeLanternMarks.map(B=>({uid:B.helperId,name:B.helperName,avatarEmoji:B.helperEmoji,avatarUrl:B.helperAvatarUrl,at:B.createdAt}))],D=Array.from(new Map(N.map(B=>[B.uid||B.name,B])).values()),K=D.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${D.slice(0,6).map(B=>ot(B.avatarUrl,B.avatarEmoji||B.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${S(Di(D))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${D.length*15} phút</strong>!
              </div>
            </div>
          `:"",I=z.length>0?`
            <div class="floo-portal-grid" role="list">
              ${z.map(B=>{const V=!!(B.fire&&B.fire.until>a),le=Tt(B,a),te=o?.remoteUserId===B.uid||o?.id===`player_${B.uid}`,oe=V?"🔥 Đang cháy · cần dập!":B.helped?"✓ Đã chăm giúp":B.growing>0?`🌱 ${B.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${V?"is-fire":""} ${le?"is-helpable":""} ${B.helped?"is-helped":""} ${te?"is-visiting":""}"
                      data-floo-portal="${S(B.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${ot(B.avatarUrl,B.avatarEmoji||B.username,"floo-portal-avatar")}
                        ${V?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${B.level}</span>
                      </div>
                      <strong class="floo-portal-name">${S(B.username)}</strong>
                      <span class="floo-portal-park">${S((B.house?vs[B.house]:"")||"🪄")} ${S(B.parkName||"")}</span>
                      <span class="floo-portal-status">${oe}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,_=s.neighbors.filter(B=>B.owlHelpCrates.some(V=>!V.fulfilledByPlayerToday)||!!(B.minigameSos&&!B.minigameSos.rescuedToday)),W=_.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${_.slice(0,6).map(B=>{const V=e.sim.canRescueNeighborMinigame(B.id),le=B.minigameSos,te=le?rs(le.kind):null,oe=!!(le&&(le.rescuedToday||s.dailyRescuesGivenIds.includes(B.id))),re=B.owlHelpCrates.filter(ce=>!ce.fulfilledByPlayerToday).map(ce=>{const be=De(ce.itemId),ge=e.sim.getFarmItemCount(ce.itemId),ee=e.sim.state.sandboxMode||ge>=ce.qty;return`
                          <div class="nb-crate-item">
                            <img src="${be.iconSrc}" alt="${S(be.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${ce.qty} ${S(be.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":ge}/${ce.qty})</span></div>
                              <div class="nb-crate-rew">+${ce.rewardTokens}🍀 • +${ce.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${ee?"gold-cta":""} nb-mini-cta" data-nb-crate="${S(B.id)}|${S(ce.id)}" ${ee?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),fe=le&&te&&!oe?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${te.icon} ${S(te.nameVi)} • <strong>Màn ${le.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${S(B.id)}" ${V.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===B.id?"focused":""}" data-neighbor-card="${S(B.id)}">
                        <div class="nb-card-head">
                          ${ot(B.avatarUrl,B.avatarEmoji||B.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${S(B.name)}</strong>
                              <span class="nb-badge-pill">Lv.${B.level}</span>
                              <span class="nb-badge-pill house">${zt[B.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${S(B.id)}">🔥 Bay tới</button>
                        </div>
                        ${re?`<div class="nb-coop-section"><div class="nb-crate-list">${re}</div></div>`:""}
                        ${fe}
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
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${z.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${K}
        </section>
        ${I}
        ${W}
      `}else{const z=Math.min(100,Math.round(e.sim.state.level/Ke*100));A=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${Ke}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${Ke}</strong> · Khi đạt Cấp ${Ke}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${z}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const O=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${s.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${Ri.map(z=>{const E=i?.id===z.id;return`
              <article class="honor-garden-card ${E?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${S(z.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${S(z.titleVi)}</strong>
                    <span class="honor-garden-owner">${S(z.ownerName)} · Lv.${z.level} · ${zt[z.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${S(z.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${S(z.weather)} · ${S(z.atmosphere)}</span>
                  ${E?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${S(z.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;h=`
      ${$.join("")}
      ${M}
      ${y?`${A}${O}`:`${O}${A}`}
    `}else if(e.activeNeighborTab==="postcard"){const $=Ft(e),M=Sn($);h=`
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🖼️ Bưu Thiếp Thung Lũng &amp; Rủ Bạn Qua Mạng Floo</div>
          <span class="honor-daily-pill">
            ${s.dailyFlooShareClaimed?"✓ Đã nhận quà Bưu Thiếp hôm nay":"🎁 +10G · +1 🍀 · +15 điểm Lễ Hội"}
          </span>
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${S(M)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const $=s.playerOwlHelpRequests.length>0?s.playerOwlHelpRequests.map(M=>{const A=De(M.itemId);return`
                <div class="nb-crate-item ${M.fulfilledAt?"done":""}">
                  <img src="${A.iconSrc}" alt="${S(A.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${M.qty} ${S(A.name)}</div>
                    <div class="nb-crate-rew">${M.fulfilledAt?`✓ ${S(M.helperEmoji??"🦉")} ${S(M.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';h=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${s.friendshipTokens}/${Xe} 🍀)</div>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${b}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug">🔥 +1</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150G</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${s.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${m?"":"disabled"}>
              🎁 Mở Rương (${Xe} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${g?`
                  <div class="nb-alert-banner ${g.rescuedAt?"ready":""}">
                    <span>${g.rescuedAt?`🎉 <strong>${S(g.rescuerEmoji??"🦉")} ${S(g.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${g.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${g.stage}</strong>…`}</span>
                    ${g.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${u}/${yt}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${p}/${Dt}):</div>
            <div class="nb-crate-list">${$}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${Oi.map(M=>{const A=M.id===s.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${M.id}" data-active="${A}" aria-pressed="${A}" class="brass-btn nb-note-btn">
                  ${M.emoji} ${S(M.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else h=`<div class="nb-log-list">${s.activityLog.length>0?s.activityLog.map(M=>{const A=new Date(M.timestamp),O=String(A.getHours()).padStart(2,"0"),z=String(A.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${S(M.icon)}</span>
                  <span class="nb-log-msg">${S(M.textVi)}</span>
                  <span class="nb-log-time">${O}:${z}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${T}
    ${k}
    ${h}
  `,Fn(t);const L=t.querySelector("#flooPostcardCanvas");L&&fs(e.gameCanvas,Ft(e),L),t.querySelectorAll("[data-nbtab]").forEach($=>{$.addEventListener("click",()=>{e.activeNeighborTab=$.dataset.nbtab,Te(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",Te(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{ys(e),Te(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{ys(e),Te(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const $=t.querySelector("#flooPostcardCanvas")??fs(e.gameCanvas,Ft(e)),M=wn($,.72);if(M){const O=document.createElement("a");O.href=M,O.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${M.startsWith("data:image/webp")?"webp":"png"}`,O.click()}const A=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(A.msg,"🖼️"),Te(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",$=>{$.preventDefault();const A=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);A&&(s.playerDisplayName=A,e.sim.saveToStorage(),Mt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${A}"!`,"🔥"),Te(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Mt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const $=Rt(e.flooDirectoryRows,Date.now());$.length>0&&Ye(e,$[0].uid,$)}),t.querySelectorAll("[data-floo-portal]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.flooPortal;if(!M)return;const A=Rt(e.flooDirectoryRows,Date.now());Ye(e,M,A)})}),t.querySelectorAll("[data-honor-tour]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.honorTour;M&&Yt(e,M)})});const C=()=>{const $=e.sim.openFriendshipChest();$.ok||e.showToast($.msg,"🍀"),e.refreshAll(),Te(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",C),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",C),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach($=>{$.addEventListener("click",()=>{const M=e.sim.claimPlayerMinigameSosRescue();M.ok||e.showToast(M.msg,"⚠️"),e.refreshAll(),Te(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const $=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const M of $)e.sim.claimHomeLanternMark(M.id);e.refreshAll(),Te(e)}),t.querySelectorAll("[data-nb-visit]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.nbVisit;M&&Un(e,M)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Qt(e)}),t.querySelectorAll("[data-nb-crate]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.nbCrate??"",[A,O]=M.split("|");if(!A||!O)return;const z=e.sim.fulfillNeighborOwlCrate(A,O);z.ok||e.showToast(z.msg,"🧺"),e.refreshAll(),Te(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.nbRescue;if(!M)return;const A=e.sim.canRescueNeighborMinigame(M);if(!A.ok||!A.neighbor||!A.sos){e.showToast(A.reason??"Không thể giải cứu màn này lúc này!","🦉");return}_n(e,{neighborId:A.neighbor.id,neighborName:A.neighbor.name,neighborEmoji:A.neighbor.avatarEmoji,kind:A.sos.kind,stage:A.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach($=>{$.addEventListener("click",()=>{const M=$.dataset.nbNote;M&&(e.sim.setNeighborPresetNote(M),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),Te(e))})})}function Gt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const o=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;ue(e.cam,t.gx+t.bw*.5+o,t.gy+t.bh*.5+o),e.onCameraJump?.()}function Wn(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const s=Date.now();return e.sim.state.buildings.some(i=>ie(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&s>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const s=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(s)return{el:s,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function Ss(e){const t=e.root.querySelector("#tutorialHudSpotlight"),s=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(c=>c.removeAttribute("data-tutorial-anchor")),!t)return;const o=!!document.querySelector("dialog[open]");if(e.photoModeActive||o||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:i,label:a}=Wn(e);if(!i||i.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=i.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!i.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||i.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const n=6;t.style.setProperty("--spot-left",`${Math.round(r.left-n)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-n)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+n*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+n*2)}px`),t.classList.toggle("pill-below",r.top<110),s&&(s.textContent=a||"👇 Bấm"),t.classList.remove("hidden")}function Qn(e,t){if(typeof t.hidePopover=="function")try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function Kn(e,t){if(typeof t.showPopover=="function")try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function ws(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const s=!!document.querySelector("dialog[open]"),o=e.manageMenuOpen||e.weatherPopoverOpen,i=e.sim.getCurrentTutorialStep();if(e.photoModeActive||s||o||!i){Qn(e,t),Ss(e);return}const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const r=e.sim.getReadyOwlOrdersCount(),l=`${i.index}:${i.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${r}`;if(e.lastRenderedTutorialSig!==l){e.lastRenderedTutorialSig=l;const c=_t.map(d=>`<span class="tutorial-step-dot ${d.index<i.index?"done":d.index===i.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${S(i.title)}</h2>
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
              aria-valuemax="${_t.length}"
              aria-valuenow="${i.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${c}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${S(i.speakerName)}
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${S(i.title)}</h2>
            <div class="tutorial-hint-strip">${S(i.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${S(i.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${d}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${S(u)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),ws(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),ws(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{Xn(e,i.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{i.id==="earn_magic_star"?e.openPuzzleArcadeDialog():i.id==="build_and_owl_order"&&(r>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}Kn(e,t);const n=`${i.index}:${i.id}`;e.lastFocusedTutorialStepKey!==n&&(e.lastFocusedTutorialStepKey=n,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),Ss(e)}function Xn(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())Gt(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const o=ie("farmland_plot");o&&(e.selectedCatalogItem=o,e.refreshAll())}return}if(t==="sow_and_merge_plot"){Gt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){Gt(e);const s=Date.now();e.sim.state.buildings.some(i=>ie(i.itemId)?.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&s>=i.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Ja{constructor(t,s,o,i,a){w(this,"sim");w(this,"cam");w(this,"gameCanvas");w(this,"activeCategory",null);w(this,"selectedCatalogItem",null);w(this,"rotation",0);w(this,"bulldozerActive",!1);w(this,"moveModeActive",!1);w(this,"movingBuildingUid",null);w(this,"pincerActive",!1);w(this,"pincerPicked",null);w(this,"seedTrayOpen",!1);w(this,"seedFilterMode","all");w(this,"activeSeedCropId",null);w(this,"pendingSowPlotUid",null);w(this,"pastureTrayOpen",!1);w(this,"activePastureAnimalId",null);w(this,"pendingStockPastureUid",null);w(this,"rideCamUid",null);w(this,"rideCamSpeedText","");w(this,"pendingTouchTile",null);w(this,"onTouchConfirmPlace",null);w(this,"onTouchCancelPlace",null);w(this,"onCameraJump",null);w(this,"photoModeActive",!1);w(this,"inspectSelection",null);w(this,"minimapCanvas");w(this,"questCollapsed",!1);w(this,"minimapCollapsed",!1);w(this,"manageMenuOpen",!1);w(this,"weatherPopoverOpen",!1);w(this,"mapToolsExpanded",!1);w(this,"buildSheetOpen",!1);w(this,"minimapHudVisible",!1);w(this,"hudRolledUp",!1);w(this,"inspectorCollapsed",!1);w(this,"lastInspectedKey","");w(this,"displayedGalleons",-1);w(this,"galleonRollRaf",0);w(this,"activeWorkshopTab","barn");w(this,"activeQuestTab","orders");w(this,"activeAlbumTab","cup");w(this,"selectedOwlOrderId",null);w(this,"lastWsBrewId",null);w(this,"activeSuitcaseTab","care");w(this,"selectedSuitcaseHabitatUid",null);w(this,"useStarlightForIncubation",!0);w(this,"lastSuitcaseIncReady",!1);w(this,"lastSuitcaseExpReady",!1);w(this,"activeNeighborTab","friends");w(this,"focusedNeighborId",null);w(this,"flooDirectoryRows",[]);w(this,"flooQueueRows",[]);w(this,"flooHelpsLeft",null);w(this,"flooLoading",!1);w(this,"flooLastLoadedAt",0);w(this,"flooAutoAdvanceTimer",0);w(this,"flooHelpersToday",[]);w(this,"lastSocialLiveSig","");w(this,"tutorialMinimized",!1);w(this,"lastRenderedTutorialSig","");w(this,"lastFocusedTutorialStepKey","");w(this,"ribbonBannerTimer",0);w(this,"pendingBulldozeWarning",null);w(this,"drawerEdgeObserver",null);w(this,"dialogOpenObserver",null);w(this,"match3Modal",null);w(this,"puzzleArcadeModal",null);w(this,"match3ModalPromise",null);w(this,"puzzleArcadeModalPromise",null);w(this,"seedQuizModal");w(this,"leaderboardModal");w(this,"root");w(this,"sprites");this.root=t,this.sim=s,this.cam=o,this.gameCanvas=i,this.sprites=a,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.tutorialMinimized=!!this.sim.state.tutorial?.minimized,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||St(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new ya(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{this.activeSeedCropId=r;const n=Se[r];if(l){const c=this.sim.state.buildings.find(d=>d.uid===l);if(c&&ie(c.itemId)?.isFarmlandPlot&&!c.cropId){const d=this.sim.plantCropOnPlot(c.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(d.msg,d.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${n.emoji} ${n.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,n.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new va(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),n=this.root.querySelector("#puzzleArcadeDialog"),c=this.root.querySelector("#seedQuizDialog");r==="match3"?(n?.close(),c?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),n?.close(),this.openSeedQuizDialog()):(l?.close(),c?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireBulldozeConfirmDialog(),this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const n=this.sim.state.buildings.find(u=>this.inspectSelection?.kind==="building"&&u.uid===this.inspectSelection.uid),c=n?ie(n.itemId):void 0,d=Date.now();n&&(d<n.constructEndsAt||n.workshopQueue&&n.workshopQueue.length>0||n.cropId&&n.cropReadyAt&&d<n.cropReadyAt+1200||n.pastureAnimalId&&n.pastureReadyAt&&d<n.pastureReadyAt+1200||c&&c.cycleSec>0&&c.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return Sa(this)}wireBulldozeConfirmDialog(){const t=this.root.querySelector("#bulldozeConfirmDialog");t&&(t.addEventListener("close",()=>{const s=t.returnValue;t.returnValue="";const o=this.pendingBulldozeWarning;this.pendingBulldozeWarning=null,s==="confirm"&&o&&(this.sim.removeAtTile(o.gx,o.gy,!0),this.refreshAll())}),this.sim.onRequestBulldozeConfirm=s=>{this.openBulldozeConfirmDialog(s)})}openBulldozeConfirmDialog(t){const s=this.root.querySelector("#bulldozeConfirmDialog"),o=this.root.querySelector("#bulldozeConfirmBody");if(!s||!o){this.sim.removeAtTile(t.gx,t.gy,!0);return}this.pendingBulldozeWarning=t,o.innerHTML=`
      <div class="quest-card-mini bulldoze-confirm-card">
        <div class="bulldoze-confirm-lead">
          <strong>${S(t.buildingName)}</strong> hiện có:
        </div>
        <div class="bulldoze-confirm-hazard">
          🌾 ${S(t.hazardSummaryVi)}
        </div>
        <div class="bulldoze-confirm-note">
          Nếu phá dỡ ngay bây giờ, phần vụ mùa / sản vật / mẻ đang chạy trên ô này sẽ bị mất vĩnh viễn.
        </div>
        <div class="bulldoze-confirm-refund">
          💰 Khi xóa: <strong>${S(t.refundSummaryVi)}</strong>
        </div>
      </div>
    `,s.returnValue="",s.open||s.showModal()}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),s=this.root.querySelector("#floatingBannerGrip");if(!t||!s)return;s.classList.remove("hidden");const o=(n,c)=>{t.classList.add("is-floating-dragged");const d=Math.max(0,window.innerWidth-t.offsetWidth),u=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(n,d))}px`,t.style.top=`${Math.max(0,Math.min(c,u))}px`};let i=0,a=0,r=0,l=0;s.addEventListener("pointerdown",n=>{if(n.button!==0)return;const c=t.getBoundingClientRect();i=n.clientX-c.left,a=n.clientY-c.top,r=n.clientX,l=n.clientY,s.setPointerCapture(n.pointerId)}),s.addEventListener("pointermove",n=>{s.hasPointerCapture(n.pointerId)&&(Math.hypot(n.clientX-r,n.clientY-l)>=4&&s.classList.add("dragging"),o(n.clientX-i,n.clientY-a))}),s.addEventListener("lostpointercapture",()=>{s.classList.remove("dragging")}),s.addEventListener("keydown",n=>{let d=0,u=0;if(n.key==="ArrowLeft")d=-15;else if(n.key==="ArrowRight")d=15;else if(n.key==="ArrowUp")u=-15;else if(n.key==="ArrowDown")u=15;else return;n.preventDefault();const p=t.getBoundingClientRect();o(p.left+d,p.top+u)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const n=t.getBoundingClientRect();o(n.left,n.top)}})}installDialogLightDismissFallback(){const t=()=>{const s=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(s)};for(const s of Array.from(this.root.querySelectorAll("dialog")))s.addEventListener("close",()=>{s.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",s=>{const o=s.target;if(o&&typeof o.matches=="function"&&o.matches(".aaa-codex-scroll")){const i=!!s.skipped;o.dataset.cvSkipped=i?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const s=new IntersectionObserver(o=>{for(const i of o)i.target.dataset.cvSkipped=i.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const o of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))s.observe(o)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const s=(o,i)=>{const a=i.getBoundingClientRect();return o.clientX<a.left||o.clientX>a.right||o.clientY<a.top||o.clientY>a.bottom};for(const o of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let i=!1;o.addEventListener("pointerdown",a=>{i=s(a,o)}),o.addEventListener("pointerup",a=>{i&&s(a,o)&&o.close()})}}}wireRangeProgressFallback(t){const s=()=>{const o=Number(t.min||0),i=Number(t.max||100),a=Number(t.value||0),r=Math.round((a-o)/Math.max(1,i-o)*100);t.style.setProperty("--progress",`${r}%`)};s(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",s)}togglePhotoMode(t){return xa(this,t)}openNeighborDialog(t,s){return Vn(this,t,s)}openHarvestFeastDialog(){return Da(this)}refreshHarvestFeastBadges(){return Ra(this)}showRibbonUnveilBanner(t){return Oa(this,t)}renderHarvestFeastDialog(){return On(this)}openMinigameRescue(t){return _n(this,t)}enterVisitFromHud(t){return Un(this,t)}enterHonorTourFromHud(t){return Yt(this,t)}enterFlooMemberVisitFromHud(t,s){return Ye(this,t,s)}refreshFlooDirectoryFromHud(t){return Mt(this,t)}applyAuthoritativeSnapshot(t){Gn(this,t)}exitVisitFromHud(){return Qt(this)}isBuildingFocusMode(){return An(this)}toggleHudRollup(t){return $a(this,t)}syncHudFocusVisibility(){return Xt(this)}openWorkshopDialog(t){return Hs(this,t)}openSuitcaseDialog(t,s){return Fa(this,t,s)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=St(async()=>{const{Match3ModalController:t}=await import("./match3Modal-Bh2a0z2t.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(s,o)=>this.showToast(s,o),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=s=>this.openPuzzleArcadeDialog(s),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=St(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-C-SNPI7s.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([3,1,2])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(s,o)=>this.showToast(s,o),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=s=>this.openLeaderboardDialog(s),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,s){this.closeHudPopovers();const o=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(o,s)}openMatch3Dialog(t,s=!1){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(o=>o.open(t,s))}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(s=>s.open(t))}openSeedQuizDialog(t,s,o,i,a,r){this.closeHudPopovers(),s||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,s,o,i,a,r)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return Je(this)}collapseBuildDock(){return et(this)}hasOpenFloatingTray(){return Ta(this)}hideOpenFloatingTrays(){return ka(this)}positionFloatingPopover(t,s){return As(this,t,s)}toggleManagePopover(t){return Ca(this,t)}toggleWeatherPopover(t){return Ma(this,t)}renderWeatherPopover(){return Es(this)}animateGalleonsTo(t){return En(this,t)}spawnFlyReward(t,s,o,i){return La(this,t,s,o,i)}bindEvents(){return wa(this)}showToast(t,s="🦉"){return Ue(this,t,s)}showOfflineModal(t){return Ea(this,t)}refreshFloatingBanner(){return qs(this)}openSeedTray(t,s){return Nn(this,t,s)}closeSeedTray(){return rt(this)}toggleSeedTray(){return Ha(this)}openPastureTray(t,s){return Dn(this,t,s)}closePastureTray(){return Ct(this)}togglePastureTray(){return Ia(this)}renderSeedTray(){return Rn(this)}renderPastureTray(){return Ba(this)}refreshTouchConfirmBar(){return Ps(this)}refreshAll(){return jt(this)}refreshHeaderClock(){return Wt(this)}refreshHeader(){return qn(this)}syncProgressiveHudVisibility(){return Pn(this)}refreshQuestTracker(){return Hn(this)}refreshDock(){return In(this)}renderStaffDrawer(t){return Bn(this,t)}syncContextualMapToolsBar(){return Pa(this)}renderInspector(){return pe(this)}renderFinanceDialog(){return za(this)}renderAlbumDialog(){return Qe(this)}renderQuestDialog(){return ze(this)}renderRoadmapDialog(){return zn(this)}updateWorkshopLiveTimers(){return Na(this)}renderWorkshopDialog(){return Ee(this)}renderSettingsDialog(){return Ae(this)}refreshSuitcaseBadge(){return Ga(this)}updateSuitcaseLiveTimers(){return Va(this)}renderSuitcaseDialog(){return $e(this)}syncLiveNeighborSocialUI(){return Ya(this)}refreshNeighborBadges(){return jn(this)}renderVisitorDockBar(){return Za(this)}renderNeighborDialog(){return Te(this)}panCameraToTutorialTarget(){return Gt(this)}resolveTutorialHudTarget(){return Wn(this)}updateTutorialHudSpotlight(){return Ss(this)}hideTutorialPopover(t){return Qn(this,t)}showTutorialPopover(t){return Kn(this,t)}renderTutorialCoach(){return ws(this)}handleTutorialPrimaryAction(t){return Xn(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Ht.colorblindMode,fontScale:t?.fontScale??Ht.fontScale,highContrast:t?.highContrast??Ht.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Ht.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();Wi(t),this.sim.audio?.ceiling&&Qi(t,this.sim.audio)}playStoryCutscene(t){const s=bn.find(i=>i.id===t);if(!s)return;if(this.sim.state.level<s.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${s.unlockLevel} để mở khoá ${s.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${s.titleVi}`,"🎬");let o=120;s.keyframes.forEach((i,a)=>{window.setTimeout(()=>{ue(this.cam,i.cameraFocusGx,i.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${i.captionVi}`,a===s.keyframes.length-1?"✨":"🕯️"),s.chapterNumber===3&&a===s.keyframes.length-1&&this.sim.launchFireworksShow(10)},o),o+=i.durationMs})}}let _e=null,lt=null,an=!1;function on(){return typeof navigator<"u"&&typeof navigator.install=="function"}function xs(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,s=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||s}function $s(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function Yn(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const o=navigator,i=typeof o.install=="function";if(!i&&!_e){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(i&&o.install)await o.install(),t.classList.add("hidden");else if(_e){const a=_e;_e=null,await a.prompt(),((await a.userChoice).outcome==="accepted"||!_e)&&t.classList.add("hidden")}}catch(a){!(a instanceof DOMException&&a.name==="AbortError")&&!_e&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function Ts(){!xs()||$s()||(lt||(lt=Yn()),lt.classList.remove("hidden"))}function Zn(){lt&&lt.classList.add("hidden")}function eo(){an||typeof window>"u"||(an=!0,!$s()&&(lt=Yn(),on()&&xs()&&Ts(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),_e=e,!on()&&xs()&&!$s()&&Ts()}),window.addEventListener("appinstalled",()=>{Zn(),_e=null})))}const to={init:eo,show:Ts,hide:Zn},so="burrow_rollback_backup_v12";function rn(e,t){const s=JSON.stringify({backedUpAt:Date.now(),state:e}),o=typeof localStorage<"u"?localStorage:void 0;try{o?.setItem(so,s)}catch{}return s}class no{constructor(){w(this,"unhandledErrors",0);w(this,"fpsSamples",[]);w(this,"assetLoadLatencyMs",0);w(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const s=Math.max(1,Math.min(240,t));this.fpsSamples.push(s),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,s={},o=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:s,queuedAt:o})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const s=[...this.offlineQueue];return t(s)?(this.offlineQueue=[],s.length):0}getHealthReport(){const t=this.fpsSamples.length;let s=60,o=60;if(t>0){const i=this.fpsSamples.reduce((l,n)=>l+n,0);s=Number((i/t).toFixed(1));const a=[...this.fpsSamples].sort((l,n)=>l-n),r=Math.max(0,Math.floor((t-1)*.05));o=Number(a[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:s,p5LowFps:o,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function ks(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function ln(e){return ks(e)||e.category==="decor"}async function io(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const s=document.createElement("canvas");s.id="gameCanvas",s.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(s);const o=new Fi,i=new Ui;await i.loadAll();const a=new Gi(o),r={x:0,y:0,zoom:.82,viewRot:0};ue(r,18,24.5);const l=new ji(s,i),n=new Ja(e,a,r,s,i);to.init(),us.init(a);const c=new URLSearchParams(window.location.search),d=!!(c.get("preview")==="100"||c.get("visit")||c.get("tour")||c.get("zoom")||c.get("cx")||c.get("cy")||c.get("ridecam")==="1");let u=null;if(n.onCameraJump=()=>{u=null},!d&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const f=r.x,v=r.y,q=r.zoom;ue(r,17.5,24),r.zoom=.76,u={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:f,toY:v,toZoom:q}}const p=Be(window.location.hostname);if(c.get("preview")==="100"&&p){a.toggleHeadmasterPreview(100),!c.get("tutorial")&&a.isTutorialActive()&&a.skipTutorial();const f=Number(c.get("zoom")||.62);r.zoom=Number.isFinite(f)&&f>=.32&&f<=2.15?f:.62;const v=Number(c.get("cx")),q=Number(c.get("cy")),F=Number.isFinite(v)&&c.get("cx")?v:24.5,j=Number.isFinite(q)&&c.get("cy")?q:23;ue(r,F,j)}const m=c.get("tutorial");m==="1"||m==="reset"?(a.restartTutorial(),n.tutorialMinimized=!1):(m==="0"||m==="off")&&a.isTutorialActive()&&a.skipTutorial();const b=c.get("tstep");if(b!==null&&p){const f=Math.max(0,Math.min(_t.length-1,Number(b)||0)),v=a.ensureTutorialState();v.active=!0,delete v.completedAt,v.skipped=!1,v.stepIndex=f,v.stepId=_t[f].id,v.pastureHarvestedInStep3=!1}const g=Number(c.get("rot")||0);if(g>=1&&g<=3)for(let f=0;f<g;f++)ft(r,1);c.get("cutaway")==="1"&&(a.state.settings.cutawayMode=!0);const y=c.get("time");(y==="night"||y==="day"||y==="dusk"||y==="dawn")&&(a.state.settings.timeOverride=y);const T=c.get("weather");if((T==="auto"||T==="clear"||T==="cloudy"||T==="rain"||T==="storm"||T==="snow"||T==="fog"||T==="fireflies")&&(a.state.settings.weatherOverride=T),c.get("zoom")&&c.get("preview")!=="100"){const f=Number(c.get("zoom"));Number.isFinite(f)&&f>=.32&&f<=2.15&&(r.zoom=f)}if((c.get("cx")||c.get("cy"))&&c.get("preview")!=="100"){const f=Number(c.get("cx")),v=Number(c.get("cy")),q=Number.isFinite(f)&&c.get("cx")?f:18,F=Number.isFinite(v)&&c.get("cy")?v:24.5;ue(r,q,F)}const k=c.get("heatmap");if(k&&(a.heatmapMode=k),c.get("fireworks")==="1"&&a.launchFireworksShow(12),c.get("ridecam")==="1"){const f=a.state.buildings.find(v=>ie(v.itemId)?.isCustomCoasterStation);f&&(n.rideCamUid=f.uid)}const h=c.get("dialog");if(h==="album")document.getElementById("btnOpenAlbum")?.click();else if(h==="finance")document.getElementById("btnOpenFinance")?.click();else if(h==="orders"||h==="quests")document.getElementById("btnOpenQuests")?.click();else if(h==="barn")n.openWorkshopDialog("barn");else if(h==="seeds"){const f=c.get("sfilter");(f==="flowers"||f==="crops"||f==="all")&&(n.seedFilterMode=f),n.openSeedTray()}else if(h==="pasture")n.openPastureTray();else if(h==="seedquiz"){const f=c.get("crop")??void 0,v=c.get("lang")??void 0,q=c.get("tier")??void 0,F=c.get("qformat")??void 0,j=c.get("sqtab"),de=j==="codex"||j==="practice"?j:void 0;n.openSeedQuizDialog(f,null,v,q,F,de)}else if(h==="bakery"){const f=a.state.buildings.find(v=>v.itemId==="molly_apple_bakery");f&&(n.inspectSelection={kind:"building",uid:f.uid}),n.openWorkshopDialog("brew")}else if(h==="workshop"){const f=c.get("tab")??"barn";n.openWorkshopDialog(f)}else if(h==="suitcase"){const f=c.get("tab")??"care";n.openSuitcaseDialog(f)}else if(h==="match3"){const f=Number(c.get("m3level")||0),v=p?777:Math.min(777,(a.state.match3.maxClearedLevel??0)+1),q=Number.isFinite(f)&&f>=1?Math.min(v,Math.floor(f)):void 0,F=!!(p&&q&&q>(a.state.match3.maxClearedLevel??0)+1);n.openMatch3Dialog(q,F)}else if(h==="puzzle"||h==="caro"||h==="sudoku"||h==="chess"||h==="blocks"||h==="pikachu"||h==="onet"){const f=h==="puzzle"?c.get("pmode"):h,v=f==="pikachu"||f==="onet"?"blocks":f,q=v==="caro"||v==="sudoku"||v==="chess"||v==="blocks"?v:void 0;n.openPuzzleArcadeDialog(q)}else if(h==="neighbors"||h==="friends")n.openNeighborDialog();else if(h==="feast")n.openHarvestFeastDialog();else if(h==="leaderboard"){const f=c.get("lbgame"),v=f==="match3"||f==="caro"||f==="sudoku"||f==="chess"||f==="blocks"||f==="seedquiz"?f:void 0,q=c.get("lbscope"),F=q==="valley"||q==="friends"||q==="personal"?q:void 0;n.openLeaderboardDialog(v,F)}else if(!c.get("tour")&&!c.get("visit")&&!a.isHeadmasterPreview)try{const f=localStorage.getItem(ls);if(f){const v=JSON.parse(f),q=Date.now()-Number(v.savedAt||0),F=a.state.puzzleArcade;q>=0&&q<=12*3600*1e3?v.dialog==="puzzleArcade"&&v.mode==="sudoku"&&F.sudokuSession?.stage===F.sudokuStage?n.openPuzzleArcadeDialog("sudoku"):v.dialog==="puzzleArcade"&&v.mode==="caro"&&F.caroSession?.stage===F.caroStage?n.openPuzzleArcadeDialog("caro"):v.dialog==="puzzleArcade"&&v.mode==="chess"&&F.chessSession?.stage===F.chessStage?n.openPuzzleArcadeDialog("chess"):v.dialog==="puzzleArcade"&&v.mode==="blocks"&&F.onetSession?.stage===F.blockStage?n.openPuzzleArcadeDialog("blocks"):v.dialog==="match3"&&a.state.match3.activeSession?.levelId===a.state.match3.currentLevel?n.openMatch3Dialog():localStorage.removeItem(ls):localStorage.removeItem(ls)}}catch{}const L={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},x=f=>{const v=String(f||"").trim();if(!v){n.exitVisitFromHud();return}const q=L[v]||(v.startsWith("tour_")?v:"");q?n.enterHonorTourFromHud(q):v.startsWith("player_")||a.ensureNeighborSocial().neighbors.some(F=>F.id===v)?n.enterVisitFromHud(v):n.enterFlooMemberVisitFromHud(v)},C=c.get("tour")||c.get("visit");C&&x(C);const $=["dialog","m3level","pmode","lbgame","lbscope","sqtab","crop","lang","tier","qformat","sfilter","tab","fireworks","tutorial","tstep"];if($.some(f=>c.has(f))){const f=new URLSearchParams(c);for(const F of $)f.delete(F);const v=f.toString(),q=`${window.location.pathname}${v?`?${v}`:""}${window.location.hash}`;window.history.replaceState(null,"",q)}a.isTutorialActive()&&!d&&n.panCameraToTutorialTarget(),He.bindSimulationGringottsWallet(a,{onSnapshot:f=>n.applyAuthoritativeSnapshot(f),onToast:(f,v)=>n.showToast(f,v??"🏦")}),He.authoritativeClient.snapshot&&n.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),n.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",f=>{n.applyAuthoritativeSnapshot(f.detail)}),window.addEventListener("hpvn:toast",f=>{const v=f.detail;v?.text&&n.showToast(String(v.text),"🔥")}),window.addEventListener("hpvn:tour-garden",f=>{const v=f.detail;x(String(v?.tourId??""))}),window.addEventListener("gamesave:updated",f=>{if(a.isHeadmasterPreview||a.isVisitingNeighbor)return;const v=f.detail,q=typeof v?.saveJson=="string"&&v.saveJson||(typeof localStorage<"u"?localStorage.getItem(hn):null);q&&(rn(a.state),a.importSaveJson(q)&&(He.authoritativeClient.snapshot&&n.applyAuthoritativeSnapshot(He.authoritativeClient.snapshot),n.match3Modal?.resetSession(),n.puzzleArcadeModal?.resetSession(),n.refreshAll(),us.refresh(),n.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️")))}),window.addEventListener("hpvn:atmosphere",f=>{if(a.isVisitingNeighbor)return;const v=f.detail?.mode,q=v==="auto"?"realtime":v;(q==="realtime"||q==="dawn"||q==="day"||q==="dusk"||q==="night")&&(a.state.settings.timeOverride=q,a.saveToStorage(),n.refreshAll())}),window.addEventListener("hpvn:weather",f=>{if(a.isVisitingNeighbor)return;const v=f.detail?.mode;(v==="auto"||v==="clear"||v==="cloudy"||v==="rain"||v==="storm"||v==="snow"||v==="fog"||v==="fireflies")&&(a.state.settings.weatherOverride=v,a.saveToStorage(),n.refreshAll())}),a.onTutorialStepChanged=()=>{n.panCameraToTutorialTarget()},a.onUiChange=()=>{n.refreshAll(),us.refresh()},a.onToast=(f,v)=>{n.showToast(f,v),f.includes("Đạt Cấp")||f.includes("lên cấp")||f.includes("Lên Cấp")?Bt("levelup"):Bt("light"),yn(f)},a.onBuildingTactile=f=>l.triggerSquash(f),a.onBuildingCompleted=f=>{l.triggerCompletionPop(f),l.triggerSquash(f)},a.onRibbonUnveiled=f=>{const v=Xs(f.gx,f.gy,r,s.clientWidth,s.clientHeight,36);l.triggerRibbonUnveilPop(f.uid,v.sx,v.sy),n.showRibbonUnveilBanner(f),Bt("levelup")},a.onRewardFly=(f,v,q,F)=>{if(typeof q=="number"&&typeof F=="number"){const j=Xs(q,F,r,s.clientWidth,s.clientHeight,32);n.spawnFlyReward(f,v,j.sx,j.sy)}else n.spawnFlyReward(f,v)},a.onLevelUp=f=>{Bt("levelup");const v=bi(f),q=v.unlockedItemIds.map(j=>ie(j)?.name).filter(Boolean).slice(0,2).join(", "),F=q?` — Mở bản vẽ mới: ${q}!`:v.milestoneNote?` — ${v.milestoneNote}`:"";n.showToast(`🎉 Đạt Cấp Giải Đố ${f}! (+${v.rewardGalleons}🪙)${F}`,"🌟"),n.refreshAll()};const M=a.processOfflineProgress();M&&n.showOfflineModal(M);const A=f=>{const v=a.getActiveVisitingNeighbor();if(!v?.remoteUserId)return;const q=v.helpedMarksToday[v.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:v.remoteUserId,buildingUid:f,kind:q?.kind||"water_crop",noteText:q?.noteText||"Chúc vườn phép thuật bội thu!",helperName:a.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let O=null,z=!1,E=!1,N=!1,D=!1,K=!1,I=0,_=0,W=0,B=0,V=0,le=0;const te=(f,v,q,F)=>{const j=n.activeSeedCropId;if(!j)return!1;let de=a.grid[v]?.[f]?.buildingUid??null;if(!de)for(let R=l.hotspots.length-1;R>=0;R--){const Z=l.hotspots[R];if(Z.kind==="building"&&Math.hypot(q-Z.sx,F-Z.sy)<=Z.radius){de=Z.id;break}}if(!de)return!1;const G=a.state.buildings.find(R=>R.uid===de);if(!G||G.cropId||Date.now()<G.constructEndsAt||!ie(G.itemId)?.isFarmlandPlot)return!1;const me=a.plantCropOnPlot(G.uid,j);if(!me.ok){if(me.needSeedAcquire)return D=!1,z=!1,n.seedTrayOpen=!1,n.inspectSelection=null,n.refreshAll(),n.openSeedQuizDialog(j,G.uid),!1;const R=Date.now();return R-I>1200&&(I=R,n.showToast(me.msg,"🪙")),!1}return n.seedTrayOpen&&(n.seedTrayOpen=!1,n.renderSeedTray(),n.refreshFloatingBanner()),!0},oe=(f,v,q,F)=>{const j=n.activePastureAnimalId;if(!j)return!1;let de=a.grid[v]?.[f]?.buildingUid??null;if(!de)for(let R=l.hotspots.length-1;R>=0;R--){const Z=l.hotspots[R];if(Z.kind==="building"&&Math.hypot(q-Z.sx,F-Z.sy)<=Z.radius){de=Z.id;break}}if(!de)return!1;const G=a.state.buildings.find(R=>R.uid===de);if(!G||G.pastureAnimalId||Date.now()<G.constructEndsAt||!ie(G.itemId)?.isAnimalPasturePlot)return!1;const me=a.stockAnimalOnPasture(G.uid,j);if(!me.ok){const R=Date.now();return R-_>1200&&(_=R,n.showToast(me.msg,"🪙")),!1}return n.pastureTrayOpen&&(n.pastureTrayOpen=!1,n.renderPastureTray(),n.refreshFloatingBanner()),!0},re=new Map;let fe=0,ce=!1,be=null;const ge=()=>{be&&(window.clearTimeout(be.timer),be=null)};n.onTouchConfirmPlace=()=>{if(!n.pendingTouchTile)return;const{gx:f,gy:v}=n.pendingTouchTile;if(n.moveModeActive&&n.movingBuildingUid){const q=a.moveBuilding(n.movingBuildingUid,f,v,n.rotation);if(!q.ok){n.showToast(q.reason??"Không thể đặt tại ô này!","⚠️");return}n.movingBuildingUid=null,n.moveModeActive=!1,n.pendingTouchTile=null,n.refreshAll();return}if(n.selectedCatalogItem){const q=n.selectedCatalogItem,F=a.canPlaceItem(q,f,v,n.rotation);if(!F.ok){n.showToast(F.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(q,f,v,n.rotation),n.pendingTouchTile=null,ln(q)||(n.selectedCatalogItem=null),n.refreshAll()}},n.onTouchCancelPlace=()=>{O=null};const ee=new Set;window.addEventListener("keydown",f=>{if(document.querySelector("dialog[open]")){ee.clear();return}f.target instanceof HTMLInputElement||f.target instanceof HTMLTextAreaElement||f.target instanceof HTMLSelectElement||f.target instanceof HTMLElement&&f.target.classList.contains("drag-handle")||ee.add(f.key.toLowerCase())}),window.addEventListener("keyup",f=>{ee.delete(f.key.toLowerCase())}),window.addEventListener("blur",()=>{ee.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&ee.clear()}),s.addEventListener("pointermove",f=>{re.has(f.pointerId)&&re.set(f.pointerId,{x:f.clientX,y:f.clientY});const v=s.getBoundingClientRect();if(re.size>=2){ge(),N=!1,ce=!0;const ne=Array.from(re.values()),me=Math.hypot(ne[1].x-ne[0].x,ne[1].y-ne[0].y),R=(ne[0].x+ne[1].x)*.5-v.left,Z=(ne[0].y+ne[1].y)*.5-v.top;if(fe>8&&me>8){const se=(R-v.width*.5)/r.zoom+r.x,H=(Z-v.height*.5)/r.zoom+r.y,J=me/fe;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*J)),r.x=se-(R-v.width*.5)/r.zoom,r.y=H-(Z-v.height*.5)/r.zoom}fe=me;return}const q=f.clientX-v.left,F=f.clientY-v.top;if(!a.isVisitingNeighbor&&!E&&!n.movingBuildingUid&&!n.pincerActive)for(const ne of l.hotspots)ne.kind==="bubble"&&Math.hypot(q-ne.sx,F-ne.sy)<=ne.radius&&a.harvestBuildingBubble(ne.id);const j=cs(q,F,r,v.width,v.height,a.grid);if(n.pendingTouchTile||(O={gx:j.gx,gy:j.gy}),!z)return;if(be&&re.size===1&&Math.hypot(f.clientX-W,f.clientY-B)>8){const ne=be;ge(),N=!0,a.placeItem(ne.item,ne.gx,ne.gy,ne.rot)}if(N&&n.selectedCatalogItem){a.placeItem(n.selectedCatalogItem,j.gx,j.gy,n.rotation);return}if(D&&n.activeSeedCropId){te(j.gx,j.gy,q,F);return}if(K&&n.activePastureAnimalId){oe(j.gx,j.gy,q,F);return}const de=f.clientX-W,G=f.clientY-B;Math.hypot(de,G)>5&&(E=!0,n.rideCamUid=null),E&&(u=null,r.x=V-de/r.zoom,r.y=le-G/r.zoom)}),s.addEventListener("pointerdown",f=>{if(re.set(f.pointerId,{x:f.clientX,y:f.clientY}),re.size>=2){ge();const G=Array.from(re.values());fe=Math.hypot(G[1].x-G[0].x,G[1].y-G[0].y),ce=!0,N=!1;return}if(f.button!==0&&f.button!==2)return;const v=s.getBoundingClientRect(),q=f.clientX-v.left,F=f.clientY-v.top,j=cs(q,F,r,v.width,v.height,a.grid);n.pendingTouchTile||(O={gx:j.gx,gy:j.gy}),z=!0,E=!1,W=f.clientX,B=f.clientY,V=r.x,le=r.y;const de=n.selectedCatalogItem;if(f.button===0&&de&&ks(de)&&!n.hasOpenFloatingTray()){if(f.pointerType==="touch"){ge(),N=!1;const G=n.rotation;be={item:de,gx:j.gx,gy:j.gy,rot:G,timer:window.setTimeout(()=>{be=null,re.size===1&&!ce&&z&&(N=!0,a.placeItem(de,j.gx,j.gy,G))},75)}}else N=!0,a.placeItem(de,j.gx,j.gy,n.rotation);D=!1,K=!1}else f.button===0&&n.activeSeedCropId&&!n.selectedCatalogItem&&!n.moveModeActive&&!n.bulldozerActive&&!n.pincerActive&&te(j.gx,j.gy,q,F)?(N=!1,D=!0,K=!1):f.button===0&&n.activePastureAnimalId&&!n.selectedCatalogItem&&!n.moveModeActive&&!n.bulldozerActive&&!n.pincerActive&&oe(j.gx,j.gy,q,F)?(N=!1,D=!1,K=!0):(N=!1,D=!1,K=!1)});const je=f=>{re.delete(f),re.size<2&&(fe=0)};window.addEventListener("pointercancel",f=>{ge(),je(f.pointerId),z=!1,E=!1,N=!1,D=!1,K=!1,ce=!1}),window.addEventListener("pointerup",f=>{if(je(f.pointerId),ce){ge(),re.size===0&&(ce=!1,z=!1,E=!1,D=!1,K=!1);return}if(!z)return;let v=!1;if(be&&!E&&f.target===s){const se=be;ge(),a.placeItem(se.item,se.gx,se.gy,se.rot),v=!0}else ge();const q=E,F=N||v||D||K;if(z=!1,E=!1,N=!1,D=!1,K=!1,q||F)return;if(f.button===2){n.selectedCatalogItem=null,n.bulldozerActive=!1,n.moveModeActive=!1,n.movingBuildingUid=null,n.pincerActive=!1,n.pincerPicked=null,n.closeSeedTray(),n.closePastureTray(),n.collapseBuildDock(),n.closeHudPopovers(),n.pendingTouchTile=null,n.inspectSelection=null,n.refreshAll();return}if(f.target!==s)return;const j=n.pendingSowPlotUid,de=n.pendingStockPastureUid;if(n.closeHudPopovers(),n.hasOpenFloatingTray()&&(n.hideOpenFloatingTrays(),n.selectedCatalogItem||n.moveModeActive||n.bulldozerActive||n.pincerActive)){n.refreshAll();return}const G=s.getBoundingClientRect(),ne=f.clientX-G.left,me=f.clientY-G.top,R=cs(ne,me,r,G.width,G.height,a.grid),Z=f.pointerType==="touch";if(n.pincerActive){const se=n.pincerPicked??(a.staff[0]?{kind:"staff",id:a.staff[0].id,label:a.staff[0].name}:null);se&&a.dropPickedEntity(se.kind,se.id,R.gx,R.gy),n.pincerPicked=null,n.pincerActive=!1,n.refreshAll();return}if(n.bulldozerActive){let se=R.gx,H=R.gy;const J=a.grid[H]?.[se];if(!J?.buildingUid&&(!J||J.path==="none")){for(const P of l.hotspots)if(P.kind==="building"&&Math.hypot(ne-P.sx,me-P.sy)<=P.radius){const X=a.state.buildings.find(Me=>Me.uid===P.id);X&&(se=X.gx,H=X.gy);break}}a.removeAtTile(se,H);return}if(n.moveModeActive){if(n.movingBuildingUid){if(Z&&(!n.pendingTouchTile||n.pendingTouchTile.gx!==R.gx||n.pendingTouchTile.gy!==R.gy)){const P=a.state.buildings.find(Me=>Me.uid===n.movingBuildingUid),X=P?ie(P.itemId):void 0;O={gx:R.gx,gy:R.gy},n.pendingTouchTile={gx:R.gx,gy:R.gy,label:X?.name??"Dời công trình"},n.refreshTouchConfirmBar();return}const J=a.moveBuilding(n.movingBuildingUid,R.gx,R.gy,n.rotation);if(!J.ok){n.showToast(J.reason??"Không thể đặt tại ô này!","⚠️");return}n.movingBuildingUid=null,n.moveModeActive=!1,n.pendingTouchTile=null,n.refreshAll();return}let H=a.grid[R.gy]?.[R.gx]?.buildingUid??null;if(!H){for(const J of l.hotspots)if(J.kind==="building"&&Math.hypot(ne-J.sx,me-J.sy)<=J.radius){H=J.id;break}}if(H){const J=a.state.buildings.find(P=>P.uid===H);if(J?.isIndestructible){n.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(J){n.movingBuildingUid=J.uid,n.rotation=J.rotation,n.refreshFloatingBanner();const P=ie(J.itemId);n.showToast(`Đã nhấc "${P?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(n.selectedCatalogItem){const se=n.selectedCatalogItem;if(Z&&!ks(se)&&(!n.pendingTouchTile||n.pendingTouchTile.gx!==R.gx||n.pendingTouchTile.gy!==R.gy)){O={gx:R.gx,gy:R.gy},n.pendingTouchTile={gx:R.gx,gy:R.gy,label:se.name},n.refreshTouchConfirmBar();return}const H=a.canPlaceItem(se,R.gx,R.gy,n.rotation);if(!H.ok){n.showToast(H.reason??"Không thể đặt tại ô này!","⚠️");return}a.placeItem(se,R.gx,R.gy,n.rotation),n.pendingTouchTile=null,ln(se)||(n.selectedCatalogItem=null),n.refreshAll();return}for(const se of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let H=null,J=1/0;for(let P=l.hotspots.length-1;P>=0;P--){const X=l.hotspots[P];if(X.kind!==se)continue;const Me=Math.hypot(ne-X.sx,me-X.sy);if(X.spriteKey&&typeof X.boxLeft=="number"&&typeof X.boxTop=="number"&&typeof X.boxW=="number"&&typeof X.boxH=="number"&&X.boxW>2&&X.boxH>2){const Jt=ne>=X.boxLeft&&ne<=X.boxLeft+X.boxW&&me>=X.boxTop&&me<=X.boxTop+X.boxH,At=(ne-X.boxLeft)/X.boxW,Ge=(me-X.boxTop)/X.boxH,ye=Jt&&i.hitTestAlpha(X.spriteKey,At,Ge,!!X.flipX),tt=X.kind==="building"&&Me<=X.radius*.5;if(!ye&&!tt)continue;if((H===null||Me<J*.82)&&(H=X,J=Me,ye))break}else Me<=X.radius&&Me<J&&(J=Me,H=X)}if(H){if(H.kind==="owl_post"){const P=l.collectOwlPostParcel();P&&a.claimOwlPostDelivery(P.gx,P.gy),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="visitor_gift"){const P=a.claimVisitedNeighborMysteryGift();P.ok?l.notifyJuice("harvest",H.sx,H.sy):n.showToast(P.msg,"🎁"),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="neighbor_help"){l.triggerSquash(H.id);const P=a.helpVisitedNeighborBuilding(H.id);P.ok?(l.notifyJuice("harvest",H.sx,H.sy),A(H.id)):n.showToast(P.msg,"💧"),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="home_lantern"){const P=a.ensureNeighborSocial().homeLanternMarks.find(Me=>Me.id===H.id);P&&l.triggerSquash(P.buildingUid);const X=a.claimHomeLanternMark(H.id);X.ok?l.notifyJuice("harvest",H.sx,H.sy):n.showToast(X.msg,"🏮"),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="unveil_building"){a.unveilBuilding(H.id),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="bubble"){a.harvestBuildingBubble(H.id),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="water_crop"){l.triggerSquash(H.id);const P=a.waterCropPlot(H.id);P.ok?l.notifyJuice("harvest",H.sx,H.sy):n.showToast(P.msg,"💧"),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="feed_pasture"){l.triggerSquash(H.id);const P=a.feedAnimalPasture(H.id);P.ok?l.notifyJuice("harvest",H.sx,H.sy):n.showToast(P.msg,"🌾"),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="escaped"){a.catchEscapedCreature(H.id),n.inspectSelection=null,n.refreshAll();return}if(H.kind==="zone_plaque"){n.closeSeedTray(),n.inspectSelection={kind:"zone",zoneId:H.id},n.refreshAll();return}if(H.kind==="villager"){a.greetVillager(H.id),n.refreshAll();return}if(H.kind==="building"){const P=a.state.buildings.find(X=>X.uid===H.id);if(P){if(!a.isVisitingNeighbor&&P.awaitingUnveil){a.unveilBuilding(P.uid),n.inspectSelection=null,n.refreshAll();return}const X=ie(P.itemId),Me=!!(!a.isVisitingNeighbor&&X?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()>=P.cropReadyAt),Jt=!!(!a.isVisitingNeighbor&&X?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()>=P.pastureReadyAt);if(!Me&&!Jt&&l.triggerSquash(H.id),a.isVisitingNeighbor){const ye=a.getVisitedBuildingHelpStatus(P);if(ye.canHelp){const tt=a.helpVisitedNeighborBuilding(P.uid);tt.ok?(l.notifyJuice("harvest",H.sx,H.sy),A(P.uid)):n.showToast(tt.msg,"💧")}else if(ye.existingMark)n.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${ye.existingMark.noteText}”`,"🏮");else{const tt=ie(P.itemId),Os=a.getActiveVisitingNeighbor();n.showToast(`🏡 Đang ngắm "${tt?.name??"Công trình"}" (${P.stars}★) tại vườn ${Os?.name??"bạn bè"}!`,Os?.avatarEmoji??"🏡")}n.inspectSelection=null,n.refreshAll();return}const At=a.ensureNeighborSocial().homeLanternMarks.find(ye=>ye.buildingUid===P.uid);if(At&&a.claimHomeLanternMark(At.id).ok){l.notifyJuice("harvest",H.sx,H.sy),n.inspectSelection=null,n.refreshAll();return}if(P.itemId==="burrow_honeydukes_canon"){n.closeSeedTray(),n.inspectSelection=null,n.refreshAll(),n.openMatch3Dialog();return}const Ge=ie(P.itemId);if(Ge?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()>=P.cropReadyAt){a.harvestCropPlot(P.uid),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isFarmlandPlot&&P.cropId&&P.cropReadyAt&&Date.now()<P.cropReadyAt&&!P.cropWateredBoost){a.waterCropPlot(P.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isFarmlandPlot&&!P.cropId&&Date.now()>=P.constructEndsAt){if(n.activeSeedCropId){const ye=a.plantCropOnPlot(P.uid,n.activeSeedCropId);if(ye.needSeedAcquire){n.inspectSelection=null,n.refreshAll(),n.openSeedQuizDialog(n.activeSeedCropId,P.uid);return}n.showToast(ye.msg,ye.ok?"🌱":"🪙"),n.inspectSelection=null,n.refreshAll()}else j===P.uid?(n.inspectSelection=null,n.refreshAll()):n.openSeedTray(void 0,P.uid);return}else if(Ge?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()>=P.pastureReadyAt){a.harvestAnimalPasture(P.uid),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isAnimalPasturePlot&&P.pastureAnimalId&&P.pastureReadyAt&&Date.now()<P.pastureReadyAt&&!P.pastureFedBoost){a.feedAnimalPasture(P.uid).ok&&l.notifyJuice("harvest",H.sx,H.sy),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isAnimalPasturePlot&&!P.pastureAnimalId&&Date.now()>=P.constructEndsAt){if(n.activePastureAnimalId){const ye=a.stockAnimalOnPasture(P.uid,n.activePastureAnimalId);n.showToast(ye.msg,ye.ok?"🐾":"🪙"),n.inspectSelection=null,n.refreshAll()}else de===P.uid?(n.inspectSelection=null,n.refreshAll()):n.openPastureTray(void 0,P.uid);return}else(P.storedGalleons>0||P.readyFarmGoods&&P.readyFarmGoods.length>0)&&a.harvestBuildingBubble(P.uid)}n.closeSeedTray(),n.closePastureTray(),n.inspectSelection={kind:"building",uid:H.id},n.refreshAll();return}}}n.inspectSelection=null,n.refreshAll()}),s.addEventListener("contextmenu",f=>f.preventDefault()),s.addEventListener("wheel",f=>{f.preventDefault(),u=null;const v=s.getBoundingClientRect(),q=f.clientX-v.left,F=f.clientY-v.top,j=(q-v.width*.5)/r.zoom+r.x,de=(F-v.height*.5)/r.zoom+r.y,G=f.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*G)),r.x=j-(q-v.width*.5)/r.zoom,r.y=de-(F-v.height*.5)/r.zoom},{passive:!1});let ae=performance.now(),he=0;const U=new Yi,ve=new no;rn(a.state);const we=document.createElement("div");we.id="gamepadRadialMenu",we.className="aaa-gamepad-radial",we.hidden=!0,we.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${fn.map(f=>{const v=f.index*Math.PI*2/8,q=50+Math.cos(v)*37,F=50+Math.sin(v)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${f.index}" style="left:${q.toFixed(1)}%;top:${F.toFixed(1)}%;">${f.icon}<br/>${f.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(we);let Ce=null,We=!1;const Ns=f=>{switch(f){case"seeds":n.openSeedTray();break;case"barn":n.openWorkshopDialog("barn");break;case"orders":{n.activeQuestTab="orders",n.renderQuestDialog(),n.root.querySelector("#questDialog")?.showModal();break}case"match3":n.openMatch3Dialog();break;case"arcade":n.openPuzzleArcadeDialog();break;case"seedquiz":n.openSeedQuizDialog();break;case"neighbors":n.openNeighborDialog("friends");break;case"feast":n.openHarvestFeastDialog();break}};function Zt(f){if(document.hidden){ae=f,requestAnimationFrame(Zt);return}const v=(f-ae)/1e3;if(ae=f,v>.002&&v<.5&&(ve.recordFrameFps(1/v),he%90===0&&he>0)){const R=ve.getHealthReport();l.adaptiveDprCap=R.p5LowFps<46?1.25:R.p5LowFps<54?1.5:2}const q=U.poll();if(q.connected){if(q.panDx!==0||q.panDy!==0){u=null,n.rideCamUid=null;const R=380/r.zoom*Math.min(.05,v);r.x+=q.panDx*R,r.y+=q.panDy*R}if(q.radialOpen?(we.hidden=!1,We=!0,q.radialActionId&&(Ce=q.radialActionId),we.querySelectorAll("[data-radial-idx]").forEach(R=>{R.dataset.selected=String(Number(R.dataset.radialIdx)===q.radialSliceIndex)}),q.confirmJustPressed&&Ce&&(we.hidden=!0,We=!1,Ns(Ce),Ce=null)):We&&(we.hidden=!0,We=!1,Ce&&(Ns(Ce),Ce=null)),q.cancelJustPressed){const R=Array.from(n.root.querySelectorAll("dialog[open]"));R.length>0?R[R.length-1]?.close():n.hasOpenFloatingTray()&&n.hideOpenFloatingTrays()}}if((ee.has("w")||ee.has("arrowup")||ee.has("s")||ee.has("arrowdown")||ee.has("a")||ee.has("arrowleft")||ee.has("d")||ee.has("arrowright"))&&(u=null),u){const R=Math.min(1,Math.max(0,(f-u.startMs)/u.durationMs)),Z=1-Math.pow(1-R,3);r.x=u.fromX+(u.toX-u.fromX)*Z,r.y=u.fromY+(u.toY-u.fromY)*Z,r.zoom=u.fromZoom+(u.toZoom-u.fromZoom)*Z,R>=1&&(u=null)}const F=340/r.zoom*Math.min(.05,v);if(ee.size>0&&document.querySelector("dialog[open]")&&ee.clear(),(ee.has("w")||ee.has("arrowup"))&&(n.rideCamUid=null,r.y-=F),(ee.has("s")||ee.has("arrowdown"))&&(n.rideCamUid=null,r.y+=F),(ee.has("a")||ee.has("arrowleft"))&&(n.rideCamUid=null,r.x-=F),(ee.has("d")||ee.has("arrowright"))&&(n.rideCamUid=null,r.x+=F),a.update(v),n.rideCamUid){const R=a.state.buildings.find(se=>se.uid===n.rideCamUid),Z=a.coasterCircuits.get(n.rideCamUid);if(Z&&Z.waypoints.length>=3){const se=Vi(Z.waypoints,Z.isClosed,Date.now()/1e3,3);if(se.length>0){const H=se[0],J=ds(H.gx+.5,H.gy+.5,r.viewRot??0),P=J.wx,X=J.wy-(H.elev*_i+10);r.x+=(P-r.x)*Math.min(1,v*10),r.y+=(X-r.y)*Math.min(1,v*10),r.zoom+=(1.38-r.zoom)*Math.min(1,v*5),n.rideCamSpeedText=`${H.speedKmh} km/h (${H.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,he%8===0&&n.refreshFloatingBanner()}}else if(R){const se=Date.now()/1e3,H=R.gx+2+Math.cos(se*2.1)*1.4,J=R.gy+2+Math.sin(se*2.1)*1.4,P=ds(H,J,r.viewRot??0);r.x+=(P.wx-r.x)*Math.min(1,v*8),r.y+=(P.wy-22-r.y)*Math.min(1,v*8),r.zoom+=(1.35-r.zoom)*Math.min(1,v*5),n.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",he%12===0&&n.refreshFloatingBanner()}else n.rideCamUid=null,n.refreshFloatingBanner()}const j=a.getRealTimePeriod(),de=a.getCurrentWeather(),G=ds(3,17,r.viewRot??0),ne=Math.hypot(r.x-G.wx,r.y-G.wy)<420;o.updateSoundscape(Math.min(.1,v),j==="night"||j==="dusk",r.zoom,ne,de.kind,a.getActiveFestival()!=="none");const me=n.pendingTouchTile?{gx:n.pendingTouchTile.gx,gy:n.pendingTouchTile.gy}:O;l.activeSeedBrushCropId=n.activeSeedCropId,l.activePastureBrushAnimalId=n.activePastureAnimalId,l.render(a,r,me,n.selectedCatalogItem,n.rotation,n.bulldozerActive,n.inspectSelection?.kind==="building"?n.inspectSelection.uid:null,n.movingBuildingUid,n.pincerPicked?.label??null),he++,he%4===0&&!n.photoModeActive&&l.renderMinimap(n.minimapCanvas,a,r),requestAnimationFrame(Zt)}requestAnimationFrame(Zt),document.addEventListener("visibilitychange",()=>{document.hidden?(a.saveToStorage(),o.pause()):(ae=performance.now(),o.resume())}),window.addEventListener("pagehide",()=>{a.saveToStorage()}),window.addEventListener("beforeunload",()=>{a.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{a.saveToStorage()});let Ds=0,Rs="";const Jn=a.onUiChange;a.onUiChange=()=>{Jn?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:a.state.level,galleons:a.state.galleons}}));const f=Date.now(),v=`${a.state.level}|${a.state.match3.stars}|${a.state.unlockedZones.length}|${a.state.buildings.length}|${a.state.settings.weatherOverride}|${a.state.settings.timeOverride}`;v!==Rs&&f-Ds>=1200&&(Rs=v,Ds=f,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:a.state.parkName,level:a.state.level,magicStars:a.state.match3.stars,galleons:a.state.galleons,unlockedZonesCount:a.state.unlockedZones.length,buildingsCount:a.state.buildings.length,weatherMode:a.state.settings.weatherOverride,atmosphereMode:a.state.settings.timeOverride==="realtime"?"auto":a.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",f=>{if(a.isVisitingNeighbor)return;const v=String(f.detail?.mode||"auto");(v==="auto"||v==="none"||v==="halloween"||v==="christmas"||v==="quidditch_cup")&&(a.state.settings.activeFestival=v,a.saveToStorage(),n.refreshAll())}),window.addEventListener("hpvn:mute",f=>{const v=!!f.detail?.muted;a.state.settings.soundEnabled=!v,a.state.settings.bgmEnabled=!v,o.enabled=!v,o.bgmEnabled=!v,v?o.pause():o.resume(),a.saveToStorage(),n.refreshAll()}),window.addEventListener("gamesave:helpers",f=>{const v=f.detail;if(!v)return;const q=a.homeStateWhileVisiting??a.state,F=q===a.state?a.ensureNeighborSocial():q.neighborSocial??(q.neighborSocial=a.ensureNeighborSocial()),j=new Set(F.homeLanternMarks.map(Z=>Z.id)),de=q.buildings[0]?.uid||"burrow_main_gate",G=Date.now(),ne=900*1e3,me=3600*1e3;let R=0;for(const Z of v.helpers??[]){if(!Z?.id||j.has(Z.id)||F.homeLanternMarks.length>=5)continue;j.add(Z.id);const se=Z.buildingUid?q.buildings.find(J=>J.uid===Z.buildingUid):void 0,H=(se&&((se.cropReadyAt??0)>G||(se.pastureReadyAt??0)>G||(se.workshopQueue?.[0]?.endsAt??0)>G||(se.constructEndsAt??0)>G)?se:void 0)??q.buildings.find(J=>(J.cropReadyAt??0)>G||(J.pastureReadyAt??0)>G||(J.workshopQueue?.[0]?.endsAt??0)>G||(J.constructEndsAt??0)>G);if(H)if((H.cropReadyAt??0)>G)H.cropReadyAt=Math.max(G,(H.cropReadyAt??G)-ne),H.cropWateredBoost=!0;else if((H.pastureReadyAt??0)>G)H.pastureReadyAt=Math.max(G,(H.pastureReadyAt??G)-ne);else if((H.workshopQueue?.[0]?.endsAt??0)>G)for(const J of H.workshopQueue??[])J.startedAt-=ne,J.endsAt=Math.max(G,J.endsAt-ne);else(H.constructEndsAt??0)>G+me&&(H.constructEndsAt=Math.max(G+me,(H.constructEndsAt??G)-ne));F.homeLanternMarks.push({id:Z.id,buildingUid:H?.uid||Z.buildingUid||de,helperId:Z.uid,helperName:Z.name||"Hàng Xóm Hang Sóc",helperEmoji:Z.avatarEmoji||"🧙‍♂️",kind:Z.kind||"water_crop",noteVi:Z.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:Z.at||G}),R++}R>0&&(a.saveToStorage(),n.refreshAll(),v.summaryVi&&n.showToast(v.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",f=>{const v=f.detail;if(!v)return;const q=a.homeStateWhileVisiting??a.state,F=q===a.state?a.ensureNeighborSocial():q.neighborSocial??(q.neighborSocial=a.ensureNeighborSocial());typeof v.dayKey=="string"&&v.dayKey&&(F.lastSocialResetKey=v.dayKey),typeof v.dailyGardenHelpsCount=="number"&&v.dailyGardenHelpsCount>(F.dailyGardenHelpsCount??0)&&(F.dailyGardenHelpsCount=v.dailyGardenHelpsCount)})}io().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const s=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(s.map(o=>o.unregister()))}if("caches"in window){const s=await caches.keys().catch(()=>[]);await Promise.all(s.map(o=>caches.delete(o)))}window.location.reload()}))});
