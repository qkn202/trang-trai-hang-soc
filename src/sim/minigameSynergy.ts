import { FARM_GOODS, formatDurationCompactVi, getCatalogItem, getFarmItemMeta } from '../data/catalog';
import type { FarmItemId, GameState, LeaderboardGameId, MinigameTrialKind } from '../types/game';
import type { ParkSimulation } from './simulation';

export interface MinigameFarmSpecialtyDef {
  id: LeaderboardGameId;
  icon: string;
  shortTagVi: string;
  fullDescVi: string;
}

export interface MinigameFarmSpecialtyOutcome {
  gameId: LeaderboardGameId;
  badgeLabelVi: string;
  detailToastVi: string;
  compostAdded?: number;
  morningDewAdded?: number;
  workshopShavedSec?: number;
  workshopsAccelerated?: number;
  flourFallbackAdded?: number;
  extraSickleBonus?: number;
  pastureGourmetCount?: number;
  bondXpAdded?: number;
  pastureSpeedupCount?: number;
  valleyAuraPct?: number;
  plotsWateredCount?: number;
}

/**
 * Bản đồ chuyên biệt hoá 7 Minigame -> Nông Trại (Bước B).
 * Không đẻ thêm tiền tệ mới: mọi môn nuôi trực tiếp một trụ cột khác nhau của Điền Trang.
 */
export const MINIGAME_FARM_SPECIALTIES: Record<LeaderboardGameId, MinigameFarmSpecialtyDef> = {
  match3: {
    id: 'match3',
    icon: '🔥',
    shortTagVi: 'Ủ xưởng −25%',
    fullDescVi:
      'Thắng Bùa Gặt rút −25% (ít nhất −5p) mẻ đang nướng ở mọi Xưởng Chế Biến, hoặc tặng +1 Bột Mì vào Kho Đỏ.',
  },
  caro: {
    id: 'caro',
    icon: '🌿',
    shortTagVi: '+1 Phân Ủ · Xây ×1.5',
    fullDescVi:
      'Thắng Dò Mìn rơi +1 Phân Ủ Thảo Dược (+2 màn Trùm/Đề Cử) nâng Bậc Đất I–V và rút giờ xây công trình mạnh ×1.5.',
  },
  sudoku: {
    id: 'sudoku',
    icon: '🧪',
    shortTagVi: '+1 Sương Mai',
    fullDescVi:
      'Thắng Số Học rơi +1 Bình Sương Mai (−15p đích danh ruộng/xưởng/công trình) kèm cơ hội nhặt Thẻ Phù Thủy.',
  },
  chess: {
    id: 'chess',
    icon: '🪙',
    shortTagVi: '+35% Sickle · Đồng cỏ ×2',
    fullDescVi:
      'Thắng Bắn Cá thưởng +35% Sickle dồi dào và kích hoạt Khẩu Phần Thượng Hạng (×2 sản lượng) cho 1 Đồng Cỏ đang nuôi.',
  },
  blocks: {
    id: 'blocks',
    icon: '🦄',
    shortTagVi: '+25 Thân mật thú',
    fullDescVi:
      'Thắng Sinh Vật cộng +25 Thân mật cho Thú Phép trong Vali Newt và đẩy nhanh −25% một Đồng Cỏ đang nuôi.',
  },
  jigsaw: {
    id: 'jigsaw',
    icon: '🖼️',
    shortTagVi: 'Hào quang vườn (tới +25%)',
    fullDescVi:
      'Hoàn thành Tranh Ghép tăng vĩnh viễn Hào Quang Điền Trang (+2%/tranh phục chế & +1% mỗi 5 màn, tối đa +25% sản lượng toàn bản đồ).',
  },
  seedquiz: {
    id: 'seedquiz',
    icon: '🌱',
    shortTagVi: 'Hạt 0 Sickle · Mưa toàn vườn',
    fullDescVi:
      'Đố Ngoại Ngữ tặng Hạt Giống 0 Sickle; mỗi chuỗi 5 câu đúng tự niệm Aguamenti tưới toàn bộ ruộng đang trồng (−30% giờ chín).',
  },
};

export function getMinigameFarmSpecialty(gameId: LeaderboardGameId): MinigameFarmSpecialtyDef {
  return MINIGAME_FARM_SPECIALTIES[gameId] ?? MINIGAME_FARM_SPECIALTIES.match3;
}

/**
 * Hào Quang Điền Trang vĩnh viễn từ Tranh Ghép Phép Thuật (0% .. 25%).
 * Giữ 0% khi người chơi chưa phục chế tranh nào và chưa vượt 5 màn để bảo toàn đường cong kinh tế gốc.
 */
export function getJigsawValleyAuraPct(state: GameState | undefined | null): number {
  if (!state?.puzzleArcade) return 0;
  const restoredCount = Array.isArray(state.puzzleArcade.restoredPaintings)
    ? state.puzzleArcade.restoredPaintings.length
    : 0;
  const cleared = Math.max(0, Math.floor(state.puzzleArcade.jigsawCleared ?? 0));
  return Math.max(0, Math.min(25, restoredCount * 2 + Math.floor(cleared / 5)));
}

export function getJigsawValleyAuraMultiplier(state: GameState | undefined | null): number {
  return 1 + getJigsawValleyAuraPct(state) * 0.01;
}

export function applyMinigameFarmSpecialtyReward(
  sim: ParkSimulation,
  gameId: Exclude<LeaderboardGameId, 'seedquiz'>,
  opts: {
    isFirstClear: boolean;
    isBossOrFeatured?: boolean;
    extraSickleBonus?: number;
    now?: number;
  }
): MinigameFarmSpecialtyOutcome {
  const now = opts.now ?? Date.now();

  if (gameId === 'match3') {
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
      const label = formatDurationCompactVi(maxShavedSec);
      return {
        gameId: 'match3',
        badgeLabelVi: `🔥 Ủ xưởng −${label}`,
        detailToastVi: `🔥 Tinh Đường Bùa Gặt đẩy nhanh −${label} cho ${workshopsAccelerated} xưởng đang chế biến!`,
        workshopShavedSec: maxShavedSec,
        workshopsAccelerated,
      };
    }
    const addedFlour = sim.addFarmItemToBarn('fine_wheat_flour', 1);
    if (addedFlour > 0) {
      const flourMeta = FARM_GOODS.fine_wheat_flour;
      return {
        gameId: 'match3',
        badgeLabelVi: `${flourMeta.emoji} +1 Bột Mì`,
        detailToastVi: `${flourMeta.emoji} Quà Bùa Gặt: +1 ${flourMeta.name} vào Kho Đỏ sẵn sàng nướng bánh!`,
        flourFallbackAdded: addedFlour,
      };
    }
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    return {
      gameId: 'match3',
      badgeLabelVi: '🌿 +1 Phân Ủ',
      detailToastVi: '🌿 Kho Đỏ đang đầy — Quà Bùa Gặt quy đổi thành +1 Phân Ủ Thảo Dược!',
      compostAdded: 1,
    };
  }

  if (gameId === 'caro') {
    const compostAdded = opts.isBossOrFeatured ? 2 : 1;
    sim.state.herbalCompost = Math.min(
      99999,
      Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + compostAdded
    );
    return {
      gameId: 'caro',
      badgeLabelVi: `🌿 +${compostAdded} Phân Ủ`,
      detailToastVi: `🌿 Dò Mìn thu được +${compostAdded} Phân Ủ Thảo Dược & rút giờ xây mạnh ×1.5!`,
      compostAdded,
    };
  }

  if (gameId === 'sudoku') {
    const morningDewAdded = 1;
    sim.state.morningDewPhials = Math.min(
      99,
      Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + morningDewAdded
    );
    if (opts.isFirstClear && !sim.isVisitingNeighbor) {
      sim.tryDropWizardCard(24, 24, 0.25);
    }
    return {
      gameId: 'sudoku',
      badgeLabelVi: '🧪 +1 Sương Mai',
      detailToastVi: '🧪 Số Học kết tinh +1 Bình Sương Mai (−15p đích danh ruộng/xưởng)!',
      morningDewAdded,
    };
  }

  if (gameId === 'chess') {
    const extraSickleBonus = Math.max(0, Math.round(opts.extraSickleBonus ?? 0));
    const targetPasture = sim.state.buildings.find((b) => {
      if (now < b.constructEndsAt) return false;
      const it = getCatalogItem(b.itemId);
      return Boolean(
        it?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now < b.pastureReadyAt &&
          !b.pastureGourmetBoost
      );
    });
    if (targetPasture) {
      targetPasture.pastureGourmetBoost = true;
      return {
        gameId: 'chess',
        badgeLabelVi: '🐾 Đồng cỏ ×2',
        detailToastVi: `🐾 Dưỡng chất Hồ Đen (+${extraSickleBonus} Sickle thưởng) kích hoạt Đồng Cỏ ×2 sản lượng vụ kế!`,
        extraSickleBonus,
        pastureGourmetCount: 1,
      };
    }
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    return {
      gameId: 'chess',
      badgeLabelVi: '🌿 +1 Phân Ủ',
      detailToastVi: `🪙 Bắn Cá Hồ Đen thưởng +${extraSickleBonus} Sickle dồi dào & +1 Phân Ủ Thảo Dược!`,
      extraSickleBonus,
      compostAdded: 1,
    };
  }

  if (gameId === 'blocks') {
    const bondXpAdded = sim.boostLowestBondCreature(25);

    let pastureSpeedupCount = 0;
    const growingPasture = sim.state.buildings.find((b) => {
      if (now < b.constructEndsAt) return false;
      const it = getCatalogItem(b.itemId);
      return Boolean(it?.isAnimalPasturePlot && b.pastureAnimalId && b.pastureReadyAt && now < b.pastureReadyAt);
    });
    if (growingPasture && growingPasture.pastureReadyAt) {
      const leftMs = growingPasture.pastureReadyAt - now;
      const shaveMs = Math.min(leftMs, Math.max(2 * 60 * 1000, Math.round(leftMs * 0.25)));
      growingPasture.pastureReadyAt = Math.max(now + 1000, growingPasture.pastureReadyAt - shaveMs);
      pastureSpeedupCount = 1;
    }

    if (bondXpAdded > 0) {
      return {
        gameId: 'blocks',
        badgeLabelVi: `🦄 +${bondXpAdded} Thân mật`,
        detailToastVi: `🦄 Sinh Vật Huyền Bí tăng +${bondXpAdded} Thân mật cho Thú Phép trong Vali Newt${pastureSpeedupCount ? ' & rút −25% giờ Đồng Cỏ' : ''}!`,
        bondXpAdded,
        pastureSpeedupCount,
      };
    }
    if (pastureSpeedupCount > 0) {
      return {
        gameId: 'blocks',
        badgeLabelVi: '🐾 Đồng cỏ −25%',
        detailToastVi: '🐾 Sinh Vật Huyền Bí đẩy nhanh −25% giờ thu hoạch Đồng Cỏ Chăn Thả!',
        pastureSpeedupCount,
      };
    }
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    return {
      gameId: 'blocks',
      badgeLabelVi: '🌿 +1 Phân Ủ',
      detailToastVi: '🌿 Sinh Vật Huyền Bí tặng +1 Phân Ủ Thảo Dược chuẩn bị mở chuồng thú!',
      compostAdded: 1,
    };
  }

  // jigsaw
  const valleyAuraPct = getJigsawValleyAuraPct(sim.state);
  return {
    gameId: 'jigsaw',
    badgeLabelVi: valleyAuraPct > 0 ? `🖼️ Hào quang +${valleyAuraPct}%` : '🖼️ Mốc tranh +1',
    detailToastVi:
      valleyAuraPct > 0
        ? `🖼️ Hào Quang Điền Trang đang tăng +${valleyAuraPct}% thu hoạch toàn thung lũng!`
        : '🖼️ Đã tích luỹ tiến độ Tranh Ghép cho Hào Quang Điền Trang!',
    valleyAuraPct,
  };
}

/**
 * Đặc quyền Học Viện Ngoại Ngữ: mỗi chuỗi 5 câu đúng liên tiếp tự niệm Aguamenti tưới toàn bộ ruộng đang mọc (-30% giờ chín).
 * Nếu không có ruộng nào cần tưới thì tặng +1 Bình Sương Mai để không bao giờ lãng phí chuỗi học tập.
 */
export function applySeedQuizStreakRainReward(
  sim: ParkSimulation,
  streakCount: number,
  now = Date.now()
): MinigameFarmSpecialtyOutcome | undefined {
  if (streakCount <= 0 || streakCount % 5 !== 0) return undefined;
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
    return {
      gameId: 'seedquiz',
      badgeLabelVi: `💧 Aguamenti ${watered} ruộng`,
      detailToastVi: `💧 Chuỗi ${streakCount} câu đúng: Niệm Aguamenti tưới nhanh −30% cho cả ${watered} luống ruộng!`,
      plotsWateredCount: watered,
    };
  }
  sim.state.morningDewPhials = Math.min(99, Math.max(0, Math.floor(sim.state.morningDewPhials ?? 0)) + 1);
  return {
    gameId: 'seedquiz',
    badgeLabelVi: '🧪 +1 Sương Mai',
    detailToastVi: `🧪 Chuỗi ${streakCount} câu đúng: Tặng +1 Bình Sương Mai (−15p có chọn lọc)!`,
    morningDewAdded: 1,
  };
}

// ============================================================================
// BƯỚC C: HỘP TIẾP TẾ BÀ MOLLY (NÔNG TRẠI -> MINIGAME) & EARLY MATCH-3 DDA
// ============================================================================

export interface MollySupplyOption {
  itemId: FarmItemId;
  qty: number;
  isSignature: boolean;
  shortLabelVi: string;
}

export interface ResolvedMollySupplyKit {
  mode: MinigameTrialKind;
  ready: boolean;
  itemId: FarmItemId;
  qtyNeeded: number;
  haveQty: number;
  isSignature: boolean;
  shortLabelVi: string;
  itemNameVi: string;
  itemEmoji: string;
  effectSummaryVi: string;
  tooltipVi: string;
}

export const MOLLY_SUPPLY_KIT_RECIPES: Record<MinigameTrialKind, ReadonlyArray<MollySupplyOption>> = {
  match3: [
    { itemId: 'pumpkin_pie', qty: 1, isSignature: true, shortLabelVi: 'Bánh Bí Ngô' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
  caro: [
    { itemId: 'frothy_butterbeer', qty: 1, isSignature: true, shortLabelVi: 'Bia Bơ' },
    { itemId: 'honey_carrot', qty: 2, isSignature: true, shortLabelVi: '2 Cà Rốt' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
  sudoku: [
    { itemId: 'cream_mushroom_soup', qty: 1, isSignature: true, shortLabelVi: 'Súp Nấm' },
    { itemId: 'floral_bouquet_gift', qty: 1, isSignature: true, shortLabelVi: 'Bó Hoa' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
  chess: [
    { itemId: 'golden_corn', qty: 2, isSignature: true, shortLabelVi: '2 Bắp Ngọt' },
    { itemId: 'honey_apple_cider', qty: 1, isSignature: true, shortLabelVi: 'Rượu Táo' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
  blocks: [
    { itemId: 'creamy_dairy_milk', qty: 1, isSignature: true, shortLabelVi: 'Sữa Bò' },
    { itemId: 'farm_egg_wool', qty: 1, isSignature: true, shortLabelVi: 'Trứng Gà' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
  jigsaw: [
    { itemId: 'weasley_sweater_w', qty: 1, isSignature: true, shortLabelVi: 'Áo Len W' },
    { itemId: 'english_rose', qty: 2, isSignature: true, shortLabelVi: '2 Hoa Hồng' },
    { itemId: 'cinnamon_apple_pie', qty: 1, isSignature: false, shortLabelVi: 'Bánh Táo' },
  ],
};

function getMollyEffectSummary(mode: MinigameTrialKind, isSignature: boolean): string {
  switch (mode) {
    case 'match3':
      return isSignature
        ? '+4 lượt đi & lùi ngòi Bom (đặc sản Bí Ngô!)'
        : '+3 lượt đi & lùi ngòi Bom';
    case 'caro':
      return isSignature
        ? '+2 Khiên bảo vệ & +1 Dò An Toàn'
        : '+1 Khiên bảo vệ & +1 Dò An Toàn';
    case 'sudoku':
      return isSignature
        ? 'Xoá 1 lỗi, +2 Gợi Ý & bật Kính Soi Trùng Ô'
        : 'Xoá 1 lỗi, +1 Gợi Ý & bật Kính Soi Trùng Ô';
    case 'chess':
      return isSignature
        ? '+25s giờ, +35 Đạn Ngọc & +1 Băng Phong'
        : '+25s giờ, +20 Đạn Ngọc & +1 Băng Phong';
    case 'blocks':
      return isSignature
        ? '+35s giờ, +2 Đổi Bàn & +2 Dò Cặp'
        : '+35s giờ, +2 Đổi Bàn & +1 Dò Cặp';
    case 'jigsaw':
      return isSignature
        ? 'Thêm giờ, tự khớp mảnh & +2 Gợi Ý'
        : 'Thêm giờ, tự khớp mảnh & +1 Gợi Ý';
  }
}

/**
 * Chọn tự động món Tiếp Tế Bà Molly tốt nhất đang có sẵn trong Kho Đỏ cho môn chơi hiện tại.
 * Ưu tiên đặc sản riêng của môn đó (hiệu quả mạnh hơn), sau đó tới Bánh Táo Quế đa năng.
 */
export function resolveMollySupplyForMinigame(
  sim: ParkSimulation,
  mode: MinigameTrialKind
): ResolvedMollySupplyKit {
  const options = MOLLY_SUPPLY_KIT_RECIPES[mode] ?? MOLLY_SUPPLY_KIT_RECIPES.match3;
  const acceptedNames = options
    .map((o) => (o.qty > 1 ? `${o.qty} ${getFarmItemMeta(o.itemId).name}` : getFarmItemMeta(o.itemId).name))
    .join(' / ');

  if (sim.state.sandboxMode) {
    const top = options[0];
    const meta = getFarmItemMeta(top.itemId);
    const effect = getMollyEffectSummary(mode, top.isSignature);
    return {
      mode,
      ready: true,
      itemId: top.itemId,
      qtyNeeded: top.qty,
      haveQty: 99,
      isSignature: top.isSignature,
      shortLabelVi: top.shortLabelVi,
      itemNameVi: meta.name,
      itemEmoji: meta.emoji,
      effectSummaryVi: effect,
      tooltipVi: `Hộp Tiếp Tế Bà Molly (${acceptedNames}) → ${effect}`,
    };
  }

  for (const opt of options) {
    const have = sim.getFarmItemCount(opt.itemId);
    if (have >= opt.qty) {
      const meta = getFarmItemMeta(opt.itemId);
      const effect = getMollyEffectSummary(mode, opt.isSignature);
      return {
        mode,
        ready: true,
        itemId: opt.itemId,
        qtyNeeded: opt.qty,
        haveQty: have,
        isSignature: opt.isSignature,
        shortLabelVi: opt.shortLabelVi,
        itemNameVi: meta.name,
        itemEmoji: meta.emoji,
        effectSummaryVi: effect,
        tooltipVi: `Dùng ${opt.qty > 1 ? `${opt.qty} ` : '1 '}${meta.name} từ Kho Đỏ → ${effect} (Chấp nhận: ${acceptedNames})`,
      };
    }
  }

  const fallback = options[options.length - 1];
  const meta = getFarmItemMeta(fallback.itemId);
  const effect = getMollyEffectSummary(mode, false);
  return {
    mode,
    ready: false,
    itemId: fallback.itemId,
    qtyNeeded: fallback.qty,
    haveQty: sim.getFarmItemCount(fallback.itemId),
    isSignature: false,
    shortLabelVi: fallback.shortLabelVi,
    itemNameVi: meta.name,
    itemEmoji: meta.emoji,
    effectSummaryVi: effect,
    tooltipVi: `Hộp Tiếp Tế Bà Molly: cần ${acceptedNames} trong Kho Đỏ → ${effect}`,
  };
}

/**
 * DDA cứu thua dịu cho Match-3: nếu người chơi thua liên tiếp >= 3 lần cùng 1 màn,
 * Bà Molly tặng thêm lượt đi để tránh rớt nhịp ở các màn khó (0 lượt thêm ở 2 lượt đầu).
 */
export function computeMatch3DdaBonusMoves(
  levelId: number,
  consecutiveLossesOnStage: number
): number {
  const losses = Math.max(0, Math.floor(consecutiveLossesOnStage));
  if (losses < 3) return 0;
  const earlyBonus = levelId <= 10 ? 4 : 3;
  const extraSteps = Math.min(2, Math.floor((losses - 3) / 2));
  return Math.min(5, earlyBonus + extraSteps);
}

