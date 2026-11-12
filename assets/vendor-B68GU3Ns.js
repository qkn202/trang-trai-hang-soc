(async()=>{if("switch"in HTMLInputElement.prototype)return;const y=matchMedia("(prefers-contrast: more)");let l=y.matches;y.addEventListener("change",e=>{l=e.matches});const E=Promise.resolve(`label:has(input[switch]),
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
`).then(e=>new CSSStyleSheet().replace(e));function d(e){if(e.classList.contains("switch"))return;e.classList.add("switch"),e.setAttribute("role","switch");const o=getComputedStyle(e),{"accent-color":n,"writing-mode":h}=o;h&&e.classList.add(h),n&&n!=="auto"&&e.style.setProperty("--switch-accent",n),e.addEventListener("pointerdown",u=>{if(e.disabled)return;const t=e;t.setPointerCapture(u.pointerId);const m=u.clientX,p=u.clientY,f=t.checked,x=getComputedStyle(t),g=parseFloat(x.fontSize),C=x.direction==="rtl",M=t.classList.contains("vertical-rl")||t.classList.contains("vertical-lr")||t.classList.contains("sideways-rl"),P=t.classList.contains("sideways-lr");let L=f?1:0,w=!1;const S=s=>{if(!t.hasPointerCapture(s.pointerId))return;if(!w)if(Math.abs(s.clientX-m)>5||Math.abs(s.clientY-p)>5)w=!0,t.style.transition="none";else return;s.preventDefault();let i=0;M?i=s.clientY-p:P?i=-(s.clientY-p):(i=s.clientX-m,C&&(i=-i));const a=i/g;let r=(f?1:0)+a;r=Math.max(0,Math.min(1,r)),L=r;const k=(2*r-1)*g;r>.5?(t.classList.add("visually-on"),t.classList.remove("visually-off"),t.style.boxShadow=`inset ${k}px 0px 0px 0px var(--switch-accent)`,t.style.border=`1px solid ${l?"ButtonText":"var(--switch-accent)"}`):(t.classList.add("visually-off"),t.classList.remove("visually-on"),t.style.boxShadow=`inset ${k}px 0px 0px 0px var(--switch-background)`,t.style.border=`1px solid ${l?"ButtonText":"var(--switch-background)"}`)},c=s=>{if(t.releasePointerCapture(s.pointerId),t.removeEventListener("pointermove",S),t.removeEventListener("pointerup",c),t.removeEventListener("pointercancel",c),t.style.transition="",t.style.boxShadow="",t.style.border="",t.classList.remove("visually-on"),t.classList.remove("visually-off"),w){const i=L>.5;i!==f&&(t.checked=i,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0}))),t.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation()},{once:!0,capture:!0})}};t.addEventListener("pointermove",S),t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)})}async function v(){document.querySelectorAll('input[type="checkbox"][switch]').forEach(d);const o=await E;document.adoptedStyleSheets.includes(o)||(document.adoptedStyleSheets=[...document.adoptedStyleSheets,o])}const b=new MutationObserver(e=>{e.forEach(o=>{o.type==="childList"&&o.addedNodes.forEach(n=>{n.nodeType===1&&(n.matches&&n.matches('input[type="checkbox"][switch]')&&d(n),(n.querySelectorAll?n.querySelectorAll('input[type="checkbox"][switch]'):[]).forEach(d))})})});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{v(),b.observe(document.body,{childList:!0,subtree:!0})}):(v(),b.observe(document.body,{childList:!0,subtree:!0}))})();
