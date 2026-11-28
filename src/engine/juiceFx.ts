/**
 * JuiceFX - High-performance canvas juice & micro-animations module.
 * Pure Canvas 2D, zero DOM overhead, zero garbage collection churn.
 *
 * Capabilities:
 * - ScreenShake: Dual-frequency organic sin-noise with exponential frame decay (0.9/frame)
 * - FlashFX: Full-screen color flash overlay with quadratic fade-out
 * - ConfettiFX: Pre-allocated pool of 100 particles for milestone bursts & celebrations
 * - HarvestFlightFX: Pre-allocated pools for parabolic harvest flights (40), burst rings (16), and arrival twinkles (20)
 * - MicroFX: pulseScale overshoot curves & progressBarShimmer sheen
 * - reducedMotion aware: Honors prefers-reduced-motion and runtime configuration
 */

export interface JuiceFXOptions {
  reducedMotion?: boolean;
}

export interface ShakeOffset {
  x: number;
  y: number;
}

export class ScreenShake {
  public intensity = 0;
  public decay = 0.9;
  public phase = 0;
  public offset: ShakeOffset = { x: 0, y: 0 };
  public reducedMotion = false;

  constructor(decay = 0.9, reducedMotion = false) {
    this.decay = decay;
    this.reducedMotion = reducedMotion;
  }

  public add(amount: number, maxIntensity = 30): void {
    if (this.reducedMotion || amount <= 0) return;
    this.intensity = Math.min(maxIntensity, this.intensity + amount);
  }

  public tick(dt = 1 / 60): ShakeOffset {
    if (this.reducedMotion || this.intensity <= 0.001) {
      this.intensity = 0;
      this.offset = { x: 0, y: 0 };
      return this.offset;
    }

    const step = dt > 0 ? dt * 60 : 1;
    this.phase += step * 1.35;

    // Organic dual sin noise to avoid mechanical repetition
    const nx = Math.sin(this.phase * 1.7) * 0.65 + Math.cos(this.phase * 0.8) * 0.35;
    const ny = Math.cos(this.phase * 1.5) * 0.65 + Math.sin(this.phase * 1.1) * 0.35;

    this.offset = {
      x: nx * this.intensity,
      y: ny * this.intensity,
    };

    // Exponential frame decay (default 0.9/frame)
    const decayStep = dt > 0 ? Math.pow(this.decay, dt * 60) : this.decay;
    this.intensity *= decayStep;

    if (this.intensity < 0.1) {
      this.intensity = 0;
      this.offset = { x: 0, y: 0 };
    }

    return this.offset;
  }
}

export class FlashFX {
  public color = '#ffffff';
  public alpha = 0;
  public maxAlpha = 0;
  public duration = 300;
  public elapsed = 0;

  public trigger(color: string, alpha: number, durationMs = 300): void {
    this.color = color;
    this.maxAlpha = Math.min(1, Math.max(0, alpha));
    this.alpha = this.maxAlpha;
    this.duration = Math.max(30, durationMs);
    this.elapsed = 0;
  }

  public tick(dt = 1 / 60): void {
    if (this.alpha <= 0.001) {
      this.alpha = 0;
      return;
    }
    const dtMs = (dt > 0 ? dt : 1 / 60) * 1000;
    this.elapsed += dtMs;
    const progress = Math.min(1, this.elapsed / this.duration);
    // Smooth quadratic ease-out fade
    this.alpha = this.maxAlpha * (1 - progress) * (1 - progress);
    if (progress >= 1) {
      this.alpha = 0;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

export interface ConfettiParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  color: string;
  emoji?: string;
  size: number;
  life: number;
  maxLife: number;
}

export const CONFETTI_COLORS = [
  '#f59e0b', // Golden Sickle
  '#ef4444', // Gryffindor Scarlet
  '#10b981', // Meadow Emerald
  '#8b5cf6', // Magic Purple
  '#06b6d4', // Cyan
  '#fde047', // Warm Amber
  '#ec4899', // Berry Pink
  '#60a5fa', // Ravenclaw Blue
];

export class ConfettiFX {
  public readonly pool: ConfettiParticle[] = [];
  public reducedMotion = false;

  constructor(poolSize = 100, reducedMotion = false) {
    this.reducedMotion = reducedMotion;
    for (let i = 0; i < poolSize; i++) {
      this.pool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotation: 0,
        vRot: 0,
        flip: 0,
        vFlip: 0,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        emoji: undefined,
        size: 8,
        life: 0,
        maxLife: 1.5,
      });
    }
  }

  public emit(x: number, y: number, count: number, emojis?: string[]): number {
    if (this.reducedMotion || count <= 0) return 0;

    let activated = 0;
    const targetCount = Math.min(count, this.pool.length);

    // 1. Activate available inactive particles first
    for (let i = 0; i < this.pool.length && activated < targetCount; i++) {
      const p = this.pool[i];
      if (!p.active) {
        this.initParticle(p, x, y, activated, emojis);
        activated++;
      }
    }

    // 2. Recycle oldest active particles if pool was exhausted
    if (activated < targetCount) {
      for (let i = 0; i < this.pool.length && activated < targetCount; i++) {
        const p = this.pool[i];
        if (p.life > p.maxLife * 0.45) {
          this.initParticle(p, x, y, activated, emojis);
          activated++;
        }
      }
    }

    return activated;
  }

  private initParticle(
    p: ConfettiParticle,
    x: number,
    y: number,
    index: number,
    emojis?: string[]
  ): void {
    p.active = true;
    p.x = x + (Math.random() - 0.5) * 16;
    p.y = y + (Math.random() - 0.5) * 12;

    const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
    const speed = 4.2 + Math.random() * 6.2;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.rotation = Math.random() * Math.PI * 2;
    p.vRot = (Math.random() - 0.5) * 0.25;
    p.flip = Math.random() * Math.PI * 2;
    p.vFlip = 0.08 + Math.random() * 0.14;
    p.color = CONFETTI_COLORS[(index + Math.floor(Math.random() * 4)) % CONFETTI_COLORS.length];
    p.emoji = emojis && emojis.length > 0 ? emojis[index % emojis.length] : undefined;
    p.size = p.emoji ? 16 : 6 + Math.random() * 6;
    p.life = 0;
    p.maxLife = 1.2 + Math.random() * 0.8;
  }

  public tick(dt = 1 / 60): void {
    const step = dt > 0 ? dt * 60 : 1;
    const gravity = 0.22 * step;
    const drag = Math.pow(0.97, step);

    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      p.vy += gravity;
      p.vx *= drag;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.rotation += p.vRot * step;
      p.flip += p.vFlip * step;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    let hasActive = false;
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        hasActive = true;
        break;
      }
    }
    if (!hasActive) return;

    ctx.save();
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      const progress = p.life / p.maxLife;
      const alpha = progress > 0.75 ? Math.max(0, 1 - (progress - 0.75) / 0.25) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.emoji) {
        ctx.font = `${Math.round(p.size)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else {
        const scaleX = Math.cos(p.flip);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.5, -p.size * 0.25, p.size, p.size * 0.5);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  public getActiveCount(): number {
    let count = 0;
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }

  /**
   * Gentle harvest wheat/leaf burst using the pre-allocated confetti pool (zero GC).
   */
  public emitLeafPop(x: number, y: number, count = 5, accentColor = '#fde047'): number {
    if (this.reducedMotion || count <= 0) return 0;

    let activated = 0;
    const targetCount = Math.min(Math.floor(count), this.pool.length);
    const palette = [accentColor, '#fde047', '#4ade80', '#f59e0b'];

    const initLeaf = (p: ConfettiParticle, idx: number): void => {
      p.active = true;
      const spread = (idx % 2 === 0 ? -1 : 1) * (4 + (idx % 3) * 4);
      p.x = x + spread;
      p.y = y - 4 + (idx % 2) * 4;

      const angle = -Math.PI * 0.5 + ((idx % 5) - 2) * 0.36;
      const speed = 2.4 + (idx % 3) * 1.1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.rotation = (idx * 1.1) % (Math.PI * 2);
      p.vRot = (idx % 2 === 0 ? 1 : -1) * 0.16;
      p.flip = idx * 0.7;
      p.vFlip = 0.12;
      p.color = palette[idx % palette.length];
      p.emoji = undefined;
      p.size = 5 + (idx % 3) * 1.5;
      p.life = 0;
      p.maxLife = 0.5 + (idx % 3) * 0.12;
    };

    for (let i = 0; i < this.pool.length && activated < targetCount; i++) {
      const p = this.pool[i];
      if (!p.active) {
        initLeaf(p, activated);
        activated++;
      }
    }

    if (activated < targetCount) {
      for (let i = 0; i < this.pool.length && activated < targetCount; i++) {
        const p = this.pool[i];
        if (p.life > p.maxLife * 0.45) {
          initLeaf(p, activated);
          activated++;
        }
      }
    }

    return activated;
  }
}

export interface HarvestFlightParticle {
  startX: number;
  startY: number;
  ctrlX: number;
  ctrlY: number;
  targetX: number;
  targetY: number;
  t: number;
  duration: number;
  size: number;
  color: string;
  sprite?: CanvasImageSource | null;
  spin: number;
  active: boolean;
}

export interface HarvestBurstRing {
  active: boolean;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
  lineWidth: number;
}

export interface ArrivalTwinkle {
  active: boolean;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
}

/**
 * Zero-GC parabolic harvest flight, ground burst ring, and arrival twinkle system.
 */
export class HarvestFlightFX {
  public readonly pool: HarvestFlightParticle[] = [];
  public readonly rings: HarvestBurstRing[] = [];
  public readonly twinkles: ArrivalTwinkle[] = [];
  public reducedMotion = false;
  private readonly posScratch = { x: 0, y: 0 };

  constructor(poolSize = 40, ringPoolSize = 16, reducedMotion = false) {
    this.reducedMotion = reducedMotion;

    for (let i = 0; i < poolSize; i++) {
      this.pool.push({
        startX: 0,
        startY: 0,
        ctrlX: 0,
        ctrlY: 0,
        targetX: 0,
        targetY: 0,
        t: 0,
        duration: 0.56,
        size: 28,
        color: '#fde047',
        sprite: null,
        spin: 0,
        active: false,
      });
    }

    for (let i = 0; i < ringPoolSize; i++) {
      this.rings.push({
        active: false,
        x: 0,
        y: 0,
        radius: 10,
        maxRadius: 56,
        life: 0,
        maxLife: 0.42,
        color: '#fde047',
        lineWidth: 3.2,
      });
    }

    for (let i = 0; i < 20; i++) {
      this.twinkles.push({
        active: false,
        x: 0,
        y: 0,
        life: 0,
        maxLife: 0.28,
        size: 13,
        color: '#fde047',
        rotation: 0,
      });
    }
  }

  public static sampleQuadraticBezier(
    p: HarvestFlightParticle,
    t = p.t,
    out: { x: number; y: number } = { x: 0, y: 0 }
  ): { x: number; y: number } {
    const u = Math.max(0, Math.min(1, t));
    const inv = 1 - u;
    const a = inv * inv;
    const b = 2 * inv * u;
    const c = u * u;
    out.x = a * p.startX + b * p.ctrlX + c * p.targetX;
    out.y = a * p.startY + b * p.ctrlY + c * p.targetY;
    return out;
  }

  public spawn(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    sprite?: CanvasImageSource | null,
    color = '#fde047',
    count = 2
  ): number {
    if (this.reducedMotion) return 0;
    const safeCount = Number.isFinite(count) ? Math.floor(count) : 2;
    if (safeCount <= 0) return 0;

    const targetCount = Math.min(safeCount, this.pool.length);
    let activated = 0;

    // 1. Prefer inactive slots from pre-allocated pool
    for (let i = 0; i < this.pool.length && activated < targetCount; i++) {
      const p = this.pool[i];
      if (!p.active) {
        this.initFlight(p, fromX, fromY, toX, toY, sprite, color, activated);
        activated++;
      }
    }

    // 2. Recycle oldest active flights if pool is saturated
    while (activated < targetCount) {
      let oldestIdx = -1;
      let highestT = -1;
      for (let i = 0; i < this.pool.length; i++) {
        const p = this.pool[i];
        if (p.t > highestT) {
          highestT = p.t;
          oldestIdx = i;
        }
      }
      if (oldestIdx < 0) break;
      this.initFlight(this.pool[oldestIdx], fromX, fromY, toX, toY, sprite, color, activated);
      activated++;
    }

    return activated;
  }

  private initFlight(
    p: HarvestFlightParticle,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    sprite: CanvasImageSource | null | undefined,
    color: string,
    idx: number
  ): void {
    const fanDir = idx % 2 === 0 ? -1 : 1;
    const startX = idx === 0 ? fromX : fromX + fanDir * (6 + idx * 3);
    const startY = idx === 0 ? fromY : fromY - (idx % 3) * 4;
    const midX = (startX + toX) * 0.5;
    const dist = Math.hypot(toX - startX, toY - startY);
    const fanMag = idx === 0 ? 18 : 30 + Math.floor(idx / 2) * 20;
    const lift = Math.min(190, Math.max(70, dist * 0.26)) + idx * 16;

    p.startX = startX;
    p.startY = startY;
    p.ctrlX = midX + fanDir * fanMag;
    p.ctrlY = Math.max(-40, Math.min(startY, toY) - lift);
    p.targetX = toX;
    p.targetY = toY;
    p.t = 0;
    p.duration = Math.min(1.05, 0.54 + idx * 0.085);
    p.size = Math.max(22, 28 - Math.min(4, idx));
    p.color = color || '#fde047';
    p.sprite = sprite ?? null;
    p.spin = (idx % 2 === 0 ? 1 : -1) * (0.42 + (idx % 3) * 0.18);
    p.active = true;
  }

  public spawnRing(x: number, y: number, color = '#fde047'): boolean {
    if (this.reducedMotion) return false;

    let slot: HarvestBurstRing | null = null;
    for (let i = 0; i < this.rings.length; i++) {
      if (!this.rings[i].active) {
        slot = this.rings[i];
        break;
      }
    }

    if (!slot) {
      let oldestRatio = -1;
      for (let i = 0; i < this.rings.length; i++) {
        const ratio = this.rings[i].life / Math.max(0.01, this.rings[i].maxLife);
        if (ratio > oldestRatio) {
          oldestRatio = ratio;
          slot = this.rings[i];
        }
      }
    }

    if (!slot) return false;
    slot.active = true;
    slot.x = x;
    slot.y = y;
    slot.radius = 10;
    slot.maxRadius = 56;
    slot.life = 0;
    slot.maxLife = 0.42;
    slot.color = color || '#fde047';
    slot.lineWidth = 3.2;
    return true;
  }

  private spawnTwinkle(x: number, y: number, color: string): void {
    if (this.reducedMotion) return;

    let slot: ArrivalTwinkle | null = null;
    for (let i = 0; i < this.twinkles.length; i++) {
      if (!this.twinkles[i].active) {
        slot = this.twinkles[i];
        break;
      }
    }

    if (!slot) {
      let oldestRatio = -1;
      for (let i = 0; i < this.twinkles.length; i++) {
        const ratio = this.twinkles[i].life / Math.max(0.01, this.twinkles[i].maxLife);
        if (ratio > oldestRatio) {
          oldestRatio = ratio;
          slot = this.twinkles[i];
        }
      }
    }

    if (!slot) return;
    slot.active = true;
    slot.x = x;
    slot.y = y;
    slot.life = 0;
    slot.maxLife = 0.28;
    slot.size = 13;
    slot.color = color || '#fde047';
    slot.rotation = Math.PI * 0.25;
  }

  public tick(dt = 1 / 60): void {
    if (this.reducedMotion) {
      for (let i = 0; i < this.pool.length; i++) this.pool[i].active = false;
      for (let i = 0; i < this.rings.length; i++) this.rings[i].active = false;
      for (let i = 0; i < this.twinkles.length; i++) this.twinkles[i].active = false;
      return;
    }

    const safeDt = dt > 0 && Number.isFinite(dt) ? dt : 1 / 60;

    // Advance existing twinkles before flights arrive so freshly spawned twinkles render on arrival frame
    for (let i = 0; i < this.twinkles.length; i++) {
      const tw = this.twinkles[i];
      if (!tw.active) continue;
      tw.life += safeDt;
      if (tw.life >= tw.maxLife) {
        tw.active = false;
      }
    }

    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.t += safeDt / Math.max(0.05, p.duration);
      if (p.t >= 1) {
        p.t = 1;
        p.active = false;
        this.spawnTwinkle(p.targetX, p.targetY, p.color);
      }
    }

    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      if (!r.active) continue;
      r.life += safeDt;
      if (r.life >= r.maxLife) {
        r.active = false;
        continue;
      }
      const progress = r.life / r.maxLife;
      const easeOut = 1 - (1 - progress) * (1 - progress);
      r.radius = 10 + (r.maxRadius - 10) * easeOut;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    let anyActive = false;
    for (let i = 0; i < this.rings.length; i++) {
      if (this.rings[i].active) {
        anyActive = true;
        break;
      }
    }
    if (!anyActive) {
      for (let i = 0; i < this.pool.length; i++) {
        if (this.pool[i].active) {
          anyActive = true;
          break;
        }
      }
    }
    if (!anyActive) {
      for (let i = 0; i < this.twinkles.length; i++) {
        if (this.twinkles[i].active) {
          anyActive = true;
          break;
        }
      }
    }
    if (!anyActive) return;

    const canArc = typeof ctx.arc === 'function';
    const canStroke = typeof ctx.stroke === 'function';
    const canFill = typeof ctx.fill === 'function';
    const canPath = typeof ctx.moveTo === 'function' && typeof ctx.lineTo === 'function';
    const canDrawImage = typeof ctx.drawImage === 'function';

    ctx.save();

    // 1. Expanding isometric ground burst rings
    if (canArc && canStroke) {
      for (let i = 0; i < this.rings.length; i++) {
        const r = this.rings[i];
        if (!r.active) continue;
        const progress = Math.min(1, r.life / Math.max(0.01, r.maxLife));
        const alpha = (1 - progress) * (1 - progress) * 0.82;
        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.scale(1, 0.58);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = Math.max(1, r.lineWidth * (1 - progress * 0.55));
        ctx.beginPath();
        ctx.arc(0, 0, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle inner bright highlight ring
        ctx.globalAlpha = alpha * 0.55;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(2, r.radius * 0.72), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Parabolic harvest flights (with delicate golden trail dots + sprite/sheaf icon)
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      const u = Math.max(0, Math.min(1, p.t));

      // Delicate 2-dot Bézier trail
      if (canArc && canFill && u > 0.08) {
        for (let step = 1; step <= 2; step++) {
          const tu = u - step * 0.055;
          if (tu <= 0) continue;
          HarvestFlightFX.sampleQuadraticBezier(p, tu, this.posScratch);
          ctx.save();
          ctx.globalAlpha = (0.45 - step * 0.14) * (1 - u * 0.45);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(this.posScratch.x, this.posScratch.y, Math.max(1.8, 4.5 - step * 1.2), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Current icon position along quadratic Bézier curve
      HarvestFlightFX.sampleQuadraticBezier(p, u, this.posScratch);
      let scale = 1;
      if (u < 0.16) {
        scale = 0.72 + (u / 0.16) * 0.44;
      } else if (u < 0.72) {
        scale = 1.16 - ((u - 0.16) / 0.56) * 0.16;
      } else {
        scale = 1.0 - ((u - 0.72) / 0.28) * 0.68;
      }
      const alpha = u > 0.85 ? Math.max(0.2, 1 - ((u - 0.85) / 0.15) * 0.75) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(this.posScratch.x, this.posScratch.y);
      ctx.rotate(p.spin * u);
      ctx.scale(scale, scale);

      // Soft sunlit halo disc behind flying crop
      if (canArc && canFill) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.34;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.56, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (p.sprite && canDrawImage) {
        const half = p.size * 0.5;
        ctx.drawImage(p.sprite, -half, -half, p.size, p.size);
      } else if (canPath && canFill) {
        // Stylized golden-sheaf emblem fallback (zero emoji)
        const r = p.size * 0.42;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.72, -r * 0.12);
        ctx.lineTo(r * 0.38, r * 0.92);
        ctx.lineTo(-r * 0.38, r * 0.92);
        ctx.lineTo(-r * 0.72, -r * 0.12);
        if (typeof ctx.closePath === 'function') ctx.closePath();
        ctx.fill();
        if (canStroke) {
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        // Center bright grain gleam
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.58);
        ctx.lineTo(r * 0.24, 0);
        ctx.lineTo(0, r * 0.48);
        ctx.lineTo(-r * 0.24, 0);
        if (typeof ctx.closePath === 'function') ctx.closePath();
        ctx.fill();
      } else {
        const half = p.size * 0.38;
        ctx.fillStyle = p.color;
        ctx.fillRect(-half, -half, half * 2, half * 2);
      }

      ctx.restore();
    }

    // 3. Golden arrival twinkles at Barn / HUD anchor
    for (let i = 0; i < this.twinkles.length; i++) {
      const tw = this.twinkles[i];
      if (!tw.active) continue;
      const progress = Math.min(1, tw.life / Math.max(0.01, tw.maxLife));
      const pop = progress < 0.35 ? 0.55 + (progress / 0.35) * 0.65 : 1.2 - ((progress - 0.35) / 0.65) * 0.85;
      const alpha = (1 - progress) * 0.95;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(tw.x, tw.y);
      ctx.rotate(tw.rotation + progress * 0.65);
      ctx.scale(pop, pop);

      if (canPath && canFill) {
        const outer = tw.size;
        const inner = tw.size * 0.3;
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        for (let pt = 0; pt < 8; pt++) {
          const rad = pt % 2 === 0 ? outer : inner;
          const ang = (pt * Math.PI) / 4;
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (pt === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        if (typeof ctx.closePath === 'function') ctx.closePath();
        ctx.fill();

        if (canStroke) {
          ctx.strokeStyle = tw.color;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = tw.color;
        ctx.fillRect(-tw.size * 0.4, -tw.size * 0.4, tw.size * 0.8, tw.size * 0.8);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  public getActiveFlightCount(): number {
    let count = 0;
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }

  public getActiveRingCount(): number {
    let count = 0;
    for (let i = 0; i < this.rings.length; i++) {
      if (this.rings[i].active) count++;
    }
    return count;
  }

  public getActiveTwinkleCount(): number {
    let count = 0;
    for (let i = 0; i < this.twinkles.length; i++) {
      if (this.twinkles[i].active) count++;
    }
    return count;
  }
}

export const MicroFX = {
  /**
   * Returns a bouncy overshoot scale factor for an event at progress t in [0, 1].
   * Starts at 1.0, peaks around t=0.25 at ~1.25, and settles back to 1.0.
   */
  pulseScale(t: number, maxBounce = 0.25): number {
    if (t <= 0 || t >= 1) return 1;
    return 1 + Math.sin(t * Math.PI * 2.5) * Math.exp(-t * 3.5) * maxBounce;
  },

  /**
   * Renders a glossy diagonal highlight shimmer across a progress bar bounding box.
   */
  progressBarShimmer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number,
    highlightColor = 'rgba(255, 255, 255, 0.45)'
  ): void {
    if (w <= 0 || h <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    const bandWidth = Math.max(16, w * 0.35);
    const phase = ((t % 1) + 1) % 1;
    const startX = x - bandWidth + phase * (w + bandWidth * 2);

    const grad = ctx.createLinearGradient(startX, y, startX + bandWidth, y + h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, highlightColor);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(startX, y, bandWidth, h);
    ctx.restore();
  },
};

export class JuiceFX {
  public screenShake: ScreenShake;
  public flash: FlashFX;
  public confetti: ConfettiFX;
  public readonly flights: HarvestFlightFX;
  public micro = MicroFX;
  private reducedMotion = false;

  constructor(options?: JuiceFXOptions) {
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.reducedMotion = options?.reducedMotion ?? prefersReduced ?? false;
    this.screenShake = new ScreenShake(0.9, this.reducedMotion);
    this.flash = new FlashFX();
    this.confetti = new ConfettiFX(100, this.reducedMotion);
    this.flights = new HarvestFlightFX(40, 16, this.reducedMotion);
  }

  public setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.screenShake.reducedMotion = reduced;
    this.confetti.reducedMotion = reduced;
    this.flights.reducedMotion = reduced;
  }

  public isReducedMotion(): boolean {
    return this.reducedMotion;
  }

  public addShake(intensity: number): void {
    this.screenShake.add(intensity);
  }

  public addFlash(color: string, alpha: number, durationMs = 350): void {
    this.flash.trigger(color, alpha, durationMs);
  }

  public emitConfetti(x: number, y: number, count = 25, emojis?: string[]): void {
    void emojis; // HPVN: no emoji (owner 14/11) — confetti is the coloured paper only
    this.confetti.emit(x, y, count);
  }

  /**
   * Launches staggered parabolic harvest icons from plot (fromX, fromY) to HUD/Barn anchor (toX, toY),
   * paired with a gentle zero-shake wheat/leaf pop at the source plot.
   */
  public spawnHarvestFlight(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    sprite?: CanvasImageSource | null,
    color = '#fde047',
    count = 2
  ): number {
    if (this.reducedMotion) return 0;
    const launched = this.flights.spawn(fromX, fromY, toX, toY, sprite, color, count);
    if (launched > 0) {
      this.confetti.emitLeafPop(fromX, fromY, Math.min(6, Math.max(3, launched * 3)), color);
    }
    return launched;
  }

  /**
   * Spawns a pooled expanding golden/emerald ground ripple at a harvested, watered, or sown plot.
   */
  public spawnHarvestBurstRing(x: number, y: number, color = '#fde047'): void {
    if (this.reducedMotion) return;
    this.flights.spawnRing(x, y, color);
  }

  public tick(dt = 1 / 60): void {
    this.screenShake.tick(dt);
    this.flash.tick(dt);
    this.confetti.tick(dt);
    this.flights.tick(dt);
  }

  public getShakeOffset(): ShakeOffset {
    return this.screenShake.offset;
  }

  /**
   * Applies post-processing overlay juice effects to the canvas:
   * Translates context for screen-shake (via save/restore),
   * renders full-screen flash, active confetti particles, burst rings, and parabolic harvest flights.
   */
  public applyTo(ctx: CanvasRenderingContext2D, width?: number, height?: number): void {
    const w = width ?? ctx.canvas?.width ?? 1200;
    const h = height ?? ctx.canvas?.height ?? 800;

    ctx.save();
    const offset = this.screenShake.offset;
    if (!this.reducedMotion && (offset.x !== 0 || offset.y !== 0)) {
      ctx.translate(offset.x, offset.y);
    }

    this.flash.draw(ctx, w, h);
    this.confetti.draw(ctx);
    this.flights.draw(ctx);
    ctx.restore();
  }
}
