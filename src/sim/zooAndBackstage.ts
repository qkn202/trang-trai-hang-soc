import { getCatalogItem } from '../data/catalog';
import { GRID_SIZE } from '../data/zones';
import { CatalogItem, PlacedBuilding, TerrainType, TileCell } from '../types/game';

export interface BuildingGates {
  entranceGx: number;
  entranceGy: number;
  exitGx: number;
  exitGy: number;
}

const TERRAIN_NAMES_VI: Record<TerrainType, string> = {
  grass: 'Cỏ Xanh',
  snow: 'Tuyết Trắng',
  stone: 'Đá Phiến',
  forest: 'Rêu Rừng Cấm',
  water: 'Nước Hồ Đen',
  volcanic: 'Đá Dung Nham',
};

export function getBuildingGates(b: PlacedBuilding, bw: number, bh: number): BuildingGates {
  const clampX = (x: number) => Math.max(0, Math.min(GRID_SIZE - 1, x));
  const clampY = (y: number) => Math.max(0, Math.min(GRID_SIZE - 1, y));
  const midX = b.gx + Math.floor(bw * 0.5);
  const midY = b.gy + Math.floor(bh * 0.5);

  switch (b.rotation) {
    case 0: // SE Front, SW Exit
      return {
        entranceGx: clampX(midX),
        entranceGy: clampY(b.gy + bh),
        exitGx: clampX(b.gx + bw),
        exitGy: clampY(midY),
      };
    case 1: // SW Front, NW Exit
      return {
        entranceGx: clampX(b.gx + bw),
        entranceGy: clampY(midY),
        exitGx: clampX(midX),
        exitGy: clampY(b.gy - 1),
      };
    case 2: // NW Front, NE Exit
      return {
        entranceGx: clampX(midX),
        entranceGy: clampY(b.gy - 1),
        exitGx: clampX(b.gx - 1),
        exitGy: clampY(midY),
      };
    case 3: // NE Front, SE Exit
    default:
      return {
        entranceGx: clampX(b.gx - 1),
        entranceGy: clampY(midY),
        exitGx: clampX(midX),
        exitGy: clampY(b.gy + bh),
      };
  }
}

export function traceQueueSlots(
  grid: TileCell[][],
  entranceGx: number,
  entranceGy: number,
  maxSlots = 8
): Array<{ gx: number; gy: number }> {
  const slots: Array<{ gx: number; gy: number }> = [];
  const visited = new Set<string>();

  // Start at entrance tile if it is a path/queue, or find adjacent queue_gold tile
  let cur: { gx: number; gy: number } | null = null;
  const startCell = grid[entranceGy]?.[entranceGx];
  if (startCell && startCell.path === 'queue_gold') {
    cur = { gx: entranceGx, gy: entranceGy };
  } else {
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const nx = entranceGx + dx;
      const ny = entranceGy + dy;
      if (grid[ny]?.[nx]?.path === 'queue_gold') {
        cur = { gx: nx, gy: ny };
        break;
      }
    }
  }

  // Fallback: if player used ordinary footpath at entrance, allow 2 cozy waiting slots right at entrance
  if (!cur) {
    if (startCell && startCell.path !== 'none') {
      return [{ gx: entranceGx, gy: entranceGy }];
    }
    return [];
  }

  while (cur && slots.length < maxSlots) {
    slots.push(cur);
    visited.add(`${cur.gx},${cur.gy}`);
    let next: { gx: number; gy: number } | null = null;
    const dirs: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (const [dx, dy] of dirs) {
      const nx: number = cur.gx + dx;
      const ny: number = cur.gy + dy;
      if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;
      if (visited.has(`${nx},${ny}`)) continue;
      if (grid[ny][nx].path === 'queue_gold') {
        next = { gx: nx, gy: ny };
        break;
      }
    }
    cur = next;
  }

  return slots;
}

export interface BiomeEvaluation {
  score: number;
  preferredLabel: string;
  matchingTiles: number;
  fenceCount: number;
  hasFeeder: boolean;
  hasNatureOrWater: boolean;
  tips: string[];
}

export function evaluateHabitatBiome(
  grid: TileCell[][],
  buildings: PlacedBuilding[],
  hab: PlacedBuilding,
  item: CatalogItem
): BiomeEvaluation {
  const prefs = item.preferredTerrains ?? ['grass', 'forest'];
  const preferredLabel = prefs.map((t) => TERRAIN_NAMES_VI[t]).join(' / ');

  let matchingTiles = 0;
  let waterTiles = 0;
  let fenceCount = 0;

  for (let dy = -2; dy <= item.height + 1; dy++) {
    for (let dx = -2; dx <= item.width + 1; dx++) {
      const tx = hab.gx + dx;
      const ty = hab.gy + dy;
      if (tx < 0 || ty < 0 || tx >= GRID_SIZE || ty >= GRID_SIZE) continue;
      const c = grid[ty][tx];
      if (prefs.includes(c.terrain)) matchingTiles++;
      if (c.terrain === 'water') waterTiles++;
      if (c.zooFence) fenceCount++;
    }
  }

  let hasFeeder = false;
  let hasGate = false;
  let treeDecorCount = 0;

  for (const b of buildings) {
    if (b.uid === hab.uid) continue;
    const dist = Math.hypot(b.gx - hab.gx, b.gy - hab.gy);
    if (dist > 5.5) continue;
    const it = getCatalogItem(b.itemId);
    if (!it) continue;
    if (it.isCreatureFeeder) hasFeeder = true;
    if (it.id === 'hogsmeade_stone_bridge' || it.id === 'halloween_arch') hasGate = true;
    if (it.isPrivacyShield || it.category === 'decor') treeDecorCount++;
  }

  const terrainPts = Math.min(36, matchingTiles * 3.2);
  const fencePts = Math.min(20, fenceCount * 3.5 + (hasGate ? 12 : 0));
  const feederPts = hasFeeder ? 22 : 0;
  const hasNatureOrWater = waterTiles > 0 || treeDecorCount > 0;
  const naturePts = Math.min(14, waterTiles * 4 + treeDecorCount * 4.5);

  const score = Math.min(100, Math.round(16 + terrainPts + fencePts + feederPts + naturePts));
  const tips: string[] = [];

  if (matchingTiles < 6) {
    tips.push(`Đặt hoặc dời chuồng tới khu vực có nền ${preferredLabel} tự nhiên`);
  }
  if (!hasFeeder) {
    tips.push('Đặt thêm "🍖 Máng Ăn & Cầu Đồ Chơi Thú" cạnh chuồng (+22%)');
  }
  if (fenceCount < 3 && !hasGate) {
    tips.push('Quây "🚧 Hàng Rào Khu Bảo Tồn" hoặc "⛩️ Cổng Cổ Ngữ" (+20%)');
  }
  if (!hasNatureOrWater) {
    tips.push('Đặt gần bờ suối tự nhiên hoặc trồng Thông Tuyết / Hàng Rào Cây gần bên');
  }

  return {
    score,
    preferredLabel,
    matchingTiles,
    fenceCount: fenceCount + (hasGate ? 3 : 0),
    hasFeeder,
    hasNatureOrWater,
    tips,
  };
}

export interface BackstageEvaluation {
  shieldCount: number;
  needed: number;
  isShielded: boolean;
}

export function evaluateBackstageShielding(
  grid: TileCell[][],
  buildings: PlacedBuilding[],
  hut: PlacedBuilding,
  bw: number,
  bh: number
): BackstageEvaluation {
  let shieldCount = 0;

  for (let dy = -2; dy <= bh + 1; dy++) {
    for (let dx = -2; dx <= bw + 1; dx++) {
      const tx = hut.gx + dx;
      const ty = hut.gy + dy;
      if (tx < 0 || ty < 0 || tx >= GRID_SIZE || ty >= GRID_SIZE) continue;
      if (grid[ty][tx].zooFence) shieldCount++;
    }
  }

  for (const b of buildings) {
    if (b.uid === hut.uid) continue;
    const it = getCatalogItem(b.itemId);
    if (!it?.isPrivacyShield) continue;
    const dist = Math.hypot(b.gx - (hut.gx + bw * 0.5), b.gy - (hut.gy + bh * 0.5));
    if (dist <= 3.6) {
      shieldCount += Math.max(1, it.width);
    }
  }

  const needed = 3;
  return {
    shieldCount,
    needed,
    isShielded: shieldCount >= needed,
  };
}
