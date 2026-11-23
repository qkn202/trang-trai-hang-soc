import { FARM_CROPS, FARM_GOODS, getCatalogItem, getFarmItemMeta, PASTURE_ANIMALS } from '../data/catalog';
import { WIZARD_CARDS } from '../data/cards';
import { CRAFT_RECIPES } from '../data/synergiesAndSupply';
import { getLocalCalendarResetKey as getLocalDateKey } from './neighborSocial';
import { ensureRetentionState } from './retentionAndNarrative';
import { VILLAGER_AFFECTION_GIFT_META } from './villagerGiftsPetAndStroll';
import type { ParkSimulation } from './simulation';
import type {
  AlmanacChapterId,
  CollectionAlmanacState,
  CoopSupplyCrateState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FestivalType,
  GameState,
  HomeVisitorMysteryGift,
  PostcardFrameThemeId,
  SeasonalFestivalProgressState,
  ValleyVillagerId,
} from '../types/game';

export interface CoopCrateMilestoneDef {
  step: 1 | 2 | 3;
  target: number;
  labelVi: string;
  rewardSickle: number;
  rewardTokens: number;
  rewardCompost?: number;
  rewardSand?: number;
  rewardStars?: number;
}

export const COOP_CRATE_MILESTONES: readonly CoopCrateMilestoneDef[] = [
  {
    step: 1,
    target: 120,
    labelVi: 'Mốc 1 · Kiện Nông Sản Sơ Cấp',
    rewardSickle: 85,
    rewardTokens: 2,
    rewardCompost: 2,
  },
  {
    step: 2,
    target: 280,
    labelVi: 'Mốc 2 · Kiện Đặc Sản Thung Lũng',
    rewardSickle: 145,
    rewardTokens: 3,
    rewardSand: 2,
  },
  {
    step: 3,
    target: 500,
    labelVi: 'Mốc 3 · Đại Kiện Hàng Cộng Đồng',
    rewardSickle: 190,
    rewardTokens: 4,
    rewardStars: 1,
  },
];

export const MAX_DAILY_COOP_CONTRIBUTIONS = 12;
export const MAX_DAILY_VISITOR_MYSTERY_SENT = 5;

export const POSTCARD_FRAME_THEME_META: Record<
  PostcardFrameThemeId,
  { id: PostcardFrameThemeId; labelVi: string; badgeVi: string }
> = {
  classic_burrow: {
    id: 'classic_burrow',
    labelVi: 'Gỗ Sồi Hang Sóc',
    badgeVi: '🏡 Cổ điển ấm áp',
  },
  starry_hogwarts: {
    id: 'starry_hogwarts',
    labelVi: 'Đêm Sao Hogwarts',
    badgeVi: '🌙 Bầu trời sao bạc',
  },
  festive_lantern: {
    id: 'festive_lantern',
    labelVi: 'Đèn Lồng Lễ Hội',
    badgeVi: '🏮 Sắc đỏ mùa lễ',
  },
};

export interface SeasonalFestivalTaskDef {
  id: string;
  titleVi: string;
  descVi: string;
  target: number;
  rewardSickle: number;
  rewardCompost?: number;
  rewardMorningDew?: number;
  rewardSand?: number;
  rewardTokens?: number;
  rewardStars?: number;
}

export interface SeasonalFestivalDef {
  festival: Exclude<FestivalType, 'none' | 'quidditch_cup'>;
  titleVi: string;
  kickerVi: string;
  buffSummaryVi: string;
  icon: string;
  hasDailyLiXi?: boolean;
  tasks: readonly SeasonalFestivalTaskDef[];
}

export const SEASONAL_FESTIVAL_DEFS: Record<
  Exclude<FestivalType, 'none' | 'quidditch_cup'>,
  SeasonalFestivalDef
> = {
  lunar_tet: {
    festival: 'lunar_tet',
    titleVi: 'Tết Nguyên Đán Hang Sóc',
    kickerVi: '🏮 Xuân Đoàn Viên · Lộc Đầu Năm',
    buffSummaryVi: '+25% Sickle thu hoạch & Phong Bao Lì Xì mỗi ngày',
    icon: '🏮',
    hasDailyLiXi: true,
    tasks: [
      {
        id: 'tet_harvest_12',
        titleVi: 'Mùa Xuân Bội Thu',
        descVi: 'Thu hoạch tích lũy 12 vụ mùa nông sản trên ruộng',
        target: 12,
        rewardSickle: 85,
        rewardCompost: 2,
      },
      {
        id: 'tet_orders_3',
        titleVi: 'Chuyến Cú Đưa Thư Tết',
        descVi: 'Hoàn thành 3 Đơn Cú hoặc Chuyến Tàu Tốc Hành',
        target: 3,
        rewardSickle: 115,
        rewardSand: 1,
      },
      {
        id: 'tet_social_2',
        titleVi: 'Chúc Tết Xóm Giềng',
        descVi: 'Giúp đỡ vườn bạn bè hoặc tặng quà cư dân 2 lần',
        target: 2,
        rewardSickle: 145,
        rewardStars: 1,
      },
    ],
  },
  mid_autumn: {
    festival: 'mid_autumn',
    titleVi: 'Tết Trung Thu Đêm Trăng',
    kickerVi: '🥮 Trăng Rằm Thung Lũng · Phá Cỗ Đèn Lồng',
    buffSummaryVi: '+30% XP thu hoạch & chế biến bánh nướng mùa trăng',
    icon: '🥮',
    tasks: [
      {
        id: 'mid_goods_2',
        titleVi: 'Mâm Cỗ Bánh Trăng',
        descVi: 'Có ít nhất 2 món bánh hoặc đặc sản trong Kho Đỏ',
        target: 2,
        rewardSickle: 90,
        rewardMorningDew: 2,
      },
      {
        id: 'mid_quiz_5',
        titleVi: 'Đố Vui Đèn Lồng',
        descVi: 'Trả lời đúng tích lũy 5 câu tại Học Viện Thần Chú',
        target: 5,
        rewardSickle: 105,
        rewardCompost: 2,
      },
      {
        id: 'mid_stars_2',
        titleVi: 'Phố Đèn Rực Sáng',
        descVi: 'Sở hữu ít nhất 2 công trình đạt từ 2★ trở lên',
        target: 2,
        rewardSickle: 140,
        rewardStars: 1,
      },
    ],
  },
  halloween: {
    festival: 'halloween',
    titleVi: 'Đêm Hội Bí Ngô Halloween',
    kickerVi: '🎃 Đèn Bí Ma Thuật · +35% XP Toàn Vườn',
    buffSummaryVi: '+35% XP thu hoạch & khám phá kẹo phép Honeydukes',
    icon: '🎃',
    tasks: [
      {
        id: 'hal_pumpkin_4',
        titleVi: 'Vườn Bí Đêm Hội',
        descVi: 'Thu hoạch hoặc trữ 4 Bí Ngô Vườn / Nấm Phát Sáng',
        target: 4,
        rewardSickle: 85,
        rewardCompost: 2,
      },
      {
        id: 'hal_minigame_2',
        titleVi: 'Khảo Thí Đêm Ma Thuật',
        descVi: 'Chiến thắng tích lũy 2 màn Khảo Thí Pháp Thuật',
        target: 2,
        rewardSickle: 115,
        rewardSand: 1,
      },
      {
        id: 'hal_creatures_3',
        titleVi: 'Chăm Thú Đêm Trăng Khuyết',
        descVi: 'Chăm sóc sinh vật huyền bí 3 lần',
        target: 3,
        rewardSickle: 135,
        rewardStars: 1,
      },
    ],
  },
  christmas: {
    festival: 'christmas',
    titleVi: 'Lễ Hội Đông Chí Giáng Sinh',
    kickerVi: '🎄 Tuyết Ấm Hang Sóc · +25% Sickle',
    buffSummaryVi: '+25% Sickle thu hoạch & quầy quà mùa đông ấm áp',
    icon: '🎄',
    tasks: [
      {
        id: 'xmas_harvest_15',
        titleVi: 'Kho Lương Mùa Tuyết',
        descVi: 'Thu hoạch tích lũy 15 vụ mùa nông trại',
        target: 15,
        rewardSickle: 95,
        rewardMorningDew: 2,
      },
      {
        id: 'xmas_artisan_3',
        titleVi: 'Bếp Lửa Bà Molly',
        descVi: 'Chế biến hoặc trữ 3 món đặc sản ấm nóng trong Kho Đỏ',
        target: 3,
        rewardSickle: 120,
        rewardTokens: 2,
      },
      {
        id: 'xmas_upgrade_3',
        titleVi: 'Trang Hoàng Thung Lũng',
        descVi: 'Nâng sao kiến trúc công trình tích lũy 3 lần',
        target: 3,
        rewardSickle: 150,
        rewardStars: 1,
      },
    ],
  },
};

export interface AlmanacChapterSummary {
  id: AlmanacChapterId;
  titleVi: string;
  subtitleVi: string;
  icon: string;
  discoveredCount: number;
  totalCount: number;
  milestoneTarget: number;
  claimed: boolean;
  canClaim: boolean;
  rewardLabelVi: string;
  sampleEntries: Array<{ nameVi: string; icon: string; unlocked: boolean }>;
}

export function computeIsoWeekKey(nowMs = Date.now()): string {
  const d = new Date(nowMs);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
  const week = Math.max(1, Math.ceil(dayOfYear / 7));
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function ensureCoopSupplyCrate(state: GameState, nowMs = Date.now()): CoopSupplyCrateState {
  const social = state.neighborSocial;
  const weekKey = computeIsoWeekKey(nowMs);
  const todayKey = getLocalDateKey(nowMs);
  const friendSeedPts = Math.min(90, Math.max(24, (social?.neighbors?.length ?? 3) * 14));
  if (!social) {
    return {
      weekKey,
      contributedPoints: friendSeedPts,
      playerContributedToday: 0,
      lastContributeDayKey: todayKey,
      claimedMilestones: [],
    };
  }
  if (!social.coopSupplyCrate || social.coopSupplyCrate.weekKey !== weekKey) {
    social.coopSupplyCrate = {
      weekKey,
      contributedPoints: friendSeedPts,
      playerContributedToday: 0,
      lastContributeDayKey: todayKey,
      claimedMilestones: [],
    };
  } else if (social.coopSupplyCrate.lastContributeDayKey !== todayKey) {
    social.coopSupplyCrate.playerContributedToday = 0;
    social.coopSupplyCrate.lastContributeDayKey = todayKey;
  }
  return social.coopSupplyCrate;
}

export function contributeToCoopSupplyCrate(
  sim: ParkSimulation,
  itemId: FarmItemId,
  qty = 2
): { ok: boolean; msg: string; addedPoints: number } {
  if (sim.isHeadmasterPreview || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Hãy về vườn nhà để góp nông sản vào Kiện Hàng Tương Trợ!', addedPoints: 0 };
  }
  const targetState = sim.homeStateWhileVisiting ?? sim.state;
  const social = sim.ensureNeighborSocial();
  const crate = ensureCoopSupplyCrate(targetState);
  if (!targetState.sandboxMode && crate.playerContributedToday >= MAX_DAILY_COOP_CONTRIBUTIONS) {
    return {
      ok: false,
      msg: `Hôm nay bạn đã góp đủ ${MAX_DAILY_COOP_CONTRIBUTIONS} lượt vào Kiện Hàng Tương Trợ — mai góp tiếp nhé!`,
      addedPoints: 0,
    };
  }
  const cleanQty = Math.max(1, Math.min(10, Math.floor(qty)));
  const have = sim.getFarmItemCount(itemId);
  if (!targetState.sandboxMode && have < cleanQty) {
    const meta = getFarmItemMeta(itemId);
    return {
      ok: false,
      msg: `Kho Đỏ cần ít nhất ${cleanQty} ${meta.name} để đóng góp (hiện có ${have})!`,
      addedPoints: 0,
    };
  }
  if (!targetState.sandboxMode) {
    sim.consumeFarmItemFromBarn(itemId, cleanQty);
  }
  const meta = getFarmItemMeta(itemId);
  const unitPts = Math.max(10, Math.min(45, Math.round(meta.sellValue * 0.65)));
  const friendEchoPts = 8;
  const addedPoints = unitPts * cleanQty + friendEchoPts;
  crate.contributedPoints += addedPoints;
  crate.playerContributedToday += 1;
  social.friendshipTokens += 1;
  if (sim.homeStateWhileVisiting && sim.state.neighborSocial) {
    sim.state.neighborSocial.friendshipTokens = social.friendshipTokens;
    sim.state.neighborSocial.coopSupplyCrate = crate;
  }
  sim.addXp(10);
  sim.addHarvestFeastPoints(8);
  sim.audio.playCoinChime();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `📦 Đã góp ${cleanQty} ${meta.name} vào Kiện Hàng Tương Trợ (+${addedPoints} điểm cộng đồng · +1 🍀)!`,
    addedPoints,
  };
}

export function claimCoopCrateMilestone(
  sim: ParkSimulation,
  step: 1 | 2 | 3
): { ok: boolean; msg: string } {
  if (sim.isHeadmasterPreview || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Đang ở chế độ xem thử — hãy về vườn nhà để nhận thưởng!' };
  }
  const targetState = sim.homeStateWhileVisiting ?? sim.state;
  const social = sim.ensureNeighborSocial();
  const crate = ensureCoopSupplyCrate(targetState);
  const def = COOP_CRATE_MILESTONES.find((m) => m.step === step);
  if (!def) return { ok: false, msg: 'Mốc Kiện Hàng không hợp lệ!' };
  if (crate.claimedMilestones.includes(step)) {
    return { ok: false, msg: 'Bạn đã nhận thưởng mốc Kiện Hàng này trong tuần rồi!' };
  }
  if (!targetState.sandboxMode && crate.contributedPoints < def.target) {
    return {
      ok: false,
      msg: `Cần đạt ${def.target} điểm đóng góp cộng đồng (hiện có ${crate.contributedPoints}/${def.target})!`,
    };
  }
  crate.claimedMilestones.push(step);
  targetState.galleons += def.rewardSickle;
  social.friendshipTokens += def.rewardTokens;
  const extras: string[] = [`+${def.rewardSickle} Sickle`, `+${def.rewardTokens} 🍀`];
  if (def.rewardCompost) {
    targetState.herbalCompost = (targetState.herbalCompost ?? 0) + def.rewardCompost;
    extras.push(`+${def.rewardCompost} 🌿`);
  }
  if (def.rewardSand) {
    targetState.timeSand += def.rewardSand;
    extras.push(`+${def.rewardSand} ⏳`);
  }
  if (def.rewardStars) {
    targetState.match3.stars += def.rewardStars;
    targetState.match3.totalStarsEarned += def.rewardStars;
    extras.push(`+${def.rewardStars} 🌟`);
  }
  if (sim.homeStateWhileVisiting) {
    sim.state.galleons = targetState.galleons;
    sim.state.timeSand = targetState.timeSand;
    sim.state.herbalCompost = targetState.herbalCompost;
    sim.state.match3.stars = targetState.match3.stars;
    if (sim.state.neighborSocial) {
      sim.state.neighborSocial.friendshipTokens = social.friendshipTokens;
      sim.state.neighborSocial.coopSupplyCrate = crate;
    }
  }
  sim.onRewardFly?.('galleons', def.rewardSickle);
  sim.audio.playLevelUp();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🎁 Đã mở "${def.labelVi}": ${extras.join(' · ')}!`,
  };
}

export function setPostcardFrameTheme(
  sim: ParkSimulation,
  theme: PostcardFrameThemeId
): { ok: boolean; theme: PostcardFrameThemeId } {
  const social = sim.ensureNeighborSocial();
  social.postcardTheme = theme;
  if (sim.homeStateWhileVisiting && sim.state.neighborSocial) {
    sim.state.neighborSocial.postcardTheme = theme;
  }
  sim.audio.playClick();
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, theme };
}

export function leaveMysteryGiftForNeighbor(
  sim: ParkSimulation
): { ok: boolean; msg: string } {
  if (!sim.isVisitingNeighbor || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Hãy ghé thăm vườn một người bạn qua Cổng Floo để giấu Rương Quà Bí Ẩn nhé!' };
  }
  const nb = sim.getActiveVisitingNeighbor();
  if (!nb) return { ok: false, msg: 'Không tìm thấy chủ vườn đang ghé thăm!' };
  const social = sim.ensureNeighborSocial();
  if (!Array.isArray(social.dailyMysterySentIds)) {
    social.dailyMysterySentIds = [];
  }
  if (social.dailyMysterySentIds.includes(nb.id)) {
    return { ok: false, msg: `Hôm nay bạn đã giấu Rương Quà Bất Ngờ tặng ${nb.name} rồi!` };
  }
  if (social.dailyMysterySentIds.length >= MAX_DAILY_VISITOR_MYSTERY_SENT) {
    return {
      ok: false,
      msg: `Hôm nay bạn đã gửi tối đa ${MAX_DAILY_VISITOR_MYSTERY_SENT} Rương Quà Bất Ngờ cho hội bạn bè!`,
    };
  }
  social.dailyMysterySentIds.push(nb.id);
  social.friendshipTokens += 2;
  const home = sim.homeStateWhileVisiting ?? sim.state;
  home.galleons += 18;
  home.stats.neighborHelpsDone = (home.stats.neighborHelpsDone ?? 0) + 1;
  // Bạn bè đáp lễ để lại 1 hộp quà bất ngờ ở sân vườn nhà bạn nếu còn chỗ!
  if (!Array.isArray(social.homeVisitorGifts)) {
    social.homeVisitorGifts = [];
  }
  if (social.homeVisitorGifts.length < 2) {
    social.homeVisitorGifts.push({
      id: `hvg_${Date.now()}_${nb.id}`,
      senderName: nb.name,
      senderEmoji: nb.avatarEmoji || '🦉',
      gx: 18 + (social.homeVisitorGifts.length % 2) * 2,
      gy: 24 + (social.homeVisitorGifts.length % 2),
      createdAt: Date.now(),
    });
  }
  social.activityLog.unshift({
    id: `log_mg_${Date.now()}`,
    timestamp: Date.now(),
    icon: '🎁',
    textVi: `Đã giấu Rương Quà Bất Ngờ tại vườn ${nb.name} (+2 🍀 · +18 Sickle)`,
  });
  if (social.activityLog.length > 30) social.activityLog.length = 30;
  if (sim.homeStateWhileVisiting) {
    sim.state.galleons = home.galleons;
    if (sim.state.neighborSocial) {
      sim.state.neighborSocial.dailyMysterySentIds = [...social.dailyMysterySentIds];
      sim.state.neighborSocial.friendshipTokens = social.friendshipTokens;
      sim.state.neighborSocial.homeVisitorGifts = structuredClone(social.homeVisitorGifts);
    }
  }
  sim.addXp(12);
  sim.audio.playSpell();
  sim.saveToStorage();
  sim.onToast?.(`🎁 Đã giấu Rương Quà Bất Ngờ tặng ${nb.name}! (+2 🍀 · +18 Sickle)`, '🎁');
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🎁 Đã giấu Rương Quà Bất Ngờ tặng ${nb.name}! (+2 🍀 · +18 Sickle)`,
  };
}

export function maybeSpawnHomeVisitorGift(sim: ParkSimulation, nowMs = Date.now()): void {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) return;
  const social = sim.ensureNeighborSocial();
  if (!Array.isArray(social.homeVisitorGifts)) {
    social.homeVisitorGifts = [];
  }
  if (social.homeVisitorGifts.length >= 1) return;
  if (social.neighbors.length === 0) return;
  // Khởi tạo 1 hộp quà bạn bè ghé thăm đầu ngày nếu chưa nhặt
  const pick = social.neighbors[nowMs % social.neighbors.length];
  if (!pick) return;
  const giftKey = `auto_hvg_${getLocalDateKey(nowMs)}`;
  if (social.activityLog.some((e) => e.id === giftKey)) return;
  social.homeVisitorGifts.push({
    id: giftKey,
    senderName: pick.name,
    senderEmoji: pick.avatarEmoji || '🦉',
    gx: 17.5,
    gy: 24.5,
    createdAt: nowMs,
  });
  social.activityLog.unshift({
    id: giftKey,
    timestamp: nowMs,
    icon: '🎁',
    textVi: `${pick.name} ghé thăm và để lại Rương Quà Bất Ngờ trước sân Hang Sóc!`,
  });
  if (social.activityLog.length > 30) social.activityLog.length = 30;
}

export function claimHomeVisitorMysteryGift(
  sim: ParkSimulation,
  giftId?: string
): { ok: boolean; msg: string; earnedSickle: number } {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) {
    return { ok: false, msg: 'Hãy về vườn nhà để mở Rương Quà Bạn Bè!', earnedSickle: 0 };
  }
  const social = sim.ensureNeighborSocial();
  const list = social.homeVisitorGifts ?? [];
  if (list.length === 0) {
    return { ok: false, msg: 'Hiện không có Rương Quà Bạn Bè nào trên sân!', earnedSickle: 0 };
  }
  const idx = giftId ? list.findIndex((g) => g.id === giftId) : 0;
  if (idx < 0) {
    return { ok: false, msg: 'Rương quà này đã được mở rồi!', earnedSickle: 0 };
  }
  const [gift] = list.splice(idx, 1);
  social.homeVisitorGifts = list;
  const earnedSickle = 26;
  sim.state.galleons += earnedSickle;
  social.friendshipTokens += 1;
  const barn = sim.ensureFarmBarn();
  const seedPool: FarmCropId[] = ['ottery_wheat', 'honey_carrot', 'garden_pumpkin', 'burrow_apple'];
  const bonusCrop = seedPool[Math.abs(gift.createdAt) % seedPool.length];
  if (!barn.seeds) barn.seeds = {};
  barn.seeds[bonusCrop] = (barn.seeds[bonusCrop] ?? 0) + 1;
  sim.addXp(10);
  sim.spawnFloatingText(gift.gx, gift.gy, `+${earnedSickle} Sickle · +1 🍀`, '#fde68a');
  sim.onRewardFly?.('galleons', earnedSickle, gift.gx, gift.gy);
  sim.audio.playCoinChime();
  const msg = `🎁 Quà từ ${gift.senderName}: +${earnedSickle} Sickle · +1 🍀 · +1 hạt ${FARM_CROPS[bonusCrop].name}!`;
  sim.onToast?.(msg, '🎁');
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg, earnedSickle };
}

export function ensureSeasonalFestivalState(state: GameState): SeasonalFestivalProgressState {
  if (!state.seasonalFestivalState) {
    state.seasonalFestivalState = {
      claimedTaskIds: [],
    };
  }
  if (!Array.isArray(state.seasonalFestivalState.claimedTaskIds)) {
    state.seasonalFestivalState.claimedTaskIds = [];
  }
  return state.seasonalFestivalState;
}

export function getActiveSeasonalFestivalDef(sim: ParkSimulation, now = new Date()): SeasonalFestivalDef | null {
  const fest = sim.getActiveFestival(now);
  if (fest === 'lunar_tet' || fest === 'mid_autumn' || fest === 'halloween' || fest === 'christmas') {
    return SEASONAL_FESTIVAL_DEFS[fest];
  }
  return null;
}

export function getSeasonalFestivalTaskProgress(sim: ParkSimulation, taskId: string): number {
  const st = sim.homeStateWhileVisiting ?? sim.state;
  const barn = sim.ensureFarmBarn();
  switch (taskId) {
    case 'tet_harvest_12':
      return st.stats.farmHarvestsCount ?? 0;
    case 'tet_orders_3':
      return (st.stats.cargoTrainsSent ?? 0) + (barn.ordersDelivered ?? 0);
    case 'tet_social_2': {
      const giftedCount = Object.values(st.retention?.npcFriendship ?? {}).filter(
        (e) => Boolean(e.lastGiftedDayKey)
      ).length;
      return (st.stats.neighborHelpsDone ?? 0) + giftedCount;
    }
    case 'mid_goods_2':
    case 'xmas_artisan_3': {
      let totalGoods = 0;
      for (const gid of Object.keys(FARM_GOODS) as FarmGoodId[]) {
        totalGoods += barn.goods[gid] ?? 0;
      }
      return totalGoods;
    }
    case 'mid_quiz_5':
      return Object.values(st.languageQuiz?.profiles ?? {}).reduce(
        (sum, p) => sum + (p?.totalCorrect ?? 0),
        0
      );
    case 'mid_stars_2':
      return st.buildings.filter((b) => (b.stars ?? 1) >= 2).length;
    case 'hal_pumpkin_4':
      return (
        (barn.crops.garden_pumpkin ?? 0) +
        (barn.crops.glow_mushroom ?? 0) +
        (st.cropMastery?.garden_pumpkin ?? 0)
      );
    case 'hal_minigame_2':
      return st.stats.minigamesWon ?? 0;
    case 'hal_creatures_3':
      return st.stats.creaturesFed ?? 0;
    case 'xmas_harvest_15':
      return st.stats.farmHarvestsCount ?? 0;
    case 'xmas_upgrade_3':
      return st.stats.starUpgradesDone ?? 0;
    default:
      return 0;
  }
}

export function claimSeasonalFestivalTask(
  sim: ParkSimulation,
  taskId: string
): { ok: boolean; msg: string } {
  if (sim.isHeadmasterPreview || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Hãy về vườn nhà để nhận quà Lễ Hội Bốn Mùa!' };
  }
  const targetState = sim.homeStateWhileVisiting ?? sim.state;
  const prog = ensureSeasonalFestivalState(targetState);
  if (prog.claimedTaskIds.includes(taskId)) {
    return { ok: false, msg: 'Bạn đã nhận phần thưởng nhiệm vụ lễ hội này rồi!' };
  }
  let foundTask: SeasonalFestivalTaskDef | undefined;
  for (const def of Object.values(SEASONAL_FESTIVAL_DEFS)) {
    const t = def.tasks.find((x) => x.id === taskId);
    if (t) {
      foundTask = t;
      break;
    }
  }
  if (!foundTask) return { ok: false, msg: 'Không tìm thấy nhiệm vụ lễ hội!' };
  const cur = getSeasonalFestivalTaskProgress(sim, taskId);
  if (!targetState.sandboxMode && cur < foundTask.target) {
    return {
      ok: false,
      msg: `Tiến độ chưa đủ (${cur}/${foundTask.target}) — hãy hoàn thành thêm nhé!`,
    };
  }
  prog.claimedTaskIds.push(taskId);
  targetState.galleons += foundTask.rewardSickle;
  const parts = [`+${foundTask.rewardSickle} Sickle`];
  if (foundTask.rewardCompost) {
    targetState.herbalCompost = (targetState.herbalCompost ?? 0) + foundTask.rewardCompost;
    parts.push(`+${foundTask.rewardCompost} 🌿`);
  }
  if (foundTask.rewardMorningDew) {
    targetState.morningDewPhials = (targetState.morningDewPhials ?? 0) + foundTask.rewardMorningDew;
    parts.push(`+${foundTask.rewardMorningDew} 🧪`);
  }
  if (foundTask.rewardSand) {
    targetState.timeSand += foundTask.rewardSand;
    parts.push(`+${foundTask.rewardSand} ⏳`);
  }
  if (foundTask.rewardTokens) {
    const social = sim.ensureNeighborSocial();
    social.friendshipTokens += foundTask.rewardTokens;
    parts.push(`+${foundTask.rewardTokens} 🍀`);
  }
  if (foundTask.rewardStars) {
    targetState.match3.stars += foundTask.rewardStars;
    targetState.match3.totalStarsEarned += foundTask.rewardStars;
    parts.push(`+${foundTask.rewardStars} 🌟`);
  }
  sim.addHarvestFeastPoints(20);
  sim.onRewardFly?.('galleons', foundTask.rewardSickle);
  sim.audio.playLevelUp();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🏮 Đã nhận thưởng "${foundTask.titleVi}": ${parts.join(' · ')}!`,
  };
}

export function claimDailyTetLiXi(sim: ParkSimulation, nowMs = Date.now()): { ok: boolean; msg: string } {
  if (sim.isHeadmasterPreview || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Hãy về vườn nhà để nhận Lộc Đầu Xuân!' };
  }
  const fest = sim.getActiveFestival(new Date(nowMs));
  if (fest !== 'lunar_tet' && !sim.state.sandboxMode) {
    return { ok: false, msg: 'Phong Bao Lộc Xuân mở khi Thung Lũng đang đón Lễ Hội Tết Nguyên Đán!' };
  }
  const targetState = sim.homeStateWhileVisiting ?? sim.state;
  const prog = ensureSeasonalFestivalState(targetState);
  const todayKey = getLocalDateKey(nowMs);
  if (prog.lastLiXiClaimDayKey === todayKey) {
    return { ok: false, msg: 'Hôm nay bạn đã nhận Lộc Đầu Xuân của Bà Molly rồi — mai ghé lại nhé!' };
  }
  prog.lastLiXiClaimDayKey = todayKey;
  const rewardSickle = 68;
  targetState.galleons += rewardSickle;
  targetState.morningDewPhials = (targetState.morningDewPhials ?? 0) + 1;
  const social = sim.ensureNeighborSocial();
  social.friendshipTokens += 1;
  sim.addXp(15);
  sim.onRewardFly?.('galleons', rewardSickle);
  sim.audio.playLevelUp();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🏮 Lộc Đầu Xuân Bà Molly trao tặng: +${rewardSickle} Sickle · +1 🍀 · +1 🧪 Sương Mai!`,
  };
}

export function ensureCollectionAlmanacState(state: GameState): CollectionAlmanacState {
  if (!state.almanacState) {
    state.almanacState = {
      claimedChapters: [],
      claimedGrandTrophy: false,
    };
  }
  if (!Array.isArray(state.almanacState.claimedChapters)) {
    state.almanacState.claimedChapters = [];
  }
  return state.almanacState;
}

export function evaluateCollectionAlmanac(sim: ParkSimulation): {
  chapters: AlmanacChapterSummary[];
  claimableCount: number;
  allChaptersClaimed: boolean;
  grandTrophyClaimed: boolean;
} {
  const st = sim.homeStateWhileVisiting ?? sim.state;
  const barn = sim.ensureFarmBarn();
  const alm = ensureCollectionAlmanacState(st);
  const ret = ensureRetentionState(st);

  // 1. Crops chapter
  const cropIds = Object.keys(FARM_CROPS) as FarmCropId[];
  const cropEntries = cropIds.map((cid) => {
    const unlocked =
      (st.cropMastery?.[cid] ?? 0) > 0 ||
      (barn.crops[cid] ?? 0) > 0 ||
      st.buildings.some((b) => b.cropId === cid);
    return { nameVi: FARM_CROPS[cid].name, icon: FARM_CROPS[cid].emoji, unlocked };
  });
  const cropsDiscovered = cropEntries.filter((e) => e.unlocked).length;
  const cropsTarget = Math.min(cropIds.length, 6);
  const cropsClaimed = alm.claimedChapters.includes('crops');

  // 2. Artisan & Workshop chapter
  const goodIds = Object.keys(FARM_GOODS) as FarmGoodId[];
  const artisanEntries = [
    ...goodIds.map((gid) => ({
      nameVi: FARM_GOODS[gid].name,
      icon: FARM_GOODS[gid].emoji,
      unlocked: (barn.goods[gid] ?? 0) > 0,
    })),
    ...CRAFT_RECIPES.map((cr) => ({
      nameVi: cr.name,
      icon: cr.emoji,
      unlocked: (st.supply?.goods?.[cr.id] ?? 0) > 0,
    })),
  ];
  const artisanDiscovered = artisanEntries.filter((e) => e.unlocked).length;
  const artisanTarget = Math.min(artisanEntries.length, 4);
  const artisanClaimed = alm.claimedChapters.includes('artisan');

  // 3. Creatures & Pasture chapter
  const pastureIds = Object.keys(PASTURE_ANIMALS) as Array<keyof typeof PASTURE_ANIMALS>;
  const creatureEntries = [
    ...pastureIds.map((pid) => ({
      nameVi: PASTURE_ANIMALS[pid].name,
      icon: PASTURE_ANIMALS[pid].emoji,
      unlocked:
        st.buildings.some((b) => b.pastureAnimalId === pid) ||
        (barn.goods[PASTURE_ANIMALS[pid].goodId] ?? 0) > 0,
    })),
    ...(st.suitcase?.discoveredMorphs ?? []).map((mid) => ({
      nameVi: `Biến thể ${mid}`,
      icon: '🐾',
      unlocked: true,
    })),
  ];
  const creaturesDiscovered = creatureEntries.filter((e) => e.unlocked).length;
  const creaturesTarget = 3;
  const creaturesClaimed = alm.claimedChapters.includes('creatures');

  // 4. Villager Keepsakes & Wizard Cards chapter
  const villagerIds = Object.keys(VILLAGER_AFFECTION_GIFT_META) as ValleyVillagerId[];
  const keepsakeEntries = [
    ...villagerIds.map((vid) => {
      const meta = VILLAGER_AFFECTION_GIFT_META[vid];
      const unlocked = Boolean(ret.npcFriendship[vid]?.claimedMilestones?.includes(5));
      return { nameVi: meta.keepsakeNameVi, icon: '💝', unlocked };
    }),
    ...WIZARD_CARDS.map((wc) => ({
      nameVi: wc.name,
      icon: '📜',
      unlocked: (st.collectedCards?.[wc.id] ?? 0) > 0,
    })),
  ];
  const keepsakesDiscovered = keepsakeEntries.filter((e) => e.unlocked).length;
  const keepsakesTarget = 3;
  const keepsakesClaimed = alm.claimedChapters.includes('keepsakes');

  const chapters: AlmanacChapterSummary[] = [
    {
      id: 'crops',
      titleVi: 'Chương I · Thảo Mộc & Mùa Vụ',
      subtitleVi: `Đã thu thập ${cropsDiscovered}/${cropIds.length} giống cây (Mốc chương: ${cropsTarget})`,
      icon: '🌾',
      discoveredCount: cropsDiscovered,
      totalCount: cropIds.length,
      milestoneTarget: cropsTarget,
      claimed: cropsClaimed,
      canClaim: !cropsClaimed && (st.sandboxMode || cropsDiscovered >= cropsTarget),
      rewardLabelVi: '+120 Sickle · +3 🌿 Phân Ủ · +1 🌟',
      sampleEntries: cropEntries.slice(0, 12),
    },
    {
      id: 'artisan',
      titleVi: 'Chương II · Đặc Sản & Cổ Vật',
      subtitleVi: `Đã chế tác ${artisanDiscovered}/${artisanEntries.length} món (Mốc chương: ${artisanTarget})`,
      icon: '🥧',
      discoveredCount: artisanDiscovered,
      totalCount: artisanEntries.length,
      milestoneTarget: artisanTarget,
      claimed: artisanClaimed,
      canClaim: !artisanClaimed && (st.sandboxMode || artisanDiscovered >= artisanTarget),
      rewardLabelVi: '+135 Sickle · +2 🧪 Sương Mai · +1 🌟',
      sampleEntries: artisanEntries.slice(0, 12),
    },
    {
      id: 'creatures',
      titleVi: 'Chương III · Sinh Vật & Đồng Cỏ',
      subtitleVi: `Đã ghi nhận ${creaturesDiscovered} loài & biến thể (Mốc chương: ${creaturesTarget})`,
      icon: '🐾',
      discoveredCount: creaturesDiscovered,
      totalCount: Math.max(pastureIds.length + 4, creaturesDiscovered),
      milestoneTarget: creaturesTarget,
      claimed: creaturesClaimed,
      canClaim: !creaturesClaimed && (st.sandboxMode || creaturesDiscovered >= creaturesTarget),
      rewardLabelVi: '+145 Sickle · +2 ⏳ Cát · +1 🌟',
      sampleEntries: creatureEntries.slice(0, 12),
    },
    {
      id: 'keepsakes',
      titleVi: 'Chương IV · Kỷ Vật & Thẻ Phù Thủy',
      subtitleVi: `Đã lưu giữ ${keepsakesDiscovered}/${keepsakeEntries.length} kỷ vật (Mốc chương: ${keepsakesTarget})`,
      icon: '💝',
      discoveredCount: keepsakesDiscovered,
      totalCount: keepsakeEntries.length,
      milestoneTarget: keepsakesTarget,
      claimed: keepsakesClaimed,
      canClaim: !keepsakesClaimed && (st.sandboxMode || keepsakesDiscovered >= keepsakesTarget),
      rewardLabelVi: '+160 Sickle · +2 🍀 · +1 🌟',
      sampleEntries: keepsakeEntries.slice(0, 12),
    },
  ];

  const allChaptersClaimed = chapters.every((c) => c.claimed);
  const grandTrophyClaimed = Boolean(alm.claimedGrandTrophy);
  const claimableCount =
    chapters.filter((c) => c.canClaim).length +
    (allChaptersClaimed && !grandTrophyClaimed ? 1 : 0);

  return {
    chapters,
    claimableCount,
    allChaptersClaimed,
    grandTrophyClaimed,
  };
}

export function claimAlmanacChapterReward(
  sim: ParkSimulation,
  chapterId: AlmanacChapterId | 'grand_trophy'
): { ok: boolean; msg: string } {
  if (sim.isHeadmasterPreview || sim.isVisitingHonorTour) {
    return { ok: false, msg: 'Hãy về vườn nhà để nhận thưởng Sổ Bách Khoa!' };
  }
  const st = sim.homeStateWhileVisiting ?? sim.state;
  const alm = ensureCollectionAlmanacState(st);
  const summary = evaluateCollectionAlmanac(sim);

  if (chapterId === 'grand_trophy') {
    if (alm.claimedGrandTrophy) {
      return { ok: false, msg: 'Bạn đã nhận Đại Cúp Học Giả Hang Sóc rồi!' };
    }
    if (!st.sandboxMode && !summary.allChaptersClaimed) {
      return { ok: false, msg: 'Hãy hoàn tất cả 4 Chương Bách Khoa trước khi nhận Đại Cúp nhé!' };
    }
    alm.claimedGrandTrophy = true;
    st.galleons += 190;
    st.match3.stars += 2;
    st.match3.totalStarsEarned += 2;
    sim.onRewardFly?.('galleons', 190);
    sim.onRewardFly?.('stars', 2);
    sim.audio.playLevelUp();
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg: '🏆 Chúc mừng Đại Học Giả Hang Sóc! Nhận +190 Sickle & +2 🌟 Sao Phép Thuật!',
    };
  }

  const ch = summary.chapters.find((c) => c.id === chapterId);
  if (!ch) return { ok: false, msg: 'Chương Bách Khoa không hợp lệ!' };
  if (ch.claimed) return { ok: false, msg: 'Chương Bách Khoa này đã được nhận thưởng!' };
  if (!ch.canClaim) {
    return {
      ok: false,
      msg: `Cần sưu tầm tối thiểu ${ch.milestoneTarget} mục (hiện có ${ch.discoveredCount}/${ch.milestoneTarget})!`,
    };
  }

  alm.claimedChapters.push(chapterId);
  let rewardSickle = 120;
  if (chapterId === 'crops') {
    rewardSickle = 120;
    st.herbalCompost = (st.herbalCompost ?? 0) + 3;
  } else if (chapterId === 'artisan') {
    rewardSickle = 135;
    st.morningDewPhials = (st.morningDewPhials ?? 0) + 2;
  } else if (chapterId === 'creatures') {
    rewardSickle = 145;
    st.timeSand += 2;
  } else if (chapterId === 'keepsakes') {
    rewardSickle = 160;
    const social = sim.ensureNeighborSocial();
    social.friendshipTokens += 2;
  }
  st.galleons += rewardSickle;
  st.match3.stars += 1;
  st.match3.totalStarsEarned += 1;
  sim.onRewardFly?.('galleons', rewardSickle);
  sim.onRewardFly?.('stars', 1);
  sim.audio.playLevelUp();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `📚 Đã hoàn thành "${ch.titleVi}": ${ch.rewardLabelVi}!`,
  };
}
