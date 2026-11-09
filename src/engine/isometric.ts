import { GRID_SIZE } from '../data/zones';
import { TileCell } from '../types/game';

export const TILE_W = 72;
export const TILE_H = 36;
export const ELEV_PX = 14; // Vertical height per terrain elevation step (0..3)

export interface Camera {
  x: number; // World pixel offset at zoom = 1 (in rotated world space)
  y: number;
  zoom: number;
  viewRot?: 0 | 1 | 2 | 3; // 0 = Bắc (mặc định), 1 = Đông 90°, 2 = Nam 180°, 3 = Tây 270°
}

export const COMPASS_LABELS_VI: Record<0 | 1 | 2 | 3, string> = {
  0: '🧭 Bắc (0°)',
  1: '🧭 Đông (90°)',
  2: '🧭 Nam (180°)',
  3: '🧭 Tây (270°)',
};

export function rotateGridPoint(
  gx: number,
  gy: number,
  viewRot: 0 | 1 | 2 | 3 = 0
): { rx: number; ry: number } {
  switch (viewRot) {
    case 1:
      return { rx: GRID_SIZE - gy, ry: gx };
    case 2:
      return { rx: GRID_SIZE - gx, ry: GRID_SIZE - gy };
    case 3:
      return { rx: gy, ry: GRID_SIZE - gx };
    default:
      return { rx: gx, ry: gy };
  }
}

export function unrotateGridPoint(
  rx: number,
  ry: number,
  viewRot: 0 | 1 | 2 | 3 = 0
): { fgx: number; fgy: number } {
  switch (viewRot) {
    case 1:
      return { fgx: ry, fgy: GRID_SIZE - rx };
    case 2:
      return { fgx: GRID_SIZE - rx, fgy: GRID_SIZE - ry };
    case 3:
      return { fgx: GRID_SIZE - ry, fgy: rx };
    default:
      return { fgx: rx, fgy: ry };
  }
}

/**
 * Returns the top-back rotated corner (rx0, ry0) and rotated span (rbw, rbh)
 * of an axis-aligned grid box [gx, gx + bw] x [gy, gy + bh] so diamond vertices
 * and cliff faces render identically from all 4 90° camera angles!
 */
export function rotateGridRect(
  gx: number,
  gy: number,
  bw = 1,
  bh = 1,
  viewRot: 0 | 1 | 2 | 3 = 0
): { rx0: number; ry0: number; rbw: number; rbh: number } {
  switch (viewRot) {
    case 1:
      return { rx0: GRID_SIZE - (gy + bh), ry0: gx, rbw: bh, rbh: bw };
    case 2:
      return { rx0: GRID_SIZE - (gx + bw), ry0: GRID_SIZE - (gy + bh), rbw: bw, rbh: bh };
    case 3:
      return { rx0: gy, ry0: GRID_SIZE - (gx + bw), rbw: bh, rbh: bw };
    default:
      return { rx0: gx, ry0: gy, rbw: bw, rbh: bh };
  }
}

export function worldIso(gx: number, gy: number, viewRot: 0 | 1 | 2 | 3 = 0): { wx: number; wy: number } {
  const { rx, ry } = rotateGridPoint(gx, gy, viewRot);
  return {
    wx: (rx - ry) * (TILE_W * 0.5),
    wy: (rx + ry) * (TILE_H * 0.5),
  };
}

export function gridToScreen(
  gx: number,
  gy: number,
  cam: Camera,
  viewW: number,
  viewH: number,
  zOffset = 0
): { sx: number; sy: number } {
  const { wx, wy } = worldIso(gx, gy, cam.viewRot ?? 0);
  return {
    sx: viewW * 0.5 + (wx - cam.x) * cam.zoom,
    sy: viewH * 0.5 + (wy - zOffset - cam.y) * cam.zoom,
  };
}

export function rotatedTileDiamondToScreen(
  gx: number,
  gy: number,
  cam: Camera,
  viewW: number,
  viewH: number,
  zOffset = 0
): { sx: number; sy: number } {
  const { rx0, ry0 } = rotateGridRect(gx, gy, 1, 1, cam.viewRot ?? 0);
  const wx = (rx0 - ry0) * (TILE_W * 0.5);
  const wy = (rx0 + ry0) * (TILE_H * 0.5);
  return {
    sx: viewW * 0.5 + (wx - cam.x) * cam.zoom,
    sy: viewH * 0.5 + (wy - zOffset - cam.y) * cam.zoom,
  };
}

export function screenToGrid(
  sx: number,
  sy: number,
  cam: Camera,
  viewW: number,
  viewH: number,
  grid?: TileCell[][]
): { gx: number; gy: number; fgx: number; fgy: number } {
  const rot = cam.viewRot ?? 0;
  const wx = (sx - viewW * 0.5) / cam.zoom + cam.x;
  const wyBase = (sy - viewH * 0.5) / cam.zoom + cam.y;

  // Test from highest elevation down so elevated plateaus pick accurately in all 4 view rotations
  if (grid) {
    for (let elev = 3; elev >= 1; elev--) {
      const wy = wyBase + elev * ELEV_PX;
      const rx = (wx / (TILE_W * 0.5) + wy / (TILE_H * 0.5)) * 0.5;
      const ry = (wy / (TILE_H * 0.5) - wx / (TILE_W * 0.5)) * 0.5;
      const { fgx, fgy } = unrotateGridPoint(rx, ry, rot);
      const gx = Math.floor(fgx);
      const gy = Math.floor(fgy);
      if (gx >= 0 && gy >= 0 && gx < GRID_SIZE && gy < GRID_SIZE) {
        if ((grid[gy][gx].elevation ?? 0) === elev) {
          return { gx, gy, fgx, fgy };
        }
      }
    }
  }

  const rx = (wx / (TILE_W * 0.5) + wyBase / (TILE_H * 0.5)) * 0.5;
  const ry = (wyBase / (TILE_H * 0.5) - wx / (TILE_W * 0.5)) * 0.5;
  const { fgx, fgy } = unrotateGridPoint(rx, ry, rot);

  return {
    gx: Math.floor(fgx),
    gy: Math.floor(fgy),
    fgx,
    fgy,
  };
}

export function getCameraFocusGrid(cam: Camera): { fgx: number; fgy: number } {
  const rot = cam.viewRot ?? 0;
  const rx = (cam.x / (TILE_W * 0.5) + cam.y / (TILE_H * 0.5)) * 0.5;
  const ry = (cam.y / (TILE_H * 0.5) - cam.x / (TILE_W * 0.5)) * 0.5;
  return unrotateGridPoint(rx, ry, rot);
}

export function centerCameraOnGrid(cam: Camera, gx: number, gy: number): void {
  const { wx, wy } = worldIso(gx, gy, cam.viewRot ?? 0);
  cam.x = wx;
  cam.y = wy;
}

export function rotateCamera90(cam: Camera, delta: 1 | -1 = 1): void {
  const focus = getCameraFocusGrid(cam);
  cam.viewRot = (((cam.viewRot ?? 0) + delta + 4) % 4) as 0 | 1 | 2 | 3;
  centerCameraOnGrid(cam, focus.fgx, focus.fgy);
}
