(async()=>{if("switch"in HTMLInputElement.prototype)return;const t=matchMedia("(prefers-contrast: more)");let e=t.matches;t.addEventListener("change",a=>{e=a.matches});const n=Promise.resolve(`label:has(input[switch]),
input[switch] {
  animation: none;
}

/* Base styles for the polyfilled switch */
input.switch {
  /* Default fallback color */
  --switch-accent: #2196f3;
  --switch-background: rgba(192, 192, 192, 1);
  --switch-thumb: white;
  appearance: none;
  height: 1em;
  width: 2em;
  border-radius: 1em;
  box-shadow: inset -1em 0px 0px 0px var(--switch-background);
  background-color: var(--switch-thumb);
  border: 1px solid var(--switch-background);
  font-size: inherit;
  position: relative;
  top: 0.2em;
  touch-action: none;
}

input.switch:is(:hover, :active, :focus) {
  transition:
    box-shadow 0.2s,
    border 0.2s,
    opacity 0.2s;
}

[dir='rtl'] input.switch {
  transform: rotate(180deg);
}

.vertical-rl,
.vertical-lr {
  transform: rotate(90deg);
}

.sideways-rl {
  transform: rotate(90deg);
  right: 1.6em;
}

label:has(.sideways-rl) {
  margin-block-end: 0.8em;
}

.sideways-lr {
  transform: rotate(-90deg);
  left: 1.4em;
  margin-inline-start: 0.8em;
}

label:has(.sideways-lr) {
  margin-block-start: -1.2em;
}

input.switch:checked {
  box-shadow: inset 1em 0px 0px 0px var(--switch-accent);
  border: 1px solid var(--switch-accent);
}

input.switch[disabled] {
  opacity: 0.5;
}

@media (prefers-contrast: more) {
  input.switch {
    border: 1px solid ButtonText;
  }

  /* Shared styles for the indicator */
  input.switch::after {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    top: 0;
    font-size: 0.5em;
    font-family: Arial, sans-serif;
    line-height: 1;
  }

  /* Default (OFF) state: unchecked and not visually-on, OR visually-off */
  input.switch:not(:checked):not(.visually-on)::after,
  input.switch.visually-off::after {
    content: '◯';
    position: absolute;
    left: 50%;
  }

  /* Checked (ON) state: checked and not visually-off, OR visually-on */
  input.switch:checked:not(.visually-off),
  input.switch.visually-on {
    border-color: ButtonText;
  }

  input.switch:checked:not(.visually-off)::after,
  input.switch.visually-on::after {
    content: '❙';
    position: absolute;
    left: 0;
    color: contrast-color(var(--switch-accent));
  }
}

@media (forced-colors: active) {
  input.switch {
    forced-color-adjust: none;
    --switch-accent: Canvas;
    --switch-background: Canvas;
    --switch-thumb: ButtonText;
    border-color: ButtonText;
  }

  input.switch:checked {
    box-shadow: inset 1em 0px 0px 0px var(--switch-accent);
    border-color: ButtonText;
  }
}
`).then(a=>new CSSStyleSheet().replace(a));function r(a){if(a.classList.contains("switch"))return;a.classList.add("switch"),a.setAttribute("role","switch");const d=getComputedStyle(a),{"accent-color":c,"writing-mode":f}=d;f&&a.classList.add(f),c&&c!=="auto"&&a.style.setProperty("--switch-accent",c),a.addEventListener("pointerdown",k=>{if(a.disabled)return;const o=a;o.setPointerCapture(k.pointerId);const x=k.clientX,v=k.clientY,y=o.checked,L=getComputedStyle(o),z=parseFloat(L.fontSize),Z=L.direction==="rtl",ee=o.classList.contains("vertical-rl")||o.classList.contains("vertical-lr")||o.classList.contains("sideways-rl"),te=o.classList.contains("sideways-lr");let A=y?1:0,O=!1;const $=h=>{if(!o.hasPointerCapture(h.pointerId))return;if(!O)if(Math.abs(h.clientX-x)>5||Math.abs(h.clientY-v)>5)O=!0,o.style.transition="none";else return;h.preventDefault();let b=0;ee?b=h.clientY-v:te?b=-(h.clientY-v):(b=h.clientX-x,Z&&(b=-b));const N=b/z;let S=(y?1:0)+N;S=Math.max(0,Math.min(1,S)),A=S;const I=(2*S-1)*z;S>.5?(o.classList.add("visually-on"),o.classList.remove("visually-off"),o.style.boxShadow=`inset ${I}px 0px 0px 0px var(--switch-accent)`,o.style.border=`1px solid ${e?"ButtonText":"var(--switch-accent)"}`):(o.classList.add("visually-off"),o.classList.remove("visually-on"),o.style.boxShadow=`inset ${I}px 0px 0px 0px var(--switch-background)`,o.style.border=`1px solid ${e?"ButtonText":"var(--switch-background)"}`)},M=h=>{if(o.releasePointerCapture(h.pointerId),o.removeEventListener("pointermove",$),o.removeEventListener("pointerup",M),o.removeEventListener("pointercancel",M),o.style.transition="",o.style.boxShadow="",o.style.border="",o.classList.remove("visually-on"),o.classList.remove("visually-off"),O){const b=A>.5;b!==y&&(o.checked=b,o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0}))),o.addEventListener("click",N=>{N.preventDefault(),N.stopPropagation()},{once:!0,capture:!0})}};o.addEventListener("pointermove",$),o.addEventListener("pointerup",M),o.addEventListener("pointercancel",M)})}async function i(){document.querySelectorAll('input[type="checkbox"][switch]').forEach(r);const d=await n;document.adoptedStyleSheets.includes(d)||(document.adoptedStyleSheets=[...document.adoptedStyleSheets,d])}const s=new MutationObserver(a=>{a.forEach(d=>{d.type==="childList"&&d.addedNodes.forEach(c=>{c.nodeType===1&&(c.matches&&c.matches('input[type="checkbox"][switch]')&&r(c),(c.querySelectorAll?c.querySelectorAll('input[type="checkbox"][switch]'):[]).forEach(r))})})});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{i(),s.observe(document.body,{childList:!0,subtree:!0})}):(i(),s.observe(document.body,{childList:!0,subtree:!0}))})();const le=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));for(var ne={grad:.9,turn:360,rad:360/(2*Math.PI)},g=function(t){return typeof t=="string"?t.length>0:typeof t=="number"},u=function(t,e,n){return e===void 0&&(e=0),n===void 0&&(n=Math.pow(10,e)),Math.round(n*t)/n+0},P=function(t){var e=Math.round(100*t)/100;return Math.round(255*e)===255*t?e:Math.round(1e3*t)/1e3},l=function(t,e,n){return e===void 0&&(e=0),n===void 0&&(n=1),t>n?n:t>e?t:e},G=function(t){return(t=isFinite(t)?t%360:0)<0?t+360:t},R=function(t,e){return e===void 0&&(e=0),u(t,e)%360},Y=function(t){return{r:l(t.r,0,255),g:l(t.g,0,255),b:l(t.b,0,255),a:l(t.a)}},T=function(t){return{r:u(t.r),g:u(t.g),b:u(t.b),a:P(t.a)}},re=/^#([0-9a-f]{3,8})$/i,m=function(t,e){var n=t.charCodeAt(e);return(15&n)+9*(n>>6)},E=function(t,e){return m(t,e)<<4|m(t,e+1)},J=[],C=0;C<256;C++)J.push((C<16?"0":"")+C.toString(16));var q=function(t){return J[l(t,0,255)]},K=function(t){var e=t.r,n=t.g,r=t.b,i=t.a,s=Math.max(e,n,r),a=s-Math.min(e,n,r),d=a?s===e?(n-r)/a:s===n?2+(r-e)/a:4+(e-n)/a:0;return{h:60*(d<0?d+6:d),s:s?a/s*100:0,v:s/255*100,a:i}},W=function(t){var e=t.h,n=t.s,r=t.v,i=t.a;e=e/360*6,n/=100,r/=100;var s=Math.floor(e),a=r*(1-n),d=r*(1-(e-s)*n),c=r*(1-(1-e+s)*n),f=s%6;return{r:255*[r,d,a,a,c,r][f],g:255*[c,r,r,d,a,a][f],b:255*[a,a,c,r,r,d][f],a:i}},F=function(t){return{h:G(t.h),s:l(t.s,0,100),l:l(t.l,0,100),a:l(t.a)}},V=function(t){return{h:R(t.h),s:u(t.s),l:u(t.l),a:P(t.a)}},X=function(t){return W((n=(e=t).s,{h:e.h,s:(n*=((r=e.l)<50?r:100-r)/100)>0?2*n/(r+n)*100:0,v:r+n,a:e.a}));var e,n,r},w=function(t){return{h:(e=K(t)).h,s:(i=(200-(n=e.s))*(r=e.v)/100)>0&&i<200?n*r/100/(i<=100?i:200-i)*100:0,l:i/2,a:e.a};var e,n,r,i},ae=/^hsla?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i,ie=/^hsla?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i,oe=/^rgba?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i,se=/^rgba?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i,B={string:[[function(t){if(!re.test(t))return null;var e=t.length;return e<=5?{r:17*m(t,1),g:17*m(t,2),b:17*m(t,3),a:e===5?17*m(t,4)/255:1}:e===7||e===9?{r:E(t,1),g:E(t,3),b:E(t,5),a:e===9?E(t,7)/255:1}:null},"hex"],[function(t){var e=oe.exec(t)||se.exec(t);return e?e[2]!==e[4]||e[4]!==e[6]?null:Y({r:Number(e[1])/(e[2]?100/255:1),g:Number(e[3])/(e[4]?100/255:1),b:Number(e[5])/(e[6]?100/255:1),a:e[7]===void 0?1:Number(e[7])/(e[8]?100:1)}):null},"rgb"],[function(t){var e=ae.exec(t)||ie.exec(t);if(!e)return null;var n,r,i=F({h:(n=e[1],r=e[2],r===void 0&&(r="deg"),Number(n)*(ne[r.toLowerCase()]||1)),s:Number(e[3]),l:Number(e[4]),a:e[5]===void 0?1:Number(e[5])/(e[6]?100:1)});return X(i)},"hsl"]],object:[[function(t){var e=t.r,n=t.g,r=t.b,i=t.a,s=i===void 0?1:i;return g(e)&&g(n)&&g(r)?Y({r:Number(e),g:Number(n),b:Number(r),a:Number(s)}):null},"rgb"],[function(t){var e=t.h,n=t.s,r=t.l,i=t.a,s=i===void 0?1:i;if(!g(e)||!g(n)||!g(r))return null;var a=F({h:Number(e),s:Number(n),l:Number(r),a:Number(s)});return X(a)},"hsl"],[function(t){var e=t.h,n=t.s,r=t.v,i=t.a,s=i===void 0?1:i;if(!g(e)||!g(n)||!g(r))return null;var a=(function(d){return{h:G(d.h),s:l(d.s,0,100),v:l(d.v,0,100),a:l(d.a)}})({h:Number(e),s:Number(n),v:Number(r),a:Number(s)});return W(a)},"hsv"]]},_=function(t,e){for(var n=0;n<e.length;n++){var r=e[n][0](t);if(r)return[r,e[n][1]]}return[null,void 0]},de=function(t){return typeof t=="string"?_(t.trim(),B.string):typeof t=="object"&&t!==null?_(t,B.object):[null,void 0]},j=function(t,e,n){var r=w(t);return{h:r.h,s:l(r.s+e*(n?r.s:100),0,100),l:r.l,a:r.a}},H=function(t){return(299*t.r+587*t.g+114*t.b)/1e3/255},Q=function(t,e,n){var r=w(t);return{h:r.h,s:r.s,l:l(r.l+e*(n?r.l:100),0,100),a:r.a}},D=(function(){function t(e){this.parsed=de(e)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return t.prototype.isValid=function(){return this.parsed!==null},t.prototype.brightness=function(){return u(H(this.rgba),2)},t.prototype.isDark=function(){return H(this.rgba)<.5},t.prototype.isLight=function(){return H(this.rgba)>=.5},t.prototype.toHex=function(){return e=T(this.rgba),n=e.r,r=e.g,i=e.b,a=(s=e.a)<1?q(u(255*s)):"","#"+q(n)+q(r)+q(i)+a;var e,n,r,i,s,a},t.prototype.toRgb=function(){return T(this.rgba)},t.prototype.toRgbString=function(){return e=T(this.rgba),n=e.r,r=e.g,i=e.b,(s=e.a)<1?"rgba("+n+", "+r+", "+i+", "+s+")":"rgb("+n+", "+r+", "+i+")";var e,n,r,i,s},t.prototype.toHsl=function(){return V(w(this.rgba))},t.prototype.toHslString=function(){return e=V(w(this.rgba)),n=e.h,r=e.s,i=e.l,(s=e.a)<1?"hsla("+n+", "+r+"%, "+i+"%, "+s+")":"hsl("+n+", "+r+"%, "+i+"%)";var e,n,r,i,s},t.prototype.toHsv=function(){return e=K(this.rgba),{h:R(e.h),s:u(e.s),v:u(e.v),a:P(e.a)};var e},t.prototype.invert=function(){return p({r:255-(e=this.rgba).r,g:255-e.g,b:255-e.b,a:e.a});var e},t.prototype.saturate=function(e,n){return e===void 0&&(e=.1),p(j(this.rgba,e,n?.relative))},t.prototype.desaturate=function(e,n){return e===void 0&&(e=.1),p(j(this.rgba,-e,n?.relative))},t.prototype.grayscale=function(){return p(j(this.rgba,-1))},t.prototype.lighten=function(e,n){return e===void 0&&(e=.1),p(Q(this.rgba,e,n?.relative))},t.prototype.darken=function(e,n){return e===void 0&&(e=.1),p(Q(this.rgba,-e,n?.relative))},t.prototype.rotate=function(e){return e===void 0&&(e=15),this.hue(w(this.rgba).h+e)},t.prototype.alpha=function(e){return typeof e=="number"?p({r:(n=this.rgba).r,g:n.g,b:n.b,a:e}):P(this.rgba.a);var n},t.prototype.hue=function(e){var n=w(this.rgba);return typeof e=="number"?p({h:e,s:n.s,l:n.l,a:n.a}):R(n.h)},t.prototype.isEqual=function(e){return this.toHex()===p(e).toHex()},t})(),p=function(t){return t instanceof D?t:new D(t)},U=[],fe=function(t){t.forEach(function(e){U.indexOf(e)<0&&(e(D,B),U.push(e))})},ue=function(t,e){var n={white:"#ffffff",bisque:"#ffe4c4",blue:"#0000ff",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",antiquewhite:"#faebd7",aqua:"#00ffff",azure:"#f0ffff",whitesmoke:"#f5f5f5",papayawhip:"#ffefd5",plum:"#dda0dd",blanchedalmond:"#ffebcd",black:"#000000",gold:"#ffd700",goldenrod:"#daa520",gainsboro:"#dcdcdc",cornsilk:"#fff8dc",cornflowerblue:"#6495ed",burlywood:"#deb887",aquamarine:"#7fffd4",beige:"#f5f5dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkkhaki:"#bdb76b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",peachpuff:"#ffdab9",darkmagenta:"#8b008b",darkred:"#8b0000",darkorchid:"#9932cc",darkorange:"#ff8c00",darkslateblue:"#483d8b",gray:"#808080",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",deeppink:"#ff1493",deepskyblue:"#00bfff",wheat:"#f5deb3",firebrick:"#b22222",floralwhite:"#fffaf0",ghostwhite:"#f8f8ff",darkviolet:"#9400d3",magenta:"#ff00ff",green:"#008000",dodgerblue:"#1e90ff",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",blueviolet:"#8a2be2",forestgreen:"#228b22",lawngreen:"#7cfc00",indianred:"#cd5c5c",indigo:"#4b0082",fuchsia:"#ff00ff",brown:"#a52a2a",maroon:"#800000",mediumblue:"#0000cd",lightcoral:"#f08080",darkturquoise:"#00ced1",lightcyan:"#e0ffff",ivory:"#fffff0",lightyellow:"#ffffe0",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",linen:"#faf0e6",mediumaquamarine:"#66cdaa",lemonchiffon:"#fffacd",lime:"#00ff00",khaki:"#f0e68c",mediumseagreen:"#3cb371",limegreen:"#32cd32",mediumspringgreen:"#00fa9a",lightskyblue:"#87cefa",lightblue:"#add8e6",midnightblue:"#191970",lightpink:"#ffb6c1",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",mintcream:"#f5fffa",lightslategray:"#778899",lightslategrey:"#778899",navajowhite:"#ffdead",navy:"#000080",mediumvioletred:"#c71585",powderblue:"#b0e0e6",palegoldenrod:"#eee8aa",oldlace:"#fdf5e6",paleturquoise:"#afeeee",mediumturquoise:"#48d1cc",mediumorchid:"#ba55d3",rebeccapurple:"#663399",lightsteelblue:"#b0c4de",mediumslateblue:"#7b68ee",thistle:"#d8bfd8",tan:"#d2b48c",orchid:"#da70d6",mediumpurple:"#9370db",purple:"#800080",pink:"#ffc0cb",skyblue:"#87ceeb",springgreen:"#00ff7f",palegreen:"#98fb98",red:"#ff0000",yellow:"#ffff00",slateblue:"#6a5acd",lavenderblush:"#fff0f5",peru:"#cd853f",palevioletred:"#db7093",violet:"#ee82ee",teal:"#008080",slategray:"#708090",slategrey:"#708090",aliceblue:"#f0f8ff",darkseagreen:"#8fbc8f",darkolivegreen:"#556b2f",greenyellow:"#adff2f",seagreen:"#2e8b57",seashell:"#fff5ee",tomato:"#ff6347",silver:"#c0c0c0",sienna:"#a0522d",lavender:"#e6e6fa",lightgreen:"#90ee90",orange:"#ffa500",orangered:"#ff4500",steelblue:"#4682b4",royalblue:"#4169e1",turquoise:"#40e0d0",yellowgreen:"#9acd32",salmon:"#fa8072",saddlebrown:"#8b4513",sandybrown:"#f4a460",rosybrown:"#bc8f8f",darksalmon:"#e9967a",lightgoldenrodyellow:"#fafad2",snow:"#fffafa",lightgrey:"#d3d3d3",lightgray:"#d3d3d3",dimgray:"#696969",dimgrey:"#696969",olivedrab:"#6b8e23",olive:"#808000"},r={};for(var i in n)r[n[i]]=i;var s={};t.prototype.toName=function(a){if(!(this.rgba.a||this.rgba.r||this.rgba.g||this.rgba.b))return"transparent";var d,c,f=r[this.toHex()];if(f)return f;if(a?.closest){var k=this.toRgb(),o=1/0,x="black";if(!s.length)for(var v in n)s[v]=new t(n[v]).toRgb();for(var y in n){var L=(d=k,c=s[y],Math.pow(d.r-c.r,2)+Math.pow(d.g-c.g,2)+Math.pow(d.b-c.b,2));L<o&&(o=L,x=y)}return x}},e.string.push([function(a){var d=a.toLowerCase(),c=d==="transparent"?"#0000":n[d];return typeof c=="string"?new t(c).toRgb():null},"name"])};export{fe as D,ue as e,le as i,p as q};
