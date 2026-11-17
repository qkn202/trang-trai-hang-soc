import { describe, expect, it } from 'vitest';
import { entitiesSortDrawablesTopological } from '../renderEntitiesAndWeather';
import type { TopologicalDrawCmd } from '../rendererShared';

// HPVN: the pre-optimisation sort (every pair, per-item edge arrays), kept as the reference order.
function referenceSort(items: TopologicalDrawCmd[]): TopologicalDrawCmd[] {
  const n = items.length;
  if (n <= 1) return items;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const inDeg = new Int32Array(n);
  const eps = 0.04;
  for (let i = 0; i < n; i++) {
    const a = items[i];
    for (let j = i + 1; j < n; j++) {
      const b = items[j];
      if (a.rxMax - a.ryMin <= b.rxMin - b.ryMax + eps || b.rxMax - b.ryMin <= a.rxMin - a.ryMax + eps) continue;
      const ab = (a.rxMax <= b.rxMin + eps && a.ryMin < b.ryMax - eps) || (a.ryMax <= b.ryMin + eps && a.rxMin < b.rxMax - eps);
      const ba = (b.rxMax <= a.rxMin + eps && b.ryMin < a.ryMax - eps) || (b.ryMax <= a.ryMin + eps && b.rxMin < a.rxMax - eps);
      if (ab && !ba) { adj[i].push(j); inDeg[j]++; } else if (ba && !ab) { adj[j].push(i); inDeg[i]++; }
    }
  }
  const ready: number[] = [];
  for (let i = 0; i < n; i++) if (inDeg[i] === 0) ready.push(i);
  ready.sort((u, v) => items[u].depth - items[v].depth);
  const out: TopologicalDrawCmd[] = [];
  const emitted = new Uint8Array(n);
  while (ready.length) {
    const cur = ready.shift()!;
    emitted[cur] = 1;
    out.push(items[cur]);
    for (const nx of adj[cur]) {
      if (--inDeg[nx] === 0) {
        const d = items[nx].depth;
        let lo = 0, hi = ready.length;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (items[ready[mid]].depth <= d) lo = mid + 1; else hi = mid; }
        ready.splice(lo, 0, nx);
      }
    }
  }
  const rest = items.filter((_, i) => !emitted[i]).sort((a, b) => a.depth - b.depth);
  return out.concat(rest);
}

describe('entitiesSortDrawablesTopological', () => {
  it('draws in the same order as the all-pairs sort (overlaps, ties and cycles included)', () => {
    let seed = 1;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const sizes = [0.3, 1, 2, 3];
    for (let trial = 0; trial < 200; trial++) {
      const n = 1 + Math.floor(rnd() * 300);
      const items: TopologicalDrawCmd[] = [];
      for (let k = 0; k < n; k++) {
        const rx = Math.floor(rnd() * 30) + (rnd() < 0.3 ? rnd() : 0);
        const ry = Math.floor(rnd() * 30);
        const w = sizes[Math.floor(rnd() * 4)];
        const h = sizes[Math.floor(rnd() * 4)];
        items.push({ rxMin: rx, ryMin: ry, rxMax: rx + w, ryMax: ry + h, depth: rx + ry + (rnd() < 0.5 ? 0 : w), draw: () => {} });
      }
      const sorted = entitiesSortDrawablesTopological(null as never, items);
      expect(sorted.map((c) => items.indexOf(c))).toEqual(referenceSort(items).map((c) => items.indexOf(c)));
    }
  });
});
