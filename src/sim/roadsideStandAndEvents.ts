import { FARM_CROPS, FARM_GOODS, getCatalogItem, getFarmItemMeta } from '../data/catalog';
import { getVietnamCalendarKey } from './neighborSocial';
import type { ParkSimulation } from './simulation';
import {
  FarmCropId,
  FarmItemId,
  FieldMicroEvent,
  FieldMicroEventKind,
  GameState,
  NeighborProfileState,
  RoadsideStandSlot,
  RoadsideStandState,
} from '../types/game';

export const ROADSIDE_STAND_SLOT_COUNT = 6;

const ROADSIDE_BUYERS: ReadonlyArray<{ name: string; emoji: string }> = [
  { name: 'Bà Rosmerta', emoji: '🍺' },
  { name: 'Neville Longbottom', emoji: '🌿' },
  { name: 'Luna Lovegood', emoji: '🌙' },
  { name: 'Bác Hagrid', emoji: '🎃' },
  { name: 'Hermione Granger', emoji: '📜' },
  { name: 'Học sinh Hufflepuff', emoji: '🦡' },
];

export type RoadsidePriceTier = 'bargain' | 'fair' | 'premium';

export function createInitialRoadsideStandState(): RoadsideStandState {
  return {
    slots: Array.from({ length: ROADSIDE_STAND_SLOT_COUNT }, (_, idx) => ({
      slotIndex: idx,
      itemId: null,
      qty: 0,
      unitPrice: 0,
      listedAt: 0,
    })),
    dailyFriendBuysDayKey: getVietnamCalendarKey(),
    dailyFriendBoughtIds: [],
    totalRevenueClaimed: 0,
  };
}

export function sanitizeRoadsideStandState(
  raw: Partial<RoadsideStandState> | undefined
): RoadsideStandState {
  const base = createInitialRoadsideStandState();
  if (!raw || typeof raw !== 'object') return base;
  const slots: RoadsideStandSlot[] = base.slots.map((defSlot, idx) => {
    const s = Array.isArray(raw.slots) ? raw.slots[idx] : undefined;
    if (
      !s ||
      typeof s !== 'object' ||
      typeof s.itemId !== 'string' ||
      !(s.itemId in FARM_CROPS || s.itemId in FARM_GOODS)
    ) {
      return defSlot;
    }
    const qty = Math.max(1, Math.min(10, Math.round(Number(s.qty) || 1)));
    const meta = getFarmItemMeta(s.itemId as FarmItemId);
    const unitPrice = Math.max(
      1,
      Math.min(Math.max(50, meta.sellValue * 3), Math.round(Number(s.unitPrice) || meta.sellValue))
    );
    return {
      slotIndex: idx,
      itemId: s.itemId as FarmItemId,
      qty,
      unitPrice,
      listedAt: Math.max(0, Math.round(Number(s.listedAt) || 0)),
      soldAt: typeof s.soldAt === 'number' && s.soldAt > 0 ? Math.round(s.soldAt) : undefined,
      buyerName: typeof s.buyerName === 'string' ? s.buyerName.slice(0, 40) : undefined,
      buyerEmoji: typeof s.buyerEmoji === 'string' ? s.buyerEmoji.slice(0, 8) : undefined,
    };
  });
  return {
    slots,
    dailyFriendBuysDayKey:
      typeof raw.dailyFriendBuysDayKey === 'string' ? raw.dailyFriendBuysDayKey : base.dailyFriendBuysDayKey,
    dailyFriendBoughtIds: Array.isArray(raw.dailyFriendBoughtIds)
      ? raw.dailyFriendBoughtIds.filter((x): x is string => typeof x === 'string').slice(0, 30)
      : [],
    totalRevenueClaimed: Math.max(0, Math.round(Number(raw.totalRevenueClaimed) || 0)),
  };
}

export function ensureRoadsideStand(state: GameState): RoadsideStandState {
  if (!state.roadsideStand || !Array.isArray(state.roadsideStand.slots)) {
    state.roadsideStand = createInitialRoadsideStandState();
  }
  const today = getVietnamCalendarKey();
  if (state.roadsideStand.dailyFriendBuysDayKey !== today) {
    state.roadsideStand.dailyFriendBuysDayKey = today;
    state.roadsideStand.dailyFriendBoughtIds = [];
  }
  while (state.roadsideStand.slots.length < ROADSIDE_STAND_SLOT_COUNT) {
    state.roadsideStand.slots.push({
      slotIndex: state.roadsideStand.slots.length,
      itemId: null,
      qty: 0,
      unitPrice: 0,
      listedAt: 0,
    });
  }
  return state.roadsideStand;
}

export function computeRoadsideUnitPrice(itemId: FarmItemId, tier: RoadsidePriceTier): number {
  const base = Math.max(2, getFarmItemMeta(itemId).sellValue);
  if (tier === 'bargain') return Math.max(2, Math.round(base * 0.95));
  if (tier === 'premium') return Math.max(base + 2, Math.round(base * 1.35));
  return Math.max(base + 1, Math.round(base * 1.15));
}

export function getRoadsideSaleWaitMs(unitPrice: number, baseSellValue: number): number {
  const ratio = unitPrice / Math.max(1, baseSellValue);
  if (ratio <= 1.0) return 35_000;
  if (ratio <= 1.2) return 75_000;
  return 135_000;
}

export function listOnRoadsideStand(
  sim: ParkSimulation,
  slotIndex: number,
  itemId: FarmItemId,
  qty: number,
  tier: RoadsidePriceTier = 'fair',
  nowMs = Date.now()
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chỉ có thể bày hàng lên Sạp Đầu Ngõ tại trang trại nhà!' };
  }
  const stand = ensureRoadsideStand(sim.state);
  const slot = stand.slots[slotIndex];
  if (!slot) return { ok: false, msg: 'Ô sạp hàng không hợp lệ!' };
  if (slot.itemId) {
    return { ok: false, msg: 'Ô sạp này đang có hàng hoặc chờ thu tiền!' };
  }
  const safeQty = Math.max(1, Math.min(5, Math.round(qty)));
  const have = sim.getFarmItemCount(itemId);
  const meta = getFarmItemMeta(itemId);
  if (!sim.state.sandboxMode && have < safeQty) {
    return { ok: false, msg: `Cần ít nhất ${safeQty} ${meta.emoji} ${meta.name} trong Kho Đỏ để bày lên sạp!` };
  }
  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(itemId, safeQty);
  }
  const unitPrice = computeRoadsideUnitPrice(itemId, tier);
  slot.itemId = itemId;
  slot.qty = safeQty;
  slot.unitPrice = unitPrice;
  slot.listedAt = nowMs;
  slot.soldAt = undefined;
  slot.buyerName = undefined;
  slot.buyerEmoji = undefined;

  sim.audio.playPlace();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🧺 Đã bày ${safeQty} ${meta.emoji} ${meta.name} lên Sạp #${slotIndex + 1} (giá ${unitPrice * safeQty} Sickle)!`,
  };
}

export function tickRoadsideStandBuyers(sim: ParkSimulation, nowMs = Date.now(), silent = false): boolean {
  if (sim.isVisitingNeighbor) return false;
  const stand = ensureRoadsideStand(sim.state);
  let anySold = false;
  for (const slot of stand.slots) {
    if (!slot.itemId || slot.soldAt) continue;
    const meta = getFarmItemMeta(slot.itemId);
    const waitMs = getRoadsideSaleWaitMs(slot.unitPrice, meta.sellValue);
    if (nowMs - slot.listedAt >= waitMs) {
      const buyer = ROADSIDE_BUYERS[(slot.slotIndex + Math.floor(slot.listedAt / 1000)) % ROADSIDE_BUYERS.length];
      slot.soldAt = nowMs;
      slot.buyerName = buyer.name;
      slot.buyerEmoji = buyer.emoji;
      anySold = true;
      if (!silent) {
        sim.audio.playCoinChime?.();
        sim.onToast?.(
          `${buyer.emoji} ${buyer.name} vừa mua ${slot.qty} ${meta.name} ở Sạp Đầu Ngõ (+${slot.qty * slot.unitPrice} Sickle chờ nhận)!`,
          '🧺'
        );
      }
    }
  }
  if (anySold && !silent) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return anySold;
}

export function claimRoadsideStandSlot(
  sim: ParkSimulation,
  slotIndex: number
): { ok: boolean; msg: string; earnedSickle: number } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để thu tiền Sạp Đầu Ngõ!', earnedSickle: 0 };
  }
  const stand = ensureRoadsideStand(sim.state);
  const slot = stand.slots[slotIndex];
  if (!slot || !slot.itemId || !slot.soldAt) {
    return { ok: false, msg: 'Lô hàng này chưa bán xong!', earnedSickle: 0 };
  }
  const meta = getFarmItemMeta(slot.itemId);
  const earned = slot.qty * slot.unitPrice;
  const xp = Math.max(4, slot.qty * 3);

  slot.itemId = null;
  slot.qty = 0;
  slot.unitPrice = 0;
  slot.listedAt = 0;
  slot.soldAt = undefined;
  slot.buyerName = undefined;
  slot.buyerEmoji = undefined;

  stand.totalRevenueClaimed = (stand.totalRevenueClaimed ?? 0) + earned;
  sim.state.galleons += earned;
  sim.state.finance.shopRevenue += earned;
  sim.addXp(xp);
  sim.addHarvestFeastPoints(6);
  sim.recordQuestProgress('harvest_galleons', undefined, earned);
  sim.audio.playCoinChime?.();
  sim.audio.playHarvestBubble();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🪙 Đã thu +${earned} Sickle & +${xp} ⭐ từ lô ${meta.emoji} ${meta.name} tại Sạp Đầu Ngõ!`,
    earnedSickle: earned,
  };
}

export function getNeighborRoadsideOffer(
  neighbor: NeighborProfileState,
  dayKey = getVietnamCalendarKey()
): { itemId: FarmItemId; qty: number; totalSickle: number } {
  let hash = 2166136261;
  const key = `${neighbor.id}:${dayKey}`;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  const cropKeys = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
    (cid) => FARM_CROPS[cid].unlockLevel <= Math.max(4, neighbor.level) && !cid.startsWith('yule_')
  );
  const pool: FarmItemId[] = cropKeys.length > 0 ? cropKeys : ['ottery_wheat', 'honey_carrot'];
  const itemId = pool[hash % pool.length];
  const qty = 2 + (hash % 2);
  const meta = getFarmItemMeta(itemId);
  const totalSickle = Math.max(4, Math.round(meta.sellValue * qty * 0.8));
  return { itemId, qty, totalSickle };
}

export function buyVisitedNeighborRoadsideOffer(
  sim: ParkSimulation
): { ok: boolean; msg: string } {
  const nb = sim.getActiveVisitingNeighbor();
  if (!nb) {
    return { ok: false, msg: 'Bạn cần đang ghé thăm vườn bạn bè để mua hàng Sạp Đầu Ngõ!' };
  }
  const homeState = sim.homeStateWhileVisiting ?? sim.state;
  const stand = ensureRoadsideStand(homeState);
  if (stand.dailyFriendBoughtIds?.includes(nb.id)) {
    return { ok: false, msg: `Hôm nay bạn đã mua lô hàng ưu đãi tại sạp của ${nb.name} rồi!` };
  }
  const offer = getNeighborRoadsideOffer(nb);
  const meta = getFarmItemMeta(offer.itemId);
  if (!homeState.sandboxMode && homeState.galleons < offer.totalSickle) {
    return { ok: false, msg: `Cần ${offer.totalSickle} Sickle để mua ${offer.qty} ${meta.name}!` };
  }
  const added = sim.addFarmItemToBarn(offer.itemId, offer.qty);
  if (added <= 0) {
    return { ok: false, msg: 'Kho Nông Sản Đỏ ở nhà đã đầy — hãy dọn kho trước khi mua nhé!' };
  }
  const actualCost = Math.max(1, Math.round((offer.totalSickle * added) / offer.qty));
  if (!homeState.sandboxMode) {
    sim.state.galleons = Math.max(0, sim.state.galleons - actualCost);
    homeState.galleons = sim.state.galleons;
  }
  stand.dailyFriendBoughtIds = [...(stand.dailyFriendBoughtIds ?? []), nb.id];
  sim.audio.playCoinChime?.();
  sim.onToast?.(
    `🧺 Đã mua ${added} ${meta.emoji} ${meta.name} giá hời từ sạp của ${nb.name} (−${actualCost} Sickle)!`,
    '🧺'
  );
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `Đã mua ${added} ${meta.name} từ sạp của ${nb.name}!`,
  };
}

// ============================================================================
// PHỤ TÁ GIA TINH TRANG TRẠI (FARM HELPER BUFF)
// ============================================================================

export function isFarmHelperActive(state: GameState, nowMs = Date.now()): boolean {
  return Boolean(state.farmBarn?.farmHelperEndsAt && state.farmBarn.farmHelperEndsAt > nowMs);
}

export function activateFarmHelper(
  sim: ParkSimulation,
  mode: 'free_daily' | 'feast_points' | 'sickle',
  nowMs = Date.now()
): { ok: boolean; msg: string; endsAt: number } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Hãy về trang trại nhà để mời Phụ Tá Gia Tinh!', endsAt: 0 };
  }
  const barn = sim.ensureFarmBarn();
  const today = getVietnamCalendarKey();
  let durationMs = 2 * 3600_000;

  if (mode === 'free_daily') {
    if (barn.farmHelperFreeDayKey === today && !sim.state.sandboxMode) {
      return {
        ok: false,
        msg: 'Hôm nay bạn đã nhận 30 phút Phụ Tá Gia Tinh miễn phí rồi — hẹn ngày mai nhé!',
        endsAt: barn.farmHelperEndsAt ?? 0,
      };
    }
    barn.farmHelperFreeDayKey = today;
    durationMs = 30 * 60_000;
  } else if (mode === 'feast_points') {
    const feast = sim.ensureHarvestFeast();
    if (!sim.state.sandboxMode && feast.points < 20) {
      return {
        ok: false,
        msg: 'Cần ít nhất 20 🍁 điểm Đại Tiệc Mùa Gặt để mời Phụ Tá Gia Tinh 2 giờ!',
        endsAt: barn.farmHelperEndsAt ?? 0,
      };
    }
    if (!sim.state.sandboxMode) {
      feast.points = Math.max(0, feast.points - 20);
    }
  } else {
    const cost = 120;
    if (!sim.state.sandboxMode && sim.state.galleons < cost) {
      return {
        ok: false,
        msg: `Cần ${cost} Sickle để mời Phụ Tá Gia Tinh trông coi ruộng xưởng trong 2 giờ!`,
        endsAt: barn.farmHelperEndsAt ?? 0,
      };
    }
    if (!sim.state.sandboxMode) {
      sim.state.galleons -= cost;
      sim.state.finance.staffWagesPaid += cost;
    }
  }

  const baseStart = Math.max(nowMs, barn.farmHelperEndsAt ?? 0);
  barn.farmHelperEndsAt = baseStart + durationMs;
  tickFarmHelperAutoTend(sim, nowMs, true);
  sim.audio.playSpell();
  sim.saveToStorage();
  sim.onUiChange?.();
  const mins = Math.round((barn.farmHelperEndsAt - nowMs) / 60_000);
  return {
    ok: true,
    msg: `🧙 Phụ Tá Gia Tinh đã nhận việc (còn ${mins} phút): tự động tưới luống mới & gom hàng xưởng vào Kho Đỏ!`,
    endsAt: barn.farmHelperEndsAt,
  };
}

export function tickFarmHelperAutoTend(
  sim: ParkSimulation,
  nowMs = Date.now(),
  silent = true
): { wateredPlots: number; collectedGoods: number } {
  if (sim.isVisitingNeighbor || !isFarmHelperActive(sim.state, nowMs)) {
    return { wateredPlots: 0, collectedGoods: 0 };
  }
  let wateredPlots = 0;
  let collectedGoods = 0;

  for (const b of sim.state.buildings) {
    if (nowMs < b.constructEndsAt) continue;
    const item = getCatalogItem(b.itemId);
    if (!item) continue;

    // 1. Auto-water active growing crops
    if (item.isFarmlandPlot && b.cropId && b.cropReadyAt && nowMs < b.cropReadyAt && !b.cropWateredBoost) {
      const savedMs = Math.max(3000, Math.round((b.cropReadyAt - nowMs) * 0.3));
      b.cropReadyAt = Math.max(nowMs + 1000, b.cropReadyAt - savedMs);
      b.cropWateredBoost = true;
      wateredPlots++;
    }

    // 2. Auto-collect finished workshop goods into Barn when space permits
    if (b.readyFarmGoods && b.readyFarmGoods.length > 0) {
      const left: typeof b.readyFarmGoods = [];
      for (const gid of b.readyFarmGoods) {
        const added = sim.addFarmItemToBarn(gid, 1);
        if (added > 0) {
          collectedGoods += added;
        } else {
          left.push(gid);
        }
      }
      if (left.length !== b.readyFarmGoods.length) {
        b.readyFarmGoods = left;
        if (left.length === 0 && b.storedSickle > 0) {
          sim.state.galleons += b.storedSickle;
          sim.state.finance.harvestRevenue += b.storedSickle;
          sim.addXp(b.storedXp);
          b.storedSickle = 0;
          b.storedXp = 0;
          b.readyBubbles = 0;
        }
      }
    }
  }

  if ((wateredPlots > 0 || collectedGoods > 0) && !silent) {
    sim.onUiChange?.();
  }
  return { wateredPlots, collectedGoods };
}

// ============================================================================
// SỰ KIỆN BẤT NGỜ NGOÀI ĐỒNG (FIELD MICRO-EVENTS 45s)
// ============================================================================

export function spawnFieldMicroEvent(
  sim: ParkSimulation,
  nowMs = Date.now(),
  forcedKind?: FieldMicroEventKind
): FieldMicroEvent | null {
  if (sim.isVisitingNeighbor) return null;
  const unlockedSet = new Set(sim.state.unlockedZones);
  const plots = sim.state.buildings.filter((b) => {
    const it = getCatalogItem(b.itemId);
    return Boolean(it && (it.isFarmlandPlot || it.isAnimalPasturePlot || it.id === 'burrow_flower_garden') && nowMs >= b.constructEndsAt);
  });

  let gx = 18.5;
  let gy = 24.5;
  if (plots.length > 0) {
    const pick = plots[Math.floor((nowMs / 1000) % plots.length)];
    gx = pick.gx + 1;
    gy = pick.gy + 1;
  } else {
    for (let y = 16; y <= 28; y++) {
      for (let x = 14; x <= 24; x++) {
        const c = sim.grid[y]?.[x];
        if (c && unlockedSet.has(c.zoneId) && c.terrain !== 'water' && !c.buildingUid) {
          gx = x + 0.5;
          gy = y + 0.5;
          break;
        }
      }
    }
  }

  const kinds: FieldMicroEventKind[] = ['honey_bees', 'cheeky_gnome', 'vip_owl'];
  const kind = forcedKind ?? kinds[Math.floor((nowMs / 1000) % kinds.length)];
  const metaMap: Record<FieldMicroEventKind, { labelVi: string; emoji: string }> = {
    honey_bees: { labelVi: 'Đàn Ong Mật Ghé Vườn', emoji: '🍯' },
    cheeky_gnome: { labelVi: 'Quỷ Lùn Lấp Ló', emoji: '🥔' },
    vip_owl: { labelVi: 'Cú Tốc Hành Thưởng Nóng', emoji: '🦉' },
  };
  const ev: FieldMicroEvent = {
    id: `fme_${nowMs}`,
    kind,
    gx,
    gy,
    spawnedAt: nowMs,
    expiresAt: nowMs + 45_000,
    labelVi: metaMap[kind].labelVi,
    emoji: metaMap[kind].emoji,
  };
  sim.fieldMicroEvent = ev;
  return ev;
}

export function claimFieldMicroEvent(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string; earnedSickle: number } {
  const ev = sim.fieldMicroEvent;
  if (!ev || nowMs > ev.expiresAt || sim.isVisitingNeighbor) {
    sim.fieldMicroEvent = null;
    return { ok: false, msg: 'Sự kiện ngoài đồng đã khép lại!', earnedSickle: 0 };
  }
  sim.fieldMicroEvent = null;
  sim.nextMicroEventAt = nowMs + 58_000;

  let sickle = 24;
  let extraNote = '';
  if (ev.kind === 'honey_bees') {
    sickle = 26;
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    extraNote = '+1 🌿 Phân Ủ';
  } else if (ev.kind === 'cheeky_gnome') {
    sickle = 30;
    const unlockedCrops = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
      (cid) => !cid.startsWith('yule_') && FARM_CROPS[cid].unlockLevel <= Math.max(1, sim.state.level)
    );
    const seedId = unlockedCrops[nowMs % Math.max(1, unlockedCrops.length)] ?? 'ottery_wheat';
    sim.addCropSeeds(seedId, 2);
    extraNote = `+2 hạt ${FARM_CROPS[seedId].name}`;
  } else {
    sickle = 34;
    sim.state.morningDewPhials = Math.min(99, (sim.state.morningDewPhials ?? 0) + 1);
    extraNote = '+1 🧪 Bình Sương Mai';
  }

  sim.state.galleons += sickle;
  sim.state.finance.harvestRevenue += sickle;
  sim.addXp(8);
  sim.addHarvestFeastPoints(6);
  sim.audio.playHarvestBubble();
  sim.onRewardFly?.('galleons', sickle, ev.gx, ev.gy);
  sim.spawnFloatingText(ev.gx, ev.gy, `${ev.emoji} +${sickle} Sickle · ${extraNote}`, '#fde047');
  const msg = `${ev.emoji} ${ev.labelVi}: Nhận +${sickle} Sickle, +8 ⭐ & ${extraNote}!`;
  sim.onToast?.(msg, ev.emoji);
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg, earnedSickle: sickle };
}
