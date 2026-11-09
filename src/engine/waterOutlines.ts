/**
 * Organic water shoreline.
 *
 * The base terrain pass fills every water tile as an individual diamond, so
 * lakes read as a checkerboard of hard-cornered squares with visible grid
 * seams. This module extracts the true outer boundary of each contiguous
 * water body and smooths it into a closed Catmull-Rom loop, which the
 * renderer projects to screen and strokes as one continuous rounded shore.
 *
 * Everything here is view-rotation / camera independent: it only depends on
 * the water + elevation layout, so the renderer computes it once per map
 * revision and re-projects every frame cheaply.
 */

/** One closed shoreline loop. `pts` is a smooth closed polyline in grid-corner space. */
export interface WaterLoop {
  /** Closed polyline in grid-corner space; last point connects to first. */
  pts: Array<{ i: number; j: number }>;
  /** Terrain elevation (in ELEV_PX cell units) the shore should be drawn on. */
  elev: number;
  /** Zone ids the lake touches (so the renderer can skip locked zones). */
  zones: string[];
}

/**
 * Extract rounded shoreline loops for every contiguous water body.
 *
 * `water[gy * size + gx]` is true for water cells; `elev[gy * size + gx]`
 * is that cell's terrain elevation; `zoneOf` maps a cell to its zone id
 * (used so locked zones skip the shoreline — their mist glaze darkens the
 * water, and a bright sand band would cut through it).
 *
 * Corner convention: corner (i, j) is the *top* vertex of the diamond at
 * cell (i, j), so a cell's four corners are top=(i,j), right=(i+1,j),
 * bottom=(i+1,j+1), left=(i,j+1).
 */
export function computeWaterShoreLoops(
  water: boolean[],
  elev: number[],
  size: number,
  zoneOf: (gx: number, gy: number) => string
): WaterLoop[] {
  const isWater = (gx: number, gy: number) =>
    gx >= 0 && gy >= 0 && gx < size && gy < size && water[gy * size + gx];

  // 1. Emit boundary unit-segments. For each water cell, add a clockwise edge
  //    (in corner space) for every non-water neighbour.
  interface Corner {
    i: number;
    j: number;
    e: number;
    zone: string;
  }
  const segs: Array<[Corner, Corner]> = [];
  for (let gy = 0; gy < size; gy++) {
    for (let gx = 0; gx < size; gx++) {
      if (!isWater(gx, gy)) continue;
      const e = elev[gy * size + gx] || 0;
      const zone = zoneOf(gx, gy);
      const c = (i: number, j: number): Corner => ({ i, j, e, zone });
      if (!isWater(gx, gy - 1)) segs.push([c(gx, gy), c(gx + 1, gy)]); // north
      if (!isWater(gx + 1, gy)) segs.push([c(gx + 1, gy), c(gx + 1, gy + 1)]); // east
      if (!isWater(gx, gy + 1)) segs.push([c(gx, gy + 1), c(gx + 1, gy + 1)]); // south
      if (!isWater(gx - 1, gy)) segs.push([c(gx, gy), c(gx, gy + 1)]); // west
    }
  }

  if (segs.length === 0) return [];

  // 2. Chain segments into closed loops. Build a corner -> incident-segment
  //    map; a well-formed water region's outer boundary is a simple polygon
  //    so each corner normally meets two segments and the walk is clean.
  const keyOf = (c: Corner) => c.i * 4096 + c.j;
  const adj = new Map<number, number[]>();
  segs.forEach((seg, k) => {
    const ka = keyOf(seg[0]);
    const kb = keyOf(seg[1]);
    adj.set(ka, [...(adj.get(ka) ?? []), k]);
    adj.set(kb, [...(adj.get(kb) ?? []), k]);
  });

  const used = new Array(segs.length).fill(false);
  const loops: Array<{ pts: Corner[]; elev: number; zones: string[] }> = [];

  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    used[s0] = true;
    const startCorner = segs[s0][0];
    const startKey = keyOf(startCorner);
    let cur = segs[s0][1];
    const loop: Corner[] = [startCorner, cur];

    // Walk forward from `cur`, leaving on the only other un-visited segment
    // that touches the current corner, until we close back on the start.
    for (let guard = 0; guard < segs.length + 2; guard++) {
      const curKey = keyOf(cur);
      if (curKey === startKey) break; // closed
      const incident = adj.get(curKey);
      if (!incident || incident.length === 0) break; // open chain (rare)
      // Choose the next segment: prefer one that isn't the one we came in
      // on (we track that by "used"), and that continues the shore.
      let nextSeg = -1;
      for (const cand of incident) {
        if (!used[cand]) {
          nextSeg = cand;
          break;
        }
      }
      if (nextSeg === -1) break;
      used[nextSeg] = true;
      const a = segs[nextSeg][0];
      const b = segs[nextSeg][1];
      // Continue from whichever end isn't where we already are.
      const cont = keyOf(a) === curKey ? b : a;
      loop.push(cont);
      cur = cont;
      if (keyOf(cur) === startKey) break;
    }

    if (loop.length >= 4) {
      const zones: string[] = [];
      const seen = new Set<string>();
      for (const c of loop) {
        if (!seen.has(c.zone)) {
          seen.add(c.zone);
          zones.push(c.zone);
        }
      }
      loops.push({ pts: loop, elev: loop[0].e, zones });
    }
  }

  // 3. Smooth each loop with a closed Catmull-Rom subdivision so the
  //    staircase diamond edges become a soft organic shoreline.
  return loops.map((l) => ({
    pts: smoothClosedLoop(l.pts),
    elev: l.elev,
    zones: l.zones,
  }));
}

/** Closed Catmull-Rom subdivision: each corner feeds 3 curve samples. */
function smoothClosedLoop(loop: Array<{ i: number; j: number }>): Array<{ i: number; j: number }> {
  const n = loop.length;
  if (n < 4) return loop;

  const samplesPerSeg = 3;
  const pts: Array<{ i: number; j: number }> = [];
  const P = (k: number) => loop[((k % n) + n) % n];

  for (let s = 0; s < n; s++) {
    const p0 = P(s - 1);
    const p1 = P(s);
    const p2 = P(s + 1);
    const p3 = P(s + 2);
    for (let t = 0; t < samplesPerSeg; t++) {
      const u = t / samplesPerSeg;
      const u2 = u * u;
      const u3 = u2 * u;
      // Uniform Catmull-Rom basis (tension 0.5, centripetal-ish enough for
      // a decorative shoreline).
      const i =
        0.5 *
        (2 * p1.i +
          (-p0.i + p2.i) * u +
          (2 * p0.i - 5 * p1.i + 4 * p2.i - p3.i) * u2 +
          (-p0.i + 3 * p1.i - 3 * p2.i + p3.i) * u3);
      const j =
        0.5 *
        (2 * p1.j +
          (-p0.j + p2.j) * u +
          (2 * p0.j - 5 * p1.j + 4 * p2.j - p3.j) * u2 +
          (-p0.j + 3 * p1.j - 3 * p2.j + p3.j) * u3);
      // Round to 3 decimals — enough for a shoreline, keeps the cache small.
      pts.push({ i: Math.round(i * 1000) / 1000, j: Math.round(j * 1000) / 1000 });
    }
  }
  return pts;
}
