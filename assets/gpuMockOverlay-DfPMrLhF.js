var g=Object.defineProperty;var c=(n,t,e)=>t in n?g(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var i=(n,t,e)=>c(n,typeof t!="symbol"?t+"":t,e);class h{constructor(t,e,a,s,r="high"){i(this,"settings");i(this,"gpuCanvas");i(this,"gameCanvas");i(this,"sim");i(this,"rootEl");i(this,"dividerEl");i(this,"leftTagEl");i(this,"rightTagEl");i(this,"statsEl");i(this,"draggingSplit",!1);i(this,"collapsed",!1);i(this,"lastStatsPaintMs",0);this.gameCanvas=e,this.sim=a,this.settings={mode:s,splitRatio:.48,qualityTier:r,lumosWandEnabled:!1,windStrength:1.15,bloomIntensity:.72,normalStrength:1.12},this.gpuCanvas=document.createElement("canvas"),this.gpuCanvas.id="gpuWorldCanvas",this.gpuCanvas.setAttribute("aria-hidden","true"),this.gpuCanvas.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;display:block;",e.insertAdjacentElement("afterend",this.gpuCanvas);const o=document.createElement("style");o.textContent=`
      .gpu-mock-lab {
        position: fixed;
        left: 50%;
        top: 8px;
        bottom: auto !important;
        height: auto !important;
        transform: translateX(-50%);
        z-index: 95;
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 5px 8px;
        border-radius: var(--radius-pill);
        background: rgba(36, 23, 19, 0.84);
        backdrop-filter: blur(6px);
        color: var(--ink-cream);
        border: 1.5px solid var(--border-brass);
        box-shadow: 0 4px 14px var(--shadow-deep);
        font-family: "Be Vietnam Pro", system-ui, sans-serif;
        font-size: 11px;
        width: max-content;
        max-width: calc(100vw - 16px);
        user-select: none;
      }
      .gpu-mock-lab.is-collapsed {
        padding: 4px 8px;
        gap: 0;
      }
      .gpu-mock-lab.is-collapsed .gpu-mock-collapsible {
        display: none !important;
      }
      .gpu-mock-row {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        overflow-x: auto;
        max-width: calc(100vw - 32px);
        scrollbar-width: none;
      }
      .gpu-mock-row::-webkit-scrollbar {
        display: none;
      }
      .gpu-mock-btn {
        appearance: none;
        flex: 0 0 auto;
        border: 1px solid var(--border-brass);
        background: var(--surface-dark);
        color: var(--ink-cream);
        border-radius: var(--radius-chip);
        padding: 3px 7px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
        transition: transform 0.08s ease, background 0.12s ease;
      }
      .gpu-mock-btn:hover {
        transform: translateY(-1px);
      }
      .gpu-mock-btn[data-active="1"] {
        background: var(--gold);
        color: var(--surface-dark-2);
        border-color: var(--border-cream);
      }
      .gpu-mock-btn.is-toggle {
        background: var(--surface-dark-2);
        color: var(--gold-soft);
      }
      .gpu-mock-stats {
        text-align: center;
        font-size: 10.5px;
        font-weight: 600;
        color: var(--gold-soft);
        letter-spacing: 0.01em;
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100vw - 36px);
      }
      .gpu-split-divider {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--gold);
        box-shadow: 0 0 12px var(--shadow-deep);
        z-index: 85;
        cursor: ew-resize;
        touch-action: none;
      }
      .gpu-split-knob {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 5px 9px;
        border-radius: var(--radius-pill);
        background: var(--surface-dark-2);
        color: var(--focus-color);
        border: 2px solid var(--gold);
        box-shadow: 0 4px 14px var(--shadow-deep);
        font-family: "Be Vietnam Pro", system-ui, sans-serif;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
      }
      .gpu-compare-tag {
        position: fixed;
        top: 66px;
        z-index: 84;
        padding: 3px 9px;
        border-radius: var(--radius-pill);
        background: rgba(36, 23, 19, 0.82);
        color: var(--ink-cream);
        border: 1px solid var(--border-brass);
        font-family: "Be Vietnam Pro", system-ui, sans-serif;
        font-size: 10.5px;
        font-weight: 800;
        pointer-events: none;
        box-shadow: 0 3px 10px var(--shadow-deep);
      }
      .gpu-compare-tag.is-new {
        border-color: var(--teal);
        color: var(--focus-color);
      }
      @media (max-width: 720px) {
        .gpu-mock-lab {
          top: 54px;
          bottom: auto !important;
          height: auto !important;
          padding: 4px 7px;
          border-radius: var(--radius-card);
        }
        .gpu-mock-stats {
          display: none;
        }
        .gpu-compare-tag {
          top: 94px;
          font-size: 9.5px;
          padding: 2px 7px;
        }
      }
    `,document.head.appendChild(o),this.dividerEl=document.createElement("div"),this.dividerEl.className="gpu-split-divider",this.dividerEl.innerHTML='<div class="gpu-split-knob">◄ CŨ | MỚI ►</div>',t.appendChild(this.dividerEl),this.leftTagEl=document.createElement("div"),this.leftTagEl.className="gpu-compare-tag",this.leftTagEl.style.left="14px",this.leftTagEl.textContent="🖼️ CANVAS 2D HIỆN TẠI",t.appendChild(this.leftTagEl),this.rightTagEl=document.createElement("div"),this.rightTagEl.className="gpu-compare-tag is-new",this.rightTagEl.style.right="14px",this.rightTagEl.textContent="✨ WEBGL2 2.5D ENGINE MỚI",t.appendChild(this.rightTagEl),this.rootEl=document.createElement("div"),this.rootEl.className="gpu-mock-lab",this.rootEl.innerHTML=`
      <div class="gpu-mock-row">
        <button type="button" class="gpu-mock-btn is-toggle" data-gpu-collapse="1" title="Thu gọn / Mở bảng điều chỉnh GPU">➖ Thu gọn</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-mode="compare">🌗 Kéo Rèm</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-mode="webgl2">✨ 100% WebGL2</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-mode="canvas">🖼️ Canvas2D</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-preset="day">☀️ Nắng</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-preset="dusk">🌇 Hoàng Hôn</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-preset="night">🌙 Đêm Floo</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-preset="storm">⛈️ Bão</button>
        <button type="button" class="gpu-mock-btn gpu-mock-collapsible" data-gpu-tier="cycle">🌿 Cỏ: 6k</button>
      </div>
      <div class="gpu-mock-stats gpu-mock-collapsible" id="gpuMockTelemetry">Đang khởi tạo WebGL2 Texture2DArray & Normal Bake...</div>
    `,t.appendChild(this.rootEl),this.statsEl=this.rootEl.querySelector("#gpuMockTelemetry"),this.bindEvents(),this.syncVisualState()}bindEvents(){const t=a=>{const s=Math.max(1,window.innerWidth);this.settings.splitRatio=Math.max(.06,Math.min(.94,a/s)),this.syncVisualState()};this.dividerEl.addEventListener("pointerdown",a=>{a.preventDefault(),a.stopPropagation(),this.draggingSplit=!0,this.dividerEl.setPointerCapture?.(a.pointerId)}),window.addEventListener("pointermove",a=>{this.draggingSplit&&t(a.clientX)});const e=()=>{this.draggingSplit=!1};window.addEventListener("pointerup",e),window.addEventListener("pointercancel",e),this.rootEl.addEventListener("click",a=>{const s=a.target.closest("button");if(!s)return;if(a.stopPropagation(),s.hasAttribute("data-gpu-collapse")){this.collapsed=!this.collapsed,this.rootEl.classList.toggle("is-collapsed",this.collapsed),s.textContent=this.collapsed?"🎛️ Mở bảng GPU ▾":"➖ Thu gọn";return}const r=s.getAttribute("data-gpu-mode");if(r){this.settings.mode=r,this.syncVisualState();return}const o=s.getAttribute("data-gpu-preset");if(o){o==="day"?this.applyMood("day","clear"):o==="dusk"?this.applyMood("dusk","clear"):o==="night"?this.applyMood("night","fireflies"):o==="storm"&&this.applyMood("night","storm"),this.rootEl.querySelectorAll("[data-gpu-preset]").forEach(l=>{l.setAttribute("data-active",l===s?"1":"0")});return}if(s.hasAttribute("data-gpu-lumos")){this.settings.lumosWandEnabled=!this.settings.lumosWandEnabled,s.setAttribute("data-active",this.settings.lumosWandEnabled?"1":"0");return}if(s.hasAttribute("data-gpu-tier")){const l=["high","medium","low"],p=(l.indexOf(this.settings.qualityTier)+1)%l.length;this.settings.qualityTier=l[p];const d=this.settings.qualityTier==="high"?"🌿 Cỏ GPU: Cao (6k)":this.settings.qualityTier==="medium"?"🌿 Cỏ GPU: Vừa (2.5k)":"🌿 Cỏ GPU: Thấp (800)";s.textContent=d}})}applyMood(t,e){this.sim.state.settings.timeOverride=t,this.sim.state.settings.weatherOverride=e}syncVisualState(){const t=this.settings.mode,e=(this.settings.splitRatio*100).toFixed(2);this.rootEl.querySelectorAll("[data-gpu-mode]").forEach(a=>{a.setAttribute("data-active",a.getAttribute("data-gpu-mode")===t?"1":"0")}),t==="canvas"?(this.gpuCanvas.style.display="none",this.gameCanvas.style.position="",this.gameCanvas.style.zIndex="",this.gameCanvas.style.background="",this.dividerEl.style.display="none",this.leftTagEl.style.display="none",this.rightTagEl.style.display="none"):t==="webgl2"?(this.gpuCanvas.style.display="block",this.gpuCanvas.style.zIndex="0",this.gpuCanvas.style.clipPath="none",this.gameCanvas.style.position="relative",this.gameCanvas.style.zIndex="1",this.gameCanvas.style.background="transparent",this.dividerEl.style.display="none",this.leftTagEl.style.display="none",this.rightTagEl.style.display="block"):(this.gpuCanvas.style.display="block",this.gpuCanvas.style.zIndex="1",this.gpuCanvas.style.clipPath=`inset(0 0 0 ${e}%)`,this.gameCanvas.style.position="",this.gameCanvas.style.zIndex="",this.gameCanvas.style.background="",this.dividerEl.style.display="block",this.dividerEl.style.left=`${e}%`,this.leftTagEl.style.display="block",this.rightTagEl.style.display="block")}updateTelemetry(t,e){if(!(e-this.lastStatsPaintMs<250)){if(this.lastStatsPaintMs=e,this.settings.mode==="canvas"){this.statsEl.textContent='Đang xem Canvas2D Cũ (CPU Immediate) — Bấm "Kéo Rèm So Sánh" hoặc "100% WebGL2 Mới" để bật GPU.';return}this.statsEl.textContent=`⚡ ${t.fps} FPS • ${t.drawCalls} GPU Draw Calls • Snapshot ${t.cpuCollectMs}ms • ${t.sortedSprites} IsoQuads • ${t.grassInstances} Cỏ Tương Tác • ${t.activeLights} Đèn 2.5D • ${t.atlasLayers} Atlas2DArray (${t.atlasSpritesPacked} sp, ~${t.vramEstimateMb}MB VRAM)`}}}export{h as GpuMockOverlayController};
