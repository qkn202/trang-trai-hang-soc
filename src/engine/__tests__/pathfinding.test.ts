import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../../data/zones';
import { TileCell, ZoneId } from '../../types/game';
import { findNextStepOnPaths, getRandomUnlockedPathTile } from '../pathfinding';

function createBlankTestGrid(): TileCell[][] {
  const grid: TileCell[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: TileCell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        gx: x,
        gy: y,
        terrain: 'grass',
        path: 'none',
        elevation: 0,
        coasterTrack: false,
        zooFence: false,
        hasLitter: false,
        zoneId: 'ga_hogsmeade' as ZoneId,
        buildingUid: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

describe('pathfinding.ts - Tìm đường đi trên mạng lưới đường xá', () => {
  it('Trả về null khi điểm bắt đầu trùng điểm đích', () => {
    const grid = createBlankTestGrid();
    const unlocked = new Set<string>(['ga_hogsmeade']);
    const step = findNextStepOnPaths(grid, unlocked, 10, 10, 10, 10);
    expect(step).toBeNull();
  });

  it('Tìm bước đi tiếp theo chính xác dọc theo tuyến đường', () => {
    const grid = createBlankTestGrid();
    const unlocked = new Set<string>(['ga_hogsmeade']);

    // Tạo tuyến đường thẳng từ (5, 5) -> (5, 8)
    grid[5][5].path = 'cobble';
    grid[6][5].path = 'cobble';
    grid[7][5].path = 'cobble';
    grid[8][5].path = 'cobble';

    const step = findNextStepOnPaths(grid, unlocked, 5, 5, 5, 8);
    expect(step).not.toBeNull();
    expect(step!.nx).toBe(5);
    expect(step!.ny).toBe(6); // Đi xuống (5, 6)
  });

  it('Không đi xuyên qua vùng đất chưa mở khóa (zone lock)', () => {
    const grid = createBlankTestGrid();
    const unlocked = new Set<string>(['ga_hogsmeade']);

    // Tạo đường đi nhưng ô ở giữa thuộc zone chưa mở
    grid[5][5].path = 'cobble';
    grid[6][5].path = 'cobble';
    grid[6][5].zoneId = 'rung_cam' as ZoneId; // Khóa!
    grid[7][5].path = 'cobble';

    const step = findNextStepOnPaths(grid, unlocked, 5, 5, 5, 7);
    // Vì ô (5, 6) bị khóa nên không thể đi qua
    if (step) {
      expect(step.ny).not.toBe(6);
    }
  });

  it('getRandomUnlockedPathTile trả về ô ngẫu nhiên thuộc danh sách ô đã mở', () => {
    const grid = createBlankTestGrid();
    const unlocked = new Set<string>(['ga_hogsmeade']);

    grid[3][3].path = 'cobble';
    grid[4][4].path = 'wood_pier';

    const picked = getRandomUnlockedPathTile(grid, unlocked);
    expect(picked).not.toBeNull();
    const isOneOfTwo =
      (picked!.gx === 3 && picked!.gy === 3) || (picked!.gx === 4 && picked!.gy === 4);
    expect(isOneOfTwo).toBe(true);
  });

  it('getRandomUnlockedPathTile trả về null khi không có ô đường nào', () => {
    const grid = createBlankTestGrid();
    const unlocked = new Set<string>(['ga_hogsmeade']);

    const picked = getRandomUnlockedPathTile(grid, unlocked);
    expect(picked).toBeNull();
  });
});
