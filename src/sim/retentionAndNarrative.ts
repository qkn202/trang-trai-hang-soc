// P3 — Retention & Narrative:
// 1. Unified Achievement Registry (52 thành tựu ach_01..ach_52, 6 nhóm, codex, toast queue, nhận thưởng)
// 2. 3 Named Save Slots + Autosave riêng, migration schema v12, import/export tương thích ngược & Cloud Conflict Policy
// 3. Lịch trình NPC theo buổi (dawn/day/dusk/night), tâm trạng, hội thoại 2 lựa chọn, Tình Bạn (Lv.1..10),
//    3 Chương Cốt Truyện kèm Canvas Cutscene nhẹ & Vòng lặp Điểm Danh Ngày 1 → Ngày 7

import { GameState, ValleyVillagerId } from '../types/game';

export type VillagerId = ValleyVillagerId;

export type AchievementCategory =
  | 'farm'
  | 'building'
  | 'puzzle'
  | 'language'
  | 'social'
  | 'collection';

export interface AchievementDef {
  id: string;
  category: AchievementCategory;
  titleVi: string;
  descVi: string;
  icon: string;
  target: number;
  rewardGalleons: number;
  rewardStars: number;
}

export interface AchievementProgressEntry {
  unlockedAt?: number;
  claimedAt?: number;
}

export interface NpcFriendshipEntry {
  villagerId: VillagerId;
  level: number; // 1..10
  xp: number;
  lastTalkedDayKey?: string;
}

export interface RetentionNarrativeState {
  schemaVersion: number;
  achievements: Record<string, AchievementProgressEntry>;
  pendingToasts: string[];
  npcFriendship: Record<string, NpcFriendshipEntry>;
  unlockedStoryChapters: string[];
  claimedLoginDays: number[]; // [1..7]
  activeSaveSlotId: SaveSlotId;
}

export type SaveSlotId = 'slot_1' | 'slot_2' | 'slot_3' | 'autosave';

export interface SaveSlotMetadata {
  slotId: SaveSlotId;
  label: string;
  parkName: string;
  level: number;
  magicStarsEarned: number;
  savedAt: number;
  schemaVersion: number;
}

export type CloudConflictPolicy = 'newest' | 'highest_progress' | 'local' | 'remote';

export const CURRENT_SAVE_SCHEMA_VERSION = 12;

const CATEGORY_SPECS: Array<{
  cat: AchievementCategory;
  prefixVi: string;
  descTemplateVi: string;
  icon: string;
  targets: number[];
}> = [
  {
    cat: 'farm',
    prefixVi: 'Bậc Thầy Mùa Vụ',
    descTemplateVi: 'Thu hoạch nông sản & chăm sóc đồng cỏ đạt mốc',
    icon: '🌾',
    targets: [10, 30, 75, 150, 300, 600, 1000, 2000, 4000],
  },
  {
    cat: 'building',
    prefixVi: 'Kiến Trúc Sư Hang Sóc',
    descTemplateVi: 'Xây dựng & nâng cấp sao công trình đạt mốc',
    icon: '🏰',
    targets: [2, 5, 10, 16, 24, 35, 50, 70, 100],
  },
  {
    cat: 'puzzle',
    prefixVi: 'Quán Quân Khảo Thí',
    descTemplateVi: 'Chiến thắng các màn Khảo Thí Pháp Thuật đạt mốc',
    icon: '🪄',
    targets: [1, 5, 15, 30, 60, 120, 240, 450, 777],
  },
  {
    cat: 'language',
    prefixVi: 'Học Giả Đa Ngữ',
    descTemplateVi: 'Thuộc lòng cổ ngữ trong Học Viện Thần Chú đạt mốc',
    icon: '📖',
    targets: [3, 10, 25, 50, 90, 140, 210, 300, 420],
  },
  {
    cat: 'social',
    prefixVi: 'Đại Sứ Thung Lũng',
    descTemplateVi: 'Tương trợ hàng xóm & hoàn thành Đơn Hàng Cú đạt mốc',
    icon: '🦉',
    targets: [1, 4, 10, 20, 40, 75, 120, 200],
  },
  {
    cat: 'collection',
    prefixVi: 'Nhà Sưu Tập Phép Thuật',
    descTemplateVi: 'Sưu tầm thẻ Ếch Sô-cô-la & sinh vật huyền bí đạt mốc',
    icon: '🐸',
    targets: [1, 3, 6, 10, 16, 24, 35, 50],
  },
];

function buildAchievementRegistry(): AchievementDef[] {
  const list: AchievementDef[] = [];
  let idx = 1;
  for (const spec of CATEGORY_SPECS) {
    for (let tIdx = 0; tIdx < spec.targets.length; tIdx++) {
      const target = spec.targets[tIdx];
      const id = `ach_${String(idx).padStart(2, '0')}`;
      const tierRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][tIdx] ?? `${tIdx + 1}`;
      list.push({
        id,
        category: spec.cat,
        titleVi: `${spec.prefixVi} ${tierRoman}`,
        descVi: `${spec.descTemplateVi} ${target}.`,
        icon: spec.icon,
        target,
        rewardGalleons: (tIdx + 1) * 45,
        rewardStars: tIdx >= 6 ? 2 : 1,
      });
      idx++;
    }
  }
  return list;
}

export const ACHIEVEMENT_REGISTRY: ReadonlyArray<AchievementDef> = buildAchievementRegistry();

export function createDefaultRetentionState(): RetentionNarrativeState {
  const npcFriendship: Record<string, NpcFriendshipEntry> = {};
  const villagers: VillagerId[] = ['molly', 'arthur', 'ron', 'hermione', 'hagrid', 'ginny'];
  for (const vId of villagers) {
    npcFriendship[vId] = { villagerId: vId, level: 1, xp: 0 };
  }
  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    achievements: {},
    pendingToasts: [],
    npcFriendship,
    unlockedStoryChapters: ['chap_1_burrow_dawn'],
    claimedLoginDays: [],
    activeSaveSlotId: 'slot_1',
  };
}

export function ensureRetentionState(state: GameState): RetentionNarrativeState {
  const holder = state as GameState & { retention?: RetentionNarrativeState };
  if (!holder.retention) {
    holder.retention = createDefaultRetentionState();
  } else {
    holder.retention = migrateRetentionState(holder.retention);
  }
  return holder.retention;
}

export function migrateRetentionState(
  raw: Partial<RetentionNarrativeState> | undefined
): RetentionNarrativeState {
  const base = createDefaultRetentionState();
  if (!raw || typeof raw !== 'object') return base;
  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    achievements: raw.achievements && typeof raw.achievements === 'object' ? { ...raw.achievements } : {},
    pendingToasts: Array.isArray(raw.pendingToasts) ? [...raw.pendingToasts] : [],
    npcFriendship: {
      ...base.npcFriendship,
      ...(raw.npcFriendship && typeof raw.npcFriendship === 'object' ? raw.npcFriendship : {}),
    },
    unlockedStoryChapters: Array.isArray(raw.unlockedStoryChapters) && raw.unlockedStoryChapters.length > 0
      ? [...raw.unlockedStoryChapters]
      : ['chap_1_burrow_dawn'],
    claimedLoginDays: Array.isArray(raw.claimedLoginDays) ? [...raw.claimedLoginDays] : [],
    activeSaveSlotId: raw.activeSaveSlotId ?? 'slot_1',
  };
}

export function getCategoryMetricValue(state: GameState, category: AchievementCategory): number {
  switch (category) {
    case 'farm':
      return Math.floor((state.stats?.totalGalleonsHarvested ?? 0) / 10) + (state.stats?.creaturesFed ?? 0);
    case 'building':
      return (state.buildings?.length ?? 0) + (state.stats?.starUpgradesDone ?? 0);
    case 'puzzle':
      return (
        (state.stats?.minigamesWon ?? 0) +
        (state.match3?.maxClearedLevel ?? state.match3?.levelsWon ?? 0)
      );
    case 'language': {
      const profiles = state.languageQuiz?.profiles;
      if (!profiles) return 0;
      return Object.values(profiles).reduce((acc, p) => acc + (p?.totalCorrect ?? 0), 0);
    }
    case 'social':
      return (
        (state.neighborSocial?.friendshipTokens ?? 0) +
        (state.farmBarn?.ordersDelivered ?? 0)
      );
    case 'collection':
      return (
        Object.keys(state.collectedCards ?? {}).length +
        (state.suitcase?.discoveredMorphs?.length ?? 0)
      );
  }
}

export function evaluateAchievements(state: GameState, now = Date.now()): string[] {
  const ret = ensureRetentionState(state);
  const newlyUnlocked: string[] = [];
  for (const def of ACHIEVEMENT_REGISTRY) {
    const existing = ret.achievements[def.id];
    if (existing?.unlockedAt) continue;
    const val = getCategoryMetricValue(state, def.category);
    if (val >= def.target) {
      ret.achievements[def.id] = {
        ...existing,
        unlockedAt: now,
      };
      ret.pendingToasts.push(def.id);
      newlyUnlocked.push(def.id);
    }
  }
  return newlyUnlocked;
}

export function claimAchievementReward(
  state: GameState,
  achId: string,
  now = Date.now()
): { ok: boolean; rewardGalleons: number; rewardStars: number } {
  const ret = ensureRetentionState(state);
  const def = ACHIEVEMENT_REGISTRY.find((a) => a.id === achId);
  const entry = ret.achievements[achId];
  if (!def || !entry?.unlockedAt || entry.claimedAt) {
    return { ok: false, rewardGalleons: 0, rewardStars: 0 };
  }
  entry.claimedAt = now;
  state.galleons += def.rewardGalleons;
  return {
    ok: true,
    rewardGalleons: def.rewardGalleons,
    rewardStars: def.rewardStars,
  };
}

export function getAchievementCodexSummary(state: GameState): {
  total: number;
  unlocked: number;
  claimed: number;
  completionPct: number;
} {
  const ret = ensureRetentionState(state);
  const total = ACHIEVEMENT_REGISTRY.length;
  let unlocked = 0;
  let claimed = 0;
  for (const def of ACHIEVEMENT_REGISTRY) {
    const e = ret.achievements[def.id];
    if (e?.unlockedAt) unlocked++;
    if (e?.claimedAt) claimed++;
  }
  return {
    total,
    unlocked,
    claimed,
    completionPct: Number(((unlocked / Math.max(1, total)) * 100).toFixed(1)),
  };
}

// --- 2. Save Slots (3 Named + Autosave) & Cloud Save Conflict Policy ---

const SLOT_STORAGE_PREFIX = 'burrow_save_slot_v12_';

export function buildSaveSlotMeta(
  state: GameState,
  slotId: SaveSlotId,
  now = Date.now()
): SaveSlotMetadata {
  const stars =
    (state.match3?.totalStarsEarned ?? 0) +
    (state.stats?.minigamesWon ?? 0);
  const labels: Record<SaveSlotId, string> = {
    slot_1: 'Hồ Sơ Hang Sóc 1',
    slot_2: 'Hồ Sơ Hang Sóc 2',
    slot_3: 'Hồ Sơ Hang Sóc 3',
    autosave: 'Tự Động Lưu (Autosave)',
  };
  return {
    slotId,
    label: labels[slotId],
    parkName: state.parkName || 'Trang Trại Hang Sóc',
    level: state.level || 1,
    magicStarsEarned: stars,
    savedAt: now,
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
  };
}

export function exportSavePayload(state: GameState, slotId: SaveSlotId = 'slot_1', now = Date.now()): string {
  const ret = ensureRetentionState(state);
  ret.activeSaveSlotId = slotId;
  ret.schemaVersion = CURRENT_SAVE_SCHEMA_VERSION;
  const envelope = {
    meta: buildSaveSlotMeta(state, slotId, now),
    state,
  };
  return JSON.stringify(envelope);
}

export function importSavePayload(rawJson: string): {
  ok: boolean;
  meta?: SaveSlotMetadata;
  state?: GameState;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'invalid_json' };
    }
    // Backward compatibility: accepts either { meta, state } envelope or raw GameState
    const stateObj: GameState | undefined =
      parsed.state && typeof parsed.state === 'object'
        ? (parsed.state as GameState)
        : typeof parsed.version === 'number' && Array.isArray(parsed.buildings)
          ? (parsed as GameState)
          : undefined;
    if (!stateObj) {
      return { ok: false, error: 'missing_state' };
    }
    ensureRetentionState(stateObj);
    const meta: SaveSlotMetadata =
      parsed.meta && typeof parsed.meta === 'object'
        ? {
            ...parsed.meta,
            schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
          }
        : buildSaveSlotMeta(stateObj, 'slot_1', stateObj.lastSavedAt || Date.now());
    return { ok: true, meta, state: stateObj };
  } catch {
    return { ok: false, error: 'parse_error' };
  }
}

export function saveToNamedSlot(
  state: GameState,
  slotId: SaveSlotId,
  storage?: Pick<Storage, 'setItem'>
): SaveSlotMetadata {
  const payload = exportSavePayload(state, slotId);
  const meta = buildSaveSlotMeta(state, slotId);
  const targetStorage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  try {
    targetStorage?.setItem(`${SLOT_STORAGE_PREFIX}${slotId}`, payload);
  } catch {
    // Storage quota guard
  }
  return meta;
}

export function loadFromNamedSlot(
  slotId: SaveSlotId,
  storage?: Pick<Storage, 'getItem'>
): { ok: boolean; meta?: SaveSlotMetadata; state?: GameState } {
  const targetStorage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  const raw = targetStorage?.getItem(`${SLOT_STORAGE_PREFIX}${slotId}`);
  if (!raw) return { ok: false };
  return importSavePayload(raw);
}

export function resolveCloudSaveConflict(
  localMeta: SaveSlotMetadata,
  remoteMeta: SaveSlotMetadata,
  policy: CloudConflictPolicy = 'highest_progress'
): { winner: 'local' | 'remote'; reason: string } {
  if (policy === 'local') return { winner: 'local', reason: 'forced_local' };
  if (policy === 'remote') return { winner: 'remote', reason: 'forced_remote' };
  if (policy === 'newest') {
    return localMeta.savedAt >= remoteMeta.savedAt
      ? { winner: 'local', reason: 'newer_timestamp' }
      : { winner: 'remote', reason: 'newer_timestamp' };
  }
  // Default: highest_progress (level first, then magicStarsEarned, then timestamp)
  if (localMeta.level !== remoteMeta.level) {
    return localMeta.level > remoteMeta.level
      ? { winner: 'local', reason: 'higher_level' }
      : { winner: 'remote', reason: 'higher_level' };
  }
  if (localMeta.magicStarsEarned !== remoteMeta.magicStarsEarned) {
    return localMeta.magicStarsEarned > remoteMeta.magicStarsEarned
      ? { winner: 'local', reason: 'more_stars' }
      : { winner: 'remote', reason: 'more_stars' };
  }
  return localMeta.savedAt >= remoteMeta.savedAt
    ? { winner: 'local', reason: 'tie_breaker_timestamp' }
    : { winner: 'remote', reason: 'tie_breaker_timestamp' };
}

// --- 3. NPC Daily Schedule, Dialogue Branching, Story Cutscenes & Day 1..7 Loop ---

export interface NpcScheduleSlot {
  villagerId: VillagerId;
  period: 'dawn' | 'day' | 'dusk' | 'night';
  zoneId: string;
  activityVi: string;
  mood: 'cheerful' | 'focused' | 'cozy' | 'dreamy';
}

export function getNpcScheduleForPeriod(
  villagerId: VillagerId,
  period: 'dawn' | 'day' | 'dusk' | 'night'
): NpcScheduleSlot {
  const table: Record<VillagerId, Record<'dawn' | 'day' | 'dusk' | 'night', Omit<NpcScheduleSlot, 'villagerId' | 'period'>>> = {
    molly: {
      dawn: { zoneId: 'burrow_core', activityVi: 'Nướng bánh mật đường sớm mai', mood: 'cheerful' },
      day: { zoneId: 'burrow_core', activityVi: 'Chăm vườn bí ngô & đan khăn len', mood: 'cozy' },
      dusk: { zoneId: 'burrow_core', activityVi: 'Chuẩn bị bàn tiệc tối Hang Sóc', mood: 'cheerful' },
      night: { zoneId: 'burrow_core', activityVi: 'Kể chuyện cổ tích bên lò sưởi', mood: 'cozy' },
    },
    arthur: {
      dawn: { zoneId: 'burrow_core', activityVi: 'Chỉnh lại đồng hồ phép thuật', mood: 'focused' },
      day: { zoneId: 'weasley_workshops', activityVi: 'Sửa chữa đồ chơi Muggle trong xưởng', mood: 'cheerful' },
      dusk: { zoneId: 'burrow_core', activityVi: 'Thưởng trà thảo mộc đầu hiên', mood: 'cozy' },
      night: { zoneId: 'burrow_core', activityVi: 'Đọc Nhật Báo Tiên Tri', mood: 'dreamy' },
    },
    ron: {
      dawn: { zoneId: 'burrow_core', activityVi: 'Cho cú Pigwidgeon ăn hạt', mood: 'cozy' },
      day: { zoneId: 'hogsmeade_lane', activityVi: 'Luyện khai cuộc Cờ Phù Thủy', mood: 'focused' },
      dusk: { zoneId: 'honeydukes_sweet', activityVi: 'Thử kẹo nổ ở tiệm Công Tước Mật', mood: 'cheerful' },
      night: { zoneId: 'burrow_core', activityVi: 'Ngắm sao từ gác xép Hang Sóc', mood: 'dreamy' },
    },
    hermione: {
      dawn: { zoneId: 'spell_academy', activityVi: 'Phân loại sổ cổ ngữ Học Viện', mood: 'focused' },
      day: { zoneId: 'spell_academy', activityVi: 'Hướng dẫn thần chú đa ngữ', mood: 'cheerful' },
      dusk: { zoneId: 'hogsmeade_lane', activityVi: 'Ghi chép lịch sử thung lũng', mood: 'focused' },
      night: { zoneId: 'burrow_core', activityVi: 'Ôn tập cổ ngữ bên ánh nến', mood: 'cozy' },
    },
    hagrid: {
      dawn: { zoneId: 'magical_pastures', activityVi: 'Chải lông Bằng Mã bên bìa rừng', mood: 'cheerful' },
      day: { zoneId: 'magical_pastures', activityVi: 'Cho Niffler & Mooncalf ăn cỏ mật', mood: 'cozy' },
      dusk: { zoneId: 'ottery_riverbank', activityVi: 'Thắp đèn lồng dọc bờ sông Ottery', mood: 'cozy' },
      night: { zoneId: 'magical_pastures', activityVi: 'Canh giấc ngủ cho đàn thú nhỏ', mood: 'dreamy' },
    },
    ginny: {
      dawn: { zoneId: 'ottery_riverbank', activityVi: 'Tập bay chổi dọc bờ sông Ottery', mood: 'cheerful' },
      day: { zoneId: 'flower_meadows', activityVi: 'Chăm sóc vườn hoa & thú nhỏ Arnold', mood: 'cheerful' },
      dusk: { zoneId: 'flower_meadows', activityVi: 'Treo đèn lồng cổ ngữ đón hoàng hôn', mood: 'cozy' },
      night: { zoneId: 'burrow_core', activityVi: 'Trò chuyện cùng gia đình bên lò sưởi', mood: 'dreamy' },
    },
  };
  const slot = table[villagerId]?.[period] ?? table.molly.day;
  return {
    villagerId,
    period,
    ...slot,
  };
}

export function answerVillagerDialogue(
  state: GameState,
  villagerId: VillagerId,
  choiceIndex: 0 | 1,
  dayKey = '2026-11-10'
): { level: number; xp: number; leveledUp: boolean; replyVi: string } {
  const ret = ensureRetentionState(state);
  const entry = ret.npcFriendship[villagerId] ?? {
    villagerId,
    level: 1,
    xp: 0,
  };
  const xpGain = choiceIndex === 0 ? 35 : 25;
  entry.xp += xpGain;
  entry.lastTalkedDayKey = dayKey;
  const prevLevel = entry.level;
  while (entry.level < 10 && entry.xp >= entry.level * 60) {
    entry.xp -= entry.level * 60;
    entry.level++;
  }
  ret.npcFriendship[villagerId] = entry;
  return {
    level: entry.level,
    xp: entry.xp,
    leveledUp: entry.level > prevLevel,
    replyVi:
      choiceIndex === 0
        ? 'Cảm ơn con! Hang Sóc hôm nay ấm áp hơn hẳn nhờ tấm lòng của con.'
        : 'Một ý tưởng thật thú vị, chúng ta cùng bắt tay làm thử nhé!',
  };
}

export interface StoryCutsceneChapter {
  id: string;
  chapterNumber: 1 | 2 | 3;
  titleVi: string;
  unlockLevel: number;
  keyframes: Array<{
    durationMs: number;
    cameraFocusGx: number;
    cameraFocusGy: number;
    captionVi: string;
  }>;
}

export const STORY_CUTSCENE_CHAPTERS: ReadonlyArray<StoryCutsceneChapter> = [
  {
    id: 'chap_1_burrow_dawn',
    chapterNumber: 1,
    titleVi: 'Chương I — Bình Minh Trên Mái Ngói Hang Sóc',
    unlockLevel: 1,
    keyframes: [
      { durationMs: 2200, cameraFocusGx: 18, cameraFocusGy: 18, captionVi: 'Nắng sớm chạm vào cánh quạt cối xay gió nhà Weasley...' },
      { durationMs: 2400, cameraFocusGx: 22, cameraFocusGy: 20, captionVi: 'Bà Molly mỉm cười trao cho bạn túi hạt giống phép thuật đầu tiên.' },
    ],
  },
  {
    id: 'chap_2_hogsmeade_lanterns',
    chapterNumber: 2,
    titleVi: 'Chương II — Đèn Lồng Thung Lũng Hogsmeade',
    unlockLevel: 5,
    keyframes: [
      { durationMs: 2400, cameraFocusGx: 30, cameraFocusGy: 24, captionVi: 'Những chiếc đèn lồng bay lên dọc con đường đá cuội dẫn về Hogsmeade...' },
      { durationMs: 2600, cameraFocusGx: 34, cameraFocusGy: 28, captionVi: 'Hương bơ đường từ tiệm Công Tước Mật lan tỏa khắp thung lũng.' },
    ],
  },
  {
    id: 'chap_3_great_harvest_crown',
    chapterNumber: 3,
    titleVi: 'Chương III — Vương Miện Đại Tiệc Mùa Gặt',
    unlockLevel: 12,
    keyframes: [
      { durationMs: 2500, cameraFocusGx: 36, cameraFocusGy: 36, captionVi: 'Cả thung lũng tụ hội dưới bầu trời pháo hoa rồng vàng rực rỡ!' },
      { durationMs: 2500, cameraFocusGx: 20, cameraFocusGy: 20, captionVi: 'Hang Sóc chính thức trở thành trái tim phép thuật ấm áp nhất xứ sở.' },
    ],
  },
];

export const DAY_1_TO_7_REWARDS: ReadonlyArray<{
  day: number;
  titleVi: string;
  galleons: number;
  magicStars: number;
  phoenixTalismans: number;
}> = [
  { day: 1, titleVi: 'Ngày 1 — Quà Tân Thủ Bà Molly', galleons: 50, magicStars: 1, phoenixTalismans: 0 },
  { day: 2, titleVi: 'Ngày 2 — Giỏ Hạt Giống Phép', galleons: 80, magicStars: 1, phoenixTalismans: 1 },
  { day: 3, titleVi: 'Ngày 3 — Ấm Trà Ông Arthur', galleons: 120, magicStars: 2, phoenixTalismans: 0 },
  { day: 4, titleVi: 'Ngày 4 — Sổ Cổ Ngữ Hermione', galleons: 160, magicStars: 2, phoenixTalismans: 1 },
  { day: 5, titleVi: 'Ngày 5 — Kẹo Mật Honeydukes', galleons: 220, magicStars: 3, phoenixTalismans: 1 },
  { day: 6, titleVi: 'Ngày 6 — Lồng Đèn Đom Đóm Luna', galleons: 300, magicStars: 4, phoenixTalismans: 1 },
  { day: 7, titleVi: 'Ngày 7 — Vương Miện Phượng Hoàng', galleons: 500, magicStars: 6, phoenixTalismans: 2 },
];

export function claimDailyRetentionReward(
  state: GameState,
  dayNumber: number
): { ok: boolean; reward?: (typeof DAY_1_TO_7_REWARDS)[number] } {
  const ret = ensureRetentionState(state);
  const def = DAY_1_TO_7_REWARDS.find((d) => d.day === dayNumber);
  if (!def || ret.claimedLoginDays.includes(dayNumber)) {
    return { ok: false };
  }
  ret.claimedLoginDays.push(dayNumber);
  state.galleons += def.galleons;
  state.phoenixTalismans = Math.min(12, (state.phoenixTalismans ?? 0) + def.phoenixTalismans);
  return { ok: true, reward: def };
}
