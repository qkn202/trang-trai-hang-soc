import type { FlyRewardKind } from '../../types/game';

/**
 * Cross-Layer Flying Collectibles Batcher (Track A2 + B6a)
 * --------------------------------------------------------
 * Vẽ các vật phẩm thu hoạch (Sickle, Sao Phép Thuật, Cát Thời Gian, XP) bay xuyên lớp
 * từ toạ độ thế giới 2.5D vút theo đường cong Bezier bậc 3 thẳng vào đúng ô HUD mục tiêu
 * (`[data-fly-target="galleons|stars|sand|xp"]`), kèm đuôi bụi sao lấp lánh và vòng xung kích khi chạm đích.
 *
 * Kiến trúc chuẩn Native:
 * - 100% SoA TypedArray pre-allocated (0 cấp phát object mỗi frame, 0 tạo/xoá thẻ DOM).
 * - Tự động ngủ (`rAF` dừng hẳn) ngay khi không còn hạt bay (0.00ms chi phí khi nghỉ).
 * - Tôn trọng `prefers-reduced-motion: reduce`.
 */

const MAX_FLYERS = 160;
const MAX_MOTES = 480;
const MAX_RINGS = 32;

const KIND_ID_MAP: Record<FlyRewardKind, number> = {
  galleons: 0,
  stars: 1,
  sand: 2,
  xp: 3,
};

const KIND_PRIMARY_HEX = ['#fbbf24', '#fde047', '#38bdf8', '#a78bfa'] as const;
const KIND_GLOW_RGBA = [
  'rgba(251, 191, 36, 0.45)',
  'rgba(253, 224, 71, 0.52)',
  'rgba(56, 189, 248, 0.45)',
  'rgba(167, 139, 250, 0.45)',
] as const;
const KIND_GLYPH = ['🪙', '🌟', '⏳', '✨'] as const;

export interface FlyingCollectiblesCallbacks {
  onArrival?: (kind: FlyRewardKind, arrivalIndex: number) => void;
}

export class CrossLayerFlyingCollectibles {
  private readonly root: HTMLElement;
  private readonly cb: FlyingCollectiblesCallbacks;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number | null = null;
  private lastTs = 0;
  private arrivalSeq = 0;

  // SoA Flyers
  private readonly fActive = new Uint8Array(MAX_FLYERS);
  private readonly fKind = new Uint8Array(MAX_FLYERS);
  private readonly fAge = new Float32Array(MAX_FLYERS);
  private readonly fDur = new Float32Array(MAX_FLYERS);
  private readonly fDelay = new Float32Array(MAX_FLYERS);
  private readonly fP0x = new Float32Array(MAX_FLYERS);
  private readonly fP0y = new Float32Array(MAX_FLYERS);
  private readonly fP1x = new Float32Array(MAX_FLYERS);
  private readonly fP1y = new Float32Array(MAX_FLYERS);
  private readonly fP2x = new Float32Array(MAX_FLYERS);
  private readonly fP2y = new Float32Array(MAX_FLYERS);
  private readonly fP3x = new Float32Array(MAX_FLYERS);
  private readonly fP3y = new Float32Array(MAX_FLYERS);
  private readonly fTrailAccum = new Float32Array(MAX_FLYERS);

  // SoA Trail Motes
  private readonly mActive = new Uint8Array(MAX_MOTES);
  private readonly mKind = new Uint8Array(MAX_MOTES);
  private readonly mX = new Float32Array(MAX_MOTES);
  private readonly mY = new Float32Array(MAX_MOTES);
  private readonly mVx = new Float32Array(MAX_MOTES);
  private readonly mVy = new Float32Array(MAX_MOTES);
  private readonly mAge = new Float32Array(MAX_MOTES);
  private readonly mDur = new Float32Array(MAX_MOTES);
  private readonly mSize = new Float32Array(MAX_MOTES);

  // SoA Arrival Shockwave Rings
  private readonly rActive = new Uint8Array(MAX_RINGS);
  private readonly rKind = new Uint8Array(MAX_RINGS);
  private readonly rX = new Float32Array(MAX_RINGS);
  private readonly rY = new Float32Array(MAX_RINGS);
  private readonly rAge = new Float32Array(MAX_RINGS);
  private readonly rDur = new Float32Array(MAX_RINGS);

  private flyerCursor = 0;
  private moteCursor = 0;
  private ringCursor = 0;

  constructor(root: HTMLElement, callbacks: FlyingCollectiblesCallbacks = {}) {
    this.root = root;
    this.cb = callbacks;
  }

  private isReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private ensureCanvas(): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null;
    if (!this.canvas || !this.canvas.isConnected) {
      const existing = document.getElementById('aaaFlyCollectiblesCanvas') as HTMLCanvasElement | null;
      const c = existing ?? document.createElement('canvas');
      c.id = 'aaaFlyCollectiblesCanvas';
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText =
        'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9400;';
      if (!c.isConnected) {
        document.body.appendChild(c);
      }
      this.canvas = c;
      this.ctx = c.getContext('2d');
      this.syncCanvasSize();
    }
    return this.ctx;
  }

  public syncCanvasSize(): void {
    if (!this.canvas || typeof window === 'undefined') return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  private resolveTargetCenter(kind: FlyRewardKind): {
    x: number;
    y: number;
    el: HTMLElement | null;
  } | null {
    const el = this.root.querySelector(`[data-fly-target="${kind}"]`) as HTMLElement | null;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) return null;
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5,
      el,
    };
  }

  private lastPulseByKind = new Map<FlyRewardKind, number>();

  private pulseHudTarget(kind: FlyRewardKind): void {
    const el = this.root.querySelector(`[data-fly-target="${kind}"]`) as HTMLElement | null;
    if (!el) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const prev = this.lastPulseByKind.get(kind) ?? 0;
    if (now - prev < 120) return;
    this.lastPulseByKind.set(kind, now);
    if (typeof el.animate === 'function') {
      el.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' },
        ],
        { duration: 220, easing: 'ease-out' }
      );
    } else {
      el.classList.add('hud-chip-pulse');
    }
  }

  public spawnBurstToHud(
    kind: FlyRewardKind,
    amount: number,
    startSx?: number,
    startSy?: number
  ): boolean {
    const dest = this.resolveTargetCenter(kind);
    if (!dest) return false;

    if (this.isReducedMotion()) {
      this.pulseHudTarget(kind);
      this.cb.onArrival?.(kind, 0);
      return true;
    }

    const ctx = this.ensureCanvas();
    if (!ctx || typeof window === 'undefined') return false;
    this.syncCanvasSize();

    const originX =
      typeof startSx === 'number' && Number.isFinite(startSx)
        ? Math.max(20, Math.min(window.innerWidth - 20, startSx))
        : window.innerWidth * 0.5;
    const originY =
      typeof startSy === 'number' && Number.isFinite(startSy)
        ? Math.max(20, Math.min(window.innerHeight - 20, startSy))
        : window.innerHeight * 0.54;

    const count =
      kind === 'stars' || kind === 'sand'
        ? Math.min(6, Math.max(1, Math.round(amount)))
        : Math.min(8, Math.max(2, Math.ceil(Math.log2(Math.max(2, amount)))));

    const kId = KIND_ID_MAP[kind];
    for (let i = 0; i < count; i++) {
      const slot = this.allocFlyerSlot();
      const spreadAng = ((Math.PI * 2 * i) / count) + (Math.random() - 0.5) * 0.5;
      const popRadius = 18 + Math.random() * 26;
      const p0x = originX + Math.cos(spreadAng) * 6;
      const p0y = originY + Math.sin(spreadAng) * 6;
      // P1 pops outward & upward like physical coins bursting from crop/chest
      const sideBias = (i % 2 === 0 ? 1 : -1) * (28 + Math.random() * 44);
      const p1x = originX + Math.cos(spreadAng) * popRadius + sideBias;
      const p1y = originY - 36 - Math.random() * 42;
      // P2 guides smooth swoop into HUD pill
      const p2x = p0x + (dest.x - p0x) * 0.62 + sideBias * 0.35;
      const p2y = Math.min(originY, dest.y) - 18 + (dest.y - originY) * 0.32;

      this.fActive[slot] = 1;
      this.fKind[slot] = kId;
      this.fAge[slot] = 0;
      this.fDur[slot] = 0.52 + Math.min(0.22, i * 0.032) + Math.random() * 0.05;
      this.fDelay[slot] = i * 0.036;
      this.fP0x[slot] = p0x;
      this.fP0y[slot] = p0y;
      this.fP1x[slot] = p1x;
      this.fP1y[slot] = p1y;
      this.fP2x[slot] = p2x;
      this.fP2y[slot] = p2y;
      this.fP3x[slot] = dest.x;
      this.fP3y[slot] = dest.y;
      this.fTrailAccum[slot] = 0;
    }

    // Initial harvest sparkle pop at world origin
    this.spawnMoteCluster(kId, originX, originY, 6, 75);
    this.ensureLoop();
    return true;
  }

  private allocFlyerSlot(): number {
    for (let n = 0; n < MAX_FLYERS; n++) {
      const idx = (this.flyerCursor + n) % MAX_FLYERS;
      if (this.fActive[idx] === 0) {
        this.flyerCursor = (idx + 1) % MAX_FLYERS;
        return idx;
      }
    }
    const idx = this.flyerCursor;
    this.flyerCursor = (idx + 1) % MAX_FLYERS;
    return idx;
  }

  private spawnMote(kId: number, x: number, y: number, vx: number, vy: number, size: number, dur: number): void {
    const slot = this.moteCursor;
    this.moteCursor = (slot + 1) % MAX_MOTES;
    this.mActive[slot] = 1;
    this.mKind[slot] = kId;
    this.mX[slot] = x;
    this.mY[slot] = y;
    this.mVx[slot] = vx;
    this.mVy[slot] = vy;
    this.mAge[slot] = 0;
    this.mDur[slot] = dur;
    this.mSize[slot] = size;
  }

  private spawnMoteCluster(kId: number, x: number, y: number, count: number, speed: number): void {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = speed * (0.45 + Math.random() * 0.65);
      this.spawnMote(
        kId,
        x,
        y,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        2.2 + Math.random() * 2.3,
        0.24 + Math.random() * 0.16
      );
    }
  }

  private spawnRing(kId: number, x: number, y: number): void {
    const slot = this.ringCursor;
    this.ringCursor = (slot + 1) % MAX_RINGS;
    this.rActive[slot] = 1;
    this.rKind[slot] = kId;
    this.rX[slot] = x;
    this.rY[slot] = y;
    this.rAge[slot] = 0;
    this.rDur[slot] = 0.28;
  }

  private ensureLoop(): void {
    if (this.rafId !== null || typeof requestAnimationFrame === 'undefined') return;
    this.lastTs = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTs) / 1000));
      this.lastTs = now;
      const hasWork = this.tickAndRender(dt);
      if (hasWork) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.rafId = null;
      }
    };
    this.rafId = requestAnimationFrame(step);
  }

  public getActiveCount(): number {
    let n = 0;
    for (let i = 0; i < MAX_FLYERS; i++) {
      if (this.fActive[i] === 1) n++;
    }
    return n;
  }

  public tickAndRender(dt: number): boolean {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return false;

    const dpr = Math.min(2, (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let aliveAny = false;

    // 1. Update & draw stardust motes
    for (let i = 0; i < MAX_MOTES; i++) {
      if (this.mActive[i] === 0) continue;
      const age = this.mAge[i]! + dt;
      const dur = this.mDur[i]!;
      if (age >= dur) {
        this.mActive[i] = 0;
        continue;
      }
      aliveAny = true;
      this.mAge[i] = age;
      this.mX[i] = this.mX[i]! + this.mVx[i]! * dt;
      this.mY[i] = this.mY[i]! + this.mVy[i]! * dt;
      const t = age / dur;
      const alpha = (1 - t) * (1 - t);
      const r = this.mSize[i]! * (1 - t * 0.45);
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = KIND_PRIMARY_HEX[this.mKind[i]!] ?? '#fbbf24';
      ctx.beginPath();
      ctx.arc(this.mX[i]!, this.mY[i]!, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Update & draw arrival shockwave rings
    for (let i = 0; i < MAX_RINGS; i++) {
      if (this.rActive[i] === 0) continue;
      const age = this.rAge[i]! + dt;
      const dur = this.rDur[i]!;
      if (age >= dur) {
        this.rActive[i] = 0;
        continue;
      }
      aliveAny = true;
      this.rAge[i] = age;
      const t = age / dur;
      const ease = 1 - Math.pow(1 - t, 2.2);
      const radius = 8 + ease * 22;
      ctx.globalAlpha = (1 - t) * 0.85;
      ctx.strokeStyle = KIND_PRIMARY_HEX[this.rKind[i]!] ?? '#fbbf24';
      ctx.lineWidth = 2.4 * (1 - t * 0.6);
      ctx.beginPath();
      ctx.arc(this.rX[i]!, this.rY[i]!, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Update & draw Bezier collectibles
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const kindsByIdx: readonly FlyRewardKind[] = ['galleons', 'stars', 'sand', 'xp'];

    for (let i = 0; i < MAX_FLYERS; i++) {
      if (this.fActive[i] === 0) continue;
      aliveAny = true;
      if (this.fDelay[i]! > 0) {
        this.fDelay[i] = Math.max(0, this.fDelay[i]! - dt);
        continue;
      }

      const age = this.fAge[i]! + dt;
      const dur = this.fDur[i]!;
      const kId = this.fKind[i]!;
      if (age >= dur) {
        this.fActive[i] = 0;
        const dx = this.fP3x[i]!;
        const dy = this.fP3y[i]!;
        this.spawnRing(kId, dx, dy);
        this.spawnMoteCluster(kId, dx, dy, 7, 92);
        const kindName = kindsByIdx[kId] ?? 'galleons';
        this.pulseHudTarget(kindName);
        this.arrivalSeq = (this.arrivalSeq + 1) % 8;
        this.cb.onArrival?.(kindName, this.arrivalSeq);
        continue;
      }

      this.fAge[i] = age;
      const rawT = age / dur;
      // Smooth cubic ease-in-out with snappy terminal magnet acceleration
      const u = rawT < 0.35
        ? 1 - Math.pow(1 - rawT / 0.35, 1.8) * 0.68 - 0.32 * (1 - rawT / 0.35)
        : 0.32 + Math.pow((rawT - 0.35) / 0.65, 1.55) * 0.68;
      const t = Math.max(0, Math.min(1, u));
      const inv = 1 - t;
      const b0 = inv * inv * inv;
      const b1 = 3 * inv * inv * t;
      const b2 = 3 * inv * t * t;
      const b3 = t * t * t;

      const x =
        b0 * this.fP0x[i]! +
        b1 * this.fP1x[i]! +
        b2 * this.fP2x[i]! +
        b3 * this.fP3x[i]!;
      const y =
        b0 * this.fP0y[i]! +
        b1 * this.fP1y[i]! +
        b2 * this.fP2y[i]! +
        b3 * this.fP3y[i]!;

      this.fTrailAccum[i] = this.fTrailAccum[i]! + dt;
      if (this.fTrailAccum[i]! >= 0.024) {
        this.fTrailAccum[i] = 0;
        this.spawnMote(
          kId,
          x + (Math.random() - 0.5) * 5,
          y + (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 20,
          12 + Math.random() * 18,
          2.1 + Math.random() * 1.4,
          0.2
        );
      }

      const scale =
        rawT < 0.18
          ? 0.65 + (rawT / 0.18) * 0.52
          : 1.17 - ((rawT - 0.18) / 0.82) * 0.28;
      ctx.globalAlpha = 1;
      ctx.fillStyle = KIND_GLOW_RGBA[kId] ?? KIND_GLOW_RGBA[0];
      ctx.beginPath();
      ctx.arc(x, y, 12 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.round(20 * scale)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.fillText(KIND_GLYPH[kId] ?? '🪙', x, y + 1);
    }

    ctx.globalAlpha = 1;
    return aliveAny;
  }

  public dispose(): void {
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.fActive.fill(0);
    this.mActive.fill(0);
    this.rActive.fill(0);
    if (this.canvas?.isConnected) {
      this.canvas.remove();
    }
    this.canvas = null;
    this.ctx = null;
  }
}
