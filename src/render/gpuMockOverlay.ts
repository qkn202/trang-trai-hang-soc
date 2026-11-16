// Giao diện điều khiển & Kéo rèm so sánh trực tiếp (Split-Screen Wipe) cho bản Mock Engine Đồ Hoạ Mới (WebGL2 2.5D).
// Chỉ khởi chạy khi URL có `?renderer=webgl2|compare` hoặc `?mock=gpu`.

import type { ParkSimulation } from '../sim/simulation';
import { TimeOverride, WeatherOverride } from '../types/game';
import {
  GpuFrameStats,
  GpuMockSettings,
  GpuQualityTier,
  RendererBackendMode,
} from './core/renderDevice';

export class GpuMockOverlayController {
  public readonly settings: GpuMockSettings;
  public readonly gpuCanvas: HTMLCanvasElement;
  private readonly gameCanvas: HTMLCanvasElement;
  private readonly sim: ParkSimulation;
  private readonly rootEl: HTMLDivElement;
  private readonly dividerEl: HTMLDivElement;
  private readonly leftTagEl: HTMLDivElement;
  private readonly rightTagEl: HTMLDivElement;
  private readonly statsEl: HTMLDivElement;
  private draggingSplit = false;
  private collapsed = false;
  private lastStatsPaintMs = 0;

  constructor(
    appContainer: HTMLElement,
    gameCanvas: HTMLCanvasElement,
    sim: ParkSimulation,
    initialMode: RendererBackendMode,
    initialTier: GpuQualityTier = 'high'
  ) {
    this.gameCanvas = gameCanvas;
    this.sim = sim;
    this.settings = {
      mode: initialMode,
      splitRatio: 0.48,
      qualityTier: initialTier,
      lumosWandEnabled: false,
      windStrength: 1.15,
      bloomIntensity: 0.72,
      normalStrength: 1.12,
    };

    // Chèn #gpuWorldCanvas ngay sau #gameCanvas (nằm dưới toàn bộ HUD nhưng đồng bộ tuyệt đối khung nhìn)
    this.gpuCanvas = document.createElement('canvas');
    this.gpuCanvas.id = 'gpuWorldCanvas';
    this.gpuCanvas.setAttribute('aria-hidden', 'true');
    this.gpuCanvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;display:block;';
    gameCanvas.insertAdjacentElement('afterend', this.gpuCanvas);

    const styleEl = document.createElement('style');
    styleEl.textContent = `
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
    `;
    document.head.appendChild(styleEl);

    // Thanh gạt kéo rèm trực tiếp
    this.dividerEl = document.createElement('div');
    this.dividerEl.className = 'gpu-split-divider';
    this.dividerEl.innerHTML = `<div class="gpu-split-knob">◄ CŨ | MỚI ►</div>`;
    appContainer.appendChild(this.dividerEl);

    this.leftTagEl = document.createElement('div');
    this.leftTagEl.className = 'gpu-compare-tag';
    this.leftTagEl.style.left = '14px';
    this.leftTagEl.textContent = '🖼️ CANVAS 2D HIỆN TẠI';
    appContainer.appendChild(this.leftTagEl);

    this.rightTagEl = document.createElement('div');
    this.rightTagEl.className = 'gpu-compare-tag is-new';
    this.rightTagEl.style.right = '14px';
    this.rightTagEl.textContent = '✨ WEBGL2 2.5D ENGINE MỚI';
    appContainer.appendChild(this.rightTagEl);

    this.rootEl = document.createElement('div');
    this.rootEl.className = 'gpu-mock-lab';
    this.rootEl.innerHTML = `
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
    `;
    appContainer.appendChild(this.rootEl);
    this.statsEl = this.rootEl.querySelector('#gpuMockTelemetry') as HTMLDivElement;

    this.bindEvents();
    this.syncVisualState();
  }

  private bindEvents(): void {
    const updateSplitFromClientX = (clientX: number) => {
      const w = Math.max(1, window.innerWidth);
      this.settings.splitRatio = Math.max(0.06, Math.min(0.94, clientX / w));
      this.syncVisualState();
    };

    this.dividerEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      this.draggingSplit = true;
      this.dividerEl.setPointerCapture?.(ev.pointerId);
    });

    window.addEventListener('pointermove', (ev) => {
      if (!this.draggingSplit) return;
      updateSplitFromClientX(ev.clientX);
    });

    const stopDrag = () => {
      this.draggingSplit = false;
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    this.rootEl.addEventListener('click', (ev) => {
      const btn = (ev.target as HTMLElement).closest('button');
      if (!btn) return;
      ev.stopPropagation();

      if (btn.hasAttribute('data-gpu-collapse')) {
        this.collapsed = !this.collapsed;
        this.rootEl.classList.toggle('is-collapsed', this.collapsed);
        btn.textContent = this.collapsed ? '🎛️ Mở bảng GPU ▾' : '➖ Thu gọn';
        return;
      }

      const mode = btn.getAttribute('data-gpu-mode') as RendererBackendMode | null;
      if (mode) {
        this.settings.mode = mode;
        this.syncVisualState();
        return;
      }

      const preset = btn.getAttribute('data-gpu-preset');
      if (preset) {
        if (preset === 'day') {
          this.applyMood('day', 'clear');
        } else if (preset === 'dusk') {
          this.applyMood('dusk', 'clear');
        } else if (preset === 'night') {
          this.applyMood('night', 'fireflies');
        } else if (preset === 'storm') {
          this.applyMood('night', 'storm');
        }
        this.rootEl.querySelectorAll('[data-gpu-preset]').forEach((el) => {
          el.setAttribute('data-active', el === btn ? '1' : '0');
        });
        return;
      }

      if (btn.hasAttribute('data-gpu-lumos')) {
        this.settings.lumosWandEnabled = !this.settings.lumosWandEnabled;
        btn.setAttribute('data-active', this.settings.lumosWandEnabled ? '1' : '0');
        return;
      }

      if (btn.hasAttribute('data-gpu-tier')) {
        const order: GpuQualityTier[] = ['high', 'medium', 'low'];
        const idx = (order.indexOf(this.settings.qualityTier) + 1) % order.length;
        this.settings.qualityTier = order[idx];
        const label =
          this.settings.qualityTier === 'high'
            ? '🌿 Cỏ GPU: Cao (6k)'
            : this.settings.qualityTier === 'medium'
              ? '🌿 Cỏ GPU: Vừa (2.5k)'
              : '🌿 Cỏ GPU: Thấp (800)';
        btn.textContent = label;
      }
    });
  }

  private applyMood(t: TimeOverride, w: WeatherOverride): void {
    this.sim.state.settings.timeOverride = t;
    this.sim.state.settings.weatherOverride = w;
  }

  public syncVisualState(): void {
    const mode = this.settings.mode;
    const pct = (this.settings.splitRatio * 100).toFixed(2);

    this.rootEl.querySelectorAll('[data-gpu-mode]').forEach((el) => {
      el.setAttribute('data-active', el.getAttribute('data-gpu-mode') === mode ? '1' : '0');
    });

    if (mode === 'canvas') {
      this.gpuCanvas.style.display = 'none';
      this.gameCanvas.style.position = '';
      this.gameCanvas.style.zIndex = '';
      this.gameCanvas.style.background = '';
      this.dividerEl.style.display = 'none';
      this.leftTagEl.style.display = 'none';
      this.rightTagEl.style.display = 'none';
    } else if (mode === 'webgl2') {
      this.gpuCanvas.style.display = 'block';
      this.gpuCanvas.style.zIndex = '0';
      this.gpuCanvas.style.clipPath = 'none';
      this.gameCanvas.style.position = 'relative';
      this.gameCanvas.style.zIndex = '1';
      this.gameCanvas.style.background = 'transparent';
      this.dividerEl.style.display = 'none';
      this.leftTagEl.style.display = 'none';
      this.rightTagEl.style.display = 'block';
    } else {
      this.gpuCanvas.style.display = 'block';
      this.gpuCanvas.style.zIndex = '1';
      this.gpuCanvas.style.clipPath = `inset(0 0 0 ${pct}%)`;
      this.gameCanvas.style.position = '';
      this.gameCanvas.style.zIndex = '';
      this.gameCanvas.style.background = '';
      this.dividerEl.style.display = 'block';
      this.dividerEl.style.left = `${pct}%`;
      this.leftTagEl.style.display = 'block';
      this.rightTagEl.style.display = 'block';
    }
  }

  public updateTelemetry(stats: GpuFrameStats, nowMs: number): void {
    if (nowMs - this.lastStatsPaintMs < 250) return;
    this.lastStatsPaintMs = nowMs;
    if (this.settings.mode === 'canvas') {
      this.statsEl.textContent = 'Đang xem Canvas2D Cũ (CPU Immediate) — Bấm "Kéo Rèm So Sánh" hoặc "100% WebGL2 Mới" để bật GPU.';
      return;
    }
    this.statsEl.textContent =
      `⚡ ${stats.fps} FPS • ${stats.drawCalls} GPU Draw Calls • Snapshot ${stats.cpuCollectMs}ms • ` +
      `${stats.sortedSprites} IsoQuads • ${stats.grassInstances} Cỏ Tương Tác • ` +
      `${stats.activeLights} Đèn 2.5D • ${stats.atlasLayers} Atlas2DArray (${stats.atlasSpritesPacked} sp, ~${stats.vramEstimateMb}MB VRAM)`;
  }
}
