const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/match3Modal-BSOOxFy0.js","assets/game-data-DbWU4oXw.js","assets/sim-Bf_CB4yH.js","assets/puzzleArcadeModal-D86AsqMK.js"])))=>i.map(i=>d[i]);
var Xn=Object.defineProperty;var Yn=(e,t,s)=>t in e?Xn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var w=(e,t,s)=>Yn(e,typeof t!="symbol"?t+"":t,s);import{F as ve,af as Ns,ag as Zn,b as pt,v as ke,ah as Jn,g as se,ai as St,aj as Rs,Q as Jt,G as Lt,ae as We,P as Ye,p as Gt,ak as an,M as Ve,n as Re,al as on,E as ei,Z as $s,o as ti,t as si,j as nt,r as Ne,$ as wt,z as Be,q as mt,D as ni,I as ii,N as rn,R as ln,x as ai,B as Bt,U as oi,H as ut,am as vt,S as ri,an as li,W as cn,X as dn,k as At,C as es,_ as ts,y as Ds,A as ci,V as di,T as Vt,a2 as pi}from"./game-data-DbWU4oXw.js";import{i as lt,j as Ts,n as ui,A as Et,k as tt,l as Os,m as Fs,H as it,L as zs,o as Gs,p as gi,q as Pe,t as mi,u as bi,v as Vs,w as ss,x as me,y as bt,C as ft,z as fi,F as gt,M as qt,B as hi,D as vi,G as yi,I as us,P as _s,J as Si,K as wi,N as xi,O as Us,Q as js,R as st,S as $i,U as pn,V as Ti,W as ki,X as Nt,Y as Ci,Z as Mi,_ as Li,$ as un,a0 as Qe,a1 as Ee,a2 as Ai,a3 as Rt,a4 as Ei,a5 as qi,a6 as Ke,a7 as ht,a8 as xt,d as Pi,a9 as ns,aa as is,ab as Hi,ac as Ii,ad as Bi,ae as Ni,af as Ri,ag as Di,ah as as,g as Ws,ai as os,s as Oi,aj as rs,E as Fi}from"./sim-Bf_CB4yH.js";import{S as zi,I as Gi}from"./engine-o8PZVRos.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const Pt={colorblindMode:"none",fontScale:100,highContrast:!1,volumes:{master:.9,music:.8,sfx:.85,ambience:.75,voice:.95}};function Vi(e,t=typeof document<"u"?document:void 0){if(!t?.documentElement)return;const s=t.documentElement;s.setAttribute("data-colorblind",e.colorblindMode),s.setAttribute("data-font-scale",String(e.fontScale)),s.setAttribute("data-high-contrast",e.highContrast?"true":"false"),s.setAttribute("data-kb-focus",e.keyboardFocusVisible?"true":"false")}function _i(e,t){t.ceiling.setAllVolumes(e.volumes)}const gn=[{index:0,actionId:"seeds",labelVi:"Túi Hạt Giống",icon:"🌱"},{index:1,actionId:"barn",labelVi:"Kho Nông Sản Đỏ",icon:"🏚️"},{index:2,actionId:"orders",labelVi:"Đơn Hàng Cú",icon:"🦉"},{index:3,actionId:"match3",labelVi:"Bùa Gặt Honeydukes",icon:"🍬"},{index:4,actionId:"arcade",labelVi:"Ngũ Ấn Đạo Tặc",icon:"🗺️"},{index:5,actionId:"seedquiz",labelVi:"Học Viện Thần Chú",icon:"🪄"},{index:6,actionId:"neighbors",labelVi:"Sổ Hàng Xóm",icon:"🏡"},{index:7,actionId:"feast",labelVi:"Đại Tiệc Mùa Gặt",icon:"🥧"}],Ui=.18;function Ht(e,t=Ui){if(!Number.isFinite(e)||Math.abs(e)<t)return 0;const s=e<0?-1:1,i=(Math.abs(e)-t)/Math.max(.001,1-t);return Number((s*Math.min(1,i)).toFixed(3))}function ji(e,t){if(Math.hypot(e,t)<.35)return null;let i=Math.atan2(t,e);i<0&&(i+=Math.PI*2);const a=Math.PI*2/8,o=(i+a*.5)%(Math.PI*2);return Math.floor(o/a)%8}class Wi{constructor(){w(this,"prevConfirm",!1);w(this,"prevCancel",!1);w(this,"prevDpadUp",!1);w(this,"prevDpadDown",!1);w(this,"prevDpadLeft",!1);w(this,"prevDpadRight",!1)}poll(t){let s=t??null;if(!s&&typeof navigator<"u"&&typeof navigator.getGamepads=="function"){const T=navigator.getGamepads();for(const A of T)if(A&&A.connected){s=A;break}}if(!s)return this.prevConfirm=!1,this.prevCancel=!1,this.prevDpadUp=!1,this.prevDpadDown=!1,this.prevDpadLeft=!1,this.prevDpadRight=!1,{connected:!1,panDx:0,panDy:0,cursorStepGx:0,cursorStepGy:0,radialOpen:!1,radialSliceIndex:null,radialActionId:null,confirmJustPressed:!1,cancelJustPressed:!1};const i=Ht(s.axes[0]??0),a=Ht(s.axes[1]??0),o=Ht(s.axes[2]??0),r=Ht(s.axes[3]??0),l=!!s.buttons[0]?.pressed,n=!!s.buttons[1]?.pressed,c=!!s.buttons[4]?.pressed,d=!!s.buttons[12]?.pressed,p=!!s.buttons[13]?.pressed,u=!!s.buttons[14]?.pressed,v=!!s.buttons[15]?.pressed,g=l&&!this.prevConfirm,f=n&&!this.prevCancel,S=(v&&!this.prevDpadRight?1:0)-(u&&!this.prevDpadLeft?1:0),$=(p&&!this.prevDpadDown?1:0)-(d&&!this.prevDpadUp?1:0);this.prevConfirm=l,this.prevCancel=n,this.prevDpadUp=d,this.prevDpadDown=p,this.prevDpadLeft=u,this.prevDpadRight=v;const x=c,m=x?ji(Math.abs(o)>0?o:i,Math.abs(r)>0?r:a):null,E=m!==null?gn[m]?.actionId??null:null;return{connected:!0,panDx:x?0:i,panDy:x?0:a,cursorStepGx:S,cursorStepGy:$,radialOpen:x,radialSliceIndex:m,radialActionId:E,confirmJustPressed:g,cancelJustPressed:f}}}let mn=null,Le=null,$e=null,ls=null;function bn(e){!$e&&typeof document<"u"&&($e=document.getElementById("a11y-announcer")),!(!$e||!e)&&($e.textContent="",requestAnimationFrame(()=>{$e&&($e.textContent=e)}))}function Qi(e){const t=e.state.buildings.find(i=>i.itemId==="molly_apple_bakery");if(!t)return"Chưa xây dựng";const s=Date.now();if(t.constructEndsAt>s)return`Đang xây dựng (còn ${Math.max(0,Math.ceil((t.constructEndsAt-s)/1e3))} giây)`;if(t.workshopQueue&&t.workshopQueue.length>0){const i=Math.max(0,Math.ceil((t.workshopQueue[0].endsAt-s)/1e3)),a=t.workshopQueue.length;return`Đang nướng bánh (mẻ hiện tại còn ${i} giây, tổng ${a} mẻ trong hàng đợi)`}return t.readyFarmGoods&&t.readyFarmGoods.length>0?`Đã chín ${t.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`:"Đang rảnh (0 giây)"}function gs(e){const t=e??mn;if(!t||(!Le&&typeof document<"u"&&(Le=document.getElementById("a11y-farm-status")),!Le))return;const s=t.state,i=s.level,a=s.galleons.toLocaleString("vi-VN"),o=s.sandboxMode?"Vô hạn":String(s.match3?.stars??0),r=s.timeSand,l=s.farmBarn?.owlOrders??[],n=l.filter(p=>t.canFulfillFarmOwlOrder(p)).length,c=`${l.length} đơn hàng (${n} đơn đủ nông sản sẵn sàng giao)`,d=Qi(t);Le.innerHTML=`
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${i}</td></tr>
        <tr><th scope="row">Vàng Galleon</th><td>${a} Galleons</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${o}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${r}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${c}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${d}</td></tr>
      </tbody>
    </table>
  `.trim()}function Ki(e){mn=e,!(typeof document>"u")&&($e||($e=document.getElementById("a11y-announcer"),$e||($e=document.createElement("div"),$e.id="a11y-announcer",$e.className="visually-hidden",$e.setAttribute("aria-live","polite"),$e.setAttribute("aria-atomic","true"),document.body.appendChild($e))),Le||(Le=document.getElementById("a11y-farm-status"),Le||(Le=document.createElement("div"),Le.id="a11y-farm-status",Le.className="visually-hidden",Le.setAttribute("role","region"),Le.setAttribute("aria-label","Trạng thái trang trại"),document.body.appendChild(Le))),gs(e),ls&&clearInterval(ls),ls=setInterval(()=>{gs()},5e3))}const cs={init:Ki,announce:bn,refresh:()=>gs()},Xi="hpvn-burrow-garden",Yi=new Set(["auto","dawn","day","dusk","night"]),Zi=new Set(["auto","clear","cloudy","rain","storm","snow","fog","fireflies"]),Qs=[/^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,/^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,/^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,/^http:\/\/localhost(:\d+)?$/i,/^http:\/\/127\.0\.0\.1(:\d+)?$/i];function $t(e,t){const s=typeof e=="string"?e.trim():"";if(!s||s==="null")return!1;if(typeof window<"u"&&window.location?.origin&&s===window.location.origin)return!0;const i=t&&t.length>0?[...Qs,...t]:Qs;for(const a of i)if(typeof a=="string"){if(a===s)return!0}else if(a.test(s))return!0;return!1}function Ji(e,t){if(e&&e!=="*")return e;if(typeof document<"u"&&document.referrer)try{const s=new URL(document.referrer).origin;if($t(s,t))return s}catch{}return null}function Ks(e){const t=String(e||"day").toLowerCase();return Yi.has(t)?t:"day"}function Xs(e){const t=String(e||"clear").toLowerCase();return Zi.has(t)?t:"clear"}function fn(e={}){const t=e.parkName||"Trang Trại Hang Sóc",s=e.playerName&&e.playerName.trim()&&e.playerName.trim()!==t?` · ${e.playerName.trim()}`:"",i=Math.max(1,Math.floor(Number(e.level)||1)),a=Math.max(0,Math.floor(Number(e.magicStars)||0)),o=Math.max(1,Math.floor(Number(e.unlockedZonesCount)||1)),r=Math.max(0,Math.floor(Number(e.buildingsCount)||0)),l=e.house?` · Nhà ${e.house}`:"",n=e.keeperTitle?` · [${e.keeperTitle}]`:"",c={rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm đêm"},d=e.weatherMode&&c[e.weatherMode]?` (${c[e.weatherMode]})`:"";return`🏰 [${t}${s} · Cấp ${i}${l}${n}]${d} — ${o}/10 vùng mở khóa, ${r} công trình & ${a} 🌟 Sao Phép Thuật!`}function ea(e={}){const t=[],s=e.win??(typeof window<"u"?window:void 0),i=e.nav??(typeof navigator<"u"?navigator:void 0);let a=Ji(e.targetOrigin,e.allowedOrigins);function o(n,c={}){const d={source:Xi,version:"25.1",type:n,payload:c,sentAt:Date.now()};t.push(d),t.length>24&&t.shift();try{const p=s?.parent;if(p&&p!==s&&typeof p.postMessage=="function"){const u=e.targetOrigin||a||"*";p.postMessage(d,u)}}catch{}return d}function r(n){const c=n;if(c.source!=null&&s?.parent!=null&&c.source!==s.parent)return;if(!e.allowAnyOrigin&&typeof c.origin=="string"&&c.origin.length>0){if(!$t(c.origin,e.allowedOrigins))return;a=c.origin}const d=c?.data;if(!d||typeof d!="object")return;const p=d.payload&&typeof d.payload=="object"?d.payload:{};if(d.type==="hpvn:burrow:set-atmosphere"||d.type==="hpvn:host:set-atmosphere")e.onAtmosphereChange?.(Ks(p.mode??d.mode));else if(d.type==="hpvn:burrow:set-weather"||d.type==="hpvn:host:set-weather")e.onWeatherChange?.(Xs(p.mode??d.mode));else if(d.type==="hpvn:burrow:set-event"||d.type==="hpvn:host:set-event")e.onEventChange?.(String(p.mode??d.mode??"auto"));else if(d.type==="hpvn:burrow:tour-garden"||d.type==="hpvn:host:tour-garden"){const u=p.tourId??d.tourId??null;u?e.onStartTour?.(String(u)):e.onStopTour?.()}else if(d.type==="hpvn:burrow:mute"||d.type==="hpvn:host:mute")e.onMuteChange?.(!!(p.muted??d.muted));else if(d.type==="hpvn:burrow:request-snapshot"||d.type==="hpvn:host:request-snapshot"){const u=e.getSnapshot?e.getSnapshot():{};o("hpvn:burrow:snapshot",u)}}s&&typeof s.addEventListener=="function"&&s.addEventListener("message",r);async function l(n={}){const c=fn(n),d=o("hpvn:burrow:share-floo",{text:c,level:n.level??1,parkName:n.parkName??"Trang Trại Hang Sóc",...n.playerName?{playerName:n.playerName}:{},...n.tourId?{tourId:n.tourId}:{},...n.image?{image:n.image}:{},atmosphereMode:Ks(n.atmosphereMode),weatherMode:Xs(n.weatherMode),eventMode:n.eventMode??"auto"});if(typeof n.sendToFloo=="function"&&await n.sendToFloo(c,n)===!0)return e.notify?.(n.image?"✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.":"✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé."),{ok:!0,text:c,copied:!1,floo:!0,envelope:d};let p=!1;try{i?.clipboard?.writeText&&(await i.clipboard.writeText(c),p=!0)}catch{p=!1}return e.notify?.(p?`✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${c}"`:`✨ Đã gửi thông điệp khoe thung lũng: "${c}"`),{ok:!0,text:c,copied:p,envelope:d}}return{notifyReady:(n={})=>o("hpvn:burrow:ready",n),syncState:(n={})=>o("hpvn:burrow:state",n),shareToFloo:l,shareGardenToFloo:l,history:()=>[...t],destroy:()=>{s&&typeof s.removeEventListener=="function"&&s.removeEventListener("message",r)}}}function ms(e,t={},s){const o=s??(typeof document<"u"?document.createElement("canvas"):{width:640,height:380,getContext:()=>null,toDataURL:()=>""});o.width=640,o.height=380;const r=o.getContext("2d");if(!r)return o;const l=(t.parkName||"Trang Trại Hang Sóc").slice(0,38),n=(t.playerName||"Phù Thủy Hang Sóc").slice(0,32),c=Math.max(1,Math.floor(Number(t.level)||1)),d=t.house||"Gryffindor",p=Math.max(0,Math.floor(Number(t.magicStars)||0)),u=Math.max(0,Math.floor(Number(t.buildingsCount)||0)),v=Math.max(1,Math.floor(Number(t.unlockedZonesCount)||1));r.fillStyle="#2b1910",r.fillRect(0,0,640,380),r.strokeStyle="#d4a238",r.lineWidth=4,r.strokeRect(6,6,628,368),r.strokeStyle="rgba(248, 236, 200, 0.38)",r.lineWidth=1.5,r.strokeRect(12,12,616,356),r.fillStyle="#3b2316",r.fillRect(16,16,608,30),r.fillStyle="#f6df9e",r.font='700 13px "Be Vietnam Pro", system-ui, sans-serif',r.textBaseline="middle",r.fillText("🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG",26,31);const f={clear:"☀️ Nắng ấm",cloudy:"⛅ Mây nhẹ",rain:"🌧️ Mưa phùn",storm:"⛈️ Giông phép",snow:"❄️ Tuyết rơi",fog:"🌫️ Sương mù",fireflies:"✨ Đom đóm"}[String(t.weatherMode||"clear")]||"☀️ Nắng ấm Hang Sóc";r.textAlign="right",r.fillStyle="#ebd4a7",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif',r.fillText(f,614,31),r.textAlign="left";const S=18,$=50,x=604,m=248;r.save(),r.beginPath(),r.rect(S,$,x,m),r.clip();let E=!1;if(e&&e.width>0&&e.height>0)try{const P=e.width/e.height,V=x/m;let W=0,B=0,_=e.width,re=e.height;P>V?(_=Math.round(e.height*V),W=Math.round((e.width-_)/2)):(re=Math.round(e.width/V),B=Math.round((e.height-re)/2)),r.drawImage(e,W,B,_,re,S,$,x,m),E=!0}catch{E=!1}if(!E){const P=r.createLinearGradient(S,$,S,$+m);P.addColorStop(0,"#365843"),P.addColorStop(.55,"#598249"),P.addColorStop(1,"#334d2c"),r.fillStyle=P,r.fillRect(S,$,x,m)}r.restore(),r.strokeStyle="#c89632",r.lineWidth=2,r.strokeRect(S,$,x,m);const T=18,A=304,k=604,C=58;r.fillStyle="#f6ebd2",r.fillRect(T,A,k,C),r.strokeStyle="#b9852c",r.lineWidth=1.5,r.strokeRect(T,A,k,C);const D={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"}[d]||"🪄";r.fillStyle="#2d1a0e",r.font='700 16px "Playfair Display", Georgia, serif',r.fillText(`${D} ${l} · Cấp ${c}`,T+14,A+21),r.fillStyle="#5c3d24",r.font='600 12px "Be Vietnam Pro", system-ui, sans-serif';const F=t.keeperTitle?` · ${t.keeperTitle}`:"";r.fillText(`${n} · Nhà ${d}${F} · ${v}/10 vùng · ${u} công trình · ${p} 🌟`,T+14,A+42);const L=142,N=34,O=T+k-L-12,ne=A+12;return r.fillStyle="#1d5c4b",r.fillRect(O,ne,L,N),r.strokeStyle="#7fe5bd",r.lineWidth=1.5,r.strokeRect(O,ne,L,N),r.fillStyle="#f7fff9",r.font='700 11.5px "Be Vietnam Pro", system-ui, sans-serif',r.textAlign="center",r.fillText("🔥 RỦ BẠN BAY FLOO",O+L/2,ne+N/2+1),r.textAlign="left",o}function hn(e,t=.55){try{const s=e.toDataURL("image/webp",t);if(typeof s=="string"&&s.startsWith("data:image/webp"))return s;const i=e.toDataURL("image/png");return typeof i=="string"?i:""}catch{return""}}const ta={};function De(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>{const t=Number(e),s=typeof crypto<"u"&&typeof crypto.getRandomValues=="function"?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(Math.random()*256);return(t^s&15>>t/4).toString(16)})}function vn(e,t){const s=Math.max(1,Math.floor(Number(t)||1)),i=e.effectivePrice??e.price,a=e.dailyRemaining??e.dailyLimit;let o=0;for(let r=0;r<s;r++)r<a?o+=i:e.overflowMultiplier&&e.overflowMultiplier>1?o+=Math.ceil(i*e.overflowMultiplier):o+=i;return o}const sa=Object.freeze({wheat:"Lúa Mì",pumpkin:"Bí Ngô",strawberry:"Dâu Tây",carrot:"Cà Rốt",corn:"Bắp Ngọt",apple:"Táo Đỏ",mandrake:"Nhân Sâm Mandrake",gillyweed:"Cỏ Mang Cá",milk:"Sữa Tươi",egg:"Trứng Gà",wool:"Lông Cừu",honey:"Mật Ong",apple_pie:"Bánh Táo Bà Molly",butterbeer_cask:"Thùng Bia Bơ",water:"Nước Phép",boost:"Phân Bón Thảo Dược"});function _t(e,t={}){const s=e&&typeof e=="object"?e:{},i=s.details&&typeof s.details=="object"?s.details:{},a=String(s.reason||i.reason||"unknown-error"),o={...sa,...t.labels||{}};switch(a){case"missing-crops":{const r=Array.isArray(i.missing)?i.missing:[];if(r.length>0){const l=r.map(n=>{const c=String(n.resource||"");return`${Math.max(1,Number(n.required||0)-Number(n.have||0))} ${o[c]||c}`});return{reason:a,icon:"🌾",item:String(r[0].resource||""),text:`Thiếu ${l.join(" · ")}`}}return{reason:a,icon:"🌾",text:"Thiếu nông sản"}}case"insufficient-galleons":case"insufficient-balance":{const r=typeof i.shortBy=="number"?i.shortBy:typeof i.required=="number"&&typeof i.spendable=="number"?Math.max(1,i.required-i.spendable):null;return{reason:a,icon:"🪙",text:r!==null?`Thiếu ${r} G`:"Chưa đủ Galleons"}}case"insufficient-stars":{const r=Number(i.required||0),l=Number(i.have||0),n=Math.max(1,r-l);return{reason:a,icon:"🌟",text:`Thiếu ${n} Sao Phép Thuật`}}case"missing-supply":{const r=String(i.resource||"");if(r.startsWith("seeds.")){const l=r.slice(6);return{reason:a,icon:"🌱",item:l,text:`Thiếu hạt ${o[l]||l}`}}return{reason:a,icon:"💧",item:r,text:`Thiếu ${o[r]||"vật tư"}`}}case"wallet-frozen":return{reason:a,icon:"🪙",text:"Ví Gringotts đang tạm khóa bảo vệ"};case"market-closed":return{reason:a,icon:"🏪",text:"Quầy chợ đang tạm nghỉ kiểm kê"};case"price-changed":return{reason:a,icon:"🏷️",text:"Giá vừa thay đổi · vui lòng xác nhận lại"};case"daily-help-cap":return{reason:a,icon:"🤝",text:"Đã dùng hết 5/5 lượt hỗ trợ hôm nay"};case"host-help-cap":return{reason:a,icon:"🤝",text:"Thung lũng này đã nhận đủ 10 lượt giúp hôm nay"};case"already-helped":return{reason:a,icon:"🤝",text:"Hôm nay bạn đã hỗ trợ thung lũng này rồi"};case"daily-cap":return{reason:a,icon:"⏳",text:"Đã chạm hạn mức trong ngày"};case"stock-cap":return{reason:a,icon:"📦",text:"Kho chứa vật phẩm này đã đầy"};case"already-claimed":return{reason:a,icon:"✅",text:"Đã nhận rồi"};case"quest-incomplete":return{reason:a,icon:"📜",text:"Chưa hoàn thành đủ chỉ tiêu nhiệm vụ"};case"festival-incomplete":return{reason:a,icon:"🎃",text:"Chưa đủ điểm Đại Tiệc Mùa Gặt"};case"revision-conflict":return{reason:a,icon:"🔄",text:"Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại"};case"request-id-conflict":return{reason:a,icon:"⚠️",text:"Mã giao dịch bị trùng với nội dung khác"};case"timer-not-ready":return{reason:a,icon:"⏳",text:"Chưa tới giờ thu hoạch theo đồng hồ máy chủ"};case"rate-limited":return{reason:a,icon:"⚡",text:"Thao tác quá nhanh · đợi giây lát nhé"};default:{if(a==="model-rejected"&&typeof i.modelCode=="string"&&t.modelText){const r=t.modelText(i.modelCode);if(r)return{reason:a,icon:"🪄",text:r}}return{reason:a,icon:"🪄",text:s.message||"Máy chủ từ chối thao tác"}}}}function Ct(e){let t=null,s=null,i=Promise.resolve();const a=n=>{const c=i.then(n,n);return i=c.catch(()=>{}),c};async function o(n,c){const d=t?.catalogHash,p=d?{...c,catalogHash:d}:c,u=await e(n,p);if(!u||typeof u!="object"||!("garden"in u))throw new Error("Phản hồi thung lũng từ máy chủ không hợp lệ.");const v=u;return v.catalog===void 0&&d&&v.catalogHash===d&&(v.catalog=t?.catalog),t?.saleAdmin&&v.saleAdmin===void 0&&(v.saleAdmin=!0),t=v,t}async function r(n,c){const d=JSON.stringify({name:n,payload:c});if(s&&s.signature!==d)throw new Error("Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.");s||(s={signature:d,data:{...c,requestId:De()}});try{const p=await o(n,s.data);return s=null,p}catch(p){throw p?.definitive===!0&&(s=null),p}}const l=()=>{if(!t)throw new Error("Cần gọi read() tải trạng thái thung lũng trước khi thao tác.");return t.garden.progression.revision};return{get snapshot(){return t},get hasPendingMutation(){return s!==null},read:()=>a(()=>o("getBurrowGarden",{})),act:n=>a(()=>r("performBurrowAction",{...n,expectedRevision:l()})),free:(n,c={})=>a(()=>o("performBurrowAction",{...c,action:"freeAction",kind:n,expectedRevision:t?.garden.progression.revision??0,requestId:De()})),guide:n=>a(()=>o("performBurrowAction",{action:"guideDone",lessonId:n,expectedRevision:t?.garden.progression.revision??0,requestId:De()})),scene:n=>a(()=>o("performBurrowAction",{action:"setScene",scene:n,expectedRevision:t?.garden.progression.revision??0,requestId:De()})),syncProfile:n=>a(()=>o("performBurrowAction",{...n,action:"syncProfile",expectedRevision:t?.garden.progression.revision??0,requestId:De()})),visit:(n={})=>a(()=>e("visitBurrowGarden",n)),frame:n=>a(async()=>{const c=await e("setBurrowFlooFrame",{frameKey:n});return t&&Array.isArray(c.frames)&&typeof c.worn=="string"&&(t={...t,flooFrames:{frames:c.frames,worn:c.worn}}),c}),sales:(n={mode:"get"})=>a(()=>e("manageBurrowSales",n)),fireOut:n=>a(()=>e("extinguishBurrowGarden",{...n,requestId:De()})),sell:(n,c)=>a(()=>r("sellBurrowGoods",n?{items:n,expectedTotal:c}:{clearance:!0,expectedTotal:c})),buy:(n,c=1)=>a(()=>{const d=t?.catalog?.find(p=>p.id===n);if(!d)throw new Error("Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.");return r("buyBurrowSupplies",{itemId:n,quantity:c,catalogVersion:t?.catalogVersion,expectedTotal:vn(d,c)})}),settleWallet:n=>a(()=>o("settleBurrowWallet",{direction:n.direction,amount:Math.max(1,Math.floor(n.amount)),...n.reasonCode?{reasonCode:n.reasonCode}:{},...n.sourceType?{sourceType:n.sourceType}:{},...typeof n.clientLevel=="number"?{clientLevel:Math.floor(n.clientLevel)}:{},requestId:typeof n.requestId=="string"&&n.requestId?n.requestId:De()})),houseCup:()=>a(()=>e("getBurrowHouseCupStandings",{})),contributeHouseCup:(n,c)=>a(()=>e("contributeBurrowHouseCup",{points:n,...c?{house:c}:{}})),postCoop:n=>a(()=>e("postBurrowCoopRequest",{...n,requestId:typeof n.requestId=="string"?n.requestId:De()})),fulfillCoop:n=>a(()=>e("fulfillBurrowCoopRequest",n)),listCoop:n=>a(()=>e("getBurrowCoopRequests",n?{hostUid:n}:{}))}}const Fe="hpvn-burrow-game";function ks(e=globalThis.location){const t=e?.hash?e.hash.slice(1):"";if(!t)return null;const s=new URLSearchParams(t);return s.get("burrow-ticket")??s.get("hpvn-ticket")}function yn(e,t=window,s={}){let i=0;const a=new Map;let o=s.targetOrigin&&s.targetOrigin!=="*"?s.targetOrigin:null;if(!o&&typeof document<"u"&&document.referrer)try{const l=new URL(document.referrer).origin;$t(l,s.allowedOrigins)&&(o=l)}catch{}t.addEventListener("message",l=>{if(!s.allowAnyOrigin&&typeof l.origin=="string"&&l.origin.length>0){if(!$t(l.origin,s.allowedOrigins))return;o=l.origin}const n=l.data;if(l.source!==t.parent||!n||n.channel!==Fe||n.nonce!==e||typeof n.id!="string"||!a.has(n.id))return;const c=a.get(n.id);a.delete(n.id),c(n)});const r=Ct((l,n)=>new Promise((c,d)=>{const p=`burrow-${++i}`,u=setTimeout(()=>{a.delete(p),d(new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên."))},2e4);a.set(p,v=>{if(clearTimeout(u),"result"in v&&v.result&&typeof v.result=="object"){c(v.result);return}const g=new Error(typeof v.error=="string"?v.error:"Máy chủ từ chối thao tác.");g.definitive=v.definitive===!0,g.reason=typeof v.reason=="string"?v.reason:void 0,g.details=v.details&&typeof v.details=="object"?v.details:{},d(g)}),t.parent.postMessage({channel:Fe,nonce:e,id:p,action:"burrow",name:l,data:n},s.targetOrigin||o||"*")}));return r.host=(l,n={})=>new Promise(c=>{const d=`host-${++i}`,p=setTimeout(()=>{a.delete(d),c(null)},5e3);a.set(d,u=>{clearTimeout(p),c(u.result??null)}),t.parent.postMessage({...n,channel:Fe,nonce:e,id:d,action:l},s.targetOrigin||o||"*")}),r}function Sn(e={}){const t=(e.baseUrl??"/api/rpc/").replace(/\/?$/,"/"),s=e.sessionEndpoint??"/api/auth/session",i=e.fetchImpl??globalThis.fetch.bind(globalThis),a=e.getUid??lt,o=e.timeoutMs??18e3;let r=null,l=0;async function n(c){if(r&&Date.now()+3e4<l)return r;try{const d=typeof window<"u"?window:void 0,p=d?.__HPVN_CONFIG__?.getIdToken??d?.__HPVN_GET_ID_TOKEN__,u=p?await p().catch(()=>null):null,v=typeof window<"u"?ks(window.location):null,g=await i(s,{method:"POST",headers:{"Content-Type":"application/json","X-User-Id":c,...u?{Authorization:`Bearer ${u}`}:{}},body:JSON.stringify({uid:c,...u?{idToken:u}:{},...v?{ticket:v}:{}})});if(!g.ok)return null;const f=await g.json();if(typeof f.uid=="string"&&f.uid&&!e.getUid&&Ts(f.uid),typeof f.token=="string"&&f.token)return r=f.token,l=Number(f.expiresAt||Date.now()+36e5),r}catch{}return null}return Ct(async(c,d)=>{const p=a(),u=await n(p),v=new AbortController,g=setTimeout(()=>v.abort(),o);let f;try{const $={"Content-Type":"application/json","X-User-Id":p};u&&($.Authorization=`Bearer ${u}`),f=await i(`${t}${c}`,{method:"POST",headers:$,body:JSON.stringify({data:d}),signal:v.signal})}catch{throw new Error("Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.")}finally{clearTimeout(g)}const S=await f.json();if(S.error||!f.ok){const $=new Error(S.error?.message||`Máy chủ từ chối thao tác (${f.status}).`);throw $.definitive=f.status<500,$.reason=typeof S.error?.details?.reason=="string"?S.error.details.reason:void 0,$.details=S.error?.details??{},$}return S.result??{}})}const wn="asia-southeast1",Qt="demo-hpvnn-burrow",na="hpvnn-archive";function Ie(e){const t=String(e||"").trim().toLowerCase();return t?!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t==="::1"||/^192\.168\.\d{1,3}\.\d{1,3}$/.test(t)||/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t)||/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(t)):!1}function Ys(e){const t=new TextEncoder().encode(e);let s="";for(let i=0;i<t.length;i++)s+=String.fromCharCode(t[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function xn(e,t=Qt,s=globalThis.location,i=Date.now()){const a=s?.hostname??"127.0.0.1";if(!Ie(a))throw new Error("createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.");const o=Math.floor(i/1e3),r=Ys(JSON.stringify({alg:"none",typ:"JWT"})),l=Ys(JSON.stringify({iss:`https://securetoken.google.com/${t}`,aud:t,auth_time:o,user_id:e,sub:e,iat:o,exp:o+3600,firebase:{identities:{},sign_in_provider:"custom"}}));return`${r}.${l}.`}function $n(e={}){const t=e.loc??globalThis.location;if(t?.hostname&&!Ie(t.hostname))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const s=e.host??(t?.hostname||"127.0.0.1");if(!Ie(s))throw new Error("Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.");const i=e.projectId||Qt,a=e.region||wn,o=e.port||5001,l=`${e.useSameOriginRewrite?"":`http://${s}:${o}`}/${i}/${a}/`,n=e.fetchImpl??globalThis.fetch.bind(globalThis),c=e.getUid??(()=>e.uid||lt()),d=e.now??(()=>Date.now()),p=e.timeoutMs??18e3;return Ct(async(u,v)=>{const g=c(),f=xn(g,i,{hostname:s},d()),S=new AbortController,$=setTimeout(()=>S.abort(),p);let x;try{x=await n(`${l}${u}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify({data:v}),signal:S.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.")}finally{clearTimeout($)}const m=await x.json();if(m.error||!x.ok){const E=new Error(m.error?.message||`Emulator từ chối thao tác (${x.status}).`);throw E.definitive=x.status<500,E.reason=typeof m.error?.details?.reason=="string"?m.error.details.reason:void 0,E.details=m.error?.details??{},E}return m.result??{}})}function Tn(e){const t=e.functionsBaseUrl.replace(/\/?$/,"/"),s=e.fetchImpl??globalThis.fetch.bind(globalThis),i=e.timeoutMs??2e4;return Ct(async(a,o)=>{const r=typeof window<"u"?window.__HPVN_GET_ID_TOKEN__:void 0,l=e.getIdToken?await e.getIdToken():r?await r():null,n=new AbortController,c=setTimeout(()=>n.abort(),i);let d;try{const u={"Content-Type":"application/json"};l?u.Authorization=`Bearer ${l}`:u["X-User-Id"]=lt(),d=await s(`${t}${a}`,{method:"POST",headers:u,body:JSON.stringify({data:o}),signal:n.signal})}catch{throw new Error("Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.")}finally{clearTimeout(c)}const p=await d.json();if(p.error||!d.ok){const u=new Error(p.error?.message||`Cloud Functions từ chối thao tác (${d.status}).`);throw u.definitive=d.status<500,u.reason=typeof p.error?.details?.reason=="string"?p.error.details.reason:void 0,u.details=p.error?.details??{},u}return p.result??{}})}function ia(e){const t=e.win??(typeof window<"u"?window:void 0);if(!t)return()=>{};const s=async i=>{const a=i;if(!e.allowAnyOrigin&&typeof a.origin=="string"&&a.origin.length>0&&!$t(a.origin,e.allowedOrigins))return;const o=a.data;if(!o||o.channel!==Fe||o.nonce!==e.nonce||typeof o.id!="string"||e.expectedSource&&a.source!==e.expectedSource)return;const r=a.source;if(!r||typeof r.postMessage!="function")return;const l=typeof a.origin=="string"&&a.origin.length>0&&a.origin!=="null"?a.origin:"*",n=o.id,c=String(o.action||"");if(c==="burrow"||c==="garden"){const d=String(o.name||""),p=o.data&&typeof o.data=="object"?o.data:{};try{const u=await e.transport(d,p);r.postMessage({channel:Fe,nonce:e.nonce,id:n,result:u},l)}catch(u){const v=u;r.postMessage({channel:Fe,nonce:e.nonce,id:n,error:v?.message||"Máy chủ từ chối thao tác.",definitive:v?.definitive===!0,reason:v?.reason,details:v?.details??{}},l)}return}try{const d=e.onHostAction?await e.onHostAction(c,o):{ok:!0};r.postMessage({channel:Fe,nonce:e.nonce,id:n,result:d},l)}catch(d){r.postMessage({channel:Fe,nonce:e.nonce,id:n,error:d instanceof Error?d.message:"Lỗi xử lý lệnh host.",definitive:!0},l)}};return t.addEventListener("message",s),()=>{t.removeEventListener("message",s)}}function ct(){if(typeof window<"u"){const e=ks(window.location);if(e)return yn(e,window);const t=new URLSearchParams(window.location.search),s=t.get("emulator"),i=t.get("functionsPort");if((s==="1"||i)&&Ie(window.location.hostname)){const l=Number(i||5001)||5001,n=t.get("project")||Qt,c=t.get("uid")||void 0;return $n({projectId:n,port:l,uid:c,useSameOriginRewrite:s==="vite"})}const a=window.__HPVN_CONFIG__,o=ta?.VITE_HPVN_FUNCTIONS_URL,r=a?.functionsBaseUrl||o;if(r)return Tn({functionsBaseUrl:r,getIdToken:a?.getIdToken})}return Sn()}let Zs=Promise.resolve();async function aa(e,t){const s=typeof navigator<"u"?navigator:void 0,i=s&&"locks"in s?s.locks:void 0;if(i&&typeof i.request=="function")return i.request(e,async()=>t());const a=Zs.then(t,t);return Zs=a.catch(()=>{}),a}function oa(e){const t=`${e.scope}-save-envelope`,s=e.persistent!==!1,i=e.storage??globalThis.localStorage,a=e.legacyKeys??[];let o={},r=null;function l(){if(r)return r;if(!s||!i)return o;const c=i.getItem(t);if(c!==null){const p=JSON.parse(c);if(!p||typeof p!="object"||Array.isArray(p))throw new Error("Bản lưu thung lũng không hợp lệ.");return p}const d={};for(const p of a){const u=i.getItem(p);u!==null&&(d[p]=u)}return d}function n(c){s&&i?i.setItem(t,JSON.stringify(c)):o=c}return{storageKey:t,getItem(c){return l()[c]??null},setItem(c,d){r?r[c]=String(d):n({...l(),[c]:String(d)})},transaction(c){if(r)return c();r={...l()};try{const d=c();return n(r),d}finally{r=null}}}}async function ra(e=ct()){const t=await e.houseCup();if(!t||typeof t!="object")return null;const s=t.totals&&typeof t.totals=="object"?t.totals:{};return{weekKey:String(t.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(s.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(s.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(s.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(s.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(t.playerContribution)||0)),updatedAt:Number(t.updatedAt)||Date.now()}}async function la(e,t,s=ct()){const i=await s.contributeHouseCup(e,t);if(!i||typeof i!="object")return null;const a=i.totals&&typeof i.totals=="object"?i.totals:{};return{weekKey:String(i.weekKey||""),totals:{Gryffindor:Math.max(0,Math.floor(Number(a.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(a.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(a.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(a.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(i.playerContribution)||0)),updatedAt:Number(i.updatedAt)||Date.now()}}async function ca(e,t=ct()){return t.postCoop(e)}async function da(e,t=ct()){return t.fulfillCoop(e)}const pa=Object.freeze(Object.defineProperty({__proto__:null,BURROW_EMBED_RPC_CHANNEL:Fe,HPVN_DEFAULT_EMULATOR_PROJECT:Qt,HPVN_FIREBASE_REGION:wn,HPVN_PROD_FIREBASE_PROJECT:na,attachHpvnParentShellResponder:ia,computeClientPackTotal:vn,contributeWeeklyHouseCupOnline:la,createAtomicGardenStorage:oa,createAutoAuthoritativeClient:ct,createBurrowGardenClient:Ct,createEmulatorFixtureToken:xn,createFirebaseEmulatorClient:$n,createFirebaseFunctionsClient:Tn,createHpvnEmbedClient:yn,createHttpAuthoritativeClient:Sn,fetchWeeklyHouseCupStandingsOnline:ra,formatServerRefusalVi:_t,fulfillCoopAssistanceOnline:da,generateRequestId:De,getHpvnTicketFromLocation:ks,isLocalDevelopmentHost:Ie,postCoopAssistanceOnline:ca,runWithStorageLock:aa},Symbol.toStringTag,{value:"Module"})),ua={light:15,success:[20,40,20],harvest:[30,40,30],levelup:[40,60,40]};function It(e){if(typeof navigator>"u"||typeof navigator.vibrate!="function")return!1;try{const t=ua[e]??15;return navigator.vibrate(t)}catch{return!1}}function Q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Js(e){const t=it[e]??it.Gryffindor;return{emoji:t.mascotEmoji,label:t.house,cls:`house-${t.cssSlug}`}}function ga(e){return e===1?"🥇 #1":e===2?"🥈 #2":e===3?"🥉 #3":`#${e}`}class ma{constructor(t,s){w(this,"activeGameId","match3");w(this,"activeScope","valley");w(this,"activeHouseFilter","all");w(this,"onJumpToGame");w(this,"onVisitNeighbor");w(this,"onOpenNeighborBook");w(this,"root");w(this,"sim");w(this,"closeBound",!1);w(this,"sortingHatSpinning",!1);this.root=t,this.sim=s,this.ensureDialogMounted()}ensureDialogMounted(){let t=this.root.querySelector("#leaderboardDialog");return t||(t=document.createElement("dialog"),t.id="leaderboardDialog",t.setAttribute("closedby","any"),t.setAttribute("aria-labelledby","leaderboardDialogTitle"),t.innerHTML=`
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      `,this.root.appendChild(t)),this.closeBound||(this.closeBound=!0,t.addEventListener("close",()=>{t.returnValue=""}),typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)&&t.addEventListener("click",s=>{if(s.target!==t)return;const i=t.getBoundingClientRect();i.top<=s.clientY&&s.clientY<=i.top+i.height&&i.left<=s.clientX&&s.clientX<=i.left+i.width||t.close()})),t}open(t,s,i){t?this.activeGameId=ui(t):Et.includes(this.activeGameId)||(this.activeGameId="match3"),(s==="valley"||s==="friends"||s==="personal")&&(this.activeScope=s),(i==="all"||i&&tt.includes(i))&&(this.activeHouseFilter=i);const a=this.ensureDialogMounted();this.render(),a.open||a.showModal();const o=this.activeGameId;Os(this.sim.state,o).catch(()=>{}).then(()=>Promise.all(Et.map(r=>Fs(r)))).then(r=>{a.open&&r.some(l=>l.length>0)&&this.render()})}close(){const t=this.root.querySelector("#leaderboardDialog");t?.open&&t.close()}renderHouseCupSectionHtml(t,s){const i=it[s]??it.Gryffindor,a=t.map(l=>{const n=l.meta,c=this.activeHouseFilter===l.house,d=l.rank===1?"🥇 #1":l.rank===2?"🥈 #2":l.rank===3?"🥉 #3":`#${l.rank}`;return`
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
        `}).join(""),o=tt.map(l=>{const n=it[l],c=l===s;return`
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
      `,...tt.map(l=>{const n=it[l],c=this.activeHouseFilter===l,d=t.find(p=>p.house===l)?.members??0;return`
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
              <span>🎩 <strong>${i.mascotEmoji} ${Q(i.house)}</strong></span>
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
          ${a}
        </div>

        <div class="lb-controls">
          <div class="lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc bảng xếp hạng theo Nhà Hogwarts">
            ${r}
          </div>
        </div>
      </section>
    `}render(){const t=this.root.querySelector("#leaderboardDialogContent");if(!t)return;const s=zs[this.activeGameId],i=this.root.querySelector("#leaderboardDialogTitle");i&&(i.innerHTML=`🏆 Bảng Xếp Hạng • ${Q(s.shortVi)}`);const a=Et.map(l=>{const n=zs[l],c=this.sim.getPlayerMinigameRank(l,"valley"),d=l===this.activeGameId;return`
        <button
          type="button"
          role="tab"
          aria-selected="${d}"
          data-lb-game="${l}"
          class="lb-game-tab ${d?"active":""}"
          title="${Q(n.titleVi)} — #${c}"
        >
          <img src="${n.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${Q(n.shortVi)}</strong>
            <span class="lb-tab-rank-pill">${c<=3?"👑 ":""}#${c}</span>
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
            ▶️ ${Q(s.shortVi)}
          </button>
        </div>
      </div>
    `,r=this.activeScope==="personal"?this.renderPersonalThreeGamesTableHtml():this.renderStandingViewHtml(this.activeScope);t.innerHTML=`
      <div class="lb-shell">
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">
          ${a}
        </div>
        ${o}
        ${r}
      </div>
    `,this.bindEvents(t)}renderPodiumCardHtml(t,s){if(!t)return"";const i=s===1?"🥇":s===2?"🥈":"🥉",a=Js(t.house),o=t.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${Q(t.portraitSprite)}.png" alt="" class="lb-podium-avatar-img" />`:`<span class="lb-podium-avatar-emoji" aria-hidden="true">${Q(t.avatarEmoji)}</span>`;return`
      <div class="lb-podium-card place-${s} ${t.isPlayer?"is-player":""}">
        <div class="lb-podium-medal">${i} #${s}</div>
        <div class="lb-podium-avatar-wrap">${o}</div>
        <div class="lb-podium-name">${Q(t.name)}</div>
        <div class="lb-podium-house ${a.cls}">${a.emoji} ${a.label}</div>
        <div class="lb-podium-primary">${Q(t.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${Q(t.ratingDisplayVi)}</div>
      </div>
    `}renderStandingViewHtml(t){const s=this.sim.getMinigameLeaderboard(this.activeGameId,t,this.activeHouseFilter),{meta:i,entries:a,playerEntry:o,playerRank:r,totalEntries:l,nextRivalAbove:n,houseStandings:c,playerHouse:d}=s,p=n?`🎯 Đuổi <strong>#${n.rank} ${Q(n.name)}</strong> (${Q(n.primaryDisplayVi)})`:`👑 Đang dẫn đầu <strong>#1</strong> (${Q(i.shortVi)})`,u=this.renderHouseCupSectionHtml(c,d),v=a.length>0?`
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(a[1],2)}
        ${this.renderPodiumCardHtml(a[0],1)}
        ${this.renderPodiumCardHtml(a[2],3)}
      </div>
    `:"",g=a.length>0?a.map(f=>{const S=Js(f.house),$=ga(f.rank),x=f.isPlayer?'<span class="lb-role-tag you">Bạn</span>':f.isCloudPlayer?'<span class="lb-role-tag cloud">🌐</span>':f.isFriend?'<span class="lb-role-tag friend">🤝</span>':"",m=!f.isPlayer&&f.neighborId?`<button type="button" class="lb-mini-visit-btn" data-lb-visit="${Q(f.neighborId)}" title="Thăm ${Q(f.name)}">🏡</button>`:"";return`
          <tr class="lb-row ${f.isPlayer?"is-player":""} ${f.rank<=3?`top-${f.rank}`:""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <span class="lb-rank-chip rank-${Math.min(4,f.rank)}">${$}</span>
                <span class="lb-avatar-badge" aria-hidden="true">${Q(f.avatarEmoji)}</span>
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${Q(f.name)}</strong>
                    ${x}
                  </div>
                  <div class="lb-contender-sub">
                    <span class="${S.cls}">${S.emoji} ${S.label}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <span class="lb-league-pill tier-${f.league.tierId}">${f.league.icon} ${Q(f.league.labelVi)}</span>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(f.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(f.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(f.detailDisplayVi)}</span>
                ${m}
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
        <img src="${i.spriteIcon}" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">${Q(i.shortVi)}</div>
          <div class="lb-cup-chase">${p}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng</span>
          <strong class="lb-player-rank-num">#${r}<span>/${l}</span></strong>
          <span class="lb-league-pill tier-${o.league.tierId}">${o.league.icon} ${Q(o.league.labelVi)}</span>
        </div>
      </div>

      ${u}

      ${v}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Bậc'; --label-3: '${Q(i.primaryColVi)}'; --label-4: '${Q(i.secondaryColVi)}'; --label-5: 'Chi Tiết';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            ${Q(i.shortVi)} (${a.length}/${l})
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bậc</th>
              <th scope="col">${Q(i.primaryColVi)}</th>
              <th scope="col">${Q(i.secondaryColVi)}</th>
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
            ${this.sim.getAllPersonalLeaderboardSummaries().map(i=>`
          <tr class="lb-row ${i.gameId===this.activeGameId?"is-player":""}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <img src="${i.meta.spriteIcon}" alt="" class="lb-tab-sprite" />
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${Q(i.meta.shortVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${i.league.tierId}">${i.league.icon} ${Q(i.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${i.valleyRank}/${i.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 #${i.friendsRank}/${i.friendsTotal}</div>
            </td>
            <td class="lb-cell-primary">
              <strong>${Q(i.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${Q(i.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${Q(i.detailDisplayVi)}</span>
                <button type="button" class="brass-btn gold-cta lb-mini-play-btn" data-lb-jump-play="${i.gameId}">
                  ▶️ Chơi
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
          </tbody>
        </table>
      </div>
    `}bindEvents(t){t.querySelectorAll("[data-lb-game]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbGame;!i||!Et.includes(i)||(this.sim.audio.playClick(),this.activeGameId=i,this.activeScope==="personal"&&(this.activeScope="valley"),this.render(),Os(this.sim.state,i).catch(()=>{}).then(()=>Fs(i)).then(a=>{a.length>0&&this.activeGameId===i&&this.render()}))})}),t.querySelectorAll("[data-lb-scope]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbScope;i&&(this.sim.audio.playClick(),this.activeScope=i,this.render())})}),t.querySelectorAll("[data-lb-house-filter]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbHouseFilter;i&&(this.sim.audio.playClick(),i==="all"?this.activeHouseFilter="all":tt.includes(i)&&(this.activeHouseFilter=i),this.render())})}),t.querySelectorAll("[data-lb-house-card]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbHouseCard;!i||!tt.includes(i)||(this.sim.audio.playClick(),this.activeHouseFilter=this.activeHouseFilter===i?"all":i,this.render())})}),t.querySelectorAll("[data-lb-pick-house]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbPickHouse;!i||!tt.includes(i)||(this.sim.setPlayerHouse(i,this.activeGameId),this.activeHouseFilter!=="all"&&(this.activeHouseFilter=i),this.render())})}),t.querySelector("#btnLbSortingHat")?.addEventListener("click",()=>{if(this.sortingHatSpinning)return;this.sortingHatSpinning=!0;const s=this.sim.rollPlayerSortingHat(this.activeGameId);this.activeHouseFilter!=="all"&&(this.activeHouseFilter=s),this.render(),window.setTimeout(()=>{this.sortingHatSpinning=!1,this.render()},420)}),t.querySelector("#btnLbPlayActiveGame")?.addEventListener("click",()=>{this.sim.audio.playClick();const s=this.activeGameId;this.close(),this.onJumpToGame?.(s)}),t.querySelector("#btnLbOpenFriendsBook")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.close(),this.onOpenNeighborBook?.()}),t.querySelectorAll("[data-lb-jump-play]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbJumpPlay;i&&(this.sim.audio.playClick(),this.close(),this.onJumpToGame?.(i))})}),t.querySelectorAll("[data-lb-visit]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.lbVisit;i&&(this.sim.audio.playClick(),this.close(),this.onVisitNeighbor?.(i))})})}}function K(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ds=["en","ko","zh","es","ja"],ps=["all","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"];class ba{constructor(t,s,i,a,o){w(this,"root");w(this,"sim");w(this,"onRefreshHud");w(this,"onToast");w(this,"onEquipAndSow");w(this,"targetCropId","ottery_wheat");w(this,"pendingPlotUid",null);w(this,"challenge",null);w(this,"answeredOutcome",null);w(this,"selectedChoiceIdx",null);w(this,"placedTokenIndices",[]);w(this,"selectedLeftPairId",null);w(this,"matchedPairIds",new Set);w(this,"flashWrongPairKey",null);w(this,"pairMistakes",0);w(this,"cropFilter","all");w(this,"activeSubView","practice");w(this,"codexQuery","");w(this,"codexBoxFilter","all");w(this,"onOpenLeaderboard");this.root=t,this.sim=s,this.onRefreshHud=i,this.onToast=a,this.onEquipAndSow=o}open(t,s,i,a,o,r){(r==="practice"||r==="codex")&&(this.activeSubView=r);const l=Object.values(ve).filter(p=>this.sim.state.sandboxMode||this.sim.state.level>=p.unlockLevel);if(t&&ve[t]){const p=ve[t];this.sim.state.sandboxMode||this.sim.state.level>=p.unlockLevel?this.targetCropId=t:l.length>0&&(this.targetCropId=l[0].id)}else!ve[this.targetCropId]&&l.length>0&&(this.targetCropId=l[0].id);this.pendingPlotUid=s??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const n=this.sim.ensureLanguageQuiz();let c=!this.challenge||this.answeredOutcome!==null;i&&ds.includes(i)&&n.activeLang!==i&&(n.activeLang=i,c=!0),a&&(a==="beginner"||a==="intermediate"||a==="advanced")&&(Gs(n,n.activeLang,a),c=!0),o&&ps.includes(o)&&(n.preferredFormat=o,c=!0),c||this.challenge?.lang!==n.activeLang?this.loadNextQuestion(!0):this.render(),this.ensureActiveLangPackLoaded(n.activeLang);const d=this.root.querySelector("#seedQuizDialog");d&&!d.open&&d.showModal(),this.onRefreshHud()}ensureActiveLangPackLoaded(t){Ns(t)||Zn(t).then(s=>{if(!s)return;this.sim.ensureLanguageQuiz().activeLang===t&&!this.answeredOutcome&&this.render()})}close(){const t=this.root.querySelector("#seedQuizDialog");t?.open&&t.close()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0}loadNextQuestion(t=!0){this.resetInteractiveQuestionState();const s=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(s.activeLang),this.challenge=gi(s,this.sim.state.level),this.sim.saveToStorage(),this.render();const i=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(i&&(i.scrollTop=0),t&&s.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&Pe(a,this.challenge.lang,.94)}}submitAttempt(t){if(!this.challenge||this.answeredOutcome)return;const s=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,t);this.answeredOutcome=s,this.sim.ensureLanguageQuiz().autoSpeak&&Pe(this.challenge.fullSentence,this.challenge.lang,.95);const a=ve[this.targetCropId];if(s.correct){const o=s.tierAutoPromoted?` • Thăng hạng ${pt[this.challenge.lang].tierLabels[s.tierAutoPromoted]}!`:"",r=s.phoenixTalismanAwarded?` • 🔥 +${s.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",l=s.buildReduction&&s.buildReduction.reducedSec>0?` • 🔨 -${ke(s.buildReduction.reducedSec)} xây ${s.buildReduction.targetName??"công trình"}!`:"",n=s.leaderboardRankUp&&s.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${s.leaderboardRankUp.newRank} (+${s.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${s.seedsAwarded} hạt ${a.emoji} ${a.name} (Túi: ${s.newSeedCount} hạt)${l}${o}${r}${n}`,s.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}handleSowEquippedSeed(){if(this.sim.getSeedCount(this.targetCropId)<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const s=this.pendingPlotUid;this.pendingPlotUid=null,this.close(),this.onEquipAndSow(this.targetCropId,s)}render(){const t=this.root.querySelector("#seedQuizDialogContent");if(!t)return;const s=this.sim.ensureLanguageQuiz(),i=s.activeLang,a=pt[i],o=s.profiles[i],r=ve[this.targetCropId],l=this.sim.getSeedCount(this.targetCropId),n=this.sim.getFarmItemCount(this.targetCropId),c=this.sim.state.galleons,d=r.seedCost,p=r.seedCost*3,u=c>=d,v=c>=p,g=mi(o,this.sim.state.level),f=o.totalAnswered>0?Math.round(o.totalCorrect/o.totalAnswered*100):100,S=bi(o),$=Jn(i),x=Math.max(0,Math.floor(this.sim.state.phoenixTalismans??0)),m=Math.max(0,Math.floor(this.sim.state.quizTalismanProgress??0))%8;let E="";if(this.pendingPlotUid){const P=this.sim.state.buildings.find(V=>V.uid===this.pendingPlotUid);P&&se(P.itemId)?.isFarmlandPlot&&!P.cropId&&(E=`
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${P.gx}, ${P.gy}]</strong></span>
            ${l>0?`<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${l})</button>`:""}
          </div>
        `)}const T=Object.values(ve).sort((P,V)=>P.unlockLevel-V.unlockLevel||P.growSec-V.growSec),A=T.filter(P=>P.isFlowerCrop).length,k=T.length-A,C=T.filter(P=>this.cropFilter==="flowers"?!!P.isFlowerCrop:this.cropFilter==="crops"?!P.isFlowerCrop:!0),M=[{id:"all",label:`🌱 (${T.length})`},{id:"flowers",label:`🌸 Hoa (${A})`},{id:"crops",label:`🌾 Cây (${k})`}].map(P=>`
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter===P.id?"active":""}"
            data-sq-crop-filter="${P.id}"
            aria-pressed="${this.cropFilter===P.id}"
          >${P.label}</button>
        `).join(""),D=C.map(P=>{const V=!this.sim.state.sandboxMode&&this.sim.state.level<P.unlockLevel,W=P.id===this.targetCropId,B=this.sim.getSeedCount(P.id),_=ke(P.growSec);return`
          <button
            type="button"
            class="sq-crop-pill ${W?"active":""} ${V?"locked":""}"
            data-sq-crop="${P.id}"
            aria-pressed="${W}"
            ${V?"disabled":""}
            title="${V?`Lv.${P.unlockLevel} (⏱️ ${_})`:`${P.name} • ⏱️ ${_} • 🪙 ${P.seedCost.toLocaleString("vi-VN")}G`}"
          >
            <img src="${St(P.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${K(P.name)}</span>
              <span class="sq-crop-pill-sub">
                ${V?`🔒 Lv.${P.unlockLevel}`:`🌱 ${B} • ⏱️${_}`}
              </span>
            </span>
          </button>
        `}).join(""),F=ds.map(P=>{const V=pt[P],W=s.profiles[P],B=P===i,_=W.tier==="beginner"?"Tập Sự":W.tier==="intermediate"?"O.W.L.":"N.E.W.T.";return`
        <button
          type="button"
          class="sq-lang-tab ${B?"active":""}"
          data-sq-lang="${P}"
          aria-pressed="${B}"
          title="${V.flag} ${K(V.academyVi)} — ${K(V.tierLabels[W.tier])}"
        >
          <span class="sq-lang-flag">${V.flag}</span>
          <span class="sq-lang-text">
            <strong>${K(V.nameVi)}</strong>
            <small>${K(_)} • Lv.${W.masteryScore}</small>
          </span>
        </button>
      `}).join(""),N=[{id:"beginner",icon:"🪄",rewardTag:"+1–2 🌱"},{id:"intermediate",icon:"🦉",rewardTag:"+2 🌱"},{id:"advanced",icon:"👑",rewardTag:"+2 🌱"}].map(P=>{const V=o.tier===P.id;return`
          <button
            type="button"
            class="sq-tier-btn ${V?"active":""}"
            data-sq-tier="${P.id}"
            aria-pressed="${V}"
          >
            <span>${P.icon} ${K(a.tierLabels[P.id])}</span>
            <small>${P.rewardTag}</small>
          </button>
        `}).join(""),O=ps.map(P=>{const V=Rs[P],W=s.preferredFormat===P;return`
        <button
          type="button"
          class="sq-format-chip ${W?"active":""}"
          data-sq-format="${P}"
          aria-pressed="${W}"
        >
          ${V.icon} ${K(V.labelVi)}
        </button>
      `}).join(""),ne=this.challenge?this.renderChallengeStage(this.challenge):"";t.innerHTML=`
      <div class="sq-root">
        ${E}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${M}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${c.toLocaleString("vi-VN")}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${K(r.name)}">
                🌱 ${K(r.name)}: <strong>×${l}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${m}/8 câu)">
                🔥 <strong>${x}</strong> <small>(${m}/8)</small>
              </span>
              ${(()=>{const P=Date.now(),V=this.sim.getActiveConstructions(P);if(V.length===0)return"";const W=V[0],B=se(W.itemId),_=Math.max(1,Math.ceil((W.constructEndsAt-P)/1e3)),re=this.sim.getBuildingMinFloorSec(W),ie=_<=re;return`<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${K(B?.name??"Đang xây")}: <strong>${ke(_)}</strong> <small>${ie?"🔒":"⚡"}</small>
                </span>`})()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${D}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${St(r.id)}" alt="${K(r.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${K(r.name)}</h3>
                <p>⏱️ <strong>${ke(r.growSec)}</strong> • 🌾 <strong>+${r.yieldQty}</strong></p>
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
                ${u?"":"disabled"}
              >
                🪙 +1 Hạt (-${d.toLocaleString("vi-VN")}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${v?"":"disabled"}
              >
                🪙 +3 Hạt (-${p.toLocaleString("vi-VN")}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${l>0?"has-seeds":"empty-seeds"}">
              <div class="sq-pocket-status">
                🌱 <strong>${K(r.name)}</strong>: <strong>×${l}</strong>
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
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${F}</div>

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
                📖 Từ Điển (${S.masteredCount}/${$.lexiconCount})
              </button>
              <button
                id="btnSqOpenLeaderboard"
                type="button"
                class="sq-view-tab minigame-lb-chip"
                title="Bảng Xếp Hạng 3 Môn Tính Điểm"
              >
                🏆 BXH
              </button>
            </div>

            ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(i,o):`
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${N}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${o.masteryScore}/100 (Quyển ${g}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${a.flag} <strong>Lv.${o.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${o.totalCorrect}/${o.totalAnswered}</strong> (${f}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4,o.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${o.streak}</strong></span>
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
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${O}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${ne}
                `}
          </section>
        </div>
      </div>
    `,this.bindRenderedEvents(t)}getLexiconEntrySrsInfo(t,s){const i=t.srsBoxes??{},a=i[`vocab:${s}`],o=i[`pairs:${s}`],r=Math.max(a?.box??0,o?.box??0),l=!!(a&&a.box<5&&a.dueAtTurn<=t.totalAnswered||o&&o.box<5&&o.dueAtTurn<=t.totalAnswered);return{box:r,due:l}}getLanguageLexiconEntries(t){return Jt.filter(s=>s.lang===t).sort((s,i)=>s.levelBand-i.levelBand||s.id.localeCompare(i.id))}renderLexiconCodexPanel(t,s){const i=pt[t],a=this.getLanguageLexiconEntries(t);let o=0,r=0,l=0;for(const c of a){const{box:d}=this.getLexiconEntrySrsInfo(s,c.id);d>=5?o+=1:d>=1?r+=1:l+=1}const n=[{id:"all",label:`📖 Tất cả (${a.length})`},{id:"mastered",label:`🏆 Thuộc (${o})`},{id:"learning",label:`📚 Đang học (${r})`},{id:"unseen",label:`✨ Mới (${l})`}].map(c=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===c.id?"active":""}"
            data-sq-codex-filter="${c.id}"
            aria-pressed="${this.codexBoxFilter===c.id}"
          >${c.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-summary">
          <span>📜 <strong>${i.flag} ${K(i.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${Ns(t)?`✅ ${a.length} từ`:"⏳..."}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
            value="${K(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${n}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(t,s,a)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(t,s,i){const a=i??this.getLanguageLexiconEntries(t),o=this.codexQuery.trim().toLowerCase(),r=a.filter(n=>{const{box:c}=this.getLexiconEntrySrsInfo(s,n.id);return this.codexBoxFilter==="mastered"&&c<5||this.codexBoxFilter==="learning"&&(c<1||c>=5)||this.codexBoxFilter==="unseen"&&c>0?!1:o?n.word.toLowerCase().includes(o)||n.phonetic.toLowerCase().includes(o)||n.meaningVi.toLowerCase().includes(o)||n.exampleSentence.toLowerCase().includes(o)||n.exampleVi.toLowerCase().includes(o):!0});if(r.length===0)return`
        <div class="sq-codex-empty">
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;const l=r.map(n=>{const{box:c,due:d}=this.getLexiconEntrySrsInfo(s,n.id),p=Vs(n.meaningVi,n.word,n.id);let u="is-unseen",v=`✨ Quyển ${n.levelBand}`;return c>=5?(u="is-box5",v="🏆 Hộp 5/5 • Thuộc"):c>=1&&(u=d?"is-due":"is-learning",v=`📦 Hộp ${c}/5${d?" • Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${p.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${K(n.id)}"
                title="Nghe phát âm từ ${K(n.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${K(n.word)}</strong>
                <span class="sq-vocab-ph">[${K(n.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${K(p.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${u}">${v}</div>
          </article>
        `}).join("");return`
      <div class="sq-codex-count">Hiển thị <strong>${r.length}</strong> / ${a.length} mục từ</div>
      <div class="sq-codex-list" role="list">${l}</div>
    `}bindCodexRowSpeakEvents(t,s){t.querySelectorAll("[data-sq-codex-word]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.sqCodexWord??"",o=Jt.find(r=>r.id===a);o&&Pe(o.word,s,.9)})}),t.querySelectorAll("[data-sq-codex-ex]").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.sqCodexEx??"",o=Jt.find(r=>r.id===a);o&&Pe(o.exampleSentence,s,.95)})})}renderChallengeStage(t){const s=pt[t.lang],i=Rs[t.format],a=ve[this.targetCropId],o=this.answeredOutcome!==null,r=t.visualGameKind??(t.format==="vocab_context"?"pic_flashcard":t.format==="dialogue_reply"?"bubble_pop":t.format==="sentence_builder"?"word_tiles":t.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",n=t.heroWord??t.stemText,c=t.heroPhonetic??t.stemPhonetic??"",d=t.heroShortVi??ss(t.translationVi);let p="";r==="pic_flashcard"?p=`
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${K(n)}</div>
            ${c?`<div class="sq-kid-ph-pill">[${K(c)}]</div>`:""}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `:r!=="pic_pairs"&&(p=`
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${l}" alt="${K(d)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${K(d)}</div>
            ${c?`<div class="sq-kid-ph-pill">🔊 [${K(c)}]</div>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `);let u="";if(r==="pic_flashcard"||r==="word_flashcard"){const g=t.choices??[],f=t.choicePhonetics??[],S=t.choiceSprites??[],$=t.choiceSubtitles??[];u=`
        <div class="sq-choice-grid sq-kid-flashcard-grid">
          ${g.map((x,m)=>{let E="";o&&(m===t.correctIndex?E="is-correct":m===this.selectedChoiceIdx?E="is-wrong":E="is-dimmed");const T=S[m]??l,A=$[m]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn sq-kid-flashcard ${r==="pic_flashcard"?"is-pic-mode":"is-word-mode"} ${E}"
                  data-sq-choice="${m}"
                  ${o?"disabled":""}
                >
                  <div class="sq-kid-card-art">
                    <img src="${T}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${K(x)}</span>
                    ${r==="word_flashcard"&&f[m]?`<small class="sq-choice-ph">[${K(f[m])}]</small>`:o&&A?`<small class="sq-choice-ph">${K(A)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(r==="bubble_pop"){const g=t.choices??[],f=t.choicePhonetics??[],S=t.choiceSprites??[];u=`
        <div class="sq-bubble-arena">
          ${g.map(($,x)=>{let m="";o&&(x===t.correctIndex?m="is-correct is-popped":x===this.selectedChoiceIdx?m="is-wrong is-popped":m="is-dimmed");const E=S[x]??l;return`
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${x%4} ${m}"
                  data-sq-choice="${x}"
                  ${o?"disabled":""}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${E}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${K($)}</span>
                  ${f[x]?`<small class="sq-bubble-ph">[${K(f[x])}]</small>`:""}
                </button>
              `}).join("")}
        </div>
      `}else if(t.format==="sentence_builder"){const g=t.shuffledTokens??[],f=t.expectedSentenceTokens??[],S=new Set(this.placedTokenIndices),$=f.map((m,E)=>{const T=this.placedTokenIndices[E],A=T!==void 0?g.find(k=>k.idx===T):void 0;return A?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${E}"
                ${o?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${K(A.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),x=g.map(m=>{const E=S.has(m.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${E?"used":""}"
              data-sq-place="${m.idx}"
              ${E||o?"disabled":""}
            >
              ${K(m.text)}
            </button>
          `}).join("");u=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${$}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${x}</div>
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
      `}else if(t.format==="match_pairs"){const g=t.leftCards??[],f=t.rightCards??[];u=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">${s.flag} 🔊 Thẻ Từ</div>
            ${g.map(S=>{const $=this.matchedPairIds.has(S.pairId),x=this.selectedLeftPairId===S.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${$?"matched":""} ${x?"selected":""}"
                    data-sq-left-pair="${K(S.pairId)}"
                    ${$||o?"disabled":""}
                  >
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${K(S.word)}</span>
                    <small class="sq-pair-ph">[${K(S.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
            ${f.map(S=>{const $=this.matchedPairIds.has(S.pairId),x=this.flashWrongPairKey===S.pairId,m=S.spriteSrc??Vs(S.meaningVi,S.word,S.pairId).spriteSrc,E=S.shortVi??ss(S.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${$?"matched":""} ${x?"wrong-flash":""}"
                    data-sq-right-pair="${K(S.pairId)}"
                    ${$||o?"disabled":""}
                  >
                    <img src="${m}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${K(E)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const v=this.answeredOutcome?this.renderVietnameseExplanationCard(t,this.answeredOutcome):"";return`
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${i.icon} ${K(i.labelVi)}</span>
            ${t.isReview?`<span class="sq-badge sq-badge-review">🔄 Ôn (${t.srsBox??1}/5) • +2 ${a.emoji}</span>`:`<span class="sq-badge sq-badge-reward">🎁 +1–2 ${a.emoji}</span>`}
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

        ${p}
        ${u}
        ${v}
      </div>
    `}renderVietnameseExplanationCard(t,s){const i=this.sim.getSeedCount(this.targetCropId),a=t.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",o=t.heroWord??t.fullSentence,r=t.heroPhonetic??t.fullPhonetic,l=t.heroShortVi??ss(t.translationVi);return`
      <div class="sq-explain-card sq-kid-explain-card ${s.correct?"is-pass":"is-review"}">
        <div class="sq-kid-result-row">
          <img src="${a}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${s.correct?`🎉 <strong>Giỏi lắm!</strong> +${s.seedsAwarded} 🌱 ${K(s.cropName)} • +${s.xpAwarded} ⭐`:`💡 <strong>Thử nhớ từ này nhé!</strong> (+${s.xpAwarded} ⭐)`}
            </div>
            <div class="sq-kid-result-word">
              <strong>${K(o)}</strong>
              <span class="sq-vocab-ph">[${K(r)}]</span>
              <span>= 🇻🇳 <strong>${K(l)}</strong></span>
            </div>
            ${s.buildReduction&&s.buildReduction.reducedSec>0?`<div class="sq-promo-callout">🔨 -${ke(s.buildReduction.reducedSec)} (${K(s.buildReduction.targetName??"công trình")})</div>`:""}
          </div>
          <div class="sq-explain-tts">
            <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tts-btn">🔊</button>
            <button id="btnSqSpeakFullSlow" type="button" class="brass-btn sq-tts-btn">🐢</button>
          </div>
        </div>

        <div class="sq-explain-actions">
          ${i>0?`
                <button id="btnSqExplainSow" type="button" class="brass-btn sq-sow-cta">
                  🌱 Gieo (×${i})
                </button>
              `:""}
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta">
            ➡️ Chơi Tiếp (+1–2 🌱)
          </button>
        </div>
      </div>
    `}bindRenderedEvents(t){t.querySelectorAll("[data-sq-crop-filter]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCropFilter;(l==="all"||l==="flowers"||l==="crops")&&(this.cropFilter=l,this.render())})}),t.querySelectorAll("[data-sq-crop]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCrop;l&&ve[l]&&(this.targetCropId=l,this.render())})}),t.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{const r=this.sim.buyCropSeedWithGold(this.targetCropId,1);this.onToast(r.msg,r.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{const r=this.sim.buyCropSeedWithGold(this.targetCropId,3);this.onToast(r.msg,r.ok?"🌱":"🪙"),this.onRefreshHud(),this.render()}),t.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqBannerSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),t.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()});const s=t.querySelector("#chkSqAutoSpeak");s?.addEventListener("change",()=>{const r=this.sim.ensureLanguageQuiz();r.autoSpeak=s.checked,this.sim.saveToStorage()}),t.querySelectorAll("[data-sq-lang]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqLang,n=this.sim.ensureLanguageQuiz();l&&ds.includes(l)&&n.activeLang!==l&&(n.activeLang=l,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(l),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})}),t.querySelector("#btnSqOpenLeaderboard")?.addEventListener("click",()=>{this.sim.audio.playClick(),this.onOpenLeaderboard?.()}),t.querySelectorAll("[data-sq-subview]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqSubview;if((l==="practice"||l==="codex")&&this.activeSubView!==l){if(this.activeSubView=l,l==="codex"){const n=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(n.activeLang)}this.render()}})});const i=t.querySelector("#inpSqCodexSearch");i&&i.addEventListener("input",()=>{this.codexQuery=i.value;const r=t.querySelector("#sqCodexResultsMount");if(r){const l=this.sim.ensureLanguageQuiz(),n=l.activeLang;r.innerHTML=this.renderLexiconCodexRowsHtml(n,l.profiles[n]),this.bindCodexRowSpeakEvents(r,n)}}),t.querySelectorAll("[data-sq-codex-filter]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqCodexFilter;(l==="all"||l==="mastered"||l==="learning"||l==="unseen")&&(this.codexBoxFilter=l,this.render())})});const a=t.querySelector("#sqCodexResultsMount");if(a){const r=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(a,r.activeLang)}t.querySelectorAll("[data-sq-tier]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqTier,n=this.sim.ensureLanguageQuiz();(l==="beginner"||l==="intermediate"||l==="advanced")&&(Gs(n,n.activeLang,l),this.loadNextQuestion(!0))})}),t.querySelectorAll("[data-sq-format]").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.sqFormat,n=this.sim.ensureLanguageQuiz();ps.includes(l)&&n.preferredFormat!==l&&(n.preferredFormat=l,this.loadNextQuestion(!0))})}),t.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),t.querySelector("#btnSqSpeakNormal")?.addEventListener("click",()=>{if(!this.challenge)return;const r=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Pe(r,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const r=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;Pe(r,this.challenge.lang,.72)}),t.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.fullSentence,this.challenge.lang,.96)}),t.querySelector("#btnSqSpeakFullSlow")?.addEventListener("click",()=>{this.challenge&&Pe(this.challenge.fullSentence,this.challenge.lang,.72)}),t.querySelectorAll("[data-sq-speak-word]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge)return;const l=Number(r.dataset.sqSpeakWord??-1),n=this.challenge.vocabNotes[l];n&&Pe(n.word,this.challenge.lang,.9)})}),t.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),t.querySelectorAll("[data-sq-choice]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqChoice??-1);this.selectedChoiceIdx=l;const n=l===(this.challenge.correctIndex??0);n?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(n)})});const o=()=>{if(!this.challenge||this.answeredOutcome)return!1;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<r.length)return!1;const n=this.placedTokenIndices.map(d=>l.find(p=>p.idx===d)?.text??""),c=n.length===r.length&&n.every((d,p)=>d===r[p]);return c?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(c),!0};t.querySelectorAll("[data-sq-place]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqPlace??-1);if(l>=0&&!this.placedTokenIndices.includes(l)){this.placedTokenIndices.push(l),this.sim.audio.playMatchPop(1);const n=this.challenge.shuffledTokens?.find(d=>d.idx===l),c=this.sim.ensureLanguageQuiz();n&&c.autoSpeak&&Pe(n.text,this.challenge.lang,.95),o()||this.render()}})}),t.querySelectorAll("[data-sq-unplace]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=Number(r.dataset.sqUnplace??-1);l>=0&&l<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(l,1),this.sim.audio.playClick(),this.render())})}),t.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const c=this.placedTokenIndices.length-1;if(l.find(p=>p.idx===this.placedTokenIndices[c])?.text===r[c])break;this.placedTokenIndices.pop()}const n=this.placedTokenIndices.length;if(n<r.length){const c=r[n],d=l.find(p=>p.text===c&&!this.placedTokenIndices.includes(p.idx));d&&(this.placedTokenIndices.push(d.idx),this.sim.audio.playMatchPop(1),o()||this.render())}}),t.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),t.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const r=this.challenge.expectedSentenceTokens??[],l=this.challenge.shuffledTokens??[],n=this.placedTokenIndices.map(d=>l.find(p=>p.idx===d)?.text??""),c=n.length===r.length&&n.every((d,p)=>d===r[p]);this.submitAttempt(c)}),t.querySelectorAll("[data-sq-left-pair]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=r.dataset.sqLeftPair??"";if(!l||this.matchedPairIds.has(l))return;this.selectedLeftPairId=l,this.flashWrongPairKey=null,this.sim.audio.playClick();const n=this.challenge.leftCards?.find(d=>d.pairId===l),c=this.sim.ensureLanguageQuiz();n&&c.autoSpeak&&Pe(n.word,this.challenge.lang,.92),this.render()})}),t.querySelectorAll("[data-sq-right-pair]").forEach(r=>{r.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const l=r.dataset.sqRightPair??"";if(!(!l||this.matchedPairIds.has(l))){if(!this.selectedLeftPairId){this.onToast("👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!","🪄");return}if(this.selectedLeftPairId===l){this.matchedPairIds.add(l),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const n=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=n){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=l,this.sim.audio.playClick(),this.render()}})})}}function y(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Dt=["path","shop","creature","decor","staff"],yt=[{mode:"none",label:"🌡️ Nhiệt"},{mode:"cleanliness",label:"🧹 Vệ Sinh"},{mode:"wonder",label:"✨ Kỳ Diệu"},{mode:"biome",label:"🌿 Sinh Thái"}];function fa(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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

          <button id="btnToggleMapTools" type="button" aria-pressed="false" aria-expanded="false" aria-controls="secondaryMapToolsBar" class="brass-btn" title="Công cụ Sửa &amp; Góc Nhìn">🛠️ Công Cụ</button>
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
    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function ha(e){const t=()=>{e.closeHudPopovers(),e.openMatch3Dialog()},s=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(p=>{p.addEventListener("click",()=>{const u=p.dataset.switchMinigame;e.closeHudPopovers(),!u||u==="match3"?e.openMatch3Dialog():u==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(u)})}),e.root.querySelector("#btnHudStarChip")?.addEventListener("click",s),e.root.querySelector("#btnHudMinigameHub")?.addEventListener("click",s),e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",s),e.root.querySelector("#chipHudGalleons")?.addEventListener("click",s),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnHudHeartChip")?.addEventListener("click",t),e.root.querySelector("#btnPlusGalleons")?.addEventListener("click",s);const i=()=>{e.closeHudPopovers();const p=e.sim.getLastPlayedMinigame();p==="caro"||p==="sudoku"||p==="chess"||p==="blocks"?e.openPuzzleArcadeDialog(p):e.openPuzzleArcadeDialog("caro")};e.root.querySelector("#btnHudSandChip")?.addEventListener("click",i),e.root.querySelector("#btnPlusSand")?.addEventListener("click",i),e.root.querySelector("#btnOpenLeaderboard")?.addEventListener("click",()=>{e.openLeaderboardDialog()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")}),e.root.querySelector("#btnOpenLegalFromMenu")?.addEventListener("click",()=>{e.closeHudPopovers(),document.querySelector(".legal-trigger-btn")?.click()});const a=p=>{p?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",p=>{p.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",a),e.root.querySelector("#chipHudBarn")?.addEventListener("click",a),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded)e.collapseBuildDock(),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null;else{e.closeSeedTray(),e.closePastureTray(),e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.buildSheetOpen=!0;const u=e.selectedCatalogItem?.category;e.activeCategory=u&&Dt.includes(u)?u:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.root.querySelector("#questTrackerPanel")?.classList.toggle("hidden")}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const p=e.sim.getActiveConstructions(Date.now());if(p.length===0)return;const u=p[0],v=se(u.itemId);me(e.cam,u.gx+(v?.width??1)*.5,u.gy+(v?.height??1)*.5),e.inspectSelection={kind:"building",uid:u.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()});const o=e.root.querySelector("#btnHudRoundOrb");if(o){let p=null,u=0,v=0,g=0,f=0,S=!1;o.addEventListener("pointerdown",x=>{if(x.button!==0&&x.pointerType==="mouse")return;const m=o.getBoundingClientRect();p=x.pointerId,u=x.clientX,v=x.clientY,g=m.left,f=m.top,S=!1;try{o.setPointerCapture(x.pointerId)}catch{}}),o.addEventListener("pointermove",x=>{if(p!==x.pointerId)return;const m=x.clientX-u,E=x.clientY-v;if(!S&&Math.hypot(m,E)>7&&(S=!0),S){const T=o.offsetWidth||52,A=o.offsetHeight||62,k=Math.max(6,Math.min(window.innerWidth-T-6,g+m)),C=Math.max(6,Math.min(window.innerHeight-A-6,f+E));o.style.left=`${Math.round(k)}px`,o.style.top=`${Math.round(C)}px`,o.style.right="auto",o.style.bottom="auto"}});const $=x=>{if(p===x.pointerId){p=null;try{o.hasPointerCapture(x.pointerId)&&o.releasePointerCapture(x.pointerId)}catch{}}};o.addEventListener("pointerup",$),o.addEventListener("pointercancel",$),o.addEventListener("click",x=>{if(S){x.preventDefault(),x.stopPropagation(),S=!1;return}e.toggleHudRollup()})}e.root.querySelector("#lblClock")?.addEventListener("click",p=>{p.stopPropagation(),e.toggleWeatherPopover()}),e.root.querySelector("#btnToggleMapTools")?.addEventListener("click",()=>{e.mapToolsExpanded=!e.mapToolsExpanded,e.refreshDock()}),window.addEventListener("pointerdown",p=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const u=p.target;if(!u)return;const v=e.root.querySelector("#managePopoverMenu"),g=e.root.querySelector("#weatherPopoverMenu"),f=e.root.querySelector("#btnToggleManageMenu"),S=e.root.querySelector("#lblClock");v?.contains(u)||g?.contains(u)||f?.contains(u)||S?.contains(u)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const r=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",r),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",r);const l=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",l),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const p=e.root.querySelector("#ribbonUnveilToastCard");p&&p.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const n=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",n),e.root.querySelector("#btnOpenZones")?.addEventListener("click",n),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",n),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const p=yt.findIndex(f=>f.mode===e.sim.heatmapMode),u=yt[(p+1)%yt.length];e.sim.heatmapMode=u.mode;const v=e.root.querySelector("#btnCycleHeatmap"),g=u.mode!=="none";v.textContent=u.label,v.setAttribute("data-active",String(g)),v.setAttribute("aria-pressed",String(g)),g&&e.showToast(`Đã bật ${u.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",()=>{const p=e.gameCanvas.toDataURL("image/png"),u=document.createElement("a");u.href=p,u.download=`cong-vien-phep-thuat-lv${e.sim.state.level}.png`,u.click(),e.showToast("Đã lưu ảnh kỷ niệm công viên (.png)!","📸")}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",p=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const v=p.currentTarget;v.textContent=e.questCollapsed?"+":"–",v.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",p=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const u=p.currentTarget;u.textContent=e.minimapCollapsed?"+":"–",u.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{e.rideCamUid?(bt(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${ft[e.cam.viewRot??0]}!`,"🧭")):e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?(e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")):e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.selectedCatalogItem){e.buildSheetOpen=!0;const p=e.selectedCatalogItem.category;e.activeCategory=Dt.includes(p)?p:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive?(e.pincerActive=!1,e.pincerPicked=null,e.refreshAll()):e.moveModeActive?(e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.refreshAll()):e.bulldozerActive?(e.bulldozerActive=!1,e.pendingTouchTile=null,e.refreshAll()):e.selectedCatalogItem?(e.selectedCatalogItem=null,e.pendingTouchTile=null,e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄"),e.refreshTouchConfirmBar()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshTouchConfirmBar()});const c=p=>{const u=e.minimapCanvas.getBoundingClientRect(),v=(p.clientX-u.left)/u.width*e.minimapCanvas.width,g=(p.clientY-u.top)/u.height*e.minimapCanvas.height,f=e.minimapCanvas.width*.46/Lt,S=e.minimapCanvas.height*.44/Lt,$=(v-e.minimapCanvas.width*.5)/f,x=(g-8)/S,m=($+x)*.5,E=(x-$)*.5,{fgx:T,fgy:A}=fi(m,E,e.cam.viewRot??0),k=Math.max(0,Math.min(Lt-1,T)),C=Math.max(0,Math.min(Lt-1,A));e.rideCamUid=null,me(e.cam,k,C)};let d=!1;e.minimapCanvas.addEventListener("pointerdown",p=>{d=!0,c(p)}),window.addEventListener("pointermove",p=>{d&&c(p)}),window.addEventListener("pointerup",()=>{d=!1}),e.root.querySelectorAll("[data-cat]").forEach(p=>{p.addEventListener("click",()=>{const u=p.dataset.cat;Dt.includes(u)&&(e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.activeCategory===u?(e.activeCategory=null,e.selectedCatalogItem=null):e.activeCategory=u,e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar())})}),e.root.querySelector("#btnPincerTool")?.addEventListener("click",()=>{if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pendingTouchTile=null,e.inspectSelection=null,e.collapseBuildDock();const p=e.sim.staff[0];p&&(e.pincerPicked={kind:"staff",id:p.id,label:p.name}),e.showToast("Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!","🤏")}e.refreshAll()}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.pendingTouchTile=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng Cổng Vào/Ra (${e.rotation*90}°)`,"🔄")}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{e.bulldozerActive=!e.bulldozerActive,e.pendingTouchTile=null,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.collapseBuildDock()),e.refreshAll()}),e.root.querySelector("#btnRotateCam")?.addEventListener("click",()=>{bt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${ft[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.collapseBuildDock(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.collapseBuildDock(),e.refreshAll()}),e.root.querySelector("#btnHomeCam")?.addEventListener("click",()=>{e.rideCamUid=null,e.collapseBuildDock();const p=e.sim.state.buildings.find(u=>u.itemId==="burrow_house_canon");p?me(e.cam,p.gx+1.5,p.gy+1.5):me(e.cam,13.8,18.2),e.refreshAll()}),window.addEventListener("keydown",p=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(p.target instanceof HTMLInputElement||p.target instanceof HTMLTextAreaElement||p.target instanceof HTMLSelectElement||p.target instanceof HTMLElement&&p.target.classList.contains("drag-handle"))&&!(p.ctrlKey||p.metaKey||p.altKey))if(p.key==="n"||p.key==="N")e.openNeighborDialog();else if(p.key==="r"||p.key==="R"){if(e.sim.isVisitingNeighbor)return;e.rotation=(e.rotation+1)%4,e.refreshFloatingBanner(),e.refreshTouchConfirmBar(),e.showToast(`Đã xoay hướng cửa công trình (${e.rotation*90}°)`,"🔄")}else if(p.key==="q"||p.key==="Q")bt(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${ft[e.cam.viewRot??0]}`,"🧭");else if(p.key==="e"||p.key==="E")bt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${ft[e.cam.viewRot??0]}`,"🧭");else if(p.key==="v"||p.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(p.key==="g"||p.key==="G"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!","🏡");return}if(e.pincerActive=!e.pincerActive,e.pincerPicked=null,e.pincerActive){e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock();const u=e.sim.staff[0];u&&(e.pincerPicked={kind:"staff",id:u.id,label:u.name}),e.showToast("Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!","🤏")}e.refreshAll()}else if(p.key==="m"||p.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}e.moveModeActive=!e.moveModeActive,e.movingBuildingUid=null,e.moveModeActive&&(e.selectedCatalogItem=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("Nhấp chọn công trình để di dời miễn phí!","✋")),e.refreshAll()}else if(p.key==="b"||p.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(p.key==="j"||p.key==="J")e.openMatch3Dialog();else if(p.key==="k"||p.key==="K")e.openPuzzleArcadeDialog();else if(p.key==="l"||p.key==="L")e.openLeaderboardDialog();else if(p.key==="h"||p.key==="H")e.toggleHudRollup();else if(p.key==="p"||p.key==="P")e.togglePhotoMode();else if(p.key==="x"||p.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}e.bulldozerActive=!e.bulldozerActive,e.bulldozerActive&&(e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(p.key==="Escape"){if(e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,e.pincerActive=!1,e.pincerPicked=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.pendingTouchTile=null,e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else p.key===" "&&(e.rideCamUid=null,me(e.cam,16,18),e.refreshFloatingBanner())})}function va(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive;const s=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||s),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!s),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),Ls(e),As(e),Kt(e),e.renderTutorialCoach()}function kn(e){return e.photoModeActive?!1:!!e.inspectSelection&&!e.inspectorCollapsed||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function ya(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(Ze(e),Je(e),e.closeSeedTray(),e.closePastureTray()),Kt(e)}function Kt(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const s=kn(e),i=e.hudRolledUp&&!e.photoModeActive&&!s;t.classList.toggle("hud-building-focus",s),t.classList.toggle("hud-compact-rolled",i);const a=e.root.querySelector("#btnToggleHudRollup");a&&(a.setAttribute("aria-pressed",String(e.hudRolledUp)),a.dataset.active=String(e.hudRolledUp),a.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const o=e.root.querySelector("#svgHudRollupChevron");o&&o.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const r=e.root.querySelector("#btnManageToggleHudRollup");r&&(r.textContent=e.hudRolledUp?"📜 Mở HUD":"📜 Ẩn HUD");const l=e.root.querySelector("#btnHudRoundOrb");l&&(l.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||s),l.setAttribute("aria-pressed",String(e.hudRolledUp)),l.dataset.rolled=String(e.hudRolledUp));const n=e.root.querySelector("#lblHudRoundOrbTag");n&&(n.textContent=e.hudRolledUp?"Mở HUD":"Thu HUD");const c=e.root.querySelector("#svgRoundOrbChevron");c&&c.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),s&&(Ze(e),Je(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function Ze(e){e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const t=e.root.querySelector("#managePopoverMenu"),s=e.root.querySelector("#weatherPopoverMenu"),i=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");t?.classList.add("hidden"),s?.classList.add("hidden"),i&&(i.setAttribute("aria-expanded","false"),i.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false")}function Je(e){e.buildSheetOpen=!1,e.activeCategory=null,e.mapToolsExpanded=!1}function Sa(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function wa(e){Je(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null}function Cs(e,t,s){if(!t||!s)return;const i=t.getBoundingClientRect(),a=Math.min(window.innerWidth-16,Math.max(248,s.offsetWidth||336)),o=Math.min(s.offsetHeight||420,window.innerHeight-16),r=i.left<window.innerWidth*.5?i.left:i.right-a,l=Math.max(8,Math.min(r,window.innerWidth-a-8)),n=Math.max(8,Math.min(i.bottom+8,window.innerHeight-o-8));s.style.left=`${Math.round(l)}px`,s.style.top=`${Math.round(n)}px`}function xa(e,t){if(e.sim.isVisitingNeighbor){Ze(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const s=typeof t=="boolean"?t:!e.manageMenuOpen;if(Ze(e),!s)return;e.manageMenuOpen=!0;const i=e.root.querySelector("#managePopoverMenu"),a=e.root.querySelector("#btnToggleManageMenu");i&&a&&(i.classList.remove("hidden"),a.setAttribute("aria-expanded","true"),a.setAttribute("data-active","true"),Cs(e,a,i))}function $a(e,t){const s=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(Ze(e),!s)return;e.weatherPopoverOpen=!0;const i=e.root.querySelector("#weatherPopoverMenu"),a=e.root.querySelector("#lblClock");i&&a&&(Ms(e),i.classList.remove("hidden"),a.setAttribute("aria-expanded","true"),Cs(e,a,i))}function Ms(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const s=Date.now(),i=e.sim.getCurrentWeather(s),a=e.sim.getWeatherForecast(4,s),o=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${o?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${i.icon} ${y(i.labelVi)}</div>
        <div class="weather-current-buff">✨ ${y(i.buffVi)}</div>
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
        ${a.map((r,l)=>{const n=l===0?"Nay":`+${We(Math.max(1,r.startsInSec))}`;return`
              <div class="weather-slot-row ${l===0?"is-now":""}">
                <span>${r.icon} ${y(r.labelVi)}</span>
                <span class="weather-slot-meta">${y(n)}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelectorAll("[data-sim-speed]").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation();const n=r.dataset.simSpeed==="2"?2:1;e.sim.simSpeed=n,jt(e),Ze(e),Ue(e,n===2?"⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!":"🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.",n===2?"⚡":"🌿")})})}function Cn(e,t){const s=e.root.querySelector("#lblGalleons");if(!s)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),s.textContent="∞",e.displayedGalleons=t;return}const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedGalleons<0||i||Math.abs(t-e.displayedGalleons)<=1){e.displayedGalleons=t,s.textContent=Math.round(t).toLocaleString("vi-VN");return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const a=e.displayedGalleons,o=performance.now(),r=420,l=n=>{const c=Math.min(1,(n-o)/r),d=1-Math.pow(1-c,3),p=Math.round(a+(t-a)*d);e.displayedGalleons=p,s.textContent=p.toLocaleString("vi-VN"),c<1?e.galleonRollRaf=requestAnimationFrame(l):(e.displayedGalleons=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(l)}function Ta(e,t,s,i,a){const o=e.root.querySelector(`[data-fly-target="${t}"]`),r=e.root.querySelector("#flyRewardLayer");if(!o||!r)return;const l=()=>{o.classList.remove("hud-chip-pulse"),o.offsetWidth,o.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){l(),e.sim.audio.playFlyTick(0);return}const n=o.getBoundingClientRect();if(n.width<=0&&n.height<=0)return;const c=n.left+n.width*.5,d=n.top+n.height*.5,p=typeof i=="number"&&Number.isFinite(i)?Math.max(24,Math.min(window.innerWidth-24,i)):window.innerWidth*.5,u=typeof a=="number"&&Number.isFinite(a)?Math.max(24,Math.min(window.innerHeight-24,a)):window.innerHeight*.54,v={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},g=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(s))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,s)))));for(let f=0;f<g;f++){const S=document.createElement("div");S.className="fly-reward-token",S.dataset.kind=t,S.textContent=v[t],r.appendChild(S);const $=f/Math.max(1,g)*Math.PI*2+(Math.random()-.5)*.5,x=14+f%3*9,m=p+Math.cos($)*x,E=u+Math.sin($)*x*.7,T=(m+c)*.5+(f%2===0?-42:42),A=Math.min(E,d)-(48+f%3*18),k=560+f*48,C=f*52,M=S.animate([{transform:`translate3d(${m}px, ${E}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${m}px, ${E-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${T}px, ${A}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${c}px, ${d}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:k,delay:C,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});M.onfinish=()=>{S.remove(),l(),e.sim.audio.playFlyTick(f)}}}function Ue(e,t,s="🦉"){const i=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!i)return;const a=Array.from(e.root.querySelectorAll("dialog[open]")),o=a.length>0?a[a.length-1]:null;o?i.parentElement!==o&&(o.appendChild(i),o.addEventListener("close",()=>{const l=Array.from(e.root.querySelectorAll("dialog[open]")),n=l.length>0?l[l.length-1]:e.root;i.parentElement!==n&&n.appendChild(i)},{once:!0})):i.parentElement!==e.root&&e.root.appendChild(i);const r=document.createElement("div");r.className="parchment-dark owl-toast",r.textContent=`${s} ${t}`,i.appendChild(r),window.setTimeout(()=>r.remove(),3500)}function ka(e,t){const s=Math.max(1,Math.round(t.awaySeconds/60)),i=e.root.querySelector("#offlineDialogContent");i.innerHTML=`
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${s} phút</strong></div>
        <div>🪙 Vàng: <strong>+${t.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${t.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${t.buildingsFinished}</strong></div>
      </div>
    `,e.root.querySelector("#offlineDialog").showModal()}function Ls(e){const t=e.root.querySelector("#floatingModeBanner"),s=e.root.querySelector("#floatingBannerText"),i=e.root.querySelector("#btnFloatingSecondary"),a=e.root.querySelector("#btnFloatingSwap"),o=e.root.querySelector("#btnFloatingExit");if(!(!t||!s||!i||!a||!o)){if(a.classList.add("hidden"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const r=e.sim.state.buildings.find(n=>n.uid===e.rideCamUid),l=r?se(r.itemId):void 0;if(!r||!l)e.rideCamUid=null;else{t.classList.remove("hidden"),s.textContent=`🎥 ${l.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,i.textContent="🧭 90°",i.classList.remove("hidden"),o.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),s.textContent=e.pincerPicked?`🤏 ${e.pincerPicked.label}`:"🤏 Gắp nhân sự",i.classList.add("hidden"),o.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const r=e.sim.state.buildings.find(n=>n.uid===e.movingBuildingUid),l=r?se(r.itemId):void 0;s.textContent=`✋ ${l?.name??"Dời chỗ"}`,i.textContent=`🔄 ${e.rotation*90}°`,i.classList.remove("hidden"),o.textContent="✕"}else s.textContent="✋ Chọn công trình để dời",i.classList.add("hidden"),o.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),s.textContent="🧹 Phá dỡ",i.classList.add("hidden"),o.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const r=e.selectedCatalogItem,l=r.category!=="path"&&r.category!=="terrain"&&!r.isFarmlandPlot&&!r.connectableGroup&&!r.isZooFence,n=e.sim.getEffectiveItemStarCost(r),c=n>0?`🌟 ${n}`:r.cost===0?"0G":`${r.cost.toLocaleString("vi-VN")}G`;t.classList.remove("hidden"),s.textContent=`🏗️ ${r.name} • ${c}`,l?(i.textContent=`🔄 ${e.rotation*90}°`,i.classList.remove("hidden")):i.classList.add("hidden"),a.textContent="📦 Đổi",a.classList.remove("hidden"),o.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const r=ve[e.activeSeedCropId],l=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),s.textContent=`🌱 ${r.emoji} ${r.name} (${l})`,i.textContent="🌱 Đổi",i.classList.remove("hidden"),o.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const r=Ye[e.activePastureAnimalId];t.classList.remove("hidden"),s.textContent=`🐾 ${r.emoji} ${r.name} (${r.cost.toLocaleString("vi-VN")}G)`,i.textContent="🐾 Đổi",i.classList.remove("hidden"),o.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),s.textContent="👁️ Nhìn xuyên",i.classList.add("hidden"),o.textContent="✕";return}t.classList.add("hidden")}}function As(e){const t=e.root.querySelector("#touchConfirmBar"),s=e.root.querySelector("#lblTouchConfirm");if(!(!t||!s)){if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}t.classList.remove("hidden"),s.textContent=`📍 ${e.pendingTouchTile.label}`}}function Ut(e){const t=e.sim.isVisitingNeighbor;t&&(e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Mn(e),An(e),En(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),Ls(e),As(e),Kt(e),e.renderTutorialCoach()}function jt(e){const t=new Date,s=String(t.getHours()).padStart(2,"0"),i=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const a=e.sim.getCurrentWeather(t.getTime()),o=e.root.querySelector("#lblClock");if(o){const u=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";o.innerHTML=`${a.icon} <span>${s}:${i}</span>${u}`}e.weatherPopoverOpen&&Ms(e);const r=e.sim.getActiveFestival(t),l=e.root.querySelector("#lblFestival");l&&(r==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):r==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 +25% 🪙"):r==="quidditch_cup"?(l.classList.remove("hidden"),l.textContent="🏆 +Cúp"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const n=e.sim.state,c=e.root.querySelector("#lblPuzzleHearts");if(c&&n.match3)if(n.sandboxMode)c.textContent="∞";else if(n.match3.hearts>=Gt)c.textContent=`${n.match3.hearts}/${Gt}`;else{const u=Math.max(0,Math.ceil((n.match3.nextHeartAt-Date.now())/1e3)),v=Math.floor(u/60),g=String(u%60).padStart(2,"0");c.textContent=`${n.match3.hearts} (${v}:${g})`}const d=e.root.querySelector("#btnHudActiveBuilds"),p=e.root.querySelector("#lblActiveBuilds");if(d&&p){const u=e.sim.getActiveConstructions(Date.now());if(u.length===0)d.classList.add("hidden");else{d.classList.remove("hidden");const v=Math.max(1,Math.ceil((u[0].constructEndsAt-Date.now())/1e3));p.textContent=`${u.length} (${We(v)})`}}}function Mn(e){const t=e.sim.state,s=e.sim.getRequiredLevelTrial(),i=Math.max(0,t.xp)%gt,a=Math.max(6,Math.min(100,i/gt*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+an(t.level),e.root.querySelector("#barXpFill").style.width=`${a}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const r=e.root.querySelector("#lblParkRibbonName");if(r){const U=e.sim.getActiveVisitingNeighbor();r.textContent=U?`🚂 Thăm: ${U.avatarEmoji} ${U.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const l=e.sim.getWinsProgressForCurrentLevel(),n=e.sim.getTotalTowerClearedStages(),c=t.level>=Ve?100:Math.min(100,Math.max(8,Math.round(l.current/Math.max(1,l.required)*100))),d=e.root.querySelector("#btnOpenRoadmap");d&&(d.style.setProperty("--hg-lvl-pct",String(c)),d.title=t.level>=Ve?`👑 Cấp Tối Đa ${Ve} • Rương XP: ${i}/${gt} • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn • Rương XP: ${i}/${gt}`);const p=e.root.querySelector("#barLevelTopFill");p&&(p.style.width=`${c}%`,p.parentElement&&(p.parentElement.title=t.level>=Ve?`👑 Đã đạt Cấp Tối Đa ${Ve} • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${l.current}/${l.required} màn mới • Tháp 5 Môn: ${n.cleared.toLocaleString("vi-VN")}/${n.total.toLocaleString("vi-VN")} Màn`));const u=e.root.querySelector("#lblXpFraction");u&&(u.textContent=`🎁 ${i}/${gt}`);const v=e.sim.ensureFarmBarn(),g=e.sim.getBarnTotalUsed(),f=e.root.querySelector("#lblStorageBarn");f&&(f.textContent=`${g}/${v.capacity}`),Cn(e,t.galleons);const S=t.sandboxMode?"∞":String(t.match3?.stars??0),$=e.root.querySelector("#lblPuzzleStars");$&&t.match3&&($.textContent=S);const x=e.root.querySelector("#lblHudHubStars");x&&(x.textContent=S);const m=e.root.querySelector("#lblHudHubTrial");m&&(t.level>=Ve||t.sandboxMode||e.sim.isHeadmasterPreview||!s?m.textContent=`♟️ ${n.cleared}/${n.total}`:m.textContent=`🔥 ${s.icon} ${l.current}/${l.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const E=e.sim.getDisciplineStageInfo("match3"),T=e.sim.getLastPlayedMinigame();let A="🍬 Bùa Gặt",k="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.png",C=E.isMaxed?`👑 ${Re}`:`Màn ${E.currentStage}`;if(T==="caro"){const U=e.sim.getDisciplineStageInfo("caro");A="🗺️ Ngũ Ấn",k="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",C=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(T==="sudoku"){const U=e.sim.getDisciplineStageInfo("sudoku");A="🔢 Số Học",k="/trang-trai-hang-soc/sprites/m3_piece_scroll.png",C=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(T==="blocks"){const U=e.sim.getDisciplineStageInfo("blocks");A="🦄 Sinh Vật",k="/trang-trai-hang-soc/sprites/beast_niffler.png",C=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else if(T==="chess"){const U=e.sim.getDisciplineStageInfo("chess");A="🏰 Cờ Phù Thủy",k="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.png",C=U.isMaxed?`👑 ${Re}`:`Màn ${U.currentStage}`}else T==="seedquiz"&&(A="🪄 Thần Chú",k="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.png",C="Ôn Tập");const M=e.root.querySelector("#imgCornerPlayIcon");M&&M.getAttribute("src")!==k&&M.setAttribute("src",k);const D=e.root.querySelector("#badgeCornerPlayBonus");D&&(D.textContent=A,D.classList.remove("hidden"));const F=e.root.querySelector("#lblCornerPlayStage");F&&(F.textContent=C);const L=e.root.querySelector("#lblCornerPlaySub");L&&(L.textContent=t.level>=Ve?`👑 Cấp ${Ve}`:`Cấp ${t.level+1} (${l.current}/${l.required})`);const N=e.root.querySelector("#btnCornerPlayPuzzle");if(N){const U=`Chơi tiếp ${A} — ${C}`;N.title=U,N.setAttribute("aria-label",U)}e.root.querySelectorAll("[data-switch-minigame]").forEach(U=>{const ge=U.dataset.switchMinigame===T;U.dataset.active=String(ge),U.setAttribute("aria-pressed",String(ge))});const O=e.root.querySelector("#badgeBuildReadyCount");if(O){const U=new Set(t.buildings.map(He=>He.itemId)),ge=t.sandboxMode?999:t.match3?.stars??0,we=on.filter(He=>{if(He.isThemeParkLegacy)return!1;const dt=ei(He);return dt<=0||!t.sandboxMode&&t.level<He.unlockLevel?!1:!U.has(He.id)&&ge>=dt}).length;we>0&&!e.sim.isHeadmasterPreview?(O.textContent=String(we),O.classList.remove("hidden")):O.classList.add("hidden")}const ne=e.root.querySelector("#lblMatch3Lv");ne&&t.match3&&(ne.textContent=E.isMaxed?`👑${Re}`:`${E.currentStage}/${Re}`);const P=e.root.querySelector("#lblArcadeTowerLv");if(P){const U=Math.max(0,n.cleared-E.clearedStages),ge=Re*4;P.textContent=U>=ge?`👑${ge}`:`${U}/${ge}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const V=e.sim.getActiveStoryQuest(),W=e.sim.getReadyOwlOrdersCount(),B=(V?.completed?1:0)+t.owlQuests.filter(U=>U.completed&&!U.claimed).length+t.dailyQuests.filter(U=>U.completed&&!U.claimed).length,_=W+B,re=_>0?_:v.owlOrders.length,ie=e.root.querySelector("#badgeQuestCount");re>0?(ie.textContent=String(re),ie.classList.toggle("is-ready-green",W>0),ie.classList.remove("hidden")):ie.classList.add("hidden");const X=t.supply.cargoCrates.filter(U=>!U.fulfilled&&(t.sandboxMode||(t.supply.goods[U.goodId]??0)>=U.qtyRequired)).length,ce=e.root.querySelector("#badgeWorkshopCount");ce&&(X>0?(ce.textContent=String(X),ce.classList.remove("hidden")):ce.classList.add("hidden"));const le=Object.values(t.housePoints).reduce((U,ge)=>U+ge,0)>=t.houseCupMilestoneTier*300;e.root.querySelector("#badgeCardCount").classList.toggle("hidden",!le),e.refreshSuitcaseBadge();const J=e.root.querySelector("#badgeSuitcaseCount"),Te=J&&!J.classList.contains("hidden")?Math.max(0,Number.parseInt(J.textContent||"0",10)||0):0,ze=e.sim.getClaimableHarvestFeastCount(),ae=e.root.querySelector("#badgeManageMenuDot");if(ae){const U=X+(le?1:0)+ze+Te;U>0?(ae.textContent=String(U),ae.classList.remove("hidden")):ae.classList.add("hidden")}Ln(e),jt(e);const Se=e.root.querySelector("#btnCycleHeatmap");if(Se){const U=yt.find(we=>we.mode===e.sim.heatmapMode)??yt[0],ge=e.sim.heatmapMode!=="none";Se.textContent=U.label,Se.dataset.active=String(ge),Se.setAttribute("aria-pressed",String(ge))}jt(e)}function Ln(e){const t=e.sim.state,s=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,i=t.buildings.some(o=>!!se(o.itemId)?.isCreatureHabitat),a=(t.match3?.hearts??Gt)>=Gt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",a),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",s&&!i),e.root.querySelector('[data-cat="staff"]')?.classList.toggle("hidden",s&&e.activeCategory!=="staff"),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const o=e.root.querySelector("#btnToggleMinimap");o&&(o.textContent="–",o.setAttribute("aria-expanded","true"))}}function An(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const s=e.sim.state,i=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const a=e.sim.getActiveStoryQuest(),o=s.owlQuests.slice(0,2);let r="";if(i&&!s.sandboxMode&&!e.sim.isHeadmasterPreview){const l=e.sim.getWinsProgressForCurrentLevel(),n=e.sim.getDisciplineStageInfo(i.kind);r+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${i.icon} ${y(i.shortVi)} (${n.currentStage}/${Re}) • ${l.current}/${l.required}</span>
            <button type="button" data-open-trial="${i.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(a){const l=Math.min(100,Math.round(a.progress/Math.max(1,a.targetAmount)*100)),n=e.sim.getStoryAutoActionPreview();r+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${y(a.giverEmoji)} ${y(a.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(a.progress,a.targetAmount)}/${a.targetAmount}</span>
            ${a.completed?`<button type="button" data-claim="${y(a.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${a.rewardGalleons}G</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${y(n.longLabel)}">${y(n.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const l of o){const n=Math.min(100,Math.round(l.progress/Math.max(1,l.targetAmount)*100));r+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${y(l.giverEmoji)} ${y(l.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${n}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(l.progress,l.targetAmount)}/${l.targetAmount}</span>
            ${l.completed?`<button type="button" data-claim="${y(l.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${l.rewardGalleons}🪙 +${l.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=r,t.querySelectorAll("[data-claim]").forEach(l=>{l.addEventListener("click",()=>{e.sim.claimQuest(l.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(l=>{l.addEventListener("click",()=>{e.openTrialMinigame(l.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(l=>{l.addEventListener("click",()=>{const n=e.sim.completeStoryStepWithStar();if(n.ok){typeof n.placedGx=="number"&&typeof n.placedGy=="number"&&me(e.cam,n.placedGx,n.placedGy);return}Ue(e,n.msg,n.reason==="missing_gold"?"🪙":"🌟"),(n.reason==="missing_stars"||n.reason==="locked_level"||n.reason==="open_match3")&&e.openTrialMinigame()})})}function En(e){const t=(g,f)=>{g&&(g.setAttribute("data-active",String(f)),g.setAttribute("aria-pressed",String(f)))};e.root.querySelectorAll("[data-cat]").forEach(g=>{t(g,g.dataset.cat===e.activeCategory)}),t(e.root.querySelector("#btnPincerTool"),e.pincerActive),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const s=e.root.querySelector("#btnRotateCam");if(s){const g=e.cam.viewRot??0;s.textContent=ft[g],t(s,g!==0)}t(e.root.querySelector("#btnCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnGrid"),e.sim.state.settings.showGrid);const i=e.mapToolsExpanded||!!e.activeCategory,a=e.root.querySelector("#secondaryMapToolsBar"),o=e.root.querySelector("#btnToggleMapTools");a&&a.classList.toggle("hidden",!i),o&&(o.setAttribute("aria-expanded",String(i)),t(o,i));const r=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=r||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",r),t(e.root.querySelector("#btnToggleBuildDock"),l);const c=e.root.querySelector("#buildDrawer"),d=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!Dt.includes(e.activeCategory)){e.activeCategory=null,c.classList.add("hidden"),d.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}if(c.classList.remove("hidden"),d.classList.add("hidden"),e.activeCategory==="staff"){qn(e,c);return}const p=on.filter(g=>g.category===e.activeCategory&&g.category!=="terrain"&&!g.isThemeParkLegacy),u=e.sim.state.level,v=e.sim.state.sandboxMode;c.innerHTML=p.map(g=>{const f=!v&&u<g.unlockLevel,S=e.selectedCatalogItem?.id===g.id,$=g.elevationDelta?g.elevationDelta>0?"⛰️":"⛏️":g.isCoasterTrackPiece?"🛤️":g.isZooFence?"🚧":g.isBench?"🪑":g.category==="path"?"🛣️":g.category==="terrain"?"🌿":"🕯️",x=g.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${g.spriteKey}.png" alt="${g.name}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${$}</div>`,m=e.sim.getEffectiveItemStarCost(g),E=g.buildDurationSec>0?`🔨 ${ke(g.buildDurationSec)}`:"⚡",T=f?`🔒 Cấp ${g.unlockLevel}`:m>0?`🌟 ${m} • ${E}`:`🪙 ${g.cost.toLocaleString("vi-VN")}G`;return`
          <button
            type="button"
            class="catalog-card ${f?"locked":""}"
            data-item-id="${g.id}"
            data-selected="${S}"
            aria-pressed="${S}"
            ${f?'aria-disabled="true"':""}
          >
            ${x}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${y(g.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${T}</div>
          </button>
        `}).join(""),c.querySelectorAll("[data-item-id]").forEach(g=>{g.addEventListener("click",()=>{const f=se(g.dataset.itemId);if(!f)return;if(!e.sim.state.sandboxMode&&e.sim.state.level<f.unlockLevel){const $=e.sim.getWinsProgressForCurrentLevel();let x=Math.max(1,$.required-$.current);for(let m=e.sim.state.level+1;m<f.unlockLevel;m++)x+=ti(m);Ue(e,`🔒 Bản vẽ "${f.name}" mở ở Cấp Giải Đố ${f.unlockLevel} — Cần thắng thêm ${x.toLocaleString("vi-VN")} màn Giải Đố mới!`,"🧩"),e.openTrialMinigame();return}const S=e.sim.getEffectiveItemStarCost(f);if(!e.sim.state.sandboxMode&&S>0&&e.sim.state.match3.stars<S){const $=S-e.sim.state.match3.stars;Ue(e,`Cần thêm ${$} 🌟 Sao Phép Thuật (${e.sim.state.match3.stars}/${S} 🌟) để dựng "${f.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,"🌟"),e.openTrialMinigame();return}e.selectedCatalogItem=f,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,Je(e),Ut(e)})})}function qn(e,t){const s=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],i=new Set(e.sim.state.unlockedZones),a=l=>`<option value="all" ${l==="all"?"selected":""}>🗺️ Toàn công viên</option>`+$s.filter(n=>e.sim.state.sandboxMode||i.has(n.id)).map(n=>`<option value="${n.id}" ${l===n.id?"selected":""}>📍 ${n.name}</option>`).join(""),o=s.map(l=>{const n=e.sim.state.staffHired[l.key],c=n>=qt,d=l.baseCost*(1+n);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${l.icon} <span style="font-size:12px;font-weight:800;">${n}/${qt}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${l.name}</div>
            <button
              type="button"
              data-hire="${l.key}"
              class="brass-btn ${c?"":"gold-cta"}"
              ${c?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${c?`✓ ${qt}/${qt}`:`+ 🪙 ${d}`}
            </button>
          </div>
        `}).join(""),r=e.sim.staff.map(l=>{const n=e.sim.state.staffPatrolZones?.[l.id]??l.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${y(l.name)}</div>
            <select data-patrol-staff="${y(l.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${a(n)}
            </select>
            <button type="button" data-pick-staff="${y(l.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=o+r,t.querySelectorAll("[data-hire]").forEach(l=>{l.addEventListener("click",()=>{const n=l.dataset.hire;e.sim.hireStaff(n)&&(Je(e),Ut(e),Ue(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(l=>{l.addEventListener("change",()=>{const n=l.dataset.patrolStaff;e.sim.setStaffPatrolZone(n,l.value),Ue(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(l=>{l.addEventListener("click",()=>{const n=e.sim.staff.find(c=>c.id===l.dataset.pickStaff);n&&(e.pincerActive=!0,e.pincerPicked={kind:"staff",id:n.id,label:n.name},Je(e),Ut(e),Ue(e,`Đang gắp ${n.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`,"🤏"))})})}function Ca(e){const t=e.mapToolsExpanded||!!e.activeCategory,s=e.root.querySelector("#secondaryMapToolsBar"),i=e.root.querySelector("#btnToggleMapTools");s&&s.classList.toggle("hidden",!t),i&&(i.setAttribute("aria-expanded",String(t)),i.setAttribute("data-active",String(t)),i.setAttribute("aria-pressed",String(t)))}function pe(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const s=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`;if(s!==e.lastInspectedKey&&(e.lastInspectedKey=s,e.inspectorCollapsed=!1),t.classList.toggle("inspector-collapsed",e.inspectorCollapsed),e.inspectSelection.kind==="building"){const i=e.inspectSelection.uid,a=e.sim.state.buildings.find(L=>L.uid===i);if(!a){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=se(a.itemId),r=Date.now(),l=r<a.constructEndsAt,n=Math.max(0,Math.ceil((a.constructEndsAt-r)/1e3)),c=e.sim.getBuildingProductionPerCycle(a,o),d=hi(o,a.stars),p=(e.sim.rideQueues.get(a.uid)??[]).length,u=e.sim.isBuildingConnected(a.uid),v=e.sim.activeSynergies.buildingGoldMult.get(a.uid)??1,g=e.sim.activeSynergies.buildingXpMult.get(a.uid)??1,f=o.category==="ride"&&!o.isCoasterTrackPiece,S=!!o.isCustomCoasterStation&&!l,$={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"},x=o.isCreatureHabitat?e.sim.biomeCache.get(a.uid):void 0,m=o.isBackstage?e.sim.backstageCache.get(a.uid):void 0,E=!!o.ticketPrice&&!l&&!o.workshopGroupId,T=vi(o),A=e.sim.getEffectivePrice(a,o),k=e.sim.getPriceValueVerdict(a,o),C=o.isFarmlandPlot&&!l?(()=>{if(!a.cropId){const ie=Object.values(ve).sort((ae,Se)=>ae.unlockLevel-Se.unlockLevel||ae.growSec-Se.growSec),X=ie.filter(ae=>ae.isFlowerCrop).length,ce=ie.length-X,fe=ie.filter(ae=>e.seedFilterMode==="flowers"?!!ae.isFlowerCrop:e.seedFilterMode==="crops"?!ae.isFlowerCrop:!0),le=[{id:"all",label:`🌱 (${ie.length})`},{id:"flowers",label:`🌸 (${X})`},{id:"crops",label:`🌾 (${ce})`}].map(ae=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===ae.id?"active":""}"
                        data-insp-seed-filter="${ae.id}"
                        aria-pressed="${e.seedFilterMode===ae.id}"
                      >${ae.label}</button>
                    `).join(""),ue=fe.map(ae=>{const Se=!e.sim.state.sandboxMode&&e.sim.state.level<ae.unlockLevel,U=e.sim.getSeedCount(ae.id),ge=e.sim.getFarmItemCount(ae.id),we=ke(ae.growSec);return`
                      <button
                        type="button"
                        class="seed-card ${Se?"locked":""} ${!Se&&U<=0?"out-of-seeds":""}"
                        data-plant-crop="${ae.id}"
                        ${Se?"disabled":""}
                      >
                        <img src="${St(ae.id)}" alt="${y(ae.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${y(ae.name)}</span>
                        <span class="seed-card-seed-badge ${U>0?"has-seed":"no-seed"}">
                          ${Se?`🔒 Lv.${ae.unlockLevel}`:U>0?`🌱 ×${U}`:"🎓 +Hạt"}
                        </span>
                        <span class="seed-card-meta">
                          ${Se?`⏱️ ${we}`:`⏱️ ${we} • 🪙${ae.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${ge}</span>
                      </button>
                    `}).join(""),J=e.sim.state.plotSoilState?.[`${a.gx},${a.gy}`],Te={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"};return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    ${J?.lastFamily?`<div style="font-size:11px;font-weight:800;color:var(--teal-deep);margin-bottom:6px;">♻️ Luân canh: vừa gặt họ <strong>${Te[J.lastFamily]??J.lastFamily}</strong> — gieo họ khác nhận <strong>×2 sản lượng</strong> & giảm mỏi đất!</div>`:""}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${le}</div>
                    <div class="seed-picker-grid">${ue}</div>
                  </div>
                `}const L=ve[a.cropId],N=a.cropReadyAt??r,O=a.cropPlantedAt??N-L.growSec*1e3,ne=Math.max(0,Math.ceil((N-r)/1e3)),P=ne<=0,V=e.sim.state.cropMastery?.[L.id]??0,W=ai(V),B=Math.max(0,e.sim.state.morningDewPhials??0),_=L.yieldQty*(a.cropRotatedBonus?2:1),re=P?100:Math.max(6,Math.min(98,Math.round((r-O)/Math.max(1e3,N-O)*100)));return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${St(L.id)}" alt="${y(L.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${y(L.name)} <span style="font-size:11px;color:var(--amber-deep);">• Bậc ${W.labelRom}</span></div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${P?"🌾 Chín!":`⏱️ ${We(ne)}`}${a.cropRotatedBonus?" • 🌟 Luân canh ×2":""}
                      </div>
                      <div style="font-size:10.5px;opacity:0.76;">Thông thạo: ${V} vụ • Họ ${si(L.id)}</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${re}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${P?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                            Gặt (+${_})
                          </button>
                        `:a.cropWateredBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">💧 Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              💧 Tưới (-30%)
                            </button>
                          `}
                    ${!P&&(B>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${B})
                          </button>`:""}
                  </div>
                </div>
              `})():"",M=o.workshopGroupId&&!l?(()=>{const L=e.sim.getWorkshopRecipesForBuilding(o),N=a.workshopQueue??[],O=a.readyFarmGoods??[],ne=3+Math.min(2,Math.max(0,a.stars-1)),P=O.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${O.slice(0,5).map(ie=>{const X=nt[ie];return`<img src="/trang-trai-hang-soc/sprites/${X.iconKey}.png" alt="${y(X.name)}" title="${y(X.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${O.length})
                      </button>
                    </div>
                  `:"",V=L.map(ie=>{const X=nt[ie.goodId],ce=!e.sim.state.sandboxMode&&e.sim.state.level<ie.unlockLevel,fe=!ce&&(e.sim.state.sandboxMode||ie.inputs.every(ue=>e.sim.getFarmItemCount(ue.itemId)>=ue.qty)),le=ie.inputs.map(ue=>{const J=Ne(ue.itemId),Te=e.sim.getFarmItemCount(ue.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||Te>=ue.qty?"ok":"lack"}">${y(J.name)} ${e.sim.state.sandboxMode?"∞":Te}/${ue.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${fe?"craftable":""} ${ce?"locked":""}"
                      data-ws-enqueue="${ie.id}"
                      ${ce?"disabled":""}
                    >
                      <div class="ws-recipe-name">${y(X.name)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${X.iconKey}.png" alt="${y(X.name)}" class="ws-recipe-img" />
                        ${fe?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${ce?`🔒 Lv.${ie.unlockLevel}`:le}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${ke(ie.craftSec)}</div>
                    </button>
                  `}).join(""),W=N[0],B=W?Math.max(0,Math.ceil((W.endsAt-r)/1e3)):0,_=W?nt[W.goodId]:null,re=Array.from({length:Math.max(1,ne-1)},(ie,X)=>{const ce=N[X+1];if(ce){const fe=nt[ce.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${y(fe.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${fe.iconKey}.png" alt="${y(fe.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return X===N.length-(W?1:0)?`
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
                    <span>🔥 ${y(o.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${P}
                  <div class="ws-recipe-grid">${V}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${W?"baking":""}">
                      <div class="ws-oven-arch">
                        ${_?`<img src="/trang-trai-hang-soc/sprites/${_.iconKey}.png" alt="${y(_.name)}" class="ws-oven-good-img" />`:'<span style="font-size:20px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${W?`<strong>${We(B)}</strong>`:"<strong>Trống</strong>"}
                      </div>
                      ${W?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${re}</div>
                  </div>
                </div>
              `})():"",D=o.isAnimalPasturePlot&&!l?(()=>{if(!a.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(Ye).map(_=>{const re=!e.sim.state.sandboxMode&&e.sim.state.level<_.unlockLevel,ie=_.goodId?Ne(_.goodId):null;return`
                      <button
                        type="button"
                        class="seed-card ${re?"locked":""}"
                        data-stock-animal="${_.id}"
                        ${re?"disabled":""}
                      >
                        <img src="/trang-trai-hang-soc/sprites/${_.spritePair[0]}.png" alt="${y(_.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${y(_.name)}</span>
                        <span class="seed-card-seed-badge ${re?"no-seed":"has-seed"}">
                          ${re?`🔒 Lv.${_.unlockLevel}`:`🪙 ${_.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${ke(_.cycleSec)} • +${_.sellValue}G</span>
                        <span class="seed-card-stock">${ie?`+${_.yieldQty} ${y(ie.name)}`:"Sản vật"}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const L=Ye[a.pastureAnimalId],N=a.pastureReadyAt??r,O=a.pastureStockedAt??N-L.cycleSec*1e3,ne=Math.max(0,Math.ceil((N-r)/1e3)),P=ne<=0,V=P?100:Math.max(6,Math.min(98,Math.round((r-O)/Math.max(1e3,N-O)*100))),W=L.goodId?Ne(L.goodId):null;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${L.spritePair[0]}.png" alt="${y(L.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${y(L.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${P?`🧺 +${L.sellValue}G${W?` +${L.yieldQty} ${y(W.name)}`:""}`:`⏱️ ${We(ne)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${V}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${P?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${L.sellValue}G)
                          </button>
                        `:a.pastureFedBoost?'<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>':`
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!P&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"";t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((o.workshopGroupId||o.isFarmlandPlot||o.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${o.spriteKey?`<img src="/trang-trai-hang-soc/sprites/${o.spriteKey}.png" alt="${y(o.name)}" class="inspector-thumb" />`:""}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${y(o.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${"★".repeat(a.stars)}${"☆".repeat(5-a.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${o.isFarmlandPlot?"🌱 Ruộng":o.isAnimalPasturePlot?"🐾 Đồng cỏ":o.connectableGroup==="flower_garden"?"🌸 Vườn hoa":o.workshopGroupId?"🔥 Xưởng":`👥 ${a.visitorsServed}`}${f?` • 🎟️ ${p}/${yi}`:""}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${C}
        ${D}
        ${M}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${u?"#15803d":"#dc2626"};">
            ${u?"🟢 Đã nối đường":"🚧 Chưa nối đường (25%)"}
          </div>
          ${v>1?`<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((v-1)*100)}%G • +${Math.round((g-1)*100)}%XP</div>`:""}
          ${o.producesIngredient?`<div style="color:#5c2d0c;">🌿 Rơi: <strong>${wt[o.producesIngredient].emoji} ${wt[o.producesIngredient].name}</strong></div>`:""}
        </div>

        ${l?(()=>{const L=Math.max(0,a.buildReducedSec??0),N=Math.max(1e3,o.buildDurationSec*1e3,a.constructEndsAt-(a.placedAt||r-1e3)+L*1e3),O=Math.max(1,Math.min(99,Math.floor((1-(a.constructEndsAt-r)/N)*100))),ne=e.sim.getBuildingMinFloorSec(a),P=Math.max(0,n-ne),V=P<=0&&e.sim.getActiveConstructions(r).some(_=>_.uid!==a.uid&&Math.ceil((_.constructEndsAt-r)/1e3)>e.sim.getBuildingMinFloorSec(_)),W=P>0||V,B=o.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${o.isCreatureHabitat?"🥚 Đang ấp":"🔨 Đang xây"}</span>
                      <span>${O}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${O}" aria-label="${B}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${We(n)}</strong>${L>0?` • <span style="color:var(--teal-deep);">-${ke(L)}</span>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${W?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${W?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${P>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút thi công">
                              🧪 Sương Mai (-15p • ×${e.sim.state.morningDewPhials??0})
                            </button>`:""}
                      ${e.sim.state.sandboxMode?`<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1;" title="Hoàn tất ngay">
                              ⚡ Xong ngay
                            </button>`:""}
                    </div>
                  </div>
                `})():a.awaitingUnveil?`
                <div class="quest-card-mini feast-unveil-insp-card">
                  <div class="feast-unveil-insp-title">🎀 Hoàn thiện!</div>
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:7px;">
                    🎀 Cắt Băng
                  </button>
                </div>
              `:o.baseIncome>0?(()=>{const L=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,N=ni(a,o),O=Math.max(1,N*L),ne=Math.max(0,(r-(a.lastTickAt||r))/1e3),P=Math.max(1,Math.ceil(O-ne%O));return`
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${c.galleons}🪙 +${c.xp}⭐</strong> / ${ke(N)}</div>
                      ${o.cycleSec>0&&!o.isFarmlandPlot&&!o.isAnimalPasturePlot?`<div style="margin-top:3px;">⏱️ <strong>${We(P)}</strong> • Kho: <strong>${a.storedGalleons}🪙</strong></div>`:`<div style="margin-top:3px;">Kho: <strong>${a.storedGalleons}🪙</strong></div>`}
                      ${a.storedGalleons>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${a.storedGalleons}G)</button>`:""}
                    </div>
                  `})():""}

        ${f&&!l&&!o.isFlooPortal?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>⚙️ Độ bền:</span>
                  <span style="color:${a.isBrokenDown?"#dc2626":a.durability<50?"#b45309":"#15803d"};">${Math.round(a.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(a.durability)}" aria-label="Độ bền"></progress>
                ${a.isBrokenDown||a.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${a.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">
                        🪄 Sửa (0G)
                      </button>`:""}
              </div>
            `:""}

        ${E?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${T.min}–${T.max}G):</span>
                  <span id="lblBuildingPriceVal">${A}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${T.min}" max="${T.max}" value="${A}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${k.color};">
                  ${k.label}
                </div>
              </div>
            `:""}

        ${o.isCustomCoasterStation&&a.coasterStats&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${a.coasterStats.lengthMeters}m • 🔥 ${a.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `:""}

        ${S?`
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
                  <strong>🐾 ${y(a.creatureNickname||o.creatureName||o.name)}</strong>
                  <span class="morph-pill ${a.creatureMorph==="radiant"?"radiant":a.creatureMorph==="mystic"?"mystic":""}">
                    ${Be[a.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>💝 Lv.${a.creatureBondLevel??1}/${mt} • ${$[a.creatureStage??"baby"]} • 🌿 ${x?.score??50}% • 🥩 ${Math.round(a.creatureHunger??90)}%</div>
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

        ${o.isBackstage&&m&&!l?`
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${m.isShielded?"#15803d":"#dc2626"};">
                  📦 Che chắn: ${m.shieldCount}/${m.needed} ${m.isShielded?"✅ (+25%G)":"⚠️"}
                </div>
              </div>
            `:""}

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${!l&&a.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${a.stars+1}★ (🌟${ii(a.stars)} + 🪙${d.toLocaleString("vi-VN")})
                </button>`:l?"":'<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>'}
          ${a.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>'}
        </div>
      `;const F=t.querySelector("#inpBuildingPrice");F&&(e.wireRangeProgressFallback(F),F.addEventListener("input",()=>{const L=Number(F.value);e.sim.setBuildingCustomPrice(a.uid,L);const N=e.sim.getEffectivePrice(a,o),O=t.querySelector("#lblBuildingPriceVal");O&&(O.textContent=`${N} Galleon`);const ne=e.sim.getPriceValueVerdict(a,o),P=t.querySelector("#lblPriceVerdict");P&&(P.textContent=ne.label,P.style.color=ne.color);const V=e.sim.getBuildingProductionPerCycle(a,o),W=t.querySelector("#lblBuildingProdVal");W&&(W.textContent=`+${V.galleons} 🪙 & +${V.xp} ⭐`)})),t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(a.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(a.uid,!0),pe(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(L=>{L.addEventListener("click",()=>{const N=e.sim.useMorningDewPhial(a.uid);e.showToast(N.msg,N.ok?"🧪":"⏳"),pe(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(a.uid),pe(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const L=a.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",L)}),t.querySelectorAll("[data-plant-crop]").forEach(L=>{L.addEventListener("click",()=>{const N=L.dataset.plantCrop,O=e.sim.plantCropOnPlot(a.uid,N);if(O.needSeedAcquire){const ne=a.uid;e.activeSeedCropId=N,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(N,ne);return}if(e.showToast(O.msg,O.ok?"🌱":"🪙"),O.ok){e.activeSeedCropId=N,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(L=>{L.addEventListener("click",()=>{const N=L.dataset.inspSeedFilter;(N==="all"||N==="flowers"||N==="crops")&&(e.seedFilterMode=N,pe(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(L=>{L.addEventListener("click",()=>{const N=L.dataset.stockAnimal,O=e.sim.stockAnimalOnPasture(a.uid,N);if(e.showToast(O.msg,O.ok?Ye[N]?.emoji??"🐾":"🪙"),O.ok){e.activePastureAnimalId=N,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}pe(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const L=e.sim.feedAnimalPasture(a.uid);e.showToast(L.msg,L.ok?"🌾":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const L=e.sim.harvestAnimalPasture(a.uid);e.showToast(L.msg,L.ok?"🧺":"⏳"),pe(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const L=e.sim.clearAnimalFromPasture(a.uid);e.showToast(L.msg,L.ok?"🐾":"⚠️"),pe(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const L=e.sim.waterCropPlot(a.uid);e.showToast(L.msg,L.ok?"💧":"⏳"),pe(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const L=e.sim.harvestCropPlot(a.uid);e.showToast(L.msg,L.ok?"🌾":"🏡"),pe(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(a.uid),pe(e)}),t.querySelector("#btnInspOpenBarn")?.addEventListener("click",()=>{e.openWorkshopDialog("barn")}),t.querySelectorAll("[data-ws-enqueue]").forEach(L=>{L.addEventListener("click",()=>{const N=L.dataset.wsEnqueue,O=e.sim.enqueueWorkshopRecipe(a.uid,N);e.showToast(O.msg,O.ok?"🔥":"🧺"),pe(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(a.uid),pe(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(a.uid),pe(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(a.uid),pe(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=a.uid,e.inspectSelection=null,pe(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${o.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(a.uid),pe(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",a.uid)}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const L=e.sim.upgradeBuildingStar(a.uid);e.showToast(L.msg,L.ok?"🌟":"🪙"),pe(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{e.moveModeActive=!0,e.movingBuildingUid=a.uid,e.rotation=a.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.refreshAll(),e.showToast(`Đang nhấc "${o.name}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")});return}if(e.inspectSelection.kind==="staff"){const i=e.inspectSelection.id,a=e.sim.staff.find(l=>l.id===i);if(!a){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const o=e.sim.state.staffPatrolZones?.[a.id]??a.patrolZoneId??"all",r=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${y(a.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${y(a.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${o==="all"?"selected":""}>🗺️ Toàn bộ</option>
            ${$s.filter(l=>e.sim.state.sandboxMode||r.has(l.id)).map(l=>`<option value="${l.id}" ${o===l.id?"selected":""}>📍 ${l.name}</option>`).join("")}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const n=l.currentTarget.value;e.sim.setStaffPatrolZone(a.id,n),e.showToast(`Đã phân công khu tuần tra cho ${a.name}!`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{e.pincerActive=!0,e.pincerPicked={kind:"staff",id:a.id,label:a.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){const i=rn(e.inspectSelection.zoneId),a=ln(i),o=e.sim.state.level>=i.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${e.inspectorCollapsed?"0":"8px"};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${y(i.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!e.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${e.inspectorCollapsed?"▴":"▾"}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>
        <div style="font-size:12.5px;margin-bottom:10px;font-weight:700;">
          🔒 Lv.${i.unlockLevel} • <strong>🌟 ${a}</strong>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${o?"gold-cta":""}" style="width:100%;">
          🔓 Mở (🌟 ${a})
        </button>
      `,t.querySelector("#btnToggleInspRollup")?.addEventListener("click",()=>{e.inspectorCollapsed=!e.inspectorCollapsed,pe(e)}),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,pe(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(i.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,pe(e))})}}function Es(e,t){t&&(e.activeWorkshopTab=t),Me(e);const s=e.root.querySelector("#workshopDialog");s.open||s.showModal()}function Pn(e,t,s){e.collapseBuildDock(),Tt(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingSowPlotUid=s??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function ot(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function Ma(e){e.seedTrayOpen?(ot(e),e.refreshAll()):Pn(e,e.activeSeedCropId??void 0)}function Hn(e,t,s){e.collapseBuildDock(),ot(e),e.selectedCatalogItem=null,e.bulldozerActive=!1,e.moveModeActive=!1,e.movingBuildingUid=null,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.pendingStockPastureUid=s??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function Tt(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function La(e){e.pastureTrayOpen?(Tt(e),e.refreshAll()):Hn(e,e.activePastureAnimalId??void 0)}function In(e){const t=e.root.querySelector("#seedBrushTray"),s=e.root.querySelector("#btnOpenSeedSilo");if(s){const u=e.seedTrayOpen||!!e.activeSeedCropId;s.dataset.active=String(u),s.setAttribute("aria-pressed",String(u))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const i=e.sim.state.buildings.filter(u=>se(u.itemId)?.isFarmlandPlot&&!u.cropId&&Date.now()>=u.constructEndsAt).length,a=e.sim.state.buildings.filter(u=>se(u.itemId)?.isFarmlandPlot).length,o=e.activeSeedCropId?ve[e.activeSeedCropId]:null,r=Object.values(ve).sort((u,v)=>u.unlockLevel-v.unlockLevel||u.growSec-v.growSec),l=r.filter(u=>u.isFlowerCrop).length,n=r.length-l,c=r.filter(u=>e.seedFilterMode==="flowers"?!!u.isFlowerCrop:e.seedFilterMode==="crops"?!u.isFlowerCrop:!0),d=[{id:"all",label:`🌱 (${r.length})`},{id:"flowers",label:`🌸 (${l})`},{id:"crops",label:`🌾 (${n})`}].map(u=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===u.id?"active":""}"
            data-seed-filter="${u.id}"
            aria-pressed="${e.seedFilterMode===u.id}"
          >${u.label}</button>
        `).join(""),p=c.map(u=>{const v=!e.sim.state.sandboxMode&&e.sim.state.level<u.unlockLevel,g=e.activeSeedCropId===u.id,f=e.sim.getSeedCount(u.id),S=e.sim.getFarmItemCount(u.id),$=ke(u.growSec);return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${v?"locked":""} ${g?"selected":""} ${!v&&f<=0?"out-of-seeds":""}"
              data-seed-brush="${u.id}"
              aria-pressed="${g}"
              ${v?"disabled":""}
            >
              <img src="${St(u.id)}" alt="${y(u.name)}" class="seed-card-img" />
              <span class="seed-card-name">${y(u.name)}</span>
              <span class="seed-card-seed-badge ${f>0?"has-seed":"no-seed"}">
                ${v?`🔒 Cấp ${u.unlockLevel}`:f>0?`🌱 ${f}`:"🪄 0G"}
              </span>
              <span class="seed-card-meta">
                ${v?`⏱️ ${$}`:`⏱️ ${$} • 🪙${u.seedCost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-stock">📦 ${S}</span>
            </button>
            ${v?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${u.id}" aria-label="Nạp hạt ${y(u.name)}" title="Mua hạt ${y(u.name)} (${u.seedCost.toLocaleString("vi-VN")}G) hoặc Đố 0G">+</button>`}
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🌱 <strong>${y(o.name)}</strong> (${e.sim.getSeedCount(o.id)})`:"🌱 Hạt Giống & Hoa"}
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${i}/${a}</strong></span>
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
      <div class="seed-tray-scroll">${p}</div>
    `,t.querySelectorAll("[data-seed-filter]").forEach(u=>{u.addEventListener("click",v=>{v.stopPropagation();const g=u.dataset.seedFilter;(g==="all"||g==="flowers"||g==="crops")&&(e.seedFilterMode=g,In(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(u=>{u.addEventListener("click",v=>{v.stopPropagation();const g=u.dataset.acquireSeed,f=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(g,f)})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const u=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),v=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(v,u)}),t.querySelectorAll("[data-seed-brush]").forEach(u=>{u.addEventListener("click",()=>{const v=u.dataset.seedBrush,g=ve[v],f=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.sim.getSeedCount(v)<=0){e.activeSeedCropId=v,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(v,f);return}if(e.activeSeedCropId=v,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,f){const S=e.sim.state.buildings.find($=>$.uid===f);if(S&&se(S.itemId)?.isFarmlandPlot&&!S.cropId){const $=e.sim.plantCropOnPlot(S.uid,v);if($.needSeedAcquire){e.refreshAll(),e.openSeedQuizDialog(v,S.uid);return}e.showToast($.msg,$.ok?"🌱":"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🌱 Đã chọn ${g.emoji} ${g.name} (Túi có ${e.sim.getSeedCount(v)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,g.emoji)})}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const u=se("farmland_plot");u&&(ot(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=u,e.refreshAll(),e.showToast("🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const u=se("burrow_flower_garden");u&&(ot(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=u,e.refreshAll(),e.showToast("🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Es(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{ot(e),e.refreshAll()})}function Aa(e){const t=e.root.querySelector("#pastureBrushTray"),s=e.root.querySelector("#btnOpenPastureTray");if(s){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;s.dataset.active=String(l),s.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const i=e.sim.state.buildings.filter(l=>se(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,a=e.sim.state.buildings.filter(l=>se(l.itemId)?.isAnimalPasturePlot).length,o=e.activePastureAnimalId?Ye[e.activePastureAnimalId]:null,r=Object.values(Ye).map(l=>{const n=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,c=e.activePastureAnimalId===l.id,d=l.goodId?Ne(l.goodId):null;return`
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${n?"locked":""} ${c?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${c}"
              ${n?"disabled":""}
            >
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.png" alt="${y(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${y(l.name)}</span>
              <span class="seed-card-seed-badge ${n?"no-seed":"has-seed"}">
                ${n?`🔒 Cấp ${l.unlockLevel}`:`🪙 ${l.cost.toLocaleString("vi-VN")}G`}
              </span>
              <span class="seed-card-meta">
                ⏱️${ke(l.cycleSec)} • +${l.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${d?`+${l.yieldQty} ${y(d.name)}`:""}
              </span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${o?`🐾 <strong>${y(o.name)}</strong> (${o.cost.toLocaleString("vi-VN")}G)`:"🐾 Chăn Thả"}
          </div>
          <div class="seed-tray-sub">
            Ô trống: <strong>${i}/${a}</strong>
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
    `,t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const n=l.dataset.pastureBrush,c=Ye[n];if(!c)return;const d=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.activePastureAnimalId=n,e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,d){const p=e.sim.state.buildings.find(u=>u.uid===d);if(p&&se(p.itemId)?.isAnimalPasturePlot&&!p.pastureAnimalId){const u=e.sim.stockAnimalOnPasture(p.uid,n);e.showToast(u.msg,u.ok?c.emoji:"🪙"),e.refreshAll();return}}e.refreshAll(),e.showToast(`🐾 Đang dẫn ${c.emoji} ${c.name} (${c.cost.toLocaleString("vi-VN")}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,c.emoji)})}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=se("burrow_animal_pasture");l&&(Tt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Es(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{Tt(e),e.refreshAll()})}function Ea(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,i=Date.now();if((s.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){Me(e);return}if(e.activeWorkshopTab==="brew"){const o=t.querySelector("#btnWsQuickHerb");if(o){const n=Math.max(0,Math.ceil((2e4-(i-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),c=n===0||s.sandboxMode;o.classList.toggle("gold-cta",c),o.textContent=c?"🌿 Hái Thảo Dược":`🌱 (${n}s)`}const r=t.querySelector("[data-ws-brew-left]");if(r&&s.supply.activeBrew){const n=Bt.find(d=>d.id===s.supply.activeBrew?.goodId),c=Math.max(0,Math.ceil((s.supply.activeBrew.endsAt-i)/1e3));n&&(r.textContent=`🔥 ${n.emoji} ${n.name} (${c}s)`)}const l=t.querySelector("[data-ws-buff-banner]");if(l){const n=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-i)/1e3)),c=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-i)/1e3));if(n<=0&&c<=0)l.classList.add("hidden");else{l.classList.remove("hidden");const d=[];n>0&&d.push(`🍻 +85%G (${n}s)`),c>0&&d.push(`🧪 +35%XP (${c}s)`),l.textContent=`✨ ${d.join(" • ")}`}}}}function Me(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const s=e.sim.state,i=Date.now();e.lastWsBrewId=s.supply.activeBrew?.goodId??null;const a=e.sim.activeSynergies.activeIds.size,o=s.supply.cargoCrates.filter(d=>d.fulfilled).length,r=e.sim.ensureFarmBarn(),l=e.sim.getBarnTotalUsed(),n=`
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
          🌟 Combo (${a}/12)
        </button>
      </div>
    `;let c="";if(e.activeWorkshopTab==="barn"){const d=Math.min(100,Math.round(l/Math.max(1,r.capacity)*100)),u=160+Math.max(1,Math.round((r.capacity-40)/20))*90,v=r.goods.muggle_plug_kit??0,g=E=>E.map(T=>{const A=Ne(T),k=e.sim.getFarmItemCount(T);return`
              <div class="barn-stock-card ${k>0?"in-stock":"empty"}">
                <img src="${A.iconSrc}" alt="${y(A.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${y(A.name)}</div>
                <div class="barn-stock-qty"><strong>×${s.sandboxMode?"∞":k}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${k>0||s.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${T}"
                  ${k<=0&&!s.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${A.sellValue}G
                </button>
              </div>
            `}).join(""),f=e.sim.getPhoenixTalismanCount(),S=e.sim.getPhoenixTalismanDailyStatus(),$=e.sim.getCraftablePhoenixBarnGood(),x=$?Ne($):null,m=s.sandboxMode||f<us&&!!$&&s.galleons>=_s;c=`
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${l}/${r.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${r.ordersDelivered} • 🔌 ×${v}
              </div>
            </div>
            <button id="btnUpgradeFarmBarn" type="button" class="owl-green-send-btn" style="padding:7px 14px;font-size:12.5px;">
              🔌 +20 Ô (1🔌 + 🪙${u})
            </button>
          </div>
          <div class="quest-bar" style="height:10px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${d}%"></div>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <div class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${s.sandboxMode?"∞":`${f}/${us}`})
            </div>
            <div style="font-size:11.5px;font-weight:700;opacity:0.84;margin-top:2px;">
              Dùng tối đa 1 lần/môn/ngày • Hôm nay: ${S.usedCount}/${S.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${m?"":"disabled"}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${x?`1 ${y(x.name)}`:"1 Đặc sản"} + ${_s}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(ve).length})</h3>
        <div class="barn-stock-grid">
          ${g(Object.keys(ve))}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(nt).length})</h3>
        <div class="barn-stock-grid">
          ${g(Object.keys(nt))}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const d=Math.max(0,Math.ceil((2e4-(i-(s.supply.lastHerbPlotHarvestAt||0)))/1e3)),p=Math.max(0,Math.ceil(((s.supply.butterbeerBoostEndsAt||0)-i)/1e3)),u=Math.max(0,Math.ceil(((s.supply.felixBoostEndsAt||0)-i)/1e3)),v=s.supply.activeBrew,g=v?Bt.find($=>$.id===v.goodId):void 0,f=v?Math.max(0,Math.ceil((v.endsAt-i)/1e3)):0,S=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];c=`
        <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${d===0||s.sandboxMode?"gold-cta":""}">
            ${d>0&&!s.sandboxMode?`🌱 (${d}s)`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="ingredient-bar">
          ${S.map($=>{const x=wt[$],m=s.supply.ingredients[$]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${x.emoji} ${x.name}</span>
                    <span style="color:#b45309;">×${s.sandboxMode?"∞":m}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${p>0||u>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${p>0?`🍻 +85%G (${p}s) `:""}${u>0?`• 🧪 +35%XP (${u}s)`:""}
              </div>
            `:""}

        ${v&&g?`
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${g.emoji} ${y(g.name)} (${f}s)
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${Bt.map($=>{const x=s.supply.goods[$.id]??0,m=e.sim.getBrewDurationSec($),E=Object.entries($.inputs).map(([T,A])=>{const k=wt[T],C=s.supply.ingredients[T]??0;return`<span style="color:${s.sandboxMode||C>=(A??0)?"#15803d":"#dc2626"};font-weight:800;">${k.emoji} ${C}/${A}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${$.emoji} ${$.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${s.sandboxMode?"∞":x}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${E}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${$.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${m}s)
                  </button>
                  <button type="button" data-use-good="${$.id}" class="brass-btn" style="flex:1;">
                    ${$.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const d=Math.round(240+s.level*40),p=Math.round(160+s.level*25);c=`
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${s.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${d.toLocaleString("vi-VN")}🪙 +${p}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${s.supply.cargoCrates.map((u,v)=>{const g=Bt.find($=>$.id===u.goodId),f=s.supply.goods[u.goodId]??0,S=!u.fulfilled&&(s.sandboxMode||f>=u.qtyRequired);return`
                <div class="crate-card ${u.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${v+1}</span>
                      <span>${u.fulfilled?"✅":`${s.sandboxMode?"∞":f}/${u.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${g.emoji} ${g.name} ×${u.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${u.rewardGalleons}🪙 • +${u.rewardXp}⭐ • +${u.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${u.fulfilled?'<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>':S?`<button type="button" data-fulfill-crate="${u.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`:'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>'}
                </div>
              `}).join("")}
        </div>
      `}else c=`
        <div class="grid-2col">
          ${oi.map(d=>{const p=e.sim.activeSynergies.activeIds.has(d.id),u=d.requiredItems.map(v=>se(v)?.name??v).join(" + ");return`
              <div class="quest-card-mini" style="padding:11px;border-color:${p?"#d97706":"rgba(138,90,43,0.3)"};background:${p?"rgba(254,243,199,0.9)":"rgba(255,251,240,0.68)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${d.emoji} ${y(d.name)}</span>
                  <span style="font-size:12px;font-weight:800;color:${p?"#15803d":"#78350f"};">
                    ${p?"✅":`≤${d.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">🔗 ${u}</div>
                <div style="font-size:12px;font-weight:800;color:#15803d;">
                  +${d.goldBonusPct}%G • +${d.xpBonusPct}%XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=n+c,t.querySelectorAll("[data-ws-tab]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab=d.dataset.wsTab,Me(e)})}),t.querySelector("#btnUpgradeFarmBarn")?.addEventListener("click",()=>{const d=e.sim.upgradeFarmBarn();e.showToast(d.msg,d.ok?"🏡":"🔌"),Me(e),e.refreshHeader()}),t.querySelector("#btnCraftPhoenixTalisman")?.addEventListener("click",()=>{const d=e.sim.craftPhoenixTalismanFromBarn();e.showToast(d.msg,d.ok?"🔥":"🧺"),Me(e),e.refreshHeader()}),t.querySelectorAll("[data-sell-farm-item]").forEach(d=>{d.addEventListener("click",()=>{const p=e.sim.sellFarmItemFromBarn(d.dataset.sellFarmItem,1);p.ok||e.showToast(p.msg,"🧺"),Me(e),e.refreshHeader()})}),t.querySelector("#btnWsQuickHerb")?.addEventListener("click",()=>{const d=e.sim.quickHarvestHerbs();e.showToast(d.msg,d.ok?"🌿":"⏳"),Me(e)}),t.querySelector("#btnWsSpeedBrew")?.addEventListener("click",()=>{e.sim.speedUpBrewing()&&Me(e)}),t.querySelectorAll("[data-brew-good]").forEach(d=>{d.addEventListener("click",()=>{const p=e.sim.startBrewing(d.dataset.brewGood);e.showToast(p.msg,p.ok?"🧪":"⚠️"),Me(e)})}),t.querySelectorAll("[data-use-good]").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.useGood,u=e.sim.useCraftedGood(p);u.ok?p==="dragon_firework"?e.root.querySelector("#workshopDialog").close():Me(e):e.showToast(u.msg,"⚠️")})}),t.querySelectorAll("[data-fulfill-crate]").forEach(d=>{d.addEventListener("click",()=>{const p=e.sim.fulfillCargoCrate(d.dataset.fulfillCrate);e.showToast(p.msg,p.ok?"📦":"⚠️"),Me(e),e.refreshHeader()})}),t.querySelectorAll("[data-goto-brew]").forEach(d=>{d.addEventListener("click",()=>{e.activeWorkshopTab="brew",Me(e)})})}function qa(e){e.closeHudPopovers(),Bn(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function Pa(e){const t=e.sim.getClaimableHarvestFeastCount(),s=e.root.querySelector("#badgeFeastCount");s&&(t>0?(s.textContent=String(t),s.classList.remove("hidden")):s.classList.add("hidden"));const i=e.root.querySelector("#badgeManageFeastCount");i&&(t>0?(i.textContent=String(t),i.classList.remove("hidden")):i.classList.add("hidden"))}function Ha(e,t){const s=e.root.querySelector("#ribbonUnveilToastCard");s&&(s.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${y(t.speakerEmoji)} ${y(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${y(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${t.bonusGalleons.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁</div>
        </div>
      </div>
    `,s.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{s.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function Bn(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const s=e.sim.ensureHarvestFeast(),i=new Set(s.claimedTiers),a=ut[ut.length-1]?.pointsRequired??3e3,o=Math.min(100,Math.round(s.points/Math.max(1,a)*100)),r=e.sim.getClaimableHarvestFeastCount(),l=ut.every(d=>i.has(d.tier)),n=ut.find(d=>!i.has(d.tier)),c=ut.map(d=>{const p=i.has(d.tier),v=s.points>=d.pointsRequired&&!p,g=Si(d),f=d.tier%5===0;return`
        <article class="feast-tier-card ${p?"is-claimed":v?"is-claimable":"is-locked"} ${f?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${d.tier}</span>
            <span class="feast-tier-pts">🍁 ${d.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${y(d.icon)} ${y(d.titleVi)}</span>
              ${f?'<span class="feast-grand-pill">👑</span>':""}
            </div>
            <div class="feast-tier-reward">${y(g)}</div>
          </div>
          <div class="feast-tier-cta">
            ${p?'<span class="feast-claimed-pill">✓</span>':v?`<button type="button" data-claim-feast-tier="${d.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">-${(d.pointsRequired-s.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${s.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${s.points.toLocaleString("vi-VN")} / ${a.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${l?"🎉 30/30!":n?` Kế tiếp: #${n.tier} (${n.pointsRequired.toLocaleString("vi-VN")} 🍁)`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${r>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${r})</button>`:""}
            ${l?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${s.seasonCycle+1}</button>`:""}
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
    `,t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const d=e.sim.claimAllHarvestFeastTiers();e.showToast(d.msg,d.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const d=e.sim.startNextHarvestFeastCycle();e.showToast(d.msg,d.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(d=>{d.addEventListener("click",()=>{const p=Number(d.dataset.claimFeastTier);if(!Number.isFinite(p))return;const u=e.sim.claimHarvestFeastTier(p);e.showToast(u.msg,u.ok?"🎁":"🍁"),e.refreshAll()})})}function Ia(e){const t=e.root.querySelector("#financeDialogContent"),s=e.sim.state.finance,i=s.gateRevenue+s.ticketRevenue+s.shopRevenue+s.harvestRevenue,a=s.staffWagesPaid+s.constructionSpent,o=i-a,r=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${s.harvestRevenue.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(s.shopRevenue+s.ticketRevenue+s.gateRevenue).toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${i.toLocaleString("vi-VN")} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${s.constructionSpent.toLocaleString("vi-VN")} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${r}G/ca):</span><strong>-${s.staffWagesPaid.toLocaleString("vi-VN")} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${o>=0?"#15803d":"#b45309"};">
              <span>Ròng:</span><strong>${o>=0?"+":""}${o.toLocaleString("vi-VN")} G</strong>
            </div>
          </div>
        </div>
      </div>
    `}function je(e){const t=e.root.querySelector("#albumDialogContent"),s=e.sim.state;e.sim.checkAndToastAchievements();const i=wi(s),a=xi(s),o=Us.filter(d=>{const p=i.achievements[d.id];return!!(p?.unlockedAt&&!p?.claimedAt)}).length,r=e.sim.getUnlockedLoginDayMax(),l=js.filter(d=>d.day<=r&&!i.claimedLoginDays.includes(d.day)).length,n=`
      <div class="workshop-tabs" role="tablist" aria-label="Sổ Vàng Hang Sóc" style="margin-bottom:12px;">
        <button type="button" data-atab="cup" data-active="${e.activeAlbumTab==="cup"}" aria-selected="${e.activeAlbumTab==="cup"}" class="brass-btn">
          🏆 Cúp 4 Nhà
        </button>
        <button type="button" data-atab="achievements" data-active="${e.activeAlbumTab==="achievements"}" aria-selected="${e.activeAlbumTab==="achievements"}" class="brass-btn">
          🎖️ Thành Tựu (${a.unlocked}/${a.total})${o>0?` • 🎁${o}`:""}
        </button>
        <button type="button" data-atab="friendship" data-active="${e.activeAlbumTab==="friendship"}" aria-selected="${e.activeAlbumTab==="friendship"}" class="brass-btn">
          💝 Tình Bạn &amp; Phim
        </button>
        <button type="button" data-atab="login7" data-active="${e.activeAlbumTab==="login7"}" aria-selected="${e.activeAlbumTab==="login7"}" class="brass-btn">
          📅 Điểm Danh 7N${l>0?` • 🎁${l}`:""}
        </button>
      </div>
    `;let c="";if(e.activeAlbumTab==="cup"){const d=e.sim.getPlayerHouse(),p=s.weeklyHouseCupServerStandings,u=[{house:"Gryffindor",icon:"🦁",pts:(s.housePoints.Gryffindor??0)+(p?.totals.Gryffindor??0)},{house:"Slytherin",icon:"🐍",pts:(s.housePoints.Slytherin??0)+(p?.totals.Slytherin??0)},{house:"Ravenclaw",icon:"🦅",pts:(s.housePoints.Ravenclaw??0)+(p?.totals.Ravenclaw??0)},{house:"Hufflepuff",icon:"🦡",pts:(s.housePoints.Hufflepuff??0)+(p?.totals.Hufflepuff??0)}];u.sort(($,x)=>x.pts-$.pts);const v=Math.max(100,u[0]?.pts??100),g=(s.housePoints.Gryffindor??0)+(s.housePoints.Slytherin??0)+(s.housePoints.Ravenclaw??0)+(s.housePoints.Hufflepuff??0),f=s.houseCupMilestoneTier*300,S=g>=f;c=`
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${d}</strong>${p?` • Tuần HPVN ${p.weekKey} (đóng góp: +${p.playerContribution} đ)`:" • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí"}
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${s.houseCupMilestoneTier}: ${g} / ${f}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${u.map(($,x)=>{const m=Math.min(100,Math.max(8,Math.round($.pts/v*100))),E=$.house===d;return`
                  <div class="aaa-hourglass-card" data-house="${$.house}" data-player-house="${E}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${x===0?"👑 ":""}${$.icon} ${$.house}</span>
                      ${E?'<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>':""}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${$.pts.toLocaleString("vi-VN")} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${m}%;"></div>
                    </div>
                  </div>
                `}).join("")}
          </div>
          <progress max="${f}" value="${Math.min(f,g)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${S?`<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${s.houseCupMilestoneTier}</button>`:""}
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `}else if(e.activeAlbumTab==="achievements"){const d=Date.now(),p={farm:st(s,"farm",d),building:st(s,"building",d),puzzle:st(s,"puzzle",d),language:st(s,"language",d),social:st(s,"social",d),collection:st(s,"collection",d)};c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${a.completionPct}% (${a.unlocked}/${a.total})</span>
          </div>
          <progress max="${a.total}" value="${a.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${Us.map(u=>{const v=i.achievements[u.id],g=!!v?.unlockedAt,f=!!v?.claimedAt,S=Math.min(u.target,Math.max(0,p[u.category]??0)),$=S.toLocaleString("vi-VN"),x=u.target.toLocaleString("vi-VN");return`
              <div class="aaa-ach-card" data-unlocked="${g}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${u.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${u.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${u.descVi} • Thưởng <strong>+${u.rewardGalleons}G, +${u.rewardStars} 🌟</strong></div>
                    ${g?"":`<progress max="${u.target}" value="${S}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                  </div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                  ${f?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>':g?`<button type="button" data-claim-ach="${u.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${$}/${x}</span>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeAlbumTab==="friendship"){const d=e.sim.getRealTimePeriod(),p=$i();c=`
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${pn.map(u=>{const v=s.level>=u.unlockLevel||e.sim.isHeadmasterPreview;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${u.titleVi}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">Yêu cầu: Cấp ${u.unlockLevel}</div>
                  <button type="button" data-play-cutscene="${u.id}" ${v?"":"disabled"} class="brass-btn ${v?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                    ${v?"🎬 Phát Phim Camera":`🔒 Mở ở Cấp ${u.unlockLevel}`}
                  </button>
                </div>
              `}).join("")}
          </div>
        </div>
        <div class="aaa-codex-scroll">
          ${Ti.map(u=>{const v=ki(u.id,d),g=i.npcFriendship[u.id]??{villagerId:u.id,level:1,xp:0},f=g.level*60,S=g.lastTalkedDayKey===p;return`
              <div class="aaa-slot-card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div>
                    <strong style="font-size:13.5px;">${u.moodBubble} ${u.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${u.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${g.level}/10 (${g.xp}/${f})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${v.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${u.id}" data-choice="0" ${S?"disabled":""} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${S?"✓ Đã trò chuyện hôm nay":"☕ Hỏi thăm ấm áp (+35 XP)"}
                  </button>
                  ${S?"":`<button type="button" data-npc-talk="${u.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`}
                </div>
              </div>
            `}).join("")}
        </div>
      `}else c=`
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${js.map(d=>{const p=i.claimedLoginDays.includes(d.day),u=!p&&d.day<=r;return`
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${d.titleVi}</div>
                  <div style="font-size:11.5px;color:var(--ink-soft);">
                    +${d.galleons}G • +${d.magicStars} 🌟${d.phoenixTalismans>0?` • +${d.phoenixTalismans} 🔥`:""}
                  </div>
                  ${p?'<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận quà</span>':`<button type="button" data-claim-login="${d.day}" ${u?"":"disabled"} class="brass-btn ${u?"gold-cta":""}" style="font-size:11.5px;padding:4px 8px;">
                          ${u?"🎁 Nhận Ngay":"🔒 Mở kế tiếp"}
                        </button>`}
                </div>
              `}).join("")}
          </div>
        </div>
      `;t.innerHTML=n+c,t.querySelectorAll("[data-atab]").forEach(d=>{d.addEventListener("click",()=>{e.activeAlbumTab=d.dataset.atab,je(e)})}),t.querySelector("#btnClaimHouseCup")?.addEventListener("click",()=>{e.sim.claimHouseCupReward()&&je(e)}),t.querySelector("#btnSyncServerHouseCup")?.addEventListener("click",async()=>{try{const d=await vt(()=>Promise.resolve().then(()=>pa),void 0);if(typeof d.fetchWeeklyHouseCupStandingsOnline=="function"){const p=await d.fetchWeeklyHouseCupStandingsOnline();if(p){s.weeklyHouseCupServerStandings=p,e.sim.saveToStorage(),e.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${p.weekKey}!`,"🏆"),je(e);return}}e.showToast("Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!","🏆")}catch{e.showToast("Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.","🦉")}}),t.querySelectorAll("[data-claim-ach]").forEach(d=>{d.addEventListener("click",()=>{const p=e.sim.claimAchievement(String(d.dataset.claimAch));e.showToast(p.msg,p.ok?"🎖️":"⚠️"),je(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(d=>{d.addEventListener("click",()=>{e.playStoryCutscene(String(d.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.npcTalk,u=Number(d.dataset.choice)===1?1:0,v=e.sim.talkWithVillagerChoice(p,u);e.showToast(v.msg,v.ok?"💝":"☕"),je(e)})}),t.querySelectorAll("[data-claim-login]").forEach(d=>{d.addEventListener("click",()=>{const p=e.sim.claimLoginDayReward(Number(d.dataset.claimLogin));e.showToast(p.msg,p.ok?"📅":"🔒"),je(e)})})}function Oe(e){const t=e.root.querySelector("#questDialogContent"),s=e.sim.ensureFarmBarn(),i=e.sim.getActiveStoryQuest(),a=e.sim.getStoryAutoActionPreview(),o=e.sim.getReadyOwlOrdersCount(),r=(i?.completed?1:0)+e.sim.state.owlQuests.filter(g=>g.completed&&!g.claimed).length+e.sim.state.dailyQuests.filter(g=>g.completed&&!g.claimed).length;if(!e.selectedOwlOrderId||!s.owlOrders.some(g=>g.id===e.selectedOwlOrderId)){const g=s.owlOrders.find(f=>e.sim.canFulfillFarmOwlOrder(f));e.selectedOwlOrderId=(g??s.owlOrders[0])?.id??null}const l=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          🦉 Đơn Cú (${o}/${s.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          📖 Nhiệm Vụ ${r>0?`(${r})`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const g=s.owlOrders.find(x=>x.id===e.selectedOwlOrderId)??s.owlOrders[0],f=g?e.sim.canFulfillFarmOwlOrder(g):!1,S=s.owlOrders.map(x=>{const m=g?.id===x.id,E=e.sim.canFulfillFarmOwlOrder(x),T=x.portraitSprite?`<img src="/trang-trai-hang-soc/sprites/${x.portraitSprite}.png" alt="${y(x.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${y(x.portraitEmoji)}</span>`,A=x.requirements.slice(0,3).map(k=>{const C=Ne(k.itemId);return`<img src="${C.iconSrc}" alt="${y(C.name)}" title="${k.qty} ${y(C.name)}" class="owl-note-mini-item" />`}).join("");return`
            <button
              type="button"
              class="owl-pin-note ${m?"selected":""} ${E?"ready":""}"
              data-select-owl="${y(x.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${T}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${y(x.senderName)}</div>
                <div class="owl-note-mini-row">${A}</div>
                ${x.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
              </div>
              ${E?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),$=g?`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${y(g.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${y(g.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${g.requirements.map((x,m)=>{const E=Ne(x.itemId),T=e.sim.getFarmItemCount(x.itemId),A=e.sim.ensureNeighborSocial(),k=Math.max(0,Nt-A.dailyOwlHelpRequestedCount),C=e.sim.getOwlRequirementHelpState(g.id,m),M=!!C?.fulfilledAt,D=e.sim.state.sandboxMode||M||T>=x.qty,F=M?`<span class="owl-help-tag done">✓ ${y(C?.helperEmoji??"🦉")}</span>`:C?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':D?'<span class="owl-req-status">✓</span>':`<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${m}" ${k<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${k})</button>`;return`
                    <div class="owl-req-row ${D?"ok":"lack"}">
                      <img src="${E.iconSrc}" alt="${y(E.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${y(E.name)}</div>
                        <div class="owl-req-count">${M?"✓":`${e.sim.state.sandboxMode?"∞":T}/${x.qty}`}</div>
                      </div>
                      ${F}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${g.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${g.rewardXp}</span>
                ${g.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${g.rewardMugglePlug}</span>`:""}
                ${(g.isFeastMarquee||(s.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<us?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `:"";t.innerHTML=`
        ${l}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${S}</div>
            ${$}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${f?"ready":"not-ready"}"
            >
              🦉 ${f?"Giao Hàng!":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(x=>{x.addEventListener("click",()=>{e.activeQuestTab=x.dataset.qtab,Oe(e)})}),t.querySelectorAll("[data-select-owl]").forEach(x=>{x.addEventListener("click",()=>{e.selectedOwlOrderId=x.dataset.selectOwl??null,Oe(e)})}),t.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{g&&(e.sim.refreshFarmOwlOrder(g.id),e.selectedOwlOrderId=null,Oe(e))}),t.querySelectorAll("[data-ask-owl-help]").forEach(x=>{x.addEventListener("click",()=>{if(!g)return;const m=Number(x.dataset.askOwlHelp);if(!Number.isFinite(m))return;const E=e.sim.requestPlayerOwlCrateHelp(g.id,m);E.ok||e.showToast(E.msg,"⚠️"),Oe(e)})}),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{if(!g)return;if(!e.sim.canFulfillFarmOwlOrder(g)){const m=e.sim.fulfillFarmOwlOrder(g.id);e.showToast(m.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const x=e.sim.fulfillFarmOwlOrder(g.id);x.ok&&e.showToast(x.msg,"🦉"),e.selectedOwlOrderId=null,Oe(e)});return}const n=(g,f,S=!1)=>{const $=Math.min(100,Math.round(g.progress/Math.max(1,g.targetAmount)*100));return`
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${y(g.giverEmoji)} ${y(g.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${y(f)}</span>
          </div>
          ${S&&g.dialogue?`<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${y(g.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${$}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(g.progress,g.targetAmount)}/${g.targetAmount}</span>
            <span>🪙${g.rewardGalleons} • ⭐${g.rewardXp} ${g.rewardTimeSand>0?`• ⏳${g.rewardTimeSand}`:""}</span>
          </div>
          ${g.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':g.completed?`<button type="button" data-modal-claim="${y(g.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:S?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${y(a.shortLabel)}</button>`:""}
        </div>
      `},c=e.sim.getRequiredLevelTrial(),d=e.sim.getWinsProgressForCurrentLevel(),p=g=>{const f=e.sim.getDisciplineStageInfo(g);return f.isMaxed?"👑777":`${f.currentStage}/777`},u=c&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${d.current}/${d.required}): ${c.icon} ${y(c.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${c.kind==="match3"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🍓 (${p("match3")})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${c.kind==="caro"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${p("caro")})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${c.kind==="sudoku"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🔮 (${p("sudoku")})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${c.kind==="chess"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🏰 (${p("chess")})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${c.kind==="blocks"?"gold-cta":""}" style="padding:5px 10px;font-size:11.5px;">🦄 (${p("blocks")})</button>
            </div>
          </div>
        </div>
      `:"",v=i?`Ch.${i.chapter??1} • ${e.sim.state.storyQuestIndex+1}/${ri.length}`:"";t.innerHTML=`
      ${l}
      ${u}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${i?n(i,v,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(g=>n(g,"Xoay vòng")).join("")}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(g=>n(g,"00:00")).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(g=>{g.addEventListener("click",()=>{e.activeQuestTab=g.dataset.qtab,Oe(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(g=>{g.addEventListener("click",()=>{const f=g.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(f)})}),t.querySelectorAll("[data-modal-claim]").forEach(g=>{g.addEventListener("click",()=>{e.sim.claimQuest(g.dataset.modalClaim),Oe(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const g=e.sim.completeStoryStepWithStar();g.ok?(typeof g.placedGx=="number"&&typeof g.placedGy=="number"&&me(e.cam,g.placedGx,g.placedGy),Oe(e)):(e.showToast(g.msg,g.reason==="missing_gold"?"🪙":"🌟"),(g.reason==="missing_stars"||g.reason==="locked_level"||g.reason==="open_match3")&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}function Nn(e){const t=e.root.querySelector("#roadmapDialogContent"),s=new Set(e.sim.state.unlockedZones),i=e.sim.getRequiredLevelTrial(),a=$s.map(r=>{const l=s.has(r.id)||e.sim.state.sandboxMode,n=!l&&e.sim.state.level>=r.unlockLevel,c=ln(r);return`
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
      `}).join(""),o=li.filter(r=>r.unlockedItemIds.length>0||r.unlockedZoneId||r.milestoneNote||r.level%10===0);t.innerHTML=`
      ${i&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const r=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${e.sim.state.level} (${r.current}/${r.required}): ${i.icon} ${y(i.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`})():""}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${a}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${o.map(r=>{const l=e.sim.state.level>=r.level,n=r.unlockedItemIds.map(c=>se(c)?.name).filter(Boolean).join(", ");return`
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${l?"1":"0.78"};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${l?"🌟":"🔒"} Lv.${r.level}</span>
                  ${n?`<span style="font-size:12px;margin-left:6px;">${n}</span>`:""}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${r.rewardGalleons}</span>
              </div>
            `}).join("")}
      </div>
    `,t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=rn(r.dataset.camZone);me(e.cam,(l.x1+l.x2)*.5,(l.y1+l.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(r=>{r.addEventListener("click",()=>{const l=e.sim.unlockZone(r.dataset.unlockZone);e.showToast(l.msg,l.ok?"✨":"🔒"),Nn(e)})})}function Ce(e){const t=e.root.querySelector("#settingsDialogContent"),s=e.sim.state,i=e.sprites?e.sprites.isToonEnabled():!0;t.innerHTML=`
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
            ${typeof window<"u"&&Ie(window.location.hostname)?`<label class="switch-row">
                    <span>♾️ Sandbox (Dev)</span>
                    <input id="swSandbox" type="checkbox" switch ${s.sandboxMode?"checked":""} />
                  </label>`:""}
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["realtime","dawn","day","dusk","night"].map(a=>{const o={realtime:"🕒 24h",dawn:"🌅 Bình minh",day:"☀️ Ngày",dusk:"🌇 Chiều",night:"🌙 Đêm"};return`<button type="button" data-time="${a}" data-active="${s.settings.timeOverride===a}" aria-pressed="${s.settings.timeOverride===a}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[a]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${["auto","halloween","christmas","quidditch_cup"].map(a=>{const o={auto:"🎪 Tự động",halloween:"🎃 Halloween",christmas:"🎄 Giáng Sinh",quidditch_cup:"🏆 Quidditch"};return`<button type="button" data-fest="${a}" data-active="${s.settings.activeFestival===a}" aria-pressed="${s.settings.activeFestival===a}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[a]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${["auto","clear","cloudy","rain","storm","snow","fog"].map(a=>{const o={auto:"🌦️ Tự động",clear:"☀️ Nắng",cloudy:"⛅ Mây",rain:"🌧️ Mưa",storm:"⛈️ Giông",snow:"❄️ Tuyết",fog:"🌫️ Sương"};return`<button type="button" data-weather="${a}" data-active="${s.settings.weatherOverride===a}" aria-pressed="${s.settings.weatherOverride===a}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${o[a]}</button>`}).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${i}" aria-pressed="${i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!i}" aria-pressed="${!i}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
          </div>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎚️ Bàn Trộn Âm Thanh 4 Kênh &amp; Tiếp Cận (A11y)</div>
        ${(()=>{const a=e.getEffectiveA11ySettings();return`
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
              ${[{key:"master",label:"🔊 Tổng (Master)"},{key:"music",label:"🎼 Nhạc nền"},{key:"sfx",label:"🔔 Hiệu ứng"},{key:"voice",label:"🗣️ Giọng đọc"}].map(r=>{const l=Math.round((a.volumes[r.key]??.85)*100);return`
                    <label class="aaa-slider-row">
                      <span>${r.label}</span>
                      <input type="range" min="0" max="100" value="${l}" data-vol-bus="${r.key}" />
                      <span data-vol-val="${r.key}">${l}%</span>
                    </label>
                  `}).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;font-weight:700;">🎨 Chế độ màu:</span>
              ${[["none","Mặc định"],["protanopia","Đỏ-Lục (P)"],["deuteranopia","Lục-Đỏ (D)"],["tritanopia","Xanh-Vàng (T)"]].map(([r,l])=>`<button type="button" data-cb-mode="${r}" data-active="${a.colorblindMode===r}" aria-pressed="${a.colorblindMode===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span style="font-size:12px;font-weight:700;">🔠 Cỡ chữ:</span>
              ${[100,125,150].map(r=>`<button type="button" data-font-scale="${r}" data-active="${a.fontScale===r}" aria-pressed="${a.fontScale===r}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${r}%</button>`).join("")}
              <label class="switch-row" style="margin-left:auto;gap:6px;">
                <span style="font-size:12px;">⚡ Tương phản cao</span>
                <input id="swHighContrast" type="checkbox" switch ${a.highContrast?"checked":""} />
              </label>
            </div>
          `})()}
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">📐 Kiến Trúc Sư Điền Trang (Bố Cục &amp; Cất Nhanh)</div>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((a,o)=>{const r=s.layoutPresets?.[a];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">${r?r.label:`Bản Vẽ #${o+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${r?`${r.placements.length} công trình đã lưu`:"Chưa lưu vị trí"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${a}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Lưu</button>
                    <button type="button" data-load-layout="${a}" ${r?"":"disabled"} class="brass-btn ${r?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📐 Áp dụng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn">📦 Cất Nhanh Trang Trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn gold-cta">
            🌸 Bày Lại Trang Trí (${Object.values(s.stashedDecorInventory??{}).reduce((a,o)=>a+o,0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${["slot_1","slot_2","slot_3"].map((a,o)=>{const r=Ci(a);return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${o+1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${r.ok&&r.meta?`${r.meta.parkName} • Cấp ${r.meta.level}`:"Ô trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-slot="${a}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Ghi</button>
                    <button type="button" data-load-slot="${a}" ${r.ok?"":"disabled"} class="brass-btn ${r.ok?"gold-cta":""}" style="flex:1;padding:3px 6px;font-size:11px;">📂 Tải</button>
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
          ${typeof window<"u"&&Ie(window.location.hostname)?`<button id="btnPreview100" type="button" class="brass-btn gold-cta">
                  ${e.sim.isHeadmasterPreview?"↩️ Về Save":"🌾 Xem Lv.100"}
                </button>`:""}
          <button id="btnTestFireworks" type="button" class="brass-btn">
            🎆 Pháo Hoa
          </button>
          ${typeof window<"u"&&Ie(window.location.hostname)?`<button id="btnTestEscape" type="button" class="brass-btn">
                  🐾 Thả Niffler
                </button>`:""}
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
          ${typeof window<"u"&&Ie(window.location.hostname)?`<label class="brass-btn" style="cursor:pointer;">
                  📤 Nhập (.json)
                  <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
                </label>`:""}
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            🌱 Chơi Lại
          </button>
        </div>
      </div>
    `,"switch"in HTMLInputElement.prototype||vt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",a=>{s.settings.bgmEnabled=a.currentTarget.checked,e.sim.audio.bgmEnabled=s.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",a=>{s.settings.soundEnabled=a.currentTarget.checked,e.sim.audio.enabled=s.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",a=>{s.settings.cutawayMode=a.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",a=>{s.settings.showGrid=a.currentTarget.checked,e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",a=>{typeof window<"u"&&Ie(window.location.hostname)&&(s.sandboxMode=a.currentTarget.checked,s.sandboxMode&&(s.sandboxTainted=!0),e.sim.saveToStorage(),e.refreshAll())}),t.querySelectorAll("[data-time]").forEach(a=>{a.addEventListener("click",()=>{s.settings.timeOverride=a.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),Ce(e)})}),t.querySelectorAll("[data-fest]").forEach(a=>{a.addEventListener("click",()=>{s.settings.activeFestival=a.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),Ce(e)})}),t.querySelectorAll("[data-weather]").forEach(a=>{a.addEventListener("click",()=>{s.settings.weatherOverride=a.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),Ce(e)})}),t.querySelectorAll("[data-toon]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.toon==="on";e.sprites?.setToonEnabled(o),e.refreshAll(),Ce(e)})}),t.querySelector("#btnTestFireworks")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.launchFireworksShow(12)}),t.querySelector("#btnTestEscape")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.sim.triggerPlayfulEscape()}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),Ce(e)}),t.querySelector("#btnExportSave")?.addEventListener("click",()=>{const a=new Blob([e.sim.exportSaveJson()],{type:"application/json"}),o=URL.createObjectURL(a),r=document.createElement("a");r.href=o,r.download=`cong-vien-harry-potter-lv${s.level}.json`,r.click(),URL.revokeObjectURL(o),e.showToast("Đã xuất file Save thành công!","💾")}),t.querySelector("#inpImportSave")?.addEventListener("change",a=>{const o=a.target.files?.[0];if(!o)return;const r=new FileReader;r.onload=()=>{e.sim.importSaveJson(String(r.result))?(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.showToast("Đã khôi phục công viên thành công!","✨"),e.root.querySelector("#settingsDialog").close()):e.showToast("File Save không hợp lệ!","⚠️")},r.readAsText(o)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),me(e.cam,16,18),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(a=>{a.addEventListener("input",()=>{const o=a.dataset.volBus,r=Math.max(0,Math.min(1,Number(a.value)/100)),l=e.getEffectiveA11ySettings();l.volumes[o]=r,s.a11ySettings=l;const n=t.querySelector(`[data-vol-val="${o}"]`);n&&(n.textContent=`${Math.round(r*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(a=>{a.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.colorblindMode=a.dataset.cbMode,s.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ce(e)})}),t.querySelectorAll("[data-font-scale]").forEach(a=>{a.addEventListener("click",()=>{const o=e.getEffectiveA11ySettings();o.fontScale=Number(a.dataset.fontScale),s.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage(),Ce(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",a=>{const o=e.getEffectiveA11ySettings();o.highContrast=a.currentTarget.checked,s.a11ySettings=o,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.saveLayout,r=e.sim.saveLayoutPreset(o);e.showToast(`📐 Đã lưu "${r.label}" (${r.placements.length} công trình)!`,"📐"),Ce(e)})}),t.querySelectorAll("[data-load-layout]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.loadLayout,r=e.sim.applyLayoutPreset(o);e.showToast(r.msg,r.ok?"📐":"⚠️"),e.refreshAll(),Ce(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const a=e.sim.stashAllDecorItems();e.showToast(a.msg,a.ok?"📦":"⚠️"),e.refreshAll(),Ce(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const a=e.sim.restoreAllStashedDecor();e.showToast(a.msg,a.ok?"🌸":"⚠️"),e.refreshAll(),Ce(e)}),t.querySelectorAll("[data-save-slot]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.saveSlot,r=e.sim.saveNamedProfileSlot(o);e.showToast(`💾 Đã ghi ${r.label} (Cấp ${r.level})!`,"💾"),Ce(e)})}),t.querySelectorAll("[data-load-slot]").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.loadSlot,r=e.sim.loadNamedProfileSlot(o);r.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(r.msg,r.ok?"📂":"⚠️")})})}function Ba(e,t,s){t&&(e.activeSuitcaseTab=t),s&&(e.selectedSuitcaseHabitatUid=s),ye(e);const i=e.root.querySelector("#suitcaseDialog");i.open||i.showModal()}function Na(e){const t=e.root.querySelector("#badgeSuitcaseCount");if(!t)return;const s=e.sim.getSuitcaseReadySummary();s.badgeCount>0?(t.textContent=String(s.badgeCount),t.classList.remove("hidden")):t.classList.add("hidden")}function Ra(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=Date.now(),i=e.sim.state.suitcase,a=!!(i.activeIncubation&&s>=i.activeIncubation.endsAt),o=!!(i.activeExpedition&&s>=i.activeExpedition.endsAt);if((a!==e.lastSuitcaseIncReady||o!==e.lastSuitcaseExpReady)&&document.activeElement?.id!=="inpSuitcasePetName"){ye(e);return}if(i.activeIncubation&&s<i.activeIncubation.endsAt){const r=Math.max(1,Math.ceil((i.activeIncubation.endsAt-s)/1e3)),l=Math.max(1e3,i.activeIncubation.endsAt-i.activeIncubation.startedAt),n=Math.min(100,Math.round((s-i.activeIncubation.startedAt)/l*100)),c=t.querySelector("[data-suitcase-inc-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-inc-prog]");d&&(d.value=n)}if(i.activeExpedition&&s<i.activeExpedition.endsAt){const r=Math.max(1,Math.ceil((i.activeExpedition.endsAt-s)/1e3)),l=Math.max(1e3,i.activeExpedition.endsAt-i.activeExpedition.startedAt),n=Math.min(100,Math.round((s-i.activeExpedition.startedAt)/l*100)),c=t.querySelector("[data-suitcase-exp-left]");c&&(c.textContent=`${r}s`);const d=t.querySelector("[data-suitcase-exp-prog]");d&&(d.value=n)}if(e.activeSuitcaseTab==="care"&&!e.sim.state.sandboxMode){const r=e.sim.state.buildings.find(l=>l.uid===e.selectedSuitcaseHabitatUid);if(r){const l=Math.max(0,Math.ceil((cn-(s-(r.lastGroomedAt??0)))/1e3)),n=Math.max(0,Math.ceil((dn-(s-(r.lastTrainedAt??0)))/1e3)),c=t.querySelector("#btnScGroom");c&&(c.textContent=l>0?`🪮 (${l}s)`:"🪮 Chải (+30💝)");const d=t.querySelector("#btnScTrain");d&&(d.textContent=n>0?`🎾 (${n}s)`:"🎾 Tập (20G • +45💝)")}}}function ye(e){const t=e.root.querySelector("#suitcaseDialogContent");if(!t)return;const s=e.sim.state,i=s.suitcase,a=Date.now(),o=e.sim.getBuiltCreatureHabitats();(!e.selectedSuitcaseHabitatUid||!o.some(m=>m.building.uid===e.selectedSuitcaseHabitatUid))&&(e.selectedSuitcaseHabitatUid=o[0]?.building.uid??null);const r=new Set(i.discoveredMorphs),l=es.length*3,n=r.size,c=ci(n),d=s.supply.ingredients.starlight_dust??0;e.lastSuitcaseIncReady=!!(i.activeIncubation&&a>=i.activeIncubation.endsAt),e.lastSuitcaseExpReady=!!(i.activeExpedition&&a>=i.activeExpedition.endsAt);const p=i.activeIncubation?a>=i.activeIncubation.endsAt?"🐣 Nở!":"🥚 Ấp":"🧬",u=i.activeExpedition?a>=i.activeExpedition.endsAt?"🎒 Về!":"🧭 Đi":`${n}/${l}`,v=`
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${o.length}</strong></span>
        <span>📖 <strong>${n}/${l}</strong> (+${c}%)</span>
        <span>✨ <strong>${s.sandboxMode?"∞":d}</strong> • ⏳ <strong>${s.sandboxMode?"∞":s.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${e.activeSuitcaseTab==="care"}" aria-pressed="${e.activeSuitcaseTab==="care"}" class="brass-btn">
          🐾 Chăm Sóc (${o.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${e.activeSuitcaseTab==="morph"}" aria-pressed="${e.activeSuitcaseTab==="morph"}" class="brass-btn">
          🧬 Ấp Trứng (${p})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${e.activeSuitcaseTab==="expedition"}" aria-pressed="${e.activeSuitcaseTab==="expedition"}" class="brass-btn">
          🧭 Thám Hiểm (${u})
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
        `;else{const m=o.find(X=>X.building.uid===e.selectedSuitcaseHabitatUid)??o[0],E=m.building,T=m.item,A=At(T.id)??es[0],k=E.creatureMorph??"normal",C=Be[k],M=E.creatureBondLevel??1,D=E.creatureBondXp??0,F=M>=mt?100:di(M),L=M>=mt?100:D,N=Math.round((Ds(M)-1)*100),O=E.creatureNickname||T.creatureName||T.name,ne=e.sim.getBuildingProductionPerCycle(E,T),P=e.sim.biomeCache.get(E.uid),V=Math.round(E.creatureHunger??90),W=Math.max(8,Math.round(T.cost*.04)),B=s.sandboxMode?0:Math.max(0,Math.ceil((cn-(a-(E.lastGroomedAt??0)))/1e3)),_=s.sandboxMode?0:Math.max(0,Math.ceil((dn-(a-(E.lastTrainedAt??0)))/1e3)),re=i.activeExpedition?.habitatUid===E.uid;g=`
          ${`
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${o.map(({building:X,item:ce})=>{const fe=At(ce.id),le=X.creatureMorph??"normal",ue=Be[le],J=X.creatureNickname||ce.creatureName||ce.name,Te=X.uid===E.uid;return`
                  <button type="button" data-select-pet="${y(X.uid)}" aria-pressed="${Te}" class="suitcase-pet-chip">
                    <img src="/trang-trai-hang-soc/sprites/${fe?.beastSpriteKey??ce.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${ue.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${y(J)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${X.creatureBondLevel??1}
                      </div>
                    </div>
                  </button>
                `}).join("")}
          </div>
        `}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${A.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${y(A.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${k==="radiant"?"radiant":k==="mystic"?"mystic":""}" style="color:#1e293b;">
                  ${C.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${y(O)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/trang-trai-hang-soc/sprites/${A.beastSpriteKey}.png"
                  alt="${y(O)}"
                  class="suitcase-diorama-img"
                  style="filter:${C.cssFilter} drop-shadow(0 0 18px ${C.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${A.emoji} ${y(O)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${y(A.morphNames[k])}${re?" • 🧭":""}
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
                  placeholder="${y(T.creatureName??T.name)}"
                  value="${y(E.creatureNickname??"")}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${M}/${mt} (+${N}%)</span>
                  <span style="color:#b45309;">${M>=mt?"MAX":`${D}/${F}`}</span>
                </div>
                <progress max="${F}" value="${L}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${y(A.favoriteTreat)} • <strong>+${ne.galleons.toLocaleString("vi-VN")}🪙 / ${ke(T.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${V}%</span>
                  <span>🌿 ${P?.score??60}% ${E.hasBabyOffspring?"• 🐣":""}</span>
                </div>
                <progress max="100" value="${V}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${s.sandboxMode?"0G":`${W}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${B===0?"gold-cta":""}">
                  ${B>0?`🪮 (${B}s)`:"🪮 Chải (+30💝)"}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${_>0?`🎾 (${_}s)`:"🎾 Tập (20G • +45💝)"}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `}else if(e.activeSuitcaseTab==="morph"){const m=i.activeIncubation;let E="";if(m){const A=se(m.itemId),k=At(m.itemId),C=a>=m.endsAt,M=Math.max(0,Math.ceil((m.endsAt-a)/1e3)),D=Math.max(1e3,m.endsAt-m.startedAt),F=C?100:Math.min(100,Math.round((a-m.startedAt)/D*100));E=`
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${y(k?.speciesName??A?.name??"Trứng")}
                ${m.boostedWithStarlight?'<span style="color:#0369a1;"> • ✨ ×2</span>':""}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${C?"✨ Nở!":`${M}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${F}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${C?'<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>':'<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else E=`
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${e.useStarlightForIncubation&&(s.sandboxMode||d>0)?"checked":""} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;const T=o.length===0?'<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>':`
            <div class="grid-2col">
              ${o.map(({building:A,item:k})=>{const C=At(k.id),M=A.creatureMorph??"normal",D=e.sim.getMorphIncubationCost(k),F=A.creatureNickname||k.creatureName||k.name;return`
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/trang-trai-hang-soc/sprites/${C?.beastSpriteKey??k.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${Be[M].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${y(F)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${Be[M].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${["normal","mystic","radiant"].map(L=>{const N=r.has(`${k.id}:${L}`);return`<span class="morph-pill ${N?L==="radiant"?"radiant":L==="mystic"?"mystic":"":"locked"}">${N?Be[L].badge:`🔒 ${Be[L].shortLabel}`}</span>`}).join("")}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${y(A.uid)}"
                        class="brass-btn ${m?"":"gold-cta"}"
                        ${m?"disabled":""}
                      >
                        ${m?"🥚 Đang ấp":`🥚 Ấp (${s.sandboxMode?"0G":`${D}G`})`}
                      </button>
                    </div>
                  `}).join("")}
            </div>
          `;g=`${E}${T}`}else{const m=i.activeExpedition;let E="";if(m){const A=ts.find(O=>O.id===m.expeditionId)??ts[0],k=s.buildings.find(O=>O.uid===m.habitatUid),C=k?se(k.itemId):void 0,M=k?.creatureNickname||C?.creatureName||"Thú cưng",D=a>=m.endsAt,F=Math.max(0,Math.ceil((m.endsAt-a)/1e3)),L=Math.max(1e3,m.endsAt-m.startedAt),N=D?100:Math.min(100,Math.round((a-m.startedAt)/L*100));E=`
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${A.emoji} ${y(M)} • ${y(A.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${D?"🎒 Đã về!":`${F}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${N}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${D?'<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>':'<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>'}
            </div>
          </div>
        `}else if(o.length===0)E=`
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;else{const k=(o.find(M=>M.building.uid===e.selectedSuitcaseHabitatUid)??o[0]).building,C=Ds(k.creatureBondLevel??1)*Be[k.creatureMorph??"normal"].incomeMult;E=`
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${o.map(({building:M,item:D})=>{const F=M.creatureNickname||D.creatureName||D.name,L=Be[M.creatureMorph??"normal"].shortLabel;return`<option value="${y(M.uid)}" ${M.uid===k.uid?"selected":""}>${y(F)} (💝Lv.${M.creatureBondLevel??1} • ${L})</option>`}).join("")}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${ts.map(M=>{const D=!s.sandboxMode&&s.level<M.minParkLevel,F=Math.round(M.baseGold*C),L=Math.round(M.baseXp*C),N=(k.creatureBondLevel??1)>=5?1:0,O=M.guaranteedIngredients.map(ne=>`+${ne.qty+N} ${wt[ne.id].emoji}`).join(" ");return`
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${M.emoji} ${y(M.name)} <span style="font-size:11.5px;color:#78350f;">(${M.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${F}🪙 • +${L}⭐ • ${O}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${M.id}"
                    class="brass-btn ${D?"":"gold-cta"}"
                    ${D?"disabled":""}
                  >
                    ${D?`🔒 Lv.${M.minParkLevel}`:"🧭 Cử Đi"}
                  </button>
                </div>
              `}).join("")}
          </div>
        `}const T=`
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${n}/${l})</span>
            <span style="color:#15803d;">+${c}%</span>
          </div>
          <progress max="${l}" value="${n}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${es.map(A=>`
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/trang-trai-hang-soc/sprites/${A.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${A.emoji} ${y(A.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${["normal","mystic","radiant"].map(k=>{const C=r.has(`${A.habitatItemId}:${k}`);return`<span class="morph-pill ${C?k==="radiant"?"radiant":k==="mystic"?"mystic":"":"locked"}">${C?Be[k].shortLabel:"🔒"}</span>`}).join("")}
                </div>
              </div>
            `).join("")}
        </div>
      `;g=`${E}${T}`}t.innerHTML=`${v}${g}`,t.querySelectorAll("[data-sc-tab]").forEach(m=>{m.addEventListener("click",()=>{e.activeSuitcaseTab=m.dataset.scTab,ye(e)})}),t.querySelector("#btnScOpenCreatureBuild")?.addEventListener("click",()=>{e.root.querySelector("#suitcaseDialog").close(),e.activeCategory="creature",e.refreshDock()}),t.querySelectorAll("[data-select-pet]").forEach(m=>{m.addEventListener("click",()=>{e.selectedSuitcaseHabitatUid=m.dataset.selectPet??null,ye(e)})});const f=t.querySelector("#formSuitcaseRename"),S=t.querySelector("#inpSuitcasePetName");if(S&&S.addEventListener("keydown",m=>{m.isComposing||m.stopPropagation()}),f&&S&&e.selectedSuitcaseHabitatUid){const m=e.selectedSuitcaseHabitatUid;f.addEventListener("submit",E=>{E.preventDefault();const T=e.sim.renameCreature(m,S.value);e.showToast(T.msg,"🏷️"),ye(e)})}if(e.selectedSuitcaseHabitatUid){const m=e.selectedSuitcaseHabitatUid,E=()=>{const T=e.sim.groomCreature(m);e.showToast(T.msg,T.ok?"🪮":"⏳"),ye(e)};t.querySelector("#btnScPetStage")?.addEventListener("click",E),t.querySelector("#btnScGroom")?.addEventListener("click",E),t.querySelector("#btnScFeed")?.addEventListener("click",()=>{e.sim.feedCreature(m),ye(e)}),t.querySelector("#btnScTrain")?.addEventListener("click",()=>{const T=e.sim.trainCreatureTrick(m);e.showToast(T.msg,T.ok?"🎾":"🪙"),ye(e)}),t.querySelector("#btnScLocate")?.addEventListener("click",()=>{const T=s.buildings.find(A=>A.uid===m);T&&(e.root.querySelector("#suitcaseDialog").close(),me(e.cam,T.gx+1,T.gy+1),e.inspectSelection={kind:"building",uid:T.uid},e.renderInspector())})}const $=t.querySelector("#chkScStarlight");$&&$.addEventListener("change",()=>{e.useStarlightForIncubation=$.checked}),t.querySelectorAll("[data-incubate-uid]").forEach(m=>{m.addEventListener("click",()=>{const E=m.dataset.incubateUid,T=e.useStarlightForIncubation&&(s.sandboxMode||(s.supply.ingredients.starlight_dust??0)>=1),A=e.sim.startMorphIncubation(E,T);e.showToast(A.msg,A.ok?"🥚":"⚠️"),ye(e)})}),t.querySelector("#btnScSpeedEgg")?.addEventListener("click",()=>{const m=e.sim.speedUpIncubationWithSand();e.showToast(m.msg,m.ok?"⏳":"⚠️"),ye(e)}),t.querySelector("#btnScClaimEgg")?.addEventListener("click",()=>{e.sim.claimMorphIncubation(),ye(e)});const x=t.querySelector("#selScExpPet");x&&x.addEventListener("change",()=>{e.selectedSuitcaseHabitatUid=x.value,ye(e)}),t.querySelectorAll("[data-start-exp]").forEach(m=>{m.addEventListener("click",()=>{const E=m.dataset.startExp,T=e.selectedSuitcaseHabitatUid??o[0]?.building.uid;if(!T)return;const A=e.sim.startSuitcaseExpedition(T,E);e.showToast(A.msg,A.ok?"🧭":"⚠️"),ye(e)})}),t.querySelector("#btnScSpeedExp")?.addEventListener("click",()=>{const m=e.sim.speedUpExpeditionWithSand();e.showToast(m.msg,m.ok?"⏳":"⚠️"),ye(e)}),t.querySelector("#btnScClaimExp")?.addEventListener("click",()=>{e.sim.claimSuitcaseExpedition(),ye(e)})}const Da="/api/track",Oa=25,Fa=3e4;class za{constructor(t={}){w(this,"endpoint");w(this,"batchSize");w(this,"batchIntervalMs");w(this,"queue",[]);w(this,"timer",null);w(this,"lastLevel",null);w(this,"isFlushing",!1);w(this,"isInitialized",!1);this.endpoint=t.endpoint||Da,this.batchSize=t.batchSize||Oa,this.batchIntervalMs=t.batchIntervalMs||Fa}track(t,s){const i={id:this.generateEventId(),name:t,props:s?{...s}:void 0,timestamp:Date.now()};this.queue.push(i),this.queue.length>=this.batchSize&&this.flush().catch(()=>{})}reportUpload(t){this.track("save_uploaded",t)}async flush(t=!1){if(this.queue.length===0||this.isFlushing||typeof window>"u"||typeof fetch!="function"||typeof navigator<"u"&&!navigator.onLine)return;const s=this.queue.splice(0,this.queue.length);if(s.length===0)return;const i={events:s,sentAt:Date.now()},a=JSON.stringify(i);if(t&&typeof navigator<"u"&&typeof navigator.sendBeacon=="function")try{const o=new Blob([a],{type:"application/json"});if(navigator.sendBeacon(this.endpoint,o))return}catch{}this.isFlushing=!0;try{await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:a,keepalive:!0})}catch{}finally{this.isFlushing=!1}}init(t){if(!this.isInitialized){if(this.isInitialized=!0,this.trackSessionStart(),typeof window<"u")this.timer=window.setInterval(()=>{this.flush().catch(()=>{})},this.batchIntervalMs),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flush().catch(()=>{})}),window.addEventListener("pagehide",()=>{this.flush(!0).catch(()=>{})}),window.addEventListener("game:tick",s=>{this.handleGameTick(s)}),window.addEventListener("gamesave:uploaded",s=>{const i=s;this.track("save_uploaded",i.detail||{})});else if(t){const s=t.onUploadSuccess;t.onUploadSuccess=i=>{if(s)try{s(i)}catch{}this.track("save_uploaded",i)}}}}destroy(){this.timer!==null&&(clearInterval(this.timer),this.timer=null),this.isInitialized=!1}trackSessionStart(){let t="unknown",s="unknown",i="unknown";typeof window<"u"&&(t=`${window.innerWidth}x${window.innerHeight}`,s=navigator.language||"vi",i=navigator.userAgent||""),this.track("session_start",{screen:t,language:s,userAgent:i,referrer:typeof document<"u"&&document.referrer||""})}handleGameTick(t){const i=t.detail;i&&(this.track("game:tick",{level:i.level,galleons:i.galleons}),typeof i.level=="number"&&(this.lastLevel!==null&&i.level>this.lastLevel&&this.track("level_up",{oldLevel:this.lastLevel,newLevel:i.level}),this.lastLevel=i.level))}generateEventId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,9)}`}}class Ga{constructor(t,s={}){w(this,"analytics");w(this,"maxErrorsPerSession");w(this,"isListening",!1);w(this,"seenSignatures",new Set);w(this,"errorCountThisSession",0);w(this,"handleError",t=>{const s=t.message||(t.error?String(t.error):"Uncaught runtime error"),i=t.error&&typeof t.error=="object"&&"stack"in t.error?String(t.error.stack):"",a=t.filename||(typeof window<"u"?window.location.href:""),o={msg:s,stack:i,url:a,line:t.lineno,col:t.colno,type:"uncaught_error"};this.recordDeduplicatedError(o),console.error("[ErrorMonitor] Uncaught error detected:",t.message,t.error)});w(this,"handleUnhandledRejection",t=>{const s=t.reason,i=s instanceof Error,a=i?s.message:s?String(s):"Unhandled promise rejection",o=i&&s.stack||"",r=typeof window<"u"?window.location.href:"",l={msg:a,stack:o,url:r,type:"unhandledrejection"};this.recordDeduplicatedError(l),console.error("[ErrorMonitor] Unhandled Promise rejection detected:",s)});this.analytics=t,this.maxErrorsPerSession=Math.max(1,s.maxErrorsPerSession??10)}recordDeduplicatedError(t){if(this.errorCountThisSession>=this.maxErrorsPerSession)return;const s=`${t.type||"err"}|${t.msg.slice(0,160)}|${t.line??0}|${t.col??0}`;if(!this.seenSignatures.has(s)){this.seenSignatures.add(s),this.errorCountThisSession+=1;try{this.analytics.track("error",t)}catch{}}}init(){this.isListening||typeof window>"u"||(this.isListening=!0,window.addEventListener("error",this.handleError),window.addEventListener("unhandledrejection",this.handleUnhandledRejection))}destroy(){!this.isListening||typeof window>"u"||(this.isListening=!1,window.removeEventListener("error",this.handleError),window.removeEventListener("unhandledrejection",this.handleUnhandledRejection))}}class Va{constructor(){w(this,"buttonEl",null);w(this,"dialogEl",null);w(this,"activeTab","privacy");w(this,"isMounted",!1)}mount(){if(this.isMounted||typeof document>"u")return;this.isMounted=!0,this.buttonEl=document.createElement("button"),this.buttonEl.className="legal-trigger-btn",this.buttonEl.type="button",this.buttonEl.setAttribute("aria-haspopup","dialog"),this.buttonEl.setAttribute("aria-label","Pháp lý, Quyền riêng tư & Điều khoản"),this.buttonEl.innerHTML='<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>',this.buttonEl.addEventListener("click",()=>{this.open()}),this.dialogEl=document.createElement("dialog"),this.dialogEl.className="legal-dialog",this.dialogEl.innerHTML=`
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
    `;const t=this.dialogEl.querySelector(".legal-close-btn");t&&t.addEventListener("click",()=>this.close());const s=this.dialogEl.querySelector(".legal-confirm-btn");s&&s.addEventListener("click",()=>this.close()),this.dialogEl.addEventListener("click",a=>{a.target===this.dialogEl&&this.close()}),this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(a=>{a.addEventListener("click",()=>{const o=a.getAttribute("data-tab");o&&this.switchTab(o)})}),document.body.appendChild(this.buttonEl),document.body.appendChild(this.dialogEl)}open(){if(this.dialogEl||this.mount(),this.dialogEl&&typeof this.dialogEl.showModal=="function")try{this.dialogEl.showModal()}catch{this.dialogEl.setAttribute("open","")}}close(){if(this.dialogEl)if(typeof this.dialogEl.close=="function")try{this.dialogEl.close()}catch{this.dialogEl.removeAttribute("open")}else this.dialogEl.removeAttribute("open")}switchTab(t){if(this.activeTab=t,!this.dialogEl)return;this.dialogEl.querySelectorAll(".legal-tab-btn").forEach(a=>{const o=a.getAttribute("data-tab")===t;a.setAttribute("aria-selected",o?"true":"false"),a.setAttribute("data-active",o?"true":"false")}),this.dialogEl.querySelectorAll(".legal-panel").forEach(a=>{const o=a.getAttribute("data-panel")===t;a.setAttribute("data-active",o?"true":"false"),a.style.display=o?"block":"none"})}unmount(){this.buttonEl&&this.buttonEl.parentNode&&this.buttonEl.parentNode.removeChild(this.buttonEl),this.dialogEl&&this.dialogEl.parentNode&&this.dialogEl.parentNode.removeChild(this.dialogEl),this.buttonEl=null,this.dialogEl=null,this.isMounted=!1}}class _a{constructor(){w(this,"cloudSave");w(this,"analytics");w(this,"errorMonitor");w(this,"legalModal");w(this,"authoritativeClient");w(this,"hpvnBridge");w(this,"isInitialized",!1);w(this,"lastAuthoritativeWalletBalance",null);w(this,"walletSyncTimer",null);w(this,"isApplyingServerWallet",!1);w(this,"boundSim",null);this.cloudSave=new Mi,this.analytics=new za,this.errorMonitor=new Ga(this.analytics),this.legalModal=new Va,this.authoritativeClient=ct(),this.hpvnBridge=ea({getSnapshot:()=>{try{const t=typeof localStorage<"u"?localStorage.getItem(un):null;if(!t)return{};const s=JSON.parse(t),i=s.match3&&typeof s.match3=="object"?s.match3:null,a=s.settings&&typeof s.settings=="object"?s.settings:null;return{version:Number(s.version||3),parkName:String(s.parkName||"Trang Trại Hang Sóc").slice(0,42),level:Math.max(1,Math.floor(Number(s.level)||1)),xp:Math.max(0,Math.floor(Number(s.xp)||0)),magicStars:Math.max(0,Math.floor(Number(i?.stars??s.magicStars)||0)),unlockedZonesCount:Array.isArray(s.unlockedZones)?s.unlockedZones.length:1,buildingsCount:Array.isArray(s.buildings)?s.buildings.length:0,weatherMode:String(a?.weatherOverride||s.weatherMode||"auto"),atmosphereMode:String(a?.timeOverride||s.timeMode||"auto")}}catch{return{}}},onAtmosphereChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:atmosphere",{detail:{mode:t}}))},onWeatherChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:weather",{detail:{mode:t}}))},onMuteChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:mute",{detail:{muted:t}}))},onEventChange:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:event",{detail:{mode:t}}))},onStartTour:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:t}}))},onStopTour:()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:tour-garden",{detail:{tourId:null}}))},notify:t=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:toast",{detail:{text:t}}))}})}init(){if(!this.isInitialized){this.isInitialized=!0;try{this.errorMonitor.init(),this.analytics.init(this.cloudSave),this.legalModal.mount(),this.cloudSave.init(),typeof window<"u"&&(window.addEventListener("hpvn:sync-state",t=>{const s=t.detail;s&&typeof s=="object"&&this.hpvnBridge.syncState(s)}),window.addEventListener("hpvn:share-floo",t=>{const s=t.detail??{};this.hpvnBridge.shareToFloo({...s,sendToFloo:s.sendToFloo??(async(i,a)=>{if(typeof this.authoritativeClient.host!="function")return!1;try{const o=await this.authoritativeClient.host("floo-share",{text:i,...a.image?{image:a.image}:{},...a.tourId?{tourId:a.tourId}:{}});return!!(o&&typeof o=="object"&&o.ok!==!1)}catch{return!1}})})}),window.addEventListener("hpvn:visit-help",t=>{const s=t.detail;s?.hostUid&&this.authoritativeClient.visit({hostUid:s.hostUid,help:!0,buildingUid:s.buildingUid,kind:s.kind||"water_crop",noteText:s.noteText,helperName:s.helperName,helperEmoji:s.helperEmoji}).catch(()=>{})})),(typeof navigator>"u"||navigator.onLine)&&this.authoritativeClient.read().then(t=>{if(t.wallet&&typeof t.wallet.spendable=="number"&&this.syncWalletBaseline(t.wallet.spendable),typeof t.uid=="string"&&t.uid){const s=this.cloudSave.getUserId(),i=Ts(t.uid);i!==s&&Li(i).catch(()=>null).then(()=>this.cloudSave.downloadNow()).then(()=>{typeof window<"u"&&this.authoritativeClient.snapshot&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:this.authoritativeClient.snapshot}))}).catch(()=>{})}typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:authoritative-snapshot",{detail:t}))}).catch(()=>{}),this.hpvnBridge.notifyReady({uid:this.cloudSave.getUserId(),region:"asia-southeast1",protocol:"burrow-hpvnn-25.1"}),console.info("🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.")}catch(t){console.error("[Hang Soc Online] Lỗi khi khởi động dịch vụ online:",t)}}}syncWalletBaseline(t){Number.isFinite(t)&&(this.lastAuthoritativeWalletBalance=Math.max(0,Math.floor(t)))}bindSimulationGringottsWallet(t,s={}){if(this.boundSim===t)return()=>{};this.boundSim=t,this.lastAuthoritativeWalletBalance===null&&this.authoritativeClient.snapshot?.wallet&&typeof this.authoritativeClient.snapshot.wallet.spendable=="number"&&this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);const i=t.saveToStorage.bind(t),a=Math.max(0,s.debounceMs??180),o=n=>{const c=Math.max(0,Math.floor(n));this.syncWalletBaseline(c),this.isApplyingServerWallet=!0;try{const d=t.homeStateWhileVisiting??t.state;!d.sandboxMode&&!d.sandboxTainted&&(d.galleons=c,t.homeStateWhileVisiting&&(t.state.galleons=c),i(),t.onUiChange?.())}finally{this.isApplyingServerWallet=!1}},r=async()=>{if(this.walletSyncTimer=null,this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const n=t.homeStateWhileVisiting??t.state;if(n.sandboxMode||n.sandboxTainted||t.isHeadmasterPreview)return;const c=Math.max(0,Math.floor(Number(n.galleons)||0)),d=c-this.lastAuthoritativeWalletBalance;if(d===0)return;const p=this.lastAuthoritativeWalletBalance;this.lastAuthoritativeWalletBalance=c;const u=d<0?"debit":"credit";let v=Math.abs(d);const g=u==="credit"?1e3:5e4;try{let f=null;for(;v>0;){const S=Math.min(v,g);v-=S,f=await this.authoritativeClient.settleWallet({direction:u,amount:S,reasonCode:u==="debit"?"burrow_gameplay_spend":"burrow_gameplay_earn",sourceType:u==="debit"?"burrow-garden-store":"burrow-garden-market",clientLevel:Math.max(1,Math.floor(Number(n.level)||1))})}f?.wallet&&typeof f.wallet.spendable=="number"&&(o(f.wallet.spendable),s.onSnapshot?.(f))}catch(f){const S=f;if(S?.definitive===!0){const $=_t(S);s.onToast?.(`🏦 Gringotts HPVN: ${$.text}`,$.icon);const x=S.details?.spendable;typeof x=="number"&&Number.isFinite(x)?o(x):await this.authoritativeClient.read().then(m=>{m.wallet&&typeof m.wallet.spendable=="number"&&o(m.wallet.spendable)}).catch(()=>{o(p)})}else this.lastAuthoritativeWalletBalance=p}},l=()=>{if(this.isApplyingServerWallet||this.lastAuthoritativeWalletBalance===null)return;const n=t.homeStateWhileVisiting??t.state;n.sandboxMode||n.sandboxTainted||t.isHeadmasterPreview||Math.max(0,Math.floor(Number(n.galleons)||0))===this.lastAuthoritativeWalletBalance||(this.walletSyncTimer!==null&&clearTimeout(this.walletSyncTimer),a===0?r():this.walletSyncTimer=setTimeout(()=>{r()},a))};return t.saveToStorage=()=>{i(),l()},()=>{this.walletSyncTimer!==null&&(clearTimeout(this.walletSyncTimer),this.walletSyncTimer=null),t.saveToStorage=i,this.boundSim===t&&(this.boundSim=null)}}}const Ae=new _a;typeof window<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{Ae.init()},{once:!0}):Ae.init());const Ot={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},bs={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function qs(e){const t=e.sim.state.housePoints,s=["Gryffindor","Ravenclaw","Hufflepuff","Slytherin"];let i="Gryffindor",a=-1;for(const o of s){const r=Number(t?.[o]??0);r>a&&(a=r,i=o)}return i}function at(e,t,s=""){const i=Ni(e),a=(t||"🧙").trim().slice(0,2);return i?`<span class="floo-avatar-shell ${s}"><img src="${y(i)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${y(a)}</span></span>`:`<span class="floo-avatar-shell ${s}"><span class="floo-avatar-fallback">${y(a)}</span></span>`}function Rn(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Ft(e){const t=e.sim.ensureNeighborSocial(),s=qs(e),i=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:i,level:e.sim.state.level,house:s,keeperTitle:an(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day"}}function Ps(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),e.selectedCatalogItem=null,e.moveModeActive=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function Dn(e,t){if(!t||typeof t!="object")return;const s=t,i=e.sim.ensureNeighborSocial();let a=!1;typeof s.uid=="string"&&s.uid.trim()&&Ts(s.uid);const o=typeof s.garden?.progression?.friendCode=="string"&&s.garden.progression.friendCode.trim()||(s.profile&&typeof s.profile=="object"&&typeof s.profile.friendCode=="string"?String(s.profile.friendCode).trim():"");if(o&&i.playerFriendCode!==o&&(i.playerFriendCode=o,a=!0),s.wallet&&typeof s.wallet.spendable=="number"&&Number.isFinite(s.wallet.spendable)){const n=e.sim.homeStateWhileVisiting??e.sim.state,c=Math.max(0,Math.floor(s.wallet.spendable));if(Ae.syncWalletBaseline(c),!n.sandboxMode&&!n.sandboxTainted&&!e.sim.isHeadmasterPreview){const d=!!s.receipt,p=Ei(n);(d||p||c>=n.galleons)&&n.galleons!==c&&(n.galleons=c,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=c),a=!0)}}const r=s.profile&&typeof s.profile=="object"?s.profile:null;if(r){const n=typeof r.username=="string"?r.username.trim():"";n&&n!=="Phù Thủy Hang Sóc"&&n!=="Trang Trại Hang Sóc"&&!i.playerDisplayName&&(i.playerDisplayName=n,a=!0);const c=typeof r.avatarUrl=="string"?r.avatarUrl.trim():"";c&&i.playerAvatarUrl!==c&&(i.playerAvatarUrl=c,a=!0)}const l=s.daily&&typeof s.daily=="object"?s.daily:null;if(l&&typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ee,Math.floor(l.helpsLeft)));const n=Math.max(0,Ee-e.flooHelpsLeft);n>(i.dailyGardenHelpsCount??0)&&(i.dailyGardenHelpsCount=n,a=!0)}if(Array.isArray(s.helpers)&&s.helpers.length>0){e.flooHelpersToday=s.helpers.map(c=>({uid:String(c.uid||""),name:String(c.name||"Bạn HPVN"),avatarEmoji:c.avatarEmoji,avatarUrl:c.avatarUrl,at:Number(c.at||0)}));const n=qi(e.flooHelpersToday,i.lastSeenHelperAt??0);n&&n.textVi&&n.seenAt>(i.lastSeenHelperAt??0)&&(i.lastSeenHelperAt=n.seenAt,a=!0,e.showToast(n.textVi,"🤝"))}if(s.houseCup&&typeof s.houseCup=="object"){const n=s.houseCup,c=n.houses&&typeof n.houses=="object"?n.houses:null;c&&typeof n.weekKey=="string"&&(e.sim.state.weeklyHouseCupServerStandings={weekKey:n.weekKey,totals:{Gryffindor:Math.max(0,Math.floor(Number(c.Gryffindor)||0)),Slytherin:Math.max(0,Math.floor(Number(c.Slytherin)||0)),Ravenclaw:Math.max(0,Math.floor(Number(c.Ravenclaw)||0)),Hufflepuff:Math.max(0,Math.floor(Number(c.Hufflepuff)||0))},playerContribution:Math.max(0,Math.floor(Number(n.memberTodayPoints)||0)),updatedAt:Date.now()},a=!0)}a&&(e.sim.saveToStorage(),e.refreshAll())}async function kt(e,t=!1){if(e.flooLoading)return;const s=Date.now();if(!t&&e.flooLastLoadedAt>0&&s-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const i=e.sim.ensureNeighborSocial(),a=qs(e),o=i.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const r=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;r||Ai(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!r&&await Ae.authoritativeClient.syncProfile({playerName:o,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:i.playerAvatarUrl||"",avatarEmoji:bs[a],house:a,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(d=>Dn(e,d)).catch(()=>{});const l=await Ae.authoritativeClient.visit({});if(typeof l.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Ee,Math.floor(l.helpsLeft)));const d=Math.max(0,Ee-e.flooHelpsLeft);d>(i.dailyGardenHelpsCount??0)&&(i.dailyGardenHelpsCount=d)}const n=Array.isArray(l.visits)?l.visits:[],c=Rt(n,Date.now());e.flooDirectoryRows=c,e.flooQueueRows.length===0&&(e.flooQueueRows=c),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(c,lt())}catch{}finally{e.flooLoading=!1;const r=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";r?.open&&l!=="inpFlooDisplayName"&&xe(e),e.renderVisitorDockBar()}}function fs(e){const t=Ft(e),s=ms(e.gameCanvas,t),i=hn(s,.55),a=e.sim.recordFlooShareOrPostcard("shareFloo");typeof window<"u"&&window.dispatchEvent(new CustomEvent("hpvn:share-floo",{detail:{...t,tourId:lt(),image:i||void 0}})),a.rewarded&&e.showToast(a.msg,"🔥"),e.refreshAll()}function On(e,t,s){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),s&&(e.focusedNeighborId=s),(e.sim.state.level>=Qe||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&kt(e),xe(e);const a=e.root.querySelector("#neighborDialog");a&&!a.open&&a.showModal(),s&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${s}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function Fn(e,t){e.closeHudPopovers();const s=e.root.querySelector("#neighborDialog");s?.open&&s.close(),t.kind==="match3"?e.getMatch3Modal().then(i=>i.openRescue(t)):e.getPuzzleArcadeModal().then(i=>i.openRescue(t))}function Xt(e,t){Ps(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const i=e.sim.enterHonorGardenTour(t);i.ok&&typeof i.focusGx=="number"&&typeof i.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,i.focusGx,i.focusGy)):i.ok||e.showToast(i.msg,"⚠️"),e.refreshAll()}function Xe(e,t,s){const i=String(t||"").trim();if(!i)return;if(i.startsWith("tour_")){Xt(e,i);return}s&&s.length>0?e.flooQueueRows=[...s]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),Ps(e);const a=e.root.querySelector("#neighborDialog");a?.open&&a.close();const o=i.startsWith("player_")?i:`player_${i}`,r=i.startsWith("player_")?i.slice(7):i;(async()=>{try{const n=await Ae.authoritativeClient.visit({hostUid:r});typeof n.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Ee,Math.floor(n.helpsLeft))));const c=n.visit&&typeof n.visit=="object"?n.visit:null;if(c){const d=c.progression&&typeof c.progression=="object"?c.progression:void 0,p=Date.now(),u=Array.isArray(d?.timers)?d.timers.filter($=>Number($.readyAt||0)>p).length:0,v=c.decorations&&typeof c.decorations=="object"?c.decorations:void 0,g={uid:String(c.uid||r),friendCode:typeof c.friendCode=="string"?c.friendCode:void 0,username:String(c.username||"Thành Viên HPVN"),parkName:String(c.parkName||"Thung Lũng Phép Thuật"),house:c.house||"Gryffindor",avatarEmoji:typeof c.avatarEmoji=="string"?c.avatarEmoji:void 0,avatarUrl:typeof c.avatarUrl=="string"?c.avatarUrl:void 0,level:Math.max(1,Number(c.level||1)),growing:u,helped:!!c.helped,hostHelpsLeft:typeof c.hostHelpsLeft=="number"?c.hostHelpsLeft:10,fire:c.fire&&typeof c.fire=="object"?c.fire:null,scene:v?.scene},f=e.sim.syncFlooDirectoryMembers([g],lt()),S=c.rawClientSave&&typeof c.rawClientSave=="object"?c.rawClientSave:null;if(f[0]&&S){if(Array.isArray(S.buildings)&&S.buildings.length>0){const $=S.buildings.filter(x=>x&&typeof x.itemId=="string"&&!!se(x.itemId));$.length>0&&(f[0].valleyBuildings=$)}S.tileOverrides&&typeof S.tileOverrides=="object"&&(f[0].valleyTileOverrides=S.tileOverrides),Array.isArray(S.unlockedZones)&&S.unlockedZones.length>0&&(f[0].valleyUnlockedZones=S.unlockedZones)}}}catch{}const l=e.sim.enterNeighborVisit(o);l.ok&&typeof l.focusGx=="number"&&typeof l.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,l.focusGx,l.focusGy)):l.ok||e.showToast(l.msg,"⚠️"),e.refreshAll()})()}function zn(e,t){if(t.startsWith("tour_")){Xt(e,t);return}Ps(e);const s=e.root.querySelector("#neighborDialog");s?.open&&s.close();const i=e.sim.enterNeighborVisit(t);i.ok&&typeof i.focusGx=="number"&&typeof i.focusGy=="number"?(e.onCameraJump?.(),me(e.cam,i.focusGx,i.focusGy)):i.ok||e.showToast(i.msg,"⚠️"),e.refreshAll()}function Wt(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,t.focusGx,t.focusGy)),e.refreshAll()}function Ua(e){const t=e.sim.ensureNeighborSocial(),s=t.playerOwlHelpRequests.filter(c=>!!c.fulfilledAt).length,i=t.playerMinigameSos?.rescuedAt??0,a=!!t.playerMinigameSos?.claimed,o=`${t.lastSocialResetKey}|${t.friendshipTokens}|${s}|${i}|${a}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(o===e.lastSocialLiveSig)return;e.lastSocialLiveSig=o,Gn(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const l=e.root.querySelector("#neighborDialog"),n=document.activeElement?.id??"";l?.open&&n!=="inpFlooDisplayName"&&xe(e)}function Gn(e){const t=e.sim.ensureNeighborSocial(),s=Math.floor(t.friendshipTokens/Ke),i=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,a=t.homeLanternMarks.length,o=s+i+a,l=Math.max(0,ht-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(p=>p.minigameSos&&!p.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(p.id)).length:0,n=e.sim.state.level>=Qe&&(t.dailyGardenHelpsCount??0)<Ee?e.flooDirectoryRows.filter(p=>xt(p)).length:0,c=e.root.querySelector("#badgeNeighborCount");if(c){const p=o>0?o:l>0?l:n;p>0?(c.textContent=String(p),c.classList.toggle("is-ready-green",o>0),c.classList.remove("hidden")):c.classList.add("hidden")}const d=e.root.querySelector("#badgeManageNeighborCount");d&&(o>0?(d.textContent=String(o),d.classList.remove("hidden")):d.classList.add("hidden"))}function ja(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const s=e.sim.getActiveHonorGardenTour();if(s){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${y(s.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${y(s.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${s.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${y(s.ownerName)} · ${y(Ot[s.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const T=e.sim.cycleHonorGardenTour(-1);T.ok&&typeof T.focusGx=="number"&&typeof T.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,T.focusGx,T.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const T=e.sim.cycleHonorGardenTour(1);T.ok&&typeof T.focusGx=="number"&&typeof T.focusGy=="number"&&(e.onCameraJump?.(),me(e.cam,T.focusGx,T.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{fs(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Wt(e)});return}const i=e.sim.getActiveVisitingNeighbor();if(!i){t.classList.add("hidden"),t.innerHTML="";return}const a=e.sim.ensureNeighborSocial(),o=Date.now(),r=Math.min(Ee,Math.max(a.dailyGardenHelpsCount??0,i.helpedViaFlooToday?1:i.helpedMarksToday.length)),l=Math.max(0,Ee-r),n=!!(i.helpedViaFlooToday||i.helpedMarksToday.length>0),c=(i.hostHelpsLeft??10)<=0,d=!!(i.fireUntilMs&&i.fireUntilMs>o),p=!n&&l>0&&!c,u=a.dailyLikedNeighborIds.includes(i.id),v=a.dailyMysteryClaimedIds.includes(i.id),g=i.owlHelpCrates.filter(T=>!T.fulfilledByPlayerToday).length,f=e.sim.canRescueNeighborMinigame(i.id).ok,S=g+(f?1:0),$=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,x=i.remoteUserId||i.id.replace(/^player_/,""),m=$.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${$.slice(0,12).map(T=>{const A=T.uid===x,k=xt(T,o),C=!!(T.fire&&T.fire.until>o);return`
                <button
                  type="button"
                  class="floo-strip-dot ${A?"is-current":""} ${k?"is-helpable":""} ${C?"is-fire":""}"
                  data-floo-jump="${y(T.uid)}"
                  title="${y(T.username)} (Lv.${T.level})"
                >
                  ${at(T.avatarUrl,T.avatarEmoji||T.username,"floo-strip-avatar")}
                  ${C?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",E=n?"✓ Đã giúp (-15p)":l<=0?"Hết lượt (5/5)":c?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${m}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${at(i.avatarUrl,i.avatarEmoji||i.name,"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${y(i.name)}</strong>
            <span class="visitor-lv-tag">Lv.${i.level}</span>
            ${d?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${l}/${Ee}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${a.friendshipTokens}/${Ke}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${$.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${p?"gold-cta":""}" ${p?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${E}
        </button>
        ${d?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${u?"disabled":""} title="Thả tim khen vườn">
          ${u?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${v?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${v?"✓ Quà":"🎁 Quà"}
        </button>
        ${S>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${S})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,Rn(t),t.querySelectorAll("[data-floo-jump]").forEach(T=>{T.addEventListener("click",()=>{const A=T.dataset.flooJump;A&&A!==x&&Xe(e,A,$)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const T=t.querySelector("#btnVisitorFlooHelp");T&&(T.disabled=!0);let A;if(i.remoteUserId)try{const M=Pi(a.selectedPresetNoteId),D=await Ae.authoritativeClient.visit({hostUid:i.remoteUserId,help:!0,kind:"water_crop",noteText:M.textVi});typeof D.helpsLeft=="number"&&(A=D.helpsLeft,e.flooHelpsLeft=D.helpsLeft)}catch(M){const D=_t(M);if(D.reason==="already-helped"||D.reason==="daily-help-cap"||D.reason==="host-help-cap"){e.showToast(`${D.icon} ${D.text}`,D.icon),kt(e,!0),e.refreshAll();return}}const k=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:A});if(!k.ok){e.showToast(k.msg,"🤝"),e.refreshAll();return}const C=M=>M.map(D=>D.uid===x?{...D,helped:!0}:D);if(e.flooDirectoryRows=C(e.flooDirectoryRows),e.flooQueueRows=C(e.flooQueueRows),e.refreshAll(),k.helpsLeft>0&&e.flooQueueRows.length>1){const M=ns(e.flooQueueRows,x,1);M&&M.uid!==x&&xt(M)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===i.id&&Xe(e,M.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const T=t.querySelector("#btnVisitorExtinguish");T&&(T.disabled=!0);try{let A=0;if(i.remoteUserId){const C=await Ae.authoritativeClient.fireOut({hostUid:i.remoteUserId});A=Math.max(0,Math.floor(Number(C?.price||0)))}if(A>0){const C=e.sim.homeStateWhileVisiting??e.sim.state;C.galleons=Math.max(0,C.galleons-A),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=C.galleons)}i.fireUntilMs=0;const k=C=>C.map(M=>M.uid===x?{...M,fire:null}:M);e.flooDirectoryRows=k(e.flooDirectoryRows),e.flooQueueRows=k(e.flooQueueRows),e.showToast(A>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${i.name} (-${A} G)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${i.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(A){const k=_t(A);e.showToast(`${k.icon} ${k.text}`,k.icon),T&&(T.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const T=e.sim.likeVisitedNeighborFarm();T.ok||e.showToast(T.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{v||(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,i.mysteryGiftGx+.5,i.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{On(e,"friends",i.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const T=ns($,x,-1);T&&T.uid!==x&&Xe(e,T.uid,$)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if($.length>1){const A=ns($,x,1);if(A&&A.uid!==x){Xe(e,A.uid,$);return}}const T=e.sim.cycleNextNeighborVisit();T.ok&&typeof T.focusGx=="number"&&typeof T.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),me(e.cam,T.focusGx,T.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Wt(e)})}function xe(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const s=e.sim.ensureNeighborSocial(),i=e.sim.getActiveVisitingNeighbor(),a=e.sim.getActiveHonorGardenTour(),o=Date.now(),r=qs(e),l=s.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",n=Math.min(Ee,Math.max(0,s.dailyGardenHelpsCount??0)),c=Math.max(0,Ee-n),d=Math.max(0,ht-s.dailyRescuesGivenIds.length),p=Math.max(0,ht-s.dailyRescuesReceivedCount),u=Math.max(0,Nt-s.dailyOwlHelpRequestedCount),v=s.friendshipTokens>=Ke,g=Math.min(100,Math.round(s.friendshipTokens/Ke*100)),f=s.playerMinigameSos&&!s.playerMinigameSos.claimed?s.playerMinigameSos:null,S=e.sim.state.level>=Qe||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,$=`
    <div class="nb-summary-ribbon">
      <div class="nb-stat-pill token">
        <span>🍀</span>
        <strong>${s.friendshipTokens}/${Ke}</strong>
        ${v?'<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>':""}
      </div>
      <div class="nb-stat-pill">
        <span>🔥 <strong>${c}/${Ee}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${d}/${ht}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${u}/${Nt}</strong></span>
      </div>
    </div>
  `,x=`
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        🖼️ Bưu Thiếp ${s.dailyFlooShareClaimed?"":"(!)"}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        🎁 Rương &amp; SOS ${v||f?.rescuedAt?"(!)":""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        📜 Lưu Bút (${s.activityLog.length})
      </button>
      <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
        🏆 BXH
      </button>
    </div>
  `;let m="";if(e.activeNeighborTab==="friends"){const k=[];if(f?.rescuedAt){const F=is(f.kind);k.push(`
        <div class="nb-alert-banner ready">
          <span>🎉 <strong>${y(f.rescuerEmoji??"🦉")} ${y(f.rescuerName??"Bạn HPVN")}</strong> đã vượt hộ <strong>${F.icon} Màn ${f.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `)}else if(f){const F=is(f.kind);k.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${F.icon} Màn ${f.stage}</strong> trên Cổng Floo…</span>
        </div>
      `)}s.homeLanternMarks.length>0&&k.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${s.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${s.homeLanternMarks.length}🍀)</button>
        </div>
      `);const C=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${at(s.playerAvatarUrl,bs[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${Ot[r]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${y(l)}"
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
    `;let M="";if(S){const F=Rt(e.flooDirectoryRows,o),L=F.filter(B=>xt(B,o)).length,N=[...e.flooHelpersToday,...s.homeLanternMarks.map(B=>({uid:B.helperId,name:B.helperName,avatarEmoji:B.helperEmoji,avatarUrl:B.helperAvatarUrl,at:B.createdAt}))],O=Array.from(new Map(N.map(B=>[B.uid||B.name,B])).values()),ne=O.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${O.slice(0,6).map(B=>at(B.avatarUrl,B.avatarEmoji||B.name,"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${y(Hi(O))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${O.length*15} phút</strong>!
              </div>
            </div>
          `:"",P=F.length>0?`
            <div class="floo-portal-grid" role="list">
              ${F.map(B=>{const _=!!(B.fire&&B.fire.until>o),re=xt(B,o),ie=i?.remoteUserId===B.uid||i?.id===`player_${B.uid}`,X=_?"🔥 Đang cháy · cần dập!":B.helped?"✓ Đã chăm giúp":B.growing>0?`🌱 ${B.growing} mẻ đang lớn`:"🌿 Thung lũng yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${_?"is-fire":""} ${re?"is-helpable":""} ${B.helped?"is-helped":""} ${ie?"is-visiting":""}"
                      data-floo-portal="${y(B.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${at(B.avatarUrl,B.avatarEmoji||B.username,"floo-portal-avatar")}
                        ${_?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${B.level}</span>
                      </div>
                      <strong class="floo-portal-name">${y(B.username)}</strong>
                      <span class="floo-portal-park">${y((B.house?bs[B.house]:"")||"🪄")} ${y(B.parkName||"")}</span>
                      <span class="floo-portal-status">${X}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…":"🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!"}
            </div>
          `,V=s.neighbors.filter(B=>B.owlHelpCrates.some(_=>!_.fulfilledByPlayerToday)||!!(B.minigameSos&&!B.minigameSos.rescuedToday)),W=V.length>0?`
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${V.slice(0,6).map(B=>{const _=e.sim.canRescueNeighborMinigame(B.id),re=B.minigameSos,ie=re?is(re.kind):null,X=!!(re&&(re.rescuedToday||s.dailyRescuesGivenIds.includes(B.id))),ce=B.owlHelpCrates.filter(le=>!le.fulfilledByPlayerToday).map(le=>{const ue=Ne(le.itemId),J=e.sim.getFarmItemCount(le.itemId),Te=e.sim.state.sandboxMode||J>=le.qty;return`
                          <div class="nb-crate-item">
                            <img src="${ue.iconSrc}" alt="${y(ue.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${le.qty} ${y(ue.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":J}/${le.qty})</span></div>
                              <div class="nb-crate-rew">+${le.rewardTokens}🍀 • +${le.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${Te?"gold-cta":""} nb-mini-cta" data-nb-crate="${y(B.id)}|${y(le.id)}" ${Te?"":"disabled"}>📦 Đóng giúp</button>
                          </div>
                        `}).join(""),fe=re&&ie&&!X?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${ie.icon} ${y(ie.nameVi)} • <strong>Màn ${re.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${y(B.id)}" ${_.ok?"":"disabled"}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===B.id?"focused":""}" data-neighbor-card="${y(B.id)}">
                        <div class="nb-card-head">
                          ${at(B.avatarUrl,B.avatarEmoji||B.name,"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${y(B.name)}</strong>
                              <span class="nb-badge-pill">Lv.${B.level}</span>
                              <span class="nb-badge-pill house">${Ot[B.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${y(B.id)}">🔥 Bay tới</button>
                        </div>
                        ${ce?`<div class="nb-coop-section"><div class="nb-crate-list">${ce}</div></div>`:""}
                        ${fe}
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
                Còn <strong>${c}/${Ee} lượt chăm giúp</strong> hôm nay · <strong>${L}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"⏳…":"🔄"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${F.length===0?"disabled":""}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${ne}
        </section>
        ${P}
        ${W}
      `}else{const F=Math.min(100,Math.round(e.sim.state.level/Qe*100));M=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${Qe}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${e.sim.state.level}/${Qe}</strong> · Khi đạt Cấp ${Qe}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${F}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const D=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${s.dailyHonorTourClaimed?"✓ Đã nhận quà cảm hứng hôm nay":"🎁 +8G · +15 XP cảm hứng đầu ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${Ii.map(F=>{const L=a?.id===F.id;return`
              <article class="honor-garden-card ${L?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${y(F.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${y(F.titleVi)}</strong>
                    <span class="honor-garden-owner">${y(F.ownerName)} · Lv.${F.level} · ${Ot[F.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${y(F.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${y(F.weather)} · ${y(F.atmosphere)}</span>
                  ${L?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${y(F.id)}">🧭 Tham Quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;m=`
      ${k.join("")}
      ${C}
      ${S?`${M}${D}`:`${D}${M}`}
    `}else if(e.activeNeighborTab==="postcard"){const k=Ft(e),C=fn(k);m=`
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
        <div class="floo-postcard-caption">${y(C)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const k=s.playerOwlHelpRequests.length>0?s.playerOwlHelpRequests.map(C=>{const M=Ne(C.itemId);return`
                <div class="nb-crate-item ${C.fulfilledAt?"done":""}">
                  <img src="${M.iconSrc}" alt="${y(M.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${C.qty} ${y(M.name)}</div>
                    <div class="nb-crate-rew">${C.fulfilledAt?`✓ ${y(C.helperEmoji??"🦉")} ${y(C.helperName??"Bạn HPVN")}`:"🦉 Đang gọi hỗ trợ trên Cổng Floo…"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>';m=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${s.friendshipTokens}/${Ke} 🍀)</div>
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
            <span class="floo-chest-count">Đã mở: ${s.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${v?"":"disabled"}>
              🎁 Mở Rương (${Ke} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${f?`
                  <div class="nb-alert-banner ${f.rescuedAt?"ready":""}">
                    <span>${f.rescuedAt?`🎉 <strong>${y(f.rescuerEmoji??"🦉")} ${y(f.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${f.stage}</strong>!`:`🦉 Đang gọi cứu <strong>Màn ${f.stage}</strong>…`}</span>
                    ${f.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${p}/${ht}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${u}/${Nt}):</div>
            <div class="nb-crate-list">${k}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
          <div class="nb-preset-notes">
            ${Bi.map(C=>{const M=C.id===s.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${C.id}" data-active="${M}" aria-pressed="${M}" class="brass-btn nb-note-btn">
                  ${C.emoji} ${y(C.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else m=`<div class="nb-log-list">${s.activityLog.length>0?s.activityLog.map(C=>{const M=new Date(C.timestamp),D=String(M.getHours()).padStart(2,"0"),F=String(M.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${y(C.icon)}</span>
                  <span class="nb-log-msg">${y(C.textVi)}</span>
                  <span class="nb-log-time">${D}:${F}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>'}</div>`;t.innerHTML=`
    ${$}
    ${x}
    ${m}
  `,Rn(t);const E=t.querySelector("#flooPostcardCanvas");E&&ms(e.gameCanvas,Ft(e),E),t.querySelectorAll("[data-nbtab]").forEach(k=>{k.addEventListener("click",()=>{e.activeNeighborTab=k.dataset.nbtab,xe(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",xe(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{fs(e),xe(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{fs(e),xe(e)}),t.querySelector("#btnPostcardDownload")?.addEventListener("click",()=>{const k=t.querySelector("#flooPostcardCanvas")??ms(e.gameCanvas,Ft(e)),C=hn(k,.72);if(C){const D=document.createElement("a");D.href=C,D.download=`buu-thiep-hang-soc-lv${e.sim.state.level}.${C.startsWith("data:image/webp")?"webp":"png"}`,D.click()}const M=e.sim.recordFlooShareOrPostcard("postcard");e.showToast(M.msg,"🖼️"),xe(e)}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",k=>{k.preventDefault();const M=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);M&&(s.playerDisplayName=M,e.sim.saveToStorage(),kt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${M}"!`,"🔥"),xe(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{kt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const k=Rt(e.flooDirectoryRows,Date.now());k.length>0&&Xe(e,k[0].uid,k)}),t.querySelectorAll("[data-floo-portal]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.flooPortal;if(!C)return;const M=Rt(e.flooDirectoryRows,Date.now());Xe(e,C,M)})}),t.querySelectorAll("[data-honor-tour]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.honorTour;C&&Xt(e,C)})});const A=()=>{const k=e.sim.openFriendshipChest();k.ok||e.showToast(k.msg,"🍀"),e.refreshAll(),xe(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",A),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",A),t.querySelector("#btnNbOpenFriendsLeaderboard")?.addEventListener("click",()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach(k=>{k.addEventListener("click",()=>{const C=e.sim.claimPlayerMinigameSosRescue();C.ok||e.showToast(C.msg,"⚠️"),e.refreshAll(),xe(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const k=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const C of k)e.sim.claimHomeLanternMark(C.id);e.refreshAll(),xe(e)}),t.querySelectorAll("[data-nb-visit]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.nbVisit;C&&zn(e,C)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Wt(e)}),t.querySelectorAll("[data-nb-crate]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.nbCrate??"",[M,D]=C.split("|");if(!M||!D)return;const F=e.sim.fulfillNeighborOwlCrate(M,D);F.ok||e.showToast(F.msg,"🧺"),e.refreshAll(),xe(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.nbRescue;if(!C)return;const M=e.sim.canRescueNeighborMinigame(C);if(!M.ok||!M.neighbor||!M.sos){e.showToast(M.reason??"Không thể giải cứu màn này lúc này!","🦉");return}Fn(e,{neighborId:M.neighbor.id,neighborName:M.neighbor.name,neighborEmoji:M.neighbor.avatarEmoji,kind:M.sos.kind,stage:M.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(k=>{k.addEventListener("click",()=>{const C=k.dataset.nbNote;C&&(e.sim.setNeighborPresetNote(C),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),xe(e))})})}function zt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const i=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:.95;me(e.cam,t.gx+t.bw*.5+i,t.gy+t.bh*.5+i),e.onCameraJump?.()}function Vn(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const s=Date.now();return e.sim.state.buildings.some(a=>se(a.itemId)?.isAnimalPasturePlot&&a.pastureAnimalId&&a.pastureReadyAt&&s>=a.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0G"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const s=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(s)return{el:s,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function hs(e){const t=e.root.querySelector("#tutorialHudSpotlight"),s=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(c=>c.removeAttribute("data-tutorial-anchor")),!t)return;const i=!!document.querySelector("dialog[open]");if(e.photoModeActive||i||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:a,label:o}=Vn(e);if(!a||a.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const r=a.getBoundingClientRect();if(r.width<8||r.height<8){t.classList.add("hidden");return}const l=!!a.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");l||a.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!l);const n=6;t.style.setProperty("--spot-left",`${Math.round(r.left-n)}px`),t.style.setProperty("--spot-top",`${Math.round(r.top-n)}px`),t.style.setProperty("--spot-w",`${Math.round(r.width+n*2)}px`),t.style.setProperty("--spot-h",`${Math.round(r.height+n*2)}px`),t.classList.toggle("pill-below",r.top<110),s&&(s.textContent=o||"👇 Bấm"),t.classList.remove("hidden")}function _n(e,t){if(typeof t.hidePopover=="function")try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function Un(e,t){if(typeof t.showPopover=="function")try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function vs(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const s=!!document.querySelector("dialog[open]"),i=e.sim.getCurrentTutorialStep();if(e.photoModeActive||s||!i){_n(e,t),hs(e);return}const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const o=e.sim.getReadyOwlOrdersCount(),r=`${i.index}:${i.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${o}`;if(e.lastRenderedTutorialSig!==r){e.lastRenderedTutorialSig=r;const n=Vt.map(c=>`<span class="tutorial-step-dot ${c.index<i.index?"done":c.index===i.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${y(i.title)}</h2>
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
        `;else{const c=i.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>':i.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${o>0?"🔨 Xây":"🦉 Đơn Cú"}</button>`:"",d=i.id==="build_and_owl_order"?o>0?"🦉 Giao Đơn!":"🔨 Xây Dựng":i.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/trang-trai-hang-soc/sprites/${i.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${Vt.length}"
              aria-valuenow="${i.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${n}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${y(i.speakerName)}
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${y(i.title)}</h2>
            <div class="tutorial-hint-strip">${y(i.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${y(i.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${c}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${y(d)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,vs(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,vs(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{jn(e,i.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{i.id==="earn_magic_star"?e.openPuzzleArcadeDialog():i.id==="build_and_owl_order"&&(o>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}Un(e,t);const l=`${i.index}:${i.id}`;e.lastFocusedTutorialStepKey!==l&&(e.lastFocusedTutorialStepKey=l,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),hs(e)}function jn(e,t){if(t==="harvest_wheat"){if(e.sim.getTutorialWorldTarget())zt(e),e.showToast("🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!","🌾");else{const i=se("farmland_plot");i&&(e.selectedCatalogItem=i,e.refreshAll())}return}if(t==="sow_and_merge_plot"){zt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){zt(e);const s=Date.now();e.sim.state.buildings.some(a=>se(a.itemId)?.isAnimalPasturePlot&&a.pastureAnimalId&&a.pastureReadyAt&&s>=a.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?e.showToast("👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!","🥚"):e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}class Wa{constructor(t,s,i,a,o){w(this,"sim");w(this,"cam");w(this,"gameCanvas");w(this,"activeCategory",null);w(this,"selectedCatalogItem",null);w(this,"rotation",0);w(this,"bulldozerActive",!1);w(this,"moveModeActive",!1);w(this,"movingBuildingUid",null);w(this,"pincerActive",!1);w(this,"pincerPicked",null);w(this,"seedTrayOpen",!1);w(this,"seedFilterMode","all");w(this,"activeSeedCropId",null);w(this,"pendingSowPlotUid",null);w(this,"pastureTrayOpen",!1);w(this,"activePastureAnimalId",null);w(this,"pendingStockPastureUid",null);w(this,"rideCamUid",null);w(this,"rideCamSpeedText","");w(this,"pendingTouchTile",null);w(this,"onTouchConfirmPlace",null);w(this,"onTouchCancelPlace",null);w(this,"onCameraJump",null);w(this,"photoModeActive",!1);w(this,"inspectSelection",null);w(this,"minimapCanvas");w(this,"questCollapsed",!1);w(this,"minimapCollapsed",!1);w(this,"manageMenuOpen",!1);w(this,"weatherPopoverOpen",!1);w(this,"mapToolsExpanded",!1);w(this,"buildSheetOpen",!1);w(this,"minimapHudVisible",!1);w(this,"hudRolledUp",!1);w(this,"inspectorCollapsed",!1);w(this,"lastInspectedKey","");w(this,"displayedGalleons",-1);w(this,"galleonRollRaf",0);w(this,"activeWorkshopTab","barn");w(this,"activeQuestTab","orders");w(this,"activeAlbumTab","cup");w(this,"selectedOwlOrderId",null);w(this,"lastWsBrewId",null);w(this,"activeSuitcaseTab","care");w(this,"selectedSuitcaseHabitatUid",null);w(this,"useStarlightForIncubation",!0);w(this,"lastSuitcaseIncReady",!1);w(this,"lastSuitcaseExpReady",!1);w(this,"activeNeighborTab","friends");w(this,"focusedNeighborId",null);w(this,"flooDirectoryRows",[]);w(this,"flooQueueRows",[]);w(this,"flooHelpsLeft",null);w(this,"flooLoading",!1);w(this,"flooLastLoadedAt",0);w(this,"flooAutoAdvanceTimer",0);w(this,"flooHelpersToday",[]);w(this,"lastSocialLiveSig","");w(this,"tutorialMinimized",!1);w(this,"lastRenderedTutorialSig","");w(this,"lastFocusedTutorialStepKey","");w(this,"ribbonBannerTimer",0);w(this,"dialogOpenObserver",null);w(this,"match3Modal",null);w(this,"puzzleArcadeModal",null);w(this,"match3ModalPromise",null);w(this,"puzzleArcadeModalPromise",null);w(this,"seedQuizModal");w(this,"leaderboardModal");w(this,"root");w(this,"sprites");this.root=t,this.sim=s,this.cam=i,this.gameCanvas=a,this.sprites=o,this.questCollapsed=window.innerHeight<=520||window.innerWidth<=640,this.minimapCollapsed=!this.sim.isHeadmasterPreview&&this.sim.state.unlockedZones.length<3,"switch"in HTMLInputElement.prototype||vt(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),this.mountDOM(),this.installDialogLightDismissFallback(),typeof MutationObserver<"u"&&(this.dialogOpenObserver=new MutationObserver(r=>{for(const l of r)if(l.target instanceof HTMLDialogElement){this.renderTutorialCoach();break}}),this.dialogOpenObserver.observe(document.body,{attributes:!0,attributeFilter:["open"],subtree:!0})),window.addEventListener("resize",()=>this.updateTutorialHudSpotlight()),this.seedQuizModal=new ba(this.root,this.sim,()=>this.refreshAll(),(r,l)=>this.showToast(r,l),(r,l)=>{this.activeSeedCropId=r;const n=ve[r];if(l){const c=this.sim.state.buildings.find(d=>d.uid===l);if(c&&se(c.itemId)?.isFarmlandPlot&&!c.cropId){const d=this.sim.plantCropOnPlot(c.uid,r);this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.showToast(d.msg,d.ok?"🌱":"🪙"),this.refreshAll();return}}this.seedTrayOpen=!1,this.pendingSowPlotUid=null,this.inspectSelection=null,this.refreshAll(),this.showToast(`🌱 Đang cầm hạt ${n.emoji} ${n.name} (Túi còn ${this.sim.getSeedCount(r)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,n.emoji)}),this.seedQuizModal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.leaderboardModal=new ma(this.root,this.sim),this.leaderboardModal.onJumpToGame=r=>{const l=this.root.querySelector("#match3Dialog"),n=this.root.querySelector("#puzzleArcadeDialog"),c=this.root.querySelector("#seedQuizDialog");r==="match3"?(n?.close(),c?.close(),this.openMatch3Dialog()):r==="seedquiz"?(l?.close(),n?.close(),this.openSeedQuizDialog()):(l?.close(),c?.close(),this.openPuzzleArcadeDialog(r))},this.leaderboardModal.onVisitNeighbor=r=>{this.root.querySelector("#match3Dialog")?.close(),this.root.querySelector("#puzzleArcadeDialog")?.close(),this.root.querySelector("#seedQuizDialog")?.close(),this.root.querySelector("#neighborDialog")?.close(),this.enterVisitFromHud(r)},this.leaderboardModal.onOpenNeighborBook=()=>{this.openNeighborDialog("friends")},this.wireDraggableBanner(),this.bindEvents(),this.applyStoredA11ySettings(),this.refreshAll(),window.setInterval(()=>{if(this.refreshHeaderClock(),this.refreshFloatingBanner(),this.match3Modal?.tickLiveHeaderTimer(),this.root.querySelector("#workshopDialog")?.open&&this.updateWorkshopLiveTimers(),this.root.querySelector("#suitcaseDialog")?.open&&this.updateSuitcaseLiveTimers(),this.refreshSuitcaseBadge(),this.syncLiveNeighborSocialUI(),this.inspectSelection?.kind==="building"&&document.activeElement?.id!=="inpBuildingPrice"){const n=this.sim.state.buildings.find(p=>this.inspectSelection?.kind==="building"&&p.uid===this.inspectSelection.uid),c=n?se(n.itemId):void 0,d=Date.now();n&&(d<n.constructEndsAt||n.workshopQueue&&n.workshopQueue.length>0||n.cropId&&n.cropReadyAt&&d<n.cropReadyAt+1200||n.pastureAnimalId&&n.pastureReadyAt&&d<n.pastureReadyAt+1200||c&&c.cycleSec>0&&c.baseIncome>0)&&this.renderInspector()}},1e3)}mountDOM(){return fa(this)}wireDraggableBanner(){const t=this.root.querySelector("#floatingModeBanner"),s=this.root.querySelector("#floatingBannerGrip");if(!t||!s)return;s.classList.remove("hidden");const i=(n,c)=>{t.classList.add("is-floating-dragged");const d=Math.max(0,window.innerWidth-t.offsetWidth),p=Math.max(0,window.innerHeight-t.offsetHeight);t.style.right="auto",t.style.left=`${Math.max(0,Math.min(n,d))}px`,t.style.top=`${Math.max(0,Math.min(c,p))}px`};let a=0,o=0,r=0,l=0;s.addEventListener("pointerdown",n=>{if(n.button!==0)return;const c=t.getBoundingClientRect();a=n.clientX-c.left,o=n.clientY-c.top,r=n.clientX,l=n.clientY,s.setPointerCapture(n.pointerId)}),s.addEventListener("pointermove",n=>{s.hasPointerCapture(n.pointerId)&&(Math.hypot(n.clientX-r,n.clientY-l)>=4&&s.classList.add("dragging"),i(n.clientX-a,n.clientY-o))}),s.addEventListener("lostpointercapture",()=>{s.classList.remove("dragging")}),s.addEventListener("keydown",n=>{let d=0,p=0;if(n.key==="ArrowLeft")d=-15;else if(n.key==="ArrowRight")d=15;else if(n.key==="ArrowUp")p=-15;else if(n.key==="ArrowDown")p=15;else return;n.preventDefault();const u=t.getBoundingClientRect();i(u.left+d,u.top+p)}),window.addEventListener("resize",()=>{if(!t.classList.contains("hidden")&&t.classList.contains("is-floating-dragged")){const n=t.getBoundingClientRect();i(n.left,n.top)}})}installDialogLightDismissFallback(){const t=()=>{const s=!!this.root.querySelector("dialog[open]");this.sim.audio?.setModalMuffle?.(s)};for(const s of Array.from(this.root.querySelectorAll("dialog")))s.addEventListener("close",()=>{s.returnValue="",t()});if(typeof MutationObserver<"u"&&new MutationObserver(()=>t()).observe(this.root,{subtree:!0,attributes:!0,attributeFilter:["open"]}),this.root.addEventListener("contentvisibilityautostatechange",s=>{const i=s.target;if(i&&typeof i.matches=="function"&&i.matches(".aaa-codex-scroll")){const a=!!s.skipped;i.dataset.cvSkipped=a?"true":"false"}},{capture:!0}),typeof document<"u"&&!("contentVisibility"in document.documentElement.style)&&typeof IntersectionObserver<"u"){const s=new IntersectionObserver(i=>{for(const a of i)a.target.dataset.cvSkipped=a.isIntersecting?"false":"true"},{rootMargin:"200px"});for(const i of Array.from(this.root.querySelectorAll(".aaa-codex-scroll")))s.observe(i)}if(typeof HTMLDialogElement<"u"&&!("closedBy"in HTMLDialogElement.prototype)){const s=(i,a)=>{const o=a.getBoundingClientRect();return i.clientX<o.left||i.clientX>o.right||i.clientY<o.top||i.clientY>o.bottom};for(const i of Array.from(this.root.querySelectorAll('dialog[closedby="any"]'))){let a=!1;i.addEventListener("pointerdown",o=>{a=s(o,i)}),i.addEventListener("pointerup",o=>{a&&s(o,i)&&i.close()})}}}wireRangeProgressFallback(t){const s=()=>{const i=Number(t.min||0),a=Number(t.max||100),o=Number(t.value||0),r=Math.round((o-i)/Math.max(1,a-i)*100);t.style.setProperty("--progress",`${r}%`)};s(),CSS.supports("accent-color: #b45309")||t.addEventListener("input",s)}togglePhotoMode(t){return va(this,t)}openNeighborDialog(t,s){return On(this,t,s)}openHarvestFeastDialog(){return qa(this)}refreshHarvestFeastBadges(){return Pa(this)}showRibbonUnveilBanner(t){return Ha(this,t)}renderHarvestFeastDialog(){return Bn(this)}openMinigameRescue(t){return Fn(this,t)}enterVisitFromHud(t){return zn(this,t)}enterHonorTourFromHud(t){return Xt(this,t)}enterFlooMemberVisitFromHud(t,s){return Xe(this,t,s)}refreshFlooDirectoryFromHud(t){return kt(this,t)}applyAuthoritativeSnapshot(t){Dn(this,t)}exitVisitFromHud(){return Wt(this)}isBuildingFocusMode(){return kn(this)}toggleHudRollup(t){return ya(this,t)}syncHudFocusVisibility(){return Kt(this)}openWorkshopDialog(t){return Es(this,t)}openSuitcaseDialog(t,s){return Ba(this,t,s)}async getMatch3Modal(){return this.match3Modal?this.match3Modal:(this.match3ModalPromise||(this.match3ModalPromise=vt(async()=>{const{Match3ModalController:t}=await import("./match3Modal-BSOOxFy0.js");return{Match3ModalController:t}},__vite__mapDeps([0,1,2])).then(({Match3ModalController:t})=>(this.match3Modal=new t(this.root,this.sim,()=>this.refreshAll(),(s,i)=>this.showToast(s,i),this.sprites),this.match3Modal.onSwitchToPuzzleArcade=s=>this.openPuzzleArcadeDialog(s),this.match3Modal.onOpenLeaderboard=()=>this.openLeaderboardDialog("match3"),this.match3Modal))),this.match3ModalPromise)}async getPuzzleArcadeModal(){return this.puzzleArcadeModal?this.puzzleArcadeModal:(this.puzzleArcadeModalPromise||(this.puzzleArcadeModalPromise=vt(async()=>{const{PuzzleArcadeModalController:t}=await import("./puzzleArcadeModal-D86AsqMK.js");return{PuzzleArcadeModalController:t}},__vite__mapDeps([3,1,2])).then(({PuzzleArcadeModalController:t})=>(this.puzzleArcadeModal=new t(this.root,this.sim,()=>this.refreshAll(),(s,i)=>this.showToast(s,i),()=>this.openMatch3Dialog(),this.sprites),this.puzzleArcadeModal.onOpenLeaderboard=s=>this.openLeaderboardDialog(s),this.puzzleArcadeModal))),this.puzzleArcadeModalPromise)}openLeaderboardDialog(t,s){this.closeHudPopovers();const i=t??this.sim.getLastPlayedMinigame();this.leaderboardModal.open(i,s)}openMatch3Dialog(t){this.sim.setLastPlayedMinigame("match3"),this.getMatch3Modal().then(s=>s.open(t))}openPuzzleArcadeDialog(t){t&&this.sim.setLastPlayedMinigame(t),this.getPuzzleArcadeModal().then(s=>s.open(t))}openSeedQuizDialog(t,s,i,a,o,r){this.closeHudPopovers(),s||this.sim.setLastPlayedMinigame("seedquiz"),this.seedQuizModal.open(t,s,i,a,o,r)}openLastPlayedMinigame(){this.closeHudPopovers();const t=this.sim.getLastPlayedMinigame();t==="match3"?this.openMatch3Dialog():t==="seedquiz"?this.openSeedQuizDialog():this.openPuzzleArcadeDialog(t)}openTrialMinigame(t){if(this.closeHudPopovers(),!t){this.openLastPlayedMinigame();return}t==="match3"?this.openMatch3Dialog():this.openPuzzleArcadeDialog(t)}closeHudPopovers(){return Ze(this)}collapseBuildDock(){return Je(this)}hasOpenFloatingTray(){return Sa(this)}hideOpenFloatingTrays(){return wa(this)}positionFloatingPopover(t,s){return Cs(this,t,s)}toggleManagePopover(t){return xa(this,t)}toggleWeatherPopover(t){return $a(this,t)}renderWeatherPopover(){return Ms(this)}animateGalleonsTo(t){return Cn(this,t)}spawnFlyReward(t,s,i,a){return Ta(this,t,s,i,a)}bindEvents(){return ha(this)}showToast(t,s="🦉"){return Ue(this,t,s)}showOfflineModal(t){return ka(this,t)}refreshFloatingBanner(){return Ls(this)}openSeedTray(t,s){return Pn(this,t,s)}closeSeedTray(){return ot(this)}toggleSeedTray(){return Ma(this)}openPastureTray(t,s){return Hn(this,t,s)}closePastureTray(){return Tt(this)}togglePastureTray(){return La(this)}renderSeedTray(){return In(this)}renderPastureTray(){return Aa(this)}refreshTouchConfirmBar(){return As(this)}refreshAll(){return Ut(this)}refreshHeaderClock(){return jt(this)}refreshHeader(){return Mn(this)}syncProgressiveHudVisibility(){return Ln(this)}refreshQuestTracker(){return An(this)}refreshDock(){return En(this)}renderStaffDrawer(t){return qn(this,t)}syncContextualMapToolsBar(){return Ca(this)}renderInspector(){return pe(this)}renderFinanceDialog(){return Ia(this)}renderAlbumDialog(){return je(this)}renderQuestDialog(){return Oe(this)}renderRoadmapDialog(){return Nn(this)}updateWorkshopLiveTimers(){return Ea(this)}renderWorkshopDialog(){return Me(this)}renderSettingsDialog(){return Ce(this)}refreshSuitcaseBadge(){return Na(this)}updateSuitcaseLiveTimers(){return Ra(this)}renderSuitcaseDialog(){return ye(this)}syncLiveNeighborSocialUI(){return Ua(this)}refreshNeighborBadges(){return Gn(this)}renderVisitorDockBar(){return ja(this)}renderNeighborDialog(){return xe(this)}panCameraToTutorialTarget(){return zt(this)}resolveTutorialHudTarget(){return Vn(this)}updateTutorialHudSpotlight(){return hs(this)}hideTutorialPopover(t){return _n(this,t)}showTutorialPopover(t){return Un(this,t)}renderTutorialCoach(){return vs(this)}handleTutorialPrimaryAction(t){return jn(this,t)}getEffectiveA11ySettings(){const t=this.sim.state.a11ySettings;return{colorblindMode:t?.colorblindMode??Pt.colorblindMode,fontScale:t?.fontScale??Pt.fontScale,highContrast:t?.highContrast??Pt.highContrast,keyboardFocusVisible:t?.keyboardFocusVisible??!0,volumes:{...Pt.volumes,...t?.volumes??{}}}}applyStoredA11ySettings(){const t=this.getEffectiveA11ySettings();Vi(t),this.sim.audio?.ceiling&&_i(t,this.sim.audio)}playStoryCutscene(t){const s=pn.find(a=>a.id===t);if(!s)return;if(this.sim.state.level<s.unlockLevel&&!this.sim.isHeadmasterPreview){this.showToast(`Cần đạt Cấp ${s.unlockLevel} để mở khoá ${s.titleVi}!`,"🔒");return}this.root.querySelector("#albumDialog")?.close(),this.sim.audio.playSpell(),this.showToast(`🎬 ${s.titleVi}`,"🎬");let i=120;s.keyframes.forEach((a,o)=>{window.setTimeout(()=>{me(this.cam,a.cameraFocusGx,a.cameraFocusGy),this.onCameraJump?.(),this.showToast(`🎬 ${a.captionVi}`,o===s.keyframes.length-1?"✨":"🕯️"),s.chapterNumber===3&&o===s.keyframes.length-1&&this.sim.launchFireworksShow(10)},i),i+=a.durationMs})}}let _e=null,rt=null,en=!1;function tn(){return typeof navigator<"u"&&typeof navigator.install=="function"}function ys(){if(typeof window>"u")return!1;const e=window.matchMedia("(pointer: coarse)").matches,t=window.matchMedia("(max-width: 820px)").matches,s=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||"");return e&&t||s}function Ss(){return typeof window>"u"?!1:window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}function Wn(){const e=document.getElementById("ipsInstallBtn");if(e)return e;const t=document.createElement("button");return t.id="ipsInstallBtn",t.type="button",t.className="ips-install-btn hidden",t.setAttribute("aria-label","Cài đặt game Trang Trại Hang Sóc"),t.innerHTML='<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>',t.addEventListener("click",async()=>{if(t.getAttribute("aria-disabled")==="true")return;const i=navigator,a=typeof i.install=="function";if(!a&&!_e){t.classList.add("hidden");return}t.setAttribute("aria-disabled","true");try{if(a&&i.install)await i.install(),t.classList.add("hidden");else if(_e){const o=_e;_e=null,await o.prompt(),((await o.userChoice).outcome==="accepted"||!_e)&&t.classList.add("hidden")}}catch(o){!(o instanceof DOMException&&o.name==="AbortError")&&!_e&&t.classList.add("hidden")}finally{t.removeAttribute("aria-disabled")}}),(document.getElementById("app")??document.body).appendChild(t),t}function ws(){!ys()||Ss()||(rt||(rt=Wn()),rt.classList.remove("hidden"))}function Qn(){rt&&rt.classList.add("hidden")}function Qa(){en||typeof window>"u"||(en=!0,!Ss()&&(rt=Wn(),tn()&&ys()&&ws(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),_e=e,!tn()&&ys()&&!Ss()&&ws()}),window.addEventListener("appinstalled",()=>{Qn(),_e=null})))}const Ka={init:Qa,show:ws,hide:Qn},Xa="burrow_rollback_backup_v12";function sn(e,t){const s=JSON.stringify({backedUpAt:Date.now(),state:e}),i=typeof localStorage<"u"?localStorage:void 0;try{i?.setItem(Xa,s)}catch{}return s}class Ya{constructor(){w(this,"unhandledErrors",0);w(this,"fpsSamples",[]);w(this,"assetLoadLatencyMs",0);w(this,"offlineQueue",[])}recordFrameFps(t){if(!Number.isFinite(t)||t<=0)return;const s=Math.max(1,Math.min(240,t));this.fpsSamples.push(s),this.fpsSamples.length>120&&this.fpsSamples.shift()}recordAssetLoadLatency(t){!Number.isFinite(t)||t<0||(this.assetLoadLatencyMs=Math.round(t))}recordUnhandledError(){this.unhandledErrors++}enqueueOfflineEvent(t,s={},i=Date.now()){this.offlineQueue.length>=100&&this.offlineQueue.shift(),this.offlineQueue.push({event:t,props:s,queuedAt:i})}flushOfflineQueue(t){if(this.offlineQueue.length===0)return 0;const s=[...this.offlineQueue];return t(s)?(this.offlineQueue=[],s.length):0}getHealthReport(){const t=this.fpsSamples.length;let s=60,i=60;if(t>0){const a=this.fpsSamples.reduce((l,n)=>l+n,0);s=Number((a/t).toFixed(1));const o=[...this.fpsSamples].sort((l,n)=>l-n),r=Math.max(0,Math.floor((t-1)*.05));i=Number(o[r].toFixed(1))}return{sessionCrashFree:this.unhandledErrors===0,unhandledErrorCount:this.unhandledErrors,avgFps:s,p5LowFps:i,assetLoadLatencyMs:this.assetLoadLatencyMs,pendingOfflineEvents:this.offlineQueue.length}}}function xs(e){return e.category==="path"||e.category==="terrain"||!!e.isCoasterTrackPiece||!!e.isZooFence||!!e.isFarmlandPlot||!!e.connectableGroup}function nn(e){return xs(e)||e.category==="decor"}async function Za(){const e=document.getElementById("app"),t=document.getElementById("hangsoc-file-open-help");t&&t.remove();const s=document.createElement("canvas");s.id="gameCanvas",s.setAttribute("aria-label","Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade"),e.appendChild(s);const i=new Ri,a=new zi;await a.loadAll();const o=new Di(i),r={x:0,y:0,zoom:.82,viewRot:0};me(r,18,24.5);const l=new Gi(s,a),n=new Wa(e,o,r,s,a);Ka.init(),cs.init(o);const c=new URLSearchParams(window.location.search),d=!!(c.get("preview")==="100"||c.get("visit")||c.get("tour")||c.get("zoom")||c.get("cx")||c.get("cy")||c.get("ridecam")==="1");let p=null;if(n.onCameraJump=()=>{p=null},!d&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){const b=r.x,h=r.y,q=r.zoom;me(r,17.5,24),r.zoom=.76,p={startMs:performance.now(),durationMs:1450,fromX:r.x,fromY:r.y,fromZoom:r.zoom,toX:b,toY:h,toZoom:q}}const u=Ie(window.location.hostname);if(c.get("preview")==="100"&&u){o.toggleHeadmasterPreview(100),!c.get("tutorial")&&o.isTutorialActive()&&o.skipTutorial();const b=Number(c.get("zoom")||.62);r.zoom=Number.isFinite(b)&&b>=.32&&b<=2.15?b:.62;const h=Number(c.get("cx")),q=Number(c.get("cy")),z=Number.isFinite(h)&&c.get("cx")?h:24.5,j=Number.isFinite(q)&&c.get("cy")?q:23;me(r,z,j)}const v=c.get("tutorial");v==="1"||v==="reset"?o.restartTutorial():(v==="0"||v==="off")&&o.isTutorialActive()&&o.skipTutorial();const g=c.get("tstep");if(g!==null&&u){const b=Math.max(0,Math.min(Vt.length-1,Number(g)||0)),h=o.ensureTutorialState();h.active=!0,delete h.completedAt,h.skipped=!1,h.stepIndex=b,h.stepId=Vt[b].id,h.pastureHarvestedInStep3=!1}const f=Number(c.get("rot")||0);if(f>=1&&f<=3)for(let b=0;b<f;b++)bt(r,1);c.get("cutaway")==="1"&&(o.state.settings.cutawayMode=!0);const S=c.get("time");(S==="night"||S==="day"||S==="dusk"||S==="dawn")&&(o.state.settings.timeOverride=S);const $=c.get("weather");if(($==="auto"||$==="clear"||$==="cloudy"||$==="rain"||$==="storm"||$==="snow"||$==="fog"||$==="fireflies")&&(o.state.settings.weatherOverride=$),c.get("zoom")&&c.get("preview")!=="100"){const b=Number(c.get("zoom"));Number.isFinite(b)&&b>=.32&&b<=2.15&&(r.zoom=b)}if((c.get("cx")||c.get("cy"))&&c.get("preview")!=="100"){const b=Number(c.get("cx")),h=Number(c.get("cy")),q=Number.isFinite(b)&&c.get("cx")?b:18,z=Number.isFinite(h)&&c.get("cy")?h:24.5;me(r,q,z)}const x=c.get("heatmap");if(x&&(o.heatmapMode=x),c.get("fireworks")==="1"&&o.launchFireworksShow(12),c.get("ridecam")==="1"){const b=o.state.buildings.find(h=>se(h.itemId)?.isCustomCoasterStation);b&&(n.rideCamUid=b.uid)}const m=c.get("dialog");if(m==="album")document.getElementById("btnOpenAlbum")?.click();else if(m==="finance")document.getElementById("btnOpenFinance")?.click();else if(m==="orders"||m==="quests")document.getElementById("btnOpenQuests")?.click();else if(m==="barn")n.openWorkshopDialog("barn");else if(m==="seeds"){const b=c.get("sfilter");(b==="flowers"||b==="crops"||b==="all")&&(n.seedFilterMode=b),n.openSeedTray()}else if(m==="pasture")n.openPastureTray();else if(m==="seedquiz"){const b=c.get("crop")??void 0,h=c.get("lang")??void 0,q=c.get("tier")??void 0,z=c.get("qformat")??void 0,j=c.get("sqtab"),de=j==="codex"||j==="practice"?j:void 0;n.openSeedQuizDialog(b,null,h,q,z,de)}else if(m==="bakery"){const b=o.state.buildings.find(h=>h.itemId==="molly_apple_bakery");b&&(n.inspectSelection={kind:"building",uid:b.uid})}else if(m==="workshop"){const b=c.get("tab")??"barn";n.openWorkshopDialog(b)}else if(m==="suitcase"){const b=c.get("tab")??"care";n.openSuitcaseDialog(b)}else if(m==="match3"){const b=Number(c.get("m3level")||0),h=u?777:Math.min(777,(o.state.match3.maxClearedLevel??0)+1),q=Number.isFinite(b)&&b>=1?Math.min(h,Math.floor(b)):void 0;u&&q&&q>(o.state.match3.maxClearedLevel??0)+1&&(o.state.sandboxMode=!0),n.openMatch3Dialog(q)}else if(m==="puzzle"||m==="caro"||m==="sudoku"||m==="chess"||m==="blocks"||m==="pikachu"||m==="onet"){const b=m==="puzzle"?c.get("pmode"):m,h=b==="pikachu"||b==="onet"?"blocks":b,q=h==="caro"||h==="sudoku"||h==="chess"||h==="blocks"?h:void 0;n.openPuzzleArcadeDialog(q)}else if(m==="neighbors"||m==="friends")n.openNeighborDialog();else if(m==="feast")n.openHarvestFeastDialog();else if(m==="leaderboard"){const b=c.get("lbgame"),h=b==="match3"||b==="caro"||b==="sudoku"||b==="chess"||b==="blocks"||b==="seedquiz"?b:void 0,q=c.get("lbscope"),z=q==="valley"||q==="friends"||q==="personal"?q:void 0;n.openLeaderboardDialog(h,z)}else if(!c.get("tour")&&!c.get("visit")&&!o.isHeadmasterPreview)try{const b=localStorage.getItem(as);if(b){const h=JSON.parse(b),q=Date.now()-Number(h.savedAt||0),z=o.state.puzzleArcade;q>=0&&q<=12*3600*1e3?h.dialog==="puzzleArcade"&&h.mode==="sudoku"&&z.sudokuSession?.stage===z.sudokuStage?n.openPuzzleArcadeDialog("sudoku"):h.dialog==="puzzleArcade"&&h.mode==="caro"&&z.caroSession?.stage===z.caroStage?n.openPuzzleArcadeDialog("caro"):h.dialog==="puzzleArcade"&&h.mode==="chess"&&z.chessSession?.stage===z.chessStage?n.openPuzzleArcadeDialog("chess"):h.dialog==="puzzleArcade"&&h.mode==="blocks"&&z.onetSession?.stage===z.blockStage?n.openPuzzleArcadeDialog("blocks"):h.dialog==="match3"&&o.state.match3.activeSession?.levelId===o.state.match3.currentLevel?n.openMatch3Dialog():localStorage.removeItem(as):localStorage.removeItem(as)}}catch{}const E={hagrid_valley:"tour_hagrid",luna_valley:"tour_luna",neville_valley:"tour_sprout",hermione_valley:"tour_molly",twins_valley:"tour_twins"},T=b=>{const h=String(b||"").trim();if(!h){n.exitVisitFromHud();return}const q=E[h]||(h.startsWith("tour_")?h:"");q?n.enterHonorTourFromHud(q):h.startsWith("player_")||o.ensureNeighborSocial().neighbors.some(z=>z.id===h)?n.enterVisitFromHud(h):n.enterFlooMemberVisitFromHud(h)},A=c.get("tour")||c.get("visit");A&&T(A),o.isTutorialActive()&&!d&&n.panCameraToTutorialTarget(),Ae.bindSimulationGringottsWallet(o,{onSnapshot:b=>n.applyAuthoritativeSnapshot(b),onToast:(b,h)=>n.showToast(b,h??"🏦")}),Ae.authoritativeClient.snapshot&&n.applyAuthoritativeSnapshot(Ae.authoritativeClient.snapshot),n.refreshAll(),window.addEventListener("hpvn:authoritative-snapshot",b=>{n.applyAuthoritativeSnapshot(b.detail)}),window.addEventListener("hpvn:toast",b=>{const h=b.detail;h?.text&&n.showToast(String(h.text),"🔥")}),window.addEventListener("hpvn:tour-garden",b=>{const h=b.detail;T(String(h?.tourId??""))}),window.addEventListener("gamesave:updated",b=>{if(o.isHeadmasterPreview||o.isVisitingNeighbor)return;const h=b.detail,q=typeof h?.saveJson=="string"&&h.saveJson||(typeof localStorage<"u"?localStorage.getItem(un):null);q&&(sn(o.state),o.importSaveJson(q)&&(Ae.authoritativeClient.snapshot&&n.applyAuthoritativeSnapshot(Ae.authoritativeClient.snapshot),n.match3Modal?.resetSession(),n.puzzleArcadeModal?.resetSession(),n.refreshAll(),cs.refresh(),n.showToast("☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!","☁️")))}),window.addEventListener("hpvn:atmosphere",b=>{if(o.isVisitingNeighbor)return;const h=b.detail?.mode,q=h==="auto"?"realtime":h;(q==="realtime"||q==="dawn"||q==="day"||q==="dusk"||q==="night")&&(o.state.settings.timeOverride=q,o.saveToStorage(),n.refreshAll())}),window.addEventListener("hpvn:weather",b=>{if(o.isVisitingNeighbor)return;const h=b.detail?.mode;(h==="auto"||h==="clear"||h==="cloudy"||h==="rain"||h==="storm"||h==="snow"||h==="fog"||h==="fireflies")&&(o.state.settings.weatherOverride=h,o.saveToStorage(),n.refreshAll())}),o.onTutorialStepChanged=()=>{n.panCameraToTutorialTarget()},o.onUiChange=()=>{n.refreshAll(),cs.refresh()},o.onToast=(b,h)=>{n.showToast(b,h),b.includes("Đạt Cấp")||b.includes("lên cấp")||b.includes("Lên Cấp")?It("levelup"):It("light"),bn(b)},o.onBuildingTactile=b=>l.triggerSquash(b),o.onBuildingCompleted=b=>{l.triggerCompletionPop(b),l.triggerSquash(b)},o.onRibbonUnveiled=b=>{const h=Ws(b.gx,b.gy,r,s.clientWidth,s.clientHeight,36);l.triggerRibbonUnveilPop(b.uid,h.sx,h.sy),n.showRibbonUnveilBanner(b),It("levelup")},o.onRewardFly=(b,h,q,z)=>{if(typeof q=="number"&&typeof z=="number"){const j=Ws(q,z,r,s.clientWidth,s.clientHeight,32);n.spawnFlyReward(b,h,j.sx,j.sy)}else n.spawnFlyReward(b,h)},o.onLevelUp=b=>{It("levelup");const h=pi(b),q=h.unlockedItemIds.map(j=>se(j)?.name).filter(Boolean).slice(0,2).join(", "),z=q?` — Mở bản vẽ mới: ${q}!`:h.milestoneNote?` — ${h.milestoneNote}`:"";n.showToast(`🎉 Đạt Cấp Giải Đố ${b}! (+${h.rewardGalleons}🪙)${z}`,"🌟"),n.refreshAll()};const k=o.processOfflineProgress();k&&n.showOfflineModal(k);const C=b=>{const h=o.getActiveVisitingNeighbor();if(!h?.remoteUserId)return;const q=h.helpedMarksToday[h.helpedMarksToday.length-1];window.dispatchEvent(new CustomEvent("hpvn:visit-help",{detail:{hostUid:h.remoteUserId,buildingUid:b,kind:q?.kind||"water_crop",noteText:q?.noteText||"Chúc vườn phép thuật bội thu!",helperName:o.state.parkName||"Hàng Xóm Hang Sóc",helperEmoji:"🧙‍♂️"}}))};let M=null,D=!1,F=!1,L=!1,N=!1,O=!1,ne=0,P=0,V=0,W=0,B=0,_=0;const re=(b,h,q,z)=>{const j=n.activeSeedCropId;if(!j)return!1;let de=o.grid[h]?.[b]?.buildingUid??null;if(!de)for(let R=l.hotspots.length-1;R>=0;R--){const Y=l.hotspots[R];if(Y.kind==="building"&&Math.hypot(q-Y.sx,z-Y.sy)<=Y.radius){de=Y.id;break}}if(!de)return!1;const G=o.state.buildings.find(R=>R.uid===de);if(!G||G.cropId||Date.now()<G.constructEndsAt||!se(G.itemId)?.isFarmlandPlot)return!1;const be=o.plantCropOnPlot(G.uid,j);if(!be.ok){if(be.needSeedAcquire)return N=!1,D=!1,n.seedTrayOpen=!1,n.inspectSelection=null,n.refreshAll(),n.openSeedQuizDialog(j,G.uid),!1;const R=Date.now();return R-ne>1200&&(ne=R,n.showToast(be.msg,"🪙")),!1}return n.seedTrayOpen&&(n.seedTrayOpen=!1,n.renderSeedTray(),n.refreshFloatingBanner()),!0},ie=(b,h,q,z)=>{const j=n.activePastureAnimalId;if(!j)return!1;let de=o.grid[h]?.[b]?.buildingUid??null;if(!de)for(let R=l.hotspots.length-1;R>=0;R--){const Y=l.hotspots[R];if(Y.kind==="building"&&Math.hypot(q-Y.sx,z-Y.sy)<=Y.radius){de=Y.id;break}}if(!de)return!1;const G=o.state.buildings.find(R=>R.uid===de);if(!G||G.pastureAnimalId||Date.now()<G.constructEndsAt||!se(G.itemId)?.isAnimalPasturePlot)return!1;const be=o.stockAnimalOnPasture(G.uid,j);if(!be.ok){const R=Date.now();return R-P>1200&&(P=R,n.showToast(be.msg,"🪙")),!1}return n.pastureTrayOpen&&(n.pastureTrayOpen=!1,n.renderPastureTray(),n.refreshFloatingBanner()),!0},X=new Map;let ce=0,fe=!1,le=null;const ue=()=>{le&&(window.clearTimeout(le.timer),le=null)};n.onTouchConfirmPlace=()=>{if(!n.pendingTouchTile)return;const{gx:b,gy:h}=n.pendingTouchTile;if(n.moveModeActive&&n.movingBuildingUid){const q=o.moveBuilding(n.movingBuildingUid,b,h,n.rotation);if(!q.ok){n.showToast(q.reason??"Không thể đặt tại ô này!","⚠️");return}n.movingBuildingUid=null,n.moveModeActive=!1,n.pendingTouchTile=null,n.refreshAll();return}if(n.selectedCatalogItem){const q=n.selectedCatalogItem,z=o.canPlaceItem(q,b,h,n.rotation);if(!z.ok){n.showToast(z.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(q,b,h,n.rotation),n.pendingTouchTile=null,nn(q)||(n.selectedCatalogItem=null),n.refreshAll()}},n.onTouchCancelPlace=()=>{M=null};const J=new Set;window.addEventListener("keydown",b=>{if(document.querySelector("dialog[open]")){J.clear();return}b.target instanceof HTMLInputElement||b.target instanceof HTMLTextAreaElement||b.target instanceof HTMLSelectElement||b.target instanceof HTMLElement&&b.target.classList.contains("drag-handle")||J.add(b.key.toLowerCase())}),window.addEventListener("keyup",b=>{J.delete(b.key.toLowerCase())}),window.addEventListener("blur",()=>{J.clear()}),document.addEventListener("visibilitychange",()=>{document.hidden&&J.clear()}),s.addEventListener("pointermove",b=>{X.has(b.pointerId)&&X.set(b.pointerId,{x:b.clientX,y:b.clientY});const h=s.getBoundingClientRect();if(X.size>=2){ue(),L=!1,fe=!0;const te=Array.from(X.values()),be=Math.hypot(te[1].x-te[0].x,te[1].y-te[0].y),R=(te[0].x+te[1].x)*.5-h.left,Y=(te[0].y+te[1].y)*.5-h.top;if(ce>8&&be>8){const oe=(R-h.width*.5)/r.zoom+r.x,I=(Y-h.height*.5)/r.zoom+r.y,ee=be/ce;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*ee)),r.x=oe-(R-h.width*.5)/r.zoom,r.y=I-(Y-h.height*.5)/r.zoom}ce=be;return}const q=b.clientX-h.left,z=b.clientY-h.top;if(!o.isVisitingNeighbor&&!F&&!n.movingBuildingUid&&!n.pincerActive)for(const te of l.hotspots)te.kind==="bubble"&&Math.hypot(q-te.sx,z-te.sy)<=te.radius&&o.harvestBuildingBubble(te.id);const j=os(q,z,r,h.width,h.height,o.grid);if(n.pendingTouchTile||(M={gx:j.gx,gy:j.gy}),!D)return;if(le&&X.size===1&&Math.hypot(b.clientX-V,b.clientY-W)>8){const te=le;ue(),L=!0,o.placeItem(te.item,te.gx,te.gy,te.rot)}if(L&&n.selectedCatalogItem){o.placeItem(n.selectedCatalogItem,j.gx,j.gy,n.rotation);return}if(N&&n.activeSeedCropId){re(j.gx,j.gy,q,z);return}if(O&&n.activePastureAnimalId){ie(j.gx,j.gy,q,z);return}const de=b.clientX-V,G=b.clientY-W;Math.hypot(de,G)>5&&(F=!0,n.rideCamUid=null),F&&(p=null,r.x=B-de/r.zoom,r.y=_-G/r.zoom)}),s.addEventListener("pointerdown",b=>{if(X.set(b.pointerId,{x:b.clientX,y:b.clientY}),X.size>=2){ue();const G=Array.from(X.values());ce=Math.hypot(G[1].x-G[0].x,G[1].y-G[0].y),fe=!0,L=!1;return}if(b.button!==0&&b.button!==2)return;const h=s.getBoundingClientRect(),q=b.clientX-h.left,z=b.clientY-h.top,j=os(q,z,r,h.width,h.height,o.grid);n.pendingTouchTile||(M={gx:j.gx,gy:j.gy}),D=!0,F=!1,V=b.clientX,W=b.clientY,B=r.x,_=r.y;const de=n.selectedCatalogItem;if(b.button===0&&de&&xs(de)&&!n.hasOpenFloatingTray()){if(b.pointerType==="touch"){ue(),L=!1;const G=n.rotation;le={item:de,gx:j.gx,gy:j.gy,rot:G,timer:window.setTimeout(()=>{le=null,X.size===1&&!fe&&D&&(L=!0,o.placeItem(de,j.gx,j.gy,G))},75)}}else L=!0,o.placeItem(de,j.gx,j.gy,n.rotation);N=!1,O=!1}else b.button===0&&n.activeSeedCropId&&!n.selectedCatalogItem&&!n.moveModeActive&&!n.bulldozerActive&&!n.pincerActive&&re(j.gx,j.gy,q,z)?(L=!1,N=!0,O=!1):b.button===0&&n.activePastureAnimalId&&!n.selectedCatalogItem&&!n.moveModeActive&&!n.bulldozerActive&&!n.pincerActive&&ie(j.gx,j.gy,q,z)?(L=!1,N=!1,O=!0):(L=!1,N=!1,O=!1)});const Te=b=>{X.delete(b),X.size<2&&(ce=0)};window.addEventListener("pointercancel",b=>{ue(),Te(b.pointerId),D=!1,F=!1,L=!1,N=!1,O=!1,fe=!1}),window.addEventListener("pointerup",b=>{if(Te(b.pointerId),fe){ue(),X.size===0&&(fe=!1,D=!1,F=!1,N=!1,O=!1);return}if(!D)return;let h=!1;if(le&&!F&&b.target===s){const oe=le;ue(),o.placeItem(oe.item,oe.gx,oe.gy,oe.rot),h=!0}else ue();const q=F,z=L||h||N||O;if(D=!1,F=!1,L=!1,N=!1,O=!1,q||z)return;if(b.button===2){n.selectedCatalogItem=null,n.bulldozerActive=!1,n.moveModeActive=!1,n.movingBuildingUid=null,n.pincerActive=!1,n.pincerPicked=null,n.closeSeedTray(),n.closePastureTray(),n.collapseBuildDock(),n.closeHudPopovers(),n.pendingTouchTile=null,n.inspectSelection=null,n.refreshAll();return}if(b.target!==s)return;const j=n.pendingSowPlotUid,de=n.pendingStockPastureUid;if(n.closeHudPopovers(),n.hasOpenFloatingTray()&&(n.hideOpenFloatingTrays(),n.selectedCatalogItem||n.moveModeActive||n.bulldozerActive||n.pincerActive)){n.refreshAll();return}const G=s.getBoundingClientRect(),te=b.clientX-G.left,be=b.clientY-G.top,R=os(te,be,r,G.width,G.height,o.grid),Y=b.pointerType==="touch";if(n.pincerActive){const oe=n.pincerPicked??(o.staff[0]?{kind:"staff",id:o.staff[0].id,label:o.staff[0].name}:null);oe&&o.dropPickedEntity(oe.kind,oe.id,R.gx,R.gy),n.pincerPicked=null,n.pincerActive=!1,n.refreshAll();return}if(n.bulldozerActive){o.removeAtTile(R.gx,R.gy);return}if(n.moveModeActive){if(n.movingBuildingUid){if(Y&&(!n.pendingTouchTile||n.pendingTouchTile.gx!==R.gx||n.pendingTouchTile.gy!==R.gy)){const H=o.state.buildings.find(qe=>qe.uid===n.movingBuildingUid),Z=H?se(H.itemId):void 0;M={gx:R.gx,gy:R.gy},n.pendingTouchTile={gx:R.gx,gy:R.gy,label:Z?.name??"Dời công trình"},n.refreshTouchConfirmBar();return}const ee=o.moveBuilding(n.movingBuildingUid,R.gx,R.gy,n.rotation);if(!ee.ok){n.showToast(ee.reason??"Không thể đặt tại ô này!","⚠️");return}n.movingBuildingUid=null,n.moveModeActive=!1,n.pendingTouchTile=null,n.refreshAll();return}let I=o.grid[R.gy]?.[R.gx]?.buildingUid??null;if(!I){for(const ee of l.hotspots)if(ee.kind==="building"&&Math.hypot(te-ee.sx,be-ee.sy)<=ee.radius){I=ee.id;break}}if(I){const ee=o.state.buildings.find(H=>H.uid===I);if(ee?.isIndestructible){n.showToast("Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!","🏠");return}if(ee){n.movingBuildingUid=ee.uid,n.rotation=ee.rotation,n.refreshFloatingBanner();const H=se(ee.itemId);n.showToast(`Đã nhấc "${H?.name??"công trình"}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`,"✋");return}}}if(n.selectedCatalogItem){const oe=n.selectedCatalogItem;if(Y&&!xs(oe)&&(!n.pendingTouchTile||n.pendingTouchTile.gx!==R.gx||n.pendingTouchTile.gy!==R.gy)){M={gx:R.gx,gy:R.gy},n.pendingTouchTile={gx:R.gx,gy:R.gy,label:oe.name},n.refreshTouchConfirmBar();return}const I=o.canPlaceItem(oe,R.gx,R.gy,n.rotation);if(!I.ok){n.showToast(I.reason??"Không thể đặt tại ô này!","⚠️");return}o.placeItem(oe,R.gx,R.gy,n.rotation),n.pendingTouchTile=null,nn(oe)||(n.selectedCatalogItem=null),n.refreshAll();return}for(const oe of["owl_post","visitor_gift","neighbor_help","home_lantern","unveil_building","bubble","water_crop","feed_pasture","escaped","zone_plaque","villager","building"]){let I=null,ee=1/0;for(let H=l.hotspots.length-1;H>=0;H--){const Z=l.hotspots[H];if(Z.kind!==oe)continue;const qe=Math.hypot(te-Z.sx,be-Z.sy);if(Z.spriteKey&&typeof Z.boxLeft=="number"&&typeof Z.boxTop=="number"&&typeof Z.boxW=="number"&&typeof Z.boxH=="number"&&Z.boxW>2&&Z.boxH>2){const Zt=te>=Z.boxLeft&&te<=Z.boxLeft+Z.boxW&&be>=Z.boxTop&&be<=Z.boxTop+Z.boxH,Mt=(te-Z.boxLeft)/Z.boxW,Ge=(be-Z.boxTop)/Z.boxH,he=Zt&&a.hitTestAlpha(Z.spriteKey,Mt,Ge,!!Z.flipX),et=Z.kind==="building"&&qe<=Z.radius*.5;if(!he&&!et)continue;if((I===null||qe<ee*.82)&&(I=Z,ee=qe,he))break}else qe<=Z.radius&&qe<ee&&(ee=qe,I=Z)}if(I){if(I.kind==="owl_post"){const H=l.collectOwlPostParcel();H&&o.claimOwlPostDelivery(H.gx,H.gy),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="visitor_gift"){const H=o.claimVisitedNeighborMysteryGift();H.ok?l.notifyJuice("harvest",I.sx,I.sy):n.showToast(H.msg,"🎁"),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="neighbor_help"){l.triggerSquash(I.id);const H=o.helpVisitedNeighborBuilding(I.id);H.ok?(l.notifyJuice("harvest",I.sx,I.sy),C(I.id)):n.showToast(H.msg,"💧"),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="home_lantern"){const H=o.ensureNeighborSocial().homeLanternMarks.find(qe=>qe.id===I.id);H&&l.triggerSquash(H.buildingUid);const Z=o.claimHomeLanternMark(I.id);Z.ok?l.notifyJuice("harvest",I.sx,I.sy):n.showToast(Z.msg,"🏮"),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="unveil_building"){o.unveilBuilding(I.id),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="bubble"){o.harvestBuildingBubble(I.id),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="water_crop"){l.triggerSquash(I.id);const H=o.waterCropPlot(I.id);H.ok?l.notifyJuice("harvest",I.sx,I.sy):n.showToast(H.msg,"💧"),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="feed_pasture"){l.triggerSquash(I.id);const H=o.feedAnimalPasture(I.id);H.ok?l.notifyJuice("harvest",I.sx,I.sy):n.showToast(H.msg,"🌾"),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="escaped"){o.catchEscapedCreature(I.id),n.inspectSelection=null,n.refreshAll();return}if(I.kind==="zone_plaque"){n.closeSeedTray(),n.inspectSelection={kind:"zone",zoneId:I.id},n.refreshAll();return}if(I.kind==="villager"){o.greetVillager(I.id),n.refreshAll();return}if(I.kind==="building"){const H=o.state.buildings.find(Z=>Z.uid===I.id);if(H){if(!o.isVisitingNeighbor&&H.awaitingUnveil){o.unveilBuilding(H.uid),n.inspectSelection=null,n.refreshAll();return}const Z=se(H.itemId),qe=!!(!o.isVisitingNeighbor&&Z?.isFarmlandPlot&&H.cropId&&H.cropReadyAt&&Date.now()>=H.cropReadyAt),Zt=!!(!o.isVisitingNeighbor&&Z?.isAnimalPasturePlot&&H.pastureAnimalId&&H.pastureReadyAt&&Date.now()>=H.pastureReadyAt);if(!qe&&!Zt&&l.triggerSquash(I.id),o.isVisitingNeighbor){const he=o.getVisitedBuildingHelpStatus(H);if(he.canHelp){const et=o.helpVisitedNeighborBuilding(H.uid);et.ok?(l.notifyJuice("harvest",I.sx,I.sy),C(H.uid)):n.showToast(et.msg,"💧")}else if(he.existingMark)n.showToast(`🏮 Đã treo đèn lồng chúc phúc: “${he.existingMark.noteText}”`,"🏮");else{const et=se(H.itemId),Bs=o.getActiveVisitingNeighbor();n.showToast(`🏡 Đang ngắm "${et?.name??"Công trình"}" (${H.stars}★) tại vườn ${Bs?.name??"bạn bè"}!`,Bs?.avatarEmoji??"🏡")}n.inspectSelection=null,n.refreshAll();return}const Mt=o.ensureNeighborSocial().homeLanternMarks.find(he=>he.buildingUid===H.uid);if(Mt&&o.claimHomeLanternMark(Mt.id).ok){l.notifyJuice("harvest",I.sx,I.sy),n.inspectSelection=null,n.refreshAll();return}if(H.itemId==="burrow_honeydukes_canon"){n.closeSeedTray(),n.inspectSelection=null,n.refreshAll(),n.openMatch3Dialog();return}const Ge=se(H.itemId);if(Ge?.isFarmlandPlot&&H.cropId&&H.cropReadyAt&&Date.now()>=H.cropReadyAt){o.harvestCropPlot(H.uid),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isFarmlandPlot&&H.cropId&&H.cropReadyAt&&Date.now()<H.cropReadyAt&&!H.cropWateredBoost){o.waterCropPlot(H.uid).ok&&l.notifyJuice("harvest",I.sx,I.sy),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isFarmlandPlot&&!H.cropId&&Date.now()>=H.constructEndsAt){if(n.activeSeedCropId){const he=o.plantCropOnPlot(H.uid,n.activeSeedCropId);if(he.needSeedAcquire){n.inspectSelection=null,n.refreshAll(),n.openSeedQuizDialog(n.activeSeedCropId,H.uid);return}n.showToast(he.msg,he.ok?"🌱":"🪙"),n.inspectSelection=null,n.refreshAll()}else j===H.uid?(n.inspectSelection=null,n.refreshAll()):n.openSeedTray(void 0,H.uid);return}else if(Ge?.isAnimalPasturePlot&&H.pastureAnimalId&&H.pastureReadyAt&&Date.now()>=H.pastureReadyAt){o.harvestAnimalPasture(H.uid),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isAnimalPasturePlot&&H.pastureAnimalId&&H.pastureReadyAt&&Date.now()<H.pastureReadyAt&&!H.pastureFedBoost){o.feedAnimalPasture(H.uid).ok&&l.notifyJuice("harvest",I.sx,I.sy),n.inspectSelection=null,n.refreshAll();return}else if(Ge?.isAnimalPasturePlot&&!H.pastureAnimalId&&Date.now()>=H.constructEndsAt){if(n.activePastureAnimalId){const he=o.stockAnimalOnPasture(H.uid,n.activePastureAnimalId);n.showToast(he.msg,he.ok?"🐾":"🪙"),n.inspectSelection=null,n.refreshAll()}else de===H.uid?(n.inspectSelection=null,n.refreshAll()):n.openPastureTray(void 0,H.uid);return}else(H.storedGalleons>0||H.readyFarmGoods&&H.readyFarmGoods.length>0)&&o.harvestBuildingBubble(H.uid)}n.closeSeedTray(),n.closePastureTray(),n.inspectSelection={kind:"building",uid:I.id},n.refreshAll();return}}}n.inspectSelection=null,n.refreshAll()}),s.addEventListener("contextmenu",b=>b.preventDefault()),s.addEventListener("wheel",b=>{b.preventDefault(),p=null;const h=s.getBoundingClientRect(),q=b.clientX-h.left,z=b.clientY-h.top,j=(q-h.width*.5)/r.zoom+r.x,de=(z-h.height*.5)/r.zoom+r.y,G=b.deltaY<0?1.1:.91;r.zoom=Math.max(.32,Math.min(2.15,r.zoom*G)),r.x=j-(q-h.width*.5)/r.zoom,r.y=de-(z-h.height*.5)/r.zoom},{passive:!1});let ze=performance.now(),ae=0;const Se=new Wi,U=new Ya;sn(o.state);const ge=document.createElement("div");ge.id="gamepadRadialMenu",ge.className="aaa-gamepad-radial",ge.hidden=!0,ge.innerHTML=`
    <div class="aaa-gamepad-wheel">
      ${gn.map(b=>{const h=b.index*Math.PI*2/8,q=50+Math.cos(h)*37,z=50+Math.sin(h)*37;return`<div class="aaa-gamepad-slice" data-radial-idx="${b.index}" style="left:${q.toFixed(1)}%;top:${z.toFixed(1)}%;">${b.icon}<br/>${b.labelVi}</div>`}).join("")}
    </div>
  `,e.appendChild(ge);let we=null,He=!1;const dt=b=>{switch(b){case"seeds":n.openSeedTray();break;case"barn":n.openWorkshopDialog("barn");break;case"orders":{n.activeQuestTab="orders",n.renderQuestDialog(),n.root.querySelector("#questDialog")?.showModal();break}case"match3":n.openMatch3Dialog();break;case"arcade":n.openPuzzleArcadeDialog();break;case"seedquiz":n.openSeedQuizDialog();break;case"neighbors":n.openNeighborDialog("friends");break;case"feast":n.openHarvestFeastDialog();break}};function Yt(b){if(document.hidden){ze=b,requestAnimationFrame(Yt);return}const h=(b-ze)/1e3;if(ze=b,h>.002&&h<.5&&(U.recordFrameFps(1/h),ae%90===0&&ae>0)){const R=U.getHealthReport();l.adaptiveDprCap=R.p5LowFps<46?1.25:R.p5LowFps<54?1.5:2}const q=Se.poll();if(q.connected){if(q.panDx!==0||q.panDy!==0){p=null,n.rideCamUid=null;const R=380/r.zoom*Math.min(.05,h);r.x+=q.panDx*R,r.y+=q.panDy*R}if(q.radialOpen?(ge.hidden=!1,He=!0,q.radialActionId&&(we=q.radialActionId),ge.querySelectorAll("[data-radial-idx]").forEach(R=>{R.dataset.selected=String(Number(R.dataset.radialIdx)===q.radialSliceIndex)}),q.confirmJustPressed&&we&&(ge.hidden=!0,He=!1,dt(we),we=null)):He&&(ge.hidden=!0,He=!1,we&&(dt(we),we=null)),q.cancelJustPressed){const R=Array.from(n.root.querySelectorAll("dialog[open]"));R.length>0?R[R.length-1]?.close():n.hasOpenFloatingTray()&&n.hideOpenFloatingTrays()}}if((J.has("w")||J.has("arrowup")||J.has("s")||J.has("arrowdown")||J.has("a")||J.has("arrowleft")||J.has("d")||J.has("arrowright"))&&(p=null),p){const R=Math.min(1,Math.max(0,(b-p.startMs)/p.durationMs)),Y=1-Math.pow(1-R,3);r.x=p.fromX+(p.toX-p.fromX)*Y,r.y=p.fromY+(p.toY-p.fromY)*Y,r.zoom=p.fromZoom+(p.toZoom-p.fromZoom)*Y,R>=1&&(p=null)}const z=340/r.zoom*Math.min(.05,h);if(J.size>0&&document.querySelector("dialog[open]")&&J.clear(),(J.has("w")||J.has("arrowup"))&&(n.rideCamUid=null,r.y-=z),(J.has("s")||J.has("arrowdown"))&&(n.rideCamUid=null,r.y+=z),(J.has("a")||J.has("arrowleft"))&&(n.rideCamUid=null,r.x-=z),(J.has("d")||J.has("arrowright"))&&(n.rideCamUid=null,r.x+=z),o.update(h),n.rideCamUid){const R=o.state.buildings.find(oe=>oe.uid===n.rideCamUid),Y=o.coasterCircuits.get(n.rideCamUid);if(Y&&Y.waypoints.length>=3){const oe=Oi(Y.waypoints,Y.isClosed,Date.now()/1e3,3);if(oe.length>0){const I=oe[0],ee=rs(I.gx+.5,I.gy+.5,r.viewRot??0),H=ee.wx,Z=ee.wy-(I.elev*Fi+10);r.x+=(H-r.x)*Math.min(1,h*10),r.y+=(Z-r.y)*Math.min(1,h*10),r.zoom+=(1.38-r.zoom)*Math.min(1,h*5),n.rideCamSpeedText=`${I.speedKmh} km/h (${I.onChainLift?"⛓️ Xích kéo lên đồi":"🔥 Đang đổ đèo!"})`,ae%8===0&&n.refreshFloatingBanner()}}else if(R){const oe=Date.now()/1e3,I=R.gx+2+Math.cos(oe*2.1)*1.4,ee=R.gy+2+Math.sin(oe*2.1)*1.4,H=rs(I,ee,r.viewRot??0);r.x+=(H.wx-r.x)*Math.min(1,h*8),r.y+=(H.wy-22-r.y)*Math.min(1,h*8),r.zoom+=(1.35-r.zoom)*Math.min(1,h*5),n.rideCamSpeedText="58 km/h (🎢 Hầm vàng Gringotts)",ae%12===0&&n.refreshFloatingBanner()}else n.rideCamUid=null,n.refreshFloatingBanner()}const j=o.getRealTimePeriod(),de=o.getCurrentWeather(),G=rs(3,17,r.viewRot??0),te=Math.hypot(r.x-G.wx,r.y-G.wy)<420;i.updateSoundscape(Math.min(.1,h),j==="night"||j==="dusk",r.zoom,te,de.kind,o.getActiveFestival()!=="none");const be=n.pendingTouchTile?{gx:n.pendingTouchTile.gx,gy:n.pendingTouchTile.gy}:M;l.activeSeedBrushCropId=n.activeSeedCropId,l.activePastureBrushAnimalId=n.activePastureAnimalId,l.render(o,r,be,n.selectedCatalogItem,n.rotation,n.bulldozerActive,n.inspectSelection?.kind==="building"?n.inspectSelection.uid:null,n.movingBuildingUid,n.pincerPicked?.label??null),ae++,ae%4===0&&!n.photoModeActive&&l.renderMinimap(n.minimapCanvas,o,r),requestAnimationFrame(Yt)}requestAnimationFrame(Yt),document.addEventListener("visibilitychange",()=>{document.hidden?(o.saveToStorage(),i.pause()):(ze=performance.now(),i.resume())}),window.addEventListener("pagehide",()=>{o.saveToStorage()}),window.addEventListener("beforeunload",()=>{o.saveToStorage()}),window.addEventListener("hangsoc:before-sw-reload",()=>{o.saveToStorage()});let Hs=0,Is="";const Kn=o.onUiChange;o.onUiChange=()=>{Kn?.(),window.dispatchEvent(new CustomEvent("game:tick",{detail:{level:o.state.level,galleons:o.state.galleons}}));const b=Date.now(),h=`${o.state.level}|${o.state.match3.stars}|${o.state.unlockedZones.length}|${o.state.buildings.length}|${o.state.settings.weatherOverride}|${o.state.settings.timeOverride}`;h!==Is&&b-Hs>=1200&&(Is=h,Hs=b,window.dispatchEvent(new CustomEvent("hpvn:sync-state",{detail:{parkName:o.state.parkName,level:o.state.level,magicStars:o.state.match3.stars,galleons:o.state.galleons,unlockedZonesCount:o.state.unlockedZones.length,buildingsCount:o.state.buildings.length,weatherMode:o.state.settings.weatherOverride,atmosphereMode:o.state.settings.timeOverride==="realtime"?"auto":o.state.settings.timeOverride}})))},window.addEventListener("hpvn:event",b=>{if(o.isVisitingNeighbor)return;const h=String(b.detail?.mode||"auto");(h==="auto"||h==="none"||h==="halloween"||h==="christmas"||h==="quidditch_cup")&&(o.state.settings.activeFestival=h,o.saveToStorage(),n.refreshAll())}),window.addEventListener("hpvn:mute",b=>{const h=!!b.detail?.muted;o.state.settings.soundEnabled=!h,o.state.settings.bgmEnabled=!h,i.enabled=!h,i.bgmEnabled=!h,h?i.pause():i.resume(),o.saveToStorage(),n.refreshAll()}),window.addEventListener("gamesave:helpers",b=>{const h=b.detail;if(!h)return;const q=o.homeStateWhileVisiting??o.state,z=q===o.state?o.ensureNeighborSocial():q.neighborSocial??(q.neighborSocial=o.ensureNeighborSocial()),j=new Set(z.homeLanternMarks.map(Y=>Y.id)),de=q.buildings[0]?.uid||"burrow_main_gate",G=Date.now(),te=900*1e3,be=3600*1e3;let R=0;for(const Y of h.helpers??[]){if(!Y?.id||j.has(Y.id)||z.homeLanternMarks.length>=5)continue;j.add(Y.id);const oe=Y.buildingUid?q.buildings.find(ee=>ee.uid===Y.buildingUid):void 0,I=(oe&&((oe.cropReadyAt??0)>G||(oe.pastureReadyAt??0)>G||(oe.workshopQueue?.[0]?.endsAt??0)>G||(oe.constructEndsAt??0)>G)?oe:void 0)??q.buildings.find(ee=>(ee.cropReadyAt??0)>G||(ee.pastureReadyAt??0)>G||(ee.workshopQueue?.[0]?.endsAt??0)>G||(ee.constructEndsAt??0)>G);if(I)if((I.cropReadyAt??0)>G)I.cropReadyAt=Math.max(G,(I.cropReadyAt??G)-te),I.cropWateredBoost=!0;else if((I.pastureReadyAt??0)>G)I.pastureReadyAt=Math.max(G,(I.pastureReadyAt??G)-te);else if((I.workshopQueue?.[0]?.endsAt??0)>G)for(const ee of I.workshopQueue??[])ee.startedAt-=te,ee.endsAt=Math.max(G,ee.endsAt-te);else(I.constructEndsAt??0)>G+be&&(I.constructEndsAt=Math.max(G+be,(I.constructEndsAt??G)-te));z.homeLanternMarks.push({id:Y.id,buildingUid:I?.uid||Y.buildingUid||de,helperId:Y.uid,helperName:Y.name||"Hàng Xóm Hang Sóc",helperEmoji:Y.avatarEmoji||"🧙‍♂️",kind:Y.kind||"water_crop",noteVi:Y.noteText||"Đã sang chăm giúp thung lũng của bạn!",createdAt:Y.at||G}),R++}R>0&&(o.saveToStorage(),n.refreshAll(),h.summaryVi&&n.showToast(h.summaryVi,"🏮"))}),window.addEventListener("gamesave:server-meta",b=>{const h=b.detail;if(!h)return;const q=o.homeStateWhileVisiting??o.state,z=q===o.state?o.ensureNeighborSocial():q.neighborSocial??(q.neighborSocial=o.ensureNeighborSocial());typeof h.dayKey=="string"&&h.dayKey&&(z.lastSocialResetKey=h.dayKey),typeof h.dailyGardenHelpsCount=="number"&&h.dailyGardenHelpsCount>(z.dailyGardenHelpsCount??0)&&(z.dailyGardenHelpsCount=h.dailyGardenHelpsCount)})}Za().catch(e=>{console.error("Lỗi khởi động Trang Trại Hang Sóc:",e);const t=document.getElementById("app");t&&(t.innerHTML=`
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `,document.getElementById("btnRecoverReload")?.addEventListener("click",async()=>{if("serviceWorker"in navigator){const s=await navigator.serviceWorker.getRegistrations().catch(()=>[]);await Promise.all(s.map(i=>i.unregister()))}if("caches"in window){const s=await caches.keys().catch(()=>[]);await Promise.all(s.map(i=>caches.delete(i)))}window.location.reload()}))});
