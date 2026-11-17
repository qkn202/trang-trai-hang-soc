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
  stars: number;
  buildings: PlacedBuilding[];
  tileOverrides: Record<string, TileOverrideData>;
  stashedDecorInventory?: Record<string, number>;
  stashedDecorStars?: Record<string, number[]>;
}

const MAX_BUILD_UNDO = 30;

export function buildTxnCapture(sim: ParkSimulation): BuildSnapshot {
  return {
    galleons: sim.state.galleons,
    xp: sim.state.xp,
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

function buildTxnRestore(sim: ParkSimulation, s: BuildSnapshot): void {
  sim.state.galleons = s.galleons;
  sim.state.xp = s.xp;
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
  // Rời các transient map tham chiếu building uid khỏi vòng đời building cũ.
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
  buildTxnRestore(sim, snap);
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
  const snap = sim.buildUndoStack.pop();
  if (!snap) return false;
  sim.buildRedoStack.push(buildTxnCapture(sim));
  buildTxnRestore(sim, snap);
  sim.saveToStorage();
  sim.onUiChange?.();
  return true;
}

export function buildTxnRedo(sim: ParkSimulation): boolean {
  if (sim.isVisitingNeighbor) return false;
  const snap = sim.buildRedoStack.pop();
  if (!snap) return false;
  sim.buildUndoStack.push(buildTxnCapture(sim));
  buildTxnRestore(sim, snap);
  sim.saveToStorage();
  sim.onUiChange?.();
  return true;
}
