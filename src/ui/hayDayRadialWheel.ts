import {
  computeStrategicPlotGrowSeconds,
  FARM_CROPS,
  formatDurationCompactVi,
  formatDurationCountdownVi,
  getFarmItemIconSrc,
  getFarmItemMeta,
} from '../data/catalog';
import type { ParkSimulation } from '../sim/simulation';
import type { FarmCropId, FarmVisitorOffer, PlacedBuilding } from '../types/game';
import { escapeHtml } from './hudShared';

export type HayDayRadialToolKind = 'sickle' | 'water' | 'seed';

export interface HayDayRadialWheelCallbacks {
  onStartSwipeTool: (
    tool: HayDayRadialToolKind,
    cropId: FarmCropId | null,
    startClientX: number,
    startClientY: number,
    pointerId: number,
    plotUid: string
  ) => void;
  onTapQuickAction: (
    tool: HayDayRadialToolKind,
    cropId: FarmCropId | null,
    plotUid: string
  ) => void;
  onOpenFullSeedTray: (plotUid: string) => void;
  onOpenPlotInspector: (plotUid: string) => void;
  onUseMorningDew: (plotUid: string) => void;
  onVisitorAccepted: (visitorId: string) => void;
  onVisitorDismissed: (visitorId: string) => void;
}

const SICKLE_ICON_SRC = '/game/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp';
const WATERING_CAN_ICON_SRC = '/game/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp';
const DRAG_THRESHOLD_PX = 8;
const MAX_ARC_CROPS = 6;

interface ActiveDragSession {
  tool: HayDayRadialToolKind;
  cropId: FarmCropId | null;
  plotUid: string;
  pointerId: number;
  startX: number;
  startY: number;
  canDrag: boolean;
  startedSwipe: boolean;
  targetEl: HTMLElement;
}

type OverlayActiveState =
  | { kind: 'plot'; plotUid: string; screenX: number; screenY: number }
  | { kind: 'visitor'; visitorId: string; screenX: number; screenY: number }
  | null;

function clampBoxCoord(value: number, min: number, max: number, viewportSize: number, boxSize: number): number {
  if (max < min) {
    return Math.max(4, Math.round((viewportSize - boxSize) / 2));
  }
  return Math.max(min, Math.min(max, value));
}

function getArcAnglesDeg(count: number): number[] {
  if (count <= 1) return [-90];
  if (count === 2) return [-116, -64];
  if (count === 3) return [-138, -90, -42];
  if (count === 4) return [-156, -112, -68, -24];
  if (count === 5) return [-178, -134, -90, -46, -2];
  return [-182, -142, -108, -72, -38, 2];
}

export class HayDayDiegeticOverlayUI {
  private readonly mountParent: HTMLElement;
  private readonly sim: ParkSimulation;
  private readonly callbacks: HayDayRadialWheelCallbacks;
  private readonly root: HTMLDivElement;

  private activeState: OverlayActiveState = null;
  private dragSession: ActiveDragSession | null = null;
  private countdownTimer: number | null = null;
  private suppressedClickTarget: HTMLElement | null = null;
  private destroyed = false;

  private readonly handleDocPointerDown: (ev: PointerEvent) => void;
  private readonly handleDocKeyDown: (ev: KeyboardEvent) => void;
  private readonly handleWindowPointerMove: (ev: PointerEvent) => void;
  private readonly handleWindowPointerUp: (ev: PointerEvent) => void;
  private readonly handleWindowPointerCancel: (ev: PointerEvent) => void;
  private readonly handleWindowResize: () => void;

  constructor(
    mountParent: HTMLElement,
    sim: ParkSimulation,
    callbacks: HayDayRadialWheelCallbacks
  ) {
    this.mountParent = mountParent;
    this.sim = sim;
    this.callbacks = callbacks;

    this.root = document.createElement('div');
    this.root.className = 'hs-diegetic-overlay-root';
    this.root.dataset.hdMode = 'closed';
    this.root.setAttribute('aria-live', 'polite');
    this.root.hidden = true;
    this.mountParent.appendChild(this.root);

    this.handleDocPointerDown = (ev: PointerEvent) => {
      if (!this.activeState) return;
      const target = ev.target as Node | null;
      if (target && this.root.contains(target)) return;
      this.close();
    };

    this.handleDocKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && this.activeState) {
        ev.preventDefault();
        this.close();
      }
    };

    this.handleWindowPointerMove = (ev: PointerEvent) => {
      const session = this.dragSession;
      if (!session) return;
      const pid = typeof ev.pointerId === 'number' ? ev.pointerId : 0;
      if (pid !== session.pointerId) return;
      if (!session.canDrag || session.startedSwipe) return;

      const dist = Math.hypot(ev.clientX - session.startX, ev.clientY - session.startY);
      if (dist > DRAG_THRESHOLD_PX) {
        session.startedSwipe = true;
        this.suppressedClickTarget = session.targetEl;
        const { tool, cropId, plotUid } = session;
        this.clearDragSession();
        this.close();
        this.callbacks.onStartSwipeTool(tool, cropId, ev.clientX, ev.clientY, pid, plotUid);
      }
    };

    this.handleWindowPointerUp = (ev: PointerEvent) => {
      const session = this.dragSession;
      if (!session) return;
      const pid = typeof ev.pointerId === 'number' ? ev.pointerId : 0;
      if (pid !== session.pointerId) return;

      const { tool, cropId, plotUid, startedSwipe, targetEl } = session;
      this.clearDragSession();
      if (!startedSwipe) {
        this.suppressedClickTarget = targetEl;
        this.close();
        this.callbacks.onTapQuickAction(tool, cropId, plotUid);
      }
    };

    this.handleWindowPointerCancel = (ev: PointerEvent) => {
      const session = this.dragSession;
      if (!session) return;
      const pid = typeof ev.pointerId === 'number' ? ev.pointerId : 0;
      if (pid !== session.pointerId) return;
      this.clearDragSession();
    };

    this.handleWindowResize = () => {
      if (this.activeState) {
        this.close();
      }
    };

    document.addEventListener('pointerdown', this.handleDocPointerDown);
    document.addEventListener('keydown', this.handleDocKeyDown);
    window.addEventListener('resize', this.handleWindowResize);
  }

  public isOpen(): boolean {
    return this.activeState !== null;
  }

  public openPlotWheel(plotUid: string, screenX: number, screenY: number): void {
    if (this.destroyed) return;
    const plot = this.findPlot(plotUid);
    if (!plot) {
      this.close();
      return;
    }

    const now = Date.now();
    if (plot.constructEndsAt > now) {
      this.close();
      return;
    }

    this.stopCountdownTimer();
    this.clearDragSession();
    this.activeState = { kind: 'plot', plotUid, screenX, screenY };
    this.root.hidden = false;

    if (plot.cropId && plot.cropReadyAt && now >= plot.cropReadyAt) {
      this.renderRipePlotWheel(plot, screenX, screenY);
    } else if (plot.cropId && plot.cropReadyAt && now < plot.cropReadyAt) {
      this.renderGrowingPlotWheel(plot, screenX, screenY, now);
    } else if (plot.cropId) {
      this.renderRipePlotWheel(plot, screenX, screenY);
    } else {
      this.renderEmptyPlotSeedArc(plot, screenX, screenY);
    }
  }

  public openVisitorPopover(visitorId: string, screenX: number, screenY: number): void {
    if (this.destroyed) return;
    const now = Date.now();
    const visitors = this.sim.getFarmVisitors(now);
    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor || (visitor.arrivesAt && visitor.arrivesAt > now)) {
      this.close();
      return;
    }

    this.stopCountdownTimer();
    this.clearDragSession();
    this.activeState = { kind: 'visitor', visitorId, screenX, screenY };
    this.root.hidden = false;
    this.renderVisitorPopover(visitor, screenX, screenY);
  }

  public close(): void {
    this.stopCountdownTimer();
    this.clearDragSession();
    this.activeState = null;
    this.root.dataset.hdMode = 'closed';
    this.root.innerHTML = '';
    this.root.hidden = true;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.close();
    document.removeEventListener('pointerdown', this.handleDocPointerDown);
    document.removeEventListener('keydown', this.handleDocKeyDown);
    window.removeEventListener('resize', this.handleWindowResize);
    this.root.remove();
  }

  private findPlot(plotUid: string): PlacedBuilding | undefined {
    return this.sim.state.buildings.find((b) => b.uid === plotUid);
  }

  private getViewportBounds(): {
    vw: number;
    vh: number;
    padLeft: number;
    padRight: number;
    padTop: number;
    padBottom: number;
  } {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    const vw = Math.max(
      320,
      Math.round(vv?.width || window.innerWidth || this.mountParent.clientWidth || 1024)
    );
    const vh = Math.max(
      320,
      Math.round(vv?.height || window.innerHeight || this.mountParent.clientHeight || 768)
    );
    const isNarrow = vw <= 480;
    const isShort = vh < 480;
    let safeTop = 0;
    let safeRight = 0;
    let safeBottom = 0;
    let safeLeft = 0;
    try {
      const cs = window.getComputedStyle(this.root);
      safeTop = Number.parseFloat(cs.paddingTop) || 0;
      safeRight = Number.parseFloat(cs.paddingRight) || 0;
      safeBottom = Number.parseFloat(cs.paddingBottom) || 0;
      safeLeft = Number.parseFloat(cs.paddingLeft) || 0;
    } catch {
      // Fallback safely when getComputedStyle is unavailable in minimal test DOMs.
    }
    return {
      vw,
      vh,
      padLeft: Math.round(Math.max(isNarrow ? 12 : 16, safeLeft)),
      padRight: Math.round(Math.max(isNarrow ? 12 : 16, safeRight)),
      padTop: Math.round(Math.max(isShort ? 12 : isNarrow ? 64 : 68, safeTop + (isShort ? 4 : 52))),
      padBottom: Math.round(Math.max(isShort ? 14 : isNarrow ? 88 : 80, safeBottom + (isShort ? 8 : 68))),
    };
  }

  private stopCountdownTimer(): void {
    if (this.countdownTimer !== null) {
      window.clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private clearDragSession(): void {
    if (this.dragSession) {
      this.dragSession.targetEl.classList.remove('is-pressing');
      this.dragSession = null;
    }
    window.removeEventListener('pointermove', this.handleWindowPointerMove);
    window.removeEventListener('pointerup', this.handleWindowPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowPointerCancel);
  }

  private bindDraggableToolHandle(
    btn: HTMLButtonElement,
    tool: HayDayRadialToolKind,
    cropId: FarmCropId | null,
    plotUid: string,
    canDrag: boolean
  ): void {
    btn.addEventListener('pointerdown', (ev: PointerEvent) => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      ev.stopPropagation();
      ev.preventDefault();

      this.clearDragSession();
      const pid = typeof ev.pointerId === 'number' ? ev.pointerId : 0;
      btn.classList.add('is-pressing');
      this.dragSession = {
        tool,
        cropId,
        plotUid,
        pointerId: pid,
        startX: ev.clientX,
        startY: ev.clientY,
        canDrag,
        startedSwipe: false,
        targetEl: btn,
      };
      window.addEventListener('pointermove', this.handleWindowPointerMove);
      window.addEventListener('pointerup', this.handleWindowPointerUp);
      window.addEventListener('pointercancel', this.handleWindowPointerCancel);
    });

    btn.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation();
      if (this.suppressedClickTarget === btn) {
        this.suppressedClickTarget = null;
        return;
      }
      this.close();
      this.callbacks.onTapQuickAction(tool, cropId, plotUid);
    });
  }

  private renderRipePlotWheel(plot: PlacedBuilding, screenX: number, screenY: number): void {
    this.root.dataset.hdMode = 'ripe';
    const cropMeta = plot.cropId ? FARM_CROPS[plot.cropId] : null;
    const cropChipHtml = cropMeta
      ? `
        <div class="hs-radial-crop-chip">
          <img src="${getFarmItemIconSrc(cropMeta.id)}" alt="${escapeHtml(cropMeta.name)}" draggable="false" />
          <span class="hs-radial-crop-name">${escapeHtml(cropMeta.name)}</span>
        </div>
      `
      : '';

    this.root.innerHTML = `
      <div class="hs-radial-panel hs-radial-ripe" role="group" aria-label="Công cụ thu hoạch luống chín">
        ${cropChipHtml}
        <div class="hs-radial-handle-wrap">
          <button
            type="button"
            class="hs-radial-handle is-sickle"
            data-hd-drag-tool="sickle"
            data-hd-plot-uid="${escapeHtml(plot.uid)}"
            aria-label="Kéo gặt ${cropMeta ? escapeHtml(cropMeta.name) : 'nông sản'}"
            title="Chạm để gặt nhanh hoặc kéo quét qua các luống chín"
          >
            <img class="hs-radial-handle-img" src="${SICKLE_ICON_SRC}" alt="" aria-hidden="true" draggable="false" />
            <span class="hs-radial-handle-tag">Kéo gặt</span>
          </button>
        </div>
        <div class="hs-radial-actions-row">
          <button
            type="button"
            class="hs-radial-pill-btn"
            data-hd-action="inspector"
            data-hd-plot-uid="${escapeHtml(plot.uid)}"
          >Chi tiết</button>
        </div>
      </div>
    `;

    const panel = this.root.querySelector<HTMLElement>('.hs-radial-panel');
    if (panel) {
      this.positionBoxNearAnchor(panel, screenX, screenY, 176, 172, 118);
    }

    const sickleBtn = this.root.querySelector<HTMLButtonElement>('[data-hd-drag-tool="sickle"]');
    if (sickleBtn) {
      this.bindDraggableToolHandle(sickleBtn, 'sickle', null, plot.uid, true);
    }

    this.bindSimpleButton('[data-hd-action="inspector"]', () => {
      this.close();
      this.callbacks.onOpenPlotInspector(plot.uid);
    });
  }

  private renderGrowingPlotWheel(
    plot: PlacedBuilding,
    screenX: number,
    screenY: number,
    now: number
  ): void {
    this.root.dataset.hdMode = 'growing';
    const cropMeta = plot.cropId ? FARM_CROPS[plot.cropId] : null;
    const remainSec = Math.max(1, Math.ceil(((plot.cropReadyAt ?? now) - now) / 1000));
    const dewCount = Math.max(0, Math.floor(this.sim.state.morningDewPhials ?? 0));
    const canUseDew = dewCount > 0 || Boolean(this.sim.state.sandboxMode);
    const needsWater = !plot.cropWateredBoost;

    const waterHandleHtml = needsWater
      ? `
        <div class="hs-radial-handle-wrap">
          <button
            type="button"
            class="hs-radial-handle is-water"
            data-hd-drag-tool="water"
            data-hd-plot-uid="${escapeHtml(plot.uid)}"
            aria-label="Kéo tưới giảm 30% thời gian lớn"
            title="Chạm để tưới nhanh hoặc kéo quét tưới toàn bộ luống đang lớn"
          >
            <img class="hs-radial-handle-img" src="${WATERING_CAN_ICON_SRC}" alt="" aria-hidden="true" draggable="false" />
            <span class="hs-radial-handle-tag">Kéo tưới -30%</span>
          </button>
        </div>
      `
      : `<div class="hs-radial-watered-badge">💧 Đã tưới -30%</div>`;

    const dewBtnHtml = canUseDew
      ? `
        <button
          type="button"
          class="hs-radial-pill-btn is-dew"
          data-hd-action="morning-dew"
          data-hd-plot-uid="${escapeHtml(plot.uid)}"
          title="Dùng Bình Sương Mai giúp cây chín nhanh hơn"
        >
          <span>🧪 Sương Mai</span>
          <span class="hs-dew-count">${this.sim.state.sandboxMode ? '∞' : `×${dewCount}`}</span>
        </button>
      `
      : '';

    this.root.innerHTML = `
      <div class="hs-radial-panel hs-radial-growing" role="group" aria-label="Công cụ chăm sóc luống đang lớn">
        <div class="hs-radial-crop-chip">
          ${
            cropMeta
              ? `<img src="${getFarmItemIconSrc(cropMeta.id)}" alt="${escapeHtml(cropMeta.name)}" draggable="false" />`
              : ''
          }
          <span class="hs-radial-crop-name">${escapeHtml(cropMeta?.name ?? 'Luống cây')}</span>
          <span class="hs-radial-countdown" data-hd-countdown>⏳ ${formatDurationCountdownVi(remainSec)}</span>
        </div>
        ${waterHandleHtml}
        <div class="hs-radial-actions-row">
          ${dewBtnHtml}
          <button
            type="button"
            class="hs-radial-pill-btn"
            data-hd-action="inspector"
            data-hd-plot-uid="${escapeHtml(plot.uid)}"
          >Chi tiết</button>
        </div>
      </div>
    `;

    const panel = this.root.querySelector<HTMLElement>('.hs-radial-panel');
    if (panel) {
      const estW = canUseDew ? 256 : 210;
      const estH = needsWater ? 182 : 142;
      this.positionBoxNearAnchor(panel, screenX, screenY, estW, estH, needsWater ? 122 : 96);
    }

    const waterBtn = this.root.querySelector<HTMLButtonElement>('[data-hd-drag-tool="water"]');
    if (waterBtn) {
      this.bindDraggableToolHandle(waterBtn, 'water', null, plot.uid, true);
    }

    this.bindSimpleButton('[data-hd-action="morning-dew"]', () => {
      this.close();
      this.callbacks.onUseMorningDew(plot.uid);
    });

    this.bindSimpleButton('[data-hd-action="inspector"]', () => {
      this.close();
      this.callbacks.onOpenPlotInspector(plot.uid);
    });

    this.countdownTimer = window.setInterval(() => {
      if (this.destroyed || !this.activeState || this.activeState.kind !== 'plot') {
        this.stopCountdownTimer();
        return;
      }
      const livePlot = this.findPlot(plot.uid);
      if (!livePlot || !livePlot.cropId) {
        this.close();
        return;
      }
      const tickNow = Date.now();
      if (!livePlot.cropReadyAt || tickNow >= livePlot.cropReadyAt) {
        if (!this.dragSession) {
          this.openPlotWheel(plot.uid, screenX, screenY);
        }
        return;
      }
      const leftSec = Math.max(1, Math.ceil((livePlot.cropReadyAt - tickNow) / 1000));
      const el = this.root.querySelector<HTMLElement>('[data-hd-countdown]');
      if (el) {
        el.textContent = `⏳ ${formatDurationCountdownVi(leftSec)}`;
      }
    }, 1000);
  }

  private renderEmptyPlotSeedArc(plot: PlacedBuilding, screenX: number, screenY: number): void {
    this.root.dataset.hdMode = 'empty';
    const isSandbox = Boolean(this.sim.state.sandboxMode);
    const unlockedCrops = Object.values(FARM_CROPS)
      .filter((crop) => isSandbox || this.sim.state.level >= crop.unlockLevel)
      .map((crop) => ({
        crop,
        plantable: this.sim.getPlantableSeedCount(crop.id),
      }))
      .sort((a, b) => {
        const aHas = a.plantable > 0 ? 1 : 0;
        const bHas = b.plantable > 0 ? 1 : 0;
        if (bHas !== aHas) return bHas - aHas;
        if (b.plantable !== a.plantable) return b.plantable - a.plantable;
        if (a.crop.unlockLevel !== b.crop.unlockLevel) {
          return a.crop.unlockLevel - b.crop.unlockLevel;
        }
        return a.crop.growSec - b.crop.growSec;
      })
      .slice(0, MAX_ARC_CROPS);

    const bounds = this.getViewportBounds();
    const maxAvailW = Math.max(280, bounds.vw - bounds.padLeft - bounds.padRight);
    const compact = bounds.vw <= 480;
    const baseW = compact ? 362 : 394;
    const boxW = Math.min(baseW, maxAvailW);
    const scale = boxW / baseW;
    const boxH = compact ? 230 : 242;
    const rx = (compact ? 150 : 162) * scale;
    const ry = (compact ? 112 : 118) * scale;
    const hubX = boxW / 2;
    const hubY = compact ? 149 : 158;

    const anglesDeg = getArcAnglesDeg(unlockedCrops.length);
    const tilesHtml = unlockedCrops
      .map(({ crop, plantable }, idx) => {
        const rad = (anglesDeg[idx] * Math.PI) / 180;
        const tx = Math.round(hubX + Math.cos(rad) * rx);
        const ty = Math.round(hubY + Math.sin(rad) * ry);
        const mastery = this.sim.state.cropMastery?.[crop.id] ?? 0;
        const growSec = computeStrategicPlotGrowSeconds(0, false, mastery, crop.growSec).growSec;
        const growLabel = formatDurationCompactVi(growSec);
        const hasSeed = plantable > 0 || isSandbox;
        const delayMs = idx * 22;

        return `
          <button
            type="button"
            class="hs-seed-arc-tile ${hasSeed ? 'has-seed' : 'is-empty-stock'}"
            data-hd-drag-tool="seed"
            data-hd-crop-id="${escapeHtml(crop.id)}"
            data-hd-plot-uid="${escapeHtml(plot.uid)}"
            data-hd-can-drag="${hasSeed ? '1' : '0'}"
            style="left:${tx}px;top:${ty}px;animation-delay:${delayMs}ms;"
            aria-label="${escapeHtml(crop.name)} (×${plantable}, ${growLabel})"
            title="${escapeHtml(crop.name)} · ×${plantable} · ${growLabel}"
          >
            <img class="hs-seed-arc-img" src="${getFarmItemIconSrc(crop.id)}" alt="" aria-hidden="true" draggable="false" />
            <span class="hs-seed-arc-count">×${plantable}</span>
            <span class="hs-seed-arc-time">${escapeHtml(growLabel)}</span>
          </button>
        `;
      })
      .join('');

    this.root.innerHTML = `
      <div
        class="hs-radial-seed-arc"
        role="group"
        aria-label="Vòng chọn hạt giống nhanh"
        style="width:${boxW}px;height:${boxH}px;"
      >
        <div class="hs-seed-arc-halo" aria-hidden="true"></div>
        ${tilesHtml}
        <div class="hs-seed-arc-footer">
          <span class="hs-seed-arc-hint">Kéo gieo lên đất</span>
          <div class="hs-seed-arc-btns">
            <button
              type="button"
              class="hs-radial-pill-btn is-primary"
              data-hd-action="all-seeds"
              data-hd-plot-uid="${escapeHtml(plot.uid)}"
            >🌱 Tất cả</button>
            <button
              type="button"
              class="hs-radial-pill-btn"
              data-hd-action="inspector"
              data-hd-plot-uid="${escapeHtml(plot.uid)}"
            >Chi tiết</button>
          </div>
        </div>
      </div>
    `;

    const arcEl = this.root.querySelector<HTMLElement>('.hs-radial-seed-arc');
    if (arcEl) {
      const clampedLeft = clampBoxCoord(
        Math.round(screenX - boxW / 2),
        bounds.padLeft,
        bounds.vw - bounds.padRight - boxW,
        bounds.vw,
        boxW
      );
      const preferredTop = Math.round(screenY - hubY - 10);
      const clampedTop = clampBoxCoord(
        preferredTop,
        bounds.padTop,
        bounds.vh - bounds.padBottom - boxH,
        bounds.vh,
        boxH
      );
      arcEl.style.left = `${clampedLeft}px`;
      arcEl.style.top = `${clampedTop}px`;
    }

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-hd-drag-tool="seed"]')
      .forEach((btn) => {
        const cid = btn.dataset.hdCropId as FarmCropId | undefined;
        if (!cid) return;
        const canDrag = btn.dataset.hdCanDrag === '1';
        this.bindDraggableToolHandle(btn, 'seed', cid, plot.uid, canDrag);
      });

    this.bindSimpleButton('[data-hd-action="all-seeds"]', () => {
      this.close();
      this.callbacks.onOpenFullSeedTray(plot.uid);
    });

    this.bindSimpleButton('[data-hd-action="inspector"]', () => {
      this.close();
      this.callbacks.onOpenPlotInspector(plot.uid);
    });
  }

  private renderVisitorPopover(
    visitor: FarmVisitorOffer,
    screenX: number,
    screenY: number
  ): void {
    this.root.dataset.hdMode = 'visitor';
    const meta = getFarmItemMeta(visitor.itemId);
    const haveStock = this.sim.getFarmItemCount(visitor.itemId);
    const isSandbox = Boolean(this.sim.state.sandboxMode);
    const canSell = isSandbox || haveStock >= visitor.qty;
    const stockLabel = isSandbox
      ? `Kho: ∞ / ${visitor.qty}`
      : `Kho: ${haveStock} / ${visitor.qty}`;

    this.root.innerHTML = `
      <div
        class="hs-visitor-popover is-above"
        role="dialog"
        aria-label="Đề nghị mua hàng của ${escapeHtml(visitor.visitorName)}"
      >
        <div class="hs-visitor-head">
          <div class="hs-visitor-name">${escapeHtml(visitor.visitorName)}</div>
          <button
            type="button"
            class="hs-visitor-close"
            data-hd-action="close"
            aria-label="Đóng đề nghị khách ghé thăm"
          ><span>✕</span></button>
        </div>
        <p class="hs-visitor-quote">"${escapeHtml(visitor.quoteVi)}"</p>
        <div class="hs-visitor-offer-box">
          <div class="hs-visitor-item-wrap">
            <img
              class="hs-visitor-item-img"
              src="${meta.iconSrc}"
              alt="${escapeHtml(meta.name)}"
              draggable="false"
            />
          </div>
          <div class="hs-visitor-offer-info">
            <div class="hs-visitor-item-line">Mua ${visitor.qty} × ${escapeHtml(meta.name)}</div>
            <div class="hs-visitor-stock-line">
              <span class="hs-visitor-stock-pill ${canSell ? 'is-ready' : 'is-short'}">${stockLabel}</span>
            </div>
            <div class="hs-visitor-reward-line">+🪙${visitor.offerSickle.toLocaleString('vi-VN')} · +⭐${visitor.offerXp.toLocaleString('vi-VN')}</div>
          </div>
        </div>
        <div class="hs-visitor-actions">
          <button
            type="button"
            class="hs-visitor-btn is-accept"
            data-hd-action="visitor-accept"
            data-hd-visitor-id="${escapeHtml(visitor.id)}"
            ${canSell ? '' : 'disabled'}
          >✓ Bán ngay</button>
          <button
            type="button"
            class="hs-visitor-btn is-dismiss"
            data-hd-action="visitor-dismiss"
            data-hd-visitor-id="${escapeHtml(visitor.id)}"
          >✕ Hẹn dịp khác</button>
        </div>
      </div>
    `;

    const card = this.root.querySelector<HTMLElement>('.hs-visitor-popover');
    if (card) {
      const bounds = this.getViewportBounds();
      const rect = card.getBoundingClientRect();
      const cardW =
        rect.width > 0
          ? Math.round(rect.width)
          : Math.min(304, bounds.vw - bounds.padLeft - bounds.padRight);
      const cardH = rect.height > 0 ? Math.round(rect.height) : 216;

      const left = clampBoxCoord(
        Math.round(screenX - cardW / 2),
        bounds.padLeft,
        bounds.vw - bounds.padRight - cardW,
        bounds.vw,
        cardW
      );
      const aboveTop = Math.round(screenY - cardH - 22);
      const placeBelow = aboveTop < bounds.padTop;
      const rawTop = placeBelow ? Math.round(screenY + 24) : aboveTop;
      const top = clampBoxCoord(
        rawTop,
        bounds.padTop,
        bounds.vh - bounds.padBottom - cardH,
        bounds.vh,
        cardH
      );

      card.classList.toggle('is-above', !placeBelow);
      card.classList.toggle('is-below', placeBelow);
      card.style.left = `${left}px`;
      card.style.top = `${top}px`;

      const tailX = Math.max(24, Math.min(cardW - 24, Math.round(screenX - left)));
      card.style.setProperty('--hs-tail-x', `${tailX}px`);

      card.addEventListener('pointerdown', (ev) => {
        ev.stopPropagation();
      });
    }

    this.bindSimpleButton('[data-hd-action="visitor-accept"]', () => {
      if (!canSell) return;
      this.close();
      this.callbacks.onVisitorAccepted(visitor.id);
    });

    this.bindSimpleButton('[data-hd-action="visitor-dismiss"]', () => {
      this.close();
      this.callbacks.onVisitorDismissed(visitor.id);
    });

    this.bindSimpleButton('[data-hd-action="close"]', () => {
      this.close();
    });
  }

  private positionBoxNearAnchor(
    el: HTMLElement,
    screenX: number,
    screenY: number,
    fallbackW: number,
    fallbackH: number,
    aboveOffsetPx: number
  ): void {
    const bounds = this.getViewportBounds();
    const rect = el.getBoundingClientRect();
    const w = rect.width > 0 ? Math.round(rect.width) : fallbackW;
    const h = rect.height > 0 ? Math.round(rect.height) : fallbackH;

    const left = clampBoxCoord(
      Math.round(screenX - w / 2),
      bounds.padLeft,
      bounds.vw - bounds.padRight - w,
      bounds.vw,
      w
    );
    const aboveTop = Math.round(screenY - aboveOffsetPx);
    const rawTop = aboveTop < bounds.padTop ? Math.round(screenY + 28) : aboveTop;
    const top = clampBoxCoord(
      rawTop,
      bounds.padTop,
      bounds.vh - bounds.padBottom - h,
      bounds.vh,
      h
    );

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  private bindSimpleButton(selector: string, handler: () => void): void {
    const btn = this.root.querySelector<HTMLButtonElement>(selector);
    if (!btn) return;
    btn.addEventListener('pointerdown', (ev: PointerEvent) => {
      ev.stopPropagation();
    });
    btn.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation();
      handler();
    });
  }
}
