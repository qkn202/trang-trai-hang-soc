import { FARM_CROPS, FARM_GOODS, getCatalogItem, getFarmItemMeta } from '../data/catalog';
import { GRID_SIZE } from '../data/zones';
import type { ParkSimulation } from '../sim/simulation';
import type { FarmCropId, FarmVisitorOffer } from '../types/game';
import { Camera, ELEV_PX, gridToScreen, TILE_H } from './isometric';
import type { IsometricRenderer } from './renderer';
import type { SpriteSource } from './spriteLoader';

export interface HayDaySwipeTrailPoint {
  sx: number;
  sy: number;
  at: number;
}

export interface HayDaySwipeVisualState {
  active: boolean;
  tool: 'sickle' | 'water' | 'seed';
  cropId?: FarmCropId | null;
  x: number;
  y: number;
  points: HayDaySwipeTrailPoint[];
  comboCount: number;
}

interface CourtyardAnchor {
  gx: number;
  gy: number;
}

interface VisitorVisualProfile {
  idleKey?: string;
  walkKey?: string;
  shortLabel: string;
  accentColor: string;
  initial: string;
  tall?: boolean;
}

const FONT_FAMILY = '"Be Vietnam Pro", sans-serif';
const MAX_VISIBLE_SHIMMER_PLOTS = 36;
const SWIPE_TRAIL_MAX_AGE_MS = 260;

// Isometric courtyard offsets relative to the Roadside Stand anchor (ax, ay).
// Chosen along the screen-horizontal (+gx, -gy) axis so Stand awning, Mailbox flag,
// and both tall Visitor speech bubbles + click hotspots have >= 30px clear air at zoom 0.78..1.2.
const MAILBOX_OFFSET = { dx: 1.75, dy: -0.55 } as const;
const VISITOR_SLOT_OFFSETS: ReadonlyArray<{
  destDx: number;
  destDy: number;
  startDx: number;
  startDy: number;
}> = [
  { destDx: -1.35, destDy: 1.75, startDx: -2.55, startDy: 3.05 },
  { destDx: 3.7, destDy: -0.95, startDx: 2.4, startDy: 1.35 },
];

// ============================================================================
// SAFE CANVAS 2D HELPERS (works on browser & lightweight headless test mocks)
// ============================================================================

function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rad = Math.max(0, Math.min(r, w * 0.5, h * 0.5));
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, rad);
    return;
  }
  if (typeof ctx.arcTo === 'function' && rad > 0.01) {
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
    return;
  }
  if (typeof ctx.rect === 'function') {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

function safeEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation = 0,
  startAngle = 0,
  endAngle = Math.PI * 2
): void {
  if (typeof ctx.ellipse === 'function') {
    ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rotation, startAngle, endAngle);
    return;
  }
  ctx.arc(x, y, Math.max(0.5, (rx + ry) * 0.5), startAngle, endAngle);
}

function safeQuadCurveTo(
  ctx: CanvasRenderingContext2D,
  cpx: number,
  cpy: number,
  x: number,
  y: number
): void {
  if (typeof ctx.quadraticCurveTo === 'function') {
    ctx.quadraticCurveTo(cpx, cpy, x, y);
    return;
  }
  ctx.lineTo(x, y);
}

function safeMeasureTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  approxCharPx: number
): number {
  const measured = ctx.measureText?.(text);
  if (measured && typeof measured.width === 'number' && Number.isFinite(measured.width)) {
    return measured.width;
  }
  return text.length * approxCharPx;
}

function safeLinearGrad(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: ReadonlyArray<readonly [number, string]>,
  fallback: string
): string | CanvasGradient {
  if (typeof ctx.createLinearGradient !== 'function') return fallback;
  try {
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    return grad;
  } catch {
    return fallback;
  }
}

function safeRadialGlow(
  self: IsometricRenderer,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
): void {
  if (typeof self.drawRadialGlow === 'function') {
    self.drawRadialGlow(x, y, r, color);
    return;
  }
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(2, r * 0.6), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function safeGetSprite(self: IsometricRenderer, key?: string): SpriteSource | undefined {
  if (!key || !self.sprites || typeof self.sprites.get !== 'function') return undefined;
  return self.sprites.get(key);
}

function drawFourPointSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string
): void {
  const inner = radius * 0.28;
  ctx.save();
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx + inner, cy - inner);
  ctx.lineTo(cx + radius, cy);
  ctx.lineTo(cx + inner, cy + inner);
  ctx.lineTo(cx, cy + radius);
  ctx.lineTo(cx - inner, cy + inner);
  ctx.lineTo(cx - radius, cy);
  ctx.lineTo(cx - inner, cy - inner);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFivePointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  fill: string,
  stroke: string,
  lineWidth: number
): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI * 0.5 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawCheckmarkPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.6, size * 0.24);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.36, cy + size * 0.02);
  ctx.lineTo(cx - size * 0.08, cy + size * 0.3);
  ctx.lineTo(cx + size * 0.38, cy - size * 0.28);
  ctx.stroke();
  ctx.restore();
}

function drawMiniNewspaperIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number
): void {
  ctx.save();
  const x = cx - w * 0.5;
  const y = cy - h * 0.5;
  // Parchment page
  ctx.fillStyle = '#fef6e4';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = Math.max(1.1, w * 0.1);
  ctx.beginPath();
  safeRoundRect(ctx, x, y, w, h, Math.max(1.5, w * 0.14));
  ctx.fill();
  ctx.stroke();
  // Daily Prophet masthead bar
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(x + w * 0.14, y + h * 0.15, w * 0.72, h * 0.2);
  // Headline ink lines
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w * 0.14, y + h * 0.46, w * 0.44, Math.max(1, h * 0.11));
  ctx.fillRect(x + w * 0.14, y + h * 0.66, w * 0.7, Math.max(1, h * 0.11));
  // Tiny portrait box
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x + w * 0.64, y + h * 0.44, w * 0.22, h * 0.16);
  ctx.restore();
}

// ============================================================================
// ANCHOR & GRID HELPERS
// ============================================================================

function getElevAt(sim: ParkSimulation, gx: number, gy: number): number {
  const ix = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(gx)));
  const iy = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(gy)));
  return sim.grid?.[iy]?.[ix]?.elevation ?? 0;
}

function isPointBlocked(sim: ParkSimulation, gx: number, gy: number): boolean {
  const ix = Math.floor(gx);
  const iy = Math.floor(gy);
  if (ix < 1 || iy < 1 || ix >= GRID_SIZE - 1 || iy >= GRID_SIZE - 1) return true;
  if (sim.grid?.[iy]?.[ix]?.terrain === 'water') return true;
  const buildings = sim.state?.buildings ?? [];
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    const item = getCatalogItem(b.itemId);
    const fp =
      item && typeof sim.getBuildingFootprint === 'function'
        ? sim.getBuildingFootprint(item, b.rotation)
        : { bw: item?.width ?? 2, bh: item?.height ?? 2 };
    if (gx >= b.gx - 0.4 && gx <= b.gx + fp.bw + 0.4 && gy >= b.gy - 0.4 && gy <= b.gy + fp.bh + 0.4) {
      return true;
    }
  }
  return false;
}

function clampCourtyardCoord(gx: number, gy: number): CourtyardAnchor {
  return {
    gx: Math.max(7.8, Math.min(GRID_SIZE - 6, gx)),
    gy: Math.max(13.5, Math.min(GRID_SIZE - 6, gy)),
  };
}

function isCourtyardLayoutClear(sim: ParkSimulation, cand: CourtyardAnchor): boolean {
  if (isPointBlocked(sim, cand.gx, cand.gy)) return false;
  if (isPointBlocked(sim, cand.gx + MAILBOX_OFFSET.dx, cand.gy + MAILBOX_OFFSET.dy)) return false;
  for (const slot of VISITOR_SLOT_OFFSETS) {
    if (isPointBlocked(sim, cand.gx + slot.destDx, cand.gy + slot.destDy)) return false;
  }
  return true;
}

function resolveCourtyardAnchor(sim: ParkSimulation): CourtyardAnchor {
  const buildings = sim.state?.buildings ?? [];
  const burrow = buildings.find(
    (b) => b.itemId === 'burrow_house_canon' || b.itemId === 'weasley_burrow'
  );
  if (burrow) {
    const item = getCatalogItem(burrow.itemId);
    const fp =
      item && typeof sim.getBuildingFootprint === 'function'
        ? sim.getBuildingFootprint(item, burrow.rotation)
        : { bw: item?.width ?? 3, bh: item?.height ?? 3 };
    const burrowCandidates: ReadonlyArray<CourtyardAnchor> = [
      clampCourtyardCoord(burrow.gx - 2.3, burrow.gy + fp.bh + 1.4),
      clampCourtyardCoord(burrow.gx + 0.4, burrow.gy + fp.bh + 1.8),
      clampCourtyardCoord(burrow.gx - 2.3, burrow.gy + fp.bh + 0.7),
    ];
    for (const cand of burrowCandidates) {
      if (isCourtyardLayoutClear(sim, cand)) return cand;
    }
    for (const cand of burrowCandidates) {
      if (!isPointBlocked(sim, cand.gx, cand.gy)) return cand;
    }
    return burrowCandidates[0];
  }

  // Starter Lv.1 valley has open sunlit meadow north of the entrance road (gy = 23),
  // clear of Owl Post (16.5, 23.5), starter pastures (12..15, 25..26), and wheat plots (17..20, 25..26).
  const candidates: ReadonlyArray<CourtyardAnchor> = [
    { gx: 13.9, gy: 20.6 },
    { gx: 15.5, gy: 28.8 },
    { gx: 15.5, gy: 25.5 },
  ];
  for (const cand of candidates) {
    if (isCourtyardLayoutClear(sim, cand)) {
      return cand;
    }
  }
  for (const cand of candidates) {
    if (
      !isPointBlocked(sim, cand.gx, cand.gy) &&
      !isPointBlocked(sim, cand.gx + MAILBOX_OFFSET.dx, cand.gy + MAILBOX_OFFSET.dy)
    ) {
      return cand;
    }
  }
  return { gx: 15.5, gy: 25.5 };
}

function isOnScreen(
  sx: number,
  sy: number,
  viewW: number,
  viewH: number,
  margin: number
): boolean {
  return sx >= -margin && sx <= viewW + margin && sy >= -margin && sy <= viewH + margin;
}

// ============================================================================
// A. ROADSIDE STAND STALL (Quầy Sạp Đầu Ngõ)
// ============================================================================

function drawRoadsideStandStall(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number,
  isNight: boolean,
  anchor: CourtyardAnchor
): void {
  const z = cam.zoom;
  const elev = getElevAt(sim, anchor.gx, anchor.gy);
  const pt = gridToScreen(anchor.gx, anchor.gy, cam, viewW, viewH, elev * ELEV_PX);

  self.hotspots.push({
    kind: 'hayday_stand',
    id: 'hayday_roadside_stand',
    sx: pt.sx,
    sy: pt.sy - 20 * z,
    radius: Math.max(26, 32 * z),
    priority: 26,
  });

  if (!isOnScreen(pt.sx, pt.sy, viewW, viewH, 130)) return;

  const ctx = self.ctx;
  const stand = typeof sim.ensureRoadsideStand === 'function' ? sim.ensureRoadsideStand() : null;
  const listedSlots = (stand?.slots ?? []).filter((s) => Boolean(s && s.itemId));
  const soldSlots = listedSlots.filter((s) => Boolean(s.soldAt));
  const hasAdvertisedActive = listedSlots.some((s) => Boolean(s.advertised) && !s.soldAt);
  const totalSoldSickle = soldSlots.reduce((acc, s) => acc + s.qty * s.unitPrice, 0);

  const w = 68 * z;
  const h = 50 * z;
  const baseX = pt.sx;
  const baseY = pt.sy;
  const counterTopY = baseY - h * 0.36;
  const awningTopY = baseY - h * 1.02;
  const awningBotY = baseY - h * 0.68;

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Warm ambient occlusion ground shadow
  ctx.fillStyle = isNight ? 'rgba(8, 13, 24, 0.48)' : 'rgba(32, 54, 18, 0.34)';
  ctx.beginPath();
  safeEllipse(ctx, baseX, baseY + 3 * z, w * 0.58, w * 0.23, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle cozy stone/timber mat under stand feet
  ctx.fillStyle = isNight ? 'rgba(104, 72, 42, 0.55)' : 'rgba(182, 132, 74, 0.42)';
  ctx.beginPath();
  safeEllipse(ctx, baseX, baseY + 1.5 * z, w * 0.48, w * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Vertical timber posts supporting the awning
  const postW = Math.max(3.4, 5.2 * z);
  const leftPostX = baseX - w * 0.41;
  const rightPostX = baseX + w * 0.41 - postW;
  const postGrad = safeLinearGrad(
    ctx,
    leftPostX,
    awningBotY,
    leftPostX + postW,
    awningBotY,
    [
      [0, '#a35d2b'],
      [0.55, '#7c3f18'],
      [1, '#582a0e'],
    ],
    '#7c3f18'
  );
  ctx.fillStyle = postGrad;
  ctx.strokeStyle = '#3f1e0a';
  ctx.lineWidth = Math.max(1.2, 1.6 * z);
  for (const px of [leftPostX, rightPostX]) {
    ctx.beginPath();
    safeRoundRect(ctx, px, awningBotY - 2 * z, postW, baseY - awningBotY + 3 * z, 1.6 * z);
    ctx.fill();
    ctx.stroke();
  }

  // Night warm lantern glow tucked beneath canopy
  if (isNight) {
    safeRadialGlow(self, ctx, baseX, counterTopY - 4 * z, w * 0.62, 'rgba(251, 191, 36, 0.44)');
  }

  // 3. Wooden counter skirt (slatted crate front) + honey-oak counter shelf
  const skirtX = baseX - w * 0.44;
  const skirtW = w * 0.88;
  const skirtH = baseY - counterTopY + 1 * z;
  ctx.fillStyle = safeLinearGrad(
    ctx,
    skirtX,
    counterTopY,
    skirtX,
    baseY,
    [
      [0, '#b96f35'],
      [1, '#8a4a1c'],
    ],
    '#a35d2b'
  );
  ctx.strokeStyle = '#47220b';
  ctx.lineWidth = Math.max(1.3, 1.7 * z);
  ctx.beginPath();
  safeRoundRect(ctx, skirtX, counterTopY, skirtW, skirtH, 3 * z);
  ctx.fill();
  ctx.stroke();

  // Plank slat dividers on front skirt
  ctx.strokeStyle = 'rgba(63, 30, 10, 0.45)';
  ctx.lineWidth = Math.max(0.9, 1.1 * z);
  for (let i = 1; i <= 4; i++) {
    const sx = skirtX + (skirtW * i) / 5;
    ctx.beginPath();
    ctx.moveTo(sx, counterTopY + 4 * z);
    ctx.lineTo(sx, baseY - 1.5 * z);
    ctx.stroke();
  }

  // Counter shelf tabletop (beveled warm oak plank overhanging slightly)
  const shelfX = baseX - w * 0.48;
  const shelfW = w * 0.96;
  const shelfH = Math.max(5.5, 8.2 * z);
  ctx.fillStyle = safeLinearGrad(
    ctx,
    shelfX,
    counterTopY - shelfH * 0.55,
    shelfX,
    counterTopY + shelfH * 0.45,
    [
      [0, '#f3c785'],
      [0.55, '#da9a52'],
      [1, '#b16b2d'],
    ],
    '#da9a52'
  );
  ctx.strokeStyle = '#47220b';
  ctx.lineWidth = Math.max(1.3, 1.7 * z);
  ctx.beginPath();
  safeRoundRect(ctx, shelfX, counterTopY - shelfH * 0.55, shelfW, shelfH, 2.5 * z);
  ctx.fill();
  ctx.stroke();

  // 4. Up to 4 mini-sprites of listed items displayed on the wooden counter
  const shownSlots = listedSlots.slice(0, 4);
  if (shownSlots.length > 0) {
    const slotSpan = shelfW * 0.78;
    const itemSz = Math.max(12, Math.min(18, 16 * z));
    for (let i = 0; i < shownSlots.length; i++) {
      const slot = shownSlots[i];
      const frac = shownSlots.length === 1 ? 0.5 : i / (shownSlots.length - 1);
      const ix = baseX - slotSpan * 0.5 + frac * slotSpan;
      const iy = counterTopY - shelfH * 0.42;

      // Tiny wooden crate shadow
      ctx.fillStyle = 'rgba(54, 26, 8, 0.28)';
      ctx.beginPath();
      safeEllipse(ctx, ix, iy + 0.5 * z, itemSz * 0.38, itemSz * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      if (slot.soldAt) {
        const coinSp = safeGetSprite(self, 'ui_icon_golden_sickle');
        if (coinSp) {
          ctx.drawImage(coinSp, ix - itemSz * 0.46, iy - itemSz * 0.9, itemSz * 0.92, itemSz * 0.92);
        } else {
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(ix, iy - itemSz * 0.42, itemSz * 0.34, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      } else if (slot.itemId) {
        const meta = getFarmItemMeta(slot.itemId);
        const sp = safeGetSprite(self, meta.iconKey);
        if (sp) {
          ctx.drawImage(sp, ix - itemSz * 0.5, iy - itemSz * 0.96, itemSz, itemSz);
        } else {
          ctx.fillStyle = '#fde68a';
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(ix, iy - itemSz * 0.45, itemSz * 0.34, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  } else {
    // Cozy empty woven display baskets so the stand feels warm & lived-in even before listing
    for (const dir of [-1, 1] as const) {
      const bx = baseX + dir * w * 0.18;
      const by = counterTopY - shelfH * 0.46;
      const bw = 12 * z;
      const bh = 6.5 * z;
      ctx.fillStyle = '#c88c44';
      ctx.strokeStyle = '#5c3010';
      ctx.lineWidth = Math.max(1, 1.3 * z);
      ctx.beginPath();
      safeRoundRect(ctx, bx - bw * 0.5, by - bh, bw, bh, 2.2 * z);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#f5d491';
      ctx.lineWidth = Math.max(0.8, 1 * z);
      ctx.beginPath();
      ctx.moveTo(bx - bw * 0.38, by - bh * 0.48);
      ctx.lineTo(bx + bw * 0.38, by - bh * 0.48);
      ctx.stroke();
    }
  }

  // 5. Red-and-cream striped Hay Day awning canopy with scalloped valance
  const stripes = 6;
  const topLeftX = baseX - w * 0.44;
  const topW = w * 0.88;
  const botLeftX = baseX - w * 0.54;
  const botW = w * 1.08;
  const scallopR = (botW / stripes) * 0.5;

  // Soft shadow cast by awning onto posts/counter
  ctx.fillStyle = 'rgba(42, 18, 6, 0.22)';
  ctx.fillRect(botLeftX + 3 * z, awningBotY, botW - 6 * z, 4.5 * z);

  for (let i = 0; i < stripes; i++) {
    const t0 = i / stripes;
    const t1 = (i + 1) / stripes;
    const isRed = i % 2 === 0;
    const xTop0 = topLeftX + topW * t0;
    const xTop1 = topLeftX + topW * t1;
    const xBot0 = botLeftX + botW * t0;
    const xBot1 = botLeftX + botW * t1;

    ctx.fillStyle = isRed ? '#cb302b' : '#fff6e2';
    ctx.beginPath();
    ctx.moveTo(xTop0, awningTopY);
    ctx.lineTo(xTop1, awningTopY);
    ctx.lineTo(xBot1, awningBotY);
    ctx.arc((xBot0 + xBot1) * 0.5, awningBotY, scallopR, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Crisp seam between awning stripes
    ctx.strokeStyle = isRed ? 'rgba(96, 20, 16, 0.45)' : 'rgba(138, 86, 40, 0.35)';
    ctx.lineWidth = Math.max(0.8, 1 * z);
    ctx.stroke();
  }

  // Outer dark-brown storybook outline around the entire awning silhouette
  ctx.strokeStyle = '#4a1d0c';
  ctx.lineWidth = Math.max(1.6, 2.1 * z);
  ctx.beginPath();
  ctx.moveTo(topLeftX, awningTopY);
  ctx.lineTo(topLeftX + topW, awningTopY);
  ctx.lineTo(botLeftX + botW, awningBotY);
  for (let i = stripes - 1; i >= 0; i--) {
    const cx = botLeftX + (i + 0.5) * (botW / stripes);
    ctx.arc(cx, awningBotY, scallopR, 0, Math.PI, false);
  }
  ctx.closePath();
  ctx.stroke();

  // Warm sunlit wood ridge beam capping the awning top
  ctx.fillStyle = '#8b471b';
  ctx.strokeStyle = '#3f1e0a';
  ctx.lineWidth = Math.max(1.1, 1.4 * z);
  ctx.beginPath();
  safeRoundRect(ctx, topLeftX - 2 * z, awningTopY - 3.2 * z, topW + 4 * z, 4.4 * z, 2 * z);
  ctx.fill();
  ctx.stroke();

  // 6. Mini wooden stall placard at medium/close zoom
  if (z >= 0.72) {
    const signW = Math.max(46, 54 * z);
    const signH = Math.max(11, 13 * z);
    const signY = baseY - skirtH * 0.48 - signH * 0.5;
    ctx.fillStyle = '#fef6e0';
    ctx.strokeStyle = '#5c2d0c';
    ctx.lineWidth = Math.max(1.1, 1.3 * z);
    ctx.beginPath();
    safeRoundRect(ctx, baseX - signW * 0.5, signY, signW, signH, 3 * z);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#5c2d0c';
    ctx.font = `800 ${Math.max(8, Math.round(8.5 * z))}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sạp Đầu Ngõ', baseX, signY + signH * 0.5 + 0.5);
  }

  // 7. Advertised tag ("×3" with mini Daily Prophet icon) on awning corner
  if (hasAdvertisedActive) {
    const tagX = botLeftX + botW - 4 * z;
    const tagY = awningTopY - 1 * z;
    const tagW = Math.max(36, 40 * z);
    const tagH = Math.max(17, 19 * z);
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = Math.max(1.4, 1.8 * z);
    ctx.beginPath();
    safeRoundRect(ctx, tagX - tagW * 0.5, tagY - tagH * 0.5, tagW, tagH, tagH * 0.45);
    ctx.fill();
    ctx.stroke();

    drawMiniNewspaperIcon(ctx, tagX - tagW * 0.22, tagY, 10 * Math.max(0.85, z), 9 * Math.max(0.85, z));

    ctx.fillStyle = '#1e3a5f';
    ctx.font = `800 ${Math.max(9.5, Math.round(10 * z))}px ${FONT_FAMILY}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('×3', tagX - 1 * z, tagY + 0.5);
  }

  // 8. Lively bouncing golden Sickle coin pill + sparkles when any slot is sold!
  if (soldSlots.length > 0 && totalSoldSickle > 0) {
    const bob = self.reducedMotion ? 0 : Math.sin(now * 0.0065) * 3.8 * z;
    const pillY = awningTopY - 17 * z + bob;
    const label = `+${totalSoldSickle}`;
    const fontPx = Math.max(11, Math.round(12 * z));
    ctx.font = `800 ${fontPx}px ${FONT_FAMILY}`;
    const textW = safeMeasureTextWidth(ctx, label, fontPx * 0.62);
    const coinSz = Math.max(13, 15 * z);
    const pillW = Math.max(48, Math.ceil(coinSz + 18 + textW));
    const pillH = Math.max(22, 24 * z);

    safeRadialGlow(self, ctx, baseX, pillY, pillW * 0.62, 'rgba(253, 224, 71, 0.56)');

    // Drop shadow
    ctx.fillStyle = 'rgba(46, 24, 8, 0.28)';
    ctx.beginPath();
    safeRoundRect(ctx, baseX - pillW * 0.5, pillY - pillH * 0.5 + 2, pillW, pillH, pillH * 0.5);
    ctx.fill();

    // Warm cream-gold pill body
    ctx.fillStyle = safeLinearGrad(
      ctx,
      baseX,
      pillY - pillH * 0.5,
      baseX,
      pillY + pillH * 0.5,
      [
        [0, '#fffef2'],
        [0.65, '#fef08a'],
        [1, '#f59e0b'],
      ],
      '#fef08a'
    );
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(1.8, 2.2 * z);
    ctx.beginPath();
    safeRoundRect(ctx, baseX - pillW * 0.5, pillY - pillH * 0.5, pillW, pillH, pillH * 0.5);
    ctx.fill();
    ctx.stroke();

    const coinX = baseX - pillW * 0.5 + 8 + coinSz * 0.5;
    const coinSp = safeGetSprite(self, 'ui_icon_golden_sickle');
    if (coinSp) {
      ctx.drawImage(coinSp, coinX - coinSz * 0.5, pillY - coinSz * 0.5, coinSz, coinSz);
    } else {
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(coinX, pillY, coinSz * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = '#451a03';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, coinX + coinSz * 0.5 + 3, pillY + 0.5);

    // Sparkle glints around sold coin pill
    const spPhase = self.reducedMotion ? 0.5 : (now * 0.004) % 1;
    const spR = (3.4 + Math.sin(spPhase * Math.PI) * 2.4) * Math.max(0.85, z);
    drawFourPointSparkle(ctx, baseX - pillW * 0.52, pillY - pillH * 0.42, spR, '#fef9c3');
    drawFourPointSparkle(ctx, baseX + pillW * 0.52, pillY - pillH * 0.34, spR * 0.85, '#fde047');
  }

  ctx.restore();
}

// ============================================================================
// B. DAILY PROPHET MAILBOX (Hòm Thư Nhật Báo Tiên Tri)
// ============================================================================

function drawDailyProphetMailbox(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number,
  isNight: boolean,
  anchor: CourtyardAnchor
): void {
  const z = cam.zoom;
  const mbGx = anchor.gx + MAILBOX_OFFSET.dx;
  const mbGy = anchor.gy + MAILBOX_OFFSET.dy;
  const elev = getElevAt(sim, mbGx, mbGy);
  const pt = gridToScreen(mbGx, mbGy, cam, viewW, viewH, elev * ELEV_PX);

  self.hotspots.push({
    kind: 'hayday_newspaper',
    id: 'hayday_daily_prophet',
    sx: pt.sx,
    sy: pt.sy - 18 * z,
    radius: Math.max(22, 26 * z),
    priority: 26,
  });

  if (!isOnScreen(pt.sx, pt.sy, viewW, viewH, 110)) return;

  const ctx = self.ctx;
  const paper =
    typeof sim.getDailyProphetNewspaper === 'function' ? sim.getDailyProphetNewspaper(now) : null;
  const hasRareDeal = Boolean(paper?.ads?.some((ad) => Boolean(ad.isRareDeal) && !ad.sold));

  const baseX = pt.sx;
  const baseY = pt.sy;
  const postH = 22 * z;
  const postW = Math.max(4.5, 6 * z);
  const boxW = 28 * z;
  const boxH = 19 * z;
  const pivotY = baseY - postH;
  const wiggleRad = hasRareDeal && !self.reducedMotion ? Math.sin(now * 0.008) * 0.095 : 0;

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Soft ground shadow
  ctx.fillStyle = isNight ? 'rgba(8, 13, 24, 0.45)' : 'rgba(32, 54, 18, 0.32)';
  ctx.beginPath();
  safeEllipse(ctx, baseX, baseY + 2 * z, 15 * z, 6.8 * z, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pulsing warm golden halo when a rare deal awaits in the newspaper
  if (hasRareDeal) {
    const pulse = self.reducedMotion ? 0.42 : 0.36 + Math.sin(now * 0.0055) * 0.14;
    safeRadialGlow(
      self,
      ctx,
      baseX,
      pivotY - boxH * 0.45,
      30 * z,
      `rgba(251, 191, 36, ${pulse.toFixed(3)})`
    );
  }

  // 2. Sturdy timber post
  ctx.fillStyle = safeLinearGrad(
    ctx,
    baseX - postW * 0.5,
    pivotY,
    baseX + postW * 0.5,
    pivotY,
    [
      [0, '#a86230'],
      [0.55, '#7c3f18'],
      [1, '#54270c'],
    ],
    '#7c3f18'
  );
  ctx.strokeStyle = '#3f1e0a';
  ctx.lineWidth = Math.max(1.2, 1.6 * z);
  ctx.beginPath();
  safeRoundRect(ctx, baseX - postW * 0.5, pivotY - 2 * z, postW, postH + 3 * z, 1.8 * z);
  ctx.fill();
  ctx.stroke();

  // Small cross-brace shelf supporting postbox
  ctx.fillStyle = '#924e22';
  ctx.beginPath();
  safeRoundRect(ctx, baseX - boxW * 0.44, pivotY - 2.5 * z, boxW * 0.88, 4.2 * z, 1.5 * z);
  ctx.fill();
  ctx.stroke();

  // 3. Navy-and-brass storybook postbox (wiggles gently when rare deal available)
  ctx.save();
  ctx.translate(baseX, pivotY - 2 * z);
  ctx.rotate?.(wiggleRad);

  // Curved navy-blue metal roof + side box
  const bx = -boxW * 0.5;
  const by = -boxH;
  ctx.fillStyle = safeLinearGrad(
    ctx,
    bx,
    by,
    bx,
    0,
    [
      [0, '#315a8e'],
      [0.45, '#1e3a5f'],
      [1, '#12243d'],
    ],
    '#1e3a5f'
  );
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = Math.max(1.4, 1.8 * z);
  ctx.beginPath();
  safeRoundRect(ctx, bx, by, boxW, boxH, Math.min(8 * z, boxH * 0.42));
  ctx.fill();
  ctx.stroke();

  // Front arched door plate
  ctx.fillStyle = '#172d4a';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = Math.max(1.1, 1.4 * z);
  ctx.beginPath();
  safeRoundRect(ctx, bx + 2 * z, by + 2.5 * z, boxW * 0.46, boxH - 4.5 * z, 4.5 * z);
  ctx.fill();
  ctx.stroke();

  // Rolled Daily Prophet paper peeking from mail slot
  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = Math.max(0.9, 1.1 * z);
  ctx.beginPath();
  safeRoundRect(ctx, bx - 3.2 * z, by + boxH * 0.34, 9.5 * z, 5.2 * z, 2.2 * z);
  ctx.fill();
  ctx.stroke();

  // Brass emblem band across side of postbox
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(bx + boxW * 0.54, by + boxH * 0.24, boxW * 0.38, 2.4 * z);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(bx + boxW * 0.72, by + boxH * 0.56, Math.max(1.6, 2.1 * z), 0, Math.PI * 2);
  ctx.fill();

  // 4. Brass mail flag (raised bright gold if rare deal, resting down otherwise)
  ctx.save();
  const flagPivotX = bx + boxW * 0.88;
  const flagPivotY = by + boxH * 0.44;
  ctx.translate(flagPivotX, flagPivotY);
  if (hasRareDeal) {
    // Raised vertical bright golden brass flag!
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(1.2, 1.5 * z);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    safeRoundRect(ctx, -1.2 * z, -14 * z, 2.4 * z, 14 * z, 0.8 * z);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(1 * z, -14 * z);
    ctx.lineTo(10.5 * z, -11.5 * z);
    ctx.lineTo(1 * z, -8 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Lowered horizontal muted brass flag
    ctx.fillStyle = '#b47824';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = Math.max(1, 1.2 * z);
    ctx.beginPath();
    safeRoundRect(ctx, -1 * z, -1.2 * z, 9.5 * z, 2.6 * z, 1 * z);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore(); // end mailbox wiggle transform

  // 5. Floating mini newspaper badge when a rare deal is active
  if (hasRareDeal) {
    const badgeBob = self.reducedMotion ? 0 : Math.sin(now * 0.006 + 1.2) * 3.2 * z;
    const badgeY = pivotY - boxH - 16 * z + badgeBob;
    const badgeR = Math.max(11, 12.5 * z);

    ctx.fillStyle = 'rgba(20, 32, 56, 0.94)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = Math.max(1.8, 2.1 * z);
    ctx.beginPath();
    ctx.arc(baseX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    drawMiniNewspaperIcon(ctx, baseX, badgeY, badgeR * 1.12, badgeR * 0.96);
    drawFourPointSparkle(
      ctx,
      baseX + badgeR * 0.82,
      badgeY - badgeR * 0.72,
      Math.max(3.2, 4.2 * z),
      '#fef08a'
    );
  }

  ctx.restore();
}

// ============================================================================
// C. 2 WALKING FARM VISITORS (Khách Dạo Cổng Hang Sóc)
// ============================================================================

function resolveVisitorVisualProfile(visitorName: string): VisitorVisualProfile {
  const lower = visitorName.toLowerCase();
  if (lower.includes('hagrid')) {
    return {
      idleKey: 'villager_hagrid_idle',
      walkKey: 'villager_hagrid_walk',
      shortLabel: 'Bác Hagrid',
      accentColor: '#92400e',
      initial: 'H',
      tall: true,
    };
  }
  if (lower.includes('arthur')) {
    return {
      idleKey: 'villager_arthur_idle',
      walkKey: 'villager_arthur_walk',
      shortLabel: 'Ông Arthur',
      accentColor: '#b45309',
      initial: 'A',
    };
  }
  if (lower.includes('molly')) {
    return {
      idleKey: 'villager_molly_idle',
      walkKey: 'villager_molly_walk',
      shortLabel: 'Bà Molly',
      accentColor: '#dc2626',
      initial: 'M',
    };
  }
  if (lower.includes('rosmerta')) {
    return {
      idleKey: 'villager_molly_idle',
      walkKey: 'villager_molly_walk',
      shortLabel: 'Bà Rosmerta',
      accentColor: '#d97706',
      initial: 'R',
    };
  }
  if (lower.includes('luna')) {
    return {
      idleKey: 'villager_ginny_idle',
      walkKey: 'villager_ginny_walk',
      shortLabel: 'Luna',
      accentColor: '#2563eb',
      initial: 'L',
    };
  }
  if (lower.includes('neville')) {
    return {
      idleKey: 'staff_wizard',
      walkKey: 'staff_wizard',
      shortLabel: 'Neville',
      accentColor: '#15803d',
      initial: 'N',
    };
  }
  if (lower.includes('fred') || lower.includes('george') || lower.includes('ron')) {
    return {
      idleKey: 'villager_ron_idle',
      walkKey: 'villager_ron_walk',
      shortLabel: lower.includes('fred') ? 'Fred & George' : 'Ron',
      accentColor: '#ea580c',
      initial: 'F',
    };
  }
  if (lower.includes('hermione')) {
    return {
      idleKey: 'villager_hermione_idle',
      walkKey: 'villager_hermione_walk',
      shortLabel: 'Hermione',
      accentColor: '#991b1b',
      initial: 'H',
    };
  }
  const initialChar = ([...visitorName.trim()].find((c) => /[\p{L}\p{N}]/u.test(c)) ?? 'K').toUpperCase();
  return {
    shortLabel: visitorName.slice(0, 14),
    accentColor: '#7c3f18',
    initial: initialChar,
  };
}

function drawWoodenMedallionPortrait(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  radius: number,
  profile: VisitorVisualProfile
): void {
  ctx.save();
  // Carved mahogany rim
  ctx.fillStyle = '#5c2d0c';
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = Math.max(1.5, radius * 0.14);
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner colored crest
  ctx.fillStyle = profile.accentColor;
  ctx.beginPath();
  ctx.arc(sx, sy, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();

  // Crisp initial letter
  ctx.fillStyle = '#fffbeb';
  ctx.font = `800 ${Math.max(11, Math.round(radius * 0.95))}px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(profile.initial, sx, sy + 0.5);
  ctx.restore();
}

function drawWalkingFarmVisitors(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number,
  isNight: boolean,
  anchor: CourtyardAnchor
): void {
  if (typeof sim.getFarmVisitors !== 'function') return;
  const visitors = sim.getFarmVisitors(now);
  if (!Array.isArray(visitors) || visitors.length === 0) return;

  const activeEntries: Array<{
    visitor: FarmVisitorOffer;
    sx: number;
    sy: number;
    isWalking: boolean;
    facingLeft: boolean;
  }> = [];

  for (let i = 0; i < visitors.length; i++) {
    const v = visitors[i];
    if (!v || (v.arrivesAt && v.arrivesAt > now)) continue;

    const slotCfg = VISITOR_SLOT_OFFSETS[v.slotIndex % VISITOR_SLOT_OFFSETS.length] ?? VISITOR_SLOT_OFFSETS[0];
    const startGx = anchor.gx + slotCfg.startDx;
    const startGy = anchor.gy + slotCfg.startDy;
    const destGx = anchor.gx + slotCfg.destDx;
    const destGy = anchor.gy + slotCfg.destDy;
    const elapsed = Math.max(0, now - (v.spawnedAt || 0));
    const rawT = Math.min(1, elapsed / 3500);
    const easedT = 1 - Math.pow(1 - rawT, 3);
    const curGx = startGx + (destGx - startGx) * easedT;
    const curGy = startGy + (destGy - startGy) * easedT;
    const isWalking = rawT < 0.995;

    const elev = getElevAt(sim, curGx, curGy);
    const pt = gridToScreen(curGx, curGy, cam, viewW, viewH, elev * ELEV_PX);
    const destPt = gridToScreen(destGx, destGy, cam, viewW, viewH, elev * ELEV_PX);
    const facingLeft = isWalking ? destPt.sx < pt.sx : v.slotIndex === 1;

    activeEntries.push({
      visitor: v,
      sx: pt.sx,
      sy: pt.sy,
      isWalking,
      facingLeft,
    });
  }

  // Sort back-to-front by screen Y so foreground visitor overlaps cleanly
  activeEntries.sort((a, b) => a.sy - b.sy);

  const ctx = self.ctx;
  const z = cam.zoom;

  for (const entry of activeEntries) {
    const { visitor: v, sx, sy, isWalking, facingLeft } = entry;
    const profile = resolveVisitorVisualProfile(v.visitorName);
    const baseH = (profile.tall ? 58 : 48) * z;
    const headY = sy - baseH - 18 * z;

    self.hotspots.push({
      kind: 'hayday_visitor',
      id: v.id,
      sx,
      sy: headY,
      radius: Math.max(24, 30 * z),
      priority: 28,
    });

    if (!isOnScreen(sx, sy, viewW, viewH, 110)) continue;

    const haveCount =
      typeof sim.getFarmItemCount === 'function' ? sim.getFarmItemCount(v.itemId) : 0;
    const canFulfill = Boolean(sim.state?.sandboxMode || haveCount >= v.qty);

    const walkCycle = now * 0.011 + v.slotIndex * 2.1;
    const breathCycle = now * 0.0032 + v.slotIndex * 1.9;
    const bob = self.reducedMotion
      ? 0
      : isWalking
        ? Math.abs(Math.sin(walkCycle)) * 3.2 * z
        : Math.sin(breathCycle) * 1.1 * z;
    const breathScaleY = self.reducedMotion || isWalking ? 1 : 1 + Math.sin(breathCycle) * 0.018;
    const walkLean = self.reducedMotion || !isWalking ? 0 : Math.sin(walkCycle) * 0.04;

    const useWalkPose = !self.reducedMotion && isWalking && Math.floor(walkCycle / Math.PI) % 2 === 1;
    const sprite =
      safeGetSprite(self, useWalkPose ? profile.walkKey : profile.idleKey) ??
      safeGetSprite(self, profile.idleKey);

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Subtle emerald invitation ring under feet when player can sell immediately
    if (canFulfill) {
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.55)';
      ctx.lineWidth = Math.max(1.5, 2 * z);
      ctx.beginPath();
      safeEllipse(ctx, sx, sy + 2 * z, 15 * z, 7.2 * z, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Soft ground contact shadow
    const shadowShrink = Math.max(0.8, 1 - bob / Math.max(12, 24 * z));
    ctx.fillStyle = isNight ? 'rgba(8, 13, 24, 0.45)' : 'rgba(30, 56, 20, 0.34)';
    ctx.beginPath();
    safeEllipse(
      ctx,
      sx,
      sy + 2 * z,
      13 * z * shadowShrink,
      5.8 * z * shadowShrink,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Crisp villager sprite OR fallback painted wooden medallion portrait
    if (sprite && sprite.width > 0 && sprite.height > 0) {
      const drawW = baseH * (sprite.width / sprite.height);
      ctx.save();
      ctx.translate(sx, sy - bob);
      if (facingLeft) ctx.scale?.(-1, 1);
      if ((walkLean !== 0 || breathScaleY !== 1) && typeof ctx.transform === 'function') {
        ctx.transform(1, 0, walkLean, breathScaleY, 0, 0);
      }
      ctx.drawImage(sprite, -drawW * 0.5, -baseH, drawW, baseH);
      ctx.restore();
    } else {
      drawWoodenMedallionPortrait(ctx, sx, sy - baseH * 0.46 - bob, Math.max(13, 16 * z), profile);
    }

    // Compact name caption under boots at medium/close zoom
    if (z >= 0.72) {
      const nameFontPx = Math.max(9, Math.round(9.5 * z));
      ctx.font = `700 ${nameFontPx}px ${FONT_FAMILY}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = 'rgba(28, 18, 10, 0.85)';
      ctx.lineWidth = 2.8;
      ctx.strokeText?.(profile.shortLabel, sx, sy + 5 * z);
      ctx.fillStyle = '#fef3c7';
      ctx.fillText(profile.shortLabel, sx, sy + 5 * z);
    }

    // Hay Day cream speech bubble above visitor's head
    const bubbleBob = self.reducedMotion ? 0 : Math.sin(now * 0.0045 + v.slotIndex * 2.4) * 2.2 * z;
    const bx = sx;
    const by = headY + bubbleBob;
    const qtyLabel = `×${v.qty}`;
    const qtyFontPx = Math.max(10.5, Math.round(11.5 * z));
    ctx.font = `800 ${qtyFontPx}px ${FONT_FAMILY}`;
    const qtyW = safeMeasureTextWidth(ctx, qtyLabel, qtyFontPx * 0.62);
    const iconSz = Math.max(17, Math.min(24, 21 * z));
    const padX = Math.max(7, 8 * z);
    const gap = Math.max(3, 4 * z);
    const bw = Math.max(46, Math.ceil(padX * 2 + iconSz + gap + qtyW));
    const bh = Math.max(26, Math.ceil(iconSz + 9 * Math.max(0.85, z)));
    const left = bx - bw * 0.5;
    const top = by - bh * 0.5;
    const cornerR = Math.min(11 * Math.max(0.85, z), bh * 0.46);
    const tailH = 6 * Math.max(0.85, z);

    if (canFulfill) {
      safeRadialGlow(self, ctx, bx, by, bw * 0.56, 'rgba(34, 197, 94, 0.34)');
    }

    const traceBubble = (offsetY = 0): void => {
      const ty = top + offsetY;
      ctx.beginPath();
      ctx.moveTo(left + cornerR, ty);
      ctx.lineTo(left + bw - cornerR, ty);
      safeQuadCurveTo(ctx, left + bw, ty, left + bw, ty + cornerR);
      ctx.lineTo(left + bw, ty + bh - cornerR);
      safeQuadCurveTo(ctx, left + bw, ty + bh, left + bw - cornerR, ty + bh);
      ctx.lineTo(bx + 4.5, ty + bh);
      ctx.lineTo(bx, ty + bh + tailH);
      ctx.lineTo(bx - 4.5, ty + bh);
      ctx.lineTo(left + cornerR, ty + bh);
      safeQuadCurveTo(ctx, left, ty + bh, left, ty + bh - cornerR);
      ctx.lineTo(left, ty + cornerR);
      safeQuadCurveTo(ctx, left, ty, left + cornerR, ty);
      ctx.closePath();
    };

    // Soft drop shadow
    traceBubble(2.2);
    ctx.fillStyle = 'rgba(34, 20, 8, 0.25)';
    ctx.fill();

    // Cream parchment fill + warm brown or vibrant emerald border
    traceBubble(0);
    ctx.fillStyle = safeLinearGrad(
      ctx,
      bx,
      top,
      bx,
      top + bh,
      canFulfill
        ? [
            [0, '#ffffff'],
            [1, '#ecfdf5'],
          ]
        : [
            [0, '#fffef7'],
            [1, '#fef3d1'],
          ],
      '#fffdf4'
    );
    ctx.fill();
    ctx.strokeStyle = canFulfill ? '#16a34a' : '#6b3e1b';
    ctx.lineWidth = canFulfill ? Math.max(2.2, 2.6 * z) : Math.max(1.8, 2.1 * z);
    ctx.stroke();

    // Requested item sprite inside speech bubble
    const itemMeta = getFarmItemMeta(v.itemId);
    const itemIconKey =
      (v.itemId in FARM_CROPS ? FARM_CROPS[v.itemId as FarmCropId]?.iconKey : undefined) ??
      (v.itemId in FARM_GOODS
        ? FARM_GOODS[v.itemId as keyof typeof FARM_GOODS]?.iconKey
        : undefined) ??
      itemMeta.iconKey;
    const itemSprite = safeGetSprite(self, itemIconKey);
    const iconX = left + padX;
    const iconY = by - iconSz * 0.5;
    if (itemSprite) {
      ctx.drawImage(itemSprite, iconX, iconY, iconSz, iconSz);
    } else {
      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(iconX + iconSz * 0.5, by, iconSz * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Requested quantity label
    ctx.fillStyle = canFulfill ? '#14532d' : '#5c2d0c';
    ctx.font = `800 ${qtyFontPx}px ${FONT_FAMILY}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(qtyLabel, iconX + iconSz + gap, by + 0.5);

    // Emerald ready-to-sell checkmark dot on top-right corner of speech bubble
    if (canFulfill) {
      const dotR = Math.max(7, 8.2 * z);
      const dotX = left + bw - 2;
      const dotY = top + 2;
      ctx.fillStyle = '#16a34a';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1.4, 1.8 * z);
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawCheckmarkPath(ctx, dotX, dotY, dotR * 1.15, '#ffffff');
    }

    ctx.restore();
  }
}

// ============================================================================
// D. WORKSHOP READY-GOODS SHELF & MASTERY STARS (Kệ Thành Phẩm & Sao Thông Thạo)
// ============================================================================

function drawWorkshopMasteryAndShelves(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number,
  isNight: boolean
): void {
  const buildings = sim.state?.buildings ?? [];
  if (buildings.length === 0) return;

  const ctx = self.ctx;
  const z = cam.zoom;

  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    if (now < b.constructEndsAt || b.awaitingUnveil) continue;
    const item = getCatalogItem(b.itemId);
    if (!item?.workshopGroupId) continue;

    const fp =
      typeof sim.getBuildingFootprint === 'function'
        ? sim.getBuildingFootprint(item, b.rotation)
        : { bw: item.width, bh: item.height };
    const elev = getElevAt(sim, b.gx, b.gy);
    const centerGx = b.gx + fp.bw * 0.5;
    const centerGy = b.gy + fp.bh * 0.5;

    // 1. Sleek miniature brass crest showing 1..3 mastery stars near upper roof edge
    const mastery =
      typeof sim.getWorkshopMastery === 'function'
        ? sim.getWorkshopMastery(item.workshopGroupId)
        : null;
    if (mastery && mastery.tier >= 1) {
      const roofPt = gridToScreen(
        centerGx,
        b.gy + fp.bh * 0.35,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX + 48 + Math.max(fp.bw, fp.bh) * 14
      );
      if (isOnScreen(roofPt.sx, roofPt.sy, viewW, viewH, 70)) {
        const starCount = Math.min(3, mastery.tier);
        const starR = Math.max(4.5, 5.4 * z);
        const spacing = starR * 2.25;
        const pillW = Math.max(24, starCount * spacing + 11 * Math.max(0.85, z));
        const pillH = Math.max(15, starR * 2.8);

        ctx.save();
        ctx.fillStyle = 'rgba(46, 22, 9, 0.92)';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = Math.max(1.4, 1.8 * z);
        ctx.beginPath();
        safeRoundRect(
          ctx,
          roofPt.sx - pillW * 0.5,
          roofPt.sy - pillH * 0.5,
          pillW,
          pillH,
          pillH * 0.5
        );
        ctx.fill();
        ctx.stroke();

        // Inner thin brass gleam line
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.lineWidth = Math.max(0.7, 0.9 * z);
        ctx.stroke();

        const startX = roofPt.sx - ((starCount - 1) * spacing) * 0.5;
        for (let s = 0; s < starCount; s++) {
          drawFivePointStar(
            ctx,
            startX + s * spacing,
            roofPt.sy + 0.3,
            starR,
            starR * 0.46,
            '#fbbf24',
            '#78350f',
            Math.max(0.8, 1 * z)
          );
        }
        ctx.restore();
      }
    }

    // 2. Warm rustic wooden front-door display table with up to 4 ready artisan goods
    const readyGoods = b.readyFarmGoods;
    if (!readyGoods || readyGoods.length === 0) continue;

    const footCenter = gridToScreen(centerGx, centerGy, cam, viewW, viewH, elev * ELEV_PX);
    // Offset cleanly toward the viewer-facing front edge of the isometric footprint across all rotations
    const shelfX = footCenter.sx;
    const shelfY = footCenter.sy + ((fp.bw + fp.bh) * 0.25) * TILE_H * 0.62 * z;
    if (!isOnScreen(shelfX, shelfY, viewW, viewH, 100)) continue;

    const shownCount = Math.min(4, readyGoods.length);
    const itemSz = Math.max(15, Math.min(24, 20 * z));
    const itemStep = Math.max(14, 17 * z);
    const tableW = Math.max(36 * Math.max(0.8, z), shownCount * itemStep + 18 * Math.max(0.8, z));
    const tableH = Math.max(7, 9 * z);

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Soft golden sheen behind ready goods
    safeRadialGlow(self, ctx, shelfX, shelfY - itemSz * 0.35, tableW * 0.68, 'rgba(253, 224, 71, 0.42)');

    // Ground AO shadow underneath wooden table
    ctx.fillStyle = isNight ? 'rgba(8, 13, 24, 0.46)' : 'rgba(34, 52, 18, 0.32)';
    ctx.beginPath();
    safeEllipse(ctx, shelfX, shelfY + 6 * z, tableW * 0.52, tableH * 0.56, 0, 0, Math.PI * 2);
    ctx.fill();

    // Short rustic table legs
    const legW = Math.max(2.6, 3.6 * z);
    const legH = Math.max(5.5, 7 * z);
    ctx.fillStyle = '#6f3815';
    ctx.strokeStyle = '#3f1e0a';
    ctx.lineWidth = Math.max(1, 1.3 * z);
    for (const dir of [-1, 1] as const) {
      const lx = shelfX + dir * (tableW * 0.38) - legW * 0.5;
      ctx.beginPath();
      safeRoundRect(ctx, lx, shelfY, legW, legH, 1 * z);
      ctx.fill();
      ctx.stroke();
    }

    // Wooden plank tabletop with beveled edge
    ctx.fillStyle = safeLinearGrad(
      ctx,
      shelfX,
      shelfY - tableH * 0.6,
      shelfX,
      shelfY + tableH * 0.4,
      [
        [0, '#f3ca8c'],
        [0.55, '#d7964d'],
        [1, '#9c5622'],
      ],
      '#d7964d'
    );
    ctx.strokeStyle = '#47220b';
    ctx.lineWidth = Math.max(1.3, 1.7 * z);
    ctx.beginPath();
    safeRoundRect(ctx, shelfX - tableW * 0.5, shelfY - tableH * 0.55, tableW, tableH, 3 * z);
    ctx.fill();
    ctx.stroke();

    // Ready artisan good sprites sitting side-by-side with staggered hover bob
    const firstX = shelfX - ((shownCount - 1) * itemStep) * 0.5;
    for (let gIdx = 0; gIdx < shownCount; gIdx++) {
      const gid = readyGoods[gIdx];
      const gxPos = firstX + gIdx * itemStep;
      const hoverBob = self.reducedMotion
        ? 0
        : Math.sin(now * 0.0055 + gIdx * 1.15 + b.gx * 0.7) * 2.2 * z;
      const baseItemY = shelfY - tableH * 0.35;

      // Tiny contact shadow on tabletop
      ctx.fillStyle = 'rgba(54, 26, 8, 0.28)';
      ctx.beginPath();
      safeEllipse(ctx, gxPos, baseItemY + 1, itemSz * 0.34, itemSz * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      const goodMeta = FARM_GOODS[gid];
      const sp = safeGetSprite(self, goodMeta?.iconKey);
      if (sp) {
        ctx.drawImage(
          sp,
          gxPos - itemSz * 0.5,
          baseItemY - itemSz * 0.92 + hoverBob,
          itemSz,
          itemSz
        );
      } else {
        ctx.fillStyle = '#fde68a';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(gxPos, baseItemY - itemSz * 0.45 + hoverBob, itemSz * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Overflow pill when more than 4 ready goods are stacked on the shelf
    if (readyGoods.length > 4) {
      const extraLabel = `+${readyGoods.length - 4}`;
      const badgeX = shelfX + tableW * 0.5 + 2;
      const badgeY = shelfY - itemSz * 0.55;
      const badgeR = Math.max(8, 9 * z);
      ctx.fillStyle = '#16a34a';
      ctx.strokeStyle = '#fffdf4';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${Math.max(8.5, Math.round(9.5 * z))}px ${FONT_FAMILY}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(extraLabel, badgeX, badgeY + 0.5);
    }

    ctx.restore();
  }
}

// ============================================================================
// E1. RIPE CROP GOLDEN SHIMMER SWEEP
// ============================================================================

function drawRipeCropGoldenShimmer(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number
): void {
  const buildings = sim.state?.buildings ?? [];
  if (buildings.length === 0) return;

  const ctx = self.ctx;
  const z = cam.zoom;
  const tSec = now * 0.001;
  let drawn = 0;

  for (let i = 0; i < buildings.length; i++) {
    if (drawn >= MAX_VISIBLE_SHIMMER_PLOTS) break;
    const b = buildings[i];
    if (now < b.constructEndsAt || !b.cropId || !b.cropReadyAt || now < b.cropReadyAt) continue;
    const item = getCatalogItem(b.itemId);
    if (!item?.isFarmlandPlot) continue;

    const fp =
      typeof sim.getBuildingFootprint === 'function'
        ? sim.getBuildingFootprint(item, b.rotation)
        : { bw: item.width, bh: item.height };
    const elev = getElevAt(sim, b.gx, b.gy);
    const pt = gridToScreen(
      b.gx + fp.bw * 0.5,
      b.gy + fp.bh * 0.5,
      cam,
      viewW,
      viewH,
      elev * ELEV_PX + 10
    );
    if (!isOnScreen(pt.sx, pt.sy, viewW, viewH, 70)) continue;
    drawn++;

    const halfW = 24 * fp.bw * 0.5 * z;
    const halfH = 12 * fp.bh * 0.5 * z;

    if (self.reducedMotion) {
      drawFourPointSparkle(
        ctx,
        pt.sx - halfW * 0.28,
        pt.sy - halfH * 0.35,
        Math.max(2.6, 3.2 * z),
        'rgba(254, 240, 138, 0.7)'
      );
      drawFourPointSparkle(
        ctx,
        pt.sx + halfW * 0.24,
        pt.sy + halfH * 0.12,
        Math.max(2.2, 2.6 * z),
        'rgba(254, 249, 195, 0.6)'
      );
      continue;
    }

    // Staggered diagonal sunlit sheen sweep cycling every 2.8s across adjacent plots
    const periodSec = 2.8;
    const waveOffset = b.gx * 0.14 + b.gy * 0.09;
    const localCycle = (((tSec - waveOffset) % periodSec) + periodSec) % periodSec;
    const sweepDur = 0.62;
    if (localCycle > sweepDur) continue;

    const p = localCycle / sweepDur; // 0..1 across plot
    const env = Math.sin(p * Math.PI);
    const sweepX = pt.sx + (p * 2 - 1) * halfW * 0.72;
    const sweepY = pt.sy + (p * 2 - 1) * halfH * 0.32;

    ctx.save();
    ctx.translate(sweepX, sweepY);
    ctx.rotate?.(-0.42);
    const bandW = Math.max(6, 9 * z);
    const bandH = Math.max(16, halfW * 0.92);
    ctx.fillStyle = safeLinearGrad(
      ctx,
      -bandW,
      0,
      bandW,
      0,
      [
        [0, 'rgba(254, 249, 195, 0)'],
        [0.5, `rgba(254, 249, 195, ${(0.52 * env).toFixed(3)})`],
        [1, 'rgba(254, 249, 195, 0)'],
      ],
      `rgba(254, 249, 195, ${(0.32 * env).toFixed(3)})`
    );
    ctx.beginPath();
    safeRoundRect(ctx, -bandW, -bandH * 0.5, bandW * 2, bandH, bandW);
    ctx.fill();
    ctx.restore();

    // Two twinkling sunlit star glints riding the sweep crest
    const starSize = Math.max(2.6, (3.2 + env * 3.4) * z);
    drawFourPointSparkle(
      ctx,
      sweepX - 3 * z,
      sweepY - 5 * z,
      starSize,
      `rgba(255, 251, 235, ${(0.92 * env).toFixed(3)})`
    );
    drawFourPointSparkle(
      ctx,
      sweepX + 6 * z,
      sweepY + 4 * z,
      starSize * 0.72,
      `rgba(253, 224, 71, ${(0.85 * env).toFixed(3)})`
    );
  }
}

// ============================================================================
// E2. LIVE CURVED SICKLE / WATER / SEED SWIPE TRAIL & POINTER TOOL
// ============================================================================

function drawCurvedGoldenSickle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate?.(angleRad);

  // Soft golden aura under blade
  ctx.fillStyle = 'rgba(253, 224, 71, 0.34)';
  ctx.beginPath();
  ctx.arc(4, -6, 22, 0, Math.PI * 2);
  ctx.fill();

  // Turned walnut wooden handle
  ctx.fillStyle = safeLinearGrad(
    ctx,
    -18,
    10,
    -2,
    22,
    [
      [0, '#b76a32'],
      [0.55, '#7c3f18'],
      [1, '#4c230a'],
    ],
    '#7c3f18'
  );
  ctx.strokeStyle = '#3b1b08';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  safeRoundRect(ctx, -20, 4, 15, 7, 3.5);
  ctx.fill();
  ctx.stroke();

  // Brass collar ferrule joining handle to crescent blade
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  safeRoundRect(ctx, -7, 3.2, 5.5, 8.6, 2);
  ctx.fill();
  ctx.stroke();

  // Iconic Hay Day curved golden crescent harvest blade
  ctx.fillStyle = safeLinearGrad(
    ctx,
    -4,
    -24,
    22,
    6,
    [
      [0, '#fffef2'],
      [0.35, '#fde047'],
      [0.75, '#f59e0b'],
      [1, '#b45309'],
    ],
    '#fde047'
  );
  ctx.strokeStyle = '#5c2d0c';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-2, 5);
  safeQuadCurveTo(ctx, 22, 2, 20, -17);
  safeQuadCurveTo(ctx, 13, -29, -8, -22);
  safeQuadCurveTo(ctx, 8, -19, 10, -8);
  safeQuadCurveTo(ctx, 11, 0, -2, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crisp white specular gleam along cutting arc
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -21);
  safeQuadCurveTo(ctx, 14, -22, 15.5, -10);
  ctx.stroke();

  ctx.restore();
}

function drawSwipeWaterTool(
  self: IsometricRenderer,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate?.(angleRad * 0.45);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
  ctx.beginPath();
  ctx.arc(0, 0, 21, 0, Math.PI * 2);
  ctx.fill();

  const canSp = safeGetSprite(self, 'ui_icon_watering_can');
  if (canSp) {
    ctx.drawImage(canSp, -19, -20, 38, 38);
  } else {
    // Crisp glossy azure water droplet
    ctx.fillStyle = safeLinearGrad(
      ctx,
      0,
      -17,
      0,
      14,
      [
        [0, '#bae6fd'],
        [0.45, '#38bdf8'],
        [1, '#0284c7'],
      ],
      '#38bdf8'
    );
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(0, -17);
    safeQuadCurveTo(ctx, 14, 0, 12, 8);
    ctx.arc(0, 6, 12, 0.16, Math.PI - 0.16, false);
    safeQuadCurveTo(ctx, -14, 0, 0, -17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Specular droplet glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    safeEllipse(ctx, -4, 3, 2.4, 4.6, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawSwipeSeedTool(
  self: IsometricRenderer,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cropId: FarmCropId | null | undefined,
  angleRad: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate?.(angleRad * 0.32);

  // Soft lush emerald halo ring
  ctx.fillStyle = 'rgba(74, 222, 128, 0.34)';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffdf4';
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const iconKey =
    cropId && FARM_CROPS[cropId] ? FARM_CROPS[cropId].iconKey : 'ui_icon_seed_sack';
  const sp = safeGetSprite(self, iconKey) ?? safeGetSprite(self, 'ui_icon_seed_sack');
  if (sp) {
    ctx.drawImage(sp, -13, -13, 26, 26);
  } else {
    // Fallback painted emerald leaf sprout
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    safeEllipse(ctx, -4, -1, 6, 3.8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    safeEllipse(ctx, 4, -2, 6, 3.8, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawSwipeTrailAndTool(
  self: IsometricRenderer,
  swipeState: HayDaySwipeVisualState,
  viewW: number,
  viewH: number,
  now: number
): void {
  const ctx = self.ctx;
  const palette =
    swipeState.tool === 'water'
      ? {
          main: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.45)',
          core: '#f0f9ff',
          badgeBg: '#0c4a6e',
          badgeRim: '#38bdf8',
        }
      : swipeState.tool === 'seed'
        ? {
            main: '#4ade80',
            glow: 'rgba(74, 222, 128, 0.45)',
            core: '#f0fdf4',
            badgeBg: '#14532d',
            badgeRim: '#4ade80',
          }
        : {
            main: '#fde047',
            glow: 'rgba(253, 224, 71, 0.5)',
            core: '#fffef2',
            badgeBg: '#5c2d0c',
            badgeRim: '#fde047',
          };

  const pts = Array.isArray(swipeState.points) ? swipeState.points : [];

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Silky tapered ribbon arc along swipeState.points
  if (pts.length >= 2) {
    const recentPts = pts.filter((p) => now - p.at <= SWIPE_TRAIL_MAX_AGE_MS + 80);
    const trail = recentPts.length >= 2 ? recentPts : pts.slice(-8);
    const total = trail.length - 1;

    for (let i = 0; i < total; i++) {
      const p0 = trail[i];
      const p1 = trail[i + 1];
      const frac = (i + 1) / total; // 0 at tail -> 1 at pointer head
      const ageFade = Math.max(0.15, Math.min(1, 1 - (now - p1.at) / (SWIPE_TRAIL_MAX_AGE_MS + 90)));
      const alpha = frac * ageFade;
      const width = self.reducedMotion ? 4.5 : 2 + Math.pow(frac, 1.35) * 10.5;

      // Outer luminous glow stroke
      ctx.save();
      ctx.globalAlpha = alpha * 0.45;
      ctx.strokeStyle = palette.glow;
      ctx.lineWidth = width * 2.15;
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();

      // Main vibrant ribbon stroke
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = palette.main;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();

      // Bright inner sheen core
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = palette.core;
      ctx.lineWidth = Math.max(1.2, width * 0.36);
      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.stroke();
      ctx.restore();
    }

    // Crisp twinkle sparkles trailing behind the tool head
    if (!self.reducedMotion) {
      const step = Math.max(1, Math.floor(trail.length / 4));
      for (let i = Math.max(0, trail.length - 4 * step); i < trail.length - 1; i += step) {
        const p = trail[i];
        const side = i % 2 === 0 ? 1 : -1;
        drawFourPointSparkle(
          ctx,
          p.sx + side * 8,
          p.sy - side * 6,
          3.2 + (i / Math.max(1, trail.length)) * 2.8,
          palette.core
        );
      }
    }
  }

  // 2. Compute smooth pointer velocity tilt angle
  let tiltAngle = -0.25;
  if (pts.length >= 2) {
    const tail = pts[Math.max(0, pts.length - 4)];
    const head = pts[pts.length - 1];
    const dx = head.sx - tail.sx;
    const dy = head.sy - tail.sy;
    if (Math.hypot(dx, dy) > 3) {
      const rawAng = Math.atan2(dy, dx);
      tiltAngle = Math.max(-0.95, Math.min(0.95, rawAng * 0.45));
    }
  }

  // 3. Draw iconic tool at pointer position
  if (swipeState.tool === 'water') {
    drawSwipeWaterTool(self, ctx, swipeState.x, swipeState.y, tiltAngle);
  } else if (swipeState.tool === 'seed') {
    drawSwipeSeedTool(self, ctx, swipeState.x, swipeState.y, swipeState.cropId, tiltAngle);
  } else {
    drawCurvedGoldenSickle(ctx, swipeState.x, swipeState.y, tiltAngle);
  }

  // 4. Floating combo badge when comboCount >= 2
  if (swipeState.comboCount >= 2) {
    const comboText = `×${swipeState.comboCount}`;
    const bx = Math.max(34, Math.min(viewW - 34, swipeState.x + 28));
    const by = Math.max(28, Math.min(viewH - 28, swipeState.y - 30));
    const pulse = self.reducedMotion ? 1 : 1 + Math.sin(now * 0.014) * 0.05;

    ctx.save();
    ctx.translate(bx, by);
    ctx.scale?.(pulse, pulse);

    const fontPx = 13;
    ctx.font = `800 ${fontPx}px ${FONT_FAMILY}`;
    const tw = safeMeasureTextWidth(ctx, comboText, 8);
    const pillW = Math.max(38, Math.ceil(tw + 18));
    const pillH = 24;

    ctx.fillStyle = 'rgba(20, 12, 6, 0.35)';
    ctx.beginPath();
    safeRoundRect(ctx, -pillW * 0.5, -pillH * 0.5 + 2, pillW, pillH, pillH * 0.5);
    ctx.fill();

    ctx.fillStyle = palette.badgeBg;
    ctx.strokeStyle = palette.badgeRim;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    safeRoundRect(ctx, -pillW * 0.5, -pillH * 0.5, pillW, pillH, pillH * 0.5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fffef2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(comboText, 0, 0.5);
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// PUBLIC ENTRYPOINT
// ============================================================================

export function drawHayDayDiegeticWorldOverlay(
  self: IsometricRenderer,
  sim: ParkSimulation,
  cam: Camera,
  viewW: number,
  viewH: number,
  now: number,
  isNight: boolean,
  swipeState?: HayDaySwipeVisualState | null
): void {
  if (!self?.ctx || !sim?.state) return;

  // E1. Ripe crop sunlit diagonal shimmer across visible ready farmland plots
  drawRipeCropGoldenShimmer(self, sim, cam, viewW, viewH, now);

  // D. Workshop Mastery Stars & Ready-Goods Rustic Display Table (active both home & visiting)
  drawWorkshopMasteryAndShelves(self, sim, cam, viewW, viewH, now, isNight);

  // A, B, C. Home-only diegetic courtyard props & walking farm visitors
  if (!sim.isVisitingNeighbor) {
    const anchor = resolveCourtyardAnchor(sim);
    drawRoadsideStandStall(self, sim, cam, viewW, viewH, now, isNight, anchor);
    drawDailyProphetMailbox(self, sim, cam, viewW, viewH, now, isNight, anchor);
    drawWalkingFarmVisitors(self, sim, cam, viewW, viewH, now, isNight, anchor);
  }

  // E2. Live curved sickle / water / seed swipe trail & pointer tool on top of everything
  if (swipeState?.active) {
    drawSwipeTrailAndTool(self, swipeState, viewW, viewH, now);
  }
}
