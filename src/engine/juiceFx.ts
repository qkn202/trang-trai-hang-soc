/**
 * JuiceFX - High-performance canvas juice & micro-animations module.
 * Pure Canvas 2D, zero DOM overhead, zero garbage collection churn.
 *
 * Capabilities:
 * - ScreenShake: Dual-frequency organic sin-noise with exponential frame decay (0.9/frame)
 * - FlashFX: Full-screen color flash overlay with quadratic fade-out
 * - ConfettiFX: Pre-allocated pool of 100 particles for milestone bursts & celebrations
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
  '#f59e0b', // Golden Galleon
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
  }

  public setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.screenShake.reducedMotion = reduced;
    this.confetti.reducedMotion = reduced;
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
    this.confetti.emit(x, y, count, emojis);
  }

  public tick(dt = 1 / 60): void {
    this.screenShake.tick(dt);
    this.flash.tick(dt);
    this.confetti.tick(dt);
  }

  public getShakeOffset(): ShakeOffset {
    return this.screenShake.offset;
  }

  /**
   * Applies post-processing overlay juice effects to the canvas:
   * Translates context for screen-shake (via save/restore),
   * renders full-screen flash and active confetti particles.
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
    ctx.restore();
  }
}
