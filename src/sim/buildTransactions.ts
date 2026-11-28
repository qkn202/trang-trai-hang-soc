// Transaction / Undo-Redo cho Build Mode (P0.3 — stroke-based, session-only).
//
// Thiết kế: mỗi "stroke" (1 lần chạm + kéo trên canvas) là 1 bước undo. Trước
// stroke bắt đầu, snapshot các field mà build/move/remove/brush có thể chạm tới.
// Không persist vào save schema (không thêm field lên GameState) — undo/redo chỉ
// sống trong phiên hiện tại, khớp yêu cầu "không đổi save cũ".
//
// Các mutation (worldPlaceItem / worldMoveBuilding / worldRemoveAtTile / farm brush)
// được gọi trong khi sim.suppressPerActionSave = true để gộp N lần saveToStorage +
// onUiChange (mà từng action đơn lẻ gọi bên trong) xuống đúng 1 lần commit ở cuối
// stroke — tránh serialize bản lưu + refresh DOM gây GC stutter khi kéo brush.

import type { PlacedBuilding, TileOverrideData } from '../types/game';
import type { ParkSimulation } from './simulation';

export interface BuildSnapshot {
  galleons: number;
  xp: number;
  level?: number;
  stars: number;
  buildings: PlacedBuilding[];
  tileOverrides: Record<string, TileOverrideData>;
  stashedDecorInventory?: Record<string, number>;
  stashedDecorStars?: Record<string, number[]>;
  after?: {
    galleons: number;
    xp: number;
    level?: number;
    stars: number;
    buildings: PlacedBuilding[];
    tileOverrides: Record<string, TileOverrideData>;
    stashedDecorInventory?: Record<string, number>;
    stashedDecorStars?: Record<string, number[]>;
  };
}

const MAX_BUILD_UNDO = 30;

export function buildTxnCapture(sim: ParkSimulation): BuildSnapshot {
  return {
    galleons: sim.state.galleons,
    xp: sim.state.xp,
    level: sim.state.level,
    stars: sim.state.match3?.stars ?? 0,
    buildings: structuredClone(sim.state.buildings),
    tileOverrides: structuredClone(sim.state.tileOverrides),
    stashedDecorInventory: sim.state.stashedDecorInventory
      ? structuredClone(sim.state.stashedDecorInventory)
      : undefined,
    stashedDecorStars: sim.state.stashedDecorStars
      ? structuredClone(sim.state.stashedDecorStars)
      : undefined,
  };
}

function hasActiveFarmWork(b: PlacedBuilding): boolean {
  return Boolean(
    b.cropId ||
      b.pastureAnimalId ||
      (b.workshopQueue && b.workshopQueue.length > 0) ||
      (b.readyFarmGoods && b.readyFarmGoods.length > 0)
  );
}

function buildTxnApplyTransition(
  sim: ParkSimulation,
  fromSnap: Omit<BuildSnapshot, 'after'>,
  toSnap: Omit<BuildSnapshot, 'after'>
): boolean {
  const deltaSickles = toSnap.galleons - fromSnap.galleons;
  const deltaStars = toSnap.stars - fromSnap.stars;
  const deltaXp = toSnap.xp - fromSnap.xp;

  const curStars = sim.state.match3?.stars ?? 0;
  if (sim.state.galleons + deltaSickles < 0 || curStars + deltaStars < 0) {
    return false;
  }

  const fromByUid = new Map(fromSnap.buildings.map((b) => [b.uid, b]));
  const toByUid = new Map(toSnap.buildings.map((b) => [b.uid, b]));
  const liveByUid = new Map(sim.state.buildings.map((b) => [b.uid, b]));

  // Refuse undoing/removing OR overwriting a building that subsequently gained active farm work or star upgrades
  for (const [uid, fromB] of fromByUid) {
    const toB = toByUid.get(uid);
    const liveB = liveByUid.get(uid);
    if (!toB) {
      if (!liveB) return false;
      if (!hasActiveFarmWork(fromB) && hasActiveFarmWork(liveB)) {
        return false;
      }
    } else if (liveB && JSON.stringify(fromB) !== JSON.stringify(toB)) {
      if (!hasActiveFarmWork(fromB) && hasActiveFarmWork(liveB)) {
        return false;
      }
      if ((liveB.stars ?? 1) !== (fromB.stars ?? 1)) {
        return false;
      }
    }
  }

  sim.state.galleons = Math.max(0, sim.state.galleons + deltaSickles);
  sim.state.xp = Math.max(0, sim.state.xp + deltaXp);
  if (sim.state.match3) {
    sim.state.match3.stars = Math.max(0, curStars + deltaStars);
  }

  // Apply per-building diff while preserving unrelated live buildings (e.g. crops planted on other plots)
  const nextBuildings: PlacedBuilding[] = [];
  const handledUids = new Set<string>();
  for (const liveB of sim.state.buildings) {
    const inFrom = fromByUid.get(liveB.uid);
    const inTo = toByUid.get(liveB.uid);
    if (inFrom && !inTo) {
      handledUids.add(liveB.uid);
      continue; // removed in this transition
    }
    if (inFrom && inTo) {
      handledUids.add(liveB.uid);
      const changedInStroke = JSON.stringify(inFrom) !== JSON.stringify(inTo);
      nextBuildings.push(changedInStroke ? structuredClone(inTo) : liveB);
      continue;
    }
    nextBuildings.push(liveB);
  }
  for (const toB of toSnap.buildings) {
    if (!handledUids.has(toB.uid) && !liveByUid.has(toB.uid)) {
      nextBuildings.push(structuredClone(toB));
    }
  }
  sim.state.buildings = nextBuildings;

  // Apply per-tile override diff only for tiles touched by this stroke
  const allTileKeys = new Set([
    ...Object.keys(fromSnap.tileOverrides),
    ...Object.keys(toSnap.tileOverrides),
  ]);
  for (const key of allTileKeys) {
    const fVal = fromSnap.tileOverrides[key];
    const tVal = toSnap.tileOverrides[key];
    if (JSON.stringify(fVal) === JSON.stringify(tVal)) continue;
    if (tVal === undefined) {
      delete sim.state.tileOverrides[key];
    } else {
      sim.state.tileOverrides[key] = structuredClone(tVal);
    }
  }

  // Apply stashed decor inventory deltas
  if (fromSnap.stashedDecorInventory || toSnap.stashedDecorInventory) {
    const fInv = fromSnap.stashedDecorInventory ?? {};
    const tInv = toSnap.stashedDecorInventory ?? {};
    const curInv = { ...(sim.state.stashedDecorInventory ?? {}) };
    const invKeys = new Set([...Object.keys(fInv), ...Object.keys(tInv)]);
    for (const k of invKeys) {
      const diff = (tInv[k] ?? 0) - (fInv[k] ?? 0);
      if (diff !== 0) {
        const nextQty = Math.max(0, (curInv[k] ?? 0) + diff);
        if (nextQty > 0) curInv[k] = nextQty;
        else delete curInv[k];
      }
    }
    sim.state.stashedDecorInventory = Object.keys(curInv).length > 0 ? curInv : undefined;
  }
  if (fromSnap.stashedDecorStars || toSnap.stashedDecorStars) {
    const fStars = fromSnap.stashedDecorStars ?? {};
    const tStars = toSnap.stashedDecorStars ?? {};
    const curStarsMap: Record<string, number[]> = {};
    for (const [k, arr] of Object.entries(sim.state.stashedDecorStars ?? {})) {
      if (Array.isArray(arr)) curStarsMap[k] = [...arr];
    }
    const starKeys = new Set([...Object.keys(fStars), ...Object.keys(tStars)]);
    for (const k of starKeys) {
      const fArr = fStars[k] ?? [];
      const tArr = tStars[k] ?? [];
      if (JSON.stringify(fArr) === JSON.stringify(tArr)) continue;
      if (tArr.length > fArr.length) {
        curStarsMap[k] = [...(curStarsMap[k] ?? []), ...tArr.slice(fArr.length)];
      } else if (tArr.length < fArr.length) {
        const dropCount = fArr.length - tArr.length;
        const nextArr = [...(curStarsMap[k] ?? [])];
        nextArr.splice(Math.max(0, nextArr.length - dropCount), dropCount);
        if (nextArr.length > 0) curStarsMap[k] = nextArr;
        else delete curStarsMap[k];
      }
    }
    sim.state.stashedDecorStars = Object.keys(curStarsMap).length > 0 ? curStarsMap : undefined;
  }

  sim.rideQueues.clear();
  sim.rideQueueTailSpot.clear();
  sim.rebuildGrid();
  sim.syncStaffEntities();
  sim.syncValleyVillagers();
  return true;
}

function buildTxnRestoreImmediate(sim: ParkSimulation, s: BuildSnapshot): void {
  sim.state.galleons = s.galleons;
  sim.state.xp = s.xp;
  if (typeof s.level === 'number') {
    sim.state.level = s.level;
  }
  if (sim.state.match3) {
    sim.state.match3.stars = s.stars;
  }
  sim.state.buildings = structuredClone(s.buildings);
  sim.state.tileOverrides = structuredClone(s.tileOverrides);
  sim.state.stashedDecorInventory = s.stashedDecorInventory
    ? structuredClone(s.stashedDecorInventory)
    : undefined;
  sim.state.stashedDecorStars = s.stashedDecorStars
    ? structuredClone(s.stashedDecorStars)
    : undefined;
  sim.rideQueues.clear();
  sim.rideQueueTailSpot.clear();
  sim.rebuildGrid();
  sim.syncStaffEntities();
  sim.syncValleyVillagers();
}

/** Bắt đầu một stroke build: chụp snapshot + bật guard gộp save/UI. Idempotent. */
export function buildTxnBeginStroke(sim: ParkSimulation): void {
  if (sim.isVisitingNeighbor) return;
  if (sim.pendingBuildStroke) return; // đang giữa stroke — giữ snapshot gốc.
  sim.pendingBuildStroke = buildTxnCapture(sim);
  sim.buildStrokeMutated = false;
  sim.suppressPerActionSave = true;
  // Gộp N lần refresh DOM (onUiChange) trong 1 stroke kéo brush xuống 1 lần commit
  // ở cuối stroke — tránh refreshAll() 40 lần liên tiếp gây GC stutter.
  sim.buildStrokeOnUiChangeBackup = sim.onUiChange;
  sim.onUiChange = null;
}

/** Đánh dấu stroke có thay đổi (gọi từ mỗi lần place/move/remove thành công). */
export function buildTxnNoteMutation(sim: ParkSimulation): void {
  sim.buildStrokeMutated = true;
}

/** Kết thúc stroke: push undo nếu có mutated, khôi phục onUiChange + commit save/UI 1 lần. */
export function buildTxnCommitStroke(sim: ParkSimulation): void {
  // Khôi phục onUiChange đã bị chặn trong stroke (nếu beginStroke có chạy).
  if (sim.buildStrokeOnUiChangeBackup !== undefined) {
    sim.onUiChange = sim.buildStrokeOnUiChangeBackup;
    sim.buildStrokeOnUiChangeBackup = undefined;
  }
  if (!sim.pendingBuildStroke) {
    sim.suppressPerActionSave = false;
    return;
  }
  const mutated = sim.buildStrokeMutated;
  if (mutated && !sim.isVisitingNeighbor) {
    const afterSnap = buildTxnCapture(sim);
    sim.pendingBuildStroke.after = {
      galleons: afterSnap.galleons,
      xp: afterSnap.xp,
      level: afterSnap.level ?? sim.state.level,
      stars: afterSnap.stars,
      buildings: afterSnap.buildings,
      tileOverrides: afterSnap.tileOverrides,
      stashedDecorInventory: afterSnap.stashedDecorInventory,
      stashedDecorStars: afterSnap.stashedDecorStars,
    };
    sim.buildUndoStack.push(sim.pendingBuildStroke);
    if (sim.buildUndoStack.length > MAX_BUILD_UNDO) sim.buildUndoStack.shift();
    sim.buildRedoStack.length = 0;
  }
  sim.pendingBuildStroke = null;
  sim.buildStrokeMutated = false;
  sim.suppressPerActionSave = false;
  if (mutated) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
}

/**
 * Hủy stroke đang mở (người chơi Esc / pointercancel giữa brush): hoàn tác các
 * thay đổi đã xảy ra trong stroke về đúng snapshot mở đầu, KHÔNG ghi thêm undo step —
 * khớp yêu cầu "brush cancel chỉ undo thao tác của stroke đó".
 */
export function buildTxnCancelStroke(sim: ParkSimulation): void {
  if (sim.buildStrokeOnUiChangeBackup !== undefined) {
    sim.onUiChange = sim.buildStrokeOnUiChangeBackup;
    sim.buildStrokeOnUiChangeBackup = undefined;
  }
  sim.suppressPerActionSave = false;
  const snap = sim.pendingBuildStroke;
  sim.pendingBuildStroke = null;
  sim.buildStrokeMutated = false;
  if (!snap) return;
  if (sim.isVisitingNeighbor) return;
  buildTxnRestoreImmediate(sim, snap);
  sim.saveToStorage();
  sim.onUiChange?.();
}

export function buildTxnCanUndo(sim: ParkSimulation): boolean {
  return sim.buildUndoStack.length > 0;
}

export function buildTxnCanRedo(sim: ParkSimulation): boolean {
  return sim.buildRedoStack.length > 0;
}

export function buildTxnUndo(sim: ParkSimulation): boolean {
  if (sim.isVisitingNeighbor) return false;
  const snap = sim.buildUndoStack.at(-1);
  if (!snap) return false;
  const fromState = snap.after ?? buildTxnCapture(sim);
  if (!buildTxnApplyTransition(sim, fromState, snap)) {
    return false;
  }
  sim.buildUndoStack.pop();
  sim.buildRedoStack.push({
    ...snap,
    after: fromState,
  });
  sim.saveToStorage();
  sim.onUiChange?.();
  return true;
}

export function buildTxnRedo(sim: ParkSimulation): boolean {
  if (sim.isVisitingNeighbor) return false;
  const snap = sim.buildRedoStack.at(-1);
  if (!snap || !snap.after) return false;
  if (!buildTxnApplyTransition(sim, snap, snap.after)) {
    return false;
  }
  sim.buildRedoStack.pop();
  sim.buildUndoStack.push(snap);
  sim.saveToStorage();
  sim.onUiChange?.();
  return true;
}
