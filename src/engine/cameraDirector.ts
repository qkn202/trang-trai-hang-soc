import { Camera, worldIso } from './isometric';

export interface CameraPanOptions {
  targetZoom?: number;
  durationMs?: number;
  reducedMotion?: boolean;
  yOffsetPx?: number;
}

interface ActivePanState {
  fromX: number;
  fromY: number;
  fromZoom: number;
  toX: number;
  toY: number;
  toZoom: number;
  elapsedSec: number;
  durationSec: number;
}

/** Smooth cubic ease-out camera director for ribbon unveil, zone unlock, and active build focus. */
export class CameraDirector {
  private activePan: ActivePanState | null = null;

  public get isActive(): boolean {
    return this.activePan !== null;
  }

  public cancel(): void {
    this.activePan = null;
  }

  public panToGrid(cam: Camera, gx: number, gy: number, opts?: CameraPanOptions): void {
    const iso = worldIso(gx, gy, cam.viewRot ?? 0);
    const toX = iso.wx;
    const toY = iso.wy + (opts?.yOffsetPx ?? 0);
    const toZoom =
      typeof opts?.targetZoom === 'number'
        ? Math.max(0.32, Math.min(2.15, opts.targetZoom))
        : cam.zoom;
    const durationMs = opts?.durationMs ?? 520;

    if (opts?.reducedMotion || durationMs <= 0) {
      cam.x = toX;
      cam.y = toY;
      cam.zoom = toZoom;
      this.activePan = null;
      return;
    }

    this.activePan = {
      fromX: cam.x,
      fromY: cam.y,
      fromZoom: cam.zoom,
      toX,
      toY,
      toZoom,
      elapsedSec: 0,
      durationSec: Math.max(0.05, durationMs / 1000),
    };
  }

  public update(cam: Camera, dtSec: number): boolean {
    const pan = this.activePan;
    if (!pan) return false;

    const safeDt = Math.max(0, Math.min(0.1, dtSec));
    pan.elapsedSec += safeDt;
    const rawT = Math.min(1, pan.elapsedSec / pan.durationSec);
    const done = rawT >= 0.9999;
    const t = done ? 1 : rawT;
    const ease = 1 - Math.pow(1 - t, 3);

    cam.x = pan.fromX + (pan.toX - pan.fromX) * ease;
    cam.y = pan.fromY + (pan.toY - pan.fromY) * ease;
    cam.zoom = pan.fromZoom + (pan.toZoom - pan.fromZoom) * ease;

    if (done) {
      this.activePan = null;
    }
    return true;
  }
}
