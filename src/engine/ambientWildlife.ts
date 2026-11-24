import { getCatalogItem } from '../data/catalog';
import { ParkSimulation } from '../sim/simulation';
import { Camera, ELEV_PX, gridToScreen } from './isometric';

export interface AmbientOwlFlyby {
  startedAt: number;
  durationMs: number;
  startYRatio: number;
  endYRatio: number;
  fromLeft: boolean;
}

let activeOwlFlyby: AmbientOwlFlyby | null = null;
let cachedWaterSamplePoints: Array<{ gx: number; gy: number }> | null = null;
let cachedWaterSampleRev = -1;

/**
 * Gọi khi người chơi vừa giao thành công Đơn Hàng Cú hoặc nhận thư bạn bè
 * để thả một chú cú đưa thư bay lướt chéo bầu trời thung lũng.
 */
export function triggerAmbientOwlFlyby(nowMs = Date.now()): void {
  const fromLeft = Math.floor(nowMs / 100) % 2 === 0;
  activeOwlFlyby = {
    startedAt: nowMs,
    durationMs: 3600,
    startYRatio: 0.22 + ((nowMs % 7) * 0.025),
    endYRatio: 0.14 + (((nowMs >> 3) % 6) * 0.025),
    fromLeft,
  };
}

export function getActiveAmbientOwlFlyby(nowMs = Date.now()): AmbientOwlFlyby | null {
  if (!activeOwlFlyby) return null;
  if (nowMs - activeOwlFlyby.startedAt > activeOwlFlyby.durationMs) {
    activeOwlFlyby = null;
    return null;
  }
  return activeOwlFlyby;
}

function getRiverSamplePoints(sim: ParkSimulation): Array<{ gx: number; gy: number }> {
  const rev = sim.stateRevision ?? 0;
  if (cachedWaterSamplePoints && cachedWaterSampleRev === rev) {
    return cachedWaterSamplePoints;
  }
  const pts: Array<{ gx: number; gy: number }> = [];
  for (let gy = 8; gy < sim.grid.length - 8; gy += 4) {
    const row = sim.grid[gy];
    if (!row) continue;
    for (let gx = 8; gx < row.length - 8; gx += 5) {
      if (row[gx]?.terrain === 'water') {
        pts.push({ gx: gx + 0.5, gy: gy + 0.5 });
        if (pts.length >= 12) break;
      }
    }
    if (pts.length >= 12) break;
  }
  cachedWaterSamplePoints = pts;
  cachedWaterSampleRev = rev;
  return pts;
}

const BUTTERFLY_PALETTE = ['#fde047', '#f9a8d4', '#93c5fd', '#fdba74', '#d8b4fe', '#fef08a'];

/**
 * Lớp sinh vật tự nhiên sống động 60fps (zero per-frame allocations):
 *  - Bướm pastel bay lượn quanh vườn hoa & ruộng chín vào ban ngày
 *  - Đàn chim 3 con lướt chéo thung lũng kèm bóng đổ mềm
 *  - Vòng sóng cá quẫy nhẹ trên mặt sông Ottery
 *  - Cú đưa thư bay ngang bầu trời khi vừa giao Đơn Hàng Cú
 */
export function drawAmbientWildlifeOverlay(
  ctx: CanvasRenderingContext2D,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  nowMs: number,
  isNight: boolean
): void {
  const weather = sim.getCurrentWeather(nowMs).kind;
  const isWinterMap =
    typeof sim.isWinterMainMapActive === 'function' && sim.isWinterMainMapActive();
  const isStormOrSnow = weather === 'storm' || weather === 'rain' || weather === 'snow';
  const tSec = nowMs * 0.001;

  // 1. River fish ripples (subtle expanding rings on Ottery river tiles)
  const riverPts = getRiverSamplePoints(sim);
  if (riverPts.length > 0) {
    ctx.save();
    for (let i = 0; i < Math.min(3, riverPts.length); i++) {
      const cycle = (tSec * 0.24 + i * 0.37) % 1;
      if (cycle > 0.72) continue;
      const pIdx = (Math.floor(tSec * 0.24 + i * 0.37) * 5 + i * 3) % riverPts.length;
      const rp = riverPts[pIdx];
      const sp = gridToScreen(rp.gx, rp.gy, cam, viewW, viewH, 0);
      if (sp.sx < -40 || sp.sx > viewW + 40 || sp.sy < -40 || sp.sy > viewH + 40) continue;
      const prog = cycle / 0.72;
      const rx = (3.5 + prog * 15) * cam.zoom;
      const ry = rx * 0.48;
      const alpha = (1 - prog) * (isNight ? 0.28 : 0.42);
      ctx.strokeStyle = isNight
        ? `rgba(186, 230, 253, ${alpha.toFixed(3)})`
        : `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(1, 1.3 * cam.zoom);
      ctx.beginPath();
      ctx.ellipse(sp.sx, sp.sy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Pastel butterflies fluttering around flowers & ripe plots in calm non-winter daylight
  if (!isNight && !isStormOrSnow && !isWinterMap) {
    let drawnButterflies = 0;
    ctx.save();
    for (let i = 0; i < sim.state.buildings.length && drawnButterflies < 6; i++) {
      const b = sim.state.buildings[i];
      if (nowMs < b.constructEndsAt || b.awaitingUnveil) continue;
      const isFlower = b.itemId === 'burrow_flower_garden';
      const isRipeCrop = Boolean(b.cropId && b.cropReadyAt && nowMs >= b.cropReadyAt);
      if (!isFlower && !isRipeCrop) continue;
      const item = getCatalogItem(b.itemId);
      if (!item) continue;

      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const orbitA = tSec * (1.15 + (drawnButterflies % 3) * 0.22) + b.gx * 1.7 + b.gy * 0.9;
      const gx = b.gx + 0.5 + Math.cos(orbitA) * 0.48;
      const gy = b.gy + 0.5 + Math.sin(orbitA * 1.3) * 0.42;
      const bobPx = 14 + Math.sin(orbitA * 2.4) * 5;
      const pt = gridToScreen(gx, gy, cam, viewW, viewH, elev * ELEV_PX + bobPx);
      if (pt.sx < -30 || pt.sx > viewW + 30 || pt.sy < -30 || pt.sy > viewH + 30) continue;

      const flap = Math.abs(Math.sin(tSec * 14 + drawnButterflies * 1.3));
      const wingW = (2.6 + flap * 3.1) * Math.max(0.65, cam.zoom);
      const wingH = 3.2 * Math.max(0.65, cam.zoom);
      const color = BUTTERFLY_PALETTE[drawnButterflies % BUTTERFLY_PALETTE.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(pt.sx - wingW * 0.55, pt.sy, wingW, wingH, -0.35, 0, Math.PI * 2);
      ctx.ellipse(pt.sx + wingW * 0.55, pt.sy, wingW, wingH, 0.35, 0, Math.PI * 2);
      ctx.fill();
      drawnButterflies++;
    }
    ctx.restore();
  }

  // 3. Gliding 3-bird flock crossing the valley every ~22s (calm daylight/dusk)
  if (!isNight && !isStormOrSnow) {
    const flockPeriod = 22;
    const flockPhase = (tSec % flockPeriod) / 9.5;
    if (flockPhase >= 0 && flockPhase <= 1) {
      const baseX = -60 + flockPhase * (viewW + 120);
      const baseY = viewH * 0.2 + Math.sin(flockPhase * Math.PI * 1.4) * 28;
      ctx.save();
      for (let bIdx = 0; bIdx < 3; bIdx++) {
        const bx = baseX - bIdx * 22;
        const by = baseY + (bIdx === 1 ? -11 : bIdx === 2 ? 12 : 0);
        const flapY = Math.sin(tSec * 7.5 + bIdx * 1.1) * 4.2;

        // Soft bird shadow drifting across ground below
        ctx.fillStyle = 'rgba(42, 26, 14, 0.11)';
        ctx.beginPath();
        ctx.ellipse(bx + 18, by + 56, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stylized cozy V-wing silhouette
        ctx.strokeStyle = 'rgba(74, 44, 22, 0.78)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx - 7, by + flapY);
        ctx.quadraticCurveTo(bx - 3, by - 3.5, bx, by);
        ctx.quadraticCurveTo(bx + 3, by - 3.5, bx + 7, by + flapY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // 4. Owl Post delivery flyby triggered on fulfilled Owl Orders
  const flyby = getActiveAmbientOwlFlyby(nowMs);
  if (flyby) {
    const prog = Math.max(0, Math.min(1, (nowMs - flyby.startedAt) / flyby.durationMs));
    const sx = flyby.fromLeft
      ? -50 + prog * (viewW + 100)
      : viewW + 50 - prog * (viewW + 100);
    const sy =
      viewH * (flyby.startYRatio + (flyby.endYRatio - flyby.startYRatio) * prog) -
      Math.sin(prog * Math.PI) * 38;
    const wingBeat = Math.sin(nowMs * 0.018) * 7;

    ctx.save();
    // Trailing golden letter sparkles
    for (let s = 1; s <= 4; s++) {
      const dir = flyby.fromLeft ? -1 : 1;
      const spX = sx + dir * s * 14;
      const spY = sy + Math.sin(nowMs * 0.01 + s) * 4 + s * 1.6;
      const sa = Math.max(0, 0.72 - s * 0.15) * Math.sin(prog * Math.PI);
      ctx.fillStyle = `rgba(253, 224, 71, ${sa.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(spX, spY, 3 - s * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    // Owl silhouette + tiny parchment scroll under talons
    ctx.translate(sx, sy);
    if (!flyby.fromLeft) ctx.scale(-1, 1);
    ctx.strokeStyle = '#78350f';
    ctx.fillStyle = '#fef3c7';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, wingBeat);
    ctx.quadraticCurveTo(-6, -8, 0, -2);
    ctx.quadraticCurveTo(6, -8, 14, wingBeat);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 1, 6.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Little envelope scroll
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(-3.5, 4.5, 7, 4.2);
    ctx.restore();
  }
}
