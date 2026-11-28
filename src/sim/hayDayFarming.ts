import {
  FARM_CROPS,
  FARM_GOODS,
  getCatalogItem,
  getFarmItemMeta,
  getWorkshopMaxQueueSlots,
} from '../data/catalog';
import type {
  DailyProphetNewspaperState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FarmVisitorOffer,
  NewspaperClassifiedAd,
  PlacedBuilding,
} from '../types/game';
import type { ParkSimulation } from './simulation';

// ============================================================================
// 1. HAY DAY WHEATING BONUS DROPS ("LỘC MÙA VÀNG")
// ============================================================================

export type HayDayBonusDropKind = 'muggle_plug' | 'compost' | 'morning_dew' | 'time_sand';

export interface HayDayBonusDropResult {
  kind: HayDayBonusDropKind;
  emoji: string;
  labelVi: string;
  threshold: number;
}

/** Ngưỡng thu hoạch rơi Lộc Mùa Vàng tỉ lệ mượt theo quy mô ruộng (8..20 ô, farm mới ~10 ô = 1-2 lần quét liềm). */
export function computeWheatingDropThreshold(farmlandCount: number): number {
  const safePlots = Math.max(1, Math.floor(farmlandCount || 1));
  return Math.max(8, Math.min(20, 8 + Math.floor(safePlots * 0.45)));
}

const WHEATING_DROP_CYCLE: ReadonlyArray<{
  kind: HayDayBonusDropKind;
  emoji: string;
  labelVi: string;
}> = [
  { kind: 'muggle_plug', emoji: '🔌', labelVi: 'Bộ Phích Cắm Muggle (mở Kho Đỏ)' },
  { kind: 'compost', emoji: '🌿', labelVi: 'Phân Ủ Thảo Dược (nâng Đất I–V)' },
  { kind: 'morning_dew', emoji: '🧪', labelVi: 'Bình Sương Mai (−15p)' },
  { kind: 'muggle_plug', emoji: '🔌', labelVi: 'Bộ Phích Cắm Muggle (mở Kho Đỏ)' },
  { kind: 'time_sand', emoji: '⏳', labelVi: 'Cát Xoay Thời Gian' },
  { kind: 'compost', emoji: '🌿', labelVi: 'Phân Ủ Thảo Dược (nâng Đất I–V)' },
  { kind: 'muggle_plug', emoji: '🔌', labelVi: 'Bộ Phích Cắm Muggle (mở Kho Đỏ)' },
  { kind: 'morning_dew', emoji: '🧪', labelVi: 'Bình Sương Mai (−15p)' },
];

export function rollHayDayBonusDrop(dropIndex: number): {
  kind: HayDayBonusDropKind;
  emoji: string;
  labelVi: string;
} {
  const safeIdx = Math.abs(Math.floor(dropIndex || 0)) % WHEATING_DROP_CYCLE.length;
  return WHEATING_DROP_CYCLE[safeIdx];
}

export function getHayDayWheatingProgress(sim: ParkSimulation): {
  current: number;
  threshold: number;
  totalDrops: number;
} {
  let plotCount = 0;
  for (const b of sim.state.buildings) {
    if (getCatalogItem(b.itemId)?.isFarmlandPlot) plotCount++;
  }
  const threshold = computeWheatingDropThreshold(plotCount);
  const current = Math.max(0, Math.floor(sim.state.hayDayHarvestDropMeter ?? 0));
  const totalDrops = Math.max(0, Math.floor(sim.state.hayDayHarvestDropsTotal ?? 0));
  return { current, threshold, totalDrops };
}

/**
 * Cộng điểm vào bộ đếm Lộc Mùa Vàng khi thu hoạch ruộng/đồng cỏ/xưởng.
 * Đạt ngưỡng lập tức thưởng 1 vật phẩm nâng cấp quý giá chuẩn vòng lặp Wheating của Hay Day.
 */
export function advanceHayDayHarvestDropMeter(
  sim: ParkSimulation,
  amount = 1,
  fxGx?: number,
  fxGy?: number
): HayDayBonusDropResult | null {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview || amount <= 0) return null;
  const prog = getHayDayWheatingProgress(sim);
  const nextMeter = prog.current + Math.max(1, Math.floor(amount));
  if (nextMeter < prog.threshold) {
    sim.state.hayDayHarvestDropMeter = nextMeter;
    return null;
  }

  sim.state.hayDayHarvestDropMeter = nextMeter - prog.threshold;
  const nextTotal = prog.totalDrops + 1;
  sim.state.hayDayHarvestDropsTotal = nextTotal;

  const picked = rollHayDayBonusDrop(nextTotal - 1);
  if (picked.kind === 'muggle_plug') {
    const barn = sim.ensureFarmBarn();
    barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + 1;
  } else if (picked.kind === 'compost') {
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
  } else if (picked.kind === 'morning_dew') {
    sim.state.morningDewPhials = Math.min(99, Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + 1);
  } else {
    sim.state.timeSand = Math.max(0, Math.floor(sim.state.timeSand ?? 0)) + 1;
  }

  sim.audio.playWheatingBonusDrop?.();
  if (typeof fxGx === 'number' && typeof fxGy === 'number') {
    sim.spawnFloatingText(fxGx, fxGy - 0.35, `✨ Lộc Mùa Vàng! +1 ${picked.emoji}`, '#fde047');
  }
  if (!sim.batchOperationActive) {
    sim.onToast?.(`✨ Lộc Mùa Vàng khi thu hoạch: Nhặt được +1 ${picked.emoji} ${picked.labelVi}!`, picked.emoji);
  }
  return {
    ...picked,
    threshold: prog.threshold,
  };
}

// ============================================================================
// 2. HAY DAY WORKSHOP MACHINE MASTERY (★1 -> ★3) & EXPANDABLE QUEUE SLOTS
// ============================================================================

export const WORKSHOP_EXTRA_SLOT_COSTS: readonly [number, number, number] = [120, 240, 420];
export const MAX_WORKSHOP_EXTRA_SLOTS = 3;

export interface WorkshopMasteryInfo {
  tier: 0 | 1 | 2 | 3;
  completedCount: number;
  nextTarget: number | null;
  goldMult: number;
  xpMult: number;
  speedMult: number;
  starsLabel: string;
  perkSummaryVi: string;
}

export function getWorkshopMasteryInfo(completedCount: number): WorkshopMasteryInfo {
  const n = Math.max(0, Math.floor(completedCount || 0));
  if (n >= 65) {
    return {
      tier: 3,
      completedCount: n,
      nextTarget: null,
      goldMult: 1.15,
      xpMult: 1.15,
      speedMult: 0.85,
      starsLabel: '★★★',
      perkSummaryVi: '+15% Sickle, +15% XP & chế biến nhanh hơn 15% vĩnh viễn!',
    };
  }
  if (n >= 30) {
    return {
      tier: 2,
      completedCount: n,
      nextTarget: 65,
      goldMult: 1.1,
      xpMult: 1.15,
      speedMult: 1.0,
      starsLabel: '★★☆',
      perkSummaryVi: '+10% Sickle & +15% XP (còn ' + (65 - n) + ' mẻ đạt ★★★ nhanh −15%)',
    };
  }
  if (n >= 10) {
    return {
      tier: 1,
      completedCount: n,
      nextTarget: 30,
      goldMult: 1.1,
      xpMult: 1.0,
      speedMult: 1.0,
      starsLabel: '★☆☆',
      perkSummaryVi: '+10% Sickle từ xưởng (còn ' + (30 - n) + ' mẻ đạt ★★)',
    };
  }
  return {
    tier: 0,
    completedCount: n,
    nextTarget: 10,
    goldMult: 1.0,
    xpMult: 1.0,
    speedMult: 1.0,
    starsLabel: '☆☆☆',
    perkSummaryVi: `Chế biến thêm ${10 - n} mẻ để mở Thông Thạo ★1 (+10% Sickle)`,
  };
}

export function getEffectiveWorkshopQueueCapacity(
  b: Pick<PlacedBuilding, 'stars' | 'extraQueueSlots'>
): number {
  const base = getWorkshopMaxQueueSlots(b.stars);
  const extra = Math.max(0, Math.min(MAX_WORKSHOP_EXTRA_SLOTS, Math.floor(b.extraQueueSlots ?? 0)));
  return Math.min(9, base + extra);
}

export function getNextWorkshopExtraSlotCost(
  b: Pick<PlacedBuilding, 'extraQueueSlots'>
): number | null {
  const extra = Math.max(0, Math.floor(b.extraQueueSlots ?? 0));
  if (extra >= MAX_WORKSHOP_EXTRA_SLOTS) return null;
  return WORKSHOP_EXTRA_SLOT_COSTS[extra];
}

export function recordWorkshopMasteryBatch(
  sim: ParkSimulation,
  workshopGroupId: string,
  workshopNameVi: string,
  silent = false
): WorkshopMasteryInfo {
  const map = (sim.state.workshopMastery ??= {});
  const prev = Math.max(0, Math.floor(map[workshopGroupId] ?? 0));
  const before = getWorkshopMasteryInfo(prev);
  const next = prev + 1;
  map[workshopGroupId] = next;
  const after = getWorkshopMasteryInfo(next);
  if (!silent && after.tier > before.tier) {
    sim.audio.playLevelUp();
    sim.onToast?.(
      `⭐ Xưởng "${workshopNameVi}" đạt Thông Thạo ${after.starsLabel}! (${after.perkSummaryVi})`,
      '⭐'
    );
  }
  return after;
}

export function expandWorkshopQueueSlot(
  sim: ParkSimulation,
  uid: string
): { ok: boolean; msg: string; newCapacity?: number } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể mở khay xưởng nhà bạn bè!' };
  }
  const b = sim.state.buildings.find((x) => x.uid === uid);
  if (!b) return { ok: false, msg: 'Không tìm thấy xưởng chế biến!' };
  const item = getCatalogItem(b.itemId);
  if (!item?.workshopGroupId) {
    return { ok: false, msg: 'Công trình này không có hàng đợi chế biến!' };
  }
  const cost = getNextWorkshopExtraSlotCost(b);
  if (cost === null) {
    return { ok: false, msg: 'Xưởng này đã mở tối đa +3 khay hàng đợi thưởng rồi!' };
  }
  if (!sim.state.sandboxMode && sim.state.galleons < cost) {
    return { ok: false, msg: `Cần ${cost} Sickle để mở thêm 1 khay hàng đợi trên ${item.name}!` };
  }
  if (!sim.state.sandboxMode) {
    sim.state.galleons -= cost;
    sim.state.finance.constructionSpent += cost;
  }
  b.extraQueueSlots = Math.min(MAX_WORKSHOP_EXTRA_SLOTS, Math.max(0, Math.floor(b.extraQueueSlots ?? 0)) + 1);
  const newCap = getEffectiveWorkshopQueueCapacity(b);
  sim.audio.playLevelUp();
  sim.onBuildingTactile?.(b.uid);
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `🔥 Đã mở thêm +1 khay hàng đợi cho ${item.name} (tổng ${newCap} khay • −${sim.state.sandboxMode ? 0 : cost} Sickle)!`;
  sim.onToast?.(msg, '🔥');
  return { ok: true, msg, newCapacity: newCap };
}

// ============================================================================
// 3. HAY DAY FARM VISITORS ("KHÁCH DẠO CỔNG HANG SÓC")
// ============================================================================

export const FARM_VISITOR_RESPAWN_MS = 90_000;

const FARM_VISITOR_CAST: ReadonlyArray<{ name: string; emoji: string; greeting: string }> = [
  { name: 'Bác Hagrid', emoji: '🎃', greeting: 'Bác đang nấu nồi súp lớn ở chòi rừng, nhường bác ít đồ tươi nhé!' },
  { name: 'Luna Lovegood', emoji: '🌙', greeting: 'Mùi nông sản ở Hang Sóc thơm quá, cho mình mua mang về nhà nhé!' },
  { name: 'Neville Longbottom', emoji: '🌿', greeting: 'Thầy đang thí nghiệm thảo dược ở Nhà Kính, bán giúp thầy một ít nhé!' },
  { name: 'Bà Rosmerta', emoji: '🍺', greeting: 'Quán Ba Cây Chổi tối nay đông khách lắm, chia bớt cho quán vài món nhé!' },
  { name: 'Fred & George', emoji: '✨', greeting: 'Tiệm Phù Thủy Weasley cần nguyên liệu làm kẹo mới, chốt đơn nhanh nào!' },
  { name: 'Ông Arthur', emoji: '🔌', greeting: 'Bác cần vài món mang lên Bộ Pháp Thuật làm quà trưa cho đồng nghiệp!' },
];

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildFarmVisitorOffer(
  sim: ParkSimulation,
  slotIndex: 0 | 1,
  nowMs: number,
  excludeItemId?: FarmItemId,
  excludeVisitorName?: string
): FarmVisitorOffer {
  const barn = sim.ensureFarmBarn();
  const seed = hashSeed(`${slotIndex}#${Math.floor(nowMs / 1000)}#${sim.state.stats.farmHarvestsCount ?? 0}#${barn.ordersDelivered}`);
  let actorIdx = (seed + slotIndex * 3) % FARM_VISITOR_CAST.length;
  if (excludeVisitorName && FARM_VISITOR_CAST[actorIdx].name === excludeVisitorName) {
    actorIdx = (actorIdx + 1) % FARM_VISITOR_CAST.length;
  }
  const actor = FARM_VISITOR_CAST[actorIdx];

  // Hay Day signature behavior: prioritize the player's top-stocked barn items so Visitors help clear full Barns!
  const stockedCandidates: Array<{ id: FarmItemId; have: number }> = [];
  for (const [k, v] of Object.entries(barn.crops)) {
    const qty = Math.floor(v || 0);
    if (qty >= 2 && k in FARM_CROPS && k !== excludeItemId) {
      stockedCandidates.push({ id: k as FarmItemId, have: qty });
    }
  }
  for (const [k, v] of Object.entries(barn.goods)) {
    if (k === 'muggle_plug_kit') continue;
    const qty = Math.floor(v || 0);
    if (qty >= 1 && k in FARM_GOODS && k !== excludeItemId) {
      stockedCandidates.push({ id: k as FarmItemId, have: qty });
    }
  }
  stockedCandidates.sort((a, b) => b.have - a.have);

  let chosenId: FarmItemId = 'ottery_wheat';
  let chosenQty = 2;
  if (stockedCandidates.length > 0) {
    const pick = stockedCandidates[slotIndex % stockedCandidates.length];
    chosenId = pick.id;
    const isCrop = chosenId in FARM_CROPS;
    chosenQty = isCrop
      ? Math.max(2, Math.min(6, Math.ceil(pick.have * 0.45)))
      : Math.max(1, Math.min(3, Math.ceil(pick.have * 0.5)));
  } else {
    const unlockedCrops = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
      (cid) => !cid.startsWith('yule_') && !cid.startsWith('vn_') && FARM_CROPS[cid].unlockLevel <= sim.state.level
    );
    const pool = unlockedCrops.length > 0 ? unlockedCrops : (['ottery_wheat'] as FarmCropId[]);
    chosenId = pool[(seed + slotIndex) % pool.length];
    chosenQty = 2;
  }

  const meta = getFarmItemMeta(chosenId);
  const priceMult = 1.18 + ((seed % 15) * 0.01); // 1.18x .. 1.32x base sell value
  const offerSickle = Math.max(chosenQty * 2, Math.round(meta.sellValue * chosenQty * priceMult));
  const offerXp = Math.max(5, Math.round(chosenQty * 3.5));

  return {
    id: `vis_${slotIndex}_${seed.toString(36)}`,
    slotIndex,
    visitorName: actor.name,
    visitorEmoji: actor.emoji,
    quoteVi: actor.greeting,
    itemId: chosenId,
    qty: chosenQty,
    offerSickle,
    offerXp,
    spawnedAt: nowMs,
  };
}

function isValidStandingVisitor(v: FarmVisitorOffer | undefined): v is FarmVisitorOffer {
  return Boolean(v && !v.arrivesAt && (v.itemId in FARM_CROPS || v.itemId in FARM_GOODS));
}

function isWaitingVisitor(v: FarmVisitorOffer | undefined, nowMs: number): v is FarmVisitorOffer {
  return Boolean(v && v.arrivesAt && v.arrivesAt > nowMs);
}

export function ensureFarmVisitors(sim: ParkSimulation, nowMs = Date.now()): FarmVisitorOffer[] {
  const cur = Array.isArray(sim.state.farmVisitors) ? sim.state.farmVisitors : [];
  const rawSlot0 = cur.find((v) => v && v.slotIndex === 0);
  const rawSlot1 = cur.find((v) => v && v.slotIndex === 1);

  const keep0 = isWaitingVisitor(rawSlot0, nowMs) || isValidStandingVisitor(rawSlot0);
  let keep1 = isWaitingVisitor(rawSlot1, nowMs) || isValidStandingVisitor(rawSlot1);

  if (
    keep0 &&
    keep1 &&
    isValidStandingVisitor(rawSlot0) &&
    isValidStandingVisitor(rawSlot1) &&
    rawSlot0.visitorName === rawSlot1.visitorName
  ) {
    keep1 = false;
  }

  let slot0: FarmVisitorOffer;
  if (keep0) {
    slot0 = rawSlot0!;
  } else {
    const other = keep1 ? rawSlot1 : undefined;
    slot0 = buildFarmVisitorOffer(sim, 0, nowMs, other?.itemId, other?.visitorName);
  }

  let slot1: FarmVisitorOffer;
  if (keep1) {
    slot1 = rawSlot1!;
  } else {
    slot1 = buildFarmVisitorOffer(sim, 1, nowMs, slot0.itemId, slot0.visitorName);
  }

  const next: FarmVisitorOffer[] = [slot0, slot1];
  sim.state.farmVisitors = next;
  return next;
}

export function getActiveFarmVisitorsCount(sim: ParkSimulation, nowMs = Date.now()): number {
  const list = ensureFarmVisitors(sim, nowMs);
  return list.filter((v) => !v.arrivesAt || v.arrivesAt <= nowMs).length;
}

export function acceptFarmVisitorOffer(
  sim: ParkSimulation,
  visitorId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string; earnedSickle: number } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để đón khách ghé cổng!', earnedSickle: 0 };
  }
  const visitors = ensureFarmVisitors(sim, nowMs);
  const idx = visitors.findIndex((v) => v.id === visitorId);
  if (idx === -1) return { ok: false, msg: 'Vị khách này đã rời đi rồi!', earnedSickle: 0 };
  const vis = visitors[idx];
  if (vis.arrivesAt && vis.arrivesAt > nowMs) {
    return { ok: false, msg: 'Vị khách đang trên đường tới cổng Hang Sóc!', earnedSickle: 0 };
  }
  const have = sim.getFarmItemCount(vis.itemId);
  const meta = getFarmItemMeta(vis.itemId);
  if (!sim.state.sandboxMode && have < vis.qty) {
    return {
      ok: false,
      msg: `Kho Đỏ còn thiếu ${vis.qty - have} ${meta.emoji} ${meta.name} cho ${vis.visitorName}!`,
      earnedSickle: 0,
    };
  }
  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(vis.itemId, vis.qty);
  }
  sim.state.galleons += vis.offerSickle;
  sim.state.finance.shopRevenue += vis.offerSickle;
  sim.addXp(vis.offerXp);
  sim.addHarvestFeastPoints(6);
  sim.recordQuestProgress('harvest_galleons', undefined, vis.offerSickle);
  advanceHayDayHarvestDropMeter(sim, 1);
  sim.recordWeeklyDerbyProgress('visitor_sale', 1, nowMs);

  visitors[idx] = {
    ...vis,
    id: `vis_wait_${vis.slotIndex}_${nowMs}`,
    arrivesAt: nowMs + FARM_VISITOR_RESPAWN_MS,
  };
  sim.audio.playCoinChime?.();
  sim.audio.playHarvestBubble();
  sim.onRewardFly?.('galleons', vis.offerSickle);
  const msg = `${vis.visitorEmoji} Đã bán ${vis.qty} ${meta.emoji} ${meta.name} cho ${vis.visitorName}: +${vis.offerSickle} Sickle & +${vis.offerXp} ⭐!`;
  sim.onToast?.(msg, vis.visitorEmoji);
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg, earnedSickle: vis.offerSickle };
}

export function dismissFarmVisitorOffer(
  sim: ParkSimulation,
  visitorId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  const visitors = ensureFarmVisitors(sim, nowMs);
  const idx = visitors.findIndex((v) => v.id === visitorId);
  if (idx === -1) return { ok: false, msg: 'Không tìm thấy vị khách này!' };
  const vis = visitors[idx];
  visitors[idx] = {
    ...vis,
    id: `vis_wait_${vis.slotIndex}_${nowMs}`,
    arrivesAt: nowMs + FARM_VISITOR_RESPAWN_MS,
  };
  sim.audio.playClick();
  const msg = `${vis.visitorEmoji} Đã hẹn ${vis.visitorName} dịp khác — vị khách mới sẽ ghé cổng sau 90 giây!`;
  sim.onToast?.(msg, '🦉');
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg };
}

// ============================================================================
// 4. DAILY PROPHET NEWSPAPER ("NHẬT BÁO TIÊN TRI" — HAY DAY DAILY DIRT)
// ============================================================================

export const NEWSPAPER_REFRESH_MS = 180_000;

const NEWSPAPER_SELLERS: ReadonlyArray<{ name: string; emoji: string }> = [
  { name: 'Vườn Bác Hagrid', emoji: '🎃' },
  { name: 'Bếp Nhà Weasley', emoji: '🥧' },
  { name: 'Nhà Kính Cô Sprout', emoji: '🌿' },
  { name: 'Tiệm Kẹo Honeydukes', emoji: '🍬' },
  { name: 'Quán Ba Cây Chổi', emoji: '🍺' },
  { name: 'Tháp Cú Hogsmeade', emoji: '🦉' },
];

const NEWSPAPER_GOOD_POOL: ReadonlyArray<{ id: FarmGoodId; minLevel: number }> = [
  { id: 'fine_wheat_flour', minLevel: 1 },
  { id: 'cinnamon_apple_pie', minLevel: 1 },
  { id: 'farm_egg_wool', minLevel: 1 },
  { id: 'creamy_dairy_milk', minLevel: 1 },
  { id: 'pumpkin_pie', minLevel: 2 },
  { id: 'blossom_honey_jar', minLevel: 3 },
  { id: 'weasley_sweater_w', minLevel: 3 },
  { id: 'honey_apple_cider', minLevel: 4 },
  { id: 'frothy_butterbeer', minLevel: 6 },
  { id: 'floral_bouquet_gift', minLevel: 6 },
];

function generateNewspaperEdition(
  level: number,
  editionId: number,
  nowMs: number
): DailyProphetNewspaperState {
  const safeLv = Math.max(1, Math.floor(level || 1));
  const seed = hashSeed(`prophet#${editionId}#${safeLv}`);
  const unlockedCrops = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
    (cid) => !cid.startsWith('yule_') && !cid.startsWith('vn_') && FARM_CROPS[cid].unlockLevel <= safeLv
  );
  const cropPool = unlockedCrops.length > 0 ? unlockedCrops : (['ottery_wheat'] as FarmCropId[]);
  const goodPool = NEWSPAPER_GOOD_POOL.filter((g) => g.minLevel <= safeLv && g.id in FARM_GOODS).map((g) => g.id);
  const safeGoods = goodPool.length > 0 ? goodPool : (['fine_wheat_flour'] as FarmGoodId[]);

  const ads: NewspaperClassifiedAd[] = [];

  // 3 crop bundles (giá hợp lý để mua cứu Đơn Cú hoặc gieo lại giống)
  for (let i = 0; i < 3; i++) {
    const cid = cropPool[(seed + i * 5) % cropPool.length];
    const meta = FARM_CROPS[cid];
    const qty = 3 + ((seed + i) % 3); // 3..5
    const seller = NEWSPAPER_SELLERS[(seed + i) % NEWSPAPER_SELLERS.length];
    ads.push({
      id: `ad_${editionId}_c${i}`,
      sellerName: seller.name,
      sellerEmoji: seller.emoji,
      kind: 'farm_item',
      itemId: cid,
      qty,
      priceSickle: Math.max(4, Math.round(meta.sellValue * qty * 1.05)),
      sold: false,
    });
  }

  // 2 artisan goods
  for (let i = 0; i < 2; i++) {
    const gid = safeGoods[(seed + i * 3 + 1) % safeGoods.length];
    const meta = FARM_GOODS[gid];
    const qty = 1 + ((seed + i) % 2); // 1..2
    const seller = NEWSPAPER_SELLERS[(seed + 3 + i) % NEWSPAPER_SELLERS.length];
    ads.push({
      id: `ad_${editionId}_g${i}`,
      sellerName: seller.name,
      sellerEmoji: seller.emoji,
      kind: 'farm_item',
      itemId: gid,
      qty,
      priceSickle: Math.max(12, Math.round(meta.sellValue * qty * 1.1)),
      sold: false,
    });
  }

  // 1 Rare Upgrade Snipe (Phích Cắm Muggle / Phân Ủ / Sương Mai — linh hồn săn báo Hay Day!)
  const rareRoll = seed % 3;
  const rareSeller = NEWSPAPER_SELLERS[(seed + 5) % NEWSPAPER_SELLERS.length];
  if (rareRoll === 0) {
    ads.push({
      id: `ad_${editionId}_rare`,
      sellerName: rareSeller.name,
      sellerEmoji: rareSeller.emoji,
      kind: 'muggle_plug',
      qty: 1,
      priceSickle: 85,
      isRareDeal: true,
      sold: false,
    });
  } else if (rareRoll === 1) {
    ads.push({
      id: `ad_${editionId}_rare`,
      sellerName: rareSeller.name,
      sellerEmoji: rareSeller.emoji,
      kind: 'compost',
      qty: 2,
      priceSickle: 65,
      isRareDeal: true,
      sold: false,
    });
  } else {
    ads.push({
      id: `ad_${editionId}_rare`,
      sellerName: rareSeller.name,
      sellerEmoji: rareSeller.emoji,
      kind: 'morning_dew',
      qty: 1,
      priceSickle: 70,
      isRareDeal: true,
      sold: false,
    });
  }

  return {
    editionId,
    issuedAt: nowMs,
    nextRefreshAt: nowMs + NEWSPAPER_REFRESH_MS,
    ads,
  };
}

export function ensureDailyProphetNewspaper(
  sim: ParkSimulation,
  nowMs = Date.now()
): DailyProphetNewspaperState {
  const cur = sim.state.dailyProphetNewspaper;
  if (!cur || !Array.isArray(cur.ads) || cur.ads.length === 0 || nowMs >= cur.nextRefreshAt) {
    const nextEdition = (cur?.editionId ?? 0) + 1;
    const fresh = generateNewspaperEdition(sim.state.level, nextEdition, nowMs);
    sim.state.dailyProphetNewspaper = fresh;
    return fresh;
  }
  return cur;
}

export function refreshDailyProphetNewspaperEarly(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string; edition: DailyProphetNewspaperState } {
  const cur = ensureDailyProphetNewspaper(sim, nowMs);
  if (nowMs >= cur.nextRefreshAt) {
    const fresh = ensureDailyProphetNewspaper(sim, nowMs);
    return { ok: true, msg: '📰 Đã có số Nhật Báo Tiên Tri mới nhất!', edition: fresh };
  }
  if (!sim.state.sandboxMode && sim.state.timeSand < 1) {
    return {
      ok: false,
      msg: 'Cần 1 ⏳ Cát Thời Gian để gọi Cú giao số báo sớm (hoặc chờ tự đổi miễn phí mỗi 3 phút)!',
      edition: cur,
    };
  }
  if (!sim.state.sandboxMode) {
    sim.state.timeSand -= 1;
  }
  const fresh = generateNewspaperEdition(sim.state.level, cur.editionId + 1, nowMs);
  sim.state.dailyProphetNewspaper = fresh;
  sim.audio.playOwlHoot?.(0.035);
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `📰 Số Nhật Báo Tiên Tri #${fresh.editionId} vừa cập bến với 6 tin rao mới!`;
  sim.onToast?.(msg, '📰');
  return { ok: true, msg, edition: fresh };
}

export function buyNewspaperClassifiedAd(
  sim: ParkSimulation,
  adId: string,
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để mua hàng trên Nhật Báo Tiên Tri!' };
  }
  const paper = ensureDailyProphetNewspaper(sim, nowMs);
  const ad = paper.ads.find((a) => a.id === adId);
  if (!ad) return { ok: false, msg: 'Tin rao này đã hết hạn!' };
  if (ad.sold) return { ok: false, msg: 'Món hàng này bạn đã mua trong số báo này rồi!' };
  if (!sim.state.sandboxMode && sim.state.galleons < ad.priceSickle) {
    return { ok: false, msg: `Cần ${ad.priceSickle} Sickle để mua tin rao này!` };
  }

  let rewardLabel = '';
  if (ad.kind === 'farm_item' && ad.itemId) {
    const meta = getFarmItemMeta(ad.itemId);
    const barn = sim.ensureFarmBarn();
    const space = Math.max(0, barn.capacity - sim.getBarnTotalUsed());
    if (!sim.state.sandboxMode && space < ad.qty) {
      return { ok: false, msg: `Kho Đỏ cần còn trống ít nhất ${ad.qty} ô để nhận ${meta.name}!` };
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= ad.priceSickle;
      sim.state.finance.constructionSpent += ad.priceSickle;
    }
    sim.addFarmItemToBarn(ad.itemId, ad.qty);
    rewardLabel = `${ad.qty} ${meta.emoji} ${meta.name}`;
  } else {
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= ad.priceSickle;
      sim.state.finance.constructionSpent += ad.priceSickle;
    }
    if (ad.kind === 'muggle_plug') {
      const barn = sim.ensureFarmBarn();
      barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + ad.qty;
      rewardLabel = `${ad.qty} 🔌 Bộ Phích Cắm Muggle`;
    } else if (ad.kind === 'compost') {
      sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + ad.qty);
      rewardLabel = `${ad.qty} 🌿 Phân Ủ Thảo Dược`;
    } else {
      sim.state.morningDewPhials = Math.min(99, Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + ad.qty);
      rewardLabel = `${ad.qty} 🧪 Bình Sương Mai`;
    }
  }

  ad.sold = true;
  sim.audio.playCoinChime?.();
  sim.audio.playHarvestBubble();
  sim.saveToStorage();
  sim.onUiChange?.();
  const msg = `📰 Đã chốt mua ${rewardLabel} từ ${ad.sellerName} (−${sim.state.sandboxMode ? 0 : ad.priceSickle} Sickle)!`;
  sim.onToast?.(msg, '📰');
  return { ok: true, msg };
}
