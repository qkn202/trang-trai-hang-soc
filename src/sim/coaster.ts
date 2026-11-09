import { getCatalogItem } from '../data/catalog';
import { GRID_SIZE } from '../data/zones';
import { CoasterTrackStats, PlacedBuilding, TileCell, TileOverrideData } from '../types/game';

export interface TrackWaypoint {
  gx: number;
  gy: number;
  elev: number;
}

export interface CoasterCarSample {
  gx: number;
  gy: number;
  elev: number;
  dirX: number;
  dirGx: number;
  dirGy: number;
  speedKmh: number;
  onChainLift: boolean;
}

const ORTHO: Array<[number, number]> = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export function traceCoasterCircuit(
  grid: TileCell[][],
  buildings: PlacedBuilding[],
  station: PlacedBuilding,
  bw: number,
  bh: number
): { waypoints: TrackWaypoint[]; stats: CoasterTrackStats } {
  const startCandidates: Array<{ gx: number; gy: number }> = [];

  for (let dy = -1; dy <= bh; dy++) {
    for (let dx = -1; dx <= bw; dx++) {
      const isPerimeter = dx === -1 || dx === bw || dy === -1 || dy === bh;
      const isCorner = (dx === -1 || dx === bw) && (dy === -1 || dy === bh);
      if (!isPerimeter || isCorner) continue;
      const tx = station.gx + dx;
      const ty = station.gy + dy;
      if (tx >= 0 && ty >= 0 && tx < GRID_SIZE && ty < GRID_SIZE) {
        if (grid[ty][tx].coasterTrack) {
          startCandidates.push({ gx: tx, gy: ty });
        }
      }
    }
  }

  const stationElev = grid[station.gy]?.[station.gx]?.elevation ?? 0;
  const stationCenter: TrackWaypoint = {
    gx: station.gx + bw * 0.5 - 0.5,
    gy: station.gy + bh * 0.5 - 0.5,
    elev: stationElev,
  };

  if (startCandidates.length === 0) {
    return {
      waypoints: [],
      stats: {
        tileCount: 0,
        lengthMeters: 0,
        maxDrop: 0,
        turns: 0,
        hasChainLift: false,
        topSpeedKmh: 28,
        isClosedCircuit: false,
        excitement: 2.5,
        intensity: 1.5,
        nausea: 0.8,
      },
    };
  }

  const visited = new Set<string>();
  const ordered: TrackWaypoint[] = [stationCenter];
  let cur = startCandidates[0];
  visited.add(`${cur.gx},${cur.gy}`);
  ordered.push({ gx: cur.gx, gy: cur.gy, elev: grid[cur.gy][cur.gx].elevation });

  let prevDir: [number, number] | null = null;
  let turns = 0;
  let maxElev = stationElev;
  let minElevAfterPeak = stationElev;
  let maxDrop = 0;
  let hasChainLift = grid[cur.gy][cur.gx].elevation > stationElev;

  for (let step = 0; step < 96; step++) {
    let nextTile: { gx: number; gy: number; dir: [number, number] } | null = null;

    const orderedDirs: Array<[number, number]> = prevDir
      ? [prevDir, ...ORTHO.filter((d) => d[0] !== prevDir![0] || d[1] !== prevDir![1])]
      : ORTHO;

    for (const [dx, dy] of orderedDirs) {
      const nx = cur.gx + dx;
      const ny = cur.gy + dy;
      if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) continue;
      const k = `${nx},${ny}`;
      if (visited.has(k)) continue;
      if (grid[ny][nx].coasterTrack) {
        nextTile = { gx: nx, gy: ny, dir: [dx, dy] };
        break;
      }
    }

    if (!nextTile) break;
    if (prevDir && (prevDir[0] !== nextTile.dir[0] || prevDir[1] !== nextTile.dir[1])) {
      turns++;
    }
    const prevElev = grid[cur.gy][cur.gx].elevation;
    prevDir = nextTile.dir;
    cur = { gx: nextTile.gx, gy: nextTile.gy };
    visited.add(`${cur.gx},${cur.gy}`);

    const e = grid[cur.gy][cur.gx].elevation;
    if (e > prevElev) hasChainLift = true;
    if (e > maxElev) {
      maxElev = e;
      minElevAfterPeak = e;
    } else if (e < minElevAfterPeak) {
      minElevAfterPeak = e;
      maxDrop = Math.max(maxDrop, maxElev - minElevAfterPeak);
    }

    ordered.push({ gx: cur.gx, gy: cur.gy, elev: e });
  }

  // Check if end tile orthogonally touches station perimeter (closed circuit — excludes diagonal corners!)
  const inX = cur.gx >= station.gx && cur.gx < station.gx + bw;
  const inY = cur.gy >= station.gy && cur.gy < station.gy + bh;
  const adjX = cur.gx === station.gx - 1 || cur.gx === station.gx + bw;
  const adjY = cur.gy === station.gy - 1 || cur.gy === station.gy + bh;
  const touchesStation = ordered.length >= 5 && ((inX && adjY) || (inY && adjX));

  if (touchesStation) {
    ordered.push(stationCenter);
  }

  // Bonus wonder from nearby scenery & water
  let sceneryBonus = 0;
  for (const b of buildings) {
    if (b.uid === station.uid) continue;
    const it = getCatalogItem(b.itemId);
    if (!it || it.wonder <= 0) continue;
    const d = Math.hypot(b.gx - station.gx, b.gy - station.gy);
    if (d <= 6) {
      sceneryBonus += Math.min(0.45, it.wonder * 0.06);
    }
  }

  const tileCount = ordered.length - (touchesStation ? 2 : 1);
  const lengthMeters = tileCount * 14;
  const topSpeedKmh = Math.round(38 + Math.sqrt(Math.max(0, maxDrop)) * 31 + (touchesStation ? 6 : 0));
  const loopBonus = touchesStation ? 1.4 : 0.3;
  const excitement = Math.min(
    10.0,
    Math.round(
      (3.4 +
        Math.min(2.8, tileCount * 0.18) +
        maxDrop * 1.15 +
        Math.min(1.5, turns * 0.22) +
        loopBonus +
        Math.min(1.4, sceneryBonus)) *
        10
    ) / 10
  );
  const intensity = Math.min(
    10.0,
    Math.round((2.6 + maxDrop * 1.45 + Math.min(2.6, turns * 0.32) + tileCount * 0.08) * 10) / 10
  );
  const nausea = Math.min(8.5, Math.round((1.2 + turns * 0.26 + maxDrop * 0.42) * 10) / 10);

  return {
    waypoints: ordered,
    stats: {
      tileCount,
      lengthMeters,
      maxDrop,
      turns,
      hasChainLift,
      topSpeedKmh,
      isClosedCircuit: touchesStation,
      excitement,
      intensity,
      nausea,
    },
  };
}

/**
 * Gravity & Chain-Lift Physics Sampler (RCT Classic Feel):
 * Trains climb uphill slowly on brass chain lifts (~1.15 tiles/s) and
 * accelerate rapidly down drops via potential -> kinetic energy conversion!
 */
export function sampleCoasterTrainPositions(
  waypoints: TrackWaypoint[],
  isClosedCircuit: boolean,
  timeSec: number,
  carCount = 3
): CoasterCarSample[] {
  if (waypoints.length < 3) return [];

  const segCount = waypoints.length - 1;
  let peakElev = 0;
  for (const w of waypoints) {
    if (w.elev > peakElev) peakElev = w.elev;
  }

  // Precompute per-segment speeds, true Euclidean arc lengths, and cumulative travel time
  const segSpeed: number[] = [];
  const segChain: boolean[] = [];
  const cumLen: number[] = [0];
  const cumTime: number[] = [0];
  let totalLen = 0;
  let totalTime = 0;

  for (let i = 0; i < segCount; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const segLen = Math.max(0.25, Math.hypot(b.gx - a.gx, b.gy - a.gy));
    const climbing = b.elev > a.elev;
    let v: number;
    if (climbing) {
      v = 1.12; // Steady chain-lift climb!
    } else {
      const avgElev = (a.elev + b.elev) * 0.5;
      const dropFromPeak = Math.max(0, peakElev - avgElev);
      v = 1.9 + Math.sqrt(dropFromPeak) * 1.95;
    }
    segSpeed.push(v);
    segChain.push(climbing);
    totalLen += segLen;
    cumLen.push(totalLen);
    totalTime += segLen / v;
    cumTime.push(totalTime);
  }

  const evalAtArcDistance = (arcParam: number): CoasterCarSample => {
    let d: number;
    let dirSign = 1;
    if (isClosedCircuit) {
      d = ((arcParam % totalLen) + totalLen) % totalLen;
    } else {
      const period = totalLen * 2;
      const mod = ((arcParam % period) + period) % period;
      if (mod <= totalLen) {
        d = mod;
      } else {
        d = period - mod;
        dirSign = -1;
      }
    }
    let idx = 0;
    for (let i = 0; i < segCount; i++) {
      if (d >= cumLen[i] && d <= cumLen[i + 1]) {
        idx = i;
        break;
      }
    }
    const segSpan = Math.max(0.0001, cumLen[idx + 1] - cumLen[idx]);
    const frac = Math.min(1, Math.max(0, (d - cumLen[idx]) / segSpan));
    const a = waypoints[idx];
    const b = waypoints[idx + 1];
    const dirGx = (b.gx - a.gx) * dirSign;
    const dirGy = (b.gy - a.gy) * dirSign;
    return {
      gx: a.gx + (b.gx - a.gx) * frac,
      gy: a.gy + (b.gy - a.gy) * frac,
      elev: a.elev + (b.elev - a.elev) * frac,
      dirX: (dirGx - dirGy),
      dirGx,
      dirGy,
      speedKmh: Math.round(segSpeed[idx] * 18.5),
      onChainLift: segChain[idx],
    };
  };

  // Find lead car arc-length position from physics time!
  let leadTime: number;
  if (isClosedCircuit) {
    leadTime = ((timeSec % totalTime) + totalTime) % totalTime;
  } else {
    const p2 = totalTime * 2;
    const mod = ((timeSec % p2) + p2) % p2;
    leadTime = mod <= totalTime ? mod : p2 - mod;
  }

  let leadArc = 0;
  for (let i = 0; i < segCount; i++) {
    if (leadTime >= cumTime[i] && leadTime <= cumTime[i + 1]) {
      const span = Math.max(0.0001, cumTime[i + 1] - cumTime[i]);
      const tFrac = (leadTime - cumTime[i]) / span;
      leadArc = cumLen[i] + tFrac * (cumLen[i + 1] - cumLen[i]);
      break;
    }
  }

  const result: CoasterCarSample[] = [];
  for (let c = 0; c < carCount; c++) {
    // Constant physical coupling gap (0.56 tiles) between coupled minecarts!
    result.push(evalAtArcDistance(leadArc - c * 0.56));
  }

  return result;
}

export function buildSampleCoasterLoop(
  grid: TileCell[][],
  tileOverrides: Record<string, TileOverrideData>,
  unlockedSet: Set<string>,
  sandboxMode: boolean,
  station: PlacedBuilding,
  bw: number,
  bh: number
): { placedCount: number; cost: number } {
  const candidateLoops: Array<Array<{ gx: number; gy: number; elev: number }>> = [
    [
      { gx: station.gx + bw, gy: station.gy, elev: 1 },
      { gx: station.gx + bw + 1, gy: station.gy, elev: 2 },
      { gx: station.gx + bw + 2, gy: station.gy, elev: 2 },
      { gx: station.gx + bw + 2, gy: station.gy + 1, elev: 1 },
      { gx: station.gx + bw + 2, gy: station.gy + 2, elev: 0 },
      { gx: station.gx + bw + 1, gy: station.gy + 2, elev: 0 },
      { gx: station.gx + bw, gy: station.gy + 2, elev: 0 },
      { gx: station.gx + bw, gy: station.gy + 1, elev: 0 },
    ],
    [
      { gx: station.gx - 1, gy: station.gy, elev: 1 },
      { gx: station.gx - 2, gy: station.gy, elev: 2 },
      { gx: station.gx - 3, gy: station.gy, elev: 2 },
      { gx: station.gx - 3, gy: station.gy + 1, elev: 1 },
      { gx: station.gx - 3, gy: station.gy + 2, elev: 0 },
      { gx: station.gx - 2, gy: station.gy + 2, elev: 0 },
      { gx: station.gx - 1, gy: station.gy + 2, elev: 0 },
      { gx: station.gx - 1, gy: station.gy + 1, elev: 0 },
    ],
    [
      { gx: station.gx, gy: station.gy - 1, elev: 1 },
      { gx: station.gx, gy: station.gy - 2, elev: 2 },
      { gx: station.gx + 1, gy: station.gy - 2, elev: 2 },
      { gx: station.gx + 2, gy: station.gy - 2, elev: 1 },
      { gx: station.gx + 2, gy: station.gy - 1, elev: 0 },
      { gx: station.gx + 1, gy: station.gy - 1, elev: 0 },
    ],
    [
      { gx: station.gx, gy: station.gy + bh, elev: 1 },
      { gx: station.gx, gy: station.gy + bh + 1, elev: 2 },
      { gx: station.gx + 1, gy: station.gy + bh + 1, elev: 2 },
      { gx: station.gx + 2, gy: station.gy + bh + 1, elev: 1 },
      { gx: station.gx + 2, gy: station.gy + bh, elev: 0 },
      { gx: station.gx + 1, gy: station.gy + bh, elev: 0 },
    ],
  ];

  for (const loop of candidateLoops) {
    const valid = loop.every((pt) => {
      if (pt.gx < 0 || pt.gy < 0 || pt.gx >= GRID_SIZE || pt.gy >= GRID_SIZE) return false;
      const c = grid[pt.gy][pt.gx];
      if (!sandboxMode && !unlockedSet.has(c.zoneId)) return false;
      if (c.buildingUid) return false;
      return true;
    });

    if (valid) {
      let placed = 0;
      for (const pt of loop) {
        const key = `${pt.gx},${pt.gy}`;
        const cell = grid[pt.gy][pt.gx];
        if (!cell.coasterTrack) placed++;
        cell.coasterTrack = true;
        cell.elevation = Math.max(cell.elevation, pt.elev);
        tileOverrides[key] = {
          ...tileOverrides[key],
          coasterTrack: true,
          elevation: cell.elevation,
        };
      }
      return { placedCount: placed, cost: placed * 14 };
    }
  }

  return { placedCount: 0, cost: 0 };
}
