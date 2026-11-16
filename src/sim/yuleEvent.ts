import { GameState, FarmCropId, YuleCollectionId } from '../types/game';
import { CATALOG, getCatalogItem } from '../data/catalog';

export const YULE_EVENT_START = '2026-11-20';
export const YULE_EVENT_END = '2026-12-25';
export const YULE_EVENT_DAYS = 36;
export const YULE_SIDE_TASK_MAX_SICKLES = 5000;

export type YuleTaskKind = 'harvest_yule_crop' | 'build_yule_decor' | 'deliver_owl' | 'win_minigame' | 'jigsaw_yule' | 'visit_neighbor' | 'language_quiz';
export interface YuleTaskDef { id: string; titleVi: string; kind: YuleTaskKind; amount: number; targetId?: string; rewardSickles: number; rewardXp: number; }
export interface YuleDayDef { day: number; titleVi: string; giver: string; main: YuleTaskDef; side: YuleTaskDef[]; unlockIds: string[]; }

const cropIds: FarmCropId[] = ['yule_poinsettia','yule_snowdrop','yule_hellebore','yule_holly_sprig','yule_paperwhite','yule_frost_cranberry','yule_amaryllis','yule_mistletoe','yule_dwarf_fir','yule_edelweiss','yule_winter_camellia','yule_frost_orchid'];
const decorIds = CATALOG.filter((x) => x.id.startsWith('yule_')).map((x) => x.id);
const crop = (n: number): YuleTaskDef => ({ id: `yule_main_crop_${n}`, titleVi: `Gieo và thu hoạch ${n} cây mùa đông`, kind: 'harvest_yule_crop', amount: n, rewardSickles: 0, rewardXp: 30 });
const decor = (n: number): YuleTaskDef => ({ id: `yule_main_decor_${n}`, titleVi: `Dựng ${n} trang trí Yule`, kind: 'build_yule_decor', amount: n, rewardSickles: 0, rewardXp: 40 });
const mini = (n: number): YuleTaskDef => ({ id: `yule_main_mini_${n}`, titleVi: `Thắng ${n} mini-game giao diện Yule`, kind: 'win_minigame', amount: n, rewardSickles: 0, rewardXp: 45 });
const side = (id: string, titleVi: string, kind: YuleTaskKind, amount: number, rewardSickles: number): YuleTaskDef => ({ id, titleVi, kind, amount, rewardSickles: Math.min(YULE_SIDE_TASK_MAX_SICKLES, Math.max(0, rewardSickles)), rewardXp: 10 });

export const YULE_SCHEDULE: readonly YuleDayDef[] = Array.from({ length: YULE_EVENT_DAYS }, (_, i) => {
  const day = i + 1;
  const unlockIds = day === 36 ? ['yule_mini_hogwarts_castle'] : decorIds.slice((i * 3) % decorIds.length, (i * 3) % decorIds.length + 2);
  const main = day <= 7 ? crop(Math.min(3, day)) : day <= 14 ? decor(Math.min(3, day - 6)) : day <= 20 ? mini(1) : day <= 28 ? decor(2) : day === 35 ? { ...mini(2), id: 'yule_main_jigsaw_ball', kind: 'jigsaw_yule' as const, titleVi: 'Hoàn thành tranh ghép Yule Ball' } : decor(3);
  const sideTasks = [
    side(`yule_side_${day}_a`, 'Thu hoạch thêm cây Yule', 'harvest_yule_crop', 1, 2000),
    side(`yule_side_${day}_b`, 'Chơi một hoạt động mùa lễ', 'win_minigame', 1, 4000),
  ];
  return { day, titleVi: day <= 7 ? 'Bếp lửa Hang Sóc' : day <= 14 ? 'Chợ tuyết Hogsmeade' : day <= 20 ? 'Trạm Cú và Chuyến Tàu Tuyết' : day <= 28 ? 'Thử thách Yule Hogwarts' : 'Yule Ball và Bốn Nhà', giver: day <= 7 ? 'Molly' : day <= 14 ? 'Hedwig' : day <= 28 ? 'Hedwig' : 'Bốn Nhà Hogwarts', main, side: sideTasks, unlockIds };
});

export function yuleDayIndex(now: Date): number { const start = new Date(`${now.getFullYear()}-11-20T00:00:00`); const end = new Date(`${now.getFullYear()}-12-25T23:59:59.999`); if (now < start || now > end) return 0; return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1; }
export function yuleAssetPrice(itemId: string): number { const item = getCatalogItem(itemId); if (!item?.id.startsWith('yule_')) return 0; return Math.max(20_000, item.cost * 1000); }
export function yuleCollectionProgress(state: GameState, collection: YuleCollectionId): { owned: number; total: number } {
  const collectionIds = decorIds.filter((id) => getCatalogItem(id)?.yuleCollection === collection);
  const ownedSet = new Set<string>();
  for (const b of state.buildings) {
    if (getCatalogItem(b.itemId)?.yuleCollection === collection) {
      ownedSet.add(b.itemId);
    }
  }
  for (const [id, qty] of Object.entries(state.stashedDecorInventory ?? {})) {
    if ((qty ?? 0) > 0 && getCatalogItem(id)?.yuleCollection === collection) {
      ownedSet.add(id);
    }
  }
  for (const id of state.yuleEvent?.unlockedAssetIds ?? []) {
    if (getCatalogItem(id)?.yuleCollection === collection) {
      ownedSet.add(id);
    }
  }
  for (const id of state.yuleEvent?.purchasedAssetIds ?? []) {
    if (getCatalogItem(id)?.yuleCollection === collection) {
      ownedSet.add(id);
    }
  }
  return { owned: Math.min(ownedSet.size, collectionIds.length), total: collectionIds.length };
}
export function yuleTaskProgress(state: GameState, task: YuleTaskDef): number {
  if (task.kind === 'harvest_yule_crop') return cropIds.reduce((n, id) => n + (state.cropMastery?.[id] ?? 0), 0);
  if (task.kind === 'build_yule_decor') return state.buildings.filter((b) => b.itemId.startsWith('yule_')).length;
  if (task.kind === 'win_minigame') return state.stats.minigamesWon ?? 0;
  if (task.kind === 'jigsaw_yule') return state.puzzleArcade?.jigsawCleared ?? 0;
  return 0;
}
export function yuleTaskComplete(state: GameState, task: YuleTaskDef): boolean { return yuleTaskProgress(state, task) >= task.amount; }
