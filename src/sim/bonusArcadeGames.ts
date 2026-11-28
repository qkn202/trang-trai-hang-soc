import { FARM_CROPS, FARM_GOODS, formatDurationCompactVi, getCatalogItem, getFarmItemMeta } from '../data/catalog';
import type {
  BonusArcadeGameId,
  BonusArcadeGameRecord,
  BonusArcadeState,
  FarmCropId,
  FarmItemId,
  GameState,
} from '../types/game';
import type { ParkSimulation } from './simulation';
import { recordWeeklyDerbyProgress } from './weeklyDerbyEngine';

export type BonusArcadeMollyBoostKind = 'clear_rescue' | 'upgrade_orb' | 'sun_surge';

export const BONUS_ARCADE_ORDER: readonly BonusArcadeGameId[] = ['block_blast', 'suika', 'pvz'];

export interface BonusArcadeGameMeta {
  id: BonusArcadeGameId;
  titleVi: string;
  shortTabVi: string;
  icon: string;
  spriteIcon: string;
  embedFile: string;
  specialtyTagVi: string;
  specialtyDescVi: string;
  mollyBoostKind: BonusArcadeMollyBoostKind;
  mollyBoostTitleVi: string;
  mollyBoostDescVi: string;
  primarySupplyItemId: FarmItemId;
  fallbackSupplyItemId: FarmItemId;
  fallbackQty: number;
}

export const BONUS_ARCADE_META: Record<BonusArcadeGameId, BonusArcadeGameMeta> = {
  block_blast: {
    id: 'block_blast',
    titleVi: 'Khảm Ngọc Hang Sóc',
    shortTabVi: 'Khảm Ngọc',
    icon: '🧱',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/res_brick.webp',
    embedFile: 'block-blast.html',
    specialtyTagVi: 'Ủ xưởng −25% · +🔌 mỗi 3 màn',
    specialtyDescVi:
      'Thắng Khảm Ngọc rút −25% (ít nhất −5p) xưởng đang chế biến hoặc tặng +1 Bột Mì; mỗi 3 chiến thắng nhận thêm +1 🔌 Phích Cắm.',
    mollyBoostKind: 'clear_rescue',
    mollyBoostTitleVi: 'Bánh Nổ Cứu Bàn',
    mollyBoostDescVi: 'Xoá 1 hàng/cột đang đầy & đổi 3 khối mới!',
    primarySupplyItemId: 'cinnamon_apple_pie',
    fallbackSupplyItemId: 'ottery_wheat',
    fallbackQty: 3,
  },
  suika: {
    id: 'suika',
    titleVi: 'Hợp Quả Hang Sóc',
    shortTabVi: 'Hợp Quả',
    icon: '🎃',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_garden_pumpkin.webp',
    embedFile: 'suika.html',
    specialtyTagVi: '+2 Nông sản · +1 Phân Ủ',
    specialtyDescVi:
      'Đạt mốc Hợp Quả tặng +2 nông sản vườn (Táo / Bí Ngô / Dâu) vào Kho Đỏ & +1 🌿 Phân Ủ Thảo Dược.',
    mollyBoostKind: 'upgrade_orb',
    mollyBoostTitleVi: 'Rượu Táo Nâng Quả',
    mollyBoostDescVi: 'Lắc bình & thăng cấp ngay 1 quả lên bậc cao hơn!',
    primarySupplyItemId: 'honey_apple_cider',
    fallbackSupplyItemId: 'ottery_wheat',
    fallbackQty: 3,
  },
  pvz: {
    id: 'pvz',
    titleVi: 'Vườn Thủ Hang Sóc',
    shortTabVi: 'Vườn Thủ',
    icon: '🌱',
    spriteIcon: '/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp',
    embedFile: 'pvz.html',
    specialtyTagVi: 'Tưới toàn ruộng · +1 Sương Mai',
    specialtyDescVi:
      'Thắng Vườn Thủ tự tưới Aguamenti (−30% giờ chín) cho toàn bộ ruộng đang trồng & kết tinh +1 🧪 Bình Sương Mai.',
    mollyBoostKind: 'sun_surge',
    mollyBoostTitleVi: 'Súp Ánh Dương (+250)',
    mollyBoostDescVi: 'Cộng ngay +250 Ánh Dương & hồi mọi hạt giống cây!',
    primarySupplyItemId: 'cream_mushroom_soup',
    fallbackSupplyItemId: 'ottery_wheat',
    fallbackQty: 3,
  },
};

export interface BonusArcadeVictoryOutcome {
  ok: boolean;
  gameId: BonusArcadeGameId;
  starsEarned: number;
  sickleEarned: number;
  xpEarned: number;
  buildReducedSec: number;
  specialtySummaryVi: string;
  msg: string;
  record: BonusArcadeGameRecord;
  proofDigest?: string;
}

export interface ResolvedBonusMollySupply {
  ready: boolean;
  itemId: FarmItemId;
  itemNameVi: string;
  itemEmoji: string;
  qtyNeeded: number;
  haveQty: number;
  isPrimary: boolean;
  boostKind: BonusArcadeMollyBoostKind;
  titleVi: string;
  descVi: string;
}

export const BONUS_ARCADE_MAX_SINGLE_RUN_SCORE = 500_000;
export const BONUS_ARCADE_MAX_SINGLE_RUN_COMBO = 999;
export const BONUS_ARCADE_MAX_STAGE_JUMP = 2;
export const BONUS_ARCADE_MAX_STAGE = 9999;

const MAX_SEEN_VICTORY_RUN_IDS = 64;
const seenVictoryRunIds = new Set<string>();
const SUIKA_ROTATING_CROPS: readonly FarmCropId[] = ['burrow_apple', 'garden_pumpkin', 'ruby_strawberry'];

function clampInt(raw: unknown, min: number, max: number, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function fnv1a32Ascii(seed: number, text: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Deterministic dual-lane FNV-1a proof digest (`ba1:<hex8>-<hex8>`) over a sanitized Bonus Arcade run.
 * Enables server-side verification if Bonus Arcade games are later promoted to ranked rewards.
 */
export function buildBonusArcadeRunProof(
  gameId: BonusArcadeGameId,
  stage: number,
  score: number,
  combo: number,
  runId = ''
): string {
  const safeStage = clampInt(stage, 1, BONUS_ARCADE_MAX_STAGE, 1);
  const safeScore = clampInt(score, 0, BONUS_ARCADE_MAX_SINGLE_RUN_SCORE, 0);
  const safeCombo = clampInt(combo, 0, BONUS_ARCADE_MAX_SINGLE_RUN_COMBO, 0);
  const safeRunId = typeof runId === 'string' ? runId.trim().slice(0, 120) : '';
  const forward = `ba:v1|${gameId}|${safeStage}|${safeScore}|${safeCombo}|${safeRunId}`;
  const reverse = `${safeRunId}|${safeCombo}|${safeScore}|${safeStage}|${gameId}|ba:v1`;
  const h1 = fnv1a32Ascii(0x811c9dc5, forward);
  const h2 = fnv1a32Ascii(0x9e3779b1, reverse);
  return `ba1:${h1.toString(16).padStart(8, '0')}-${h2.toString(16).padStart(8, '0')}`;
}

export function isBonusArcadeGameId(val: unknown): val is BonusArcadeGameId {
  return val === 'block_blast' || val === 'suika' || val === 'pvz';
}

function createDefaultRecord(): BonusArcadeGameRecord {
  return {
    unlockedStage: 1,
    clearedStages: 0,
    bestScore: 0,
    bestCombo: 0,
    winsCount: 0,
  };
}

function sanitizeRecord(raw: unknown): BonusArcadeGameRecord {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createDefaultRecord();
  }
  const r = raw as Record<string, unknown>;
  const lastPlayedAt =
    typeof r.lastPlayedAt === 'number' && Number.isFinite(r.lastPlayedAt) && r.lastPlayedAt > 0
      ? Math.floor(r.lastPlayedAt)
      : undefined;
  return {
    unlockedStage: clampInt(r.unlockedStage, 1, BONUS_ARCADE_MAX_STAGE, 1),
    clearedStages: clampInt(r.clearedStages, 0, 99999, 0),
    bestScore: clampInt(r.bestScore, 0, BONUS_ARCADE_MAX_SINGLE_RUN_SCORE, 0),
    bestCombo: clampInt(r.bestCombo, 0, BONUS_ARCADE_MAX_SINGLE_RUN_COMBO, 0),
    winsCount: clampInt(r.winsCount, 0, 99999, 0),
    ...(lastPlayedAt !== undefined ? { lastPlayedAt } : {}),
  };
}

export function createDefaultBonusArcadeState(): BonusArcadeState {
  return {
    block_blast: createDefaultRecord(),
    suika: createDefaultRecord(),
    pvz: createDefaultRecord(),
  };
}

export function sanitizeBonusArcadeState(raw: unknown): BonusArcadeState | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return undefined;
  }
  const src = raw as Record<string, unknown>;
  return {
    block_blast: sanitizeRecord(src.block_blast),
    suika: sanitizeRecord(src.suika),
    pvz: sanitizeRecord(src.pvz),
  };
}

export function ensureBonusArcadeState(state: GameState): BonusArcadeState {
  if (!state.bonusArcade || typeof state.bonusArcade !== 'object' || Array.isArray(state.bonusArcade)) {
    state.bonusArcade = createDefaultBonusArcadeState();
    return state.bonusArcade;
  }
  for (const id of BONUS_ARCADE_ORDER) {
    state.bonusArcade[id] = sanitizeRecord(state.bonusArcade[id]);
  }
  return state.bonusArcade;
}

export function recordBonusArcadeScore(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId,
  payload: { bestScore?: number; bestCombo?: number; unlockedStage?: number }
): BonusArcadeGameRecord {
  const bonus = ensureBonusArcadeState(sim.state);
  const rec = bonus[gameId];
  const prevUnlocked = rec.unlockedStage;
  let changed = false;

  if (payload.bestScore !== undefined) {
    const nextScore = clampInt(payload.bestScore, 0, BONUS_ARCADE_MAX_SINGLE_RUN_SCORE, 0);
    if (nextScore > rec.bestScore) {
      rec.bestScore = nextScore;
      changed = true;
    }
  }
  if (payload.bestCombo !== undefined) {
    const nextCombo = clampInt(payload.bestCombo, 0, BONUS_ARCADE_MAX_SINGLE_RUN_COMBO, 0);
    if (nextCombo > rec.bestCombo) {
      rec.bestCombo = nextCombo;
      changed = true;
    }
  }
  if (payload.unlockedStage !== undefined) {
    const maxAllowedUnlocked = Math.min(
      BONUS_ARCADE_MAX_STAGE,
      prevUnlocked + BONUS_ARCADE_MAX_STAGE_JUMP
    );
    const nextStage = clampInt(payload.unlockedStage, 1, maxAllowedUnlocked, prevUnlocked);
    if (nextStage > rec.unlockedStage) {
      rec.unlockedStage = nextStage;
      changed = true;
    }
  }

  rec.lastPlayedAt = Date.now();
  if (changed && !sim.isVisitingNeighbor && !sim.isHeadmasterPreview) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return rec;
}

function rememberVictoryRunId(dedupeKey: string): void {
  seenVictoryRunIds.add(dedupeKey);
  if (seenVictoryRunIds.size > MAX_SEEN_VICTORY_RUN_IDS) {
    const oldest = seenVictoryRunIds.values().next().value;
    if (oldest !== undefined) {
      seenVictoryRunIds.delete(oldest);
    }
  }
}

function applyBonusArcadeFarmSpecialty(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId,
  winsCount: number,
  now: number
): string {
  const parts: string[] = [];

  if (gameId === 'block_blast') {
    let workshopsAccelerated = 0;
    let maxShavedSec = 0;
    for (const b of sim.state.buildings) {
      if (now < b.constructEndsAt) continue;
      if (!b.workshopQueue || b.workshopQueue.length === 0) continue;
      const head = b.workshopQueue[0];
      const leftMs = Math.max(0, head.endsAt - now);
      if (leftMs <= 0) continue;
      const shaveMs = Math.min(leftMs, Math.max(5 * 60 * 1000, Math.round(leftMs * 0.25)));
      if (shaveMs <= 0) continue;
      for (const slot of b.workshopQueue) {
        slot.startedAt = Math.min(slot.startedAt, Math.max(0, slot.startedAt - shaveMs));
        slot.endsAt = Math.max(now, slot.endsAt - shaveMs);
      }
      workshopsAccelerated += 1;
      maxShavedSec = Math.max(maxShavedSec, Math.max(1, Math.round(shaveMs / 1000)));
    }
    if (workshopsAccelerated > 0) {
      parts.push(`🔥 Ủ ${workshopsAccelerated} xưởng −${formatDurationCompactVi(maxShavedSec)}`);
    } else {
      const addedFlour = sim.addFarmItemToBarn('fine_wheat_flour', 1);
      if (addedFlour > 0) {
        parts.push(`${FARM_GOODS.fine_wheat_flour.emoji} +1 Bột Mì`);
      } else {
        sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
        parts.push('🌿 +1 Phân Ủ');
      }
    }
    if (winsCount > 0 && winsCount % 3 === 0) {
      const barn = sim.ensureFarmBarn();
      barn.goods.muggle_plug_kit = Math.max(0, Math.floor(barn.goods.muggle_plug_kit ?? 0)) + 1;
      parts.push('🔌 +1 Phích Cắm');
    }
    return parts.join(' · ');
  }

  if (gameId === 'suika') {
    const cropId = SUIKA_ROTATING_CROPS[(Math.max(1, winsCount) - 1) % SUIKA_ROTATING_CROPS.length];
    const cropMeta = FARM_CROPS[cropId];
    const added = sim.addFarmItemToBarn(cropId, 2);
    if (added > 0) {
      parts.push(`${cropMeta.emoji} +${added} ${cropMeta.name}`);
    }
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    parts.push('🌿 +1 Phân Ủ');
    return parts.join(' · ');
  }

  // pvz: water all growing unwatered farmland plots (-30% remaining time) + +1 Morning Dew
  let watered = 0;
  for (const b of sim.state.buildings) {
    if (now < b.constructEndsAt) continue;
    const it = getCatalogItem(b.itemId);
    if (!it?.isFarmlandPlot || !b.cropId || !b.cropReadyAt || now >= b.cropReadyAt || b.cropWateredBoost) {
      continue;
    }
    const leftMs = b.cropReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.3));
    b.cropReadyAt = Math.max(now + 1000, b.cropReadyAt - savedMs);
    b.cropWateredBoost = true;
    watered += 1;
  }
  if (watered > 0) {
    parts.push(`💧 Tưới ${watered} ruộng −30%`);
  }
  sim.state.morningDewPhials = Math.min(
    99,
    Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + 1
  );
  parts.push('🧪 +1 Sương Mai');
  return parts.join(' · ');
}

export function completeBonusArcadeVictory(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId,
  payload: { stage?: number; score?: number; combo?: number; isBoss?: boolean; runId?: string } = {}
): BonusArcadeVictoryOutcome {
  const bonus = ensureBonusArcadeState(sim.state);
  const rec = bonus[gameId];
  const meta = BONUS_ARCADE_META[gameId];

  if (sim.isVisitingNeighbor) {
    return {
      ok: false,
      gameId,
      starsEarned: 0,
      sickleEarned: 0,
      xpEarned: 0,
      buildReducedSec: 0,
      specialtySummaryVi: '',
      msg: 'Hãy về trang trại nhà để nhận thưởng khảo thí!',
      record: rec,
    };
  }

  const rawRunId = typeof payload.runId === 'string' ? payload.runId.trim().slice(0, 120) : '';
  if (rawRunId) {
    const dedupeKey = `${gameId}:${rawRunId}`;
    if (seenVictoryRunIds.has(dedupeKey)) {
      return {
        ok: false,
        gameId,
        starsEarned: 0,
        sickleEarned: 0,
        xpEarned: 0,
        buildReducedSec: 0,
        specialtySummaryVi: '',
        msg: 'Phần thưởng chiến thắng ván này đã được trao rồi!',
        record: rec,
      };
    }
    rememberVictoryRunId(dedupeKey);
  }

  const now = Date.now();
  const prevUnlocked = rec.unlockedStage;
  const maxStageAllowed = Math.min(
    BONUS_ARCADE_MAX_STAGE,
    prevUnlocked + BONUS_ARCADE_MAX_STAGE_JUMP
  );
  const stage = clampInt(payload.stage, 1, maxStageAllowed, prevUnlocked);
  const score = clampInt(payload.score, 0, BONUS_ARCADE_MAX_SINGLE_RUN_SCORE, 0);
  const combo = clampInt(payload.combo, 0, BONUS_ARCADE_MAX_SINGLE_RUN_COMBO, 0);
  const isBoss = Boolean(payload.isBoss);
  const proofDigest = buildBonusArcadeRunProof(gameId, stage, score, combo, rawRunId);

  rec.winsCount = Math.min(99999, rec.winsCount + 1);
  rec.clearedStages = Math.min(99999, rec.clearedStages + 1);
  rec.unlockedStage = Math.min(maxStageAllowed, Math.max(prevUnlocked, stage + 1));
  rec.bestScore = Math.max(rec.bestScore, score);
  rec.bestCombo = Math.max(rec.bestCombo, combo);
  rec.lastPlayedAt = now;

  const starsEarned = isBoss ? 2 : 1;
  const sickleEarned = Math.max(
    24,
    Math.min(
      64,
      24 +
        Math.min(20, Math.floor((stage - 1) * 2)) +
        Math.min(12, Math.floor(score / 800)) +
        (isBoss ? 8 : 0)
    )
  );
  const xpEarned = Math.max(
    18,
    Math.min(
      42,
      18 +
        Math.min(12, Math.floor((stage - 1) * 1.5)) +
        Math.min(6, Math.floor(score / 1200)) +
        (isBoss ? 6 : 0)
    )
  );

  sim.state.match3.stars = Math.max(0, Math.floor(sim.state.match3.stars ?? 0)) + starsEarned;
  sim.state.match3.totalStarsEarned =
    Math.max(0, Math.floor(sim.state.match3.totalStarsEarned ?? 0)) + starsEarned;

  sim.state.galleons += sickleEarned;
  sim.state.finance.harvestRevenue += sickleEarned;
  sim.addXp(xpEarned);
  sim.addHarvestFeastPoints(8);
  sim.state.stats.minigamesWon = Math.max(0, Math.floor(sim.state.stats.minigamesWon ?? 0)) + 1;

  // Apply game-specific Farm Specialty before global gameplay timer reduction so short crops/workshops
  // still receive their dedicated watering/acceleration effect cleanly.
  const specialtySummaryVi = applyBonusArcadeFarmSpecialty(sim, gameId, rec.winsCount, now);

  const rawReduceSec = isBoss
    ? 900
    : Math.min(900, 600 + Math.min(300, Math.floor(combo / 3) * 60));
  const buildReduction = sim.applyConstructionReductionFromGameplay(rawReduceSec, meta.titleVi);
  const buildReducedSec = buildReduction.reducedSec;

  recordWeeklyDerbyProgress(sim, 'minigame_win', 1, now);

  sim.audio.playLevelUp?.();
  if (starsEarned > 0) sim.onRewardFly?.('stars', starsEarned);
  if (sickleEarned > 0) sim.onRewardFly?.('galleons', sickleEarned);
  if (xpEarned > 0) sim.onRewardFly?.('xp', xpEarned);

  sim.saveToStorage();
  sim.onUiChange?.();

  const buildNote = buildReducedSec > 0 ? ` · ⏳ −${formatDurationCompactVi(buildReducedSec)}` : '';
  const msg = `${meta.icon} ${meta.titleVi}: +${starsEarned} 🌟 · +${sickleEarned} Sickle · +${xpEarned} ⭐ · ${specialtySummaryVi}${buildNote}`;

  return {
    ok: true,
    gameId,
    starsEarned,
    sickleEarned,
    xpEarned,
    buildReducedSec,
    specialtySummaryVi,
    msg,
    record: rec,
    proofDigest,
  };
}

export function resolveBonusArcadeMollySupply(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId
): ResolvedBonusMollySupply {
  const meta = BONUS_ARCADE_META[gameId];
  const primaryMeta = getFarmItemMeta(meta.primarySupplyItemId);
  const fallbackMeta = getFarmItemMeta(meta.fallbackSupplyItemId);

  if (sim.state.sandboxMode) {
    return {
      ready: true,
      itemId: meta.primarySupplyItemId,
      itemNameVi: primaryMeta.name,
      itemEmoji: primaryMeta.emoji,
      qtyNeeded: 1,
      haveQty: 99,
      isPrimary: true,
      boostKind: meta.mollyBoostKind,
      titleVi: meta.mollyBoostTitleVi,
      descVi: meta.mollyBoostDescVi,
    };
  }

  const primaryHave = sim.getFarmItemCount(meta.primarySupplyItemId);
  if (primaryHave >= 1) {
    return {
      ready: true,
      itemId: meta.primarySupplyItemId,
      itemNameVi: primaryMeta.name,
      itemEmoji: primaryMeta.emoji,
      qtyNeeded: 1,
      haveQty: primaryHave,
      isPrimary: true,
      boostKind: meta.mollyBoostKind,
      titleVi: meta.mollyBoostTitleVi,
      descVi: meta.mollyBoostDescVi,
    };
  }

  const fallbackHave = sim.getFarmItemCount(meta.fallbackSupplyItemId);
  if (fallbackHave >= meta.fallbackQty) {
    return {
      ready: true,
      itemId: meta.fallbackSupplyItemId,
      itemNameVi: fallbackMeta.name,
      itemEmoji: fallbackMeta.emoji,
      qtyNeeded: meta.fallbackQty,
      haveQty: fallbackHave,
      isPrimary: false,
      boostKind: meta.mollyBoostKind,
      titleVi: meta.mollyBoostTitleVi,
      descVi: meta.mollyBoostDescVi,
    };
  }

  return {
    ready: false,
    itemId: meta.primarySupplyItemId,
    itemNameVi: primaryMeta.name,
    itemEmoji: primaryMeta.emoji,
    qtyNeeded: 1,
    haveQty: primaryHave,
    isPrimary: true,
    boostKind: meta.mollyBoostKind,
    titleVi: meta.mollyBoostTitleVi,
    descVi: meta.mollyBoostDescVi,
  };
}

export function consumeBonusArcadeMollySupply(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId
): { ok: boolean; msg: string; boostKind?: BonusArcadeMollyBoostKind; remaining: number } {
  if (sim.isVisitingNeighbor) {
    return {
      ok: false,
      msg: 'Hãy về trang trại nhà để dùng Hộp Tiếp Tế Bà Molly!',
      remaining: 0,
    };
  }

  const meta = BONUS_ARCADE_META[gameId];
  const supply = resolveBonusArcadeMollySupply(sim, gameId);
  if (!supply.ready) {
    const fbMeta = getFarmItemMeta(meta.fallbackSupplyItemId);
    return {
      ok: false,
      msg: `Cần 1 ${supply.itemEmoji} ${supply.itemNameVi} hoặc ${meta.fallbackQty} ${fbMeta.emoji} ${fbMeta.name} trong Kho Đỏ để dùng ${supply.titleVi}!`,
      remaining: supply.haveQty,
    };
  }

  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(supply.itemId, supply.qtyNeeded);
  }
  recordWeeklyDerbyProgress(sim, 'molly_supply', 1);
  sim.audio.playSpell?.();
  sim.saveToStorage();
  sim.onUiChange?.();

  const remaining = sim.state.sandboxMode ? 99 : sim.getFarmItemCount(supply.itemId);
  return {
    ok: true,
    msg: `${supply.itemEmoji} Hộp Tiếp Tế Bà Molly (${supply.titleVi}): ${supply.descVi}`,
    boostKind: supply.boostKind,
    remaining,
  };
}
