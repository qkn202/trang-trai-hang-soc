import { getActiveHouseCupWeekKey, getHouseCupWeeklyCycle } from '../hpvn/houseCup';
import type {
  WeeklyDerbyActiveTask,
  WeeklyDerbyEventKind,
  WeeklyDerbyState,
  WeeklyDerbyTask,
  WeeklyDerbyTaskObjective,
} from '../types/game';
import type { ParkSimulation } from './simulation';

export const MAX_WEEKLY_DERBY_TASKS = 7;
export const MAX_WEEKLY_DERBY_BONUS_TASKS = 8;
export const MAX_WEEKLY_DERBY_SCORE = 2500;
export const WEEKLY_DERBY_BOARD_SLOTS = 8;
export const DERBY_TRASH_COOLDOWN_MS = 15 * 60_000;
export const DERBY_BONUS_SLOT_SAND_COST = 2;
export const DERBY_INSTANT_RESTORE_SAND_COST = 1;

const DERBY_MAX_PHOENIX_TALISMANS = 12;

export interface DerbyMilestoneDef {
  tier: 1 | 2 | 3 | 4 | 5;
  pointsRequired: number;
  labelVi: string;
  rewardSickle: number;
  rewardCompost?: number;
  rewardPlug?: number;
  rewardDew?: number;
  rewardSand?: number;
  rewardTalisman?: number;
  rewardStars?: number;
}

export const DERBY_MILESTONES: readonly DerbyMilestoneDef[] = [
  {
    tier: 1,
    pointsRequired: 200,
    labelVi: 'Rương Móng Ngựa I',
    rewardSickle: 180,
    rewardCompost: 2,
    rewardDew: 1,
  },
  {
    tier: 2,
    pointsRequired: 500,
    labelVi: 'Rương Móng Ngựa II',
    rewardSickle: 320,
    rewardPlug: 2,
    rewardCompost: 3,
  },
  {
    tier: 3,
    pointsRequired: 900,
    labelVi: 'Rương Móng Ngựa III',
    rewardSickle: 480,
    rewardPlug: 2,
    rewardDew: 2,
    rewardSand: 1,
  },
  {
    tier: 4,
    pointsRequired: 1400,
    labelVi: 'Rương Móng Ngựa IV',
    rewardSickle: 700,
    rewardPlug: 3,
    rewardCompost: 4,
    rewardSand: 2,
    rewardTalisman: 1,
  },
  {
    tier: 5,
    pointsRequired: 2000,
    labelVi: 'Rương Móng Ngựa V',
    rewardSickle: 1100,
    rewardPlug: 4,
    rewardDew: 3,
    rewardSand: 2,
    rewardTalisman: 1,
    rewardStars: 3,
  },
];

export interface WeeklyDerbySummary {
  weekKey: string;
  points: number;
  maxPoints: number;
  tasksCompleted: number;
  maxTasks: number;
  bonusSlotUnlocked: boolean;
  claimableMilestonesCount: number;
  activeTaskReady: boolean;
}

interface DerbyObjectiveTemplate {
  eventKind: WeeklyDerbyEventKind;
  labelVi: string;
  target: number;
}

interface DerbyTaskTemplate {
  code: string;
  titleVi: string;
  emoji: string;
  isHybridCombo: boolean;
  points: number;
  durationSec: number;
  objectives: readonly DerbyObjectiveTemplate[];
}

const VALID_DERBY_EVENT_KINDS: ReadonlySet<WeeklyDerbyEventKind> = new Set([
  'harvest_crop',
  'owl_order',
  'workshop_batch',
  'visitor_sale',
  'cargo_crate',
  'pasture_harvest',
  'minigame_win',
  'molly_supply',
]);

const DERBY_SLOT_POOLS: readonly (readonly DerbyTaskTemplate[])[] = [
  // Slot 0: Thu hoạch nông sản ruộng (harvest_crop)
  [
    {
      code: 'crop_a',
      titleVi: 'Gặt Mùa Sớm Hang Sóc',
      emoji: '🌾',
      isHybridCombo: false,
      points: 160,
      durationSec: 8 * 3600,
      objectives: [{ eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 12 }],
    },
    {
      code: 'crop_b',
      titleVi: 'Bội Thu Đồng Lúa Ottery',
      emoji: '🌾',
      isHybridCombo: false,
      points: 210,
      durationSec: 12 * 3600,
      objectives: [{ eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 18 }],
    },
    {
      code: 'crop_c',
      titleVi: 'Đại Thu Hoạch Thung Lũng',
      emoji: '🌾',
      isHybridCombo: false,
      points: 250,
      durationSec: 16 * 3600,
      objectives: [{ eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 24 }],
    },
  ],
  // Slot 1: Giao Đơn Hàng Cú (owl_order)
  [
    {
      code: 'owl_a',
      titleVi: 'Chuyến Cú Đưa Thư',
      emoji: '🦉',
      isHybridCombo: false,
      points: 180,
      durationSec: 10 * 3600,
      objectives: [{ eventKind: 'owl_order', labelVi: 'Giao Đơn Hàng Cú', target: 2 }],
    },
    {
      code: 'owl_b',
      titleVi: 'Đơn Cú Tốc Hành Hogsmeade',
      emoji: '🦉',
      isHybridCombo: false,
      points: 230,
      durationSec: 14 * 3600,
      objectives: [{ eventKind: 'owl_order', labelVi: 'Giao Đơn Hàng Cú', target: 3 }],
    },
    {
      code: 'owl_c',
      titleVi: 'Sứ Mệnh Tháp Cú',
      emoji: '🦉',
      isHybridCombo: false,
      points: 270,
      durationSec: 18 * 3600,
      objectives: [{ eventKind: 'owl_order', labelVi: 'Giao Đơn Hàng Cú', target: 4 }],
    },
  ],
  // Slot 2: Chế biến mẻ xưởng (workshop_batch)
  [
    {
      code: 'ws_a',
      titleVi: 'Lò Bánh Thơm Lừng',
      emoji: '🥧',
      isHybridCombo: false,
      points: 175,
      durationSec: 10 * 3600,
      objectives: [{ eventKind: 'workshop_batch', labelVi: 'Hoàn thành mẻ chế biến xưởng', target: 3 }],
    },
    {
      code: 'ws_b',
      titleVi: 'Nghệ Nhân Bếp Hang Sóc',
      emoji: '🥧',
      isHybridCombo: false,
      points: 235,
      durationSec: 14 * 3600,
      objectives: [{ eventKind: 'workshop_batch', labelVi: 'Hoàn thành mẻ chế biến xưởng', target: 5 }],
    },
    {
      code: 'ws_c',
      titleVi: 'Mẻ Đặc Sản Hogsmeade',
      emoji: '🥧',
      isHybridCombo: false,
      points: 265,
      durationSec: 18 * 3600,
      objectives: [{ eventKind: 'workshop_batch', labelVi: 'Hoàn thành mẻ chế biến xưởng', target: 6 }],
    },
  ],
  // Slot 3: Bán hàng cho Khách Ghé Cổng (visitor_sale)
  [
    {
      code: 'vis_a',
      titleVi: 'Đón Khách Ghé Cổng',
      emoji: '🪙',
      isHybridCombo: false,
      points: 150,
      durationSec: 8 * 3600,
      objectives: [{ eventKind: 'visitor_sale', labelVi: 'Bán hàng cho Khách Ghé Cổng', target: 2 }],
    },
    {
      code: 'vis_b',
      titleVi: 'Phiên Chợ Hàng Xóm',
      emoji: '🪙',
      isHybridCombo: false,
      points: 195,
      durationSec: 12 * 3600,
      objectives: [{ eventKind: 'visitor_sale', labelVi: 'Bán hàng cho Khách Ghé Cổng', target: 3 }],
    },
    {
      code: 'vis_c',
      titleVi: 'Chủ Vườn Hiếu Khách',
      emoji: '🪙',
      isHybridCombo: false,
      points: 240,
      durationSec: 16 * 3600,
      objectives: [{ eventKind: 'visitor_sale', labelVi: 'Bán hàng cho Khách Ghé Cổng', target: 4 }],
    },
  ],
  // Slot 4: Đóng kiện Tàu Tốc Hành (cargo_crate)
  [
    {
      code: 'cargo_a',
      titleVi: 'Đóng Kiện Tàu Tốc Hành',
      emoji: '📦',
      isHybridCombo: false,
      points: 170,
      durationSec: 10 * 3600,
      objectives: [{ eventKind: 'cargo_crate', labelVi: 'Đóng kiện Tàu Tốc Hành', target: 2 }],
    },
    {
      code: 'cargo_b',
      titleVi: 'Chuyến Hàng Ga Hogsmeade',
      emoji: '📦',
      isHybridCombo: false,
      points: 225,
      durationSec: 14 * 3600,
      objectives: [{ eventKind: 'cargo_crate', labelVi: 'Đóng kiện Tàu Tốc Hành', target: 3 }],
    },
    {
      code: 'cargo_c',
      titleVi: 'Tiếp Tế Đoàn Tàu Đỏ',
      emoji: '📦',
      isHybridCombo: false,
      points: 260,
      durationSec: 18 * 3600,
      objectives: [{ eventKind: 'cargo_crate', labelVi: 'Đóng kiện Tàu Tốc Hành', target: 4 }],
    },
  ],
  // Slot 5: Thu hoạch Đồng Cỏ Thú (pasture_harvest)
  [
    {
      code: 'past_a',
      titleVi: 'Chăm Đồng Cỏ Sớm',
      emoji: '🐾',
      isHybridCombo: false,
      points: 140,
      durationSec: 6 * 3600,
      objectives: [{ eventKind: 'pasture_harvest', labelVi: 'Thu hoạch Đồng Cỏ Thú', target: 3 }],
    },
    {
      code: 'past_b',
      titleVi: 'Thu Hoạch Chuồng Thú',
      emoji: '🐾',
      isHybridCombo: false,
      points: 190,
      durationSec: 12 * 3600,
      objectives: [{ eventKind: 'pasture_harvest', labelVi: 'Thu hoạch Đồng Cỏ Thú', target: 5 }],
    },
    {
      code: 'past_c',
      titleVi: 'Người Gác Đồng Cỏ',
      emoji: '🐾',
      isHybridCombo: false,
      points: 245,
      durationSec: 16 * 3600,
      objectives: [{ eventKind: 'pasture_harvest', labelVi: 'Thu hoạch Đồng Cỏ Thú', target: 7 }],
    },
  ],
  // Slot 6: Hybrid Combo #1 — Thu hoạch Ruộng + Thắng Mini Game (290..320 đ)
  [
    {
      code: 'hyb1_a',
      titleVi: 'Song Kiếm Mùa Gặt & Khảo Thí',
      emoji: '🏆',
      isHybridCombo: true,
      points: 300,
      durationSec: 20 * 3600,
      objectives: [
        { eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 10 },
        { eventKind: 'minigame_win', labelVi: 'Thắng ván Mini Game', target: 2 },
      ],
    },
    {
      code: 'hyb1_b',
      titleVi: 'Gặt Lúa Đua Cúp Nhà',
      emoji: '🏆',
      isHybridCombo: true,
      points: 320,
      durationSec: 24 * 3600,
      objectives: [
        { eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 14 },
        { eventKind: 'minigame_win', labelVi: 'Thắng ván Mini Game', target: 3 },
      ],
    },
    {
      code: 'hyb1_c',
      titleVi: 'Vụ Mùa Pháp Thuật',
      emoji: '🏆',
      isHybridCombo: true,
      points: 290,
      durationSec: 18 * 3600,
      objectives: [
        { eventKind: 'harvest_crop', labelVi: 'Thu hoạch thửa ruộng', target: 8 },
        { eventKind: 'minigame_win', labelVi: 'Thắng ván Mini Game', target: 2 },
      ],
    },
  ],
  // Slot 7: Hybrid Combo #2 — Nông Trại + Gói Tiếp Tế Bà Molly / Mini Game (295..315 đ)
  [
    {
      code: 'hyb2_a',
      titleVi: 'Tiếp Tế Bếp Molly & Giao Cú',
      emoji: '🌟',
      isHybridCombo: true,
      points: 305,
      durationSec: 20 * 3600,
      objectives: [
        { eventKind: 'owl_order', labelVi: 'Giao Đơn Hàng Cú', target: 2 },
        { eventKind: 'molly_supply', labelVi: 'Dùng Gói Tiếp Tế Bà Molly', target: 1 },
      ],
    },
    {
      code: 'hyb2_b',
      titleVi: 'Bánh Nướng & Chiến Thắng',
      emoji: '🌟',
      isHybridCombo: true,
      points: 315,
      durationSec: 22 * 3600,
      objectives: [
        { eventKind: 'workshop_batch', labelVi: 'Hoàn thành mẻ chế biến xưởng', target: 3 },
        { eventKind: 'minigame_win', labelVi: 'Thắng ván Mini Game', target: 2 },
      ],
    },
    {
      code: 'hyb2_c',
      titleVi: 'Khách Quý & Gói Tiếp Tế',
      emoji: '🌟',
      isHybridCombo: true,
      points: 295,
      durationSec: 18 * 3600,
      objectives: [
        { eventKind: 'visitor_sale', labelVi: 'Bán hàng cho Khách Ghé Cổng', target: 2 },
        { eventKind: 'molly_supply', labelVi: 'Dùng Gói Tiếp Tế Bà Molly', target: 1 },
      ],
    },
    {
      code: 'hyb2_d',
      titleVi: 'Đồng Cỏ & Khảo Thí Pháp Thuật',
      emoji: '🌟',
      isHybridCombo: true,
      points: 310,
      durationSec: 22 * 3600,
      objectives: [
        { eventKind: 'pasture_harvest', labelVi: 'Thu hoạch Đồng Cỏ Thú', target: 3 },
        { eventKind: 'minigame_win', labelVi: 'Thắng ván Mini Game', target: 2 },
      ],
    },
  ],
];

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clampInt(raw: unknown, min: number, max: number, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function resolveWeeklyDerbyWeekKey(nowMs: number): string {
  const cycleNow = getHouseCupWeeklyCycle(nowMs).weekKey;
  const cycleWall = getHouseCupWeeklyCycle(Date.now()).weekKey;
  if (cycleNow !== cycleWall) {
    return cycleNow;
  }
  return getActiveHouseCupWeekKey(nowMs);
}

function isTaskObjectivesMet(task: Pick<WeeklyDerbyTask, 'objectives'>): boolean {
  return task.objectives.length > 0 && task.objectives.every((o) => o.progress >= o.target);
}

function createDerbyBoardTask(
  weekKey: string,
  slotIndex: number,
  seedOffset: number,
  previousTaskId?: string
): WeeklyDerbyTask {
  const safeSlot = clampInt(slotIndex, 0, WEEKLY_DERBY_BOARD_SLOTS - 1, 0);
  const pool = DERBY_SLOT_POOLS[safeSlot];
  const seed = hashSeed(`${weekKey}#slot=${safeSlot}#off=${seedOffset}`);
  let pickIdx = seed % pool.length;
  let tpl = pool[pickIdx];
  let id = `derby_${weekKey}_s${safeSlot}_${tpl.code}_${seedOffset}`;

  if (previousTaskId && pool.length > 1 && previousTaskId.includes(`_${tpl.code}_`)) {
    pickIdx = (pickIdx + 1) % pool.length;
    tpl = pool[pickIdx];
    id = `derby_${weekKey}_s${safeSlot}_${tpl.code}_${seedOffset}`;
  }

  return {
    id,
    slotIndex: safeSlot,
    titleVi: tpl.titleVi,
    emoji: tpl.emoji,
    isHybridCombo: tpl.isHybridCombo,
    points: tpl.points,
    durationSec: tpl.durationSec,
    objectives: tpl.objectives.map((o) => ({
      eventKind: o.eventKind,
      labelVi: o.labelVi,
      target: o.target,
      progress: 0,
    })),
  };
}

function buildFullDerbyBoard(weekKey: string, seedOffset: number): WeeklyDerbyTask[] {
  const tasks: WeeklyDerbyTask[] = [];
  for (let slot = 0; slot < WEEKLY_DERBY_BOARD_SLOTS; slot++) {
    tasks.push(createDerbyBoardTask(weekKey, slot, seedOffset));
  }
  return tasks;
}

function createFreshWeeklyDerbyState(weekKey: string): WeeklyDerbyState {
  return {
    weekKey,
    points: 0,
    tasksCompleted: 0,
    bonusSlotUnlocked: false,
    claimedMilestones: [],
    boardSeedOffset: 0,
    boardTasks: buildFullDerbyBoard(weekKey, 0),
    activeTask: null,
  };
}

function sanitizeDerbyObjective(raw: unknown): WeeklyDerbyTaskObjective | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const eventKind = typeof o.eventKind === 'string' ? (o.eventKind as WeeklyDerbyEventKind) : null;
  if (!eventKind || !VALID_DERBY_EVENT_KINDS.has(eventKind)) return null;
  const labelVi = typeof o.labelVi === 'string' ? o.labelVi.trim().slice(0, 80) : '';
  if (!labelVi) return null;
  const target = clampInt(o.target, 1, 500, 1);
  const progress = clampInt(o.progress, 0, target, 0);
  return { eventKind, labelVi, target, progress };
}

function sanitizeDerbyTask(raw: unknown, fallbackSlot: number): WeeklyDerbyTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as Record<string, unknown>;
  const id = typeof t.id === 'string' ? t.id.trim().slice(0, 80) : '';
  const titleVi = typeof t.titleVi === 'string' ? t.titleVi.trim().slice(0, 80) : '';
  if (!id || !titleVi) return null;
  if (!Array.isArray(t.objectives) || t.objectives.length === 0) return null;
  const objectives: WeeklyDerbyTaskObjective[] = [];
  for (const item of t.objectives.slice(0, 4)) {
    const clean = sanitizeDerbyObjective(item);
    if (clean) objectives.push(clean);
  }
  if (objectives.length === 0) return null;

  const slotIndex = clampInt(t.slotIndex, 0, WEEKLY_DERBY_BOARD_SLOTS - 1, fallbackSlot);
  const emoji = typeof t.emoji === 'string' && t.emoji.trim() ? t.emoji.trim().slice(0, 8) : '🏆';
  const points = clampInt(t.points, 110, 320, 150);
  const durationSec = clampInt(t.durationSec, 3600, 24 * 3600, 12 * 3600);
  const trashedUntilAt =
    typeof t.trashedUntilAt === 'number' && Number.isFinite(t.trashedUntilAt) && t.trashedUntilAt > 0
      ? Math.floor(t.trashedUntilAt)
      : undefined;

  return {
    id,
    slotIndex,
    titleVi,
    emoji,
    isHybridCombo: Boolean(t.isHybridCombo),
    points,
    durationSec,
    objectives,
    ...(trashedUntilAt ? { trashedUntilAt } : {}),
  };
}

export function sanitizeWeeklyDerbyState(raw: unknown): WeeklyDerbyState | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const weekKey = typeof r.weekKey === 'string' ? r.weekKey.trim().slice(0, 24) : '';
  if (!weekKey) return undefined;

  const bonusSlotUnlocked = Boolean(r.bonusSlotUnlocked);
  const maxTasks = bonusSlotUnlocked ? MAX_WEEKLY_DERBY_BONUS_TASKS : MAX_WEEKLY_DERBY_TASKS;
  const points = clampInt(r.points, 0, MAX_WEEKLY_DERBY_SCORE, 0);
  const tasksCompleted = clampInt(r.tasksCompleted, 0, maxTasks, 0);
  const boardSeedOffset = clampInt(r.boardSeedOffset, 0, 1_000_000, 0);

  const validTierSet = new Set<number>([1, 2, 3, 4, 5]);
  const claimedSet = new Set<number>();
  if (Array.isArray(r.claimedMilestones)) {
    for (const m of r.claimedMilestones) {
      const tier = Math.floor(Number(m));
      if (validTierSet.has(tier)) claimedSet.add(tier);
    }
  }
  const claimedMilestones = Array.from(claimedSet).sort((a, b) => a - b);

  const bySlot = new Map<number, WeeklyDerbyTask>();
  if (Array.isArray(r.boardTasks)) {
    for (let i = 0; i < r.boardTasks.length; i++) {
      const clean = sanitizeDerbyTask(r.boardTasks[i], i);
      if (clean && !bySlot.has(clean.slotIndex)) {
        bySlot.set(clean.slotIndex, clean);
      }
    }
  }
  const boardTasks: WeeklyDerbyTask[] = [];
  for (let slot = 0; slot < WEEKLY_DERBY_BOARD_SLOTS; slot++) {
    const existing = bySlot.get(slot);
    boardTasks.push(existing ?? createDerbyBoardTask(weekKey, slot, boardSeedOffset));
  }

  let activeTask: WeeklyDerbyActiveTask | null = null;
  if (r.activeTask && typeof r.activeTask === 'object') {
    const rawActive = r.activeTask as Record<string, unknown>;
    const base = sanitizeDerbyTask(rawActive, 0);
    const acceptedAt =
      typeof rawActive.acceptedAt === 'number' && Number.isFinite(rawActive.acceptedAt) && rawActive.acceptedAt > 0
        ? Math.floor(rawActive.acceptedAt)
        : 0;
    const expiresAt =
      typeof rawActive.expiresAt === 'number' && Number.isFinite(rawActive.expiresAt) && rawActive.expiresAt > 0
        ? Math.floor(rawActive.expiresAt)
        : 0;
    if (base && acceptedAt > 0 && expiresAt > 0) {
      const completedAt =
        typeof rawActive.completedAt === 'number' && Number.isFinite(rawActive.completedAt) && rawActive.completedAt > 0
          ? Math.floor(rawActive.completedAt)
          : undefined;
      activeTask = {
        ...base,
        trashedUntilAt: undefined,
        acceptedAt,
        expiresAt,
        ...(completedAt ? { completedAt } : {}),
      };
    }
  }

  return {
    weekKey,
    points,
    tasksCompleted,
    bonusSlotUnlocked,
    claimedMilestones,
    boardSeedOffset,
    boardTasks,
    activeTask,
  };
}

export function ensureWeeklyDerbyState(sim: ParkSimulation, nowMs = Date.now()): WeeklyDerbyState {
  const weekKey = resolveWeeklyDerbyWeekKey(nowMs);
  const existing = sim.state.weeklyDerby;

  if (!existing || existing.weekKey !== weekKey) {
    const fresh = createFreshWeeklyDerbyState(weekKey);
    sim.state.weeklyDerby = fresh;
    return fresh;
  }

  existing.bonusSlotUnlocked = Boolean(existing.bonusSlotUnlocked);
  const maxTasks = existing.bonusSlotUnlocked ? MAX_WEEKLY_DERBY_BONUS_TASKS : MAX_WEEKLY_DERBY_TASKS;
  existing.points = clampInt(existing.points, 0, MAX_WEEKLY_DERBY_SCORE, 0);
  existing.tasksCompleted = clampInt(existing.tasksCompleted, 0, maxTasks, 0);
  existing.boardSeedOffset = clampInt(existing.boardSeedOffset, 0, 1_000_000, 0);
  if (!Array.isArray(existing.claimedMilestones)) {
    existing.claimedMilestones = [];
  }

  if (existing.activeTask) {
    const active = existing.activeTask;
    if (isTaskObjectivesMet(active)) {
      if (!active.completedAt) {
        active.completedAt = nowMs;
      }
    } else if (nowMs >= active.expiresAt) {
      existing.activeTask = null;
    }
  }

  const slotMap = new Map<number, WeeklyDerbyTask>();
  if (Array.isArray(existing.boardTasks)) {
    for (const t of existing.boardTasks) {
      if (t && typeof t.slotIndex === 'number' && t.slotIndex >= 0 && t.slotIndex < WEEKLY_DERBY_BOARD_SLOTS) {
        if (!slotMap.has(t.slotIndex)) {
          slotMap.set(t.slotIndex, t);
        }
      }
    }
  }

  const nextBoard: WeeklyDerbyTask[] = [];
  for (let slot = 0; slot < WEEKLY_DERBY_BOARD_SLOTS; slot++) {
    const cur = slotMap.get(slot);
    if (!cur || !Array.isArray(cur.objectives) || cur.objectives.length === 0) {
      existing.boardSeedOffset += 1;
      nextBoard.push(createDerbyBoardTask(weekKey, slot, existing.boardSeedOffset));
    } else if (typeof cur.trashedUntilAt === 'number' && cur.trashedUntilAt <= nowMs) {
      existing.boardSeedOffset += 1;
      nextBoard.push(createDerbyBoardTask(weekKey, slot, existing.boardSeedOffset, cur.id));
    } else {
      nextBoard.push(cur);
    }
  }
  existing.boardTasks = nextBoard;

  return existing;
}

export function getWeeklyDerbySummary(sim: ParkSimulation, nowMs = Date.now()): WeeklyDerbySummary {
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const maxTasks = derby.bonusSlotUnlocked ? MAX_WEEKLY_DERBY_BONUS_TASKS : MAX_WEEKLY_DERBY_TASKS;
  let claimableMilestonesCount = 0;
  for (const m of DERBY_MILESTONES) {
    if (derby.points >= m.pointsRequired && !derby.claimedMilestones.includes(m.tier)) {
      claimableMilestonesCount++;
    }
  }
  const activeTaskReady = Boolean(
    derby.activeTask && (derby.activeTask.completedAt || isTaskObjectivesMet(derby.activeTask))
  );
  return {
    weekKey: derby.weekKey,
    points: derby.points,
    maxPoints: MAX_WEEKLY_DERBY_SCORE,
    tasksCompleted: derby.tasksCompleted,
    maxTasks,
    bonusSlotUnlocked: derby.bonusSlotUnlocked,
    claimableMilestonesCount,
    activeTaskReady,
  };
}

export function acceptWeeklyDerbyTask(
  sim: ParkSimulation,
  taskId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để nhận nhiệm vụ Derby!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  if (derby.activeTask) {
    return { ok: false, msg: 'Bạn đang có nhiệm vụ Derby đang làm — hãy hoàn thành hoặc hủy trước!' };
  }
  const maxTasks = derby.bonusSlotUnlocked ? MAX_WEEKLY_DERBY_BONUS_TASKS : MAX_WEEKLY_DERBY_TASKS;
  if (derby.tasksCompleted >= maxTasks) {
    return {
      ok: false,
      msg: derby.bonusSlotUnlocked
        ? `Bạn đã hoàn thành tối đa ${MAX_WEEKLY_DERBY_BONUS_TASKS}/${MAX_WEEKLY_DERBY_BONUS_TASKS} nhiệm vụ Derby trong tuần này!`
        : `Bạn đã hoàn thành đủ ${MAX_WEEKLY_DERBY_TASKS}/${MAX_WEEKLY_DERBY_TASKS} nhiệm vụ tuần này! Có thể mở thêm nhiệm vụ #8 bằng ${DERBY_BONUS_SLOT_SAND_COST} ⏳ Cát.`,
    };
  }
  const idx = derby.boardTasks.findIndex((t) => t.id === taskId);
  if (idx === -1) {
    return { ok: false, msg: 'Không tìm thấy nhiệm vụ này trên bảng Derby!' };
  }
  const chosen = derby.boardTasks[idx];
  if (chosen.trashedUntilAt && chosen.trashedUntilAt > nowMs) {
    return { ok: false, msg: 'Ô nhiệm vụ này đang trong thời gian chờ hồi lại sau khi xé!' };
  }

  derby.activeTask = {
    ...chosen,
    trashedUntilAt: undefined,
    objectives: chosen.objectives.map((o) => ({ ...o, progress: 0 })),
    acceptedAt: nowMs,
    expiresAt: nowMs + chosen.durationSec * 1000,
    completedAt: undefined,
  };

  derby.boardSeedOffset += 1;
  derby.boardTasks[idx] = createDerbyBoardTask(
    derby.weekKey,
    chosen.slotIndex,
    derby.boardSeedOffset,
    chosen.id
  );

  sim.audio.playPlace?.();
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `🏆 Đã nhận nhiệm vụ Derby "${chosen.titleVi}" (+${chosen.points} đ)!`;
  sim.onToast?.(msg, '🏆');
  return { ok: true, msg };
}

export function trashWeeklyDerbyBoardTask(
  sim: ParkSimulation,
  taskId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để quản lý bảng Derby!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const task = derby.boardTasks.find((t) => t.id === taskId);
  if (!task) {
    return { ok: false, msg: 'Không tìm thấy nhiệm vụ này trên bảng Derby!' };
  }
  if (task.trashedUntilAt && task.trashedUntilAt > nowMs) {
    return { ok: false, msg: 'Ô nhiệm vụ này đã được xé và đang chờ hồi lại!' };
  }

  task.trashedUntilAt = nowMs + DERBY_TRASH_COOLDOWN_MS;
  sim.audio.playClick?.();
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = '🧹 Đã xé nhiệm vụ khỏi bảng Derby — việc mới sẽ xuất hiện sau 15 phút (hoặc dùng 1 ⏳ Cát gọi ngay)!';
  sim.onToast?.(msg, '🧹');
  return { ok: true, msg };
}

export function instantRestoreWeeklyDerbySlot(
  sim: ParkSimulation,
  taskId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để gọi nhiệm vụ Derby mới!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const idx = derby.boardTasks.findIndex((t) => t.id === taskId);
  if (idx === -1) {
    return { ok: false, msg: 'Không tìm thấy ô nhiệm vụ cần khôi phục!' };
  }
  const slot = derby.boardTasks[idx];
  if (!slot.trashedUntilAt || slot.trashedUntilAt <= nowMs) {
    return { ok: false, msg: 'Ô nhiệm vụ này đã sẵn sàng rồi!' };
  }
  if (!sim.state.sandboxMode && sim.state.timeSand < DERBY_INSTANT_RESTORE_SAND_COST) {
    return {
      ok: false,
      msg: `Cần ${DERBY_INSTANT_RESTORE_SAND_COST} ⏳ Cát Xoay Thời Gian để gọi nhiệm vụ mới ngay!`,
    };
  }
  if (!sim.state.sandboxMode) {
    sim.state.timeSand -= DERBY_INSTANT_RESTORE_SAND_COST;
  }

  derby.boardSeedOffset += 1;
  const fresh = createDerbyBoardTask(
    derby.weekKey,
    slot.slotIndex,
    derby.boardSeedOffset,
    slot.id
  );
  derby.boardTasks[idx] = fresh;

  sim.audio.playOwlHoot?.(0.035);
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `⏳ Đã gọi ngay nhiệm vụ mới: "${fresh.titleVi}" (+${fresh.points} đ Derby)!`;
  sim.onToast?.(msg, '⏳');
  return { ok: true, msg };
}

export function abandonWeeklyDerbyActiveTask(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để quản lý nhiệm vụ Derby!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  if (!derby.activeTask) {
    return { ok: false, msg: 'Hiện không có nhiệm vụ Derby nào đang làm!' };
  }
  const oldTitle = derby.activeTask.titleVi;
  derby.activeTask = null;

  sim.audio.playClick?.();
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `✕ Đã hủy nhiệm vụ "${oldTitle}" — bạn có thể chọn việc mới từ bảng Derby!`;
  sim.onToast?.(msg, '🧹');
  return { ok: true, msg };
}

export function recordWeeklyDerbyProgress(
  sim: ParkSimulation,
  eventKind: WeeklyDerbyEventKind,
  amount = 1,
  nowMs = Date.now()
): { progressed: boolean; justCompleted: boolean } {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview || amount <= 0) {
    return { progressed: false, justCompleted: false };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const active = derby.activeTask;
  if (!active) {
    return { progressed: false, justCompleted: false };
  }

  const safeAmount = Math.max(1, Math.floor(amount));
  const wasCompleted = Boolean(active.completedAt || isTaskObjectivesMet(active));
  let progressed = false;

  for (const obj of active.objectives) {
    if (obj.eventKind === eventKind && obj.progress < obj.target) {
      obj.progress = Math.min(obj.target, obj.progress + safeAmount);
      progressed = true;
    }
  }

  if (!progressed) {
    return { progressed: false, justCompleted: false };
  }

  const nowCompleted = isTaskObjectivesMet(active);
  const justCompleted = !wasCompleted && nowCompleted;
  if (justCompleted) {
    active.completedAt = nowMs;
    sim.audio.playLevelUp?.();
    sim.onToast?.('🏆 Nhiệm vụ Derby đã xong! Mở bảng Derby để nộp nhận điểm cho Nhà!', '🏆');
    if (!sim.batchOperationActive) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
  }

  return { progressed, justCompleted };
}

export function completeWeeklyDerbyActiveTask(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string; pointsEarned: number } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để nộp nhiệm vụ Derby!', pointsEarned: 0 };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const active = derby.activeTask;
  if (!active) {
    return { ok: false, msg: 'Chưa có nhiệm vụ Derby nào đang làm!', pointsEarned: 0 };
  }
  if (!active.completedAt && !isTaskObjectivesMet(active)) {
    return { ok: false, msg: 'Nhiệm vụ Derby chưa đạt đủ tất cả mục tiêu!', pointsEarned: 0 };
  }

  const maxTasks = derby.bonusSlotUnlocked ? MAX_WEEKLY_DERBY_BONUS_TASKS : MAX_WEEKLY_DERBY_TASKS;
  if (derby.tasksCompleted >= maxTasks) {
    derby.activeTask = null;
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: false, msg: 'Bạn đã đạt giới hạn nhiệm vụ Derby trong tuần này!', pointsEarned: 0 };
  }

  const prevPoints = derby.points;
  const nextPoints = Math.min(MAX_WEEKLY_DERBY_SCORE, prevPoints + active.points);
  const pointsEarned = Math.max(0, nextPoints - prevPoints);

  derby.points = nextPoints;
  derby.tasksCompleted = Math.min(maxTasks, derby.tasksCompleted + 1);
  derby.activeTask = null;

  sim.addHarvestFeastPoints(15);
  sim.addXp(25);
  sim.audio.playLevelUp?.();
  sim.onRewardFly?.('xp', 25);
  sim.saveToStorage();
  sim.onUiChange?.();

  const capNote = nextPoints >= MAX_WEEKLY_DERBY_SCORE ? ' (đạt trần 2.500 đ tuần!)' : '';
  const msg = `🏆 Hoàn thành "${active.titleVi}": +${pointsEarned} đ Derby${capNote} · +15 Lễ Hội · +25 ⭐!`;
  sim.onToast?.(msg, '🏆');
  return { ok: true, msg, pointsEarned };
}

export function unlockBonusWeeklyDerbySlot(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để mở nhiệm vụ Derby #8!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  if (derby.bonusSlotUnlocked) {
    return { ok: false, msg: 'Bạn đã mở khóa nhiệm vụ thưởng #8 của tuần này rồi!' };
  }
  if (derby.tasksCompleted < MAX_WEEKLY_DERBY_TASKS) {
    return {
      ok: false,
      msg: `Cần hoàn thành đủ ${MAX_WEEKLY_DERBY_TASKS}/${MAX_WEEKLY_DERBY_TASKS} nhiệm vụ trước khi mở thêm nhiệm vụ #8!`,
    };
  }
  if (!sim.state.sandboxMode && sim.state.timeSand < DERBY_BONUS_SLOT_SAND_COST) {
    return {
      ok: false,
      msg: `Cần ${DERBY_BONUS_SLOT_SAND_COST} ⏳ Cát Xoay Thời Gian để mở nhiệm vụ Derby #8!`,
    };
  }
  if (!sim.state.sandboxMode) {
    sim.state.timeSand -= DERBY_BONUS_SLOT_SAND_COST;
  }

  derby.bonusSlotUnlocked = true;
  sim.audio.playLevelUp?.();
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = '⏳ Đã mở khóa nhiệm vụ Derby thưởng #8 trong tuần! Chọn ngay việc mới từ bảng!';
  sim.onToast?.(msg, '🏆');
  return { ok: true, msg };
}

export function claimWeeklyDerbyMilestone(
  sim: ParkSimulation,
  tier: 1 | 2 | 3 | 4 | 5,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để mở Rương Mốc Derby!' };
  }
  const derby = ensureWeeklyDerbyState(sim, nowMs);
  const def = DERBY_MILESTONES.find((m) => m.tier === tier);
  if (!def) {
    return { ok: false, msg: 'Mốc Rương Derby không hợp lệ!' };
  }
  if (derby.claimedMilestones.includes(tier)) {
    return { ok: false, msg: `Bạn đã nhận ${def.labelVi} trong tuần này rồi!` };
  }
  if (!sim.state.sandboxMode && derby.points < def.pointsRequired) {
    return {
      ok: false,
      msg: `Cần đạt ${def.pointsRequired} điểm Derby để mở ${def.labelVi} (hiện có ${derby.points} đ)!`,
    };
  }

  derby.claimedMilestones.push(tier);
  derby.claimedMilestones.sort((a, b) => a - b);

  const parts: string[] = [];
  if (def.rewardSickle > 0) {
    sim.state.galleons += def.rewardSickle;
    parts.push(`+${def.rewardSickle} Sickle`);
  }
  if (def.rewardCompost && def.rewardCompost > 0) {
    sim.state.herbalCompost = Math.min(
      99999,
      Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + def.rewardCompost
    );
    parts.push(`+${def.rewardCompost} 🌿`);
  }
  if (def.rewardPlug && def.rewardPlug > 0) {
    const barn = sim.ensureFarmBarn();
    barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + def.rewardPlug;
    parts.push(`+${def.rewardPlug} 🔌`);
  }
  if (def.rewardDew && def.rewardDew > 0) {
    sim.state.morningDewPhials = Math.min(
      99,
      Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + def.rewardDew
    );
    parts.push(`+${def.rewardDew} 🧪`);
  }
  if (def.rewardSand && def.rewardSand > 0) {
    sim.state.timeSand = Math.max(0, Math.floor(sim.state.timeSand ?? 0)) + def.rewardSand;
    parts.push(`+${def.rewardSand} ⏳`);
  }
  if (def.rewardTalisman && def.rewardTalisman > 0) {
    const prevTal = Math.max(0, Math.floor(sim.state.phoenixTalismans ?? 0));
    sim.state.phoenixTalismans = Math.min(DERBY_MAX_PHOENIX_TALISMANS, prevTal + def.rewardTalisman);
    parts.push(`+${def.rewardTalisman} 🔥`);
  }
  if (def.rewardStars && def.rewardStars > 0) {
    sim.state.match3.stars = Math.max(0, Math.floor(sim.state.match3.stars ?? 0)) + def.rewardStars;
    sim.state.match3.totalStarsEarned =
      Math.max(0, Math.floor(sim.state.match3.totalStarsEarned ?? 0)) + def.rewardStars;
    parts.push(`+${def.rewardStars} 🌟`);
  }

  sim.audio.playLevelUp?.();
  if (def.rewardSickle > 0) sim.onRewardFly?.('galleons', def.rewardSickle);
  if (def.rewardSand && def.rewardSand > 0) sim.onRewardFly?.('sand', def.rewardSand);
  if (def.rewardStars && def.rewardStars > 0) sim.onRewardFly?.('stars', def.rewardStars);
  sim.saveToStorage();
  sim.onUiChange?.();

  const msg = `🎁 Đã mở ${def.labelVi}: ${parts.join(' · ')}!`;
  sim.onToast?.(msg, '🎁');
  return { ok: true, msg };
}
