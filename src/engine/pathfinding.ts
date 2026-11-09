import { GRID_SIZE } from '../data/zones';
import { TileCell } from '../types/game';

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function findNextStepOnPaths(
  grid: TileCell[][],
  unlockedSet: Set<string>,
  startGx: number,
  startGy: number,
  goalGx: number,
  goalGy: number,
  maxNodes = 180
): { nx: number; ny: number } | null {
  const sx = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(startGx)));
  const sy = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(startGy)));
  const tx = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(goalGx)));
  const ty = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(goalGy)));

  if (sx === tx && sy === ty) return null;

  const key = (x: number, y: number) => y * GRID_SIZE + x;
  const visited = new Set<number>([key(sx, sy)]);
  const firstMove = new Map<number, { nx: number; ny: number }>();
  const queue: Array<{ x: number; y: number }> = [{ x: sx, y: sy }];

  let bestFallback: { nx: number; ny: number; dist: number } | null = null;
  let explored = 0;

  while (queue.length > 0 && explored < maxNodes) {
    const cur = queue.shift()!;
    explored++;

    for (const [dx, dy] of DIRS) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;

      const nk = key(nx, ny);
      if (visited.has(nk)) continue;

      const cell = grid[ny][nx];
      if (!unlockedSet.has(cell.zoneId)) continue;

      const isGoal = Math.abs(nx - tx) + Math.abs(ny - ty) <= 1;
      if (cell.path === 'none' && !isGoal) continue;

      visited.add(nk);
      const step = cur.x === sx && cur.y === sy ? { nx, ny } : firstMove.get(key(cur.x, cur.y))!;
      firstMove.set(nk, step);

      if (nx === tx && ny === ty) {
        return step;
      }

      const d = Math.abs(nx - tx) + Math.abs(ny - ty);
      if (!bestFallback || d < bestFallback.dist) {
        bestFallback = { nx: step.nx, ny: step.ny, dist: d };
      }

      queue.push({ x: nx, y: ny });
    }
  }

  return bestFallback ? { nx: bestFallback.nx, ny: bestFallback.ny } : null;
}

export function getRandomUnlockedPathTile(
  grid: TileCell[][],
  unlockedSet: Set<string>
): { gx: number; gy: number } | null {
  const candidates: Array<{ gx: number; gy: number }> = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const c = grid[y][x];
      if (c.path !== 'none' && unlockedSet.has(c.zoneId)) {
        candidates.push({ gx: x, gy: y });
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
